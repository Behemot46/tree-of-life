// ══════════════════════════════════════════════════════
// EXPLORE — one tree, unfolding
//
// A drill-down over the same TREE the map draws. The radial view is an expert
// visualisation: lovely once you know what a clade is, and a hairball if you
// do not. On a 390px phone it showed four circles in the corner of a black
// void with 85% of the screen empty, and it offered five overlapping controls
// for one idea — zoom, pan, expand, collapse and a depth slider, any of which
// could put you somewhere you did not mean to be.
//
// This answers three questions and nothing else:
//
//   where am I     the lit chain down the page, and the path ribbon
//   what's inside  the rows that unfold beneath what you opened
//   how do I leave  one back button, and the branches you passed still on screen
//
// It used to answer them one screen at a time: tapping a card wiped the page
// and repainted it as a fresh grid of boxes under a new heading. Every level
// looked like every other level, and nothing on screen said that the thing you
// were now looking at had come out of the thing you tapped. Boxes hanging
// under a title is not a tree.
//
// So it unfolds in place instead. Tapping a group leaves it exactly where it
// is and opens its children directly beneath it, indented one step. The
// branches you did not take stay on the page, greyed — the roads not taken are
// part of what makes a tree legible, and removing them was throwing away the
// only thing that distinguished this from a list of menus.
//
// Three consequences worth knowing before changing any of it:
//
//   * Only one lineage is ever open. Opening a sibling closes the previous
//     branch rather than stacking a second one, so the page grows with depth
//     (nine levels) and never with the whole tree (305 nodes).
//
//   * Rows get denser with depth. The old cards were 132px tall; nine levels
//     of those does not fit a phone, which is the device this view exists for.
//     Depth 1 keeps a rich row, depth 2+ is compact.
//
//   * Grey is a contrast problem, not a paint job. Dimmed rows stay tappable,
//     so WCAG gives them no disabled-control exemption and they must clear AA
//     like everything else. They use --text-secondary, which is measured; do
//     not reach for a low opacity instead. a11y:explore-text-contrast sweeps
//     this view and will fail on it — unless the opacity drops under 0.15, at
//     which point the sweep skips the element and stops protecting you.
// ══════════════════════════════════════════════════════

import { TREE } from './data.js';
import { ImageLoader } from './data.js';
import { state } from './state.js';
import { displayName } from './utils.js';
import { registerActions } from './actions.js';
import { t } from './theme.js';
import { SILHOUETTES } from './silhouettes.js';

/* The deepest node the reader has opened. The open path is derived from it
   rather than stored, so the two can never disagree — which is also what makes
   arriving from search free: set this to the node and every ancestor is open
   by construction. */
let _selected = TREE;

/* Levels wider than this are cut off, because unfolding mammals' 43 children
   buries everything under it. Per-node, and forgotten when it closes. */
const WIDE = 12;
const WIDE_HEAD = 8;
let _showAll = new Set();

/* Late-bound so this module can stay clear of panel.js, which imports plenty
   of its own. app.js wires it at start-up. */
let _showMainPanel = null;
export function initExploreDeps(deps) { _showMainPanel = deps.showMainPanel; }

const el = () => document.getElementById('explore');

/* The chain from LUCA to here. Still the path ribbon's source, and now also
   what decides which rows are lit. */
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

function rowMedia(node) {
  const best = ImageLoader ? ImageLoader.getBestUrl(node, 'thumb') : null;
  if (best && best.url) {
    return `<img class="ex-card-img" src="${best.url}" alt="" loading="lazy" data-on-error="hide">`;
  }
  /* No photograph: the silhouette if there is one, the emoji otherwise. Both
     read perfectly at row size, which is the point — at 40px on the map
     neither a photo nor an emoji carried much. */
  if (SILHOUETTES[node.id]) {
    return `<span class="ex-card-sil" style="--sc:${node.color}" data-sil="${node.id}"></span>`;
  }
  return `<span class="ex-card-emoji">${node.icon || '●'}</span>`;
}

/* One row. `lit` is the open lineage plus the choice set directly beneath it;
   everything else is a branch that was passed over and is drawn grey. */
