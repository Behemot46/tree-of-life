// ══════════════════════════════════════════════════════
// KIN — QUESTIONS NOBODY WROTE BY HAND, AND THE CALENDAR
//
// The tree answers far more questions than anyone could write: every
// target, every pair of other creatures that meet it at two different dated
// nodes. This module picks the ones worth asking and lays them out day by
// day. It is pure and runs at build time only (scripts/kin-build.mjs); the
// page never loads it. What it produces is committed — js/kin/bank.js and
// js/kin/schedule.js — so a puzzle already played can never change under a
// player, whatever happens to the tree later.
//
// A question is worth asking when:
//   • its answer is true (the key says so) and both splits are dated,
//   • the far split is clearly older than the near one (MARGIN in key.js),
//   • it is not trivially easy: the wrong answer looks at least as much
//     like the target as the right answer does, or the two splits are close
//     enough in time that the question still teaches something.
// ══════════════════════════════════════════════════════

import { LEAF_IDS, mrca, resolve, clearMargin } from './key.js';
import { CREATURES, LOOKS } from './creatures.js';
import { GROUPS } from './groups.js';
import { hashString, mulberry32, shuffled } from './rng.js';
import { weekdayOf } from './calendar.js';

/* Every animal also looks like every other animal to a player: "is an octopus
   closer to a dog or to a mushroom?" teaches nothing. */
const TAGS = Object.fromEntries(Object.entries(LOOKS).map(([k, v]) =>
  [k, new Set([...v.split(' '), ...(CREATURES[k].k === 'animal' ? ['animal'] : [])])]));
const shared = (a, b) => { let n = 0; for (const x of TAGS[a]) if (TAGS[b].has(x)) n++; return n; };

/** Positive when intuition points the wrong way: the farther relative
    shares more of the target's look, habitat or aisle than the nearer one. */
export function surprise(t, near, far) {
  return shared(t, far) - shared(t, near);
}

/** 1 intuition gets it · 2 no help either way · 3 intuition misleads */
export const difficulty = (s) => (s >= 1 ? 3 : s === 0 ? 2 : 1);

export const genId = (t, near, far) => `${t}.${near}.${far}`;

/**
 * One question per shape — target, near node, far node — with the most
 * surprising pair of candidates for that shape. Shapes a hand-written
 * question already covers are skipped. Capped per target and per node so no
 * creature or branch dominates.
 */
