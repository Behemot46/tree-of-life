# Project Progress — Tree of Life

## Milestones

### Completed

| # | Milestone | Branch / PR |
|---|-----------|-------------|
| p1 | Extract tree + hominin data to `js/treeData.js` | PR #38 |
| p2 | Fuzzy multilingual search (EN/HE/RU) | `claude/inspiring-burnell` |
| p3 | Main-tree hominin lineage access (28 hominins, 4 groups) | PR #35 |
| p6 | Hominin access improvements (floating button, golden ring) | PR #39 |
| p7 | Visual overhaul — fonts, buttons, photo thumbnails, WCAG contrast | PR #39 |
| p8 | Dead CSS cleanup — deleted `style.css` + 17 dead inline rules | PR #39 |
| p9 | Legacy JS cleanup — deleted 7 dead App B modules (~2k lines) | PR #39 |
| p10 | Mobile responsiveness — bottom-sheet panel, touch, swipe, pinch-zoom | PR #45 |
| p11 | Interactive timeline + alternate tree views (radial/clado/chrono) | `claude/epic-mayer` |
| p12 | Modern scientific visual overhaul — SVG icons, label collision, human path | PR #48 |
| p13a | Back & Home navigation buttons with history stack | PR #51 |
| p13b | Species image system — ImageLoader + PHOTO_MAP (228 entries) | PR #52 |
| p14 | Inline hominin family tree — 28 species as tree nodes + panel enrichment | PR #53 |
| p15 | Stabilization & docs — removed duplicates, hoisted functions, fixed shadowing | PR #54 |
| p16 | Inline hominin subtree fixes | PR #55 |
| p17 | Subtree-weighted radial spacing | PR #56 |
| p18 | Fix overlapping header controls | PR #57 |
| p19 | Roadmap & project health | `claude/keen-easley` |
| p20 | Naturalist node artwork — expanded icon library (20→37 icons), improved mapping | PR #62 |
| p21 | Species panel visual identity — hero images, styled fallbacks, header typography | PR #61 |
| p22 | Rich data panels — collapsible sections, timeline bar, radar chart, enrichment | `claude/confident-haslett` |
| p23 | DNA similarity calculator — species comparator with known + estimated data | `claude/crazy-villani` |
| p22 | Rich data panels & infographics — sections, timeline bar, radar chart, typography | `claude/charming-einstein` |
| p24 | Always-visible hominin branch — expanded by default, golden path, label priority | `claude/strange-tharp` |
| p25 | Interactive legend & domain highlighting — filter, dim, visual feedback | `claude/stupefied-leakey` |
| p26a | 130+ facts pack — expanded library, panel/tooltip/discovery integration | `claude/compassionate-poitras` |
| p27 | i18n completeness — translate all hardcoded English strings to HE/RU | PR #69 |

### Upcoming

| # | Milestone | Goal | Status |
|---|-----------|------|--------|
| p20 | Naturalist node artwork | Replace all emoji/silhouette node icons with consistent high-quality artistic sketches (pen-and-ink naturalist style) for every node (~130+). Build asset pipeline, SVG/WebP format, fallback chain. | Done |
| p21 | Species panel visual identity | Replace emoji headers in species info panel with curated photos or GenAI artwork. Consistent framing/style, Wikimedia + AI-generated fallback pipeline. | Done |
| p22 | Rich data panels & infographics | Increase fonts, add descriptive paragraphs, layered data sections (habitat, diet, morphology, fossil record). Inline mini-infographics: size comparisons, range maps, trait radar charts. | Done |
| p23 | DNA similarity calculator | Two-species comparator: pick any two species, display estimated DNA similarity %. Visual output with divergence timeline, shared traits, "you share X% DNA with a banana" UX. | Done |
| p24 | Always-visible hominin branch | Show full hominin family tree as expanded branch with twigs on main canvas — no "explore deeper" required. Auto-layout to avoid crowding, golden path emphasis, larger labels. | Done |
| p25 | Interactive legend & domain highlighting | Clicking a domain in the legend highlights/filters that subtree on the canvas. Visual feedback, toggle behavior. | Done |
| p26 | Accessibility & navigation cleanup | Keyboard nav, ARIA labels, focus management, screen reader support, reduced-motion. Unify `panelHistory`/`navStack` into single model. | Pending |
| p27 | Performance & offline resilience | Viewport culling (render only visible nodes), lazy expansion, service worker caching, offline fallbacks, connection status indicator. | Pending |
| p28 | Guided tours & educational mode | Walkthrough overlays narrating key evolutionary milestones (Great Oxidation, Cambrian Explosion, K-Pg). Step-by-step discovery paths for educational use. | Pending |

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

