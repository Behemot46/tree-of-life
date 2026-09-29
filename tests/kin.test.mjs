// Unit tests for Kin's engine and data. `npm test` — no browser, no network,
// a few hundred milliseconds. Everything a player is told is decided by
// these modules, so everything a player is told is checked here.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import * as E from '../js/kin/engine.js';
import { CREATURES } from '../js/kin/creatures.js';
import { QUESTIONS, CURATED_DAYS, HOOKS } from '../js/kin/questions.js';
import { NODE_DATES, SOURCES } from '../js/kin/dates.js';
import { STRINGS, LANGS } from '../js/kin/strings.js';
import { mulberry32, hashString } from '../js/kin/rng.js';

test('the answer key has no problems', () => {
  /* One list, so a failure names every broken question at once: branching
     that contradicts the written answer, a missing or uncited date, an
     ancestor dated younger than its descendant, a malformed curated day. */
  assert.deepEqual(E.problems({ creatures: CREATURES }), []);
});

test('every question is answered by the tree, with the nearer relative first', () => {
  for (const q of QUESTIONS) {
    const r = E.resolve(q);
    assert.ok(r.valid, `${q.id}: tree disagrees`);
    assert.ok(r.dated, `${q.id}: undated`);
    assert.ok(r.dNear.mya < r.dFar.mya, `${q.id}: near split is not the more recent one`);
    // Swapping the candidates must make the question invalid: the answer is not symmetric by accident.
    assert.equal(E.resolve({ ...q, near: q.far, far: q.near }).valid, false, `${q.id}: answer is symmetric`);
  }
});

test('an ancestor is always older than its descendants', () => {
  for (const [id, d] of Object.entries(NODE_DATES)) {
    for (const anc of E.lineage(id)) {
      const a = NODE_DATES[anc.id];
      if (a) assert.ok(a.mya > d.mya, `${anc.id} (${a.mya}) vs ${id} (${d.mya})`);
    }
  }
});

