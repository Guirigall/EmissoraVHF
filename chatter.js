// Variants de resposta i conversa informal per al motor local (sense IA).
// Les claus de VAR s'afegeixen a les respostes base de dialog.js: així una mateixa situació no sona sempre igual.
export const VAR={
 es:{
  call16:['{v}, aquí {s}. Recibido, pase al {c}, cambio.','{v}, {s} le recibe. Canal {c}, por favor, cambio.'],
  goAhead:['{v}, aquí {s}. Le recibo, adelante, cambio.','{s} a la escucha. Adelante, {v}, cambio.','{v}, aquí {s}. ¿En qué le podemos ayudar?, cambio.'],
  bye:['Recibido, {v}. Que vaya bien. {s} fuera.','{v}, a usted. {s} queda a la escucha en el canal {c}.'],
  berthOk:['{v}, tiene amarre en el pantalán {p}, número {n}, para {nights}. El marinero le espera en la bocana, cambio.','{v}, perfecto: pantalán {p}, amarre {n}, {nights}. Defensas a estribor, por favor, cambio.'],
  fuel:['{v}, puede venir a la gasolinera cuando quiera, ahora está libre. Gasoil y gasolina, cambio.'],
 },
 fr:{
  call16:['{v}, ici {s}. Reçu, passez sur le {c}, à vous.','{v}, {s} vous reçoit. Canal {c}, s’il vous plaît, à vous.'],
  goAhead:['{v}, ici {s}. Je vous reçois, parlez, à vous.','{s} à l’écoute. Allez-y {v}, à vous.','{v}, ici {s}. Que pouvons-nous faire pour vous ?, à vous.'],
  bye:['Reçu {v}. Bonne journée. {s}, terminé.','{v}, de même. {s} reste à l’écoute sur le canal {c}.'],
  berthOk:['{v}, vous avez le ponton {p}, place {n}, pour {nights}. Le marinero vous attend à l’entrée, à vous.','{v}, parfait : ponton {p}, place {n}, {nights}. Pare-battages à tribord, s’il vous plaît, à vous.'],
  fuel:['{v}, la station de carburant est libre, venez quand vous voulez. Gazole et essence, à vous.'],
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
 es:{marina:['{v}, aquí {s}. No le he acabado de entender. Le puedo dar amarre, combustible, agua y luz o la previsión del tiempo. ¿Qué necesita?, cambio.','{v}, perdone, se le ha oído cortado. ¿Necesita amarre, gasoil u otra cosa?, cambio.'],
  port:['{v}, aquí {s}. No le he entendido. ¿Quiere entrar o salir de puerto?, cambio.','{v}, repita, por favor. Indique si entra o sale de puerto, cambio.'],
  sar:['{v}, aquí {s}. No le he entendido. ¿Tiene alguna emergencia o necesita asistencia?, cambio.']},
 fr:{marina:['{v}, ici {s}. Je n’ai pas bien compris. Nous pouvons vous proposer une place, du carburant, eau et électricité ou la météo. De quoi avez-vous besoin ?, à vous.','{v}, pardon, vous étiez haché. Il vous faut une place, du gazole ou autre chose ?, à vous.'],
  port:['{v}, ici {s}. Répétez, s’il vous plaît. Vous entrez ou vous sortez du port ?, à vous.'],
  sar:['{v}, ici {s}. Répétez. Avez-vous une urgence ou besoin d’assistance ?, à vous.']},
 en:{marina:['{v}, {s}. I didn’t quite get that. We can help with a berth, fuel, water and power, or the forecast. What do you need? Over.','{v}, sorry, you were breaking up. Do you need a berth, fuel or something else? Over.'],
  port:['{v}, {s}. Say again please. Are you entering or leaving the harbour? Over.'],
  sar:['{v}, {s}. Say again. Do you have an emergency or need assistance? Over.']},
};
// Altres serveis de la marina.
export const MARINA={
 es:{water:['{v}, en el pantalán hay agua y toma de corriente de dieciséis amperios. La tarjeta se recoge en la oficina, cambio.'],shower:['{v}, las duchas están en el edificio de la oficina. El código está en la factura, cambio.'],laundry:['{v}, la lavandería está junto a la oficina, con fichas de recepción, cambio.'],price:['{v}, para su eslora son unos {price} euros por noche, agua y luz incluidas, cambio.'],hours:['{v}, la oficina abre de ocho de la mañana a ocho de la tarde, y el canal 9 lo escuchamos todo el día, cambio.'],arrive:['{v}, recibido. Vea la neumática por babor, el marinero le guiará hasta el amarre, cambio.','{v}, perfecto, el marinero ya sale. Prepare cabos a proa y a popa, cambio.'],restaurant:['{v}, en el muelle hay un par de restaurantes. Si quiere pescado, el de la lonja está muy bien, cambio.']},
 fr:{water:['{v}, sur le ponton il y a l’eau et une prise de seize ampères. La carte se retire au bureau, à vous.'],shower:['{v}, les douches sont dans le bâtiment du bureau, le code est sur votre facture, à vous.'],laundry:['{v}, la laverie est à côté du bureau, jetons à l’accueil, à vous.'],price:['{v}, pour votre longueur c’est environ {price} euros la nuit, eau et électricité comprises, à vous.'],hours:['{v}, le bureau est ouvert de huit heures à vingt heures, et nous veillons le canal 9 toute la journée, à vous.'],arrive:['{v}, reçu. Repérez le pneumatique sur bâbord, le marinero va vous guider jusqu’à la place, à vous.','{v}, parfait, le marinero arrive. Préparez vos amarres avant et arrière, à vous.'],restaurant:['{v}, il y a quelques restaurants sur le quai. Pour le poisson, celui de la criée est excellent, à vous.']},
 en:{water:['{v}, there is water and sixteen amp power on the pontoon. Pick up the card at the office, over.'],shower:['{v}, showers are in the office building, the code is on your receipt, over.'],laundry:['{v}, the laundry is next to the office, tokens at reception, over.'],price:['{v}, for your length it is about {price} euros a night, water and power included, over.'],hours:['{v}, the office is open from eight to eight, and we monitor channel 9 all day, over.'],arrive:['{v}, roger. Look for the rib on your port side, the marinero will guide you in, over.','{v}, great, the marinero is on his way. Get your lines ready fore and aft, over.'],restaurant:['{v}, there are a couple of restaurants on the quay. For fish, the one by the market is lovely, over.']},
};
// Conversa informal entre velers: es tria el tema pel que has dit.
export const TOPICS={
 greet:['salut','bonjour','bonsoir','hola','bon dia','bona tarda','bones','buenos dias','buenas','hello','hi','hey','ei','eii','que tal'],
 fish:['peche','pecher','poisson','poissons','calmar',  'pesca','pescar','peix','peixos','pescat','pescado','pez','peces','fish','fishing','calamar','calamars','calamares','canya','cana','curricà','curricán'],
 food:['diner','dejeuner','manger','biere','vin','glace','sopar','dinar','menjar','arros','paella','cena','comida','cenar','comer','dinner','lunch','food','cervesa','cerveza','beer','vi','vino','wine','gelat','helado'],
 weather:['houle','pluie','vagues','tramontane','vent','viento','wind','tramuntana','tramontana','mestral','llevant','levante','pluja','lluvia','rain','onada','onades','olas','waves','mar de fons','mar de fondo','swell','calor','fred','frio'],
 swim:['baigner','baignade','nager','meduses','banyar','bany','nedar','aigua','agua','banarse','banar','nadar','swim','swimming','water','snorkel','meduses','medusas','jellyfish'],
 wildlife:['dauphin','dauphins','tortue','baleine','dofi','dofins','delfin','delfines','dolphin','dolphins','tortuga','tortugas','turtle','balena','ballena','whale','ocells','gavines'],
 boat:['voilier','bateau','voile','mouillage','ancre','veler','vaixell','barco','velero','boat','sail','vela','veles','motor','ancora','ancla','anchor','fondeig','fondejar','fondear'],
 favor:['vous avez','tu as','pourriez vous','tu peux','preter','teniu','tens','podeu','pots','ens deixeu','em deixes','deixar nos','tienes','teneis','podeis','puedes','nos dejais','prestar','could you','can you','do you have','borrow','lend'],
 help:['aide','aider','besoin','outils','ajuda','ajudar','ayuda','ayudar','help','necessito','necesito','need','eines','herramientas','tools'],
 thanks:['merci','gracies','gracias','thanks','thank'],
};
export const SMALL={
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
 fr:{
  favor:['Bien sûr ! Passe avec l’annexe quand tu veux, on te le prête, à vous.','Je regarde… Oui, on en a. Viens le chercher, à vous.','Il nous en reste peu, mais on peut t’en laisser un peu, à vous.'],
  where:['On est au mouillage à {place}, tout près de la plage. C’est super, à vous.','On est à {place} pour l’instant, on bougera peut-être cet après-midi, à vous.'],
  how:['Tout va bien ici, on profite de la journée ! Et vous ?, à vous.','Très bien, un peu fatigués de la traversée mais contents, à vous.'],
  plan:['Demain on veut aller vers {place} si la météo le permet. Et vous ?, à vous.','On ne sait pas encore, ça dépend du vent. Peut-être {place}, à vous.'],
  greet:['Salut {v} ! Quelle belle journée, hein ? Ça va par là-bas ?, à vous.','Bonjour {v} ! Tout est calme ici. Quoi de neuf ?, à vous.','Tiens, {v} ! Ça faisait longtemps. Tout va bien ?, à vous.'],
  fish:['Rien aujourd’hui, pas une touche. Il paraît que ça mord mieux vers {place}, à vous.','On a pris deux dentis ce matin. Je peux te donner le coin, à vous.','La pêche, catastrophe ! Mais au moins on a vu le lever du soleil, à vous.'],
  food:['On fait une paella à bord. Venez, apportez le vin, à vous.','Maintenant que tu le dis, j’ai une faim… Le restaurant de la criée est très bon, paraît-il, à vous.','Pour nous ce soir, pain, huile d’olive et fromage de Mahon. Parfait, à vous.'],
  weather:['La tramontane doit faiblir ce soir. Demain sera un bon jour pour sortir, à vous.','Dans la crique rien ne bouge, mais dehors il y a un peu de houle, à vous.','Écoute la météo sur le canal 20, ils la répètent toutes les quelques heures, à vous.'],
  swim:['L’eau est super, vingt-quatre degrés ! Attention aux méduses quand même, à vous.','Les enfants ne sortent plus de l’eau. Masques et tubas, à vous.','On allait justement se baigner. Viens à {place}, l’eau est transparente, à vous.'],
  wildlife:['Des dauphins ? Quelle chance ! On n’en a pas vu depuis des jours, à vous.','Magnifique ! Nous, ce matin, on a vu une tortue devant {place}, à vous.'],
  boat:['Le bateau marche du tonnerre, même si le pilote automatique fait des siennes, à vous.','On est mouillés sur vingt mètres de chaîne, ça tient parfaitement, à vous.','C’est quoi votre bateau ? D’ici je crois que vous êtes ceux aux voiles blanches, à vous.'],
  help:['Bien sûr, dis-moi ce qu’il te faut. J’ai des outils à bord et un peu de gazole en réserve, à vous.','Pas de souci, on peut venir avec l’annexe si besoin, à vous.'],
  thanks:['De rien ! C’est normal, à vous.','Avec plaisir ! À plus tard, à vous.'],
  question:['Bonne question… je ne sais pas trop. Je dirais oui, mais demande à la marina sur le canal 9, à vous.','Aucune idée, désolé. Peut-être qu’à {place} ils savent, à vous.'],
  generic:['Reçu ! Tout va bien ici, on profite, à vous.','Ha, très bien ! On se voit à terre plus tard, à vous.','Je comprends, je comprends. Ici c’est détente totale, à vous.','Reçu. Si vous avez besoin de quelque chose, on est là, à vous.','Tiens, je n’y avais pas pensé. On en parle à terre, à vous.','Vraiment ? Raconte-moi plus tard, la radio est chargée, à vous.'],
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
