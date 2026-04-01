// ══════════════════════════════════════════════════════
// PANEL — species info panel rendering, hero images, branch cards
// ══════════════════════════════════════════════════════

import { state, nodeMap, navStack, HUMAN_PATH, confirmedPhotoUrls } from './state.js';
import { reducedMotion, canonicalHomininId } from './utils.js';
import { a11yAnnounce, markExplored } from './engagement.js';

// ── Late-binding deps (set via initPanelDeps) ──
let _pushNav, _updateNavButtons, _updateBreadcrumb, _scheduleRender;
let _smoothPanTo, _focusNode, _t, _generateSpeciesIllustration;
let _navBack, _layout, _applyT, _centerOnRoot;
export function initPanelDeps(deps) {
  _pushNav = deps.pushNav;
  _updateNavButtons = deps.updateNavButtons;
  _updateBreadcrumb = deps.updateBreadcrumb;
  _scheduleRender = deps.scheduleRender;
  _smoothPanTo = deps.smoothPanTo;
  _focusNode = deps.focusNode;
  _t = deps.t;
  _generateSpeciesIllustration = deps.generateSpeciesIllustration;
  _navBack = deps.navBack;
  _layout = deps.layout;
  _applyT = deps.applyT;
  _centerOnRoot = deps.centerOnRoot;
}

// ── DOM refs ──
const panel = document.getElementById('panel');
const panelAccent = document.getElementById('panel-accent');

// ── Photo cache + Wikipedia photo fetcher (module scope) ──
const _PHOTO_LS_KEY = 'tol-photo-cache';
const _PHOTO_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
(function restorePhotoCache() {
  try {
    const stored = JSON.parse(localStorage.getItem(_PHOTO_LS_KEY) || '{}');
    const now = Date.now();
    const valid = {};
    for (const [k, v] of Object.entries(stored)) {
      if (v && v.ts && (now - v.ts) < _PHOTO_TTL_MS) valid[k] = v;
    }
    window._photoCache = valid;
  } catch(e) { window._photoCache = {}; }
})();
window._failedPhotos = window._failedPhotos || new Set();

export function _savePhotoCache() {
  try { localStorage.setItem(_PHOTO_LS_KEY, JSON.stringify(window._photoCache)); } catch(e) {}
}

export async function fetchWikiPhoto(nodeId, wikiTitle, imgEl, fallbackEl, creditEl) {
  const cacheKey = nodeId;
  if (window._failedPhotos.has(cacheKey)) return;
  if (window._photoCache[cacheKey]) {
    const cached = window._photoCache[cacheKey];
    imgEl.src = cached.url;
    imgEl.classList.add('loaded');
    const hero = imgEl.closest('.panel-hero');
    if (hero) hero.classList.add('has-image');
    if (fallbackEl) fallbackEl.classList.add('hidden');
    if (creditEl && cached.credit) creditEl.textContent = cached.credit;
    return;
  }
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const thumb = data.thumbnail;
    if (thumb && thumb.source) {
      const url = thumb.source.replace(/\/\d+px-/, '/640px-');
      window._photoCache[cacheKey] = { url, credit: 'Wikipedia / Wikimedia Commons', ts: Date.now() };
      _savePhotoCache();
      imgEl.src = url;
      imgEl.classList.add('loaded');
      const hero = imgEl.closest('.panel-hero');
      if (hero) hero.classList.add('has-image');
      if (fallbackEl) fallbackEl.classList.add('hidden');
      if (creditEl) creditEl.textContent = 'Wikipedia / Wikimedia Commons';
    } else {
      throw new Error('No thumbnail');
    }
  } catch(e) {
    window._failedPhotos.add(cacheKey);
  }
}

// ── Panel helper: determine branch type ──
export function getBranchType(node) {
  if (node._hominData || node._hominin) return 'hominin';
  let n = node;
  while (n) {
    const id = n.id;
    if (id === 'hominini' || id === 'great-apes' || id === 'primates') return 'primate';
    if (id === 'mammals' || id === 'birds' || id === 'reptiles' || id === 'amphibians' ||
        id === 'fish' || id === 'cetaceans' || id === 'vertebrates') return 'animal';
    if (id === 'invertebrates' || id === 'insects' || id === 'cephalopods' ||
        id === 'cnidarians' || id === 'annelids' || id === 'echinoderms') return 'animal';
    if (id === 'animalia') return 'animal';
    if (id === 'plantae' || id === 'angiosperms' || id === 'gymnosperms' ||
        id === 'ferns' || id === 'bryophytes') return 'plant';
    if (id === 'fungi' || id === 'ascomycetes' || id === 'basidiomycetes' ||
        id === 'chytrids') return 'fungus';
    if (id === 'bacteria' || id === 'firmicutes' || id === 'proteobacteria' ||
        id === 'actinobacteria' || id === 'cyanobacteria' || id === 'spirochetes') return 'microbe';
    if (id === 'archaea' || id === 'euryarchaeota' || id === 'asgard') return 'microbe';
    if (id === 'protists' || id === 'alveolates' || id === 'stramenopiles' ||
        id === 'amoebozoa') return 'protist';
    n = n._parent;
  }
  return 'other';
}

