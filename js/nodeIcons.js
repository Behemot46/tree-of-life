// ══════════════════════════════════════════════════════
// NODE_ICONS — Naturalist icon library for tree canvas
// 36 distinct SVG silhouette icons, 24×24 viewbox
// ══════════════════════════════════════════════════════

const NODE_ICONS = {
  // ── Prokaryotes ──
  bacteria:    'M12 4c-1.5 0-3 .8-3 2.5v11c0 1.7 1.5 2.5 3 2.5s3-.8 3-2.5v-11C15 4.8 13.5 4 12 4z',
  archaea:     'M12 3l-3 5.5 1.5 3-2.5 4.5L12 21l4-5-2.5-4.5L15 8.5 12 3z',

  // ── Protists & microbes ──
  amoeba:      'M14 5c2.5.5 4 3 3.5 5.5-.3 1.5-1.5 2.5-1 4 .5 1.8-.5 3.5-2.5 4-1.5.3-3-.5-4.5-.5-1.5 0-3 1-4.5.3-2-.8-2.5-3-2-5 .5-1.5 2-2.5 2-4.2 0-2 1.5-3.5 3.5-4.2 1.5-.5 3.5-.3 5.5.1z',
  microbe:     'M12 3a3 3 0 0 0-3 3c0 1 .5 2 1.2 2.6L9 11.5c-1.5.5-2.5 2-2.5 3.5 0 2.2 1.8 4 4 4h3c2.2 0 4-1.8 4-4 0-1.5-1-3-2.5-3.5l-1.2-2.9c.7-.6 1.2-1.6 1.2-2.6a3 3 0 0 0-3-3z',
  algae:       'M12 2c-1 0-2 1-2 2v2c-2 .5-3 2.5-3 4.5 0 1.5.5 3 1.5 4C7 16 6 18 7 20c.5 1 2 2 3.5 2h3c1.5 0 3-1 3.5-2 1-2 0-4-1.5-5.5 1-1 1.5-2.5 1.5-4 0-2-1-4-3-4.5V4c0-1-1-2-2-2z',
  parasite:    'M8 4c-2 1-3 3-2 5l1 2-2 3c-1 2 0 4 2 5l3 1 2 2c1.5 1 3.5.5 4.5-1l1-3 3-1c2-1 2.5-3 1.5-5l-2-2 .5-3c.3-2-1-3.5-3-4l-3 .5-2.5-1.5c-1-.5-2.5-.5-4 1z',

  // ── Fungi ──
  fungus:      'M12 22v-8m0 0c-5 0-8-3-8-6s3-5 8-5 8 2 8 5-3 6-8 6z',
  mushroom:    'M12 22v-6c0-1-1-2-2-2H9c-3 0-5-2-5-4.5S6 5 9 4c1-.3 2-.5 3-.5s2 .2 3 .5c3 1 5 3 5 5.5S18 14 15 14h-1c-1 0-2 1-2 2v6z',

  // ── Plants ──
  plant:       'M12 22V12m0 0c0-4-3-7-7-8 1 3 3.5 6 7 8zm0 0c0-4 3-7 7-8-1 3-3.5 6-7 8z',
  moss:        'M7 20c0-3 1-5 2-7m3 7c0-4 1-7 2-10m3 10c0-3 1-5 2-7M5 20h14M9 13c-1-2-1-4 0-6 .5-1 1.5-2 3-2s2.5 1 3 2c1 2 1 4 0 6',
  fern:        'M12 22V8m0 2l-4-4m4 6l4-4m-4 6l-5-3m5 5l5-3m-5 5l-4-2m4 4l4-2M12 6c0-2 0-3.5 0-4',
  conifer:     'M12 2l-5 7h3l-4 6h3l-4 7h14l-4-7h3l-4-6h3L12 2z',
  flower:      'M12 22v-8m-3.5-3.5a3.5 3.5 0 1 1 7 0m-7 0c-1.5-1.2-4-1.5-5 0s.5 4 2 4.5m3-4.5c1.5-1.2 4-1.5 5 0s-.5 4-2 4.5m-6 0c-1 1.5-1 4 .5 5s3.5 0 4.5-1m-5-4h10m-5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',

  // ── Sponges & cnidarians ──
  sponge:      'M8 4c-2 1-3 4-3 8s1 7 3 8h8c2-1 3-4 3-8s-1-7-3-8H8zm1 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  jellyfish:   'M12 3c-3 0-6 3-6 7 0 2 1 3 2 3h8c1 0 2-1 2-3 0-4-3-7-6-7zm-4 12l-1 5m2-5v5m2-5l1 5m2-5v5m2-5l1 5',
  coral:       'M8 20v-5c-2 0-4-2-4-4 0-1.5 1-3 2.5-3C6 6.5 7 5 9 5c1 0 2 .5 2.5 1.5C12 5.5 13 5 14 5c2 0 3.5 2 3 3.5C18.5 9 20 10.5 20 12c0 2-2 4-4 4v4H8z',

  // ── Worms & annelids ──
  worm:        'M6 8c0-2 2-3 4-3s3 1 3 3c0 1.5-1 2.5-2 3 1.5.5 3 2 3 4 0 2.5-2 4-4.5 4S5 17.5 5 15c0-2 1.5-3.5 3-4-1-.5-2-1.5-2-3z',

  // ── Arthropods ──
  insect:      'M12 4a2 2 0 0 1 2 2c0 .5-.2 1-.5 1.3.9.5 1.5 1.4 1.5 2.7 0 1-.4 1.8-1 2.3.6.7 1 1.6 1 2.7 0 2-1.3 3-3 3s-3-1-3-3c0-1.1.4-2 1-2.7-.6-.5-1-1.3-1-2.3 0-1.3.6-2.2 1.5-2.7-.3-.3-.5-.8-.5-1.3a2 2 0 0 1 2-2zM8 9l-3-2m0 6l3-1m8-3l3-2m0 6l-3-1',
  crustacean:  'M5 10c0-2 3-4 7-4s7 2 7 4c0 1.5-1 2.5-2.5 3l1.5 4h-3l-1-3h-4l-1 3H6l1.5-4C6 12.5 5 11.5 5 10zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  arachnid:    'M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 6c-1.5 0-3 1-3 3v3c0 1 1 2 3 2s3-1 3-2v-3c0-2-1.5-3-3-3zM8 8l-3-3m-1 7h4m-4 4l3-2m12-6l3-3m1 7h-4m4 4l-3-2',

  // ── Mollusks ──
  mollusk:     'M16 12a6 6 0 0 0-5-5.9c.6-1.2 1-2.1 1-2.1s-2 .5-3.5 2C5.5 8 4 11 6 14s5 4 8 3c1.5-.5 2.5-2 2.5-4-.2-.3-.3-.7-.5-1z',
  squid:       'M12 3c-2.5 0-4.5 2-4.5 5v3c0 1.5 1 3 2.5 3.5l-2 5.5h2l1.5-4h1l1.5 4h2l-2-5.5c1.5-.5 2.5-2 2.5-3.5V8c0-3-2-5-4.5-5zm-1.5 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',

  // ── Echinoderms ──
  echinoderm:  'M12 2l2.5 6.5L21 10l-5 4.5 1.5 7L12 18l-5.5 3.5L8 14.5 3 10l6.5-1.5L12 2z',

  // ── Vertebrates ──
  fish:        'M2 12c3-4 7-6 11-6 2 0 4 1.5 5 3l4-3v6l-4-3c-1 1.5-3 3-5 3-4 0-8-2-11-6zm13-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  amphibian:   'M7 8a5 5 0 0 1 10 0c0 2-1 3-2 4v3c0 1-1 2-3 2s-3-1-3-2v-3c-1-1-2-2-2-4zm3-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  reptile:     'M3 14c1-2 3-3 5-3h2l2-2h3l3 1 3-1 1 2-2 1v2l-2 1-3-1-3 1-2-1H8l-3 2-2-2z',
  bird:        'M3 15c2-4 6-7 10-7h3l5-4-2 5c1 2 1 4 0 6l-4-1-3 3-2-3c-3 0-5 .5-7 1z',
  whale:       'M2 13c1-3 4-5 8-5 3 0 5 1 7 2l3-2v5l-3-1c-1 2-3 3-6 3-5 0-8-1-9-2zm14-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM4 15l-1 3m3-2l-1 2',
  mammal:      'M4 11c0-3 2-5 5-5h1l2-2 2 2h1c3 0 5 2 5 5v2c0 2-1 3-2 3l-1 3h-2l-1-3h-4l-1 3H7l-1-3c-1 0-2-1-2-3v-2zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  rodent:      'M9 5c-1.5 0-3 1.5-3 3.5 0 .8.2 1.5.5 2C5 11 4 12 4 13.5 4 16 6.5 18 9 18h6c2.5 0 5-2 5-4.5 0-1.5-1-2.5-2.5-3 .3-.5.5-1.2.5-2C18 6.5 16.5 5 15 5c-1.2 0-2 .5-3 1.5C11 5.5 10.2 5 9 5zm1 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',

  // ── Primates & hominins ──
  primate:     'M8 6a4 4 0 0 1 8 0c0 1.5-1 3-2 3.5.6.5 1 1.3 1 2.5v4c0 1-1 2-3 2s-3-1-3-2v-4c0-1.2.4-2 1-2.5C9 9 8 7.5 8 6zm2 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  hominin:     'M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-2 7c-1.5 0-2.5 1-2.5 2.5V15l-2 7h3l1.5-5 .5 1.5V22h3v-3.5l.5-1.5L15.5 22h3l-2-7v-3.5C16.5 10 15.5 9 14 9h-4z',

  // ── Abstract / category ──
  animal:      'M4 13c0-4.4 3.6-8 8-8s8 3.6 8 8c0 2-1.5 3-3 3h-2l-1 3h-4l-1-3H7c-1.5 0-3-1-3-3z',
  cell:        'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-2 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z',
  default:     'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10z'
};

