// ══════════════════════════════════════════════════════
// GUIDED TOURS — 3 educational tour paths
// ══════════════════════════════════════════════════════

// ── Dependencies injected from app.js via initTourDeps() ──
let _deps = {};

export function initTourDeps(deps) {
  _deps = deps;
}

function _ts() { return _deps.state || {}; }
function _nm() { return _deps.nodeMap || {}; }
function _lay() { if (_deps.layout) _deps.layout(); }
function _sr(f) { if (_deps.scheduleRender) _deps.scheduleRender(f); }
function _at() { if (_deps.applyT) _deps.applyT(); }
function _slide(v) { if (_deps.animateSliderTo) _deps.animateSliderTo(v); }
function t(key) { return _deps.t ? _deps.t(key) : key; }

// ── Tour Definitions ──

export var TOURS = {
  luca: {
    nameKey: 'tour_luca_name',
    descKey: 'tour_luca_desc',
    icon: '\uD83E\uDDEC',
    steps: [
      { target: null, titleKey: 'tour_luca_s1_title', descKey: 'tour_luca_s1_desc', placement: 'center' },
      { target: { nodeId: 'luca' }, titleKey: 'tour_luca_s2_title', descKey: 'tour_luca_s2_desc', placement: 'below' },
      { target: { nodeId: 'eukaryota' }, titleKey: 'tour_luca_s3_title', descKey: 'tour_luca_s3_desc', placement: 'below' },
      { target: { nodeId: 'animalia' }, titleKey: 'tour_luca_s4_title', descKey: 'tour_luca_s4_desc', placement: 'below' },
      { target: { nodeId: 'vertebrates' }, titleKey: 'tour_luca_s5_title', descKey: 'tour_luca_s5_desc', placement: 'below' },
      { target: { nodeId: 'mammals' }, titleKey: 'tour_luca_s6_title', descKey: 'tour_luca_s6_desc', placement: 'below' },
      { target: { nodeId: 'primates' }, titleKey: 'tour_luca_s7_title', descKey: 'tour_luca_s7_desc', placement: 'below' },
      { target: { nodeId: 'homo-sapiens' }, titleKey: 'tour_luca_s8_title', descKey: 'tour_luca_s8_desc', placement: 'below' }
    ]
  },
  kingdoms: {
    nameKey: 'tour_kingdoms_name',
    descKey: 'tour_kingdoms_desc',
    icon: '\uD83C\uDF0D',
    steps: [
      { target: null, titleKey: 'tour_king_s1_title', descKey: 'tour_king_s1_desc', placement: 'center' },
      { target: { nodeId: 'bacteria' }, titleKey: 'tour_king_s2_title', descKey: 'tour_king_s2_desc', placement: 'below' },
      { target: { nodeId: 'archaea' }, titleKey: 'tour_king_s3_title', descKey: 'tour_king_s3_desc', placement: 'below' },
      { target: { nodeId: 'protists' }, titleKey: 'tour_king_s4_title', descKey: 'tour_king_s4_desc', placement: 'below' },
      { target: { nodeId: 'fungi' }, titleKey: 'tour_king_s5_title', descKey: 'tour_king_s5_desc', placement: 'below' },
      { target: { nodeId: 'plantae' }, titleKey: 'tour_king_s6_title', descKey: 'tour_king_s6_desc', placement: 'below' },
      { target: { nodeId: 'animalia' }, titleKey: 'tour_king_s7_title', descKey: 'tour_king_s7_desc', placement: 'below' }
    ]
  },
  extinctions: {
    nameKey: 'tour_ext_name',
    descKey: 'tour_ext_desc',
    icon: '\u2604\uFE0F',
    steps: [
      { target: '#timeline', titleKey: 'tour_ext_s1_title', descKey: 'tour_ext_s1_desc', placement: 'above',
        action: function() { _slide(3800); } },
      { target: { mya: 445 }, titleKey: 'tour_ext_s2_title', descKey: 'tour_ext_s2_desc', placement: 'above' },
      { target: { mya: 370 }, titleKey: 'tour_ext_s3_title', descKey: 'tour_ext_s3_desc', placement: 'above' },
      { target: { mya: 252 }, titleKey: 'tour_ext_s4_title', descKey: 'tour_ext_s4_desc', placement: 'above' },
      { target: { mya: 200 }, titleKey: 'tour_ext_s5_title', descKey: 'tour_ext_s5_desc', placement: 'above' },
      { target: { mya: 66 }, titleKey: 'tour_ext_s6_title', descKey: 'tour_ext_s6_desc', placement: 'above' },
      { target: '#timeline', titleKey: 'tour_ext_s7_title', descKey: 'tour_ext_s7_desc', placement: 'above',
        action: function() { _slide(0); } }
    ]
  }
};

