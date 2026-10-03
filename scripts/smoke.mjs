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
/* Run one scenario instead of all seven: `--only desktop-he`, comma-separated
   for more than one. The full matrix is a ~35 minute round trip, which is too
   slow to answer "does this new check actually go red when I break the code?"
   — and a check nobody has watched fail is a check nobody has tested. Never
   use it to decide a branch is green: the pass/fail summary below counts only
   what ran, and the baseline reconciliation is meaningless over a subset,
   which is why a filtered run refuses to touch the baseline file. */
const ONLY = opt('only', '').split(',').map((s) => s.trim()).filter(Boolean);
/* --opening-only: run nothing but the `opening:` group. Each scenario skips its
   own page load and every probe but the opening's, so a scenario takes about
   15 seconds instead of a minute. It is the loop for working on the opening
   and what scripts/mutate-checks.mjs runs; like --only it says nothing about
   whether a branch is green, and is treated as a filtered run below. */
const OPENING_ONLY = flag('opening-only');
/* --profile-only: the same for the name offer. It runs the `profile:` group and
   the native-dialog check that shares its probe, and nothing else, so a
   scenario takes 10 to 40 seconds instead of a minute. It is what
   scripts/mutate-checks.mjs runs for a mutation of the offer. */
const PROFILE_ONLY = flag('profile-only');
/* --orbit-only: the same for the third view (about twenty seconds a scenario). */
const ORBIT_ONLY = flag('orbit-only');
const GROUP_ONLY = OPENING_ONLY ? 'opening' : PROFILE_ONLY ? 'profile' : ORBIT_ONLY ? 'orbit' : '';
const GROUP_IDS = { opening: /^opening:/, profile: /^(profile:|load:no-native-dialogs$)/, orbit: /^(orbit:|i18n:orbit|a11y:orbit)/ };
const FILTERED = ONLY.length > 0 || !!GROUP_ONLY;

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
  { id: 'kin-label', key: 'btn_kin' },
  { id: 'i-btn-hominins', key: 'btn_hominins' },
  { id: 'i-btn-compare', key: 'compare_btn' },
  { id: 'nav-back-label', key: 'nav_back' },
  { id: 'nav-home-label', key: 'nav_home' },
  { id: 'nav-share-label', key: 'nav_share' },
  { id: 'reveal-title', key: 'reveal' },
  { id: 'btn-collapse-all', key: 'collapse_all' },
  { id: 'btn-expand-all', key: 'expand_all' },
  { id: 'i-btn-guided-tour', key: 'btn_guided_tour' },
  { id: 'i-rail-seen', key: 'rail_seen' },
  { id: 'rail-credits', key: 'rail_credits' },
  { id: 'i-view-orbit', key: 'view_orbit' },
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
      const res = await fetch(url + '/atlas.html');
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

/* The two checks above measure a strip that was visible when it was built,
   because the runner seeds tol-shell-view=map and never sees it any other way.
   In Explore the strip is display:none, and a hidden element cannot measure
   itself: the labels come back untrimmed and the curve comes back in the
   previous theme's ink. Both are reached by a language switch or a theme
   toggle taken in the drill-down — and by a plain first visit, which lands
   there by default. */
check('timeline:era-labels-survive-the-drill-down', 'Era labels are re-fitted on the way back to the map', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || !e.eraClippedAfterReturn) return;
  if (e.eraClippedAfterReturn.length) {
    fail(`${e.eraClippedAfterReturn.length} label(s) clipped after returning from the drill-down: ` +
         e.eraClippedAfterReturn.slice(0, 4).join(', '));
  }
});

check('timeline:density-curve-survives-the-drill-down', 'The density curve is redrawn on the way back to the map', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked) return;
  /* No canvas, no claim — better than reporting green over a measurement that
     never happened. */
  if (!e.densityOnReturn || !e.densityRedrawn) { fail('the density curve could not be read'); return; }
  if (e.densityOnReturn !== e.densityRedrawn) {
    fail(`the curve came back stale (${e.densityOnReturn}, a correct redraw is ${e.densityRedrawn})`);
  }
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

/* A control wears one icon or none. The markup and the translation are two
   places to write a glyph and neither can see the other, so an icon added to
   one while the other already carried one reads as two icons on one label --
   which is what "\u{1F52C} \u2696 Compare Mode" was, in all three languages, for as
   long as the string existed. i18n:controls-translated cannot see it: the
   binding matched its translation perfectly. The label has to be measured
   assembled. */
check('i18n:one-icon-per-control', 'No control wears two icons at once', (c) => {
  const bad = c.probe.doubledIcons;
  if (!bad) return;
  if (bad.length) {
    fail(`${bad.length} control(s) show more than one icon: ` +
      bad.slice(0, 4).map((b) => `#${b.id} "${b.text}" (${b.icons})`).join('; '));
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

/* Hover exists only on a desktop; a phone never shows the fun fact. */
check('i18n:tooltip-fact-reads-as-english', 'A tooltip fun fact is laid out as the English it is', (c) => {
  const f = c.probe.tipFact;
  if (!f || !f.shown) fail('no fun fact appeared on hovering a node that has one');
  if (f.dir !== 'ltr') fail(`the fun fact is laid out ${f.dir}`);
}, (sc) => !sc.viewport.isMobile);

check('i18n:tooltip-fact-label-translated', "The tooltip's \"Did you know?\" is in the page's language", (c) => {
  const f = c.probe.tipFact;
  if (!f || !f.shown) fail('no fun fact appeared on hovering a node that has one');
  if (f.label !== f.expected) fail(`label reads "${f.label}", expected "${f.expected}"`);
}, (sc) => !sc.viewport.isMobile);

check('i18n:panel-prose-reads-as-english', 'English species prose is laid out left-to-right', (c) => {
  const p = c.probe.panelProse;
  if (!p || !p.checked) return;
  if (p.wrong.length) fail(`${p.wrong.length} English block(s) laid out RTL: ${p.wrong.join(', ')}`);
});

check('a11y:text-contrast', 'Text meets AA contrast against its background', (c) => {
  const { theme, hits } = c.probe.contrast || { theme: '?', hits: [] };
  if (hits.length) fail(`${hits.length} element(s) below AA in the ${theme} theme: ${hits.slice(0, 4).join(', ')}`);
});

/* The same measurement, over the view a visitor actually lands on. The check
   above cannot reach it: the runner seeds tol-shell-view=map so the tree
   geometry is measured against the tree, which left the default view's colours
   unchecked — and they were not fine. In the light theme the accent gold sat at
   4.40 against 4.5 on the back button and the path label, which is the kind of
   miss that passes a glance and fails a measurement. */
check('a11y:explore-text-contrast', 'Drill-down text meets AA contrast against its background', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || !e.contrast) return;
  const { theme, hits, available } = e.contrast;
  /* Without this the check reports green by measuring nothing at all, which is
     the one failure mode a contrast check must not have. */
  if (!available) { fail('the contrast sweep was never installed on the page'); return; }
  if (hits.length) {
    fail(`${hits.length} element(s) below AA in the drill-down in the ${theme} theme: ${hits.slice(0, 4).join(', ')}`);
  }
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
  if (!h.loaded) fail(`the hero photograph did not load, so the panel fell back to its silhouette: ${h.src}`);
  else if (!h.shown) fail('the hero photograph loaded but is not displayed');
});

check('explore:is-usable', 'The drill-down renders and descends', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked) { fail(`explore could not be probed: ${e && e.reason}`); return; }
  const [root] = e.steps;
  if (!root.visible) { fail('the explore view has no width'); return; }
  if (!root.cards) { fail('the root screen offers no cards to tap'); return; }
  if (e.steps.length < 3) { fail(`only descended ${e.steps.length - 1} level(s) — a card did not open`); return; }
  for (let i = 1; i < e.steps.length; i++) {
    const prev = e.steps[i - 1], now = e.steps[i];
    if (now.title === prev.title) fail(`level ${i} did not change the heading (still "${now.title}")`);
    if (now.dots !== prev.dots + 1) fail(`level ${i} shows ${now.dots} path dots, expected ${prev.dots + 1}`);
    if (!now.cards) fail(`level ${i} ("${now.title}") offers nothing to tap`);
  }
});

check('explore:back-returns', 'Back climbs one level', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || !e.afterBack) return;
  const last = e.steps[e.steps.length - 1];
  if (e.afterBack.dots !== last.dots - 1) {
    fail(`back left ${e.afterBack.dots} dots, expected ${last.dots - 1}`);
  }
  if (e.afterBack.title === last.title) fail('back did not change the heading');
});

check('explore:says-where-you-are', 'Every screen names the step you are on', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked) return;
  for (const s of e.steps) {
    if (s.here !== s.title) fail(`"${s.title}" is labelled "${s.here}" on the path`);
    if (!s.current.startsWith(e.herePrefix)) fail(`the current dot on "${s.title}" is not announced as your position (want "${e.herePrefix}…", got "${s.current}")`);
    if (!s.named) fail(`a path dot on "${s.title}" carries no name`);
  }
});

/* The check above reads its labels out of the DOM, so it passed for as long as
   the path ribbon existed — while the timeline, fixed to the bottom of the
   window and painted above it, covered the dots and the "you are here" label
   at every point on both viewports. Present, correct, translated, invisible.
   Ask what is actually on top instead. */
check('explore:controls-are-not-covered', 'The path and the back button are not painted over', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked) return;
  for (const s of e.steps) {
    for (const o of s.onTop || []) {
      if (o.missing || o.offscreen) continue;  // no back button on the root screen; cards scroll
      if (o.covered) fail(`on "${s.title}", ${o.sel} is covered by ${o.by}`);
    }
  }
});

/* The detail panel belongs to the shell that opened it. Left up across a view
   switch it covered a third of the drill-down, and no geometric check caught
   it: it clears the back button and the path entirely, and lands only on the
   far cards. Assert the dismissal itself rather than hoping something overlaps
   it. */
check('explore:view-switch-closes-the-panel', 'Switching to the drill-down dismisses the species panel', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked) return;
  if (!e.panelOpenBeforeSwitch) return;        // nothing was open, nothing to dismiss
  if (e.panelSurvivedSwitch) fail('the species panel stayed open over the drill-down after switching views');
});

/* The rewrite's defining property, and the one a screenshot cannot prove: going
   a level deeper must leave the page standing. The old view wiped innerHTML and
   repainted a fresh grid, so nothing on screen said the new rows had come out of
   the row you tapped. If a future change quietly restores the screen-swap, every
   other explore check still passes — the headings still change, the dots still
   grow — and only this one notices. */
check('explore:descending-unfolds-in-place', 'Opening a branch keeps the page it came from', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || e.steps.length < 2) return;
  for (let i = 1; i < e.steps.length; i++) {
    const prev = e.steps[i - 1], now = e.steps[i];
    if (now.openRows !== prev.openRows + 1) {
      fail(`level ${i} ("${now.title}") shows ${now.openRows} open rows, expected ${prev.openRows + 1} — the chain above it was discarded`);
    }
    if (!now.dimRows) {
      fail(`level ${i} ("${now.title}") left no branch on screen that was passed over`);
    }
  }
});

/* Arriving from search is the one way into this view that lands somewhere the
   reader did not scroll to themselves, and the landing spot is the bottom of a
   page whose bottom is covered by a fixed ribbon. scrollIntoView cannot see
   that ribbon — it scrolls until the row is inside the scroll container and
   stops, which put a six-deep node at y=796 in an 844px window, behind the
   bar. Nothing else here can catch it: the probe's own descent starts at the
   root and never travels far enough to need scrolling. */
check('explore:deep-landing-is-visible', 'Opening a deep node scrolls it clear of the ribbon', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || !e.deepLanding) return;
  const d = e.deepLanding;
  if (d.error) { fail(`could not open a deep node: ${d.error}`); return; }
  if (!d.onScreen) fail(`"${d.name.trim()}" is off-screen after opening it (top ${d.top})`);
  else if (!d.clearsRibbon) fail(`"${d.name.trim()}" lands behind the path ribbon (bottom ${d.bottom}, ribbon top ${d.floor})`);
});

/* The row keeps a picture when its photograph does not arrive. The media box
   is a fixed 36px whether or not anything paints in it, so a hidden <img> is
   not an absent one — it is a hole the reader cannot interpret. See the probe
   for why this breaks an image rather than looking for a broken one. */
check('explore:a-broken-photo-still-shows-something', 'A row whose photograph fails falls back to its silhouette', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || !e.photoFallback) return;
  const f = e.photoFallback;
  if (f.error) { fail(`breaking a row photograph threw: ${f.error}`); return; }
  if (f.skipped) return;
  if (!f.imgHidden) fail('the <img> that failed to load is still on the row');
  else if (!f.replacement) fail(`nothing replaced it — ${f.box}px of empty media box`);
  else if (!f.replacementW) fail(`the replacement (${f.replacement}) rendered at zero width`);
});

/* Every level of the lineage starts further in than the one above it — all the
   way down, not just for the first four. See the probe for what this replaces:
   a capped indent that drew the bottom half of the tree flat while every other
   check on this view stayed green. */
check('explore:depth-is-drawn', 'Each level of the lineage is inset past its parent', (c) => {
  const n = c.probe.explore && c.probe.explore.nesting;
  if (!n) return;
  if (n.error) { fail(`measuring the nesting threw: ${n.error}`); return; }
  const chain = n.chain || [];
  if (chain.length < 5) { fail(`only ${chain.length} open level(s) — the deep lineage never opened`); return; }
  const flat = [];
  for (let i = 1; i < chain.length; i++) {
    const step = chain[i].inset - chain[i - 1].inset;
    if (step < 4) flat.push(`${chain[i - 1].id}→${chain[i].id} gains ${step}px`);
  }
  if (flat.length) {
    fail(`${flat.length} level(s) of ${chain.length - 1} are drawn flat: ${flat.slice(0, 4).join(', ')}`);
  }
});

/* And each row is visibly joined to the one it came out of. Indent alone is a
   nested list; the join is what makes it a tree, and it is drawn entirely in a
   pseudo-element — so it can disappear without changing one byte of the DOM. */
check('explore:rows-are-joined-to-their-parent', 'Every row is drawn attached to its parent', (c) => {
  const n = c.probe.explore && c.probe.explore.nesting;
  if (!n || n.error) return;
  const joins = n.joins || [];
  if (joins.length < 5) { fail(`only ${joins.length} nested row(s) measured`); return; }
  const bare = joins.filter((j) => !j.w || !j.border || j.alpha < 0.05);
  if (bare.length) {
    fail(`${bare.length} of ${joins.length} row(s) hang unattached: ` +
      bare.slice(0, 4).map((b) => `${b.id} (${b.w}px wide, ${b.border}px stroke, alpha ${b.alpha})`).join('; '));
  }
});

check('explore:no-horizontal-scroll', 'The drill-down never scrolls sideways', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked) return;
  const bad = e.steps.filter((s) => s.overflow).map((s) => s.title);
  if (bad.length) fail(`${bad.length} screen(s) overflow horizontally: ${bad.join(', ')}`);
});

/* The drill-down is the default view, and until these three it was the only
   part of the site no language check ever looked at. See the sweep in the
   Explore probe for why the map-view pass cannot reach it. */
check('i18n:explore-no-latin-leak', 'No English text leaks into the Hebrew drill-down', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || !e.i18n) return;
  const { leaks } = e.i18n;
  if (leaks.length) {
    fail(`${leaks.length} Latin-script string(s) in the Hebrew drill-down: ` +
      leaks.slice(0, 4).map((l) => `${l.where}="${l.txt}"`).join(', '));
  }
}, (s) => s.lang === 'he');

check('i18n:explore-prose-reads-as-english', 'English prose in the drill-down is laid out left-to-right', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || !e.i18n) return;
  const { rtlProse } = e.i18n;
  if (rtlProse.length) {
    fail(`${rtlProse.length} English block(s) laid out RTL: ` +
      rtlProse.slice(0, 4).map((l) => `${l.where}="${l.txt}"`).join(', '));
  }
}, (s) => s.lang === 'he');

check('explore:rows-state-breadth-and-depth', 'Every group row says how wide it is and how deep it runs', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked) return;
  const facts = e.rowFacts;
  if (!facts) fail('row facts were never collected');
  if (facts.error) fail(`reading the tree threw: ${facts.error}`);
  const groups = facts.filter((f) => f.kids > 0);
  if (groups.length < 3) fail(`only ${groups.length} group row(s) on screen — nothing was really measured`);
  const bad = [];
  for (const f of groups) {
    if (!f.sub) { bad.push(`${f.id}: empty subtitle`); continue; }
    if (!f.sub.includes(String(f.kids))) bad.push(`${f.id}: "${f.sub}" never says it holds ${f.kids}`);
    /* One level down is stated as a species count instead — the same fact in
       the word the site already uses for it — so only deeper rows owe a
       number of levels. */
    if (f.depth > 1 && !f.sub.includes(String(f.depth))) bad.push(`${f.id}: "${f.sub}" never says it runs ${f.depth} levels`);
    if (f.ranked && f.sub.split('·').length < 2) bad.push(`${f.id}: "${f.sub}" drops the rank`);
  }
  if (bad.length) fail(`${bad.length} row(s) understated: ${bad.slice(0, 4).join('; ')}`);
});

check('i18n:explore-taxa-translated', 'Drill-down cards name their group in the active language', (c) => {
  const e = c.probe.explore;
  if (!e || !e.checked || !e.i18n) return;
  const { untranslated } = e.i18n;
  if (untranslated.length) {
    fail(`${untranslated.length} card(s) still showing English: ` +
      untranslated.slice(0, 4).map((t) => `${t.id}="${t.got}" want "${t.want}"`).join(', '));
  }
}, (s) => s.lang !== 'en');

/* ── The wayfinder ──────────────────────────────────────────────────────────
   Back, Home and Share, in every view and over every overlay. The controls
   these replace were never missing — they were underneath. Reading the DOM
   said they were fine for as long as they existed. */

check('chrome:wayfinder-is-reachable', 'Back, Home and Share are on top of whatever is open', (c) => {
  const w = c.probe.wayfinder;
  if (!w) fail('wayfinder never measured');
  if (!w.cluster || w.cluster.w < 1) fail('#nav-ctrl has no box — it is not on screen at all');
  const bad = [...w.overPanel, ...(w.overGame || [])].filter((b) => b.top !== 'clear');
  if (bad.length) {
    fail(`${bad.length} wayfinder button(s) unreachable: ` +
      bad.map((b) => `${b.id} ${b.top}`).join(', '));
  }
  if (!w.gameOpen) fail('the games panel never opened, so nothing was tested on top of');
});

check('chrome:wayfinder-clears-the-chrome', 'The wayfinder is painted over nothing else', (c) => {
  const w = c.probe.wayfinder;
  if (!w) return;
  if (w.collisions && w.collisions.length) {
    fail(`the wayfinder overlaps ${w.collisions.join(', ')} — it now outranks the whole page, ` +
      'so anything under it is hidden by it');
  }
  /* Either the growing search field misses the cluster, or the cluster stands
     aside for it. Both are acceptable; overlapping it while visible is not. */
  if (w.searchCollision && !w.hiddenForSearch) {
    fail(`the expanded search box runs under the wayfinder (${w.searchCollision}) and the wayfinder stayed visible`);
  }
});

check('nav:back-unwinds-one-layer', 'Back closes the topmost overlay and leaves the one beneath it', (c) => {
  const w = c.probe.wayfinder;
  if (!w || !w.afterBack) fail('back was never exercised');
  if (w.afterBack.game) fail('Back did not close the games panel that was on top');
  if (!w.afterBack.panel) fail('Back closed the species panel underneath as well — back takes off one layer, not all of them');
});

check('share:link-names-node-view-and-language', 'The share link carries the shell and the language, not just the node', (c) => {
  const w = c.probe.wayfinder;
  if (!w || !w.url) fail('no share URL was built');
  let u;
  try { u = new URL(w.url); } catch (e) { fail(`share URL does not parse: ${w.url}`); }
  for (const key of ['view', 'lang']) {
    if (!u.searchParams.get(key)) {
      fail(`share link has no ?${key}= — the recipient would open it in their own ${key === 'view' ? 'shell' : 'language'}: ${w.url}`);
    }
  }
  if (u.searchParams.get('lang') !== c.scenario.lang) {
    fail(`share link says lang=${u.searchParams.get('lang')} in the ${c.scenario.lang} scenario`);
  }
  if (!w.shareToast) fail('the share button produced no toast — nothing told the reader what happened');
});

check('share:link-restores-the-senders-view', 'A shared link opens in the shell and language it was made in', (c) => {
  const s = c.probe.sharedLink;
  if (!s) fail('the shared link was never followed');
  if (s.error) fail(`following the shared link threw: ${s.error}`);
  if (s.view !== 'explore') fail(`?view=explore landed in the ${s.view} shell`);
  if (s.lang !== 'ru') fail(`?lang=ru landed in ${s.lang}`);
  if (!s.cards) fail('the drill-down rendered no rows on the shared link');
  /* Honouring a link is not the recipient changing their mind. The runner
     seeds the map in this scenario's language; both have to survive. */
  if (s.storedView !== 'map') fail(`following a link rewrote the stored shell to ${s.storedView}`);
  if (s.storedLang !== c.scenario.lang) fail(`following a link rewrote the stored language to ${s.storedLang}`);
});

// ── Orbit, the third view ─────────────────────────────────────────────────────
const orbitOf = (c) => {
  const o = c.probe.orbit;
  if (!o) fail('the Orbit pass never ran');
  if (o.error) fail(`the Orbit pass threw: ${o.error}`);
  return o;
};

check('orbit:the-view-shows-itself-and-hides-the-others', 'Orbit replaces the other two views and is the active one in the rail', (c) => {
  const l = orbitOf(c).landing;
  if (l.view !== 'orbit') fail(`?view=orbit landed in the ${l.view} shell`);
  if (!l.orbitVisible) fail('#orbit is not on screen in the orbit shell');
  if (l.exploreVisible) fail('the drill-down is still on screen under Orbit');
  if (l.mapVisible) fail('the map canvas is still on screen under Orbit');
  if (l.timelineVisible) fail('the era strip is still on screen under Orbit, where it filters nothing');
  if (l.active !== 'orbit') fail(`the rail marks "${l.active}" as the active view`);
  if (l.stored !== 'map') fail(`following ?view=orbit rewrote the stored shell to "${l.stored}"`);
});

check('orbit:starts-from-the-reader', 'The fan opens centred on the person, with rings of relatives round them', (c) => {
  const l = orbitOf(c).landing;
  if (l.focus !== 'h_sapiens') fail(`the first focus is "${l.focus}", not the person`);
  if (l.bubbles < 12) fail(`only ${l.bubbles} bubbles drawn around the person`);
  if (l.arcs < 3) fail(`only ${l.arcs} ring guides drawn`);
});

check('orbit:every-focus-fits-and-accounts-for-everyone', 'With any of the tree\'s nodes at the centre, nothing leaves the window, nothing overlaps, and every relative is drawn or counted', (c) => {
  const s = orbitOf(c).sweep;
  const msg = [];
  if (s.outside) msg.push(`${s.outside} bubble(s) outside the ${s.W}×${s.H} window`);
  if (s.overlap) msg.push(`${s.overlap} pair(s) of bubbles on top of each other`);
  if (s.missing) msg.push(`${s.missing} ring(s) whose drawn + counted relatives do not add up`);
  if (s.stranded) msg.push(`${s.stranded} ring(s) whose "+N" bubble could not be placed, so those relatives are unreachable`);
  if (msg.length) fail(`over ${s.nodes} foci: ${msg.join('; ')} — e.g. ${s.sample.join(' | ')}`);
});

