// ══════════════════════════════════════════════════════
// KIN — THE PAGE
//
// play.html's only script. A first-time visitor sees question one straight
// away: no opening animation, no tour, no menu. Screens are rendered into
// #kin-stage; every control is a data-action handled through the site's own
// dispatcher (js/actions.js), so the page runs under the same
// Content-Security-Policy as the encyclopedia with no inline script.
//
// State that must survive a reload (today's answers, the streak, the tester
// stats) lives in js/kin/store.js. Everything that decides what a player is
// told comes from js/kin/engine.js.
// ══════════════════════════════════════════════════════

import { registerActions } from '../actions.js';
import { CREATURES } from './creatures.js';
import * as E from './engine.js';
import { STRINGS, LANGS } from './strings.js';
import * as store from './store.js';
import { sfx, setEnabled, buzz } from './sfx.js';
import { treeHTML, sourcesHTML, esc } from './reveal.js';

const params = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const stage = () => $('kin-stage');
const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };

let S = store.load();
let lang = chooseLanguage();
let screen = 'daily';          // daily | results | arcade | over | stats
let run = null;                // { ids, i, lives, score, seed }
let locked = false;
let revealed = null;           // the answer on screen: { qid, side, right, firstEver }
let inARow = 0;                // consecutive right answers; pitches the chime
let countdown = null;

const today = E.localDateString();
const day = E.dayNumber(today);
const dailyIds = E.dailyIds(day);
if (!S.daily || S.daily.day !== day) S.daily = { day, picks: [], done: false };
if (!S.stats.firstSeen) S.stats.firstSeen = today;
setEnabled(S.sound);

/* A shared link's ?lang= is honoured for this visit and never written back:
   following someone's link is not the same as changing your own setting. */
function chooseLanguage() {
  const fromLink = params.get('lang');
  if (LANGS.includes(fromLink)) return fromLink;
  const site = store.siteGet('tol-lang');
  if (LANGS.includes(site)) return site;
  return (navigator.language || '').toLowerCase().startsWith('he') ? 'he' : 'en';
}

const t = () => STRINGS[lang];

function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = t().dir;
  document.title = t().title;
  $('kin-brand').textContent = t().brand;
  $('kin-foot').textContent = t().testBuild;
  $('kin-credits').textContent = t().credits;
  const other = $('kin-lang');
  other.textContent = t().switchLang;
  other.setAttribute('aria-label', t().switchLangLabel);
  other.setAttribute('lang', lang === 'he' ? 'en' : 'he');
  renderSoundButton();
}

function renderSoundButton() {
  const b = $('kin-sound');
  b.setAttribute('aria-pressed', String(S.sound));
  b.textContent = S.sound ? '🔊' : '🔈';
  b.setAttribute('aria-label', S.sound ? t().soundOn : t().soundOff);
  b.title = S.sound ? t().soundOn : t().soundOff;
}

function persist() { store.save(S); }

function markPlayedToday() {
  if (!S.stats.days.includes(today)) S.stats.days.push(today);
}

// ── Header progress ─────────────────────────────────────────────────────────

function renderProgress() {
  const el = $('kin-progress');
  $('kin-num').textContent = screen === 'arcade' || screen === 'over' ? '' : `#${day}`;
  if (screen === 'arcade' || screen === 'over') {
    const hearts = [0, 1, 2].map(i => `<span class="${i < run.lives ? '' : 'lost'}" aria-hidden="true">♥</span>`).join('');
    el.innerHTML = `<span class="kin-mode">${esc(t().arcade)}</span><span class="kin-hearts" role="img" aria-label="${esc(t().lives(run.lives))}">${hearts}</span><span class="kin-pts">${esc(t().pts(run.score))}</span>`;
    return;
  }
  if (screen === 'stats') { el.innerHTML = ''; return; }
  const picks = S.daily.picks;
  el.innerHTML = `<span class="kin-dots" aria-hidden="true">${dailyIds.map((_, i) => {
    const c = i < picks.length ? (picks[i] ? 'ok' : 'no') : (i === picks.length && !S.daily.done ? 'now' : '');
    return `<i class="${c}"></i>`;
  }).join('')}</span>`;
}

// ── A question ──────────────────────────────────────────────────────────────

function currentQuestionId() {
  return screen === 'arcade' ? run.ids[run.i] : dailyIds[S.daily.picks.length];
}

function optionHTML(id, side) {
  const c = CREATURES[id];
  return `<button class="kin-opt" type="button" data-action="kin:pick" data-side="${side}" aria-label="${esc(c[lang].n)}">
      <span class="kin-k kin-k-${c.k}" aria-hidden="true"></span>
      <span class="kin-em" aria-hidden="true">${c.e}</span>
      <span class="kin-nm">${esc(c[lang].n)}</span>
      <span class="kin-mark" aria-hidden="true"></span>
    </button>`;
}

