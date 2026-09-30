#!/usr/bin/env node
/**
 * Kin (play.html) — browser checks.
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
 * both reveals are exercised), switches language in the middle of a reveal,
 * shares the result, reloads, runs the arcade to its end and opens the tester
 * stats. Screenshots land in .play-out/.
 *
 * Exit code 1 if any check fails.
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/* Not under .smoke-out/: the smoke runner deletes that folder when it starts. */
const OUT = path.join(ROOT, '.play-out');
const argv = process.argv.slice(2);
const EXTERNAL_URL = argv.includes('--url') ? argv[argv.indexOf('--url') + 1] : null;

/* Fonts come from Google; a sandbox without access to them is not a defect
   in the game. Everything else that fails to load is. */
const IGNORABLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

const SCENARIOS = [
  { name: 'phone-en', lang: 'en', theme: 'dark', viewport: { width: 390, height: 844 }, mobile: true },
  { name: 'phone-he', lang: 'he', theme: 'dark', viewport: { width: 390, height: 844 }, mobile: true },
  { name: 'small-phone-en', lang: 'en', theme: 'light', viewport: { width: 360, height: 640 }, mobile: true },
  { name: 'desktop-he', lang: 'he', theme: 'light', viewport: { width: 1440, height: 900 }, mobile: false },
  { name: 'desktop-en', lang: 'en', theme: 'dark', viewport: { width: 1440, height: 900 }, mobile: false },
];

async function startServer() {
  if (EXTERNAL_URL) return { url: EXTERNAL_URL.replace(/\/$/, ''), stop: async () => {} };
  const port = Number(process.env.PLAY_PORT || 5598);
  const child = spawn(process.execPath, [path.join(ROOT, 'serve.js')], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(url + '/play.html')).ok) break; } catch { /* not up yet */ }
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

