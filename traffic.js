// Trànsit de fons generat sobre la marxa: cada conversa es compon amb vaixells, persones, llocs i temes
// triats a l'atzar, així que no es repeteix. Tots els noms són inventats.
const pick=(r,list)=>list[Math.floor(r()*list.length)];
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const fill=(text,v)=>text.replace(/\{(\w+)\}/g,(m,k)=>v[k]??m);

const NAMES={
 ca:['Estel','Bonaventura','Sa Rata','Llebeig','Garbí','Mestral','Gregal','Ponent','Alcatràs','Corb Marí','Sa Boira','Lluna Plena','Rosa dels Vents','Pardal','Tortuga','Aire de Mar','Es Grau','Cap Negre','Sa Pedrera','Lloseta','Marinada','Dofí','Sa Perdiu','Es Freu'],
 es:['Nou Rosario','Virgen del Carmen','Gavina','Siroco','Delfín','Paloma','Alba','Brisa','Mar Serena','Atlántida','Peregrina','Neptuno','Caracola','Sa Mola'],
 en:['Blue Heron','Lady Anne','Sea Breeze','Wanderlust','Morning Star','Kestrel','Seraphina','Aurora','Free Spirit','Calypso','North Wind','Odyssey','Moonshadow','Pelican'],
};
const PEOPLE={ca:['Joan','Marta','Pere','Núria','Jordi','Aina','Biel','Maria','Llorenç','Xisca','Carme','Tòfol'],es:['Pep','Toni','Paco','Lucía','Carmen','Javi','Rafa','Elena','Manolo','Sergio','Inés','Quique'],en:['Tom','Sarah','Mike','Emma','James','Kate','Oliver','Anna']};
const PLACES=['Cala Teulera','Cala en Porter','Fornells','Ciutadella','Addaia','Sa Mesquida','Es Grau','Cala Turqueta','l’illa de l’Aire','el cap de Favàritx','Punta Prima','Binibeca','Cala Mitjana','Cala Macarella','l’illa d’en Colom','Cala Pregonda','Cala Galdana','Cala Morell'];
const FERRIES=['Ciutat de Fornells','Illa de Llevant','Mar de Maó','Golf de Ponent'];
const CARGO=['Atlantic Star','Nordic Pearl','Sea Venture','Hellas Spirit','Baltic Wind'];
const PONTOONS='ABCDE';

export function makeSpeaker(name,lang,r,signal){return {name,lang,pitch:+(0.75+r()*.55).toFixed(2),rate:+(0.96+r()*.16).toFixed(2),signal:signal??+(0.35+r()*.6).toFixed(2)}}
const vessel=(r,lang)=>pick(r,NAMES[lang]);

