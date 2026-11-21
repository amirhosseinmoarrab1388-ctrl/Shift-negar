const prefix='shift-studio:'+self.registration.scope+':';
const cache=prefix+'14';
const assets=['./','./index.html','./auth.js','./prefs.js','./naskh.ttf','./kufi.ttf','./currency.js','./team-core.js','./team.js','./ledger.js','./studio.js','./depth.js','./assistant.js','./app.js','./style.css','./font.ttf','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(cache).then(box=>box.addAll(assets)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith(prefix)&&n!==cache).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!assets.some(a=>new URL(a,self.registration.scope).href===event.request.url))return;
 event.respondWith(fetch(event.request).catch(()=>caches.open(cache).then(box=>box.match(event.request))));
});
