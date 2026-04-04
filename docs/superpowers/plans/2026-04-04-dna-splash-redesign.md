# DNA Splash Screen Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static splash screen with a cinematic Canvas 2D animation — a rotating DNA helix that organically dissolves into an upward-growing Tree of Life with species photos filling in by evolutionary timeline.

**Architecture:** Single `<canvas>` element driven by a 4-phase state machine in one `requestAnimationFrame` loop. All text rendered on Canvas via `ctx.fillText()`. Photos preloaded during helix phase, drawn with arc-clipped `ctx.drawImage()`. Dependency-injected — splash.js receives TREE, PHOTO_MAP, t(), FACTS, ERA_NAMES via `initSplash(canvas, opts)`.

**Tech Stack:** Vanilla JS, Canvas 2D API, CSS3 (overlay only), no external libraries.

**Spec:** `docs/superpowers/specs/2026-04-04-dna-splash-redesign-design.md`

---

## File Structure

| File | Role | Action |
|------|------|--------|
| `mockups/splash-dna.html` | Self-contained mockup with full animation, debug controls | Create |
| `js/splash.js` | Canvas animation engine, phase state machine, interaction | Create |
| `css/splash.css` | Overlay positioning, skip button, fallback, reduced-motion | Create |
| `js/factLibrary.js` | Add `getSplashFact()` method + 8 cinematic facts | Modify |
| `js/uiData.js` | Add 8 splash translation keys (en/he/ru) | Modify |
| `index.html` | Replace `#splash` markup, add `<link>` to splash.css | Modify |
| `js/app.js` | Replace inline splash logic with `initSplash()` call | Modify |
| `js/engagement.js` | Remove `showLoading()` and `hideLoading()` | Modify |
| `css/theme.css` | Remove old splash CSS (lines 153-161) | Modify |
| `css/responsive.css` | Remove old `#splash` responsive rules | Modify |

---

## Task 1: Standalone Mockup — Full Animation

This is the acceptance criterion. Build the complete animation as a self-contained HTML file before touching any project files.

**Files:**
- Create: `mockups/splash-dna.html`

- [ ] **Step 1: Create mockups directory**

```bash
mkdir -p mockups
```

- [ ] **Step 2: Write the standalone mockup**

Create `mockups/splash-dna.html` — a single self-contained HTML file (~400-500 lines) with:

**HTML structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tree of Life — Splash Mockup</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;700&display=swap" rel="stylesheet">
  <style>/* inline styles */</style>
</head>
<body>
  <div id="splash">
    <canvas id="splash-canvas"></canvas>
    <div id="splash-skip">Skip</div>
    <!-- fallback elements hidden by default -->
    <div id="splash-fallback" style="display:none">
      <h1>Tree of Life</h1>
      <p>3.8 Billion Years of Evolution</p>
      <p>Click to explore</p>
    </div>
  </div>
  <!-- debug controls (mockup only) -->
  <div id="debug-panel">
    <button onclick="resetFirstVisit()">Reset First Visit</button>
    <button onclick="simulateReturn()">Simulate Return</button>
    <button onclick="location.reload()">Replay</button>
  </div>
  <div id="app-placeholder"><!-- simulates the app behind splash --></div>
  <script>/* animation code */</script>
</body>
</html>
```

**CSS (inline in `<style>`):**
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #141618; overflow: hidden; font-family: 'Inter', sans-serif; }

#splash {
  position: fixed; inset: 0;
  background: #141618;
  z-index: 9999;
  transition: opacity 0.5s ease;
}

#splash-canvas {
  width: 100%; height: 100%;
  display: block;
}

#splash-skip {
  position: fixed; bottom: 24px; right: 24px;
  font-family: 'Inter', sans-serif;
  font-size: 13px; color: rgba(230,225,216,0.4);
  cursor: pointer; z-index: 10000;
  opacity: 0; transition: opacity 0.4s ease;
  letter-spacing: 1px;
}
#splash-skip:hover { color: rgba(230,225,216,0.7); }

#splash-fallback {
  position: absolute; inset: 0;
  display: none; /* shown if canvas fails */
  flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; color: #e6e1d8; text-align: center; cursor: pointer;
}
#splash-fallback h1 { font-size: clamp(2rem, 6vw, 4rem); font-weight: 700; }
#splash-fallback p { color: rgba(154,148,136,0.6); font-size: 16px; }

#debug-panel {
  position: fixed; top: 8px; left: 8px; z-index: 20000;
  display: flex; gap: 6px;
}
#debug-panel button {
  padding: 4px 10px; font-size: 11px;
  background: rgba(255,255,255,0.1); color: #aaa;
  border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;
  cursor: pointer;
}

#app-placeholder {
  position: fixed; inset: 0;
  background: #141618;
  display: flex; align-items: center; justify-content: center;
  color: #e6e1d8; font-size: 24px;
}
#app-placeholder::after { content: '🌳 Tree of Life App (placeholder)'; }

@media (prefers-reduced-motion: reduce) {
  #splash-canvas { display: none; }
  #splash-fallback { display: flex !important; }
}
```

