(()=>{'use strict';
const list=document.getElementById('audio-clips');if(!list)return;
const entries=[...list.querySelectorAll('[data-audio-track]')];
const empty=document.getElementById('audio-empty'),search=document.getElementById('audio-search');
const buttons=[...document.querySelectorAll('.library-filters [data-category]')];
let active='Alle',currentlyPlaying=null;
const pad=n=>String(Math.floor(n)).padStart(2,'0');
const clock=seconds=>Number.isFinite(seconds)?pad(seconds/60)+':'+pad(seconds%60):'--:--';
function applyFilter(){
 const term=(search?.value||'').trim().toLocaleLowerCase('nl');let visible=0;
 for(const card of entries){const category=card.dataset.category||'Andere';const words=(card.dataset.search||card.textContent||'').toLocaleLowerCase('nl');const show=(active==='Alle'||category===active)&&(!term||words.includes(term));card.hidden=!show;if(show)visible++;}
 if(empty){empty.hidden=visible>0;const h=empty.querySelector('h3'),p=empty.querySelector('p');if(h)h.textContent=entries.length?'Geen passende fragmenten':'Nog geen fragmenten gepubliceerd';if(p)p.textContent=entries.length?'Probeer een andere zoekterm of categorie.':'Zodra Peter audio via het beveiligde CMS vrijgeeft, verschijnt hier automatisch een afzonderlijke luisterspeler per bestand.';}
}
buttons.forEach(b=>b.addEventListener('click',()=>{active=b.dataset.category||'Alle';buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));applyFilter()}));
search?.addEventListener('input',applyFilter);
for(const card of entries){
 const audio=card.querySelector('audio'),play=card.querySelector('.audio-play'),seek=card.querySelector('.audio-seek');
 const elapsed=card.querySelector('.audio-elapsed'),duration=card.querySelector('.audio-duration'),status=card.querySelector('.audio-status');
 if(!audio||!play||!seek)continue;
 audio.controls=false;audio.preload='metadata';audio.setAttribute('controlsList','nodownload noplaybackrate noremoteplayback');audio.disableRemotePlayback=true;
 const label=(card.querySelector('.audio-track-title')?.textContent||'audiofragment').trim();
 function update(){if(elapsed)elapsed.textContent=clock(audio.currentTime);if(duration)duration.textContent=clock(audio.duration);if(Number.isFinite(audio.duration)&&audio.duration>0){seek.max=String(audio.duration);if(!seek.matches(':active'))seek.value=String(audio.currentTime);seek.disabled=false}else{seek.max='100';seek.value='0';seek.disabled=true}}
 function renderPlay(){const playing=!audio.paused&&!audio.ended;play.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',(playing?'Pauzeer ':'Speel af: ')+label);play.setAttribute('aria-pressed',String(playing));if(playing){if(status)status.textContent='Speelt af'}else if(status)status.textContent='Klaar om te beluisteren'}
 play.addEventListener('click',async()=>{if(audio.paused){if(currentlyPlaying&&currentlyPlaying!==audio)currentlyPlaying.pause();currentlyPlaying=audio;try{await audio.play()}catch(e){if(status)status.textContent='Afspelen mislukt. Controleer het audiobestand.'}}else audio.pause();renderPlay()});
 seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(seek.value)});
 ['loadedmetadata','durationchange','timeupdate','seeked'].forEach(evt=>audio.addEventListener(evt,update));
 ['playing','pause','ended'].forEach(evt=>audio.addEventListener(evt,renderPlay));
 audio.addEventListener('error',()=>{if(status)status.textContent='Dit fragment is momenteel niet beschikbaar.'});
 update();renderPlay();
}
applyFilter();
})();