// ══════════════════════════════════════════════════════
// NODE ICON LIBRARY — Naturalist SVG Silhouettes
// ══════════════════════════════════════════════════════
// Each icon is a filled SVG path designed for a 24×24 viewbox.
// Single-path, no strokes — recognizable at 10–26px rendered size.
// 48 distinct categories (merged from two parallel p20 implementations).

const NODE_ICONS = {
  // ── Bacteria & Archaea ─────────────────────────────
  bacteria:    'M12 4c-1.5 0-3 .8-3 2.5v11c0 1.7 1.5 2.5 3 2.5s3-.8 3-2.5v-11C15 4.8 13.5 4 12 4z',
  spirochete:  'M6 6c2 1 2 3 0 4s-2 3 0 4 2 3 0 4c2 1 2 3 0 4M18 6c-2 1-2 3 0 4s2 3 0 4-2 3 0 4c-2 1-2 3 0 4',
  archaea:     'M12 3l-3 5.5 1.5 3-2.5 4.5L12 21l4-5-2.5-4.5L15 8.5 12 3z',

  // ── Protists ───────────────────────────────────────
  protist:     'M12 5c-2 0-4 2-4.5 4.5-.3 1.5.2 3 1.2 4 1.5 1.5 1 3.5-.2 4.8C7 19.5 9 21 12 21s5-1.5 3.5-2.7c-1.2-1.3-1.7-3.3-.2-4.8 1-1 1.5-2.5 1.2-4C16 7 14 5 12 5z',
  microbe:     'M12 3a3 3 0 0 0-3 3c0 1 .5 2 1.2 2.6L9 11.5c-1.5.5-2.5 2-2.5 3.5 0 2.2 1.8 4 4 4h3c2.2 0 4-1.8 4-4 0-1.5-1-3-2.5-3.5l-1.2-2.9c.7-.6 1.2-1.6 1.2-2.6a3 3 0 0 0-3-3z',
  amoeba:      'M14 4c-2.5-.5-4 1-4.5 3-.3 1.5.5 2.8 1 4-1.5 1-3.5 1.5-4 3.5-.5 2.5 1 4.5 3 5.5 2 .8 4 .2 5.5-1 1 1.5 3 2 4.5 1 2-1.2 2.5-3.5 1.5-5.5-.5-1 .5-2.5 1.5-3.5 1.5-1.5 1-4-.5-5-.5-.5-.5-1.5-1-2-.5-.8-.5-1.5-1-2 0-.8.2-1.5.5-2-.8-.5-1.5-1-2-1.5S11 4.2 14 4z',
  diatom:      'M12 3C8.7 3 6 5.7 6 9v6c0 3.3 2.7 6 6 6s6-2.7 6-6V9c0-3.3-2.7-6-6-6zm0 2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z',
  dinoflagellate: 'M12 3c-3 0-5 3-5 6 0 2 1 3 1 5 0 1.5-.5 3-1 4 1.5 1 3.5 2 5 2s3.5-1 5-2c-.5-1-1-2.5-1-4 0-2 1-3 1-5 0-3-2-6-5-6zm-1 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm3 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
  algae:       'M12 22V14c-3-1-5-4-5-7 0-2 1-4 3-4 1 0 2 1 2 3v1c0-2 1-3 2-3 2 0 3 2 3 4 0 3-2 6-5 7v8z',
  parasite:    'M8 4c-2 1-3 3-2 5l1 2-2 3c-1 2 0 4 2 5l3 1 2 2c1.5 1 3.5.5 4.5-1l1-3 3-1c2-1 2.5-3 1.5-5l-2-2 .5-3c.3-2-1-3.5-3-4l-3 .5-2.5-1.5c-1-.5-2.5-.5-4 1z',

  // ── Fungi ──────────────────────────────────────────
  fungus:      'M12 22v-8m0 0c-5 0-8-3-8-6s3-5 8-5 8 2 8 5-3 6-8 6z',
  mushroom:    'M12 22v-6c0-1-1-2-2-2H9c-3 0-5-2-5-4.5S6 5 9 4c1-.3 2-.5 3-.5s2 .2 3 .5c3 1 5 3 5 5.5S18 14 15 14h-1c-1 0-2 1-2 2v6z',
  yeast:       'M9 6a4 4 0 0 1 6 0c1 1 1.5 3 .5 4.5.8.5 1.5 1.5 1.5 3 0 2-1.5 3.5-3 3.5-.5 1.5-2 2.5-4 2.5-2.5 0-4-2-4-4 0-1.5 1-3 2.5-3.5-.5-1.5-.5-3.5 .5-5.5z',

  // ── Plants ─────────────────────────────────────────
  plant:       'M12 22V12m0 0c0-4-3-7-7-8 1 3 3.5 6 7 8zm0 0c0-4 3-7 7-8-1 3-3.5 6-7 8z',
  moss:        'M7 20v-4c0-1 .5-2 1.5-2.5C8 12 8 10.5 9 9.5c.5-.5 1-1 1.5-.8.5-1.2 1-2 1.5-2.2.5.2 1 1 1.5 2.2.5-.2 1 .3 1.5.8 1 1 1 2.5.5 4C16.5 14 17 15 17 16v4z',
  fern:        'M12 22V8c-1.5-1-3-1.5-5-1 1 1 2 2 3 2.5C8 10 6 10 4 10c1.5 1 3.5 1.5 5 1-.5.5-2 1.5-4 2 2 0 4-.5 5-1v2c-1.5-.5-3.5-.5-5 0 1.5 1 3.5 1 5 .5V22m0-14c1.5-1 3-1.5 5-1-1 1-2 2-3 2.5 2 .5 4 .5 6 .5-1.5 1-3.5 1.5-5 1 .5.5 2 1.5 4 2-2 0-4-.5-5-1v2c1.5-.5 3.5-.5 5 0-1.5 1-3.5 1-5 .5',
  conifer:     'M12 2l-3 5h2l-3 5h2l-4 6h2l-1 4h10l-1-4h2l-4-6h2l-3-5h2l-3-5z',
  flower:      'M12 22v-8m0 0c0 0-4-2-4-5a4 4 0 0 1 8 0c0 3-4 5-4 5zm-3.5-7c-1.5-1-2.5-3-.5-5 1.5 1 2 3 .5 5zm7 0c1.5-1 2.5-3 .5-5-1.5 1-2 3-.5 5z',

  // ── Invertebrates ──────────────────────────────────
  sponge:      'M8 4c-2 1-3 4-3 8s1 7 3 8h8c2-1 3-4 3-8s-1-7-3-8H8zm1 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  cnidarian:   'M12 3c-3 0-6 3-6 7 0 2 1 3 2 3h8c1 0 2-1 2-3 0-4-3-7-6-7zm-4 12l-1 5m2-5v5m2-5l1 5m2-5v5m2-5l1 5',
  jellyfish:   'M7 5c0-1.5 2-3 5-3s5 1.5 5 3c0 3-2 5-3 6-.5 2 0 3 0 5s-.5 4-1 5c-.5-1-1-3-1-5s.5-3 0-5c-1-1-3-3-3-6zM8 11l-2 6m10-6l2 6',
  coral:       'M8 20v-5c-2 0-4-2-4-4 0-1.5 1-3 2.5-3C6 6.5 7 5 9 5c1 0 2 .5 2.5 1.5C12 5.5 13 5 14 5c2 0 3.5 2 3 3.5C18.5 9 20 10.5 20 12c0 2-2 4-4 4v4H8z',
  worm:        'M6 8c0-2 2-3 4-3s3 1 3 3c0 1.5-1 2.5-2 3 1.5.5 3 2 3 4 0 2.5-2 4-4.5 4S5 17.5 5 15c0-2 1.5-3.5 3-4-1-.5-2-1.5-2-3z',
  mollusk:     'M16 12a6 6 0 0 0-5-5.9c.6-1.2 1-2.1 1-2.1s-2 .5-3.5 2C5.5 8 4 11 6 14s5 4 8 3c1.5-.5 2.5-2 2.5-4-.2-.3-.3-.7-.5-1z',
  octopus:     'M12 4a5 5 0 0 0-5 5c0 2 1 3.5 2.5 4.5L8 20l2-4c.6.3 1.3.5 2 .5s1.4-.2 2-.5l2 4-1.5-6.5C16 12.5 17 11 17 9a5 5 0 0 0-5-5zm-2 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  squid:       'M12 3c-2.5 0-4.5 2-4.5 5v3c0 1.5 1 3 2.5 3.5l-2 5.5h2l1.5-4h1l1.5 4h2l-2-5.5c1.5-.5 2.5-2 2.5-3.5V8c0-3-2-5-4.5-5zm-1.5 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  echinoderm:  'M12 2l2.5 6.5L21 10l-5 4.5 1.5 7L12 18l-5.5 3.5L8 14.5 3 10l6.5-1.5L12 2z',

  // ── Arthropods ─────────────────────────────────────
  insect:      'M12 4a2 2 0 0 1 2 2c0 .5-.2 1-.5 1.3.9.5 1.5 1.4 1.5 2.7 0 1-.4 1.8-1 2.3.6.7 1 1.6 1 2.7 0 2-1.3 3-3 3s-3-1-3-3c0-1.1.4-2 1-2.7-.6-.5-1-1.3-1-2.3 0-1.3.6-2.2 1.5-2.7-.3-.3-.5-.8-.5-1.3a2 2 0 0 1 2-2zM8 9l-3-2m0 6l3-1m8-3l3-2m0 6l-3-1',
  butterfly:   'M12 4v16m0-12c-2-2-5-3-7-1s-1 5 1 7c1 1 3 2 5 1m1-7c2-2 5-3 7-1s1 5-1 7c-1 1-3 2-5 1',
  spider:      'M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 6a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5zM8 10l-4-3m0 8l4-2m8-3l4-3m0 8l-4-2M8 14l-5 2m11 0l5 2M9 9L6 5m9 4l3-4',
  arachnid:    'M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 6c-1.5 0-3 1-3 3v3c0 1 1 2 3 2s3-1 3-2v-3c0-2-1.5-3-3-3zM8 8l-3-3m-1 7h4m-4 4l3-2m12-6l3-3m1 7h-4m4 4l-3-2',
  crustacean:  'M5 10c0-2 3-4 7-4s7 2 7 4c0 1.5-1 2.5-2.5 3l1.5 4h-3l-1-3h-4l-1 3H6l1.5-4C6 12.5 5 11.5 5 10zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',

  // ── Fish & Aquatic Vertebrates ─────────────────────
  fish:        'M2 12c3-4 7-6 11-6 2 0 4 1.5 5 3l4-3v6l-4-3c-1 1.5-3 3-5 3-4 0-8-2-11-6zm13-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  shark:       'M3 13c2-3 6-5 10-5l2-4 1 4c2 1 4 2 5 4H3zm10-2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM8 14l-2 4h3l1-3m5 3h3l-2-4',
  whale:       'M2 12c2-3 5-5 9-5 3 0 5 1 7 2l3-2v3c1 1 1 2 0 3v3l-3-2c-2 1-4 2-7 2-4 0-7-2-9-5zm6-1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',

  // ── Amphibians & Reptiles ──────────────────────────
  amphibian:   'M7 8a5 5 0 0 1 10 0c0 2-1 3-2 4v3c0 1-1 2-3 2s-3-1-3-2v-3c-1-1-2-2-2-4zm3-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  reptile:     'M3 14c1-2 3-3 5-3h2l2-2h3l3 1 3-1 1 2-2 1v2l-2 1-3-1-3 1-2-1H8l-3 2-2-2z',
  turtle:      'M7 11c0-3 2.2-5 5-5s5 2 5 5c0 2.5-2 4.5-5 4.5S7 13.5 7 11zm-3 1h3m14 0h-3m-8 4l-1 3m7-3l1 3m-5-13V3',
  dinosaur:    'M6 18l1-4c-1-1-2-2.5-2-4 0-3 2-5.5 5-6l1-2h3l-1 2c2 .5 3.5 2 4 4h2l3 2-2 1v3l2 2h-3l-2-2-3 1-2 3z',

  // ── Birds ──────────────────────────────────────────
  bird:        'M3 15c2-4 6-7 10-7h3l5-4-2 5c1 2 1 4 0 6l-4-1-3 3-2-3c-3 0-5 .5-7 1z',

  // ── Mammals ────────────────────────────────────────
  mammal:      'M4 11c0-3 2-5 5-5h1l2-2 2 2h1c3 0 5 2 5 5v2c0 2-1 3-2 3l-1 3h-2l-1-3h-4l-1 3H7l-1-3c-1 0-2-1-2-3v-2zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  rodent:      'M8 7c0-2 1.5-3 4-3s4 1 4 3c0 1-1 2-2 2.5.5.5 1 1.5 1 3v4c0 1.5-1 3-3 3s-3-1.5-3-3v-4c0-1.5.5-2.5 1-3-1-.5-2-1.5-2-2.5zm2 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM9 4L7 2m6 2l2-2',
  bat:         'M12 6a2 2 0 0 0-2 2c0 .5.2 1 .5 1.5-2 .5-4 2-5.5 4L3 12l2 2c.5 1.5 1.5 2.5 3 3l-1 2h2l1.5-2c.5.1 1 .2 1.5.2s1-.1 1.5-.2L15 19h2l-1-2c1.5-.5 2.5-1.5 3-3l2-2-2-1.5c-1.5-2-3.5-3.5-5.5-4 .3-.5.5-1 .5-1.5a2 2 0 0 0-2-2z',

  // ── Primates & Hominins ────────────────────────────
  primate:     'M8 6a4 4 0 0 1 8 0c0 1.5-1 3-2 3.5.6.5 1 1.3 1 2.5v4c0 1-1 2-3 2s-3-1-3-2v-4c0-1.2.4-2 1-2.5C9 9 8 7.5 8 6zm2 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  hominin:     'M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-2 7c-1.5 0-2.5 1-2.5 2.5V15l-2 7h3l1.5-5 .5 1.5V22h3v-3.5l.5-1.5L15.5 22h3l-2-7v-3.5C16.5 10 15.5 9 14 9h-4z',

  // ── Abstract / category ────────────────────────────
  animal:      'M4 13c0-4.4 3.6-8 8-8s8 3.6 8 8c0 2-1.5 3-3 3h-2l-1 3h-4l-1-3H7c-1.5 0-3-1-3-3z',
  cell:        'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-2 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z',

  // ── Catch-all ──────────────────────────────────────
  default:     'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10z'
};

