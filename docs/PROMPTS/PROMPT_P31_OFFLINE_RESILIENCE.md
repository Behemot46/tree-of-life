# P31 — Offline Resilience & Service Worker

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p31** — adding offline support via a service worker and graceful API failure handling.

**Your scope:** Create a service worker for static asset caching, add IndexedDB caching for fetched Wikipedia photos, add an offline/online status indicator, and ensure graceful degradation. You create `sw.js` at the project root and modify `index.html` for registration and offline UI. You do NOT modify rendering logic, data structures, or layout algorithms.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make the Tree of Life work offline after first visit — all core functionality (tree browsing, panel viewing, search) available without network. Photo loading gracefully degrades.

### Success Criteria

1. Service worker caches all static assets on first visit (HTML, JS, CSS, fonts, placeholder SVG)
2. App loads fully offline after first visit
3. Wikipedia photo fetches cached in IndexedDB — previously viewed species show photos offline
4. Offline indicator appears when network is lost (subtle banner or icon, not disruptive)
5. `fetchWikiPhoto()` fails gracefully offline — shows placeholder, no console errors
6. Service worker updates transparently when new version is deployed
7. GitHub Pages deployment not broken (sw.js scope matches deployment path)
8. No caching issues during development (`?nocache` or dev bypass)
9. Cache size reasonable (< 50MB for static assets, photos managed with LRU)
10. Zero console errors online or offline

---

## Implementation Plan

### Phase A: Service worker for static assets

Create `sw.js` at project root:
```js
const CACHE_NAME = 'tol-v1';
const STATIC_ASSETS = [
  '/', '/index.html',
  '/js/treeData.js', '/js/speciesData.js', '/js/uiData.js',
  '/js/factLibrary.js', '/js/imagePrompts.js', '/js/imageLoader.js',
  '/js/dnaSimilarity.js',
  '/assets/placeholder.svg'
];
// Cache-first for static assets, network-first for API calls
```

### Phase B: Service worker registration

In `index.html` init block:
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW:', err));
}
```

### Phase C: Photo caching in IndexedDB

Wrap `fetchWikiPhoto()` to cache successful responses:
1. Before fetch: check IndexedDB `photo-cache` store for URL
2. On fetch success: store URL in IndexedDB with species key
3. On fetch failure: return cached URL if available, else null

### Phase D: Offline indicator

1. Small indicator (wifi icon + "Offline" text) in top bar when `!navigator.onLine`
2. Listens to `online`/`offline` events
3. Auto-hides when connection returns
4. Trilingual: `t('offline_mode')`

### Phase E: GitHub Pages compatibility

- Service worker scope must match GitHub Pages path (`/tree-of-life/`)
- Or use `.` relative scope
- Test with both `localhost:5555` and deployed URL

---

## Files You Will Create

| File | Contents |
|------|----------|
| `sw.js` | Service worker — cache-first static, network-first API, photo cache |

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | SW registration, offline indicator HTML/CSS, `fetchWikiPhoto()` IndexedDB wrapper |
| `js/uiData.js` | `offline_mode` translation key |
| `PROJECT_PROGRESS.md` | Add p31 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Browse several species (trigger photo loads)
3. Open DevTools → Application → Service Worker → registered
4. Go offline (DevTools Network → Offline)
5. Reload page → app loads from cache
6. Browse tree → all nodes, panels, search work
7. Previously viewed species show cached photos
8. New species show placeholder (no broken images)
9. Offline indicator visible
10. Go back online → indicator disappears
11. Deploy to GitHub Pages → SW works at `/tree-of-life/` path
12. Zero console errors in both online and offline modes
