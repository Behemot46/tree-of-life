// ══════════════════════════════════════════════════════
// EXPLORE — one screen, one level
//
// A drill-down over the same TREE the map draws. The radial view is an expert
// visualisation: lovely once you know what a clade is, and a hairball if you
// do not. On a 390px phone it showed four circles in the corner of a black
// void with 85% of the screen empty, and it offered five overlapping controls
// for one idea — zoom, pan, expand, collapse and a depth slider, any of which
// could put you somewhere you did not mean to be.
//
// This answers three questions on every screen and nothing else:
//
//   where am I     the header and the path ribbon
//   what's inside  a grid of large, tappable cards
//   how do I leave  one back button
//
// There is no camera. Nothing can be scrolled off-screen, nothing can be
// zoomed into nothing, and every tap has exactly one meaning. A grid also
// reflows from a phone to a desktop, which a radial fan cannot.
// ══════════════════════════════════════════════════════

import { TREE } from './data.js';
import { ImageLoader } from './data.js';
import { state } from './state.js';
import { displayName } from './utils.js';
import { registerActions } from './actions.js';
import { SILHOUETTES } from './silhouettes.js';

let _current = TREE;

/* Late-bound so this module can stay clear of panel.js, which imports plenty
   of its own. app.js wires it at start-up. */
let _showMainPanel = null;
export function initExploreDeps(deps) { _showMainPanel = deps.showMainPanel; }

const el = () => document.getElementById('explore');

/* The chain from LUCA to here, which is what gives the descent its sense of
   depth — without it every screen looks like every other screen. */
function pathTo(node) {
  const out = [];
  for (let n = node; n; n = n._parent) out.unshift(n);
  return out;
}

/* Every child, including the ones the map hides.

   `_hiddenByToggle` is set by the map's "show all species" switch, which
   exists to stop three hundred discs crowding the canvas. A list has no such
   problem, and inheriting that flag here made every phylum look childless —
   tapping Spirochetes opened a panel instead of descending, so most of the
   tree was simply unreachable from the view that is meant to be the way in. */
function childrenOf(node) {
  return node.children || [];
}

function cardImage(node) {
  const best = ImageLoader ? ImageLoader.getBestUrl(node, 'thumb') : null;
  if (best && best.url) {
    return `<img class="ex-card-img" src="${best.url}" alt="" loading="lazy" data-on-error="hide">`;
  }
  /* No photograph: the silhouette if there is one, the emoji otherwise. Both
     read perfectly at card size, which is the point — at 40px on the map
     neither a photo nor an emoji carried much. */
  if (SILHOUETTES[node.id]) {
    return `<span class="ex-card-sil" style="--sc:${node.color}"
              data-sil="${node.id}"></span>`;
  }
  return `<span class="ex-card-emoji">${node.icon || '●'}</span>`;
}

function cardHTML(node) {
  const kids = childrenOf(node).length;
  const sub = kids ? `${kids} inside` : (node.era || node.latin || '');
  return `
    <button class="ex-card" data-action="explore:open" data-arg="${node.id}"
            style="--cc:${node.color}">
      <span class="ex-card-media">${cardImage(node)}</span>
      <span class="ex-card-name">${displayName(node)}</span>
      <span class="ex-card-sub">${sub}</span>
      ${kids ? '<span class="ex-card-chev" aria-hidden="true">›</span>' : ''}
    </button>`;
}

export function renderExplore() {
  const root = el();
  if (!root) return;
  const n = _current;
  const kids = childrenOf(n);
  const path = pathTo(n);
  const parent = n._parent;

  const hero = ImageLoader ? ImageLoader.getBestUrl(n, 'hero') : null;

  root.innerHTML = `
    <div class="ex-head">
      ${parent
        ? `<button class="ex-back" data-action="explore:open" data-arg="${parent.id}">
             <span aria-hidden="true">‹</span> ${displayName(parent)}
           </button>`
        : '<span class="ex-back ex-back-root">All life on Earth</span>'}
    </div>

    <div class="ex-hero" style="--cc:${n.color}">
      ${hero && hero.url
        ? `<img class="ex-hero-img" src="${hero.url}" alt="" data-on-error="hide">`
        : `<span class="ex-hero-emoji">${n.icon || ''}</span>`}
      <div class="ex-hero-text">
        <h2 class="ex-title">${displayName(n)}</h2>
        ${n.latin ? `<p class="ex-latin" dir="ltr">${n.latin}</p>` : ''}
        ${n.desc ? `<p class="ex-desc">${n.desc}</p>` : ''}
      </div>
    </div>

    ${kids.length
      ? `<div class="ex-grid">${kids.map(cardHTML).join('')}</div>`
      : `<p class="ex-leaf">This is as deep as this branch goes.</p>`}

    <nav class="ex-path" aria-label="Your path from the origin of life">
      ${path.map((p, i) => `
        <button class="ex-step${i === path.length - 1 ? ' current' : ''}"
                data-action="explore:open" data-arg="${p.id}"
                title="${displayName(p)}"><span></span></button>`).join('')}
    </nav>`;

  // Silhouette cards: the file is fetched by the map's cache, so just paint
  // whatever has already arrived and leave the rest showing their ring.
  root.querySelectorAll('[data-sil]').forEach((holder) => {
    const id = holder.getAttribute('data-sil');
    holder.style.webkitMaskImage = `url("assets/silhouettes/${id}.svg")`;
    holder.style.maskImage = `url("assets/silhouettes/${id}.svg")`;
  });

  root.scrollTop = 0;
}

export function openInExplore(nodeOrId) {
  const node = typeof nodeOrId === 'string'
    ? (state.nodeMap ? state.nodeMap[nodeOrId] : null) || findById(TREE, nodeOrId)
    : nodeOrId;
  if (!node) return;

  /* A species is the destination, not another level. Descending into one used
     to leave you on a screen whose only content was "this is as deep as this
     branch goes" — a dead end at exactly the moment the reader had arrived at
     the thing they were looking for. The detail panel is what they wanted. */
  if (!childrenOf(node).length && _showMainPanel) { _showMainPanel(node); return; }

  _current = node;
  renderExplore();
}

/* Swipe right to go up a level, the gesture a phone reader will try first. */
function initSwipeBack(root) {
  let x0 = 0, y0 = 0, live = false;
  root.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { live = false; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; live = true;
  }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (!live) return;
    live = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - x0, dy = t.clientY - y0;
    // Horizontal, decisive, and not a scroll.
    if (dx > 70 && Math.abs(dy) < 50 && _current._parent) openInExplore(_current._parent);
  }, { passive: true });
}

function findById(n, id) {
  if (n.id === id) return n;
  for (const c of n.children || []) { const f = findById(c, id); if (f) return f; }
  return null;
}

export function initExplore() {
  registerActions({ 'explore:open': (id) => openInExplore(id) });
  const root = el();
  if (root) initSwipeBack(root);
  renderExplore();
}
