// Mode IA: Claude entén qualsevol frase i respon com l'estació o el vaixell que toca.
// L'app decideix qui et pot sentir (canal i abast); Claude decideix qui contesta i què diu.
// Cal una clau d'API d'Anthropic, que es desa només en aquest navegador.
import {stations} from './stations.js';
import {info} from './channels.js';
import {RANGE} from './dialog.js';
import {t,channelName} from './i18n.js';

export const MODELS=[
 {id:'claude-opus-5-5',labelKey:'ai.m.opus',fallbacks:true},
 {id:'claude-sonnet-5-5',labelKey:'ai.m.sonnet',fallbacks:true},
 {id:'claude-haiku-5-5',labelKey:'ai.m.haiku',fallbacks:false},
];
let sdk=null;
const load=async()=>sdk||=await import('./vendor/anthropic-sdk.mjs');

const SYSTEM=`You run the world of a marine VHF radio training simulator set around the port of Maó (Mahón), Menorca. The user is the skipper of a sailing yacht and has just transmitted a message on the radio. Decide who (if anyone) answers, and write their radio replies.

Stations that exist (all fictional, for training):
- id "marina": Marina de Mahón / Mahon Marina / Marina de Mahon. Listens on 16 and 9 (working channel 9). Berths (asks length overall and nights, then assigns a pontoon A–E and a berth number), fuel dock (8:00–20:00, diesel and petrol), water and 16 A shore power, showers, laundry, office hours, local tips, weather forecast. Polite and efficient.
- id "port": Prácticos de Mahón / Mahon Pilots / Pilotes de Mahon (port control). Listens on 16 and 12 (working 12). Clearance to enter or leave the harbour, traffic in the channel (ferries, cargo ships), max 5 knots inside the harbour, keep to starboard of the channel. Brief and formal.
- id "sar": Salvamento Marítimo / Maritime Rescue / Sauvetage en mer. Listens on 16 and 10 (working 10). Distress (MAYDAY), urgency (PAN-PAN), safety (SECURITÉ), medical advice, towing assistance, weather. Calm and procedural.
- id "tramuntana": sailing yacht Tramuntana, a friendly skipper anchored in Cala Teulera. Listens on 16 and 72 (moves to 72 to chat). Chats about anchorages, fishing, food, weather, plans, can lend things.
- People recently heard on the current channel (listed in the situation) are other sailors, fishermen or crews; they speak their own language and may answer if addressed or if the message is clearly meant for them.

Radio rules to apply realistically:
- Channel 16 is for calling, distress and safety only. A station called on 16 answers briefly and asks to move to its working channel (unless it is distress or safety). If the user starts real business on 16, the station still asks to change channel.
- On a working channel the station handles the request directly, even if the user does not repeat its name.
- Only stations listed as "can hear you" in the situation may answer. If nobody plausible would answer (wrong channel, nobody addressed on a ship-to-ship channel and nobody heard there, out of range), return an empty replies list and use the tip to explain why.
- Distress: on a MAYDAY, "sar" acknowledges ("Mayday <vessel>, aquí Salvamento Marítimo, recibido mayday") and asks for whatever is missing among position, nature of distress and persons on board; once known, says a rescue unit is on its way, lifejackets on, keep listening on 16. Treat it seriously and procedurally.
- Replies sound like real VHF: short (normally under 40 words), the caller's vessel name first, end with "cambio" / "over" / "à vous" (or "fuera" / "out" / "terminé" when closing). Write numbers the way they would be said. No emojis, no markdown, no stage directions.
- Stations answer in the user's communication language. People heard on the channel answer in their own language (given in the situation).
- Keep continuity with the recent log: remember berths already given, what was asked, and do not repeat yourself word for word.
- If the message is unclear or garbled (it may come from imperfect speech recognition), make the most reasonable interpretation; ask to repeat only if it is truly incomprehensible.
- Normally one reply; two only if two different speakers would naturally answer.

The tip is optional coaching for the learner, in the interface language given in the situation, one short sentence, only when there is a clear procedure mistake (e.g. business on 16, did not identify the vessel, wrong channel, called a station out of range, distress not on 16). Otherwise an empty string.`;

const SCHEMA={type:'object',additionalProperties:false,required:['replies','tip'],properties:{
 replies:{type:'array',description:'Radio replies in the order they are transmitted; empty if nobody answers.',items:{type:'object',additionalProperties:false,required:['speaker','lang','text'],properties:{
  speaker:{type:'string',description:'A station id (marina, port, sar, tramuntana) or the exact name of a person heard on the channel.'},
  lang:{type:'string',enum:['es','en','fr'],description:'Language the reply is spoken in.'},
  text:{type:'string',description:'What the speaker says on the radio.'}}}},
 tip:{type:'string',description:'Short coaching tip in the interface language, or empty string.'}}};

