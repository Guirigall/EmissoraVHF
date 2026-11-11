// Pla de canals marítims internacionals de VHF (UIT, apèndix 18), simplificat per a la simulació.
// Freqüència de transmissió del vaixell: canals 1–28 a partir de 156,050 MHz; 60–88 a partir de 156,025 MHz, en passos de 50 kHz.
export const channels=[...Array.from({length:28},(_,i)=>i+1),...Array.from({length:29},(_,i)=>i+60)];

const simplex=new Set([6,8,9,10,13,15,16,17,67,69,72,73,77]);
const dataOnly={70:'DSC · només dades',75:'Banda de guarda · restringit',76:'Banda de guarda · restringit',87:'AIS 1 · només dades',88:'AIS 2 · només dades'};
const names={
 16:'Socors, seguretat i crida',9:'Marines · crida secundària',6:'Coordinació de rescat',8:'Vaixell–vaixell',10:'Salvament · treball',
 12:'Operacions portuàries',14:'Operacions portuàries',13:'Pont a pont · seguretat',15:'A bord · 1 W',17:'A bord · 1 W',
 67:'Vaixell–vaixell · regates',69:'Vaixell–vaixell',72:'Vaixell–vaixell · lleure',73:'Vaixell–vaixell',77:'Vaixell–vaixell · lleure',
 20:'Estació costanera · meteo',
};
export function shipTx(ch){return ch<=28?156.050+(ch-1)*.05:156.025+(ch-60)*.05}
export function info(ch){
 if(!channels.includes(ch))throw Error('Canal inexistent: '+ch);
 const tx=shipTx(ch),duplex=!simplex.has(ch)&&!dataOnly[ch]&&ch!==75&&ch!==76;
 return {
  ch,tx:+tx.toFixed(3),rx:+(duplex?tx+4.6:tx).toFixed(3),duplex,
  name:dataOnly[ch]||names[ch]||(duplex?'Estació costanera · dúplex':'Vaixell–vaixell'),
  txAllowed:!dataOnly[ch],lowPowerOnly:ch===15||ch===17,
 };
}
export function step(ch,delta){const i=channels.indexOf(ch);return channels[((i+delta)%channels.length+channels.length)%channels.length]}
export const format=f=>f.toFixed(3).replace('.',',');
