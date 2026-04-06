# Superarchaic DNA Story Exhibit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, scroll-driven story page "How Human Are You?" that presents the discovery that ~20% of human DNA comes from an unidentified superarchaic hominin species.

**Architecture:** Standalone HTML page at `stories/superarchaic-dna.html` with a light shared story infrastructure layer (`story-base.css`, `story-utils.js`). Pure SVG + CSS animations, IntersectionObserver for scroll triggers. No Canvas, no external dependencies beyond Google Fonts and site-wide `variables.css`.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, clip-path, scroll-snap, keyframes), ES modules, SVG

**Spec:** `docs/superpowers/specs/2026-04-06-superarchaic-dna-story-design.md`

---

## File Structure

```
stories/
├── superarchaic-dna.html    # Standalone HTML page — 7 sections with semantic markup
├── story-base.css           # Shared story layer: section layout, typography, reveal animations, glassmorphism
├── story-utils.js           # Shared story helpers: onVisible(), scrollProgress(), revealOnScroll(), reducedMotion()
├── superarchaic-dna.css     # Story-specific: DNA ring, genome bars, ghost silhouettes, mosaic, map
└── superarchaic-dna.js      # Story-specific: scroll-driven animation logic, text constants, tile randomization
```

Also modified:
- `index.html` — Add "Stories" navigation link

---

### Task 1: Shared Story Infrastructure — `story-utils.js`

**Files:**
- Create: `stories/story-utils.js`

- [ ] **Step 1: Create `stories/` directory and `story-utils.js`**

```bash
mkdir -p stories
```

- [ ] **Step 2: Write the shared utility module**

Create `stories/story-utils.js`:

```js
// ══════════════════════════════════════════════════════
// STORY-UTILS — shared helpers for story exhibits
// ══════════════════════════════════════════════════════

/**
 * Returns true if user prefers reduced motion.
 */
export function reducedMotion() {
  return matchMedia('(prefers-reduced-motion:reduce)').matches;
}

/**
 * Observe an element and fire callback when it enters the viewport.
 * Respects reducedMotion unless opts.essential is true.
 * @param {Element} el - Element to observe
 * @param {Function} callback - Called with (el) when visible
 * @param {Object} opts - { threshold: 0.2, repeat: false, essential: false }
 * @returns {IntersectionObserver} The observer (for cleanup)
 */
export function onVisible(el, callback, opts = {}) {
  if (reducedMotion() && !opts.essential) {
    callback(el);
    return null;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        callback(e.target);
        if (!opts.repeat) obs.unobserve(e.target);
      }
    });
  }, { threshold: opts.threshold || 0.2 });
  obs.observe(el);
  return obs;
}

/**
 * Returns 0–1 scroll progress of element through viewport.
 * 0 = element top just entered viewport bottom.
 * 1 = element top has reached viewport top.
 */
export function scrollProgress(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const raw = 1 - (rect.top / vh);
  return Math.max(0, Math.min(1, raw));
}

/**
 * Auto-reveal: finds all .reveal elements in container,
 * adds .revealed class when they scroll into view.
 * Returns array of observers for cleanup.
 */
export function revealOnScroll(container) {
  const els = container.querySelectorAll('.reveal');
  const observers = [];
  els.forEach(el => {
    if (reducedMotion()) {
      el.classList.add('revealed');
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    obs.observe(el);
    observers.push(obs);
  });
  return observers;
}
```

- [ ] **Step 3: Commit**

```bash
git add stories/story-utils.js
git commit -m "feat: add shared story-utils.js with IntersectionObserver helpers"
```

---

### Task 2: Shared Story Infrastructure — `story-base.css`

**Files:**
- Create: `stories/story-base.css`

- [ ] **Step 1: Write the shared story CSS**

Create `stories/story-base.css`:

```css
/* ══════════════════════════════════════════════════════
   STORY-BASE — shared styles for story exhibits
   ══════════════════════════════════════════════════════ */

/* ── Page container ── */
.story-page {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y proximity;
  scroll-behavior: smooth;
}

/* ── Section ── */
.story-section {
  min-height: 100vh;
  scroll-snap-align: start;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px 64px;
}

/* ── Fixed header ── */
.story-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(20, 22, 24, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(200, 136, 58, 0.08);
}

.story-back {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(200, 136, 58, 0.2);
  background: rgba(20, 22, 24, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;
}
.story-back:hover {
  background: rgba(200, 136, 58, 0.12);
  color: var(--text-primary);
}

.story-header-title {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

/* ── Typography ── */
.story-overline {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.5;
  margin-bottom: 14px;
}

.story-title {
  font-size: clamp(28px, 4.5vw, 48px);
  font-weight: 200;
  color: var(--text-primary);
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.2;
}

.story-text {
  font-size: 15px;
  font-weight: 300;
  color: var(--text-secondary);
  max-width: 560px;
  line-height: 1.7;
  text-align: center;
}

/* ── Citation ── */
.story-citation {
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.6;
  text-align: center;
  max-width: 480px;
}
.story-citation em {
  font-style: italic;
}

/* ── CTA buttons ── */
.story-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 28px;
  border: 1px solid rgba(200, 136, 58, 0.4);
  border-radius: 24px;
  background: transparent;
  color: var(--accent);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}
.story-cta:hover {
  background: rgba(200, 136, 58, 0.1);
  border-color: var(--accent);
}

.story-cta-secondary {
  border-color: rgba(200, 136, 58, 0.15);
  color: var(--text-muted);
  font-size: 13px;
  padding: 10px 24px;
}
.story-cta-secondary:hover {
  color: var(--accent);
  border-color: rgba(200, 136, 58, 0.3);
}

/* ── Reveal animation ── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ── Scroll indicator ── */
.story-scroll-hint {
  position: absolute;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
  font-size: 12px;
  letter-spacing: 1px;
  animation: storyScrollBounce 2s ease-in-out infinite;
}
.story-scroll-line {
  width: 1px;
  height: 24px;
  background: linear-gradient(180deg, var(--text-dim), transparent);
}
@keyframes storyScrollBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .story-scroll-hint {
    animation: none;
  }
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .story-section {
    padding: 72px 16px 48px;
  }
  .story-text {
    font-size: 14px;
  }
  .story-header {
    padding: 10px 12px;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add stories/story-base.css
git commit -m "feat: add shared story-base.css with section layout and typography"
```

---

