// Estacions que poden respondre. Tot és fictici i didàctic: no són procediments ni canals oficials.
export const stations=[
 {id:'marina',kind:'marina',voice:{pitch:1.15,rate:1.05,signal:.95},nm:1.5,listen:[16,9],work:9,
  name:{ca:'Marina de Maó',es:'Marina de Mahón',en:'Mahon Marina',fr:'Marina de Mahon'},
  aliases:['marina de mao','marina mao','marina de mahon','marina mahon','mahon marina','port de mahon','port esportiu','puerto deportivo','marina']},
 {id:'port',kind:'port',voice:{pitch:.8,rate:1.05,signal:.9},nm:2,listen:[16,12],work:12,
  name:{ca:'Pràctics de Maó',es:'Prácticos de Mahón',en:'Mahon Pilots',fr:'Pilotes de Mahon'},
  aliases:['practics de mao','practics','practicos de mahon','practicos','mahon pilots','pilots','pilot','pilotes de mahon','pilotes','capitainerie','control de port','port control','port de mao','puerto de mahon']},
 {id:'sar',kind:'sar',voice:{pitch:.9,rate:1,signal:.6},nm:18,listen:[16,10],work:10,
  name:{ca:'Salvament Marítim',es:'Salvamento Marítimo',en:'Maritime Rescue',fr:'Sauvetage en mer'},
  aliases:['salvament maritim','salvamento maritimo','salvament','salvamento','maritime rescue','sauvetage en mer','sauvetage','cross','rescue centre','rescue center','coast guard','guardacostas','mrcc']},
 {id:'tramuntana',kind:'yacht',voice:{pitch:1.1,rate:1.05,signal:.88},nm:3,listen:[16,72],work:72,
  name:{ca:'Tramuntana',es:'Tramuntana',en:'Tramuntana',fr:'Tramuntana'},
  aliases:['tramuntana','tramontana','veler tramuntana','velero tramuntana']},
];
export const byId=id=>stations.find(s=>s.id===id);
