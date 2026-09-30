// ══════════════════════════════════════════════════════
// PROFILE.JS — Player profiles + household leaderboard
// Manages localStorage-backed multi-player profiles,
// profile panel UI (3 tabs), achievement grid, kingdom progress
// ══════════════════════════════════════════════════════

import { ACHIEVEMENTS } from './achievements.js';
import { registerActions } from './actions.js';
import { getUnlockedAchievements, getExploredSpecies, checkAchievement } from './engagement.js';
import { t } from './theme.js';

let _deps = {};
export function initProfileDeps(deps) { Object.assign(_deps, deps); }

// ── Storage keys ──
const LS_PLAYERS = 'tol-players';
const LS_ACTIVE  = 'tol-active-player';
const LS_ASKED   = 'tol-name-asked';

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
        <td>${isActive ? '' : `<button class="lb-switch-btn" data-action="profile:switch-player" data-arg="${_esc(p.name)}">Switch</button>`}</td>
      </tr>`;
    });
    html += '</tbody></table>';
  }

  // Add player form
  html += `<div class="lb-add-player">
    <input id="lb-name-input" type="text" maxlength="20" placeholder="Add player name…" aria-label="New player name">
    <button class="lb-add-btn" data-action="profile:add-player">Add</button>
  </div>`;

  container.innerHTML = html;

  // Handle Enter key in input
  const input = container.querySelector('#lb-name-input');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') _addPlayerFromInput();
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
      html += `<div class="${classes.join(' ')}" data-action="profile:toggle-badge" title="${_esc(a.desc)}">
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

// ── Setup ──

export function initProfile() {
  _loadPlayers();
  _loadActive();
  /* No Guest is made up here. An earlier version turned anyone with a
     `tol-explored` record into one on their next visit; with the name now asked
     for after a game, that would have made a Guest of every visitor who had
     looked around first — the ordinary one — and so pre-empted the offer.
     The panel already reads "Guest" for a header with no player behind it. */

  registerActions({
    'profile:switch-player': (name) => _switchPlayer(name),
    'profile:add-player':    () => _addPlayerFromInput(),
    'profile:toggle-badge':  (_a, _b, { el }) => el.classList.toggle('expanded'),
    'profile:save-name':     () => _saveOfferedName(),
    'profile:skip-name':     () => _skipOfferedName(),
  });

  // The offer's field is not a button, so Enter is not a click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target && e.target.id === 'name-offer-input') {
      e.preventDefault();
      _saveOfferedName();
    }
  });
}

// ── After a game: the name ──

/* A name used to be asked for by a native prompt(), five seconds after a first
   visit began — before the visitor had done anything to be named for, in a box
   that blocks the page, cannot be styled and was never translated. It is now
   asked once, on the results screen of a game, as a card that can be ignored.
   Nothing else on the site may raise a native dialog: load:no-native-dialogs. */

let _offerPoints = 0;      // what the game that raised the offer scored, credited if a name is kept

function _asked() {
  try { return !!localStorage.getItem(LS_ASKED); } catch (e) { return true; }   // storage blocked: do not nag
}

function _fill(template, name, pts) {
  return String(template)
    .replace('{name}', '<bdi>' + _esc(name) + '</bdi>')
    .replace('{pts}', String(pts));
}

/** Called by every game as its results appear. Points go to whoever is playing.
    And, once, when nobody on this device has a name yet, the first results that
    show a score carry an offer to keep it under one — a game that scored
    nothing has nothing to keep, and does not use up the one ask. */
export function offerNameAfterGame(container, points) {
  _loadPlayers();
  _loadActive();
  const pts = Math.max(0, Math.round(points || 0));
  if (pts && getActivePlayer()) updatePlayerScore(pts);
  if (!container || !pts || _players.length || _asked()) return;

  try { localStorage.setItem(LS_ASKED, '1'); } catch (e) { /* private mode: it will be asked again */ }
  _offerPoints = pts;
  const card = document.createElement('div');
  card.className = 'name-offer';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-labelledby', 'name-offer-title');
  card.innerHTML = `
    <div class="name-offer-title" id="name-offer-title">${_esc(t('name_offer_title'))}</div>
    <div class="name-offer-text">${_esc(t('name_offer_text'))}</div>
    <div class="lb-add-player">
      <input id="name-offer-input" type="text" maxlength="20" autocomplete="nickname" enterkeyhint="done"
             placeholder="${_esc(t('name_offer_placeholder'))}" aria-label="${_esc(t('name_offer_placeholder'))}">
      <button class="lb-add-btn" type="button" data-action="profile:save-name">${_esc(t('name_offer_save'))}</button>
    </div>
    <button class="name-offer-skip" type="button" data-action="profile:skip-name">${_esc(t('name_offer_skip'))}</button>`;
  const actions = container.querySelector('.trivia-result-actions');
  if (actions) actions.before(card); else container.append(card);
}

function _saveOfferedName() {
  const input = document.getElementById('name-offer-input');
  const name = input ? input.value.trim().slice(0, 20) : '';
  if (!name) { if (input) input.focus(); return; }
  addPlayer(name);
  setActivePlayer(name);
  if (_offerPoints) updatePlayerScore(_offerPoints);
  _offerPoints = 0;
  const p = getActivePlayer();
  const card = document.querySelector('.name-offer');
  if (card) {
    card.innerHTML = `<div class="name-offer-done" role="status" tabindex="-1">${_fill(t('name_offer_saved'), name, p ? p.totalPoints || 0 : 0)}</div>`;
    // The field that had focus is gone. Left alone, focus falls back to the top of the page:
    // it moves to the words that replaced it, so a keyboard or a screen reader carries on from there.
    card.querySelector('.name-offer-done').focus({ preventScroll: true });
  }
  _refreshPlayerHeader();
}

function _skipOfferedName() {
  _offerPoints = 0;
  const card = document.querySelector('.name-offer');
  if (!card) return;
  const next = card.parentElement && card.parentElement.querySelector('.trivia-result-actions button');
  card.remove();
  if (next) next.focus({ preventScroll: true });          // the button that had focus went with the card
}

/* Repaint the header and the leaderboard after the active player changes.
   Both entry points below end the same way. */
function _refreshPlayerHeader() {
  const sec = document.querySelector('.profile-section[data-section="leaderboard"]');
  if (sec) renderLeaderboard(sec);
  const nameEl = document.getElementById('profile-player-name');
  const pointsEl = document.getElementById('profile-player-points');
  const p = getActivePlayer();
  if (nameEl) nameEl.textContent = p ? p.name : 'Guest';
  if (pointsEl) pointsEl.textContent = p ? (p.totalPoints || 0) + ' pts' : '0 pts';
}

function _switchPlayer(name) {
  setActivePlayer(name);
  _refreshPlayerHeader();
}

function _addPlayerFromInput() {
  const input = document.getElementById('lb-name-input');
  if (!input) return;
  const name = input.value.trim().slice(0, 20);
  if (!name) return;
  addPlayer(name);
  setActivePlayer(name);
  input.value = '';
  _refreshPlayerHeader();
  /* Secret achievement: three players on one device. This used to be
     guarded on `typeof window.checkAchievement === 'function'`, and nothing
     ever assigned that global — so the achievement could not be won. It is
     an ordinary import now. */
  if (_players.length >= 3) checkAchievement('family_game_night');
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
