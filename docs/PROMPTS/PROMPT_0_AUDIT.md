# Prompt 0 — Pre-Flight Audit, Architecture Decision & Gap Analysis

**Audit Date:** 2026-03-10
**Auditor:** Claude Sonnet 4.6
**Repository:** https://github.com/Behemot46/tree-of-life
**Live site:** https://behemot46.github.io/tree-of-life/

---

## CRITICAL STRUCTURAL FINDING: DUAL CODEBASE

Before the area-by-area audit, one finding overrides all others:

**The repository contains two complete, incompatible implementations. Only one is live.**

| File(s) | Status | Role |
|---------|--------|------|
| `index.html` (1,886 lines) | **ACTIVE — THE LIVE APP** | Self-contained: inline CSS (424 lines) + inline JS (~1,300 lines) + all data |
| `style.css` (757 lines) | **ORPHANED — NOT LOADED** | D3-based tech-dark UI, never referenced by index.html |
| `js/api.js`, `js/tree.js`, `js/panel.js`, `js/search.js`, `js/timeline.js`, `js/i18n.js`, `js/main.js` | **ORPHANED — NOT LOADED** | Alternative D3/modular implementation |

`index.html` has its own `<style>` block and all JavaScript inline. It does not contain a `<link rel="stylesheet">` to `style.css` and does not have `<script src="js/...">` tags. The `js/` and `style.css` files are a parallel implementation from a prior sprint that was superseded by the museum-quality overhaul.

**Implication for all future prompts:** All development targets `index.html`. The orphaned files must be archived (moved to `_archive/`) or removed — they are a maintenance trap and a source of confusion about which code is actually running.

---

## CURRENT STATE AUDIT

### Area 1 — Visual Design (Light/Dark themes, contrast, typography)

**What exists and works:**
- Dark theme: museum/parchment aesthetic — `#070503` background, `#f2e8d0` text, `#c8883a` gold accents, `#7ab860` sage green
- Light theme: implemented via `[data-theme="light"]` — `#f8f2e6` background with inverted colors throughout; 30+ specific overrides cover all interactive elements
- Atmospheric background: radial gradients + SVG noise texture overlay; atmospheric depth effect works correctly
- Particle animation: floating particles via CSS `drift` keyframe animation, purely decorative
- Typography: Playfair Display (headings), Lora (body), Noto Serif Hebrew (Hebrew script)
- Theme toggle: persists to `localStorage`; re-renders SVG on switch to pick up CSS variable changes
- Detail panel: sliding panel with color-accent bar matching selected node's domain color

**What exists but is incomplete:**
- Light theme for SVG node labels: `[data-theme="light"] .node-label-text { fill: rgba(30,14,2,0.75); }` exists, but several SVG stroke/fill values are hardcoded in JS, not responding to CSS variables
- The loading overlay is removed from DOM after 800ms — if the tree renders slowly on a mobile device, there is no fallback loading state

**What is entirely missing:**
- **Heebo font**: Requirements mandate Heebo from Google Fonts for Hebrew. The current font for Hebrew is Noto Serif Hebrew (serif). Heebo is sans-serif and significantly more readable for Hebrew UI chrome.
- No `<meta name="description">` or OpenGraph tags for social sharing

**Risk flags:**
- All CSS is inline in `<style>` — splitting to separate files requires careful extraction and testing

---

### Area 2 — Hebrew/RTL Support

**What exists and works:**
The Hebrew implementation is extensive and largely correct:

- RTL layout via `dir="rtl"` on `<html>` element
- RTL CSS rules (lines 334–353) cover: `#header`, `#lang-switcher`, `#theme-btn`, `#search-wrap`, `#search-input`, `#panel` (slides from left in RTL), `#legend`, `#zoom-ctrl`, `#breadcrumb`, `#hom-body`, `#hom-filters`, `#hom-header`, `#hom-species`
- Translation keys implemented for Hebrew: `title`, `subtitle`, `hint1`/`hint2`, `search_ph`, all legend labels, all panel section labels (`p_traits`, `p_evo`, `p_sub`), all hominin filter labels, compare mode labels, empty state
- Font: `[lang="he"]` selector sets Noto Serif Hebrew font

**What exists but is incomplete:**
- Search "Searching…" string: hardcoded in JS (`'Searching…'` in English). Not in the translation system
- Search "No results for…" string: hardcoded in English
- Tooltip `tipFact` text: embedded in tree node data objects in English only (e.g., `tipFact:'Glows blue-green under UV light.'`). These are facts shown in the tooltip — they cannot be translated without a bilingual data layer
- Tree node `name`/`latin`/`era`/`desc`/`detail` fields in the TREE data are English-only — rendering the information panels non-Hebrew when Hebrew UI is active

