// ══════════════════════════════════════════════════════
// PROFILE.JS — Player profiles + household leaderboard
// Manages localStorage-backed multi-player profiles,
// profile panel UI (3 tabs), achievement grid, kingdom progress
// ══════════════════════════════════════════════════════

import { ACHIEVEMENTS } from './achievements.js';
import { getUnlockedAchievements, getExploredSpecies } from './engagement.js';

let _deps = {};
export function initProfileDeps(deps) { Object.assign(_deps, deps); }

// ── Storage keys ──
const LS_PLAYERS = 'tol-players';
const LS_ACTIVE  = 'tol-active-player';

// ── In-memory state ──
let _players = [];
let _activePlayerName = '';

// ── Internal helpers ──

function _loadPlayers() {
  try {
    _players = JSON.parse(localStorage.getItem(LS_PLAYERS) || '[]');
  } catch(e) {
    _players = [];
  }
}

function _savePlayers() {
  localStorage.setItem(LS_PLAYERS, JSON.stringify(_players));
}

function _loadActive() {
  _activePlayerName = localStorage.getItem(LS_ACTIVE) || '';
}

function _saveActive() {
  localStorage.setItem(LS_ACTIVE, _activePlayerName);
}

function _createPlayer(name) {
  return {
    name,
    createdAt: Date.now(),
    lastActive: Date.now(),
    totalPoints: 0
  };
}

// ── Migration ──

function _migrateOldData() {
  // If old tol-explored exists but no tol-players, create default Guest profile
  const oldExplored = localStorage.getItem('tol-explored');
  if (oldExplored && _players.length <= 1) {
    if (_players.length === 0) {
      const guest = _createPlayer('Guest');
      _players.push(guest);
      _savePlayers();
      _activePlayerName = 'Guest';
      _saveActive();
    }
  }
}

// ── Public API ──

export function getActivePlayer() {
  if (!_activePlayerName || !_players.find(p => p.name === _activePlayerName)) {
    return _players[0] || null;
  }
  return _players.find(p => p.name === _activePlayerName) || null;
}

export function setActivePlayer(name) {
  const p = _players.find(p => p.name === name);
  if (p) {
    p.lastActive = Date.now();
    _activePlayerName = name;
    _saveActive();
    _savePlayers();
    _refreshProfile();
  }
}

export function addPlayer(name) {
  name = (name || '').trim().slice(0, 20);
  if (!name) return null;
  // Prevent duplicates
  if (_players.find(p => p.name === name)) return _players.find(p => p.name === name);
  const player = _createPlayer(name);
  _players.push(player);
  _savePlayers();
  return player;
}

export function updatePlayerScore(delta) {
  const p = getActivePlayer();
  if (!p) return;
  p.totalPoints = Math.max(0, (p.totalPoints || 0) + (delta || 0));
  p.lastActive = Date.now();
  _savePlayers();
  // Update header points display if panel open
  const pointsEl = document.getElementById('profile-player-points');
  if (pointsEl) pointsEl.textContent = p.totalPoints + ' pts';
}

// ── Panel open / close ──

export function openProfile() {
  const panel = document.getElementById('profile-panel');
  const backdrop = document.getElementById('profile-backdrop');
  if (!panel) return;
  _refreshProfile();
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  if (backdrop) backdrop.classList.add('open');
  // Focus first tab for a11y
  const firstTab = panel.querySelector('.profile-tab');
  if (firstTab) firstTab.focus();
}

export function closeProfile() {
  const panel = document.getElementById('profile-panel');
  const backdrop = document.getElementById('profile-backdrop');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  if (backdrop) backdrop.classList.remove('open');
}

// ── Active tab ──

let _activeTab = 'leaderboard';

function _switchTab(tab) {
  _activeTab = tab;
  document.querySelectorAll('.profile-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('.profile-section').forEach(sec => {
    sec.classList.toggle('active', sec.dataset.section === tab);
  });
  _renderSection(tab);
}

