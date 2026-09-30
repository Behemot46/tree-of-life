// ══════════════════════════════════════════════════════
// Layouts over the real tree. Every concept draws the site's own TREE —
// the same nodes, colours and dates the map shows — never a decorative fan.
// ══════════════════════════════════════════════════════

import { parseColor } from './common.js';

export function leafCount(n) {
  if (!n.children || !n.children.length) return 1;
  return n.children.reduce((s, c) => s + leafCount(c), 0);
}

/** A pruned copy of the tree: `depth` generations below the root, at most
    `maxKids` children per node, widest first. Returns the root; `all` on it
    lists the nodes breadth-first. */
export function prune(src, { depth = 3, maxKids = 5, keep } = {}) {
  const root = { src, id: src.id, name: src.name, depth: 0, children: [], parent: null };
  const all = [root];
  const queue = [root];
  while (queue.length) {
    const n = queue.shift();
    if (n.depth >= depth) continue;
    let kids = (n.src.children || []).slice().sort((a, b) => leafCount(b) - leafCount(a));
    if (keep) kids = kids.filter(keep);
    for (const k of kids.slice(0, maxKids)) {
      const c = { src: k, id: k.id, name: k.name, depth: n.depth + 1, parent: n, children: [] };
      n.children.push(c); all.push(c); queue.push(c);
    }
  }
  for (const n of all) {
    n.rgb = parseColor(n.src.color);
    n.appeared = n.src.appeared;
    n.extinct = !!n.src.extinct;
  }
  root.all = all;
  return root;
}

/** Leaves share out an arc; each parent sits at the mean of its children, so
    the picture is the tree's own topology. `gap` (radians) is left empty at the
    bottom, which is where the words go. */
export function assignAngles(root, gap) {
  const leaves = root.all.filter((n) => !n.children.length).length;
  const span = Math.PI * 2 - gap;
  const start = Math.PI / 2 + gap / 2;
  let cursor = 0;
  (function walk(n) {
    if (!n.children.length) { n.angle = start + ((cursor++ + 0.5) / leaves) * span; return; }
    n.children.forEach(walk);
    n.angle = n.children.reduce((s, c) => s + c.angle, 0) / n.children.length;
  })(root);
  return root;
}

/** The composition the current opening uses, so a concept can be swapped in
    without moving the words: the figure sits high, the title in the wedge
    below it. */
export function frame(W, H, { rFrac = 0.46, hFrac = 0.40, below = 0.80, foot = 0.34 } = {}) {
  const R = Math.min(W * rFrac, H * hFrac);
  const block = R + R * below + R * foot;
  const cy = R + Math.max(12, (H - block) / 2);
  return { cx: W / 2, cy, R, anchor: cy + R * below, foot: R * foot };
}

/** The smallest piece of the real tree that contains the given species: their
    ancestors and nothing else, with single-child links collapsed so every
    remaining node is a real branching. This is how a picture of thirty familiar
    creatures can still be the tree's own topology. Nodes have the same shape
    as prune()'s, plus `depth` counted in branchings. */
export function spanTree(src, ids) {
  const want = new Set(ids);
  function build(n) {
    const kids = (n.children || []).map(build).filter(Boolean);
    if (!want.has(n.id) && !kids.length) return null;
    return { src: n, kids };
  }
  let top = build(src);
  const collapse = (b) => {
    b.kids = b.kids.map(collapse);
    // a link with one child and no species of its own is not a branching
    if (b.kids.length === 1 && !want.has(b.src.id) && b.src !== src) return b.kids[0];
    return b;
  };
  top = collapse(top);
  const all = [];
  (function mk(b, parent, depth) {
    const n = { src: b.src, id: b.src.id, name: b.src.name, depth, parent, children: [] };
    all.push(n);
    if (parent) parent.children.push(n);
    b.kids.forEach((k) => mk(k, n, depth + 1));
    b.node = n;
  })(top, null, 0);
  const root = all[0];
  for (const n of all) { n.rgb = parseColor(n.src.color); n.appeared = n.src.appeared; n.extinct = !!n.src.extinct; }
  root.all = all;
  root.maxDepth = Math.max(...all.map((n) => n.depth));
  return root;
}
