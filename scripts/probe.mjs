#!/usr/bin/env node
/**
 * Ad-hoc visual probe. Not part of CI — a fast way to look at one thing
 * without paying for the whole smoke matrix.
 *
 *   node scripts/probe.mjs                       # desktop, English, the map
 *   node scripts/probe.mjs --lang he --phone
 *   node scripts/probe.mjs --explore            # the drill-down instead
 *   node scripts/probe.mjs --shots a,b,c
 *
 * The shell is seeded explicitly. It used not to be, which left the probe
 * shooting whatever the app defaults to — and since that default moved to
 * Explore, "the map probe" was a name rather than a guarantee. --explore is
 * the other half: the view a visitor actually lands on had no way to be looked
 * at short of writing a throwaway, which is a poor reason not to look.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { extname } from 'node:path';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const flag = (n) => argv.includes('--' + n);

const lang = arg('lang', 'en');
const phone = flag('phone');
const explore = flag('explore');
const OUT = '.probe-out';
mkdirSync(OUT, { recursive: true });

const server = spawn('node', ['serve.js'], { stdio: 'ignore' });
await sleep(700);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
/* Serve Wikimedia's photographs from photo-cache/ when it is present.

   This sandbox gets 403 at the egress proxy for upload.wikimedia.org, so
   without this every screenshot shows the tree with empty node discs — which
   is the dominant visual element of every node missing from the one artefact
   the design is judged on. .github/workflows/photo-cache.yml fetches them on a
   runner and pushes them to the chore/photo-cache branch; see that file.

   Absent the cache the probe behaves exactly as before, so this is additive
   rather than a dependency. */
