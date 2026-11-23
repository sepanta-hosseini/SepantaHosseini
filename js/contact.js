/* Phone click -> downloads a .vcf contact card (name + number + photo).
   On phones this opens the Contacts app with "Add contact" prefilled. (tel: links cannot prefill a name.) */
const toB64=u=>fetch(u).then(r=>{if(!r.ok)throw 0;return r.blob()}).then(b=>new Promise(ok=>{const f=new FileReader();f.onload=()=>ok(f.result.split(',')[1]);f.readAsDataURL(b)}));
document.addEventListener('click',async e=>{
  if(!e.target.closest('#phone'))return;
  const t=App.t,p=App.profile;let photo='';
  try{photo=await toB64(p.photo)}catch(_){}
  const v=['BEGIN:VCARD','VERSION:3.0','N:'+t.vn+';;;','FN:'+t.name,'ORG:Artax Dev','TEL;TYPE=CELL,VOICE:'+p.phone.replace(/[^\d+]/g,''),photo&&'PHOTO;ENCODING=b;TYPE=JPEG:'+photo,'END:VCARD'].filter(Boolean).join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([v],{type:'text/vcard;charset=utf-8'}));a.download=p.id+'.vcf';
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
});