check('orbit:nothing-overlaps-on-the-page', 'Painted for real, no bubble leaves the view or lies on another, and the legend clears the buttons', (c) => {
  const rows = orbitOf(c).dom;
  const bad = rows.filter((r) => r.outside.length || r.overlap.length || r.pills.length);
  if (bad.length) fail(bad.map((r) => `${r.id}: ` + [
    r.outside.length ? `outside ${r.outside.join(',')}` : '',
    r.overlap.length ? `overlap ${r.overlap.slice(0, 3).join(',')}` : '',
    r.pills.length ? r.pills.join(', ') : ''].filter(Boolean).join('; ')).join(' | '));
});

check('orbit:controls-are-not-covered', 'What a fingertip lands on at the middle of every bubble is that bubble', (c) => {
  const rows = orbitOf(c).dom;
  const bad = rows.filter((r) => r.covered.length);
  if (bad.length) fail(bad.map((r) => `${r.id}: ${r.covered.slice(0, 4).join(', ')}`).join(' | '));
});

check('orbit:rings-state-their-time', 'Every relative says when you last shared an ancestor', (c) => {
  const rows = orbitOf(c).dom;
  const bad = rows.filter((r) => r.noTime.length);
  if (bad.length) fail(bad.map((r) => `${r.id}: ${r.noTime.slice(0, 4).join(', ')} with no time`).join(' | '));
});

check('orbit:pressing-moves-the-focus-and-back-undoes-it', 'A press re-centres on that creature, Back returns, Home starts again, the centre opens the panel', (c) => {
  const s = orbitOf(c).story;
  if (s.start.focus !== 'h_sapiens') fail(`the story began at "${s.start.focus}"`);
  if (!s.target) fail('there was no relative to press');
  if (s.afterPress.focus !== s.target) fail(`pressing "${s.target}" left the focus on "${s.afterPress.focus}"`);
  if (!s.afterPress.trail.includes('h_sapiens')) fail('after a press the way back does not name where the reader came from');
  if (!s.afterPress.home) fail('after a press there is no way to start again');
  if (s.afterBack.focus !== 'h_sapiens') fail(`Back from "${s.target}" landed on "${s.afterBack.focus}"`);
  if (s.afterHome.focus !== 'h_sapiens') fail(`Home from platypus landed on "${s.afterHome.focus}"`);
  if (!s.panelOpen) fail('pressing the centre did not open the species panel');
  if (!s.panelClosedByBack) fail('Back did not take the panel off before touching the view beneath');
});

check('orbit:the-lineage-strip-shows-the-path-and-jumps', 'The strip names every ancestor from the origin of life, and one tap goes to any of them', (c) => {
  const o = orbitOf(c);
  const bad = o.dom.filter((r) => r.lin.strip.length);
  if (bad.length) fail(bad.map((r) => `${r.id}: ${r.lin.strip.join(', ')}`).join(' | '));
  const s = o.story;
  if (!s.crumb) fail('the strip offered no ancestor to jump to');
  if (s.afterCrumb.focus !== s.crumb) fail(`tapping the "${s.crumb}" crumb centred "${s.afterCrumb.focus}"`);
});

check('orbit:up-is-the-parent-and-back-is-history', 'Up goes to the parent and Back to where the reader came from — they are not the same', (c) => {
  const s = orbitOf(c).story;
  const parent = s.pathAtTarget[s.pathAtTarget.length - 2];
  if (s.pathAtTarget[s.pathAtTarget.length - 1] !== s.lvlTarget) fail(`the strip's path ends at "${s.pathAtTarget.slice(-1)}", not the centre "${s.lvlTarget}"`);
  if (s.afterUp.focus !== parent) fail(`Up from "${s.lvlTarget}" landed on "${s.afterUp.focus}", not its parent "${parent}"`);
  if (s.backAfterUp.focus !== s.lvlTarget) fail(`Back after Up landed on "${s.backAfterUp.focus}"; the reader was last on "${s.lvlTarget}"`);
  if (s.lvlTarget === parent) fail('the probe chose a target that is its own parent');
});

check('orbit:a-press-travels-rather-than-replaces', 'The pressed bubble is the same element at the centre, and the old centre glides out as a child', (c) => {
  const s = orbitOf(c).story;
  if (!s.glided) fail(`pressing "${s.lvlTarget}" replaced its bubble instead of moving it to the centre`);
  if (!s.leftGlided) fail('going up replaced the old centre instead of gliding it out to its ring');
});

check('orbit:a-move-says-why-they-are-where-they-are', 'After a press, one line names both creatures and where their lineages met; it takes no taps and stands in for the legend', (c) => {
  const w = orbitOf(c).story.why;
  if (!w) fail('pressing a bubble raised no explanation');
  if (w.names.length < 2) fail(`the line names ${w.names.length} creature(s): "${w.text}"`);
  if (/[{}]/.test(w.text)) fail(`an unfilled placeholder: "${w.text}"`);
  if (!w.exempt) fail('a name in the line is not marked as data');
  if (w.events !== 'none') fail(`the line takes taps (pointer-events: ${w.events})`);
  if (w.legend !== 'hidden') fail('the legend is still drawn under the line');
  if (w.box.l < 0 || w.box.r > w.vw || w.box.b > w.vh) fail(`the line leaves the window: ${JSON.stringify(w.box)}`);
});

check('orbit:compare-pins-one-creature-and-keeps-saying-how-it-relates', 'Compare pins the centre; pressing another creature keeps a line naming the pinned one and the new centre; pressing again lets go', (c) => {
  const k = orbitOf(c).story.cmp;
  if (!k) fail('the compare steps never ran');
  if (k.before.on !== 'false') fail(`the button starts pressed (${k.before.on})`);
  if (k.pinned.on !== 'true' || !k.pinned.sticky) fail('pinning did not press the button and raise a standing line');
  if (k.pinned.names.length !== 1) fail(`the pinned line should name one creature: "${k.pinned.text}"`);
  if (!k.moved.sticky || k.moved.names.length < 2) fail(`after a move the line should stay and name two creatures: "${k.moved.text}"`);
  if (k.moved.names[0] !== k.pinName) fail(`the line starts with "${k.moved.names[0]}", not the pinned "${k.pinName}"`);
  if (/[{}]/.test(k.moved.text + k.pinned.text)) fail('an unfilled placeholder');
  if (k.off.on !== 'false' || (k.off.text && k.off.sticky)) fail('pressing again did not let go');
});

check('orbit:rings-are-labelled-and-tappable', 'Each ring names its ancestor and its time, sits clear of the bubbles, and one tap centres on it', (c) => {
  const o = orbitOf(c);
  const bad = o.dom.filter((r) => r.lin.rings.length);
  if (bad.length) fail(bad.map((r) => `${r.id}: ${r.lin.rings.slice(0, 3).join(', ')}`).join(' | '));
  const h = o.dom.find((r) => r.id === 'h_sapiens');
  if (!h || h.lin.ringLabels < 2) fail(`only ${h ? h.lin.ringLabels : 0} ring label(s) (want 2+) around the person`);
  const sw = o.sweep;
  if (sw.rings && sw.unlabelled / sw.rings > 0.35) fail(`${sw.unlabelled} of ${sw.rings} rings had no room for a label`);
  const s = o.story;
  if (!s.ringTarget) fail('no ring label to press');
  if (s.afterRing.focus !== s.ringTarget) fail(`pressing the "${s.ringTarget}" ring label centred "${s.afterRing.focus}"`);
});

check('orbit:a-swipe-goes-up-or-back-and-never-also-presses', 'Swipe up is Up, swipe down is Back; a drag that starts on a bubble does not press it; short or sideways drags are not swipes', (c) => {
  const g = orbitOf(c).gest;
  if (g.afterSwipeUp.focus !== g.parentOfStart) fail(`a swipe up from "h_sapiens" landed on "${g.afterSwipeUp.focus}", not its parent "${g.parentOfStart}" (it began on "${g.rel}")`);
  if (g.afterSwipeDown.focus !== 'h_sapiens') fail(`a swipe down (Back) landed on "${g.afterSwipeDown.focus}", not where the reader was`);
  if (g.afterNonSwipes.focus !== g.beforeNonSwipes.focus) fail(`a short or sideways drag moved the focus from "${g.beforeNonSwipes.focus}" to "${g.afterNonSwipes.focus}"`);
  if (g.stageTransform) fail(`the picture was left displaced (${g.stageTransform}) after a drag`);
  if (g.tap.after.focus !== g.tap.target) fail(`a plain tap on "${g.tap.target}" centred "${g.tap.after.focus}" — a swipe's click guard must not eat taps`);
});

check('orbit:keys-move-between-levels-and-neighbours', 'Arrow keys go up, back and to neighbours, Home starts again; typing or an open panel keeps them still', (c) => {
  const g = orbitOf(c).gest;
  if (g.afterArrowUp.focus !== g.keyParent) fail(`↑ from platypus landed on "${g.afterArrowUp.focus}", not its parent "${g.keyParent}"`);
  if (g.afterArrowDown.focus !== 'platypus') fail(`↓ (Back) landed on "${g.afterArrowDown.focus}"`);
  if (g.afterRight.focus === 'platypus') fail('→ did not move to a neighbour');
  if (g.afterLeft.focus !== 'platypus') fail(`← after → landed on "${g.afterLeft.focus}", not back on platypus`);
  if (g.afterHome.focus !== 'h_sapiens') fail(`Home landed on "${g.afterHome.focus}"`);
  if (g.typing.focus !== 'platypus') fail(`↑ typed into the search box moved the picture to "${g.typing.focus}"`);
  if (g.withPanel.focus !== 'platypus') fail(`↑ with the species panel open moved the picture to "${g.withPanel.focus}"`);
});

check('orbit:the-front-door-is-orbit-and-choices-are-kept', 'A visitor with no stored choice lands in Orbit; someone who chose Explore or the map keeps it', (c) => {
  const d = orbitOf(c).door;
  const f = d.fresh;
  if (f.view !== 'orbit') fail(`a first visit landed in "${f.view}"`);
  if (!f.orbitVisible || f.exploreVisible) fail('a first visit shows the wrong view on screen');
  if (f.active !== 'orbit' || f.first !== 'orbit') fail(`the rail marks "${f.active}" active and lists "${f.first}" first`);
  if (f.bubbles < 8) fail(`a first visit drew ${f.bubbles} bubbles`);
  if (d.returningExplore.view !== 'explore') fail(`a returning Explore reader landed in "${d.returningExplore.view}"`);
  if (d.returningMap.view !== 'map') fail(`a returning map reader landed in "${d.returningMap.view}"`);
});

check('orbit:the-hint-is-said-once-and-cannot-be-pressed', 'A first visit shows a short hint in the reader\'s language; it takes no taps, goes at the first gesture and is not said again', (c) => {
  const d = orbitOf(c).door;
  if (!d.fresh.hint) fail('no hint on a first visit');
  if (d.fresh.hint.text !== d.hintWant) fail(`the hint reads "${d.fresh.hint.text}", not "${d.hintWant}"`);
  if (d.fresh.hint.events !== 'none') fail(`the hint has pointer-events:${d.fresh.hint.events} and would sit over a bubble`);
  if (d.hintAfterKey) fail('the hint stayed after the first gesture');
  if (d.hintAgain) fail('the hint came back on the next visit');
});

check('orbit:survives-a-view-switch-and-a-language-switch', 'Leaving for the drill-down and coming back is not an empty page; a language switched while looking is redrawn', (c) => {
  const o = orbitOf(c), w = o.switch;
  if (w.toExplore.view !== 'explore') fail(`the Explore button landed in "${w.toExplore.view}"`);
  if (!w.toExplore.orbitHidden) fail('Orbit stayed on screen after switching to Explore');
  if (!w.toExplore.explore) fail('the drill-down drew no rows after Orbit');
  if (w.toExplore.stored !== 'explore') fail(`choosing Explore stored "${w.toExplore.stored}"`);
  if (w.backToOrbit.view !== 'orbit') fail(`the Orbit button landed in "${w.backToOrbit.view}"`);
  if (w.backToOrbit.bubbles < 6) fail(`coming back to Orbit drew ${w.backToOrbit.bubbles} bubbles — a hidden view cannot measure itself`);
  if (w.backToOrbit.stored !== 'orbit') fail(`choosing Orbit stored "${w.backToOrbit.stored}"`);
  if (w.language.lang !== w.other) fail(`the ${w.other} button left the page in ${w.language.lang}`);
  if (w.language.main === w.before) fail(`the main button still reads "${w.before}" after switching to ${w.other}`);
  if (w.language.bubbles < 6) fail(`a language switch left ${w.language.bubbles} bubbles`);
});

check('orbit:a-shared-link-names-the-view-and-the-node', 'The share link says orbit and the focus, and following it lands there', (c) => {
  const s = orbitOf(c).share;
  if (s.view !== 'orbit') fail(`the share link says view=${s.view}`);
  if (s.node !== 'platypus') fail(`the share link says node=${s.node}, not the focus`);
  if (s.landed.view !== 'orbit') fail(`following ?view=orbit&node=platypus landed in "${s.landed.view}"`);
  if (s.landed.focus !== 'platypus') fail(`following the link centred "${s.landed.focus}"`);
  if (s.landed.stored !== 'map') fail(`following the link rewrote the stored shell to "${s.landed.stored}"`);
});

check('i18n:orbit-translated', 'Orbit\'s words are in the reader\'s language, and a Hebrew screen has no Latin chrome', (c) => {
  const w = orbitOf(c).words;
  if (w.legend !== w.wantLegend) fail(`legend reads "${w.legend}", not "${w.wantLegend}"`);
  if (w.main !== w.wantMain) fail(`main button reads "${w.main}", not "${w.wantMain}"`);
  if (w.railLabel !== w.wantRail) fail(`the rail's Orbit button reads "${w.railLabel}", not "${w.wantRail}"`);
  if (w.untranslated.length) fail(`${w.untranslated.length} group(s) named in English: ${w.untranslated.slice(0, 3).join('; ')}`);
  if (w.leaks.length) fail(`Latin text in a Hebrew screen: ${w.leaks.slice(0, 3).join('; ')}`);
});

check('a11y:orbit-text-contrast', 'Every word in Orbit meets AA against what it sits on', (c) => {
  const k = orbitOf(c).contrast;
  if (k.hits.length) fail(`${k.hits.length} text run(s) below AA in the ${k.theme} theme: ${k.hits.slice(0, 3).join(' | ')}`);
});

check('orbit:runs-clean', 'Orbit throws nothing while it is driven', (c) => {
  const o = orbitOf(c);
  if (o.errors.length) fail(o.errors.slice(0, 3).join(' | '));
});

/* The runner seeds the language before load, so a switch made afterwards was
   never exercised. applyI18n() rewrote the rail and the title and left the
   drill-down in the language it was drawn in, because Explore paints its words
   at render time and nothing asked it to render again. */
check('i18n:explore-follows-a-runtime-language-switch', 'Switching language inside the drill-down re-draws its rows', (c) => {
  const a = c.probe.afterLoad;
  if (!a) fail('the after-load pass never ran');
  if (a.error) fail(`the after-load pass threw: ${a.error}`);
  if (a.langAfter !== a.to) fail(`the language button did not switch to ${a.to} (lang=${a.langAfter})`);
  if (!a.cardsBefore || !a.cardsAfter) fail('the drill-down had no rows to compare');
  if (a.stale.length) fail(`${a.stale.length} row(s) still in the old language after switching ${a.from} → ${a.to}: ${a.stale.join(', ')}`);
});

check('chrome:rail-view-buttons-are-on-screen', 'The rail\'s View buttons are inside the window, and nothing is over them', (c) => {
  const a = c.probe.afterLoad;
  if (!a) fail('the after-load pass never ran');
  if (a.error) fail(`the after-load pass threw: ${a.error}`);
  if (!a.railButtons || a.railButtons.length < 4) fail(`only ${(a.railButtons || []).length} View button(s) in the rail`);
  const bad = a.railButtons.filter((b) => b.x < 0 || b.right > a.viewport || b.w < 40 || !b.reachable);
  if (bad.length) fail(`${bad.length} View button(s) off-screen or covered: ` +
    bad.map((b) => `${b.label} [${b.x}..${b.right}] w=${b.w} reachable=${b.reachable}`).join('; '));
});

/* layoutCladogram() mirrors the tree in Hebrew, with the root on the right. The
   labels did not follow: they stayed on the right of every node, so each one ran
   back across its own branches and the camera framed a box they were not in.
   Fitted at 0.3 against 0.4 in English on a phone, and nothing failed, because
   every label was present, translated and on screen. Ask which side they are on. */
check('tree:cladogram-labels-sit-on-the-outward-side', 'Cladogram leaf labels point away from the root in both directions of writing', (c) => {
  const a = c.probe.afterLoad;
  if (!a) fail('the after-load pass never ran');
  if (a.error) fail(`the after-load pass threw: ${a.error}`);
  if (a.mode !== 'cladogram') fail(`the probe was not left in the cladogram (${a.mode})`);
  if (!a.cladogramLabels.length) fail('no leaf labels were drawn to measure');
  const want = a.dir === 'rtl' ? -1 : 1;
  const wrong = a.cladogramLabels.filter((l) => Math.sign(l.dx) !== want);
  if (wrong.length) {
    fail(`${wrong.length} of ${a.cladogramLabels.length} leaf label(s) sit on the root's side in ${a.dir} (e.g. ${wrong.slice(0, 3).map((l) => `${l.id} dx=${l.dx}`).join(', ')})`);
  }
});

/* The rail offers Radial and Cladogram in both shells, but they lay out the
   map. Clicked from the drill-down they used to do their work on a canvas
   nobody could see, so a visible control did nothing visible. */
check('chrome:rail-instruments-work-from-the-drill-down', 'Radial and Cladogram in the rail take a reader to the map', (c) => {
  const a = c.probe.afterLoad;
  if (!a) fail('the after-load pass never ran');
  if (a.error) fail(`the after-load pass threw: ${a.error}`);
  for (const r of a.rail) {
    if (r.startView !== 'explore') fail(`could not return to the drill-down before testing ${r.mode} (was ${r.startView})`);
    if (r.view !== 'map') fail(`${r.mode} clicked in the drill-down left the page in the ${r.view} shell`);
    if (!r.mapVisible) fail(`${r.mode} clicked in the drill-down shows no map`);
    if (!r.nodes) fail(`${r.mode} clicked in the drill-down drew no nodes`);
    if (!r.active) fail(`${r.mode} is not the active mode after clicking it`);
    /* On a phone the rail is a sheet over the page. Choosing a view from it and
       leaving it open puts the map the reader just asked for underneath it. */
    if (r.overlayRail && r.railOpenAfter) fail(`${r.mode} chosen in the phone rail left the rail open over the map`);
  }
});

// ── opening ───────────────────────────────────────────────────────────────────
/* The opening is measured from openingProbe(), which loads the page four times
   in contexts of its own (see there). Every check below runs in every scenario,
   so each language, viewport and theme meets the screen it will actually show. */
const openingOf = (c) => {
  const o = c.probe.opening;
  if (!o) fail('the opening was never probed');
  if (o.error) fail(`the opening probe threw: ${o.error}`);
  return o;
};
const openingPass = (o, name) => {
  const v = o[name];
  if (!v) fail(`the "${name}" pass of the opening probe never ran`);
  if (v.error) fail(`the "${name}" pass of the opening probe threw: ${v.error}`);
  return v;
};
/** Every plate measured for a scenario: its own language, then any language
    its viewport's other scenarios leave uncovered (see openingProbe). */
const openingPlates = (o) => [
  openingPass(o, 'plate'),
  ...(o.extraPlates || []).map((v) => { if (v.error) fail(`an extra plate pass threw: ${v.error}`); return v; }),
];
/** Which pass a message is about, when it is not the scenario's own. */
const plateTag = (c, pl) => (pl.html.lang === c.scenario.lang ? '' : ` [${pl.html.lang} plate]`);
const midX = (r) => (r.left + r.right) / 2;
const midY = (r) => (r.top + r.bottom) / 2;
const px1 = (n) => Math.round(n * 10) / 10;
/** Relative luminance of a colour written as #rgb, #rrggbb or rgb(…). */
const luminance = (css) => {
  let rgb;
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(css);
  if (m) {
    const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1];
    rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  } else {
    m = /rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/.exec(css);
    if (!m) return null;
    rgb = [m[1], m[2], m[3]].map(Number);
  }
  const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

check('opening:first-paint-needs-no-script', 'With no script at all, the opening is already in the reader\'s theme, language and direction', (c) => {
  const fp = openingPass(openingOf(c), 'firstPaint');
  const theme = c.scenario.theme === 'light' ? 'light' : 'dark';
  const dir = c.scenario.lang === 'he' ? 'rtl' : 'ltr';
  if (fp.html.theme !== theme) fail(`data-theme was "${fp.html.theme}" before any module ran; wanted "${theme}"`);
  if (fp.html.lang !== c.scenario.lang) fail(`lang was "${fp.html.lang}" before any module ran; wanted "${c.scenario.lang}"`);
  if (fp.html.dir !== dir) fail(`dir was "${fp.html.dir}" before any module ran; wanted "${dir}"`);
  if (fp.html.scheme !== theme) fail(`the browser's own canvas was told color-scheme "${fp.html.scheme}"; wanted "${theme}" — otherwise a ${theme} page opens on the wrong colour`);
  const l = luminance(fp.bg);
  if (l == null) fail(`--bg reads "${fp.bg}" before any module ran, which does not parse`);
  if (theme === 'dark' ? l > 0.15 : l < 0.6) fail(`--bg is ${fp.bg} (luminance ${l.toFixed(2)}) in the ${theme} theme`);
  if (!fp.html.returning) fail('a returning visitor was not recognised before first paint (no data-return), so they would sit through the long opening');
});

check('opening:first-paint-shows-the-instrument', 'Before any script has run, the plate, the ring and its point are already on screen, centred', (c) => {
  const { ring, sun, vw, vh, ringOpacity, splashBg } = openingPass(openingOf(c), 'firstPaint');
  /* The plate's glow and the vignette are gradients on #splash itself. A rule
     elsewhere that sets `background` on it flattens both without an error and
     without moving a pixel of the ring — theme.css did exactly that in the dark
     theme, and the light theme kept them, so half the visits lost them. */
  if (!/radial-gradient/.test(splashBg)) {
    fail(`the plate glow and the vignette are not painted (#splash has background-image "${String(splashBg).slice(0, 40)}") — a rule elsewhere is overriding css/splash.css`);
  }
  if (!ring || !ring.width) fail('the ring is not on screen before any script has run — a slow phone would see a blank page while the modules load');
  const d = Math.min(vw, vh);
  if (ring.width < d * 0.5) fail(`the ring is ${px1(ring.width)}px across in a ${vw}×${vh} window`);
  if (ring.left < 0 || ring.right > vw || ring.top < 0 || ring.bottom > vh) {
    fail(`the ring [${px1(ring.left)},${px1(ring.top)}]–[${px1(ring.right)},${px1(ring.bottom)}] runs off a ${vw}×${vh} window`);
  }
  if (Math.abs(midX(ring) - vw / 2) > 2) fail(`the ring is ${px1(midX(ring) - vw / 2)}px off the centre line`);
  if (!sun || Math.abs(midX(sun) - midX(ring)) > 2 || Math.abs(midY(sun) - midY(ring)) > 2) fail('the point of light is not at the ring\'s centre');
  if (ringOpacity < 0.5) fail(`the ring is at ${ringOpacity} opacity after a second — the first-paint animation never arrived`);
});

