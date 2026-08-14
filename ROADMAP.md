# Roadmap — Tree of Life

The decision record for this project. `CLAUDE.md` describes how the code works
today; this file describes **why it is that way** and what is still open.

---

## Where things stand

An interactive phylogenetic visualisation of 3.8 billion years of evolution,
in English, Hebrew and Russian. Static files, no build step.

Every push and pull request runs `scripts/smoke.mjs`, which opens the real page
in Chromium and asserts **282 checks across six scenarios** — desktop and
phone, in all three languages, plus a desktop pass in the light theme. It is
green.

---

## Open questions

Things waiting on a decision rather than on work.

| Question | Why it matters |
|---|---|
| **Deleting three unreachable modules** | `js/trivia.js`, `js/quiz.js` and `js/imagePrompts.js` are imported by nothing — `game.js` superseded the first two. They are ~1,400 lines that every reader has to rule out. Deleting them is a decision, not a fix. |
| **Switching GitHub Pages off** | `deploy.yml` is gone, so Pages no longer updates, but it keeps serving its last build until disabled in Settings → Pages. Only reachable by hand. |
| **Vercel's recommended `www` CNAME** | Vercel suggests `www → 2f3b9f3357c6e4e5.vercel-dns-017.com.` and notes the legacy records keep working, so this is tidiness rather than a fix. |

### Answered

| Question | Answer |
|---|---|
| Phone layout for a wide tree | **Leave it.** The horizontal fit is acceptable; a portrait-specific layout is not worth the complexity. |
| Localising species names | **Major taxonomic groups only.** The 50 ranked groups are translated; individual species stay English. See `js/taxonNames.js`. |
| Content-Security-Policy | **Added**, defined in `vercel.json` and enforced by `serve.js` so the smoke suite checks the real policy. |
| `SECURITY.md` | **Rewritten** for what this project actually is: a static site with no backend and no releases. |
| The custom domain | **Live at `www.treeoflife.wiki`**, verified by running the full suite against the deployed site rather than assuming it worked. Pages retired afterwards. |
| The 31 inline `onclick` handlers | **Gone**, along with 23 more the modules generated at runtime. `script-src` is now `'self'` with no `'unsafe-inline'`. See the decision log below. |

---

## Decision log

### 2026-08 — A new opening screen

| Decision | Rationale |
|---|---|
| Four and a half seconds, not twelve | The old opening ran a four-phase DNA-helix sequence and auto-dismissed at twelve seconds. Nothing on a website earns twelve seconds before it can be used. Skip is now live from the first frame rather than fading in after one. |
| The tree it shows is the tree the site draws | The old screen unravelled a helix into a flat fan that appears nowhere in the app, so the first thing a visitor learned was wrong. The opening is radial, reads the real `TREE`, and rehearses the actual default view. |
| Deep time as the running caption | One number counting 3,800 Ma down to the present says what the site is about. It replaced three static captions — a species count, a domain count, a fact — that each said less. |
| An empty wedge for the words | The old title was drawn on top of the branches and fought them for legibility. Leaving an angular gap at the bottom and anchoring every line inside it means the text never crosses a branch, and the tree keeps its full size. |
| The title measures itself | "Дерево жизни" and "עץ החיים" are much wider than "Tree of Life", and a phone leaves under 200px of clear width. Fitting to the measured gap beats picking a font size per breakpoint and hoping. |
| Theme tokens, not constants | The old canvas hardcoded `#141618` and stayed dark behind a light page. Reading the same custom properties the stylesheet defines is what makes the opening follow the theme. |
| Theme and language restored before the splash runs | Found by looking: the skip button read "Skip" in Hebrew. `initSplash` sets its one-off copy at construction and samples `documentElement.lang`, and both were being set seventy lines later — so the opening was English furniture around a Hebrew title, and canvas text never went RTL. |
| Measurements forced LTR | `"720 Ma"` rendered as `"Ma 720"` in Hebrew. It is a Latin run in an RTL paragraph, the same case the detail panel already handles with `dir="ltr"` on Latin names. Caught in a screenshot, not by a check. |
| Skip is a real button | It had been a `<div>`, so it could not be reached or activated from the keyboard. |

### 2026-08 — Inline handlers removed, CSP tightened

| Decision | Rationale |
|---|---|
| One delegated dispatcher, not per-element listeners | Half the handlers were in template strings the modules write into `innerHTML` after start-up. Wiring those individually means re-wiring on every re-render; one listener on `document` means a control works the moment it exists. |
| The real count was 54, not 31 | The roadmap line said 31, which was the markup. Another 23 lived inside JS template strings, and CSP governs those identically — an attribute is an attribute whoever wrote it. Scope was checked before the work started rather than discovered halfway. |
| `style-src` keeps `'unsafe-inline'` | Not the same risk and not the same cost. Label sizes must be inline to outrank the stylesheet (CLAUDE.md constraint 7), the renderer sets geometry per element, and an injected `style` attribute cannot execute anything. |
| Action names read from existing data-attributes | The language, view and legend controls already carried `data-lang`, `data-mode`, `data-domain`. Repeating those values in a `data-arg` would have created two sources of truth that drift. |
| `game.js`'s dispatcher folded into the shared one | It had grown its own `data-action` vocabulary and its own listener. Two dispatchers watching the same attribute means every game click is a candidate for running twice. Its names kept their original spelling — renaming thirty markup sites for consistency would risk a silent dead button. |
| Two static checks, not just the runtime one | The existing CSP check only sees violations from handlers that actually fire during the interaction phase. `csp:no-inline-handlers` reads the source, so it covers files a given run never reaches, and `actions:every-action-has-a-handler` catches the new failure mode this pattern introduces: an action nothing registered, which fails by doing nothing at all. |
| Both new checks were tested by breaking them | A check that cannot fail is worse than no check. Each was run against a deliberately injected defect and confirmed red before being trusted. |
| Globals deleted rather than left behind | Forty-odd `window.x = x` lines existed solely so `onclick="x()"` could reach them. One survives (`navigateTo`), because two modules genuinely call it across the circular-import boundary. |

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
| CSP lives in `vercel.json`, read by `serve.js` | One source of truth. A policy that would break the deployed site breaks locally and in CI first, instead of only being discovered in production. |
| CSP violations are read *after* the interaction phase | Inline event handlers are only evaluated when they fire, so reading on load would miss every `script-src` mistake. Found by testing the check rather than trusting it. |
| Only ranked taxa are translated | A half-translated tree reads worse than a consistently English one. The rank prefix in the `latin` field is the boundary, so the rule is data-driven rather than a hand-maintained list. |
| `photo-check.yml` fails on an empty extraction | It had been matching zero of 393 URLs for months and reporting success. A checker that cannot tell "nothing broken" from "nothing checked" is worse than none. |

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
