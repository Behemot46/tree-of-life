// ══════════════════════════════════════════════════════
// CONCEPT 2 — THE ASTROLABE
//
// An instrument for reading deep time, engraved rather than painted: brass
// hairlines on a dark plate (sepia ink on paper in the light theme). Distance
// from the centre is time — the ring on the outside is the present, the point
// in the middle is LUCA — so the tree is drawn to scale, as a circular
// chronogram: a thin trunk of microbes for two billion years, then the
// explosion at the rim. A ring of "now" sweeps outward and everything it
// passes is engraved behind it. The title sits in a cartouche below.
//
// Beats: 0 the plate and the first point · 0.4 the ring of now leaves the
// centre (3,800 Ma) · 2.2 it reaches the animals · 3.4 it reaches today and the
// rim ignites, clockwise · 3.4 the cartouche is engraved.
// ══════════════════════════════════════════════════════

import { clamp01, map01, smooth, easeOut3, easeInOut3, easeOutBack, mulberry32, rgba, lighten, darken, mixRGB, drawText, fitSize, parseColor, vivid, lerp, grainTile } from '../common.js';
import { prune, assignAngles } from '../layout.js';
import { siteTree } from '../data.js';

const DURATION = 4.5;
const TAU = Math.PI * 2;
const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";

export default {
  id: 'astrolabe',
  name: 'The Astrolabe',
  line: 'An engraved instrument. Distance from the centre is time — the tree drawn to scale.',
  duration: DURATION,

  build(env) {
    const { W, H, pal, txt, rtl } = env;
    const light = pal.isLight;
    const small = W < 600;

    // ── composition: the dial, then the cartouche beneath it ─────────
    const plateH = small ? 84 : 92;
    const Rc = Math.min(W * 0.445, (H - plateH - 96) / 2, 330);
    const block = 2 * Rc + plateH + 30;
    const cy = Math.max(Rc + 14, (H - block) / 2 + Rc);
    const cx = W / 2;
    const Rt = Rc * 0.885;                        // where "today" is
    const k = Rc / 172;

    // ── colour ─────────────────────────────────────────
    const BRASS = light ? [104, 72, 34] : [214, 176, 102];
    const IVORY = parseColor(pal.ink);
    const line = (a) => rgba(BRASS, a);
    const tint = (n, a) => rgba(mixRGB(BRASS, n.col, 0.22), a);           // each lineage keeps a trace of its own colour
    const GOLD = parseColor(pal.gold);

    // ── the real tree, to scale ────────────────────────────
    const mode = env.q.get('mode') || 'time';                // time | tips | gen
    const depth = Number(env.q.get('depth')) || 6, kids = Number(env.q.get('kids')) || 8;
    const pw = Number(env.q.get('pw')) || 0.45;             // exponent of the time scale: the recent past gets the room
    const pruned = prune(siteTree(), { depth, maxKids: kids });
    /* The two microbial domains go to either end of the arc, so their long,
       ancient lines fall as roots on both sides of the gap at the bottom and
       the eukaryotes make the crown between them. */
    const order = ['bacteria', 'eukaryota', 'archaea'];
    pruned.children.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    const root = assignAngles(pruned, 0.5);
    root.tt = 3800;
    let maxDepth = 0;
    for (const n of root.all) {
      let d = n; while (d.parent && d.parent.parent) d = d.parent;
      n.dom = d;
      if (n.parent) n.tt = Math.min(n.appeared, n.parent.tt - 12);       // a child is never older than its mother
      n.leaf = !n.children.length;
      n.col = vivid(n.rgb, light);
      maxDepth = Math.max(maxDepth, n.depth);
    }
    const rad = mode === 'gen' ? null : (tt) => Rt * (1 - Math.pow(Math.max(0, Math.min(3800, tt)) / 3800, pw));
    const nodeR = (n) => (mode === 'gen' ? Rt * (n.depth / maxDepth) : rad(n.tt));
    for (const n of root.all) {
      // extant tips run to the present; extinct ones stop where they stopped
      n.rn = nodeR(n);
      n.r = mode === 'tips' ? n.rn : n.leaf && !n.extinct ? Rt : n.rn;
    }
    for (const n of root.all) {
      n.rp = n.parent ? n.parent.rn : 0;
      n.arcLo = n.children.length ? Math.min(...n.children.map((c) => c.angle)) : n.angle;
      n.arcHi = n.children.length ? Math.max(...n.children.map((c) => c.angle)) : n.angle;
      const rnd = mulberry32(n.id.length * 31 + n.depth);
      n.tw = rnd() * TAU;
    }
    const leaves = root.all.filter((n) => n.leaf);
    const aMin = Math.min(...leaves.map((n) => n.angle)), aMax = Math.max(...leaves.map((n) => n.angle));

    // the pace of "now": microbes slowly, then the last 800 million years all at once
    const front = (t) => {
      const a = easeInOut3(map01(t, 0.42, 2.25)) * 0.80;
      const b = easeOut3(map01(t, 2.25, 3.45)) * 0.20;
      return a + b;
    };

    const grain = grainTile(160, 5, light ? 9 : 12);
    const grainPat = null;
    const ringsGa = [3.0, 2.0, 1.0, 0.5, 0.1];                    // the graticule
    const labelGa = [2.0, 1.0, 0.5, 0.1];                          // the ones with room to be named

    const at = (r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];

    // the plate is painted once
    const plate = document.createElement('canvas');
    plate.width = Math.round(W * env.dpr); plate.height = Math.round(H * env.dpr);
    {
      const g = plate.getContext('2d');
      g.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
      g.fillStyle = pal.bg; g.fillRect(0, 0, W, H);
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, Rc * 1.35);
      if (light) { gr.addColorStop(0, 'rgba(255,252,244,0.9)'); gr.addColorStop(1, 'rgba(210,190,150,0.28)'); }
      else { gr.addColorStop(0, 'rgba(34,52,68,0.62)'); gr.addColorStop(0.6, 'rgba(14,24,34,0.28)'); gr.addColorStop(1, 'rgba(0,0,0,0.0)'); }
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // corner falloff
      const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.4, W / 2, H / 2, Math.max(W, H) * 0.78);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, light ? 'rgba(110,86,50,0.16)' : 'rgba(0,0,0,0.5)');
      g.fillStyle = vg; g.fillRect(0, 0, W, H);
      g.globalAlpha = light ? 0.5 : 1; g.globalCompositeOperation = light ? 'soft-light' : 'overlay';
      for (let y = 0; y < H; y += 160) for (let x = 0; x < W; x += 160) g.drawImage(grain, x, y);
    }

    // ── static engraving: rings, spokes, dial ─────────────────
    function drawGraticule(ctx, t) {
      const draw = smooth(0.0, 1.3, t);
      ctx.lineCap = 'butt';
      // outer dial: two rules with ticks between, drawn round from the top
      const sweep = draw * TAU;
      const a0 = -Math.PI / 2;
      for (const [rr, w, al] of [[Rc, 1.0, 0.9], [Rc - 10 * k, 0.6, 0.6], [Rt + 4 * k, 0.5, 0.35]]) {
        ctx.strokeStyle = line(al); ctx.lineWidth = w;
        ctx.beginPath(); ctx.arc(cx, cy, rr, a0, a0 + sweep); ctx.stroke();
      }
      // ticks on the dial: one per 100 Ma of the angular ring, longer at 500 and 1000 (the dial is a scale in itself)
      const nT = 76;
      for (let i = 0; i < nT; i++) {
        const a = a0 + (i / nT) * TAU;
        if (a - a0 > sweep) break;
        const long = i % 10 === 0 ? 10 : i % 5 === 0 ? 7 : 4;
        const [x1, y1] = at(Rc - 10 * k, a), [x2, y2] = at(Rc - (10 - long) * k, a);
        ctx.strokeStyle = line(i % 10 === 0 ? 0.85 : 0.5); ctx.lineWidth = i % 10 === 0 ? 0.9 : 0.6;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      // graticule: rings every 500 Ma, spokes every 15°
      for (let i = 0; i < (mode === 'gen' ? 0 : ringsGa.length); i++) {
        const gate = smooth(0.15 + i * 0.05, 0.9 + i * 0.05, t);
        const rr = rad(ringsGa[i] * 1000);
        ctx.strokeStyle = line((ringsGa[i] % 1 === 0 ? 0.32 : 0.2) * gate); ctx.lineWidth = 0.55;
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.stroke();
      }
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU;
        const [x1, y1] = at(Rt * 0.06, a), [x2, y2] = at(Rt + 4 * k, a);
        ctx.strokeStyle = line((i % 6 === 0 ? 0.22 : 0.09) * draw); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
    }

    function drawLabels(ctx, t, p) {
      const rf0 = Rt * p;
      // the radial scale runs down the empty gap at the bottom, into the title
      const sz = Math.max(7.5, 8.5 * k);
      const gate = smooth(0.3, 0.9, t);
      if (mode === 'gen') return;
      labelGa.forEach((ga, i) => {
        const rr = rad(ga * 1000);
        const lit = smooth(0, 0.05 * Rt, rf0 - rr + 0.01 * Rt);
        const [x, y] = at(rr, Math.PI / 2);
        const label = i === 0 ? `${ga.toFixed(1)} Ga` : ga.toFixed(1);
        ctx.save();
        ctx.font = `500 ${sz}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const w = ctx.measureText(label).width + 8;
        ctx.globalAlpha = 0.92 * gate; ctx.fillStyle = pal.bg;
        ctx.fillRect(x - w / 2, y - sz * 0.66, w, sz * 1.32);
        ctx.restore();
        drawText(ctx, label, x, y + 0.4, { size: sz, weight: 500, family: MONO, color: line(1), alpha: (0.55 + 0.45 * lit) * gate, dir: 'ltr' });
      });
    }

    return {
      draw(ctx, t) {
        ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.drawImage(plate, 0, 0, W, H);

        const p = front(t);
        const rf = Rt * p;
        const spin = t * 0.04;

        drawGraticule(ctx, t);
        drawLabels(ctx, t, p);

        // ── the tree, engraved as the front passes ──
        ctx.lineCap = 'round';
        // deepest first is unnecessary: everything is hairline
        for (const n of root.all) {
          if (!n.parent) continue;
          // radial run from the mother's radius out to this node (or to the front)
          const r0 = n.rp, r1 = Math.min(n.r, rf);
          if (r1 <= r0 + 0.2) continue;
          const [x0, y0] = at(r0, n.angle), [x1, y1] = at(r1, n.angle);
          const lw = Math.max(0.45, 1.9 - n.depth * 0.27) * (small ? 1 : 1.15);
          ctx.strokeStyle = tint(n.dom, (n.dom.id === 'eukaryota' ? 0.92 : 0.55) - Math.min(0.35, n.depth * 0.04));
          ctx.lineWidth = lw;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        }
        // the arcs that tie siblings together at their mother's radius
        for (const n of root.all) {
          if (n.children.length < 2) continue;
          const rr = n.rn;
          if (rf < rr) continue;
          const grow = smooth(0, 0.05 * Rt, rf - rr);
          const a1 = lerp(n.angle, n.arcLo, grow), a2 = lerp(n.angle, n.arcHi, grow);
          ctx.strokeStyle = tint(n.dom, (n.dom.id === 'eukaryota' ? 0.9 : 0.6) - Math.min(0.35, n.depth * 0.04)); ctx.lineWidth = Math.max(0.45, 1.9 - n.depth * 0.27);
          ctx.beginPath(); ctx.arc(cx, cy, rr, a1, a2); ctx.stroke();
        }
        // nodes: hollow rings for the branchings, gems for the tips
        for (const n of root.all) {
          if (n.leaf) continue;
          const rr = n.rn;
          if (rf < rr) continue;
          const g = easeOutBack(map01(rf, rr, rr + 0.04 * Rt));
          const [x, y] = at(rr, n.angle);
          ctx.fillStyle = pal.bg; ctx.strokeStyle = line(0.95); ctx.lineWidth = 0.8;
          const s = Math.max(1.0, (3.0 - n.depth * 0.42) * k * 1.2) * g;
          ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill(); ctx.stroke();
        }

        // the rim ignites clockwise once the front arrives
        const ignite = map01(t, 3.15, 4.0);
        for (const n of leaves) {
          const [x, y] = at(Math.min(n.r, Math.max(rf, 0)), n.angle);
          if (rf < n.r - 0.5 && n.r >= Rt - 0.5) continue;            // the tip has not arrived
          const along = (n.angle - aMin) / (aMax - aMin);
          const g = n.r >= Rt - 0.5 ? easeOutBack(map01(ignite, along * 0.7, along * 0.7 + 0.3)) : easeOutBack(map01(rf, n.r, n.r + 0.03 * Rt));
          if (g <= 0) continue;
          const s = Math.max(1.0, 1.55 * k) * g;
          ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
          ctx.globalAlpha = 0.28 * Math.min(1, g);
          ctx.fillStyle = rgba(n.col, 1);
          ctx.beginPath(); ctx.arc(x, y, s * 2.6, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          ctx.fillStyle = rgba(n.col, 1);
          ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // ── the ring of now ──
        if (p > 0.002 && p < 1) {
          const fade = 1 - smooth(0.96, 1, p);
          ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
          for (const [w, a] of [[9, 0.05], [4.5, 0.10], [1.6, 0.85]]) {
            ctx.strokeStyle = rgba(light ? [150, 70, 40] : GOLD, a * fade); ctx.lineWidth = w * k;
            ctx.beginPath(); ctx.arc(cx, cy, rf, 0, TAU); ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over';
        }

        // ── LUCA: a small engraved sun ──
        {
          const s = 3.1 * k;
          ctx.strokeStyle = line(1); ctx.lineWidth = 0.9;
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * TAU + Math.PI / 8 + spin * 0;
            const [x1, y1] = at(s * 1.5, a), [x2, y2] = at(s * (i % 2 ? 2.7 : 3.5), a);
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          }
          ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
          const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 9);
          gl.addColorStop(0, rgba(GOLD, light ? 0.3 : 0.55)); gl.addColorStop(1, rgba(GOLD, 0));
          ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, s * 9, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = rgba(light ? [150, 70, 40] : [255, 244, 214], 1);
          ctx.strokeStyle = line(1);
          ctx.beginPath(); ctx.arc(cx, cy, s, 0, TAU); ctx.fill(); ctx.stroke();
        }

        // ── the counter, then the cartouche ──
        const pmya = Math.round((3800 * (1 - p)) / 10) * 10;
        const py = cy + Rc + (small ? 44 : 50) * (Rc / 172);
        const cA = smooth(0.2, 0.6, t) * (1 - smooth(3.3, 3.8, t));
        if (cA > 0.01) {
          const label = pmya > 0 ? `${pmya.toLocaleString('en')} Ma` : txt.present;
          drawText(ctx, label, cx, py + plateH * 0.30, { size: small ? 16 : 20, weight: 500, family: MONO, color: line(1), alpha: cA, spacing: 3, dir: pmya > 0 ? 'ltr' : undefined, rtl });
        }

        // the cartouche: a chamfered double rule, engraved from its centre outward
        const reveal = smooth(3.15, 4.0, t);
        if (reveal > 0.001) {
          const cw = Math.min(W * 0.9, small ? 350 : 520), ch = plateH * 0.86;
          const x0 = cx - cw / 2, y0 = py - 2, ch2 = 6 * k + 2;
          const half = (cw / 2) * easeOut3(reveal);
          ctx.save();
          ctx.beginPath(); ctx.rect(cx - half, y0 - 4, half * 2, ch + 8); ctx.clip();
          for (const [inset, w, al] of [[0, 1.0, 0.95], [4, 0.55, 0.55]]) {
            const l = x0 + inset, r = x0 + cw - inset, tt = y0 + inset, b = y0 + ch - inset, c = ch2 - inset * 0.4;
            ctx.strokeStyle = line(al); ctx.lineWidth = w;
            ctx.beginPath();
            ctx.moveTo(l + c, tt); ctx.lineTo(r - c, tt); ctx.lineTo(r, tt + c); ctx.lineTo(r, b - c);
            ctx.lineTo(r - c, b); ctx.lineTo(l + c, b); ctx.lineTo(l, b - c); ctx.lineTo(l, tt + c); ctx.closePath(); ctx.stroke();
          }
          ctx.restore();
          // the diamond where the plaque meets the dial
          ctx.save(); ctx.globalAlpha = reveal;
          ctx.translate(cx, y0 - 1); ctx.rotate(Math.PI / 4);
          ctx.fillStyle = pal.bg; ctx.strokeStyle = line(1); ctx.lineWidth = 0.9;
          ctx.fillRect(-4 * k - 1, -4 * k - 1, 8 * k + 2, 8 * k + 2); ctx.strokeRect(-4 * k - 1, -4 * k - 1, 8 * k + 2, 8 * k + 2);
          ctx.restore();

          const up = (s) => s.toLocaleUpperCase(env.lang);
          const inner = cw * 0.86;
          const trk = rtl ? 0.8 : small ? 5 : 7, trk2 = rtl ? 0.6 : 2.4;
          const tsz = fitSize(ctx, up(txt.title), small ? 27 : 34, 600, inner, undefined, trk);
          drawText(ctx, up(txt.title), cx, y0 + ch * 0.40, { size: tsz, weight: 600, color: rgba(IVORY, 1), alpha: reveal, spacing: trk, rtl });
          // a rule with a diamond, then the line beneath
          const ry = y0 + ch * 0.66;
          ctx.globalAlpha = reveal * 0.8; ctx.strokeStyle = line(1); ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(cx - inner * 0.34, ry); ctx.lineTo(cx - 7, ry); ctx.moveTo(cx + 7, ry); ctx.lineTo(cx + inner * 0.34, ry); ctx.stroke();
          ctx.fillStyle = line(1); ctx.beginPath(); ctx.moveTo(cx, ry - 3); ctx.lineTo(cx + 3, ry); ctx.lineTo(cx, ry + 3); ctx.lineTo(cx - 3, ry); ctx.closePath(); ctx.fill();
          ctx.globalAlpha = 1;
          const ssz = fitSize(ctx, up(txt.subtitle), small ? 10 : 12, 500, inner, undefined, trk2);
          drawText(ctx, up(txt.subtitle), cx, y0 + ch * 0.83, { size: ssz, weight: 500, color: pal.muted, alpha: reveal * 0.95, spacing: trk2, rtl });
          const cin = smooth(4.0, 4.4, t);
          if (cin > 0.01) {
            const beat = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(t * 2.4));
            drawText(ctx, txt.click, cx, y0 + ch + (small ? 24 : 28), { size: small ? 11 : 13, weight: 500, color: pal.muted, alpha: cin * beat, spacing: 2, rtl });
          }
        }
        ctx.globalAlpha = 1;
      },
    };
  },
};