check('opening:first-paint-matches-the-canvas', 'The first paint (CSS) and the canvas (JS) put the ring in the same place', (c) => {
  const o = openingOf(c);
  const fp = openingPass(o, 'firstPaint'), pl = openingPass(o, 'plate');
  /* The point breathes (a scale animation) in the first-paint pass and holds
     still in the reduced-motion one, so only where it is is compared, not how
     big it is at the moment of measurement. */
  for (const [name, a, b, sized] of [['ring', fp.ring, pl.ring, true], ['point', fp.sun, pl.sun, false]]) {
    if (!a || !b) fail(`the ${name} is missing from one of the two passes`);
    const off = Math.max(Math.abs(midX(a) - midX(b)), Math.abs(midY(a) - midY(b)), sized ? Math.abs(a.width - b.width) : 0);
    if (off > 1.5) {
      fail(`the ${name} jumps ${px1(off)}px when the canvas takes over (CSS: centre ${px1(midX(a))},${px1(midY(a))} ⌀${px1(a.width)}; JS: ${px1(midX(b))},${px1(midY(b))} ⌀${px1(b.width)}) — the arithmetic in css/splash.css has drifted from geometry() in js/splashScene.js`);
    }
  }
});

check('opening:words-are-in-the-readers-language', 'The title, the line beneath it, the hint and Skip are in the language they were loaded in', (c) => {
  for (const pl of openingPlates(openingOf(c))) {
    const lang = pl.html.lang, w = pl.want;
    if (!w) fail(`the translations could not be read on the page${plateTag(c, pl)}`);
    for (const [label, got, key] of [['title', pl.titleText, 'title'], ['line beneath it', pl.subText, 'splash_subtitle'],
                                     ['hint', pl.hintText, 'splash_click'], ['skip button', pl.skipText, 'splash_skip']]) {
      if (!w[key]) fail(`there is no ${lang} translation for "${key}"`);
      if (got !== w[key]) fail(`the ${label} reads "${got}" in ${lang}; the translation is "${w[key]}"${plateTag(c, pl)}`);
    }
  }
});

/* Sizes the title and the line beneath it start from, and shrink from only when
   they do not fit. Keep in step with placeWords() in js/splash.js. */
const OPENING_START_PX = { title: { small: 27, wide: 34 }, sub: { small: 10, wide: 12 } };
check('opening:title-fits-the-plaque', 'The title and the line beneath it sit inside the plaque, as large as they can be', (c) => {
  for (const pl of openingPlates(openingOf(c))) {
    const small = pl.vw < 600;
    const plaque = pl.plaque;
    const tag = plateTag(c, pl);
    if (!plaque || !plaque.width) fail(`the plaque is not laid out${tag}`);
    for (const [label, box, px, start] of [['title', pl.title, pl.titlePx, OPENING_START_PX.title], ['line beneath it', pl.sub, pl.subPx, OPENING_START_PX.sub]]) {
      if (!box || !box.width) fail(`the ${label} is not laid out${tag}`);
      const margin = plaque.width * 0.05;
      if (box.left < plaque.left + margin || box.right > plaque.right - margin) {
        fail(`the ${label} runs ${px1(box.left)}–${px1(box.right)} in a plaque ${px1(plaque.left)}–${px1(plaque.right)} (${px1(px)}px type)${tag}`);
      }
      /* The fitting shrinks in steps of 7%, so a line it had to shrink ends up
         within 7% of the room it was fitted to. One far narrower than that was
         shrunk for nothing — which is what a measurement taken while the size
         was still animating looks like, and it cost the English line 14% of its
         size on every phone that asked for reduced motion. */
      const startPx = small ? start.small : start.wide;
      if (px < startPx - 0.05 && box.width < plaque.width * 0.75) {
        fail(`the ${label} was shrunk from ${startPx}px to ${px1(px)}px but fills only ${Math.round((box.width / plaque.width) * 100)}% of the plaque — it was shrunk further than it needed to be${tag}`);
      }
      if (px < 8.5) fail(`the ${label} is ${px1(px)}px — too small to read${tag}`);
    }
    if (pl.titleOpacity < 0.99) fail(`the title is at ${pl.titleOpacity} opacity on the finished plate${tag}`);
  }
});

check('opening:nothing-collides', 'The dial, the plaque, the hint, the scale and Skip do not overlap and stay on screen', (c) => {
  for (const pl of openingPlates(openingOf(c))) {
    const { ring, plaque, hint, skip, vw, vh } = pl;
    const tag = plateTag(c, pl);
    const named = { plaque, hint, skip, title: pl.title, 'line beneath the title': pl.sub };
    for (const [name, r] of Object.entries(named)) {
      if (!r || !r.width) fail(`the ${name} is not laid out${tag}`);
      if (r.left < -0.5 || r.right > vw + 0.5 || r.top < -0.5 || r.bottom > vh + 0.5) {
        fail(`the ${name} [${px1(r.left)},${px1(r.top)}]–[${px1(r.right)},${px1(r.bottom)}] leaves a ${vw}×${vh} window${tag}`);
      }
    }
    /* The readout counting down to the present shares the gap between the dial
       and the plaque; it fades as the plaque opens, and for a moment both are
       on screen. Wherever it sits it must not be under the plaque's rules, which
       once ran through the word "present". */
    const counter = pl.counter;
    if (!counter || !counter.width) fail(`the counter is not laid out${tag}`);
    if (overlap(counter, plaque)) fail(`the counter [${px1(counter.top)}–${px1(counter.bottom)}] is under the plaque [${px1(plaque.top)}–${px1(plaque.bottom)}]${tag}`);
    if (counter.top < ring.bottom || counter.bottom > vh) fail(`the counter [${px1(counter.top)}–${px1(counter.bottom)}] is inside the dial or off screen${tag}`);
    if (plaque.top - 10 < ring.bottom) fail(`the plaque (top ${px1(plaque.top)}) touches the dial (bottom ${px1(ring.bottom)})${tag}`);
    if (hint.top < plaque.bottom) fail(`the hint (top ${px1(hint.top)}) starts inside the plaque (bottom ${px1(plaque.bottom)})${tag}`);
    for (const [name, r] of [['plaque', plaque], ['hint', hint], ['dial', ring]]) {
      if (overlap(skip, r)) fail(`the Skip button is painted over the ${name}${tag}`);
    }
    const labels = pl.scale;
    if (!labels.length) fail(`the scale labels are missing from the dial${tag}`);
    labels.forEach((l, i) => {
      if (l.left < ring.left || l.right > ring.right || l.bottom > ring.bottom) fail(`the scale label "${l.text}" is outside the dial${tag}`);
      for (const other of labels.slice(i + 1)) if (overlap(l, other)) fail(`the scale labels "${l.text}" and "${other.text}" overlap${tag}`);
      if (overlap(l, plaque)) fail(`the scale label "${l.text}" runs into the plaque${tag}`);
    });
  }
});

/* What the two canvases hold when the show has run its course. The bounds are a
   third to a half of what a healthy frame measures on every viewport here
   (tree 17–19%, dial 1.9–2.4%), so a slow runner cannot trip them and a canvas
   that draws nothing, or draws in the wrong place, always does. */
check('opening:canvas-draws', 'The finished frame has a tree on the live canvas and a dial on the still one, centred', (c) => {
  const pl = openingPass(openingOf(c), 'plate');
  if (!pl.live) fail('the live canvas has no 2D context or no size');
  if (!pl.under) fail('the still canvas has no 2D context or no size');
  if (pl.live.fraction < 0.06) fail(`only ${(pl.live.fraction * 100).toFixed(1)}% of the live canvas is painted — the tree is missing`);
  if (pl.under.fraction < 0.005) fail(`only ${(pl.under.fraction * 100).toFixed(2)}% of the still canvas is painted — the dial is missing`);
  for (const [name, v] of [['tree', pl.live], ['dial', pl.under]]) {
    if (Math.abs(v.centreX - 0.5) > 0.05) fail(`the ${name} is drawn off-centre (mean x at ${(v.centreX * 100).toFixed(1)}% of the canvas)`);
  }
});

check('opening:animates', 'A first visit really does grow: the tree is far fuller a few seconds in', (c) => {
  const lv = openingPass(openingOf(c), 'live');
  if (!lv.firstVisit) fail('a first visit was treated as a return (data-return was set with nothing stored)');
  if (!lv.early || !lv.later) fail('the live canvas could not be read');
  /* The show follows the wall clock, so a slow runner drops frames rather than
     falling behind; the bounds still leave room for one that is slow to start.
     A healthy machine measures 1.8% early and 16–18% later. */
  if (lv.later.fraction < 0.03) fail(`three seconds in, only ${(lv.later.fraction * 100).toFixed(1)}% of the canvas is painted`);
  if (lv.later.fraction < lv.early.fraction * 2) {
    fail(`the canvas went from ${(lv.early.fraction * 100).toFixed(1)}% painted to ${(lv.later.fraction * 100).toFixed(1)}% in 2.4 s — the show is not running`);
  }
});

check('opening:a-late-font-does-not-blink-the-scale', 'A web font arriving mid-show re-fits the title without making the scale labels disappear', (c) => {
  const { blink } = openingPass(openingOf(c), 'live');
  if (!blink || !blink.before.length) fail('there were no scale labels to watch');
  blink.before.forEach((b, i) => {
    const a = blink.after[i];
    if (b < 0.4) fail(`scale label ${i + 1} was only at ${b} opacity before the font arrived — the show had not lit it`);
    if (a < b - 0.1) fail(`scale label ${i + 1} dropped from ${b} to ${a} opacity when a font arrived: it was rebuilt, and rebuilt labels fade in from nothing`);
  });
});

check('opening:reduced-motion-holds-still', 'With reduced motion the finished plate is painted at once, nothing moves, and it leaves by itself', (c) => {
  const pl = openingPass(openingOf(c), 'plate');
  if (!/\bshow-plaque\b/.test(pl.splashClass) || !/\bshow-hint\b/.test(pl.splashClass)) {
    fail(`the plate is not complete (#splash is "${pl.splashClass}")`);
  }
  if (pl.running.length) fail(`${pl.running.length} animation(s) still running under reduced motion: ${pl.running.join(', ')}`);
  if (!pl.autoDismissed) fail('the plate never left by itself');
  if (pl.seenAfter !== '1') fail('leaving did not record that the opening has been seen');
});

check('opening:leaves-by-keyboard', 'Escape, Enter or Space ends the opening, and it remembers having been seen', (c) => {
  const lv = openingPass(openingOf(c), 'live');
  if (!lv.dismissed) fail(`pressing ${lv.key} did not dismiss the opening`);
  if (lv.seenAfter !== '1') fail(`leaving with ${lv.key} did not record that the opening has been seen`);
});

check('opening:skip-sits-in-the-inline-end-corner', 'Skip is visible, on screen, and in the corner the reading direction ends in', (c) => {
  for (const pl of openingPlates(openingOf(c))) {
    const { skip, vw, vh } = pl;
    const tag = plateTag(c, pl);
    if (!skip || !skip.width) fail(`there is no Skip button${tag}`);
    if (pl.skipOpacity < 0.99) fail(`Skip is at ${pl.skipOpacity} opacity${tag}`);
    if (skip.left < 0 || skip.right > vw || skip.top < 0 || skip.bottom > vh) fail(`Skip is off screen${tag}`);
    const rtl = pl.html.lang === 'he';
    if (rtl ? skip.right > vw / 2 : skip.left < vw / 2) fail(`Skip is on the ${rtl ? 'right' : 'left'} in a ${rtl ? 'right-to-left' : 'left-to-right'} language${tag}`);
  }
});

check('opening:no-canvas-fallback', 'Without a 2D canvas the words still show and the same ways out work', (c) => {
  const n = openingPass(openingOf(c), 'noCanvas');
  if (!/\bno-canvas\b/.test(n.splashClass)) fail(`#splash never took the no-canvas path (it is "${n.splashClass}")`);
  if (!n.fallback || n.fallback.display === 'none') fail('the fallback words are hidden');
  if (n.fallback.title !== n.expectedTitle) fail(`the fallback title reads "${n.fallback.title}"; the ${c.scenario.lang} translation is "${n.expectedTitle}"`);
  if (n.wordsDisplay !== 'none') fail('the canvas-dependent words are still laid out, over the fallback');
  if (!n.dismissed) fail('clicking the fallback did not dismiss the opening');
});

check('opening:a-broken-opening-does-not-trap-the-visitor', 'If the scene cannot be built the curtain still comes down, the site is there, and the error is reported', (c) => {
  const b = openingPass(openingOf(c), 'broken');
  if (!b.cleared) fail('the opening is still up six seconds after its scene threw — a visitor would be stuck behind it');
  if (b.covered) fail('the curtain is down but something of it still covers the stage');
  if (b.nodes < 20) fail(`only ${b.nodes} node(s) rendered behind a failed opening`);
  if (!b.reported) fail('the failure was swallowed: nothing reached the page\'s error handler, so no report would ever show it');
});

/* Two things made a slow phone miss the title, and both are guarded here. The
   show once added up capped frame steps, which plays it in slow motion; and the
   safety net once counted from when the script ran, so a long stall between
   then and the first frame ate the show's time. The pass simulates the device
   in the page — a stall after start-up and slow frames — rather than throttling
   the CPU, so it means the same on a laptop and on a small CI runner. */
check('opening:a-slow-phone-still-gets-the-title', 'On a device that stalls for four seconds after start-up and draws six frames a second, the title is still engraved on time and before the opening leaves', (c) => {
  const sl = openingPass(openingOf(c), 'slow');
  if (sl.live == null) fail('the opening never went live on the simulated slow device');
  if (sl.plaque == null) fail('the opening left without ever engraving its title — on a slow phone the visitor would never see it');
  if (sl.gone != null && sl.plaque >= sl.gone) fail('the title arrived only as the opening was leaving');
  const lag = sl.plaque - sl.live;
  if (lag > 5000) fail(`the title took ${Math.round(lag)} ms after the first frame to arrive (due at 3150 ms; a few slow frames allowed for)`);
  /* And not early either. The timestamp a frame is handed is when it began, and
     a long task in front of the first one leaves it stale by that long: a clock
     started from it begins the show already seconds in and skips it. */
  if (lag < 2500) fail(`the title arrived only ${Math.round(lag)} ms after the first frame (due at 3150 ms) — the show was skipped ahead by the start-up stall`);
}, (sc) => OPENING_SLOW_SCENARIOS.includes(sc.id));

check('opening:a-link-to-a-species-has-no-opening', 'A link that names a species or a view goes straight to it: no opening, nothing covering the page, and the visit is not marked as having seen one', (c) => {
  const d = openingPass(openingOf(c), 'deepLink');
  if (!d.attr) fail('js/boot.js did not mark the page as having no opening');
  if (d.display !== 'none') fail(`#splash is "${d.display}" for a link to a species`);
  if (d.live) fail('the opening went live for a link to a species');
  if (d.played !== null) fail(`the visit was marked "${d.played}" although no opening played, so the next entrance would be denied its opening`);
  if (d.intro) fail('the old title card (.intro-overlay) is covering a page that has no opening — it would be the only thing on screen for four seconds');
  if (!(d.cards > 0)) fail('the page the link names never showed its content');
}, (sc) => OPENING_ENTRANCE_SCENARIOS.includes(sc.id));

check('opening:the-opening-plays-once-per-visit', 'The first entrance to the encyclopedia plays the opening and marks the visit; a second entrance in the same tab does not play it again', (c) => {
  const t = openingPass(openingOf(c), 'twice');
  if (t.first.attr) fail('the first entrance was already marked as having no opening');
  if (t.first.played !== '1') fail(`the first entrance did not mark the visit (sessionStorage says ${JSON.stringify(t.first.played)}), so every entrance would replay it`);
  if (!t.second.attr) fail('the second entrance in one visit was not marked as having no opening');
  if (t.second.display !== 'none') fail(`#splash is "${t.second.display}" on the second entrance`);
  if (t.second.live) fail('the opening played a second time in one visit');
  if (t.second.intro) fail('the old title card (.intro-overlay) appeared on an entrance that has no opening');
  if (!(t.second.cards > 0)) fail('the second entrance never showed its content');
}, (sc) => OPENING_ENTRANCE_SCENARIOS.includes(sc.id));

check('opening:runs-clean', 'The opening throws nothing and breaks no Content-Security-Policy rule, in any of its passes', (c) => {
  const o = openingOf(c);
  if (o.errors && o.errors.length) fail(`${o.errors.length} uncaught error(s): ${o.errors[0]}`);
  if (o.violations && o.violations.length) fail(`${o.violations.length} CSP violation(s): ${o.violations.slice(0, 3).join('; ')}`);
});

/* ── The name, asked for after a game ───────────────────────────────────────
   Measured from nameProbe(), which plays games in contexts of its own (see
   there). Every scenario measures the card in its own language, viewport and
   theme; the one desktop and one phone scenario in NAME_FULL_SCENARIOS also
   carry the rest of the story.

   A pass keeps what it measured up to the step that failed, so each check reads
   only what it needs and one broken thing does not turn all of them red: a
   check that needs a step the pass never reached says where it stopped. */
const nameOf = (c) => {
  const n = c.probe.name;
  if (!n) fail('the name probe never ran');
  if (n.error) fail(`the name probe threw: ${n.error}`);
  return n;
};
const namePass = (n, key) => {
  const v = n[key];
  if (!v) fail(`the "${key}" pass of the name probe never ran`);
  return v;
};
/** What a pass measured at some step — or where it stopped and why. */
const reached = (v, step, what) => {
  if (v[step] === undefined) fail(`${what} was never reached — the pass stopped: ${v.error || 'no reason given'}`);
  return v[step];
};
/** Every card measured for a scenario: its own language, then any the viewport's other scenarios leave uncovered. */
const nameCards = (n) => [namePass(n, 'visitor'), ...(n.extra || [])].map((v) => {
  const s = reached(v, 'scored', 'the first game that scored');
  if (!s.card) fail(`no offer for a name was on screen after a game that scored ${s.score}${s.shown ? '' : ' (and the results never showed)'}`);
  return s.card;
});
const cardTag = (c, card) => (card.lang === c.scenario.lang ? '' : ` [${card.lang} card]`);
const nameFull = (sc) => NAME_FULL_SCENARIOS.includes(sc.id);
const names = (players) => JSON.stringify((players || []).map((p) => p.name));
const NO_NAME_KEPT = 'no name was kept, so there is no player to credit (see profile:keeping-the-name-keeps-the-score)';

check('load:no-native-dialogs', 'The site never raises a native alert, confirm or prompt — not on load, not five seconds in, not after a game', (c) => {
  const all = [...(c.dialogs || []), ...((c.probe.name && c.probe.name.dialogs) || [])];
  if (all.length) fail(`${all.length} native dialog(s): ${[...new Set(all)].slice(0, 3).join('; ')}`);
});

check('profile:a-first-visit-is-not-interrupted', 'A first visit that only looks around is not asked for a name: seven quiet seconds bring no dialog, no offer, no player and no record of having asked', (c) => {
  const i = reached(namePass(nameOf(c), 'visitor'), 'idle', 'the quiet wait');
  if (i.dialogs.length) fail(`a native dialog appeared within seven quiet seconds: ${i.dialogs[0]}`);
  if (i.offer) fail('an offer for a name was on screen after seven quiet seconds');
  if (i.players && i.players.length) fail(`a player was made after seven quiet seconds: ${names(i.players)}`);
  if (i.active) fail(`an active player was set after seven quiet seconds: "${i.active}"`);
  if (i.asked) fail('the name was already marked as asked after seven quiet seconds');
}, nameFull);

check('profile:looking-around-does-not-make-a-guest', 'A visitor who has opened species on an earlier visit is not turned into a Guest on their return, which would settle the question of a name before it was asked', (c) => {
  const a = reached(namePass(nameOf(c), 'explorer'), 'arrived', 'the explorer\'s arrival');
  if (a.players && a.players.length) fail(`a returning explorer was made a player on arrival: ${names(a.players)}`);
  if (a.active) fail(`a returning explorer was given an active player on arrival: "${a.active}"`);
}, nameFull);

check('profile:the-name-is-asked-after-a-game-that-scored', 'The first game that scores ends with an offer to keep the score under a name; a game that scored nothing does not use it up', (c) => {
  const n = nameOf(c);
  const v = namePass(n, 'visitor');
  if (n.errors && n.errors.length) fail(`${n.errors.length} uncaught error(s) while playing: ${n.errors[0]}`);
  const zero = reached(v, 'zero', 'the game that scores nothing');
  if (!zero.shown) fail('a game that scored nothing never reached its results');
  if (zero.offer) fail('a game that scored nothing already asked for a name — there was no score to keep');
  if (zero.asked) fail('a game that scored nothing used up the one ask');
  if (v.daily !== undefined) {
    if (!v.daily.shown) fail('the Daily Challenge never reached its results');
    if (v.daily.offer) fail('the Daily Challenge, which shows no points, asked for a name — there was no score on screen to keep');
    if (v.daily.asked) fail('the Daily Challenge used up the one ask');
  }
  const scored = reached(v, 'scored', 'the first game that scored');
  if (!scored.shown) fail('the first game that scored never reached its results');
  if (!(scored.score > 0)) fail(`the game meant to score did not (${scored.score}) — the probe, not the offer, is at fault`);
  if (!scored.offer) fail(`the results of a game that scored ${scored.score} carry no offer for a name`);
  if (scored.players && scored.players.length) fail(`a player was made before anyone was asked: ${names(scored.players)}`);
  if (scored.asked !== '1') fail('the ask was shown but not recorded, so it would be shown again after every game');
  if (n.explorer) {
    const x = reached(namePass(n, 'explorer'), 'scored', 'the explorer\'s first game that scored');
    if (!x.offer) fail(`a returning explorer's first game that scored ${x.score} (a Quick Quiz) carried no offer for a name`);
  }
});

check('profile:the-offer-speaks-the-readers-language', 'The offer\'s title, sentence, field, Save and Not now are in the language the site was loaded in, and the field and the card are named for a screen reader', (c) => {
  for (const card of nameCards(nameOf(c))) {
    const tag = cardTag(c, card);
    for (const k of ['title', 'body', 'placeholder', 'save', 'skip']) {
      if (!card.want[k]) fail(`${card.lang} has no translation for name_offer_${k === 'body' ? 'text' : k}${tag}`);
      if ((card.text[k] || '').trim() !== card.want[k]) fail(`the ${k} reads "${(card.text[k] || '').trim()}"; ${card.lang} says "${card.want[k]}"${tag}`);
    }
    if (!card.named) fail(`the name field has no accessible name in ${card.lang}${tag}`);
    if (!card.labelled) fail(`the card is not a labelled group for a screen reader${tag}`);
  }
});

