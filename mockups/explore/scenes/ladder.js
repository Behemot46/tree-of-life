// ── LADDER ────────────────────────────────────────────────────────────────
// A time-calibrated cladogram: the shape the content already has.
//
// Horizontal position IS the age of a split. Two rows at the same indent in
// the current outline can be three billion years apart; here they cannot,
// because the axis is time and nothing else. Vertical order is layout, but
// adjacency is meaning — sister groups sit next to each other and you can
// read "birds left the crocodiles long after both left the lizards" off the
// picture instead of out of two subtitles.
import { ROOT, ORIGIN, kids, name, age, path, timePos, weight, ageLabel } from '../data.js';

const SVG = 'http://www.w3.org/2000/svg';
const el = (t, a = {}) => { const e = document.createElementNS(SVG, t); for (const k in a) e.setAttribute(k, a[k]); return e; };

export default {
  id: 'ladder',
  label: { en: 'Ladder', he: 'סולם', ru: 'Лестница' },
  blurb: {
    en: 'Time is the axis. Every fork sits at the age it happened.',
    he: 'הציר הוא זמן. כל פיצול יושב בגיל שבו קרה.',
    ru: 'Ось — время. Каждая развилка на своём возрасте.',
  },

  render(host, { selected, lang, rtl, onPick }) {
    const W = host.clientWidth, H = host.clientHeight;
    const padT = 44, padB = 30, padS = 14, padE = 188;
    const x0 = padS, x1 = W - padE;
    const X = (mya) => x0 + (x1 - x0) * timePos(mya);
    const mirror = (x) => (rtl ? W - x : x);

    /* How much tree to open, decided by how much room there is.
       The outline could only ever show one level at a time, because indent
       costs horizontal space it does not have. Time costs none: a fork drawn
       at its own date is as cheap on row forty as on row four. So the chosen
       node's subtree is expanded breadth-first for as long as the rows still
       fit at a legible height, and the lineage above it keeps its siblings
       collapsed for context. That is the whole argument — this shape scales
       where the outline does not. */
    const open = new Set(path(selected).map((n) => n.id));
    const MIN_STEP = 15;
    let budget = Math.max(1, Math.floor((H - padT - padB) / MIN_STEP) - 1);
    let tips = 1, queue = [selected];
    while (queue.length) {
      const n = queue.shift();
      const ks = kids(n);
      if (!ks.length) continue;
      if (tips - 1 + ks.length > budget) continue;
      tips += ks.length - 1;
      open.add(n.id);
      queue.push(...ks);
    }
    const visibleKids = (n) => (open.has(n.id) ? kids(n) : []);

    // Assign a row to every tip of the open set; a fork takes the mean of its
    // children, which is what makes a fork look like a fork.
    const rows = [];
    (function place(n) {
      const ks = visibleKids(n);
      if (!ks.length) { n._row = rows.length; rows.push(n); return; }
      ks.forEach(place);
      n._row = (ks[0]._row + ks[ks.length - 1]._row) / 2;
    })(ROOT);
    const step = Math.max(MIN_STEP, Math.min(46, (H - padT - padB) / Math.max(1, rows.length)));
    const fs = Math.max(9.5, Math.min(12.5, step * 0.55));
    const Y = (n) => padT + step * (n._row + 0.5);

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img' });

    // The axis, with the ticks the opening uses.
    /* Fewer ticks on a narrow screen. All seven on a 390px phone ran into
       each other as "1 Ga500 M200 M66 Matoday", which is worse than none. */
    const TICKS = W < 560 ? [3500, 1000, 200, 0] : [3500, 2000, 1000, 500, 200, 66, 0];
    for (const mya of TICKS) {
      const x = mirror(X(mya));
      svg.appendChild(el('line', { x1: x, y1: padT - 10, x2: x, y2: H - padB, class: 'lad-grid' }));
      const tx = el('text', { x, y: padT - 18, class: 'lad-tick', 'text-anchor': 'middle', dir: 'ltr' });
      tx.textContent = ageLabel(mya, lang);
      svg.appendChild(tx);
    }

    (function draw(n) {
      const ks = visibleKids(n);
      const w = weight(n, 1, 7);
      const px = n._parent ? mirror(X(age(n._parent))) : mirror(X(ORIGIN));
      const nx = mirror(X(age(n))), ny = Y(n);
      // The limb: out from where the parent split, to where this one did.
      svg.appendChild(el('path', {
        d: `M ${px} ${ny} H ${nx}`, class: 'lad-limb',
        style: `stroke:${n.color};stroke-width:${w}`,
      }));
      if (ks.length) {
        // The fork: one upright joining the children it gave rise to.
        const ys = ks.map(Y);
        svg.appendChild(el('path', {
          d: `M ${nx} ${Math.min(...ys)} V ${Math.max(...ys)}`, class: 'lad-limb',
          style: `stroke:${n.color};stroke-width:${Math.max(1, w * 0.7)}`,
        }));
        ks.forEach(draw);
      }

      const g = el('g', { class: `lad-node${n === selected ? ' is-sel' : ''}`, tabindex: '0', role: 'button' });
      const rad = Math.max(2.5, Math.min(6, step * 0.16));
      g.appendChild(el('circle', { cx: nx, cy: ny, r: kids(n).length ? rad : rad * 0.7, style: `fill:${n.color}` }));
      /* A fork's name rides above its own limb; only a tip's name sits on
         the row. Both on the row put "Arthropods" straight through "Horseshoe
         crab", because a fork's x and its first child's x are a hair apart. */
      const isFork = ks.length > 0;
      const full = name(n, lang);
      const txt = full.length > 26 ? full.slice(0, 25) + '\u2026' : full;
      /* A fork's name sits *before* its node, in the limb that led to it —
         the cladogram convention, and the only placement with reliable room.
         Above the row it still collided with whichever child shares the row,
         since a fork and its first child are drawn a hair apart. */
      const label = el('text', {
        x: nx + (isFork ? (rtl ? 9 : -9) : (rtl ? -10 : 10)),
        y: isFork ? ny - fs * 0.45 : ny + fs * 0.35,
        class: `lad-name${isFork ? ' is-fork' : ''}`,
        'text-anchor': isFork ? (rtl ? 'start' : 'end') : (rtl ? 'end' : 'start'),
        dir: 'auto', style: `font-size:${isFork ? fs * 0.92 : fs}px`,
      });
      label.textContent = txt;
      g.appendChild(label);
      /* A collapsed branch says how much is behind it, on the same line as
         its name rather than under it — at fifteen pixels a row there is no
         second line to use. */
      if (kids(n).length && !ks.length) {
        const w2 = txt.length * fs * 0.56 + 16;
        const more = el('text', {
          x: nx + (rtl ? -w2 : w2), y: ny + fs * 0.35, class: 'lad-more',
          'text-anchor': rtl ? 'end' : 'start', dir: 'ltr',
          style: `font-size:${fs * 0.82}px`,
        });
        more.textContent = `+${kids(n).length}`;
        g.appendChild(more);
      }
      g.addEventListener('click', () => onPick(n));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(n); } });
      svg.appendChild(g);
    })(ROOT);

    host.replaceChildren(svg);
  },
};