function renderQuestion(qid = currentQuestionId()) {
  clearCountdown();
  locked = false;
  revealed = null;
  const q = E.QUESTION_BY_ID[qid];
  const T = CREATURES[q.t];
  const salt = screen === 'arcade' ? `run-${run.seed}` : `day-${day}`;
  const nearLeft = E.nearOnLeft(q.id, salt);
  const [first, second] = nearLeft ? [q.near, q.far] : [q.far, q.near];
  const firstEver = S.stats.answers === 0;
  const combo = screen === 'arcade' && inARow >= 3 ? `<div class="kin-combo">${esc(t().inARow(inARow))}</div>` : '';
  stage().classList.remove('revealed');
  stage().innerHTML = `
    <p class="kin-prompt">${esc(q.t === 'you' ? t().promptYou : t().prompt)}</p>
    <div class="kin-target"><span class="kin-em" aria-hidden="true">${T.e}</span><span class="kin-nm">${esc(T[lang].n)}</span></div>
    ${combo}
    <div class="kin-opts">${optionHTML(first, 'a')}${optionHTML(second, 'b')}</div>
    <p class="kin-hint">${firstEver ? esc(t().tapHint) : ''}</p>
    <div id="kin-reveal"></div>`;
  stage().dataset.near = nearLeft ? 'a' : 'b';
  renderProgress();
  window.scrollTo(0, 0);
}

function pick(side) {
  if (locked) return;
  locked = true;
  const q = E.QUESTION_BY_ID[currentQuestionId()];
  const right = side === stage().dataset.near;
  const firstEver = !S.seenIntro;

  inARow = right ? inARow + 1 : 0;
  S.stats.answers += 1;
  if (right) S.stats.correct += 1;
  markPlayedToday();
  if (screen === 'arcade') {
    if (right) run.score += 1; else run.lives -= 1;
  } else {
    S.daily.picks.push(right);
  }
  if (firstEver) S.seenIntro = true;
  persist();

  revealed = { qid: q.id, side, right, firstEver };
  showReveal();
  if (right) { sfx.right(inARow); buzz(12); } else { sfx.wrong(); buzz([30, 40, 30]); }
  if (screen === 'arcade' && right && inARow > 0 && inARow % 5 === 0) burst(18);
}

/* Draws the answer for `revealed` onto the question already on screen. Kept
   apart from pick() so switching language mid-reveal redraws the same
   answer instead of skipping to the next question. */
function showReveal() {
  const { qid, side, right, firstEver } = revealed;
  const q = E.QUESTION_BY_ID[qid];
  const r = E.resolve(q);
  const nearSide = stage().dataset.near;
  locked = true;
  stage().querySelectorAll('.kin-opt').forEach((b) => {
    b.disabled = true;
    const mark = b.querySelector('.kin-mark');
    if (b.dataset.side === nearSide) { b.classList.add('is-right'); mark.textContent = '✓'; }
    else if (b.dataset.side === side) { b.classList.add('is-wrong', 'kin-shake'); mark.textContent = '✗'; }
    else b.classList.add('is-faded');
  });
  stage().classList.add('revealed');

  const T = CREATURES[q.t], N = CREATURES[q.near], F = CREATURES[q.far];
  const headline = r.dated ? t().headline(T, N, F, r.dNear, r.dFar) : t().headlineNoDates(T, N, F);
  const lastDaily = screen !== 'arcade' && S.daily.picks.length === dailyIds.length;
  const runEnds = screen === 'arcade' && (run.lives <= 0 || run.i >= run.ids.length - 1);
  const label = screen === 'arcade' ? (run.lives <= 0 ? t().seeRun : runEnds ? t().finish : t().next)
                                    : (lastDaily ? t().seeResult : t().next);
  $('kin-reveal').innerHTML = `<div class="kin-reveal">
      <p class="kin-verdict ${right ? 'ok' : 'no'}" role="status">${esc(right ? t().right(N) : t().wrong(N))}</p>
      ${treeHTML(r, lang)}
      <p class="kin-explain"><strong>${esc(headline)}</strong> ${esc(q.why[lang])}</p>
      ${sourcesHTML(r, lang)}
      ${firstEver ? `<p class="kin-intro">${esc(t().intro)}</p>` : ''}
      <button class="kin-btn kin-block" type="button" id="kin-next" data-action="kin:next">${esc(label)}</button>
    </div>`;
  try { $('kin-next').focus({ preventScroll: true }); } catch { /* old browsers */ }
  renderProgress();
}

