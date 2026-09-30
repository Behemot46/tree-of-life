// ══════════════════════════════════════════════════════
// CONCEPT 1 — FIRST DIVISION
//
// The camera starts inside one cell — huge, breathing, its chromosome a slow
// loop — and pulls back as it divides. Its daughters divide, and each division
// leaves a thread behind it: pulled all the way out, the tree is the record of
// every split since the first cell. Bioluminescent, close, organic: a
// microscope, then a map.
//
// Beats: 0 one cell · 0.55 it buds three daughters, the domains (a rod-shaped
// bacterium, a spiny archaeon, a eukaryote with its nucleus) · 1.3 and 1.9 the
// next generations while the camera draws back · 3.0 the tree settles and the
// title rises in the empty wedge.
// ══════════════════════════════════════════════════════

import { clamp01, map01, smooth, easeOut3, easeInOut3, mulberry32, rgba, lighten, darken, glowSprite, drawText, fitSize, parseColor, vivid, lerp } from '../common.js';
import { prune, assignAngles, frame } from '../layout.js';
import { siteTree } from '../data.js';

const GAP = 1.6;
const DURATION = 4.5;
const TAU = Math.PI * 2;

export default {
  id: 'division',
  name: 'First Division',
  line: 'Start inside one cell. Pull back as it divides — the tree is the record of every split.',
  duration: DURATION,

  build(env) {
    const { W, H, pal, txt, rtl } = env;
    const light = pal.isLight;
    const F = frame(W, H);
    const root = assignAngles(prune(siteTree(), { depth: 3, maxKids: 5 }), GAP);
    const unit = F.R / 3;
    const k = F.R / 180;                          // sizes below are drawn for a 180px figure
    const GOLD = parseColor(pal.gold);
    const INK = parseColor(pal.ink);
    const S0 = Math.min(3.6, (Math.min(W, H) * 0.30) / (13 * k));   // opening zoom: the first cell is ~60% of the width

    for (const n of root.all) {
      const r = n.depth * unit;
      n.x = F.cx + Math.cos(n.angle) * r;
      n.y = F.cy + Math.sin(n.angle) * r;
      n.radius = [13, 8.6, 5.2, 3.3][n.depth] * k;
      const idx = n.parent ? n.parent.children.indexOf(n) : 0;
      n.t0 = n.depth === 0 ? 0 : [0, 0.55, 1.28, 1.86][n.depth] + idx * (n.depth === 1 ? 0.05 : 0.035);
      n.dur = [0, 1.15, 0.95, 0.9][n.depth];
      n.bow = n.parent ? ((idx % 2) ? 1 : -1) * 0.11 * unit : 0;
      n.phase = mulberry32(n.id.length * 977 + n.depth * 31)() * TAU;
      n.col = vivid(n.rgb, light);
      n.kind = n.id === 'bacteria' ? 'bacterium' : n.id === 'archaea' ? 'archaeon' : n.id === 'eukaryota' ? 'eukaryote' : 'cell';
    }
    root.col = GOLD;
    root.kind = 'luca';

    const sprites = new Map();
    const spr = (rgb) => {
      const key = rgb.map((v) => v | 0).join(',');
      if (!sprites.has(key)) sprites.set(key, glowSprite(rgb.map((v) => v | 0), 96, 0.05));
      return sprites.get(key);
    };

    const rnd = mulberry32(11);
    const snow = Array.from({ length: 40 }, () => ({ x: rnd(), y: rnd(), s: 0.5 + rnd() * 1.5, sp: 0.2 + rnd() * 0.6, ph: rnd() * TAU, z: 0.3 + rnd() * 0.9 }));
    const bokeh = Array.from({ length: 8 }, () => ({ x: rnd(), y: rnd(), r: (50 + rnd() * 110) * k, ph: rnd() * TAU, c: rnd() < 0.5 ? [60, 130, 170] : [170, 110, 60] }));
    // ribosomes: seeded points inside a unit disc, reused by every cell
    const ribo = Array.from({ length: 22 }, () => { const a = rnd() * TAU, d = Math.sqrt(rnd()) * 0.78; return { x: Math.cos(a) * d, y: Math.sin(a) * d, s: 0.03 + rnd() * 0.035, sp: 0.3 + rnd() * 0.6, ph: rnd() * TAU }; });

    const vign = document.createElement('canvas');
    vign.width = Math.round(W * env.dpr); vign.height = Math.round(H * env.dpr);
    {
      const g = vign.getContext('2d');
      g.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
      g.fillStyle = pal.bg; g.fillRect(0, 0, W, H);
      const gr = g.createRadialGradient(F.cx, F.cy, F.R * 0.15, F.cx, F.cy, Math.max(W, H) * 0.78);
      if (light) { gr.addColorStop(0, 'rgba(255,255,255,0.0)'); gr.addColorStop(1, 'rgba(120,96,60,0.20)'); }
      else { gr.addColorStop(0, 'rgba(28,66,88,0.34)'); gr.addColorStop(0.5, 'rgba(10,24,34,0.06)'); gr.addColorStop(1, 'rgba(0,0,0,0.62)'); }
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // out-of-focus discs, baked in: they barely move, so they are painted once
      for (const b of bokeh) {
        g.globalCompositeOperation = light ? 'source-over' : 'lighter';
        g.globalAlpha = (light ? 0.05 : 0.07);
        const sp2 = glowSprite(b.c, 96, 0.05);
        g.drawImage(sp2, b.x * W - b.r, b.y * H - b.r, b.r * 2, b.r * 2);
      }
    }
    const blend = light ? 'source-over' : 'lighter';
    const glowGain = light ? 0.5 : 1;
    const edge = (rgb, a) => rgba(light ? darken(rgb, 0.42) : lighten(rgb, 0.5), a);   // membranes
    const body = (rgb, a) => rgba(light ? lighten(rgb, 0.35) : darken(rgb, 0.35), a);   // cytoplasm

    // ── one point on a child's thread ──
    const tmp = { x: 0, y: 0 };
    const at = (n, u, o = tmp) => {
      const p = n.parent;
      const mx = (p.x + n.x) / 2, my = (p.y + n.y) / 2;
      const dx = n.x - p.x, dy = n.y - p.y, len = Math.hypot(dx, dy) || 1;
      const cx = mx + (-dy / len) * n.bow, cy = my + (dx / len) * n.bow;
      const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
      o.x = a * p.x + b * cx + c * n.x; o.y = a * p.y + b * cy + c * n.y;
      o.ang = Math.atan2(2 * (1 - u) * (cy - p.y) + 2 * u * (n.y - cy), 2 * (1 - u) * (cx - p.x) + 2 * u * (n.x - cx));
      return o;
    };

    // ── the organisms ─────────────────────────────────
    function loop(ctx, r, ph, t, waves = 3, amp = 0.2) {
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * TAU;
        const rr = r * (1 + amp * Math.sin(waves * a + ph + t * 0.6) + amp * 0.55 * Math.sin((waves + 2) * a - ph - t * 0.45));
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
    function ribosomes(ctx, r, rgb, a, t) {
      ctx.fillStyle = rgba(light ? darken(rgb, 0.5) : lighten(rgb, 0.7), 1);
      for (const q of ribo) {
        const x = (q.x + Math.sin(t * q.sp + q.ph) * 0.05) * r, y = (q.y + Math.cos(t * q.sp * 0.9 + q.ph) * 0.05) * r;
        ctx.globalAlpha = a * 0.55;
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, q.s * r), 0, TAU); ctx.fill();
      }
    }
    function membrane(ctx, path, r, rgb, a) {
      ctx.globalAlpha = a * 0.9; ctx.strokeStyle = edge(rgb, 1); ctx.lineWidth = Math.max(0.9, r * 0.085); path(); ctx.stroke();
      ctx.globalAlpha = a * 0.35; ctx.lineWidth = Math.max(0.5, r * 0.03); ctx.save(); ctx.scale(0.87, 0.87); path(); ctx.stroke(); ctx.restore();
    }

    /** Draws one organism at the origin of the current transform, radius r. */
    function organism(ctx, kind, r, rgb, a, t, ph, detail) {
      const disc = () => { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); };
      const d = detail;                            // 0..1: how much interior to paint
      if (kind === 'bacterium') {
        const rx = r * 1.3, ry = r * 0.78;
        const cap = () => { ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); };
        ctx.globalAlpha = a * 0.8; ctx.fillStyle = body(rgb, 0.85); cap(); ctx.fill();
        ctx.save(); cap(); ctx.clip();
        if (d > 0.05) { ctx.globalAlpha = a * d; ribosomes(ctx, r * 1.1, rgb, 1, t); ctx.strokeStyle = edge(rgb, 1); ctx.globalAlpha = a * 0.7 * d; ctx.lineWidth = Math.max(0.6, r * 0.06); ctx.save(); ctx.scale(1.25, 0.72); loop(ctx, r * 0.4, ph, t, 4, 0.28); ctx.stroke(); ctx.restore(); }
        ctx.restore();
        membrane(ctx, cap, r, rgb, a);
        // a flagellum, beating
        if (d > 0.05) {
          ctx.globalAlpha = a * 0.65 * d; ctx.strokeStyle = edge(rgb, 1); ctx.lineWidth = Math.max(0.6, r * 0.05); ctx.beginPath();
          for (let i = 0; i <= 22; i++) { const s = i / 22; const x = -rx - s * r * 2.1, y = Math.sin(s * 9 - t * 6 + ph) * r * 0.16 * s; if (i === 0) ctx.moveTo(-rx, 0); else ctx.lineTo(x, y); }
          ctx.stroke();
        }
      } else if (kind === 'archaeon') {
        ctx.globalAlpha = a * 0.8; ctx.fillStyle = body(rgb, 0.85); disc(); ctx.fill();
        ctx.save(); disc(); ctx.clip();
        if (d > 0.05) { ctx.globalAlpha = a * d; ribosomes(ctx, r, rgb, 1, t); ctx.strokeStyle = edge(rgb, 1); ctx.globalAlpha = a * 0.7 * d; ctx.lineWidth = Math.max(0.6, r * 0.06); loop(ctx, r * 0.4, ph, t, 3, 0.22); ctx.stroke(); }
        ctx.restore();
        membrane(ctx, disc, r, rgb, a);
        // the protein coat shows as a ring of studs
        if (d > 0.05) { ctx.globalAlpha = a * 0.85 * d; ctx.fillStyle = edge(rgb, 1); for (let i = 0; i < 26; i++) { const an = (i / 26) * TAU + t * 0.05; ctx.beginPath(); ctx.arc(Math.cos(an) * r * 1.13, Math.sin(an) * r * 1.13, Math.max(0.7, r * 0.045), 0, TAU); ctx.fill(); } }
      } else if (kind === 'eukaryote') {
        ctx.globalAlpha = a * 0.8; ctx.fillStyle = body(rgb, 0.85); disc(); ctx.fill();
        ctx.save(); disc(); ctx.clip();
        if (d > 0.05) {
          ctx.globalAlpha = a * d; ribosomes(ctx, r, rgb, 1, t);
          // nucleus, with its own double membrane
          ctx.globalAlpha = a * 0.9 * d; ctx.fillStyle = body(rgb, 0.6); ctx.beginPath(); ctx.arc(-r * 0.12, -r * 0.05, r * 0.4, 0, TAU); ctx.fill();
          ctx.strokeStyle = edge(rgb, 1); ctx.lineWidth = Math.max(0.6, r * 0.05); ctx.stroke();
          ctx.globalAlpha = a * 0.5 * d; ctx.beginPath(); ctx.arc(-r * 0.12, -r * 0.05, r * 0.34, 0, TAU); ctx.stroke();
          ctx.globalAlpha = a * 0.95 * d; ctx.fillStyle = edge(rgb, 1); ctx.beginPath(); ctx.arc(-r * 0.05, r * 0.02, r * 0.1, 0, TAU); ctx.fill();
          // mitochondria
          for (let i = 0; i < 3; i++) {
            const an = 1.1 + i * 2.1 + Math.sin(t * 0.4 + i) * 0.12;
            ctx.save(); ctx.translate(Math.cos(an) * r * 0.56, Math.sin(an) * r * 0.56); ctx.rotate(an + 1.2);
            ctx.globalAlpha = a * 0.85 * d; ctx.strokeStyle = edge(rgb, 1); ctx.lineWidth = Math.max(0.5, r * 0.035);
            ctx.beginPath(); ctx.ellipse(0, 0, r * 0.17, r * 0.08, 0, 0, TAU); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-r * 0.11, 0); ctx.quadraticCurveTo(-r * 0.05, -r * 0.05, 0, 0); ctx.quadraticCurveTo(r * 0.05, r * 0.05, r * 0.11, 0); ctx.stroke();
            ctx.restore();
          }
        }
        ctx.restore();
        membrane(ctx, disc, r, rgb, a);
      } else if (kind === 'luca') {
        ctx.globalAlpha = a * 0.8; ctx.fillStyle = body(rgb, 0.8); disc(); ctx.fill();
        ctx.save(); disc(); ctx.clip();
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, rgba(light ? darken(rgb, 0.1) : lighten(rgb, 0.55), 0.55 * a)); g.addColorStop(1, rgba(rgb, 0));
        ctx.fillStyle = g; ctx.fillRect(-r, -r, r * 2, r * 2);
        ctx.globalAlpha = a * d; ribosomes(ctx, r, rgb, 1, t);
        ctx.strokeStyle = edge(rgb, 1); ctx.globalAlpha = a * 0.9 * d; ctx.lineWidth = Math.max(0.8, r * 0.075); loop(ctx, r * 0.42, ph, t, 3, 0.24); ctx.stroke();
        ctx.globalAlpha = a * 0.5 * d; ctx.lineWidth = Math.max(0.6, r * 0.045); ctx.save(); ctx.rotate(1.3); loop(ctx, r * 0.28, ph + 1, t, 4, 0.2); ctx.stroke(); ctx.restore();
        ctx.restore();
        membrane(ctx, disc, r, rgb, a);
      } else {
        // small generic cell: a soft body, a membrane, one bright core
        ctx.globalAlpha = a * 0.85; ctx.fillStyle = body(rgb, 0.85); disc(); ctx.fill();
        ctx.globalAlpha = a * 0.9; ctx.strokeStyle = edge(rgb, 1); ctx.lineWidth = Math.max(0.8, r * 0.13); disc(); ctx.stroke();
        ctx.globalAlpha = a; ctx.fillStyle = edge(rgb, 1); ctx.beginPath(); ctx.arc(r * 0.14, -r * 0.1, Math.max(0.9, r * 0.3), 0, TAU); ctx.fill();
      }
    }

    function cell(ctx, x, y, r, n, a, t, o = {}) {
      const { rot = 0, sx = 1, sy = 1, detail = 1, glow = 1 } = o;
      const rgb = n.col;
      const wob = 1 + Math.sin(t * 2.3 + n.phase) * 0.028;
      ctx.save();
      ctx.globalCompositeOperation = blend;
      ctx.globalAlpha = clamp01(a * 0.5 * glow * glowGain);
      const gr = r * (n.depth >= 3 ? 2.2 : 2.9) * wob;
      ctx.drawImage(spr(rgb), x - gr, y - gr, gr * 2, gr * 2);
      ctx.globalCompositeOperation = 'source-over';
      ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx * wob, sy * wob);
      organism(ctx, n.kind, r, rgb, a, t, n.phase, detail);
      ctx.restore();
    }

    return {
      draw(ctx, t) {
        ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.drawImage(vign, 0, 0, W, H);

        // the camera: inside the cell at first, then drawing back
        const pull = easeInOut3(map01(t, 0.3, 3.1));
        const s = lerp(S0, 1, pull);
        const settle = smooth(2.9, 3.7, t);

        // depth: marine snow slides by more slowly than the cells
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = rgba(light ? [90, 80, 60] : [190, 215, 230], 1);
        for (const m of snow) {
          const z = m.z * 0.6;
          const x = F.cx + ((m.x * W + Math.sin(t * m.sp + m.ph) * 12) - F.cx) * (1 + (s - 1) * z);
          const y = F.cy + ((((m.y * H + t * 6 * m.z) % H) + Math.cos(t * m.sp * 0.8 + m.ph) * 8) - F.cy) * (1 + (s - 1) * z);
          ctx.globalAlpha = (0.16 + 0.34 * m.z) * (0.6 + 0.4 * Math.sin(t * 1.3 + m.ph)) * (light ? 0.4 : 0.75);
          ctx.beginPath(); ctx.arc(x, y, m.s * k * (0.8 + (s - 1) * 0.2), 0, TAU); ctx.fill();
        }

        // ── the world, seen through the camera ──
        ctx.save();
        ctx.translate(F.cx, F.cy); ctx.scale(s, s); ctx.translate(-F.cx, -F.cy);
        const dim = 1 - settle * 0.25;

        // threads: a thick bridge while the daughter is leaving, then a hairline
        ctx.lineCap = 'round';
        for (const n of root.all) {
          if (!n.parent) continue;
          const u = easeOut3(map01(t, n.t0, n.t0 + n.dur));
          if (u <= 0) continue;
          const neck = 1 - smooth(0, 0.5, u);
          const p = n.parent;
          const lw = Math.max(0.7 / s, 1.0 * k) + neck * Math.min(p.radius, n.radius * 1.8) * 0.9;
          ctx.beginPath();
          for (let i = 0; i <= 16; i++) { at(n, (i / 16) * u); if (i === 0) ctx.moveTo(tmp.x, tmp.y); else ctx.lineTo(tmp.x, tmp.y); }
          ctx.globalCompositeOperation = blend;
          ctx.strokeStyle = rgba(neck > 0.5 ? p.col : n.col, 1);
          ctx.globalAlpha = (light ? 0.09 : 0.09) * dim; ctx.lineWidth = lw * 3; ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = (light ? 0.8 : 0.62) * dim; ctx.lineWidth = lw; ctx.stroke();
        }

        // a ring leaves each mother at her first division — one ring, not one per daughter
        for (const p of root.all) {
          if (!p.children.length) continue;
          const kk = map01(t, p.children[0].t0, p.children[0].t0 + 0.7);
          if (kk <= 0 || kk >= 1) continue;
          ctx.globalAlpha = Math.pow(1 - kk, 1.4) * 0.32;
          ctx.strokeStyle = rgba(light ? darken(p.col, 0.2) : lighten(p.col, 0.45), 1);
          ctx.lineWidth = Math.max(0.6 / s, 1.0 * k);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * (1.25 + easeOut3(kk) * (p.depth === 0 ? 2.7 : 3.2)), 0, TAU); ctx.stroke();
        }

        // daughters, deepest generation first so the mothers sit on top
        const order = root.all.slice().sort((a, b) => b.depth - a.depth);
        for (const n of order) {
          if (!n.parent) continue;
          const u = easeOut3(map01(t, n.t0, n.t0 + n.dur));
          if (u <= 0) continue;
          at(n, u);
          const born = smooth(0, 0.25, u);
          // stretched along its path as it leaves, then round; small at first, then to size
          const st = 1 + 0.42 * (1 - smooth(0, 0.55, u));
          const size = n.radius * lerp(0.45, 1, smooth(0, 0.6, u));
          const detail = clamp01((n.radius * s - 9) / 14) * (n.kind === 'cell' ? 0 : 1);
          cell(ctx, tmp.x, tmp.y, size, n, born * (1 - settle * 0.08), t, { rot: tmp.ang, sx: st, sy: 1 / st, detail });
        }

        // the first cell: it shrinks a little as its daughters take its substance
        {
          const born = 1;
          const mother = 1 - 0.32 * smooth(0.6, 1.8, t);
          const beat = 1 + Math.sin(t * 2.2) * 0.022;
          const detail = clamp01((root.radius * mother * s - 10) / 16);
          cell(ctx, F.cx, F.cy, root.radius * mother * beat, root, born, t, { detail, glow: 0.85 * (1 - smooth(1.0, 2.4, t) * 0.7) });
        }
        ctx.restore();

        // ── words, in screen space ──
        ctx.globalCompositeOperation = 'source-over';
        const small = W < 600;
        const gapW = 2 * (F.R * 0.8) * Math.sin(GAP / 2);
        const run = easeInOut3(map01(t, 0.4, 3.0));
        const mya = Math.round((3800 * (1 - run)) / 10) * 10;
        const counterA = smooth(0.0, 0.5, t) * (1 - smooth(2.8, 3.3, t));
        if (counterA > 0.01) {
          const label = mya > 0 ? `${mya.toLocaleString('en')} Ma` : txt.present;
          drawText(ctx, label, F.cx, F.anchor, { size: small ? 16 : 21, weight: 500, color: rgba(light ? darken(GOLD, 0.2) : GOLD), alpha: counterA * 0.95, spacing: 3, dir: mya > 0 ? 'ltr' : undefined, rtl });
        }
        const tin = smooth(2.9, 3.8, t);
        if (tin > 0.01) {
          const lift = (1 - easeOut3(tin)) * 18;
          const size = fitSize(ctx, txt.title, small ? 34 : 56, 700, gapW * 0.92);
          drawText(ctx, txt.title, F.cx, F.anchor + lift, { size, weight: 700, color: pal.ink, alpha: tin, spacing: small ? 0 : 1, rtl, shadow: light ? null : { color: rgba(GOLD, 0.45), blur: 10 } });
          const sub = fitSize(ctx, txt.subtitle, small ? 12.5 : 16, 400, gapW * 0.98, undefined, 1);
          drawText(ctx, txt.subtitle, F.cx, F.anchor + size * 0.9 + lift * 0.6, { size: sub, weight: 400, color: pal.muted, alpha: tin * 0.95, spacing: 1, rtl });
        }
        const cin = smooth(3.95, 4.4, t);
        if (cin > 0.01) {
          const beat = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(t * 2.4));
          drawText(ctx, txt.click, F.cx, F.anchor + F.R * (small ? 0.30 : 0.28), { size: small ? 11 : 13, weight: 500, color: pal.muted, alpha: cin * beat, spacing: 2, rtl });
        }
        ctx.globalAlpha = 1;
      },
    };
  },
};
