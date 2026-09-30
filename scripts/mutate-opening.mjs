#!/usr/bin/env node
/**
 * Mutation tests for the opening's smoke checks.
 *
 * A check nobody has watched fail is a check nobody has tested. For each
 * mutation below this copies the site to a scratch directory, breaks one thing
 * in the copy, runs the opening's checks in the scenario that should notice
 * (`scripts/smoke.mjs --opening-only --only <scenario>`), and reports whether
 * the check that guards that thing went red. The working tree is never touched.
 *
 *   node scripts/mutate-opening.mjs                 # every mutation, three at a time (~4 min)
 *   node scripts/mutate-opening.mjs no-key throws   # by name
 *   node scripts/mutate-opening.mjs --list
 *
 * Run it after changing js/splash.js, js/splashScene.js, js/boot.js,
 * css/splash.css, the opening's markup in index.html, or the `opening:` checks.
 * A mutation whose target text no longer exists reports PATCH FAILED: update it
 * here, beside the code it names, rather than deleting it.
 *
 * Each mutation is [scenario, file, old text, new text, checks that must fail].
 * `old` must occur exactly once. Some mutations trip more than one check; only
 * the listed ones are required.
 */
import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PARALLEL = 3;

const MUTATIONS = {
  // ── js/boot.js: what has to be decided before the first paint ──
  'boot-dir': ['phone-he', 'js/boot.js', "root.dir = RTL.indexOf(wanted) > -1 ? 'rtl' : 'ltr';", '',
    ['opening:first-paint-needs-no-script']],
  'boot-theme': ['desktop-en-light', 'js/boot.js', "root.setAttribute('data-theme', 'light');", '',
    ['opening:first-paint-needs-no-script']],
  'boot-return': ['desktop-en', 'js/boot.js', "if (localStorage.getItem('tol-splash-seen')) root.setAttribute('data-return', '');", '',
    ['opening:first-paint-needs-no-script']],
  'static-lang': ['desktop-en', 'js/boot.js', "var LANGS = ['en', 'he', 'ru'];", "var LANGS = ['en', 'he'];",
    ['opening:boot-knows-every-language']],

  // ── css/splash.css: the first paint, and where things sit ──
  'css-drift': ['phone-en', 'css/splash.css', 'min(44.5vw,', 'min(40vw,',
    ['opening:first-paint-matches-the-canvas']],
  'css-no-ring': ['desktop-en', 'css/splash.css', '.sp-ring { width:', '.sp-ringX { width:',
    ['opening:first-paint-shows-the-instrument']],
  // theme.css once flattened #splash to a plain colour in the dark theme, and nothing noticed
  'plate-flattened': ['phone-en', 'css/theme.css', '/* ── PANEL ANIMATION ── */', '[data-theme="dark"] #splash{background:var(--bg);}\n/* ── PANEL ANIMATION ── */',
    ['opening:first-paint-shows-the-instrument']],
  'skip-side': ['phone-he', 'css/splash.css', 'inset-inline-end: 24px;', 'right: 24px;',
    ['opening:skip-sits-in-the-inline-end-corner']],
  // the defect the checks found: a transition makes fit() read the size it started from
  'fit-transition': ['phone-en', 'css/splash.css', '.sw-title span, .sw-sub span { transition-property: none; }', '',
    ['opening:title-fits-the-plaque']],

  // ── js/splash.js: the words, the clock, the ways out ──
  'words-english': ['desktop-he', 'js/splash.js', "setText('sw-hint', tr('splash_click'));", "setText('sw-hint', 'Click to explore');",
    ['opening:words-are-in-the-readers-language']],
  'no-plaque': ['desktop-en', 'js/splash.js', "splashEl.classList.toggle('show-plaque', t >= T_TITLE);", '',
    ['opening:reduced-motion-holds-still', 'opening:title-fits-the-plaque']],
  // the counter used to sit where the plaque opens, and its rules ran through the word "present"
  'counter-in-plaque': ['desktop-en', 'js/splash.js', "counter.style.top = (g.cy + g.Rc + g.gap / 2 - counter.offsetHeight / 2) + 'px';",
    "counter.style.top = (py + ph * 0.5 - counter.offsetHeight / 2) + 'px';",
    ['opening:nothing-collides']],
  'hint-overlap': ['desktop-en', 'js/splash.js', "hint.style.top = (py + ph + (g.small ? 22 : 26)) + 'px';", "hint.style.top = (py + 8) + 'px';",
    ['opening:nothing-collides']],
  'no-fit': ['phone-en', 'js/splash.js', 'function fit(el, px, limit) {', "function fit(el, px, limit) { el.style.fontSize = (px * 1.6) + 'px'; return;",
    ['opening:title-fits-the-plaque']],
  // the matrix has no phone-in-Russian scenario; phone-en measures it as an extra plate
  'ru-overflow': ['phone-en', 'js/splash.js', 'function fit(el, px, limit) {',
    "function fit(el, px, limit) { if (document.documentElement.lang === 'ru') { el.style.fontSize = (px * 1.3) + 'px'; return; }",
    ['opening:title-fits-the-plaque']],
  // the clock that made a slow phone play in slow motion: capped steps added up instead of the wall clock
  'capped-clock': ['phone-en', 'js/splash.js', 'elapsed = (ts - start) / 1000 - hidden;', 'elapsed += Math.min(0.05, (ts - last) / 1000);',
    ['opening:a-slow-phone-still-gets-the-title']],
  'no-key': ['desktop-en', 'js/splash.js', "document.addEventListener('keydown', onKey);", '',
    ['opening:leaves-by-keyboard']],
  'no-canvas-path': ['desktop-en', 'js/splash.js', "splashEl.classList.add('no-canvas');", '',
    ['opening:no-canvas-fallback']],
  'throws': ['desktop-en', 'js/splash.js', "canvas.dataset.ready = '1';                                    // js/app.js watches for this",
    "canvas.dataset.ready = '1'; setTimeout(() => { throw new Error('boom'); }, 30);",
    ['opening:runs-clean']],

  // ── the picture itself ──
  'no-draw': ['desktop-en', 'js/splash.js', 'scene.draw(ctx, dpr, DURATION);', '',
    ['opening:canvas-draws']],
  'no-animation': ['desktop-en', 'js/splash.js', 'scene.draw(ctx, dpr, t, lite ? 0 : 1);\n    words(t, false);', 'words(t, false);',
    ['opening:animates']],

  // ── js/app.js: a scene that throws must not trap anyone ──
  'swallow': ['desktop-en', 'js/app.js', 'setTimeout(() => { throw err; });', '',
    ['opening:a-broken-opening-does-not-trap-the-visitor']],
  'trapped': ['desktop-en', 'js/app.js', "if (s) s.style.display = 'none';\n      _afterOpening();", '_afterOpening();',
    ['opening:a-broken-opening-does-not-trap-the-visitor']],
};

