const CACHE = 'padel-log-v2';

// Assets cached on install — app won't work offline without these
const REQUIRED = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// CDN assets — cached best-effort; failures don't block install
const CDN = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.24.7/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async cache => {
      await cache.addAll(REQUIRED);
      await Promise.allSettled(CDN.map(url =>
        fetch(url, { cache: 'no-cache' })
          .then(res => { if (res.ok) cache.put(url, res); })
          .catch(() => {})
      ));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Let Supabase API calls go straight to network — offline fallback is in the app
  if (url.hostname.includes('supabase.co')) return;
  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // The whole app lives in index.html, so navigations are network-first:
  // a new deploy loads immediately online, and the cached shell is the offline fallback.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put('./index.html', clone));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then(c => c || caches.match(e.request)))
    );
    return;
  }

  // Other assets (icons, CDN libs): serve from cache, refresh in background.
  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached); // network failed: return cached if we have it

      return cached || networkFetch;
    })
  );
});
