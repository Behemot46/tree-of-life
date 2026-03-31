// ══════════════════════════════════════════════════════
// EVO PATH — evolutionary path finder
// ══════════════════════════════════════════════════════

import { state, nodeMap, HUMAN_PATH } from './state.js';
import { a11yAnnounce } from './engagement.js';

// ── Late-binding deps (set via initEvoPathDeps) ──
let _searchEntities, _t, _scheduleRender, _smoothPanTo, _layout, _applyT;
export function initEvoPathDeps(deps) {
  _searchEntities = deps.searchEntities;
  _t = deps.t;
  _scheduleRender = deps.scheduleRender;
  _smoothPanTo = deps.smoothPanTo;
  _layout = deps.layout;
  _applyT = deps.applyT;
}
function t(key) { return _t ? _t(key) : key; }

// Uses globals: PHOTO_MAP, ImageLoader, FACTS, findLCA

// ── Module state ──
let evoSlotA = null, evoSlotB = null;
let evoSearchTarget = null;
let evoPathNodes = [];
let evoClearTimer = null;

const EVO_FUN_FACTS = [
  {min:3500, en:'Your common ancestor lived before Earth had free oxygen \u2014 it breathed a completely alien atmosphere.',
             he:'\u05d4\u05d0\u05d1 \u05d4\u05e7\u05d3\u05de\u05d5\u05df \u05d7\u05d9 \u05dc\u05e4\u05e0\u05d9 \u05e9\u05d4\u05d9\u05d4 \u05d7\u05de\u05e6\u05df \u05d7\u05d5\u05e4\u05e9\u05d9 \u05d1\u05d0\u05d8\u05de\u05d5\u05e1\u05e4\u05e8\u05d4.',
             ru:'\u041e\u0431\u0449\u0438\u0439 \u043f\u0440\u0435\u0434\u043e\u043a \u0436\u0438\u043b \u0434\u043e \u043f\u043e\u044f\u0432\u043b\u0435\u043d\u0438\u044f \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u043e\u0433\u043e \u043a\u0438\u0441\u043b\u043e\u0440\u043e\u0434\u0430 \u043d\u0430 \u0417\u0435\u043c\u043b\u0435.'},
  {min:2000, en:'When these lineages split, all life on Earth was single-celled. Multicellular life was still a billion years away.',
             he:'\u05db\u05e9\u05d4\u05e9\u05d5\u05e9\u05dc\u05d5\u05ea \u05d4\u05d0\u05dc\u05d4 \u05e0\u05e4\u05e8\u05d3\u05d5, \u05db\u05dc \u05d4\u05d7\u05d9\u05d9\u05dd \u05d4\u05d9\u05d5 \u05d7\u05d3-\u05ea\u05d0\u05d9\u05d9\u05dd.',
             ru:'\u041a\u043e\u0433\u0434\u0430 \u044d\u0442\u0438 \u043b\u0438\u043d\u0438\u0438 \u0440\u0430\u0437\u043e\u0448\u043b\u0438\u0441\u044c, \u0432\u0441\u044f \u0436\u0438\u0437\u043d\u044c \u0431\u044b\u043b\u0430 \u043e\u0434\u043d\u043e\u043a\u043b\u0435\u0442\u043e\u0447\u043d\u043e\u0439.'},
  {min:541,  en:'These species diverged before the Cambrian Explosion \u2014 before most animal body plans even existed.',
             he:'\u05d4\u05de\u05d9\u05e0\u05d9\u05dd \u05e0\u05e4\u05e8\u05d3\u05d5 \u05dc\u05e4\u05e0\u05d9 \u05d4\u05d4\u05ea\u05e4\u05d5\u05e6\u05e6\u05d5\u05ea \u05d4\u05e7\u05de\u05d1\u05e8\u05d9\u05ea.',
             ru:'\u042d\u0442\u0438 \u0432\u0438\u0434\u044b \u0440\u0430\u0437\u043e\u0448\u043b\u0438\u0441\u044c \u0434\u043e \u041a\u0435\u043c\u0431\u0440\u0438\u0439\u0441\u043a\u043e\u0433\u043e \u0432\u0437\u0440\u044b\u0432\u0430.'},
  {min:252,  en:'This split happened before the Great Dying \u2014 the worst mass extinction ever, which wiped out 96% of marine species.',
             he:'\u05d4\u05e4\u05d9\u05e6\u05d5\u05dc \u05e7\u05e8\u05d4 \u05dc\u05e4\u05e0\u05d9 \u05d4\u05db\u05d7\u05d3\u05d4 \u05d4\u05d2\u05d3\u05d5\u05dc\u05d4 \u2014 \u05e9\u05d7\u05d9\u05e1\u05dc\u05d4 96% \u05de\u05d4\u05de\u05d9\u05e0\u05d9\u05dd \u05d4\u05d9\u05de\u05d9\u05d9\u05dd.',
             ru:'\u042d\u0442\u043e \u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u043f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u043e \u0434\u043e \u0412\u0435\u043b\u0438\u043a\u043e\u0433\u043e \u0432\u044b\u043c\u0438\u0440\u0430\u043d\u0438\u044f \u2014 96% \u043c\u043e\u0440\u0441\u043a\u0438\u0445 \u0432\u0438\u0434\u043e\u0432 \u043f\u043e\u0433\u0438\u0431\u043b\u0438.'},
  {min:66,   en:'Dinosaurs were still roaming the Earth when these lineages parted ways.',
             he:'\u05d3\u05d9\u05e0\u05d5\u05d6\u05d0\u05d5\u05e8\u05d9\u05dd \u05e2\u05d3\u05d9\u05d9\u05df \u05e9\u05dc\u05d8\u05d5 \u05d1\u05d0\u05e8\u05e5 \u05db\u05e9\u05d4\u05e9\u05d5\u05e9\u05dc\u05d5\u05ea \u05d4\u05d0\u05dc\u05d4 \u05e0\u05e4\u05e8\u05d3\u05d5.',
             ru:'\u0414\u0438\u043d\u043e\u0437\u0430\u0432\u0440\u044b \u0435\u0449\u0451 \u0431\u0440\u043e\u0434\u0438\u043b\u0438 \u043f\u043e \u0417\u0435\u043c\u043b\u0435, \u043a\u043e\u0433\u0434\u0430 \u044d\u0442\u0438 \u043b\u0438\u043d\u0438\u0438 \u0440\u0430\u0437\u043e\u0448\u043b\u0438\u0441\u044c.'},
  {min:7,    en:'These lineages diverged when our ancestors first stood upright on the African savanna.',
             he:'\u05d4\u05e9\u05d5\u05e9\u05dc\u05d5\u05ea \u05e0\u05e4\u05e8\u05d3\u05d5 \u05db\u05e9\u05d0\u05d1\u05d5\u05ea\u05d9\u05e0\u05d5 \u05d4\u05ea\u05d7\u05d9\u05dc\u05d5 \u05dc\u05dc\u05db\u05ea \u05d6\u05e7\u05d5\u05e4\u05d9\u05dd.',
             ru:'\u042d\u0442\u0438 \u043b\u0438\u043d\u0438\u0438 \u0440\u0430\u0437\u043e\u0448\u043b\u0438\u0441\u044c, \u043a\u043e\u0433\u0434\u0430 \u043d\u0430\u0448\u0438 \u043f\u0440\u0435\u0434\u043a\u0438 \u0432\u043f\u0435\u0440\u0432\u044b\u0435 \u0432\u0441\u0442\u0430\u043b\u0438 \u043d\u0430 \u043d\u043e\u0433\u0438.'},
  {min:0,    en:'A relatively recent split in the grand story of life \u2014 you share more DNA than you might think!',
             he:'\u05e4\u05d9\u05e6\u05d5\u05dc \u05d7\u05d3\u05e9 \u05d9\u05d7\u05e1\u05d9\u05ea \u2014 \u05d0\u05ea\u05dd \u05d7\u05d5\u05dc\u05e7\u05d9\u05dd \u05d9\u05d5\u05ea\u05e8 DNA \u05de\u05de\u05d4 \u05e9\u05d7\u05e9\u05d1\u05ea\u05dd!',
             ru:'\u041e\u0442\u043d\u043e\u0441\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u043d\u0435\u0434\u0430\u0432\u043d\u0435\u0435 \u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u2014 \u0443 \u0432\u0430\u0441 \u0431\u043e\u043b\u044c\u0448\u0435 \u043e\u0431\u0449\u0435\u0439 \u0414\u041d\u041a, \u0447\u0435\u043c \u0432\u044b \u0434\u0443\u043c\u0430\u0435\u0442\u0435!'},
];