### Task 3: HTML Page Scaffold + Sections 1–3

**Files:**
- Create: `stories/superarchaic-dna.html`
- Create: `stories/superarchaic-dna.css` (partial — sections 1–3)
- Create: `stories/superarchaic-dna.js` (partial — sections 1–3)

- [ ] **Step 1: Create the HTML page with all 7 section containers and first 3 sections' content**

Create `stories/superarchaic-dna.html`:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
<meta name="description" content="How Human Are You? Discover that 20% of your DNA comes from a mysterious ghost species — an interactive story from the Tree of Life project.">
<title>How Human Are You? — Tree of Life</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Heebo:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/variables.css">
<link rel="stylesheet" href="story-base.css">
<link rel="stylesheet" href="superarchaic-dna.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧬</text></svg>">
</head>
<body>

<article class="story-page" id="story">

  <!-- Header -->
  <header class="story-header">
    <a href="../index.html" class="story-back" aria-label="Back to Tree of Life">&larr;</a>
    <span class="story-header-title">Tree of Life — Stories</span>
  </header>

  <!-- Section 1: The Hook -->
  <section class="story-section sa-hook" id="sec-hook">
    <div class="story-overline reveal">The Question</div>
    <h1 class="story-title reveal">How Human Are You?</h1>
    <div class="sa-ring-wrap reveal" id="dna-ring">
      <svg viewBox="0 0 200 200" class="sa-ring-svg" role="img" aria-label="DNA percentage ring showing 80% Homo sapiens, 20% unknown">
        <circle cx="100" cy="100" r="80" class="sa-ring-track"/>
        <circle cx="100" cy="100" r="80" class="sa-ring-sapiens" id="ring-sapiens"
          stroke-dasharray="502.65 502.65" stroke-dashoffset="0"/>
        <circle cx="100" cy="100" r="80" class="sa-ring-ghost" id="ring-ghost"
          stroke-dasharray="0 502.65" stroke-dashoffset="0"/>
        <text x="100" y="92" class="sa-ring-pct" id="ring-pct">100%</text>
        <text x="100" y="116" class="sa-ring-label">HOMO SAPIENS</text>
      </svg>
    </div>
    <p class="story-text reveal" style="margin-top:24px;">You probably think you're 100% <em>Homo sapiens</em>. You're not. Recent genetic research reveals that a full 20% of your DNA was inherited from a species we haven't even identified yet — a ghost lineage that vanished from the fossil record but lives on inside you.</p>
    <div class="story-scroll-hint" id="scroll-hint">
      <span>Scroll to discover</span>
      <div class="story-scroll-line"></div>
    </div>
  </section>

  <!-- Section 2: What We Knew -->
  <section class="story-section sa-known" id="sec-known">
    <div class="story-overline reveal">What We Knew</div>
    <h2 class="story-title reveal">The 2% We Already Knew About</h2>
    <div class="sa-genome-bar sa-genome-v1 reveal" id="genome-v1" role="img" aria-label="Genome bar showing 98% Homo sapiens and 2% Neanderthal DNA">
      <div class="sa-bar-sapiens">
        <span class="sa-bar-label">Homo sapiens — 98%</span>
      </div>
      <div class="sa-bar-neanderthal sa-pulse">
        <span class="sa-bar-label-sm">2%</span>
      </div>
    </div>
    <p class="story-text reveal" style="margin-top:32px;">For years, the big headline was that modern humans carry about 2% Neanderthal DNA — evidence of interbreeding ~60,000 years ago in Eurasia. It felt like a footnote. A minor subplot in our origin story. But that was before we looked deeper.</p>
  </section>

  <!-- Section 3: The Bombshell -->
  <section class="story-section sa-bombshell" id="sec-bombshell">
    <div class="story-overline reveal">The Discovery</div>
    <h2 class="story-title reveal">Then We Found the Other 20%</h2>
    <div class="sa-genome-bar sa-genome-v2 reveal" id="genome-v2" role="img" aria-label="Genome bar redrawn: 78% Homo sapiens, 20% unknown superarchaic, 2% Neanderthal">
      <div class="sa-bar-sapiens-v2">
        <span class="sa-bar-label">Sapiens — 78%</span>
      </div>
      <div class="sa-bar-ghost-segment" id="ghost-segment">
        <span class="sa-bar-label-ghost">20%</span>
        <span class="sa-bar-question">?</span>
      </div>
      <div class="sa-bar-neanderthal-v2">
        <span class="sa-bar-label-sm">2%</span>
      </div>
    </div>
    <p class="story-text reveal" style="margin-top:32px;">A 2020 study by Professor Alan Rogers and colleagues revealed something staggering: roughly 20% of the human genome comes from a completely unknown hominin species. Not Neanderthal. Not Denisovan. Something older. Something we've never found a fossil for. Rogers called it not a simple exchange of genes, but "a merger of two populations" — fundamentally rewriting our origin story.</p>
  </section>

  <!-- Section 4: Ghost Species -->
  <section class="story-section sa-ghost" id="sec-ghost">
    <div class="story-overline reveal">The Mystery</div>
    <h2 class="story-title reveal">A Ghost Species</h2>
    <div class="sa-silhouettes reveal" id="silhouettes" role="img" aria-label="Four hominin silhouettes: a flickering ghost species alongside Neanderthal, Denisovan, and Homo sapiens">
      <!-- SVG silhouettes injected by JS -->
    </div>
    <p class="story-text reveal" style="margin-top:32px;">This "superarchaic" lineage diverged from our branch over 1 million years ago. They lived in Africa, evolved in parallel with our ancestors for hundreds of thousands of years, and then — at some point deep in prehistory — merged with the population that would become us. We carry their genes, but we have no skulls, no tools, no cave paintings. Only their DNA signature, hiding in our genome like a message from a species that left no other trace.</p>
  </section>

  <!-- Section 5: It Happened Twice -->
  <section class="story-section sa-map" id="sec-map">
    <div class="story-overline reveal">The Evidence</div>
    <h2 class="story-title reveal">It Happened Twice</h2>
    <div class="sa-map-wrap reveal" id="merge-map" role="img" aria-label="World map showing two ancient interbreeding events: one in Africa, one in Eurasia">
      <!-- SVG map injected by JS -->
    </div>
    <p class="story-text reveal" style="margin-top:32px;">The study identified two distinct superarchaic populations involved in these ancient encounters. One group likely interbred with the ancestors of Neanderthals and Denisovans in Eurasia — potentially descendants of <em>Homo erectus</em>. But the African population that contributed 20% of OUR genome? No current suspects. No fossils. No name. Just the ghost in our DNA.</p>
  </section>

  <!-- Section 6: Mosaic -->
  <section class="story-section sa-mosaic-section" id="sec-mosaic">
    <div class="story-overline reveal">The Meaning</div>
    <h2 class="story-title reveal">You Are a Mosaic</h2>
    <div class="sa-mosaic-wrap reveal" id="mosaic" role="img" aria-label="Human silhouette composed of colored mosaic tiles representing different ancestral lineages">
      <!-- Tiles injected by JS -->
    </div>
    <p class="story-text reveal" style="margin-top:32px;">The old story was simple: <em>Homo sapiens</em> evolved in Africa, migrated out, and conquered the world. The new story is richer and stranger. We are not a single, isolated branch on the tree of life — we are a braided river of multiple ancient lineages that flowed together over hundreds of thousands of years. Neanderthal. Denisovan. At least two unknown superarchaic species. And possibly more, still hidden in the unexplored regions of our genome. You are not one species' legacy. You are a mosaic.</p>
  </section>

  <!-- Section 7: The Question -->
  <section class="story-section sa-closing" id="sec-closing">
    <div class="story-overline reveal">The Future</div>
    <h2 class="story-title reveal">Who Else Is Inside You?</h2>
    <div class="sa-genome-bar sa-genome-v3 reveal" id="genome-v3" role="img" aria-label="Genome bar with additional unknown segments at the edges, suggesting more discoveries to come">
      <div class="sa-bar-unknown-edge"><span class="sa-bar-label-sm">?</span></div>
      <div class="sa-bar-sapiens-v3">
        <span class="sa-bar-label">Sapiens</span>
      </div>
      <div class="sa-bar-ghost-v3">
        <span class="sa-bar-label-ghost">20%</span>
      </div>
      <div class="sa-bar-neanderthal-v3">
        <span class="sa-bar-label-sm">2%</span>
      </div>
      <div class="sa-bar-unknown-edge"><span class="sa-bar-label-sm">?</span></div>
    </div>
    <p class="story-text reveal" style="margin-top:32px;">As genetic analysis techniques improve, researchers expect to find even more ghost lineages woven into our DNA. Each discovery rewrites not just human history, but the very definition of what it means to be human. The tree of life isn't a tree — it's a web. And you are one of its most tangled, beautiful knots.</p>
    <div class="sa-cta-group reveal" style="margin-top:40px;">
      <a href="../index.html?node=hominini" class="story-cta">Explore the Hominin Family &rarr;</a>
      <a href="https://doi.org/10.1126/sciadv.aay5483" target="_blank" rel="noopener" class="story-cta story-cta-secondary">Read the original research &rarr;</a>
    </div>
    <div class="story-citation reveal" style="margin-top:48px;">
      Source: Rogers, A.R. et al. (2020). Neanderthal-Denisovan ancestors interbred with a distantly related hominin. <em>Science Advances.</em> Reported by Taub, B. in IFLScience.
    </div>
  </section>

