// ══════════════════════════════════════════════════════
// GAME — Unified quiz/trivia game with mode selector
// Modes: Quick Quiz (5q), Classic Trivia (15q), Survival (endless)
// ══════════════════════════════════════════════════════

import { TRIVIA_QUESTIONS } from './triviaData.js';
import { checkAchievement, trackQuizComplete } from './engagement.js';
import { startWhoFirst, answerWhoFirst, nextWhoFirst, diceWhoFirst } from './whoFirst.js';
import { startFamilyFoe, answerFamilyFoe, nextFamilyFoe, diceFamilyFoe } from './familyFoe.js';

// ── Late-binding deps ──
let _t, _navigateTo;
export function initGameDeps(deps) {
  _t = deps.t;
  _navigateTo = deps.navigateTo;
}
function t(key) { return _t ? _t(key) : key; }

// ── Constants ──
const POINTS = {1:10,2:10,3:20,4:20,5:30,6:30,7:50,8:50,9:100,10:100};
const TIERS = [
  {min:1,max:2,label:'Easy',cls:'easy'},
  {min:3,max:4,label:'Medium',cls:'medium'},
  {min:5,max:6,label:'Hard',cls:'hard'},
  {min:7,max:8,label:'Expert',cls:'expert'},
  {min:9,max:10,label:'Master',cls:'master'}
];
const LETTERS = ['A','B','C','D'];

// ── localStorage keys ──
const LS_QUICK_HIGH = 'tol-game-quick-high';
const LS_SURVIVAL_HIGH = 'tol-game-survival-high';
const LS_SURVIVAL_STREAK = 'tol-game-survival-streak';

// ── State ──
let gameState = null;
let _sessionCorrect = new Set(); // question IDs answered correctly this session
let _lastCorrectSlots = [];      // track last 2 correct-answer positions

function getHigh(key) { return parseInt(localStorage.getItem(key) || '0', 10); }
function setHigh(key, val) { localStorage.setItem(key, String(val)); }

function shuffleAnswers(question) {
  // Clone to avoid mutating original
  const q = { ...question, answers: [...question.answers] };
  // Fisher-Yates shuffle of answers, tracking where correct moved
  const correctText = q.answers[q.correct];
  for (let i = q.answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [q.answers[i], q.answers[j]] = [q.answers[j], q.answers[i]];
  }
  q.correct = q.answers.indexOf(correctText);

  // Prevent same correct slot 3 times in a row
  if (_lastCorrectSlots.length >= 2 &&
      _lastCorrectSlots[0] === q.correct &&
      _lastCorrectSlots[1] === q.correct) {
    // Swap correct answer with a different slot
    const alt = (q.correct + 1 + Math.floor(Math.random() * 3)) % 4;
    [q.answers[q.correct], q.answers[alt]] = [q.answers[alt], q.answers[q.correct]];
    q.correct = alt;
  }
  _lastCorrectSlots = [q.correct, ..._lastCorrectSlots].slice(0, 2);
  return q;
}

// ── Question selection ──
function pickQuestions(mode) {
  const qs = TRIVIA_QUESTIONS;
  if (!qs || !qs.length) return [];
  // Filter out questions already answered correctly this session
  const available = qs.filter(q => !_sessionCorrect.has(q.id));
  const pool = available.length >= 5 ? available : qs; // fallback if pool too small

  if (mode === 'quick') {
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
  }
  if (mode === 'classic') {
    const selected = [];
    for (const tier of TIERS) {
      const tierPool = pool.filter(q => q.difficulty >= tier.min && q.difficulty <= tier.max);
      selected.push(...[...tierPool].sort(() => Math.random() - 0.5).slice(0, 3));
    }
    return selected;
  }
  if (mode === 'survival') {
    return [...pool].sort(() => Math.random() - 0.5);
  }
  return [];
}

function getTierLabel(diff) {
  const tier = TIERS.find(t => diff >= t.min && diff <= t.max);
  return tier || TIERS[0];
}

function getSurvivalMinDifficulty(correctCount) {
  if (correctCount >= 20) return 9;
  if (correctCount >= 15) return 7;
  if (correctCount >= 10) return 5;
  if (correctCount >= 5) return 3;
  return 1;
}

