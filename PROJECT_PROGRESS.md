# Project Progress — Tree of Life

## Milestones

| # | Milestone | Status | Branch / PR |
|---|-----------|--------|-------------|
| p1 | Extract tree + hominin data to `js/treeData.js` | **Done** | PR #38 (`claude/cool-pascal`) |
| p2 | Fuzzy multilingual search (EN/HE/RU) | **Done** | `claude/inspiring-burnell` |
| p3 | Main-tree hominin lineage access | **Done** | PR #35 (`claude/admiring-wiles`) |
| p4 | Interactive geological timeline | Pending | — |
| p5 | Offline fallback for API failures | Pending | — |
| p6 | Hominin access improvements | **Done** | PR #39 (`feature/hominin-access`) |
| p7 | Visual overhaul — font, buttons, icons, timeline, contrast | **Done** | `feature/hominin-access` (same branch) |
| p8 | Dead CSS cleanup — delete `style.css` + remove dead inline rules | **Done** | `feature/hominin-access` (same branch) |
| p9 | Legacy JS cleanup — delete 7 dead App B modules | **Done** | `feature/hominin-access` (same branch) |
| p10 | Mobile Responsiveness | **Done** | `claude/inspiring-shockley` |
| p11 | Interactive Timeline + Alternate Tree Views | **Done** | `claude/epic-mayer` |
| p12 | Modern Scientific Visual Overhaul | **Done** | PR #48 (`claude/jovial-proskuriakova`) |

---

## p2 — Fuzzy Multilingual Search

**Branch:** `claude/inspiring-burnell`
**Commit:** `33e87b7`

### What was added

- **Bigram fuzzy matching** — `_bigramSet()` / `_fuzzyScore()` using Sorensen-Dice coefficient for typo tolerance (threshold 0.35)
- **TAXON_I18N dictionary** — ~130 entries mapping node IDs to Hebrew and Russian translations
- **Multilingual search index** — `buildSearchIndex()` includes Hebrew/Russian names in each entry's haystack
- **Multilingual results display** — shows localized taxon name with English subtitle when searching in non-English language
- **i18n keys** — `search_hint` and `search_no_results` added to inline TRANSLATIONS (en/he/ru)
- **serve.js** — uses `process.env.PORT || 5555` for preview server compatibility

### Files changed

| File | Lines | Summary |
|------|-------|---------|
| `index.html` | +228 | TAXON_I18N dict, fuzzy search algorithm, multilingual display, i18n keys |
| `js/i18n.js` | +9 | Matching search_hint/search_no_results keys (for future external module use) |
| `serve.js` | ~1 | PORT env variable support |

### Verified

- Fuzzy: "mammls" → Mammals, "fungl" → Fungi
- Hebrew: "יונקים" → Mammals, "חיידקים" → Bacteria
- Russian: "Грибы" → Fungi, "Бактерии" → Bacteria
- Zero console errors on load and search interaction

---

## p3 — Main-Tree Hominin Lineage Access

