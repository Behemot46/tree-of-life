// ══════════════════════════════════════════════════════
// THEME — i18n translation + theme toggle
// ══════════════════════════════════════════════════════

import { state } from './state.js';
import { checkAchievement } from './engagement.js';
import { TRANSLATIONS } from './data.js';

// ── Late-binding deps (set via initThemeDeps) ──
let _deps = {};
export function initThemeDeps(deps) { Object.assign(_deps, deps); }

// ── Translation ──

export function t(key){return(TRANSLATIONS[state.currentLang]&&TRANSLATIONS[state.currentLang][key])||TRANSLATIONS.en[key]||key;}

export function setLang(lang){
  if(!TRANSLATIONS[lang])return;
  state.currentLang=lang;
  localStorage.setItem('tol-lang',lang);
  const isRtl=lang==='he';
  document.documentElement.dir=isRtl?'rtl':'ltr';
  document.documentElement.lang=lang;
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.lang===lang);
    btn.setAttribute('aria-pressed',btn.dataset.lang===lang?'true':'false');
  });
  applyI18n();
}

export function applyI18n(){
  const el=id=>document.getElementById(id);
  const set=(id,v)=>{const e=el(id);if(e)e.textContent=v;};
  set('i-title',t('title'));
  set('i-subtitle',t('subtitle'));
  set('splash-title',t('title'));
  set('splash-years',t('splash_years'));
  const si=el('search-input');if(si)si.placeholder=t('search_ph');
  set('i-leg-title',t('leg_title'));
  set('i-leg-luca',t('leg_luca'));
  set('i-leg-bact',t('leg_bact'));
  set('i-leg-arch',t('leg_arch'));
  set('i-leg-plant',t('leg_plant'));
  set('i-leg-anim',t('leg_anim'));
  set('i-leg-fungi',t('leg_fungi'));
  set('i-leg-prot',t('leg_prot'));
  set('i-p-traits',t('p_traits'));
  set('i-p-evo',t('p_evo'));
  set('i-p-sub',t('p_sub'));
  // Trivia i18n
  set('i-btn-trivia',t('trivia_btn'));
  set('i-trivia-title',t('trivia_title'));
  set('i-trivia-subtitle',t('trivia_subtitle'));
  const triviaRulesEl=el('i-trivia-rules');if(triviaRulesEl)triviaRulesEl.innerHTML=t('trivia_rules').replace(/\n/g,'<br>');
  set('i-trivia-start-btn',t('trivia_start'));
  // DNA Calculator i18n
  set('i-dna-title',t('dna_calc_title'));
  set('i-btn-dna-calc',t('dna_calc_btn'));
  set('i-dna-similarity-label',t('dna_similarity'));
  set('i-dna-preset-chimp',t('dna_preset_chimp'));
  set('i-dna-preset-banana',t('dna_preset_banana'));
  set('i-dna-preset-mushroom',t('dna_preset_mushroom'));
  set('i-dna-preset-bacterium',t('dna_preset_bacterium'));
  const dnaLabelA=el('dna-label-a');if(dnaLabelA&&!document.getElementById('dna-slot-a').classList.contains('filled'))dnaLabelA.textContent=t('dna_select_species');
  const dnaLabelB=el('dna-label-b');if(dnaLabelB&&!document.getElementById('dna-slot-b').classList.contains('filled'))dnaLabelB.textContent=t('dna_select_species');
  // Evo Path i18n
  set('i-evo-title',t('evo_title'));
  set('i-btn-evo-path',t('evo_btn'));
  set('i-evo-diverged',t('evo_diverged'));
  set('i-evo-show-tree',t('evo_show_tree'));
  set('i-evo-clear',t('evo_clear'));
  set('i-evo-clear-overlay',t('evo_clear_overlay'));
  set('i-evo-p1',t('evo_p1'));set('i-evo-p2',t('evo_p2'));set('i-evo-p3',t('evo_p3'));
  set('i-evo-p4',t('evo_p4'));set('i-evo-p5',t('evo_p5'));set('i-evo-p6',t('evo_p6'));
  const evoLabelA=el('evo-label-a');if(evoLabelA&&!document.getElementById('evo-slot-a').classList.contains('filled'))evoLabelA.textContent=t('evo_select');
  const evoLabelB=el('evo-label-b');if(evoLabelB&&!document.getElementById('evo-slot-b').classList.contains('filled'))evoLabelB.textContent=t('evo_select');
  const evoSearchInput=el('evo-search-input');if(evoSearchInput)evoSearchInput.placeholder=t('evo_search');
  set('i-compare-title',t('compare_title'));
  set('i-compare-back',t('compare_back'));
  // Nav buttons
  set('nav-back-label',t('nav_back'));
  set('nav-home-label',t('nav_home'));
  const navBackBtn=el('nav-back');
  if(navBackBtn) navBackBtn.setAttribute('aria-label',t('nav_back'));
  const navHomeBtn=el('nav-home');
  if(navHomeBtn) navHomeBtn.setAttribute('aria-label',t('nav_home'));
  // Update page title
  document.title=t('title')+' \u2014 '+t('subtitle').split(' ').slice(0,3).join(' ')+'...';
  // Update view toggle labels
  document.querySelectorAll('.view-btn').forEach(btn=>{
    const mode=btn.dataset.mode;
    if(mode==='radial')btn.innerHTML='&#9673; '+t('view_radial');
    else if(mode==='chronological')btn.innerHTML='&#8594; '+t('view_chrono');
    else if(mode==='cladogram')btn.innerHTML='&#9500; '+t('view_clado');
    else if(mode==='playback')btn.innerHTML='&#9654; '+t('view_playback');
  });
  // Update play button
  const playBtn=document.getElementById('era-play');
  if(playBtn)playBtn.title=_deps.eraPlayId?t('era_pause'):t('era_play');
  // Rebuild era presets, extinction markers, and segments with translated labels
  if(_deps.buildEraPresets) _deps.buildEraPresets();
  if(_deps.buildExtinctionMarkers) _deps.buildExtinctionMarkers();
  if(_deps.buildEraSegments) _deps.buildEraSegments();
  if(_deps.updateSpeciesCount) _deps.updateSpeciesCount();
  // Accessibility labels
  const skipLink=document.getElementById('skip-link');
  if(skipLink) skipLink.textContent=t('a11y_skip');
  const panelEl=document.getElementById('panel');
  if(panelEl) panelEl.setAttribute('aria-label',t('a11y_panel'));
  const svgEl2=document.getElementById('svg');
  if(svgEl2) svgEl2.setAttribute('aria-label',t('a11y_tree'));
  const homView=document.getElementById('hominin-view');
  if(homView) homView.setAttribute('aria-label',t('a11y_hominin_view'));
  // Refresh tour card text if tour is active
  if (typeof tourState !== 'undefined' && tourState.active && _deps._showTourStep) _deps._showTourStep(tourState.step);
}

// ── Theme Toggle ──

export function applyTheme(){
  if(state.isDark){
    document.documentElement.setAttribute('data-theme','dark');
    document.getElementById('theme-btn').textContent='\u2600';
  } else {
    document.documentElement.setAttribute('data-theme','light');
    document.getElementById('theme-btn').textContent='\ud83c\udf19';
  }
  // Re-render SVG so stroke CSS vars pick up new --bg value
  if(_deps.buildEraSegments) _deps.buildEraSegments();
  if(_deps.buildDensitySparkline) _deps.buildDensitySparkline();
  if(_deps.scheduleRender) _deps.scheduleRender();
}

export function toggleTheme(){
  state.isDark=!state.isDark;
  localStorage.setItem('theme',state.isDark?'dark':'light');
  applyTheme();
  checkAchievement('night_owl');
}
