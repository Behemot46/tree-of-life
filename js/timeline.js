// ══════════════════════════════════════════════════════
// TIMELINE — Era filtering, geological timeline, extinction markers
// ══════════════════════════════════════════════════════
import { state, nodeMap } from './state.js';
import { getPlaybackNodeState } from './playback.js';
import { trackDomainToggle, trackExtinctionClick, checkAchievement } from './engagement.js';
import { ERA_NAMES, TIMELINE_SEGMENTS } from './uiData.js';

// Late-bound deps (set by app.js to avoid circular imports)
let _scheduleRender, _t, _togglePlayback, _pausePlayback;
export function initTimelineDeps(deps) {
  _scheduleRender = deps.scheduleRender;
  _t = deps.t;
  _togglePlayback = deps.togglePlayback;
  _pausePlayback = deps.pausePlayback;
}

// ── Local state for era play animation ──
let eraPlayId = null;
let eraPlaySpeed = 1;

// ── Constants ──
export const EXTINCTION_DETAILS=[
  {mya:445,key:'ext_ordovician',pct:85,causeKey:'ext_cause_ordovician',survKey:'ext_surv_ordovician'},
  {mya:370,key:'ext_devonian',pct:75,causeKey:'ext_cause_devonian',survKey:'ext_surv_devonian'},
  {mya:252,key:'ext_permian',pct:96,causeKey:'ext_cause_permian',survKey:'ext_surv_permian'},
  {mya:200,key:'ext_triassic',pct:80,causeKey:'ext_cause_triassic',survKey:'ext_surv_triassic'},
  {mya:66,key:'ext_kpg',pct:76,causeKey:'ext_cause_kpg',survKey:'ext_surv_kpg'}
];

const EXTINCTION_ICONS={445:'\uD83D\uDC80',370:'\uD83D\uDC80',252:'\u2620\uFE0F',200:'\uD83D\uDC80',66:'\u2604\uFE0F'};

// ── Non-linear timeline scale ──
// Piecewise-linear: compresses pre-Phanerozoic, expands recent history.
// Returns 0..1 where 0 = oldest (3800 Ma, left edge) and 1 = present (0 Ma, right edge).
function timeScale(mya) {
  mya = Math.max(0, Math.min(3800, mya));
  if (mya >= 540) return (3800 - mya) / 3260 * 0.20;           // 3800–540 Ma → 0.00–0.20
  if (mya >= 66)  return 0.20 + (540 - mya) / 474 * 0.45;      // 540–66 Ma  → 0.20–0.65
  return 0.65 + (66 - mya) / 66 * 0.35;                         // 66–0 Ma    → 0.65–1.00
}

// Inverse: 0..1 → mya
function timeScaleInverse(t) {
  t = Math.max(0, Math.min(1, t));
  if (t <= 0.20) return 3800 - (t / 0.20) * 3260;              // 0.00–0.20 → 3800–540 Ma
  if (t <= 0.65) return 540 - ((t - 0.20) / 0.45) * 474;       // 0.20–0.65 → 540–66 Ma
  return 66 - ((t - 0.65) / 0.35) * 66;                         // 0.65–1.00 → 66–0 Ma
}

const ERA_COLORS={
  hadean:{dark:'rgba(120,50,30,0.12)',light:'rgba(120,50,30,0.08)'},
  archean:{dark:'rgba(100,60,40,0.10)',light:'rgba(100,60,40,0.07)'},
  proterozoic:{dark:'rgba(50,80,110,0.10)',light:'rgba(50,80,110,0.07)'},
  cambrian:{dark:'rgba(30,100,100,0.10)',light:'rgba(30,100,100,0.07)'},
  carboniferous:{dark:'rgba(20,80,30,0.12)',light:'rgba(20,80,30,0.09)'},
  permian:{dark:'rgba(140,60,20,0.10)',light:'rgba(140,60,20,0.08)'},
  triassic:{dark:'rgba(180,80,20,0.10)',light:'rgba(180,80,20,0.07)'},
  cretaceous:{dark:'rgba(30,90,40,0.12)',light:'rgba(30,90,40,0.09)'},
  cenozoic:{dark:'rgba(60,100,80,0.08)',light:'rgba(60,100,80,0.06)'}
};
const ERA_RANGES=[
  {min:3800,max:4600,era:'hadean'},{min:2500,max:3800,era:'archean'},
  {min:541,max:2500,era:'proterozoic'},{min:485,max:541,era:'cambrian'},
  {min:299,max:359,era:'carboniferous'},{min:252,max:299,era:'permian'},
  {min:200,max:252,era:'triassic'},{min:66,max:145,era:'cretaceous'},
  {min:0,max:66,era:'cenozoic'}
];

