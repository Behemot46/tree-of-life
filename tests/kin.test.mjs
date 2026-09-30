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
import { GROUPS } from '../js/kin/groups.js';
import { BANK } from '../js/kin/bank.js';
import { SCHEDULE } from '../js/kin/schedule.js';
import { generateBank, REST_DAYS, MIN_REST_DAYS } from '../js/kin/generate.js';

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

/* Hebrew and Russian are written in their own scripts, so a Latin letter in
   either is an untranslated word — "T. rex" left in a Russian sentence. */
const NON_LATIN = ['he', 'ru'];

test('every creature has every language, and Hebrew and Russian contain no Latin letters', () => {
  for (const [id, c] of Object.entries(CREATURES)) {
    for (const lang of LANGS) assert.ok(c[lang] && c[lang].n, `${id}: no ${lang} name`);
    for (const k of ['n', 'def', 'le']) assert.doesNotMatch(c.he[k], /[A-Za-z]/, `${id}: he.${k} has Latin letters`);
    for (const k of ['n', 'g', 'line', 'the']) {
      assert.ok(c.ru[k], `${id}: no ru.${k}`);
      assert.doesNotMatch(c.ru[k], /[A-Za-z]/, `${id}: ru.${k} has Latin letters`);
    }
    assert.ok(['animal', 'plant', 'fungus'].includes(c.k), `${id}: unknown kingdom`);
  }
  for (const q of QUESTIONS) {
    for (const lang of LANGS) assert.ok(q.why[lang] && q.why[lang].length > 10, `${q.id}: no ${lang} explanation`);
    for (const lang of NON_LATIN) assert.doesNotMatch(q.why[lang], /[A-Za-z]/, `${q.id}: ${lang} explanation has Latin letters`);
  }
});

test('sentences assemble in every language for every question', () => {
  for (const q of QUESTIONS) {
    const r = E.resolve(q);
    const [T, N, F] = [CREATURES[q.t], CREATURES[q.near], CREATURES[q.far]];
    for (const lang of LANGS) {
      const s = STRINGS[lang];
      const line = s.headline(T, N, F, r.dNear, r.dFar);
      assert.ok(!line.includes('undefined') && !line.includes('NaN'), `${q.id}/${lang}: ${line}`);
      assert.ok(!s.right(N).includes('undefined') && !s.wrong(N).includes('undefined'), `${q.id}/${lang}: verdict`);
    }
    for (const lang of NON_LATIN) {
      assert.doesNotMatch(STRINGS[lang].headline(T, N, F, r.dNear, r.dFar), /[A-Za-z]/, `${q.id}: ${lang} headline has Latin letters`);
    }
  }
  assert.equal(STRINGS.en.headline(CREATURES.whale, CREATURES.hippo, CREATURES.shark, { mya: 53 }, { mya: 460 }),
    'Whales and hippos last shared an ancestor about 53 million years ago. The shark line branched off about 460 million years ago.');
  assert.equal(STRINGS.he.headline(CREATURES.whale, CREATURES.hippo, CREATURES.shark, { mya: 53 }, { mya: 460 }),
    'ללווייתן ולהיפופוטם היה אב קדמון משותף לפני כ־53 מיליון שנה. הקו של הכריש התפצל לפני כ־460 מיליון שנה.');
  assert.equal(STRINGS.ru.headline(CREATURES.whale, CREATURES.hippo, CREATURES.shark, { mya: 53 }, { mya: 460 }),
    'Последний общий предок кита и бегемота жил около 53 млн лет назад. Предки акул отделились около 460 млн лет назад.');
  /* Russian decimals take a comma, a fossil minimum reads "более", and the
     deepest splits are counted in billions. */
  assert.equal(STRINGS.ru.headline(CREATURES.chili, CREATURES.tomato, CREATURES.coffee, { mya: 52.2, min: true }, { mya: 1500 }),
    'Последний общий предок перца чили и помидора жил более 52 млн лет назад. Предки кофе отделились около 1,5 млрд лет назад.');
  assert.equal(STRINGS.ru.short({ mya: 8.7 }), '8,7 млн лет назад');
});

