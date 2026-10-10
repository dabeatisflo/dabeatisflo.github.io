/* SITAKS-contact: geen mailto. Demo gebruikt FormSubmit; NAS verifieert CAPTCHA op de server. */
(function(){'use strict';
var form=document.getElementById('contact-form');if(!form)return;
var btn=document.getElementById('contact-submit'),status=document.getElementById('contact-status');
var q=document.getElementById('captcha-question'),ans=document.getElementById('captcha-answer');
var feedback=document.getElementById('captcha-feedback'),refresh=document.getElementById('captcha-refresh');
var isDemo=location.hostname==='dabeatisflo.github.io',localFile=location.protocol==='file:';
var expected=null,loading=false;
function demoChallenge(){var a=2+Math.floor(Math.random()*8),b=1+Math.floor(Math.random()*9);expected=a+b;q.textContent='Hoeveel is '+a+' + '+b+'?';feedback.textContent='Vul de uitkomst in.';}
async function newChallenge(){
 ans.value='';ans.setCustomValidity('');loading=true;refresh.disabled=true;q.textContent='Nieuwe controlevraag laden…';
 try{if(isDemo||localFile){demoChallenge();}else{
 var response=await fetch('contact-send.php?captcha=1',{method:'GET',credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}});
 var d=await response.json();if(!response.ok||d.success!==true||typeof d.question!=='string')throw Error('Geen controlevraag ontvangen.');
 q.textContent=d.question;expected=null;feedback.textContent='Vul de uitkomst in.';}}
 catch(e){q.textContent='Beveiligingscontrole tijdelijk niet beschikbaar.';feedback.textContent='Probeer opnieuw of laad de pagina opnieuw.';expected=null;}
 finally{loading=false;refresh.disabled=false;}
}
refresh.addEventListener('click',function(){newChallenge();});
ans.addEventListener('input',function(){ans.setCustomValidity('');feedback.textContent='Vul de uitkomst van de vraag in.';});
if(localFile)status.textContent='Voor verzending is GitHub of Peters NAS-webserver nodig.';
form.addEventListener('submit',async function(ev){
 ev.preventDefault();if(loading||!form.reportValidity())return;
 if(localFile){status.textContent='Je kunt niet verzenden vanuit een lokaal HTML-bestand.';return;}
 var input=ans.value.trim();
 if(!/^\d{1,2}$/.test(input)){feedback.textContent='Vul een geldig getal in.';ans.focus();return;}
 if(isDemo&&Number(input)!==expected){feedback.textContent='Dat antwoord klopt niet. Probeer het opnieuw.';ans.value='';ans.focus();return;}
 var data=new FormData(form);if(String(data.get('_honey')||'').trim()){status.textContent='Formulier niet verzonden.';return;}
 var name=String(data.get('name')||'').trim(),email=String(data.get('email')||'').trim();
 var subject=String(data.get('subject')||'').trim(),message=String(data.get('message')||'').trim();
 if(!name||!email||!subject||message.length<10){status.textContent='Vul alle velden correct in.';return;}
 btn.disabled=true;btn.textContent='Verzenden…';status.textContent='Bericht wordt verzonden…';
 try{
 var url=isDemo?'https://formsubmit.co/ajax/peter.poels@sitaks.be':'contact-send.php';
 var payload=isDemo?{name:name,email:email,subject:subject,message:message,_subject:'[SITAKS contact] '+subject,_template:'table',_honey:''}:
 {name:name,email:email,subject:subject,message:message,website:'',captcha_answer:input};
 var controller=new AbortController(),timer=setTimeout(function(){controller.abort();},20000),response;
 try{response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:isDemo?'omit':'same-origin'});}finally{clearTimeout(timer);}
 var info;try{info=await response.json();}catch(e){throw Error('Ongeldig antwoord van de server.');}
 if(!response.ok||(info.success!==true&&info.success!=='true'))throw Error(info.message||'Verzending geweigerd.');
 status.textContent=isDemo?'De formulierdienst heeft het bericht aangenomen; de ontvangst door Peter moet nog worden getest.':'De NAS heeft het bericht aan het mailsysteem aangeboden; de ontvangst moet nog worden getest.';
 form.reset();
 }catch(e){status.textContent='Niet verzonden: '+(e.name==='AbortError'?'server-time-out':e.message)+'. Probeer opnieuw.';}
 finally{btn.disabled=false;btn.textContent='Verstuur bericht naar Peter ↗';await newChallenge();}
});
newChallenge();
})();