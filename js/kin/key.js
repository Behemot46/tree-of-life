// ══════════════════════════════════════════════════════
// KIN — READING THE ANSWER KEY
//
// The tree in js/kin/tree.js, indexed once, and the few questions every
// other module asks of it: where do two creatures meet, how old is that
// meeting point, and is a question's answer really true. Pure and
// dependency-light on purpose — the page, the unit tests and the build
// script (scripts/kin-build.mjs) all read the key through this module.
// ══════════════════════════════════════════════════════

import { TREE } from './tree.js';
import { NODE_DATES } from './dates.js';

const PARENT = new Map();      // leaf or node id → parent node
const NODES = new Map();       // internal node id → node
const LEAVES = [];
(function index(node, parent) {
  NODES.set(node.id, node);
  if (parent) PARENT.set(node.id, parent);
  for (const kid of node.kids) {
    if (typeof kid === 'string') { PARENT.set(kid, node); LEAVES.push(kid); }
    else index(kid, node);
  }
})(TREE, null);

export const LEAF_IDS = LEAVES.slice();
export const NODE_IDS = [...NODES.keys()];
export const hasNode = (id) => NODES.has(id);

/** Internal nodes above a leaf or node, nearest first, root last. */
export function lineage(id) {
  const out = [];
  for (let p = PARENT.get(id); p; p = PARENT.get(p.id)) out.push(p);
  return out;
}

/** The node where two lineages meet. */
export function mrca(a, b) {
  const other = new Set(lineage(b).map(n => n.id));
  return lineage(a).find(n => other.has(n.id)) || null;
}

export function isProperAncestor(anc, node) {
  for (let p = PARENT.get(node.id); p; p = PARENT.get(p.id)) if (p.id === anc.id) return true;
  return false;
}

export function dateOf(nodeId) {
  return (nodeId && NODE_DATES[nodeId]) || null;
}

/**
 * Everything the reveal needs about a question, derived from the tree.
 * `valid` is the answer key: the target meets its nearer relative strictly
 * inside the node where it meets the farther one. `dated` is true only when
 * both meeting points have a sourced age and they are in the right order;
 * otherwise the reveal shows the branching without numbers.
 */
export function resolve(q) {
  const nearNode = mrca(q.t, q.near);
  const farNode = mrca(q.t, q.far);
  const valid = !!(nearNode && farNode && nearNode.id !== farNode.id && isProperAncestor(farNode, nearNode));
  const dNear = dateOf(nearNode && nearNode.id);
  const dFar = dateOf(farNode && farNode.id);
  const dated = !!(valid && dNear && dFar && dNear.mya < dFar.mya);
  return { ...q, nearNode: nearNode && nearNode.id, farNode: farNode && farNode.id, valid, dNear, dFar, dated };
}

/**
 * The margin rule for questions nobody wrote by hand: the far split must be
 * at least 15% older than the near one. Published ages carry error bars of
 * that order, and two splits closer together than that make an answer whose
 * numbers read as a coin toss even though the branching is certain.
 */
export const MARGIN = 1.15;
export function clearMargin(r) {
  return !!(r.dated && r.dFar.mya >= MARGIN * r.dNear.mya);
}
