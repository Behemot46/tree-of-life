// ══════════════════════════════════════════════════════
// KIN — WHEN THE BRANCHES SPLIT
//
// The age, in millions of years, of each node in js/kin/tree.js that a
// question can land on, with the openly citable source it came from.
//
// `min: true` marks a fossil minimum: the split is at least this old, and
// the reveal says "more than".
//
// TimeTree (timetree.org) is deliberately absent. Its terms allow personal
// research and teaching use and forbid redistribution, so it was used only
// to sanity-check these figures, never as their source.
// ══════════════════════════════════════════════════════

export const SOURCES = {};

/* PROVISIONAL — layout testing only, uncited. Replaced before commit; the unit
   tests fail while any entry points at a source that is not in SOURCES. */
export const NODE_DATES = {
  eukaryota: { mya: 1500, src: 'provisional' },
  opisthokonta: { mya: 1100, src: 'provisional' },
  bilateria: { mya: 690, src: 'provisional' },
  protostomia: { mya: 600, src: 'provisional' },
  arthropoda: { mya: 560, src: 'provisional' },
  arachnopulmonata: { mya: 480, src: 'provisional' },
  pancrustacea: { mya: 500, src: 'provisional' },
  reptantia: { mya: 250, src: 'provisional' },
  holometabola: { mya: 340, src: 'provisional' },
  diptera: { mya: 250, src: 'provisional' },
  mollusca: { mya: 530, src: 'provisional' },
  gnathostomata: { mya: 460, src: 'provisional' },
  osteichthyes: { mya: 430, src: 'provisional' },
  tetrapoda: { mya: 350, src: 'provisional' },
  sauria: { mya: 280, src: 'provisional' },
  squamata: { mya: 190, src: 'provisional' },
  archelosauria: { mya: 255, src: 'provisional' },
  archosauria: { mya: 245, src: 'provisional' },
  tyrannoraptora: { mya: 165, min: true, src: 'provisional' },
  neognathae: { mya: 95, src: 'provisional' },
  neoaves: { mya: 70, src: 'provisional' },
  theria: { mya: 160, src: 'provisional' },
  diprotodontia: { mya: 50, src: 'provisional' },
  placentalia: { mya: 100, src: 'provisional' },
  elephantidae: { mya: 7, src: 'provisional' },
  boreoeutheria: { mya: 90, src: 'provisional' },
  glires: { mya: 80, src: 'provisional' },
  muroidea: { mya: 25, src: 'provisional' },
  hominidae: { mya: 16, src: 'provisional' },
  homininae: { mya: 8.7, src: 'provisional' },
  laurasiatheria: { mya: 85, src: 'provisional' },
  scrotifera: { mya: 80, src: 'provisional' },
  carnivora: { mya: 55, src: 'provisional' },
  caniformia: { mya: 45, src: 'provisional' },
  arctoidea: { mya: 40, src: 'provisional' },
  musteloidea: { mya: 30, src: 'provisional' },
  artiodactyla: { mya: 64, src: 'provisional' },
  artiofabula: { mya: 62, src: 'provisional' },
  cetruminantia: { mya: 58, src: 'provisional' },
  whippomorpha: { mya: 53, src: 'provisional' },
  pecora: { mya: 25, src: 'provisional' },
  perissodactyla: { mya: 55, src: 'provisional' },
  mesangiospermae: { mya: 150, src: 'provisional' },
  monocots_lilies_grasses: { mya: 125, src: 'provisional' },
  commelinids: { mya: 115, src: 'provisional' },
  poaceae: { mya: 55, src: 'provisional' },
  pentapetalae: { mya: 120, src: 'provisional' },
  rosids: { mya: 115, src: 'provisional' },
  eurosids: { mya: 108, src: 'provisional' },
  sapindales: { mya: 70, src: 'provisional' },
  rosoideae: { mya: 40, src: 'provisional' },
  prunus: { mya: 16, src: 'provisional' },
  benincaseae: { mya: 16, src: 'provisional' },
  ericales: { mya: 95, src: 'provisional' },
  lamiids: { mya: 88, src: 'provisional' },
  solanum_eggplant: { mya: 13, src: 'provisional' },
  solanum_tomato_potato: { mya: 8, src: 'provisional' },
  asteraceae: { mya: 40, src: 'provisional' },
};
