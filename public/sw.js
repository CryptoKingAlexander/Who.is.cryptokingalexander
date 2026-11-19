const NODES_CACHE = 'hyperbook-nodes-metadata-cache-v2';
const IMAGES_CACHE = 'hyperbook-images-cache-v2';
const API_CACHE = 'hyperbook-api-cache-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![NODES_CACHE, IMAGES_CACHE, API_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 0. Never cache Next.js internal build/HMR chunks, RSC flight payloads, or health heartbeats
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname === '/api/health' ||
    url.searchParams.has('_rsc') ||
    url.searchParams.has('stack_reset') ||
    request.headers.get('RSC') === '1' ||
    request.headers.get('Next-Router-Prefetch') === '1'
  ) {
    return;
  }

  // 1. API Routes: NetworkFirst
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 2. Visual Assets & Icons: CacheFirst
  if (
    url.hostname.includes('picsum.photos') ||
    url.hostname.includes('unsplash.com') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(IMAGES_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. Node Metadata & Root Navigation: NetworkFirst with Offline Cache Fallback
  // Ensures preview tab always gets fresh server HTML when online and never serves stale webpack chunk hashes
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/node/') || url.searchParams.has('section') || url.pathname === '/')
  ) {
    event.respondWith(
      caches.open(NODES_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(request))
      )
    );
  }
});