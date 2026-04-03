// ══════════════════════════════════════════════════════
// DNA CALC — DNA similarity calculator modal
// ══════════════════════════════════════════════════════

import { state, nodeMap } from './state.js';
import { a11yAnnounce, trackDnaCompare } from './engagement.js';
import { estimateDnaSimilarity, getDnaFunFact } from './dnaSimilarity.js';
import { ImageLoader } from './imageLoader.js';

// ── Late-binding deps (set via initDnaCalcDeps) ──
let _searchEntities, _t, _showMainPanel;
export function initDnaCalcDeps(deps) {
  _searchEntities = deps.searchEntities;
  _t = deps.t;
  _showMainPanel = deps.showMainPanel;
}
function t(key) { return _t ? _t(key) : key; }

// Uses globals: estimateDnaSimilarity, getDnaFunFact, PHOTO_MAP, ImageLoader

// ── Module state ──
let dnaSlotA = null; // { id, name, icon }
let dnaSlotB = null;
let dnaSearchTarget = null; // 'a' or 'b'

export function openDnaCalc() {
  state._panelTriggerFocus = document.activeElement;
  dnaSlotA = null;
  dnaSlotB = null;
  dnaSearchTarget = null;
  resetDnaUI();
  const panel = document.getElementById('dna-panel');
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  setTimeout(()=>{const first=panel.querySelector('button, input');if(first)first.focus();},100);
}

export function closeDnaCalc() {
  const panel = document.getElementById('dna-panel');
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  document.getElementById('dna-search-overlay').style.display = 'none';
  a11yAnnounce('DNA calculator closed');
  if(state._panelTriggerFocus){
    if(state._panelTriggerFocus.isConnected) state._panelTriggerFocus.focus();
    else if(state.focusedNodeId){
      const g=document.querySelector('.node-group[data-node-id="'+state.focusedNodeId+'"]');
      if(g) g.focus();
    }
    state._panelTriggerFocus=null;
  }
}

export function resetDnaUI() {
  const selectText = t('dna_select_species') || 'Select a species';
  document.getElementById('dna-icon-a').textContent = '?';
  document.getElementById('dna-label-a').textContent = selectText;
  document.getElementById('dna-icon-b').textContent = '?';
  document.getElementById('dna-label-b').textContent = selectText;
  document.getElementById('dna-slot-a').classList.remove('filled');
  document.getElementById('dna-slot-b').classList.remove('filled');
  document.getElementById('dna-results').style.display = 'none';
  document.getElementById('dna-search-overlay').style.display = 'none';
}

export function openDnaSearch(slot) {
  dnaSearchTarget = slot;
  const overlay = document.getElementById('dna-search-overlay');
  overlay.style.display = 'block';
  const input = document.getElementById('dna-search-input');
  input.value = '';
  input.placeholder = t('dna_search_placeholder') || 'Search species...';
  input.focus();
  document.getElementById('dna-search-results').innerHTML = '';
}

export function selectDnaSpecies(id) {
  const node = nodeMap[id];
  if (!node) return;
  const data = { id: node.id, name: node.name, icon: node.icon };
  if (dnaSearchTarget === 'a') {
    dnaSlotA = data;
    document.getElementById('dna-icon-a').textContent = data.icon;
    document.getElementById('dna-label-a').textContent = data.name;
    document.getElementById('dna-slot-a').classList.add('filled');
  } else {
    dnaSlotB = data;
    document.getElementById('dna-icon-b').textContent = data.icon;
    document.getElementById('dna-label-b').textContent = data.name;
    document.getElementById('dna-slot-b').classList.add('filled');
  }
  document.getElementById('dna-search-overlay').style.display = 'none';
  if (dnaSlotA && dnaSlotB) {
    showDnaResults();
  }
}

