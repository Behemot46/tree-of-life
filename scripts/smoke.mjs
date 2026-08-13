#!/usr/bin/env node
/**
 * Tree of Life — browser smoke checks.
 *
 * Opens the real page in Chromium across desktop/phone viewports and all three
 * languages, then asserts ~30 things about rendering, layout and i18n.
 *
 *   node scripts/smoke.mjs                      # serves ./ and tests it
 *   node scripts/smoke.mjs --url https://...    # tests a deployed site
 *   node scripts/smoke.mjs --update-baseline    # re-record known failures
 *
 * --proxy <server> routes Chromium through a proxy, for running from behind
 * one. It is opt-in rather than read from HTTPS_PROXY, because picking that up
 * automatically broke plain --url runs against a local server. TLS is always
 * verified.
 *
 * Exit code is 0 only when every required check passes AND the baseline of
 * known failures is accurate. A baselined check that starts passing is also an
 * error — it means the baseline is stale and the check should be promoted to
 * required.
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_PATH = path.join(ROOT, 'scripts', 'smoke-baseline.json');
const OUT_DIR = path.join(ROOT, '.smoke-out');

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const UPDATE_BASELINE = flag('update-baseline');
const KEEP_SHOTS = !flag('no-screenshots');
const EXTERNAL_URL = opt('url', process.env.SMOKE_URL || '');
const PROXY = opt('proxy', '');

// ── Thresholds ────────────────────────────────────────────────────────────────
// The tree must fill at least this fraction of the stage on its longest axis.
const FILL_MIN = 0.7;
// ...and must not spill beyond the stage by more than this fraction.
const SPILL_MAX = 1.02;

const DESKTOP = { name: 'desktop', width: 1440, height: 900 };
const PHONE = { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

const SCENARIOS = [
  { id: 'desktop-en', viewport: DESKTOP, lang: 'en' },
  { id: 'desktop-he', viewport: DESKTOP, lang: 'he' },
  { id: 'desktop-ru', viewport: DESKTOP, lang: 'ru' },
  { id: 'phone-en', viewport: PHONE, lang: 'en' },
  { id: 'phone-he', viewport: PHONE, lang: 'he' },
];

// Elements whose text must equal the translation for the active language.
// Drives the i18n checks — add a row here when a new translated control lands.
const I18N_BINDINGS = [
  { id: 'i-title', key: 'title' },
  { id: 'i-subtitle', key: 'subtitle' },
  { id: 'quiz-label', key: 'btn_games' },
  { id: 'stories-label', key: 'btn_stories' },
  { id: 'i-btn-hominins', key: 'btn_hominins' },
  { id: 'i-btn-compare', key: 'compare_btn' },
  { id: 'nav-back-label', key: 'nav_back' },
  { id: 'nav-home-label', key: 'nav_home' },
  { id: 'reveal-title', key: 'reveal' },
  { id: 'btn-collapse-all', key: 'collapse_all' },
  { id: 'btn-expand-all', key: 'expand_all' },
  { id: 'i-btn-guided-tour', key: 'btn_guided_tour' },
  { id: 'i-rail-seen', key: 'rail_seen' },
];

// ── Server ────────────────────────────────────────────────────────────────────
async function startServer() {
  if (EXTERNAL_URL) return { url: EXTERNAL_URL.replace(/\/$/, ''), stop: async () => {} };
  const port = Number(process.env.SMOKE_PORT || 5599);
  const child = spawn(process.execPath, [path.join(ROOT, 'serve.js')], {
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore',
  });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(url + '/index.html');
      if (res.ok) break;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  return { url, stop: async () => { child.kill(); } };
}

// ── Check registry ────────────────────────────────────────────────────────────
const checks = [];
/**
 * @param id     stable identifier, used as the baseline key
 * @param title  human-readable description
 * @param fn     (ctx) => void — throw or return a string to fail
 * @param when   optional (scenario) => boolean
 */
const check = (id, title, fn, when = () => true) => checks.push({ id, title, fn, when });