**JavaScript (inline in `<script>`) — the core animation engine:**

The script must implement these components:

**A. Configuration & sample data:**
```javascript
const BG = '#141618';
const GOLD = '#c8883a';
const PARCHMENT = '#e6e1d8';
const TEXT_DIM = 'rgba(154,148,136,0.6)';
const DOMAIN_COLORS = ['#ef4444','#f59e0b','#40b8b0','#27ae60','#e67e22','#8b5cf6'];

// Sample species for mockup — sorted by appeared (oldest first)
const SAMPLE_SPECIES = [
  { name:'LUCA', appeared:3800, color:'#8b5cf6', photo:null },
  { name:'Bacteria', appeared:3500, color:'#ef4444', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/EscherichiaColi_NIAID.jpg/320px-EscherichiaColi_NIAID.jpg' },
  { name:'Archaea', appeared:3500, color:'#f59e0b', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Halobacteria.jpg/320px-Halobacteria.jpg' },
  { name:'Cyanobacteria', appeared:2700, color:'#ef4444', photo:null },
  { name:'Eukaryota', appeared:2100, color:'#40b8b0', photo:null },
  { name:'Fungi', appeared:800, color:'#e67e22', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/320px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg' },
  { name:'Plants', appeared:500, color:'#27ae60', photo:null },
  { name:'Arthropoda', appeared:530, color:'#2980b9', photo:null },
  { name:'Fish', appeared:500, color:'#2980b9', photo:null },
  { name:'Amphibians', appeared:370, color:'#2980b9', photo:null },
  { name:'Reptiles', appeared:312, color:'#2980b9', photo:null },
  { name:'Mammals', appeared:200, color:'#2980b9', photo:null },
  { name:'Birds', appeared:160, color:'#2980b9', photo:null },
  { name:'Primates', appeared:65, color:'#2980b9', photo:null },
  { name:'Hominini', appeared:7, color:'#2980b9', photo:null },
  { name:'Homo sapiens', appeared:0.3, color:'#2980b9', photo:null },
  // ... fill to ~30 nodes
];
```

**B. Photo preloader with concurrency limit:**
```javascript
function preloadPhotos(species, maxConcurrent = 6) {
  const images = new Map(); // name → Image|null
  let queue = species.filter(s => s.photo);
  let active = 0;

  function loadNext() {
    while (active < maxConcurrent && queue.length > 0) {
      const sp = queue.shift();
      active++;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { images.set(sp.name, img); active--; loadNext(); };
      img.onerror = () => { images.set(sp.name, null); active--; loadNext(); };
      img.src = sp.photo;
    }
  }
  loadNext();
  return images; // caller checks .get() — undefined means still loading, null means failed
}
```

**C. Tree layout generator — builds an upward tree from species data:**
```javascript
function buildSplashTree(species, W, H) {
  // Returns { nodes: [{x, y, r, color, name, appeared, imgKey}], edges: [{from, to}] }
  // Root at bottom center, branches upward
  // Group species by domain/depth for artistic branching
  // Node positions computed relative to canvas center
  // ~30-40 nodes, edges as parent→child indices
}
```

**D. Helix geometry — generates pairs for the wireframe helix:**
```javascript
function computeHelixPairs(cx, cy, time, numPairs, amplitude, spacing) {
  // Returns array of { leftX, leftY, rightX, rightY, depth, color }
  // Each pair uses sin/cos for 3D rotation effect
  // depth = cos(phase) for front/back sorting
}
```

**E. Phase state machine:**
```javascript
const PHASE = { HELIX: 0, UNRAVEL: 1, FILL: 2, READY: 3 };
let phase = PHASE.HELIX;
let elapsed = 0;
let fastForward = false;
let canvasReady = false;

// Phase timing (seconds)
const TIMING = {
  HELIX_END: 1.5,
  UNRAVEL_END: 3.5,
  FILL_END: 5.5,
  READY_END: 7.0,
  AUTO_DISMISS: 12.0
};

// For returning visitors, compress:
const TIMING_SHORT = {
  HELIX_END: 0,
  UNRAVEL_END: 0,
  FILL_END: 1.5,
  READY_END: 2.5,
  AUTO_DISMISS: 7.5
};
```

**F. Main render loop:**
```javascript
function render(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const dt = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;
  elapsed += dt * (fastForward ? 10 : 1); // fast-forward accelerates 10x

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  const timing = isReturnVisit ? TIMING_SHORT : TIMING;

  if (elapsed < timing.HELIX_END) {
    drawPhaseHelix(elapsed, timing);
  } else if (elapsed < timing.UNRAVEL_END) {
    drawPhaseUnravel(elapsed - timing.HELIX_END, timing);
  } else if (elapsed < timing.FILL_END) {
    drawPhaseFill(elapsed - timing.UNRAVEL_END, timing);
  } else if (elapsed < timing.AUTO_DISMISS) {
    drawPhaseReady(elapsed - timing.FILL_END, timing);
  } else {
    dismiss();
    return;
  }

  animId = requestAnimationFrame(render);
}
```