// ══════════════════════════════════════════════════════
// NODE → ICON CATEGORY MAPPING
// ══════════════════════════════════════════════════════
// Maps every node ID in the TREE to the best matching icon category.
// Falls back through ancestry walk if no direct match is found.

function getIconGroup(n) {
  var id = n.id;

  // ── Direct ID → icon mappings ──────────────────────
  var ID_MAP = {
    // Root
    'luca': 'cell',

    // Bacteria
    'bacteria': 'bacteria', 'cyanobacteria': 'bacteria', 'proteobacteria': 'bacteria',
    'firmicutes': 'bacteria', 'actinobacteria': 'bacteria',
    'spirochetes': 'spirochete', 'deinococcus': 'bacteria', 'bacteroides': 'bacteria',
    'prochlorococcus': 'bacteria', 'nostoc': 'bacteria', 'ecoli': 'bacteria',
    'helicobacter': 'bacteria', 'vibrio-cholerae': 'bacteria',
    'lactobacillus': 'bacteria', 'clostridium-botulinum': 'bacteria',
    'streptomyces': 'bacteria', 'mycobacterium-tb': 'bacteria',

    // Archaea
    'archaea': 'archaea', 'euryarchaeota': 'archaea', 'asgard': 'archaea',
    'halobacterium': 'archaea', 'sulfolobus': 'archaea', 'pyrolobus': 'archaea',
    'lokiarchaeota': 'archaea', 'methanobacterium': 'archaea',

    // Eukaryota root
    'eukaryota': 'cell',

    // Protists
    'protists': 'protist', 'alveolates': 'protist', 'stramenopiles': 'protist',
    'amoebozoa': 'amoeba',
    'plasmodium': 'parasite', 'paramecium': 'protist',
    'dinoflagellates': 'dinoflagellate',
    'diatoms': 'diatom', 'phytophthora': 'parasite',
    'amoeba-proteus': 'amoeba', 'volvox': 'algae',

    // Fungi
    'fungi': 'fungus', 'ascomycetes': 'fungus', 'chytrids': 'fungus',
    'basidiomycetes': 'mushroom',
    'saccharomyces': 'yeast', 'penicillium': 'fungus',
    'amanita-muscaria': 'mushroom', 'armillaria': 'mushroom', 'psilocybe': 'mushroom',
    'batrachochytrium': 'fungus',

    // Plants
    'plantae': 'plant',
    'bryophytes': 'moss', 'sphagnum': 'moss', 'marchantia': 'moss',
    'ferns': 'fern', 'tree-fern': 'fern', 'azolla': 'fern',
    'gymnosperms': 'conifer', 'wollemia': 'conifer', 'welwitschia': 'conifer', 'sequoia': 'conifer',
    'angiosperms': 'flower', 'arabidopsis': 'flower', 'rafflesia': 'flower',
    'titan-arum': 'flower', 'mimosa-pudica': 'flower',

    // Animals — top level
    'animalia': 'animal',

    // Sponges
    'sponges': 'sponge',

    // Cnidarians
    'cnidarians': 'cnidarian', 'turritopsis': 'jellyfish', 'coral': 'coral',

    // Invertebrates
    'invertebrates': 'crustacean',
    'echinoderms': 'echinoderm', 'annelids': 'worm',
    'platyhelminthes': 'worm', 'planarian': 'worm',
    'tardigrada': 'microbe', 'tardigrade': 'microbe',

    // Arthropods
    'arthropoda': 'crustacean',
    'insects': 'insect',
    'horseshoe-crab': 'arachnid', 'mantis-shrimp': 'crustacean',
    'honey-bee': 'butterfly',

    // Mollusks / Cephalopods
    'mollusca': 'mollusk',
    'cephalopods': 'octopus', 'octopus': 'octopus', 'nautilus': 'mollusk',

    // Chordates & Fish classes
    'chordata': 'fish', 'vertebrates': 'fish',
    'sarcopterygii': 'fish', 'chondrichthyes': 'shark', 'actinopterygii': 'fish',
    'fish': 'fish', 'coelacanth': 'fish', 'shark': 'shark',

    // Reptiles & Dinosaurs
    'reptiles': 'reptile',
    'komodo-dragon': 'reptile', 'tuatara': 'turtle',

    // Birds
    'birds': 'bird', 'archaeopteryx': 'dinosaur', 'peregrine-falcon': 'bird',

    // Amphibians
    'amphibians': 'amphibian',

    // Mammals
    'mammals': 'mammal',
    'cetaceans': 'whale', 'blue-whale': 'whale',
    'naked-mole-rat': 'rodent',
    'platypus': 'mammal',

    // Primates
    'primates': 'primate', 'great-apes': 'primate',
    'orangutan': 'primate', 'gorilla': 'primate', 'chimpanzee': 'primate',

    // Hominins
    'homo-sapiens': 'hominin', 'hominini': 'hominin'
  };

  if (ID_MAP[id]) return ID_MAP[id];

  // Hominin species from HOMININS array — map by group
  if (n.group) {
    var HOMININ_GROUP_MAP = {
      'homo': 'hominin',
      'proto': 'primate',
      'australopith': 'primate',
      'paranthropus': 'primate'
    };
    if (HOMININ_GROUP_MAP[n.group]) return HOMININ_GROUP_MAP[n.group];
  }

  // Group nodes (group-homo, group-proto, etc.)
  if (id.startsWith('group-')) return id === 'group-homo' ? 'hominin' : 'primate';

  // Fallback: walk ancestry chain
  var p = n._parent;
  while (p) {
    if (ID_MAP[p.id]) {
      var pg = ID_MAP[p.id];
      if (pg !== 'default' && pg !== 'cell') return pg;
    }
    p = p._parent;
  }
  return 'default';
}