// ══════════════════════════════════════════════════════
// OPEN / CLOSE
// ══════════════════════════════════════════════════════

export function openGame() {
  gameState = null;
  _sessionCorrect = new Set();
  _lastCorrectSlots = [];
  const panel = document.getElementById('game-panel');
  if (!panel) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  showModeSelector();
}

export function closeGame() {
  const panel = document.getElementById('game-panel');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  gameState = null;
}

// ══════════════════════════════════════════════════════
// MODE SELECTOR
// ══════════════════════════════════════════════════════

function showModeSelector() {
  const sel = document.getElementById('game-mode-select');
  const qEl = document.getElementById('game-question');
  const rEl = document.getElementById('game-result');
  if (sel) sel.style.display = '';
  if (qEl) qEl.style.display = 'none';
  if (rEl) rEl.style.display = 'none';

  if (!sel) return;
  const quickHigh = getHigh(LS_QUICK_HIGH);
  const survHigh = getHigh(LS_SURVIVAL_HIGH);
  const survStreak = getHigh(LS_SURVIVAL_STREAK);
  const today = new Date().toISOString().slice(0, 10);
  const dailyDone = localStorage.getItem('tol-daily-' + today);
  const dailyStreak = parseInt(localStorage.getItem('tol-daily-streak') || '0', 10);

  sel.innerHTML = `
    <div class="trivia-header">
      <div class="trivia-title">🧠 Evolution Challenge</div>
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
    </div>
    <div class="trivia-subtitle">Choose your game mode</div>
    <div class="game-modes">
      <button class="game-mode-card ${dailyDone ? 'daily-done' : 'daily-active'}" data-mode="daily" data-action="select-mode">
        <div class="game-mode-icon">${dailyDone ? '✅' : '📅'}</div>
        <div class="game-mode-info">
          <div class="game-mode-name">Daily Challenge</div>
          <div class="game-mode-desc">${dailyDone ? 'Completed today!' : 'One question · Streak: ' + dailyStreak + ' days'}</div>
        </div>
      </button>
      <button class="game-mode-card" data-mode="quick" data-action="select-mode">
        <div class="game-mode-icon">⚡</div>
        <div class="game-mode-info">
          <div class="game-mode-name">Quick Quiz</div>
          <div class="game-mode-desc">5 random questions · No pressure</div>
          ${quickHigh > 0 ? `<div class="game-mode-meta">Best: ${quickHigh}/5</div>` : ''}
        </div>
      </button>
      <button class="game-mode-card" data-mode="classic" data-action="select-mode">
        <div class="game-mode-icon">🏆</div>
        <div class="game-mode-info">
          <div class="game-mode-name">Classic Trivia</div>
          <div class="game-mode-desc">15 questions · 3 lives · 5 tiers</div>
          <div class="game-mode-meta">Easy → Medium → Hard → Expert → Master</div>
        </div>
      </button>
      <button class="game-mode-card" data-mode="survival" data-action="select-mode">
        <div class="game-mode-icon">🔥</div>
        <div class="game-mode-info">
          <div class="game-mode-name">Survival</div>
          <div class="game-mode-desc">Endless · 1 life · Rising difficulty</div>
          ${survHigh > 0 ? `<div class="game-mode-meta">Record: ${survHigh} pts · ${survStreak} streak</div>` : ''}
        </div>
      </button>
      <button class="game-mode-card" data-mode="who-first" data-action="select-mode">
        <div class="game-mode-icon">⏳</div>
        <div class="game-mode-info">
          <div class="game-mode-name">Who Appeared First?</div>
          <div class="game-mode-desc">10 rounds · Pick the older species</div>
          ${getHigh('tol-game-whofirst-high') > 0 ? `<div class="game-mode-meta">Best: ${getHigh('tol-game-whofirst-high')} pts</div>` : ''}
        </div>
      </button>
      <button class="game-mode-card" data-mode="family-foe" data-action="select-mode">
        <div class="game-mode-icon">🤝</div>
        <div class="game-mode-info">
          <div class="game-mode-name">Family or Foe?</div>
          <div class="game-mode-desc">8 rounds · Guess the closer relative</div>
          ${getHigh('tol-game-familyfoe-high') > 0 ? `<div class="game-mode-meta">Best: ${getHigh('tol-game-familyfoe-high')} pts</div>` : ''}
        </div>
      </button>
    </div>
    <div class="trivia-difficulty-preview">
      <span class="trivia-diff-badge easy">Easy 10pts</span>
      <span class="trivia-diff-badge medium">Medium 20pts</span>
      <span class="trivia-diff-badge hard">Hard 30pts</span>
      <span class="trivia-diff-badge expert">Expert 50pts</span>
      <span class="trivia-diff-badge master">Master 100pts</span>
    </div>
  `;
}