function rowHTML(node, depth, { open, lit, live, titled }) {
  const kids = childrenOf(node).length;
  /* Translated, and the count kept beside a translated word. "10 inside" put a
     Latin run in an RTL paragraph, which bidi reorders to "inside 10" — the
     same reordering the detail panel already guards against. */
  const sub = kids ? `${kids} ${t('ex_inside')}` : (node.era || node.latin || '');
  /* With children the subtitle is a translated word; without them it is the
     node's era or binomial, which come from the tree data and are English by
     policy. Marking which one it is here is what lets the leak scan tell an
     untranslated control from data that is meant to stay English — and, in
     Hebrew, what enrols it in the direction check instead. */
  const subData = kids ? '' : ' data-i18n-exempt="species-data" dir="ltr"';
  const cls = [
    'ex-card',
    depth <= 1 ? 'ex-card-lv1' : 'ex-card-deep',
    open ? 'open' : '',
    lit ? '' : 'dim',
    live ? 'ex-card-live' : '',
  ].filter(Boolean).join(' ');

  /* .ex-title rides the deepest open row rather than a heading block of its
     own, because there is no longer a screen for a heading to sit above. It
     stays unique — explore:says-where-you-are matches it against .ex-here. */
  const nameCls = 'ex-card-name' + (titled ? ' ex-title' : '');

  return `
    <button class="${cls}" data-action="explore:open" data-arg="${node.id}"
            style="--cc:${node.color}; --d:${Math.min(depth, 4)}"
            ${kids ? `aria-expanded="${open ? 'true' : 'false'}"` : ''}>
      <span class="ex-card-media">${rowMedia(node)}</span>
      <span class="ex-card-text">
        <span class="${nameCls}" data-i18n-exempt="species-data" dir="auto">${displayName(node)}</span>
        <span class="ex-card-sub"${subData}>${sub}</span>
      </span>
      ${kids ? `<span class="ex-card-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>` : ''}
    </button>`;
}

/* What the reader just opened, shown where they opened it: its photograph and
   its description, indented under its own row and above its children. Only the
   deepest open node gets one — nine of these stacked down the page would be
   nine hero images and a wall of prose, which is the crowding this view was
   built to remove. */
function revealHTML(node, depth) {
  const hero = ImageLoader ? ImageLoader.getBestUrl(node, 'hero') : null;
  const bits = [];
  if (hero && hero.url) {
    bits.push(`<img class="ex-hero-img" src="${hero.url}" alt="" data-on-error="hide">`);
  }
  const text = [];
  if (node.latin) text.push(`<p class="ex-latin" data-i18n-exempt="species-data" dir="ltr">${node.latin}</p>`);
  /* English by policy, so it has to be laid out as English. Left RTL, bidi
     moves the sentence's full stop to the far end — this read ".of all life"
     in Hebrew, and the phone clamp put its ellipsis at the start of the line.
     Same guard the detail panel already carries on its own prose. */
  if (node.desc) text.push(`<p class="ex-desc" data-i18n-exempt="species-data" dir="ltr">${node.desc}</p>`);
  if (!bits.length && !text.length) return '';
  return `
    <div class="ex-reveal" style="--cc:${node.color}; --d:${Math.min(depth, 4)}">
      ${bits.join('')}
      <div class="ex-reveal-text">${text.join('')}</div>
    </div>`;
}

/* Recursive, but only through open nodes: a closed branch renders its own row
   and stops. That is what keeps this bounded to one lineage rather than 305
   rows, and it is why no lazy-rendering machinery is needed. */
function branchHTML(node, depth, openSet) {
  const open = openSet.has(node);
  const onPath = open;
  const parentOpen = node._parent ? openSet.has(node._parent) : true;
  // Lit: the open chain itself, and the children of the deepest open node —
  // the set the reader is actually choosing between. Everything else is grey.
  const live = parentOpen && !open && node._parent === _selected;
  const lit = onPath || live;
  const titled = node === _selected;

  let html = rowHTML(node, depth, { open, lit, live, titled });
  if (!open) return html;

  if (node === _selected) html += revealHTML(node, depth);

  const kids = childrenOf(node);
  if (!kids.length) {
    html += `<p class="ex-leaf" style="--d:${Math.min(depth + 1, 4)}">${t('ex_leaf_end')}</p>`;
    return html;
  }

  const cut = kids.length > WIDE && !_showAll.has(node.id);
  const shown = cut ? kids.slice(0, WIDE_HEAD) : kids;
  html += `<div class="ex-kids">${shown.map((c) => branchHTML(c, depth + 1, openSet)).join('')}`;
  if (cut) {
    const rest = kids.length - WIDE_HEAD;
    html += `
      <button class="ex-more" data-action="explore:more" data-arg="${node.id}"
              style="--d:${Math.min(depth + 1, 4)}">${rest} ${t('ex_more')}</button>`;
  }
  html += '</div>';
  return html;
}

export function renderExplore() {
  const root = el();
  if (!root) return;
  const path = pathTo(_selected);
  const openSet = new Set(path);
  const parent = _selected._parent;

  root.innerHTML = `
    <div class="ex-head">
      ${parent
        ? `<button class="ex-back" data-action="explore:open" data-arg="${parent.id}">
             <span aria-hidden="true">‹</span>
             <span data-i18n-exempt="species-data" dir="auto">${displayName(parent)}</span>
           </button>`
        : `<span class="ex-back ex-back-root">${t('ex_all_life')}</span>`}
    </div>

    <div class="ex-tree">${branchHTML(TREE, 0, openSet)}</div>

    <nav class="ex-path" aria-label="${t('ex_path_label')}">
      ${path.map((p, i) => {
        const here = i === path.length - 1;
        return `
        <button class="ex-step${here ? ' current' : ''}"
                data-action="explore:open" data-arg="${p.id}"
                data-name="${displayName(p)}"
                aria-label="${here ? t('ex_you_are_here') : t('ex_go_to')} ${displayName(p)}"
                ${here ? 'aria-current="true"' : ''}><span></span></button>`;
      }).join('')}
      <span class="ex-here" aria-hidden="true" data-i18n-exempt="species-data" dir="auto">${displayName(_selected)}</span>
    </nav>`;

  // Silhouette rows: the file is fetched by the map's cache, so just paint
  // whatever has already arrived and leave the rest showing their ring.
  root.querySelectorAll('[data-sil]').forEach((holder) => {
    const id = holder.getAttribute('data-sil');
    holder.style.webkitMaskImage = `url("assets/silhouettes/${id}.svg")`;
    holder.style.maskImage = `url("assets/silhouettes/${id}.svg")`;
  });

  /* Not scrollTop = 0 any more. The whole point of unfolding in place is that
     the page does not jump, so bring the row that was just opened into view
     and leave everything else where the reader left it. */
  const deepest = [...root.querySelectorAll('.ex-card.open')].pop();
  if (deepest && _selected !== TREE) deepest.scrollIntoView({ block: 'nearest' });

  /* Mark only the branch that was just opened, so the unfold animation plays
     there and not on every already-open level — a full re-render would
     otherwise replay it the whole way down the column on every tap. */
  if (deepest) {
    let sib = deepest.nextElementSibling;
    while (sib && !sib.classList.contains('ex-kids')) sib = sib.nextElementSibling;
    if (sib) sib.classList.add('ex-just-opened');
  }
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
  if (!childrenOf(node).length && _showMainPanel) {
    /* Open its parent, so closing the panel leaves the reader among the
       species' siblings rather than wherever they happened to be standing
       when they searched for it. */
    if (node._parent) { _selected = node._parent; renderExplore(); }
    _showMainPanel(node);
    return;
  }

  /* Tapping the row you are already standing on folds it back up, which is the
     other half of an unfold — a disclosure that only ever opens is a trap. */
  _selected = (node === _selected && node._parent) ? node._parent : node;
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
    if (dx > 70 && Math.abs(dy) < 50 && _selected._parent) openInExplore(_selected._parent);
  }, { passive: true });
}

function findById(n, id) {
  if (n.id === id) return n;
  for (const c of n.children || []) { const f = findById(c, id); if (f) return f; }
  return null;
}

export function initExplore() {
  registerActions({
    'explore:open': (id) => openInExplore(id),
    'explore:more': (id) => { _showAll.add(id); renderExplore(); },
  });
  const root = el();
  if (root) initSwipeBack(root);
  renderExplore();
}
