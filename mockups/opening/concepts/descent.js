// ══════════════════════════════════════════════════════
// CONCEPT 4 — THE DESCENT
//
// "You are here." A figure stands in the warm top layer of the earth, and the
// camera falls: through the mammals, the vertebrates, the first animals, the
// first cells with nuclei, down the one line of ancestors every person has,
// to the spark at the bottom — and then the whole tree flowers out of it.
// Geological colour, cut-paper figures, a running counter; the only concept
// that is a story rather than a picture, and the only one built for a phone
// held upright.
//
// Beats: 0 you, on the surface · 0.3–2.85 the fall, one stop each for mammals,
// vertebrates, animals, eukaryotes · 2.85 LUCA, a spark in the dark · 3.0 the
// tree blooms outward · 3.6 the title.
// ══════════════════════════════════════════════════════

import { clamp01, map01, smooth, easeOut3, easeInOut3, mulberry32, rgba, lighten, darken, mixRGB, drawText, fitSize, parseColor, vivid, lerp, grainTile } from '../common.js';
import { prune, assignAngles, frame } from '../layout.js';
import { siteTree, drawSilhouette } from '../data.js';
import { TAXON_NAMES } from '../../../js/taxonNames.js';
import { translations } from '../data.js';

const DURATION = 4.5;
const TAU = Math.PI * 2;
const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const STOPS = ['homo-sapiens', 'mammals', 'vertebrates', 'animalia', 'eukaryota', 'luca'];

// the ground, by age: sand, olive, teal, indigo, plum, aubergine, black
const STRATA = [
  [0, [236, 196, 138]], [66, [214, 178, 104]], [252, [138, 168, 100]], [541, [58, 152, 168]],
  [1000, [72, 86, 178]], [2000, [112, 62, 150]], [2800, [70, 30, 82]], [3800, [14, 6, 16]],
];

