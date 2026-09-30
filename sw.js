// Tree of Life — Service Worker
//
// Kin's shell is precached, so the game opens with no network. Everything else
// is cached as it is used: the encyclopedia (atlas.html) after one visit, fonts
// and Wikimedia photographs once seen.

const CACHE_VERSION = 'tol-v13';

/* What Kin needs to open offline: the page, its stylesheet, the dispatcher and
   every module it imports. Not the encyclopedia — a visitor who came for the
   game should not download sixty modules they may never open.

   Each entry is added on its own. cache.addAll() rejects as a whole if one URL
   fails, and a worker that fails to install never updates, so a single file
   that goes missing would strand every visitor on the version they have. A
   static check (static/sw-shell-matches-the-game) holds this list to the files
   on disk and to every module the game imports. */
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/kin.css',
  '/js/boot.js',
  '/js/actions.js',
  '/js/kin/front.js',
  '/js/kin/main.js',
  '/js/kin/analytics.js',
  '/js/kin/bank.js',
  '/js/kin/calendar.js',
  '/js/kin/creatures.js',
  '/js/kin/dates.js',
  '/js/kin/engine.js',
  '/js/kin/glyph.js',
  '/js/kin/groups.js',
  '/js/kin/install.js',
  '/js/kin/key.js',
  '/js/kin/questions.js',
  '/js/kin/reveal.js',
  '/js/kin/rng.js',
  '/js/kin/schedule.js',
  '/js/kin/sfx.js',
  '/js/kin/store.js',
  '/js/kin/strings.js',
  '/js/kin/tree.js',
  '/assets/icon-192.png',
  '/assets/icon.svg',
  '/assets/favicon-32.png'
];

const FONT_CACHE = 'tol-fonts-v1';
const IMG_CACHE = 'tol-images-v1';
const API_CACHE = 'tol-api-v1';

// Install — precache Kin's shell, straight from the network
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' })))))
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
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Counting beacons (js/kin/analytics.js, when a page turns it on) go straight
  // to the network: each has a fresh query string, so caching them would add one
  // entry per visit and never find one again.
  if (url.origin === self.location.origin && url.pathname.startsWith('/_c/')) return;

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

  // Kin (the front page and everything it loads) — network-first. The daily
  // puzzle comes from its code, so a stale copy would hand a returning
  // player a different game from everyone else's for one visit after every
  // deploy. The cache is only the offline fallback.
  if (url.origin === self.location.origin && isKin(url.pathname)) {
    e.respondWith(networkFirst(e.request, CACHE_VERSION, 4000));
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

function isKin(pathname) {
  return pathname === '/' || pathname === '/index.html' || pathname.startsWith('/js/kin/')
    || pathname === '/css/kin.css' || pathname === '/js/actions.js';
}

/* A page is cached under its path alone. A shared link's query string
   (?kin=3, ?c=…&s=…, ?node=…) is the same page, and keying on it would fill
   the cache with one copy per link and find none of them when offline. */
function keyFor(request) {
  if (request.mode !== 'navigate') return request;
  const u = new URL(request.url);
  return new Request(u.origin + u.pathname);
}

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
  const key = keyFor(request);
  try {
    const response = await fetchWithTimeout(request, timeout);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(key, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(key);
    if (cached) return cached;
    return new Response(JSON.stringify({ offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const key = keyFor(request);
  const cache = await caches.open(cacheName);
  const cached = await cache.match(key);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(key, response.clone());
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
