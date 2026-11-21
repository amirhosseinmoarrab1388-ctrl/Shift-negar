const el = id => document.getElementById(id);
const prefix = 'shiftStudio:v1:';
const encode = value => new TextEncoder().encode(value);
const random = length => crypto.getRandomValues(new Uint8Array(length));
const pack = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('');
const unpack = hex => Uint8Array.from(hex.match(/../g)||[], x=>parseInt(x,16));
const aes = bytes => crypto.subtle.importKey('raw',bytes,'AES-GCM',false,['encrypt','decrypt']);
const nameOf = () => el('username').value.normalize('NFKC').trim().toLowerCase();
const accountKey = name => prefix+'account:'+name;
const account = name => JSON.parse(localStorage.getItem(accountKey(name)));
let signup=false, session, initialData, writes=Promise.resolve(), busy=false;
async function passwordKey(password,salt){
 const key=await crypto.subtle.importKey('raw',encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',iterations:600000,salt:unpack(salt)},key,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function seal(key,bytes){
 const iv=random(12);
 return {iv:pack(iv),body:pack(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,bytes))};
}
function openSeal(key,record){
 return crypto.subtle.decrypt({name:'AES-GCM',iv:unpack(record.iv)},key,unpack(record.body));
}
function mode(register){
 signup=register;el('message').textContent='';el('password').value='';el('repeat').value='';
 el('roles').hidden=el('repeatBox').hidden=!register;el('repeat').required=register;
 el('loginTab').setAttribute('aria-pressed',!register);el('signupTab').setAttribute('aria-pressed',register);
 el('authTitle').textContent=register?'حسابت رو بساز.':'خوش برگشتی.';
 el('authHint').textContent=register?'نوع حساب و نام کاربری را انتخاب کن. ایمیل لازم نیست.':'برای دیدن ساعت‌های کاری، وارد حساب خودت شو.';
 el('password').autocomplete=register?'new-password':'current-password';el('password').minLength=register?8:1;
 el('submitAccount').textContent=register?'ساخت حساب':'ورود به حساب';
}
el('loginTab').onclick=()=>mode(false);el('signupTab').onclick=()=>mode(true);
async function enter(s,seed){
 session=s;initialData=seed;
 const script=document.createElement('script');script.src='./app.js';
 script.onload=()=>{el('gate').hidden=true;el('board').hidden=false;el('identity').textContent=s.name+' · '+(s.role==='manager'?'مدیر':'پرسنل');showTab('home');el('menu').hidden=false;startTeam();initPrefs();window.scrollTo(0,0)};
 document.body.append(script);
}
let savedView, openedRecord;
function persist(book){
 const local=structuredClone(book),key=prefix+'book:'+session.name;
 writes=writes.catch(()=>{}).then(async()=>{
  for(;;){
   const record=localStorage.getItem(key);
   const remote=record===openedRecord?savedView:normalize(record?JSON.parse(new TextDecoder().decode(await openSeal(session.key,JSON.parse(record)))):{});
   let merged;
   try{merged=mergeBooks(savedView,local,remote)}catch(error){
    alert('همین رکورد در تب دیگری تغییر کرده است. نسخهٔ دیگر حفظ شد. برای دیدن آخرین اطلاعات صفحه را دوباره باز کن.');throw error;
   }
   const encoded=JSON.stringify(await seal(session.key,encode(JSON.stringify(merged))));
   if(!await commitIfCurrent(key,record,encoded))continue;
   if(equalBookValue(data,local)){
    data=merged;savedView=structuredClone(merged);openedRecord=encoded;render();renderHistory();
   }else{
    savedView=local;openedRecord=undefined;
   }
   queueActivity();return;
  }
 }).catch(error=>{if(error.message!=='concurrent-edit')alert('ذخیره انجام نشد. از منوی پشتیبان‌گیری یک پشتیبان بگیر.');throw error});
}
async function unlock(a,name,raw){
 const key=await aes(raw),record=localStorage.getItem(prefix+'book:'+name);
 let seed=record?JSON.parse(new TextDecoder().decode(await openSeal(key,JSON.parse(record)))):{};
 if(!record&&a.role==='manager'&&localStorage.getItem('amoParviz_v1')&&!localStorage.getItem(prefix+'migrated')&&confirm('سوابق نسخه قبلی این مرورگر به حساب شما کپی شود؟')){
 seed=JSON.parse(localStorage.getItem('amoParviz_v1'));
 localStorage.setItem(prefix+'book:'+name,JSON.stringify(await seal(key,encode(JSON.stringify(seed)))));
 localStorage.setItem(prefix+'migrated','1');
 }
 openedRecord=record;await enter({name,role:a.role,key,raw},seed);
}
async function run(action){
 if(busy)return;busy=true;
 try{await action()}catch(err){el('message').textContent=err.userMessage||'عملیات انجام نشد. نام کاربری و رمز را بررسی کن یا دوباره تلاش کن.'}finally{busy=false}
}
function fail(message){throw Object.assign(Error(message),{userMessage:message})}
el('accountForm').onsubmit=e=>{e.preventDefault();run(async()=>{
 const name=nameOf(),pw=el('password').value;
 if(!crypto.subtle)fail('برای ورود، سایت را با HTTPS باز کن.');
 if(!name)fail('یک نام کاربری وارد کن.');
 let a=account(name);
 if(signup){
 if(a)fail('این نام کاربری قبلاً ثبت شده است.');
 if(pw!==el('repeat').value)fail('رمز عبور و تکرار آن یکسان نیستند.');
 const salt=pack(random(16)),role=document.querySelector('[name=role]:checked').value;
 const wrapped=await seal(await passwordKey(pw,salt),random(32));
 if(account(name))fail('این نام کاربری قبلاً ثبت شده است.');
 localStorage.setItem(accountKey(name),JSON.stringify({salt,role,wrapped}));mode(false);el('message').textContent='حساب ساخته شد. حالا با رمز خودت وارد شو.';el('password').focus();return;
 }
 if(!a)fail('نام کاربری یا رمز عبور درست نیست.');
 let raw;try{raw=await openSeal(await passwordKey(pw,a.salt),a.wrapped)}catch{fail('نام کاربری یا رمز عبور درست نیست.')}
 el('password').value='';await unlock(a,name,raw);
 })};
async function logout(){try{await writes}finally{location.reload()}}
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
