#!/usr/bin/env node
/**
 * Kin (the front page) — browser checks.
 *
 *   node scripts/play-check.mjs                     # serves ./ and tests it
 *   node scripts/play-check.mjs --url https://...   # tests a deployed site
 *
 * Every scenario starts as a first-time visitor: nothing stored but the
 * language and theme. That is deliberate. The main smoke suite marks the tour
 * and the opening as already seen before every run, so it has never looked at
 * a first visit, and for a game the first visit is the whole product.
 *
 * Each scenario plays a full daily (alternating right and wrong answers so
 * both reveals are exercised), switches language in the middle of a reveal
 * and back, shares the result, reloads (a finished daily comes back as Home),
 * runs the arcade to its end and opens the stats.
 *
 * Then it meets the game as someone who has played before — Home, the stats
 * screen, resuming half a Kin — and, in four of the scenarios, as someone
 * holding a friend's link: a past Kin, an Arcade run to beat, and the streak
 * freeze that Arcade score earns and a missed day spends. Screenshots land in
 * .play-out/.
 *
 * Exit code 1 if any check fails.
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { localDateString, dayNumber } from '../js/kin/calendar.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/* Not under .smoke-out/: the smoke runner deletes that folder when it starts. */
const OUT = path.join(ROOT, '.play-out');
const argv = process.argv.slice(2);
const EXTERNAL_URL = argv.includes('--url') ? argv[argv.indexOf('--url') + 1] : null;
/* --only phone-ru,desktop-en,offline: just those scenarios or sweeps (front-door,
   offline, counting, every-reveal, emoji). It exists to prove a new check can fail
   (break the code, watch it go red, put the code back); a filtered run is
   never a green branch. */
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null;
const wants = (name) => !ONLY || ONLY.includes(name);

/* Fonts come from Google; a sandbox without access to them is not a defect
   in the game. Everything else that fails to load is. */
const IGNORABLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/* `flows` marks the scenarios that also play the long stories (a friend's Kin,
   a challenge, earning and spending a freeze): one of each language, and both
   kinds of screen. Home and the stats screen are checked in all of them. */
const SCENARIOS = [
  { name: 'phone-en', lang: 'en', theme: 'dark', viewport: { width: 390, height: 844 }, mobile: true, flows: true },
  { name: 'phone-he', lang: 'he', theme: 'dark', viewport: { width: 390, height: 844 }, mobile: true, flows: true },
  { name: 'small-phone-en', lang: 'en', theme: 'light', viewport: { width: 360, height: 640 }, mobile: true },
  { name: 'desktop-he', lang: 'he', theme: 'light', viewport: { width: 1440, height: 900 }, mobile: false },
  { name: 'desktop-en', lang: 'en', theme: 'dark', viewport: { width: 1440, height: 900 }, mobile: false, flows: true },
  /* Russian runs longest, so it takes the narrowest phone. */
  { name: 'small-phone-ru', lang: 'ru', theme: 'dark', viewport: { width: 360, height: 640 }, mobile: true, flows: true },
  { name: 'desktop-ru', lang: 'ru', theme: 'light', viewport: { width: 1440, height: 900 }, mobile: false },
];

/* Where Home's second tile leads: the encyclopedia. */
const ATLAS_HREF = 'atlas.html';

const LOCALE = { en: 'en-US', he: 'he-IL', ru: 'ru-RU' };
const BRAND = { en: 'Kin', he: 'קרובים', ru: 'Родня' };
/* Languages written in another script, where a Latin word is a leak. */
const SCRIPT = { he: 'hebrew', ru: 'russian' };

async function startServer() {
  if (EXTERNAL_URL) return { url: EXTERNAL_URL.replace(/\/$/, ''), stop: async () => {} };
  const port = Number(process.env.PLAY_PORT || 5598);
  const child = spawn(process.execPath, [path.join(ROOT, 'serve.js')], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(url + '/')).ok) break; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  return { url, stop: async () => { child.kill(); } };
}

const results = [];
function record(scenario, id, ok, msg = '') {
  results.push({ scenario, id, ok: !!ok, msg });
  process.stdout.write(`  ${ok ? '✓' : '✗'} ${id}${ok ? '' : `  — ${msg}`}\n`);
}

/* Geometry of the reveal, measured in the page. */
function measureReveal() {
  const fig = document.querySelector('.kin-tree');
  if (!fig) return null;
  const f = fig.getBoundingClientRect();
  const labs = [...fig.querySelectorAll('.kin-lab')].map((el) => {
    const r = el.getBoundingClientRect();
    return { cls: el.className, text: el.textContent.trim(), left: r.left, right: r.right, top: r.top, bottom: r.bottom };
  });
  return {
    fig: { left: f.left, right: f.right, top: f.top, bottom: f.bottom, width: f.width },
    labs,
    leaves: labs.filter((l) => l.cls.includes('kin-leaf')).length,
    dates: labs.filter((l) => l.cls.includes('kin-date')).length,
    verdict: (document.querySelector('.kin-verdict') || {}).textContent || '',
    explain: (document.querySelector('.kin-explain') || {}).textContent || '',
  };
}

