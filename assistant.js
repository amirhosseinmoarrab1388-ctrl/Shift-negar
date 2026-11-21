const handbook=[
 [/استراحت|وقفه/,'در «ثبت شیفت»، مدت استراحت را به دقیقه وارد کن. برنامه آن را از فاصلهٔ شروع تا پایان کم می‌کند و دستمزد را با ساعت خالص حساب می‌کند.'],
 [/اضافه ?کار/,'در «تنظیمات ← محاسبه دستمزد»، ساعات عادی و ضریب اضافه‌کاری را مشخص کن. برای هر شیفت، ساعت‌های بیشتر از حد عادی با ضریب اضافه‌کاری حساب می‌شوند.'],
 [/شب|نیمه شب/,'برای شیفت شب، تاریخ شروع را انتخاب کن. مثلاً شروع ۲۲:۰۰ و پایان ۰۶:۰۰ یعنی هشت ساعت تا صبح روز بعد، پیش از کسر استراحت.'],
 [/پشتیبان|بکاپ|بک آپ|بازیابی|انتقال|همگام|گوشی جدید/,'در «منو ← پشتیبان‌گیری و مدیریت داده»، «دریافت پشتیبان» را بزن. برای انتقال، در مرورگر مقصد وارد حساب شو و فایل JSON را با «بازیابی پشتیبان» انتخاب کن. بازیابی پس از تأیید، سوابق آن حساب را جایگزین می‌کند. فایل پشتیبان خواناست؛ آن را خصوصی نگه دار.'],
 [/رمز|نام کاربری|ثبت نام|حساب|مدیر|پرسنل/,'از صفحهٔ ورود، «ثبت‌نام» را بزن، نقش مدیر یا پرسنل را انتخاب کن و نام کاربری، رمز و تکرار رمز را وارد کن. دفتر هر حساب در همان مرورگر نگهداری می‌شود. بازیابی رمز با ایمیل در این نسخه وجود ندارد.'],
 [/تایمر|زمان سنج|شروع شیفت|پایان شیفت/,'در «نمای کلی» روی «شروع شیفت» بزن. با «پایان و ثبت شیفت»، رکورد ذخیره می‌شود و فرم ویرایش باز می‌شود تا استراحت یا توضیحات را اضافه کنی.'],
 [/ویرایش|اصلاح|اشتباه|حذف شیفت/,'از «تاریخچه» شیفت را پیدا کن و «ویرایش» را بزن. ساعت‌ها یا استراحت را تغییر بده و «ذخیره تغییرات» را انتخاب کن. گزینهٔ «حذف» هم کنار همان ردیف است.'],
 [/پاداش/,'در «پاداش‌ها»، نام پرسنل، مبلغ و دلیل را وارد کن. پاداش جدید در انتظار پرداخت است. بعد از پرداخت واقعی، «ثبت پرداخت» را روی همان ردیف بزن. پاداش‌ها در دفتر جداگانه ثبت می‌شوند.'],
 [/مانده|طلب|تسویه/,'ماندهٔ حساب برابر است با دستمزد شیفت‌ها منهای پرداخت‌ها و مساعده‌های ثبت‌شده. پاداش‌ها جداگانه در بخش «پاداش‌ها» نگهداری می‌شوند.'],
 [/پرداخت|مساعده|واریز|دریافتی/,'در «پرداخت‌ها»، تاریخ شمسی، نوع پرداخت (دستمزد یا مساعده) و مبلغ به ریال را وارد کن. ثبت پرداخت، ماندهٔ حساب را کاهش می‌دهد.'],
 [/نرخ|روزانه|ساعتی|حقوق|دستمزد|درآمد/,'در «تنظیمات ← محاسبه دستمزد»، مبنای ساعتی یا روزانه، نرخ، ساعات عادی و ضریب اضافه‌کاری را وارد کن. در حالت روزانه، نرخ ساعتی معادل برابر نرخ روزانه تقسیم بر ساعات عادی است. تغییر نرخ روی محاسبهٔ سوابق قبلی هم اثر دارد.'],
 [/چاپ|pdf|csv|اکسل|خروجی/,'در «تاریخچه» می‌توانی از جدول گزارش چاپ بگیری یا آن را از پنجرهٔ چاپ به‌صورت PDF ذخیره کنی. «خروجی CSV» همهٔ شیفت‌ها را برای باز کردن در اکسل می‌دهد.'],
 [/تاریخ|تقویم|فیلتر/,'در ثبت شیفت، پرداخت یا تاریخچه، روی دکمهٔ تاریخ بزن. در تقویم شمسی ماه و روز را انتخاب کن یا با «امروز» تاریخ جاری را بگذار. در تاریخچه پس از تعیین بازه، «اعمال فیلتر» را بزن.'],
 [/تیره|روشن|دارک|لایت|تم سایت|منو/,'کلید روشن و تیره در «منو ← تنظیمات ← ظاهر برنامه» است و انتخابت ذخیره می‌شود. از «منو» می‌توانی خلاصهٔ امروز را ببینی، خروجی بگیری یا تقویم را باز کنی.'],
 [/فروشگاه|مشخصات/,'در «تنظیمات ← مشخصات فروشگاه» نام فروشگاه و مدیر را تغییر بده و ذخیره کن.'],
 [/شیفت|کارکرد|ثبت ساعت/,'برای ثبت دستی از «ثبت شیفت» تاریخ شروع، ساعت ورود و خروج و دقیقه‌های استراحت را وارد کن. خلاصهٔ کارکرد و مبلغ را ببین و «ذخیره شیفت» را بزن.']
];
const cleanQuestion=q=>ascii(q).replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/[\u200c\u200f]/g,' ').replace(/[َُِّ]/g,'');
function dayRange(text,currentYear){
 const named=months.join('|');
 const endpoint='(\\d{1,2})(?:\\s+('+named+'))?(?:\\s+(1[2-5]\\d{2}))?';
 const pair=new RegExp('(?:^|[^\\d])'+endpoint+'\\s*(?:تا|الی)\\s*'+endpoint+'(?!\\d)').exec(text);
 const one=new RegExp('(?:^|[^\\d])('+ '\\d{1,2}' +')\\s+('+named+')(?:\\s+(1[2-5]\\d{2}))?').exec(text);
 if(!pair&&!one)return null;
 let d1,m1,y1,d2,m2,y2;
 if(pair){[,d1,m1,y1,d2,m2,y2]=pair}else{[,d1,m1,y1]=one;d2=d1;m2=m1;y2=y1}
 if(!m1&&!m2)return 'نام ماه شمسی را هم بنویس؛ مثلاً «۱ تا ۵ آبان».';
 m1=months.indexOf(m1||m2)+1;m2=m2?months.indexOf(m2)+1:m1;
 const wrap=m2<m1?1:0;
 y1=Number(y1||(y2?+y2-wrap:currentYear));y2=Number(y2||y1+wrap);
 function exact(year,month,day){
  const date=new Date(+monthStart(year,month)+(Number(day)-1)*dayMs);
  return dateParts(date).month===month?isoDate(date):null;
 }
 const from=exact(y1,m1,d1),to=exact(y2,m2,d2);
 if(!from||!to||from>to)return 'روز یا ترتیب بازهٔ شمسی معتبر نیست.';
 return {from,to,label:jalali(from)+(from===to?'':' تا '+jalali(to))};
}
function rangeFor(normalized){
 const date=new Date(todayISO()+'T12:00:00Z');
 const day=shift=>isoDate(new Date(+date+shift*dayMs));
 if(/دیروز|امروز|پریروز/.test(normalized)){
  const name=normalized.match(/پریروز|دیروز|امروز/)[0], iso=day({امروز:0,دیروز:-1,پریروز:-2}[name]);return {label:jalali(iso),from:iso,to:iso};
 }
 if(/هفته/.test(normalized)){
  const offset=(date.getUTCDay()+1)%7+(/هفته (قبل|پیش|گذشته)/.test(normalized)?7:0);
  return {label:jalali(day(-offset))+' تا '+jalali(day(6-offset)),from:day(-offset),to:day(6-offset)};
 }
 const current=dateParts(new Date(todayISO()+'T12:00:00Z'));
 const exactDays=dayRange(normalized,current.year);if(exactDays)return exactDays;
 const tokens=normalized.replace(/(ماه)/g,' ').match(/[آ-ی]+|\d{4}/g)||[];
 const hits=tokens.flatMap((t,i)=>months.includes(t)?[{month:months.indexOf(t)+1,year:/^\d{4}$/.test(tokens[i+1]||'')?+tokens[i+1]:null}]:[]);
 const years=tokens.filter(t=>/^\d{4}$/.test(t)).map(Number);
 if(hits.length>2||years.some(y=>y<1200||y>1600))return 'یک بازهٔ شمسی مشخص کن، مثل «آبان ۱۴۰۵ تا دی ۱۴۰۵».';
 let first,last;
 if(hits.length){
  const a=hits[0],b=hits.at(-1),wrap=b.month<a.month;
  const y=a.year??(b.year?b.year-(wrap?1:0):(years[0]||current.year));
  first={year:y,month:a.month};last={year:b.year??y+(wrap?1:0),month:b.month};
 }else if(/این ماه|ماه جاری/.test(normalized)){first=last=current}
 else if(/ماه (قبل|گذشته)/.test(normalized)){const prev=current.year*12+current.month-2;first=last={year:Math.floor(prev/12),month:prev%12+1}}
 else if(years.length||/امسال|پارسال|سال (جاری|گذشته)/.test(normalized)){
  const y=years[0]||current.year-(/پارسال|سال گذشته/.test(normalized)?1:0);first={year:y,month:1};last={year:y,month:12};
 }else return null;
 const index=p=>p.year*12+p.month;
 if(index(first)>index(last))return 'ماه پایان باید بعد از ماه شروع باشد.';
 const label=p=>months[p.month-1]+' '+numberFa(p.year);
 const end=monthStart(last.year+(last.month===12?1:0),last.month%12+1);
 return {label:label(first)+(index(first)===index(last)?'':' تا '+label(last)),from:isoDate(monthStart(first.year,first.month)),to:isoDate(new Date(+end-dayMs))};
}
const allDates={label:'کل سوابق',from:'',to:'9999'};
function windowStats(range){
 const within=r=>r.date&&r.date>=range.from&&r.date<=range.to;
 const shifts=approvedMine().filter(within).map(s=>({...s,...shiftCalc(s)})).sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start));
 const payments=myPayments().filter(within),bonuses=data.bonuses.filter(within);
 const sum=(rows,fn)=>rows.reduce((total,row)=>total+(Number(fn(row))||0),0);
 return {shifts,payments,bonuses,hours:sum(shifts,s=>s.hours),earned:sum(shifts,s=>s.wage),paid:sum(payments,p=>p.amount),advance:sum(payments.filter(p=>p.type==='advance'),p=>p.amount),breaks:sum(shifts,s=>s.breakMin),overtime:sum(shifts,s=>Math.max(0,s.hours-data.settings.normalHours)),bonus:sum(bonuses,b=>b.amount),pending:sum(bonuses.filter(b=>b.status==='pending'),b=>b.amount),bonusPaid:sum(bonuses.filter(b=>b.status==='paid'),b=>b.amount)};
}
const durationText=hours=>{const minutes=Math.round(hours*60);return digits(Math.floor(minutes/60))+' ساعت و '+digits(minutes%60)+' دقیقه'};
function shiftLine(s){return jalali(s.date)+'، '+timeLabel(s.start)+' تا '+timeLabel(s.end)+'؛ '+durationText(s.hours)+' کار خالص، '+digits(s.breakMin)+' دقیقه استراحت و '+money(s.wage)+' دستمزد.'}
function intent(q){
 if(/آخرین|اخیرترین/.test(q)&&/پرداخت|مساعده|واریز|دریافتی/.test(q))return 'lastPayment';

 const rules=[
 ['pending',/پاداش.*(معوق|مانده|نگرفت|در انتظار|پرداخت نشده)|(معوق|در انتظار).*پاداش/],['bonusPaid',/پاداش.*(گرفتم|گرفته|پرداخت شده|دریافت)/],['bonus',/پاداش/],
 ['balance',/مانده|طلب|باقی|بدهکار|تسویه/],['advance',/مساعده|علی الحساب/],['paid',/پرداخت|واریز|دریافت|پول گرفتم/],
 ['longest',/طولانی|بیشترین.*(شیفت|ساعت)|بیشتر.*کدوم روز/],['shortest',/کوتاه ترین|کمترین.*شیفت/],['latest',/آخرین|اخیرترین/],['list',/فهرست|لیست|چه روزهایی|کدوم روزها/],['average',/میانگین|متوسط/],
 ['overtime',/اضافه ?کار/],['breaks',/استراحت|وقفه/],['count',/چند (تا )?شیفت|تعداد|چند روز/],['earned',/درآمد|حقوق|پول|دستمزد|کسب/],['hours',/ساعت|کارکرد|کار کردم/],['summary',/خلاصه|گزارش|وضعیت عملکرد/]];
 return rules.find(([,re])=>re.test(q))?.[0];
}
function resultFor(metric,r,q){
 const s=windowStats(r),n=s.shifts.length;
 const amounts={balance:['ماندهٔ دستمزد پس از کسر پرداخت‌های این بازه',s.earned-s.paid],earned:['دستمزد با نرخ فعلی',s.earned],paid:['پرداخت‌ها با احتساب مساعده',s.paid],advance:['مساعده',s.advance],bonus:['پاداش ثبت‌شده',s.bonus],pending:['پاداش در انتظار پرداخت',s.pending],bonusPaid:['پاداش پرداخت‌شده از پاداش‌های ثبت‌شده در بازه',s.bonusPaid]};
 const header=r.label+'\n';
 if(metric==='lastPayment'){
  const rows=s.payments.filter(p=>!/مساعده/.test(q)||p.type==='advance');
  const last=rows.reduce((a,p)=>!a||p.date>=a.date?p:a,null);
  return header+(last?'آخرین '+(last.type==='advance'?'مساعده':'پرداخت دستمزد')+' در '+jalali(last.date)+'، '+money(last.amount):'پرداختی برای این بازه ثبت نشده است.');
 }
 if(metric in amounts){const [label,value]=amounts[metric];return header+label+' '+money(value);}
 if(metric==='count')return header+(/چند روز/.test(q)?digits(new Set(s.shifts.map(x=>x.date)).size)+' روز کاری':digits(n)+' شیفت ثبت‌شده');
 if(!n)return header+'هیچ شیفت ثبت‌شده‌ای پیدا نشد.';
 switch(metric){
 case 'hours':return header+'کارکرد خالص '+durationText(s.hours);
 case 'breaks':return header+'مجموع استراحت '+digits(s.breaks)+' دقیقه در '+digits(n)+' شیفت.';
 case 'overtime':return header+'اضافه‌کاری '+durationText(s.overtime)+'، با حد عادی '+digits(data.settings.normalHours)+' ساعت در هر شیفت.';
 case 'average':return header+'میانگین هر شیفت '+durationText(s.hours/n)+' کار و '+money(s.earned/n)+' دستمزد.';
 case 'latest':return header+shiftLine(s.shifts.at(-1));
 case 'longest':case 'shortest':return header+shiftLine(s.shifts.reduce((a,b)=>(metric==='longest'?b.hours>a.hours:b.hours<a.hours)?b:a));
 case 'list':return header+s.shifts.slice(-10).reverse().map(shiftLine).join('\n')+(n>10?'\n۱۰ شیفت آخر نمایش داده شد.':'');
 default:return header+digits(n)+' شیفت، '+durationText(s.hours)+' کار خالص و '+durationText(s.overtime)+' اضافه‌کاری.\nدستمزد '+money(s.earned)+'، دریافتی '+money(s.paid)+' و پاداش ثبت‌شده '+money(s.bonus)+'.';
 }
}
let previousMetric,previousRange,modelSession,turn=0;
const dialogue=[];
function directAnswer(q){
 const guide=handbook.find(([pattern])=>pattern.test(q));
 if(/تایمر|زمان سنج/.test(q)&&/فعال|روشن|چند وقت|چقدر گذشته|در حال/.test(q))return data.runningSince?'تایمر روشن است. زمان گذشته '+durationText((Date.now()-data.runningSince)/3600000)+'.':'الان تایمر فعالی نداری. از «نمای کلی» می‌توانی شیفت را شروع کنی.';
 if(guide&&!/مقایسه|تفاوت|چطور بود|چطور شد/.test(q)&&/چطور|چجور|چگونه|کجا|راهنما|یادم بده|چه جوری|چیکار|یعنی چی|چیه|چرا|فرق|روش|می خوام.*ثبت/.test(q))return guide[1];
 const times=[...q.matchAll(/(?:^|[^\d])(\d{1,2}:\d{2})(?!\d)/g)].map(x=>clock(x[1]));
 if(times.length===2&&times.every(Boolean)){
  const rest=q.match(/(\d+)\s*دقیقه\s*(?:هم\s*)?(?:استراحت|وقفه)/);
  const c=shiftCalc({start:times[0],end:times[1],breakMin:rest?+rest[1]:0});
  return 'از '+timeLabel(times[0])+' تا '+timeLabel(times[1])+' با '+digits(rest?+rest[1]:0)+' دقیقه استراحت، '+durationText(c.hours)+' کار خالص می‌شود. دستمزد با نرخ فعلی حساب '+money(c.wage)+' است.';
 }
 if(/نرخ|ضریب|حد عادی/.test(q)&&/چند|چقدر|فعلی|الان/.test(q))return 'نرخ '+(data.settings.mode==='daily'?'روزانه':'ساعتی')+' '+money(data.settings.rate)+'، ساعات عادی '+digits(data.settings.normalHours)+' و ضریب اضافه‌کاری '+digits(data.settings.overtime)+' است.';
 if(/مقایسه|تفاوت|فرق|بیشتر بود/.test(q)){
  const named=months.filter(m=>q.split(/[^آ-ی]+/).includes(m));
  if(named.length===2&&!/از.+تا/.test(q)){
   const y=q.match(/1[34]\d{2}/)?.[0]||dateParts(new Date(todayISO()+'T12:00:00Z')).year;
   const metric=intent(q)||'summary';
   return named.map(m=>resultFor(metric,rangeFor(m+' '+y),q)).join('\n\n');
  }
 }
 if(/پیشنهاد|بهتر|برنامه ریزی/.test(q)&&/شیفت|ساعت|کار|استراحت/.test(q)){
  const recent=windowStats(rangeFor('این ماه')),n=recent.shifts.length;
  if(!n)return 'برای برنامه‌ریزی، اول یک شیفت معمولی را ثبت کن و مدت استراحت را جدا بنویس. بعد می‌توانم میانگین ساعت واقعی هر شیفت را با ساعت عادی تنظیماتت مقایسه کنم.';
  return 'این ماه میانگین هر شیفتت '+durationText(recent.hours/n)+' و مجموع اضافه‌کاری '+durationText(recent.overtime)+' بوده. برای تخمین زمان شیفت بعدی، همین میانگین را مبنا بگیر و زمان استراحت را جدا اضافه کن.';
 }
 const clauses=q.split(/\s+و\s+|[؛؟]\s*/).map(t=>t.trim()).filter(Boolean);
 if(clauses.length>1&&clauses.every(t=>intent(t))){
  const ranges=clauses.map(rangeFor),shared=ranges.find(Boolean)||allDates;
  return clauses.map((part,i)=>{
   const scope=ranges[i]||shared;
   if(typeof scope==='string')return scope;
   previousRange=scope;previousMetric=intent(part);return resultFor(previousMetric,scope,part);
  }).join('\n\n');
 }
 const range=rangeFor(q);if(typeof range==='string')return range;
 const metric=intent(q)||(range?previousMetric:null);
 if(metric&&!/اگر|فرض|قانون|پیشنهاد|برنامه ریزی|بهتر|مقایسه|تفاوت/.test(q)){
  const scope=range||(/همون|همان|توش|چطور بود|چقدرش|اون بازه|همین بازه/.test(q)&&previousRange)||allDates;
  previousRange=scope;previousMetric=metric;return resultFor(metric,scope,q);
 }
 if(guide&&q.length<45&&!metric)return guide[1];
 return null;
}
function appendMessage(question,reply){
 const article=document.createElement('article'),title=document.createElement('b'),body=document.createElement('p');title.textContent=question;body.textContent=reply;article.append(title,body);byId('answer').append(article);return body;
}
async function askAssistant(){
 const input=byId('question'),q=input.value.trim();if(!q)return;
 const version=++turn;input.value='';
 const body=appendMessage(q,'در حال بررسی…');byId('newChat').hidden=false;
 let reply=directAnswer(cleanQuestion(q));
 if(!reply){
  try{
   if(!globalThis.LanguageModel||await LanguageModel.availability()!=='available')throw Error();
   modelSession??=await LanguageModel.create();
   const facts=windowStats(allDates);
   const context={settings:data.settings,summary:resultFor('summary',allDates,''),recent:facts.shifts.slice(-10).map(shiftLine),pendingBonus:facts.pending,timerRunning:!!data.runningSince,help:handbook.map(x=>x[1]),previous:dialogue.slice(-3)};
   reply=await modelSession.prompt('به فارسی، به عنوان دستیار شیفت‌نگار، به سؤال مرتبط با مدیریت ساعت کاری پاسخ بده. برای سوابق فقط از اطلاعات زیر استفاده کن؛ اگر جزئیات کافی نیست صریح بگو. ادعای تغییر داده یا دسترسی به دادهٔ دیگر نکن. راهنمای عملی کوتاه بده. اطلاعات: '+JSON.stringify(context)+'\nسؤال: '+q);
  }catch{
   reply='برای این پرسش آزاد، مدل زبانی روی این مرورگر در دسترس نیست. می‌توانی سؤال را مشخص‌تر بپرسی؛ مثلاً «طولانی‌ترین شیفتم کی بود؟»، «از ۲۲:۰۰ تا ۰۶:۰۰ با ۳۰ دقیقه استراحت چقدر کار می‌کنم؟» یا «چطور مساعده ثبت کنم؟».';
  }
 }
 if(body.isConnected){body.textContent=reply;if(version===turn)dialogue.push({question:q,answer:reply});body.scrollIntoView({block:'nearest'})}
}
byIdNewChat();
function byIdNewChat(){document.getElementById('newChat').onclick=()=>{turn++;dialogue.length=0;previousMetric=previousRange=null;document.getElementById('answer').replaceChildren();document.getElementById('newChat').hidden=true}}
