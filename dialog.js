// Motor de converses: decideix qui respon, què diu i quins consells de procediment cal donar.
// Funció pura (sense navegador) perquè es pugui provar amb Node.
import {stations,byId} from './stations.js';
import {info} from './channels.js';
import {VAR,HELP,MARINA,TOPICS,SMALL,PLACES} from './chatter.js';
import {t as tr,PROWORDS} from './i18n.js';

export function normalize(text){
 return String(text||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()
  .replace(/·/g,'').replace(/[^a-z0-9]+/g,' ').trim();
}
const padded=t=>' '+t+' ';
// Distància d'edició (per tolerar errors del reconeixement de veu i d'ortografia).
function lev(a,b){if(a===b)return 0;let prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){const cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur}return prev[b.length]}
const near=(a,b)=>{if(a===b)return true;if(b.length<5)return false;if(a.startsWith(b)&&a.length-b.length<=4)return true;const tol=b.length>=8?2:1;return Math.abs(a.length-b.length)<=tol&&lev(a,b)<=tol};
// Conté alguna de les expressions? Exacta o amb petites diferències en paraules de cinc lletres o més.
export function has(t,list){
 const pt=padded(t);if(list.some(p=>pt.includes(padded(p))))return true;
 const w=t.split(' ');
 return list.some(p=>{const pw=p.split(' ');if(!pw.some(x=>x.length>=5))return false;
  for(let i=0;i+pw.length<=w.length;i++)if(pw.every((x,j)=>near(w[i+j],x)))return true;return false});
}

const K={
 check:['essai radio','essai de radio','comment me recevez vous','comment me recevez','me recevez vous','prova de radio','prova radio','prova de comunicacio','proves de radio','radio check','radiocheck','prueba de radio','prueba radio','comprobacion de radio','como me recibe','como me recibes','como me copia','com em rep','com em reps','com em rebeu','how do you read','how do you copy','how copy'],
 berth:['une place','place pour','amarrage','anneau','poste d amarrage','passer la nuit','pour la nuit','lloc per','una placa','placa per','espai per','passar la nit','quedar nos','pantalan','amarres','sitio para','hueco','pasar la noche','quedarnos','moor','space for','overnight','amarrament','amarrar','amarratge','amarrem','placa','pantala','atracar','atraque','amarre','amarrar','berth','mooring','a space','slip'],
 fuel:['carburant','gazole','essence','faire le plein','carburant','omplir el diposit','llenar el deposito','fill up','petrol','combustible','gasoil','gasolina','benzina','benzinera','diesel','fuel','gasolinera','repostar'],
 weather:['meteo','previsions','quel temps','bulletin','meteorologia','meteorologica','temps fara','que tiempo','como esta el tiempo','que temps','fara vent','onatge','oleaje','meteo','previsio','el temps','quin temps','parte','tiempo','prevision','weather','forecast'],
 enter:['entrer','entree','nous entrons','rentrer au port','entrar','entrada','entrant','entrem','entrando','enter','entering','inbound'],
 leave:['sortir','sortie','partir','appareiller','nous partons','marxar','marxem','ens n anem','irnos','nos vamos','zarpar','salpar','cast off','sortir','sortida','sortint','sortim','salir','salida','saliendo','leave','leaving','depart','departing','outbound'],
 bye:['termine','merci','au revoir','a plus tard','fins ara','fins despres','hasta luego','see you','canvi i fora','cambio y fuera','over and out','fora','out','gracies','moltes gracies','gracias','muchas gracias','thank you','thanks','adeu','adios','bye'],
 repeat:['repetez','repetez s il vous plait','repeteixi','repeteix','repetiu','repita','repite','say again','repeat'],
 where:['ou etes vous','ou es tu','vous etes ou','on sou ara','on heu fondejat','donde andais','donde habeis fondeado','where are you anchored','on sou','on esteu','on estas','on ets','donde estais','donde estas','donde esta','where are you'],
 how:['comment ca va','ca va','comment allez vous','com anem','com us va','que tal tot','como va','como os va','how s it going','how are things','whats up','com va','com esteu','com estas','que tal','como estais','como estas','how are you','how is it','hows it'],
 plan:['demain','vous allez ou','quels sont vos plans','on anireu','cap on aneu','adonde vais','where are you going','dema','que fareu','plans','manana','que hareis','tomorrow','plan','plans'],
 cancel:['annule','j annule','annulation','tout va bien','fausse alerte','cancel','cancelo','cancello','cancela','cancelem','anulo','tot correcte','tot be','todo bien','all ok','all good','falsa alarma','false alarm'],
 mayday:['mayday','may day','maydei','mei dei','meidei','maide','mayde'],
 panpan:['pan pan','panpan','pam pam','pan pam'],
 securite:['securite','securite','security','seguridad','seguretat'],
 identify:['ici','aqui','this is','aca','de aqui'],
 over:['a vous','canvi','cambio','over'],
 water:['eau et electricite','electricite','prise de courant','aigua i llum','electricitat','presa de corrent','corrent electric','agua y luz','electricidad','toma de corriente','shore power','electricity','water and power'],
 shower:['douche','douches','sanitaires','dutxa','dutxes','lavabos','ducha','duchas','aseos','shower','showers','toilets'],
 laundry:['laverie','machine a laver','bugaderia','rentadora','rentar la roba','lavanderia','lavadora','laundry','washing machine'],
 price:['combien','prix','tarif','ca coute','preus','quant costaria','cuanto costaria','preu','quant costa','quant val','tarifa','precio','cuanto cuesta','cuanto vale','price','how much'],
 hours:['horaires','a quelle heure','quand ouvre','quand ferme','horari','a quina hora','quan obre','quan tanca','horario','a que hora','cuando abre','cuando cierra','opening hours','what time'],
 arrive:['nous arrivons','a l entree du port','on arrive','som a la bocana','ja som aqui','estem arribant','arribem ara','som a l entrada','llegando','estamos llegando','estamos en la bocana','at the entrance','arriving now','we are arriving'],
 restaurant:['restaurant','ou manger','restaurant','restaurante','on podem sopar','donde cenar','where to eat'],
 allStations:['a toutes les stations','a totes les estacions','a todas las estaciones','all stations'],
};
const NUM={u:1,un:1,una:1,dos:2,dues:2,tres:3,quatre:4,cinc:5,sis:6,set:7,vuit:8,nou:9,deu:10,onze:11,dotze:12,tretze:13,catorze:14,quinze:15,setze:16,disset:17,divuit:18,dinou:19,vint:20,une:1,deux:2,trois:3,quatre:4,cinq:5,sept:7,huit:8,neuf:9,dix:10,douze:12,treize:13,quatorze:14,seize:16,vingt:20,
 uno:1,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,trece:13,catorce:14,quince:15,dieciseis:16,diecisiete:17,dieciocho:18,diecinueve:19,veinte:20,
 one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20};