const overlap = (a, b) => a.left < b.right - 0.5 && a.right > b.left + 0.5 && a.top < b.bottom - 0.5 && a.bottom > b.top + 0.5;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function runScenario(browser, base, sc) {
  process.stdout.write(`\n▸ ${sc.name}\n`);
  const context = await browser.newContext({ viewport: sc.viewport, isMobile: sc.mobile, hasTouch: sc.mobile, locale: LOCALE[sc.lang], serviceWorkers: 'block' });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base }).catch(() => {});
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  const failed = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  page.on('requestfailed', (r) => { if (!IGNORABLE_HOSTS.some((h) => r.url().includes(h))) failed.push(r.url()); });
  await context.addInitScript(({ lang, theme }) => {
    localStorage.setItem('tol-lang', lang);
    localStorage.setItem('theme', theme);
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  }, { lang: sc.lang, theme: sc.theme });

  const t0 = Date.now();
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
  let firstMs = null;
  try { await page.waitForSelector('.kin-opt', { timeout: 3000 }); firstMs = Date.now() - t0; } catch { /* too slow */ }
  record(sc.name, 'play:first-question-within-3s', firstMs !== null, 'no question after 3000 ms');

  const docLang = await page.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir }));
  record(sc.name, 'play:document-language', docLang.lang === sc.lang && docLang.dir === (sc.lang === 'he' ? 'rtl' : 'ltr'), JSON.stringify(docLang));

  const covered = await page.evaluate(() => [...document.querySelectorAll('.kin-opt')].map((b) => {
    const r = b.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return hit && b.contains(hit);
  }));
  record(sc.name, 'play:options-are-tappable', covered.length === 2 && covered.every(Boolean), `hit test ${JSON.stringify(covered)}`);

  /* The bar holds the name, the day's dots and a button per other language
     beside the sound toggle; a third language made it one button wider.
     Nothing in it may run off the screen or into its neighbour. */
  const bar = await page.evaluate(async () => {
    const { LANGS } = await import('./js/kin/strings.js');
    const box = (el) => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; };
    const parts = ['.kin-logo', '.kin-progress', '.kin-tools'].map((q) => box(document.querySelector(q)));
    const buttons = [...document.querySelectorAll('#kin-langs [data-lang]')];
    return {
      parts, width: document.documentElement.clientWidth,
      /* offsetTop, not the box: the dot for the question on screen is scaled up. */
      dots: [...document.querySelectorAll('.kin-dots i')].map((i) => i.offsetTop),
      dotsBox: (() => {
        const rs = [...document.querySelectorAll('.kin-dots i')].map((i) => i.getBoundingClientRect());
        return rs.length ? { left: Math.min(...rs.map((r) => r.left)), right: Math.max(...rs.map((r) => r.right)), top: Math.min(...rs.map((r) => r.top)), bottom: Math.max(...rs.map((r) => r.bottom)) } : null;
      })(),
      offered: buttons.map((b) => b.dataset.lang).sort(),
      expected: LANGS.filter((l) => l !== document.documentElement.lang).sort(),
    };
  });
  const barClash = bar.parts.some((a, i) => bar.parts.some((b, j) => i < j && overlap(a, b)));
  const barOut = bar.parts.some((p) => p.left < 0 || p.right > bar.width);
  record(sc.name, 'play:header-fits', !barClash && !barOut, JSON.stringify(bar.parts.map((p) => [Math.round(p.left), Math.round(p.right)])));
  /* Hebrew and Russian names are wider than "Kin": on a 390px phone the ten
     dots used to wrap onto a second line under the name. */
  record(sc.name, 'play:header-dots-stay-on-one-row', bar.dots.length === 10 && new Set(bar.dots).size === 1, JSON.stringify(bar.dots));
  /* ...and they give way before they run into the name or the buttons: in
     Russian on a 360px phone they once sat on top of the day number. */
  const [logoBox, , toolsBox] = bar.parts;
  record(sc.name, 'play:header-dots-clear-the-name-and-tools', !!bar.dotsBox && !overlap(bar.dotsBox, logoBox) && !overlap(bar.dotsBox, toolsBox) && bar.dotsBox.left >= 0 && bar.dotsBox.right <= bar.width, JSON.stringify(bar.dotsBox));
  record(sc.name, 'play:switcher-offers-the-other-languages', JSON.stringify(bar.offered) === JSON.stringify(bar.expected), `${bar.offered} vs ${bar.expected}`);
  await page.screenshot({ path: path.join(OUT, `${sc.name}-1-question.png`) });

  const problems = { fit: [], clash: [], mirror: [], latin: [], shape: [] };
  let langSwitchOk = null;
  let right = 0;
  for (let i = 0; i < 10; i++) {
    const near = await page.$eval('#kin-stage', (s) => s.dataset.near);
    const chooseRight = i % 2 === 0;
    const side = chooseRight ? near : (near === 'a' ? 'b' : 'a');
    if (chooseRight) right++;
    await page.click(`.kin-opt[data-side="${side}"]`);
    await page.waitForSelector('.kin-reveal');
    if (i === 0 || i === 4) await page.waitForTimeout(1600);
    const m = await page.evaluate(measureReveal);
    if (!m || m.leaves !== 3 || m.dates !== 2 || !m.verdict || !m.explain) problems.shape.push(`q${i + 1}: ${JSON.stringify({ leaves: m && m.leaves, dates: m && m.dates })}`);
    if (m) {
      for (const l of m.labs) {
        if (l.left < m.fig.left - 1 || l.right > m.fig.right + 1 || l.top < m.fig.top - 1 || l.bottom > m.fig.bottom + 1) problems.fit.push(`q${i + 1} "${l.text}"`);
      }
      for (let a = 0; a < m.labs.length; a++) for (let b = a + 1; b < m.labs.length; b++) {
        if (overlap(m.labs[a], m.labs[b])) problems.clash.push(`q${i + 1} "${m.labs[a].text}" × "${m.labs[b].text}"`);
      }
      const mid = m.fig.left + m.fig.width / 2;
      for (const l of m.labs.filter((x) => x.cls.includes('kin-leaf'))) {
        const onRight = (l.left + l.right) / 2 > mid;
        if (onRight !== (sc.lang !== 'he')) problems.mirror.push(`q${i + 1} "${l.text}"`);
      }
    }
    if (SCRIPT[sc.lang]) {
      const latin = await page.evaluate(() => {
        const stage = document.getElementById('kin-stage').cloneNode(true);
        stage.querySelectorAll('[data-kin-citation]').forEach((n) => n.remove());
        return (stage.textContent.match(/[A-Za-z]{2,}/g) || []).slice(0, 5);
      });
      if (latin.length) problems.latin.push(`q${i + 1}: ${latin.join(', ')}`);
    }
    if (i === 0 || i === 4) await page.screenshot({ path: path.join(OUT, `${sc.name}-2-reveal-q${i + 1}.png`) });

    /* Switching language mid-reveal must redraw the same answer, not skip
       to the next question — the answer is already recorded. */
    if (i === 2) {
      const before = await page.evaluate(() => ({ dots: document.querySelectorAll('.kin-dots i').length, done: document.querySelectorAll('.kin-dots i.ok, .kin-dots i.no').length }));
      await page.click('#kin-langs [data-lang]');
      const after = await page.evaluate(() => ({ lang: document.documentElement.lang, reveal: !!document.querySelector('.kin-reveal'), done: document.querySelectorAll('.kin-dots i.ok, .kin-dots i.no').length }));
      await page.click(`#kin-langs [data-lang="${sc.lang}"]`);
      const back = await page.evaluate(() => ({ lang: document.documentElement.lang, reveal: !!document.querySelector('.kin-reveal') }));
      langSwitchOk = after.lang !== sc.lang && after.reveal && after.done === before.done && back.lang === sc.lang && back.reveal;
    }
    /* Leave on the last reveal, before "See your result": coming back must
       show the result, not look for an eleventh question. */
    if (i === 9) { await page.reload({ waitUntil: 'domcontentloaded' }); break; }
    // If the reveal was lost, the next question is already showing: answer it.
    if (await page.$('#kin-next')) await page.click('#kin-next');
  }
  record(sc.name, 'play:reveal-draws-the-tree', !problems.shape.length, problems.shape.join('; '));
  record(sc.name, 'play:reveal-labels-fit', !problems.fit.length, problems.fit.slice(0, 4).join('; '));
  record(sc.name, 'play:reveal-labels-do-not-collide', !problems.clash.length, problems.clash.slice(0, 4).join('; '));
  record(sc.name, 'play:reveal-mirrors-for-the-language', !problems.mirror.length, problems.mirror.slice(0, 4).join('; '));
  if (SCRIPT[sc.lang]) record(sc.name, `play:${SCRIPT[sc.lang]}-has-no-latin-text`, !problems.latin.length, problems.latin.slice(0, 3).join(' | '));
  record(sc.name, 'play:language-switch-keeps-the-reveal', langSwitchOk === true, 'reveal lost or answer recorded twice');

  const resumed = await page.waitForSelector('.kin-res', { timeout: 3000 }).then(() => true, () => false);
  record(sc.name, 'play:leaving-on-the-last-answer-keeps-the-result', resumed, 'no result screen after reloading on the last reveal');
  const res = await page.evaluate(() => ({
    score: (document.querySelector('.kin-score') || {}).textContent || '',
    grid: [...((document.querySelector('.kin-grid') || {}).textContent || '')].filter((c) => c === '🟩' || c === '🟥').length,
  }));
  record(sc.name, 'play:results-show-score-and-grid', res.score.replace(/\s/g, '') === `${right}/10` && res.grid === 10, JSON.stringify(res));
  /* Ten squares in a row, never ten over two lines. */
  const grid = await page.evaluate(() => {
    const g = document.querySelector('.kin-grid');
    if (!g) return null;
    const r = g.getBoundingClientRect();
    return { height: r.height, font: parseFloat(getComputedStyle(g).fontSize), scrollW: g.scrollWidth, clientW: g.clientWidth, left: r.left, right: r.right, vw: document.documentElement.clientWidth };
  });
  record(sc.name, 'play:results-grid-stays-on-one-line', !!grid && grid.height <= grid.font * 1.6 && grid.scrollW <= grid.clientW + 1 && grid.left >= 0 && grid.right <= grid.vw, JSON.stringify(grid));
  await page.screenshot({ path: path.join(OUT, `${sc.name}-3-results.png`), fullPage: true });

  await page.click('#kin-share-btn');
  await page.waitForTimeout(300);
  const shared = await page.evaluate(async () => {
    try { return await navigator.clipboard.readText(); } catch { return (document.getElementById('kin-share-text') || {}).value || ''; }
  });
  const brand = BRAND[sc.lang];
  /* The link names the Kin and the sender's language, so it opens the same
     questions in the same words — not the front page. */
  const shareRe = new RegExp(`^${brand} #\\d+ · ${right}/10 🌳\\n(?:🟩|🟥){10}\\n${escapeRe(base)}/\\?kin=\\d+${sc.lang === 'en' ? '' : `&lang=${sc.lang}`}$`);
  record(sc.name, 'play:share-text', shareRe.test(shared), JSON.stringify(shared));

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  record(sc.name, 'play:no-horizontal-scroll', overflow <= 0, `${overflow}px wider than the screen`);

  /* A finished Kin is not a place to return to: the player lands on Home,
     which shows the result they earned and what is next. */
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.kin-home, .kin-opt', { timeout: 3000 });
  const homeAfter = await page.evaluate(() => ({
    home: !!document.querySelector('.kin-home'),
    question: !!document.querySelector('.kin-opt'),
    score: ((document.querySelector('.kin-today .kin-score') || {}).textContent || '').replace(/\s/g, ''),
    squares: [...((document.querySelector('.kin-today .kin-grid') || {}).textContent || '')].filter((c) => c === '🟩' || c === '🟥').length,
  }));
  record(sc.name, 'play:finished-daily-returns-to-home-with-its-result', homeAfter.home && !homeAfter.question && homeAfter.score === `${right}/10` && homeAfter.squares === 10, JSON.stringify(homeAfter));

  /* Arcade: two right answers, then three wrong ones, and the run is over. */
  await page.click('[data-action="kin:arcade"]');
  await page.waitForSelector('.kin-opt');
  for (let i = 0; i < 5; i++) {
    const near = await page.$eval('#kin-stage', (s) => s.dataset.near);
    const side = i < 2 ? near : (near === 'a' ? 'b' : 'a');
    await page.click(`.kin-opt[data-side="${side}"]`);
    await page.waitForSelector('.kin-reveal');
    if (i === 1) {
      /* The Arcade's status — the word, the hearts, the points — beside the name and the buttons. */
      const a = await page.evaluate(() => {
        const box = (el) => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; };
        const lines = (el) => { const r = document.createRange(); r.selectNodeContents(el); return new Set([...r.getClientRects()].map((q) => Math.round(q.top / 6))).size; };
        const parts = [...document.querySelectorAll('.kin-logo, .kin-tools, .kin-progress > *')];
        /* Only the status text can wrap: the name and the buttons hold boxes of their own. */
        const status = [...document.querySelectorAll('.kin-progress > *')];
        return { boxes: parts.map(box), wrapped: status.filter((e) => lines(e) > 1).map((e) => e.textContent.trim()), width: document.documentElement.clientWidth };
      });
      const clash = a.boxes.some((p, x) => a.boxes.some((q, y) => x < y && overlap(p, q)));
      const out = a.boxes.some((p) => p.left < 0 || p.right > a.width);
      record(sc.name, 'play:arcade-header-fits', !clash && !out && !a.wrapped.length, JSON.stringify({ clash, out, wrapped: a.wrapped }));
    }
    if (i === 3) await page.screenshot({ path: path.join(OUT, `${sc.name}-4-arcade.png`) });
    await page.click('#kin-next');
  }
  const over = await page.evaluate(() => ({
    over: !!document.querySelector('.kin-res'),
    score: (document.querySelector('.kin-score') || {}).textContent || '',
    lost: document.querySelectorAll('.kin-hearts .lost').length,
  }));
  record(sc.name, 'play:arcade-ends-after-three-misses', over.over && over.score.trim() === '2' && over.lost === 3, JSON.stringify(over));

  /* ?stats=1 is how testers were sent to their numbers; it still opens them. */
  await page.goto(`${base}/?stats=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.kin-stats table');
  const stats = await page.$$eval('.kin-stats tr[data-stat]', (rows) => Object.fromEntries(rows.map((r) => [r.dataset.stat, r.querySelector('td').textContent.trim()])));
  record(sc.name, 'play:stats-count-what-was-played', stats.dailies === '1' && stats['arcade-runs'] === '1' && /^15\b/.test(stats.answers || '') && stats.streak === '1', JSON.stringify(stats));
  await page.screenshot({ path: path.join(OUT, `${sc.name}-5-stats.png`) });

  const csp = await page.evaluate(() => window.__csp || []);
  record(sc.name, 'play:no-csp-violations', !csp.length, csp.slice(0, 3).join('; '));
  record(sc.name, 'play:no-script-errors', !errors.length, errors.slice(0, 3).join('; '));
  record(sc.name, 'play:no-failed-requests', !failed.length, failed.slice(0, 3).join('; '));
  await context.close();
}

// ── Someone who has played before ───────────────────────────────────────────
//
// The first visit above is the whole product for a newcomer. Everything below
// is the game as a returning player meets it: Home, their numbers, half a Kin
// left on the table, and the links friends send.

const dateAgo = (n) => { const t = new Date(); return localDateString(new Date(t.getFullYear(), t.getMonth(), t.getDate() - n)); };
const todayNo = () => dayNumber(dateAgo(0));

/** Played the last three days running, one freeze in hand, today not begun. */
function returning(over = {}) {
  return {
    daily: null,
    streak: { last: dateAgo(1), count: 3, best: 5, freezes: 1, froze: false },
    history: { 101: 8, 102: 6, 103: 10, 104: 4 },
    sound: false,
    seenIntro: true,
    stats: { firstSeen: dateAgo(3), days: [dateAgo(3), dateAgo(2), dateAgo(1)], dailies: 4, answers: 60, correct: 41, arcadeRuns: 3, bestArcade: 12, shares: 2 },
    ...over,
  };
}

/**
 * One visit in its own browser context, in the scenario's window, language and
 * theme, optionally holding a saved record. The record is seeded once: an init
 * script runs again on every navigation and must not undo what the page has
 * saved since.
 */
async function visit(browser, base, sc, { state = null, query = '', context: ctx = {}, init = null, before = null } = {}) {
  const context = await browser.newContext({ viewport: sc.viewport, isMobile: sc.mobile, hasTouch: sc.mobile, locale: LOCALE[sc.lang], serviceWorkers: 'block', ...ctx });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base }).catch(() => {});
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const seen = { errors: [], failed: [] };
  page.on('pageerror', (e) => seen.errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) seen.errors.push(m.text()); });
  page.on('requestfailed', (r) => { if (!IGNORABLE_HOSTS.some((h) => r.url().includes(h))) seen.failed.push(r.url()); });
  await context.addInitScript(({ lang, theme, state }) => {
    localStorage.setItem('tol-lang', lang);
    localStorage.setItem('theme', theme);
    if (state && localStorage.getItem('kin-v1') === null) localStorage.setItem('kin-v1', JSON.stringify(state));
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  }, { lang: sc.lang, theme: sc.theme, state });
  if (init) await context.addInitScript(init);
  if (before) await before(context, page);
  await page.goto(`${base}/${query}`, { waitUntil: 'domcontentloaded' });
  return { context, page, seen };
}

/** What the page has saved. */
const saved = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('kin-v1') || 'null'));

/** A line from the page's own strings, in this language: a string, or a function of `args`. */
const say = (page, lang, key, ...args) => page.evaluate(async ([l, k, a]) => {
  const { STRINGS } = await import('./js/kin/strings.js');
  const v = STRINGS[l][k];
  return typeof v === 'function' ? v(...a) : v;
}, [lang, key, args]);

/** Answers the question on screen, rightly or not, and goes on to the next screen. */
async function answer(page, right, { advance = true } = {}) {
  const near = await page.$eval('#kin-stage', (s) => s.dataset.near);
  const side = right ? near : (near === 'a' ? 'b' : 'a');
  await page.click(`.kin-opt[data-side="${side}"]`);
  await page.waitForSelector('.kin-reveal');
  if (advance) await page.click('#kin-next');
}

/** The text a Share button handed to the clipboard (or left in the box beside it). */
const sharedText = async (page) => {
  await page.waitForTimeout(300);
  return page.evaluate(async () => {
    try { return await navigator.clipboard.readText(); } catch { return (document.getElementById('kin-share-text') || {}).value || ''; }
  });
};

/** Runs a step that may throw (a screen that never comes) and says whether it held. */
const attempt = async (fn) => { try { await fn(); return { ok: true, why: '' }; } catch (e) { return { ok: false, why: String(e.message || e).split('\n')[0] }; } };

const cleanRun = (sc, id, seens) => {
  const errors = seens.flatMap((s) => s.errors), failed = seens.flatMap((s) => s.failed);
  record(sc.name, `play:${id}`, !errors.length && !failed.length, [...errors, ...failed].slice(0, 3).join('; '));
};

/** Home for someone who has played: their streak, today's Kin, the Arcade and the Atlas. */
async function checkHome(browser, base, sc) {
  const R = (id, ok, msg) => record(sc.name, `play:${id}`, ok, msg);
  const { context, page, seen } = await visit(browser, base, sc, { state: returning() });
  await page.waitForSelector('.kin-home, .kin-opt', { timeout: 3000 }).catch(() => {});
  const landed = await page.evaluate(() => ({ home: !!document.querySelector('.kin-home'), question: !!document.querySelector('.kin-opt') }));
  R('returning-player-lands-on-home', landed.home && !landed.question, JSON.stringify(landed));
  if (!landed.home) { await context.close(); return; }

  const h = await page.evaluate(async (lang) => {
    const { STRINGS } = await import('./js/kin/strings.js');
    const T = STRINGS[lang];
    const text = (q) => { const e = document.querySelector(q); return e ? e.textContent.trim() : null; };
    /* Below the fold is not covered: bring a control into view, then ask what is at its centre. */
    const hit = (e) => { e.scrollIntoView({ block: 'nearest' }); const r = e.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!top && e.contains(top); };
    const tiles = [...document.querySelectorAll('.kin-tile')];
    const playBottom = document.querySelector('.kin-today .kin-btn').getBoundingClientRect().bottom;
    const controls = [...document.querySelectorAll('.kin-today .kin-btn, .kin-tile, .kin-linkrow .kin-link, #kin-home, .kin-tool')].map((e) => {
      const r = e.getBoundingClientRect();
      return { name: `${e.tagName.toLowerCase()}.${e.className.split(' ')[0]}`, height: r.height, covered: !hit(e), min: e.matches('.kin-tool, #kin-home') ? 24 : 44 };
    });
    return {
      streakLine: text('.kin-streakline'), wantStreak: T.streakKeep,
      chip: text('.kin-chip'), wantChip: T.freezes(1),
      centre: text('.kin-dial-in'),
      dial: document.querySelector('.kin-dial').getAttribute('aria-label'), wantDial: T.dialLabel(3),
      ticks: document.querySelectorAll('.kin-tick').length, on: document.querySelectorAll('.kin-tick.on').length, nowOn: !!document.querySelector('.kin-tick.now.on'),
      play: text('.kin-today .kin-btn'), wantPlay: T.homePlay,
      sub: text('.kin-today .kin-sub'), wantSub: T.homeSub,
      eyebrow: text('.kin-today .kin-eyebrow'),
      tileTexts: tiles.map((t) => [t.querySelector('b').textContent.trim(), t.querySelector('b + span').textContent.trim()]),
      wantTiles: [[T.homeArcade, T.homeArcadeSub(12)], [T.homeAtlas, T.homeAtlasSub]],
      atlas: (document.querySelector('a.kin-tile') || {}).getAttribute && document.querySelector('a.kin-tile').getAttribute('href'),
      playBottom, vh: innerHeight,
      controls, scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
      latin: (document.getElementById('kin-stage').textContent.match(/[A-Za-z]{2,}/g) || []).slice(0, 5),
    };
  }, sc.lang);
  R('home-states-streak-and-freeze', h.streakLine === h.wantStreak && h.chip === h.wantChip && h.centre === '3', JSON.stringify({ line: h.streakLine, chip: h.chip, centre: h.centre }));
  R('home-dial-marks-the-days-played', h.ticks === 7 && h.on === 3 && !h.nowOn && h.dial === h.wantDial, JSON.stringify({ ticks: h.ticks, on: h.on, today: h.nowOn, label: h.dial }));
  R('home-speaks-the-readers-language', h.play === h.wantPlay && h.sub === h.wantSub && JSON.stringify(h.tileTexts) === JSON.stringify(h.wantTiles) && !(SCRIPT[sc.lang] && h.latin.length), JSON.stringify({ play: h.play, sub: h.sub, tiles: h.tileTexts, latin: h.latin }));
  R('home-fits-and-is-reachable', h.scrollW <= h.clientW && h.playBottom <= h.vh && h.controls.every((c) => !c.covered && c.height >= c.min),
    JSON.stringify({ scrollW: h.scrollW, clientW: h.clientW, playBottom: Math.round(h.playBottom), vh: h.vh, bad: h.controls.filter((c) => c.covered || c.height < c.min) }));
  R('home-atlas-tile-links-to-the-atlas', h.atlas === ATLAS_HREF, String(h.atlas));
  await page.screenshot({ path: path.join(OUT, `${sc.name}-6-home.png`), fullPage: true });

  /* Play starts today's Kin at question one. */
  await page.click('.kin-today .kin-btn');
  await page.waitForSelector('.kin-opt');
  const started = await page.evaluate(() => {
    const dots = [...document.querySelectorAll('.kin-dots i')];
    return { dots: dots.length, now: dots.findIndex((i) => i.classList.contains('now')), num: document.getElementById('kin-num').textContent };
  });
  R('home-play-starts-todays-kin', started.dots === 10 && started.now === 0 && started.num === `#${todayNo()}`, JSON.stringify(started));

  /* Half a Kin is kept: a reload carries on at question four, and Home offers to. */
  for (let i = 0; i < 3; i++) await answer(page, i !== 1);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.kin-home, .kin-opt', { timeout: 3000 });
  const resumed = await page.evaluate(() => {
    const dots = [...document.querySelectorAll('.kin-dots i')];
    return { home: !!document.querySelector('.kin-home'), done: dots.filter((i) => i.classList.contains('ok') || i.classList.contains('no')).length, now: dots.findIndex((i) => i.classList.contains('now')) };
  });
  R('reload-mid-daily-resumes', !resumed.home && resumed.done === 3 && resumed.now === 3, JSON.stringify(resumed));

  await page.click('#kin-home');
  await page.waitForSelector('.kin-home');
  const cont = await page.evaluate(() => ({ btn: document.querySelector('.kin-today .kin-btn').textContent.trim(), sub: document.querySelector('.kin-today .kin-sub').textContent.trim() }));
  R('home-continues-a-daily-in-progress', cont.btn === await say(page, sc.lang, 'homeContinue') && cont.sub === await say(page, sc.lang, 'homeProgress', 3, 10), JSON.stringify(cont));

  const toStats = await attempt(async () => {
    await page.click('.kin-linkrow .kin-link');
    await page.waitForSelector('.kin-stats');
    await page.click('.kin-stats [data-action="kin:home"]');
    await page.waitForSelector('.kin-home');
  });
  R('stats-open-from-home-and-back', toStats.ok, toStats.why);

  const csp = await page.evaluate(() => window.__csp || []);
  R('home-no-csp-violations', !csp.length, csp.slice(0, 3).join('; '));
  cleanRun(sc, 'home-no-script-errors-or-failed-requests', [seen]);
  await context.close();
}

