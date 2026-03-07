/* ═══════════════════════════════════════════════════════════════
   timeline.js — Geological timeline bar
   ═══════════════════════════════════════════════════════════════ */

const Timeline = (() => {
  let isOpen = false;

  /* Geological data — spans in Mya (million years ago) */
  const EONS = [
    {
      name: 'Hadean', start: 4600, end: 4000, color: '#2c1654',
      periods: [{ name: 'Hadean', start: 4600, end: 4000, color: '#3d2070', ext: false }]
    },
    {
      name: 'Archean', start: 4000, end: 2500, color: '#1a3a5c',
      periods: [{ name: 'Archean', start: 4000, end: 2500, color: '#1e4a74', ext: false }]
    },
    {
      name: 'Proterozoic', start: 2500, end: 541, color: '#c17e2a',
      periods: [
        { name: 'Paleoproterozoic', start: 2500, end: 1600, color: '#c88b30', ext: false },
        { name: 'Mesoproterozoic',  start: 1600, end: 1000, color: '#d49840', ext: false },
        { name: 'Neoproterozoic',   start: 1000, end: 541,  color: '#e0a84a', ext: false }
      ]
    },
    {
      name: 'Phanerozoic', start: 541, end: 0, color: '#4a7c4e',
      periods: [
        { name: 'Cambrian',     start: 541, end: 485, color: '#7fbc6a', ext: false },
        { name: 'Ordovician',   start: 485, end: 444, color: '#069666', ext: true  },
        { name: 'Silurian',     start: 444, end: 419, color: '#b3e6aa', ext: false },
        { name: 'Devonian',     start: 419, end: 359, color: '#cb8c37', ext: true  },
        { name: 'Carboniferous',start: 359, end: 299, color: '#67a89c', ext: false },
        { name: 'Permian',      start: 299, end: 252, color: '#f04028', ext: true  },
        { name: 'Triassic',     start: 252, end: 201, color: '#8b4c8c', ext: true  },
        { name: 'Jurassic',     start: 201, end: 145, color: '#34b48e', ext: false },
        { name: 'Cretaceous',   start: 145, end: 66,  color: '#7dc449', ext: true  },
        { name: 'Paleogene',    start: 66,  end: 23,  color: '#fd9a52', ext: false },
        { name: 'Neogene',      start: 23,  end: 2.6, color: '#ffda56', ext: false },
        { name: 'Quaternary',   start: 2.6, end: 0,   color: '#f9f97f', ext: false }
      ]
    }
  ];

  const TOTAL_MYA = 4600;

  function init() {
    render();

    const toggle = document.getElementById('timeline-toggle');
    toggle.addEventListener('click', () => isOpen ? close() : open());
  }

  function open() {
    isOpen = true;
    document.getElementById('timeline-inner').classList.add('open');
    document.getElementById('timeline-toggle').classList.add('open');
  }

  function close() {
    isOpen = false;
    document.getElementById('timeline-inner').classList.remove('open');
    document.getElementById('timeline-toggle').classList.remove('open');
  }

  function widthPct(start, end) {
    return ((start - end) / TOTAL_MYA * 100).toFixed(3) + '%';
  }

  function render() {
    const inner = document.getElementById('timeline-inner');

    const track = document.createElement('div');
    track.className = 'timeline-track';

    for (const eon of EONS) {
      const span = eon.start - eon.end;
      const pct  = (span / TOTAL_MYA * 100).toFixed(3);

      const group = document.createElement('div');
      group.className = 'eon-group';
      group.style.flex = pct;

      // Eon bar
      const eonBar = document.createElement('div');
      eonBar.className = 'eon-bar';
      eonBar.style.background = eon.color;
      eonBar.textContent = eon.name;
      eonBar.title = `${eon.name}: ${eon.end}–${eon.start} Mya`;
      group.appendChild(eonBar);

      // Periods row
      const periRow = document.createElement('div');
      periRow.className = 'period-row';

      for (const p of eon.periods) {
        const pSpan = p.start - p.end;
        const pEl = document.createElement('div');
        pEl.className = `period-bar${p.ext ? ' has-extinction' : ''}`;
        pEl.style.background = p.color;
        pEl.style.flex = pSpan;
        pEl.textContent = pSpan < 30 ? p.name.slice(0,3) : p.name;
        pEl.title = `${p.name}: ${p.end === 0 ? 'Present' : p.end + ' Mya'} – ${p.start} Mya${p.ext ? '\n⚠ Mass extinction event' : ''}`;
        periRow.appendChild(pEl);
      }

      group.appendChild(periRow);
      track.appendChild(group);
    }

    inner.appendChild(track);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'timeline-legend';
    legend.innerHTML = `
      <span>← Earlier</span>
      <div class="tl-legend-item">
        <div class="tl-ext-marker">✕</div>
        <span>Mass extinction event</span>
      </div>
      <span>Present →</span>
    `;
    inner.appendChild(legend);
  }

  return { init, open, close };
})();