**Branch:** `claude/admiring-wiles` (PR #35, merged)

### What was added

- 28 hominin species connected to main D3.js tree as first-class nodes
- Organized into 4 groups: Proto-Hominins, Australopithecus, Paranthropus, Genus Homo
- Hominin-specific panel: brain volume bar, tools/fire/language badges, fossil sites, DNA introgression
- Hominini branch collapsed by default; expands on click
- Search integration for all hominin species

---

## p6 — Hominin Access Improvements

**Branch:** `feature/hominin-access` (PR #39)

### What was added

1. **Hominini branch node** — added `hominini` node to TREE under great-apes, with homo-sapiens nested as child
2. **Floating "Human Evolution" button** — persistent bottom-right button calling `openHomininView()` directly, with i18n (EN/HE/RU), RTL, light/dark theme support
3. **Golden pulsing ring + "Explore →" badge** — special rendering on hominini node in `render()` with `@keyframes homininGlow`
4. **Panel gateway card for hominini** — prominent gradient card with description + "Explore Human Evolution" button (replaces generic Deep Dive for the hominini node)
5. **i18n keys** — `btn_hominin` added in EN/HE/RU

### Files changed

| File | Changes |
|------|---------|
| `index.html` | CSS (floating button + animation + light/RTL), HTML button, render() gateway, panel upgrade |
| `js/treeData.js` | Added hominini branch node |
| `js/uiData.js` | Added btn_hominin i18n key |

### Verified

- Dark theme, light theme, Hebrew RTL — all working
- Floating button visible and functional
- Golden ring + badge on hominini node
- Panel gateway card with gradient button

---

## p7 — Visual Overhaul

**Branch:** `feature/hominin-access` (same PR #39)

### What was changed

**Phase 1 — Font Migration to Heebo**
- Replaced ~52 `Source Sans 3` inline references → `Heebo`
- Removed Lora and Noto Serif Hebrew from Google Fonts import
- Updated CSS variables: `--font-body`, `--font-sans` → Heebo
- Updated `style.css` font variables and Hebrew font rule
- Heebo handles EN, HE, RU natively (no separate Hebrew font needed)

**Phase 2 — Unified Back/Close Buttons**
- Added `.btn-back` CSS class with dark/light theme variants
- Applied to `#hom-close`, panel close button, panel back button
- Consistent pill-shaped gold-border style across the app

**Phase 3 — Node Icon Enhancement (Emoji → Photo Thumbnails)**
- Nodes with `PHOTO_MAP` entries show circular photo thumbnails with golden border
- Emoji fallback for nodes without photos or on image load error
- `loading="lazy"` for performance

**Phase 4 — Timeline Bar Fixes**
- Slider now visible (`opacity:1`) with custom golden thumb (webkit + moz)
- Taller hit target (18px) for easier interaction
- Extinction markers given `z-index:2`
- Tick labels given increased contrast

**Phase 5 — Contrast Remediation (WCAG AA)**
- Bumped ~20 light theme opacity values for WCAG AA (≥4.5:1) compliance
- Fixed dark theme `.era-tick`, `.p-detail`, `.hp-detail` contrast
- Improved node label opacity at deeper tree levels

### Files changed

| File | Changes |
|------|---------|
| `index.html` | Font refs (52 replacements), CSS variables, `.btn-back` class, photo icon rendering, timeline slider, contrast bumps |

### Verified

- Heebo font on all elements (inspected computed styles)
- Photo thumbnails on PHOTO_MAP nodes, emoji fallback on others
- Timeline slider visible and functional with golden thumb
- `.btn-back` on hom-close and panel close buttons
- Light theme, dark theme, Hebrew RTL, Russian — all working
- Zero console errors

---

## p8 — Dead CSS Cleanup

**Branch:** `feature/hominin-access` (same PR #39)

### What was changed

1. **Deleted `style.css`** (757 lines) — file was never loaded by `index.html` (no `<link>` tag); entirely dead legacy "App B" code
2. **Removed 17 dead inline CSS rules** from index.html `<style>` block:
   - `.tip-fact` light theme override (no element exists)
   - 9 `.era-*` tint classes (`.era-hadean` through `.era-cenozoic`) — never assigned to any HTML element
   - `.search-result-item`, `.search-result-name`, `.search-result-meta` dark overrides — dead classes (actual search uses `.sr-item`)
   - `#shortcuts-hint`, `kbd` dark overrides — overridden by inline `style=""`
   - `#loader` dark override — no `#loader` element exists (splash uses `#splash`)
3. **Updated `deploy-check.yml`** — removed `style.css`, `js/main.js`, `js/api.js`, `js/tree.js` from required files; added `js/treeData.js`, `js/speciesData.js`, `js/uiData.js`
4. **Updated documentation** — CLAUDE.md (repo structure, CSS guidance), docs/ARCHITECTURE.md (removed App B CSS section), PROJECT_PROGRESS.md

### Lines removed

| Item | Lines |
|------|-------|
| `style.css` (deleted) | 757 |
| Dead inline CSS rules | 17 |
| **Total dead CSS eliminated** | **774** |

### Verified

- App loads identically (style.css was never loaded — no visual change)
- Zero console errors
- Dark/light theme toggle working
- Hebrew RTL working

---

## p9 — Legacy JS Cleanup

**Branch:** `feature/hominin-access` (same PR #39)

### What was changed

1. **Deleted 7 dead App B JS modules** — none were loaded by `<script>` tags in `index.html`:
   - `js/main.js` — App B orchestrator
   - `js/api.js` — OTL/Wikipedia/iNaturalist API layer + INITIAL_TREE
   - `js/tree.js` — D3.js tree renderer
   - `js/panel.js` — Detail panel with API data
   - `js/search.js` — OTL API autocomplete search
   - `js/timeline.js` — Geological timeline bar
   - `js/i18n.js` — `[data-i18n]` attribute i18n system
2. **Updated documentation** — CLAUDE.md (removed legacy entries from repo structure), docs/ARCHITECTURE.md (removed entire App B section, updated known issues), PROJECT_PROGRESS.md

### Lines removed

| Item | Approx lines |
|------|-------------|
| 7 dead JS modules | ~2,000+ |
| Documentation cleanup (App B sections) | ~100 |

Combined with p8: **~2,800+ lines** of dead code eliminated from the repo.

### Verified

- App loads identically (files were never loaded — no change)
- Zero console errors
- deploy-check.yml JS glob still finds 3 active data files

---

## p10 — Mobile Responsiveness

**Branch:** `claude/inspiring-shockley`

### What was added

#### CSS — 3 responsive breakpoints (768px, 480px, landscape)

- **Detail panel → bottom-sheet** on mobile: slides up from bottom with 16px rounded corners, swipe handle, 75vh max-height
- **Touch targets enlarged** to WCAG 44px minimum: zoom buttons (.zbtn), close button (.p-close), lang buttons, theme button, hominin close
- **Search bar full-width** on mobile: stretches edge-to-edge below header, buttons wrap naturally
- **Header compact**: hint bar hidden, title/subtitle shrunk, no overlap with controls
- **Breadcrumb hidden** on mobile (too narrow for path display)
- **Legend collapsible** on mobile: tap "Domains" title to expand/collapse, starts collapsed
- **Hominin view stacks vertically**: species list full-width, detail panel below (was side-by-side)
- **Hominin filters** scroll horizontally (nowrap + overflow-x) instead of wrapping badly
- **Timeline compact**: reduced padding, smaller tick labels, taller slider hit area
- **Tooltip hidden** on mobile (touch devices use panel instead)
- **Compare grid** single-column on mobile
- **480px ultra-small**: lang switcher hidden, legend hidden, title-sub hidden, panel facts single-column
- **Landscape mobile** (max-height:500px): reduced panel/timeline heights

#### CSS — Light theme + RTL compatibility

- Panel bottom-sheet overrides work for both `[data-theme="light"]` and `[dir="rtl"]`
- RTL panel uses same translateY bottom-sheet behavior

#### JS — Touch interaction enhancements

- **Swipe-to-close panel**: drag panel down >80px to dismiss (with live drag tracking)
- **Swipe-to-close hominin view**: swipe right (LTR) or left (RTL) >100px to dismiss
- **Pinch-to-zoom**: two-finger gesture on SVG canvas with center-point zoom
- **Legend auto-collapse**: starts collapsed on mobile, toggles on title tap, auto-expands on desktop resize
- **Back button/popstate**: closes panel and hominin view on browser back
- **Panel transform fix**: `showMainPanel()` no longer sets inline `translateX(0)` that conflicted with mobile `translateY` animation; `closePanel()` clears inline transform/transition

#### JS — serve.js

- `PORT` env variable support for preview server compatibility

### Files changed

| File | Change | Summary |
|------|--------|---------|
| `index.html` | ~250 lines | 3 media query blocks (768/480/landscape), mobile JS patch IIFE, panel transform fixes |
| `serve.js` | ~1 line | `process.env.PORT` support |
| `.claude/launch.json` | ~1 line | `autoPort: true` |

### Verified

- **Mobile (375×812)**: tree renders, panel opens as bottom-sheet with swipe handle, closes on swipe-down, search bar full-width, hominin view stacks vertically, zoom buttons 44px, no console errors
- **Desktop (1280×800)**: no regressions — panel slides from right, legend expanded, controls in standard positions, tree renders normally
- **Panel open/close**: inline transform cleared properly on both mobile and desktop

### Known remaining items

- Touch-based node click sometimes races with SVG background click handler (pre-existing)
- Pinch-to-zoom and pan can conflict during fast two-finger gestures (acceptable UX)

---

## p11 — Interactive Timeline + Alternate Tree Views

**Branch:** `claude/epic-mayer`
**Scope:** Phase 1 (Interactive Timeline) + Phase 2 (Alternate Tree Views)

#### Phase 1 — Interactive Timeline

**1A: Era Tint Background (Fixed)**
- Added `<div id="era-tint-overlay">` after `#bg` — `position:fixed;inset:0;z-index:0;pointer-events:none;transition:background 0.6s`
- Added `ERA_COLORS` map with dark/light rgba values for 9 geological eras
- Rewrote `updateEraTint(mya)` to set inline background on overlay div using `ERA_COLORS` + theme check
- Removed dependency on old CSS class-based approach (`.era-hadean` etc.)

**1B: Interactive Extinction Markers with Tooltips**
- Added `EXTINCTION_DETAILS` array — 5 mass extinctions with mya, % species lost, cause, survivors
- Consolidated into single `buildExtinctionMarkers()` function
- Markers: 3px wide, expand on hover (`scaleY(1.5)`)
- Tooltip card on hover: name, "X% species lost", cause, survivors — styled with gold border
- Click marker → smooth-animates slider to that Mya value via `animateSliderTo()`
- Removed duplicate `addTimelineMarkers()` from init (~80 lines removed)

**1C: Species Count Indicator**
- Added `<span id="era-species-count">` next to `#era-label`
- `updateSpeciesCount()` counts nodes passing `nodeInEra(n)` vs total
- Display: "42 / 100 species visible" (translated)
- Called from slider handler, play animation, and preset clicks

**1D: Play/Animate Button**
- Added `<button id="era-play">▶</button>` next to timeline track
- `toggleEraPlay()` — uses `requestAnimationFrame` to sweep slider from current position to 0 (Present) over 12 seconds
- Toggle between ▶ and ⏸ states
- Stops if user manually touches slider

**1E: Era Preset Quick-Jump Buttons**
- Added `<div id="era-presets">` with 6 pill buttons: LUCA (3800), O₂ Crisis (2400), Cambrian (541), Dinosaurs (200), K-Pg (66), Now (0)
- Click → smooth-animate slider to target value (250ms ease via `animateSliderTo()`)
- Active state highlight on closest preset via `updatePresetHighlight()`
- Small pill buttons with gold border, themed for dark/light

**1F: Timeline i18n**
- All 5 extinction names + causes + survivors translated (EN/HE/RU)
- 6 preset labels translated
- `era_play`, `era_pause`, `era_species_count` translated
- Presets and markers rebuild on language change via `applyI18n()`

#### Phase 2 — Alternate Tree Views

**2A: View Mode Toggle UI + State**
- Added `let viewMode = 'radial'` state variable (values: 'radial' | 'chronological' | 'cladogram')
- Added `<div id="view-toggle">` with 3 buttons — fixed position bottom-right (mobile) / top-right
- Each button: Unicode icon + translated text label
- CSS: dark/light theme variants, RTL position flip, mobile stacking

**2B: Refactored layout() to Dispatch**
- `layout()` → `switch(viewMode)` dispatching to `layoutRadial()`, `layoutCladogram()`, `layoutChronological()`
- No behavior change for radial — existing code moved to `layoutRadial()`

**2C: Cladogram Layout (Left-to-Right Tree)**
- `layoutCladogram()` — X based on depth * depthSpacing, Y distributes leaves evenly
- Leaf counting for Y distribution — each leaf gets equal vertical space, parents centered on children
- Branch paths: right-angle connections (`M→H→V→H` SVG path) via updated `branchPath()`
- Labels positioned to right of node (`text-anchor: start`)
- RTL check: flips X-axis if `dir="rtl"`

**2D: Chronological Layout (Time-Axis View)**
- `layoutChronological()` — X = `timeToX(node.appeared)` mapping 3800→left, 0→right
- Y distributed by domain lanes (Bacteria, Archaea, Protists, Fungi, Plants, Animals)
- Deterministic jitter via `hashCode(node.id)` for consistent positioning
- Straight-line branches connecting parent to child

**2E: View Mode Integration**
- `setViewMode(mode)` — updates state, runs layout, auto-centers tree via `centerOnTree(scale)`
- `branchPath()` returns right-angle paths for cladogram, straight lines for chronological, bezier curves for radial
- Label positioning adapts per view mode (right-of-node for cladogram, above-node for chronological, angle-based for radial)

**2F: View Mode i18n**
- `view_radial`, `view_chrono`, `view_clado` translated (EN/HE/RU)
- View toggle labels update on language change

#### Files Modified
- `index.html` — CSS (~70 lines added), HTML (era-tint-overlay, view-toggle, timeline restructure), JS (all new functions + refactored layout)

#### Verification Results
- Zero console errors in all views
- Radial view: unchanged behavior, smooth transitions
- Cladogram view: left-to-right tree, right-angle branches, auto-centered
- Chronological view: time-axis positioning, domain lanes, auto-centered
- Era presets: all 6 buttons work, smooth animation, active highlighting
- Extinction markers: tooltips on hover, click-to-jump
- Play button: animates slider sweep, toggles play/pause
- Species count: updates with slider, shows visible/total
- Light/dark theme: all new elements styled correctly
- RTL support: view toggle flips position

---

## p12 — Modern Scientific Visual Overhaul

**Branch:** `claude/jovial-proskuriakova` (PR #48)

### What was changed

**Color System — Modern Scientific Palette**
- `:root` dark theme: `--bg:#1a1d23` (slate), `--accent-primary:#0ea5e9` (sky blue), `--accent-secondary:#8b5cf6` (violet)
- `[data-theme="light"]`: cool slate/blue palette replacing warm earth tones
- Domain colors: LUCA=#8b5cf6, Bacteria=#ef4444, Archaea=#f59e0b, Plants=#22c55e, Animals=#3b82f6, Fungi=#f97316, Protists=#a855f7
- New CSS tokens: `--surface`, `--surface-raised`, `--text-primary/secondary/muted`, `--border`, `--divider`, `--radius-*`

**Typography — Inter + JetBrains Mono**
- Replaced Playfair Display/Source Sans 3/Lora with Inter (UI) + JetBrains Mono (data)
- Kept Heebo for Hebrew/Cyrillic support
- Updated all inline `font-family` references

**SVG Silhouette Icons (replacing emojis)**
- NODE_ICONS map with 20 SVG path silhouettes: bacteria, archaea, plant, fungus, animal, fish, bird, reptile, amphibian, insect, mollusk, cnidarian, sponge, echinoderm, worm, crustacean, primate, hominin, mammal, default
- `getIconGroup(n)` maps nodes to icon categories based on ID and ancestry
- Monochrome white (dark) / dark gray (light), 60% opacity, scales with node size

**Label Overlap Fix**
- Global bounding-box collision detection replacing per-sibling-only check
- `pendingLabels` array with deferred rendering after all positions computed
- Priority system: HUMAN_PATH nodes always visible, depth 0-1 forced, deeper nodes yield on overlap
- Adaptive font sizing: siblings > 8 → 9px, > 12 → 8px
- `minAngleSep` increased from 0.15 to 0.22 radians

**Human Evolution Path Highlighting**
- `HUMAN_PATH` Set: LUCA → eukaryota → animalia → vertebrates → mammals → primates → great-apes → homo-sapiens
- Branches on path: 3px stroke, 0.9 opacity, `--accent-primary` color, drawn last (on top)
- Nodes on path: accent ring, always-visible labels, font-weight 600

**Loading Screen — Animated SVG Branching Tree**
- Replaced spinning 🌿 emoji with animated SVG tree growing branches outward
- Domain-colored dots at tips, staggered animation delays
- `@keyframes branchGrow` and `@keyframes nodeAppear`

**Background & Atmosphere Cleanup**
- Removed noise overlay, floating particles
- Removed `rootPulse`/`livingPulse` CSS animations → static rings
- Solid backgrounds replacing glassmorphism blur
- Clean borders, no glow filters

**Dead Code Removal**
- Removed ~925-line inline TREE constant (loaded from treeData.js)
- Removed ~52-line duplicate HOMININS/MAX_BRAIN/ERA_GROUPS/HOMININ_ID_ALIASES (also in treeData.js)
- Fixed `render()` fragment commit: added `branchLayer.replaceChildren(branchFrag)` + `nodesLayer.replaceChildren(nodesFrag)`

### Files changed

| File | Changes |
|------|---------|
| `index.html` | CSS palette, typography, SVG icons, label collision, human path, loading screen, background cleanup, dead code removal, render fix |
| `js/treeData.js` | Domain colors updated to new palette, lightenColor base values updated |
| `.claude/launch.json` | Added `autoPort: true` |

### Merge Resolution
- Merged with origin/main (36 conflicts resolved)
- Key fix: removed duplicate `const` declarations that caused SyntaxError in browser global scope
- Key fix: restored `replaceChildren()` calls lost during merge

### Verified
- Tree renders with nodes, labels, SVG icons — zero console errors
- Dark/light theme toggle working
- Human path highlighted from LUCA to Homo sapiens
- Label collision prevents overlapping text
- Loading screen shows animated branching tree
- PR #48 — deploy check PASSED, MERGEABLE

---

## SESSION HANDOFF

### What was done
Implemented the full Interactive Timeline (p11 Phase 1) and Alternate Tree Views (p11 Phase 2) milestone. This adds:
- 6 era preset quick-jump buttons with smooth animation
- Interactive extinction markers with rich tooltips (name, % lost, cause, survivors)
- Species count indicator that updates in real-time with the slider
- Play/animate button for a 12-second timeline sweep
- Era tint background overlay that changes color per geological period
- Three tree view modes: Radial (default), Cladogram (left-to-right), Chronological (time-axis)
- Full i18n support for all new features (EN/HE/RU)

### What was NOT done
- Chronological view auto-pan with slider (slider filters by opacity in all modes — more useful than auto-pan)
- Domain lane labels in chronological view (labels exist on nodes, adding lane headers felt cluttered)
- Collision nudging in chronological view (deterministic hash jitter handles most overlap well)

### Known Issues / Follow-up
1. The old `.era-*` CSS classes (lines 486-494) are now unused — safe to remove in a future cleanup
2. Chronological view could benefit from vertical domain lane separator lines
3. View mode is not persisted to localStorage (intentional — always starts in radial)
4. The species count uses `nodeInEra()` which counts all nodes in `nodeMap`, including internal branch nodes — could be refined to count only leaf species

### Key Functions Added
| Function | Purpose |
|----------|---------|
| `layoutRadial()` | Existing radial layout, extracted from `layout()` |
| `layoutCladogram()` | Left-to-right tree with depth-based X, leaf-distributed Y |
| `layoutChronological()` | Time-axis X, domain-lane Y with hash jitter |
| `centerOnTree(scale)` | Auto-centers viewport on tree bounding box |
| `setViewMode(mode)` | Switches view mode, re-layouts, centers |
| `buildExtinctionMarkers()` | Creates interactive extinction marker DOM |
| `updateSpeciesCount()` | Updates species visible counter |
| `toggleEraPlay()` | Play/pause timeline animation |
| `animateSliderTo(target)` | Smooth 250ms slider animation |
| `buildEraPresets()` | Creates era preset pill buttons |
| `updatePresetHighlight(mya)` | Highlights active preset |
| `updateEraTint(mya)` | Sets era overlay background color |

### Commit/Push/Merge Status
- Branch: `claude/epic-mayer`
- Base: `main`
- Status: Ready for PR
