# Fun & Educational Experience Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add gamification, consolidate overlapping features, and weave contextual education into the Tree of Life experience.

**Architecture:** Extends the existing ES module pattern with `initXxxDeps()` late-binding. New game modes plug into the existing `game.js` event delegation. Profile/achievements build on the existing `engagement.js` localStorage system. No new frameworks or build steps.

**Tech Stack:** Vanilla JS ES modules, CSS custom properties, localStorage, no backend.

**Spec:** `docs/superpowers/specs/2026-04-06-fun-educational-upgrade-design.md`

---

## File Map

### New files:
| File | Responsibility |
|---|---|
| `js/speciesCompare.js` | Unified DNA + Evo Path tool (replaces dnaCalc.js + evoPath.js) |
| `js/whoFirst.js` | "Who Appeared First?" game mode |
| `js/familyFoe.js` | "Family or Foe?" game mode |
| `js/profile.js` | Player profiles, household leaderboard, profile panel UI |
| `js/achievements.js` | Achievement definitions, check logic, unlock notifications |
| `css/profile.css` | Profile panel + achievement styles |

### Modified files:
| File | Changes |
|---|---|
| `js/app.js` | Remove minimap import, add new module imports + initDeps wiring |
| `js/game.js` | Add 2 new mode cards, smart quiz (shuffle, dedup, position tracking) |
| `js/engagement.js` | Remove idle toast timer, keep toast infra, wire to achievements.js |
| `js/utils.js` | Add `getRandomSpecies()`, `getTimeContext()` |
| `js/state.js` | No changes needed — profile.js manages player state directly |
| `js/panel.js` | Add Scale of Time display below "appeared" |
| `js/zoom.js` | Wire `#btn-random` click handler |
| `index.html` | Remove minimap, replace dna+evo panels with compare panel, add profile panel markup, add profile button |
| `css/features.css` | Dice button animation, achievement toast, compare panel styles |

### Deleted files:
| File | Replaced by |
|---|---|
| `js/minimap.js` | (removed) |
| `js/dnaCalc.js` | `js/speciesCompare.js` |
| `js/evoPath.js` | `js/speciesCompare.js` |

---

## Task 1: Remove Minimap + Idle Toasts (Cleanup)

**Files:**
- Modify: `js/app.js:63-65` (minimap import + render hook)
- Modify: `js/engagement.js:19-77` (idle toast system)
- Modify: `index.html:162-164` (minimap HTML)
- Delete: `js/minimap.js`

- [ ] **Step 1: Remove minimap import and render hook from app.js**

In `js/app.js`, remove lines 63-65:
```js
// DELETE these lines:
import { renderMinimap } from './minimap.js';
window._onRenderComplete=renderMinimap;
```

- [ ] **Step 2: Remove minimap HTML from index.html**

In `index.html`, remove lines 162-164:
```html
<!-- DELETE this block: -->
<div id="minimap" class="faded" aria-hidden="true">
  <svg id="minimap-svg" viewBox="0 0 120 80"></svg>
</div>
```

- [ ] **Step 3: Delete minimap.js**

Delete `js/minimap.js` entirely (59 lines).

- [ ] **Step 4: Remove idle toast timer from engagement.js**

In `js/engagement.js`, remove lines 19-22 (constants), 49-60 (`showIdleToast` function body — keep the export signature as a no-op), 62-77 (`resetIdleTimer`, `onUserActivity`).

Replace those sections with:
```js
// Idle toast system removed — toast infra kept for achievements
export function showIdleToast() { /* disabled */ }
export function resetIdleTimer() { /* disabled */ }
export function onUserActivity() { /* disabled */ }
```

Keep lines 14-37 intact (toast element refs, `showToast()`, `dismissToast()`).

- [ ] **Step 5: Remove minimap CSS**

Search `css/features.css` for any `#minimap` rules and remove them.

- [ ] **Step 6: Verify in browser**

Run `node serve.js`, open http://localhost:5555. Confirm:
- No minimap in bottom-left corner
- No idle toast appearing after 45 seconds of inactivity
- Toast infrastructure still works (hover over a node to trigger tooltip-based toast)
- No console errors

- [ ] **Step 7: Commit**

```bash
git add js/app.js js/engagement.js index.html css/features.css
git rm js/minimap.js
git commit -m "feat: remove minimap and idle toast system

Minimap replaced by world map in species panels. Idle toasts
were interruptive; toast infrastructure kept for achievements."
```

---

## Task 2: Smart Quiz Mechanics

**Files:**
- Modify: `js/game.js:40-57` (pickQuestions), `js/game.js:204-279` (showQuestion), `js/game.js:286-293` (answerQuestion)

- [ ] **Step 1: Add session dedup and answer shuffling state**

At the top of `js/game.js`, after line 34 (`let gameState = null;`), add:
```js
let _sessionCorrect = new Set(); // question IDs answered correctly this session
let _lastCorrectSlots = [];      // track last 2 correct-answer positions
```

- [ ] **Step 2: Add shuffle utility function**

After the `getHigh`/`setHigh` functions (after line 37), add:
```js
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
```

- [ ] **Step 3: Add session dedup to pickQuestions**

Replace the `pickQuestions` function (lines 40-58) with:
```js
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
```

- [ ] **Step 4: Apply shuffle in showQuestion**

In `showQuestion()` (line 204), after retrieving the question (around line 217 `s._currentQuestion = q;`), add shuffling:
```js
// Shuffle answer order to prevent position prediction
const shuffled = shuffleAnswers(q);
s._currentQuestion = shuffled;
```

Replace the line `s._currentQuestion = q;` (appears twice, lines 213 and 217) with `s._currentQuestion = shuffleAnswers(q);` in both places.

- [ ] **Step 5: Track correctly answered questions**

In `answerQuestion()` (line 286), inside the `if (isCorrect)` block (after line 312 `s.correctCount++;`), add:
```js
if (q.id) _sessionCorrect.add(q.id);
```

- [ ] **Step 6: Reset session dedup when opening game panel**

In `openGame()` (line 77), add after `gameState = null;`:
```js
_sessionCorrect = new Set();
_lastCorrectSlots = [];
```

- [ ] **Step 7: Verify in browser**

Open http://localhost:5555, open the quiz game:
- Play Quick Quiz — answers should appear in shuffled order
- Complete a round — correct answers should not be in the same slot 3+ times in a row
- Play again — previously correctly answered questions should not repeat (until pool depleted)

- [ ] **Step 8: Commit**

```bash
git add js/game.js
git commit -m "feat: smart quiz mechanics — shuffle answers, session dedup, position tracking

Answers are Fisher-Yates shuffled per question. Correct answer
position tracked to prevent 3+ consecutive same-slot placements.
Questions answered correctly this session are filtered out."
```

---

## Task 3: Dice/Random Button — Universal

