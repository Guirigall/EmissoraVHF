// Variants de resposta i conversa informal per al motor local (sense IA).
// Les claus de VAR s'afegeixen a les respostes base de dialog.js: així una mateixa situació no sona sempre igual.
export const VAR={
 ca:{
  call16:['{v}, aquí {s}. Rebut, passi al {c}, canvi.','{v}, {s} el rep. Canal {c}, si us plau, canvi.'],
  goAhead:['{v}, aquí {s}. El rebo, digui, canvi.','{s} escoltant. Endavant, {v}, canvi.','{v}, aquí {s}. En què el podem ajudar?, canvi.'],
  bye:['Rebut, {v}. Que vagi bé. {s} fora.','{v}, a vostè. {s} queda a l’escolta al canal {c}.'],
  berthOk:['{v}, té plaça al pantalà {p}, número {n}, per a {nights}. El mariner l’espera a la bocana, canvi.','{v}, perfecte: pantalà {p}, plaça {n}, {nights}. Defenses a estribord, si us plau, canvi.'],
  fuel:['{v}, pot venir al moll de la benzinera quan vulgui, ara està lliure. Gasoil i benzina, canvi.'],
 },
 es:{
  call16:['{v}, aquí {s}. Recibido, pase al {c}, cambio.','{v}, {s} le recibe. Canal {c}, por favor, cambio.'],
  goAhead:['{v}, aquí {s}. Le recibo, adelante, cambio.','{s} a la escucha. Adelante, {v}, cambio.','{v}, aquí {s}. ¿En qué le podemos ayudar?, cambio.'],
  bye:['Recibido, {v}. Que vaya bien. {s} fuera.','{v}, a usted. {s} queda a la escucha en el canal {c}.'],
  berthOk:['{v}, tiene amarre en el pantalán {p}, número {n}, para {nights}. El marinero le espera en la bocana, cambio.','{v}, perfecto: pantalán {p}, amarre {n}, {nights}. Defensas a estribor, por favor, cambio.'],
  fuel:['{v}, puede venir a la gasolinera cuando quiera, ahora está libre. Gasoil y gasolina, cambio.'],
 },
 en:{
  call16:['{v}, {s}. Roger, go to {c}, over.','{v}, {s} receiving. Channel {c} please, over.'],
  goAhead:['{v}, {s}. Reading you, go ahead, over.','{s} listening. Go ahead {v}, over.','{v}, this is {s}. How can we help? Over.'],
  bye:['Roger {v}. Have a good one. {s} out.','{v}, likewise. {s} standing by on channel {c}.'],
  berthOk:['{v}, you have pontoon {p}, berth {n} for {nights}. The marinero will meet you at the entrance, over.','{v}, perfect: pontoon {p}, berth {n}, {nights}. Fenders to starboard please, over.'],
  fuel:['{v}, the fuel dock is free now, come in whenever you like. Diesel and petrol, over.'],
 },
};
// Quan no s'entén el missatge: l'estació diu què hi pot fer, en lloc de repetir «no l'he entès».
export const HELP={
 ca:{marina:['{v}, aquí {s}. No l’he acabat d’entendre. Li puc donar amarrament, combustible, aigua i llum o la previsió del temps. Què necessita?, canvi.','{v}, perdoni, se l’ha sentit tallat. Necessita plaça, gasoil o alguna altra cosa?, canvi.'],
  port:['{v}, aquí {s}. No l’he entès. Vol entrar o sortir de port?, canvi.','{v}, repeteixi, si us plau. Indiqui si entra o surt del port, canvi.'],
  sar:['{v}, aquí {s}. No l’he entès. Té alguna emergència o necessita assistència?, canvi.']},
 es:{marina:['{v}, aquí {s}. No le he acabado de entender. Le puedo dar amarre, combustible, agua y luz o la previsión del tiempo. ¿Qué necesita?, cambio.','{v}, perdone, se le ha oído cortado. ¿Necesita amarre, gasoil u otra cosa?, cambio.'],
  port:['{v}, aquí {s}. No le he entendido. ¿Quiere entrar o salir de puerto?, cambio.','{v}, repita, por favor. Indique si entra o sale de puerto, cambio.'],
  sar:['{v}, aquí {s}. No le he entendido. ¿Tiene alguna emergencia o necesita asistencia?, cambio.']},
 en:{marina:['{v}, {s}. I didn’t quite get that. We can help with a berth, fuel, water and power, or the forecast. What do you need? Over.','{v}, sorry, you were breaking up. Do you need a berth, fuel or something else? Over.'],
  port:['{v}, {s}. Say again please. Are you entering or leaving the harbour? Over.'],
  sar:['{v}, {s}. Say again. Do you have an emergency or need assistance? Over.']},
};
// Altres serveis de la marina.
export const MARINA={
 ca:{water:['{v}, al pantalà hi ha aigua i presa de corrent de setze amperes. La targeta es recull a l’oficina, canvi.'],shower:['{v}, les dutxes són a l’edifici de l’oficina. El codi és a la factura, canvi.'],laundry:['{v}, la bugaderia és al costat de l’oficina, amb fitxes de recepció, canvi.'],price:['{v}, per a la seva eslora són uns {price} euros per nit, aigua i llum incloses, canvi.'],hours:['{v}, l’oficina obre de vuit del matí a vuit del vespre, i el canal 9 l’escoltem tot el dia, canvi.'],arrive:['{v}, rebut. Vegi la neumàtica a babord, el mariner el guiarà fins a la plaça, canvi.','{v}, perfecte, el mariner ja surt a buscar-lo. Prepari caps a proa i a popa, canvi.'],restaurant:['{v}, al moll hi ha un parell de restaurants. Si vol peix, el de la llotja és molt bo, canvi.']},
 es:{water:['{v}, en el pantalán hay agua y toma de corriente de dieciséis amperios. La tarjeta se recoge en la oficina, cambio.'],shower:['{v}, las duchas están en el edificio de la oficina. El código está en la factura, cambio.'],laundry:['{v}, la lavandería está junto a la oficina, con fichas de recepción, cambio.'],price:['{v}, para su eslora son unos {price} euros por noche, agua y luz incluidas, cambio.'],hours:['{v}, la oficina abre de ocho de la mañana a ocho de la tarde, y el canal 9 lo escuchamos todo el día, cambio.'],arrive:['{v}, recibido. Vea la neumática por babor, el marinero le guiará hasta el amarre, cambio.','{v}, perfecto, el marinero ya sale. Prepare cabos a proa y a popa, cambio.'],restaurant:['{v}, en el muelle hay un par de restaurantes. Si quiere pescado, el de la lonja está muy bien, cambio.']},
 en:{water:['{v}, there is water and sixteen amp power on the pontoon. Pick up the card at the office, over.'],shower:['{v}, showers are in the office building, the code is on your receipt, over.'],laundry:['{v}, the laundry is next to the office, tokens at reception, over.'],price:['{v}, for your length it is about {price} euros a night, water and power included, over.'],hours:['{v}, the office is open from eight to eight, and we monitor channel 9 all day, over.'],arrive:['{v}, roger. Look for the rib on your port side, the marinero will guide you in, over.','{v}, great, the marinero is on his way. Get your lines ready fore and aft, over.'],restaurant:['{v}, there are a couple of restaurants on the quay. For fish, the one by the market is lovely, over.']},
};
// Conversa informal entre velers: es tria el tema pel que has dit.
export const TOPICS={
 greet:['hola','bon dia','bona tarda','bones','buenos dias','buenas','hello','hi','hey','ei','eii','que tal'],
 fish:['pesca','pescar','peix','peixos','pescat','pescado','pez','peces','fish','fishing','calamar','calamars','calamares','canya','cana','curricà','curricán'],
 food:['sopar','dinar','menjar','arros','paella','cena','comida','cenar','comer','dinner','lunch','food','cervesa','cerveza','beer','vi','vino','wine','gelat','helado'],
 weather:['vent','viento','wind','tramuntana','tramontana','mestral','llevant','levante','pluja','lluvia','rain','onada','onades','olas','waves','mar de fons','mar de fondo','swell','calor','fred','frio'],
 swim:['banyar','bany','nedar','aigua','agua','banarse','banar','nadar','swim','swimming','water','snorkel','meduses','medusas','jellyfish'],
 wildlife:['dofi','dofins','delfin','delfines','dolphin','dolphins','tortuga','tortugas','turtle','balena','ballena','whale','ocells','gavines'],
 boat:['veler','vaixell','barco','velero','boat','sail','vela','veles','motor','ancora','ancla','anchor','fondeig','fondejar','fondear'],
 favor:['teniu','tens','podeu','pots','ens deixeu','em deixes','deixar nos','tienes','teneis','podeis','puedes','nos dejais','prestar','could you','can you','do you have','borrow','lend'],
 help:['ajuda','ajudar','ayuda','ayudar','help','necessito','necesito','need','eines','herramientas','tools'],
 thanks:['gracies','gracias','thanks','thank'],
};
export const SMALL={
 ca:{
  favor:['És clar! Passa amb la neumàtica quan vulguis i t’ho deixem, canvi.','Ara mateix ho miro... Sí, en tenim. Vine a buscar-ho, canvi.','Uf, ens en queda poc, però alguna cosa et podem deixar, canvi.'],
  where:['Som fondejats a {place}, a tocar de la platja. S’hi està de luxe, canvi.','Ara som a {place}, però a la tarda pensem moure’ns, canvi.'],
  how:['Tot bé per aquí, gaudint del dia! I vosaltres?, canvi.','Molt bé, una mica cansats de la travessa, però contents, canvi.'],
  plan:['Demà volem anar cap a {place} si el temps ho permet. I vosaltres?, canvi.','Encara no ho sabem, depèn del vent. Potser {place}, canvi.'],
  greet:['Hola, {v}! Quin dia més bo, eh? Com va per allà?, canvi.','Bon dia, {v}! Aquí tot tranquil. Què expliques?, canvi.','Ei, {v}! Feia estona que no et sentia. Tot bé?, canvi.'],
  fish:['Avui res, ni una picada. Diuen que a {place} piquen més, canvi.','Hem tret un parell de dents aquest matí. Si vols, et passo el lloc, canvi.','La pesca, malament! Però almenys hem vist el sol sortir, canvi.'],
  food:['Aquí fem un arròs a bord. Si us voleu apuntar, porteu el vi, canvi.','Uf, ara que ho dius, tinc una gana... A la marina diuen que el restaurant de la llotja és molt bo, canvi.','Jo avui només pa amb oli i formatge de Maó. No cal res més, canvi.'],
  weather:['Diuen que la tramuntana afluixarà al vespre. Demà serà un bon dia per sortir, canvi.','Aquí a la cala no es mou res, però a fora hi ha una mica de mar de fons, canvi.','Mira el parte del canal 20, que el van repetint cada poques hores, canvi.'],
  swim:['L’aigua està boníssima, uns vint-i-quatre graus! Però vigila amb les meduses, canvi.','Els nens no surten de l’aigua. Hem tret les ulleres de busseig i tot, canvi.','Ara mateix ens anàvem a banyar. Vine a {place}, que està transparent, canvi.'],
  wildlife:['Dofins? Quina sort! Nosaltres fa dies que no en veiem, canvi.','Que bonic! Nosaltres aquest matí hem vist una tortuga davant de {place}, canvi.'],
  boat:['El veler va com una seda, tot i que el pilot automàtic fa coses rares, canvi.','Nosaltres som fondejats amb vint metres de cadena, aguanta perfecte, canvi.','Quin vaixell porteu? Des d’aquí em sembla que sou vosaltres els de la vela blanca, canvi.'],
  help:['És clar, digues què necessites. Tinc eines a bord i una mica de gasoil de reserva, canvi.','Cap problema, si cal us passem a buscar amb la neumàtica, canvi.'],
  thanks:['De res, home! Per a això hi som, canvi.','No cal! Ens veiem per aquí, canvi.'],
  question:['Bona pregunta... no ho sé segur. Jo diria que sí, però pregunta-ho a la marina al canal 9, canvi.','Uf, no t’ho sabria dir. Potser a {place} t’ho saben dir, canvi.'],
  generic:['Rebut! Aquí tot bé, gaudint del dia, canvi.','Ha, molt bé! Doncs ens veiem més tard a terra, canvi.','T’entenc, t’entenc. Aquí estem de relax total, canvi.','Rebut. Si necessiteu res, som aquí, canvi.','Doncs mira, no ho havia pensat. Ja en parlarem a terra, canvi.','Ostres, de veritat? Explica-m’ho millor després, que la ràdio va plena, canvi.'],
 },
 es:{
  favor:['¡Claro! Pásate con la neumática cuando quieras y te lo dejamos, cambio.','Ahora lo miro... Sí, tenemos. Ven a buscarlo, cambio.','Uf, nos queda poco, pero algo te podemos dejar, cambio.'],
  where:['Estamos fondeados en {place}, pegados a la playa. Se está de lujo, cambio.','Ahora estamos en {place}, pero por la tarde pensamos movernos, cambio.'],
  how:['Todo bien por aquí, disfrutando del día. ¿Y vosotros?, cambio.','Muy bien, algo cansados de la travesía, pero contentos, cambio.'],
  plan:['Mañana queremos ir hacia {place} si el tiempo lo permite. ¿Y vosotros?, cambio.','Todavía no lo sabemos, depende del viento. Quizá {place}, cambio.'],
  greet:['¡Hola, {v}! Qué día más bueno, ¿eh? ¿Qué tal por ahí?, cambio.','¡Buenas, {v}! Aquí todo tranquilo. ¿Qué cuentas?, cambio.','¡Hombre, {v}! Hacía rato que no te oía. ¿Todo bien?, cambio.'],
  fish:['Hoy nada, ni una picada. Dicen que en {place} pican más, cambio.','Hemos sacado un par de dentones esta mañana. Si quieres te paso el sitio, cambio.','¡La pesca, fatal! Pero al menos hemos visto amanecer, cambio.'],
  food:['Aquí hacemos un arroz a bordo. Si os apuntáis, traed el vino, cambio.','Uf, ahora que lo dices, qué hambre... En la marina dicen que el restaurante de la lonja está muy bien, cambio.','Yo hoy solo pa amb oli y queso de Mahón. No hace falta más, cambio.'],
  weather:['Dicen que la tramontana afloja por la tarde. Mañana será buen día para salir, cambio.','Aquí en la cala no se mueve nada, pero fuera hay algo de mar de fondo, cambio.','Mira el parte del canal 20, lo repiten cada pocas horas, cambio.'],
  swim:['¡El agua está buenísima, unos veinticuatro grados! Pero ojo con las medusas, cambio.','Los críos no salen del agua. Hemos sacado hasta las gafas de buceo, cambio.','Ahora mismo nos íbamos a bañar. Vente a {place}, que está transparente, cambio.'],
  wildlife:['¿Delfines? ¡Qué suerte! Nosotros hace días que no vemos ninguno, cambio.','Esta mañana hemos visto una tortuga delante de {place}. Increíble, cambio.'],
  boat:['El velero va de maravilla, aunque el piloto automático hace cosas raras, cambio.','Estamos fondeados con veinte metros de cadena, aguanta perfecto, cambio.','¿Qué barco lleváis? Desde aquí creo que sois los de la vela blanca, cambio.'],
  help:['Claro, dime qué necesitas. Tengo herramientas a bordo y algo de gasoil de reserva, cambio.','Sin problema, si hace falta os vamos a buscar con la neumática, cambio.'],
  thanks:['¡De nada, hombre! Para eso estamos, cambio.','¡No hay de qué! Nos vemos por aquí, cambio.'],
  question:['Buena pregunta... no lo sé seguro. Yo diría que sí, pero pregúntalo a la marina en el canal 9, cambio.','Uf, no sabría decirte. A lo mejor en {place} te lo saben decir, cambio.'],
  generic:['¡Recibido! Aquí todo bien, disfrutando del día, cambio.','¡Ja, muy bien! Pues nos vemos luego en tierra, cambio.','Te entiendo, te entiendo. Aquí estamos de relax total, cambio.','Recibido. Si necesitáis algo, aquí estamos, cambio.','Pues mira, no lo había pensado. Ya lo hablamos en tierra, cambio.','¿En serio? Me lo cuentas mejor luego, que la radio va llena, cambio.'],
 },
 en:{
  favor:['Of course! Pop over in the dinghy whenever you like, over.','Let me check... yes, we have some. Come and get it, over.','We’re running low, but we can spare a bit, over.'],
  where:['We’re anchored in {place}, close to the beach. Lovely spot, over.','We’re in {place} now, might move this afternoon, over.'],
  how:['All good here, enjoying the day! You? Over.','Great, a bit tired after the crossing but happy, over.'],
  plan:['Tomorrow we want to head to {place} if the weather allows. You? Over.','Not sure yet, depends on the wind. Maybe {place}, over.'],
  greet:['Hi {v}! Gorgeous day, isn’t it? How are things? Over.','Morning {v}! All quiet here. What’s new? Over.','Hey {v}! Haven’t heard you for a while. All good? Over.'],
  fish:['Nothing today, not a bite. They say it’s better off {place}, over.','We caught a couple of bream this morning. Happy to share the spot, over.','Fishing was hopeless! But we saw a lovely sunrise, over.'],
  food:['We’re cooking a paella on board. Join us, bring some wine, over.','Now you mention it, I’m starving. The restaurant by the fish market is supposed to be great, over.','Just bread, olive oil and Mahon cheese for us today. Perfect, over.'],
  weather:['The northerly should ease this evening. Tomorrow looks good for sailing, over.','Flat calm in the cove, but there’s a bit of swell outside, over.','Check the forecast on channel 20, they repeat it every few hours, over.'],
  swim:['The water is lovely, about twenty-four degrees! Watch out for jellyfish though, over.','The kids won’t get out of the water. Masks and snorkels out, over.','We were just going for a swim. Come over to {place}, it’s crystal clear, over.'],
  wildlife:['Dolphins? Lucky you! We haven’t seen any for days, over.','We saw a turtle off {place} this morning. Amazing, over.'],
  boat:['She’s sailing beautifully, although the autopilot has a mind of its own, over.','We’re anchored on twenty metres of chain, holding well, over.','Which boat are you? I think you’re the one with the white sails, over.'],
  help:['Of course, what do you need? I’ve got tools on board and some spare diesel, over.','No problem, we can come over in the dinghy if needed, over.'],
  thanks:['No worries! That’s what we’re here for, over.','Anytime! See you around, over.'],
  question:['Good question... not sure. I think so, but ask the marina on channel 9, over.','No idea, sorry. Maybe they know in {place}, over.'],
  generic:['Roger! All good here, enjoying the day, over.','Ha, nice one! See you ashore later then, over.','I hear you. Total relaxation mode over here, over.','Roger. If you need anything, we’re here, over.','Hmm, hadn’t thought of that. Let’s talk ashore, over.','Really? Tell me more later, the radio is busy, over.'],
 },
};
export const PLACES=['Cala Teulera','Fornells','Cala en Porter','Sa Mesquida','Es Grau','Cala Turqueta','Addaia','Cala Mitjana'];
