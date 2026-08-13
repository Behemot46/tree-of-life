// ══════════════════════════════════════════════════════
// LABEL METRICS — one source of truth for how much room a node needs
//
// The renderer places labels and the camera frames the tree, and both need to
// agree on how wide a label is. They used to estimate it separately, and
// disagreed in two ways that were visible on screen: the camera measured only
// the common name (so the longer Latin caption underneath ran off the edge),
// and it ignored how far the label sits from its node in the radial layout.
//
// Widths are estimated from character count rather than measured. Measuring
// means laying out text, and the camera has to know a node's footprint before
// anything is drawn. The constant below is Inter's average advance width at
// the weights used here; it over-estimates narrow strings slightly, which errs
// toward the safe side — a little extra breathing room, never a clipped name.
// ══════════════════════════════════════════════════════

import { displayName } from './utils.js';

// Average glyph advance as a fraction of the font size.
const GLYPH_W = 0.55;
// The Latin caption relative to the common name. Mirrors the ratio between
// --tree-label-name-size and --tree-label-latin-size.
const LATIN_RATIO = 0.78;
// Gap between the two lines, and the caption's descender.
const LINE_GAP = 3;

/* Font size for a node's common name. This is deliberately a wide range: the
   root and the domains are headings, deep species are captions, and a tree
   where everything is set at one size reads as a diagram rather than a map. */
export function labelFontSize(node, isCladogram) {
  const mobile = window.innerWidth < 768;
  const d = node.depth || 0;
  let fs;
  if (isCladogram) {
    fs = d === 0 ? 17 : d === 1 ? 15 : d === 2 ? 13 : 11;
  } else {
    const sibs = node._parent?.children?.length || 1;
    fs = d === 0 ? 19 : d === 1 ? 15 : d === 2 ? 13 : sibs > 12 ? 10 : sibs > 8 ? 11 : 12;
  }
  return mobile ? Math.max(9, Math.round(fs * 0.85)) : fs;
}

export function latinFontSize(nameFs) {
  return Math.max(8, Math.round(nameFs * LATIN_RATIO));
}

/* The text actually drawn — a hominin's short name, otherwise the node's name
   in the active language. Hebrew and Russian names differ in length from the
   English ones, so the camera has to ask for the same string the renderer will
   draw or it frames the wrong box. */
export function labelTextFor(node) {
  return node._hominData ? node._hominData.short : displayName(node);
}

/* Width and height of the two-line label block. The Latin caption is regularly
   the wider of the two lines — "Kingdom Plantae" against "Plants" — so the
   block is as wide as its widest line, not as wide as its first. */
export function labelBox(node, isCladogram) {
  const name = labelTextFor(node) || '';
  const latin = node.latin || '';
  const fs = labelFontSize(node, isCladogram);
  const lfs = latinFontSize(fs);
  const w = Math.max(name.length * fs, latin.length * lfs) * GLYPH_W;
  const h = fs + (latin ? lfs + LINE_GAP : 0);
  return { name, latin, fs, lfs, w, h };
}

/* Where the label block starts, relative to the node centre.

   In the cladogram it always sits to the right. In the radial layout it is
   pushed outward along the node's own branch angle and anchored on whichever
   side keeps it clear of the tree, so a label can extend a full label-width
   further out than the node itself. */
export function labelOffset(node, isCladogram, nodeR) {
  if (isCladogram) return { lx: nodeR + 8, ly: 0, anchor: 'start' };
  const dist = nodeR + 18 + Math.max(0, ((node.depth || 0) - 3) * 4);

  /* Radially outward is the empty side for a leaf, and exactly the wrong side
     for anything with children — that is where its own subtree fans out. The
     root, Bacteria, Archaea and Eukaryota all had their names stamped across
     their own branches. So an expanded node throws its label the other way,
     opposite the average bearing of its children, which is the widest gap
     around it by construction. */
  let ux = 0, uy = 0;
  const kids = node._collapsed ? null : node.children;
  if (kids && kids.length && Number.isFinite(node._x)) {
    let sx = 0, sy = 0, n = 0;
    for (const c of kids) {
      if (c._hiddenByToggle || !Number.isFinite(c._x)) continue;
      const dx = c._x - node._x, dy = c._y - node._y;
      const m = Math.hypot(dx, dy);
      if (m < 1e-6) continue;
      sx += dx / m; sy += dy / m; n++;
    }
    if (n) {
      const m = Math.hypot(sx, sy);
      // Children spread evenly all around cancel out; fall back to radial.
      if (m / n > 0.25) { ux = -sx / m; uy = -sy / m; }
    }
  }
  if (!ux && !uy) {
    const angle = (node._angle || 0) - Math.PI / 2;
    ux = Math.cos(angle); uy = Math.sin(angle);
  }
  return {
    lx: ux * dist,
    ly: uy * dist,
    anchor: ux < -0.15 ? 'end' : ux > 0.15 ? 'start' : 'middle',
  };
}

/* How far a node reaches in each direction, disc and label together, in world
   units. `withLabel` is false for nodes whose labels the renderer will not draw
   at the current zoom — reserving room for three hundred captions that are not
   on screen would shrink the tree to nothing. */
export function nodeFootprint(node, { isCladogram = false, nodeR = 26, withLabel = true } = {}) {
  const r = node.r || nodeR;
  if (!withLabel) return { left: r, right: r, up: r, down: r };
  const box = labelBox(node, isCladogram);
  const off = labelOffset(node, isCladogram, nodeR);
  // The block's horizontal span, from the anchor point.
  const x0 = off.anchor === 'end' ? off.lx - box.w : off.anchor === 'start' ? off.lx : off.lx - box.w / 2;
  const x1 = x0 + box.w;
  // Vertically the name is centred on the anchor and the caption hangs below.
  const y0 = off.ly - box.fs / 2;
  const y1 = off.ly + box.fs / 2 + (box.latin ? box.lfs + LINE_GAP : 0);
  return {
    left: Math.max(r, -x0),
    right: Math.max(r, x1),
    up: Math.max(r, -y0),
    down: Math.max(r, y1),
  };
}