// ── Panel helper: render branch-specific section ──
export function renderBranchSection(node, branchType) {
  const bd = (typeof BRANCH_DATA !== 'undefined') ? BRANCH_DATA[node.id] : null;
  if (!bd) return '';
  let html = '';
  if (branchType === 'microbe' || branchType === 'protist') {
    const items = [];
    if (bd.cellType) items.push(`<span class="panel-cap">🔬 ${bd.cellType}</span>`);
    if (bd.metabolism) items.push(`<span class="panel-cap">⚡ ${bd.metabolism}</span>`);
    if (bd.habitat) items.push(`<span class="panel-cap">🏠 ${bd.habitat}</span>`);
    if (items.length) html += `<div class="panel-section"><div class="p-section">🧫 BIOLOGY</div><div class="panel-caps">${items.join('')}</div></div>`;
    if (bd.relevance) html += `<div class="panel-section"><div class="p-section">🌍 SIGNIFICANCE</div><p class="p-detail" style="margin:0">${bd.relevance}</p></div>`;
  } else if (branchType === 'plant') {
    const items = [];
    if (bd.pollination) items.push(`<span class="panel-cap">🌸 ${bd.pollination}</span>`);
    if (bd.conservation) items.push(`<span class="panel-cap">🛡️ ${bd.conservation}</span>`);
    if (bd.ecoRole) items.push(`<span class="panel-cap">🌱 ${bd.ecoRole}</span>`);
    if (items.length) html += `<div class="panel-section"><div class="p-section">🌿 ECOLOGY</div><div class="panel-caps">${items.join('')}</div></div>`;
    if (bd.record) html += `<div class="panel-section"><div class="panel-tip">🏆 ${bd.record}</div></div>`;
  } else if (branchType === 'fungus') {
    const items = [];
    if (bd.substrate) items.push(`<span class="panel-cap">🪵 ${bd.substrate}</span>`);
    if (bd.symbiosis) items.push(`<span class="panel-cap">🤝 ${bd.symbiosis}</span>`);
    if (bd.edibility) items.push(`<span class="panel-cap">${bd.edibility.includes('Toxic') || bd.edibility.includes('Deadly') ? '☠️' : '🍄'} ${bd.edibility}</span>`);
    if (bd.dispersal) items.push(`<span class="panel-cap">💨 ${bd.dispersal}</span>`);
    if (items.length) html += `<div class="panel-section"><div class="p-section">🍄 MYCOLOGY</div><div class="panel-caps">${items.join('')}</div></div>`;
  } else if (branchType === 'animal' || branchType === 'primate') {
    const items = [];
    if (bd.diet) items.push(`<span class="panel-cap">🍽️ ${bd.diet}</span>`);
    if (bd.lifespan) items.push(`<span class="panel-cap">⏳ ${bd.lifespan}</span>`);
    if (bd.conservation) items.push(`<span class="panel-cap">🛡️ ${bd.conservation}</span>`);
    if (items.length) html += `<div class="panel-section"><div class="p-section">🐾 WILDLIFE</div><div class="panel-caps">${items.join('')}</div></div>`;
    if (bd.size) html += `<div class="panel-section"><div class="panel-tip">📏 ${bd.size}</div></div>`;
    if (bd.ability) html += `<div class="panel-section"><div class="panel-tip">⭐ ${bd.ability}</div></div>`;
  }
  return html;
}

// ── Panel helper: render mini world map ──
export function renderMiniMap(nodeId, nodeColor) {
  const geo = (typeof GEO_DATA !== 'undefined') ? GEO_DATA[nodeId] : null;
  if (!geo || !geo.regions || !geo.regions.length) return '';
  if (typeof MAP_PATHS === 'undefined') return '';
  const active = new Set(geo.regions);
  const isWorldwide = active.has('worldwide');
  const isMarine = active.has('marine-global') || active.has('marine-deep') || active.has('freshwater');
  const color = nodeColor || 'var(--accent-primary)';
  // Build SVG paths from MAP_PATHS (realistic continent outlines)
  let paths = '';
  if (isMarine) {
    paths += `<rect x="0" y="0" width="800" height="400" rx="8" style="fill:${color};opacity:0.2"/>`;
  }
  for (const [rid, dArr] of Object.entries(MAP_PATHS)) {
    const isActive = isWorldwide || active.has(rid) ||
      (active.has('africa') && (rid === 'north-africa' || rid === 'west-africa' || rid === 'east-africa' || rid === 'southern-africa'));
    for (const d of dArr) {
      if (isMarine && !isActive) {
        paths += `<path class="region" d="${d}"/>`;
      } else {
        paths += `<path class="region${isActive ? ' active' : ''}" d="${d}" ${isActive ? `style="fill:${color}"` : ''}/>`;
      }
    }
  }
  const typeIcon = geo.type === 'fossil' ? '🦴' : geo.type === 'endemic' ? '📌' : '🌍';
  const typeLabel = geo.type === 'fossil' ? 'Fossil sites' : geo.type === 'endemic' ? 'Endemic range' : 'Distribution';
  return `<div class="panel-section">
    <div class="p-section">📍 ${typeLabel.toUpperCase()}</div>
    <div class="mini-map">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">${paths}</svg>
    </div>
    <div class="mini-map-caption">
      <span class="mini-map-dot" style="background:${color}"></span>
      ${typeIcon} ${geo.label}
    </div>
  </div>`;
}

