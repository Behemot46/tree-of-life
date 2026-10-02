// ── RIVER ─────────────────────────────────────────────────────────────────
// Time runs down the page, and a lineage is a ribbon as wide as the life in it.
//
// Built for the phone first: scrolling down a phone is the one gesture every
// reader already has, and here it means "forward in time". The width carries
// the fact the current rows state in words — "43 inside" — so breadth is seen
// rather than read, and a split is a ribbon dividing rather than an indent.
import { ROOT, ORIGIN, kids, name, age, path, timePos, ageLabel } from '../data.js';

const SVG = 'http://www.w3.org/2000/svg';
const el = (t, a = {}) => { const e = document.createElementNS(SVG, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
const count = (n) => { let c = 1; kids(n).forEach((k) => { c += count(k); }); return c; };

export default {
  id: 'river',
  label: { en: 'River', he: 'נהר', ru: 'Река' },
  blurb: {
    en: 'Scroll down and time moves forward. Width is how much life is in there.',
    he: 'גלילה למטה היא התקדמות בזמן. הרוחב הוא כמות החיים.',
    ru: 'Прокрутка вниз — движение во времени. Ширина — сколько там жизни.',
  },

  render(host, { selected, lang, rtl, onPick }) {
    const W = host.clientWidth, H = host.clientHeight;
    const padT = 34, padB = 26;
    /* The gap between siblings narrows with depth. A flat 10px is a tenth of
       a phylum's band and the whole of a species', so at the tips the gutters
       were wider than the bands and the picture turned to comb teeth. */
    const gutter = (d) => Math.max(1, 10 - d * 1.6);
    const Y = (mya) => padT + (H - padT - padB) * timePos(mya);

    /* Open the whole subtree, and let the picture decide where to stop: a
       band narrower than MIN_W has no room for a name and nothing to say, so
       it keeps its children folded. A space-filling diagram is at its best
       showing everything at once — opening one level at a time wastes the one
       advantage it has over the outline. */
    const MIN_W = 26;
    const open = new Set(path(selected).map((n) => n.id));

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img' });

    /* The axis has to be labelled or "down is time" is a claim rather than a
       reading. Latin run, so dir=ltr even in Hebrew. */
    for (const mya of [3500, 2000, 1000, 500, 200, 66, 0]) {
      const y = Y(mya);
      svg.appendChild(el('line', { x1: 0, y1: y, x2: W, y2: y, class: 'riv-grid' }));
      const tx = el('text', {
        x: rtl ? W - 6 : 6, y: y - 4, class: 'riv-tick', dir: 'ltr',
        'text-anchor': rtl ? 'end' : 'start',
      });
      tx.textContent = ageLabel(mya, lang);
      svg.appendChild(tx);
    }

    const labels = [];
    // Each ribbon owns a horizontal band; its children divide that band
    // between them in proportion to how much tree each one carries.
    (function flow(n, left, right) {
      const yTop = n._parent ? Y(age(n._parent)) : Y(ORIGIN);
      const yMid = Y(age(n));
      const ks = (open.has(n.id) || right - left >= MIN_W) ? kids(n) : [];
      const yBot = ks.length ? yMid : H - padB;

      svg.appendChild(el('path', {
        d: `M ${left} ${yTop} H ${right} V ${yBot} H ${left} Z`,
        class: `riv-band${n === selected ? ' is-sel' : ''}`,
        style: `fill:${n.color}`,
      }));

      const w = right - left;
      /* At the top of its own band, not at its middle: a band runs to the
         foot of the page, so its middle is nowhere in particular and two
         nested bands put their names in the same place. */
      if (w > 40) labels.push({ n, x: left + w / 2, y: yTop + 17, w, depth: n._depth });

      if (!ks.length) return;
      const total = ks.reduce((s, k) => s + count(k), 0);
      let x = left;
      for (const k of ks) {
        const span = (w - gutter(n._depth) * (ks.length - 1)) * (count(k) / total);
        flow(k, x, x + span);
        x += span + gutter(n._depth);
      }
    })(ROOT, 8, W - 8);

    /* Names last, so no ribbon is painted over one — and nudged apart where a
       child starts within a line of its parent, which is what drew "LUCA" and
       "Eukaryota" through each other on a phone. */
    labels.sort((a, b) => a.y - b.y || a.depth - b.depth);
    for (let i = 1; i < labels.length; i++) {
      const prev = labels[i - 1], cur = labels[i];
      const overlapX = Math.abs(cur.x - prev.x) < (cur.w + prev.w) / 2 - 8;
      if (overlapX && cur.y - prev.y < 34) cur.y = prev.y + 34;
    }
    for (const L of labels) {
      const g = el('g', { class: 'riv-label', tabindex: '0', role: 'button' });
      const tx = el('text', { x: L.x, y: L.y, 'text-anchor': 'middle', dir: 'auto', class: 'riv-name' });
      tx.textContent = name(L.n, lang);
      g.appendChild(tx);
      if (kids(L.n).length && L.w > 110) {
        const sub = el('text', { x: L.x, y: L.y + 15, 'text-anchor': 'middle', class: 'riv-sub', dir: 'ltr' });
        sub.textContent = `${count(L.n) - 1}`;
        g.appendChild(sub);
      }
      g.addEventListener('click', () => onPick(L.n));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(L.n); } });
      svg.appendChild(g);
    }

    host.replaceChildren(svg);
  },
};
