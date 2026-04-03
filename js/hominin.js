// ══════════════════════════════════════════════════════
// HOMININ — hominin tree builder and compare mode
// ══════════════════════════════════════════════════════

import { state, nodeMap } from './state.js';
import { homininToTreeNode, canonicalHomininId } from './utils.js';
import { FACTS } from './factLibrary.js';

// ── Late-binding deps (set via initHomininDeps) ──
let _scheduleRender, _showMainPanel, _renderPanelContent, _t;
export function initHomininDeps(deps) {
  _scheduleRender = deps.scheduleRender;
  _showMainPanel = deps.showMainPanel;
  _renderPanelContent = deps.renderPanelContent;
  _t = deps.t;
}
function t(key) { return _t ? _t(key) : key; }

// ── Compare Mode State ──
let compareMode=false;
let compareSelected=new Set();

// Uses globals: TREE, HOMININS, MAX_BRAIN

export function buildHomininTree(){
  // Find hominini node in the tree (under Great Apes)
  let homininiNode=null;
  (function walk(n){
    if(n.id==='hominini'){homininiNode=n;return;}
    if(n.children) n.children.forEach(walk);
  })(TREE);
  if(!homininiNode){console.warn('hominini node not found in TREE');return;}

  // Define 4 group nodes
  const groups=[
    {id:'group-proto',icon:'🦴',color:'#8B5E3C',r:30,appeared:7,extinct:true,
      name:'Proto-Hominins',latin:'Early Hominini',era:'7–3 Ma',
      desc:'The earliest members of the human lineage — bipedal apes from Africa\'s forests and lakeshores. These species bridge the gap between the human-chimp common ancestor and the australopiths.',
      detail:'Proto-hominins show the first signs of bipedalism while retaining many ape-like features. They are known from fragmentary fossils in Chad, Kenya, and Ethiopia.',
      facts:[{l:'Time span',v:'7–3 Mya'},{l:'Key trait',v:'Early bipedalism'},{l:'Regions',v:'Chad, Kenya, Ethiopia'}],
      tags:['Bipedalism origins','Forest dwellers','Human-chimp split'],
      filter:'proto'},
    {id:'group-australopith',icon:'🐒',color:'#b07840',r:30,appeared:4.2,extinct:true,
      name:'Australopithecus',latin:'Genus Australopithecus',era:'4.2–1.8 Ma',
      desc:'The "southern apes" — small-brained but fully bipedal hominins that dominated Africa for over 2 million years. Includes Lucy (Au. afarensis), the most famous fossil hominin.',
      detail:'Australopiths were the first hominins to thrive in open savanna environments. Some species may have used simple tools before the emergence of Homo.',
      facts:[{l:'Time span',v:'4.2–1.8 Mya'},{l:'Famous fossil',v:'Lucy (AL 288-1)'},{l:'Brain range',v:'370–500 cc'}],
      tags:['Lucy','Bipedal','Savanna','Southern apes'],
      filter:'australopith'},
    {id:'group-paranthropus',icon:'💪',color:'#9B3A3A',r:30,appeared:2.7,extinct:true,
      name:'Paranthropus',latin:'Genus Paranthropus',era:'2.7–1.2 Ma',
      desc:'The "robust" hominins — with massive jaws, huge molars, and dramatic sagittal crests for anchoring powerful chewing muscles. A specialized side branch that coexisted with early Homo for over a million years.',
      detail:'Paranthropus represents an evolutionary experiment in dietary specialization. While Homo invested in brains and tools, Paranthropus invested in jaw power.',
      facts:[{l:'Time span',v:'2.7–1.2 Mya'},{l:'Key trait',v:'Massive jaws & molars'},{l:'Species',v:'3 known'}],
      tags:['Robust hominins','Massive jaws','Sagittal crest','Dead-end lineage'],
      filter:'paranthropus'},
    {id:'group-homo',icon:'🧠',color:'#6B8B5E',r:30,appeared:2.4,extinct:null,
      name:'Genus Homo',latin:'Genus Homo',era:'2.4 Ma – present',
      desc:'Our own genus — from the first stone toolmakers to the species that split the atom. Homo is defined by increasing brain size, sophisticated tool use, fire control, and eventually language and symbolic thought.',
      detail:'The genus Homo emerged in Africa around 2.4 million years ago and eventually spread across every continent. Only one species survives today.',
      facts:[{l:'Time span',v:'2.4 Mya – present'},{l:'Living species',v:'1 (H. sapiens)'},{l:'Max brain',v:'~1,750 cc (Neanderthal)'}],
      tags:['Tool makers','Fire','Language','Global dispersal'],
      filter:'homo'}
  ];

  // Build group nodes with their children from HOMININS
  const groupNodes=groups.map(g=>{
    const species=HOMININS.filter(h=>h.group===g.filter).map(homininToTreeNode)
      .sort((a,b)=>b.appeared-a.appeared);  // oldest first
    return {
      id:g.id, icon:g.icon, color:g.color, r:g.r,
      appeared:g.appeared, extinct:g.extinct,
      name:g.name, latin:g.latin, era:g.era,
      desc:g.desc, detail:g.detail,
      facts:g.facts, tags:g.tags,
      children:species,
      _isHomininGroup:true
    };
  });

  homininiNode.children=groupNodes;
}

