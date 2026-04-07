// ══════════════════════════════════════════════════════
// ACHIEVEMENTS — definitions and lookup helpers
// ══════════════════════════════════════════════════════

export const ACHIEVEMENTS = [
  // Explorer
  { id:'first_contact',      cat:'explorer',    icon:'\uD83D\uDD2D', name:'First Contact',      desc:'Visit your first species',                 secret:false },
  { id:'budding_biologist',  cat:'explorer',    icon:'\uD83C\uDF31', name:'Budding Biologist',  desc:'Visit 10 species',                         secret:false },
  { id:'seasoned_explorer',  cat:'explorer',    icon:'\uD83E\uDDED', name:'Seasoned Explorer',  desc:'Visit 50 species',                         secret:false },
  { id:'world_traveler',     cat:'explorer',    icon:'\uD83C\uDF0D', name:'World Traveler',     desc:'Visit 100 species',                        secret:false },
  { id:'master_naturalist',  cat:'explorer',    icon:'\uD83D\uDC51', name:'Master Naturalist',  desc:'Visit every species',                      secret:false },
  { id:'kingdom_collector',  cat:'explorer',    icon:'\uD83C\uDF44', name:'Kingdom Collector',  desc:'Visit all species in any one kingdom',     secret:false },
  { id:'extinction_witness', cat:'explorer',    icon:'\uD83D\uDC80', name:'Extinction Witness', desc:'Visit all extinct species',                secret:false },

  // Scholar
  { id:'quiz_taker',         cat:'scholar',     icon:'\uD83D\uDCDD', name:'Quiz Taker',         desc:'Complete your first quiz',                 secret:false },
  { id:'quiz_champion',      cat:'scholar',     icon:'\uD83C\uDFC6', name:'Quiz Champion',      desc:'Perfect score in Quick Quiz',              secret:false },
  { id:'trivia_master',      cat:'scholar',     icon:'\uD83E\uDDE0', name:'Trivia Master',      desc:'Score 100+ in Classic Trivia',             secret:false },
  { id:'survival_expert',    cat:'scholar',     icon:'\u267E\uFE0F', name:'Survival Expert',    desc:'15+ streak in Survival mode',              secret:false },
  { id:'tour_graduate',      cat:'scholar',     icon:'\uD83C\uDF93', name:'Tour Graduate',      desc:'Complete all 3 guided tours',              secret:false },
  { id:'know_it_all',        cat:'scholar',     icon:'\uD83D\uDCDA', name:'Know-It-All',        desc:'Answer 100 questions correctly',           secret:false },

  // Pathfinder
  { id:'dna_detective',      cat:'pathfinder',  icon:'\uD83E\uDDEC', name:'DNA Detective',      desc:'Use Species Compare for the first time',   secret:false },
  { id:'chain_finder',       cat:'pathfinder',  icon:'\uD83D\uDD17', name:'Chain Finder',       desc:'Find a path with 8+ ancestors',            secret:false },
  { id:'unlikely_cousins',   cat:'pathfinder',  icon:'\uD83E\uDD1D', name:'Unlikely Cousins',   desc:'Compare species from different kingdoms',  secret:false },
  { id:'lucky_roller',       cat:'pathfinder',  icon:'\uD83C\uDFB2', name:'Lucky Roller',       desc:'Use the dice button 20 times',             secret:false },

  // Time Traveler
  { id:'time_traveler',      cat:'traveler',    icon:'\u231B',       name:'Time Traveler',      desc:'Complete a full playback to present',      secret:false },
  { id:'survivor',           cat:'traveler',    icon:'\uD83D\uDCA5', name:'Survivor',           desc:'Watch all 5 extinction events in playback', secret:false },

  // Secret
  { id:'night_owl',          cat:'secret',      icon:'\uD83E\uDD89', name:'Night Owl',          desc:'Explore 20 species after midnight',        secret:true,  hint:'The best discoveries happen after dark' },
  { id:'family_game_night',  cat:'secret',      icon:'\uD83C\uDFE0', name:'Family Game Night',  desc:'3+ players on the same device',            secret:true,  hint:'Science is better together' },
  { id:'deep_diver',         cat:'secret',      icon:'\uD83D\uDD2C', name:'Deep Diver',         desc:'Expand every single branch on the tree',   secret:true,  hint:"You\u2019ve seen it all... or have you?" },
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