// ── Full panel refresh ──

function _refreshProfile() {
  _loadPlayers();
  _loadActive();

  // Update header name
  const p = getActivePlayer();
  const nameEl = document.getElementById('profile-player-name');
  const pointsEl = document.getElementById('profile-player-points');
  if (nameEl) nameEl.textContent = p ? p.name : 'Guest';
  if (pointsEl) pointsEl.textContent = p ? (p.totalPoints || 0) + ' pts' : '0 pts';

  // Render active section
  _renderSection(_activeTab);
}

function _renderSection(tab) {
  const content = document.getElementById('profile-content');
  if (!content) return;

  // Find or build sections
  let sec = content.querySelector(`.profile-section[data-section="${tab}"]`);
  if (!sec) {
    // Build all 3 sections if they don't exist yet
    _buildSections(content);
    sec = content.querySelector(`.profile-section[data-section="${tab}"]`);
  }

  // Hide all, show active
  content.querySelectorAll('.profile-section').forEach(s => {
    s.classList.toggle('active', s.dataset.section === tab);
  });

  // Re-render the active section content
  if (tab === 'leaderboard') renderLeaderboard(sec);
  if (tab === 'achievements') renderAchievements(sec);
  if (tab === 'progress') renderKingdomProgress(sec);
}

function _buildSections(content) {
  content.innerHTML = '';
  ['leaderboard', 'achievements', 'progress'].forEach(tab => {
    const sec = document.createElement('div');
    sec.className = 'profile-section' + (tab === _activeTab ? ' active' : '');
    sec.dataset.section = tab;
    content.appendChild(sec);
  });
}

// ── Leaderboard ──

function renderLeaderboard(container) {
  _loadPlayers();
  const active = getActivePlayer();

  // Sort by totalPoints desc, then by createdAt asc
  const sorted = [..._players].sort((a, b) => {
    const pa = a.totalPoints || 0;
    const pb = b.totalPoints || 0;
    if (pb !== pa) return pb - pa;
    return (a.createdAt || 0) - (b.createdAt || 0);
  });

  let html = '<div class="lb-section-title">Players on this device</div>';

  if (sorted.length === 0) {
    html += '<div style="font-size:var(--text-sm);color:var(--text-muted);padding:0.5rem 0;">No players yet. Add your name below!</div>';
  } else {
    html += '<table class="lb-table"><thead><tr><th class="lb-rank">#</th><th>Player</th><th style="text-align:right">Points</th><th></th></tr></thead><tbody>';
    sorted.forEach((p, i) => {
      const isActive = active && p.name === active.name;
      const rank = i === 0 ? '<span class="lb-crown">👑</span>' : (i + 1);
      html += `<tr class="lb-row${isActive ? ' active-player' : ''}">
        <td class="lb-rank">${rank}</td>
        <td>${_esc(p.name)}</td>
        <td class="lb-points">${p.totalPoints || 0}</td>
        <td>${isActive ? '' : `<button class="lb-switch-btn" onclick="window._profileSwitchPlayer('${_esc(p.name)}')">Switch</button>`}</td>
      </tr>`;
    });
    html += '</tbody></table>';
  }

  // Add player form
  html += `<div class="lb-add-player">
    <input id="lb-name-input" type="text" maxlength="20" placeholder="Add player name…" aria-label="New player name">
    <button class="lb-add-btn" onclick="window._profileAddPlayer()">Add</button>
  </div>`;

  container.innerHTML = html;

  // Handle Enter key in input
  const input = container.querySelector('#lb-name-input');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') window._profileAddPlayer();
    });
  }
}

// ── Achievements ──

const CATEGORY_LABELS = {
  explorer:  '🔭 Explorer',
  scholar:   '📚 Scholar',
  pathfinder:'🗺 Pathfinder',
  traveler:  '⏳ Time Traveler',
  secret:    '🔐 Secret'
};

