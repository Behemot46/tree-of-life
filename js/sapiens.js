// ══════════════════════════════════════════════════════
// SAPIENS — Homo sapiens full-screen showcase
// ══════════════════════════════════════════════════════

import { state, nodeMap, navStack } from './state.js';
import { reducedMotion } from './utils.js';
import {
  SAPIENS_HERO, MIGRATION_ROUTES, MIGRATION_ORIGIN, MIGRATION_MAP_IMAGE,
  TRAIT_CARDS, SKULL_IMAGES, NEURAL_DENSITY, BRAIN_ENERGY, BRAIN_TIMELINE,
  COMPARISON_SPECIES, MAX_BRAIN_CC, MAX_LIVED_KA,
  TIMELINE_EVENTS, TIMELINE_ERAS,
} from './sapiensData.js';

// ── Late-binding deps ──
let _pushNav, _showMainPanel, _scheduleRender, _smoothPanTo;
export function initSapiensDeps(deps) {
  _pushNav = deps.pushNav;
  _showMainPanel = deps.showMainPanel;
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
  _pushNav('?node=h_sapiens');

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
  scroll.appendChild(buildTraitCards());
  scroll.appendChild(buildComparisonTable());
  scroll.appendChild(buildTimeline());

  // Lock body scroll and show
  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));

  // Fade scroll indicator on first scroll
  const scrollEl = overlay.querySelector('.sapiens-scroll');
  if (scrollEl) {
    scrollEl.addEventListener('scroll', function onFirst() {
      const indicator = overlay.querySelector('.sap-hero-scroll');
      if (indicator) indicator.style.opacity = '0';
      scrollEl.removeEventListener('scroll', onFirst);
    }, { passive: true });
  }

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
      <button class="sap-view-tree" id="sap-view-tree-btn">
        ${txt({ en: '🌳 View on Tree', he: '🌳 הצג בעץ', ru: '🌳 Показать на дереве' })}
      </button>
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

    // Wire "View on Tree" button
    const viewTreeBtn = sec.querySelector('#sap-view-tree-btn');
    if (viewTreeBtn) viewTreeBtn.addEventListener('click', () => {
      closeSapiens();
      const n = nodeMap['h_sapiens'];
      if (n && n._x !== undefined && _smoothPanTo) {
        setTimeout(() => _smoothPanTo(n._x, n._y), 350);
      }
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

  // Static continent labels — positioned to not overlap routes/dots
  const continentLabels = [
    { text: 'AFRICA', x: 51, y: 37 },
    { text: 'EUROPE', x: 48, y: 13 },
    { text: 'ASIA', x: 72, y: 12 },
    { text: 'AUSTRALIA', x: 83, y: 44 },
    { text: 'N. AMERICA', x: 18, y: 16 },
    { text: 'S. AMERICA', x: 22, y: 37 },
    { text: 'PACIFIC', x: 90, y: 30 },
  ];
  continentLabels.forEach(cl => {
    const t = document.createElementNS(svgNS, 'text');
    t.setAttribute('class', 'sap-continent-label');
    t.setAttribute('x', cl.x);
    t.setAttribute('y', cl.y);
    t.setAttribute('text-anchor', 'middle');
    t.textContent = cl.text;
    svg.appendChild(t);
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

  // Origin label
  const originLabel = document.createElementNS(svgNS, 'text');
  originLabel.setAttribute('class', 'sap-origin-label');
  originLabel.setAttribute('x', ox + 3);
  originLabel.setAttribute('y', oy + 1);
  originLabel.textContent = '★ 300,000 yrs ago';
  svg.appendChild(originG);
  svg.appendChild(originLabel);

  // Destination dots — show date at each arrival point
  // Offset labels to avoid overlapping with dots and continent labels
  const labelOffsets = {
    'middle-east': { dx: 2.5, dy: -1.5 },
    'south-asia': { dx: 2, dy: -1.5 },
    'australia': { dx: 0, dy: 3.5 },
    'europe': { dx: -3, dy: -1 },
    'central-asia': { dx: 2, dy: -1.5 },
    'east-asia': { dx: 2, dy: -1.5 },
    'americas': { dx: 2, dy: -1.5 },
    'polynesia': { dx: 0, dy: -2 },
  };

  MIGRATION_ROUTES.forEach(r => {
    const coords = r.path.match(/[\d.]+/g);
    const ex = parseFloat(coords[coords.length - 2]);
    const ey = parseFloat(coords[coords.length - 1]);
    const off = labelOffsets[r.id] || { dx: 0, dy: -2 };

    const destG = document.createElementNS(svgNS, 'g');
    destG.setAttribute('class', 'sap-dest');
    destG.setAttribute('data-date', r.date);
    destG.setAttribute('data-id', r.id);
    destG.style.cursor = 'pointer';

    const destGlow = document.createElementNS(svgNS, 'circle');
    destGlow.setAttribute('class', 'sap-dest-glow');
    destGlow.setAttribute('cx', ex);
    destGlow.setAttribute('cy', ey);
    destGlow.setAttribute('r', '2');
    destG.appendChild(destGlow);

    const destCore = document.createElementNS(svgNS, 'circle');
    destCore.setAttribute('class', 'sap-dest-core');
    destCore.setAttribute('cx', ex);
    destCore.setAttribute('cy', ey);
    destCore.setAttribute('r', '0.8');
    destG.appendChild(destCore);

    const destLabel = document.createElementNS(svgNS, 'text');
    destLabel.setAttribute('class', 'sap-dest-label');
    destLabel.setAttribute('x', ex + off.dx);
    destLabel.setAttribute('y', ey + off.dy);
    destLabel.textContent = (r.date * 1000).toLocaleString();
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
  boundStart.textContent = '300,000 yrs';

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
  timeDisplay.textContent = '300,000';

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
      timeDisplay.textContent = currentKa > 0 ? (currentKa * 1000).toLocaleString() : txt({ en: 'Present', he: 'הווה', ru: 'Сейчас' });

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
      const duration = 25000; // 25 seconds — slow contemplative pace
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
          <div class="sap-tt-date">${(route.date * 1000).toLocaleString()} years ago</div>
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

// ══════════════════════════════════════════════════════
// SECTION 3: TRAIT CARDS
// ══════════════════════════════════════════════════════

function buildTraitCards() {
  const sec = document.createElement('section');
  sec.className = 'sapiens-section sap-traits';

  // ── Header ──
  const header = document.createElement('div');
  header.className = 'sap-section-header';
  header.innerHTML = `
    <div class="sap-overline">${txt({ en: '🔬 What Defines Us', he: '🔬 מה מגדיר אותנו', ru: '🔬 Что нас определяет' })}</div>
    <h2 class="sap-section-title">${txt({ en: 'What Makes Us <em>Us</em>', he: 'מה גורם לנו להיות <em>אנחנו</em>', ru: 'Что делает нас <em>нами</em>' })}</h2>
    <p class="sap-section-subtitle">${txt({ en: '👇 Tap a card to go deeper', he: '👇 הקש על כרטיסייה כדי לעמוק יותר', ru: '👇 Нажмите карточку для подробностей' })}</p>
  `;
  sec.appendChild(header);

  // ── Card grid ──
  const grid = document.createElement('div');
  grid.className = 'sap-card-grid';

  TRAIT_CARDS.forEach(card => {
    const el = document.createElement('div');
    el.className = 'sap-card';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', txt(card.label));

    el.innerHTML = `
      <div class="sap-card-hero">
        <img src="${card.heroImage}" alt="" loading="lazy"
             onerror="this.style.display='none'"/>
      </div>
      <div class="sap-card-badge">${card.icon}</div>
      <div class="sap-card-body">
        <div class="sap-card-label">${txt(card.label)}</div>
        <div class="sap-card-stat-row">
          <span class="sap-card-stat">${card.stat}</span>
          <span class="sap-card-unit">${txt(card.unit)}</span>
        </div>
        <p class="sap-card-desc">${txt(card.desc)}</p>
        <div class="sap-card-fun">${txt(card.funFact)}</div>
        <span class="sap-card-cta">${txt(card.cta)} →</span>
      </div>
    `;

    // Click / keyboard → open drawer
    const openFn = () => {
      if (card.id === 'brain')      openDrawer(buildBrainDrawer);
      else if (card.id === 'language')  openDrawer(buildLanguageDrawer);
      else if (card.id === 'technology') openDrawer(buildTechDrawer);
      else if (card.id === 'dna')   openDrawer(buildDnaDrawer);
    };
    el.addEventListener('click', openFn);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFn(); } });

    grid.appendChild(el);
  });

  sec.appendChild(grid);
  return sec;
}

// ══════════════════════════════════════════════════════
// DRAWER BUILDERS
// ══════════════════════════════════════════════════════

// ── Brain drawer ──
function buildBrainDrawer(el) {
  // Header
  el.innerHTML = `
    <div class="sap-drawer-hero" style="background:linear-gradient(135deg,#1a0e0a 0%,#0e1015 100%);">
      <div class="sap-drawer-hero-content">
        <div class="sap-drawer-emoji">🧠</div>
        <div class="sap-drawer-title">${txt({ en: 'The Remarkable Brain', he: 'המוח המדהים', ru: 'Удивительный мозг' })}</div>
        <div class="sap-drawer-subtitle">${txt({ en: '86 billion neurons. 3× larger than expected.', he: '86 מיליארד נוירונים. פי 3 גדול מהמצופה.', ru: '86 миллиардов нейронов. В 3× крупнее ожидаемого.' })}</div>
      </div>
    </div>
    <div class="sap-drawer-body" id="sap-brain-body"></div>
  `;

  const body = el.querySelector('#sap-brain-body');

  // ── 1. Skull lineup ──
  const skullLabel = document.createElement('div');
  skullLabel.className = 'sap-section-label';
  skullLabel.textContent = txt({ en: 'BRAIN VOLUME COMPARISON', he: 'השוואת נפח מוח', ru: 'СРАВНЕНИЕ ОБЪЁМА МОЗГА' });
  body.appendChild(skullLabel);

  const lineup = document.createElement('div');
  lineup.className = 'sap-skull-lineup';

  Object.values(SKULL_IMAGES).forEach(skull => {
    const item = document.createElement('div');
    item.className = 'sap-skull-item' + (skull.highlight ? ' highlight' : '') + (skull.surprise ? ' surprise' : '');

    const imgSrc = skull.url.replace('{W}', '200');
    const imgEl = document.createElement('img');
    imgEl.src = imgSrc;
    imgEl.alt = txt(skull.name);
    imgEl.style.height = skull.height + 'px';
    imgEl.onerror = function() {
      this.style.display = 'none';
      const fb = document.createElement('div');
      fb.className = 'sap-skull-fallback';
      fb.textContent = skull.emoji;
      item.insertBefore(fb, item.firstChild);
    };
    item.appendChild(imgEl);

    const info = document.createElement('div');
    info.className = 'sap-skull-info';
    info.innerHTML = `
      <div class="sap-skull-name">${txt(skull.name)}</div>
      <div class="sap-skull-volume">${skull.volume} cc</div>
    `;
    item.appendChild(info);
    lineup.appendChild(item);
  });

  body.appendChild(lineup);

  const proportionNote = document.createElement('p');
  proportionNote.style.cssText = 'font-size:10px;color:var(--text-faint);text-align:center;margin-bottom:20px;';
  proportionNote.textContent = '↑ ' + txt({ en: 'photos sized proportionally to brain volume', he: 'תמונות בגודל פרופורציונלי לנפח המוח', ru: 'фотографии пропорциональны объёму мозга' });
  body.appendChild(proportionNote);

  // ── 2. Insight callout ──
  const insight = document.createElement('div');
  insight.className = 'sap-insight';
  insight.innerHTML = `
    <span class="sap-insight-emoji">🤯</span>
    <div class="sap-insight-text">
      <strong>${txt({ en: 'Wait — Neanderthals had bigger brains?', he: 'רגע — לניאנדרתלים היו מוחות גדולים יותר?', ru: 'Подождите — у неандертальцев был мозг больше?' })}</strong><br>
      ${txt({ en: 'Yes — Neanderthals averaged ~1,500 cc vs. our ~1,400 cc. But brain size alone doesn\'t determine intelligence. The organization matters: sapiens have proportionally larger prefrontal cortices, more cortical neurons, and denser long-range connectivity.', he: 'כן — ניאנדרתלים ממוצעו כ-1,500 סמ"ק לעומת כ-1,400 סמ"ק שלנו. אך גודל המוח לבדו אינו קובע אינטליגנציה. הארגון חשוב: לספיינס יש קליפות מוח קדם-מצחיות גדולות יחסית, יותר נוירונים קורטיקליים וחיבוריות ארוכת טווח צפופה יותר.', ru: 'Да — у неандертальцев в среднем ~1 500 см³ против нашего ~1 400 см³. Но размер мозга сам по себе не определяет интеллект. Важна организация: у сапиенсов пропорционально большая префронтальная кора, больше корковых нейронов и более плотная дальняя связность.' })}
    </div>
  `;
  body.appendChild(insight);

  const divider1 = document.createElement('div');
  divider1.className = 'sap-divider';
  body.appendChild(divider1);

  // ── 3. Neural density ──
  const densityLabel = document.createElement('div');
  densityLabel.className = 'sap-section-label';
  densityLabel.textContent = txt({ en: 'NEURAL DENSITY & STRUCTURE', he: 'צפיפות ומבנה עצבי', ru: 'НЕЙРОННАЯ ПЛОТНОСТЬ И СТРУКТУРА' });
  body.appendChild(densityLabel);

  const densityGrid = document.createElement('div');
  densityGrid.className = 'sap-density-grid';

  NEURAL_DENSITY.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'sap-density-card' + (idx === 0 ? ' ours' : '');
    card.innerHTML = `
      <div class="sap-density-species">${txt(item.title)}</div>
      <div class="sap-density-val">${item.value}</div>
      <div class="sap-density-unit">${txt(item.unit)}</div>
    `;
    densityGrid.appendChild(card);
  });
  body.appendChild(densityGrid);

  const divider2 = document.createElement('div');
  divider2.className = 'sap-divider';
  body.appendChild(divider2);

  // ── 4. Energy budget ──
  const energyLabel = document.createElement('div');
  energyLabel.className = 'sap-section-label';
  energyLabel.textContent = txt({ en: 'THE ENERGY BUDGET', he: 'תקציב האנרגיה', ru: 'ЭНЕРГЕТИЧЕСКИЙ БЮДЖЕТ' });
  body.appendChild(energyLabel);

  // SVG donut — radius 40, circumference ≈ 251.3
  const circ = 2 * Math.PI * 40;
  const brainPct = 0.2;
  const brainDash = circ * brainPct;
  const restDash = circ * (1 - brainPct);

  const energyWrap = document.createElement('div');
  energyWrap.className = 'sap-energy-wrap';
  energyWrap.innerHTML = `
    <div class="sap-ring-chart">
      <svg viewBox="0 0 120 120">
        <circle class="sap-ring-bg" cx="60" cy="60" r="40"/>
        <circle class="sap-ring-rest" cx="60" cy="60" r="40"
          stroke-dasharray="${restDash.toFixed(1)} ${brainDash.toFixed(1)}"
          stroke-dashoffset="${(-brainDash).toFixed(1)}"/>
        <circle class="sap-ring-brain" cx="60" cy="60" r="40"
          stroke-dasharray="${brainDash.toFixed(1)} ${(circ - brainDash).toFixed(1)}"/>
      </svg>
      <div class="sap-ring-center">
        <span class="sap-ring-pct">20%</span>
        <span class="sap-ring-label">${txt({ en: 'of energy', he: 'מהאנרגיה', ru: 'энергии' })}</span>
      </div>
    </div>
    <div class="sap-energy-facts">
      ${BRAIN_ENERGY.map(f => `
        <div class="sap-energy-fact">
          <span>${f.emoji}</span>
          <span>${txt(f.text)}</span>
        </div>
      `).join('')}
    </div>
  `;
  body.appendChild(energyWrap);

  const divider3 = document.createElement('div');
  divider3.className = 'sap-divider';
  body.appendChild(divider3);

  // ── 5. Growth timeline ──
  const timelineLabel = document.createElement('div');
  timelineLabel.className = 'sap-section-label';
  timelineLabel.textContent = txt({ en: 'BRAIN GROWTH TIMELINE', he: 'ציר הזמן של צמיחת המוח', ru: 'ХРОНОЛОГИЯ РОСТА МОЗГА' });
  body.appendChild(timelineLabel);

  const timeline = document.createElement('div');
  timeline.className = 'sap-growth-timeline';

  BRAIN_TIMELINE.forEach(item => {
    const entry = document.createElement('div');
    entry.className = 'sap-growth-item';
    entry.innerHTML = `
      <div class="sap-growth-date">${item.date} ${item.unit}</div>
      <div class="sap-growth-text"><strong>${txt(item.title)}</strong> — ${txt(item.desc)}</div>
    `;
    timeline.appendChild(entry);
  });
  body.appendChild(timeline);
}

// ── Language drawer ──
function buildLanguageDrawer(el) {
  el.innerHTML = `
    <div class="sap-drawer-hero" style="background:linear-gradient(135deg,#0a120f 0%,#0e1015 100%);">
      <div class="sap-drawer-hero-content">
        <div class="sap-drawer-emoji">💬</div>
        <div class="sap-drawer-title">${txt({ en: 'Language & Symbolic Thought', he: 'שפה וחשיבה סמלית', ru: 'Язык и символическое мышление' })}</div>
        <div class="sap-drawer-subtitle">${txt({ en: '7,000+ languages. One unique ability.', he: '7,000+ שפות. יכולת ייחודית אחת.', ru: '7 000+ языков. Одна уникальная способность.' })}</div>
      </div>
    </div>
    <div class="sap-drawer-body">
      <div class="sap-section-label">${txt({ en: 'COMMUNICATION EVOLUTION', he: 'אבולוציית התקשורת', ru: 'ЭВОЛЮЦИЯ КОММУНИКАЦИИ' })}</div>
      <div class="sap-simple-timeline">
        <div class="sap-simple-item">
          <div class="sap-growth-date">2 Ma</div>
          <div class="sap-growth-text"><strong>${txt({ en: 'Gestures 🤲', he: 'מחוות 🤲', ru: 'Жесты 🤲' })}</strong> — ${txt({ en: 'Early Homo uses hands and body to communicate intent and coordinate hunts.', he: 'הומו הקדום משתמש בידיים ובגוף כדי לתקשר כוונות ולתאם ציד.', ru: 'Ранние Homo используют руки и тело для общения и координации охоты.' })}</div>
        </div>
        <div class="sap-simple-item">
          <div class="sap-growth-date">500,000 yrs</div>
          <div class="sap-growth-text"><strong>${txt({ en: 'Vocal sounds 🗣️', he: 'צלילים קוליים 🗣️', ru: 'Голосовые звуки 🗣️' })}</strong> — ${txt({ en: 'Descended larynx in H. heidelbergensis enables broader phoneme range. FOXP2 gene appears.', he: 'גרון יורד ב-H. heidelbergensis מאפשר טווח פונמות רחב יותר. גן FOXP2 מופיע.', ru: 'Опустившаяся гортань у H. heidelbergensis расширяет диапазон фонем. Появляется ген FOXP2.' })}</div>
        </div>
        <div class="sap-simple-item">
          <div class="sap-growth-date">100,000 yrs</div>
          <div class="sap-growth-text"><strong>${txt({ en: 'Symbolic language 💬', he: 'שפה סמלית 💬', ru: 'Символический язык 💬' })}</strong> — ${txt({ en: 'Ochre engravings at Blombos Cave hint at abstract symbolic capacity. Full syntax likely emerges.', he: 'חריטות אוכר במערת בלומבוס מרמזות על יכולת סמלית מופשטת. סינתקס מלא ככל הנראה צומח.', ru: 'Гравюры охрой в пещере Бломбос намекают на абстрактную символическую способность. Вероятно, возникает полный синтаксис.' })}</div>
        </div>
        <div class="sap-simple-item">
          <div class="sap-growth-date">5,000 yrs</div>
          <div class="sap-growth-text"><strong>${txt({ en: 'Writing ✏️', he: 'כתיבה ✏️', ru: 'Письменность ✏️' })}</strong> — ${txt({ en: 'Sumerian cuneiform and Egyptian hieroglyphs allow knowledge to persist across generations.', he: 'הכתב הסומרי והכתב ההיראוגליפי המצרי מאפשרים לידע להתמיד לאורך דורות.', ru: 'Шумерская клинопись и египетские иероглифы позволяют знаниям сохраняться через поколения.' })}</div>
        </div>
        <div class="sap-simple-item">
          <div class="sap-growth-date">~30 yrs</div>
          <div class="sap-growth-text"><strong>${txt({ en: 'Internet 🌐', he: 'אינטרנט 🌐', ru: 'Интернет 🌐' })}</strong> — ${txt({ en: 'Instant global communication. 5 billion connected people share ideas in milliseconds.', he: 'תקשורת גלובלית מיידית. 5 מיליארד אנשים מחוברים חולקים רעיונות במילי-שניות.', ru: 'Мгновенная глобальная коммуникация. 5 миллиардов подключённых людей делятся идеями за миллисекунды.' })}</div>
        </div>
      </div>
    </div>
  `;
}

// ── Technology drawer ──
function buildTechDrawer(el) {
  el.innerHTML = `
    <div class="sap-drawer-hero" style="background:linear-gradient(135deg,#0e0e0a 0%,#0e1015 100%);">
      <div class="sap-drawer-hero-content">
        <div class="sap-drawer-emoji">🔧</div>
        <div class="sap-drawer-title">${txt({ en: 'Technology & Cumulative Culture', he: 'טכנולוגיה ותרבות מצטברת', ru: 'Технология и накопленная культура' })}</div>
        <div class="sap-drawer-subtitle">${txt({ en: '3.3 million years of making things.', he: '3.3 מיליון שנות יצירה.', ru: '3,3 миллиона лет создания вещей.' })}</div>
      </div>
    </div>
    <div class="sap-drawer-body">
      <div class="sap-section-label">${txt({ en: 'THE EXPONENTIAL CURVE', he: 'העקומה האקספוננציאלית', ru: 'ЭКСПОНЕНЦИАЛЬНАЯ КРИВАЯ' })}</div>
      <div class="sap-bar-compare">
        <div class="sap-bar-row">
          <span class="sap-bar-label">${txt({ en: 'Stone tools', he: 'כלי אבן', ru: 'Каменные орудия' })}</span>
          <div class="sap-bar-track">
            <div class="sap-bar-fill accent" style="width:99%;">
              ${txt({ en: '3.3M years', he: '3.3 מיליון שנה', ru: '3,3 млн лет' })}
            </div>
          </div>
        </div>
        <div class="sap-bar-row">
          <span class="sap-bar-label">${txt({ en: 'Everything else', he: 'כל השאר', ru: 'Всё остальное' })}</span>
          <div class="sap-bar-track">
            <div class="sap-bar-fill dim" style="width:1%;">&nbsp;</div>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-faint);margin-top:8px;">${txt({ en: '99% of tool-use history = stone. The last ~10,000 years = everything else.', he: '99% מההיסטוריה של שימוש בכלים = אבן. 10,000 השנים האחרונות = כל השאר.', ru: '99% истории использования орудий = камень. Последние ~10 000 лет = всё остальное.' })}</p>
      </div>
      <div class="sap-section-label">${txt({ en: 'KEY MILESTONES', he: 'אבני דרך מרכזיות', ru: 'КЛЮЧЕВЫЕ ВЕХИ' })}</div>
      <div class="sap-simple-timeline">
        <div class="sap-simple-item">
          <div class="sap-growth-date">3.3 Ma</div>
          <div class="sap-growth-text">⛏️ <strong>${txt({ en: 'Lomekwi stone tools', he: 'כלי אבן לומקווי', ru: 'Каменные орудия Ломекви' })}</strong> — ${txt({ en: 'Oldest known deliberately flaked stone tools, predating genus Homo.', he: 'כלי הצור המעוצבים המוכרים הקדומים ביותר, המקדימים את סוג הומו.', ru: 'Древнейшие известные намеренно сколотые каменные орудия, предшествующие роду Homo.' })}</div>
        </div>
        <div class="sap-simple-item">
          <div class="sap-growth-date">1.8 Ma</div>
          <div class="sap-growth-text">🔥 <strong>${txt({ en: 'Controlled fire', he: 'אש מבוקרת', ru: 'Контролируемый огонь' })}</strong> — ${txt({ en: 'Cooking unlocks calorie surplus, drives brain expansion, enables global migration.', he: 'בישול משחרר עודף קלוריות, מניע התרחבות מוח ומאפשר הגירה גלובלית.', ru: 'Приготовление пищи высвобождает избыток калорий, стимулирует рост мозга, позволяет глобальную миграцию.' })}</div>
        </div>
        <div class="sap-simple-item">
          <div class="sap-growth-date">10,000 yrs</div>
          <div class="sap-growth-text">🌾 <strong>${txt({ en: 'Agriculture', he: 'חקלאות', ru: 'Сельское хозяйство' })}</strong> — ${txt({ en: 'Domestication of wheat and animals. Population density surges. Cities emerge.', he: 'אילוף חיטה ובעלי חיים. צפיפות האוכלוסייה מזנקת. ערים צומחות.', ru: 'Одомашнивание пшеницы и животных. Плотность населения резко возрастает. Появляются города.' })}</div>
        </div>
        <div class="sap-simple-item">
          <div class="sap-growth-date">270 yrs</div>
          <div class="sap-growth-text">⚙️ <strong>${txt({ en: 'Industrial Revolution', he: 'המהפכה התעשייתית', ru: 'Промышленная революция' })}</strong> — ${txt({ en: 'Steam power, mechanization, exponential energy use begins.', he: 'כוח קיטור, מיכון, השימוש האקספוננציאלי באנרגיה מתחיל.', ru: 'Паровая энергия, механизация, начало экспоненциального использования энергии.' })}</div>
        </div>
        <div class="sap-simple-item">
          <div class="sap-growth-date">~30 yrs</div>
          <div class="sap-growth-text">🖥️ <strong>${txt({ en: 'Digital age', he: 'עידן הדיגיטל', ru: 'Цифровой век' })}</strong> — ${txt({ en: 'Smartphones, AI, quantum computing. The ratchet effect runs at internet speed.', he: 'סמארטפונים, בינה מלאכותית, מחשוב קוונטי. אפקט המחגר רץ במהירות האינטרנט.', ru: 'Смартфоны, ИИ, квантовые вычисления. Эффект храповика работает на скорости интернета.' })}</div>
        </div>
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════════════════
// SECTION 4: COMPARISON TABLE
// ══════════════════════════════════════════════════════

function buildComparisonTable() {
  const sec = document.createElement('section');
  sec.className = 'sapiens-section sap-comparison';

  // ── Header ──
  const header = document.createElement('div');
  header.className = 'sap-section-header';
  header.innerHTML = `
    <div class="sap-overline">${txt({ en: '⚔️ The Relatives', he: '⚔️ הקרובים', ru: '⚔️ Родственники' })}</div>
    <h2 class="sap-section-title">${txt({ en: 'Us vs. Our Closest Kin', he: 'אנחנו מול קרובינו', ru: 'Мы и наши ближайшие родственники' })}</h2>
    <p class="sap-section-subtitle">${txt({ en: 'Click any species to visit their page in the tree.', he: 'לחץ על מין כלשהו כדי לבקר בעמוד שלו בעץ.', ru: 'Нажмите на вид, чтобы перейти на его страницу в дереве.' })}</p>
  `;
  sec.appendChild(header);

  // ── Row definitions ──
  const ROW_LABELS = [
    { key: 'brain',    label: { en: 'Brain',    he: 'מוח',     ru: 'Мозг'    } },
    { key: 'height',   label: { en: 'Height',   he: 'גובה',    ru: 'Рост'    } },
    { key: 'lifespan', label: { en: 'Lifespan', he: 'תקופה',   ru: 'Период'  } },
    { key: 'tools',    label: { en: 'Tools',    he: 'כלים',    ru: 'Орудия'  } },
    { key: 'language', label: { en: 'Language', he: 'שפה',     ru: 'Язык'    } },
    { key: 'art',      label: { en: 'Art',      he: 'אמנות',   ru: 'Искусство' } },
    { key: 'dna',      label: { en: 'DNA vs Us',he: 'DNA לעומתנו', ru: 'ДНК vs нас' } },
    { key: 'status',   label: { en: 'Status',   he: 'מצב',     ru: 'Статус'  } },
  ];
  const TOOL_EMOJIS = ['🪵', '🪨', '🔧', '⚙️', '🚀'];

  // ── Helper: cell builders ──
  function buildBrainCell(sp, isSapiens) {
    const pct = Math.round(sp.brain / MAX_BRAIN_CC * 100);
    let barClass = 'default';
    if (isSapiens) barClass = 'accent';
    else if (sp.id === 'neanderthal') barClass = 'blue';
    const td = document.createElement('td');
    if (isSapiens) td.className = 'ours';
    td.innerHTML = `
      <div class="sap-brain-cell">
        <div class="sap-brain-bar-wrap">
          <div class="sap-brain-bar ${barClass}" style="width:${pct}%"></div>
        </div>
        <div class="sap-brain-val">${sp.brain.toLocaleString()} cc</div>
      </div>`;
    return td;
  }

  function buildHeightCell(sp, isSapiens) {
    const hVal = typeof sp.height === 'string'
      ? parseFloat(sp.height)
      : sp.height / 100; // convert cm to m if needed
    const heightM = sp.height > 10 ? sp.height / 100 : sp.height; // cm → m
    const barH = Math.round(heightM / 1.8 * 38);
    const td = document.createElement('td');
    if (isSapiens) td.className = 'ours';
    td.innerHTML = `
      <div class="sap-height-cell">
        <div class="sap-height-figure">
          <div style="display:flex;flex-direction:column;align-items:center;gap:0;">
            <div class="sap-figure-head"></div>
            <div class="sap-figure-bar" style="height:${barH}px"></div>
          </div>
        </div>
        <div class="sap-height-val">${heightM.toFixed(2)} m</div>
      </div>`;
    return td;
  }

  function buildLifespanCell(sp, isSapiens) {
    const { from, to } = sp.lived;
    const isAlive = to === 0;
    const leftPct = ((MAX_LIVED_KA - from) / MAX_LIVED_KA * 100).toFixed(1);
    const rightPct = isAlive ? 0 : ((to / MAX_LIVED_KA) * 100).toFixed(1);
    const widthPct = (100 - parseFloat(leftPct) - parseFloat(rightPct)).toFixed(1);
    const barClass = isSapiens ? 'accent' : 'default';
    const fmtKa = v => (v * 1000).toLocaleString();
    const dateLabel = isAlive
      ? `${fmtKa(from)} → now`
      : `${fmtKa(from)} – ${fmtKa(to)} yrs ago`;
    const nowDot = isAlive
      ? `<div class="sap-now-dot" style="background:var(${isSapiens ? '--accent' : '--text-dim'});box-shadow:0 0 6px var(${isSapiens ? '--accent' : '--text-dim'});"></div>`
      : '';
    const td = document.createElement('td');
    if (isSapiens) td.className = 'ours';
    td.innerHTML = `
      <div class="sap-span-cell">
        <div class="sap-span-bar-track">
          <div class="sap-span-bar ${barClass}" style="left:${leftPct}%;width:${widthPct}%;"></div>
          ${nowDot}
        </div>
        <div class="sap-span-dates">${dateLabel}</div>
      </div>`;
    return td;
  }

  function buildToolsCell(sp, isSapiens) {
    const icons = TOOL_EMOJIS.map((e, i) =>
      `<span class="${i < sp.tools ? '' : 'dim'}">${e}</span>`
    ).join('');
    const td = document.createElement('td');
    if (isSapiens) td.className = 'ours';
    td.innerHTML = `<div class="sap-tool-scale">${icons}</div>`;
    return td;
  }

  function buildTextCell(text, isSapiens) {
    const td = document.createElement('td');
    if (isSapiens) td.className = 'ours';
    td.textContent = text;
    return td;
  }

  function buildArtCell(sp, isSapiens) {
    const td = document.createElement('td');
    if (isSapiens) td.className = 'ours';
    if (sp.art === 'yes')      td.textContent = '🎨 ✅';
    else if (sp.art === 'debated') td.textContent = '🤔 debated';
    else                       td.textContent = '❌';
    return td;
  }

  function buildDnaCell(sp, isSapiens) {
    const td = document.createElement('td');
    if (isSapiens) td.className = 'ours';
    td.textContent = sp.dna !== null ? sp.dna + '%' : '—';
    return td;
  }

  function buildStatusCell(sp, isSapiens) {
    const td = document.createElement('td');
    if (isSapiens) td.className = 'ours';
    if (sp.status === 'alive') {
      td.innerHTML = `<span class="sap-status-badge alive">🟢 Alive</span>`;
    } else {
      td.innerHTML = `<span class="sap-status-badge extinct">💀 ~${sp.status}</span>`;
    }
    return td;
  }

  // ── Desktop Table ──
  const tableWrap = document.createElement('div');
  tableWrap.style.width = '100%';

  const table = document.createElement('table');
  table.className = 'sap-compare-table';

  // thead
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  // Empty category column
  const thEmpty = document.createElement('th');
  headerRow.appendChild(thEmpty);

  COMPARISON_SPECIES.forEach(sp => {
    const th = document.createElement('th');
    const isSapiens = !!sp.highlight;
    const spDiv = document.createElement('div');
    spDiv.className = 'sap-th-species' + (isSapiens ? ' ours' : '');
    spDiv.innerHTML = `
      <div class="sap-th-photo">${sp.emoji}</div>
      <div class="sap-th-name">${txt(sp.name)}</div>
      <div class="sap-th-latin">${sp.latin}</div>
    `;
    spDiv.style.cursor = 'pointer';
    spDiv.addEventListener('click', () => {
      closeSapiens();
      setTimeout(() => {
        const node = nodeMap[sp.nodeId];
        if (node && _showMainPanel) _showMainPanel(node);
      }, 400);
    });
    th.appendChild(spDiv);
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // tbody
  const tbody = document.createElement('tbody');

  ROW_LABELS.forEach(row => {
    const tr = document.createElement('tr');
    // Category label cell
    const tdLabel = document.createElement('td');
    tdLabel.textContent = txt(row.label);
    tr.appendChild(tdLabel);

    COMPARISON_SPECIES.forEach(sp => {
      const isSapiens = !!sp.highlight;
      let td;
      if (row.key === 'brain')    td = buildBrainCell(sp, isSapiens);
      else if (row.key === 'height')   td = buildHeightCell(sp, isSapiens);
      else if (row.key === 'lifespan') td = buildLifespanCell(sp, isSapiens);
      else if (row.key === 'tools')    td = buildToolsCell(sp, isSapiens);
      else if (row.key === 'language') td = buildTextCell(txt(sp.language), isSapiens);
      else if (row.key === 'art')      td = buildArtCell(sp, isSapiens);
      else if (row.key === 'dna')      td = buildDnaCell(sp, isSapiens);
      else if (row.key === 'status')   td = buildStatusCell(sp, isSapiens);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableWrap.appendChild(table);
  sec.appendChild(tableWrap);

  // ── Mobile Swipe Cards ──
  const mobileCards = document.createElement('div');
  mobileCards.className = 'sap-mobile-cards';

  const swipeContainer = document.createElement('div');
  swipeContainer.className = 'sap-swipe-container';

  COMPARISON_SPECIES.forEach(sp => {
    const isSapiens = !!sp.highlight;
    const card = document.createElement('div');
    card.className = 'sap-swipe-card' + (isSapiens ? ' ours' : '');

    const heightM = sp.height > 10 ? sp.height / 100 : sp.height;
    const artText = sp.art === 'yes' ? '🎨 Yes' : sp.art === 'debated' ? '🤔 Debated' : '❌ No';
    const dnaText = sp.dna !== null ? sp.dna + '%' : '—';
    const statusText = sp.status === 'alive' ? '🟢 Alive' : '💀 ~' + sp.status;
    const toolIcons = TOOL_EMOJIS.map((e, i) =>
      `<span style="opacity:${i < sp.tools ? 1 : 0.15}">${e}</span>`).join('');
    const fmtKa2 = v => (v * 1000).toLocaleString();
    const livedText = sp.lived.to === 0
      ? `${fmtKa2(sp.lived.from)} → now`
      : `${fmtKa2(sp.lived.from)} – ${fmtKa2(sp.lived.to)}`;

    card.innerHTML = `
      <div class="sap-swipe-header">
        <div class="sap-swipe-avatar">${sp.emoji}</div>
        <div>
          <div class="sap-swipe-name">${txt(sp.name)}</div>
          <div class="sap-swipe-latin">${sp.latin}</div>
        </div>
      </div>
      <div class="sap-swipe-row">
        <span class="sap-swipe-cat">${txt({ en: 'Brain', he: 'מוח', ru: 'Мозг' })}</span>
        <span class="sap-swipe-val">${sp.brain.toLocaleString()} cc</span>
      </div>
      <div class="sap-swipe-row">
        <span class="sap-swipe-cat">${txt({ en: 'Height', he: 'גובה', ru: 'Рост' })}</span>
        <span class="sap-swipe-val">${heightM.toFixed(2)} m</span>
      </div>
      <div class="sap-swipe-row">
        <span class="sap-swipe-cat">${txt({ en: 'Lifespan', he: 'תקופה', ru: 'Период' })}</span>
        <span class="sap-swipe-val" style="font-size:11px;">${livedText}</span>
      </div>
      <div class="sap-swipe-row">
        <span class="sap-swipe-cat">${txt({ en: 'Tools', he: 'כלים', ru: 'Орудия' })}</span>
        <span class="sap-swipe-val" style="font-family:var(--font-body)">${toolIcons}</span>
      </div>
      <div class="sap-swipe-row">
        <span class="sap-swipe-cat">${txt({ en: 'Language', he: 'שפה', ru: 'Язык' })}</span>
        <span class="sap-swipe-val" style="font-size:11px;text-align:right;max-width:140px;">${txt(sp.language)}</span>
      </div>
      <div class="sap-swipe-row">
        <span class="sap-swipe-cat">${txt({ en: 'Art', he: 'אמנות', ru: 'Искусство' })}</span>
        <span class="sap-swipe-val">${artText}</span>
      </div>
      <div class="sap-swipe-row">
        <span class="sap-swipe-cat">${txt({ en: 'DNA', he: 'DNA', ru: 'ДНК' })}</span>
        <span class="sap-swipe-val">${dnaText}</span>
      </div>
      <div class="sap-swipe-row">
        <span class="sap-swipe-cat">${txt({ en: 'Status', he: 'מצב', ru: 'Статус' })}</span>
        <span class="sap-swipe-val">${statusText}</span>
      </div>
    `;

    // Click header to navigate
    card.querySelector('.sap-swipe-header').style.cursor = 'pointer';
    card.querySelector('.sap-swipe-header').addEventListener('click', () => {
      closeSapiens();
      setTimeout(() => {
        const node = nodeMap[sp.nodeId];
        if (node && _showMainPanel) _showMainPanel(node);
      }, 400);
    });

    swipeContainer.appendChild(card);
  });

  mobileCards.appendChild(swipeContainer);

  // Dot indicators
  const dotsEl = document.createElement('div');
  dotsEl.className = 'sap-swipe-dots';
  COMPARISON_SPECIES.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'sap-swipe-dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(dot);
  });
  mobileCards.appendChild(dotsEl);

  // Update dots on scroll
  swipeContainer.addEventListener('scroll', () => {
    const cards = swipeContainer.querySelectorAll('.sap-swipe-card');
    const dots = dotsEl.querySelectorAll('.sap-swipe-dot');
    const scrollLeft = swipeContainer.scrollLeft;
    const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 296; // 280px + 16px gap
    const activeIdx = Math.round(scrollLeft / cardWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
  }, { passive: true });

  // Touch swipe gesture (snap to nearest card)
  let touchStartX = 0;
  swipeContainer.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  swipeContainer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const cards = swipeContainer.querySelectorAll('.sap-swipe-card');
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 16;
    const current = Math.round(swipeContainer.scrollLeft / cardWidth);
    let next = current;
    if (dx < -40) next = Math.min(current + 1, cards.length - 1);
    else if (dx > 40) next = Math.max(current - 1, 0);
    swipeContainer.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
  }, { passive: true });

  sec.appendChild(mobileCards);
  return sec;
}

// ══════════════════════════════════════════════════════
// SECTION 5: TIMELINE
// ══════════════════════════════════════════════════════

function buildTimeline() {
  const sec = document.createElement('section');
  sec.className = 'sapiens-section sap-timeline-section';

  // ── Section inner wrapper ──
  const inner = document.createElement('div');
  inner.className = 'sap-section-inner';
  sec.appendChild(inner);

  // ── Header ──
  const header = document.createElement('div');
  header.className = 'sap-section-header';
  header.innerHTML = `
    <div class="sap-overline">${txt({ en: '📜 Our Story', he: '📜 הסיפור שלנו', ru: '📜 Наша история' })}</div>
    <h2 class="sap-section-title">${txt({ en: '300,000 Years in One Scroll', he: '300,000 שנה בגלילה אחת', ru: '300 000 лет в одной прокрутке' })}</h2>
    <p class="sap-section-subtitle">${txt({ en: 'Spacing is logarithmic — recent events are stretched to reveal how much happened in the last 10,000 years.', he: 'המרווח לוגריתמי — אירועים אחרונים נמתחים כדי לחשוף כמה קרה ב-10,000 השנים האחרונות.', ru: 'Интервалы логарифмические — недавние события растянуты, чтобы показать, как много произошло за последние 10 000 лет.' })}</p>
    <p class="sap-section-subtitle" style="margin-top:6px;font-size:12px;opacity:0.6;">${txt({ en: '🔍 Click any event to learn more', he: '🔍 לחץ על כל אירוע כדי ללמוד עוד', ru: '🔍 Нажмите на любое событие, чтобы узнать больше' })}</p>
  `;
  inner.appendChild(header);

  // ── Logarithmic scale ──
  function logScale(date) {
    if (date <= 0) return 1;
    const maxLog = Math.log10(300000);
    return 1 - Math.log10(Math.max(date, 1)) / maxLog;
  }

  // ── Build era map for fast lookup ──
  const eraMap = {};
  TIMELINE_ERAS.forEach(era => { eraMap[era.id] = era; });

  // ── Group events by era ──
  const eraGroups = {};
  TIMELINE_ERAS.forEach(era => { eraGroups[era.id] = []; });
  TIMELINE_EVENTS.forEach(ev => {
    if (eraGroups[ev.era]) eraGroups[ev.era].push(ev);
  });

  // ── Build flat ordered list for gap calculation ──
  const allEvents = [];
  TIMELINE_ERAS.forEach(era => {
    eraGroups[era.id].forEach(ev => allEvents.push(ev));
  });

  // ── Timeline container ──
  const timeline = document.createElement('div');
  timeline.className = 'sap-timeline';
  inner.appendChild(timeline);

  let globalEventIndex = 0;

  TIMELINE_ERAS.forEach(era => {
    const events = eraGroups[era.id];
    if (!events.length) return;

    // Era separator
    const eraLabel = document.createElement('div');
    eraLabel.className = 'sap-era-label';
    eraLabel.innerHTML = `<span class="sap-era-text">${txt(era.label)}</span>`;
    timeline.appendChild(eraLabel);

    events.forEach(ev => {
      const i = globalEventIndex;
      globalEventIndex++;

      // Calculate logarithmic margin-top
      let marginTop = 20;
      if (i > 0) {
        const prevDate = allEvents[i - 1].date;
        const gap = Math.max(20, Math.round(
          (logScale(ev.date) - logScale(prevDate)) * 600
        ));
        marginTop = gap;
      }

      const el = document.createElement('div');
      el.className = 'sap-tl-event' + (ev.major ? ' major' : '') + (ev.now ? ' now' : '');
      el.style.marginTop = marginTop + 'px';

      const dateLabel = ev.now
        ? txt({ en: 'Present', he: 'הווה', ru: 'Настоящее' })
        : txt({ en: `${ev.date.toLocaleString()} years ago`, he: `לפני ${ev.date.toLocaleString()} שנה`, ru: `${ev.date.toLocaleString()} лет назад` });

      el.innerHTML = `
        <div class="sap-tl-date">${ev.emoji} ${dateLabel}</div>
        <div class="sap-tl-title">${txt(ev.title)}</div>
        <div class="sap-tl-desc">${txt(ev.desc)}</div>
        <div class="sap-tl-expand">${txt({ en: '→ read more', he: '→ קרא עוד', ru: '→ читать далее' })}</div>
      `;

      // Click handler → drawer
      el.addEventListener('click', () => {
        openDrawer(content => {
          content.innerHTML = `
            <div style="padding:32px 28px;">
              <div style="font-size:32px;margin-bottom:12px;">${ev.emoji}</div>
              <div style="font-family:var(--font-mono);font-size:12px;color:rgba(var(--accent-rgb),0.5);margin-bottom:8px;">${dateLabel}</div>
              <h3 style="font-size:22px;font-weight:400;color:var(--text-primary);margin-bottom:16px;line-height:1.3;">${txt(ev.title)}</h3>
              <div style="font-size:15px;color:var(--text-dim);line-height:1.7;">${txt(ev.desc)}</div>
            </div>
          `;
        });
      });

      // IntersectionObserver for staggered fade-in
      onVisible(el, target => {
        target.classList.add('sap-tl-visible');
      }, { threshold: 0.1 });

      timeline.appendChild(el);
    });
  });

  // ── 1.7% Callout ──
  const callout = document.createElement('div');
  callout.className = 'sap-scale-callout';
  callout.innerHTML = `
    <div class="sap-big-stat">1.7%</div>
    <div class="sap-big-label">
      ${txt({
        en: 'All of <strong>recorded human history</strong> — every empire, every book, every war, every song — fits into <strong>1.7%</strong> of our species\' existence.',
        he: 'כל <strong>ההיסטוריה האנושית המתועדת</strong> — כל אימפריה, כל ספר, כל מלחמה, כל שיר — נכנסת ל-<strong>1.7%</strong> מקיום המין שלנו.',
        ru: 'Вся <strong>задокументированная история человечества</strong> — каждая империя, каждая книга, каждая война, каждая песня — умещается в <strong>1,7%</strong> существования нашего вида.',
      })}
    </div>
    <div class="sap-scale-strip">
      <div class="sap-pre-history"><span>295,000 ${txt({ en: 'YEARS', he: 'שנים', ru: 'ЛЕТ' })}</span></div>
      <div class="sap-recorded"></div>
    </div>
    <div class="sap-strip-labels">
      <span>${txt({ en: '300,000 years ago', he: 'לפני 300,000 שנה', ru: '300 000 лет назад' })}</span>
      <span class="sap-recorded-label">${txt({ en: '← 5,000 years of "history"', he: '← 5,000 שנות "היסטוריה"', ru: '← 5 000 лет «истории»' })}</span>
    </div>
  `;
  inner.appendChild(callout);

  return sec;
}

// ── DNA drawer ──
function buildDnaDrawer(el) {
  el.innerHTML = `
    <div class="sap-drawer-hero" style="background:linear-gradient(135deg,#0a0e14 0%,#0e1015 100%);">
      <div class="sap-drawer-hero-content">
        <div class="sap-drawer-emoji">🧬</div>
        <div class="sap-drawer-title">${txt({ en: 'DNA & Shared Ancestry', he: 'DNA ואבות משותפים', ru: 'ДНК и общее происхождение' })}</div>
        <div class="sap-drawer-subtitle">${txt({ en: '99.9% identical. The 0.1% tells our whole story.', he: '99.9% זהה. 0.1% מספר את כל הסיפור שלנו.', ru: '99,9% идентичны. 0,1% рассказывает всю нашу историю.' })}</div>
      </div>
    </div>
    <div class="sap-drawer-body">
      <div class="sap-section-label">${txt({ en: 'THE 0.1% THAT VARIES', he: '0.1% שמשתנה', ru: '0,1%, КОТОРЫЕ ВАРЬИРУЮТСЯ' })}</div>
      <p class="sap-drawer-prose">${txt({ en: 'That tiny 0.1% variation drives all visible human diversity — <strong>skin color</strong>, <strong>eye shape</strong>, <strong>height</strong>, <strong>disease susceptibility</strong>, and many other traits. Yet it represents just ~3 million base pairs out of 3 billion.', he: '0.1% השונות הקטנה הזו מניעה את כל המגוון האנושי הנראה לעין — <strong>צבע עור</strong>, <strong>צורת עיניים</strong>, <strong>גובה</strong>, <strong>רגישות למחלות</strong> ותכונות רבות אחרות. עם זאת, הוא מייצג רק כ-3 מיליון זוגות בסיס מתוך 3 מיליארד.', ru: 'Эти крошечные 0,1% вариации определяют всё видимое человеческое разнообразие — <strong>цвет кожи</strong>, <strong>форму глаз</strong>, <strong>рост</strong>, <strong>восприимчивость к болезням</strong> и многие другие черты. Но это всего ~3 миллиона пар оснований из 3 миллиардов.' })}</p>

      <div class="sap-divider"></div>

      <div class="sap-section-label">${txt({ en: 'ARCHAIC HUMAN ANCESTRY', he: 'מוצא אנושי ארכאי', ru: 'ПРОИСХОЖДЕНИЕ ОТ АРХАИЧНЫХ ЛЮДЕЙ' })}</div>
      <div class="sap-bar-compare">
        <div class="sap-bar-row">
          <span class="sap-bar-label">${txt({ en: 'Neanderthal', he: 'ניאנדרתל', ru: 'Неандерталец' })}</span>
          <div class="sap-bar-track">
            <div class="sap-bar-fill accent" style="width:40%;">
              1–4%
            </div>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-faint);margin:0 0 16px 90px;">${txt({ en: 'Non-African humans carry 1–4% Neanderthal DNA from interbreeding ~60,000 years ago.', he: 'בני אדם לא-אפריקאיים נושאים 1–4% DNA ניאנדרתלי מהיברידיזציה לפני כ-60,000 שנה.', ru: 'Не-африканские люди несут 1–4% неандертальской ДНК от скрещивания ~60 000 лет назад.' })}</p>
        <div class="sap-bar-row">
          <span class="sap-bar-label">${txt({ en: 'Denisovan', he: 'דניסובי', ru: 'Денисовец' })}</span>
          <div class="sap-bar-track">
            <div class="sap-bar-fill dim" style="width:50%;">
              0.5–5%
            </div>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-faint);margin:0 0 4px 90px;">${txt({ en: 'Oceanian populations (Papuans, Aboriginal Australians) carry up to 5% Denisovan DNA — highest of any population.', he: 'אוכלוסיות אוקייניות (פפואים, אוסטרלים ילידיים) נושאות עד 5% DNA דניסובי — הגבוה מכל אוכלוסייה.', ru: 'Океанийские популяции (папуасы, аборигены Австралии) несут до 5% денисовской ДНК — наибольший показатель среди всех популяций.' })}</p>
      </div>

      <div class="sap-divider"></div>

      <div class="sap-insight">
        <span class="sap-insight-emoji">🌍</span>
        <div class="sap-insight-text">
          <strong>${txt({ en: 'We are all Africans', he: 'כולנו אפריקאים', ru: 'Мы все африканцы' })}</strong><br>
          ${txt({ en: 'The greatest human genetic diversity exists within Africa — meaning all non-African populations are subsets of African variation. Every human alive today traces their ancestry to East Africa within the last 300,000 years.', he: 'המגוון הגנטי האנושי הגדול ביותר קיים באפריקה — כלומר כל האוכלוסיות הלא-אפריקאיות הן תת-קבוצות של הווריאציה האפריקאית. כל אדם חי כיום עוקב אחר אבותיו במזרח אפריקה בתוך 300,000 השנים האחרונות.', ru: 'Наибольшее человеческое генетическое разнообразие существует в Африке — это означает, что все не-африканские популяции являются подмножеством африканской вариации. Каждый ныне живущий человек прослеживает своих предков до Восточной Африки за последние 300 000 лет.' })}
        </div>
      </div>
    </div>
  `;
}
