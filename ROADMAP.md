# Roadmap — Tree of Life

The decision record for this project. `CLAUDE.md` describes how the code works
today; this file describes **why it is that way** and what is still open.

---

## Where things stand

An interactive phylogenetic visualisation of 3.8 billion years of evolution,
in English, Hebrew and Russian. Static files, no build step.

Every push and pull request runs `scripts/smoke.mjs`, which opens the real page
in Chromium and asserts **174 checks across five scenarios** — desktop and
phone, in all three languages. It is green.

---

## Open questions

Things waiting on a decision rather than on work.

| Question | Why it matters |
|---|---|
| **Custom domain name** | Stage 4 cannot finish without it. Vercel is deploying; the domain is unconnected. |
| **Phone layout for a wide tree** | The radial tree is ~2:1; a phone screen is ~1:2. It fits the width correctly and leaves vertical space empty. A portrait-specific layout (or defaulting phones to the cladogram) would fix it, but that is a design choice. |
| **Localising species names** | 336 species names are English-only, so "Dugong" shows in Hebrew. The UI chrome is fully translated. This is a content project, not a code one. |
| **Content-Security-Policy** | The page pulls from Google Fonts, a D3 CDN, Wikimedia and the Wikipedia API. A policy that misses one breaks the site silently, so it should land with a check that would catch the mistake. |
| **`SECURITY.md`** | Still GitHub's unfilled template — it advertises versions 4.0/5.0/5.1 that do not exist and tells the reader to "use this section to tell people…". |

---

## Decision log

### 2026-08 — Takeover and polish

| Decision | Rationale |
|---|---|
| Verification before fixes | The suite was written and landed *before* any bug was fixed, so every later change had something to prove itself against. It found three problems nobody had reported. |
| Baseline file of known failures | Let the suite land red-in-truth but green-in-CI. The run fails both on a new failure **and** on a baselined check that starts passing, so each fix has to delete its own entry. The file went 44 → 0 over three stages and is now empty. |
| Smoke checks replace `deploy-check.yml` | The old workflow only asserted that files existed. It could not have caught a single one of the reported problems. |
| One `fitTreeToStage()` for all framing | The camera had been pinned to a hardcoded `scale(0.18)` in five places. Start-up, reset, view switches and resize now share one path, so they cannot drift apart again. |
| Fit measures the rendered bbox, not node positions | Labels extend past their nodes. Because labels are sized in world units, `getBBox()` is independent of zoom, so one pass is exact instead of iterative. |
| The "stage" excludes header, timeline and side rail | Fitting to the raw viewport hides part of the tree behind chrome. Corner widgets are deliberately *not* subtracted — reserving their full height would waste most of the screen. |
| Nothing is cached immutably | No asset is content-hashed, so an `immutable` header on `js/app.js` would strand visitors on old code with no way to bust it. ETags make revalidation cheap. |
| Species names exempt from i18n checks | The tree data is English-only. Marked `data-i18n-exempt` in the markup so the boundary is explicit and the check still guards everything else. |
| Era labels hide rather than clip | Segment widths are proportional to geological time, so no fixed heuristic fits every language. A missing label reads as deliberate; `Paleoproterozo` reads as broken. The full name moved to the tooltip. |
| Pages stays until the domain works | Two hosts briefly, rather than a window with none. |
| Proxy support is opt-in (`--proxy`) | Reading `HTTPS_PROXY` automatically broke plain `--url` runs against a local server — the mode CI uses. Shipped, then corrected once tested. |

### Earlier decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-11 | Inter + JetBrains Mono + Heebo | Modern scientific look with Hebrew and Cyrillic coverage |
| 2026-03-12 | SVG silhouette icons over emoji | Cross-platform consistency |
| 2026-03-13 | `ImageLoader` fallback chain | Generated → `PHOTO_MAP` → emoji; degrades gracefully |
| 2026-03-28 | J-series replaced the p-series | Fresh start after an audit |
| 2026-03-29 | Unified nav stack | `panelHistory`/`panelBack` removed in favour of one stack |
| 2026-04-03 | CSS extracted from `index.html` into `css/` | The "keep all CSS inline" decision from 2026-03-10 no longer held once the file grew past readability |
| 2026-04-03 | JS split into ES modules with late-bound deps | Avoids circular imports without a bundler |

---

## Shipped

Condensed from the p- and J-series logs, which are no longer kept as separate
files. Git history has the detail.

**p-series (2026-03)** — data extracted to modules; fuzzy trilingual search;
hominin lineage (28 species); interactive geological timeline; mobile
responsiveness with touch and pinch-zoom; alternate tree views; navigation
history stack; species image system with `PHOTO_MAP`; rich species panels; DNA
similarity calculator.

**J-series (2026-03 → 2026-04)** — design-system cleanup (z-index scale, accent
token consolidation); navigation polish; code modularisation into ES modules;
accessibility foundation; SVG performance and viewport culling; discovery and
fun features; data enrichment; offline/PWA support; guided tours.

**2026-04** — collapsed-by-default tree; superarchaic DNA story exhibit; game
modes and achievements; Reveal panel (depth slider + species toggle).

**2026-08** — browser smoke suite in CI; fit-to-stage camera; the rendering,
layout and i18n fixes listed in the decision log above.

---

## Architectural principles

1. **No build step** — static files, CDN dependencies, ES modules natively.
2. **No runtime dependencies** — `package.json` exists only to pin Playwright
   for the tests and is never shipped to the browser.
3. **Vanilla JS** — no frameworks.
4. **Data-driven** — content lives in JS data files, separate from rendering.
5. **Trilingual, RTL-aware** — Hebrew is a first-class layout, not a translation
   layer bolted on.
6. **Verified in a real browser** — anything that changes the site is checked on
   desktop and phone, in Hebrew as well as English, before it merges.
