// ══════════════════════════════════════════════════════
// PLAYBACK — Time-lapse playback of evolutionary history
// ══════════════════════════════════════════════════════
import { state, nodeMap, animDone, PLAYBACK_LOCK_PREVIEW, PLAYBACK_DURATION } from './state.js';

// Late-bound deps (set by app.js to avoid circular imports)
let _layout, _centerOnTree, _scheduleRender, _applyT, _buildEraPresets, _getEraName, _updateEraTint, _updateSpeciesCount, _t;
export function initPlaybackDeps(deps) {
  _layout = deps.layout; _centerOnTree = deps.centerOnTree; _scheduleRender = deps.scheduleRender;
  _applyT = deps.applyT; _buildEraPresets = deps.buildEraPresets; _getEraName = deps.getEraName;
  _updateEraTint = deps.updateEraTint; _updateSpeciesCount = deps.updateSpeciesCount; _t = deps.t;
}

/* Infer appeared value for nodes missing it (use parent's value) */
export function inferAppeared(n){
  if(n.appeared!==undefined&&n.appeared!==null) return n.appeared;
  if(n._parent) return inferAppeared(n._parent);
  return 0;
}

/* Build sorted event list from all nodes + extinction events */
export function buildPlaybackEvents(){
  state.playbackEvents=[];
  Object.values(nodeMap).forEach(n=>{
    const mya=n.appeared!==undefined&&n.appeared!==null?n.appeared:inferAppeared(n);
    state.playbackEvents.push({mya,type:'node',id:n.id,node:n});
  });
  if(typeof EXTINCTIONS!=='undefined'){
    EXTINCTIONS.forEach(ext=>{
      state.playbackEvents.push({mya:ext.mya,type:'extinction',data:ext});
    });
  }
  // Sort descending by Mya (oldest first in playback)
  state.playbackEvents.sort((a,b)=>b.mya-a.mya);
}

/* Derive node state purely from cursor position */
export function getPlaybackNodeState(n){
  if(state.discoveredNodes.has(n.id)) return 'revealed';
  const mya=n.appeared!==undefined&&n.appeared!==null?n.appeared:inferAppeared(n);
  // Cursor counts DOWN from 3800→0. Node revealed when cursor passes its appeared value.
  if(state.playbackCursor<=mya) return 'revealed';
  if(state.playbackCursor<=mya+PLAYBACK_LOCK_PREVIEW) return 'locked';
  return 'hidden';
}

/* Update all node states from current cursor */
export function updatePlaybackStates(){
  Object.values(nodeMap).forEach(n=>{
    state.playbackNodeStates.set(n.id,getPlaybackNodeState(n));
  });
}

/* Enter playback mode */
export function enterPlaybackMode(){
  if(state.playbackMode) return;
  state.playbackMode=true;
  state.previousViewMode=state.viewMode;
  state.viewMode='playback';
  state.playbackCursor=3800;
  state.playbackSpeed=1;
  state.discoveredNodes.clear();
  state.pbFiredExtinctions.clear();
  state.pbLastEraBadge='';

  // Update view toggle buttons
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.mode==='playback');
  });

  buildPlaybackEvents();
  updatePlaybackStates();

  // Set era slider to 3800
  const eraSliderEl=document.getElementById('era-slider');
  if(eraSliderEl){eraSliderEl.value=3800;state.currentEra=3800;}

  // Build playback controls in era-presets area
  buildPlaybackControls();

  // Layout and render
  _layout();
  _centerOnTree(0.55);
  _scheduleRender(true);_applyT();

  // Auto-start playback after short delay
  setTimeout(()=>startPlayback(),600);
}

/* Exit playback mode */
export function exitPlaybackMode(){
  if(!state.playbackMode) return;
  state.playbackMode=false;
  pausePlayback();
  state.discoveredNodes.clear();
  state.playbackNodeStates.clear();
  state.pbFiredExtinctions.clear();

  // Remove discovery card if present
  const dc=document.getElementById('discovery-card-container');
  if(dc) dc.innerHTML='';
  // Remove era badge
  const badge=document.getElementById('pb-era-badge');
  if(badge){badge.classList.remove('show');badge.textContent='';}

  // Restore previous view mode
  state.viewMode=state.previousViewMode;
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.mode===state.viewMode);
  });

  // Restore era presets
  _buildEraPresets();

  // Re-layout and render
  _layout();
  animDone.clear();
  if(state.viewMode==='radial') _centerOnTree(0.75);
  else if(state.viewMode==='cladogram') _centerOnTree(0.7);
  else if(state.viewMode==='chronological') _centerOnTree(0.65);
  _scheduleRender(true);_applyT();
}

