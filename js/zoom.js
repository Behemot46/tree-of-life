// ══════════════════════════════════════════════════════
// ZOOM — Pan, zoom, and center viewport functions
// ══════════════════════════════════════════════════════
import { state } from './state.js';
import { TREE } from './data.js';
import { trackDiceUse } from './engagement.js';
import { nodeFootprint } from './labelMetrics.js';

// Late-bound deps (set by app.js to avoid circular imports)
let _scheduleRender, _layout, _getVisible;
export function initZoomDeps(deps) {
  _scheduleRender = deps.scheduleRender;
  _layout = deps.layout;
  _getVisible = deps.getVisible;
}

/* The renderer culls anything outside the viewport, so moving the camera
   without re-rendering leaves the newly-uncovered area blank — you pan toward
   a branch and it simply is not drawn. Every camera move ends with a render so
   culling recomputes. Debounced: gestures fire continuously. */
let _renderAfterCamTimer=0;
function renderAfterCamera(){
  if(!_scheduleRender) return;
  clearTimeout(_renderAfterCamTimer);
  _renderAfterCamTimer=setTimeout(()=>_scheduleRender(),90);
}

export function applyT() {
  const viewport = document.getElementById('viewport');
  viewport.setAttribute('transform', `translate(${state.transform.x},${state.transform.y}) scale(${state.transform.s})`);
}

/* Camera animations must not overlap: two rAF loops both easing
   state.transform from their own captured start values interleave and land
   somewhere neither intended. Each animation takes a token and stops as soon
   as a newer one starts. */
let _camToken=0;

export function smoothPanTo(wx,wy){
  const st=getStageRect();
  const tx=st.cx-wx*state.transform.s,ty=st.cy-wy*state.transform.s;
  const dx=tx-state.transform.x,dy=ty-state.transform.y;
  const steps=20;let step=0;
  const sx=state.transform.x,sy=state.transform.y;
  const token=++_camToken;
  function tick(){
    if(token!==_camToken) return;
    step++;const t=step/steps;const ease=1-Math.pow(1-t,3);
    state.transform.x=sx+dx*ease;state.transform.y=sy+dy*ease;
    applyT();
    if(step<steps) requestAnimationFrame(tick); else renderAfterCamera();
  }
  requestAnimationFrame(tick);
}

export function smoothZoomTo(wx,wy,targetScale){
  const st=getStageRect();
  const ss=state.transform.s,ts=Math.min(FIT_MAX_SCALE,Math.max(0.05,targetScale));
  const sx=state.transform.x,sy=state.transform.y;
  const tx=st.cx-wx*ts,ty=st.cy-wy*ts;
  const dx=tx-sx,dy=ty-sy,ds=ts-ss;
  const steps=24;let step=0;
  const token=++_camToken;
  function tick(){
    if(token!==_camToken) return;
    step++;const t=step/steps;const ease=1-Math.pow(1-t,3);
    state.transform.s=ss+ds*ease;
    state.transform.x=sx+dx*ease;state.transform.y=sy+dy*ease;
    applyT();
    if(step<steps) requestAnimationFrame(tick); else renderAfterCamera();
  }
  requestAnimationFrame(tick);
}

export function centerOnTree(scale){
  const b=fittedBounds();
  if(!b)return;
  const st=getStageRect();
  state.transform={x:st.cx-b.cx*scale,y:st.cy-b.cy*scale,s:scale};
}

export function centerOnRoot(scale){
  const st=getStageRect();
  state.transform={x:st.cx-TREE._x*scale,y:st.cy-TREE._y*scale,s:scale};
}

// ══════════════════════════════════════════════════════
// FIT TO STAGE
// ══════════════════════════════════════════════════════

// Scale bounds for the automatic fit. The upper bound stops a nearly-collapsed
// tree from being blown up to absurd size; the lower bound keeps a fully
// expanded one from vanishing.
const FIT_MIN_SCALE=0.04;
const FIT_MAX_SCALE=1.6;
// Breathing room around the tree, as a fraction of the usable stage.
const FIT_PADDING=0.06;