// ══════════════════════════════════════════════════════
// getIconGroup — maps node to icon category
// ══════════════════════════════════════════════════════

function getIconGroup(n) {
  const id = n.id;

  const ID_MAP = {
    // ── Origin ──
    'luca': 'cell',

    // ── Bacteria ──
    'bacteria': 'bacteria', 'cyanobacteria': 'bacteria', 'proteobacteria': 'bacteria',
    'firmicutes': 'bacteria', 'actinobacteria': 'bacteria', 'spirochetes': 'bacteria',
    'deinococcus': 'bacteria', 'bacteroides': 'bacteria',
    'prochlorococcus': 'bacteria', 'nostoc': 'bacteria', 'ecoli': 'bacteria',
    'helicobacter': 'bacteria', 'vibrio-cholerae': 'bacteria',
    'lactobacillus': 'bacteria', 'clostridium-botulinum': 'bacteria',
    'streptomyces': 'bacteria', 'mycobacterium-tb': 'bacteria',

    // ── Archaea ──
    'archaea': 'archaea', 'euryarchaeota': 'archaea', 'asgard': 'archaea',
    'halobacterium': 'archaea', 'sulfolobus': 'archaea', 'pyrolobus': 'archaea',
    'lokiarchaeota': 'archaea', 'methanobacterium': 'archaea',

    // ── Eukaryota ──
    'eukaryota': 'cell',

    // ── Protists ──
    'protists': 'microbe', 'alveolates': 'microbe', 'stramenopiles': 'microbe',
    'amoebozoa': 'amoeba',
    'plasmodium': 'parasite', 'phytophthora': 'parasite',
    'paramecium': 'microbe',
    'dinoflagellates': 'algae', 'diatoms': 'algae',
    'amoeba-proteus': 'amoeba', 'volvox': 'algae',

    // ── Fungi ──
    'fungi': 'fungus',
    'ascomycetes': 'fungus', 'basidiomycetes': 'mushroom', 'chytrids': 'fungus',
    'saccharomyces': 'fungus', 'penicillium': 'fungus',
    'amanita-muscaria': 'mushroom', 'psilocybe': 'mushroom',
    'armillaria': 'mushroom', 'batrachochytrium': 'fungus',

    // ── Plants ──
    'plantae': 'plant',
    'bryophytes': 'moss', 'sphagnum': 'moss', 'marchantia': 'moss',
    'ferns': 'fern', 'tree-fern': 'fern', 'azolla': 'fern',
    'gymnosperms': 'conifer', 'sequoia': 'conifer', 'wollemia': 'conifer', 'welwitschia': 'conifer',
    'angiosperms': 'flower',
    'arabidopsis': 'flower', 'rafflesia': 'flower', 'titan-arum': 'flower', 'mimosa-pudica': 'flower',

    // ── Animals ──
    'animalia': 'animal',
    'sponges': 'sponge',
    'cnidarians': 'jellyfish', 'turritopsis': 'jellyfish', 'coral': 'coral',
    'annelids': 'worm',
    'echinoderms': 'echinoderm',
    'invertebrates': 'crustacean',
    'insects': 'insect', 'honey-bee': 'insect',
    'horseshoe-crab': 'arachnid', 'mantis-shrimp': 'crustacean',
    'cephalopods': 'squid', 'octopus': 'squid', 'nautilus': 'mollusk',

    // ── Vertebrates ──
    'vertebrates': 'fish',
    'fish': 'fish', 'coelacanth': 'fish', 'shark': 'fish',
    'amphibians': 'amphibian',
    'reptiles': 'reptile', 'komodo-dragon': 'reptile', 'tuatara': 'reptile',
    'birds': 'bird', 'archaeopteryx': 'bird', 'peregrine-falcon': 'bird',

    // ── Mammals ──
    'mammals': 'mammal',
    'cetaceans': 'whale', 'blue-whale': 'whale',
    'naked-mole-rat': 'rodent', 'platypus': 'mammal',

    // ── Primates ──
    'primates': 'primate', 'great-apes': 'primate',
    'orangutan': 'primate', 'gorilla': 'primate', 'chimpanzee': 'primate',

    // ── Hominins ──
    'homo-sapiens': 'hominin', 'hominini': 'hominin',
  };

  if (ID_MAP[id]) return ID_MAP[id];

  // Hominin species from HOMININS array — map by group
  if (n.group) {
    const HOMININ_GROUP_MAP = {
      'homo': 'hominin',
      'proto': 'primate',
      'australopith': 'primate',
      'paranthropus': 'primate'
    };
    if (HOMININ_GROUP_MAP[n.group]) return HOMININ_GROUP_MAP[n.group];
  }

  // Group nodes (group-homo, group-proto, etc.)
  if (id.startsWith('group-')) return id === 'group-homo' ? 'hominin' : 'primate';

  // Fallback: check ancestry
  let p = n._parent;
  while (p) {
    if (ID_MAP[p.id]) {
      const pg = ID_MAP[p.id];
      if (pg !== 'default' && pg !== 'cell') return pg;
    }
    p = p._parent;
  }
  return 'default';
}
