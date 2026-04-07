// ══════════════════════════════════════════════════════
// SPECIES COMPARE — unified DNA + evolutionary path tool
// Replaces dnaCalc.js + evoPath.js
// ══════════════════════════════════════════════════════

import { state, nodeMap } from './state.js';
import { PHOTO_MAP } from './data.js';
import { estimateDnaSimilarity, getDnaFunFact } from './dnaSimilarity.js';
import { findLCA } from './dnaSimilarity.js';
import { a11yAnnounce, trackDnaCompare } from './engagement.js';
import { getRandomSpecies, getTimeContext } from './utils.js';

// ── Late-binding deps ──
let _deps = {};
export function initCompareDeps(deps) { Object.assign(_deps, deps); }
function t(key) { return _deps.t ? _deps.t(key) : key; }

// ── Module state ──
let slotA = null; // { id, name, icon }
let slotB = null;
let searchTarget = null; // 'a' or 'b'
let comparePathNodes = [];
let compareClearTimer = null;

// ── EVO fun facts (from old evoPath.js) ──
const EVO_FUN_FACTS = [
  {min:3500, en:'Your common ancestor lived before Earth had free oxygen — it breathed a completely alien atmosphere.',
             he:'האב הקדמון חי לפני שהיה חמצן חופשי באטמוספרה.',
             ru:'Общий предок жил до появления свободного кислорода на Земле.'},
  {min:2000, en:'When these lineages split, all life on Earth was single-celled. Multicellular life was still a billion years away.',
             he:'כשהשושלות האלה נפרדו, כל החיים היו חד-תאיים.',
             ru:'Когда эти линии разошлись, вся жизнь была одноклеточной.'},
  {min:541,  en:'These species diverged before the Cambrian Explosion — before most animal body plans even existed.',
             he:'המינים נפרדו לפני הפיצוץ הקמברי.',
             ru:'Эти виды разошлись до Кембрийского взрыва.'},
  {min:252,  en:'This split happened before the Great Dying — the worst mass extinction ever, which wiped out 96% of marine species.',
             he:'הפיצול קרה לפני הכחדה הגדולה — שחיסלה 96% מהמינים הימיים.',
             ru:'Это разделение произошло до Великого вымирания — 96% морских видов погибли.'},
  {min:66,   en:'Dinosaurs were still roaming the Earth when these lineages parted ways.',
             he:'דינוזאורים עדיין שלטו בארץ כשהשושלות האלה נפרדו.',
             ru:'Динозавры ещё бродили по Земле, когда эти линии разошлись.'},
  {min:7,    en:'These lineages diverged when our ancestors first stood upright on the African savanna.',
             he:'השושלות נפרדו כשאבותינו התחילו ללכת זקופים.',
             ru:'Эти линии разошлись, когда наши предки впервые встали на ноги.'},
  {min:0,    en:'A relatively recent split in the grand story of life — you share more DNA than you might think!',
             he:'פיצול חדש יחסית — אתם חולקים יותר DNA ממה שחשבתם!',
             ru:'Относительно недавнее разделение — у вас больше общей ДНК, чем вы думаете!'},
];

function getEvoFunFact(mya, lang) {
  for (const f of EVO_FUN_FACTS) { if (mya >= f.min) return f[lang] || f.en; }
  return EVO_FUN_FACTS[EVO_FUN_FACTS.length - 1].en;
}

