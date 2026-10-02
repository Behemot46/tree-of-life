// Every era string on a node reads in Hebrew and Russian. `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TREE, lightenColor } from '../js/treeData.js';
import { expandTree } from '../js/treeExpansion.js';
import { eraLabel } from '../js/eraNames.js';

expandTree(TREE, lightenColor);
const eras = new Set();
(function walk(n) { if (n.era) eras.add(n.era); (n.children || []).forEach(walk); })(TREE);

for (const lang of ['he', 'ru']) {
  test(`every era is translated into ${lang}`, () => {
    const bad = [...eras].filter((e) => {
      const out = eraLabel(e, lang);
      // A Latin name inside an annotation ("(Archaeopteryx)") is data and may stay.
      return out === e || /[A-Za-z]/.test(out.replace(/\([A-Za-z ]+\)/, ''));
    });
    assert.deepEqual(bad, []);
  });
}

test('English and unknown eras come back unchanged', () => {
  assert.equal(eraLabel('Cretaceous', 'en'), 'Cretaceous');
  assert.equal(eraLabel('Someday', 'he'), 'Someday');
});
