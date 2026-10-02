// ── DIVE — zoom into any group ──────────────────────────────────────────────
// Every group is a world: a disc with its members packed inside as large photos.
// Press one and the camera dives into it, and its own members fill the screen.
// Pressing a species opens its card. There is no way to get lost, because "up"
// is always one press away and every step down is a physical zoom you can watch.
//
// Where Orbit is about relatedness, this is about contents: what is inside a
// mushroom, what is inside a mammal. Names sit ON the pictures, because a planet
// packed among forty others has no room beneath it.
import { ROOT, byId, kids, path, size, age, T, nm, bubble, openCard, inside } from '../common.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* Circle packing by spiral search: each circle, largest first, walks out along a
   golden-angle spiral from the centre and takes the first spot that touches
   nothing. Crude, and plenty for the dozen to forty circles a group has. */
function pack(radii, gap) {
  const placed = [];
  const order = radii.map((r, i) => ({ r, i })).sort((a, b) => b.r - a.r);
  const step = Math.min(...radii) * 0.3;
  for (const { r, i } of order) {
    let spot = null;
    for (let t = 0; t < 9000 && !spot; t++) {
      const a = t * 2.399963, rho = step * Math.sqrt(t);
      const x = rho * Math.cos(a), y = rho * Math.sin(a);
      if (placed.every((p) => Math.hypot(x - p.x, y - p.y) >= p.r + r + gap)) spot = { x, y };
    }
    placed.push({ ...spot, r, i });
  }
  // Recentre on the area-weighted middle, then measure the circle that holds them all.
  let A = 0, mx = 0, my = 0;
  for (const p of placed) { const a = p.r * p.r; A += a; mx += p.x * a; my += p.y * a; }
  mx /= A; my /= A;
  let R = 0;
  for (const p of placed) { p.x -= mx; p.y -= my; R = Math.max(R, Math.hypot(p.x, p.y) + p.r); }
  return { placed, R };
}