// ── Animate counter ──
function animateCounter(el, target) {
  const duration = 800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (target * eased);
    el.textContent = current.toFixed(1);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Fill slot helper ──
function fillSlot(slot, node) {
  const icon = node.icon || '🧬';
  const photoUrl = PHOTO_MAP[node.id] ? PHOTO_MAP[node.id].url : null;
  const iconEl = document.getElementById('compare-icon-' + slot);
  const labelEl = document.getElementById('compare-label-' + slot);
  const btnEl = document.getElementById('compare-slot-' + slot);

  if (photoUrl) {
    iconEl.innerHTML = '<img class="compare-slot-photo" src="' + photoUrl + '" alt="' + (node.name || '') + '" onerror="this.replaceWith(document.createTextNode(\'' + icon + '\'))">';
  } else {
    iconEl.textContent = icon;
  }
  if (labelEl) labelEl.textContent = node.name;
  if (btnEl) btnEl.classList.add('filled');
}

// ── Open / Close ──
export function openCompare() {
  state._panelTriggerFocus = document.activeElement;
  slotA = null;
  slotB = null;
  searchTarget = null;
  comparePathNodes = [];
  resetCompareUI();
  const panel = document.getElementById('species-compare-panel');
  if (!panel) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  setTimeout(() => { const first = panel.querySelector('button, input'); if (first) first.focus(); }, 100);

  // Build presets
  const presetsEl = document.getElementById('compare-presets');
  if (presetsEl) {
    const presets = [
      { label: 'Humans &amp; Chimps',   a: 'h_sapiens', b: 'chimpanzee' },
      { label: 'You &amp; a Banana',    a: 'h_sapiens', b: 'angiosperms' },
      { label: 'You &amp; a Mushroom',  a: 'h_sapiens', b: 'fungi' },
      { label: 'Shark &amp; a Tree',    a: 'shark',      b: 'angiosperms' },
      { label: 'Octopus &amp; Ant',     a: 'octopus',   b: 'insects' },
      { label: 'You &amp; Bacteria',    a: 'h_sapiens', b: 'bacteria' },
    ];
    presetsEl.innerHTML = presets.map(p =>
      '<button class="compare-preset" onclick="comparePreset(\'' + p.a + '\',\'' + p.b + '\')">' + p.label + '</button>'
    ).join('');
  }
}

export function closeCompare() {
  const panel = document.getElementById('species-compare-panel');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  const overlay = document.getElementById('compare-search-overlay');
  if (overlay) overlay.style.display = 'none';
  a11yAnnounce('Species compare closed');
  if (state._panelTriggerFocus) {
    if (state._panelTriggerFocus.isConnected) state._panelTriggerFocus.focus();
    else if (state.focusedNodeId) {
      const g = document.querySelector('.node-group[data-node-id="' + state.focusedNodeId + '"]');
      if (g) g.focus();
    }
    state._panelTriggerFocus = null;
  }
}

function resetCompareUI() {
  const selectText = 'Select a species';
  const iconA = document.getElementById('compare-icon-a');
  const iconB = document.getElementById('compare-icon-b');
  const labelA = document.getElementById('compare-label-a');
  const labelB = document.getElementById('compare-label-b');
  const slotAEl = document.getElementById('compare-slot-a');
  const slotBEl = document.getElementById('compare-slot-b');
  const resultsEl = document.getElementById('compare-results');
  const overlay = document.getElementById('compare-search-overlay');
  const showTreeBtn = document.getElementById('compare-show-tree');

  if (iconA) iconA.textContent = '?';
  if (iconB) iconB.textContent = '?';
  if (labelA) labelA.textContent = selectText;
  if (labelB) labelB.textContent = selectText;
  if (slotAEl) slotAEl.classList.remove('filled');
  if (slotBEl) slotBEl.classList.remove('filled');
  if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.innerHTML = ''; }
  if (overlay) overlay.style.display = 'none';
  if (showTreeBtn) showTreeBtn.style.display = 'none';
}

// ── Search overlay ──
export function openCompareSearch(slot) {
  searchTarget = slot;
  const overlay = document.getElementById('compare-search-overlay');
  if (!overlay) return;
  overlay.style.display = 'block';
  const input = document.getElementById('compare-search-input');
  if (input) {
    input.value = '';
    input.placeholder = t('dna_search_placeholder') || 'Search species...';
    input.focus();
  }
  const results = document.getElementById('compare-search-results');
  if (results) results.innerHTML = '';
}

// ── Select species into slot ──
export function selectCompareSpecies(id) {
  const node = nodeMap[id];
  if (!node) return;

  if (searchTarget === 'a') {
    slotA = { id: node.id, name: node.name, icon: node.icon };
    fillSlot('a', node);
  } else {
    slotB = { id: node.id, name: node.name, icon: node.icon };
    fillSlot('b', node);
  }

  const overlay = document.getElementById('compare-search-overlay');
  if (overlay) overlay.style.display = 'none';

  if (slotA && slotB) computeCompare();
}

