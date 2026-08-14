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
import { existsSync, readFileSync } from 'node:fs';
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
  /* The light theme is a whole second palette, and a dark-first design fails
     there quietly: the reveal panel painted itself near-black while its text
     followed the theme, so "Collapse All" sat at a contrast ratio of 1.15 —
     in the DOM, invisible on screen. Loaded rather than toggled at runtime,
     because the theme switch also rebuilds the era strip and the density
     curve in JS, and half-applying it measures a page nobody sees. */
  { id: 'desktop-en-light', viewport: DESKTOP, lang: 'en', theme: 'light' },
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

check('load:no-csp-violations', 'Content-Security-Policy blocks nothing the page needs', (c) => {
  const v = c.probe.cspViolations;
  if (v.length) fail(`${v.length} CSP violation(s): ${v.slice(0, 3).join('; ')}`);
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

check('tree:labels-on-screen', 'No rendered label hangs off the stage', (c) => {
  const off = c.probe.labelsOffStage || [];
  if (off.length) fail(`${off.length} label(s) outside the stage: ${off.slice(0, 3).join('; ')}`);
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

check('chrome:no-stretched-overlay', 'No floating control stretches across the window', (c) => {
  const s = c.probe.stretchedChrome || [];
  if (s.length) fail(`${s.length} floating element(s) span the window: ${s.join(', ')}`);
});

check('chrome:tooltip-hidden-initially', 'Tooltip is hidden on load', (c) => {
  if (c.probe.boxes.tooltip) fail('#tooltip is visible before any hover');
});

check('chrome:tooltip-never-covers-its-node', 'Tooltip does not hide the node it describes', (c) => {
  if (c.probe.tooltipCoversNode) fail('tooltip overlaps the hovered node near the trailing edge');
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

check('i18n:taxon-labels-translated', 'Major taxonomic groups are labelled in the active language', (c) => {
  const { taxonLabels } = c.probe;
  if (!taxonLabels.checked) return; // none of the sample groups on screen
  if (taxonLabels.untranslated.length) {
    fail(`${taxonLabels.untranslated.length} group(s) still showing English: ` +
      taxonLabels.untranslated.slice(0, 4).map((t) => `${t.id}="${t.got}" want "${t.want}"`).join(', '));
  }
}, (s) => s.lang !== 'en');

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

check('interact:expand-all-refits', 'Expand All reframes the tree it just revealed', (c) => {
  const { fillW, fillH, spill, clicked } = c.probe.afterExpandAll;
  if (!clicked) fail('could not click #btn-expand-all — it is covered or unreachable');
  const best = Math.max(fillW, fillH);
  if (best < FILL_MIN) fail(`after Expand All the tree fills only ${(fillW * 100) | 0}%×${(fillH * 100) | 0}%`);
  if (spill > 24) fail(`after Expand All the tree spills ${Math.round(spill)}px off the stage`);
});

// Desktop only. On a phone the panel is a bottom sheet covering ~80% of the
// screen, so there is no lane a toast could occupy without touching it — that
// is a panel-design question, not a positioning bug.
check('chrome:toast-clear-of-panel', 'Toasts never cover the detail panel', (c) => {
  const { toastBox, panelOpenBox } = c.probe;
  if (overlap(toastBox, panelOpenBox)) {
    fail(`#achievement-container overlaps the open #panel by ${Math.round(overlapArea(toastBox, panelOpenBox))}px²`);
  }
}, (s) => s.viewport.name === 'desktop');

check('interact:parent-click-expands', 'Clicking a collapsed parent expands it', (c) => {
  if (!c.probe.parentExpands) fail('clicking a collapsed node revealed no children');
});

check('interact:leaf-click-opens-panel', 'Clicking a leaf opens the detail panel', (c) => {
  if (!c.probe.panelOpened) fail('detail panel did not open after clicking a leaf node');
});

check('i18n:panel-prose-reads-as-english', 'English species prose is laid out left-to-right', (c) => {
  const p = c.probe.panelProse;
  if (!p || !p.checked) return;
  if (p.wrong.length) fail(`${p.wrong.length} English block(s) laid out RTL: ${p.wrong.join(', ')}`);
});

check('a11y:text-contrast', 'Text meets AA contrast against its background', (c) => {
  const { theme, hits } = c.probe.contrast || { theme: '?', hits: [] };
  if (hits.length) fail(`${hits.length} element(s) below AA in the ${theme} theme: ${hits.slice(0, 4).join(', ')}`);
});

check('chrome:panel-hero-readable', 'Nothing is printed over the species name', (c) => {
  const h = c.probe.heroOverlaps;
  if (!h || !h.checked) return;
  if (h.hits.length) fail(`hero artwork overlaps ${h.hits.length} caption line(s): ${h.hits.join(', ')}`);
});

check('panel:hero-photo-loads', 'The species panel shows its photograph', (c) => {
  const h = c.probe.heroPhoto;
  if (!h || !h.checked) return;
  // Nothing to assert where the host cannot be reached — see wikimediaReachable().
  if (c.probe.photoHostReachable === false) return;
  if (!h.present) { fail('the panel rendered no hero image element at all'); return; }
  if (!h.loaded) fail(`the hero photograph did not load, so the panel fell back to an emoji: ${h.src}`);
  else if (!h.shown) fail('the hero photograph loaded but is not displayed');
});

check('search:finds-the-obvious-answer', 'Common searches return the thing meant', (c) => {
  const s = c.probe.searchQuality;
  if (!s) return;
  if (s.wrong.length) fail(`${s.wrong.length} search(es) wrong: ${s.wrong.join('; ')}`);
}, (sc) => sc.lang === 'en');

check('search:aliases-resolve', 'Every common-name alias still matches something', (c) => {
  const s = c.probe.searchQuality;
  if (!s) return;
  if (s.dead.length) fail(`${s.dead.length} alias(es) match nothing: ${s.dead.join(', ')}`);
});

check('interact:camera-settles', 'Camera animations come to rest', (c) => {
  if (!c.probe.cameraSettles) fail('#viewport transform was still changing after 3s');
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
    const DATA = await import(new URL('js/data.js', location.href).href);
    const LAYOUT = await import(new URL('js/layout.js', location.href).href);
    const METRICS = await import(new URL('js/labelMetrics.js', location.href).href);
    const ZOOM = await import(new URL('js/zoom.js', location.href).href);

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
    // From layout coordinates, not getBBox(): the renderer culls off-screen
    // nodes, so the drawn box describes only what is already visible and would
    // score a badly-framed tree as perfectly framed.
    const treeExtent = (() => {
      if (!vpg) return null;
      const m = /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)\s*scale\(\s*(-?[\d.]+)/.exec(
        vpg.getAttribute('transform') || '');
      if (!m) return null;
      const [, tx, ty, s] = m.map(Number);
      // Through the app's own footprint module, so this measures the box the
      // camera claims to have framed. Whether that box matches the pixels the
      // renderer actually puts on screen is a separate question, and
      // tree:labels-on-screen below is the one that asks it.
      const nodeR = innerWidth < 768 ? 22 : 26;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const n of LAYOUT.getVisible(DATA.TREE)) {
        if (!Number.isFinite(n._x) || !Number.isFinite(n._y)) continue;
        const e = METRICS.nodeFootprint(n, { nodeR });
        minX = Math.min(minX, n._x - e.left); maxX = Math.max(maxX, n._x + e.right);
        minY = Math.min(minY, n._y - e.up);   maxY = Math.max(maxY, n._y + e.down);
      }
      if (!Number.isFinite(minX)) return null;
      const svgR = byId('svg').getBoundingClientRect();
      return {
        left: svgR.left + tx + minX * s,
        top: svgR.top + ty + minY * s,
        width: (maxX - minX) * s,
        height: (maxY - minY) * s,
      };
    })();
    const paths = [...document.querySelectorAll('#viewport path')];
    const nanPathEls = paths.filter((p) => /NaN/.test(p.getAttribute('d') || ''));
    const nanAttrEls = [...document.querySelectorAll('#viewport *')].filter((el) =>
      [...el.attributes].some((a) => /NaN/.test(a.value)));

    /* The stage is what the tree can actually use: the canvas minus the chrome
       floating over it. Read from the app rather than re-derived here — a
       second copy of this arithmetic would drift, and the chrome checks below
       already police where those panels sit, each measured directly. */
    const sr = (() => {
      const g = ZOOM.getStageRect();
      return {
        left: g.x, top: g.y, right: g.x + g.w, bottom: g.y + g.h,
        width: g.w, height: g.h,
      };
    })();

    /* What the renderer actually put on screen, as opposed to what the camera
       reserved room for. Labels are the part that escapes: a name is drawn a
       fixed distance out along its branch and can be several times wider than
       the disc it belongs to, so an under-estimate anywhere in the metrics
       shows up here as text hanging off the edge of the stage. */
    const labelsOffStage = [];
    for (const el of document.querySelectorAll('#viewport text.node-label-name')) {
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      const over = Math.max(sr.left - r.left, r.right - sr.right, sr.top - r.top, r.bottom - sr.bottom);
      if (over > 4) labelsOffStage.push(`${(el.textContent || '').slice(0, 24)} by ${Math.round(over)}px`);
    }

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

    const cspViolations = [...new Set(window.__cspViolations || [])];

    // Major taxonomic groups must render their localised name in the tree.
    /* Floating chrome that has stretched across the window. A fixed element
       with both physical edges pinned and no width fills the screen: an
       invisible sheet over the map that dims what is under it and swallows
       every click. It happens whenever an `!important` physical offset meets
       an RTL override that cannot release it, which is why this is measured
       rather than trusted — the elements still look fine in LTR. */
    const stretchedChrome = [...document.querySelectorAll('body > *')]
      .filter((el) => {
        const s = getComputedStyle(el);
        if (s.position !== 'fixed' && s.position !== 'absolute') return false;
        if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) < 0.02) return false;
        // Both edges pinned and no width of its own: the box can only stretch.
        if (s.left === 'auto' || s.right === 'auto' || s.width !== 'auto') return false;
        const r = el.getBoundingClientRect();
        // A control that happens to be as wide as its contents is fine; this is
        // about boxes dragged open by the cascade.
        return r.width > Math.min(360, innerWidth * 0.4);
      })
      .map((el) => `${el.id || el.tagName}:${Math.round(el.getBoundingClientRect().width)}px`);

    // Species deliberately stay English, so only ranked groups are checked.
    const TAXA = await import(new URL('js/taxonNames.js', location.href).href)
      .then((m) => m.TAXON_NAMES).catch(() => null);
    const taxonLabels = { checked: false, untranslated: [] };
    if (TAXA && TAXA[lang]) {
      for (const g of document.querySelectorAll('#viewport g.node-group')) {
        const id = g.getAttribute('data-node-id');
        const want = TAXA[lang][id];
        if (!want) continue;
        // Not just any <text>: a node group also holds the collapse-count
        // badge, which would match first and always look "untranslated".
        const label = g.querySelector('text.node-label-name');
        if (!label || !visible(label)) continue;
        taxonLabels.checked = true;
        const got = (label.textContent || '').trim();
        if (got !== want) taxonLabels.untranslated.push({ id, got, want });
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
      centerHit, cspViolations, taxonLabels, stretchedChrome, labelsOffStage,
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

  /* And again on the node nearest the trailing edge, where there is no room to
     the side the tooltip prefers. It used to slide back over the cursor rather
     than flip, so hovering anything near that edge hid the very node being
     described — worse once the fun fact arrived and the box grew. */
  const edgePoint = await page.evaluate(() => {
    let best = null;
    for (const g of document.querySelectorAll('#viewport g.node-group')) {
      const c = g.querySelector('circle');
      if (!c) continue;
      const r = c.getBoundingClientRect();
      if (!r.width || r.top < 0 || r.bottom > innerHeight) continue;
      if (!best || r.left > best.left) best = { left: r.left, x: r.x + r.width / 2, y: r.y + r.height / 2, r: r.width / 2 };
    }
    return best;
  });
  let tooltipCoversNode = false;
  if (edgePoint) {
    await page.mouse.move(edgePoint.x, edgePoint.y);
    await page.waitForTimeout(900);
    tooltipCoversNode = await page.evaluate((t) => {
      const el = document.getElementById('tooltip');
      if (!el || !el.classList.contains('visible')) return false;
      const r = el.getBoundingClientRect();
      if (!r.width) return false;
      return r.left < t.x + t.r && r.right > t.x - t.r && r.top < t.y + t.r && r.bottom > t.y - t.r;
    }, edgePoint);
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
        return { x, y, id: g.getAttribute('data-node-id') };
      }
      return null;
    }, selector);
    if (!pt) return null;
    await page.mouse.click(pt.x, pt.y);
    await page.waitForTimeout(900);
    return pt.id;
  };

  // Ask the node itself, not the total rendered count: framing the new subtree
  // culls nodes elsewhere, so the total can fall even when the click worked.
  const expandedId = await clickNode('#viewport g.node-group[aria-expanded="false"]');
  const parentExpands = expandedId ? await page.evaluate((id) => {
    const g = document.querySelector(`#viewport g.node-group[data-node-id="${id}"]`);
    return !!g && g.getAttribute('aria-expanded') === 'true';
  }, expandedId) : false;

  await clickNode('#viewport g.node-group:not([aria-expanded])');
  panelOpened = await page.evaluate(() => {
    const p = document.getElementById('panel');
    if (!p) return false;
    const r = p.getBoundingClientRect();
    const onScreen = r.right > 8 && r.left < innerWidth - 8 && r.top < innerHeight - 8 && r.bottom > 8;
    return onScreen && r.width > 0;
  });
  /* Search relevance. This was ranking over one blended haystack of name,
     Latin name, tags and id, so a hit anywhere scored the same: "human"
     returned Koala, Hominini and Sea urchin and never Homo sapiens, and
     "whale" put Hippopotamus first. These are the words a visitor actually
     types; the expected answer is the one a person would call correct. */
  const searchQuality = await page.evaluate(async () => {
    const m = await import(new URL('js/search.js', location.href).href);
    const st = await import(new URL('js/state.js', location.href).href);
    const CASES = [
      ['human', 'Homo sapiens'], ['whale', 'Blue whale'], ['tiger', 'Tiger'],
      ['cat', 'Lion'], ['snake', 'King cobra'], ['bear', 'Polar bear'],
      ['oak', 'Oak'], ['elephent', 'African elephant'],
    ];
    const wrong = [];
    for (const [q, want] of CASES) {
      const top = (m.searchEntities(q)[0] || {}).name || '(nothing)';
      if (top !== want) wrong.push(`${q} → ${top}, wanted ${want}`);
    }
    // Every alias must still point at something that exists.
    const names = st.state.searchIndex.map((x) => (x.name || '').toLowerCase());
    const dead = (m.SEARCH_ALIASES || [])
      .filter((a) => !names.some((n) => a.match.test(n)))
      .map((a) => a.words[0]);
    return { wrong, dead };
  });

  /* Contrast, in both themes. Colour is where a dark-first design quietly
     fails: the reveal panel painted itself near-black while its text followed
     the theme, so in light mode "Collapse All" sat at a ratio of 1.15 — present
     in the DOM, invisible on screen. Measured against the effective background
     (walking up through transparent ancestors), to the WCAG AA thresholds.
     Text that is only emoji is skipped: it carries its own colours. */
  const contrast = await page.evaluate(() => {
    const parse = (c) => { const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null;
      const [r, g, b, a] = m[1].split(',').map(Number); return { r, g, b, a: a === undefined ? 1 : a }; };
    const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
    const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
    const effBg = (el) => {
      let cur = el, acc = null;
      while (cur) {
        const c = parse(getComputedStyle(cur).backgroundColor);
        if (c && c.a > 0.02) { acc = acc ? over(acc, c) : c; if (c.a >= 0.99) return over(acc, { r: 255, g: 255, b: 255, a: 1 }); }
        cur = cur.parentElement;
      }
      return { r: 20, g: 20, b: 20, a: 1 };
    };
    const EMOJI_ONLY = /^[\p{Extended_Pictographic}\p{Emoji_Component}\s\u200d\ufe0f]+$/u;
    const sweep = () => {
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        const txt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('').trim();
        if (txt.length < 2 || EMOJI_ONLY.test(txt)) continue;
        const st = getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) < 0.15) continue;
        const r = el.getBoundingClientRect();
        // Off-screen and clipped affordances — skip links park above the
        // viewport until focused, and 1px boxes are for screen readers.
        if (r.width < 10 || r.height < 8) continue;
        if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) continue;
        const fg = parse(st.color); if (!fg) continue;
        const bg = effBg(el);
        const cr = ratio(over(fg, bg), bg);
        const big = parseFloat(st.fontSize) >= 24 || (parseFloat(st.fontSize) >= 18.66 && parseInt(st.fontWeight, 10) >= 700);
        if (cr < (big ? 3 : 4.5)) out.push(`${txt.slice(0, 18)} (${cr.toFixed(2)})`);
      }
      return out;
    };
    return { theme: document.documentElement.getAttribute('data-theme') || 'dark', hits: sweep() };
  });

  /* Species prose is English by policy, so it has to be laid out as English.
     In an RTL paragraph the trailing punctuation of a Latin sentence is
     reordered to the far end — "…that nourish colon .cells" — which is how
     this was found. The panel body therefore carries its own dir. */
  const panelProse = await page.evaluate(() => {
    const body = document.querySelector('#panel .panel-body');
    if (!body) return { checked: false, wrong: [] };
    const wrong = [];
    if (getComputedStyle(body).direction !== 'ltr') wrong.push('.panel-body');
    for (const el of body.querySelectorAll('.p-desc, .p-detail, .panel-funfact-text')) {
      if (getComputedStyle(el).direction !== 'ltr') wrong.push(el.className);
    }
    return { checked: true, wrong };
  });

  /* The hero caption used to be absolutely positioned inside a fixed-ratio box,
     so a long binomial over a wrapped time-of-life line overran the artwork and
     the species emoji printed straight through its own name. Measured rather
     than trusted, because it only showed up at narrow widths. */
  /* Does the hero photograph actually arrive? The panel resolves a 1280px cut
     and falls back to the species emoji on error, so a dead URL degrades
     silently to something that looks deliberate. The whole point of recording
     two widths per species is this image; nothing asserted it was reachable.

     naturalWidth is the test: a src that 404s leaves it at 0. Runs in CI,
     where upload.wikimedia.org is reachable — it cannot be checked from the
     development sandbox, which is exactly why it needs to be checked here. */
  const heroPhoto = await page.evaluate(async () => {
    const root = document.querySelector('#panel.open');
    if (!root) return { checked: false };
    const img = root.querySelector('.panel-hero img');
    if (!img) return { checked: true, present: false };
    const src = img.getAttribute('src') || '';
    if (!src) return { checked: true, present: false };
    if (!img.complete) {
      await new Promise((r) => {
        const done = () => r();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 8000);
      });
    }
    return {
      checked: true, present: true, src,
      loaded: img.naturalWidth > 0,
      shown: getComputedStyle(img).display !== 'none',
    };
  });

  const heroOverlaps = await page.evaluate(() => {
    const root = document.querySelector('#panel.open');
    if (!root) return { checked: false, hits: [] };
    const meta = root.querySelector('.panel-hero-meta');
    if (!meta) return { checked: false, hits: [] };
    const R = (e) => e && e.getBoundingClientRect();
    const hit = (a, b) => a && b && a.width && b.width && a.top < b.bottom - 1 && a.bottom > b.top + 1;
    const art = [root.querySelector('.panel-hero-fb'), root.querySelector('.panel-hero-fallback'),
                 root.querySelector('.panel-hero-credit')].filter(Boolean).map(R);
    const hits = [];
    for (const line of meta.children) {
      const lr = R(line);
      for (const a of art) if (hit(lr, a)) hits.push((line.className || line.tagName) + '');
    }
    return { checked: true, hits: [...new Set(hits)] };
  });

  // Toast lane: force one open alongside the detail panel and compare boxes.
  const { toastBox, panelOpenBox } = await page.evaluate(() => {
    const c = document.getElementById('achievement-container');
    const p = document.getElementById('panel');
    if (!c || !p) return { toastBox: null, panelOpenBox: null };
    const probe = document.createElement('div');
    probe.className = 'achievement-toast';
    probe.innerHTML = '<div class="at-icon">*</div><div class="at-body">' +
      '<div class="at-title">Achievement unlocked</div><div class="at-name">Layout probe</div></div>';
    c.appendChild(probe);
    const boxes = { toastBox: c.getBoundingClientRect().toJSON(), panelOpenBox: p.getBoundingClientRect().toJSON() };
    probe.remove();
    return boxes;
  });
  await page.click('#panel .p-close').catch(() => {});
  await page.waitForTimeout(600);


  await page.fill('#search-input', 'human').catch(() => {});
  await page.waitForTimeout(700);
  searchResults = await page.evaluate(() =>
    document.querySelectorAll('#search-results .sr-item, #search-results > *').length);
  await page.fill('#search-input', '').catch(() => {});

  // Expand All reveals every species at once — the camera has to follow.
  // Measured from layout coordinates, not getBBox(): the renderer culls
  // off-screen nodes, so the drawn bounding box only ever describes what is
  // already visible and would report a badly-framed tree as perfectly framed.
  // The label allowance here is deliberately more generous than the one the
  // fit uses, so this still catches real framing errors.
  const measureFit = () => page.evaluate(async () => {
    const { TREE } = await import(new URL('js/data.js', location.href).href);
    const { getVisible } = await import(new URL('js/layout.js', location.href).href);
    const vpg = document.getElementById('viewport');
    const m = /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)\s*scale\(\s*(-?[\d.]+)/
      .exec(vpg.getAttribute('transform') || '');
    if (!m) return { fillW: 0, fillH: 0, spill: 0 };
    const [, tx, ty, s] = m.map(Number);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of getVisible(TREE)) {
      if (!Number.isFinite(n._x) || !Number.isFinite(n._y)) continue;
      const r = n.r || 12;
      const fs = n.depth === 0 ? 14 : n.depth === 1 ? 12 : 10;
      const half = Math.max(r, (n.name || '').length * fs * 0.55);
      minX = Math.min(minX, n._x - half); maxX = Math.max(maxX, n._x + half);
      minY = Math.min(minY, n._y - r);    maxY = Math.max(maxY, n._y + r + 26);
    }
    if (!Number.isFinite(minX)) return { fillW: 0, fillH: 0, spill: 0 };

    const left = tx + minX * s, top = ty + minY * s;
    const w = (maxX - minX) * s, h = (maxY - minY) * s;
    const H = document.getElementById('header');
    const T = document.getElementById('timeline');
    const topInset = H ? H.getBoundingClientRect().bottom : 0;
    const botInset = T ? innerHeight - T.getBoundingClientRect().top : 0;
    const stageW = innerWidth, stageH = Math.max(120, innerHeight - topInset - botInset);
    return {
      fillW: w / stageW, fillH: h / stageH,
      spill: Math.max(0, -left, topInset - top, left + w - stageW,
                      top + h - (innerHeight - botInset)),
    };
  });

  // The detail panel is a right-hand drawer that covers the reveal controls on
  // desktop, so make sure it is really shut before reaching for them — and do
  // not swallow the click, or a missed click looks like a framing failure.
  // Belt and braces: the panel covers the reveal controls on desktop, so make
  // certain it is shut before reaching for them.
  await page.click('#panel .p-close').catch(() => {});
  await page.waitForTimeout(600);
  let expandAllClicked = true;
  try {
    await page.click('#btn-expand-all', { timeout: 8000 });
  } catch {
    expandAllClicked = false;
  }
  await page.waitForTimeout(2600);
  const afterExpandAll = { ...(await measureFit()), clicked: expandAllClicked };
  await page.click('#btn-collapse-all', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1800);


  // Every camera animation must come to rest. An eased loop that never settles
  // reads as jitter and quietly burns a frame budget forever, and stage 03
  // adds enough motion that "it looked fine" is not evidence.
  await page.click('#btn-reset').catch(() => {});
  const cameraSettles = await page.evaluate(() => new Promise((resolve) => {
    const vp = document.getElementById('viewport');
    let last = vp.getAttribute('transform');
    let stableFor = 0;
    const started = Date.now();
    const tick = () => {
      const now = vp.getAttribute('transform');
      stableFor = now === last ? stableFor + 1 : 0;
      last = now;
      if (stableFor >= 12) return resolve(true);          // ~200ms unchanged
      if (Date.now() - started > 3000) return resolve(false);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }));

  // Read CSP violations last: inline event handlers are only evaluated when
  // they fire, so blocking them shows up during the interactions above rather
  // than on load. This supersedes the value collected in the first pass.
  const cspViolations = [...new Set(await page.evaluate(() => window.__cspViolations || []))];

  return { ...base, ...forced, tooltipShown, tooltipCoversNode, zoomWorks, afterReset, parentExpands, panelOpened, panelProse, heroOverlaps, heroPhoto, photoHostReachable: await wikimediaReachable(), contrast, searchQuality,
           searchResults, afterExpandAll, toastBox, panelOpenBox, cameraSettles, cspViolations };
}