function isVisible(el){
  if(!el) return false;
  const s=getComputedStyle(el);
  if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)<0.02) return false;
  const r=el.getBoundingClientRect();
  return r.width>0&&r.height>0;
}

/* The usable stage: the canvas minus the chrome floating over it. The header
   and timeline span the full width, and the left rail hugs the leading edge
   (the right edge in RTL). Corner widgets — zoom buttons, reveal panel — are
   deliberately not subtracted; reserving their full height would waste most of
   the screen, and the tree passing behind their corner is fine. */
export function getStageRect(){
  const W=window.innerWidth,H=window.innerHeight;
  let top=0,bottom=0,left=0,right=0;

  const header=document.getElementById('header');
  if(isVisible(header)) top=Math.max(top,header.getBoundingClientRect().bottom);

  const timeline=document.getElementById('timeline');
  if(isVisible(timeline)) bottom=Math.max(bottom,H-timeline.getBoundingClientRect().top);

  /* Both vertical rails: the tool panel and the map controls. Each hugs one
     edge for the full height of the stage, so a name that lands behind either
     is unreadable — the zoom column used to swallow the outermost species
     labels on the right. Which edge is which flips in RTL, so decide by the
     half of the screen the panel sits in rather than by reading `dir`. */
  for(const id of ['left-rail','zoom-ctrl']){
    const el=document.getElementById(id);
    if(!isVisible(el)) continue;
    const r=el.getBoundingClientRect();
    if(r.width>W*0.5) continue; // A full-width bar is not a side rail.
    if(r.left+r.width/2<W/2) left=Math.max(left,r.right);
    else right=Math.max(right,W-r.left);
  }

  const w=Math.max(120,W-left-right);
  const h=Math.max(120,H-top-bottom);
  return {x:left,y:top,w,h,cx:left+w/2,cy:top+h/2};
}

/* Which labels the renderer will draw at a given zoom. Kept in step with
   labelEarnsSpace() in renderer.js — reserving room for three hundred captions
   that are not on screen would shrink the tree to a smudge. */
function labelShown(depth,scale){
  if(depth<=1) return true;
  const need=depth===2?0.10:depth===3?0.18:depth===4?0.28:0.40;
  return scale>=need;
}

/* Bounding box of everything currently on screen, in world coordinates.
   Nodes without a position are skipped — species hidden by the toggle never
   get one, and letting NaN in here would poison the whole fit.

   Deliberately measured from layout coordinates rather than the rendered
   getBBox(): the renderer culls nodes outside the viewport, so the drawn
   bounding box describes only what is already visible. Fitting to that can
   never converge — each fit reveals more nodes, which enlarges the box. */
function treeBounds(scaleHint){
  const nodes=_getVisible(TREE);
  const isCladogram=state.viewMode==='cladogram'||state.viewMode==='chronological';
  const nodeR=window.innerWidth<768?22:26;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,n=0;
  for(const node of nodes){
    if(!Number.isFinite(node._x)||!Number.isFinite(node._y)) continue;
    const withLabel=scaleHint==null||labelShown(node.depth||0,scaleHint);
    const e=nodeFootprint(node,{isCladogram,nodeR,withLabel});
    if(node._x-e.left<minX)minX=node._x-e.left;
    if(node._x+e.right>maxX)maxX=node._x+e.right;
    if(node._y-e.up<minY)minY=node._y-e.up;
    if(node._y+e.down>maxY)maxY=node._y+e.down;
    n++;
  }
  if(!n) return null;
  const w=Math.max(1,maxX-minX),h=Math.max(1,maxY-minY);
  return {minX,maxX,minY,maxY,w,h,cx:(minX+maxX)/2,cy:(minY+maxY)/2};
}

function scaleFor(b){
  const st=getStageRect();
  const s=Math.min(st.w/b.w,st.h/b.h)*(1-FIT_PADDING);
  return Math.min(FIT_MAX_SCALE,Math.max(FIT_MIN_SCALE,s));
}

/* Which labels are drawn depends on the zoom, and the zoom depends on how much
   room the labels need — so measure twice. The first pass reserves every
   label and gives a lower bound on the scale; the second reserves only the
   labels that survive at that scale, which is never fewer, so it converges. */
