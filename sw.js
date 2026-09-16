/* =========================================================================
   SERVICE WORKER — cache-first, offline-ready, aggiornamento controllato.
   La pagina decide quando attivare la nuova versione (SKIP_WAITING),
   così l'utente non resta su una versione vecchia senza saperlo.
   Bump CACHE_NAME a ogni release per invalidare la cache.
   ========================================================================= */
const CACHE_NAME = 'bassmate-v2-10';

const APP_SHELL = [
  './',
  './index.html',
  './exercises.html',
  './help.html',
  './donate.html',
  './contact.html',
  './manifest.json',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/drums/kick.wav',
  './assets/drums/snare.wav',
  './assets/drums/snare-ghost.wav',
  './assets/drums/rimshot.wav',
  './assets/drums/hihat.wav',
  './assets/drums/hihat-open.wav',
  './assets/drums/ride.wav',
  './assets/drums/crash.wav',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/print.css',
  './css/page.css',
  './js/app.js',
  './js/page.js',
  './js/core/theory.js',
  './js/core/state.js',
  './js/core/i18n.js',
  './js/core/chords.js',
  './js/audio/synth.js',
  './js/audio/metronome.js',
  './js/audio/drums.js',
  './js/audio/grooveEngine.js',
  './js/ui/controls.js',
  './js/ui/fretboard.js',
  './js/ui/transport.js',
  './js/ui/metro.js',
  './js/ui/grids.js',
  './js/tools/chords.js',
  './js/tools/quiz.js',
  './js/tools/tuner.js',
  './js/tools/grooveTrainer.js',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // runtime-cache delle GET ok (anche font cross-origin opaque)
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
