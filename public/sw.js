self.addEventListener('install', (event) => {
  // Activate immediately so the SW can help meet installability checks
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim clients right away so the SW controls pages as soon as possible
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-only / pass-through fetch handler.
  // This keeps the app online-first while having a controlling SW.
  event.respondWith(
    fetch(event.request).catch(() => {
      // Minimal network-failure response (no cached offline page).
      return new Response('Network unavailable', {
        status: 504,
        statusText: 'Network unavailable',
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});
