// Memòria cau de l'aplicació: tot funciona sense connexió excepte el reconeixement de veu de Chrome.
const VERSION='v1.2.4';
const PREFIX='emissora-vhf:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const FILES=['./','./index.html','./style.css','./app.js','./audio.js','./voice.js','./dialog.js','./stations.js','./channels.js','./traffic.js','./chatter.js','./i18n.js','./ai.js','./vendor/anthropic-sdk.mjs','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(async()=>{for(const c of await self.clients.matchAll())c.postMessage('OFFLINE_READY')})));
self.addEventListener('message',e=>{if(e.data!=='VERIFY')return;e.waitUntil(caches.open(CACHE).then(async c=>{const all=await Promise.all(FILES.map(f=>c.match(f)));if(all.every(Boolean))e.source?.postMessage('OFFLINE_READY')}))});
self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==location.origin)return;
 // Xarxa primer (per rebre actualitzacions); si no hi ha connexió, la còpia desada.
 e.respondWith((async()=>{const cache=await caches.open(CACHE);try{const r=await fetch(e.request);if(r.ok)cache.put(e.request,r.clone());return r}catch{return (await cache.match(e.request,{ignoreSearch:true}))||(e.request.mode==='navigate'?cache.match('./index.html'):Response.error())}})());
});