**Files:**
- Modify: `js/utils.js` (add getRandomSpecies)
- Modify: `js/zoom.js` (wire #btn-random handler)
- Modify: `js/app.js` (import and wire)
- Modify: `css/features.css` (dice animation)

- [ ] **Step 1: Add getRandomSpecies to utils.js**

At the end of `js/utils.js`, add:
```js
/**
 * Pick a random leaf node (species) from the tree.
 * Returns the node object, or null if nodeMap is empty.
 */
export function getRandomSpecies(nodeMapRef) {
  const leaves = Object.values(nodeMapRef).filter(n => !n.children || n.children.length === 0);
  if (!leaves.length) return null;
  return leaves[Math.floor(Math.random() * leaves.length)];
}
```

- [ ] **Step 2: Wire #btn-random in zoom.js**

In `js/zoom.js`, after `initPointerEvents()` is defined, add a new export:
```js
export function initRandomButton(deps) {
  const btn = document.getElementById('btn-random');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const species = deps.getRandomSpecies();
    if (!species) return;
    // Spin animation
    btn.style.transition = 'transform 0.4s ease';
    btn.style.transform = 'rotate(720deg)';
    setTimeout(() => { btn.style.transform = ''; }, 400);
    // Navigate to species
    deps.showMainPanel(species);
  });
}
```

- [ ] **Step 3: Wire in app.js**

In `js/app.js`, add to the imports from `zoom.js` (line 16):
```js
import { ..., initRandomButton } from './zoom.js';
```

Add to imports from `utils.js` (line 10):
```js
import { ..., getRandomSpecies } from './utils.js';
```

After the dep wiring block (after line 85), add:
```js
initRandomButton({ getRandomSpecies: () => getRandomSpecies(nodeMap), showMainPanel });
```

- [ ] **Step 4: Add dice spin animation CSS**

In `css/features.css`, add:
```css
/* Dice button spin animation */
#btn-random {
  transition: transform 0.4s ease;
}
```

- [ ] **Step 5: Verify in browser**

Click 🎲 in zoom controls — should spin and open a random species panel. Click multiple times — should navigate to different species each time.

- [ ] **Step 6: Commit**

```bash
git add js/utils.js js/zoom.js js/app.js css/features.css
git commit -m "feat: wire random species button with spin animation

getRandomSpecies() picks a random leaf node. The existing 🎲
button in zoom controls now navigates to a random species panel
with a brief spin animation on click."
```

---

## Task 4: Scale of Time Contextualizer

**Files:**
- Modify: `js/utils.js` (add getTimeContext)
- Modify: `js/panel.js:527` (display in panel)

- [ ] **Step 1: Add getTimeContext to utils.js**

At the end of `js/utils.js`, add:
```js
/**
 * Generate a human-scale time comparison for a species' appearance date.
 * Returns { metaphor: string, text: string }
 * Deterministic per speciesId — same species always gets the same metaphor.
 */
export function getTimeContext(appearedMya, speciesId) {
  if (!appearedMya || appearedMya <= 0) return null;

  const EARTH_AGE = 3800; // Mya (scope of our tree)
  const fraction = 1 - appearedMya / EARTH_AGE; // 0 = LUCA, 1 = now

  // Deterministic metaphor selection from species ID hash
  let hash = 0;
  for (let i = 0; i < speciesId.length; i++) {
    hash = ((hash << 5) - hash + speciesId.charCodeAt(i)) | 0;
  }
  const metaphors = ['clock', 'calendar', 'marathon'];
  const idx = ((hash % metaphors.length) + metaphors.length) % metaphors.length;
  const metaphor = metaphors[idx];

  let text;
  if (metaphor === 'clock') {
    // 24-hour clock: LUCA = 00:00, now = 24:00
    const totalMinutes = Math.round(fraction * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeStr = `${hours}:${String(minutes).padStart(2, '0')}`;
    if (appearedMya >= EARTH_AGE - 10) {
      text = `If Earth\u2019s history were 24 hours, this is midnight \u2014 the very beginning`;
    } else {
      text = `If Earth\u2019s history were 24 hours, this species appeared at ${timeStr}`;
    }
  } else if (metaphor === 'calendar') {
    // Calendar year: LUCA = Jan 1, now = Dec 31
    const dayOfYear = Math.round(fraction * 365);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    let d = Math.max(1, dayOfYear);
    let m = 0;
    while (m < 11 && d > daysInMonth[m]) { d -= daysInMonth[m]; m++; }
    if (appearedMya >= EARTH_AGE - 10) {
      text = `If Earth\u2019s history were a calendar year, this is January 1st`;
    } else {
      text = `If Earth\u2019s history were a calendar year, this species appeared on ${months[m]} ${d}`;
    }
  } else {
    // Marathon: 42.195 km. LUCA = starting line, now = finish
    const km = fraction * 42.195;
    if (appearedMya >= EARTH_AGE - 10) {
      text = `If Earth\u2019s history were a marathon, this is the starting line`;
    } else if (km > 42.1) {
      const cm = Math.round((42.195 - km + 0.001) * 100);
      text = `If Earth\u2019s history were a marathon, this species appeared in the last ${Math.max(1, cm)} cm`;
    } else {
      text = `If Earth\u2019s history were a marathon, this species appeared at the ${km.toFixed(1)} km mark`;
    }
  }

  return { metaphor, text };
}
```

- [ ] **Step 2: Display in species panel**

In `js/panel.js`, import `getTimeContext` from utils.js:
```js
import { reducedMotion, ..., getTimeContext } from './utils.js';
```

Find the line in `renderPanelContent()` that displays era/appeared (line ~527):
```js
${node.era ? `<div class="p-era">📅 ${node.era}${node.appeared ? ' · ' + node.appeared + ' Mya' : ''}</div>` : ''}
```

Replace it with:
```js
${node.era ? `<div class="p-era">📅 ${node.era}${node.appeared ? ' \u00b7 ' + node.appeared + ' Mya' : ''}</div>` : ''}
${node.appeared ? (() => { const tc = getTimeContext(node.appeared, node.id); return tc ? `<div class="p-time-context">${tc.text}</div>` : ''; })() : ''}
```

- [ ] **Step 3: Add CSS for time context**

In `css/panel.css` (or `css/features.css`), add:
```css
.p-time-context {
  font-size: var(--text-xs);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 0.2rem;
  opacity: 0.85;
}
```

- [ ] **Step 4: Verify in browser**

Open a species panel — below the "Appeared: X Mya" line, should see an italic time context like "If Earth's history were a marathon, this species appeared at the 31.2 km mark". Open different species to see different metaphors.

- [ ] **Step 5: Commit**

```bash
git add js/utils.js js/panel.js css/features.css
git commit -m "feat: Scale of Time contextualizer in species panels

Adds human-scale time comparisons below the 'Appeared' date:
24-hour clock, calendar year, or marathon distance. Metaphor
is deterministic per species ID for consistency."
```

---

## Task 5: "Who Appeared First?" Game Mode

**Files:**
- Create: `js/whoFirst.js`
- Modify: `js/game.js` (add mode card + dispatch)
- Modify: `js/app.js` (import)

- [ ] **Step 1: Create js/whoFirst.js**

```js
// ══════════════════════════════════════════════════════
// WHO APPEARED FIRST? — Game mode
// Pick which of two species appeared earlier in evolution
// ══════════════════════════════════════════════════════

import { nodeMap } from './state.js';
import { getRandomSpecies, getTimeContext } from './utils.js';
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
  // Try node-level facts first
  if (older.funFact) return older.funFact;
  if (older.tipFact) return older.tipFact;
  // Generic template
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

  // Highlight cards
  const cards = document.querySelectorAll('.wf-card');
  cards.forEach(card => {
    card.disabled = true;
    const p = card.dataset.pick;
    if (p === correctPick) card.classList.add('correct');
    else if (p === pick && !isCorrect) card.classList.add('wrong');
  });

  // Update VS indicator
  const vs = document.querySelector('.wf-vs');
  if (vs) vs.textContent = isCorrect ? '✓' : '✗';

  // Show reveal
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

  // Show next button
  const nextBtn = document.getElementById('wf-next');
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.textContent = s.round >= ROUNDS - 1 ? 'See Results' : 'Next';
  }

  // Update score
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

  // Save high score
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
```

- [ ] **Step 2: Add Who Appeared First CSS**

In `css/features.css`, add:
```css
/* Who Appeared First? cards */
.wf-cards {
  display: flex;
  gap: 0.8rem;
  align-items: stretch;
  margin: 0.5rem 0;
}
.wf-card {
  flex: 1;
  background: var(--surface-raised);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem 0.6rem;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s, transform 0.15s;
  font-family: inherit;
  color: var(--text-primary);
}
.wf-card:hover:not(:disabled) { border-color: var(--accent-primary); transform: translateY(-2px); }
.wf-card.correct { border-color: #27ae60; background: rgba(39,174,96,0.1); }
.wf-card.wrong { border-color: #e74c3c; background: rgba(231,76,60,0.1); }
.wf-card-img {
  width: 80px; height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto 0.5rem;
  display: block;
}
.wf-card-icon { font-size: 1.8rem; margin-bottom: 0.3rem; }
.wf-card-name { font-weight: 600; font-size: var(--text-sm); }
.wf-card-latin { font-size: var(--text-xs); color: var(--text-muted); font-style: italic; }
.wf-vs {
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 700; color: var(--accent-primary);
  min-width: 2rem;
}
.wf-reveal {
  background: var(--surface-raised);
  border-radius: var(--radius-md);
  padding: 0.8rem;
  margin: 0.5rem 0;
}
.wf-reveal-header { font-weight: 600; font-size: var(--text-base); margin-bottom: 0.4rem; }
.wf-reveal-dates { display: flex; justify-content: space-between; font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 0.4rem; }
.wf-bridge-fact { font-size: var(--text-sm); color: var(--text-muted); font-style: italic; }
```

- [ ] **Step 3: Add mode card and dispatch to game.js**

In `js/game.js`, add import at the top:
```js
import { startWhoFirst, answerWhoFirst, nextWhoFirst, diceWhoFirst } from './whoFirst.js';
```

In `showModeSelector()` (line 98), inside the `.game-modes` div (after the Survival card, before the closing `</div>` of game-modes at line 141), add:
```js
      <button class="game-mode-card" data-mode="who-first" data-action="select-mode">
        <div class="game-mode-icon">⏳</div>
        <div class="game-mode-info">
          <div class="game-mode-name">Who Appeared First?</div>
          <div class="game-mode-desc">10 rounds · Pick the older species</div>
          ${getHigh('tol-game-whofirst-high') > 0 ? `<div class="game-mode-meta">Best: ${getHigh('tol-game-whofirst-high')} pts</div>` : ''}
        </div>
      </button>
```

In `startGame()` (line 157), add at the top before existing mode checks:
```js
  if (mode === 'who-first') {
    document.getElementById('game-mode-select').style.display = 'none';
    document.getElementById('game-question').style.display = '';
    document.getElementById('game-result').style.display = 'none';
    startWhoFirst();
    return;
  }
```

In the event delegation (line 546), add handlers for the new actions inside the `if (actionEl)` block:
```js
      else if (action === 'wf-pick') answerWhoFirst(actionEl.dataset.pick)
      else if (action === 'wf-next') nextWhoFirst()
      else if (action === 'wf-dice') diceWhoFirst()
```

- [ ] **Step 4: Import and wire deps in app.js**

In `js/app.js`, add:
```js
import { initWhoFirstDeps } from './whoFirst.js';
```

After the existing dep wiring (after line 85), add:
```js
initWhoFirstDeps({ t, checkAchievement });
```

- [ ] **Step 5: Verify in browser**

Open game panel — should see 4 mode cards now. Click "Who Appeared First?":
- Two species cards appear with photos and names
- Click one — highlights correct/wrong, shows dates + bridge fact
- Click Next — advances to next round
- Dice button skips to a new random pair
- After 10 rounds — results screen with score and streak

- [ ] **Step 6: Commit**

```bash
git add js/whoFirst.js js/game.js js/app.js css/features.css
git commit -m "feat: add 'Who Appeared First?' game mode

10-round game where players guess which of two species appeared
earlier in evolutionary history. Shows bridge facts connecting
species after each answer. Dice button for random pair skips."
```

---

## Task 6: "Family or Foe?" Game Mode

**Files:**
- Create: `js/familyFoe.js`
- Modify: `js/game.js` (add mode card + dispatch)
- Modify: `js/app.js` (import)

- [ ] **Step 1: Create js/familyFoe.js**

```js
// ══════════════════════════════════════════════════════
// FAMILY OR FOE? — Game mode
// Given species A, guess if it's closer to B or C
// ══════════════════════════════════════════════════════

import { nodeMap } from './state.js';
import { getRandomSpecies } from './utils.js';
import { PHOTO_MAP } from './data.js';
import { findLCA } from './dnaSimilarity.js';

let _t, _checkAchievement;
export function initFamilyFoeDeps(deps) {
  _t = deps.t;
  _checkAchievement = deps.checkAchievement;
}
function t(key) { return _t ? _t(key) : key; }

const ROUNDS = 8;
const PTS_CORRECT = 15;
const PTS_STREAK_BONUS = 5;

// Curated surprising trios: [target, closerToTarget, fartherFromTarget, explanation]
const CURATED_TRIOS = [
  ['hippopotamus','blue-whale','wild-boar','Hippos and whales shared a land-walking ancestor ~55 Mya \u2014 before hippos, whales walked on land.'],
  ['fungi','h_sapiens','arabidopsis','Fungi diverged from animals ~1 Bya, but from plants ~1.5 Bya \u2014 your mushroom soup is closer kin than salad.'],
  ['birds','crocodylians','komodo-dragon','Birds are archosaurs, sharing a more recent ancestor with crocodilians than with lizards.'],
  ['dolphin','hippopotamus','white-shark','Dolphins are artiodactyls \u2014 more closely related to hippos than to any fish, despite living in the ocean.'],
  ['platypus','h_sapiens','komodo-dragon','Platypus is a mammal. Despite laying eggs, it\u2019s closer to humans than to any reptile.'],
  ['lungfish','h_sapiens','white-shark','Lungfish are our closest fish relative \u2014 they share a lobe-finned ancestor with all land vertebrates.'],
  ['horseshoe-crab','garden-spider','japanese-spider-crab','Despite the name, horseshoe crabs are chelicerates \u2014 closer to spiders than to true crabs.'],
  ['saccharomyces','h_sapiens','ecoli','Baker\u2019s yeast is a eukaryote \u2014 it shares more cellular machinery with you than with any bacterium.'],
  ['honey-bee','mantis-shrimp','garden-spider','Bees and shrimps are both crustacean/insect pancrustaceans, more closely related than either is to spiders.'],
  ['coelacanth','h_sapiens','white-shark','Coelacanths are lobe-finned fish, sharing the ancestor that crawled onto land with us, not with sharks.'],
  ['sea-otter','wolf','white-shark','Sea otters are carnivorans \u2014 more closely related to wolves than to any marine animal despite living in the ocean.'],
  ['coral-reef','turritopsis','amanita-muscaria','Corals and jellyfish are both cnidarians \u2014 much closer to each other than either is to fungi.'],
  ['octopus','garden-spider','honey-bee','Octopi (molluscs) and spiders (chelicerates) are both lophotrochozoans/ecdysozoans \u2014 but actually all three are distant. The key surprise: octopi are NOT arthropods despite their intelligence.'],
  ['tuatara','komodo-dragon','crocodylians','Tuataras look like lizards but are rhynchocephalians \u2014 they diverged from lizards/snakes ~250 Mya.'],
  ['elephant-seal','manatee','white-shark','Elephant seals are carnivorans; manatees are afrotheres. Both marine, but the seal is closer to a dog than to a manatee.'],
  ['bamboo','sunflower','chanterelle','Bamboo and sunflowers are both angiosperms \u2014 flowering plants, far closer than either is to fungi.'],
  ['naked-mole-rat','capybara','hedgehog','Naked mole-rats and capybaras are both rodents \u2014 the two weirdest rodents are more related than they look.'],
  ['echidna','platypus','komodo-dragon','Echidnas and platypuses are both monotremes \u2014 the only egg-laying mammals, closer to each other than to any reptile.'],
  ['tardigrade','army-ant','garden-spider','Tardigrades are ecdysozoans like insects, not arachnids \u2014 despite their microscopic size.'],
  ['peregrine-falcon','archaeopteryx','crocodylians','Falcons and Archaeopteryx are both theropod dinosaur descendants \u2014 closer to each other than to crocs.'],
  ['giraffe','hippopotamus','moose','Giraffes and hippos are both artiodactyls, but giraffes are actually closer to deer/moose than to hippos.'],
  ['flamingo','hummingbird','ostrich','Flamingos and hummingbirds are surprisingly close \u2014 both in the clade Mirandornithes, more related than either is to ostriches.'],
  ['vampire-bat','wolf','hummingbird','Vampire bats are mammals (laurasiatheres) \u2014 closer to wolves than to any bird despite both flying.'],
  ['slime-mold','amoeba','chanterelle','Slime molds are amoebozoans, not fungi \u2014 closer to amoebas than to any mushroom, despite looking fungal.'],
  ['volvox','arabidopsis','paramecium','Volvox is a green alga, sharing the plant lineage \u2014 closer to land plants than to other protists.'],
  ['euglena','arabidopsis','ecoli','Euglena is a eukaryote with plant-like chloroplasts \u2014 closer to plants than to bacteria despite its single cell.'],
  ['firefly','army-ant','garden-spider','Fireflies and ants are both insects (holometabola) \u2014 much closer than either is to spiders.'],
  ['walrus','sea-otter','narwhal','Walruses and sea otters are both carnivorans \u2014 closer to each other than to narwhals (cetaceans).'],
  ['barn-owl','peregrine-falcon','cassowary','Owls and falcons are both neoavians \u2014 more closely related than either is to the ancient cassowary lineage.'],
  ['chimpanzee','gorilla','orangutan','Chimps are closer to gorillas \u2014 they shared an African ancestor after the orangutan lineage split off in Asia ~14 Mya.'],
];

let ffState = null;

export function startFamilyFoe() {
  ffState = {
    round: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    trio: null,
    usedTrios: new Set(),
    history: []
  };
  showFamilyFoeQuestion();
}

function pickTrio(state) {
  // Try curated trios first
  const available = CURATED_TRIOS.filter((_, i) => !state.usedTrios.has(i));
  if (available.length > 0) {
    const idx = CURATED_TRIOS.indexOf(available[Math.floor(Math.random() * available.length)]);
    state.usedTrios.add(idx);
    const [targetId, closerId, fartherId, explanation] = CURATED_TRIOS[idx];
    const target = nodeMap[targetId];
    const closer = nodeMap[closerId];
    const farther = nodeMap[fartherId];
    if (target && closer && farther) {
      // Randomize which side closer/farther appear on
      const swap = Math.random() > 0.5;
      return {
        target,
        optionB: swap ? farther : closer,
        optionC: swap ? closer : farther,
        correctPick: swap ? 'c' : 'b',
        explanation,
        curated: true
      };
    }
  }
  // Fallback: dynamic trio using LCA
  return pickDynamicTrio();
}

function pickDynamicTrio() {
  const leaves = Object.values(nodeMap).filter(n =>
    (!n.children || n.children.length === 0) && n.appeared > 0
  );
  for (let attempt = 0; attempt < 30; attempt++) {
    const target = leaves[Math.floor(Math.random() * leaves.length)];
    const b = leaves[Math.floor(Math.random() * leaves.length)];
    const c = leaves[Math.floor(Math.random() * leaves.length)];
    if (target.id === b.id || target.id === c.id || b.id === c.id) continue;
    const lcaB = findLCA(target, b);
    const lcaC = findLCA(target, c);
    if (!lcaB || !lcaC) continue;
    // We want one to be clearly closer
    if (Math.abs(lcaB.appeared - lcaC.appeared) < 100) continue;
    const closerIsB = lcaB.appeared < lcaC.appeared; // lower Mya = more recent = closer
    return {
      target,
      optionB: b,
      optionC: c,
      correctPick: closerIsB ? 'b' : 'c',
      explanation: `Their last common ancestor lived ${Math.min(lcaB.appeared, lcaC.appeared)} Mya \u2014 ${Math.abs(lcaB.appeared - lcaC.appeared)} million years more recently than the other pair.`,
      curated: false
    };
  }
  return null;
}

function showFamilyFoeQuestion() {
  const s = ffState;
  const container = document.getElementById('game-question');
  if (!container) return;

  if (s.round >= ROUNDS) { showFamilyFoeResults(); return; }

  const trio = pickTrio(s);
  if (!trio) { showFamilyFoeResults(); return; }
  s.trio = trio;
  s.answered = false;

  const { target, optionB, optionC } = trio;
  const photoT = PHOTO_MAP[target.id] || '';
  const photoB = PHOTO_MAP[optionB.id] || '';
  const photoC = PHOTO_MAP[optionC.id] || '';

  container.innerHTML = `
    <div class="trivia-header">
      <button class="btn-back" data-action="close-game" aria-label="Close">✕</button>
      <div style="font-size:var(--text-sm);color:var(--text-secondary);">Round ${s.round + 1}/${ROUNDS}</div>
      <div class="trivia-score-display">${s.score} pts</div>
    </div>
    <div class="trivia-progress"><div class="trivia-progress-fill" style="width:${(s.round / ROUNDS) * 100}%"></div></div>
    ${s.streak >= 3 ? `<div style="text-align:center;margin:0.3rem 0;"><span class="trivia-streak-badge">🔥 ${s.streak} streak!</span></div>` : ''}

    <div class="ff-target">
      ${photoT ? `<img src="${photoT}" alt="${target.name}" class="ff-target-img" crossorigin="anonymous" onerror="this.style.display='none'">` : ''}
      <div class="ff-target-info">
        <div style="font-size:var(--text-xs);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;">Who is closer to...</div>
        <div class="ff-target-name">${target.icon || '🧬'} ${target.name}</div>
      </div>
    </div>

    <div class="wf-cards">
      <button class="wf-card" data-action="ff-pick" data-pick="b">
        ${photoB ? `<img src="${photoB}" alt="${optionB.name}" class="wf-card-img" crossorigin="anonymous" onerror="this.style.display='none'">` : ''}
        <div class="wf-card-icon">${optionB.icon || '🧬'}</div>
        <div class="wf-card-name">${optionB.name}</div>
      </button>
      <div class="wf-vs">or</div>
      <button class="wf-card" data-action="ff-pick" data-pick="c">
        ${photoC ? `<img src="${photoC}" alt="${optionC.name}" class="wf-card-img" crossorigin="anonymous" onerror="this.style.display='none'">` : ''}
        <div class="wf-card-icon">${optionC.icon || '🧬'}</div>
        <div class="wf-card-name">${optionC.name}</div>
      </button>
    </div>

    <div class="wf-reveal" id="ff-reveal" style="display:none"></div>
    <button class="trivia-next-btn" id="ff-next" data-action="ff-next" style="display:none;">Next</button>
    <div style="text-align:center;margin-top:0.5rem;">
      <button class="zbtn" data-action="ff-dice" title="Random new trio" style="font-size:1rem;">🎲 Skip</button>
    </div>
  `;
}

export function answerFamilyFoe(pick) {
  const s = ffState;
  if (!s || s.answered) return;
  s.answered = true;

  const { correctPick, explanation, target, optionB, optionC } = s.trio;
  const isCorrect = pick === correctPick;
  const closerSpecies = correctPick === 'b' ? optionB : optionC;

  if (isCorrect) {
    s.score += PTS_CORRECT + (s.streak >= 1 ? PTS_STREAK_BONUS * s.streak : 0);
    s.streak++;
    if (s.streak > s.bestStreak) s.bestStreak = s.streak;
  } else {
    s.streak = 0;
  }

  // Highlight cards
  const cards = document.querySelectorAll('.wf-card');
  cards.forEach(card => {
    card.disabled = true;
    if (card.dataset.pick === correctPick) card.classList.add('correct');
    else if (card.dataset.pick === pick && !isCorrect) card.classList.add('wrong');
  });

  const vs = document.querySelector('.wf-vs');
  if (vs) vs.textContent = isCorrect ? '✓' : '✗';

  // Show reveal
  const reveal = document.getElementById('ff-reveal');
  if (reveal) {
    reveal.style.display = '';
    reveal.innerHTML = `
      <div class="wf-reveal-header">${isCorrect ? '✅ Correct!' : `❌ It\u2019s ${closerSpecies.name}!`}</div>
      <div class="wf-bridge-fact">💡 ${explanation}</div>
    `;
  }

  const nextBtn = document.getElementById('ff-next');
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.textContent = s.round >= ROUNDS - 1 ? 'See Results' : 'Next';
  }

  const scoreEl = document.querySelector('.trivia-score-display');
  if (scoreEl) scoreEl.textContent = `${s.score} pts`;

  s.round++;
  s.history.push({ target: target.id, picked: pick, correct: correctPick, isCorrect });
}

export function nextFamilyFoe() {
  if (ffState && ffState.round >= ROUNDS) showFamilyFoeResults();
  else showFamilyFoeQuestion();
}

export function diceFamilyFoe() {
  if (ffState && !ffState.answered) showFamilyFoeQuestion();
}

function showFamilyFoeResults() {
  const s = ffState;
  const container = document.getElementById('game-result');
  const qEl = document.getElementById('game-question');
  if (qEl) qEl.style.display = 'none';
  if (!container) return;
  container.style.display = '';

  const correct = s.history.filter(h => h.isCorrect).length;
  const emoji = correct >= 7 ? '🌟' : correct >= 5 ? '🎉' : correct >= 3 ? '👍' : '📚';

  const key = 'tol-game-familyfoe-high';
  const prev = parseInt(localStorage.getItem(key) || '0', 10);
  const isNew = s.score > prev;
  if (isNew) localStorage.setItem(key, String(s.score));

  container.innerHTML = `
    <div class="trivia-header">
      <div class="trivia-title">Family or Foe?</div>
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
```

- [ ] **Step 2: Add Family or Foe CSS**

In `css/features.css`, add:
```css
/* Family or Foe? target card */
.ff-target {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--surface-raised);
  border: 2px solid var(--accent-primary);
  border-radius: var(--radius-lg);
  padding: 0.8rem 1rem;
  margin: 0.5rem 0;
}
.ff-target-img {
  width: 56px; height: 56px;
  object-fit: cover;
  border-radius: 50%;
  flex-shrink: 0;
}
.ff-target-name {
  font-weight: 700;
  font-size: var(--text-base);
}
```

- [ ] **Step 3: Add mode card and dispatch to game.js**

Add import at top of `js/game.js`:
```js
import { startFamilyFoe, answerFamilyFoe, nextFamilyFoe, diceFamilyFoe } from './familyFoe.js';
```

In `showModeSelector()`, after the Who Appeared First card, add:
```js
      <button class="game-mode-card" data-mode="family-foe" data-action="select-mode">
        <div class="game-mode-icon">🤝</div>
        <div class="game-mode-info">
          <div class="game-mode-name">Family or Foe?</div>
          <div class="game-mode-desc">8 rounds · Guess the closer relative</div>
          ${getHigh('tol-game-familyfoe-high') > 0 ? `<div class="game-mode-meta">Best: ${getHigh('tol-game-familyfoe-high')} pts</div>` : ''}
        </div>
      </button>
