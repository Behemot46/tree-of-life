# Session Handoff — 2026-03-20 (Timeline Bar Complete Overhaul)

**Status: done**
**Branch:** `claude/zen-burnell`
**PR:** #102

## 1. Session Goal
Complete overhaul of the bottom timeline bar — replace the minimal 4px gradient slider with a modern, geologically-accurate segmented timeline with rich interactivity.

## 2. What I Changed

### js/uiData.js
- **TIMELINE_SEGMENTS**: New constant with 20 geological periods (Hadean → Quaternary), each with id, min/max Ma, dark/light theme colors, and i18n nameKey
- **TRANSLATIONS**: Added ~20 segment name keys to all 3 language objects (en/he/ru)

### index.html — HTML
- Replaced old timeline structure with new layout: info bar, canvas sparkline, segmented track with custom thumb, controls row with presets + playback + speed buttons, extinction popover

### index.html — CSS
- **Glassmorphism container**: `backdrop-filter:blur(16px) saturate(180%)` replacing gradient fade
- **Segmented era track**: 14px height (was 4px), colored geological period segments
- **Custom slider thumb**: Visible draggable handle with grab cursor, accent glow (replaces invisible range input)
- **Extinction markers**: Emoji icons (💀/☠️/☄️) with severity-scaled sizing, click-to-show popover
- **Preset chips with icons**: 🧬 LUCA, 💨 O₂, 🦐 Cambrian, 🦕 Dinosaurs, ☄️ K-Pg, 🌍 Now
- **Speed control buttons**: 0.5x / 1x / 2x pill-style group
- **RTL overrides**, **mobile responsive**, **light theme** variants

### index.html — JS (~400 lines rewritten)
- **`buildEraSegments()`**: Renders colored period divs with segment labels
- **`buildDensitySparkline()`**: Canvas histogram of species per 50Ma bucket
- **`initThumbDrag()`**: Pointer-event-based drag, click-on-track jump, keyboard (arrows ±20Ma, Shift ±100Ma, Space play/pause)
- **`initSpeedButtons()`**: Speed control handlers with active state
- **`showExtinctionPopover()`**: Click-to-show popover with dismiss-on-outside
- **`updateThumbPosition(mya)`**: Syncs thumb left% and aria-valuenow
- **`updateEraTimeRange(mya)`**: Shows Ga or Ma range for current segment
- **`toggleEraPlay()`**: Reversed direction (3800→0, forward through time), eased animation (quadratic), speed-aware
- **Preset icons**: Emoji-enhanced chips via `PRESET_ICONS` map
- **Extinction icons**: Severity-scaled markers via `EXTINCTION_ICONS` map

## 3. Track Direction
Left = LUCA (3800 Ma), Right = Present (0 Ma). Thumb at left=0% is 3800Ma, left=100% is 0Ma.

