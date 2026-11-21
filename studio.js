const byId = id => document.getElementById(id);
const months = 'فروردین اردیبهشت خرداد تیر مرداد شهریور مهر آبان آذر دی بهمن اسفند'.split(' ');
const dayMs = 86400000;
const persian = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric',timeZone:'UTC'});
const numberFa = n => String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const dateParts = date => Object.fromEntries(persian.formatToParts(date).filter(p=>['year','month','day'].includes(p.type)).map(p=>[p.type,Number(p.value)]));
const isoDate = date => date.toISOString().slice(0,10);
function monthStart(year,month){
 const rough=Date.UTC(year+621,2,21)+(month-1)*30*dayMs;
 let date=new Date(rough);
 for(let i=0;i<75;i++){
  const p=dateParts(date);
  if(p.year===year&&p.month===month&&p.day===1)return date;
  date=new Date(+date+(p.year*12+p.month<year*12+month?dayMs:-dayMs));
 }
 throw Error('Invalid calendar month');
}
let selectedField, displayMonth, calendarDay,manualShiftDate=false;
const localDay=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const calendarFormat=(date,calendar,opts)=>new Intl.DateTimeFormat('fa-IR',{calendar,timeZone:'UTC',...opts}).format(date);
const longDate={day:'numeric',month:'long',year:'numeric'};
function calendarBanner(){
 const date=new Date(calendarDay+'T12:00:00Z');
 byId('dayNumber').textContent=numberFa(dateParts(date).day);
 byId('dayCaption').textContent=calendarFormat(date,'persian',{weekday:'long'})+' · '+calendarFormat(date,'persian',longDate);
 byId('calLunar').textContent='قمری · '+calendarFormat(date,'islamic-umalqura',longDate);
 byId('calWestern').textContent='میلادی · '+calendarFormat(date,'gregory',longDate);
}
function openCalendar(field){
 selectedField=field;calendarDay=(field&&byId(field).value)||localDay();
 displayMonth=dateParts(new Date(calendarDay+'T12:00:00Z'));
 byId('calendarName').textContent=field?'انتخاب تاریخ':'تقویم';
 byId('clearDate').hidden=!['fromDate','toDate'].includes(field);
 drawMonth();byId('calendar').showModal();
}
function refreshShiftDay(){
 const field=byId('shiftDate');
 if(!byId('board').hidden&&!manualShiftDate&&!byId('editId').value&&field.value!==localDay()){
  field.value=localDay();previewDate();
 }
}
function syncDates(){
 document.querySelectorAll('[data-date]').forEach(b=>{const iso=byId(b.dataset.date).value;b.textContent=iso?jalali(iso):'انتخاب تاریخ'});
}
function pickDate(iso){
 if(!selectedField){calendarDay=iso;displayMonth=dateParts(new Date(iso+'T12:00:00Z'));drawMonth();return}
 if(selectedField==='shiftDate')manualShiftDate=true;
 const field=byId(selectedField);field.value=iso;field.dispatchEvent(new Event('change',{bubbles:true}));syncDates();byId('calendar').close();
}
function drawMonth(){
 calendarBanner();const {year,month}=displayMonth,first=monthStart(year,month);
 byId('calTitle').textContent=months[month-1]+' '+numberFa(year);
 const grid=byId('calGrid');grid.replaceChildren();
 for(const label of ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه']){const cell=document.createElement('small');cell.textContent=label;grid.append(cell)}
 for(let i=0;i<(first.getUTCDay()+1)%7;i++)grid.append(document.createElement('span'));
 for(let i=0;i<31;i++){
  const date=new Date(+first+i*dayMs);if(dateParts(date).month!==month)break;
  const iso=isoDate(date),button=document.createElement('button');button.textContent=numberFa(i+1);
  button.setAttribute('aria-label',calendarFormat(date,'persian',longDate));button.classList.toggle('selected',iso===calendarDay);button.classList.toggle('friday',date.getUTCDay()===5);if(iso===localDay())button.setAttribute('aria-current','date');
  button.onclick=()=>pickDate(iso);grid.append(button);
 }
}
function changeMonth(delta){
 const n=displayMonth.year*12+displayMonth.month-1+delta;
 displayMonth={year:Math.floor(n/12),month:n%12+1};if(!selectedField)calendarDay=isoDate(monthStart(displayMonth.year,displayMonth.month));drawMonth();
}
function closeMenu(){byId('drawer').hidden=true;byId('menu').setAttribute('aria-expanded','false')}
function setTheme(theme){
 document.documentElement.dataset.theme=theme;byId('theme').textContent=theme==='dark'?'☀ روشن':'☾ تیره';
}
setTheme(localStorage.getItem('shiftStudio:theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
byId('theme').onclick=()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(theme);localStorage.setItem('shiftStudio:theme',theme)};
function updateWallClock(){byId('liveClock').textContent=new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date())}
updateWallClock();setInterval(updateWallClock,10000);
byId('menu').onclick=()=>{
 const drawer=byId('drawer');if(!drawer.hidden){closeMenu();return}
 drawer.replaceChildren();const signedIn=!byId('board').hidden;
 const action=(label,run)=>{
  const link=document.createElement('button');link.type='button';link.textContent=label;
  link.onclick=()=>{closeMenu();run()};drawer.append(link);
 };
 action('تقویم',()=>openCalendar(null));
 if(signedIn){
  action('مشاهدهٔ فعالیت',()=>showTab('activity'));
  action('تنظیمات',()=>showTab('settings'));
  action('خلاصهٔ امروز',()=>{
   const scope=rangeFor('امروز'),stats=windowStats(scope);
   byId('dailyText').textContent=[scope.label,'شیفت‌ها: '+digits(stats.shifts.length),'کار خالص: '+durationText(stats.hours),'دستمزد: '+money(stats.earned),'دریافتی: '+money(stats.paid)].join('\n');
   byId('dailyReport').showModal();
  });
  action('پشتیبان‌گیری و مدیریت داده',()=>showTab('backup'));
  action('خروجی شیفت‌ها (CSV)',()=>byId('csvBtn').click());
  action('چاپ تاریخچه',()=>{showTab('history');window.print()});
 }
 if(signedIn)action('خروج از حساب کاربری',logout);
 drawer.hidden=false;byId('menu').setAttribute('aria-expanded','true');
};
document.addEventListener('click',e=>{if(!e.target.closest('#drawer,#menu'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
function tick(){
 const running=data.runningSince,seconds=running?Math.max(0,Math.floor((Date.now()-running)/1000)):0;
 byId('elapsed').textContent=numberFa([Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':'));
 byId('timerToggle').textContent=running?'پایان و ثبت شیفت':'شروع شیفت';
 byId('timerStatus').textContent=running?'شیفت در حال ثبت':'تایمر شیفت';
}
async function timerAction(){
 if(!data.runningSince){data.runningSince=Date.now();save();tick();return}
 const start=new Date(data.runningSince),end=new Date();
 const time=d=>[d.getHours(),d.getMinutes()].map(n=>String(n).padStart(2,'0')).join(':');
 const date=[start.getFullYear(),String(start.getMonth()+1).padStart(2,'0'),String(start.getDate()).padStart(2,'0')].join('-');
 const shift={id:crypto.randomUUID(),date,start:time(start),end:time(end),elapsedMinutes:Math.max(0,(end-start)/60000),breakMin:0,note:''};
 if(teamLinked()){
  const stopId=await timerRecordId(data.runningSince);
  const ok=await actTeam('shift',{...shift,id:stopId,endDays:Math.round((shift.elapsedMinutes-(mins(shift.end)-mins(shift.start)))/1440)});
  if(ok){data.runningSince=null;save();tick();showTab('history')}return;
 }
 data.shifts.push(shift);data.runningSince=null;save();tick();window.editShift(shift.id);byId('timerNotice').hidden=false;
}
function setupDashboard(){
 document.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>openCalendar(b.dataset.date));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshShiftDay()});
 setInterval(refreshShiftDay,1000);
 byId('timerToggle').onclick=timerAction;tick();setInterval(tick,1000);
 byId('askForm').onsubmit=e=>{e.preventDefault();askAssistant()};
 byId('suggest').onclick=e=>{if(e.target.tagName==='BUTTON'){byId('question').value=e.target.textContent;byId('askForm').requestSubmit()}};
 syncDates();
}

byId('prevMonth').onclick=()=>changeMonth(-1);byId('nextMonth').onclick=()=>changeMonth(1);
byId('closeCal').onclick=()=>byId('calendar').close();byId('clearDate').onclick=()=>pickDate('');byId('pickToday').onclick=()=>pickDate(localDay());
