self.addEventListener('install', (event) => {
  // Activate immediately so the SW can contribute to installability
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of uncontrolled clients as soon as possible
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-only / pass-through fetch handler.
  // No caching, no offline responses — keeps app online-first while having a controlling SW.
  event.respondWith(
    fetch(event.request).catch(() => {
      // Return a minimal network-failure response when the network is unavailable.
      return new Response('Network unavailable', {
        status: 504,
        statusText: 'Network unavailable',
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});
