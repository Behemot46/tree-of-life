# Superarchaic DNA Story Exhibit — Design Spec

**Date:** 2026-04-06
**Status:** Approved
**Branch:** TBD (will be created during implementation)

---

## Overview

An interactive, scroll-driven story page titled "How Human Are You?" that presents the discovery that ~20% of human DNA comes from an unidentified superarchaic hominin species. The exhibit follows a 7-section museum-hall narrative, building from a provocative hook to a mind-bending conclusion.

**Content source:** Rogers, A.R. et al. (2020). "Neanderthal-Denisovan ancestors interbred with a distantly related hominin." *Science Advances.* DOI: [10.1126/sciadv.aay5483](https://doi.org/10.1126/sciadv.aay5483). Reported by Taub, B. in IFLScience.

**Target audience:** Make complex population genetics viscerally understandable to a 14-year-old.

**Tone:** Wonder, not sensationalism. "How amazing" not "how scary." Present as "recent research suggests" — not absolute settled fact.

---

## Architecture

### Approach: Standalone HTML page with light shared story infrastructure

The exhibit is a standalone page at `stories/superarchaic-dna.html`, not an overlay. This enables direct linking, clean separation from the main SPA, and establishes a "Stories" content category for future exhibits.

### File Structure

```
stories/
├── superarchaic-dna.html    # The exhibit page (standalone HTML document)
├── story-base.css           # Shared: scroll-snap sections, typography, fade-in, glassmorphism
├── story-utils.js           # Shared: IntersectionObserver helper, reduced-motion, scroll progress
├── superarchaic-dna.css     # Story-specific: ring, genome bar, ghost, mosaic, map visuals
└── superarchaic-dna.js      # Story-specific: animations, scroll-driven logic, data constants
```

### HTML Page Loads

1. `../css/variables.css` — site-wide design tokens (colors, fonts, spacing, shadows)
2. `story-base.css` — shared story layer
3. `superarchaic-dna.css` — this story's visuals
4. Google Fonts — same Inter / JetBrains Mono / Heebo stack as main site
5. `story-utils.js` as ES module
6. `superarchaic-dna.js` as ES module

### Navigation Bridge

- Header: back button linking to `../index.html`
- CTA (Section 7): "Explore the Hominin Family" links to `../index.html?node=hominini`
- DOI link (Section 7): links to `https://doi.org/10.1126/sciadv.aay5483`
- No shared runtime state with the main tree application

### Entry Point from Main Site

A "Stories" button/link added to the main page navigation, linking to `stories/superarchaic-dna.html`.

---

## Shared Story Layer

### `story-base.css` (~100-150 lines)

Provides reusable CSS classes for any future story exhibit:

- `.story-page` — full page container, dark background (`var(--bg)`), scroll-snap-type `y proximity`
- `.story-section` — `min-height: 100vh`, scroll-snap-align `start`, flex column centered, padding for header/footer
- `.story-header` — fixed top bar with back button and story title
- `.story-overline` — small caps accent-colored label above section titles
- `.story-title` — `clamp(28px, 4.5vw, 48px)`, font-weight 200, primary text color
- `.story-text` — body text, max-width 560px, line-height 1.7, secondary text color
- `.story-close` — glassmorphism close/back button (matches sapiens pattern)
- `.reveal` / `.revealed` — fade-in + slide-up animation base class (triggered by JS)
- `.story-citation` — small footer text for sources
- `.story-cta` — pill-shaped call-to-action button with accent border

### `story-utils.js` (~80-120 lines)

Provides reusable ES module helpers:

```js
export function reducedMotion()
// Returns true if prefers-reduced-motion: reduce

export function onVisible(el, callback, opts)
// IntersectionObserver wrapper. Respects reducedMotion unless opts.essential=true.
// opts: { threshold, repeat, essential }

export function scrollProgress(el)
// Returns 0–1 progress of element through viewport (0 = just entering, 1 = fully passed)

export function revealOnScroll(container)
// Finds all .reveal elements in container, adds .revealed when visible
```

---

## Section Specifications

### Section 1: "How Human Are You?" (The Hook)

**Layout:** Centered content, full viewport height. Overline + title + SVG ring + subtext.

**Visual — DNA Percentage Ring:**
- SVG donut chart using `stroke-dasharray` / `stroke-dashoffset`
- Two segments: Sapiens (amber `--accent`) and Unknown (purple `#7b4fbf`)
- Ring size: ~200px diameter on desktop, ~140px on mobile
- The 20% purple segment has `filter: drop-shadow(0 0 12px rgba(123,79,191,0.5))` for glow

**Animation:**
- Ring starts at 100% on page load. As user scrolls DOWN past the section midpoint, ring animates to 80% Sapiens + 20% purple
- Counter text updates in sync: "100%" → "80%"
- Duration: ~1.5s ease-out, triggered once via `onVisible()` (not continuously scroll-linked — fires when section is 50% visible)
- A scroll-down indicator ("Scroll to discover" + animated chevron) encourages the user to start scrolling

**Reduced motion:** Static at final state (80%), no animation.

**Text:** "You probably think you're 100% Homo sapiens. You're not. Recent genetic research reveals that a full 20% of your DNA was inherited from a species we haven't even identified yet — a ghost lineage that vanished from the fossil record but lives on inside you."

---

### Section 2: "The 2% We Already Knew About"

**Layout:** Centered title + horizontal genome bar + explanatory text.

**Visual — Genome Bar v1:**
- Horizontal SVG stacked bar, rounded ends, ~80% viewport width (max 600px)
- Two segments: 98% dark (`var(--surface-raised)`) + 2% terra-red (`var(--terra)`)
- The 2% segment is deliberately tiny — visually emphasizes insignificance

**Animation:**
- Bar fades in on scroll (`.reveal` class)
- Neanderthal 2% segment pulses: `@keyframes barPulse` — subtle opacity 0.7–1.0, 2s infinite

**Reduced motion:** Bar visible, no pulse.

**Text:** "For years, the big headline was that modern humans carry about 2% Neanderthal DNA — evidence of interbreeding ~60,000 years ago in Eurasia. It felt like a footnote. A minor subplot in our origin story. But that was before we looked deeper."

---

### Section 3: "Then We Found the Other 20%" (The Bombshell)

**Layout:** Centered title + expanded genome bar + impact text.

**Visual — Genome Bar v2:**
- New SVG bar (not morphed from Section 2 — separate element styled for visual continuity)
- Three segments: 78% dark (Sapiens), 20% purple gradient (`#5b3d8f` → `#7b4fbf` → `#9b6abf`), 2% terra-red (Neanderthal)
- Purple segment has `box-shadow` / `filter` glow
- Floating "?" text inside the purple segment, opacity-animated

**Animation:**
- On scroll entry, purple segment expands from 0 → full width with CSS `transform: scaleX()` + brief `scale(1.03)` pulse on completion
- Optional screen-shake: 200ms CSS `translate` jitter on the section container when purple segment lands. Implemented as `@keyframes sectionShake` — easy to remove if gimmicky.
- Duration: expansion ~0.8s, pulse ~0.3s

**Reduced motion:** Full bar visible immediately, no expansion/shake.

**Text:** "A 2020 study by Professor Alan Rogers and colleagues revealed something staggering: roughly 20% of the human genome comes from a completely unknown hominin species. Not Neanderthal. Not Denisovan. Something older. Something we've never found a fossil for. Rogers called it not a simple exchange of genes, but 'a merger of two populations' — fundamentally rewriting our origin story."

---

### Section 4: "A Ghost Species"

**Layout:** Centered title + 4 silhouette figures in a row + descriptive text.

**Visual — Silhouette Lineup:**
- 4 SVG `<path>` human-shaped silhouettes, abstract/geometric style (not photo-realistic)
- **Distinct proportions per species:**
  - Neanderthal: stockier, shorter, broader shoulders
  - Denisovan: broader build, medium height
  - Homo sapiens: taller, slimmer
  - Ghost: same height as Sapiens (unknown — could be anything)
- Known species: solid fills with low opacity (terra-red, teal, amber)
- Ghost figure: dashed outline (`stroke-dasharray`), purple color, no fill

**Animation:**
- Ghost flickers: `@keyframes ghostFlicker` alternating opacity 0.15–0.55, irregular timing (not sinusoidal — use `steps()` or multi-stop keyframes for organic feel)
- Layer a second, longer-period keyframe (~8-10s cycle) that includes a brief "vanish" (opacity drops to 0.05 for ~400ms). Creates a rhythm of "there... there... GONE... there" that feels unsettling and alive.
- Known figures fade in on scroll, ghost flickers continuously

**Reduced motion:** Ghost at static 0.4 opacity, no flicker. All figures visible.

**Text:** "This 'superarchaic' lineage diverged from our branch over 1 million years ago. They lived in Africa, evolved in parallel with our ancestors for hundreds of thousands of years, and then — at some point deep in prehistory — merged with the population that would become us. We carry their genes, but we have no skulls, no tools, no cave paintings. Only their DNA signature, hiding in our genome like a message from a species that left no other trace."

---

### Section 5: "It Happened Twice"

**Layout:** Centered title + SVG world map + explanatory text.

**Visual — Merge Event Map:**
- Placeholder SVG world map with simplified continent outlines (will be replaced by improved mini-map from separate project)
- Two merge events shown as colored dots + animated dashed arrow paths:
  - **Event 1 (Africa):** Purple dot + arrow. Superarchaic Population A → proto-Sapiens ancestors (~500+ Kya)
  - **Event 2 (Eurasia):** Terra-red dot + arrow. Superarchaic Population B → proto-Neanderthal/Denisovan lineage
- Labels on each event with approximate date

**Animation:**
- Events appear sequentially on scroll: Africa first, then Eurasia with ~0.5s delay
- Arrow drawing: `stroke-dashoffset` animation (line draws along path)
- Destination dot ripple: when arrow reaches destination, dot briefly pulses with expanding ring (`@keyframes dotRipple` — circle scales up and fades out)

**Reduced motion:** Both events fully visible, arrows drawn, no animation.

**Text:** "The study identified two distinct superarchaic populations involved in these ancient encounters. One group likely interbred with the ancestors of Neanderthals and Denisovans in Eurasia — potentially descendants of Homo erectus. But the African population that contributed 20% of OUR genome? No current suspects. No fossils. No name. Just the ghost in our DNA."

**Note:** The placeholder map is intentionally simple. A separate project will deliver an improved mini-map component that can be swapped in here.

---

### Section 6: "You Are a Mosaic"

**Layout:** Centered title + mosaic human figure + descriptive text.

**Visual — Mosaic Figure:**
- CSS grid: 8 columns × 12 rows = 96 tiles
- Clipped into human silhouette shape via CSS `clip-path` (or SVG `<clipPath>` if CSS proves insufficient)
- **Tile color proportions match real genome percentages:**
  - ~75 tiles amber (`--accent`) — Homo sapiens
  - ~19 tiles purple (`#7b4fbf`) — superarchaic
  - ~2 tiles terra-red (`--terra`) — Neanderthal
  - 1 tile teal — Denisovan
  - 1 tile sage — unknown/other
  - Colors distributed pseudo-randomly, not in blocks
- Figure size: ~180px wide × 280px tall on desktop

**Animation:**
- Tiles start at scattered positions (random `translate` offsets set via CSS custom properties from JS)
- **Scatter positions randomized per page load** — slightly different every visit
- On scroll entry, `.revealed` class triggers `transition: transform 0.8s ease-out` with staggered `transition-delay` per tile (CSS `calc()` based on row/column index)
- Tiles drift from scattered positions into final grid, forming the human shape

**Reduced motion:** Tiles in final assembled position immediately, no scatter/drift.

**Text:** "The old story was simple: Homo sapiens evolved in Africa, migrated out, and conquered the world. The new story is richer and stranger. We are not a single, isolated branch on the tree of life — we are a braided river of multiple ancient lineages that flowed together over hundreds of thousands of years. Neanderthal. Denisovan. At least two unknown superarchaic species. And possibly more, still hidden in the unexplored regions of our genome. You are not one species' legacy. You are a mosaic."

---

### Section 7: "Who Else Is Inside You?" (The Question)

**Layout:** Centered title + genome bar with unknowns + CTA buttons + citation.

**Visual — Genome Bar v3:**
- Same bar as Section 3, but with additional small "?" segments at both edges
- Suggests more unknown contributions yet to be discovered
- Gentle pulse animation on the entire bar (slow opacity wave)

**CTA Buttons:**
1. Primary: "Explore the Hominin Family →" — pill button linking to `../index.html?node=hominini`
2. Secondary (subtle): "Read the original research →" — links to `https://doi.org/10.1126/sciadv.aay5483`

**Citation:** "Source: Rogers, A.R. et al. (2020). Neanderthal-Denisovan ancestors interbred with a distantly related hominin. *Science Advances.* Reported by Taub, B. in IFLScience."

**Reduced motion:** No pulse, static bar.

**Text:** "As genetic analysis techniques improve, researchers expect to find even more ghost lineages woven into our DNA. Each discovery rewrites not just human history, but the very definition of what it means to be human. The tree of life isn't a tree — it's a web. And you are one of its most tangled, beautiful knots."

---

## Styling

### Theme

- Dark theme by default, inheriting `var(--bg)`, `var(--surface)`, `var(--text-primary)` etc. from `variables.css`
- Light theme: page respects `[data-theme="light"]` if variables.css overrides are loaded, but stories default to dark regardless of main site preference (the dark museum aesthetic is integral to the narrative)
- **Accent palette for this story:**
  - Primary accent: warm amber `var(--accent)` — Homo sapiens identity
  - Mystery accent: deep purple `#7b4fbf` — the unknown superarchaic DNA
  - Secondary accents: terra-red `var(--terra)` (Neanderthal), teal `var(--accent-secondary)` (Denisovan), sage `var(--sage)` (other unknowns)

### Typography

- Title: `var(--font-head)`, weight 200, `clamp(28px, 4.5vw, 48px)`
- Overline: `var(--text-xs)`, weight 500, letter-spacing 5px, uppercase, accent color
- Body: `var(--font-body)`, weight 300, ~15px, max-width 560px, line-height 1.7
- Data labels: `var(--font-mono)` for percentage counters

### Glassmorphism

- Back button, header: `backdrop-filter: blur(12px)`, semi-transparent background, glass border
- Matches existing `.sapiens-close` pattern

---

## Responsive Design

### Desktop (>768px)
- Full cinematic scroll experience, large visuals
- Ring: 200px, genome bar: 600px, mosaic: 180×280px, map: 600px wide
- Text max-width: 560px

### Tablet (481–768px)
- Same flow, slightly smaller visuals (~80% scale)
- Ring: 160px, genome bar: 480px, mosaic: 140×220px

### Mobile (≤480px)
- Sections stack naturally, animations simplified (shorter durations)
- Ring: 140px, genome bar: full width with padding
- Silhouette lineup wraps to 2×2 grid if needed
- Mosaic: 120×190px
- Text: 14px, full-width padding

### All breakpoints
- Each section roughly one screenful (100vh min-height)
- Touch-scroll friendly — no horizontal scroll, no hover-dependent interactions
- `scroll-snap-type: y proximity` (not mandatory — prevents getting stuck)
- On mobile (≤480px), verify scroll-snap doesn't cause janky snapping when sections exceed 100vh. If it does, disable snap on mobile and keep it desktop-only.

---

## Accessibility

- All text in DOM, not baked into SVG/Canvas
- `prefers-reduced-motion: reduce` — all animations replaced with static final states
- Semantic HTML: `<article>` for page, `<section>` for each section, proper heading hierarchy
- `aria-label` on decorative SVGs, `role="img"` where appropriate
- Color contrast: all text meets WCAG AA against dark backgrounds
- Keyboard: Tab-navigable CTA buttons, visible focus rings

---

## i18n

- All visible text stored as constants in `superarchaic-dna.js` (not hardcoded in HTML)
- Structured for future HE/RU addition: text constants can be replaced with `{ en, he, ru }` objects
- No text baked into SVG — all text in DOM overlays positioned over SVG visuals
- For now: English only

---

## Performance

- Target: < 200KB total page weight (excluding shared fonts/CSS from CDN)
- No external images — all visuals are inline SVG + CSS
- Animations: CSS-based where possible, JS only for scroll-progress-driven values
- IntersectionObserver pauses off-screen animations
- No Canvas — pure DOM/SVG rendering
- Lazy: sections below fold use `.reveal` class (no content lazy-loading needed since all content is inline)

---

## Content Accuracy Rules

- Present as "recent research suggests" — not absolute settled fact
- The 20% figure comes from Rogers et al. (2020) — cited specifically with DOI
- Use "superarchaic hominin" (the paper's term), not invented names
- Do NOT claim we know who the ghost species is — the mystery IS the story
- Frame as expanding understanding, not overturning everything
- Tone: wonder, not sensationalism

---

## Out of Scope

- Light theme variant (stories are always dark)
- Hebrew/Russian translations (structure supports it, but English-only for now)
- Improved world map for Section 5 (separate project — uses placeholder)
- Story index page (only one story exists — add when there are 2+)
- Audio narration or video content
- Social sharing buttons
