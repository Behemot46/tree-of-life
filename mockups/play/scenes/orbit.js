// ── ORBIT — "everyone is your relative" ─────────────────────────────────────
// Pick a creature and it sits at the top; every other creature on Earth is laid
// out below it by how long ago the two of you last shared an ancestor. Press any
// of them and it becomes the new centre — the whole picture glides to answer.
//
// What it replaces is a list you read. What it adds is a question you can ask by
// pressing: "who is the closest relative of a mushroom?" There is no wrong tap.
//
// A fan rather than a full circle, for two reasons that both came from trying
// the circle first. A lineage nine generations deep needs nine rings, and a
// circle spends its radius in every direction while a screen only has room in
// one; and time running DOWN the page is the direction a thumb already scrolls.
import { ROOT, byId, kids, path, size, age, T, nm, bubble, chipAge, openCard, inside, agoText } from '../common.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const SVG = 'http://www.w3.org/2000/svg';

export default function orbit(host, ctx) {
  let focus = byId('homo-sapiens') || ROOT;
  let trail = [];
  const els = new Map();
  let rings = null;

  host.classList.add('pl-orbit');
  host.innerHTML = '';
  const guide = document.createElementNS(SVG, 'svg');
  guide.setAttribute('class', 'pl-guide');
  const stage = document.createElement('div');
  stage.className = 'pl-stage';
  const bar = document.createElement('div');
  bar.className = 'pl-actions';
  const legend = document.createElement('p');
  legend.className = 'pl-legend';
  const trailBox = document.createElement('div');
  trailBox.className = 'pl-trail';
  host.append(guide, stage, bar, trailBox, legend);

  const act = (cls, text, fn) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = `pl-pill ${cls}`; b.textContent = text; b.addEventListener('click', fn);
    return b;
  };

  // ── Who goes where ────────────────────────────────────────────────────────
  /* Rings are the ancestors on the way from the focus to the root, nearest
     first; the bubbles on a ring are that ancestor's OTHER children — the
     branches the lineage did not take there. An ancestor whose only child is the
     lineage itself has no one to show, and gets no ring. */
  function relatives(f) {
    const chain = path(f);
    const out = [];
    for (let i = chain.length - 2; i >= 0; i--) {
      const A = chain[i], on = chain[i + 1];
      const sibs = kids(A).filter((k) => k !== on);
      if (sibs.length) out.push({ A, age: age(A), sibs });
    }
    return out;
  }

  function layout(W, H) {
    const phone = W < 560;
    const R = ctx.rtl ? -1 : 1;
    const Sf = phone ? 96 : 124;
    const Wb = phone ? 96 : 112;                      // a bubble's footprint: its label is clipped to this
    const LH = 32;                                    // the label under a bubble: a name and a number
    const cx = W / 2, cy = (phone ? 62 : 22) + Sf / 2;
    /* On a phone the pills live at the foot, where a thumb is; on a desktop they
       are in the corner, out of the way of a picture that has the whole width. */
    const bottom = H - (phone ? 96 : 40);
    const items = [];
    const ringsOut = [];

    const focusSub = kids(focus).length ? `${size(focus) - 1} ${inside(ctx.lang)}` : '';
    items.push({ key: focus.id, n: focus, kind: 'focus', x: cx, y: cy, d: Sf, w: Wb + 20, h: Sf + 62, sub: focusSub, fixed: true });

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
       nothing oscillates, and two bubbles cannot end up on each other — the
       version that pushed them apart made some of its own collisions. What does
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
      const putOnes = [];
      shown.forEach((k, j) => {
        const it = put(k, 'sat', rad, at(j), d, kids(k).length ? `${size(k) - 1}` : '', { phi });
        if (it) putOnes.push(it); else hidden++;
      });
      items.push(...putOnes);
      if (hidden) {
        const m = put(focus, 'more', rad, at(shown.length), d, `+${hidden}`, { key: `more:${focus.id}`, phi, moreName: nm(focus, ctx.lang) });
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
        const m = put(ring.A, 'more', rad, at(shown.length), dBase, `+${hidden}`, { key: `more:${ring.A.id}:${i}`, phi, moreName: nm(ring.A, ctx.lang) });
        if (m) items.push(m);
      }
      ringsOut.push({ r: rad, phi, kind: 'out' });
    });

    return { items, rings: ringsOut, cx, cy, W, H };
  }

  // ── Drawing ───────────────────────────────────────────────────────────────
  function render(first = false) {
    const W = host.clientWidth, H = host.clientHeight;
    if (!W) return;
    const L = layout(W, H);
    rings = L;
    const phone = W < 560;
    stage.style.width = `${W}px`;

    // The guides: faint arcs, so the rings read as distances rather than as clutter.
    guide.setAttribute('width', W); guide.setAttribute('height', H);
    guide.replaceChildren();
    for (const rg of L.rings) {
      const sx = Math.sin(rg.phi) * rg.r, cyp = Math.cos(rg.phi) * rg.r;
      const p = document.createElementNS(SVG, 'path');
      p.setAttribute('d', `M ${L.cx - sx} ${L.cy + cyp} A ${rg.r} ${rg.r} 0 0 0 ${L.cx + sx} ${L.cy + cyp}`);
      p.setAttribute('class', rg.kind === 'in' ? 'pl-arc is-in' : 'pl-arc');
      guide.appendChild(p);
    }

    const keep = new Set();
    for (const it of L.items) {
      keep.add(it.key);
      let el = els.get(it.key);
      const Wb = it.w;
      if (!el) {
        el = it.kind === 'more' ? moreBubble(it) : bubble(it.n, { d: it.d, lang: ctx.lang, sub: it.sub, cls: it.kind });
        el.style.width = `${Wb}px`;
        if (!first) {                                           // new arrivals pop out of the centre
          el.style.transform = `translate(${L.cx - Wb / 2}px, ${L.cy - it.d / 2}px) scale(.2)`;
          el.style.opacity = '0';
        }
        el.addEventListener('click', () => press(it.key));
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
      el.style.transform = `${el.style.transform.replace(/ scale\([^)]*\)/, '')} scale(.3)`;
      setTimeout(() => el.remove(), 420);
    }

    const tiny = host.clientWidth < 560;
    const home = focus.id !== 'homo-sapiens'
      ? act('is-icon', tiny ? '\u2302' : `\u2302 ${T('home', ctx.lang)}`, () => go(byId('homo-sapiens')))
      : null;
    if (home) home.setAttribute('aria-label', T('home', ctx.lang));   // an icon alone has no name
    bar.replaceChildren(act('is-main', `\u{1F3B2} ${T('surprise', ctx.lang)}`, surprise), ...(home ? [home] : []));
    trailBox.replaceChildren(
      ...trail.slice(-3).reverse().map((id) => act('is-trail', `\u21a9 ${nm(byId(id), ctx.lang)}`, () => go(byId(id), true))),
    );
    legend.textContent = T('legend', ctx.lang);
  }

  function retune(el, it) {
    const sub = el.querySelector('.pl-sub');
    if (sub && sub.textContent !== it.sub) sub.textContent = it.sub;
    if (!sub && it.sub) {
      const s = document.createElement('span'); s.className = 'pl-sub'; s.dir = 'ltr'; s.textContent = it.sub;
      const lab = el.querySelector('.pl-label'); if (lab) lab.appendChild(s);
    }
    el.className = el.className.replace(/\b(focus|sat|rel|more)\b/g, '').trim() + ` ${it.kind}`;
  }

  function moreBubble(it) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pl-b more'; b.dataset.id = it.key;
    b.style.setProperty('--c', it.n.color);
    b.style.setProperty('--d', `${it.d}px`);
    b.setAttribute('aria-label', `${it.sub} ${T('more', ctx.lang)}`);
    const face = document.createElement('span'); face.className = 'pl-face pl-more';
    face.textContent = it.sub; face.dir = 'ltr';
    b.appendChild(face);
    const lab = document.createElement('span'); lab.className = 'pl-label';
    const nmEl = document.createElement('span'); nmEl.className = 'pl-name'; nmEl.textContent = it.moreName || T('more', ctx.lang);
    lab.appendChild(nmEl); b.appendChild(lab);
    return b;
  }

  // ── Pressing ──────────────────────────────────────────────────────────────
  function press(key) {
    if (key.startsWith('more:')) {
      const id = key.split(':')[1];
      return go(byId(id));
    }
    const n = byId(key);
    if (n === focus) return openCard(n, ctx.lang);
    go(n);
  }
  function go(n, back = false) {
    if (!n || n === focus) return;
    if (!back) trail = [...trail.filter((id) => id !== focus.id), focus.id].slice(-5);
    else trail = trail.filter((id) => id !== n.id);
    focus = n;
    render();
    ctx.onFocus && ctx.onFocus(n);
  }
  function surprise() {
    const all = ctx.all.filter((n) => !kids(n).length && n !== focus);
    go(all[Math.floor(Math.random() * all.length)]);
  }

  render(true);
  return {
    update() { for (const el of els.values()) el.remove(); els.clear(); render(true); },
    surprise,
    focus: (id) => go(byId(id)),
    get layout() { return rings; },
    destroy() { host.innerHTML = ''; host.classList.remove('pl-orbit'); },
  };
}
