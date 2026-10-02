// Unit tests for the Atlas's tree data. `npm test` — no browser, no network.
//
// The tree is hand-written, and every species carries its facts in more than
// one file (the node itself, its map regions, its quick facts, its photograph).
// These tests hold the things that go quietly wrong when one of those is
// forgotten: a node nobody can find a photo for, an extinct animal that still
// reads as living, a species whose map says nothing.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { TREE, lightenColor } from '../js/treeData.js';
import { expandTree } from '../js/treeExpansion.js';
import { GEO_DATA } from '../js/geoData.js';
import { PHOTO_MAP } from '../js/speciesData.js';
import { PHOTO_SNAPSHOT } from '../js/photoSnapshot.js';
import { TAXON_NAMES } from '../js/taxonNames.js';

expandTree(TREE, lightenColor);

const nodes = [];
(function walk(n, parent) { nodes.push({ n, parent }); (n.children || []).forEach((c) => walk(c, n)); })(TREE, null);

/* Older than the parent they hang under, on purpose or by inheritance: the
   microbial and early-animal groups are dated by when the lineage is thought to
   have split, and a few leaves are dated by their own fossil record. A new node
   joining this list should be a decision, not an accident. */
const OLDER_THAN_PARENT = new Set([
  'pyrolobus', 'volvox', 'nautilus', 'cnidarians', 'platyhelminthes', 'sponges',
  'dickinsonia', // Ediacaran: older than the Cambrian that dates the "Invertebrates" node
]);

test('every id is unique', () => {
  const ids = nodes.map(({ n }) => n.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(dupes, []);
});

test('every node has what the panel and the rows read', () => {
  const bad = [];
  for (const { n } of nodes) {
    for (const key of ['icon', 'color', 'name', 'latin', 'era', 'desc']) if (!n[key]) bad.push(`${n.id}: no ${key}`);
    if (typeof n.appeared !== 'number' || !(n.appeared >= 0)) bad.push(`${n.id}: appeared is ${n.appeared}`);
  }
  assert.deepEqual(bad, []);
});

test('no node is older than its parent, except the ones we have decided on', () => {
  const bad = nodes
    .filter(({ n, parent }) => parent && n.appeared > parent.appeared + 1e-9 && !OLDER_THAN_PARENT.has(n.id))
    .map(({ n, parent }) => `${n.id} (${n.appeared} Ma) is older than ${parent.id} (${parent.appeared} Ma)`);
  assert.deepEqual(bad, []);
});

test('extinct means extinct everywhere: a date, the EX status, and not before it appeared', () => {
  const bad = [];
  for (const { n } of nodes) {
    if (n.extinct == null) continue;
    if (n.iucn !== 'EX') bad.push(`${n.id}: extinct but iucn is ${n.iucn}`);
    if (typeof n.extinct === 'number' && n.extinct > n.appeared) bad.push(`${n.id}: died out (${n.extinct}) before it appeared (${n.appeared})`);
    if (n.extinct !== true && typeof n.extinct !== 'number') bad.push(`${n.id}: extinct is ${JSON.stringify(n.extinct)}`);
  }
  assert.deepEqual(bad, []);
});

test('a living species is not marked extinct by its status', () => {
  const bad = nodes.filter(({ n }) => n.iucn === 'EX' && n.extinct == null && n.id !== 'platypus-frog').map(({ n }) => n.id);
  assert.deepEqual(bad, []);
});

test('every node has map regions, so the panel never shows an empty map', () => {
  const bad = nodes.filter(({ n }) => !(GEO_DATA[n.id] && GEO_DATA[n.id].regions && GEO_DATA[n.id].regions.length)).map(({ n }) => n.id);
  assert.deepEqual(bad, []);
});

test('every node has a photograph to show', () => {
  /* A species added without a photo draws as a bare emoji. The photograph
     snapshot is rebuilt from Wikipedia by .github/workflows/photo-refresh.yml,
     which the sandbox cannot reach, so a new species is red here until that
     pull request has merged — which is the point. */
  const bad = nodes.filter(({ n }) => !(PHOTO_SNAPSHOT[n.id] || PHOTO_MAP[n.id] || n.img)).map(({ n }) => n.id);
  assert.deepEqual(bad, []);
});

test('a ranked group has a Hebrew and a Russian name', () => {
  const RANKED = /^(Domain|Kingdom|Subkingdom|Superphylum|Phylum|Subphylum|Superclass|Class|Subclass|Superorder|Order|Suborder|Superfamily|Family|Subfamily|Genus|Division|Clade)\s/;
  const bad = [];
  for (const { n } of nodes) {
    if (!(n.children && n.children.length) || !RANKED.test(n.latin || '')) continue;
    for (const lang of ['he', 'ru']) if (!TAXON_NAMES[lang][n.id]) bad.push(`${n.id}: no ${lang} name`);
  }
  assert.deepEqual(bad, []);
});