/** The stats screen, from a record with known numbers. */
async function checkStats(browser, base, sc) {
  const R = (id, ok, msg) => record(sc.name, `play:${id}`, ok, msg);
  const { context, page, seen } = await visit(browser, base, sc, { state: returning(), query: '?stats=1' });
  await page.waitForSelector('.kin-stats table');
  const s = await page.evaluate(() => {
    const lines = (el) => { const r = document.createRange(); r.selectNodeContents(el); return new Set([...r.getClientRects()].map((q) => Math.round(q.top / 8))).size; };
    return {
      rows: Object.fromEntries([...document.querySelectorAll('.kin-stats tr[data-stat]')].map((r) => [r.dataset.stat, r.querySelector('td').textContent.trim()])),
      wrapped: [...document.querySelectorAll('.kin-stats td, .kin-dist-l, .kin-dist b')].filter((e) => lines(e) > 1).map((e) => e.textContent.trim()),
      tiers: [...document.querySelectorAll('.kin-dist li[data-tier]')].map((li) => ({
        tier: Number(li.dataset.tier), n: Number(li.querySelector('b').textContent),
        fill: li.querySelector('.kin-dist-bar i').getBoundingClientRect().width, track: li.querySelector('.kin-dist-bar').getBoundingClientRect().width,
      })).sort((a, b) => a.tier - b.tier),
      scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
    };
  });
  const want = { streak: '3', 'best-streak': '5', dailies: '4', average: '7/10', best: '10/10', 'arcade-runs': '3', 'arcade-best': '12', shares: '2', first: dateAgo(3) };
  const off = Object.entries(want).filter(([k, v]) => s.rows[k] !== v).map(([k, v]) => `${k}: "${s.rows[k]}" for "${v}"`);
  if (!/^60\b/.test(s.rows.answers || '')) off.push(`answers: "${s.rows.answers}"`);
  R('stats-rows-match-the-record', !off.length, off.join('; '));
  /* 8, 6, 10 and 4 of ten land on four different titles; the lowest has none. */
  R('stats-distribution-counts-each-title', JSON.stringify(s.tiers.map((t) => t.n)) === '[0,1,1,1,1]' && s.tiers.every((t) => (t.n ? t.fill > t.track - 1 : t.fill < 1)), JSON.stringify(s.tiers));
  R('stats-fit-without-wrapping', !s.wrapped.length && s.scrollW <= s.clientW && s.tiers.every((t) => t.track >= 40), JSON.stringify({ wrapped: s.wrapped, scrollW: s.scrollW, clientW: s.clientW, tracks: s.tiers.map((t) => Math.round(t.track)) }));
  await page.screenshot({ path: path.join(OUT, `${sc.name}-7-stats-seeded.png`), fullPage: true });

  /* Erasing the record asks twice, in place: the site raises no native dialog. */
  const armedLabel = await attempt(async () => { await page.click('#kin-reset'); });
  const armed = await page.evaluate(() => ({ armed: document.getElementById('kin-reset').dataset.armed, label: document.getElementById('kin-reset').textContent.trim() }));
  const stillThere = await saved(page);
  R('stats-erase-asks-twice', armedLabel.ok && armed.armed === '1' && armed.label === await say(page, sc.lang, 'statsResetSure') && stillThere.stats.answers === 60, JSON.stringify({ armed, answers: stillThere && stillThere.stats.answers }));
  await page.click('#kin-reset');
  const erased = await attempt(() => page.waitForSelector('.kin-home'));
  const after = await saved(page);
  R('stats-erase-clears-the-record', erased.ok && after.stats.answers === 0 && after.streak.count === 0 && Object.keys(after.history).length === 0 && (await page.$eval('.kin-streakline', (e) => e.textContent.trim())) === await say(page, sc.lang, 'streakStart'),
    erased.ok ? JSON.stringify({ answers: after.stats.answers, streak: after.streak.count, history: Object.keys(after.history).length }) : erased.why);
  cleanRun(sc, 'stats-no-script-errors-or-failed-requests', [seen]);
  await context.close();
}

