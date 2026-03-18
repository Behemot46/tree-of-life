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

## 1. Session Goal
Enhance the species detail panel with richer data, larger fonts, collapsible sections, and inline mini-infographics.

## 2. What I Changed

### index.html — CSS (~45 lines added)
- **Collapsible sections**: `.panel-section`, `.panel-section-header`, `.panel-section-body` with smooth max-height transition and rotating chevron
- **Timeline bar**: `.panel-timeline`, `.panel-timeline-track`, `.panel-timeline-marker`, `.panel-timeline-labels` for inline SVG timeline
- **Radar chart**: `.panel-radar` container for SVG spider charts
- **Enrichment cards**: `.panel-alt-fact` with accent left-border styling
- **Link pills**: `.panel-link-pill` with hover state (accent bg + white text)
- **RTL support**: chevron rotation direction for `[dir="rtl"]`

### index.html — JS (`renderPanelContent()` rewritten, 3 new helper functions)

**New helper functions:**
- `_buildTimelineBar(node)` — horizontal SVG timeline bar showing when species appeared relative to 3.8 Bya (LUCA). Marker dot + fill + labels at proportional position
- `_buildRadarChart(node)` — SVG spider/radar chart (140x140) for species with ≥3 numeric facts. Extracts numeric values from facts grid, plots polygon with axes and labels
- `_panelSection(icon, title, content, collapsed)` — reusable collapsible section builder with header, chevron, and body

**Panel structure reorganized into 4 collapsible sections:**
1. **Overview** (always open): desc + fun fact + detail + tip fact
2. **Key Facts** (always open): facts grid (JetBrains Mono values) + radar chart + trait tags
3. **Evolutionary Context** (auto-collapsed if >3 alt facts): timeline bar + enrichment alt-facts cards + link pills
4. **Hominin Data** (always open, if applicable): brain volume, capabilities, DNA legacy, fossil sites

**Typography upgrades:**
- Species name: 22px → 26px, font-weight 700 → 800
- Latin name: 13px → 15px
- Body text (desc): 14px → 15px, line-height 1.7 → 1.8
- Detail text: 13px → 14px, line-height 1.7 → 1.8
- Facts values: 13px → 14px, `font-family: 'JetBrains Mono', monospace`
- Era line: 12px → 13px, added colored domain dot (8px circle)
- Section headers: 11px uppercase with 0.1em letter-spacing
- Hominin brain volume/DNA values: JetBrains Mono font

**Back button fix:**
- Changed selector from `[style*="padding:20px"]` to `.panel-content-scroll` for more reliable back button injection

## 3. Files Touched
| File | Changes |
|------|---------|
| `index.html` | CSS (45 lines), JS (3 helper functions + rewritten renderPanelContent) |
| `PROJECT_PROGRESS.md` | Added p22 to completed table, marked Done |
| `SESSION_HANDOFF.md` | This file |

## 4. Panel Section Architecture
```
Panel
├── Hero image (16:9, unchanged)
├── Lineage badge (Human Lineage / Great Apes)
├── Title block (name + extinct badge + latin + era with colored dot)
├── [Overview] section (collapsible)
│   ├── Description (15px)
│   ├── Fun fact card
│   ├── Detail paragraph (14px)
│   └── Tip fact
├── [Key Facts] section (collapsible)
│   ├── Facts grid (JetBrains Mono values)
│   ├── Radar chart (if ≥3 numeric facts)
│   └── Trait tags
├── [Evolutionary Context] section (collapsible)
│   ├── Timeline position bar (SVG)
│   ├── Enrichment alt-facts cards
│   └── External link pills
├── [Hominin Data] section (if applicable, collapsible)
│   ├── Brain volume bar
│   ├── Capabilities (tools/fire/language)
│   ├── DNA legacy bars
│   └── Fossil sites
├── Hominin Deep Dive button (if applicable)
└── Close button
```

## 5. Infographics Implemented
1. **Timeline position bar** — every species with `appeared` value gets a horizontal bar showing position in 3.8 Bya history
2. **Trait radar chart** — species with ≥3 numeric facts get a spider chart with labeled axes
3. Size comparison was skipped (insufficient body-size data in current tree nodes)

## 6. Tests Performed
- Panel renders with larger text, collapsible sections (fungi, bacteria, h_erectus tested)
- Sections collapse/expand on click with chevron rotation
- Timeline bar shows correct proportional position
- Key Facts values use JetBrains Mono
- Enrichment alt-facts render as styled cards with accent border
- Link pills render with hover effect
- Mobile bottom-sheet panel works
- Zero console errors
- Dark/light theme both functional

## 7. Not Tested
- Hebrew RTL section layout (CSS added but not visually verified)
- Russian language rendering
- Radar chart rendering (needs species with ≥3 numeric facts visible)
- Desktop right-panel view (preview browser kept triggering mobile bottom-sheet)

## 8. Known Issues
- Desktop preview testing was difficult (SVG click handler closes panel on eval-triggered opens)
- The mobile swipe-to-close can trigger when scrolling the panel content (pre-existing issue)

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
