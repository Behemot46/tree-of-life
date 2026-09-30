// ══════════════════════════════════════════════════════
// SPLASH.JS — the opening: 3.8 billion years, drawn to scale
//
// This file is the lifecycle. The picture is js/splashScene.js (the Astrolabe:
// an engraved dial where distance from the centre is time) and the first paint
// is css/splash.css (a ring and a point that need no script). Here: laying the
// two canvases and the words out for the viewport, running the clock, and
// getting out of the way.
//
// Things this screen has to be, in order of importance:
//   • skippable from the first frame — a click, Enter, Space or Escape;
//   • short: 4.5 s the first time, about 2.6 s once someone has seen it;
//   • honest about loading: the ring is already on screen while the modules
//     load, and the animation starts when there is something to animate;
//   • quiet when asked: with reduced motion it paints the finished plate once;
//   • fast on a slow phone: it watches its own frame rate and drops a notch,
//     and keeps to the wall clock so the title still arrives on time.
// ══════════════════════════════════════════════════════

import { buildScene, DURATION, T_TITLE, T_HINT } from './splashScene.js';

const AUTO_S = 6.5;             // seconds until it dismisses itself, first visit
const RETURN_SPEED = 1.7;       // a second visit plays the same show, faster
const FADE_MS = 450;
const DPR_CAP = 2;              // the dial is hairlines; the rest is soft
const LITE_AFTER = 22;          // frames watched before deciding whether the device needs a lighter show
const LITE_MS = 38;             // ...and the average frame time, in ms, above which it does