// ── Presets ──
export function comparePreset(idA, idB) {
  const nodeA = nodeMap[idA];
  const nodeB = nodeMap[idB];
  if (!nodeA || !nodeB) return;
  slotA = { id: nodeA.id, name: nodeA.name, icon: nodeA.icon };
  slotB = { id: nodeB.id, name: nodeB.name, icon: nodeB.icon };
  fillSlot('a', nodeA);
  fillSlot('b', nodeB);
  const overlay = document.getElementById('compare-search-overlay');
  if (overlay) overlay.style.display = 'none';
  computeCompare();
}

// ── Dice / random pair ──
export function compareDice() {
  const nodeA = getRandomSpecies(nodeMap);
  const nodeB = getRandomSpecies(nodeMap);
  if (!nodeA || !nodeB) return;
  slotA = { id: nodeA.id, name: nodeA.name, icon: nodeA.icon };
  slotB = { id: nodeB.id, name: nodeB.name, icon: nodeB.icon };
  fillSlot('a', nodeA);
  fillSlot('b', nodeB);
  const overlay = document.getElementById('compare-search-overlay');
  if (overlay) overlay.style.display = 'none';
  computeCompare();
}

// ── Main computation ──
export function computeCompare() {
  if (!slotA || !slotB) return;
  const nodeA = nodeMap[slotA.id];
  const nodeB = nodeMap[slotB.id];
  if (!nodeA || !nodeB) return;

  trackDnaCompare();

  // ── DNA similarity ──
  const dnaResult = estimateDnaSimilarity(nodeA, nodeB);

  // ── Evolutionary path ──
  const lca = dnaResult ? dnaResult.lca : findLCA(nodeA, nodeB);
  if (!lca) return;

  const pathA = []; let cur = nodeA;
  while (cur && cur.id !== lca.id) { pathA.push(cur); cur = cur._parent; }
  pathA.push(lca);
  const pathB = []; cur = nodeB;
  while (cur && cur.id !== lca.id) { pathB.push(cur); cur = cur._parent; }

  comparePathNodes = pathA.concat(pathB.reverse());
  state.evoPathSet = new Set(comparePathNodes.map(n => n.id));
  state.evoPathEdgeSet = new Set();
  for (let i = 0; i < pathA.length - 1; i++) state.evoPathEdgeSet.add(pathA[i + 1].id + '|' + pathA[i].id);
  for (let i = 0; i < pathB.length - 1; i++) state.evoPathEdgeSet.add(pathB[i].id + '|' + pathB[i + 1].id);
  if (pathB.length > 0) state.evoPathEdgeSet.add(lca.id + '|' + pathB[0].id);

  const mya = lca.appeared || 0;
  const divText = mya >= 1000 ? (mya / 1000).toFixed(1) + ' Ga' : mya + ' Ma';
  const lang = state.currentLang || 'en';

  // ── Build results HTML ──
  const resultsEl = document.getElementById('compare-results');
  if (!resultsEl) return;

  let html = '';

  // DNA section
  if (dnaResult) {
    const pct = dnaResult.percent;
    const methodClass = dnaResult.method === 'known' ? 'known' : dnaResult.method === 'identical' ? 'identical' : 'estimated';
    const methodLabel = dnaResult.method === 'known'
      ? (t('dna_method_known') || 'Published data')
      : dnaResult.method === 'identical'
        ? 'Identical'
        : (t('dna_method_estimated') || 'Estimated from phylogeny');

    const barPct = Math.min(100, Math.max(2, pct));
    const sourceHtml = (dnaResult.method === 'known' && dnaResult.source)
      ? '<div class="compare-source">Source: ' + dnaResult.source + '</div>'
      : '';
    const noteHtml = dnaResult.note
      ? '<div class="compare-note">' + dnaResult.note + '</div>'
      : '';

    html += '<div class="compare-dna-section">';
    html += '<div class="compare-dna-pct-row">';
    html += '<span class="compare-dna-pct" id="compare-pct-num">0</span><span class="compare-dna-pct-sign">%</span>';
    html += '</div>';
    html += '<div class="compare-dna-label" id="i-dna-similarity-label">DNA Similarity</div>';
    html += '<div class="compare-bar-wrapper"><div class="compare-bar-track"><div class="compare-bar-fill" id="compare-bar-fill" style="width:0%"></div></div></div>';
    html += '<div class="compare-dna-meta">';
    html += '<span class="compare-method-badge ' + methodClass + '">' + methodLabel + '</span>';
    html += sourceHtml;
    html += '</div>';
    html += noteHtml;
    html += '</div>';
  }

  // Divergence + Scale of Time
  html += '<div class="compare-divtime">';
  html += '<div class="compare-divtime-value">' + divText + '</div>';
  html += '<div class="compare-divtime-label">Diverged</div>';
  const timeCtx = getTimeContext(mya, lca.id || 'lca');
  if (timeCtx) html += '<div class="compare-scale-time">' + timeCtx.text + '</div>';
  html += '</div>';

  // Timeline bar
  const pct2 = Math.min(100, Math.max(2, (1 - mya / 4600) * 100));
  html += '<div class="compare-timeline">';
  html += '<div class="compare-timeline-bar"><div class="compare-timeline-marker" style="left:' + pct2 + '%"></div></div>';
  html += '<div class="compare-timeline-labels"><span>4.6 Ga</span><span>\u2190 ' + divText + '</span><span>Now</span></div>';
  html += '</div>';

  // Evo path chain
  const steps = comparePathNodes.length;
  html += '<div class="compare-narrative"><strong>' + nodeA.name + '</strong> \u2192 ' + steps + ' steps \u2192 <strong>' + nodeB.name + '</strong></div>';
  html += '<div class="compare-chain" id="compare-chain">';
  html += comparePathNodes.map((n, i) => {
    const isLca = n.id === lca.id;
    const icon = n.icon || '🧬';
    const photoUrl = PHOTO_MAP[n.id] ? PHOTO_MAP[n.id].url : null;
    const shortName = n.name.length > 10 ? n.name.slice(0, 9) + '\u2026' : n.name;
    const photoHtml = photoUrl
      ? '<img class="compare-chain-photo" src="' + photoUrl + '" alt="' + (n.name || '') + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
        '<span class="compare-chain-emoji" style="display:none;width:32px;height:32px;font-size:18px;border:none;position:static;background:var(--surface-raised);border-radius:50%">' + icon + '</span>'
      : '<span style="font-size:22px;line-height:32px;">' + icon + '</span>';
    return (i > 0 ? '<span class="compare-chain-sep">\u203a</span>' : '') +
      '<div class="compare-chain-node' + (isLca ? ' lca' : '') + '" style="--i:' + i + '" onclick="closeCompare();navigateTo(\'' + n.id + '\')" title="' + n.name + '">' +
        (isLca ? '<span class="compare-chain-lca-label">' + (t('evo_ancestor') || 'Ancestor') + '</span>' : '') +
        photoHtml +
        '<span class="compare-chain-node-name">' + shortName + '</span></div>';
  }).join('');
  html += '</div>';

  // Shared ancestor card
  const lcaPhoto = PHOTO_MAP[lca.id] ? PHOTO_MAP[lca.id].url : '';
  html += '<div class="compare-ancestor-card">';
  if (lcaPhoto) html += '<img class="compare-ancestor-photo" src="' + lcaPhoto + '" alt="' + lca.name + '" onerror="this.style.display=\'none\'">';
  html += '<div class="compare-ancestor-info">';
  html += '<div class="compare-ancestor-title">' + (t('evo_ancestor') || 'Shared Ancestor') + '</div>';
  html += '<div class="compare-ancestor-name">' + lca.icon + ' ' + lca.name + '</div>';
  html += '<div class="compare-ancestor-era">' + (lca.era || '') + ' \u00b7 ' + (lca.appeared || 0) + ' Ma</div>';
  html += '<div class="compare-ancestor-desc">' + (lca.desc || '') + '</div>';
  html += '</div></div>';

  // Fun fact
  const funFact = dnaResult
    ? (dnaResult.note || getDnaFunFact(dnaResult.percent, slotB.name))
    : getEvoFunFact(mya, lang);
  html += '<div class="compare-fun-fact"><span class="compare-fun-fact-icon">\ud83d\udca1</span><span class="compare-fun-fact-text">' + funFact + '</span></div>';

  resultsEl.innerHTML = html;
  resultsEl.style.display = 'block';

  // Animate DNA bar + counter
  if (dnaResult) {
    const pctEl = document.getElementById('compare-pct-num');
    if (pctEl) animateCounter(pctEl, dnaResult.percent);
    setTimeout(() => {
      const bar = document.getElementById('compare-bar-fill');
      if (bar) bar.style.width = Math.min(100, Math.max(2, dnaResult.percent)) + '%';
    }, 100);
  }

  // Show "Show on Tree" button
  const showTreeBtn = document.getElementById('compare-show-tree');
  if (showTreeBtn) showTreeBtn.style.display = '';
}

