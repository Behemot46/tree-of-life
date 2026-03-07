/* ═══════════════════════════════════════════════════════════════
   search.js — Search bar with autocomplete
   ═══════════════════════════════════════════════════════════════ */

const Search = (() => {
  let onSelectCb = null;
  let debounceTimer = null;
  let focused = -1;
  let results = [];

  const RANK_COLORS = {
    domain: '#4a9eff', kingdom: '#4a9eff', phylum: '#7a9eff',
    class: '#e8a838', order: '#e67e22', family: '#27ae60',
    genus: '#1abc9c', species: '#2ecc71'
  };

  function rankColor(rank) {
    return RANK_COLORS[rank?.toLowerCase()] || '#7a8494';
  }

  function init(onSelect) {
    onSelectCb = onSelect;

    const input    = document.getElementById('search-input');
    const clear    = document.getElementById('search-clear');
    const resultsEl = document.getElementById('search-results');

    input.addEventListener('input', () => {
      const q = input.value.trim();
      clear.hidden = !q;
      if (!q) { closeResults(); return; }
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => doSearch(q), 280);
    });

    input.addEventListener('keydown', e => {
      if (!results.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1); }
      else if (e.key === 'Enter' && focused >= 0) { e.preventDefault(); selectResult(results[focused]); }
      else if (e.key === 'Escape') { closeResults(); input.blur(); }
    });

    input.addEventListener('focus', () => {
      if (input.value.trim() && results.length) showResults();
    });

    clear.addEventListener('click', () => {
      input.value = '';
      clear.hidden = true;
      closeResults();
      input.focus();
    });

    document.addEventListener('click', e => {
      if (!document.getElementById('search-container').contains(e.target)) closeResults();
    });
  }

  async function doSearch(query) {
    const resultsEl = document.getElementById('search-results');
    resultsEl.innerHTML = `<div class="search-empty">Searching…</div>`;
    resultsEl.hidden = false;

    try {
      results = await API.searchTaxa(query, 10);
    } catch (e) {
      results = [];
    }

    focused = -1;

    if (!results.length) {
      resultsEl.innerHTML = `<div class="search-empty">No results for "<strong>${escHtml(query)}</strong>"</div>`;
      return;
    }

    resultsEl.innerHTML = results.map((r, i) => `
      <div class="search-result-item" data-idx="${i}" role="option">
        <span class="sri-dot" style="background:${rankColor(r.rank)}"></span>
        <div class="sri-names">
          <div class="sri-sci">${escHtml(r.name)}${r.is_extinct ? ' <span style="color:var(--col-extinct)">†</span>' : ''}</div>
          ${r.unique_name !== r.name ? `<div class="sri-common">${escHtml(r.unique_name)}</div>` : ''}
        </div>
        <span class="sri-rank">${escHtml(r.rank || '')}</span>
      </div>
    `).join('');

    resultsEl.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.idx);
        selectResult(results[idx]);
      });
      item.addEventListener('mouseenter', () => {
        focused = parseInt(item.dataset.idx);
        updateFocusClass();
      });
    });
  }

  function showResults() {
    document.getElementById('search-results').hidden = false;
  }

  function closeResults() {
    results = [];
    focused = -1;
    const el = document.getElementById('search-results');
    el.hidden = true;
    el.innerHTML = '';
  }

  function moveFocus(dir) {
    focused = Math.max(0, Math.min(results.length - 1, focused + dir));
    updateFocusClass();
    const items = document.querySelectorAll('.search-result-item');
    items[focused]?.scrollIntoView({ block: 'nearest' });
  }

  function updateFocusClass() {
    document.querySelectorAll('.search-result-item').forEach((item, i) => {
      item.classList.toggle('focused', i === focused);
    });
  }

  function selectResult(result) {
    document.getElementById('search-input').value = result.name;
    document.getElementById('search-clear').hidden = false;
    closeResults();
    if (onSelectCb) onSelectCb(result);
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { init };
})();