const LANG={ca:'Catalan',es:'Spanish',en:'English',fr:'French'};
// Situació concreta d'aquesta transmissió (el que canvia a cada missatge).
export function situation({text,channel,lang,ui='ca',power,vessel,heard=[],history=[]}){
 const c=info(channel),eff=c.lowPowerOnly?'lo':power,range=RANGE[eff];
 const can=[],cannot=[];
 for(const st of stations){
  const name=st.name[lang]||st.name.es;
  if(!st.listen.includes(channel))cannot.push(`${st.id} (${name}): not listening on channel ${channel} (listens on ${st.listen.join(' and ')})`);
  else if(st.nm>=range)cannot.push(`${st.id} (${name}): out of range at ${eff==='lo'?'1 W':'25 W'} (${st.nm} NM away)`);
  else can.push(`${st.id} (${name}), ${st.nm} NM away, reception ${st.nm/range<.4?'5/5':st.nm/range<.7?'4/5':'3/5 noisy'}`);
 }
 for(const h of heard)can.push(`"${h.name}" (heard recently on this channel, speaks ${LANG[h.lang]})`);
 return [
  `User's vessel: sailing yacht "${vessel}". Radio communication language: ${LANG[lang]||'Spanish'}. Interface language (for the tip): ${LANG[ui]||'Catalan'}.`,
  `Channel ${channel} (${channelName(c.nameKey,'en')}). Transmit power ${eff==='lo'?'1 W (low)':'25 W (high)'}.`,
  `Can hear you on this channel:\n${can.length?can.map(x=>'- '+x).join('\n'):'- nobody'}`,
  `Cannot answer:\n${cannot.map(x=>'- '+x).join('\n')}`,
  `Recent radio log on channel ${channel} (oldest first):\n${history.length?history.map(h=>`- ${h.who}: ${h.text}`).join('\n'):'- (nothing yet)'}`,
  `The user (${vessel}) has just transmitted:\n"""${text}"""`,
 ].join('\n\n');
}

// El missatge es tradueix a l'idioma de la interfície.
export class AIError extends Error{constructor(kind,vars){super(t('ai.err.'+kind,vars));this.kind=kind}}
export async function aiRespond({apiKey,model='claude-opus-5-5',text,channel,lang='es',ui='ca',power='hi',vessel='Xaloc',heard=[],history=[]}){
 if(!apiKey)throw new AIError('nokey');
 const {Anthropic,betaJSONSchemaOutputFormat}=await load();
 const client=new Anthropic({apiKey,dangerouslyAllowBrowser:true,maxRetries:1,timeout:30000});
 const m=MODELS.find(x=>x.id===model)||MODELS[0];
 const params={
  model:m.id,max_tokens:4000,
  system:[{type:'text',text:SYSTEM,cache_control:{type:'ephemeral'}}],
  messages:[{role:'user',content:situation({text,channel,lang,ui,power,vessel,heard,history})}],
  // Respostes de ràdio curtes: esforç baix és prou i respon abans.
  output_config:{effort:'low',format:betaJSONSchemaOutputFormat(SCHEMA)},
 };
 // Si el model principal declina la petició, l'API la torna a provar amb un model alternatiu.
 if(m.fallbacks){params.betas=['server-side-fallback-2026-07-01'];params.fallbacks='default'}
 let res;
 try{res=await client.beta.messages.parse(params)}
 catch(e){
  if(e instanceof Anthropic.AuthenticationError)throw new AIError('key');
  if(e instanceof Anthropic.PermissionDeniedError)throw new AIError('perm');
  if(e instanceof Anthropic.RateLimitError)throw new AIError('rate');
  if(e instanceof Anthropic.BadRequestError)throw new AIError('request');
  if(e instanceof Anthropic.APIConnectionError)throw new AIError('network');
  if(e instanceof Anthropic.APIError)throw new AIError('server',{status:e.status});
  throw new AIError('unknown');
 }
 if(res.stop_reason==='refusal')throw new AIError('refusal');
 const out=res.parsed_output;
 if(!out||!Array.isArray(out.replies))throw new AIError('parse');
 // Només poden contestar els que realment et poden sentir.
 const allowed=new Set(stations.filter(st=>st.listen.includes(channel)&&st.nm<RANGE[info(channel).lowPowerOnly?'lo':power]).map(st=>st.id));
 const replies=[];
 for(const r of out.replies.slice(0,2)){
  const text=String(r.text||'').trim();if(!text)continue;
  const lang2=['es','en','fr'].includes(r.lang)?r.lang:lang;
  if(allowed.has(r.speaker)){replies.push({station:r.speaker,text,lang:lang2});continue}
  const h=heard.find(h=>h.name===r.speaker||h.name.split(' · ').some(p=>p.toLowerCase()===String(r.speaker).toLowerCase()));
  if(h)replies.push({station:'heard:'+h.name,name:h.name,voice:h,text,lang:lang2});
 }
 return {replies,tips:out.tip?[out.tip]:[],usage:res.usage};
}
