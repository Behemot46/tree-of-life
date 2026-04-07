// ══════════════════════════════════════════════════════
// FAMILY OR FOE? — Game mode
// Given species A, guess if it's closer to B or C
// ══════════════════════════════════════════════════════

import { nodeMap } from './state.js';
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

const CURATED_TRIOS = [
  ['hippopotamus','blue-whale','wild-boar','Hippos and whales shared a land-walking ancestor ~55 Mya \u2014 before hippos, whales walked on land.'],
  ['fungi','h_sapiens','arabidopsis','Fungi diverged from animals ~1 Bya, but from plants ~1.5 Bya \u2014 your mushroom soup is closer kin than salad.'],
  ['birds','crocodylians','komodo-dragon','Birds are archosaurs, sharing a more recent ancestor with crocodilians than with lizards.'],
  ['bottlenose-dolphin','hippopotamus','white-shark','Dolphins are artiodactyls \u2014 more closely related to hippos than to any fish, despite living in the ocean.'],
  ['platypus','h_sapiens','komodo-dragon','Platypus is a mammal. Despite laying eggs, it\u2019s closer to humans than to any reptile.'],
  ['lungfish','h_sapiens','white-shark','Lungfish are our closest fish relative \u2014 they share a lobe-finned ancestor with all land vertebrates.'],
  ['horseshoe-crab','garden-spider','japanese-spider-crab','Despite the name, horseshoe crabs are chelicerates \u2014 closer to spiders than to true crabs.'],
  ['saccharomyces','h_sapiens','ecoli','Baker\u2019s yeast is a eukaryote \u2014 it shares more cellular machinery with you than with any bacterium.'],
  ['honey-bee','mantis-shrimp','garden-spider','Bees and shrimps are both pancrustaceans, more closely related than either is to spiders.'],
  ['coelacanth','h_sapiens','white-shark','Coelacanths are lobe-finned fish, sharing the ancestor that crawled onto land with us, not with sharks.'],
  ['sea-otter','gray-wolf','white-shark','Sea otters are carnivorans \u2014 more closely related to wolves than to any marine animal.'],
  ['coral-reef','turritopsis','amanita-muscaria','Corals and jellyfish are both cnidarians \u2014 much closer to each other than either is to fungi.'],
  ['octopus','garden-spider','honey-bee','Octopi are molluscs \u2014 NOT arthropods despite their intelligence.'],
  ['tuatara','komodo-dragon','crocodylians','Tuataras look like lizards but are rhynchocephalians \u2014 they diverged ~250 Mya.'],
  ['elephant-seal','manatee','white-shark','Elephant seals are carnivorans; manatees are afrotheres. The seal is closer to a dog than to a manatee.'],
  ['bamboo','sunflower','chanterelle','Bamboo and sunflowers are both angiosperms \u2014 far closer than either is to fungi.'],
  ['naked-mole-rat','capybara','hedgehog','Naked mole-rats and capybaras are both rodents.'],
  ['echidna','platypus','komodo-dragon','Echidnas and platypuses are both monotremes \u2014 the only egg-laying mammals.'],
  ['tardigrade','army-ant','garden-spider','Tardigrades are ecdysozoans like insects, not arachnids.'],
  ['peregrine-falcon','archaeopteryx','crocodylians','Falcons and Archaeopteryx are both theropod dinosaur descendants.'],
  ['giraffe','hippopotamus','moose','Giraffes are actually closer to deer/moose than to hippos.'],
  ['flamingo','hummingbird','ostrich','Flamingos and hummingbirds are both Mirandornithes \u2014 more related than to ostriches.'],
  ['vampire-bat','gray-wolf','hummingbird','Vampire bats are mammals \u2014 closer to wolves than to any bird despite both flying.'],
  ['slime-mold','amoeba','chanterelle','Slime molds are amoebozoans, not fungi.'],
  ['volvox','arabidopsis','paramecium','Volvox is a green alga, sharing the plant lineage.'],
  ['euglena','arabidopsis','ecoli','Euglena is a eukaryote with plant-like chloroplasts.'],
  ['firefly','army-ant','garden-spider','Fireflies and ants are both insects \u2014 much closer than to spiders.'],
  ['walrus','sea-otter','narwhal','Walruses and sea otters are both carnivorans.'],
  ['barn-owl','peregrine-falcon','cassowary','Owls and falcons are both neoavians.'],
  ['chimpanzee','gorilla','orangutan','Chimps are closer to gorillas \u2014 they shared an African ancestor after the orangutan split ~14 Mya.'],
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
  const availableIdxs = [];
  for (let i = 0; i < CURATED_TRIOS.length; i++) {
    if (!state.usedTrios.has(i)) availableIdxs.push(i);
  }
  while (availableIdxs.length > 0) {
    const pickAt = Math.floor(Math.random() * availableIdxs.length);
    const idx = availableIdxs.splice(pickAt, 1)[0];
    state.usedTrios.add(idx);
    const [targetId, closerId, fartherId, explanation] = CURATED_TRIOS[idx];
    const target = nodeMap[targetId];
    const closer = nodeMap[closerId];
    const farther = nodeMap[fartherId];
    if (target && closer && farther) {
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
    if (Math.abs(lcaB.appeared - lcaC.appeared) < 100) continue;
    const closerIsB = lcaB.appeared < lcaC.appeared;
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

  container.style.display = '';
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

  const cards = document.querySelectorAll('.wf-card');
  cards.forEach(card => {
    card.disabled = true;
    if (card.dataset.pick === correctPick) card.classList.add('correct');
    else if (card.dataset.pick === pick && !isCorrect) card.classList.add('wrong');
  });

  const vs = document.querySelector('.wf-vs');
  if (vs) vs.textContent = isCorrect ? '✓' : '✗';

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
