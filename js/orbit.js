// ══════════════════════════════════════════════════════
// ORBIT — "everyone is your relative"
// ══════════════════════════════════════════════════════
//
// Pick a creature and it sits at the top; every other creature on Earth is laid
// out below it by how long ago the two of you last shared an ancestor. Press any
// of them and it becomes the new centre — the whole picture glides to answer.
// Pressing the centre opens its detail panel.
//
// It replaces a list that was read with a picture that is pressed. There is no
// wrong tap: "who is the closest relative of a mushroom?" is answered by
// pressing the mushroom.
//
// A fan rather than a full circle. A lineage nine generations deep needs nine
// rings, and a circle spends its radius in every direction while a screen has
// room in only one; and time running DOWN the page is the direction a thumb
// already scrolls.
//
// Rings are the ancestors on the way from the focus to the root, nearest first.
// The bubbles on a ring are that ancestor's OTHER children — the branches the
// lineage did not take there. Each bubble states the age of the split.
import { TREE, ImageLoader } from './data.js';
import { state } from './state.js';
import { displayName } from './utils.js';
import { registerActions } from './actions.js';
import { t } from './theme.js';
import { SILHOUETTES } from './silhouettes.js';
import { subtreeSize } from './taxonRank.js';

const SVG = 'http://www.w3.org/2000/svg';
const START = 'h_sapiens';          // the hominin module renames the tree's own 'homo-sapiens'
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

let _showMainPanel = null;
export function initOrbitDeps(deps) { _showMainPanel = deps.showMainPanel; }

let focus = TREE;
let trail = [];                    // ids the reader has left, most recent last
let built = false;
const els = new Map();             // key → bubble element, kept so a press can glide

const host = () => document.getElementById('orbit');
const kids = (n) => n.children || [];
const size = (n) => subtreeSize(n) + 1;
const age = (n) => (typeof n.appeared === 'number' ? n.appeared : 0);

function byId(id) {
  if (!id) return null;
  if (state.nodeMap && state.nodeMap[id]) return state.nodeMap[id];
  const walk = (n) => {
    if (n.id === id) return n;
    for (const c of kids(n)) { const f = walk(c); if (f) return f; }
    return null;
  };
  return walk(TREE);
}
function chain(n) {
  const out = [];
  for (let x = n; x; x = x._parent) out.unshift(x);
  return out;
}
const isRtl = () => document.documentElement.dir === 'rtl';

/* "Ma" and "Ga" are Latin runs; whatever carries one gets dir="ltr" so Hebrew
   cannot reorder it to "Ma 500". */
function chipAge(mya) {
  if (mya >= 1000) return `${+(mya / 1000).toFixed(mya % 1000 ? 1 : 0)} Ga`;
  if (mya >= 1) return `${Math.round(mya)} Ma`;
  return '<1 Ma';
}

// ── Who goes where ─────────────────────────────────────────────────────────
function relatives(f) {
  const up = chain(f);
  const out = [];
  for (let i = up.length - 2; i >= 0; i--) {
    const A = up[i], on = up[i + 1];
    const sibs = kids(A).filter((k) => k !== on);
    if (sibs.length) out.push({ A, age: age(A), sibs });
  }
  return out;
}

