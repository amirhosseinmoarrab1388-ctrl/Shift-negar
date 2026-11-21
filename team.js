let teamView=null,teamKey=null,teamEditVersion,loadingTeam=false,pollTimer,mutation=false,refreshGeneration=0;
const teamSlot=()=>prefix+'team:'+session.name;
const teamLinked=()=>!!(teamView||teamKey||localStorage.getItem(teamSlot()));
const mine=()=>teamView?.shifts.filter(s=>s.owner===teamView.me)||[];
const myHistory=()=>[...data.shifts,...mine()];
const approvedMine=()=>[...data.shifts,...mine().filter(s=>s.status==='approved')];
const myPayments=()=>[...data.payments,...(teamView?.payments.filter(p=>p.owner===teamView.me)||[])];
const findShift=id=>teamView?.shifts.find(s=>s.id===id)||data.shifts.find(s=>s.id===id);
const statusText=s=>'ثبت‌شده';
const teamCalc=s=>{const minutes=Math.max(0,s.elapsedMinutes-s.breakMin),hours=minutes/60;return {minutes,hours,wage:s.status==='approved'?Math.round(hours*s.rate*10)/10:0}};
const T=id=>document.getElementById(id);
function info(text){T('teamNotice').hidden=!text;T('teamNotice').textContent=text}
async function timerRecordId(time){
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',encode(session.name+'|'+time))),n=>n.toString(16).padStart(2,'0')).join('');
 return [hash.slice(0,8),hash.slice(8,12),hash.slice(12,16),hash.slice(16,20),hash.slice(20,32)].join('-');
}
async function teamRequest(op,body={}){
 if(!teamKey)throw Error('ابتدا از منوی تیم، اتصال را برقرار کن.');
 const r=await fetch('./api/team',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+teamKey.secret},body:JSON.stringify({...body,op,team:teamKey.team,actor:teamKey.actor})});
 let v;try{v=await r.json()}catch{throw Error('سرویس تیم روی این میزبان در دسترس نیست.')}
 if(!r.ok)throw Error(v.error||'ارتباط با تیم برقرار نشد.');return v;
}
function updateTeam(v,force=false){
 const changed=JSON.stringify(v)!==JSON.stringify(teamView);teamView=v;
 if(changed||force){render();renderHistory();}
 T('shiftPolicy').textContent='اشتراک شیفت‌ها از منوی مشاهدهٔ فعالیت قابل کنترل است.';queueActivity();
}
async function actTeam(op,body){
 if(mutation)return false;mutation=true;++refreshGeneration;
 try{updateTeam(await teamRequest(op,body),true);info('');return true}
 catch(e){info(e.message);return false}finally{mutation=false}
}
async function refreshTeam(){
 if(!teamKey||mutation||document.hidden||loadingTeam)return;loadingTeam=true;
 const generation=refreshGeneration;
 try{const v=await teamRequest('state');if(generation===refreshGeneration)updateTeam(v)}catch(e){info(e.message)}finally{loadingTeam=false}
}
async function saveTeamShift(s){
 if(data.shifts.some(x=>x.id===s.id))return false;
 if(!teamLinked())return false;
 if(!T('editId').value)T('editId').value=s.id;
 if(await actTeam('shift',{...s,version:teamEditVersion})){resetShiftForm();showTab('history')}
 return true;
}
async function startTeam(){
 const staff=session.role==='staff';
 document.querySelectorAll('nav [data-tab="payments"],nav [data-tab="bonuses"]').forEach(b=>b.hidden=staff);
 for(const id of ['settingsForm','storeForm']){T(id).hidden=staff;T(id).previousElementSibling.hidden=staff}
 const saved=localStorage.getItem(teamSlot());
 if(saved){try{teamKey=JSON.parse(new TextDecoder().decode(await openSeal(session.key,JSON.parse(saved))));await refreshTeam()}catch{info('اتصال حساب تیمی خوانده نشد.')}}
 else T('shiftPolicy').textContent='شیفت در دفتر خودت ثبت می‌شود.';
 pollTimer=setInterval(refreshTeam,4000);window.addEventListener('focus',refreshTeam);
}
