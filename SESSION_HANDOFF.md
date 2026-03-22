# Session Handoff — 2026-03-21 (Mammal Data Upgrade to Homo Sapiens Parity)

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

# Previous Session Handoff — 2026-03-21 (Hominin Pill Chips & Deep Dive Removal)

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

