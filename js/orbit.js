// ══════════════════════════════════════════════════════
// ORBIT — "everyone is your relative"
//
// Pick a creature and it sits at the top; every other creature is laid out
// below it by how long ago the two of you last shared an ancestor. Press any
// of them and it becomes the new centre — the picture glides to answer. The
// question Explore cannot ask is the one this asks by being pressed: "who is
// the closest relative of a mushroom?" There is no wrong tap.
//
// A fan rather than a circle. A lineage nine generations deep needs nine
// rings, and a circle spends its radius in every direction while a screen has
// room in one; time running DOWN the page is the direction a thumb already
// scrolls.
//
// Things worth knowing before changing it:
//
//   * Rings are the ancestors on the way from the focus to the root, nearest
//     first. The bubbles on a ring are that ancestor's OTHER children — the
//     branches the lineage did not take there. An ancestor whose only child is
//     the lineage itself has no one to show and gets no ring.
//
//   * Placement is a search, not a force. Each bubble asks for the spot its
//     ring gives it; if that is taken it tries along the ring, then a little
//     in or out, and takes the first that is free. Nothing is pushed, so
//     nothing oscillates and two bubbles cannot end up on each other — the
//     version that pushed them apart made some of its own collisions. What
//     does not fit becomes the ring's "+N" bubble. `layoutOrbit` is pure, and
//     `orbit:nothing-overlaps` measures what it produced.
//
//   * Every word is HTML and every picture a bubble. Species names are data
//     and stay English; groups take their translated name via displayName.
//     The time on a chip is written in the reader's language, not "Ma", which
//     is a Latin run in an RTL paragraph.
//
//   * It reads every child, ignoring `_hiddenByToggle`, for the same reason
//     Explore does: that flag belongs to the map's "show all species" switch.
// ══════════════════════════════════════════════════════

import { TREE, ImageLoader, NODE_ICONS, getIconGroup } from './data.js';
import { state } from './state.js';
import { displayName, reducedMotion } from './utils.js';
import { registerActions } from './actions.js';
import { t } from './theme.js';
import { SILHOUETTES } from './silhouettes.js';
import { subtreeSize } from './taxonRank.js';

/* Where the fan starts: the reader. The person is `h_sapiens` once the hominin
   nodes are grafted in, `homo-sapiens` in the bare tree — whichever exists. */
const START_IDS = ['h_sapiens', 'homo-sapiens'];
const startNode = () => START_IDS.map(byId).find(Boolean) || TREE;
const SVG_NS = 'http://www.w3.org/2000/svg';

let _showMainPanel = null;
export function initOrbitDeps(deps) { _showMainPanel = deps.showMainPanel; }

let _focus = null;
let _trail = [];                 // where the reader has been, oldest first
const _els = new Map();          // key → bubble element
let _built = false;
let _pin = null;                 // the creature being compared against, until the reader lets go
const PIN_KEY = 'tol-orbit-pin'; // its id, kept so a reload (or the home-screen app waking) does not drop the comparison
function savePin() {
  try { _pin ? localStorage.setItem(PIN_KEY, _pin.id) : localStorage.removeItem(PIN_KEY); } catch (e) { /* blocked storage: the pin lasts the visit */ }
}
let _pinRestored = false;
let _from = null;                // the centre we just left, kept among the children when going up

const root = () => document.getElementById('orbit');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const kids = (n) => n.children || [];
const size = (n) => 1 + subtreeSize(n);
const age = (n) => (typeof n.appeared === 'number' ? n.appeared : 0);

function byId(id) {
  if (!id) return null;
  const find = (n) => {
    if (n.id === id) return n;
    for (const c of kids(n)) { const f = find(c); if (f) return f; }
    return null;
  };
  return (state.nodeMap && state.nodeMap[id]) || find(TREE);
}

/* Parents are worked out here, on every paint, rather than read from `_parent`:
   the hominin nodes are grafted in after start-up, and a view that is first
   shown from a saved preference is painted before some of them exist. 379
   nodes is nothing to walk. */
const _up = new Map();
function linkParents() {
  _up.clear();
  (function walk(n, parent) { _up.set(n, parent); kids(n).forEach((c) => walk(c, n)); })(TREE, null);
}
const parentOf = (n) => _up.get(n) || null;

function pathTo(n) {
  const out = [];
  for (let x = n; x; x = parentOf(x)) out.unshift(x);
  return out;
}

/* "541 Ma" in English; the same figure in a word the reader's script can lay
   out. Hebrew and Russian count in millions and billions rather than Ma / Ga. */
