/* Neural-network canvas: layered nodes that drift, react to the pointer, and fire signal pulses forward. */
(()=>{
const cv=document.getElementById('net');if(!cv||!cv.getContext)return;
const ctx=cv.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let W,H,nodes=[],edges=[],pulses=[],mx=-9999,my=-9999,last=0;
function build(){
  const D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
  cv.width=W*D;cv.height=H*D;ctx.setTransform(D,0,0,D,0,0);
  const L=W<700?[3,5,5,3]:[4,7,8,7,3];nodes=[];edges=[];pulses=[];
  L.forEach((n,li)=>{for(let i=0;i<n;i++){const x=W*(.05+.9*li/(L.length-1)),y=H*(.08+.84*(i+.5)/n);
    nodes.push({l:li,x,y,hx:x,hy:y,p:Math.random()*6.28,s:.6+Math.random()*.8,out:[]})}});
  for(const a of nodes)for(const b of nodes)if(b.l===a.l+1&&Math.random()<.65){const e={a,b};edges.push(e);a.out.push(e)}
  if(!reduce)draw(0)
}
function spawn(){const s=nodes.filter(n=>n.l===0&&n.out.length);if(!s.length||pulses.length>=45)return;const n=s[Math.random()*s.length|0];pulses.push({e:n.out[Math.random()*n.out.length|0],t:0})}
function draw(t){
  ctx.clearRect(0,0,W,H);
  for(const n of nodes){
    let tx=n.hx+Math.sin(t*4e-4*n.s+n.p)*16,ty=n.hy+Math.cos(t*5e-4*n.s+n.p)*16;
    const dx=n.x-mx,dy=n.y-my,d=Math.hypot(dx,dy)||1;
    n.g=d<180?1-d/180:0;
    if(n.g){tx+=dx/d*n.g*55;ty+=dy/d*n.g*55}
    n.x+=(tx-n.x)*.07;n.y+=(ty-n.y)*.07
  }
  ctx.lineWidth=1;
  for(const e of edges){const g=Math.max(e.a.g,e.b.g);
    ctx.strokeStyle=`rgba(${g?'34,211,238':'139,92,246'},${.13+g*.5})`;
    ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.lineTo(e.b.x,e.b.y);ctx.stroke()}
  for(let i=pulses.length-1;i>=0;i--){const p=pulses[i],{a,b}=p.e;p.t+=.012;
    if(p.t>=1){b.hit=1;pulses.splice(i,1);if(b.out.length)pulses.push({e:b.out[Math.random()*b.out.length|0],t:0});continue}
    const x=a.x+(b.x-a.x)*p.t,y=a.y+(b.y-a.y)*p.t;
    ctx.fillStyle='rgba(240,185,74,.25)';ctx.beginPath();ctx.arc(x,y,7,0,6.3);ctx.fill();
    ctx.fillStyle='#ffd98a';ctx.beginPath();ctx.arc(x,y,2.4,0,6.3);ctx.fill()}
  for(const n of nodes){n.hit=(n.hit||0)*.94;const k=Math.max(n.g,n.hit);
    ctx.fillStyle=`rgba(34,211,238,${.12+k*.3})`;ctx.beginPath();ctx.arc(n.x,n.y,6+k*8,0,6.3);ctx.fill();
    ctx.fillStyle=k>.2?'#7ee8fa':'#b794ff';ctx.beginPath();ctx.arc(n.x,n.y,2.6+k*2,0,6.3);ctx.fill()}
}
function loop(t){if(t-last>1000/60-2){last=t;draw(t)}requestAnimationFrame(loop)}
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;
  const r=document.documentElement.style;r.setProperty('--mx',(e.clientX/W-.5).toFixed(3));r.setProperty('--my',(e.clientY/H-.5).toFixed(3))},{passive:true});
document.addEventListener('pointerleave',()=>{mx=my=-9999});
let rs;addEventListener('resize',()=>{clearTimeout(rs);rs=setTimeout(build,150)});
build();
if(!reduce){setInterval(spawn,420);requestAnimationFrame(loop)}
})();