// ── Tour State ──

export var tourState = { active: false, step: 0, tourId: null };
var _tourCurrentSteps = [];
var _tourSpotlight = null;
var _tourCard = null;
var _tourOverlay = null;
var _tourPrevTarget = null;
var _tourResizeTimer = null;
var _tourSelectorEl = null;

// ── Tour Selector UI ──

export function showTourSelector() {
  if (tourState.active) return;
  if (_tourSelectorEl) _tourSelectorEl.remove();

  var overlay = document.createElement('div');
  overlay.className = 'tour-selector-overlay';

  var modal = document.createElement('div');
  modal.className = 'tour-selector';

  var title = document.createElement('h2');
  title.className = 'tour-selector-title';
  title.textContent = t('tour_selector_title');
  modal.appendChild(title);

  var subtitle = document.createElement('p');
  subtitle.className = 'tour-selector-subtitle';
  subtitle.textContent = t('tour_selector_subtitle');
  modal.appendChild(subtitle);

  var cards = document.createElement('div');
  cards.className = 'tour-selector-cards';

  var tourIds = ['luca', 'kingdoms', 'extinctions'];
  tourIds.forEach(function(id) {
    var tour = TOURS[id];
    var card = document.createElement('button');
    card.className = 'tour-selector-card';
    card.innerHTML =
      '<span class="tour-selector-card-icon">' + tour.icon + '</span>' +
      '<strong class="tour-selector-card-name">' + t(tour.nameKey) + '</strong>' +
      '<span class="tour-selector-card-desc">' + t(tour.descKey) + '</span>' +
      '<span class="tour-selector-card-meta">' + tour.steps.length + ' ' + t('tour_selector_steps') + '</span>';
    card.addEventListener('click', function() {
      _closeTourSelector();
      startTour(id);
    });
    cards.appendChild(card);
  });
  modal.appendChild(cards);

  var later = document.createElement('button');
  later.className = 'tour-selector-later';
  later.textContent = t('tour_selector_later');
  later.addEventListener('click', _closeTourSelector);
  modal.appendChild(later);

  overlay.appendChild(modal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) _closeTourSelector();
  });

  document.body.appendChild(overlay);
  _tourSelectorEl = overlay;
}

function _closeTourSelector() {
  if (_tourSelectorEl) {
    _tourSelectorEl.remove();
    _tourSelectorEl = null;
  }
  localStorage.setItem('tol-tour-done', '1');
}

// ── Tour Engine ──

export function startTour(tourId) {
  if (tourState.active) return;
  var tour = TOURS[tourId];
  if (!tour) return;

  // Close panel if open
  var panel = document.getElementById('panel');
  if (panel && panel.classList.contains('open')) {
    panel.classList.remove('open');
  }

  tourState.active = true;
  tourState.step = 0;
  tourState.tourId = tourId;
  _tourCurrentSteps = tour.steps;
  _createTourDOM();
  _showTourStep(0);
  window.addEventListener('resize', _tourOnResize);
  window.addEventListener('keydown', _tourOnKey);
}

export function endTour() {
  if (!_tourOverlay) return;
  tourState.active = false;
  tourState.tourId = null;
  _tourCurrentSteps = [];
  if (_tourPrevTarget) _tourPrevTarget.classList.remove('tour-target');
  _tourPrevTarget = null;
  _tourOverlay.remove();
  _tourOverlay = null;
  _tourSpotlight = null;
  _tourCard = null;
  localStorage.setItem('tol-tour-done', '1');
  // Clear highlight
  var st = _ts();
  if (st.highlightedId !== undefined) {
    st.highlightedId = null;
    _sr();
  }
  window.removeEventListener('resize', _tourOnResize);
  window.removeEventListener('keydown', _tourOnKey);
}

