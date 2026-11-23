/* AJAX: loads lang/*.json + data/profile.json and renders texts, icons, phone. Needs a local server. */
const ICON={
 github:'<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
 telegram:'<path d="M21 4L3 11l6 2.5L11 20l3.2-4.6L19 19z"/><path d="M9 13.5L21 4"/>',
 linkedin:'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
 instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
 bale:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
 email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/>',
};
const pid=(new URLSearchParams(location.search).get('p')||'sepanta').replace(/[^\w-]/g,'');
const App={lang:localStorage.getItem('lang')||'en',cache:{},profile:null,t:{}};
const ajax=u=>new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open('GET',u);x.onload=()=>{try{x.status<400?ok(JSON.parse(x.responseText)):no(x.status)}catch(e){no(e)}};x.onerror=()=>no('network');x.send()});
async function setLang(l){
  try{
    const ui=App.cache[l]||(App.cache[l]=await ajax('lang/'+l+'.json'));
    const p=App.profile=App.profile||await ajax('data/'+pid+'.json');
    const t=App.t=Object.assign({},ui,p[l]);App.lang=l;
    try{localStorage.setItem('lang',l)}catch(_){}
    const h=document.documentElement;h.lang=t.lang;h.dir=t.dir;
    document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t[e.dataset.i]||'');
    const ph=document.getElementById('photo');ph.alt=t.name;if(!ph.dataset.set){ph.dataset.set=1;ph.src=p.photo}
    document.getElementById('icons').innerHTML=p.links.map(k=>`<a href="${k.url}" ${k.url==='#'?'':'target="_blank" rel="noopener"'} aria-label="${k.title}" title="${k.title}"><svg viewBox="0 0 24 24">${ICON[k.key]}</svg></a>`).join('');
    document.getElementById('tech').innerHTML=p.stack.map(s=>`<span style="--c:${s[1]}">${s[0]}</span>`).join('');
    document.getElementById('phoneWrap').innerHTML=p.phone?`<button class="phone" id="phone"><small>${t.save}</small><b>${p.phone}</b></button>`:'';
    document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.lang===l));
    document.title=t.name+' | Artax Dev';
    window.buildQR&&buildQR();
  }catch(e){console.error(e);document.getElementById('page').insertAdjacentHTML('afterbegin','<p style="position:absolute;top:40%;padding:0 20px;text-align:center;color:#f0b94a;direction:ltr">Could not load data. Open through a server (GitHub Pages or: python -m http.server) - not by double-clicking index.html.</p>')}
}
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
setLang(App.lang);
