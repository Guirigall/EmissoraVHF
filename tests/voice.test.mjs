import test from 'node:test';
import assert from 'node:assert/strict';
class Recognition {
 static instances=[];
 constructor(){Recognition.instances.push(this)}
 start(track){this.track=track}
 stop(){this.stops=(this.stops||0)+1;if(!this.started)throw new Error('starting')}
 abort(){this.aborted=true;this.onend?.()}
 ready(){this.started=true;this.onstart()}
 result(...texts){this.onresult({resultIndex:0,results:texts.map(text=>[{transcript:text}])})}
}
globalThis.SpeechRecognition=Recognition;
const {listen}=await import('../voice.js');
const last=()=>Recognition.instances.at(-1);

test('Waits for recognition readiness and accepts final results after release',async()=>{
 const phases=[];const capture=listen('es',()=>{},s=>phases.push(s));const rec=last();
 assert.deepEqual(phases,['starting']);const done=capture.stop();rec.ready();
 assert.equal(rec.stops,2);rec.result('Marina de Mahón, aquí Xaloc, cambio');rec.onend();
 assert.equal((await done).text,'Marina de Mahón, aquí Xaloc, cambio');
});
test('Revised results replace interim text without duplicating it',async()=>{
 const seen=[];const capture=listen('en',text=>seen.push(text));const rec=last();rec.ready();
 rec.result('Mahon');rec.result('Mahon Marina','this is Xaloc');
 const done=capture.stop();rec.onend();assert.equal((await done).text,'Mahon Marina this is Xaloc');assert.equal(seen.at(-1),'Mahon Marina this is Xaloc');
});
test('Restarts after an early browser end while PTT remains held',async()=>{
 const capture=listen('fr');let rec=last();rec.ready();rec.result('Marina');rec.onend();
 await new Promise(r=>setTimeout(r,180));const next=last();assert.notEqual(next,rec);next.ready();next.result('ici Xaloc');
 const done=capture.stop();next.onend();assert.equal((await done).text,'Marina ici Xaloc');
});
test('Reports service failures immediately and does not restart',async()=>{
 const errors=[];const capture=listen('es',()=>{},(s,e)=>{if(s==='error')errors.push(e)});const rec=last();rec.ready();
 rec.onerror({error:'network'});assert.deepEqual(errors,['network']);rec.onend();assert.equal((await capture.stop()).error,'network');
});
test('Aborting cancels pending restarts and ignores late results',async()=>{
 let count=0;const capture=listen('es',()=>count++);const rec=last();rec.ready();rec.onend();capture.abort();
 const before=Recognition.instances.length;rec.result('late');await new Promise(r=>setTimeout(r,180));
 assert.equal(Recognition.instances.length,before);assert.equal(count,0);
});

test('Service startup is distinct from actual audio capture',async()=>{
 const phases=[];const capture=listen('es',()=>{},p=>phases.push(p));const rec=last();rec.ready();
 assert.ok(phases.includes('service'));assert.ok(!phases.includes('ready'));
 rec.onaudiostart();assert.equal(phases.at(-1),'ready');capture.abort();
});

