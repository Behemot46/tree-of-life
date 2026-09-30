#!/usr/bin/env node
/**
 * Renders the 1200x630 cards that link previews show:
 *
 *   assets/og-image.png  the Atlas (Tree of Life, the radial tree)
 *   assets/og-kin.png    Kin, the daily game (the dial, and its smallest tree)
 *
 *   node scripts/make-og-image.mjs          # both
 *   node scripts/make-og-image.mjs kin      # just one: "atlas" or "kin"
 *
 * Kept as a script rather than a hand-made binary so a card can be
 * regenerated when the title, palette or credit changes. The Atlas card takes
 * its colours from css/variables.css and Kin's from css/kin.css, so each stays
 * in step with its page. Both load their fonts from Google; behind a proxy
 * that blocks it, point OG_FONT_ROUTES at a module exporting
 * `routeFonts(context)` that serves them another way.
 */

import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ONLY = process.argv[2] || '';

const atlas = `<!doctype html>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;600;700&display=swap');
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: center; padding: 0 88px; font-family: 'Inter', sans-serif;
    background:
      radial-gradient(900px 520px at 78% 18%, rgba(62,169,143,0.20), transparent 62%),
      radial-gradient(700px 480px at 12% 88%, rgba(224,161,74,0.16), transparent 60%),
      #14171c;
    color: #f4f1ea; position: relative; overflow: hidden;
  }
  .tree { position: absolute; inset: 0; opacity: 0.30; }
  .content { position: relative; }
  h1 { font-size: 92px; font-weight: 700; letter-spacing: -0.025em; line-height: 1; }
  .sub { margin-top: 22px; font-size: 35px; font-weight: 300; color: #b9c2cc; }
  .rule { margin-top: 40px; width: 132px; height: 5px; border-radius: 3px;
          background: linear-gradient(90deg, #3ea98f, #e0a14a); }
  .meta { margin-top: 34px; font-size: 24px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase; color: #7f8b98; }
</style>
<svg class="tree" viewBox="0 0 1200 630" preserveAspectRatio="none">
  <g fill="none" stroke-linecap="round">
    ${(() => {
      // A suggestion of the radial tree: branches fanning from a common root.
      const cx = 980, cy = 315;
      const colors = ['#3ea98f', '#e0a14a', '#7f9fd4', '#c98fb8', '#9ecf87', '#e08a6a'];
      let out = '';
      for (let i = 0; i < 26; i++) {
        const a = (-Math.PI * 0.92) + (i / 25) * (Math.PI * 1.84);
        const len = 210 + (i % 5) * 62;
        const x2 = cx + Math.cos(a) * len;
        const y2 = cy + Math.sin(a) * len;
        const bend = 0.42 + (i % 3) * 0.13;
        const c1x = cx + Math.cos(a - 0.30) * len * bend;
        const c1y = cy + Math.sin(a - 0.30) * len * bend;
        const col = colors[i % colors.length];
        out += `<path d="M${cx},${cy} Q${c1x},${c1y} ${x2},${y2}" stroke="${col}" stroke-width="${2.4 + (i % 3)}"/>`;
        out += `<circle cx="${x2}" cy="${y2}" r="${6 + (i % 4) * 2.4}" fill="${col}" stroke="none"/>`;
      }
      out += `<circle cx="${cx}" cy="${cy}" r="17" fill="#f4f1ea" stroke="none"/>`;
      return out;
    })()}
  </g>
</svg>
<div class="content">
  <h1>Tree of Life</h1>
  <div class="sub">3.8 billion years of evolution, explorable</div>
  <div class="rule"></div>
  <div class="meta">336 species &nbsp;·&nbsp; English · עברית · Русский</div>
</div>`;

/* The dial from assets/icon.svg, large, with the week's ticks and the tree's
   three leaves. Drawn here rather than imported so the card can be tuned apart
   from the icon. */
