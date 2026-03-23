# P30 — Code Extraction & Organization

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p30** — extracting logic from the monolithic `index.html` into separate JS modules.

**Your scope:** Move rendering, panel, search, navigation, and timeline logic from the inline `<script>` block in `index.html` into dedicated `js/*.js` files. Preserve all functionality exactly. You do NOT add new features, change layout algorithms, or modify data structures.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Reduce `index.html` from ~3,800+ lines to ~800 lines (markup + CSS + bootstrap only) by extracting JS logic into focused modules, while keeping the no-build-step vanilla JS architecture.

### Success Criteria

1. `index.html` contains only: HTML markup, `<style>` block, `<script src>` tags, and a small bootstrap/init block
2. All extracted modules work via global scope (no ES modules, no bundler — just `<script src>` tags)
3. Every function and variable remains accessible to the same callers as before
4. Zero behavioral changes — app works identically before and after extraction
5. Each extracted file has a clear, single responsibility
6. Load order of `<script>` tags respects dependencies
7. Zero console errors
8. All three languages work
9. All three view modes work
10. Mobile, panel, search, timeline all function

---

## Extraction Plan

### Target file structure

```
js/
  treeData.js        (existing — TREE, lightenColor)
  speciesData.js     (existing — PHOTO_MAP, WIKI_TITLES, etc.)
  uiData.js          (existing — TRANSLATIONS, ERA_NAMES, etc.)
  factLibrary.js     (existing — FACTS)
  imagePrompts.js    (existing — prompt library)
  imageLoader.js     (existing — ImageLoader)
  dnaSimilarity.js   (existing — DNA calculator)
  nodeIcons.js       (NEW — NODE_ICONS map, getIconGroup(), addSilhouette())
  renderer.js        (NEW — render(), layout functions, label collision, zoom/pan)
  panel.js           (NEW — renderPanelContent(), openPanel(), closePanel(), panel helpers)
  search.js          (NEW — fuzzy search, TAXON_I18N, search UI handlers)
  navigation.js      (NEW — goBack(), goHome(), history stack, focusNode())
  timeline.js        (NEW — timeline rendering, era bars, view mode switching)
  app.js             (NEW — init(), preprocess(), event listeners, bootstrap)
```

### Script load order in index.html

```html
<!-- Data (no dependencies) -->
<script src="js/treeData.js"></script>
<script src="js/speciesData.js"></script>
<script src="js/uiData.js"></script>
<script src="js/factLibrary.js"></script>
<script src="js/imagePrompts.js"></script>
<script src="js/imageLoader.js"></script>
<script src="js/dnaSimilarity.js"></script>

<!-- Logic (depend on data) -->
<script src="js/nodeIcons.js"></script>
<script src="js/search.js"></script>
<script src="js/navigation.js"></script>
<script src="js/panel.js"></script>
<script src="js/timeline.js"></script>
<script src="js/renderer.js"></script>

<!-- Bootstrap (depends on everything) -->
<script src="js/app.js"></script>
```

### Extraction rules

1. **Move functions verbatim** — do not refactor, rename, or "improve" during extraction
2. **Shared state variables** (e.g., `nodeMap`, `currentLang`, `transform`) go into `app.js` as globals
3. **Cross-module calls** remain via global scope (e.g., `render()` called from `navigation.js`)
4. **Do one file at a time** — extract, test, then proceed to next
5. **Leave CSS in index.html** — don't extract styles (they work fine inline)

---

## Files You Will Create

| File | Contents |
|------|----------|
| `js/nodeIcons.js` | `NODE_ICONS`, `getIconGroup()`, `addSilhouette()` |
| `js/renderer.js` | `render()`, `layoutRadial()`, `layoutCladogram()`, `layoutChronological()`, `assignAngles()`, `assignPositions()`, `subtreeWeight()`, label collision, zoom/pan handlers |
| `js/panel.js` | `renderPanelContent()`, `openPanel()`, `closePanel()`, `fetchWikiPhoto()`, panel event handlers |
| `js/search.js` | `TAXON_I18N`, bigram functions, `handleSearch()`, search UI handlers |
| `js/navigation.js` | `goBack()`, `goHome()`, `focusNode()`, history stack, `HUMAN_PATH` |
| `js/timeline.js` | Timeline rendering, era bar clicks, view mode toggle handlers |
| `js/app.js` | `preprocess()`, `buildHomininTree()`, `init()`, shared state, event listener setup, theme/language init |

### Files you will modify

| File | What changes |
|------|-------------|
| `index.html` | Remove ~3,000 lines of JS from inline `<script>`, add new `<script src>` tags, keep only HTML + CSS + minimal bootstrap |
| `PROJECT_PROGRESS.md` | Add p30 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Tree renders on load (radial view, all nodes visible)
3. Click node → panel opens with all data
4. Search works (EN, HE, RU fuzzy matching)
5. Back/Home navigation works
6. Timeline slider works
7. View modes switch (radial → cladogram → chronological)
8. Zoom/pan (mouse wheel, drag, pinch-zoom)
9. Legend displays, toggleDomain if implemented
10. Dark/light theme toggle
11. Language switching (EN/HE/RU)
12. Mobile: bottom-sheet panel, touch gestures
13. DNA calculator opens and works
14. Hebrew RTL layout correct
15. `index.html` is under 1,000 lines
16. Zero console errors
17. No duplicate function/variable declarations across files
