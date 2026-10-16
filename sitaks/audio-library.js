(()=>{'use strict';
const list=document.getElementById('audio-clips');if(!list)return;
/* Alle demo-audio is los geplaatst onder /sitaks/audio-test/ en kan later in één keer weg. */
if(list.dataset.demoAudio==='christmas2026' && !list.querySelector('[data-audio-track]')){
 const names=['1','1b','2','3','4','5','6','7','8','9','10','11','12','13','14'];
 names.forEach((name,i)=>{
  const display='SITAKS Radio Station — Christmas '+(name==='1b'?'01B':String(Number(name)).padStart(2,'0'));
  const card=document.createElement('article');
  card.className='audio-track';card.dataset.audioTrack='1';card.dataset.category='Jingles';
  card.dataset.search='sitaks radio station kerst christmas '+name+' jingle';
  const head=document.createElement('div');head.className='audio-track-head';
  const symbol=document.createElement('span');symbol.className='audio-track-symbol';symbol.setAttribute('aria-hidden','true');symbol.textContent='♫';
  const info=document.createElement('div');info.className='audio-track-info';
  const title=document.createElement('h3');title.className='audio-track-title';title.textContent=display;
  const meta=document.createElement('div');meta.className='audio-track-meta';meta.textContent='Jingles  /  Kerst  /  '+String(i+1).padStart(2,'0')+' van 15';
  const descr=document.createElement('p');descr.className='audio-track-description';descr.textContent='Originele SITAKS Radio Station kerstjingle';
  info.append(title,meta,descr);head.append(symbol,info);
  const controls=document.createElement('div');controls.className='audio-track-controls';
  const play=document.createElement('button');play.className='audio-play';play.type='button';play.textContent='▶';play.setAttribute('aria-label','Speel af: '+display);
  const seek=document.createElement('input');seek.className='audio-seek';seek.type='range';seek.min='0';seek.max='100';seek.step='0.1';seek.value='0';seek.setAttribute('aria-label','Afspeelpositie: '+display);seek.disabled=true;
  const timer=document.createElement('span');timer.className='audio-time';
  const elapsed=document.createElement('span');elapsed.className='audio-elapsed';elapsed.textContent='00:00';
  const duration=document.createElement('span');duration.className='audio-duration';duration.textContent='--:--';
  timer.append(elapsed,document.createTextNode(' / '),duration);controls.append(play,seek,timer);
  const status=document.createElement('p');status.className='audio-status';status.setAttribute('role','status');status.textContent='Klaar om te beluisteren';
  const audio=document.createElement('audio');audio.src='audio-test/christmas'+name+'.mp3';audio.preload='metadata';audio.controls=false;
  card.append(head,controls,status,audio);list.append(card);
 });
}
const entries=[...list.querySelectorAll('[data-audio-track]')];
const empty=document.getElementById('audio-empty'),search=document.getElementById('audio-search');
const buttons=[...document.querySelectorAll('.library-filters [data-category]')];
let active='Alle',currentlyPlaying=null;
const pad=n=>String(Math.floor(n)).padStart(2,'0');
const clock=seconds=>Number.isFinite(seconds)?pad(seconds/60)+':'+pad(seconds%60):'--:--';
function applyFilter(){
 const term=(search?.value||'').trim().toLocaleLowerCase('nl');let visible=0;
 for(const card of entries){const category=card.dataset.category||'Andere';const words=(card.dataset.search||card.textContent||'').toLocaleLowerCase('nl');const show=(active==='Alle'||category===active)&&(!term||words.includes(term));card.hidden=!show;if(!show){const player=card.querySelector('audio');if(player&&!player.paused)player.pause();}if(show)visible++;}
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
 function renderPlay(){const playing=!audio.paused&&!audio.ended;play.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',(playing?'Pauzeer ':'Speel af: ')+label);play.setAttribute('aria-pressed',String(playing));if(playing){if(status)status.textContent='Speelt af'}else if(status&&status.textContent!=='Dit fragment is momenteel niet beschikbaar.')status.textContent=audio.ended?'Fragment afgelopen':'Klaar om te beluisteren'}
 play.addEventListener('click',async()=>{if(audio.paused){if(currentlyPlaying&&currentlyPlaying!==audio)currentlyPlaying.pause();currentlyPlaying=audio;try{await audio.play()}catch(e){if(status)status.textContent='Afspelen mislukt. Controleer het audiobestand.'}}else audio.pause();renderPlay()});
 seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(seek.value)});
 ['loadedmetadata','durationchange','timeupdate','seeked'].forEach(evt=>audio.addEventListener(evt,update));
 ['playing','pause','ended'].forEach(evt=>audio.addEventListener(evt,renderPlay));
 audio.addEventListener('error',()=>{if(status)status.textContent='Dit fragment is momenteel niet beschikbaar.'});
 update();renderPlay();
}
applyFilter();
})();