```

In `startGame()`, add before the existing mode checks:
```js
  if (mode === 'family-foe') {
    document.getElementById('game-mode-select').style.display = 'none';
    document.getElementById('game-question').style.display = '';
    document.getElementById('game-result').style.display = 'none';
    startFamilyFoe();
    return;
  }
```

In event delegation, add:
```js
      else if (action === 'ff-pick') answerFamilyFoe(actionEl.dataset.pick)
      else if (action === 'ff-next') nextFamilyFoe()
      else if (action === 'ff-dice') diceFamilyFoe()
```

- [ ] **Step 4: Import and wire deps in app.js**

```js
import { initFamilyFoeDeps } from './familyFoe.js';
// After dep wiring:
initFamilyFoeDeps({ t, checkAchievement });
```

- [ ] **Step 5: Verify in browser**

Open game panel — should see 5 mode cards. Click "Family or Foe?":
- Target species at top, two choice cards below
- Click one — reveals correct answer with explanation
- Curated trios should show surprising evolutionary relationships
- Dice skips to new trio
- Results after 8 rounds

- [ ] **Step 6: Commit**

```bash
git add js/familyFoe.js js/game.js js/app.js css/features.css
git commit -m "feat: add 'Family or Foe?' game mode with 30 curated trios

8-round game where players guess which of two species is more
closely related to a target. 30 curated surprising trios with
explanations. Falls back to dynamic LCA-based trios when
curated pool is exhausted."
```

---

## Task 7: Unified Species Compare

**Files:**
- Create: `js/speciesCompare.js`
- Modify: `js/app.js` (replace dnaCalc + evoPath imports)
- Modify: `index.html` (replace two panels with one)

- [ ] **Step 1: Create js/speciesCompare.js**

This merges the functionality of `dnaCalc.js` and `evoPath.js` into a single unified panel. The file should:

1. Keep the same slot-based species selection (A/B) with search overlay
2. Show all results together: DNA similarity (with source citation), evo path chain, divergence time with Scale of Time, shared ancestor card, "Show on Tree" button
3. Add dice button for random pair
4. Keep existing presets (combined from both tools)
5. **DNA accuracy:** Show "Published" badge + source for DNA_KNOWN entries, "Estimated" badge for calculated values, never show source for estimates

The complete implementation follows the patterns from `dnaCalc.js` (lines 12-189) and `evoPath.js` (lines 12-231). Since both files use the same slot/search pattern, the merge is straightforward — combine the results displays into one output section.

Key structure:
```js
import { state, nodeMap } from './state.js';
import { PHOTO_MAP } from './data.js';
import { estimateDnaSimilarity, findLCA } from './dnaSimilarity.js';
import { getRandomSpecies, getTimeContext } from './utils.js';