// Paraules curtes que s'assemblen a números («pour» ~ «four») i no ho són.
const STOP=new Set(['pour','para','pero','avec','with','from','sota','sous','tres','sobre','dels','dues','unes']);
function numberBefore(t,units){
 const w=t.split(' ');
 for(let i=0;i<w.length;i++){if(!units.includes(w[i]))continue;
  for(let j=i-1;j>=Math.max(0,i-2);j--){if(/^\d+$/.test(w[j]))return +w[j];if(NUM[w[j]]!==undefined)return NUM[w[j]];
   // Números mal escrits o mal reconeguts («onse», «dotse»...).
   if(w[j].length>=4&&!STOP.has(w[j])){const k=Object.keys(NUM).find(n=>n.length>=4&&Math.abs(n.length-w[j].length)<=1&&lev(n,w[j])<=1);if(k)return NUM[k]}}}
 return null;
}
export function parseLength(raw){
 const m=normalize(String(raw).replace(/(\d),(\d)/g,'$1.$2').replace(/\./g,'dot')).replace(/dot/g,'.').match(/(\d+(?:[.]\d+)?)\s*(m|mts|metres|metros|meters|metre|metro|meter|peus|pies|feet|ft|pieds)\b/);
 if(m){const v=parseFloat(m[1].replace(',','.'));return /peu|pie|feet|ft|pied/.test(m[2])?Math.round(v*.3048*10)/10:v}
 const t=normalize(raw),v=numberBefore(t,['metres','metros','meters','metre','metro','meter']);
 if(v!==null)return v;const f=numberBefore(t,['peus','pies','feet','pieds']);return f===null?null:Math.round(f*.3048*10)/10;
}
export function parseNights(raw){
 const t=normalize(raw);if(has(t,['una setmana','una semana','a week','one week','une semaine']))return 7;
 return numberBefore(t,['nit','nits','noche','noches','night','nights','dia','dies','dias','days','day','nuit','nuits','jours','jour']);
}
export function parsePersons(raw){
 const t=normalize(raw);
 const n=numberBefore(t,['persones','persona','personas','people','persons','person','tripulants','tripulantes','crew','pax','adults','adultos','personnes','equipiers','adultes']);
 if(n!==null)return n;const m=t.match(/\b(?:som|somos|we are|nous sommes)\s+(\d+|[a-z]+)\b/);if(m)return /^\d+$/.test(m[1])?+m[1]:NUM[m[1]]??null;
 return null;
}
const POSITION=['milles','milla','millas','miles','mile','nm','posicio','posicion','position','latitud','latitude','longitud','longitude','nord','sud','north','south','norte','east','west','oest','oeste','davant','frente','off','cap','cabo','cape','illa','isla','island','cala','bocana','punta','far','faro','lighthouse','milles nautiques','au sud','au nord','ouest','ile','phare'];
const NATURE=['aigua','via','fuego','foc','incendi','incendio','fire','water','flooding','hundiendo','enfonsem','enfonsant','sinking','home a l aigua','hombre al agua','man overboard','ferit','herido','injured','avaria','averia','engine failure','sense motor','sin motor','encallat','encallado','aground','desarborat','desarbolado','dismasted','abordatge','abordaje','collision','voie d eau','incendie','feu','homme a la mer','blesse','panne','echoue','demate','coule'];

