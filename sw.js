// sw.js
self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Only handle same-origin navigation and asset requests
self.addEventListener('fetch', event => {
  const reqUrl = new URL(event.request.url);
  // If it’s not your PWA host, don’t intercept it
  if (reqUrl.origin !== self.location.origin) return;
  // Otherwise just pass through
  event.respondWith(fetch(event.request));
});
