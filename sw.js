const CACHE_NAME = 'rajuk-calc-v1'; // প্রতিবার বড় আপডেটে v1 থেকে v2 করবেন

self.addEventListener('install', (event) => {
  self.skipWaiting(); // নতুন ভার্সন পাওয়া মাত্রই রেডি হবে
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
