// ══════════════════════════════════════════════════════
// NAVIGATION — nav stack, breadcrumb, tooltip, lineage
// ══════════════════════════════════════════════════════

import { state, nodeMap, navStack } from './state.js';
import { TREE } from './data.js';

// Redirects for species ids removed during manual duplicate cleanup (PR 0).
// Preserves bookmarked ?node=<old-id> deep links.
const ID_REDIRECTS = {
  'corpse-flower': 'titan-arum',
  'giant-salamander': 'chinese-giant-salamander',
  'wolf': 'gray-wolf',
  'leech': 'medicinal-leech',
  'earthworm': 'common-earthworm',
  'mollusks': 'mollusca',
  'titan-sequoia': 'sequoia',
  'dolphin': 'bottlenose-dolphin',
};

export function resolveNodeId(id) {
  return ID_REDIRECTS[id] || id;
}

// ── Late-binding deps (set via initNavDeps) ──
let _showMainPanel, _closePanel, _smoothPanTo, _smoothZoomTo, _scheduleRender;
let _layout, _centerOnRoot, _fitTreeToStage, _applyT, _renderPanelContent;
let _closeSpeciesCompare, _closeGame;
export function initNavDeps(deps) {
  _showMainPanel = deps.showMainPanel;
  _closePanel = deps.closePanel;
  _smoothPanTo = deps.smoothPanTo;
  _smoothZoomTo = deps.smoothZoomTo;
  _scheduleRender = deps.scheduleRender;
  _layout = deps.layout;
  _centerOnRoot = deps.centerOnRoot;
  _fitTreeToStage = deps.fitTreeToStage;
  _applyT = deps.applyT;
  _renderPanelContent = deps.renderPanelContent;
  _closeSpeciesCompare = deps.closeSpeciesCompare || deps.closeDnaCalc;
  _closeGame = deps.closeGame;
}

// ── DOM elements ──
const panel = document.getElementById('panel');

// ── Navigation Stack ──

export function currentNavState(){
  if(state.currentPanelNode) return {type:'panel',nodeId:state.currentPanelNode.id};
  return {type:'tree'};
}

export function pushNav(url){
  const s=currentNavState();
  // Avoid duplicate consecutive states
  if(navStack.length>0){
    const top=navStack[navStack.length-1];
    if(top.type===s.type&&top.nodeId===s.nodeId&&top.homininId===s.homininId) return;
  }
  navStack.push(s);
  if(navStack.length>30) navStack.shift();
  // Push browser history entry so Back button triggers popstate
  state._suppressPopstate=true;
  history.pushState({nav:navStack.length},'',url||'');
  state._suppressPopstate=false;
  updateNavButtons();
}

export function restoreNavState(s){
  if(s.type==='panel'){
    // Panel-to-panel: swap content without closing/reopening (avoids flash)
    const node=nodeMap[s.nodeId];
    if(node){
      state.currentPanelNode=node;
      _renderPanelContent(node);
      panel.classList.add('open');
      updateBreadcrumb(node);
      if(node._x!==undefined){
        if(typeof _smoothPanTo==='function') _smoothPanTo(node._x,node._y);
      }
    }
  } else {
    // Close everything first without pushing to stack
    panel.classList.remove('open');
    state.currentPanelNode=null;
    updateBreadcrumb(null);
  }
}

export function navBack(){
  if(navStack.length===0){
    // Nothing in stack — close whatever is open
    const s=currentNavState();
    if(s.type!=='tree'){
      panel.classList.remove('open');
      state.currentPanelNode=null;
      updateBreadcrumb(null);
    }
    updateNavButtons();
    return;
  }
  const prev=navStack.pop();
  restoreNavState(prev);
  updateNavButtons();
}

export function navHome(){
  navStack.length=0;
  // Close all overlays
  const comparePanel=document.getElementById('species-compare-panel');
  if(comparePanel&&comparePanel.classList.contains('open')&&typeof _closeSpeciesCompare==='function') _closeSpeciesCompare();
  if(document.getElementById('game-panel').classList.contains('open')&&typeof _closeGame==='function') _closeGame();
  const kbdHelp=document.getElementById('kbd-help');
  if(kbdHelp) kbdHelp.classList.remove('visible');
  state.currentPanelNode=null;
  state.focusedBranch=null;
  panel.classList.remove('open');
  updateBreadcrumb(null);
  // Reset zoom/pan
  _layout();_fitTreeToStage();_scheduleRender(true);_applyT();
  history.replaceState(null,'',location.pathname);
  updateNavButtons();
}