</article>

<script type="module" src="superarchaic-dna.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create initial `superarchaic-dna.css` with Section 1–3 styles**

Create `stories/superarchaic-dna.css`:

```css
/* ══════════════════════════════════════════════════════
   SUPERARCHAIC DNA — story-specific styles
   ══════════════════════════════════════════════════════ */

/* ── Color tokens for this story ── */
:root {
  --sa-ghost: #7b4fbf;
  --sa-ghost-dim: rgba(123, 79, 191, 0.15);
  --sa-ghost-glow: rgba(123, 79, 191, 0.5);
  --sa-ghost-gradient: linear-gradient(135deg, #5b3d8f, #7b4fbf, #9b6abf);
}

/* ══ SECTION 1: DNA RING ══ */

.sa-ring-wrap {
  width: 200px;
  height: 200px;
  margin: 24px auto 0;
}

.sa-ring-svg {
  width: 100%;
  height: 100%;
}

.sa-ring-track {
  fill: none;
  stroke: var(--surface-raised);
  stroke-width: 14;
}

.sa-ring-sapiens {
  fill: none;
  stroke: var(--accent);
  stroke-width: 14;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dasharray 1.5s ease-out;
}

.sa-ring-ghost {
  fill: none;
  stroke: var(--sa-ghost);
  stroke-width: 14;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  filter: drop-shadow(0 0 12px var(--sa-ghost-glow));
  transition: stroke-dasharray 1.5s ease-out;
}

.sa-ring-pct {
  font-family: var(--font-mono);
  font-size: 36px;
  font-weight: 400;
  fill: var(--text-primary);
  text-anchor: middle;
  dominant-baseline: auto;
}

.sa-ring-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 3px;
  fill: var(--text-dim);
  text-anchor: middle;
}

/* ══ SECTION 2–3: GENOME BARS ══ */

.sa-genome-bar {
  display: flex;
  width: min(80vw, 600px);
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  margin: 24px auto 0;
}

.sa-bar-label {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-dim);
  white-space: nowrap;
}

.sa-bar-label-sm {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #fff;
  white-space: nowrap;
}

.sa-bar-label-ghost {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}

/* ── Genome v1 (Section 2) ── */
.sa-bar-sapiens {
  flex: 98;
  background: linear-gradient(90deg, var(--surface), var(--surface-raised));
  display: flex;
  align-items: center;
  justify-content: center;
}

.sa-bar-neanderthal {
  flex: 2;
  background: linear-gradient(135deg, var(--terra), #d47030);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
}

@keyframes barPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.sa-pulse {
  animation: barPulse 2s ease-in-out infinite;
}

/* ── Genome v2 (Section 3) ── */
.sa-bar-sapiens-v2 {
  flex: 78;
  background: linear-gradient(90deg, var(--surface), var(--surface-raised));
  display: flex;
  align-items: center;
  justify-content: center;
}

.sa-bar-ghost-segment {
  flex: 20;
  background: var(--sa-ghost-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  filter: drop-shadow(0 0 8px var(--sa-ghost-glow));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.sa-bar-ghost-segment.expanded {
  transform: scaleX(1);
}

.sa-bar-question {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  transition: opacity 0.5s ease 0.8s;
}
.sa-bar-ghost-segment.expanded .sa-bar-question {
  opacity: 1;
}

.sa-bar-neanderthal-v2 {
  flex: 2;
  background: linear-gradient(135deg, var(--terra), #d47030);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
}

/* Section 3 screen shake (optional, nice-to-have) */
@keyframes sectionShake {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, 2px); }
  80% { transform: translate(1px, -2px); }
}
.sa-bombshell.shake {
  animation: sectionShake 0.2s ease;
}

/* ── Genome v3 (Section 7) ── */
.sa-genome-v3 {
  height: 36px;
}

.sa-bar-unknown-edge {
  flex: 2;
  background: rgba(90, 138, 154, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
}

.sa-bar-sapiens-v3 {
  flex: 74;
  background: linear-gradient(90deg, var(--surface), var(--surface-raised));
  display: flex;
  align-items: center;
  justify-content: center;
}

.sa-bar-ghost-v3 {
  flex: 20;
  background: var(--sa-ghost-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 6px var(--sa-ghost-glow));
}

.sa-bar-neanderthal-v3 {
  flex: 2;
  background: linear-gradient(135deg, var(--terra), #d47030);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
}

@keyframes barWavePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
.sa-genome-v3 {
  animation: barWavePulse 3s ease-in-out infinite;
}

/* ── CTA group ── */
.sa-cta-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* ══ REDUCED MOTION ══ */
@media (prefers-reduced-motion: reduce) {
  .sa-ring-sapiens,
  .sa-ring-ghost {
    transition: none;
  }
  .sa-pulse {
    animation: none;
  }
  .sa-bar-ghost-segment {
    transform: scaleX(1);
    transition: none;
  }
  .sa-bar-ghost-segment .sa-bar-question {
    opacity: 1;
    transition: none;
  }
  .sa-bombshell.shake {
    animation: none;
  }
  .sa-genome-v3 {
    animation: none;
  }
}

/* ══ RESPONSIVE ══ */
@media (max-width: 768px) {
  .sa-ring-wrap {
    width: 160px;
    height: 160px;
  }
  .sa-ring-pct {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  .sa-ring-wrap {
    width: 140px;
    height: 140px;
  }
  .sa-ring-pct {
    font-size: 26px;
  }
  .sa-genome-bar {
    height: 32px;
  }
  .sa-bar-label {
    font-size: 10px;
  }
}
```

