// ══════════════════════════════════════════════════════
// The Ladder — Explore, redrawn as a tree of descent.
//
//   index.html                              the default view
//   index.html?lang=he&theme=light          language and theme
//   index.html?open=animalia,chordata       which groups start open
//   index.html?open=all                     every group, the stress case
//   index.html?bare=1                       no chrome (screenshots)
//
// Width is time and depth is rows (see layout.js). Tap a group to open or fold
// it in place; tap a species for its card. Nothing is hidden behind a gesture:
// no camera, no zoom, nothing that can leave the screen.
//
// A sketch, in the sense mockups/opening means it: it draws over the real,
// expanded tree in three languages and both themes, and is held to the
// measurements in the commit that added it.
// ══════════════════════════════════════════════════════
import { ROOT, ALL, kids, byId, path, name, ui, size, age, ageLabel } from './model.js';
import { computeLayout, AXIS_H } from './layout.js';
import { SILHOUETTES } from '../../js/silhouettes.js';

const q = new URLSearchParams(location.search);
const NS = 'http://www.w3.org/2000/svg';
const $ = (id) => document.getElementById(id);
const el = (tag, attrs = {}, cls) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (cls) e.setAttribute('class', cls);
  return e;
};

/* What a first visit opens is decided by the room, not by a list.

   Start from the root and keep opening whichever closed group reveals the most
   life per extra row (its size divided by the rows it adds), until the window
   is full. That puts Eukaryota and Animals — big and cheap — ahead of Bacteria,
   which is wide and shallow, so the first screen reads as a tree rather than as
   one wall of bacteria. A fixed list was either sparse on a tall window or
   overflowing on a short one: seven rows and half the screen black. */
function autoOpen(rowBudget) {
  const open = new Set(['luca']);
  let tips = kids(ROOT).length;
  const frontier = () => {
    const out = [];
    (function walk(n) {
      if (!kids(n).length) return;
      if (open.has(n.id)) kids(n).forEach(walk); else out.push(n);
    })(ROOT);
    return out;
  };
  for (;;) {
    const best = frontier()
      .map((n) => ({ n, extra: kids(n).length - 1, gain: size(n) / Math.max(1, kids(n).length - 1) }))
      .filter((c) => tips + c.extra <= rowBudget)
      .sort((a, b) => b.gain - a.gain)[0];
    if (!best) break;
    open.add(best.n.id); tips += best.extra;
  }
  return open;
}
const budgetFor = () => {
  const h = (document.getElementById('scroll') || document.body).clientHeight || innerHeight - 52;
  const per = innerWidth < 560 ? 40 : 36;
  return Math.max(6, Math.min(26, Math.floor((h - 48 - 40) / per)));
};

const S = {
  lang: ['en', 'he', 'ru'].includes(q.get('lang')) ? q.get('lang') : 'en',
  theme: q.get('theme') === 'light' ? 'light' : 'dark',
  open: new Set(),
  focus: null,
  sheet: null,
};
function initialOpen() {
  const o = q.get('open');
  if (o === 'all') return new Set(ALL.filter((n) => kids(n).length).map((n) => n.id));
  if (!o) return autoOpen(budgetFor());
  const ids = o.split(',').filter(byId);
  const set = new Set(['luca', ...ids]);
  for (const id of ids) for (const a of path(byId(id))) set.add(a.id);   // an open node is reachable
  return set;
}
S.open = initialOpen();
S.focus = byId(q.get('focus') || '') ? q.get('focus') : null;
S.sheet = byId(q.get('sheet') || '') ? q.get('sheet') : null;
const bare = q.has('bare');
const rtl = () => S.lang === 'he';

// ── Text measuring: the same font the SVG will use ──────────────────────────
const ctx = document.createElement('canvas').getContext('2d');
const memo = new Map();
function measure(text, px, weight) {
  const fam = getComputedStyle(document.body).fontFamily;
  const key = `${weight}|${px}|${fam}|${text}`;
  let w = memo.get(key);
  if (w === undefined) { ctx.font = `${weight} ${px}px ${fam}`; w = ctx.measureText(text).width; memo.set(key, w); }
  return w;
}