// ── Primate enriched card helper ──
export function renderPrimateCard(node) {
  const pd = (typeof PRIMATE_DATA !== 'undefined') ? (PRIMATE_DATA[node.id] || null) : null;
  const h = node._hominData || null;
  if (!pd && !h) return '';

  let html = '';
  const nodeColor = (h && h.color) || node.color || 'var(--accent-primary)';

  // ─ IUCN Conservation Status badge ─
  const cons = pd && pd.conservation;
  if (cons && cons.iucnStatus) {
    const iucnMap = {'Critically Endangered':'cr','Endangered':'en','Vulnerable':'vu','Least Concern':'lc'};
    const cls = iucnMap[cons.iucnStatus] || 'lc';
    html += `<span class="pri-iucn pri-iucn-${cls}">${cons.iucnStatus}</span>`;
  }

  // ─ Taxonomy table ─
  const tax = pd && pd.taxonomy;
  if (tax) {
    const ranks = [
      ['Kingdom', tax.kingdom], ['Phylum', tax.phylum], ['Class', tax.class],
      ['Order', tax.order], ['Family', tax.family], ['Subfamily', tax.subfamily],
      ['Tribe', tax.tribe], ['Genus', tax.genus], ['Species', tax.species]
    ].filter(r => r[1]);
    if (ranks.length > 0) {
      // Determine the most specific (current) rank
      const currentIdx = ranks.length - 1;
      html += `<div style="display:flex;flex-direction:column;gap:4px;">
        <div class="pri-section-hdr" style="color:${nodeColor};">🔬 TAXONOMY</div>
        <div class="pri-taxonomy">
          ${ranks.map((r, i) => {
            const isCurrent = i >= currentIdx;
            const cls = isCurrent ? ' pri-current' : '';
            const colorStyle = isCurrent ? ` style="color:${nodeColor};"` : '';
            return `<span class="pri-tax-rank${cls}"${colorStyle}>${r[0]}</span><span class="pri-tax-val${cls}">${r[1]}</span>`;
          }).join('')}
        </div>
      </div>`;
    }
  }

  // ─ Brain Volume bar ─
  const brainData = (pd && pd.brain && pd.brain.volume) || (h && h.brain);
  if (brainData) {
    const brainArr = Array.isArray(brainData) ? brainData : [brainData, brainData];
    const brainMax = brainArr[1] || brainArr[0];
    if (brainMax) {
      const pct = Math.round(brainMax / 1750 * 100);
      html += `<div style="display:flex;flex-direction:column;gap:4px;">
        <div class="pri-section-hdr" style="color:${nodeColor};">🧠 BRAIN VOLUME</div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="pri-bar-track">
            <div class="pri-bar-fill" style="width:${pct}%;background:${nodeColor};"></div>
          </div>
          <span style="font-size:12px;color:var(--text-secondary);font-family:var(--font-mono);min-width:70px;">${brainArr[0] !== brainArr[1] && brainArr[0] ? brainArr[0]+'–'+brainMax : brainMax} cc</span>
        </div>
        ${(pd && pd.brain && pd.brain.eq) ? `<div style="font-size:11px;color:var(--text-secondary);">Encephalization Quotient: <strong style="color:var(--text-primary);">${pd.brain.eq}</strong></div>` : ''}
      </div>`;
    }
  }

  // ─ Physical Traits grid ─
  const phys = (pd && pd.physical) || {};
  const hHeight = (h && h.height) || phys.height;
  const hWeight = (h && h.weight) || phys.weight;
  const traits = [
    hHeight ? ['📏','Height', hHeight] : null,
    hWeight ? ['⚖️','Weight', hWeight] : null,
    phys.dentition ? ['🦷','Dentition', phys.dentition] : null,
    phys.skull ? ['💀','Skull', phys.skull] : null,
    phys.locomotion ? ['🦶','Locomotion', phys.locomotion] : null
  ].filter(Boolean);
  if (traits.length > 0) {
    html += `<div style="display:flex;flex-direction:column;gap:4px;">
      <div class="pri-section-hdr" style="color:${nodeColor};">📐 PHYSICAL TRAITS</div>
      <div class="pri-traits-grid">
        ${traits.map(t => `<div class="pri-trait-card">
          <span class="pri-trait-icon">${t[0]}</span>
          <span class="pri-trait-label">${t[1]}</span>
          <span class="pri-trait-value">${t[2]}</span>
        </div>`).join('')}
      </div>
    </div>`;
  }

  // ─ Genome / DNA card ─
  const gen = pd && pd.genome;
  if (gen && (gen.size || gen.chromosomes || gen.dnaSimHuman != null)) {
    html += `<div style="display:flex;flex-direction:column;gap:4px;">
      <div class="pri-section-hdr" style="color:${nodeColor};">🧬 GENOME & DNA</div>
      <div class="pri-genome-card">`;
    if (gen.size) html += `<div class="pri-genome-row"><span class="pri-genome-label">Genome Size</span><span class="pri-genome-value">${gen.size}</span></div>`;
    if (gen.chromosomes) html += `<div class="pri-genome-row"><span class="pri-genome-label">Chromosomes</span><span class="pri-genome-value">${gen.chromosomes}</span></div>`;
    if (gen.dnaSimHuman != null && gen.dnaSimHuman !== 100) {
      html += `<div style="display:flex;flex-direction:column;gap:4px;">
        <div class="pri-dna-bar">
          <span style="min-width:100px;">DNA sim. to human</span>
          <div class="pri-dna-bar-track">
            <div class="pri-dna-bar-fill" style="width:${gen.dnaSimHuman}%;background:${nodeColor};"></div>
          </div>
          <span style="font-family:var(--font-mono);font-weight:600;">${gen.dnaSimHuman}%</span>
        </div>
      </div>`;
    } else if (gen.dnaSimHuman === 100) {
      html += `<div class="pri-genome-row"><span class="pri-genome-label">DNA sim. to human</span><span class="pri-genome-value">100% (reference)</span></div>`;
    }
    if (gen.note) html += `<div style="font-size:11px;color:var(--text-secondary);font-style:italic;line-height:1.4;">${gen.note}</div>`;
    html += `</div></div>`;
  }

  // ─ DNA introgression (hominins with dna data) ─
  const dna = h && h.dna;
  if (dna && (dna.neanderthal != null || dna.denisovan != null)) {
    const nPct = dna.neanderthal != null ? dna.neanderthal : null;
    const dPct = dna.denisovan != null ? dna.denisovan : null;
    if ((nPct != null && nPct > 0 && nPct < 100) || (dPct != null && dPct > 0 && dPct < 100)) {
      html += `<div style="display:flex;flex-direction:column;gap:4px;">
        <div class="pri-section-hdr" style="color:${nodeColor};">🧬 DNA LEGACY</div>`;
      if (nPct != null && nPct > 0 && nPct < 100) {
        html += `<div class="pri-dna-bar"><span style="min-width:80px;">Neanderthal</span><div class="pri-dna-bar-track"><div class="pri-dna-bar-fill" style="width:${Math.min(100,nPct*25)}%;background:#7A9BAA;"></div></div><span>${nPct}%</span></div>`;
      }
      if (dPct != null && dPct > 0 && dPct < 100) {
        html += `<div class="pri-dna-bar"><span style="min-width:80px;">Denisovan</span><div class="pri-dna-bar-track"><div class="pri-dna-bar-fill" style="width:${Math.min(100,dPct*20)}%;background:#7A8BAA;"></div></div><span>${dPct}%</span></div>`;
      }
      if (dna.note) html += `<div style="font-size:11px;color:var(--text-secondary);font-style:italic;">${dna.note}</div>`;
      html += `</div>`;
    }
  }

  // ─ Capabilities row (hominins) ─
  if (h) {
    const hasTools = h.tools && h.tools !== 'None known' && h.tools !== 'None';
    const hasFire = h.fire && h.fire !== 'No';
    const hasLang = h.language && h.language !== 'None';
    if (hasTools || hasFire || hasLang) {
      html += `<div style="display:flex;flex-direction:column;gap:4px;">
        <div class="pri-section-hdr" style="color:${nodeColor};">⚡ CAPABILITIES</div>
        <div class="pri-cap-row">`;
      if (hasTools) html += `<span class="pri-cap-item">🪨 ${h.tools}</span>`;
      if (hasFire) html += `<span class="pri-cap-item">🔥 ${h.fire}</span>`;
      if (hasLang) html += `<span class="pri-cap-item">🗣️ ${h.language}</span>`;
      html += `</div></div>`;
    }
  }

  // ─ Behavior & Culture card (living species and H. sapiens) ─
  const beh = pd && pd.behavior;
  if (beh && (beh.socialStructure || beh.culture || beh.communication)) {
    const showBehavior = beh.socialStructure !== 'Unknown' && beh.socialStructure;
    const showCulture = beh.culture;
    const showComm = beh.communication && beh.communication !== 'Unknown';
    if (showBehavior || showCulture || showComm) {
      html += `<div style="display:flex;flex-direction:column;gap:4px;">
        <div class="pri-section-hdr" style="color:${nodeColor};">🏛️ BEHAVIOR & CULTURE</div>
        <div class="pri-behavior-card">`;
      if (showBehavior) html += `<div class="pri-behavior-row"><strong>Social:</strong> ${beh.socialStructure}</div>`;
      if (showComm) html += `<div class="pri-behavior-row"><strong>Communication:</strong> ${beh.communication}</div>`;
      if (beh.toolUse && beh.toolUse !== 'None known' && beh.toolUse !== 'None documented') html += `<div class="pri-behavior-row"><strong>Tool Use:</strong> ${beh.toolUse}</div>`;
      if (showCulture) html += `<div class="pri-behavior-row"><strong>Culture:</strong> ${beh.culture}</div>`;
      html += `</div></div>`;
    }
  }

  // ─ Fossil Sites (hominins) ─
  if (h && h.sites && h.sites.length) {
    html += `<div style="display:flex;flex-direction:column;gap:4px;">
      <div class="pri-section-hdr" style="color:${nodeColor};">📍 FOSSIL SITES</div>
      <div style="font-size:12px;color:var(--text-secondary);font-family:var(--font-sans);line-height:1.6;">${h.sites.join(' · ')}</div>
    </div>`;
  }

  // ─ Conservation (living species) ─
  if (cons && cons.population) {
    html += `<div style="display:flex;flex-direction:column;gap:4px;">
      <div class="pri-section-hdr" style="color:${nodeColor};">🌍 CONSERVATION</div>
      <div class="pri-behavior-card">`;
    if (cons.population) html += `<div class="pri-behavior-row"><strong>Population:</strong> ${cons.population}</div>`;
    if (cons.threat) html += `<div class="pri-behavior-row"><strong>Threat:</strong> ${cons.threat}</div>`;
    html += `</div></div>`;
  }

  return html;
}