function _createTourDOM() {
  _tourOverlay = document.createElement('div');
  _tourOverlay.className = 'tour-overlay';
  _tourOverlay.addEventListener('click', function(e) {
    if (e.target === _tourOverlay) endTour();
  });

  _tourSpotlight = document.createElement('div');
  _tourSpotlight.className = 'tour-spotlight';
  _tourOverlay.appendChild(_tourSpotlight);

  _tourCard = document.createElement('div');
  _tourCard.className = 'tour-card';
  _tourCard.innerHTML =
    '<div class="tour-card-head">' +
      '<span class="tour-step-num"></span>' +
      '<button class="tour-close" aria-label="Close tour">&times;</button>' +
    '</div>' +
    '<h3 class="tour-card-title"></h3>' +
    '<p class="tour-card-desc"></p>' +
    '<div class="tour-card-foot">' +
      '<button class="tour-btn tour-btn-skip"></button>' +
      '<div class="tour-card-nav">' +
        '<button class="tour-btn tour-btn-prev"></button>' +
        '<button class="tour-btn tour-btn-next"></button>' +
      '</div>' +
    '</div>';
  _tourOverlay.appendChild(_tourCard);

  _tourCard.querySelector('.tour-close').onclick = endTour;
  _tourCard.querySelector('.tour-btn-skip').onclick = endTour;
  _tourCard.querySelector('.tour-btn-prev').onclick = function() { _showTourStep(tourState.step - 1); };
  _tourCard.querySelector('.tour-btn-next').onclick = function() {
    if (tourState.step >= _tourCurrentSteps.length - 1) endTour();
    else _showTourStep(tourState.step + 1);
  };

  document.body.appendChild(_tourOverlay);
}

function _showTourStep(index) {
  if (index < 0 || index >= _tourCurrentSteps.length) return;
  tourState.step = index;
  var step = _tourCurrentSteps[index];

  // Remove previous target highlight
  if (_tourPrevTarget) _tourPrevTarget.classList.remove('tour-target');
  _tourPrevTarget = null;

  // Update card text
  _tourCard.querySelector('.tour-step-num').textContent = (index + 1) + ' ' + t('tour_of') + ' ' + _tourCurrentSteps.length;
  _tourCard.querySelector('.tour-card-title').textContent = t(step.titleKey);
  _tourCard.querySelector('.tour-card-desc').textContent = t(step.descKey);

  // Button labels
  var isFirst = index === 0;
  var isLast = index === _tourCurrentSteps.length - 1;
  _tourCard.querySelector('.tour-btn-skip').textContent = t('tour_skip');
  _tourCard.querySelector('.tour-btn-prev').textContent = t('tour_prev');
  _tourCard.querySelector('.tour-btn-next').textContent = isLast ? t('tour_done') : t('tour_next');
  _tourCard.querySelector('.tour-btn-prev').style.display = isFirst ? 'none' : '';

  // Run action if present
  if (step.action) step.action();

  // Resolve target
  var target = step.target;

  if (!target) {
    // Centered card, no spotlight
    _tourSpotlight.style.display = 'none';
    _tourCard.style.left = '50%';
    _tourCard.style.top = '50%';
    _tourCard.style.transform = 'translate(-50%,-50%)';
    _tourCard.removeAttribute('data-placement');
    _fadeInCard();
  } else if (typeof target === 'string') {
    // CSS selector
    var el = document.querySelector(target);
    if (!el || el.offsetWidth === 0) {
      if (index < _tourCurrentSteps.length - 1) _showTourStep(index + 1);
      else endTour();
      return;
    }
    el.classList.add('tour-target');
    _tourPrevTarget = el;
    var rect = el.getBoundingClientRect();
    _positionSpotlight(rect);
    _positionCard(rect, step.placement);
    _fadeInCard();
  } else if (target.nodeId) {
    // Tree node
    _tourNavToNode(target.nodeId, step.placement);
  } else if (typeof target.mya === 'number') {
    // Timeline extinction marker
    _tourNavToMya(target.mya, step.placement);
  }
}

// ── Node Navigation Helper ──

function _tourNavToNode(nodeId, placement) {
  var nm = _nm();
  var n = nm[nodeId];
  if (!n) return;

  // Expand path to node
  var c = n;
  while (c._parent) {
    c._parent._collapsed = false;
    c = c._parent;
  }

  _lay();
  _sr(true);

  // Pan to center on node
  var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  var st = _ts();
  if (st.transform) {
    st.transform.x = cx - n._x * st.transform.s;
    st.transform.y = cy - n._y * st.transform.s;
    _at();
  }

  // Highlight node
  st.highlightedId = nodeId;
  _sr();

  // Wait for render, then position spotlight
  setTimeout(function() {
    if (!tourState.active) return;
    var rect = _getNodeScreenRect(n);
    _positionSpotlight(rect);
    _positionCard(rect, placement);
    _fadeInCard();
  }, 350);
}

function _getNodeScreenRect(n) {
  var st = _ts();
  var s = st.transform ? st.transform.s : 1;
  var tx = st.transform ? st.transform.x : 0;
  var ty = st.transform ? st.transform.y : 0;
  var screenX = n._x * s + tx;
  var screenY = n._y * s + ty;
  var r = (n.r || 12) * s;
  // Minimum visual size for spotlight
  var minR = 24;
  if (r < minR) r = minR;
  return {
    left: screenX - r,
    top: screenY - r,
    right: screenX + r,
    bottom: screenY + r,
    width: r * 2,
    height: r * 2
  };
}