// ── Silhouettes: placed by the render pass, never by a network callback ─────
// An async callback that decides where something goes is how the tree's
// silhouettes ended up floating beside empty discs. Fetch, remember, and ask
// for another pass; the pass draws from memory, synchronously.
const silReady = new Map(), silAsked = new Set();
function askSilhouette(id) {
  if (silAsked.has(id)) return;
  silAsked.add(id);
  fetch(`../../assets/silhouettes/${id}.svg`)
    .then((r) => (r.ok ? r.text() : null))
    .then((txt) => {
      if (!txt) return;
      const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (!svg || doc.querySelector('parsererror')) return;
      let vb = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
      if (vb.length !== 4 || vb.some((v) => !Number.isFinite(v))) {
        vb = [0, 0, parseFloat(svg.getAttribute('width')) || 100, parseFloat(svg.getAttribute('height')) || 100];
      }
      silReady.set(id, { vb, nodes: Array.from(svg.childNodes) });
      later();
    })
    .catch(() => {});
}
let laterTimer = 0;
function later() { clearTimeout(laterTimer); laterTimer = setTimeout(render, 120); }

// ── Ink: every colour the drawing uses has to stand off the page ───────────
/* The tree's species colours were lightened for a dark ground. Drawn as they are
   on the light theme, Sphagnum, Volvox and the lungfish are 1.2:1 against the
   page — present in the DOM and gone from the screen. The lines and dots ARE the
   content here, so they are held to 3:1 (WCAG 1.4.11), darkened on a light page
   and lightened on a dark one, keeping the hue. */