test('Russian counts in three forms', () => {
  const ru = STRINGS.ru;
  assert.deepEqual([2, 4, 5, 11, 12, 21, 22, 25, 101, 111].map(ru.streak), [
    '🔥 2 дня подряд', '🔥 4 дня подряд', '🔥 5 дней подряд', '🔥 11 дней подряд', '🔥 12 дней подряд',
    '🔥 21 день подряд', '🔥 22 дня подряд', '🔥 25 дней подряд', '🔥 101 день подряд', '🔥 111 дней подряд']);
  assert.deepEqual([0, 1, 2, 5, 14, 21].map(ru.pts), ['0 очков', '1 очко', '2 очка', '5 очков', '14 очков', '21 очко']);
  assert.deepEqual([0, 1, 2, 3].map(ru.lives), ['Жизней не осталось', 'Осталась последняя жизнь', 'Осталось 2 жизни', 'Осталось 3 жизни']);
});

test('every string key exists in every language', () => {
  const keys = Object.keys(STRINGS.en);
  for (const lang of LANGS) for (const k of keys) assert.ok(k in STRINGS[lang], `${lang} is missing "${k}"`);
  assert.equal(STRINGS.he.dir, 'rtl');
  /* "Kin" transliterated into Hebrew is קין, Cain. */
  assert.notEqual(STRINGS.he.brand, 'קין');
  /* The switcher shows every other language by the name it gives itself. */
  const codes = LANGS.map((l) => STRINGS[l].code);
  assert.equal(new Set(codes).size, LANGS.length, `language codes collide: ${codes}`);
  for (const lang of LANGS) assert.ok(STRINGS[lang].name, `${lang} has no name for the switcher`);
});

test('day numbers count calendar days from the epoch, across daylight-saving changes', () => {
  assert.equal(E.dayNumber(E.EPOCH), 1);
  assert.equal(E.dayNumber('2026-09-30'), 2);
  assert.equal(E.dayNumber('2026-10-25'), 27);   // EU clocks go back that night
  assert.equal(E.dayNumber('2026-10-26'), 28);
  assert.equal(E.dayNumber('2027-03-29'), 182);
  assert.equal(E.localDateString(new Date(2026, 0, 5)), '2026-01-05');
});

test('days 1-4 are the curated sets; every calendar day is ten valid, distinct, repeatable questions', () => {
  CURATED_DAYS.forEach((set, i) => assert.deepEqual(E.dailyIds(i + 1), set));
  for (let day = 1; day <= SCHEDULE.length + 30; day++) {
    const ids = E.dailyIds(day);
    assert.equal(ids.length, E.DAILY_SIZE, `day ${day}`);
    assert.equal(new Set(ids).size, E.DAILY_SIZE, `day ${day} repeats a question`);
    for (const id of ids) {
      const q = E.QUESTION_BY_ID[id];
      assert.ok(q, `day ${day}: ${id}`);
      const r = E.resolve(q);
      assert.ok(r.valid && r.dated, `day ${day}: ${id} is not true and dated`);
    }
    assert.equal(new Set(ids.map((id) => E.QUESTION_BY_ID[id].t)).size, E.DAILY_SIZE, `day ${day} asks about one creature twice`);
    assert.deepEqual(E.dailyIds(day), ids, `day ${day} is not deterministic`);
    const prev = new Set(E.dailyIds(day - 1));
    assert.ok(day === 1 || ids.every((id) => !prev.has(id)), `day ${day} repeats yesterday`);
  }
  assert.deepEqual(E.dailyIds(0), CURATED_DAYS[0], 'a clock set before the epoch still gets a game');
});

test('a calendar day opens with a surprise and rests its questions', () => {
  /* The opener is what a player sees first and what makes them share: a
     hand-picked hook or a generated question whose wrong answer is a strong
     decoy, and at worst a hard one. A question comes back only after a rest
     of REST_DAYS where the bank allows; the builder may shorten that to fill
     a day, but never below MIN_REST_DAYS, and only on a few days. */
  const bankS = Object.fromEntries(BANK.map((e) => { const cut = e.lastIndexOf('.'); return [e.slice(0, cut), Number(e.slice(cut + 1))]; }));
  const last = new Map();
  let shortRests = 0;
  SCHEDULE.forEach((line, i) => {
    const ids = line.split(' ');
    if (i >= CURATED_DAYS.length) {
      const first = E.QUESTION_BY_ID[ids[0]];
      assert.ok(HOOKS.includes(ids[0]) || bankS[ids[0]] >= 2 || first.d === 3, `Kin #${i + 1} opens with ${ids[0]}`);
    }
    for (const id of ids) {
      if (last.has(id)) {
        const gap = i - last.get(id);
        assert.ok(gap >= MIN_REST_DAYS, `Kin #${i + 1} repeats ${id} after ${gap} days`);
        if (gap < REST_DAYS) shortRests++;
      }
      last.set(id, i);
    }
  });
  assert.ok(shortRests <= SCHEDULE.length / 10, `${shortRests} questions came back early`);
});

