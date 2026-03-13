# Project Progress — Tree of Life

## Completed Milestones

### p1 — Extract data to separate JS files (PR #38, merged)
- Extracted TREE to js/treeData.js, HOMININS/PHOTO_MAP etc to js/speciesData.js, TRANSLATIONS etc to js/uiData.js

### p2 — Fuzzy Multilingual Search (merged)
- Bigram fuzzy matching, TAXON_I18N dict, multilingual search index

### p3 — Main-Tree Hominin Lineage Access (PR #35, merged)
- 28 hominin species as first-class tree nodes in 4 groups

### p6 — Hominin Access Improvements (PR #39, merged)
- Floating "Human Evolution" button, golden pulsing ring on hominini node

### p7 — Visual Overhaul (merged with p6)
- Font migration, unified buttons, photo thumbnails, timeline fixes, contrast remediation

### p8 — Dead CSS Cleanup + style.css Consolidation (current)
- **style.css**: Removed all 758 lines of dead "App B" CSS targeting non-existent DOM (`.navbar`, `.app-container`, `.detail-panel`, `.loading-overlay`, `.timeline-container`, etc.). Replaced with minimal stub + `.sr-only` utility.
- **index.html inline `<style>`**: Removed ~20 dead rules:
  - `[data-theme="dark"] .search-result-item:hover`, `.search-result-name`, `.search-result-meta` (never in DOM)
  - `[data-theme="dark"] kbd` (overridden by inline styles)
  - `[data-theme="dark"] #loader` (element doesn't exist)
  - `[data-theme="light"] .tip-fact` (class never used)
  - `[lang="he"] #info-panel`, `[lang="he"] .panel__fun-fact` (elements don't exist)
  - `[lang="he"] .header` (class doesn't exist, only `#header` ID)
  - `@media` rules for `#sidebar`, `.sidebar`, `#info-panel`, `.panel`, `.canvas-wrap`, `#timeline-bar`, `.timeline-container`, `#compare-content`
- **serve.js**: Added `process.env.PORT` support for worktree compatibility
- **Net CSS reduction**: ~735 lines removed from style.css, ~25 lines removed from inline CSS
- **Zero functional risk**: all removed rules targeted non-existent DOM elements

## Remaining Milestones

### Panel Modularization (next priority)
- `showMainPanel()` is a massive template literal (~200 lines)
- Break into helper functions: renderPanelHeader(), renderFacts(), renderHomininBlock(), etc.

### Mobile Responsiveness
- Controls overlap on narrow screens
- Panel doesn't adapt well below ~500px
- Timeline ticks crowd together

### Other Known Gaps
- Timeline not fully interactive (no era highlighting/filtering)
- No offline fallback for API failures
- External JS modules (tree.js, panel.js, search.js, timeline.js) exist but are NOT loaded — all logic is inline in index.html