check('profile:the-offer-fits-and-is-reachable', 'The offer sits inside the screen and inside the reading direction, its field and buttons are inside it, thumb-sized and not covered, and the page gains no sideways scroll', (c) => {
  for (const card of nameCards(nameOf(c))) {
    const tag = cardTag(c, card);
    const { offer, input, save, skip, vw, vh } = card;
    if (offer.left < -0.5 || offer.right > vw + 0.5) fail(`the card runs off the screen: ${px1(offer.left)}–${px1(offer.right)} in a ${vw}px window${tag}`);
    if (offer.top < -0.5 || offer.bottom > vh + 0.5) fail(`the card cannot be brought fully into view: ${px1(offer.top)}–${px1(offer.bottom)} in a ${vh}px window${tag}`);
    if (card.scrollW > vw + 1) fail(`the page scrolls sideways: ${card.scrollW}px wide in a ${vw}px window${tag}`);
    const want = card.lang === 'he' ? 'rtl' : 'ltr';
    if (card.dir !== want) fail(`the card reads ${card.dir}; ${card.lang} reads ${want}${tag}`);
    for (const [name, r] of [['field', input], ['Save', save], ['Not now', skip]]) {
      if (r.left < offer.left - 0.5 || r.right > offer.right + 0.5) fail(`${name} runs out of the card: ${px1(r.left)}–${px1(r.right)} against ${px1(offer.left)}–${px1(offer.right)}${tag}`);
      if (r.height < 40) fail(`${name} is ${px1(r.height)}px tall — too small for a thumb${tag}`);
    }
    for (const [name, by] of Object.entries(card.covered)) {
      if (by) fail(`${name} is painted over by <${by}> at its centre${tag}`);
    }
    if (card.inputPx < 16) fail(`the field's text is ${card.inputPx}px; under 16px a phone zooms the page in when it takes focus${tag}`);
    // the field and Save share a row, the field first in the reading direction
    if (Math.abs(midY(input) - midY(save)) > input.height / 2) fail(`Save has wrapped away from the field (${px1(midY(input))} vs ${px1(midY(save))})${tag}`);
    if (card.lang === 'he' ? midX(input) <= midX(save) : midX(input) >= midX(save)) fail(`the field is not first in the reading direction${tag}`);
  }
});

check('profile:the-offer-is-legible', 'Every word of the offer meets AA contrast in this scenario\'s theme', (c) => {
  for (const card of nameCards(nameOf(c))) {
    if (card.contrast === null) fail('the contrast sweep was not on the page');
    if (card.contrast.length) fail(`${card.contrast.length} low-contrast text(s): ${card.contrast.slice(0, 3).join('; ')}${cardTag(c, card)}`);
  }
});

check('profile:keeping-the-name-keeps-the-score', 'Typing a name and pressing Save (the keyboard on a desktop, a tap on a phone) stores that player, makes them the active one, credits the score shown, and says so in the reader\'s language', (c) => {
  const n = nameOf(c);
  const v = namePass(n, n.explorer ? 'explorer' : 'visitor');
  const before = reached(v, 'scored', 'the first game that scored');
  if (!before.card) fail(`there was no offer to keep a name under (a game that scored ${before.score})`);
  const kept = reached(v, 'kept', 'keeping the name');
  if (kept.skipped) fail(kept.skipped);
  const typed = kept.typed || NAME_TYPED[c.scenario.lang];
  if (!kept.players || kept.players.length !== 1) fail(`${kept.players ? kept.players.length : 0} player(s) stored after Save; wanted one — ${names(kept.players)}`);
  const p = kept.players[0];
  if (p.name !== typed) fail(`the stored name is "${p.name}"; "${typed}" was typed`);
  if (kept.active !== typed) fail(`the active player is "${kept.active}"; wanted "${typed}"`);
  if (p.totalPoints !== before.score) fail(`the score shown was ${before.score} and the player was credited ${p.totalPoints}`);
  if (kept.offer) fail('the card is still asking after the name was kept');
  if (!kept.focusIn) fail('keyboard focus was lost to the top of the page when the field went away');
  const want = String(before.card.wantSaved).replace('{name}', typed).replace('{pts}', String(before.score));
  if ((kept.done || '').trim() !== want) fail(`the confirmation reads "${(kept.done || '').trim()}"; wanted "${want}"`);
});

check('profile:a-declined-offer-is-not-repeated', 'Not now removes the card, makes no player and is remembered: the next game does not ask again', (c) => {
  const v = namePass(nameOf(c), 'visitor');
  const d = reached(v, 'declined', 'the decline');
  if (d.skipped) fail(d.skipped);
  if (d.offer) fail('the card is still on screen after Not now');
  if (d.players && d.players.length) fail(`Not now made a player: ${names(d.players)}`);
  if (d.asked !== '1') fail('Not now was not remembered');
  if (!d.focusIn) fail('keyboard focus was lost to the top of the page when the card went away');
  const next = reached(v, 'next', 'the game after the decline');
  if (!next.shown) fail('the game after a decline never reached its results');
  if (next.offer) fail('the game after Not now asked for a name again');
  if (next.players && next.players.length) fail(`a player was made by the game after Not now: ${names(next.players)}`);
}, nameFull);

check('profile:a-named-player-earns-points-without-being-asked-again', 'Once a name is kept, every game adds its score to that player and none asks again', (c) => {
  const x = namePass(nameOf(c), 'explorer');
  const foe = reached(x, 'foe', 'Family or Foe');
  const scored = reached(x, 'scored', 'the first game that scored');
  if (!foe.shown) fail('Family or Foe never reached its results');
  if (foe.offer) fail('a named player was asked for a name again after Family or Foe');
  const p = foe.players && foe.players[0];
  if (!p) fail(NO_NAME_KEPT);
  const want = scored.score + foe.score;
  if (p.totalPoints !== want) fail(`after Family or Foe (${foe.score} pts) on top of ${scored.score}, the player has ${p.totalPoints}; wanted ${want}`);
}, nameFull);

check('profile:a-game-is-scored-once', 'A game whose results are reached twice at once is still credited once', (c) => {
  const x = namePass(nameOf(c), 'explorer');
  const classic = reached(x, 'classic', 'Classic');
  const scored = reached(x, 'scored', 'the first game that scored');
  const foe = reached(x, 'foe', 'Family or Foe');
  if (!classic.shown) fail('Classic never reached its results');
  if (!(classic.score > 0)) fail(`the game meant to score did not (${classic.score}) — the probe, not the guard, is at fault`);
  if (classic.offer) fail('a named player was asked for a name again after Classic');
  const p = classic.players && classic.players[0];
  if (!p) fail(NO_NAME_KEPT);
  const want = scored.score + foe.score + classic.score;
  if (p.totalPoints !== want) fail(`Classic scored ${classic.score}, reached twice; the player has ${p.totalPoints} against ${scored.score + foe.score} before it — wanted ${want}`);
}, nameFull);

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

/* The contrast arithmetic, installed on the page rather than written inline,
   because it has to run twice: once over the map and once inside the
   drill-down, which is a different shell reached much later in the probe.

   One copy, deliberately. Two sweeps with two sets of thresholds drift — the
   second gets a rounder number or forgets that 18.66px at weight 700 counts as
   large text — and then the two views are held to quietly different standards.

   Colour is where a dark-first design fails silently: the reveal panel painted
   itself near-black while its text followed the theme, so in light mode
   "Collapse All" sat at a ratio of 1.15 — present in the DOM, invisible on
   screen. Measured against the effective background (walking up through
   transparent ancestors), to the WCAG AA thresholds. Text that is only emoji is
   skipped: it carries its own colours. */
function installContrastSweep() {
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

  window.__contrastSweep = (root) => {
    const out = [];
    for (const el of (root || document.body).querySelectorAll('*')) {
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
}

// ── Probe: the opening screen ─────────────────────────────────────────────────
/* The opening is the first thing every visitor sees, and none of the sweeps
   below can reach it: the runner seeds `tol-splash-seen` and clicks Skip, so by
   the time a probe runs the splash is a display:none div. It gets page loads of
   its own, each in a fresh context and each in the scenario's own viewport,
   language and theme:

     first paint  js/app.js aborted — what a visitor sees while forty modules
                  load, or if one never arrives;
     the plate    reduced motion, which paints the finished frame at once and so
                  can be measured without waiting on a clock;
     live         a first visit, sampled while it runs, then left by keyboard;
     no canvas    getContext refused: the path nothing else ever takes;
     broken       the scene module throws while building: the opening is
                  decoration, and must not be what stands between a visitor and
                  the site;
     slow         a first visit on a simulated slow device (a four-second stall
                  after start-up, then six frames a second), in the scenarios
                  that run it: the title still has to be engraved before the
                  opening leaves.

   The plate is measured rather than the moving picture because the moving
   picture is a function of time, and a check that has to wait for 3.15 seconds
   of animation to reach the title is a check that flakes on a slow runner. */
const OPENING_KEYS = ['Escape', 'Enter', 'Space'];
/* The slow pass takes about fifteen seconds, and the behaviour it guards does not
   depend on language or theme, so one desktop and one phone scenario run it. */
const OPENING_SLOW = { stallMs: 4000, frameMs: 150 };
const OPENING_SLOW_SCENARIOS = ['desktop-en', 'phone-en'];
/* The entrance rules (no opening for a link to a species, none the second time in a
   visit) do not depend on language or theme either. */
const OPENING_ENTRANCE_SCENARIOS = ['desktop-en', 'phone-en'];

async function openingProbe(page, scenario, baseUrl) {
  const browser = page.context().browser();
  const vp = scenario.viewport;
  const errors = [];

  async function open({ lang = scenario.lang, seen = false, reduced = false, noCanvas = false, blockApp = false, brokenScene = false, slow = null }) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile, hasTouch: vp.hasTouch,
      deviceScaleFactor: vp.deviceScaleFactor || 1,
      locale: lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US',
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    await ctx.addInitScript((cfg) => {
      localStorage.setItem('tol-lang', cfg.lang);
      localStorage.setItem('theme', cfg.theme);
      localStorage.setItem('tol-shell-view', 'map');
      localStorage.setItem('tol-tour-done', '1');
      if (cfg.seen) localStorage.setItem('tol-splash-seen', '1');
      // Only the opening's own canvases are refused; the rest of the page still draws.
      if (cfg.noCanvas) {
        const real = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (...a) {
          return this.id && this.id.startsWith('splash') ? null : real.apply(this, a);
        };
      }
      /* Whether the old title card ever appeared: it lives for four seconds and a probe that
         samples once can miss it, so the page remembers. */
      window.__introSeen = false;
      new MutationObserver(() => { if (!window.__introSeen && document.querySelector('.intro-overlay')) window.__introSeen = true; })
        .observe(document, { childList: true, subtree: true });
      window.__cspViolations = [];
      document.addEventListener('securitypolicyviolation', (e) => {
        window.__cspViolations.push(`${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`);
      });
      // When the opening went live, engraved its title and left, on the page's own clock
      window.__show = { live: null, plaque: null, gone: null };
      /* performance.now() when the frame runs, not the timestamp the frame was
         handed: that is when it began, and a long task in front of it leaves it
         stale by the length of the task. */
      const tick = () => {
        const t = performance.now();
        const s = document.getElementById('splash');
        if (s) {
          const S = window.__show;
          if (S.live === null && s.classList.contains('is-live')) S.live = t;
          if (S.plaque === null && s.classList.contains('show-plaque')) S.plaque = t;
          if (S.gone === null && S.live !== null && getComputedStyle(s).display === 'none') S.gone = t;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      /* A slow device, made in the page: every frame costs frameMs of main-thread
         time, and the first request for a frame after the opening goes live is
         preceded by a stall — the rest of init(), which on a slow phone is
         seconds long. Busy-waiting instead of throttling the CPU makes it the
         same device on every runner. */
      if (cfg.slow) {
        const busy = (ms) => { const t0 = performance.now(); while (performance.now() - t0 < ms) { /* wait */ } };
        const raf = window.requestAnimationFrame.bind(window);
        let stalled = false, lastFrame = -1;
        window.requestAnimationFrame = (cb) => {
          const s = document.getElementById('splash');
          if (!stalled && s && s.classList.contains('is-live')) { stalled = true; Promise.resolve().then(() => busy(cfg.slow.stallMs)); }
          // one frame's cost per frame, however many callbacks share it
          return raf((ts) => { if (ts !== lastFrame) { lastFrame = ts; busy(cfg.slow.frameMs); } cb(ts); });
        };
      }
    }, { lang, theme: scenario.theme || 'dark', seen, noCanvas, slow });
    if (blockApp) await ctx.route('**/js/app.js', (r) => r.abort());
    // the module the opening's picture lives in, replaced by one that cannot build
    if (brokenScene) {
      await ctx.route('**/js/splashScene.js', (r) => r.fulfill({
        status: 200, contentType: 'text/javascript',
        body: 'export const DURATION = 4.5, T_TITLE = 3.15, T_HINT = 4.0; export function buildScene() { throw new Error("scene failed to build"); }',
      }));
    }
    const p = await ctx.newPage();
    const own = [];
    /* An error thrown on purpose belongs to the pass that threw it, not to the
       shared list opening:runs-clean reads. */
    p.on('pageerror', (e) => { const m = String(e && e.message ? e.message : e); own.push(m); if (!brokenScene) errors.push(m); });
    return { ctx, p, own };
  }

  /* What is on screen, in one pass. Text rectangles come from a Range so a
     full-width block reports the width of its words rather than of its box. */
  const measure = (p) => p.evaluate(async () => {
    const $ = (s) => document.querySelector(s);
    const rect = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, width: b.width, height: b.height };
    };
    const words = (el) => {
      if (!el) return null;
      const r = document.createRange(); r.selectNodeContents(el);
      const b = r.getBoundingClientRect();
      return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, width: b.width, height: b.height };
    };
    const px = (el, prop) => (el ? parseFloat(getComputedStyle(el)[prop]) : 0);
    const root = document.documentElement;
    const splash = $('#splash');
    const meta = $('meta[name="color-scheme"]');
    const T = await import(new URL('js/uiData.js', location.href).href).then((m) => m.TRANSLATIONS).catch(() => null);
    const tr = T && T[root.lang];
    const cover = (id) => {
      const c = document.getElementById(id);
      const x = c && c.getContext && c.getContext('2d');
      if (!x || !c.width || !c.height) return null;
      const d = x.getImageData(0, 0, c.width, c.height).data;
      let n = 0, sx = 0;
      const step = 3;                                    // every third pixel is plenty for a fraction
      for (let y = 0; y < c.height; y += step) {
        for (let xx = 0; xx < c.width; xx += step) {
          if (d[(y * c.width + xx) * 4 + 3] > 8) { n++; sx += xx; }
        }
      }
      const total = Math.ceil(c.height / step) * Math.ceil(c.width / step);
      return { fraction: n / total, centreX: n ? sx / n / c.width : 0.5 };
    };
    return {
      vw: innerWidth, vh: innerHeight,
      html: {
        theme: root.getAttribute('data-theme'), lang: root.lang, dir: root.dir,
        returning: root.hasAttribute('data-return'), scheme: meta && meta.getAttribute('content'),
      },
      bg: getComputedStyle(root).getPropertyValue('--bg').trim(),
      splashBg: splash ? getComputedStyle(splash).backgroundImage : '',
      splashDisplay: splash ? getComputedStyle(splash).display : 'missing',
      splashClass: splash ? splash.className : '',
      ring: rect($('.sp-ring')), sun: rect($('.sp-sun')), ringOpacity: px($('.sp-ring'), 'opacity'),
      want: tr && { title: tr.title, splash_subtitle: tr.splash_subtitle, splash_click: tr.splash_click, splash_skip: tr.splash_skip },
      plaque: rect($('#sw-plaque')),
      counter: words($('#sw-counter')),
      title: words($('#sw-title')), titleText: ($('#sw-title') || {}).textContent, titlePx: px($('#sw-title'), 'fontSize'),
      sub: words($('#sw-sub')), subText: ($('#sw-sub') || {}).textContent, subPx: px($('#sw-sub'), 'fontSize'),
      titleOpacity: px($('#sw-title'), 'opacity'),
      hint: words($('#sw-hint')), hintText: ($('#sw-hint') || {}).textContent, hintOpacity: px($('#sw-hint'), 'opacity'),
      skip: rect($('#splash-skip')), skipText: ($('#splash-skip') || {}).textContent, skipOpacity: px($('#splash-skip'), 'opacity'),
      canvasBox: rect($('#splash-canvas')),
      scale: [...document.querySelectorAll('.sw-scale li')].map((li) => ({ ...rect(li), text: li.textContent, opacity: px(li, 'opacity') })),
      live: cover('splash-canvas'), under: cover('splash-under'),
      running: splash
        ? splash.getAnimations({ subtree: true })
            .filter((a) => a instanceof CSSAnimation && a.playState === 'running' && a.animationName !== 'sp-giveup')
            .map((a) => a.animationName)
        : [],
      fallback: (() => {
        const f = $('#splash-fallback');
        return f ? { display: getComputedStyle(f).display, title: ($('#splash-fb-title') || {}).textContent } : null;
      })(),
      wordsDisplay: $('#splash-words') ? getComputedStyle($('#splash-words')).display : 'missing',
      seen: localStorage.getItem('tol-splash-seen'),
    };
  });

  const gone = (p, ms) => p.waitForFunction(
    () => getComputedStyle(document.getElementById('splash')).display === 'none', null, { timeout: ms },
  ).then(() => true, () => false);

  const out = {};
  const run = async (name, opts, fn) => {
    let h;
    try {
      h = await open(opts);
      out[name] = await fn(h.p, h);
    } catch (e) {
      out[name] = { error: String(e && e.message ? e.message : e) };
    } finally {
      if (h) {
        try { out.violations = [...(out.violations || []), ...(await h.p.evaluate(() => window.__cspViolations || []).catch(() => []))]; } catch { /* page gone */ }
        await h.ctx.close();
      }
    }
  };

  // 1. What paints before any script has run.
  await run('firstPaint', { seen: true, blockApp: true }, async (p) => {
    await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(1000);                       // the ring fades in over 0.7 s
    return measure(p);
  });

  // 2. The finished plate: reduced motion paints it at once.
  const plateOf = async (p) => {
    await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('#splash.is-live', { timeout: 20000 });
    /* Web fonts change every width the title was fitted against. Wait for them,
       as a visitor's eyes would, then let the re-fit settle. */
    await p.evaluate(() => document.fonts && document.fonts.ready);
    await p.waitForTimeout(350);
    const m = await measure(p);
    const t0 = Date.now();
    m.autoDismissed = await gone(p, 6000);
    m.autoDismissMs = Date.now() - t0;
    m.seenAfter = await p.evaluate(() => localStorage.getItem('tol-splash-seen'));
    return m;
  };
  await run('plate', { seen: true, reduced: true }, plateOf);

  /* A language no scenario covers at this viewport still has its plate measured,
     by the first scenario at that viewport. Russian on a phone is the tightest
     fit on any screen — the longest title in the narrowest window — and it is
     the one combination the matrix does not load. */
  const sameViewport = SCENARIOS.filter((s) => s.viewport.name === vp.name);
  const uncovered = sameViewport[0].id === scenario.id
    ? ['en', 'he', 'ru'].filter((l) => !sameViewport.some((s) => s.lang === l)) : [];
  out.extraPlates = [];
  for (const lang of uncovered) {
    await run(`plate-${lang}`, { lang, seen: true, reduced: true }, plateOf);
    out.extraPlates.push(out[`plate-${lang}`]);
    delete out[`plate-${lang}`];
  }

  // 3. A first visit, running for real.
  await run('live', { seen: false }, async (p) => {
    await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('#splash.is-live', { timeout: 20000 });
    await p.waitForTimeout(600);
    const early = await measure(p);
    await p.waitForTimeout(2400);
    const later = await measure(p);
    /* A web font that arrives mid-show makes the title fit itself again. It must
       not rebuild the scale labels: a rebuilt label fades in from nothing, and
       the scale would blink out in the middle of the show. The event is sent by
       hand because a real font's arrival cannot be timed. */
    const blink = await p.evaluate(async () => {
      const opacities = () => [...document.querySelectorAll('.sw-scale li')].map((li) => parseFloat(getComputedStyle(li).opacity));
      const before = opacities();
      document.fonts.dispatchEvent(new Event('loadingdone'));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return { before, after: opacities() };
    });
    const key = OPENING_KEYS[SCENARIOS.findIndex((s) => s.id === scenario.id) % OPENING_KEYS.length];
    /* Pressed with the safety-net dismissal (6.5 s after the start) still more
       than three seconds away, and given only 1.4 s to answer: the fade takes
       0.45 s, so a key that works is done long before, and a key that does
       nothing cannot be mistaken for the timer running out. */
    await p.keyboard.press(key);
    const dismissed = await gone(p, 1400);
    return {
      key, dismissed, firstVisit: !early.html.returning,
      early: early.live, later: later.live, laterUnder: later.under, blink,
      seenAfter: await p.evaluate(() => localStorage.getItem('tol-splash-seen')),
    };
  });

  // 4. No 2D canvas: the words on their own, and the same ways out.
  await run('noCanvas', { seen: false, noCanvas: true }, async (p) => {
    await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('#splash.no-canvas', { timeout: 20000 });
    const m = await measure(p);
    m.expectedTitle = await p.evaluate(async (lang) => {
      const T = await import(new URL('js/uiData.js', location.href).href).then((x) => x.TRANSLATIONS);
      return T[lang].title;
    }, scenario.lang);
    await p.click('#splash-fallback', { timeout: 3000 }).catch(() => {});
    m.dismissed = await gone(p, 2500);            // the four-second timer is well beyond this
    return m;
  });

  // 5. The scene fails to build: the curtain has to come down anyway.
  await run('broken', { seen: false, brokenScene: true }, async (p, h) => {
    await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
    const t0 = Date.now();
    const cleared = await gone(p, 6000);
    const clearedMs = Date.now() - t0;
    await p.waitForTimeout(1500);                       // let the entrance settle
    const site = await p.evaluate(() => {
      const c = document.getElementById('canvas-wrap');
      const r = c && c.getBoundingClientRect();
      const hit = r && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { nodes: document.querySelectorAll('#viewport g.node-group').length, covered: !!(hit && hit.closest('#splash')) };
    });
    return { cleared, clearedMs, ...site, reported: h.own.some((m) => /scene failed to build/.test(m)) };
  });

  // 6. A slow phone: the title has to arrive on time even when the frames do not.
  if (OPENING_SLOW_SCENARIOS.includes(scenario.id)) {
    await run('slow', { seen: false, slow: OPENING_SLOW }, async (p) => {
      await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
      await p.waitForFunction(() => window.__show && window.__show.gone !== null, null, { timeout: 40000 }).catch(() => {});
      return p.evaluate(() => window.__show);
    });
  }

  // 7. The entrance rules. The opening is the encyclopedia's entrance, not a toll.
  if (OPENING_ENTRANCE_SCENARIOS.includes(scenario.id)) {
    /* A link to a species has no opening: someone following it wants what it points at. */
    await run('deepLink', { seen: false }, async (p) => {
      await p.goto(baseUrl + '/atlas.html?node=primates&view=explore', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('.ex-here', { timeout: 20000 }).catch(() => {});
      await p.waitForTimeout(800);
      return p.evaluate(() => {
        const s = document.getElementById('splash');
        return {
          attr: document.documentElement.hasAttribute('data-no-opening'),
          display: s ? getComputedStyle(s).display : 'missing',
          live: !!(s && s.classList.contains('is-live')),
          played: sessionStorage.getItem('tol-opening-played'),
          intro: !!window.__introSeen,
          cards: document.querySelectorAll('.ex-card').length,
        };
      });
    });
    /* Once per visit: the first entrance plays it, a second in the same tab does not. */
    await run('twice', { seen: false }, async (p) => {
      await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('#splash.is-live', { timeout: 20000 });
      const first = await p.evaluate(() => ({ played: sessionStorage.getItem('tol-opening-played'), attr: document.documentElement.hasAttribute('data-no-opening') }));
      await p.click('#splash-skip', { timeout: 4000 }).catch(() => {});
      await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });     // the same tab: the same visit
      await p.waitForSelector('#viewport g.node-group, .ex-card', { timeout: 20000 }).catch(() => {});
      await p.waitForTimeout(1500);
      const second = await p.evaluate(() => {
        const s = document.getElementById('splash');
        return {
          attr: document.documentElement.hasAttribute('data-no-opening'),
          display: s ? getComputedStyle(s).display : 'missing',
          live: !!(s && s.classList.contains('is-live')),
          intro: !!window.__introSeen,
          cards: document.querySelectorAll('#viewport g.node-group, .ex-card').length,
        };
      });
      return { first, second };
    });
  }

  out.errors = errors;
  out.violations = [...new Set(out.violations || [])];
  /* SMOKE_DUMP_OPENING=1 prints everything measured, one line per scenario: the
     numbers the thresholds below were chosen from, and the first thing to read
     when one of them goes red on a runner you cannot see. */
  if (process.env.SMOKE_DUMP_OPENING) console.log(scenario.id, JSON.stringify(out));
  return out;
}

