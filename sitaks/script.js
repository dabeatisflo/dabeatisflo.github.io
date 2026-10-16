(()=>{'use strict';
const nav=document.getElementById('site-nav'),menu=document.getElementById('menu-btn');
if(nav&&menu){
 const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')};
 menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();menu.focus()}});
 document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))close()});
 window.addEventListener('resize',()=>{if(window.innerWidth>850)close()});
}
const player=document.getElementById('radio-player'),status=document.getElementById('radio-status');
if(!player)return;
const setStatus=msg=>{if(status)status.textContent=msg;};
const cfg=window.SITAKS_CONFIG||{};
const valid=url=>typeof url==='string'&&url.startsWith('https://');
const primary=valid(cfg.radioUrl)?cfg.radioUrl:'';
let wasRequested=false;
if(!primary){player.removeAttribute('src');player.removeAttribute('controls');player.setAttribute('aria-disabled','true');setStatus('Live MP3 in de ingebouwde speler vereist HTTPS. Gebruik voorlopig de knop hieronder.');const direct=cfg.directMp3Url;if(typeof direct==='string'&&direct.startsWith('http://')){const link=document.createElement('a');link.href=direct;link.target='_blank';link.rel='noopener noreferrer';link.className='btn primary';link.style.marginTop='14px';link.textContent='▶ Luister MP3 rechtstreeks ↗';link.setAttribute('aria-label','Open de originele SITAKS MP3-stream in een nieuw tabblad');player.parentNode.append(link)}return;}
player.src=primary;
player.preload='none';
player.removeAttribute('aria-disabled');
player.setAttribute('controlsList','nodownload noplaybackrate noremoteplayback');
player.disableRemotePlayback=true;
setStatus('Klaar om live te luisteren. Druk op afspelen.');
player.addEventListener('play',()=>{wasRequested=true;setStatus('Verbinden met SITAKS Radio…');});
player.addEventListener('playing',()=>setStatus('SITAKS Radio speelt nu live.'));
player.addEventListener('waiting',()=>setStatus('De uitzending wordt geladen…'));
player.addEventListener('stalled',()=>setStatus('De uitzending ondervindt vertraging. Even wachten…'));
player.addEventListener('pause',()=>{if(!player.error&&!player.ended&&wasRequested)setStatus('Radio gepauzeerd.');});
player.addEventListener('ended',()=>setStatus('De uitzending is gestopt. Druk opnieuw op afspelen.'));
player.addEventListener('error',()=>setStatus('De MP3-radiostream is niet bereikbaar via HTTPS. Controleer de Synology-reverse-proxy en Icecast /live.mp3.'));
})();