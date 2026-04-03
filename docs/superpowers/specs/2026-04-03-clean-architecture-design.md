# Clean Architecture Refactor — Design Spec

**Date:** 2026-04-03
**Branch:** `refactor/clean-architecture`
**Goal:** Transform index.html from a 2,580-line monolith into a clean architecture with external CSS files, ES module data files, and a single JS entry point — with zero regressions.

---

## Scope

### What changes
1. Extract ~2,113 lines of inline CSS from index.html into 10 external files
2. Convert 14 global `<script>` data files to ES modules with explicit exports/imports
3. Convert tours.js from window._tour* bridge to ES module with initTourDeps() pattern
4. Update sw.js precache list for new file paths
5. index.html shrinks to ~400 lines of pure HTML + `<link>` and `<script type="module">` tags

### What does NOT change
- Zero CSS rules modified, renamed, or deleted
- Zero JS logic or algorithms rewritten
- All CSS class names, variable names, DOM element IDs preserved
- No new dependencies or build tools
- Visual appearance identical before and after
- All inline HTML onclick handlers remain (they call window-exposed functions)

---

## Phase 1: CSS Extraction

### Target structure

```
css/
  variables.css    ~103 lines  :root custom properties, reset, skip-link, focus-visible
  layout.css        ~72 lines  background, particles, header, search, breadcrumb, nav
  tree.css          ~24 lines  SVG canvas, nodes, branches, badges, viewport
  timeline.css      ~32 lines  era browser bar, thumb, segments, extinction markers area
  panel.css        ~287 lines  panel shell, hero, content sections, animations, facts,
                               tags, CTA, links, primate cards, infographics, collapsible
  hominin.css       ~62 lines  hominin enter button, deep-dive overlay, compare cards
  features.css     ~330 lines  legend, zoom, tooltip, toasts, quiz, playback, trivia,
                               tours, tour selector, FAB, DNA calc, evo path, keyboard
                               help, engagement, species image, utility classes
  theme.css        ~128 lines  light theme overrides, dark mode polish, splash, panel
                               animation, semantic color vars, contrast fixes
  rtl.css           ~38 lines  RTL (Hebrew) layout rules, RTL panel elements
  responsive.css   ~210 lines  all @media blocks consolidated (768px, 480px, landscape,
                               reduced-motion, high-contrast) with component comments
```

### Loading order in index.html `<head>`

```html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/tree.css">
<link rel="stylesheet" href="css/timeline.css">
<link rel="stylesheet" href="css/panel.css">
<link rel="stylesheet" href="css/hominin.css">
<link rel="stylesheet" href="css/features.css">
<link rel="stylesheet" href="css/theme.css">
<link rel="stylesheet" href="css/rtl.css">
<link rel="stylesheet" href="css/responsive.css">
```

**Order rationale:**
- `variables.css` first: all files depend on custom properties
- Component files (layout → tree → timeline → panel → hominin → features): logical dependency order
- `theme.css` after components: light-theme overrides win by source order
- `rtl.css` after theme: RTL overrides apply on top of themed styles
- `responsive.css` last: media queries override all base styles

### Specificity preservation rules
- CSS rules are moved verbatim — no modifications
- Scattered `@media` blocks (e.g., panel hero at line 341, panel section reduced-motion at line 468) are consolidated into responsive.css with comments indicating their origin component: `/* ── PANEL HERO (from panel) ── */`
- The two duplicate `/* PANEL HERO IMAGE */` sections (lines 312–339 and 420–446) are both moved to panel.css as-is — no deduplication during this refactor
- features.css covers ~10 features at ~33 lines each — kept as one file with section comments; splittable later if any feature grows significantly

### Verification after Phase 1
- index.html reduced to ~470 lines (HTML markup + link/script tags)
- All items on the verification checklist pass
- `git diff --stat` shows only file moves, no content changes to CSS rules

---

## Phase 2: Data Files → ES Modules

### Conversion strategy: one file at a time

Each of the 14 data files is converted individually. For each file:
1. Add `export` keywords to its declarations
2. Update all consuming ES module files to add `import` statements
3. Verify the app loads and runs correctly in browser
4. Commit

This ensures the blast radius of any breakage is exactly one file.

### Conversion order

Order chosen to minimize dependency complexity — files with zero cross-data-file dependencies first, complex cases last:

