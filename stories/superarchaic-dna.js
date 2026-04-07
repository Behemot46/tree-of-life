// ══════════════════════════════════════════════════════
// SUPERARCHAIC DNA — story-specific animations & logic
// ══════════════════════════════════════════════════════

import { reducedMotion, onVisible, revealOnScroll } from './story-utils.js';

// Track observers for cleanup
const observers = [];

// ── INIT ──
function init() {
  const page = document.getElementById('story');
  if (!page) return;

  // Auto-reveal all .reveal elements
  const revealObs = revealOnScroll(page);
  observers.push(...revealObs);

  // Section-specific animations
  initRing();
  initBombshell();

  // Fade scroll hint on first scroll
  page.addEventListener('scroll', function onFirst() {
    const hint = document.getElementById('scroll-hint');
    if (hint) hint.style.opacity = '0';
    page.removeEventListener('scroll', onFirst);
  }, { passive: true });
}

// ══ SECTION 1: DNA RING ══

function initRing() {
  const section = document.getElementById('sec-hook');
  if (!section) return;

  const circumference = 2 * Math.PI * 80; // r=80 → ~502.65
  const sapiensEl = document.getElementById('ring-sapiens');
  const ghostEl = document.getElementById('ring-ghost');
  const pctEl = document.getElementById('ring-pct');

  if (!sapiensEl || !ghostEl || !pctEl) return;

  if (reducedMotion()) {
    // Static final state
    const sapiensArc = circumference * 0.8;
    const ghostArc = circumference * 0.2;
    sapiensEl.setAttribute('stroke-dasharray', `${sapiensArc} ${circumference}`);
    ghostEl.setAttribute('stroke-dasharray', `${ghostArc} ${circumference}`);
    ghostEl.setAttribute('stroke-dashoffset', `${-sapiensArc}`);
    pctEl.textContent = '80%';
    return;
  }

  // Start at 100%
  sapiensEl.setAttribute('stroke-dasharray', `${circumference} ${circumference}`);
  ghostEl.setAttribute('stroke-dasharray', `0 ${circumference}`);
  pctEl.textContent = '100%';

  // Animate when section is 50% visible
  const obs = onVisible(section, () => {
    animateRing(sapiensEl, ghostEl, pctEl, circumference);
  }, { threshold: 0.5, essential: true });
  if (obs) observers.push(obs);
}

function animateRing(sapiensEl, ghostEl, pctEl, circumference) {
  const duration = 1500;
  const start = performance.now();
  const sapiensStart = circumference;
  const sapiensEnd = circumference * 0.8;
  const ghostEnd = circumference * 0.2;

  function frame(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const ease = 1 - Math.pow(1 - t, 3);

    const sapiensArc = sapiensStart - (sapiensStart - sapiensEnd) * ease;
    const ghostArc = ghostEnd * ease;

    sapiensEl.setAttribute('stroke-dasharray', `${sapiensArc} ${circumference}`);
    ghostEl.setAttribute('stroke-dasharray', `${ghostArc} ${circumference}`);
    ghostEl.setAttribute('stroke-dashoffset', `${-sapiensArc}`);

    const pct = Math.round(100 - 20 * ease);
    pctEl.textContent = `${pct}%`;

    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// ══ SECTION 3: BOMBSHELL ══

function initBombshell() {
  const section = document.getElementById('sec-bombshell');
  const ghostSegment = document.getElementById('ghost-segment');
  if (!section || !ghostSegment) return;

  if (reducedMotion()) {
    ghostSegment.classList.add('expanded');
    return;
  }

  const obs = onVisible(section, () => {
    ghostSegment.classList.add('expanded');
    // Optional screen shake after expansion completes
    setTimeout(() => {
      section.classList.add('shake');
      section.addEventListener('animationend', () => {
        section.classList.remove('shake');
      }, { once: true });
    }, 800);
  }, { threshold: 0.3, essential: true });
  if (obs) observers.push(obs);
}

// ── Start ──
document.addEventListener('DOMContentLoaded', init);
