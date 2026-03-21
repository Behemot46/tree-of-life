# Session Handoff — 2026-03-21 (Hominin Pill Chips & Deep Dive Removal)

**Status: done**
**Branch:** `claude/intelligent-payne`
**PR:** #106

## 1. Session Goal
Replace circular SVG nodes for the 4 hominin sub-categories with styled pill/chip buttons. Make species panels show full deep-dive data inline, eliminating the separate Hominin Deep Dive overlay. Preserve compare mode as standalone.

## 2. What I Changed

### index.html — SVG Rendering (`render()`)
- **Pill chip rendering**: Group nodes (`group-proto`, `group-australopith`, `group-paranthropus`, `group-homo`) now render as `<foreignObject>` + HTML `<div>` styled as rounded pills with group color border/background, icon + name + collapse indicator (`+`/`−`)
- **Left-click toggles collapse** (expand/collapse children); double-click opens group info panel; right-click opens panel
- **Increased group node `r: 30`** (was 9-11) so layout engine gives pills enough space
- Normal circle/icon/photo/collapse-dot/label rendering skipped for group chips

### index.html — Panel (`renderPanelContent()`)
- **Compare Species button** added for hominin nodes (replaces Deep Dive button)
- Hominin data (brain volume, DNA legacy, fossil sites, capabilities) already rendered by main's "Evolutionary Context" collapsible section

### index.html — Removed Hominin Deep Dive Overlay
- **HTML**: Removed `<div id="hominin-view">` block (header, filters, timeline, detail panel)
- **CSS**: Removed ~75 lines of `#hominin-view`, `#hom-*`, `.hom-*`, `.hp-*`, `.hs-*` rules + light theme + RTL + responsive variants
- **JS**: Removed `openHomininView()`, `renderHominins()`, `showHominDetail()`, filter click listeners, `currentHomFilter`, `selectedHominin` variables, swipe-to-close handler

### index.html — Compare Mode (standalone)
- Preserved `showComparePanel()`, `closeCompare()` as standalone overlay
- New `startCompareFromPanel(nodeId)` — triggered from panel button, shows floating banner, intercepts node clicks to collect 2-4 species
- Combined a11y `showMainPanel` wrapper with compare mode interceptor (merged from main's accessibility wrapper)

### index.html — Navigation
- Floating "Human Evolution" button repurposed: `navigateTo('hominini')` instead of `openHomininView()`
- Nav stack simplified: removed `'hominin'` and `'hominin-detail'` state types
- Removed hominin-view close logic from `navHome()`, `restoreNavState()`, Escape handler

### index.html — i18n
- Removed `set()` calls for deleted filter chip element IDs
- Kept compare panel i18n (`i-compare-title`, `i-compare-back`)

## 3. Merge Resolution
- Merged `origin/main` (16 conflicts resolved)
- Main had added: CSS-class-based panel template, a11y wrapper, primate cards, glassmorphism, new panel sections
- Combined a11y + compare wrappers into single `_origShowMainPanel` chain
- Re-added Compare Species button to main's new panel layout

## 4. Previous Session
- Timeline Bar Complete Overhaul (PR #102, `claude/zen-burnell`)

---

