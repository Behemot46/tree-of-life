# DNA Splash Screen Redesign — Design Spec

## Summary

Replace the current static splash screen with a cinematic Canvas 2D animation where a rotating DNA double helix organically dissolves into an upward-growing Tree of Life. Species photos fill the nodes in evolutionary timeline order (oldest first), accompanied by phase-synced storytelling text and random scientific facts. The animation runs 5–7 seconds for first-time visitors, with skip/fast-forward support, returning-visitor compression, and a CSS-only fallback if Canvas fails.

## Visual Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Helix style | Geometric Wireframe | Clean, scientific, thin strokes with gold backbone and domain-colored nucleotides |
| Unravel style | Organic Dissolve | Smooth drift apart like smoke — natural, evolutionary feel |
| Tree shape | Upward Tree | Classic tree-of-life growing upward from root; universally recognizable |
| Node fill pattern | Ripple by evolutionary timeline | Nodes fill in order of their `appeared` Mya value from TREE data |
| Rendering engine | Pure Canvas 2D | Single render loop, best performance, smooth 60fps, ~150-180 lines |
| Future variant | Radial Burst | Branches radiate from center — implement as a separate view later |

## Animation Phases

### Phase 0 — HELIX (0.0s – 1.5s)

- Dark screen (`#141618`, the project's `--bg`)
- A wireframe DNA double helix fades in at center, slowly rotating
- Backbone strands: smooth quadratic curves in gold (`#c8883a`)
- Nucleotide pairs (rungs): thin lines with small circles at endpoints, colored by domain rotation (`#ef4444`, `#f59e0b`, `#40b8b0`, `#8b5cf6`)
- 14–16 base pairs visible
- Text fades in at ~0.3s: large thin number `"3,800,000,000"` (Inter 200 weight, via `t('splash_big_number')`)
- Subtitle below: `"years of evolution"` (via `t('splash_years_label')`)
- Text fades out at ~1.3s

### Phase 1 — UNRAVEL (1.5s – 3.5s)

- Helix rotation slows to a stop
- Rungs soften and fade (opacity → 0 over ~0.8s)
- Two backbone strands gently drift apart — smooth quadratic easing, no snap
- As strands separate, they begin curving and branching (quadratic bezier subdivision)
- Strand endpoints start migrating toward their target tree-node positions

**Text overlays (sequential, ~0.5s each with 0.1s gap between):**
1. A random cinematic fact from `FACTS.getSplashFact(lang)` (e.g., "Every living cell reads the same genetic code")
2. Dynamic stat: `"{N} species"` — `N` counted at runtime by walking TREE (`t('splash_species_count', { count })`)
3. `"{D} domains → 1 tree"` — `D` counted from TREE's top-level children (`t('splash_domains_count', { count })`)

Each item: 150ms fade-in → 200ms hold → 150ms fade-out → 100ms gap. Total: 0.5s × 3 + 0.1s × 2 = 1.7s, fitting the 2s phase window. Fade-out of one must complete before fade-in of next starts — no overlap.

### Phase 2 — FILL (3.5s – 5.5s)

- Branching structure has resolved into an upward tree shape (~30-40 artistic nodes representing major branches)
- Nodes are empty circles with domain-colored outlines
- Photos begin filling nodes in evolutionary order: sorted by `appeared` Mya descending (oldest first)
- Each photo appears with:
  - Circle fills with preloaded species image (`ctx.drawImage()` with arc clip)
  - Expanding ring pulse in the node's domain color (fades over 400ms)
- Era caption at bottom tracks timeline: `"3,500 Mya — Bacteria"` → `"2,100 Mya — Eukaryota"` → `"200 Mya — Mammals"` → `"0.3 Mya — Homo sapiens"` (using `ERA_NAMES` from `uiData.js`, all via `t()`)
- Caption: small font, low opacity, positioned at bottom — doesn't compete with the visual

### Phase 3 — READY (5.5s – 7.0s)

- Tree settles into final position
- Subtle breathing pulse across all nodes (`sin` wave on radius, ±3%)
- Title fades in: `"Tree of Life"` (via `t('title')`, large, centered above tree)
- Subtitle: `"3.8 Billion Years of Evolution"` (via `t('splash_subtitle')`)
- One final random fact from `FACTS.getSplashFact(lang)` as a teaser below subtitle
- Screen waits for user input

## Text & i18n

All text rendered via `ctx.fillText()` on Canvas — no DOM text overlays.

**Every string goes through `t()`.** New translation keys to add to `TRANSLATIONS` in `uiData.js`:

| Key | EN | HE | RU |
|-----|-----|-----|-----|
| `splash_big_number` | `3,800,000,000` | `3,800,000,000` | `3 800 000 000` |
| `splash_years_label` | `years of evolution` | `שנות אבולוציה` | `лет эволюции` |
| `splash_species_count` | `{count} species` | `{count} מינים` | `{count} видов` |
| `splash_domains_count` | `{count} domains → 1 tree` | `{count} תחומים ← עץ 1` | `{count} доменов → 1 древо` |
| `splash_subtitle` | `3.8 Billion Years of Evolution` | `3.8 מיליארד שנות אבולוציה` | `3,8 миллиарда лет эволюции` |
| `splash_skip` | `Skip` | `דלג` | `Пропустить` |
| `splash_click` | `Click to explore` | `לחץ לחקור` | `Нажмите для исследования` |
| `splash_era_caption` | `{mya} Mya — {name}` | `{mya} מל"ש — {name}` | `{mya} млн лет — {name}` |

**Dynamic counts:** `splash_species_count` and `splash_domains_count` values are computed at runtime by walking the TREE data — never hardcoded.

**Template interpolation:** The `t()` function returns raw strings. `splash.js` handles `{placeholder}` replacement itself via a simple `str.replace(/\{(\w+)\}/g, (_, k) => vars[k])` — no changes to the i18n system.

**Canvas RTL (Hebrew):** When `lang === 'he'`, set `ctx.direction = 'rtl'` and `ctx.textAlign = 'right'` before drawing text. Verify that template interpolation strings like `"{count} מינים"` render with the number on the correct side. Canvas RTL is less forgiving than DOM — test explicitly.

## Interaction

### Click/Touch to Enter
- Click/touch anywhere during any phase → gracefully fast-forward remaining phases into 500ms (helix dissolves quickly, tree snaps into place, title appears), then transition
- No abrupt cut — always a graceful acceleration to the end state

### Skip Button
- Small `"Skip"` text (`t('splash_skip')`), bottom-right corner, `opacity: 0.4`
- Appears after 1s delay
- Click → immediate 500ms crossfade to tree (bypass fast-forward)

### Auto-Transition
- After Phase 3 settles (7s), wait 5 more seconds idle → auto-transition at 12s total
- Transition: canvas fades out over 500ms → `#splash` overlay set to `display: none` → `animateTreeEntrance()` called

### Returning Visitors
- `localStorage` key: `tol-splash-seen` (set to `'1'` after first complete view)
- **First visit:** full 7s animation (Phases 0–3)
- **Return visit:** skip Phases 0–1, start at Phase 2 (tree forming) with 2s compressed duration, then Phase 3 — total ~3s
- Click to skip immediately on any visit

### `prefers-reduced-motion`
- Skip all animation
- Draw a single static frame: the final upward tree with photos filled, title, subtitle, one random fact, and `"Click to explore"` (`t('splash_click')`)
- Still uses Canvas, just one frame — no `requestAnimationFrame` loop

## CSS-Only Fallback

If Canvas fails to initialize within 500ms, a CSS-only fallback is shown:

- The `#splash` overlay contains static HTML elements (hidden by default via `display: none`):
  - Title: `"Tree of Life"`
  - Subtitle: `"3.8 Billion Years of Evolution"`
  - `"Click to explore"`
- `splash.js` sets translated text on fallback elements immediately on init (before the 500ms timeout starts) via `t()`, so they're ready in the correct language if Canvas fails
- A 500ms timeout checks the `canvasReady` flag. If not set, fallback elements are shown (`display: block`)
- If Canvas initializes successfully, the fallback elements remain hidden
- Fallback is clickable — same transition behavior as the skip button

## Performance

- **Photo preloading:** During Phases 0–1 (~2s of helix animation), preload ~30 species images from PHOTO_MAP as `Image` objects, with a concurrency limit of 6 simultaneous fetches to avoid saturating slow mobile connections. Remaining images continue loading during Phase 2 as nodes are filled. By Phase 2 start, most are ready for `ctx.drawImage()`. Failed loads get a solid domain-colored circle fallback.
- **No blocking:** Tree data loads in parallel with the animation. The splash doesn't depend on tree initialization completing.
- **Instant start:** Canvas draws first frame synchronously on init — no blank screen, no spinner.
- **Mobile:** Canvas scales to viewport via CSS (`width: 100%; height: 100%`) with internal resolution matching `devicePixelRatio` (capped at 2x for performance). Animation timing unchanged — Canvas handles 30-40 nodes at 60fps on any modern phone.
- **Memory:** ~30 preloaded images at ~50KB each ≈ ~1.5MB. Released after splash dismissal.

## Responsive

- Helix and tree scale proportionally to `min(viewportWidth, viewportHeight)`
- Text uses relative sizing: title at `Math.min(vw * 0.08, 72)` px, subtitle at `Math.min(vw * 0.035, 20)` px
- Skip button positioned with percentage-based offset from edges
- Tree node count stays at ~30-40 regardless of screen size — no additional nodes on desktop

## Dark/Light Theme

- Splash always renders in dark mode (`#141618` background) regardless of user's theme preference
- If user has light theme selected, the transition to light mode happens during the 500ms crossfade into the tree view (the `data-theme` attribute is already set on `<html>`)

## File Changes

### New Files
| File | Purpose | Est. Lines |
|------|---------|------------|
| `js/splash.js` | Canvas animation engine, phase state machine, interaction handlers, photo preloading | ~150-180 |
| `css/splash.css` | `#splash` overlay positioning, skip button styling, fallback elements, `prefers-reduced-motion` | ~40-50 |

### Modified Files
| File | Change |
|------|--------|
| `index.html` | Replace `#splash` div contents: add `<canvas id="splash-canvas">`, add fallback HTML elements (hidden by default), add `<link>` to `css/splash.css` |
| `js/app.js` | Replace inline splash logic in `init()` with `initSplash()` call + `onDone` callback that hides overlay and calls `animateTreeEntrance()` |
| `js/engagement.js` | Remove `showLoading()` function (fully replaced by splash.js) |
| `js/factLibrary.js` | Add `getSplashFact(lang)` method — returns facts tagged as cinematic/splash-tier; add 5-10 new cinematic facts |
| `js/uiData.js` | Add 8 new translation keys to `TRANSLATIONS` (en/he/ru) per i18n table above |
| `css/theme.css` | Remove old splash CSS: `@keyframes splashFadeUp`, `@keyframes splashLineGrow`, `#splash .splash-child`, `#splash h1`, `#splash .splash-line`, `#splash .tagline` rules |
| `css/responsive.css` | Remove old `#splash h1` responsive overrides, add splash canvas responsive rules if needed |

### Dependency Injection

`splash.js` exports `initSplash(canvas, opts)` where `opts` contains:
```js
{
  tree: TREE,           // for counting species/domains and getting domain colors
  photoMap: PHOTO_MAP,  // for preloading species images
  t: t,                 // i18n translation function
  facts: FACTS,         // fact library for getSplashFact()
  eraNames: ERA_NAMES,  // for Phase 2 era captions
  onDone: () => {}      // callback when splash is dismissed
}
```

No direct imports from data modules inside `splash.js`. Consistent with the project's `initXxxDeps()` pattern.

## Standalone Mockup

Before integrating into the project, build a standalone mockup at `mockups/splash-dna.html`:
- Full 4-phase animation at 60fps with real timing
- Uses project CSS variables for colors
- Loads a handful of real PHOTO_MAP URLs for node fills (with colored circle fallback)
- Click-to-enter, skip button, auto-transition all functional
- Responsive (works at mobile viewport)
- Hardcoded sample data (no imports from project JS) — the mockup is self-contained

The mockup must include a debug toggle button (e.g., "Reset First Visit" / "Simulate Return Visit") that sets/clears the `tol-splash-seen` localStorage key so both the full and compressed animation paths can be tested without clearing browser data.

This mockup is the acceptance criterion: if it looks and feels right in the browser, we proceed with integration.

## Out of Scope

- Radial burst tree variant (future separate view)
- Sound effects or audio
- WebGL / 3D rendering
- Particle effects beyond the node pulse rings
- Any external animation libraries
