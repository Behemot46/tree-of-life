// ══════════════════════════════════════════════════════
// Concept gallery for the opening screen.
//
//   index.html                         live gallery, tap a concept
//   index.html?scene=astrolabe&lang=he&theme=light
//   index.html?scene=division&still=1&t=2.4        one frame, no controls
//
// Concepts are pure functions of time (see common.js), so the scrubber, the
// screenshots and the finished still all come from the same draw().
// ══════════════════════════════════════════════════════

import CONCEPTS from './concepts/index.js';
import { translations, loadSilhouette } from './data.js';

const q = new URLSearchParams(location.search);
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const still = q.has('still');
const HOLD = 1.6;                                    // seconds the finished frame stays before looping

const S = {
  scene: CONCEPTS.find((c) => c.id === q.get('scene')) ? q.get('scene') : CONCEPTS[0].id,
  lang: ['en', 'he', 'ru'].includes(q.get('lang')) ? q.get('lang') : 'en',
  theme: q.get('theme') === 'light' ? 'light' : 'dark',
  t: Number(q.get('t')) || 0,
  playing: !still,
};
let built = null;                                    // { concept, draw }
let t0 = performance.now(), raf = 0;

function applyChrome() {
  const root = document.documentElement;
  root.dataset.theme = S.theme;
  root.lang = S.lang;
  root.dir = S.lang === 'he' ? 'rtl' : 'ltr';
}

function palette() {
  const css = getComputedStyle(document.documentElement);
  const v = (n, f) => (css.getPropertyValue(n) || '').trim() || f;
  return { bg: v('--bg', '#070C11'), ink: v('--text-primary', '#E6EEF1'), muted: v('--text-secondary', '#A2B4BD'), gold: v('--accent-primary', '#F2AC52'), isLight: S.theme === 'light' };
}

async function build() {
  applyChrome();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);   // art is soft; fill rate is not free
  const W = window.innerWidth, H = window.innerHeight;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const T = translations[S.lang] || translations.en;
  const env = {
    W, H, dpr, lang: S.lang, rtl: S.lang === 'he', pal: palette(),
    txt: { title: T.title, subtitle: T.splash_subtitle, click: T.splash_click, present: T.splash_present, skip: T.splash_skip },
    sil: new Map(),
    q,                                              // the page's query string, for trying variants
  };
  const concept = CONCEPTS.find((c) => c.id === S.scene);
  await Promise.all(['400 16px Inter', '500 16px Inter', '700 40px Inter', '700 40px Heebo', '800 40px Rubik', '400 16px Heebo'].map((f) => document.fonts.load(f, 'Aא')).concat(document.fonts.ready));
  if (concept.silhouettes) {
    const ids = concept.silhouettes(env);
    await Promise.all(ids.map(async (id) => { const s = await loadSilhouette(id); if (s) env.sil.set(id, s); }));
  }
  built = { concept, ...concept.build(env) };
  document.getElementById('cap-name') && (document.getElementById('cap-name').textContent = concept.name);
  document.getElementById('cap-line') && (document.getElementById('cap-line').textContent = concept.line);
  window.__api.ready = true;
  frame(performance.now());
}

function total() { return built.concept.duration + HOLD; }

function frame(now) {
  cancelAnimationFrame(raf);
  if (!built) return;
  if (S.playing) {
    S.t = (now - t0) / 1000;
    if (S.t > total()) { t0 = now; S.t = 0; }
  }
  built.draw(ctx, S.t);
  if (S.playing && S.t < 0.45) {                      // stands in for the CSS pre-roll's fade-in
    ctx.save(); ctx.globalAlpha = 1 - S.t / 0.45; ctx.fillStyle = palette().bg; ctx.fillRect(0, 0, window.innerWidth, window.innerHeight); ctx.restore();
  }
  const sc = document.getElementById('scrub');
  if (sc && S.playing) sc.value = String(Math.round((S.t / total()) * 1000));
  const ck = document.getElementById('clock');
  if (ck) ck.textContent = `${Math.min(S.t, built.concept.duration).toFixed(1)}s`;
  if (S.playing) raf = requestAnimationFrame(frame);
}

function restart() { t0 = performance.now(); S.t = 0; S.playing = true; frame(t0); }

window.__api = {
  ready: false,
  draw(t) { S.playing = false; S.t = t; built.draw(ctx, t); },
  get duration() { return built ? built.concept.duration : 0; },
  async set(o) { Object.assign(S, o); this.ready = false; await build(); },
};

function ui() {
  const el = document.getElementById('ui');
  el.hidden = false;
  const tabs = document.getElementById('tabs');
  for (const c of CONCEPTS) {
    const b = document.createElement('button');
    b.type = 'button'; b.role = 'tab'; b.textContent = c.name; b.dataset.id = c.id;
    b.addEventListener('click', async () => { S.scene = c.id; await build(); restart(); mark(); });
    tabs.appendChild(b);
  }
  const mark = () => tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.id === S.scene)));
  mark();
  const seg = (id, items, key) => {
    const box = document.getElementById(id);
    for (const [val, label] of items) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.dataset.v = val;
      b.addEventListener('click', async () => { S[key] = val; await build(); restart(); paint(); });
      box.appendChild(b);
    }
    const paint = () => box.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === S[key])));
    paint();
  };
  seg('langs', [['en', 'EN'], ['he', 'עב'], ['ru', 'РУ']], 'lang');
  seg('themes', [['dark', '☾'], ['light', '☀']], 'theme');
  document.getElementById('play').addEventListener('click', restart);
  const sc = document.getElementById('scrub');
  sc.addEventListener('input', () => { S.playing = false; S.t = (Number(sc.value) / 1000) * total(); frame(performance.now()); });
}

let rt = 0;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(async () => { const keep = S.t, was = S.playing; await build(); S.t = keep; S.playing = was; if (was) t0 = performance.now() - keep * 1000; frame(performance.now()); }, 150); });

await build();
if (!still) { ui(); restart(); } else { built.draw(ctx, S.t); }
