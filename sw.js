// sw.js
self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request));
});
