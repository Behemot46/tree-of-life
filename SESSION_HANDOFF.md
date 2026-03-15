# Session Handoff — 2026-03-15 (p22 — Rich Data Panels & Infographics)

**Status: done**
**Branch:** `claude/charming-einstein`

## 1. Session Goal
Enhance the species detail panel with richer data, larger fonts, collapsible sections, and inline mini-infographics.

## 2. What I Changed

### index.html — CSS (~40 lines added)
- `.panel-section`, `.panel-section-header`, `.panel-section-body` — collapsible section pattern with chevron rotation
- `.panel-timeline`, `.panel-timeline-track`, `.panel-timeline-marker`, `.panel-timeline-labels` — horizontal timeline bar
- `.panel-radar` — SVG radar chart container
- `.panel-enrich-card` — styled enrichment fact cards with accent border
- `.panel-link-pill` — external link pill buttons with hover state
- RTL support: chevron rotation flips, enrichment card border flips

### index.html — renderPanelContent() rewritten
- **Typography enlarged**: species name 22px→26px (weight 800), latin 13px→15px, body text 14px→15px, facts values use JetBrains Mono
- **Section gap**: 16px→20px between sections
- **Era line**: colored domain dot added
- **Collapsible sections**: Overview (always open), Key Facts (open), Evolutionary Context (open), Hominin Data (if applicable), Sub-groups (collapsed by default)
- **Timeline position bar**: horizontal bar showing when species appeared relative to 3.8 Bya, with marker dot and domain color
- **Radar chart**: SVG spider chart for nodes with ≥3 numeric facts, translucent polygon fill
- **Enrichment cards**: `node.altFacts` rendered as styled cards with accent left-border
- **Link pills**: `node.links` rendered as pill buttons with hover animation (uses CSS class instead of inline hover handlers)
- **Sub-groups section**: clickable list with icon, name, latin name, and arrow

### PROJECT_PROGRESS.md
- Added p22 to Completed table
- Changed p22 status from Pending to Done in Upcoming table

## 3. New Panel Section Structure
1. **Hero image** (16:9, unchanged)
2. **Lineage badge** (Human Lineage / Great Apes, unchanged)
3. **Title block** (name 26px/800, latin 15px, era with domain color dot)
4. **Overview** section: desc (15px), fun fact, detail, tip fact
5. **Key Facts** section: facts grid (JetBrains Mono values), radar chart (if ≥3 numeric facts), trait tags
6. **Evolutionary Context** section: timeline position bar, enrichment cards (altFacts), link pills
7. **Hominin Data** section (if applicable): brain volume, tools/fire/language, DNA legacy, fossil sites
8. **Sub-groups** section (collapsed by default): clickable child list
9. Close button

## 4. Infographics Implemented
- **Timeline position bar**: renders for every species with `appeared` data. Shows position on 3.8 Bya→Now axis.
- **Radar/spider chart**: renders when node has ≥3 facts with numeric values. SVG 120×120, grid circles, axis lines, filled polygon.
- Size comparison was noted as optional in the prompt and was not implemented (insufficient structured size data in current tree nodes).

## 5. Tests Performed
- 7 species tested via eval (luca, bacteria, fungi, archaea, ecoli, prochlorococcus, sahelanthropus)
- All sections render correctly: Overview (4/4), Key Facts (4/4), Evolutionary Context (4/4), Sub-groups (where applicable)
- Timeline bar renders for all species with `appeared` data
- Radar chart renders for prochlorococcus (4 numeric facts)
- Enrichment cards render for ENRICHMENT species (bacteria: 5 cards, 3 link pills)
- Hominin section renders with brain volume bar for sahelanthropus
- Light theme verified — polished appearance
- Dark theme verified — zero contrast issues
- Zero console errors throughout all testing
- JetBrains Mono confirmed on facts values and DNA percentages

## 6. Not Tested
- Hebrew RTL layout (CSS rules added but not visually verified)
- Russian language
- Mobile bottom-sheet (preview viewport triggers bottom-sheet; swipe-down-to-close may interfere with scrolling)
- Collapsible section click interaction (CSS works but preview touch handling is unreliable)

## 7. Known Issues / Follow-up
- Size comparison infographic not implemented (optional per prompt — needs structured height/length data)
- Preview tool viewport is narrow, making desktop side-panel layout hard to verify visually
- Radar chart only appears for species with ≥3 parseable numeric fact values

---

# Session Handoff — 2026-03-15 (p25 — Interactive Legend & Domain Highlighting)

**Status: done**
**Branch:** `claude/stupefied-leakey`

## 1. Session Goal
Make the legend fully interactive — clicking a domain highlights that subtree while dimming everything else, with clear visual feedback.

