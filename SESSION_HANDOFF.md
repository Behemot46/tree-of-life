# Session Handoff — 2026-03-30 (Sprint J4 — Accessibility Foundation)

**Status: done**
**Branch:** `claude/condescending-dewdney`

## 1. Session Goal
Execute Sprint J4 — make the Tree of Life fully keyboard-navigable, screen-reader friendly, and comfortable on mobile touchscreens.

## 2. What I Changed

### index.html — CSS
- All mobile touch targets ≥ 44px: `.lang-btn`, `#theme-btn`, `#extinct-toggle`, `.leg-row`, `.zbtn` (480px override)
- Adjusted `#lang-switcher` right offset for wider theme button
- Added `<title>` and `<desc>` inside SVG for older screen readers
- Added `aria-labelledby` and `aria-describedby` on SVG element

### js/state.js — New state variables
- `state.focusedNodeId` — tracks keyboard-focused tree node for aria-selected and focus restore
- `state._panelTriggerFocus` — saves DOM element that opened a modal for focus restoration on close

### js/app.js — Keyboard navigation
- Rewrote SVG keyboard handler to WAI TreeView spec (4 distinct arrow keys):
  - ArrowRight: expand collapsed / move to first child
  - ArrowLeft: collapse expanded / move to parent
  - ArrowDown/Up: next/prev visible node in pre-order traversal
- Added `getVisibleTreeOrder()` helper for correct tree-order traversal
- Added `focusTreeNode()` helper with aria-selected tracking + announcements
- Added focus traps for DNA panel and Evo-path panel (Tab wrapping + Escape closes)
- Added view mode change announcement
- Added search results count announcement

### js/renderer.js — Accessibility rendering
- Root node (LUCA) gets `tabindex="0"` for initial Tab entry
- `aria-selected="true"` on keyboard-focused node
- Synchronous focus restore after `replaceChildren` DOM rebuild
- Expand/collapse click announcements via `a11yAnnounce()`

### js/panel.js — Focus restoration
- `closePanel()` announces "Panel closed" and restores focus to trigger element

### js/dnaCalc.js — Accessible modal
- `openDnaCalc()` saves trigger focus, auto-focuses first element
- `closeDnaCalc()` announces close, restores focus

### js/evoPath.js — Accessible modal
- `openEvoPath()` saves trigger focus, auto-focuses first element
- `closeEvoPath()` announces close, restores focus

### js/hominin.js — Focus trigger
- `interceptShowMainPanel()` saves `_panelTriggerFocus` before opening panel

## 3. Verification
- All keyboard navigation works: Right/Left expand/collapse, Down/Up tree-order, Home/End, Enter/Space
- Focus restores to correct node after expand/collapse (synchronous post-render)
- Panel opens on Enter, closes on Escape with focus returning to trigger
- DNA and Evo-path panels have focus traps and focus restoration
- All mobile touch targets ≥ 44px at 375×812 viewport
- Zero console errors on desktop and mobile
- 355 nodes rendered successfully

---

# Previous Session Handoff — 2026-03-29 (Sprint J3 — Code Modularization)

**Status: done**
**Branch:** `claude/xenodochial-johnson`

## 1. Session Goal
Split the 4,783-line inline `<script>` block in index.html into 17 focused ES modules using native `<script type="module">`. No build step.

## 2. What I Changed

### index.html
- Removed 4,777 lines of inline JavaScript (from ~7,040 lines to ~2,267 lines)
- Added `<script type="module" src="js/app.js"></script>` after data script tags
- All CSS and HTML markup unchanged

### New ES module files (17 files)
| File | Purpose |
|------|---------|
| `js/state.js` | Shared mutable state object + constants (HUMAN_PATH, TAXON_I18N) |
| `js/utils.js` | reducedMotion(), preprocess(), hominin helpers, verifyPhotoUrl() |
| `js/layout.js` | layout(), layoutRadial/Cladogram/Chronological/Playback |
| `js/zoom.js` | applyT(), smoothPanTo(), centerOnTree/Root, pointer handlers |
| `js/renderer.js` | render(), branchPath(), scheduleRender() |
| `js/navigation.js` | navStack, pushNav/navBack/navHome, breadcrumb, tooltip |
| `js/search.js` | buildSearchIndex(), searchEntities(), fuzzy matching |
| `js/timeline.js` | Era slider, extinction markers, presets, sparkline |
| `js/panel.js` | renderPanelContent(), showMainPanel(), species cards |
| `js/hominin.js` | buildHomininTree(), compare mode |
| `js/dnaCalc.js` | DNA similarity calculator modal |
| `js/evoPath.js` | Evolutionary path comparison tool |
| `js/trivia.js` | Trivia quiz game |
| `js/playback.js` | Time-lapse playback mode |
| `js/theme.js` | t(), setLang(), applyI18n(), toggleTheme() |
| `js/engagement.js` | Toast, idle timer, intro, particles, generateSpeciesIllustration() |
| `js/app.js` | Entry point: init(), window.* exposures, event listeners |

