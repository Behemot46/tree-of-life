// ══════════════════════════════════════════════════════
// KIN — THE REVEAL
//
// Three lines traced back in time until they meet. The nearer pair joins at
// a distance from "now" proportional to its age (dNear / dFar of the way to
// the older split), so a recent split looks recent and a close call looks
// close. Very recent or near-equal splits are nudged by up to ~30 of 340
// units so both joins stay visible; the labels carry the real numbers.
//
// Lines are SVG; every word is HTML laid over it. SVG text has no reliable
// bidi handling across browsers, and in Hebrew the whole figure is mirrored
// so time runs right to left, with each label anchored on its mirrored side.
// ══════════════════════════════════════════════════════

import { STRINGS } from './strings.js';
import { CREATURES } from './creatures.js';
import { SOURCES } from './dates.js';

const W = 340, H = 150, X_LEAF = 196, X_FAR = 18;
const Y1 = 32, Y2 = 68, Y3 = 116, YN = (Y1 + Y2) / 2, YF = (YN + Y3) / 2, AXIS = H - 14;

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;

export function nearJoinX(r) {
  const x = r.dated ? X_LEAF - (r.dNear.mya / r.dFar.mya) * (X_LEAF - X_FAR) : (X_LEAF + X_FAR) / 2;
  return Math.max(X_FAR + 34, Math.min(x, X_LEAF - 32));
}

/** The figure, as HTML. `r` is engine.resolve(question). */
export function treeHTML(r, lang) {
  const s = STRINGS[lang];
  const rtl = s.dir === 'rtl';
  const X = (x) => (rtl ? W - x : x);
  const T = CREATURES[r.t], N = CREATURES[r.near], F = CREATURES[r.far];
  const xN = nearJoinX(r);
  const f = (v) => v.toFixed(1);

  const paths = [
    [`M${f(X(X_LEAF))} ${Y1} H${f(X(xN))} V${YN}`, 'hot'],
    [`M${f(X(X_LEAF))} ${Y2} H${f(X(xN))} V${YN}`, 'hot'],
    [`M${f(X(xN))} ${YN} H${f(X(X_FAR))} V${YF}`, 'late'],
    [`M${f(X(X_LEAF))} ${Y3} H${f(X(X_FAR))} V${YF}`, 'late'],
  ].map(([d, cls]) => `<path class="kin-ln kin-draw ${cls}" pathLength="1" d="${d}"/>`).join('');

  /* A label anchored at x: "start" grows away from the far split (into the
     leaves' side in LTR), "end" grows the other way, "mid" is centred. In
     Hebrew the figure is mirrored, so start and end swap. */
  const at = (x, y, anchor, cls, html, extra = '') => {
    const shift = anchor === 'mid' ? '-50%' : ((anchor === 'start') !== rtl ? '0' : '-100%');
    return `<span class="kin-lab ${cls}" style="left:${pct(X(x), W)};top:${pct(y, H)};transform:translate(${shift},-50%)"${extra}>${html}</span>`;
  };

  const leaf = (c, y, cls) => at(X_LEAF + 10, y, 'start', `kin-leaf ${cls}`,
    `<span aria-hidden="true">${c.e}</span> <span dir="auto">${esc(c[lang].n)}</span>`);

  /* The near date is centred over its join, except at either end of the
     axis. A recent split sits close to the leaves, and centred there its
     date ran into the top leaf's name ("18.1M yrs ago" into "🍉 Watermelon"
     on a 360px phone), so it hangs back toward the past instead. An old one
     sits by the far edge, where the long Hebrew "more than 247 million" ran
     out of the figure, so it reaches toward the leaves. Every question in the
     bank is drawn to check this (play:every-reveal-fits). */
  const [nearAnchor, nearX] = xN >= X_LEAF - 70 ? ['end', xN + 8]
    : xN <= X_FAR + 70 ? ['start', xN - 8]
    : ['mid', xN];
  const dates = r.dated
    ? at(nearX, Y1 - 13, nearAnchor, 'kin-date hot kin-fade n1', esc(s.short(r.dNear))) +
      at(X_FAR + 9, YF, 'start', 'kin-date kin-fade n2', esc(s.short(r.dFar)))
    : '';

  const aria = r.dated ? s.headline(T, N, F, r.dNear, r.dFar) : s.headlineNoDates(T, N, F);

  return `<figure class="kin-tree" role="img" aria-label="${esc(aria)}">
    <svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
      <line class="kin-axis" x1="${f(X(X_FAR))}" y1="${AXIS}" x2="${f(X(X_LEAF))}" y2="${AXIS}"/>
      ${paths}
      <circle class="kin-nd hot kin-pop n1" cx="${f(X(xN))}" cy="${YN}" r="4.5"/>
      <circle class="kin-nd kin-pop n2" cx="${f(X(X_FAR))}" cy="${YF}" r="4.5"/>
    </svg>
    <div class="kin-labs" aria-hidden="true">
      ${leaf(N, Y1, 'near')}${leaf(T, Y2, 'target')}${leaf(F, Y3, '')}
      ${dates}
      ${at(X_FAR, AXIS + 9, 'start', 'kin-axis-lab', esc(s.past))}
      ${at(X_LEAF, AXIS + 9, 'mid', 'kin-axis-lab', esc(s.now))}
    </div>
  </figure>`;
}

/** "Dates: Source A; Source B" with links, in the language's own label.
    Citations are titles of English publications, so they read left to right. */
export function sourcesHTML(r, lang) {
  if (!r.dated) return '';
  const keys = [...new Set([r.dNear.src, r.dFar.src].filter(Boolean))];
  const links = keys.map((k) => SOURCES[k]).filter(Boolean)
    .map((src) => `<a href="${esc(src.url)}" target="_blank" rel="noopener" dir="ltr">${esc(src.title)}</a>`);
  if (!links.length) return '';
  return `<p class="kin-sources" data-kin-citation>${esc(STRINGS[lang].sources)} ${links.join('; ')}</p>`;
}
