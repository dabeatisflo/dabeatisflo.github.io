(()=>{'use strict';
const nav=document.getElementById('site-nav'),menu=document.getElementById('menu-btn');
if(nav&&menu){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));}
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
})();
