# Homo sapiens Showcase Page — Design Spec

## Overview

A full-screen immersive experience that replaces the regular side panel when clicking on Homo sapiens (`h_sapiens`) or the human lineage node (`hominini`) in the tree of life. Five sections in vertical scroll tell the story of our species like a digital museum exhibition.

**Entry points:** `h_sapiens` node, `hominini` node
**Exit:** Close button (X), Escape key, "View on Tree" button
**Architecture:** Overlay Component — isolated full-screen `<div>` injected into DOM, independent from the existing panel system

---

## Architecture

### Approach: Overlay Component (Isolated)

The showcase is a full-screen overlay (`z-index: 500`) that gets created when triggered and destroyed on close. It does not touch or reuse the existing `#panel` element.

### New Files

| File | Purpose | Est. Lines |
|------|---------|------------|
| `js/sapiens.js` | Overlay lifecycle, animations, interactions, drawer | ~500 |
| `js/sapiensData.js` | All static data: migration routes, timeline events, comparison, card content, skull URLs | ~350 |
| `css/sapiens.css` | All showcase styling | ~450 |

### Modified Files

| File | Change |
|------|--------|
| `js/panel.js` | Early return in `showMainPanel()`: if `node.id === 'h_sapiens' \|\| node.id === 'hominini'`, call `openSapiens()` and return |
| `js/app.js` | Import `initSapiensDeps()`, wire in startup sequence |
| `index.html` | Add `<link>` for `css/sapiens.css`, `<script type="module">` for `js/sapiens.js` |

### Dependency Pattern

Follows existing convention:
```js
// sapiens.js exports:
export function initSapiensDeps({ pushNav, navBack, showMainPanel }) { ... }
export function openSapiens() { ... }
export function closeSapiens() { ... }
```

`app.js` calls `initSapiensDeps()` during startup, before the `interceptShowMainPanel` wrapper.

### Interception Point

In `panel.js`, at the top of `showMainPanel(node, url)`:
```js
if (node.id === 'h_sapiens' || node.id === 'hominini') {
  openSapiens();
  return;
}
```

---

## DOM Structure

```html
<div id="sapiens-overlay" class="sapiens-overlay" role="dialog" aria-modal="true" aria-label="Homo sapiens showcase">
  <button class="sapiens-close" aria-label="Close">&times;</button>
  <div class="sapiens-scroll">
    <!-- Section 1: Hero -->
    <!-- Section 2: Migration Map -->
    <!-- Section 3: What Makes Us Us -->
    <!-- Section 4: Comparison Table -->
    <!-- Section 5: Timeline -->
  </div>
  <div class="sapiens-drawer" role="complementary">
    <button class="sapiens-drawer-close" aria-label="Close drawer">&times;</button>
    <div class="sapiens-drawer-content"></div>
  </div>
</div>
```

### Lifecycle

1. **`openSapiens()`** — Creates overlay DOM (lazy), appends to `<body>`, locks body scroll (`overflow: hidden`), builds all 5 sections, triggers hero entrance animation, pushes to `navStack`.
2. Sections 2–5 register IntersectionObserver callbacks for scroll-triggered animations.
3. **`closeSapiens()`** — Fade-out (300ms), removes overlay from DOM, restores body scroll, pops navStack.
4. Close triggers: X button, Escape key, "View on Tree" button (closes + centers tree on `h_sapiens`).

### Drawer Sub-lifecycle