// ── Show on Tree ──
export function showCompareOnTree() {
  closeCompare();
  state.evoPathActive = true;
  comparePathNodes.forEach(n => {
    let c = n;
    while (c) { if (c._collapsed) c._collapsed = false; c = c._parent; }
  });
  if (_deps._layout) _deps._layout();
  else if (_deps.layout) _deps.layout();
  if (_deps.scheduleRender) _deps.scheduleRender(true);

  if (comparePathNodes.length > 0) {
    const xs = comparePathNodes.map(n => n._x), ys = comparePathNodes.map(n => n._y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const pathW = Math.max(...xs) - Math.min(...xs) || 200;
    const pathH = Math.max(...ys) - Math.min(...ys) || 200;
    const scale = Math.min(2, Math.max(0.3, Math.min(
      (window.innerWidth * 0.7) / pathW,
      (window.innerHeight * 0.7) / pathH
    )));
    const viewport = document.getElementById('viewport');
    if (viewport) viewport.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
    state.transform.s = scale;
    state.transform.x = window.innerWidth / 2 - cx * scale;
    state.transform.y = window.innerHeight / 2 - cy * scale;
    if (_deps.applyT) _deps.applyT();
    setTimeout(() => { if (viewport) viewport.style.transition = ''; }, 750);
  }

  const clearBtn = document.getElementById('compare-clear-overlay');
  if (clearBtn) clearBtn.style.display = '';
  if (compareClearTimer) clearTimeout(compareClearTimer);
  compareClearTimer = setTimeout(clearCompareHighlight, 15000);
}

// ── Clear highlight ──
export function clearCompareHighlight() {
  state.evoPathActive = false;
  state.evoPathSet = new Set();
  state.evoPathEdgeSet = new Set();
  const clearBtn = document.getElementById('compare-clear-overlay');
  if (clearBtn) clearBtn.style.display = 'none';
  if (compareClearTimer) { clearTimeout(compareClearTimer); compareClearTimer = null; }
  if (_deps.scheduleRender) _deps.scheduleRender(true);
}

// ── Event listeners ──
export function initCompareEvents() {
  const searchInput = document.getElementById('compare-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const q = this.value.trim();
      const container = document.getElementById('compare-search-results');
      if (!container) return;
      if (q.length < 1) { container.innerHTML = ''; return; }
      const matches = (_deps.searchEntities ? _deps.searchEntities(q) : []).slice(0, 12);
      container.innerHTML = matches.map(m => {
        const node = nodeMap[m.id];
        if (!node) return '';
        const icon = node.icon || m.icon || '🧬';
        const name = m.name || node.name || m.id;
        const latin = m.latin || node.latin || '';
        return '<div class="compare-search-item" onclick="selectCompareSpecies(\'' + m.id + '\')">' +
          '<span class="compare-search-item-icon">' + icon + '</span>' +
          '<span class="compare-search-item-name">' + name + '</span>' +
          '<span class="compare-search-item-latin">' + latin + '</span></div>';
      }).join('');
    });
  }

  // Close on backdrop click
  const panel = document.getElementById('species-compare-panel');
  if (panel) {
    panel.addEventListener('click', function(e) {
      if (e.target === this) closeCompare();
    });
  }
}