export default function dive(host, ctx) {
  let focus = ROOT;
  host.classList.add('pl-dive');
  host.innerHTML = '';
  const head = document.createElement('div'); head.className = 'pl-head';
  const disc = document.createElement('div'); disc.className = 'pl-disc';
  const bar = document.createElement('div'); bar.className = 'pl-actions';
  host.append(disc, head, bar);
  let items = [], geo = null, planets = null, busy = false;

  const act = (cls, text, fn, label) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = `pl-pill ${cls}`; b.textContent = text; b.addEventListener('click', fn);
    if (label) b.setAttribute('aria-label', label);
    return b;
  };

  function compute() {
    const W = host.clientWidth, H = host.clientHeight;
    const phone = W < 560;
    const headH = phone ? 118 : 0, footH = phone ? 92 : 20;
    const availH = H - headH - footH;
    const Rw = Math.max(120, Math.min(phone ? W / 2 - 4 : W / 2 - 40, availH / 2));
    const cx = W / 2, cy = headH + availH / 2;
    const ks = kids(focus);
    const unit = 10;
    const radii = ks.map((k) => unit * (kids(k).length ? clamp(1 + 0.34 * Math.log2(size(k)), 1, 1.9) : 1));
    const { placed, R } = pack(radii, unit * 0.1);
    const scale = (Rw * 0.95) / R;
    return {
      W, H, phone, Rw, cx, cy,
      items: placed.map((p) => ({ n: ks[p.i], x: p.x * scale, y: p.y * scale, r: p.r * scale })),
    };
  }

  function render(entry = 'fade') {
    geo = compute();
    items = geo.items;
    const { Rw, cx, cy, phone } = geo;
    disc.style.cssText = `left:${cx - Rw}px;top:${cy - Rw}px;width:${2 * Rw}px;height:${2 * Rw}px;--c:${focus.color}`;
    disc.replaceChildren();
    const mark = document.createElement('span');
    mark.className = 'pl-mark';
    mark.style.maskImage = mark.style.webkitMaskImage = `url("../../assets/silhouettes/${focus.id}.svg")`;
    disc.appendChild(mark);

    planets = document.createElement('div');
    planets.className = 'pl-planets';
    if (entry === 'fade') planets.classList.add('is-in');
    for (const it of items) {
      const d = it.r * 2;
      const isGroup = kids(it.n).length > 0;
      const b = bubble(it.n, { d, lang: ctx.lang, label: false, tag: true, badge: isGroup ? `${size(it.n) - 1}` : '', cls: 'tagged' });
      b.style.cssText += `;left:${Rw + it.x - it.r}px;top:${Rw + it.y - it.r}px;position:absolute;width:${d}px`;
      b.style.transform = 'none';
      b.addEventListener('click', () => (isGroup ? goDown(it) : openCard(it.n, ctx.lang)));
      planets.appendChild(b);
    }
    disc.appendChild(planets);

    // The title: where you are, what is inside, and the way back up.
    const chain = path(focus);
    head.replaceChildren();
    const h = document.createElement('h2'); h.textContent = nm(focus, ctx.lang);
    h.style.cursor = 'pointer'; h.addEventListener('click', () => openCard(focus, ctx.lang));
    const sub = document.createElement('p');
    sub.textContent = kids(focus).length ? `${size(focus) - 1} ${inside(ctx.lang)}` : '';
    const crumbs = document.createElement('div'); crumbs.className = 'pl-crumbs';
    chain.slice(0, -1).forEach((n) => {
      const c = document.createElement('button'); c.type = 'button'; c.textContent = nm(n, ctx.lang);
      c.addEventListener('click', () => jump(n));
      crumbs.appendChild(c);
    });
    head.append(h, sub, crumbs);

    bar.replaceChildren(
      act('is-main', `\u{1F3B2} ${T('surprise', ctx.lang)}`, surprise),
      ...(focus.parent !== undefined || focus._parent ? [act('is-icon', '↑', goUp, T('back', ctx.lang))] : []),
    );
  }

  // ── Moving ────────────────────────────────────────────────────────────────
  /* Down: the planet that was pressed grows to fill the world, the rest fall
     away, and then its own members are drawn in its place. The zoom is a real
     transform about that planet's centre, so the eye follows one thing all the
     way in. */
  function zoomTransform(it) {
    const s = (geo.Rw * 0.9) / it.r;
    return { s, origin: `${geo.Rw + it.x}px ${geo.Rw + it.y}px`, css: `translate(${-it.x}px, ${-it.y}px) scale(${s})` };
  }
  function goDown(it) {
    if (busy) return;
    busy = true;
    const z = zoomTransform(it);
    planets.style.transformOrigin = z.origin;
    for (const el of planets.querySelectorAll('.pl-b')) if (el.dataset.id !== it.n.id) el.style.opacity = '0';
    planets.style.transform = z.css;
    setTimeout(() => { focus = it.n; render('fade'); busy = false; ctx.onFocus && ctx.onFocus(focus); }, 520);
  }
  function goUp() {
    if (busy || !focus._parent) return;
    const from = focus;
    focus = focus._parent;
    render('none');
    // Arrive zoomed in on the planet we just left, and settle back out.
    const it = items.find((x) => x.n === from);
    if (it) {
      const z = zoomTransform(it);
      planets.style.transition = 'none';
      planets.style.transformOrigin = z.origin;
      planets.style.transform = z.css;
      planets.style.opacity = '0';
      void planets.offsetWidth;
      planets.style.transition = '';
      planets.style.transform = 'none';
      planets.style.opacity = '1';
    }
    ctx.onFocus && ctx.onFocus(focus);
  }
  function jump(n) { focus = n; render('fade'); ctx.onFocus && ctx.onFocus(focus); }
  function surprise() {
    const groups = ctx.all.filter((n) => kids(n).length && n !== focus && n !== ROOT);
    jump(groups[Math.floor(Math.random() * groups.length)]);
  }

  render('none');
  return {
    update() { render('none'); },
    surprise,
    focus: (id) => { const n = byId(id); if (n) jump(n); },
    get layout() { return geo; },
    destroy() { host.innerHTML = ''; host.classList.remove('pl-dive'); },
  };
}
