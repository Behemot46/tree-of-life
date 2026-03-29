# Session Handoff — 2026-03-29 (Sprint J2 — Navigation & Interaction Polish)

**Status: done**
**Branch:** `claude/lucid-chebyshev`

## 1. Session Goal
Execute Sprint J2 — unify navigation stacks, add smooth auto-pan, keyboard shortcuts help overlay, fix dead code.

## 2. What I Changed

### Deleted stale modularized files
- Removed `js/core.js`, `js/panel.js`, `js/renderer.js`, `js/search.js` — NOT loaded by any `<script>` tag, contained outdated `panelHistory`/`panelBack()` code
- These were extracted copies from a prior modularization attempt; running code is all inline in index.html

### index.html — Navigation fixes
- Fixed `smoothPanTo()` — `getElementById('tree-container')` → `getElementById('canvas-wrap')` (stale element ID)
- Improved `restoreNavState()` — panel-to-panel back no longer flashes (skips close/reopen cycle)
- Fixed `navBack()` — removed dead `hominin-view` reference (element doesn't exist)
- Fixed `navHome()` — now closes DNA calc, evo-path, trivia, and kbd-help overlays
- Fixed `openHomininView()` dead references → `navigateTo('hominini')` (2 call sites: hominini special panel + hominin deep dive button)

### index.html — Smooth auto-pan
- `navigateTo()` uses `smoothPanTo()` with 250ms delay before panel open (instant if `reducedMotion()`)
- `showMainPanel()` calls `smoothPanTo()` to center viewport on clicked node

### index.html — Keyboard shortcuts help overlay
- Added `<div id="kbd-help">` HTML overlay with 7 shortcut rows (Esc, Shift+Esc, F//, H, R, D, ?)
- Added CSS for `.kbd-panel`, `.kbd-row`, `kbd` elements (dark/light theme, mobile responsive)
- `?` key toggles overlay; Escape and backdrop click dismiss it
- `navHome()` also dismisses the overlay

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
