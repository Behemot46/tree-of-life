// ══════════════════════════════════════════════════════
// WHO APPEARED FIRST? — Game mode
// Pick which of two species appeared earlier in evolution
// ══════════════════════════════════════════════════════

import { nodeMap } from './state.js';
import { getTimeContext } from './utils.js';
import { PHOTO_MAP } from './data.js';

let _t, _checkAchievement;
export function initWhoFirstDeps(deps) {
  _t = deps.t;
  _checkAchievement = deps.checkAchievement;
}
function t(key) { return _t ? _t(key) : key; }

const ROUNDS = 10;
const PTS_CORRECT = 10;
const PTS_STREAK_BONUS = 5;

let wfState = null;

export function startWhoFirst() {
  wfState = {
    round: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    pair: null,
    history: []
  };
  showWhoFirstQuestion();
}

function pickPair() {
  const leaves = Object.values(nodeMap).filter(n =>
    (!n.children || n.children.length === 0) && n.appeared > 0
  );
  if (leaves.length < 2) return null;
  let a, b, attempts = 0;
  do {
    a = leaves[Math.floor(Math.random() * leaves.length)];
    b = leaves[Math.floor(Math.random() * leaves.length)];
    attempts++;
  } while ((a.id === b.id || a.appeared === b.appeared) && attempts < 50);
  if (a.id === b.id) return null;
  return { a, b };
}

function getBridgeFact(older, newer) {
  const diff = older.appeared - newer.appeared;
  const tc = getTimeContext(older.appeared, older.id);
  if (older.funFact) return older.funFact;
  if (older.tipFact) return older.tipFact;
  const diffStr = diff >= 1000 ? `${(diff / 1000).toFixed(1)} billion` : `${Math.round(diff)} million`;
  let fact = `${older.name} appeared ${diffStr} years before ${newer.name}.`;
  if (tc) fact += ` ${tc.text}.`;
  return fact;
}

function showWhoFirstQuestion() {
  const s = wfState;
  const container = document.getElementById('game-question');
  if (!container) return;

  if (s.round >= ROUNDS) { showWhoFirstResults(); return; }

  const pair = pickPair();
  if (!pair) { showWhoFirstResults(); return; }
  s.pair = pair;
  s.answered = false;

  const photoA = PHOTO_MAP[pair.a.id] || '';
  const photoB = PHOTO_MAP[pair.b.id] || '';

  container.style.display = '';
  container.innerHTML = `
    <div class="trivia-header">
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
      <div style="font-size:var(--text-sm);color:var(--text-secondary);">Round ${s.round + 1}/${ROUNDS}</div>
      <div class="trivia-score-display">${s.score} pts</div>
    </div>
    <div class="trivia-progress"><div class="trivia-progress-fill" style="width:${(s.round / ROUNDS) * 100}%"></div></div>
    ${s.streak >= 3 ? `<div style="text-align:center;margin:0.3rem 0;"><span class="trivia-streak-badge">🔥 ${s.streak} streak!</span></div>` : ''}
    <div style="text-align:center;font-size:var(--text-base);color:var(--text-primary);margin:0.8rem 0 0.5rem;font-weight:600;">Which appeared first?</div>
    <div class="wf-cards">
      <button class="wf-card" data-action="wf-pick" data-pick="a">
        ${photoA ? `<img src="${photoA}" alt="${pair.a.name}" class="wf-card-img" crossorigin="anonymous" onerror="this.style.display='none'">` : ''}
        <div class="wf-card-icon">${pair.a.icon || '🧬'}</div>
        <div class="wf-card-name">${pair.a.name}</div>
        <div class="wf-card-latin">${pair.a.latin || ''}</div>
      </button>
      <div class="wf-vs">?</div>
      <button class="wf-card" data-action="wf-pick" data-pick="b">
        ${photoB ? `<img src="${photoB}" alt="${pair.b.name}" class="wf-card-img" crossorigin="anonymous" onerror="this.style.display='none'">` : ''}
        <div class="wf-card-icon">${pair.b.icon || '🧬'}</div>
        <div class="wf-card-name">${pair.b.name}</div>
        <div class="wf-card-latin">${pair.b.latin || ''}</div>
      </button>
    </div>
    <div class="wf-reveal" id="wf-reveal" style="display:none"></div>
    <button class="trivia-next-btn" id="wf-next" data-action="wf-next" style="display:none;">Next</button>
    <div style="text-align:center;margin-top:0.5rem;">
      <button class="zbtn" data-action="wf-dice" title="Random new pair" style="font-size:1rem;">🎲 Skip</button>
    </div>
  `;
}

