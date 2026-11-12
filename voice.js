// Veu: síntesi (respostes i trànsit) i reconeixement (el que dius amb el PTT premut).
const LOCALE={es:'es-ES',en:'en-GB',fr:'fr-FR'};
const synth=globalThis.speechSynthesis;
let voices=[];
function loadVoices(){voices=synth?.getVoices()||[]}
if(synth){loadVoices();synth.addEventListener?.('voiceschanged',loadVoices)}

export const canSpeak=()=>!!synth;
// Hi ha veus? Alguns navegadors (Firefox a Linux sense speech-dispatcher) no en tenen cap i no sonen.
export function voicesReady(timeout=2500){
 return new Promise(resolve=>{if(!synth)return resolve(0);loadVoices();if(voices.length)return resolve(voices.length);
  const done=()=>{loadVoices();resolve(voices.length)};synth.addEventListener?.('voiceschanged',done,{once:true});setTimeout(done,timeout)});
}
let failures=0;export const speechFailures=()=>failures;
export function voicesFor(lang){return voices.filter(v=>v.lang?.toLowerCase().replace('_','-').startsWith(lang))}
export function hasVoice(lang){return voicesFor(lang).length>0}
// Tria una veu estable per a cada persona (seed), i si no n'hi ha de la llengua, una de propera.
function pick(lang,seed){
 const pool=voicesFor(lang).length?voicesFor(lang):voicesFor('en');
 if(!pool.length)return null;
 const local=pool.filter(v=>v.localService);const list=local.length>1?local:pool;
 return list[[...seed].reduce((h,c)=>h+c.charCodeAt(0),0)%list.length];
}
// Frases curtes: les veus de Google de Chrome es tallen soles si una frase dura més d'uns 15 s.
function chunks(text){const parts=text.match(/[^.!?]+[.!?]*\s*/g)||[text];const out=[];for(const p of parts){if(out.length&&(out.at(-1)+p).length<160)out[out.length-1]+=p;else out.push(p)}return out.map(p=>p.trim()).filter(Boolean)}
export function speak({text,lang='ca',pitch=1,rate=1,volume=1,seed=''}){
 return new Promise(resolve=>{
  if(!synth){setTimeout(resolve,700+text.length*60);return}
  const v=pick(lang,seed||String(pitch)),parts=chunks(text);
  let finished=false;const finish=()=>{if(finished)return;finished=true;clearTimeout(guard);resolve()};
  // Alguns navegadors no avisen quan acaben: límit de seguretat segons la llargada.
  const guard=setTimeout(finish,(1500+text.length*95)/rate+2500);
  parts.forEach((part,i)=>{
   const u=new SpeechSynthesisUtterance(part);u.lang=LOCALE[lang]||lang;u.pitch=pitch;u.rate=rate;u.volume=volume;if(v)u.voice=v;
   u.onstart=()=>{failures=0;spoken++};
   if(i===parts.length-1)u.onend=finish;
   u.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))failures++;finish()};
   utterances.add(u);u.addEventListener('end',()=>utterances.delete(u));u.addEventListener('error',()=>utterances.delete(u));
   synth.speak(u);
  });
 });
}
// Es guarden les frases en curs perquè el navegador no les descarti abans d'hora.
const utterances=new Set();let spoken=0;export const spokenCount=()=>spoken;
export function silence(){utterances.clear();synth?.cancel()}

