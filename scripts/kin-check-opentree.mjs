#!/usr/bin/env node
// Check Kin's answer key against Open Tree of Life.
//
// js/kin/tree.js is curated by hand, and a hand-curated tree is exactly how
// the site ended up filing a lobster under Insects. This script asks Open
// Tree of Life (CC0) for the tree connecting a representative species of
// every creature, then replays every question against it: the target must
// meet its nearer relative strictly inside the node where it meets the
// farther one — in Open Tree's tree as well as in ours.
//
// It needs the network, so it is a manual check rather than part of CI:
//
//   NODE_USE_ENV_PROXY=1 node scripts/kin-check-opentree.mjs   # behind a proxy
//   node scripts/kin-check-opentree.mjs
//
// Two passes. Every question — hand-written and generated — is replayed.
// Then every relationship the key states is checked, question or not: for
// any three creatures where ours says two meet before either meets the
// third, Open Tree must agree or be unresolved. That second pass is what
// covers questions the generator has not written yet.
//
// Exit code 1 when anything disagrees with Open Tree. What Open Tree cannot
// decide (its tree is unresolved there, or a species is missing) is reported
// but does not fail the run.

import { ALL_QUESTIONS } from '../js/kin/engine.js';
import { LEAF_IDS, mrca as keyMrca, lineage } from '../js/kin/key.js';
import { SPECIES } from '../js/kin/creatures.js';

const API = 'https://api.opentreeoflife.org/v3';