// ── Premium Homo sapiens panel ──
export function renderSapiensPanel(node, panelEl) {
  const h = node._hominData;
  const photoEntry = PHOTO_MAP[node.id];
  const generatedUrl = (typeof ImageLoader!=='undefined') ? ImageLoader.getGeneratedUrl(node.id) : null;
  const heroImg = generatedUrl || (photoEntry && photoEntry.url) || node.img || '';
  const heroCredit = generatedUrl ? 'AI-generated illustration' : (photoEntry && photoEntry.credit) || node.imgCredit || '';
  const brainMax = h && h.brain ? (h.brain[1]||h.brain[0]) : 1500;
  const neanPct = h && h.dna && h.dna.neanderthal != null ? h.dna.neanderthal : 2;
  const denPct = h && h.dna && h.dna.denisovan != null ? h.dna.denisovan : 1;
  const dnaNote = h && h.dna && h.dna.note ? h.dna.note : '';
  const sites = h && h.sites ? h.sites : ['Jebel Irhoud, Morocco','Omo Kibish, Ethiopia'];

  panelEl.innerHTML = `
    <!-- Hero gradient -->
    <div style="position:relative;width:100%;min-height:260px;background:linear-gradient(135deg,#0c1425 0%,#0a1628 30%,#0d2847 60%,#0ea5e9 150%);overflow:hidden;flex-shrink:0;">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 80%,rgba(14,165,233,0.15) 0%,transparent 70%);"></div>
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 100%,rgba(14,165,233,0.08) 0%,transparent 50%);"></div>
      ${heroImg ? `<img src="${heroImg}" alt="Homo sapiens" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.2;mix-blend-mode:luminosity;" onerror="this.style.display='none';" />` : ''}
      <div style="position:relative;z-index:1;padding:32px 24px 24px;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(14,165,233,0.8);font-family:Inter,sans-serif;">THE PINNACLE</div>
        <h2 style="font-family:Inter,sans-serif;font-size:32px;font-weight:800;color:#fff;margin:0;line-height:1.1;letter-spacing:-0.02em;">Homo sapiens</h2>
        <div style="font-style:italic;font-size:14px;color:rgba(255,255,255,0.6);font-family:Inter,sans-serif;letter-spacing:0.05em;">The Sole Survivor</div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:8px;">
          <span style="font-size:12px;color:rgba(255,255,255,0.75);font-family:Inter,sans-serif;display:flex;align-items:center;gap:4px;">🧠 ${brainMax} cm³</span>
          <span style="font-size:12px;color:rgba(255,255,255,0.75);font-family:Inter,sans-serif;display:flex;align-items:center;gap:4px;">🌍 All 7 continents</span>
          <span style="font-size:12px;color:rgba(255,255,255,0.75);font-family:Inter,sans-serif;display:flex;align-items:center;gap:4px;">👥 8 billion</span>
        </div>
      </div>
      ${heroCredit ? `<div style="position:absolute;bottom:5px;right:8px;font-size:9px;color:rgba(255,255,255,0.4);font-family:Inter,sans-serif;">${heroCredit}</div>` : ''}
    </div>

    <div style="padding:24px;display:flex;flex-direction:column;gap:20px;overflow-y:auto;flex:1;">

      <!-- Key stats cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div style="padding:14px;border-radius:10px;background:var(--color-canvas-alt);border:1px solid var(--color-divider);display:flex;flex-direction:column;gap:4px;">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:var(--color-accent);font-family:Inter,sans-serif;">APPEARED</span>
          <span style="font-size:18px;font-weight:700;color:var(--color-text-primary);font-family:'JetBrains Mono',monospace;">~300 Kya</span>
          <span style="font-size:11px;color:var(--color-text-muted);font-family:Inter,sans-serif;">Jebel Irhoud, Morocco</span>
        </div>
        <div style="padding:14px;border-radius:10px;background:var(--color-canvas-alt);border:1px solid var(--color-divider);display:flex;flex-direction:column;gap:4px;">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:var(--color-accent);font-family:Inter,sans-serif;">BRAIN VOLUME</span>
          <span style="font-size:18px;font-weight:700;color:var(--color-text-primary);font-family:'JetBrains Mono',monospace;">1,350–1,500</span>
          <span style="font-size:11px;color:var(--color-text-muted);font-family:Inter,sans-serif;">cm³ — largest relative to body</span>
        </div>
        <div style="padding:14px;border-radius:10px;background:var(--color-canvas-alt);border:1px solid var(--color-divider);display:flex;flex-direction:column;gap:4px;">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:var(--color-accent);font-family:Inter,sans-serif;">POPULATION</span>
          <span style="font-size:18px;font-weight:700;color:var(--color-text-primary);font-family:'JetBrains Mono',monospace;">8.1 B</span>
          <span style="font-size:11px;color:var(--color-text-muted);font-family:Inter,sans-serif;">From ~10,000 survivors 70 Kya</span>
        </div>
        <div style="padding:14px;border-radius:10px;background:var(--color-canvas-alt);border:1px solid var(--color-divider);display:flex;flex-direction:column;gap:4px;">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:var(--color-accent);font-family:Inter,sans-serif;">STATUS</span>
          <span style="font-size:18px;font-weight:700;color:#22c55e;font-family:'JetBrains Mono',monospace;">Extant</span>
          <span style="font-size:11px;color:var(--color-text-muted);font-family:Inter,sans-serif;">Sole surviving hominin</span>
        </div>
      </div>

      <!-- Our Story -->
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:var(--color-accent);font-family:Inter,sans-serif;text-transform:uppercase;">Our Story</div>
        <p style="font-size:14px;line-height:1.75;color:var(--color-text-secondary);font-family:Inter,sans-serif;margin:0;">${node.desc || ''}</p>
        <p style="font-size:13px;line-height:1.75;color:var(--color-text-muted);font-family:Inter,sans-serif;margin:0;">${node.detail || ''}</p>
      </div>

      <!-- The Bottleneck callout -->
      <div style="position:relative;padding:16px 20px;background:linear-gradient(135deg,rgba(14,165,233,0.08),rgba(139,92,246,0.06));border-left:3px solid var(--color-accent);border-radius:0 10px 10px 0;">
        <div style="font-size:10px;font-weight:700;color:var(--color-accent);letter-spacing:0.1em;margin-bottom:8px;font-family:Inter,sans-serif;">THE BOTTLENECK</div>
        <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.65;color:var(--color-text-primary);margin:0;">${node.funFact || 'All 8 billion humans alive today descend from a population of perhaps 10,000 individuals who survived a near-extinction event 70,000 years ago.'}</p>
      </div>

      <!-- DNA Legacy -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:var(--color-accent);font-family:Inter,sans-serif;text-transform:uppercase;">🧬 DNA Legacy</div>
        <div style="display:flex;flex-direction:column;gap:8px;padding:14px;background:var(--color-canvas-alt);border-radius:10px;border:1px solid var(--color-divider);">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:12px;color:var(--color-text-secondary);font-family:Inter,sans-serif;min-width:90px;">Neanderthal</span>
            <div style="flex:1;height:10px;background:var(--color-panel-bg);border-radius:5px;overflow:hidden;">
              <div style="width:${Math.min(100,neanPct*20)}%;height:100%;background:linear-gradient(90deg,#7A9BAA,#5a8a9e);border-radius:5px;transition:width 1s ease;"></div>
            </div>
            <span style="font-size:13px;font-weight:600;color:#7A9BAA;font-family:'JetBrains Mono',monospace;min-width:36px;text-align:right;">${neanPct}%</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:12px;color:var(--color-text-secondary);font-family:Inter,sans-serif;min-width:90px;">Denisovan</span>
            <div style="flex:1;height:10px;background:var(--color-panel-bg);border-radius:5px;overflow:hidden;">
              <div style="width:${Math.min(100,denPct*20)}%;height:100%;background:linear-gradient(90deg,#7A8BAA,#5a6a9e);border-radius:5px;transition:width 1s ease;"></div>
            </div>
            <span style="font-size:13px;font-weight:600;color:#7A8BAA;font-family:'JetBrains Mono',monospace;min-width:36px;text-align:right;">${denPct}%</span>
          </div>
          ${dnaNote ? `<div style="font-size:11px;color:var(--color-text-muted);font-style:italic;margin-top:2px;">${dnaNote}</div>` : ''}
        </div>
      </div>

      <!-- What Makes Us Unique -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:var(--color-accent);font-family:Inter,sans-serif;text-transform:uppercase;">What Makes Us Unique</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          ${['🗣️ Language','🎨 Art','🔧 Tool use','🌾 Agriculture','🔬 Science','🚀 Space travel'].map(t=>`
            <div style="padding:10px 8px;border-radius:8px;background:var(--color-canvas-alt);border:1px solid var(--color-divider);text-align:center;font-size:12px;color:var(--color-text-secondary);font-family:Inter,sans-serif;">${t}</div>
          `).join('')}
        </div>
      </div>

      <!-- Capabilities -->
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <div style="flex:1;min-width:120px;padding:12px;border-radius:8px;background:var(--color-canvas-alt);border:1px solid var(--color-divider);text-align:center;">
          <div style="font-size:20px;margin-bottom:4px;">🔥</div>
          <div style="font-size:10px;font-weight:700;color:var(--color-accent);letter-spacing:0.1em;font-family:Inter,sans-serif;">FIRE</div>
          <div style="font-size:12px;color:var(--color-text-secondary);font-family:Inter,sans-serif;">Total control</div>
        </div>
        <div style="flex:1;min-width:120px;padding:12px;border-radius:8px;background:var(--color-canvas-alt);border:1px solid var(--color-divider);text-align:center;">
          <div style="font-size:20px;margin-bottom:4px;">🗣️</div>
          <div style="font-size:10px;font-weight:700;color:var(--color-accent);letter-spacing:0.1em;font-family:Inter,sans-serif;">LANGUAGE</div>
          <div style="font-size:12px;color:var(--color-text-secondary);font-family:Inter,sans-serif;">Full symbolic</div>
        </div>
        <div style="flex:1;min-width:120px;padding:12px;border-radius:8px;background:var(--color-canvas-alt);border:1px solid var(--color-divider);text-align:center;">
          <div style="font-size:20px;margin-bottom:4px;">🧠</div>
          <div style="font-size:10px;font-weight:700;color:var(--color-accent);letter-spacing:0.1em;font-family:Inter,sans-serif;">COGNITION</div>
          <div style="font-size:12px;color:var(--color-text-secondary);font-family:Inter,sans-serif;">Abstract thought</div>
        </div>
      </div>

      <!-- Fossil sites -->
      <div style="display:flex;flex-direction:column;gap:6px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:var(--color-accent);font-family:Inter,sans-serif;text-transform:uppercase;">📍 Key Fossil Sites</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${sites.map(s=>`<span style="font-size:11px;padding:4px 12px;border-radius:9999px;background:var(--color-button-bg);border:1px solid var(--color-button-border);color:var(--color-text-secondary);font-family:Inter,sans-serif;display:inline-flex;align-items:center;gap:4px;">📌 ${s}</span>`).join('')}
        </div>
      </div>

      <!-- Reflection quote -->
      <div style="padding:16px;background:var(--color-canvas-alt);border-radius:10px;border:1px solid var(--color-divider);text-align:center;">
        <div style="font-size:14px;font-style:italic;line-height:1.7;color:var(--color-text-primary);font-family:Inter,sans-serif;">"In 300,000 years we reshaped the biosphere, split the atom, walked on the moon, and began sequencing the genomes of every organism on this tree of life."</div>
        <div style="font-size:11px;color:var(--color-text-muted);margin-top:8px;font-family:Inter,sans-serif;">You are a 300,000-year-old African species looking at a screen.</div>
      </div>

      <!-- Hominin Deep Dive button -->
      <button onclick="navigateTo('hominini')" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0ea5e9,#8b5cf6);color:white;cursor:pointer;font-family:Inter,sans-serif;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:0.02em;transition:opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">🧬 Explore Human Evolution</button>

      <!-- Close button -->
      <button onclick="closePanel()" style="padding:10px;border-radius:8px;border:1px solid var(--color-button-border);background:var(--color-button-bg);cursor:pointer;font-family:Inter,sans-serif;font-size:13px;color:var(--color-text-secondary);">Close</button>
    </div>
  `;
}