export function getEvoFunFact(mya, lang) {
  for (const f of EVO_FUN_FACTS) { if (mya >= f.min) return f[lang] || f.en; }
  return EVO_FUN_FACTS[EVO_FUN_FACTS.length - 1].en;
}

export function openEvoPath() {
  state._panelTriggerFocus = document.activeElement;
  const panel = document.getElementById('evo-path-panel');
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');
  setTimeout(()=>{const first=panel.querySelector('button, input');if(first)first.focus();},100);
}

export function closeEvoPath() {
  document.getElementById('evo-path-panel').classList.remove('open');
  document.getElementById('evo-path-panel').setAttribute('aria-hidden','true');
  document.getElementById('evo-search-overlay').style.display = 'none';
  a11yAnnounce('Evolutionary path closed');
  if(state._panelTriggerFocus){
    if(state._panelTriggerFocus.isConnected) state._panelTriggerFocus.focus();
    else if(state.focusedNodeId){
      const g=document.querySelector('.node-group[data-node-id="'+state.focusedNodeId+'"]');
      if(g) g.focus();
    }
    state._panelTriggerFocus=null;
  }
}

export function openEvoSearch(slot) {
  evoSearchTarget = slot;
  document.getElementById('evo-search-overlay').style.display = 'block';
  const input = document.getElementById('evo-search-input');
  input.value = ''; input.focus();
  document.getElementById('evo-search-results').innerHTML = '';
}