// ── Compare Mode ──

export function startCompareFromPanel(nodeId){
  compareMode=true;
  compareSelected.clear();
  // Find the HOMININS entry matching this tree node
  const hom=HOMININS.find(h=>h.id===nodeId);
  if(hom) compareSelected.add(hom.id);
  // Close panel and prompt user to click more hominin nodes
  const panel=document.getElementById('panel');
  panel.classList.remove('open');
  state.currentPanelNode=null;
  // Show a hint banner
  let banner=document.getElementById('compare-banner');
  if(!banner){
    banner=document.createElement('div');
    banner.id='compare-banner';
    banner.className='compare-banner';
    document.body.appendChild(banner);
  }
  banner.classList.add('visible');
  banner.innerHTML=`<span>⚖ Compare: click 1–3 more hominin species</span><button onclick="finishCompare()" style="padding:4px 12px;border-radius:8px;border:1px solid var(--accent-primary);background:var(--accent-primary-dim);color:var(--accent-primary);cursor:pointer;font-size:12px;font-family:Inter,sans-serif;">Done</button><button onclick="cancelCompare()" style="padding:4px 8px;border:none;background:transparent;color:var(--text-secondary);cursor:pointer;font-size:14px;">✕</button>`;
}

// Hook into showMainPanel to intercept clicks during compare mode + a11y
export function interceptShowMainPanel(origShowMainPanel) {
  return function(n){
    state._panelTriggerFocus = document.activeElement;
    if(compareMode && n._hominData){
      const hom=HOMININS.find(h=>h.id===n.id);
      if(hom){
        if(compareSelected.has(hom.id)){
          compareSelected.delete(hom.id);
        } else if(compareSelected.size<4){
          compareSelected.add(hom.id);
        }
        const banner=document.getElementById('compare-banner');
        if(banner) banner.querySelector('span').textContent=`⚖ Compare: ${compareSelected.size} selected (click more or press Done)`;
      }
      return;
    }
    origShowMainPanel(n);
    if(typeof a11yAnnounce==='function') a11yAnnounce(n.name+' - '+t('p_evo'));
    setTimeout(()=>{
      const closeBtn=document.getElementById('panel-close');
      const panel=document.getElementById('panel');
      if(closeBtn&&panel.classList.contains('open')) closeBtn.focus();
    },350);
  };
}

export function finishCompare(){
  if(compareSelected.size>=2){
    showComparePanel();
  }
  const banner=document.getElementById('compare-banner');
  if(banner) banner.classList.remove('visible');
  compareMode=false;
}

export function cancelCompare(){
  compareMode=false;
  compareSelected.clear();
  const banner=document.getElementById('compare-banner');
  if(banner) banner.classList.remove('visible');
}

