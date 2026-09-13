const CACHE='yunus-ai-v1';
const ASSETS=['/','/index.html','/style.css','/app.js','/manifest.webmanifest','/icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; e.respondWith(fetch(e.request).then(r=>{ if(r && r.ok){ const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); } return r; }).catch(()=>caches.match(e.request).then(r=>r||caches.match('/')))); });