const dial = (() => {
  const ticks = Array.from({ length: 7 }, (_, i) => {
    const a = ((-90 + i * (360 / 7)) * Math.PI) / 180;
    const p = (r) => `${(300 + r * Math.cos(a)).toFixed(1)},${(300 + r * Math.sin(a)).toFixed(1)}`;
    return `<path d="M${p(236)} L${p(262)}" stroke="#F2AC52" stroke-opacity="${i === 0 ? 1 : 0.5}" stroke-width="${i === 0 ? 11 : 7}" stroke-linecap="round"/>`;
  }).join('');
  const rings = [120, 168, 216].map((r) => `<circle cx="300" cy="300" r="${r}" fill="none" stroke="#8397A1" stroke-opacity="0.16" stroke-width="2"/>`).join('');
  return `<svg class="dial" viewBox="0 0 600 600">
    <circle cx="300" cy="300" r="290" fill="none" stroke="#F2AC52" stroke-width="12"/>
    <circle cx="300" cy="300" r="272" fill="none" stroke="#F2AC52" stroke-opacity="0.35" stroke-width="3"/>
    ${rings}${ticks}
    <g fill="none" stroke="#8FA4AE" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
      <path d="M300 440 V370"/><path d="M300 370 L408 262"/><path d="M300 370 L226 298"/>
      <path d="M226 298 L176 214"/><path d="M226 298 L266 196"/>
    </g>
    <circle cx="300" cy="446" r="16" fill="#F2AC52"/>
    <circle cx="172" cy="208" r="27" fill="#E6EEF1"/>
    <circle cx="268" cy="188" r="27" fill="#3FD3B0"/>
    <circle cx="414" cy="256" r="27" fill="#FF8A73"/>
  </svg>`;
})();

const kin = `<!doctype html>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;800&display=swap');
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column; justify-content: center;
    padding: 0 88px; font-family: 'Rubik', sans-serif; position: relative; overflow: hidden; color: #E6EEF1;
    background:
      radial-gradient(760px 560px at 82% 46%, rgba(242,172,82,0.17), transparent 62%),
      radial-gradient(620px 440px at 6% 104%, rgba(63,211,176,0.11), transparent 60%),
      #070C11;
  }
  .dial { position: absolute; right: -72px; top: 55px; width: 520px; height: 520px; }
  .content { position: relative; width: 640px; }
  .eyebrow { font-size: 24px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: #8397A1; }
  h1 { margin-top: 10px; font-size: 200px; font-weight: 800; letter-spacing: -0.03em; line-height: 0.95; color: #E6EEF1; }
  .ask { margin-top: 18px; font-size: 47px; font-weight: 500; color: #F2AC52; white-space: nowrap; }
  .sub { margin-top: 16px; font-size: 29px; font-weight: 400; line-height: 1.35; color: #B3C3CB; max-width: 600px; }
  .meta { margin-top: 34px; font-size: 20px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #8397A1; white-space: nowrap; }
</style>
${dial}
<div class="content">
  <div class="eyebrow">Tree of Life · daily</div>
  <h1>Kin</h1>
  <div class="ask">Who is the closer cousin?</div>
  <div class="sub">A one-minute daily game about how every living thing is related.</div>
  <div class="meta">treeoflife.wiki &nbsp;·&nbsp; English · עברית · Русский</div>
</div>`;

const CARDS = { atlas: [atlas, 'og-image.png'], kin: [kin, 'og-kin.png'] };
if (ONLY && !CARDS[ONLY]) { process.stderr.write(`Unknown card "${ONLY}": use atlas or kin.\n`); process.exit(2); }

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1200, height: 630 } });
if (process.env.OG_FONT_ROUTES) await (await import(process.env.OG_FONT_ROUTES)).routeFonts(context);
const page = await context.newPage();
for (const [name, [html, file]] of Object.entries(CARDS)) {
  if (ONLY && ONLY !== name) continue;
  const out = path.join(ROOT, 'assets', file);
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600); // let the webfont settle before capturing
  await page.screenshot({ path: out });
  process.stdout.write(`Wrote ${path.relative(ROOT, out)} (1200x630)\n`);
}
await browser.close();
