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
import { applyT, smoothPanTo, smoothZoomTo, centerOnTree, centerOnRoot, initZoomDeps, initPointerEvents } from './zoom.js';

// ── Renderer ──
import { render, scheduleRender, branchPath, initRendererDeps } from './renderer.js';

// ── Navigation ──
import { currentNavState, pushNav, restoreNavState, navBack, navHome, updateNavButtons, traceLineage, getAncestors, focusNode, updateBreadcrumb, showTip, hideTip, initNavDeps } from './navigation.js';

// ── Search ──
import { buildSearchIndex, searchEntities, normalizeSearchText, patchEnrichment } from './search.js';

// ── Timeline / Era Browser ──
import { nodeInEra, toggleExtinct, toggleDomain, resetDomains, getEraName, buildExtinctionMarkers, showExtinctionPopover, updateEraTint, updateSpeciesCount, updateThumbPosition, updateEraTimeRange, toggleEraPlay, animateSliderTo, updatePresetHighlight, buildEraPresets, buildEraSegments, buildDensitySparkline, initThumbDrag, initSpeedButtons, initTimelineDeps } from './timeline.js';

// ── Panel ──
import { renderPanelContent, showMainPanel, closePanel, openHominins, openHomininView, setHomininOverlayOpener, buildHeroFallback, getBranchType, renderBranchSection, renderMiniMap, renderPrimateCard, initPanelDeps, initPanelListeners } from './panel.js';

// ── Hominin / Compare ──
import { buildHomininTree, showComparePanel, closeCompare, finishCompare, cancelCompare, startCompareFromPanel, interceptShowMainPanel, initHomininDeps, openHomininOverlay, closeHomininOverlay, renderHominins, showHominDetail, toggleCompareMode, viewHomininOnTree, initHomininOverlay } from './hominin.js';

// ── DNA Calculator ──
import { openDnaCalc, closeDnaCalc, resetDnaUI, openDnaSearch, selectDnaSpecies, dnaPreset, showDnaResults, animateCounter, initDnaCalcDeps, initDnaCalcEvents } from './dnaCalc.js';

// ── Evolutionary Path ──
import { openEvoPath, closeEvoPath, openEvoSearch, fillEvoSlot, selectEvoSpecies, evoPreset, computeEvoPath, showEvoOnTree, clearEvoPath, clearEvoHighlight, getEvoFunFact, initEvoPathDeps, initEvoPathEvents } from './evoPath.js';

// ── Unified Game ──
import { openGame, closeGame, initGameEvents, initGameDeps } from './game.js';

// ── Playback ──
import { inferAppeared, enterPlaybackMode, exitPlaybackMode, startPlayback, pausePlayback, togglePlayback, setPlaybackSpeed, resetPlayback, skipToNextEvent, buildPlaybackControls, updatePlaybackControlState, updatePlaybackStates, initPlaybackDeps } from './playback.js';

// ── Theme / i18n ──
import { t, setLang, applyI18n, applyTheme, toggleTheme, initThemeDeps } from './theme.js';

// ── Engagement / UI effects ──
import { showToast, dismissToast, showSpeciesToast, showIdleToast, resetIdleTimer, onUserActivity, a11yAnnounce, spawnParticles, showIntro, animateTreeEntrance, generateSpeciesIllustration, initEngagementDeps, markExplored, isExplored, updateProgressBadge, checkAchievement, trackDomainToggle, trackViewMode, trackExtinctionClick, trackDnaCompare } from './engagement.js';


// ── Data (barrel + direct for niche modules) ──
import { TREE, lightenColor, PHOTO_MAP, FACTS, ImageLoader } from './data.js';
import { expandTree } from './treeExpansion.js';
import { initTourDeps, showTourSelector, startTour, endTour } from './tours.js';
import { initSplash } from './splash.js';
import { ERA_NAMES } from './uiData.js';
import { openSapiens, closeSapiens, initSapiensDeps } from './sapiens.js';

// ── Minimap ──
import { renderMinimap } from './minimap.js';
window._onRenderComplete=renderMinimap;


// ══════════════════════════════════════════════════════
// 1. WIRE LATE-BOUND DEPENDENCIES
// ══════════════════════════════════════════════════════

