// ══════════════════════════════════════════════════════
// SPLASH.JS — the opening: 3.8 billion years in four seconds
//
// One idea, told once: everything alive descends from a single point.
// A light ignites at the centre (LUCA), radiates outward generation by
// generation, and settles into the tree the site is about — while a
// readout counts down from 3,800 Ma to the present.
//
// The layout is radial because the site's own default view is radial, so
// the opening is a rehearsal of the real thing rather than a different
// picture. The previous version spent twelve seconds turning a DNA helix
// into a flat fan the app never shows, and put the title on top of the
// branches; this one is over in four and a half, and can be skipped from
// the first frame.
//
// Phases, all in seconds:
//   ORIGIN    0 → 0.7   a point of light, dust drifting
//   RADIATE   0.7 → 3.0 branches grow outward, deep time runs down
//   SETTLE    3.0 → 4.2 growth completes, tree dims, title rises
//   READY     4.2 →     slow drift until clicked, auto-dismiss at 6.5
// ══════════════════════════════════════════════════════

const PHASE = { origin: 0.7, radiate: 3.0, settle: 4.2, auto: 6.5 };
const RINGS = 4;              // generations drawn, root included
const MAX_PER_PARENT = 5;     // children kept per node, widest first
const START_MYA = 3800;
/* Angular wedge left empty at the bottom, in radians. Wide enough that the
   title clears the branches at the radius it sits on: the gap measures
   2·r·sin(GAP/2) across, so ~1.4·r here. */
const GAP = 1.6;