// ══════════════════════════════════════════════════════
// START GAME
// ══════════════════════════════════════════════════════

function startGame(mode) {
  if (!mode) return;
  if (mode === 'daily') {
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem('tol-daily-' + today)) return;
    let hash = 0;
    for (let i = 0; i < today.length; i++) hash = ((hash << 5) - hash + today.charCodeAt(i)) | 0;
    const qIdx = ((hash % TRIVIA_QUESTIONS.length) + TRIVIA_QUESTIONS.length) % TRIVIA_QUESTIONS.length;
    const q = TRIVIA_QUESTIONS[qIdx];
    gameState = {
      mode: 'daily', questions: [q], currentIndex: 0,
      score: 0, lives: 0, streak: 0, bestStreak: 0,
      answered: false, tierScores: {}, difficultyLevel: 1, correctCount: 0
    };
    TIERS.forEach(t => { gameState.tierScores[t.cls] = {correct:0, total:0}; });
    document.getElementById('game-mode-select').style.display = 'none';
    document.getElementById('game-question').style.display = '';
    document.getElementById('game-result').style.display = 'none';
    showQuestion();
    return;
  }
  if (mode === 'who-first') {
    document.getElementById('game-mode-select').style.display = 'none';
    document.getElementById('game-question').style.display = '';
    document.getElementById('game-result').style.display = 'none';
    startWhoFirst();
    return;
  }
  if (mode === 'family-foe') {
    document.getElementById('game-mode-select').style.display = 'none';
    document.getElementById('game-question').style.display = '';
    document.getElementById('game-result').style.display = 'none';
    startFamilyFoe();
    return;
  }
  const questions = pickQuestions(mode);
  if (!questions.length) return;

  gameState = {
    mode,
    questions,
    currentIndex: 0,
    score: 0,
    lives: mode === 'classic' ? 3 : mode === 'survival' ? 1 : 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    tierScores: {},
    difficultyLevel: 1,
    correctCount: 0
  };
  TIERS.forEach(t => { gameState.tierScores[t.cls] = {correct:0, total:0}; });

  document.getElementById('game-mode-select').style.display = 'none';
  document.getElementById('game-question').style.display = '';
  document.getElementById('game-result').style.display = 'none';
  showQuestion();
}

// ══════════════════════════════════════════════════════
// QUESTION SCREEN
// ══════════════════════════════════════════════════════

function getCurrentQuestion() {
  const s = gameState;
  if (s.mode === 'survival') {
    // Filter by minimum difficulty for survival progression
    const minDiff = getSurvivalMinDifficulty(s.correctCount);
    const remaining = s.questions.filter(q => q.difficulty >= minDiff);
    // Fallback: if no questions at required difficulty, use any remaining
    const pool = remaining.length > 0 ? remaining : s.questions;
    if (pool.length === 0) return null;
    // Pop the first one that meets the difficulty
    const q = pool[0];
    s.questions = s.questions.filter(x => x !== q);
    return q;
  }
  return s.questions[s.currentIndex] || null;
}

