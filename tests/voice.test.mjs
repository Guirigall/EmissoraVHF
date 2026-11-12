import test from 'node:test';
import assert from 'node:assert/strict';
class Recognition {
 static instances=[];
 constructor(){Recognition.instances.push(this)}
 start(){}
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