export function showComparePanel(){
  const cpanel=document.getElementById('compare-panel');
  const grid=document.getElementById('compare-grid');
  const species=Array.from(compareSelected).map(id=>HOMININS.find(h=>h.id===id)).filter(Boolean);
  cpanel.style.display='';
  cpanel.classList.add('compare-panel-open');

  const MAX_B=1750;
  const allBrains=species.map(h=>h.brain[1]||h.brain[0]).filter(Boolean);
  const maxB=allBrains.length?Math.max(...allBrains):MAX_B;

  grid.innerHTML=species.map(h=>{
    const brainMax=h.brain[1]||h.brain[0];
    const brainPct=brainMax?(brainMax/maxB*100):0;
    const nP=h.dna&&h.dna.neanderthal!=null?h.dna.neanderthal:null;
    const dP=h.dna&&h.dna.denisovan!=null?h.dna.denisovan:null;
    return `<div class="compare-card" style="border-color:${h.color}44;">
      <div style="font-size:2rem;margin-bottom:0.5rem" aria-hidden="true">${h.icon}</div>
      <div style="font-family:var(--font-head);font-size:0.95rem;color:${h.color};margin-bottom:0.15rem">${h.short}</div>
      <div class="cc-sub">${h.name}</div>
      <div class="cc-lbl">${t('lbl_timeline')}</div>
      <div class="cc-val">${h.mya[0]}–${h.mya[1]} Ma</div>
      ${brainMax?`
      <div class="cc-lbl">${t('lbl_brain')} — ${brainMax} cm³</div>
      <div class="cc-bar-bg"><div style="height:100%;width:${brainPct}%;background:${h.color};transition:width 0.6s"></div></div>`:`<div class="cc-lbl" style="margin-bottom:0.8rem">${t('lbl_brain')} —</div>`}
      <div class="cc-lbl">${t('lbl_tools')}</div>
      <div class="cc-val">${h.tools}</div>
      <div class="cc-lbl">${t('lbl_fire')}</div>
      <div class="cc-val">${h.fire}</div>
      <div class="cc-lbl">${t('lbl_language')}</div>
      <div class="cc-val">${h.language}</div>
      ${nP!=null?`
      <div class="cc-lbl">${t('lbl_nean')}</div>
      <div class="cc-dna-bg"><div style="height:100%;width:${Math.min(100,nP*25)}%;background:#7A9BAA"></div></div>
      <div class="cc-dna-label" style="color:#7A9BAA">${nP}%</div>`:''}
      ${dP!=null?`
      <div class="cc-lbl">${t('lbl_den')}</div>
      <div class="cc-dna-bg"><div style="height:100%;width:${Math.min(100,dP*20)}%;background:#7A8BAA"></div></div>
      <div class="cc-dna-label" style="color:#7A8BAA">${dP}%</div>`:''}
      <div class="cc-desc">${h.desc.slice(0,200)}${h.desc.length>200?'…':''}</div>
    </div>`;
  }).join('');
}

export function closeCompare(){
  const cpanel=document.getElementById('compare-panel');
  cpanel.classList.remove('compare-panel-open');
  cpanel.style.display='none';
  compareMode=false;
  compareSelected.clear();
}

// ══════════════════════════════════════════════════════
// HOMININ DEEP-DIVE OVERLAY
// ══════════════════════════════════════════════════════

let currentHomFilter='all';
let selectedHominin=null;

export function openHomininOverlay(){
  const view=document.getElementById('hominin-view');
  if(!view) return;
  currentHomFilter='all';
  selectedHominin=null;
  // Reset filter UI
  view.querySelectorAll('.hom-filter').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.filter==='all');
    btn.setAttribute('aria-selected',btn.dataset.filter==='all'?'true':'false');
  });
  // Reset detail panel
  const hp=document.getElementById('hom-panel');
  if(hp) hp.innerHTML='<div class="hp-placeholder">Select a species to explore</div>';
  // Render timeline and open
  renderHominins();
  view.classList.add('open');
}

export function closeHomininOverlay(){
  const view=document.getElementById('hominin-view');
  if(view) view.classList.remove('open');
}