test('the bank has at least 500 true, dated questions, and is what the generator makes', () => {
  /* The phase-2 gate. Every generated question must also clear the margin
     rule — the far split at least 15% older than the near one — and the file
     must match a fresh run, so the bank can never drift from the tree. */
  assert.ok(E.ALL_QUESTIONS.length >= 500, `${E.ALL_QUESTIONS.length} questions`);
  for (const q of E.ALL_QUESTIONS.filter((x) => x.generated)) {
    const r = E.resolve(q);
    assert.ok(r.valid && r.dated && E.clearMargin(r), `${q.id} fails the margin rule`);
  }
  const fresh = generateBank({ curated: QUESTIONS }).map((q) => `${q.id}.${q.s}`);
  assert.deepEqual(BANK, fresh, 'js/kin/bank.js is stale: run node scripts/kin-build.mjs');
});

test('every branch a question can meet at explains itself, in every language', () => {
  const root = E.NODE_IDS[0];
  for (const id of Object.keys(NODE_DATES)) {
    if (id === root) continue;
    assert.ok(GROUPS[id], `no line in js/kin/groups.js for ${id}`);
  }
  for (const [id, line] of Object.entries(GROUPS)) {
    assert.ok(NODE_DATES[id], `line for ${id}, which has no date`);
    for (const lang of LANGS) {
      assert.ok(line[lang] && line[lang].length > 10, `${id}: no ${lang} line`);
      assert.doesNotMatch(line[lang], /\d/, `${id}: a ${lang} line never states a number — the headline does`);
    }
    for (const lang of NON_LATIN) assert.doesNotMatch(line[lang], /[A-Za-z]/, `${id}: ${lang} line has Latin letters`);
  }
});

test('the arcade holds every question once, in an order fixed by its seed', () => {
  const a = E.arcadeIds(12345);
  assert.equal(a.length, E.ALL_QUESTIONS.length);
  assert.equal(new Set(a).size, E.ALL_QUESTIONS.length);
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
  assert.deepEqual(s, { last: '2026-09-29', count: 1, best: 1, freezes: 0, froze: false });
  s = E.nextStreak(s, '2026-09-29');
  assert.equal(s.count, 1, 'playing twice in a day is one day');
  s = E.nextStreak(s, '2026-09-30');
  assert.equal(s.count, 2);
  assert.equal(s.best, 2);
  s = E.nextStreak(s, '2026-10-05');
  assert.equal(s.count, 1, 'a gap starts again at 1');
  assert.equal(s.best, 2, 'and the best is kept');
  // a date before the last one played (a phone flown west, a clock set right) is a day already counted
  const flown = { last: '2026-10-06', count: 9, best: 9, freezes: 1, froze: false };
  assert.deepEqual(E.nextStreak(flown, '2026-10-05'), flown, 'a clock set back changes nothing');
});

test('a freeze covers one missed day, and only one', () => {
  const held = { last: '2026-09-30', count: 6, best: 6, freezes: 1, froze: false };
  // finishing the day after the next: one day was missed, the freeze is spent, the streak goes on
  const covered = E.nextStreak(held, '2026-10-02');
  assert.deepEqual(covered, { last: '2026-10-02', count: 7, best: 7, freezes: 0, froze: true });
  // two missed days are more than one freeze can cover
  assert.equal(E.nextStreak(held, '2026-10-03').count, 1);
  assert.equal(E.nextStreak(held, '2026-10-03').freezes, 1, 'an unspent freeze is kept');
  // no freeze, one missed day: a fresh start
  assert.equal(E.nextStreak({ ...held, freezes: 0 }, '2026-10-02').count, 1);
  // the next day needs no freeze
  assert.deepEqual([E.nextStreak(held, '2026-10-01').count, E.nextStreak(held, '2026-10-01').freezes], [7, 1]);
});

