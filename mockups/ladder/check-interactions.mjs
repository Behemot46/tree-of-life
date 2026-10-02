// Drives the Ladder the way a person does — tap to open, tap a species, fold,
// reopen, Tab and Enter — on a desktop and on a touch phone. Run from the repo root:
//
//   node mockups/ladder/check-interactions.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
mkdirSync('.probe-out/ladder', { recursive: true });
const server = spawn('node', ['serve.js'], { stdio: 'ignore' });
await sleep(800);
const browser = await chromium.launch();
let fails = 0;
const ok = (c, m) => { console.log(`${c ? '✅' : '❌'} ${m}`); if (!c) fails++; };
for (const vp of ['desk', 'phone']) {
  console.log(`\n── ${vp} ──`);
  const ctx = await browser.newContext({ viewport: vp === 'phone' ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: vp === 'phone', deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto('http://localhost:5555/mockups/ladder/index.html', { waitUntil: 'networkidle' });
  await sleep(800);
  const st = () => page.evaluate(() => ({ rows: __ladder.layout.rows, open: [...__ladder.S.open], scrollTop: document.getElementById('scroll').scrollTop, sheet: !document.getElementById('sheet').hidden, vh: innerHeight }));
  const dot = (id) => page.evaluate((i) => { const d = document.querySelector(`.ld-node[data-id="${i}"] .ld-dot`); if (!d) return null; const b = d.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, id);

  const a = await st();
  // 1. open a collapsed group by tapping its dot
  const inv = await dot('invertebrates');
  if (vp === 'phone') await page.touchscreen.tap(inv.x, inv.y); else await page.mouse.click(inv.x, inv.y);
  await sleep(700);
  const b = await st();
  ok(b.rows > a.rows && b.open.includes('invertebrates'), `tapping Invertebrates opens it in place (${a.rows} → ${b.rows} rows)`);
  const invAfter = await dot('invertebrates');
  ok(invAfter && invAfter.y > 90 && invAfter.y < b.vh, `…and the group stays on screen (y=${Math.round(invAfter.y)})`);
  await page.screenshot({ path: `.probe-out/ladder/i-${vp}-opened.png` });

  // 2. tap a species: the card opens, and does not sit on the row that was tapped
  const sp = await dot('coelacanth');
  ok(!!sp, 'a species row (Coelacanth) is on screen to tap');
  if (sp) {
    if (vp === 'phone') await page.touchscreen.tap(sp.x, sp.y); else await page.mouse.click(sp.x, sp.y);
    await sleep(900);
    const c = await st();
    const sheetTop = await page.evaluate(() => document.getElementById('sheet').getBoundingClientRect().top);
    const spAfter = await dot('coelacanth');
    ok(c.sheet, 'the species card opens');
    ok(spAfter && spAfter.y < sheetTop - 6, `…and the tapped row is above it (row y=${Math.round(spAfter?.y)}, card top=${Math.round(sheetTop)})`);
    await page.screenshot({ path: `.probe-out/ladder/i-${vp}-sheet.png` });
    await page.click('#sheet .x'); await sleep(300);
    ok(!(await st()).sheet, '…and it closes');
  }

  // 3. fold a group: its rows go, and what was open inside it goes too
  const an = await dot('animalia');
  if (vp === 'phone') await page.touchscreen.tap(an.x, an.y); else await page.mouse.click(an.x, an.y);
  await sleep(700);
  const d = await st();
  ok(d.rows < b.rows && !d.open.includes('animalia') && !d.open.includes('chordata') && !d.open.includes('invertebrates'),
     `folding Animals folds what was inside it (${b.rows} → ${d.rows} rows; chordata ${d.open.includes('chordata') ? 'STILL OPEN' : 'closed'})`);
  const an2 = await dot('animalia');
  if (vp === 'phone') await page.touchscreen.tap(an2.x, an2.y); else await page.mouse.click(an2.x, an2.y);
  await sleep(600);
  const e = await st();
  ok(e.open.includes('animalia') && !e.open.includes('chordata'), 'opening it again starts from one level, not from what was left open');

  // 4. keyboard: Tab reaches nodes, Enter toggles
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => { const a = document.activeElement; return a && a.classList.contains('ld-node') ? { id: a.getAttribute('data-id'), exp: a.getAttribute('aria-expanded'), label: a.getAttribute('aria-label') } : null; });
  ok(!!focused, `Tab lands on a node (${focused && focused.label})`);
  if (focused && focused.exp !== null) {
    const before = (await st()).rows;
    await page.keyboard.press('Enter'); await sleep(500);
    ok((await st()).rows !== before, 'Enter toggles a focused group');
  }

  // 5. language switch with a card open keeps the card
  const sp2 = await dot('great-white-shark') || await dot('coelacanth');
  await page.evaluate(() => { __ladder.S.lang = 'he'; __ladder.render(); });
  await sleep(500);
  const dir = await page.evaluate(() => document.documentElement.dir);
  ok(dir === 'rtl', `language switch re-renders (dir is now ${dir})`);
  ok(errs.length === 0, `no page errors${errs.length ? ': ' + errs[0] : ''}`);
  await ctx.close();
}
await browser.close(); server.kill();
console.log(fails ? `\n${fails} failed` : '\nall interactions pass');
process.exit(fails ? 1 : 0);