let _deps = {};
export function initCompareDeps(deps) { Object.assign(_deps, deps); }

let slotA = null, slotB = null, searchTarget = null;

export function openCompare() { /* show #species-compare-panel */ }
export function closeCompare() { /* hide panel */ }
export function openCompareSearch(slot) { /* show search overlay */ }
export function selectCompareSpecies(id) { /* fill slot, auto-compute if both filled */ }
export function comparePreset(idA, idB) { /* preset pair */ }
export function compareDice() { /* random pair */ }
export function computeCompare() { /* compute DNA + path + divergence + ancestor */ }
export function showCompareOnTree() { /* highlight path on tree, close panel */ }
export function clearCompareHighlight() { /* clear tree highlighting */ }
export function initCompareEvents() { /* wire search input, backdrop clicks */ }
```

The full implementation should be ~350 lines, combining the existing ~200 lines from dnaCalc.js and ~240 lines from evoPath.js with shared code deduplicated.

**Implementation reference:** Read `js/dnaCalc.js` and `js/evoPath.js` in full before writing this file. Both use identical patterns for slot selection, search overlay, and result display. The merge deduplicates the species-picker UI (shared between both) and combines the result sections into one scrollable output.

Write the complete file following the exact patterns from the existing two files, but with:
- Single panel ID: `#species-compare-panel`
- Combined presets: Human & Chimp, Human & Banana, Human & Mushroom, Shark & Tree, Octopus & Ant, Human & Bacteria
- Results section showing DNA%, path chain, divergence time, ancestor card, Scale of Time — all at once
- DNA source citation: show `result.source` only when `result.method === 'known'`
- Dice button calling `getRandomSpecies(nodeMap)` for both slots

