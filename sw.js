const CACHE = 'rainball-v1.0.rain-1.0';
const PRECACHE = ['/', '/style.css', '/logo.png', '/favicon.ico'];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request)
            .then(r => { const resp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, resp)); return r; })
            .catch(() => caches.match(e.request))
    );
});
