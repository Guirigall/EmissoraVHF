import test from 'node:test';import assert from 'node:assert/strict';
import {channels,info,step} from '../channels.js';
test('Freqüències del pla internacional',()=>{
 assert.equal(channels.length,57);
 for(const [ch,f] of [[16,156.8],[9,156.45],[70,156.525],[72,156.625],[77,156.875],[6,156.3],[13,156.65],[88,157.425]])assert.equal(info(ch).tx,f,'canal '+ch);
 assert.equal(info(20).duplex,true);assert.equal(info(20).rx,161.6);assert.equal(info(16).duplex,false);
 for(const ch of [70,87,88,75,76])assert.equal(info(ch).txAllowed,false);
 assert.equal(info(15).lowPowerOnly,true);
});
test('El dial salta de 28 a 60 i dona la volta',()=>{assert.equal(step(28,1),60);assert.equal(step(60,-1),28);assert.equal(step(88,1),1);assert.equal(step(1,-1),88)});