const pc = document.createElement('canvas').getContext('2d');
const rgbOf = (c) => {
  pc.fillStyle = '#000'; pc.fillStyle = c;
  const h = pc.fillStyle;
  if (h[0] === '#') return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return h.match(/[\d.]+/g).slice(0, 3).map(Number);
};
const lumOf = ([r, g, b]) => {
  const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const inkMemo = new Map();
let pageLum = 0;
function ink(color) {
  const key = `${S.theme}|${color}`;
  let v = inkMemo.get(key);
  if (v) return v;
  const ratio = (rgb) => { const l = lumOf(rgb); return (Math.max(l, pageLum) + 0.05) / (Math.min(l, pageLum) + 0.05); };
  const base = rgbOf(color);
  const toward = pageLum > 0.5 ? [0, 0, 0] : [255, 255, 255];
  v = color;
  if (ratio(base) < 3.2) {
    for (let t = 0.05; t <= 1.001; t += 0.05) {
      const m = base.map((x, i) => Math.round(x * (1 - t) + toward[i] * t));
      if (ratio(m) >= 3.2) { v = '#' + m.map((x) => x.toString(16).padStart(2, '0')).join(''); break; }
    }
  }
  inkMemo.set(key, v);
  return v;
}

// ── Render ──────────────────────────────────────────────────────────────────
let L = null, seen = new Set();
const scroller = $('scroll'), plot = $('plot');

function render() {
  chrome();                                   // the page's colour must be settled before ink() reads it
  pageLum = lumOf(rgbOf(getComputedStyle(document.body).backgroundColor));
  const W = scroller.clientWidth, H = scroller.clientHeight;
  if (!W) return;
  const R = rtl();
  const X = (s) => (R ? W - s : s);
  L = computeLayout({ open: S.open, W, H, lang: S.lang, measure });
  const sheetPad = S.sheet ? ($('sheet').offsetHeight || 0) : 0;

  // Axis, pinned. Eras name the stretches of time; ticks give the dates that fit.
  const axis = el('svg', { width: W, height: AXIS_H, viewBox: `0 0 ${W} ${AXIS_H}` }, 'ld-svg ld-axis');
  for (const e of L.eras) {
    if (e.i % 2) axis.appendChild(el('rect', { x: R ? W - e.s2 : e.s1, y: 0, width: e.s2 - e.s1, height: AXIS_H, 'data-era': e.id }, 'ld-band'));
    if (e.show) {
      const t = el('text', { x: X(e.mid), y: 17, 'font-size': L.F.tick - 1 }, 'ld-era-name');
      t.textContent = e.text; axis.appendChild(t);
    }
  }
  for (const k of L.ticks) {
    const t = el('text', { x: X(k.s), y: 37, 'font-size': L.F.tick }, 'ld-tick');
    t.textContent = k.text; axis.appendChild(t);
    axis.appendChild(el('line', { x1: X(k.s), x2: X(k.s), y1: 42, y2: AXIS_H, 'stroke': 'currentColor' }, 'ld-axis-rule'));
  }
  axis.appendChild(el('line', { x1: 0, x2: W, y1: AXIS_H - .5, y2: AXIS_H - .5 }, 'ld-axis-rule'));

  const fillH = Math.max(L.contentH, H - AXIS_H) + sheetPad;      // the ground reaches the foot of the window
  const svg = el('svg', { width: W, height: fillH, viewBox: `0 0 ${W} ${fillH}` }, 'ld-svg');
  svg.setAttribute('role', 'tree');

  // Ground: era tints and the dotted dates, behind everything.
  for (const e of L.eras) if (e.i % 2) svg.appendChild(el('rect', { x: R ? W - e.s2 : e.s1, y: 0, width: e.s2 - e.s1, height: fillH }, 'ld-band'));
  for (const g of L.grid) if (g.mya) svg.appendChild(el('line', { x1: X(g.s), x2: X(g.s), y1: 0, y2: fillH }, 'ld-grid'));
  svg.appendChild(el('line', { x1: X(L.plotR), x2: X(L.plotR), y1: 0, y2: fillH }, 'ld-now'));

  const root = L.vis[0];
  svg.appendChild(el('line', { x1: X(root.limbFrom), x2: X(root.s), y1: root.y, y2: root.y }, 'ld-stem'));

  const first = !seen.size;
  const newSeen = new Set();
  const lineLayer = el('g'), nodeLayer = el('g');
  svg.append(lineLayer, nodeLayer);

  for (const r of L.vis) r.ink = ink(r.color);
  for (const r of L.vis) {
    // Rail: the upright that joins a fork to the children it gave rise to.
    if (r.open) {
      const ys = r.kids.map((k) => k.y);
      lineLayer.appendChild(el('path', {
        d: `M ${X(r.s)} ${Math.min(...ys, r.y)} V ${Math.max(...ys, r.y)}`,
        stroke: r.ink, 'stroke-width': Math.max(1.4, r.w * 0.55), 'data-id': r.id,
      }, 'ld-rail'));
    }
    if (r.parent) {
      lineLayer.appendChild(el('path', {
        d: `M ${X(r.limbFrom)} ${r.y} H ${X(r.s)}`, stroke: r.ink, 'stroke-width': r.w, 'data-id': r.id,
      }, 'ld-limb'));
    }
    if (!r.open && r.trailTo && r.s < r.trailTo - 8) {
      lineLayer.appendChild(el('path', {
        d: `M ${X(r.s + 7)} ${r.y} H ${X(r.trailTo)}`, stroke: r.ink, 'data-id': r.id,
      }, 'ld-trail'));
    }
  }

  for (const r of L.vis) {
    newSeen.add(r.id);
    const isRoot = !r.parent;
    const g = el('g', { 'data-id': r.id }, `ld-node${!first && !seen.has(r.id) ? ' ld-enter' : ''}${S.focus === r.id ? ' is-focus' : ''}`);
    const label = r.label;
    const physLeftToRight = label.dir * (R ? -1 : 1) > 0;
    const full = label.full;
    if (!isRoot) {
      g.setAttribute('role', 'treeitem');
      g.setAttribute('tabindex', '0');
      if (r.isGroup) g.setAttribute('aria-expanded', String(r.open));
      g.setAttribute('aria-label', r.isGroup
        ? `${full}, ${size(r.n) - 1} ${ui('ex_inside', S.lang)}`
        : `${full}, ${ageLabel(age(r.n), S.lang)}`);
      // One generous target per node: the dot, the name, and — for a tip — the
      // dotted trail between them, which is the biggest thing on the row.
      for (const h of r.hits) {
        const x1 = X(h.from), x2 = X(h.to);
        g.appendChild(el('rect', { x: Math.min(x1, x2), y: h.top, width: Math.abs(x2 - x1), height: h.bottom - h.top, rx: 8 }, 'ld-hit'));
      }
    }
    // The dot: a ring in the page's own colour keeps it clear of the line it sits on.
    g.appendChild(el('circle', {
      cx: X(r.s), cy: r.y, r: r.isGroup ? 6.6 : 4.4, fill: r.ink,
    }, 'ld-dot'));

    if (r.dagger) {
      const d = el('text', { x: X(r.dagger.s), y: r.y + 4.5, 'font-size': 12, 'text-anchor': R ? 'end' : 'start', fill: r.ink }, 'ld-dagger');
      d.textContent = '\u2020'; g.appendChild(d);
    }
    const lines = label.lines || [label.text];
    lines.forEach((ln, i) => {
      const t = el('text', {
        x: X(label.s), y: label.y + i * (label.lineH || 0), 'font-size': label.size, 'font-weight': label.weight,
        'text-anchor': physLeftToRight ? 'start' : 'end',
      }, `ld-name is-${label.kind}`);
      t.textContent = ln;
      if (i === 0 && (label.text !== full || lines.length > 1)) { const ti = el('title'); ti.textContent = full; t.appendChild(ti); }
      g.appendChild(t);
    });

    if (r.chip && r.chip.below) {
      const st = el('text', {
        x: X(r.chip.s), y: r.chip.y, 'font-size': r.chip.size, 'text-anchor': physLeftToRight ? 'start' : 'end',
      }, 'ld-sub');
      st.textContent = r.chip.text; g.appendChild(st);
    } else if (r.chip) {
      const cw = r.chip.w, cs = r.chip.s;
      const cx = R ? W - (cs + cw) : cs;
      const chip = el('g', {}, 'ld-chip');
      chip.appendChild(el('rect', { x: cx, y: r.y - 8.5, width: cw, height: 17, rx: 8.5 }));
      const ct = el('text', { x: cx + cw / 2, y: r.y + 3.6, 'font-size': r.chip.size });
      ct.textContent = r.chip.text; chip.appendChild(ct); g.appendChild(chip);
    }

    if (r.sil) {
      const sx = R ? W - r.sil.s - r.sil.size : r.sil.s;
      const cx = sx + r.sil.size / 2;
      const sil = SILHOUETTES[r.id] ? silReady.get(r.id) : null;
      if (SILHOUETTES[r.id] && !sil) askSilhouette(r.id);
      if (sil) {
        const [vx, vy, vw, vh] = sil.vb;
        const sc = Math.min(r.sil.size / (vw || 1), r.sil.size / (vh || 1));
        const w = el('g', {
          transform: `translate(${cx - (vw * sc) / 2 - vx * sc},${r.y - (vh * sc) / 2 - vy * sc}) scale(${sc})`,
          fill: r.ink, 'pointer-events': 'none',
        }, 'ld-sil');
        w.style.color = r.ink;       // both: the builder rewrites every fill to currentColor
        for (const c of sil.nodes) w.appendChild(c.cloneNode(true));
        g.appendChild(w);
      } else {
        g.appendChild(el('circle', { cx, cy: r.y, r: 3.2, fill: r.ink }, 'ld-pip'));
      }
    }

    if (!isRoot) {
      g.addEventListener('click', () => activate(r));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(r); } });
      g.addEventListener('pointerenter', () => lit(r.id));
      g.addEventListener('pointerleave', () => lit(null));
      g.addEventListener('focus', () => lit(r.id));
      g.addEventListener('blur', () => lit(null));
    }
    nodeLayer.appendChild(g);
  }
  seen = newSeen;

  plot.replaceChildren(axis, svg);
  lit(null);
  crumbs();
  chrome();
}