export function fillEvoSlot(slot, node) {
  const icon = node.icon || '\ud83e\uddec';
  const photoUrl = PHOTO_MAP[node.id] ? PHOTO_MAP[node.id].url : null;
  const iconEl = document.getElementById('evo-icon-' + slot);
  if (photoUrl) {
    iconEl.innerHTML = '<img class="evo-slot-photo" src="' + photoUrl + '" alt="' + (node.name||'') + '" onerror="this.replaceWith(document.createTextNode(\'' + icon + '\'))">';
  } else { iconEl.textContent = icon; }
  document.getElementById('evo-label-' + slot).textContent = node.name;
  document.getElementById('evo-slot-' + slot).classList.add('filled');
}

export function selectEvoSpecies(id) {
  const node = nodeMap[id];
  if (!node) return;
  if (evoSearchTarget === 'a') { evoSlotA = node; fillEvoSlot('a', node); }
  else { evoSlotB = node; fillEvoSlot('b', node); }
  document.getElementById('evo-search-overlay').style.display = 'none';
  if (evoSlotA && evoSlotB) computeEvoPath();
}

export function evoPreset(idA, idB) {
  evoSlotA = nodeMap[idA]; evoSlotB = nodeMap[idB];
  if (!evoSlotA || !evoSlotB) return;
  fillEvoSlot('a', evoSlotA); fillEvoSlot('b', evoSlotB);
  document.getElementById('evo-search-overlay').style.display = 'none';
  computeEvoPath();
}

