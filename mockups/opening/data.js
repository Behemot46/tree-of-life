// Loads the site's real data for the gallery: the tree, the translations and
// the silhouettes. Nothing here is invented for the mockups.

import { TREE, lightenColor } from '../../js/treeData.js';
import { expandTree } from '../../js/treeExpansion.js';
import { TRANSLATIONS } from '../../js/uiData.js';
import { SILHOUETTES } from '../../js/silhouettes.js';

let expanded = false;
export function siteTree() {
  if (!expanded) { expandTree(TREE, lightenColor); expanded = true; }
  return TREE;
}
export const translations = TRANSLATIONS;
export const silhouetteIds = () => new Set(Object.keys(SILHOUETTES));

const cache = new Map();
/** A silhouette as Path2D plus the numbers needed to place it. */
export function loadSilhouette(id) {
  if (cache.has(id)) return cache.get(id);
  const p = fetch(`../../assets/silhouettes/${id}.svg`)
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(id))))
    .then((txt) => {
      const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      const svg = doc.documentElement;
      const vb = (svg.getAttribute('viewBox') || '0 0 100 100').split(/\s+/).map(Number);
      const g = doc.querySelector('g');
      let tx = 0, ty = 0, sx = 1, sy = 1;
      const tr = g && g.getAttribute('transform');
      if (tr) {
        const t = tr.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
        const s = tr.match(/scale\(([-\d.]+)(?:[ ,]+([-\d.]+))?\)/);
        if (t) { tx = +t[1]; ty = +t[2]; }
        if (s) { sx = +s[1]; sy = s[2] !== undefined ? +s[2] : +s[1]; }
      }
      const paths = [...doc.querySelectorAll('path')].map((n) => new Path2D(n.getAttribute('d')));
      return { paths, vbW: vb[2], vbH: vb[3], tx, ty, sx, sy };
    })
    .catch(() => null);
  cache.set(id, p);
  return p;
}

/** Fill (and optionally outline) a silhouette, centred at (x, y), fitted into
    a box of `size` px. Returns nothing; draws in the current transform. */
export function drawSilhouette(ctx, sil, x, y, size, { fill, stroke, strokeWidth = 0, rot = 0, alpha = 1 } = {}) {
  if (!sil) return;
  const k = size / Math.max(sil.vbW, sil.vbH);
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.scale(k, k);
  ctx.translate(-sil.vbW / 2, -sil.vbH / 2);
  ctx.translate(sil.tx, sil.ty);
  ctx.scale(sil.sx, sil.sy);
  ctx.globalAlpha *= alpha;
  ctx.lineJoin = 'round';
  if (stroke && strokeWidth) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth / (k * Math.abs(sil.sx));
    for (const p of sil.paths) ctx.stroke(p);
  }
  if (fill) { ctx.fillStyle = fill; for (const p of sil.paths) ctx.fill(p); }
  ctx.restore();
}