export function chipAge(mya, lang) {
  const n = (v) => String(+v.toFixed(v >= 10 ? 0 : 1));
  if (mya >= 1000) {
    const b = n(mya / 1000);
    return { en: `${b} Ga`, he: `${b} מיליארד`, ru: `${b} млрд` }[lang] || `${b} Ga`;
  }
  if (mya >= 1) {
    const m = n(mya);
    return { en: `${m} Ma`, he: `${m} מל"ש`, ru: `${m} млн` }[lang] || `${m} Ma`;
  }
  return { en: '<1 Ma', he: 'פחות ממיליון', ru: '<1 млн' }[lang] || '<1 Ma';
}

// ── Who goes where ────────────────────────────────────────────────────────

/* The ancestors of `f`, nearest first, each with the branches its lineage did
   not take. An ancestor with no one else to show gets no ring. */
export function relatives(f) {
  const chain = pathTo(f);
  const out = [];
  for (let i = chain.length - 2; i >= 0; i--) {
    const A = chain[i], on = chain[i + 1];
    const sibs = kids(A).filter((k) => k !== on);
    if (sibs.length) out.push({ A, age: age(A), sibs });
  }
  return out;
}

/* Pure: a focus and a window in, a list of placed bubbles out. */
export function layoutOrbit(focus, W, H, rtl, prefer = null) {
  const phone = W < 560;
  const R = rtl ? -1 : 1;
  const Sf = phone ? 96 : 124;
  const Wb = phone ? 96 : 112;                  // a bubble's footprint: its label is clipped to this
  const LH = 32;                                // the label under a bubble: a name and a number
  const TOP = 48;                               // the lineage strip lives above this
  const cx = W / 2, cy = TOP + 6 + Sf / 2;
  const bottom = H - (phone ? 100 : 80);         // the action row lives below this
  const items = [];
  const rings = [];

  const focusSub = kids(focus).length ? `${size(focus) - 1}` : '';
  /* The focus's name is a whole word at 15px — "Беспозвоночные" is wider than a
     bubble's footprint — so its label gets the width of the window, up to a
     comfortable measure, and the footprint below says so. */
  const Wf = Math.min(W - 16, 156);
  items.push({ key: focus.id, n: focus, kind: 'focus', x: cx, y: cy, d: Sf, w: Wf, h: Sf + 62, sub: focusSub });

  let cursor = Sf / 2 + 66;                     // clear of the focus's own label

  /* How many bubbles an arc can carry, and how wide it may open. A ring near
     the top has the whole width of the fan; one at the foot is as wide as the
     window and no wider. */
  const arcOf = (rad, span) => {
    const reach = W / 2 - Wb / 2 - 6;
    const phi = Math.min(span, rad > reach ? Math.asin(Math.min(1, reach / rad)) : span);
    /* n bubbles share an arc of 2*phi*rad, so each gets arc/n and needs Wb: the
       count is the floor of that ratio, with no "+1" for the two ends. The
       endpoint-inclusive version said four would fit where three did, and two
       pictures were laid on top of each other. */
    const cap = Math.max(1, Math.floor((rad * 2 * phi) / (Wb + 4)));
    return { phi, cap };
  };
  /* Evenly across the arc, each ring a half-step off the one before, so two
     rings never stack their bubbles in one column with a name printed on the
     next picture. */
  const spread = (n, phi, ringIdx) => (j) => {
    if (n === 1) return ringIdx % 2 ? phi * 0.22 : -phi * 0.22;
    const cell = (2 * phi) / n;
    return -phi + cell * (j + 0.5) + (ringIdx % 2 ? cell * 0.22 : -cell * 0.22);
  };
  const foot = (x, y, d) => ({ l: x - Wb / 2, r: x + Wb / 2, t: y - d / 2, b: y - d / 2 + d + LH });
  /* The focus's label is a name that may take two lines and a count under it,
     so its footprint is taller than a relative's. */
  const placed = [{ l: cx - Wf / 2, r: cx + Wf / 2, t: cy - Sf / 2, b: cy + Sf / 2 + 62 }];
  const clear = (bx) => bx.l >= 4 && bx.r <= W - 4 && bx.t >= TOP && bx.b <= H - (phone ? 96 : 76) &&
    !placed.some((p) => bx.l < p.r + 2 && bx.r > p.l - 2 && bx.t < p.b + 2 && bx.b > p.t - 2);
  const spot = (rad, th0, phi, d) => {
    const step = 5 / rad;
    /* Along the ring first, then a little in or out, and failing that further
    out: a ring that is crowded by the focus's own label has room beyond it. */
    for (const dr of [0, 9, -9, 18, -18, 27, -27, 45, 63, 81]) {
      const r = rad + dr;
      for (let k = 0; k * step <= 2 * phi; k++) {
        for (const sg of k ? [1, -1] : [1]) {
          const th = clamp(th0 + sg * k * step, -phi, phi);
          const x = cx + R * r * Math.sin(th), y = cy + r * Math.cos(th);
          const bx = foot(x, y, d);
          if (clear(bx)) { placed.push(bx); return { x, y, th, rad: r }; }
        }
      }
    }
    return null;
  };
  /* A ring names its ancestor, and pressing the name centres on it. The label sits
     on the arc near one end — where bubbles are fewest — and is a footprint like
     any other, so no bubble is laid across it. It slides inward until it finds a
     free spot; a ring with none goes unlabelled rather than overlapping. */
  const LBW = phone ? 120 : 140, LBH = 24;
  const labelFor = (A, mya, rad, phi) => {
    for (const dr of [0, 12, -12, 24, -24]) {
      for (const back of [0, 0.12, 0.24, 0.36, 0.5, 0.7, 0.9]) {
        for (const sg of [-1, 1]) {
          const th = sg * (phi - back);
          const x = clamp(cx + R * (rad + dr) * Math.sin(th), 4 + LBW / 2, W - 4 - LBW / 2);
          const y = cy + (rad + dr) * Math.cos(th);
          const bx = { l: x - LBW / 2, r: x + LBW / 2, t: y - LBH / 2, b: y + LBH / 2 };
          if (clear(bx)) { placed.push(bx); return { id: A.id, n: A, mya, x, y, w: LBW, h: LBH }; }
        }
      }
    }
    return null;
  };
  const put = (n, kind, rad, th0, d, sub, extra = {}) => {
    const at = spot(rad, th0, extra.phi, d);
    return at && { key: extra.key || n.id, n, kind, d, sub, w: Wb, h: d + LH, ...at, ...extra };
  };

  // The inside of the focus: its children, on the nearest arc.
  if (kids(focus).length) {
    const d = phone ? 44 : 54;
    const rad = cursor + d / 2;
    const { phi, cap } = arcOf(rad, 1.3);
    const all = kids(focus);
    const take = [...all].sort((x, y) => size(y) - size(x)).slice(0, all.length > cap ? cap - 1 : cap);
    /* Going up, the place you came from is always among the children: a leaf in a
       big group would otherwise be behind "+N", and the picture could not show
       where you were. */
    if (prefer && all.includes(prefer) && !take.includes(prefer) && take.length) take[take.length - 1] = prefer;
    const shown = all.filter((k) => take.includes(k));
    const n = shown.length + (all.length > shown.length ? 1 : 0);
    const at = spread(n, phi, 0);
    /* The "+N" goes first. Placed last it found the ring full — the shown
       bubbles drift along the arc to the first free spot, and the slot kept for
       it was one of them — and the relatives behind it were then unreachable. */
    const m = all.length > shown.length
      ? put(focus, 'more', rad, at(shown.length), d, '+', { key: `more:${focus.id}`, phi })
      : null;
    const mine = [];
    shown.forEach((k, j) => {
      const it = put(k, 'sat', rad, at(j), d, kids(k).length ? `${size(k) - 1}` : '', { phi });
      if (it) mine.push(it);
    });
    const hidden = all.length - mine.length;
    items.push(...mine);
    if (m) { m.sub = `+${hidden}`; items.push(m); }
    rings.push({ r: rad, phi, kind: 'in', total: all.length, shown: mine.length, hidden, more: !!m });
    cursor = rad + d / 2 + LH + 6;
  }

  /* The relatives, nearest ancestor first. Rings the window cannot hold are
     merged into the last one rather than dropped: the far branches (fungi,
     plants, bacteria) are the most surprising relatives there are. */
  let rs = relatives(focus);
  const avail = bottom - cy - cursor;
  /* As many rings as the height holds at the least spacing a ring can be given;
     the rest are merged into the last. A deep lineage (a hominin, nine rings
     down) otherwise ran past the foot of the window and took its "+N" bubbles
     with it, leaving relatives nobody could reach. */
  const maxRings = Math.max(1, Math.min(phone ? 6 : 7, Math.floor(avail / (phone ? 70 : 82))));
  if (rs.length > maxRings) {
    const keep = rs.slice(0, maxRings - 1), rest = rs.slice(maxRings - 1);
    keep.push({ A: rest[rest.length - 1].A, age: rest[rest.length - 1].age, sibs: rest.flatMap((x) => x.sibs), merged: rest });
    rs = keep;
  }
  const slot = clamp(avail / Math.max(1, rs.length), phone ? 70 : 82, 112);
  const dBase = clamp(slot - LH - 8, phone ? 38 : 44, phone ? 56 : 68);
  rs.forEach((ring, i) => {
    const rad = cursor + dBase / 2 + i * slot;
    const { phi, cap } = arcOf(rad, 1.32);
    const take = [...ring.sibs].sort((x, y) => size(y) - size(x)).slice(0, ring.sibs.length > cap ? cap - 1 : cap);
    const shown = ring.sibs.filter((k) => take.includes(k));
    const n = shown.length + (ring.sibs.length > shown.length ? 1 : 0);
    const at = spread(n, phi, i + 1);
    const m = ring.sibs.length > shown.length
      ? put(ring.A, 'more', rad, at(shown.length), dBase, '+', { key: `more:${ring.A.id}:${i}`, phi, ring: i })
      : null;
    const mine = [];
    shown.forEach((k, j) => {
      const via = ring.merged ? ring.merged.find((x) => x.sibs.includes(k)).A : ring.A;
      const d = clamp(dBase + 4 * Math.log2(size(k)) - 4, phone ? 38 : 44, phone ? 60 : 74);
      const it = put(k, 'rel', rad, at(j), d, age(via), { phi, via, ring: i });
      if (it) mine.push(it);
    });
    const hidden = ring.sibs.length - mine.length;
    items.push(...mine);
    if (m) { m.sub = `+${hidden}`; items.push(m); }
    /* Last, and only in what is left: a label never costs a relative its place. */
    const label = labelFor(ring.A, ring.age, rad, phi);
    rings.push({ r: rad, phi, kind: 'out', total: ring.sibs.length, shown: mine.length, hidden, more: !!m, label });
  });

  return { items, rings, cx, cy, W, H, top: TOP };
}

