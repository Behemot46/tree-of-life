// Shared data and scales for the Explore layout concepts.
//
// Reads the site's own TREE, so every concept is drawn over real ages, real
// names and real subtree sizes rather than over invented shapes. 165 nodes,
// nine levels, and every one of them carries a numeric `appeared` in Mya —
// which is the whole argument these concepts are making.
import { TREE } from '../../js/treeData.js';
import { TAXON_NAMES } from '../../js/taxonNames.js';
import { TRANSLATIONS } from '../../js/uiData.js';

export const ROOT = TREE;
export const ORIGIN = 3800;             // Mya at the root

(function link(n, parent, depth) {
  n._parent = parent; n._depth = depth;
  (n.children || []).forEach((c) => link(c, n, depth + 1));
})(TREE, null, 0);

export function kids(n) { return n.children || []; }
export function name(n, lang) { return (TAXON_NAMES[lang] && TAXON_NAMES[lang][n.id]) || n.name; }
export function t(key, lang) {
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
}
export function age(n) { return typeof n.appeared === 'number' ? n.appeared : 0; }

export function size(n) {
  let c = 0;
  (function w(x) { c++; kids(x).forEach(w); })(n);
  return c;
}

export function path(n) { const out = []; for (let x = n; x; x = x._parent) out.unshift(x); return out; }

export function byId(id, from = TREE) {
  if (from.id === id) return from;
  for (const c of kids(from)) { const f = byId(id, c); if (f) return f; }
  return null;
}

/* Time, on the power scale the opening already uses. Linear time gives the
   last 700 million years 18% of the axis and crushes every split a reader
   recognises into a sliver at one end; ^0.45 gives the last 100 Ma about a
   fifth of it while the root still sits at zero. */
export const EXP = 0.45;
export function timePos(mya) { return 1 - Math.pow(Math.max(0, mya) / ORIGIN, EXP); }

/* A limb's weight carries how much life is down it. Log, because the counts
   are not: the root holds 165 descendants and over half the nodes hold none,
   so linear gives one thick line and eighty identical hairlines. */
export function weight(n, min, max) {
  return min + (max - min) * Math.log1p(size(n) - 1) / Math.log1p(size(ROOT) - 1);
}

/* Units live here rather than in TRANSLATIONS: these are concepts, and a
   mockup must not add keys to the shipping translation tables. "Ga" and "Ma"
   are written as a Latin run even in Hebrew — laid out RTL, "720 Ma" comes
   back as "Ma 720", which is the reordering the opening and the detail panel
   both already guard against. */
const UNITS = {
  en: { ga: 'Ga', ma: 'Ma', now: 'today' },
  he: { ga: 'Ga', ma: 'Ma', now: '\u05d4\u05d9\u05d5\u05dd' },
  ru: { ga: 'Ga', ma: 'Ma', now: '\u0441\u0435\u0433\u043e\u0434\u043d\u044f' },
};
export function ageLabel(mya, lang) {
  const u = UNITS[lang] || UNITS.en;
  if (mya >= 1000) return `${+(mya / 1000).toFixed(mya % 1000 ? 1 : 0)} ${u.ga}`;
  if (mya >= 1) return `${Math.round(mya)} ${u.ma}`;
  return u.now;
}
