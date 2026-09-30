// ══════════════════════════════════════════════════════
// CONCEPT 3 — THE STICKER ALBUM
//
// Life as a collector's album: every group on the tree is a die-cut sticker —
// the site's own PhyloPic silhouettes, flat colour, a cream border, a little
// shadow — slapped onto a page of paper and joined by strips of coloured
// paper. Stop-motion timing, chunky lettering. Friendly instead of clinical;
// it is also the album that "Your Tree" will become once the game collects
// creatures onto it.
//
// Beats: 0 the first sticker, a paper sun · 0.5 the three domains slap down ·
// 1.2 and 1.9 the next generations · 2.9 the title is stuck across the bottom.
// ══════════════════════════════════════════════════════

import { clamp01, map01, smooth, easeOut3, easeOutBack, mulberry32, rgba, lighten, darken, drawText, fitSize, parseColor, vivid, lerp, grainTile } from '../common.js';
import { spanTree, assignAngles } from '../layout.js';
import { siteTree, silhouetteIds, drawSilhouette } from '../data.js';

const GAP = 0.34;
const DURATION = 4.5;
/* Thirty creatures anyone knows, spread across the tree. The picture is the
   real topology between them — see spanTree(). */
const ICONS = [
  'spirulina', 'ecoli', 'halobacterium', 'amoeba-proteus', 'amanita-muscaria',
  'sphagnum', 'tree-fern', 'sequoia', 'sunflower',
  'glass-sponge', 'box-jellyfish', 'octopus', 'honey-bee', 'monarch-butterfly', 'golden-orb-spider', 'common-starfish',
  'shark', 'clownfish', 'coelacanth', 'axolotl', 'green-sea-turtle', 'king-cobra',
  'emperor-penguin', 'bald-eagle', 'hummingbird',
  'platypus', 'red-kangaroo', 'african-elephant', 'blue-whale', 'tiger', 'gray-wolf', 'chimpanzee', 'homo-sapiens',
];
const ORDER = ['bacteria', 'archaea', 'eukaryota'];
const TAU = Math.PI * 2;
const FPS = 12;                                   // the handmade beat
const ROUND = "Rubik, Inter, Heebo, sans-serif";

