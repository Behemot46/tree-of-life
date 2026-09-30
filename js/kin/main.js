// ══════════════════════════════════════════════════════
// KIN — THE PAGE
//
// A first-time visitor sees question one straight away: no opening animation,
// no tour, no menu. Someone who has played before lands on Home: today's Kin,
// their streak, the Arcade and the Atlas. Screens are rendered into
// #kin-stage; every control is a data-action handled through the site's own
// dispatcher (js/actions.js), so the page runs under the same
// Content-Security-Policy as the encyclopedia with no inline script.
//
// State that must survive a reload (today's answers, the streak, the stats)
// lives in js/kin/store.js. Everything that decides what a player is told
// comes from js/kin/engine.js.
//
// Three things can be played: today's Kin (remembered, and it counts toward
// the streak), a friend's Kin from a link (played once, not remembered), and
// the Arcade, alone or against a friend's score.
//
// Home may also offer the home screen (install.js), and the page counts
// visits and finished games anonymously if, and only if, it names an endpoint
// for it (analytics.js). The service worker registered at the bottom serves
// the game's shell when there is no network.
// ══════════════════════════════════════════════════════

import { registerActions } from '../actions.js';
import { CREATURES } from './creatures.js';
import { glyph } from './glyph.js';
import * as E from './engine.js';
import { dateOfDay } from './calendar.js';
import { STRINGS, LANGS } from './strings.js';
import * as store from './store.js';
import { sfx, setEnabled, buzz } from './sfx.js';
import { treeHTML, sourcesHTML, esc } from './reveal.js';
import { installOffer, isIOS, isStandalone } from './install.js';
import { track, enabled as counting, visitBucket } from './analytics.js';

/* The encyclopedia. It moves to atlas.html when this page becomes the front door. */
const ATLAS_URL = 'index.html';

const params = new URLSearchParams(location.search);
const launch = E.parseLaunch(location.search);
const $ = (id) => document.getElementById(id);
const stage = () => $('kin-stage');
const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };

let S = store.load();
let lang = chooseLanguage();
let screen = 'home';           // home | daily | results | arcade | over | stats
let run = null;                // an Arcade run: { ids, i, lives, score, seed, challenge, over }
let friend = null;             // a friend's Kin, played once and not kept: { day, picks, done }
let locked = false;
let revealed = null;           // the answer on screen: { qid, side, right, firstEver }
let inARow = 0;                // consecutive right answers; pitches the chime
let countdown = null;
let installEvent = null;       // the browser's install dialog, held until the player asks for it

const today = E.localDateString();
const day = E.dayNumber(today);
if (!S.daily || S.daily.day !== day) S.daily = { day, picks: [], done: false };
if (!S.stats.firstSeen) S.stats.firstSeen = today;
setEnabled(S.sound);

/** The Kin being played: today's, which is remembered, or a friend's, which is not. */
const D = () => friend || S.daily;
const idsOf = (d) => E.dailyIds(d.day);

/* A shared link's ?lang= is honoured for this visit and never written back:
   following someone's link is not the same as changing your own setting. */
function chooseLanguage() {
  const fromLink = params.get('lang');
  if (LANGS.includes(fromLink)) return fromLink;
  const site = store.siteGet('tol-lang');
  if (LANGS.includes(site)) return site;
  const device = (navigator.language || '').toLowerCase().slice(0, 2);
  return LANGS.includes(device) ? device : 'en';
}

const t = () => STRINGS[lang];

function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = t().dir;
  document.title = t().title;
  $('kin-brand').textContent = t().brand;
  $('kin-home').setAttribute('aria-label', `${t().brand}, ${t().home}`);
  $('kin-foot').textContent = t().footAtlas;
  $('kin-credits').textContent = t().credits;
  /* One button for each other language, each named in its own language and
     script, so a reader finds theirs without reading this one. */
  $('kin-langs').innerHTML = LANGS.filter((l) => l !== lang).map((l) => {
    const s = STRINGS[l];
    return `<button class="kin-tool" type="button" data-action="kin:lang" data-lang="${l}" lang="${l}" dir="${s.dir}" aria-label="${esc(s.name)}" title="${esc(s.name)}">${esc(s.code)}</button>`;
  }).join('');
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