/** The long stories: a friend's Kin, a friend's Arcade run, and a freeze earned and spent. */
async function checkFlows(browser, base, sc) {
  const R = (id, ok, msg) => record(sc.name, `play:${id}`, ok, msg);
  const seens = [];
  const lang = sc.lang;
  const suffix = lang === 'en' ? '' : `&lang=${lang}`;

  /* ── A friend's Kin: a past day, played once and not kept ── */
  {
    const { context, page, seen } = await visit(browser, base, sc, { query: '?kin=1' });
    seens.push(seen);
    await page.waitForSelector('.kin-opt');
    const f = await page.evaluate(async (l) => {
      const E = await import('./js/kin/engine.js');
      const { CREATURES } = await import('./js/kin/creatures.js');
      const { STRINGS } = await import('./js/kin/strings.js');
      const q = E.QUESTION_BY_ID[E.dailyIds(1)[0]];
      return {
        banner: (document.querySelector('.kin-banner') || {}).textContent, want: STRINGS[l].friendBanner(1),
        target: document.querySelector('.kin-target .kin-nm').textContent.trim(), wantTarget: CREATURES[q.t][l].n,
        num: document.getElementById('kin-num').textContent,
      };
    }, lang);
    R('friend-link-opens-that-kin', f.banner === f.want && f.target === f.wantTarget && f.num === '#1', JSON.stringify(f));
    await page.screenshot({ path: path.join(OUT, `${sc.name}-8-friend.png`) });
    for (let i = 0; i < 10; i++) await answer(page, i % 3 !== 0);
    await page.waitForSelector('.kin-res');
    const res = await page.evaluate(() => ({ streak: !!document.querySelector('.kin-streak'), eyebrow: document.querySelector('.kin-eyebrow').textContent.trim(), today: (document.querySelector('[data-action="kin:today"]') || {}).textContent, arcade: !!document.querySelector('.kin-res [data-action="kin:arcade"]') }));
    R('friend-result-offers-todays-kin-and-no-streak', !res.streak && !res.arcade && (res.today || '').trim() === await say(page, lang, 'playToday') && res.eyebrow === await say(page, lang, 'resultEyebrow', 1), JSON.stringify(res));
    await page.click('#kin-share-btn');
    const shared = await sharedText(page);
    R('friend-result-shares-that-kin', new RegExp(`\\n${escapeRe(base)}/\\?kin=1${suffix}$`).test(shared), JSON.stringify(shared));
    const rec = await saved(page);
    const kept = rec.stats.answers === 0 && rec.stats.correct === 0 && rec.stats.dailies === 0 && rec.stats.days.length === 0 && rec.streak.count === 0 && rec.daily.picks.length === 0 && Object.keys(rec.history).length === 0;
    R('friend-link-leaves-the-record-alone', kept, JSON.stringify({ stats: rec.stats, streak: rec.streak.count, picks: rec.daily.picks.length, history: rec.history }));
    await page.click('[data-action="kin:today"]');
    await page.waitForSelector('.kin-opt');
    const mine = await page.evaluate(() => ({ banner: !!document.querySelector('.kin-banner'), num: document.getElementById('kin-num').textContent }));
    R('friend-result-leads-into-todays-own-kin', !mine.banner && mine.num === `#${todayNo()}`, JSON.stringify(mine));
    await context.close();
  }

  /* ── A link to today's Kin is just today's Kin; a mangled link asks for nothing ── */
  {
    const { context, page, seen } = await visit(browser, base, sc, { query: `?kin=${todayNo()}` });
    seens.push(seen);
    await page.waitForSelector('.kin-opt');
    const same = await page.evaluate(() => ({ banner: !!document.querySelector('.kin-banner'), num: document.getElementById('kin-num').textContent }));
    R('a-link-to-todays-kin-is-todays-kin', !same.banner && same.num === `#${todayNo()}`, JSON.stringify(same));
    await context.close();
  }
  {
    const { context, page, seen } = await visit(browser, base, sc, { query: '?kin=0&c=abc&s=-1&stats=yes&lang=xx' });
    seens.push(seen);
    const ok = await attempt(() => page.waitForSelector('.kin-opt'));
    const odd = await page.evaluate(() => ({ banner: !!document.querySelector('.kin-banner'), stats: !!document.querySelector('.kin-stats'), lang: document.documentElement.lang }));
    R('mangled-links-ask-for-nothing', ok.ok && !odd.banner && !odd.stats && odd.lang === lang, JSON.stringify(odd));
    await context.close();
  }

  /* ── A friend's Arcade run: the same questions, and a score to beat ── */
  {
    const { context, page, seen } = await visit(browser, base, sc, { query: '?c=12345&s=4' });
    seens.push(seen);
    await page.waitForSelector('.kin-opt');
    const c = await page.evaluate(async (l) => {
      const E = await import('./js/kin/engine.js');
      const { CREATURES } = await import('./js/kin/creatures.js');
      const { STRINGS } = await import('./js/kin/strings.js');
      const q = E.QUESTION_BY_ID[E.arcadeIds(12345)[0]];
      return {
        banner: (document.querySelector('.kin-banner') || {}).textContent, want: STRINGS[l].challengeBanner(4),
        target: document.querySelector('.kin-target .kin-nm').textContent.trim(), wantTarget: CREATURES[q.t][l].n,
        mode: (document.querySelector('.kin-mode') || {}).textContent, wantMode: STRINGS[l].arcade,
      };
    }, lang);
    R('challenge-link-starts-that-run', c.banner === c.want && c.target === c.wantTarget && c.mode === c.wantMode, JSON.stringify(c));
    await page.screenshot({ path: path.join(OUT, `${sc.name}-9-challenge.png`) });
    for (let i = 0; i < 3; i++) await answer(page, false);
    await page.waitForSelector('.kin-res');
    const over = await page.evaluate(() => ({ versus: (document.querySelector('.kin-streak') || {}).textContent, button: !!document.getElementById('kin-challenge-btn') }));
    R('challenge-result-says-how-it-went', over.button && (over.versus || '').trim() === await say(page, lang, 'challengeResult', 0, 4), JSON.stringify(over));
    await page.click('#kin-challenge-btn');
    const shared = await sharedText(page);
    R('challenge-share-carries-the-seed-and-the-score', new RegExp(`\\n${escapeRe(base)}/\\?c=12345&s=0${suffix}$`).test(shared), JSON.stringify(shared));
    await context.close();
  }

  /* ── Ten in the Arcade earns a streak freeze ── */
  {
    const { context, page, seen } = await visit(browser, base, sc, { state: returning({ streak: { last: dateAgo(1), count: 3, best: 5, freezes: 0, froze: false } }) });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    await page.click('[data-action="kin:arcade"]');
    await page.waitForSelector('.kin-opt');
    for (let i = 0; i < 10; i++) await answer(page, true);
    for (let i = 0; i < 3; i++) await answer(page, false);
    await page.waitForSelector('.kin-res');
    const earned = await page.evaluate(() => [...document.querySelectorAll('.kin-res .kin-streak')].map((e) => e.textContent.trim()));
    const line = await say(page, lang, 'freezeEarned', 1);
    R('ten-in-the-arcade-earns-a-freeze', earned.includes(line) && (await saved(page)).streak.freezes === 1, JSON.stringify({ earned, want: line }));
    await page.click('[data-action="kin:today"]');
    await page.click('#kin-home');
    await page.waitForSelector('.kin-home');
    R('home-shows-the-freeze-in-hand', (await page.$eval('.kin-chip', (e) => e.textContent.trim())) === await say(page, lang, 'freezes', 1), 'no chip after earning one');
    await context.close();
  }

  /* ── A missed day is covered by a freeze, and the freeze is spent ── */
  {
    const state = returning({
      streak: { last: dateAgo(2), count: 3, best: 5, freezes: 1, froze: false },
      stats: { ...returning().stats, days: [dateAgo(4), dateAgo(3), dateAgo(2)] },
    });
    const { context, page, seen } = await visit(browser, base, sc, { state });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    const covered = await page.$eval('.kin-streakline', (e) => e.textContent.trim());
    R('home-says-a-freeze-covers-the-missed-day', covered === await say(page, lang, 'streakCovered'), covered);
    await page.click('.kin-today .kin-btn');
    await page.waitForSelector('.kin-opt');
    for (let i = 0; i < 10; i++) await answer(page, i % 2 === 0);
    await page.waitForSelector('.kin-res');
    const done = await page.evaluate(() => ({ streak: (document.querySelector('.kin-streak') || {}).textContent, note: (document.querySelector('.kin-note') || {}).textContent }));
    const rec = await saved(page);
    R('a-missed-day-spends-a-freeze-and-keeps-the-streak',
      (done.streak || '').trim() === await say(page, lang, 'streak', 4) && (done.note || '').trim() === await say(page, lang, 'freezeUsed') && rec.streak.count === 4 && rec.streak.freezes === 0,
      JSON.stringify({ done, count: rec.streak.count, freezes: rec.streak.freezes }));
    await context.close();
  }

  /* ── A broken streak starts over without blame ── */
  {
    const state = returning({ streak: { last: dateAgo(6), count: 6, best: 6, freezes: 0, froze: false }, stats: { ...returning().stats, days: [dateAgo(9), dateAgo(8), dateAgo(7), dateAgo(6)] } });
    const { context, page, seen } = await visit(browser, base, sc, { state });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    const b = await page.evaluate(() => ({ line: document.querySelector('.kin-streakline').textContent.trim(), sprout: !!document.querySelector('.kin-dial-leaf'), number: !!document.querySelector('.kin-dial-in b') }));
    R('a-broken-streak-starts-over-without-blame', b.line === await say(page, lang, 'streakStart') && b.sprout && !b.number, JSON.stringify(b));
    await context.close();
  }

  cleanRun(sc, 'flows-no-script-errors-or-failed-requests', seens);
}