function next() {
  sfx.tap();
  if (screen === 'arcade') {
    if (run.lives <= 0 || run.i >= run.ids.length - 1) return renderOver();
    run.i += 1;
    return renderQuestion();
  }
  if (S.daily.picks.length < dailyIds.length) return renderQuestion();
  finishDaily();
  renderResults(true);
}

function finishDaily() {
  if (S.daily.done) return;
  S.daily.done = true;
  S.stats.dailies += 1;
  S.streak = E.nextStreak(S.streak, today);
  persist();
}

// ── Results ─────────────────────────────────────────────────────────────────

function shareURL() {
  const base = `${location.origin}${location.pathname}`;
  return lang === 'en' ? base : `${base}?lang=${lang}`;
}

function renderResults(celebrate = false) {
  screen = 'results';
  stage().classList.remove('revealed');
  const picks = S.daily.picks;
  const score = picks.filter(Boolean).length;
  const title = t().titles[E.titleIndex(score, picks.length)];
  const recap = dailyIds.map((id, i) => {
    const q = E.QUESTION_BY_ID[id];
    const a = CREATURES[q.t], b = CREATURES[q.near];
    return `<li><span><span aria-hidden="true">${a.e}</span> ${esc(a[lang].n)} <span class="kin-arrow" aria-hidden="true">→</span> <span aria-hidden="true">${b.e}</span> ${esc(b[lang].n)}</span><span class="${picks[i] ? 'y' : 'n'}">${picks[i] ? '✓' : '✗'}</span></li>`;
  }).join('');
  stage().innerHTML = `<div class="kin-res">
      <p class="kin-eyebrow">${esc(t().resultEyebrow(day))}</p>
      <p class="kin-score" dir="ltr">${score}<span>/${picks.length}</span></p>
      <p class="kin-title">${esc(title)}</p>
      <p class="kin-grid" role="img" aria-label="${score}/${picks.length}">${picks.map(p => (p ? '🟩' : '🟥')).join('')}</p>
      <p class="kin-streak">${esc(t().streak(S.streak.count || 1))}</p>
      <div class="kin-share">
        <button class="kin-btn kin-block" type="button" id="kin-share-btn" data-action="kin:share">${esc(t().share)}</button>
        <textarea id="kin-share-text" class="kin-share-text" readonly hidden rows="3" aria-label="${esc(t().share)}"></textarea>
      </div>
      <button class="kin-btn kin-ghost kin-block" type="button" data-action="kin:arcade">${esc(t().playArcade)}</button>
      <p class="kin-countdown" id="kin-countdown"></p>
      <details class="kin-recap"><summary>${esc(t().recap)}</summary><ol>${recap}</ol></details>
    </div>`;
  renderProgress();
  startCountdown();
  window.scrollTo(0, 0);
  if (celebrate) {
    sfx.win();
    if (score >= 8) burst(score === picks.length ? 40 : 22);
  }
}