function layout(W, H) {
  const phone = W < 560;
  const R = isRtl() ? -1 : 1;
  const Sf = phone ? 96 : 124;
  const Wb = phone ? 96 : 112;                      // a bubble's footprint: its label is clipped to this
  const LH = 32;                                    // the label under a bubble: a name and a number
  const cx = W / 2, cy = (phone ? 14 : 12) + Sf / 2;
  /* On a phone the pills live at the foot, where a thumb is; on a desktop they
     are in the corner, out of the way of a picture that has the whole width. */
  const bottom = H - (phone ? 96 : 40);
  const items = [];
  const ringsOut = [];
  const lang = state.currentLang;

  const focusSub = kids(focus).length ? `${size(focus) - 1} ${t('ex_inside')}` : '';
  items.push({ key: focus.id, n: focus, kind: 'focus', x: cx, y: cy, d: Sf, w: Wb + 20, h: Sf + 62, sub: focusSub });

  let cursor = Sf / 2 + 58;                         // clear of the focus's own label

  /* How many bubbles an arc can carry, and how wide it may open. A ring near
     the top has the whole width of the fan; one at the foot is as wide as the
     screen and no wider. */
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
  /* Evenly across the arc — but each ring a half-step off the one before, so
     two rings never stack their bubbles in a single vertical column with one
     name printed on the next picture. */
  const spread = (n, phi, ringIdx) => (j) => {
    if (n === 1) return ringIdx % 2 ? phi * 0.22 : -phi * 0.22;
    const cell = (2 * phi) / n;
    return -phi + cell * (j + 0.5) + (ringIdx % 2 ? cell * 0.22 : -cell * 0.22);
  };
  /* Placement is a search, not a force. Each bubble asks for the spot its ring
     gives it; if that spot is taken it tries along the ring, then a little in
     or out, and takes the first that is free. Nothing is ever pushed, so
     nothing oscillates, and two bubbles cannot end up on each other. What does
     not fit becomes part of the "+N" bubble. */
  const foot = (x, y, d) => ({ l: x - Wb / 2, r: x + Wb / 2, t: y - d / 2, b: y - d / 2 + d + LH });
  /* The focus's label is a name that may take two lines and a count under it,
     so its footprint is taller than a relative's — otherwise the first ring is
     laid across the focus's own name. */
  const placed = [{ ...foot(cx, cy, Sf), b: cy + Sf / 2 + 62 }];
  const clear = (bx) => bx.l >= 4 && bx.r <= W - 4 && bx.t >= 4 && bx.b <= H - (phone ? 92 : 30) &&
    !placed.some((p) => bx.l < p.r + 2 && bx.r > p.l - 2 && bx.t < p.b + 2 && bx.b > p.t - 2);
  const spot = (rad, th0, phi, d) => {
    const step = 5 / rad;
    for (const dr of [0, 9, -9, 18, -18, 27, -27]) {
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
    let hidden = all.length - shown.length;
    const here = [];
    shown.forEach((k, j) => {
      const it = put(k, 'sat', rad, at(j), d, kids(k).length ? `${size(k) - 1}` : '', { phi });
      if (it) here.push(it); else hidden++;
    });
    items.push(...here);
    if (hidden) {
      const m = put(focus, 'more', rad, at(shown.length), d, `+${hidden}`, { key: `more:${focus.id}`, phi, moreName: displayName(focus) });
      if (m) items.push(m);
    }
    ringsOut.push({ r: rad, phi, kind: 'in' });
    cursor = rad + d / 2 + LH + 6;
  }

  // The relatives, nearest ancestor first. Rings the screen cannot hold are
  // merged into the last one rather than dropped: the far branches (fungi,
  // plants, bacteria) are the most surprising relatives there are.
  let rs = relatives(focus);
  const maxRings = phone ? 6 : 7;
  if (rs.length > maxRings) {
    const keepRs = rs.slice(0, maxRings - 1), rest = rs.slice(maxRings - 1);
    keepRs.push({ A: rest[rest.length - 1].A, age: rest[rest.length - 1].age, sibs: rest.flatMap((x) => x.sibs), merged: rest });
    rs = keepRs;
  }
  const avail = bottom - cy - cursor;
  const slot = clamp(avail / Math.max(1, rs.length), phone ? 70 : 82, 112);
  const dBase = clamp(slot - LH - 8, phone ? 38 : 44, phone ? 56 : 68);
  rs.forEach((ring, i) => {
    const rad = cursor + dBase / 2 + i * slot;
    const { phi, cap } = arcOf(rad, 1.32);
    const take = [...ring.sibs].sort((x, y) => size(y) - size(x)).slice(0, ring.sibs.length > cap ? cap - 1 : cap);
    const shown = ring.sibs.filter((k) => take.includes(k));
    const n = shown.length + (ring.sibs.length > shown.length ? 1 : 0);
    const at = spread(n, phi, i + 1);
    let hidden = ring.sibs.length - shown.length;
    const mine = [];
    shown.forEach((k, j) => {
      const via = ring.merged ? ring.merged.find((m) => m.sibs.includes(k)).A : ring.A;
      const d = clamp(dBase + 4 * Math.log2(size(k)) - 4, phone ? 38 : 44, phone ? 60 : 74);
      const it = put(k, 'rel', rad, at(j), d, chipAge(age(via)), { phi, via });
      if (it) mine.push(it); else hidden++;
    });
    items.push(...mine);
    if (hidden) {
      const m = put(ring.A, 'more', rad, at(shown.length), dBase, `+${hidden}`, { key: `more:${ring.A.id}:${i}`, phi, moreName: displayName(ring.A) });
      if (m) items.push(m);
    }
    ringsOut.push({ r: rad, phi, kind: 'out' });
  });

  return { items, rings: ringsOut, cx, cy, W, H, lang };
}

// ── One bubble ─────────────────────────────────────────────────────────────
/* Layers, bottom to top: a tinted disc, the silhouette (or the emoji), and the
   photograph, which fades in once it has actually decoded. So a bubble is never
   an empty circle while a picture loads, and never one after it fails — the
   same fault the map's discs and Explore's rows each had once. */
function bubble(n, { d, sub, kind }) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `orb-b ${kind}`;
  b.dataset.action = 'orbit:press';
  b.dataset.arg = n.id;
  b.dataset.id = n.id;
  b.style.setProperty('--c', n.color);
  b.style.setProperty('--d', `${d}px`);
  b.setAttribute('aria-label', `${displayName(n)}${sub ? ', ' + sub : ''}`);

  const face = document.createElement('span');
  face.className = 'orb-face';
  if (SILHOUETTES[n.id]) {
    const s = document.createElement('span');
    s.className = 'orb-sil';
    s.style.maskImage = s.style.webkitMaskImage = `url("assets/silhouettes/${n.id}.svg")`;
    face.appendChild(s);
  } else {
    const e = document.createElement('span');
    e.className = 'orb-emoji';
    e.textContent = n.icon || '●';
    face.appendChild(e);
  }
  const best = ImageLoader ? ImageLoader.getBestUrl(n, d > 90 ? 'hero' : 'thumb') : null;
  if (best && best.url) {
    const img = document.createElement('img');
    img.className = 'orb-img';
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('load', () => b.classList.add('has-img'));
    img.addEventListener('error', () => img.remove());
    img.src = best.url;
    face.appendChild(img);
  }
  b.appendChild(face);
  b.appendChild(label(displayName(n), sub));
  return b;
}

