#!/usr/bin/env node
/**
 * Renders assets/og-image.png — the 1200x630 card that link previews show.
 *
 *   node scripts/make-og-image.mjs
 *
 * Kept as a script rather than a hand-made binary so the card can be
 * regenerated when the title, palette or credit changes. Colours are taken
 * from css/variables.css so it stays in step with the site.
 */

import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'og-image.png');

const html = `<!doctype html>
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

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(600); // let the webfont settle before capturing
await page.screenshot({ path: OUT });
await browser.close();
process.stdout.write(`Wrote ${path.relative(ROOT, OUT)} (1200x630)\n`);