// ── The home screen, offline, and counting ──────────────────────────────────

const IOS_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

/** What Chrome hands a page that may offer the home screen, stood in for by an event with the same two members. */
const fireInstallDialog = (page, choice = 'accepted') => page.evaluate((c) => {
  const e = new Event('beforeinstallprompt', { cancelable: true });
  e.prompt = () => { window.__prompted = (window.__prompted || 0) + 1; return Promise.resolve(); };
  e.userChoice = Promise.resolve({ outcome: c, platform: 'web' });
  window.dispatchEvent(e);
}, choice);

/** The offer on Home: who gets it, what it says, what its buttons do, and that it is asked for once. */
async function checkInstall(browser, base, sc) {
  const R = (id, ok, msg) => record(sc.name, `play:${id}`, ok, msg);
  const seens = [];
  const eligible = returning();            // four finished Kins: past the two that earn the ask
  const card = (page) => page.$('.kin-install');

  /* The browser offers its dialog: the card appears, reads right, and Install uses the dialog. */
  {
    const { context, page, seen } = await visit(browser, base, sc, { state: eligible });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    const before = await card(page) !== null;
    await fireInstallDialog(page);
    const shown = await attempt(() => page.waitForSelector('.kin-install[data-offer="prompt"]', { timeout: 2000 }));
    R('install-card-appears-when-the-browser-offers-it', !before && shown.ok, before ? 'the card was there before the browser offered anything' : shown.why);
    if (shown.ok) {
      const c = await page.evaluate(async (lang) => {
        const { STRINGS } = await import('./js/kin/strings.js');
        const T = STRINGS[lang];
        const el = document.querySelector('.kin-install');
        const box = (e) => { const b = e.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, height: b.height }; };
        const hit = (e) => { e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!top && e.contains(top); };
        const buttons = [...el.querySelectorAll('button')];
        const icon = el.querySelector('img');
        const tx = el.querySelector('.kin-install-tx');
        return {
          text: [el.querySelector('b').textContent.trim(), el.querySelector('span').textContent.trim(), ...buttons.map((b) => b.textContent.trim())],
          want: [T.installTitle, T.installSub, T.installBtn, T.installNot],
          named: el.getAttribute('aria-label') === T.installTitle,
          latin: (el.textContent.match(/[A-Za-z]{2,}/g) || []).slice(0, 4),
          card: box(el), icon: box(icon), tx: box(tx), iconLoaded: icon.complete && icon.naturalWidth > 0,
          buttons: buttons.map((b) => ({ ...box(b), covered: !hit(b) })),
          vw: document.documentElement.clientWidth, scrollW: document.documentElement.scrollWidth, dir: document.documentElement.dir,
        };
      }, sc.lang);
      R('install-card-speaks-the-readers-language', JSON.stringify(c.text) === JSON.stringify(c.want) && c.named && !(SCRIPT[sc.lang] && c.latin.length), JSON.stringify({ text: c.text, named: c.named, latin: c.latin }));
      const iconFirst = c.dir === 'rtl' ? c.icon.left >= c.tx.right - 1 : c.icon.right <= c.tx.left + 1;
      R('install-card-fits-and-is-reachable', c.card.left >= 0 && c.card.right <= c.vw && c.scrollW <= c.vw && c.iconLoaded && iconFirst && c.buttons.every((b) => b.height >= 44 && !b.covered && b.left >= 0 && b.right <= c.vw),
        JSON.stringify({ card: [Math.round(c.card.left), Math.round(c.card.right)], vw: c.vw, scrollW: c.scrollW, icon: c.iconLoaded, iconFirst, buttons: c.buttons.map((b) => [Math.round(b.height), b.covered]) }));
      await page.screenshot({ path: path.join(OUT, `${sc.name}-10-install.png`), fullPage: true });
      await page.click('.kin-install [data-action="kin:install"]');
      const gone = await attempt(() => page.waitForSelector('.kin-install', { state: 'detached', timeout: 2000 }));
      const prompted = await page.evaluate(() => window.__prompted || 0);
      R('install-button-uses-the-browsers-dialog-once', gone.ok && prompted === 1, `dialog opened ${prompted} time(s); card ${gone.ok ? 'gone' : 'still there'}`);
      await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.kin-home');
      const rec = await saved(page);
      R('an-installed-game-is-not-offered-again', rec.install.installed === true && await card(page) === null, JSON.stringify(rec.install));
    }
    await context.close();
  }

  /* "Not now" is kept for a month; past that, the offer returns. */
  {
    const { context, page, seen } = await visit(browser, base, sc, { state: eligible });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    await fireInstallDialog(page);
    const shown = await attempt(() => page.waitForSelector('.kin-install'));
    let ok = shown.ok, why = shown.why;
    if (shown.ok) {
      await page.click('.kin-install [data-action="kin:install-not"]');
      const rec = await saved(page);
      ok = await card(page) === null && rec.install.dismissedOn === dateAgo(0) && !rec.install.installed;
      why = JSON.stringify(rec.install);
    }
    R('not-now-is-remembered', ok, why);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-home');
    await fireInstallDialog(page);
    await page.waitForTimeout(250);
    R('not-now-is-not-asked-again-the-same-day', await card(page) === null, 'the card came back after a reload');
    await context.close();
  }
  for (const [ago, wantCard, id] of [[10, false, 'not-now-holds-for-a-month'], [31, true, 'the-offer-returns-after-a-month']]) {
    const { context, page, seen } = await visit(browser, base, sc, { state: returning({ install: { dismissedOn: dateAgo(ago), installed: false } }) });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    await fireInstallDialog(page);
    await page.waitForTimeout(250);
    R(id, (await card(page) !== null) === wantCard, `declined ${ago} days ago: the card is ${wantCard ? 'missing' : 'there'}`);
    await context.close();
  }

  /* Never to someone who has not finished two Kins, and never inside the app. */
  {
    const { context, page, seen } = await visit(browser, base, sc, { state: returning({ stats: { ...returning().stats, dailies: 1 } }) });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    await fireInstallDialog(page);
    await page.waitForTimeout(250);
    R('install-waits-for-two-finished-kins', await card(page) === null, 'offered after one finished Kin');
    await context.close();
  }
  {
    const { context, page, seen } = await visit(browser, base, sc, { state: eligible, init: () => { Object.defineProperty(navigator, 'standalone', { value: true }); } });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    await fireInstallDialog(page);
    await page.waitForTimeout(250);
    R('install-is-not-offered-inside-the-app', await card(page) === null, 'offered to a game already on the home screen');
    await context.close();
  }

  /* An iPhone has no dialog: the card says how, and "Got it" ends it. */
  {
    const { context, page, seen } = await visit(browser, base, sc, { state: eligible, context: { userAgent: IOS_UA } });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    const ios = await attempt(() => page.waitForSelector('.kin-install[data-offer="ios"]', { timeout: 2000 }));
    let ok = ios.ok, why = ios.why;
    if (ios.ok) {
      const m = await page.evaluate(async (lang) => {
        const { STRINGS } = await import('./js/kin/strings.js');
        const T = STRINGS[lang];
        const el = document.querySelector('.kin-install');
        return { text: el.querySelector('span').textContent.trim(), want: T.installIos, buttons: [...el.querySelectorAll('button')].map((b) => b.textContent.trim()), wantButton: T.installGotIt, latin: (el.textContent.match(/[A-Za-z]{2,}/g) || []).slice(0, 3), scrollW: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth };
      }, sc.lang);
      ok = m.text === m.want && JSON.stringify(m.buttons) === JSON.stringify([m.wantButton]) && m.scrollW <= m.vw && !(SCRIPT[sc.lang] && m.latin.length);
      why = JSON.stringify(m);
      await page.screenshot({ path: path.join(OUT, `${sc.name}-11-install-ios.png`), fullPage: true });
    }
    R('an-iphone-is-told-how-to-add-it', ok, why);
    if (ios.ok) {
      await page.click('.kin-install [data-action="kin:install-not"]');
      const rec = await saved(page);
      R('got-it-ends-the-ios-offer', await card(page) === null && rec.install.dismissedOn === dateAgo(0), JSON.stringify(rec.install));
    }
    await context.close();
  }

  /* Only ever on Home: a game in progress and its result are not interrupted. */
  if (sc.flows) {
    const { context, page, seen } = await visit(browser, base, sc, { state: eligible });
    seens.push(seen);
    await page.waitForSelector('.kin-home');
    await fireInstallDialog(page);
    await page.waitForSelector('.kin-install');
    await page.click('.kin-today .kin-btn');
    await page.waitForSelector('.kin-opt');
    const onQuestion = await card(page) !== null;
    for (let i = 0; i < 10; i++) await answer(page, i % 2 === 0);
    await page.waitForSelector('.kin-res');
    const onResult = await card(page) !== null;
    await page.click('#kin-home');
    await page.waitForSelector('.kin-home');
    R('install-never-interrupts-a-game', !onQuestion && !onResult && await card(page) !== null, JSON.stringify({ onQuestion, onResult, backOnHome: await card(page) !== null }));
    await context.close();
  }
  cleanRun(sc, 'install-no-script-errors-or-failed-requests', seens);
}