- [ ] **Step 2: Replace HTML panels**

In `index.html`, remove the DNA panel (lines 344-398) and Evo Path panel (lines 285-338). Replace with a single panel:
```html
<div id="species-compare-panel" class="compare-panel" role="dialog" aria-label="Species Compare" aria-modal="true" aria-hidden="true">
  <div class="compare-panel-inner">
    <div class="compare-panel-header">
      <div class="compare-panel-title" id="i-compare-title">Species Compare</div>
      <button class="btn-back" onclick="closeCompare()">✕</button>
    </div>
    <div class="compare-presets" id="compare-presets"></div>
    <div class="compare-slots">
      <button class="compare-slot" id="compare-slot-a" onclick="openCompareSearch('a')">
        <span class="compare-slot-icon" id="compare-icon-a">?</span>
        <span class="compare-slot-label" id="compare-label-a">Select a species</span>
      </button>
      <div class="compare-vs">vs</div>
      <button class="compare-slot" id="compare-slot-b" onclick="openCompareSearch('b')">
        <span class="compare-slot-icon" id="compare-icon-b">?</span>
        <span class="compare-slot-label" id="compare-label-b">Select a species</span>
      </button>
      <button class="zbtn compare-dice" onclick="compareDice()" title="Random pair">🎲</button>
    </div>
    <div class="compare-search-overlay" id="compare-search-overlay" style="display:none">
      <input type="text" id="compare-search-input" placeholder="Search species..." autocomplete="off">
      <div id="compare-search-results"></div>
    </div>
    <div class="compare-results" id="compare-results" style="display:none"></div>
    <button id="compare-show-tree" class="trivia-start-btn" style="display:none" onclick="showCompareOnTree()">Show on Tree</button>
  </div>
</div>
```

Also remove the evo clear overlay button (line after evo-path-panel):
```html
<!-- DELETE: -->
<button id="evo-clear-overlay" onclick="clearEvoHighlight()">✕ Clear Path</button>
```

Replace with:
```html
<button id="compare-clear-overlay" onclick="clearCompareHighlight()" style="display:none">✕ Clear Path</button>
```

- [ ] **Step 3: Update FAB buttons**

Replace the two FAB buttons in `index.html` (lines ~275-276):
```html
<!-- DELETE these two: -->
<button id="btn-dna-calc" class="fab" onclick="openDnaCalc()">...</button>
<button id="btn-evo-path" class="fab" onclick="openEvoPath()">...</button>

<!-- REPLACE with one: -->
<button id="btn-compare" class="fab" onclick="openCompare()" aria-label="Species Compare" title="Species Compare">
  <span class="fab-icon">🔬</span> <span id="i-btn-compare">Compare</span>
</button>
```

- [ ] **Step 4: Update app.js imports**

Remove dnaCalc and evoPath imports (lines 37-40), replace with:
```js
import { openCompare, closeCompare, openCompareSearch, selectCompareSpecies, comparePreset, compareDice, computeCompare, showCompareOnTree, clearCompareHighlight, initCompareDeps, initCompareEvents } from './speciesCompare.js';
```

Remove the old dep wiring (lines 80-81):
```js
// DELETE:
initDnaCalcDeps({ searchEntities, t, showMainPanel });
initEvoPathDeps({ searchEntities, t, scheduleRender, smoothPanTo, layout, applyT });
```

Replace with:
```js
initCompareDeps({ searchEntities, t, showMainPanel, scheduleRender, smoothPanTo, layout, applyT });
```

Update `initNavDeps` to reference `closeCompare` instead of `closeDnaCalc, closeEvoPath`.

Wire events: add `initCompareEvents();` after `initGameEvents();`.

Expose to window: replace `window.openDnaCalc = openDnaCalc;` etc with `window.openCompare = openCompare;` and similar for all compare functions used in onclick handlers.

- [ ] **Step 5: Add compare panel CSS**

Add to `css/features.css`:
```css
/* Species Compare panel */
.compare-panel { /* same pattern as .dna-panel */ }
.compare-panel-inner { /* same as .dna-panel-inner */ }
.compare-slots { display: flex; align-items: center; gap: 0.5rem; margin: 0.8rem 0; }
.compare-slot { flex: 1; /* same pattern as dna slot buttons */ }
.compare-vs { font-weight: 700; color: var(--accent-primary); }
.compare-dice { font-size: 1.2rem; }
.compare-results { padding: 0.5rem 0; }
.compare-dna-pct { font-size: 2rem; font-weight: 700; text-align: center; color: var(--accent-primary); }
.compare-method-badge { font-size: var(--text-2xs); padding: 0.15rem 0.4rem; border-radius: var(--radius-sm); }
.compare-method-badge.known { background: rgba(39,174,96,0.2); color: #27ae60; }
.compare-method-badge.estimated { background: rgba(243,156,18,0.2); color: #f39c12; }
```

