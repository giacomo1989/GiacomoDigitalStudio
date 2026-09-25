const features={
 essential:[['contact','✉',60],['whatsapp','◉',30],['maps','⌖',30],['gallery','▧',80],['page','□',90],['language','文',150],['social','◎',30],['pdf','⇩',30],['faq','?',50],['basicAnimations','↗',60]],
 business:[['calendar','▣',120],['restaurantBooking','◫',120],['newsletter','✉',80],['analytics','↗',50],['metaPixel','M',50],['blog','¶',150],['portfolio','▦',150],['menu','≡',100],['catalog','▤',150],['advancedForm','✎',100],['reviews','★',60],['cookie','◌',80],['seoAdvanced','⌕',150],['cms','C',200]],
 advanced:[['advancedAnimations','✦',150],['configurator','⚙',250],['autoQuote','€',200],['membersArea','◈',350],['login','●',300],['database','▥',300],['registration','✓',300],['payments','€',250],['ecommerce','◇',500],['dashboard','▦',400],['api','↔',250],['automation','⚡',250],['chatbot','✦',300],['aiFaq','AI',200],['aiLead','AI',300],['aiAssistant','AI',500]]
};
let chosen=new Set(),dict={},activeCategory='essential';
const quantities={page:0,language:0};
async function setLang(lang){dict=await fetch(`i18n/${lang}.json`).then(r=>r.json());document.documentElement.lang=lang;document.querySelectorAll('[data-i18n]').forEach(el=>{let v=el.dataset.i18n.split('.').reduce((o,k)=>o?.[k],dict);if(v)el.innerHTML=v});document.querySelectorAll('.lang').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));render()}
function allFeatures(){return Object.values(features).flat()}
function changeQty(key,delta){const max=key==='page'?10:5;quantities[key]=Math.max(0,Math.min(max,quantities[key]+delta));if(quantities[key]>0)chosen.add(key);else chosen.delete(key);render()}
function render(){
 document.querySelectorAll('.category-tab').forEach(b=>b.classList.toggle('active',b.dataset.category===activeCategory));
 const meta=dict.categories?.[activeCategory]||{}; document.querySelector('#categoryLabel').textContent=meta.label||activeCategory.toUpperCase(); document.querySelector('#categoryHint').textContent=meta.hint||'';
 const advancedNote=document.querySelector('#advancedNote');if(advancedNote)advancedNote.style.display=activeCategory==='advanced'?'block':'none';
 const box=document.querySelector('#options');box.innerHTML='';
 features[activeCategory].forEach(([k,icon,price])=>{
   const f=dict.features?.[k]||{name:k,desc:''};
   if(k==='page' || k==='language'){
     const q=quantities[k];
     const max=k==='page'?10:5;
     const plural=f.plural||f.name;
     const label=q===1?f.name:plural;
     const priceLabel=k==='language' ? (q<=1?'€ 150':'€ 150 + € 100') : `€ ${price}`;
     box.insertAdjacentHTML('beforeend',`<div class="option"><span class="icon">${icon}</span><span class="desc"><b>${label}</b><small>${f.desc}</small></span><b class="unit-price">${priceLabel}</b><span class="qty-control"><button type="button" data-qty-key="${k}" data-delta="-1" aria-label="Riduci" ${q===0?'disabled':''}>−</button><span class="qty-value">${q}</span><button type="button" data-qty-key="${k}" data-delta="1" aria-label="Aggiungi" ${q>=max?'disabled':''}>+</button></span></div>`);
   } else {
     box.insertAdjacentHTML('beforeend',`<div class="option"><span class="icon">${icon}</span><span class="desc"><b>${f.name}</b><small>${f.desc}</small></span><b>${f.from?'da ':''}€ ${price}</b><button aria-label="${chosen.has(k)?'Rimuovi':'Aggiungi'} ${f.name}" class="${chosen.has(k)?'on':''}" data-key="${k}">${chosen.has(k)?'−':'+'}</button></div>`);
   }
 });
 box.querySelectorAll('button[data-key]').forEach(b=>b.onclick=()=>{chosen.has(b.dataset.key)?chosen.delete(b.dataset.key):chosen.add(b.dataset.key);render()});
 box.querySelectorAll('button[data-qty-key]').forEach(b=>b.onclick=()=>changeQty(b.dataset.qtyKey,Number(b.dataset.delta)));
 let total=590,html='';
 allFeatures().forEach(([k,,p])=>{if(chosen.has(k)){
   const f=dict.features[k];
   if(k==='page'){
     const q=quantities.page; total+=p*q;
     const label=q===1?f.name:(f.plural||f.name);
     html+=`<div class="line"><span>${label} (${q})</span><b>€ ${p*q}</b></div>`;
   } else if(k==='language'){
     const q=quantities.language; const languageTotal=q>0?150+(q-1)*100:0; total+=languageTotal;
     const label=q===1?f.name:(f.plural||f.name);
     html+=`<div class="line"><span>${label} (${q})</span><b>€ ${languageTotal}</b></div>`;
   } else {total+=p;html+=`<div class="line"><span>${f.name}</span><b>${f.from?'da ':''}€ ${p}</b></div>`}
 }});
 document.querySelector('#selected').innerHTML=html;document.querySelector('#total').textContent=`€ ${total}${[...chosen].some(k=>dict.features[k]?.from)?' +':''}`
}
document.querySelectorAll('.category-tab').forEach(b=>b.onclick=()=>{activeCategory=b.dataset.category;render()});document.querySelectorAll('.lang').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));setLang('it');

