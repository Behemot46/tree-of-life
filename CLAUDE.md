# CLAUDE.md — Tree of Life Project Guide

## Working Agreement

How Gabi and Claude work on this project. This section takes precedence over
any default behaviour.

### Ownership of git & GitHub

Gabi never deals with git or GitHub mechanics. Claude owns the whole loop:
branch, commit, push, open the PR, watch CI, fix failures, merge, delete the
branch. Outcomes are reported in plain language — never as diffs or command
transcripts.

- Always work on a feature branch. Never commit directly to `main`.
- Never end a session with unpushed work.
- Every PR that changes the site must be visually verified before merge
  (see *Visual verification* below).

### Code words

| Word | Means |
|---|---|
| **ship it** | Commit, push, open PR, get CI green, merge, delete the branch. |
| **checkpoint** | Commit and push. No PR. |
| **status** | Plain-language summary of where things stand. No diffs. |
| **hold** | Push and open the PR, then stop and wait for Gabi's approval to merge. |

### Language

Reply in whichever language Gabi used last — English, Hebrew and Russian are
all fine. Code, commit messages, PR text and documentation stay in English.

### Visual verification

Before merging anything that changes the site, open it in a real browser
(Chromium is preinstalled for Playwright) and confirm it looks right:

- **Desktop** (1440×900) **and phone** (390×844) viewports.
- **Hebrew** as well as English — the site is trilingual and Hebrew is RTL.
- Show Gabi screenshots, not diffs.

`node scripts/smoke.mjs` automates the mechanical half of this; screenshots
land in `.smoke-out/`. It is not a substitute for looking at the result.

---

## Project Overview

**Tree of Life** is an interactive, browser-based phylogenetic visualization of 3.8 billion years of evolutionary history. Users can explore the tree of life, expand taxonomic nodes, search for species, and view detailed information panels with photos, Wikipedia summaries, and conservation status data.

- **Tech stack:** Vanilla JavaScript, HTML5, CSS3. **No D3** — earlier docs
  claimed a D3 CDN dependency, but `index.html` has exactly one script tag
  (`js/app.js`) and the renderer is hand-written SVG.
- **No build step** — open `index.html` directly or use `node serve.js`
- **No package manager for the site** — the page itself ships zero npm
  dependencies. `package.json` exists only to pin Playwright for the smoke
  tests, and is never shipped to the browser.