// ── Static checks (no browser needed) ────────────────────────────────────────
/* An undefined custom property does not throw — the declaration is dropped and
   the element silently loses that style. That is how a glow ring kept being
   painted with `var(--gold)` for months after --gold was renamed to --accent.
   Catch it in CI rather than by eye. */
async function staticChecks() {
  const { readdir } = await import('node:fs/promises');
  const cssDir = path.join(ROOT, 'css');
  const jsDir = path.join(ROOT, 'js');
  // stories/ is same-origin, so it is served the same policy as the app and
  // has to obey the same rules.
  const storyDir = path.join(ROOT, 'stories');
  const files = [
    ...(await readdir(cssDir)).filter((f) => f.endsWith('.css')).map((f) => path.join(cssDir, f)),
    ...(await readdir(jsDir)).filter((f) => f.endsWith('.js')).map((f) => path.join(jsDir, f)),
    ...(await readdir(storyDir)).filter((f) => /\.(js|css|html)$/.test(f)).map((f) => path.join(storyDir, f)),
    path.join(ROOT, 'index.html'),
  ];
  const defined = new Set();
  const sources = new Map();
  for (const f of files) {
    const src = await readFile(f, 'utf8');
    sources.set(f, src);
    if (f.endsWith('.css')) {
      for (const m of src.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) defined.add(m[1]);
    } else {
      /* A custom property set from script is just as defined as one set in a
         stylesheet — the story tiles colour themselves with setProperty, and
         reading only .css files reported that as undefined. */
      for (const m of src.matchAll(/setProperty\(\s*['"`](--[a-zA-Z0-9-]+)/g)) defined.add(m[1]);
      for (const m of src.matchAll(/style\s*=\s*["'][^"']*?(--[a-zA-Z0-9-]+)\s*:/g)) defined.add(m[1]);
    }
  }
  const missing = new Map();
  for (const [f, src] of sources) {
    for (const m of src.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)\s*(,)?/g)) {
      if (defined.has(m[1]) || m[2]) continue;   // defined, or has a fallback
      if (!missing.has(m[1])) missing.set(m[1], new Set());
      missing.get(m[1]).add(path.basename(f));
    }
  }
  const results = [];

  /* No inline event handlers, anywhere — in the markup or in the template
     strings the modules build at runtime. `script-src 'self'` (vercel.json)
     refuses to run them, so one that creeps back in is a dead control, and
     a dead control is easy to miss by eye. The runtime CSP check only sees
     handlers that actually fire during the interaction phase; this sees all
     of them, in files the browser may never reach on a given run.
     `data-on-error` is the declarative replacement, not a handler. */
  const HANDLER_ATTR = /\son(?:click|error|load|change|input|submit|focus|blur|key(?:down|up|press)|mouse[a-z]+)\s*=\s*["']/gi;
  const offenders = [];
  for (const [f, src] of sources) {
    if (f.endsWith('.css')) continue;
    for (const m of src.matchAll(HANDLER_ATTR)) {
      const line = src.slice(0, m.index).split('\n').length;
      offenders.push(`${path.basename(f)}:${line}${m[0].trim()}`);
    }
  }
  const inlineKey = 'static/csp:no-inline-handlers';
  results.push(offenders.length
    ? { key: inlineKey, id: 'csp:no-inline-handlers', title: 'No inline event handler attributes',
        ok: false, msg: `${offenders.length} found: ${offenders.slice(0, 4).join(', ')}` }
    : { key: inlineKey, id: 'csp:no-inline-handlers', title: 'No inline event handler attributes', ok: true });

  /* And the policy that makes the above matter. If script-src ever regains
     'unsafe-inline' the check above stops protecting anything, so assert the
     header itself rather than trusting it stays put. */
  const vercel = JSON.parse(await readFile(path.join(ROOT, 'vercel.json'), 'utf8'));
  const csp = vercel.headers
    ?.flatMap((h) => h.headers ?? [])
    .find((h) => h.key === 'Content-Security-Policy')?.value ?? '';
  const scriptSrc = csp.split(';').map((d) => d.trim()).find((d) => d.startsWith('script-src')) ?? '';
  const cspKey = 'static/csp:script-src-blocks-inline';
  results.push(/'unsafe-inline'|'unsafe-eval'/.test(scriptSrc)
    ? { key: cspKey, id: 'csp:script-src-blocks-inline', title: 'script-src forbids inline and eval',
        ok: false, msg: `script-src permits it: "${scriptSrc}"` }
    : { key: cspKey, id: 'csp:script-src-blocks-inline', title: 'script-src forbids inline and eval', ok: true });

  /* Every data-action names a handler that exists. A control whose action was
     never registered does nothing at all when clicked, and there is no error
     to notice — it is the specific way this pattern fails. Browser checks
     only reach controls they can navigate to; a name is used and registered
     in source either way, so the pairing is checked there. */
  const used = new Map();          // action name → where it is written
  const registered = new Set();
  for (const [f, src] of sources) {
    if (f.endsWith('.css')) continue;
    for (const m of src.matchAll(/data-action="([^"$]+)"/g)) {
      if (!used.has(m[1])) used.set(m[1], path.basename(f));
    }
    /* Keys of the object literals handed to registerActions({ … }). Matched by
       counting braces rather than by regex: the handlers destructure their
       context argument, and a non-greedy `}` closes the match on the first
       `({ el })` it meets, silently truncating the block to one entry. */
    for (const m of src.matchAll(/registerActions\(\s*\{/g)) {
      let depth = 1;
      let i = m.index + m[0].length;
      while (i < src.length && depth > 0) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') depth--;
        i++;
      }
      for (const k of src.slice(m.index, i).matchAll(/['"]([a-z0-9:_-]+)['"]\s*:/gi)) registered.add(k[1]);
    }
  }
  const orphans = [...used].filter(([name]) => !registered.has(name));
  const orphanKey = 'static/actions:every-action-has-a-handler';
  results.push(orphans.length
    ? { key: orphanKey, id: 'actions:every-action-has-a-handler', title: 'Every data-action resolves to a handler',
        ok: false, msg: `${orphans.length} unhandled: ${orphans.slice(0, 4).map(([n, f]) => `${n} (${f})`).join(', ')}` }
    : { key: orphanKey, id: 'actions:every-action-has-a-handler', title: 'Every data-action resolves to a handler', ok: true });

  const key = 'static/css:no-undefined-vars';
  if (missing.size) {
    const detail = [...missing].slice(0, 5)
      .map(([v, fs]) => `${v} (${[...fs].join(', ')})`).join('; ');
    results.push({ key, id: 'css:no-undefined-vars', title: 'No undefined CSS custom properties',
      ok: false, msg: `${missing.size} undefined: ${detail}` });
  } else {
    results.push({ key, id: 'css:no-undefined-vars', title: 'No undefined CSS custom properties', ok: true });
  }
  return results;
}

// ── Runner ────────────────────────────────────────────────────────────────────

/* Serve Wikimedia's photographs from photo-cache/ when it is present.

   The development sandbox gets 403 at its egress proxy for
   upload.wikimedia.org, so locally every photograph fails and any check that
   asserts one loaded — panel:hero-photo-loads — fails for a reason that is not
   a defect. .github/workflows/photo-cache.yml fetches them on a runner and
   pushes them to chore/photo-cache; `npm run photos:pull` brings them down.

   In CI the directory is absent and the real network serves them, so the check
   means the same thing in both places. Absent the cache this is a no-op. */
/* Can this machine reach the photograph host? CI can; the development sandbox
   gets 403 at its egress proxy. A check that asserts an image loaded cannot
   mean anything where the host is unreachable, and leaving it to fail there
   would train everyone to ignore a red run. */
let WIKIMEDIA_REACHABLE = null;
async function wikimediaReachable() {
  if (WIKIMEDIA_REACHABLE !== null) return WIKIMEDIA_REACHABLE;
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8000);
    const res = await fetch('https://upload.wikimedia.org/wikipedia/commons/7/73/Deinococcus_radiodurans.jpg',
      { signal: ac.signal, headers: { 'User-Agent': 'TreeOfLife/1.0 (smoke preflight)' } });
    clearTimeout(t);
    WIKIMEDIA_REACHABLE = res.ok;
  } catch { WIKIMEDIA_REACHABLE = false; }
  return WIKIMEDIA_REACHABLE;
}

async function servePhotoCache(ctx) {
  const manifestPath = 'photo-cache/manifest.json';
  if (!existsSync(manifestPath)) return;
  const cache = JSON.parse(readFileSync(manifestPath, 'utf8'));
  /* Indexed by the underlying filename: the tree asks for a 400px cut and the
     panel for 1280px, which are different URLs for the same Commons file. */
  const byFile = new Map();
  const key = (u) => u.split('/').pop().replace(/^\d+px-/, '');
  for (const [url, name] of Object.entries(cache)) {
    if (!byFile.has(key(url))) byFile.set(key(url), name);
  }
  const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' };
  await ctx.route('https://upload.wikimedia.org/**', async (route) => {
    const url = route.request().url();
    const name = cache[url] || byFile.get(key(url));
    const file = name ? `photo-cache/${name}` : null;
    if (file && existsSync(file)) {
      const ext = file.split('.').pop().toLowerCase();
      await route.fulfill({ body: readFileSync(file), contentType: MIME[ext] || 'image/jpeg' });
    } else {
      await route.abort();
    }
  });
}
async function runScenario(browser, scenario, baseUrl) {
  const ctx = await browser.newContext({
    viewport: { width: scenario.viewport.width, height: scenario.viewport.height },
    isMobile: scenario.viewport.isMobile,
    hasTouch: scenario.viewport.hasTouch,
    deviceScaleFactor: scenario.viewport.deviceScaleFactor || 1,
    locale: scenario.lang === 'he' ? 'he-IL' : scenario.lang === 'ru' ? 'ru-RU' : 'en-US',
  });

  await servePhotoCache(ctx);

  // Seed preferences so the run is deterministic: chosen language, no guided
  // tour modal, no idle nudges.
  await ctx.addInitScript((cfg) => {
    localStorage.setItem('tol-lang', cfg.lang);
    localStorage.setItem('theme', cfg.theme);
    localStorage.setItem('tol-tour-done', '1');
    localStorage.setItem('tol-splash-seen', '1');
    // A Content-Security-Policy that blocks something the page needs fails
    // silently in the UI. Record every violation so a check can fail on it.
    window.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', (e) => {
      window.__cspViolations.push(
        `${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`);
    });
  }, { lang: scenario.lang, theme: scenario.theme || 'dark' });

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

let all = [];
{
  const staticResults = await staticChecks();
  process.stdout.write('\n▸ static\n');
  for (const r of staticResults) {
    process.stdout.write(`  ${r.ok ? '✅' : '❌'} ${r.id}${r.ok ? '' : '  ' + r.msg}\n`);
  }
  all = all.concat(staticResults);
}

const browser = await chromium.launch(
  PROXY ? { proxy: { server: PROXY, bypass: 'localhost,127.0.0.1' } } : {});
if (PROXY) process.stdout.write(`Routing Chromium through ${PROXY}\n`);
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
