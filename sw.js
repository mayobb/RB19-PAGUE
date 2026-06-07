const CACHE = 'rb19-v2';
const ASSETS = [
    '/',
    'index.html',
    'assets/css/style.css',
    'assets/js/script.js',
    'assets/images/drivers/max.webp',
    'assets/images/drivers/perez.jpg',
    'assets/images/gallery/frente2.jpg',
    'assets/images/gallery/lateral2.webp',
    'assets/images/gallery/trasera.webp',
    'assets/images/gallery/c.webp'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => new Response('Offline', { status: 503 })))
    );
});
