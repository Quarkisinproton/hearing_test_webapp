self.addEventListener('install', (event) => {
  // Become active immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of clients right away
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-only pass-through. No caching, no offline pages.
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Network unavailable', {
        status: 504,
        statusText: 'Network unavailable',
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});
  );
});