function renderAchievements(container) {
  const unlocked = getUnlockedAchievements ? getUnlockedAchievements() : new Set();

  // Group by category
  const groups = {};
  ACHIEVEMENTS.forEach(a => {
    if (!groups[a.cat]) groups[a.cat] = [];
    groups[a.cat].push(a);
  });

  const totalUnlocked = ACHIEVEMENTS.filter(a => unlocked.has(a.id)).length;
  const totalVisible = ACHIEVEMENTS.filter(a => !a.secret || unlocked.has(a.id)).length;

  let html = '';
  Object.entries(groups).forEach(([cat, list]) => {
    html += `<div class="ach-category-label">${CATEGORY_LABELS[cat] || cat}</div>`;
    html += '<div class="ach-grid">';
    list.forEach(a => {
      const isUnlocked = unlocked.has(a.id);
      const isSecret = a.secret;
      if (isSecret && !isUnlocked) return; // hidden until unlocked
      const classes = ['ach-badge'];
      if (!isUnlocked) classes.push('locked');
      if (isSecret) classes.push('secret');
      if (isUnlocked) classes.push('unlocked');
      html += `<div class="${classes.join(' ')}" onclick="window._profileToggleBadge(this)" title="${_esc(a.desc)}">
        <div class="ach-badge-icon">${a.icon}</div>
        <div class="ach-badge-name">${_esc(a.name)}</div>
        <div class="ach-badge-desc">${_esc(a.desc)}</div>
      </div>`;
    });
    html += '</div>';
  });

  html += `<div class="ach-progress">${totalUnlocked} / ${ACHIEVEMENTS.length} unlocked</div>`;

  container.innerHTML = html;
}

// ── Kingdom Progress ──

// Domain ID → display info
const KINGDOM_DEFS = [
  { id: 'bacteria',  label: 'Bacteria',  icon: '🦠', color: '#ef4444' },
  { id: 'archaea',   label: 'Archaea',   icon: '🌋', color: '#f59e0b' },
  { id: 'fungi',     label: 'Fungi',     icon: '🍄', color: '#f97316' },
  { id: 'plantae',   label: 'Plants',    icon: '🌿', color: '#22c55e' },
  { id: 'animalia',  label: 'Animals',   icon: '🐾', color: '#3b82f6' },
  { id: 'protists',  label: 'Protists',  icon: '🔵', color: '#a855f7' },
];

function _collectDomainNodes() {
  // Walk the nodeMap and group leaf+non-leaf nodes by their _domain field
  const nodeMap = _deps.nodeMap || {};
  const domainCounts = {};
  const domainExplored = {};

  // Initialize
  KINGDOM_DEFS.forEach(k => {
    domainCounts[k.id] = 0;
    domainExplored[k.id] = 0;
  });

  const explored = getExploredSpecies ? getExploredSpecies() : new Set();

  Object.values(nodeMap).forEach(node => {
    if (!node._domain) return;
    // Only count non-root nodes
    if (node.id === 'luca' || node.id === 'eukaryota') return;
    const dom = node._domain;
    if (domainCounts.hasOwnProperty(dom)) {
      domainCounts[dom]++;
      if (explored.has(node.id)) domainExplored[dom]++;
    }
  });

  return { domainCounts, domainExplored };
}

