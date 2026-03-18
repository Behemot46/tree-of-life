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

## 3. Key Decisions
- Used native `<details>/<summary>` for collapsible sections (zero JS needed, accessible by default)
- Radar chart only appears when node has tags matching 3+ different trait dimensions
- Sub-groups section uses `navigateTo()` for click handling — triggers tree navigation + panel update
- ENRICHMENT altFacts + links moved into Evolutionary Context section (was standalone before)
- Hominin data (brain volume, DNA legacy, fossil sites) also inside Evolutionary Context

## 4. What's Left / Next Steps
- p22 partially addressed — could add more infographics (size comparisons, range maps)
- Radar chart coverage could be expanded with more tag→dimension mappings
- Panel modularization opportunity remains (large template string)

---

# Session Handoff — 2026-03-18 (p25 — WCAG 2.1 AA Accessibility Overhaul)

**Status: done**
**Branch:** `claude/funny-chatterjee`

## 1. Session Goal
Add comprehensive WCAG 2.1 AA accessibility support: keyboard navigation, ARIA landmarks, screen reader support, focus management, and reduced motion.

## 2. What I Changed

### index.html — CSS Accessibility Block
- **Skip-link**: styled fixed-position link, hidden off-screen, appears on focus (`top:0`)
- **Focus-visible rings**: 2px solid outlines on all interactive elements (buttons, legend rows, theme toggle, etc.)
- **SVG node focus**: stroke-based focus ring (CSS outline doesn't work on SVG)
- **Search keyboard highlight**: `.sr-item.a11y-active` class for arrow-key navigation
- **Reduced motion**: `@media(prefers-reduced-motion:reduce)` disables all animations, particles, splash transition, panel animations
- **Screen reader utility**: `.sr-only` class for visually-hidden live region

### index.html — HTML Structure
- **Skip link**: `<a href="#canvas-wrap" class="skip-link">` before splash
- **Live region**: `<div aria-live="polite" id="a11y-announce">` for screen reader announcements
- **ARIA roles**: `role="tree"` on SVG, `role="dialog" aria-modal="true"` on panel and hominin view
- **Legend keyboard access**: `tabindex="0" role="button"` on all `.leg-row` elements
- **Canvas wrap**: `tabindex="-1"` for skip-link target; SVG gets `tabindex="0"` for keyboard focus

### js/uiData.js — i18n Accessibility Keys (EN/HE/RU)
- Added keys: `a11y_skip`, `a11y_tree`, `a11y_panel`, `a11y_hominin_view`, `a11y_show_all`
- Merged with upstream keys: `skip_to_tree`, `a11y_tree_label`, `a11y_panel_label`, `a11y_hominin_label`, `a11y_dna_label`, `a11y_breadcrumb`

## 3. Merge Resolution
- Resolved 5 conflicts in `index.html` and 3 conflicts in `js/uiData.js`
- Kept all upstream features (new translation keys, legend `tabindex`/`role`, Show All button with ID) alongside all branch a11y additions

---

# Session Handoff — 2026-03-16 (p22 — Rich Data Panels & Infographics, merge update)

**Status: done**
**Branch:** `claude/confident-haslett`

---

# Session Handoff — 2026-03-15 (p27 — i18n Completeness)

**Status: done**
**Branch:** `claude/suspicious-murdock`
**PR:** https://github.com/Behemot46/tree-of-life/pull/69

## 1. Session Goal
Translate all remaining hardcoded English strings in the UI to Hebrew (HE) and Russian (RU), achieving full trilingual coverage.

## 2. What I Changed

### js/uiData.js — 25 new translation keys (EN/HE/RU)
- Toggle buttons: `hide_extinct`, `show_extinct`, `btn_hominins`, `show_all`
- Node badge: `explore_badge`
- Photo credit: `photo_credit`
- Section headers: `did_you_know`, `did_you_know_q`, `learn_more`, `brain_volume`, `dna_legacy`, `fossil_sites`
- Labels: `lbl_neanderthal`, `lbl_denisovan`
- Panel buttons: `hominin_deep_dive`, `panel_close`, `panel_back`
- DNA calculator: `dna_source_prefix`, `dna_vs`
- Time units: `unit_ma_ago`, `unit_mya`
- Chrome: `loading_init`, `footer_text`, `shortcut_hint`

### index.html — Hardcoded strings → t() calls
- `renderPanelContent()`: all section headers, labels, buttons now use `t()`
- `buildHomininSection()`: brain volume, DNA legacy, Neanderthal/Denisovan labels, fossil sites translated
- `fetchWikiPhoto()`: credit string uses `t('photo_credit')`
- `applyI18n()`: updated to use `i-leg-show-all` ID (from main's a11y refactor)
- Extinct toggle, loading screen, footer, shortcut hint all translated

---

# Session Handoff — 2026-03-15 (p22 — Rich Data Panels & Infographics)

**Status: done**
**Branch:** `claude/charming-einstein`

---

# Session Handoff — 2026-03-15 (p23 — DNA Similarity Calculator)

**Status: done**
**Branch:** `claude/crazy-villani`

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