/* Start playback animation */
export function startPlayback(){
  if(state.playbackAnimId) return;
  state.playbackStartTime=performance.now();
  state.playbackStartCursor=state.playbackCursor;
  let lastRenderTime=0;
  let lastVisibleCount=0;
  const RENDER_INTERVAL=200; // only re-render ~5fps (DOM rebuild is expensive)
  function step(now){
    const elapsed=now-state.playbackStartTime;
    const progress=Math.min(1,elapsed/(PLAYBACK_DURATION/state.playbackSpeed));
    state.playbackCursor=Math.max(0,Math.round(state.playbackStartCursor*(1-progress)));

    // Sync era slider (lightweight, every frame)
    const eraSliderEl=document.getElementById('era-slider');
    if(eraSliderEl){
      eraSliderEl.value=state.playbackCursor;state.currentEra=state.playbackCursor;
      const eraFillEl=document.getElementById('era-fill');
      if(eraFillEl) eraFillEl.style.width=(state.playbackCursor/3800*100)+'%';
      const eraLabelEl=document.getElementById('era-label');
      if(eraLabelEl&&_getEraName) eraLabelEl.textContent=_getEraName(state.playbackCursor);
      if(_updateEraTint) _updateEraTint(state.playbackCursor);
    }

    checkExtinctionEvents();
    showEraBadge();

    // Only do heavy work (state update + render) at throttled rate
    if(now-lastRenderTime>=RENDER_INTERVAL){
      lastRenderTime=now;
      updatePlaybackStates();
      // Only re-render if the visible set changed
      let visCount=0;
      state.playbackNodeStates.forEach(s=>{if(s!=='hidden')visCount++;});
      if(visCount!==lastVisibleCount){
        lastVisibleCount=visCount;
        if(_updateSpeciesCount) _updateSpeciesCount();
        _scheduleRender(true);
      }
    }

    if(progress<1&&state.playbackMode){
      state.playbackAnimId=requestAnimationFrame(step);
    } else {
      // Final update when playback completes
      updatePlaybackStates();
      if(_updateSpeciesCount) _updateSpeciesCount();
      _scheduleRender(true);
      state.playbackAnimId=null;
      updatePlaybackControlState();
    }
  }
  state.playbackAnimId=requestAnimationFrame(step);
  updatePlaybackControlState();
}

/* Pause playback */
export function pausePlayback(){
  if(state.playbackAnimId){cancelAnimationFrame(state.playbackAnimId);state.playbackAnimId=null;}
  updatePlaybackControlState();
}

/* Toggle play/pause */
export function togglePlayback(){
  if(state.playbackAnimId) pausePlayback();
  else startPlayback();
}

/* Set playback speed */
export function setPlaybackSpeed(speed){
  const wasPlaying=!!state.playbackAnimId;
  if(wasPlaying) pausePlayback();
  state.playbackSpeed=speed;
  if(wasPlaying) startPlayback();
  updatePlaybackControlState();
}

/* Reset playback to beginning */
export function resetPlayback(){
  pausePlayback();
  state.playbackCursor=3800;
  state.discoveredNodes.clear();
  state.pbFiredExtinctions.clear();
  state.pbLastEraBadge='';
  updatePlaybackStates();
  const eraSliderEl=document.getElementById('era-slider');
  if(eraSliderEl){eraSliderEl.value=3800;state.currentEra=3800;}
  animDone.clear();
  _scheduleRender(true);
  updatePlaybackControlState();
}

/* Skip to next event */
export function skipToNextEvent(){
  const next=state.playbackEvents.find(e=>e.mya<state.playbackCursor);
  if(!next) return;
  pausePlayback();
  state.playbackCursor=next.mya;
  updatePlaybackStates();
  const eraSliderEl=document.getElementById('era-slider');
  if(eraSliderEl){
    eraSliderEl.value=state.playbackCursor;state.currentEra=state.playbackCursor;
    const eraFillEl=document.getElementById('era-fill');
    if(eraFillEl) eraFillEl.style.width=(state.playbackCursor/3800*100)+'%';
    const eraLabelEl=document.getElementById('era-label');
    if(eraLabelEl&&_getEraName) eraLabelEl.textContent=_getEraName(state.playbackCursor);
    if(_updateEraTint) _updateEraTint(state.playbackCursor);
  }
  checkExtinctionEvents();
  _scheduleRender(true);
}

/* Check and fire extinction effects */
export function checkExtinctionEvents(){
  if(typeof EXTINCTION_DETAILS==='undefined') return;
  EXTINCTION_DETAILS.forEach(ext=>{
    if(!state.pbFiredExtinctions.has(ext.mya)&&state.playbackCursor<=ext.mya&&state.playbackCursor>=ext.mya-50){
      state.pbFiredExtinctions.add(ext.mya);
      playExtinctionEffect(ext);
    }
  });
}

