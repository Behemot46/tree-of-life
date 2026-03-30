// ══════════════════════════════════════════════════════
// TRIVIA — trivia quiz game modal
// ══════════════════════════════════════════════════════

import { state, nodeMap } from './state.js';

// ── Late-binding deps (set via initTriviaDeps) ──
let _t, _navigateTo;
export function initTriviaDeps(deps) {
  _t = deps.t;
  _navigateTo = deps.navigateTo;
}
function t(key) { return _t ? _t(key) : key; }

// Uses globals: TRIVIABANK (from triviaData.js), PHOTO_MAP, ImageLoader
// TRIVIA_QUESTIONS is accessed via the global TRIVIABANK or similar

// ── Module constants ──
const TRIVIA_POINTS = {1:10,2:10,3:20,4:20,5:30,6:30,7:50,8:50,9:100,10:100};
const TRIVIA_TIERS = [
  {min:1,max:2,label:'Easy',cls:'easy'},
  {min:3,max:4,label:'Medium',cls:'medium'},
  {min:5,max:6,label:'Hard',cls:'hard'},
  {min:7,max:8,label:'Expert',cls:'expert'},
  {min:9,max:10,label:'Master',cls:'master'}
];

// ── Module state ──
let triviaState = null;

export function getTriviaLabel(diff){
  const t=TRIVIA_TIERS.find(t=>diff>=t.min&&diff<=t.max);
  return t||TRIVIA_TIERS[0];
}

export function openTrivia(){
  triviaState = null;
  document.getElementById('trivia-start').style.display='';
  document.getElementById('trivia-question').style.display='none';
  document.getElementById('trivia-result').style.display='none';
  const panel=document.getElementById('trivia-panel');
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');
}

export function closeTrivia(){
  const panel=document.getElementById('trivia-panel');
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden','true');
  triviaState=null;
}

export function selectTriviaQuestions(){
  const qs=TRIVIA_QUESTIONS;
  const selected=[];
  for(const tier of TRIVIA_TIERS){
    const pool=qs.filter(q=>q.difficulty>=tier.min&&q.difficulty<=tier.max);
    const shuffled=[...pool].sort(()=>Math.random()-0.5);
    selected.push(...shuffled.slice(0,3));
  }
  return selected;
}

export function startTriviaGame(){
  const questions=selectTriviaQuestions();
  triviaState={
    questions,
    currentIndex:0,
    score:0,
    streak:0,
    bestStreak:0,
    lives:3,
    answered:false,
    selectedOption:-1,
    tierScores:{}
  };
  TRIVIA_TIERS.forEach(t=>{triviaState.tierScores[t.cls]={correct:0,total:0};});
  document.getElementById('trivia-start').style.display='none';
  document.getElementById('trivia-question').style.display='';
  document.getElementById('trivia-result').style.display='none';
  showTriviaQuestion();
}

export function showTriviaQuestion(){
  const s=triviaState;
  const q=s.questions[s.currentIndex];
  const tier=getTriviaLabel(q.difficulty);
  const pts=TRIVIA_POINTS[q.difficulty];
  const letters=['A','B','C','D'];

  const container=document.getElementById('trivia-question');
  container.innerHTML=`
    <div class="trivia-header">
      <button class="btn-back" onclick="closeTrivia()" aria-label="Close">\u2715</button>
      <div style="font-size:0.75rem;color:var(--text-secondary);">Q ${s.currentIndex+1}/${s.questions.length}</div>
      <div style="display:flex;align-items:center;gap:0.6rem;">
        <div class="trivia-lives" id="trivia-lives">${renderTriviaLives(s.lives)}</div>
        <div class="trivia-score-display" id="trivia-score">${s.score} pts</div>
      </div>
    </div>
    <div class="trivia-progress"><div class="trivia-progress-fill" style="width:${((s.currentIndex)/s.questions.length)*100}%"></div></div>
    <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
      <span class="trivia-diff-badge ${tier.cls}">${tier.label}</span>
      <span style="font-size:0.65rem;color:var(--text-secondary);">${pts} pts</span>
      <span style="font-size:0.65rem;color:var(--text-secondary);margin-left:auto;">${q.category}</span>
      ${s.streak>=3?`<span class="trivia-streak-badge">${s.streak>=5?'\ud83d\udd25 Unstoppable!':'\ud83d\udd25 '+s.streak+' streak!'}</span>`:''}
    </div>
    <div class="trivia-question-text trivia-fadein">${q.question}</div>
    <div class="trivia-options" id="trivia-options">
      ${q.answers.map((a,i)=>`<button class="trivia-option" onclick="answerTrivia(${i})" data-idx="${i}">
        <span class="opt-letter">${letters[i]}</span><span>${a}</span>
      </button>`).join('')}
    </div>
    <div class="trivia-feedback" id="trivia-feedback">
      <div class="trivia-funfact" id="trivia-funfact"></div>
      <div class="trivia-learn-more" id="trivia-learn-more"></div>
    </div>
    <button class="trivia-next-btn" id="trivia-next-btn" onclick="nextTriviaQuestion()" style="display:none;">${t('trivia_next')||'Next Question'}</button>
  `;
}

export function renderTriviaLives(lives){
  let html='';
  for(let i=0;i<3;i++) html+=`<span${i>=lives?' class="lost"':''}>❤️</span>`;
  return html;
}