const CACHE_DIR = 'photo-cache';
const MIME = { '.jpg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
let cache = null;
if (existsSync(`${CACHE_DIR}/manifest.json`)) {
  cache = JSON.parse(readFileSync(`${CACHE_DIR}/manifest.json`, 'utf8'));

  /* The cache holds the 400px tree-disc cut. The panel asks for the 1280px
     hero, which is the same Commons file at a different width — a different
     URL, so an exact-match lookup missed it and the panel fell back to an
     emoji. That looked like a broken hero image when it was only a gap in the
     cache. Index by the underlying filename so either width resolves. */
  const byFile = new Map();
  for (const [url, name] of Object.entries(cache)) {
    const file = url.split('/').pop().replace(/^\d+px-/, '');
    if (!byFile.has(file)) byFile.set(file, name);
  }

  let served = 0, absent = 0;
  await ctx.route('https://upload.wikimedia.org/**', async (route) => {
    const url = route.request().url();
    const name = cache[url] || byFile.get(url.split('/').pop().replace(/^\d+px-/, ''));
    const path = name ? `${CACHE_DIR}/${name}` : null;
    if (path && existsSync(path)) {
      served++;
      await route.fulfill({ body: readFileSync(path), contentType: MIME[extname(path)] || 'image/jpeg' });
    } else {
      absent++;
      await route.abort();
    }
  });
  process.on('exit', () => console.log(`  photo cache: ${served} served, ${absent} not cached`));
  console.log(`  photo cache: ${Object.keys(cache).length} entries loaded`);
} else {
  console.log('  photo cache: absent — node discs will render empty.');
  console.log('  Run the "Photo cache" workflow, then: npm run photos:pull');
}

const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error' && !/upload\.wikimedia\.org/.test(m.text())) console.log('  console.error:', m.text()); });
page.on('pageerror', (e) => console.log('  pageerror:', e.message));

await page.addInitScript((o) => {
  localStorage.setItem('tol-lang', o.lang);
  localStorage.setItem('tol-intro-seen', '1');
  localStorage.setItem('tol-shell-view', o.view);
  if (o.theme) localStorage.setItem('theme', o.theme);
}, { lang, theme: arg('theme', ''), view: explore ? 'explore' : 'map' });
await page.goto('http://localhost:5555/', { waitUntil: 'domcontentloaded' });

/* Clear both curtains. #splash is the canvas title card; .intro-overlay is a
   second, separate one raised by engagement.js. Removing only the first was
   enough while the photographs were unreachable — every request failed fast,
   so the page was quiet by the time the shot was taken. With the cache serving
   images the load takes longer, the intro is still up, and the screenshot was
   of the title card rather than the tree. Wait for the tree instead of for the
   network, which is the thing actually being waited on. */
async function clearCurtains() {
  await page.evaluate(() => {
    document.querySelector('#splash')?.remove();
    document.querySelector('.intro-overlay')?.remove();
  });
}
await clearCurtains();

/* ── The drill-down ────────────────────────────────────────────────────────
   Its own walk, because nothing below applies to it: there are no discs to
   click, no camera to settle and no panel reached by hitting a leaf on a
   canvas. Descends two levels the way a thumb would, and reports what is
   painted over the path ribbon — the defect that hid there for the whole life
   of the view was invisible to every check that read the DOM, and is obvious
   the moment you ask elementFromPoint what is actually on top. */
if (explore) {
  const extag = `${phone ? 'phone' : 'desk'}-${lang}-explore`;
  await page.waitForFunction(() => document.querySelectorAll('.ex-card').length > 0, null, { timeout: 20000 });
  await clearCurtains();
  await sleep(1200);
  await clearCurtains();
  await page.screenshot({ path: `${OUT}/${extag}-01-root.png` });

  const whatCovers = () => page.evaluate(() => {
    const out = {};
    for (const sel of ['.ex-here', '.ex-step.current', '.ex-back']) {
      const el = document.querySelector(sel);
      if (!el) { out[sel] = '(absent)'; continue; }
      const b = el.getBoundingClientRect();
      const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      out[sel] = !top ? '(off-screen)'
        : (top === el || el.contains(top) || top.contains(el)) ? 'clear'
        : `COVERED by ${top.tagName}${top.id ? '#' + top.id : ''}` +
          (typeof top.className === 'string' && top.className ? '.' + top.className.split(' ')[0] : '');
    }
    return out;
  });
  console.log('  root screen:', JSON.stringify(await whatCovers()));

  for (let level = 2; level <= 3; level++) {
    const name = await page.evaluate(() => {
      const c = document.querySelector('.ex-card');
      if (!c) return null;
      const label = (c.querySelector('.ex-card-name')?.textContent || 'card').trim();
      c.click();
      return label;
    });
    if (!name) { console.log('  (no card to descend into)'); break; }
    await sleep(1100);
    const slug = name.replace(/[^\w֐-׿-]+/g, '-').slice(0, 24) || 'card';
    await page.screenshot({ path: `${OUT}/${extag}-0${level}-${slug}.png` });
    console.log(`  level ${level} (${name}):`, JSON.stringify(await whatCovers()));
  }

  await browser.close();
  server.kill();
  console.log(`  wrote ${OUT}/${extag}-*.png`);
  process.exit(0);
}

await page.waitForFunction(() => document.querySelectorAll('.node-group').length > 3, null, { timeout: 20000 });
await clearCurtains();
await sleep(1800);
await clearCurtains();

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

/* Open a species panel. Every visitor who clicks a node lands here, and it is
   where the 1280px photograph lives now that the discs draw silhouettes. */
const panelFor = arg('panel', '');
const leaf = await page.evaluate((wanted) => {
  const groups = [...document.querySelectorAll('.node-group[data-node-id]')];
  // A leaf has no aria-expanded — only parents carry it.
  const g = wanted
    ? groups.find((x) => x.dataset.nodeId === wanted)
    : groups.find((x) => !x.hasAttribute('aria-expanded'));
  if (!g) return null;
  const c = g.querySelector('circle');
  const r = c.getBoundingClientRect();
  return { id: g.dataset.nodeId, x: r.x + r.width / 2, y: r.y + r.height / 2 };
}, panelFor);
if (leaf) {
  await page.mouse.click(leaf.x, leaf.y);
  await sleep(2400);
  await page.screenshot({ path: `${OUT}/${tag}-03-panel-${leaf.id}.png` });
  console.log(`  panel: ${leaf.id}`);
} else {
  console.log('  panel: no leaf found');
}

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
