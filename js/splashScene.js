// ══════════════════════════════════════════════════════
// SPLASH SCENE — the Astrolabe
//
// An instrument for reading deep time, engraved rather than painted: brass
// hairlines on a dark plate, sepia ink on paper in the light theme. Distance
// from the centre is time — the ring on the outside is the present, the point
// in the middle is LUCA — so the tree is drawn to scale, as a circular
// chronogram: a thin trunk of microbes for two billion years, then the burst
// at the rim. A ring of "now" leaves the centre and everything it passes is
// engraved behind it.
//
// This module is art and nothing else. js/splash.js owns the lifecycle (skip,
// reduced motion, hand-off to the page) and every word on screen, which is DOM
// so it stays sharp on a phone whose canvas is drawn at a lower resolution.
// The scene is a pure function of time: draw(ctx, t) keeps nothing between
// calls, so a screenshot can land on exactly 2.4 s and reduced motion can paint
// the finished picture once.
//
// Time is radius on a power scale (age to the power 0.45, measured inward from
// the rim), so the last few hundred million years — where nearly everything on
// the tree lives — get the room: the last 100 Ma take a fifth of the radius.
// The scale is labelled, which is why it may be non-linear.
//
// Beats (seconds): 0 the plate and the first point · 0.42 the ring of now
// leaves the centre at 3,800 Ma · 2.25 it reaches the animals · 3.15 the rim
// begins to ignite, clockwise, and the title is engraved · 3.45 the ring
// reaches today · 4.0 the hint · 4.5 the end.
// ══════════════════════════════════════════════════════

export const DURATION = 4.5;
export const T_TITLE = 3.15;      // the plaque begins to be engraved
export const T_HINT = 4.0;        // "click to explore"
const TAU = Math.PI * 2;
const START_MYA = 3800;
const GAP = 0.5;                  // radians left empty at the bottom, where the scale runs
const RING_GA = [3.0, 2.0, 1.0, 0.5, 0.1];      // the graticule
export const LABEL_GA = [2.0, 1.0, 0.5, 0.1];   // the rings with room to be named