/** Where a shared link points: this very page, wherever it is served from. */
const baseURL = () => `${location.origin}${location.pathname}`;

/* Programmatic focus after a screen changes, so a keyboard or a screen reader
   is not left on a control that has just been removed. */
function settle(selector = '.kin-btn') {
  try { const el = stage().querySelector(selector); if (el) el.focus({ preventScroll: true }); } catch { /* old browsers */ }
}

// ── Header progress ─────────────────────────────────────────────────────────

function renderProgress() {
  const el = $('kin-progress');
  const daily = screen === 'daily' || screen === 'results';
  $('kin-num').textContent = daily ? `#${D().day}` : '';
  /* The Arcade's status is the widest thing the bar carries; on a phone it gets a row of its own. */
  document.querySelector('.kin-bar').classList.toggle('is-arcade', screen === 'arcade' || screen === 'over');
  if (screen === 'arcade' || screen === 'over') {
    const hearts = [0, 1, 2].map(i => `<span class="${i < run.lives ? '' : 'lost'}" aria-hidden="true">♥</span>`).join('');
    el.innerHTML = `<span class="kin-mode">${esc(t().arcade)}</span><span class="kin-hearts" role="img" aria-label="${esc(t().lives(run.lives))}">${hearts}</span><span class="kin-pts">${esc(t().pts(run.score))}</span>`;
    return;
  }
  if (!daily) { el.innerHTML = ''; return; }
  const picks = D().picks;
  const ids = idsOf(D());
  el.innerHTML = `<span class="kin-dots" aria-hidden="true">${ids.map((_, i) => {
    const c = i < picks.length ? (picks[i] ? 'ok' : 'no') : (i === picks.length && !D().done ? 'now' : '');
    return `<i class="${c}"></i>`;
  }).join('')}</span>`;
}

// ── A question ──────────────────────────────────────────────────────────────

function currentQuestionId() {
  return screen === 'arcade' ? run.ids[run.i] : idsOf(D())[D().picks.length];
}

function optionHTML(id, side) {
  const c = CREATURES[id];
  return `<button class="kin-opt" type="button" data-action="kin:pick" data-side="${side}" aria-label="${esc(c[lang].n)}">
      <span class="kin-k kin-k-${c.k}" aria-hidden="true"></span>
      <span class="kin-em" aria-hidden="true">${glyph(c)}</span>
      <span class="kin-nm">${esc(c[lang].n)}</span>
      <span class="kin-mark" aria-hidden="true"></span>
    </button>`;
}

/** Who this question came from, when it did not come from the game itself. */
function bannerHTML() {
  if (screen === 'arcade' && run.challenge) return `<p class="kin-banner">${esc(t().challengeBanner(run.challenge.score))}</p>`;
  if (friend) return `<p class="kin-banner">${esc(t().friendBanner(friend.day))}</p>`;
  return '';
}