function showQuestion() {
  const s = gameState;
  const container = document.getElementById('game-question');
  if (!container) return;

  let q;
  if (s.mode === 'survival') {
    q = getCurrentQuestion();
    if (!q) { showResults(); return; }
    s._currentQuestion = shuffleAnswers(q);
  } else {
    q = s.questions[s.currentIndex];
    if (!q) { showResults(); return; }
    s._currentQuestion = shuffleAnswers(q);
  }
  // Use the shuffled question for rendering so answers and correct index are consistent
  q = s._currentQuestion;

  const tier = getTierLabel(q.difficulty);
  const pts = s.mode === 'quick' ? 1 : POINTS[q.difficulty];

  // Progress display
  let progressText;
  if (s.mode === 'quick') progressText = `Q ${s.currentIndex + 1}/5`;
  else if (s.mode === 'classic') progressText = `Q ${s.currentIndex + 1}/15`;
  else progressText = `Q ${s.currentIndex + 1}`;

  // Total for progress bar
  const total = s.mode === 'survival' ? Math.max(s.currentIndex + 5, 10) : s.questions.length;

  // Lives HTML
  let livesHtml = '';
  if (s.mode === 'classic') {
    livesHtml = '<div class="trivia-lives" id="game-lives">';
    for (let i = 0; i < 3; i++) livesHtml += `<span${i >= s.lives ? ' class="lost"' : ''}>❤️</span>`;
    livesHtml += '</div>';
  } else if (s.mode === 'survival') {
    livesHtml = '<div class="trivia-lives" id="game-lives">';
    livesHtml += `<span${s.lives <= 0 ? ' class="lost"' : ''}>❤️</span>`;
    livesHtml += '</div>';
  }

  // Score display
  const scoreText = s.mode === 'quick' ? `${s.score}/5` : `${s.score} pts`;

  // Streak badge
  const streakHtml = (s.mode !== 'quick' && s.streak >= 3)
    ? `<span class="trivia-streak-badge">${s.streak >= 5 ? '🔥 Unstoppable!' : '🔥 ' + s.streak + ' streak!'}</span>`
    : '';

  container.innerHTML = `
    <div class="trivia-header">
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
      <div style="font-size:var(--text-sm);color:var(--text-secondary);">${progressText}</div>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        ${livesHtml}
        <div class="trivia-score-display" id="game-score">${scoreText}</div>
      </div>
    </div>
    <div class="trivia-progress"><div class="trivia-progress-fill" style="width:${((s.currentIndex) / total) * 100}%"></div></div>
    <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
      <span class="trivia-diff-badge ${tier.cls}">${tier.label}</span>
      <span style="font-size:var(--text-2xs);color:var(--text-secondary);">${pts} ${s.mode === 'quick' ? 'pt' : 'pts'}</span>
      <span style="font-size:var(--text-2xs);color:var(--text-secondary);margin-left:auto;">${q.category}</span>
      ${streakHtml}
    </div>
    <div class="trivia-question-text trivia-fadein">${q.question}</div>
    <div class="trivia-options" id="game-options">
      ${q.answers.map((a, i) => `<button class="trivia-option game-option" data-idx="${i}">
        <span class="opt-letter">${LETTERS[i]}</span><span>${a}</span>
      </button>`).join('')}
    </div>
    <div class="trivia-feedback" id="game-feedback">
      <div class="trivia-funfact" id="game-funfact"></div>
      <div class="trivia-learn-more" id="game-learn-more"></div>
    </div>
    <button class="trivia-next-btn" id="game-next-btn" data-action="next-question" style="display:none;">Next Question</button>
  `;
}

// ══════════════════════════════════════════════════════
// ANSWER
// ══════════════════════════════════════════════════════

