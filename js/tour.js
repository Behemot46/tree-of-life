// ══════════════════════════════════════════════════════
// GUIDED TOUR — first-time visitor onboarding
// ══════════════════════════════════════════════════════

const TOUR_STEPS = [
  { target: null,            titleKey: 'tour_welcome_title',  descKey: 'tour_welcome_desc',  placement: 'center' },
  { target: '#search-wrap',  titleKey: 'tour_search_title',   descKey: 'tour_search_desc',   placement: 'below'  },
  { target: '#legend',       titleKey: 'tour_legend_title',   descKey: 'tour_legend_desc',   placement: 'right'  },
  { target: '#view-toggle',  titleKey: 'tour_views_title',    descKey: 'tour_views_desc',    placement: 'below'  },
  { target: '#timeline',     titleKey: 'tour_timeline_title', descKey: 'tour_timeline_desc', placement: 'above'  },
  { target: '#btn-hominin',  titleKey: 'tour_hominin_title',  descKey: 'tour_hominin_desc',  placement: 'above'  },
  { target: '#btn-dna-calc', titleKey: 'tour_dna_title',      descKey: 'tour_dna_desc',      placement: 'above'  },
];

var tourState = { active: false, step: 0 };
var _tourSpotlight = null;
var _tourCard = null;
var _tourOverlay = null;
var _tourPrevTarget = null;
var _tourResizeTimer = null;

function startTour() {
  if (tourState.active) return;
  tourState.active = true;
  tourState.step = 0;
  _createTourDOM();
  _showTourStep(0);
  window.addEventListener('resize', _tourOnResize);
  window.addEventListener('keydown', _tourOnKey);
}

function endTour() {
  if (!_tourOverlay) return;
  tourState.active = false;
  if (_tourPrevTarget) _tourPrevTarget.classList.remove('tour-target');
  _tourPrevTarget = null;
  _tourOverlay.remove();
  _tourOverlay = null;
  _tourSpotlight = null;
  _tourCard = null;
  localStorage.setItem('tol-tour-done', '1');
  window.removeEventListener('resize', _tourOnResize);
  window.removeEventListener('keydown', _tourOnKey);
}

function _createTourDOM() {
  // Overlay
  _tourOverlay = document.createElement('div');
  _tourOverlay.className = 'tour-overlay';
  _tourOverlay.addEventListener('click', function(e) {
    if (e.target === _tourOverlay) endTour();
  });

  // Spotlight
  _tourSpotlight = document.createElement('div');
  _tourSpotlight.className = 'tour-spotlight';
  _tourOverlay.appendChild(_tourSpotlight);

  // Card
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

  // Wire buttons
  _tourCard.querySelector('.tour-close').onclick = endTour;
  _tourCard.querySelector('.tour-btn-skip').onclick = endTour;
  _tourCard.querySelector('.tour-btn-prev').onclick = function() { _showTourStep(tourState.step - 1); };
  _tourCard.querySelector('.tour-btn-next').onclick = function() {
    if (tourState.step >= TOUR_STEPS.length - 1) endTour();
    else _showTourStep(tourState.step + 1);
  };

  document.body.appendChild(_tourOverlay);
}