function renderKingdomProgress(container) {
  const { domainCounts, domainExplored } = _collectDomainNodes();
  const explored = getExploredSpecies ? getExploredSpecies() : new Set();
  const nodeMap = _deps.nodeMap || {};
  const totalNodes = Object.keys(nodeMap).filter(id => id !== 'luca' && id !== 'eukaryota').length;
  const totalExplored = explored.size;

  let html = '<div class="kp-section-title">Species explored by kingdom</div>';

  KINGDOM_DEFS.forEach(k => {
    const total = domainCounts[k.id] || 0;
    const done = domainExplored[k.id] || 0;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    html += `<div class="kp-bar">
      <div class="kp-label">${k.icon} ${k.label}</div>
      <div class="kp-track"><div class="kp-fill" style="width:${pct}%;background:${k.color};"></div></div>
      <div class="kp-count">${done}/${total}</div>
    </div>`;
  });

  // Total bar
  const totalPct = totalNodes > 0 ? Math.round((totalExplored / totalNodes) * 100) : 0;
  html += `<div class="kp-bar kp-total-bar">
    <div class="kp-label">🌍 Total</div>
    <div class="kp-track"><div class="kp-fill" style="width:${totalPct}%;"></div></div>
    <div class="kp-count">${totalExplored}/${totalNodes}</div>
  </div>`;

  html += `<div class="ach-progress" style="margin-top:1rem;">${totalPct}% of all species explored</div>`;

  container.innerHTML = html;
}

// ── First-visit name prompt ──

export function initProfile() {
  _loadPlayers();
  _loadActive();
  _migrateOldData();

  // If still no players after migration, schedule name prompt
  if (_players.length === 0) {
    setTimeout(() => {
      if (!localStorage.getItem(LS_ACTIVE)) _promptPlayerName();
    }, 5000);
  }

  // Expose window helpers used inline in generated HTML
  window._profileSwitchPlayer = (name) => {
    setActivePlayer(name);
    // Re-render leaderboard after switch
    const sec = document.querySelector('.profile-section[data-section="leaderboard"]');
    if (sec) renderLeaderboard(sec);
    // Update header
    const nameEl = document.getElementById('profile-player-name');
    const pointsEl = document.getElementById('profile-player-points');
    const p = getActivePlayer();
    if (nameEl) nameEl.textContent = p ? p.name : 'Guest';
    if (pointsEl) pointsEl.textContent = p ? (p.totalPoints || 0) + ' pts' : '0 pts';
  };

  window._profileAddPlayer = () => {
    const input = document.getElementById('lb-name-input');
    if (!input) return;
    const name = input.value.trim().slice(0, 20);
    if (!name) return;
    addPlayer(name);
    setActivePlayer(name);
    input.value = '';
    const sec = document.querySelector('.profile-section[data-section="leaderboard"]');
    if (sec) renderLeaderboard(sec);
    // Update header
    const nameEl = document.getElementById('profile-player-name');
    const pointsEl = document.getElementById('profile-player-points');
    const p = getActivePlayer();
    if (nameEl) nameEl.textContent = p ? p.name : 'Guest';
    if (pointsEl) pointsEl.textContent = p ? (p.totalPoints || 0) + ' pts' : '0 pts';
    // Check secret achievement: 3+ players on same device
    if (_players.length >= 3 && typeof window.checkAchievement === 'function') {
      window.checkAchievement('family_game_night');
    }
  };

  window._profileToggleBadge = (el) => {
    el.classList.toggle('expanded');
  };
}

function _promptPlayerName() {
  try {
    const name = prompt('Welcome! Enter your name for the leaderboard (or leave blank for Guest):');
    const playerName = ((name || '').trim().slice(0, 20)) || 'Guest';
    addPlayer(playerName);
    setActivePlayer(playerName);
  } catch(e) {
    // prompt() blocked or unavailable
    addPlayer('Guest');
    setActivePlayer('Guest');
  }
}

// ── Tab listener setup ──

export function initProfileListeners() {
  // Tab switching via event delegation on the panel
  const panel = document.getElementById('profile-panel');
  if (!panel) return;

  panel.addEventListener('click', e => {
    const tab = e.target.closest('.profile-tab');
    if (tab && tab.dataset.tab) {
      _switchTab(tab.dataset.tab);
    }
  });

  // Close on Escape
  panel.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProfile();
  });

  // Backdrop click closes panel
  const backdrop = document.getElementById('profile-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeProfile);
  }
}

// ── Utilities ──

function _esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