## 2. What I Changed

### index.html
- **CSS**: Added `.leg-row.active` / `.leg-row.dimmed` classes with transitions (opacity, background, font-weight). Added `#leg-show-all` button styling with `.filtering` state. Light theme variant for `.leg-row.active`.
- **HTML**: Replaced inline-styled Show All `<button>` with `<button id="leg-show-all">` using CSS classes. Added `<span id="i-leg-show-all">` for i18n.
- **JS — `toggleDomain()`**: Rewrote with smart single-click logic:
  - All domains active + click one → solo that domain (deactivate all others)
  - Some active + click inactive → add it
  - Some active + click active → remove it (unless last non-luca domain)
- **JS — `resetDomains()`**: Resets to full set, updates legend UI via `updateLegendUI()`.
- **JS — `updateLegendUI()`**: New helper that applies `active`/`dimmed` CSS classes to legend rows and `filtering` class to Show All button.
- **JS — `ALL_DOMAINS` constant**: Array of all 8 domain IDs.
- **JS — `isAllDomainsActive()`**: Helper to check if filtering is active.
- **JS — `render()` changes**: Inactive domain nodes/branches are dimmed (opacity 0.15/0.06) instead of hidden. Tree structure always visible. Dimmed nodes still clickable (panels open normally).
- **JS — `applyI18n()`**: Added `i-leg-show-all` translation.

### js/uiData.js
- Added `leg_show_all` translation key: EN "Show All", HE "הצג הכל", RU "Показать все".

### PROJECT_PROGRESS.md
- Added p25 to Completed table, marked Done in Upcoming table.

## 3. How Toggle Behavior Works
- **Solo mode**: When all domains active, clicking one solos it (only that domain + LUCA visible)
- **Add mode**: When filtering, clicking an inactive domain adds it
- **Remove mode**: When filtering, clicking an active domain removes it (minimum 1 non-luca domain enforced)
- **Reset**: Show All button restores all domains

## 4. How Dimming Works
- Dimming uses inline `g.style.opacity='0.15'` on node groups and `stroke-opacity=0.06` on branches
- Legend rows use CSS classes `.active` (highlight with background) and `.dimmed` (opacity 0.35) with 0.3s transitions
- Show All button gets `.filtering` class when domains are filtered (accent border/color)
- All domains active = no dimming applied, no active/dimmed classes on legend rows

## 5. Tests Performed
- Toggle logic: solo → add → remove → reset flow verified programmatically
- Domain filtering: 82 nodes correctly dimmed when bacteria solo'd, 18 active
- Legend row classes correctly applied (active/dimmed)
- Show All button `.filtering` class toggles correctly
- Zero console errors
- Dimmed nodes remain clickable (panel opens)

## 6. Not Tested
- Visual rendering at desktop width (preview browser viewport was narrow)
- Mobile layout
- Hebrew RTL layout
- Russian language
- Dark theme
- Cladogram/chronological view modes
- Search across dimmed domains

## 7. Known Issues
- Legend is positioned off-screen on narrow viewports due to `bottom: 5rem` mobile CSS (pre-existing, not introduced by this change)
- The 480px breakpoint hides the legend entirely (pre-existing)

---

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
- **PR:** https://github.com/Behemot46/tree-of-life/pull/64

---

# Session Handoff — 2026-03-15 (p26a — 130+ Facts Pack Integration)

**Status: done**
**Branch:** `claude/compassionate-poitras`

## 1. Session Goal
Expand the fact library from 18 to 130+ trilingual facts and wire them into 5 UI surfaces: loading screen, species panel, node tooltip, discovery toast, and random species button.

## 2. What I Changed

### js/factLibrary.js (complete rewrite — ~320 lines)
- **148 trilingual facts** (EN/HE/RU) — up from 18
- Each fact has metadata: `species` (node ID linkage), `loading`, `panel`, `tooltip`, `discovery` flags
- **New API methods**: `getForSpecies(nodeId)`, `getPanelFact(nodeId, lang)`, `getTooltipFact(nodeId, lang)`, `getDiscoveryFact(lang)` with session dedup
- Fact breakdown by domain:
  - Bacteria & Archaea: 15 facts
  - Protists: 8 facts
  - Fungi: 10 facts
  - Plants: 15 facts
  - Invertebrates: 15 facts
  - Fish & Amphibians: 10 facts
  - Reptiles & Birds: 12 facts
  - Mammals: 15 facts
  - Human evolution: 15 facts
  - General/cross-domain: 15 facts
  - Original 18 loading facts (enhanced with species linkage)