**G. Phase draw functions — each draws its visual state:**

`drawPhaseHelix(t, timing)`:
- Fade in helix from t=0 to t=0.3 (alpha ramp)
- Draw rotating wireframe helix using `computeHelixPairs()`
- Backbone: gold quadratic curves through pair endpoints
- Rungs: thin lines between left/right with domain-colored circles at endpoints
- Text: "3,800,000,000" large and thin (Inter 200), fade in at 0.3s, fade out at 1.3s
- Subtitle: "years of evolution" below, same timing

`drawPhaseUnravel(t, timing)`:
- Helix rotation decelerates to 0
- Rungs fade out (opacity → 0 over 0.8s)
- Strands drift apart with quadratic easing
- Strand endpoints lerp toward tree node positions
- Sequential text overlays (0.5s each, 0.1s gap):
  - Fact → species count → domain count
  - Each: 150ms fade-in → 200ms hold → 150ms fade-out → 100ms gap

`drawPhaseFill(t, timing)`:
- Tree structure fully formed (upward tree)
- Empty circles with domain-colored outlines
- Fill nodes by evolutionary timeline: iterate `SAMPLE_SPECIES` sorted by `appeared` desc
- Stagger fills across the 2s duration
- Each fill: draw photo via `ctx.drawImage()` with `ctx.arc()` clip, or solid color if no photo
- Expanding ring pulse per node (400ms decay)
- Era caption at bottom: small text tracking current Mya milestone

`drawPhaseReady(t, timing)`:
- Tree with all nodes filled
- Breathing pulse: node radius oscillates ±3% via `sin(elapsed * 1.5)`
- Title "Tree of Life" fades in (0→0.5s of this phase)
- Subtitle fades in (0.2→0.7s)
- Random fact fades in (0.5→1.0s)

**H. Canvas text helper with RTL support:**
```javascript
function drawText(text, x, y, { size = 16, weight = '400', alpha = 1, align = 'center', color = PARCHMENT, lang = 'en' } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  if (lang === 'he') {
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
  }
  ctx.fillText(text, x, y);
  ctx.restore();
}
```

**I. Interaction handlers:**
```javascript
// Click anywhere → fast-forward
splash.addEventListener('click', (e) => {
  if (e.target === skipBtn) return;
  fastForward = true;
});

// Skip button → immediate dismiss
skipBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dismiss();
});

// Show skip after 1s
setTimeout(() => { skipBtn.style.opacity = '1'; }, 1000);
```

**J. Dismiss function:**
```javascript
let dismissed = false;
function dismiss() {
  if (dismissed) return;
  dismissed = true;
  cancelAnimationFrame(animId);
  localStorage.setItem('tol-splash-seen', '1');
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.style.display = 'none';
    // In real app: animateTreeEntrance()
  }, 500);
}
```

**K. Canvas init with fallback:**
```javascript
const canvas = document.getElementById('splash-canvas');
const splash = document.getElementById('splash');
const skipBtn = document.getElementById('splash-skip');
const fallback = document.getElementById('splash-fallback');

// Set canvas resolution
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
}

const ctx = canvas.getContext('2d');
if (ctx) {
  canvasReady = true;
  resize();
  window.addEventListener('resize', resize);
  const isReturnVisit = localStorage.getItem('tol-splash-seen') === '1';
  const photos = preloadPhotos(SAMPLE_SPECIES);
  requestAnimationFrame(render);
} 

// Fallback check after 500ms
setTimeout(() => {
  if (!canvasReady) {
    canvas.style.display = 'none';
    fallback.style.display = 'flex';
  }
}, 500);
```

**L. Debug controls (mockup-only):**
```javascript
function resetFirstVisit() {
  localStorage.removeItem('tol-splash-seen');
  location.reload();
}
function simulateReturn() {
  localStorage.setItem('tol-splash-seen', '1');
  location.reload();
}
```

The above sections A–L form the complete mockup script. Assemble them into the single `<script>` block. The tree layout function (C) should position ~30 nodes as an artistic upward-branching tree: root at bottom center, 3 main branches (Bacteria, Archaea, Eukaryota) splitting upward, each with 2-3 sub-branches, each with 2-3 leaf nodes.

- [ ] **Step 3: Verify the mockup in browser**

```bash
# Start the dev server (or just open the file directly)
node serve.js &
# Open http://localhost:5555/mockups/splash-dna.html
```

