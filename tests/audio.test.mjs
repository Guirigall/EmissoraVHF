import test from 'node:test';
import assert from 'node:assert/strict';
import {RadioAudio} from '../audio.js';

test('Volume remains usable after shutdown and audio state resets',()=>{
 const audio=new RadioAudio();let closed=0;
 audio.ctx={close(){closed++}};audio.master={gain:{setTargetAtTime(){throw Error('closed context')}}};
 audio.carrier=.8;audio.transmitting=true;audio.stop();
 assert.doesNotThrow(()=>audio.setVolume(.2));assert.equal(audio.volume,.2);
 assert.equal(closed,1);assert.equal(audio.carrier,0);assert.equal(audio.transmitting,false);
});

test('Late microphone permission releases stream after shutdown',async()=>{
 const original=Object.getOwnPropertyDescriptor(globalThis,'navigator');let grant,stopped=0;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{getUserMedia:()=>new Promise(r=>grant=r)}}});
 try{
  const audio=new RadioAudio();audio.ctx={state:'running',close(){}};
  const pending=audio.micMeter(()=>{});audio.stop();
  grant({getTracks:()=>[{stop(){stopped++}}]});const stop=await pending;stop();assert.equal(stopped,1);
 }finally{if(original)Object.defineProperty(globalThis,'navigator',original);else delete globalThis.navigator}
});
