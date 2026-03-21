# P35 — IndexedDB & Offline Mode

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p35** (Tier 4 — Infrastructure).

**Your scope:** Add a service worker for static asset caching, IndexedDB for photo caching, and an offline indicator. You create `sw.js`, modify `index.html` for SW registration, and add offline UI. You do NOT touch rendering logic, layout, or data files beyond the caching layer.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make the Tree of Life work offline after first visit. Cache all static assets and fetched Wikipedia photos.

### Success Criteria

1. Service worker caches: index.html, all JS files, fonts, SVG assets
2. App loads fully offline after first visit
3. Wikipedia photos cached in IndexedDB after first fetch
4. Offline indicator shows when connection is lost
5. Graceful degradation: unfetched photos show emoji fallback
6. Service worker doesn't break GitHub Pages deployment
7. Cache invalidation on new version deploy
8. Zero console errors (online and offline)

---

## Context

### Current state

- No service worker
- No offline support
- Wikipedia photo fetches fail silently on network error (ImageLoader handles fallback)
- All JS files loaded via `<script>` tags (no dynamic imports)

### Static assets to cache

```
index.html
js/treeData.js, speciesData.js, uiData.js, factLibrary.js,
   imagePrompts.js, imageLoader.js
assets/placeholder.svg
Google Fonts (Inter, JetBrains Mono, Heebo) — external CDN
D3.js CDN (loaded but not used)
```

### GitHub Pages constraints

- Service worker scope must match deployment path
- `sw.js` must be at root level
- Cache versioning needed for updates

---

## Implementation Plan

### Phase A: Service worker for static assets

1. Create `sw.js` at repo root:
   ```js
   const CACHE_NAME = 'tol-v1';
   const STATIC_ASSETS = [
     './', './index.html',
     './js/treeData.js', './js/speciesData.js', './js/uiData.js',
     './js/factLibrary.js', './js/imagePrompts.js', './js/imageLoader.js',
     './assets/placeholder.svg'
   ];

   self.addEventListener('install', e => {
     e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)));
   });

   self.addEventListener('fetch', e => {
     e.respondWith(
       caches.match(e.request).then(r => r || fetch(e.request))
     );
   });

   self.addEventListener('activate', e => {
     // Delete old caches
     e.waitUntil(caches.keys().then(keys =>
       Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
     ));
   });
   ```
2. Strategy: cache-first for static assets, network-first for API calls

### Phase B: Register service worker

In `index.html` init or at end of body:
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('SW registered'))
    .catch(err => console.warn('SW failed:', err));
}
```

### Phase C: IndexedDB photo cache

1. Create photo caching layer in `js/imageLoader.js` or a new `js/photoCache.js`:
   ```js
   const PhotoCache = (() => {
     const DB_NAME = 'tol-photos';
     const STORE = 'photos';
     let db;

     async function init() {
       return new Promise((resolve, reject) => {
         const req = indexedDB.open(DB_NAME, 1);
         req.onupgradeneeded = () => req.result.createObjectStore(STORE);
         req.onsuccess = () => { db = req.result; resolve(); };
         req.onerror = () => reject(req.error);
       });
     }

     async function get(url) { /* read from IndexedDB */ }
     async function put(url, blob) { /* write to IndexedDB */ }
     return { init, get, put };
   })();
   ```
2. Intercept Wikipedia photo fetches:
   - Check IndexedDB first
   - If miss: fetch from network, store in IndexedDB, return
   - If offline: return cached or null

### Phase D: Offline indicator

1. Add `<div id="offline-banner">` — hidden by default
2. CSS: fixed top-center, yellow/amber background, "Offline — showing cached content"
3. JS: `window.addEventListener('online/offline', ...)` toggle visibility
4. Auto-hide when back online
5. i18n: translate banner text

### Phase E: Cache versioning

1. Increment `CACHE_NAME` version on each deploy
2. Add cache-busting query param to service worker registration: `./sw.js?v=${Date.now()}`
3. Or: use `skipWaiting()` + `clients.claim()` for immediate activation

### Phase F: Font caching

1. Cache Google Fonts responses in service worker (they're immutable)
2. Strategy: cache-first with long TTL
3. Alternatively: self-host font files in `assets/fonts/` for full offline support

---

## Files You Will Create/Modify

| File | What changes |
|------|-------------|
| `sw.js` | **NEW** — service worker |
| `js/photoCache.js` | **NEW** — IndexedDB photo cache |
| `index.html` | SW registration, offline banner HTML, offline CSS, script tag |
| `js/uiData.js` | i18n keys for offline banner |
| `PROJECT_PROGRESS.md` | Add p35 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` — rendering
- `js/treeData.js` — tree data
- Layout, search, timeline, compare, DNA calc

---

## Testing Checklist

1. `node serve.js` → load app, SW registers (check DevTools Application tab)
2. Disconnect network → reload → app loads from cache
3. All tree nodes, icons, labels render offline
4. Panel opens offline (for previously viewed species)
5. Photos load offline (if previously cached in IndexedDB)
6. Offline banner appears when disconnected
7. Reconnect → banner hides
8. Deploy new version → old cache cleared, new assets cached
9. GitHub Pages: SW doesn't break deployment or routing
10. Zero console errors (online and offline)

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p35-offline`
- PR title: `feat: add service worker, IndexedDB photo cache, and offline mode`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p35 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
