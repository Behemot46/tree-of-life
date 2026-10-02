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
export function layoutOrbit(focus, W, H, rtl) {
  const phone = W < 560;
  const R = rtl ? -1 : 1;
  const Sf = phone ? 96 : 124;
  const Wb = phone ? 96 : 112;                  // a bubble's footprint: its label is clipped to this
  const LH = 32;                                // the label under a bubble: a name and a number
  const cx = W / 2, cy = 14 + Sf / 2;
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
  const clear = (bx) => bx.l >= 4 && bx.r <= W - 4 && bx.t >= 4 && bx.b <= H - (phone ? 96 : 76) &&
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
    rings.push({ r: rad, phi, kind: 'out', total: ring.sibs.length, shown: mine.length, hidden, more: !!m });
  });

  return { items, rings, cx, cy, W, H };
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

function chrome() {
  const home = _focus !== startNode();
  const back = _trail.slice(-3).reverse().map((id) => {
    const n = byId(id);
    return n ? `<button type="button" class="orb-pill is-trail" data-action="orbit:go" data-arg="${id}"
      aria-label="${t('orbit_back_to')} ${displayName(n)}"><span class="orb-back" aria-hidden="true">↩</span>
      <span data-i18n-exempt="species-data" dir="auto">${displayName(n)}</span></button>` : '';
  }).join('');
  return `
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
  /* Resolved here and not in initOrbit(): the person is grafted into the tree
     after start-up, and a focus looked up too early falls back to the root. */
  if (!_focus || !_up.has(_focus)) _focus = startNode();
  if (!_built) {
    host.innerHTML = '<svg class="orb-guide" aria-hidden="true"></svg><div class="orb-stage"></div><div class="orb-chrome"></div>';
    _built = true;
  }
  const guide = host.querySelector('.orb-guide');
  const stage = host.querySelector('.orb-stage');
  const rtl = document.documentElement.dir === 'rtl';
  const L = layoutOrbit(_focus, W, H, rtl);
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
      if (!still) {                               // new arrivals pop out of the centre
        el.style.transform = `translate(${L.cx - it.w / 2}px, ${L.cy - it.d / 2}px) scale(.2)`;
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
  host.querySelector('.orb-chrome').innerHTML = chrome();
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
  _focus = n;
  renderOrbit();
  return true;
}

/* Back is one step along the way the reader came; failing that, up the tree. */
export function orbitUp() {
  if (_trail.length) { orbitFocus(_trail[_trail.length - 1], { back: true }); return true; }
  if (_focus && parentOf(_focus)) { orbitFocus(parentOf(_focus)); return true; }
  return false;
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

export function initOrbit() {
  registerActions({
    'orbit:press': (key) => press(key),
    'orbit:go': (id) => orbitFocus(id, { back: true }),
    'orbit:surprise': () => surprise(),
    'orbit:home': () => orbitHome(),
  });
  const host = root();
  if (host && 'ResizeObserver' in window) {
    let raf = 0;
    new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => renderOrbit(true)); }).observe(host);
  }
  renderOrbit(true);
}

/* A hidden view cannot measure itself (constraint 11), so the shell asks for a
   repaint when it is revealed, and on a language switch while it is showing. */
export function refreshOrbit() { _built = false; _els.clear(); renderOrbit(true); }