```
 1. mapPaths.js        → 1 consumer (panel.js)
 2. primateData.js     → 1 consumer (panel.js)
 3. geoData.js         → 1 consumer (panel.js) — exports GEO_DATA, BRANCH_DATA
 4. triviaData.js      → 2 consumers (trivia.js, quiz.js)
 5. imagePrompts.js    → 0 consumers (dead code, convert for consistency)
 6. nodeIcons.js       → 2 consumers (renderer.js, panel.js)
 7. dnaSimilarity.js   → 1 consumer (dnaCalc.js) — exports 6 symbols
 8. factLibrary.js     → 5 consumers (app, panel, hominin, evoPath, engagement)
 9. imageLoader.js     → 6 consumers (app, renderer, panel, dnaCalc, evoPath, trivia)
10. uiData.js          → 3 consumers (theme, timeline, layout, playback) — exports 6 symbols
11. speciesData.js     → 5 consumers (app, panel, search, dnaCalc, trivia)
12. treeData.js        → 6 consumers + treeExpansion — exports 6 symbols
13. treeExpansion.js   → 1 consumer (app.js) — depends on treeData.js
14. tours.js           → special: full rewrite of bridge pattern
```

### Special cases

**treeExpansion.js (step 13):**
Currently a self-executing IIFE that mutates global `TREE` and uses global `lightenColor`. Conversion:
- Unwrap IIFE → `export function expandTree(tree, lightenColorFn) { ... }`
- Internal `find()`, `N()`, `add()`, `iucn()` become local helpers inside `expandTree()`
- `app.js` calls `expandTree(TREE, lightenColor)` after importing both from treeData.js
- The expansion runs at the same point in initialization as before

**tours.js (step 14):**
Currently uses `window._tour*` bridge to access app internals. Conversion:
- Convert all `window._tour*` reads to local variables
- Add `export function initTourDeps(deps) { ... }` matching the pattern used by panel.js, renderer.js, etc.
- Export `TOURS`, `tourState`, and all public tour functions
- `app.js` calls `initTourDeps({state, nodeMap, layout, scheduleRender, applyT, animateSliderTo})`
- Remove `window._tour*` assignments from app.js

**IIFE patterns (factLibrary.js, imageLoader.js, triviaData.js):**
Keep the IIFE intact, just add `export`: `export const FACTS = (() => { ... })();`
No structural change to the module internals.

### Barrel file: js/data.js

Created after all individual conversions are done. Re-exports widely-shared constants (used by 4+ files):

```js
// js/data.js — barrel for widely-shared data constants
export { TREE, HOMININS, MAX_BRAIN, ERA_GROUPS, HOMININ_ID_ALIASES, lightenColor } from './treeData.js';
export { PHOTO_MAP, ENRICHMENT, WIKI_TITLES, GREAT_APE_IDS, HOMININ_IDS } from './speciesData.js';
export { TRANSLATIONS } from './uiData.js';
export { FACTS } from './factLibrary.js';
export { ImageLoader } from './imageLoader.js';
export { NODE_ICONS, getIconGroup } from './nodeIcons.js';
```

**Barrel vs direct import rule:**
- Constants used by 4+ files → import from `data.js`
- Constants used by 1–3 files → import directly from source file
- Niche data (PRIMATE_DATA, GEO_DATA, MAP_PATHS, DNA_KNOWN, TRIVIA_QUESTIONS, IMAGE_PROMPTS, DEPTH_R, ERA_NAMES, EXTINCTIONS, TIMELINE_SEGMENTS, BRANCH_DATA, ERA_TINTS) → always direct import

### Consumer import map

| Consumer | From `data.js` | Direct imports |
|----------|---------------|----------------|
| app.js | TREE, PHOTO_MAP, FACTS, ImageLoader | expandTree ← treeExpansion, DEPTH_R ← uiData |
| layout.js | TREE | DEPTH_R ← uiData |
| renderer.js | TREE, NODE_ICONS, getIconGroup, ImageLoader | — |
| navigation.js | TREE | — |
| hominin.js | TREE, HOMININS, MAX_BRAIN, ERA_GROUPS, FACTS | — |
| panel.js | PHOTO_MAP, WIKI_TITLES, NODE_ICONS, getIconGroup, FACTS, ImageLoader | PRIMATE_DATA ← primateData, GEO_DATA/BRANCH_DATA ← geoData, MAP_PATHS ← mapPaths |
| search.js | HOMININS, ENRICHMENT | — |
| theme.js | TRANSLATIONS | — |
| dnaCalc.js | PHOTO_MAP, ImageLoader | estimateDnaSimilarity/getDnaFunFact ← dnaSimilarity |
| evoPath.js | PHOTO_MAP, FACTS, ImageLoader | — |
| trivia.js | PHOTO_MAP, ImageLoader | TRIVIA_QUESTIONS ← triviaData |
| quiz.js | — | TRIVIA_QUESTIONS ← triviaData |
| timeline.js | — | ERA_NAMES/TIMELINE_SEGMENTS ← uiData |
| playback.js | — | EXTINCTIONS ← uiData |
| utils.js | HOMININS, MAX_BRAIN, HOMININ_ID_ALIASES | — |
| engagement.js | HOMININS | — |
| zoom.js | TREE | — |

