// ══════════════════════════════════════════════════════
// APP.JS — Entry point module
// Imports all modules, wires dependencies, runs init()
// ══════════════════════════════════════════════════════

// ── State ──
import { state, nodeMap, navStack, animDone, confirmedPhotoUrls, HUMAN_PATH, TAXON_I18N, HOMININ_SKIP_IDS } from './state.js';

// ── Utilities ──
import { reducedMotion, canonicalHomininId, preprocess, sortChildrenByAge, homininToTreeNode } from './utils.js';

// ── Layout ──
import { layout, getVisible } from './layout.js';

// ── Zoom / Pan ──
import { applyT, smoothPanTo, centerOnTree, centerOnRoot, initZoomDeps, initPointerEvents } from './zoom.js';

// ── Renderer ──
import { render, scheduleRender, branchPath, initRendererDeps } from './renderer.js';

// ── Navigation ──
import { currentNavState, pushNav, restoreNavState, navBack, navHome, updateNavButtons, traceLineage, getAncestors, focusNode, updateBreadcrumb, showTip, hideTip, initNavDeps } from './navigation.js';

// ── Search ──
import { buildSearchIndex, searchEntities, normalizeSearchText, patchEnrichment } from './search.js';

// ── Timeline / Era Browser ──
import { nodeInEra, toggleExtinct, toggleDomain, resetDomains, getEraName, buildExtinctionMarkers, showExtinctionPopover, updateEraTint, updateSpeciesCount, updateThumbPosition, updateEraTimeRange, toggleEraPlay, animateSliderTo, updatePresetHighlight, buildEraPresets, buildEraSegments, buildDensitySparkline, initThumbDrag, initSpeedButtons, initTimelineDeps } from './timeline.js';

// ── Panel ──
import { renderPanelContent, showMainPanel, closePanel, openHominins, openHomininView, buildHeroFallback, getBranchType, renderBranchSection, renderMiniMap, renderPrimateCard, renderSapiensPanel, initPanelDeps, initPanelListeners } from './panel.js';

// ── Hominin / Compare ──
import { buildHomininTree, showComparePanel, closeCompare, finishCompare, cancelCompare, startCompareFromPanel, interceptShowMainPanel, initHomininDeps } from './hominin.js';

// ── DNA Calculator ──
import { openDnaCalc, closeDnaCalc, resetDnaUI, openDnaSearch, selectDnaSpecies, dnaPreset, showDnaResults, animateCounter, initDnaCalcDeps, initDnaCalcEvents } from './dnaCalc.js';

// ── Evolutionary Path ──
import { openEvoPath, closeEvoPath, openEvoSearch, fillEvoSlot, selectEvoSpecies, evoPreset, computeEvoPath, showEvoOnTree, clearEvoPath, clearEvoHighlight, getEvoFunFact, initEvoPathDeps, initEvoPathEvents } from './evoPath.js';

// ── Trivia ──
import { openTrivia, closeTrivia, startTriviaGame, showTriviaQuestion, answerTrivia, nextTriviaQuestion, showTriviaResults, getTriviaLabel, initTriviaDeps } from './trivia.js';

// ── Playback ──
import { inferAppeared, enterPlaybackMode, exitPlaybackMode, startPlayback, pausePlayback, togglePlayback, setPlaybackSpeed, resetPlayback, skipToNextEvent, buildPlaybackControls, updatePlaybackControlState, updatePlaybackStates, initPlaybackDeps } from './playback.js';

// ── Theme / i18n ──
import { t, setLang, applyI18n, applyTheme, toggleTheme, initThemeDeps } from './theme.js';

// ── Engagement / UI effects ──
import { showToast, dismissToast, showSpeciesToast, showIdleToast, resetIdleTimer, onUserActivity, a11yAnnounce, spawnParticles, showIntro, animateTreeEntrance, showLoading, hideLoading, generateSpeciesIllustration, initEngagementDeps, markExplored, isExplored, updateProgressBadge, checkAchievement, trackDomainToggle, trackViewMode, trackExtinctionClick, trackDnaCompare } from './engagement.js';

// ── Quiz ──
import { openQuiz, closeQuiz, initQuizEvents } from './quiz.js';


