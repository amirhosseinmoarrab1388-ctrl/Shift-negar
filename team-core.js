// The Worker applies these rules for every shared write.
const TeamRules=(()=>{
 const insist=(yes,msg)=>{if(!yes)throw Error(msg)};
 const short=(s,n)=>String(s??'').trim().slice(0,n);
 const uuid=s=>typeof s==='string'&&/^[\da-f-]{36}$/i.test(s);
 const number=(v,min,max)=>{const n=Number(v);insist(Number.isFinite(n)&&n>=min&&n<=max,'عدد واردشده معتبر نیست.');return n};
 const date=s=>{insist(/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s+'T12:00:00Z').toISOString().startsWith(s),'تاریخ نامعتبر است.');return s};
 const member=(t,id)=>{const u=t.people.find(u=>u.id===id);insist(u,'عضو تیم پیدا نشد.');return u};
 function init(id,name,key){return {people:[{id,name:short(name,60),key,role:'manager',rate:0}],invites:[],shifts:[],payments:[],messages:[],group:false}}
 function view(t,u){
  return {me:u.id,people:t.people.map(p=>({id:p.id,name:p.name,role:p.role,...(p.id===u.id?{rate:p.rate}:{})})),shifts:t.shifts.filter(s=>s.owner===u.id).map(s=>({...s,locked:false})),payments:(t.payments||[]).filter(p=>p.owner===u.id).map(({owner,amount,date,kind})=>({owner,amount,date,kind}))};
 }
 function apply(t,u,op,b){
  const admin=u.role==='manager',manager=()=>insist(admin,'این عملیات مخصوص مدیر است.');
  const now=Date.now(),id=b.id;
  if(op==='invite'){manager();insist(short(b.name,60)&&b.digest,'نام پرسنل را وارد کن.');t.invites=t.invites.filter(i=>i.expires>now);t.invites.push({name:short(b.name,60),digest:b.digest,expires:now+7*86400000});return}
  if(op==='shift'){
   insist(uuid(id),'شناسه شیفت نامعتبر است.');const old=t.shifts.find(s=>s.id===id);
   if(old){insist(old.owner===u.id,'فقط صاحب شیفت می‌تواند آن را ویرایش کند.');insist(old.version===b.version,'شیفت تغییر کرده؛ دوباره آن را باز کن.')}
   else insist(!b.version,'شیفت حذف شده است.');
   const owner=old?.owner||u.id,p=member(t,owner);
   const times=[b.start,b.end].map(v=>{insist(/^([01]\d|2[0-3]):[0-5]\d$/.test(v),'ساعت معتبر وارد کن.');return +v.slice(0,2)*60 + +v.slice(3)});
   const endDays=number(b.endDays??(times[1]<times[0]?1:0),0,365);insist(Number.isInteger(endDays),'تعداد روز نامعتبر است.');
   const span=times[1]-times[0]+1440*endDays;
   const duration=number(b.elapsedMinutes??span,0.000001,525600);
   insist(Math.abs(duration-span)<1.01,'مدت شیفت با زمان ورود و خروج هم‌خوانی ندارد.');
   const rest=number(b.breakMin||0,0,duration);insist(rest<duration,'استراحت باید کمتر از طول شیفت باشد.');
   const row={id,owner,date:date(b.date),start:b.start,end:b.end,endDays,elapsedMinutes:duration,breakMin:rest,note:short(b.note,500),version:(old?.version||0)+1,locked:false,status:'approved',rate:p.rate||0};
   if(old)t.shifts[t.shifts.indexOf(old)]=row;else t.shifts.push(row);return
  }
  if(op==='delete'){
   const row=t.shifts.find(s=>s.id===id);insist(row&&row.owner===u.id&&row.version===b.version,'حذف این شیفت مجاز نیست.');
   t.shifts=t.shifts.filter(s=>s!==row);return
  }
  throw Error('عملیات ناشناخته است.');
 }
 return {init,apply,view,member,uuid};
})();