Verify:
- Full 4-phase animation runs at 60fps
- Text overlays appear/disappear without overlap
- Species photos load into nodes (colored circles for failures)
- Skip button appears after 1s, works on click
- Click anywhere fast-forwards gracefully
- Auto-dismisses at 12s
- Debug buttons: "Reset First Visit" shows full animation, "Simulate Return" shows compressed version
- Resize browser window — animation scales proportionally
- Open DevTools → toggle "prefers-reduced-motion" → static frame shown

- [ ] **Step 4: Commit the mockup**

```bash
git add mockups/splash-dna.html
git commit -m "feat: add standalone DNA splash mockup — full 4-phase Canvas animation"
```

**CHECKPOINT: Show the mockup to the user for visual approval before continuing. Do not proceed to Task 2 until the user confirms the animation looks and feels right.**

---

## Task 2: Add Translation Keys and Cinematic Facts

**Files:**
- Modify: `js/uiData.js` (TRANSLATIONS object)
- Modify: `js/factLibrary.js` (FACTS, add getSplashFact)

- [ ] **Step 1: Add splash translation keys to uiData.js**

In `js/uiData.js`, add these keys to each language object inside `TRANSLATIONS`:

**In the `en:` object** (after the last existing key):
```javascript
    splash_big_number:'3,800,000,000',
    splash_years_label:'years of evolution',
    splash_species_count:'{count} species',
    splash_domains_count:'{count} domains \u2192 1 tree',
    splash_subtitle:'3.8 Billion Years of Evolution',
    splash_skip:'Skip',
    splash_click:'Click to explore',
    splash_era_caption:'{mya} Mya \u2014 {name}',
```

**In the `he:` object:**
```javascript
    splash_big_number:'3,800,000,000',
    splash_years_label:'\u05E9\u05E0\u05D5\u05EA \u05D0\u05D1\u05D5\u05DC\u05D5\u05E6\u05D9\u05D4',
    splash_species_count:'{count} \u05DE\u05D9\u05E0\u05D9\u05DD',
    splash_domains_count:'{count} \u05EA\u05D7\u05D5\u05DE\u05D9\u05DD \u2190 \u05E2\u05E5 1',
    splash_subtitle:'3.8 \u05DE\u05D9\u05DC\u05D9\u05D0\u05E8\u05D3 \u05E9\u05E0\u05D5\u05EA \u05D0\u05D1\u05D5\u05DC\u05D5\u05E6\u05D9\u05D4',
    splash_skip:'\u05D3\u05DC\u05D2',
    splash_click:'\u05DC\u05D7\u05E5 \u05DC\u05D7\u05E7\u05D5\u05E8',
    splash_era_caption:'{mya} \u05DE\u05DC"\u05E9 \u2014 {name}',
```

**In the `ru:` object:**
```javascript
    splash_big_number:'3 800 000 000',
    splash_years_label:'\u043B\u0435\u0442 \u044D\u0432\u043E\u043B\u044E\u0446\u0438\u0438',
    splash_species_count:'{count} \u0432\u0438\u0434\u043E\u0432',
    splash_domains_count:'{count} \u0434\u043E\u043C\u0435\u043D\u043E\u0432 \u2192 1 \u0434\u0440\u0435\u0432\u043E',
    splash_subtitle:'3,8 \u043C\u0438\u043B\u043B\u0438\u0430\u0440\u0434\u0430 \u043B\u0435\u0442 \u044D\u0432\u043E\u043B\u044E\u0446\u0438\u0438',
    splash_skip:'\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C',
    splash_click:'\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u0434\u043B\u044F \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F',
    splash_era_caption:'{mya} \u043C\u043B\u043D \u043B\u0435\u0442 \u2014 {name}',
```

- [ ] **Step 2: Add cinematic facts and getSplashFact() to factLibrary.js**

In `js/factLibrary.js`, add 8 new facts to the `facts` array with `splash: true` tag:

