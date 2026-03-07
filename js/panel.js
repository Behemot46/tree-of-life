/* ═══════════════════════════════════════════════════════════════
   panel.js — Node detail slide-in panel
   ═══════════════════════════════════════════════════════════════ */

const Panel = (() => {
  let currentNode = null;
  let currentTab  = 'overview';
  let enriched    = null;
  let onNavigateCb = null;

  const el = {
    panel:      () => document.getElementById('panel'),
    close:      () => document.getElementById('panel-close'),
    img:        () => document.getElementById('panel-image'),
    imgCredit:  () => document.getElementById('panel-img-credit'),
    sciName:    () => document.getElementById('panel-sci-name'),
    commonName: () => document.getElementById('panel-common-name'),
    rankBadge:  () => document.getElementById('panel-rank-badge'),
    statusBadge:() => document.getElementById('panel-status-badge'),
    extinctBadge:()=> document.getElementById('panel-extinct-badge'),
    content:    () => document.getElementById('panel-content')
  };

  function init(onNavigate) {
    onNavigateCb = onNavigate;
    el.close().addEventListener('click', hide);
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
  }

  /* ── Show ──────────────────────────────────────────────────── */
  async function show(nodeData) {
    currentNode = nodeData;
    currentTab  = 'overview';
    enriched    = null;

    // Un-hide panel (triggers CSS animation)
    el.panel().hidden = false;
    // Reset tab
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'overview'));

    // Populate header immediately
    const sci  = nodeData.name   || 'Unknown';
    const comm = nodeData.common || '';
    el.sciName().textContent    = sci;
    el.commonName().textContent = comm && comm !== sci ? comm : '';
    el.rankBadge().textContent  = nodeData.rank || '';
    el.img().src = 'assets/placeholder.svg';
    el.imgCredit().textContent = '';

    const extinctBadge = el.extinctBadge();
    extinctBadge.hidden = !nodeData.is_extinct;
    el.statusBadge().hidden = true;

    renderOverviewSkeleton();
    switchTab('overview');

    // Load enrichment data
    enriched = await API.enrichNode(sci, comm);
    if (currentNode !== nodeData) return; // user navigated away

    // Update hero image
    const img = enriched.photos?.[0] || (enriched.wiki?.thumbnail ? { url: enriched.wiki.thumbnail, attribution: 'Wikipedia' } : null);
    if (img) {
      el.img().src = img.url;
      el.imgCredit().textContent = img.attribution || '';
    }

    // Common name from iNat
    const inat = enriched.inat_taxon;
    if (inat?.common_name && !comm) {
      el.commonName().textContent = inat.common_name;
    }

    // Conservation status
    if (inat?.conservation) {
      el.statusBadge().textContent = inat.conservation;
      el.statusBadge().hidden = false;
    }

    renderCurrentTab();
  }

  function hide() {
    el.panel().hidden = true;
    currentNode = null;
  }

  /* ── Tab switching ──────────────────────────────────────────── */
  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    renderCurrentTab();
  }

  function renderCurrentTab() {
    if (!currentNode) return;
    const fns = { overview: renderOverview, evolution: renderEvolution, gallery: renderGallery, science: renderScience };
    (fns[currentTab] || renderOverview)();
  }

  /* ── Overview tab ──────────────────────────────────────────── */
  function renderOverviewSkeleton() {
    el.content().innerHTML = `
      <div class="skeleton" style="height:12px;width:90%"></div>
      <div class="skeleton" style="height:12px;width:75%"></div>
      <div class="skeleton" style="height:12px;width:80%;margin-bottom:20px"></div>
      <div class="info-grid">
        <div class="skeleton" style="height:56px"></div>
        <div class="skeleton" style="height:56px"></div>
        <div class="skeleton" style="height:56px"></div>
        <div class="skeleton" style="height:56px"></div>
      </div>
    `;
  }

  function renderOverview() {
    const nd = currentNode;
    const wiki = enriched?.wiki;
    const inat = enriched?.inat_taxon;

    const desc = wiki?.extract
      ? `<p class="panel-desc">${wiki.extract.slice(0, 500)}${wiki.extract.length > 500 ? '…' : ''}</p>`
      : `<p class="panel-desc" style="color:var(--text-dim)">No description available for this taxon.</p>`;

    const traits = buildTraits(nd, inat);
    const traitsHtml = traits.length
      ? `<div class="traits-row">${traits.map(t => `<span class="trait-chip">${t}</span>`).join('')}</div>`
      : '';

    const obs = inat?.observations ? `<div class="info-card">
      <div class="info-card-label">Observations</div>
      <div class="info-card-value">${inat.observations.toLocaleString()} <span class="info-card-unit">iNat records</span></div>
    </div>` : '';

    const div = nd.divergence_mya ? `<div class="info-card">
      <div class="info-card-label">Divergence</div>
      <div class="info-card-value">${nd.divergence_mya.toLocaleString()} <span class="info-card-unit">Mya</span></div>
    </div>` : '';

    const spp = nd.num_tips ? `<div class="info-card">
      <div class="info-card-label">Species</div>
      <div class="info-card-value">${nd.num_tips.toLocaleString()} <span class="info-card-unit">approx.</span></div>
    </div>` : '';

    const rank = `<div class="info-card">
      <div class="info-card-label">Rank</div>
      <div class="info-card-value" style="text-transform:capitalize">${nd.rank || '—'}</div>
    </div>`;

    el.content().innerHTML = `
      ${desc}
      ${traitsHtml}
      <div class="info-grid">${rank}${spp}${div}${obs}</div>
    `;
  }

  function buildTraits(nd, inat) {
    const traits = [];
    if (nd.is_extinct) traits.push('Extinct');
    const rankTraits = {
      'Mammalia': ['Warm-blooded','Hair/fur','Live birth','Mammary glands'],
      'Aves':     ['Feathers','Warm-blooded','Beaks','Egg-laying'],
      'Reptilia': ['Scales','Cold-blooded','Amniotic egg'],
      'Amphibia': ['Moist skin','Semi-aquatic','Metamorphosis'],
      'Insecta':  ['6 legs','Exoskeleton','3-part body','Antennae'],
      'Arachnida':['8 legs','Chelicerae','No antennae'],
      'Mollusca': ['Soft-bodied','Mantle','Muscular foot'],
      'Viridiplantae': ['Photosynthesis','Cell walls','Chloroplasts'],
      'Fungi':    ['Heterotrophic','Mycelium','Spores'],
      'Bacteria': ['Prokaryote','Single-celled','No nucleus'],
      'Archaea':  ['Extremophile','Prokaryote','Unique lipids']
    };
    for (const [key, t] of Object.entries(rankTraits)) {
      if (nd.name === key || nd.common?.includes(key)) { traits.push(...t); break; }
    }
    return traits.slice(0, 6);
  }

  /* ── Evolution tab ──────────────────────────────────────────── */
  async function renderEvolution() {
    el.content().innerHTML = `
      <div class="skeleton" style="height:14px;width:100%"></div>
      <div class="skeleton" style="height:14px;width:80%"></div>
      <div class="skeleton" style="height:60px;margin-top:12px"></div>
    `;
    const nd = currentNode;
    let lineage = [], relatives = [];

    try {
      const info = await API.getNodeInfo(nd.ott_id);
      if (info) {
        lineage = (info.lineage || []).reverse()
          .filter(l => l.rank && l.rank !== 'no rank' && !l.name.startsWith('mrcaott'))
          .slice(0, 8);
        relatives = (info.children || [])
          .filter(c => !c.name.startsWith('mrcaott'))
          .slice(0, 6)
          .map(c => ({ name: c.name, rank: c.rank, ott_id: c.ott_id, color: nd.color }));
      }
    } catch (e) {}

    const lineageHtml = lineage.length ? `
      <p class="panel-section-title">Lineage</p>
      <div class="lineage-trail">
        ${lineage.map((l, i) => `
          <span class="lineage-crumb ${i === lineage.length-1 ? 'current' : ''}"
                data-ott="${l.ott_id}" title="${l.rank}">${l.name}</span>
          ${i < lineage.length-1 ? '<span class="lineage-sep">›</span>' : ''}
        `).join('')}
      </div>
    ` : '';

    const divergeHtml = nd.divergence_mya ? `
      <div class="diverge-box">
        <div class="diverge-label">Estimated Divergence Time</div>
        <div class="diverge-value">${nd.divergence_mya.toLocaleString()} <span class="diverge-unit">million years ago</span></div>
      </div>
    ` : '';

    const relHtml = relatives.length ? `
      <p class="panel-section-title">Sister Groups</p>
      <div class="relatives-list">
        ${relatives.map(r => `
          <div class="relative-item" data-ott="${r.ott_id}">
            <span class="rel-dot" style="background:${nd.color}"></span>
            <span class="rel-name">${r.name}</span>
            <span class="rel-rank">${r.rank||''}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    el.content().innerHTML = `${lineageHtml}${divergeHtml}${relHtml}`;

    // Wire lineage clicks
    el.content().querySelectorAll('.lineage-crumb[data-ott]').forEach(el2 => {
      el2.addEventListener('click', () => {
        const ott = parseInt(el2.dataset.ott);
        if (onNavigateCb && ott) onNavigateCb(ott);
      });
    });
  }

  /* ── Gallery tab ──────────────────────────────────────────── */
  function renderGallery() {
    const photos = enriched?.photos || [];
    if (!photos.length) {
      el.content().innerHTML = `<div class="gallery-empty">No photos available.<br><small>Images sourced from iNaturalist.</small></div>`;
      return;
    }
    el.content().innerHTML = `
      <div class="gallery-grid">
        ${photos.map(p => `
          <div class="gallery-img-wrap" title="${p.attribution||''}">
            <img src="${p.url}" alt="${currentNode?.name||''}" loading="lazy"
                 onerror="this.parentElement.style.display='none'">
          </div>
        `).join('')}
      </div>
      <p style="font-size:11px;color:var(--text-dim);margin-top:12px;text-align:center">
        Photos from <a href="https://www.inaturalist.org" target="_blank">iNaturalist</a> community
      </p>
    `;
  }

  /* ── Science tab ──────────────────────────────────────────── */
  function renderScience() {
    const nd   = currentNode;
    const wiki = enriched?.wiki;
    const inat = enriched?.inat_taxon;

    const rows = [
      { label: 'Scientific name', val: `<i>${nd.name}</i>` },
      { label: 'OTT ID',         val: nd.ott_id },
      { label: 'Rank',           val: nd.rank || '—' },
      { label: 'Species count',  val: nd.num_tips ? nd.num_tips.toLocaleString() : '—' },
      nd.is_extinct ? { label: 'Status', val: 'Extinct ✕' } : null,
      inat?.conservation ? { label: 'IUCN Status', val: inat.conservation } : null,
      inat?.observations ? { label: 'iNat observations', val: inat.observations.toLocaleString() } : null
    ].filter(Boolean);

    const sources = [
      wiki?.page_url ? { label: 'Wikipedia', url: wiki.page_url } : null,
      nd.ott_id      ? { label: 'Open Tree of Life', url: `https://tree.opentreeoflife.org/taxonomy/browse?id=${nd.ott_id}` } : null,
      inat?.inat_id  ? { label: 'iNaturalist', url: `https://www.inaturalist.org/taxa/${inat.inat_id}` } : null,
      nd.ott_id      ? { label: 'NCBI Taxonomy', url: `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=${encodeURIComponent(nd.name)}` } : null
    ].filter(Boolean);

    const extLink = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

    el.content().innerHTML = `
      <p class="panel-section-title">Classification</p>
      ${rows.map(r => `<div class="science-row"><span class="sci-label">${r.label}</span><span class="sci-val">${r.val}</span></div>`).join('')}
      <p class="panel-section-title" style="margin-top:16px">External Sources</p>
      <div class="sources-list">
        ${sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="source-link">${extLink} ${s.label}</a>`).join('')}
      </div>
      <p style="font-size:11px;color:var(--text-dim);margin-top:16px">
        Taxonomy data from
        <a href="https://opentreeoflife.org" target="_blank">Open Tree of Life</a>.
        Species counts are approximate.
      </p>
    `;
  }

  return { init, show, hide, switchTab };
})();