function fittedBounds(){
  const rough=treeBounds(null);
  if(!rough) return null;
  return treeBounds(scaleFor(rough))||rough;
}

function fitTransform(b){
  const st=getStageRect();
  const scale=scaleFor(b);
  return {x:st.cx-b.cx*scale,y:st.cy-b.cy*scale,s:scale};
}

function applyFit(b){ state.transform=fitTransform(b); }

/* Same framing as fitTreeToStage(), eased rather than snapped. Used by the
   reveal controls, where a jump cut after changing how much of the tree is
   shown is disorienting. */
export function smoothFitToStage(){
  // Measure two frames out. Callers change the tree and schedule a render, so
  // the rendered bbox still describes the previous tree until that has landed
  // — fitting to it would frame whatever was on screen before.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const b=fittedBounds();
    if(!b) return;
    const to=fitTransform(b);
    const from={...state.transform};
    const steps=22;let step=0;
    const token=++_camToken;
    (function tick(){
      if(token!==_camToken) return;
      step++;const t=step/steps;const ease=1-Math.pow(1-t,3);
      state.transform={
        x:from.x+(to.x-from.x)*ease,
        y:from.y+(to.y-from.y)*ease,
        s:from.s+(to.s-from.s)*ease,
      };
      applyT();
      if(step<steps) requestAnimationFrame(tick); else renderAfterCamera();
    })();
  }));
}

/* Scale and centre the tree so it fills the usable stage. This is the single
   entry point for framing — start-up, reset, view switches and resize all use
   it, so the tree is always as large as it can be without spilling. */
export function fitTreeToStage(){
  const b=fittedBounds();
  if(b) applyFit(b);
}

// ══════════════════════════════════════════════════════
// POINTER EVENTS (PAN & PINCH ZOOM)
// ══════════════════════════════════════════════════════
let isPointerPanning=false;
let pointerStart={x:0,y:0};
let transformStart={x:0,y:0};
const activePointers=new Map();
let pinchGesture=null;
let panRAF=0;
let zoomRAF=0;

export function initPointerEvents(){
  const svgEl=document.getElementById('svg');
  svgEl.style.touchAction="none";

  svgEl.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse" && e.button!==0) return;
    activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activePointers.size===1){
      isPointerPanning=true;
      pointerStart={x:e.clientX,y:e.clientY};
      transformStart={...state.transform};
    }
  });
  svgEl.addEventListener("pointermove",e=>{
    if(!activePointers.has(e.pointerId)) return;
    activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activePointers.size===1 && isPointerPanning){
      state.transform.x=transformStart.x+(e.clientX-pointerStart.x);
      state.transform.y=transformStart.y+(e.clientY-pointerStart.y);
      if(!panRAF){panRAF=requestAnimationFrame(()=>{panRAF=0;applyT();});}
    }
  });
  svgEl.addEventListener("pointerup",e=>{
    activePointers.delete(e.pointerId);
    if(activePointers.size===0){
      isPointerPanning=false;
      if(panRAF){cancelAnimationFrame(panRAF);panRAF=0;applyT();}
      renderAfterCamera();
    }
  });
  svgEl.addEventListener('wheel',e=>{e.preventDefault();const f=e.deltaY<0?1.13:0.88;const rect=svgEl.getBoundingClientRect();const mx=e.clientX-rect.left,my=e.clientY-rect.top;const ns=Math.min(6,Math.max(0.05,state.transform.s*f));state.transform.x=mx-(mx-state.transform.x)*(ns/state.transform.s);state.transform.y=my-(my-state.transform.y)*(ns/state.transform.s);state.transform.s=ns;if(!zoomRAF){zoomRAF=requestAnimationFrame(()=>{zoomRAF=0;applyT();});}renderAfterCamera();},{passive:false});

  document.getElementById('btn-in').addEventListener('click',()=>{state.transform.s=Math.min(6,state.transform.s*1.2);applyT();renderAfterCamera();});
  document.getElementById('btn-out').addEventListener('click',()=>{state.transform.s=Math.max(0.05,state.transform.s*0.83);applyT();renderAfterCamera();});
  document.getElementById('btn-reset').addEventListener('click',()=>{_layout();fitTreeToStage();_scheduleRender(true);applyT();});
}

