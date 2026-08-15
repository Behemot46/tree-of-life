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
import { t } from './theme.js';
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

/* The silhouette if there is one, the emoji otherwise. Both read perfectly at
   card size, which is the point — at 40px on the map neither a photo nor an
   emoji carried much. `hidden` renders it as the img's understudy. */
function cardFallback(node, hidden) {
  const off = hidden ? ';display:none' : '';
  if (SILHOUETTES[node.id]) {
    return `<span class="ex-card-sil" style="--sc:${node.color}${off}"
              data-sil="${node.id}"></span>`;
  }
  return `<span class="ex-card-emoji"${hidden ? ' style="display:none"' : ''}>${node.icon || '●'}</span>`;
}

/* A photograph *and* its understudy, not one or the other.

   These were an `<img data-on-error="hide">` with the silhouette and emoji as
   `else` arms — arms that only ran when no URL resolved at all. So a URL that
   resolved and then failed to load hid the image and put nothing in its place:
   the whole Protists screen was six empty grey rectangles, cards that a reader
   cannot tell from cards still loading. Which is the same fault the tree discs
   had until the silhouettes went inline — the fallback was dropped the moment
   a photograph was *requested* rather than when one actually arrived.

   `hide-show-next` already exists for precisely this and reveals the next
   sibling, so the understudy ships with every card and waits. */
function cardImage(node) {
  const best = ImageLoader ? ImageLoader.getBestUrl(node, 'thumb') : null;
  if (best && best.url) {
    return `<img class="ex-card-img" src="${best.url}" alt="" loading="lazy"
              data-on-error="hide-show-next">${cardFallback(node, true)}`;
  }
  return cardFallback(node, false);
}

/* Geological periods are UI vocabulary, not species data — the timeline strip
   has printed them in all three languages for as long as it has existed, under
   `seg_*` keys. The card subtitle printed `node.era` raw, so a Hebrew reader
   got "Neoproterozoic", "Cambrian", "Triassic": the same words, the same keys,
   simply never looked up.

   Tries the whole string, then its first and last word, which is what carries
   the qualified forms — "Late Cretaceous" resolves on `cretaceous`, "Silurian
   (lineage)" on `silurian`. Freeform ages like "~2 Billion Years Ago" match
   nothing and return null; there is no vocabulary to translate there, and the
   caller has something better to show. */
function eraLabel(era) {
  if (!era) return null;
  const words = String(era).toLowerCase().match(/[a-z]+/g);
  if (!words || !words.length) return null;
  for (const cand of [words.join(''), words[0], words[words.length - 1]]) {
    const key = 'seg_' + cand;
    const got = t(key);
    if (got !== key) return got;   // t() echoes the key back when there is none
  }
  return null;
}

/* What goes under the name. Three cases, and only one of them is English. */
function cardSub(node) {
  const kids = childrenOf(node).length;
  /* Translated, and the count kept beside a translated word. "10 inside" put a
     Latin run in an RTL paragraph, which bidi reorders to "inside 10" — the
     same reordering the detail panel already guards against. */
  if (kids) return { text: `${kids} ${t('ex_inside')}`, english: false };
  const era = eraLabel(node.era);
  if (era) return { text: era, english: false };
  /* No period to name: the binomial, which is better than the freeform age it
     replaces — "Phytophthora infestans" over "~100 Mya (divergence)" — and is
     legitimately English, so it is marked as such rather than left to look
     like an untranslated string. */
  return { text: node.latin || '', english: true };
}

function cardHTML(node) {
  const kids = childrenOf(node).length;
  const sub = cardSub(node);
  const subAttrs = sub.english ? ' dir="ltr" data-i18n-exempt' : '';
  return `
    <button class="ex-card" data-action="explore:open" data-arg="${node.id}"
            style="--cc:${node.color}">
      <span class="ex-card-media">${cardImage(node)}</span>
      <span class="ex-card-name" data-i18n-exempt>${displayName(node)}</span>
      <span class="ex-card-sub"${subAttrs}>${sub.text}</span>
      ${kids ? '<span class="ex-card-chev" aria-hidden="true">›</span>' : ''}
    </button>`;
}

/* Both `dir="ltr"` attributes below are load-bearing, not decoration.
   Descriptions and Latin names are English in every language, by the same rule
   that keeps species prose English — and inherited RTL sends their punctuation
   to the wrong end. LUCA's read "…hydrothermal vents on the ancient ocean
   floor," with the clamp's ellipsis stranded on the left, the same reordering
   the detail panel and the splash's "720 Ma" already guard against.

   `data-i18n-exempt` marks them as English on purpose, so the leak scan skips
   them instead of being weakened to accommodate them. */
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
        : `<span class="ex-back ex-back-root">${t('ex_all_life')}</span>`}
    </div>

    <div class="ex-hero" style="--cc:${n.color}">
      ${hero && hero.url
        ? `<img class="ex-hero-img" src="${hero.url}" alt=""
             data-on-error="hide-show-next"><span class="ex-hero-emoji"
             style="display:none">${n.icon || ''}</span>`
        : `<span class="ex-hero-emoji">${n.icon || ''}</span>`}
      <div class="ex-hero-text">
        <h2 class="ex-title">${displayName(n)}</h2>
        ${n.latin ? `<p class="ex-latin" dir="ltr" data-i18n-exempt>${n.latin}</p>` : ''}
        ${n.desc ? `<p class="ex-desc" dir="ltr" data-i18n-exempt>${n.desc}</p>` : ''}
      </div>
    </div>

    ${kids.length
      ? `<div class="ex-grid">${kids.map(cardHTML).join('')}</div>`
      : `<p class="ex-leaf">${t('ex_leaf_end')}</p>`}

    <nav class="ex-path" aria-label="${t('ex_path_label')}">
      ${path.map((p, i) => {
        const here = i === path.length - 1;
        /* Read aloud, so it is UI copy and not decoration — it was hardcoded
           English, which made a Hebrew screen reader announce "You are here:
           פרוטיסטים". */
        const label = `${here ? t('ex_you_are_here') : t('ex_go_to')}: ${displayName(p)}`;
        return `
        <button class="ex-step${here ? ' current' : ''}"
                data-action="explore:open" data-arg="${p.id}"
                data-name="${displayName(p)}"
                aria-label="${label}"
                ${here ? 'aria-current="true"' : ''}><span></span></button>`;
      }).join('')}
      <span class="ex-here" aria-hidden="true">${displayName(n)}</span>
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
  if (!childrenOf(node).length && _showMainPanel) {
    /* Move to its parent first, so closing the panel leaves the reader among
       the species' siblings rather than wherever they happened to be standing
       when they searched for it. */
    if (node._parent) { _current = node._parent; renderExplore(); }
    _showMainPanel(node);
    return;
  }

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
