# Session Handoff — 2026-03-15 (p24 — Always-Visible Hominin Branch)

**Status: done**
**Branch:** `claude/strange-tharp`

## 1. Session Goal
Show the full hominin family tree (28 species in 4 groups) as an always-visible expanded branch on the main tree canvas, so users can see human evolution without pressing any button.

## 2. What I Changed

### index.html
- **Hominini expanded by default** — changed `_collapsed=true` to `_collapsed=false` for `hominini` node and all 4 group nodes (`group-proto`, `group-australopith`, `group-paranthropus`, `group-homo`)
- **HUMAN_PATH extended** — added `hominini`, `group-homo`, `h_sapiens`; removed stale `homo-sapiens` (replaced by `h_sapiens` after `buildHomininTree()`). Golden path now: LUCA → eukaryota → animalia → vertebrates → mammals → primates → great-apes → hominini → group-homo → h_sapiens (9 segments)
- **Label depth filter widened** — from `n.depth<=6` to also include all hominin nodes (detected via `_hominin` flag, `hominini` ID, or `group-*` prefix)
- **Abbreviated species labels** — hominin species use `_hominData.short` (e.g. "H. sapiens" instead of "Homo sapiens") to reduce collision
- **Font sizing** — hominin group nodes get 11px, species get 10px (vs default 8-9px for deep nodes)
- **Label priority** — `HOMININ_PRIORITY` set forces all 4 group labels visible in collision resolution; rendered in golden color `#e8b86d` with font-weight 600
- **Hominini node rendering toned down** — removed "Explore →" badge and `homininGlow` animation; kept static golden ring (1.5px, 50% opacity)

### PROJECT_PROGRESS.md
- Added p24 to Completed table
- Changed p24 status from Pending to Done in Upcoming table
- Added detailed p24 section

## 3. How Layout Adapted to 28 Extra Nodes
The subtree-weighted radial spacing (p17) automatically allocates proportionally more angular room to subtrees with more visible descendants. Since hominini now has 28 visible leaves (was 0 when collapsed), `leafCount()` returns a much higher weight, giving the hominin branch adequate angular space without any manual layout tweaks.

## 4. HUMAN_PATH Changes
**Before:** `luca, eukaryota, animalia, vertebrates, mammals, primates, great-apes, homo-sapiens`
**After:** `luca, eukaryota, animalia, vertebrates, mammals, primates, great-apes, hominini, group-homo, h_sapiens`

Key insight: `buildHomininTree()` replaces hominini's children with 4 group nodes. The original `homo-sapiens` node (from treeData.js) is replaced by `h_sapiens` (from HOMININS array). So `homo-sapiens` no longer exists in `nodeMap` — the golden path was broken at `great-apes` before this fix.

## 5. What Was Kept/Removed from Special Hominini Rendering
- **Kept:** Static golden ring (circle, stroke `#e8b86d`, 1.5px, 50% opacity)
- **Removed:** Pulsing `homininGlow` animation (CSS `@keyframes` still exists but no longer applied)
- **Removed:** "Explore →" badge (foreignObject with text)
- **Kept:** "Human Evolution" floating button (`#btn-hominin`) — still opens dedicated side panel view

## 6. Tests Performed
- Zero console errors
- 131 branches, 132 nodes rendered (28 extra from expanded hominins)
- 9 golden path segments verified (accent-colored, 3px stroke)
- Labels rendered: Hominini, Proto-Hominins, Australopithecus, Paranthropus, Genus Homo, H. habilis, H. erectus, H. antecessor, H. sapiens
- All nodes expanded by default (`_collapsed=false`)

## 7. Not Tested
- Cladogram and chronological views (code changes are view-agnostic)
- Hebrew RTL layout
- Russian language
- Mobile viewport
- Light theme
- "Human Evolution" button click

## 8. Known Issues / Follow-up
- The `@keyframes homininGlow` CSS rule (line 380) is now unused — could be removed in a cleanup pass
- On very small screens, 28 extra nodes may make the tree dense — users can zoom in
- Species label collision means not all 28 species labels are visible simultaneously — most important ones (H. sapiens, H. erectus, H. habilis) are shown

## 9. Current State
- **Branch:** `claude/strange-tharp`
- **Clean:** All changes committed
- **PR:** Pending

---

# Session Handoff — 2026-03-15 (p23 — DNA Similarity Calculator)

**Status: done**
**Branch:** `claude/crazy-villani`

## 1. Session Goal
Build a DNA similarity calculator: users pick two species and see estimated DNA similarity %, divergence time, shared ancestor, and educational context.

## 2. What I Changed

### js/dnaSimilarity.js (NEW — ~130 lines)
- `DNA_KNOWN` — 35 curated DNA similarity pairs with published sources (Nature, Science) where available
- `estimateFromDivergence(mya)` — piecewise linear model mapping divergence time to estimated DNA similarity %
- `findLCA(nodeA, nodeB)` — walks `_parent` chains to find lowest common ancestor
- `estimateDnaSimilarity(nodeA, nodeB)` — main function: checks known lookup, falls back to estimation
- `DNA_FUN_FACTS` — 8 educational facts by similarity threshold
- `getDnaFunFact(percent, speciesName)` — returns relevant fun fact