- [ ] **Step 3: Create initial `superarchaic-dna.js` with sections 1–3 logic**

Create `stories/superarchaic-dna.js`:

```js
// ══════════════════════════════════════════════════════
// SUPERARCHAIC DNA — story-specific animations & logic
// ══════════════════════════════════════════════════════

import { reducedMotion, onVisible, revealOnScroll } from './story-utils.js';

// Track observers for cleanup
const observers = [];

// ── INIT ──
function init() {
  const page = document.getElementById('story');
  if (!page) return;

  // Auto-reveal all .reveal elements
  const revealObs = revealOnScroll(page);
  observers.push(...revealObs);

  // Section-specific animations
  initRing();
  initBombshell();

  // Fade scroll hint on first scroll
  page.addEventListener('scroll', function onFirst() {
    const hint = document.getElementById('scroll-hint');
    if (hint) hint.style.opacity = '0';
    page.removeEventListener('scroll', onFirst);
  }, { passive: true });
}

// ══ SECTION 1: DNA RING ══

function initRing() {
  const section = document.getElementById('sec-hook');
  if (!section) return;

  const circumference = 2 * Math.PI * 80; // r=80 → ~502.65
  const sapiensEl = document.getElementById('ring-sapiens');
  const ghostEl = document.getElementById('ring-ghost');
  const pctEl = document.getElementById('ring-pct');

  if (!sapiensEl || !ghostEl || !pctEl) return;

  if (reducedMotion()) {
    // Static final state
    const sapiensArc = circumference * 0.8;
    const ghostArc = circumference * 0.2;
    sapiensEl.setAttribute('stroke-dasharray', `${sapiensArc} ${circumference}`);
    ghostEl.setAttribute('stroke-dasharray', `${ghostArc} ${circumference}`);
    ghostEl.setAttribute('stroke-dashoffset', `${-sapiensArc}`);
    pctEl.textContent = '80%';
    return;
  }

  // Start at 100%
  sapiensEl.setAttribute('stroke-dasharray', `${circumference} ${circumference}`);
  ghostEl.setAttribute('stroke-dasharray', `0 ${circumference}`);
  pctEl.textContent = '100%';

  // Animate when section is 50% visible
  const obs = onVisible(section, () => {
    animateRing(sapiensEl, ghostEl, pctEl, circumference);
  }, { threshold: 0.5, essential: true });
  if (obs) observers.push(obs);
}

function animateRing(sapiensEl, ghostEl, pctEl, circumference) {
  const duration = 1500;
  const start = performance.now();
  const sapiensStart = circumference;
  const sapiensEnd = circumference * 0.8;
  const ghostEnd = circumference * 0.2;

  function frame(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const ease = 1 - Math.pow(1 - t, 3);

    const sapiensArc = sapiensStart - (sapiensStart - sapiensEnd) * ease;
    const ghostArc = ghostEnd * ease;

    sapiensEl.setAttribute('stroke-dasharray', `${sapiensArc} ${circumference}`);
    ghostEl.setAttribute('stroke-dasharray', `${ghostArc} ${circumference}`);
    ghostEl.setAttribute('stroke-dashoffset', `${-sapiensArc}`);

    const pct = Math.round(100 - 20 * ease);
    pctEl.textContent = `${pct}%`;

    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// ══ SECTION 3: BOMBSHELL ══

function initBombshell() {
  const section = document.getElementById('sec-bombshell');
  const ghostSegment = document.getElementById('ghost-segment');
  if (!section || !ghostSegment) return;

  if (reducedMotion()) {
    ghostSegment.classList.add('expanded');
    return;
  }

  const obs = onVisible(section, () => {
    ghostSegment.classList.add('expanded');
    // Optional screen shake after expansion completes
    setTimeout(() => {
      section.classList.add('shake');
      section.addEventListener('animationend', () => {
        section.classList.remove('shake');
      }, { once: true });
    }, 800);
  }, { threshold: 0.3, essential: true });
  if (obs) observers.push(obs);
}

// ── Start ──
document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 4: Test sections 1–3 in browser**

```bash
cd stories && python -m http.server 8080
# Or: node ../serve.js (if configured to serve stories/)
```

Open `http://localhost:8080/superarchaic-dna.html` (or navigate from `http://localhost:5555/stories/superarchaic-dna.html`).