// ══════════════════════════════════════════════════════
// 1. WIRE LATE-BOUND DEPENDENCIES
// ══════════════════════════════════════════════════════

initRendererDeps({ showMainPanel, showTip, hideTip, smoothPanTo, layout });
initZoomDeps({ scheduleRender, layout, getVisible });
initNavDeps({ showMainPanel, closePanel, smoothPanTo, scheduleRender, layout, centerOnRoot, applyT, renderPanelContent, closeDnaCalc, closeEvoPath, closeTrivia });
initTimelineDeps({ scheduleRender, t, togglePlayback, pausePlayback });
initPanelDeps({ pushNav, updateNavButtons, updateBreadcrumb, scheduleRender, smoothPanTo, focusNode, t, generateSpeciesIllustration, navBack, layout, applyT, centerOnRoot });
initHomininDeps({ scheduleRender, showMainPanel, renderPanelContent, t });
initDnaCalcDeps({ searchEntities, t, showMainPanel });
initEvoPathDeps({ searchEntities, t, scheduleRender, smoothPanTo, layout, applyT });
initTriviaDeps({ t, navigateTo: (...args) => navigateTo(...args) });
initPlaybackDeps({ layout, centerOnTree, scheduleRender, applyT, buildEraPresets, getEraName, updateEraTint, updateSpeciesCount, t });
initThemeDeps({ buildEraPresets, buildExtinctionMarkers, buildEraSegments, updateSpeciesCount, buildDensitySparkline, scheduleRender });
initEngagementDeps({ t, navigateTo: (...args) => navigateTo(...args), showMainPanel });


// ══════════════════════════════════════════════════════
// 2. STARTUP CODE (runs at module load time)
// ══════════════════════════════════════════════════════

// Register PHOTO_MAP (from speciesData.js) with ImageLoader for tree node rendering
if(typeof ImageLoader!=='undefined'&&typeof PHOTO_MAP!=='undefined'&&ImageLoader.registerPhotoMap){
  ImageLoader.registerPhotoMap(PHOTO_MAP);
}

// Build hominin subtree
buildHomininTree();

// Preprocess tree
preprocess(TREE);
sortChildrenByAge(TREE);

// Patch enrichment data into the nodeMap
patchEnrichment();

// Expose getNodeById globally
window.getNodeById = id => nodeMap[id];


// ══════════════════════════════════════════════════════
// 3. setViewMode() — coordinator function
// ══════════════════════════════════════════════════════

function setViewMode(mode){
  if(state.playbackMode&&mode!=='playback') exitPlaybackMode();
  if(mode==='playback'){enterPlaybackMode();return;}
  state.viewMode=mode;
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.mode===mode);
  });
  animDone.clear();
  layout();
  if(mode==='radial'){centerOnRoot(0.18);}
  else if(mode==='cladogram'){centerOnTree(0.7);}
  else if(mode==='chronological'){centerOnTree(0.65);}
  scheduleRender(true);applyT();
  a11yAnnounce('Switched to '+mode+' view');
  trackViewMode(mode);
}


// ══════════════════════════════════════════════════════
// 4. navigateTo() — key coordinator function
// ══════════════════════════════════════════════════════

const searchInput=document.getElementById('search-input');
const searchResults=document.getElementById('search-results');

function navigateTo(id){
  searchInput.value='';searchResults.classList.remove('show');searchInput.setAttribute('aria-expanded','false');
  // Handle legacy hom: prefixed IDs from old search entries
  if(id.startsWith('hom:')){
    const homId=id.slice(4);
    const canonId=canonicalHomininId(homId);
    // Try tree node first (hominins are now in the main tree)
    if(nodeMap[canonId]){
      id=canonId;
    } else if(nodeMap[homId]){
      id=homId;
    } else {
      // Map h_sapiens to its tree node ID
      if(homId === 'h_sapiens') id = 'homo-sapiens';
    }
  }
  const n=nodeMap[id];if(!n)return;
  state.highlightedId=id;
  // Ensure path is not collapsed
  let c=n;while(c._parent){c._parent._collapsed=false;c=c._parent;}
  layout();scheduleRender(true);applyT();
  // Smooth pan to node (instant if reduced motion)
  if(reducedMotion()){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    state.transform.x=cx-n._x*state.transform.s;state.transform.y=cy-n._y*state.transform.s;applyT();
    showMainPanel(n,'?node='+encodeURIComponent(id));
  } else {
    smoothPanTo(n._x,n._y);
    setTimeout(()=>showMainPanel(n,'?node='+encodeURIComponent(id)),250);
  }
  setTimeout(()=>{state.highlightedId=null;scheduleRender();},2500);
}