## 4. Previous Session
- Tree UX Improvements (PR #91, `claude/magical-chebyshev`)

---

# Session Handoff — 2026-03-18 (Tree UX Improvements)

**Status: done**
**Branch:** `claude/magical-chebyshev`
**PR:** #91

## 1. Session Goal
Fix node click behavior, branch structure, and visual quality issues.

## 2. What I Changed

### js/renderer.js
- **Click behavior**: Left-click on branch nodes toggles expand/collapse (was panel-only). Left-click on leaf nodes opens info panel. Double-click any node always opens panel. Right-click still toggles as secondary.
- **Branch styling**: stroke-width min 2px (was 1px), max 4.5px (was 3px). Opacity floor 0.4 (was 0.25). Added round stroke-linecap/linejoin attributes.
- **Animation fix**: Entrance animation (opacity:0 → 1, scale:0.2 → 1) only runs on initial page load. On expand/collapse, newly-visible nodes appear instantly via `window._initialAnimDone` flag.

### js/uiData.js
- **DEPTH_R**: Increased ~40% — `[0,420,780,1120,1430,1720,2000,2270,2520,2760,2980]` (was `[0,300,560,800,1020,1230,1430,1620,1800,1970,2130]`)

### js/core.js
- **Fallback depth gap**: 120 → 170 for nodes beyond DEPTH_R array
- **`_initialAnimDone` flag**: Set `true` after `animateTreeEntrance()` completes (~1.5s)

## 3. Previous Session
- p24: Code extraction (PR #90, merged)
- p33: AI Species Illustrations (`claude/hungry-mclean`)

---

# Session Handoff — 2026-03-18 (p33 — AI Species Illustrations)

**Status: done**
**Branch:** `claude/hungry-mclean`

## 1. Session Goal
Generate AI species illustrations via Canva MCP, save as optimized .webp in assets/species/, update ImageLoader to prefer local images over PHOTO_MAP.

## 2. What I Changed

### assets/species/ (10 new .webp files, ~330KB total)
- Generated 10 species illustrations via Canva MCP `generate-design` tool (instagram_post format)
- Exported as 512x512 PNG, converted to WebP via Pillow (quality=82, 89-95% size reduction)
- Species covered: **luca, bacteria, archaea, eukaryota, fungi, plantae, animalia, vertebrates, mammals, primates**

### js/imageLoader.js
- **Added GENERATED_IDS manifest**: Set of 10 node IDs with available local art — prevents 404s for species without generated images
- Integrated with main's format fallback (.webp → .png) and confirmedFormats cache

## 3. Why These Changes Were Made
- ImageLoader already had infrastructure for generated .webp images (`SPECIES_IMAGE_BASE`, `getGeneratedUrl()`) but no actual images existed in assets/species/
- The old priority (PHOTO_MAP first) meant local images would never be used for species that had PHOTO_MAP entries
- Without GENERATED_IDS manifest, the local-first approach would cause 130+ 404 requests on every page load for species without generated art

## 4. How to Add More Generated Images
1. Generate/create the image
2. Save as `assets/species/{node-id}.webp` (512x512, quality ~82)
3. Add the node ID to `GENERATED_IDS` set in `js/imageLoader.js`
4. That's it — ImageLoader will automatically prefer the local file

## 5. Canva MCP Quota
- Generated 10 out of planned 20 images before hitting Canva's daily quota limit
- Remaining targets: h_sapiens, cyanobacteria, octopus, shark, blue-whale, neanderthal, sequoia, coral, honey-bee, coelacanth
- These can be added in a follow-up session when quota resets

## 6. Tests Performed
- Zero console errors on page load
- All 10 generated species resolve to `source: "generated"` with local .webp URLs
- Non-generated species correctly skip to PHOTO_MAP (no wasted 404s)
- Tree renders with visible photo thumbnails on generated nodes
- Fallback chain works: generated → PHOTO_MAP → node.img → emoji

## 7. Not Tested
- Panel hero image display for generated species
- Mobile layout
- Hebrew/Russian language modes
- Light theme rendering of generated images

## 8. Known Issues
- Canva designs may include text overlays — future iterations should request cleaner image-only outputs
- Wikimedia URLs blocked by Claude Preview browser's ORB policy (pre-existing, not related to this change)
- 10/20 planned species completed due to Canva quota limit

---

# Session Handoff — 2026-03-18 (Scientific Modern Full Redesign)

**Status: done**
**Branch:** `claude/gracious-euler`
**PR:** https://github.com/Behemot46/tree-of-life/pull/88

## 1. Session Goal
Full visual redesign targeting a Scientific Modern aesthetic — 10 stages from design system foundation through accessibility.

## 2. What I Changed

### index.html (~490 lines changed)
- **Stage 1**: Complete `:root` and `[data-theme="light"]` overhaul — warm earth tones (gold #c8883a, sage #5b9a8b, terra #c45c4a), glassmorphism tokens, 3-level shadow system, spacing/typography scales, animation variables
- **Stage 2**: Glassmorphism on nav-btn, panel, search; shadow elevation; button `:active` scale(0.97)
- **Stage 3**: Enhanced node icons — 1.2x larger, 0.85 opacity, colored background circles, larger +/- expand badges
- **Stage 4**: Left-click expands/collapses branch nodes, left-click on leaves opens panel, double-click always opens panel, `smoothPanTo()` auto-pans to expanded children
- **Stage 5**: Sibling navigation (Prev/Next) in panel, "Lineage" button calls `traceLineage()`, breadcrumb always visible
- **Stage 6**: 30+ CSS classes extracted from inline `style=` in `renderPanelContent()` — `.panel-hero`, `.panel-body`, `.panel-facts-grid`, `.panel-fact-card`, `.panel-nav-btn`, `.panel-callout`, `.panel-tag`, `.panel-link`, `.badge-extinct`, `.panel-btn-primary`, `.panel-btn-close`, etc. 2-column facts card grid replaces alternating-row table.
- **Stage 7**: `buildHeroFallback()` renders large SVG silhouette (120px) on domain-colored radial gradient when no photo available
- **Stage 8**: Unified ~15 scattered CSS transitions to use `var(--transition-fast)` / `var(--transition-normal)`, added `prefers-reduced-motion` media query
- **Stage 9**: `:focus-visible` gold outline rings, `forced-colors` high contrast support, `role="treeitem"` + `aria-expanded` on all node SVG groups, `aria-live="polite"` on panel
- **Stage 10**: Fixed stale cyan `rgba(2,132,199,...)` in light theme tags, updated semantic color overrides to warm palette

### js/imageLoader.js (~37 lines changed)
- Inverted `getBestUrl()` priority: generated local images FIRST, PHOTO_MAP as fallback
- Updated `loadInto()` fallback chain: generated (.webp → .png) → PHOTO_MAP → node.img → emoji
- Added `onGenExhausted` handler for when both generated formats fail

## 3. New Functions
- `smoothPanTo(wx, wy)` — animated viewport pan using requestAnimationFrame
- `traceLineage(nodeId)` — expands all ancestors, highlights path, pans to node
- `buildHeroFallback(node)` — generates SVG silhouette hero with domain gradient

## 4. Known Issues / Next Steps
- No local AI-generated species images exist yet in `assets/species/` — the local-first system is ready but needs images generated from `IMAGE_PROMPTS`
- Panel template still uses some remaining inline styles for layout (flex containers) — further extraction possible
- Consider generating initial batch of ~20 species images for key nodes (LUCA, bacteria, archaea, eukaryota, fungi, plants, animals, etc.)

## 5. Files Modified
- `index.html` (CSS + JS)
- `js/imageLoader.js`

---

# Session Handoff — 2026-03-18 (p26 — Rich Data Panels & Visual Identity)

**Status: done**
**Branch:** `claude/nifty-moore`
**PR:** #86

## 1. Session Goal
Upgrade the species info panel with rich data presentation: collapsible sections, inline infographics (timeline bar, radar chart), sub-groups navigation, ENRICHMENT data rendering, and typography improvements.

## 2. What I Changed

### index.html — CSS (~30 lines added)
- `.p-collapse` — collapsible section styling using native `<details>/<summary>` with custom arrow rotation, hover states, border treatment
- `.p-timeline` — timeline bar with fill, marker, label, and era scale
- `.p-radar` — centered SVG radar chart container with label styling

### index.html — renderPanelContent() (rewritten, +281/-116 lines)
- **Hero image**: gradient overlay (`linear-gradient(transparent, rgba(0,0,0,0.6))`) at bottom for credit readability
- **Lineage badge**: now uses `node._hominData` presence instead of hardcoded ID list — correctly badges all 28 hominins
- **Timeline bar**: horizontal bar showing appeared Mya on 0–3800 scale with era markers (Present, 1Bya, 2Bya, 3.8Bya)
- **Collapsible sections**: 4 `<details class="p-collapse">` sections:
  - Overview (desc, funFact, detail, tipFact) — open by default
  - Key Facts (facts table, tags, radar chart) — open by default
  - Evolutionary Context (hominin data, altFacts, links) — open by default
  - Sub-groups (clickable children list) — collapsed by default
- **Trait radar chart**: SVG spider chart with 8 dimensions mapped via regex:
  - Complexity, Autotrophy, Mobility, Intelligence, Ecology, Resilience, Deep Time, Biotech
  - Shows for ~8 nodes that have 3+ matching trait categories
- **Sub-groups**: renders `node.children` as clickable list items with icon, name, latin, Mya
- **Typography**: 26px h2 headings, 15px body, `var(--font-mono)` for data values and era

---

# Session Handoff — 2026-03-18 (p25 — WCAG 2.1 AA Accessibility Overhaul)

**Status: done**
**Branch:** `claude/funny-chatterjee`

## 1. Session Goal
Add comprehensive WCAG 2.1 AA accessibility support: keyboard navigation, ARIA landmarks, screen reader support, focus management, and reduced motion.

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