// ── The path home, lit while a node is hovered or focused ───────────────────
function lit(hoverId) {
  const id = hoverId || S.focus;
  const svg = plot.querySelector('svg:not(.ld-axis)');
  if (!svg) return;
  const ids = id ? new Set(path(byId(id)).map((n) => n.id)) : null;
  svg.classList.toggle('has-lit', !!ids);
  for (const e of svg.querySelectorAll('.ld-limb, .ld-rail, .ld-trail')) {
    e.classList.toggle('lit', !!ids && ids.has(e.getAttribute('data-id')));
  }
}

// ── Interaction ─────────────────────────────────────────────────────────────
function activate(r) {
  S.focus = r.id;
  if (r.isGroup) {
    if (S.open.has(r.id)) {
      // Folding a group folds what is inside it too, so opening it again
      // starts from one level rather than from whatever was left open.
      (function drop(n) { S.open.delete(n.id); kids(n).forEach(drop); })(r.n);
    } else S.open.add(r.id);
    S.sheet = null;
    render();
    keepInView(r.id);
  } else {
    S.sheet = r.id;
    sheet();
    render();
    keepAboveSheet(r.id);
  }
}

/* The card rises from the foot of the window and would otherwise sit on the very
   row that was tapped — on a phone it is a third of the screen. Bring the row up
   into the part of the window the card leaves free. */