async function share() {
  const text = E.shareText({ brand: t().brand, day, picks: S.daily.picks, url: shareURL() });
  const btn = $('kin-share-btn');
  const box = $('kin-share-text');
  const counted = () => { S.stats.shares += 1; persist(); };
  if (navigator.share) {
    try { await navigator.share({ text }); btn.textContent = t().shared; counted(); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = t().copied;
    counted();
  } catch {
    box.value = text;
    box.hidden = false;
    box.focus();
    box.select();
    btn.textContent = t().copyFallback;
  }
}

function startCountdown() {
  clearCountdown();
  const tick = () => {
    const el = $('kin-countdown');
    if (!el) return clearCountdown();
    const ms = E.msUntilMidnight();
    if (ms <= 1000) { location.reload(); return; }
    const s = Math.floor(ms / 1000);
    const p = (n) => String(n).padStart(2, '0');
    el.innerHTML = esc(t().nextKin('')) + `<bdi class="kin-clock">${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}</bdi>`;
  };
  tick();
  countdown = setInterval(tick, 1000);
}
function clearCountdown() { if (countdown) { clearInterval(countdown); countdown = null; } }

// ── Arcade ──────────────────────────────────────────────────────────────────

function startArcade() {
  const seed = (Math.random() * 2 ** 32) >>> 0;
  run = { ids: E.arcadeIds(seed), i: 0, lives: E.LIVES, score: 0, seed };
  S.stats.arcadeRuns += 1;
  persist();
  inARow = 0;
  screen = 'arcade';
  renderQuestion();
}

function renderOver() {
  screen = 'over';
  clearCountdown();
  stage().classList.remove('revealed');
  const best = S.stats.bestArcade;
  const isBest = run.score > best;
  if (isBest) { S.stats.bestArcade = run.score; persist(); }
  const allPlayed = run.lives > 0;
  stage().innerHTML = `<div class="kin-res">
      <p class="kin-eyebrow">${esc(allPlayed ? t().allPlayed : t().runOver)}</p>
      <p class="kin-score" dir="ltr">${run.score}</p>
      <p class="kin-title">${esc(isBest ? t().newBest : t().best(Math.max(best, run.score)))}</p>
      <button class="kin-btn kin-block" type="button" data-action="kin:arcade">${esc(t().playAgain)}</button>
      <button class="kin-btn kin-ghost kin-block" type="button" data-action="kin:today">${esc(S.daily.done ? t().backToResult : t().backToKin)}</button>
      <p class="kin-note">${esc(t().arcadeNote)}</p>
    </div>`;
  renderProgress();
  window.scrollTo(0, 0);
  if (isBest && run.score >= 5) { sfx.win(); burst(24); }
}

// ── Tester stats (?stats=1) ─────────────────────────────────────────────────

function renderStats() {
  screen = 'stats';
  clearCountdown();
  const rows = t().statsRows(S.stats).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td><bdi>${esc(v)}</bdi></td></tr>`).join('');
  stage().innerHTML = `<div class="kin-res kin-stats">
      <p class="kin-eyebrow">${esc(t().stats)}</p>
      <table>${rows}</table>
      <p class="kin-note">${esc(t().statsNote)}</p>
      <button class="kin-btn kin-block" type="button" data-action="kin:today">${esc(t().statsBack)}</button>
      <button class="kin-btn kin-ghost kin-block" type="button" data-action="kin:reset">${esc(t().statsReset)}</button>
    </div>`;
  renderProgress();
}

// ── Leaves, not confetti ────────────────────────────────────────────────────

function burst(count) {
  if (reduced()) return;
  const box = $('kin-burst');
  box.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const el = document.createElement('i');
    el.className = `kin-leafbit k${i % 4}`;
    el.style.left = `${35 + Math.random() * 30}%`;
    el.style.top = `${18 + Math.random() * 18}%`;
    el.style.setProperty('--dx', `${(Math.random() * 260 - 130).toFixed(0)}px`);
    el.style.setProperty('--dy', `${(Math.random() * 320 + 90).toFixed(0)}px`);
    el.style.setProperty('--rot', `${(Math.random() * 540 - 270).toFixed(0)}deg`);
    el.style.animationDelay = `${(Math.random() * 0.15).toFixed(2)}s`;
    box.appendChild(el);
  }
  setTimeout(() => { box.innerHTML = ''; }, 1800);
}

// ── Wiring ──────────────────────────────────────────────────────────────────

function showToday() {
  screen = 'daily';
  inARow = 0;
  /* All ten answered but the page closed on the last reveal: the result is
     theirs, and there is no eleventh question to show. */
  if (!S.daily.done && S.daily.picks.length >= dailyIds.length) finishDaily();
  if (S.daily.done) renderResults(false); else renderQuestion();
}

registerActions({
  'kin:pick': (_a, _b, { el }) => pick(el.dataset.side),
  'kin:next': () => next(),
  'kin:share': () => { share(); },
  'kin:arcade': () => { sfx.tap(); startArcade(); },
  'kin:today': () => { sfx.tap(); showToday(); },
  'kin:lang': () => {
    lang = lang === 'he' ? 'en' : 'he';
    store.siteSet('tol-lang', lang);
    applyLanguage();
    if (screen === 'results') renderResults(false);
    else if (screen === 'over') renderOver();
    else if (screen === 'stats') renderStats();
    else if (revealed) { const shown = revealed; renderQuestion(shown.qid); revealed = shown; showReveal(); }
    else renderQuestion();
  },
  'kin:sound': () => {
    S.sound = !S.sound;
    setEnabled(S.sound);
    persist();
    renderSoundButton();
    if (S.sound) sfx.tap();
  },
  'kin:reset': () => {
    store.reset();
    S = store.load();
    S.daily = { day, picks: [], done: false };
    S.stats.firstSeen = today;
    persist();
    showToday();
  },
});

/* Arrow keys pick the option on that side of the screen, whichever way the
   language runs. */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  if (locked || (screen !== 'daily' && screen !== 'arcade')) return;
  const opts = [...stage().querySelectorAll('.kin-opt:not([disabled])')];
  if (opts.length !== 2) return;
  const [l, r] = opts.slice().sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
  e.preventDefault();
  pick((e.key === 'ArrowLeft' ? l : r).dataset.side);
});

document.documentElement.dataset.theme = store.siteGet('theme') === 'light' ? 'light' : 'dark';
applyLanguage();
persist();
if (params.get('stats') === '1') renderStats(); else showToday();