// ── One bubble ────────────────────────────────────────────────────────────

/* Layers, bottom to top: a tinted disc, the silhouette (or the kind's line
   icon), and the photograph, which fades in when it has actually decoded. So a
   bubble is never an empty circle while a picture loads, and never one after
   it fails — the same fault the map's discs and Explore's rows each had once. */
function faceHTML(n, d) {
  let mark;
  if (SILHOUETTES[n.id]) {
    const url = `url(&quot;assets/silhouettes/${n.id}.svg&quot;)`;
    mark = `<span class="orb-sil" style="-webkit-mask-image:${url};mask-image:${url}"></span>`;
  } else {
    const path = (NODE_ICONS && NODE_ICONS[getIconGroup(n)]) || (NODE_ICONS && NODE_ICONS.default) || '';
    mark = `<svg class="orb-ico" viewBox="0 0 40 40" aria-hidden="true"><path d="${path}"/></svg>`;
  }
  const best = ImageLoader ? ImageLoader.getBestUrl(n, d > 90 ? 'hero' : 'thumb') : null;
  const img = best && best.url
    ? `<img class="orb-img" alt="" decoding="async" src="${best.url}" data-orbit-img>`
    : '';
  return `<span class="orb-face">${mark}${img}</span>`;
}

function bubbleEl(it) {
  const b = document.createElement('button');
  b.type = 'button';
  b.dataset.action = 'orbit:press';
  b.dataset.arg = it.key;
  b.style.setProperty('--c', it.n.color || 'var(--accent)');
  b.style.setProperty('--d', `${it.d}px`);
  if (it.kind === 'more') {
    b.className = 'orb-b more';
    b.setAttribute('aria-label', `${it.sub} ${t('orbit_more')}`);
    b.innerHTML = `<span class="orb-face orb-more" dir="ltr">${it.sub}</span>
      <span class="orb-label"><span class="orb-name" data-i18n-exempt="species-data" dir="auto">${displayName(it.n)}</span></span>`;
    return b;
  }
  b.className = `orb-b ${it.kind}`;
  b.setAttribute('aria-label', displayName(it.n));
  b.innerHTML = `${faceHTML(it.n, it.d)}<span class="orb-label"><span class="orb-name" data-i18n-exempt="species-data" dir="auto">${displayName(it.n)}</span><span class="orb-sub"></span></span>`;
  const img = b.querySelector('[data-orbit-img]');
  if (img) {
    img.addEventListener('load', () => b.classList.add('has-img'));
    img.addEventListener('error', () => img.remove());
  }
  return b;
}

