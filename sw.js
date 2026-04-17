const CACHE_NAME = 'bassmate-v9';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './donate.html',
  './help.html',
  './exercises.html',
  './grids.html',
  './header.html',
  './footer.html',
  './style.css',
  './app.js',
  './icon.svg',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Space+Mono:wght@400;700&display=swap'
];

self.addEventListener('install', event => {
  // Eseguito all'installazione dell'app: memorizza nella cache tutto.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Stile 'Cache First, then Network'
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se c'è in cache, dai ok immediato! Altrimenti prova la rete.
        return response || fetch(event.request);
      })
  );
});
