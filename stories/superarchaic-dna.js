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
  initSilhouettes();
  initMergeMap();

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

// ══ SECTION 4: GHOST SILHOUETTES ══

const SILHOUETTE_DATA = [
  {
    id: 'ghost',
    label: 'Superarchaic',
    color: 'var(--sa-ghost)',
    fillOpacity: 0,
    strokeDash: '4,3',
    // Tall, same height as sapiens — unknown proportions
    path: 'M22,8 C22,4 26,0 30,0 C34,0 38,4 38,8 L38,12 C38,15 36,17 34,18 L36,20 L40,22 L44,24 L44,48 L42,50 L42,70 L44,72 L44,90 L38,90 L36,72 L34,70 L26,70 L24,72 L22,90 L16,90 L16,72 L18,70 L18,50 L16,48 L16,24 L20,22 L24,20 L26,18 C24,17 22,15 22,12 Z',
    width: 60, height: 90,
  },
  {
    id: 'neanderthal',
    label: 'Neanderthal',
    color: 'var(--terra)',
    fillOpacity: 0.2,
    // Stockier, shorter, broader shoulders
    path: 'M23,9 C23,5 26,2 30,2 C34,2 37,5 37,9 L37,13 C37,15 36,17 34,18 L37,20 L44,23 L46,26 L46,50 L44,52 L43,70 L45,72 L45,90 L39,90 L37,72 L35,70 L25,70 L23,72 L21,90 L15,90 L15,72 L17,70 L16,52 L14,50 L14,26 L16,23 L23,20 L26,18 C24,17 23,15 23,13 Z',
    width: 60, height: 92,
  },
  {
    id: 'denisovan',
    label: 'Denisovan',
    color: 'var(--accent-secondary)',
    fillOpacity: 0.2,
    // Broader build, medium height
    path: 'M22,9 C22,5 25,2 29,2 C33,2 36,5 36,9 L36,13 C36,15 35,17 33,18 L36,20 L43,23 L46,26 L46,50 L44,52 L43,70 L45,73 L45,92 L39,92 L37,73 L35,70 L23,70 L21,73 L19,92 L13,92 L13,73 L15,70 L14,52 L12,50 L12,26 L15,23 L22,20 L25,18 C23,17 22,15 22,13 Z',
    width: 58, height: 94,
  },
  {
    id: 'sapiens',
    label: 'Homo sapiens',
    color: 'var(--accent)',
    fillOpacity: 0.2,
    // Taller, slimmer
    path: 'M24,7 C24,3 27,0 30,0 C33,0 36,3 36,7 L36,11 C36,14 34,16 32,17 L34,19 L38,21 L42,24 L42,50 L40,52 L40,72 L42,74 L42,94 L37,94 L35,74 L33,72 L27,72 L25,74 L23,94 L18,94 L18,74 L20,72 L20,52 L18,50 L18,24 L22,21 L26,19 L28,17 C26,16 24,14 24,11 Z',
    width: 60, height: 94,
  },
];

function initSilhouettes() {
  const container = document.getElementById('silhouettes');
  if (!container) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 280 120');
  svg.setAttribute('class', 'sa-silhouettes-svg');
  svg.setAttribute('aria-hidden', 'true');

  SILHOUETTE_DATA.forEach((s, i) => {
    const g = document.createElementNS(svgNS, 'g');
    const xOffset = i * 68 + 10;
    const yOffset = 120 - s.height;
    g.setAttribute('transform', `translate(${xOffset}, ${yOffset})`);

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', s.path);
    path.setAttribute('fill', s.id === 'ghost' ? 'none' : s.color);
    path.setAttribute('fill-opacity', String(s.fillOpacity));
    path.setAttribute('stroke', s.color);
    path.setAttribute('stroke-width', s.id === 'ghost' ? '1.5' : '0');
    if (s.strokeDash) path.setAttribute('stroke-dasharray', s.strokeDash);
    if (s.id === 'ghost') path.setAttribute('class', 'sa-ghost-figure');
    g.appendChild(path);

    // Label
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', String(s.width / 2));
    text.setAttribute('y', String(s.height + 14));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', s.id === 'ghost' ? 'sa-sil-label sa-sil-label-ghost' : 'sa-sil-label');
    text.textContent = s.label;
    g.appendChild(text);

    svg.appendChild(g);
  });

  container.appendChild(svg);
}

// ══ SECTION 5: MERGE EVENT MAP ══

