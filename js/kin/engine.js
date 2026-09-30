// ══════════════════════════════════════════════════════
// KIN — THE ENGINE
//
// Pure functions: no DOM, no storage, no clock unless one is passed in. The
// page (js/kin/main.js) calls these, and so do the unit tests
// (tests/kin.test.mjs), which is the point — everything that decides what a
// player is told is checkable in milliseconds without a browser.
// ══════════════════════════════════════════════════════

import { NODE_DATES, SOURCES } from './dates.js';
import { QUESTIONS, CURATED_DAYS, HOOKS } from './questions.js';
import { GROUPS } from './groups.js';
import { BANK } from './bank.js';
import { SCHEDULE } from './schedule.js';
import { hashString, mulberry32, shuffled } from './rng.js';
import { LEAF_IDS, NODE_IDS, hasNode, lineage, mrca, dateOf, resolve, clearMargin } from './key.js';
import { EPOCH, localDateString, dayNumber, msUntilMidnight } from './calendar.js';

export { LEAF_IDS, NODE_IDS, lineage, mrca, dateOf, resolve, clearMargin };
export { EPOCH, localDateString, dayNumber, msUntilMidnight };

export const DAILY_SIZE = 10;
export const LIVES = 3;

// ── Every askable question ──────────────────────────────────────────────────

/*
 * Two kinds, one shape. Hand-written questions (js/kin/questions.js) carry
 * their own "why". Generated ones (js/kin/bank.js, built from the tree by
 * scripts/kin-build.mjs) are named "target.nearer.farther" and borrow the
 * line for the branch where the target meets its nearer relative
 * (js/kin/groups.js). A generated id stays readable even after the bank is
 * rebuilt, so a day already in the calendar always resolves.
 */
function generated(id, s) {
  const [t, near, far] = id.split('.');
  const nearNode = mrca(t, near);
  const why = nearNode && GROUPS[nearNode.id];
  if (!why) return null;
  return { id, t, near, far, d: s == null ? 2 : s >= 1 ? 3 : s === 0 ? 2 : 1, why, generated: true };
}

const BANK_QUESTIONS = BANK.map((entry) => {
  const cut = entry.lastIndexOf('.');
  return generated(entry.slice(0, cut), Number(entry.slice(cut + 1)));
}).filter(Boolean);

export const ALL_QUESTIONS = [...QUESTIONS, ...BANK_QUESTIONS];
export const QUESTION_BY_ID = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));
for (const line of SCHEDULE) {
  for (const id of line.split(' ')) if (!QUESTION_BY_ID[id] && id.includes('.')) {
    const q = generated(id, null);
    if (q) QUESTION_BY_ID[id] = q;
  }
}