/* Play extinction flash effect */
export function playExtinctionEffect(ext){
  // Red flash
  const flash=document.createElement('div');
  flash.className='extinction-flash';
  document.body.appendChild(flash);
  setTimeout(()=>flash.remove(),2000);

  // Info overlay
  const info=document.createElement('div');
  info.className='extinction-info';
  const name=_t?_t(ext.key):ext.key;
  info.innerHTML=`<h3>${name}</h3><p>${ext.mya} Ma \u2022 ${ext.pct}% species lost</p>`;
  document.body.appendChild(info);
  setTimeout(()=>info.remove(),2800);
}

/* Show era badge when era changes */
export function showEraBadge(){
  if(!_getEraName) return;
  const name=_getEraName(state.playbackCursor);
  if(name===state.pbLastEraBadge) return;
  state.pbLastEraBadge=name;
  const badge=document.getElementById('pb-era-badge');
  if(!badge) return;
  badge.textContent=name;
  badge.classList.add('show');
  clearTimeout(badge._timeout);
  badge._timeout=setTimeout(()=>badge.classList.remove('show'),2500);
}

/* Discover a locked node (user clicks it) */
export function discoverNode(n){
  if(!state.playbackMode) return;
  const st=getPlaybackNodeState(n);
  if(st!=='locked') return;
  state.discoveredNodes.add(n.id);
  state.playbackNodeStates.set(n.id,'revealed');
  showDiscoveryCard(n);
  _scheduleRender(true);
}

/* Show discovery card near a node */
export function showDiscoveryCard(n){
  const container=document.getElementById('discovery-card-container');
  if(!container) return;
  container.innerHTML='';

  // Calculate screen position of node
  const svgRect=document.getElementById('svg').getBoundingClientRect();
  const sx=state.transform.x+n._x*state.transform.s+svgRect.left;
  const sy=state.transform.y+n._y*state.transform.s+svgRect.top;

  const card=document.createElement('div');
  card.className='discovery-card';
  card.style.left=Math.min(sx+20,window.innerWidth-300)+'px';
  card.style.top=Math.max(sy-60,10)+'px';

  const eraStr=n.appeared?n.appeared+' Ma':'Present';
  const factHtml=n.facts&&n.facts.length?`<div class="dc-fact">${n.facts[0].l}: ${n.facts[0].v}</div>`:'';
  card.innerHTML=`
    <div class="dc-icon">${n.icon||''}</div>
    <div class="dc-name">${n.name||n.id}</div>
    ${n.latin?`<div class="dc-latin">${n.latin}</div>`:''}
    <div class="dc-era">${eraStr}</div>
    ${n.desc?`<div class="dc-desc">${n.desc}</div>`:''}
    ${factHtml}
  `;
  card.addEventListener('click',()=>container.innerHTML='');
  container.appendChild(card);

  // Auto-dismiss after 3.5 seconds
  setTimeout(()=>{if(container.contains(card))container.innerHTML='';},3500);
}

/* Build playback control buttons in era-presets area */
export function buildPlaybackControls(){
  const container=document.getElementById('era-presets');
  if(!container) return;
  container.innerHTML='';
  container.className='playback-controls';

  const btns=[
    {label:'\u23f8 '+_t('pb_pause'),id:'pb-toggle',action:()=>togglePlayback()},
    {label:'0.5x',id:'pb-s05',action:()=>setPlaybackSpeed(0.5)},
    {label:'1x',id:'pb-s1',action:()=>setPlaybackSpeed(1),active:true},
    {label:'2x',id:'pb-s2',action:()=>setPlaybackSpeed(2)},
    {label:'4x',id:'pb-s4',action:()=>setPlaybackSpeed(4)},
    {label:'\u23ed '+_t('pb_skip'),id:'pb-skip',action:()=>skipToNextEvent()},
    {label:'\u21ba '+_t('pb_reset'),id:'pb-reset',action:()=>resetPlayback()},
    {label:'\u2715 '+_t('pb_exit'),id:'pb-exit',action:()=>exitPlaybackMode()},
  ];
  btns.forEach(b=>{
    const btn=document.createElement('button');
    btn.className='pb-btn'+(b.active?' active':'');
    btn.id=b.id;btn.textContent=b.label;
    btn.addEventListener('click',b.action);
    container.appendChild(btn);
  });
}

/* Update playback control button states */
export function updatePlaybackControlState(){
  const toggle=document.getElementById('pb-toggle');
  if(toggle) toggle.textContent=state.playbackAnimId?'\u23f8 '+_t('pb_pause'):'\u25b6 '+_t('pb_play');

  [0.5,1,2,4].forEach(s=>{
    const id='pb-s'+String(s).replace('.','');
    const btn=document.getElementById(id);
    if(btn) btn.classList.toggle('active',state.playbackSpeed===s);
  });
}