// ── Probe: the name, asked for after a game ───────────────────────────────────
/* A native prompt() used to ask for a name five seconds into a first visit:
   before the visitor had done anything to be named for, in a box that blocks the
   page, cannot be styled and was never translated. The name is now asked for
   once, on the results of the first game that scored, as a card that can be
   ignored (offerNameAfterGame in js/profile.js). And no Guest is made up for a
   visitor who has only looked around — an earlier version did, which would now
   have pre-empted the offer for the ordinary visitor.

   Every scenario plays a game to its results in its own language, viewport and
   theme and measures the card. Two — one desktop, one phone — go on to the rest,
   in contexts of their own because "a first visit" is the state under test:

     visitor   looks around for seven quiet seconds (the prompt came at five),
               then plays a game that scores nothing, then one that scores —
               whose offer is declined — then one more;
     explorer  has looked around on an earlier visit (`tol-explored`) and is
               back: not a Guest, and still offered a name after the first
               game that scores; keeps it; then two more games, the second
               reached twice at once, which have to be credited to that name
               exactly once each.

   Games are driven to the result they need, not played: the right or the wrong
   answer is looked up in the page's own data, so a run means the same on every
   runner. A quiz that scored nothing when it should have scored something would
   look like a missing offer, and that is not what these checks are about. */
const NAME_FULL_SCENARIOS = ['desktop-en', 'phone-he'];
const NAME_TYPED = { en: 'Gabi', he: 'גבי', ru: 'Габи' };
/** Seven seconds, where the prompt used to come at five. */
const NAME_QUIET_MS = 7000;

async function nameProbe(page, scenario, baseUrl) {
  const browser = page.context().browser();
  const vp = scenario.viewport;
  const full = NAME_FULL_SCENARIOS.includes(scenario.id);
  const dialogs = [], errors = [];
  const out = { full, dialogs, errors };

  async function open({ lang = scenario.lang, explorer = false }) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile, hasTouch: vp.hasTouch,
      deviceScaleFactor: vp.deviceScaleFactor || 1,
      locale: lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US',
    });
    await ctx.addInitScript((cfg) => {
      localStorage.setItem('tol-lang', cfg.lang);
      localStorage.setItem('theme', cfg.theme);
      localStorage.setItem('tol-shell-view', 'map');
      localStorage.setItem('tol-tour-done', '1');
      localStorage.setItem('tol-splash-seen', '1');
      // someone who has opened a few species before, and no player: what a visitor is after a first look round
      if (cfg.explorer) localStorage.setItem('tol-explored', JSON.stringify(['h_sapiens', 'gray-wolf', 'chimpanzee']));
    }, { lang, theme: scenario.theme || 'dark', explorer });
    const p = await ctx.newPage();
    // Every native dialog is recorded and dismissed, so one cannot hold the run up
    p.on('dialog', (d) => { dialogs.push(`${d.type()}: ${d.message().slice(0, 80)}`); d.dismiss().catch(() => {}); });
    p.on('pageerror', (e) => errors.push(String(e && e.message ? e.message : e)));
    return { ctx, p };
  }

  // ── reading the page ──
  const snap = (p) => p.evaluate(() => {
    const raw = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
    let players = null;
    try { players = JSON.parse(raw('tol-players') || 'null'); } catch { players = 'unparseable'; }
    // asking, not merely present: once a name is kept the card stays to say so, without the field
    const asking = document.querySelector('#game-result .name-offer #name-offer-input');
    return {
      players, active: raw('tol-active-player'), asked: raw('tol-name-asked'),
      offer: !!asking && asking.getClientRects().length > 0,
      done: (document.querySelector('#game-result .name-offer-done') || {}).textContent || null,
      // focus must stay in the results when the control that had it goes; on the page's body it starts again from the top
      focusIn: !!document.activeElement && !!document.activeElement.closest('#game-result'),
    };
  });
  const resultsOf = (p) => p.evaluate(() => {
    const box = document.getElementById('game-result');
    const el = document.querySelector('#game-result .trivia-result-score');
    return {
      shown: !!el && getComputedStyle(box).display !== 'none',
      score: el ? parseInt(el.textContent, 10) : null,
    };
  });
  const measureOffer = (p) => p.evaluate(async () => {
    const offer = document.querySelector('#game-result .name-offer');
    if (!offer) return null;
    // Reachable by scrolling is what matters: the results are taller than a phone
    offer.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const box = (el) => { const b = el.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, width: b.width, height: b.height }; };
    const input = offer.querySelector('#name-offer-input');
    const save = offer.querySelector('[data-action="profile:save-name"]');
    const skip = offer.querySelector('[data-action="profile:skip-name"]');
    const covered = (el) => {
      if (!el) return 'missing';
      const b = el.getBoundingClientRect();
      const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      if (top && (top === el || el.contains(top))) return null;
      return top ? `${top.tagName.toLowerCase()}${top.id ? '#' + top.id : ''}${top.className && typeof top.className === 'string' ? '.' + top.className.trim().split(/\s+/)[0] : ''}` : 'nothing';
    };
    const T = await import(new URL('js/uiData.js', location.href).href).then((m) => m.TRANSLATIONS).catch(() => null);
    const tr = (T && T[document.documentElement.lang]) || {};
    const title = offer.querySelector('.name-offer-title');
    return {
      lang: document.documentElement.lang,
      vw: innerWidth, vh: innerHeight,
      scrollW: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      dir: getComputedStyle(offer).direction,
      offer: box(offer), input: input && box(input), save: save && box(save), skip: skip && box(skip),
      inputPx: input ? parseFloat(getComputedStyle(input).fontSize) : 0,
      covered: { input: covered(input), save: covered(save), skip: covered(skip) },
      text: {
        title: title && title.textContent, body: (offer.querySelector('.name-offer-text') || {}).textContent,
        placeholder: input && input.placeholder, save: save && save.textContent, skip: skip && skip.textContent,
      },
      want: { title: tr.name_offer_title, body: tr.name_offer_text, placeholder: tr.name_offer_placeholder, save: tr.name_offer_save, skip: tr.name_offer_skip },
      named: !!input && input.getAttribute('aria-label') === tr.name_offer_placeholder,
      labelled: offer.getAttribute('role') === 'group' && !!document.getElementById(offer.getAttribute('aria-labelledby') || '_'),
      wantSaved: tr.name_offer_saved,
      contrast: typeof window.__contrastSweep === 'function' ? window.__contrastSweep(offer) : null,
    };
  });

  // ── driving the games ──
  const ready = async (p) => {
    await p.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
    await p.waitForFunction(() => document.querySelectorAll('#viewport g.node-group').length >= 10, null, { timeout: 25000 });
    await p.waitForFunction(() => getComputedStyle(document.getElementById('splash')).display === 'none', null, { timeout: 15000 });
    await p.evaluate(installContrastSweep);
  };
  const openGames = async (p) => {
    // the Games pill is not on a phone's screen; the action it carries is
    await p.evaluate(() => document.getElementById('btn-quiz').click());
    await p.waitForSelector('.game-mode-card', { state: 'visible', timeout: 6000 });
  };
  const again = async (p) => {
    await p.click('#game-result [data-action="play-again"]', { timeout: 5000 });
    await p.waitForSelector('.game-mode-card', { state: 'visible', timeout: 5000 });
  };
  // the Daily Challenge's results have Close and no Play Again: it can be played once a day
  const reopen = async (p) => {
    await p.click('#game-result .trivia-result-actions [data-action="close-game"]', { timeout: 5000 });
    await openGames(p);
  };
  const start = (p, mode) => p.click(`.game-mode-card[data-mode="${mode}"]`, { timeout: 5000 });
  const finish = (p) => p.waitForSelector('#game-result .trivia-result-score', { state: 'visible', timeout: 9000 });

  /** Answer the question on screen, rightly or not, from the page's own answer key. */
  const answer = (p, want) => p.evaluate(async (want) => {
    const { TRIVIA_QUESTIONS } = await import(new URL('js/triviaData.js', location.href).href);
    const plain = (s) => { const d = document.createElement('div'); d.innerHTML = String(s); return d.textContent.trim(); };
    const asked = document.querySelector('#game-question .trivia-question-text').textContent.trim();
    const q = TRIVIA_QUESTIONS.find((x) => plain(x.question) === asked);
    const options = [...document.querySelectorAll('#game-options .game-option')];
    const right = q ? options.findIndex((o) => o.lastElementChild.textContent.trim() === plain(q.answers[q.correct])) : -1;
    if (right < 0) return { known: false, asked };
    options[want === 'right' ? right : (right + 1) % options.length].click();
    return { known: true };
  }, want);

  /** A quiz to its results. `last` names how the final button is pressed. */
  const playQuiz = async (p, answers, { twice = false } = {}) => {
    for (let i = 0; i < answers.length; i++) {
      await p.waitForSelector('#game-options .game-option:not(.answered)', { timeout: 8000 });
      const asked = await p.evaluate(() => document.querySelector('#game-question .trivia-question-text').textContent);
      const a = await answer(p, answers[i]);
      if (!a.known) throw new Error(`a question on screen is not in the answer key: "${String(a.asked).slice(0, 60)}"`);
      const isLast = i === answers.length - 1;
      if (await p.evaluate(() => !document.getElementById('game-next-btn') || getComputedStyle(document.getElementById('game-next-btn')).display === 'none')) {
        // Quick Quiz moves on by itself after 1.8 s
        if (!isLast) await p.waitForFunction((was) => document.querySelector('#game-question .trivia-question-text').textContent !== was, asked, { timeout: 6000 });
      } else {
        await p.evaluate((twice) => { const b = document.getElementById('game-next-btn'); b.click(); if (twice) b.click(); }, twice && isLast);
      }
    }
    await finish(p);
  };
  const RIGHT5 = ['right', 'right', 'right', 'right', 'right'];

  /** Who Appeared First?, every answer right: the older of the two is looked up in the tree. */
  const playWhoFirst = async (p) => {
    await start(p, 'who-first');
    for (let i = 0; i < 10; i++) {
      await p.waitForSelector('.wf-card:not([disabled])', { timeout: 6000 });
      await p.evaluate(async () => {
        const { nodeMap } = await import(new URL('js/state.js', location.href).href);
        const cards = [...document.querySelectorAll('.wf-card')];
        const seen = cards.map((c) => {
          const name = c.querySelector('.wf-card-name').textContent.trim();
          const n = Object.values(nodeMap).find((x) => x.name === name && (!x.children || !x.children.length) && x.appeared > 0);
          return { pick: c.dataset.pick, appeared: n ? n.appeared : null };
        });
        const known = seen.every((s) => s.appeared !== null);
        const right = known ? (seen[0].appeared >= seen[1].appeared ? seen[0].pick : seen[1].pick) : 'a';
        cards.find((c) => c.dataset.pick === right).click();
      });
      await p.waitForSelector('#wf-next', { state: 'visible', timeout: 4000 });
      await p.evaluate(() => document.getElementById('wf-next').click());
    }
    await finish(p);
  };
  /** Family or Foe?: eight rounds, the second card each time. */
  const playFamilyFoe = async (p) => {
    await start(p, 'family-foe');
    for (let i = 0; i < 8; i++) {
      await p.waitForSelector('.wf-card:not([disabled])', { timeout: 6000 });
      await p.evaluate(() => document.querySelector('.wf-card[data-pick="c"]').click());
      await p.waitForSelector('#ff-next', { state: 'visible', timeout: 4000 });
      await p.evaluate(() => document.getElementById('ff-next').click());
    }
    await finish(p);
  };

  /* A pass writes what it measures into `v` as it goes, so a step that fails
     leaves everything before it. The checks that needed only that report on it,
     and the ones that needed the step say where the pass stopped and why. A
     pass that threw its measurements away at the first error would turn one
     broken thing into every check red at once, each with the same timeout. */
  const run = async (name, opts, fn) => {
    let h;
    const v = {};
    out[name] = v;
    try {
      h = await open(opts);
      await fn(h.p, v);
    } catch (e) {
      v.error = String(e && e.message ? e.message : e).split('\n')[0];
    } finally {
      if (h) await h.ctx.close();
    }
  };

  /* A visitor's first games. Every pass runs the first two; the full plan adds
     the quiet wait beforehand and the decline and one more game after. A step
     that needs the offer is left out when there is none: the checks say so. */
  const visitor = (lang, plan) => async (p, v) => {
    await ready(p);
    if (plan === 'full') {
      await p.waitForTimeout(NAME_QUIET_MS);
      v.idle = { ...(await snap(p)), dialogs: [...dialogs] };
    }
    await openGames(p);
    // a game that scores nothing has nothing to keep
    await start(p, 'survival');
    await playQuiz(p, ['wrong']);
    v.zero = { ...(await resultsOf(p)), ...(await snap(p)) };
    if (plan === 'full') {
      // the Daily Challenge scores inside but shows no points, so there is nothing on screen to keep
      await again(p);
      await start(p, 'daily');
      await playQuiz(p, ['right']);
      v.daily = { ...(await resultsOf(p)), ...(await snap(p)) };
      await reopen(p);
    } else {
      await again(p);
    }
    // the first that scores
    if (plan === 'full') await playWhoFirst(p);
    else { await start(p, 'survival'); await playQuiz(p, ['right', 'wrong']); }
    v.scored = { ...(await resultsOf(p)), ...(await snap(p)), card: await measureOffer(p) };
    // for a person to look at, in the CI artifact beside the scenario's own screenshot
    if (KEEP_SHOTS) await p.screenshot({ path: path.join(OUT_DIR, `${scenario.id}${lang === scenario.lang ? '' : '-' + lang}-name-offer.png`) }).catch(() => {});
    if (plan === 'full') {
      if (v.scored.offer) {
        await p.click('.name-offer-skip', { timeout: 5000 });
        v.declined = await snap(p);
      } else {
        v.declined = { skipped: 'there was no offer to decline' };
      }
      await again(p);
      await start(p, 'survival');
      await playQuiz(p, ['right', 'wrong']);
      v.next = { ...(await resultsOf(p)), ...(await snap(p)) };
    } else if (v.scored.offer) {
      // the short plan ends by keeping the name — with a tap on Save, the one control the full plan reaches by keyboard
      await p.fill('#name-offer-input', NAME_TYPED[lang], { timeout: 5000 });
      await p.click('.name-offer [data-action="profile:save-name"]', { timeout: 5000 });
      v.kept = await snap(p);
    } else {
      v.kept = { skipped: 'there was no offer to keep a name under' };
    }
  };
  await run('visitor', {}, visitor(scenario.lang, full ? 'full' : 'short'));

  if (full) {
    await run('explorer', { explorer: true }, async (p, x) => {
      await ready(p);
      x.arrived = await snap(p);
      await openGames(p);
      await start(p, 'quick');
      await playQuiz(p, RIGHT5);
      x.scored = { ...(await resultsOf(p)), ...(await snap(p)), card: await measureOffer(p) };
      if (x.scored.offer) {
        await p.fill('#name-offer-input', NAME_TYPED[scenario.lang], { timeout: 5000 });
        // the keyboard on a desktop, a tap on a phone
        if (vp.isMobile) await p.click('.name-offer [data-action="profile:save-name"]', { timeout: 5000 });
        else await p.press('#name-offer-input', 'Enter');
        await p.waitForSelector('.name-offer-done', { timeout: 3000 }).catch(() => {});    // if it never comes, the check says so
        x.kept = { ...(await snap(p)), typed: NAME_TYPED[scenario.lang] };
      } else {
        x.kept = { skipped: 'there was no offer to keep a name under' };
      }
      // a named player is credited without being asked again
      await again(p);
      await playFamilyFoe(p);
      x.foe = { ...(await resultsOf(p)), ...(await snap(p)) };
      // and a game reached twice at once is counted once
      await again(p);
      await start(p, 'classic');
      await playQuiz(p, ['right', 'wrong', 'wrong', 'wrong'], { twice: true });
      x.classic = { ...(await resultsOf(p)), ...(await snap(p)) };
    });
  }

  /* A language no scenario covers at this viewport still has its card measured,
     by the first scenario at that viewport: Russian on a phone is the longest
     text in the narrowest window, and the one combination the matrix skips. */
  const sameViewport = SCENARIOS.filter((s) => s.viewport.name === vp.name);
  const uncovered = sameViewport[0].id === scenario.id
    ? ['en', 'he', 'ru'].filter((l) => !sameViewport.some((s) => s.lang === l)) : [];
  out.extra = [];
  for (const lang of uncovered) {
    await run(`visitor-${lang}`, { lang }, visitor(lang, 'short'));
    out.extra.push(out[`visitor-${lang}`]);
    delete out[`visitor-${lang}`];
  }

  out.errors = errors;
  if (process.env.SMOKE_DUMP_NAME) console.log(scenario.id, JSON.stringify(out));
  return out;
}

// ── Probe: everything we can learn from one page, in a few passes ─────────────
/* Orbit, the third view. It lays itself out from its own box, so it is measured
   in a context of its own, loaded straight into it (`?view=orbit`) under reduced
   motion — which paints each focus at once and so can be read without waiting on
   a clock. Three kinds of evidence, because each alone is misleading:

     the layout   `layoutOrbit` is pure, so every one of the tree's nodes is tried
                  as a focus in this window: nothing outside it, nothing on
                  anything else, and every relative either drawn or counted in a
                  "+N" bubble that is itself drawn. This is the check that cannot
                  be satisfied by a layout that happens to work for the person;
     the page     a handful of foci painted for real and measured: boxes, what a
                  fingertip would hit, the words, contrast;
     the story    a press moves the focus, Back undoes it, Home returns, and the
                  rail's Explore and Orbit buttons take the reader away and back
                  without leaving the picture empty (constraint 11). */
/* A probe whose browser dies never settles, and the run then hangs until the CI
   job's own limit instead of failing. Orbit's takes about a minute. */
const withinMs = (promise, ms, what) => Promise.race([
  promise,
  new Promise((resolve) => setTimeout(() => resolve({ error: `${what} did not finish in ${Math.round(ms / 1000)}s — the page or the browser stopped answering` }), ms)),
]);

