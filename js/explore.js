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
import { rankKey, subtreeDepth, subtreeSize } from './taxonRank.js';

/* The deepest node the reader has opened. The open path is derived from it
   rather than stored, so the two can never disagree — which is also what makes
   arriving from search free: set this to the node and every ancestor is open
   by construction. */
let _selected = TREE;

/* How deep the open lineage runs, recomputed once per render. The tree is
   drawn with the levels nearest the reader at full strength and the ones they
   came down through receding — atmospheric perspective, which is the cheapest
   way to make a flat page carry depth. Doing that needs each level to know how
   far it is from where the reader is standing, and a level only knows its own
   depth, so the other half of the sum lives here. */
let _selDepth = 0;

/* Levels wider than this are cut off, because unfolding mammals' 43 children
   buries everything under it. Per-node, and remembered for the rest of the
   session: having asked to see all 43 once, being made to ask again every time
   you pass back through is worse than the crowding. */
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

/* No photograph, or none that arrived: the silhouette if there is one, the
   emoji otherwise. Both read perfectly at row size, which is the point — at
   40px on the map neither a photo nor an emoji carried much.

   Rendered hidden when it is standing behind a photograph, and revealed by the
   error handler. Inline `display:none` rather than a class, so that clearing
   it hands the box back to the stylesheet: a silhouette is a masked block and
   an emoji is an inline run, and the handler has no business knowing which. */
function fallbackMedia(node, hidden) {
  const hide = hidden ? 'display:none;' : '';
  if (SILHOUETTES[node.id]) {
    return `<span class="ex-card-sil" style="${hide}--sc:${node.color}" data-sil="${node.id}"></span>`;
  }
  return `<span class="ex-card-emoji"${hide ? ` style="${hide}"` : ''}>${node.icon || '●'}</span>`;
}

/* A URL that resolves is not a URL that loads. Commons files are renamed and
   deleted, and the visitor's connection gets an opinion too — and the row's
   only answer was `data-on-error="hide"`, which took the <img> away and left
   .ex-card-media as an empty 36px hole. Empty is worse than either picture:
   the reader cannot tell a species with no photograph from a page that is
   still loading. So the replacement rides along with the photograph rather
   than being fetched after the fact. The map's discs already do the same
   thing from the other end, probing the file before they attach it. */
function rowMedia(node) {
  const best = ImageLoader ? ImageLoader.getBestUrl(node, 'thumb') : null;
  if (best && best.url) {
    return `<img class="ex-card-img" src="${best.url}" alt="" loading="lazy" data-on-error="hide-show-next">`
      + fallbackMedia(node, true);
  }
  return fallbackMedia(node, false);
}

/* Russian has three plural forms; Hebrew and English have two and repeat the
   third. The numbers here are small — depth never passes nine, and no level
   holds more than 43 — but the full Slavic rule is written out rather than a
   lookup that is right for today's sample and wrong for the first row added
   after it. */
function plural(n, base) {
  if (state.currentLang === 'ru') {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return t(base + '_one');
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return t(base + '_few');
    return t(base + '_many');
  }
  return t(base + (n === 1 ? '_one' : '_many'));
}

/* How wide a group is and how deep it runs — the two questions a reader is
   actually asking before they decide whether to open it.
   "43 inside" alone answers neither: mammals and insects both read as a wall
   of rows, and only one of them has four more levels underneath.

   Depth is *not* named by the rank it bottoms out at, which was the obvious
   idea and is measurably useless here: every one of the 49 groups reaches
   Species, so "down to species" would print the same words on every row on the
   page. What varies is the number of levels (1 to 9) and the group's own rank,
   so those are what is shown. A group one level deep says "5 species" instead
   of "5 inside · 1 level", because that is the same fact in the word the site
   already uses for it. */