/* ---------- Converses entre vaixells (72, 77) ---------- */
const CHAT={
 ca:{
  call:['{B}, {B}, aquí {A}, m’escoltes? Canvi.','{B}, aquí {A}, canvi.','Ei {B}, aquí {A}. Hi ets? Canvi.'],
  answer:['{A}, et sento perfecte. Digues, canvi.','Aquí {B}. Et rebo bé, endavant, canvi.','Hola {A}! Et sento una mica fluix, però endavant, canvi.'],
  topics:[
   ['On sou fondejats ara? Canvi.','Som a {place}. {anchor} Canvi.','{anchorReact} Canvi.'],
   ['Com ha anat la pesca? Canvi.','{catch} Canvi.','{fishReact} Canvi.'],
   ['Per què no veniu a sopar a bord? Fem {food}. Canvi.','{accept} Canvi.','Perfecte, us esperem cap a les {hour}. Canvi.'],
   ['Has sentit el parte? Canvi.','Diuen {wind} força {force} {when}. Canvi.','{plan} Canvi.'],
   ['Encara teniu problemes amb {repair}? Canvi.','{repairState} Canvi.','{repairOffer} Canvi.'],
   ['Demà cap on aneu? Canvi.','Volem anar a {place2} si {cond}. Canvi.','{plansReact} Canvi.'],
   ['Ull, que a {place} hi ha moltes meduses avui. Canvi.','Gràcies per l’avís! Els nens volien banyar-se ara mateix. Canvi.','Millor a la tarda, amb el vent de mar se’n van. Canvi.'],
   ['Acabem de veure un grup de dofins davant de {place}! Canvi.','Quina sort! Cap on anaven? Canvi.','Cap a llevant, una desena, saltant a la proa. Canvi.'],
   ['Ens podríeu deixar una mica de gel? Se’ns ha espatllat la nevera. Canvi.','Cap problema, passa amb la neumàtica quan vulguis. Canvi.','Ets un sol, d’aquí a deu minuts som allà. Canvi.'],
  ],
  anchor:['Bon fons de sorra i aigua plana.','Hi ha força gent, però hem trobat lloc.','Està una mica moguda amb el mar de fons.','Hem hagut de fondejar dues vegades, l’àncora no agafava a les algues.'],
  anchorReact:['Doncs hi anem després de dinar.','Nosaltres ens quedem aquí, que estem molt bé.','Guardeu-nos lloc!','Vigila la posidònia, que hi ha guardes avui.'],
  catch:['Un parell de {fish} i prou.','Res de res, només algues.','Molt bé! Tres {fish} grossos.','Hem perdut un esquer i encara ens queden ganes.'],
  fishReact:['Ja és més que nosaltres!','Doncs ja tenim sopar.','Demà a trenc d’alba ho tornem a provar.','Diuen que a {place} piquen més.'],
  food:['un arròs de peix','una caldereta','sardines a la brasa','una truita de patates','pa amb oli i embotit'],
  accept:['Fet! Portem el vi.','Ens encantaria, portem les postres.','Avui no podem, que sortim d’hora demà. Un altre dia!','Sí, sí! Quina hora us va bé?'],
  hour:['set','vuit','dos quarts de nou','les nou'],
  wind:['tramuntana','llevant','migjorn','ponent','mestral','gregal','xaloc','llebeig'],
  when:['a la tarda','fins a mitjanit','demà al matí','a partir del migdia'],
  plan:['Llavors ens quedem al port.','Doncs sortim d’hora i arribem abans que bufi.','Jo m’ho esperaria a demà.','Perfecte per navegar, doncs!'],
  repair:['la bomba d’aigua del motor','una politja del ganxo','el pilot automàtic','la cadena del molinet','el carregador de bateries'],
  repairState:['Ja està arreglat, era un fusible.','Encara no, demà ve el mecànic.','Hem fet un apanyo amb cinta americana.','Sí, i ens està fent anar de corcoll.'],
  repairOffer:['Si necessites eines, en tinc a bord.','Truca a en {person} de la marina, que en sap molt.','Doncs vigileu, que a fora fa vent.'],
  cond:['la tramuntana afluixa','fa bon temps','el parte no canvia','arribem a temps de la benzinera'],
  plansReact:['Doncs potser ens hi veiem.','Nosaltres anem cap a {place}.','Avisa’ns quan sortiu.','Bona idea, allà sempre s’hi està bé.'],
  fish:['dents','orades','llobarros','sards','calamars','raons'],
  close:['D’acord, {A} fora.','Ens veiem, {A} fora, tornem al 16.','Fins després! {A} fora.'],
 },
 es:{
  call:['{B}, {B}, aquí {A}, ¿me recibes? Cambio.','{B}, aquí {A}, cambio.','Oye {B}, aquí {A}. ¿Estás ahí? Cambio.'],
  answer:['{A}, te recibo perfecto. Dime, cambio.','Aquí {B}. Te copio bien, adelante, cambio.','¡Hola {A}! Te oigo flojito, pero adelante, cambio.'],
  topics:[
   ['¿Dónde estáis fondeados? Cambio.','Estamos en {place}. {anchor} Cambio.','{anchorReact} Cambio.'],
   ['¿Qué tal la pesca? Cambio.','{catch} Cambio.','{fishReact} Cambio.'],
   ['¿Os venís a cenar al barco? Hacemos {food}. Cambio.','{accept} Cambio.','Perfecto, os esperamos sobre las {hour}. Cambio.'],
   ['¿Has oído el parte? Cambio.','Dan {wind} fuerza {force} {when}. Cambio.','{plan} Cambio.'],
   ['¿Seguís con problemas con {repair}? Cambio.','{repairState} Cambio.','{repairOffer} Cambio.'],
   ['¿Mañana hacia dónde vais? Cambio.','Queremos ir a {place2} si {cond}. Cambio.','{plansReact} Cambio.'],
   ['Ojo, que en {place} hay muchas medusas hoy. Cambio.','¡Gracias por el aviso! Los críos querían bañarse ahora. Cambio.','Mejor por la tarde, con la brisa se van. Cambio.'],
   ['¡Acabamos de ver delfines delante de {place}! Cambio.','¡Qué suerte! ¿Hacia dónde iban? Cambio.','Hacia levante, una decena, saltando en la proa. Cambio.'],
  ],
  anchor:['Buen fondo de arena y agua plana.','Hay bastante gente, pero hemos encontrado sitio.','Está algo movido con la mar de fondo.','Hemos tenido que fondear dos veces, el ancla no agarraba.'],
  anchorReact:['Pues vamos después de comer.','Nosotros nos quedamos aquí, estamos de lujo.','¡Guardadnos sitio!','Cuidado con la posidonia, que hoy hay vigilancia.'],
  catch:['Un par de {fish} y poco más.','Nada de nada, solo algas.','¡Muy bien! Tres {fish} hermosos.','Hemos perdido un señuelo y seguimos con ganas.'],
  fishReact:['¡Ya es más que nosotros!','Pues ya tenemos cena.','Mañana al amanecer lo volvemos a intentar.','Dicen que en {place} pican más.'],
  food:['un arroz de pescado','una caldereta','sardinas a la brasa','una tortilla de patatas','pa amb oli con embutido'],
  accept:['¡Hecho! Llevamos el vino.','Nos encantaría, llevamos el postre.','Hoy no podemos, mañana salimos temprano. ¡Otro día!','¡Sí, claro! ¿A qué hora?'],
  hour:['las siete','las ocho','las ocho y media','las nueve'],
  wind:['tramontana','levante','mediodía','poniente','mistral','gregal','siroco','lebeche'],
  when:['por la tarde','hasta medianoche','mañana por la mañana','a partir del mediodía'],
  plan:['Entonces nos quedamos en puerto.','Pues salimos temprano y llegamos antes de que sople.','Yo esperaría a mañana.','¡Perfecto para navegar!'],
  repair:['la bomba de agua del motor','una polea de la botavara','el piloto automático','la cadena del molinete','el cargador de baterías'],
  repairState:['Ya está arreglado, era un fusible.','Todavía no, mañana viene el mecánico.','Hemos hecho un apaño con cinta americana.','Sí, y nos está volviendo locos.'],
  repairOffer:['Si necesitas herramientas, tengo a bordo.','Llama a {person} de la marina, que sabe mucho.','Pues cuidado, que fuera sopla.'],
  cond:['afloja la tramontana','hace buen tiempo','el parte no cambia','llegamos a tiempo a la gasolinera'],
  plansReact:['Pues a lo mejor nos vemos allí.','Nosotros vamos hacia {place}.','Avisadnos cuando salgáis.','Buena idea, allí siempre se está bien.'],
  fish:['dentones','doradas','lubinas','sargos','calamares','raones'],
  close:['Vale, {A} fuera.','Nos vemos, {A} fuera, volvemos al 16.','¡Hasta luego! {A} fuera.'],
 },
 en:{
  call:['{B}, {B}, this is {A}, do you copy? Over.','{B}, {A}, over.','{B}, this is {A}. Are you there? Over.'],
  answer:['{A}, loud and clear. Go ahead, over.','{B} here, reading you fine, go ahead, over.','Hi {A}! You’re a bit weak, but go ahead, over.'],
  topics:[
   ['Where are you anchored now? Over.','We’re in {place}. {anchor} Over.','{anchorReact} Over.'],
   ['Any luck with the fishing? Over.','{catch} Over.','{fishReact} Over.'],
   ['Fancy dinner on board tonight? Over.','{accept} Over.','Great, see you around {hour}. Over.'],
   ['Did you hear the forecast? Over.','They say {wind} force {force} {when}. Over.','{plan} Over.'],
   ['Still having trouble with {repair}? Over.','{repairState} Over.','{repairOffer} Over.'],
  ],
  anchor:['Nice sandy bottom, flat water.','It’s busy, but we found a spot.','A bit rolly with the swell.','Took us two goes to get the anchor to hold.'],
  anchorReact:['We’ll come over after lunch.','We’re staying put, it’s lovely here.','Save us a spot!','Mind the seagrass, the wardens are out today.'],
  catch:['Just a couple of small ones.','Nothing at all, only weed.','Brilliant, three big bream!','Lost a lure, still hopeful.'],
  fishReact:['That’s more than us!','Dinner sorted then.','We’ll try again at dawn.','They say it’s better off {place}.'],
  accept:['Love to, we’ll bring the wine.','Sounds great, we’ll bring dessert.','Not tonight, we leave early tomorrow. Another time!'],
  hour:['seven','eight','half past eight'],
  wind:['northerly','easterly','southerly','westerly','north-westerly'],
  when:['this afternoon','until midnight','tomorrow morning','from midday'],
  plan:['We’ll stay in harbour then.','We’ll leave early and beat it.','I’d wait until tomorrow.','Perfect sailing weather!'],
  repair:['the raw water pump','the autopilot','the windlass','the battery charger'],
  repairState:['All fixed, it was a fuse.','Not yet, the mechanic comes tomorrow.','Gaffer tape for now.','Yes, it’s driving us mad.'],
  repairOffer:['Shout if you need tools.','Ask {person} at the marina, he knows everything.','Take care, it’s windy outside.'],
  close:['Okay, {A} out.','See you later, {A} out, back to sixteen.'],
 },
};
function chat(r,lang){
 const L=CHAT[lang],a=vessel(r,lang);let b=vessel(r,lang);while(b===a)b=vessel(r,lang);
 const pa=pick(r,PEOPLE[lang]),pb=pick(r,PEOPLE[lang]);
 const A=makeSpeaker(r()<.5?pa+' · '+a:a,lang,r),B=makeSpeaker(r()<.5?pb+' · '+b:b,lang,r);
 const v={A:a,B:b,place:pick(r,PLACES),place2:pick(r,PLACES),force:int(r,3,6),person:pick(r,PEOPLE[lang])};
 const expand=t=>fill(t,v).replace(/\{(\w+)\}/g,(_,k)=>L[k]?fill(pick(r,L[k]),v):'');
 const once=t=>expand(expand(t)).replace(/\{\w+\}/g,'');
 const lines=[{who:A,text:once(pick(r,L.call))},{who:B,text:once(pick(r,L.answer))}];
 const topics=[...L.topics].sort(()=>r()-.5).slice(0,r()<.35?2:1);
 // Torns alternats: cada tema el comença qui no ha parlat l'últim.
 for(const topic of topics){const first=lines.at(-1).who===A?B:A,second=first===A?B:A;topic.forEach((t,i)=>lines.push({who:i%2?second:first,text:once(t)}))}
 const closer=lines.at(-1).who===A?B:A;lines.push({who:closer,text:once(pick(r,L.close)).replaceAll(a,closer===A?a:b)});
 return lines;
}