- **Deployment:** Vercel, on every push and pull request (see *Deployment*).

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
│   └── species/*.webp   # Ten commissioned illustrations (domains, kingdoms)
└── js/                  # All ES modules — single entry: app.js
    ├── # ── Data modules ──
    ├── data.js          # Barrel re-exports for widely-shared constants
    ├── treeData.js      # TREE object — full phylogenetic tree data
    ├── treeExpansion.js  # expandTree() — adds 300+ species with IUCN data
    ├── speciesData.js   # PHOTO_MAP, WIKI_TITLES, ENRICHMENT
    ├── uiData.js        # DEPTH_R, ERA_NAMES, EXTINCTIONS, TRANSLATIONS
    ├── factLibrary.js   # FACTS — random facts for discovery feature
    ├── imagePrompts.js  # AI image prompt library (unused)
    ├── imageLoader.js   # ImageLoader — resolves a node to a URL at a given size
    ├── photoSnapshot.js # GENERATED — every species photo, two sizes each
    ├── labelMetrics.js  # One source of truth for label size, placement, footprint
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

No install step needed. Open `http://localhost:5555` in a browser. Opening
`index.html` straight off disk also works, but skips the Content-Security-Policy
that `serve.js` mirrors from `vercel.json`, so prefer the dev server.

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
- **Node icons:** Photo thumbnails via `ImageLoader.getBestUrl(node,'thumb')`,
  emoji fallback

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

1. Add the key to **all three** language objects in `TRANSLATIONS`
   (`js/uiData.js`). Non-ASCII is written as `\uXXXX` escapes to match the
   surrounding file.
2. Apply it — either give the element `data-i18n="some.key"` (dots become
   underscores, so that reads `some_key`), or set it explicitly by id in
   `applyI18n()` (`js/theme.js`).
3. Add the element to `I18N_BINDINGS` in `scripts/smoke.mjs` so the smoke
   suite fails if it ever stops being translated.

### Adding a Language

`setLang()` currently treats Hebrew as the only RTL language. To add another
(Arabic, Farsi), generalise the check in `js/theme.js`:

```js
const RTL_LANGS = ['he', 'ar', 'fa'];
document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
```

Then add the language object to `TRANSLATIONS` and a `.lang-btn` in
`index.html`.

### What is *not* translated

**Major taxonomic groups are translated; individual species are not.**

`js/taxonNames.js` holds Hebrew and Russian names for the 50 ranked groups —
domains, kingdoms, phyla, classes, orders and the like. `displayName(node)` in
`js/utils.js` resolves a node's name for the active language and falls back to
English, so adding a group node never breaks a language. It is used for tree
labels, tooltips and the detail panel.

The boundary is the `latin` field: ranked groups carry a rank prefix
(`Class Mammalia`), species carry a binomial (`Panthera leo`). Species
descriptions and facts stay English too — a half-translated tree reads worse
than a consistently English one.

`i18n:taxon-labels-translated` in the smoke suite fails if a group node renders
its English name in Hebrew or Russian. Elements that legitimately show English
data — the species-of-the-day badge — carry `data-i18n-exempt` so the leak
check skips them rather than being weakened.

---

## Images & Attribution

Ten commissioned illustrations ship in `assets/species/` (the domain- and
kingdom-level nodes). Every other picture is a Wikimedia Commons photograph
loaded at runtime.

`ImageLoader.getBestUrl(node, size)` is the single resolver. Its chain, best
first:

1. `assets/species/{id}.webp` — the commissioned illustrations
2. `PHOTO_SNAPSHOT` (`js/photoSnapshot.js`) — Wikipedia's current lead image
3. `PHOTO_MAP` (`js/speciesData.js`) — hand-pinned Commons URLs
4. `node.img`
5. the node's emoji

**`size` is not optional in spirit.** Pass `'thumb'` (400px) for tree discs and
`'hero'` (1280px) for the panel. `PHOTO_MAP` served one 960px file to both,
so every 40px node icon downloaded roughly thirty times the pixels it could
display.

### Why there is a snapshot

Hand-pinned Commons URLs are file paths, and they die when a file is renamed,
re-uploaded or deleted. The old `photo-check.yml` could only *report* that rot;
someone then had to find a replacement by hand, and nobody did.

`scripts/build-photo-snapshot.mjs` resolves every `WIKI_TITLES` entry through
the Wikipedia REST summary endpoint, which always returns whatever image the
article carries today, and writes `js/photoSnapshot.js`.
`.github/workflows/photo-refresh.yml` runs it weekly and opens a PR when
anything moved — so a dead photo repairs itself.

The browser never calls that API. It loads the committed snapshot, which is why
a Wikipedia outage cannot take the pictures down.

```bash
node scripts/build-photo-snapshot.mjs             # rebuild from Wikipedia
node scripts/build-photo-snapshot.mjs --bootstrap # offline: re-cut PHOTO_MAP
node scripts/build-photo-snapshot.mjs --check     # exit 1 if stale
```

`--bootstrap` needs no network; it re-cuts the URLs already in `PHOTO_MAP` to
the two sizes. Use it when working offline.

Wikimedia content is CC BY-SA, so the credit line must stay visible wherever a
photo is shown. `assets/placeholder.svg` is the fallback when nothing resolves.

---

## Known Constraints & Important Notes

1. **Tests are browser smoke checks, not unit tests** — `node scripts/smoke.mjs`
   opens the real page in Chromium and asserts ~45 things per scenario about
   layout, i18n, contrast and rendering. See *Smoke tests* below.
2. **No linter/formatter config** — maintain consistent 2-space indentation.
3. **index.html** is pure HTML markup (~462 lines). CSS is in `css/`, JS is in `js/`.
4. **ES modules everywhere** — all data and application files use `export`/`import`. No global `<script>` tags.
5. **No D3** — `index.html` has exactly one script tag (`js/app.js`); the
   renderer is hand-written SVG.
6. **CORS** — all APIs permit browser-side calls. Do not add a server proxy unless needed.
7. **Label geometry lives in one place.** `js/labelMetrics.js` decides how big a
   label is, where it sits and how much room a node needs. The renderer draws
   from it and the camera frames from it; when those two estimated separately
   they disagreed, and names were clipped against the edges of the screen.
   Label *sizes* must be set as inline styles, not `font-size` attributes — a
   stylesheet declaration outranks a presentation attribute, which is how every
   label in the tree ended up rendering at the same 10px.
8. **Physical offsets need logical properties.** A floating control that pins
   `left` or `right` with `!important` cannot be released by an RTL override,
   and an element pinned at both edges with no width stretches across the whole
   window as an invisible sheet over the map. Use `inset-inline-start/end`.
   `chrome:no-stretched-overlay` fails on the structural signature.

---

## Development Workflow

### Making Changes

1. Edit files directly — no build step required
2. Test in browser at `http://localhost:5555` (run `node serve.js`)
3. Edit CSS in the appropriate file under `css/` (organized by concern)
4. Run `npm run smoke` and look at the screenshots in `.smoke-out/`
5. Verify all three languages if touching UI text. **Note:** there is no
   `?lang=` URL parameter — the language is read from the `tol-lang`
   localStorage key at startup. Switch with the language buttons, or seed
   `localStorage.setItem('tol-lang','he')` before load (which is what the
   smoke runner does).

### Adding a New Data Module

1. Create `js/newmodule.js` with `export const` declarations
2. Import it in consuming ES modules (e.g., `import { FOO } from './newmodule.js'`)
3. If widely shared (4+ consumers), add a re-export to `js/data.js`

### Deployment

**Vercel** (`sinapsa/tree-of-life`) deploys every push and pull request through
the GitHub integration. There is no deploy workflow in this repo — Vercel runs
its own build.

Addresses, all serving the same site:

| URL | Role |
|---|---|
| `https://www.treeoflife.wiki/` | Production. Canonical, and what `og:url` points at. |
| `https://treeoflife.wiki/` | Apex — 308-redirects to `www`. |
| `https://tree-of-life-sand.vercel.app/` | Vercel's own production alias. |

GitHub Pages has been retired: `deploy.yml` was deleted once the custom domain
passed the full smoke suite. The old `behemot46.github.io/tree-of-life` URL
will keep serving its last build until Pages is switched off in the
repository's Settings → Pages, which has to be done by hand.

`vercel.json` skips dependency installation — the site is static, and
`package.json` exists only to pin Playwright for the tests. It also sets
cache headers: **nothing may be cached immutably**, because no asset is
content-hashed and a stale `js/app.js` would strand visitors on old code
with no way to bust it. ETags make revalidation cheap.

The **Content-Security-Policy** lives in `vercel.json`. `serve.js` reads that
same header block, so the dev server and the smoke suite enforce exactly what
production serves — a policy that would break the deployed site breaks locally
first. `scripts/smoke.mjs` fails on any CSP violation, and reads them *after*
the interaction phase because inline handlers only fire when clicked.

The policy allows `script-src 'unsafe-inline'`: `index.html` uses 31 inline
`onclick` handlers, so it restricts *which origins* are reachable rather than
preventing inline execution. Removing those handlers would let it tighten.

Allowed origins are deliberately narrow — `fonts.googleapis.com` (styles),
`fonts.gstatic.com` (fonts), `upload.wikimedia.org` (every one of the 393
`PHOTO_MAP` images). Species "learn more" links point at ~200 other hosts, but
those are anchor targets, not loaded resources, so CSP does not govern them.

`.github/workflows/verify-deployment.yml` runs the full smoke suite against
the deployed URL whenever Vercel publishes to production, so a green build is
never mistaken for a working page.

---

## Smoke Tests

`scripts/smoke.mjs` opens the real page in Chromium and asserts ~45 things per
scenario across six scenarios — desktop and phone viewports in English, Hebrew
and Russian, plus a desktop pass in the light theme. It runs on every push and
pull request via `.github/workflows/smoke.yml`, and replaces the old
`deploy-check.yml`, which only checked that files existed.

The light theme is loaded rather than toggled at runtime: switching themes also
rebuilds the era strip and the density curve in JS, so a half-applied theme
measures a page nobody ever sees.

```bash
npm run smoke                                      # serve ./ and check it
node scripts/smoke.mjs --url https://example.com   # check a deployed site
node scripts/smoke.mjs --proxy http://host:port    # run from behind a proxy
npm run smoke:update-baseline                      # re-record known failures
```

Screenshots for every scenario land in `.smoke-out/` (git-ignored, and uploaded
as a CI artifact on every run).

### What it checks

| Group | Covers |
|---|---|
| `load:` | uncaught errors, failed requests, SVG render errors, splash dismissal, nothing covering the stage |
| `tree:` | node and branch counts, **NaN coordinates**, fit-to-stage, spill, root visibility, horizontal scroll |
| `chrome:` | header/timeline visible, reveal panel vs. zoom controls and timeline, closed panel off-screen, tooltip and fact toast vs. header, tooltip vs. the node it describes, nothing printed over the species name, **no floating control stretched across the window** |
| `timeline:` | geological era labels clipped or colliding |
| `i18n:` | document direction and lang, every bound control matches its translation, missing translation keys, Latin text leaking into Hebrew, search placeholder, English species prose laid out left-to-right |
| `a11y:` | every text node meets AA contrast against its effective background |
| `search:` | eight canonical queries return the answer a person would call correct; every common-name alias still matches something |
| `interact:` | zoom buttons, reset re-fits, parent expands, leaf opens panel, search returns results, camera settles |
| `static/` | CSS custom properties used but never defined (runs before the browser starts) |

### The baseline

`scripts/smoke-baseline.json` records checks that are **known to fail today**.
This lets the suite land red-in-truth but green-in-CI, so it can be written
before the bugs are fixed.

The run fails if:

- a check that is **not** baselined fails — a regression, or a newly found bug;
- a check that **is** baselined starts passing — the fix landed, so its entry
  must be deleted. This is deliberate: it makes each fix delete its own
  baseline entry, and the file shrinks to nothing as the backlog clears.

When adding a translated control, add a row to `I18N_BINDINGS` in
`scripts/smoke.mjs` so it is covered.

---

## Git Conventions

- Descriptive commit messages (imperative mood: "Add ...", "Fix ...", "Update ...")
- Prefix: `feat:` / `fix:` / `style:` / `chore:` / `docs:` / `data:` / `perf:` / `a11y:`
- Work on feature branches; merge to `master` for deployment
- No commit hooks or pre-push checks configured
