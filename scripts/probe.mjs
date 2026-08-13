#!/usr/bin/env node
/**
 * Ad-hoc visual probe. Not part of CI — a fast way to look at one thing
 * without paying for the whole smoke matrix.
 *
 *   node scripts/probe.mjs                       # desktop, English
 *   node scripts/probe.mjs --lang he --phone
 *   node scripts/probe.mjs --shots a,b,c
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const flag = (n) => argv.includes('--' + n);

const lang = arg('lang', 'en');
const phone = flag('phone');
const OUT = '.probe-out';
mkdirSync(OUT, { recursive: true });

const server = spawn('node', ['serve.js'], { stdio: 'ignore' });
await sleep(700);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('  console.error:', m.text()); });
page.on('pageerror', (e) => console.log('  pageerror:', e.message));

await page.addInitScript((o) => {
  localStorage.setItem('tol-lang', o.lang);
  localStorage.setItem('tol-intro-seen', '1');
  if (o.theme) localStorage.setItem('theme', o.theme);
}, { lang, theme: arg('theme', '') });
await page.goto('http://localhost:5555/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('#splash')?.remove());
await sleep(1600);

const tag = `${phone ? 'phone' : 'desk'}-${lang}${arg('theme','') ? '-' + arg('theme','') : ''}`;
await page.screenshot({ path: `${OUT}/${tag}-01-initial.png` });

// Expand a couple of levels the way a visitor would.
const clickNode = async (id) => {
  const box = await page.evaluate((nid) => {
    const c = document.querySelector(`.node-group[data-node-id="${nid}"] circle.node-circle-parent, .node-group[data-node-id="${nid}"] circle`);
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, id);
  if (!box) { console.log(`  (no node ${id})`); return false; }
  await page.mouse.click(box.x, box.y);
  await sleep(1400);
  return true;
};

await clickNode('eukaryota');
await page.screenshot({ path: `${OUT}/${tag}-02-eukaryota.png` });
await clickNode('animals');
await page.screenshot({ path: `${OUT}/${tag}-03-animals.png` });

// Hover feedback: does the node move when it scales?
const drift = await page.evaluate(async () => {
  const g = document.querySelector('.node-group[data-node-id="luca"]');
  if (!g) return null;
  const c = g.querySelector('circle');
  const before = c.getBoundingClientRect();
  g.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  g.classList.add('__probe-hover');
  const st = document.createElement('style');
  st.textContent = '.__probe-hover{transform:scale(1.09) !important;}';
  document.head.appendChild(st);
  await new Promise((r) => setTimeout(r, 300));
  const after = c.getBoundingClientRect();
  st.remove(); g.classList.remove('__probe-hover');
  return {
    dx: +(after.x + after.width / 2 - (before.x + before.width / 2)).toFixed(1),
    dy: +(after.y + after.height / 2 - (before.y + before.height / 2)).toFixed(1),
  };
});
console.log('  hover-scale centre drift:', JSON.stringify(drift));

await browser.close();
server.kill();
console.log(`  wrote ${OUT}/${tag}-*.png`);