function subText(it) {
  if (it.kind === 'rel') return chipAge(it.sub, state.currentLang);
  if (it.kind === 'focus') return it.sub ? `${it.sub} ${t('ex_inside')}` : '';
  if (it.kind === 'sat') return it.sub;
  return '';
}

function retune(el, it) {
  const sub = el.querySelector('.orb-sub');
  const txt = subText(it);
  if (sub && sub.textContent !== txt) sub.textContent = txt;
  el.className = el.className.replace(/\b(focus|sat|rel)\b/g, '').trim() + ` ${it.kind}`;
}

// ── Drawing ───────────────────────────────────────────────────────────────

/* The comparison, as HTML for the strip: the pinned creature and the centre, and
   where their lineages last met. Names are data, escaped and marked exempt. */
const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function cmpLine() {
  const name = (n) => `<bdi data-i18n-exempt="species-data" dir="auto">${esc(displayName(n))}</bdi>`;
  const fill = (tpl, v) => tpl.split(/(\{\w+\})/).map((part) => {
    const m = /^\{(\w+)\}$/.exec(part);
    return m ? (typeof v[m[1]] === 'string' ? esc(v[m[1]]) : name(v[m[1]])) : esc(part);
  }).join('');
  let text;
  if (_pin === _focus) text = fill(t('orbit_pinned'), { a: _pin });
  else {
    const w = whyOf(_pin, _focus);
    if (!w) return '';
    text = w.kind === 'in'
      ? fill(t('orbit_why_in'), { a: w.a, b: w.b })
      : fill(t('orbit_why'), { a: w.a, b: w.b, age: chipAge(age(w.lca), state.currentLang), group: w.lca });
  }
  return `<p class="orb-cmp-line" role="status">${text}</p>`;
}