const PRESET_ICONS={preset_luca:'\uD83E\uDDEC',preset_o2:'\uD83D\uDCA8',preset_cambrian:'\uD83E\uDD90',
  preset_dinos:'\uD83E\uDD95',preset_kpg:'\u2604\uFE0F',preset_now:'\uD83C\uDF0D'};

// ══════════════════════════════════════════════════════
// ERA FILTER
// ══════════════════════════════════════════════════════
export function nodeInEra(n){
  if(state.playbackMode){
    const st=state.playbackNodeStates.get(n.id)||getPlaybackNodeState(n);
    return st!=='hidden';
  }
  if(!n.appeared) return true;
  const mya = n.appeared;
  const extinctMya = n.extinct || 0;
  const showFrom = state.currentEra;
  return mya >= extinctMya && mya <= showFrom + 200;
}

// ══════════════════════════════════════════════════════
// EXTINCT TOGGLE
// ══════════════════════════════════════════════════════
export function toggleExtinct() {
  state.showExtinct = !state.showExtinct;
  document.getElementById('extinct-label').textContent = state.showExtinct ? 'Hide Extinct' : 'Show Extinct';
  document.getElementById('extinct-toggle').style.opacity = state.showExtinct ? '1' : '0.6';
  _scheduleRender();
}

// ══════════════════════════════════════════════════════
// DOMAIN FILTER
// ══════════════════════════════════════════════════════
export function toggleDomain(domain) {
  if (state.activeDomains.has(domain)) {
    if (state.activeDomains.size > 2) state.activeDomains.delete(domain);
  } else {
    state.activeDomains.add(domain);
  }
  document.querySelectorAll('[data-domain]').forEach(el => {
    const d = el.getAttribute('data-domain');
    el.style.opacity = state.activeDomains.has(d) ? '1' : '0.35';
    el.style.fontWeight = state.activeDomains.has(d) ? '600' : '400';
  });
  _scheduleRender();
  trackDomainToggle(domain);
}

export function resetDomains() {
  state.activeDomains = new Set(['luca','bacteria','archaea','eukaryota','protists','fungi','plantae','animalia']);
  document.querySelectorAll('[data-domain]').forEach(el => {
    el.style.opacity = '1';
    el.style.fontWeight = '400';
  });
  _scheduleRender();
}

// ══════════════════════════════════════════════════════
// ERA BROWSER — Segmented geological timeline
// ══════════════════════════════════════════════════════
export function getEraName(v){
  const keys=Object.keys(ERA_NAMES).map(Number).sort((a,b)=>a-b);
  let best=keys[0];
  for(const k of keys){if(v>=k)best=k;}
  return ERA_NAMES[best]||`${v} Ma`;
}

export function buildExtinctionMarkers(){
  const container=document.getElementById('extinction-markers');
  if(!container)return;
  container.innerHTML='';
  EXTINCTION_DETAILS.forEach(ext=>{
    const leftPct=timeScale(ext.mya)*100;
    const marker=document.createElement('div');
    marker.className='ext-marker';
    marker.style.left=`${leftPct}%`;
    marker.dataset.severity=ext.pct>90?'extreme':ext.pct>80?'high':'normal';
    marker.dataset.mya=ext.mya;
    const icon=document.createElement('span');
    icon.className='ext-marker-icon';
    icon.textContent=EXTINCTION_ICONS[ext.mya]||'\uD83D\uDC80';
    marker.appendChild(icon);
    const line=document.createElement('div');
    line.className='ext-marker-line';
    marker.appendChild(line);
    marker.addEventListener('click',e=>{
      e.stopPropagation();
      showExtinctionPopover(ext,marker);
      animateSliderTo(ext.mya);
      trackExtinctionClick(ext.mya);
    });
    container.appendChild(marker);
  });
}

export function showExtinctionPopover(ext,anchor){
  const popover=document.getElementById('ext-popover');
  if(!popover)return;
  popover.innerHTML=`<div class="ext-popover-name">${_t(ext.key)}</div><div class="ext-popover-stat">${ext.pct}% ${_t('ext_lost')}</div><div class="ext-popover-cause">${_t(ext.causeKey)}</div><div class="ext-popover-surv">${_t(ext.survKey)}</div>`;
  const trackRect=document.getElementById('era-track').getBoundingClientRect();
  const anchorRect=anchor.getBoundingClientRect();
  const leftPx=anchorRect.left-trackRect.left+anchorRect.width/2;
  const maxLeft=trackRect.width-140;
  popover.style.left=Math.max(10,Math.min(maxLeft,leftPx))+'px';
  popover.style.transform='translateX(-50%)';
  popover.classList.remove('hidden');
  const close=e=>{
    if(!popover.contains(e.target)&&!anchor.contains(e.target)){
      popover.classList.add('hidden');document.removeEventListener('click',close);
    }
  };
  setTimeout(()=>document.addEventListener('click',close),0);
}

