# Session Handoff — 2026-03-18 (p24 — Code Extraction)

**Status: done**
**Branch:** `claude/magical-chebyshev`
**PR:** #90

## 1. Session Goal
Extract rendering, panel, and search logic from index.html's inline `<script>` into 3 external JS modules to reduce index.html from ~4,250 to ~1,960 lines.

## 2. What I Changed

### js/renderer.js (NEW — 787 lines)
- Layout: `layout()`, `layoutRadial()`, `layoutCladogram()`, `layoutChronological()`, `assignAngles()`, `assignPositions()`, `leafCount()`
- Render: `render()`, `scheduleRender()`, `getVisible()`, `getVisibleEdges()`, `branchPath()`
- SVG icons: `NODE_ICONS` constant, `getIconGroup()` mapping
- Human path: `HUMAN_PATH` Set, accent-colored branch highlighting
- Era browser: `buildExtinctionMarkers()`, `updateEraTint()`, `updateSpeciesCount()`, `toggleEraPlay()`, `animateSliderTo()`, `buildEraPresets()`, era slider event listener
- View modes: `setViewMode()`, `centerOnTree()`, `animateTreeEntrance()`
- Pan/zoom: pointer events, wheel zoom, zoom button handlers
- Tooltip: `showTip()`, `hideTip()`
- Filters: `nodeInEra()`, `toggleExtinct()`, `toggleDomain()`, `resetDomains()`
- State vars: `viewMode`, `currentEra`, `activeDomains`, `showExtinct`, `transform`, `highlightedId`

### js/panel.js (NEW — 1,050 lines)
- Panel rendering: `renderPanelContent()`, `showMainPanel()`, `panelBack()`, `closePanel()`
- Navigation stack: `pushNav()`, `navBack()`, `navHome()`, `updateNavButtons()`, `restoreNavState()`
- Species illustrations: `generateSpeciesIllustration()` (~280 lines, SVG art for each taxon group)
- Photo: `fetchWikiPhoto()`, `verifyPhotoUrl()`, `PHOTO_STATUS_CACHE`
- Breadcrumb: `getAncestors()`, `focusNode()`, `updateBreadcrumb()`
- Hominin view: `openHomininView()`, `renderHominins()`, `showHominDetail()`, filter handlers
- Compare mode: `toggleCompareMode()`, `toggleCompareSelect()`, `showComparePanel()`, `closeCompare()`
- DNA calculator UI: `openDnaCalc()`, `closeDnaCalc()`, `resetDnaUI()`, `openDnaSearch()`, `selectDnaSpecies()`, `dnaPreset()`, `showDnaResults()`, `animateCounter()`
- Event listeners: panel close, SVG click, nav buttons, hominin filters, DNA panel

### js/search.js (NEW — 340 lines)
- `TAXON_I18N` — Hebrew/Russian translations for ~130 taxa
- `HOMININ_SKIP_IDS` — duplicate ID filter
- Fuzzy search: `normalizeSearchText()`, `_bigramSet()`, `_fuzzyScore()`, `buildSearchIndex()`, `searchEntities()`
- Search UI: input/blur event listeners, results rendering
- `navigateTo()` — global navigation function (also on `window`)

### index.html (4,252 → 1,957 lines, −54%)
- Added 3 `<script src>` tags: renderer.js, panel.js, search.js
- Removed all extracted code (~2,400 lines)
- Kept inline: ImageLoader registration, hominin ID helpers, `buildHomininTree()`, `preprocess()`/`nodeMap`, ENRICHMENT patching, i18n (`t()`, `setLang()`, `applyI18n()`), theme toggle, keyboard shortcuts, intro animation, `init()`, mobile enhancements IIFE

## 3. Architecture Notes
- Script load order: data files → renderer.js → panel.js → search.js → inline script
- Cross-module references work because all function calls happen inside event handlers/function bodies (not at parse time)
- `const`/`let` declarations across `<script>` tags share browser's global lexical scope
- `t()` and `currentLang` defined in inline script, called from external files only inside function bodies
- `nodeMap` defined in inline script, accessible to all external files at runtime

## 4. Verification
- Tree renders with all nodes, branches, labels, icons
- Search works with fuzzy matching across EN/HE/RU
- Panel opens with species photos, descriptions, facts
- Era browser, view modes, zoom controls all functional
- Zero console errors or warnings

## 5. Previous Sessions
- p23: DNA Similarity Calculator (PR #81, `claude/crazy-villani`)
- p19: Roadmap, project health, splash/intro i18n (PR #58)
- p18: Fix overlapping header controls (PR #57)
- p17: Subtree-weighted radial spacing (PR #56)
- p16: Inline hominin subtree fixes (PR #55)
- p15: Stabilization & docs (PR #54)
