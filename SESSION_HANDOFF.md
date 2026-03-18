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
