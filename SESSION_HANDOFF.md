# Session Handoff — 2026-04-01 (Sprint J18 — Museum-Quality Species Info Panel)

**Status: done**
**Branch:** `claude/inspiring-yonath`
**PR:** #139

## 1. Session Goal
Transform the single-scroll species info panel into a 4-tab museum-quality experience with gamified stat bars, strengths/weaknesses character sheets, IUCN scale, lineage paths, and decorative naturalist elements.

## 2. What I Changed

### New file: `js/speciesStats.js` (~370 lines)
- `SPECIES_STATS` constant with gamified profiles for 28 iconic species
- Each entry: archetype string, 6 numeric stats (1-10), 3 strengths, 3 weaknesses

### Enhanced `js/geoData.js` (+80 lines)
- Added `CONTINENT_PATHS` — simplified SVG path data for 7 continents (360x180 viewBox)
- Added `REGION_CENTROIDS` — maps 21 region strings to [x,y] coordinates
- Added `REGION_TO_CONTINENT` — maps sub-regions to parent continents

### `index.html` — CSS (~130 lines added)
- Tab system: `.panel-tabs`, `.panel-tab`, `.panel-tab.active`
- Stat bars: `.stat-bar-group`, `.stat-bar-fill` with gradient + spring transition
- Strengths/weaknesses: `.sw-grid`, `.sw-card.strength`, `.sw-card.weakness`
- IUCN scale: `.iucn-scale`, `.iucn-seg.active`
- Decorative: `.panel-leaf-divider`, `.panel-orn-hdr`
- Ecology cards, lineage path, all with light/RTL/mobile/reduced-motion overrides

### `index.html` — JS (renderPanelContent rewrite)
- 4-tab panel: Overview, Stats (hidden if no data), Ecology, Evolution
- ARIA tablist pattern with keyboard navigation
- Stat bar animation via setTimeout(50) trigger
- Preserves existing helpers: renderMiniMap, renderBranchSection, renderSapiensPanel, navStack/navBack

### `js/panel.js` — defensive fix
- Made panel-close event listener defensive (null check)

## 3. Key Decisions
- Wrote to index.html's renderPanelContent (not panel.js) since that's the active version
- Reused existing helpers rather than reimplementing
- Stats tab auto-hides for species without SPECIES_STATS entries

## 4. What's Next
- Clean up dead code in panel.js (old renderPanelContent + unused helpers)
- Consider adding more species to SPECIES_STATS (currently 28 of 132 nodes)
- Potential: interactive stat comparison between two species

---

# Session Handoff — 2026-03-28 (Sprint J1 — Design System Cleanup)

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
