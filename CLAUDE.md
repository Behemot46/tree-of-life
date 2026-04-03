# CLAUDE.md — Tree of Life Project Guide

## Project Overview

**Tree of Life** is an interactive, browser-based phylogenetic visualization of 3.8 billion years of evolutionary history. Users can explore the tree of life, expand taxonomic nodes, search for species, and view detailed information panels with photos, Wikipedia summaries, and conservation status data.

- **Tech stack:** Vanilla JavaScript, D3.js (CDN, not actively used yet), HTML5, CSS3
- **No build step** — open `index.html` directly or use `node serve.js`
- **No package manager** — zero npm dependencies; D3.js loaded from CDN
- **Deployment:** GitHub Pages via `.github/workflows/deploy.yml` (auto-deploys on push to `master`)

---

## Repository Structure

```
tree-of-life/
├── index.html           # SPA — pure HTML markup (~462 lines)
├── serve.js             # Local dev server (port 5555): node serve.js
├── css/                 # External stylesheets (10 files)
│   ├── variables.css    # CSS custom properties, reset, focus styles
│   ├── layout.css       # Header, search, breadcrumb, nav controls
│   ├── tree.css         # SVG tree rendering, node/branch styles
│   ├── timeline.css     # Era browser, extinction markers, playback
│   ├── panel.css        # Species detail panel, hero images, cards
│   ├── hominin.css      # Hominin deep-dive overlay, compare cards
│   ├── features.css     # Legend, zoom, tooltip, quiz, DNA, evo path, tours
│   ├── theme.css        # Light theme overrides, dark mode polish
│   ├── rtl.css          # Hebrew RTL layout overrides
│   └── responsive.css   # Mobile breakpoints, reduced motion, high contrast
├── assets/
│   ├── placeholder.svg  # Fallback image when taxon photo is unavailable
│   └── species/.gitkeep # Directory for future AI-generated species images
└── js/                  # All ES modules — single entry: app.js
    ├── # ── Data modules ──
    ├── data.js          # Barrel re-exports for widely-shared constants
    ├── treeData.js      # TREE object — full phylogenetic tree data
    ├── treeExpansion.js  # expandTree() — adds 300+ species with IUCN data
    ├── speciesData.js   # PHOTO_MAP, WIKI_TITLES, ENRICHMENT
    ├── uiData.js        # DEPTH_R, ERA_NAMES, EXTINCTIONS, TRANSLATIONS
    ├── factLibrary.js   # FACTS — random facts for discovery feature
    ├── imagePrompts.js  # AI image prompt library (unused)
    ├── imageLoader.js   # ImageLoader — fallback chain: generated → PHOTO_MAP → emoji
    ├── dnaSimilarity.js # DNA_KNOWN, estimateDnaSimilarity(), findLCA()
    ├── nodeIcons.js     # NODE_ICONS SVG paths + getIconGroup()
    ├── triviaData.js    # TRIVIA_QUESTIONS — 200+ quiz questions
    ├── primateData.js   # PRIMATE_DATA — taxonomy, genome, traits
    ├── geoData.js       # GEO_DATA + BRANCH_DATA — geographic data
    ├── mapPaths.js      # MAP_PATHS — continent outlines for mini-map
    ├── tours.js         # Guided tour engine (3 tours)
    ├── # ── Application modules ──
    ├── app.js           # Entry point — init(), window.* exposures, event listeners
    ├── state.js         # Shared mutable state object + constants
    ├── utils.js         # reducedMotion(), preprocess(), hominin helpers
    ├── layout.js        # layout(), layoutRadial/Cladogram/Chronological/Playback
    ├── zoom.js          # applyT(), smoothPanTo(), centerOnTree/Root, pointer handlers
    ├── renderer.js      # render(), branchPath(), scheduleRender()
    ├── navigation.js    # navStack, pushNav/navBack/navHome, breadcrumb, tooltip
    ├── search.js        # buildSearchIndex(), searchEntities(), fuzzy matching
    ├── timeline.js      # Era slider, extinction markers, presets, sparkline
    ├── panel.js         # renderPanelContent(), showMainPanel(), species cards
    ├── hominin.js       # buildHomininTree(), compare mode
    ├── dnaCalc.js       # DNA similarity calculator modal
    ├── evoPath.js       # Evolutionary path comparison tool
    ├── trivia.js        # Trivia quiz game
    ├── quiz.js          # Multiple-choice quiz mode
    ├── playback.js      # Time-lapse playback mode
    ├── theme.js         # t(), setLang(), applyI18n(), toggleTheme()
    └── engagement.js    # Toast notifications, idle timer, intro, particles
```

---

## Running Locally

```bash
node serve.js          # serves on http://localhost:5555
```

No install step needed. Open `http://localhost:5555` in a browser. Alternatively, open `index.html` directly — all external resources load from CDN.

---

## Architecture

### Modular Architecture

**CSS layer:** 10 external stylesheets in `css/` directory, loaded via `<link>` tags.

