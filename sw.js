// Tree of Life — Service Worker
// Cache-first for app shell, network-first for API/images

const CACHE_VERSION = 'tol-v7';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  // External CSS files
  '/css/variables.css',
  '/css/layout.css',
  '/css/tree.css',
  '/css/timeline.css',
  '/css/panel.css',
  '/css/hominin.css',
  '/css/features.css',
  '/css/theme.css',
  '/css/rtl.css',
  '/css/responsive.css',
  // ES modules — data
  '/js/data.js',
  '/js/treeData.js',
  '/js/treeExpansion.js',
  '/js/speciesData.js',
  '/js/uiData.js',
  '/js/factLibrary.js',
  '/js/imagePrompts.js',
  '/js/imageLoader.js',
  '/js/dnaSimilarity.js',
  '/js/nodeIcons.js',
  '/js/triviaData.js',
  '/js/primateData.js',
  '/js/geoData.js',
  '/js/mapPaths.js',
  '/js/tours.js',
  // ES modules — application
  '/js/app.js',
  '/js/state.js',
  '/js/utils.js',
  '/js/layout.js',
  '/js/zoom.js',
  '/js/renderer.js',
  '/js/navigation.js',
  '/js/search.js',
  '/js/timeline.js',
  '/js/panel.js',
  '/js/hominin.js',
  '/js/dnaCalc.js',
  '/js/evoPath.js',
  '/js/trivia.js',
  '/js/playback.js',
  '/js/theme.js',
  '/js/engagement.js',
  '/js/quiz.js',
  // Assets
  '/assets/placeholder.svg'
];

const FONT_CACHE = 'tol-fonts-v1';
const IMG_CACHE = 'tol-images-v1';
const API_CACHE = 'tol-api-v1';

// Install — precache app shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', (e) => {
  const keep = new Set([CACHE_VERSION, FONT_CACHE, IMG_CACHE, API_CACHE]);
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — strategy depends on request type
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Google Fonts — cache-first (immutable)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(cacheFirst(e.request, FONT_CACHE));
    return;
  }

  // Wikipedia API — network-first with cache fallback
  if (url.hostname.includes('wikipedia.org') && url.pathname.includes('/api/')) {
    e.respondWith(networkFirst(e.request, API_CACHE, 5000));
    return;
  }

  // Wikimedia images — cache-first (URLs contain content hashes)
  if (url.hostname.includes('wikimedia.org') || url.hostname.includes('wikipedia.org')) {
    e.respondWith(cacheFirst(e.request, IMG_CACHE));
    return;
  }

  // App shell (same-origin) — cache-first with network update
  if (url.origin === self.location.origin) {
    e.respondWith(staleWhileRevalidate(e.request, CACHE_VERSION));
    return;
  }

  // Everything else — network with cache fallback
  e.respondWith(networkFirst(e.request, CACHE_VERSION, 5000));
});

// ── Caching strategies ──

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

async function networkFirst(request, cacheName, timeout) {
  try {
    const response = await fetchWithTimeout(request, timeout);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || await fetchPromise || new Response('Offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), ms);
    fetch(request).then((res) => {
      clearTimeout(timer);
      resolve(res);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
