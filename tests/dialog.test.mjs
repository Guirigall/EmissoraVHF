import test from 'node:test';import assert from 'node:assert/strict';
import {respond,newState,dscAlert,parseLength,parseNights,parsePersons} from '../dialog.js';
const talk=(state,channel,text,lang='ca',power='hi')=>respond({text,channel,lang,power,vessel:'Xaloc',state,random:()=>0});
test('Crida al 16, canvi al canal de treball i amarrament en dues passes',()=>{
 const s=newState();
 let r=talk(s,16,'Marina de Maó, Marina de Maó, aquí veler Xaloc, canvi');
 assert.equal(r.replies[0].station,'marina');assert.match(r.replies[0].text,/canal 9/);assert.equal(r.tips.length,0);
 r=talk(s,9,'Marina de Maó, aquí Xaloc, canvi');assert.match(r.replies[0].text,/Endavant/);
 r=talk(s,9,'Voldríem amarrament per a dues nits, canvi');assert.match(r.replies[0].text,/eslora/);
 r=talk(s,9,'Fem onze metres, canvi');assert.match(r.replies[0].text,/pantalà C, plaça \d+, per a 2 nits/);
 r=talk(s,9,'Gràcies, canvi i fora');assert.match(r.replies[0].text,/fora\./);
});
test('Respostes en castellà i anglès',()=>{
 let s=newState(),r=talk(s,16,'Prácticos de Mahón, aquí Xaloc, cambio','es');assert.match(r.replies[0].text,/Pase al canal 12, cambio/);
 r=talk(s,12,'Solicito entrar a puerto, cambio','es');assert.match(r.replies[0].text,/Autorizado a entrar/);
 s=newState();r=talk(s,16,'Tramuntana, Tramuntana, this is Xaloc, over','en');assert.match(r.replies[0].text,/seven two/);
 r=talk(s,72,'Where are you? Over','en');assert.match(r.replies[0].text,/Cala Teulera/);
});
test('Canal equivocat, ningú cridat i abast de 1 W',()=>{
 const s=newState();
 let r=talk(s,72,'Marina de Maó, aquí Xaloc, canvi');assert.equal(r.replies.length,0);assert.match(r.tips[0],/no escolta el canal 72/);
 r=talk(s,8,'Hola, hi ha algú?');assert.equal(r.replies.length,0);assert.match(r.tips[0],/Ningú no ha respost/);
 r=talk(s,16,'Salvament Marítim, aquí Xaloc, prova de ràdio, canvi','ca','lo');assert.equal(r.replies.length,0);assert.match(r.tips.join(),/1 W/);
 r=talk(s,16,'Salvament Marítim, aquí Xaloc, prova de ràdio, canvi','ca','hi');assert.match(r.replies[0].text,/sobre cinc/);assert.match(r.replies[0].text,/canal de treball/);
});
test('Mayday: demana les dades que falten i després envia ajuda',()=>{
 const s=newState();
 let r=talk(s,16,'Mayday mayday mayday, aquí veler Xaloc, tenim una via d’aigua, canvi');
 assert.equal(r.replies[0].station,'sar');assert.match(r.replies[0].text,/posició.*persones/);
 r=talk(s,16,'Som a dues milles al sud de l’illa de l’Aire, quatre persones a bord, canvi');assert.match(r.replies[0].text,/4 persones a bord/);
 r=talk(s,16,'Cancel·lo el mayday, tot correcte, canvi');assert.match(r.replies[0].text,/cancel·lació/);
 const off=talk(newState(),72,'Mayday mayday mayday aquí Xaloc');assert.equal(off.replies.length,0);assert.match(off.tips[0],/canal 16/);
 const d=dscAlert({lang:'en',vessel:'Xaloc',state:newState()});assert.match(d.replies[0].text,/DSC distress alert/);
});
test('Lectura de nombres en tres llengües',()=>{
 assert.equal(parseLength('eslora 11,5 metres'),11.5);assert.equal(parseLength('dotze metres'),12);assert.equal(parseLength('forty feet'),null);assert.equal(parseLength('36 feet'),11);
 assert.equal(parseNights('tres noches'),3);assert.equal(parseNights('a week'),7);assert.equal(parseNights('dues nits'),2);
 assert.equal(parsePersons('somos cinco'),5);assert.equal(parsePersons('two persons on board'),2);
});
test('Frases lliures: sinònims, errors de reconeixement i gent sentida al canal',()=>{
 const s=newState();
 let r=talk(s,9,'Bon dia, tindríeu lloc per passar la nit? Fem deu metres');assert.equal(r.replies[0].station,'marina');assert.match(r.replies[0].text,/nits/);
 r=talk(s,9,'A quina hora tanca l’oficina?');assert.match(r.replies[0].text,/vuit/);
 r=talk(s,9,'Quant costaria una nit?');assert.match(r.replies[0].text,/euros/);
 r=talk(s,9,'El meu gos s’ha escapat');assert.match(r.replies[0].text,/amarrament|plaça/);
 r=talk(newState(),9,'Marina de Mao, aqui Xaloc, voldriem amarament per dues nits, eslora onse metres');assert.match(r.replies[0].text,/pantalà/);
 const marta={name:'Marta · Bonaventura',lang:'ca',pitch:1.2,rate:1,signal:.7};
 r=respond({text:'Marta, com ha anat la pesca?',channel:72,lang:'es',vessel:'Xaloc',state:newState(),heard:[marta],random:()=>0});
 assert.equal(r.replies[0].name,'Marta · Bonaventura');assert.equal(r.replies[0].lang,'ca');assert.match(r.replies[0].text,/canvi/);
 r=talk(newState(),72,'Tramuntana, teniu gel per deixar-nos?');assert.match(r.replies[0].text,/neumàtica|en tenim|deixar/);
});
test('Les variants no repeteixen la mateixa frase seguida',()=>{
 const s=newState();let last='';let rnd=0;
 for(let i=0;i<6;i++){const r=respond({text:'Marina de Maó, aquí Xaloc, canvi',channel:9,lang:'ca',vessel:'Xaloc',state:s,random:()=>(rnd=(rnd+.37)%1)});assert.notEqual(r.replies[0].text,last);last=r.replies[0].text}
});