initRendererDeps({ showMainPanel, showTip, hideTip, smoothPanTo, smoothZoomTo, layout, updateBreadcrumb });
initZoomDeps({ scheduleRender, layout, getVisible });
initNavDeps({ showMainPanel, closePanel, smoothPanTo, smoothZoomTo, scheduleRender, layout, centerOnRoot, applyT, renderPanelContent, closeDnaCalc, closeEvoPath, closeGame });
initTimelineDeps({ scheduleRender, t, togglePlayback, pausePlayback });
initPanelDeps({ pushNav, updateNavButtons, updateBreadcrumb, scheduleRender, smoothPanTo, focusNode, t, generateSpeciesIllustration, navBack, layout, applyT, centerOnRoot, openSapiens });
initSapiensDeps({ pushNav, navBack, showMainPanel, t, scheduleRender, smoothPanTo });
initHomininDeps({ scheduleRender, showMainPanel, renderPanelContent, t });
setHomininOverlayOpener(openHomininOverlay);
initDnaCalcDeps({ searchEntities, t, showMainPanel });
initEvoPathDeps({ searchEntities, t, scheduleRender, smoothPanTo, layout, applyT });
initGameDeps({ t, navigateTo: (...args) => navigateTo(...args) });
initPlaybackDeps({ layout, centerOnTree, scheduleRender, applyT, buildEraPresets, getEraName, updateEraTint, updateSpeciesCount, t });
initThemeDeps({ buildEraPresets, buildExtinctionMarkers, buildEraSegments, updateSpeciesCount, buildDensitySparkline, scheduleRender });
initEngagementDeps({ t, navigateTo: (...args) => navigateTo(...args), showMainPanel });


// ══════════════════════════════════════════════════════
// 2. STARTUP CODE (runs at module load time)
// ══════════════════════════════════════════════════════

// Register PHOTO_MAP (from speciesData.js) with ImageLoader for tree node rendering
if(ImageLoader&&PHOTO_MAP&&ImageLoader.registerPhotoMap){
  ImageLoader.registerPhotoMap(PHOTO_MAP);
}

// Build hominin subtree
buildHomininTree();

// Expand tree (adds ~200 species with IUCN data)
expandTree(TREE, lightenColor);

// Preprocess tree
preprocess(TREE);
sortChildrenByAge(TREE);

// Patch enrichment data into the nodeMap
patchEnrichment();

