import {info,step,format} from './channels.js';
import {byId} from './stations.js';
import {respond,newState,dscAlert} from './dialog.js';
import {Traffic,data as dataChannels} from './traffic.js';
import {RadioAudio} from './audio.js';
import {aiRespond,MODELS} from './ai.js';
import {speak,silence,canSpeak,canListen,listen,hasVoice,voicesReady,speechFailures} from './voice.js';

const $=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms)),rand=(a,b)=>a+Math.random()*(b-a);
const audio=new RadioAudio();
const KEY='vhf-settings-v1';
const settings={vessel:'Xaloc',lang:'ca',mode:canListen()?'voice':'text',subtitles:true,volume:.6,squelch:.2,channel:16,power:'hi',ai:false,apiKey:'',model:'claude-opus-5-5'};
try{Object.assign(settings,JSON.parse(localStorage.getItem(KEY))||{})}catch{}
if(settings.mode==='voice'&&!canListen())settings.mode='text';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(settings))}catch{}};

const state={on:false,channel:settings.channel,power:settings.power,tx:false,rx:null,scan:false,scanHold:0,lastScan:0,dialog:newState(),queue:[],nextData:0,txLevel:0,signal:0};
const traffic=new Traffic(Date.now());
let rxToken=0,recognizer=null,stopMeter=null,txTimer=null,textTxTimer=null,msgTimer=null;