function renderQuestion(qid = currentQuestionId()) {
  clearCountdown();
  locked = false;
  revealed = null;
  const q = E.QUESTION_BY_ID[qid];
  const T = CREATURES[q.t];
  const salt = screen === 'arcade' ? `run-${run.seed}` : `day-${D().day}`;
  const nearLeft = E.nearOnLeft(q.id, salt);
  const [first, second] = nearLeft ? [q.near, q.far] : [q.far, q.near];
  const firstEver = S.stats.answers === 0;
  const combo = screen === 'arcade' && inARow >= 3 ? `<div class="kin-combo">${esc(t().inARow(inARow))}</div>` : '';
  stage().classList.remove('revealed');
  stage().innerHTML = `
    ${bannerHTML()}
    <p class="kin-prompt">${esc(q.t === 'you' ? t().promptYou : t().prompt)}</p>
    <div class="kin-target"><span class="kin-em" aria-hidden="true">${glyph(T)}</span><span class="kin-nm">${esc(T[lang].n)}</span></div>
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
  if (!friend) {
    S.stats.answers += 1;
    if (right) S.stats.correct += 1;
    markPlayedToday();
  }
  if (screen === 'arcade') {
    if (right) run.score += 1; else run.lives -= 1;
  } else {
    D().picks.push(right);
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
  const lastDaily = screen !== 'arcade' && D().picks.length === idsOf(D()).length;
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
  if (D().picks.length < idsOf(D()).length) return renderQuestion();
  if (friend) friend.done = true; else finishDaily();
  renderResults(true);
}

function finishDaily() {
  if (S.daily.done) return;
  S.daily.done = true;
  S.stats.dailies += 1;
  S.history[day] = S.daily.picks.filter(Boolean).length;
  S.streak = E.nextStreak(S.streak, today);
  persist();
  track('daily/finish');
}

// ── Results ─────────────────────────────────────────────────────────────────

function renderResults(celebrate = false) {
  screen = 'results';
  stage().classList.remove('revealed');
  const d = D();
  const ids = idsOf(d);
  const picks = d.picks;
  const score = picks.filter(Boolean).length;
  const title = t().titles[E.titleIndex(score, picks.length)];
  const recap = ids.map((id, i) => {
    const q = E.QUESTION_BY_ID[id];
    const a = CREATURES[q.t], b = CREATURES[q.near];
    return `<li><span><span aria-hidden="true">${glyph(a)}</span> ${esc(a[lang].n)} <span class="kin-arrow" aria-hidden="true">→</span> <span aria-hidden="true">${glyph(b)}</span> ${esc(b[lang].n)}</span><span class="${picks[i] ? 'y' : 'n'}">${picks[i] ? '✓' : '✗'}</span></li>`;
  }).join('');
  const streak = friend ? '' : `<p class="kin-streak">${esc(t().streak(S.streak.count || 1))}</p>`
    + (S.streak.froze && S.streak.last === today ? `<p class="kin-note">${esc(t().freezeUsed)}</p>` : '');
  stage().innerHTML = `<div class="kin-res">
      <p class="kin-eyebrow">${esc(t().resultEyebrow(d.day))}</p>
      <div class="kin-plaque kin-scoreplate">
        <p class="kin-score" dir="ltr">${score}<span>/${picks.length}</span></p>
        <p class="kin-title">${esc(title)}</p>
      </div>
      <p class="kin-grid" role="img" aria-label="${score}/${picks.length}">${picks.map(p => (p ? '🟩' : '🟥')).join('')}</p>
      ${streak}
      <div class="kin-share">
        <button class="kin-btn kin-block" type="button" id="kin-share-btn" data-action="kin:share">${esc(t().share)}</button>
        <textarea id="kin-share-text" class="kin-share-text" readonly hidden rows="3" aria-label="${esc(t().share)}"></textarea>
      </div>
      ${friend
        ? `<button class="kin-btn kin-ghost kin-block" type="button" data-action="kin:today">${esc(t().playToday)}</button>`
        : `<button class="kin-btn kin-ghost kin-block" type="button" data-action="kin:arcade">${esc(t().playArcade)}</button>`}
      <p class="kin-countdown" id="kin-countdown"></p>
      <details class="kin-recap"><summary>${esc(t().recap)}</summary><ol>${recap}</ol></details>
    </div>`;
  renderProgress();
  if (!friend) startCountdown();
  window.scrollTo(0, 0);
  if (celebrate) {
    sfx.win();
    if (score >= 8) burst(score === picks.length ? 40 : 22);
  }
}

/** Hands `text` to the phone's share sheet, or the clipboard, or a box to copy from. */
async function deliver(text, btn, box) {
  const counted = () => { S.stats.shares += 1; persist(); track('share'); };
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

function share() {
  const d = D();
  const text = E.shareText({ brand: t().brand, day: d.day, picks: d.picks, url: E.kinURL({ base: baseURL(), day: d.day, lang }) });
  return deliver(text, $('kin-share-btn'), $('kin-share-text'));
}

function challenge() {
  const url = E.challengeURL({ base: baseURL(), seed: run.seed, score: run.score, lang });
  return deliver(`${t().challengeShare(run.score)}\n${url}`, $('kin-challenge-btn'), $('kin-share-text'));
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

/** A run from a random seed, or from a friend's (`challenge` is their { seed, score }). */
function startArcade(seed = (Math.random() * 2 ** 32) >>> 0, against = null) {
  friend = null;
  run = { ids: E.arcadeIds(seed), i: 0, lives: E.LIVES, score: 0, seed, challenge: against, over: null };
  S.stats.arcadeRuns += 1;
  persist();
  track('arcade/start');
  inARow = 0;
  screen = 'arcade';
  renderQuestion();
}

function renderOver() {
  screen = 'over';
  clearCountdown();
  stage().classList.remove('revealed');
  /* Worked out once per run: a language switch redraws this screen, and it
     must not read "new best" the first time and "best run" the second. */
  if (!run.over) {
    const isBest = run.score > S.stats.bestArcade;
    if (isBest) S.stats.bestArcade = run.score;
    const freeze = E.earnFreeze(S.streak, run.score);
    if (freeze.earned) S.streak = freeze.streak;
    persist();
    run.over = { isBest, freezes: freeze.earned ? S.streak.freezes : 0 };
  }
  const { isBest, freezes } = run.over;
  const allPlayed = run.lives > 0;
  const versus = run.challenge && run.challenge.score !== null
    ? `<p class="kin-streak">${esc(t().challengeResult(run.score, run.challenge.score))}</p>` : '';
  stage().innerHTML = `<div class="kin-res">
      <p class="kin-eyebrow">${esc(allPlayed ? t().allPlayed : t().runOver)}</p>
      <div class="kin-plaque kin-scoreplate">
        <p class="kin-score" dir="ltr">${run.score}</p>
        <p class="kin-title">${esc(isBest ? t().newBest : t().best(Math.max(S.stats.bestArcade, run.score)))}</p>
      </div>
      ${versus}
      ${freezes ? `<p class="kin-streak">${esc(t().freezeEarned(freezes))}</p>` : ''}
      <button class="kin-btn kin-block" type="button" data-action="kin:arcade">${esc(t().playAgain)}</button>
      <button class="kin-btn kin-ghost kin-block" type="button" id="kin-challenge-btn" data-action="kin:challenge">${esc(t().challengeBtn)}</button>
      <textarea id="kin-share-text" class="kin-share-text" readonly hidden rows="3" aria-label="${esc(t().challengeBtn)}"></textarea>
      <button class="kin-btn kin-ghost kin-block" type="button" data-action="kin:today">${esc(S.daily.done ? t().backToResult : t().backToKin)}</button>
      <p class="kin-note">${esc(t().arcadeNote)}</p>
    </div>`;
  renderProgress();
  window.scrollTo(0, 0);
  if (isBest && run.score >= 5) { sfx.win(); burst(24); }
}

// ── Home ────────────────────────────────────────────────────────────────────

/* A ring of the last seven days, today at the top and time running clockwise
   to it: a tick for each day played. It is the opening's dial in small — a
   scale you read by distance — and the number inside is the streak. */
function dialHTML(now) {
  const played = new Set(S.stats.days);
  let count = 0;
  const ticks = [];
  for (let i = 0; i < 7; i++) {
    const ago = 6 - i;
    const on = played.has(dateOfDay(day - ago));
    if (on) count += 1;
    const a = ((-90 + (i - 6) * (360 / 7)) * Math.PI) / 180;
    const [x1, y1, x2, y2] = [42, 55].flatMap((r) => [(60 + r * Math.cos(a)).toFixed(1), (60 + r * Math.sin(a)).toFixed(1)]);
    ticks.push(`<line class="kin-tick${on ? ' on' : ''}${ago === 0 ? ' now' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
  }
  const centre = now.alive ? `<b dir="ltr">${now.count}</b>` : '<span class="kin-dial-leaf" aria-hidden="true">🌱</span>';
  return `<div class="kin-dial" role="img" aria-label="${esc(t().dialLabel(count))}">
      <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <circle class="kin-ring kin-ring-scale" cx="60" cy="60" r="59"/>
        <circle class="kin-ring" cx="60" cy="60" r="57"/>
        <circle class="kin-ring kin-ring-in" cx="60" cy="60" r="36"/>
        ${ticks.join('')}
      </svg>
      <div class="kin-dial-in">${centre}</div>
    </div>`;
}