function label(name, sub) {
  const l = document.createElement('span');
  l.className = 'orb-label';
  const nm = document.createElement('span');
  nm.className = 'orb-name';
  nm.dir = 'auto';
  nm.textContent = name;
  l.appendChild(nm);
  if (sub) {
    const s = document.createElement('span');
    s.className = 'orb-sub';
    s.dir = 'ltr';
    s.textContent = sub;
    l.appendChild(s);
  }
  return l;
}

function moreBubble(it) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'orb-b more';
  b.dataset.action = 'orbit:press';
  b.dataset.arg = it.key;
  b.dataset.id = it.key;
  b.style.setProperty('--c', it.n.color);
  b.style.setProperty('--d', `${it.d}px`);
  b.setAttribute('aria-label', `${it.sub} ${t('ex_more')}`);
  const face = document.createElement('span');
  face.className = 'orb-face orb-more';
  face.textContent = it.sub;
  face.dir = 'ltr';
  b.appendChild(face);
  b.appendChild(label(it.moreName || t('ex_more'), ''));
  return b;
}

// ── Drawing ────────────────────────────────────────────────────────────────
const HOME_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>';

function pill(cls, action, arg, html, aria) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `orb-pill ${cls}`;
  b.dataset.action = action;
  if (arg !== undefined) b.dataset.arg = arg;
  b.innerHTML = html;
  if (aria) b.setAttribute('aria-label', aria);
  return b;
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function build(root) {
  root.innerHTML = '';
  const guide = document.createElementNS(SVG, 'svg');
  guide.setAttribute('class', 'orb-guide');
  guide.setAttribute('aria-hidden', 'true');
  const stage = document.createElement('div');
  stage.className = 'orb-stage';
  const bar = document.createElement('div');
  bar.className = 'orb-actions';
  const trailBox = document.createElement('div');
  trailBox.className = 'orb-trail';
  const legend = document.createElement('p');
  legend.className = 'orb-legend';
  root.append(guide, stage, bar, trailBox, legend);
  built = { guide, stage, bar, trailBox, legend };
}