const S={
 es:{
  call16:'{v}, aquí {s}. Pase al canal {c}, cambio.',goAhead:'{v}, aquí {s}. Adelante, cambio.',
  check:'{v}, aquí {s}. {q}, cambio.',check16:'{v}, aquí {s}. {q}. Para pruebas de radio, por favor, utilice un canal de trabajo, cambio.',
  notUnderstood:'{v}, aquí {s}. No le he entendido, repita, cambio.',bye:'{v}, aquí {s}. A usted, buena navegación. {s} fuera.',
  berthAsk:'{v}, recibido. ¿Qué eslora tiene la embarcación y cuántas noches se quedará?, cambio.',berthLength:'{v}, recibido. ¿Y la eslora de la embarcación?, cambio.',berthNights:'{v}, recibido. ¿Cuántas noches se quedará?, cambio.',
  berthOk:'{v}, le asignamos el pantalán {p}, amarre {n}, para {nights}. Un marinero le esperará en la bocana con la neumática. Llámenos al canal 9 al llegar, cambio.',
  berthFull:'{v}, lo siento, para {len} metros de eslora no nos queda amarre. Puede fondear en Cala Teulera, a la entrada del puerto, cambio.',
  fuel:'{v}, la gasolinera está en el muelle de espera, abierta de ocho de la mañana a ocho de la tarde. Tenemos gasoil y gasolina, cambio.',
  weather:'{v}, aquí {s}. Previsión para las próximas doce horas: {w}, cambio.',
  enter:'{v}, aquí {s}. Autorizado a entrar. Atención: el ferry Ciutat de Fornells saldrá dentro de diez minutos. Manténgase a estribor del canal, velocidad máxima cinco nudos, cambio.',
  leave:'{v}, aquí {s}. Autorizado a salir. Ahora mismo no hay tráfico en la bocana. Buena navegación, cambio.',
  portBerth:'{v}, para amarres contacte con la Marina de Mahón en el canal 9, cambio.',
  sarOnly:'{v}, aquí {s}. Este canal es para tráfico de salvamento. Para otras consultas utilice el canal 9 o el 72, cambio.',
  maydayAck:'Mayday {v}, aquí {s}. Recibido mayday. Indique su posición, la naturaleza del peligro y el número de personas a bordo, cambio.',
  maydayMore:'Mayday {v}, aquí {s}. Recibido. Necesito {missing}, cambio.',
  maydayHelp:'Mayday {v}, aquí {s}. Recibido, {persons} a bordo. Movilizamos una embarcación de salvamento, tiempo estimado veinte minutos. Todos con el chaleco salvavidas, preparen la balsa salvavidas y mantengan escucha en el canal dieciséis, cambio.',
  maydayActive:'Mayday {v}, aquí {s}. Recibido. La unidad de rescate está en camino. Mantengan escucha en el dieciséis e informen de cualquier cambio, cambio.',
  maydayCancel:'Mayday {v}, aquí {s}. Recibida la cancelación. Fin del tráfico de socorro. {s} fuera.',
  dscAck:'Mayday {v}, aquí {s}. Recibida su alerta DSC de socorro, con la posición. Indique la naturaleza del peligro y el número de personas a bordo, cambio.',
  maydayWho:'Estación en peligro, aquí {s}. Recibido mayday. Identifíquese e indique su posición, cambio.',
  panAck:'Pan-pan {v}, aquí {s}. Recibido. Indique su posición y qué asistencia necesita, cambio.',
  panHelp:'Pan-pan {v}, aquí {s}. Recibido. Avisamos a un remolcador, que le contactará en el canal diez. Mantenga escucha, cambio.',
  securite:'{v}, aquí {s}. Recibido su aviso de seguridad, gracias. Lo difundiremos, cambio.',
  yCall16:'¡{v}, aquí Tramuntana! Pasamos al setenta y dos, cambio.',yHello:'¡Hola, {v}! Aquí Tramuntana, te recibo perfecto. ¿Qué tal por ahí?, cambio.',
  yWhere:'Estamos fondeados en Cala Teulera, a la entrada del puerto. Buen fondo de arena y agua plana, cambio.',
  yHow:'¡Todo bien por aquí! Fuera sopla algo de tramontana, pero en la cala no se mueve nada. ¿Y vosotros?, cambio.',
  yPlan:'Mañana queremos salir hacia Fornells si la tramontana afloja. Si queréis, navegamos juntos, cambio.',
  yWeather:'Dan tramontana fuerza cuatro a cinco hasta la tarde, luego afloja. Yo esperaría a mañana, cambio.',
  yCheck:'¡{q}, {v}! Sin problema, cambio.',
  yGeneric:['¡Recibido, recibido! Aquí hace un día buenísimo, cambio.','¡Ja, te entiendo! Pues nos vemos luego en tierra, cambio.','Recibido. Si necesitáis algo, estamos aquí en el setenta y dos, cambio.'],
  yBye:'¡Vale, {v}! Buena navegación. Tramuntana fuera, volvemos al dieciséis.',
  missing:{position:'su posición',nature:'la naturaleza del peligro',persons:'el número de personas a bordo'},and:' y ',
  nights:n=>n===1?'una noche':n+' noches',persons:n=>n===1?'una persona':n+' personas',
  quality:{5:'Le recibo alto y claro, cinco sobre cinco',4:'Le recibo bien, cuatro sobre cinco',3:'Le recibo con ruido, tres sobre cinco'},
  forecasts:['viento de tramontana fuerza cuatro, ocasionalmente cinco al norte de la isla, marejadilla; buena visibilidad','viento del suroeste fuerza tres, rizada a marejadilla; algunos chubascos por la tarde','viento variable fuerza dos a tres, rizada; buena visibilidad'],
 },
 fr:{
  call16:'{v}, ici {s}. Passez sur le canal {c}, à vous.',goAhead:'{v}, ici {s}. Je vous écoute, à vous.',
  check:'{v}, ici {s}. {q}, à vous.',check16:'{v}, ici {s}. {q}. Pour les essais radio, merci d’utiliser un canal de dégagement, à vous.',
  notUnderstood:'{v}, ici {s}. Je ne vous ai pas compris, répétez, à vous.',bye:'{v}, ici {s}. Bonne navigation. {s}, terminé.',
  berthAsk:'{v}, reçu. Quelle est la longueur du bateau et combien de nuits restez-vous ?, à vous.',berthLength:'{v}, reçu. Et la longueur du bateau ?, à vous.',berthNights:'{v}, reçu. Combien de nuits restez-vous ?, à vous.',
  berthOk:'{v}, nous vous attribuons le ponton {p}, place {n}, pour {nights}. Un marinero vous attendra à l’entrée avec le pneumatique. Appelez-nous sur le canal 9 en arrivant, à vous.',
  berthFull:'{v}, désolé, pour {len} mètres nous n’avons plus de place. Vous pouvez mouiller à Cala Teulera, à l’entrée du port, à vous.',
  fuel:'{v}, la station de carburant est sur le quai d’attente, ouverte de huit heures à vingt heures. Gazole et essence, à vous.',
  weather:'{v}, ici {s}. Prévisions pour les douze prochaines heures : {w}, à vous.',
  enter:'{v}, ici {s}. Autorisé à entrer. Attention : le ferry Ciutat de Fornells appareille dans dix minutes. Restez sur tribord du chenal, vitesse maximale cinq nœuds, à vous.',
  leave:'{v}, ici {s}. Autorisé à sortir. Pas de trafic à l’entrée pour le moment. Bonne navigation, à vous.',
  portBerth:'{v}, pour une place au port, contactez la Marina de Mahon sur le canal 9, à vous.',
  sarOnly:'{v}, ici {s}. Ce canal est réservé au trafic de sauvetage. Pour le reste, utilisez le canal 9 ou le 72, à vous.',
  maydayAck:'Mayday {v}, ici {s}. Reçu mayday. Donnez votre position, la nature de la détresse et le nombre de personnes à bord, à vous.',
  maydayMore:'Mayday {v}, ici {s}. Reçu. Il me faut {missing}, à vous.',
  maydayHelp:'Mayday {v}, ici {s}. Reçu, {persons} à bord. Nous envoyons une vedette de sauvetage, délai estimé vingt minutes. Tout le monde en gilet de sauvetage, préparez le radeau et restez à l’écoute sur le canal seize, à vous.',
  maydayActive:'Mayday {v}, ici {s}. Reçu. Le moyen de sauvetage est en route. Restez à l’écoute sur le seize et signalez tout changement, à vous.',
  maydayCancel:'Mayday {v}, ici {s}. Annulation reçue. Fin du trafic de détresse. {s}, terminé.',
  dscAck:'Mayday {v}, ici {s}. Votre alerte de détresse ASN avec la position est reçue. Donnez la nature de la détresse et le nombre de personnes à bord, à vous.',
  maydayWho:'Station en détresse, ici {s}. Reçu mayday. Identifiez-vous et donnez votre position, à vous.',
  panAck:'Pan-pan {v}, ici {s}. Reçu. Donnez votre position et l’assistance nécessaire, à vous.',
  panHelp:'Pan-pan {v}, ici {s}. Reçu. Nous prévenons un remorqueur, qui vous contactera sur le canal dix. Restez à l’écoute, à vous.',
  securite:'{v}, ici {s}. Votre message de sécurité est reçu, merci. Nous allons le rediffuser, à vous.',
  yCall16:'{v}, ici Tramuntana ! On passe sur le soixante-douze, à vous.',yHello:'Salut {v} ! Ici Tramuntana, je te reçois parfaitement. Ça va par là-bas ?, à vous.',
  yWhere:'On est au mouillage à Cala Teulera, à l’entrée du port. Bon fond de sable et eau plate, à vous.',
  yHow:'Tout va bien ici ! Dehors il y a un peu de tramontane, mais dans la crique rien ne bouge. Et vous ?, à vous.',
  yPlan:'Demain on veut partir vers Fornells si la tramontane faiblit. Si vous voulez, on navigue ensemble, à vous.',
  yWeather:'Ils annoncent tramontane force quatre à cinq jusqu’au soir, puis ça faiblit. J’attendrais demain, à vous.',
  yCheck:'{q}, {v} ! Pas de souci, à vous.',
  yGeneric:['Reçu, reçu ! Ici il fait un temps magnifique, à vous.','Ha, je vois ! On se voit plus tard à terre, à vous.','Reçu. Si vous avez besoin de quelque chose, on est là sur le soixante-douze, à vous.'],
  yBye:'D’accord {v} ! Bonne navigation. Tramuntana terminé, on repasse sur le seize.',
  missing:{position:'votre position',nature:'la nature de la détresse',persons:'le nombre de personnes à bord'},and:' et ',
  nights:n=>n===1?'une nuit':n+' nuits',persons:n=>n===1?'une personne':n+' personnes',
  quality:{5:'Je vous reçois fort et clair, cinq sur cinq',4:'Je vous reçois bien, quatre sur cinq',3:'Je vous reçois avec du bruit, trois sur cinq'},
  forecasts:['vent de nord, tramontane force quatre, localement cinq au nord de l’île, mer peu agitée ; bonne visibilité','vent de sud-ouest force trois, mer belle à peu agitée ; quelques averses l’après-midi','vent variable force deux à trois, mer belle ; bonne visibilité'],
 },
 en:{
  call16:'{v}, this is {s}. Go to channel {c}, over.',goAhead:'{v}, this is {s}. Go ahead, over.',
  check:'{v}, this is {s}. {q}, over.',check16:'{v}, this is {s}. {q}. For radio checks, please use a working channel, over.',
  notUnderstood:'{v}, this is {s}. Say again, over.',bye:'{v}, this is {s}. Have a good trip. {s} out.',
  berthAsk:'{v}, roger. What is your length overall, and how many nights will you stay? Over.',berthLength:'{v}, roger. And your length overall? Over.',berthNights:'{v}, roger. How many nights will you stay? Over.',
  berthOk:'{v}, we have pontoon {p}, berth {n} for you, for {nights}. A marinero will meet you at the entrance in the rib. Call us on channel 9 when you get there, over.',
  berthFull:'{v}, sorry, we have no berth left for {len} metres. You can anchor in Cala Teulera, at the harbour entrance, over.',
  fuel:'{v}, the fuel dock is on the waiting quay, open from eight to eight. Diesel and petrol available, over.',
  weather:'{v}, this is {s}. Forecast for the next twelve hours: {w}, over.',
  enter:'{v}, this is {s}. Cleared to enter. Be advised, ferry Ciutat de Fornells departs in ten minutes. Keep to the starboard side of the channel, maximum speed five knots, over.',
  leave:'{v}, this is {s}. Cleared to leave. No traffic at the entrance right now. Have a good trip, over.',
  portBerth:'{v}, for berths please call Mahon Marina on channel 9, over.',
  sarOnly:'{v}, this is {s}. This channel is for rescue traffic. For other matters please use channel 9 or 72, over.',
  maydayAck:'Mayday {v}, this is {s}. Received mayday. Give your position, the nature of distress and the number of persons on board, over.',
  maydayMore:'Mayday {v}, this is {s}. Roger. I need {missing}, over.',
  maydayHelp:'Mayday {v}, this is {s}. Roger, {persons} on board. We are sending a rescue vessel, estimated time twenty minutes. Everybody put on lifejackets, prepare the liferaft and keep listening on channel sixteen, over.',
  maydayActive:'Mayday {v}, this is {s}. Roger. The rescue unit is on its way. Keep listening on sixteen and report any change, over.',
  maydayCancel:'Mayday {v}, this is {s}. Cancellation received. Distress traffic ended. {s} out.',
  dscAck:'Mayday {v}, this is {s}. Your DSC distress alert with position is received. State the nature of distress and the number of persons on board, over.',
  maydayWho:'Station in distress, this is {s}. Received mayday. Identify yourself and give your position, over.',
  panAck:'Pan-pan {v}, this is {s}. Roger. Give your position and what assistance you need, over.',
  panHelp:'Pan-pan {v}, this is {s}. Roger. We are calling a tug, who will contact you on channel ten. Keep listening, over.',
  securite:'{v}, this is {s}. Your safety message is received, thank you. We will rebroadcast it, over.',
  yCall16:'{v}, this is Tramuntana! Let’s go to seven two, over.',yHello:'Hi {v}! Tramuntana here, I hear you perfectly. How are things over there? Over.',
  yWhere:'We are anchored in Cala Teulera, at the harbour entrance. Good sandy bottom and flat water, over.',
  yHow:'All good here! A bit of tramontane wind outside, but nothing moves in the cove. How about you? Over.',
  yPlan:'Tomorrow we want to head to Fornells if the wind eases. If you like, we can sail together, over.',
  yWeather:'They say northerly force four to five until the evening, easing later. I would wait until tomorrow, over.',
  yCheck:'{q}, {v}! No problem, over.',
  yGeneric:['Roger, roger! Lovely day over here, over.','Ha, got it! See you ashore later then, over.','Roger. If you need anything, we are here on seven two, over.'],
  yBye:'Okay {v}! Have a good sail. Tramuntana out, back to sixteen.',
  missing:{position:'your position',nature:'the nature of distress',persons:'the number of persons on board'},and:' and ',
  nights:n=>n===1?'one night':n+' nights',persons:n=>n===1?'one person':n+' persons',
  quality:{5:'Loud and clear, five by five',4:'Reading you well, four by five',3:'Readable with noise, three by five'},
  forecasts:['northerly wind force four, occasionally five north of the island, slight sea; good visibility','southwesterly force three, smooth to slight sea; some showers in the afternoon','variable wind force two to three, smooth sea; good visibility'],
 },
};
const fill=(s,vars)=>s.replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
const hash=s=>[...String(s)].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7);

