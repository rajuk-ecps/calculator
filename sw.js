const CACHE_NAME = 'rajuk-calc-v1.0'; // প্রতিবার বড় আপডেটে v1 থেকে v2 করবেন

// ইনস্টল ইভেন্ট
self.addEventListener('install', (event) => {
  self.skipWaiting(); // নতুন ভার্সন পাওয়া মাত্রই রেডি হবে
});

// অ্যাক্টিভেট ইভেন্ট
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // এখানে self.clients হবে
});

// ফেচ ইভেন্ট (যা ক্রোম ব্রাউজারকে বাধ্য করবে ইনস্টল অপশন দিতে)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // অফলাইনে থাকলে অন্তত মেইন পেজটা ক্যাশ থেকে দেখাবে
      return caches.match(event.request);
    })
  );
});