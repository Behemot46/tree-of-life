// ══════════════════════════════════════════════════════
// SAPIENS — Homo sapiens full-screen showcase
// ══════════════════════════════════════════════════════

import { state, nodeMap, navStack } from './state.js';
import { reducedMotion } from './utils.js';
import { SAPIENS_HERO } from './sapiensData.js';

// ── Late-binding deps ──
let _pushNav, _navBack, _showMainPanel, _t, _scheduleRender, _smoothPanTo;
export function initSapiensDeps(deps) {
  _pushNav = deps.pushNav;
  _navBack = deps.navBack;
  _showMainPanel = deps.showMainPanel;
  _t = deps.t;
  _scheduleRender = deps.scheduleRender;
  _smoothPanTo = deps.smoothPanTo;
}

let overlay = null;
let drawer = null;
let observers = [];

// ── Helper: localized text ──
function txt(obj) {
  if (typeof obj === 'string') return obj;
  return obj[state.currentLang] || obj.en || '';
}

// ── Helper: observe for scroll-triggered animation ──
function onVisible(el, callback, opts = {}) {
  if (reducedMotion() && !opts.essential) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        callback(e.target);
        if (!opts.repeat) obs.unobserve(e.target);
      }
    });
  }, { threshold: opts.threshold || 0.2 });
  obs.observe(el);
  observers.push(obs);
}

// ── Helper: parse a counter value string like '8B', '300K', '1' ──
function parseCounterValue(val) {
  if (typeof val === 'number') return { numeric: val, suffix: '' };
  const str = String(val);
  const match = str.match(/^(\d+(?:\.\d+)?)([BKMGT]?)(\+?)$/i);
  if (!match) return { numeric: 0, suffix: str };
  return {
    numeric: Number(match[1]),
    suffix: match[2].toUpperCase() + match[3],
  };
}

// ══════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════

export function openSapiens() {
  if (overlay) return;
  _pushNav();

  overlay = document.createElement('div');
  overlay.className = 'sapiens-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Homo sapiens showcase');

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'sapiens-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closeSapiens);
  overlay.appendChild(closeBtn);

  // Scroll container
  const scroll = document.createElement('div');
  scroll.className = 'sapiens-scroll';
  overlay.appendChild(scroll);

  // Drawer
  drawer = document.createElement('div');
  drawer.className = 'sapiens-drawer';
  const drawerClose = document.createElement('button');
  drawerClose.className = 'sapiens-drawer-close';
  drawerClose.setAttribute('aria-label', 'Close');
  drawerClose.innerHTML = '&times;';
  drawerClose.addEventListener('click', closeDrawer);
  drawer.appendChild(drawerClose);
  const drawerContent = document.createElement('div');
  drawerContent.className = 'sapiens-drawer-content';
  drawer.appendChild(drawerContent);
  overlay.appendChild(drawer);

  // Build sections
  scroll.appendChild(buildHero());
  // Sections 2-5 will be added in Tasks 4-7

  // Lock body scroll and show
  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));

  // Keyboard handler
  overlay._onKey = e => {
    if (e.key === 'Escape') {
      if (drawer.classList.contains('open')) closeDrawer();
      else closeSapiens();
    }
  };
  document.addEventListener('keydown', overlay._onKey);
}

export function closeSapiens() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.removeEventListener('keydown', overlay._onKey);
  observers.forEach(o => o.disconnect());
  observers = [];
  setTimeout(() => {
    overlay.remove();
    overlay = null;
    drawer = null;
    document.body.style.overflow = '';
  }, 300);
}

// ══════════════════════════════════════════════════════
// DRAWER
// ══════════════════════════════════════════════════════

function openDrawer(buildFn) {
  const content = drawer.querySelector('.sapiens-drawer-content');
  content.innerHTML = '';
  buildFn(content);
  drawer.classList.add('open');
}

function closeDrawer() {
  drawer.classList.remove('open');
}

// ══════════════════════════════════════════════════════
// SECTION 1: HERO
// ══════════════════════════════════════════════════════

function buildHero() {
  const sec = document.createElement('section');
  sec.className = 'sapiens-section sap-hero';

  const h = SAPIENS_HERO;
  sec.innerHTML = `
    <img class="sap-hero-bg" src="${h.bgImage}" alt="" loading="eager"
         onerror="this.style.display='none'"/>
    <div class="sap-hero-gradient"></div>
    <div class="sap-hero-glow"></div>
    <div class="sap-hero-content">
      <div class="sap-overline">${txt(h.overline)}</div>
      <h1 class="sap-hero-title"><em>Homo sapiens</em></h1>
      <p class="sap-hero-tagline">${txt(h.tagline)}</p>
      <div class="sap-hero-counters" id="sap-counters">
        ${h.counters.map((c, i) => {
          const parsed = parseCounterValue(c.value);
          return `
            ${i > 0 ? '<div class="sap-counter-divider"></div>' : ''}
            <div class="sap-counter-block">
              <div class="sap-counter-value" data-target="${parsed.numeric}" data-suffix="${parsed.suffix}">${parsed.suffix ? '0' + parsed.suffix : '0'}</div>
              <div class="sap-counter-label">${txt(c.label)}</div>
            </div>
          `;
        }).join('')}
      </div>
      <button class="sap-hero-pill" id="sap-etymology-btn">
        <span>${txt(h.etymologyTitle)}</span>
        <span class="sap-pill-arrow">&#9660;</span>
      </button>
      <div class="sap-hero-scroll">
        <span>${txt({ en: 'Explore', he: 'גלה', ru: 'Узнать' })}</span>
        <div class="sap-scroll-line"></div>
      </div>
    </div>
  `;

  // Wire etymology pill → opens drawer
  requestAnimationFrame(() => {
    const btn = sec.querySelector('#sap-etymology-btn');
    if (btn) btn.addEventListener('click', () => {
      openDrawer(el => {
        el.innerHTML = `
          <div style="padding:32px 28px;">
            <div style="font-size:28px;margin-bottom:12px;">📖</div>
            <h3 style="font-size:20px;font-weight:300;color:var(--text-primary);margin-bottom:6px;">
              ${txt(h.etymologyTitle)}
            </h3>
            <div style="font-size:14px;color:var(--text-dim);line-height:1.7;margin-top:16px;">
              ${txt(h.etymologyContent)}
            </div>
          </div>
        `;
      });
    });

    // Animate counters (essential tier — always plays)
    animateCounters(sec);
  });

  return sec;
}

function animateCounters(sec) {
  const counters = sec.querySelectorAll('.sap-counter-value');
  if (reducedMotion()) {
    counters.forEach(el => {
      const target = Number(el.dataset.target);
      el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
    });
    return;
  }
  counters.forEach(el => {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * ease);
      el.textContent = current.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