export function answerWhoFirst(pick) {
  const s = wfState;
  if (!s || s.answered) return;
  s.answered = true;

  const { a, b } = s.pair;
  const correctPick = a.appeared >= b.appeared ? 'a' : 'b';
  const isCorrect = pick === correctPick;
  const older = a.appeared >= b.appeared ? a : b;
  const newer = a.appeared >= b.appeared ? b : a;

  if (isCorrect) {
    s.score += PTS_CORRECT + (s.streak >= 1 ? PTS_STREAK_BONUS * s.streak : 0);
    s.streak++;
    if (s.streak > s.bestStreak) s.bestStreak = s.streak;
  } else {
    s.streak = 0;
  }

  const cards = document.querySelectorAll('.wf-card');
  cards.forEach(card => {
    card.disabled = true;
    const p = card.dataset.pick;
    if (p === correctPick) card.classList.add('correct');
    else if (p === pick && !isCorrect) card.classList.add('wrong');
  });

  const vs = document.querySelector('.wf-vs');
  if (vs) vs.textContent = isCorrect ? '✓' : '✗';

  const reveal = document.getElementById('wf-reveal');
  if (reveal) {
    const bridgeFact = getBridgeFact(older, newer);
    reveal.style.display = '';
    reveal.innerHTML = `
      <div class="wf-reveal-header">${isCorrect ? '✅ Correct!' : '❌ Not quite!'}</div>
      <div class="wf-reveal-dates">
        <span><strong>${older.name}</strong>: ${older.appeared >= 1000 ? (older.appeared / 1000).toFixed(1) + ' Bya' : older.appeared + ' Mya'}</span>
        <span><strong>${newer.name}</strong>: ${newer.appeared >= 1000 ? (newer.appeared / 1000).toFixed(1) + ' Bya' : newer.appeared + ' Mya'}</span>
      </div>
      <div class="wf-bridge-fact">💡 ${bridgeFact}</div>
    `;
  }

  const nextBtn = document.getElementById('wf-next');
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.textContent = s.round >= ROUNDS - 1 ? 'See Results' : 'Next';
  }

  const scoreEl = document.querySelector('.trivia-score-display');
  if (scoreEl) scoreEl.textContent = `${s.score} pts`;

  s.round++;
  s.history.push({ a: a.id, b: b.id, correct: correctPick, picked: pick, isCorrect });
}

export function nextWhoFirst() {
  if (wfState && wfState.round >= ROUNDS) showWhoFirstResults();
  else showWhoFirstQuestion();
}

export function diceWhoFirst() {
  if (wfState && !wfState.answered) showWhoFirstQuestion();
}

function showWhoFirstResults() {
  const s = wfState;
  const container = document.getElementById('game-result');
  const qEl = document.getElementById('game-question');
  if (qEl) qEl.style.display = 'none';
  if (!container) return;
  container.style.display = '';

  const correct = s.history.filter(h => h.isCorrect).length;
  const emoji = correct >= 9 ? '🌟' : correct >= 7 ? '🎉' : correct >= 5 ? '👍' : '📚';

  const key = 'tol-game-whofirst-high';
  const prev = parseInt(localStorage.getItem(key) || '0', 10);
  const isNew = s.score > prev;
  if (isNew) localStorage.setItem(key, String(s.score));

  container.innerHTML = `
    <div class="trivia-header">
      <div class="trivia-title">Who Appeared First?</div>
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
    </div>
    <div class="trivia-result-emoji">${emoji}</div>
    <div class="trivia-result-score">${s.score}</div>
    <div class="trivia-result-label">points</div>
    <div class="trivia-result-stats">
      <div class="trivia-stat">
        <div class="trivia-stat-value">${correct}/${ROUNDS}</div>
        <div class="trivia-stat-label">Correct</div>
      </div>
      <div class="trivia-stat">
        <div class="trivia-stat-value">🔥 ${s.bestStreak}</div>
        <div class="trivia-stat-label">Best Streak</div>
      </div>
    </div>
    ${isNew ? '<div style="text-align:center;color:var(--accent-primary);font-weight:600;font-size:var(--text-base);margin-bottom:1rem;">🏆 New high score!</div>' : ''}
    <div class="trivia-result-actions">
      <button class="trivia-start-btn" data-action="play-again">Play Again</button>
      <button class="trivia-next-btn" data-action="close-game">Close</button>
    </div>
  `;
}
