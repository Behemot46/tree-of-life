#!/usr/bin/env node
/**
 * Draws the app icons: a dial (the opening's Astrolabe, in small) with the
 * smallest tree Kin ever asks about inside it — a target and two candidates,
 * one of them closer.
 *
 *   node scripts/build-icons.mjs
 *
 * Writes assets/icon.svg and assets/icon-maskable.svg, then renders
 * icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png and
 * favicon-32.png from them. The PNGs exist because a phone's home screen wants
 * a raster: iOS ignores an SVG touch icon, and Chrome's install criteria ask for
 * 192 and 512 pixel PNGs. Colours are Kin's own (css/kin.css).
 *
 * Kept as a script, like make-og-image.mjs, so the set can be redrawn when the
 * mark changes instead of being a binary nobody can regenerate.
 */

import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets');

const BG = '#070C11', BG_LIT = '#15222C';
const GOLD = '#F2AC52', CREAM = '#E6EEF1', TEAL = '#3FD3B0', CORAL = '#FF8A73', LINE = '#8FA4AE';

/** The mark, drawn for a 512 square and centred on (256, 256). */
function mark() {
  // A week's scale inside the ring: seven ticks, today at the top.
  const ticks = Array.from({ length: 7 }, (_, i) => {
    const a = ((-90 + i * (360 / 7)) * Math.PI) / 180;
    const p = (r) => `${(256 + r * Math.cos(a)).toFixed(1)} ${(256 + r * Math.sin(a)).toFixed(1)}`;
    return `<path d="M${p(150)} L${p(166)}" stroke="${GOLD}" stroke-opacity="${i === 0 ? 1 : 0.5}" stroke-width="${i === 0 ? 9 : 6}" stroke-linecap="round"/>`;
  }).join('');
  return `
  <circle cx="256" cy="256" r="186" fill="none" stroke="${GOLD}" stroke-width="10"/>
  <circle cx="256" cy="256" r="172" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="3"/>
  ${ticks}
  <g fill="none" stroke="${LINE}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M256 340 V296"/>
    <path d="M256 296 L332 224"/>
    <path d="M256 296 L204 246"/>
    <path d="M204 246 L168 190"/>
    <path d="M204 246 L236 176"/>
  </g>
  <circle cx="256" cy="344" r="13" fill="${GOLD}"/>
  <circle cx="168" cy="188" r="20" fill="${CREAM}"/>
  <circle cx="238" cy="172" r="20" fill="${TEAL}"/>
  <circle cx="336" cy="220" r="20" fill="${CORAL}"/>`;
}

const svg = (body, { rounded }) => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="plate" cx="50%" cy="40%" r="75%">
      <stop offset="0" stop-color="${BG_LIT}"/>
      <stop offset="1" stop-color="${BG}"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512"${rounded ? ' rx="112"' : ''} fill="url(#plate)"/>${body}
</svg>
`;

/* A maskable icon is cropped to whatever shape the phone likes — a circle, a
   squircle — and only the central 80% is guaranteed to survive. The ring is
   drawn larger than that in the plain icon, so it is scaled down about the
   centre here. */
const plain = svg(mark(), { rounded: true });
const maskable = svg(`<g transform="translate(256 256) scale(0.86) translate(-256 -256)">${mark()}</g>`, { rounded: false });

await writeFile(path.join(OUT, 'icon.svg'), plain);
await writeFile(path.join(OUT, 'icon-maskable.svg'), maskable);

const browser = await chromium.launch();
const page = await browser.newPage();
async function render(source, size, file, { opaque = false } = {}) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0;background:${opaque ? BG : 'transparent'}}svg{display:block;width:${size}px;height:${size}px}</style>${source}`);
  await page.screenshot({ path: path.join(OUT, file), omitBackground: !opaque, clip: { x: 0, y: 0, width: size, height: size } });
  process.stdout.write(`Wrote assets/${file} (${size}x${size})\n`);
}
await render(plain, 192, 'icon-192.png');
await render(plain, 512, 'icon-512.png');
await render(maskable, 512, 'icon-maskable-512.png', { opaque: true });
/* iOS draws its own rounded corners and turns anything transparent black. */
await render(maskable.replace('scale(0.86)', 'scale(0.94)'), 180, 'apple-touch-icon.png', { opaque: true });
await render(plain, 32, 'favicon-32.png');
await browser.close();