### index.html
- **HTML**: DNA Compare button (`#btn-dna-calc`), modal panel (`#dna-panel`) with species selectors, search overlay, results display, 4 quick presets
- **CSS**: ~130 lines — modal styling, species slots, DNA bar, percentage display, badges, mobile responsive, dark/light theme
- **JS**: ~120 lines — `openDnaCalc()`, `closeDnaCalc()`, `dnaPreset()`, search integration via `searchEntities()`, animated counter, Escape key handling, backdrop click close
- **applyI18n()**: 10 new DNA calculator entries

### js/uiData.js
- 13 new i18n keys per language (EN/HE/RU): `dna_calc_title`, `dna_calc_btn`, `dna_select_species`, `dna_similarity`, `dna_divergence`, `dna_shared_ancestor`, `dna_method_known`, `dna_method_estimated`, `dna_search_placeholder`, 4 preset labels

### PROJECT_PROGRESS.md
- Added p23 to Completed table, marked as Done in Upcoming table

## 3. How the Estimation Model Works
- **Known pairs**: 35 curated entries in `DNA_KNOWN`, keyed by sorted `"idA|idB"`. Uses actual nodeMap IDs (e.g., `h_sapiens` not `homo-sapiens`)
- **Estimation**: For unknown pairs, finds LCA via `_parent` chain walk, uses LCA's `appeared` (Mya) as divergence time, then applies piecewise linear decay:
  - 0–7 Mya: ~98.5–99.5% (hominins)
  - 7–85 Mya: ~85–98.5% (mammals)
  - 85–500 Mya: ~40–85% (vertebrates→invertebrates)
  - 500–2000 Mya: ~17–40% (cross-kingdom)
  - 2000+ Mya: ~10–17% (cross-domain)

## 4. How to Add More Known Pairs
1. Open `js/dnaSimilarity.js`
2. Add entry to `DNA_KNOWN`: key is sorted `"idA|idB"` using actual nodeMap IDs
3. Check IDs exist: run `Object.keys(nodeMap).filter(k => k.includes('keyword'))` in console
4. Important: the tree uses `h_sapiens` (not `homo-sapiens`) for Homo sapiens due to `buildHomininTree()`

## 5. Known Issues / Follow-up
- Some tree nodes use group IDs (e.g., `mammals`, `birds`) rather than species IDs — the calculator works with any node
- The LCA divergence time uses the ancestor node's `appeared` field, which represents when the group appeared, not necessarily the exact divergence date
- 4 preset buttons: Chimp (98.8%), Banana/Plants (60%), Mushroom (30%), Bacterium (18%)
- The preset "You & a Banana" actually compares against "Flowering Plants" (`angiosperms`) since there's no banana-plant node in the tree

## 6. Tests Performed
- All 4 presets produce correct results with Published data badges
- Search-and-select flow works for both slots
- Dark/light theme both render correctly
- Zero console errors
- Escape key closes panel
- Backdrop click closes panel
- Shared ancestor link is clickable (navigates to LCA node)
- Animated percentage counter works smoothly

## 7. Not Tested
- Hebrew RTL layout (translations added but not visually verified)
- Russian language (translations added but not visually verified)
- Mobile viewport
- All 35 known pairs individually

---

# Previous Session Handoffs

## Session — 2026-03-15 (p19 — Roadmap & Project Health)
**Branch:** `claude/keen-easley`
- Created ROADMAP.md with prioritized development phases
- Updated PROJECT_PROGRESS.md and CHANGELOG.md
- Fixed deploy-check.yml and README.md
- Localized splash screen and intro overlay

## Session — 2026-03-15 (p18 — Fix Overlapping Header Controls)
**Branch:** `claude/sad-keller` (PR #57)
- Fixed header/lang-switcher/theme-toggle overlap via CSS repositioning

## Session — 2026-03-15 (p17 — Subtree-Weighted Radial Spacing)
**Branch:** `claude/goofy-bartik` (PR #56)
- Replaced equal-share angular allocation with sqrt(leafCount) weighting
- Updated DEPTH_R for consistent inter-ring gaps

## Session — 2026-03-15 (p16 — Inline Hominin Subtree Fixes)
**Branch:** `claude/elated-hofstadter` (PR #55)
- Added homo-floresiensis alias, fixed serve.js query string handling

## Session — 2026-03-15 (p15 — Stabilization & Docs)
**Branch:** `claude/p15-stabilization` (PR #54)
- Removed duplicate PHOTO_MAP, hoisted fetchWikiPhoto, fixed EXTINCTIONS shadowing

## Session — 2026-03-14 (p13a — Back & Home Navigation)
**Branch:** `claude/compassionate-gagarin` (merged)
- Added persistent Back and Home navigation buttons with unified history stack

## Session — Fact Library
**Branch:** `claude/tender-greider` (merged)
- Created js/factLibrary.js with 18 trilingual loading facts
