// ══════════════════════════════════════════════════════
// ZOOM — Pan, zoom, and center viewport functions
// ══════════════════════════════════════════════════════
import { state } from './state.js';

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