```javascript
    { id:'splash_01', en:'Every living cell reads the same genetic code.', he:'כל תא חי קורא את אותו קוד גנטי.', ru:'Каждая живая клетка читает один и тот же генетический код.', tags:['genetics','splash'], species:null, loading:true, panel:false, tooltip:false, discovery:true },
    { id:'splash_02', en:'You share 60% of your DNA with a banana.', he:'אתה חולק 60% מה-DNA שלך עם בננה.', ru:'Вы разделяете 60% ДНК с бананом.', tags:['genetics','splash'], species:null, loading:true, panel:false, tooltip:false, discovery:true },
    { id:'splash_03', en:'The first photosynthesis turned the sky blue.', he:'הפוטוסינתזה הראשונה הפכה את השמים לכחולים.', ru:'Первый фотосинтез окрасил небо в голубой цвет.', tags:['evolution','splash'], species:null, loading:true, panel:false, tooltip:false, discovery:true },
    { id:'splash_04', en:'All life on Earth descends from a single ancestor.', he:'כל החיים על פני כדור הארץ מגיעים מאב קדמון אחד.', ru:'Вся жизнь на Земле произошла от одного предка.', tags:['evolution','splash'], species:null, loading:true, panel:false, tooltip:false, discovery:true },
    { id:'splash_05', en:'Your body contains more bacterial cells than human ones.', he:'בגוף שלך יש יותר תאי חיידקים מתאים אנושיים.', ru:'В вашем теле больше бактериальных клеток, чем человеческих.', tags:['biology','splash'], species:null, loading:true, panel:false, tooltip:false, discovery:true },
    { id:'splash_06', en:'Fungi are closer to animals than to plants.', he:'פטריות קרובות יותר לבעלי חיים מאשר לצמחים.', ru:'Грибы ближе к животным, чем к растениям.', tags:['taxonomy','splash'], species:null, loading:true, panel:false, tooltip:false, discovery:true },
    { id:'splash_07', en:'Octopuses have three hearts and blue blood.', he:'לתמנונים יש שלושה לבבות ודם כחול.', ru:'У осьминогов три сердца и голубая кровь.', tags:['biology','splash'], species:null, loading:true, panel:false, tooltip:false, discovery:true },
    { id:'splash_08', en:'Sharks are older than trees.', he:'כרישים עתיקים יותר מעצים.', ru:'Акулы древнее деревьев.', tags:['evolution','splash'], species:null, loading:true, panel:false, tooltip:false, discovery:true },
```

Then add a `getSplashFact` method. Find the return statement of the IIFE (where `getLoadingFact` is exposed) and add `getSplashFact` alongside it:

```javascript
  function getSplashFact(lang) {
    const pool = facts.filter(f => f.tags && f.tags.includes('splash'));
    const f = pool[Math.floor(Math.random() * pool.length)];
    return f[lang] || f.en;
  }
```

Add `getSplashFact` to the returned object alongside `getLoadingFact`.

- [ ] **Step 3: Verify translations load**

```bash
node serve.js &
# Open http://localhost:5555/?lang=he — check console for no errors
# Open http://localhost:5555/?lang=ru — check console for no errors
```

- [ ] **Step 4: Commit**

```bash
git add js/uiData.js js/factLibrary.js
git commit -m "feat: add splash translation keys (en/he/ru) and 8 cinematic facts"
```

---

## Task 3: Create css/splash.css

**Files:**
- Create: `css/splash.css`

- [ ] **Step 1: Write splash.css**

Create `css/splash.css`:

```css
/* ── DNA SPLASH SCREEN ── */

#splash {
  position: fixed;
  inset: 0;
  background: #141618;
  z-index: var(--z-splash, 9999);
  transition: opacity 0.5s ease;
}

#splash-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Skip button ── */
#splash-skip {
  position: fixed;
  bottom: 24px;
  right: 24px;
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 13px;
  letter-spacing: 1px;
  color: rgba(230, 225, 216, 0.4);
  cursor: pointer;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.4s ease;
}

#splash-skip:hover {
  color: rgba(230, 225, 216, 0.7);
}

/* ── CSS-only fallback ── */
#splash-fallback {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #e6e1d8;
  text-align: center;
  cursor: pointer;
  font-family: var(--font-sans, 'Inter', sans-serif);
}

#splash-fallback h1 {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

#splash-fallback p {
  color: rgba(154, 148, 136, 0.6);
  font-size: 16px;
  max-width: 480px;
  line-height: 1.6;
}

/* ── Reduced motion: skip animation entirely ── */
@media (prefers-reduced-motion: reduce) {
  #splash { transition: none; }
  #splash-canvas { display: none; }
  #splash-fallback { display: flex !important; }
  #splash-skip { display: none; }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/splash.css
git commit -m "feat: add css/splash.css — overlay, skip button, fallback, reduced-motion"
```

---

## Task 4: Create js/splash.js — Canvas Animation Engine

**Files:**
- Create: `js/splash.js`

- [ ] **Step 1: Write js/splash.js**

This is the core file. Port the working animation from the mockup (Task 1), restructured as an ES module with dependency injection.