export function initSplash(canvas, opts) {
  const { tree, t: tr, onDone } = opts;
  const splashEl = document.getElementById('splash');
  const under = document.getElementById('splash-under');
  const skipBtn = document.getElementById('splash-skip');
  const fallback = document.getElementById('splash-fallback');
  const ctx = canvas.getContext('2d');
  const uctx = under && under.getContext('2d');
  const $ = (id) => document.getElementById(id);

  let done = false, raf = null, autoTimer = null, resizeTimer = null;
  const returning = document.documentElement.hasAttribute('data-return');
  const speed = returning ? RETURN_SPEED : 1;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── The words the page owns ──────────────────────────
  const setText = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
  setText('splash-fb-title', tr('title'));
  setText('splash-fb-subtitle', tr('splash_subtitle'));
  setText('splash-fb-click', tr('splash_click'));
  if (skipBtn) { skipBtn.textContent = tr('splash_skip'); skipBtn.style.opacity = '1'; }   // never make anyone wait to skip
  wireDismiss();

  if (!ctx || !uctx) return noCanvas();

  $('sw-title').firstElementChild.textContent = tr('title');
  $('sw-sub').firstElementChild.textContent = tr('splash_subtitle');
  setText('sw-hint', tr('splash_click'));

  const css = getComputedStyle(document.documentElement);
  const gold = (css.getPropertyValue('--accent-primary') || '').trim() || '#F2AC52';
  const light = document.documentElement.getAttribute('data-theme') === 'light';

  // ── Layout: everything that depends on the size of the window ──
  let scene = null, dpr = 1, lite = false, W = 0, H = 0;
  let scaleEls = [], lastCounter = null;
  let elapsed = 0, start = null, last = null, frames = 0, slowMs = 0, hidden = 0, hiddenAt = null;
  const now = () => (reduced ? DURATION : Math.min(DURATION, elapsed * speed));

  function layout() {
    W = window.innerWidth; H = window.innerHeight;
    scene = buildScene({ tree, W, H, light, gold });
    const g = scene.geom;
    dpr = lite ? 1 : Math.min(window.devicePixelRatio || 1, DPR_CAP);

    // the still layer: whole window
    under.width = Math.round(W * dpr); under.height = Math.round(H * dpr);
    scene.under(uctx, dpr);
    // the live layer: only the dial
    sizeLive(g);
    canvas.style.left = g.boxL + 'px'; canvas.style.top = g.boxT + 'px';
    canvas.style.width = g.box + 'px'; canvas.style.height = g.box + 'px';

    // the first paint used CSS arithmetic; from here the exact numbers
    splashEl.style.setProperty('--cx', g.cx + 'px');
    splashEl.style.setProperty('--cy', g.cy + 'px');
    splashEl.style.setProperty('--Rc', g.Rc + 'px');

    placeScale(g);
    placeWords(g);
  }

  /** The live canvas's bitmap, at the current pixel ratio. Changing it clears it,
      which is fine: every frame is drawn from nothing. */
  function sizeLive(g) {
    canvas.width = Math.round(g.box * dpr); canvas.height = Math.round(g.box * dpr);
  }

  /** The radial scale runs down the empty gap at the bottom, into the title.
      Its numbers are Latin digits in a monospace face and no width here depends
      on a web font, which is why this is not part of placeWords: laying the words
      out again when a font arrives would rebuild these, and rebuilt labels fade
      in from nothing — a visible blink in the middle of the show. */
  function placeScale(g) {
    const list = $('sw-scale');
    list.textContent = '';
    scaleEls = scene.labels.map((l, i) => {
      const li = document.createElement('li');
      li.textContent = i === 0 ? `${l.ga.toFixed(1)} Ga` : l.ga.toFixed(1);
      li.dir = 'ltr';
      li.style.left = g.cx + 'px'; li.style.top = (g.cy + l.r) + 'px';
      li.style.fontSize = Math.max(7.5, 8.5 * g.k) + 'px';
      list.appendChild(li);
      return { li, r: l.r };
    });
  }

  /** The words whose size depends on the fonts: the readout, the plaque and its title. */
  function placeWords(g) {
    const py = g.plaqueTop, ph = g.plate;
    // the readout sits in the gap between the dial and the plaque, so it can never be under the plaque's rules
    const counter = $('sw-counter');
    counter.style.top = (g.cy + g.Rc + g.gap / 2 - counter.offsetHeight / 2) + 'px';

    // the plaque: a frame, the title above a rule, the line beneath
    const plaque = $('sw-plaque');
    plaque.style.left = g.plaqueX + 'px'; plaque.style.top = py + 'px';
    plaque.style.width = g.plaqueW + 'px'; plaque.style.height = ph + 'px';
    const inner = g.plaqueW * 0.86;
    drawFrame(g.plaqueW, ph, g.k, inner);

    const title = $('sw-title'), sub = $('sw-sub');
    fit(title, g.small ? 27 : 34, inner);
    fit(sub, g.small ? 10 : 12, inner);
    title.style.top = (ph * 0.37 - title.offsetHeight / 2) + 'px';
    sub.style.top = (ph * 0.80 - sub.offsetHeight / 2) + 'px';

    const hint = $('sw-hint');
    hint.style.top = (py + ph + (g.small ? 22 : 26)) + 'px';
  }

  /** Largest size at or below `px` at which the text of `el` fits in `limit` px.
      The width is the inner span's, so it is the text's own and not the box's. */
  function fit(el, px, limit) {
    const text = el.firstElementChild;
    let s = px;
    for (let i = 0; i < 12; i++) {
      el.style.fontSize = s + 'px';
      if (text.getBoundingClientRect().width <= limit || s <= 9) break;
      s -= Math.max(0.5, s * 0.07);
    }
  }

  /** The plaque's frame: a chamfered double rule, the diamond where it meets the
      dial, and a short rule with its own diamond between the title and the line beneath. */
  function drawFrame(w, h, k, inner) {
    const svg = $('sw-frame'), ns = 'http://www.w3.org/2000/svg';
    svg.textContent = '';
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const cham = 6 * k + 2;
    const mk = (d, cls, extra) => { const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); if (cls) p.setAttribute('class', cls); if (extra) for (const [a, v] of Object.entries(extra)) p.setAttribute(a, v); svg.appendChild(p); };
    for (const [inset, opacity, width] of [[0, 0.95, 1], [4, 0.55, 0.55]]) {
      const l = inset, r = w - inset, t = inset, b = h - inset, c = cham - inset * 0.4;
      mk(`M${l + c} ${t}H${r - c}L${r} ${t + c}V${b - c}L${r - c} ${b}H${l + c}L${l} ${b - c}V${t + c}Z`, '', { 'stroke-opacity': opacity, 'stroke-width': width });
    }
    const d = 4 * k + 1;
    mk(`M${w / 2} ${-d - 1}L${w / 2 + d + 1} 0L${w / 2} ${d + 1}L${w / 2 - d - 1} 0Z`, 'sw-diamond', { 'stroke-width': 1 });
    const ry = h * 0.61;
    mk(`M${w / 2 - inner * 0.34} ${ry}H${w / 2 - 8}M${w / 2 + 8} ${ry}H${w / 2 + inner * 0.34}`, '', { 'stroke-opacity': 0.8, 'stroke-width': 0.6 });
    mk(`M${w / 2} ${ry - 3}L${w / 2 + 3} ${ry}L${w / 2} ${ry + 3}L${w / 2 - 3} ${ry}Z`, 'sw-gem');
  }

  layout();
  canvas.dataset.ready = '1';                                    // js/app.js watches for this
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', onFonts);

  // ── Words at time t ──
  const counterEl = $('sw-counter').firstElementChild;
  function words(t, finalState) {
    const s = scene.state(t);
    const label = s.mya > 0 ? `${s.mya.toLocaleString('en')} Ma` : tr('splash_present');
    if (label !== lastCounter) { counterEl.textContent = label; counterEl.dir = s.mya > 0 ? 'ltr' : 'auto'; lastCounter = label; }
    $('sw-counter').style.opacity = finalState ? 0 : String(s.counter * 0.95);
    for (const e of scaleEls) { e.li.classList.toggle('on', t > 0.4); e.li.classList.toggle('lit', s.rf >= e.r); }
    splashEl.classList.toggle('show-plaque', t >= T_TITLE);
    splashEl.classList.toggle('show-hint', t >= T_HINT);
  }

  // ── Reduced motion: the finished plate, once ──
  if (reduced) {
    splashEl.classList.add('is-live');
    scene.draw(ctx, dpr, DURATION);
    words(DURATION, true);
    autoTimer = setTimeout(dismiss, 2500);
    window.addEventListener('resize', onResize);
    return;
  }

  // ── The show ─────────────────────────────────────────
  splashEl.classList.add('is-live');
  scene.draw(ctx, dpr, 0);
  words(0, false);
  raf = requestAnimationFrame(frame);
  autoTimer = setTimeout(dismiss, (AUTO_S / speed) * 1000);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);

  /* The show follows the wall clock, not the frames. Adding up capped steps —
     which is what stops a backgrounded tab from jumping — turns a slow phone
     into slow motion: at a sixth of this machine's speed the title had still
     not been engraved when the safety net took the opening down, so the visitor
     never saw it. Frames may be dropped; the title arrives when it is due. Time
     spent in a hidden tab is taken off instead. */
  function frame(ts) {
    if (done) return;
    if (start == null) { start = ts; last = ts; }
    elapsed = (ts - start) / 1000 - hidden;
    const t = Math.min(DURATION, Math.max(0, elapsed * speed));
    scene.draw(ctx, dpr, t, lite ? 0 : 1);
    words(t, false);

    // A slow phone gets a lighter frame rather than a slideshow: after the
    // first stretch, if the average frame is over LITE_MS, draw at one pixel per
    // CSS pixel and leave out the glows. (A single long frame counts as 200 ms
    // at most, and the first few, which carry start-up, not at all.)
    const dtMs = Math.min(200, ts - last); last = ts;
    if (!lite && ++frames > 6 && frames <= LITE_AFTER) slowMs += dtMs;
    if (!lite && frames === LITE_AFTER && slowMs / (LITE_AFTER - 6) > LITE_MS) {
      // only the live canvas changes: the still layer is already painted, and laying the whole scene out again cost a visible hitch
      lite = true; dpr = 1; sizeLive(scene.geom);
    }

    raf = requestAnimationFrame(frame);
  }

  function onVisibility() {
    if (document.hidden) hiddenAt = performance.now();
    else if (hiddenAt != null) { hidden += (performance.now() - hiddenAt) / 1000; hiddenAt = null; }
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (done) return;
      layout();
      scene.draw(ctx, dpr, now(), lite ? 0 : 1);
      words(now(), reduced);
    }, 120);
  }

  /** A web font arriving changes every width the title was fitted against, so the
      title and its plaque are fitted again. Not the scale, which depends on no
      font, and not the picture, which has no text in it. */
  function onFonts() {
    if (done || !scene) return;
    placeWords(scene.geom);
  }

  // ── Leaving ──────────────────────────────────────────
  function wireDismiss() {
    if (skipBtn) skipBtn.addEventListener('click', (e) => { e.stopPropagation(); dismiss(); });
    if (splashEl) splashEl.addEventListener('click', dismiss);
    if (fallback) fallback.addEventListener('click', dismiss);
    document.addEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (done) return;
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismiss(); }
  }

  /** No 2D canvas at all: the words on their own, and the same ways out. */
  function noCanvas() {
    splashEl.classList.add('no-canvas');
    canvas.dataset.ready = '1';
    autoTimer = setTimeout(dismiss, 4000);
  }

  function dismiss() {
    if (done) return;
    done = true;
    clearTimeout(autoTimer); clearTimeout(resizeTimer);
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVisibility);
    if (document.fonts && document.fonts.removeEventListener) document.fonts.removeEventListener('loadingdone', onFonts);
    try { localStorage.setItem('tol-splash-seen', '1'); } catch { /* private mode */ }
    if (splashEl) {
      splashEl.style.opacity = '0';
      setTimeout(() => { splashEl.style.display = 'none'; onDone(); }, FADE_MS);
    } else {
      onDone();
    }
  }
}