async function orbitProbe(page, scenario, baseUrl) {
  const browser = page.context().browser();
  const vp = scenario.viewport;
  const lang = scenario.lang;
  const out = {};
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile, hasTouch: true,        // see the note on `drag`: a finger, in every scenario
    deviceScaleFactor: vp.deviceScaleFactor || 1,
    reducedMotion: 'reduce',
    locale: lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US',
  });
  await ctx.addInitScript((cfg) => {
    localStorage.setItem('tol-lang', cfg.lang);
    localStorage.setItem('theme', cfg.theme);
    localStorage.setItem('tol-shell-view', 'map');
    localStorage.setItem('tol-tour-done', '1');
    localStorage.setItem('tol-splash-seen', '1');
  }, { lang, theme: scenario.theme || 'dark' });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e && e.message ? e.message : e)));
  const frames = () => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 60)))));
  const TR = (m) => { if (process.env.SMOKE_TRACE) console.error('[orbit]', scenario.id, m); };
  try {
    TR('start');
    await p.goto(baseUrl + '/atlas.html?view=orbit', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('#orbit .orb-b.focus', { timeout: 15000 });
    await frames();

    out.landing = await p.evaluate(() => {
      const vis = (sel) => { const e = document.querySelector(sel); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0; };
      const f = document.querySelector('#orbit .orb-b.focus');
      return {
        view: document.body.getAttribute('data-view'),
        orbitVisible: vis('#orbit'), exploreVisible: vis('#explore'), mapVisible: vis('#svg'), timelineVisible: vis('#timeline'),
        focus: f && f.dataset.arg, bubbles: document.querySelectorAll('#orbit .orb-b').length,
        arcs: document.querySelectorAll('#orbit .orb-arc').length,
        active: document.querySelector('#view-toggle .view-btn.active')?.dataset.view,
        stored: localStorage.getItem('tol-shell-view'),
      };
    });

    TR('sweep');
    // ── the layout, every node as the focus ──
    out.sweep = await p.evaluate(async () => {
      const { layoutOrbit } = await import(new URL('js/orbit.js', location.href).href);
      const { TREE } = await import(new URL('js/data.js', location.href).href);
      const host = document.getElementById('orbit').getBoundingClientRect();
      const W = host.width, H = host.height, rtl = document.documentElement.dir === 'rtl';
      const all = []; (function w(n) { all.push(n); (n.children || []).forEach(w); })(TREE);
      const bad = { outside: [], overlap: [], missing: [], stranded: [] };
      const unlabelled = { total: 0, missing: 0 };
      for (const n of all) {
        const L = layoutOrbit(n, W, H, rtl);
        const box = (i) => ({ l: i.x - i.w / 2, r: i.x + i.w / 2, t: i.y - i.d / 2, b: i.y - i.d / 2 + i.h });
        const bs = L.items.map((i) => ({ i, b: box(i) }));
        for (const { i, b } of bs) {
          if (b.l < -0.5 || b.r > W + 0.5 || b.t < -0.5 || b.b > H + 0.5) bad.outside.push(`${n.id}→${i.key}`);
        }
        for (let a = 0; a < bs.length; a++) for (let c = a + 1; c < bs.length; c++) {
          const x = bs[a].b, y = bs[c].b;
          if (x.l < y.r - 1 && x.r > y.l + 1 && x.t < y.b - 1 && x.b > y.t + 1) bad.overlap.push(`${n.id}: ${bs[a].i.key}×${bs[c].i.key}`);
        }
        // every ring accounts for everyone on it: drawn, or counted in a "+N" that is drawn
        for (const r of L.rings) {
          if (r.shown + r.hidden !== r.total) bad.missing.push(`${n.id}: ring ${r.shown}+${r.hidden}≠${r.total}`);
          if (r.hidden && !r.more) bad.stranded.push(`${n.id}: ${r.hidden} relatives behind a "+N" that was not drawn`);
        }
      }
      return { nodes: all.length, W: Math.round(W), H: Math.round(H), rings: unlabelled.total, unlabelled: unlabelled.missing,
        outside: bad.outside.length, overlap: bad.overlap.length, missing: bad.missing.length, stranded: bad.stranded.length,
        sample: [...bad.outside, ...bad.overlap, ...bad.missing, ...bad.stranded].slice(0, 6) };
    });

    TR('dom');
    // ── the page, a handful of foci painted for real ──
    const SAMPLE = ['h_sapiens', 'luca', 'bacteria', 'fungi', 'platypus', 'insects', 'mammals', 'plants'];
    out.dom = [];
    for (const id of SAMPLE) {
      const row = await p.evaluate(async (id) => {
        const { orbitFocus } = await import(new URL('js/orbit.js', location.href).href);
        orbitFocus(id);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 80))));
        const host = document.getElementById('orbit');
        const hr = host.getBoundingClientRect();
        const bs = [...host.querySelectorAll('.orb-b')].filter((b) => b.dataset.action).map((b) => ({ b, r: b.getBoundingClientRect() }));
        const problems = { outside: [], overlap: [], covered: [], noTime: [], pills: [] };
        for (const { b, r } of bs) {
          if (r.left < hr.left - 1 || r.right > hr.right + 1 || r.top < hr.top - 1 || r.bottom > hr.bottom + 1) problems.outside.push(b.dataset.arg);
          const face = b.querySelector('.orb-face').getBoundingClientRect();
          const hit = document.elementFromPoint(face.left + face.width / 2, face.top + face.height / 2);
          if (!hit || !b.contains(hit)) problems.covered.push(b.dataset.arg + '←' + (hit ? (hit.id || hit.className || hit.tagName) : 'nothing'));
          if (b.classList.contains('rel') && !b.querySelector('.orb-sub').textContent.trim()) problems.noTime.push(b.dataset.arg);
        }
        for (let a = 0; a < bs.length; a++) for (let c = a + 1; c < bs.length; c++) {
          const x = bs[a].r, y = bs[c].r;
          if (x.left < y.right - 2 && x.right > y.left + 2 && x.top < y.bottom - 2 && x.bottom > y.top + 2) {
            const q = (r) => `[${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)}]`;
            problems.overlap.push(`${bs[a].b.dataset.arg}${q(x)}×${bs[c].b.dataset.arg}${q(y)}`);
          }
        }
        const pills = [...host.querySelectorAll('.orb-pill, .orb-legend')].filter((e) => e.getBoundingClientRect().width);
        for (const e of pills) {
          const r = e.getBoundingClientRect();
          if (r.left < hr.left - 1 || r.right > hr.right + 1 || r.bottom > hr.bottom + 1) problems.pills.push(`${e.className} off-window`);
          if (!e.classList.contains('orb-legend')) {
            const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            if (!hit || !e.contains(hit)) problems.pills.push(`${(e.textContent || '').trim().slice(0, 14)} covered`);
            if (r.height < 40) problems.pills.push(`${(e.textContent || '').trim().slice(0, 14)} only ${Math.round(r.height)}px tall`);
          }
        }
        for (const l of host.querySelectorAll('.orb-legend')) {
          const lr = l.getBoundingClientRect();
          for (const e of host.querySelectorAll('.orb-pill')) {
            const r = e.getBoundingClientRect();
            if (r.width && lr.top < r.bottom - 1 && lr.bottom > r.top + 1 && lr.left < r.right && lr.right > r.left) problems.pills.push('legend under a pill');
          }
        }
        // the lineage strip and the ring labels
        const lin = { strip: [], rings: [], crumbs: 0, ringLabels: 0 };
        const chain = (await import(new URL('js/orbit.js', location.href).href)).orbitPath();
        const strip = host.querySelector('.orb-strip');
        if (!strip) lin.strip.push('no strip');
        else {
          const sr = strip.getBoundingClientRect();
          if (sr.left < hr.left - 1 || sr.right > hr.right + 1 || sr.top < hr.top - 1) lin.strip.push('strip outside the view');
          lin.crumbs = strip.querySelectorAll('.orb-crumb').length;
          if (lin.crumbs !== chain.length) lin.strip.push(`${lin.crumbs} crumbs for a path of ${chain.length}`);
          const here = strip.querySelector('.orb-crumb.is-here');
          if (!here || here.textContent.trim() !== host.querySelector('.orb-b.focus .orb-name')?.textContent.trim()) lin.strip.push('the current crumb is not the centre');
          const up = strip.querySelector('.orb-up');
          if (!up) lin.strip.push('no Up');
          else {
            const ur = up.getBoundingClientRect();
            if (ur.height < 36 || ur.width < 36) lin.strip.push(`Up is ${Math.round(ur.width)}×${Math.round(ur.height)}`);
            const hit = document.elementFromPoint(ur.left + ur.width / 2, ur.top + ur.height / 2);
            if (!hit || !up.contains(hit)) lin.strip.push('Up is covered');
            if (up.disabled !== (chain.length < 2)) lin.strip.push('Up is enabled with no parent or disabled with one');
          }
          // the crumbs on screen are tappable; those scrolled out of the strip are reached by scrolling it
          const pr = strip.querySelector('.orb-path').getBoundingClientRect();
          for (const c of strip.querySelectorAll('button.orb-crumb')) {
            const r = c.getBoundingClientRect();
            if (r.right <= pr.left + 2 || r.left >= pr.right - 2) continue;
            const hit = document.elementFromPoint(Math.min(Math.max(r.left + r.width / 2, pr.left + 2), pr.right - 2), r.top + r.height / 2);
            if (!hit || !c.contains(hit)) lin.strip.push(`crumb ${c.textContent.trim()} covered`);
          }
        }
        for (const rl of host.querySelectorAll('.orb-ring')) {
          lin.ringLabels++;
          const r = rl.getBoundingClientRect();
          if (r.left < hr.left - 1 || r.right > hr.right + 1 || r.bottom > hr.bottom + 1 || r.top < hr.top - 1) lin.rings.push(`${rl.dataset.arg} outside`);
          for (const { b, r: br } of bs) if (r.left < br.right - 1 && r.right > br.left + 1 && r.top < br.bottom - 1 && r.bottom > br.top + 1) lin.rings.push(`${rl.dataset.arg}×${b.dataset.arg}`);
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          if (!hit || !rl.contains(hit)) lin.rings.push(`${rl.dataset.arg} covered`);
          if (r.height < 22) lin.rings.push(`${rl.dataset.arg} only ${Math.round(r.height)}px`);
          if (!/\d/.test(rl.textContent)) lin.rings.push(`${rl.dataset.arg} states no time`);
        }
        const bubbles = bs.length;
        return { id, lin, focus: host.querySelector('.orb-b.focus')?.dataset.arg, bubbles, ...problems };
      }, id);
      out.dom.push(row);
      /* A failing focus leaves a picture behind: what a runner saw is the only
         way to tell a layout fault from a font or a photograph arriving late. */
      if (row.outside.length || row.overlap.length || row.covered.length || row.pills.length) {
        await p.screenshot({ path: path.join(OUT_DIR, `orbit-${scenario.id}-${id}.png`) }).catch(() => {});
      }
    }

    TR('words');
    // ── words: translated groups, no Latin chrome in Hebrew, the time on every chip ──
    out.words = await p.evaluate(async (lang) => {
      const { orbitFocus } = await import(new URL('js/orbit.js', location.href).href);
      const { TAXON_NAMES } = await import(new URL('js/taxonNames.js', location.href).href);
      const { TRANSLATIONS } = await import(new URL('js/uiData.js', location.href).href);
      orbitFocus('h_sapiens');
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 80))));
      const host = document.getElementById('orbit');
      const T = TRANSLATIONS[lang];
      const untranslated = [];
      if (TAXON_NAMES[lang]) {
        for (const b of host.querySelectorAll('.orb-b')) {
          const want = TAXON_NAMES[lang][b.dataset.arg];
          const got = b.querySelector('.orb-name')?.textContent.trim();
          if (want && got !== want) untranslated.push(`${b.dataset.arg}: "${got}" ≠ "${want}"`);
        }
      }
      const leaks = [];
      if (lang === 'he') {
        for (const e of host.querySelectorAll('*')) {
          if (e.children.length || e.closest('[data-i18n-exempt]')) continue;
          const tx = (e.textContent || '').trim();
          if (/[A-Za-z]{2,}/.test(tx)) leaks.push(`${e.className}: ${tx.slice(0, 30)}`);
        }
      }
      const want = { legend: T.orbit_legend, main: T.orbit_surprise };
      return {
        untranslated, leaks,
        legend: host.querySelector('.orb-legend')?.textContent.trim(), wantLegend: want.legend,
        main: host.querySelector('.orb-pill.is-main')?.textContent.trim(), wantMain: want.main,
        railLabel: document.getElementById('i-view-orbit')?.textContent.trim(), wantRail: T.view_orbit,
        dir: getComputedStyle(host).direction,
      };
    }, lang);

    // ── contrast ──
    await p.evaluate(installContrastSweep);
    out.contrast = await p.evaluate(() => ({ theme: document.documentElement.getAttribute('data-theme') || 'dark', hits: window.__contrastSweep(document.getElementById('orbit')) }));

    TR('story');
    // ── the story: press, Back, Home ──
    out.story = {};
    await p.evaluate(async () => {
      const { orbitFocus } = await import(new URL('js/orbit.js', location.href).href);
      orbitFocus('h_sapiens');
    });
    await frames();
    const read = () => p.evaluate(() => ({
      focus: document.querySelector('#orbit .orb-b.focus')?.dataset.arg,
      trail: [...document.querySelectorAll('#orbit .is-trail')].map((e) => e.dataset.arg),
      home: !!document.querySelector('#orbit .is-home'),
    }));
    out.story.start = await read();
    const target = await p.evaluate(() => document.querySelector('#orbit .orb-b.rel')?.dataset.arg);
    out.story.target = target;
    await p.click(`#orbit .orb-b[data-arg="${target}"] .orb-face`, { timeout: 5000 });
    await frames();
    out.story.afterPress = await read();
    await p.evaluate(() => document.querySelector('[data-action="way:back"]').click());
    await frames();
    out.story.afterBack = await read();
    await p.evaluate(async () => { const { orbitFocus } = await import(new URL('js/orbit.js', location.href).href); orbitFocus('platypus'); });
    await frames();
    await p.click('#orbit .is-home', { timeout: 5000 });
    await frames();
    out.story.afterHome = await read();
    // pressing the centre opens the species panel, which is what the focus is for
    await p.evaluate(async () => { const { orbitFocus } = await import(new URL('js/orbit.js', location.href).href); orbitFocus('platypus'); });
    await frames();
    await p.click('#orbit .orb-b.focus .orb-face', { timeout: 5000 });
    await p.waitForTimeout(500);
    out.story.panelOpen = await p.evaluate(() => document.getElementById('panel')?.classList.contains('open'));
    await p.evaluate(() => document.querySelector('[data-action="way:back"]').click());
    await frames();
    out.story.panelClosedByBack = await p.evaluate(() => !document.getElementById('panel')?.classList.contains('open'));

    TR('levels');
    // ── levels: glide, Up versus Back, the lineage strip, the rings' labels ──
    const hop = async (id) => { await p.evaluate(async (id) => { const { orbitFocus } = await import(new URL('js/orbit.js', location.href).href); orbitFocus(id); }, id); await frames(); };
    await hop('h_sapiens');
    const lvlTarget = await p.evaluate(() => document.querySelector('#orbit .orb-b.rel')?.dataset.arg);
    out.story.lvlTarget = lvlTarget;
    // the pressed bubble is the same element afterwards: it travels to the centre rather than being replaced
    await p.evaluate((t) => { document.querySelector(`#orbit .orb-b[data-arg="${t}"]`).__stamp = 1; }, lvlTarget);
    await p.click(`#orbit .orb-b[data-arg="${lvlTarget}"] .orb-face`, { timeout: 5000 });
    await frames();
    out.story.glided = await p.evaluate(() => !!document.querySelector('#orbit .orb-b.focus')?.__stamp);
    out.story.why = await p.evaluate(() => {
      const w = document.querySelector('#orbit .orb-why');
      const l = document.querySelector('#orbit .orb-legend');
      return w && {
        text: w.textContent.trim(), names: [...w.querySelectorAll('bdi')].map((b) => b.textContent.trim()),
        events: getComputedStyle(w).pointerEvents, legend: l && getComputedStyle(l).visibility,
        exempt: [...w.querySelectorAll('bdi')].every((b) => b.hasAttribute('data-i18n-exempt')),
        box: (() => { const r = w.getBoundingClientRect(); return { l: r.left, r: r.right, b: r.bottom }; })(),
        vw: innerWidth, vh: innerHeight,
      };
    });
    out.story.pathAtTarget = await p.evaluate(async () => (await import(new URL('js/orbit.js', location.href).href)).orbitPath());
    // Up is the parent; the centre that was just left glides out to its ring as a child
    await p.click('#orbit .orb-up', { timeout: 5000 });
    await frames();
    out.story.afterUp = await read();
    out.story.leftGlided = await p.evaluate(() => [...document.querySelectorAll('#orbit .orb-b')].some((b) => b.__stamp && b.dataset.kind !== 'focus'));
    // Back is where the reader came from, not the parent
    await p.evaluate(() => document.querySelector('[data-action="way:back"]').click());
    await frames();
    out.story.backAfterUp = await read();
    // a crumb in the strip: one tap to that ancestor
    const crumb = await p.evaluate(() => document.querySelector('#orbit .orb-crumb[data-arg]')?.dataset.arg);
    out.story.crumb = crumb;
    if (crumb) { await p.evaluate((c) => document.querySelector(`#orbit .orb-crumb[data-arg="${c}"]`).click(), crumb); await frames(); }
    out.story.afterCrumb = await read();
    // a ring's label: one tap to that ancestor
    await hop('h_sapiens');
    const ringTarget = await p.evaluate(() => document.querySelector('#orbit .orb-ring')?.dataset.arg);
    out.story.ringTarget = ringTarget;
    if (ringTarget) { await p.click(`#orbit .orb-ring[data-arg="${ringTarget}"]`, { timeout: 5000 }); await frames(); }
    out.story.afterRing = await read();
    // compare: pin the centre, press another creature; the line stays and names the pinned one
    await hop('h_sapiens');
    const cmpWhy = () => p.evaluate(() => {
      const w = document.querySelector('#orbit .orb-why'), b = document.querySelector('#orbit .orb-cmp');
      return { text: w ? w.textContent.trim() : null, sticky: !!w && w.classList.contains('is-sticky'), names: w ? [...w.querySelectorAll('bdi')].map((x) => x.textContent.trim()) : [], on: b && b.getAttribute('aria-pressed'), label: b && b.textContent.trim() };
    });
    out.story.cmp = { before: await cmpWhy() };
    await p.click('#orbit .orb-cmp', { timeout: 5000 }); await frames();
    out.story.cmp.pinned = await cmpWhy();
    const cmpTarget = await p.evaluate(() => document.querySelector('#orbit .orb-b.rel')?.dataset.arg);
    await p.click(`#orbit .orb-b[data-arg="${cmpTarget}"] .orb-face`, { timeout: 5000 }); await frames();
    out.story.cmp.moved = await cmpWhy();
    out.story.cmp.pinName = await p.evaluate(async () => { const m = await import(new URL('js/orbit.js', location.href).href); const n = m.orbitPinned(); return n && n.name; });
    await p.click('#orbit .orb-cmp', { timeout: 5000 }); await frames();
    out.story.cmp.off = await cmpWhy();
    await hop('h_sapiens');

    TR('gestures');
    // ── gestures and keys ──
    const box = async (sel) => p.evaluate((sel) => { const r = document.querySelector(sel)?.getBoundingClientRect(); return r && { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
    /* The gesture is a finger, sent as touch events through the protocol, in every
       scenario. A held *mouse* button over a bubble took this sandbox's Chromium
       down entirely — the page, the context and the browser — in a mobile-emulated
       page every time and in a desktop one now and then, and the gesture code is
       Pointer Events either way. The touch-capable context is the probe's own. */
    const cdp = await ctx.newCDPSession(p);
    const drag = async (from, dx, dy) => {
      if (cdp) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y }] });
        for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + dx * i / 8, y: from.y + dy * i / 8 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        // a protocol drag is instant, so Chromium treats the next touch as stopping a fling and drops its click
        await p.waitForTimeout(500);
      } else {
        await p.mouse.move(from.x, from.y); await p.mouse.down();
        for (let i = 1; i <= 8; i++) await p.mouse.move(from.x + dx * i / 8, from.y + dy * i / 8);
        await p.mouse.up();
      }
      await frames();
    };
    out.gest = {};
    await hop('h_sapiens');
    TR('g1');
    // a swipe up that starts on a bubble goes up a level and does not also press that bubble
    const rel = await p.evaluate(() => document.querySelector('#orbit .orb-b.rel')?.dataset.arg);
    const relBox = await box(`#orbit .orb-b[data-arg="${rel}"] .orb-face`);
    out.gest.rel = rel;
    await drag(relBox, 0, -110);
    TR('g2');
    out.gest.afterSwipeUp = await read();
    TR('g3');
    out.gest.parentOfStart = await p.evaluate(async () => { const m = await import(new URL('js/orbit.js', location.href).href); const pp = m.orbitPath(); return pp[pp.length - 1]; });
    // swipe down is Back: to where the reader was
    const downBox = await box('#orbit .orb-b.focus .orb-face');
    await drag({ x: downBox.x, y: downBox.y + 60 }, 0, 110);
    TR('g4');
    out.gest.afterSwipeDown = await read();
    TR('g5');
    // a short drag, or a mostly sideways one, is not a swipe
    const beforeDrags = await read();
    await drag({ x: downBox.x, y: downBox.y + 160 }, 0, -30);
    TR('g6');
    await drag({ x: downBox.x - 60, y: downBox.y + 160 }, 150, -100);
    TR('g7');
    out.gest.afterNonSwipes = await read();
    TR('g8');
    out.gest.beforeNonSwipes = beforeDrags;
    // the stage is not left displaced
    out.gest.stageTransform = await p.evaluate(() => document.querySelector('#orbit .orb-stage').style.transform);
    // a plain tap still presses
    await hop('h_sapiens');
    TR('g9');
    const tapTarget = await p.evaluate(() => document.querySelector('#orbit .orb-b.rel')?.dataset.arg);
    const tb = await box(`#orbit .orb-b[data-arg="${tapTarget}"] .orb-face`);
    await p.touchscreen.tap(tb.x, tb.y);
    await frames();
    TR('g10');
    out.gest.tap = { target: tapTarget, after: await read() };

    TR('keys');
    const press = async (k) => { await p.keyboard.press(k); await frames(); };
    await hop('h_sapiens'); await hop('platypus');
    TR('g11');
    await p.evaluate(() => document.activeElement?.blur?.());
    const parent = await p.evaluate(async () => { const m = await import(new URL('js/orbit.js', location.href).href); const pp = m.orbitPath(); return pp[pp.length - 2]; });
    out.gest.keyParent = parent;
    await press('ArrowUp');
    TR('g12');
    out.gest.afterArrowUp = await read();
    TR('g13');
    await press('ArrowDown');
    TR('g14');
    out.gest.afterArrowDown = await read();
    TR('g15');
    await hop('platypus');
    TR('g16');
    const sib = await p.evaluate(async () => { const m = await import(new URL('js/orbit.js', location.href).href); const pp = m.orbitPath(); return pp.length; });
    await press('ArrowRight');
    TR('g17');
    out.gest.afterRight = await read();
    TR('g18');
    await press('ArrowLeft');
    TR('g19');
    out.gest.afterLeft = await read();
    TR('g20');
    await press('Home');
    TR('g21');
    out.gest.afterHome = await read();
    TR('g22');
    // keys do nothing while the reader is typing, or while something is open over the picture
    await hop('platypus');
    TR('g23');
    await p.focus('#search-input').catch(() => {});
    TR('g24');
    await p.keyboard.press('ArrowUp'); await frames();
    out.gest.typing = await read();
    TR('g25');
    await p.evaluate(() => document.activeElement?.blur?.());
    await p.evaluate(async () => { const m = await import(new URL('js/orbit.js', location.href).href); m.orbitFocus('platypus'); document.getElementById('panel')?.classList.add('open'); });
    await frames();
    await p.keyboard.press('ArrowUp'); await frames();
    out.gest.withPanel = await read();
    TR('g26');
    await p.evaluate(() => document.getElementById('panel')?.classList.remove('open'));

    TR('switch');
    // ── the way out and back in, and a language switched while looking ──
    await p.evaluate(() => document.querySelector('#view-toggle [data-view="explore"]').click());
    await frames();
    out.switch = {};
    out.switch.toExplore = await p.evaluate(() => ({
      view: document.body.getAttribute('data-view'),
      orbitHidden: getComputedStyle(document.getElementById('orbit')).display === 'none',
      explore: document.querySelectorAll('#explore .ex-card').length,
      stored: localStorage.getItem('tol-shell-view'),
    }));
    await p.evaluate(() => document.querySelector('#view-toggle [data-view="orbit"]').click());
    await frames();
    out.switch.backToOrbit = await p.evaluate(() => ({
      view: document.body.getAttribute('data-view'),
      bubbles: document.querySelectorAll('#orbit .orb-b').length,
      stored: localStorage.getItem('tol-shell-view'),
    }));
    const other = lang === 'ru' ? 'en' : 'ru';
    const before = await p.evaluate(() => document.querySelector('#orbit .orb-pill.is-main')?.textContent.trim());
    await p.evaluate((o) => document.querySelector(`.lang-btn[data-lang="${o}"]`).click(), other);
    await frames();
    out.switch.language = await p.evaluate(() => ({
      main: document.querySelector('#orbit .orb-pill.is-main')?.textContent.trim(),
      lang: document.documentElement.lang,
      bubbles: document.querySelectorAll('#orbit .orb-b').length,
    }));
    out.switch.before = before; out.switch.other = other;

    TR('share');
    // ── a shared link names the view and the node, and following it lands there ──
    await p.evaluate(async () => { const { orbitFocus } = await import(new URL('js/orbit.js', location.href).href); orbitFocus('platypus'); });
    await frames();
    out.share = await p.evaluate(async () => {
      const { shareUrl } = await import(new URL('js/wayfinder.js', location.href).href);
      const u = new URL(shareUrl());
      return { view: u.searchParams.get('view'), node: u.searchParams.get('node') };
    });
    const q = await ctx.newPage();
    q.on('pageerror', (e) => errors.push(String(e && e.message ? e.message : e)));
    await q.goto(baseUrl + '/atlas.html?view=orbit&node=platypus', { waitUntil: 'domcontentloaded' });
    await q.waitForSelector('#orbit .orb-b.focus', { timeout: 15000 });
    await q.waitForTimeout(600);
    out.share.landed = await q.evaluate(() => ({
      view: document.body.getAttribute('data-view'),
      focus: document.querySelector('#orbit .orb-b.focus')?.dataset.arg,
      stored: localStorage.getItem('tol-shell-view'),
    }));
    await q.close();

    TR('door');
    // ── the one-time hint, and what a visitor with no stored choice lands in ──
    const door = async (seed, query = '') => {
      const c2 = await browser.newContext({
        viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch,
        deviceScaleFactor: vp.deviceScaleFactor || 1, reducedMotion: 'reduce',
        locale: lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US',
      });
      await c2.addInitScript((cfg) => {
        localStorage.setItem('tol-lang', cfg.lang); localStorage.setItem('theme', cfg.theme);
        localStorage.setItem('tol-tour-done', '1'); localStorage.setItem('tol-splash-seen', '1');
        if (cfg.seed && !sessionStorage.getItem('seeded')) { localStorage.setItem('tol-shell-view', cfg.seed); sessionStorage.setItem('seeded', '1'); }
      }, { lang, theme: scenario.theme || 'dark', seed });
      const d = await c2.newPage();
      d.on('pageerror', (e) => errors.push(String(e && e.message ? e.message : e)));
      await d.goto(baseUrl + '/atlas.html' + query, { waitUntil: 'domcontentloaded' });
      await d.waitForTimeout(2500);
      const r = await d.evaluate(() => ({
        view: document.body.getAttribute('data-view'),
        active: document.querySelector('#view-toggle .view-btn.active')?.dataset.view,
        first: document.querySelector('#view-toggle .view-btn')?.dataset.view,
        bubbles: document.querySelectorAll('#orbit .orb-b').length,
        orbitVisible: getComputedStyle(document.getElementById('orbit')).display !== 'none',
        exploreVisible: getComputedStyle(document.getElementById('explore')).display !== 'none',
        hint: (() => { const h = document.querySelector('#orbit .orb-hint'); return h && { text: h.textContent.trim(), events: getComputedStyle(h).pointerEvents }; })(),
        stored: localStorage.getItem('tol-shell-view'),
      }));
      return { c2, d, r };
    };
    out.door = {};
    {
      const a = await door(null);
      out.door.fresh = a.r;
      out.door.hintWant = await a.d.evaluate(async () => {
        const T = (await import(new URL('js/uiData.js', location.href).href)).TRANSLATIONS[document.documentElement.lang];
        return matchMedia('(pointer: coarse)').matches ? T.orbit_hint_touch : T.orbit_hint_keys;
      });
      // the first gesture takes it away, and it is not said again on the next visit
      await a.d.keyboard.press('ArrowUp'); await a.d.waitForTimeout(300);
      out.door.hintAfterKey = await a.d.evaluate(() => !!document.querySelector('#orbit .orb-hint'));
      await a.d.reload({ waitUntil: 'domcontentloaded' }); await a.d.waitForTimeout(2000);
      out.door.hintAgain = await a.d.evaluate(() => !!document.querySelector('#orbit .orb-hint'));
      await a.c2.close();
      const b = await door('explore');
      out.door.returningExplore = b.r; await b.c2.close();
      const m = await door('map');
      out.door.returningMap = m.r; await m.c2.close();
    }
  } catch (e) {
    out.error = String(e && e.message ? e.message : e);
  }
  out.errors = errors;
  await ctx.close();
  return out;
}