const argv = process.argv.slice(2);
if (argv.includes('--list')) {
  for (const [name, [scenario, file, , , expect]] of Object.entries(MUTATIONS)) {
    console.log(`${name.padEnd(16)} ${scenario.padEnd(17)} ${file.padEnd(18)} ${expect.join(', ')}`);
  }
  process.exit(0);
}
const names = argv.length ? argv : Object.keys(MUTATIONS);
const unknown = names.filter((n) => !MUTATIONS[n]);
if (unknown.length) { console.error(`unknown mutation(s): ${unknown.join(', ')} (see --list)`); process.exit(2); }

const WORK = mkdtempSync(path.join(tmpdir(), 'mutate-opening-'));
const NODE_MODULES = realpathSync(path.join(ROOT, 'node_modules'));

async function run(name, index) {
  const [scenario, file, oldText, newText, expect] = MUTATIONS[name];
  const dir = path.join(WORK, name);
  cpSync(ROOT, dir, {
    recursive: true,
    filter: (src) => !/[\\/](\.git|node_modules|\.smoke-out|\.play-out)([\\/]|$)/.test(src),
  });
  symlinkSync(NODE_MODULES, path.join(dir, 'node_modules'));
  const target = path.join(dir, file);
  const source = readFileSync(target, 'utf8');
  const found = source.split(oldText).length - 1;
  if (found !== 1) return { name, scenario, expect, error: `PATCH FAILED: ${JSON.stringify(oldText.slice(0, 70))} occurs ${found}x in ${file}` };
  writeFileSync(target, source.replace(oldText, () => newText));

  const out = await new Promise((resolve) => {
    let text = '';
    const child = spawn(process.execPath, ['scripts/smoke.mjs', '--opening-only', '--only', scenario, '--no-screenshots'], {
      cwd: dir, env: { ...process.env, SMOKE_PORT: String(5700 + index) },
    });
    child.stdout.on('data', (d) => { text += d; });
    child.stderr.on('data', (d) => { text += d; });
    child.on('close', () => resolve(text));
  });
  rmSync(dir, { recursive: true, force: true });
  const failed = [...out.matchAll(/❌ (opening:[a-z0-9-]+)\s+(.*)/g)].map((m) => ({ id: m[1], msg: m[2] }));
  return { name, scenario, expect, failed };
}

const results = [];
const queue = names.map((n, i) => [n, i]);
await Promise.all(Array.from({ length: Math.min(PARALLEL, queue.length) }, async () => {
  while (queue.length) {
    const [n, i] = queue.shift();
    results.push(await run(n, i));
  }
}));
rmSync(WORK, { recursive: true, force: true });

let missed = 0;
for (const r of names.map((n) => results.find((x) => x.name === n))) {
  if (r.error) { missed++; console.log(`??   ${r.name}: ${r.error}`); continue; }
  const got = [...new Set(r.failed.map((f) => f.id))];
  const caught = r.expect.every((id) => got.includes(id));
  if (!caught) missed++;
  console.log(`${caught ? 'OK  ' : 'MISS'} ${r.name.padEnd(16)} [${r.scenario}] wanted ${r.expect.join(', ')} → red: ${got.join(', ') || 'nothing'}`);
  for (const f of r.failed.slice(0, 2)) console.log(`       ${f.id}: ${f.msg.slice(0, 180)}`);
}
console.log(missed ? `\n${missed} mutation(s) NOT caught.` : `\nAll ${names.length} mutation(s) caught.`);
process.exit(missed ? 1 : 0);