// ══════════════════════════════════════════════════════
// 5. COMPARE MODE — wrap showMainPanel for intercept
// ══════════════════════════════════════════════════════

// Compare mode functions are in hominin.js.
// Wrap showMainPanel via interceptShowMainPanel for compare mode + a11y
const wrappedShowMainPanel = interceptShowMainPanel(showMainPanel);


// ══════════════════════════════════════════════════════
// 6. init() function
// ══════════════════════════════════════════════════════

function init(){
  showLoading();
  const _splash = document.getElementById('splash');
  const _taglineEl = document.getElementById('splash-tagline');
  if (_splash && _taglineEl) {
    _taglineEl.textContent = FACTS.getLoadingFact(state.currentLang);
    const _splashTitle = document.getElementById('splash-title');
    const _splashYears = document.getElementById('splash-years');
    if(_splashTitle) _splashTitle.textContent = t('title');
    if(_splashYears) _splashYears.textContent = t('splash_years');
    let _dismissed = false;
    const _dismissSplash = () => {
      if (_dismissed) return;
      _dismissed = true;
      _splash.style.opacity = '0';
      setTimeout(() => {
        _splash.style.display = 'none';
        animateTreeEntrance();
        if (!localStorage.getItem('tol-tour-done') && !new URLSearchParams(location.search).get('node')) {
          setTimeout(typeof startTour !== 'undefined' ? startTour : () => {}, 1200);
        }
      }, 800);
    };
    setTimeout(_dismissSplash, 7000);
    _splash.addEventListener('click', _dismissSplash);
  }
  function assignDomains(node, domain) {
    node._domain = domain;
    if (node.children) {
      node.children.forEach(child => {
        const childDomain = (node.id === 'luca' || node.id === 'eukaryota') ? child.id : domain;
        assignDomains(child, childDomain);
      });
    }
  }
  assignDomains(TREE, 'luca');
  layout();centerOnRoot(0.18);scheduleRender(true);applyT();
  spawnParticles();
  buildExtinctionMarkers();
  buildEraPresets();
  buildEraSegments();
  buildDensitySparkline();
  initThumbDrag();
  initSpeedButtons();
  updateThumbPosition(state.currentEra);
  eraLabel.textContent=getEraName(state.currentEra);
  updateEraTimeRange(state.currentEra);
  updateSpeciesCount();
  updateEraTint(state.currentEra);
  buildSearchIndex();
  // Restore saved theme & language
  state.isDark=localStorage.getItem('theme')==='dark';
  applyTheme();
  state.currentLang=localStorage.getItem('tol-lang')||'en';
  document.documentElement.dir=state.currentLang==='he'?'rtl':'ltr';
  document.documentElement.lang=state.currentLang;
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.lang===state.currentLang);
    btn.setAttribute('aria-pressed',btn.dataset.lang===state.currentLang?'true':'false');
  });
  applyI18n();
  // Restore URL state (?node=id)
  const urlNode=new URLSearchParams(location.search).get('node');
  if(urlNode){
    setTimeout(()=>navigateTo(urlNode),120);
  } else {
    showIntro();
  }
  // Keyboard shortcut hint
  setTimeout(()=>{
    const hint=document.getElementById('shortcuts-hint');
    if(hint&&!localStorage.getItem('hints-shown')){
      hint.style.opacity='1';
      setTimeout(()=>{hint.style.opacity='0';},4000);
      localStorage.setItem('hints-shown','1');
    }
  },3000);
  // Initialize engagement progress badge and quiz events
  updateProgressBadge();
  initQuizEvents();
}


// ══════════════════════════════════════════════════════
// 7. EVENT LISTENERS
// ══════════════════════════════════════════════════════