function quoteData(){let total=590,rows=[];allFeatures().forEach(([k,,p])=>{if(!chosen.has(k))return;const f=dict.features[k];if(k==='page'){const q=quantities.page;total+=p*q;rows.push(`${f.plural||f.name}: ${q} — € ${p*q}`)}else if(k==='language'){const q=quantities.language,v=q>0?150+(q-1)*100:0;total+=v;rows.push(`${f.plural||f.name}: ${q} — € ${v}`)}else{total+=p;rows.push(`${f.name} — ${f.from?'da ':''}€ ${p}`)}});return{total,rows}}
const modal=document.querySelector('#quoteModal');
document.querySelector('#requestQuote')?.addEventListener('click',()=>{const q=quoteData();document.querySelector('#modalSummary').innerHTML=`<div class="line"><span>${dict.pricing.base}</span><b>€ 590</b></div>${q.rows.map(r=>`<div class="summary-row">${r}</div>`).join('')}<div class="modal-total"><span>${dict.pricing.total}</span><strong>€ ${q.total}</strong></div>`;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')});
function closeQuote(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
document.querySelector('#closeModal')?.addEventListener('click',closeQuote);modal?.addEventListener('click',e=>{if(e.target===modal)closeQuote()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeQuote()});
document.querySelector('#leadForm')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget),q=quoteData();const subject=encodeURIComponent(`Richiesta sito — ${fd.get('company')||fd.get('name')}`);const body=encodeURIComponent(`Nome: ${fd.get('name')}\nEmail: ${fd.get('email')}\nAzienda / progetto: ${fd.get('company')||'-'}\n\nConfigurazione:\nSito base — € 590\n${q.rows.join('\n')}\n\nTotale stimato: € ${q.total}\n\nMessaggio:\n${fd.get('message')||'-'}`);window.location.href=`mailto:hello@example.com?subject=${subject}&body=${body}`});

document.querySelector('#contactForm')?.addEventListener('submit',async e=>{
 e.preventDefault();
 const form=e.currentTarget, btn=document.querySelector('#contactSubmit'), status=document.querySelector('#contactStatus');
 if(form.elements._honey.value) return;
 btn.disabled=true; status.textContent=dict.contact?.sending||'Invio in corso…';
 const data=Object.fromEntries(new FormData(form).entries());
 delete data._honey;
 try{
   const res=await fetch('https://formsubmit.co/ajax/giacomo1989@icloud.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)});
   if(!res.ok) throw new Error('send');
   status.textContent=dict.contact?.success||'Messaggio inviato. Ti risponderò il prima possibile.';
   form.reset(); btn.style.display='none';
 }catch(err){
   status.textContent=dict.contact?.error||'Non sono riuscito a inviare il messaggio. Riprova tra poco.';
 }finally{btn.disabled=false}
});