function _showTourStep(index) {
  if (index < 0 || index >= TOUR_STEPS.length) return;
  tourState.step = index;
  var step = TOUR_STEPS[index];

  // Remove previous target highlight
  if (_tourPrevTarget) _tourPrevTarget.classList.remove('tour-target');
  _tourPrevTarget = null;

  // Update card text
  _tourCard.querySelector('.tour-step-num').textContent = (index + 1) + ' ' + t('tour_of') + ' ' + TOUR_STEPS.length;
  _tourCard.querySelector('.tour-card-title').textContent = t(step.titleKey);
  _tourCard.querySelector('.tour-card-desc').textContent = t(step.descKey);

  // Button labels
  var isFirst = index === 0;
  var isLast = index === TOUR_STEPS.length - 1;
  _tourCard.querySelector('.tour-btn-skip').textContent = t('tour_skip');
  _tourCard.querySelector('.tour-btn-prev').textContent = t('tour_prev');
  _tourCard.querySelector('.tour-btn-next').textContent = isLast ? t('tour_done') : t('tour_next');
  _tourCard.querySelector('.tour-btn-prev').style.display = isFirst ? 'none' : '';

  // Position spotlight and card
  if (!step.target) {
    // Welcome step: no spotlight, card centered
    _tourSpotlight.style.display = 'none';
    _tourCard.style.left = '50%';
    _tourCard.style.top = '50%';
    _tourCard.style.transform = 'translate(-50%,-50%)';
    _tourCard.removeAttribute('data-placement');
  } else {
    var el = document.querySelector(step.target);
    if (!el || el.offsetWidth === 0) {
      // Element not visible, skip step
      if (index < TOUR_STEPS.length - 1) _showTourStep(index + 1);
      else endTour();
      return;
    }
    el.classList.add('tour-target');
    _tourPrevTarget = el;
    _positionSpotlight(el);
    _positionCard(el, step.placement);
  }

  // Fade in
  _tourCard.classList.remove('visible');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      _tourCard.classList.add('visible');
    });
  });
}

function _positionSpotlight(el) {
  var r = el.getBoundingClientRect();
  var pad = 8;
  _tourSpotlight.style.display = '';
  _tourSpotlight.style.left = (r.left - pad) + 'px';
  _tourSpotlight.style.top = (r.top - pad) + 'px';
  _tourSpotlight.style.width = (r.width + pad * 2) + 'px';
  _tourSpotlight.style.height = (r.height + pad * 2) + 'px';
}

function _positionCard(el, preferred) {
  var r = el.getBoundingClientRect();
  var cardW = 320;
  var cardH = 200; // estimate
  var gap = 16;
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var placement = preferred;

  // Check if preferred placement fits, fall back
  if (placement === 'below' && (r.bottom + gap + cardH) > vh) placement = 'above';
  if (placement === 'above' && (r.top - gap - cardH) < 0) placement = 'below';
  if (placement === 'right' && (r.right + gap + cardW) > vw) placement = 'left';
  if (placement === 'left' && (r.left - gap - cardW) < 0) placement = 'right';

  _tourCard.style.transform = '';
  _tourCard.setAttribute('data-placement', placement);

  var left, top;
  if (placement === 'below') {
    left = Math.max(16, Math.min(r.left + r.width / 2 - cardW / 2, vw - cardW - 16));
    top = r.bottom + gap;
  } else if (placement === 'above') {
    left = Math.max(16, Math.min(r.left + r.width / 2 - cardW / 2, vw - cardW - 16));
    top = r.top - gap;
    _tourCard.style.transform = 'translateY(-100%)';
  } else if (placement === 'right') {
    left = r.right + gap;
    top = r.top + r.height / 2;
    _tourCard.style.transform = 'translateY(-50%)';
  } else { // left
    left = r.left - gap - cardW;
    top = r.top + r.height / 2;
    _tourCard.style.transform = 'translateY(-50%)';
  }

  // Mobile override: card at bottom
  if (vw <= 768) {
    left = 16;
    top = vh - 16;
    _tourCard.style.transform = 'translateY(-100%)';
    _tourCard.setAttribute('data-placement', 'mobile');
  }

  _tourCard.style.left = left + 'px';
  _tourCard.style.top = top + 'px';
}

function _tourOnResize() {
  clearTimeout(_tourResizeTimer);
  _tourResizeTimer = setTimeout(function() {
    if (tourState.active) _showTourStep(tourState.step);
  }, 150);
}

function _tourOnKey(e) {
  if (!tourState.active) return;
  if (e.key === 'Escape') { endTour(); e.stopPropagation(); }
  else if (e.key === 'ArrowRight') _showTourStep(tourState.step + 1);
  else if (e.key === 'ArrowLeft') _showTourStep(tourState.step - 1);
}
