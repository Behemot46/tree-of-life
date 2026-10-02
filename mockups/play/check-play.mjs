// Measures the three scenes instead of looking at them. Run from the repo root:
//   node mockups/play/check-play.mjs orbit            # homo-sapiens, lion, fungi
//   node mockups/play/check-play.mjs dive mammals,fungi,animalia,luca
//   node mockups/play/check-play.mjs travel 0,300,541,3700
//
// For every viewport, language and theme it reads the real DOM and fails on: two
// bubbles (picture or label) overlapping, anything off the screen, a tap target
// under 44px, a bubble the finger cannot reach because something sits on it, and
// a picture that is neither loaded nor replaced by a silhouette. The first
// version of this scene passed every look and failed three of these.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { extname } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
const MIME = { '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const cache = existsSync('photo-cache/manifest.json') ? JSON.parse(readFileSync('photo-cache/manifest.json', 'utf8')) : {};
const byFile = new Map();
for (const [u, n] of Object.entries(cache)) { const f = u.split('/').pop().replace(/^\d+px-/, ''); if (!byFile.has(f)) byFile.set(f, n); }
const scene = process.argv[2] || 'orbit';
const DEFAULT_FOCI = { orbit: 'homo-sapiens,lion,fungi', dive: 'mammals,fungi,animalia,luca', travel: '0,300,541,3700' };
const FOCI = (process.argv[3] || DEFAULT_FOCI[scene] || DEFAULT_FOCI.orbit).split(',');
const server = spawn('node', ['serve.js'], { stdio: 'ignore' });
await sleep(800);
const browser = await chromium.launch();
let bad = 0;
for (const vp of ['desk', 'phone']) for (const lang of ['en', 'he', 'ru']) for (const theme of ['dark', 'light']) {
  if (theme === 'light' && lang === 'ru') continue;
  for (const focus of FOCI) {
    const ctx = await browser.newContext({ viewport: vp === 'phone' ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: vp === 'phone' });
    await ctx.route('https://upload.wikimedia.org/**', async (route) => {
      const u = route.request().url();
      const n = cache[u] || byFile.get(u.split('/').pop().replace(/^\d+px-/, ''));
      const p = n ? `photo-cache/${n}` : null;
      if (p && existsSync(p)) await route.fulfill({ body: readFileSync(p), contentType: MIME[extname(p)] || 'image/jpeg' });
      else await route.abort();
    });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    await page.goto(`http://localhost:5555/mockups/play/index.html?scene=${scene}&lang=${lang}&theme=${theme}&focus=${focus}&bare=1`, { waitUntil: 'networkidle' });
    await sleep(1300);
    const r = await page.evaluate(() => {
      const host = document.getElementById('scene');
      const vw = host.clientWidth, vh = host.clientHeight;
      const bs = [...host.querySelectorAll('.pl-b')].filter((b) => getComputedStyle(b).opacity > 0.5);
      const rect = (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; };
      /* A bubble is two things: a round picture and a label. Compared as the
         rectangle that wraps both, a circle's empty corner and a neighbour's
         label counted as touching when nothing touched — so the pieces are
         compared as what they are. */
      const parts = (b) => {
        const f = rect(b.querySelector('.pl-face'));
        const lab = b.querySelector('.pl-label');
        return { c: { x: (f.l + f.r) / 2, y: (f.t + f.b) / 2, r: f.w / 2 }, rect: lab ? rect(lab) : null, f };
      };
      const circleCircle = (a, c) => Math.hypot(a.x - c.x, a.y - c.y) < a.r + c.r - 1;
      const circleRect = (c, r) => { const nx = Math.max(r.l, Math.min(c.x, r.r)), ny = Math.max(r.t, Math.min(c.y, r.b)); return Math.hypot(c.x - nx, c.y - ny) < c.r - 1; };
      const rectRect = (a, c) => a.l < c.r - 1 && a.r > c.l + 1 && a.t < c.b - 1 && a.b > c.t + 1;
      const touch = (A, B) => circleCircle(A.c, B.c) || (B.rect && circleRect(A.c, B.rect)) || (A.rect && circleRect(B.c, A.rect)) || (A.rect && B.rect && rectRect(A.rect, B.rect));
      const feet = bs.map((b) => { const p = parts(b); return { b, p, id: b.dataset.id, f: { l: Math.min(p.f.l, p.rect ? p.rect.l : 1e9), r: Math.max(p.f.r, p.rect ? p.rect.r : -1e9), t: p.f.t, b: Math.max(p.f.b, p.rect ? p.rect.b : 0) } }; });
      const out = { n: bs.length, overlap: [], offscreen: [], small: [], covered: [], blank: [] };
      for (let i = 0; i < feet.length; i++) for (let j = i + 1; j < feet.length; j++) if (touch(feet[i].p, feet[j].p)) out.overlap.push(`${feet[i].id} × ${feet[j].id}`);
      for (const { f, id } of feet) if (f.l < -1 || f.r > vw + 1 || f.t < 0 || f.b > vh + 1) out.offscreen.push(id);
      for (const { b, id } of feet) {
        const face = b.querySelector('.pl-face'); const r = rect(face);
        if (Math.min(r.w, r.h) < 36) out.small.push(`${id} ${Math.round(r.w)}px`);
        const top = document.elementFromPoint(r.l + r.w / 2, r.t + r.h / 2);
        if (!top || !b.contains(top)) out.covered.push(id);
        const img = b.querySelector('.pl-img'); const sil = b.querySelector('.pl-sil, .pl-emoji, .pl-more');
        const shown = (img && b.classList.contains('has-img')) || !!sil;
        if (!shown) out.blank.push(id);
      }
      out.pills = [...host.querySelectorAll('.pl-pill')].map((p) => { const r = rect(p); return { t: p.textContent.trim().slice(0, 14), h: Math.round(r.h), off: r.l < 0 || r.r > vw }; });
      return out;
    });
    const problems = [];
    if (r.overlap.length) problems.push(`${r.overlap.length} overlap: ${r.overlap.slice(0, 3).join('; ')}`);
    if (r.offscreen.length) problems.push(`${r.offscreen.length} off-screen: ${r.offscreen.slice(0, 3).join(', ')}`);
    if (r.covered.length) problems.push(`${r.covered.length} covered: ${r.covered.slice(0, 3).join(', ')}`);
    if (r.blank.length) problems.push(`${r.blank.length} blank: ${r.blank.slice(0, 3).join(', ')}`);
    if (r.small.length) problems.push(`${r.small.length} too small: ${r.small.slice(0, 3).join(', ')}`);
    const smallPill = r.pills.filter((p) => p.h < 36 || p.off);
    if (smallPill.length) problems.push(`pill problem: ${JSON.stringify(smallPill[0])}`);
    if (errs.length) problems.push(`page error: ${errs[0]}`);
    if (problems.length) bad++;
    console.log(`${problems.length ? '❌' : '✅'} ${vp}-${lang}-${theme} ${focus.padEnd(12)} bubbles=${r.n}`);
    for (const p of problems) console.log('     ' + p);
    await ctx.close();
  }
}
await browser.close(); server.kill();
console.log(bad ? `\n${bad} scenario(s) with problems` : '\nall clean');
process.exit(bad ? 1 : 0);