### Script tag changes in index.html

Before (15 tags + 1 module):
```html
<script src="js/treeData.js"></script>
<script src="js/treeExpansion.js"></script>
<script src="js/speciesData.js"></script>
<!-- ...11 more global scripts... -->
<script src="js/tours.js"></script>
<script type="module" src="js/app.js"></script>
```

After (1 tag):
```html
<script type="module" src="js/app.js"></script>
```

### Window-exposed functions

`app.js` currently assigns ~50 functions to `window.*` for use by inline HTML onclick handlers (setLang, toggleTheme, toggleExtinct, navigateTo, setViewMode, openDnaCalc, openEvoPath, showMainPanel, closePanel, startTour, endTour, focusNode, t, etc.). Additionally, it assigns 6 `window._tour*` bridge variables for tours.js.

**All existing `window.*` function assignments in app.js remain unchanged.** The only removals are the 6 `window._tour*` bridge variables, which are replaced by `initTourDeps()` when tours.js is converted (step 14).

### Service worker update (sw.js)

APP_SHELL list updated to include:
```js
const APP_SHELL = [
  '/',
  '/index.html',
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
  '/js/app.js',
  '/js/data.js',
  '/js/treeData.js',
  '/js/treeExpansion.js',
  '/js/speciesData.js',
  '/js/uiData.js',
  '/js/factLibrary.js',
  '/js/imageLoader.js',
  '/js/dnaSimilarity.js',
  '/js/nodeIcons.js',
  '/js/triviaData.js',
  '/js/primateData.js',
  '/js/geoData.js',
  '/js/mapPaths.js',
  '/js/tours.js',
  '/js/imagePrompts.js',
  '/js/state.js',
  '/js/utils.js',
  '/js/layout.js',
  '/js/renderer.js',
  '/js/panel.js',
  '/js/navigation.js',
  '/js/search.js',
  '/js/timeline.js',
  '/js/hominin.js',
  '/js/dnaCalc.js',
  '/js/evoPath.js',
  '/js/trivia.js',
  '/js/playback.js',
  '/js/theme.js',
  '/js/engagement.js',
  '/js/quiz.js',
  '/js/zoom.js',
  '/assets/placeholder.svg'
];
```

CACHE_VERSION bumped to `'tol-v2'`.

---

## Verification Checklist

Must pass after Phase 1 completion AND after each Phase 2 step:

- [ ] Tree renders: radial, timeline, cladogram views
- [ ] 154+ species visible, 352 with hominins at runtime
- [ ] Dark/light theme toggle
- [ ] EN/HE/RU language switch, RTL correct in Hebrew
- [ ] Fuzzy search works
- [ ] Panel opens with hero images, facts, tags, links
- [ ] Hominin overlay: opens, filters, compare, detail, View on Tree
- [ ] Timeline: era segments, extinction markers, thumb drag
- [ ] Quiz starts and scores correctly
- [ ] DNA Compare: species selection, similarity calculation
- [ ] Evo Path: path finding, presets
- [ ] All 3 guided tours play through
- [ ] Keyboard shortcuts: F, H, D, ?, Esc
- [ ] Mobile responsive: touch, swipe, pinch-zoom
- [ ] PWA: manifest loads, service worker registers
- [ ] Domain legend filters: click to highlight/dim
- [ ] Playback mode
- [ ] Did You Know idle facts
- [ ] Zero console errors in both themes and all languages

---

## Dead code noted

- `imagePrompts.js`: `IMAGE_PROMPTS` and `getImagePrompt()` are defined but never consumed by any other file. Converted to ES module for consistency but flagged for future cleanup.

---

## Risk mitigations

1. **CSS specificity changes:** Avoided by preserving source order via `<link>` tag sequence and consolidating `@media` blocks at the end in responsive.css.
2. **Global scope breakage during Phase 2:** Mitigated by converting one file at a time with verification after each.
3. **treeExpansion.js mutation timing:** `expandTree()` called at the same initialization point as the current IIFE runs, preserving behavior.
4. **tours.js bridge removal:** Uses the proven `initDeps()` pattern already used by 10+ modules in the codebase.
5. **Service worker stale cache:** CACHE_VERSION bumped to force re-cache of all assets.
