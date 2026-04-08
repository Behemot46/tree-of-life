// ══════════════════════════════════════════════════════
// RENDERER — SVG render engine (branches, nodes, labels)
// Visual redesign: photo portraits, living wood branches
// ══════════════════════════════════════════════════════

import { state, nodeMap, animDone, confirmedPhotoUrls, HUMAN_PATH } from './state.js';
import { getVisible, getVisibleEdges, countDescendants } from './layout.js';
import { reducedMotion } from './utils.js';
import { getPlaybackNodeState, discoverNode, showDiscoveryCard } from './playback.js';
import { isExplored } from './engagement.js';
import { nodeInEra } from './timeline.js';
import { a11yAnnounce } from './engagement.js';
import { TREE, NODE_ICONS, getIconGroup, ImageLoader } from './data.js';

// ── Late-bound deps (avoid circular imports) ──
let _showMainPanel, _showTip, _hideTip, _smoothPanTo, _smoothZoomTo, _layout, _updateBreadcrumb, _frameSubtree;
export function initRendererDeps(deps) {
  _showMainPanel = deps.showMainPanel; _showTip = deps.showTip;
  _hideTip = deps.hideTip; _smoothPanTo = deps.smoothPanTo;
  _smoothZoomTo = deps.smoothZoomTo; _layout = deps.layout;
  _updateBreadcrumb = deps.updateBreadcrumb;
  _frameSubtree = deps.frameSubtree;
}

// True if node is a leaf, or all descendants are expanded (not collapsed).
function isFullyExpanded(node) {
  if (!node.children || !node.children.length) return true;
  if (node._collapsed) return false;
  for (const c of node.children) {
    if (c._hiddenByToggle) continue;
    if (!isFullyExpanded(c)) return false;
  }
  return true;
}

// Recursively collapse a node and all its descendants. Clears
// _manualExpand on descendants so the depth slider can re-expand naturally.
function collapseSubtree(node) {
  node._collapsed = true;
  node._manualExpand = false;
  if (node.children) node.children.forEach(c => collapseSubtree(c));
}

// ── DOM refs ──
const branchLayer = document.getElementById('layer-branches');
const nodesLayer = document.getElementById('layer-nodes');

// ── Node size (responsive) ──
function getNodeR(){ return window.innerWidth<768 ? 22 : 26; }

// ── Viewport culling helpers ──
function getViewBounds(margin){
  const s=state.transform.s;
  return{
    minX:(0-margin-state.transform.x)/s,
    maxX:(window.innerWidth+margin-state.transform.x)/s,
    minY:(0-margin-state.transform.y)/s,
    maxY:(window.innerHeight+margin-state.transform.y)/s
  };
}
function isInView(wx,wy,vb){
  return wx>=vb.minX&&wx<=vb.maxX&&wy>=vb.minY&&wy<=vb.maxY;
}

// ── Spatial hash for label collision ──
function createSpatialHash(cellSize){
  const grid=new Map();
  function key(cx,cy){return cx+','+cy;}
  function cellsFor(b){
    const x0=Math.floor(b.bx/cellSize),y0=Math.floor(b.by/cellSize);
    const x1=Math.floor((b.bx+b.textW)/cellSize),y1=Math.floor((b.by+b.textH)/cellSize);
    const cells=[];
    for(let cx=x0;cx<=x1;cx++)for(let cy=y0;cy<=y1;cy++)cells.push(key(cx,cy));
    return cells;
  }
  return{
    insert(b){for(const k of cellsFor(b)){let arr=grid.get(k);if(!arr){arr=[];grid.set(k,arr);}arr.push(b);}},
    query(b){
      const seen=new Set();const result=[];
      const x0=Math.floor(b.bx/cellSize)-1,y0=Math.floor(b.by/cellSize)-1;
      const x1=Math.floor((b.bx+b.textW)/cellSize)+1,y1=Math.floor((b.by+b.textH)/cellSize)+1;
      for(let cx=x0;cx<=x1;cx++)for(let cy=y0;cy<=y1;cy++){
        const arr=grid.get(key(cx,cy));
        if(arr)for(const item of arr)if(!seen.has(item)){seen.add(item);result.push(item);}
      }
      return result;
    }
  };
}

// ══════════════════════════════════════════════════════
// BRANCH PATH — organic S-curves with wobble
// ══════════════════════════════════════════════════════

