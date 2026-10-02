// Shared by the three scenes: one bubble, the words, and the card.
//
// The brief that made these: the Ladder was accurate and nobody wanted to touch
// it. A diagram is read, not played — small dots, thin lines, and nothing that
// says "tap here". So every scene here is built from the same thing: a large,
// round, photographic bubble that is obviously pressable, a few of them at a
// time, and an answer the instant it is pressed.
import { ImageLoader } from '../../js/imageLoader.js';
import { SILHOUETTES } from '../../js/silhouettes.js';
import { TAXON_NAMES } from '../../js/taxonNames.js';
export * from './model.js';
import { age, size, ui } from './model.js';

// ── Words ───────────────────────────────────────────────────────────────────
// Local, because a mockup must not add keys to the shipping translation tables.
// The Hebrew and Russian have not had a native speaker's review.
const STR = {
  en: {
    tap: 'Tap any bubble', surprise: 'Surprise me', home: 'Start from humans',
    inside: 'inside', shared: 'last shared ancestor', open: 'Open in the Atlas', close: 'Close',
    appeared: 'Appeared', you: 'You are here', travel: 'Drag to travel through time',
    alive: 'lineages alive', today: 'today', back: 'Up one level', play: 'Play', pause: 'Pause',
    orbit: 'Orbit', dive: 'Dive', time: 'Time', more: 'more',
    legend: 'Numbers show when you last shared an ancestor (Ma = million years ago)',
  },
  he: {
    tap: 'לחצו על כל בועה', surprise: 'הפתיעו אותי', home: 'נתחיל מהאדם',
    inside: 'בפנים', shared: 'אב קדמון משותף אחרון', open: 'פתחו באטלס', close: 'סגירה',
    appeared: 'הופיע', you: 'אתם כאן', travel: 'גררו כדי לנסוע בזמן',
    alive: 'שושלות חיות', today: 'היום', back: 'רמה אחת למעלה', play: 'הפעלה', pause: 'השהיה',
    orbit: 'מסלול', dive: 'צלילה', time: 'זמן', more: 'עוד',
    legend: 'המספרים מראים מתי חלקתם אב קדמון לאחרונה (Ma = מיליוני שנים)',
  },
  ru: {
    tap: 'Нажмите на любой кружок', surprise: 'Удиви меня', home: 'Начать с человека',
    inside: 'внутри', shared: 'последний общий предок', open: 'Открыть в Атласе', close: 'Закрыть',
    appeared: 'Появился', you: 'Вы здесь', travel: 'Тяните, чтобы путешествовать во времени',
    alive: 'живых линий', today: 'сегодня', back: 'На уровень выше', play: 'Запуск', pause: 'Пауза',
    orbit: 'Орбита', dive: 'Погружение', time: 'Время', more: 'ещё',
    legend: 'Числа — когда у вас был последний общий предок (Ma = млн лет назад)',
  },
};
export const T = (k, lang) => (STR[lang] && STR[lang][k]) || STR.en[k] || k;
export const nm = (n, lang) => (TAXON_NAMES[lang] && TAXON_NAMES[lang][n.id]) || n.name;
export const inside = (lang) => ui('ex_inside', lang);

/* "541 million years ago", in words and in the reader's language. The compact
   "541 Ma" is for a chip with no room; a sentence should not need a reader to
   know what Ma means. */
export function agoText(mya, lang) {
  const n = (v) => String(+v.toFixed(v >= 10 ? 0 : 1));
  if (mya >= 1000) {
    const b = n(mya / 1000);
    return { en: `${b} billion years ago`, he: `לפני ${b} מיליארד שנה`, ru: `${b} млрд лет назад` }[lang];
  }
  if (mya >= 1) {
    const m = n(mya);
    return { en: `${m} million years ago`, he: `לפני ${m} מיליון שנה`, ru: `${m} млн лет назад` }[lang];
  }
  return { en: 'under a million years ago', he: 'לפני פחות ממיליון שנה', ru: 'менее миллиона лет назад' }[lang];
}
/* The short form, for a chip. "Ma" and "Ga" are Latin runs; the element carrying
   it gets dir="ltr" so Hebrew cannot reorder it to "Ma 500". */
export function chipAge(mya) {
  if (mya >= 1000) return `${+(mya / 1000).toFixed(mya % 1000 ? 1 : 0)} Ga`;
  if (mya >= 1) return `${Math.round(mya)} Ma`;
  return '<1 Ma';
}

// ── One bubble ──────────────────────────────────────────────────────────────
/* Layers, bottom to top: a tinted disc, the silhouette (or the emoji), and the
   photograph, which fades in when it has actually decoded. So a bubble is never
   an empty circle while a picture loads, and never one after it fails — which is
   the same fault the tree's discs and Explore's cards each had once. */