export function renderHominins(){
  const tl=document.getElementById('hom-timeline');
  if(!tl) return;
  const filtered=HOMININS.filter(h=>{
    if(currentHomFilter==='all') return true;
    if(currentHomFilter==='surviving') return h.status==='surviving';
    return h.group===currentHomFilter;
  });
  tl.innerHTML='';
  ERA_GROUPS.forEach(eg=>{
    const items=filtered.filter(eg.filter);
    if(!items.length) return;
    const group=document.createElement('div');group.className='hom-era-group';
    const title=document.createElement('div');title.className='hom-era-title';title.textContent=eg.label;
    group.appendChild(title);
    items.sort((a,b)=>b.mya[0]-a.mya[0]).forEach(h=>{
      const el=document.createElement('div');
      el.className=`hom-species hs-status-${h.status}${selectedHominin===h.id?' selected':''}${compareMode&&compareSelected.has(h.id)?' selected':''}`;
      el.setAttribute('data-hominin-id',h.id);
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
      el.setAttribute('aria-label',`${h.short} — ${h.name}, ${h.mya[0]}–${h.mya[1]} million years ago`);
      const brainMax=h.brain[1]||h.brain[0];
      const brainPct=brainMax?(brainMax/MAX_BRAIN*100):0;
      const hasTools=h.tools&&h.tools!=='None known'&&h.tools!=='None';
      const hasFire=h.fire&&h.fire!=='No';
      const hasLang=h.language&&h.language!=='None';
      el.innerHTML=`
        <div class="hs-icon">${h.icon}</div>
        <div class="hs-info">
          <div class="hs-name">${h.short}</div>
          <div class="hs-latin">${h.name}</div>
          <div class="hs-mya">${h.mya[0]}–${h.mya[1]} Ma</div>
          ${brainMax?`<div class="hs-brain"><div class="brain-bar-wrap"><div class="brain-bar-fill" style="width:${brainPct}%;background:${h.color}"></div></div><span class="brain-label">${brainMax} cm³</span></div>`:''}
          <div class="hs-icons-row">${hasTools?'🔧 Tools':''} ${hasFire?'🔥 Fire':''} ${hasLang?'🗣 Language':''}</div>
          <div class="hs-tags">${(h.tags||[]).slice(0,3).map(tg=>`<span class="hs-tag">${tg}</span>`).join('')}</div>
        </div>`;
      const clickHandler=()=>{
        if(compareMode){toggleCompareSelect(h.id);}
        else{selectedHominin=h.id;renderHominins();showHominDetail(h);}
      };
      el.addEventListener('click',clickHandler);
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();clickHandler();}});
      group.appendChild(el);
    });
    tl.appendChild(group);
  });
}