/* ---------- Pantalla LCD ---------- */
const DIGITS={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgedc',7:'abc',8:'abcdefg',9:'abcdfg','-':'g',' ':''};
function hex(x,y,w,h,vertical){
 if(!vertical){const k=h/2;return `${x},${y+k} ${x+k},${y} ${x+w-k},${y} ${x+w},${y+k} ${x+w-k},${y+h} ${x+k},${y+h}`}
 const k=w/2;return `${x+k},${y} ${x+w},${y+k} ${x+w},${y+h-k} ${x+k},${y+h} ${x},${y+h-k} ${x},${y+k}`;
}
const SEG={a:[9,0,40,10,0],b:[48,8,10,38,1],c:[48,44,10,38,1],d:[9,80,40,10,0],e:[0,44,10,38,1],f:[0,8,10,38,1],g:[9,40,40,10,0]};
(function buildDigits(){const svg=$('#digits');let html='';
 for(const [i,x0] of [[0,8],[1,72]]){html+=`<g transform="translate(${x0} 1) skewX(-6)">`;for(const [k,[x,y,w,h,v]] of Object.entries(SEG))html+=`<polygon class="seg" data-d="${i}" data-s="${k}" points="${hex(x,y,w,h,v)}"/>`;html+='</g>'}
 svg.innerHTML=html;})();
function showDigits(text){const t=String(text).padStart(2,'0').slice(-2);
 for(const p of document.querySelectorAll('#digits .seg'))p.classList.toggle('on',DIGITS[t[+p.dataset.d]]?.includes(p.dataset.s))}
function lcdMessage(text,ms=0){$('#lcdMsg').textContent=text||' ';clearTimeout(msgTimer);msgTimer=null;if(ms)msgTimer=setTimeout(()=>{msgTimer=null;render()},ms)}
function render(){
 const c=info(state.channel),power=c.lowPowerOnly?'lo':state.power;
 $('.radio').classList.toggle('on',state.on);
 showDigits(state.channel);
 $('#freq').textContent=(c.duplex?'RX ':'')+format(c.rx)+' MHz'+(c.duplex?' · TX '+format(c.tx):'');
 $('#chname').textContent=c.name;
 for(const [id,on] of [['fTx',state.tx],['fBusy',!!state.rx],['fScan',state.scan],['fDuplex',c.duplex]])$('#'+id).classList.toggle('on',on);
 $('#fPower').textContent=power==='hi'?'HI':'LO';$('#fPower').classList.add('on');
 const level=state.tx?state.txLevel:state.rx?state.signal:0,bars=Math.round(level*6);
 document.querySelectorAll('#meter i').forEach((b,i)=>b.classList.toggle('on',i<bars));
 $('#meterLabel').textContent=state.tx?'TX':'RX';
 $('#kScan').setAttribute('aria-pressed',state.scan);$('#power').setAttribute('aria-pressed',state.on);
 $('#ptt').disabled=!state.on;$('#ptt').classList.toggle('tx',state.tx);
 $('#pttHint').textContent=!state.on?'Encén la ràdio':state.tx?'Transmetent… deixa anar per escoltar':c.txAllowed?'Mantén premut i parla':'Canal sense veu';
 const dial=$('#dial');dial.setAttribute('aria-valuenow',state.channel);dial.setAttribute('aria-valuetext','Canal '+state.channel+', '+c.name);
 if(!state.rx&&!state.tx&&!msgTimer)lcdMessage('');
}

/* ---------- Registre ---------- */
const time=()=>new Date().toLocaleTimeString('ca',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
function log(kind,text,who=''){
 const li=document.createElement('li');li.className=kind;
 const hidden=!settings.subtitles&&['station','traffic'].includes(kind);
 const meta=document.createElement('span');meta.className='meta';meta.textContent=`${time()} · canal ${state.channel}${who?' · '+who:''}`;
 li.append(meta,document.createTextNode(hidden?'(veu)':text));
 const list=$('#log');list.append(li);while(list.children.length>200)list.firstChild.remove();list.scrollTop=list.scrollHeight;
}
function toast(text){const t=$('#toast');t.textContent=text;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,4200)}

/* ---------- Recepció ---------- */
function interruptRx(reason){
 const rx=state.rx;if(!rx)return;rxToken++;state.rx=null;state.signal=0;silence();
 if(reason==='tune'){audio.carrier=0;audio.update()}else audio.carrierOff();
 if(rx.kind==='traffic'||rx.kind==='distant')traffic.done(rx.ch,Date.now());
 if(rx.kind==='reply')log('missed',`Has deixat d’escoltar la resposta de ${rx.who}.`);
}
function endRx(token){if(token!==rxToken||!state.rx)return;const rx=state.rx;state.rx=null;state.signal=0;audio.carrierOff();
 if(rx.kind==='traffic'||rx.kind==='distant')traffic.done(rx.ch,Date.now());render()}
// Historial recent de cada canal: el que s'ha sentit i el que has dit (context per a la IA).
const history={};
function remember(ch,who,text){const h=history[ch]||=[];h.push({who,text});if(h.length>14)h.shift()}
async function playTraffic(line){
 const token=++rxToken,ch=state.channel;
 if(line.distant){
  state.rx={kind:'distant',ch,token};state.signal=rand(.1,.25);audio.carrierOn(state.signal);audio.distantVoice(line.duration/1000,.6);
  lcdMessage('··· senyal feble ···');if(!playTraffic.lastDistant||playTraffic.lastDistant!==ch){log('distant','Conversa llunyana: no s’entén.');playTraffic.lastDistant=ch}
  render();await sleep(line.duration);endRx(token);return;
 }
 playTraffic.lastDistant=null;
 const sp=line.speaker;state.rx={kind:'traffic',ch,token};state.signal=Math.min(1,sp.signal*rand(.85,1.05));
 audio.carrierOn(state.signal);lcdMessage('◀ '+sp.name);log('traffic',line.text,sp.name);remember(ch,sp.name,line.text);render();
 await sleep(rand(150,320));if(token!==rxToken)return;
 await speak({text:line.text,lang:sp.lang,pitch:sp.pitch,rate:sp.rate,volume:.5+.5*state.signal,seed:sp.name});
 endRx(token);
}
const replyName=r=>r.name||byId(r.station)?.name[r.lang]||byId(r.station)?.name.ca||r.station;
async function playReply(reply){
 const st=byId(reply.station),voice=reply.voice||st?.voice||{pitch:1,rate:1,signal:.8},token=++rxToken,ch=state.channel,who=replyName(reply);
 state.rx={kind:'reply',ch,token,who};state.signal=voice.signal;
 audio.carrierOn(state.signal);lcdMessage('◀ '+who);log('station',reply.text,who);remember(ch,who,reply.text);render();
 await sleep(rand(200,350));if(token!==rxToken)return;
 await speak({text:reply.text,lang:reply.lang,pitch:voice.pitch,rate:voice.rate,volume:.6+.4*state.signal,seed:reply.name||st?.id||who});
 endRx(token);
}
function loop(){
 if(!state.on)return;const now=Date.now(),ch=state.channel;
 traffic.tick(now,ch);
 const dataInfo=dataChannels[ch];if(dataInfo&&!state.tx&&now>=state.nextData){audio.dataBurst(dataInfo.kind);if(!state.rx){state.signal=.7;render();setTimeout(()=>{if(!state.rx){state.signal=0;render()}},120)}state.nextData=now+rand(...dataInfo.every)*1000}
 if(state.scan)scanStep(now);
 for(const r of [...state.queue])if(r.channel!==ch&&now>r.at+15000){state.queue.splice(state.queue.indexOf(r),1);log('missed',`${replyName(r)} t’ha respost al canal ${r.channel} i no hi eres.`)}
 if(state.tx||state.rx)return;
 const due=state.queue.find(r=>r.channel===ch&&r.at<=now);
 if(due){state.queue.splice(state.queue.indexOf(due),1);playReply(due);return}
 const line=traffic.take(ch,now);if(line)playTraffic(line);
}
setInterval(loop,120);

/* ---------- Canals i botons ---------- */
function setChannel(ch,{quiet=false}={}){
 if(ch===state.channel)return;interruptRx('tune');state.channel=ch;settings.channel=ch;save();
 state.nextData=Date.now()+rand(300,1500);if(state.on){audio.tune();if(!quiet)audio.beep(2600,18,.05)}
 $('#channelAnnounce').textContent='Canal '+ch;render();
}
function scanStep(now){
 if(state.rx||state.tx){state.scanHold=now+3500;return}
 if(now<state.scanHold)return;
 if(traffic.busy(state.channel,now)||state.queue.some(r=>r.channel===state.channel)){state.scanHold=now+2500;return}
 if(now-state.lastScan<170)return;state.lastScan=now;
 let next=step(state.channel,1);while(!info(next).txAllowed)next=step(next,1);setChannel(next,{quiet:true});
}
async function powerToggle(){
 if(state.on){interruptRx('tune');state.on=false;state.scan=false;if(state.tx)await pttUp();audio.stop();render();return}
 try{await audio.start()}catch{toast('Aquest navegador no pot generar so (Web Audio).');return}
 audio.setVolume(settings.volume);audio.setSquelch(settings.squelch);await audio.resume();
 state.on=true;state.nextData=0;render();
 $('#freq').textContent='NAVÍLIA VHF';showDigits('88');audio.beep(1800,90);await sleep(650);audio.beep(2400,70);render();
 if(!settings.boot){settings.boot=true;save();log('system','Ràdio encesa al canal '+state.channel+'. Gira el dial (o fes servir ▲▼ i la roda del ratolí) per escoltar altres canals; el SQL controla l’estàtica.')}
}
$('#power').onclick=powerToggle;
$('#k16').onclick=()=>{if(state.on)setChannel(state.channel===16?9:16)};
$('#kHL').onclick=()=>{if(!state.on)return;state.power=state.power==='hi'?'lo':'hi';settings.power=state.power;save();audio.beep();if(info(state.channel).lowPowerOnly)lcdMessage('Canal limitat a 1 W',2500);render()};
$('#kScan').onclick=()=>{if(!state.on)return;state.scan=!state.scan;state.scanHold=0;audio.beep(state.scan?2600:1900);render()};
$('#kUp').onclick=()=>state.on&&setChannel(step(state.channel,1));
$('#kDown').onclick=()=>state.on&&setChannel(step(state.channel,-1));

/* ---------- Comandaments giratoris ---------- */
function knob(el,{get,set,onStep,range=270}){
 const show=()=>{if(get)el.style.setProperty('--a',(get()*range-range/2)+'deg')};
 let last=null,acc=0;const angle=e=>{const r=el.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI};
 el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);last=angle(e);e.preventDefault()});
 el.addEventListener('pointermove',e=>{if(last===null)return;let a=angle(e),d=a-last;if(d>180)d-=360;if(d<-180)d+=360;last=a;
  if(onStep){acc+=d;el.style.setProperty('--a',(parseFloat(el.style.getPropertyValue('--a'))||0)+d+'deg');while(Math.abs(acc)>=18){onStep(Math.sign(acc));acc-=18*Math.sign(acc)}}
  else{set(Math.max(0,Math.min(1,get()+d/range)));show()}});
 const end=()=>{last=null;acc=0};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
 el.addEventListener('wheel',e=>{e.preventDefault();const s=e.deltaY<0?1:-1;if(onStep){onStep(s);el.style.setProperty('--a',(parseFloat(el.style.getPropertyValue('--a'))||0)+s*18+'deg')}else{set(Math.max(0,Math.min(1,get()+s*.05)));show()}},{passive:false});
 el.addEventListener('keydown',e=>{const s={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1}[e.key];if(!s)return;e.preventDefault();if(onStep){onStep(s);el.style.setProperty('--a',(parseFloat(el.style.getPropertyValue('--a'))||0)+s*18+'deg')}else{set(Math.max(0,Math.min(1,get()+s*.05)));show()}});
 show();return show;
}
const volKnob=knob($('#vol'),{get:()=>settings.volume,set:v=>{settings.volume=v;audio.setVolume(v);$('#vol').setAttribute('aria-valuenow',Math.round(v*100));save()}});
const sqlKnob=knob($('#sql'),{get:()=>settings.squelch,set:v=>{settings.squelch=v;audio.setSquelch(v);$('#sql').setAttribute('aria-valuenow',Math.round(v*100));save();if(state.on)lcdMessage(v<.3?'SQL obert · estàtica':'SQL tancat',1200)}});
knob($('#dial'),{onStep:s=>{if(state.on)setChannel(step(state.channel,s))}});

