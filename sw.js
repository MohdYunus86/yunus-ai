const CACHE='yunus-ai-v1';
const ASSETS=['/','/index.html','/style.css','/app.js','/manifest.webmanifest','/icon.svg'];
const ASSET_SET=new Set(ASSETS);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; const u=new URL(e.request.url); const shouldCache=u.origin===self.location.origin && ASSET_SET.has(u.pathname); e.respondWith(fetch(e.request).then(r=>{ if(shouldCache && r && r.ok){ const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); } return r; }).catch(()=>caches.match(e.request).then(r=>{ if(r) return r; return e.request.mode==='navigate' ? caches.match('/') : Response.error(); }))); });
