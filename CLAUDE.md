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

### Ending a session

Every session ends with a **handover prompt** — a block Gabi can paste
straight into a new session. It carries what the next Claude cannot infer from
the code:

- the branch, and whether its PR is open, merged or absent;
- what is deployed versus what is only on the branch;
- what was verified, and by what means;
- what is known-broken or known-unverified, and why;
- the next one or two things worth doing.

Not a changelog — git holds that. The point is the things that would otherwise
be rediscovered the hard way: which environment limits bite, which checks do
not cover what they appear to, which fixes are unverified on real devices.

Write it unprompted, at the end, alongside the plain-language summary.

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
├── css/                 # External stylesheets (15 files)
│   ├── variables.css    # CSS custom properties, reset, focus styles
│   ├── layout.css       # Header, search, breadcrumb, nav controls
│   ├── chrome.css       # Left rail, floating controls, search pill
│   ├── splash.css       # Opening animation, reduced-motion fallback
│   ├── profile.css      # Player profile overlay
│   ├── sapiens.css      # Human-origins deep dive
│   ├── tree.css         # SVG tree rendering, node/branch styles
│   ├── timeline.css     # Era browser, extinction markers, playback
│   ├── panel.css        # Species detail panel, hero images, cards
│   ├── hominin.css      # Hominin deep-dive overlay, compare cards
│   ├── features.css     # Legend, zoom, tooltip, quiz, DNA, evo path, tours
│   ├── theme.css        # Light theme overrides, dark mode polish
│   ├── explore.css      # Drill-down shell — unfolding rows, path dots
│   ├── rtl.css          # Hebrew RTL layout overrides
│   └── responsive.css   # Mobile breakpoints, reduced motion, high contrast
├── assets/
│   ├── placeholder.svg  # Fallback image when taxon photo is unavailable
│   └── silhouettes/*.svg # 267 PhyloPic outlines, one per taxon
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
    ├── taxonRank.js     # rankKey(), subtreeDepth() — a node's rank and how deep it runs
    ├── nodeIcons.js     # NODE_ICONS SVG paths + getIconGroup()
    ├── triviaData.js    # TRIVIA_QUESTIONS — 200+ quiz questions
    ├── primateData.js   # PRIMATE_DATA — taxonomy, genome, traits
    ├── geoData.js       # GEO_DATA + BRANCH_DATA — geographic data
    ├── mapPaths.js      # MAP_PATHS — continent outlines for mini-map
    ├── tours.js         # Guided tour engine (3 tours)
    ├── # ── Application modules ──
    ├── actions.js       # Delegated data-action dispatch — the only click wiring
    ├── app.js           # Entry point — init(), action registry, event listeners
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
    ├── explore.js       # Drill-down shell — see *The two shells*
    ├── wayfinder.js     # Back / Home / Share — see *Getting out, and sharing*
    ├── splash.js        # Opening animation — see *The opening screen*
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

**CSS layer:** 15 external stylesheets in `css/` directory, loaded via `<link>` tags.

**Data layer:** 14 ES module files with explicit exports. Widely-shared constants re-exported via `js/data.js` barrel.

**Application layer:** 18 ES modules loaded via `<script type="module" src="js/app.js">`. No build step — native browser module support.

**Shared state:** All mutable state lives in `js/state.js` as a single exported `state` object. Modules import and mutate it directly.

**Dependency injection:** Cross-module calls use late-binding (`initXxxDeps()` functions) to avoid circular imports. `app.js` wires all dependencies at startup.

### Actions — how clicks are wired

Controls declare what they do in markup and `js/actions.js` dispatches from a
single delegated listener on `document`:

```html
<button data-action="view:set" data-mode="cladogram">Cladogram</button>
```

```js
registerActions({ 'view:set': (_a, _b, { el }) => setViewMode(el.dataset.mode) });
```

Handlers are called as `(arg, arg2, ctx)` — `data-arg` and `data-arg2`, then
`{ el, event }`. Arity is fixed so a handler that only wants the element can
still reach it. Register in the module that renders the markup naming the
action, not centrally; `app.js` registers only what `index.html` uses.

Three things follow from this that are worth knowing:

- **Delegation is why runtime markup works.** Panels, the game and the compare
  overlay build their HTML into `innerHTML` long after start-up, and a button
  works the moment it exists because nothing is wired per element.
- **The point is the CSP.** `onclick="…"` is script parsed out of an attribute,
  so permitting one means `script-src 'unsafe-inline'` — which equally permits
  any `<script>` an injection places on the page. There were 54 of these
  attributes; removing them let the policy drop the keyword.
- **A missed action is a silent dead button**, so two static checks guard it:
  `csp:no-inline-handlers` fails on any handler attribute in source, and
  `actions:every-action-has-a-handler` fails on a `data-action` no module
  registers. Both catch controls no browser test happens to click.

Where an element already carries its value (`data-lang`, `data-mode`,
`data-domain`), the handler reads it from there instead of repeating it in a
`data-arg` that could drift.

### The two shells

The site has two front doors, switched from the rail and remembered in
`localStorage` under `tol-shell-view`. `body[data-view]` carries the choice and
the CSS hides one side wholesale.

**Explore** (`js/explore.js`) is the default and the thing a visitor lands on.
One tree, unfolding in place: tapping a group leaves it where it is and opens
its children directly beneath it, indented a step, while the branches you did
not take stay on the page greyed. There is no camera — nothing can be panned
off-screen, zoomed into nothing, or collapsed out from under you, and every tap
has exactly one meaning.

It used to be one screen per level — tap a card, the page is wiped and
repainted as a fresh grid of boxes under a new heading. That was legible but it
was not a tree: every level looked like every other level, and nothing on
screen said the rows you were now reading had come out of the row you tapped.
Boxes hanging under a title is a menu. The unfold is what makes the shape of
the thing visible, which is the entire subject of the site.

**Map** is the radial tree. It is an expert visualisation: lovely once you know
what a clade is, and on a 390px phone it showed four circles in the corner of a
black void with 85% of the screen empty. It is the identity of the site and
worth keeping — it just should not be the front door.

Things worth knowing before changing Explore:

- **It reads every child, ignoring `_hiddenByToggle`.** That flag belongs to
  the map's "show all species" switch, which exists to stop three hundred discs
  crowding the canvas. A list has no such problem, and honouring it made every
  phylum look childless — most of the tree was unreachable.
- **A leaf opens the detail panel** rather than descending into an empty
  screen. `showMainPanel` is injected via `initExploreDeps()` to keep this
  module clear of `panel.js`.
- **Only one lineage is ever open**, and the open path is derived from a single
  `_selected` node rather than stored. The two can therefore never disagree,
  and arriving from search is free: set `_selected` and every ancestor is open
  by construction. It also bounds the page to the depth of the tree (nine) and
  never to its size (305 nodes), so no lazy rendering is needed.
- **The indent staircase is load-bearing, and it is easy to invert.** Rows get
  denser with depth — nine levels of the old 132px cards does not fit a phone —
  and the first attempt shrank the media box by 22px while gaining only 12px of
  indent, so depth 2 rendered *further left* than depth 1 and the nesting
  stopped reading exactly where it mattered. The indent step must exceed the
  media-size drop. Measure the inline-start inset per level rather than
  eyeballing a screenshot; it reads identically in Hebrew when it is right.
- **`scrollIntoView` cannot see the path ribbon.** It scrolls until the row is
  inside the scroll container and stops, and the bottom 69px of that container
  is covered by the view's own fixed bar — so arriving from search on a
  six-deep node parked it at y=796 in an 844px window, correctly scrolled-to
  and entirely hidden. Measure against the ribbon's top edge, not the
  viewport's. `explore:deep-landing-is-visible` is the guard, and the probe's
  own descent cannot catch this because it starts at the root and never travels
  far enough to need scrolling at all.
- **Grey is a contrast problem, not a paint job.** Dimmed rows stay tappable,
  so WCAG gives them no disabled-control exemption. They use `--text-secondary`
  (8.3:1 dark, 8.6:1 light), not a low opacity — and note that
  `a11y:explore-text-contrast` *stops* protecting anything faded below
  `opacity: 0.15`, because the sweep skips it.
- **Its coverage is separate from the map's, and has to be.** The suite seeds
  `tol-shell-view = 'map'` so the tree geometry is measured against the tree,
  which means no sweep written for the canvas can see this view. Explore is
  therefore checked from its own probe — usability, language and contrast. See
  *Explore's own checks* below for what runs there and why each one had to be
  written twice.
- **Rows state their rank, their width and their depth.** "43 inside" answers
  half of what a reader wants before opening something: mammals and insects
  both read as a wall of rows and only one of them has four more levels
  underneath. A group row now reads `Class · 43 inside · 4 levels deep`, and a
  group only one level deep reads `Phylum · 5 species` instead — the same fact
  in the word the site already uses for it. `js/taxonRank.js` supplies both
  halves.

  **Depth is deliberately not named by the rank it ends at**, which was the
  obvious idea and is measurably useless on this data: all 49 groups bottom out
  at Species, so "down to species" prints the same phrase on every row on the
  page. Measure the distribution before choosing a label.

  Rank comes only from an explicit prefix in `latin`. Inferring "two words,
  capital then lower, so it is a binomial" is wrong here and quietly so —
  `invertebrates` carries "Multiple phyla" and `gymnosperms` carries "Various
  families", and both would have been labelled Species on a page whose subject
  is that they are not.

  Russian needs three plural forms, so the Slavic rule is written out in
  `plural()` rather than sampled from the numbers that happen to occur today.
- **The map's furniture is hidden here, and hiding it has a cost.** The era
  slider filters the canvas and does nothing to a card grid, so `#timeline`
  joins the zoom controls and the reveal panel in being hidden — it was also
  painting over the path dots, which is what made this urgent. But a hidden
  strip cannot measure itself (constraint 11), and a language switch, a theme
  toggle or a plain first visit all rebuild it while it is hidden. That is why
  `setShellView` rebuilds the era segments and the density curve on the way
  back into the map. Hide any other self-measuring component here and it needs
  the same treatment.

### Getting out, and sharing

`js/wayfinder.js` owns three controls in one fixed cluster (`#nav-ctrl`): Back,
Home and Share. They work in both shells, on both viewports and over every
overlay.

They did not before. The cluster existed and was translated, and it sat at
`--z-nav + 50` — under the detail panel (400), the games (1000), the hominin
overlay (1100) and a guided tour (10000) — so it was painted over by every
single thing a reader can open. Below 769px it was `display:none` outright. Its
geometry was described in three stylesheets with three different anchors and an
RTL `transform` hack, and it only appeared when the *map's* `navStack` was
non-empty, which the drill-down never touches.

Things worth knowing before changing it:

- **Back takes off one layer, not all of them.** `LAYERS` in `wayfinder.js` is
  ordered topmost-first: tour, tour picker, keyboard help, profile, games,
  species compare, hominin compare *mode*, hominin overlay, the sapiens
  overlay, the detail panel. Only when none is open does back belong to the
  shell — one fold up the drill-down, one step back on the map. A reader who
  opened a tour on top of a species panel expects one Back to take the tour
  away and leave the panel standing, which is also what
  `nav:back-unwinds-one-layer` asserts.
- **Escape and the Back button share that list.** Escape used to carry its own
  copy of "which overlay closes first", so the two could — and did — disagree.
  `app.js` keeps only what the wayfinder does not own: playback mode, the fact
  toast and the search dropdown.
- **Back is never disabled**, and that is a design decision rather than an
  omission. A disabled state has to be refreshed from every module that opens
  or closes anything — nine of them here — and any one that forgets leaves a
  live control greyed out or a dead one lit. `updateNavButtons()` is now an
  empty hook for exactly this reason. At the root, Back falls through to Home,
  which always does something coherent.
- **It is above everything, so everything is beneath it.** `--z-wayfinder` is
  10050 and `--z-splash` was raised to 10500 to stay over it. The cost is that
  the cluster can no longer be *covered* — it can only cover. Its placement was
  chosen by measuring, and four plausible corners were wrong:

  | Corner | What is actually there |
  |---|---|
  | top inline-start | the site title, which `elementFromPoint` sees straight through — the header has no pointer events |
  | mid-row inline-start | the search field, which grows to 280px on a desktop and full width on a phone |
  | inline-start below the header | the left rail, which follows the *start* edge into Hebrew |
  | top inline-end | the detail panel's ✕ — measured at [1398,58]–[1430,90] against a cluster at [1332,56]–[1428,92] |

  That last one was not cosmetic: outranking the panel made the drawer
  impossible to close, on an English desktop only — Hebrew opens it on the
  other edge and a phone opens it as a bottom sheet. It surfaced as a click
  timeout in `interact:expand-all-refits`, three checks away and naming nothing.
  Desktop now uses the gutter below the rail and above the era strip; a phone
  has no gutter, so it uses the corner under the theme cluster and stands aside
  while the search field is expanded.
- **The share link carries the shell and the language, not only the node.**
  Both come from `localStorage` otherwise, so a link naming just the node opened
  in whatever the *recipient* last used. `?node=&view=&lang=` is honoured for
  that visit and never written back — reading someone else's link is not the
  same as changing your own mind, which is why `setShellView()` takes
  `{ persist }` and `init()` validates `?lang=` against `TRANSLATIONS` rather
  than a hardcoded list.
- **The address bar is not the share link.** `showMainPanel` still writes a bare
  `?node=` through `history.replaceState` and `closePanel` still wipes it, so
  after following a shared link the visible URL loses `view` and `lang`. The
  Share button always rebuilds a complete one. Unifying the two means deciding
  what the URL means when no panel is open, which this change did not settle.

### The opening screen

`js/splash.js` draws to `#splash-canvas`: a point of light at the centre
(LUCA) radiating outward generation by generation into a radial tree, while a
readout counts 3,800 Ma down to the present. It runs **4.5 seconds** and can
be skipped from the first frame.

Things worth knowing before changing it:

- **The layout is radial on purpose.** It is the site's own default view, so
  the opening rehearses the real thing instead of showing a different picture.
  It reads the actual `TREE`, pruned to four generations.
- **A wedge at the bottom is left empty** (`GAP`, in radians) and every word
  is drawn inside it. The counter runs there, then hands the spot to the
  title. That is why the text never lands on a branch.
- **The title measures itself** against the wedge's width at its radius and
  shrinks to fit — the Russian and Hebrew titles are much longer than the
  English one, and a narrow phone leaves under 200px of clear width.
- **Colours are read from the theme tokens**, not hardcoded, so the opening
  follows the light theme. Line alpha is boosted there: the palette is built
  for glowing strokes on a dark ground and washes out on cream.
- **`init()` restores theme and language before the splash starts.** It has
  to: the splash sets its skip button and fallback copy once at construction
  and samples both the colour tokens and `documentElement.lang`. When that
  ran afterwards, the opening was English furniture around a Hebrew title.
- **Measurements are drawn `dir="ltr"` even in Hebrew.** `"720 Ma"` is a
  Latin run; laid out RTL it comes back as `"Ma 720"`, the same reordering
  the detail panel avoids on Latin names.
- Reduced motion never starts the loop at all — the stylesheet swaps in
  `#splash-fallback` and `initSplash` returns early.

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

- CSS lives in 15 external files in the `css/` directory, loaded via `<link>` tags
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

### Explore's own checks, and why they are duplicates

The map-view sweeps cannot see the drill-down. The smoke runner seeds
`tol-shell-view=map` before it measures — it has to, because the tree geometry
has to be measured against the tree — so for a while the view a visitor
actually lands on had no language coverage at all, and the suite reported
green over untranslated English and an English paragraph laid out
right-to-left.

**The same blind spot cost the contrast sweep, and it was hiding a real
failure.** `a11y:text-contrast` walked the whole body, but it walked it in map
view, so the drill-down's colours had never been measured. They were not fine:
in the light theme the accent gold sat at 4.40 against text's 4.5 on the back
button and the path label — the two controls that say how to leave and where
you are. Legible enough to pass a glance, and not enough to pass a
measurement. `--accent` was darkened to `#8a5e23`, which is the same fix
`--text-secondary` had already had for the same reason.

Six checks now cover the drill-down, from the probe that already walks it:

| Check | Fails when |
|---|---|
| `i18n:explore-no-latin-leak` | a Hebrew screen shows Latin-script chrome |
| `i18n:explore-prose-reads-as-english` | English data is laid out RTL |
| `i18n:explore-taxa-translated` | a card names a ranked group in English |
| `a11y:explore-text-contrast` | drill-down text falls below AA on any screen |
| `explore:controls-are-not-covered` | something is painted over a card or a control |
| `explore:view-switch-closes-the-panel` | the species panel survives the shell switch |
| `explore:descending-unfolds-in-place` | a descent discards the chain above it |
| `explore:deep-landing-is-visible` | arriving from search parks the node behind the ribbon |
| `explore:rows-state-breadth-and-depth` | a group row understates its width or its depth |

`explore:rows-state-breadth-and-depth` compares each row against the tree
rather than against a pattern — the row has to state the real child count and
the real number of levels below it. A regex for "a number and a word" passes
just as happily on the wrong number.

### The wayfinder's checks

Four more, run from the map pass with a species panel already open, because
"reachable" is the claim and an empty page is the one state in which it was
never in doubt:

| Check | Fails when |
|---|---|
| `chrome:wayfinder-is-reachable` | a Back, Home or Share button is covered — tested with a panel open, and again with a game on top of it |
| `chrome:wayfinder-clears-the-chrome` | the cluster is painted over the title, the rail, the era strip, the panel's ✕, the reveal panel or the zoom rail |
| `nav:back-unwinds-one-layer` | Back closes the game *and* the panel underneath, or neither |
| `share:link-names-node-view-and-language` | the share link omits the shell or the language, or the button produces no toast |
| `share:link-restores-the-senders-view` | following `?node=&view=&lang=` opens in the recipient's shell or language, or rewrites their stored preference |

`chrome:wayfinder-clears-the-chrome` compares *boxes*, not hit tests, and has
to: the header has no pointer events, so `elementFromPoint` reports the canvas
straight through the site title and would have called the original placement
clear while it sat squarely on the words. It found a real bug on its first run
that had nothing to do with the wayfinder — `#left-rail-toggle` pinned a
physical `left`, so on a Hebrew phone the ☰ sat on the opposite edge from the
rail it opens (constraint 8).

`share:link-restores-the-senders-view` needs its own page load, so it is the
last thing `probePage()` does. The runner seeds the *opposite* of what the link
asks for — the map, in the scenario's own language — because a page that
ignored the query string would otherwise look exactly like every other scenario
and pass by accident.

The contrast arithmetic itself is written once, not twice.
`installContrastSweep()` puts it on the page as `window.__contrastSweep(root)`
and both passes call it — the map's over `document.body`, Explore's over
`#explore`. A second copy would be a second set of thresholds to drift out of
step with the first, and then the two views would be held to quietly different
standards. Explore's pass is scoped to its own subtree rather than the body
because the shared chrome above it is already covered by the map pass;
measuring it twice only reports the same failure twice.

**`data-i18n-exempt` is the hinge, and it cannot be used to buy silence.**
An element without it must be translated; an element with it has declared
itself English data, which enrols it in the direction rule instead. So
exempting something moves it from one check to the other rather than out of
both.

Names take `dir="auto"` rather than `dir="ltr"`, because the same element
holds a Hebrew group name on one screen and a Latin binomial on the next —
`auto` resolves the direction from the content, which is measurably `rtl`
for `חיידקים` and `ltr` for `Panthera leo`. Prose that is English by policy
(`.ex-desc`, `.ex-latin`) takes `dir="ltr"` outright.

---

## Images & Attribution

Two layers. The tree draws a **PhyloPic silhouette** on each disc — pure shape,
which is the only thing that reads at 40px — and the panel shows a **Wikimedia
Commons photograph** at 1280px, where it can actually be seen.

`assets/species/` used to hold ten "commissioned illustrations" above both.
They were AI-generated marketing-page mockups — LUCA's was a web page for
"ancientoceans.org", complete with a body-copy column; vertebrates' had a LEARN
MORE button — and being first in the chain they beat the silhouettes and the
real photographs for the ten most prominent nodes on screen. Deleted.

`ImageLoader.getBestUrl(node, size)` is the single resolver. Its chain, best
first:

1. `PHOTO_SNAPSHOT` (`js/photoSnapshot.js`) — Wikipedia's current lead image
2. `PHOTO_MAP` (`js/speciesData.js`) — hand-pinned Commons URLs
3. `node.img`
4. the node's emoji

Silhouettes are resolved separately, by `js/silhouettes.js` — see
*Silhouettes* below.

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
   opens the real page in Chromium and asserts 397 things about layout, i18n,
   contrast and rendering. See *Smoke tests* below.
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
9. **No inline event handlers — they will not run.** `script-src 'self'`
   forbids them, so an `onclick="…"` added to markup or to a template string
   is a control that does nothing, with no error to notice. Use
   `data-action` + `registerActions()` (see *Actions*), and `data-on-error`
   for image fallbacks. Two static checks fail the build on a relapse.
10. **A class cannot close what an inline style opened.** If visibility is
    toggled by a class — `#search-results{display:none}` plus
    `.show{display:block}` — then setting `el.style.display='block'` anywhere
    in JS wins permanently, and the handler that removes the class can no
    longer hide the element. The search dropdown was stuck open over every
    view for the rest of the session after a visitor typed a query and deleted
    it. Toggle the class and nothing else. Same family as constraint 8: an
    override applied at a stronger level cannot be released at a weaker one.
11. **A hidden element cannot measure itself, and will not notice it failed.**
    Anything that sizes itself from a box — trimming labels to their column,
    sizing a canvas to its rect — is written to bail when the box is zero,
    which is correct and silent. So hiding a component means every rebuild it
    receives while hidden is quietly skipped, and it is revealed still carrying
    whatever it last computed. Hiding `#timeline` in Explore did this twice
    over: era names came back sliced mid-word (`ARBONIFEROL`) and the density
    curve came back drawn in the previous theme's ink, because `applyI18n()`
    and `applyTheme()` rebuild both, and start-up builds them *after*
    `setShellView()` has already hidden the strip. Rebuild on reveal —
    `setShellView` does, on the way into the map.
12. **Being in the DOM is not being on screen.** Checks that read
    `textContent`, `aria-label` or `getBoundingClientRect` cannot see that
    something else is painted on top. The drill-down's path dots sat under the
    timeline on both viewports from the day they were written while
    `explore:says-where-you-are` passed, and before that the left rail hid the
    LUCA title on every desktop visit under 312 green checks. Ask
    `document.elementFromPoint` what is actually there —
    `explore:controls-are-not-covered` does.

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

`script-src` is now `'self'` alone — no `'unsafe-inline'`, no `'unsafe-eval'`.
The policy refuses inline script outright rather than only restricting where
external script may come from, which is the difference between narrowing an
injection and stopping one. See *Actions* below for what that cost.

`style-src` keeps `'unsafe-inline'`, and that is not an oversight waiting to be
tidied. Inline `style` attributes are load-bearing here: label sizes have to be
inline to outrank the stylesheet (constraint 7), and the renderer sets
per-element geometry on the fly. An injected `style` attribute also cannot
execute anything, so the two keywords are not comparable risks.

Allowed origins are deliberately narrow — `fonts.googleapis.com` (styles),
`fonts.gstatic.com` (fonts), `upload.wikimedia.org` (every one of the 393
`PHOTO_MAP` images). Species "learn more" links point at ~200 other hosts, but
those are anchor targets, not loaded resources, so CSP does not govern them.

`.github/workflows/verify-deployment.yml` runs the full smoke suite against
the deployed URL whenever Vercel publishes to production, so a green build is
never mistaken for a working page.

---

## Smoke Tests

`scripts/smoke.mjs` opens the real page in Chromium and asserts **397 checks**
— ~65 per scenario across six scenarios (desktop and phone viewports in
English, Hebrew and Russian, plus a desktop pass in the light theme), and four
static checks that read the source before the browser starts. Scenarios differ
in count because some checks are language- or viewport-specific. It runs on every
push and pull request via `.github/workflows/smoke.yml`, and replaces the old
`deploy-check.yml`, which only checked that files existed.

The light theme is loaded rather than toggled at runtime: switching themes also
rebuilds the era strip and the density curve in JS, so a half-applied theme
measures a page nobody ever sees.

```bash
npm run smoke                                      # serve ./ and check it
node scripts/smoke.mjs --url https://example.com   # check a deployed site
node scripts/smoke.mjs --proxy http://host:port    # run from behind a proxy
node scripts/smoke.mjs --only desktop-he           # one scenario, ~1 min
npm run smoke:update-baseline                      # re-record known failures
```

`--only` exists for one job: proving a new check can fail. Break the code,
watch the check go red, put the code back. The full matrix is a ~35 minute
round trip, which is too slow to do that honestly, and a check nobody has
watched fail is a check nobody has tested. It takes a comma-separated list.

Never read a filtered run as a green branch — the summary counts only what
ran and says so. It refuses `--update-baseline` outright, since rewriting the
baseline from a subset would silently delete every entry the skipped
scenarios own.

Screenshots for every scenario land in `.smoke-out/` (git-ignored, and uploaded
as a CI artifact on every run).

### What it checks

| Group | Covers |
|---|---|
| `load:` | uncaught errors, failed requests, SVG render errors, splash dismissal, nothing covering the stage |
| `tree:` | node and branch counts, **NaN coordinates**, fit-to-stage, spill, root visibility, horizontal scroll |
| `chrome:` | header/timeline visible, reveal panel vs. zoom controls and timeline, closed panel off-screen, tooltip and fact toast vs. header, tooltip vs. the node it describes, nothing printed over the species name, **no floating control stretched across the window**, **the wayfinder reachable over every overlay and painted over nothing** |
| `timeline:` | geological era labels clipped or colliding, **and both the labels and the density curve rebuilt on the way back from the drill-down**, where the strip is hidden and cannot measure itself |
| `i18n:` | document direction and lang, every bound control matches its translation, missing translation keys, Latin text leaking into Hebrew, search placeholder, English species prose laid out left-to-right, and the same three rules again **inside the drill-down**, which the map-view sweep cannot reach |
| `a11y:` | every text node meets AA contrast against its effective background, **in the drill-down as well as the map** |
| `explore:` | the drill-down renders, descends and climbs back; **a descent unfolds in place rather than wiping the page**; every screen names where you are; nothing scrolls sideways; nothing is painted over a card or a control; the species panel is dismissed when the shell switches; **every group row states its real width and depth** |
| `nav:` / `share:` | **Back takes off one layer and leaves the one beneath it**; the share link names the shell and the language as well as the node; following such a link opens in the sender's view without overwriting the recipient's stored preference |
| `search:` | eight canonical queries return the answer a person would call correct; every common-name alias still matches something |
| `interact:` | zoom buttons, reset re-fits, parent expands, leaf opens panel, search returns results, camera settles |
| `static/` | Runs before the browser starts, over `index.html`, `js/`, `css/` and `stories/`: CSS custom properties used but never defined; inline event-handler attributes; `script-src` still forbidding inline and eval; every `data-action` resolving to a registered handler |

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
