(()=>{'use strict';
const nav=document.getElementById('site-nav'),menu=document.getElementById('menu-btn');
if(nav&&menu){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));}
const form=document.getElementById('contact-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);location.href='mailto:peter.poels@sitaks.be?subject='+encodeURIComponent('[SITAKS] '+d.get('subject'))+'&body='+encodeURIComponent('Naam: '+d.get('name')+'\nE-mail: '+d.get('email')+'\n\n'+d.get('message'));});
const radio=document.getElementById('radio-player'),radioStatus=document.getElementById('radio-status');
if(radio){
  // This is the PUBLIC HTTPS relay endpoint, never the original NAS source address.
  const endpoint=window.SITAKS_CONFIG?.radioUrl||'';
  if(endpoint && (endpoint.startsWith('https://') || endpoint.startsWith('/'))){
    radio.src=endpoint;
    radioStatus.textContent='Druk op afspelen om SITAKS Radio te beluisteren.';
  }else{
    radio.removeAttribute('src');radio.setAttribute('aria-disabled','true');
    radioStatus.textContent='Live radio wordt beschikbaar zodra Peter de HTTPS-relay op de NAS heeft geconfigureerd.';
  }
  radio.addEventListener('playing',()=>radioStatus.textContent='SITAKS speelt nu live.');
  radio.addEventListener('waiting',()=>radioStatus.textContent='Bezig met verbinden…');
  radio.addEventListener('pause',()=>{if(!radio.error)radioStatus.textContent='Gepauzeerd.'});
  radio.addEventListener('error',()=>radioStatus.textContent='Er is geen verbinding met de HTTPS-radiostream. Controleer de reverse proxy, TLS, audioformaat en NAS-bereikbaarheid.');
}
const clips=document.getElementById('audio-clips'),fileInput=document.getElementById('clip-file'),categorySelect=document.getElementById('clip-category'),status=document.getElementById('clip-status');
if(clips&&fileInput){const library=[];let active='Alle';function render(){clips.replaceChildren();let shown=library.filter(i=>active==='Alle'||i.category===active);if(!shown.length){const p=document.createElement('p');p.className='muted';p.textContent=library.length?'Geen fragmenten in deze categorie.':'Nog geen fragmenten gepubliceerd. Test hieronder lokaal met je eigen audiobestanden.';clips.append(p);return;}shown.forEach(i=>{const outer=document.createElement('article');outer.className='clip';const left=document.createElement('div');const title=document.createElement('strong');title.textContent=i.title;const category=document.createElement('div');category.className='note';category.textContent=i.category+' · tijdelijke preview';left.append(title,category);const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=i.url;audio.setAttribute('aria-label','Beluister '+i.title);outer.append(left,audio);clips.append(outer);});}
document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.category;document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));render()}));fileInput.addEventListener('change',()=>{for(const f of Array.from(fileInput.files||[])){if(!f.type.startsWith('audio/')){status.textContent='Alleen audiobestanden toegestaan.';continue;}if(f.size>30e6){status.textContent='Demo: maximaal 30 MB per bestand.';continue;}library.push({title:f.name.replace(/\.[^.]+$/,''),category:categorySelect.value,url:URL.createObjectURL(f)});}render();if(library.length)status.textContent=library.length+' bestand(en) uitsluitend in deze browser geladen. Niet online gepubliceerd.';fileInput.value='';});window.addEventListener('pagehide',()=>library.forEach(item=>URL.revokeObjectURL(item.url)));render();}
})();