Copy existing `.dna-panel` and `.evo-panel` styling patterns for the new `.compare-panel` class.

- [ ] **Step 6: Delete old files**

```bash
git rm js/dnaCalc.js js/evoPath.js
```

- [ ] **Step 7: Verify in browser**

Click "Compare" FAB — single panel with both slots, presets, dice, search. Select two species:
- DNA similarity with percentage, method badge, source (only for known pairs)
- Evo path chain with ancestor nodes
- Divergence time with Scale of Time context
- Shared ancestor card
- "Show on Tree" highlights path
- No console errors from removed modules

- [ ] **Step 8: Commit**

```bash
git add js/speciesCompare.js index.html js/app.js css/features.css
git rm js/dnaCalc.js js/evoPath.js
git commit -m "feat: unify DNA Calculator and Evo Path into Species Compare

Single tool replaces two overlapping features. Shows DNA
similarity (with source citations for known data, 'Estimated'
badge for calculated values), evolutionary path, divergence
time with Scale of Time context, and shared ancestor card.
Dice button for random pair comparison."
```

---

## Task 8: Achievement System Expansion

**Files:**
- Create: `js/achievements.js`
- Modify: `js/engagement.js:465-478` (replace ACHIEVEMENTS, expand _unlock)
- Modify: `js/app.js` (import + wire)
- Modify: `js/game.js` (report scores after game)

- [ ] **Step 1: Create js/achievements.js**

```js
// ══════════════════════════════════════════════════════
// ACHIEVEMENTS — definitions and check logic
// ══════════════════════════════════════════════════════

export const ACHIEVEMENTS = [
  // Explorer (7)
  { id:'first_contact',      cat:'explorer',    icon:'\uD83D\uDD2D', name:'First Contact',      desc:'Visit your first species',                 secret:false },
  { id:'budding_biologist',  cat:'explorer',    icon:'\uD83C\uDF31', name:'Budding Biologist',   desc:'Visit 10 species',                         secret:false },
  { id:'seasoned_explorer',  cat:'explorer',    icon:'\uD83E\uDDED', name:'Seasoned Explorer',   desc:'Visit 50 species',                         secret:false },
  { id:'world_traveler',     cat:'explorer',    icon:'\uD83C\uDF0D', name:'World Traveler',      desc:'Visit 100 species',                        secret:false },
  { id:'master_naturalist',  cat:'explorer',    icon:'\uD83D\uDC51', name:'Master Naturalist',   desc:'Visit every species',                      secret:false },
  { id:'kingdom_collector',  cat:'explorer',    icon:'\uD83C\uDF44', name:'Kingdom Collector',   desc:'Visit all species in any one kingdom',     secret:false },
  { id:'extinction_witness', cat:'explorer',    icon:'\uD83D\uDC80', name:'Extinction Witness',  desc:'Visit all extinct species',                secret:false },

  // Scholar (6)
  { id:'quiz_taker',         cat:'scholar',     icon:'\uD83D\uDCDD', name:'Quiz Taker',          desc:'Complete your first quiz',                 secret:false },
  { id:'quiz_champion',      cat:'scholar',     icon:'\uD83C\uDFC6', name:'Quiz Champion',       desc:'Perfect score in Quick Quiz',               secret:false },
  { id:'trivia_master',      cat:'scholar',     icon:'\uD83E\uDDE0', name:'Trivia Master',       desc:'Score 100+ in Classic Trivia',              secret:false },
  { id:'survival_expert',    cat:'scholar',     icon:'\u267E\uFE0F', name:'Survival Expert',     desc:'15+ streak in Survival mode',               secret:false },
  { id:'tour_graduate',      cat:'scholar',     icon:'\uD83C\uDF93', name:'Tour Graduate',       desc:'Complete all 3 guided tours',               secret:false },
  { id:'know_it_all',        cat:'scholar',     icon:'\uD83D\uDCDA', name:'Know-It-All',         desc:'Answer 100 questions correctly',            secret:false },

  // Pathfinder (4)
  { id:'dna_detective',      cat:'pathfinder',  icon:'\uD83E\uDDEC', name:'DNA Detective',       desc:'Use Species Compare for the first time',   secret:false },
  { id:'chain_finder',       cat:'pathfinder',  icon:'\uD83D\uDD17', name:'Chain Finder',        desc:'Find a path with 8+ ancestors',            secret:false },
  { id:'unlikely_cousins',   cat:'pathfinder',  icon:'\uD83E\uDD1D', name:'Unlikely Cousins',    desc:'Compare species from different kingdoms',   secret:false },
  { id:'lucky_roller',       cat:'pathfinder',  icon:'\uD83C\uDFB2', name:'Lucky Roller',        desc:'Use the dice button 20 times',             secret:false },

  // Time Traveler (2)
  { id:'time_traveler',      cat:'traveler',    icon:'\u231B',       name:'Time Traveler',       desc:'Complete a full playback to present',       secret:false },
  { id:'survivor',           cat:'traveler',    icon:'\uD83D\uDCA5', name:'Survivor',            desc:'Watch all 5 extinction events in playback', secret:false },

  // Secret (3)
  { id:'night_owl',          cat:'secret',      icon:'\uD83E\uDD89', name:'Night Owl',           desc:'Explore 20 species after midnight',        secret:true,  hint:'The best discoveries happen after dark' },
  { id:'family_game_night',  cat:'secret',      icon:'\uD83C\uDFE0', name:'Family Game Night',   desc:'3+ players on the same device',            secret:true,  hint:'Science is better together' },
  { id:'deep_diver',         cat:'secret',      icon:'\uD83D\uDD2C', name:'Deep Diver',          desc:'Expand every single branch on the tree',   secret:true,  hint:'You\'ve seen it all... or have you?' },
];

export function getAchievement(id) {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByCategory() {
  const cats = {};
  for (const a of ACHIEVEMENTS) {
    if (!cats[a.cat]) cats[a.cat] = [];
    cats[a.cat].push(a);
  }
  return cats;
}
```

- [ ] **Step 2: Update engagement.js to use new achievements**

In `js/engagement.js`, replace the `ACHIEVEMENTS` array (lines 465-478) with an import:
```js
import { ACHIEVEMENTS, getAchievement } from './achievements.js';
```

Update `_unlock()` (line 524) to use `getAchievement(id)` instead of `ACHIEVEMENTS.find()`:
```js
function _unlock(id) {
  if (_achievements.has(id)) return;
  _achievements.add(id);
  _saveAchievements();
  const def = getAchievement(id);
  if (def) _showAchievementToast(def);
}
```

Update `_checkExplorationAchievements()` (line 506) to use new achievement IDs:
```js
function _checkExplorationAchievements() {
  const count = _explored.size;
  const total = Object.keys(nodeMap).length;
  if (count >= 1)  _unlock('first_contact');
  if (count >= 10) _unlock('budding_biologist');
  if (count >= 50) _unlock('seasoned_explorer');
  if (count >= 100) _unlock('world_traveler');
  if (count >= total && total > 0) _unlock('master_naturalist');

  // Night owl: check if current hour is after midnight and before 5am
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) {
    // Count species explored during night hours (approximate: just check current count)
    if (count >= 20) _unlock('night_owl');
  }

  // Kingdom collector: check all species in any one domain
  const domains = ['bacteria','archaea','protists','fungi','plantae','animalia'];
  for (const domainId of domains) {
    const domainNode = nodeMap[domainId];
    if (!domainNode) continue;
    const ids = [];
    (function collect(n) { if (!n.children || n.children.length === 0) ids.push(n.id); if (n.children) n.children.forEach(collect); })(domainNode);
    if (ids.length > 0 && ids.every(id => _explored.has(id))) { _unlock('kingdom_collector'); break; }
  }

  // Extinction witness: check all species with extinct field
  const extinctIds = Object.values(nodeMap).filter(n => n.extinct).map(n => n.id);
  if (extinctIds.length > 0 && extinctIds.every(id => _explored.has(id))) _unlock('extinction_witness');
}
```

