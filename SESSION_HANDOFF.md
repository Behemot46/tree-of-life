# Session Handoff — 2026-03-30 (Sprint J9 — Guided Educational Tours)

**Status: done**
**Branch:** `claude/pensive-satoshi`

## 1. Session Goal
Execute Sprint J9 — build 3 guided educational tour paths with spotlight overlay, auto-pan to tree nodes, timeline animation, and a tour selector UI.

## 2. What I Changed

### js/tours.js (NEW — replaces js/tour.js)
- Tour engine with multi-tour support: `TOURS` registry with 3 tour definitions
- Tour selector UI: `showTourSelector()` builds modal with 3 clickable cards
- Step target types: `null` (centered), CSS selector string, `{ nodeId }` (tree node), `{ mya }` (extinction marker)
- Node navigation helper (`_tourNavToNode`): expands collapsed path, pans/zooms to center, highlights node via `highlightedId`
- Timeline helper (`_tourNavToMya`): calls `animateSliderTo()`, spotlights extinction marker
- Spotlight/card positioning refactored to accept rect objects (DOM elements, synthetic node rects, marker rects)
- Keyboard: ArrowRight/Enter=next, ArrowLeft=prev, Escape=end

### js/tour.js (DELETED)
- Old 7-step UI onboarding tour replaced by multi-tour system

### index.html
- Script tag: `js/tour.js` → `js/tours.js`
- Help button: `onclick="startTour()"` → `onclick="showTourSelector()"`
- Auto-start: `setTimeout(startTour, 1200)` → `setTimeout(showTourSelector, 1200)`
- Added ~45 lines of CSS for `.tour-selector-*` classes (overlay, modal, cards, mobile, light theme)

### js/uiData.js
- Removed 14 old single-tour step keys (tour_welcome_*, tour_search_*, etc.) from en/he/ru
- Added ~50 new keys per language: selector UI, 3 tour names/descs, 22 step title/desc pairs
- Kept shared keys: tour_next, tour_prev, tour_skip, tour_done, tour_of

## 3. Tour Definitions

| Tour | Steps | Targets |
|------|-------|---------|
| From LUCA to You | 8 | null → luca → eukaryota → animalia → vertebrates → mammals → primates → homo-sapiens |
| The Five Kingdoms | 7 | null → bacteria → archaea → protists → fungi → plantae → animalia |
| Mass Extinctions | 7 | #timeline(3800) → mya:445 → mya:370 → mya:252 → mya:200 → mya:66 → #timeline(0) |

## 4. Verified
- All 3 tours complete end-to-end, zero console errors
- Spotlight highlights targets correctly (tree nodes, CSS elements, extinction markers)
- Tree auto-pans to nodes, timeline animates to extinction Mya values
- Keyboard navigation: Right/Enter=next, Left=prev, Escape=end
- First-visit tour selector auto-appears after splash
- "?" button opens selector on repeat visits
- Mobile 375×812: cards stack vertically, tour card fixed at bottom

---

# Previous Session Handoff — 2026-03-28 (Sprint J1 — Design System Cleanup)

**Status: done**
**Branch:** `claude/keen-noether`
**PR:** #121

## 1. Session Goal
Execute Sprint J1 — clean the CSS foundation: rename CSS variables, add z-index scale, remove dead code, extract inline styles to classes, add reduced-motion JS guards.

## 2. What I Changed

### index.html — CSS block
- Renamed `--gold`→`--accent`, `--gold-light`→`--accent-light`, `--gold-dim`→`--accent-dim`, `--gold-rgb`→`--accent-rgb`, `--gold-text`→`--accent-text`, `--gold-text-dim`→`--accent-text-dim` (~60 replacements)
- Removed `--teal` and `--teal-dim` definitions (duplicates of `--accent-secondary`); replaced 1 `var(--teal)` usage
- Added 13 z-index CSS custom properties (`--z-base` through `--z-tour-content`) to `:root`
- Replaced ~30 global z-index magic numbers with `var(--z-*)` references (skipped local stacking contexts and inline attrs)
- Deleted 3 dead CSS rules: `[data-theme="dark"] .search-result-item/name/meta`
- Deleted 8 duplicate panel rules: `[data-theme="light/dark"] #panel` blocks
- Unified 3 `@media(max-width:600px)` → `@media(max-width:768px)` (DNA calc, evo-path, trivia)
- Added 7 new utility CSS classes: `.compare-banner`, `.compare-banner.visible`, `.intro-overlay`, `.offline-banner`, `.offline-banner.visible`, `.node-img-wrap`, `.node-img`, `.chip-badge`, `.compare-panel-open`

### index.html — JS block
- Added `const reducedMotion = () => matchMedia('(prefers-reduced-motion:reduce)').matches;`
- Guarded group-chip node entrance animation with `reducedMotion()` check
- Guarded regular node entrance animation with `reducedMotion()` check
- Guarded `showIntro()` — skips overlay entirely if reduced motion
- Replaced compare banner `style.cssText` with `className='compare-banner'` + `classList.add/remove('visible')`
- Replaced intro overlay `style.cssText` with `className='intro-overlay'`
- Replaced offline banner `style.cssText` with `className='offline-banner'` + `classList.toggle('visible')`
- Replaced node image wrapper `style.cssText` with `className='node-img-wrap'` + dynamic width/height
- Replaced node image `style.cssText` with `className='node-img'`
- Replaced chip badge `style.cssText` with `className='chip-badge'` + dynamic border/bg/color/height inline
- Replaced compare panel `style.display='flex'; style.flexDirection='column'` with `classList.add('compare-panel-open')`

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