export function branchPath(x1,y1,x2,y2){
  if(state.viewMode==='cladogram'||state.viewMode==='chronological'){
    // Organic S-curve for horizontal layout
    // Control points at ~40% and ~60% of dx, with subtle wobble on x only
    const dx=x2-x1,dy=y2-y1;
    const seed=(((Math.abs(x1)*7+Math.abs(y1)*13+Math.abs(x2)*11+Math.abs(y2)*17)%1000)+1000)%1000/1000;
    const wobble=(seed-0.5)*Math.min(Math.abs(dx),80)*0.06;
    const cx1=x1+dx*0.4+wobble;
    const cx2=x1+dx*0.6-wobble*0.5;
    return `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`;
  }
  if(state.viewMode==='playback'){
    return `M${x1},${y1} C${x1+(x2-x1)*0.5},${y1} ${x1+(x2-x1)*0.5},${y2} ${x2},${y2}`;
  }
  // Radial: organic curve with perpendicular wobble
  const dx=x2-x1,dy=y2-y1;
  const dist=Math.hypot(dx,dy)||1;
  const px=-dy/dist,py=dx/dist;
  const seed=(((x1*7+y1*13+x2*11+y2*17)%1000)+1000)%1000/1000;
  const wobble=(seed-0.5)*dist*0.10;
  const c1x=x1+dx*0.3+px*(dist*0.22+wobble);
  const c1y=y1+dy*0.3+py*(dist*0.22+wobble);
  const c2x=x1+dx*0.7+px*(dist*0.10-wobble*0.5);
  const c2y=y1+dy*0.7+py*(dist*0.10-wobble*0.5);
  return `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
}

// ══════════════════════════════════════════════════════
// BRANCH GRADIENT HELPERS
// ══════════════════════════════════════════════════════

const _gradCache=new Map();
function getBranchGradId(fromColor,toColor){
  const key=fromColor+'|'+toColor;
  if(_gradCache.has(key)) return _gradCache.get(key);
  const id='bg-'+(Math.random()*1e9|0);
  const defs=document.getElementById('svg').querySelector('defs');
  const grad=document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
  grad.id=id;
  grad.setAttribute('x1','0');grad.setAttribute('y1','0');
  grad.setAttribute('x2','1');grad.setAttribute('y2','0');
  const s1=document.createElementNS('http://www.w3.org/2000/svg','stop');
  s1.setAttribute('offset','0%');s1.setAttribute('stop-color',fromColor);
  const s2=document.createElementNS('http://www.w3.org/2000/svg','stop');
  s2.setAttribute('offset','100%');s2.setAttribute('stop-color',toColor);
  grad.appendChild(s1);grad.appendChild(s2);
  defs.appendChild(grad);
  _gradCache.set(key,id);
  return id;
}

function getBranchWidth(depth){
  if(depth<=0) return 5;
  if(depth===1) return 3.5;
  if(depth===2) return 2.5;
  return 1.5;
}

function getBranchOpacity(depth){
  if(depth<=0) return 0.8;
  if(depth===1) return 0.6;
  if(depth===2) return 0.45;
  return 0.3;
}

// Count collapsed siblings at the same level (for ghost clutter control)
function countCollapsedSiblings(node){
  if(!node._parent||!node._parent.children) return 0;
  return node._parent.children.filter(sib=>sib._collapsed&&sib.children&&sib.children.length).length;
}

// ══════════════════════════════════════════════════════
// HUMAN PATH AUTO-EXPAND (max 4 levels per click)
// ══════════════════════════════════════════════════════

function autoExpandHumanPath(startNode){
  let current=startNode;
  let expanded=0;
  const MAX_DEPTH=4;
  while(current&&expanded<MAX_DEPTH){
    if(!current.children||!current.children.length) break;
    current._collapsed=false;
    expanded++;
    const hpChild=current.children.find(c=>HUMAN_PATH.has(c.id));
    if(!hpChild) break;
    if(current.children.length>1&&!hpChild._collapsed) break;
    current=hpChild;
  }
  _layout();scheduleRender(true);
  setTimeout(()=>{
    if(current._x!==undefined) _smoothPanTo(current._x,current._y);
    if(_updateBreadcrumb) _updateBreadcrumb(current);
  },200);
  a11yAnnounce('Expanded human evolutionary path');
}

// ══════════════════════════════════════════════════════
// RENDER SCHEDULER
// ══════════════════════════════════════════════════════

export function scheduleRender(force=false){
  if(force){
    state.renderQueued=false;
    render();
    return;
  }
  if(state.renderQueued) return;
  state.renderQueued=true;
  requestAnimationFrame(()=>{
    state.renderQueued=false;
    render();
  });
}

// ══════════════════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════════════════

export function render(){
  const branchFrag=document.createDocumentFragment();
  const nodesFrag=document.createDocumentFragment();
  const edges=getVisibleEdges(TREE);
  const nodes=getVisible(TREE);
  // Scale culling margin by inverse zoom so branches aren't culled when zoomed out
  const cullMargin=Math.max(300,600/Math.max(state.transform.s,0.05));
  const vb=getViewBounds(cullMargin);
  const animDeferred=[];
  const nodeR=getNodeR();
  const nodeD=nodeR*2;
  const isCladogram=state.viewMode==='cladogram'||state.viewMode==='chronological';

  // Read branch brown from CSS variable
  const branchBrown=getComputedStyle(document.documentElement).getPropertyValue('--tree-branch-brown').trim()||'#8b6a3a';

  // ══════════════════════════════════════════════════════
  // BRANCHES
  // ══════════════════════════════════════════════════════

  const humanPathEdges=[];
  const evoPathEdges=[];

  edges.forEach(({from,to})=>{
    if(to._domain && to._domain!=='luca' && !state.activeDomains.has(to._domain)) return;
    if(!state.showExtinct && to.extinct) return;

    if(state.playbackMode){
      const childState=state.playbackNodeStates.get(to.id)||getPlaybackNodeState(to);
      if(childState==='hidden') return;
    }
    if(!isInView(from._x,from._y,vb)&&!isInView(to._x,to._y,vb)) return;

    const inEra=nodeInEra(to);
    const onHumanPath=HUMAN_PATH.has(from.id)&&HUMAN_PATH.has(to.id);
    const onEvoPath=state.evoPathActive&&state.evoPathEdgeSet.has(from.id+'|'+to.id);
    const d=branchPath(from._x,from._y,to._x,to._y);

    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',d);
    p.setAttribute('class','branch-path');

    // Tapering width and opacity
    const sw=getBranchWidth(to.depth);
    let op=getBranchOpacity(to.depth);

    if(state.playbackMode){
      const childState=state.playbackNodeStates.get(to.id)||getPlaybackNodeState(to);
      if(childState==='locked') op=0.12;
    }
    if(!inEra) op=0.12;

    // Gradient color for cladogram: brown → domain color
    if(isCladogram&&!onEvoPath&&!onHumanPath){
      const fromColor=to.depth<=1?branchBrown:(from.color||branchBrown);
      const toColor=to.color||branchBrown;
      const gradId=getBranchGradId(fromColor,toColor);
      p.setAttribute('stroke','url(#'+gradId+')');
    } else {
      p.setAttribute('stroke',onEvoPath?'var(--accent-secondary)':(onHumanPath?'var(--accent-primary)':to.color));
    }

    p.setAttribute('stroke-width',onEvoPath||onHumanPath?Math.max(sw,2):sw);
    p.setAttribute('stroke-opacity',onEvoPath?0.95:op);

    // Entrance animation
    if(!animDone.has(to.id)){
      if(state.playbackMode){
        const len=9999;p.style.strokeDasharray=len;p.style.strokeDashoffset=len;
        p.classList.add('branch-pb-grow');
        setTimeout(()=>{p.style.strokeDashoffset=0;},30);
      } else if(!reducedMotion()){
        p.style.setProperty('--stagger',to._sibIndex||0);
        p.classList.add('branch-entering');
        animDeferred.push(p);
      }
    }

    branchFrag.appendChild(p);
    if(onHumanPath) humanPathEdges.push({d,depth:to.depth});
    if(onEvoPath) evoPathEdges.push(p);
  });

  // Human path golden overlay — drawn on top
  humanPathEdges.forEach(({d,depth})=>{
    const hp=document.createElementNS('http://www.w3.org/2000/svg','path');
    hp.setAttribute('d',d);
    hp.setAttribute('class','branch-human-path');
    hp.setAttribute('stroke-width',depth<=1?2:1.5);
    hp.setAttribute('stroke-opacity',depth<=1?0.5:0.4);
    branchFrag.appendChild(hp);
  });

  // Evo path edges on top
  evoPathEdges.forEach(p=>branchFrag.appendChild(p));

  // ══════════════════════════════════════════════════════
  // NODES
  // ══════════════════════════════════════════════════════

  const pendingLabels=[];

  nodes.forEach(n=>{
    if(n._domain && n._domain!=='luca' && !state.activeDomains.has(n._domain)) return;
    if(!state.showExtinct && n.extinct) return;
    if(!isInView(n._x,n._y,vb)) return;

    const pbState=state.playbackMode?(state.playbackNodeStates.get(n.id)||getPlaybackNodeState(n)):null;
    if(state.playbackMode&&pbState==='hidden') return;

    // ── PLAYBACK LOCKED NODE ──
    if(state.playbackMode&&pbState==='locked'){
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('class','node-group');
      g.style.cursor='pointer';
      const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hit.setAttribute('cx',n._x);hit.setAttribute('cy',n._y);hit.setAttribute('r',nodeR+14);
      hit.setAttribute('fill','transparent');
      hit.addEventListener('click',e=>{e.stopPropagation();discoverNode(n);});
      g.appendChild(hit);
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx',n._x);c.setAttribute('cy',n._y);c.setAttribute('r',nodeR);
      c.setAttribute('class','node-locked');
      c.addEventListener('mouseenter',()=>{_showTip('???','?');});
      c.addEventListener('mouseleave',()=>{_hideTip();});
      c.addEventListener('click',e=>{e.stopPropagation();discoverNode(n);});
      g.appendChild(c);
      const qm=document.createElementNS('http://www.w3.org/2000/svg','text');
      qm.setAttribute('x',n._x);qm.setAttribute('y',n._y+4);
      qm.setAttribute('text-anchor','middle');qm.setAttribute('font-size',Math.max(10,nodeR*0.6));
      qm.setAttribute('fill','var(--parchment)');qm.setAttribute('fill-opacity','0.5');
      qm.setAttribute('font-family','Inter,sans-serif');qm.setAttribute('font-weight','700');
      qm.style.pointerEvents='none';
      qm.textContent='?';
      g.appendChild(qm);
      nodesFrag.appendChild(g);
      return;
    }

    const inEra=nodeInEra(n);
    const isHighlighted=state.highlightedId===n.id;
    const isGroupChip=n.id&&n.id.startsWith('group-');
    const onHumanPath=HUMAN_PATH.has(n.id);
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','node-group');
    g.setAttribute('role','treeitem');
    g.setAttribute('tabindex',n.id==='luca'?'0':'-1');
    g.setAttribute('aria-label',n.name+(n.latin?' ('+n.latin+')':'')+(n.extinct?' - extinct':''));
    g.setAttribute('data-node-id',n.id);
    if(state.focusedNodeId===n.id) g.setAttribute('aria-selected','true');
    if(n.children&&n.children.length) g.setAttribute('aria-expanded',String(!n._collapsed));
    g.style.cursor='pointer';

    // ── HOMININ GROUP CHIP ──
    if(isGroupChip){
      const pillW=Math.max(n.name.length*7+32,100),pillH=28;
      const px=n._x-pillW/2,py=n._y-pillH/2;
      const colAlpha=n.color+'33',colBorder=n.color+'66';
      const indicator=n._collapsed?'+':'\u2212';
      const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
      fo.setAttribute('x',px);fo.setAttribute('y',py);
      fo.setAttribute('width',pillW);fo.setAttribute('height',pillH);
      fo.style.overflow='visible';
      const chip=document.createElement('div');
      chip.className='chip-badge';
      chip.style.border=`1.5px solid ${colBorder}`;
      chip.style.background=colAlpha;
      chip.style.color=n.color;
      chip.style.height=`${pillH}px`;
      chip.textContent=`${n.icon} ${n.name} ${indicator}`;
      chip.addEventListener('mouseenter',()=>{chip.style.borderColor=n.color;chip.style.background=n.color+'44';_showTip(n.name,n.icon);});
      chip.addEventListener('mouseleave',()=>{chip.style.borderColor=colBorder;chip.style.background=colAlpha;_hideTip();});
      fo.appendChild(chip);g.appendChild(fo);
      if(!animDone.has(n.id)&&!reducedMotion()){
        g.style.setProperty('--stagger',0);
        g.classList.add('node-entering');
        animDeferred.push(g);
        setTimeout(()=>animDone.add(n.id),550);
      } else { animDone.add(n.id); }
      g.addEventListener('click',e=>{e.stopPropagation();n._collapsed=!n._collapsed;_layout();scheduleRender(true);a11yAnnounce(n.name+(n._collapsed?' collapsed':' expanded'));});
      g.addEventListener('dblclick',e=>{e.stopPropagation();_showMainPanel(n);});
      nodesFrag.appendChild(g);
      return;
    }

    // ── COLLAPSED INDICATORS (stacked cards + ghost children) ──
    const isCollapsed=n.children&&n.children.length&&n._collapsed;

    if(isCollapsed){
      const collapsedSibCount=countCollapsedSiblings(n);

      // Stacked card circles behind main node
      for(let i=2;i>=1;i--){
        const sc=document.createElementNS('http://www.w3.org/2000/svg','circle');
        sc.setAttribute('cx',n._x+i*4);sc.setAttribute('cy',n._y);sc.setAttribute('r',nodeR);
        sc.setAttribute('fill','var(--tree-node-fill)');
        sc.setAttribute('stroke',n.color);sc.setAttribute('stroke-width','1');
        sc.setAttribute('opacity',i===2?'0.2':'0.4');
        sc.setAttribute('class','node-stack-card');
        g.appendChild(sc);
      }

      // Ghost children (max 3, only if 3+ children and <8 collapsed siblings)
      if(n.children.length>=3&&collapsedSibCount<8&&inEra){
        const ghostCount=Math.min(3,n.children.length);
        for(let i=0;i<ghostCount;i++){
          const child=n.children[i];
          const angle=-20+i*20;
          const rad=angle*Math.PI/180;
          const gx=n._x+nodeR+20+i*24;
          const gy=n._y+Math.sin(rad)*16;
          const ghostR=9;
          const ghostOp=[0.3,0.2,0.1][i];

          const gc=document.createElementNS('http://www.w3.org/2000/svg','circle');
          gc.setAttribute('cx',gx);gc.setAttribute('cy',gy);gc.setAttribute('r',ghostR);
          gc.setAttribute('fill','var(--tree-node-fill)');
          gc.setAttribute('stroke',child.color||n.color);gc.setAttribute('stroke-width','1');
          gc.setAttribute('opacity',String(ghostOp));
          gc.setAttribute('class','node-ghost');
          g.appendChild(gc);

          // Ghost photo
          if(ImageLoader){
            const best=ImageLoader.getBestUrl(child);
            if(best&&best.url){
              const gfo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
              gfo.setAttribute('x',gx-ghostR);gfo.setAttribute('y',gy-ghostR);
              gfo.setAttribute('width',ghostR*2);gfo.setAttribute('height',ghostR*2);
              gfo.style.pointerEvents='none';gfo.style.overflow='hidden';
              gfo.setAttribute('opacity',String(ghostOp));
              const gw=document.createElement('div');
              gw.className='node-ghost-wrap';
              gw.style.width=`${ghostR*2}px`;gw.style.height=`${ghostR*2}px`;
              const gi=document.createElement('img');
              gi.className='node-ghost-img';
              gi.src=best.url;gi.alt='';
              gi.addEventListener('error',()=>{if(gfo.parentNode)gfo.remove();});
              gw.appendChild(gi);gfo.appendChild(gw);g.appendChild(gfo);
            }
          }
        }
      }

      // Count badge (only if >2 descendants)
      const totalKids=countDescendants(n);
      if(totalKids>2){
        const bx=n._x+nodeR*0.65,by=n._y-nodeR*0.65;
        const badgeW=totalKids>=100?28:totalKids>=10?22:18;
        const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');
        rect.setAttribute('x',bx-badgeW/2);rect.setAttribute('y',by-9);
        rect.setAttribute('width',badgeW);rect.setAttribute('height',18);
        rect.setAttribute('rx','9');
        rect.setAttribute('class','node-badge-bg');
        g.appendChild(rect);
        const bt=document.createElementNS('http://www.w3.org/2000/svg','text');
        bt.setAttribute('x',bx);bt.setAttribute('y',by);
        bt.setAttribute('text-anchor','middle');bt.setAttribute('dominant-baseline','central');
        bt.setAttribute('fill','#fff');bt.setAttribute('font-size','9');
        bt.setAttribute('font-weight','700');bt.setAttribute('font-family','Inter,sans-serif');
        bt.style.pointerEvents='none';
        bt.textContent=String(totalKids);
        g.appendChild(bt);
      }
    }

    // ── HUMAN PATH: golden border + arrow for collapsed nodes on the path ──
    const isOnHumanPathCollapsed=isCollapsed&&onHumanPath;
    const borderColor=isOnHumanPathCollapsed?'var(--tree-human-path)':n.color;
    const borderWidth=n.depth===0?3.5:n.depth<=1?2.5:2;

    // Highlight ring (search)
    if(isHighlighted){
      const hl=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hl.setAttribute('cx',n._x);hl.setAttribute('cy',n._y);hl.setAttribute('r',nodeR+6);
      hl.setAttribute('fill','none');hl.setAttribute('stroke','#c8883a');
      hl.setAttribute('stroke-width','2');hl.setAttribute('stroke-opacity','0.9');
      g.appendChild(hl);
    }

    // LUCA pulse ring
    if(n.depth===0&&!reducedMotion()){
      const pulse=document.createElementNS('http://www.w3.org/2000/svg','circle');
      pulse.setAttribute('cx',n._x);pulse.setAttribute('cy',n._y);pulse.setAttribute('r',nodeR+4);
      pulse.setAttribute('fill','none');pulse.setAttribute('stroke','#c8883a');
      pulse.setAttribute('stroke-width','1.5');pulse.setAttribute('stroke-opacity','0.4');
      pulse.innerHTML=`<animate attributeName="r" values="${nodeR+4};${nodeR+7};${nodeR+4}" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.2;0.4" dur="3s" repeatCount="indefinite"/>`;
      g.appendChild(pulse);
    }

    // Human path accent ring (for expanded human-path nodes)
    if(onHumanPath&&n.depth>0&&!isOnHumanPathCollapsed){
      const hpRing=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hpRing.setAttribute('cx',n._x);hpRing.setAttribute('cy',n._y);hpRing.setAttribute('r',nodeR+4);
      hpRing.setAttribute('fill','none');hpRing.setAttribute('stroke','var(--tree-human-path)');
      hpRing.setAttribute('stroke-width','1.2');hpRing.setAttribute('stroke-opacity','0.5');
      hpRing.setAttribute('stroke-dasharray','3 3');
      g.appendChild(hpRing);
    }

    // Evo path accent ring
    if(state.evoPathActive&&state.evoPathSet.has(n.id)&&n.depth>0){
      const evoRing=document.createElementNS('http://www.w3.org/2000/svg','circle');
      evoRing.setAttribute('cx',n._x);evoRing.setAttribute('cy',n._y);evoRing.setAttribute('r',nodeR+5);
      evoRing.setAttribute('fill','none');evoRing.setAttribute('stroke','var(--accent-secondary)');
      evoRing.setAttribute('stroke-width','2');evoRing.setAttribute('stroke-opacity','0.6');
      g.appendChild(evoRing);
    }

    // Invisible hit area
    const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
    hit.setAttribute('cx',n._x);hit.setAttribute('cy',n._y);hit.setAttribute('r',nodeR+12);
    hit.setAttribute('fill','transparent');hit.style.cursor='pointer';
    g.appendChild(hit);

    // Main circle (dark background behind photo)
    const bg=document.createElementNS('http://www.w3.org/2000/svg','circle');
    bg.setAttribute('cx',n._x);bg.setAttribute('cy',n._y);bg.setAttribute('r',nodeR);
    bg.setAttribute('fill',n.depth===0?'url(#rootGrad)':'var(--tree-node-fill)');
    if(!inEra) bg.setAttribute('opacity','0.3');
    // Cursor class hooks (parent vs leaf; expanded vs collapsed)
    const _hasKids=!!(n.children&&n.children.length);
    let _bgCls=_hasKids?'node-circle-parent':'node-circle-leaf';
    if(_hasKids&&!n._collapsed) _bgCls+=' expanded';
    bg.setAttribute('class',_bgCls);
    g.appendChild(bg);
    // Fully-expanded hook on the node group
    if(_hasKids&&isFullyExpanded(n)) g.classList.add('node-fully-expanded');

    // Domain color tint behind photo
    if(n.depth>0){
      const tint=document.createElementNS('http://www.w3.org/2000/svg','circle');
      tint.setAttribute('cx',n._x);tint.setAttribute('cy',n._y);tint.setAttribute('r',nodeR);
      tint.setAttribute('fill',n.color);tint.setAttribute('opacity','0.2');
      g.appendChild(tint);
    }

    // Silhouette icon fallback (always rendered behind photo)
    if(inEra&&NODE_ICONS){
      const ig=getIconGroup(n);
      const iconPath=NODE_ICONS[ig]||NODE_ICONS.default;
      const s=Math.max(14,nodeR*1.1);
      const icon=document.createElementNS('http://www.w3.org/2000/svg','path');
      icon.setAttribute('d',iconPath);
      icon.setAttribute('fill',document.documentElement.getAttribute('data-theme')==='light'?'rgba(30,30,30,0.5)':'rgba(255,255,255,0.7)');
      icon.setAttribute('transform',`translate(${n._x-s/2},${n._y-s/2}) scale(${s/24})`);
      icon.setAttribute('class','node-fallback-icon');
      g.appendChild(icon);

      // Photo overlay via foreignObject
      if(ImageLoader){
        const cachedUrl=confirmedPhotoUrls.get(n.id);
        const best=cachedUrl?{url:cachedUrl}:ImageLoader.getBestUrl(n);
        if(best&&best.url){
          const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
          fo.setAttribute('x',n._x-nodeR);fo.setAttribute('y',n._y-nodeR);
          fo.setAttribute('width',nodeD);fo.setAttribute('height',nodeD);
          fo.style.pointerEvents='none';fo.style.overflow='hidden';
          const wrap=document.createElement('div');
          wrap.className='node-img-wrap';
          wrap.style.width=`${nodeD}px`;wrap.style.height=`${nodeD}px`;
          const htmlImg=document.createElement('img');
          htmlImg.className='node-img';
          htmlImg.alt=n.name||'';
          htmlImg.addEventListener('load',function(){this.classList.add('loaded');});
          if(cachedUrl){
            htmlImg.addEventListener('error',function(){
              if(!this.dataset.retried){this.dataset.retried='1';this.src=cachedUrl+'?retry=1';}
              else{if(fo.parentNode)fo.remove();confirmedPhotoUrls.delete(n.id);}
            });
            htmlImg.src=cachedUrl;
          } else {
            ImageLoader.loadInto(n,htmlImg,{
              onLoad:function(){confirmedPhotoUrls.set(n.id,htmlImg.src);},
              onFallback:function(){if(fo.parentNode)fo.remove();}
            });
          }
          wrap.appendChild(htmlImg);fo.appendChild(wrap);g.appendChild(fo);
        }
      }
    }

    // Border circle (domain-colored, ON TOP of photo)
    const border=document.createElementNS('http://www.w3.org/2000/svg','circle');
    border.setAttribute('cx',n._x);border.setAttribute('cy',n._y);border.setAttribute('r',nodeR);
    border.setAttribute('fill','none');
    border.setAttribute('stroke',borderColor);
    border.setAttribute('stroke-width',String(borderWidth));
    border.setAttribute('class','node-border');
    border.style.setProperty('--nc',n.color);
    if(n.extinct){border.setAttribute('stroke-dasharray','4 2');border.setAttribute('opacity','0.6');}
    g.appendChild(border);

    // ── COLLAPSED-BY-DEFAULT AFFORDANCES: glowing ring + toggle badge ──
    if(n.children&&n.children.length){
      // 1) Glowing ring — only on collapsed parents
      if(n._collapsed){
        const ring=document.createElementNS('http://www.w3.org/2000/svg','circle');
        ring.setAttribute('cx',n._x);ring.setAttribute('cy',n._y);
        ring.setAttribute('r',nodeR+4);
        ring.setAttribute('class','node-ring-expandable');
        ring.setAttribute('pointer-events','none');
        g.appendChild(ring);
      }
      // 2) +/- toggle badge (bottom-right)
      const tb=document.createElementNS('http://www.w3.org/2000/svg','g');
      tb.setAttribute('class','node-toggle-badge');
      tb.setAttribute('pointer-events','none');
      tb.setAttribute('transform',`translate(${n._x+nodeR*0.72},${n._y+nodeR*0.72})`);
      const tbBg=document.createElementNS('http://www.w3.org/2000/svg','circle');
      tbBg.setAttribute('r','7');
      tbBg.setAttribute('class','node-toggle-badge-bg');
      const tbTxt=document.createElementNS('http://www.w3.org/2000/svg','text');
      tbTxt.setAttribute('text-anchor','middle');
      tbTxt.setAttribute('dominant-baseline','central');
      tbTxt.setAttribute('class','node-toggle-badge-text');
      tbTxt.textContent=n._collapsed?'+':'\u2212';
      tb.appendChild(tbBg);tb.appendChild(tbTxt);
      g.appendChild(tb);
    }

    // ── INFO BUTTON for internal nodes (has children) ──
    if(n.children&&n.children.length&&!state.playbackMode){
      const ibR=9;
      const ibX=n._x+nodeR*0.65;
      const ibY=n._y+nodeR*0.65;
      const ibG=document.createElementNS('http://www.w3.org/2000/svg','g');
      ibG.setAttribute('class','node-info-btn');
      ibG.style.cursor='pointer';
      // Background circle
      const ibBg=document.createElementNS('http://www.w3.org/2000/svg','circle');
      ibBg.setAttribute('cx',ibX);ibBg.setAttribute('cy',ibY);ibBg.setAttribute('r',ibR);
      ibBg.setAttribute('class','node-info-bg');
      ibG.appendChild(ibBg);
      // "i" letter
      const ibTxt=document.createElementNS('http://www.w3.org/2000/svg','text');
      ibTxt.setAttribute('x',ibX);ibTxt.setAttribute('y',ibY);
      ibTxt.setAttribute('text-anchor','middle');ibTxt.setAttribute('dominant-baseline','central');
      ibTxt.setAttribute('class','node-info-icon');
      ibTxt.textContent='i';
      ibG.appendChild(ibTxt);
      // Click toggles panel
      ibG.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();
        if(state.currentPanelNode&&state.currentPanelNode.id===n.id){window.closePanel();}
        else{_showMainPanel(n);}
      });
      ibG.addEventListener('mouseenter',()=>{ibBg.classList.add('hover');});
      ibG.addEventListener('mouseleave',()=>{ibBg.classList.remove('hover');});
      g.appendChild(ibG);
    }

    // Golden arrow indicator for collapsed human-path nodes
    if(isOnHumanPathCollapsed){
      const arrowX=n._x+nodeR+10;
      const arrow=document.createElementNS('http://www.w3.org/2000/svg','text');
      arrow.setAttribute('x',arrowX);arrow.setAttribute('y',n._y+1);
      arrow.setAttribute('text-anchor','middle');arrow.setAttribute('dominant-baseline','central');
      arrow.setAttribute('fill','var(--tree-human-path)');
      arrow.setAttribute('font-size','16');arrow.setAttribute('font-weight','700');
      arrow.setAttribute('font-family','Inter,sans-serif');
      arrow.setAttribute('class','human-path-arrow');
      arrow.style.cursor='pointer';
      arrow.textContent='\u2192';
      arrow.addEventListener('click',e=>{e.stopPropagation();autoExpandHumanPath(n);});
      g.appendChild(arrow);

      // Glow endpoint
      const glow=document.createElementNS('http://www.w3.org/2000/svg','circle');
      glow.setAttribute('cx',n._x+nodeR);glow.setAttribute('cy',n._y);glow.setAttribute('r','8');
      glow.setAttribute('fill','url(#human-path-glow)');glow.style.pointerEvents='none';
      g.appendChild(glow);

      // Dashed continuation line
      const dash=document.createElementNS('http://www.w3.org/2000/svg','line');
      dash.setAttribute('x1',arrowX+8);dash.setAttribute('y1',n._y);
      dash.setAttribute('x2',n._x+500);dash.setAttribute('y2',n._y);
      dash.setAttribute('class','human-path-dash');
      g.appendChild(dash);
    }

    // ── LABELS ──
    if(inEra){
      const labelText=n._hominData?n._hominData.short:n.name;
      const latinText=n.latin||'';
      let lx,ly,anchor,fontSize;

      if(isCladogram){
        // Horizontal: label to the right of node
        fontSize=n.depth===0?13:n.depth<=1?12:10;
        lx=n._x+nodeR+8;
        ly=n._y;
        anchor='start';
      } else {
        // Radial: label positioned by angle from center
        const sibCount=n._parent?.children?.length||1;
        const angleRad=(n._angle||0)-Math.PI/2;
        const lDist=nodeR+18+Math.max(0,(n.depth-3)*4);
        lx=n._x+Math.cos(angleRad)*lDist;
        ly=n._y+Math.sin(angleRad)*lDist;
        const cos=Math.cos(angleRad);
        fontSize=n.depth===0?14:n.depth===1?12:sibCount>12?8:sibCount>8?9:10;
        anchor=cos<-0.15?'end':cos>0.15?'start':'middle';
      }

      const textW=labelText.length*fontSize*0.55;
      const textH=fontSize+12;
      const bx=anchor==='end'?lx-textW:anchor==='start'?lx:lx-textW/2;
      pendingLabels.push({n,lx,ly,fontSize,textW,textH,bx,by:ly-textH/2,anchor:anchor||'middle',labelText,latinText,g,onHumanPath});
    }

    // Hover events (tooltip only, no movement)
    g.addEventListener('mouseenter',()=>{_showTip(n.name,n.icon,n.funFact);});
    g.addEventListener('mouseleave',()=>{_hideTip();});

    // Animate in
    if(!state.playbackMode&&!animDone.has(n.id)){
      if(reducedMotion()){
        animDone.add(n.id);
      } else {
        g.style.setProperty('--stagger',n._sibIndex||0);
        g.classList.add('node-entering');
        animDeferred.push(g);
        setTimeout(()=>animDone.add(n.id),600);
      }
    }

    // Click events — branch=expand/collapse, leaf=panel
    g.addEventListener('click',e=>{
      e.stopPropagation();
      if(state.playbackMode){showDiscoveryCard(n);return;}
      const isParent=!!(n.children&&n.children.length);
      if(!isParent){
        // Leaf: open species panel
        _showMainPanel(n);
        return;
      }
      // Parent: expand or collapse — never open panel directly
      if(n._collapsed){
        n._collapsed=false;
        n._manualExpand=true;
      } else {
        collapseSubtree(n);
      }
      _layout();scheduleRender(true);
      a11yAnnounce(n.name+(n._collapsed?' collapsed':' expanded'));
      requestAnimationFrame(()=>{
        if(_frameSubtree) _frameSubtree(n);
        if(_updateBreadcrumb) _updateBreadcrumb(n._collapsed&&n._parent?n._parent:n);
      });
    });
    g.addEventListener('dblclick',e=>{
      e.stopPropagation();e.preventDefault();
      if(state.playbackMode) return;
      // Only leaves open panel on dblclick; parents are toggle-only
      if(!(n.children&&n.children.length)) _showMainPanel(n);
    });
    nodesFrag.appendChild(g);
  });

  // ══════════════════════════════════════════════════════
  // LABEL COLLISION RESOLUTION
  // ══════════════════════════════════════════════════════

  pendingLabels.sort((a,b)=>{
    const aHP=a.onHumanPath?0:1;
    const bHP=b.onHumanPath?0:1;
    if(aHP!==bHP) return aHP-bHP;
    if(a.n.depth<=1&&b.n.depth>1) return -1;
    if(b.n.depth<=1&&a.n.depth>1) return 1;
    return a.n.depth-b.n.depth;
  });
  const labelGrid=createSpatialHash(100);
  function boxesOverlap(a,b){
    return a.bx<b.bx+b.textW&&a.bx+a.textW>b.bx&&a.by<b.by+b.textH&&a.by+a.textH>b.by;
  }
  pendingLabels.forEach(lb=>{
    const forceShow=isCladogram||lb.n.depth<=1||lb.onHumanPath;
    if(!forceShow){
      const nearby=labelGrid.query(lb);
      for(const placed of nearby){
        if(boxesOverlap(lb,placed)) return;
      }
    }
    labelGrid.insert(lb);

    // Species name
    const svgText=document.createElementNS('http://www.w3.org/2000/svg','text');
    svgText.setAttribute('x',lb.lx);svgText.setAttribute('y',lb.ly);
    svgText.setAttribute('text-anchor',lb.anchor||'middle');
    svgText.setAttribute('dominant-baseline','middle');
    svgText.setAttribute('fill',lb.onHumanPath?'var(--tree-human-path)':lb.n.color);
    svgText.setAttribute('font-size',lb.fontSize);
    svgText.setAttribute('font-weight',lb.onHumanPath||lb.n.depth<=1?'600':'400');
    svgText.setAttribute('class','node-label-name');
    svgText.textContent=lb.labelText;
    lb.g.appendChild(svgText);

    // Latin name
    if(lb.latinText){
      const latin=document.createElementNS('http://www.w3.org/2000/svg','text');
      latin.setAttribute('x',lb.lx);latin.setAttribute('y',lb.ly+12);
      latin.setAttribute('text-anchor',lb.anchor||'middle');
      latin.setAttribute('class','node-label-latin');
      latin.textContent=lb.latinText;
      lb.g.appendChild(latin);
    }
  });

  // ══════════════════════════════════════════════════════
  // COMMIT TO DOM
  // ══════════════════════════════════════════════════════

  branchLayer.replaceChildren(branchFrag);
  nodesLayer.replaceChildren(nodesFrag);

  // Batch-trigger entrance animations
  if(animDeferred.length){
    requestAnimationFrame(()=>{
      for(const el of animDeferred){
        el.classList.add(el.tagName==='path'?'branch-entered':'node-entered');
      }
    });
  }

  // Restore keyboard focus
  if(state.focusedNodeId){
    const fg=document.querySelector('.node-group[data-node-id="'+state.focusedNodeId+'"]');
    if(fg) fg.focus({preventScroll:true});
  }

  // Post-render callback hook
  if(typeof window._onRenderComplete==='function') window._onRenderComplete();
}
