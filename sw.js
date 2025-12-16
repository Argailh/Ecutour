const CACHE_NAME = 'ecutour-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './shared/style.css',
    './shared/nav.js',
    './shared/session.js',
    './shared/components.js',
    './shared/lugares.js',
    './assets/background.jpg',
    './assets/logo.png',
    './assets/icon.jpg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