/** Every reason the data could mislead a player. Empty means ship. */
export function problems({ creatures }) {
  const errs = [];
  const leafSet = new Set(LEAF_IDS);
  if (leafSet.size !== LEAF_IDS.length) errs.push('a creature appears twice in the tree');
  for (const id of LEAF_IDS) if (!creatures[id]) errs.push(`tree leaf "${id}" has no creature entry`);
  for (const id of Object.keys(creatures)) if (!leafSet.has(id)) errs.push(`creature "${id}" is not in the tree`);

  const seen = new Set();
  for (const q of QUESTIONS) {
    if (seen.has(q.id)) errs.push(`duplicate question id "${q.id}"`);
    seen.add(q.id);
    for (const c of [q.t, q.near, q.far]) if (!leafSet.has(c)) errs.push(`${q.id}: "${c}" is not in the tree`);
    const r = resolve(q);
    if (!r.valid) errs.push(`${q.id}: the tree does not make ${q.near} strictly closer to ${q.t} than ${q.far} is`);
    else if (!r.dated) errs.push(`${q.id}: no sourced, ordered dates for ${r.nearNode} / ${r.farNode}`);
  }

  /* An ancestor is older than every dated node beneath it. Dates come from
     different papers, so this is the check that keeps them telling one story. */
  for (const [id, d] of Object.entries(NODE_DATES)) {
    if (!hasNode(id)) { errs.push(`date for unknown node "${id}"`); continue; }
    const src = SOURCES[d.src];
    if (!src || !/^https:\/\//.test(src.url || '') || !src.title) errs.push(`date for ${id} has no citable source ("${d.src}")`);
    if (!(d.mya > 0)) errs.push(`date for ${id} is not a positive number`);
    for (const anc of lineage(id)) {
      const a = NODE_DATES[anc.id];
      if (a && !(a.mya > d.mya)) errs.push(`${anc.id} (${a.mya}) is not older than its descendant ${id} (${d.mya})`);
    }
  }

  CURATED_DAYS.forEach((day, i) => {
    if (day.length !== DAILY_SIZE) errs.push(`curated day ${i + 1} has ${day.length} questions`);
    if (new Set(day).size !== day.length) errs.push(`curated day ${i + 1} repeats a question`);
    for (const id of day) if (!QUESTION_BY_ID[id]) errs.push(`curated day ${i + 1}: unknown question "${id}"`);
  });
  for (const id of HOOKS) if (!QUESTION_BY_ID[id]) errs.push(`unknown hook "${id}"`);

  if (BANK_QUESTIONS.length !== BANK.length) errs.push('a bank entry has no line for its branch in js/kin/groups.js');
  for (const q of BANK_QUESTIONS) {
    for (const c of [q.t, q.near, q.far]) if (!leafSet.has(c)) errs.push(`${q.id}: "${c}" is not in the tree`);
    const r = resolve(q);
    if (!r.valid) errs.push(`${q.id}: the tree does not make ${q.near} strictly closer to ${q.t} than ${q.far} is`);
    else if (!clearMargin(r)) errs.push(`${q.id}: the far split is not clearly older than the near one`);
  }

  /* The calendar: every day ten different questions, every one of them still
     true and dated, and the hand-picked days where they were. */
  SCHEDULE.forEach((line, i) => {
    const ids = line.split(' ');
    if (ids.length !== DAILY_SIZE || new Set(ids).size !== DAILY_SIZE) errs.push(`Kin #${i + 1} does not hold ${DAILY_SIZE} different questions`);
    for (const id of ids) {
      const q = QUESTION_BY_ID[id];
      if (!q) { errs.push(`Kin #${i + 1}: unknown question "${id}"`); continue; }
      const r = resolve(q);
      if (!r.valid || !r.dated) errs.push(`Kin #${i + 1}: "${id}" is no longer true and dated`);
    }
  });
  CURATED_DAYS.forEach((day, i) => {
    if (SCHEDULE[i] !== day.join(' ')) errs.push(`Kin #${i + 1} is not the hand-picked day`);
  });
  return errs;
}

// ── What gets played ────────────────────────────────────────────────────────

const dailyMemo = new Map();

/**
 * The ten question ids for a Kin number, from the calendar in
 * js/kin/schedule.js — frozen, so every phone plays the same set and a day
 * already played never changes. Past the calendar's last day (it is extended
 * long before that), a seeded draw from the whole bank keeps the game going.
 */
export function dailyIds(day) {
  const n = Math.max(1, day | 0);
  if (n <= SCHEDULE.length) return SCHEDULE[n - 1].split(' ');
  if (dailyMemo.has(n)) return dailyMemo.get(n).slice();
  const prev = new Set(dailyIds(n - 1));
  const rand = mulberry32(hashString(`kin-day-${n}`));
  const hook = shuffled(HOOKS, rand).find((id) => !prev.has(id)) || HOOKS[0];
  const targets = new Set([QUESTION_BY_ID[hook].t]);
  const rest = [];
  for (const q of shuffled(ALL_QUESTIONS, rand)) {
    if (rest.length === DAILY_SIZE - 1) break;
    if (q.id === hook || prev.has(q.id) || targets.has(q.t)) continue;
    rest.push(q.id);
    targets.add(q.t);
  }
  rest.sort((a, b) => QUESTION_BY_ID[a].d - QUESTION_BY_ID[b].d);
  const ids = [hook, ...rest];
  dailyMemo.set(n, ids);
  return ids.slice();
}

/** Every question, easier first but mixed, in an order fixed by the seed. */
export function arcadeIds(seed) {
  const rand = mulberry32(seed >>> 0);
  return ALL_QUESTIONS
    .map((q) => ({ id: q.id, k: q.d + rand() * 1.6 }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.id);
}

/** Which side the nearer relative sits on. Fixed per day and question, so a
    shared result means the same screen for everyone. */
export function nearOnLeft(questionId, salt) {
  return (hashString(`${salt}|${questionId}`) & 1) === 0;
}

// ── Scoring and sharing ─────────────────────────────────────────────────────

/** 0 Seedling · 1 Sprout · 2 Sapling · 3 Old growth · 4 Tree of Life */
export function titleIndex(score, of = DAILY_SIZE) {
  const s = Math.round((score / of) * DAILY_SIZE);
  return s >= 10 ? 4 : s >= 8 ? 3 : s >= 6 ? 2 : s >= 4 ? 1 : 0;
}

/**
 * The streak counts days played, not days perfect: finishing a Kin on the
 * day after the last one extends it, and a gap starts it again at 1 rather
 * than at 0 — a player who comes back is never told they lost something.
 */
export function nextStreak(state, today) {
  const s = state && state.last ? state : { last: null, count: 0 };
  if (s.last === today) return s;
  const gap = s.last ? dayNumber(today) - dayNumber(s.last) : null;
  return { last: today, count: gap === 1 ? s.count + 1 : 1 };
}

export function shareText({ brand, day, picks, url }) {
  const score = picks.filter(Boolean).length;
  const grid = picks.map(p => (p ? '🟩' : '🟥')).join('');
  return `${brand} #${day} · ${score}/${picks.length} 🌳\n${grid}${url ? `\n${url}` : ''}`;
}