export function updateEraTint(mya){
  const overlay=document.getElementById('era-tint-overlay');
  if(!overlay)return;
  const isLight=document.documentElement.getAttribute('data-theme')==='light';
  for(const e of ERA_RANGES){
    if(mya>=e.min&&mya<=e.max){
      const c=ERA_COLORS[e.era];overlay.style.background=isLight?c.light:c.dark;return;
    }
  }
  overlay.style.background='transparent';
}

export function updateSpeciesCount(){
  const all=Object.values(nodeMap);
  const visible=all.filter(n=>nodeInEra(n));
  const el=document.getElementById('era-species-count');
  if(el)el.textContent=_t('era_species_count').replace('{0}',visible.length).replace('{1}',all.length);
}

export function updateThumbPosition(mya){
  const thumb=document.getElementById('tl-thumb');
  if(thumb){
    thumb.style.left=(timeScale(mya)*100)+'%';
    thumb.setAttribute('aria-valuenow',mya);
  }
}

export function updateEraTimeRange(mya){
  const el=document.getElementById('era-time-range');
  if(!el)return;
  const seg=TIMELINE_SEGMENTS.find(s=>mya>=s.min&&mya<s.max);
  if(seg){
    el.textContent=seg.max>=1000?`${(seg.max/1000).toFixed(1)}\u2013${(seg.min/1000).toFixed(1)} Ga`
      :`${seg.max}\u2013${seg.min} Ma`;
  } else el.textContent='';
}

export function toggleEraPlay(){
  if(state.playbackMode){_togglePlayback();return;}
  const eraSlider=document.getElementById('era-slider');
  const eraLabel=document.getElementById('era-label');
  const btn=document.getElementById('era-play');
  if(eraPlayId){
    cancelAnimationFrame(eraPlayId);eraPlayId=null;
    btn.textContent='\u25b6';btn.classList.remove('playing');btn.title=_t('era_play');return;
  }
  btn.textContent='\u23f8';btn.classList.add('playing');btn.title=_t('era_pause');
  // Play forward through time: LUCA (3800) → Present (0)
  const startVal=3800;
  state.currentEra=startVal;eraSlider.value=startVal;
  updateThumbPosition(startVal);
  const startTime=performance.now();
  const baseDuration=12000;
  function step(now){
    const duration=baseDuration/eraPlaySpeed;
    const elapsed=now-startTime;const progress=Math.min(1,elapsed/duration);
    const eased=progress<0.5?2*progress*progress:-1+(4-2*progress)*progress;
    const newVal=Math.round(startVal*(1-eased));
    eraSlider.value=newVal;state.currentEra=newVal;
    updateThumbPosition(newVal);
    eraLabel.textContent=getEraName(newVal);
    updateEraTimeRange(newVal);
    updateEraTint(newVal);updateSpeciesCount();updatePresetHighlight(newVal);
    _scheduleRender();
    if(progress<1){eraPlayId=requestAnimationFrame(step);}
    else{eraPlayId=null;btn.textContent='\u25b6';btn.classList.remove('playing');btn.title=_t('era_play');}
  }
  eraPlayId=requestAnimationFrame(step);
}

