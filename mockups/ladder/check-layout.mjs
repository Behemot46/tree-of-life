// Measures the Ladder rather than looking at it. Run from the repo root:
//
//   node mockups/ladder/check-layout.mjs                  # default view, every viewport, language and theme
//   node mockups/ladder/check-layout.mjs stress           # every group open: 255 rows
//
// For each scenario it reads the real DOM and fails on: text overlapping text,
// a name over a silhouette or over somebody's dot, anything off the screen, a dot
// a finger could not reach, two dots touching, a line under 3:1 against the page,
// a name cut that should have wrapped, a fork label the layout had to force, and
// sideways scroll. Every one of these was found by this script and not by looking.
//
// Prove a change to it the way the checks were proven: break the code it covers
// and watch it go red (drop `.ld-svg text { direction: ltr }`, take the dots out
// of the obstacle list in layout.js, shorten MIN_LIMB).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
const server = spawn('node', ['serve.js'], { stdio: 'ignore' });
await sleep(800);
const browser = await chromium.launch();
const STRESS = process.argv[2] === 'stress';
const MATRIX = [];
for (const vp of ['desk', 'phone']) for (const lang of ['en', 'he', 'ru']) {
  MATRIX.push({ tag: (STRESS ? 'ALL-' : '') + vp + '-' + lang, vp, q: (STRESS ? 'open=all&' : '') + 'lang=' + lang });
}
if (!STRESS) MATRIX.push({ tag: 'desk-en-light', vp: 'desk', q: 'theme=light' }, { tag: 'phone-he-light', vp: 'phone', q: 'lang=he&theme=light' }, { tag: 'desk-ru-light', vp: 'desk', q: 'lang=ru&theme=light' });
let bad = 0;
for (const c of MATRIX) {
  const ctx = await browser.newContext({ viewport: c.vp === 'phone' ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const t0 = Date.now();
  await page.goto(`http://localhost:5555/mockups/ladder/index.html?bare=1&${c.q}`, { waitUntil: 'networkidle' });
  await sleep(900);
  const r = await page.evaluate(() => {
    const plot = document.getElementById('plot');
    const sc = document.getElementById('scroll');
    const vw = sc.clientWidth;
    const box = (e) => { const b = e.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom }; };
    const hit = (a, b) => a.l < b.r - .5 && a.r > b.l + .5 && a.t < b.b - .5 && a.b > b.t + .5;
    const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join('').trim();
    const texts = [...plot.querySelectorAll('text')].filter((e) => own(e)).map((e) => ({ e, b: box(e), s: own(e), cls: e.getAttribute('class') || '' }));
    const out = { texts: texts.length, textOverlaps: [], offscreen: [], sil: [], dots: [], covered: [], truncated: [], hidden: 0 };
    // Axis text is pinned and the plot scrolls under it, so only compare like with like.
    const inAxis = (e) => !!e.closest('.ld-axis');
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      if (inAxis(texts[i].e) !== inAxis(texts[j].e)) continue;
      if (hit(texts[i].b, texts[j].b)) out.textOverlaps.push(`${texts[i].s} × ${texts[j].s}`);
    }
    for (const t of texts) {
      if (t.b.l < -0.5 || t.b.r > vw + 0.5) out.offscreen.push(t.s);
      if (t.s.endsWith('…')) out.truncated.push(t.s);
    }
    const sils = [...plot.querySelectorAll('.ld-sil, .ld-pip')].map(box);
    for (const t of texts) if (!inAxis(t.e)) for (const s of sils) if (hit(t.b, s)) { out.sil.push(t.s); break; }
    const dots = [...plot.querySelectorAll('.ld-dot')].map((d) => ({ b: box(d), id: d.parentNode.getAttribute('data-id') }));
    for (const t of texts) if (!inAxis(t.e) && t.cls.includes('ld-name')) {
      const own = t.e.parentNode.getAttribute('data-id');
      for (const d of dots) if (d.id !== own && hit(t.b, d.b)) { out.dots.push(`${t.s} over ${d.id}`); break; }
    }
    // Is every dot the thing a finger would hit? Skip those scrolled out of view.
    for (const d of plot.querySelectorAll('.ld-node')) {
      const dot = d.querySelector('.ld-dot'); if (!dot) continue;
      const b = dot.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      if (cy < 60 || cy > innerHeight - 2) continue;
      const top = document.elementFromPoint(cx, cy);
      if (!top || !d.contains(top)) out.covered.push(d.getAttribute('data-id'));
    }
    // Two dots that touch read as one blob, and the lower one is lost.
    const dd = [...plot.querySelectorAll('.ld-dot')].map((d) => ({ b: box(d), id: d.parentNode.getAttribute('data-id') }));
    out.dotsTouch = [];
    for (let i = 0; i < dd.length; i++) for (let j = i + 1; j < dd.length; j++) if (hit(dd[i].b, dd[j].b)) out.dotsTouch.push(`${dd[i].id}+${dd[j].id}`);
    // Non-text contrast (WCAG 1.4.11): the lines and dots ARE the content here, so
    // each must stand off the page at 3:1. Light-coloured species on a light page failed.
    const c2 = document.createElement('canvas').getContext('2d');
    const rgb = (v) => { c2.fillStyle = '#000'; c2.fillStyle = v; const h = c2.fillStyle; if (h[0] === '#') return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const m = h.match(/[\d.]+/g).map(Number); return m.slice(0, 3); };
    const lum = ([r, g, b]) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const bg = lum(rgb(getComputedStyle(document.body).backgroundColor));
    const ratio = (c) => { const l = lum(rgb(c)); return (Math.max(l, bg) + 0.05) / (Math.min(l, bg) + 0.05); };
    out.lowContrast = [];
    for (const e of plot.querySelectorAll('.ld-dot')) { const r = ratio(getComputedStyle(e).fill); if (r < 3) out.lowContrast.push(`${e.parentNode.getAttribute('data-id')} ${r.toFixed(1)}`); }
    for (const e of plot.querySelectorAll('.ld-limb')) { const r = ratio(getComputedStyle(e).stroke); if (r < 3) out.lowContrast.push(`${e.getAttribute('data-id')} limb ${r.toFixed(1)}`); }
    // A bidi-override on a word turns it inside out ("היום" → "םויה"). Latin
    // units never need one now that the direction is pinned, so none may carry it.
    out.reversed = texts.filter((t) => /[\u0590-\u05FF\u0400-\u04FF]/.test(t.s) && getComputedStyle(t.e).unicodeBidi === 'bidi-override').map((t) => t.s);
    const L = __ladder.layout;
    out.rows = L.rows; out.forced = L.forced; out.rowH = Math.round(L.rowH); out.scrolls = L.scrolls;
    out.docScrollW = document.documentElement.scrollWidth; out.innerW = innerWidth;
    out.ticks = L.ticks.map((t) => t.text).join(' ');
    return out;
  });
  const ms = Date.now() - t0;
  const problems = [];
  if (r.textOverlaps.length) problems.push(`${r.textOverlaps.length} text overlap(s): ${r.textOverlaps.slice(0, 3).join('; ')}`);
  if (r.offscreen.length) problems.push(`${r.offscreen.length} off-screen: ${r.offscreen.slice(0, 3).join(', ')}`);
  if (r.sil.length) problems.push(`${r.sil.length} name(s) on a silhouette: ${r.sil.slice(0, 3).join(', ')}`);
  if (r.dots.length) problems.push(`${r.dots.length} name(s) over a dot: ${r.dots.slice(0, 3).join('; ')}`);
  if (r.covered.length) problems.push(`${r.covered.length} dot(s) covered: ${r.covered.slice(0, 3).join(', ')}`);
  if (r.reversed.length) problems.push(`${r.reversed.length} word(s) under a bidi-override, so drawn backwards: ${r.reversed.slice(0, 3).join(', ')}`);
  if (r.lowContrast.length) problems.push(`${r.lowContrast.length} line(s)/dot(s) under 3:1 against the page: ${r.lowContrast.slice(0, 4).join(', ')}`);
  if (r.dotsTouch.length) problems.push(`${r.dotsTouch.length} dot(s) touching: ${r.dotsTouch.slice(0, 3).join(', ')}`);
  if (r.forced) problems.push(`${r.forced} fork label(s) forced to collide`);
  if (r.docScrollW > r.innerW + 1) problems.push(`page scrolls sideways (${r.docScrollW} > ${r.innerW})`);
  // A single word wider than its column has to be shortened, and is only reported.
  // A name with a space in it should have wrapped, and one that is short should
  // never have been cut: those fail.
  const cutBad = r.truncated.filter((t) => t.includes(' ') || t.replace('\u2026', '').length <= 9);
  if (cutBad.length) problems.push(`${cutBad.length} name(s) cut that should not be: ${cutBad.slice(0, 4).join(', ')}`);
  if (problems.length) bad++;
  console.log(`${problems.length ? '❌' : '✅'} ${c.tag.padEnd(18)} rows=${String(r.rows).padStart(3)} rowH=${r.rowH} texts=${r.texts} cut=${r.truncated.length}(${r.truncated.filter((t) => !(t.includes(' ') || t.replace('\u2026','').length <= 9)).length} long words) ${ms}ms  ticks[${r.ticks}]`);
  for (const p of problems) console.log('     ' + p);
  await ctx.close();
}
await browser.close(); server.kill();
console.log(bad ? `\n${bad} scenario(s) with problems` : '\nall clean');
process.exit(bad ? 1 : 0);