// ── Era Slider ──
const eraSlider=document.getElementById('era-slider');
const eraLabel=document.getElementById('era-label');
const eraFill=document.getElementById('era-fill');
eraSlider.addEventListener('input',()=>{
  state.currentEra=parseInt(eraSlider.value);
  const pct=(state.currentEra/3800)*100;
  if(eraFill) eraFill.style.width=pct+'%';
  eraLabel.textContent=getEraName(state.currentEra);
  updateEraTint(state.currentEra);
  updateSpeciesCount();
  if(state.currentEra>=3800) checkAchievement('deep_time');
  if(state.playbackMode){
    pausePlayback();
    state.playbackCursor=state.currentEra;
    state.pbFiredExtinctions.clear();
    state.playbackEvents.forEach(e=>{if(e.type==='extinction'&&e.mya>=state.playbackCursor)state.pbFiredExtinctions.add(e.mya);});
    updatePlaybackStates();
  } else {
    updatePresetHighlight(state.currentEra);
  }
  scheduleRender();
});

// ── Search UI ──
searchInput.addEventListener('input',()=>{
  const q=searchInput.value.trim();
  if(!q){
    searchResults.innerHTML=`
      <div style="padding:16px;text-align:center;font-family:'Inter',sans-serif;">
        <div style="font-size:24px;margin-bottom:8px;">🔍</div>
        <div style="font-size:13px;color:var(--color-text-muted);">${t('search_hint')}</div>
      </div>
    `;
    searchResults.style.display='block';
    searchResults.classList.add('show');
    searchInput.setAttribute('aria-expanded','true');
    return;
  }
  const matches=searchEntities(q);
  const lang=state.currentLang;
  searchResults.innerHTML=matches.map(m=>{
    const lookupId=m.homId||m.id;
    const i18nEntry=TAXON_I18N[lookupId];
    const localName=(lang!=='en'&&i18nEntry&&i18nEntry[lang])?i18nEntry[lang]:null;
    const displayName=localName||m.name;
    const subName=localName?m.name:'';
    const eraText=m.era?m.era.replace('~','').split(' ').slice(0,3).join(' '):'';
    return `<div class="sr-item" role="option" tabindex="-1" onclick="navigateTo('${m.id}')"><span class="sri-icon" aria-hidden="true">${m.icon}</span><span class="sri-name">${displayName}${subName?' <span style="font-size:0.8em;opacity:0.55;font-style:italic">'+subName+'</span>':''}</span><span class="sri-sub">${eraText}</span></div>`;
  }).join('');
  if(!matches.length){
    searchResults.innerHTML=`<div style="padding:16px;text-align:center;font-size:13px;color:var(--color-text-muted);font-family:'Heebo',sans-serif;">${t('search_no_results')}</div>`;
    searchResults.classList.add('show');
    a11yAnnounce('No results found');
  } else {
    searchResults.classList.add('show');
    a11yAnnounce(matches.length+' results found');
  }
  searchInput.setAttribute('aria-expanded',matches.length>0?'true':'false');
});
searchInput.addEventListener('blur',()=>setTimeout(()=>{searchResults.classList.remove('show');searchInput.setAttribute('aria-expanded','false');},200));

// ── Nav buttons ──
document.getElementById('nav-back').addEventListener('click',navBack);
document.getElementById('nav-home').addEventListener('click',navHome);

// ── Pointer / Zoom events (from zoom.js) ──
initPointerEvents();

// ── Panel listeners (close, svg click) ──
initPanelListeners();

// ── DNA Calculator events ──
initDnaCalcEvents();

// ── Evo Path events ──
initEvoPathEvents();