export function animateSliderTo(target){
  const eraSlider=document.getElementById('era-slider');
  const eraLabel=document.getElementById('era-label');
  if(eraPlayId){cancelAnimationFrame(eraPlayId);eraPlayId=null;
    const pb=document.getElementById('era-play');if(pb){pb.textContent='\u25b6';pb.classList.remove('playing');}}
  const start=parseInt(eraSlider.value);const diff=target-start;
  const startTime=performance.now();const duration=400;
  function step(now){
    const elapsed=now-startTime;const progress=Math.min(1,elapsed/duration);
    const eased=progress<0.5?2*progress*progress:-1+(4-2*progress)*progress;
    const newVal=Math.round(start+diff*eased);
    eraSlider.value=newVal;state.currentEra=newVal;
    updateThumbPosition(newVal);
    eraLabel.textContent=getEraName(newVal);
    updateEraTimeRange(newVal);
    updateEraTint(newVal);updateSpeciesCount();updatePresetHighlight(newVal);
    _scheduleRender();
    if(progress<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function updatePresetHighlight(mya){
  document.querySelectorAll('.era-preset').forEach(btn=>{
    const target=parseInt(btn.dataset.mya);
    btn.classList.toggle('active',Math.abs(mya-target)<100);
  });
}

export function buildEraPresets(){
  const container=document.getElementById('era-presets');if(!container)return;
  const presets=[{mya:3800,key:'preset_luca'},{mya:2400,key:'preset_o2'},{mya:541,key:'preset_cambrian'},
    {mya:200,key:'preset_dinos'},{mya:66,key:'preset_kpg'},{mya:0,key:'preset_now'}];
  container.innerHTML='';
  presets.forEach(p=>{
    const btn=document.createElement('button');btn.className='era-preset';
    const iconSpan=document.createElement('span');
    iconSpan.className='era-preset-icon';
    iconSpan.textContent=PRESET_ICONS[p.key]||'';
    btn.appendChild(iconSpan);
    btn.appendChild(document.createTextNode(_t(p.key)));
    btn.dataset.mya=p.mya;
    btn.addEventListener('click',()=>animateSliderTo(p.mya));
    container.appendChild(btn);
  });
  updatePresetHighlight(state.currentEra);
}

// Build colored geological segments
export function buildEraSegments(){
  const container=document.getElementById('era-segments');
  if(!container)return;
  container.innerHTML='';
  // Sort oldest first (leftmost = oldest in this timeline)
  const sorted=[...TIMELINE_SEGMENTS].sort((a,b)=>b.max-a.max);
  const isLight=document.documentElement.getAttribute('data-theme')==='light';
  sorted.forEach(seg=>{
    const clampedMin=Math.max(0,seg.min);
    const clampedMax=Math.min(3800,seg.max);
    if(clampedMax<=clampedMin)return;
    const leftPct=timeScale(clampedMax)*100;
    const rightPct=timeScale(clampedMin)*100;
    const widthPct=rightPct-leftPct;
    const div=document.createElement('div');
    div.className='era-seg';
    div.style.width=widthPct+'%';
    div.style.background=isLight?seg.colorLight:seg.color;
    div.dataset.segId=seg.id;
    div.dataset.min=clampedMin;
    div.dataset.max=clampedMax;
    const name=_t(seg.nameKey);
    // Always available on hover, including when the label itself is hidden.
    div.title=name;
    if(widthPct>3){
      const label=document.createElement('span');
      label.className='era-seg-label';
      label.textContent=name;
      div.appendChild(label);
    }
    div.addEventListener('click',e=>{
      if(e.target.closest('#tl-thumb'))return;
      animateSliderTo(Math.round((clampedMin+clampedMax)/2));
    });
    container.appendChild(div);
  });
  hideOverflowingEraLabels(container);
}

/* Segment widths are proportional to geological time, so a long era name in a
   short span gets clipped mid-word — "Paleoproterozo" reads as a rendering
   bug. Measure once laid out and drop the labels that cannot fit; the era name
   stays reachable via the segment's tooltip and the info bar above the track.
   Runs after a frame because widths are unknown until the flex row is laid
   out, and again on resize and language change via buildEraSegments(). */
function hideOverflowingEraLabels(container){
  requestAnimationFrame(()=>{
    container.querySelectorAll('.era-seg').forEach(seg=>{
      const label=seg.querySelector('.era-seg-label');
      if(!label) return;
      const available=seg.clientWidth;
      if(!available) return; // not laid out yet — leave as-is
      label.style.display='';
      label.style.display=(label.scrollWidth+6>available)?'none':'';
    });
  });
}

/* Node density sparkline — when life diversified, drawn under the era track.

   This was a bar chart on a linear count scale, and it did not read as data:
   almost everything in the tree appears in the last hundred million years, so
   the recent buckets saturated into one solid block against a bare left half.
   Two changes make the shape legible. Counts go through a square root, which
   keeps the Cambrian and Carboniferous visible next to the Neogene without
   flattening the difference away. And it is drawn as a filled area with a lit
   top edge rather than separate bars, so it reads as a curve rather than as a
   rectangle someone forgot to clip. */
export function buildDensitySparkline(){
  const canvas=document.getElementById('tl-density');
  if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const rect=canvas.getBoundingClientRect();
  if(!rect.width||!rect.height)return;
  canvas.width=rect.width*dpr;
  canvas.height=rect.height*dpr;
  const ctx=canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const w=rect.width,h=rect.height;
  ctx.clearRect(0,0,w,h);

  /* Sampled along screen position rather than along time. The time axis is
     piecewise — the last 66 Ma get a third of the width — so even buckets in
     millions of years would crowd into a sliver at one end and stretch into a
     staircase at the other. */
  const COLS=Math.max(48,Math.round(w/3));
  const counts=new Array(COLS).fill(0);
  Object.values(nodeMap).forEach(n=>{
    if(!n.appeared)return;
    const i=Math.min(COLS-1,Math.max(0,Math.floor(timeScale(n.appeared)*COLS)));
    counts[i]++;
  });

  // Two passes of a three-tap blur, so single-species spikes do not become
  // needles and the profile reads as a range rather than a comb.
  let smooth=counts;
  for(let pass=0;pass<2;pass++){
    const src=smooth;
    smooth=src.map((_,i)=>((src[i-1]||0)+src[i]*2+(src[i+1]||0))/4);
  }
  const peak=Math.max(1,...smooth);
  const height=v=>Math.sqrt(v/peak)*h*0.92;

  const isLight=document.documentElement.getAttribute('data-theme')==='light';
  const css=getComputedStyle(document.documentElement);
  const tint=(css.getPropertyValue('--accent-secondary')||'').trim()||'#3FD3B0';

  ctx.beginPath();
  ctx.moveTo(0,h);
  for(let i=0;i<COLS;i++) ctx.lineTo((i+0.5)/COLS*w,h-height(smooth[i]));
  ctx.lineTo(w,h);
  ctx.closePath();

  const grad=ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0,hexA(tint,isLight?0.38:0.44));
  grad.addColorStop(1,hexA(tint,0.02));
  ctx.fillStyle=grad;
  ctx.fill();

  // Lit crest, so the curve has an edge to read against the track above it.
  ctx.beginPath();
  for(let i=0;i<COLS;i++){
    const x=(i+0.5)/COLS*w,y=h-height(smooth[i]);
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=hexA(tint,isLight?0.55:0.75);
  ctx.lineWidth=1;
  ctx.stroke();
}

/* #RRGGBB plus an alpha, as rgba(). The palette is authored as hex, and canvas
   has no equivalent of the eight-digit form that works in every browser here. */
function hexA(hex,a){
  const m=/^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if(!m) return `rgba(63,211,176,${a})`;
  const v=parseInt(m[1],16);
  return `rgba(${(v>>16)&255},${(v>>8)&255},${v&255},${a})`;
}

// Custom thumb drag via pointer events
export function initThumbDrag(){
  const thumb=document.getElementById('tl-thumb');
  const track=document.getElementById('era-track');
  const eraSlider=document.getElementById('era-slider');
  const eraLabel=document.getElementById('era-label');
  if(!thumb||!track)return;
  let dragging=false;

  function myaFromPointer(clientX){
    const rect=track.getBoundingClientRect();
    const t=Math.max(0,Math.min(1,(clientX-rect.left)/rect.width));
    return Math.round(timeScaleInverse(t));
  }

  function updateFromMya(mya){
    mya=Math.max(0,Math.min(3800,mya));
    state.currentEra=mya;
    eraSlider.value=mya;
    updateThumbPosition(mya);
    eraLabel.textContent=getEraName(mya);
    updateEraTimeRange(mya);
    updateEraTint(mya);
    updateSpeciesCount();
    updatePresetHighlight(mya);
    if(eraPlayId){
      cancelAnimationFrame(eraPlayId);eraPlayId=null;
      const pb=document.getElementById('era-play');
      if(pb){pb.textContent='\u25b6';pb.classList.remove('playing');}
    }
    _scheduleRender();
  }

  thumb.addEventListener('pointerdown',e=>{
    dragging=true;
    thumb.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  document.addEventListener('pointermove',e=>{
    if(!dragging)return;
    updateFromMya(myaFromPointer(e.clientX));
  });
  document.addEventListener('pointerup',()=>{dragging=false;});

  // Click on track to jump
  track.addEventListener('click',e=>{
    if(e.target.closest('.ext-marker')||e.target.closest('#tl-thumb'))return;
    updateFromMya(myaFromPointer(e.clientX));
  });

  // Keyboard on thumb
  thumb.addEventListener('keydown',e=>{
    const step=e.shiftKey?100:20;
    if(e.key==='ArrowLeft'){updateFromMya(state.currentEra+step);e.preventDefault();}
    else if(e.key==='ArrowRight'){updateFromMya(state.currentEra-step);e.preventDefault();}
    else if(e.key===' '){toggleEraPlay();e.preventDefault();}
  });
}

// Speed button handlers
export function initSpeedButtons(){
  document.querySelectorAll('.tl-speed-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      eraPlaySpeed=parseFloat(btn.dataset.speed);
      document.querySelectorAll('.tl-speed-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