export default {
  id: 'stickers',
  name: 'Sticker Album',
  line: 'Every group a die-cut sticker, slapped onto the page. Friendly, tactile — the album Your Tree becomes.',
  duration: DURATION,

  silhouettes() {
    const have = silhouetteIds();
    const root = spanTree(siteTree(), ICONS);
    return root.all.map((n) => n.id).filter((id) => have.has(id));
  },

  build(env) {
    const { W, H, pal, txt, rtl, sil } = env;
    const light = pal.isLight;
    const small = W < 600;
    const titleH = small ? 112 : 130;
    const R = Math.min(W * 0.415, (H - titleH - 90) / 2, 330);
    const cy0 = Math.max(R + 40, (H - (2 * R + titleH)) / 2 + R + 12);
    const F = { cx: W / 2, cy: cy0, R, anchor: cy0 + R + (small ? 52 : 60) };
    const root = spanTree(siteTree(), ICONS);
    root.children.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
    assignAngles(root, GAP);
    const k = F.R / 165;
    const CREAM = light ? '#fffdf6' : '#f8f1df';
    const PAPER = light ? pal.bg : '#12233a';
    const INK = parseColor(pal.ink);
    const SHADOW = light ? 'rgba(70,52,28,0.30)' : 'rgba(0,0,0,0.45)';
    const dpr = env.dpr;

    const leavesSorted = root.all.filter((n) => !n.children.length).sort((a, b) => a.angle - b.angle);
    const below = (n) => (n.children.length ? n.children.reduce((a, c) => a + below(c), 0) : 1);
    for (const n of root.all) {
      const leaf = !n.children.length;
      n.leaves = below(n);
      // a cladogram: every species on the outer ring (alternating in and out so the stickers do not stack),
      // each branching at its depth, clear of the first sticker at the centre
      const zig = leaf && leavesSorted.indexOf(n) % 2 ? 0.93 : 1;
      const r = leaf ? F.R * zig : n.depth === 0 ? 0 : F.R * (0.27 + 0.50 * ((n.depth - 1) / Math.max(1, root.maxDepth - 2)));
      n.r = r;
      n.x = F.cx + Math.cos(n.angle) * r;
      n.y = F.cy + Math.sin(n.angle) * r;
      n.leaf = leaf;
      n.size = (n.depth === 0 ? 46 : leaf ? 35 : Math.max(24, 36 - n.depth * 2.6)) * k;
      const idx = n.parent ? n.parent.children.indexOf(n) : 0;
      n.t0 = n.depth === 0 ? 0 : leaf ? 1.45 + leavesSorted.indexOf(n) * 0.043 : 0.42 + n.depth * 0.24;
      n.dist = n.parent ? Math.hypot(n.x - n.parent.x, n.y - n.parent.y) : 0;
      n.bow = n.parent ? ((idx % 2) ? 1 : -1) * 0.07 * n.dist : 0;
      const rnd = mulberry32(n.id.length * 613 + n.depth * 17 + idx);
      n.tilt = (rnd() - 0.5) * 0.30;
      n.col = vivid(n.rgb, light);
      n.col2 = light ? darken(n.col, 0.18) : lighten(n.col, 0.0);
    }
    root.col = [246, 180, 60];
    root.leaves = below(root);

    for (const n of root.all) n.dist = n.parent ? Math.hypot(n.x - n.parent.x, n.y - n.parent.y) : 0;

    // ── a sticker, made once: shadow, border, colour ─────────
    function makeSticker(draw, size, col) {
      const pad = Math.ceil(size * 0.30);
      const box = Math.ceil(size + pad * 2);
      const c = document.createElement('canvas');
      c.width = Math.round(box * dpr); c.height = Math.round(box * dpr);
      const g = c.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = box / 2, cy = box / 2;
      const border = Math.max(2.2, size * 0.085);
      // shadow, then border, then colour
      g.save(); g.shadowColor = SHADOW; g.shadowBlur = size * 0.10; g.shadowOffsetY = size * 0.05;
      draw(g, cx, cy, size, { stroke: CREAM, strokeWidth: border * 2, fill: CREAM }); g.restore();
      draw(g, cx, cy, size, { stroke: CREAM, strokeWidth: border * 2, fill: CREAM });
      draw(g, cx, cy, size, { fill: rgba(col, 1) });
      return { c, box };
    }
    const sunDraw = (g, x, y, s, o) => {
      g.save(); g.translate(x, y); g.beginPath();
      const rays = 12;
      for (let i = 0; i < rays * 2; i++) { const a = (i / (rays * 2)) * TAU, r = (i % 2 ? 0.30 : 0.50) * s; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      g.closePath();
      g.lineJoin = 'round';
      if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.strokeWidth; g.stroke(); }
      if (o.fill) { g.fillStyle = o.fill; g.fill(); }
      g.restore();
    };
    const dotDraw = (g, x, y, s, o) => {
      g.save(); g.translate(x, y); g.beginPath(); g.arc(0, 0, s * 0.36, 0, TAU);
      if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.strokeWidth; g.stroke(); }
      if (o.fill) { g.fillStyle = o.fill; g.fill(); }
      g.restore();
    };
    for (const n of root.all) {
      const s = sil.get(n.id);
      const draw = n.depth === 0 ? sunDraw : s ? (g, x, y, size, o) => drawSilhouette(g, s, x, y, size, { fill: o.fill, stroke: o.stroke, strokeWidth: o.strokeWidth }) : dotDraw;
      n.sticker = makeSticker(draw, n.size, n.col);
      n.hasSil = !!s;
    }

    // ── the page ─────────────────────────────────────────
    const grain = grainTile(160, 3, light ? 10 : 8);
    const page = document.createElement('canvas');
    page.width = Math.round(W * dpr); page.height = Math.round(H * dpr);
    {
      const g = page.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
      const gr = g.createRadialGradient(F.cx, F.cy, F.R * 0.2, F.cx, F.cy, Math.max(W, H) * 0.75);
      gr.addColorStop(0, light ? 'rgba(255,255,255,0.5)' : 'rgba(60,90,130,0.30)'); gr.addColorStop(1, light ? 'rgba(150,120,80,0.16)' : 'rgba(0,0,0,0.42)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // a faint dotted grid, like the pages of a sketchbook
      g.fillStyle = light ? 'rgba(90,70,40,0.14)' : 'rgba(255,255,255,0.07)';
      const step = 22 * Math.max(1, k);
      for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) { g.beginPath(); g.arc(x, y, 0.9, 0, TAU); g.fill(); }
      g.globalAlpha = light ? 0.5 : 1; g.globalCompositeOperation = light ? 'soft-light' : 'overlay';
      for (let y = 0; y < H; y += 160) for (let x = 0; x < W; x += 160) g.drawImage(grain, x, y);
    }
    // tape at the top corners
    const tapes = [{ x: W * 0.10, y: H * 0.05, a: -0.5, c: [255, 196, 88] }, { x: W * 0.90, y: H * 0.05, a: 0.5, c: [110, 200, 190] }];

    const tmp = { x: 0, y: 0 };
    const at = (n, u) => {
      const p = n.parent;
      const mx = (p.x + n.x) / 2, my = (p.y + n.y) / 2;
      const dx = n.x - p.x, dy = n.y - p.y, len = Math.hypot(dx, dy) || 1;
      const cx = mx + (-dy / len) * n.bow, cy = my + (dx / len) * n.bow;
      const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
      tmp.x = a * p.x + b * cx + c * n.x; tmp.y = a * p.y + b * cy + c * n.y;
      return tmp;
    };
    const q = (t) => Math.floor(t * FPS) / FPS;      // stop-motion: time moves in twelfths

    return {
      draw(ctx, t) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.drawImage(page, 0, 0, W, H);
        const tq = q(t);

        for (const tp of tapes) {
          ctx.save(); ctx.translate(tp.x, tp.y); ctx.rotate(tp.a);
          ctx.globalAlpha = 0.85; ctx.fillStyle = rgba(tp.c, 0.78);
          ctx.fillRect(-34 * k, -9 * k, 68 * k, 18 * k);
          ctx.globalAlpha = 0.25; ctx.fillStyle = '#fff';
          for (let i = -30; i < 30; i += 8) ctx.fillRect(i * k, -9 * k, 3 * k, 18 * k);
          ctx.restore();
        }
        ctx.globalAlpha = 1;

        // ── paper strips: along the mother's ring, then out along the daughter's own spoke ──
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (const n of root.all) {
          if (!n.parent) continue;
          const u = easeOut3(map01(tq, n.t0 - 0.05, n.t0 + 0.42));
          if (u <= 0) continue;
          const lw = (2.5 + 6.2 * Math.sqrt(n.leaves / root.leaves)) * k;               // a trunk is as thick as what it carries
          const rp = n.parent.r, a0 = n.parent.angle, a1 = n.angle;
          const arcL = Math.abs(a1 - a0) * rp, radL = n.r - rp, total = arcL + radL;
          const drawn = u * total;
          const trace = () => {
            ctx.beginPath();
            if (rp < 1) { ctx.moveTo(F.cx, F.cy); const rr = Math.min(radL, drawn); ctx.lineTo(F.cx + Math.cos(a1) * rr, F.cy + Math.sin(a1) * rr); return; }
            const arcDrawn = Math.min(arcL, drawn);
            const aEnd = a0 + Math.sign(a1 - a0) * (arcDrawn / rp);
            ctx.arc(F.cx, F.cy, rp, a0, aEnd, a1 < a0);
            if (drawn > arcL) { const rr = rp + (drawn - arcL); ctx.lineTo(F.cx + Math.cos(a1) * rr, F.cy + Math.sin(a1) * rr); }
          };
          ctx.save(); ctx.translate(0, lw * 0.28); ctx.strokeStyle = SHADOW; ctx.lineWidth = lw; trace(); ctx.stroke(); ctx.restore();
          ctx.strokeStyle = rgba(n.col, 1); ctx.lineWidth = lw; trace(); ctx.stroke();
          ctx.strokeStyle = rgba(lighten(n.col, 0.45), 0.55); ctx.lineWidth = Math.max(0.8, lw * 0.22); ctx.save(); ctx.translate(0, -lw * 0.22); trace(); ctx.stroke(); ctx.restore();
        }

        // ── stickers, deepest first so the trunk sits on top ──
        const order = root.all.slice().sort((a, b) => b.depth - a.depth);
        for (const n of order) {
          const a = n.depth === 0 ? 1 : map01(tq, n.t0 + 0.12, n.t0 + 0.62);
          if (a <= 0) continue;
          const pop = n.depth === 0 ? 1 : easeOutBack(a, 2.1);
          const wob = n.depth === 0 ? Math.sin(t * 1.6) * 0.05 : n.tilt * (1 - easeOut3(a)) * 2.4 + n.tilt;
          const sq = n.depth === 0 ? 1 : 1 + (1 - easeOut3(a)) * 0.18;                 // lands flat, a little wide
          const { c, box } = n.sticker;
          const s = Math.max(0.01, pop);
          ctx.save();
          ctx.translate(n.x, n.y); ctx.rotate(wob); ctx.scale(s * sq, s / sq);
          ctx.globalAlpha = Math.min(1, a * 3);
          ctx.drawImage(c, -box / 2, -box / 2, box, box);
          ctx.restore();
        }
        ctx.globalAlpha = 1;

        // ── words ──
        const gapW = Math.min(W * 0.86, 480);
        const cA = smooth(0.0, 0.4, tq) * (1 - smooth(2.7, 3.1, tq));
        if (cA > 0.01) {
          const run = easeOut3(map01(tq, 0.4, 2.9));
          const mya = Math.round((3800 * (1 - run)) / 10) * 10;
          const label = mya > 0 ? `${mya.toLocaleString('en')} Ma` : txt.present;
          drawText(ctx, label, F.cx, F.anchor, { size: small ? 18 : 22, weight: 700, family: ROUND, color: rgba(light ? [120, 84, 30] : [246, 190, 90], 1), alpha: cA, spacing: 1.5, dir: mya > 0 ? 'ltr' : undefined, rtl });
        }
        const tin = map01(tq, 2.9, 3.6);
        if (tin > 0) {
          const pop = easeOutBack(tin, 2.2);
          const size = fitSize(ctx, txt.title, small ? 40 : 66, 800, gapW * 1.0, ROUND);
          const y = F.anchor + size * 0.10;
          ctx.save();
          ctx.translate(F.cx, y); ctx.rotate(-0.035 * (1 - easeOut3(tin)) - 0.02); ctx.scale(pop, pop);
          ctx.font = `800 ${size}px ${ROUND}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.lineJoin = 'round';
          ctx.strokeStyle = SHADOW; ctx.lineWidth = size * 0.30; ctx.globalAlpha = Math.min(1, tin * 3) * 0.6; ctx.save(); ctx.translate(0, size * 0.06); ctx.strokeText(txt.title, 0, 0); ctx.restore();
          ctx.strokeStyle = CREAM; ctx.globalAlpha = Math.min(1, tin * 3); ctx.strokeText(txt.title, 0, 0);
          ctx.fillStyle = light ? '#2c2418' : '#16263c'; ctx.fillText(txt.title, 0, 0);
          ctx.restore();
          const sub = fitSize(ctx, txt.subtitle, small ? 13 : 17, 600, gapW * 1.05, ROUND);
          drawText(ctx, txt.subtitle, F.cx, y + size * 0.84, { size: sub, weight: 600, family: ROUND, color: pal.ink, alpha: smooth(0, 1, tin) * 0.9, spacing: 0.6, rtl });
        }
        const cin = smooth(3.9, 4.35, tq);
        if (cin > 0.01) {
          const beat = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(t * 2.4));
          drawText(ctx, txt.click, F.cx, F.anchor + (small ? 70 : 78), { size: small ? 12 : 14, weight: 600, family: ROUND, color: pal.muted, alpha: cin * beat, spacing: 1.5, rtl });
        }
        ctx.globalAlpha = 1;
      },
    };
  },
};