function groupSub(node, kids) {
  const bits = [];
  const rk = rankKey(node);
  if (rk) bits.push(t(rk));
  const depth = subtreeDepth(node);
  if (depth <= 1) {
    bits.push(`${kids} ${plural(kids, 'ex_species')}`);
  } else {
    bits.push(`${kids} ${t('ex_inside')}`);
    bits.push(`${depth} ${plural(depth, 'ex_levels')}`);
  }
  return bits.join(' · ');
}

/* One row. `lit` is the open lineage plus the choice set directly beneath it;
   everything else is a branch that was passed over and is drawn grey. */
function rowHTML(node, depth, { open, lit, live, titled }) {
  const kids = childrenOf(node).length;
  /* Translated, and every count kept beside a translated word. "10 inside" put
     a Latin run in an RTL paragraph, which bidi reorders to "inside 10" — the
     same reordering the detail panel already guards against. */
  const sub = kids ? groupSub(node, kids) : (node.era || node.latin || '');
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
            style="--cc:${node.color}"
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
    <div class="ex-reveal" style="--cc:${node.color}">
      ${bits.join('')}
      <div class="ex-reveal-text">${text.join('')}</div>
    </div>`;
}

/* How heavily the line into a branch is drawn.

   Logarithmic, because the counts are not. LUCA carries 305 descendants and
   well over half the rows carry none, so a linear scale draws one thick line
   and three hundred identical hairlines — which says nothing at all. On a log
   scale a species is 1.25px, a five-strong genus is 2.1px and Mammals is
   3.1px, and the difference is visible at a glance without being measured. */
/* 0 at the root, 1 at the level the reader is standing on. The stylesheet
   fades a trunk by this, so eight nested levels read as eight distances rather
   than as eight identical lines — which is what they looked like: five parallel
   reds down the side of a phone, none of them saying which was which. */
function nearness(depth) {
  return Math.round(Math.min(1, depth / _selDepth) * 100) / 100;
}

const BRANCH_MIN = 1.25;
const BRANCH_MAX = 4;
function branchWeight(node) {
  const n = subtreeSize(node);
  if (!n) return BRANCH_MIN;
  return Math.round(Math.min(BRANCH_MAX, BRANCH_MIN + 1.15 * Math.log10(1 + n)) * 100) / 100;
}

/* Recursive, but only through open nodes: a closed branch renders its own row
   and stops. That is what keeps this bounded to one lineage rather than 305
   rows, and it is why no lazy-rendering machinery is needed.

   Each branch is wrapped in an element of its own, and that wrapper is what
   makes the tree drawable. The nesting was always in the DOM — .ex-kids has
   held it from the first version — but nothing joined a row to the row it came
   out of, so the page read as a list that happened to be indented. A wrapper
   per branch gives the stylesheet a box that spans the row *and everything
   below it*, which is exactly the extent a limb has to cover; without one, a
   connector could only ever be as tall as a single row, and :last-child could
   not tell a final sibling from a nested subtree.

   The wrapper carries the two numbers the drawing needs: the branch's weight
   and the clade's colour. */
function branchHTML(node, depth, openSet) {
  const open = openSet.has(node);
  const onPath = open;
  const parentOpen = node._parent ? openSet.has(node._parent) : true;
  // Lit: the open chain itself, and the children of the deepest open node —
  // the set the reader is actually choosing between. Everything else is grey.
  const live = parentOpen && !open && node._parent === _selected;
  const lit = onPath || live;
  const titled = node === _selected;

  let inner = rowHTML(node, depth, { open, lit, live, titled });

  if (open) {
    if (node === _selected) inner += revealHTML(node, depth);

    /* Only _selected is ever both open and childless, and openInExplore
       guarantees _selected has children — so an open node with no children is
       the invariant holding, not a case to render. It used to print "this is
       as deep as this branch goes" here, which nothing on the running site
       could ever see. */
    const kids = childrenOf(node);
    if (kids.length) {
      const cut = kids.length > WIDE && !_showAll.has(node.id);
      const shown = cut ? kids.slice(0, WIDE_HEAD) : kids;
      let k = shown.map((c) => branchHTML(c, depth + 1, openSet)).join('');
      if (cut) {
        const rest = kids.length - WIDE_HEAD;
        k += `<button class="ex-more" data-action="explore:more" data-arg="${node.id}">${rest} ${t('ex_more')}</button>`;
      }
      /* The container carries the *trunk's* weight and colour, not the
         children's. A limb of weight w leaves a trunk of weight W, and the two
         are different numbers — drawing the run between two siblings in the
         weight of whichever sibling happened to be above it would make the
         trunk change thickness between every pair of branches. */
      inner += `<div class="ex-kids" style="--tw:${branchWeight(node)}px; --tc:${node.color}; --near:${nearness(depth + 1)}">${k}</div>`;
    }
  }

  const cls = [
    'ex-branch',
    depth <= 1 ? 'ex-branch-lv1' : '',
    open ? 'open' : '',
    lit ? '' : 'dim',
  ].filter(Boolean).join(' ');

  return `<div class="${cls}" style="--bw:${branchWeight(node)}px; --bc:${node.color}">${inner}</div>`;
}

export function renderExplore() {
  const root = el();
  if (!root) return;
  const path = pathTo(_selected);
  const openSet = new Set(path);
  const parent = _selected._parent;
  _selDepth = Math.max(1, path.length - 1);

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
  /* Not scrollIntoView({block:'nearest'}) on its own. It scrolls until the box
     is inside the *scroll container*, and it cannot see that the bottom 69px of
     that container is covered by the fixed path ribbon — so landing on a deep
     node from search parked it at y=796 in an 844px window, technically
     scrolled-to and entirely behind the ribbon. Ask whether the row clears the
     ribbon, and centre it when it does not; leave it alone when it is already
     comfortably in view, so opening a row near the top does not yank the page. */
  const deepest = [...root.querySelectorAll('.ex-card.open')].pop();
  if (deepest && _selected !== TREE) {
    const ribbon = root.querySelector('.ex-path');
    const floor = ribbon ? ribbon.getBoundingClientRect().top : window.innerHeight;
    const ceil = root.getBoundingClientRect().top;
    const r = deepest.getBoundingClientRect();
    if (r.bottom > floor || r.top < ceil) deepest.scrollIntoView({ block: 'center' });
  }

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
     the thing they were looking for. The detail panel is what they wanted.

     Unconditional, and it was not: the guard used to also require
     _showMainPanel, so a childless node *could* become _selected whenever
     app.js had not wired the panel in yet. That left the render path carrying
     a translated "end of this branch" message for a state the running site
     never reaches — dead copy in three languages, kept alive by a dependency
     check. The invariant is worth more stated plainly: _selected always has
     children. Without a panel to open, a species simply lands the reader among
     its siblings. */
  if (!childrenOf(node).length) {
    /* Open its parent, so closing the panel leaves the reader among the
       species' siblings rather than wherever they happened to be standing
       when they searched for it. */
    if (node._parent) { _selected = node._parent; renderExplore(); }
    if (_showMainPanel) _showMainPanel(node);
    return;
  }

  /* Tapping the row you are already standing on folds it back up, which is the
     other half of an unfold — a disclosure that only ever opens is a trap. */
  _selected = (node === _selected && node._parent) ? node._parent : node;
  renderExplore();
}

/* Where the reader is standing, and the two ways out of it, for the chrome
   that has to describe or leave this view. Exported as functions rather than
   by exposing `_selected`: it has exactly one writer and it lives in this
   file, which is the property that makes the open path safe to derive. */
export function exploreSelection() { return _selected; }

export function exploreUp() {
  if (!_selected._parent) return false;
  _selected = _selected._parent;
  renderExplore();
  return true;
}

export function exploreHome() {
  if (_selected === TREE) return false;
  _selected = TREE;
  renderExplore();
  return true;
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