function chrome(L) {
  const lang = state.currentLang;
  const home = _focus !== startNode();
  const back = _trail.slice(-3).reverse().map((id) => {
    const n = byId(id);
    return n ? `<button type="button" class="orb-pill is-trail" data-action="orbit:go" data-arg="${id}"
      aria-label="${t('orbit_back_to')} ${displayName(n)}"><span class="orb-back" aria-hidden="true">↩</span>
      <span data-i18n-exempt="species-data" dir="auto">${displayName(n)}</span></button>` : '';
  }).join('');

  /* The lineage, origin of life to the centre: where you are, and a way to any
     ancestor in one tap. Up is its own control and always the parent; Back (the
     trail on the right) is where you came from. */
  const chain = pathTo(_focus);
  const parent = parentOf(_focus);
  const crumbs = chain.map((n, i) => (i === chain.length - 1
    ? `<span class="orb-crumb is-here" aria-current="true" data-i18n-exempt="species-data" dir="auto">${displayName(n)}</span>`
    : `<button type="button" class="orb-crumb" data-action="orbit:to" data-arg="${n.id}" style="--c:${n.color}"
        aria-label="${t('ex_go_to')} ${displayName(n)}"><span data-i18n-exempt="species-data" dir="auto">${displayName(n)}</span></button><span class="orb-sep" aria-hidden="true">›</span>`)).join('');
  const strip = `
    <nav class="orb-strip" aria-label="${t('orbit_path')}">
      <button type="button" class="orb-up" data-action="orbit:parent" ${parent ? `aria-label="${t('orbit_up_to')} ${displayName(parent)}"` : 'disabled aria-label="' + t('orbit_up') + '"'}>
        <span aria-hidden="true">↑</span><span class="orb-up-text">${t('orbit_up')}</span></button>
      ${_pin && _up.has(_pin) ? cmpLine() : `<div class="orb-path">${crumbs}</div>`}
      <button type="button" class="orb-cmp${_pin ? ' is-on' : ''}" data-action="orbit:pin" aria-pressed="${_pin ? 'true' : 'false'}">${t(_pin ? 'orbit_compare_stop' : 'orbit_compare')}</button>
    </nav>`;

  const rings = L.rings.filter((r) => r.label).map((r) => `
    <button type="button" class="orb-ring" data-action="orbit:to" data-arg="${r.label.id}"
      style="left:${Math.round(r.label.x - r.label.w / 2)}px;top:${Math.round(r.label.y - r.label.h / 2)}px;width:${r.label.w}px;--c:${r.label.n.color}"
      aria-label="${t('ex_go_to')} ${displayName(r.label.n)}">
      <span class="orb-ring-name" data-i18n-exempt="species-data" dir="auto">${displayName(r.label.n)}</span>
      <span class="orb-ring-age">${chipAge(r.label.mya, lang)}</span></button>`).join('');

  return `
    ${strip}
    ${rings}
    <div class="orb-actions">
      <span class="orb-trail">${back}</span>
      <button type="button" class="orb-pill is-main" data-action="orbit:surprise">${t('orbit_surprise')}</button>
      ${home ? `<button type="button" class="orb-pill is-home" data-action="orbit:home" aria-label="${t('orbit_home')}"><span class="orb-home-glyph" aria-hidden="true">\u2302</span><span class="orb-home-text">${t('orbit_home')}</span></button>` : ''}
    </div>
    <p class="orb-legend">${t('orbit_legend')}</p>`;
}

