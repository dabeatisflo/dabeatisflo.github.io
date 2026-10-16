/* SITAKS GitHub Pages: secure FormSubmit contact flow.
 * CAPTCHA is verified by the FormSubmit server, never a client-side math puzzle.
 * Synology uses contact-turnstile.js with server-side Cloudflare Siteverify.
 */
(()=>{'use strict';
const form=document.getElementById('contact-form');
if(!form)return;
const status=document.getElementById('contact-status'),button=document.getElementById('contact-submit');
const local=location.protocol==='file:';
const destination='https://formsubmit.co/peter.poels@sitaks.be';
form.action=destination;form.method='POST';form.acceptCharset='UTF-8';
function hidden(name,value){
 let el=form.querySelector('input[name="'+name+'"]');
 if(!el){el=document.createElement('input');el.type='hidden';el.name=name;form.appendChild(el);}
 el.value=value;
}
hidden('_captcha','true');
hidden('_template','table');
hidden('_subject','SITAKS contact');
if(local){
 button.disabled=true;
 if(status)status.textContent='Verzenden werkt niet vanuit een lokaal bestand. Gebruik de online SITAKS-website.';
 return;
}
button.disabled=false;
form.addEventListener('submit',event=>{
 if(!form.reportValidity()){event.preventDefault();return;}
 const honey=form.querySelector('[name="_honey"]');
 if(honey&&honey.value.trim()){event.preventDefault();if(status)status.textContent='Bericht geweigerd.';return;}
 if(status)status.textContent='Je wordt doorgestuurd naar de beveiligde CAPTCHA-controle van de formulierdienst.';
});
})();