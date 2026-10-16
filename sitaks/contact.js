/* Native reCAPTCHA v2 checkbox, HTTPS PHP backend, no redirects. */
(()=>{'use strict';
const form=document.getElementById('contact-form');if(!form)return;
const btn=document.getElementById('contact-submit');
const status=document.getElementById('contact-status');
const endpoint='https://power-events.be/sitaks-contact/api.php';
const copy={
nl:{loading:'De beveiligingscontrole wordt geladen…',setup:'Het contactformulier wacht nog op de Google reCAPTCHA-sleutels. Verzenden is voorlopig uitgeschakeld.',ready:'Vink zelf ‘Ik ben geen robot’ aan om je bericht te verzenden.',checked:'reCAPTCHA geslaagd. Je kunt nu verzenden.',expired:'De CAPTCHA is verlopen. Vink het vak opnieuw aan.',error:'De beveiligingscontrole is niet bereikbaar. Probeer later opnieuw.',sending:'Bericht wordt beveiligd verstuurd…',sent:'Dankjewel! Je bericht is aan de mailserver aangeboden.',failed:'Verzenden mislukt. Probeer opnieuw.'},
fr:{loading:'Chargement de la vérification…',setup:'Le formulaire attend la configuration des clés Google reCAPTCHA. L’envoi est désactivé.',ready:'Cochez « Je ne suis pas un robot » pour envoyer votre message.',checked:'reCAPTCHA validé. Vous pouvez envoyer.',expired:'Le CAPTCHA a expiré. Cochez de nouveau la case.',error:'La vérification est indisponible.',sending:'Envoi sécurisé en cours…',sent:'Merci ! Votre message a été transmis au serveur de messagerie.',failed:'Échec de l’envoi. Réessayez.'},
en:{loading:'Loading security verification…',setup:'The Google reCAPTCHA keys still need configuring. Sending is disabled.',ready:'Tick “I’m not a robot” to send your message.',checked:'reCAPTCHA passed. You can send now.',expired:'The CAPTCHA has expired. Tick the box again.',error:'Security verification is unavailable.',sending:'Sending securely…',sent:'Thank you! Your message was handed to the mail server.',failed:'Sending failed. Please try again.'}
};
const language=()=>{const l=window.SITAKS_I18N?.language||document.documentElement.lang;return copy[l]?l:'nl'};
let token='',siteKey='',widget=null,ready=false,busy=false,step='loading';
function show(key){step=key;if(status)status.textContent=copy[language()][key]||copy.nl[key];}
function toggle(){btn.disabled=!ready||!token||busy;}
function expired(){token='';toggle();show('expired');}
window.sitaksRecaptchaReady=()=>{
 if(!window.grecaptcha||!siteKey||widget!==null)return;
 try{widget=grecaptcha.render('sitaks-recaptcha',{
  sitekey:siteKey,theme:'dark',size:window.innerWidth<360?'compact':'normal',
  callback:value=>{token=String(value||'');toggle();show(token?'checked':'ready');},
  'expired-callback':expired,
  'error-callback':()=>{token='';toggle();show('error');}
 });ready=true;toggle();show('ready')}
 catch(e){show('error')}
};
async function initialize(){
 show('loading');toggle();
 try{
  const response=await fetch(endpoint+'?config=1',{headers:{Accept:'application/json'},credentials:'omit',cache:'no-store'});
  const data=await response.json();
  if(!response.ok||data.success!==true||typeof data.siteKey!=='string'||!data.siteKey)throw Error('unconfigured');
  siteKey=data.siteKey;
  const script=document.createElement('script');
  script.src='https://www.google.com/recaptcha/api.js?onload=sitaksRecaptchaReady&render=explicit&hl='+encodeURIComponent(language());
  script.async=true;script.defer=true;
  script.onerror=()=>show('error');document.head.appendChild(script);
 }catch(e){show('setup')}
}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(busy||!ready||!token)return;
 if(!form.reportValidity())return;
 const d=new FormData(form);
 if(String(d.get('_honey')||'').trim()){show('failed');return}
 const payload={name:String(d.get('name')||'').trim(),email:String(d.get('email')||'').trim(),subject:String(d.get('subject')||'').trim(),message:String(d.get('message')||'').trim(),website:'',recaptchaToken:token};
 busy=true;toggle();show('sending');
 try{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);
  let response;try{response=await fetch(endpoint,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal})}finally{clearTimeout(timeout)}
  const result=await response.json();if(!response.ok||result.success!==true)throw Error('not sent');
  form.reset();show('sent');
 }catch(e){show('failed')}
 finally{busy=false;token='';if(widget!==null&&window.grecaptcha)try{grecaptcha.reset(widget)}catch(e){}toggle()}
});
document.addEventListener('sitaks:languagechange',()=>{if(!busy)show(step)});
initialize();
})();