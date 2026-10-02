// ── TRAVEL — drag through time ──────────────────────────────────────────────
// One slider, from 3.8 billion years ago to today. Drag it and the screen shows
// who was alive then: a single speck at the left, bacteria, a long wait, the
// explosion of animals, and then the crowd we know. Press play and watch it grow.
//
// It asks nothing of the reader. The Ladder wanted its axis understood before it
// showed anything; this one is the axis, under your thumb, and the picture
// answers in the same instant. Every `appeared` in the tree was already a date —
// here it is finally something you can feel.
import { ROOT, ALL, ORIGIN, EXP, ERAS, kids, byId, age, T, nm, bubble, openCard, agoText, timePos, size } from '../common.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ERA_COLOR = { archean: '#c2603a', proterozoic: '#2f9d8f', paleozoic: '#3fae5a', mesozoic: '#8b55d6', cenozoic: '#e3a63d' };
const EXTINCTIONS = [445, 370, 252, 200, 66];
const ORDER = new Map(ALL.map((n, i) => [n.id, i]));
const toMya = (x) => (x >= 1000 ? 0 : ORIGIN * Math.pow(1 - x / 1000, 1 / EXP));
const toX = (mya) => Math.round(timePos(mya) * 1000);

/* Who is alive at a given moment, as the lineages a person would count: every
   node that exists then and has no descendant that exists yet. Too many of them
   to show, so the deepest siblings are folded into their parent until the number
   fits the screen — a folded one carries a count of what it stands for. */
function aliveAt(mya, cap) {
  let list = ALL.filter((n) => age(n) >= mya && !kids(n).some((c) => age(c) >= mya));
  const lineages = list.length;
  const counted = new Map(list.map((n) => [n.id, 1]));
  while (list.length > cap) {
    const by = new Map();
    for (const f of list) if (f._parent && age(f._parent) >= mya) by.set(f._parent, [...(by.get(f._parent) || []), f]);
    let best = null;
    for (const [p, ms] of by) if (ms.length >= 2 && (!best || p._depth * 1000 + ms.length > best.p._depth * 1000 + best.ms.length)) best = { p, ms };
    if (!best) break;
    const n = best.ms.reduce((s, m) => s + counted.get(m.id), 0);
    list = list.filter((f) => !best.ms.includes(f));
    list.push(best.p);
    counted.set(best.p.id, n);
  }
  return { list: list.sort((a, b) => ORDER.get(a.id) - ORDER.get(b.id)), counted, lineages };
}

