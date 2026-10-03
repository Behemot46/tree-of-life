// Every translation key the code asks for exists in all three languages. `npm test`.
//
// An iPhone home-screen app once ran a new orbit.js against a cached, older
// uiData.js and drew the key `orbit_compare_stop` on a button: t() falls back to
// English and then to the key itself, so a key missing everywhere shows up as its
// own name. This holds the source to its dictionary, so a key used but never
// written (or written in one language only) fails here instead of on a phone.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TRANSLATIONS } from '../js/uiData.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* The Atlas's modules. js/kin/ keeps its own strings (strings.js), not TRANSLATIONS. */
const sources = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'kin') walk(p); } else if (e.name.endsWith('.js')) sources.push(p);
  }
})(path.join(ROOT, 'js'));

/* t('key'), and t(cond ? 'a' : 'b') — every snake_case string literal inside the call. */
const used = new Map(); // key -> first file that names it
for (const file of sources) {
  const src = fs.readFileSync(file, 'utf8');
  for (const call of src.matchAll(/(?<![\w$.])t\(([^()]*)\)/g)) {
    for (const lit of call[1].matchAll(/['"]([a-z][a-z0-9]*(?:_[a-z0-9]+)*)['"]/g)) {
      if (!used.has(lit[1])) used.set(lit[1], path.relative(ROOT, file));
    }
  }
}
/* data-i18n="some.key" in the pages: dots become underscores (see CLAUDE.md). */
for (const page of ['atlas.html']) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) {
    const key = m[1].replace(/\./g, '_');
    if (!used.has(key)) used.set(key, page);
  }
}

test('the scan finds the keys it is meant to (a guard on the test itself)', () => {
  assert.ok(used.size > 80, `only ${used.size} keys found; the pattern has stopped matching`);
  for (const k of ['orbit_compare', 'orbit_compare_stop', 'orbit_pinned', 'orbit_why']) {
    assert.ok(used.has(k), `${k} (a conditional t() argument or a plain one) was not found by the scan`);
  }
});

for (const lang of Object.keys(TRANSLATIONS)) {
  test(`every key the code uses is written in ${lang}`, () => {
    const missing = [...used].filter(([k]) => !(TRANSLATIONS[lang] && TRANSLATIONS[lang][k]));
    assert.deepEqual(missing.map(([k, f]) => `${k} (${f})`), []);
  });
}