export function bubble(n, { d, lang, label = true, sub = '', cls = '', tag = false, badge = '' }) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `pl-b ${cls}`;
  b.dataset.id = n.id;
  b.style.setProperty('--c', n.color);
  b.style.setProperty('--d', `${d}px`);
  b.setAttribute('aria-label', `${nm(n, lang)}${sub ? ', ' + sub : ''}`);

  const face = document.createElement('span');
  face.className = 'pl-face';
  if (SILHOUETTES[n.id]) {
    const s = document.createElement('span');
    s.className = 'pl-sil';
    s.style.maskImage = s.style.webkitMaskImage = `url("../../assets/silhouettes/${n.id}.svg")`;
    face.appendChild(s);
  } else {
    const e = document.createElement('span');
    e.className = 'pl-emoji';
    e.textContent = n.icon || '●';
    face.appendChild(e);
  }
  const url = ImageLoader.getBestUrl(n, d > 90 ? 'hero' : 'thumb').url;
  if (url) {
    const img = document.createElement('img');
    img.className = 'pl-img';
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('load', () => b.classList.add('has-img'));
    img.src = url;
    face.appendChild(img);
  }
  if (tag && d >= 54) {
    /* The name goes on the picture, over a shade, when there is no room beneath
       it. A planet packed among forty others has none. */
    const t = document.createElement('span');
    t.className = 'pl-tag';
    t.textContent = nm(n, lang);
    face.appendChild(t);
  }
  b.appendChild(face);
  if (badge) {
    const g = document.createElement('span');
    g.className = 'pl-badge';
    g.dir = 'ltr';
    g.textContent = badge;
    b.appendChild(g);
  }

  if (label) {
    const t = document.createElement('span');
    t.className = 'pl-label';
    const name = document.createElement('span');
    name.className = 'pl-name';
    name.textContent = nm(n, lang);
    t.appendChild(name);
    if (sub) {
      const s = document.createElement('span');
      s.className = 'pl-sub';
      s.dir = 'ltr';
      s.textContent = sub;
      t.appendChild(s);
    }
    b.appendChild(t);
  }
  return b;
}

// ── The card ────────────────────────────────────────────────────────────────
export function openCard(n, lang) {
  let sh = document.getElementById('card');
  if (!sh) {
    sh = document.createElement('aside');
    sh.id = 'card';
    sh.className = 'pl-card';
    document.body.appendChild(sh);
    addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCard(); });
  }
  const hero = ImageLoader.getBestUrl(n, 'hero');
  const credit = hero.url ? ImageLoader.creditLine(hero) : '';
  sh.style.setProperty('--c', n.color);
  sh.replaceChildren();
  const x = document.createElement('button');
  x.type = 'button'; x.className = 'pl-x'; x.textContent = '✕'; x.setAttribute('aria-label', T('close', lang));
  x.addEventListener('click', closeCard);
  sh.appendChild(x);
  if (hero.url) {
    const im = document.createElement('img');
    im.className = 'pl-hero'; im.alt = ''; im.src = hero.url;
    im.addEventListener('error', () => im.remove());
    sh.appendChild(im);
  }
  const body = document.createElement('div');
  body.className = 'pl-card-body';
  const h = document.createElement('h2'); h.textContent = nm(n, lang);
  body.appendChild(h);
  if (n.latin) { const p = document.createElement('p'); p.className = 'pl-latin'; p.dir = 'ltr'; p.textContent = n.latin; body.appendChild(p); }
  const w = document.createElement('p'); w.className = 'pl-when';
  w.textContent = `${T('appeared', lang)} ${agoText(age(n), lang)}`;
  body.appendChild(w);
  if (n.desc) { const p = document.createElement('p'); p.className = 'pl-desc'; p.dir = 'ltr'; p.textContent = n.desc; body.appendChild(p); }
  if (credit) {
    // CC BY and BY-SA ask for the author and the licence wherever the photo is shown.
    const c = document.createElement('p'); c.className = 'pl-credit'; c.dir = 'ltr'; c.innerHTML = credit; body.appendChild(c);
  }
  const a = document.createElement('a');
  a.className = 'pl-open'; a.href = `../../atlas.html?node=${encodeURIComponent(n.id)}&lang=${lang}`;
  a.textContent = `${T('open', lang)} ↗`;
  body.appendChild(a);
  sh.appendChild(body);
  sh.classList.add('is-open');
}
export function closeCard() { const sh = document.getElementById('card'); if (sh) sh.classList.remove('is-open'); }

export const sizeOf = size;