async function post(route, body) {
  const res = await fetch(`${API}/${route}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok) throw new Error(`${route}: HTTP ${res.status} ${text.slice(0, 300)}`);
  return json;
}

/* Newick → parent pointers. Leaves are labelled "ott<id>", internal nodes
   get synthetic ids; branch lengths and quoting do not occur in this API's
   id-labelled output, but are skipped defensively. */
function parseNewick(s) {
  const parent = new Map();
  const stack = [];
  let current = null, counter = 0, i = 0;
  const newNode = () => `n${counter++}`;
  const root = newNode();
  current = root;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '(') { const child = newNode(); parent.set(child, current); stack.push(current); current = child; i++; }
    else if (ch === ',') { const sib = newNode(); parent.set(sib, stack[stack.length - 1]); current = sib; i++; }
    else if (ch === ')') { current = stack.pop(); i++; }
    else if (ch === ';') break;
    else {
      let j = i; while (j < s.length && !',();'.includes(s[j])) j++;
      const label = s.slice(i, j).split(':')[0].replace(/'/g, '');
      if (label) {
        // Rename the synthetic node to its label so leaves can be found by ott id.
        const old = current;
        parent.set(label, parent.get(old));
        for (const [k, v] of parent) if (v === old) parent.set(k, label);
        parent.delete(old);
        current = label;
      }
      i = j;
    }
  }
  return parent;
}

function ancestors(parent, id) {
  const out = [];
  for (let p = parent.get(id); p; p = parent.get(p)) out.push(p);
  return out;
}
function mrca(parent, a, b) {
  const set = new Set(ancestors(parent, b));
  return ancestors(parent, a).find(x => set.has(x)) || null;
}

const names = Object.values(SPECIES);
const tnrs = await post('tnrs/match_names', { names, do_approximate_matching: false });
const ott = {};
const taxonomyOnly = new Set();
for (const r of tnrs.results) {
  const m = r.matches && r.matches[0];
  if (!m) continue;
  ott[r.name] = m.taxon.ott_id;
  /* "incertae_sedis" is Open Tree saying it could not place a taxon from
     phylogenies and grafted it by taxonomy instead. Its "extinct" flag is not
     usable for this: it is set on Homo sapiens. */
  if ((m.taxon.flags || []).includes('incertae_sedis')) taxonomyOnly.add(r.name);
}
const missing = names.filter(n => !ott[n]);
if (missing.length) console.log('No Open Tree match for:', missing.join(', '));

let ids = [...new Set(Object.values(ott))];
let tree;
for (let attempt = 0; attempt < 3; attempt++) {
  try {
    tree = await post('tree_of_life/induced_subtree', { ott_ids: ids, label_format: 'id' });
    break;
  } catch (e) {
    /* Taxa that are not in the synthetic tree (extinct, or "broken" by
       conflicting sources) make the whole request fail; drop them and retry. */
    const bad = [...String(e.message).matchAll(/ott(\d+)/g)].map(m => Number(m[1]));
    if (!bad.length) throw e;
    console.log('Not in the synthetic tree, skipped:', bad.map(b => Object.keys(ott).find(k => ott[k] === b) || b).join(', '));
    ids = ids.filter(x => !bad.includes(x));
  }
}
const parent = parseNewick(tree.newick);
const leafOf = (creature) => {
  const o = ott[SPECIES[creature]];
  return o && parent.has(`ott${o}`) ? `ott${o}` : null;
};

let disagree = 0, undecided = 0, agree = 0;
for (const q of ALL_QUESTIONS) {
  /* Open Tree grafts T. rex and the mammoth onto its tree by taxonomy alone,
     and that taxonomy keeps birds out of Theropoda, so it puts a chicken
     nearer a crocodile than T. rex. Those questions are checked against the
     fossil literature by hand instead. */
  const grafted = [q.t, q.near, q.far].find(c => taxonomyOnly.has(SPECIES[c]));
  if (grafted) { undecided++; console.log(`?  ${q.id}: Open Tree places ${grafted} by taxonomy only, not from phylogenies`); continue; }
  const [t, a, b] = [leafOf(q.t), leafOf(q.near), leafOf(q.far)];
  if (!t || !a || !b) { undecided++; console.log(`?  ${q.id}: a species is missing from Open Tree's tree`); continue; }
  const near = mrca(parent, t, a), far = mrca(parent, t, b);
  const strictlyInside = near && far && near !== far && ancestors(parent, near).includes(far);
  if (strictlyInside) { agree++; continue; }
  if (near === far) { undecided++; console.log(`?  ${q.id}: Open Tree leaves ${q.t}, ${q.near} and ${q.far} unresolved`); continue; }
  disagree++;
  console.log(`✗  ${q.id}: Open Tree puts ${q.t} closer to ${q.far} than to ${q.near}`);
}
console.log(`\nQuestions: Open Tree agrees with ${agree} of ${ALL_QUESTIONS.length}; ${undecided} undecided; ${disagree} disagree.`);

/* Every triple the key resolves. For creatures a, b, c where ours has a and b
   meeting strictly inside the node where both meet c, Open Tree must not put
   c closer to either of them. Conflicts are grouped by the node of ours they
   contradict, which is where a fix would go. */
const depthInKey = (id) => lineage(id).length;
const placeable = LEAF_IDS.filter((c) => leafOf(c) && !taxonomyOnly.has(SPECIES[c]));
const conflicts = new Map();
let triples = 0, tripleAgree = 0, tripleOpen = 0;
for (let i = 0; i < placeable.length; i++) for (let j = i + 1; j < placeable.length; j++) {
  const a = placeable[i], b = placeable[j];
  const ab = keyMrca(a, b);
  for (const c of placeable) {
    if (c === a || c === b) continue;
    const ac = keyMrca(a, c);
    if (ab.id === ac.id || depthInKey(ab.id) <= depthInKey(ac.id)) continue;
    triples++;
    const [A, B, C] = [leafOf(a), leafOf(b), leafOf(c)];
    const otAB = mrca(parent, A, B), otAC = mrca(parent, A, C), otBC = mrca(parent, B, C);
    if (otAB !== otAC && ancestors(parent, otAB).includes(otAC)) { tripleAgree++; continue; }
    if (otAB === otAC && otAC === otBC) { tripleOpen++; continue; }
    const k = ab.id;
    if (!conflicts.has(k)) conflicts.set(k, []);
    conflicts.get(k).push(`${a}+${b} | ${c}`);
  }
}
for (const [node, list] of conflicts) {
  console.log(`✗  node ${node}: Open Tree disagrees on ${list.length} triple(s), e.g. ${list.slice(0, 4).join('; ')}`);
}
const tripleConflicts = [...conflicts.values()].reduce((n, l) => n + l.length, 0);
console.log(`Relationships: ${triples} triples the key resolves; Open Tree agrees with ${tripleAgree}, leaves ${tripleOpen} open, disagrees with ${tripleConflicts}.`);
process.exit(disagree || tripleConflicts ? 1 : 0);
