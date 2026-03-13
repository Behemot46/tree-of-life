# Tree of Life — Architecture (Actual Current State)

> **Audit date:** 2026-03-14
> **Source of truth:** Files read directly from the repository. Nothing invented.

---

## File Structure

```
index.html          — ~2,800 lines. Self-contained SPA: inline <style>, HTML markup,
                      inline <script> with renderer, i18n, search, panels, everything.
js/
  treeData.js       — TREE object — full phylogenetic tree data (~130+ nodes)
  speciesData.js    — PHOTO_MAP, WIKI_TITLES, HOMININS, NODE_EXTRAS, HOMININ_ID_ALIASES
  uiData.js         — DEPTH_R, ERA_NAMES, EXTINCTIONS, ERA_TINTS, TRANSLATIONS (en/he/ru)
assets/
  placeholder.svg   — Placeholder image for panel hero
.github/
  workflows/
    deploy.yml      — GitHub Pages deploy on push to main (uploads root dir)
    deploy-check.yml — CI validation for required files
serve.js            — Local dev server (Node)
```

---

## Architecture — The Inline Monolith

### Overview

Everything lives inside `index.html`. The page is self-contained with no external JS
beyond D3 (loaded via CDN for potential future use). Data is extracted to 3 JS files
(`treeData.js`, `speciesData.js`, `uiData.js`) loaded via `<script>` tags.

### Rendering

- **Library:** None. Pure vanilla JavaScript + SVG.
- **SVG elements:** `<circle>`, `<line>`, `<text>` created/updated by hand.
- **Layout:** Custom `layout()` function computes `_x`, `_y` positions for each node,
  centering the root with a radial layout. No D3 layout algorithms involved.
- **Zoom/Pan:** Manual transform `{x, y, s}` applied via `SVGElement.setAttribute('transform', ...)`.
  Mouse wheel, touch pinch, and drag are all handled manually.
- **Collapse/Expand:** Nodes have `_collapsed` boolean. Click toggles, then re-runs `layout()` + `render()`.
- **Era slider:** Filters visible nodes by `node.appeared <= currentEra`. Nodes outside range
  are hidden with opacity 0.

### Tree Data (`TREE` object, inline ~line 604)

Hardcoded nested object. Schema per node:

```js
{
  id:        string,       // unique, e.g. 'luca', 'bacteria', 'humans'
  icon:      string,       // emoji
  color:     string,       // hex color, inherited by children visually
  r:         number,       // circle radius (8–26)
  appeared:  number,       // million years ago (Mya); 0.3 = 300,000 ya
  extinct:   null | true,
  img:       string?,      // Wikimedia URL (some nodes)
  imgCredit: string?,
  name:      string,       // display name
  latin:     string,       // scientific name
  era:       string,       // human-readable era string
  desc:      string,       // long description (~3–6 sentences)
  detail:    string,       // deeper detail paragraph
  facts:     [{l, v}],     // label/value pairs for fact cards
  tags:      string[],     // trait chips
  tipFact:   string,       // single tooltip fun fact
  children:  Node[]        // nested children (undefined = leaf)
}
```

**Total nodes in `TREE`:** ~47 species/clades across 5 depth levels (LUCA → species).

Notable leaf species included: Prochlorococcus, Nostoc, E. coli, Methanobacterium,
Asgard Archaea, Ascomycetes, Basidiomycetes, Chytrids, Mosses, Flowering Plants,
Gymnosperms, Ferns, Insects, Cephalopods, Cnidarians, Echinoderms, Annelids, Fish,
Birds, Amphibians, Cetaceans, Primates, Homo sapiens, Protists (Alveolata), Diatoms.

### Hominin Data (`HOMININS` array, inline ~line 960)

28 hominin species as a flat array. Schema per entry:

```js
{
  id:       string,        // e.g. 'sahelanthropus'
  name:     string,        // full scientific name
  short:    string,        // display name
  icon:     string,        // emoji
  color:    string,        // hex
  group:    string,        // 'proto' | 'australopith' | 'paranthropus' | 'homo'
  status:   string,        // 'extinct' | 'surviving'
  mya:      [number, number], // [start_mya, end_mya]
  brain:    [number, number?], // brain volume range in cm³
  desc:     string,
  detail:   string,
  facts:    [{l, v}],
  tags:     string[],
  tools:    string,
  fire:     string,
  language: string,
  dna:      { neanderthal?: number, denisovan?: number, note?: string } | null,
  sites:    string[]       // fossil site names
}
```

`ERA_GROUPS` array groups hominins into time bands for the timeline display.
`MAX_BRAIN` constant (1750 cm³) is used to normalize brain bar widths.

### Features

| Feature | Status | Notes |
|---|---|---|
| SVG tree render | ✅ Working | Radial layout, custom renderer |
| Pan / zoom | ✅ Working | Mouse, touch, pinch |
| Collapse / expand nodes | ✅ Working | Click toggles |
| Era slider | ✅ Working | Filters by `appeared` value |
| Click → detail panel | ✅ Working | Right sidebar slides in |
| Detail panel content | ✅ Working | desc, detail, facts, tags, img |
| Sub-groups list | ✅ Working | Children listed in panel |
| Hominin view | ✅ Working | Full overlay with 28 species |
| Hominin filters | ✅ Working | all/proto/australopith/paranthropus/homo/surviving |
| Compare mode | ✅ Working | Select 2–4 hominins for side-by-side cards |
| Fuzzy multilingual search | ✅ Working | EN/HE/RU with bigram matching |
| Search → navigate | ✅ Working | Pans to node, opens panel |
| URL state | ✅ Working | `?node=id` restores on load |
| Random species button | ✅ Working | Picks random leaf node |
| i18n EN/HE/RU | ✅ Working | Via `TRANSLATIONS` in uiData.js + `applyI18n()` |
| RTL (Hebrew) | ✅ Working | Sets `dir="rtl"`, CSS flips layout |
| Theme toggle | ✅ Working | Dark/light via `data-theme` attr |
| Particles animation | ✅ Working | 22 floating particles |
| Intro animation | ✅ Working | Fade-in overlay on first load |
| Keyboard shortcuts | ✅ Working | F=search, H=hominins, R=reset, Esc=close |
| Photo node icons | ✅ Working | Circular thumbnails from PHOTO_MAP, emoji fallback |

### i18n System

- Data: `TRANSLATIONS` object in `js/uiData.js` (~40 keys per language)
- Function: `t(key)` — returns translation or falls back to English
- Apply: `applyI18n()` — imperatively sets `textContent` on specific element IDs
- Persistence: `localStorage.getItem('tol-lang')`
- Keys cover: UI labels, legend, panel sections, hominin view, compare mode, DNA labels

### CSS Variables (App palette):
```css
--bg: #070503           --parchment: #f2e8d0
--gold: #c8883a         --teal: #2dd4bf
--font-head: 'Playfair Display'    --font-body: 'Lora'
```

---

## Deployment

- **CI:** `.github/workflows/deploy.yml` — triggers on push to `main`
- **Action:** `actions/upload-pages-artifact` uploads the repo root (`.`)
- **Result:** All files served statically. `index.html` loads first.
- **Live URL:** https://behemot46.github.io/tree-of-life/

---

## Known Issues / Tech Debt

1. **index.html is ~2,800 lines.** Contains styles, data references, and all logic inline. Panel modularization planned.
2. **No offline fallback.** If the page fails to load, nothing works.
3. **Legend is decorative.** Domain highlight (click legend item) not yet implemented.
4. **Timeline partially interactive.** Era slider works but no era period bars, extinction tooltips, or preset buttons.
5. **Mobile responsiveness needs work.** Controls overlap on narrow screens, touch targets undersized.