function initMergeMap() {
  const container = document.getElementById('merge-map');
  if (!container) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 600 300');
  svg.setAttribute('class', 'sa-map-svg');
  svg.setAttribute('aria-hidden', 'true');

  // Simplified continent outlines (placeholder — will be replaced by improved mini-map)
  const continents = [
    // Africa
    { d: 'M250,120 L270,110 L290,115 L305,130 L310,160 L305,190 L295,210 L280,225 L265,230 L250,225 L240,210 L235,190 L232,170 L235,150 L240,135 Z', fill: 'rgba(91,154,107,0.12)', stroke: 'rgba(91,154,107,0.25)' },
    // Europe
    { d: 'M260,60 L280,55 L300,50 L320,55 L335,60 L340,75 L330,85 L315,90 L300,88 L285,90 L270,85 L260,75 Z', fill: 'rgba(90,138,154,0.12)', stroke: 'rgba(90,138,154,0.25)' },
    // Asia
    { d: 'M340,55 L370,45 L410,40 L450,45 L480,55 L490,75 L485,95 L470,110 L450,120 L420,125 L390,120 L360,110 L345,95 L340,75 Z', fill: 'rgba(90,138,154,0.12)', stroke: 'rgba(90,138,154,0.25)' },
  ];

  continents.forEach(c => {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', c.d);
    path.setAttribute('fill', c.fill);
    path.setAttribute('stroke', c.stroke);
    path.setAttribute('stroke-width', '1');
    svg.appendChild(path);
  });

  // Continent labels
  const labels = [
    { x: 270, y: 175, text: 'Africa' },
    { x: 300, y: 72, text: 'Europe' },
    { x: 415, y: 85, text: 'Asia' },
  ];
  labels.forEach(l => {
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', String(l.x));
    text.setAttribute('y', String(l.y));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'sa-map-label');
    text.textContent = l.text;
    svg.appendChild(text);
  });

  // Event 1: Africa (purple) — superarchaic → proto-sapiens
  const event1Group = document.createElementNS(svgNS, 'g');
  event1Group.setAttribute('class', 'sa-merge-event sa-event-1');

  const dot1Start = document.createElementNS(svgNS, 'circle');
  dot1Start.setAttribute('cx', '255');
  dot1Start.setAttribute('cy', '155');
  dot1Start.setAttribute('r', '5');
  dot1Start.setAttribute('fill', 'var(--sa-ghost)');
  dot1Start.setAttribute('opacity', '0.6');
  event1Group.appendChild(dot1Start);

  const arrow1 = document.createElementNS(svgNS, 'path');
  arrow1.setAttribute('d', 'M255,155 Q270,130 280,145');
  arrow1.setAttribute('class', 'sa-merge-arrow sa-arrow-purple');
  event1Group.appendChild(arrow1);

  const dot1End = document.createElementNS(svgNS, 'circle');
  dot1End.setAttribute('cx', '280');
  dot1End.setAttribute('cy', '145');
  dot1End.setAttribute('r', '5');
  dot1End.setAttribute('fill', 'var(--sa-ghost)');
  dot1End.setAttribute('class', 'sa-merge-dest');
  event1Group.appendChild(dot1End);

  // Ripple ring for event 1
  const ripple1 = document.createElementNS(svgNS, 'circle');
  ripple1.setAttribute('cx', '280');
  ripple1.setAttribute('cy', '145');
  ripple1.setAttribute('r', '5');
  ripple1.setAttribute('class', 'sa-ripple sa-ripple-purple');
  event1Group.appendChild(ripple1);

  const label1 = document.createElementNS(svgNS, 'text');
  label1.setAttribute('x', '240');
  label1.setAttribute('y', '148');
  label1.setAttribute('class', 'sa-event-label sa-event-label-purple');
  label1.textContent = '~500+ Kya';
  event1Group.appendChild(label1);

  svg.appendChild(event1Group);

  // Event 2: Eurasia (terra) — superarchaic → proto-Neanderthal/Denisovan
  const event2Group = document.createElementNS(svgNS, 'g');
  event2Group.setAttribute('class', 'sa-merge-event sa-event-2');

  const dot2Start = document.createElementNS(svgNS, 'circle');
  dot2Start.setAttribute('cx', '360');
  dot2Start.setAttribute('cy', '90');
  dot2Start.setAttribute('r', '5');
  dot2Start.setAttribute('fill', 'var(--terra)');
  dot2Start.setAttribute('opacity', '0.6');
  event2Group.appendChild(dot2Start);

  const arrow2 = document.createElementNS(svgNS, 'path');
  arrow2.setAttribute('d', 'M360,90 Q390,65 410,80');
  arrow2.setAttribute('class', 'sa-merge-arrow sa-arrow-terra');
  event2Group.appendChild(arrow2);

  const dot2End = document.createElementNS(svgNS, 'circle');
  dot2End.setAttribute('cx', '410');
  dot2End.setAttribute('cy', '80');
  dot2End.setAttribute('r', '5');
  dot2End.setAttribute('fill', 'var(--terra)');
  dot2End.setAttribute('class', 'sa-merge-dest');
  event2Group.appendChild(dot2End);

  // Ripple ring for event 2
  const ripple2 = document.createElementNS(svgNS, 'circle');
  ripple2.setAttribute('cx', '410');
  ripple2.setAttribute('cy', '80');
  ripple2.setAttribute('r', '5');
  ripple2.setAttribute('class', 'sa-ripple sa-ripple-terra');
  event2Group.appendChild(ripple2);

  const label2 = document.createElementNS(svgNS, 'text');
  label2.setAttribute('x', '425');
  label2.setAttribute('y', '73');
  label2.setAttribute('class', 'sa-event-label sa-event-label-terra');
  label2.textContent = '~700+ Kya';
  event2Group.appendChild(label2);

  svg.appendChild(event2Group);
  container.appendChild(svg);

  // Animate events on scroll
  if (reducedMotion()) {
    event1Group.classList.add('visible');
    event2Group.classList.add('visible');
    return;
  }

  const section = document.getElementById('sec-map');
  const obs = onVisible(section, () => {
    event1Group.classList.add('visible');
    setTimeout(() => event2Group.classList.add('visible'), 500);
  }, { threshold: 0.3, essential: true });
  if (obs) observers.push(obs);
}

// ── Start ──
document.addEventListener('DOMContentLoaded', init);
