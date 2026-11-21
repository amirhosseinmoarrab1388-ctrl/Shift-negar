const $=id=>document.getElementById(id);

const defaults={shifts:[],payments:[],bonuses:[],settings:{mode:'hourly',rate:50000,normalHours:8,overtime:1.4,storeName:'',managerName:'',staffName:''},welcome:{role:'manager',person:''}};
function ascii(value){
 return String(value??'').trim().replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632));
}
function clock(value){
 const m=/^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(ascii(value));
 return m&&+m[1]<24&&+m[2]<60?m[1].padStart(2,'0')+':'+m[2]:'';
}
function normalize(v){
 const book=structuredClone(defaults);
 book.runningSince=Number.isFinite(v.runningSince)&&v.runningSince>0?v.runningSince:null;
 Object.assign(book.settings,v.settings||{});
 for(const key of ['shifts','payments','bonuses']){
  const seen=new Set();
  book[key]=(Array.isArray(v[key])?v[key]:[]).filter(x=>x&&typeof x==='object').map(x=>{
   const id=/^[a-zA-Z0-9_-]+$/.test(x.id||'')&&!seen.has(x.id)?String(x.id):crypto.randomUUID();seen.add(id);
   return {...x,id,date:ascii(x.date),...(key==='shifts'?{start:clock(x.start??x.startTime),end:clock(x.end??x.endTime),breakMin:Math.max(0,Number(ascii(x.breakMin))||0)}:{amount:Number(ascii(x.amount))||0})};
  });
 }
 return book;
}
let data=normalize(initialData);savedView=structuredClone(data);
function save(){persist(data);render()}
function digits(n){const v=Number(n);return Number.isFinite(v)?v.toLocaleString('fa-IR'):'—'}
function money(n){return digits(toRials(n))+' ریال'}
function timeLabel(value){return value?value.replace(/\d/g,c=>'۰۱۲۳۴۵۶۷۸۹'[c]):'—'}
function jalali(iso){if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return '—';const d=new Date(iso+'T12:00:00');return Number.isFinite(+d)?new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'long',day:'numeric'}).format(d):'—'}
function todayISO(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function mins(t){const [h,m]=t.split(':').map(Number);return h*60+m}
function shiftEndDays(row){
 if(Number.isInteger(row.endDays)&&row.endDays>=0)return row.endDays;
 const delta=mins(row.end)-mins(row.start);
 if(Number.isFinite(row.elapsedMinutes))return Math.max(0,Math.round((row.elapsedMinutes-delta)/1440));
 return delta<0?1:0;
}
function formDuration(row){
 const old=findShift($('editId').value);
 row.endDays=$('endDays').value===''?shiftEndDays(row):Number($('endDays').value);
 if(old&&Number.isFinite(old.elapsedMinutes)&&old.start===row.start&&old.end===row.end&&shiftEndDays(old)===row.endDays)return old.elapsedMinutes;
 return mins(row.end)-mins(row.start)+1440*row.endDays;
}
function shiftCalc(s){if(s.owner)return teamCalc(s);if(!clock(s.start)||!clock(s.end))return {hours:0,wage:0,minutes:0};let duration=mins(s.end)-mins(s.start)+1440*shiftEndDays(s);if(Number.isFinite(s.elapsedMinutes)&&s.elapsedMinutes>=0)duration=s.elapsedMinutes;duration=Math.max(0,duration-(+s.breakMin||0));const hours=duration/60, normal=+data.settings.normalHours||8, rate=+data.settings.rate||0;let wage;if(data.settings.mode==='daily'){const base=rate*Math.min(hours,normal)/normal;wage=base+Math.max(0,hours-normal)*(rate/normal)*(+data.settings.overtime||1)}else{wage=Math.min(hours,normal)*rate+Math.max(0,hours-normal)*rate*(+data.settings.overtime||1)}return {hours,wage,minutes:duration}}
function totals(){let hours=0,wage=0;approvedMine().forEach(s=>{const c=shiftCalc(s);hours+=c.hours;wage+=c.wage});const paid=myPayments().reduce((a,p)=>a+(+p.amount||0),0);return {hours,wage,paid,balance:wage-paid}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function showTab(name){if(name==='activity')drawActivity();if(session.role==='staff'&&['payments','bonuses'].includes(name))name='home';if(name==='shift')refreshShiftDay();byId('timerNotice').hidden=true;syncDates();closeMenu();document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('hidden',p.id!==name));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name&&b.closest('nav')));if(name==='history')renderHistory();if(name==='payments')renderPayments();if(name==='bonuses')renderBonuses();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
function rowShift(s){const c=shiftCalc(s);return `<tr><td>${jalali(s.date)}</td><td>${s.start&&s.end?'<bdi>'+timeLabel(s.start)+'</bdi> تا <bdi>'+timeLabel(s.end)+'</bdi>':'ساعت ثبت نشده'}</td><td>${digits(c.hours.toFixed(2))}</td><td>${money(c.wage)}</td><td>${s.owner?esc(statusText(s))+' · ':''}${esc(s.note||'—')}</td><td class="no-print"><button class="ghost" onclick="editShift('${s.id}')">ویرایش</button><button class="ghost negative" onclick="deleteShift('${s.id}')">حذف</button></td></tr>`}
function tableShifts(arr){if(!arr.length)return '<div class="empty">هنوز شیفتی ثبت نشده است.</div>';return `<table><thead><tr><th>تاریخ شمسی</th><th>ساعت</th><th>کارکرد</th><th>دستمزد</th><th>توضیحات</th><th class="no-print">عملیات</th></tr></thead><tbody>${arr.map(rowShift).join('')}</tbody></table>`}
function renderHistory(){let arr=[...myHistory()].sort((a,b)=>b.date.localeCompare(a.date));const f=$('fromDate')?.value,t=$('toDate')?.value;if(f)arr=arr.filter(x=>x.date>=f);if(t)arr=arr.filter(x=>x.date<=t);$('historyTable').innerHTML=tableShifts(arr)}
function renderPayments(){if(!data.payments.length){$('paymentTable').innerHTML='<div class="empty">پرداختی ثبت نشده است.</div>';return}$('paymentTable').innerHTML=`<div class="table-wrap"><table><thead><tr><th>تاریخ شمسی</th><th>نوع</th><th>مبلغ</th><th>توضیحات</th><th class="no-print">عملیات</th></tr></thead><tbody>${[...data.payments].sort((a,b)=>b.date.localeCompare(a.date)).map(p=>`<tr><td>${jalali(p.date)}</td><td>${p.type==='advance'?'مساعده':'پرداخت دستمزد'}</td><td>${money(p.amount)}</td><td>${esc(p.note||'—')}</td><td class="no-print"><button class="ghost negative" onclick="deletePayment('${p.id}')">حذف</button></td></tr>`).join('')}</tbody></table></div>`}