/* ---------- Transmissió ---------- */
function canTransmit(){
 if(!state.on){toast('Primer encén la ràdio (PWR).');return false}
 if(!info(state.channel).txAllowed){audio.error();lcdMessage('TX NO PERMESA EN AQUEST CANAL',2500);return false}
 return true;
}
async function pttDown(){
 if(state.tx||!canTransmit())return;
 if(state.rx){const kind=state.rx.kind;interruptRx('step');if(kind!=='distant')log('system','Has transmès mentre algú parlava: ningú no ha sentit ni l’un ni l’altre.')}
 state.scan=false;state.tx=true;audio.tx(true);lcdMessage('▶ TRANSMETENT');render();
 const heard=$('#heard');heard.classList.add('live');
 if(settings.mode==='voice'&&canListen()){
  heard.textContent='Escoltant…';
  recognizer=listen(settings.lang,text=>{heard.textContent=text||'Escoltant…'});
  audio.micMeter(l=>{state.txLevel=Math.min(1,l*2.2);$('#ptt').style.setProperty('--lvl',state.txLevel);render()}).then(stop=>{if(state.tx)stopMeter=stop;else stop()});
 }else heard.textContent='Mode text: escriu el missatge a sota i prem «Transmet».';
 clearTimeout(txTimer);txTimer=setTimeout(()=>{if(state.tx){lcdMessage('TEMPS DE TX ESGOTAT',2500);pttUp()}},45000);
}
async function pttUp(){
 if(!state.tx||textTxTimer)return;clearTimeout(txTimer);state.tx=false;state.txLevel=0;audio.tx(false);stopMeter?.();stopMeter=null;render();
 const heard=$('#heard');heard.classList.remove('live');
 if(!recognizer)return;const r=recognizer;recognizer=null;heard.textContent='Processant…';
 const {text,error}=await r.stop();
 if(text){heard.textContent='«'+text+'»';transmitted(text);return}
 heard.textContent=error==='not-allowed'||error==='service-not-allowed'?'Cal donar permís al micròfon per parlar. També pots escriure el missatge.'
  :error==='network'?'El reconeixement de veu del navegador necessita connexió a Internet. Mentrestant, escriu el missatge.'
  :'No s’ha reconegut cap frase. Mantén premut el PTT mentre parles i deixa’l anar en acabar.';
}
async function transmitted(text){
 const channel=state.channel,heard=traffic.heard(channel),context=[...(history[channel]||[])];
 log('me',text,settings.vessel+' (tu)');remember(channel,settings.vessel+' (tu)',text);
 const local=()=>respond({text,channel,lang:settings.lang,power:state.power,vessel:settings.vessel,state:state.dialog,heard});
 if(!settings.ai||!settings.apiKey){deliver(local(),channel);return}
 if(navigator.onLine===false){log('system','Mode IA sense connexió: respon el motor local.');deliver(local(),channel);return}
 const heardBox=$('#heard'),before=heardBox.textContent;heardBox.textContent=before+'  · IA…';
 try{
  const r=await aiRespond({apiKey:settings.apiKey,model:settings.model,text,channel,lang:settings.lang,power:state.power,vessel:settings.vessel,heard,history:context});
  deliver(r,channel);
 }catch(e){
  log('system',`Mode IA no disponible (${e.message}) Respon el motor local.`);
  deliver(local(),channel);
 }finally{if(heardBox.textContent.endsWith('  · IA…'))heardBox.textContent=before}
}
function deliver(r,txChannel=state.channel){
 for(const t of r.tips)log('tip','Consell: '+t);
 let at=Date.now()+rand(1200,2600);
 for(const reply of r.replies){const channel=reply.channel??txChannel;state.queue.push({...reply,channel,at});traffic.hold(channel,at+(1500+reply.text.length*75));at+=4000}
}
function sendText(text){
 text=text.trim();if(!text||!canTransmit())return;
 if(state.tx)return;if(state.rx)interruptRx('step');
 state.scan=false;state.tx=true;audio.tx(true);lcdMessage('▶ TRANSMETENT');
 const anim=setInterval(()=>{state.txLevel=rand(.35,.9);render()},110);render();
 textTxTimer=setTimeout(()=>{clearInterval(anim);textTxTimer=null;state.tx=false;state.txLevel=0;audio.tx(false);render();transmitted(text)},Math.min(5000,500+text.length*45));
 $('#textInput').value='';$('#heard').textContent='«'+text+'»';
}
const ptt=$('#ptt');
ptt.addEventListener('pointerdown',e=>{ptt.setPointerCapture(e.pointerId);e.preventDefault();pttDown()});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])ptt.addEventListener(ev,()=>pttUp());
ptt.addEventListener('contextmenu',e=>e.preventDefault());
$('#textForm').addEventListener('submit',e=>{e.preventDefault();sendText($('#textInput').value)});
const typing=e=>['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName);
addEventListener('keydown',e=>{
 if(typing(e)||e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.code==='Space'){e.preventDefault();if(!e.repeat)pttDown();return}
 if(e.repeat)return;
 const k=e.key.toLowerCase();
 if(k==='p')powerToggle();else if(k==='s')$('#kScan').click();else if(k==='h')$('#kHL').click();else if(k==='1')$('#k16').click();
 else if(e.target.closest?.('.knob'))return;else if(e.key==='ArrowUp'){e.preventDefault();$('#kUp').click()}else if(e.key==='ArrowDown'){e.preventDefault();$('#kDown').click()}
});
addEventListener('keyup',e=>{if(e.code==='Space'&&!typing(e))pttUp()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.tx)pttUp()});

