# Session Handoff — 2026-03-30 (Sprint J7 — Data Enrichment & Tree Expansion)

**Status: done**
**Branch:** `claude/zealous-swanson`

## 1. Session Goal
Execute Sprint J7 — expand the tree to 200+ species, add IUCN conservation badges, backfill funFact, expand DNA pairs and facts.

## 2. What I Changed

### js/treeData.js — Conservation + funFact backfill on existing 158 nodes
- Added `conservation:'XX'` field to 96 species-level nodes with IUCN status
- Added `funFact:'...'` to all nodes that were missing one (69 backfilled)
- Note: treeExpansion.js adds ~198 more nodes at runtime (339 total)

### index.html — Conservation badge rendering
- Added 6 CSS classes: `.conservation-badge`, `.conservation-CR/EN/VU/NT/LC`
- Added badge rendering in `renderPanelContent()` hero section reading `node.conservation || node.iucn`
- Added `patchFunFacts()` IIFE patching funFact onto 44 key treeExpansion.js nodes

### js/speciesData.js — 31 new PHOTO_MAP entries
- Total PHOTO_MAP coverage: 360+ entries

### js/geoData.js — 44 new GEO_DATA + BRANCH_DATA entries
- Geographic regions and branch-specific metadata for all new species

### js/dnaSimilarity.js — 25 new DNA_KNOWN pairs
- Total: 61 pairs (was 36)

### js/factLibrary.js — 22 new facts
- Total: 170 facts (was 148)

## 3. Key Architecture Notes
- `js/treeExpansion.js` (pre-existing) adds ~198 species at runtime using `add()` and `iucn()` functions
- It uses `node.iucn` (not `node.conservation`) — badge rendering reads both
- treeExpansion.js nodes don't have `funFact` natively — patched via inline IIFE in index.html
- 17 remaining duplicate IDs between treeData.js and treeExpansion.js (pre-existing, not from this sprint)

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
