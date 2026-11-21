const prefEl=id=>document.getElementById(id);
const prefKey=()=>prefix+'preferences:'+session.name;
let appearance={},sharing={watch:[]},prefsReady=false,lastSent='',sending=Promise.resolve(),readGeneration=0;
const fontNames=[['وزیرمتن','Vazir'],['کوفی','Kufi'],['نسخ','Naskh']];
function storeAppearance(){localStorage.setItem(prefKey(),JSON.stringify(appearance))}
function applyAppearance(){
 const index=fontNames[appearance.font]?appearance.font:0;
 const size=Math.min(22,Math.max(14,Number(appearance.size)||16));
 document.documentElement.style.setProperty('--chosen-font',fontNames[index][1]);document.documentElement.style.setProperty('--chosen-size',size+'px');
 prefEl('fontScale').value=size;prefEl('fontOutput').textContent=numberFa(size);
 const display=appearance.alias||session.name;prefEl('prefsName').textContent=display;prefEl('avatarLetter').textContent=display.slice(0,1);prefEl('displayAlias').value=appearance.alias||'';
 prefEl('prefsRole').textContent=(session.role==='manager'?'مدیر':'پرسنل')+' · '+session.name;
 [...prefEl('fontWheel').children].forEach((b,i)=>b.setAttribute('aria-pressed',i===index));
}
async function initPrefs(){
 appearance=JSON.parse(localStorage.getItem(prefKey())||'{}');
 prefEl('workPrefs').hidden=session.role==='staff';
 const wheel=prefEl('fontWheel');
 fontNames.forEach(([name,font],i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.style.fontFamily=font;b.onclick=()=>{wheel.scrollTop=i*40;appearance.font=i;storeAppearance();applyAppearance()};wheel.append(b)});
 wheel.parentNode.closest('details').addEventListener('toggle',e=>{if(e.target.open)wheel.scrollTop=(appearance.font||0)*40});
 wheel.addEventListener('scroll',()=>{if(!wheel.clientHeight)return;const i=Math.min(fontNames.length-1,Math.max(0,Math.round(wheel.scrollTop/40)));if(appearance.font!==i){appearance.font=i;storeAppearance();applyAppearance()}});
 prefEl('fontScale').oninput=e=>{appearance.size=+e.target.value;storeAppearance();applyAppearance()};
 prefEl('saveAlias').onclick=()=>{appearance.alias=prefEl('displayAlias').value.trim();storeAppearance();applyAppearance();info('نام نمایشی ذخیره شد.')};
 applyAppearance();
 try{const cached=localStorage.getItem(prefKey()+':access');if(cached)sharing=JSON.parse(new TextDecoder().decode(await openSeal(session.key,JSON.parse(cached))));prefsReady=true;queueActivity()}catch{info('تنظیمات اشتراک خوانده نشد.')}
 setInterval(()=>{if(!document.hidden&&prefsReady){if(sharing.source)queueActivity();if(!prefEl('activity').classList.contains('hidden'))readActivity()}},4000);
}
async function saveAccess(){localStorage.setItem(prefKey()+':access',JSON.stringify(await seal(session.key,encode(JSON.stringify(sharing)))))}
async function feed(op,id,key,extra={}){
 const r=await fetch('./api/activity',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({op,id,...extra})});
 const v=await r.json();if(!r.ok)throw Error(v.error||'ارتباط برقرار نشد.');return v;
}
function queueActivity(){
 if(!prefsReady||!sharing.source)return Promise.resolve();
 const send=async()=>{
  const src=sharing.source;if(!src)return;
  if(teamKey&&!teamView)return;
  const rows=myHistory().map(s=>({date:s.date,start:s.start,end:s.end,minutes:shiftCalc(s).minutes})).sort((a,b)=>b.date.localeCompare(a.date)||b.start.localeCompare(a.start));
  const snapshot=JSON.stringify(rows);if(snapshot===lastSent)return;
  await feed('sync',src.id,src.owner,{reader:src.reader,rows,name:session.name});lastSent=snapshot;if(!src.published){src.published=true;await saveAccess();if(!prefEl('activity').classList.contains('hidden'))drawActivity()}
 };
 sending=sending.catch(()=>{}).then(send);sending.catch(()=>info('همگام‌سازی فعالیت در انتظار اتصال است.'));return sending;
}
async function readActivity(){
 if(session.role!=='manager')return;
 const generation=++readGeneration,box=prefEl('observed');
 const cards=await Promise.all(sharing.watch.map(async w=>{
  let body;try{const v=await feed('read',w.id,w.reader);body='<h3>'+esc(v.name)+'</h3>'+v.rows.map(r=>'<p>'+jalali(r.date)+' · <bdi>'+esc(timeLabel(r.start))+'</bdi> تا <bdi>'+esc(timeLabel(r.end))+'</bdi> · '+digits(Math.round(r.minutes))+' دقیقه</p>').join('')+(v.rows.length?'':'<p>هنوز شیفتی ثبت نشده.</p>')}catch{body='<p>دسترسی قطع است یا اتصال برقرار نیست.</p>'}
  return '<article class="teamRow">'+body+'<button data-forget="'+esc(w.id)+'">برداشتن از فهرست من</button></article>';
 }));
 if(generation===readGeneration)box.innerHTML=cards.join('');
}
function drawActivity(){
 const box=prefEl('shareAccess');
 if(session.role==='manager'){
 box.innerHTML='<form id="addObserver"><label>رمز اشتراک مشاهدهٔ پرسنل<input id="watchCode" dir="ltr" required autocomplete="off"></label><button>افزودن به فهرست مشاهده</button></form>';readActivity();return
 }
 box.innerHTML='<p>با فعال‌کردن اشتراک، دارندهٔ رمز می‌تواند تاریخ، ساعت ورود و خروج و مدت کار شیفت‌های قبلی و جدیدت را ببیند.</p>'+(sharing.source&&!sharing.source.published?'<p>در انتظار ارسال سوابق و دریافت رمز مشاهده…</p>':sharing.source?'<label>رمز اشتراک مشاهده<input id="shareCode" dir="ltr" readonly></label><button id="copyView">کپی رمز اشتراک</button><button id="stopView">قطع دسترسی</button>':'<button id="startView">ساخت رمز اشتراک مشاهده</button>');
 if(prefEl('shareCode'))prefEl('shareCode').value=sharing.source.id+'.'+sharing.source.reader;
}
document.addEventListener('click',async e=>{
 const id=e.target.id;
 try{
 if(id==='startView'&&prefsReady&&!sharing.source){sharing.source={id:crypto.randomUUID(),owner:pack(random(24)),reader:pack(random(24))};await saveAccess();await queueActivity();drawActivity()}
 if(id==='stopView'&&sharing.source){await sending.catch(()=>{});const s=sharing.source;await feed('stop',s.id,s.owner);delete sharing.source;lastSent='';await saveAccess();drawActivity()}
 if(id==='copyView'){await navigator.clipboard.writeText(prefEl('shareCode').value);info('رمز مشاهده کپی شد.')}
 if(e.target.dataset.forget){sharing.watch=sharing.watch.filter(w=>w.id!==e.target.dataset.forget);await saveAccess();readActivity()}
 }catch(err){info(err.message);drawActivity()}
});
document.addEventListener('submit',async e=>{
 const id=e.target.id;if(!['addObserver','changePassword'].includes(id))return;e.preventDefault();
 try{
 if(id==='addObserver'){
 const [key,reader]=prefEl('watchCode').value.trim().split('.');if(!key||!reader)throw Error('رمز اشتراک کامل را وارد کن.');
 await feed('read',key,reader);sharing.watch=sharing.watch.filter(w=>w.id!==key);sharing.watch.push({id:key,reader});await saveAccess();drawActivity();return
 }
 const a=account(session.name),next=prefEl('newPw').value;
 if(next!==prefEl('confirmPw').value)throw Error('تکرار رمز یکسان نیست.');
 const raw=await openSeal(await passwordKey(prefEl('oldPw').value,a.salt),a.wrapped);
 const salt=pack(random(16));a.wrapped=await seal(await passwordKey(next,salt),raw);a.salt=salt;
 localStorage.setItem(accountKey(session.name),JSON.stringify(a));e.target.reset();info('رمز ورود تغییر کرد.');
 }catch(err){info(err.name==='OperationError'?'رمز فعلی درست نیست.':err.message)}
});
