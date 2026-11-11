import test from 'node:test';import assert from 'node:assert/strict';
import {situation} from '../ai.js';
test('La situació enviada a Claude diu qui et pot sentir i qui no',()=>{
 const s=situation({text:'Marina, plaça per a una nit?',channel:9,lang:'ca',power:'lo',vessel:'Xaloc',heard:[{name:'Sirocco',lang:'ca'}],history:[{who:'Sirocco',text:'Hola'}]});
 assert.match(s,/Can hear you[^]*marina/);assert.match(s,/sar \(Salvament Marítim\): not listening on channel 9/);
 assert.match(s,/"Sirocco"/);assert.match(s,/1 W/);assert.match(s,/Marina, plaça per a una nit\?/);
 const far=situation({text:'Salvament, prova',channel:16,lang:'es',power:'lo',vessel:'Xaloc'});assert.match(far,/sar \(Salvamento Marítimo\): out of range at 1 W/);
});
