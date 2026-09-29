// ══════════════════════════════════════════════════════
// KIN — THE ENGINE
//
// Pure functions: no DOM, no storage, no clock unless one is passed in. The
// page (js/kin/main.js) calls these, and so do the unit tests
// (tests/kin.test.mjs), which is the point — everything that decides what a
// player is told is checkable in milliseconds without a browser.
// ══════════════════════════════════════════════════════

import { TREE } from './tree.js';
import { NODE_DATES, SOURCES } from './dates.js';
import { QUESTIONS, CURATED_DAYS, HOOKS } from './questions.js';
import { hashString, mulberry32, shuffled } from './rng.js';

/* Kin #1 is the first day of the test. Every phone numbers days from here in
   its own calendar, so a puzzle turns over at each player's local midnight. */
export const EPOCH = '2026-09-29';
export const DAILY_SIZE = 10;
export const LIVES = 3;

// ── The tree, indexed once ──────────────────────────────────────────────────

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
export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));

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

function isProperAncestor(anc, node) {
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

/** Every reason the data could mislead a player. Empty means ship. */
export function problems({ creatures }) {
  const errs = [];
  const leafSet = new Set(LEAVES);
  if (leafSet.size !== LEAVES.length) errs.push('a creature appears twice in the tree');
  for (const id of LEAVES) if (!creatures[id]) errs.push(`tree leaf "${id}" has no creature entry`);
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
    if (!NODES.has(id)) { errs.push(`date for unknown node "${id}"`); continue; }
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
  return errs;
}

// ── Calendar ────────────────────────────────────────────────────────────────

/** YYYY-MM-DD in the player's own calendar. */
export function localDateString(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

/** Kin number for a calendar date; counted in whole calendar days, so a
    daylight-saving change never skips or repeats one. */
export function dayNumber(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [ey, em, ed] = EPOCH.split('-').map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ey, em - 1, ed)) / 86400000) + 1;
}

export function msUntilMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next - now;
}

// ── What gets played ────────────────────────────────────────────────────────

const dailyMemo = new Map();

/**
 * The ten question ids for a Kin number. Days 1–4 are hand-picked; after
 * that a seeded draw, so every phone gets the same set without a server:
 * an opener from HOOKS, then nine more rising in difficulty, avoiding the
 * previous day's questions.
 */
export function dailyIds(day) {
  const n = Math.max(1, day | 0);
  if (n <= CURATED_DAYS.length) return CURATED_DAYS[n - 1].slice();
  if (dailyMemo.has(n)) return dailyMemo.get(n).slice();
  const prev = new Set(dailyIds(n - 1));
  const rand = mulberry32(hashString(`kin-day-${n}`));
  const hook = shuffled(HOOKS, rand).find(id => !prev.has(id)) || HOOKS[0];
  const rest = shuffled(QUESTIONS.map(q => q.id).filter(id => id !== hook && !prev.has(id)), rand)
    .slice(0, DAILY_SIZE - 1)
    .sort((a, b) => QUESTION_BY_ID[a].d - QUESTION_BY_ID[b].d);
  const ids = [hook, ...rest];
  dailyMemo.set(n, ids);
  return ids.slice();
}

/** Every question, easier first but mixed, in an order fixed by the seed. */
export function arcadeIds(seed) {
  const rand = mulberry32(seed >>> 0);
  return QUESTIONS
    .map(q => ({ id: q.id, k: q.d + rand() * 1.6 }))
    .sort((a, b) => a.k - b.k)
    .map(x => x.id);
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
