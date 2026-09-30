// ══════════════════════════════════════════════════════
// KIN — AN EMOJI THE DEVICE CAN ACTUALLY DRAW
//
// Every creature is an emoji, and the newer ones — the donkey and the
// jellyfish arrived in 2022 — are missing from older phones and from
// Windows 10, which draw an empty box in their place. A card with a box on
// it is a question nobody can read.
//
// The test is the one emoji pickers use: draw the glyph twice, in two
// different inks. A colour emoji is a picture and ignores the ink, so the two
// drawings match; a missing glyph comes out as a box, or a box with its code
// point in it, drawn *in* the ink, so they differ. A mostly grey emoji — the
// zebra, the panda, the rat — still passes, which a "does it have any colour
// in it" test would not.
//
// A creature the device cannot draw shows its kingdom's sign instead — 🐾, 🌿
// or 🍄, all old enough to be everywhere — and keeps its name on the card.
// ══════════════════════════════════════════════════════

const FALLBACK = { animal: '🐾', plant: '🌿', fungus: '🍄' };
const SIZE = 24;
const known = new Map();
let ctx = null;

function drawn(text, ink) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = ink;
  ctx.fillText(text, 0, 0);
  return ctx.getImageData(0, 0, SIZE, SIZE).data;
}

/** True when this device draws `text` as a colour emoji. Remembered per
    glyph; true whenever the test itself cannot run, so a browser without
    canvas keeps the emoji rather than losing it. */
export function drawable(text) {
  if (known.has(text)) return known.get(text);
  let ok = true;
  try {
    if (!ctx) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = SIZE;
      ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.textBaseline = 'top';
      ctx.font = `${SIZE - 4}px sans-serif`;
    }
    const dark = drawn(text, '#000');
    const light = drawn(text, '#fff');
    let painted = false, same = true;
    for (let i = 0; i < dark.length; i++) {
      if (dark[i] !== light[i]) { same = false; break; }
      if (i % 4 === 3 && dark[i]) painted = true;
    }
    ok = painted && same;
  } catch {
    ok = true;
  }
  known.set(text, ok);
  return ok;
}

/** The creature's emoji, or its kingdom's sign when the emoji would be a box.
    If even the sign cannot be drawn — a system with no colour emoji at all —
    the emoji is kept: swapping one box for another helps nobody. */
export function glyph(c) {
  if (drawable(c.e)) return c.e;
  const sign = FALLBACK[c.k] || FALLBACK.animal;
  return drawable(sign) ? sign : c.e;
}