// Patch funFact onto treeExpansion.js nodes that lack it (these nodes are added at runtime without funFact)
(function patchFunFacts(){
  const ff={
    'lion':'A lion\'s roar reaches 114 decibels and can be heard 8 km away — it\'s not just territorial, it\'s a precise social signal that allows individuals to count and locate their pride mates in the dark.',
    'tiger':'Tiger stripes are not just on their fur — their skin is striped too. No two tigers have the same pattern, making stripes as unique as human fingerprints.',
    'polar-bear':'Polar bear fur is not white — it\'s transparent and hollow. Each hair is a fiber-optic strand that funnels ultraviolet light to the black skin beneath, which absorbs heat.',
    'giant-panda':'Giant pandas have a "false thumb" — an enlarged radial sesamoid bone that acts as a sixth digit, evolved specifically for gripping bamboo. It\'s convergent evolution with the red panda\'s identical solution.',
    'snow-leopard':'Snow leopards cannot roar — the hyoid bone in their throat is not fully ossified. Instead, they communicate with chuffs, wails, and a unique "prusten" puffing sound also used by tigers.',
    'red-panda':'The red panda was classified in its own family for over 100 years before DNA analysis settled the debate — it is the sole living member of Ailuridae, more closely related to weasels than to giant pandas.',
    'pangolin':'Pangolins are the world\'s most trafficked mammal — over a million were taken from the wild in the last decade. Their scales are pure keratin, identical in composition to human fingernails.',
    'red-kangaroo':'Female red kangaroos can pause a pregnancy — a fertilized embryo enters dormancy while the pouch is occupied, resuming development only after the joey leaves. Two joeys at different stages can nurse simultaneously.',
    'koala':'Koalas have fingerprints nearly indistinguishable from human fingerprints — independently evolved, they have fooled crime scene investigators. They sleep 20 hours a day to process toxic eucalyptus leaves.',
    'moose':'A moose\'s antlers can grow 2.5 cm per day — the fastest-growing tissue of any animal on Earth. They are shed and regrown annually, requiring more calcium than the entire skeleton contains.',
    'humpback-whale':'Humpback whale songs evolve like cultural fads — a new song style that appears in one ocean population is adopted across thousands of miles within two years, spreading from group to group like a hit record.',
    'narwhal':'The narwhal\'s tusk is a tooth — specifically the left upper canine grown through the upper lip. It contains 10 million nerve endings and may be a sensory organ that detects salinity and temperature.',
    'wolverine':'The wolverine has a superpower: a unique mucous membrane that lets it eat frozen carrion. It has been documented driving grizzly bears from kills three times its size through sheer ferocity.',
    'hippopotamus':'Hippos secrete a red oily substance from their skin that acts as sunscreen, antiseptic, and moisturizer simultaneously — it is sometimes called "blood sweat" though it contains none of either.',
    'bald-eagle':'Bald eagles were removed from the US Endangered Species List in 2007 after recovering from fewer than 500 breeding pairs in 1963 to over 9,800 today — one of conservation\'s greatest success stories.',
    'condor':'California condors became extinct in the wild in 1987 — every living bird was captured. Through captive breeding, there are now 500+ birds including 300 in the wild, a conservation resurrection.',
    'flamingo':'Flamingos are not born pink — their color comes entirely from carotenoid pigments in the algae and crustaceans they eat. A flamingo fed a colorless diet turns white within months.',
    'barn-owl':'Barn owls can locate prey in total darkness by sound alone — their facial disc acts as a parabolic dish, and their asymmetrically placed ears triangulate sound in three dimensions.',
    'cassowary':'The cassowary\'s casque is hollow and may function as a low-frequency amplifier — some researchers think it allows cassowaries to communicate in sounds too low for humans to hear.',
    'hammerhead-shark':'The hammerhead\'s wide-set eyes give it 360-degree vertical vision — it can see above and below simultaneously, but has a blind spot directly in front of its nose.',
    'chameleon':'Chameleons do not change color for camouflage — they change color to communicate mood and social status. The skin contains crystalline nanostructures that shift light reflection based on emotion.',
    'tardigrade':'Tardigrades can survive in the vacuum of space, temperatures from -272°C to 150°C, radiation doses 1,000x lethal to humans, and pressures six times the deepest ocean. They enter cryptobiosis — virtual suspended animation.',
    'firefly':'Firefly light is the most efficient light ever measured — nearly 100% of the energy becomes light with almost no heat. LED engineers have used firefly lantern geometry to improve LED efficiency by 50%.',
    'atlas-moth':'The atlas moth has no mouth — it cannot eat. It survives its entire adult life on fat reserves from its caterpillar stage, living only 1-2 weeks solely to reproduce.',
    'army-ant':'Army ant colonies are a superorganism — 700,000 individuals with no queen directing behavior. Complex collective intelligence emerges from simple rules followed by each ant, including building living bridges from their own bodies.',
    'japanese-spider-crab':'The Japanese spider crab has the largest leg span of any arthropod — up to 3.7 meters. Despite their fearsome appearance, they are gentle omnivores that can live over 100 years.',
    'garden-spider':'The garden spider rebuilds its entire web every single day — consuming the old silk to recycle proteins, then spinning a new geometrically perfect orb in under an hour.',
    'hermit-crab':'Hermit crabs hold "vacancy chains" — when a new large shell arrives on the beach, crabs line up by size, then swap shells simultaneously in a coordinated chain, each one upgrading to the shell vacated by the crab ahead of it.',
    'water-lily':'The giant water lily\'s leaf is a feat of structural engineering — a network of air-filled ribs on the underside distributes weight so evenly that a single leaf can support a human child.',
    'orchid':'Orchids represent the most extreme evolutionary deception in nature — some species mimic female insects in both appearance and pheromone scent so precisely that male insects attempt to mate with them, inadvertently pollinating the flower.',
    'bamboo':'Bamboo can grow 91 cm in a single day — the fastest growth of any plant on Earth. Some species flower only once every 120 years, then die simultaneously across entire forests.',
    'cactus':'The saguaro cactus grows only 2.5 cm in its first decade of life but can live 200 years and store 750 liters of water in its accordion-like ribs after a single rainfall.',
    'sundew':'The sundew\'s sticky tentacles move with detectable speed — a tentacle can curve around an insect in 10 seconds. The plant distinguishes food from debris: it ignores sand grains but responds to nitrogen-containing compounds.',
    'cordyceps':'Cordyceps fungi are mind-controlling parasites — they infect ants, alter their behavior to climb to a precise height, force them to bite a leaf vein, then erupt through the skull. Each species targets a single host.',
    'truffle':'Truffles cannot reproduce without animals — they grow entirely underground and rely on being eaten and their spores dispersed. They evolved an extraordinary smell to attract the mammals that dig them up.',
    'lichen':'Lichen is not one organism but a symbiosis of fungus and algae — and recent research found a third partner, a yeast. They are the first colonizers of bare rock, creating soil that makes all terrestrial life possible.',
    'chanterelle':'Chanterelles form mycorrhizal networks with tree roots that can span entire forests — they trade minerals the tree cannot access for sugars the fungus cannot photosynthesize. The network transfers nutrients between trees.',
    'euglena':'Euglena is the organism that broke the animal-plant divide — it photosynthesizes in light and hunts for food in darkness, forcing 19th-century scientists to create an entirely new kingdom of life to classify it.',
    'radiolarian':'Radiolarian skeletons are geometric perfection on a microscopic scale — intricate silica lattices that inspired architect Buckminster Fuller\'s geodesic dome. They have been building the same structures for 540 million years.',
    'slime-mold':'Slime molds can solve mazes and optimize transport networks without a brain or nervous system. When grown on a map with food at major cities, they recreate the Tokyo rail network — the result of millions of years of trial and error.',
    'stentor':'Stentor can regenerate an entirely new organism from a fragment 1/27th of its original volume — the smallest piece that can rebuild a complete functional cell of any known organism.'
  };
  Object.entries(ff).forEach(([id,fact])=>{
    const n=nodeMap[id];
    if(n && !n.funFact) n.funFact=fact;
  });
})();