function answerQuestion(idx) {
  const s = gameState;
  if (!s || s.answered) return;
  s.answered = true;

  const q = s._currentQuestion;
  const tier = getTierLabel(q.difficulty);
  const isCorrect = idx === q.correct;

  // Update tier stats
  s.tierScores[tier.cls].total++;

  // Highlight options
  const options = document.querySelectorAll('#game-options .trivia-option');
  options.forEach((btn, i) => {
    btn.classList.add('answered');
    if (i === q.correct) btn.classList.add('correct');
    else if (i === idx && !isCorrect) {
      btn.classList.add('wrong');
      btn.classList.add('trivia-shake');
    }
    if (i !== q.correct && i !== idx) btn.classList.add('reveal');
  });

  if (isCorrect) {
    s.streak++;
    s.correctCount++;
    if (s.streak > s.bestStreak) s.bestStreak = s.streak;
    s.tierScores[tier.cls].correct++;
    if (q.id) _sessionCorrect.add(q.id);

    if (s.mode === 'quick') {
      s.score++;
    } else {
      const basePts = POINTS[q.difficulty];
      const streakBonus = s.streak >= 3 ? s.streak * 5 : 0;
      const totalPts = basePts + streakBonus;
      s.score += totalPts;
      showPointsPopup('+' + totalPts + (streakBonus ? ' (🔥+' + streakBonus + ')' : ''));
    }

    // Update score display
    const scoreEl = document.getElementById('game-score');
    if (scoreEl) scoreEl.textContent = s.mode === 'quick' ? `${s.score}/5` : `${s.score} pts`;
  } else {
    s.streak = 0;
    if (s.lives > 0) {
      s.lives--;
      const livesEl = document.getElementById('game-lives');
      if (livesEl) {
        if (s.mode === 'classic') {
          let html = '';
          for (let i = 0; i < 3; i++) html += `<span${i >= s.lives ? ' class="lost"' : ''}>❤️</span>`;
          livesEl.innerHTML = html;
        } else if (s.mode === 'survival') {
          livesEl.innerHTML = `<span class="lost">❤️</span>`;
        }
      }
    }
  }

  // Show feedback
  const feedback = document.getElementById('game-feedback');
  if (feedback) feedback.classList.add('show');
  const funfactEl = document.getElementById('game-funfact');
  if (funfactEl && q.funFact) funfactEl.textContent = '💡 ' + q.funFact;
  const learnMore = document.getElementById('game-learn-more');
  if (learnMore && q.learnMoreUrl) {
    learnMore.innerHTML = '📺 <a href="' + q.learnMoreUrl + '" target="_blank" rel="noopener">Learn More</a>';
  }

  // Quick mode: auto-advance after 1.8s
  if (s.mode === 'quick') {
    setTimeout(() => nextQuestion(), 1800);
    return;
  }

  // Classic/Survival: show Next button
  const nextBtn = document.getElementById('game-next-btn');
  if (nextBtn) {
    const isGameOver = (s.mode === 'survival' && !isCorrect) ||
                       (s.mode === 'classic' && s.lives <= 0) ||
                       (s.mode === 'classic' && s.currentIndex >= s.questions.length - 1);
    nextBtn.textContent = isGameOver ? 'See Results' : 'Next Question';
    nextBtn.style.display = '';
  }
}

// ══════════════════════════════════════════════════════
// NEXT QUESTION
// ══════════════════════════════════════════════════════

function nextQuestion() {
  const s = gameState;
  if (!s) return;

  // Check game-over conditions
  if (s.mode === 'survival' && s.lives <= 0) { showResults(); return; }
  if (s.mode === 'classic' && s.lives <= 0) { showResults(); return; }
  if (s.mode !== 'survival' && s.currentIndex >= s.questions.length - 1) { showResults(); return; }

  s.currentIndex++;
  s.answered = false;
  showQuestion();
}

// ══════════════════════════════════════════════════════
// POINTS POPUP
// ══════════════════════════════════════════════════════

function showPointsPopup(text) {
  const container = document.querySelector('.trivia-panel-inner');
  if (!container) return;
  const popup = document.createElement('div');
  popup.className = 'trivia-points-popup';
  popup.textContent = text;
  container.appendChild(popup);
  setTimeout(() => popup.remove(), 1000);
}

// ══════════════════════════════════════════════════════
// RESULTS SCREEN
// ══════════════════════════════════════════════════════

function showResults() {
  const s = gameState;
  if (!s) return;

  document.getElementById('game-question').style.display = 'none';
  const result = document.getElementById('game-result');
  result.style.display = '';

  if (s.mode === 'quick') return showQuickResults(result);
  if (s.mode === 'classic') return showClassicResults(result);
  if (s.mode === 'survival') return showSurvivalResults(result);
  if (s.mode === 'daily') return showDailyResults(result);
}