// ── Keyboard handlers ──
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    // Close keyboard help overlay first
    const kbdHelp=document.getElementById('kbd-help');
    if(kbdHelp&&kbdHelp.classList.contains('visible')){kbdHelp.classList.remove('visible');return;}
    if(state.playbackMode){exitPlaybackMode();return;}
    const _toastEl = document.getElementById('fact-toast');
    if(_toastEl && _toastEl.classList.contains('visible')){dismissToast();return;}
    if(document.getElementById('evo-path-panel').classList.contains('open')){closeEvoPath();return;}
    if(document.getElementById('trivia-panel').classList.contains('open')){closeTrivia();return;}
    // Close search dropdown first if open (not a nav action)
    if(searchResults.classList.contains('show')){
      searchResults.classList.remove('show');
      searchInput.setAttribute('aria-expanded','false');
      searchInput.blur();
      return;
    }
    // Close DNA calculator if open (not a nav action)
    if(document.getElementById('dna-panel').classList.contains('open')){closeDnaCalc();return;}
    // Shift+Escape = Home (reset everything)
    if(e.shiftKey){navHome();return;}
    // Escape = Back (step back one level)
    navBack();
    return;
  }
  // Prevent shortcuts firing while typing in any input/textarea
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable) return;
  // Toggle keyboard help overlay
  if(e.key==='?'){
    const kbdHelp=document.getElementById('kbd-help');
    if(kbdHelp) kbdHelp.classList.toggle('visible');
    return;
  }
  // Playback keyboard shortcuts
  if(state.playbackMode){
    if(e.key===' '){e.preventDefault();togglePlayback();}
    if(e.key==='ArrowRight'){e.preventDefault();skipToNextEvent();}
    return;
  }
  if(e.key==='f'||e.key==='F'){searchInput.focus();e.preventDefault();}
  if(e.key==='/'){e.preventDefault();const search=document.getElementById('search-input');if(search)search.focus();}
  if(e.key==='h'||e.key==='H'){navigateTo('hominini');}
  if(e.key==='r'||e.key==='R'){layout();centerOnRoot(0.18);scheduleRender(true);applyT();}
  if(e.key==='d'){const toggle=document.getElementById('theme-btn');if(toggle)toggle.click();}
});

// ── SVG tree keyboard navigation (WAI TreeView pattern) ──

// Pre-order traversal of visible (non-collapsed) tree nodes
function getVisibleTreeOrder(){
  const order=[];
  (function walk(n){
    order.push(n.id);
    if(n.children&&!n._collapsed) n.children.forEach(walk);
  })(TREE);
  return order;
}

function focusTreeNode(id){
  state.focusedNodeId=id;
  const g=document.querySelector('.node-group[data-node-id="'+id+'"]');
  if(g){
    g.focus({preventScroll:true});
    const label=g.getAttribute('aria-label');
    a11yAnnounce(label||nodeMap[id]?.name||id);
  }
}

document.getElementById('svg').addEventListener('keydown',function(e){
  const focused=document.activeElement;
  if(!focused||!focused.classList.contains('node-group')) return;
  const nid=focused.getAttribute('data-node-id');
  const node=nodeMap[nid];
  if(!node) return;

  if(e.key==='Enter'||e.key===' '){
    e.preventDefault();
    wrappedShowMainPanel(node);
    a11yAnnounce(node.name+' details opened');
    return;
  }

  // ArrowRight: expand collapsed → first child of expanded → noop on leaf
  if(e.key==='ArrowRight'){
    e.preventDefault();
    if(node.children&&node.children.length){
      if(node._collapsed){
        node._collapsed=false;
        state.focusedNodeId=nid;
        layout();scheduleRender(true);
        a11yAnnounce(node.name+' expanded, '+node.children.length+' children');
      } else {
        focusTreeNode(node.children[0].id);
      }
    }
    return;
  }

  // ArrowLeft: collapse expanded → parent of collapsed/leaf
  if(e.key==='ArrowLeft'){
    e.preventDefault();
    if(node.children&&node.children.length&&!node._collapsed){
      node._collapsed=true;
      state.focusedNodeId=nid;
      layout();scheduleRender(true);
      a11yAnnounce(node.name+' collapsed');
    } else if(node._parent){
      focusTreeNode(node._parent.id);
    }
    return;
  }

  // ArrowDown: next visible node in pre-order traversal
  if(e.key==='ArrowDown'){
    e.preventDefault();
    const order=getVisibleTreeOrder();
    const i=order.indexOf(nid);
    if(i>=0&&i<order.length-1) focusTreeNode(order[i+1]);
    return;
  }

  // ArrowUp: previous visible node in pre-order traversal
  if(e.key==='ArrowUp'){
    e.preventDefault();
    const order=getVisibleTreeOrder();
    const i=order.indexOf(nid);
    if(i>0) focusTreeNode(order[i-1]);
    return;
  }

  if(e.key==='Home'){
    e.preventDefault();
    focusTreeNode('luca');
    return;
  }
  if(e.key==='End'){
    e.preventDefault();
    const order=getVisibleTreeOrder();
    if(order.length) focusTreeNode(order[order.length-1]);
    return;
  }
});