export function newState(){return {conv:{},shown:{}}}
export const RANGE={hi:25,lo:5};

// input: {text, channel, lang, power:'hi'|'lo', vessel, state, random}
// ui: idioma de la interfície (per als consells). lang: llengua de ràdio (castellà, anglès o francès).
export function respond({text,channel,lang='es',ui='ca',power='hi',vessel='Xaloc',state=newState(),random=Math.random,heard=[]}){
 const L=S[lang]||S.es,t=normalize(text),out={replies:[],tips:[],state};
 if(!t)return out;
 const tip=(key,vars={})=>{out.tips.push(tr('tip.'+key,{v:vessel,over:(PROWORDS[lang]||PROWORDS.es).over,...vars},ui))};
 const once=(key,vars)=>{if(state.shown[key])return;state.shown[key]=true;tip(key,vars)};
 const ch=info(channel),effPower=ch.lowPowerOnly?'lo':power;
 const nameOf=st=>typeof st.name==='string'?st.name:st.name[lang]||st.name.es;
 // Tria una variant (base + VAR) sense repetir la darrera que ha dit aquella estació.
 const choose=(conv,opts)=>{let c=opts[Math.floor(random()*opts.length)];if(opts.length>1&&c===conv.lastTemplate)c=opts[(opts.indexOf(c)+1)%opts.length];conv.lastTemplate=c;return c};
 const emit=(st,text,replyLang=lang)=>{const conv=state.conv[st.id]||={stage:'idle'};conv.last=text;out.replies.push({station:st.id,text,lang:replyLang,...(st.voice&&st.kind==='heard'?{name:st.name,voice:st.voice}:{})})};
 const say=(st,key,vars={})=>{const base=L[key],opts=[...(Array.isArray(base)?base:base!=null?[base]:[]),...((VAR[lang]||{})[key]||[])];
  const conv=state.conv[st.id]||={stage:'idle'};emit(st,fill(choose(conv,opts),{v:vessel,s:nameOf(st),c:st.work,...vars}))};
 const help=st=>{const opts=HELP[lang]?.[st.kind];if(!opts)return say(st,'notUnderstood');const conv=state.conv[st.id]||={stage:'idle'};emit(st,fill(choose(conv,opts),{v:vessel,s:nameOf(st)}))};
 const marina=(st,key,vars={})=>{const conv=state.conv[st.id]||={stage:'idle'};emit(st,fill(choose(conv,MARINA[lang][key]),{v:vessel,s:nameOf(st),...vars}))};
 const question=/\?|^(que|qu|com|on|quan|per que|quant|quin|quina|como|donde|cuando|cuanto|cual|what|where|when|how|why|which|do you|are you|is there)\b/.test(String(text).toLowerCase().trim())||/\?/.test(text);
 // Conversa informal: es tria el tema pel que s'ha dit. La gent del trànsit parla la seva pròpia llengua.
 const smallTalk=st=>{const sl=st.kind==='heard'?st.lang:lang,L2=SMALL[sl]||SMALL.es,conv=state.conv[st.id]||={stage:'idle'};
  const topic=(['where','how','plan'].find(k=>has(t,K[k])))||['favor','fish','food','weather','swim','wildlife','boat','help','thanks','greet'].find(k=>has(t,TOPICS[k]));
  const key=topic||(question?'question':'generic');
  emit(st,fill(choose(conv,L2[key]),{v:vessel,place:PLACES[Math.floor(random()*PLACES.length)]}),sl)};

 // Qui crides? El nom més llarg que aparegui al missatge.
 let addressed=null,aliasCount=0;
 // Gent sentida fa poc en aquest canal: també se'ls pot parlar (pel nom del vaixell o de la persona).
 const people=heard.map(h=>{const parts=h.name.split(' · ');return {id:'heard:'+h.name,kind:'heard',name:h.name,lang:h.lang,voice:h,nm:2,listen:[channel],work:channel,aliases:parts.map(normalize).filter(a=>a.length>2)}});
 for(const st of [...stations,...people])for(const a of st.aliases)if(has(t,[a])&&(!addressed||a.length>addressed.alias.length))addressed={st,alias:a};
 if(addressed)aliasCount=(t.match(new RegExp('(?:^| )'+addressed.alias+'(?= |$)','g'))||[]).length;
 const distress=has(t,K.mayday)?'mayday':has(t,K.panpan)?'panpan':has(t,K.securite)&&!addressed?'securite':null;

 let responder=null;
 if(distress){
  const sar=byId('sar');
  if(sar.listen.includes(channel)||state.conv.sar?.stage?.startsWith(distress))responder=sar;
  else{tip('distressChannel');return out}
  if(distress==='mayday')once('maydayReal');
 }else if(addressed){
  if(addressed.st.listen.includes(channel))responder=addressed.st;
  else{tip('wrongChannel',{s:typeof addressed.st.name==='string'?addressed.st.name:addressed.st.name[ui]||addressed.st.name.es,c:channel,list:addressed.st.listen.join(tr('tip.or',{},ui))});return out}
 }else{
  responder=[...stations,...people].find(st=>{const c=state.conv[st.id];return c&&c.stage!=='idle'&&c.stage!=='closed'&&(c.channel===channel||st.work===channel&&c.stage==='switch')})||null;
  // Al seu canal de treball, l'estació respon encara que no l'hagis anomenada.
  if(!responder)responder=stations.find(st=>st.work===channel&&st.kind!=='yacht')||null;
  // En un canal entre vaixells, et contesta qui hi ha parlat darrerament.
  if(!responder&&people.length)responder=people.at(-1);
  if(!responder){if(!has(t,K.allStations))tip('nobody');return out}
 }

 // Abast de la ràdio segons la potència.
 const ratio=responder.nm/RANGE[effPower];
 if(ratio>=1){tip('range');return out}
 const quality=ratio<.4?5:ratio<.7?4:3,q=L.quality[quality];

 // Consells de procediment (una vegada cadascun).
 if(channel===16&&addressed&&aliasCount<2&&!distress)once('thrice');
 if(!has(t,K.identify)&&!normalize(vessel).split(' ').some(w=>w.length>2&&padded(t).includes(padded(w))))once('identify');
 if(!has(t,K.over)&&!has(t,K.bye))once('over');

 const st=responder,conv=state.conv[st.id]||={stage:'idle'};
 const intent=['repeat','check','price','berth','fuel','water','shower','laundry','hours','arrive','restaurant','weather','enter','leave','where','how','plan','bye'].find(k=>has(t,K[k]))||null;
 if(st.kind==='heard'){conv.stage='open';conv.channel=channel;if(intent==='bye'){emit(st,{es:'¡Hasta luego! Cambio y fuera.',en:'See you later! Over and out.',fr:'À plus tard ! Terminé.'}[st.lang]||'Fora.',st.lang);conv.stage='closed'}else smallTalk(st);return out}

 if(st.kind==='sar'&&distress)return distressFlow();
 if(st.kind==='sar'&&conv.stage?.startsWith('mayday')&&has(t,K.cancel)){say(st,'maydayCancel');conv.stage='closed';return out}
 if(st.kind==='sar'&&conv.stage?.startsWith('mayday')||conv.stage?.startsWith('panpan'))return distressFlow(conv.stage.startsWith('mayday')?'mayday':'panpan');

 if(intent==='repeat'&&conv.last){out.replies.push({station:st.id,text:conv.last,lang});return out}

 // Canal 16: només crida. Proves de ràdio: es responen però es recomana un canal de treball.
 if(channel===16&&st.work!==16){
  if(intent==='check'){say(st,st.kind==='yacht'?'yCheck':'check16',{q});return out}
  if(intent==='bye'&&conv.stage!=='idle'){say(st,st.kind==='yacht'?'yBye':'bye');conv.stage='closed';return out}
  if(intent&&intent!=='bye')once('business16');
  say(st,st.kind==='yacht'?'yCall16':'call16',{c:st.work});
  Object.assign(conv,{stage:'switch',channel:st.work,pending:intent&&intent!=='bye'?{intent,text}:null});
  return out;
 }

 conv.channel=channel;
 let doing=intent,source=text;
 if(!doing&&conv.pending){doing=conv.pending.intent;source=conv.pending.text+' '+text}
 conv.pending=null;
 if(!doing&&conv.stage==='berth')doing='berth';
 if(!doing){
  const chatty=st.kind==='yacht'&&(question||Object.values(TOPICS).some(list=>has(t,list)));
  if(!chatty&&(conv.stage==='switch'||addressed)){say(st,st.kind==='yacht'?'yHello':'goAhead');conv.stage='open';return out}
  if(st.kind==='yacht')smallTalk(st);else help(st);conv.stage='open';return out;
 }
 conv.stage='open';
 if(doing==='bye'){say(st,st.kind==='yacht'?'yBye':'bye');conv.stage='closed';return out}
 if(doing==='check'){say(st,st.kind==='yacht'?'yCheck':'check',{q});return out}
 if(st.kind==='yacht'){
  const key={where:'yWhere',how:'yHow',plan:'yPlan',weather:'yWeather'}[doing];if(key)say(st,key);else smallTalk(st);return out;
 }
 if(doing==='weather'){say(st,'weather',{w:L.forecasts[Math.floor(random()*L.forecasts.length)]});return out}
 if(st.kind==='sar'){if(doing)say(st,'sarOnly');else help(st);return out}
 if(st.kind==='port'){
  if(doing==='enter'||doing==='arrive'){say(st,'enter');return out}
  if(doing==='leave'){say(st,'leave');return out}
  if(['berth','fuel','water','shower','laundry','price','restaurant'].includes(doing)){say(st,'portBerth');return out}
  help(st);return out;
 }
 // Marina
 if(doing==='fuel'){say(st,'fuel');return out}
 if(doing==='enter'||doing==='arrive'){marina(st,'arrive');return out}
 if(doing==='leave'){say(st,'bye');conv.stage='closed';return out}
 if(['water','shower','laundry','hours','restaurant'].includes(doing)){marina(st,doing);return out}
 if(doing==='price'){const len=parseLength(source)??conv.data?.len??11;marina(st,'price',{price:Math.round(len*4.2+8)});return out}
 if(doing==='berth'){
  conv.data||={};const len=parseLength(source),nights=parseNights(source);
  if(len!==null)conv.data.len=len;if(nights!==null)conv.data.nights=nights;
  const d=conv.data;
  if(d.len!=null&&d.len>20){say(st,'berthFull',{len:d.len});conv.stage='open';conv.data={};return out}
  if(d.len==null&&d.nights==null){say(st,'berthAsk');conv.stage='berth';return out}
  if(d.len==null){say(st,'berthLength');conv.stage='berth';return out}
  if(d.nights==null){say(st,'berthNights');conv.stage='berth';return out}
  const p='ABCDE'[Math.min(4,Math.floor(d.len/4.5))],n=10+hash(vessel)%30;
  say(st,'berthOk',{p,n,nights:L.nights(d.nights)});conv.data={};return out;
 }
 help(st);return out;

 function distressFlow(kind=distress){
  const st=byId('sar'),conv=state.conv.sar||={stage:'idle'};conv.channel=channel;
  if(kind==='securite'){say(st,'securite');return out}
  if(kind==='panpan'){
   if(conv.stage!=='panpan-info'){say(st,'panAck');conv.stage='panpan-info';return out}
   say(st,'panHelp');conv.stage='closed';return out;
  }
  conv.data||={};const persons=parsePersons(text);
  if(persons!==null)conv.data.persons=persons;
  if(has(t,POSITION))conv.data.position=true;if(has(t,NATURE))conv.data.nature=true;
  const named=normalize(vessel).split(' ').some(w=>w.length>2&&padded(t).includes(padded(w)));
  if(conv.stage?.startsWith('mayday')&&has(t,K.cancel)){say(st,'maydayCancel');conv.stage='closed';return out}
  if(conv.stage==='mayday-active'){say(st,'maydayActive');return out}
  if(conv.stage!=='mayday-info'&&!named&&!has(t,K.identify)){say(st,'maydayWho');conv.stage='mayday-info';return out}
  const missing=['position','nature','persons'].filter(k=>!conv.data[k]&&!(k==='persons'&&conv.data.persons!=null));
  if(!missing.length){say(st,'maydayHelp',{persons:L.persons(conv.data.persons)});conv.stage='mayday-active';return out}
  const first=conv.stage!=='mayday-info';conv.stage='mayday-info';
  if(first&&missing.length===3){say(st,'maydayAck');return out}
  const list=missing.map(k=>L.missing[k]);
  say(st,'maydayMore',{missing:list.length>1?list.slice(0,-1).join(', ')+L.and+list.at(-1):list[0]});return out;
 }
}

// Alerta DSC de socors (botó DISTRESS): inclou la posició GPS; Salvament respon al canal 16.
export function dscAlert({lang='es',ui='ca',vessel='Xaloc',state=newState()}){
 const L=S[lang]||S.es,st=byId('sar'),conv=state.conv.sar={stage:'mayday-info',channel:16,data:{position:true}};
 const text=fill(L.dscAck,{v:vessel,s:st.name[lang]||st.name.ca});conv.last=text;
 return {replies:[{station:'sar',text,lang}],tips:[tr('tip.maydayReal',{},ui)],state};
}