Expected:
- Page loads with dark background, fixed header with back arrow
- Section 1: Ring shows 100%, animates to 80% when scrolled past midpoint
- Section 2: Genome bar with tiny 2% Neanderthal segment, pulsing
- Section 3: Purple 20% segment expands on scroll, shake effect fires
- All text readable, layout centered

- [ ] **Step 5: Commit**

```bash
git add stories/superarchaic-dna.html stories/superarchaic-dna.css stories/superarchaic-dna.js
git commit -m "feat: add superarchaic DNA story page with sections 1-3 (ring, genome bars)"
```

---

### Task 4: Section 4 — Ghost Silhouettes

**Files:**
- Modify: `stories/superarchaic-dna.js` — add `initSilhouettes()`
- Modify: `stories/superarchaic-dna.css` — add silhouette styles

- [ ] **Step 1: Add silhouette SVG paths and init function to `superarchaic-dna.js`**

Append to `superarchaic-dna.js`, before the `// ── Start ──` line:

```js
// ══ SECTION 4: GHOST SILHOUETTES ══

const SILHOUETTE_DATA = [
  {
    id: 'ghost',
    label: 'Superarchaic',
    color: 'var(--sa-ghost)',
    fillOpacity: 0,
    strokeDash: '4,3',
    // Tall, same height as sapiens — unknown proportions
    path: 'M22,8 C22,4 26,0 30,0 C34,0 38,4 38,8 L38,12 C38,15 36,17 34,18 L36,20 L40,22 L44,24 L44,48 L42,50 L42,70 L44,72 L44,90 L38,90 L36,72 L34,70 L26,70 L24,72 L22,90 L16,90 L16,72 L18,70 L18,50 L16,48 L16,24 L20,22 L24,20 L26,18 C24,17 22,15 22,12 Z',
    width: 60, height: 90,
  },
  {
    id: 'neanderthal',
    label: 'Neanderthal',
    color: 'var(--terra)',
    fillOpacity: 0.2,
    // Stockier, shorter, broader shoulders
    path: 'M23,9 C23,5 26,2 30,2 C34,2 37,5 37,9 L37,13 C37,15 36,17 34,18 L37,20 L44,23 L46,26 L46,50 L44,52 L43,70 L45,72 L45,90 L39,90 L37,72 L35,70 L25,70 L23,72 L21,90 L15,90 L15,72 L17,70 L16,52 L14,50 L14,26 L16,23 L23,20 L26,18 C24,17 23,15 23,13 Z',
    width: 60, height: 92,
  },
  {
    id: 'denisovan',
    label: 'Denisovan',
    color: 'var(--accent-secondary)',
    fillOpacity: 0.2,
    // Broader build, medium height
    path: 'M22,9 C22,5 25,2 29,2 C33,2 36,5 36,9 L36,13 C36,15 35,17 33,18 L36,20 L43,23 L46,26 L46,50 L44,52 L43,70 L45,73 L45,92 L39,92 L37,73 L35,70 L23,70 L21,73 L19,92 L13,92 L13,73 L15,70 L14,52 L12,50 L12,26 L15,23 L22,20 L25,18 C23,17 22,15 22,13 Z',
    width: 58, height: 94,
  },
  {
    id: 'sapiens',
    label: 'Homo sapiens',
    color: 'var(--accent)',
    fillOpacity: 0.2,
    // Taller, slimmer
    path: 'M24,7 C24,3 27,0 30,0 C33,0 36,3 36,7 L36,11 C36,14 34,16 32,17 L34,19 L38,21 L42,24 L42,50 L40,52 L40,72 L42,74 L42,94 L37,94 L35,74 L33,72 L27,72 L25,74 L23,94 L18,94 L18,74 L20,72 L20,52 L18,50 L18,24 L22,21 L26,19 L28,17 C26,16 24,14 24,11 Z',
    width: 60, height: 94,
  },
];

function initSilhouettes() {
  const container = document.getElementById('silhouettes');
  if (!container) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 280 120');
  svg.setAttribute('class', 'sa-silhouettes-svg');
  svg.setAttribute('aria-hidden', 'true');

  SILHOUETTE_DATA.forEach((s, i) => {
    const g = document.createElementNS(svgNS, 'g');
    const xOffset = i * 68 + 10;
    const yOffset = 120 - s.height;
    g.setAttribute('transform', `translate(${xOffset}, ${yOffset})`);

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', s.path);
    path.setAttribute('fill', s.id === 'ghost' ? 'none' : s.color);
    path.setAttribute('fill-opacity', String(s.fillOpacity));
    path.setAttribute('stroke', s.color);
    path.setAttribute('stroke-width', s.id === 'ghost' ? '1.5' : '0');
    if (s.strokeDash) path.setAttribute('stroke-dasharray', s.strokeDash);
    if (s.id === 'ghost') path.setAttribute('class', 'sa-ghost-figure');
    g.appendChild(path);

    // Label
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', String(s.width / 2));
    text.setAttribute('y', String(s.height + 14));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', s.id === 'ghost' ? 'sa-sil-label sa-sil-label-ghost' : 'sa-sil-label');
    text.textContent = s.label;
    g.appendChild(text);

    svg.appendChild(g);
  });

  container.appendChild(svg);
}
```

Also add `initSilhouettes();` to the `init()` function body, after `initBombshell();`.

- [ ] **Step 2: Add silhouette CSS to `superarchaic-dna.css`**

Append before the `/* ══ REDUCED MOTION ══ */` section:

```css
/* ══ SECTION 4: GHOST SILHOUETTES ══ */

.sa-silhouettes {
  width: min(90vw, 400px);
  margin: 24px auto 0;
}

.sa-silhouettes-svg {
  width: 100%;
  height: auto;
}

.sa-sil-label {
  font-family: var(--font-body);
  font-size: 7px;
  fill: var(--text-dim);
  letter-spacing: 0.5px;
}

.sa-sil-label-ghost {
  fill: var(--sa-ghost);
}

@keyframes ghostFlicker {
  0% { opacity: 0.15; }
  15% { opacity: 0.5; }
  30% { opacity: 0.2; }
  50% { opacity: 0.55; }
  65% { opacity: 0.25; }
  80% { opacity: 0.45; }
  100% { opacity: 0.15; }
}

.sa-ghost-figure {
  animation: ghostFlicker 3s steps(12) infinite;
}
```

