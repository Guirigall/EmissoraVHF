// Pla de canals marítims internacionals de VHF (UIT, apèndix 18), simplificat per a la simulació.
// Freqüència de transmissió del vaixell: canals 1–28 a partir de 156,050 MHz; 60–88 a partir de 156,025 MHz, en passos de 50 kHz.
export const channels=[...Array.from({length:28},(_,i)=>i+1),...Array.from({length:29},(_,i)=>i+60)];

const simplex=new Set([6,8,9,10,13,15,16,17,67,69,72,73,77]);
// Claus de nom; els textos traduïts són a i18n.js.
const dataOnly={70:'dsc',75:'guard',76:'guard',87:'ais1',88:'ais2'};
const names={16:'distress',9:'marinas',6:'sar',8:'shipShip',10:'sarWork',12:'port',14:'port',13:'bridge',15:'onboard',17:'onboard',
 67:'regatta',69:'shipShip',72:'leisure',73:'shipShip',77:'leisure',20:'coastWx'};
export function shipTx(ch){return ch<=28?156.050+(ch-1)*.05:156.025+(ch-60)*.05}
export function info(ch){
 if(!channels.includes(ch))throw Error('Canal inexistent: '+ch);
 const tx=shipTx(ch),duplex=!simplex.has(ch)&&!dataOnly[ch]&&ch!==75&&ch!==76;
 return {
  ch,tx:+tx.toFixed(3),rx:+(duplex?tx+4.6:tx).toFixed(3),duplex,
  nameKey:dataOnly[ch]||names[ch]||(duplex?'coast':'shipShip'),
  txAllowed:!dataOnly[ch],lowPowerOnly:ch===15||ch===17,
 };
}
export function step(ch,delta){const i=channels.indexOf(ch);return channels[((i+delta)%channels.length+channels.length)%channels.length]}
export const format=f=>f.toFixed(3).replace('.',',');
