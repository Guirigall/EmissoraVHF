import test from 'node:test';import assert from 'node:assert/strict';
import {Traffic,generate,voiceChannels,lineDuration} from '../traffic.js';
test('Converses generades: variades, ben formades i amb torns alternats',()=>{
 const texts=new Set();
 for(let i=0;i<200;i++)for(const ch of voiceChannels){const ex=generate(ch);assert.ok(ex.length>=1);
  for(const [j,l] of ex.entries()){assert.ok(['es','en','fr'].includes(l.who.lang),'llengua de veu: '+l.who.lang);assert.doesNotMatch(l.text,/[{}]|undefined|NaN/);assert.ok(lineDuration(l)<20000,l.text.slice(0,40));texts.add(l.text);
   if(j&&[72,77].includes(ch))assert.notEqual(l.who,ex[j-1].who,'la mateixa persona parla dos cops seguits')}}
 assert.ok(texts.size>1500,'frases diferents: '+texts.size);
});
test('Els canals avancen sols, el sintonitzat no es trepitja i es recorda qui ha parlat',()=>{
 let seed=1;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
 const t=new Traffic(0,rnd);let spoken=0,now=0,heard=null;
 for(;now<10*60*1000;now+=100){
  t.tick(now,72);
  if(heard&&now>=heard.until){t.done(72,now);heard=null}
  if(!heard){const line=t.take(72,now);if(line){spoken++;heard={until:now+line.duration};assert.equal(t.take(72,now+50),null)}}
 }
 assert.ok(spoken>10,'frases al 72 en deu minuts: '+spoken);
 assert.ok(t.heard(72).length>0&&t.heard(72).length<=6);
 t.hold(72,now+60000);assert.equal(t.take(72,now+1000),null);
});