Also add to the `@media (prefers-reduced-motion: reduce)` block:

```css
  .sa-ghost-figure {
    animation: none;
    opacity: 0.4;
  }
```

- [ ] **Step 3: Test Section 4 in browser**

Reload the page. Expected:
- Four silhouettes in a row: ghost (flickering dashed outline), Neanderthal (stockier), Denisovan (broader), Sapiens (taller)
- Ghost figure flickers irregularly
- Labels below each figure
- On reduced motion: ghost is static at 0.4 opacity

- [ ] **Step 4: Commit**

```bash
git add stories/superarchaic-dna.js stories/superarchaic-dna.css
git commit -m "feat: add ghost silhouette lineup with species-specific proportions (section 4)"
```

---

### Task 5: Section 5 — Merge Event Map

**Files:**
- Modify: `stories/superarchaic-dna.js` — add `initMergeMap()`
- Modify: `stories/superarchaic-dna.css` — add map styles

- [ ] **Step 1: Add merge map function to `superarchaic-dna.js`**

Append before `// ── Start ──`:

```js
// ══ SECTION 5: MERGE EVENT MAP ══

function initMergeMap() {
  const container = document.getElementById('merge-map');
  if (!container) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 600 300');
  svg.setAttribute('class', 'sa-map-svg');
  svg.setAttribute('aria-hidden', 'true');

  // Simplified continent outlines (placeholder — will be replaced by improved mini-map)
  const continents = [
    // Africa
    { d: 'M250,120 L270,110 L290,115 L305,130 L310,160 L305,190 L295,210 L280,225 L265,230 L250,225 L240,210 L235,190 L232,170 L235,150 L240,135 Z', fill: 'rgba(91,154,107,0.12)', stroke: 'rgba(91,154,107,0.25)' },
    // Europe
    { d: 'M260,60 L280,55 L300,50 L320,55 L335,60 L340,75 L330,85 L315,90 L300,88 L285,90 L270,85 L260,75 Z', fill: 'rgba(90,138,154,0.12)', stroke: 'rgba(90,138,154,0.25)' },
    // Asia
    { d: 'M340,55 L370,45 L410,40 L450,45 L480,55 L490,75 L485,95 L470,110 L450,120 L420,125 L390,120 L360,110 L345,95 L340,75 Z', fill: 'rgba(90,138,154,0.12)', stroke: 'rgba(90,138,154,0.25)' },
  ];

  continents.forEach(c => {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', c.d);
    path.setAttribute('fill', c.fill);
    path.setAttribute('stroke', c.stroke);
    path.setAttribute('stroke-width', '1');
    svg.appendChild(path);
  });

  // Continent labels
  const labels = [
    { x: 270, y: 175, text: 'Africa' },
    { x: 300, y: 72, text: 'Europe' },
    { x: 415, y: 85, text: 'Asia' },
  ];
  labels.forEach(l => {
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', String(l.x));
    text.setAttribute('y', String(l.y));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'sa-map-label');
    text.textContent = l.text;
    svg.appendChild(text);
  });

  // Event 1: Africa (purple) — superarchaic → proto-sapiens
  const event1Group = document.createElementNS(svgNS, 'g');
  event1Group.setAttribute('class', 'sa-merge-event sa-event-1');

  const dot1Start = document.createElementNS(svgNS, 'circle');
  dot1Start.setAttribute('cx', '255');
  dot1Start.setAttribute('cy', '155');
  dot1Start.setAttribute('r', '5');
  dot1Start.setAttribute('fill', 'var(--sa-ghost)');
  dot1Start.setAttribute('opacity', '0.6');
  event1Group.appendChild(dot1Start);

  const arrow1 = document.createElementNS(svgNS, 'path');
  arrow1.setAttribute('d', 'M255,155 Q270,130 280,145');
  arrow1.setAttribute('class', 'sa-merge-arrow sa-arrow-purple');
  event1Group.appendChild(arrow1);

  const dot1End = document.createElementNS(svgNS, 'circle');
  dot1End.setAttribute('cx', '280');
  dot1End.setAttribute('cy', '145');
  dot1End.setAttribute('r', '5');
  dot1End.setAttribute('fill', 'var(--sa-ghost)');
  dot1End.setAttribute('class', 'sa-merge-dest');
  event1Group.appendChild(dot1End);

  // Ripple ring for event 1
  const ripple1 = document.createElementNS(svgNS, 'circle');
  ripple1.setAttribute('cx', '280');
  ripple1.setAttribute('cy', '145');
  ripple1.setAttribute('r', '5');
  ripple1.setAttribute('class', 'sa-ripple sa-ripple-purple');
  event1Group.appendChild(ripple1);

  const label1 = document.createElementNS(svgNS, 'text');
  label1.setAttribute('x', '240');
  label1.setAttribute('y', '148');
  label1.setAttribute('class', 'sa-event-label sa-event-label-purple');
  label1.textContent = '~500+ Kya';
  event1Group.appendChild(label1);

  svg.appendChild(event1Group);

  // Event 2: Eurasia (terra) — superarchaic → proto-Neanderthal/Denisovan
  const event2Group = document.createElementNS(svgNS, 'g');
  event2Group.setAttribute('class', 'sa-merge-event sa-event-2');

  const dot2Start = document.createElementNS(svgNS, 'circle');
  dot2Start.setAttribute('cx', '360');
  dot2Start.setAttribute('cy', '90');
  dot2Start.setAttribute('r', '5');
  dot2Start.setAttribute('fill', 'var(--terra)');
  dot2Start.setAttribute('opacity', '0.6');
  event2Group.appendChild(dot2Start);

  const arrow2 = document.createElementNS(svgNS, 'path');
  arrow2.setAttribute('d', 'M360,90 Q390,65 410,80');
  arrow2.setAttribute('class', 'sa-merge-arrow sa-arrow-terra');
  event2Group.appendChild(arrow2);

  const dot2End = document.createElementNS(svgNS, 'circle');
  dot2End.setAttribute('cx', '410');
  dot2End.setAttribute('cy', '80');
  dot2End.setAttribute('r', '5');
  dot2End.setAttribute('fill', 'var(--terra)');
  dot2End.setAttribute('class', 'sa-merge-dest');
  event2Group.appendChild(dot2End);

  // Ripple ring for event 2
  const ripple2 = document.createElementNS(svgNS, 'circle');
  ripple2.setAttribute('cx', '410');
  ripple2.setAttribute('cy', '80');
  ripple2.setAttribute('r', '5');
  ripple2.setAttribute('class', 'sa-ripple sa-ripple-terra');
  event2Group.appendChild(ripple2);

  const label2 = document.createElementNS(svgNS, 'text');
  label2.setAttribute('x', '425');
  label2.setAttribute('y', '73');
  label2.setAttribute('class', 'sa-event-label sa-event-label-terra');
  label2.textContent = '~700+ Kya';
  event2Group.appendChild(label2);

  svg.appendChild(event2Group);
  container.appendChild(svg);

  // Animate events on scroll
  if (reducedMotion()) {
    event1Group.classList.add('visible');
    event2Group.classList.add('visible');
    return;
  }

  const section = document.getElementById('sec-map');
  const obs = onVisible(section, () => {
    event1Group.classList.add('visible');
    setTimeout(() => event2Group.classList.add('visible'), 500);
  }, { threshold: 0.3, essential: true });
  if (obs) observers.push(obs);
}
```