- **`openDrawer(contentFn)`** — Slides from right (panel's `cubic-bezier(0.16, 1, 0.3, 1)`), calls `contentFn` to populate content.
- **`closeDrawer()`** — Slides out, clears content.
- Click outside drawer or Escape closes drawer (not the overlay).

### Z-index

- Overlay: `500` (above panel 400, below modal 1000)
- Drawer: `510`
- Close button: `520`

### Scroll Behavior

```css
.sapiens-scroll {
  overflow-y: auto;
  scroll-snap-type: y proximity;
  height: 100vh;
}
.sapiens-section {
  min-height: 100vh;
  scroll-snap-align: start;
}
```

Proximity snap — sections gently lock when close to edges but allow free scrolling through variable-height content.

---

## Section 1: Hero

Full viewport. African savanna Wikimedia image as background, covered by vertical gradient dissolving into `--bg`.

### Content

- Overline: "The Story of Us"
- Title: "*Homo sapiens*" (italic, light weight 200, `clamp(40px, 7vw, 72px)`)
- Tagline: "300,000 Years and Counting" (accent color)
- Three animated counters: `8,000,000,000+` individuals | `1` species | `300,000` years
  - Count from 0 via `requestAnimationFrame` (~2s ease-out)
  - Essential animation tier — always plays
- "Why 'sapiens'?" pill button → opens drawer with etymology (Linnaeus 1758, naming debate)
- Scroll indicator: pulsing line + "Explore" label (decorative tier, fades on first scroll)

### Visual Treatment

- Warm radial glow behind title text
- Subtle twinkling stars in upper area
- Gradient dividers between counter blocks
- Counter values in JetBrains Mono, labels in small caps
- Mobile: counters stack vertical, title scales via `clamp()`

---

## Section 2: Out of Africa Migration Map

### Base Layer

**Wikimedia equirectangular world map image** (not SVG paths), desaturated + darkened via CSS filters (`saturate(0.3) brightness(0.6)`). This provides high-quality continent outlines without needing to redraw them.

The existing `MAP_PATHS` from `mapPaths.js` are not used here — they're too polygonal for a full-width showcase. They remain for species card mini-maps where they work well.

### SVG Overlay

Normalized viewBox coordinates. Only routes, dots, and labels — no continent outlines in SVG.

### Migration Routes (8 total)

Defined in `sapiensData.js` as:
```js
export const MIGRATION_ROUTES = [
  { id: 'middle-east', path: 'M... Q...', date: 120, label: 'Levant', site: 'Qafzeh Cave, Israel' },
  { id: 'europe',      path: '...', date: 45,  label: 'Europe', site: 'Bacho Kiro, Bulgaria' },
  { id: 'south-asia',  path: '...', date: 70,  label: 'South Asia', site: '...' },
  { id: 'central-asia', path: '...', date: 40, label: 'Central Asia', site: '...' },
  { id: 'east-asia',   path: '...', date: 35,  label: 'East Asia', site: '...' },
  { id: 'australia',   path: '...', date: 65,  label: 'Australia', site: 'Madjedbebe, NT' },
  { id: 'americas',    path: '...', date: 15,  label: 'Americas', site: '...' },
  { id: 'polynesia',   path: '...', date: 3,   label: 'Polynesia', site: '...' },
];
```

Curved Q-bezier connectors showing directionality, not claiming exact routes.

### Animation

- Auto-play on scroll-in via IntersectionObserver: routes animate sequentially with staggered delays
- Three-layer route rendering: faint background line, active solid stroke, flowing dashed animation (`stroke-dasharray` + `stroke-dashoffset`)
- Origin dot (East Africa, 300Ka) pulses continuously
- Destination dots appear with single pulse on route arrival

### Controls

- **Play button** — auto-advances slider from 300Ka to present over ~10s
- **Time slider** — manual scrub, activates/deactivates routes and dots at their Ka threshold
- **Epoch labels** below slider highlight as slider passes through each era
- **Tooltip on dot hover** — glassmorphism card with date, region, key archaeological site

### Mobile

Full-width map, slider thumb 44px touch target, play button + slider stack, epoch labels hidden.

---

## Section 3: What Makes Us Us

### Card Grid

2x2 grid on desktop, single column on mobile. Four interactive cards:

| Card | Icon | Stat | CTA |
|------|------|------|-----|
| 🧠 Brain | Real brain photo header | `1,400 cc` | Compare brain sizes |
| 🗣️ Language | Rosetta Stone header | `6,000+` living languages | Evolution of communication |
| ⚒️ Technology | Stone hand axe header | `3.3M years` of tools | The exponential curve |
| 🧬 DNA | DNA helix header | `99.9% identical` | The 0.1% that varies |

### Card Design

- **Hero image** from Wikimedia Commons, with gradient overlay and emoji badge
- Headline stat in JetBrains Mono (large, bold)
- Engaging description with inline emojis
- **Fun fact callout** with emoji prefix (e.g., 🤯 "Plot twist: Neanderthals had bigger brains")
- CTA with arrow that slides on hover
- Hover: lift (-4px), warm glow, icon pulse, image zoom (1.05x)

### Drawer Content (per card)

Click opens slide-out drawer from right.

#### Brain Drawer

1. **Skull lineup** — Four real Wikimedia skull photos sized proportionally to brain volume:
   - 🐵 Chimpanzee (400cc → 74px height)
   - 🦴 H. erectus (900cc → 100px)
   - 🧍 H. sapiens (1,400cc → 120px, warm glow highlight)
   - 🏔️ Neanderthal (1,500cc → 128px, blue "surprise" highlight)
   - Confirmed working URL: chimp skull (`Pan_troglodytes_02_MWNH_230.jpg`). Other 3 need verified URLs during implementation. Emoji fallback if images fail.
   - Background removal for skull images in later polish pass.

2. **Neural density comparison** — 2x2 card grid:
   - Sapiens: 16B cortical neurons
   - Neanderthal: ~12B estimated
   - Prefrontal cortex: 38% of sapiens cortex (planning, language, social)
   - Occipital lobe: larger in Neanderthals (vision, not thinking)

3. **Energy budget ring** — Donut chart: 20% energy for 2% body mass, with fun facts (20 watts = dim lightbulb, cooking unlocked calories, gut shrank as brain grew)

4. **Brain growth timeline** — Vertical mini-timeline: 6Ma chimp split → 2.5Ma stone tools → 1.8Ma fire → 600Ka rapid expansion → 300Ka sapiens

#### Language Drawer
Mini-timeline: gestures (2Ma) → sounds (500Ka) → symbolic language (100Ka) → writing (5Ka) → internet (30 years)

#### Technology Drawer
Exponential curve visualization showing 99% stone tools / 1% everything else

#### DNA Drawer
Visual strip showing 0.1% variation sources + Neanderthal (2%) and Denisovan (0.5–5%) admixture segments

---

## Section 4: Us vs. Our Closest Kin

### Desktop: Glassmorphism Comparison Table

5 species across, 8 categories down:

| Category | Visual Treatment |
|----------|-----------------|
| 🧠 Brain | **Inline mini bar charts** — width proportional to volume, Neanderthal blue, sapiens gold |
| 📏 Height | **Stick-figure silhouettes** — proportional body height bars with circle heads |
| ⏳ Lived | **Horizontal timeline bars** on shared 8Ma scale, living species have glowing "now" dot |
| 🔧 Tools | Emoji progression (lit vs dimmed): 🪵🪨🔧⚙️🚀 |
| 🗣️ Language | Text: "Gestures" → "Proto-language?" → "Full symbolic 🌍" |
| 🎨 Art | ❌ / 🤔 debated / 🎨 ✅ |
| 🧬 DNA | Percentage match to sapiens (from `DNA_KNOWN`) |
| 💚 Status | Green "🟢 Alive" / Red "💀 ~40 Ka" badges |

Sapiens column permanently highlighted with warm accent background.
Species headers are clickable → navigate to their panel in the tree via `showMainPanel(nodeMap[id])`.
First 3 rows use visual data representations; remaining rows use text/emoji (sufficient for those categories).

### Mobile (<768px): Horizontal Swipe Cards

Table hidden, replaced by horizontal cards with CSS `scroll-snap-type: x mandatory`. Each card shows one species with all its stats. Dot indicators track position.

Touch swipe engine: ~50 lines handling `touchstart`/`touchmove`/`touchend`.

---

## Section 5: Our Timeline

Vertical timeline, 300,000 years to present. **Logarithmic spacing** so both 290K years of prehistory and 5K years of civilization get adequate visual room.

### Visual Design

- **Central line** with gradient: dim at top (ancient) → bright gold at bottom (present)
- **Three dot sizes:** regular (10px), major (14px), present (14px + pulsing glow)
- **Era separators** with labels: Origins, Behavioral Revolution, Global Spread, Civilization, Modern Era
- Events animate in via IntersectionObserver (staggered, decorative tier)

### 17 Events

| Date | Event | Major? |
|------|-------|--------|
| 300 Ka | First H. sapiens (Jebel Irhoud) | ✅ |
| 200 Ka | Omo remains | |
| 100 Ka | First burial (Qafzeh) | ✅ |
| 77 Ka | First symbolic marks (Blombos) | |
| 65 Ka | Arrival in Australia | ✅ |
| 45 Ka | Cave art begins (Sulawesi) | ✅ |
| 40 Ka | Neanderthals vanish | |
| 36 Ka | Chauvet paintings | |
| 15 Ka | Arrival in Americas | ✅ |
| 12 Ka | Agriculture invented | ✅ |
| 5 Ka | Writing invented | ✅ |
| 2.5 Ka | Philosophy (Axial Age) | |
| 500 yr | Scientific revolution | |
| 70 yr | DNA discovered | |
| 55 yr | Moon landing | |
| Present | 8 billion humans | ✅ (pulsing) |

### Click to Expand

Each event is clickable → opens slide-out drawer with a paragraph and Wikimedia image.

### The 1.7% Callout

At the bottom of the timeline:
- Large stat: **1.7%**
- Text: "All of recorded human history fits into 1.7% of our species' existence"
- Proportional strip visualization: massive gray bar (295K years) + tiny gold sliver (5K years)

---

## Animation Strategy

### Two Tiers

| Tier | Behavior | Examples |
|------|----------|---------|
| **Essential** | Always plays | Hero counters, migration map route animation |
| **Decorative** | Respects `reducedMotion()` from `utils.js`, pauses off-screen via IntersectionObserver | Card staggers, pulse effects, timeline fade-ins, scroll indicator, skull hover lifts |

All animations use `requestAnimationFrame` or CSS transitions/keyframes. No JS animation libraries.

---

## Cross-Cutting Concerns

### Navigation Integration

- Species names mentioned anywhere in the showcase are clickable → call `showMainPanel(nodeMap[id])` to open their regular panel
- "View on Tree" button closes showcase and centers tree on `h_sapiens`
- Back button (existing nav system) returns to showcase if it was the previous nav state

### i18n (en/he/ru)

All text strings stored in `sapiensData.js` with translation keys. Rendered via `t()` function from `theme.js`. Hebrew triggers RTL layout — timeline moves to right side, drawer slides from left.

### Responsive

- All sections use `clamp()` for typography
- Card grid: 2x2 → 1 column at `≤640px`
- Comparison table → swipe cards at `≤768px`
- Migration map: full-bleed, slider stacks below
- Timeline: shifts left on mobile, full-width events
- Drawer: full-width at `≤640px`

### Styling

All derived from existing CSS custom properties:
- `--bg`, `--surface`, `--text-primary`, `--accent` (gold)
- `--font-head`, `--font-body` (Inter), `--font-mono` (JetBrains Mono)
- `--sp-*` spacing scale, `--shadow-*`, `--ease-standard`
- Glassmorphism: `backdrop-filter: blur()` + semi-transparent backgrounds
- Light theme: works via existing `[data-theme="light"]` overrides — `css/sapiens.css` includes light theme variants for backgrounds, text colors, and borders. The dark aesthetic is primary; light theme ensures readability but doesn't need to match the dark version's atmosphere.

### Images

All from Wikimedia Commons (public domain / CC-BY-SA). Each image URL stored in `sapiensData.js` with a fallback strategy:
1. Try Wikimedia URL
2. On error: show gradient background + emoji
3. Skull images: background removal in later polish pass

### Performance

- Overlay DOM built lazily (only when opened)
- Destroyed on close (not hidden)
- IntersectionObserver gates decorative animations to visible sections only
- Images load with `loading="lazy"` where supported (not in SVG foreignObject — use JS lazy loading instead)

---

## Data Shape in `sapiensData.js`

```js
export const SAPIENS_HERO = {
  bgImage: 'https://...wikimedia-savanna.jpg',
  counters: [
    { value: 8000000000, label: 'individuals', suffix: '+' },
    { value: 1, label: 'species' },
    { value: 300000, label: 'years' },
  ],
  etymologyDrawer: { ... },
};

export const MIGRATION_ROUTES = [ ... ];  // 8 routes with paths, dates, labels, sites

export const TRAIT_CARDS = [
  { id: 'brain', icon: '🧠', label: 'The Brain', stat: '1,400', unit: 'cubic cm', ... },
  { id: 'language', icon: '🗣️', ... },
  { id: 'technology', icon: '⚒️', ... },
  { id: 'dna', icon: '🧬', ... },
];

export const COMPARISON_SPECIES = [ ... ];  // 5 species with all comparison data
export const COMPARISON_CATEGORIES = [ ... ];  // 8 categories with rendering hints

export const TIMELINE_EVENTS = [ ... ];  // 17 events with dates, titles, descriptions, drawer content
export const TIMELINE_ERAS = [ ... ];  // 5 era labels with position hints

export const SKULL_IMAGES = {
  chimpanzee: { url: '...Pan_troglodytes_02_MWNH_230.jpg', height: 74 },
  erectus: { url: '...TBD-verify', height: 100 },
  sapiens: { url: '...TBD-verify', height: 120 },
  neanderthal: { url: '...TBD-verify', height: 128 },
};
```

---

## Implementation Priority

1. **Overlay shell + Hero** — Entry point, lifecycle, close/escape, hero section
2. **Migration map** — Wikimedia base image, SVG overlay, route animation, slider
3. **Comparison table** — Desktop table with visual rows, mobile swipe cards
4. **Trait cards + drawers** — 4 cards, brain drawer with skulls/energy/density/timeline, other 3 drawers
5. **Timeline** — Logarithmic layout, events, era labels, 1.7% callout
6. **i18n** — Hebrew + Russian translations for all strings
7. **Mobile polish** — Responsive breakpoints, touch interactions, drawer full-width