function showDailyResults(container) {
  const s = gameState;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('tol-daily-' + today, s.correctCount > 0 ? 'correct' : 'wrong');
  let streak = parseInt(localStorage.getItem('tol-daily-streak') || '0', 10);
  if (s.correctCount > 0) {
    streak++;
    localStorage.setItem('tol-daily-streak', String(streak));
  } else {
    localStorage.setItem('tol-daily-streak', '0');
    streak = 0;
  }
  const emoji = s.correctCount > 0 ? '🌟' : '📚';
  container.innerHTML = `
    <div class="trivia-header">
      <div class="trivia-title">Daily Challenge</div>
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
    </div>
    <div class="trivia-result-emoji">${emoji}</div>
    <div class="trivia-result-score">${s.correctCount > 0 ? 'Correct!' : 'Not today...'}</div>
    <div class="trivia-result-label">${streak > 0 ? `🔥 ${streak} day streak!` : 'Try again tomorrow!'}</div>
    <div class="trivia-result-actions">
      <button class="trivia-next-btn" data-action="close-game">Close</button>
    </div>
  `;
}

function showQuickResults(container) {
  const s = gameState;
  const highScore = getHigh(LS_QUICK_HIGH);
  const isNewHigh = s.score > highScore;
  if (isNewHigh) setHigh(LS_QUICK_HIGH, s.score);
  const perfect = s.score === 5;
  if (perfect) checkAchievement('quiz_champion');
  trackQuizComplete('quick', s.score, s.score, s.bestStreak);

  const emoji = perfect ? '🌟' : s.score >= 4 ? '🎉' : s.score >= 3 ? '👍' : '📚';

  container.innerHTML = `
    <div class="trivia-header">
      <div class="trivia-title">Quick Quiz</div>
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
    </div>
    <div class="trivia-result-emoji">${emoji}</div>
    <div class="trivia-result-score">${s.score}/5</div>
    <div class="trivia-result-label">${perfect ? 'Perfect score!' : s.score >= 3 ? 'Great job!' : 'Keep learning!'}</div>
    ${isNewHigh ? '<div style="text-align:center;color:var(--accent-primary);font-weight:600;font-size:var(--text-base);margin-bottom:1rem;">🏆 New high score!</div>' : `<div style="text-align:center;color:var(--text-muted);font-size:var(--text-sm);margin-bottom:1rem;">Best: ${Math.max(highScore, s.score)}/5</div>`}
    <div class="trivia-result-actions">
      <button class="trivia-start-btn" data-action="play-again">Play Again</button>
      <button class="trivia-next-btn" data-action="close-game">Close</button>
    </div>
  `;
}

function showClassicResults(container) {
  const s = gameState;
  const answered = Math.min(s.currentIndex + 1, s.questions.length);
  let correctCount = 0;
  TIERS.forEach(t => { correctCount += s.tierScores[t.cls].correct; });
  trackQuizComplete('classic', s.score, correctCount, s.bestStreak);

  const maxPossible = s.questions.reduce((sum, q) => sum + POINTS[q.difficulty], 0);
  const pct = maxPossible > 0 ? s.score / maxPossible : 0;
  const stars = pct >= 0.7 ? 3 : pct >= 0.4 ? 2 : pct > 0 ? 1 : 0;
  const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

  const emoji = s.lives <= 0 ? '💀' : (stars >= 3 ? '🏆' : stars >= 2 ? '🎉' : '💪');
  const title = s.lives <= 0 ? 'Game Over' : 'Complete!';

  let breakdownHTML = '';
  TIERS.forEach(tier => {
    const ts = s.tierScores[tier.cls];
    if (ts.total > 0) {
      breakdownHTML += `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.3rem 0;font-size:var(--text-sm);">
        <span class="trivia-diff-badge ${tier.cls}">${tier.label}</span>
        <span style="color:var(--text-secondary);font-family:var(--font-mono);">${ts.correct}/${ts.total}</span>
      </div>`;
    }
  });

  container.innerHTML = `
    <div class="trivia-header">
      <div class="trivia-title">${title}</div>
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
    </div>
    <div class="trivia-result-emoji">${emoji}</div>
    <div class="trivia-result-score">${s.score}</div>
    <div class="trivia-result-label">points · ${starStr}</div>
    <div class="trivia-result-stats">
      <div class="trivia-stat">
        <div class="trivia-stat-value">${correctCount}/${answered}</div>
        <div class="trivia-stat-label">Correct</div>
      </div>
      <div class="trivia-stat">
        <div class="trivia-stat-value">🔥 ${s.bestStreak}</div>
        <div class="trivia-stat-label">Best Streak</div>
      </div>
    </div>
    <div style="background:var(--surface-raised);border-radius:var(--radius-md);padding:0.6rem 0.8rem;margin-bottom:1rem;">
      ${breakdownHTML}
    </div>
    <div class="trivia-result-actions">
      <button class="trivia-start-btn" data-action="play-again">Play Again</button>
      <button class="trivia-next-btn" data-action="close-game">Close</button>
    </div>
  `;
}

