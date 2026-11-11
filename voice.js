// Veu: síntesi (respostes i trànsit) i reconeixement (el que dius amb el PTT premut).
const LOCALE={ca:'ca-ES',es:'es-ES',en:'en-GB'};
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
 const pool=voicesFor(lang).length?voicesFor(lang):lang==='ca'&&voicesFor('es').length?voicesFor('es'):voicesFor('en');
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
// Escolta mentre el PTT és premut. stop() retorna el text reconegut.
export function listen(lang,onInterim=()=>{}){
 const rec=new Recognition();rec.lang=LOCALE[lang]||lang;rec.interimResults=true;rec.continuous=true;rec.maxAlternatives=1;
 let finalText='',interim='',error=null,ended=false,resolveEnd;
 const endPromise=new Promise(r=>resolveEnd=r);
 rec.onresult=e=>{interim='';for(let i=e.resultIndex;i<e.results.length;i++){const r=e.results[i];if(r.isFinal)finalText+=r[0].transcript+' ';else interim+=r[0].transcript}onInterim((finalText+interim).trim())};
 rec.onerror=e=>{error=e.error};
 rec.onend=()=>{ended=true;resolveEnd()};
 try{rec.start()}catch(e){error='start';ended=true;resolveEnd()}
 return {
  async stop(){if(!ended){try{rec.stop()}catch{}await Promise.race([endPromise,new Promise(r=>setTimeout(r,2500))])}return {text:(finalText+interim).trim(),error}},
  abort(){try{rec.abort()}catch{}},
 };
}