function renderHome() {
  screen = 'home';
  friend = null;
  run = null;
  clearCountdown();
  stage().classList.remove('revealed');
  const d = S.daily;
  const size = idsOf(d).length;
  const now = E.streakNow(S.streak, today);
  const streakLine = !now.alive ? t().streakStart : now.played ? t().streak(now.count) : now.covers ? t().streakCovered : t().streakKeep;
  const freezes = S.streak.freezes > 0 ? `<span class="kin-chip">${esc(t().freezes(S.streak.freezes))}</span>` : '';
  let plaque;
  if (d.done) {
    const score = d.picks.filter(Boolean).length;
    plaque = `<p class="kin-eyebrow">${esc(t().resultEyebrow(d.day))}</p>
      <p class="kin-score" dir="ltr">${score}<span>/${d.picks.length}</span></p>
      <p class="kin-title">${esc(t().titles[E.titleIndex(score, d.picks.length)])}</p>
      <p class="kin-grid" role="img" aria-label="${score}/${d.picks.length}">${d.picks.map(p => (p ? '🟩' : '🟥')).join('')}</p>
      <button class="kin-btn kin-block" type="button" id="kin-share-btn" data-action="kin:share">${esc(t().share)}</button>
      <textarea id="kin-share-text" class="kin-share-text" readonly hidden rows="3" aria-label="${esc(t().share)}"></textarea>
      <button class="kin-link" type="button" data-action="kin:results">${esc(t().recap)}</button>
      <p class="kin-countdown" id="kin-countdown"></p>`;
  } else {
    const going = d.picks.length > 0;
    plaque = `<p class="kin-eyebrow">${esc(t().homeToday)} · #${d.day}</p>
      <p class="kin-sub">${esc(going ? t().homeProgress(d.picks.length, size) : t().homeSub)}</p>
      <button class="kin-btn kin-block" type="button" data-action="kin:today">${esc(going ? t().homeContinue : t().homePlay)}</button>`;
  }
  stage().innerHTML = `<div class="kin-home">
      <div class="kin-hero">${dialHTML(now)}<p class="kin-streakline">${esc(streakLine)}</p>${freezes}</div>
      <section class="kin-plaque kin-today">${plaque}</section>
      <div class="kin-tiles">
        <button class="kin-tile" type="button" data-action="kin:arcade"><span class="kin-tile-ic" aria-hidden="true">🎯</span><b>${esc(t().homeArcade)}</b><span>${esc(t().homeArcadeSub(S.stats.bestArcade))}</span></button>
        <a class="kin-tile" href="${ATLAS_URL}"><span class="kin-tile-ic" aria-hidden="true">🌍</span><b>${esc(t().homeAtlas)}</b><span>${esc(t().homeAtlasSub)}</span></a>
      </div>
      ${installCardHTML()}
      <p class="kin-linkrow"><button class="kin-link" type="button" data-action="kin:stats">${esc(t().stats)}</button></p>
    </div>`;
  renderProgress();
  if (d.done) startCountdown();
  window.scrollTo(0, 0);
}

