// Service worker: caches the app shell so it opens offline
// (transliteration works without a network; translation needs one).

const CACHE = 'gesms-v7';
const SHELL = [
  './',
  './en/',
  './tr/',
  './es/',
  './fr/',
  './styles.css',
  './app.js',
  './i18n.js',
  './translit.js',
  './translate.js',
  './dict.bin',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/cat.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (so updates arrive), cache when offline.
// Translation API requests are left alone.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // the stats tracker is proxied to Umami; never cache it
  if (url.pathname.startsWith('/umami/')) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r ?? Response.error()))
  );
});
