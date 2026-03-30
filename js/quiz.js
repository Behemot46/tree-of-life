// ══════════════════════════════════════════════════════
// QUIZ MODE — Multiple-choice trivia quiz
// ══════════════════════════════════════════════════════

import { checkAchievement } from './engagement.js';

const HIGH_SCORE_KEY = 'tol-quiz-high';
const QUESTION_COUNT = 5;

let _questions = [];
let _currentIdx = 0;
let _score = 0;
let _answered = false;

function _getHighScore() { return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10); }
function _setHighScore(val) { localStorage.setItem(HIGH_SCORE_KEY, String(val)); }

function _pickQuestions(n) {
  if (typeof TRIVIA_QUESTIONS === 'undefined' || !TRIVIA_QUESTIONS.length) return [];
  const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function openQuiz() {
  _questions = _pickQuestions(QUESTION_COUNT);
  if (!_questions.length) return;
  _currentIdx = 0;
  _score = 0;
  _answered = false;
  const overlay = document.getElementById('quiz-overlay');
  if (overlay) overlay.classList.remove('hidden');
  _renderQuestion();
}

export function closeQuiz() {
  const overlay = document.getElementById('quiz-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function _renderQuestion() {
  const modal = document.getElementById('quiz-modal');
  if (!modal) return;
  const q = _questions[_currentIdx];
  if (!q) { _renderResults(); return; }
  modal.innerHTML = `
    <div class="quiz-header">
      <span class="quiz-progress">Question ${_currentIdx + 1}/${_questions.length}</span>
      <button class="quiz-close" data-action="close-quiz" aria-label="Close quiz">\u2715</button>
    </div>
    <div class="quiz-question">${q.question}</div>
    <div class="quiz-options" id="quiz-options">
      ${q.answers.map((a, i) => `<button class="quiz-option" data-idx="${i}">${a}</button>`).join('')}
    </div>
    <div class="quiz-fact hidden" id="quiz-fact"></div>
    <div class="quiz-score-bar">Score: ${_score}/${_questions.length}</div>`;
}

export function answerQuestion(idx) {
  if (_answered) return;
  _answered = true;
  const q = _questions[_currentIdx];
  const correct = q.correct;
  const options = document.querySelectorAll('#quiz-options .quiz-option');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    if (i === idx && idx !== correct) btn.classList.add('wrong');
  });
  if (idx === correct) _score++;

  if (q.funFact) {
    const factEl = document.getElementById('quiz-fact');
    if (factEl) { factEl.textContent = q.funFact; factEl.classList.remove('hidden'); }
  }

  setTimeout(() => { _currentIdx++; _answered = false; _renderQuestion(); }, 1800);
}

function _renderResults() {
  const modal = document.getElementById('quiz-modal');
  if (!modal) return;
  const highScore = _getHighScore();
  const isNewHigh = _score > highScore;
  if (isNewHigh) _setHighScore(_score);
  const perfect = _score === _questions.length;
  if (perfect) checkAchievement('quiz_champion');

  const emoji = perfect ? '\uD83C\uDF1F' : _score >= 4 ? '\uD83C\uDF89' : _score >= 3 ? '\uD83D\uDC4D' : '\uD83D\uDCDA';
  modal.innerHTML = `
    <div class="quiz-header">
      <span class="quiz-progress">Results</span>
      <button class="quiz-close" data-action="close-quiz" aria-label="Close quiz">\u2715</button>
    </div>
    <div class="quiz-results">
      <div class="quiz-emoji">${emoji}</div>
      <div class="quiz-score-big">${_score}/${_questions.length}</div>
      <div class="quiz-score-label">${perfect ? 'Perfect score!' : _score >= 3 ? 'Great job!' : 'Keep learning!'}</div>
      ${isNewHigh ? '<div class="quiz-new-high">New high score!</div>' : `<div class="quiz-high">Best: ${Math.max(highScore, _score)}/${_questions.length}</div>`}
    </div>
    <div class="quiz-actions">
      <button class="quiz-btn quiz-btn-primary" data-action="quiz-again">Play Again</button>
      <button class="quiz-btn" data-action="close-quiz">Close</button>
    </div>`;
}

// Delegated event listener for quiz modal
export function initQuizEvents() {
  const overlay = document.getElementById('quiz-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', e => {
    const action = e.target.dataset.action;
    if (action === 'close-quiz') closeQuiz();
    else if (action === 'quiz-again') openQuiz();
    else if (e.target.classList.contains('quiz-option')) {
      answerQuestion(parseInt(e.target.dataset.idx, 10));
    }
  });
}
