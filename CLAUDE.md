# CLAUDE.md — Tree of Life Project Guide

## Project Overview

**Tree of Life** is an interactive, browser-based phylogenetic visualization of 3.8 billion years of evolutionary history. Users can explore the tree of life, expand taxonomic nodes, search for species, and view detailed information panels with photos, Wikipedia summaries, and conservation status data.

- **Tech stack:** Vanilla JavaScript (ES6+ modules via IIFE pattern), D3.js (CDN), HTML5, CSS3
- **No build step** — open `index.html` directly or use `node serve.js`
- **No package manager** — zero npm dependencies; D3.js loaded from CDN
- **Deployment:** GitHub Pages via `.github/workflows/deploy.yml` (auto-deploys on push to `master`)

---

## Repository Structure

```
tree-of-life/
├── index.html          # Main SPA — markup, inline <style>, inline <script> (all rendering logic)
├── serve.js            # Local dev server (port 5555): node serve.js
├── assets/
│   └── placeholder.svg # Fallback image when taxon photo is unavailable
└── js/
    ├── treeData.js     # TREE object — full phylogenetic tree data (~47 species/clades)
    ├── speciesData.js  # PHOTO_MAP, WIKI_TITLES — species photos and Wikipedia mappings
    ├── uiData.js       # UI translations, i18n keys (EN/HE/RU)
    ├── main.js         # (Legacy) App orchestrator — not actively used by App A
    ├── api.js          # (Legacy) Data layer — OTL/Wikipedia/iNaturalist APIs + LRU cache
    ├── tree.js         # (Legacy) D3.js tree renderer
    ├── panel.js        # (Legacy) Detail panel
    ├── search.js       # (Legacy) Autocomplete search
    ├── timeline.js     # (Legacy) Geological timeline bar
    └── i18n.js         # (Legacy) i18n module
```

---

## Running Locally

```bash
node serve.js          # serves on http://localhost:5555
```

No install step needed. Open `http://localhost:5555` in a browser. Alternatively, open `index.html` directly — all external resources load from CDN.

---

## Architecture & Module Conventions

### Module Pattern

Every JS module uses the **IIFE (Immediately Invoked Function Expression)** pattern with an explicit public API:

```js
const ModuleName = (() => {
  // private state and helpers

  function publicMethod() { ... }

  return { publicMethod, anotherPublic };
})();
```

Modules are referenced globally (e.g., `Tree.init()`, `Panel.open()`). There is no ES module `import`/`export` syntax — all scripts are loaded via `<script src="...">` tags in `index.html`.

### Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| `main.js` | App init, inter-module wiring, theme/language switching, "Discover" feature |
| `api.js` | All external API calls; LRU cache (600 items); hardcoded `INITIAL_TREE` seed data |
| `tree.js` | D3.js SVG rendering; radial and cladogram layouts; zoom/pan; minimap |
| `panel.js` | Right-side detail panel; tabs; photo gallery; Wikipedia/iNaturalist data display |
| `search.js` | Debounced autocomplete (280 ms); keyboard navigation (↑↓ Enter Escape) |
| `timeline.js` | Geological eons/periods bar; extinction event markers |
| `i18n.js` | Translation strings; `t('key')` helper; RTL support for Hebrew; LocalStorage persistence |

### Naming Conventions

- **Modules:** PascalCase (`Tree`, `Panel`, `API`, `I18n`)
- **Functions/variables:** camelCase
- **HTML IDs:** kebab-case (`#tree-container`, `#search-input`, `#panel`)
- **Data attributes:** `data-theme`, `data-tab`, `data-lang`

---

## Data & APIs

All APIs are public, require no API keys, and allow CORS from browsers.