**What is entirely missing:**
- **Heebo font** (see Area 1 — critical for readability)
- Hebrew translations for inline-rendered UI text that bypasses the `applyI18n()` system (e.g., `hom-panel-empty` error state uses `.split('\n')` correctly, but `breadcrumb` separator (›) and search result item UI (rank labels like "species", "phylum") are English-only
- No test coverage or visual verification of RTL layout in hominin compare mode

**What conflicts with target goals:**
- The requirement states "every string... every tooltip... every error state" must be translated. The per-node `tipFact` data field is untranslated and untranslatable without a multilingual data schema change.

---

### Area 3 — Species Images

**What exists and works:**
- Some nodes have `img` and `imgCredit` fields in the TREE data:
  - `ascomycetes`: Wikimedia Commons photo (fungal fruiting body)
  - `cephalopods`: Wikimedia Commons (Day Octopus, CC BY-SA)
  - `angiosperms`: Wikimedia Commons (sunflower)
  - `birds`: Wikimedia Commons (peafowl)
  - `cetaceans`: NOAA public domain (humpback whales)
  - `humans`: Wikimedia Commons (human evolution SVG)
  - A handful of others scattered through the data
- When `n.img` exists, the panel renders `<img class="p-img">` with `imgCredit` attribution below it
- Lazy loading: `loading="lazy"` is used where implemented
- Attribution is displayed for images that have it

**What exists but is incomplete:**
- Image display is inconsistent: only ~6 nodes out of ~80 have images. The remaining ~74 nodes render an empty hero image slot (no `<img>` element at all) — effectively a gray/invisible box depending on CSS

**What is entirely missing:**
- **Fallback silhouette system**: When no `img` exists, there is no domain-appropriate SVG placeholder. The requirement specifies: bacterium outline for Bacteria, leaf for Plants, paw for Animals, mushroom for Fungi, etc. Currently: nothing
- No broken-image handling at all — if a Wikimedia URL returns 404, no fallback is triggered
- No image for the vast majority of tree nodes

**Risk flags:**
- Wikimedia Commons URLs are stable but not guaranteed. The `img` field uses direct Wikimedia thumbnail URLs — these can break if the underlying file is renamed or deleted.

---

### Area 4 — Data Richness

**What exists and works:**

**Main tree (TREE constant, inline in index.html):**
- ~80 nodes spanning all domains of life
- Data depth: 7–8 levels deep (LUCA → Domain → Kingdom → Phylum/Class → Order → Family → Genus → Species)
- Per-node fields: `id`, `name`, `latin`, `era`, `color`, `r` (radius), `appeared` (Mya), `extinct` (Mya, null if extant), `icon` (emoji), `desc` (~100–200 words), `detail` (~50–100 words), `facts[]` (4 key-value pairs), `tags[]` (5–8 trait keywords), `tipFact` (one-sentence hook), `children[]`, and optionally `img`/`imgCredit`
- Rich narrative content in `desc` and `detail` — scientifically accurate, engaging prose

**Hominin dataset (HOMININS constant):**
- 24 species from Sahelanthropus (7 Mya) through Homo sapiens
- Per-entry fields: `id`, `group`, `name`, `short`, `icon`, `color`, `status`, `mya[]`, `brain[]`, `height`, `weight`, `habitat`, `tools`, `fire`, `language`, `sites[]`, `desc`, `detail`, `facts[]`, `tags[]`, `dna{}` (Neanderthal/Denisovan percentages with notes)
- Full coverage: proto-hominins, australopithecines, Paranthropus, early Homo, island hominins, and our closest relatives

**What exists but is incomplete:**
- No `divergence_mya` field (the schema in `docs/DATA_SCHEMA.md` expects this; `appeared` tracks when the clade arose, not when it split from its sister group)
- Missing groups that could be added: no `Echinodermata` in the main Invertebrates branch; no `Platyhelminthes` (flatworms); no specific bacteria genera (nodes stop at phylum level for Bacteria); Archaea coverage stops at 4 nodes

**What is entirely missing:**
- Multilingual node content (all desc/detail/facts text is English-only — see Area 2)
- `img` for ~74/80 tree nodes

---

### Area 5 — Filters

**What exists and works:**

**Era/Time filter (the main filter mechanism):**
- `#era-bar` at bottom of screen with a range slider
- `currentEra` variable (default: 3800 Mya — shows all life)
- `nodeInEra(n)` function: shows node if `n.appeared >= currentEra - 200` (within 200 Mya window)
- Visual: nodes outside era are rendered at low opacity (0.06), in-era nodes at full opacity
- Extinction markers: red vertical lines on the era bar at 5 mass extinction events (built by `buildExtinctionMarkers()`)

**Hominin section filters:**
- 6 filter buttons: All / Proto-hominins / Australopithecus / Paranthropus / Early Homo / Surviving
- Filter correctly shows/hides entries in the hominins list

**Legend domain highlighting (partial filter):**
- Clicking a domain legend item calls `highlightDomain()` which dims non-matching nodes
- This is visual highlighting, not a true filter — hidden nodes remain in the DOM

**What is entirely missing:**
- **Extinction filter**: No dedicated filter for "show extinct only / show extant only / show all". The requirement says "every node in the tree" must visually distinguish extinct nodes. Currently: nodes with `extinct !== null` have no distinct visual treatment in the tree (the hominin section uses `.hs-status-extinct { opacity: 0.7 }` but the main tree does not distinguish extinct species from extant ones)
- **Rank filter**: No filter by taxonomic rank (species / genus / family / etc.)
- **Domain filter as a true filter**: The legend click dims, it doesn't hide. No "show only Plants" mode.
- **Active filter indicator**: No badge count, no clear-all button
- **Real-time filter without page reload**: Era slider works. Others don't exist.

**Risk flags:**
- Era filter logic (`mya <= showFrom + 200`) is not well-defined for how it handles nodes that span eras (e.g., a clade that appeared at 1000 Mya but still exists today)

---

### Area 6 — Hominin Section

**What exists and works:**
- Excellent 24-species dataset with rich per-species data (see Area 4)
- Era grouping into 6 meaningful categories
- Each species: brain volume bar visualization, tags, icons, status (extinct/surviving)
- Click → detail panel with full description, facts grid, DNA similarity bars (Neanderthal/Denisovan percentages), key fossil sites
- Compare mode: `#compare-view` with side-by-side comparison cards
- Filter buttons for 6 era groups (working correctly)
- RTL layout partially implemented for hominin section

**What exists but is incomplete:**
- Compare mode: `compare-btn` exists and CSS for compare-card is defined, but the compare panel implementation needs verification — the `renderCompare()` function in JS needs review
- The entry point from the main tree: only accessible via clicking the `humans` node then clicking "Enter Hominin Gallery" button — requires knowing to click Homo sapiens first
- The hominin section is positioned as a full-screen overlay, not visually connected to the evolutionary tree

**What is entirely missing:**
- No visual bridge between the tree's `primates → humans` node and the hominin section
- No breadcrumb showing position within the hominin section
- Species images in the hominin section: no `img` field in HOMININS data (unlike the main TREE)
- No direct URL access to a specific hominin (e.g., `?hominin=neanderthal`)

---

### Area 7 — Navigation and UX

**What exists and works:**
- **Search**: Full offline search through `nodeMap` — finds nodes by `name`, `latin`, `era`, and `tags`. Debounced at 280ms. Keyboard navigation (ArrowUp/Down/Enter/Escape). Clear button. Results dropdown with rank color coding.
- **Breadcrumb**: Shows path from root to current node. Updates on every navigation. Each crumb is clickable. Correctly hidden when at root.
- **URL state**: `init()` reads `?node=id` parameter and navigates to that node on load. The `navigateTo()` function uses `history.pushState()` to update URL on navigation.
- **Zoom controls**: Zoom in/out/reset buttons + mouse wheel + pinch-to-zoom (touch). Pan via drag.
- **Expand/collapse**: Click any node toggles its children.
- **Panel close**: ✕ button, Escape key, click outside panel.
- **Era slider**: Keyboard-accessible range input with visual feedback.

**What exists but is incomplete:**
- Search finds nodes by English names only — Hebrew characters typed in the search box will match nothing (the `nodeMap` keys and names are English/Latin)
- URL state: `pushState` is called, but the URL only updates when explicitly navigating — it does not update when the era filter changes or when the hominin section opens
- Touch gestures: pinch-zoom works via standard `wheel` event. No explicit `touch` handling for two-finger pan.

**What is entirely missing:**
- Fuzzy/approximate search matching (e.g., "octupus" should find "Cephalopods")
- Search results do not show a visual indication of which part of the tree the result lives in (no breadcrumb preview in results)
- No "back" navigation history within the app (browser back button navigates away, not to the previous node)

---

### Area 8 — Technical Quality

**Performance:**
- SVG rendering: `render()` clears `branchLayer.innerHTML` and `nodesLayer.innerHTML` and rebuilds all elements on every call. This is O(n) DOM creation on every render — fine for 80 nodes, will slow at 200+.
- Animation: On first render, branches animate via CSS `strokeDashoffset`. On subsequent renders (`animDone` Set tracks animated nodes), re-animated nodes skip the animation. This is correctly implemented.
- `layout()` recalculates all positions on every call. On resize this is called via `window.addEventListener('resize', ...)` — no debounce, but `layout()` is pure math with no DOM access so it is fast.

**Mobile responsiveness:**
- No `@media` queries in the inline CSS
- Zoom controls are touch-friendly (35×35px buttons)
- Era slider is native `<input type="range">` — touch-draggable on mobile
- Detail panel: fixed position, slides from right — on mobile this covers most of the screen (panel width is `min(440px, 92vw)`)
- No explicit mobile layout adjustments

**Accessibility:**
- `aria-label` on: search input, language buttons, close button, theme toggle
- `aria-expanded` + `aria-controls` on search input
- `aria-pressed` on language buttons (updated via JS)
- `role="listbox"` on search results container
- `role="toolbar"` on lang-switcher
- `role="option"` on `.sr-item` search result items
- **Missing**: Tree SVG nodes have no ARIA roles — SVG accessibility is limited. No keyboard navigation through the tree itself (only through search results).
- **Missing**: Focus ring visible on all interactive elements? The CSS does not explicitly style `:focus-visible` for tree nodes or the canvas area.

**Broken patterns:**
- `js/*.js` and `style.css` are dead code that will confuse future developers
- `serve.js` (Node.js local server) is not referenced anywhere — probably safe to keep but not documented
- `assets/placeholder.svg` is referenced by the **orphaned** `panel.js` (`el.img().src = 'assets/placeholder.svg'`), NOT by the live `index.html`. The live app has no fallback image reference.

**Security:**
- No `rel="noopener noreferrer"` on `target="_blank"` links in the panel
- Search results use `innerHTML` but escape function `esc()` is... let me check: there's a `esc` function that does `String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')` — XSS protection is present for search results
- `tipFact` and node data content is hardcoded static data, not user-controlled — no injection risk

---

## ARCHITECTURE DECISIONS

### 1. Rendering Approach

**Decision: Keep existing pure SVG renderer. Do not migrate to D3.**

**Rationale:**
- The existing radial SVG renderer (`layout()` + `render()`) works correctly and handles the current tree size (~80 nodes) with smooth animations
- The orphaned D3 implementation (`js/tree.js`) was a parallel effort — it has different design language and different data structures and cannot be merged incrementally
- Migrating rendering mid-project would risk breaking the museum aesthetic that is a defining feature of the project
- D3 becomes worth considering only if node count exceeds 500+, which requires Prompt 1 (data expansion) first
- **Risk**: The current renderer re-renders the full SVG on every call. If tree expands beyond 200+ nodes, this will need to be optimized with keyed update patterns.

### 2. Data Architecture

**Decision: Extract data from index.html into separate files; archive orphaned js/ files.**

```
data/
  treeData.js        ← const TREE = {...}  (extracted from index.html)
  homininsData.js    ← const HOMININS = [...] (extracted from index.html)