### index.html
- **Panel DID YOU KNOW** (~line 2830): Enhanced to show trilingual `FACTS.getPanelFact()` when no `node.funFact` exists
- **Tooltip** (~line 363): Added `.tip-fact-line` CSS class for italic fact line below node name; `showTip()` now accepts `nodeId` param, calls `FACTS.getTooltipFact()`
- **Discovery fact toast** (~line 1167): New `#fact-toast` element with CSS animation, auto-shows after random species jump, auto-dismisses after 7s, clickable to dismiss
- **Random button** (~line 3739): Wired to `showFactToast()` after `navigateTo()`

## 3. Surfaces Wired

| Surface | Source | Status |
|---------|--------|--------|
| Loading screen | `FACTS.getLoadingFact(lang)` | Already existed, now draws from 72 loading-safe facts |
| Species panel | `FACTS.getPanelFact(nodeId, lang)` | NEW — trilingual fact in DID YOU KNOW box |
| Node hover tooltip | `FACTS.getTooltipFact(nodeId, lang)` | NEW — italic one-liner below node name |
| Discovery toast | `FACTS.getDiscoveryFact(lang)` | NEW — top-center toast after random jump |
| Random button | Triggers discovery toast | NEW — auto-shows fact on 🎲 click |

## 4. ENRICHMENT Migration (Phase F)
Not completed — left as-is. ENRICHMENT altFacts still display in their own "DID YOU KNOW?" section (English only). The FACTS library provides trilingual facts via the separate "DID YOU KNOW" section above it.

## 5. Files Touched
| File | Change |
|------|--------|
| `js/factLibrary.js` | Complete rewrite — 148 facts + 6 new API methods |
| `index.html` | Panel fact integration, tooltip fact line, discovery toast HTML/CSS/JS |
| `PROJECT_PROGRESS.md` | Added p26a to completed table |
| `SESSION_HANDOFF.md` | This handoff |

## 6. Tests Performed
- `FACTS.getAll().length` → 148
- `FACTS.getLoadingPool().length` → 72
- Panel shows trilingual fact for E. coli (verified EN + HE)
- Toast appears on random button click with correct fact text
- Hebrew RTL: toast and panel facts display correctly in Hebrew
- Zero console errors
- Discovery dedup: `getDiscoveryFact()` tracks shown IDs per session

## 7. Not Tested
- Russian language (translations added but not visually verified)
- Mobile viewport layout for toast
- Tooltip fact on desktop hover (verified code path, not visual)
- All 148 facts individually for accuracy

## 8. Known Issues / Follow-up
- ENRICHMENT altFacts (English only) still display separately from FACTS library facts — could be unified in a future pass
- Toast positioning may need adjustment on very narrow mobile viewports
- `node.funFact` (from treeData.js) takes priority over FACTS library — some nodes show English-only funFact even when FACTS has trilingual version

---

# Session Handoff — 2026-03-15 (p20 — Naturalist Node Artwork)

**Status: done**
**Branch:** `claude/agitated-hawking`

## 1. Session Goal
Expand the tree node icon library from 20 monochrome SVG silhouettes to 37 distinct categories, improve node-to-icon mapping accuracy, and extract icon code to a standalone module.

## 2. What I Changed
- Created `js/nodeIcons.js` — new module with 37 SVG icon paths and `getIconGroup()` mapping function
- Removed inline `NODE_ICONS` map and `getIconGroup()` from `index.html` (~95 lines removed)
- Added `<script src="js/nodeIcons.js"></script>` to index.html
- 17 new icon categories: spirochete, protist, amoeba, diatom, dinoflagellate, algae, yeast, moss, fern, conifer, flower, jellyfish, octopus, butterfly, spider, shark, whale, turtle, dinosaur, rodent, bat
- Improved mapping: protists, plants, and specific animals now get distinct icons instead of generic fallbacks

## 3. New Icon Categories Added
spirochete, protist, amoeba, diatom, dinoflagellate, algae, yeast, moss, fern, conifer, flower, jellyfish, octopus, butterfly, spider, shark, whale, turtle, dinosaur, rodent, bat

## 4. Known Issues / Follow-ups
- `platypus` — uses generic mammal, could have unique silhouette
- Some deep species nodes inherit parent icon via ancestry walk — acceptable but could be refined

## 5. Files Touched
| File | Change |
|------|--------|
| `js/nodeIcons.js` | **NEW** — 37 icon SVG paths + getIconGroup() (~180 lines) |
| `index.html` | Removed inline NODE_ICONS + getIconGroup(), added script tag |
| `PROJECT_PROGRESS.md` | Added p20 milestone entry |
| `SESSION_HANDOFF.md` | This file |

