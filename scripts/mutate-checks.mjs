#!/usr/bin/env node
/**
 * Mutation tests for the checks that have a probe of their own: the opening's
 * and the name offer's.
 *
 * A check nobody has watched fail is a check nobody has tested. For each
 * mutation below this copies the site to a scratch directory, breaks one thing
 * in the copy, runs the group's checks in the scenario that should notice
 * (`scripts/smoke.mjs --opening-only --only <scenario>`, or `--profile-only`),
 * and reports whether the check that guards that thing went red. The working
 * tree is never touched.
 *
 *   node scripts/mutate-checks.mjs                  # every mutation, three at a time (~7 min)
 *   node scripts/mutate-checks.mjs no-key throws    # by name
 *   node scripts/mutate-checks.mjs --group profile  # one group's
 *   node scripts/mutate-checks.mjs --list
 *
 * Run it after changing js/splash.js, js/splashScene.js, js/boot.js,
 * css/splash.css, the opening's markup in index.html or the `opening:` checks;
 * or js/profile.js, the games' results (js/game.js, js/whoFirst.js,
 * js/familyFoe.js), css/profile.css or the `profile:` checks. A mutation whose
 * target text no longer exists reports PATCH FAILED: update it here, beside the
 * code it names, rather than deleting it.
 *
 * Each mutation is [scenario, file, old text, new text, checks that must fail].
 * `old` must occur exactly once; for a change in two places, give an array of
 * [old, new] pairs in place of both. Some mutations trip more than one check;
 * only the listed ones are required. The group a mutation runs is the one its
 * first required check belongs to: `opening:` runs the opening's, anything else
 * the name offer's.
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
  // the safety net used to count from when the script ran, so a long stall before the first frame ate the show
  'timer-from-init': ['phone-en', 'js/splash.js', [
      ['const NO_FRAME_S = 15; ', 'const NO_FRAME_S = 6.5;'],
      ['      clearTimeout(autoTimer);\n      autoTimer = setTimeout(dismiss, (AUTO_S / speed) * 1000);\n', ''],
    ], null, ['opening:a-slow-phone-still-gets-the-title']],
  // the frame timestamp is when the frame began, stale by the length of any long task before it: the show would start that far in
  'stale-frame-clock': ['phone-en', 'js/splash.js', [
      ['  function frame() {', '  function frame(ts) {'],
      ['const tNow = performance.now();', 'const tNow = ts;'],
    ], null, ['opening:a-slow-phone-still-gets-the-title']],
  // the clock that made a slow phone play in slow motion: capped steps added up instead of the wall clock
  'capped-clock': ['phone-en', 'js/splash.js', 'elapsed = (tNow - start) / 1000 - hidden;', 'elapsed += Math.min(0.05, (tNow - last) / 1000);',
    ['opening:a-slow-phone-still-gets-the-title']],
  // laying the words out again when a font arrives used to rebuild the scale, which then faded in from nothing
  'font-blinks-scale': ['desktop-en', 'js/splash.js', "if (done || !scene) return;\n    placeWords(scene.geom);", "if (done || !scene) return;\n    placeScale(scene.geom); placeWords(scene.geom);",
    ['opening:a-late-font-does-not-blink-the-scale']],
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

  // ══ the name offer: the `profile:` group ══
  // the prompt() itself, back: five seconds into a first visit
  'prompt-back': ['desktop-en', 'js/profile.js', "  registerActions({\n    'profile:switch-player'",
    "  setTimeout(() => { try { prompt('Welcome! Enter your name'); } catch (e) { /* blocked */ } }, 5000);\n  registerActions({\n    'profile:switch-player'",
    ['load:no-native-dialogs', 'profile:a-first-visit-is-not-interrupted', 'dialogs:none-in-source']],
  // the migration that made a Guest of anyone who had looked around
  'guest-migration': ['desktop-en', 'js/profile.js', "  _loadPlayers();\n  _loadActive();\n  /* No Guest is made up here.",
    "  _loadPlayers();\n  _loadActive();\n  if (localStorage.getItem('tol-explored') && !_players.length) { _players.push({ name: 'Guest', createdAt: 1, lastActive: 1, totalPoints: 0 }); _savePlayers(); }\n  /* No Guest is made up here.",
    ['profile:looking-around-does-not-make-a-guest']],
  // each results screen that has to carry the call
  'no-offer-quiz': ['desktop-en', 'js/game.js', "  offerNameAfterGame(result, s.mode === 'daily' ? 0 : s.score);\n", '',
    ['profile:the-name-is-asked-after-a-game-that-scored']],
  'no-offer-who-first': ['desktop-en', 'js/whoFirst.js', "  offerNameAfterGame(container, s.score);\n", '',
    ['profile:the-name-is-asked-after-a-game-that-scored']],
  'no-credit-family-foe': ['desktop-en', 'js/familyFoe.js', "  offerNameAfterGame(container, s.score);\n", '',
    ['profile:a-named-player-earns-points-without-being-asked-again']],
  // when to ask, and how often
  'asks-every-time': ['desktop-en', 'js/profile.js', "  if (!container || !pts || _players.length || _asked()) return;", "  if (!container || !pts || _players.length) return;",
    ['profile:a-declined-offer-is-not-repeated']],
  'ask-not-recorded': ['desktop-en', 'js/profile.js', "  try { localStorage.setItem(LS_ASKED, '1'); } catch (e) { /* private mode: it will be asked again */ }\n", '',
    ['profile:the-name-is-asked-after-a-game-that-scored', 'profile:a-declined-offer-is-not-repeated']],
  'zero-uses-the-ask': ['desktop-en', 'js/profile.js', "  if (!container || !pts || _players.length || _asked()) return;", "  if (!container || _players.length || _asked()) return;",
    ['profile:the-name-is-asked-after-a-game-that-scored']],
  // keeping the name
  'save-drops-the-score': ['desktop-en', 'js/profile.js', "  if (_offerPoints) updatePlayerScore(_offerPoints);\n", '',
    ['profile:keeping-the-name-keeps-the-score']],
  'enter-does-nothing': ['desktop-en', 'js/profile.js', "if (e.key === 'Enter' && e.target && e.target.id === 'name-offer-input') {", "if (false) {",
    ['profile:keeping-the-name-keeps-the-score']],
  'save-tap-does-nothing': ['phone-en', 'js/profile.js', "    'profile:save-name':     () => _saveOfferedName(),\n", '',
    ['profile:keeping-the-name-keeps-the-score']],
  // focus must not fall to the top of the page when the control that had it goes
  'save-loses-focus': ['desktop-en', 'js/profile.js', "    card.querySelector('.name-offer-done').focus({ preventScroll: true });\n", '',
    ['profile:keeping-the-name-keeps-the-score']],
  'skip-loses-focus': ['desktop-en', 'js/profile.js', "  if (next) next.focus({ preventScroll: true });", "  void next;",
    ['profile:a-declined-offer-is-not-repeated']],
  // a game reached twice must not be scored twice
  'scored-twice': ['desktop-en', 'js/game.js', [
      ["  if (s.resultsShown) return;", ""],
      ["  s.resultsShown = true;\n", ""],
    ], null, ['profile:a-game-is-scored-once']],
  // the card
  'english-offer': ['desktop-he', 'js/profile.js', "${_esc(t('name_offer_title'))}", 'Keep your score?',
    ['profile:the-offer-speaks-the-readers-language']],
  'unlabelled-offer': ['desktop-ru', 'js/profile.js', "  card.setAttribute('role', 'group');\n", '',
    ['profile:the-offer-speaks-the-readers-language']],
  'offer-overflows': ['phone-en', 'css/profile.css', ".name-offer .lb-add-player input {\n  min-width: 0;", ".name-offer .lb-add-player input {\n  min-width: 460px;",
    ['profile:the-offer-fits-and-is-reachable']],
  'field-zooms-a-phone': ['phone-en', 'css/profile.css', "  font-size: max(16px, var(--text-sm));", "  font-size: var(--text-sm);",
    ['profile:the-offer-fits-and-is-reachable']],
  'offer-covered': ['desktop-ru', 'css/profile.css', ".name-offer-done {", ".name-offer { position: relative; }\n.name-offer::after { content: ''; position: absolute; inset: 0; }\n.name-offer-done {",
    ['profile:the-offer-fits-and-is-reachable']],
  'daily-asks': ['desktop-en', 'js/game.js', "  offerNameAfterGame(result, s.mode === 'daily' ? 0 : s.score);\n", "  offerNameAfterGame(result, s.score);\n",
    ['profile:the-name-is-asked-after-a-game-that-scored']],
  'offer-wrong-direction': ['desktop-he', 'css/profile.css', ".name-offer {\n  margin: 0 0 1rem;", ".name-offer {\n  direction: ltr;\n  margin: 0 0 1rem;",
    ['profile:the-offer-fits-and-is-reachable']],
  'tiny-skip': ['phone-en', 'css/profile.css', "  min-height: 2.5rem;\n  padding: 0 0.2rem;", "  min-height: 0;\n  padding: 0 0.2rem;",
    ['profile:the-offer-fits-and-is-reachable']],
  'offer-illegible': ['desktop-en-light', 'css/profile.css', "  line-height: 1.5;\n  color: var(--text-secondary);\n}\n.name-offer .lb-add-player {", "  line-height: 1.5;\n  color: var(--surface-raised);\n}\n.name-offer .lb-add-player {",
    ['profile:the-offer-is-legible']],
};

