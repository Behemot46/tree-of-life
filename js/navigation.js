// ══════════════════════════════════════════════════════
// NAVIGATION — nav stack, breadcrumb, tooltip, lineage
// ══════════════════════════════════════════════════════

import { state, nodeMap, navStack } from './state.js';

// ── Late-binding deps (set via initNavDeps) ──
let _showMainPanel, _closePanel, _smoothPanTo, _scheduleRender;
let _layout, _centerOnRoot, _applyT, _renderPanelContent;
export function initNavDeps(deps) {
  _showMainPanel = deps.showMainPanel;
  _closePanel = deps.closePanel;
  _smoothPanTo = deps.smoothPanTo;
  _scheduleRender = deps.scheduleRender;
  _layout = deps.layout;
  _centerOnRoot = deps.centerOnRoot;
  _applyT = deps.applyT;
  _renderPanelContent = deps.renderPanelContent;
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
  // Close everything first without pushing to stack
  panel.classList.remove('open');
  state.currentPanelNode=null;

  if(s.type==='tree'){
    updateBreadcrumb(null);
  } else if(s.type==='panel'){
    const node=nodeMap[s.nodeId];
    if(node){
      state.currentPanelNode=node;
      _renderPanelContent(node);
      panel.classList.add('open');
      updateBreadcrumb(node);
    }
  }
}

export function navBack(){
  if(navStack.length===0){
    // Nothing in stack — close whatever is open
    const s=currentNavState();
    if(s.type!=='tree'){
      const homView=document.getElementById('hominin-view');
      if(homView) homView.classList.remove('open');
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
  state.currentPanelNode=null;
  panel.classList.remove('open');
  updateBreadcrumb(null);
  // Reset zoom/pan
  _layout();_centerOnRoot(0.18);_scheduleRender(true);_applyT();
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
  if(!n){bc.classList.add('hidden');return;}
  const path=getAncestors(n);
  if(path.length<1){bc.classList.add('hidden');return;}
  bc.classList.remove('hidden');
  bc.innerHTML=path.map((p,i)=>{
    const isLast=i===path.length-1;
    return `<span class="bc-item ${isLast?'active':''}" onclick="${isLast?'':`showMainPanel(getNodeById('${p.id}'))`}">${p.icon} ${p.name}</span>${isLast?'':'<span class="bc-sep">›</span>'}`;
  }).join('');
}

// ── Tooltip ──

const tooltipEl = document.getElementById('tooltip');
let _tipTimer = null;
document.addEventListener('mousemove', function(e) {
  if (tooltipEl.classList.contains('visible')) {
    tooltipEl.style.left = e.clientX + 'px';
    tooltipEl.style.top = e.clientY + 'px';
  }
});

export function showTip(text, icon) {
  clearTimeout(_tipTimer);
  tooltipEl.innerHTML = (icon ? icon + ' ' : '') + text;
  tooltipEl.classList.add('visible');
}

export function hideTip() {
  clearTimeout(_tipTimer);
  _tipTimer = setTimeout(() => {
    tooltipEl.classList.remove('visible');
  }, 80);
}