const dailyQuotes=[
"کار بزرگ، از قدم‌های کوچک و پیوسته ساخته می‌شود.",
"امروز را بهتر از دیروز بساز؛ همین یعنی پیشرفت.",
"صداقت در کار، سرمایه‌ای است که هرگز کم نمی‌شود.",
"موفقیت سهم کسانی است که با نظم ادامه می‌دهند.",
"هر مشتری راضی، نشانه یک کار درست و باارزش است.",
"با احترام کار کن؛ احترام، بهترین نتیجه را برمی‌گرداند.",
"تلاش پنهان امروز، نتیجه درخشان فرداست.",
"کیفیت یعنی وقتی کسی نگاه نمی‌کند هم درست کار کنی.",
"صبوری و پشتکار، راه‌های سخت را هموار می‌کند.",
"یک روز خوب را با یک تصمیم درست شروع کن."
];
function renderWelcome(){
 const role=session.role;
 $('welcomeTitle').textContent='خوش آمدی، '+session.name;
 const now=new Date(),day=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);
 $('welcomeQuote').textContent='«'+dailyQuotes[((day%dailyQuotes.length)+dailyQuotes.length)%dailyQuotes.length]+'»';
 $('welcomeDate').textContent='امروز: '+jalali(todayISO())+' · '+(role==='staff'?'روز کاری پربرکتی داشته باشی':'روز پربازدهی برای مدیریت آرزو می‌کنیم');
}
function renderBonuses(){
 const box=$('bonusTable');if(!box)return;
 if(!data.bonuses.length){box.innerHTML='<div class="empty">هنوز پاداشی ثبت نشده است.</div>';return;}
 box.innerHTML=`<div class="table-wrap"><table><thead><tr><th>تاریخ ثبت</th><th>پرسنل</th><th>مبلغ</th><th>علت</th><th>وضعیت</th><th class="no-print">عملیات</th></tr></thead><tbody>${[...data.bonuses].sort((a,b)=>b.date.localeCompare(a.date)).map(b=>`<tr><td>${jalali(b.date)}</td><td>${esc(b.person)}</td><td>${money(b.amount)}</td><td>${esc(b.reason||'—')}</td><td><span class="pill ${b.status==='paid'?'badge-paid':'badge-pending'}">${b.status==='paid'?'پرداخت شد':'در انتظار پرداخت'}</span>${b.paidDate?`<small class="muted"> · ${jalali(b.paidDate)}</small>`:''}</td><td class="no-print">${b.status==='pending'?`<button class="secondary" onclick="markBonusPaid('${b.id}')">ثبت پرداخت</button>`:''} <button class="ghost negative" onclick="deleteBonus('${b.id}')">حذف</button></td></tr>`).join('')}</tbody></table></div>`;
}
window.markBonusPaid=id=>{const b=data.bonuses.find(x=>x.id===id);if(!b||b.status==='paid')return;if(confirm('این پاداش به‌عنوان پرداخت‌شده ثبت شود؟')){b.status='paid';b.paidDate=todayISO();save();renderBonuses();}};
window.deleteBonus=id=>{if(confirm('این پاداش حذف شود؟')){data.bonuses=data.bonuses.filter(x=>x.id!==id);save();renderBonuses();}};

