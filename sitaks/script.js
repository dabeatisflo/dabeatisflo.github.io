(()=>{'use strict';
const nav=document.getElementById('site-nav'),menu=document.getElementById('menu-btn');
if(nav&&menu){
 const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')};
 menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();menu.focus()}});
 document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))close()});
 window.addEventListener('resize',()=>{if(window.innerWidth>900)close()});
}
const radio=document.getElementById('radio-player'),radioStatus=document.getElementById('radio-status');
if(radio){
 const endpoint=window.SITAKS_CONFIG?.radioUrl||'';
 if(endpoint&&(endpoint.startsWith('https://')||endpoint.startsWith('/'))){
  radio.src=endpoint;
  radioStatus.textContent='Druk op afspelen om SITAKS Radio te beluisteren.';
 }else{
  radio.removeAttribute('src');radio.setAttribute('aria-disabled','true');
  radioStatus.textContent='Live radio wordt beschikbaar zodra Peter de HTTPS-relay op de NAS heeft geconfigureerd.';
 }
 radio.addEventListener('playing',()=>radioStatus.textContent='SITAKS speelt nu live.');
 radio.addEventListener('waiting',()=>radioStatus.textContent='Bezig met verbinden…');
 radio.addEventListener('stalled',()=>radioStatus.textContent='De verbinding is onderbroken. Er wordt opnieuw gebufferd…');
 radio.addEventListener('pause',()=>{if(!radio.error&&endpoint)radioStatus.textContent='Gepauzeerd.'});
 radio.addEventListener('error',()=>radioStatus.textContent='Geen verbinding met de HTTPS-radiostream. Controleer de reverse proxy, TLS, audioformaat en NAS-bereikbaarheid.');
}
})();