/* ---------- Marina (canal 9) ---------- */
function marina(r){
 const lang=pick(r,['ca','ca','es','en']),name=vessel(r,lang),boat=makeSpeaker(name,lang,r,.6+r()*.35);
 const st=makeSpeaker({ca:'Marina de Maó',es:'Marina de Mahón',en:'Mahon Marina'}[lang],lang,()=>.55,.95);
 const len=int(r,8,16),nights=int(r,1,5),p=PONTOONS[Math.min(4,Math.floor(len/4))],n=int(r,2,48),litres=int(r,4,30)*10;
 const T={
  ca:[[`Marina de Maó, aquí ${name}. Sol·licitem amarrament per a ${nights===1?'una nit':nights+' nits'}, eslora ${len} metres, canvi.`,`${name}, li assignem el pantalà ${p}, plaça ${n}. Un mariner l’espera a la bocana, canvi.`,`Rebut, pantalà ${p}, plaça ${n}. Gràcies, ${name} fora.`],
      [`Marina de Maó, aquí ${name}. Som al moll de la benzinera, voldríem ${litres} litres de gasoil, canvi.`,`${name}, ara mateix hi ha un vaixell davant. Esperi cinc minuts, canvi.`,`D’acord, esperem al costat. ${name} fora.`],
      [`Marina, aquí ${name}. Ja som a la bocana, canvi.`,`${name}, vegi la neumàtica vermella a babord, el mariner el guiarà fins a la plaça, canvi.`,`La veiem. Gràcies!`],
      [`Marina de Maó, aquí ${name}. Quin és el codi de les dutxes? Canvi.`,`${name}, és a la factura de recepció. Passi per l’oficina, oberta fins a les vuit, canvi.`,`Rebut, gràcies.`],
      [`Marina, aquí ${name}. Sortim ara, ja hem pagat a l’oficina. Gràcies per tot, canvi.`,`${name}, gràcies a vostès. Bona navegació, canvi.`]],
  es:[[`Marina de Mahón, aquí ${name}. Solicitamos amarre para ${nights===1?'una noche':nights+' noches'}, eslora ${len} metros, cambio.`,`${name}, le asignamos el pantalán ${p}, amarre ${n}. Un marinero le espera en la bocana, cambio.`,`Recibido, pantalán ${p}, amarre ${n}. Gracias, ${name} fuera.`],
      [`Marina, aquí ${name}. Estamos en la gasolinera, queremos ${litres} litros de gasoil, cambio.`,`${name}, hay un barco delante. Espere cinco minutos, cambio.`,`De acuerdo, esperamos al lado. ${name} fuera.`],
      [`Marina de Mahón, aquí ${name}. ¿Tienen agua y electricidad en el pantalán ${p}? Cambio.`,`${name}, sí, toma de dieciséis amperios. La tarjeta se recoge en la oficina, cambio.`,`Perfecto, gracias.`]],
  en:[[`Mahon Marina, ${name}. We would like a berth for ${nights===1?'one night':nights+' nights'}, length ${len} metres, over.`,`${name}, pontoon ${p}, berth ${n}. Fenders to port, a marinero will meet you, over.`,`Pontoon ${p}, ${n}, fenders to port. Thank you, ${name} out.`],
      [`Mahon Marina, ${name}. We are at the fuel dock, could someone help with the lines? Over.`,`${name}, a marinero is on his way, two minutes, over.`,`Thank you, ${name} standing by.`],
      [`Mahon Marina, ${name}. Is there a laundry in the marina? Over.`,`${name}, yes, next to the office, tokens at reception, over.`,`Lovely, thanks.`]],
 }[lang];
 return pick(r,T).map((text,i)=>({who:i%2?st:boat,text}));
}
/* ---------- Port (12, 14) ---------- */
function port(r){
 const practics=makeSpeaker('Pràctics de Maó','es',()=>.3,.9),f=pick(r,FERRIES),ferry=makeSpeaker(f,'es',r,.85),tug=makeSpeaker('Remolcador Illa','es',()=>.1,.8);
 const side=pick(r,['babor','estribor']),min=int(r,3,15),quay=pick(r,['Cos Nou','el muelle de Poniente','la estación marítima','el muelle comercial']);
 const cargo=pick(r,CARGO),ship=makeSpeaker(cargo,'en',r,.65),pilotEn=makeSpeaker('Mahon Pilots','en',()=>.3,.9);
 return pick(r,[
  [[ferry,`Prácticos de Mahón, aquí ferry ${f}, a ${int(r,1,4)} millas de la bocana, cambio.`],[practics,`${f}, prácticos. Recibido, práctico a bordo en ${min} minutos por su banda de ${side}, cambio.`],[ferry,`Recibido, escala por ${side}. ${f}.`]],
  [[practics,`Remolcador Illa, aquí prácticos. Prepárese para asistir al ferry ${f} en ${quay}, cambio.`],[tug,`Prácticos, Illa. Recibido, saliendo ahora, cambio.`]],
  [[tug,`Prácticos, aquí remolcador Illa. Ferry amarrado en ${quay}, quedamos libres, cambio.`],[practics,`Recibido Illa, gracias. Vuelvan a base, cambio.`]],
  [[ship,`Mahon Pilots, Mahon Pilots, this is ${cargo}, ETA at the pilot station ${min} minutes, over.`],[pilotEn,`${cargo}, Mahon Pilots. Pilot ladder on the ${side==='babor'?'port':'starboard'} side, one metre above the water, speed six knots, over.`],[ship,`Ladder on the ${side==='babor'?'port':'starboard'} side, six knots. ${cargo}.`]],
  [[ferry,`Prácticos, ${f} saliendo de ${quay}, cambio.`],[practics,`${f}, recibido. Canal libre, hay un velero entrando por el centro, cambio.`],[ferry,`Lo tenemos a la vista, gracias.`]],
 ]).map(([who,text])=>({who,text}));
}
/* ---------- Canal 16: crides i avisos ---------- */
function channel16(r){
 const lang=pick(r,['ca','es','es','en']);
 if(r()<.2){
  const sar=makeSpeaker({ca:'Salvament Marítim',es:'Salvamento Marítimo',en:'Maritime Rescue'}[lang],lang,()=>.4,.55);
  const what={ca:['un contenidor a la deriva','un tronc a la deriva','unes xarxes a la deriva','una boia de senyalització sense llum'],es:['un contenedor a la deriva','un tronco a la deriva','redes a la deriva','una boya de señalización apagada'],en:['a drifting container','a drifting tree trunk','drifting fishing nets','an unlit navigation buoy']}[lang];
  const where=`${int(r,1,5)} ${({ca:'milles al',es:'millas al',en:'miles'})[lang]} ${pick(r,{ca:['nord','sud','est','oest'],es:['norte','sur','este','oeste'],en:['north','south','east','west']}[lang])} ${({ca:'de',es:'de',en:'of'})[lang]} ${pick(r,PLACES)}`;
  const text={ca:`Seguretat, seguretat, seguretat. A totes les estacions, aquí Salvament Marítim. Avís als navegants: ${pick(r,what)} a ${where}. Es prega precaució. Escoltin el canal 10. Fora.`,
   es:`Seguridad, seguridad, seguridad. A todas las estaciones, aquí Salvamento Marítimo. Aviso a los navegantes: ${pick(r,what)} a ${where}. Se ruega precaución. Escuchen el canal 10. Fuera.`,
   en:`Securité, securité, securité. All stations, this is Maritime Rescue. Navigational warning: ${pick(r,what)} ${where}. Mariners are requested to keep a sharp lookout. Listen on channel 10. Out.`}[lang];
  return [{who:sar,text}];
 }
 const a=vessel(r,lang),A=makeSpeaker(a,lang,r);
 if(r()<.5){
  let b=vessel(r,lang);while(b===a)b=vessel(r,lang);const B=makeSpeaker(b,lang,r),ch=pick(r,[72,77,69,73,8]);
  return {ca:[[A,`${b}, ${b}, aquí ${a}, ${a}, canvi.`],[B,`${a}, aquí ${b}. Passem al ${ch}, canvi.`],[A,`${ch}, canvi.`]],
   es:[[A,`${b}, ${b}, aquí ${a}, ${a}, cambio.`],[B,`${a}, aquí ${b}. Pasamos al ${ch}, cambio.`],[A,`${ch}, cambio.`]],
   en:[[A,`${b}, ${b}, this is ${a}, ${a}, over.`],[B,`${a}, ${b}. Let’s go to ${ch}, over.`],[A,`${ch}, over.`]]}[lang].map(([who,text])=>({who,text}));
 }
 const st=r()<.6?{name:{ca:'Marina de Maó',es:'Marina de Mahón',en:'Mahon Marina'}[lang],ch:9}:{name:{ca:'Pràctics de Maó',es:'Prácticos de Mahón',en:'Mahon Pilots'}[lang],ch:12};
 const S=makeSpeaker(st.name,lang,()=>.5,.92);
 return {ca:[[A,`${st.name}, ${st.name}, aquí ${a}, canvi.`],[S,`${a}, aquí ${st.name}. Passi al canal ${st.ch}, canvi.`],[A,`Canal ${st.ch}, canvi.`]],
  es:[[A,`${st.name}, ${st.name}, aquí ${a}, cambio.`],[S,`${a}, aquí ${st.name}. Pase al canal ${st.ch}, cambio.`],[A,`Canal ${st.ch}, cambio.`]],
  en:[[A,`${st.name}, ${st.name}, this is ${a}, over.`],[S,`${a}, ${st.name}. Go to channel ${st.ch}, over.`],[A,`Channel ${st.ch}, ${a}.`]]}[lang].map(([who,text])=>({who,text}));
}
/* ---------- Pont a pont (13), regata (67), salvament (6, 10), meteo (20) ---------- */
function bridge(r){
 const a=pick(r,CARGO),f=pick(r,FERRIES),A=makeSpeaker(a,'en',r,.6),F=makeSpeaker(f,'en',r,.85),side=pick(r,['port','starboard']);
 return pick(r,[
  [[F,`${a}, this is ferry ${f} on channel thirteen, over.`],[A,`${f}, ${a}, go ahead, over.`],[F,`I am overtaking you on your ${side} side, I will keep at least half a mile clear, over.`],[A,`Understood, you overtake on my ${side} side, I keep my course and speed. ${a} out.`]],
  [[A,`Vessel crossing ahead of me off ${pick(r,PLACES)}, this is ${a}, over.`],[F,`${a}, ferry ${f}. I see you, I will alter course to starboard and pass port to port, over.`],[A,`Port to port, thank you. ${a} out.`]],
 ]).map(([who,text])=>({who,text}));
}
function regatta(r){
 const rc=makeSpeaker('Race committee','en',()=>.4,.8),cls=pick(r,['one','two','three','J80','Platu 25']),n=int(r,100,999);
 return [{who:rc,text:pick(r,[`All competitors, this is the race committee on six seven. ${int(r,1,5)} minutes to the start of class ${cls}.`,`All competitors, race committee. Individual recall, sail number ${String(n).split('').join(' ')}. You were over the line.`,`All competitors, race committee. The course is shortened, finish at mark ${int(r,2,4)}.`,`Race committee. Postponement for class ${cls}, the wind is shifting. Stand by on this channel.`])}];
}
function rescue(r){
 const sar=makeSpeaker('Salvamento Marítimo','es',()=>.4,.55),boat=makeSpeaker(pick(r,['Salvamar Menorca','Salvamar Alnitak']),'es',()=>.6,.75),helo=makeSpeaker(`Helimer ${int(r,200,209)}`,'es',()=>.2,.6);
 const place=pick(r,PLACES),eta=int(r,10,40);
 return pick(r,[
  [[sar,`${boat.name}, aquí Salvamento Marítimo. Diríjase a ${place}, velero con avería de motor, cuatro personas a bordo, cambio.`],[boat,`Recibido, saliendo de Mahón. Estimamos llegada en ${eta} minutos, cambio.`]],
  [[helo,`${boat.name}, aquí ${helo.name}, ejercicio de evacuación, en posición sobre ustedes, cambio.`],[boat,`${helo.name}, le tenemos a la vista. Rumbo ${int(r,1,3)}${int(r,0,5)}0, velocidad ocho nudos, listos para el cable, cambio.`],[helo,`Recibido, bajando al rescatador, cambio.`]],
  [[boat,`Salvamento Marítimo, aquí ${boat.name}. Tenemos a remolque el velero averiado, entramos en puerto en ${eta} minutos, cambio.`],[sar,`Recibido, ${boat.name}. Avisen al llegar, cambio.`]],
  [[sar,`${boat.name}, Salvamento. Búsqueda de una tabla de windsurf a la deriva cerca de ${place}, el deportista ya está en tierra. Recuperen la tabla si es posible, cambio.`],[boat,`Recibido, nos dirigimos a la zona, cambio.`]],
 ]).map(([who,text])=>({who,text}));
}
function weather(r){
 const radio=makeSpeaker('Radio costera','es',()=>.5,.5),dirs=['norte','nordeste','este','sureste','sur','suroeste','oeste','noroeste'],sea=['rizada','marejadilla','marejada','fuerte marejada'],f=int(r,2,6);
 return [{who:radio,text:`Boletín meteorológico para aguas costeras de Menorca. Viento del ${pick(r,dirs)} fuerza ${f}, ${pick(r,['ocasionalmente '+(f+1)+' por la tarde','amainando a partir de la noche','tendiendo a variable'])}. ${sea[Math.min(3,Math.max(0,f-2))][0].toUpperCase()+sea[Math.min(3,Math.max(0,f-2))].slice(1)}${f>4?' con mar de fondo del norte':''}. Visibilidad ${pick(r,['buena','buena, regular con chubascos','regular por calima'])}. Próximo boletín dentro de cuatro horas.`}];
}
const GENERATORS={16:{gap:[25,70],make:channel16},9:{gap:[18,50],make:marina},12:{gap:[30,80],make:port},14:{gap:[45,110],make:port},
 72:{gap:[12,40],make:r=>chat(r,pick(r,['ca','ca','es','en']))},77:{gap:[18,50],make:r=>chat(r,pick(r,['es','es','ca']))},
 13:{gap:[45,110],make:bridge},67:{gap:[35,90],make:regatta},6:{gap:[60,140],make:rescue},10:{gap:[50,130],make:rescue},20:{gap:[25,45],make:weather}};