// Regressió de la causa real (12/11/2026): al Chrome de Linux el reconeixedor no rep so per la seva
// pròpia captura. Cal obrir el micròfon i passar-li la pista.
test('Passes the microphone track to the recogniser and releases it afterwards',async()=>{
 let stopped=0;const track={readyState:'live',stop(){stopped++}};const stream={getAudioTracks:()=>[track],getTracks:()=>[track]};
 Object.defineProperty(globalThis.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>stream}});
 try{
  const phases=[],streams=[];const before=Recognition.instances.length;
  const capture=listen('es',()=>{},p=>phases.push(p),s=>streams.push(s));
  await new Promise(r=>setTimeout(r,0));
  const rec=last();assert.equal(Recognition.instances.length,before+1);assert.equal(rec.track,track,'el reconeixedor ha de rebre la pista');
  assert.ok(phases.includes('mic'));assert.equal(streams[0],stream);
  rec.ready();rec.onsoundstart?.();rec.result('Marina de Mahón');const done=capture.stop();rec.onend();
  assert.equal((await done).text,'Marina de Mahón');assert.equal(stopped,1,'la pista s’ha d’alliberar');
  assert.ok(phases.includes('sound'));
 }finally{delete globalThis.navigator.mediaDevices}
});
test('Microphone permission denied is reported as not-allowed',async()=>{
 Object.defineProperty(globalThis.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw Object.assign(new Error('no'),{name:'NotAllowedError'})}}});
 try{
  const errors=[];const before=Recognition.instances.length;const capture=listen('es',()=>{},(p,e)=>{if(p==='error')errors.push(e)});
  await new Promise(r=>setTimeout(r,0));
  assert.deepEqual(errors,['not-allowed']);assert.equal(Recognition.instances.length,before,'sense permís no s’arrenca el reconeixedor');
  assert.equal((await capture.stop()).error,'not-allowed');
 }finally{delete globalThis.navigator.mediaDevices}
});
test('Without a microphone device the browser capture is used',async()=>{
 Object.defineProperty(globalThis.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw Object.assign(new Error('none'),{name:'NotFoundError'})}}});
 try{
  const phases=[];const capture=listen('es',()=>{},p=>phases.push(p));await new Promise(r=>setTimeout(r,0));
  assert.ok(phases.includes('nomic'));assert.equal(last().track,undefined);capture.abort();
 }finally{delete globalThis.navigator.mediaDevices}
});

// Micròfon silenciat al sistema (cas real del 12/11/2026): la pista arriba «muda» i Chrome la rebutja.
test('A muted microphone track is reported as mic-muted',async()=>{
 const track={readyState:'live',muted:true,stop(){},addEventListener(){},removeEventListener(){}};const stream={getAudioTracks:()=>[track],getTracks:()=>[track]};
 Object.defineProperty(globalThis.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>stream}});
 try{
  const errors=[];const before=Recognition.instances.length;const capture=listen('es',()=>{},(p,e)=>{if(p==='error')errors.push(e)});
  await new Promise(r=>setTimeout(r,1700));
  assert.deepEqual(errors,['mic-muted']);assert.equal(Recognition.instances.length,before);assert.equal((await capture.stop()).error,'mic-muted');
 }finally{delete globalThis.navigator.mediaDevices}
});
test('A track that unmutes shortly after opening is used normally',async()=>{
 let unmute;const track={readyState:'live',muted:true,stop(){},addEventListener(n,f){if(n==='unmute')unmute=f},removeEventListener(){}};const stream={getAudioTracks:()=>[track],getTracks:()=>[track]};
 Object.defineProperty(globalThis.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>stream}});
 try{
  const capture=listen('es');await new Promise(r=>setTimeout(r,0));track.muted=false;unmute();
  assert.equal(last().track,track);capture.abort();
 }finally{delete globalThis.navigator.mediaDevices}
});
test('If the browser rejects the track, its own capture is tried',async()=>{
 const track={readyState:'live',muted:false,stop(){}};const stream={getAudioTracks:()=>[track],getTracks:()=>[track]};
 Object.defineProperty(globalThis.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>stream}});
 const original=Recognition.prototype.start;
 Recognition.prototype.start=function(t){if(t)throw Object.assign(new Error('bad track'),{name:'InvalidStateError'});this.plain=true};
 try{const phases=[];const capture=listen('es',()=>{},(p,e)=>phases.push(p+':'+(e||'')));await new Promise(r=>setTimeout(r,0));
  assert.ok(last().plain);assert.ok(phases.includes('nomic:InvalidStateError'));capture.abort();
 }finally{Recognition.prototype.start=original;delete globalThis.navigator.mediaDevices}
});