```javascript
// js/splash.js — DNA helix → Tree of Life splash animation

const BG = '#141618';
const GOLD = '#c8883a';
const PARCHMENT = '#e6e1d8';
const TEXT_DIM = 'rgba(154,148,136,0.6)';

export function initSplash(canvas, opts) {
  const { tree, photoMap, t, facts, eraNames, onDone } = opts;

  // ── Compute dynamic data from tree ──
  let speciesCount = 0;
  function countNodes(node) { speciesCount++; if (node.children) node.children.forEach(countNodes); }
  countNodes(tree);
  const domainCount = tree.children ? tree.children.length : 0;

  // ── Select ~30 representative nodes for splash tree ──
  const splashNodes = selectSplashNodes(tree);
  // Sort by appeared (descending = oldest first)
  splashNodes.sort((a, b) => b.appeared - a.appeared);

  // ── Preload photos (max 6 concurrent) ──
  const images = preloadPhotos(splashNodes, photoMap, 6);

  // ── Set up fallback elements with translated text ──
  const fallback = document.getElementById('splash-fallback');
  if (fallback) {
    const h1 = fallback.querySelector('h1');
    const ps = fallback.querySelectorAll('p');
    if (h1) h1.textContent = t('title');
    if (ps[0]) ps[0].textContent = tpl(t('splash_subtitle'), {});
    if (ps[1]) ps[1].textContent = t('splash_click');
    fallback.addEventListener('click', dismiss);
  }

  // ── Canvas setup ──
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // fallback will show via 500ms timeout

  let W, H;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Signal canvas is ready (checked by fallback timeout in app.js) ──
  canvas.dataset.ready = '1'; // app.js reads this to know Canvas initialized

  // ── State ──
  const isReturn = localStorage.getItem('tol-splash-seen') === '1';
  const lang = document.documentElement.lang || 'en';
  const timing = isReturn
    ? { helix: 0, unravel: 0, fill: 1.5, ready: 2.5, auto: 7.5 }
    : { helix: 1.5, unravel: 3.5, fill: 5.5, ready: 7.0, auto: 12.0 };

  let elapsed = 0;
  let lastTs = null;
  let animId = null;
  let ff = false; // fast-forward
  let done = false;

  // ── Build tree layout ──
  const treeLayout = buildUpwardTree(splashNodes, W, H);

  // ── Helix pairs ──
  const NUM_PAIRS = 15;

  // ── Text sequence for Phase 1 ──
  const splashFact = facts.getSplashFact ? facts.getSplashFact(lang) : facts.getLoadingFact(lang);
  const countText = tpl(t('splash_species_count'), { count: speciesCount });
  const domainText = tpl(t('splash_domains_count'), { count: domainCount });
  const textSeq = [splashFact, countText, domainText];

  // ── Era milestones for Phase 2 caption ──
  const eraMilestones = [
    { mya: 3500, name: 'Bacteria' },
    { mya: 2100, name: 'Eukaryota' },
    { mya: 200, name: 'Mammals' },
    { mya: 0.3, name: 'Homo sapiens' },
  ];

  // ── Template interpolation helper ──
  function tpl(str, vars) {
    return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? vars[k] : _);
  }

  // ── Canvas text helper with RTL ──
  function drawText(text, x, y, { size = 16, weight = '400', alpha = 1, align = 'center', color = PARCHMENT } = {}) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Inter, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    if (lang === 'he') {
      ctx.direction = 'rtl';
      if (align === 'center') ctx.textAlign = 'center'; // center still works for RTL
      else ctx.textAlign = 'right';
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // ── Easing ──
  function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  // ── Phase draw functions ──
  // (Port from mockup — drawPhaseHelix, drawPhaseUnravel, drawPhaseFill, drawPhaseReady)
  // Each function takes (phaseTime) and draws to ctx using W, H, treeLayout, images, etc.

  // ... [full implementation ported from mockup, same logic as Task 1 sections D-G]

  // ── Main loop ──
  function render(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    elapsed += dt * (ff ? 10 : 1);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    if (elapsed < timing.helix) {
      drawPhaseHelix(elapsed);
    } else if (elapsed < timing.unravel) {
      drawPhaseUnravel(elapsed - timing.helix);
    } else if (elapsed < timing.fill) {
      drawPhaseFill(elapsed - timing.unravel);
    } else if (elapsed < timing.auto) {
      drawPhaseReady(elapsed - timing.fill);
    } else {
      dismiss();
      return;
    }

    animId = requestAnimationFrame(render);
  }

  // ── Start ──
  animId = requestAnimationFrame(render);

  // ── Skip button ──
  const skipBtn = document.getElementById('splash-skip');
  if (skipBtn) {
    skipBtn.textContent = t('splash_skip');
    setTimeout(() => { skipBtn.style.opacity = '1'; }, 1000);
    skipBtn.addEventListener('click', (e) => { e.stopPropagation(); dismiss(); });
  }

  // ── Click to fast-forward ──
  const splashEl = document.getElementById('splash');
  if (splashEl) {
    splashEl.addEventListener('click', (e) => {
      if (e.target === skipBtn) return;
      ff = true;
    });
  }

  // ── Dismiss ──
  function dismiss() {
    if (done) return;
    done = true;
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
    localStorage.setItem('tol-splash-seen', '1');
    if (splashEl) {
      splashEl.style.opacity = '0';
      setTimeout(() => {
        splashEl.style.display = 'none';
        onDone();
      }, 500);
    } else {
      onDone();
    }
  }
}

// ── Helper: select ~30 representative nodes from tree ──
function selectSplashNodes(tree) {
  const nodes = [];
  function walk(node, depth) {
    if (depth <= 3) {
      nodes.push({ name: node.name, id: node.id, appeared: node.appeared || 0, color: node.color || '#888', depth });
    }
    if (node.children) node.children.forEach(ch => walk(ch, depth + 1));
  }
  walk(tree, 0);
  return nodes.slice(0, 35); // cap at 35
}

// ── Helper: build upward tree layout ──
function buildUpwardTree(species, W, H) {
  // Position nodes as an artistic upward-branching tree
  // Root at bottom center, branches spread upward
  // Returns { nodes: [{x, y, r, ...species}], edges: [{from, to}] }
  // ... [same layout algorithm as mockup Task 1 section C]
}

// ── Helper: preload photos with concurrency limit ──
function preloadPhotos(species, photoMap, maxConcurrent) {
  const images = new Map();
  const queue = species.filter(s => photoMap[s.id]).map(s => ({ id: s.id, url: photoMap[s.id].url }));
  let active = 0;

  function loadNext() {
    while (active < maxConcurrent && queue.length > 0) {
      const item = queue.shift();
      active++;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { images.set(item.id, img); active--; loadNext(); };
      img.onerror = () => { images.set(item.id, null); active--; loadNext(); };
      img.src = item.url;
    }
  }
  loadNext();
  return images;
}
```