// Expose getNodeById globally
window.getNodeById = id => nodeMap[id];


// ══════════════════════════════════════════════════════
// 3. setViewMode() — coordinator function
// ══════════════════════════════════════════════════════

function setViewMode(mode){
  if(state.playbackMode&&mode!=='playback') exitPlaybackMode();
  if(mode==='playback'){enterPlaybackMode();return;}
  if(mode==='chronological') mode='cladogram';
  state.viewMode=mode;
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.mode===mode);
  });
  animDone.clear();
  layout();
  if(mode==='radial'){centerOnRoot(0.18);}
  else if(mode==='cladogram'){
    // Fit entire visible tree into viewport
    const vis=getVisible(TREE);
    if(vis.length){
      const xs=vis.map(n=>n._x),ys=vis.map(n=>n._y);
      const bw=(Math.max(...xs)-Math.min(...xs))||400;
      const bh=(Math.max(...ys)-Math.min(...ys))||400;
      const fitS=Math.min(window.innerWidth*0.85/bw,window.innerHeight*0.85/bh,1.0);
      centerOnTree(Math.max(0.05,fitS));
    }
  }
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
  // ── Splash animation ──
  const _splashCanvas = document.getElementById('splash-canvas');
  const _splashFallback = document.getElementById('splash-fallback');

  // Fallback: if Canvas doesn't init within 500ms, show CSS fallback
  setTimeout(() => {
    if (_splashCanvas && !_splashCanvas.dataset.ready && _splashFallback) {
      _splashCanvas.style.display = 'none';
      _splashFallback.style.display = 'flex';
      _splashFallback.addEventListener('click', () => {
        const s = document.getElementById('splash');
        if (s) { s.style.opacity = '0'; setTimeout(() => { s.style.display = 'none'; animateTreeEntrance(); }, 500); }
      });
    }
  }, 500);

  if (_splashCanvas) {
    initSplash(_splashCanvas, {
      tree: TREE,
      photoMap: PHOTO_MAP,
      t,
      facts: FACTS,
      eraNames: ERA_NAMES,
      onDone: () => {
        animateTreeEntrance();
        if (!localStorage.getItem('tol-tour-done') && !new URLSearchParams(location.search).get('node')) {
          setTimeout(showTourSelector, 1200);
        }
      }
    });
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
  initGameEvents();
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

// ── Hominin overlay listeners (close, filters, escape) ──
initHomininOverlay();

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
    if(document.getElementById('game-panel').classList.contains('open')){closeGame();return;}
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
window.toggleCompareMode = toggleCompareMode;
window.viewHomininOnTree = viewHomininOnTree;
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
window.openGame = openGame;
window.closeGame = closeGame;

// Tours
initTourDeps({ state, nodeMap, layout, scheduleRender, applyT, animateSliderTo, t });
window.showTourSelector = showTourSelector;
window.startTour = startTour;
window.endTour = endTour;
window.t = t;

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