// ══════════════════════════════════════════════════════
// FRAMING HELPERS — subtree framing with base-tree zoom floor
// ══════════════════════════════════════════════════════

// Returns just the scale `s` that would frame the entire base TREE with 15% padding.
// Used as the floor for frameSubtree() so we never zoom out past this level.
// Call once at startup when TREE is fully laid out at max depth.
export function computeBaseFitZoom(rootNode) {
  const pts = [];
  (function walk(n){
    // Must be Number.isFinite, not a null check: a NaN coordinate passes
    // `!= null`, poisons the min/max, and leaves bw/bh as the `|| 1` fallback.
    // That produced a "floor" of ~339 instead of ~0.1, which pinned every
    // frameSubtree() call to maximum zoom.
    if (!Number.isFinite(n._x) || !Number.isFinite(n._y)) return;
    const r = n.r || 12;
    pts.push({x:n._x - r, y:n._y - r, w:2*r, h:2*r});
    if (n.children) n.children.forEach(walk);
  })(rootNode);
  if (!pts.length) return FIT_MIN_SCALE;
  const minX = Math.min(...pts.map(p=>p.x));
  const maxX = Math.max(...pts.map(p=>p.x + p.w));
  const minY = Math.min(...pts.map(p=>p.y));
  const maxY = Math.max(...pts.map(p=>p.y + p.h));
  const bw = maxX - minX;
  const bh = maxY - minY;
  // A degenerate box means the tree was not laid out when this ran. There is
  // then no meaningful "whole tree" zoom, so impose no floor at all.
  if (!(bw > 1) || !(bh > 1)) return FIT_MIN_SCALE;
  const st = getStageRect();
  const s = Math.min(st.w / (bw * (1 + FIT_PADDING)), st.h / (bh * (1 + FIT_PADDING)));
  return Math.min(FIT_MAX_SCALE, Math.max(FIT_MIN_SCALE, s));
}

// Smoothly pan + zoom the camera to frame `node` and all currently-visible
// descendants with 15% padding. Clamped so we never zoom out further than
// the full-base-tree zoom (state.baseTreeZoom), preventing tiny-children issue.
export function frameSubtree(node, opts = {}) {
  if (!node || node._x == null || node._y == null) return;
  const padding = opts.padding ?? 0.15;

  const pts = [];
  (function walk(n){
    if (n._x == null || n._y == null) return;
    const r = n.r || 12;
    pts.push({x:n._x, y:n._y, r});
    if (n.children && !n._collapsed) {
      n.children.forEach(c => { if (!c._hiddenByToggle) walk(c); });
    }
  })(node);

  if (!pts.length) return;
  const minX = Math.min(...pts.map(p => p.x - p.r));
  const maxX = Math.max(...pts.map(p => p.x + p.r));
  const minY = Math.min(...pts.map(p => p.y - p.r));
  const maxY = Math.max(...pts.map(p => p.y + p.r));
  const bw = (maxX - minX) || 1;
  const bh = (maxY - minY) || 1;
  // Frame into the usable stage, not the raw viewport — otherwise the chrome
  // eats the margin and the subtree lands partly behind the header or rail.
  const st = getStageRect();
  const vw = st.w;
  const vh = st.h;

  let s = Math.min(vw / (bw * (1 + padding)), vh / (bh * (1 + padding)));
  // Clamp: never zoom out further than the full-base-tree zoom
  const floor = state.baseTreeZoom || 0;
  if (s < floor) s = floor;

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  // Reuse smoothZoomTo — it centers the given world point at target scale.
  smoothZoomTo(cx, cy, s);
}

export function initRandomButton(deps) {
  const btn = document.getElementById('btn-random');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const species = deps.getRandomSpecies();
    if (!species) return;
    trackDiceUse();
    // Spin animation
    btn.style.transition = 'transform 0.4s ease';
    btn.style.transform = 'rotate(720deg)';
    setTimeout(() => { btn.style.transform = ''; }, 400);
    // Navigate to species
    deps.showMainPanel(species);
  });
}
