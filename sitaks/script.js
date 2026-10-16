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
const source=typeof cfg.radioUrl==='string'&&/^https?:\/\//i.test(cfg.radioUrl)?cfg.radioUrl:'';
const mixed=location.protocol==='https:'&&source.toLowerCase().startsWith('http:');
const slider=document.getElementById('radio-volume');
const value=document.getElementById('radio-volume-value');
const mute=document.getElementById('radio-mute');
let lastPosition=85,requested=false;
function setVolume(position){
 const pos=Math.min(100,Math.max(0,Number(position)||0));
 const db=pos===0?-Infinity:-48*(1-pos/100);
 const gain=pos===0?0:Math.pow(10,db/20);
 try{player.volume=gain;}catch(e){/* Volume API can be fixed on iOS */}
 player.muted=pos===0;
 if(slider){slider.value=String(pos);slider.setAttribute('aria-valuetext',pos===0?'Gedempt':Math.round(db)+' decibel');}
 if(value)value.textContent=pos===0?'Uit':Math.round(db)+' dB';
 if(mute){mute.textContent=pos===0?'🔇':'🔊';mute.setAttribute('aria-label',pos===0?'Geluid aanzetten':'Geluid dempen');mute.setAttribute('aria-pressed',String(pos===0));}
 if(pos>0)lastPosition=pos;
}
if(slider){
 slider.addEventListener('input',()=>setVolume(slider.value));
 setVolume(slider.value);
}
if(mute)mute.addEventListener('click',()=>setVolume(player.muted||Number(slider?.value)===0?lastPosition:0));
if(!source){
 player.removeAttribute('src');player.setAttribute('aria-disabled','true');
 setStatus('MP3-bron niet geconfigureerd.');return;
}
player.src=source;
player.preload='none';
player.removeAttribute('aria-disabled');
player.setAttribute('controlsList','nodownload noplaybackrate noremoteplayback');
player.disableRemotePlayback=true;
setStatus(mixed?'MP3-bron ingesteld. Let op: GitHub Pages is HTTPS; de browser kan de HTTP-stream blokkeren.':'Klaar om SITAKS Radio live te beluisteren.');
player.addEventListener('play',()=>{requested=true;setStatus('Verbinding maken met SITAKS Radio…');});
player.addEventListener('playing',()=>setStatus('SITAKS Radio speelt nu live (MP3).'));
player.addEventListener('waiting',()=>setStatus('De uitzending wordt geladen…'));
player.addEventListener('stalled',()=>setStatus('De verbinding wacht op audiogegevens…'));
player.addEventListener('pause',()=>{if(!player.error&&requested)setStatus('Gepauzeerd.');});
player.addEventListener('ended',()=>setStatus('De uitzending is gestopt. Druk op afspelen om opnieuw te verbinden.'));
player.addEventListener('error',()=>setStatus(mixed?'De browser blokkeert of wijzigt de HTTP-stream op deze HTTPS-website. Gebruik een HTTP-site op de Synology of een HTTPS-relay.':'De MP3-stream is niet bereikbaar. Controleer Icecast /live.mp3.'));
})();