function render(){const t=totals();$('totalHours').textContent=digits(t.hours.toFixed(2))+' ساعت';$('totalWage').textContent=money(t.wage);$('totalPaid').textContent=money(t.paid);$('balance').textContent=money(t.balance);$('balance').className=t.balance>=0?'positive':'negative';$('recent').innerHTML=tableShifts([...myHistory()].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5));const today=approvedMine().filter(s=>s.date===todayISO());$('todayStatus').textContent=today.length?`امروز ${digits(today.length)} شیفت ثبت شده؛ مجموع کارکرد ${digits(today.reduce((a,s)=>a+shiftCalc(s).hours,0).toFixed(2))} ساعت.`:'برای امروز هنوز شیفتی ثبت نشده است.';renderPayments();renderBonuses();$('storeTitle').textContent=data.settings.storeName||'سامانه مدیریت ساعت کاری';renderWelcome()}
function resetShiftForm(){teamEditVersion=undefined;manualShiftDate=false;$('shiftForm').reset();$('editId').value='';$('shiftDate').value=todayISO();$('breakMin').value=0;$('shiftPreview').classList.add('hidden');$('saveShift').textContent='ذخیره شیفت';previewDate()}
function previewDate(){syncDates();$('jalaliPreview').textContent=($('shiftDate').value===todayISO()?'امروز':'تاریخ انتخاب‌شده')+' · برای تغییر، روی تاریخ بزن'}
$('shiftDate').addEventListener('change',previewDate);$('clearShift').addEventListener('click',resetShiftForm);
$('shiftForm').addEventListener('submit',async e=>{e.preventDefault();const s={id:$('editId').value||crypto.randomUUID(),date:$('shiftDate').value,start:$('start').value,end:$('end').value,breakMin:+$('breakMin').value||0,note:$('note').value.trim()};if(!s.date||!s.start||!s.end){alert('لطفاً تاریخ و ساعت شروع و پایان را وارد کنید.');return}const duration=formDuration(s);s.elapsedMinutes=duration;if(s.breakMin>=duration){alert('مدت استراحت باید از کل مدت شیفت کمتر باشد.');return}if(await saveTeamShift(s))return;const idx=data.shifts.findIndex(x=>x.id===s.id);if(idx>=0)data.shifts[idx]=s;else data.shifts.push(s);save();resetShiftForm();showTab('history')});
window.editShift=id=>{const s=findShift(id);if(!s)return;teamEditVersion=s.version;$('editId').value=s.id;$('shiftDate').value=s.date;$('start').value=s.start;$('end').value=s.end;$('endDays').value=shiftEndDays(s);$('breakMin').value=s.breakMin;$('note').value=s.note||'';$('saveShift').textContent='ذخیره تغییرات';previewDate();updateShiftPreview();showTab('shift')};
window.deleteShift=async id=>{const shared=teamView?.shifts.find(s=>s.id===id);if(shared){if(confirm('این شیفت حذف شود؟'))await actTeam('delete',{id,version:shared.version});return}if(confirm('این شیفت حذف شود؟')){data.shifts=data.shifts.filter(s=>s.id!==id);save();renderHistory()}};
$('filterHistory').addEventListener('click',renderHistory);
$('paymentForm').addEventListener('submit',e=>{e.preventDefault();const p={id:crypto.randomUUID(),date:$('payDate').value,amount:readRials('payAmount'),type:$('payType').value,note:$('payNote').value.trim()};if(!p.date||p.amount<=0){alert('تاریخ و مبلغ معتبر وارد کنید.');return}data.payments.push(p);save();$('paymentForm').reset();$('payDate').value=todayISO();syncDates()});
window.deletePayment=id=>{if(confirm('این پرداخت حذف شود؟')){data.payments=data.payments.filter(p=>p.id!==id);save()}};
$('settingsForm').addEventListener('submit',e=>{e.preventDefault();data.settings={...data.settings,mode:$('rateMode').value,rate:readRials('rate'),normalHours:+$('normalHours').value,overtime:+$('overtime').value};save();alert('تنظیمات ذخیره شد.')});
$('rateMode').value=data.settings.mode;$('rate').value=toRials(data.settings.rate);refreshTomanHints();$('normalHours').value=data.settings.normalHours;$('overtime').value=data.settings.overtime;
function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
$('backupBtn').addEventListener('click',()=>download('amo-parviz-backup.json',JSON.stringify(data,null,2),'application/json'));
$('restoreFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const v=JSON.parse(await f.text());if(!Array.isArray(v.shifts)||!Array.isArray(v.payments)||!v.settings)throw Error();if(!Array.isArray(v.bonuses))v.bonuses=[];v.settings={...defaults.settings,...v.settings};v.welcome={...defaults.welcome,...(v.welcome||{})};if(confirm('اطلاعات فعلی با اطلاعات فایل جایگزین شود؟')){data=normalize(v);save();$('storeName').value=data.settings.storeName;$('managerName').value=data.settings.managerName;$('rateMode').value=data.settings.mode;$('rate').value=toRials(data.settings.rate);refreshTomanHints();$('normalHours').value=data.settings.normalHours;$('overtime').value=data.settings.overtime;alert('بازیابی انجام شد.')}}catch(err){alert('فایل پشتیبان معتبر نیست.')}e.target.value=''});
$('resetBtn').addEventListener('click',()=>{if(confirm('همه شیفت‌ها، پرداخت‌ها و تنظیمات حذف شوند؟')){data=structuredClone(defaults);save();$('storeName').value='';$('managerName').value='';$('rateMode').value=data.settings.mode;$('rate').value=toRials(data.settings.rate);refreshTomanHints();$('normalHours').value=data.settings.normalHours;$('overtime').value=data.settings.overtime}});
$('csvBtn').addEventListener('click',()=>{const rows=[['تاریخ شمسی','شروع','پایان','ساعت کار','دستمزد (ریال)','توضیحات'],...approvedMine().map(s=>{const c=shiftCalc(s);return [jalali(s.date),s.start,s.end,c.hours.toFixed(2),toRials(c.wage),s.note||'']})];const csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');download('shift-history.csv',csv,'text/csv;charset=utf-8')});

$('bonusForm').addEventListener('submit',e=>{e.preventDefault();const b={id:crypto.randomUUID(),date:todayISO(),person:$('bonusPerson').value.trim(),amount:readRials('bonusAmount'),reason:$('bonusReason').value.trim(),status:'pending',paidDate:''};if(!b.person||b.amount<=0){alert('نام پرسنل و مبلغ معتبر وارد کنید.');return}data.bonuses.push(b);save();$('bonusForm').reset();renderBonuses();});
$('storeForm').addEventListener('submit',e=>{e.preventDefault();data.settings.storeName=$('storeName').value.trim();data.settings.managerName=$('managerName').value.trim();save();alert('مشخصات فروشگاه ذخیره شد.');});
function updateShiftPreview(){
 const start=$('start').value,end=$('end').value,box=$('shiftPreview');
 if(!start||!end){box.classList.add('hidden');return}
 const row={start,end,breakMin:$('breakMin').value};
 row.elapsedMinutes=formDuration(row);
 const {minutes:duration,wage}=shiftCalc(row);
 box.classList.remove('hidden');
 box.innerHTML=`<div class="muted">خلاصه محاسبه شیفت</div><p style="margin:8px 0">از <b>${timeLabel(start)}</b> تا <b>${timeLabel(end)}</b></p><div>مدت کارکرد: <b>${digits((duration/60).toFixed(2))} ساعت</b></div><div style="margin-top:8px">مبلغ قابل دریافت: <strong>${money(wage)}</strong></div><small class="muted">پس از کسر ${digits(+$('breakMin').value||0)} دقیقه استراحت</small>`;
}
['start','end','breakMin','endDays'].forEach(id=>$(id).addEventListener('input',updateShiftPreview));
$('storeName').value=data.settings.storeName||'';
$('managerName').value=data.settings.managerName||'';
$('bonusPerson').value=data.settings.staffName||'';

$('payDate').value=todayISO();resetShiftForm();render();

setupDashboard();