// ── Panel focus trap (a11y) ──
(function setupPanelFocusTrap(){
  const panelEl=document.getElementById('panel');
  panelEl.addEventListener('keydown',function(e){
    if(e.key!=='Tab') return;
    const focusable=panelEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!focusable.length) return;
    const first=focusable[0];
    const last=focusable[focusable.length-1];
    if(e.shiftKey){
      if(document.activeElement===first){e.preventDefault();last.focus();}
    } else {
      if(document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
})();

// ── DNA panel focus trap (a11y) ──
(function setupDnaFocusTrap(){
  const dnaEl=document.getElementById('dna-panel');
  dnaEl.addEventListener('keydown',function(e){
    if(e.key==='Escape'){closeDnaCalc();return;}
    if(e.key!=='Tab') return;
    const focusable=dnaEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!focusable.length) return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey){
      if(document.activeElement===first){e.preventDefault();last.focus();}
    } else {
      if(document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
})();

// ── Evo-path panel focus trap (a11y) ──
(function setupEvoFocusTrap(){
  const evoEl=document.getElementById('evo-path-panel');
  evoEl.addEventListener('keydown',function(e){
    if(e.key==='Escape'){closeEvoPath();return;}
    if(e.key!=='Tab') return;
    const focusable=evoEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!focusable.length) return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey){
      if(document.activeElement===first){e.preventDefault();last.focus();}
    } else {
      if(document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
})();

// ── Keyboard help backdrop click ──
const _kbdHelp=document.getElementById('kbd-help');
if(_kbdHelp) _kbdHelp.addEventListener('click',function(e){
  if(e.target===this) this.classList.remove('visible');
});

// ── Resize handler ──
window.addEventListener('resize',()=>{layout();if(state.viewMode==='radial')centerOnRoot(state.transform.s);scheduleRender();applyT();});

// ── Mobile enhancements ──
(function mobilePatch(){
  const isMobile=()=>window.innerWidth<=768;
  const panel=document.getElementById('panel');
  const svgEl=document.getElementById('svg');

  // ── Swipe-to-close panel ──
  let panelTouchStartY=0, panelTouchDelta=0, panelSwiping=false;
  panel.addEventListener('touchstart',e=>{
    if(!isMobile()) return;
    const t=e.touches[0];
    panelTouchStartY=t.clientY;
    panelTouchDelta=0;
    panelSwiping=true;
  },{passive:true});
  panel.addEventListener('touchmove',e=>{
    if(!panelSwiping||!isMobile()) return;
    const t=e.touches[0];
    panelTouchDelta=t.clientY-panelTouchStartY;
    if(panelTouchDelta>0 && panel.scrollTop<=0){
      panel.style.transform=`translateY(${panelTouchDelta}px)`;
      panel.style.transition='none';
    }
  },{passive:true});
  panel.addEventListener('touchend',()=>{
    if(!panelSwiping||!isMobile()) return;
    panelSwiping=false;
    panel.style.transition='';
    if(panelTouchDelta>80){
      closePanel();
    } else {
      panel.style.transform='translateY(0)';
    }
    panelTouchDelta=0;
  },{passive:true});

  // ── Legend toggle on mobile ──
  const legend=document.getElementById('legend');
  if(legend){
    const legTitle=legend.querySelector('.leg-title');
    if(legTitle){
      legTitle.addEventListener('click',()=>{
        if(!isMobile()) return;
        legend.classList.toggle('m-collapsed');
      });
    }
    // Start collapsed on mobile
    if(isMobile()) legend.classList.add('m-collapsed');
    window.addEventListener('resize',()=>{
      if(!isMobile()) legend.classList.remove('m-collapsed');
      else if(!legend.classList.contains('m-collapsed')) legend.classList.add('m-collapsed');
    });
  }

  // ── Pinch-to-zoom (two-finger) ──
  let lastPinchDist=0;
  svgEl.addEventListener('touchstart',e=>{
    if(e.touches.length===2){
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      lastPinchDist=Math.hypot(dx,dy);
    }
  },{passive:true});
  svgEl.addEventListener('touchmove',e=>{
    if(e.touches.length===2){
      e.preventDefault();
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      const dist=Math.hypot(dx,dy);
      if(lastPinchDist>0){
        const scale=dist/lastPinchDist;
        const cx=(e.touches[0].clientX+e.touches[1].clientX)/2;
        const cy=(e.touches[0].clientY+e.touches[1].clientY)/2;
        const ns=Math.min(6,Math.max(0.05,state.transform.s*scale));
        state.transform.x=cx-(cx-state.transform.x)*(ns/state.transform.s);
        state.transform.y=cy-(cy-state.transform.y)*(ns/state.transform.s);
        state.transform.s=ns;
        applyT();
      }
      lastPinchDist=dist;
    }
  },{passive:false});
  svgEl.addEventListener('touchend',()=>{lastPinchDist=0;},{passive:true});

  // ── Browser back button integrates with navStack ──
  window.addEventListener('popstate',()=>{
    if(state._suppressPopstate) return;
    navBack();
  });
})();


// ══════════════════════════════════════════════════════
// 8. WINDOW EXPOSURES
// ══════════════════════════════════════════════════════

// Core UI
window.setLang = setLang;
window.toggleTheme = toggleTheme;
window.toggleExtinct = toggleExtinct;
window.navigateTo = navigateTo;

// Domain filtering
window.toggleDomain = toggleDomain;
window.resetDomains = resetDomains;

// View modes
window.setViewMode = setViewMode;
window.enterPlaybackMode = enterPlaybackMode;

// Panel & navigation
window.showMainPanel = wrappedShowMainPanel;
window.closePanel = closePanel;
window.openHomininView = openHomininView;
window.closeCompare = closeCompare;
window.finishCompare = finishCompare;
window.cancelCompare = cancelCompare;
window.startCompareFromPanel = startCompareFromPanel;

// DNA calculator
window.openDnaCalc = openDnaCalc;
window.closeDnaCalc = closeDnaCalc;
window.dnaPreset = dnaPreset;
window.openDnaSearch = openDnaSearch;
window.selectDnaSpecies = selectDnaSpecies;

// Evolutionary path
window.openEvoPath = openEvoPath;
window.closeEvoPath = closeEvoPath;
window.evoPreset = evoPreset;
window.openEvoSearch = openEvoSearch;
window.selectEvoSpecies = selectEvoSpecies;
window.showEvoOnTree = showEvoOnTree;
window.clearEvoPath = clearEvoPath;
window.clearEvoHighlight = clearEvoHighlight;

// Trivia
window.openTrivia = openTrivia;
window.closeTrivia = closeTrivia;
window.startTriviaGame = startTriviaGame;
window.answerTrivia = answerTrivia;
window.nextTriviaQuestion = nextTriviaQuestion;

// Tour (global from tour.js loaded via <script> tag, not an ES module)
window.startTour = typeof startTour !== 'undefined' ? startTour : () => {};

// Helpers
window.focusNode = focusNode;
window.a11yAnnounce = a11yAnnounce;
window.getNodeById = id => nodeMap[id];

// Playback
window.togglePlayback = togglePlayback;
window.exitPlaybackMode = exitPlaybackMode;
window.skipToNextEvent = skipToNextEvent;
window.setPlaybackSpeed = setPlaybackSpeed;
window.resetPlayback = resetPlayback;

// Toast
window.dismissToast = dismissToast;
window.openQuiz = openQuiz;
window.closeQuiz = closeQuiz;

// Timeline
window.toggleEraPlay = toggleEraPlay;
window.showExtinctionPopover = showExtinctionPopover;


// ══════════════════════════════════════════════════════
// 9. SERVICE WORKER + OFFLINE INDICATOR
// ══════════════════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

(function() {
  const banner = document.createElement('div');
  banner.id = 'offline-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.className = 'offline-banner';
  banner.textContent = 'You are offline — cached content is being used';
  document.body.appendChild(banner);

  function update() {
    banner.classList.toggle('visible', !navigator.onLine);
  }
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
})();


// ══════════════════════════════════════════════════════
// 10. RUN INIT
// ══════════════════════════════════════════════════════

init();