function keepAboveSheet(id) {
  const r = L.vis.find((v) => v.id === id);
  if (!r) return;
  const sh = $('sheet').offsetHeight || 0;
  const free = scroller.clientHeight - AXIS_H - sh;
  const y = r.y;                                   // within the plot, below the pinned axis
  const top = scroller.scrollTop;
  if (y - L.rowH / 2 < top + 4 || y + L.rowH / 2 > top + free - 4) {
    scroller.scrollTo({ top: Math.max(0, y - free / 2), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}

/* After a group opens, bring its new rows into view without losing the group:
   if the whole subtree fits, scroll just far enough to show it; if it does not,
   keep the group near the top and let the reader scroll the rest. */
function keepInView(id) {
  const r = L.vis.find((v) => v.id === id);
  if (!r) return;
  let bottom = r.y;
  for (const v of L.vis) {
    let a = v; while (a && a !== r) a = a.parent;
    if (a === r) bottom = Math.max(bottom, v.y);
  }
  const view = scroller.clientHeight - AXIS_H;
  const top = scroller.scrollTop;
  const need = bottom + L.rowH * 1.5;
  let to = top;
  if (r.y - L.rowH * 1.5 < top) to = r.y - L.rowH * 1.5;
  if (need > top + view) to = Math.min(need - view, r.y - L.rowH * 1.5);
  if (Math.abs(to - top) > 2) {
    scroller.scrollTo({ top: Math.max(0, to), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}

function sheet() {
  const box = $('sheet');
  if (!S.sheet) { box.hidden = true; box.replaceChildren(); return; }
  const n = byId(S.sheet);
  box.hidden = false;
  const x = document.createElement('button');
  x.type = 'button'; x.className = 'ld-btn x'; x.textContent = '✕'; x.setAttribute('aria-label', 'Close');
  x.addEventListener('click', () => { S.sheet = null; sheet(); render(); });
  const h = document.createElement('h2');
  const dot = document.createElement('span'); dot.className = 'dot'; dot.style.background = n.color;
  h.append(dot, name(n, S.lang));
  box.replaceChildren(x, h);
  if (n.latin) { const p = document.createElement('p'); p.className = 'lat'; p.textContent = n.latin; box.append(p); }
  const w = document.createElement('p'); w.className = 'when'; w.textContent = ageLabel(age(n), S.lang); box.append(w);
  if (n.desc) { const p = document.createElement('p'); p.className = 'desc'; p.textContent = n.desc; box.append(p); }
}

function crumbs() {
  const host = $('crumbs');
  if (!host) return;                     // bare mode has no bar
  const trail = path(byId(S.focus) || ROOT);
  const sep = rtl() ? '‹' : '›';
  const parts = [];
  trail.forEach((n, i) => {
    if (i) { const s = document.createElement('i'); s.textContent = sep; parts.push(s); }
    const b = document.createElement(i === trail.length - 1 ? 'b' : 'span');
    b.textContent = name(n, S.lang); parts.push(b);
  });
  host.replaceChildren(...parts);
}

function chrome() {
  const r = document.documentElement;
  r.dataset.theme = S.theme; r.lang = S.lang; r.dir = rtl() ? 'rtl' : 'ltr';
  for (const b of document.querySelectorAll('#langs button')) b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang));
  for (const b of document.querySelectorAll('#themes button')) b.setAttribute('aria-pressed', String(b.dataset.theme === S.theme));
}

if (bare) { $('top').remove(); scroller.style.inset = '0'; }
else {
  for (const [host, key, vals] of [['langs', 'lang', ['en', 'he', 'ru']], ['themes', 'theme', ['dark', 'light']]]) {
    for (const v of vals) {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset[key] = v;
      b.textContent = key === 'lang' ? v.toUpperCase() : (v === 'dark' ? '◐' : '◑');
      b.addEventListener('click', () => { S[key] = v; memo.clear(); render(); sheet(); });
      $(host).appendChild(b);
    }
  }
  $('reset').addEventListener('click', () => {
    S.open = initialOpen(); S.focus = null; S.sheet = null; sheet(); render(); scroller.scrollTo({ top: 0 });
  });
}

let rz = 0;
addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(render, 80); });
chrome();
sheet();
render();
// A web font arriving changes every width the layout was fitted against.
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { memo.clear(); render(); });
if (document.fonts) document.fonts.addEventListener('loadingdone', () => { memo.clear(); render(); });

window.__ladder = { S, get layout() { return L; }, render, activate };