/* ---------- Alerta DSC de socors (mantenir premut 3 s) ---------- */
(()=>{const b=$('#kDsc');let timer=null,count=0;
 const cancel=()=>{if(!timer)return;clearInterval(timer);timer=null;b.classList.remove('arming');render()};
 b.addEventListener('pointerdown',e=>{if(!state.on){toast('Primer encén la ràdio.');return}b.setPointerCapture(e.pointerId);count=3;b.classList.add('arming');lcdMessage('DISTRESS: mantén premut 3');audio.beep(1000,120,.2);
  timer=setInterval(()=>{count--;if(count>0){lcdMessage('DISTRESS: mantén premut '+count);audio.beep(1000,120,.2);return}
   cancel();interruptRx('tune');setChannel(16);lcdMessage('ALERTA DSC ENVIADA',4000);
   for(let i=0;i<6;i++)setTimeout(()=>audio.beep(i%2?2100:1300,220,.18),i*260);
   log('system','Alerta DSC de socors enviada (simulada), amb el teu MMSI i la posició GPS. La ràdio passa al canal 16.');
   const r=dscAlert({lang:settings.lang,vessel:settings.vessel,state:state.dialog});r.replies.forEach(x=>x.channel=16);
   setTimeout(()=>deliver(r),3500);
  },1000)});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>{if(timer){cancel();lcdMessage('Alerta cancel·lada',1500)}});
})();

