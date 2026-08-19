// ══════════════════════════════════════════════════════
// TAXON RANK — what rank a node is, and how deep it runs
// ══════════════════════════════════════════════════════
//
// Two facts the drill-down rows want and nothing else computed: the node's own
// taxonomic rank, and the number of levels below it.
//
// The rank comes from the `latin` field, which is the same boundary the
// translation policy already uses: a ranked group carries a rank prefix
// ("Class Mammalia"), a species carries a binomial ("Panthera leo").
//
// **Only an explicit prefix counts.** Inferring "looks like a binomial, so it
// is a species" is wrong on this data and quietly so: `invertebrates` carries
// "Multiple phyla" and `gymnosperms` carries "Various families" — two words,
// capital then lower, indistinguishable from Panthera leo by shape. Those
// three nodes would have been labelled Species on a page whose whole subject
// is that they are not. A node with no recognised prefix simply has no rank
// here, which is the honest answer and costs a row nothing.
//
// Depth is the plain thing: how many levels of children hang below. It is
// memoised on the node because the tree is fixed once expandTree() has run and
// renderExplore() asks for it again on every row of every repaint.

/* Sub- and super- ranks fold into their parent rank unless the tree actually
   distinguishes them. It distinguishes three: Superphylum (4 nodes),
   Subphylum (1: Vertebrata under Chordata) and Division (4 plant divisions),
   and collapsing those would print "Phylum" on a row whose own Latin says
   otherwise. The rest are absent from the data and fold, so that adding one
   later names something rather than nothing. */
const RANKS = {
  domain: 'domain',
  kingdom: 'kingdom', subkingdom: 'kingdom',
  superphylum: 'superphylum', phylum: 'phylum', subphylum: 'subphylum',
  division: 'division',
  superclass: 'class', class: 'class', subclass: 'class',
  superorder: 'order', order: 'order', suborder: 'order',
  superfamily: 'family', family: 'family', subfamily: 'family',
  genus: 'genus',
};

/* The i18n key for a node's rank, or null when it carries no rank prefix.
   Callers pass the result straight to t(), so the key namespace is part of
   this module's contract: `rank_<key>` in TRANSLATIONS. */
export function rankKey(node) {
  if (!node || !node.latin) return null;
  const first = String(node.latin).trim().split(/\s+/)[0].toLowerCase();
  return RANKS[first] ? 'rank_' + RANKS[first] : null;
}

/* Levels of children below this node. A leaf is 0; a group whose children are
   all leaves is 1. Memoised — the tree does not change after expandTree(), and
   the alternative is walking LUCA's 305 descendants once per repaint. */
export function subtreeDepth(node) {
  if (!node) return 0;
  if (node._subtreeDepth !== undefined) return node._subtreeDepth;
  const kids = node.children || [];
  let d = 0;
  for (const c of kids) d = Math.max(d, subtreeDepth(c));
  node._subtreeDepth = kids.length ? d + 1 : 0;
  return node._subtreeDepth;
}

/* Every descendant below this node, not just the direct children. The
   drill-down draws the line into a branch at a thickness taken from this: a
   real tree's limbs taper as they divide, and that taper is the one cue that
   says "a great deal of life is down there" without printing a number.
   Mammals and Chondrichthyes are both one row, and only one of them leads to
   forty-three more.

   Memoised for the same reason as the depth — the tree is fixed once
   expandTree() has run, and renderExplore() asks again on every repaint. */
export function subtreeSize(node) {
  if (!node) return 0;
  if (node._subtreeSize !== undefined) return node._subtreeSize;
  let n = 0;
  for (const c of node.children || []) n += 1 + subtreeSize(c);
  node._subtreeSize = n;
  return n;
}
