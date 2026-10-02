// ── FORK ──────────────────────────────────────────────────────────────────
// One split per screen, drawn as a split, with the date on it.
//
// The narrow one, and the one that matches the game on the front page: Kin
// asks "who is the closer cousin", and this answers it in the same shape —
// here is a lineage, here is where it divided, here is when, here is what
// came out. A nested list says "these are inside that", which is a filing
// cabinet; this says "this one became those", which is what happened.
import { ROOT, ORIGIN, kids, name, age, path, ageLabel } from '../data.js';

const SVG = 'http://www.w3.org/2000/svg';
const el = (t, a = {}) => { const e = document.createElementNS(SVG, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
const count = (n) => { let c = 1; kids(n).forEach((k) => { c += count(k); }); return c; };

export default {
  id: 'fork',
  label: { en: 'Fork', he: 'פיצול', ru: 'Развилка' },
  blurb: {
    en: 'One split per screen, with the date on the fork. The shape the game uses.',
    he: 'פיצול אחד למסך, עם התאריך עליו.',
    ru: 'Одна развилка на экран, с датой на ней.',
  },

  render(host, { selected, lang, rtl, onPick }) {
    const W = host.clientWidth, H = host.clientHeight;
    const chain = path(selected);
    const ks = kids(selected);
    const mirror = (x) => (rtl ? W - x : x);

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img' });

    // The lineage you came down, as a stem with a bead per ancestor. It is
    // the context the old card grid threw away on every tap.
    const stemY = 30, stemGap = Math.min(64, (W - 80) / Math.max(1, chain.length));
    chain.forEach((n, i) => {
      const x = mirror(34 + i * stemGap);
      if (i) svg.appendChild(el('line', { x1: mirror(34 + (i - 1) * stemGap), y1: stemY, x2: x, y2: stemY, class: 'frk-stem' }));
      const g = el('g', { class: `frk-bead${n === selected ? ' is-sel' : ''}`, tabindex: '0', role: 'button' });
      g.appendChild(el('circle', { cx: x, cy: stemY, r: n === selected ? 8 : 5, style: `fill:${n.color}` }));
      g.addEventListener('click', () => onPick(n));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(n); } });
      svg.appendChild(g);
    });

    /* Laid out against the window rather than at fixed pixels: this concept
       is phone-shaped, and on a desktop the fixed version drew a small
       picture in the top third and left the rest black — which is the
       complaint it is supposed to answer. */
    const topY = Math.max(104, H * 0.22);
    const forkY = topY + Math.max(70, H * 0.12);
    const cardY = forkY + Math.max(64, H * 0.16);
    const cx = W / 2;

    const title = el('text', { x: cx, y: topY, 'text-anchor': 'middle', class: 'frk-title', dir: 'auto' });
    title.textContent = name(selected, lang);
    svg.appendChild(title);

    if (!ks.length) { host.replaceChildren(svg); return; }

    const slot = Math.min(190, (W - 36) / ks.length);
    const startX = cx - (slot * (ks.length - 1)) / 2;

    // The fork itself: one limb per child, leaving a single point.
    ks.forEach((k, i) => {
      const x = startX + i * slot;
      svg.appendChild(el('path', {
        d: `M ${cx} ${topY + 16} C ${cx} ${forkY}, ${x} ${forkY - 10}, ${x} ${cardY - 30}`,
        class: 'frk-limb', style: `stroke:${k.color}`,
      }));
    });

    /* When it happened, written on the fork rather than filed as a subtitle.
       Above the title, not between the limbs: drawn at the fork it landed in
       the middle of the bundle of curves leaving it and was unreadable. */
    const when = el('text', { x: cx, y: topY - 30, 'text-anchor': 'middle', class: 'frk-when', dir: 'ltr' });
    when.textContent = ageLabel(selected._parent ? age(selected) : ORIGIN, lang);
    svg.appendChild(when);

    ks.forEach((k, i) => {
      const x = startX + i * slot;
      const g = el('g', { class: 'frk-card', tabindex: '0', role: 'button' });
      g.appendChild(el('circle', { cx: x, cy: cardY, r: 26, style: `fill:${k.color}` }));
      const nm = el('text', { x, y: cardY + 52, 'text-anchor': 'middle', class: 'frk-name', dir: 'auto' });
      nm.textContent = name(k, lang);
      g.appendChild(nm);
      const sub = el('text', { x, y: cardY + 70, 'text-anchor': 'middle', class: 'frk-sub', dir: 'ltr' });
      sub.textContent = kids(k).length ? `${count(k) - 1}` : ageLabel(age(k), lang);
      g.appendChild(sub);
      g.addEventListener('click', () => onPick(k));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(k); } });
      svg.appendChild(g);
    });

    host.replaceChildren(svg);
  },
};
