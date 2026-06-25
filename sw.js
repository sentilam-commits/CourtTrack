const VERSION = '2026-06-25-premium-actions-export';
const CACHE = `padel-log-${VERSION}`;
const APP_SHELL = './index.html';

const PRECACHE = [
  APP_SHELL,
  './manifest.json',
  './version.json',
  './icon-192.png',
  './icon-512.png',
];

const CDN = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.108.2/dist/umd/supabase.min.js',
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.26.4/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

async function cacheFresh(cache, request) {
  const response = await fetch(request, { cache: 'reload' });
  if (response && response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.allSettled([
        ...PRECACHE.map(url => cacheFresh(cache, url)),
        ...CDN.map(url => cacheFresh(cache, url)),
      ]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.startsWith('padel-log-') && key !== CACHE)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();

    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(clients.map(client => {
      if ('navigate' in client && client.url) return client.navigate(client.url);
      return client.postMessage({ type: 'APP_UPDATED', version: VERSION });
    }));
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  // Let Supabase API calls go straight to network. The app already has its own
  // local/offline queue for these writes.
  if (url.hostname.includes('supabase.co')) return;

  // Never serve the service worker itself from CacheStorage.
  if (url.origin === self.location.origin && url.pathname.endsWith('/sw.js')) return;

  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';
  const isMutableSameOriginAsset =
    isSameOrigin &&
    (
      url.pathname.endsWith('/') ||
      url.pathname.endsWith('/index.html') ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('.json') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css')
    );

  // App shell and mutable same-origin assets are network-first so deployed
  // changes appear immediately. Cache is only the offline fallback.
  if (isNavigation || isMutableSameOriginAsset) {
    event.respondWith(
      caches.open(CACHE).then(async cache => {
        try {
          const response = await fetch(event.request, { cache: 'no-store' });
          if (response && response.ok) {
            cache.put(event.request, response.clone());
            if (isNavigation) cache.put(APP_SHELL, response.clone());
          }
          return response;
        } catch (_) {
          return (await caches.match(event.request)) ||
                 (await caches.match(APP_SHELL));
        }
      })
    );
    return;
  }

  // Static images/fonts/CDNs can use stale-while-revalidate. They do not carry
  // app logic, and refreshing them in the background keeps offline support.
  event.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await caches.match(event.request);
      const network = fetch(event.request, { cache: 'reload' })
        .then(response => {
          if (response && response.ok) cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