| API | Used For | Key Functions |
|-----|----------|---------------|
| [Open Tree of Life](https://opentreeoflife.github.io/otol-api-documentation/) | Taxonomy, children, lineage | `getChildren`, `searchTaxa` |
| [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) | Species summaries and page images | `getWikiSummary` |
| [iNaturalist API](https://api.inaturalist.org/v1/docs/) | Photos, conservation status | `getINatPhotos`, `getINatTaxon` |

**Caching:** `api.js` implements an LRU cache (max 600 entries) to avoid redundant network requests during a session.

**Seed data:** The hardcoded `INITIAL_TREE` constant in `api.js` pre-loads the top 4 levels (Life → Domains → major kingdoms) so the tree renders instantly without an API call.

### Node Data Shape

```js
{
  id: "ott93302",          // Open Tree of Life OTT ID (string)
  name: "Life",            // Scientific name
  common: "Life",          // Common/vernacular name
  ott_id: 93302,           // Numeric OTT ID
  rank: "no rank",         // Taxonomic rank
  color: "#4a9e5c",        // Display color
  num_tips: 3000000,       // Estimated number of descendant species
  divergence_mya: 3800,    // Estimated divergence (million years ago)
  children: [...],         // Loaded children (null if not yet expanded)
  _children: [],           // Placeholder indicating expandable (empty = leaf)
}
```

---

## Styling & Theming

### CSS Architecture

- **CSS custom properties** (variables) control all colors — defined in `:root` (dark theme default) and `[data-theme="light"]`
- `data-theme` attribute on `<html>` controls the active theme
- Theme preference persisted in `localStorage` key `theme`
- Glassmorphism effects (`backdrop-filter: blur`) used in panels and controls

### Key CSS Variables

```css
--bg            /* Main background */
--surface       /* Card/panel surfaces */
--text          /* Primary text */
--parchment     /* Secondary text */
--gold          /* Primary accent */
--teal          /* Secondary accent */
--terra         /* Tertiary accent */
--sage          /* Quaternary accent */
```

### Domain Colors (hardcoded in tree.js and api.js)

| Domain | Color |
|--------|-------|
| Bacteria | `#e8a838` |
| Archaea | `#9b59b6` |
| Plants | `#27ae60` |
| Fungi | `#e67e22` |
| Animals | `#2980b9` |
| Default | `#4a9e5c` |

### Inline Styles in index.html

All CSS lives in the `<style>` block inside `index.html`'s `<head>`. There is no external stylesheet — `style.css` was removed as dead code. When modifying styles, edit the inline `<style>` block in `index.html`.

---

## Internationalization (i18n)

- Supported languages: **English** (`en`), **Hebrew** (`he`, RTL), **Russian** (`ru`)
- Use `I18n.t('key')` to get a translated string
- Add new translation strings to all three language objects in `i18n.js`
- Language preference stored in `localStorage` key `lang`
- Hebrew triggers `dir="rtl"` on `<html>`; CSS uses `[dir="rtl"]` selectors for layout mirroring

---

## Tree Visualization (D3.js)

### Layouts

- **Radial** (default): circular dendrogram, root at center
- **Cladogram**: horizontal left-to-right tree

Toggle via UI button; layout stored in module state, not persisted.

### Node Interaction

- **Click** unexpanded node → fetches children from API, animates expansion
- **Click** expanded node → collapses subtree
- **Click** node → opens detail panel (`Panel.open(node)`)
- Node size = logarithmic scale of `num_tips`
- Emoji icons for major taxa rendered as SVG `<text>` nodes

### Key D3 Patterns

- `d3.cluster()` for layout
- `d3.zoom()` for pan/zoom; zoom state preserved across re-renders
- `d3.linkRadial()` / `d3.linkHorizontal()` for edges
- Transitions with `d3.transition().duration(600)`
- Minimap: separate small SVG rendering full tree at reduced scale

---

## Known Constraints & Important Notes

1. **No tests** — the project currently has no test suite. Verify changes by running locally and testing in browser.
2. **No linter/formatter config** — maintain consistent 2-space indentation and existing style.
3. **index.html is large** (~1900 lines) due to embedded CSS. Be careful with edits; search for context before modifying.
4. **Global module scope** — all modules (`Tree`, `Panel`, `API`, etc.) are globals. Do not shadow these names or use `const`/`let` at the same scope level in `index.html` scripts.
5. **D3.js version** — loaded from CDN; check the CDN link in `index.html` for the version before using D3 APIs.
6. **CORS** — all APIs permit browser-side calls. Do not add a server proxy unless a new API requires it.
7. **No TypeScript** — the codebase is plain JavaScript. Do not introduce TypeScript without broader agreement.

---

## Development Workflow

### Making Changes

1. Edit files directly — no build step required
2. Test in browser at `http://localhost:5555` (run `node serve.js`)
3. Edit CSS in `index.html`'s inline `<style>` block (no external stylesheet)
4. Verify all three languages (`?lang=en`, `?lang=he`, `?lang=ru`) if touching UI text

### Adding a New Module

1. Create `js/newmodule.js` following the IIFE pattern
2. Add `<script src="js/newmodule.js"></script>` to `index.html` before `main.js`
3. Wire it in `main.js`

### Adding Translations

1. Add key to all three language objects in `i18n.js`
2. Use `I18n.t('new_key')` in the relevant module

### Deployment

Push to `master` → GitHub Actions automatically deploys to GitHub Pages. No manual steps needed.

---

## Git Conventions

- Descriptive commit messages (imperative mood: "Add ...", "Fix ...", "Update ...")
- Work on feature branches; merge to `master` for deployment
- No commit hooks or pre-push checks configured