export default function travel(host, ctx) {
  let x = 1000;
  let playing = false, raf = 0, last = 0;
  const els = new Map();
  host.classList.add('pl-travel');
  host.innerHTML = '';

  const era = document.createElement('div'); era.className = 'pl-era';
  const headline = document.createElement('div'); headline.className = 'pl-when-big';
  const big = document.createElement('h2'); const small = document.createElement('p');
  headline.append(big, small);
  const stage = document.createElement('div'); stage.className = 'pl-mosaic';
  const dock = document.createElement('div'); dock.className = 'pl-dock';
  const row = document.createElement('div'); row.className = 'pl-dock-row';
  const playBtn = document.createElement('button'); playBtn.type = 'button'; playBtn.className = 'pl-pill is-main pl-play';
  const range = document.createElement('input');
  range.type = 'range'; range.min = 0; range.max = 1000; range.step = 1; range.value = x; range.className = 'pl-range';
  row.append(playBtn, range);
  const strip = document.createElement('div'); strip.className = 'pl-eras';
  const hint = document.createElement('p'); hint.className = 'pl-hint';
  dock.append(row, strip, hint);
  host.append(era, headline, stage, dock);

  playBtn.addEventListener('click', () => (playing ? stop() : start()));
  range.addEventListener('input', () => { stop(); x = +range.value; schedule(); });

  function buildStrip() {
    strip.replaceChildren();
    strip.dir = ctx.rtl ? 'rtl' : 'ltr';
    ERAS.forEach((e) => {
      const seg = document.createElement('button');
      seg.type = 'button'; seg.className = 'pl-era-seg';
      const a = timePos(e.from), b = timePos(e.to);
      seg.style.flexGrow = String(Math.max(0.02, b - a));
      seg.style.setProperty('--ec', ERA_COLOR[e.id]);
      seg.textContent = e[ctx.lang] || e.en;
      seg.setAttribute('aria-label', `${e[ctx.lang] || e.en}`);
      seg.addEventListener('click', () => { stop(); x = toX((e.from + e.to) / 2); range.value = x; schedule(); });
      strip.appendChild(seg);
    });
    // The mass extinctions, as marks on the strip: places a thumb wants to go.
    EXTINCTIONS.forEach((m) => {
      const k = document.createElement('button');
      k.type = 'button'; k.className = 'pl-skull'; k.textContent = '☠';
      k.style.insetInlineStart = `${(timePos(m) * 100).toFixed(2)}%`;
      k.setAttribute('aria-label', agoText(m, ctx.lang));
      k.addEventListener('click', () => { stop(); x = clamp(toX(m) + 8, 0, 1000); range.value = x; schedule(); });
      strip.appendChild(k);
    });
    /* A name that does not fit its stretch of time is left off rather than cut
       mid-word ("CENOZOI"); the colour and the tap still work, and the label is
       kept for a screen reader. */
    requestAnimationFrame(() => {
      for (const seg of strip.querySelectorAll('.pl-era-seg')) {
        if (seg.scrollWidth > seg.clientWidth + 1) { seg.setAttribute('title', seg.textContent); seg.textContent = ''; }
      }
    });
  }

  let pending = false;
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; draw(); }); } }

  function draw() {
    const W = host.clientWidth, H = host.clientHeight;
    if (!W) return;
    const phone = W < 560;
    const mya = toMya(x);
    const e = ERAS.find((q) => mya <= q.from && mya > q.to) || (mya <= 0 ? ERAS[ERAS.length - 1] : ERAS[0]);
    host.style.setProperty('--era', ERA_COLOR[e.id]);
    range.setAttribute('aria-valuetext', mya < 0.5 ? T('today', ctx.lang) : agoText(mya, ctx.lang));

    const topH = phone ? 108 : 118, dockH = phone ? 150 : 132;
    const availW = W - (phone ? 16 : 56), availH = H - topH - dockH - 8;
    const cap = phone ? 24 : 48;
    const { list, counted, lineages } = aliveAt(mya, cap);

    big.textContent = mya < 0.5 ? T('today', ctx.lang) : agoText(mya, ctx.lang);
    small.textContent = `${e[ctx.lang] || e.en} · ${lineages} ${T('alive', ctx.lang)}`;
    playBtn.textContent = playing ? `❚❚` : `▶`;
    playBtn.setAttribute('aria-label', playing ? T('pause', ctx.lang) : T('play', ctx.lang));
    hint.textContent = T('travel', ctx.lang);

    // The biggest cell that fits them all, so nothing ever scrolls.
    const n = list.length;
    let cell = 150;
    for (; cell > 66; cell -= 4) {
      const cols = Math.floor(availW / cell), rows = Math.ceil(n / Math.max(1, cols));
      if (cols >= 1 && rows * cell * 1.02 <= availH) break;
    }
    const cols = Math.max(1, Math.floor(availW / cell));
    const rows = Math.ceil(n / cols);
    const d = clamp(Math.round(cell * 0.6), 44, 104);
    const y0 = topH + Math.max(0, (availH - rows * cell * 1.02) / 2);

    stage.style.cssText = `inset:0;`;
    const keep = new Set();
    list.forEach((node, i) => {
      keep.add(node.id);
      const r = Math.floor(i / cols), c = i % cols;
      const inRow = r === rows - 1 ? n - r * cols : cols;
      const rx = (W - inRow * cell) / 2 + (c + 0.5) * cell;
      const px = ctx.rtl ? W - rx : rx;
      const py = y0 + (r + 0.5) * cell * 1.02;
      const sub = counted.get(node.id) > 1 ? `+${counted.get(node.id) - 1}` : '';
      let el = els.get(node.id);
      if (!el) {
        el = bubble(node, { d, lang: ctx.lang, sub });
        el.classList.add('is-new');
        el.addEventListener('click', () => openCard(node, ctx.lang));
        stage.appendChild(el);
        els.set(node.id, el);
      } else {
        el.style.setProperty('--d', `${d}px`);
        el.querySelector('.pl-face').style.cssText = '';
        const sb = el.querySelector('.pl-sub');
        if (sb) sb.textContent = sub; else if (sub) { const s = document.createElement('span'); s.className = 'pl-sub'; s.dir = 'ltr'; s.textContent = sub; el.querySelector('.pl-label').appendChild(s); }
      }
      el.style.width = `${cell - 6}px`;
      el.style.transform = `translate(${px - (cell - 6) / 2}px, ${py - d / 2}px)`;
      el.style.opacity = '1';
    });
    for (const [id, el] of els) if (!keep.has(id)) { els.delete(id); el.remove(); }
  }

  function start() {
    if (x >= 1000) { x = 0; range.value = 0; }
    playing = true; last = 0;
    raf = requestAnimationFrame(tick);
    draw();
  }
  function stop() { playing = false; cancelAnimationFrame(raf); draw(); }
  function tick(ts) {
    if (!playing) return;
    if (last) x = Math.min(1000, x + ((ts - last) / 1000) * (1000 / 22));
    last = ts;
    range.value = Math.round(x);
    draw();
    if (x >= 1000) return stop();
    raf = requestAnimationFrame(tick);
  }

  buildStrip();
  draw();
  return {
    update() { for (const el of els.values()) el.remove(); els.clear(); buildStrip(); draw(); },
    surprise() { stop(); x = Math.round(Math.random() * 1000); range.value = x; draw(); },
    focus: (v) => { const m = Number(v); if (!Number.isNaN(m)) { x = clamp(toX(m), 0, 1000); range.value = x; draw(); } },
    get state() { return { x, mya: toMya(x) }; },
    destroy() { stop(); host.innerHTML = ''; host.classList.remove('pl-travel'); },
  };
}