export function computeEvoPath() {
  if (!evoSlotA || !evoSlotB) return;
  const lca = findLCA(evoSlotA, evoSlotB);
  if (!lca) return;

  const pathA = []; let cur = evoSlotA;
  while (cur && cur.id !== lca.id) { pathA.push(cur); cur = cur._parent; }
  pathA.push(lca);
  const pathB = []; cur = evoSlotB;
  while (cur && cur.id !== lca.id) { pathB.push(cur); cur = cur._parent; }

  evoPathNodes = pathA.concat(pathB.reverse());
  state.evoPathSet = new Set(evoPathNodes.map(n => n.id));
  state.evoPathEdgeSet = new Set();
  for (let i = 0; i < pathA.length - 1; i++) state.evoPathEdgeSet.add(pathA[i+1].id + '|' + pathA[i].id);
  for (let i = 0; i < pathB.length - 1; i++) state.evoPathEdgeSet.add(pathB[i].id + '|' + pathB[i+1].id);
  if (pathB.length > 0) state.evoPathEdgeSet.add(lca.id + '|' + pathB[0].id);

  const mya = lca.appeared || 0;
  const divText = mya >= 1000 ? (mya / 1000).toFixed(1) + ' Ga' : mya + ' Ma';
  document.getElementById('evo-div-value').textContent = divText;

  const lang = state.currentLang || 'en';
  const steps = evoPathNodes.length;
  const tmpl = t('evo_narrative') || 'Your journey passes through {n} ancestors';
  document.getElementById('evo-narrative').innerHTML = tmpl.includes('{n}')
    ? tmpl.replace('{n}', '<strong>' + steps + '</strong>')
    : '<strong>' + evoSlotA.name + '</strong> \u2192 ' + steps + ' steps \u2192 <strong>' + evoSlotB.name + '</strong>';

  const chainEl = document.getElementById('evo-chain');
  chainEl.innerHTML = evoPathNodes.map((n, i) => {
    const isLca = n.id === lca.id;
    const icon = n.icon || '\ud83e\uddec';
    const photoUrl = PHOTO_MAP[n.id] ? PHOTO_MAP[n.id].url : null;
    const shortName = n.name.length > 10 ? n.name.slice(0, 9) + '\u2026' : n.name;
    const photoHtml = photoUrl
      ? '<img class="evo-chain-photo" src="' + photoUrl + '" alt="' + (n.name||'') + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
        '<span class="evo-chain-emoji" style="display:none;width:32px;height:32px;font-size:18px;border:none;position:static;background:var(--surface-raised);border-radius:50%">' + icon + '</span>'
      : '<span style="font-size:22px;line-height:32px;">' + icon + '</span>';
    return (i > 0 ? '<span class="evo-chain-sep">\u203a</span>' : '') +
      '<div class="evo-chain-node' + (isLca ? ' lca' : '') + '" style="--i:' + i + '" onclick="closeEvoPath();navigateTo(\'' + n.id + '\')" title="' + n.name + '">' +
        (isLca ? '<span class="evo-chain-lca-label">' + t('evo_ancestor') + '</span>' : '') +
        photoHtml + '<span class="evo-chain-emoji">' + icon + '</span>' +
        '<span class="evo-chain-node-name">' + shortName + '</span></div>';
  }).join('');

  const pct = Math.min(100, Math.max(2, (1 - mya / 4600) * 100));
  document.getElementById('evo-timeline').innerHTML =
    '<div class="evo-timeline-bar"><div class="evo-timeline-marker" style="left:' + pct + '%"></div></div>' +
    '<div class="evo-timeline-labels"><span>4.6 Ga</span><span>\u2190 ' + divText + '</span><span>Now</span></div>';

  const card = document.getElementById('evo-ancestor-card');
  const lcaPhoto = PHOTO_MAP[lca.id] ? PHOTO_MAP[lca.id].url : '';
  card.innerHTML =
    (lcaPhoto ? '<img class="evo-ancestor-photo" src="' + lcaPhoto + '" alt="' + lca.name + '" onerror="this.style.display=\'none\'">' : '') +
    '<div class="evo-ancestor-info"><div class="evo-ancestor-title">' + t('evo_ancestor') + '</div>' +
    '<div class="evo-ancestor-name">' + lca.icon + ' ' + lca.name + '</div>' +
    '<div class="evo-ancestor-era">' + (lca.era || '') + ' \u00b7 ' + (lca.appeared || 0) + ' Ma</div>' +
    '<div class="evo-ancestor-desc">' + (lca.desc || '') + '</div></div>';

  document.getElementById('evo-fun-fact').innerHTML =
    '<span class="evo-fun-fact-icon">\ud83d\udca1</span><span class="evo-fun-fact-text">' + getEvoFunFact(mya, lang) + '</span>';

  document.getElementById('evo-results').style.display = 'block';
}

