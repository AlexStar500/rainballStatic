const CACHE = 'rainball-v1.7.rain-3.2';
const PRECACHE = ['/', '/style.css', '/logo.png', '/favicon.ico'];
const API_ORIGIN = 'https://app.rainball.ru';

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith('/api/')) {
        if (e.request.method === 'GET') {
            e.respondWith(fetch(API_ORIGIN + url.pathname + url.search));
            return;
        }
        e.respondWith(fetch(new Request(API_ORIGIN + url.pathname + url.search, {
            method: e.request.method,
            headers: e.request.headers,
            body: e.request.method === 'GET' || e.request.method === 'HEAD' ? undefined : e.request.body,
            mode: 'cors'
        })));
        return;
    }
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request)
            .then(r => {
                if (r.ok) {
                    const resp = r.clone();
                    caches.open(CACHE).then(c => c.put(e.request, resp));
                }
                return r;
            })
            .catch(() => caches.match(e.request))
    );
});
