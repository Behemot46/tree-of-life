# Architecture

## Audit Date
2026-03-10

## Rendering Engine
**D3.js v7** via CDN — SVG-based collapsible tree layout.

- `d3.tree()` for hierarchical layout
- `d3.zoom()` for pan/zoom (wheel + touch)
- Nodes rendered as SVG `<circle>` + `<text>` elements
- Branches as SVG `<path>` with cubic bezier curves
- Tree loaded in `js/tree.js`, initialized via `Tree.init('#tree-container')`

## State Management
No global state framework. Module-level state per IIFE:

- **Tree state** (`js/tree.js`): `root`, `svg`, `g`, `zoom` — D3 tree internals
- **Panel state** (`js/panel.js`): currently displayed node, active tab
- **Language state** (`js/i18n.js`): `currentLang()` reads from `localStorage` (`tol-lang`)
- **Theme state** (`js/main.js`): reads/writes `localStorage` (`tol-theme`), sets `data-theme` on `<html>`
- **API cache** (`js/api.js`): LRU Map, max 600 entries, shared across all API calls

## File Structure

```
/
├── index.html              # Monolithic HTML: all markup + inline data + script tags
├── style.css               # All CSS (757 lines) — variables, layout, dark/light themes
├── serve.js                # Minimal Node local dev server (optional)
├── .gitignore
├── assets/
│   └── placeholder.svg     # Fallback image for missing species photos
├── js/
│   ├── api.js              # Data layer: OpenTreeOfLife, Wikipedia, iNaturalist APIs + INITIAL_TREE data
│   ├── i18n.js             # Translation engine: EN/HE/RU + RTL support
│   ├── main.js             # Orchestrator: wires all modules, handles events
│   ├── panel.js            # Side panel: species detail tabs (Info, Evolution, Photos, Map)
│   ├── search.js           # Search bar: debounced autocomplete via OTL API
│   ├── timeline.js         # Geological timeline bar at bottom of viewport
│   └── tree.js             # D3 tree: render, zoom, expand/collapse, node selection
└── .github/
    └── workflows/
        ├── deploy.yml          # GitHub Pages deployment (push to main)
        └── deploy-check.yml    # Validation: confirms required files exist
```

## Key Technical Decisions

### 1. Vanilla JS + D3 only (no framework)
**Rationale:** GitHub Pages serves static files. No build step = zero DevOps friction. D3 v7 handles all rendering needs. The tradeoff is manual DOM wiring in `main.js` rather than component reactivity.

### 2. Hardcoded initial tree (INITIAL_TREE in api.js)
**Rationale:** The OTL API is slow (~500ms per call). Hardcoding the top 4 levels of the tree allows instant display. Deeper nodes load on demand when a user expands a branch (`_children: []` signals expandable).

### 3. API layer with LRU cache
**Rationale:** Three external APIs are used (OpenTreeOfLife, Wikipedia, iNaturalist). The 600-entry LRU cache prevents redundant calls during a session. All calls are CORS-friendly; no proxy or API key required.

### 4. CSS custom properties for theming
**Rationale:** `data-theme="dark|light"` on `<html>` switches all colors via CSS variables. No JS color logic in rendering code.

### 5. i18n via data attributes + JS translation table
**Rationale:** `data-i18n` attributes on HTML elements, resolved by `I18n.setLang()`. Hebrew triggers `dir="rtl"` on `<html>`. Translation keys live in `js/i18n.js`.

## Known Risk Flags

1. **index.html size (1886 lines):** All markup, Hominin data, and script imports live here. This will become hard to maintain as data grows. Prompt 1 should extract data to separate JS files.

2. **No error boundary on tree render:** If D3 layout fails (malformed data), the tree silently breaks with no user feedback.

3. **External API dependency at runtime:** The site requires live internet to show species details. Offline or API-down scenarios show empty panels.

4. **No input sanitization on search:** The search input is passed directly to the OTL autocomplete API. Low risk (read-only API), but worth noting.

5. **Single CSS file:** At 757 lines with mixed layout + theming + component styles, this will grow unwieldy.

## Gap Inventory

Each gap is numbered and tagged to the prompt that addresses it.

| # | Gap | Prompt |
|---|-----|--------|
| 1 | Tree data and hominin data embedded in index.html — extract to `js/treeData.js` and `js/homininsData.js` | Prompt 1 |
| 2 | No fuzzy/Hebrew search support | Prompt 2 |
| 3 | Hominin comparison section not connected to main tree data | Prompt 3 |
| 4 | Timeline not interactive (no click-to-zoom) | Prompt 4 |
| 5 | No offline fallback or loading state for API failures | Prompt 5 |
| 6 | No species image credits/attribution displayed in panel | Prompt 6 |
| 7 | CSS not split by component | Future |
