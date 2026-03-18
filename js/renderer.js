// ══════════════════════════════════════════════════════
// RENDERER — SVG rendering, icons, branches, timeline, view switching
// ══════════════════════════════════════════════════════

// NODE_ICONS and getIconGroup() loaded from js/nodeIcons.js

// ── HUMAN EVOLUTION PATH ──
const HUMAN_PATH=new Set(['luca','eukaryota','animalia','vertebrates','mammals','primates','great-apes','hominini','group-homo','h_sapiens']);

// ══════════════════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════════════════
const branchLayer=document.getElementById('layer-branches');
const nodesLayer=document.getElementById('layer-nodes');
const viewport=document.getElementById('viewport');
var applyT=()=>viewport.setAttribute('transform',`translate(${transform.x},${transform.y}) scale(${transform.s})`);

function branchPath(x1,y1,x2,y2){
  if(viewMode==='cladogram'){return `M${x1},${y1} H${(x1+x2)/2} V${y2} H${x2}`;}
  if(viewMode==='chronological'){return `M${x1},${y1} L${x2},${y2}`;}
  const mx=(x1+x2)/2,my=(y1+y2)/2;return `M${x1},${y1} Q${mx+(my-y1)*0.28},${my-(mx-x1)*0.28} ${x2},${y2}`;
}

/* ===========================
   RENDER SCHEDULER
   =========================== */
function scheduleRender(force){
  if(force){
    renderQueued=false;
    render();
    return;
  }
  if(renderQueued) return;
  renderQueued=true;
  requestAnimationFrame(()=>{
    renderQueued=false;
    render();
  });
}