test('what the streak is worth right now is never shown as a loss', () => {
  const s = { last: '2026-09-30', count: 4, best: 4, freezes: 0 };
  assert.deepEqual(E.streakNow(s, '2026-09-30'), { count: 4, alive: true, played: true, covers: false });
  assert.deepEqual(E.streakNow(s, '2026-10-01'), { count: 4, alive: true, played: false, covers: false });
  assert.equal(E.streakNow(s, '2026-10-02').alive, false, 'a missed day with no freeze is a fresh start');
  assert.equal(E.streakNow(s, '2026-10-02').count, 0);
  assert.deepEqual(E.streakNow({ ...s, freezes: 1 }, '2026-10-02'), { count: 4, alive: true, played: false, covers: true });
  assert.equal(E.streakNow({ ...s, freezes: 1 }, '2026-10-03').alive, false);
  assert.deepEqual(E.streakNow(null, '2026-10-01'), { count: 0, alive: false, played: false, covers: false });
  assert.equal(E.streakNow(s, '2026-09-01').played, true, 'a clock set back is not a lost streak');
});

test('an Arcade run of ten earns a freeze, up to two', () => {
  const s = { last: null, count: 0, best: 0, freezes: 0, froze: false };
  assert.equal(E.earnFreeze(s, 9).earned, false);
  const one = E.earnFreeze(s, 10);
  assert.deepEqual([one.earned, one.streak.freezes], [true, 1]);
  const two = E.earnFreeze(one.streak, 25);
  assert.deepEqual([two.earned, two.streak.freezes], [true, 2]);
  const three = E.earnFreeze(two.streak, 40);
  assert.deepEqual([three.earned, three.streak.freezes], [false, 2], 'two is the most anyone holds');
  assert.equal(E.MAX_FREEZES, 2);
  assert.equal(E.FREEZE_AT, 10);
});

test('the stats summary counts finished dailies by title', () => {
  assert.deepEqual(E.dailySummary({}), { finished: 0, average: 0, best: 0, distribution: [0, 0, 0, 0, 0] });
  const s = E.dailySummary({ 1: 10, 2: 8, 3: 6, 4: 3, 5: 8, 6: 'x' });
  assert.deepEqual(s.distribution, [1, 0, 1, 2, 1]);
  assert.equal(s.finished, 5);
  assert.equal(s.best, 10);
  assert.equal(s.average, 7);
});

test('links ask for what they name and nothing else', () => {
  const now = new Date('2026-10-05T12:00:00Z');
  const last = E.lastPlayableDay(now);
  assert.deepEqual(E.parseLaunch('', now), { lang: null, kin: null, challenge: null, stats: false });
  assert.deepEqual(E.parseLaunch('?kin=3&lang=he', now), { lang: 'he', kin: 3, challenge: null, stats: false });
  assert.deepEqual(E.parseLaunch('?c=9182&s=12', now).challenge, { seed: 9182, score: 12 });
  assert.deepEqual(E.parseLaunch('?c=9182', now).challenge, { seed: 9182, score: null }, 'a challenge with no score is still a challenge');
  assert.equal(E.parseLaunch('?stats=1', now).stats, true);
  // numbers are plain integers inside their range or they are ignored
  for (const bad of ['?kin=0', '?kin=-3', '?kin=2.5', '?kin=abc', '?kin=1e3', '?kin=99999999999', `?kin=${last + 1}`, '?kin=%20']) {
    assert.equal(E.parseLaunch(bad, now).kin, null, bad);
  }
  assert.equal(E.parseLaunch(`?kin=${last}`, now).kin, last, 'a friend a day ahead is still a valid day');
  for (const bad of ['?c=-1', '?c=4294967296', '?c=x', '?c=']) assert.equal(E.parseLaunch(bad, now).challenge, null, bad);
  assert.equal(E.parseLaunch('?c=5&s=99999', now).challenge.score, null);
});

test('the links a result carries name the day or the run, and the sender language', () => {
  const base = 'https://www.treeoflife.wiki/';
  assert.equal(E.kinURL({ base, day: 142, lang: 'en' }), 'https://www.treeoflife.wiki/?kin=142');
  assert.equal(E.kinURL({ base, day: 142, lang: 'he' }), 'https://www.treeoflife.wiki/?kin=142&lang=he');
  assert.equal(E.challengeURL({ base, seed: 77, score: 12, lang: 'ru' }), 'https://www.treeoflife.wiki/?c=77&s=12&lang=ru');
  // what the sender builds, the receiver reads back
  const round = E.parseLaunch(E.challengeURL({ base: '', seed: 77, score: 12, lang: 'ru' }).slice(1), new Date('2026-10-05T12:00:00Z'));
  assert.deepEqual([round.challenge, round.lang], [{ seed: 77, score: 12 }, 'ru']);
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