const fail = (msg) => { throw new Error(msg); };
const overlap = (a, b) => !!a && !!b &&
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const overlapArea = (a, b) => {
  if (!overlap(a, b)) return 0;
  return (Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
         (Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
};

// ── load ──────────────────────────────────────────────────────────────────────
check('load:no-page-errors', 'Page loads with no uncaught JS errors', (c) => {
  if (c.pageErrors.length) fail(`${c.pageErrors.length} uncaught error(s): ${c.pageErrors[0]}`);
});

check('load:no-failed-requests', 'No same-origin resource fails to load', (c) => {
  if (c.failedRequests.length) fail(`${c.failedRequests.length} failed: ${c.failedRequests.slice(0, 3).join(', ')}`);
});

check('load:no-render-errors', 'No SVG/console render errors', (c) => {
  const render = c.consoleErrors.filter((e) => /attribute|<path>|<circle>|<g>|NaN/i.test(e));
  if (render.length) fail(`${render.length} render error(s): ${render[0].slice(0, 140)}`);
});

check('load:splash-dismissible', 'Splash screen can be dismissed', (c) => {
  if (!c.probe.splashDismissed) fail('#splash still visible after clicking skip');
});

check('load:critical-elements', 'All critical elements are present', (c) => {
  const missing = c.probe.missingIds;
  if (missing.length) fail(`missing element(s): ${missing.join(', ')}`);
});

check('load:stage-not-blocked', 'Nothing covers the tree stage after load', (c) => {
  const hit = c.probe.centerHit;
  if (!hit) fail('nothing at stage centre');
  if (!hit.inCanvas) fail(`stage centre is covered by <${hit.tag}${hit.id ? '#' + hit.id : ''}${hit.cls ? '.' + hit.cls : ''}>`);
});

// ── tree ──────────────────────────────────────────────────────────────────────
check('tree:has-nodes', 'Tree renders its nodes', (c) => {
  if (c.probe.nodeCount < 20) fail(`only ${c.probe.nodeCount} node(s) rendered`);
});

check('tree:has-branches', 'Tree renders its branches', (c) => {
  if (c.probe.pathCount < 20) fail(`only ${c.probe.pathCount} branch path(s) rendered`);
});

check('tree:no-nan-paths', 'No branch path contains NaN coordinates', (c) => {
  const { nanPaths, pathCount, nanPathSample } = c.probe;
  if (nanPaths) fail(`${nanPaths}/${pathCount} paths have NaN: ${nanPathSample}`);
});

check('tree:no-nan-attributes', 'No rendered element has NaN in its geometry', (c) => {
  const { nanAttrs, nanAttrSample } = c.probe;
  if (nanAttrs) fail(`${nanAttrs} element(s) with NaN attributes: ${nanAttrSample}`);
});

check('tree:fills-stage', 'Tree fills the stage it is given', (c) => {
  const { fillW, fillH } = c.probe;
  const best = Math.max(fillW, fillH);
  if (best < FILL_MIN) fail(`tree fills only ${(fillW * 100) | 0}%×${(fillH * 100) | 0}% of the stage (want ≥${FILL_MIN * 100}% on one axis)`);
});

check('tree:within-stage', 'Tree does not spill off the stage', (c) => {
  const { treeExtent: t, stage } = c.probe;
  if (!t) fail('could not measure the tree');
  const spill = {
    left: Math.max(0, stage.left - t.left),
    top: Math.max(0, stage.top - t.top),
    right: Math.max(0, t.left + t.width - stage.right),
    bottom: Math.max(0, t.top + t.height - stage.bottom),
  };
  const worst = Math.max(spill.left, spill.top, spill.right, spill.bottom);
  const budget = Math.max(16, stage.width * (SPILL_MAX - 1));
  if (worst > budget) {
    const sides = Object.entries(spill).filter(([, v]) => v > budget)
      .map(([k, v]) => `${k} ${Math.round(v)}px`).join(', ');
    fail(`tree spills off the stage: ${sides}`);
  }
});

check('tree:root-visible', 'Root node is on screen', (c) => {
  if (!c.probe.rootOnScreen) fail('root node is outside the viewport');
});

check('tree:no-horizontal-scroll', 'Page does not scroll horizontally', (c) => {
  const { scrollW, clientW } = c.probe;
  if (scrollW > clientW + 1) fail(`document scrolls horizontally (${scrollW} > ${clientW})`);
});

// ── chrome / layout ───────────────────────────────────────────────────────────
check('chrome:header-visible', 'Header is visible', (c) => {
  if (!c.probe.boxes.header) fail('#header is not visible');
});

check('chrome:timeline-visible', 'Timeline is visible', (c) => {
  if (!c.probe.boxes.timeline) fail('#timeline is not visible');
});

check('chrome:reveal-clear-of-zoom', 'Reveal panel does not collide with the zoom controls', (c) => {
  const { reveal, zoom } = c.probe.boxes;
  if (overlap(reveal, zoom)) fail(`#reveal-panel overlaps #zoom-ctrl by ${Math.round(overlapArea(reveal, zoom))}px²`);
});

check('chrome:reveal-clear-of-timeline', 'Reveal panel does not collide with the timeline', (c) => {
  const { reveal, timeline } = c.probe.boxes;
  if (overlap(reveal, timeline)) fail(`#reveal-panel overlaps #timeline by ${Math.round(overlapArea(reveal, timeline))}px²`);
});

check('chrome:reveal-not-covering-tree', 'Reveal panel does not cover the tree', (c) => {
  const { reveal } = c.probe.boxes;
  if (!reveal) return;
  const stageArea = c.probe.win.w * c.probe.win.h;
  const frac = (reveal.width * reveal.height) / stageArea;
  if (frac > 0.18) fail(`#reveal-panel covers ${(frac * 100) | 0}% of the screen`);
}, (s) => s.viewport.name === 'phone');

check('chrome:panel-closed-offscreen', 'Detail panel is off-screen while closed', (c) => {
  // The panel is a right-hand drawer on desktop and a bottom sheet on phones,
  // so measure how much of it actually intrudes on the viewport rather than
  // assuming an edge.
  const { panel, win } = c.probe;
  if (!panel) return;
  const screen = { left: 0, top: 0, right: win.w, bottom: win.h };
  const intruding = overlapArea(panel, screen) / (win.w * win.h);
  if (intruding > 0.02) fail(`#panel covers ${(intruding * 100) | 0}% of the screen while closed`);
});

check('chrome:tooltip-hidden-initially', 'Tooltip is hidden on load', (c) => {
  if (c.probe.boxes.tooltip) fail('#tooltip is visible before any hover');
});

check('chrome:tooltip-clear-of-header', 'Tooltip never overlaps the header', (c) => {
  const { tooltipShown, header } = c.probe;
  if (overlap(tooltipShown, header)) {
    fail(`#tooltip overlaps #header by ${Math.round(overlapArea(tooltipShown, header))}px²`);
  }
});

check('chrome:fact-toast-clear-of-header', 'Fact toast never overlaps the header', (c) => {
  const { factShown, header } = c.probe;
  if (overlap(factShown, header)) {
    fail(`#fact-toast overlaps #header by ${Math.round(overlapArea(factShown, header))}px²`);
  }
});

// ── timeline ──────────────────────────────────────────────────────────────────
check('timeline:era-labels-not-clipped', 'Geological era labels are not clipped', (c) => {
  const clipped = c.probe.eraClipped;
  if (clipped.length) {
    fail(`${clipped.length} clipped label(s): ${clipped.slice(0, 4).map((e) => `${e.txt} (${e.sw}>${e.cw}px)`).join(', ')}`);
  }
});

check('timeline:era-labels-no-overlap', 'Geological era labels do not collide', (c) => {
  const pairs = c.probe.eraOverlaps;
  if (pairs.length) fail(`${pairs.length} colliding label pair(s): ${pairs.slice(0, 3).join(', ')}`);
});

// ── i18n ──────────────────────────────────────────────────────────────────────
check('i18n:document-direction', 'Document direction matches the language', (c) => {
  const want = c.scenario.lang === 'he' ? 'rtl' : 'ltr';
  if (c.probe.dir !== want) fail(`dir="${c.probe.dir}", expected "${want}" for lang=${c.scenario.lang}`);
});

check('i18n:document-lang', 'Document lang attribute matches the language', (c) => {
  if (c.probe.lang !== c.scenario.lang) fail(`lang="${c.probe.lang}", expected "${c.scenario.lang}"`);
});

check('i18n:controls-translated', 'Every bound control shows its translation', (c) => {
  const bad = c.probe.i18nMismatches;
  if (bad.length) {
    fail(`${bad.length} untranslated control(s): ` +
      bad.slice(0, 4).map((b) => `#${b.id} shows "${b.got}" want "${b.want}"`).join('; '));
  }
});

check('i18n:translation-keys-exist', 'Every bound control has a translation key', (c) => {
  const missing = c.probe.i18nMissingKeys;
  if (missing.length) fail(`no "${c.scenario.lang}" translation for key(s): ${missing.join(', ')}`);
});

check('i18n:no-latin-leak', 'No English text leaks into the Hebrew UI', (c) => {
  const leaks = c.probe.latinLeaks;
  if (leaks.length) {
    fail(`${leaks.length} Latin-script string(s) in Hebrew UI: ` +
      leaks.slice(0, 4).map((l) => `${l.where}="${l.txt}"`).join(', '));
  }
}, (s) => s.lang === 'he');

check('i18n:search-placeholder-translated', 'Search placeholder is translated', (c) => {
  const { got, want } = c.probe.searchPlaceholder;
  if (want && got !== want) fail(`placeholder "${got}", expected "${want}"`);
});

// ── interaction ───────────────────────────────────────────────────────────────
check('interact:zoom-controls-work', 'Zoom buttons change the view', (c) => {
  if (!c.probe.zoomWorks) fail('clicking #btn-in did not change the viewport transform');
});

check('interact:reset-refits-tree', 'Reset button re-fits the tree to the stage', (c) => {
  const { fillW, fillH } = c.probe.afterReset;
  const best = Math.max(fillW, fillH);
  if (best < FILL_MIN) fail(`after reset the tree fills only ${(fillW * 100) | 0}%×${(fillH * 100) | 0}%`);
});

check('interact:parent-click-expands', 'Clicking a collapsed parent expands it', (c) => {
  if (!c.probe.parentExpands) fail('clicking a collapsed node revealed no children');
});

check('interact:leaf-click-opens-panel', 'Clicking a leaf opens the detail panel', (c) => {
  if (!c.probe.panelOpened) fail('detail panel did not open after clicking a leaf node');
});

check('interact:search-returns-results', 'Search returns results', (c) => {
  if (c.probe.searchResults < 1) fail('search for "human" returned no results');
});

// ── Probe: everything we can learn from one page, in a few passes ─────────────
async function probePage(page, scenario) {
  // 1. Static DOM facts + i18n
  const base = await page.evaluate(async ({ bindings, lang }) => {
    const T = await import(new URL('js/uiData.js', location.href).href)
      .then((m) => m.TRANSLATIONS).catch(() => null);

    const visible = (el) => {
      if (!el) return false;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.02) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const box = (el) => (visible(el) ? el.getBoundingClientRect().toJSON() : null);
    const byId = (id) => document.getElementById(id);
    const boxOf = (id) => box(byId(id));

    const CRITICAL = ['header', 'svg', 'viewport', 'canvas-wrap', 'timeline', 'zoom-ctrl',
      'search-input', 'panel', 'reveal-panel', 'era-segments', 'tooltip'];
    const missingIds = CRITICAL.filter((id) => !byId(id));

    // Tree geometry. getBoundingClientRect() is clipped to the SVG, which would
    // hide exactly the overflow we care about, so derive the true on-screen
    // extent from the untransformed bbox and the viewport transform instead.
    const vpg = byId('viewport');
    const treeExtent = (() => {
      if (!vpg) return null;
      let bb;
      try { bb = vpg.getBBox(); } catch { return null; }
      if (!bb || !bb.width) return null;
      const m = /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)\s*scale\(\s*(-?[\d.]+)/.exec(
        vpg.getAttribute('transform') || '');
      if (!m) return null;
      const [, tx, ty, s] = m.map(Number);
      const svgR = byId('svg').getBoundingClientRect();
      return {
        left: svgR.left + tx + bb.x * s,
        top: svgR.top + ty + bb.y * s,
        width: bb.width * s,
        height: bb.height * s,
      };
    })();
    const paths = [...document.querySelectorAll('#viewport path')];
    const nanPathEls = paths.filter((p) => /NaN/.test(p.getAttribute('d') || ''));
    const nanAttrEls = [...document.querySelectorAll('#viewport *')].filter((el) =>
      [...el.attributes].some((a) => /NaN/.test(a.value)));

    // The stage is what the tree can actually use: the canvas minus the header,
    // the timeline and the side rail floating over it. Measuring against the
    // raw viewport would score a correctly-fitted tree as too small.
    const sr = (() => {
      const W = innerWidth, H = innerHeight;
      let top = 0, bottom = 0, left = 0, right = 0;
      const h = byId('header');
      if (visible(h)) top = h.getBoundingClientRect().bottom;
      const t = byId('timeline');
      if (visible(t)) bottom = H - t.getBoundingClientRect().top;
      const rail = byId('left-rail');
      if (visible(rail)) {
        const r = rail.getBoundingClientRect();
        if (r.left + r.width / 2 < W / 2) left = r.right; else right = W - r.left;
      }
      return {
        left, top, right: W - right, bottom: H - bottom,
        width: Math.max(120, W - left - right), height: Math.max(120, H - top - bottom),
      };
    })();

    const rootEl = document.querySelector('#viewport g[data-node-id="luca"]');
    const rr = rootEl ? rootEl.getBoundingClientRect() : null;
    const rootOnScreen = !!rr && rr.right > 0 && rr.left < innerWidth && rr.bottom > 0 && rr.top < innerHeight;

    // Era labels in the timeline strip
    const eraEls = [...document.querySelectorAll('#era-segments .era-seg, #era-presets .era-preset')].filter(visible);
    const eraClipped = eraEls
      .filter((e) => e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0)
      .map((e) => ({ txt: (e.textContent || '').trim().slice(0, 24), sw: e.scrollWidth, cw: e.clientWidth }));
    const eraOverlaps = [];
    for (let i = 0; i < eraEls.length; i++) {
      for (let j = i + 1; j < eraEls.length; j++) {
        const a = eraEls[i].getBoundingClientRect(), b = eraEls[j].getBoundingClientRect();
        // Only flag real text collisions, not 1px borders touching.
        if (a.left < b.right - 2 && a.right > b.left + 2 && a.top < b.bottom - 2 && a.bottom > b.top + 2) {
          eraOverlaps.push(`${(eraEls[i].textContent || '').trim().slice(0, 14)}×${(eraEls[j].textContent || '').trim().slice(0, 14)}`);
        }
      }
    }

    // i18n bindings
    const i18nMismatches = [], i18nMissingKeys = [];
    for (const b of bindings) {
      const el = byId(b.id);
      if (!el) continue;
      const want = T && T[lang] ? T[lang][b.key] : undefined;
      if (want === undefined) { i18nMissingKeys.push(b.key); continue; }
      const got = (el.textContent || '').trim();
      if (got !== String(want).trim()) i18nMismatches.push({ id: b.id, got, want: String(want) });
    }

    // Latin-script leak scan over visible chrome text (Hebrew only)
    const latinLeaks = [];
    if (lang === 'he') {
      const ALLOW = /^(luca|dna|rna|ma|ga|mya|3d|2d|\d+(\.\d+)?x?|[0-9\s.,:/×–—-]+)$/i;
      const zones = ['header', 'left-rail', 'search-pill-row', 'nav-ctrl', 'reveal-panel', 'tl-controls'];
      for (const z of zones) {
        const root = byId(z);
        if (!root || !visible(root)) continue;
        for (const el of root.querySelectorAll('*')) {
          if (el.children.length) continue;
          if (!visible(el)) continue;
          // Species names are data, not chrome, and the data is English-only.
          if (el.closest('[data-i18n-exempt]')) continue;
          const txt = (el.textContent || '').trim();
          if (!txt || txt.length < 2) continue;
          if (/[֐-׿]/.test(txt)) continue;      // contains Hebrew — fine
          if (!/[A-Za-z]{2,}/.test(txt)) continue;         // no Latin words — fine
          if (ALLOW.test(txt)) continue;
          latinLeaks.push({ where: `#${z} ${el.tagName.toLowerCase()}`, txt: txt.slice(0, 32) });
        }
      }
    }

    const si = byId('search-input');
    const searchPlaceholder = {
      got: si ? si.placeholder : '',
      want: T && T[lang] ? T[lang].search_ph : '',
    };

    // What is actually at the centre of the stage?
    const cx = sr.left + sr.width / 2, cy = sr.top + sr.height / 2;
    const at = document.elementFromPoint(cx, cy);
    const centerHit = at ? {
      tag: at.tagName.toLowerCase(),
      id: at.id || '',
      cls: typeof at.className === 'string' ? at.className.split(' ')[0] : '',
      inCanvas: !!at.closest('#canvas-wrap'),
    } : null;

    return {
      dir: document.documentElement.dir,
      lang: document.documentElement.lang,
      missingIds,
      splashDismissed: !visible(byId('splash')),
      nodeCount: document.querySelectorAll('#viewport g.node-group').length,
      pathCount: paths.length,
      nanPaths: nanPathEls.length,
      nanPathSample: nanPathEls.length ? (nanPathEls[0].getAttribute('d') || '').slice(0, 80) : '',
      nanAttrs: nanAttrEls.length,
      nanAttrSample: nanAttrEls.length
        ? `<${nanAttrEls[0].tagName}> ` + [...nanAttrEls[0].attributes].filter((a) => /NaN/.test(a.value)).map((a) => a.name).join(',')
        : '',
      fillW: treeExtent && sr.width ? treeExtent.width / sr.width : 0,
      fillH: treeExtent && sr.height ? treeExtent.height / sr.height : 0,
      treeExtent,
      stage: sr,
      rootOnScreen,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      win: { w: innerWidth, h: innerHeight },
      panel: boxOf('panel'),
      header: boxOf('header'),
      boxes: {
        header: boxOf('header'), timeline: boxOf('timeline'), reveal: boxOf('reveal-panel'),
        zoom: boxOf('zoom-ctrl'), tooltip: boxOf('tooltip'),
      },
      eraClipped, eraOverlaps,
      i18nMismatches, i18nMissingKeys, latinLeaks, searchPlaceholder,
      centerHit,
    };
  }, { bindings: I18N_BINDINGS, lang: scenario.lang });

  // 2. Tooltip position — hover the highest node on screen, which is the case
  // most likely to collide with the header. A real hover is used rather than
  // forcing the class, so the positioning code actually runs.
  const hoverPoint = await page.evaluate(() => {
    let best = null;
    for (const g of document.querySelectorAll('#viewport g.node-group')) {
      const c = g.querySelector('circle');
      if (!c) continue;
      const r = c.getBoundingClientRect();
      if (!r.width || r.top < 0) continue;
      if (!best || r.top < best.top) best = { top: r.top, x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return best;
  });
  let tooltipShown = null;
  if (hoverPoint) {
    await page.mouse.move(hoverPoint.x, hoverPoint.y);
    await page.waitForTimeout(900);
    tooltipShown = await page.evaluate(() => {
      const el = document.getElementById('tooltip');
      if (!el || !el.classList.contains('visible')) return null;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 ? r.toJSON() : null;
    });
    await page.mouse.move(4, Math.round(page.viewportSize().height / 2));
    await page.waitForTimeout(200);
  }

  // The fact toast is positioned purely by CSS, so forcing it visible is a
  // faithful way to measure where it would land.
  const forced = await page.evaluate(() => {
    const el = document.getElementById('fact-toast');
    if (!el) return { factShown: null };
    const prev = { cls: el.className, style: el.getAttribute('style') || '' };
    el.classList.add('show', 'visible');
    el.style.opacity = '1';
    const r = el.getBoundingClientRect();
    const out = r.width > 0 && r.height > 0 ? r.toJSON() : null;
    el.className = prev.cls;
    el.setAttribute('style', prev.style);
    return { factShown: out };
  });

  // 3. Interactions
  let zoomWorks = false, panelOpened = false, searchResults = 0;
  const before = await page.getAttribute('#viewport', 'transform');
  await page.click('#btn-in').catch(() => {});
  await page.waitForTimeout(300);
  zoomWorks = (await page.getAttribute('#viewport', 'transform')) !== before;

  await page.click('#btn-reset').catch(() => {});
  await page.waitForTimeout(700);
  const afterReset = await page.evaluate(() => {
    const vpg = document.getElementById('viewport');
    const bb = vpg.getBBox();
    const m = /scale\(\s*(-?[\d.]+)/.exec(vpg.getAttribute('transform') || '');
    const s = m ? Number(m[1]) : 1;
    // Same usable-stage definition as the main probe.
    const W = innerWidth, H = innerHeight;
    const seen = (el) => el && el.getBoundingClientRect().height > 0 &&
      getComputedStyle(el).display !== 'none';
    const h = document.getElementById('header'), t = document.getElementById('timeline');
    const rail = document.getElementById('left-rail');
    let top = seen(h) ? h.getBoundingClientRect().bottom : 0;
    let bottom = seen(t) ? H - t.getBoundingClientRect().top : 0;
    let left = 0, right = 0;
    if (seen(rail)) {
      const r = rail.getBoundingClientRect();
      if (r.left + r.width / 2 < W / 2) left = r.right; else right = W - r.left;
    }
    return {
      fillW: (bb.width * s) / Math.max(120, W - left - right),
      fillH: (bb.height * s) / Math.max(120, H - top - bottom),
    };
  });

  // Parents expand on click, leaves open the detail panel — exercise both.
  // aria-expanded is only set on nodes that have children, so its absence
  // identifies a leaf. Aim at the node's circle: a <g> bounding box spans the
  // icon *and* its label, so its centre is often empty space.
  const clickNode = async (selector) => {
    const pt = await page.evaluate((sel) => {
      // Take the first candidate that a user could actually click: on screen,
      // and not sitting under a panel. Otherwise the click lands on the chrome
      // and the check fails for a reason that has nothing to do with nodes.
      for (const g of document.querySelectorAll(sel)) {
        const target = g.querySelector('circle') || g;
        const r = target.getBoundingClientRect();
        if (!r.width) continue;
        const x = r.x + r.width / 2, y = r.y + r.height / 2;
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
        const hit = document.elementFromPoint(x, y);
        if (!hit || !hit.closest('#viewport')) continue;
        return { x, y };
      }
      return null;
    }, selector);
    if (!pt) return false;
    await page.mouse.click(pt.x, pt.y);
    await page.waitForTimeout(900);
    return true;
  };

  const nodesBefore = await page.locator('#viewport g.node-group').count();
  await clickNode('#viewport g.node-group[aria-expanded="false"]');
  const parentExpands = (await page.locator('#viewport g.node-group').count()) > nodesBefore;

  await clickNode('#viewport g.node-group:not([aria-expanded])');
  panelOpened = await page.evaluate(() => {
    const p = document.getElementById('panel');
    if (!p) return false;
    const r = p.getBoundingClientRect();
    const onScreen = r.right > 8 && r.left < innerWidth - 8 && r.top < innerHeight - 8 && r.bottom > 8;
    return onScreen && r.width > 0;
  });
  await page.click('#panel-close').catch(() => {});
  await page.waitForTimeout(400);

  await page.fill('#search-input', 'human').catch(() => {});
  await page.waitForTimeout(700);
  searchResults = await page.evaluate(() =>
    document.querySelectorAll('#search-results .sr-item, #search-results > *').length);
  await page.fill('#search-input', '').catch(() => {});

  return { ...base, ...forced, tooltipShown, zoomWorks, afterReset, parentExpands, panelOpened, searchResults };
}

// ── Runner ────────────────────────────────────────────────────────────────────
async function runScenario(browser, scenario, baseUrl) {
  const ctx = await browser.newContext({
    viewport: { width: scenario.viewport.width, height: scenario.viewport.height },
    isMobile: scenario.viewport.isMobile,
    hasTouch: scenario.viewport.hasTouch,
    deviceScaleFactor: scenario.viewport.deviceScaleFactor || 1,
    locale: scenario.lang === 'he' ? 'he-IL' : scenario.lang === 'ru' ? 'ru-RU' : 'en-US',
  });

  // Seed preferences so the run is deterministic: chosen language, no guided
  // tour modal, no idle nudges.
  await ctx.addInitScript((lang) => {
    localStorage.setItem('tol-lang', lang);
    localStorage.setItem('tol-tour-done', '1');
    localStorage.setItem('tol-splash-seen', '1');
  }, scenario.lang);

  const page = await ctx.newPage();
  const pageErrors = [], consoleErrors = [], failedRequests = [];
  page.on('pageerror', (e) => pageErrors.push(String(e && e.message ? e.message : e)));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('requestfailed', (r) => {
    // Only same-origin resources — third-party CDNs are out of our control and
    // the page is designed to work without them.
    if (r.url().startsWith(baseUrl)) failedRequests.push(r.url().replace(baseUrl, ''));
  });
  page.on('response', (r) => {
    if (r.url().startsWith(baseUrl) && r.status() >= 400) {
      failedRequests.push(`${r.status()} ${r.url().replace(baseUrl, '')}`);
    }
  });

  await page.goto(baseUrl + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.click('#splash-skip', { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(2200);

  if (KEEP_SHOTS) {
    await page.screenshot({ path: path.join(OUT_DIR, `${scenario.id}.png`), fullPage: false });
  }

  const probe = await probePage(page, scenario);
  const c = { probe, scenario, pageErrors, consoleErrors, failedRequests, page };

  const results = [];
  for (const chk of checks) {
    if (!chk.when(scenario)) continue;
    const key = `${scenario.id}/${chk.id}`;
    try {
      const r = await chk.fn(c);
      if (typeof r === 'string') results.push({ key, id: chk.id, title: chk.title, ok: false, msg: r });
      else results.push({ key, id: chk.id, title: chk.title, ok: true });
    } catch (e) {
      results.push({ key, id: chk.id, title: chk.title, ok: false, msg: e.message });
    }
  }

  await ctx.close();
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const server = await startServer();
await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

let baseline = { known: {} };
if (existsSync(BASELINE_PATH)) {
  baseline = JSON.parse(await readFile(BASELINE_PATH, 'utf8'));
}

const browser = await chromium.launch(
  PROXY ? { proxy: { server: PROXY, bypass: 'localhost,127.0.0.1' } } : {});
if (PROXY) process.stdout.write(`Routing Chromium through ${PROXY}\n`);
let all = [];
try {
  for (const scenario of SCENARIOS) {
    process.stdout.write(`\n▸ ${scenario.id}\n`);
    const results = await runScenario(browser, scenario, server.url);
    all = all.concat(results);
    for (const r of results) {
      const known = Object.prototype.hasOwnProperty.call(baseline.known, r.key);
      const mark = r.ok ? (known ? '🎉' : '✅') : (known ? '📌' : '❌');
      const suffix = r.ok
        ? (known ? '  ← now passing, remove from baseline' : '')
        : `  ${r.msg}`;
      process.stdout.write(`  ${mark} ${r.id}${suffix}\n`);
    }
  }
} finally {
  await browser.close();
  await server.stop();
}

// ── Verdict ───────────────────────────────────────────────────────────────────
const failures = all.filter((r) => !r.ok);
const unexpectedFailures = failures.filter((r) => !Object.prototype.hasOwnProperty.call(baseline.known, r.key));
const fixedButBaselined = all.filter((r) => r.ok && Object.prototype.hasOwnProperty.call(baseline.known, r.key));

if (UPDATE_BASELINE) {
  const known = {};
  for (const r of failures) known[r.key] = r.msg.slice(0, 200);
  await writeFile(BASELINE_PATH, JSON.stringify({
    _comment: 'Known-failing smoke checks. Each entry is a bug we have seen and not yet fixed. ' +
      'Remove an entry when its fix lands — the run fails if a baselined check starts passing. ' +
      'Regenerate with: node scripts/smoke.mjs --update-baseline',
    known,
  }, null, 2) + '\n');
  process.stdout.write(`\nBaseline updated: ${Object.keys(known).length} known failure(s) recorded.\n`);
  process.exit(0);
}

const passed = all.length - failures.length;
process.stdout.write(`\n${'─'.repeat(60)}\n`);
process.stdout.write(`${passed}/${all.length} checks passed across ${SCENARIOS.length} scenarios.\n`);
if (failures.length) process.stdout.write(`${failures.length - unexpectedFailures.length} known issue(s) still open (baselined).\n`);

if (unexpectedFailures.length) {
  process.stdout.write(`\n❌ ${unexpectedFailures.length} NEW failure(s):\n`);
  for (const r of unexpectedFailures) process.stdout.write(`   ${r.key}\n     ${r.msg}\n`);
}
if (fixedButBaselined.length) {
  process.stdout.write(`\n🎉 ${fixedButBaselined.length} baselined check(s) now pass — remove them from scripts/smoke-baseline.json:\n`);
  for (const r of fixedButBaselined) process.stdout.write(`   ${r.key}\n`);
}

if (unexpectedFailures.length || fixedButBaselined.length) process.exit(1);
process.stdout.write('\n✅ Smoke checks green.\n');
