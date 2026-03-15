// ══════════════════════════════════════════════════════
// DNA SIMILARITY CALCULATOR — data + estimation engine
// ══════════════════════════════════════════════════════

/**
 * Known DNA similarity percentages from published research.
 * Key: sorted "idA|idB" (using actual nodeMap IDs), value: { percent, source, note? }
 * Note: h_sapiens is the runtime ID for Homo sapiens (built by buildHomininTree)
 */
const DNA_KNOWN = {
  // Great apes
  'chimpanzee|h_sapiens':       { percent: 98.8, source: 'Nature 2005', note: 'Our closest living relative' },
  'gorilla|h_sapiens':          { percent: 98.4, source: 'Nature 2012' },
  'h_sapiens|orangutan':        { percent: 96.9, source: 'Nature 2011' },
  // Primates (group)
  'h_sapiens|primates':         { percent: 93.0, source: 'Estimated' },
  // Mammals (group)
  'h_sapiens|mammals':          { percent: 85.0, source: 'Estimated' },
  'h_sapiens|naked-mole-rat':   { percent: 85.0, source: 'Nature 2011' },
  'h_sapiens|platypus':         { percent: 69.0, source: 'Nature 2008' },
  'blue-whale|h_sapiens':       { percent: 85.0, source: 'Estimated' },
  'cetaceans|h_sapiens':        { percent: 85.0, source: 'Estimated' },
  // Birds / reptiles
  'birds|h_sapiens':            { percent: 60.0, source: 'Nature 2004' },
  'h_sapiens|reptiles':         { percent: 55.0, source: 'Estimated' },
  'h_sapiens|tuatara':          { percent: 55.0, source: 'Nature 2020' },
  'h_sapiens|komodo-dragon':    { percent: 55.0, source: 'Estimated' },
  // Fish
  'fish|h_sapiens':             { percent: 70.0, source: 'Nature 2013' },
  'h_sapiens|shark':            { percent: 60.0, source: 'Estimated' },
  'coelacanth|h_sapiens':       { percent: 62.0, source: 'Nature 2013' },
  // Amphibians
  'amphibians|h_sapiens':       { percent: 63.0, source: 'Estimated' },
  // Invertebrates
  'h_sapiens|octopus':          { percent: 33.0, source: 'Nature 2015' },
  'h_sapiens|honey-bee':        { percent: 44.0, source: 'Nature 2006' },
  'h_sapiens|insects':          { percent: 44.0, source: 'Estimated' },
  'coral|h_sapiens':            { percent: 25.0, source: 'Estimated' },
  'h_sapiens|invertebrates':    { percent: 40.0, source: 'Estimated' },
  // Fungi
  'fungi|h_sapiens':            { percent: 30.0, source: 'Estimated', note: 'Animals and fungi are closer relatives than either is to plants' },
  'h_sapiens|saccharomyces':    { percent: 31.0, source: 'Nature 1997', note: "Baker's yeast" },
  'h_sapiens|penicillium':      { percent: 29.0, source: 'Estimated' },
  // Plants
  'arabidopsis|h_sapiens':      { percent: 18.0, source: 'Nature 2000' },
  'h_sapiens|plantae':          { percent: 60.0, source: 'Popular estimate', note: 'Humans share ~60% of genes with plants!' },
  'angiosperms|h_sapiens':      { percent: 60.0, source: 'Popular estimate' },
  // Bacteria
  'ecoli|h_sapiens':            { percent: 18.0, source: 'Estimated' },
  'bacteria|h_sapiens':         { percent: 18.0, source: 'Estimated' },
  'cyanobacteria|h_sapiens':    { percent: 17.0, source: 'Estimated' },
  // Cross-domain
  'archaea|h_sapiens':          { percent: 20.0, source: 'Estimated' },
  // Within same groups (non-human pairs)
  'chimpanzee|gorilla':         { percent: 97.7, source: 'Nature 2012' },
  'gorilla|orangutan':          { percent: 96.5, source: 'Nature 2012' },
  'ecoli|cyanobacteria':        { percent: 40.0, source: 'Estimated' },
  'neanderthal|h_sapiens':      { percent: 99.7, source: 'Science 2010', note: 'So close that interbreeding occurred' },
};