**Important:** The four `drawPhase*` functions must be ported from the working mockup (Task 1). They contain the actual Canvas drawing logic for helix geometry, unraveling interpolation, node filling, and ready-state breathing. Copy the exact rendering code that was validated in the mockup — do not rewrite from scratch.

- [ ] **Step 2: Commit**

```bash
git add js/splash.js
git commit -m "feat: add js/splash.js — Canvas 2D DNA splash animation engine"
```

---

## Task 5: Update index.html — Replace Splash Markup

**Files:**
- Modify: `index.html` (lines 32-42 for CSS link, lines 47-53 for splash div)

- [ ] **Step 1: Add splash.css link tag**

In `index.html`, add the splash CSS link after the existing CSS links. Find:

```html
  <link rel="stylesheet" href="css/responsive.css">
```

Add after it:

```html
  <link rel="stylesheet" href="css/splash.css">
```

- [ ] **Step 2: Replace the #splash div contents**

Replace the entire `#splash` div (lines 47-53) — from `<div id="splash" style="...">` through its closing `</div>` — with:

```html
  <div id="splash">
    <canvas id="splash-canvas"></canvas>
    <div id="splash-skip"></div>
    <div id="splash-fallback">
      <h1 id="splash-fb-title">Tree of Life</h1>
      <p id="splash-fb-subtitle">3.8 Billion Years of Evolution</p>
      <p id="splash-fb-click">Click to explore</p>
    </div>
  </div>
```

Note: all inline styles removed — styling is now in `css/splash.css`. Fallback text is English defaults; `splash.js` will set translated text on init before the 500ms timeout.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace splash HTML — canvas element, skip button, CSS fallback"
```

---

## Task 6: Update app.js — Wire initSplash()

**Files:**
- Modify: `js/app.js` (imports + init function)

- [ ] **Step 1: Add splash import**

In `js/app.js`, add to the imports at the top:

```javascript
import { initSplash } from './splash.js';
```

And remove `showLoading` and `hideLoading` from the `engagement.js` import. Find the import line:

```javascript
import { ... showLoading, hideLoading, ... animateTreeEntrance, ... } from './engagement.js';
```

Remove `showLoading,` and `hideLoading,` from it (keep `animateTreeEntrance` and other imports).

- [ ] **Step 2: Replace splash logic in init()**

In the `init()` function, find and remove all the old splash logic:

Remove the `showLoading();` call (line ~238).

Remove the entire block that starts with `const _splash = document.getElementById('splash');` through the `_splash.addEventListener('click', _dismissSplash);` line and its closing brace — roughly lines 239-262.

Replace it with:

```javascript
  // ── Splash animation ──
  const _splashCanvas = document.getElementById('splash-canvas');
  const _splashFallback = document.getElementById('splash-fallback');

  // Fallback: if Canvas doesn't init within 500ms, show CSS fallback
  setTimeout(() => {
    if (_splashCanvas && !_splashCanvas.dataset.ready && _splashFallback) {
      if (_splashCanvas) _splashCanvas.style.display = 'none';
      _splashFallback.style.display = 'flex';
      _splashFallback.addEventListener('click', () => {
        const s = document.getElementById('splash');
        if (s) { s.style.opacity = '0'; setTimeout(() => { s.style.display = 'none'; animateTreeEntrance(); }, 500); }
      });
    }
  }, 500);

  if (_splashCanvas) {
    initSplash(_splashCanvas, {
      tree: TREE,
      photoMap: PHOTO_MAP,
      t,
      facts: FACTS,
      eraNames: ERA_NAMES,
      onDone: () => {
        animateTreeEntrance();
        if (!localStorage.getItem('tol-tour-done') && !new URLSearchParams(location.search).get('node')) {
          setTimeout(showTourSelector, 1200);
        }
      }
    });
  }