export function showEvoOnTree() {
  closeEvoPath();
  state.evoPathActive = true;
  evoPathNodes.forEach(n => { let c = n; while (c) { if (c._collapsed) c._collapsed = false; c = c._parent; } });
  _layout(); _scheduleRender(true);

  if (evoPathNodes.length > 0) {
    const xs = evoPathNodes.map(n => n._x), ys = evoPathNodes.map(n => n._y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const pathW = Math.max(...xs) - Math.min(...xs) || 200, pathH = Math.max(...ys) - Math.min(...ys) || 200;
    const scale = Math.min(2, Math.max(0.3, Math.min((window.innerWidth * 0.7) / pathW, (window.innerHeight * 0.7) / pathH)));
    const viewport = document.getElementById('viewport');
    viewport.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
    state.transform.s = scale; state.transform.x = window.innerWidth / 2 - cx * scale; state.transform.y = window.innerHeight / 2 - cy * scale;
    _applyT();
    setTimeout(() => { viewport.style.transition = ''; }, 750);
  }

  document.getElementById('evo-clear-overlay').classList.add('show');
  if (evoClearTimer) clearTimeout(evoClearTimer);
  evoClearTimer = setTimeout(clearEvoHighlight, 15000);
}

export function clearEvoPath() {
  state.evoPathSet = new Set(); state.evoPathEdgeSet = new Set(); evoPathNodes = [];
  evoSlotA = null; evoSlotB = null; state.evoPathActive = false;
  document.getElementById('evo-icon-a').textContent = '?';
  document.getElementById('evo-label-a').textContent = t('evo_select');
  document.getElementById('evo-slot-a').classList.remove('filled');
  document.getElementById('evo-icon-b').textContent = '?';
  document.getElementById('evo-label-b').textContent = t('evo_select');
  document.getElementById('evo-slot-b').classList.remove('filled');
  document.getElementById('evo-results').style.display = 'none';
  document.getElementById('evo-search-overlay').style.display = 'none';
  document.getElementById('evo-clear-overlay').classList.remove('show');
  if (evoClearTimer) { clearTimeout(evoClearTimer); evoClearTimer = null; }
  _scheduleRender(true);
}

export function clearEvoHighlight() {
  state.evoPathActive = false; state.evoPathSet = new Set(); state.evoPathEdgeSet = new Set();
  document.getElementById('evo-clear-overlay').classList.remove('show');
  if (evoClearTimer) { clearTimeout(evoClearTimer); evoClearTimer = null; }
  _scheduleRender(true);
}

// ── Event listener setup (call after DOM ready) ──
export function initEvoPathEvents() {
  document.getElementById('evo-search-input').addEventListener('input', function() {
    const q = this.value.trim();
    const container = document.getElementById('evo-search-results');
    if (!q) { container.innerHTML = ''; return; }
    const matches = _searchEntities(q).slice(0, 12);
    container.innerHTML = matches.map(m => {
      const node = nodeMap[m.id];
      if (!node) return '';
      return '<div class="evo-search-item" onclick="selectEvoSpecies(\'' + m.id + '\')">' +
        '<span class="evo-search-item-icon">' + (node.icon || '\ud83e\uddec') + '</span>' +
        '<span class="evo-search-item-name">' + (node.name || m.id) + '</span>' +
        '<span class="evo-search-item-latin">' + (node.latin || '') + '</span></div>';
    }).join('');
  });

  // Close evo panel on backdrop click
  document.getElementById('evo-path-panel').addEventListener('click', function(e) {
    if (e.target === this) closeEvoPath();
  });
}
