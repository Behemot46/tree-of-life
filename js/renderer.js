// ══════════════════════════════════════════════════════
// RENDERER — SVG render engine (branches, nodes, labels)
// ══════════════════════════════════════════════════════

import { state, nodeMap, animDone, confirmedPhotoUrls, HUMAN_PATH } from './state.js';
import { getVisible, getVisibleEdges, countDescendants } from './layout.js';
import { reducedMotion } from './utils.js';
import { getPlaybackNodeState, discoverNode, showDiscoveryCard } from './playback.js';
import { isExplored } from './engagement.js';
import { nodeInEra } from './timeline.js';
import { a11yAnnounce } from './engagement.js';
import { NODE_ICONS, getIconGroup } from './nodeIcons.js';
import { ImageLoader } from './imageLoader.js';

// ── Late-bound deps (avoid circular imports) ──
let _showMainPanel, _showTip, _hideTip, _smoothPanTo, _smoothZoomTo, _layout, _updateBreadcrumb;
export function initRendererDeps(deps) {
  _showMainPanel = deps.showMainPanel; _showTip = deps.showTip;
  _hideTip = deps.hideTip; _smoothPanTo = deps.smoothPanTo;
  _smoothZoomTo = deps.smoothZoomTo; _layout = deps.layout;
  _updateBreadcrumb = deps.updateBreadcrumb;
}

// ── DOM refs ──
const branchLayer = document.getElementById('layer-branches');
const nodesLayer = document.getElementById('layer-nodes');

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
// BRANCH PATH
// ══════════════════════════════════════════════════════

