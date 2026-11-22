(() => {
  const $ = (q) => document.querySelector(q);
  const root = document.documentElement;
  const card = $('#business-card');
  const profile = window.SEPANTA_PROFILE || {};
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let language = localStorage.getItem('scorpion-language') || 'en';
  let theme = localStorage.getItem('scorpion-theme') || 'dark';
  root.dataset.theme = theme;

  // Contact fields: update from profile.js
  const contacts = {
    phone: `tel:${profile.phone || ''}`,
    telegram: profile.telegram || '#', instagram: profile.instagram || '#',
    github: profile.github || '#', email: `mailto:${profile.email || ''}`
  };
  document.querySelectorAll('[data-contact]').forEach(el => {
    const key = el.dataset.contact; if (contacts[key]) el.href = contacts[key];
  });
  if (profile.name) $('#portrait-img').alt = `${profile.name} portrait`;
  $('#portrait-img').addEventListener('error', () => { $('#portrait-img').style.display = 'none'; });
  // AJAX: fetch editable contact profile without a backend.
  fetch('profile.json').then(response => { if (!response.ok) throw new Error('Profile fetch failed'); return response.json(); }).then(data => {
    Object.assign(profile, data);
    const updated = { phone: `tel:${profile.phone || ''}`, telegram: profile.telegram || '#', instagram: profile.instagram || '#', github: profile.github || '#', email: `mailto:${profile.email || ''}` };
    document.querySelectorAll('[data-contact]').forEach(el => { const key = el.dataset.contact; if (updated[key]) el.href = updated[key]; });
    if (profile.name) $('#portrait-img').alt = `${profile.name} portrait`;
  $('#portrait-img').addEventListener('error', () => { $('#portrait-img').style.display = 'none'; });
  }).catch(() => console.info('Using local profile fallback from profile.js'));

  // Theme toggle and background mood morph
  $('#theme-toggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next; theme = next; localStorage.setItem('scorpion-theme', next);
    document.querySelector('.theme-icon').textContent = next === 'dark' ? '☼' : '☾';
    const btn = $('#theme-toggle'); btn.animate([{transform:'scale(1)'},{transform:'scale(.82) rotate(-25deg)'},{transform:'scale(1) rotate(0)'}],{duration:360});
  });
  document.querySelector('.theme-icon').textContent = theme === 'dark' ? '☼' : '☾';

  // English / Persian, with RTL support
  const langBtn = $('#lang-toggle');
  function applyLanguage() {
    root.lang = language; root.dir = language === 'fa' ? 'rtl' : 'ltr'; document.body.setAttribute('lang',language);
    langBtn.textContent = language === 'en' ? 'FA' : 'EN';
    document.querySelectorAll('[data-en][data-fa]').forEach(el => el.innerHTML = el.dataset[language]);
    $('.hint').textContent = language === 'en' ? 'MOVE · EXPLORE · CLICK' : 'حرکت کن · کشف کن · کلیک کن';
  }
  langBtn.addEventListener('click', () => {language = language === 'en' ? 'fa' : 'en'; localStorage.setItem('scorpion-language',language); applyLanguage();});
  applyLanguage();

  // Live digital clock
  const clock = $('#clock');
  function updateClock(){clock.textContent = new Intl.DateTimeFormat(language==='fa'?'fa-IR':'en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());}
  updateClock(); setInterval(updateClock,1000);

  // Mouse spotlight, card tilt, sheen, custom cursor trail
  let pointer = {x:innerWidth/2,y:innerHeight/2};
  const ringCursor = document.createElement('div'); ringCursor.className='cursor-ring'; document.body.appendChild(ringCursor);
  Object.assign(ringCursor.style,{position:'fixed',width:'24px',height:'24px',border:'1px solid var(--accent)',borderRadius:'50%',pointerEvents:'none',zIndex:99,opacity:0,transition:'width .25s,height .25s,opacity .25s',mixBlendMode:'difference'});
  let ring={x:pointer.x,y:pointer.y};
  if(!reduceMotion){
    window.addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY};root.style.setProperty('--mx',pointer.x+'px');root.style.setProperty('--my',pointer.y+'px');if(e.pointerType==='mouse'){ringCursor.style.opacity=1;$('#card-shell').classList.add('pointer-active');}}, {passive:true});
    function follow(){ring.x+=(pointer.x-ring.x)*.13;ring.y+=(pointer.y-ring.y)*.13;ringCursor.style.transform=`translate(${ring.x-12}px,${ring.y-12}px)`;requestAnimationFrame(follow);} follow();
    card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=card.getBoundingClientRect();const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;card.style.setProperty('--cardx',`${px*100}%`);card.style.setProperty('--cardy',`${py*100}%`);card.querySelector('.card-shine').style.opacity=1;card.style.transform=`rotateX(${(0.5-py)*7}deg) rotateY(${(px-.5)*9}deg)`;});
    card.addEventListener('pointerleave',()=>{card.style.transform='';card.querySelector('.card-shine').style.opacity=0;});
    // Magnetic links
    document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);el.style.transform=`translate(${dx*.12}px,${dy*.12}px)`;ringCursor.style.width='38px';ringCursor.style.height='38px';}, {passive:true}));
    document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointerleave',()=>{el.style.transform='';ringCursor.style.width='24px';ringCursor.style.height='24px';}));
  }
  // Touch trail with a cap and throttling
  let lastTrail=0;window.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'||reduceMotion)return;const now=performance.now();if(now-lastTrail<45)return;lastTrail=now;const dot=document.createElement('i');dot.className='touch-trail';dot.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:6px;height:6px;border-radius:50%;background:var(--accent);pointer-events:none;z-index:80;transform:translate(-50%,-50%);animation:touchFade .45s ease-out forwards`;document.body.appendChild(dot);setTimeout(()=>dot.remove(),470);},{passive:true});
  // Click energy wave
  const wave=$('#click-wave');document.addEventListener('click',e=>{if(reduceMotion)return;wave.style.left=e.clientX+'px';wave.style.top=e.clientY+'px';wave.classList.remove('active');void wave.offsetWidth;wave.classList.add('active');});
  // Scorpion easter egg (five taps/clicks)
  let stingCount=0,timer;$('#scorpion').addEventListener('click',()=>{stingCount++;clearTimeout(timer);timer=setTimeout(()=>stingCount=0,1500);if(stingCount>=5){stingCount=0;document.body.classList.toggle('cyber-mode');const msg=$('#easter-message');msg.textContent=document.body.classList.contains('cyber-mode')?'SCORPION PROTOCOL ACTIVATED':'SYSTEM NORMALIZED';msg.classList.remove('show');void msg.offsetWidth;msg.classList.add('show');}});
  // Konami Code easter egg
  const code=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let sequence=[];window.addEventListener('keydown',e=>{sequence.push(e.key);sequence=sequence.slice(-code.length);if(sequence.join('|')===code.join('|')){document.body.classList.toggle('cyber-mode');const m=$('#easter-message');m.textContent='SECRET MODE / UNLOCKED';m.classList.remove('show');void m.offsetWidth;m.classList.add('show');}});
  // VCard download
  $('#save-contact').addEventListener('click',()=>{const vcard=`BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name||'Sepanta Hosseini'}\nTITLE:${profile.title||'AI Developer'}\nTEL;TYPE=CELL:${profile.phone||''}\nEMAIL:${profile.email||''}\nURL:${profile.github||''}\nEND:VCARD`;const blob=new Blob([vcard],{type:'text/vcard;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Sepanta-Hosseini.vcf';a.click();URL.revokeObjectURL(a.href);});

  // Particle field: theme-aware and interactive, reduced on touch devices
  const canvas=$('#particles'),ctx=canvas.getContext('2d');let w,h,dpr,particles=[];const mobile=matchMedia('(max-width:700px)').matches;const count=mobile?30:65;
  function resize(){dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.5}));}resize();window.addEventListener('resize',resize);
  function draw(){ctx.clearRect(0,0,w,h);const light=root.dataset.theme==='light';const rgb=light?'37,99,235':'215,168,79';particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);if(dist<110){p.x+=dx/dist*.35;p.y+=dy/dist*.35;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${rgb},.65)`;ctx.fill();});for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const a=particles[i],b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<95){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(${rgb},${(1-d/95)*.12})`;ctx.lineWidth=.6;ctx.stroke();}}if(!reduceMotion)requestAnimationFrame(draw);}draw();
  // Scorpion idle / click feedback, small visual transform only
  const scorpion=$('#scorpion');scorpion.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=scorpion.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;scorpion.style.transform=`rotate(${x*14-5}deg) translateY(-3px)`;});scorpion.addEventListener('pointerleave',()=>scorpion.style.transform='');
})();