// ── Timeline/Extinction Navigation Helper ──

function _tourNavToMya(mya, placement) {
  _slide(mya);

  // Wait for animation, then spotlight the extinction marker
  setTimeout(function() {
    if (!tourState.active) return;

    // Find the matching extinction marker by index
    // EXTINCTION_DETAILS order: [445, 370, 252, 200, 66]
    var EXT_MYA = [445, 370, 252, 200, 66];
    var markers = document.querySelectorAll('#extinction-markers .ext-marker');
    var markerEl = null;
    for (var i = 0; i < EXT_MYA.length; i++) {
      if (EXT_MYA[i] === mya && markers[i]) {
        markerEl = markers[i];
        break;
      }
    }

    var rect;
    if (markerEl) {
      markerEl.classList.add('tour-target');
      _tourPrevTarget = markerEl;
      rect = markerEl.getBoundingClientRect();
      // Widen the spotlight for small markers
      if (rect.width < 40) {
        var cx = rect.left + rect.width / 2;
        rect = { left: cx - 20, top: rect.top - 8, right: cx + 20, bottom: rect.bottom + 8, width: 40, height: rect.height + 16 };
      }
    } else {
      // Fallback to timeline element
      var tl = document.getElementById('timeline');
      rect = tl ? tl.getBoundingClientRect() : { left: 0, top: 0, right: 100, bottom: 50, width: 100, height: 50 };
    }

    _positionSpotlight(rect);
    _positionCard(rect, placement);
    _fadeInCard();
  }, 500);
}

// ── Spotlight & Card Positioning (rect-based) ──

function _positionSpotlight(rect) {
  var pad = 8;
  _tourSpotlight.style.display = '';
  _tourSpotlight.style.left = (rect.left - pad) + 'px';
  _tourSpotlight.style.top = (rect.top - pad) + 'px';
  _tourSpotlight.style.width = (rect.width + pad * 2) + 'px';
  _tourSpotlight.style.height = (rect.height + pad * 2) + 'px';
}

function _positionCard(rect, preferred) {
  var cardW = 320;
  var cardH = 200;
  var gap = 16;
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var placement = preferred;

  // Check fits, fall back
  if (placement === 'below' && (rect.top + rect.height + gap + cardH) > vh) placement = 'above';
  if (placement === 'above' && (rect.top - gap - cardH) < 0) placement = 'below';
  if (placement === 'right' && (rect.left + rect.width + gap + cardW) > vw) placement = 'left';
  if (placement === 'left' && (rect.left - gap - cardW) < 0) placement = 'right';

  _tourCard.style.transform = '';
  _tourCard.setAttribute('data-placement', placement);

  var left, top;
  if (placement === 'below') {
    left = Math.max(16, Math.min(rect.left + rect.width / 2 - cardW / 2, vw - cardW - 16));
    top = rect.top + rect.height + gap;
  } else if (placement === 'above') {
    left = Math.max(16, Math.min(rect.left + rect.width / 2 - cardW / 2, vw - cardW - 16));
    top = rect.top - gap;
    _tourCard.style.transform = 'translateY(-100%)';
  } else if (placement === 'right') {
    left = rect.left + rect.width + gap;
    top = rect.top + rect.height / 2;
    _tourCard.style.transform = 'translateY(-50%)';
  } else {
    left = rect.left - gap - cardW;
    top = rect.top + rect.height / 2;
    _tourCard.style.transform = 'translateY(-50%)';
  }

  // Mobile override
  if (vw <= 768) {
    left = 16;
    top = vh - 16;
    _tourCard.style.transform = 'translateY(-100%)';
    _tourCard.setAttribute('data-placement', 'mobile');
  }

  _tourCard.style.left = left + 'px';
  _tourCard.style.top = top + 'px';
}

function _fadeInCard() {
  _tourCard.classList.remove('visible');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      _tourCard.classList.add('visible');
    });
  });
}

// ── Resize & Keyboard ──

function _tourOnResize() {
  clearTimeout(_tourResizeTimer);
  _tourResizeTimer = setTimeout(function() {
    if (tourState.active) _showTourStep(tourState.step);
  }, 150);
}

function _tourOnKey(e) {
  if (!tourState.active) return;
  if (e.key === 'Escape') { endTour(); e.stopPropagation(); }
  else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    if (tourState.step >= _tourCurrentSteps.length - 1) endTour();
    else _showTourStep(tourState.step + 1);
  }
  else if (e.key === 'ArrowLeft') _showTourStep(tourState.step - 1);
}
