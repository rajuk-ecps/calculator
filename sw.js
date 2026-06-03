const CACHE_NAME = 'rajuk-calc-v1.0';

// যে ফাইলগুলো অফলাইনেও কাজ করার জন্য ব্রাউজারে সেভ থাকবে
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './icon.png',
  './manifest.json'
];

// ইনস্টল ইভেন্ট (ফাইলগুলো ক্যাশ করা হচ্ছে)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();[cite: 3]
});

// অ্যাক্টিভেট ইভেন্ট
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // পুরানো ক্যাশ ডিলিট করবে
          }
        })
      );
    }).then(() => self.clients.claim())[cite: 3]
  );
});

// ফেচ ইভেন্ট (প্রথমে ক্যাশ খুঁজবে, না পেলে নেটওয়ার্ক থেকে আনবে)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // ক্যাশে থাকলে সেটাই দেখাবে
      }
      return fetch(event.request).catch(() => {[cite: 3]
        // নেটওয়ার্ক না থাকলে এবং ক্যাশেও না থাকলে সরাসরি রুট পেজ দেখাবে
        return caches.match('./index.html');
      });
    })
  );
});