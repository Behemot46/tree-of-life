// ══════════════════════════════════════════════════════
// ZOOM — Pan, zoom, and center viewport functions
// ══════════════════════════════════════════════════════
import { state } from './state.js';
import { TREE } from './data.js';
import { trackDiceUse } from './engagement.js';

// Late-bound deps (set by app.js to avoid circular imports)
let _scheduleRender, _layout, _getVisible;
export function initZoomDeps(deps) {
  _scheduleRender = deps.scheduleRender;
  _layout = deps.layout;
  _getVisible = deps.getVisible;
}

export function applyT() {
  const viewport = document.getElementById('viewport');
  viewport.setAttribute('transform', `translate(${state.transform.x},${state.transform.y}) scale(${state.transform.s})`);
}

export function smoothPanTo(wx,wy){
  const svgR=(document.getElementById('canvas-wrap')||document.getElementById('svg')).getBoundingClientRect();
  const cx=svgR.width/2,cy=svgR.height/2;
  const tx=cx-wx*state.transform.s,ty=cy-wy*state.transform.s;
  const dx=tx-state.transform.x,dy=ty-state.transform.y;
  const steps=20;let step=0;
  const sx=state.transform.x,sy=state.transform.y;
  function tick(){
    step++;const t=step/steps;const ease=1-Math.pow(1-t,3);
    state.transform.x=sx+dx*ease;state.transform.y=sy+dy*ease;
    applyT();
    if(step<steps) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export function smoothZoomTo(wx,wy,targetScale){
  const svgR=(document.getElementById('canvas-wrap')||document.getElementById('svg')).getBoundingClientRect();
  const cx=svgR.width/2,cy=svgR.height/2;
  const ss=state.transform.s,ts=Math.min(2.0,Math.max(0.05,targetScale));
  const sx=state.transform.x,sy=state.transform.y;
  const tx=cx-wx*ts,ty=cy-wy*ts;
  const dx=tx-sx,dy=ty-sy,ds=ts-ss;
  const steps=24;let step=0;
  function tick(){
    step++;const t=step/steps;const ease=1-Math.pow(1-t,3);
    state.transform.s=ss+ds*ease;
    state.transform.x=sx+dx*ease;state.transform.y=sy+dy*ease;
    applyT();
    if(step<steps) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export function centerOnTree(scale){
  const nodes=_getVisible(TREE);
  if(!nodes.length)return;
  const xs=nodes.map(n=>n._x),ys=nodes.map(n=>n._y);
  const cx=(Math.min(...xs)+Math.max(...xs))/2;
  const cy=(Math.min(...ys)+Math.max(...ys))/2;
  state.transform={x:window.innerWidth/2-cx*scale,y:window.innerHeight/2-cy*scale,s:scale};
}

export function centerOnRoot(scale){
  state.transform={x:window.innerWidth/2-TREE._x*scale,y:window.innerHeight/2-TREE._y*scale,s:scale};
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
    }
  });
  svgEl.addEventListener('wheel',e=>{e.preventDefault();const f=e.deltaY<0?1.13:0.88;const rect=svgEl.getBoundingClientRect();const mx=e.clientX-rect.left,my=e.clientY-rect.top;const ns=Math.min(6,Math.max(0.05,state.transform.s*f));state.transform.x=mx-(mx-state.transform.x)*(ns/state.transform.s);state.transform.y=my-(my-state.transform.y)*(ns/state.transform.s);state.transform.s=ns;if(!zoomRAF){zoomRAF=requestAnimationFrame(()=>{zoomRAF=0;applyT();});}},{passive:false});

  document.getElementById('btn-in').addEventListener('click',()=>{state.transform.s=Math.min(6,state.transform.s*1.2);applyT();});
  document.getElementById('btn-out').addEventListener('click',()=>{state.transform.s=Math.max(0.05,state.transform.s*0.83);applyT();});
  document.getElementById('btn-reset').addEventListener('click',()=>{_layout();centerOnRoot(0.18);_scheduleRender(true);applyT();});
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
    if (n._x == null || n._y == null) return;
    const r = n.r || 12;
    pts.push({x:n._x - r, y:n._y - r, w:2*r, h:2*r});
    if (n.children) n.children.forEach(walk);
  })(rootNode);
  if (!pts.length) return 0.2;
  const minX = Math.min(...pts.map(p=>p.x));
  const maxX = Math.max(...pts.map(p=>p.x + p.w));
  const minY = Math.min(...pts.map(p=>p.y));
  const maxY = Math.max(...pts.map(p=>p.y + p.h));
  const bw = maxX - minX || 1;
  const bh = maxY - minY || 1;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padding = 0.15;
  return Math.min(vw / (bw * (1 + padding)), vh / (bh * (1 + padding)));
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
  const vw = window.innerWidth;
  const vh = window.innerHeight;

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
