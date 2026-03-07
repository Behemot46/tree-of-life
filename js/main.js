/* ═══════════════════════════════════════════════════════════════
   main.js — Orchestrator: wires Tree, Panel, Search, Timeline
   ═══════════════════════════════════════════════════════════════ */

(async () => {
  /* ── Init all modules ─────────────────────────────────────── */
  Tree.init('#tree-container');
  Timeline.init();

  /* Panel: wire "navigate to OTT ID" from evolution tab */
  Panel.init((ottId) => {
    Tree.focusNode(ottId);
  });

  /* Search: on result select, focus tree and open panel */
  Search.init(async (result) => {
    // Try to find node in current tree
    Tree.focusNode(result.ott_id);

    // Open panel with search result data
    await Panel.show({
      id:         `ott${result.ott_id}`,
      name:       result.name,
      common:     result.unique_name || result.name,
      ott_id:     result.ott_id,
      rank:       result.rank,
      color:      '#4a9eff',
      is_extinct: result.is_extinct
    });
  });

  /* Tree: on node select, open panel */
  Tree.onNodeSelect(async (nodeData) => {
    await Panel.show(nodeData);
  });

  /* ── Load initial tree ────────────────────────────────────── */
  Tree.load(INITIAL_TREE);

  /* ── Hide loading overlay ─────────────────────────────────── */
  // Small delay to let D3 render first frame
  setTimeout(() => {
    const overlay = document.getElementById('loading');
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 600);
  }, 800);

  /* ── Discover random species ──────────────────────────────── */
  document.getElementById('btn-explore').addEventListener('click', async () => {
    const species = NOTABLE_SPECIES[Math.floor(Math.random() * NOTABLE_SPECIES.length)];

    Tree.focusNode(species.ott_id);

    await Panel.show({
      id:     `ott${species.ott_id}`,
      name:   species.name,
      common: species.common,
      ott_id: species.ott_id,
      rank:   'species',
      color:  '#4a9eff'
    });
  });

  /* ── Language switcher ────────────────────────────────────── */
  I18n.setLang(I18n.currentLang()); // apply saved/default language on load
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => I18n.setLang(btn.dataset.lang));
  });

  /* ── Theme toggle ─────────────────────────────────────────── */
  const btnTheme = document.getElementById('btn-theme');
  const savedTheme = localStorage.getItem('tol-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  btnTheme.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('tol-theme', next);
    // Re-render to update colors
    setTimeout(() => Tree.render(false), 50);
  });

  /* ── Panel close on Escape ────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') Panel.hide();
  });

  /* ── Touch: swipe-right to close panel on mobile ─────────── */
  let touchStartX = 0;
  const panel = document.getElementById('panel');
  panel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  panel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 80) Panel.hide();
  }, { passive: true });

})();