async function probePage(page, scenario, baseUrl) {
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

    /* One icon per control, counted on the rendered label rather than on the
       markup or the translation alone. The glyph is written in whichever of
       the two the author had open at the time, and neither one can see the
       other: the Compare pill carried a microscope in atlas.html and the
       translation for the same button opened with a scale, so every visitor
       in every language read "\u{1F52C} \u2696 Compare Mode". Nothing failed --
       the binding matched its translation exactly, which is all the i18n
       check was ever asking. */
    const doubledIcons = [];
    for (const b of bindings) {
      const el = byId(b.id);
      if (!el) continue;
      const ctl = el.closest('button, a[href], label, [role="button"]') || el;
      if (!visible(ctl)) continue;
      const icons = ((ctl.textContent || '').match(/\p{Extended_Pictographic}/gu) || []);
      if (icons.length > 1) {
        doubledIcons.push({ id: b.id, icons: icons.join(' '), text: (ctl.textContent || '').trim().slice(0, 40) });
      }
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
      i18nMismatches, i18nMissingKeys, latinLeaks, searchPlaceholder, doubledIcons,
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

  /* Half a second into a hover the tooltip grows a fun fact, which is English
     data in every language, under a label that is not. In Hebrew it was
     neither: "Did you know?" was typed into the markup, and the fact beneath
     it ran right-to-left with its full stop at the front. Most nodes on the
     first screen have no fact, so hover one that does. */
  let tipFact = null;
  const factPoint = await page.evaluate(async () => {
    const { nodeMap } = await import('./js/state.js');
    const head = document.getElementById('header');
    const top = head ? head.getBoundingClientRect().bottom : 0;
    for (const g of document.querySelectorAll('#viewport g.node-group[data-node-id]')) {
      const n = nodeMap[g.dataset.nodeId];
      const c = g.querySelector('circle');
      if (!n || !n.funFact || !c) continue;
      const r = c.getBoundingClientRect();
      if (!r.width || r.top < top || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) continue;
      const x = r.x + r.width / 2, y = r.y + r.height / 2;
      const hit = document.elementFromPoint(x, y);
      if (hit && g.contains(hit)) return { x, y };
    }
    return null;
  });
  if (factPoint) {
    await page.mouse.move(factPoint.x, factPoint.y);
    await page.waitForTimeout(900);
    tipFact = await page.evaluate(async () => {
      const { t } = await import('./js/theme.js');
      const el = document.getElementById('tooltip');
      const dyk = el && el.querySelector('.tip-dyk');
      const fact = el && el.querySelector('.tip-funfact');
      if (!dyk || !fact) return { shown: false };
      return { shown: true, label: dyk.textContent.trim(), expected: t('did_you_know_q'), dir: getComputedStyle(fact).direction };
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
      ['cat', 'Domestic cat'], ['snake', 'King cobra'], ['bear', 'Polar bear'],
      ['oak', 'Oak'], ['elephent', 'African elephant'],
      ['dinosaur', 'Non-avian dinosaurs'], ['dog', 'Domestic dog'], ['mouse', 'House mouse'],
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

  /* Contrast over the map, in both themes. See installContrastSweep() above for
     the arithmetic, and for why it lives on the page rather than inline here. */
  await page.evaluate(installContrastSweep);
  const contrast = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute('data-theme') || 'dark',
    hits: window.__contrastSweep(document.body),
  }));

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

  /* ── Explore ──────────────────────────────────────────────────────────
     The drill-down is the view a visitor actually lands on, and until now
     every check in this file measured the canvas instead. It is walked last
     because it swaps the shell, and the map measurements above have to be
     taken against the map.

     Descends two levels by clicking real cards, then climbs back with the
     back button, asserting at each step that the screen changed the way a
     reader would expect it to. */
  /* A species panel open in the map is fixed, high in the stack and 475px wide
     on a 1440px desktop — a third of the window, straight over the drill-down
     and over its cards. Switching shells has to dismiss it, so open one first
     and let the walk below find out whether it survived the crossing. This is
     the flow a reader takes: look something up, then ask for the other view.

     Opened through panel.js rather than by clicking a disc. By this point the
     probe has dragged, zoomed and expanded the canvas, and no leaf is reliably
     hit-testable any more — clickNode returns null and the panel never opens,
     which would leave this assertion permanently vacuous rather than failing
     honestly. ES modules are cached, so this is the same live instance app.js
     wired at start-up. state.nodeMap does not exist, hence walking TREE. */
  const panelOpenBeforeSwitch = await page.evaluate(async () => {
    const P = await import(new URL('js/panel.js', location.href).href).catch(() => null);
    const D = await import(new URL('js/data.js', location.href).href).catch(() => null);
    if (!P || !P.showMainPanel || !D || !D.TREE) return false;
    const leaf = (function down(n) { return n.children && n.children.length ? down(n.children[0]) : n; })(D.TREE);
    P.showMainPanel(leaf);
    await new Promise((r) => setTimeout(r, 900));
    return !!document.querySelector('#panel.open');
  });

  /* ── The wayfinder ────────────────────────────────────────────────────
     Measured here, with a species panel open, because "reachable" is the
     whole claim and an empty page is the one state in which it was never in
     doubt. The cluster it replaces was present, translated and covered by
     everything: at --z-nav + 50 it sat under the panel (400), the games
     (1000), the hominin overlay (1100) and a tour (10000), and below 769px it
     was display:none outright. Every one of those is a state a reader can
     reach, and none of them was visible to a check that only read the DOM —
     so this one asks elementFromPoint, twice, with two different things open.

     The game is opened *on top of* the panel on purpose. One Back has to take
     the game away and leave the panel standing, which is the layer rule the
     whole module exists to state; a single-overlay test passes just as well
     against a Back that closes everything at once. */
  const wayfinder = await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const desc = (el) => !el ? 'none' : el.tagName + (el.id ? '#' + el.id : '') +
      (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '');
    const box = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; };
    const onTop = (el) => {
      if (!el) return 'missing';
      const b = el.getBoundingClientRect();
      if (b.width < 1 || b.height < 1) return 'no box';
      const x = b.left + b.width / 2, y = b.top + b.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return 'off screen';
      const top = document.elementFromPoint(x, y);
      return (top === el || el.contains(top) || top.contains(el)) ? 'clear' : 'covered by ' + desc(top);
    };
    const ids = ['nav-back', 'nav-home', 'nav-share'];
    const state = () => ids.map((id) => ({ id, top: onTop(document.getElementById(id)) }));

    const out = { cluster: box(document.getElementById('nav-ctrl')), overPanel: state() };

    /* Nothing may be painted over the wayfinder — and equally, the wayfinder
       outranks the whole page now, so nothing of the page may be underneath
       it either. Boxes, not hit tests: the header has no pointer events, so
       elementFromPoint reports the canvas through the site title and would
       have called the original top-inline-start placement clear while it sat
       squarely on the words "Tree of Life". */
    const wb = document.getElementById('nav-ctrl')?.getBoundingClientRect();
    const hidden = (el) => { const s = getComputedStyle(el); return s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.02; };
    const collides = (sel) => {
      const el = document.querySelector(sel);
      if (!el || !wb || hidden(el) || hidden(document.getElementById('nav-ctrl'))) return null;
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return null;
      const over = b.left < wb.right && b.right > wb.left && b.top < wb.bottom && b.bottom > wb.top;
      return over ? `${sel} [${Math.round(b.left)},${Math.round(b.top)}–${Math.round(b.right)},${Math.round(b.bottom)}]` : null;
    };
    /* #panel .p-close is on this list because of what happened the first time
       this cluster was placed: parked at the top inline-end, it landed exactly
       on the drawer's ✕ and, outranking the panel, made it unclosable. It only
       showed up on an English desktop — Hebrew opens the drawer on the other
       edge and a phone opens it as a bottom sheet — and the way it surfaced
       was a click timeout three checks away, not anything that named the
       wayfinder. The panel body itself is *not* on the list: being over that
       is the entire point. */
    const CHROME = ['.title-main', '.title-sub', '#left-rail', '#top-right-controls',
                    '#left-rail-toggle', '#timeline', '#panel .p-close', '.reveal-panel', '#zoom-ctrl'];
    out.collisions = CHROME.map(collides).filter(Boolean);

    /* The search field is the one thing that grows into this corner, so it is
       measured while it is grown. Either it misses the cluster or the cluster
       stands aside — a text box a reader cannot see the end of is worse than
       a Back button that needs an Escape first. */
    const si = document.getElementById('search-input');
    if (si) {
      si.focus(); await wait(350);
      out.searchCollision = collides('#search-wrap');
      out.hiddenForSearch = hidden(document.getElementById('nav-ctrl'));
      si.blur(); await wait(350);
    }

    // A game on top of the panel, then one Back.
    document.getElementById('btn-quiz')?.click();
    await wait(700);
    out.gameOpen = !!document.querySelector('#game-panel.open');
    out.overGame = state();
    document.getElementById('nav-back')?.click();
    await wait(600);
    out.afterBack = {
      game: !!document.querySelector('#game-panel.open'),
      panel: !!document.querySelector('#panel.open'),
    };

    /* The link itself. It has to name the node, the shell and the language:
       the last two live only in localStorage, so a link carrying just the node
       opened in whatever the *recipient* last used. */
    try {
      const W = await import(new URL('js/wayfinder.js', location.href).href);
      out.url = W.shareUrl();
    } catch (e) { out.url = 'import failed: ' + String(e); }

    // And the button really runs. Clipboard writes are refused in a headless
    // browser, which is the fallback path — either way a toast has to appear.
    document.getElementById('nav-share')?.click();
    await wait(500);
    out.shareToast = (document.getElementById('ft-text') || {}).textContent || '';
    document.getElementById('fact-toast')?.classList.remove('visible');
    return out;
  });

  const explore = await page.evaluate(async ({ lang, panelWasOpen }) => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    /* Leave the search box the way a visitor leaves it. The interaction pass
       above types a query and never blurs the field, and the results dropdown
       hides on blur — so it was still open, floating over the drill-down, and
       the occlusion check below reported it as an Explore defect. A real click
       on the rail moves focus and dismisses it; a programmatic .click() does
       not, which is the difference between the probe and a person. */
    document.getElementById('search-input')?.blur();
    await wait(350);                            // the blur handler waits 200ms

    const btn = document.querySelector('#view-toggle [data-view="explore"]');
    if (!btn) return { checked: false, reason: 'no explore toggle' };
    btn.click();
    await wait(400);
    const panelSurvivedSwitch = panelWasOpen && !!document.querySelector('#panel.open');

    const root = document.getElementById('explore');
    if (!root) return { checked: false, reason: 'no #explore' };

    /* ── i18n over the drill-down ──────────────────────────────────────
       None of the i18n sweep above can see any of this. The runner seeds
       tol-shell-view=map, because the map measurements have to be taken
       against the map — which left the view a visitor actually lands on
       with no language coverage at all, and the suite reported green over
       untranslated English and an English paragraph laid out right-to-left.

       Two rules, and they lean on the same marker:

         a leaf with Latin words and no `data-i18n-exempt` is chrome that
         was never translated;

         an element that *is* exempt has declared itself English data, so in
         Hebrew it must also be laid out left-to-right, or bidi carries its
         punctuation to the far end — ".of all life".

       That second rule is why exempting something cannot quietly weaken the
       check: an exemption moves an element from one rule to the other. */
    const TAXA = await import(new URL('js/taxonNames.js', location.href).href)
      .then((m) => m.TAXON_NAMES).catch(() => null);
    const T = await import(new URL('js/uiData.js', location.href).href)
      .then((m) => m.TRANSLATIONS).catch(() => null);
    // The current dot announces itself with a translated prefix now, so the
    // assertion has to be against this language's string, not the English one.
    const herePrefix = (T && T[lang] && T[lang].ex_you_are_here) || 'You are here:';
    const vis = (el) => {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.02) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const name = (el) => '.' + (String(el.className || el.tagName).split(' ')[0] || el.tagName);
    const ALLOW = /^(luca|dna|rna|ma|ga|mya|3d|2d|\d+(\.\d+)?x?|[0-9\s.,:/×–—-]+)$/i;
    const latin = (s) => /[A-Za-z]{2,}/.test(s) && !/[֐-׿]/.test(s);

    /* ── Contrast over the drill-down ──────────────────────────────────
       Exactly the gap the i18n sweep had, for exactly the same reason. The
       runner seeds tol-shell-view=map because the tree geometry has to be
       measured against the tree, so the a11y sweep above ran over a shell the
       visitor never sees first, and the view they actually land on had never
       had its colours checked at all.

       Scoped to #explore rather than the whole body: the shared chrome above
       it — header, rail, search — is already swept in the map pass, and
       measuring it twice only reports the same failure twice. Runs on every
       screen, because the hero prose and the card subtitles do not exist until
       there is a real taxon to describe. */
    const contrast = { hits: [], available: typeof window.__contrastSweep === 'function',
                       theme: document.documentElement.getAttribute('data-theme') || 'dark' };
    const seenHit = new Set();
    const contrastSweep = () => {
      if (!contrast.available) return;
      for (const hit of window.__contrastSweep(root)) {
        if (seenHit.has(hit)) continue;      // the back button repeats down the descent
        seenHit.add(hit);
        contrast.hits.push(hit);
      }
    };

    const i18n = { checked: lang !== 'en', leaks: [], rtlProse: [], untranslated: [] };
    const sweep = () => {
      if (lang === 'en') return;
      for (const el of root.querySelectorAll('*')) {
        if (el.children.length || !vis(el)) continue;
        const txt = (el.textContent || '').trim();
        if (txt.length < 2) continue;
        const exempt = el.closest('[data-i18n-exempt]');
        if (!exempt) {
          if (lang !== 'he') continue;              // leak scan is Hebrew-only
          if (!latin(txt) || ALLOW.test(txt)) continue;
          i18n.leaks.push({ where: name(el), txt: txt.slice(0, 40) });
        } else if (lang === 'he' && latin(txt) && getComputedStyle(el).direction !== 'ltr') {
          i18n.rtlProse.push({ where: name(el), txt: txt.slice(0, 40) });
        }
      }
      // Ranked groups are translated even though species are not, so the
      // cards naming them have to show the localised name.
      if (!TAXA || !TAXA[lang]) return;
      for (const card of root.querySelectorAll('.ex-card')) {
        const want = TAXA[lang][card.getAttribute('data-arg')];
        const label = card.querySelector('.ex-card-name');
        if (!want || !label || !vis(label)) continue;
        const got = (label.textContent || '').trim();
        if (got !== want) i18n.untranslated.push({ id: card.getAttribute('data-arg'), got, want });
      }
    };
    sweep();
    contrastSweep();

    /* Is the element the thing a finger would actually hit at its own centre?
       Every other assertion in this probe reads the DOM, and the DOM cannot
       tell you that another view's fixed footer is painted on top — which is
       exactly what was happening to the path ribbon. Accept the element
       itself, a descendant of it, or an ancestor (the label's centre can
       resolve to the nav that holds it). */
    const onTop = (sel, node) => {
      const el = node || document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const b = el.getBoundingClientRect();
      if (b.width < 1 || b.height < 1) return { sel, covered: true, by: '(no box)' };
      const x = b.left + b.width / 2, y = b.top + b.height / 2;
      /* Below the fold is scrolling, not covering. The list is scrollable and
         its far rows are legitimately off-screen on a phone; only what is
         actually on screen can be painted over. */
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return { sel, offscreen: true };
      /* Behind the view's own bottom ribbon is also scrolling, not covering.
         The path bar is fixed and rows pass under it by design — #explore
         carries 90px of bottom padding so the last row still clears it. This
         exemption is only for rows: the ribbon's own controls are tested with
         the strict rule, which is what caught the timeline painting over them. */
      const ribbon = document.querySelector('.ex-path');
      if (ribbon && !ribbon.contains(el)) {
        const rb = ribbon.getBoundingClientRect();
        if (rb.width && y >= rb.top && y <= rb.bottom && x >= rb.left && x <= rb.right) {
          return { sel, offscreen: true };
        }
      }
      const top = document.elementFromPoint(x, y);
      if (!top) return { sel, offscreen: true };
      if (top === el || el.contains(top) || top.contains(el)) return { sel, covered: false };
      const id = top.tagName + (top.id ? '#' + top.id : '') +
        (typeof top.className === 'string' && top.className ? '.' + top.className.split(' ')[0] : '');
      const tr = top.getBoundingClientRect();
      const ts = getComputedStyle(top);
      // Enough to name the culprit without a second run: an anonymous <div>
      // says nothing, its z-index, size and opacity say which one it is.
      const chain = [];
      for (let p = top.parentElement, i = 0; p && i < 4; p = p.parentElement, i++) {
        chain.push(p.tagName + (p.id ? '#' + p.id : '') +
          (typeof p.className === 'string' && p.className ? '.' + p.className.split(' ')[0] : ''));
      }
      return { sel, covered: true,
        by: `${id} [${Math.round(tr.width)}×${Math.round(tr.height)} z:${ts.zIndex} op:${ts.opacity} pos:${ts.position}] in ${chain.join(' < ')} txt="${(top.textContent||'').trim().slice(0,30)}"` };
    };

    const snap = () => ({
      /* Every card, not just the chrome. An overlay pinned to one edge — the
         detail panel takes 475px of a 1440px window — covers the far side of
         the grid while leaving the back button at the near edge perfectly
         clear, so checking only the fixed controls would miss it entirely. */
      onTop: [
        ...['.ex-step.current', '.ex-here', '.ex-back'].map((s) => onTop(s)),
        ...[...document.querySelectorAll('.ex-card.open, .ex-card-live')]
          .map((c, i) => onTop(`.ex-card[${i}] "${(c.querySelector('.ex-card-name')?.textContent || '').trim().slice(0, 20)}"`, c)),
      ],
      title: document.querySelector('.ex-title')?.textContent.trim() || '',
      cards: document.querySelectorAll('.ex-card').length,
      dots: document.querySelectorAll('.ex-step').length,
      here: document.querySelector('.ex-here')?.textContent.trim() || '',
      current: document.querySelector('.ex-step.current')?.getAttribute('aria-label') || '',
      named: [...document.querySelectorAll('.ex-step')].every((d) => d.getAttribute('data-name')),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      visible: root.getBoundingClientRect().width > 0,
      /* The whole point of the rewrite: descending must not wipe the page. The
         open chain and the branches passed over both stay on it. */
      openRows: document.querySelectorAll('.ex-card.open').length,
      dimRows: document.querySelectorAll('.ex-card.dim').length,
    });

    const steps = [snap()];
    for (let i = 0; i < 2; i++) {
      /* .ex-card-live, not the first .ex-card on the page. The view unfolds in
         place now, so every level that is already open is still in the DOM and
         still carries a chevron — taking the first match just re-clicked the
         branch already open and folded it back up. .ex-card-live marks the
         choice set directly beneath the deepest open node, which is the only
         set a reader could descend into. */
      const card = [...document.querySelectorAll('.ex-card-live')].find((c) => c.querySelector('.ex-card-chev'));
      if (!card) break;
      card.click();
      await wait(450);
      steps.push(snap());
      // Every screen, not just the first: the hero prose and the card
      // subtitles only appear once there is a real taxon to describe.
      sweep();
      contrastSweep();
    }
    const back = document.querySelector('.ex-back');
    let afterBack = null;
    if (back && back.tagName === 'BUTTON') { back.click(); await wait(450); afterBack = snap(); }

    /* Landing deep, the way search does. openInExplore() is the entry point a
       search result uses, and nothing until now measured where the reader
       actually ends up — the probe only ever descends from the root, which
       lands near the top of the page where nothing can hide. Mammals is six
       levels down, so the row has to be scrolled to, and the bottom of this
       view is covered by its own fixed ribbon. */
    /* ── Breadth and depth on every group row ──────────────────────────
       "43 inside" answers half of what a reader wants before they open
       something. Mammals and insects both read as a wall of rows and only one
       of them has four more levels underneath it.

       Checked against the tree rather than against a pattern: the row has to
       state the real child count, and the real number of levels below. A regex
       for "a number and a word" passes just as happily on the wrong number.

       Depth is deliberately *not* named by the rank it ends at. All 49 groups
       bottom out at Species, so "down to species" would print the same phrase
       on every row on the page — which is what measuring the data first, and
       the label second, is for. */
    let rowFacts = null;
    try {
      const D = await import(new URL('js/data.js', location.href).href);
      const R = await import(new URL('js/taxonRank.js', location.href).href);
      const index = new Map();
      (function walk(n) { index.set(n.id, n); (n.children || []).forEach(walk); })(D.TREE);
      rowFacts = [...root.querySelectorAll('.ex-card')].map((card) => {
        const node = index.get(card.getAttribute('data-arg'));
        const sub = (card.querySelector('.ex-card-sub') || {}).textContent || '';
        if (!node) return null;
        const kids = (node.children || []).length;
        return { id: node.id, kids, depth: R.subtreeDepth(node), ranked: !!R.rankKey(node), sub: sub.trim() };
      }).filter(Boolean);
    } catch (e) { rowFacts = { error: String(e) }; }

    /* ── What is left when a photograph does not arrive ────────────────
       A URL that resolves is not a URL that loads, and the row's only answer
       used to be data-on-error="hide": the <img> went away and .ex-card-media
       stayed behind as an empty 36px hole. Empty is the one outcome that tells
       the reader nothing — a species with no picture and a page still loading
       look identical.

       Broken here rather than asserted about, because every other way of
       asking is a lie on some machine. The sandbox cannot reach Wikimedia at
       all, so "does every row show a picture" is red for a reason that is not
       a defect; CI can reach it, so "does any row fail" is green there for a
       reason that is not a fix. Pointing one row at a file that does not exist
       fails identically in both places. */
    let photoFallback = null;
    try {
      const img = root.querySelector('.ex-card-img');
      if (!img) {
        photoFallback = { skipped: 'no row on screen is showing a photograph' };
      } else {
        const media = img.parentElement;
        const box = Math.round(media.getBoundingClientRect().width);
        img.loading = 'eager';   // an off-screen lazy image never loads, so never errors
        img.src = new URL('assets/__no-such-photo.png', location.href).href;
        for (let i = 0; i < 30 && getComputedStyle(img).display !== 'none'; i++) await wait(100);
        const shown = [...media.children].filter((c) => {
          if (c === img) return false;
          const cs = getComputedStyle(c);
          const r = c.getBoundingClientRect();
          return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
        });
        photoFallback = {
          imgHidden: getComputedStyle(img).display === 'none',
          replacement: shown.length ? (shown[0].className || shown[0].tagName) : null,
          replacementW: shown.length ? Math.round(shown[0].getBoundingClientRect().width) : 0,
          box,
        };
      }
    } catch (e) { photoFallback = { error: String(e) }; }

    let deepLanding = null;
    try {
      const EX = await import(new URL('js/explore.js', location.href).href);
      if (EX && EX.openInExplore) {
        EX.openInExplore('mammals');
        await wait(700);
        const row = [...root.querySelectorAll('.ex-card.open')].pop();
        const ribbon = root.querySelector('.ex-path');
        if (row) {
          const r = row.getBoundingClientRect();
          const floor = ribbon ? ribbon.getBoundingClientRect().top : innerHeight;
          deepLanding = {
            name: (row.querySelector('.ex-card-name') || {}).textContent || '',
            clearsRibbon: r.bottom <= floor + 0.5,
            onScreen: r.top >= root.getBoundingClientRect().top - 0.5 && r.top < innerHeight,
            top: Math.round(r.top), bottom: Math.round(r.bottom), floor: Math.round(floor),
          };
        }
      }
    } catch (e) { deepLanding = { error: String(e) }; }

    /* ── Is the nesting actually drawn ────────────────────────────────
       Two things a screenshot shows and no other check here can see.

       The staircase first. Depth used to be carried by an indent capped at
       four steps, so levels five through ten all rendered at the same offset
       and the deepest half of the tree was drawn perfectly flat — on the view
       whose entire subject is the shape of the tree. Every other explore check
       passed throughout: the rows were present, translated, contrasty, correct
       about their own breadth and depth, and stacked in a straight line.

       Measured against the *inline* start, not the left edge, because the tree
       grows from the right in Hebrew and a left-edge measurement there reads a
       perfect staircase running the wrong way.

       Then the joins. An indent alone is what a nested list looks like; what
       makes it a tree is that each row is visibly attached to the row it came
       out of. That attachment is a pseudo-element, so it is invisible to
       innerHTML, to textContent and to every hit test — it can vanish
       completely while the DOM stays word for word identical. */
    let nesting = null;
    try {
      const EX = await import(new URL('js/explore.js', location.href).href);
      if (EX && EX.openInExplore) {
        EX.openInExplore('hominini');   // the deepest group in the tree: 8 levels
        await wait(700);
        const tree = root.querySelector('.ex-tree');
        const rtl = getComputedStyle(document.documentElement).direction === 'rtl';
        const box = tree.getBoundingClientRect();
        const inset = (el) => {
          const r = el.getBoundingClientRect();
          return Math.round(rtl ? box.right - r.right : r.left - box.left);
        };
        const chain = [...root.querySelectorAll('.ex-card.open')].map((c) => ({
          id: c.getAttribute('data-arg'),
          inset: inset(c),
        }));
        /* The limb is drawn on the row, so every row below the root owns one.
           Read the border rather than the box: a pseudo-element with no border
           still reports a width, and would pass a size-only assertion while
           drawing nothing at all. */
        const joins = [...root.querySelectorAll('.ex-kids > .ex-branch > .ex-card')].map((c) => {
          const cs = getComputedStyle(c, '::before');
          return {
            id: c.getAttribute('data-arg'),
            w: Math.round(parseFloat(cs.width) || 0),
            border: Math.round((parseFloat(cs.borderBottomWidth) || 0) * 100) / 100,
            alpha: Math.round((parseFloat(cs.opacity) || 0) * 100) / 100,
          };
        });
        nesting = { chain, joins, rtl };
      }
    } catch (e) { nesting = { error: String(e) }; }

    /* ── The era strip, on the way back out ────────────────────────────
       The timeline is display:none in this view, and neither of its measured
       parts can draw itself from a zero-sized box — the labels are left
       untrimmed and the density canvas keeps whatever it last drew. Both are
       rebuilt by applyI18n() and applyTheme(), so a language switch or a theme
       toggle taken *here* leaves the map's strip wrong, and start-up does the
       same because setShellView() hides the strip before init() builds it.

       Toggled once, not twice. Twice would restore the theme here and be
       tidier, and it would also destroy the thing being tested: a curve that
       was not redrawn is only wrong if the theme moved under it, so a net-zero
       toggle leaves a stale canvas indistinguishable from a correct one. It
       passed against the real bug when written that way. The theme is put back
       further down, after the measurements, so the scenario still ends on its
       own palette. */
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) { themeBtn.click(); await wait(300); }

    document.querySelector('#view-toggle [data-view="map"]')?.click();
    await wait(300);

    /* Exactly what timeline:era-labels-not-clipped measures, at the one moment
       that check cannot reach: the runner seeds tol-shell-view=map, so its
       pass has only ever seen a strip that was visible when it was built. */
    await wait(250);                            // hideOverflowingEraLabels waits a frame
    const eraClippedAfterReturn = [...document.querySelectorAll('#era-segments .era-seg')]
      .filter((e) => e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0)
      .map((e) => (e.textContent || '').trim().slice(0, 24));

    /* The curve has no "clipped" tell — a stale one is a normal-looking chart
       drawn in the other theme's ink. So compare it against a redraw known to
       be correct: toggle away and back here, in the map, where the canvas has
       a box, which lands on the same theme having genuinely repainted twice.
       Identical pixels mean the return path rebuilt it; different pixels mean
       it came back carrying the drawing it made before the shell switch. */
    const fingerprint = () => {
      const c = document.getElementById('tl-density');
      if (!c || !c.width || !c.height) return null;
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let h = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 8) h = (h * 31 + d[i] * 7 + d[i + 1] * 13 + d[i + 2] * 17) >>> 0;
      }
      return h.toString(16);
    };
    const densityOnReturn = fingerprint();
    if (themeBtn) { themeBtn.click(); await wait(250); themeBtn.click(); await wait(300); }
    const densityRedrawn = fingerprint();
    // Back to the palette this scenario is meant to be measured in.
    if (themeBtn) { themeBtn.click(); await wait(300); }

    return { checked: true, steps, afterBack, i18n, herePrefix, contrast, rowFacts, photoFallback, nesting,
             eraClippedAfterReturn, densityOnReturn, densityRedrawn,
             panelOpenBeforeSwitch: panelWasOpen, panelSurvivedSwitch, deepLanding };
  }, { lang: scenario.lang, panelWasOpen: panelOpenBeforeSwitch });

  // Read CSP violations last: inline event handlers are only evaluated when
  // they fire, so blocking them shows up during the interactions above rather
  // than on load. This supersedes the value collected in the first pass.
  const cspViolations = [...new Set(await page.evaluate(() => window.__cspViolations || []))];

  /* ── Following a shared link ──────────────────────────────────────────
     The last thing done in the scenario, because it is the only measurement
     that needs its own page load and everything above has already been taken.

     The runner seeds the *opposite* of what the link asks for — its
     localStorage says the map in this scenario's language — so a page that
     ignored the query string would come up looking exactly like every other
     scenario and pass by accident. The link asks for the drill-down in
     Russian; the stored preferences have to survive it untouched, because
     reading someone else's link is not the same as changing your own mind. */
  const sharedLink = await (async () => {
    try {
      await page.goto(baseUrl + '/atlas.html?node=primates&view=explore&lang=ru', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      /* A link to a species has no opening (js/boot.js), so there may be nothing to skip. */
      await page.evaluate(() => { const b = document.getElementById('splash-skip'); if (b && b.offsetParent !== null) b.click(); });
      await page.waitForTimeout(1800);
      return await page.evaluate(() => ({
        view: document.body.getAttribute('data-view'),
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        here: (document.querySelector('.ex-here') || {}).textContent || '',
        cards: document.querySelectorAll('.ex-card').length,
        storedLang: localStorage.getItem('tol-lang'),
        storedView: localStorage.getItem('tol-shell-view'),
      }));
    } catch (e) { return { error: String(e) }; }
  })();

  /* ── Things a reader does after the page has loaded ────────────────────
     The runner seeds the language and the shell before load, so neither
     "switch language while in the drill-down" nor "click the rail's Radial
     while in the drill-down" has ever been performed by any check above.
     Both were broken on main: the rows kept the old language, and Radial
     acted on a map that was display:none. Load into the drill-down without
     persisting (?view=explore) and do them. */
  const afterLoad = await (async () => {
    try {
      await page.goto(baseUrl + '/atlas.html?view=explore', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.ex-card', { timeout: 20000 });
      await page.evaluate(() => { const b = document.getElementById('splash-skip'); if (b && b.offsetParent !== null) b.click(); });
      await page.waitForTimeout(800);
      return await page.evaluate(async ({ from }) => {
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        const { TREE } = await import(new URL('js/data.js', location.href).href);
        const { displayName } = await import(new URL('js/utils.js', location.href).href);
        const find = (n, id) => (n.id === id ? n : (n.children || []).reduce((f, c) => f || find(c, id), null));
        const to = from === 'he' ? 'ru' : 'he';
        const out = { from, to };
        const names = () => [...document.querySelectorAll('.ex-card')].map((c) => ({
          id: c.getAttribute('data-arg'),
          text: (c.querySelector('.ex-card-name')?.textContent || '').trim(),
        }));
        out.cardsBefore = names().length;
        document.querySelector(`.lang-btn[data-lang="${to}"]`)?.click();
        await wait(400);
        out.langAfter = document.documentElement.lang;
        out.stale = names().filter((n) => {
          const node = find(TREE, n.id);
          return node && displayName(node).trim() !== n.text;
        }).slice(0, 5).map((n) => `${n.id}="${n.text}"`);
        out.cardsAfter = names().length;
        out.chrome = (document.querySelector('.ex-back, .ex-here')?.textContent || '').trim();
        // put the language back for whatever runs next
        document.querySelector(`.lang-btn[data-lang="${from}"]`)?.click();
        await wait(300);

        /* The View group in the rail, as a reader meets it: on a phone the rail
           is closed until the ☰ is pressed. A pre-rail mobile rule had shifted
           the whole group off the start edge while it stayed in the DOM. */
        const toggle = document.getElementById('left-rail-toggle');
        const toggleShown = !!toggle && getComputedStyle(toggle).display !== 'none';
        if (toggleShown && !document.getElementById('left-rail').classList.contains('open')) { toggle.click(); await wait(500); }
        out.railButtons = [...document.querySelectorAll('#view-toggle .view-btn')]
          .filter((b) => getComputedStyle(b).display !== 'none')
          .map((b) => {
            const r = b.getBoundingClientRect();
            const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
            return { label: b.textContent.trim().slice(0, 14), x: Math.round(r.x), right: Math.round(r.right),
                     w: Math.round(r.width), h: Math.round(r.height), reachable: !!hit && (b === hit || b.contains(hit)) };
          });
        out.viewport = innerWidth;
        if (toggleShown) { toggle.click(); await wait(400); }

        // The rail's map instruments, clicked from the drill-down.
        out.rail = [];
        for (const mode of ['radial', 'cladogram']) {
          document.querySelector('#view-toggle [data-view="explore"]')?.click();
          await wait(300);
          const startView = document.body.getAttribute('data-view');
          if (toggleShown) { toggle.click(); await wait(400); }   // a phone opens the rail first
          // a real tap: the rail's own close-on-choose listens for click events that bubble
          document.querySelector(`#view-toggle [data-mode="${mode}"]`)?.click();
          await wait(700);
          const railOpenAfter = document.getElementById('left-rail').classList.contains('open');
          const svg = document.getElementById('svg');
          const r = svg ? svg.getBoundingClientRect() : { width: 0, height: 0 };
          out.rail.push({
            mode, startView,
            view: document.body.getAttribute('data-view'),
            active: !!document.querySelector(`#view-toggle [data-mode="${mode}"].active`),
            mapVisible: !!svg && getComputedStyle(svg).display !== 'none' && r.width > 0 && r.height > 0,
            nodes: document.querySelectorAll('#viewport g.node-group').length,
            overlayRail: toggleShown, railOpenAfter,
          });
        }
        /* The probe's last step left the map in the cladogram. Where does each
           leaf's label sit against its own node? Outward: to the right, and in
           Hebrew — where the whole tree is mirrored — to the left. (Labels are
           drawn at absolute x, so the node's own x comes from the tree.) */
        const kids = (n) => (n.children || []).filter((c) => !c._hiddenByToggle);
        out.cladogramLabels = [...document.querySelectorAll('#viewport g.node-group[data-node-id]')].map((g) => {
          const node = find(TREE, g.getAttribute('data-node-id'));
          const t = g.querySelector('.node-label-name');
          if (!node || !t || (kids(node).length && !node._collapsed)) return null;   // leaves only: no visible children, or collapsed
          return { id: node.id, dx: Math.round(+t.getAttribute('x') - node._x) };
        }).filter(Boolean);
        out.dir = document.documentElement.dir;
        out.mode = document.querySelector('#view-toggle .view-btn.active[data-mode]')?.dataset.mode;
        return out;
      }, { from: scenario.lang });
    } catch (e) { return { error: String(e) }; }
  })();

  /* The opening has page loads of its own, in contexts of its own, so it goes
     last and touches nothing above. */
  const opening = await openingProbe(page, scenario, baseUrl).catch((e) => ({ error: String(e) }));
  // and so does the name, in contexts of its own
  const name = await nameProbe(page, scenario, baseUrl).catch((e) => ({ error: String(e) }));
  const orbit = await withinMs(orbitProbe(page, scenario, baseUrl), 240000, 'the Orbit pass').catch((e) => ({ error: String(e) }));

  return { ...base, ...forced, tooltipShown, tooltipCoversNode, tipFact, zoomWorks, afterReset, parentExpands, panelOpened, panelProse, heroOverlaps, heroPhoto, photoHostReachable: await wikimediaReachable(), contrast, searchQuality,
           searchResults, afterExpandAll, toastBox, panelOpenBox, cameraSettles, cspViolations, explore, wayfinder, sharedLink, afterLoad, opening, name, orbit };
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
  /* js/ is read recursively and every page is listed: the encyclopedia is
     atlas.html, the game is index.html (and a stub at play.html for old links),
     and a flat read of js/ would have exempted all of the game's code from every
     rule below without a word. */
  const files = [
    ...(await readdir(cssDir)).filter((f) => f.endsWith('.css')).map((f) => path.join(cssDir, f)),
    ...(await readdir(jsDir, { recursive: true })).filter((f) => f.endsWith('.js')).map((f) => path.join(jsDir, f)),
    ...(await readdir(storyDir)).filter((f) => /\.(js|css|html)$/.test(f)).map((f) => path.join(storyDir, f)),
    path.join(ROOT, 'atlas.html'),
    path.join(ROOT, 'index.html'),
    path.join(ROOT, 'play.html'),
    path.join(ROOT, 'credits.html'),
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

  /* js/boot.js runs before any module and cannot import, so it keeps its own
     list of languages and of right-to-left ones. A language added to
     TRANSLATIONS and left out of it would open in the page's defaults — English,
     left-to-right — until js/app.js corrected it a second later; a right-to-left
     one would spend that second on the wrong side of the screen. */
  const bootKey = 'static/opening:boot-knows-every-language';
  const bootId = 'opening:boot-knows-every-language';
  const bootTitle = 'js/boot.js lists every language and every right-to-left one';
  results.push(await (async () => {
    const bad = (msg) => ({ key: bootKey, id: bootId, title: bootTitle, ok: false, msg });
    const boot = await readFile(path.join(ROOT, 'js/boot.js'), 'utf8');
    const list = (name) => {
      const m = new RegExp(`var ${name} = \\[([^\\]]*)\\]`).exec(boot);
      return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]).sort() : null;
    };
    const langs = list('LANGS'), rtl = list('RTL');
    if (!langs || !rtl) return bad('could not read LANGS and RTL out of js/boot.js');
    // a data: URL, so Node reads it as a module without asking package.json what it is
    const ui = await readFile(path.join(ROOT, 'js/uiData.js'), 'utf8');
    const { TRANSLATIONS } = await import('data:text/javascript,' + encodeURIComponent(ui));
    const have = Object.keys(TRANSLATIONS).sort();
    if (JSON.stringify(langs) !== JSON.stringify(have)) {
      return bad(`boot.js knows [${langs}] but TRANSLATIONS has [${have}]`);
    }
    const theme = await readFile(path.join(ROOT, 'js/theme.js'), 'utf8');
    const rule = /isRtl\s*=\s*lang\s*===\s*'([a-z]+)'/.exec(theme);
    if (!rule) return bad('js/theme.js no longer decides direction with `isRtl = lang === \'xx\'` — teach this check the new rule, and js/boot.js with it');
    if (JSON.stringify(rtl) !== JSON.stringify([rule[1]])) {
      return bad(`boot.js treats [${rtl}] as right-to-left; js/theme.js treats [${rule[1]}] as right-to-left`);
    }
    return { key: bootKey, id: bootId, title: bootTitle, ok: true };
  })());

  /* A native alert, confirm or prompt is a box the page cannot style, translate
     or leave alone, and it stops everything behind it. prompt() asked for a name
     five seconds into a first visit, in English, on every screen size, and the
     runtime check (load:no-native-dialogs) only sees a dialog on a path the
     suite happens to walk. This reads the source, so any path counts. A method
     of another object — `deferred.prompt()`, the install prompt — is not one. */
  const dialogKey = 'static/dialogs:none-in-source';
  const dialogTitle = 'No source file calls alert, confirm or prompt';
  results.push(await (async () => {
    const DIALOG = /(?<![\w$.])(?:window\.)?(alert|confirm|prompt)\s*\(/;
    const hits = [];
    for (const [f, src] of sources) {
      if (!f.endsWith('.js')) continue;
      // comments are stripped first, and `://` is kept: a URL is not one
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/[^\n]*/g, '$1');
      const m = DIALOG.exec(code);
      if (m) hits.push(`${path.relative(ROOT, f)} calls ${m[0]}`);
    }
    return hits.length
      ? { key: dialogKey, id: 'dialogs:none-in-source', title: dialogTitle, ok: false, msg: hits.slice(0, 3).join('; ') }
      : { key: dialogKey, id: 'dialogs:none-in-source', title: dialogTitle, ok: true };
  })());

  /* The name offer is built from t('name_offer_*') at the moment it is shown.
     A key missing from a language falls back to English — quietly, in the one
     card whose whole point is that it is in the reader's own language — so all
     six are checked for every language, and the two placeholders the
     confirmation is filled through must survive translation. */
  const offerKey = 'static/i18n:name-offer-in-every-language';
  const offerId = 'i18n:name-offer-in-every-language';
  const offerTitle = 'The name offer has all six strings, in every language, translated';
  results.push(await (async () => {
    const bad = (msg) => ({ key: offerKey, id: offerId, title: offerTitle, ok: false, msg });
    const ui = await readFile(path.join(ROOT, 'js/uiData.js'), 'utf8');
    const { TRANSLATIONS } = await import('data:text/javascript,' + encodeURIComponent(ui));
    const KEYS = ['title', 'text', 'placeholder', 'save', 'skip', 'saved'].map((k) => 'name_offer_' + k);
    for (const [lang, T] of Object.entries(TRANSLATIONS)) {
      for (const k of KEYS) {
        if (typeof T[k] !== 'string' || !T[k].trim()) return bad(`${lang} has no ${k}`);
        if (lang !== 'en' && T[k] === TRANSLATIONS.en[k]) return bad(`${lang}.${k} is the English text`);
      }
      for (const token of ['{name}', '{pts}']) {
        if (!T.name_offer_saved.includes(token)) return bad(`${lang}.name_offer_saved has lost ${token}`);
      }
    }
    return { key: offerKey, id: offerId, title: offerTitle, ok: true };
  })());

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
    /* The map, not the drill-down. Explore is what a visitor lands on, but
       every check below this line measures the canvas — node counts, framing,
       spill, the camera. Seeding the shell here keeps that coverage honest;
       the drill-down needs its own checks rather than borrowing these. */
    localStorage.setItem('tol-shell-view', 'map');
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
  const pageErrors = [], consoleErrors = [], failedRequests = [], dialogs = [];
  page.on('pageerror', (e) => pageErrors.push(String(e && e.message ? e.message : e)));
  /* A native dialog is recorded and dismissed: left alone it would hold the run
     up, and Playwright's own default — dismiss it in silence — is how a prompt()
     made a Guest of every visitor in every run of this suite without anyone
     seeing it. load:no-native-dialogs reads the list. */
  page.on('dialog', (d) => { dialogs.push(`${d.type()}: ${d.message().slice(0, 80)}`); d.dismiss().catch(() => {}); });
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  /* One 404 is asked for on purpose: explore:a-broken-photo-still-shows-something
     points a row's photograph at a file that does not exist, because that is
     the only way to test the fallback that means the same thing on a machine
     which can reach Wikimedia and one which cannot. Named once here so the
     exemption is a single literal rather than a pattern that could swallow a
     real missing asset. */
  const DELIBERATE_404 = '/assets/__no-such-photo.png';
  const ours = (u) => u.startsWith(baseUrl) && !u.replace(baseUrl, '').startsWith(DELIBERATE_404);
  page.on('requestfailed', (r) => {
    // Only same-origin resources — third-party CDNs are out of our control and
    // the page is designed to work without them.
    if (ours(r.url())) failedRequests.push(r.url().replace(baseUrl, ''));
  });
  page.on('response', (r) => {
    if (ours(r.url()) && r.status() >= 400) {
      failedRequests.push(`${r.status()} ${r.url().replace(baseUrl, '')}`);
    }
  });

  if (!GROUP_ONLY) {
    await page.goto(baseUrl + '/atlas.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    await page.click('#splash-skip', { timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(2200);

    if (KEEP_SHOTS) {
      await page.screenshot({ path: path.join(OUT_DIR, `${scenario.id}.png`), fullPage: false });
    }
  }

  const probe = OPENING_ONLY
    ? { opening: await openingProbe(page, scenario, baseUrl).catch((e) => ({ error: String(e) })) }
    : PROFILE_ONLY
      ? { name: await nameProbe(page, scenario, baseUrl).catch((e) => ({ error: String(e) })) }
      : ORBIT_ONLY
        ? { orbit: await withinMs(orbitProbe(page, scenario, baseUrl), 240000, 'the Orbit pass').catch((e) => ({ error: String(e) })) }
        : await probePage(page, scenario, baseUrl);
  const c = { probe, scenario, pageErrors, consoleErrors, failedRequests, dialogs, page };

  const results = [];
  for (const chk of checks) {
    if (!chk.when(scenario)) continue;
    if (GROUP_ONLY && !GROUP_IDS[GROUP_ONLY].test(chk.id)) continue;
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
    if (ONLY.length && !ONLY.includes(scenario.id)) continue;
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

if (UPDATE_BASELINE && FILTERED) {
  process.stdout.write('\nRefusing to rewrite the baseline from a filtered run: it would '
    + 'delete every entry the skipped scenarios own.\n');
  process.exit(1);
}

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
const ran = ONLY.length ? SCENARIOS.filter((sc) => ONLY.includes(sc.id)) : SCENARIOS;
process.stdout.write(`${passed}/${all.length} checks passed across ${ran.length} scenario(s)`
  + (FILTERED ? ` — FILTERED to ${[...ONLY, ...(GROUP_ONLY ? [`the ${GROUP_ONLY} group`] : [])].join(', ')}, not a full run.\n` : '.\n'));
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
