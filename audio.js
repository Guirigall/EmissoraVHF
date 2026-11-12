// So de la ràdio generat amb Web Audio: estàtica, squelch, clics, veus llunyanes i ràfegues de dades.
export class RadioAudio{
 constructor(){this.ctx=null;this.volume=.6;this.squelch=.35;this.carrier=0;this.transmitting=false;this.voiceActive=false}
 async start(){
  if(this.ctx)return;
  const ctx=this.ctx=new (globalThis.AudioContext||globalThis.webkitAudioContext)();
  this.master=ctx.createGain();this.master.gain.value=this.volume;
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;
  this.master.connect(comp).connect(ctx.destination);
  // Filtre de banda de veu de ràdio: tot el que surt per l'altaveu hi passa.
  this.bus=ctx.createGain();const hp=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter();
  hp.type='highpass';hp.frequency.value=320;lp.type='lowpass';lp.frequency.value=2900;
  this.bus.connect(hp).connect(lp).connect(this.master);
  const len=ctx.sampleRate*2,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  this.noiseBuffer=buf;
  this.noise=ctx.createBufferSource();this.noise.buffer=buf;this.noise.loop=true;
  this.hiss=ctx.createGain();this.hiss.gain.value=0;this.noise.connect(this.hiss).connect(this.bus);this.noise.start();
  // Crepitació aleatòria quan el squelch és obert.
  this.crackleTimer=setInterval(()=>{if(this.hiss.gain.value>.05&&Math.random()<.35)this.pop(.25*this.hiss.gain.value)},180);
  this.update();
 }
 resume(){return this.ctx?.state==='suspended'?this.ctx.resume():Promise.resolve()}
 stop(){if(!this.ctx)return;clearInterval(this.crackleTimer);this.ctx.close();this.ctx=null;this.master=null;this.carrier=0;this.transmitting=false}
 setVolume(v){this.volume=v;if(this.ctx&&this.master)this.master.gain.setTargetAtTime(v,this.ctx.currentTime,.03)}
 setSquelch(s){this.squelch=s;this.update()}
 // Nivell de l'estàtica que se sent: el squelch la talla si no hi ha portadora; un senyal fort l'apaga (efecte captura de l'FM).
 level(){
  if(this.transmitting)return 0;
  if(this.carrier>0)return .03+.55*(1-this.carrier)**1.6;
  return this.squelch<.3?.42*(1-this.squelch/.3*.6):0;
 }
 update(){if(!this.ctx)return;this.hiss.gain.setTargetAtTime(this.level(),this.ctx.currentTime,.02)}
 // Algú comença a transmetre al canal: s'obre el squelch.
 carrierOn(strength){this.carrier=Math.max(.05,Math.min(1,strength));if(!this.transmitting)this.click(.18);this.update()}
 // Deixa de transmetre: cua de squelch (el «xxxt» característic).
 carrierOff(){if(!this.carrier)return;this.carrier=0;if(this.ctx&&!this.transmitting)this.burst(.16,.5);this.update()}
 tx(on){this.transmitting=on;this.click(on?.25:.2);this.update()}
 click(gain=.2){if(!this.ctx)return;const ctx=this.ctx,t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
  o.type='square';o.frequency.setValueAtTime(1800,t);o.frequency.exponentialRampToValueAtTime(300,t+.025);
  g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+.04);o.connect(g).connect(this.bus);o.start(t);o.stop(t+.05)}
 burst(seconds,gain){if(!this.ctx)return;const ctx=this.ctx,t=ctx.currentTime,s=ctx.createBufferSource(),g=ctx.createGain();
  s.buffer=this.noiseBuffer;g.gain.setValueAtTime(gain,t);g.gain.setTargetAtTime(0,t+seconds*.6,seconds*.25);
  s.connect(g).connect(this.bus);s.start(t,Math.random());s.stop(t+seconds+.2)}
 pop(gain){if(!this.ctx)return;const ctx=this.ctx,t=ctx.currentTime,s=ctx.createBufferSource(),g=ctx.createGain();
  s.buffer=this.noiseBuffer;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+.012);s.connect(g).connect(this.bus);s.start(t,Math.random());s.stop(t+.02)}
 // So de canvi de canal.
 tune(){this.click(.08);if(this.squelch<.3)this.burst(.06,.2)}
 beep(freq=2100,ms=60,gain=.12){if(!this.ctx)return;const ctx=this.ctx,t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
  o.frequency.value=freq;g.gain.setValueAtTime(gain,t);g.gain.setValueAtTime(0,t+ms/1000);o.connect(g).connect(this.master);o.start(t);o.stop(t+ms/1000+.02)}
 error(){this.beep(500,120,.15);setTimeout(()=>this.beep(400,180,.15),150)}
 // Veu llunyana ininteligible: to glotal amb síl·labes i formants que canvien, sota molt de soroll.
 distantVoice(seconds,strength=.25){
  if(!this.ctx)return;const ctx=this.ctx,t0=ctx.currentTime,end=t0+seconds;
  const src=ctx.createOscillator();src.type='sawtooth';const base=95+Math.random()*120;src.frequency.setValueAtTime(base,t0);
  const f1=ctx.createBiquadFilter(),f2=ctx.createBiquadFilter(),env=ctx.createGain(),out=ctx.createGain();
  f1.type=f2.type='bandpass';f1.Q.value=6;f2.Q.value=8;env.gain.value=0;out.gain.value=.55*strength;
  src.connect(f1).connect(env);src.connect(f2).connect(env);env.connect(out).connect(this.bus);
  const vowels=[[730,1090],[270,2290],[530,1840],[570,840],[300,870],[660,1720],[400,2000]];
  let t=t0+.05;
  while(t<end){const syl=.09+Math.random()*.16,[a,b]=vowels[Math.floor(Math.random()*vowels.length)];
   f1.frequency.setTargetAtTime(a,t,.02);f2.frequency.setTargetAtTime(b,t,.02);
   src.frequency.setTargetAtTime(base*(.85+Math.random()*.35),t,.05);
   env.gain.setTargetAtTime(.8+Math.random()*.4,t,.015);env.gain.setTargetAtTime(.05,t+syl*.7,.02);
   t+=syl+(Math.random()<.18?.25+Math.random()*.35:.02);}
  env.gain.setTargetAtTime(0,end,.03);src.start(t0);src.stop(end+.3);
 }
 // Ràfegues de dades: DSC (FSK 1300/2100 Hz) i AIS (ràfega curta).
 dataBurst(kind){
  if(!this.ctx||this.transmitting)return;const ctx=this.ctx,t=ctx.currentTime,g=ctx.createGain();g.gain.value=.08;g.connect(this.bus);
  if(kind==='ais'){const s=ctx.createBufferSource();s.buffer=this.noiseBuffer;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=1.5;
   s.connect(bp).connect(g);g.gain.setValueAtTime(.35,t);g.gain.setValueAtTime(0,t+.027);s.start(t,Math.random());s.stop(t+.05);return}
  const o=ctx.createOscillator();o.type='sine';let x=t;for(let i=0;i<120;i++){o.frequency.setValueAtTime(Math.random()<.5?1300:2100,x);x+=.01}
  g.gain.setValueAtTime(.1,t);g.gain.setValueAtTime(0,x);o.connect(g);o.start(t);o.stop(x+.02);
 }
 // Nivell del micròfon mentre es transmet (només per al vúmetre).
 async micMeter(onLevel){
  if(!navigator.mediaDevices?.getUserMedia||!this.ctx)return ()=>{};
  const ctx=this.ctx;
  let stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}})}catch{return ()=>{}}
  if(this.ctx!==ctx||ctx.state==='closed'){stream.getTracks().forEach(t=>t.stop());return ()=>{}}
  const src=ctx.createMediaStreamSource(stream),an=ctx.createAnalyser();an.fftSize=512;src.connect(an);
  const data=new Uint8Array(an.fftSize);let on=true;
  const loop=()=>{if(!on)return;an.getByteTimeDomainData(data);let peak=0;for(const v of data)peak=Math.max(peak,Math.abs(v-128));onLevel(peak/128);requestAnimationFrame(loop)};loop();
  return ()=>{on=false;src.disconnect();stream.getTracks().forEach(t=>t.stop());onLevel(0)};
 }
}
