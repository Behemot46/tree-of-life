// ══════════════════════════════════════════════════════
// Concept gallery for the Explore layout.
//
//   index.html                                     live, tap a concept
//   index.html?scene=ladder&lang=he&theme=light
//   index.html?scene=river&node=vertebrates&bare=1 one frame, no controls
//
// Three answers to one complaint: a nested outline is the shape of a filing
// cabinet, and the content is a tree of descent. Each concept makes position
// mean something the outline leaves in a subtitle.
//
// Sketches, in the sense mockups/opening uses: they draw over the real tree in
// three languages and both themes, and nobody has measured their cost or
// fitted every string.
// ══════════════════════════════════════════════════════
import SCENES from './scenes/index.js';
import { ROOT, byId, path, name, kids } from './data.js';

const q = new URLSearchParams(location.search);
const stage = document.getElementById('stage');
const bare = q.has('bare');

const S = {
  scene: SCENES.find((c) => c.id === q.get('scene')) ? q.get('scene') : SCENES[0].id,
  lang: ['en', 'he', 'ru'].includes(q.get('lang')) ? q.get('lang') : 'en',
  theme: q.get('theme') === 'light' ? 'light' : 'dark',
  node: byId(q.get('node') || '') || ROOT,
};

function chrome() {
  const r = document.documentElement;
  r.dataset.theme = S.theme;
  r.lang = S.lang;
  r.dir = S.lang === 'he' ? 'rtl' : 'ltr';
}

function pick(n) {
  // A leaf is a destination, not a level: stand on its parent so its siblings
  // stay on screen, which is what the real view does with the detail panel.
  S.node = kids(n).length ? n : (n._parent || n);
  draw();
}

function draw() {
  chrome();
  const scene = SCENES.find((c) => c.id === S.scene);
  scene.render(stage, {
    selected: S.node, lang: S.lang, rtl: S.lang === 'he', onPick: pick,
  });
  if (bare) return;
  document.getElementById('cap-name').textContent = scene.label[S.lang] || scene.label.en;
  document.getElementById('cap-line').textContent = scene.blurb[S.lang] || scene.blurb.en;
  document.getElementById('where').textContent = path(S.node).map((n) => name(n, S.lang)).join(' › ');
  for (const b of document.querySelectorAll('#tabs button')) {
    b.setAttribute('aria-selected', String(b.dataset.id === S.scene));
    b.textContent = SCENES.find((c) => c.id === b.dataset.id).label[S.lang];
  }
  for (const b of document.querySelectorAll('#langs button')) b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang));
  for (const b of document.querySelectorAll('#themes button')) b.setAttribute('aria-pressed', String(b.dataset.theme === S.theme));
  const url = new URL(location.href);
  url.searchParams.set('scene', S.scene);
  url.searchParams.set('lang', S.lang);
  url.searchParams.set('theme', S.theme);
  url.searchParams.set('node', S.node.id);
  history.replaceState(null, '', url);
}

if (bare) {
  document.getElementById('ui').remove();
  stage.style.inset = '0';
} else {
  const ui = document.getElementById('ui');
  ui.hidden = false;
  const tabs = document.getElementById('tabs');
  for (const c of SCENES) {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.id = c.id; b.role = 'tab';
    b.addEventListener('click', () => { S.scene = c.id; draw(); });
    tabs.appendChild(b);
  }
  for (const [host, key, vals] of [['langs', 'lang', ['en', 'he', 'ru']], ['themes', 'theme', ['dark', 'light']]]) {
    const el = document.getElementById(host);
    for (const v of vals) {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset[key] = v;
      b.textContent = key === 'lang' ? v.toUpperCase() : (v === 'dark' ? '◐' : '◑');
      b.addEventListener('click', () => { S[key] = v; draw(); });
      el.appendChild(b);
    }
  }
  document.getElementById('up').addEventListener('click', () => { if (S.node._parent) { S.node = S.node._parent; draw(); } });
}

addEventListener('resize', draw);
draw();