export function dnaPreset(idA, idB) {
  const nodeA = nodeMap[idA];
  const nodeB = nodeMap[idB];
  if (!nodeA || !nodeB) return;
  dnaSlotA = { id: nodeA.id, name: nodeA.name, icon: nodeA.icon };
  dnaSlotB = { id: nodeB.id, name: nodeB.name, icon: nodeB.icon };
  document.getElementById('dna-icon-a').textContent = nodeA.icon;
  document.getElementById('dna-label-a').textContent = nodeA.name;
  document.getElementById('dna-slot-a').classList.add('filled');
  document.getElementById('dna-icon-b').textContent = nodeB.icon;
  document.getElementById('dna-label-b').textContent = nodeB.name;
  document.getElementById('dna-slot-b').classList.add('filled');
  document.getElementById('dna-search-overlay').style.display = 'none';
  showDnaResults();
}

export function showDnaResults() {
  if (!dnaSlotA || !dnaSlotB) return;
  const nodeA = nodeMap[dnaSlotA.id];
  const nodeB = nodeMap[dnaSlotB.id];
  const result = estimateDnaSimilarity(nodeA, nodeB);
  if (!result) return;
  trackDnaCompare();

  const resultsEl = document.getElementById('dna-results');
  resultsEl.style.display = 'block';

  // Animate percentage counter
  const percentEl = document.getElementById('dna-percent');
  animateCounter(percentEl, result.percent);

  // Fill bar
  setTimeout(() => {
    document.getElementById('dna-bar-fill').style.width = result.percent + '%';
  }, 100);

  // Divergence
  const divEl = document.getElementById('dna-divergence');
  if (result.divergenceMya != null) {
    const tmpl = t('dna_divergence') || 'Diverged ~{mya} million years ago';
    divEl.textContent = tmpl.replace('{mya}', result.divergenceMya.toLocaleString());
  } else {
    divEl.textContent = '';
  }

  // Method badge
  const badge = document.getElementById('dna-method-badge');
  badge.className = 'dna-method-badge ' + result.method;
  if (result.method === 'known') {
    badge.textContent = t('dna_method_known') || 'Published data';
  } else if (result.method === 'estimated') {
    badge.textContent = t('dna_method_estimated') || 'Estimated from phylogeny';
  } else {
    badge.textContent = result.method;
  }

  // Source
  const sourceEl = document.getElementById('dna-source');
  sourceEl.textContent = result.source ? 'Source: ' + result.source : '';

  // Shared ancestor
  const ancEl = document.getElementById('dna-ancestor');
  if (result.lca) {
    const label = t('dna_shared_ancestor') || 'Shared ancestor';
    ancEl.innerHTML = label + ': <a onclick="closeDnaCalc();navigateTo(\'' + result.lca.id + '\');setTimeout(()=>showMainPanel(nodeMap[\'' + result.lca.id + '\']),300)">' + result.lca.name + '</a>';
  } else {
    ancEl.textContent = '';
  }

  // Fun fact
  const factEl = document.getElementById('dna-fun-fact');
  const fact = getDnaFunFact(result.percent, dnaSlotB.name);
  factEl.textContent = result.note || fact;
}

export function animateCounter(el, target) {
  const duration = 800;
  const start = performance.now();
  const from = 0;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = from + (target - from) * eased;
    el.textContent = current.toFixed(1);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Event listener setup (call after DOM ready) ──
export function initDnaCalcEvents() {
  document.getElementById('dna-search-input').addEventListener('input', function() {
    const q = this.value.trim();
    const container = document.getElementById('dna-search-results');
    if (q.length < 1) { container.innerHTML = ''; return; }
    const matches = _searchEntities(q).slice(0, 12);
    container.innerHTML = matches.map(m => {
      const node = nodeMap[m.id];
      const icon = node ? node.icon : m.icon || '🔬';
      const name = m.name || (node && node.name) || m.id;
      const latin = m.latin || (node && node.latin) || '';
      return `<div class="dna-search-item" onclick="selectDnaSpecies('${m.id}')">
        <span class="dna-search-item-icon">${icon}</span>
        <span class="dna-search-item-name">${name}</span>
        <span class="dna-search-item-latin">${latin}</span>
      </div>`;
    }).join('');
  });

  // Close DNA panel on backdrop click
  document.getElementById('dna-panel').addEventListener('click', function(e) {
    if (e.target === this) closeDnaCalc();
  });
}