```

Make sure `ERA_NAMES` is imported. Check the existing imports from `data.js` or `uiData.js` — if `ERA_NAMES` isn't already imported, add it to the relevant import line.

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: wire initSplash() in app.js, remove old splash logic"
```

---

## Task 7: Remove Old Splash Code

**Files:**
- Modify: `js/engagement.js` (remove showLoading + hideLoading)
- Modify: `css/theme.css` (remove splash CSS, lines 153-161)
- Modify: `css/responsive.css` (remove #splash responsive rules)

- [ ] **Step 1: Remove showLoading() and hideLoading() from engagement.js**

In `js/engagement.js`, find and remove the `showLoading` function (lines ~165-219) and the `hideLoading` function (lines ~221-223). Remove both function bodies and their `export` declarations.

Also remove them from any export list if they appear in a named export block.

- [ ] **Step 2: Remove old splash CSS from theme.css**

In `css/theme.css`, find and remove lines 153-161 (the `/* ── SPLASH POLISH ── */` section):

Remove:
```css
/* ── SPLASH POLISH ── */
@keyframes splashFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes splashLineGrow{from{width:0;opacity:0}to{width:60px;opacity:1}}
#splash{opacity:1;}
#splash .splash-child{opacity:0;animation:splashFadeUp 800ms ease forwards;}
#splash h1{font-family:'Inter',var(--font-head);font-size:clamp(2rem,6vw,4rem);letter-spacing:-0.02em;margin-bottom:8px;font-weight:700;text-shadow:0 0 40px rgba(200,136,58,0.35),0 0 80px rgba(200,136,58,0.15);}
#splash{transform-origin:center;will-change:opacity,transform;}
#splash .splash-line{opacity:0;animation:splashLineGrow 600ms ease forwards;}
#splash .tagline{font-family:var(--font-sans);font-size:clamp(0.9rem,2vw,1.1rem);opacity:0.75;max-width:480px;text-align:center;line-height:1.6;}
```

- [ ] **Step 3: Remove old splash responsive rules from responsive.css**

In `css/responsive.css`, find and remove these three rules:
- Line ~246: `#splash h1 { font-size: clamp(1.6rem,6vw,2.5rem) !important; }`
- Line ~276: `#splash h1 { font-size: 1.4rem !important; }`
- Line ~374: `#splash { transition: none !important; }`

- [ ] **Step 4: Commit**

```bash
git add js/engagement.js css/theme.css css/responsive.css
git commit -m "chore: remove old splash — showLoading(), CSS animations, responsive overrides"
```

---

## Task 8: Integration Verification

**Files:** None (testing only)

- [ ] **Step 1: Start dev server and test full flow**

```bash
node serve.js
```

Open `http://localhost:5555` in browser. Verify:

1. **First visit (clear localStorage first):** Full 4-phase animation plays — helix → unravel → fill → ready. Title and subtitle appear. Auto-dismisses at 12s.
2. **Click during animation:** Fast-forwards gracefully to end, then transitions to tree.
3. **Skip button:** Appears after 1s, click immediately dismisses to tree.
4. **Return visit:** Reload page — compressed animation (starts at Phase 2, ~3s total).
5. **Languages:** Test `?lang=he` — verify RTL text renders correctly on Canvas, especially template strings with numbers. Test `?lang=ru`.
6. **Reduced motion:** In DevTools, toggle `prefers-reduced-motion: reduce` — verify static fallback shown (title + subtitle + "Click to explore"), no animation.
7. **Canvas fallback:** In DevTools console, run `document.getElementById('splash-canvas').getContext = null; location.reload()` — verify CSS fallback appears within 500ms with translated text.
8. **Mobile:** Use DevTools responsive mode at 375×812 — animation scales, text readable, skip button reachable.
9. **Console:** No errors in DevTools console across all tests.

- [ ] **Step 2: Test tree entrance transition**

After splash dismisses, verify:
- Tree renders correctly (no visual glitches from splash removal)
- `animateTreeEntrance()` plays as before
- Tour selector appears for first-time visitors (after splash + 1.2s delay)
- Theme is correct (if user had light theme, it applies during crossfade)

- [ ] **Step 3: Commit any fixes found during verification**

If any issues found, fix and commit:

```bash
git add -A
git commit -m "fix: splash integration fixes from verification"
```

**CHECKPOINT: Ask user to review the integrated splash in their browser before considering the feature complete.**

---

## Summary

| Task | What | Est. Time |
|------|------|-----------|
| 1 | Standalone mockup (acceptance criterion) | Largest — full animation |
| 2 | Translation keys + cinematic facts | Small data changes |
| 3 | css/splash.css | Small CSS file |
| 4 | js/splash.js (port from mockup) | Medium — structured port |
| 5 | index.html markup update | Small HTML edit |
| 6 | app.js wiring | Medium — careful replacement |
| 7 | Remove old splash code | Small cleanup |
| 8 | Integration verification | Testing |