/**
 * The service worker the game registers: its shell is cached, and the game
 * plays with the server gone.
 *
 * "Gone" is a dead server, not Playwright's setOffline: that reaches the page
 * but not the worker's own requests, so a first version of this check stayed
 * green with the cache fallback deleted — found by the mutation run, not by
 * looking. It needs a server of its own to kill, so it is skipped against a
 * deployed site.
 */
async function checkOffline(browser) {
  process.stdout.write('\n▸ offline\n');
  const R = (id, ok, msg) => record('offline', `play:${id}`, ok, msg);
  if (EXTERNAL_URL) { process.stdout.write('  (skipped: a deployed site cannot be stopped from here)\n'); return; }
  const port = Number(process.env.PLAY_PORT || 5598) + 1;
  const base = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, [path.join(ROOT, 'serve.js')], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  const until = async (up) => {
    for (let i = 0; i < 60; i++) {
      let answered = false;
      try { answered = (await fetch(`${base}/`)).ok; } catch { answered = false; }
      if (answered === up) return true;
      await new Promise((r) => setTimeout(r, 250));
    }
    return false;
  };
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const shell = [...sw.match(/const APP_SHELL = \[([\s\S]*?)\];/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  let context = null;
  try {
    if (!await until(true)) { R('offline-server-starts', false, 'the check\'s own server never came up'); return; }
    context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'allow' });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_CONNECTION_REFUSED/.test(m.text())) errors.push(m.text()); });
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-opt');
    const active = await attempt(() => page.evaluate(() => navigator.serviceWorker.ready.then((r) => { if (!r.active) throw new Error('no active worker'); })));
    R('service-worker-registers-from-the-game', active.ok, active.why);
    if (!active.ok) return;

    const cacheKeys = () => page.evaluate(async () => {
      const out = {};
      for (const name of await caches.keys()) out[name] = (await (await caches.open(name)).keys()).map((r) => { const u = new URL(r.url); return u.pathname + u.search; });
      return out;
    });
    const keys = await cacheKeys();
    const held = Object.values(keys).reduce((a, b) => (b.length > a.length ? b : a), []);
    /* Two directions: everything the list names was really cached (an install that quietly skipped a file is not caught by the list), and
       everything the page actually loaded is on the list (a module added and forgotten is not caught by a list that only agrees with itself). */
    R('every-listed-file-is-cached', shell.every((u) => held.includes(u)), `listed but not cached: ${shell.filter((u) => !held.includes(u)).join(', ')}`);
    const loaded = await page.evaluate(() => performance.getEntriesByType('resource').map((e) => new URL(e.name)).filter((u) => u.origin === location.origin && /\.(js|css)$/.test(u.pathname)).map((u) => u.pathname));
    R('service-worker-precaches-everything-the-game-loads', loaded.length > 15 && loaded.every((u) => held.includes(u)), `loaded but not cached: ${loaded.filter((u) => !held.includes(u)).join(', ')} (${loaded.length} loaded)`);
    R('the-encyclopedia-is-not-precached', !held.some((u) => u === '/atlas.html' || u === '/js/app.js'), 'a visitor who came for the game was made to download the Atlas');

    /* A few shared links, opened while the server is still there. A cache that keyed on the query string would now hold a copy of each. */
    for (const q of ['?kin=2&lang=ru', '?c=31337&s=2', '?stats=1']) {
      await page.goto(`${base}/${q}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#kin-stage > *');
    }
    const withQuery = Object.values(await cacheKeys()).flat().filter((u) => u.includes('?'));
    R('links-are-not-cached-one-by-one', !withQuery.length, withQuery.slice(0, 3).join(', '));

    /* Stop the server. The game must open, be playable, and open a link it has never seen. */
    child.kill();
    const down = await until(false);
    R('offline-server-stopped', down, 'the check could not take its own server down');
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    const open = await attempt(() => page.waitForSelector('.kin-opt, .kin-home', { timeout: 6000 }));
    R('the-game-opens-with-no-network', open.ok, open.why);
    if (open.ok) {
      const played = await attempt(async () => { await answer(page, true); await page.waitForSelector('.kin-dots i.ok'); });
      R('the-game-plays-with-no-network', played.ok, played.why);
    }
    await page.goto(`${base}/?kin=1&lang=he`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    const link = await attempt(() => page.waitForSelector('.kin-banner', { timeout: 6000 }));
    R('a-friends-link-opens-with-no-network', link.ok, link.why);
    await page.goto(`${base}/?c=4242&s=3`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    const challenge = await attempt(() => page.waitForSelector('.kin-mode', { timeout: 6000 }));
    R('a-challenge-link-opens-with-no-network', challenge.ok, challenge.why);

    const manifest = await fs.promises.readFile(path.join(ROOT, 'manifest.json'), 'utf8').then(JSON.parse);
    R('manifest-icons-exist', !!manifest.name && manifest.display === 'standalone' && manifest.icons.length >= 3 && manifest.icons.every((i) => fs.existsSync(path.join(ROOT, i.src))), JSON.stringify(manifest.icons.map((i) => i.src)));
    R('offline-no-script-errors', !errors.length, errors.slice(0, 3).join('; '));
  } finally {
    child.kill();
    if (context) await context.close();
  }
}

/**
 * The two apps and the addresses between them. The game is the front page; the
 * encyclopedia is atlas.html. Links out in the world point at both old
 * addresses: `/?node=humans&view=map` (the encyclopedia's own Share button) and
 * `/play.html?kin=3` (what testers were sent).
 */
async function checkFrontDoor(browser, base) {
  process.stdout.write('\n▸ front door\n');
  const R = (id, ok, msg) => record('front-door', `play:${id}`, ok, msg);
  const fresh = async (opts = {}) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', ...opts });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    return { context, page, errors };
  };

  /* The game's old address forwards, query and all. */
  {
    const { context, page } = await fresh();
    await page.goto(`${base}/play.html?kin=1&lang=he`, { waitUntil: 'domcontentloaded' });
    const shown = await attempt(() => page.waitForSelector('.kin-banner', { timeout: 8000 }));
    const at = new URL(page.url());
    R('the-old-play-address-forwards-with-its-query', shown.ok && at.pathname === '/' && at.search === '?kin=1&lang=he', `${at.pathname}${at.search} ${shown.why}`);
    await context.close();
  }

  /* The encyclopedia's old addresses forward to it, query and all, before the game has drawn anything. */
  {
    const { context, page, errors } = await fresh();
    const bad = [];
    for (const q of ['?node=humans&view=map&lang=ru', '?view=explore', '?lang=he&node=primates']) {
      await page.goto(`${base}/${q}`, { waitUntil: 'domcontentloaded' });
      const arrived = await attempt(() => page.waitForURL('**/atlas.html*', { timeout: 10000 }));
      await page.waitForSelector('#canvas-wrap', { state: 'attached', timeout: 10000 }).catch(() => {});
      const at = new URL(page.url());
      const isAtlas = await page.evaluate(() => !!document.getElementById('canvas-wrap') && !document.querySelector('.kin-app'));
      if (!arrived.ok || at.pathname !== '/atlas.html' || at.search !== q || !isAtlas) bad.push(`${q} -> ${at.pathname}${at.search} (${isAtlas ? 'atlas' : 'not the atlas'})`);
    }
    R('old-encyclopedia-links-open-the-atlas', !bad.length, bad.join('; '));
    R('the-atlas-loads-without-errors', !errors.length, errors.slice(0, 3).join('; '));
    await context.close();
  }

  /* A link to a species has no opening. In a context of its own: once one entrance has played
     it, every later load in the same tab is skipped anyway, which would hide the rule. */
  {
    const { context, page } = await fresh();
    await page.goto(`${base}/?node=humans&view=map`, { waitUntil: 'domcontentloaded' });
    await attempt(() => page.waitForURL('**/atlas.html*', { timeout: 10000 }));
    await page.waitForSelector('#canvas-wrap', { state: 'attached', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(600);
    const o = await page.evaluate(() => {
      const s = document.getElementById('splash');
      return { display: s ? getComputedStyle(s).display : 'missing', live: !!(s && s.classList.contains('is-live')), played: sessionStorage.getItem('tol-opening-played') };
    });
    R('a-link-to-a-species-shows-no-opening', o.display === 'none' && !o.live && o.played === null, JSON.stringify(o));
    await context.close();
  }

  /* The way between them, both ways. */
  {
    const { context, page } = await fresh();
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-opt');
    await page.click('#kin-foot');
    const toAtlas = await attempt(() => page.waitForURL('**/atlas.html', { timeout: 10000 }));
    R('kins-footer-leads-to-the-atlas', toAtlas.ok && await page.evaluate(() => !!document.getElementById('canvas-wrap')), toAtlas.why);
    /* A link that names a view skips the opening, so the rail is reachable at once. */
    await page.goto(`${base}/atlas.html?view=explore`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#btn-kin', { state: 'attached', timeout: 10000 });
    const pill = await page.evaluate(async () => {
      const { TRANSLATIONS } = await import('./js/uiData.js');
      const el = document.getElementById('btn-kin');
      return { href: el.getAttribute('href'), text: document.getElementById('kin-label').textContent.trim(), want: TRANSLATIONS.en.btn_kin };
    });
    R('the-atlas-has-a-way-back-to-the-game', pill.href === './' && pill.text === pill.want, JSON.stringify(pill));
    await page.click('#btn-kin');
    const back = await attempt(() => page.waitForSelector('.kin-opt', { timeout: 10000 }));
    const at = new URL(page.url());
    R('the-atlas-leads-back-to-the-game', back.ok && at.pathname === '/', `${at.pathname} ${back.why}`);
    await context.close();
  }

  /* Credits is linked from both apps and goes back to whichever opened it. */
  {
    const { context, page } = await fresh();
    const backOf = () => page.evaluate(() => { const a = document.querySelector('.cr-back'); return a ? { text: a.textContent.trim(), href: a.getAttribute('href') } : null; });
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-opt');
    await page.click('#kin-credits');
    await attempt(() => page.waitForURL('**/credits.html', { timeout: 10000 }));
    await page.waitForSelector('.cr-back', { timeout: 10000 }).catch(() => {});
    const fromGame = await backOf();
    await page.goto(`${base}/atlas.html?view=explore`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#rail-credits', { timeout: 10000 });
    await page.click('#rail-credits');
    await attempt(() => page.waitForURL('**/credits.html', { timeout: 10000 }));
    await page.waitForSelector('.cr-back', { timeout: 10000 }).catch(() => {});
    const fromAtlas = await backOf();
    R('credits-goes-back-to-where-it-was-opened-from', !!fromGame && !!fromAtlas && fromGame.href === 'index.html' && fromAtlas.href === 'atlas.html' && /Atlas/.test(fromAtlas.text),
      JSON.stringify({ fromGame, fromAtlas }));
    await context.close();
  }
}

/** Counting is off unless the page turns it on, and what it sends names no one. */
async function checkCounting(browser, base) {
  process.stdout.write('\n▸ counting\n');
  const R = (id, ok, msg) => record('counting', `play:${id}`, ok, msg);
  const sc = { name: 'counting', lang: 'en', theme: 'dark', viewport: { width: 390, height: 844 }, mobile: true };
  const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  const isBeacon = (u) => u.includes('/_c/');
  /* A visit is counted while the page loads, so the listener goes on before the page does. */
  const open = async (opts = {}) => {
    const all = [];
    const { before, ...rest } = opts;
    const v = await visit(browser, base, sc, { ...rest, before: async (ctx, pg) => { pg.on('request', (r) => all.push(r.url())); if (before) await before(ctx, pg); } });
    return { ...v, all };
  };
  /* What the page would carry if the site turned counting on: one meta tag, and a host that answers. */
  const turnOn = async (context) => {
    await context.route((url) => url.pathname === '/', async (route) => {
      const res = await route.fetch();
      const body = (await res.text()).replace('</head>', '<meta name="kin-analytics" content="/_c/count"></head>');
      await route.fulfill({ response: res, body, headers: { ...res.headers(), 'content-length': String(Buffer.byteLength(body)) } });
    });
    await context.route('**/_c/**', (route) => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  };
  const session = async (page) => {
    await page.waitForSelector('.kin-opt');
    for (let i = 0; i < 10; i++) await answer(page, i % 2 === 0);
    await page.waitForSelector('.kin-res');
    await page.click('#kin-share-btn');
    await page.waitForTimeout(300);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-home');
    await page.click('[data-action="kin:arcade"]');
    await page.waitForSelector('.kin-opt');
  };

  /* Off: a whole first session sends nothing anywhere but to this site and its fonts and photographs. */
  {
    const { context, page, all } = await open();
    await session(page);
    const hosts = new Set(all.map((u) => new URL(u).host));
    const allowed = new Set([new URL(base).host, 'fonts.googleapis.com', 'fonts.gstatic.com', 'upload.wikimedia.org']);
    const strangers = [...hosts].filter((h) => !allowed.has(h));
    R('nothing-is-sent-by-default', !all.some(isBeacon) && !strangers.length, JSON.stringify({ beacons: all.filter(isBeacon).length, strangers }));
    await page.goto(`${base}/?stats=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-stats');
    const off = await page.$eval('.kin-note', (e) => e.textContent.trim());
    R('stats-say-nothing-is-sent-when-nothing-is', off === await say(page, 'en', 'statsNote'), off);
    await context.close();
  }

  /* On: four kinds of event, each once, carrying an event name and noise and nothing else. */
  {
    const { context, page, all } = await open({ before: async (ctx) => { await turnOn(ctx); } });
    await session(page);
    const beacons = all.filter(isBeacon).map((u) => new URL(u));
    const events = beacons.map((u) => u.searchParams.get('p'));
    R('counting-names-a-visit-a-finish-a-share-and-a-run', JSON.stringify(events) === JSON.stringify(['/kin/visit/d0', '/kin/daily/finish', '/kin/share', '/kin/arcade/start']), JSON.stringify(events));
    R('a-beacon-carries-no-identifier', beacons.length > 0 && beacons.every((u) => [...u.searchParams.keys()].sort().join() === 'e,p,rnd,t' && u.searchParams.get('e') === 'true') && !(await context.cookies()).length && (await page.evaluate(() => document.cookie)) === '',
      JSON.stringify({ keys: [...new Set(beacons.flatMap((u) => [...u.searchParams.keys()]))], cookies: (await context.cookies()).length }));
    await page.goto(`${base}/?stats=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-stats');
    const on = await page.$eval('.kin-note', (e) => e.textContent.trim());
    R('stats-say-what-is-counted-when-something-is', on === await say(page, 'en', 'statsNoteCounted'), on);
    await context.close();
  }

  /* A visit is named for the days since the device first played, and counted once a day. */
  {
    const state = returning({ stats: { ...returning().stats, firstSeen: dateAgo(3) }, counted: { visitOn: dateAgo(1) } });
    const { context, page, all } = await open({ state, before: async (ctx) => { await turnOn(ctx); } });
    await page.waitForSelector('.kin-home');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-home');
    const visits = all.filter(isBeacon).map((u) => new URL(u).searchParams.get('p'));
    R('a-visit-is-counted-once-a-day-by-age', JSON.stringify(visits) === JSON.stringify(['/kin/visit/d3']), JSON.stringify(visits));
    await context.close();
  }

  /* Do Not Track is honoured even when the page turns counting on. */
  {
    const { context, page, all } = await open({ before: async (ctx) => { await turnOn(ctx); }, init: () => { Object.defineProperty(navigator, 'doNotTrack', { get: () => '1' }); } });
    await session(page);
    R('do-not-track-is-respected', !all.some(isBeacon), `${all.filter(isBeacon).length} beacon(s) sent to a browser that asked not to be counted`);
    await context.close();
  }
}

/**
 * A scenario reveals the ten questions of one day; the bank holds hundreds,
 * with dates that only some days would ever show. Draw every question's
 * reveal on the narrowest phone, in each language, and hold each one to the
 * same two rules: every label inside the figure, and no two labels touching.
 */
async function checkEveryReveal(browser, base) {
  process.stdout.write('\n▸ every-reveal (360×640)\n');
  for (const lang of Object.keys(LOCALE)) {
    const context = await browser.newContext({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.addInitScript((l) => { try { localStorage.setItem('tol-lang', l); } catch { /* private mode */ } }, lang);
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.kin-opt');
    const res = await page.evaluate(async (l) => {
      const E = await import('./js/kin/engine.js');
      const { treeHTML } = await import('./js/kin/reveal.js');
      const stage = document.getElementById('kin-stage');
      const box = document.createElement('div');
      box.style.cssText = `position:absolute;left:0;top:0;width:${stage.clientWidth}px`;
      document.body.appendChild(box);
      const ov = (a, b) => a.left < b.right - 0.5 && a.right > b.left + 0.5 && a.top < b.bottom - 0.5 && a.bottom > b.top + 0.5;
      const bad = [];
      for (const q of E.ALL_QUESTIONS) {
        box.innerHTML = treeHTML(E.resolve(q), l);
        const f = box.querySelector('.kin-tree').getBoundingClientRect();
        const labs = [...box.querySelectorAll('.kin-lab')].map((el) => ({ text: el.textContent.trim(), r: el.getBoundingClientRect() }));
        for (const { text, r } of labs) {
          if (r.left < f.left - 1 || r.right > f.right + 1 || r.top < f.top - 1 || r.bottom > f.bottom + 1) bad.push(`${q.id}: "${text}" outside`);
        }
        for (let a = 0; a < labs.length; a++) for (let b = a + 1; b < labs.length; b++) {
          if (ov(labs[a].r, labs[b].r)) bad.push(`${q.id}: "${labs[a].text}" × "${labs[b].text}"`);
        }
      }
      box.remove();
      return { n: E.ALL_QUESTIONS.length, bad };
    }, lang);
    record('every-reveal', `play:every-reveal-fits-${lang}`, !res.bad.length, `${res.bad.length} of ${res.n}: ${res.bad.slice(0, 4).join('; ')}`);
    await context.close();
  }
}

/**
 * A creature whose emoji the device cannot draw shows its kingdom's sign, not
 * an empty box (js/kin/glyph.js). Chromium here draws every creature, so the
 * check hands it a code point no font has, which is what an older phone meets
 * with the 2022 emoji. The zebra is the control: a mostly grey emoji that a
 * cruder "does it have colour" test would throw away.
 */
async function checkEmojiFallback(browser, base) {
  process.stdout.write('\n▸ emoji\n');
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
  const r = await page.evaluate(async () => {
    const { glyph, drawable } = await import('./js/kin/glyph.js');
    const { CREATURES } = await import('./js/kin/creatures.js');
    return {
      animal: glyph({ e: '\u{10FFFD}', k: 'animal' }),
      plant: glyph({ e: '\u{10FFFD}', k: 'plant' }),
      zebra: glyph(CREATURES.zebra),
      undrawn: Object.keys(CREATURES).filter((k) => !drawable(CREATURES[k].e)),
    };
  });
  record('emoji', 'play:missing-emoji-falls-back', r.animal === '🐾' && r.plant === '🌿' && r.zebra === '🦓', JSON.stringify(r));
  if (r.undrawn.length) process.stdout.write(`  (this browser draws a sign for: ${r.undrawn.join(', ')})\n`);
  await context.close();
}

await mkdir(OUT, { recursive: true });
const server = await startServer();
const browser = await chromium.launch();
try {
  for (const sc of SCENARIOS.filter((x) => wants(x.name))) {
    /* A step that cannot happen (a button that never appears) is a failure
       to report, not a reason to abandon the other scenarios. */
    try { await runScenario(browser, server.url, sc); }
    catch (e) { record(sc.name, 'play:scenario-completes', false, String(e.message || e).split('\n')[0]); }
    process.stdout.write(`\n▸ ${sc.name}: Home and stats\n`);
    try { await checkHome(browser, server.url, sc); await checkStats(browser, server.url, sc); }
    catch (e) { record(sc.name, 'play:home-and-stats-complete', false, String(e.message || e).split('\n')[0]); }
    process.stdout.write(`\n▸ ${sc.name}: the home-screen offer\n`);
    try { await checkInstall(browser, server.url, sc); }
    catch (e) { record(sc.name, 'play:install-complete', false, String(e.message || e).split('\n')[0]); }
    if (sc.flows) {
      process.stdout.write(`\n▸ ${sc.name}: friends' links, freezes\n`);
      try { await checkFlows(browser, server.url, sc); }
      catch (e) { record(sc.name, 'play:flows-complete', false, String(e.message || e).split('\n')[0]); }
    }
  }
  if (wants('front-door')) {
    try { await checkFrontDoor(browser, server.url); }
    catch (e) { record('front-door', 'play:front-door-complete', false, String(e.message || e).split('\n')[0]); }
  }
  if (wants('offline')) {
    try { await checkOffline(browser, server.url); }
    catch (e) { record('offline', 'play:offline-complete', false, String(e.message || e).split('\n')[0]); }
  }
  if (wants('counting')) {
    try { await checkCounting(browser, server.url); }
    catch (e) { record('counting', 'play:counting-complete', false, String(e.message || e).split('\n')[0]); }
  }
  if (wants('every-reveal')) {
    try { await checkEveryReveal(browser, server.url); }
    catch (e) { record('every-reveal', 'play:every-reveal-completes', false, String(e.message || e).split('\n')[0]); }
  }
  if (wants('emoji')) {
    try { await checkEmojiFallback(browser, server.url); }
    catch (e) { record('emoji', 'play:emoji-check-completes', false, String(e.message || e).split('\n')[0]); }
  }
} finally {
  await browser.close();
  await server.stop();
}
const bad = results.filter((r) => !r.ok);
process.stdout.write(`\n${results.length - bad.length}/${results.length} play checks passed.${ONLY ? ` (Filtered to ${ONLY.join(', ')}: not a full pass.)` : ''}\n`);
process.exit(bad.length ? 1 : 0);