/* ---------- Frases d'exemple i configuració ---------- */
const PHRASES={
 ca:['Marina de Maó, Marina de Maó, aquí veler {v}, canvi','Marina de Maó, aquí {v}, sol·licitem amarrament per a dues nits, eslora onze metres, canvi','Prova de ràdio, canvi','Quina és la previsió meteorològica?, canvi','Pràctics de Maó, aquí {v}, sol·licito entrar a port, canvi','Tramuntana, Tramuntana, aquí {v}, canvi','On sou fondejats?, canvi','Gràcies, canvi i fora','Mayday, mayday, mayday, aquí veler {v}, {v}, {v}. Via d’aigua a dues milles al sud de l’illa de l’Aire, quatre persones a bord, canvi'],
 es:['Marina de Mahón, Marina de Mahón, aquí velero {v}, cambio','Marina de Mahón, aquí {v}, solicitamos amarre para dos noches, eslora once metros, cambio','Prueba de radio, cambio','¿Cuál es la previsión meteorológica?, cambio','Prácticos de Mahón, aquí {v}, solicito entrar a puerto, cambio','Tramuntana, Tramuntana, aquí {v}, cambio','¿Dónde estáis fondeados?, cambio','Gracias, cambio y fuera','Mayday, mayday, mayday, aquí velero {v}, {v}, {v}. Vía de agua a dos millas al sur de la isla del Aire, cuatro personas a bordo, cambio'],
 en:['Mahon Marina, Mahon Marina, this is sailing yacht {v}, over','Mahon Marina, {v}, we would like a berth for two nights, length eleven metres, over','Radio check, over','What is the weather forecast? Over','Mahon Pilots, this is {v}, request permission to enter the harbour, over','Tramuntana, Tramuntana, this is {v}, over','Where are you anchored? Over','Thank you, over and out','Mayday, mayday, mayday, this is sailing yacht {v}, {v}, {v}. Taking water two miles south of Isla del Aire, four persons on board, over'],
};
function renderPhrases(){const box=$('#phrases');box.innerHTML='';
 for(const p of PHRASES[settings.lang]){const text=p.replaceAll('{v}',settings.vessel),b=document.createElement('button');b.type='button';
  b.textContent=text.length>46?text.slice(0,44)+'…':text;b.title=text;b.onclick=()=>{$('#textInput').value=text;$('#textInput').focus()};box.append(b)}
 document.querySelectorAll('.vname').forEach(e=>e.textContent=settings.vessel);
}
function capabilities(){
 const parts=[];
 parts.push(canListen()?'Reconeixement de veu disponible (Chrome l’envia als seus servidors: necessita Internet).':'Aquest navegador no reconeix la veu: escriu els missatges (Chrome o Edge sí que ho permeten).');
 if(!canSpeak())parts.push('El navegador no pot llegir les respostes en veu alta: les veuràs als subtítols.');
 else if(!hasVoice(settings.lang))parts.push(settings.lang==='ca'?'No hi ha cap veu catalana instal·lada: les respostes en català es llegiran amb una altra veu.':'No hi ha veu instal·lada per a aquesta llengua.');
 $('#capabilities').textContent=parts.join(' ');
 $('#mode').value=settings.mode;$('#mode').querySelector('[value=voice]').disabled=!canListen();
}
$('#vessel').value=settings.vessel;$('#lang').value=settings.lang;$('#subtitles').checked=settings.subtitles;
$('#vessel').addEventListener('input',e=>{settings.vessel=e.target.value.trim()||'Xaloc';save();renderPhrases()});
$('#lang').addEventListener('change',e=>{settings.lang=e.target.value;save();renderPhrases();capabilities()});
$('#mode').addEventListener('change',e=>{settings.mode=e.target.value;save()});
$('#subtitles').addEventListener('change',e=>{settings.subtitles=e.target.checked;save()});
// Mode IA
const modelSel=$('#aiModel');for(const m of MODELS){const o=document.createElement('option');o.value=m.id;o.textContent=m.label;modelSel.append(o)}
$('#aiOn').checked=settings.ai;$('#aiKey').value=settings.apiKey;modelSel.value=settings.model;
const aiStatus=()=>{$('#aiBadge').hidden=!(settings.ai&&settings.apiKey);$('#aiFields').classList.toggle('dim',!settings.ai)};
$('#aiOn').addEventListener('change',e=>{settings.ai=e.target.checked;save();aiStatus();if(settings.ai&&!settings.apiKey)$('#aiKey').focus()});
$('#aiKey').addEventListener('change',e=>{settings.apiKey=e.target.value.trim();save();aiStatus()});
modelSel.addEventListener('change',e=>{settings.model=e.target.value;save()});
$('#aiForget').addEventListener('click',()=>{settings.apiKey='';$('#aiKey').value='';save();aiStatus();$('#aiResult').textContent='Clau esborrada d’aquest navegador.'});
$('#aiTest').addEventListener('click',async()=>{
 settings.apiKey=$('#aiKey').value.trim();save();const out=$('#aiResult');
 if(!settings.apiKey){out.textContent='Escriu primer la clau d’API.';return}
 out.textContent='Provant…';const t0=performance.now();
 try{const r=await aiRespond({apiKey:settings.apiKey,model:settings.model,text:'Marina de Maó, aquí '+settings.vessel+', prova de ràdio, canvi',channel:9,lang:settings.lang,power:'hi',vessel:settings.vessel});
  out.textContent=`Funciona (${((performance.now()-t0)/1000).toFixed(1)} s). Resposta: «${r.replies[0]?.text||'(cap)'}»`}
 catch(e){out.textContent='No funciona: '+e.message}
});
aiStatus();
globalThis.speechSynthesis?.addEventListener?.('voiceschanged',capabilities);
renderPhrases();capabilities();render();
// Si el navegador no té veus de síntesi, les respostes només surten als subtítols: cal dir-ho clarament.
function voiceWarning(){
 const w=$('#voiceWarn'),firefox=/firefox/i.test(navigator.userAgent);
 const advice=firefox?' A Linux, Firefox necessita el servei <b>speech-dispatcher</b> del sistema. El més fàcil és obrir l’emissora amb <b>Chrome</b> (el llançador <code>Obre-Emissora.sh</code> ja ho fa), que també reconeix la teva veu.':' Prova-ho amb <b>Chrome</b> o <b>Edge</b>.';
 voicesReady().then(n=>{
  if(!canSpeak()||n===0){w.innerHTML='<b>No s’escolten les veus:</b> aquest navegador no té cap veu de síntesi disponible, per això només veus els subtítols.'+advice;w.hidden=false;settings.subtitles=true;$('#subtitles').checked=true}
  else if(speechFailures()>=2){w.innerHTML='<b>Les veus no sonen:</b> el navegador dona error en llegir-les.'+advice;w.hidden=false}
  else w.hidden=true;
 });
}
voiceWarning();setInterval(()=>{if(speechFailures()>=2&&$('#voiceWarn').hidden)voiceWarning()},3000);

/* ---------- Fora de línia ---------- */
if('serviceWorker' in navigator&&isSecureContext){
 navigator.serviceWorker.addEventListener('message',e=>{if(e.data==='OFFLINE_READY')$('#offline').textContent='● Disponible fora de línia'});
 navigator.serviceWorker.register('./sw.js').then(async()=>{const r=await navigator.serviceWorker.ready;r.active?.postMessage('VERIFY')}).catch(()=>$('#offline').textContent='Sense mode fora de línia');
}else $('#offline').textContent='Obre-ho amb HTTPS o localhost';
// Exposat per a les proves automàtiques al navegador.
import {spokenCount} from "./voice.js";
globalThis.__vhf={state,settings,traffic,sendText,setChannel,powerToggle,spokenCount};
