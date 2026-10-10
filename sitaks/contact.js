/* SITAKS contact: geen e-mailprogramma.
   GitHub Pages gebruikt FormSubmit (ontvanger moet e-mailadres eenmalig activeren).
   Synology Web Station gebruikt eigen contact-send.php met geconfigureerde NAS-mail. */
(function(){'use strict';
var form=document.getElementById('contact-form');if(!form)return;
var btn=document.getElementById('contact-submit'),status=document.getElementById('contact-status');
var isDemo=location.hostname==='dabeatisflo.github.io'||location.protocol==='file:';
if(location.protocol==='file:'){status.textContent='Open deze pagina via een webserver. Verzenden vanuit een lokaal HTML-bestand werkt niet.';}
form.addEventListener('submit',async function(ev){
 ev.preventDefault();if(!form.reportValidity())return;
 if(location.protocol==='file:'){status.textContent='Geen verzending vanuit een lokaal HTML-bestand. Gebruik de GitHub-testsite of Peters Synology-hosting.';return;}
 var data=new FormData(form);if(String(data.get('_honey')||'').trim()){status.textContent='Formulier niet verzonden.';return;}
 var name=String(data.get('name')||'').trim(),email=String(data.get('email')||'').trim(),subject=String(data.get('subject')||'').trim(),message=String(data.get('message')||'').trim();
 if(!name||!email||!subject||message.length<10){status.textContent='Vul alle velden correct in.';return;}
 var original=btn.textContent;btn.disabled=true;btn.textContent='Verzenden…';status.textContent='Bericht wordt verzonden…';
 try{
  var url=isDemo?'https://formsubmit.co/ajax/peter.poels@sitaks.be':'contact-send.php';
  var payload=isDemo?{name:name,email:email,subject:subject,message:message,_subject:'[SITAKS contact] '+subject,_template:'table',_honey:''}:{name:name,email:email,subject:subject,message:message,website:''};
  var controller=new AbortController(),timer=setTimeout(function(){controller.abort();},20000),response;
  try{response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit'});}finally{clearTimeout(timer);}
  var info;try{info=await response.json();}catch(e){throw Error('De server gaf geen geldig antwoord.');}
  if(!response.ok||info.success!==true)throw Error(info.message||'De verzending werd geweigerd.');
  status.textContent=isDemo?'De formulierdienst heeft je bericht verwerkt. Peter moet zijn ontvangstadres eerst eenmalig verifiëren; tot dan kan bezorging niet gegarandeerd worden.':'De NAS heeft het bericht aan het mailsysteem aangeboden. Peter kan de ontvangst in zijn mailbox controleren.';
  form.reset();
 }catch(err){status.textContent='Niet verzonden: '+(err.name==='AbortError'?'time-out bij de server':err.message)+'. Probeer later opnieuw.';}
 finally{btn.disabled=false;btn.textContent=original;}
});
})();