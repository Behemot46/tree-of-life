# Sprint J8 — Offline & PWA

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` — resolve merge conflicts first
4. List all files that need caching: `ls js/*.js assets/*`
5. Read .github/workflows/deploy-check.yml

**After ALL code changes:**
1. Test: load app → go to airplane mode → refresh → app loads from cache
2. Verify service worker registers without errors
3. Test "Add to Home Screen" on mobile (or desktop Chrome)
4. Verify online→offline transition shows indicator
5. Commit: `feat: J8 — PWA with service worker and offline support`
6. Push branch and create PR to main
7. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md

---

## Sprint Goal

Make Tree of Life installable as a PWA and fully functional offline.

## Tasks

### 1. Create Service Worker (sw.js)

Hand-rolled, no Workbox dependency:

```js
const CACHE_NAME = 'tol-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/js/treeData.js',
  '/js/speciesData.js',
  '/js/uiData.js',
  '/js/factLibrary.js',
  '/js/imagePrompts.js',
  '/js/imageLoader.js',
  '/js/dnaSimilarity.js',
  // Add all JS modules from J3 if they exist
  '/assets/placeholder.svg'
];

// Install: precache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for app shell, stale-while-revalidate for images
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Wikipedia API: network-first
  if (url.hostname.includes('wikipedia.org')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Wikimedia images: stale-while-revalidate
  if (url.hostname.includes('wikimedia.org') || url.hostname.includes('upload.wikimedia.org')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(r => {
          caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone()));
          return r;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // App shell: cache-first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

### 2. Register Service Worker

In index.html, add before closing `</body>`:
```html
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW registration failed:', err));
}
</script>
```

### 3. Create Web App Manifest (manifest.json)

```json
{
  "name": "Tree of Life — Interactive Evolution Explorer",
  "short_name": "Tree of Life",
  "description": "Explore 3.8 billion years of evolution interactively",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1d23",
  "theme_color": "#0ea5e9",
  "icons": [
    { "src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Add link in index.html `<head>`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0ea5e9">
```

### 4. Create App Icons

Generate simple icons (192px and 512px) from the existing loading animation tree SVG or a simple 🌿 on dark background.

### 5. Offline Indicator

When `!navigator.onLine`, show a subtle banner:
```html
<div id="offline-banner" class="offline-banner">📡 You're offline — using cached data</div>
```

```css
.offline-banner {
  position: fixed; top: 0; left: 0; right: 0;
  background: var(--accent-secondary); color: white;
  text-align: center; padding: 4px; font-size: 12px;
  font-family: var(--font-body);
  z-index: var(--z-tooltip);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}
.offline-banner.visible { transform: translateY(0); }
```

```js
window.addEventListener('online', () => document.getElementById('offline-banner').classList.remove('visible'));
window.addEventListener('offline', () => document.getElementById('offline-banner').classList.add('visible'));
```

### 6. Update deploy-check.yml

Add to required files:
- `sw.js`
- `manifest.json`
- `js/dnaSimilarity.js` (currently missing from check!)

---

## Success Criteria

- [ ] Service worker registers on page load
- [ ] App loads fully in airplane mode after first visit
- [ ] "Add to Home Screen" prompt available
- [ ] Offline banner appears when connection lost
- [ ] Cached Wikipedia photos load offline
- [ ] Service worker updates on new deployment
- [ ] deploy-check.yml validates sw.js + manifest.json + dnaSimilarity.js
- [ ] Zero console errors
