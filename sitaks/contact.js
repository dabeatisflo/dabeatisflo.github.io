/* SITAKS GitHub Pages: FormSubmit with server-side CAPTCHA.
 * The mandatory click is an additional UX gate, NOT a substitute for bot detection.
 */
(()=>{'use strict';
const form=document.getElementById('contact-form');
if(!form)return;
const status=document.getElementById('contact-status');
const button=document.getElementById('contact-submit');
const human=document.getElementById('sitaks-human-check');
const local=location.protocol==='file:';
const destination='https://formsubmit.co/peter.poels@sitaks.be';
form.action=destination;
form.method='POST';
form.acceptCharset='UTF-8';
function hidden(name,value){
 let el=form.querySelector('input[name="'+name+'"]');
 if(!el){el=document.createElement('input');el.type='hidden';el.name=name;form.appendChild(el);}
 el.value=value;
}
hidden('_captcha','true'); // This asks FormSubmit to perform its server-provided CAPTCHA.
hidden('_template','table');
hidden('_subject','SITAKS contact');
const setButton=()=>{if(button)button.disabled=local||!human||!human.checked;};
if(human)human.addEventListener('change',setButton);
setButton();
if(local){
 if(status)status.textContent='Verzenden werkt niet vanuit een lokaal bestand. Open de online website.';
 return;
}
form.addEventListener('submit',event=>{
 if(!human||!human.checked||!form.reportValidity()){
  event.preventDefault();
  if(status)status.textContent='Klik eerst zelf op het lege vak om de beveiligingscontrole te starten.';
  human?.focus();
  return;
 }
 const honey=form.querySelector('[name="_honey"]');
 if(honey&&honey.value.trim()){
  event.preventDefault();if(status)status.textContent='Bericht geweigerd.';return;
 }
 if(status)status.textContent='Je wordt doorgestuurd naar de echte CAPTCHA-controle van de formulierdienst.';
});
})();