export default {
  id: 'descent',
  name: 'The Descent',
  line: '“You are here.” Fall through your own ancestors to the first cell — then the tree flowers.',
  duration: DURATION,

  silhouettes() { return STOPS.filter((s) => s !== 'luca'); },

  build(env) {
    const { W, H, pal, txt, rtl, sil, lang } = env;
    const light = pal.isLight;
    const F = frame(W, H);
    const k = F.R / 180;
    const small = W < 600;
    const T = translations[lang] || translations.en;
    const tree = siteTree();
    const byId = new Map(); (function w(n) { byId.set(n.id, n); (n.children || []).forEach(w); })(tree);
    const GOLD = parseColor(pal.gold);

    const stops = STOPS.map((id, i) => {
      const n = byId.get(id);
      const ma = id === 'homo-sapiens' ? 0.3 : n.appeared;
      const table = TAXON_NAMES[lang];
      const name = i === 0 ? (T.ex_you_are_here || 'You are here').replace(/[:：]\s*$/, '') : id === 'luca' ? 'LUCA' : (table && table[id]) || n.name;
      return { id, ma, name };
    });
    const sq = (x) => Math.sqrt(x);
    /** age at fractional stop index s: interpolated in square-root space, so every step feels alike */
    const maAt = (s) => {
      s = Math.max(0, Math.min(stops.length - 1, s));
      const i = Math.min(stops.length - 2, Math.floor(s)), f = s - i;
      const v = lerp(sq(stops[i].ma), sq(stops[i + 1].ma), f);
      return v * v;
    };
    const strata = (ma) => {
      for (let i = 1; i < STRATA.length; i++) if (ma <= STRATA[i][0]) { const [a, ca] = STRATA[i - 1], [b, cb] = STRATA[i]; return mixRGB(ca, cb, (sq(ma) - sq(a)) / (sq(b) - sq(a) || 1)); }
      return STRATA[STRATA.length - 1][1];
    };

    const stepPx = H * 0.72;
    const grain = grainTile(160, 9, 12);
    const rnd = mulberry32(21);
    const dust = Array.from({ length: 36 }, () => ({ x: rnd(), y: rnd() * 6, s: 0.6 + rnd() * 1.8, ph: rnd() * TAU, sp: 0.2 + rnd() }));
    const seams = Array.from({ length: 34 }, (_, i) => ({ at: 0.15 + i * 0.15 + rnd() * 0.08, a: 3 + rnd() * 5, f: 0.012 + rnd() * 0.02, ph: rnd() * TAU, w: 0.6 + rnd() * 1.2 }));

    // the bloom: the real tree's first generations, drawn as light
    const root = assignAngles(prune(tree, { depth: 3, maxKids: 5 }), 1.6);
    const unit = F.R / 3;
    for (const n of root.all) {
      n.x = F.cx + Math.cos(n.angle) * n.depth * unit; n.y = F.cy + Math.sin(n.angle) * n.depth * unit;
      n.t0 = 3.0 + n.depth * 0.26;
      n.col = vivid(n.rgb, light);
      n.bow = n.parent ? ((n.parent.children.indexOf(n) % 2) ? 1 : -1) * 0.13 * unit : 0;
    }
    const tmp = { x: 0, y: 0 };
    const at = (n, u) => {
      const p = n.parent, mx = (p.x + n.x) / 2, my = (p.y + n.y) / 2, dx = n.x - p.x, dy = n.y - p.y, len = Math.hypot(dx, dy) || 1;
      const cx = mx + (-dy / len) * n.bow, cy = my + (dx / len) * n.bow, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
      tmp.x = a * p.x + b * cx + c * n.x; tmp.y = a * p.y + b * cy + c * n.y; return tmp;
    };

    const cream = light ? [255, 250, 236] : [255, 246, 224];
    const overlay = document.createElement('canvas');
    overlay.width = Math.round(W * env.dpr); overlay.height = Math.round(H * env.dpr);
    {
      const g = overlay.getContext('2d');
      g.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
      const vg = g.createRadialGradient(W / 2, F.cy, Math.min(W, H) * 0.25, W / 2, F.cy, Math.max(W, H) * 0.8);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.46)');
      g.fillStyle = vg; g.fillRect(0, 0, W, H);
      g.globalAlpha = 0.16;                                      // grain as plain speckle, no blend mode
      for (let y = 0; y < H; y += 160) for (let x = 0; x < W; x += 160) g.drawImage(grain, x, y);
    }
    const glowS = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(0.25, 'rgba(255,200,110,0.55)'); gr.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; })();

    return {
      draw(ctx, t) {
        ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;

        // where the camera is, in stops: it lingers at each one and falls between them
        const u = map01(t, 0.32, 2.85) * (stops.length - 1);
        const s = Math.min(stops.length - 1, Math.floor(u) + easeInOut3(u - Math.floor(u)));
        const cy0 = F.cy;
        const arrive = smooth(2.6, 3.05, t);                     // the spark, then the light
        const flood = smooth(3.02, 3.55, t);                     // the ground gives way to the page

        // ── the ground: strata by age, one gradient sampled down the screen ──
        {
          const g = ctx.createLinearGradient(0, 0, 0, H);
          const N = 14;
          for (let i = 0; i <= N; i++) {
            const y = (i / N) * H, c = strata(maAt(s + (y - cy0) / stepPx));
            g.addColorStop(i / N, `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`);
          }
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        }
        // the page underneath the light: the theme's own ground
        if (flood > 0) { ctx.globalAlpha = flood; ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
        // seams between the layers, drifting up as we fall
        ctx.globalAlpha = 1 - flood;
        for (const sm of seams) {
          const y = cy0 + (sm.at * (stops.length - 1) - s) * stepPx;
          if (y < -20 || y > H + 20) continue;
          ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = sm.w;
          ctx.beginPath();
          for (let x = 0; x <= W; x += 12) { const yy = y + Math.sin(x * sm.f + sm.ph) * sm.a; if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
          ctx.stroke();
        }
        // grain and a vignette, one layer, painted once
        ctx.globalAlpha = 1 - flood; ctx.drawImage(overlay, 0, 0, W, H); ctx.globalAlpha = 1;
        // motes streaming up past the camera
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (const d of dust) {
          const y = (((d.y * H - s * stepPx * 1.5) % (H * 1.1)) + H * 1.1) % (H * 1.1) - H * 0.05;
          ctx.globalAlpha = (0.10 + 0.25 * Math.abs(Math.sin(t * d.sp + d.ph))) * (1 - flood);
          ctx.beginPath(); ctx.arc(d.x * W + Math.sin(t * d.sp + d.ph) * 10, y, d.s * k, 0, TAU); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // ── the figures, one at each stop ──
        const size = Math.min(W * 0.62, H * 0.30);
        stops.forEach((st, i) => {
          if (st.id === 'luca') return;
          const focus = 1 - clamp01(Math.abs(i - s) * 1.05);
          if (focus <= 0.01) return;
          const y = cy0 + (i - s) * stepPx;
          const sl = sil.get(st.id);
          const scale = 0.82 + 0.18 * easeOut3(focus);
          ctx.save();
          ctx.globalAlpha = Math.pow(focus, 0.8) * (1 - arrive);
          drawSilhouette(ctx, sl, W / 2 + 3 * k, y + 8 * k, size * scale, { fill: 'rgba(20,8,30,0.28)' });
          drawSilhouette(ctx, sl, W / 2, y, size * scale, { fill: rgba(cream, 1) });
          ctx.restore();
          // the name, and how long ago
          const ty = y + size * scale * 0.5 + 30 * k;
          const nsz = fitSize(ctx, st.name, small ? 24 : 30, 700, W * 0.86);
          const a = Math.pow(focus, 1.4) * (1 - arrive);
          drawText(ctx, st.name, W / 2, ty, { size: nsz, weight: 700, color: rgba(cream, 1), alpha: a, spacing: 0.4, rtl });
          const ma = st.ma;
          const label = i === 0 ? txt.present : `${ma < 1 ? ma : Math.round(ma).toLocaleString('en')} Ma`;
          drawText(ctx, label, W / 2, ty + nsz * 0.95, { size: small ? 13 : 15, weight: 500, family: MONO, color: rgba(cream, 1), alpha: a * 0.85, spacing: 2.4, dir: i === 0 ? undefined : 'ltr', rtl });
        });

        // the odometer at the top: the age of the layer we are passing through
        {
          const ma = maAt(s);
          const v = ma < 1 ? ma.toFixed(1) : Math.round(ma / (ma > 100 ? 10 : 1)) * (ma > 100 ? 10 : 1);
          const label = `${typeof v === 'number' ? v.toLocaleString('en') : v}`;
          const a = smooth(0.0, 0.3, t) * (1 - arrive);
          drawText(ctx, label, W / 2, Math.max(H * 0.09, 56), { size: small ? 46 : 60, weight: 700, family: MONO, color: rgba(cream, 1), alpha: a * 0.9, dir: 'ltr', spacing: -1 });
          drawText(ctx, 'Ma', W / 2, Math.max(H * 0.09, 56) + (small ? 34 : 42), { size: small ? 13 : 15, weight: 500, family: MONO, color: rgba(cream, 1), alpha: a * 0.7, spacing: 4, dir: 'ltr' });
        }

        // ── LUCA: a spark in the dark, the flash, and the tree flowering out of it ──
        if (arrive > 0) {
          const beat = 1 + Math.sin(t * 7) * 0.04;
          const grow = easeOut3(map01(t, 2.7, 3.05));
          ctx.globalCompositeOperation = light && flood > 0.5 ? 'source-over' : 'lighter';
          const gr = (26 + grow * 30) * k * beat;
          ctx.globalAlpha = arrive * (1 - flood * (light ? 0.6 : 0.25)) * (1 - 0.72 * smooth(3.4, 4.2, t));
          ctx.drawImage(glowS, F.cx - gr * 2.6, cy0 - gr * 2.6, gr * 5.2, gr * 5.2);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = arrive;
          ctx.fillStyle = light && flood > 0.5 ? rgba(darken(GOLD, 0.2), 1) : 'rgb(255,248,226)';
          ctx.beginPath(); ctx.arc(F.cx, cy0, 5.5 * k * beat, 0, TAU); ctx.fill();
          // the ring that carries the light out
          const ring = map01(t, 3.0, 3.75);
          if (ring > 0 && ring < 1) {
            ctx.strokeStyle = rgba(light ? darken(GOLD, 0.2) : [255, 232, 170], 1); ctx.globalAlpha = (1 - ring) * 0.6; ctx.lineWidth = 2 * k;
            ctx.beginPath(); ctx.arc(F.cx, cy0, easeOut3(ring) * Math.max(W, H) * 0.7, 0, TAU); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
        if (t > 2.98) {
          ctx.lineCap = 'round';
          for (const n of root.all) {
            if (!n.parent) continue;
            const g = easeOut3(map01(t, n.t0, n.t0 + 0.55));
            if (g <= 0) continue;
            ctx.beginPath();
            for (let i = 0; i <= 14; i++) { at(n, (i / 14) * g); if (i === 0) ctx.moveTo(tmp.x, tmp.y); else ctx.lineTo(tmp.x, tmp.y); }
            ctx.strokeStyle = rgba(n.col, 1);
            ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
            ctx.globalAlpha = 0.14; ctx.lineWidth = (5 - n.depth) * 2.2 * k; ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = light ? 0.9 : 0.85; ctx.lineWidth = Math.max(0.9, (4 - n.depth) * 0.9 * k); ctx.stroke();
          }
          for (const n of root.all) {
            if (!n.parent) continue;
            const g = clamp01((t - n.t0 - 0.35) / 0.3);
            if (g <= 0) continue;
            ctx.globalAlpha = g;
            ctx.fillStyle = rgba(n.col, 1);
            ctx.beginPath(); ctx.arc(n.x, n.y, Math.max(1.6, (4 - n.depth) * 1.7 * k) * (g < 1 ? 1 + Math.sin(g * Math.PI) * 0.3 : 1), 0, TAU); ctx.fill();
          }
          ctx.globalAlpha = 1;
        }

        // ── the title, in the wedge below the tree ──
        const gapW = 2 * (F.R * 0.8) * Math.sin(1.6 / 2);
        const tin = smooth(3.6, 4.2, t);
        if (tin > 0.01) {
          const lift = (1 - easeOut3(tin)) * 16;
          const size = fitSize(ctx, txt.title, small ? 34 : 56, 700, gapW * 0.92);
          drawText(ctx, txt.title, F.cx, F.anchor + lift, { size, weight: 700, color: pal.ink, alpha: tin, spacing: small ? 0 : 1, rtl });
          const sub = fitSize(ctx, txt.subtitle, small ? 12.5 : 16, 400, gapW * 0.98, undefined, 1);
          drawText(ctx, txt.subtitle, F.cx, F.anchor + size * 0.9 + lift * 0.6, { size: sub, weight: 400, color: pal.muted, alpha: tin * 0.95, spacing: 1, rtl });
        }
        const cin = smooth(4.05, 4.45, t);
        if (cin > 0.01) {
          const beat = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(t * 2.4));
          drawText(ctx, txt.click, F.cx, F.anchor + F.R * (small ? 0.30 : 0.28), { size: small ? 11 : 13, weight: 500, color: pal.muted, alpha: cin * beat, spacing: 2, rtl });
        }
        ctx.globalAlpha = 1;
      },
    };
  },
};