export function branchPath(x1,y1,x2,y2){
  if(state.viewMode==='cladogram'){return `M${x1},${y1} H${(x1+x2)/2} V${y2} H${x2}`;}
  if(state.viewMode==='chronological'){return `M${x1},${y1} L${x2},${y2}`;}
  if(state.viewMode==='playback'){return `M${x1},${y1} C${x1+(x2-x1)*0.5},${y1} ${x1+(x2-x1)*0.5},${y2} ${x2},${y2}`;}
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

/* ===========================
   RENDER SCHEDULER
   =========================== */

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
  const vb=getViewBounds(100);
  const animDeferred=[];

  // Branches
  const humanPathEdges=[];
  const evoPathEdges=[];
  edges.forEach(({from,to})=>{
    if(to._domain && to._domain!=='luca' && !state.activeDomains.has(to._domain)) return;
    if(!state.showExtinct && to.extinct) return;

    // Playback: skip branch if child is hidden
    if(state.playbackMode){
      const childState=state.playbackNodeStates.get(to.id)||getPlaybackNodeState(to);
      if(childState==='hidden') return;
    }
    // Viewport culling: skip if both endpoints off-screen
    if(!isInView(from._x,from._y,vb)&&!isInView(to._x,to._y,vb)) return;

    const inEra=nodeInEra(to);
    const onHumanPath=HUMAN_PATH.has(from.id)&&HUMAN_PATH.has(to.id);
    const onEvoPath=state.evoPathActive&&state.evoPathEdgeSet.has(from.id+'|'+to.id);
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',branchPath(from._x,from._y,to._x,to._y));
    p.setAttribute('class','branch-path');
    p.setAttribute('data-branch','true');
    const isAccent=onHumanPath||onEvoPath;
    const sw=isAccent?6:Math.max(3,8-to.depth*0.6);

    // Playback: locked branches are dimmer
    let op;
    if(state.playbackMode){
      const childState=state.playbackNodeStates.get(to.id)||getPlaybackNodeState(to);
      op=childState==='locked'?0.12:(isAccent?0.95:(inEra?Math.max(0.4,0.85-to.depth*0.05):0.12));
    } else {
      op=isAccent?0.95:(inEra?Math.max(0.4,0.85-to.depth*0.05):0.12);
    }
    p.setAttribute('stroke',onEvoPath?'var(--accent-secondary)':(onHumanPath?'var(--accent-primary)':to.color));
    p.setAttribute('stroke-width',sw);
    p.setAttribute('stroke-opacity',op);
    if(!animDone.has(to.id)){
      if(state.playbackMode){
        const len=9999;p.style.strokeDasharray=len;p.style.strokeDashoffset=len;
        p.classList.add('branch-pb-grow');
        setTimeout(()=>{p.style.strokeDashoffset=0;},30);
      } else {
        p.style.setProperty('--depth',to.depth);
        p.classList.add('branch-entering');
        animDeferred.push(p);
        p.addEventListener('transitionend',function h(){p.classList.remove('branch-entering','branch-entered');p.style.removeProperty('--depth');p.removeEventListener('transitionend',h);},{once:true});
      }
    }
    branchFrag.appendChild(p);
    if(onHumanPath) humanPathEdges.push(p);
    if(onEvoPath) evoPathEdges.push(p);
  });
  // Re-append human path edges on top so they draw over other branches
  humanPathEdges.forEach(p=>branchFrag.appendChild(p));
  // Evo path edges draw on top of everything
  evoPathEdges.forEach(p=>branchFrag.appendChild(p));

  // Nodes
  const pendingLabels=[];
  nodes.forEach(n=>{
    if(n._domain && n._domain!=='luca' && !state.activeDomains.has(n._domain)) return;
    if(!state.showExtinct && n.extinct) return;

    // Viewport culling: skip off-screen nodes
    if(!isInView(n._x,n._y,vb)) return;

    // Playback: skip hidden, render locked differently
    const pbState=state.playbackMode?(state.playbackNodeStates.get(n.id)||getPlaybackNodeState(n)):null;
    if(state.playbackMode&&pbState==='hidden') return;

    if(state.playbackMode&&pbState==='locked'){
      // Render locked silhouette node
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('class','node-group');
      g.style.cursor='pointer';

      // Hit area
      const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hit.setAttribute('cx',n._x);hit.setAttribute('cy',n._y);hit.setAttribute('r',Math.max(n.r+14,22));
      hit.setAttribute('fill','transparent');hit.style.cursor='pointer';
      hit.addEventListener('click',e=>{e.stopPropagation();discoverNode(n);});
      g.appendChild(hit);

      // Locked circle (dashed, dim)
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx',n._x);c.setAttribute('cy',n._y);c.setAttribute('r',Math.max(n.r,8));
      c.setAttribute('class','node-locked');
      c.style.transformOrigin=`${n._x}px ${n._y}px`;
      c.addEventListener('mouseenter',function(){_showTip('???','?');});
      c.addEventListener('mouseleave',function(){_hideTip();});
      c.addEventListener('click',e=>{e.stopPropagation();discoverNode(n);});
      g.appendChild(c);

      // Question mark icon
      const qm=document.createElementNS('http://www.w3.org/2000/svg','text');
      qm.setAttribute('x',n._x);qm.setAttribute('y',n._y+4);
      qm.setAttribute('text-anchor','middle');qm.setAttribute('font-size',Math.max(10,n.r*0.8));
      qm.setAttribute('fill','var(--parchment)');qm.setAttribute('fill-opacity','0.5');
      qm.setAttribute('font-family','Inter,sans-serif');qm.setAttribute('font-weight','700');
      qm.style.pointerEvents='none';
      qm.textContent='?';
      g.appendChild(qm);

      g.addEventListener('contextmenu',e=>e.preventDefault());
      nodesFrag.appendChild(g);
      return; // skip normal node rendering for locked nodes
    }

    const inEra=nodeInEra(n);
    const isHighlighted=state.highlightedId===n.id;
    const isGroupChip=n.id&&n.id.startsWith('group-');
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','node-group');
    g.setAttribute('role','treeitem');
    g.setAttribute('tabindex',n.id==='luca'?'0':'-1');
    g.setAttribute('aria-label',n.name+(n.latin?' ('+n.latin+')':'')+(n.extinct?' - extinct':''));
    g.setAttribute('data-node-id',n.id);
    if(state.focusedNodeId===n.id) g.setAttribute('aria-selected','true');
    if(n.children&&n.children.length) g.setAttribute('aria-expanded',String(!n._collapsed));
    g.style.cursor='pointer';

    if(isGroupChip){
      // ── PILL / CHIP rendering for hominin group nodes ──
      const pillW=Math.max(n.name.length*7+32,100);
      const pillH=28;
      const px=n._x-pillW/2;
      const py=n._y-pillH/2;
      const colAlpha=n.color+'33';
      const colBorder=n.color+'66';
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

      // Highlight ring for search
      if(isHighlighted){
        const hl=document.createElementNS('http://www.w3.org/2000/svg','rect');
        hl.setAttribute('x',px-4);hl.setAttribute('y',py-4);
        hl.setAttribute('width',pillW+8);hl.setAttribute('height',pillH+8);
        hl.setAttribute('rx','18');hl.setAttribute('fill','none');
        hl.setAttribute('stroke','#0ea5e9');hl.setAttribute('stroke-width','2');hl.setAttribute('stroke-opacity','0.9');
        g.appendChild(hl);
      }

      // Animate in
      if(!animDone.has(n.id)){
        if(reducedMotion()){
          animDone.add(n.id);
        } else {
          g.style.transformOrigin=`${n._x}px ${n._y}px`;
          g.style.setProperty('--depth',n.depth);
          g.classList.add('node-entering');
          animDeferred.push(g);
          setTimeout(()=>animDone.add(n.id),550+n.depth*90);
        }
      }

      // Left-click toggles collapse; double-click opens panel
      g.addEventListener('click',e=>{e.stopPropagation();n._collapsed=!n._collapsed;scheduleRender();a11yAnnounce(n.name+(n._collapsed?' collapsed':' expanded'));});
      g.addEventListener('dblclick',e=>{e.stopPropagation();_showMainPanel(n);});
      g.addEventListener('contextmenu',e=>{e.preventDefault();_showMainPanel(n);});
      nodesFrag.appendChild(g);
      return; // skip normal node rendering
    }

    const onHumanPath=HUMAN_PATH.has(n.id);

    // Human evolution path accent ring
    if(onHumanPath&&n.depth>0){
      const pathRing=document.createElementNS('http://www.w3.org/2000/svg','circle');
      pathRing.setAttribute('cx',n._x);pathRing.setAttribute('cy',n._y);pathRing.setAttribute('r',n.r+7);
      pathRing.setAttribute('fill','none');pathRing.setAttribute('stroke','var(--accent-primary)');
      pathRing.setAttribute('stroke-width','2');pathRing.setAttribute('stroke-opacity','0.5');
      g.appendChild(pathRing);
    }

    // Evolutionary path accent ring (orange)
    if(state.evoPathActive&&state.evoPathSet.has(n.id)&&n.depth>0){
      const evoRing=document.createElementNS('http://www.w3.org/2000/svg','circle');
      evoRing.setAttribute('cx',n._x);evoRing.setAttribute('cy',n._y);evoRing.setAttribute('r',n.r+8);
      evoRing.setAttribute('fill','none');evoRing.setAttribute('stroke','var(--accent-secondary)');
      evoRing.setAttribute('stroke-width','2.5');evoRing.setAttribute('stroke-opacity','0.6');
      g.appendChild(evoRing);
    }

    // Root pulse ring
    if(n.depth===0){
      const glow=document.createElementNS('http://www.w3.org/2000/svg','circle');
      glow.setAttribute('cx',n._x);glow.setAttribute('cy',n._y);glow.setAttribute('r',n.r+14);
      glow.setAttribute('fill','none');glow.setAttribute('stroke',n.color);
      glow.setAttribute('stroke-width','1.5');glow.setAttribute('stroke-opacity','0.4');
      glow.style.opacity='0.4';
      g.appendChild(glow);
    }

    // Living pulse ring for Homo sapiens
    if(n.id==='h_sapiens'){
      const ring=document.createElementNS('http://www.w3.org/2000/svg','circle');
      ring.setAttribute('cx',n._x);ring.setAttribute('cy',n._y);ring.setAttribute('r',n.r+10);
      ring.setAttribute('fill','none');ring.setAttribute('stroke',n.color);
      ring.setAttribute('stroke-width','1');ring.setAttribute('stroke-opacity','0.5');
      ring.style.opacity='0.5';
      g.appendChild(ring);
    }

    // Hominini gateway — golden pulsing ring
    if(n.id==='hominini'){
      const gw=document.createElementNS('http://www.w3.org/2000/svg','circle');
      gw.setAttribute('cx',n._x);gw.setAttribute('cy',n._y);gw.setAttribute('r',n.r+12);
      gw.setAttribute('fill','none');gw.setAttribute('stroke','#c8883a');
      gw.setAttribute('stroke-width','2');gw.setAttribute('stroke-opacity','0.6');
      gw.style.animation='homininGlow 2.5s ease-in-out infinite';
      g.appendChild(gw);
    }

    // Highlight ring
    if(isHighlighted){
      const hl=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hl.setAttribute('cx',n._x);hl.setAttribute('cy',n._y);hl.setAttribute('r',n.r+9);
      hl.setAttribute('fill','none');hl.setAttribute('stroke','#c8883a');
      hl.setAttribute('stroke-width','2');hl.setAttribute('stroke-opacity','0.9');
      g.appendChild(hl);
    }

    // Collapse ring
    if(n.children&&n.children.length&&n.depth>0){
      const ring=document.createElementNS('http://www.w3.org/2000/svg','circle');
      ring.setAttribute('cx',n._x);ring.setAttribute('cy',n._y);ring.setAttribute('r',n.r+5);
      ring.setAttribute('fill','none');ring.setAttribute('stroke',n.color);
      ring.setAttribute('stroke-width','0.7');ring.setAttribute('stroke-opacity','0.2');
      ring.setAttribute('stroke-dasharray','3 3');
      g.appendChild(ring);
    }

    // Invisible hit area — much easier to click
    const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
    hit.setAttribute('cx',n._x);hit.setAttribute('cy',n._y);hit.setAttribute('r',Math.max(n.r+14,22));
    hit.setAttribute('fill','transparent');hit.style.cursor='pointer';
    hit.addEventListener('click',e=>{e.stopPropagation();_showMainPanel(n);});
    g.appendChild(hit);

    // Main circle
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',n._x);c.setAttribute('cy',n._y);c.setAttribute('r',Math.max(n.r,8));
    c.setAttribute('class','node-circle nc-main');
    c.setAttribute('data-depth',n.depth||0);
    c.setAttribute('fill',n.depth===0?'url(#rootGrad)':n.color);
    const _expl=isExplored(n.id);const _bOp=n.depth===0?1:n.depth<=1?0.9:0.8;
    c.setAttribute('fill-opacity',inEra?String(_expl?_bOp:_bOp*0.65):'0.15');
    c.style.stroke='var(--bg)';c.setAttribute('stroke-width','1.5');
    c.style.setProperty('--nc',n.color);
    /* no glow filter on root */
    if(n.extinct){c.setAttribute('stroke-dasharray','4 2');c.setAttribute('opacity','0.6');}
    c.style.cursor = 'pointer';
    c.style.pointerEvents = 'all';
    c.addEventListener('mouseenter', function(){ this.style.transform='scale(1.12)';this.style.transformOrigin='center';this.style.filter='drop-shadow(0 0 6px '+n.color+')'; _showTip(n.name, n.icon, n.funFact); });
    c.addEventListener('mouseleave', function(){ this.style.transform='scale(1)';this.style.filter=''; _hideTip(); });
    c.addEventListener('click', e=>{ e.stopPropagation(); _showMainPanel(n); });
    g.appendChild(c);

    // Species image (ImageLoader) or SVG silhouette icon fallback
    if(inEra){
      const imgR=Math.max(n.r,8);
      const imgSize=imgR*2;

      // Helper to render SVG silhouette icon (used as fallback)
      function addSilhouette(){
        const ig=getIconGroup(n);
        const iconPath=NODE_ICONS[ig]||NODE_ICONS.default;
        const s=Math.max(12,n.r*1.2);
        // Subtle background circle behind icon
        const iconBg=document.createElementNS('http://www.w3.org/2000/svg','circle');
        iconBg.setAttribute('cx',n._x);iconBg.setAttribute('cy',n._y);
        iconBg.setAttribute('r',s*0.55);
        iconBg.setAttribute('fill',n.color||'var(--text-muted)');
        iconBg.setAttribute('opacity','0.12');
        iconBg.style.pointerEvents='none';
        g.appendChild(iconBg);
        // Icon silhouette
        const icon=document.createElementNS('http://www.w3.org/2000/svg','path');
        icon.setAttribute('d',iconPath);
        icon.setAttribute('fill',document.documentElement.getAttribute('data-theme')==='light'?'rgba(30,30,30,0.7)':'rgba(255,255,255,0.85)');
        icon.setAttribute('transform',`translate(${n._x-s/2},${n._y-s/2}) scale(${s/24})`);
        icon.style.pointerEvents='none';
        g.appendChild(icon);
      }

      // Always show silhouette icon first
      addSilhouette();

      // Overlay species photo on top if available (via ImageLoader)
      // Uses foreignObject + HTML img (SVG <image> fails cross-origin)
      if(ImageLoader&&imgR>=8){
        const cachedUrl=confirmedPhotoUrls.get(n.id);
        const best=cachedUrl ? {url:cachedUrl} : ImageLoader.getBestUrl(n);
        if(best.url){
          const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
          fo.setAttribute('x',n._x-imgR);fo.setAttribute('y',n._y-imgR);
          fo.setAttribute('width',imgSize);fo.setAttribute('height',imgSize);
          fo.style.pointerEvents='none';fo.style.overflow='hidden';
          const wrap=document.createElement('div');
          wrap.className='node-img-wrap';
          wrap.style.width=`${imgSize}px`;wrap.style.height=`${imgSize}px`;
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

    // Label — compute position and store for global collision pass
    if(inEra&&n.depth<=6){
      const sibCount=n._parent?.children?.length||1;
      const angleRad=n._angle-Math.PI/2;
      const lDist=n.r+18+Math.max(0,(n.depth-3)*4);
      const lx=n._x+Math.cos(angleRad)*lDist;
      const ly=n._y+Math.sin(angleRad)*lDist;
      const cos=Math.cos(angleRad);
      const fontSize=n.depth===0?14:n.depth===1?12:sibCount>12?8:sibCount>8?9:10;
      const labelText=n._hominData?n._hominData.short:n.name;
      const textW=labelText.length*fontSize*0.55;
      const textH=fontSize+2;
      const anchor=cos<-0.15?'end':cos>0.15?'start':'middle';
      const bx=anchor==='end'?lx-textW:anchor==='start'?lx:lx-textW/2;
      pendingLabels.push({n,lx,ly,cos,fontSize,textW,textH,bx,by:ly-textH/2,anchor,g});
    }

    // Expand/collapse badge with descendant count
    if(n.children?.length&&n.depth>0){
      const bx=n._x+n.r*0.7,by=n._y-n.r*0.7;
      const totalKids=countDescendants(n);
      const bg=document.createElementNS('http://www.w3.org/2000/svg','circle');
      bg.setAttribute('cx',bx);bg.setAttribute('cy',by);
      bg.setAttribute('r',n._collapsed?'10':'7');
      bg.setAttribute('fill',n._collapsed?'#c8883a':'#5b9a6b');
      bg.style.stroke='var(--bg)';bg.setAttribute('stroke-width','2');
      if(n._collapsed&&totalKids>5) bg.classList.add('badge-pulse');
      g.appendChild(bg);
      const label=document.createElementNS('http://www.w3.org/2000/svg','text');
      label.setAttribute('x',bx);label.setAttribute('y',by);
      label.setAttribute('text-anchor','middle');label.setAttribute('dominant-baseline','central');
      label.setAttribute('fill','#fff');
      label.setAttribute('font-size',n._collapsed?'9':'8');
      label.setAttribute('font-weight','700');label.setAttribute('font-family','Inter,sans-serif');
      label.style.pointerEvents='none';
      label.textContent=n._collapsed?String(totalKids):'\u2212';
      g.appendChild(label);
    }

    // Animate in (skip during playback — playback has its own locked->revealed animation)
    if(!state.playbackMode&&!animDone.has(n.id)){
      if(reducedMotion()){
        animDone.add(n.id);
      } else {
        g.style.transformOrigin=`${n._x}px ${n._y}px`;
        g.style.setProperty('--depth',n.depth);
        g.classList.add('node-entering');
        animDeferred.push(g);
        setTimeout(()=>animDone.add(n.id),550+n.depth*90);
      }
    }

    // Events — left-click: expand/collapse branches, open panel for leaves
    g.addEventListener('click',e=>{
      e.stopPropagation();
      if(state.playbackMode){showDiscoveryCard(n);return;}
      if(n.children&&n.children.length){
        const wasCollapsed=n._collapsed;
        // Auto-collapse siblings when expanding to keep tree focused
        if(wasCollapsed && n._parent && n._parent.children){
          n._parent.children.forEach(sib=>{
            if(sib!==n && sib.children && !sib._collapsed) sib._collapsed=true;
          });
        }
        n._collapsed=!n._collapsed;
        _layout();scheduleRender(true);
        a11yAnnounce(n.name+(n._collapsed?' collapsed':' expanded'));
        // Zoom-to-fit expanded children
        if(!n._collapsed){
          setTimeout(()=>{
            const kids=getVisible(n).filter(k=>k._parent===n);
            if(!kids.length) return;
            const allPts=[n,...kids];
            const xs=allPts.map(k=>k._x),ys=allPts.map(k=>k._y);
            const minX=Math.min(...xs),maxX=Math.max(...xs);
            const minY=Math.min(...ys),maxY=Math.max(...ys);
            const bw=maxX-minX||200,bh=maxY-minY||200;
            const svgR=(document.getElementById('canvas-wrap')||document.getElementById('svg')).getBoundingClientRect();
            const fitScale=Math.min(svgR.width*0.8/bw,svgR.height*0.8/bh);
            const targetS=Math.min(2.0,Math.max(state.transform.s,fitScale));
            _smoothZoomTo((minX+maxX)/2,(minY+maxY)/2,targetS);
            if(_updateBreadcrumb) _updateBreadcrumb(n);
          },100);
        } else {
          // On collapse: zoom out to show parent context
          if(n._parent){
            setTimeout(()=>{
              const sibs=n._parent.children||[n._parent];
              const allPts=[n._parent,...sibs];
              const xs=allPts.map(k=>k._x),ys=allPts.map(k=>k._y);
              const bw=(Math.max(...xs)-Math.min(...xs))||200;
              const bh=(Math.max(...ys)-Math.min(...ys))||200;
              const svgR=(document.getElementById('canvas-wrap')||document.getElementById('svg')).getBoundingClientRect();
              const fitScale=Math.min(svgR.width*0.7/bw,svgR.height*0.7/bh);
              const targetS=Math.min(state.transform.s,fitScale);
              _smoothZoomTo((Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2,targetS);
              if(_updateBreadcrumb) _updateBreadcrumb(n._parent);
            },100);
          }
        }
      }else{
        _showMainPanel(n);
      }
    });
    // Double-click: always open panel (even for branch nodes)
    g.addEventListener('dblclick',e=>{e.stopPropagation();e.preventDefault();if(!state.playbackMode)_showMainPanel(n);});
    nodesFrag.appendChild(g);
  });

  // Global label collision resolution
  // Sort by priority: human path first, then depth 0-1, then by depth ascending
  pendingLabels.sort((a,b)=>{
    const aHP=HUMAN_PATH.has(a.n.id)?0:1;
    const bHP=HUMAN_PATH.has(b.n.id)?0:1;
    if(aHP!==bHP) return aHP-bHP;
    if(a.n.depth<=1 && b.n.depth>1) return -1;
    if(b.n.depth<=1 && a.n.depth>1) return 1;
    return a.n.depth-b.n.depth;
  });
  const labelGrid=createSpatialHash(100);
  function boxesOverlap(a,b){
    return a.bx<b.bx+b.textW && a.bx+a.textW>b.bx && a.by<b.by+b.textH && a.by+a.textH>b.by;
  }
  pendingLabels.forEach(lb=>{
    const onPath=HUMAN_PATH.has(lb.n.id);
    // Always show depth 0-1 and human path nodes
    const forceShow=lb.n.depth<=1||onPath;
    if(!forceShow){
      const nearby=labelGrid.query(lb);
      for(const placed of nearby){
        if(boxesOverlap(lb,placed)){return;}
      }
    }
    labelGrid.insert(lb);
    const svgText=document.createElementNS('http://www.w3.org/2000/svg','text');
    svgText.setAttribute('x',lb.lx);svgText.setAttribute('y',lb.ly);
    svgText.setAttribute('text-anchor',lb.anchor);
    svgText.setAttribute('dominant-baseline','middle');
    svgText.setAttribute('fill',onPath?'var(--accent-primary)':lb.n.depth===0?'#e8eaf0':lb.n.depth<=1?'rgba(160,164,176,0.95)':'rgba(107,112,128,0.85)');
    svgText.setAttribute('font-size',lb.fontSize);
    svgText.setAttribute('font-family',"'Inter', sans-serif");
    svgText.setAttribute('font-weight',onPath||lb.n.depth<=1?'600':'400');
    svgText.setAttribute('class','node-label-text');
    svgText.textContent=lb.n._hominData?lb.n._hominData.short:lb.n.name;
    lb.g.appendChild(svgText);
  });

  branchLayer.replaceChildren(branchFrag);
  nodesLayer.replaceChildren(nodesFrag);
  // Batch-trigger entrance animations after DOM commit
  if(animDeferred.length){
    requestAnimationFrame(()=>{
      for(const el of animDeferred){
        el.classList.add(el.tagName==='path'?'branch-entered':'node-entered');
      }
    });
  }

  // Restore keyboard focus after DOM rebuild
  if(state.focusedNodeId){
    const _restoreId=state.focusedNodeId;
    const g=document.querySelector('.node-group[data-node-id="'+_restoreId+'"]');
    if(g) g.focus({preventScroll:true});
  }
}