_archive/            ← former js/*.js and style.css (kept for reference, not loaded)
js/
  i18n.js            ← extracted + enhanced translation system
  app.js             ← all inline JS from index.html, refactored into modules
css/
  main.css           ← all inline CSS from index.html
```

**Rationale:**
- `index.html` at 1,886 lines is already at the limit of maintainability. Extracting data alone removes ~1,200 lines.
- The orphaned `js/` files are a maintenance trap — they look authoritative but are dead code. Moving to `_archive/` is safer than deleting (preserves git history review option).
- Extracting data enables the gap-filling workflow: add species in data files without touching the rendering code.

### 3. State Management

**Decision: Introduce a single AppState object. Do not refactor all existing code.**

```js
const AppState = {
  language: 'en',        // 'en' | 'he' | 'ru'
  theme: 'dark',         // 'dark' | 'light'
  selectedNode: null,    // current open panel node id
  currentEra: 3800,      // Mya
  activeFilters: {
    domain: null,        // null = all
    extinction: 'all',   // 'all' | 'extinct' | 'extant'
    rank: null           // null = all
  },
  homininsOpen: false,
  compareNodes: []
};

function setState(patch) {
  Object.assign(AppState, patch);
  // targeted re-renders based on what changed
}
```

**Rationale:**
- The current code uses module-level `let` variables scattered across the inline JS. These are hard to trace and cause state inconsistencies (e.g., `currentEra` and `currentLang` are separate globals).
- A single AppState object makes every state change visible and debuggable.
- `setState()` can trigger targeted re-renders — only updating the SVG when zoom changes, only updating text when language changes, etc.

### 4. Confirmed File Structure (Target)

```
/
├── index.html              ← Lean: loads CSS/JS, contains only HTML structure
├── css/
│   ├── main.css            ← All styles extracted from <style> block
│   └── (future: rtl.css if RTL overrides grow large enough)
├── js/
│   ├── app.js              ← AppState, init, event wiring, routing
│   ├── render.js           ← SVG tree renderer (extracted from inline)
│   ├── hominin.js          ← Hominin section logic
│   ├── search.js           ← Search + autocomplete
│   ├── filters.js          ← Filter logic
│   ├── i18n.js             ← Translation system (extracted + enhanced)
│   └── ui.js               ← Panel, tooltip, breadcrumb, timeline
├── data/
│   ├── treeData.js         ← const TREE = {...}
│   └── homininsData.js     ← const HOMININS = [...]
├── assets/
│   └── icons/              ← SVG placeholder silhouettes (one per domain)
│       ├── bacteria.svg
│       ├── archaea.svg
│       ├── plants.svg
│       ├── fungi.svg
│       ├── animals.svg
│       ├── protists.svg
│       └── default.svg
├── _archive/               ← Former parallel implementation (NOT loaded)
│   ├── style.css
│   └── js/
│       ├── api.js, i18n.js, main.js, panel.js, search.js, timeline.js, tree.js
├── docs/                   ← All documentation
└── .github/workflows/      ← CI/CD
```

**Note on migration path:** This refactoring is ambitious. It should be staged:
- Prompt 1: Extract data only (treeData.js, homininsData.js). No logic changes.
- Prompt 2: Extract CSS to main.css and JS to js/ modules. Major but mechanical refactor.
- Prompts 3+: Feature gaps (filters, images, search improvements, etc.)

---

## GAP INVENTORY

Each gap is numbered, described, and tagged with the prompt that addresses it.

| # | Gap | Area | Prompt |
|---|-----|------|--------|
| G01 | `js/*.js` and `style.css` are dead code — archive them | Tech | P1 |
| G02 | `TREE` data embedded in index.html (1,200+ lines) — extract to `data/treeData.js` | Data | P1 |
| G03 | `HOMININS` data embedded in index.html — extract to `data/homininsData.js` | Data | P1 |
| G04 | No `img` for ~74/80 tree nodes — add Wikimedia Commons URLs | Images | P1 |
| G05 | No domain-appropriate SVG fallback silhouettes — create `assets/icons/` | Images | P1 |
| G06 | No broken-image `onerror` handler in panel — implement fallback to silhouette | Images | P1 |
| G07 | Heebo font not loaded — add to Google Fonts import and apply to `[lang="he"]` | i18n | P2 |
| G08 | Search strings "Searching…" and "No results" are hardcoded English | i18n | P2 |
| G09 | Node `tipFact` text in tooltip is English-only (not in translation system) | i18n | P2 |
| G10 | Hebrew script: Noto Serif Hebrew is a serif display font — not ideal for UI labels. Replace with Heebo. | i18n | P2 |
| G11 | No extinction visual marker on main tree SVG nodes (only hominin section has it) | Filters | P3 |
| G12 | No dedicated extinction filter (show extinct / extant / all toggle) | Filters | P3 |
| G13 | Domain filter is visual highlight only — not a true show/hide filter | Filters | P3 |
| G14 | No rank filter | Filters | P3 |
| G15 | No active filter indicator (no badge count, no clear-all button) | Filters | P3 |
| G16 | Era filter logic edge case: nodes spanning eras not correctly handled | Filters | P3 |
| G17 | Fuzzy/approximate search not implemented ("octupus" should match "Cephalopods") | Search | P4 |
| G18 | Hebrew/Russian characters in search field match nothing (data is English/Latin only) | Search | P4 |
| G19 | Search results don't show where in the tree a result lives | Search | P4 |
| G20 | Hominin section only reachable by clicking Homo sapiens → button | UX | P5 |
| G21 | No visual bridge between tree's `humans` node and hominin section | UX | P5 |
| G22 | No images in HOMININS data | Hominin | P5 |
| G23 | Compare mode needs testing — unclear if `renderCompare()` is complete | Hominin | P5 |
| G24 | No `rel="noopener noreferrer"` on external links in panel | Security | P6 |
| G25 | SVG tree nodes have no ARIA roles — keyboard-only users cannot navigate tree | A11y | P6 |
| G26 | No focus rings on interactive SVG elements | A11y | P6 |
| G27 | index.html at 1,886 lines — refactor into modular JS/CSS files | Tech | P2 |
| G28 | `render()` clears and rebuilds full SVG on every call — no keyed updates | Perf | P7 |
| G29 | No mobile layout adjustments (no `@media` queries) | Mobile | P6 |
| G30 | `assets/placeholder.svg` is referenced by orphaned code, not by live app | Tech | P1 |

---

## RISK FLAGS

Patterns in the existing code that will make future implementation harder:

**RF-1: Monolithic inline structure**
All CSS, JS, and HTML are in a single file. Any edit risks cascading breaks. Every future prompt must be careful not to duplicate CSS selectors or JS variable names. Solution: staged extraction (Prompt 1 = data, Prompt 2 = structure).

**RF-2: Global functions and variables**
The inline JS uses global `let` variables (`currentLang`, `currentEra`, `isDark`, `transform`, `highlightedId`, `nodeMap`, `TREE`, `HOMININS`). Any added code must avoid name collisions. Solution: AppState object wraps all of these.

**RF-3: SVG render wipes innerHTML**
`render()` calls `branchLayer.innerHTML = ''` and `nodesLayer.innerHTML = ''` on every call. Adding persistent SVG elements (e.g., filter markers for extinct nodes) will require them to be re-created on every render, or managed separately. The `animDone` Set partially manages this (skips re-animating known nodes).

**RF-4: Translation data structure**
The `applyI18n()` function manually calls `set('element-id', t('key'))` for every translated element. There is no `data-i18n` attribute system as in the orphaned `js/i18n.js`. Adding new translatable strings requires editing both: the `applyI18n()` function AND the translation object T with all three languages. Forgetting one language will silently fall back to the key string.

**RF-5: Tree data has inline Wikimedia URLs**
A few nodes (`ascomycetes`, `angiosperms`, `cephalopods`, etc.) have direct Wikimedia Commons thumbnail URLs. These are fragile — Wikimedia can rename files. A future data enrichment step should audit and normalize these.

**RF-6: Era filter uses `appeared` field with assumed values**
The `nodeInEra()` function compares `n.appeared` (in Mya) against `currentEra`. Several nodes have no `appeared` value (they return `true` unconditionally). When adding new nodes, forgetting to set `appeared` will cause them to always render regardless of era filter state.

**RF-7: `animDone` Set is never cleared**
The Set tracking which nodes have been animated grows indefinitely. On a long session with many expand/collapse cycles, it will contain stale IDs of removed nodes. Not a crash risk, but a minor memory leak.

---

## SUMMARY: WHAT ALREADY WORKS AND MUST BE PRESERVED

The following must be preserved exactly as-is through all future prompts:

1. **Museum aesthetic**: The parchment/gold/sage color palette is the project's identity. Do not change colors, fonts (except adding Heebo for Hebrew), or the atmospheric background.
2. **Radial SVG tree layout**: The `layout()` + `render()` + `DEPTH_R` radius system is working correctly and produces the distinctive radial tree.
3. **Hominin data quality**: All 24 hominin entries with their rich per-species data are accurate and thorough.
4. **Tree data narrative quality**: The `desc`, `detail`, `facts`, `tags`, `tipFact` content per node is high-quality scientific writing.
5. **RTL implementation**: The existing RTL CSS rules and `dir="rtl"` switching work correctly for layout mirroring.
6. **Breadcrumb + URL state**: Navigation history via `history.pushState` and breadcrumb trail work correctly.
7. **Era slider**: The geological time filter is a distinctive feature — preserve and enhance it.
8. **Accessibility foundations**: `aria-label`, `aria-expanded`, `aria-pressed`, `role` attributes already present — extend, don't replace.

---

*This document should be read before executing any of Prompts 1–7.*