export function initSplash(canvas, opts) {
  const { tree, t: t_fn, facts, onDone } = opts;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const lang = document.documentElement.lang || 'en';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Colours come from the stylesheet, not from constants, so the opening
     follows the light theme instead of staying dark against a light page —
     which is exactly the trap the reveal panel fell into. Read once: the
     theme cannot change while the splash is up. */
  const css = getComputedStyle(document.documentElement);
  const v = (name, fallback) => (css.getPropertyValue(name) || '').trim() || fallback;
  const INK = v('--text-primary', '#e6e1d8');
  const MUTED = v('--text-secondary', '#9a9488');
  const GOLD = v('--accent-primary', '#c8883a');
  const BG = v('--bg', '#0b0f14');
  /* The palette is tuned for glowing lines on a dark ground. On cream the
     same alphas wash out and the halo reads as a smudge rather than light,
     so strokes gain weight and the glow gives most of it back. */
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const LINE_GAIN = isLight ? 1.45 : 1;
  const HALO = isLight ? 0.12 : 0.34;

  // ── Fallback text (used when canvas cannot start, and by reduced motion) ──
  const fallback = document.getElementById('splash-fallback');
  if (fallback) {
    const h1 = fallback.querySelector('h1');
    const ps = fallback.querySelectorAll('p');
    if (h1) h1.textContent = t_fn('title');
    if (ps[0]) ps[0].textContent = t_fn('splash_subtitle');
    if (ps[1]) ps[1].textContent = t_fn('splash_click');
    fallback.addEventListener('click', () => dismiss());
  }

  const splashEl = document.getElementById('splash');
  const skipBtn = document.getElementById('splash-skip');
  let done = false;
  /* Declared before the reduced-motion return below, because dismiss()
     closes over both and that path reaches it without ever starting a
     loop or a timer. */
  let raf = null;
  let autoTimer = null;

  /* Someone who has asked for less motion gets the words and nothing that
     moves. The stylesheet already swaps canvas for fallback; bailing here
     as well means no animation loop runs at all. */
  if (reduced) {
    canvas.dataset.ready = '1';
    if (skipBtn) { skipBtn.textContent = t_fn('splash_skip'); skipBtn.style.opacity = '1'; }
    wireDismiss();
    setTimeout(() => dismiss(), 2500);
    return;
  }

  // ── Geometry ─────────────────────────────────────────────────────────
  let W = 0, H = 0, cx = 0, cy = 0, unit = 0, maxR = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;
    /* Size the tree from both axes rather than the short one. Keyed to the
       short side alone, a tall phone got a knot of branches in the middle
       of an empty screen — width is what constrains a radial figure on a
       portrait viewport, height on a landscape one. */
    maxR = Math.min(W * 0.46, H * 0.40);
    unit = maxR / (RINGS - 1);
    /* Centre the whole composition, not the tree. What occupies the screen
       runs from the top of the branches to the last line of text, so the
       origin is placed by measuring that block — otherwise the figure rides
       high and leaves a third of a phone screen empty beneath it. */
    const block = maxR + maxR * 0.80 + maxR * 0.34;
    cy = maxR + Math.max(12, (H - block) / 2);
  }
  resize();
  window.addEventListener('resize', resize);
  canvas.dataset.ready = '1';

  /* A radial layout over a pruned copy of the real tree. Angles are shared
     out among leaves and each parent sits at the mean of its children, so
     the shape is the tree's own topology rather than a decorative spiral. */
  const nodes = [];
  (function build() {
    const root = { src: tree, depth: 0, children: [] };
    const queue = [root];
    while (queue.length) {
      const n = queue.shift();
      nodes.push(n);
      if (n.depth >= RINGS - 1) continue;
      const kids = (n.src.children || [])
        .slice()
        .sort((a, b) => countLeaves(b) - countLeaves(a))
        .slice(0, MAX_PER_PARENT);
      for (const k of kids) {
        const child = { src: k, depth: n.depth + 1, parent: n, children: [] };
        n.children.push(child);
        queue.push(child);
      }
    }
    /* Leaves share out an arc, not the whole circle. The missing wedge sits
       straight down, which is where the deep-time counter runs and where the
       title then rises — so the words land on empty ground instead of across
       the branches, which is what made the old screen's title hard to read.
       The tree keeps its full size; it just opens downward. */
    let leafCursor = 0;
    const leaves = nodes.filter((n) => !n.children.length).length;
    const span = Math.PI * 2 - GAP;
    const start = Math.PI / 2 + GAP / 2;      // canvas y grows downward
    (function assign(n) {
      if (!n.children.length) {
        n.angle = start + (leafCursor++ / Math.max(1, leaves)) * span;
        return;
      }
      n.children.forEach(assign);
      n.angle = n.children.reduce((s, c) => s + c.angle, 0) / n.children.length;
    })(root);
    for (const n of nodes) {
      n.color = n.src.color || GOLD;
      /* Each generation starts once its parent is most of the way grown,
         which reads as one continuous outward surge rather than four
         separate rings switching on. */
      n.t0 = PHASE.origin + n.depth * 0.42;
      n.grow = 0.75;
    }
  })();

  function countLeaves(node) {
    if (!node.children || !node.children.length) return 1;
    return node.children.reduce((s, c) => s + countLeaves(c), 0);
  }

  const pos = (n, scale) => ({
    x: cx + Math.cos(n.angle) * n.depth * unit * scale,
    y: cy + Math.sin(n.angle) * n.depth * unit * scale,
  });

  // ── Drifting motes, the only thing on screen before life starts ──
  const motes = Array.from({ length: 34 }, (_, i) => ({
    a: (i / 34) * Math.PI * 2 + i * 0.7,
    r: 40 + ((i * 97) % 380),
    sp: 0.06 + ((i % 7) * 0.015),
    sz: 0.7 + ((i % 5) * 0.35),
  }));

  // ── Easing ──
  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  /* Largest size at or below `size` that keeps `str` inside `limit`. */
  function fitted(str, size, weight, limit) {
    ctx.save();
    let s = size;
    for (let i = 0; i < 8; i++) {
      ctx.font = `${weight} ${s}px Inter, Heebo, sans-serif`;
      if (ctx.measureText(str).width <= limit || s <= 11) break;
      s -= Math.max(1, s * 0.08);
    }
    ctx.restore();
    return Math.round(s);
  }

  /* `dir` is explicit rather than always following the UI language. A
     measurement like "720 Ma" is a Latin run: laid out RTL it comes back as
     "Ma 720", the same reordering the detail panel avoids with dir="ltr" on
     Latin names and eras. Prose passes nothing and follows the language. */
  function text(str, x, y, size, weight, color, alpha, spacing, dir) {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = clamp01(alpha);
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Inter, Heebo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (spacing) ctx.letterSpacing = `${spacing}px`;
    ctx.direction = dir || (lang === 'he' ? 'rtl' : 'ltr');
    ctx.fillText(str, x, y);
    ctx.restore();
  }

  // ── Frame ────────────────────────────────────────────────────────────
  let elapsed = 0, last = null;

  function frame(ts) {
    if (done) return;
    if (last == null) last = ts;
    elapsed += Math.min(0.05, (ts - last) / 1000);   // cap: a backgrounded tab must not jump
    last = ts;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    /* The tree recedes as the words arrive: it fades to a third and eases
       back a touch, so the title reads against quiet ground instead of
       competing with branches the way the old screen's did. */
    const recede = smooth(PHASE.radiate, PHASE.settle + 0.3, elapsed);
    const treeAlpha = 1 - recede * 0.62;
    const scale = 1 - recede * 0.06;

    drawMotes();
    drawBranches(treeAlpha, scale);
    drawNodes(treeAlpha, scale);
    drawOrigin(scale);
    drawWords();

    raf = requestAnimationFrame(frame);
  }

  function drawMotes() {
    const a = 0.5 - smooth(PHASE.radiate, PHASE.settle, elapsed) * 0.3;
    ctx.save();
    ctx.fillStyle = MUTED;
    for (const m of motes) {
      const ang = m.a + elapsed * m.sp;
      ctx.globalAlpha = Math.min(1, a * (0.18 + 0.16 * Math.sin(elapsed * 0.9 + m.r)) * LINE_GAIN);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(ang) * m.r, cy + Math.sin(ang) * m.r * 0.62, m.sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* Branches are drawn as their own partial arcs: a quadratic bowed away
     from the centre, cut short at the growth fraction. Bowing them is what
     stops four straight spokes from looking like a compass rose. */
  function drawBranches(alpha, scale) {
    ctx.save();
    ctx.lineCap = 'round';
    for (const n of nodes) {
      if (!n.parent) continue;
      const g = clamp01((elapsed - n.t0) / n.grow);
      if (g <= 0) continue;
      const e = easeOut(g);
      const p0 = pos(n.parent, scale);
      const p1 = pos(n, scale);
      const mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
      const bow = 0.16 * unit;
      const cpx = mx + Math.cos(n.angle + Math.PI / 2) * bow;
      const cpy = my + Math.sin(n.angle + Math.PI / 2) * bow;
      const ex = p0.x + (cpx - p0.x) * e, ey = p0.y + (cpy - p0.y) * e;
      const fx = ex + (p1.x - ex) * e, fy = ey + (p1.y - ey) * e;
      ctx.globalAlpha = Math.min(1, alpha * (0.30 + 0.5 * e) * LINE_GAIN);
      ctx.strokeStyle = n.color;
      ctx.lineWidth = Math.max(0.8, (RINGS - n.depth) * 0.72);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(p0.x + (cpx - p0.x) * e, p0.y + (cpy - p0.y) * e, fx, fy);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawNodes(alpha, scale) {
    ctx.save();
    for (const n of nodes) {
      if (!n.parent) continue;
      const g = clamp01((elapsed - n.t0 - n.grow * 0.72) / 0.34);
      if (g <= 0) continue;
      const p = pos(n, scale);
      // A little overshoot on arrival — things appearing dead-on read as flat.
      const pop = g < 1 ? 1 + Math.sin(g * Math.PI) * 0.34 : 1;
      const r = Math.max(1.6, (RINGS - n.depth) * 1.7) * pop;
      ctx.globalAlpha = Math.min(1, alpha * clamp01(g) * 0.9 * LINE_GAIN);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 10 * clamp01(g);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* LUCA. It ignites before anything else exists and stays the brightest
     thing on screen, because the whole picture is an argument about it. */
  function drawOrigin(scale) {
    const born = smooth(0, PHASE.origin, elapsed);
    const pulse = 1 + Math.sin(elapsed * 2.1) * 0.07;
    const r = 5.5 * born * pulse * scale;
    ctx.save();
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 78 * born);
    halo.addColorStop(0, hexA(GOLD, HALO * born));
    halo.addColorStop(1, hexA(GOLD, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, 78 * born, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = born;
    ctx.fillStyle = INK;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* Everything written sits in the wedge below the origin, on the same
     anchor: the counter runs there while the tree grows, then hands the
     spot to the title. One place for the words, never over a branch. */
  function drawWords() {
    const small = W < 600;
    /* Anchored by radius, not by ring count: the words have to clear the
       branches, and it is the wedge that decides where that is. */
    const anchor = cy + maxR * 0.80;
    const gapWidth = 2 * (maxR * 0.80) * Math.sin(GAP / 2);

    // Deep time, counted down as the tree grows. It is the one number that
    // says what the site is, and watching it fall does the work three
    // static captions used to do badly.
    const tRun = smooth(PHASE.origin, PHASE.radiate + 0.2, elapsed);
    const mya = Math.round((START_MYA * (1 - easeInOut(tRun))) / 10) * 10;
    const counterAlpha = smooth(PHASE.origin, PHASE.origin + 0.4, elapsed) *
                         (1 - smooth(PHASE.radiate, PHASE.radiate + 0.5, elapsed));
    if (counterAlpha > 0.01) {
      const running = mya > 0;
      const label = running ? `${mya.toLocaleString('en')} Ma` : t_fn('splash_present');
      text(label, cx, anchor, small ? 16 : 21, 500, GOLD, counterAlpha * 0.95, 3,
           running ? 'ltr' : undefined);
    }

    // The title takes the counter's place as it fades.
    const tin = smooth(PHASE.radiate + 0.15, PHASE.settle, elapsed);
    if (tin > 0.01) {
      const lift = (1 - easeOut(tin)) * 18;
      /* Measured against the wedge rather than assumed to fit. "Tree of
         Life" is short, but the Russian and Hebrew titles are not, and a
         narrow phone leaves under 200px of clear width. */
      const size = fitted(t_fn('title'), small ? 32 : 54, 700, gapWidth * 0.92);
      text(t_fn('title'), cx, anchor + lift, size, 700, INK, tin, small ? 0 : 1);
      const subSize = fitted(t_fn('splash_subtitle'), small ? 12 : 16, 400, gapWidth * 0.98);
      text(t_fn('splash_subtitle'), cx, anchor + size * 0.88 + lift * 0.6,
           subSize, 400, MUTED, tin * 0.92, 1);
    }

    // Then the invitation, pulsing gently so it reads as live.
    const cin = smooth(PHASE.settle, PHASE.settle + 0.5, elapsed);
    if (cin > 0.01) {
      const beat = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(elapsed * 2.4));
      text(t_fn('splash_click'), cx, anchor + maxR * (small ? 0.30 : 0.28), small ? 11 : 13, 500,
           MUTED, cin * beat, 2);
    }
  }

  // Canvas needs rgba; the tokens are hex. Only ever fed our own values.
  function hexA(hex, a) {
    const h = hex.replace('#', '');
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const int = parseInt(n, 16);
    if (Number.isNaN(int)) return `rgba(200,136,58,${a})`;
    return `rgba(${(int >> 16) & 255},${(int >> 8) & 255},${int & 255},${a})`;
  }

  raf = requestAnimationFrame(frame);

  // ── Leaving ──────────────────────────────────────────────────────────
  if (skipBtn) {
    skipBtn.textContent = t_fn('splash_skip');
    // Available immediately. Making someone wait to skip is the one thing
    // a splash screen must never do.
    skipBtn.style.opacity = '1';
  }
  wireDismiss();
  autoTimer = setTimeout(() => dismiss(), PHASE.auto * 1000);

  function wireDismiss() {
    if (skipBtn) skipBtn.addEventListener('click', (e) => { e.stopPropagation(); dismiss(); });
    if (splashEl) splashEl.addEventListener('click', () => dismiss());
  }

  function dismiss() {
    if (done) return;
    done = true;
    clearTimeout(autoTimer);
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    try { localStorage.setItem('tol-splash-seen', '1'); } catch { /* private mode */ }
    if (splashEl) {
      splashEl.style.opacity = '0';
      setTimeout(() => { splashEl.style.display = 'none'; onDone(); }, 450);
    } else {
      onDone();
    }
  }
}