function render(){
  const branchFrag=document.createDocumentFragment();
  const nodesFrag=document.createDocumentFragment();
  const edges=getVisibleEdges(TREE);
  const nodes=getVisible(TREE);

  // Branches
  const humanPathEdges=[];
  edges.forEach(({from,to})=>{
    if(to._domain && to._domain!=='luca' && !activeDomains.has(to._domain)) return;
    if(!showExtinct && to.extinct) return;
    const inEra=nodeInEra(to);
    const onHumanPath=HUMAN_PATH.has(from.id)&&HUMAN_PATH.has(to.id);
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',branchPath(from._x,from._y,to._x,to._y));
    p.setAttribute('class','branch-path');
    p.setAttribute('data-branch','true');
    const sw=onHumanPath?4:Math.max(2,4.5-to.depth*0.35);
    const op=onHumanPath?0.9:(inEra?Math.max(0.4,0.85-to.depth*0.06):0.08);
    p.setAttribute('stroke',onHumanPath?'var(--accent-primary)':to.color);
    p.setAttribute('stroke-width',sw);
    p.setAttribute('stroke-opacity',op);
    p.setAttribute('stroke-linecap','round');
    p.setAttribute('stroke-linejoin','round');
    if(!animDone.has(to.id)){
      const len=300;p.style.strokeDasharray=len;p.style.strokeDashoffset=len;
      p.style.transition=`stroke-dashoffset ${0.3+to.depth*0.05}s cubic-bezier(.4,0,.2,1) ${to.depth*0.04}s`;
      setTimeout(()=>{p.style.strokeDashoffset=0;},50);
    }
    branchFrag.appendChild(p);
    if(onHumanPath) humanPathEdges.push(p);
  });
  // Re-append human path edges on top so they draw over other branches
  humanPathEdges.forEach(p=>branchFrag.appendChild(p));

  // Nodes
  const pendingLabels=[];
  nodes.forEach(n=>{
    if(n._domain && n._domain!=='luca' && !activeDomains.has(n._domain)) return;
    if(!showExtinct && n.extinct) return;
    const inEra=nodeInEra(n);
    const isHighlighted=highlightedId===n.id;
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','node-group');
    g.style.cursor='pointer';

    const onHumanPath=HUMAN_PATH.has(n.id);

    // Human evolution path accent ring
    if(onHumanPath&&n.depth>0){
      const pathRing=document.createElementNS('http://www.w3.org/2000/svg','circle');
      pathRing.setAttribute('cx',n._x);pathRing.setAttribute('cy',n._y);pathRing.setAttribute('r',n.r+7);
      pathRing.setAttribute('fill','none');pathRing.setAttribute('stroke','var(--accent-primary)');
      pathRing.setAttribute('stroke-width','2');pathRing.setAttribute('stroke-opacity','0.5');
      g.appendChild(pathRing);
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

    // Hominini gateway — golden pulsing ring + Explore badge
    if(n.id==='hominini'){
      const gw=document.createElementNS('http://www.w3.org/2000/svg','circle');
      gw.setAttribute('cx',n._x);gw.setAttribute('cy',n._y);gw.setAttribute('r',n.r+12);
      gw.setAttribute('fill','none');gw.setAttribute('stroke','#e8b86d');
      gw.setAttribute('stroke-width','2');gw.setAttribute('stroke-opacity','0.6');
      gw.style.animation='homininGlow 2.5s ease-in-out infinite';
      g.appendChild(gw);
      const badgeFo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
      const bw=64,bh=18;
      badgeFo.setAttribute('x',n._x-bw/2);badgeFo.setAttribute('y',n._y+n.r+6);
      badgeFo.setAttribute('width',bw);badgeFo.setAttribute('height',bh);
      badgeFo.style.pointerEvents='none';
      const badge=document.createElement('div');
      badge.style.cssText='font-size:9px;font-family:"Heebo",sans-serif;color:#e8b86d;text-align:center;font-weight:700;letter-spacing:0.05em;opacity:0.85;';
      badge.textContent='Explore \u2192';
      badgeFo.appendChild(badge);g.appendChild(badgeFo);
    }

    // Highlight ring
    if(isHighlighted){
      const hl=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hl.setAttribute('cx',n._x);hl.setAttribute('cy',n._y);hl.setAttribute('r',n.r+9);
      hl.setAttribute('fill','none');hl.setAttribute('stroke','#0ea5e9');
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
    hit.addEventListener('click',e=>{
      e.stopPropagation();
      if(n.children?.length){n._collapsed=!n._collapsed;scheduleRender();}
      else showMainPanel(n);
    });
    hit.addEventListener('dblclick',e=>{e.stopPropagation();showMainPanel(n);});
    g.appendChild(hit);

    // Main circle
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',n._x);c.setAttribute('cy',n._y);c.setAttribute('r',Math.max(n.r,8));
    c.setAttribute('class','node-circle nc-main');
    c.setAttribute('data-depth',n.depth||0);
    c.setAttribute('fill',n.depth===0?'url(#rootGrad)':n.color);
    c.setAttribute('fill-opacity',inEra?(n.depth===0?'1':n.depth<=1?'0.9':'0.8'):'0.15');
    c.style.stroke='var(--bg)';c.setAttribute('stroke-width','1.5');
    c.style.setProperty('--nc',n.color);
    if(n.extinct){c.setAttribute('stroke-dasharray','4 2');c.setAttribute('opacity','0.6');}
    c.style.cursor = 'pointer';
    c.style.pointerEvents = 'all';
    c.addEventListener('mouseenter', function(){ this.style.transform='scale(1.15)';this.style.transformOrigin='center';this.style.filter='brightness(1.2)'; showTip(n.name, n.icon); });
    c.addEventListener('mouseleave', function(){ this.style.transform='scale(1)';this.style.filter=''; hideTip(); });
    c.addEventListener('click', e=>{
      e.stopPropagation();
      if(n.children?.length){n._collapsed=!n._collapsed;scheduleRender();}
      else showMainPanel(n);
    });
    c.addEventListener('dblclick', e=>{ e.stopPropagation(); showMainPanel(n); });
    g.appendChild(c);

    // Species image (ImageLoader) or SVG silhouette icon fallback
    if(inEra){
      const imgR=Math.max(n.r,8);
      const imgSize=imgR*2;

      // Helper to render SVG silhouette icon (used as fallback)
      function addSilhouette(){
        const ig=getIconGroup(n);
        const iconPath=NODE_ICONS[ig]||NODE_ICONS.default;
        const s=Math.max(10,n.r*1.1);
        const icon=document.createElementNS('http://www.w3.org/2000/svg','path');
        icon.setAttribute('d',iconPath);
        icon.setAttribute('fill',document.documentElement.getAttribute('data-theme')==='light'?'rgba(30,30,30,0.55)':'rgba(255,255,255,0.6)');
        icon.setAttribute('transform',`translate(${n._x-s/2},${n._y-s/2}) scale(${s/24})`);
        icon.style.pointerEvents='none';
        g.appendChild(icon);
      }

      // Always show silhouette icon first
      addSilhouette();

      // Overlay species photo on top if available (via ImageLoader)
      if(typeof ImageLoader!=='undefined'&&imgR>=8){
        const best=ImageLoader.getBestUrl(n);
        if(best.url){
          const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
          fo.setAttribute('x',n._x-imgR);fo.setAttribute('y',n._y-imgR);
          fo.setAttribute('width',imgSize);fo.setAttribute('height',imgSize);
          fo.style.pointerEvents='none';fo.style.overflow='hidden';
          const wrap=document.createElement('div');
          wrap.style.cssText=`width:${imgSize}px;height:${imgSize}px;border-radius:50%;overflow:hidden;`;
          const htmlImg=document.createElement('img');
          htmlImg.style.cssText='width:100%;height:100%;object-fit:cover;display:block;';
          htmlImg.alt=n.name||'';
          htmlImg.addEventListener('load',function(){
            // Photo loaded — it naturally covers the silhouette underneath
          });
          let triedAltFmt=false;
          htmlImg.addEventListener('error',function(){
            // Try alternate format (.webp → .png) before giving up
            if(best.source==='generated'&&!triedAltFmt){
              triedAltFmt=true;
              const altUrl=ImageLoader.getAlternateGeneratedUrl(n.id,htmlImg.src);
              if(altUrl){htmlImg.src=altUrl;return;}
            }
            if(fo.parentNode) fo.remove();
            if(best.source==='generated') ImageLoader.markFailed(n.id);
          });
          htmlImg.src=best.url;
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
      const textW=n.name.length*fontSize*0.55;
      const textH=fontSize+2;
      const anchor=cos<-0.15?'end':cos>0.15?'start':'middle';
      const bx=anchor==='end'?lx-textW:anchor==='start'?lx:lx-textW/2;
      pendingLabels.push({n,lx,ly,cos,fontSize,textW,textH,bx,by:ly-textH/2,anchor,g});
    }

    // Collapse dot
    if(n.children?.length&&n.depth>0){
      const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('cx',n._x+n.r-3);dot.setAttribute('cy',n._y-n.r+3);dot.setAttribute('r','3.5');
      dot.setAttribute('fill',n._collapsed?'#f97316':'#22c55e');
      dot.style.stroke='var(--bg)';dot.setAttribute('stroke-width','1');
      g.appendChild(dot);
    }

    // Animate in — only on initial page load, not on expand/collapse
    if(!animDone.has(n.id)){
      if(!window._initialAnimDone){
        g.style.opacity='0';g.style.transformOrigin=`${n._x}px ${n._y}px`;g.style.transform='scale(0.2)';
        setTimeout(()=>{
          g.style.transition=`opacity 0.45s ease ${n.depth*0.09}s, transform 0.45s cubic-bezier(.34,1.56,.64,1) ${n.depth*0.09}s`;
          g.style.opacity='1';g.style.transform='scale(1)';
          setTimeout(()=>animDone.add(n.id),550+n.depth*90);
        },40);
      } else {
        animDone.add(n.id);
      }
    }

    // Events
    g.addEventListener('click',e=>{
      e.stopPropagation();
      if(n.children?.length){n._collapsed=!n._collapsed;scheduleRender();}
      else showMainPanel(n);
    });
    g.addEventListener('dblclick',e=>{e.stopPropagation();showMainPanel(n);});
    g.addEventListener('contextmenu',e=>{e.preventDefault();if(n.children?.length){n._collapsed=!n._collapsed;scheduleRender();}});
    nodesFrag.appendChild(g);
  });

  // Global label collision resolution
  pendingLabels.sort((a,b)=>{
    const aHP=HUMAN_PATH.has(a.n.id)?0:1;
    const bHP=HUMAN_PATH.has(b.n.id)?0:1;
    if(aHP!==bHP) return aHP-bHP;
    if(a.n.depth<=1 && b.n.depth>1) return -1;
    if(b.n.depth<=1 && a.n.depth>1) return 1;
    return a.n.depth-b.n.depth;
  });
  const placedBoxes=[];
  function boxesOverlap(a,b){
    return a.bx<b.bx+b.textW && a.bx+a.textW>b.bx && a.by<b.by+b.textH && a.by+a.textH>b.by;
  }
  pendingLabels.forEach(lb=>{
    const onPath=HUMAN_PATH.has(lb.n.id);
    const forceShow=lb.n.depth<=1||onPath;
    if(!forceShow){
      for(const placed of placedBoxes){
        if(boxesOverlap(lb,placed)){return;}
      }
    }
    placedBoxes.push(lb);
    const svgText=document.createElementNS('http://www.w3.org/2000/svg','text');
    svgText.setAttribute('x',lb.lx);svgText.setAttribute('y',lb.ly);
    svgText.setAttribute('text-anchor',lb.anchor);
    svgText.setAttribute('dominant-baseline','middle');
    svgText.setAttribute('fill',onPath?'var(--accent-primary)':lb.n.depth===0?'#e8eaf0':lb.n.depth<=1?'rgba(160,164,176,0.95)':'rgba(107,112,128,0.85)');
    svgText.setAttribute('font-size',lb.fontSize);
    svgText.setAttribute('font-family',"'Inter', sans-serif");
    svgText.setAttribute('font-weight',onPath||lb.n.depth<=1?'600':'400');
    svgText.setAttribute('class','node-label-text');
    svgText.textContent=lb.n.name;
    lb.g.appendChild(svgText);
  });

  branchLayer.replaceChildren(branchFrag);
  nodesLayer.replaceChildren(nodesFrag);
}

// ══════════════════════════════════════════════════════
// ERA BROWSER
// ══════════════════════════════════════════════════════
const eraSlider=document.getElementById('era-slider');
const eraLabel=document.getElementById('era-label');
const eraFill=document.getElementById('era-fill');

function getEraName(v){
  const keys=Object.keys(ERA_NAMES).map(Number).sort((a,b)=>a-b);
  let best=keys[0];
  for(const k of keys){if(v>=k)best=k;}
  return ERA_NAMES[best]||`${v} Ma`;
}

const EXTINCTION_DETAILS=[
  {mya:445,key:'ext_ordovician',pct:85,causeKey:'ext_cause_ordovician',survKey:'ext_surv_ordovician'},
  {mya:370,key:'ext_devonian',pct:75,causeKey:'ext_cause_devonian',survKey:'ext_surv_devonian'},
  {mya:252,key:'ext_permian',pct:96,causeKey:'ext_cause_permian',survKey:'ext_surv_permian'},
  {mya:200,key:'ext_triassic',pct:80,causeKey:'ext_cause_triassic',survKey:'ext_surv_triassic'},
  {mya:66,key:'ext_kpg',pct:76,causeKey:'ext_cause_kpg',survKey:'ext_surv_kpg'}
];
function buildExtinctionMarkers(){
  const container=document.getElementById('extinction-markers');
  if(!container)return;
  container.innerHTML='';
  EXTINCTION_DETAILS.forEach(ext=>{
    const pct=(ext.mya/3800)*100;
    const marker=document.createElement('div');
    marker.className='ext-marker';
    marker.style.left=`${100-pct}%`;
    marker.addEventListener('click',()=>animateSliderTo(ext.mya));
    const tooltip=document.createElement('div');
    tooltip.className='ext-tooltip';
    tooltip.innerHTML=`<div class="ext-tooltip-name">${t(ext.key)}</div><div class="ext-tooltip-stat">${ext.pct}% ${t('ext_lost')}</div><div class="ext-tooltip-cause">${t(ext.causeKey)}</div><div class="ext-tooltip-surv">${t(ext.survKey)}</div>`;
    marker.appendChild(tooltip);
    container.appendChild(marker);
  });
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
function updateEraTint(mya){
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

function updateSpeciesCount(){
  const all=Object.values(nodeMap);
  const visible=all.filter(n=>nodeInEra(n));
  const el=document.getElementById('era-species-count');
  if(el)el.textContent=t('era_species_count').replace('{0}',visible.length).replace('{1}',all.length);
}

function toggleEraPlay(){
  const btn=document.getElementById('era-play');
  if(eraPlayId){
    cancelAnimationFrame(eraPlayId);eraPlayId=null;
    btn.textContent='\u25b6';btn.classList.remove('playing');btn.title=t('era_play');return;
  }
  btn.textContent='\u23f8';btn.classList.add('playing');btn.title=t('era_pause');
  const startVal=parseInt(eraSlider.value);const startTime=performance.now();const duration=12000;
  function step(now){
    const elapsed=now-startTime;const progress=Math.min(1,elapsed/duration);
    const newVal=Math.round(startVal*(1-progress));
    eraSlider.value=newVal;currentEra=newVal;
    eraFill.style.width=(newVal/3800*100)+'%';
    eraLabel.textContent=getEraName(newVal);
    updateEraTint(newVal);updateSpeciesCount();updatePresetHighlight(newVal);
    scheduleRender();
    if(progress<1){eraPlayId=requestAnimationFrame(step);}
    else{eraPlayId=null;btn.textContent='\u25b6';btn.classList.remove('playing');btn.title=t('era_play');}
  }
  eraPlayId=requestAnimationFrame(step);
}

function animateSliderTo(target){
  if(eraPlayId){cancelAnimationFrame(eraPlayId);eraPlayId=null;
    const pb=document.getElementById('era-play');if(pb){pb.textContent='\u25b6';pb.classList.remove('playing');}}
  const start=parseInt(eraSlider.value);const diff=target-start;
  const startTime=performance.now();const duration=250;
  function step(now){
    const elapsed=now-startTime;const progress=Math.min(1,elapsed/duration);
    const eased=progress<0.5?2*progress*progress:-1+(4-2*progress)*progress;
    const newVal=Math.round(start+diff*eased);
    eraSlider.value=newVal;currentEra=newVal;
    eraFill.style.width=(newVal/3800*100)+'%';
    eraLabel.textContent=getEraName(newVal);
    updateEraTint(newVal);updateSpeciesCount();updatePresetHighlight(newVal);
    scheduleRender();
    if(progress<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updatePresetHighlight(mya){
  document.querySelectorAll('.era-preset').forEach(btn=>{
    const target=parseInt(btn.dataset.mya);
    btn.classList.toggle('active',Math.abs(mya-target)<100);
  });
}

function buildEraPresets(){
  const container=document.getElementById('era-presets');if(!container)return;
  const presets=[{mya:3800,key:'preset_luca'},{mya:2400,key:'preset_o2'},{mya:541,key:'preset_cambrian'},
    {mya:200,key:'preset_dinos'},{mya:66,key:'preset_kpg'},{mya:0,key:'preset_now'}];
  container.innerHTML='';
  presets.forEach(p=>{
    const btn=document.createElement('button');btn.className='era-preset';
    btn.textContent=t(p.key);btn.dataset.mya=p.mya;
    btn.addEventListener('click',()=>animateSliderTo(p.mya));
    container.appendChild(btn);
  });
  updatePresetHighlight(currentEra);
}

function centerOnTree(scale){
  const nodes=getVisible(TREE);
  if(!nodes.length)return;
  const xs=nodes.map(n=>n._x),ys=nodes.map(n=>n._y);
  const cx=(Math.min(...xs)+Math.max(...xs))/2;
  const cy=(Math.min(...ys)+Math.max(...ys))/2;
  transform={x:window.innerWidth/2-cx*scale,y:window.innerHeight/2-cy*scale,s:scale};
}
function setViewMode(mode){
  viewMode=mode;
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.mode===mode);
  });
  layout();
  if(mode==='radial'){centerOnTree(0.75);}
  else if(mode==='cladogram'){centerOnTree(0.7);}
  else if(mode==='chronological'){centerOnTree(0.65);}
  scheduleRender(true);applyT();
}

eraSlider.addEventListener('input',()=>{
  currentEra=parseInt(eraSlider.value);
  const pct=(currentEra/3800)*100;
  eraFill.style.width=pct+'%';
  eraLabel.textContent=getEraName(currentEra);
  updateEraTint(currentEra);
  updateSpeciesCount();
  updatePresetHighlight(currentEra);
  if(eraPlayId){cancelAnimationFrame(eraPlayId);eraPlayId=null;
    const pb=document.getElementById('era-play');if(pb){pb.textContent='\u25b6';pb.classList.remove('playing');}}
  scheduleRender();
});