Add `initMergeMap();` to the `init()` function body after `initSilhouettes();`.

- [ ] **Step 2: Add map CSS to `superarchaic-dna.css`**

Append before `/* ══ REDUCED MOTION ══ */`:

```css
/* ══ SECTION 5: MERGE EVENT MAP ══ */

.sa-map-wrap {
  width: min(90vw, 600px);
  margin: 24px auto 0;
  background: rgba(10, 12, 14, 0.5);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(200, 136, 58, 0.08);
}

.sa-map-svg {
  width: 100%;
  height: auto;
}

.sa-map-label {
  font-family: var(--font-body);
  font-size: 11px;
  fill: rgba(237, 232, 223, 0.25);
  letter-spacing: 1px;
}

.sa-merge-event {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.sa-merge-event.visible {
  opacity: 1;
}

.sa-merge-arrow {
  fill: none;
  stroke-width: 2;
  stroke-dasharray: 6, 4;
  stroke-dashoffset: 40;
  transition: stroke-dashoffset 1s ease;
}
.sa-arrow-purple { stroke: var(--sa-ghost); }
.sa-arrow-terra { stroke: var(--terra); }

.sa-merge-event.visible .sa-merge-arrow {
  stroke-dashoffset: 0;
}

.sa-event-label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.5px;
}
.sa-event-label-purple { fill: var(--sa-ghost); }
.sa-event-label-terra { fill: var(--terra); }

/* Destination dot ripple */
.sa-ripple {
  fill: none;
  stroke-width: 1.5;
  opacity: 0;
}
.sa-ripple-purple { stroke: var(--sa-ghost); }
.sa-ripple-terra { stroke: var(--terra); }

@keyframes dotRipple {
  0% { r: 5; opacity: 0.6; }
  100% { r: 18; opacity: 0; }
}

.sa-merge-event.visible .sa-ripple {
  animation: dotRipple 0.8s ease-out 1s forwards;
}
.sa-event-2.visible .sa-ripple {
  animation-delay: 1.5s;
}
```

Add to `@media (prefers-reduced-motion: reduce)`:

```css
  .sa-merge-event {
    opacity: 1;
    transition: none;
  }
  .sa-merge-arrow {
    stroke-dashoffset: 0;
    transition: none;
  }
  .sa-merge-event .sa-ripple {
    animation: none;
  }
```

- [ ] **Step 3: Test Section 5 in browser**

Expected:
- Simplified continent outlines (Africa, Europe, Asia)
- On scroll: Event 1 (purple, Africa) appears first, arrow draws, destination dot ripples
- 0.5s later: Event 2 (terra, Eurasia) appears, arrow draws, dot ripples
- Reduced motion: both events visible immediately, no animations

- [ ] **Step 4: Commit**

```bash
git add stories/superarchaic-dna.js stories/superarchaic-dna.css
git commit -m "feat: add merge event map with animated arrows and ripple effects (section 5)"
```

---

### Task 6: Section 6 — Mosaic Figure

**Files:**
- Modify: `stories/superarchaic-dna.js` — add `initMosaic()`
- Modify: `stories/superarchaic-dna.css` — add mosaic styles

- [ ] **Step 1: Add mosaic function to `superarchaic-dna.js`**

Append before `// ── Start ──`:

```js
// ══ SECTION 6: MOSAIC FIGURE ══

// Tile colors matching genome proportions (96 tiles total):
// ~75 amber (sapiens), ~19 purple (superarchaic), ~2 terra (neanderthal), 1 teal (denisovan), 1 sage (other)
const TILE_COLORS = [
  ...Array(73).fill('var(--accent)'),
  ...Array(19).fill('var(--sa-ghost)'),
  ...Array(2).fill('var(--terra)'),
  'var(--accent-secondary)',
  'var(--sage)',
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initMosaic() {
  const container = document.getElementById('mosaic');
  if (!container) return;

  const cols = 8;
  const rows = 12;
  const total = cols * rows;
  const colors = shuffleArray(TILE_COLORS);

  const grid = document.createElement('div');
  grid.className = 'sa-mosaic-grid';

  for (let i = 0; i < total; i++) {
    const tile = document.createElement('div');
    tile.className = 'sa-mosaic-tile';
    tile.style.setProperty('--tile-color', colors[i % colors.length]);

    if (!reducedMotion()) {
      // Random scatter offset per page load
      const dx = (Math.random() - 0.5) * 300;
      const dy = (Math.random() - 0.5) * 300;
      const rot = (Math.random() - 0.5) * 60;
      tile.style.setProperty('--scatter-x', `${dx}px`);
      tile.style.setProperty('--scatter-y', `${dy}px`);
      tile.style.setProperty('--scatter-r', `${rot}deg`);

      // Stagger delay based on position
      const row = Math.floor(i / cols);
      const col = i % cols;
      const delay = (row * 0.03 + col * 0.02).toFixed(3);
      tile.style.setProperty('--tile-delay', `${delay}s`);
    }

    grid.appendChild(tile);
  }

  container.appendChild(grid);

  if (reducedMotion()) return;

  // Trigger assembly on scroll
  const section = document.getElementById('sec-mosaic');
  const obs = onVisible(section, () => {
    grid.classList.add('assembled');
  }, { threshold: 0.3, essential: true });
  if (obs) observers.push(obs);
}
```

