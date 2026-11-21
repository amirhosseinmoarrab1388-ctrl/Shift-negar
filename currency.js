// Keep compatibility with existing books and the team API, which store tomans.
const toRials=n=>Math.round(Number(n)*10);
const readRials=id=>Number(document.getElementById(id).value)/10;
const currencyFields=['rate','payAmount','bonusAmount','teamRate'];
function updateTomanHint(input){
 if(!input||!currencyFields.includes(input.id))return;
 let hint=document.getElementById(input.id+'Hint');
 if(!hint){
  hint=document.createElement('small');hint.className='tomanHint';hint.id=input.id+'Hint';
  input.after(hint);input.setAttribute('aria-describedby',hint.id);
 }
 const value=Number(input.value)/10;
 const scale=value>=1e6&&value%1e6===0?1e6:value>=1000&&value%1000===0?1000:1;
 hint.textContent=input.value!==''&&Number.isFinite(value)&&value>=0?(value/scale).toLocaleString('fa-IR',{maximumFractionDigits:1})+(scale===1e6?' میلیون':scale===1000?' هزار':'')+' تومان':'';
}
function refreshTomanHints(){currencyFields.forEach(id=>updateTomanHint(document.getElementById(id)))}
document.addEventListener('input',e=>updateTomanHint(e.target));
document.addEventListener('reset',()=>queueMicrotask(refreshTomanHints));