## p13a — Back & Home Navigation Buttons

**Branch:** `claude/compassionate-gagarin` (PR #51, merged)

### What was added

- Persistent Back and Home buttons (`#nav-ctrl`) across all views
- Unified `navStack[]` with `pushNav()`, `navBack()`, `navHome()`
- Buttons auto-show when history exists, auto-hide at root
- i18n: `nav_back` / `nav_home` for EN/HE/RU
- RTL support: buttons mirror to top-right, back arrow flips
- Mobile layout: buttons centered at bottom
- Dark/light theme styling

### Files changed

| File | Changes |
|------|---------|
| `index.html` | CSS (nav-ctrl), HTML (nav buttons), JS (navStack, i18n hooks) |
| `serve.js` | `process.env.PORT` support |

---

## p13b — Species Image System

**Branch:** `claude/strange-dewdney` (PR #52, merged)

### What was added

- `js/imageLoader.js` — ImageLoader with fallback chain (generated → PHOTO_MAP → emoji)
- `js/imagePrompts.js` — AI image prompt library for species illustrations
- `PHOTO_MAP` expanded to 228 Wikimedia entries in `js/speciesData.js`
- `assets/species/.gitkeep` for future AI-generated images

### Files changed

| File | Changes |
|------|---------|
| `js/imageLoader.js` | **NEW** — 215 lines |
| `js/imagePrompts.js` | **NEW** — 694 lines |
| `js/speciesData.js` | PHOTO_MAP expanded to 228 entries |
| `index.html` | `<script>` tag + ImageLoader registration |

---

## p14 — Inline Hominin Family Tree

**Branch:** `claude/strange-rosalind` (PR #53, merged)

### What was added

- 28 hominin species rendered as inline tree nodes (4 groups: Proto-Hominins, Australopithecus, Paranthropus, Genus Homo)
- Panel enrichment with paleoanthropology data (brain volume, tools, fossil sites)
- Hominin nodes integrated with search, navigation, and photo system

### Files changed

| File | Changes |
|------|---------|
| `index.html` | `buildHomininTree()` rewrite, panel enrichment, hominin rendering |

---

## p15 — Stabilization & Docs

**Branch:** `claude/p15-stabilization` (PR #54)

### What was changed

- Removed 168-line duplicate inline PHOTO_MAP (was shadowing speciesData.js global)
- Hoisted `fetchWikiPhoto()` and photo cache to module scope
- Renamed `EXTINCTIONS` → `EXTINCTION_EVENTS` inside init() to fix shadowing
- Updated CLAUDE.md with 3 missing JS files, fixed stale font refs, corrected counts
- Created `js/factLibrary.js` — structured fact library with 18 trilingual loading facts
- Wired splash screen to `FACTS.getLoadingFact(currentLang)`

### Files changed

| File | Changes |
|------|---------|
| `index.html` | Duplicate removal, scope fixes, fact library integration |
| `js/factLibrary.js` | **NEW** — 179 lines |
| `CLAUDE.md` | Updated to reflect current architecture |

---

## p24 — Always-Visible Hominin Branch

**Branch:** `claude/strange-tharp`

### What was changed

**Hominini expanded by default**
- Changed `hominini._collapsed` from `true` to `false` at init time
- Changed all 4 group nodes (`group-proto`, `group-australopith`, `group-paranthropus`, `group-homo`) from collapsed to expanded
- 28 hominin species now visible as tree twigs on load — no user action required

**HUMAN_PATH extended**
- Added `hominini`, `group-homo`, `h_sapiens` to the golden path set
- Removed stale `homo-sapiens` (replaced by `h_sapiens` after `buildHomininTree()`)
- Golden path now traces LUCA → eukaryota → animalia → vertebrates → mammals → primates → great-apes → hominini → group-homo → h_sapiens (9 accent-colored segments)

**Label visibility for hominins**
- Increased depth filter from `depth<=6` to include all hominin nodes (`_hominin` flag, `hominini` ID, `group-*` IDs)
- Hominin species use abbreviated short names (e.g. "H. sapiens", "H. erectus") to reduce collision
- Group nodes get 11px font, species get 10px (vs default 8-9px for deep nodes)
- All 4 group nodes and HUMAN_PATH hominins force-shown in label collision resolution
- Group labels rendered in golden color (`#e8b86d`) with font-weight 600

**Hominini node rendering toned down**
- Removed "Explore →" badge (no longer needed as branch is visible)
- Removed `homininGlow` pulsing animation
- Kept static golden ring (1.5px, 50% opacity) as subtle visual anchor

### Files changed

| File | Changes |
|------|---------|
| `index.html` | Collapse defaults, HUMAN_PATH, label depth/priority/sizing, hominini rendering |
| `PROJECT_PROGRESS.md` | Added p24 completion entry |
| `SESSION_HANDOFF.md` | Written handoff notes |

### Verified

- Zero console errors
- 131 branches, 132 nodes rendered (28 extra from hominins)
- 9 golden path segments (accent-colored, 3px stroke)
- Hominin labels visible: Hominini, Proto-Hominins, Australopithecus, Paranthropus, Genus Homo, H. habilis, H. erectus, H. antecessor, H. sapiens
- Subtree-weighted radial spacing (p17) automatically allocates angular room
- "Human Evolution" button and dedicated hominin panel view still functional

---

## p19 — Roadmap & Project Health (2026-03-15)

See [ROADMAP.md](ROADMAP.md) for the full development roadmap with phases p16+.

---

## p20 — Naturalist Node Artwork (2026-03-15)

**Branch:** `claude/agitated-hawking`

### What was changed

**Expanded icon library (20 → 37 categories)**
- 17 new icon categories added: spirochete, protist, amoeba, diatom, dinoflagellate, algae, yeast, moss, fern, conifer, flower, jellyfish, octopus, butterfly, spider, shark, whale, turtle, dinosaur, rodent, bat
- All icons: filled silhouette style, 24×24 viewbox, single SVG path `d` string
- Recognizable at 10–26px rendered size

**Improved node-to-icon mapping**
- Protists no longer default to 'default' — mapped to protist, amoeba, diatom, dinoflagellate, algae
- Plants differentiated: moss, fern, conifer, flower (was all 'plant')
- Saccharomyces → yeast icon (was generic fungus)
- Shark gets distinct shark silhouette (was generic fish)
- Cetaceans/blue whale → whale icon (was generic mammal)
- Turritopsis → jellyfish (was generic cnidarian)
- Octopus/cephalopods → octopus (was generic mollusk)
- Archaeopteryx → dinosaur (was generic bird)
- Honey bee → butterfly (was generic insect)
- Naked mole rat → rodent (was generic mammal)

**Extracted to module**
- Created `js/nodeIcons.js` — NODE_ICONS map + getIconGroup() function (~180 lines)
- Added `<script src="js/nodeIcons.js"></script>` to index.html
- Removed ~95 lines of inline icon code from index.html

### Files changed

| File | Changes |
|------|---------|
| `js/nodeIcons.js` | **NEW** — 37 icon paths + getIconGroup() mapping function |
| `index.html` | Removed inline NODE_ICONS + getIconGroup(), added script tag |
| `PROJECT_PROGRESS.md` | Added p20 completion entry |
| `SESSION_HANDOFF.md` | Updated handoff notes |

### Verified

- All tree nodes render with icons (no blank circles)
- Photo overlay still works on top of icons
- Dark and light themes — icons visible in both
- Zero console errors
- 40 icon keys loaded, 100+ icon paths rendered on visible nodes
