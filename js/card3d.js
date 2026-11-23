/* 3D card: click-to-flip, glare, QR code. */
(()=>{
const scene=document.getElementById('scene');
const flip=()=>scene.classList.toggle('flipped');
scene.addEventListener('click',e=>{if(!e.target.closest('a,button'))flip()});
document.getElementById('flipBtn').addEventListener('click',flip);
scene.addEventListener('pointermove',e=>{
 if(e.pointerType==='touch')return;
 const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
 document.querySelectorAll('.glare').forEach(g=>{g.style.setProperty('--gx',x*100+'%');g.style.setProperty('--gy',y*100+'%')})});
window.buildQR=()=>{const q=document.getElementById('qr');
 if(!q||q.firstChild||typeof QRCode==='undefined'||!App.profile)return;
 new QRCode(q,{text:App.profile.site,width:220,height:220,colorDark:'#120d20',colorLight:'#f6efe0',correctLevel:QRCode.CorrectLevel.M})};
addEventListener('load',()=>buildQR());
})();
