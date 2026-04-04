// ══════════════════════════════════════════════════════
// SAPIENS — Homo sapiens full-screen showcase
// ══════════════════════════════════════════════════════

import { state, nodeMap, navStack } from './state.js';
import { reducedMotion } from './utils.js';
import { SAPIENS_HERO, MIGRATION_ROUTES, MIGRATION_ORIGIN, MIGRATION_MAP_IMAGE } from './sapiensData.js';

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
  scroll.appendChild(buildMigrationMap());
  // Sections 3-5 will be added in Tasks 5-7

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

// ══════════════════════════════════════════════════════
// SECTION 2: MIGRATION MAP
// ══════════════════════════════════════════════════════

function buildMigrationMap() {
  const sec = document.createElement('section');
  sec.className = 'sapiens-section sap-migration';

  // ── Header ──
  const header = document.createElement('div');
  header.className = 'sap-section-header';
  header.innerHTML = `
    <div class="sap-overline">${txt({ en: 'Our Journey', he: 'המסע שלנו', ru: 'Наш путь' })}</div>
    <h2 class="sap-section-title">${txt({ en: 'Out of Africa', he: 'יציאה מאפריקה', ru: 'Из Африки' })}</h2>
    <p class="sap-section-subtitle">${txt({
      en: 'Trace how Homo sapiens spread from East Africa to every corner of the globe over 300,000 years.',
      he: 'עקוב אחר הדרך שבה הומו ספיינס התפשט ממזרח אפריקה לכל פינת הגלובוס במהלך 300,000 שנה.',
      ru: 'Проследите, как Homo sapiens распространился из Восточной Африки во все уголки мира за 300 000 лет.',
    })}</p>
  `;
  sec.appendChild(header);

  // ── Map frame ──
  const frame = document.createElement('div');
  frame.className = 'sap-map-frame';

  const img = document.createElement('img');
  img.className = 'sap-map-img';
  img.src = MIGRATION_MAP_IMAGE;
  img.alt = '';
  img.loading = 'lazy';
  frame.appendChild(img);

  // ── SVG overlay ──
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'sap-map-svg');
  svg.setAttribute('viewBox', '0 0 100 50');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('aria-hidden', 'true');

  // Route groups
  MIGRATION_ROUTES.forEach(r => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'sap-route');
    g.setAttribute('data-date', r.date);

    const bgPath = document.createElementNS(svgNS, 'path');
    bgPath.setAttribute('class', 'sap-route-bg');
    bgPath.setAttribute('d', r.path);
    g.appendChild(bgPath);

    const activePath = document.createElementNS(svgNS, 'path');
    activePath.setAttribute('class', 'sap-route-active');
    activePath.setAttribute('d', r.path);
    g.appendChild(activePath);

    const flowPath = document.createElementNS(svgNS, 'path');
    flowPath.setAttribute('class', 'sap-route-flow');
    flowPath.setAttribute('d', r.path);
    g.appendChild(flowPath);

    svg.appendChild(g);
  });

  // Origin dot
  const originG = document.createElementNS(svgNS, 'g');
  originG.setAttribute('class', 'sap-origin');
  const ox = MIGRATION_ORIGIN.x, oy = MIGRATION_ORIGIN.y;

  const glowCircle = document.createElementNS(svgNS, 'circle');
  glowCircle.setAttribute('class', 'sap-origin-glow');
  glowCircle.setAttribute('cx', ox);
  glowCircle.setAttribute('cy', oy);
  glowCircle.setAttribute('r', '6');
  originG.appendChild(glowCircle);

  const pulseCircle = document.createElementNS(svgNS, 'circle');
  pulseCircle.setAttribute('class', 'sap-origin-pulse');
  pulseCircle.setAttribute('cx', ox);
  pulseCircle.setAttribute('cy', oy);
  pulseCircle.setAttribute('r', '4');
  originG.appendChild(pulseCircle);

  const coreCircle = document.createElementNS(svgNS, 'circle');
  coreCircle.setAttribute('class', 'sap-origin-core');
  coreCircle.setAttribute('cx', ox);
  coreCircle.setAttribute('cy', oy);
  coreCircle.setAttribute('r', '2');
  originG.appendChild(coreCircle);

  svg.appendChild(originG);

  // Destination dots
  MIGRATION_ROUTES.forEach(r => {
    // Extract endpoint from path
    const coords = r.path.match(/[\d.]+/g);
    const ex = parseFloat(coords[coords.length - 2]);
    const ey = parseFloat(coords[coords.length - 1]);

    const destG = document.createElementNS(svgNS, 'g');
    destG.setAttribute('class', 'sap-dest');
    destG.setAttribute('data-date', r.date);
    destG.setAttribute('data-id', r.id);
    destG.style.cursor = 'pointer';

    const destGlow = document.createElementNS(svgNS, 'circle');
    destGlow.setAttribute('class', 'sap-dest-glow');
    destGlow.setAttribute('cx', ex);
    destGlow.setAttribute('cy', ey);
    destGlow.setAttribute('r', '3.5');
    destG.appendChild(destGlow);

    const destCore = document.createElementNS(svgNS, 'circle');
    destCore.setAttribute('class', 'sap-dest-core');
    destCore.setAttribute('cx', ex);
    destCore.setAttribute('cy', ey);
    destCore.setAttribute('r', '1.5');
    destG.appendChild(destCore);

    const destLabel = document.createElementNS(svgNS, 'text');
    destLabel.setAttribute('class', 'sap-dest-label');
    destLabel.setAttribute('x', ex);
    destLabel.setAttribute('y', ey - 4);
    destLabel.setAttribute('text-anchor', 'middle');
    destLabel.textContent = txt(r.label);
    destG.appendChild(destLabel);

    svg.appendChild(destG);
  });

  frame.appendChild(svg);

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'sap-map-tooltip';
  tooltip.setAttribute('aria-hidden', 'true');
  frame.appendChild(tooltip);

  sec.appendChild(frame);

  // ── Controls ──
  const controls = document.createElement('div');
  controls.className = 'sap-map-controls';

  const playBtn = document.createElement('button');
  playBtn.className = 'sap-play-btn';
  playBtn.setAttribute('aria-label', txt({ en: 'Play migration animation', he: 'הפעל אנימציית הגירה', ru: 'Воспроизвести анимацию миграции' }));
  playBtn.innerHTML = `<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg>`;

  const boundStart = document.createElement('span');
  boundStart.className = 'sap-map-bound';
  boundStart.textContent = '300 Ka';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = 'sap-map-slider';
  slider.className = 'sap-map-slider';
  slider.min = '0';
  slider.max = '300';
  slider.value = '0';

  const boundEnd = document.createElement('span');
  boundEnd.className = 'sap-map-bound';
  boundEnd.textContent = txt({ en: 'Now', he: 'עכשיו', ru: 'Сейчас' });

  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'sap-map-time';
  timeDisplay.textContent = '300 Ka';

  controls.appendChild(playBtn);
  controls.appendChild(boundStart);
  controls.appendChild(slider);
  controls.appendChild(boundEnd);
  controls.appendChild(timeDisplay);
  sec.appendChild(controls);

  // ── Wire interactions after DOM insert ──
  requestAnimationFrame(() => {
    const routes = svg.querySelectorAll('.sap-route');
    const dests = svg.querySelectorAll('.sap-dest');

    function updateMap(sliderVal) {
      const currentKa = 300 - sliderVal;
      timeDisplay.textContent = currentKa > 0 ? `${currentKa} Ka` : txt({ en: 'Present', he: 'הווה', ru: 'Сейчас' });

      routes.forEach(routeEl => {
        const routeDate = parseInt(routeEl.dataset.date, 10);
        if (300 - sliderVal <= routeDate) {
          routeEl.classList.add('visible');
        } else {
          routeEl.classList.remove('visible');
        }
      });

      dests.forEach(destEl => {
        const destDate = parseInt(destEl.dataset.date, 10);
        if (300 - sliderVal <= destDate) {
          destEl.classList.add('visible');
        } else {
          destEl.classList.remove('visible');
        }
      });
    }

    // Slider input
    slider.addEventListener('input', () => {
      updateMap(parseInt(slider.value, 10));
    });

    // Play/pause state
    let playRaf = null;
    let playing = false;

    function stopPlay() {
      if (playRaf) cancelAnimationFrame(playRaf);
      playRaf = null;
      playing = false;
      playBtn.innerHTML = `<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg>`;
    }

    function startPlay() {
      playing = true;
      playBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="0" y="0" width="3.5" height="10"/><rect x="6.5" y="0" width="3.5" height="10"/></svg>`;
      const duration = 10000; // 10 seconds
      const startVal = parseInt(slider.value, 10);
      const remaining = 300 - startVal;
      const startTime = performance.now();

      function tick(now) {
        if (!playing) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / (duration * remaining / 300), 1);
        const newVal = Math.round(startVal + remaining * progress);
        slider.value = newVal;
        updateMap(newVal);
        if (progress < 1) {
          playRaf = requestAnimationFrame(tick);
        } else {
          stopPlay();
        }
      }
      playRaf = requestAnimationFrame(tick);
    }

    playBtn.addEventListener('click', () => {
      if (playing) {
        stopPlay();
      } else {
        if (parseInt(slider.value, 10) >= 300) {
          slider.value = '0';
          updateMap(0);
        }
        startPlay();
      }
    });

    // Tooltip on dest hover
    dests.forEach(destEl => {
      const id = destEl.dataset.id;
      const route = MIGRATION_ROUTES.find(r => r.id === id);
      if (!route) return;

      destEl.addEventListener('mouseenter', evt => {
        tooltip.innerHTML = `
          <div class="sap-tt-date">${route.date} Ka</div>
          <div class="sap-tt-place">${txt(route.label)}</div>
          <div class="sap-tt-site">${txt(route.site)}</div>
        `;
        // Position tooltip relative to frame
        const frameRect = frame.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        // Get dest core circle position
        const core = destEl.querySelector('.sap-dest-core');
        const coreRect = core ? core.getBoundingClientRect() : { left: evt.clientX, top: evt.clientY, width: 0, height: 0 };
        let left = coreRect.left - frameRect.left + coreRect.width / 2 + 8;
        let top = coreRect.top - frameRect.top - 48;
        // Clamp so it stays inside frame
        left = Math.max(8, Math.min(left, frameRect.width - 210));
        top = Math.max(8, top);
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.classList.add('visible');
      });

      destEl.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });

    // Auto-play on scroll into view
    onVisible(sec, () => {
      if (!playing && parseInt(slider.value, 10) === 0) {
        startPlay();
      }
    }, { essential: true, threshold: 0.3 });
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