export function renderOrbit(first = false) {
  const host = root();
  if (!host) return;
  const W = host.clientWidth, H = host.clientHeight;
  if (!W) return;                                 // hidden: it cannot measure itself, and will be asked again on reveal
  linkParents();
  /* Read here, once the tree is complete: a stored id for a creature that is not
     in the tree (renamed, or grafted later) is dropped rather than shown as "Stop". */
  if (!_pinRestored) {
    _pinRestored = true;
    try { const id = localStorage.getItem(PIN_KEY); const n = byId(id); if (n && !_pin) _pin = n; else if (id && !n) localStorage.removeItem(PIN_KEY); } catch (e) { /* nothing stored */ }
  }
  /* Resolved here and not in initOrbit(): the person is grafted into the tree
     after start-up, and a focus looked up too early falls back to the root. */
  if (!_focus || !_up.has(_focus)) { _focus = startNode(); _from = null; }
  if (!_built) {
    host.innerHTML = '<svg class="orb-guide" aria-hidden="true"></svg><div class="orb-stage"></div><div class="orb-chrome"></div>';
    _built = true;
  }
  const guide = host.querySelector('.orb-guide');
  const stage = host.querySelector('.orb-stage');
  const rtl = document.documentElement.dir === 'rtl';
  const L = layoutOrbit(_focus, W, H, rtl, _from);
  host._layout = L;
  const still = first || reducedMotion();

  guide.setAttribute('width', W); guide.setAttribute('height', H);
  guide.replaceChildren();
  for (const rg of L.rings) {
    const sx = Math.sin(rg.phi) * rg.r, cyp = Math.cos(rg.phi) * rg.r;
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', `M ${L.cx - sx} ${L.cy + cyp} A ${rg.r} ${rg.r} 0 0 0 ${L.cx + sx} ${L.cy + cyp}`);
    p.setAttribute('class', rg.kind === 'in' ? 'orb-arc is-in' : 'orb-arc');
    guide.appendChild(p);
  }

  const keep = new Set();
  for (const it of L.items) {
    keep.add(it.key);
    let el = _els.get(it.key);
    if (!el) {
      el = bubbleEl(it);
      el.style.width = `${it.w}px`;
      if (!still) {
        /* New arrivals pop out of the centre; a new centre grows where it stands
           (the old centre is gliding out to its ring at the same moment). */
        el.style.transform = it.kind === 'focus'
          ? `translate(${it.x - it.w / 2}px, ${it.y - it.d / 2}px) scale(.5)`
          : `translate(${L.cx - it.w / 2}px, ${L.cy - it.d / 2}px) scale(.2)`;
        el.style.opacity = '0';
      }
      stage.appendChild(el);
      _els.set(it.key, el);
      void el.offsetWidth;
    }
    retune(el, it);
    el.dataset.kind = it.kind;
    el.style.zIndex = it.kind === 'focus' ? 3 : 1;
    el.style.setProperty('--d', `${it.d}px`);
    el.style.width = `${it.w}px`;
    el.style.transform = `translate(${it.x - it.w / 2}px, ${it.y - it.d / 2}px) scale(1)`;
    el.style.opacity = '1';
  }
  for (const [k, el] of _els) {
    if (keep.has(k)) continue;
    _els.delete(k);
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    el.removeAttribute('data-action');            // leaving: not a target while it fades
    setTimeout(() => el.remove(), still ? 0 : 420);
  }
  if (first) showHint(host);
  const chromeEl = host.querySelector('.orb-chrome');
  chromeEl.innerHTML = chrome(L);
  /* The path can be longer than the strip; keep the place you are in view. */
  const here = chromeEl.querySelector('.orb-crumb.is-here');
  const pathEl = chromeEl.querySelector('.orb-path');
  if (here && pathEl) pathEl.scrollLeft = (document.documentElement.dir === 'rtl' ? -1 : 1) * 1e5;
  host.setAttribute('aria-label', `${t('orbit_region')}: ${displayName(_focus)}`);
}

// ── Moving ────────────────────────────────────────────────────────────────

export function orbitFocus(nodeOrId, { back = false } = {}) {
  const n = typeof nodeOrId === 'string' ? byId(nodeOrId) : nodeOrId;
  if (!n || n === _focus) return false;
  if (!_up.size) linkParents();
  if (_focus) {
    _trail = back
      ? _trail.filter((id) => id !== n.id)
      : [..._trail.filter((id) => id !== _focus.id), _focus.id].slice(-5);
  }
  _from = _focus;
  _focus = n;
  renderOrbit();
  syncWhy(_from);
  return true;
}

/* Back is one step along the way the reader came; failing that, up the tree. */
export function orbitUp() {
  if (_trail.length) { orbitFocus(_trail[_trail.length - 1], { back: true }); return true; }
  if (_focus && parentOf(_focus)) { orbitFocus(parentOf(_focus)); return true; }
  return false;
}

/* Up is the parent, always; Back (orbitUp) is where the reader came from. */
export function orbitParent() {
  const p = _focus && parentOf(_focus);
  if (!p) return false;
  return orbitFocus(p);
}

/* The neighbours of the centre: the other children of its parent, in tree order,
   wrapping. Sideways, where Up and Back are vertical. */
export function orbitSibling(dir) {
  const p = _focus && parentOf(_focus);
  if (!p) return false;
  const sibs = kids(p);
  if (sibs.length < 2) return false;
  const i = sibs.indexOf(_focus);
  return orbitFocus(sibs[(i + dir + sibs.length) % sibs.length]);
}