export function generateBank({ curated = [], perTarget = 12, perNear = 36 } = {}) {
  const covered = new Set(curated.map((q) => { const r = resolve(q); return `${q.t}|${r.nearNode}|${r.farNode}`; }));
  const best = new Map();
  for (const t of LEAF_IDS) {
    const byNode = new Map();
    for (const x of LEAF_IDS) {
      if (x === t) continue;
      const m = mrca(t, x).id;
      if (!byNode.has(m)) byNode.set(m, []);
      byNode.get(m).push(x);
    }
    for (const [nearNode, nears] of byNode) {
      if (!GROUPS[nearNode]) continue;
      for (const [farNode, fars] of byNode) {
        if (farNode === nearNode) continue;
        const r = resolve({ t, near: nears[0], far: fars[0] });
        if (!r.valid || !clearMargin(r)) continue;
        const key = `${t}|${nearNode}|${farNode}`;
        if (covered.has(key)) continue;
        let pick = null;
        for (const near of nears) for (const far of fars) {
          const s = surprise(t, near, far);
          const tie = hashString(genId(t, near, far));
          if (!pick || s > pick.s || (s === pick.s && tie < pick.tie)) {
            pick = { t, near, far, s, tie, nearNode, farNode, ratio: r.dFar.mya / r.dNear.mya };
          }
        }
        best.set(key, pick);
      }
    }
  }

  /* Across a deep split the answer is obvious unless the decoy is strong: a
     camel against a hedgehog and a scorpion shares "desert" with the
     scorpion, and still nobody picks it. The mushroom is the exception — any
     question it decoys teaches that fungi are not plants. */
  const worthAsking = [...best.values()].filter((q) => {
    const fungal = q.t === 'mushroom' || q.near === 'mushroom' || q.far === 'mushroom';
    if (q.s >= 3 || (q.s >= 2 && q.ratio <= 10) || (q.s >= 1 && (q.ratio <= 3 || fungal))) return true;
    return (q.s === 0 && q.ratio <= 3) || (q.s < 0 && q.ratio <= 1.6);
  });
  worthAsking.sort((a, b) => b.s - a.s || a.ratio - b.ratio || a.tie - b.tie);

  const perT = new Map(), perN = new Map(), out = [];
  for (const q of worthAsking) {
    if ((perT.get(q.t) || 0) >= perTarget || (perN.get(q.nearNode) || 0) >= perNear) continue;
    perT.set(q.t, (perT.get(q.t) || 0) + 1);
    perN.set(q.nearNode, (perN.get(q.nearNode) || 0) + 1);
    out.push({ id: genId(q.t, q.near, q.far), t: q.t, near: q.near, far: q.far, s: q.s, d: difficulty(q.s), nearNode: q.nearNode });
  }
  return out.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

// ── The calendar ────────────────────────────────────────────────────────────

/** How many of the nine questions after the opener are easy, medium, hard:
    gentle on Monday, hard on Saturday, a themed set on Sunday. */
export const WEEKDAY_MIX = {
  1: [3, 4, 2], 2: [2, 5, 2], 3: [2, 5, 2], 4: [1, 5, 3], 5: [1, 5, 3], 6: [1, 4, 4], 0: [2, 4, 3],
};

/** Sunday themes, by the target's looks. Rotated week by week. */
export const THEMES = [
  { id: 'water', has: (t) => TAGS[t].has('sea') || TAGS[t].has('water') },
  { id: 'plants', has: (t) => TAGS[t].has('plant') },
  { id: 'wings-and-scales', has: (t) => TAGS[t].has('bird') || TAGS[t].has('reptile') },
  { id: 'fur-and-hooves', has: (t) => TAGS[t].has('furry') || TAGS[t].has('hoofed') },
  { id: 'small-things', has: (t) => TAGS[t].has('small') || TAGS[t].has('bug') || TAGS[t].has('shell') },
];

/** Days a question rests before it is asked again: the aim, and the floor
    no day may go below however hard it is to fill. */
export const REST_DAYS = 45;
export const MIN_REST_DAYS = 7;
export const DAY_SIZE = 10;

const isPlant = (t) => TAGS[t].has('plant');

/**
 * The ten question ids for one day. `pool` holds every askable question as
 * { id, t, near, far, d, s, nearNode, hook }; `recent` is the set of ids
 * asked in the last REST_DAYS days. The opener is a surprise (a hand-picked
 * hook, or a generated question whose wrong answer is a strong decoy); the
 * rest rise in difficulty. No target and no meeting node appears twice in a
 * day, no creature more than twice in any role — the salmon is the natural
 * decoy for everything that swims and would otherwise fill a Sunday — and an
 * ordinary day keeps a few plants in it.
 */
export function buildDay(n, { pool, history = [] }) {
  const rand = mulberry32(hashString(`kin-schedule-${n}`));
  const weekday = weekdayOf(n);
  const sunday = weekday === 0 ? THEMES[Math.floor((n - 1) / 7) % THEMES.length] : null;
  const order = shuffled(pool, rand);

  /* Rules give way one at a time, least important first, only when a day
     cannot be filled otherwise — a themed Sunday has few targets and fewer
     openers to choose from. The rest shortens but never goes below a week,
     and the opener may fall back to any hard question only at the very end.
     The first level that fills the day wins. */
  const levels = [
    { restDays: REST_DAYS, strictNodes: true, cap: 2, opener: 'surprise' },
    { restDays: REST_DAYS, strictNodes: false, cap: 2, opener: 'surprise' },
    { restDays: REST_DAYS, strictNodes: false, cap: 3, opener: 'surprise' },
    { restDays: 30, strictNodes: false, cap: 3, opener: 'surprise' },
    { restDays: 14, strictNodes: false, cap: 3, opener: 'surprise' },
    { restDays: 14, strictNodes: false, cap: 3, opener: 'hard' },
    { restDays: MIN_REST_DAYS, strictNodes: false, cap: 4, opener: 'hard' },
  ];
  /* A theme is worth less than the rest: a Sunday whose theme cannot be
     filled under the first rules becomes an ordinary day before any question
     is allowed back early. */
  const attempts = [
    ...(sunday ? levels.slice(0, 3).map((l) => ({ ...l, theme: sunday })) : []),
    ...levels.map((l) => ({ ...l, theme: null })),
  ];
  for (const { restDays, strictNodes, cap, opener: openWith, theme } of attempts) {
    const inTheme = (q) => !theme || theme.has(q.t);
    const rest = new Set(history.slice(Math.max(0, history.length - restDays)).flat());
    const day = [];
    const usedT = new Set(), usedNode = new Set(), seen = new Map();
    let plants = 0;
    const cast = (q) => [q.t, q.near, q.far];
    const fits = (q) => !rest.has(q.id) && inTheme(q) && !usedT.has(q.t)
      && (!strictNodes || !usedNode.has(q.nearNode))
      && cast(q).every((c) => (seen.get(c) || 0) < cap)
      && (theme || (isPlant(q.t) ? plants < 4 : day.length - plants < 8));
    const take = (q) => {
      day.push(q); usedT.add(q.t); usedNode.add(q.nearNode);
      for (const c of cast(q)) seen.set(c, (seen.get(c) || 0) + 1);
      if (isPlant(q.t)) plants++;
    };

    const opener = order.find((q) => fits(q) && (openWith === 'hard' ? q.d === 3 : q.hook || q.s >= 2));
    if (!opener) continue;
    take(opener);

    const want = WEEKDAY_MIX[weekday].slice();
    for (let d = 3; d >= 1; d--) {
      for (const q of order) {
        if (!want[d - 1]) break;
        if (q.d === d && fits(q)) { take(q); want[d - 1]--; }
      }
    }
    for (const q of order) if (day.length < DAY_SIZE && fits(q)) take(q);
    if (!theme && plants < 2) continue;
    if (day.length === DAY_SIZE) {
      const [first, ...others] = day;
      return [first, ...others.sort((a, b) => a.d - b.d)].map((q) => q.id);
    }
  }
  throw new Error(`Kin #${n}: the pool cannot fill a day`);
}

/**
 * Days 1…total. Days up to `keepThrough` are copied from `existing` — they
 * are history. Curated days are used where given. Every other day is built
 * fresh, resting each question for REST_DAYS where the pool allows.
 */
export function buildSchedule({ existing = [], keepThrough = 0, total, pool, curatedDays = [] }) {
  const days = [];
  for (let n = 1; n <= total; n++) {
    if (n <= keepThrough && existing[n - 1]) days.push(existing[n - 1].slice());
    else if (n <= curatedDays.length) days.push(curatedDays[n - 1].slice());
    else days.push(buildDay(n, { pool, history: days }));
  }
  return days;
}