// ── Panel hero SVG silhouette fallback ──
export function buildHeroFallback(node) {
  const ig = getIconGroup(node);
  const iconPath = (typeof NODE_ICONS !== 'undefined' && NODE_ICONS[ig]) || (typeof NODE_ICONS !== 'undefined' && NODE_ICONS.default) || '';
  const color = node.color || '#c8883a';
  return `<div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,${color}22 0%,${color}08 60%,transparent 100%),var(--surface-raised);">
    <svg viewBox="0 0 40 40" width="120" height="120" style="opacity:0.7;filter:drop-shadow(0 2px 8px ${color}44);">
      <path d="${iconPath}" fill="${color}" />
    </svg>
  </div>`;
}

// ── Panel rendering helpers ──
export function _buildTimelineBar(node) {
  if (node.appeared == null) return '';
  const pct = Math.max(2, Math.min(98, (1 - node.appeared / 3800) * 100));
  const col = node.color || 'var(--color-accent)';
  return `
    <div class="panel-timeline">
      <div class="panel-timeline-track">
        <div class="panel-timeline-fill" style="width:${pct}%;background:${col};"></div>
        <div class="panel-timeline-marker" style="left:${pct}%;background:${col};"></div>
      </div>
      <div class="panel-timeline-labels" style="margin-top:18px;">
        <span>3.8 Bya</span>
        <span style="color:var(--color-text-secondary);font-weight:600;">~${node.appeared >= 1000 ? (node.appeared/1000).toFixed(1)+' Bya' : node.appeared+' Mya'}</span>
        <span>Now</span>
      </div>
    </div>`;
}

