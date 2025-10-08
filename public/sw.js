const CACHE_NAME = 'hearing-test-cache-v1';
const urlsToCache = [
  '/',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  // Activate immediately so the SW can help meet installability checks
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Claim clients right away so the SW controls pages as soon as possible
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-only / pass-through fetch handler.
  // This keeps the app online-first while having a controlling SW.
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Minimal network-failure response (no cached offline page).
        return new Response('Network unavailable', {
          status: 504,
          statusText: 'Network unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      });
    })
  );
});
