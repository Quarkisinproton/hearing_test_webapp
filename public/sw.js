const CACHE_NAME = 'audio-clear-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((res) => {
            // Optionally cache new requests
            if (!res || res.status !== 200 || res.type !== 'basic') {
              return res;
            }
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
            return res;
          })
          .catch(() => caches.match('/'))
      );
    })
  );
});