export function _buildRadarChart(node) {
  const facts = node.facts;
  if (!facts || facts.length < 3) return '';
  // Extract numeric facts
  const numFacts = [];
  for (const f of facts) {
    const m = String(f.v).match(/^[\d,.]+/);
    if (m) {
      const val = parseFloat(m[0].replace(/,/g, ''));
      if (!isNaN(val) && val > 0) numFacts.push({ label: f.l, value: val });
    }
    if (numFacts.length >= 6) break;
  }
  if (numFacts.length < 3) return '';
  const n = numFacts.length;
  const cx = 60, cy = 60, R = 48;
  const maxVal = Math.max(...numFacts.map(f => f.value));
  const col = node.color || 'var(--color-accent)';
  // Build polygon points
  const pts = numFacts.map((f, i) => {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const r = (f.value / maxVal) * R;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
  // Build axis lines and labels
  let axes = '';
  numFacts.forEach((f, i) => {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    axes += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="var(--color-divider)" stroke-width="1"/>`;
    // Label position slightly beyond axis end
    const lx = cx + (R + 14) * Math.cos(angle);
    const ly = cy + (R + 14) * Math.sin(angle);
    const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
    axes += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="central" fill="var(--color-text-muted)" font-size="7" font-family="Inter,sans-serif">${f.label.length > 12 ? f.label.slice(0,11)+'…' : f.label}</text>`;
  });
  return `
    <div class="panel-radar">
      <svg width="140" height="140" viewBox="-10 -10 140 140">
        ${axes}
        <polygon points="${pts}" fill="${col}" fill-opacity="0.2" stroke="${col}" stroke-width="1.5"/>
        ${numFacts.map((f, i) => {
          const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
          const r = (f.value / maxVal) * R;
          return `<circle cx="${cx + r * Math.cos(angle)}" cy="${cy + r * Math.sin(angle)}" r="2.5" fill="${col}"/>`;
        }).join('')}
      </svg>
    </div>`;
}

export function _panelSection(icon, title, content, collapsed) {
  return `
    <div class="panel-section${collapsed ? ' collapsed' : ''}">
      <div class="panel-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
        <span class="panel-section-title">${icon} ${title}</span>
        <span class="panel-chevron">▼</span>
      </div>
      <div class="panel-section-body">${content}</div>
    </div>`;
}

// ── Main panel content renderer ──
export function renderPanelContent(node) {
  const p = document.getElementById('panel') || document.getElementById('info-panel');
  if (!p) return;
  // Premium panel for Homo sapiens
  if (node.id === 'homo-sapiens' || node.id === 'h_sapiens') { renderSapiensPanel(node, p); return; }

  // Image resolution
  const photoEntry = PHOTO_MAP[node.id];
  const generatedUrl = (typeof ImageLoader !== 'undefined') ? ImageLoader.getGeneratedUrl(node.id) : null;
  let staticUrl = (photoEntry && photoEntry.url) || generatedUrl || node.img || null;
  const staticCredit = (photoEntry && photoEntry.url) ? (photoEntry.credit || '') : generatedUrl ? 'AI-generated illustration' : (node.imgCredit || '');
  const wikiTitle = WIKI_TITLES[node.id] || null;
  if (staticUrl && window._failedPhotos && window._failedPhotos.has('static:' + node.id)) staticUrl = null;

  const panelImgId = 'pi-' + node.id.replace(/[^a-z0-9]/g, '_');
  const panelFbId  = 'pf-' + node.id.replace(/[^a-z0-9]/g, '_');
  const panelCrId  = 'pc-' + node.id.replace(/[^a-z0-9]/g, '_');

  // Lineage badge
  const GREAT_APE_SET = new Set(['great-apes','gorilla','orangutan','chimpanzee','bonobo','homo-sapiens']);
  const isHominin = node._hominData || node._hominin || (node.tags && (node.tags.includes('Hominin') || node.tags.includes('Human evolution')));
  const isGreatApe = GREAT_APE_SET.has(node.id);
  let lineageBadge = '';
  if (isHominin) lineageBadge = '<span class="panel-hero-lineage human">🧬 Human Lineage</span>';
  else if (isGreatApe) lineageBadge = '<span class="panel-hero-lineage ape">🦍 Great Apes</span>';

  // Branch type for customized sections
  const branchType = getBranchType(node);

  p.innerHTML = `
    <div class="panel-hero">
      <img id="${panelImgId}" alt="${node.name}" style="display:none;" />
      <div id="${panelFbId}" class="panel-hero-fb">${node.icon || '🌿'}</div>
      <div class="panel-hero-overlay"></div>
      ${node.extinct ? '<span class="panel-hero-badge">† EXTINCT</span>' : ''}
      ${(()=>{const c=node.conservation||node.iucn;if(!c||c==='NE')return '';const map={CR:'Critically Endangered',EN:'Endangered',VU:'Vulnerable',NT:'Near Threatened',LC:'Least Concern'};return `<span class="pri-iucn pri-iucn-${c.toLowerCase()}">${map[c]||c}</span>`;})()}
      ${lineageBadge}
      <div class="panel-hero-meta">
        <div class="p-name">${node.name}</div>
        ${node.latin ? `<div class="p-latin">${node.latin}</div>` : ''}
        ${node.era ? `<div class="p-era">📅 ${node.era}${node.appeared ? ' · ' + node.appeared + ' Mya' : ''}</div>` : ''}
      </div>
      <div id="${panelCrId}" class="panel-hero-credit">${staticCredit}</div>
      <button class="p-close" onclick="closePanel()">✕</button>
    </div>
    <div class="panel-body">
      ${node.desc ? `<div class="panel-section"><p class="p-desc" style="margin:0">${node.desc}</p></div>` : ''}
      ${node.funFact ? `
        <div class="panel-section">
          <div class="panel-funfact">
            <div class="panel-funfact-label">💡 DID YOU KNOW</div>
            <p class="panel-funfact-text">${node.funFact}</p>
          </div>
        </div>
      ` : ''}
      ${node.detail ? `<div class="panel-section"><p class="p-detail" style="margin:0">${node.detail}</p></div>` : ''}
      ${renderMiniMap(node.id, node.color)}
      ${node.facts && node.facts.length ? `
        <div class="panel-section">
          <div class="p-facts">
            ${node.facts.map(f => `
              <div class="fact-card" style="border-left:3px solid ${node.color}">
                <div class="fact-l">${f.l}</div>
                <div class="fact-v">${f.v}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      ${node.tags && node.tags.length ? `
        <div class="panel-section" style="display:flex;flex-wrap:wrap;gap:6px;">
          ${node.tags.map(tag => `<span class="p-tag">${tag}</span>`).join('')}
        </div>
      ` : ''}
      ${renderBranchSection(node, branchType)}
      ${(()=>{
        const h = node._hominData;
        if (!h) return '';
        const brainMax = h.brain && (h.brain[1] || h.brain[0]);
        let html = '';
        if (brainMax) {
          html += `<div class="panel-section">
            <div class="p-section">🧠 BRAIN VOLUME</div>
            <div class="panel-bar-wrap">
              <div class="panel-bar"><div class="panel-bar-fill" style="width:${Math.round(brainMax/1750*100)}%;background:${h.color}"></div></div>
              <span class="panel-bar-label">${brainMax} cm³</span>
            </div>
          </div>`;
        }
        const hasTools = h.tools && h.tools !== 'None known' && h.tools !== 'None';
        const hasFire = h.fire && h.fire !== 'No';
        const hasLang = h.language && h.language !== 'None';
        if (hasTools || hasFire || hasLang) {
          html += `<div class="panel-section"><div class="panel-caps">`;
          if (hasTools) html += `<span class="panel-cap">🪨 ${h.tools}</span>`;
          if (hasFire)  html += `<span class="panel-cap">🔥 ${h.fire}</span>`;
          if (hasLang)  html += `<span class="panel-cap">🗣️ ${h.language}</span>`;
          html += `</div></div>`;
        }
        const neanPct = h.dna && h.dna.neanderthal != null ? h.dna.neanderthal : null;
        const denPct  = h.dna && h.dna.denisovan != null ? h.dna.denisovan : null;
        if (neanPct != null || denPct != null) {
          html += `<div class="panel-section"><div class="p-section">🧬 DNA LEGACY</div>`;
          if (neanPct != null) html += `<div class="panel-bar-wrap" style="margin-bottom:4px"><span style="min-width:75px;font-size:0.72rem;color:var(--text-secondary)">Neanderthal</span><div class="panel-bar" style="height:6px"><div class="panel-bar-fill" style="width:${Math.min(100,neanPct*25)}%;background:#7A9BAA"></div></div><span class="panel-bar-label">${neanPct}%</span></div>`;
          if (denPct != null) html += `<div class="panel-bar-wrap"><span style="min-width:75px;font-size:0.72rem;color:var(--text-secondary)">Denisovan</span><div class="panel-bar" style="height:6px"><div class="panel-bar-fill" style="width:${Math.min(100,denPct*20)}%;background:#7A8BAA"></div></div><span class="panel-bar-label">${denPct}%</span></div>`;
          if (h.dna && h.dna.note) html += `<div style="font-size:0.65rem;color:var(--text-secondary);font-style:italic;margin-top:4px">${h.dna.note}</div>`;
          html += `</div>`;
        }
        if (h.sites && h.sites.length) {
          html += `<div class="panel-section"><div class="p-section">📍 FOSSIL SITES</div>
            <div style="font-size:0.72rem;color:var(--text-secondary);line-height:1.6">${h.sites.join(' · ')}</div></div>`;
        }
        return html;
      })()}
      ${node.tipFact ? `<div class="panel-section"><div class="panel-tip">🌿 ${node.tipFact}</div></div>` : ''}
      ${node.altFacts && node.altFacts.length ? `
        <div class="panel-section">
          <div class="p-section">📚 MORE FACTS</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${node.altFacts.map(f => `<div class="panel-altfact">${f}</div>`).join('')}
          </div>
        </div>
      ` : ''}
      ${node.links && node.links.length ? `
        <div class="panel-section">
          <div class="p-section">🔗 LEARN MORE</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${node.links.map(lnk => `<a href="${lnk.url}" target="_blank" rel="noopener noreferrer" class="panel-link">↗ ${lnk.label}</a>`).join('')}
          </div>
        </div>
      ` : ''}
      ${(()=>{
        const isHom = node._hominData || node.id === 'hominini' || (node.id && node.id.startsWith('hom-'));
        return isHom ? `<div class="panel-section"><button class="panel-cta" onclick="navigateTo('hominini')">🧬 Hominin Deep Dive</button></div>` : '';
      })()}
    </div>
  `;

  // Inject back button
  if (navStack.length > 0) {
    const body = p.querySelector('.panel-body');
    if (body) {
      const backBtn = document.createElement('button');
      backBtn.textContent = '← Back';
      backBtn.onclick = _navBack;
      backBtn.className = 'btn-back';
      backBtn.style.marginBottom = '4px';
      body.insertBefore(backBtn, body.firstChild);
    }
  }

  // Load image via ImageLoader (proper fallback chain)
  const imgEl = document.getElementById(panelImgId);
  const fbEl  = document.getElementById(panelFbId);
  const crEl  = document.getElementById(panelCrId);
  if (imgEl && fbEl) {
    if (staticUrl) {
      imgEl.src = staticUrl;
      imgEl.style.display = 'block';
      fbEl.style.display = 'none';
      imgEl.onerror = function() {
        (window._failedPhotos || (window._failedPhotos = new Set())).add('static:' + node.id);
        imgEl.style.display = 'none';
        fbEl.style.display = 'flex';
      };
      // Timeout: if image hasn't loaded after 6s, show fallback
      setTimeout(() => {
        if (!imgEl.complete || imgEl.naturalWidth === 0) {
          imgEl.style.display = 'none';
          fbEl.style.display = 'flex';
        }
      }, 6000);
    }
    // Also try Wikipedia API for a potentially better photo
    if (wikiTitle) {
      fetchWikiPhoto(node.id, wikiTitle, imgEl, fbEl, crEl);
    }
  }
}

// ── Open hominins in tree ──
export function openHominins(nodeId) {
  // Try to navigate to the hominin in the main tree first
  const canonId = canonicalHomininId(nodeId);
  const treeNode = nodeMap[canonId] || nodeMap[nodeId];
  if(treeNode){
    // navigateTo is a window.* function
    window.navigateTo(treeNode.id);
    return;
  }
  // Fallback: navigate to hominini branch
  const homininiNode = nodeMap['hominini'];
  if(homininiNode){
    window.navigateTo('hominini');
  }
}

// ── Show main panel for a node ──
export function showMainPanel(n,url){
  if(!n || (state.currentPanelNode && state.currentPanelNode.id === n.id)) return;
  _pushNav(url); // record state before transition
  state.currentPanelNode=n;
  renderPanelContent(n);
  panel.classList.add('panel-enter');
  panel.classList.add('open');
  requestAnimationFrame(() => {
    panel.classList.remove('panel-enter');
    panel.style.opacity = '1';
    panel.style.transform = '';
  });
  // Smooth pan to center the node in the viewport
  if(n._x!==undefined){
    if(typeof _smoothPanTo==='function') _smoothPanTo(n._x,n._y);
  }
  _updateBreadcrumb(n);
  _updateNavButtons();
  markExplored(n.id);
}

// ── Close panel ──
export function closePanel(){
  const p=document.getElementById('panel')||document.getElementById('info-panel');
  if(p){p.classList.remove('open');p.style.transform='';p.style.transition='';}
  state.currentPanelNode=null;
  if(state.focusedBranch) _updateBreadcrumb(state.focusedBranch); else _updateBreadcrumb(null);
  history.replaceState(null,'',location.pathname);
  _updateNavButtons();
  a11yAnnounce('Panel closed');
  // Restore focus to trigger element
  if(state._panelTriggerFocus){
    if(state._panelTriggerFocus.isConnected) state._panelTriggerFocus.focus();
    else if(state.focusedNodeId){
      const g=document.querySelector('.node-group[data-node-id="'+state.focusedNodeId+'"]');
      if(g) g.focus();
    }
    state._panelTriggerFocus=null;
  }
}

// ── Open Hominin View (expand hominini branch on tree) ──
export function openHomininView(){
  // Expand hominini and its child groups on the main tree, then zoom to them
  const hom = nodeMap['hominini'];
  if (!hom) return;
  // Expand ancestors so hominini is visible
  let cur = hom._parent;
  while (cur) { cur._collapsed = false; cur = cur._parent; }
  // Expand hominini and its 4 group nodes
  hom._collapsed = false;
  if (hom.children) hom.children.forEach(g => { g._collapsed = false; });
  // Close any open panel
  panel.classList.remove('open');
  // Re-layout and render
  _layout();
  // Zoom centered on hominini node at a readable scale
  const s = 0.7;
  state.transform = { x: window.innerWidth / 2 - hom._x * s, y: window.innerHeight / 2 - hom._y * s, s };
  _scheduleRender(true); _applyT();
}

// ── Wire up DOM event listeners ──
export function initPanelListeners() {
  const panelCloseBtn = document.getElementById('panel-close');
  if (panelCloseBtn) panelCloseBtn.addEventListener('click', _navBack);
  document.getElementById('svg').addEventListener('click', closePanel);

  // Expose to window for onclick="" attributes in templates
  window.closePanel = closePanel;
  window.openHomininView = openHomininView;
  window.showMainPanel = function(n){ showMainPanel(n); };
  window.getNodeById = id => nodeMap[id];
}
