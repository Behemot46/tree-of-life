#!/usr/bin/env node
/* Which labels fall outside the usable stage, and by how much. */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const lang = arg('lang', 'en');
const phone = argv.includes('--phone');

const server = spawn('node', ['serve.js'], { stdio: 'ignore' });
await sleep(700);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
await page.addInitScript((l) => { localStorage.setItem('tol-lang', l); localStorage.setItem('tol-intro-seen', '1'); }, lang);
await page.goto('http://localhost:5555/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('#splash')?.remove());
await sleep(1800);

const report = await page.evaluate(() => {
  const W = innerWidth, H = innerHeight;
  const vis = (el) => { if (!el) return false; const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.02 && r.width > 0; };
  let top = 0, bottom = 0, left = 0, right = 0;
  const hd = document.getElementById('header'); if (vis(hd)) top = hd.getBoundingClientRect().bottom;
  const tl = document.getElementById('timeline'); if (vis(tl)) bottom = H - tl.getBoundingClientRect().top;
  const rail = document.getElementById('left-rail');
  if (vis(rail)) { const r = rail.getBoundingClientRect(); if (r.left + r.width / 2 < W / 2) left = r.right; else right = W - r.left; }
  const stage = { x: left, y: top, r: W - right, b: H - bottom };

  // Every floating widget that paints over the canvas, so we can tell a label
  // hidden behind a control from one that ran off the screen.
  const widgets = [...document.querySelectorAll('#zoom-ctrl,#reveal-panel,#left-rail,#achievement-container,#species-of-day')]
    .filter(vis).map((el) => { const r = el.getBoundingClientRect(); return { id: el.id, x: r.x, y: r.y, r: r.right, b: r.bottom }; });

  const out = [];
  for (const t of document.querySelectorAll('text.node-label-name, text.node-label-latin')) {
    const r = t.getBoundingClientRect();
    if (!r.width) continue;
    const offL = stage.x - r.x, offR = r.right - stage.r, offT = stage.y - r.y, offB = r.bottom - stage.b;
    const worst = Math.max(offL, offR, offT, offB);
    const behind = widgets.find((w) => r.x < w.r && r.right > w.x && r.y < w.b && r.bottom > w.y);
    if (worst > 0.5 || behind) {
      out.push({ text: t.textContent.slice(0, 28), cls: t.getAttribute('class'), offL: +offL.toFixed(0), offR: +offR.toFixed(0), offT: +offT.toFixed(0), offB: +offB.toFixed(0), behind: behind ? behind.id : null });
    }
  }
  return { stage, total: document.querySelectorAll('text.node-label-name').length, offenders: out };
});

console.log(`stage  x:${report.stage.x.toFixed(0)} y:${report.stage.y.toFixed(0)} r:${report.stage.r.toFixed(0)} b:${report.stage.b.toFixed(0)}`);
console.log(`labels ${report.total} names drawn, ${report.offenders.length} problem labels\n`);
for (const o of report.offenders.slice(0, 30)) {
  const bits = [];
  if (o.offL > 0.5) bits.push(`${o.offL}px past left`);
  if (o.offR > 0.5) bits.push(`${o.offR}px past right`);
  if (o.offT > 0.5) bits.push(`${o.offT}px past top`);
  if (o.offB > 0.5) bits.push(`${o.offB}px past bottom`);
  if (o.behind) bits.push(`behind #${o.behind}`);
  console.log(`  ${o.text.padEnd(30)} ${bits.join(', ')}`);
}
await browser.close(); server.kill();