const groupOf = (m) => (m[4][0].startsWith('opening:') ? 'opening' : 'profile');

const argv = process.argv.slice(2);
const gi = argv.indexOf('--group');
const GROUP = gi > -1 ? argv.splice(gi, 2)[1] : '';
if (GROUP && !['opening', 'profile'].includes(GROUP)) { console.error(`unknown group "${GROUP}" (opening or profile)`); process.exit(2); }
if (argv.includes('--list')) {
  for (const [name, m] of Object.entries(MUTATIONS)) {
    if (GROUP && groupOf(m) !== GROUP) continue;
    const [scenario, file, , , expect] = m;
    console.log(`${name.padEnd(22)} ${groupOf(m).padEnd(8)} ${scenario.padEnd(17)} ${file.padEnd(16)} ${expect.join(', ')}`);
  }
  process.exit(0);
}
const names = argv.length ? argv : Object.keys(MUTATIONS).filter((n) => !GROUP || groupOf(MUTATIONS[n]) === GROUP);
const unknown = names.filter((n) => !MUTATIONS[n]);
if (unknown.length) { console.error(`unknown mutation(s): ${unknown.join(', ')} (see --list)`); process.exit(2); }

const WORK = mkdtempSync(path.join(tmpdir(), 'mutate-checks-'));
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
  let source = readFileSync(target, 'utf8');
  for (const [from, to] of Array.isArray(oldText) ? oldText : [[oldText, newText]]) {
    const found = source.split(from).length - 1;
    if (found !== 1) return { name, scenario, expect, error: `PATCH FAILED: ${JSON.stringify(from.slice(0, 70))} occurs ${found}x in ${file}` };
    source = source.replace(from, () => to);
  }
  writeFileSync(target, source);

  const out = await new Promise((resolve) => {
    let text = '';
    const child = spawn(process.execPath, ['scripts/smoke.mjs', `--${groupOf(MUTATIONS[name])}-only`, '--only', scenario, '--no-screenshots'], {
      cwd: dir, env: { ...process.env, SMOKE_PORT: String(5700 + index) },
    });
    child.stdout.on('data', (d) => { text += d; });
    child.stderr.on('data', (d) => { text += d; });
    child.on('close', () => resolve(text));
  });
  rmSync(dir, { recursive: true, force: true });
  const failed = [...out.matchAll(/❌ ([a-z0-9]+:[a-z0-9-]+)\s+(.*)/g)].map((m) => ({ id: m[1], msg: m[2] }));
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
  console.log(`${caught ? 'OK  ' : 'MISS'} ${r.name.padEnd(22)} [${r.scenario}] wanted ${r.expect.join(', ')} → red: ${got.join(', ') || 'nothing'}`);
  for (const f of r.failed.slice(0, 2)) console.log(`       ${f.id}: ${f.msg.slice(0, 180)}`);
}
console.log(missed ? `\n${missed} mutation(s) NOT caught.` : `\nAll ${names.length} mutation(s) caught.`);
process.exit(missed ? 1 : 0);
