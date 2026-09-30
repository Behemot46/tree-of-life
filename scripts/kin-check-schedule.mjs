#!/usr/bin/env node
/**
 * A Kin day that anyone can already be playing is history: players have
 * answered it and shared their grid. This compares the calendar in the
 * working tree with the one on the base branch and fails if any day up to
 * the last playable one (today in UTC+14) has changed, or if a day has gone.
 *
 *   node scripts/kin-check-schedule.mjs                 compare with origin/main
 *   node scripts/kin-check-schedule.mjs --base FETCH_HEAD
 *
 * CI fetches main and passes FETCH_HEAD. A base without a calendar yet has no
 * history to protect, and passes.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { lastPlayableDay } from '../js/kin/calendar.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const base = argv.includes('--base') ? argv[argv.indexOf('--base') + 1] : 'origin/main';
const FILE = 'js/kin/schedule.js';

/* One day per line, as scripts/kin-build.mjs writes them. */
const days = (text) => [...text.matchAll(/^\s*'([^']*)',/gm)].map((m) => m[1]);
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

try { git('rev-parse', '--verify', '--quiet', `${base}^{commit}`); } catch {
  console.error(`✗ Cannot find ${base}. Fetch it first (git fetch origin main).`);
  process.exit(1);
}
let before;
try { before = days(git('show', `${base}:${FILE}`)); } catch {
  console.log(`✓ ${base} has no ${FILE} yet, so no day is history.`);
  process.exit(0);
}
const after = days(readFileSync(path.join(ROOT, FILE), 'utf8'));
const horizon = lastPlayableDay();

const errs = [];
if (after.length < before.length) errs.push(`the calendar shrank from ${before.length} to ${after.length} days`);
for (let n = 1; n <= Math.min(horizon, before.length); n++) {
  if (before[n - 1] !== after[n - 1]) errs.push(`Kin #${n} changed, and it is already being played`);
}
if (after.length - horizon < 30) errs.push(`only ${after.length - horizon} days are left in the calendar: run node scripts/kin-build.mjs --days ${after.length + 120}`);

if (errs.length) {
  for (const e of errs) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`✓ Kin #1–${Math.min(horizon, before.length)} match ${base}; ${after.length - horizon} days ahead in the calendar.`);