// ── The home screen ─────────────────────────────────────────────────────────

/** What to offer right now: the rules are in install.js; this gathers what they need. */
const offerNow = () => installOffer({
  standalone: isStandalone(window), installed: S.install.installed, canPrompt: !!installEvent, ios: isIOS(navigator),
  dismissedOn: S.install.dismissedOn, dailies: S.stats.dailies, today,
});

/* Only ever on Home: never mid-game, never on a result, never to someone who
   has not finished two Kins. "Not now" is kept for a month. */
function installCardHTML() {
  const offer = offerNow();
  if (!offer) return '';
  const buttons = offer === 'ios'
    ? `<button class="kin-btn kin-small" type="button" data-action="kin:install-not">${esc(t().installGotIt)}</button>`
    : `<button class="kin-btn kin-small" type="button" data-action="kin:install">${esc(t().installBtn)}</button>
       <button class="kin-link" type="button" data-action="kin:install-not">${esc(t().installNot)}</button>`;
  return `<section class="kin-install" data-offer="${offer}" aria-label="${esc(t().installTitle)}">
      <img class="kin-install-ic" src="assets/icon-192.png" width="44" height="44" alt="">
      <div class="kin-install-tx"><b>${esc(t().installTitle)}</b><span>${esc(offer === 'ios' ? t().installIos : t().installSub)}</span></div>
      <div class="kin-install-go">${buttons}</div>
    </section>`;
}

