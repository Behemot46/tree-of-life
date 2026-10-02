// ══════════════════════════════════════════════════════
// Explore, as play — three concepts for one complaint: the diagram is accurate
// and nobody wants to touch it.
//
//   index.html                                  live, tap a concept
//   index.html?scene=orbit&lang=he&theme=light
//   index.html?scene=orbit&focus=lion&bare=1    one state, no chrome
//
// Sketches, in the sense mockups/opening means it: they run over the real
// expanded tree and the real photographs, in three languages and both themes.
// ══════════════════════════════════════════════════════
import SCENES from './scenes/index.js';
import { ALL, T, closeCard } from './common.js';

const q = new URLSearchParams(location.search);
const host = document.getElementById('scene');
const S = {
  scene: SCENES.find((s) => s.id === q.get('scene')) ? q.get('scene') : SCENES[0].id,
  lang: ['en', 'he', 'ru'].includes(q.get('lang')) ? q.get('lang') : 'en',
  theme: q.get('theme') === 'light' ? 'light' : 'dark',
};
let inst = null;
const ctx = {
  get lang() { return S.lang; },
  get rtl() { return S.lang === 'he'; },
  all: ALL,
  onFocus() { sync(); },
};

function chrome() {
  const r = document.documentElement;
  r.dataset.theme = S.theme; r.lang = S.lang; r.dir = S.lang === 'he' ? 'rtl' : 'ltr';
  for (const b of document.querySelectorAll('#tabs button')) {
    b.setAttribute('aria-selected', String(b.dataset.id === S.scene));
    b.textContent = T(b.dataset.id === 'orbit' ? 'orbit' : b.dataset.id === 'dive' ? 'dive' : 'time', S.lang);
  }
  for (const b of document.querySelectorAll('#langs button')) b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang));
  for (const b of document.querySelectorAll('#themes button')) b.setAttribute('aria-pressed', String(b.dataset.theme === S.theme));
}
function sync() {
  const url = new URL(location.href);
  url.searchParams.set('scene', S.scene); url.searchParams.set('lang', S.lang); url.searchParams.set('theme', S.theme);
  history.replaceState(null, '', url);
}
function mount() {
  if (inst) inst.destroy();
  closeCard();
  host.className = '';
  inst = SCENES.find((s) => s.id === S.scene).make(host, ctx);
  if (q.get('focus') && inst.focus) inst.focus(q.get('focus'));
  chrome(); sync();
}

if (q.has('bare')) { document.getElementById('top').remove(); host.style.inset = '0'; }
else {
  const tabs = document.getElementById('tabs');
  for (const s of SCENES) {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.id = s.id; b.role = 'tab';
    b.addEventListener('click', () => { S.scene = s.id; mount(); });
    tabs.appendChild(b);
  }
  for (const [id, key, vals] of [['langs', 'lang', ['en', 'he', 'ru']], ['themes', 'theme', ['dark', 'light']]]) {
    for (const v of vals) {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset[key] = v;
      b.textContent = key === 'lang' ? v.toUpperCase() : (v === 'dark' ? '◐' : '◑');
      b.addEventListener('click', () => { S[key] = v; chrome(); if (key === 'lang') { closeCard(); inst.update(); } sync(); });
      document.getElementById(id).appendChild(b);
    }
  }
}
chrome();
mount();
addEventListener('resize', () => { clearTimeout(window.__rz); window.__rz = setTimeout(() => inst && inst.update(), 100); });
window.__play = { S, get inst() { return inst; } };