async function runScenario(browser, base, sc) {
  process.stdout.write(`\n▸ ${sc.name}\n`);
  const context = await browser.newContext({ viewport: sc.viewport, isMobile: sc.mobile, hasTouch: sc.mobile, locale: sc.lang === 'he' ? 'he-IL' : 'en-US' });
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
  await page.goto(`${base}/play.html`, { waitUntil: 'domcontentloaded' });
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
    if (sc.lang === 'he') {
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
      await page.click('#kin-lang');
      const after = await page.evaluate(() => ({ lang: document.documentElement.lang, reveal: !!document.querySelector('.kin-reveal'), done: document.querySelectorAll('.kin-dots i.ok, .kin-dots i.no').length }));
      await page.click('#kin-lang');
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
  if (sc.lang === 'he') record(sc.name, 'play:hebrew-has-no-latin-text', !problems.latin.length, problems.latin.slice(0, 3).join(' | '));
  record(sc.name, 'play:language-switch-keeps-the-reveal', langSwitchOk === true, 'reveal lost or answer recorded twice');

  const resumed = await page.waitForSelector('.kin-res', { timeout: 3000 }).then(() => true, () => false);
  record(sc.name, 'play:leaving-on-the-last-answer-keeps-the-result', resumed, 'no result screen after reloading on the last reveal');
  const res = await page.evaluate(() => ({
    score: (document.querySelector('.kin-score') || {}).textContent || '',
    grid: [...((document.querySelector('.kin-grid') || {}).textContent || '')].filter((c) => c === '🟩' || c === '🟥').length,
  }));
  record(sc.name, 'play:results-show-score-and-grid', res.score.replace(/\s/g, '') === `${right}/10` && res.grid === 10, JSON.stringify(res));
  await page.screenshot({ path: path.join(OUT, `${sc.name}-3-results.png`), fullPage: true });

  await page.click('#kin-share-btn');
  await page.waitForTimeout(300);
  const shared = await page.evaluate(async () => {
    try { return await navigator.clipboard.readText(); } catch { return (document.getElementById('kin-share-text') || {}).value || ''; }
  });
  const brand = sc.lang === 'he' ? 'קרובים' : 'Kin';
  const shareRe = new RegExp(`^${brand} #\\d+ · ${right}/10 🌳\\n(?:🟩|🟥){10}\\n${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/play\\.html`);
  record(sc.name, 'play:share-text', shareRe.test(shared), JSON.stringify(shared));

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  record(sc.name, 'play:no-horizontal-scroll', overflow <= 0, `${overflow}px wider than the screen`);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.kin-res, .kin-opt', { timeout: 3000 });
  record(sc.name, 'play:finished-daily-survives-reload', await page.$('.kin-res') !== null, 'reload went back to a question');

  /* Arcade: two right answers, then three wrong ones, and the run is over. */
  await page.click('[data-action="kin:arcade"]');
  await page.waitForSelector('.kin-opt');
  for (let i = 0; i < 5; i++) {
    const near = await page.$eval('#kin-stage', (s) => s.dataset.near);
    const side = i < 2 ? near : (near === 'a' ? 'b' : 'a');
    await page.click(`.kin-opt[data-side="${side}"]`);
    await page.waitForSelector('.kin-reveal');
    if (i === 3) await page.screenshot({ path: path.join(OUT, `${sc.name}-4-arcade.png`) });
    await page.click('#kin-next');
  }
  const over = await page.evaluate(() => ({
    over: !!document.querySelector('.kin-res'),
    score: (document.querySelector('.kin-score') || {}).textContent || '',
    lost: document.querySelectorAll('.kin-hearts .lost').length,
  }));
  record(sc.name, 'play:arcade-ends-after-three-misses', over.over && over.score.trim() === '2' && over.lost === 3, JSON.stringify(over));

  await page.goto(`${base}/play.html?stats=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.kin-stats table');
  const stats = await page.$$eval('.kin-stats td', (tds) => tds.map((td) => td.textContent.trim()));
  record(sc.name, 'play:tester-stats', stats[2] === '1' && stats[4] === '1', JSON.stringify(stats));
  await page.screenshot({ path: path.join(OUT, `${sc.name}-5-stats.png`) });

  const csp = await page.evaluate(() => window.__csp || []);
  record(sc.name, 'play:no-csp-violations', !csp.length, csp.slice(0, 3).join('; '));
  record(sc.name, 'play:no-script-errors', !errors.length, errors.slice(0, 3).join('; '));
  record(sc.name, 'play:no-failed-requests', !failed.length, failed.slice(0, 3).join('; '));
  await context.close();
}

/**
 * A scenario reveals the ten questions of one day; the bank holds hundreds,
 * with dates that only some days would ever show. Draw every question's
 * reveal on the narrowest phone, in each language, and hold each one to the
 * same two rules: every label inside the figure, and no two labels touching.
 */
async function checkEveryReveal(browser, base) {
  process.stdout.write('\n▸ every-reveal (360×640)\n');
  for (const lang of ['en', 'he']) {
    const context = await browser.newContext({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.addInitScript((l) => { try { localStorage.setItem('tol-lang', l); } catch { /* private mode */ } }, lang);
    await page.goto(`${base}/play.html`, { waitUntil: 'domcontentloaded' });
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

await mkdir(OUT, { recursive: true });
const server = await startServer();
const browser = await chromium.launch();
try {
  for (const sc of SCENARIOS) {
    /* A step that cannot happen (a button that never appears) is a failure
       to report, not a reason to abandon the other scenarios. */
    try { await runScenario(browser, server.url, sc); }
    catch (e) { record(sc.name, 'play:scenario-completes', false, String(e.message || e).split('\n')[0]); }
  }
  try { await checkEveryReveal(browser, server.url); }
  catch (e) { record('every-reveal', 'play:every-reveal-completes', false, String(e.message || e).split('\n')[0]); }
} finally {
  await browser.close();
  await server.stop();
}
const bad = results.filter((r) => !r.ok);
process.stdout.write(`\n${results.length - bad.length}/${results.length} play checks passed.\n`);
process.exit(bad.length ? 1 : 0);