export function renderOrbit(first = false) {
  const root = host();
  if (!root) return;
  const W = root.clientWidth, H = root.clientHeight;
  /* A hidden element cannot measure itself, and will not notice it failed
     (constraint 11): bail now, and setShellView redraws on the way in. */
  if (!W || !H) return;
  if (!built || !root.contains(built.stage)) { els.clear(); build(root); first = true; }
  const { guide, stage, bar, trailBox, legend } = built;
  const L = layout(W, H);
  const phone = W < 560;

  guide.setAttribute('width', W);
  guide.setAttribute('height', H);
  guide.replaceChildren();
  const R = isRtl() ? -1 : 1;
  for (const rg of L.rings) {
    const sx = Math.sin(rg.phi) * rg.r, cyp = Math.cos(rg.phi) * rg.r;
    const p = document.createElementNS(SVG, 'path');
    p.setAttribute('d', `M ${L.cx - sx} ${L.cy + cyp} A ${rg.r} ${rg.r} 0 0 0 ${L.cx + sx} ${L.cy + cyp}`);
    p.setAttribute('class', rg.kind === 'in' ? 'orb-arc is-in' : 'orb-arc');
    guide.appendChild(p);
  }
  void R;

  const keep = new Set();
  for (const it of L.items) {
    keep.add(it.key);
    let el = els.get(it.key);
    const Wb = it.w;
    if (!el) {
      el = it.kind === 'more' ? moreBubble(it) : bubble(it.n, it);
      el.style.width = `${Wb}px`;
      if (!first) {                                           // new arrivals pop out of the centre
        el.style.transform = `translate(${L.cx - Wb / 2}px, ${L.cy - it.d / 2}px) scale(.2)`;
        el.style.opacity = '0';
      }
      stage.appendChild(el);
      els.set(it.key, el);
      void el.offsetWidth;
    } else {
      retune(el, it);
    }
    el.dataset.kind = it.kind;
    el.style.zIndex = it.kind === 'focus' ? 3 : 1;
    el.style.setProperty('--d', `${it.d}px`);
    el.style.width = `${Wb}px`;
    el.style.transform = `translate(${it.x - Wb / 2}px, ${it.y - it.d / 2}px) scale(1)`;
    el.style.opacity = '1';
  }
  for (const [k, el] of els) {
    if (keep.has(k)) continue;
    els.delete(k);
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    el.style.transform = `${el.style.transform.replace(/ scale\([^)]*\)/, '')} scale(.3)`;
    setTimeout(() => el.remove(), 420);
  }

  const home = focus.id !== START
    ? pill('is-icon', 'orbit:home', undefined, phone ? HOME_ICON : `${HOME_ICON} ${esc(t('orbit_home'))}`, t('orbit_home'))
    : null;
  bar.replaceChildren(pill('is-main', 'orbit:surprise', undefined, esc(t('orbit_surprise'))), ...(home ? [home] : []));
  trailBox.replaceChildren(
    ...trail.slice(-3).reverse().map((id) => {
      const n = byId(id);
      return pill('is-trail', 'orbit:go', id, `↩ <span dir="auto">${esc(displayName(n))}</span>`);
    }),
  );
  legend.textContent = t('orbit_legend');
}

/* A bubble keeps its element while it changes role (a relative becomes the
   focus), so its caption and class have to follow. */
function retune(el, it) {
  const lab = el.querySelector('.orb-label');
  let sub = el.querySelector('.orb-sub');
  if (sub && !it.sub) sub.remove();
  else if (sub && sub.textContent !== it.sub) sub.textContent = it.sub;
  else if (!sub && it.sub && lab) {
    sub = document.createElement('span');
    sub.className = 'orb-sub';
    sub.dir = 'ltr';
    sub.textContent = it.sub;
    lab.appendChild(sub);
  }
  el.className = el.className.replace(/\b(focus|sat|rel|more)\b/g, '').trim() + ` ${it.kind}`;
  el.setAttribute('aria-label', `${displayName(it.n)}${it.sub ? ', ' + it.sub : ''}`);
}

// ── Moving ─────────────────────────────────────────────────────────────────
export function orbitGo(n, back = false) {
  if (!n || n === focus) return;
  if (!back) trail = [...trail.filter((id) => id !== focus.id), focus.id].slice(-5);
  else trail = trail.filter((id) => id !== n.id);
  focus = n;
  renderOrbit();
}

function press(key) {
  if (String(key).startsWith('more:')) return orbitGo(byId(key.split(':')[1]));
  const n = byId(key);
  if (!n) return;
  if (n === focus) { if (_showMainPanel) _showMainPanel(n); return; }
  orbitGo(n);
}

function surprise() {
  const pool = [];
  (function walk(n) { if (!kids(n).length) pool.push(n); else kids(n).forEach(walk); })(TREE);
  const pick = pool.filter((n) => n !== focus);
  orbitGo(pick[Math.floor(Math.random() * pick.length)]);
}

/* Where the reader is standing, for the chrome that has to describe or leave
   this view. Functions, not the variable: it has one writer, in this file. */
export const orbitSelection = () => focus;
export function orbitBack() {
  if (trail.length) { orbitGo(byId(trail[trail.length - 1]), true); return true; }
  if (focus._parent) { orbitGo(focus._parent, true); return true; }
  return false;
}
export function orbitHome() {
  const me = byId(START) || TREE;
  if (focus === me) return false;
  trail = [];
  orbitGo(me, true);
  return true;
}
export function openInOrbit(nodeOrId) {
  const n = typeof nodeOrId === 'string' ? byId(nodeOrId) : nodeOrId;
  if (n) orbitGo(n);
}

export function initOrbit() {
  registerActions({
    'orbit:press': (key) => press(key),
    'orbit:go': (id) => orbitGo(byId(id), true),
    'orbit:home': () => orbitHome(),
    'orbit:surprise': () => surprise(),
  });
  focus = byId(START) || TREE;
  let timer = 0;
  addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(() => renderOrbit(true), 120); });
  renderOrbit(true);
}