**Data layer:** 14 ES module files with explicit exports. Widely-shared constants re-exported via `js/data.js` barrel.

**Application layer:** 18 ES modules loaded via `<script type="module" src="js/app.js">`. No build step — native browser module support.

**Shared state:** All mutable state lives in `js/state.js` as a single exported `state` object. Modules import and mutate it directly.

**Dependency injection:** Cross-module calls use late-binding (`initXxxDeps()` functions) to avoid circular imports. `app.js` wires all dependencies at startup.

### Rendering

- **Library:** Pure vanilla JavaScript + SVG (no D3 layout algorithms)
- **Layout:** Custom `layout()` function computes `_x`, `_y` positions for each node
- **Zoom/Pan:** Manual transform `{x, y, s}` applied via `setAttribute('transform', ...)`
- **Node icons:** Photo thumbnails from `PHOTO_MAP` with emoji fallback

### Node Data Shape (in `treeData.js`)

```js
{
  id:        string,       // unique, e.g. 'luca', 'bacteria', 'humans'
  icon:      string,       // emoji
  color:     string,       // hex color
  r:         number,       // circle radius (8–26)
  appeared:  number,       // million years ago (Mya)
  name:      string,       // display name
  latin:     string,       // scientific name
  era:       string,       // human-readable era string
  desc:      string,       // description
  detail:    string,       // deeper detail paragraph
  facts:     [{l, v}],     // label/value pairs
  tags:      string[],     // trait chips
  children:  Node[]        // nested children (undefined = leaf)
}
```

### Naming Conventions

- **Functions/variables:** camelCase
- **HTML IDs:** kebab-case (`#tree-container`, `#search-input`, `#panel`)
- **Data attributes:** `data-theme`, `data-tab`, `data-lang`

---

## Styling & Theming

### CSS Architecture

- CSS lives in 10 external files in the `css/` directory, loaded via `<link>` tags
- Organized by concern: variables, layout, tree, timeline, panel, hominin, features, theme, rtl, responsive
- **CSS custom properties** control all colors — defined in `:root` (dark default) and `[data-theme="light"]`
- `data-theme` attribute on `<html>` controls the active theme
- Theme preference persisted in `localStorage` key `theme`

### Key CSS Variables

```css
--bg            /* Main background */
--surface       /* Card/panel surfaces */
--text          /* Primary text */
--parchment     /* Secondary text */
--gold          /* Primary accent */
--font-head     /* 'Inter', 'Heebo' — headings */
--font-body     /* 'Inter', 'Heebo' — body text */
--font-sans     /* 'Inter' — UI elements */
```

### Fonts

- **Inter** — all UI text, headings, labels
- **JetBrains Mono** — data values, monospaced displays
- **Heebo** — Hebrew and Cyrillic text support

---

## Internationalization (i18n)

- Supported languages: **English** (`en`), **Hebrew** (`he`, RTL), **Russian** (`ru`)
- Translations live in `TRANSLATIONS` object in `js/uiData.js`
- `t(key)` returns translated string, falls back to English
- `applyI18n()` imperatively sets `textContent` on element IDs
- Language preference stored in `localStorage` key `tol-lang`
- Hebrew triggers `dir="rtl"` on `<html>`; CSS uses `[dir="rtl"]` selectors

### Adding Translations

1. Add key to all three language objects in `js/uiData.js` `TRANSLATIONS`
2. Use `t('new_key')` in the rendering code in `index.html`

---

## Known Constraints & Important Notes

1. **No tests** — verify changes by running locally and testing in browser.
2. **No linter/formatter config** — maintain consistent 2-space indentation.
3. **index.html** is pure HTML markup (~462 lines). CSS is in `css/`, JS is in `js/`.
4. **ES modules everywhere** — all data and application files use `export`/`import`. No global `<script>` tags.
5. **D3.js** — loaded from CDN but not actively used by the current renderer.
6. **CORS** — all APIs permit browser-side calls. Do not add a server proxy unless needed.

---

## Development Workflow

### Making Changes

1. Edit files directly — no build step required
2. Test in browser at `http://localhost:5555` (run `node serve.js`)
3. Edit CSS in the appropriate file under `css/` (organized by concern)
4. Verify all three languages (`?lang=en`, `?lang=he`, `?lang=ru`) if touching UI text

### Adding a New Data Module

1. Create `js/newmodule.js` with `export const` declarations
2. Import it in consuming ES modules (e.g., `import { FOO } from './newmodule.js'`)
3. If widely shared (4+ consumers), add a re-export to `js/data.js`

### Deployment

Push to `master` → GitHub Actions automatically deploys to GitHub Pages. No manual steps needed.

---

## Git Conventions

- Descriptive commit messages (imperative mood: "Add ...", "Fix ...", "Update ...")
- Prefix: `feat:` / `fix:` / `style:` / `chore:` / `docs:` / `data:` / `perf:` / `a11y:`
- Work on feature branches; merge to `master` for deployment
- No commit hooks or pre-push checks configured