export function showHominDetail(h){
  const p=document.getElementById('hom-panel');
  if(!p) return;
  const brainMax=h.brain[1]||h.brain[0];
  const neanPct=h.dna&&h.dna.neanderthal!=null?h.dna.neanderthal:null;
  const denPct=h.dna&&h.dna.denisovan!=null?h.dna.denisovan:null;
  p.innerHTML=`
    <div class="hp-accent" style="background:linear-gradient(to right,${h.color},transparent)"></div>
    <div class="hp-top">
      <div class="hp-icon">${h.icon}</div>
      <div>
        <div class="hp-name">${h.short}</div>
        <div class="hp-latin">${h.name}</div>
        <div class="hp-mya">${h.mya[0]}–${h.mya[1]} Ma ago</div>
      </div>
    </div>
    <div class="hp-desc">${h.desc}</div>
    <div class="hp-section">KEY FACTS</div>
    <div class="hp-facts">
      ${brainMax?`<div class="hp-fact"><div class="hp-fact-l">Brain</div><div class="hp-fact-v">${h.brain[0]}–${h.brain[1]} cm³</div></div>`:''}
      ${h.height?`<div class="hp-fact"><div class="hp-fact-l">Height</div><div class="hp-fact-v">${h.height}</div></div>`:''}
      ${h.weight?`<div class="hp-fact"><div class="hp-fact-l">Weight</div><div class="hp-fact-v">${h.weight}</div></div>`:''}
      ${h.habitat?`<div class="hp-fact"><div class="hp-fact-l">Habitat</div><div class="hp-fact-v">${h.habitat}</div></div>`:''}
    </div>
    <div class="hp-section">CAPABILITIES</div>
    <div class="hp-facts">
      <div class="hp-fact"><div class="hp-fact-l">Tools</div><div class="hp-fact-v">${h.tools||'—'}</div></div>
      <div class="hp-fact"><div class="hp-fact-l">Fire</div><div class="hp-fact-v">${h.fire||'—'}</div></div>
      <div class="hp-fact"><div class="hp-fact-l">Language</div><div class="hp-fact-v">${h.language||'—'}</div></div>
    </div>
    ${h.sites?`<div class="hp-section">FOSSIL SITES</div><div class="hp-detail">${h.sites}</div>`:''}
    ${neanPct!=null||denPct!=null?`
    <div class="hp-section">DNA INTROGRESSION</div>
    ${neanPct!=null?`<div class="hp-dna"><span style="font-size:0.7rem;color:var(--text-secondary);width:80px">Neanderthal</span><div class="dna-fill"><div class="dna-fill-inner" style="width:${Math.min(100,neanPct*25)}%;background:#7A9BAA"></div></div><span style="font-size:0.7rem;color:#7A9BAA;font-family:var(--font-mono)">${neanPct}%</span></div>`:''}
    ${denPct!=null?`<div class="hp-dna"><span style="font-size:0.7rem;color:var(--text-secondary);width:80px">Denisovan</span><div class="dna-fill"><div class="dna-fill-inner" style="width:${Math.min(100,denPct*20)}%;background:#7A8BAA"></div></div><span style="font-size:0.7rem;color:#7A8BAA;font-family:var(--font-mono)">${denPct}%</span></div>`:''}
    `:''}
    <div class="hp-detail" style="margin-top:0.8rem">${h.detail||''}</div>
    <div class="hp-tags">${(h.tags||[]).map(tg=>`<span class="hp-tag">${tg}</span>`).join('')}</div>
    <button class="panel-cta" onclick="viewHomininOnTree('${h.id}')" style="margin-top:0.8rem">🌳 View on Tree</button>
  `;
}

function toggleCompareSelect(hId){
  if(compareSelected.has(hId)){
    compareSelected.delete(hId);
  } else if(compareSelected.size<4){
    compareSelected.add(hId);
  }
  const hint=document.getElementById('compare-hint');
  if(hint) hint.textContent=`(${compareSelected.size} selected)`;
  renderHominins();
}

export function toggleCompareMode(){
  compareMode=!compareMode;
  if(!compareMode){
    if(compareSelected.size>=2) showComparePanel();
    compareSelected.clear();
  } else {
    compareSelected.clear();
  }
  const btn=document.getElementById('compare-btn');
  if(btn) btn.classList.toggle('active',compareMode);
  const hint=document.getElementById('compare-hint');
  if(hint) hint.style.display=compareMode?'inline':'none';
  renderHominins();
}

export function viewHomininOnTree(hId){
  // Close the overlay, navigate to the hominin on the tree
  closeHomininOverlay();
  const canonId=canonicalHomininId(hId);
  // Use the global navigateTo which handles expand + zoom + panel
  if(window.navigateTo) window.navigateTo(canonId||hId);
}

export function initHomininOverlay(){
  // Close button
  const closeBtn=document.getElementById('hom-close');
  if(closeBtn) closeBtn.addEventListener('click',closeHomininOverlay);
  // Filter buttons
  document.querySelectorAll('.hom-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.hom-filter').forEach(b=>{
        b.classList.remove('active');
        b.setAttribute('aria-selected','false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      currentHomFilter=btn.dataset.filter;
      renderHominins();
    });
  });
  // Escape key closes overlay
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      const view=document.getElementById('hominin-view');
      if(view&&view.classList.contains('open')){
        e.stopPropagation();
        closeHomininOverlay();
      }
    }
  });
}
