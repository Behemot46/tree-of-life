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
├── index.html          # Main SPA — markup, inline <style>, inline <script> (all rendering logic)
├── serve.js            # Local dev server (port 5555): node serve.js
├── assets/
│   └── placeholder.svg # Fallback image when taxon photo is unavailable
└── js/
    ├── treeData.js     # TREE object — full phylogenetic tree data (~130+ nodes)
    ├── speciesData.js  # PHOTO_MAP, WIKI_TITLES, HOMININS, NODE_EXTRAS, HOMININ_ID_ALIASES
    └── uiData.js       # DEPTH_R, ERA_NAMES, EXTINCTIONS, ERA_TINTS, TRANSLATIONS (en/he/ru)
```

---

## Running Locally

```bash
node serve.js          # serves on http://localhost:5555
```

No install step needed. Open `http://localhost:5555` in a browser. Alternatively, open `index.html` directly — all external resources load from CDN.

---

## Architecture

### Single-File Application

All rendering logic, CSS, and HTML live in `index.html` (~2,860 lines). Data constants are extracted to 3 JS files loaded via `<script>` tags. There are no external CSS files.

### Data Files

| File | Contents |
|------|----------|
| `js/treeData.js` | `TREE` object (nested phylogenetic tree, ~130+ nodes), `lightenColor()` |
| `js/speciesData.js` | `PHOTO_MAP`, `WIKI_TITLES`, `HOMININS` (28 species), `NODE_EXTRAS`, `HOMININ_ID_ALIASES` |
| `js/uiData.js` | `DEPTH_R`, `ERA_NAMES`, `EXTINCTIONS`, `ERA_TINTS`, `TRANSLATIONS` (en/he/ru) |

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

- All CSS lives in the `<style>` block inside `index.html`'s `<head>` (~550 lines)
- **No external stylesheet** — `style.css` was removed as dead code
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
--font-head     /* 'Playfair Display' — headings */
--font-body     /* 'Heebo' — body text */
--font-sans     /* 'Heebo' — UI elements */
```

### Fonts

- **Heebo** — body, UI, Hebrew, Cyrillic (all non-heading text)
- **Playfair Display** — headings only

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
3. **index.html is large** (~2,860 lines). Be careful with edits; search for context before modifying.
4. **Global scope** — data constants (`TREE`, `PHOTO_MAP`, `TRANSLATIONS`, etc.) are globals loaded via `<script>` tags.
5. **D3.js** — loaded from CDN but not actively used by the current renderer.
6. **CORS** — all APIs permit browser-side calls. Do not add a server proxy unless needed.

---

## Development Workflow

### Making Changes

1. Edit files directly — no build step required
2. Test in browser at `http://localhost:5555` (run `node serve.js`)
3. Edit CSS in `index.html`'s inline `<style>` block (no external stylesheet)
4. Verify all three languages (`?lang=en`, `?lang=he`, `?lang=ru`) if touching UI text

### Adding a New Data Module

1. Create `js/newmodule.js` with global constants
2. Add `<script src="js/newmodule.js"></script>` to `index.html` before the main `<script>` block (line ~820)
3. Reference the constants in the inline `<script>` code

### Deployment

Push to `master` → GitHub Actions automatically deploys to GitHub Pages. No manual steps needed.

---

## Git Conventions

- Descriptive commit messages (imperative mood: "Add ...", "Fix ...", "Update ...")
- Prefix: `feat:` / `fix:` / `style:` / `chore:` / `docs:` / `data:` / `perf:` / `a11y:`
- Work on feature branches; merge to `master` for deployment
- No commit hooks or pre-push checks configured