// ── small maths ────────────────────────────────────────
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, t) => a + (b - a) * t;
const map01 = (t, a, b) => clamp01((t - a) / (b - a));
const smooth = (a, b, x) => { const t = map01(x, a, b); return t * t * (3 - 2 * t); };
const easeOut3 = (t) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut3 = (t) => { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeOutBack = (t, s = 1.70158) => { t = clamp01(t) - 1; return 1 + t * t * ((s + 1) * t + s); };

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── colour ─────────────────────────────────────────────
function parseColor(c) {
  c = String(c || '').trim();
  let m;
  if ((m = c.match(/^#([0-9a-f]{3})$/i))) return m[1].split('').map((h) => parseInt(h + h, 16));
  if ((m = c.match(/^#([0-9a-f]{6})/i))) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  if ((m = c.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i))) return [+m[1], +m[2], +m[3]];
  return [200, 136, 58];
}
const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
  }
  return [h, s * 100, l * 100];
}
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}
/** The map's palest leaf colours would glare as white dots on the plate: pull
    every tip toward something saturated and neither white-hot nor muddy. */
function vivid(c, light) {
  const [h, s0, l0] = rgbToHsl(c);
  return hslToRgb(h, Math.max(s0, 62), light ? Math.min(Math.max(l0, 34), 46) : Math.min(Math.max(l0, 50), 62));
}

// ── the composition ────────────────────────────────────
/** Where everything sits. The same arithmetic is written in css/splash.css, so
    the first paint — before any script has run — puts the ring and the point in
    the place the canvas will draw them. Keep the two in step. */
export function geometry(W, H) {
  const small = W < 600;
  const plate = small ? 76 : 88;            // the title plaque
  const hint = 44;                          // the line beneath it
  const m = Math.max(24, H * 0.04);
  const Rc = Math.max(56, Math.min(W * 0.445, (H - 2 * m - plate - hint - 40) / 2, 330));
  const gap = 26 + 0.12 * Rc;
  const block = 2 * Rc + gap + plate + hint;
  const cy = m + (H - 2 * m - block) / 2 + Rc;
  const plaqueW = Math.min(W * 0.9, small ? 350 : 520);
  return {
    W, H, small, Rc, cx: W / 2, cy, k: Rc / 172, Rt: Rc * 0.885,
    plate, hint, gap, plaqueW, plaqueX: W / 2 - plaqueW / 2, plaqueTop: cy + Rc + gap,
    // the dynamic layer only needs the dial and a margin
    boxL: W / 2 - Rc - 10, boxT: cy - Rc - 10, box: 2 * Rc + 20,
  };
}

// ── the tree, to scale ─────────────────────────────────
function leafCount(n) {
  return n.children && n.children.length ? n.children.reduce((s, c) => s + leafCount(c), 0) : 1;
}
/** The site's own tree, a few levels down: every group and, below them, the
    widest of their children. Angles are shared out among leaves and each parent
    sits at the mean of its children, so the picture is the tree's topology. The
    two microbial domains go to either end of the arc, where their long ancient
    lines fall as roots on both sides of the scale, and the eukaryotes make the
    crown between them. */
function layoutTree(src, light, depthMax, maxKids) {
  const root = { src, id: src.id, depth: 0, parent: null, children: [] };
  const all = [root];
  for (let i = 0; i < all.length; i++) {
    const n = all[i];
    if (n.depth >= depthMax) continue;
    const kids = (n.src.children || []).slice().sort((a, b) => leafCount(b) - leafCount(a)).slice(0, maxKids);
    for (const k of kids) { const c = { src: k, id: k.id, depth: n.depth + 1, parent: n, children: [] }; n.children.push(c); all.push(c); }
  }
  const order = ['bacteria', 'eukaryota', 'archaea'];
  root.children.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  const leaves = all.filter((n) => !n.children.length);
  const span = TAU - GAP, start = Math.PI / 2 + GAP / 2;
  let cursor = 0;
  (function angles(n) {
    if (!n.children.length) { n.angle = start + ((cursor++ + 0.5) / leaves.length) * span; return; }
    n.children.forEach(angles);
    n.angle = n.children.reduce((s, c) => s + c.angle, 0) / n.children.length;
  })(root);

  root.tt = START_MYA;
  for (const n of all) {
    if (n.parent) n.tt = Math.min(n.src.appeared, n.parent.tt - 12);        // a child is never older than its mother
    n.leaf = !n.children.length;
    n.extinct = !!n.src.extinct;
    let d = n; while (d.parent && d.parent.parent) d = d.parent;
    n.dom = d.id;
    n.col = vivid(parseColor(n.src.color), light);
    n.arcLo = n.children.length ? Math.min(...n.children.map((c) => c.angle)) : n.angle;
    n.arcHi = n.children.length ? Math.max(...n.children.map((c) => c.angle)) : n.angle;
  }
  root.all = all;
  root.leaves = leaves.sort((a, b) => a.angle - b.angle);
  return root;
}

const radiusOf = (Rt, tt) => Rt * (1 - Math.pow(Math.max(0, Math.min(START_MYA, tt)) / START_MYA, 0.45));

/** The pace of "now": the microbes slowly, then the last 800 million years at once. */
function front(t) {
  return easeInOut3(map01(t, 0.42, 2.25)) * 0.8 + easeOut3(map01(t, 2.25, 3.45)) * 0.2;
}

/**
 * Build the scene for a viewport.
 *   opts.tree     the site's TREE
 *   opts.W, opts.H   CSS pixels
 *   opts.light    the light theme
 *   opts.gold     the theme's accent, for the first point
 * Returns { geom, labels, state(t), under(ctx, dpr), draw(ctx, dpr, t, full) }.
 */
export function buildScene({ tree, W, H, light, gold }) {
  const g = geometry(W, H);
  const { cx, cy, Rc, Rt, k } = g;
  const BRASS = light ? [104, 72, 34] : [214, 176, 102];
  const GOLD = parseColor(gold);
  const line = (a) => rgba(BRASS, a);
  const tint = (dom, col, a) => rgba(mix(BRASS, col, 0.22), a);

  const root = layoutTree(tree, light, 6, 8);
  for (const n of root.all) {
    n.rn = n.parent === null ? 0 : radiusOf(Rt, n.tt);                       // where this branching sits
    n.r = n.leaf && !n.extinct ? Rt : n.rn;                                  // extant tips run to the present
    n.rp = n.parent ? n.parent.rn : 0;
    n.euk = n.dom === 'eukaryota';
    n.lw = Math.max(0.45, 1.9 - n.depth * 0.27) * (g.small ? 1 : 1.15);
    n.alpha = (n.euk ? 0.92 : 0.55) - Math.min(0.35, n.depth * 0.04);
    n.stroke = n.parent ? tint(n.dom, n.col, n.alpha) : line(0.9);
    n.arcAlpha = (n.euk ? 0.9 : 0.6) - Math.min(0.35, n.depth * 0.04);
    n.ring = Math.max(1.0, (3.0 - n.depth * 0.42) * k * 1.2);
  }
  const edges = root.all.filter((n) => n.parent);
  const hubs = root.all.filter((n) => !n.leaf);
  const tips = root.leaves;
  const aMin = tips[0].angle, aMax = tips[tips.length - 1].angle;

  // edges that share a look are stroked together: one path per style, not one per branch
  const styles = new Map();
  for (const n of edges) {
    const key = n.stroke + '|' + n.lw.toFixed(2);
    if (!styles.has(key)) styles.set(key, { stroke: n.stroke, lw: n.lw, edges: [] });
    styles.get(key).edges.push(n);
  }
  const arcStyles = new Map();
  for (const n of hubs) {
    if (n.children.length < 2) continue;
    const key = n.dom + '|' + n.depth;
    if (!arcStyles.has(key)) arcStyles.set(key, { stroke: tint(n.dom, n.col, n.arcAlpha), lw: Math.max(0.45, 1.9 - n.depth * 0.27), hubs: [] });
    arcStyles.get(key).hubs.push(n);
  }

  // a tip is a small lit gem: one sprite per colour, stamped
  const gemSprites = new Map();
  const gemSprite = (col) => {
    const key = col.map((v) => v | 0).join(',');
    if (!gemSprites.has(key)) {
      const s = 24, c = document.createElement('canvas');
      c.width = c.height = s;
      const x = c.getContext('2d');
      const gr = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      gr.addColorStop(0, rgba(col, 0.95)); gr.addColorStop(0.22, rgba(col, 0.95)); gr.addColorStop(0.32, rgba(col, 0.32)); gr.addColorStop(1, rgba(col, 0));
      x.fillStyle = gr; x.fillRect(0, 0, s, s);
      gemSprites.set(key, c);
    }
    return gemSprites.get(key);
  };
  for (const n of tips) n.sprite = gemSprite(n.col);

  const glow = (() => {
    const s = 64, c = document.createElement('canvas'); c.width = c.height = s;
    const x = c.getContext('2d'), gr = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gr.addColorStop(0, rgba(GOLD, light ? 0.3 : 0.55)); gr.addColorStop(1, rgba(GOLD, 0));
    x.fillStyle = gr; x.fillRect(0, 0, s, s);
    return c;
  })();

  const at = (r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];

  return {
    geom: g,
    /** The labelled rings, for the words layer: radius in px from the centre. */
    labels: LABEL_GA.map((ga) => ({ ga, r: radiusOf(Rt, ga * 1000) })),

    /** What the page has to say at time t. */
    state(t) {
      const p = front(t);
      const mya = Math.round((START_MYA * (1 - p)) / 10) * 10;
      return { p, rf: Rt * p, mya, counter: smooth(0.2, 0.6, t) * (1 - smooth(3.3, 3.8, t)) };
    },

    /** Everything that does not move: grain, dial, ticks, graticule. Painted once per size. */
    under(ctx, dpr) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // grain, so the plate reads as metal or paper rather than a fill
      const rnd = mulberry32(5), tile = 128;
      const gc = document.createElement('canvas'); gc.width = gc.height = tile;
      const gx = gc.getContext('2d'), img = gx.createImageData(tile, tile);
      for (let i = 0; i < img.data.length; i += 4) { const v = (rnd() - 0.5) * (light ? 20 : 26); img.data[i] = img.data[i + 1] = img.data[i + 2] = v > 0 ? 255 : 0; img.data[i + 3] = Math.abs(v) * 0.9; }
      gx.putImageData(img, 0, 0);
      ctx.globalAlpha = light ? 0.5 : 0.55;
      for (let y = 0; y < H; y += tile) for (let x = 0; x < W; x += tile) ctx.drawImage(gc, x, y);
      ctx.globalAlpha = 1;

      ctx.lineCap = 'butt';
      // the dial: two rules and the scale between them
      for (const [rr, w, al] of [[Rc, 1.0, 0.9], [Rc - 10 * k, 0.6, 0.6], [Rt + 4 * k, 0.5, 0.35]]) {
        ctx.strokeStyle = line(al); ctx.lineWidth = w;
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.stroke();
      }
      const nT = 76;
      for (let i = 0; i < nT; i++) {
        const a = -Math.PI / 2 + (i / nT) * TAU;
        const long = i % 10 === 0 ? 10 : i % 5 === 0 ? 7 : 4;
        const [x1, y1] = at(Rc - 10 * k, a), [x2, y2] = at(Rc - (10 - long) * k, a);
        ctx.strokeStyle = line(i % 10 === 0 ? 0.85 : 0.5); ctx.lineWidth = i % 10 === 0 ? 0.9 : 0.6;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      // the graticule: a ring every half billion years, a spoke every fifteen degrees
      for (const ga of RING_GA) {
        ctx.strokeStyle = line(ga % 1 === 0 ? 0.32 : 0.2); ctx.lineWidth = 0.55;
        ctx.beginPath(); ctx.arc(cx, cy, radiusOf(Rt, ga * 1000), 0, TAU); ctx.stroke();
      }
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU;
        const [x1, y1] = at(Rt * 0.06, a), [x2, y2] = at(Rt + 4 * k, a);
        ctx.strokeStyle = line(i % 6 === 0 ? 0.22 : 0.09); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
    },

    /** The frame at time t, drawn into the dial's own box: the ring of now, the
        tree engraved behind it, the tips, the first point. `full` is 1 for the
        whole show and 0 for a slow device, which leaves out the glows. */
    draw(ctx, dpr, t, full = 1) {
      ctx.setTransform(dpr, 0, 0, dpr, -g.boxL * dpr, -g.boxT * dpr);
      ctx.clearRect(g.boxL, g.boxT, g.box, g.box);
      const p = front(t), rf = Rt * p;

      // the branches: a run out from the mother's radius to this node, or to the ring of now
      ctx.lineCap = 'round';
      for (const s of styles.values()) {
        ctx.beginPath();
        let any = false;
        for (const n of s.edges) {
          const r0 = n.rp, r1 = Math.min(n.r, rf);
          if (r1 <= r0 + 0.2) continue;
          const c = Math.cos(n.angle), sn = Math.sin(n.angle);
          ctx.moveTo(cx + c * r0, cy + sn * r0); ctx.lineTo(cx + c * r1, cy + sn * r1); any = true;
        }
        if (any) { ctx.strokeStyle = s.stroke; ctx.lineWidth = s.lw; ctx.stroke(); }
      }
      // the arcs that tie siblings together along their mother's ring
      for (const s of arcStyles.values()) {
        ctx.beginPath();
        let any = false;
        for (const n of s.hubs) {
          if (rf < n.rn) continue;
          const grow = smooth(0, 0.05 * Rt, rf - n.rn);
          ctx.moveTo(cx + Math.cos(lerp(n.angle, n.arcLo, grow)) * n.rn, cy + Math.sin(lerp(n.angle, n.arcLo, grow)) * n.rn);
          ctx.arc(cx, cy, n.rn, lerp(n.angle, n.arcLo, grow), lerp(n.angle, n.arcHi, grow)); any = true;
        }
        if (any) { ctx.strokeStyle = s.stroke; ctx.lineWidth = s.lw; ctx.stroke(); }
      }
      // the branchings: hollow rings, one path per size
      ctx.fillStyle = light ? '#faf7f2' : '#070c11'; ctx.strokeStyle = line(0.95); ctx.lineWidth = 0.8;
      const bySize = new Map();
      for (const n of hubs) {
        if (n.parent === null || rf < n.rn) continue;
        const gz = easeOutBack(map01(rf, n.rn, n.rn + 0.04 * Rt));
        const sz = n.ring * gz;
        const key = n.depth;
        if (!bySize.has(key)) bySize.set(key, []);
        const [x, y] = at(n.rn, n.angle);
        bySize.get(key).push([x, y, sz]);
      }
      for (const list of bySize.values()) {
        ctx.beginPath();
        for (const [x, y, sz] of list) { ctx.moveTo(x + sz, y); ctx.arc(x, y, sz, 0, TAU); }
        ctx.fill(); ctx.stroke();
      }

      // the tips: the extant ones ignite around the rim once the ring has arrived, the rest as it passes
      const ignite = map01(t, 3.15, 4.0);
      if (rf > 0) {
        ctx.globalCompositeOperation = light || !full ? 'source-over' : 'lighter';
        for (const n of tips) {
          const rim = n.r >= Rt - 0.5;
          if (rim ? ignite <= 0 : rf < n.r) continue;
          const along = (n.angle - aMin) / (aMax - aMin);
          const gz = rim ? easeOutBack(map01(ignite, along * 0.7, along * 0.7 + 0.3)) : easeOutBack(map01(rf, n.r, n.r + 0.03 * Rt));
          if (gz <= 0) continue;
          const r = Math.max(1.0, 1.55 * k) * gz * 3.4;
          const [x, y] = at(rim ? Rt : n.r, n.angle);
          ctx.globalAlpha = Math.min(1, gz);
          ctx.drawImage(n.sprite, x - r, y - r, r * 2, r * 2);
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }

      // the ring of now
      if (p > 0.002 && p < 1) {
        const fade = 1 - smooth(0.96, 1, p);
        ctx.globalCompositeOperation = light || !full ? 'source-over' : 'lighter';
        for (const [w, a] of [[9, 0.05], [4.5, 0.10], [1.6, 0.85]]) {
          ctx.strokeStyle = rgba(light ? [150, 70, 40] : GOLD, a * fade); ctx.lineWidth = w * k;
          ctx.beginPath(); ctx.arc(cx, cy, rf, 0, TAU); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // LUCA: a small engraved sun
      {
        const s = 3.1 * k;
        ctx.strokeStyle = line(1); ctx.lineWidth = 0.9;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * TAU + Math.PI / 8, len1 = s * 1.5, len2 = s * (i % 2 ? 2.7 : 3.5);
          ctx.moveTo(cx + Math.cos(a) * len1, cy + Math.sin(a) * len1); ctx.lineTo(cx + Math.cos(a) * len2, cy + Math.sin(a) * len2);
        }
        ctx.stroke();
        const beat = 1 + Math.sin(t * 2.4) * 0.05;
        ctx.globalCompositeOperation = light || !full ? 'source-over' : 'lighter';
        ctx.drawImage(glow, cx - s * 9 * beat, cy - s * 9 * beat, s * 18 * beat, s * 18 * beat);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = rgba(light ? [150, 70, 40] : [255, 244, 214], 1); ctx.strokeStyle = line(1);
        ctx.beginPath(); ctx.arc(cx, cy, s, 0, TAU); ctx.fill(); ctx.stroke();
      }
    },
  };
}
