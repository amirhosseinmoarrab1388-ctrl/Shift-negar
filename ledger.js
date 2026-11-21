const equalBookValue=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function mergeField(before,after,latest){
 if(equalBookValue(before,after))return latest;
 if(!equalBookValue(latest,before)&&!equalBookValue(latest,after))throw Error('concurrent-edit');
 return after;
}
function mergeBooks(before,after,latest){
 const merged={...latest};
 for(const key of ['shifts','payments','bonuses']){
  const original=new Map(before[key].map(row=>[row.id,row]));
  const edited=new Map(after[key].map(row=>[row.id,row]));
  const rows=new Map(latest[key].map(row=>[row.id,row]));
  for(const id of new Set([...original.keys(),...edited.keys()])){
   const next=mergeField(original.get(id),edited.get(id),rows.get(id));
   if(next===undefined)rows.delete(id);else rows.set(id,next);
  }
  merged[key]=[...rows.values()];
 }
 merged.settings={...latest.settings};
 for(const key of Object.keys(after.settings))merged.settings[key]=mergeField(before.settings[key],after.settings[key],latest.settings[key]);
 merged.runningSince=mergeField(before.runningSince,after.runningSince,latest.runningSince);
 return merged;
}
let lockDatabase;
function commitIfCurrent(key,expected,value){
 const commit=()=>{
  if(localStorage.getItem(key)!==expected)return false;
  localStorage.setItem(key,value);return true;
 };
 if(navigator.locks)return navigator.locks.request(key,commit);
 // A read-write transaction serializes the synchronous compare/write on older browsers.
 lockDatabase??=new Promise((resolve,reject)=>{
  const request=indexedDB.open('shift-studio-write-lock',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('locks');
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 });
 return lockDatabase.then(db=>new Promise((resolve,reject)=>{
  const tx=db.transaction('locks','readwrite');let result;
  tx.objectStore('locks').get(key).onsuccess=()=>{try{result=commit()}catch{tx.abort()}};
  tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(tx.error||Error('write failed'));
 }));
}
