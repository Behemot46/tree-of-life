# Tree of Life — Architecture (Actual Current State)

> **Audit date:** 2026-03-10
> **Branch:** claude/upbeat-tharp
> **Source of truth:** Files read directly from the repository. Nothing invented.

---

## Warning: Two Conflicting Apps Coexist

The repository currently contains two completely separate, architecturally incompatible
applications. Only **App A** (the inline monolith) is functional. **App B** (the modular
JS system) loads but crashes silently because its expected DOM elements do not exist.

---

## File Structure

```
index.html          — 1,886 lines. Contains ALL of App A: inline <style>, HTML markup,
                      inline <script> with tree data, renderer, i18n, search, everything.
                      (style.css was removed — all CSS is now inline in index.html)
js/
  api.js            — App B data layer: OTL + Wikipedia + iNaturalist APIs + INITIAL_TREE
  i18n.js           — App B i18n module (data-i18n attribute system)
  main.js           — App B orchestrator (wires Tree, Panel, Search, Timeline)
  panel.js          — App B node detail panel (4 tabs)
  search.js         — App B search with OTL API autocomplete
  timeline.js       — App B geological timeline bar
  tree.js           — App B D3 radial/cladogram renderer
assets/
  placeholder.svg   — Placeholder image for panel hero
.github/
  workflows/
    deploy.yml      — GitHub Pages deploy on push to main (uploads root dir)
serve.js            — Local dev server (Node)
```

---

## App A — The Inline Monolith (What Actually Runs)

### Overview

Everything lives inside `index.html`. The page is self-contained: no external JS beyond
D3 (loaded via CDN but **only used by App B's modules**; App A does not call D3 at all).

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

### Features Implemented (App A)

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
| Inline search | ✅ Working | Searches tree nodes + hominins by name/latin/tags |
| Search → navigate | ✅ Working | Pans to node, opens panel |
| URL state | ✅ Working | `?node=id` restores on load |
| Random species button | ✅ Working | Picks random leaf node |
| i18n EN/HE/RU | ✅ Working | Via inline `TRANSLATIONS` object + `applyI18n()` |
| RTL (Hebrew) | ✅ Working | Sets `dir="rtl"`, CSS flips layout |
| Theme toggle | ✅ Working | Dark/light via `data-theme` attr |
| Particles animation | ✅ Working | 22 floating particles |
| Intro animation | ✅ Working | Fade-in overlay on first load |
| Keyboard shortcuts | ✅ Working | F=search, H=hominins, R=reset, Esc=close |
| Legend domain highlight | ❌ Not implemented | Legend is decorative only in App A |
| Wikipedia/iNat enrichment | ❌ Not implemented | App A shows hardcoded data only |
| Lazy API expansion | ❌ Not implemented | All data is hardcoded |

### i18n System (App A, inline)

- Object: `const TRANSLATIONS = { en:{...}, he:{...}, ru:{...} }` (~40 keys each)
- Function: `t(key)` — returns translation or falls back to English
- Apply: `applyI18n()` — imperatively sets `textContent` on specific element IDs
- Persistence: `localStorage.getItem('tol-lang')`
- Keys cover: UI labels, legend, panel sections, hominin view, compare mode, DNA labels

---

## App B — The Modular System (Non-Functional)

App B files are loaded via `<script>` tags in `index.html` but cannot run because the
HTML does not contain the DOM elements they require.

### What App B expects vs. what exists

| Element ID | Required by | Exists in index.html? |
|---|---|---|
| `#tree-container` | tree.js:init | ❌ No |
| `#tree-svg` | tree.js:init | ❌ No |
| `#tree-root-g` | tree.js:init | ❌ No |
| `#links-g` | tree.js:init | ❌ No |
| `#nodes-g` | tree.js:init | ❌ No |
| `#zoom-in` | tree.js:init | ❌ No |
| `#zoom-out` | tree.js:init | ❌ No |
| `#zoom-reset` | tree.js:init | ❌ No |
| `#btn-layout` | tree.js:init | ❌ No |
| `#minimap` | tree.js:updateMinimap | ❌ No |
| `#loading` | main.js | ❌ No |
| `#btn-explore` | main.js | ❌ No |
| `#btn-theme` | main.js | ❌ No (App A uses `#theme-btn`) |
| `#search-container` | search.js | ❌ No |
| `#search-clear` | search.js | ❌ No |
| `#timeline-toggle` | timeline.js | ❌ No |
| `#timeline-inner` | timeline.js | ❌ No |
| `#panel-image` | panel.js | ❌ No |
| `#panel-sci-name` | panel.js | ❌ No |
| `#panel-common-name` | panel.js | ❌ No |
| `#panel-rank-badge` | panel.js | ❌ No |
| `#panel-content` | panel.js | ❌ No |

### App B Data

**`INITIAL_TREE`** (in `api.js`, line 218): ~55 nodes with OTT IDs for live API expansion.
Nodes use a different schema than App A's `TREE`:

```js
{
  id:            string,    // 'ott93302'
  name:          string,    // scientific name
  common:        string,    // common name
  ott_id:        number,    // Open Tree of Life ID
  rank:          string,    // 'domain' | 'kingdom' | 'phylum' | 'class' | 'order'
  color:         string,
  num_tips:      number,    // approximate descendant species count
  divergence_mya: number?,
  children:      Node[],    // pre-loaded children
  _children:     []         // [] = expandable but not loaded; undefined = leaf
}
```

**`NOTABLE_SPECIES`** (in `api.js`): 15 species for a "Discover" random feature that
exists in main.js but never runs.

### App B APIs (api.js)

All CORS-friendly, no auth required:
- **OTL:** `https://api.opentreeoflife.org/v3` — POST `/taxonomy/node_info`, POST `/tnrs/autocomplete`
- **Wikipedia:** `https://en.wikipedia.org/api/rest_v1/page/summary/{name}`
- **iNaturalist:** `https://api.inaturalist.org/v1/taxa?q={name}`

LRU cache with 600-entry cap (map-based, evicts oldest on overflow).

### App B i18n (i18n.js)

Separate from App A's system. ~40 keys per language (EN/HE/RU). Applied via
`[data-i18n]` DOM attributes — a different mechanism than App A's imperative `applyI18n()`.
Keys cover: navbar, legend, panel tabs/sections, info card labels, gallery, timeline, loading.

CSS variables defined in `index.html` inline `<style>` (App A palette):
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

1. **App B is dead code.** All 7 JS modules are loaded but non-functional. (`style.css` was removed.)
2. **Duplicate i18n.** Two separate translation systems with different keys and mechanisms.
3. **Duplicate tree data.** `TREE` (App A) and `INITIAL_TREE` (App B/api.js) both define the
   tree but in different schemas.
4. **index.html is 1,886 lines.** Contains styles, data, and all logic inline.
5. **No offline fallback.** App A shows hardcoded data. If the page fails to load, nothing works.
6. **Legend is decorative.** Domain highlight (click legend item) is implemented in tree.js
   but never runs.
7. **No fuzzy search.** App A's search is substring-only (`includes()`).
8. **Hominins disconnected from main tree.** The Homo sapiens node in `TREE` does not link
   to the Hominin view; they are separate data structures.