test('every date cites an openly reachable source, and none cites TimeTree', () => {
  for (const [id, d] of Object.entries(NODE_DATES)) {
    const src = SOURCES[d.src];
    assert.ok(src, `${id}: source "${d.src}" missing`);
    assert.match(src.url, /^https:\/\//, `${id}: source has no https URL`);
    assert.doesNotMatch(src.url, /timetree\.org/i, `${id}: TimeTree data may not be redistributed`);
  }
});

test('every creature has both languages, and Hebrew text contains no Latin letters', () => {
  for (const [id, c] of Object.entries(CREATURES)) {
    for (const lang of LANGS) assert.ok(c[lang] && c[lang].n, `${id}: no ${lang} name`);
    for (const k of ['n', 'def', 'le']) assert.doesNotMatch(c.he[k], /[A-Za-z]/, `${id}: he.${k} has Latin letters`);
    assert.ok(['animal', 'plant', 'fungus'].includes(c.k), `${id}: unknown kingdom`);
  }
  for (const q of QUESTIONS) {
    for (const lang of LANGS) assert.ok(q.why[lang] && q.why[lang].length > 10, `${q.id}: no ${lang} explanation`);
    assert.doesNotMatch(q.why.he, /[A-Za-z]/, `${q.id}: Hebrew explanation has Latin letters`);
  }
});

test('sentences assemble in both languages for every question', () => {
  for (const q of QUESTIONS) {
    const r = E.resolve(q);
    const [T, N, F] = [CREATURES[q.t], CREATURES[q.near], CREATURES[q.far]];
    for (const lang of LANGS) {
      const s = STRINGS[lang];
      const line = s.headline(T, N, F, r.dNear, r.dFar);
      assert.ok(!line.includes('undefined') && !line.includes('NaN'), `${q.id}/${lang}: ${line}`);
      assert.ok(!s.right(N).includes('undefined') && !s.wrong(N).includes('undefined'), `${q.id}/${lang}: verdict`);
    }
    assert.doesNotMatch(STRINGS.he.headline(T, N, F, r.dNear, r.dFar), /[A-Za-z]/, `${q.id}: Hebrew headline has Latin letters`);
  }
  assert.equal(STRINGS.en.headline(CREATURES.whale, CREATURES.hippo, CREATURES.shark, { mya: 53 }, { mya: 460 }),
    'Whales and hippos last shared an ancestor about 53 million years ago. The shark line branched off about 460 million years ago.');
  assert.equal(STRINGS.he.headline(CREATURES.whale, CREATURES.hippo, CREATURES.shark, { mya: 53 }, { mya: 460 }),
    'ללווייתן ולהיפופוטם היה אב קדמון משותף לפני כ־53 מיליון שנה. הקו של הכריש התפצל לפני כ־460 מיליון שנה.');
});

test('every string key exists in every language', () => {
  const keys = Object.keys(STRINGS.en);
  for (const lang of LANGS) for (const k of keys) assert.ok(k in STRINGS[lang], `${lang} is missing "${k}"`);
  assert.equal(STRINGS.he.dir, 'rtl');
  /* "Kin" transliterated into Hebrew is קין, Cain. */
  assert.notEqual(STRINGS.he.brand, 'קין');
});

test('day numbers count calendar days from the epoch, across daylight-saving changes', () => {
  assert.equal(E.dayNumber(E.EPOCH), 1);
  assert.equal(E.dayNumber('2026-09-30'), 2);
  assert.equal(E.dayNumber('2026-10-25'), 27);   // EU clocks go back that night
  assert.equal(E.dayNumber('2026-10-26'), 28);
  assert.equal(E.dayNumber('2027-03-29'), 182);
  assert.equal(E.localDateString(new Date(2026, 0, 5)), '2026-01-05');
});

test('days 1-4 are the curated sets; later days are ten valid, distinct, repeatable questions', () => {
  CURATED_DAYS.forEach((set, i) => assert.deepEqual(E.dailyIds(i + 1), set));
  for (let day = 5; day <= 120; day++) {
    const ids = E.dailyIds(day);
    assert.equal(ids.length, E.DAILY_SIZE, `day ${day}`);
    assert.equal(new Set(ids).size, E.DAILY_SIZE, `day ${day} repeats a question`);
    for (const id of ids) assert.ok(E.QUESTION_BY_ID[id], `day ${day}: ${id}`);
    assert.ok(HOOKS.includes(ids[0]), `day ${day} does not open with a hook`);
    assert.deepEqual(E.dailyIds(day), ids, `day ${day} is not deterministic`);
    const prev = new Set(E.dailyIds(day - 1));
    assert.ok(ids.every(id => !prev.has(id)), `day ${day} repeats yesterday`);
  }
  assert.deepEqual(E.dailyIds(0), CURATED_DAYS[0], 'a clock set before the epoch still gets a game');
});

test('the arcade holds every question once, in an order fixed by its seed', () => {
  const a = E.arcadeIds(12345);
  assert.equal(a.length, QUESTIONS.length);
  assert.equal(new Set(a).size, QUESTIONS.length);
  assert.deepEqual(E.arcadeIds(12345), a);
  assert.notDeepEqual(E.arcadeIds(54321), a);
});

test('the side the answer sits on is fixed per day and question, and not always the same', () => {
  const sides = QUESTIONS.map(q => E.nearOnLeft(q.id, 'day-1'));
  assert.deepEqual(QUESTIONS.map(q => E.nearOnLeft(q.id, 'day-1')), sides);
  const left = sides.filter(Boolean).length;
  assert.ok(left > QUESTIONS.length * 0.3 && left < QUESTIONS.length * 0.7, `answer on the left ${left}/${QUESTIONS.length} times`);
});

test('streaks count days played and never punish a gap below 1', () => {
  let s = E.nextStreak(null, '2026-09-29');
  assert.deepEqual(s, { last: '2026-09-29', count: 1 });
  s = E.nextStreak(s, '2026-09-29');
  assert.equal(s.count, 1, 'playing twice in a day is one day');
  s = E.nextStreak(s, '2026-09-30');
  assert.equal(s.count, 2);
  s = E.nextStreak(s, '2026-10-05');
  assert.equal(s.count, 1, 'a gap starts again at 1');
});

test('results titles and the share text', () => {
  assert.deepEqual([0, 3, 4, 6, 8, 9, 10].map(n => E.titleIndex(n)), [0, 0, 1, 2, 3, 3, 4]);
  const text = E.shareText({ brand: 'Kin', day: 7, picks: [true, true, false, true, true, true, true, false, true, true], url: 'https://x.test/play.html' });
  assert.equal(text, 'Kin #7 · 8/10 🌳\n🟩🟩🟥🟩🟩🟩🟩🟥🟩🟩\nhttps://x.test/play.html');
});

test('the seeded generator is repeatable', () => {
  const a = mulberry32(hashString('kin')), b = mulberry32(hashString('kin'));
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});