/**
 * Estimate DNA similarity from divergence time (Mya).
 * Uses a piecewise linear decay model.
 * This is educational, not scientifically precise.
 */
function estimateFromDivergence(mya) {
  if (mya <= 0) return 100;
  if (mya <= 1) return 99.9;
  if (mya <= 7) return 99.5 - (mya / 7) * 1.0;
  if (mya <= 15) return 98.5 - ((mya - 7) / 8) * 1.5;
  if (mya <= 25) return 97.0 - ((mya - 15) / 10) * 3;
  if (mya <= 85) return 94.0 - ((mya - 25) / 60) * 9;
  if (mya <= 200) return 85.0 - ((mya - 85) / 115) * 20;
  if (mya <= 500) return 65.0 - ((mya - 200) / 300) * 25;
  if (mya <= 1000) return 40.0 - ((mya - 500) / 500) * 15;
  if (mya <= 2000) return 25.0 - ((mya - 1000) / 1000) * 8;
  return Math.max(10, 17.0 - ((mya - 2000) / 2000) * 5);
}

/**
 * Find Lowest Common Ancestor of two nodes.
 * Walks _parent chains to find the shared ancestor.
 */
function findLCA(nodeA, nodeB) {
  if (!nodeA || !nodeB) return null;
  const ancestorsA = new Set();
  let cur = nodeA;
  while (cur) {
    ancestorsA.add(cur.id);
    cur = cur._parent;
  }
  cur = nodeB;
  while (cur) {
    if (ancestorsA.has(cur.id)) return cur;
    cur = cur._parent;
  }
  return null;
}

/**
 * Main estimation function.
 * Returns { percent, divergenceMya, method, source?, note?, lca? }
 */
function estimateDnaSimilarity(nodeA, nodeB) {
  if (!nodeA || !nodeB) return null;
  if (nodeA.id === nodeB.id) {
    return { percent: 100, divergenceMya: 0, method: 'identical', note: 'Same species!', lca: nodeA };
  }

  // Check known lookup (sorted key)
  const ids = [nodeA.id, nodeB.id].sort();
  const key = ids[0] + '|' + ids[1];
  const known = DNA_KNOWN[key];

  // Find LCA for divergence time
  const lca = findLCA(nodeA, nodeB);
  const divergenceMya = lca ? lca.appeared : null;

  if (known) {
    return {
      percent: known.percent,
      divergenceMya: divergenceMya,
      method: 'known',
      source: known.source,
      note: known.note || null,
      lca: lca
    };
  }

  // Estimate from phylogenetic distance
  const estimated = divergenceMya != null ? estimateFromDivergence(divergenceMya) : 50;
  return {
    percent: Math.round(estimated * 10) / 10,
    divergenceMya: divergenceMya,
    method: 'estimated',
    source: null,
    note: null,
    lca: lca
  };
}

/**
 * Fun facts keyed by similarity threshold (show fact if percent >= threshold).
 */
const DNA_FUN_FACTS = [
  { threshold: 99,  text: 'Closer than many dog breeds are to each other!' },
  { threshold: 97,  text: 'You share more DNA with {b} than a horse shares with a zebra.' },
  { threshold: 90,  text: 'Despite looking very different, most of your genetic code is shared.' },
  { threshold: 70,  text: 'The core "operating system" of life is remarkably conserved.' },
  { threshold: 60,  text: 'Fun fact: you share about 60% of your genes with a banana!' },
  { threshold: 40,  text: 'Billions of years apart, yet sharing the fundamental code of life.' },
  { threshold: 25,  text: 'Core cellular machinery — ribosomes, DNA repair — is ancient and shared.' },
  { threshold: 0,   text: 'All life on Earth shares a common ancestor ~3.8 billion years ago.' },
];

function getDnaFunFact(percent, speciesName) {
  for (const fact of DNA_FUN_FACTS) {
    if (percent >= fact.threshold) {
      return fact.text.replace('{b}', speciesName || 'this species');
    }
  }
  return DNA_FUN_FACTS[DNA_FUN_FACTS.length - 1].text;
}