Add exports for the new tracking functions:
```js
export function trackQuizComplete(mode, score, correctCount, bestStreak) {
  _unlock('quiz_taker');
  if (mode === 'quick' && score === 5) _unlock('quiz_champion');
  if (mode === 'classic' && score >= 100) _unlock('trivia_master');
  if (mode === 'survival' && bestStreak >= 15) _unlock('survival_expert');

  // Know-it-all: track cumulative correct answers
  _tracking.totalCorrect = (_tracking.totalCorrect || 0) + correctCount;
  _saveTracking();
  if (_tracking.totalCorrect >= 100) _unlock('know_it_all');
}

export function trackTourComplete(tourId) {
  if (!_tracking.toursCompleted) _tracking.toursCompleted = [];
  if (!_tracking.toursCompleted.includes(tourId)) {
    _tracking.toursCompleted.push(tourId);
    _saveTracking();
  }
  if (_tracking.toursCompleted.length >= 3) _unlock('tour_graduate');
}

export function trackDiceUse() {
  _tracking.diceUses = (_tracking.diceUses || 0) + 1;
  _saveTracking();
  if (_tracking.diceUses >= 20) _unlock('lucky_roller');
}

export function trackCompareUse(pathLength, crossKingdom) {
  _unlock('dna_detective');
  if (pathLength >= 8) _unlock('chain_finder');
  if (crossKingdom) _unlock('unlikely_cousins');
}

export function getUnlockedAchievements() { return _achievements; }
export function getExploredSpecies() { return _explored; }
```

- [ ] **Step 3: Wire quiz completion tracking in game.js**

In `js/game.js`, add import:
```js
import { trackQuizComplete } from './engagement.js';
```

In `showQuickResults()` (line 422), after the `if (perfect) checkAchievement('quiz_champion');` line, add:
```js
trackQuizComplete('quick', s.score, s.score, s.bestStreak);
```

In `showClassicResults()` (line 448), at the end, add:
```js
trackQuizComplete('classic', s.score, correctCount, s.bestStreak);
```

In `showSurvivalResults()` (line 501), at the end, add:
```js
trackQuizComplete('survival', s.score, s.correctCount, s.bestStreak);
```

- [ ] **Step 4: Wire dice tracking**

In `js/zoom.js`, update the random button handler to call `trackDiceUse()`:
```js
import { trackDiceUse } from './engagement.js';
// In the click handler:
trackDiceUse();
```

Similarly in `whoFirst.js` and `familyFoe.js` dice handlers, import and call `trackDiceUse()`.

- [ ] **Step 5: Verify in browser**

- Visit a species — should see "First Contact" achievement toast
- Visit 10 species — "Budding Biologist"
- Complete a quiz — "Quiz Taker"
- Use dice 20 times — "Lucky Roller"
- Check localStorage `tol-achievements` contains new IDs

- [ ] **Step 6: Commit**

```bash
git add js/achievements.js js/engagement.js js/game.js js/zoom.js js/whoFirst.js js/familyFoe.js
git commit -m "feat: expand achievement system to 25 badges across 5 categories

Explorer (7), Scholar (6), Pathfinder (4), Time Traveler (2),
Secret (3). Tracks quiz completion, dice usage, compare usage,
tour completion, and exploration milestones. Night Owl secret
achievement triggers when exploring after midnight."
```

---

## Task 9: Profile Panel + Household Leaderboard

**Files:**
- Create: `js/profile.js`
- Create: `css/profile.css`
- Modify: `index.html` (add profile panel markup + button + CSS link)
- Modify: `js/app.js` (import + wire)
- Reference: `js/state.js` (profile.js manages player state internally via localStorage)

- [ ] **Step 1: Create js/profile.js**

This module manages:
- Player profiles in localStorage (`tol-players` key)
- Active player switching (`tol-active-player` key)
- Profile panel UI (slide-out with 3 sections)
- Leaderboard rendering
- Achievement grid rendering
- Kingdom progress bars

Key structure:
```js
import { state, nodeMap } from './state.js';
import { ACHIEVEMENTS } from './achievements.js';
import { getUnlockedAchievements, getExploredSpecies } from './engagement.js';

let _deps = {};
export function initProfileDeps(deps) { Object.assign(_deps, deps); }

const LS_PLAYERS = 'tol-players';
const LS_ACTIVE = 'tol-active-player';

// Player object shape (stored in localStorage)
function createPlayer(name) {
  return {
    name,
    createdAt: Date.now(),
    lastActive: Date.now(),
    totalPoints: 0
  };
}

let _players = JSON.parse(localStorage.getItem(LS_PLAYERS) || '[]');
let _activePlayerName = localStorage.getItem(LS_ACTIVE) || '';

export function getActivePlayer() { ... }
export function setActivePlayer(name) { ... }
export function addPlayer(name) { ... }
export function updatePlayerScore(mode, score) { ... }

export function openProfile() { /* show #profile-panel, render 3 sections */ }
export function closeProfile() { /* hide panel */ }

function renderLeaderboard(container) { ... }
function renderAchievements(container) { ... }
function renderKingdomProgress(container) { ... }

export function initProfileListeners() { ... }
```

The profile panel uses the same slide-in pattern as the species panel. It has 3 tab sections:
1. **Leaderboard** — table of players sorted by totalPoints, "Add Player" input
2. **Achievements** — 4-column grid of badge icons (locked/unlocked), secret ones hidden until unlocked
3. **Progress** — 6 progress bars for kingdoms + total

Full implementation ~400 lines following existing panel patterns.

- [ ] **Step 2: Create css/profile.css**

```css
/* Profile panel */
.profile-panel {
  position: fixed; top: 0; right: 0;
  width: min(420px, 100vw); height: 100vh;
  background: var(--surface);
  z-index: 500;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
  border-left: 1px solid var(--border);
}
.profile-panel.open { transform: translateX(0); }

.profile-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem; border-bottom: 1px solid var(--border);
}
.profile-tabs {
  display: flex; border-bottom: 1px solid var(--border);
}
.profile-tab {
  flex: 1; padding: 0.6rem;
  text-align: center; cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  background: none; border-top: none; border-left: none; border-right: none;
  font-family: inherit;
}
.profile-tab.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}
.profile-content { padding: 1rem; }

/* Leaderboard */
.lb-table { width: 100%; border-collapse: collapse; }
.lb-table th { text-align: left; font-size: var(--text-xs); color: var(--text-muted); padding: 0.3rem 0.5rem; }
.lb-table td { padding: 0.4rem 0.5rem; font-size: var(--text-sm); border-top: 1px solid var(--border); }
.lb-row.active { background: rgba(200,136,58,0.1); }
.lb-add-player {
  display: flex; gap: 0.5rem; margin-top: 0.8rem;
}
.lb-add-player input {
  flex: 1; padding: 0.4rem 0.6rem;
  background: var(--surface-raised); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text-primary);
  font-family: inherit; font-size: var(--text-sm);
}

/* Achievement grid */
.ach-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}
.ach-badge {
  text-align: center; padding: 0.6rem 0.3rem;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  cursor: pointer;
  transition: transform 0.15s;
}
.ach-badge:hover { transform: translateY(-2px); }
.ach-badge.locked { opacity: 0.4; filter: grayscale(1); }
.ach-badge.secret.locked { display: none; }
.ach-badge-icon { font-size: 1.6rem; }
.ach-badge-name { font-size: var(--text-2xs); margin-top: 0.2rem; color: var(--text-secondary); }
.ach-badge-desc {
  font-size: var(--text-2xs); color: var(--text-muted);
  display: none; margin-top: 0.2rem;
}
.ach-badge.expanded .ach-badge-desc { display: block; }
.ach-progress { text-align: center; margin-top: 0.8rem; font-size: var(--text-sm); color: var(--text-muted); }

/* Kingdom progress bars */
.kp-bar {
  display: flex; align-items: center; gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.kp-label { font-size: var(--text-sm); min-width: 5rem; }
.kp-track {
  flex: 1; height: 8px;
  background: var(--surface-raised);
  border-radius: 4px; overflow: hidden;
}
.kp-fill {
  height: 100%; border-radius: 4px;
  transition: width 0.3s ease;
}
.kp-count { font-size: var(--text-xs); color: var(--text-muted); min-width: 3rem; text-align: right; }

/* Mobile */
@media (max-width: 640px) {
  .profile-panel { width: 100vw; }
  .ach-grid { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 3: Add profile panel HTML and button to index.html**

Add CSS link in `<head>`:
```html
<link rel="stylesheet" href="css/profile.css">
```

Add profile button in `#top-right-controls` (after theme-btn):
```html
<button id="profile-btn" onclick="openProfile()" title="Profile" aria-label="Player profile">👤</button>
```

Add profile panel markup before the closing `</body>`:
```html
<div id="profile-panel" class="profile-panel" aria-hidden="true">
  <div class="profile-header">
    <div style="font-weight:600;font-size:var(--text-base);">👤 <span id="profile-player-name">Guest</span></div>
    <button class="btn-back" onclick="closeProfile()">✕</button>
  </div>
  <div class="profile-tabs">
    <button class="profile-tab active" data-tab="leaderboard">🏆 Leaderboard</button>
    <button class="profile-tab" data-tab="achievements">🎖 Achievements</button>
    <button class="profile-tab" data-tab="progress">📊 Progress</button>
  </div>
  <div class="profile-content" id="profile-content"></div>
</div>
```

