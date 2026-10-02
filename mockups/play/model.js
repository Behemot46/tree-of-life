// The Ladder's view of the tree: the site's own TREE, expanded exactly as the
// Atlas expands it (165 hand-written nodes become 305), with parents, depth and
// subtree size worked out once.
//
// Self-contained on purpose. mockups/explore/data.js links the *unexpanded*
// tree, and a second pass over the same objects would fight it.
import { TREE, lightenColor } from '../../js/treeData.js';
import { expandTree } from '../../js/treeExpansion.js';
import { TAXON_NAMES } from '../../js/taxonNames.js';
import { TRANSLATIONS } from '../../js/uiData.js';

expandTree(TREE, lightenColor);

export const ROOT = TREE;
export const ORIGIN = 3800;                    // Mya at the root

const sizes = new Map();
const index = new Map();
(function link(n, parent, depth) {
  n._parent = parent; n._depth = depth;
  index.set(n.id, n);
  let s = 1;
  for (const c of n.children || []) { link(c, n, depth + 1); s += sizes.get(c.id); }
  sizes.set(n.id, s);
})(ROOT, null, 0);

export const kids = (n) => n.children || [];
export const size = (n) => sizes.get(n.id);          // the node and everything under it
export const byId = (id) => index.get(id) || null;
export const age = (n) => (typeof n.appeared === 'number' ? n.appeared : 0);
export const isExtinct = (n) => n.extinct === true;
export const ALL = [...index.values()];

export function path(n) { const out = []; for (let x = n; x; x = x._parent) out.unshift(x); return out; }
export function name(n, lang) { return (TAXON_NAMES[lang] && TAXON_NAMES[lang][n.id]) || n.name; }
export function ui(key, lang) {
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
}

/* Time on the power scale the opening already uses. Linear time gives the last
   700 million years 18% of the axis and crushes every split a reader knows
   into a sliver; ^0.45 gives the last 100 Ma about a fifth. */
export const EXP = 0.45;
export const timePos = (mya) => 1 - Math.pow(Math.max(0, mya) / ORIGIN, EXP);

/* "500 Ma" is a Latin run. Units are written here, not added to the shipping
   translation tables: this is a mockup and must not touch them. */
const UNITS = {
  en: { ga: 'Ga', ma: 'Ma', now: 'today' },
  he: { ga: 'Ga', ma: 'Ma', now: 'היום' },
  ru: { ga: 'Ga', ma: 'Ma', now: 'сегодня' },
};
export function ageLabel(mya, lang) {
  const u = UNITS[lang] || UNITS.en;
  if (mya >= 1000) return `${+(mya / 1000).toFixed(mya % 1000 ? 1 : 0)} ${u.ga}`;
  if (mya >= 1) return `${Math.round(mya)} ${u.ma}`;
  return u.now;
}

/* The geological eras that give the axis something to say. Names are the
   standard ones in each language; the Hebrew and Russian have not had a
   native speaker's review. */
export const ERAS = [
  { id: 'archean',     from: ORIGIN, to: 2500, en: 'Archean',     he: 'ארכאי',                                ru: 'Архей' },
  { id: 'proterozoic', from: 2500,   to: 541,  en: 'Proterozoic', he: 'פרוטרוזואיקון', ru: 'Протерозой' },
  { id: 'paleozoic',   from: 541,    to: 252,  en: 'Paleozoic',   he: 'פלאוזואיקון',             ru: 'Палеозой' },
  { id: 'mesozoic',    from: 252,    to: 66,   en: 'Mesozoic',    he: 'מזוזואיקון',                   ru: 'Мезозой' },
  { id: 'cenozoic',    from: 66,     to: 0,    en: 'Cenozoic',    he: 'קנוזואיקון',                   ru: 'Кайнозой' },
];

export const TODAY = { en: 'today', he: 'היום', ru: 'сегодня' };