export function orbitHome() {
  const home = startNode();
  if (_focus === home) return false;
  orbitFocus(home);
  _trail = [];
  renderOrbit();
  return true;
}

export function orbitSelection() { return _focus; }

/* The ids from the origin of life to the centre — what the lineage strip shows. */
export function orbitPath() { return _focus ? pathTo(_focus).map((n) => n.id) : []; }

function surprise() {
  const leaves = [];
  (function walk(n) { if (!kids(n).length) leaves.push(n); else kids(n).forEach(walk); })(TREE);
  const pool = leaves.filter((n) => n !== _focus);
  orbitFocus(pool[Math.floor(Math.random() * pool.length)]);
}

function press(key) {
  if (key.startsWith('more:')) return orbitFocus(key.split(':')[1]);
  const n = byId(key);
  if (!n) return;
  if (n === _focus) { if (_showMainPanel) _showMainPanel(n); return; }
  orbitFocus(n);
}

/* ── Gestures ──────────────────────────────────────────────────────────────
   Swipe up pulls the next ring to the top — the parent, as dragging a page up
   brings what is below it into view. Swipe down is Back, the way you came. A
   drag must be long, mostly vertical and mostly decisive to count; anything
   shorter is a tap, and a drag that does count swallows the click that follows,
   so a swipe that starts on a bubble never also presses it. While the finger is
   down the picture follows it a little and eases back, so the gesture answers
   before it is finished. Keys do the same on a desktop: ↑ up, ↓ back, ← → the
   neighbours, Home the start. */
const SWIPE = { min: 64, ratio: 1.6 };
let _swallow = 0;

function initGestures(host) {
  let g = null;
  const stage = () => host.querySelector('.orb-stage');
  host.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('.orb-strip, .orb-actions, .orb-ring')) { g = null; return; }
    g = { id: e.pointerId, x: e.clientX, y: e.clientY, live: false };
  });
  host.addEventListener('pointermove', (e) => {
    if (!g || e.pointerId !== g.id) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.live && Math.hypot(dx, dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
      g.live = true;
      try { host.setPointerCapture(e.pointerId); } catch (err) { /* a synthetic pointer */ }
    }
    if (g.live && !reducedMotion()) {
      const st = stage();
      if (st) { st.style.transition = 'none'; st.style.transform = `translateY(${Math.max(-40, Math.min(40, dy * 0.25))}px)`; }
    }
  });
  const end = (e, cancelled) => {
    if (!g || e.pointerId !== g.id) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y, was = g;
    g = null;
    const st = stage();
    if (st) { st.style.transition = ''; st.style.transform = ''; }
    if (cancelled || !was.live) return;
    if (Math.abs(dy) >= SWIPE.min && Math.abs(dy) >= SWIPE.ratio * Math.abs(dx)) {
      _swallow = Date.now();
      dismissHint();
      if (dy < 0) orbitParent(); else orbitUp();
    } else {
      _swallow = Date.now();                       // a drag that went nowhere is still not a press
    }
  };
  host.addEventListener('pointerup', (e) => end(e, false));
  host.addEventListener('pointercancel', (e) => end(e, true));
  // the click that follows a drag belongs to the drag (it arrives straight after the pointerup)
  host.addEventListener('click', (e) => {
    if (Date.now() - _swallow < 80) { e.stopPropagation(); e.preventDefault(); _swallow = 0; }
  }, true);
}

const OVERLAYS = ['panel', 'game-panel', 'profile-panel', 'species-compare-panel', 'hominin-view'];
function keysApply(e) {
  if (document.body.getAttribute('data-view') !== 'orbit') return false;
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return false;
  const t = e.target;
  if (t && (t.closest?.('input, textarea, select, [contenteditable="true"]'))) return false;
  if (OVERLAYS.some((id) => document.getElementById(id)?.classList.contains('open'))) return false;
  if (document.querySelector('.tour-overlay, .sapiens-overlay, .tour-selector-overlay, .compare-banner.visible')) return false;
  if (document.getElementById('kbd-help')?.classList.contains('visible')) return false;
  return true;
}
function initKeys() {
  document.addEventListener('keydown', (e) => {
    if (!keysApply(e)) return;
    const rtl = document.documentElement.dir === 'rtl';
    let did = false;
    if (e.key === 'ArrowUp') did = orbitParent();
    else if (e.key === 'ArrowDown') did = orbitUp();
    else if (e.key === 'ArrowLeft') did = orbitSibling(rtl ? 1 : -1);
    else if (e.key === 'ArrowRight') did = orbitSibling(rtl ? -1 : 1);
    else if (e.key === 'Home') did = orbitHome();
    else return;
    if (did) { e.preventDefault(); dismissHint(); }
  });
}

/* Said once, for a few seconds, and gone at the first gesture. It cannot be
   pressed (pointer-events: none), so it is never in the way of a bubble. */