---

# Session Handoff — 2026-03-15 (p21 — Species Panel Visual Identity)

**Status: done**
**Branch:** `claude/clever-northcutt`

## 1. Session Goal
Replace emoji-based species panel headers with hero images and styled SVG fallbacks, creating a visually rich "species card" experience.

## 2. What I Changed

### index.html
- **Hero image section** — replaced inline `aspect-ratio:16/9; background:#111` div + raw emoji fallback with new `.panel-hero` component using CSS classes
- **Image sourcing chain** — uses `ImageLoader.getBestUrl(node)` → PHOTO_MAP → generated .webp → Wikipedia API (`fetchWikiPhoto`) → styled SVG fallback
- **SVG fallback** — when no image available, shows domain-colored gradient background with the node's SVG silhouette icon (from `NODE_ICONS`/`getIconGroup`) instead of raw emoji
- **Skeleton loading** — CSS shimmer animation (`.panel-hero-skeleton`) while image loads
- **Fade-in transition** — hero image fades in on load via `.panel-hero-img.loaded { opacity: 1 }`
- **Credit attribution** — shows source credit ("Wikipedia / Wikimedia Commons" or "AI-generated illustration") below hero image
- **Header typography** — removed emoji from header, species name uses `.panel-header h2` class, latin name and era use semantic classes
- **Lineage badges** — "Human Lineage" and "Great Apes" badges extracted to `.panel-lineage-badge` class
- **`fetchWikiPhoto()` updated** — now handles null `imgEl` parameter (for cache-only pre-fetch)
- **CSS additions** — ~40 lines of new panel hero styles: `.panel-hero`, `.panel-hero-img`, `.panel-hero-fallback`, `.panel-hero-gradient`, `.panel-hero-credit`, `.panel-hero-skeleton`, `@keyframes shimmer`, light theme overrides, mobile responsive (aspect-ratio 2/1, max-height 150px)

## 3. Image Sourcing Chain (how it works)
1. `ImageLoader.getBestUrl(node)` returns best static URL (PHOTO_MAP → generated .webp → node.img)
2. If static URL loads → show it with fade-in + credit
3. If static URL fails → try `fetchWikiPhoto()` from Wikipedia API
4. If Wikipedia succeeds → show that photo + "Wikipedia / Wikimedia Commons" credit
5. If all fail → show styled SVG fallback (domain-colored gradient + silhouette icon)

## 4. Files Touched
| File | Change |
|------|--------|
| `index.html` | Panel hero CSS (~40 lines), `renderPanelContent()` rewrite (~50 lines changed), `fetchWikiPhoto()` null-safety |
| `PROJECT_PROGRESS.md` | Added p21 completion entry |
| `SESSION_HANDOFF.md` | This handoff |

## 5. Tests Performed
- Desktop: panel opens with hero section, fallback SVG icon shown (Wikimedia blocked in preview browser)
- Mobile (375x812): bottom-sheet panel works, hero capped at 150px height
- Light theme: hero section has appropriate lighter background
- Dark theme: hero section blends with surface
- RTL (Hebrew): panel layout correct, hero image not mirrored
- Zero console errors across all tests

## 6. Known Issues
- Claude Preview browser blocks Wikimedia URLs — cannot verify actual photo loading in preview (works in real browser)
- No duplicate PHOTO_MAP existed (was already removed in p15) — prompt's Phase A was a no-op

## 7. Recommended Next Steps
- Verify photo loading in a real browser (not Claude Preview)
- Test with nodes that have PHOTO_MAP entries to confirm fade-in transition

---

# Session Handoff — 2026-03-15 (p23 — DNA Similarity Calculator)

**Status: done**
**Branch:** `claude/crazy-villani`

### index.html
- **HTML**: DNA Compare button (`#btn-dna-calc`), modal panel (`#dna-panel`) with species selectors, search overlay, results display, 4 quick presets
- **CSS**: ~130 lines — modal styling, species slots, DNA bar, percentage display, badges, mobile responsive, dark/light theme
- **JS**: ~120 lines — `openDnaCalc()`, `closeDnaCalc()`, `dnaPreset()`, search integration via `searchEntities()`, animated counter, Escape key handling, backdrop click close
- **applyI18n()**: 10 new DNA calculator entries

### js/uiData.js
- 13 new i18n keys per language (EN/HE/RU)

## 3. Known Issues / Follow-up
- Some tree nodes use group IDs rather than species IDs — the calculator works with any node
- The preset "You & a Banana" compares against "Flowering Plants" (`angiosperms`) since there's no banana-plant node
- Hebrew RTL and Russian not visually verified
- Mobile viewport not tested

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