export function updateNavButtons(){
  const ctrl=document.getElementById('nav-ctrl');
  if(!ctrl) return;
  const backBtn=document.getElementById('nav-back');
  if(navStack.length>0){
    ctrl.classList.add('visible');
    if(backBtn) backBtn.disabled=false;
  } else {
    // Still show Home if we're not at root state
    const s=currentNavState();
    if(s.type!=='tree'){
      ctrl.classList.add('visible');
      if(backBtn) backBtn.disabled=true;
    } else {
      ctrl.classList.remove('visible');
    }
  }
}

// ── Lineage Tracing ──

export function traceLineage(nodeId){
  const n=nodeMap[nodeId];if(!n)return;
  // Expand all ancestors to make the path visible
  let c=n;while(c._parent){c._parent._collapsed=false;c=c._parent;}
  // Highlight the lineage path
  state.highlightedId=nodeId;
  _layout();_scheduleRender(true);_applyT();
  // Pan to the node
  setTimeout(()=>{if(n._x!==undefined)_smoothPanTo(n._x,n._y);},200);
  // Close panel to show the tree
  _closePanel();
}

// ── Breadcrumb ──

export function getAncestors(n){const path=[];let c=n;while(c){path.unshift(c);c=c._parent;}return path;}

export function focusNode(id) {
  function find(node) {
    if (node.id === id) return node;
    if (node.children) {
      for (const c of node.children) {
        const found = find(c);
        if (found) return found;
      }
    }
    return null;
  }
  const node = find(TREE);
  if (node) _showMainPanel(node);
}