let _hint = null, _hintTimer = 0;
function dismissHint() {
  clearTimeout(_hintTimer);
  if (_hint) { _hint.parentElement?.classList.remove('has-hint'); _hint.remove(); _hint = null; }
}
function showHint(host) {
  /* A rebuild of the view (a language switch, a reveal) wipes the host's markup
     and the hint with it; put the same one back rather than forgetting it. */
  if (_hint) { if (!_hint.isConnected) host.appendChild(_hint); host.classList.add('has-hint'); return; }
  try { if (localStorage.getItem('tol-orbit-hint')) return; localStorage.setItem('tol-orbit-hint', '1'); } catch (e) { return; }
  const coarse = matchMedia('(pointer: coarse)').matches;
  _hint = document.createElement('p');
  _hint.className = 'orb-hint';
  _hint.textContent = t(coarse ? 'orbit_hint_touch' : 'orbit_hint_keys');
  host.appendChild(_hint);
  host.classList.add('has-hint');
  _hintTimer = setTimeout(dismissHint, 7000);
}

/* Why they sit where they do: the last ancestor two centres share, and when it
   lived. Said for a few seconds after a move, in the legend's place, and gone at
   the next move. When one is inside the other there is no meeting to date, only
   the containment. Names are data (exempt, and direction by content); the words
   around them come from the template. */
let _why = null, _whyTimer = 0;
export function whyOf(a, b) {
  const pa = pathTo(a), pb = pathTo(b);
  let i = 0;
  while (i < pa.length && i < pb.length && pa[i] === pb[i]) i++;
  const lca = pa[i - 1];
  if (!lca) return null;
  if (lca === a) return { kind: 'in', a, b };
  if (lca === b) return { kind: 'in', a: b, b: a };
  return { kind: 'met', a, b, lca };
}
function dismissWhy() {
  clearTimeout(_whyTimer);
  if (_why) { _why.parentElement?.classList.remove('has-why'); _why.remove(); _why = null; }
}
function fillWhy(el, tpl, vals) {
  el.replaceChildren();
  for (const part of tpl.split(/(\{\w+\})/)) {
    const m = /^\{(\w+)\}$/.exec(part);
    if (!m) { if (part) el.append(part); continue; }
    const v = vals[m[1]];
    if (typeof v === 'string') { el.append(v); continue; }
    const sp = document.createElement('bdi');
    sp.setAttribute('data-i18n-exempt', 'species-data');
    sp.dir = 'auto';
    sp.textContent = displayName(v);
    el.append(sp);
  }
}
/* While a creature is pinned the comparison lives in the lineage strip, beside the
   button that made it (see cmpLine); otherwise the line about the centre just left
   and the new one fades at the foot. */
function syncWhy(prev) {
  const host = root();
  if (_pin && _up.has(_pin)) dismissWhy();
  else if (prev) showWhy(host, prev, _focus, false);
  else dismissWhy();
}
export function orbitPin() {
  if (_pin) _pin = null;
  else { _pin = _focus; }
  savePin();
  dismissWhy();
  renderOrbit();
  return !!_pin;
}
export function orbitPinned() { return _pin; }
function showWhy(host, a, b) {
  if (!host) return;
  const w = whyOf(a, b);
  dismissWhy();
  if (!w) return;
  dismissHint();
  _why = document.createElement('p');
  _why.className = 'orb-why';
  _why.setAttribute('role', 'status');
  if (w.kind === 'in') fillWhy(_why, t('orbit_why_in'), { a: w.a, b: w.b });
  else fillWhy(_why, t('orbit_why'), { a: w.a, b: w.b, age: chipAge(age(w.lca), state.currentLang), group: w.lca });
  host.appendChild(_why);
  host.classList.add('has-why');
  _whyTimer = setTimeout(dismissWhy, 9000);
}

export function initOrbit() {
  registerActions({
    'orbit:press': (key) => press(key),
    'orbit:go': (id) => orbitFocus(id, { back: true }),
    'orbit:to': (id) => orbitFocus(id),
    'orbit:parent': () => orbitParent(),
    'orbit:next': () => orbitSibling(1),
    'orbit:prev': () => orbitSibling(-1),
    'orbit:surprise': () => surprise(),
    'orbit:home': () => orbitHome(),
    'orbit:pin': () => orbitPin(),
  });
  const host = root();
  if (host && 'ResizeObserver' in window) {
    let raf = 0;
    new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => renderOrbit(true)); }).observe(host);
  }
  if (host) initGestures(host);
  initKeys();
  renderOrbit(true);
}

/* A hidden view cannot measure itself (constraint 11), so the shell asks for a
   repaint when it is revealed, and on a language switch while it is showing. */
export function refreshOrbit() { dismissWhy(); _built = false; _els.clear(); renderOrbit(true); syncWhy(null); }