export function answerTrivia(idx){
  const s=triviaState;
  if(s.answered)return;
  s.answered=true;
  s.selectedOption=idx;
  const q=s.questions[s.currentIndex];
  const tier=getTriviaLabel(q.difficulty);
  const isCorrect=idx===q.correct;

  // Update tier stats
  s.tierScores[tier.cls].total++;

  const options=document.querySelectorAll('#trivia-options .trivia-option');
  options.forEach((btn,i)=>{
    btn.classList.add('answered');
    if(i===q.correct) btn.classList.add('correct');
    else if(i===idx&&!isCorrect){
      btn.classList.add('wrong');
      btn.classList.add('trivia-shake');
    }
    if(i!==q.correct&&i!==idx) btn.classList.add('reveal');
  });

  if(isCorrect){
    s.streak++;
    if(s.streak>s.bestStreak)s.bestStreak=s.streak;
    const basePts=TRIVIA_POINTS[q.difficulty];
    const streakBonus=s.streak>=3?s.streak*5:0;
    const totalPts=basePts+streakBonus;
    s.score+=totalPts;
    s.tierScores[tier.cls].correct++;
    // Update score display
    const scoreEl=document.getElementById('trivia-score');
    if(scoreEl)scoreEl.textContent=s.score+' pts';
    // Points popup
    showTriviaPointsPopup('+'+totalPts+(streakBonus?' (\ud83d\udd25+'+streakBonus+')':''));
  } else {
    s.streak=0;
    s.lives--;
    const livesEl=document.getElementById('trivia-lives');
    if(livesEl)livesEl.innerHTML=renderTriviaLives(s.lives);
  }

  // Show feedback
  const feedback=document.getElementById('trivia-feedback');
  feedback.classList.add('show');
  document.getElementById('trivia-funfact').textContent='\ud83d\udca1 '+q.funFact;
  const learnMore=document.getElementById('trivia-learn-more');
  if(q.learnMoreUrl){
    learnMore.innerHTML='\ud83d\udcfa <a href="'+q.learnMoreUrl+'" target="_blank" rel="noopener">'+(t('trivia_learn_more')||'Learn More')+'</a>';
  }

  // Show next button
  const nextBtn=document.getElementById('trivia-next-btn');
  if(s.lives<=0){
    nextBtn.textContent=t('trivia_see_results')||'See Results';
  } else if(s.currentIndex>=s.questions.length-1){
    nextBtn.textContent=t('trivia_see_results')||'See Results';
  } else {
    nextBtn.textContent=t('trivia_next')||'Next Question';
  }
  nextBtn.style.display='';
}

export function showTriviaPointsPopup(text){
  const container=document.querySelector('.trivia-panel-inner');
  const popup=document.createElement('div');
  popup.className='trivia-points-popup';
  popup.textContent=text;
  container.appendChild(popup);
  setTimeout(()=>popup.remove(),1000);
}

export function nextTriviaQuestion(){
  const s=triviaState;
  if(s.lives<=0||s.currentIndex>=s.questions.length-1){
    showTriviaResults();
    return;
  }
  s.currentIndex++;
  s.answered=false;
  s.selectedOption=-1;
  showTriviaQuestion();
}

export function showTriviaResults(){
  const s=triviaState;
  const total=s.questions.length;
  const answered=Math.min(s.currentIndex+1,total);
  let correctCount=0;
  TRIVIA_TIERS.forEach(t=>{correctCount+=s.tierScores[t.cls].correct;});

  // Star rating based on score percentage of max possible
  const maxPossible=s.questions.reduce((sum,q)=>sum+TRIVIA_POINTS[q.difficulty],0);
  const pct=maxPossible>0?s.score/maxPossible:0;
  const stars=pct>=0.7?3:pct>=0.4?2:pct>0?1:0;
  const starStr='\u2b50'.repeat(stars)+'\u2606'.repeat(3-stars);

  const emoji=s.lives<=0?'\ud83d\udc80':(stars>=3?'\ud83c\udfc6':stars>=2?'\ud83c\udf89':'\ud83d\udcaa');
  const title=s.lives<=0?(t('trivia_game_over')||'Game Over'):(t('trivia_complete')||'Complete!');

  document.getElementById('trivia-question').style.display='none';
  const result=document.getElementById('trivia-result');
  result.style.display='';

  let breakdownHTML='';
  TRIVIA_TIERS.forEach(tier=>{
    const ts=s.tierScores[tier.cls];
    if(ts.total>0){
      breakdownHTML+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:0.3rem 0;font-size:0.75rem;">
        <span class="trivia-diff-badge ${tier.cls}">${tier.label}</span>
        <span style="color:var(--text-secondary);font-family:var(--font-mono);">${ts.correct}/${ts.total}</span>
      </div>`;
    }
  });

  result.innerHTML=`
    <div class="trivia-header">
      <div class="trivia-title">${title}</div>
      <button class="btn-back" onclick="closeTrivia()" aria-label="Close">\u2715</button>
    </div>
    <div class="trivia-result-emoji">${emoji}</div>
    <div class="trivia-result-score">${s.score}</div>
    <div class="trivia-result-label">${t('trivia_points')||'points'} \u00b7 ${starStr}</div>
    <div class="trivia-result-stats">
      <div class="trivia-stat">
        <div class="trivia-stat-value">${correctCount}/${answered}</div>
        <div class="trivia-stat-label">${t('trivia_correct')||'Correct'}</div>
      </div>
      <div class="trivia-stat">
        <div class="trivia-stat-value">\ud83d\udd25 ${s.bestStreak}</div>
        <div class="trivia-stat-label">${t('trivia_best_streak')||'Best Streak'}</div>
      </div>
    </div>
    <div style="background:var(--surface-raised);border-radius:var(--radius-md);padding:0.6rem 0.8rem;margin-bottom:1rem;">
      ${breakdownHTML}
    </div>
    <div class="trivia-result-actions">
      <button class="trivia-start-btn" onclick="startTriviaGame()">${t('trivia_play_again')||'Play Again'}</button>
      <button class="trivia-next-btn" onclick="closeTrivia()">${t('trivia_close')||'Close'}</button>
    </div>
  `;
}