export function updateBreadcrumb(n){
  const bc=document.getElementById('breadcrumb');
  if(n) state.focusedBranch=n;
  const target=n||state.focusedBranch;
  if(!target){bc.classList.add('hidden');return;}
  const path=getAncestors(target);
  if(path.length<1){bc.classList.add('hidden');return;}
  bc.classList.remove('hidden');

  // Truncate middle for deep paths (>6 levels)
  let displayPath=path;
  if(path.length>6){
    displayPath=[path[0],{id:'_ellipsis',name:'…',icon:'',color:''},...path.slice(-3)];
  }

  bc.innerHTML=displayPath.map((p,i)=>{
    const isLast=i===displayPath.length-1;
    /* The node's colour rides on a dot, not on the words. Node colours are
       picked to read as discs against the canvas, and several of them — the
       pale bacterial blues especially — fall below the contrast floor as small
       text on the chrome. A crumb in every colour of the tree was noisy as
       well as illegible. */
    const dot=p.color?`<i class="bc-dot" style="background:${p.color}"></i>`:'';
    if(p.id==='_ellipsis') return `<span class="bc-item bc-ellipsis">…</span><span class="bc-sep">›</span>`;
    return `<span class="bc-item ${isLast?'active':''}" onclick="${isLast?'':`collapseBelow('${p.id}')`}">${dot}${p.icon} ${p.name}</span>${isLast?'':'<span class="bc-sep">›</span>'}`;
  }).join('');
}
/* Collapse everything below a given node and zoom to fit its children */
window.collapseBelow=function(nodeId){
  const node=nodeMap[nodeId];
  if(!node) return;
  function collapseAll(nd){if(nd.children) nd.children.forEach(c=>{c._collapsed=true;collapseAll(c);});}
  collapseAll(node);
  node._collapsed=false;
  _layout();_scheduleRender(true);
  setTimeout(()=>{
    const kids=node.children||[];
    const allPts=[node,...kids];
    const xs=allPts.map(k=>k._x),ys=allPts.map(k=>k._y);
    const bw=(Math.max(...xs)-Math.min(...xs))||200;
    const bh=(Math.max(...ys)-Math.min(...ys))||200;
    const svgR=(document.getElementById('canvas-wrap')||document.getElementById('svg')).getBoundingClientRect();
    const fitScale=Math.min(svgR.width*0.8/bw,svgR.height*0.8/bh);
    _smoothZoomTo((Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2,Math.min(2.0,fitScale));
    updateBreadcrumb(node);
  },100);
};

// ── Tooltip ──

const tooltipEl = document.getElementById('tooltip');
let _tipTimer = null;
let _tipCursor = { x: 0, y: 0 };

/* CSS offsets the tooltip by translate(16px,-50%), so it is vertically centred
   on the cursor and half of it sits above. Near the top of the screen that put
   it under the header, where it could sit and look stuck. Clamp the anchor so
   the whole box stays on screen and clear of the header. */
function positionTip(x, y) {
  _tipCursor = { x, y };
  const r = tooltipEl.getBoundingClientRect();
  const w = r.width, h = r.height;
  if (!w || !h) { tooltipEl.style.left = x + 'px'; tooltipEl.style.top = y + 'px'; return; }

  /* 26px clears the largest node disc — a hovered node is up to 23px on screen
     at full zoom — so the tooltip sits beside what it describes rather than on
     its edge. Must match the translateX in #tooltip's CSS transform. */
  const M = 8, OFFSET_X = 26;
  const header = document.getElementById('header');
  const headerBottom = header ? header.getBoundingClientRect().bottom : 0;

  /* Flip to the other side rather than sliding back over the cursor. Clamping
     the right edge to the viewport is what put the tooltip on top of the very
     node it was describing, every time that node was near the right of the
     screen — and the fun-fact variant is tall enough to hide it completely.
     The transform is translate(16px,-50%), so `side` cancels that offset and
     mirrors the box when it goes left. */
  /* Decided against the widest the box can get, not the width it happens to
     have. A tooltip is placed as a single line and then grows into a paragraph
     500ms later when its fun fact arrives; measuring the narrow version chose
     a side that the tall one no longer fits on, and it ended up back over the
     node. max-width is the honest bound and it does not depend on timing. */
  const cap = parseFloat(getComputedStyle(tooltipEl).maxWidth);
  const wMax = Number.isFinite(cap) ? Math.max(w, cap) : w;
  const fitsRight = x + OFFSET_X + wMax + M <= window.innerWidth;
  const nx = fitsRight ? x : x - OFFSET_X - wMax - OFFSET_X;
  tooltipEl.style.left = Math.max(M - OFFSET_X, nx) + 'px';

  const minY = headerBottom + M + h / 2;
  const maxY = window.innerHeight - M - h / 2;
  // On a viewport too short for both constraints, staying on screen wins.
  const ny = minY > maxY ? maxY : Math.min(Math.max(y, minY), maxY);
  tooltipEl.style.top = ny + 'px';
}

document.addEventListener('mousemove', function(e) {
  if (tooltipEl.classList.contains('visible')) positionTip(e.clientX, e.clientY);
});

let _funFactTimer = null;
export function showTip(text, icon, funFact) {
  clearTimeout(_tipTimer);
  clearTimeout(_funFactTimer);
  tooltipEl.innerHTML = (icon ? icon + ' ' : '') + text;
  tooltipEl.classList.remove('tip-enhanced');
  tooltipEl.classList.add('visible');
  positionTip(_tipCursor.x, _tipCursor.y);
  if (funFact) {
    _funFactTimer = setTimeout(() => {
      tooltipEl.innerHTML = (icon ? icon + ' ' : '') + text +
        '<div class="tip-dyk">Did you know?</div>' +
        '<div class="tip-funfact">' + funFact + '</div>';
      tooltipEl.classList.add('tip-enhanced');
      /* The box just changed shape — one line became a paragraph — so it is
         re-placed on the next frame, once the browser has laid the new content
         out. Measuring in the same tick gave the old width and left the fun-fact
         tooltip sitting on top of the node it belonged to. */
      requestAnimationFrame(() => positionTip(_tipCursor.x, _tipCursor.y));
    }, 500);
  }
}

export function hideTip() {
  clearTimeout(_tipTimer);
  clearTimeout(_funFactTimer);
  // Dismiss immediately — no delay (prevents stuck tooltip)
  _tipTimer = setTimeout(() => {
    tooltipEl.classList.remove('visible');
    tooltipEl.classList.remove('tip-enhanced');
  }, 30);
}

// Dismiss tooltip on any canvas interaction (pan, click, zoom)
document.addEventListener('pointerdown', () => { hideTip(); }, true);
document.addEventListener('wheel', () => { hideTip(); }, { passive: true });