const Recognition=globalThis.SpeechRecognition||globalThis.webkitSpeechRecognition;
export const canListen=()=>!!Recognition;
// Una sola captura de micròfon per transmissió. S'obre amb getUserMedia i la seva pista es passa al
// reconeixedor (start(track)): el Chrome de Linux (flatpak) no fa arribar so a la captura pròpia del
// reconeixedor, tot i que getUserMedia sí que rep la veu. Comprovat el 12/11/2026 amb Chrome 157 i àudio real:
// sense pista només hi ha audiostart i acaba en no-speech; amb la pista arriben soundstart, speechstart i el text.
// Els navegadors que no admeten la pista l'ignoren i fan servir la seva captura habitual.
// onStream rep el MediaStream (per al vúmetre, sense obrir cap segona captura).
export function listen(lang,onInterim=()=>{},onStatus=()=>{},onStream=()=>{}){
 let rec=null,completed='',current='',error=null,stopping=false,aborted=false,ended=true;
 let retry=null,stopPromise=null,resolveStop=null,guard=null,startGuard=null,restarts=0;
 let stream=null,track=null,opening=false,micTried=false;
 const media=globalThis.navigator?.mediaDevices;
 const release=()=>{stream?.getTracks().forEach(t=>t.stop());stream=null;track=null};
 const text=()=>[completed,current].filter(Boolean).join(' ').trim();
 const finish=()=>{clearTimeout(startGuard);clearTimeout(guard);clearTimeout(retry);release();resolveStop?.({text:text(),error});resolveStop=null};
 const fail=code=>{clearTimeout(startGuard);error=code;onStatus('error',code)};
 function start(){
  if(stopping||aborted)return;
  if(!Recognition){fail('unsupported');finish();return}
  // Primer s'obre el micròfon (una sola vegada per transmissió; els reintents reutilitzen la pista).
  if(!micTried&&media?.getUserMedia){
   micTried=true;opening=true;onStatus('starting');
   media.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}}).then(s=>{
    opening=false;if(stopping||aborted){s.getTracks().forEach(t=>t.stop());return}
    stream=s;track=s.getAudioTracks()[0]||null;onStatus('mic');onStream(s);start();
   },e=>{
    opening=false;if(stopping||aborted)return;
    if(e?.name==='NotAllowedError'||e?.name==='SecurityError'){fail('not-allowed');finish();return}
    // Sense micròfon propi (cap dispositiu, error del sistema): es prova la captura del reconeixedor.
    onStatus('nomic',e?.name||'');start();
   });
   return;
  }
  try{
   rec=new Recognition();ended=false;current='';
   rec.lang=LOCALE[lang]||lang;rec.interimResults=true;rec.continuous=true;rec.maxAlternatives=1;
   const active=rec;
   rec.onstart=()=>{if(aborted){active.abort();return}if(stopping){try{active.stop()}catch{}return}onStatus('service')};
   rec.onaudiostart=()=>{clearTimeout(startGuard);if(!stopping&&!aborted)onStatus('ready')};
   rec.onsoundstart=()=>{if(!stopping&&!aborted)onStatus('sound')};
   rec.onspeechstart=()=>{if(!stopping&&!aborted)onStatus('speech')};
   rec.onspeechend=()=>{if(!stopping&&!aborted)onStatus('ready')};
   rec.onresult=e=>{
    if(aborted)return;clearTimeout(startGuard);onStatus('result');
    // results és la llista completa de la sessió, també quan una frase es revisa.
    current=Array.from(e.results,r=>r[0]?.transcript||'').join(' ').trim();
    onInterim(text());
   };
   rec.onerror=e=>{if(aborted)return;if(e.error==='no-speech'){error='no-speech';return}fail(e.error)};
   rec.onend=()=>{
    clearTimeout(startGuard);onStatus('end');ended=true;if(aborted){finish();return}
    completed=text();current='';
    if(stopping){finish();return}
    // Alguns navegadors acaben la sessió durant una pausa encara que continuous=true.
    if((!error||error==='no-speech')&&restarts++<3){error=null;onStatus('starting');retry=setTimeout(start,150)}
    else {if(!error||error==='no-speech')fail('no-speech');finish()}
   };
   onStatus('starting');
   startGuard=setTimeout(()=>{if(stopping||aborted)return;fail('start-timeout');try{active.abort()}catch{}},12000);
   // Amb la pista del micròfon si en tenim; si el navegador la rebutja, sense.
   if(track&&track.readyState==='live'){try{rec.start(track)}catch(e){if(e?.name==='TypeError'||e?.name==='NotSupportedError'){onStatus('nomic',e.name);rec.start()}else throw e}}
   else rec.start();
  }catch(e){ended=true;fail(e.name==='NotAllowedError'?'not-allowed':'start');finish()}
 }
 start();
 return {
  stop(){
   if(stopPromise)return stopPromise;
   stopping=true;clearTimeout(startGuard);clearTimeout(retry);
   stopPromise=new Promise(resolve=>{resolveStop=resolve});
   if(ended||aborted||opening){finish();return stopPromise}
   // stop() pot precedir onstart mentre s'accepta el permís: onstart ho tornarà a provar.
   guard=setTimeout(()=>{error||=text()?null:'timeout';try{rec.abort()}catch{}finish()},8000);
   try{rec.stop()}catch{}
   return stopPromise;
  },
  abort(){aborted=true;stopping=true;clearTimeout(startGuard);clearTimeout(retry);try{rec?.abort()}catch{}finish()},
 };
}