Add `initMosaic();` to the `init()` function body after `initMergeMap();`.

- [ ] **Step 2: Add mosaic CSS to `superarchaic-dna.css`**

Append before `/* ══ REDUCED MOTION ══ */`:

```css
/* ══ SECTION 6: MOSAIC FIGURE ══ */

.sa-mosaic-wrap {
  width: 180px;
  height: 280px;
  margin: 24px auto 0;
}

.sa-mosaic-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  width: 100%;
  height: 100%;
  clip-path: polygon(
    35% 0%, 65% 0%,
    72% 5%, 76% 12%,
    74% 18%, 70% 20%,
    78% 24%, 82% 30%,
    80% 45%, 76% 50%,
    72% 52%, 68% 56%,
    72% 62%, 74% 70%,
    70% 80%, 66% 85%,
    62% 92%, 58% 100%,
    42% 100%, 38% 92%,
    34% 85%, 30% 80%,
    26% 70%, 28% 62%,
    32% 56%, 28% 52%,
    24% 50%, 20% 45%,
    18% 30%, 22% 24%,
    30% 20%, 26% 18%,
    24% 12%, 28% 5%
  );
}

.sa-mosaic-tile {
  background: var(--tile-color);
  border-radius: 1px;
  transform: translate(var(--scatter-x, 0), var(--scatter-y, 0)) rotate(var(--scatter-r, 0deg));
  opacity: 0;
  transition:
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--tile-delay, 0s),
    opacity 0.5s ease var(--tile-delay, 0s);
}

.sa-mosaic-grid.assembled .sa-mosaic-tile {
  transform: translate(0, 0) rotate(0deg);
  opacity: 1;
}
```

Add to `@media (prefers-reduced-motion: reduce)`:

```css
  .sa-mosaic-tile {
    transform: none;
    opacity: 1;
    transition: none;
  }
```

Add responsive rules:

```css
@media (max-width: 768px) {
  .sa-mosaic-wrap {
    width: 140px;
    height: 220px;
  }
}

@media (max-width: 480px) {
  .sa-mosaic-wrap {
    width: 120px;
    height: 190px;
  }
}
```

- [ ] **Step 3: Test Section 6 in browser**

Expected:
- Tiles appear scattered around the section
- On scroll, tiles drift into grid positions forming a human silhouette
- Colors roughly match genome proportions (mostly amber, some purple, tiny terra/teal/sage)
- Scatter positions different on page reload
- Reduced motion: tiles in final position immediately

- [ ] **Step 4: Commit**

```bash
git add stories/superarchaic-dna.js stories/superarchaic-dna.css
git commit -m "feat: add mosaic figure with scattered-to-silhouette animation (section 6)"
```

---

### Task 7: Add "Stories" Link to Main Site Navigation

**Files:**
- Modify: `index.html` — add Stories link to search/nav area

- [ ] **Step 1: Add a Stories navigation button**

In `index.html`, locate the search pills area (after the quiz button around line 99). Add a Stories pill:

```html
  <a href="stories/superarchaic-dna.html" class="search-pill" id="btn-stories" style="text-decoration:none;" aria-label="Read interactive stories">📖 <span id="stories-label">Stories</span></a>
```

This adds a "Stories" button next to the existing Quiz and Hominins pills.

- [ ] **Step 2: Test in browser**

Open `http://localhost:5555`. Expected:
- "Stories" pill appears in the search bar area
- Clicking it navigates to the story page
- Back button on story page returns to main site

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Stories navigation link to main site header"
```

---

### Task 8: Full Integration Test & Polish

**Files:**
- Possibly modify: `stories/superarchaic-dna.css`, `stories/superarchaic-dna.js`

- [ ] **Step 1: Full scroll-through test**

Open `http://localhost:5555/stories/superarchaic-dna.html` and scroll through all 7 sections. Verify:

1. Page loads without console errors
2. Section 1: Ring animates 100% → 80%, scroll hint visible
3. Section 2: Genome bar with tiny 2% Neanderthal, pulsing
4. Section 3: Purple 20% expands with impact, optional shake
5. Section 4: Four silhouettes with distinct proportions, ghost flickers
6. Section 5: Map with two animated merge events, ripple on dots
7. Section 6: Mosaic tiles scatter → assemble into human shape
8. Section 7: Genome bar with "?" edges, CTA buttons work
9. "Explore the Hominin Family" links to `../index.html?node=hominini`
10. "Read the original research" opens DOI link in new tab
11. Citation is visible

- [ ] **Step 2: Mobile test (375px)**

Open browser devtools, set viewport to 375px width. Verify:
- All sections readable, no horizontal overflow
- Ring, bars, silhouettes, mosaic resize appropriately
- Text is legible (14px minimum)
- Fixed header doesn't obstruct content

- [ ] **Step 3: Reduced motion test**

In browser devtools, enable "prefers-reduced-motion: reduce". Verify:
- Ring shows 80% immediately
- Genome bar appears without expansion animation
- Ghost silhouette is static at ~0.4 opacity
- Map events are visible without animation
- Mosaic tiles are in final position
- No scroll-hint bounce

- [ ] **Step 4: Fix any issues found**

Apply fixes as needed based on testing.

- [ ] **Step 5: Commit final polish**

```bash
git add stories/
git commit -m "fix: polish superarchaic DNA story — integration testing fixes"
```

---

## Verification Checklist

- [ ] Page loads without console errors
- [ ] All 7 sections render and are scrollable
- [ ] Percentage ring animation works (100% → 80%)
- [ ] Genome bar builds up across sections 2 → 3 → 7
- [ ] Ghost silhouette flickers/animates
- [ ] Merge event map shows two animated events
- [ ] Mosaic figure assembles on scroll
- [ ] "Explore Hominin Family" link works
- [ ] "Read the original research" DOI link works
- [ ] Source citation is visible and accurate
- [ ] Reduced-motion fallback works
- [ ] Mobile layout (375px) works — no overflow
- [ ] Dark theme matches main site aesthetic
- [ ] Page accessible from main site navigation
- [ ] Total page weight < 200KB (check in devtools Network tab)
