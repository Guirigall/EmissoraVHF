import test from 'node:test';import assert from 'node:assert/strict';
import {respond,newState,dscAlert,parseLength,parseNights,parsePersons} from '../dialog.js';
const talk=(state,channel,text,lang='es',power='hi',ui='ca')=>respond({text,channel,lang,ui,power,vessel:'Xaloc',state,random:()=>0});
test('Crida al 16, canvi al canal de treball i amarrament en dues passes (castellà)',()=>{
 const s=newState();
 let r=talk(s,16,'Marina de Mahón, Marina de Mahón, aquí velero Xaloc, cambio');
 assert.equal(r.replies[0].station,'marina');assert.match(r.replies[0].text,/canal 9/);assert.equal(r.tips.length,0);
 r=talk(s,9,'Marina de Mahón, aquí Xaloc, cambio');assert.match(r.replies[0].text,/Adelante/);
 r=talk(s,9,'Queremos amarre para dos noches, cambio');assert.match(r.replies[0].text,/eslora/);
 r=talk(s,9,'Tenemos once metros, cambio');assert.match(r.replies[0].text,/pantalán C, amarre \d+, para 2 noches/);
 r=talk(s,9,'Gracias, cambio y fuera');assert.match(r.replies[0].text,/fuera\./);
});
test('Francès i anglès',()=>{
 let s=newState(),r=talk(s,16,'Marina de Mahon, Marina de Mahon, ici voilier Xaloc, à vous','fr');assert.match(r.replies[0].text,/Passez sur le canal 9, à vous/);
 r=talk(s,9,'Nous souhaitons une place pour trois nuits, longueur douze mètres, à vous','fr');assert.match(r.replies[0].text,/ponton C, place \d+, pour 3 nuits/);
 r=talk(s,9,'Quel est le prix ?','fr');assert.match(r.replies[0].text,/euros la nuit/);
 s=newState();r=talk(s,16,'Pilotes de Mahon, ici Xaloc, à vous','fr');assert.match(r.replies[0].text,/canal 12/);
 r=talk(s,12,'Nous voulons entrer au port, à vous','fr');assert.match(r.replies[0].text,/Autorisé à entrer/);
 s=newState();r=talk(s,16,'Tramuntana, Tramuntana, this is Xaloc, over','en');assert.match(r.replies[0].text,/seven two/);
 r=talk(s,72,'Where are you? Over','en');assert.match(r.replies[0].text,/Cala Teulera/);
});
test('Canal equivocat, ningú cridat i abast de 1 W; consells en l’idioma de la interfície',()=>{
 const s=newState();
 let r=talk(s,72,'Marina de Mahón, aquí Xaloc, cambio');assert.equal(r.replies.length,0);assert.match(r.tips[0],/Marina de Maó no escolta el canal 72/);
 r=talk(newState(),72,'Marina de Mahón, aquí Xaloc, cambio','es','hi','fr');assert.match(r.tips[0],/Marina de Mahon n’écoute pas le canal 72/);
 r=talk(s,8,'Hola, ¿hay alguien?');assert.equal(r.replies.length,0);assert.match(r.tips[0],/Ningú no ha respost/);
 r=talk(s,16,'Salvamento Marítimo, aquí Xaloc, prueba de radio, cambio','es','lo');assert.equal(r.replies.length,0);assert.match(r.tips.join(),/1 W/);
 r=talk(s,16,'Salvamento Marítimo, aquí Xaloc, prueba de radio, cambio','es','hi');assert.match(r.replies[0].text,/sobre cinco/);assert.match(r.replies[0].text,/canal de trabajo/);
 r=talk(newState(),9,'Marina de Mahón, aquí Xaloc, combustible','es','hi','en');assert.match(r.tips.join(),/“cambio”/);
});
test('Mayday: demana les dades que falten, envia ajuda i accepta la cancel·lació',()=>{
 const s=newState();
 let r=talk(s,16,'Mayday mayday mayday, aquí velero Xaloc, tenemos una vía de agua, cambio');
 assert.equal(r.replies[0].station,'sar');assert.match(r.replies[0].text,/posición.*personas/);
 r=talk(s,16,'Estamos a dos millas al sur de la isla del Aire, cuatro personas a bordo, cambio');assert.match(r.replies[0].text,/4 personas a bordo/);
 r=talk(s,16,'Cancelo el mayday, todo bien, cambio');assert.match(r.replies[0].text,/cancelación/);
 const fr=newState();r=talk(fr,16,'Mayday mayday mayday, ici voilier Xaloc, incendie à bord, nous sommes trois, à deux milles au nord du phare, à vous','fr');assert.match(r.replies[0].text,/3 personnes à bord/);
 const off=talk(newState(),72,'Mayday mayday mayday aquí Xaloc');assert.equal(off.replies.length,0);assert.match(off.tips[0],/canal 16/);
 const d=dscAlert({lang:'en',ui:'es',vessel:'Xaloc',state:newState()});assert.match(d.replies[0].text,/DSC distress alert/);assert.match(d.tips[0],/simulación/);
});
test('Lectura de nombres en castellà, anglès i francès',()=>{
 assert.equal(parseLength('eslora 11,5 metros'),11.5);assert.equal(parseLength('doce metros'),12);assert.equal(parseLength('36 feet'),11);assert.equal(parseLength('douze mètres'),12);
 assert.equal(parseNights('tres noches'),3);assert.equal(parseNights('a week'),7);assert.equal(parseNights('deux nuits'),2);
 assert.equal(parsePersons('somos cinco'),5);assert.equal(parsePersons('two persons on board'),2);assert.equal(parsePersons('nous sommes quatre'),4);
});
test('Frases lliures: sinònims, errors de reconeixement i gent sentida al canal',()=>{
 const s=newState();
 let r=talk(s,9,'Buenos días, ¿tendríais sitio para pasar la noche? Somos un velero de diez metros');assert.equal(r.replies[0].station,'marina');assert.match(r.replies[0].text,/noches/);
 r=talk(s,9,'¿A qué hora cierra la oficina?');assert.match(r.replies[0].text,/ocho/);
 r=talk(s,9,'¿Cuánto costaría una noche?');assert.match(r.replies[0].text,/euros/);
 r=talk(s,9,'Se nos ha escapado el perro');assert.match(r.replies[0].text,/amarre/);
 r=talk(newState(),9,'Marina de Mahon, aqui Xaloc, queriamos amare para dos noches, eslora onse metros');assert.match(r.replies[0].text,/pantalán/);
 const pierre={name:'Pierre · Mistral',lang:'fr',pitch:1.1,rate:1,signal:.7};
 r=respond({text:'Pierre, ¿qué tal la pesca?',channel:72,lang:'es',vessel:'Xaloc',state:newState(),heard:[pierre],random:()=>0});
 assert.equal(r.replies[0].name,'Pierre · Mistral');assert.equal(r.replies[0].lang,'fr');assert.match(r.replies[0].text,/à vous/);
 r=talk(newState(),72,'Tramuntana, ¿tenéis hielo para dejarnos?');assert.match(r.replies[0].text,/neumática|tenemos|dejar/);
});
test('Les variants no repeteixen la mateixa frase seguida',()=>{
 const s=newState();let last='';let rnd=0;
 for(let i=0;i<6;i++){const r=respond({text:'Marina de Mahón, aquí Xaloc, cambio',channel:9,lang:'es',vessel:'Xaloc',state:s,random:()=>(rnd=(rnd+.37)%1)});assert.notEqual(r.replies[0].text,last);last=r.replies[0].text}
});