// ── Stats ───────────────────────────────────────────────────────────────────

function renderStats() {
  screen = 'stats';
  clearCountdown();
  stage().classList.remove('revealed');
  const sum = E.dailySummary(S.history);
  const v = {
    streak: E.streakNow(S.streak, today).count,
    bestStreak: Math.max(S.streak.best || 0, S.streak.count || 0),
    finished: Math.max(sum.finished, S.stats.dailies),
    scored: sum.finished, average: sum.average, best: sum.best,
    answers: S.stats.answers, correct: S.stats.correct,
    arcadeRuns: S.stats.arcadeRuns, bestArcade: S.stats.bestArcade,
    shares: S.stats.shares, firstSeen: S.stats.firstSeen,
  };
  const rows = t().statsRows(v).map(([k, label, val]) => `<tr data-stat="${k}"><th scope="row">${esc(label)}</th><td><bdi>${esc(val)}</bdi></td></tr>`).join('');
  const top = Math.max(1, ...sum.distribution);
  const dist = sum.distribution.map((n, i) => `<li data-tier="${i}"><span class="kin-dist-l">${esc(t().titles[i])}</span><span class="kin-dist-bar" aria-hidden="true"><i style="width:${Math.round((n / top) * 100)}%"></i></span><b dir="ltr">${n}</b></li>`).reverse().join('');
  stage().innerHTML = `<div class="kin-res kin-stats">
      <p class="kin-eyebrow">${esc(t().stats)}</p>
      <table>${rows}</table>
      <div class="kin-distwrap">
        <p class="kin-eyebrow">${esc(t().statsDist)}</p>
        <ul class="kin-dist">${dist}</ul>
      </div>
      <p class="kin-note">${esc(counting() ? t().statsNoteCounted : t().statsNote)}</p>
      <button class="kin-btn kin-block" type="button" data-action="kin:home">${esc(t().statsBack)}</button>
      <button class="kin-btn kin-ghost kin-block" type="button" id="kin-reset" data-action="kin:reset">${esc(t().statsReset)}</button>
    </div>`;
  renderProgress();
  window.scrollTo(0, 0);
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

/** Today's question, or today's result if it is already finished. */
function showToday() {
  screen = 'daily';
  friend = null;
  inARow = 0;
  /* All ten answered but the page closed on the last reveal: the result is
     theirs, and there is no eleventh question to show. */
  if (!S.daily.done && S.daily.picks.length >= idsOf(S.daily).length) finishDaily();
  if (S.daily.done) renderResults(false); else renderQuestion();
}

/** Where a page load starts. A first visit gets question one and nothing
    before it; anyone who has played gets Home, unless they are part-way
    through today's Kin, in which case they pick it up where they left it. */
function start() {
  if (launch.stats) return renderStats();
  if (launch.challenge) { track('link/challenge'); return startArcade(launch.challenge.seed, launch.challenge); }
  if (launch.kin !== null && launch.kin < day) {
    track('link/kin');
    friend = { day: launch.kin, picks: [], done: false };
    screen = 'daily';
    return renderQuestion();
  }
  const answered = S.daily.picks.length;
  if (!S.daily.done && answered >= idsOf(S.daily).length) return showToday();   // closed on the last reveal: that is their result
  if (answered > 0 && !S.daily.done) return showToday();                        // part-way through: carry on
  if (S.seenIntro || S.stats.answers > 0) return renderHome();
  return showToday();
}

function redraw() {
  if (screen === 'home') renderHome();
  else if (screen === 'results') renderResults(false);
  else if (screen === 'over') renderOver();
  else if (screen === 'stats') renderStats();
  else if (revealed) { const shown = revealed; renderQuestion(shown.qid); revealed = shown; showReveal(); }
  else renderQuestion();
}

registerActions({
  'kin:pick': (_a, _b, { el }) => pick(el.dataset.side),
  'kin:next': () => next(),
  'kin:share': () => { share(); },
  'kin:challenge': () => { challenge(); },
  'kin:arcade': () => { sfx.tap(); startArcade(); },
  'kin:today': () => { sfx.tap(); showToday(); },
  'kin:home': () => { sfx.tap(); renderHome(); settle(); },
  'kin:results': () => { sfx.tap(); renderResults(false); settle('.kin-btn'); },
  'kin:install': async () => {
    const ev = installEvent;
    if (!ev) return;
    installEvent = null;                 // the browser allows each event one use
    try {
      ev.prompt();
      const choice = await ev.userChoice;
      if (!choice || choice.outcome !== 'accepted') S.install.dismissedOn = today;
    } catch { S.install.dismissedOn = today; }
    persist();
    if (screen === 'home') renderHome();
  },
  'kin:install-not': () => { sfx.tap(); S.install.dismissedOn = today; persist(); renderHome(); settle(); },
  'kin:stats': () => { sfx.tap(); renderStats(); settle(); },
  'kin:lang': (_a, _b, { el }) => {
    const prev = lang;
    if (!LANGS.includes(el.dataset.lang) || el.dataset.lang === prev) return;
    lang = el.dataset.lang;
    store.siteSet('tol-lang', lang);
    applyLanguage();
    redraw();
    /* The pressed button went with the old row. Unless the redraw put focus
       somewhere on purpose, leave it on the way back. */
    if (!document.activeElement || document.activeElement === document.body) {
      const back = document.querySelector(`#kin-langs [data-lang="${prev}"]`);
      if (back) back.focus({ preventScroll: true });
    }
  },
  'kin:sound': () => {
    S.sound = !S.sound;
    setEnabled(S.sound);
    persist();
    renderSoundButton();
    if (S.sound) sfx.tap();
  },
  /* Erasing everything is not something to do with one stray tap, and the
     site raises no native dialog: the button asks again in place. */
  'kin:reset': (_a, _b, { el }) => {
    if (el.dataset.armed !== '1') {
      el.dataset.armed = '1';
      el.textContent = t().statsResetSure;
      setTimeout(() => { if (el.isConnected) { el.dataset.armed = ''; el.textContent = t().statsReset; } }, 4000);
      return;
    }
    store.reset();
    S = store.load();
    S.daily = { day, picks: [], done: false };
    S.stats.firstSeen = today;
    persist();
    renderHome();
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

/* The browser offers its install dialog once it decides the game qualifies.
   Hold it for the card on Home rather than let it interrupt, and redraw Home
   only if that changes what Home shows. */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  const before = offerNow();
  installEvent = e;
  S.install.installed = false;           // the browser only offers it to a device that does not have it
  if (screen === 'home' && offerNow() !== before) renderHome();
});
window.addEventListener('appinstalled', () => {
  installEvent = null;
  S.install.installed = true;
  persist();
  track('install');
  if (screen === 'home') renderHome();
});

document.documentElement.dataset.theme = store.siteGet('theme') === 'light' ? 'light' : 'dark';
applyLanguage();
persist();
start();

/* A visit is counted once a day per device, and only if the page turned
   counting on: d0 on the day a device first played, d1 the next, and so on. */
if (counting() && S.counted.visitOn !== today) {
  track(`visit/${visitBucket(S.stats.firstSeen, today)}`);
  S.counted.visitOn = today;
  persist();
}

/* The encyclopedia's service worker also serves the game's shell when there is
   no network, and is what lets a phone offer to install it. */
if ('serviceWorker' in navigator) {
  const register = () => { navigator.serviceWorker.register('/sw.js').catch(() => { /* no worker: the game still plays */ }); };
  if (document.readyState === 'complete') register(); else addEventListener('load', register);
}