export const voiceChannels=Object.keys(GENERATORS).map(Number);
// Converses llunyanes: veu ininteligible amb molt de soroll.
export const distant={8:{gap:[25,70]},69:{gap:[20,60]},73:{gap:[25,70]},24:{gap:[40,90]},63:{gap:[50,110]},84:{gap:[45,100]}};
// Ràfegues de dades (sense veu).
export const data={70:{every:[8,25],kind:'dsc'},87:{every:[2,6],kind:'ais'},88:{every:[2,6],kind:'ais'}};
export function generate(ch,random=Math.random){return GENERATORS[ch].make(random)}
export const lineDuration=(line,rate=1)=>(700+line.text.length*68)/rate;

export class Traffic{
 constructor(now=0,random=Math.random){
  this.random=random;this.state={};this.recent={};
  for(const ch of voiceChannels)this.state[ch]={kind:'voice',ex:generate(ch,random),line:0,start:-1,end:-1,next:now+2000+random()*Math.min(40,GENERATORS[ch].gap[1])*1000*.7};
  for(const ch of Object.keys(distant))this.state[ch]={kind:'distant',start:-1,end:-1,next:now+2000+random()*Math.min(40,distant[ch].gap[1])*1000*.7};
 }
 gap([a,b]){return (a+this.random()*(b-a))*1000}
 current(ch){const st=this.state[ch];if(!st||st.kind!=='voice')return null;const line=st.ex[st.line];return {...line,speaker:line.who,last:st.line===st.ex.length-1}}
 remember(ch,speaker){const list=this.recent[ch]||=[];const i=list.findIndex(s=>s.name===speaker.name);if(i>=0)list.splice(i,1);list.push(speaker);if(list.length>6)list.shift()}
 // Qui s'ha sentit fa poc en aquest canal (per si l'usuari li parla).
 heard(ch){return [...(this.recent[ch]||[])]}
 consume(ch,at){const st=this.state[ch];
  if(st.kind==='distant'){const d=(2+this.random()*7)*1000;st.start=at;st.end=at+d;st.next=st.end+this.gap(distant[ch].gap);return {distant:true,duration:d}}
  const line=this.current(ch),d=lineDuration(line,line.speaker.rate);st.start=at;st.end=at+d;
  this.advance(ch,st.end);return {...line,duration:d};
 }
 advance(ch,at){const st=this.state[ch];
  if(st.line<st.ex.length-1){st.line++;st.next=at+800+this.random()*1600}
  else{st.ex=generate(+ch,this.random);st.line=0;st.next=at+this.gap(GENERATORS[ch].gap)}
 }
 // Els canals que no s'escolten avancen sols, segons el temps estimat.
 tick(now,tuned){for(const ch of Object.keys(this.state)){if(+ch===tuned)continue;const st=this.state[ch];while(now>=st.next)this.consume(ch,st.next)}}
 // Hi ha algú parlant (o a punt de parlar) en aquest canal? Serveix per a l'escàner.
 busy(ch,now){const st=this.state[ch];return !!st&&(now>=st.start&&now<st.end||st.next-now<1200)}
 // Per al canal sintonitzat: la intervenció que toca ara, o null.
 take(ch,now){const st=this.state[ch];if(!st||now<st.next)return null;
  if(st.kind==='distant'){const r=this.consume(ch,now);st.next=Infinity;return r}
  const line=this.current(ch);this.remember(ch,line.speaker);st.start=now;st.end=now+lineDuration(line,line.speaker.rate);st.next=Infinity;return {...line,duration:st.end-now};
 }
 // Crida-ho quan s'acaba (o s'interromp) la intervenció del canal sintonitzat.
 done(ch,now){const st=this.state[ch];if(!st)return;st.end=now;
  if(st.kind==='distant'){st.next=now+this.gap(distant[ch].gap);return}
  this.advance(ch,now);
 }
 // Retarda el trànsit d'un canal (per exemple, quan hi parla una estació que et respon).
 hold(ch,until){const st=this.state[ch];if(st&&st.next<until)st.next=until}
 // Talla la conversa en curs (algú et respon a tu): la següent serà nova.
 interruptExchange(ch,until){const st=this.state[ch];if(!st||st.kind!=='voice')return;st.ex=generate(+ch,this.random);st.line=0;this.hold(ch,until)}
}