### Deleted files
- `js/core.js` — outdated p24 extraction copy (811 lines)
- Old `js/renderer.js`, `js/panel.js`, `js/search.js` — replaced by new ES modules

### Other updates
- `.github/workflows/deploy-check.yml` — added all 16 new module files to required list
- `CLAUDE.md` — updated repo structure and architecture sections
- `PROJECT_PROGRESS.md` — marked J3 done
- `ROADMAP.md` — moved J3 to completed

## 3. Architecture Notes
- Data files (13) remain as classic `<script>` globals — unchanged
- Application modules (17) use ES module imports/exports
- Shared state via `state.js` — single mutable `state` object
- Cross-module deps use late-binding (`initXxxDeps()`) to avoid circular imports
- ~40 functions exposed on `window.*` for HTML onclick handlers

## 4. Verification
- 355 nodes, 354 branches rendered
- Zero console errors
- All features tested: navigateTo, theme toggle, view modes, DNA calc, evo path, trivia, domain toggle, panel open/close
- Incorporates J2 changes: smoothPanTo fix, restoreNavState improvement, navHome overlay close, kbd-help overlay, navigateTo smooth pan

---

# Previous Session Handoff — 2026-03-28 (Sprint J1 — Design System Cleanup)

**Status: done**
**Branch:** `claude/keen-noether`
**PR:** #121

---

# Previous Session Handoff — 2026-03-21 (Mammal Data Upgrade to Homo Sapiens Parity)

**Status: done**
**Branch:** `claude/dazzling-black`
**PR:** #110

## 1. Session Goal
Upgrade all mammal nodes to match the level of detail shown in the Homo sapiens species card (5 facts, 6 tags, funFact, 5 altFacts, 3 links).

## 2. What I Changed

### js/treeData.js — Expanded facts, tags, funFact for 11 mammal nodes
- **6 leaf species** (blue-whale, naked-mole-rat, platypus, orangutan, gorilla, chimpanzee): facts 3→5, tags 3→6
- **5 branch nodes** (mammals, cetaceans, primates, great-apes, hominini): facts +1 each to reach 5, tags expanded to 6, added funFact where missing

### js/speciesData.js — Added/expanded ENRICHMENT entries
- **3 new entries**: mammals, cetaceans, hominini (5 altFacts + 3 links each)
- **4 partial fixes**: naked-mole-rat +1 link, platypus +1 link, primates +1 altFact, great-apes +1 altFact

### Merge conflict resolution
- Merged origin/main which added 5 new mammal species (bottlenose-dolphin, flying-fox, african-elephant, gray-wolf, three-toed-sloth) and restructured tree order
- Resolved 3 conflicts keeping upgraded data + new species
- Removed duplicate naked-mole-rat/platypus entries from old tree positions

---

# Previous Session Handoff — 2026-03-21 (Timeline Bottom UI Cleanup)

**Status: done**
**Branch:** `claude/kind-euler`
**PR:** #111

## 1. Session Goal
Remove ugly duplicate timeline markers and clean up the bottom UI area.

## 2. What I Changed

### index.html — Deleted `addTimelineMarkers()` (59 lines)
- Removed duplicate `EXTINCTION_EVENTS` array, `INNOVATIONS` array, `addTimelineMarkers()` function, and its `setTimeout` call
- These rendered garish full-height red `#ef4444` lines with `†` daggers and green `#2e7d32` lines with emoji icons directly on `#timeline`
- The proper `buildExtinctionMarkers()` system with CSS classes and hover tooltips remains

### index.html — CSS Fixes
- Removed dead `.ext-line` CSS rule (unused)
- Fixed light theme species count: `rgba(30,80,15,0.6)` → `var(--text-secondary)` for readability

## 3. Merge Resolution
- Merged `origin/main` (1 conflict in extinction marker CSS)
- Main had redesigned markers with `.ext-marker-icon`, `.ext-marker-line`, `.ext-popover` system
- Kept main's new design, applied species count readability fix on top

## 4. Previous Session
- Hominin Pill Chips & Deep Dive Removal (PR #106, `claude/intelligent-payne`)

---
