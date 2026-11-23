const modal=document.getElementById('modal');
const toggle=o=>{modal.classList.toggle('open',o);modal.setAttribute('aria-hidden',String(!o));document.getElementById(o?'mx':'artax').focus()};
document.getElementById('artax').addEventListener('click',()=>toggle(true));
document.getElementById('mx').addEventListener('click',()=>toggle(false));
modal.addEventListener('click',e=>{if(e.target===modal)toggle(false)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))toggle(false)});
