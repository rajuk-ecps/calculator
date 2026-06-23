const CACHE_NAME = 'rajuk-calc-v1.0';

// যে ফাইলগুলো অফলাইনেও সচল রাখতে চান (আপনার সাইটের ফাইল অনুযায়ী নাম পরিবর্তন করুন)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css', // আপনার CSS ফাইলের পাথ
  '/script.js',  // আপনার JS ফাইলের পাথ
  '/manifest.json'
];

// ১. ইনস্টল ইভেন্ট: ফাইলগুলো ক্যাশ মেমোরিতে সেভ করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); 
});

// ২. অ্যাক্টিভেট ইভেন্ট: পুরোনো ক্যাশ ডিলিট করা (যখন v1 থেকে v2 করবেন)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// ৩. ফেচ ইভেন্ট: নেটওয়ার্ক না থাকলে ক্যাশ থেকে ফাইল দেখানো (Stale-While-Revalidate স্ট্র্যাটেজি)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ক্যাশে ফাইল থাকলে সেটা আগে দেখাবে, পাশাপাশি ব্যাকগ্রাউন্ডে নতুন ফাইল আপডেট করে নেবে
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // নেটওয়ার্ক এবং ক্যাশ দুটোই ফেইল করলে (পুরোপুরি অফলাইন)
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