- [ ] **Step 4: Wire in app.js**

```js
import { openProfile, closeProfile, initProfileDeps, initProfileListeners } from './profile.js';

// After dep wiring:
initProfileDeps({ t, nodeMap });
initProfileListeners();

// Expose to window for onclick handlers:
window.openProfile = openProfile;
window.closeProfile = closeProfile;
```

- [ ] **Step 5: Add player name prompt on first visit**

In `js/profile.js`, on initialization check if no players exist and prompt:
```js
export function initProfile() {
  if (_players.length === 0) {
    // Will show name prompt after splash screen finishes
    setTimeout(() => {
      if (!_activePlayerName) promptPlayerName();
    }, 5000);
  }
}

function promptPlayerName() {
  const name = prompt('Welcome! Enter your name for the leaderboard (or leave blank for Guest):');
  const playerName = (name || '').trim().slice(0, 20) || 'Guest';
  addPlayer(playerName);
  setActivePlayer(playerName);
}
```

Call `initProfile()` from app.js in the init sequence.

- [ ] **Step 6: Migrate existing localStorage data**

In `js/profile.js`, add migration:
```js
function migrateOldData() {
  // If old tol-explored exists but no tol-players, migrate
  const oldExplored = localStorage.getItem('tol-explored');
  if (oldExplored && _players.length <= 1) {
    // Data stays in engagement.js — just ensure active player exists
    if (_players.length === 0) {
      addPlayer('Guest');
      setActivePlayer('Guest');
    }
  }
}
```

- [ ] **Step 7: Verify in browser**

- First visit: prompted for name
- Click 👤 button — profile panel slides in
- Three tabs work: Leaderboard (shows player), Achievements (grid with locked/unlocked), Progress (kingdom bars)
- Add a second player name — both appear in leaderboard
- Achievement unlocks update the grid in real-time
- Mobile: panel goes full-width

- [ ] **Step 8: Commit**

```bash
git add js/profile.js css/profile.css index.html js/app.js
git commit -m "feat: add Profile panel with household leaderboard and achievement grid

Slide-out profile panel with 3 tabs: Leaderboard (multi-player
per device, name-based switching), Achievements (4-col grid with
locked/unlocked/secret badges), Kingdom Progress (per-domain
completion bars). First-visit name prompt. localStorage-backed."
```

---

## Task 10: Species of the Day

**Files:**
- Modify: `js/engagement.js` (add species-of-the-day function)
- Modify: `js/app.js` (wire and display)
- Modify: `index.html` (add badge element)

- [ ] **Step 1: Add getSpeciesOfTheDay to engagement.js**

```js
export function getSpeciesOfTheDay() {
  const leaves = Object.values(nodeMap).filter(n => !n.children || n.children.length === 0);
  if (!leaves.length) return null;
  // Deterministic from date
  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  const idx = ((hash % leaves.length) + leaves.length) % leaves.length;
  return leaves[idx];
}
```

- [ ] **Step 2: Add SOTD badge to index.html**

In the header area (after `#progress-badge`), add:
```html
<div id="sotd-badge" style="display:none" role="button" tabindex="0" aria-label="Species of the Day">
  <span id="sotd-icon"></span> <span id="sotd-name"></span>
  <span style="font-size:var(--text-2xs);color:var(--text-muted);margin-left:0.3rem;">today</span>
</div>
```

- [ ] **Step 3: Wire in app.js init**

After tree is preprocessed and rendered, add:
```js
import { getSpeciesOfTheDay } from './engagement.js';

// In init():
const sotd = getSpeciesOfTheDay();
if (sotd) {
  const badge = document.getElementById('sotd-badge');
  const icon = document.getElementById('sotd-icon');
  const name = document.getElementById('sotd-name');
  if (badge && icon && name) {
    icon.textContent = sotd.icon || '🧬';
    name.textContent = sotd.name;
    badge.style.display = '';
    badge.addEventListener('click', () => showMainPanel(sotd));
  }
}
```

- [ ] **Step 4: Add SOTD badge CSS**

```css
#sotd-badge {
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 0.2rem 0.6rem;
  font-size: var(--text-xs);
  cursor: pointer;
  transition: border-color 0.2s;
}
#sotd-badge:hover { border-color: var(--accent-primary); }
```

- [ ] **Step 5: Verify and commit**

Check that a species appears as "Species of the Day" in the header. Clicking it opens the species panel. Refreshing shows the same species. Tomorrow it will be different.

```bash
git add js/engagement.js js/app.js index.html css/features.css
git commit -m "feat: add Species of the Day badge in header

Deterministic daily species selection based on date hash.
Clicking the badge navigates to that species' panel."
```

---

## Task 11: Daily Challenge

**Files:**
- Modify: `js/game.js` (add Daily Challenge mode card + logic)

- [ ] **Step 1: Add daily challenge mode**

In `js/game.js`, add a Daily Challenge card to `showModeSelector()`:

```js
// Daily challenge: one question per day, deterministic
const today = new Date().toISOString().slice(0, 10);
const dailyDone = localStorage.getItem('tol-daily-' + today);
const dailyStreak = parseInt(localStorage.getItem('tol-daily-streak') || '0', 10);

// Add card HTML:
<button class="game-mode-card ${dailyDone ? 'daily-done' : 'daily-active'}" data-mode="daily" data-action="select-mode">
  <div class="game-mode-icon">${dailyDone ? '✅' : '📅'}</div>
  <div class="game-mode-info">
    <div class="game-mode-name">Daily Challenge</div>
    <div class="game-mode-desc">${dailyDone ? 'Completed today!' : 'One question · Streak: ' + dailyStreak + ' days'}</div>
  </div>
</button>
```

In `startGame()`, add daily mode handling:
```js
if (mode === 'daily') {
  const today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem('tol-daily-' + today)) return; // already done
  // Pick question deterministically from date
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash = ((hash << 5) - hash + today.charCodeAt(i)) | 0;
  const qIdx = ((hash % TRIVIA_QUESTIONS.length) + TRIVIA_QUESTIONS.length) % TRIVIA_QUESTIONS.length;
  const q = TRIVIA_QUESTIONS[qIdx];
  // Start a 1-question quick game
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
```

After answering, save daily completion and update streak:
In `showResults()`, add daily mode handler:
```js
if (s.mode === 'daily') return showDailyResults(result);
```

```js
function showDailyResults(container) {
  const s = gameState;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('tol-daily-' + today, s.correctCount > 0 ? 'correct' : 'wrong');

  // Update streak
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
```

- [ ] **Step 2: Add daily challenge CSS**

```css
.game-mode-card.daily-active {
  border: 2px solid var(--accent-primary);
  animation: dailyPulse 2s ease-in-out infinite;
}
.game-mode-card.daily-done { opacity: 0.6; }
@keyframes dailyPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(200,136,58,0.3); }
  50% { box-shadow: 0 0 0 6px rgba(200,136,58,0); }
}
```

- [ ] **Step 3: Verify and commit**

Open game panel — Daily Challenge card appears at top. Complete it — card changes to "Completed today!". Next day will show a different question.

```bash
git add js/game.js css/features.css
git commit -m "feat: add Daily Challenge mode with streak tracking

One trivia question per day, deterministic from date hash.
Streak counter for consecutive correct days. Card pulses
when challenge is available, dims when completed."
```

---

## Verification Checklist

After all tasks are complete, verify the full integration:

- [ ] No console errors on page load
- [ ] Minimap gone, no idle toasts
- [ ] Quiz answers shuffle, no position repetition 3x, session dedup works
- [ ] 🎲 works in zoom controls (spin + navigate)
- [ ] Scale of Time shows in species panels (3 different metaphors across species)
- [ ] Game panel shows 6 modes: Quick Quiz, Classic Trivia, Survival, Who Appeared First, Family or Foe, Daily Challenge
- [ ] "Who Appeared First?" — plays 10 rounds, bridge facts display, dice skips
- [ ] "Family or Foe?" — plays 8 rounds, curated trios show surprising results
- [ ] Species Compare — single tool with DNA%, path, divergence, ancestor, "Show on Tree"
- [ ] DNA source citations: "Published" for known pairs, "Estimated" for calculated
- [ ] Achievements unlock and show toast notifications
- [ ] Profile panel opens with 3 tabs, all populated
- [ ] Household leaderboard: can add multiple players, scores tracked
- [ ] Kingdom progress bars show correct counts
- [ ] Species of the Day badge appears and navigates on click
- [ ] Daily Challenge: one question per day, streak tracking
- [ ] Mobile (375px): all panels full-width, cards stack correctly
- [ ] Three languages: UI chrome has i18n keys (content English-only is fine)