function showSurvivalResults(container) {
  const s = gameState;
  const prevHigh = getHigh(LS_SURVIVAL_HIGH);
  const prevStreak = getHigh(LS_SURVIVAL_STREAK);
  const isNewHigh = s.score > prevHigh;
  const isNewStreak = s.correctCount > prevStreak;
  if (isNewHigh) setHigh(LS_SURVIVAL_HIGH, s.score);
  if (isNewStreak) setHigh(LS_SURVIVAL_STREAK, s.correctCount);
  trackQuizComplete('survival', s.score, s.correctCount, s.bestStreak);

  const emoji = s.correctCount >= 20 ? '🏆' : s.correctCount >= 10 ? '🔥' : s.correctCount >= 5 ? '💪' : '📚';

  container.innerHTML = `
    <div class="trivia-header">
      <div class="trivia-title">Survival Over</div>
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
    </div>
    <div class="trivia-result-emoji">${emoji}</div>
    <div class="trivia-result-score">${s.score}</div>
    <div class="trivia-result-label">points</div>
    <div class="trivia-result-stats">
      <div class="trivia-stat">
        <div class="trivia-stat-value">${s.correctCount}</div>
        <div class="trivia-stat-label">Questions Survived</div>
      </div>
      <div class="trivia-stat">
        <div class="trivia-stat-value">🔥 ${s.bestStreak}</div>
        <div class="trivia-stat-label">Best Streak</div>
      </div>
    </div>
    ${isNewHigh || isNewStreak ? '<div style="text-align:center;color:var(--accent-primary);font-weight:600;font-size:var(--text-base);margin-bottom:1rem;">🏆 New record!</div>' : `<div style="text-align:center;color:var(--text-muted);font-size:var(--text-sm);margin-bottom:1rem;">Record: ${Math.max(prevHigh, s.score)} pts · ${Math.max(prevStreak, s.correctCount)} streak</div>`}
    <div class="trivia-result-actions">
      <button class="trivia-start-btn" data-action="play-again">Play Again</button>
      <button class="trivia-next-btn" data-action="close-game">Close</button>
    </div>
  `;
}

// ══════════════════════════════════════════════════════
// EVENT DELEGATION
// ══════════════════════════════════════════════════════

export function initGameEvents() {
  const panel = document.getElementById('game-panel');
  if (!panel) return;

  panel.addEventListener('click', e => {
    // Close on backdrop click
    if (e.target === panel) { closeGame(); return; }

    // Delegated actions
    const actionEl = e.target.dataset?.action ? e.target : e.target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.dataset.action;
      if (action === 'close-game') closeGame();
      else if (action === 'select-mode') {
        const modeEl = actionEl.dataset.mode ? actionEl : actionEl.closest('[data-mode]');
        if (modeEl) startGame(modeEl.dataset.mode);
      }
      else if (action === 'play-again') showModeSelector();
      else if (action === 'next-question') nextQuestion();
      else if (action === 'wf-pick') answerWhoFirst(actionEl.dataset.pick);
      else if (action === 'wf-next') nextWhoFirst();
      else if (action === 'wf-dice') diceWhoFirst();
      else if (action === 'ff-pick') answerFamilyFoe(actionEl.dataset.pick);
      else if (action === 'ff-next') nextFamilyFoe();
      else if (action === 'ff-dice') diceFamilyFoe();
      return;
    }

    // Answer option clicks
    const optBtn = e.target.closest('.game-option');
    if (optBtn && gameState && !gameState.answered) {
      answerQuestion(parseInt(optBtn.dataset.idx, 10));
    }
  });
}
