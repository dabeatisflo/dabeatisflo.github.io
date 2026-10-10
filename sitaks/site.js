
(()=>{"use strict";
const nav=document.getElementById("nav"),menu=document.getElementById("menu");
if(menu&&nav){menu.addEventListener("click",()=>{const on=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(on))});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}))}
const form=document.getElementById("contact-form");
if(form)form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const txt="Naam: "+data.get("name")+"\nE-mail: "+data.get("email")+"\n\n"+data.get("message");location.href="mailto:peter.poels@sitaks.be?subject="+encodeURIComponent("[SITAKS] "+data.get("subject"))+"&body="+encodeURIComponent(txt)});
const clips=document.getElementById("clips"),upload=document.getElementById("audioUpload"),filters=document.querySelectorAll("[data-filter]"),status=document.getElementById("uploadStatus");
if(clips&&upload){
const library=[];
let currentCategory="alles";
function render(){
const filtered=library.filter(x=>currentCategory==="alles"||x.category===currentCategory);
clips.replaceChildren();
if(!filtered.length){const p=document.createElement("p");p.className="muted";p.textContent=library.length?"Geen fragmenten in deze categorie.":"Nog geen opnames gepubliceerd. Je kunt hieronder tijdelijk een audiofragment kiezen om het afspelen te testen.";clips.append(p);return}
filtered.forEach(item=>{
const outer=document.createElement("article");outer.className="library-item";
const info=document.createElement("div");const strong=document.createElement("strong");strong.textContent=item.title;const sub=document.createElement("small");sub.textContent=item.category+" • Tijdelijke browser-preview";info.append(strong,sub);
const audio=document.createElement("audio");audio.controls=true;audio.preload="none";audio.src=item.url;audio.setAttribute("aria-label","Beluister "+item.title);outer.append(info,audio);clips.append(outer)
});
}
filters.forEach(b=>b.addEventListener("click",()=>{currentCategory=b.dataset.filter;filters.forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",String(x===b))});render()}));
upload.addEventListener("change",()=>{
const files=Array.from(upload.files||[]);const category=document.getElementById("clipCategory").value;
for(const f of files){if(!f.type.startsWith("audio/")){status.textContent="Enkel audiobestanden worden ondersteund.";continue}if(f.size>30*1024*1024){status.textContent="Voor de demo maximum 30 MB per bestand.";continue}library.push({title:f.name.replace(/\.[^.]+$/,""),category,url:URL.createObjectURL(f)})}
render();if(library.length)status.textContent=library.length+" fragment(en) tijdelijk geladen. Deze worden NIET online opgeslagen.";upload.value="";
});
window.addEventListener("pagehide",()=>library.forEach(x=>URL.revokeObjectURL(x.url)));render();
}
})();
