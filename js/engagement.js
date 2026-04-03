// ══════════════════════════════════════════════════════
// ENGAGEMENT — toasts, particles, intro, loading, illustrations,
//              progress tracker, achievements, exploration cue
// ══════════════════════════════════════════════════════

import { state, animDone, nodeMap } from './state.js';
import { reducedMotion } from './utils.js';
import { FACTS } from './factLibrary.js';
import { HOMININS } from './treeData.js';

// ── Late-binding deps (set via initEngagementDeps) ──
let _deps = {};
export function initEngagementDeps(deps) { Object.assign(_deps, deps); }

// ── Fact Toast System ──

const _toastEl = document.getElementById('fact-toast');
const _toastText = document.getElementById('ft-text');
let _toastDismissTimer = null;
let _toastIdleTimer = null;
let _lastUserActivity = Date.now();
const TOAST_IDLE_INTERVAL = 45000;
const TOAST_DISMISS_DELAY = 7000;

export function showToast(factResult) {
  if (!factResult || !_toastEl) return;
  clearTimeout(_toastDismissTimer);
  _toastText.textContent = factResult.text;
  _toastEl.classList.add('visible');
  _toastDismissTimer = setTimeout(dismissToast, TOAST_DISMISS_DELAY);
}

export function dismissToast() {
  if (!_toastEl) return;
  clearTimeout(_toastDismissTimer);
  _toastEl.classList.remove('visible');
}
window.dismissToast = dismissToast;

export function showSpeciesToast(nodeId) {
  // Try species-specific tooltip fact, then panel fact, then general discovery
  const tip = FACTS.getTooltipFact(nodeId, state.currentLang);
  if (tip) { showToast({ text: tip }); return; }
  const pan = FACTS.getPanelFact(nodeId, state.currentLang);
  if (pan) { showToast({ text: pan }); return; }
  const fact = FACTS.getDiscoveryFact(state.currentLang);
  if (fact) showToast(fact);
}

export function showIdleToast() {
  const panel = document.getElementById('panel');
  if (panel.classList.contains('open')) return;
  if (document.getElementById('dna-panel')?.classList.contains('open')) return;
  if (document.getElementById('evo-path-panel')?.classList.contains('open')) return;
  if (document.getElementById('trivia-panel')?.classList.contains('open')) return;
  const splash = document.getElementById('splash');
  if (splash && splash.style.display !== 'none') return;
  if (_toastEl.classList.contains('visible')) return;
  const fact = FACTS.getDiscoveryFact(state.currentLang);
  if (fact) showToast(fact);
}

export function resetIdleTimer() {
  _lastUserActivity = Date.now();
  clearTimeout(_toastIdleTimer);
  _toastIdleTimer = setTimeout(function idleTick() {
    if (Date.now() - _lastUserActivity >= TOAST_IDLE_INTERVAL) showIdleToast();
    _toastIdleTimer = setTimeout(idleTick, TOAST_IDLE_INTERVAL);
  }, TOAST_IDLE_INTERVAL);
}

let _activityThrottle = 0;
export function onUserActivity() {
  const now = Date.now();
  if (now - _activityThrottle < 2000) return;
  _activityThrottle = now;
  resetIdleTimer();
}

// ── Accessibility Announce ──

export function a11yAnnounce(msg){
  const el=document.getElementById('a11y-announce');
  if(el){el.textContent='';requestAnimationFrame(()=>{el.textContent=msg;});}
}

// ── Particles ──

export function spawnParticles(){
  return; // Disabled in modern scientific theme
  const container=document.getElementById('particles');
  for(let i=0;i<22;i++){
    const p=document.createElement('div');
    p.className='particle';
    const sz=1.5+Math.random()*3.5;
    const colors=['rgba(45,212,191,0.4)','rgba(122,184,96,0.4)','rgba(200,136,58,0.3)'];
    p.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;bottom:${Math.random()*25}%;background:${colors[Math.floor(Math.random()*3)]};animation:drift ${9+Math.random()*14}s linear ${Math.random()*12}s infinite;`;
    container.appendChild(p);
  }
}

// ── Intro Animation ──

export function showIntro(){
  // Skip intro if loading a specific node from URL
  if(new URLSearchParams(location.search).get('node')) return;
  const overlay=document.createElement('div');
  overlay.className='intro-overlay';
  const _t = _deps.t || (k=>k);
  overlay.innerHTML=`
    <div style="font-family:'Inter',sans-serif;font-size:clamp(1.8rem,4vw,3rem);color:var(--parchment);text-align:center;letter-spacing:0.05em;opacity:0;transition:opacity 1.5s" id="intro-text1">${_t('title')}</div>
    <div style="font-size:clamp(0.75rem,1.5vw,0.9rem);color:var(--accent-text);text-align:center;letter-spacing:0.25em;text-transform:uppercase;margin-top:0.8rem;opacity:0;transition:opacity 1.5s 0.5s" id="intro-text2">${_t('subtitle')}</div>
    <div style="font-size:0.7rem;color:var(--sage);text-align:center;margin-top:1.5rem;opacity:0;transition:opacity 1.5s 1.2s;font-style:italic" id="intro-text3">${_t('intro_quote')}</div>`;
  document.body.appendChild(overlay);
  if(reducedMotion()){
    overlay.remove();
  } else {
    requestAnimationFrame(()=>{
      document.getElementById('intro-text1').style.opacity='1';
      document.getElementById('intro-text2').style.opacity='1';
      document.getElementById('intro-text3').style.opacity='1';
    });
    setTimeout(()=>{
      overlay.style.transition='opacity 1.2s';overlay.style.opacity='0';
      setTimeout(()=>overlay.remove(),1200);
    },3200);
  }
}

// ── LUCA Opening Animation ──

export function animateTreeEntrance() {
  const allNodes = document.querySelectorAll('.node-circle[data-depth]');
  const allBranches = document.querySelectorAll('path[data-branch]');
  allNodes.forEach(n => {
    n.style.opacity = '0';
    n.style.transform = 'scale(0)';
    n.style.transformOrigin = 'center';
    n.style.transition = 'opacity 400ms ease, transform 400ms ease';
  });
  allBranches.forEach(b => {
    b.style.opacity = '0';
    b.style.transition = 'opacity 300ms ease';
  });
  const depths = [0,1,2,3,4,5];
  depths.forEach((depth,i) => {
    setTimeout(() => {
      document.querySelectorAll(`.node-circle[data-depth="${depth}"]`).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
    }, i * 180);
  });
  setTimeout(() => {
    allBranches.forEach(b => { b.style.opacity = '1'; });
  }, 300);
  // Clean up inline styles after entrance animation completes
  setTimeout(() => {
    allNodes.forEach(n => { n.style.opacity = ''; n.style.transform = ''; n.style.transformOrigin = ''; n.style.transition = ''; });
    allBranches.forEach(b => { b.style.opacity = ''; b.style.transition = ''; });
  }, depths.length * 180 + 400);
}

// ── Loading ──

export function showLoading() {
  /* Tree grows directly inside #splash — no separate loader overlay needed */
  const container = document.getElementById('splash-tree-container');
  if (!container) return null;
  container.innerHTML = `
    <style>
      @keyframes loadBranchGrow{from{stroke-dashoffset:80;opacity:0}to{stroke-dashoffset:0;opacity:1}}
      @keyframes loadNodePulse{from{r:0;opacity:0}to{opacity:1}}
      @keyframes loadNodeGlow{0%,100%{filter:drop-shadow(0 0 2px currentColor)}50%{filter:drop-shadow(0 0 8px currentColor)}}
      .load-branch{stroke-dasharray:80;opacity:0;animation:loadBranchGrow 0.7s ease forwards}
      .load-node{opacity:0;animation:loadNodePulse 0.4s ease forwards}
      .load-leaf{opacity:0;animation:loadNodePulse 0.4s ease forwards, loadNodeGlow 1.5s ease-in-out 3.0s infinite}
    </style>
    <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
      <!-- Stage 1: Root + trunk (0s\u20130.8s) -->
      <circle cx="100" cy="170" r="5" fill="#8b5cf6" class="load-node" style="animation-delay:0s"/>
      <line x1="100" y1="165" x2="100" y2="120" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" class="load-branch" style="animation-delay:0.2s"/>

      <!-- Stage 2: First fork \u2014 2 main branches (0.8s\u20131.8s) -->
      <line x1="100" y1="120" x2="55" y2="85" stroke="#ef4444" stroke-width="2" stroke-linecap="round" class="load-branch" style="animation-delay:0.6s"/>
      <line x1="100" y1="120" x2="145" y2="85" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" class="load-branch" style="animation-delay:0.7s"/>
      <circle cx="55" cy="85" r="4" fill="#ef4444" class="load-node" style="animation-delay:1.0s"/>
      <circle cx="145" cy="85" r="4" fill="#3b82f6" class="load-node" style="animation-delay:1.1s"/>

      <!-- Stage 3: Second fork \u2014 4 sub-branches (1.8s\u20133.0s) -->
      <line x1="55" y1="85" x2="28" y2="52" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" class="load-branch" style="animation-delay:1.4s"/>
      <line x1="55" y1="85" x2="78" y2="52" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" class="load-branch" style="animation-delay:1.5s"/>
      <line x1="145" y1="85" x2="122" y2="52" stroke="#14b8a6" stroke-width="1.5" stroke-linecap="round" class="load-branch" style="animation-delay:1.7s"/>
      <line x1="145" y1="85" x2="172" y2="52" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" class="load-branch" style="animation-delay:1.8s"/>
      <circle cx="28" cy="52" r="3" fill="#22c55e" class="load-node" style="animation-delay:1.9s"/>
      <circle cx="78" cy="52" r="3" fill="#f59e0b" class="load-node" style="animation-delay:2.0s"/>
      <circle cx="122" cy="52" r="3" fill="#14b8a6" class="load-node" style="animation-delay:2.0s"/>
      <circle cx="172" cy="52" r="3" fill="#f97316" class="load-node" style="animation-delay:2.1s"/>

      <!-- Stage 4: Leaf bloom \u2014 8 terminal nodes (3.0s\u20134.2s) -->
      <line x1="28" y1="52" x2="14" y2="25" stroke="#22c55e" stroke-width="1" stroke-linecap="round" class="load-branch" style="animation-delay:2.2s"/>
      <line x1="28" y1="52" x2="42" y2="28" stroke="#10b981" stroke-width="1" stroke-linecap="round" class="load-branch" style="animation-delay:2.3s"/>
      <line x1="78" y1="52" x2="65" y2="25" stroke="#eab308" stroke-width="1" stroke-linecap="round" class="load-branch" style="animation-delay:2.4s"/>
      <line x1="78" y1="52" x2="92" y2="28" stroke="#f59e0b" stroke-width="1" stroke-linecap="round" class="load-branch" style="animation-delay:2.5s"/>
      <line x1="122" y1="52" x2="108" y2="25" stroke="#06b6d4" stroke-width="1" stroke-linecap="round" class="load-branch" style="animation-delay:2.5s"/>
      <line x1="122" y1="52" x2="136" y2="28" stroke="#14b8a6" stroke-width="1" stroke-linecap="round" class="load-branch" style="animation-delay:2.6s"/>
      <line x1="172" y1="52" x2="158" y2="25" stroke="#f97316" stroke-width="1" stroke-linecap="round" class="load-branch" style="animation-delay:2.7s"/>
      <line x1="172" y1="52" x2="186" y2="28" stroke="#a855f7" stroke-width="1" stroke-linecap="round" class="load-branch" style="animation-delay:2.7s"/>
      <circle cx="14" cy="25" r="2.5" fill="#22c55e" class="load-leaf" style="animation-delay:2.8s"/>
      <circle cx="42" cy="28" r="2.5" fill="#10b981" class="load-leaf" style="animation-delay:2.8s"/>
      <circle cx="65" cy="25" r="2.5" fill="#eab308" class="load-leaf" style="animation-delay:2.9s"/>
      <circle cx="92" cy="28" r="2.5" fill="#f59e0b" class="load-leaf" style="animation-delay:2.9s"/>
      <circle cx="108" cy="25" r="2.5" fill="#06b6d4" class="load-leaf" style="animation-delay:3.0s"/>
      <circle cx="136" cy="28" r="2.5" fill="#14b8a6" class="load-leaf" style="animation-delay:3.0s"/>
      <circle cx="158" cy="25" r="2.5" fill="#f97316" class="load-leaf" style="animation-delay:3.0s"/>
      <circle cx="186" cy="28" r="2.5" fill="#a855f7" class="load-leaf" style="animation-delay:3.0s"/>
    </svg>
  `;
  return container;
}

export function hideLoading(loader) {
  /* Tree animation lives inside splash now — no separate loader to remove */
}

// ══════════════════════════════════════════════════════
// PROCEDURAL SPECIES ILLUSTRATION
// ══════════════════════════════════════════════════════

export function generateSpeciesIllustration(node) {
  const id = node.id || '';
  const color = node.color || '#c8883a';
  const icon = node.icon || '\uD83C\uDF3F';
  const c = color;
  // Parse hex or rgb color to components for manipulation
  function hexToRgb(h) {
    if (h.startsWith('rgb')) {
      const m = h.match(/\d+/g); return m ? {r:+m[0],g:+m[1],b:+m[2]} : {r:100,g:150,b:200};
    }
    const hh = h.replace('#','');
    return {r:parseInt(hh.slice(0,2),16),g:parseInt(hh.slice(2,4),16),b:parseInt(hh.slice(4,6),16)};
  }
  function rgba(hex, a) { const {r,g,b} = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }
  function lighten(hex, t) { const {r,g,b} = hexToRgb(hex); return `rgb(${Math.round(r+(255-r)*t)},${Math.round(g+(255-g)*t)},${Math.round(b+(255-b)*t)})`; }
  function darken(hex, t) { const {r,g,b} = hexToRgb(hex); return `rgb(${Math.round(r*(1-t))},${Math.round(g*(1-t))},${Math.round(b*(1-t))})`; }

  // Shared SVG wrapper
  const W=440, H=200;
  function wrap(bg, content) {
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;">
      <defs>
        <radialGradient id="ig_rg" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stop-color="${lighten(c,0.18)}"/>
          <stop offset="100%" stop-color="${darken(c,0.55)}"/>
        </radialGradient>
        <filter id="ig_glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="ig_soft"><feGaussianBlur stdDeviation="2.5"/></filter>
        <filter id="ig_noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n"/><feBlend in="SourceGraphic" in2="n" mode="overlay" result="b"/><feComposite in="b" in2="SourceGraphic" operator="in"/></filter>
      </defs>
      <rect width="${W}" height="${H}" fill="${bg}"/>
      ${content}
    </svg>`;
  }

  // ── Category-specific illustrations ──

  // BACTERIA / MICROBES
  if (['bacteria','cyanobacteria','proteobacteria','firmicutes','actinobacteria',
       'ecoli','helicobacter','vibrio-cholerae','lactobacillus','clostridium-botulinum',
       'streptomyces','mycobacterium-tb','deinococcus','bacteroides','prochlorococcus','nostoc'].includes(id)) {
    const cells = Array.from({length:14},(_,i)=>({
      x: 40+Math.sin(i*1.7)*160+i*22, y: 60+Math.cos(i*1.3)*50+Math.sin(i)*30,
      rx: 6+Math.sin(i*2)*4, ry: 10+Math.cos(i*1.5)*5,
      rot: i*25, op: 0.55+Math.sin(i)*0.35
    }));
    return wrap(darken(c,0.82),
      `<ellipse cx="220" cy="100" rx="200" ry="90" fill="${rgba(c,0.06)}"/>
       ${cells.map(p=>`<ellipse cx="${p.x}" cy="${p.y}" rx="${p.rx}" ry="${p.ry}" fill="${rgba(c,p.op)}" transform="rotate(${p.rot},${p.x},${p.y})" filter="url(#ig_glow)"/>
         <ellipse cx="${p.x}" cy="${p.y}" rx="${p.rx*0.5}" ry="${p.ry*0.5}" fill="${lighten(c,0.5)}" opacity="0.4" transform="rotate(${p.rot},${p.x},${p.y})"/>`).join('')}
       <text x="${W/2}" y="${H-14}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // ARCHAEA
  if (['archaea','halobacterium','sulfolobus','pyrolobus','lokiarchaeota','thermophiles'].includes(id)) {
    const rings = [80,55,35,18];
    return wrap(darken(c,0.85),
      `${rings.map((r,i)=>`<circle cx="${W/2}" cy="${H/2}" r="${r}" fill="none" stroke="${rgba(c,0.18+i*0.12)}" stroke-width="${1.5-i*0.2}" stroke-dasharray="${4+i*3} ${3+i*2}"/>`).join('')}
       <circle cx="${W/2}" cy="${H/2}" r="18" fill="${rgba(c,0.7)}" filter="url(#ig_glow)"/>
       <circle cx="${W/2}" cy="${H/2}" r="9" fill="${lighten(c,0.6)}" opacity="0.9"/>
       ${Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return `<line x1="${W/2+Math.cos(a)*18}" y1="${H/2+Math.sin(a)*18}" x2="${W/2+Math.cos(a)*78}" y2="${H/2+Math.sin(a)*78}" stroke="${rgba(c,0.35)}" stroke-width="1.2"/>`}).join('')}
       ${Array.from({length:18},(_,i)=>{const a=i/18*Math.PI*2; const r2=38+Math.sin(i*2.3)*12; return `<circle cx="${W/2+Math.cos(a)*r2}" cy="${H/2+Math.sin(a)*r2}" r="3.5" fill="${rgba(c,0.6)}" filter="url(#ig_glow)"/>`}).join('')}
       <text x="${W/2}" y="${H-14}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // FUNGI
  if (['fungi','ascomycetes','basidiomycetes','saccharomyces','penicillium',
       'amanita-muscaria','armillaria','psilocybe','chytrids','batrachochytrium'].includes(id)) {
    const stems = Array.from({length:7},(_,i)=>({x:50+i*57, h:40+Math.sin(i*1.4)*30, cap:22+Math.sin(i*0.9)*12}));
    return wrap(darken(c,0.8),
      `<rect x="0" y="${H*0.72}" width="${W}" height="${H*0.28}" fill="${rgba(c,0.1)}"/>
       <line x1="0" y1="${H*0.72}" x2="${W}" y2="${H*0.72}" stroke="${rgba(c,0.25)}" stroke-width="1.5"/>
       ${stems.map(s=>`
         <rect x="${s.x-4}" y="${H*0.72-s.h}" width="7" height="${s.h}" rx="3" fill="${rgba(c,0.5)}"/>
         <ellipse cx="${s.x}" cy="${H*0.72-s.h}" rx="${s.cap}" ry="${s.cap*0.38}" fill="${rgba(c,0.75)}" filter="url(#ig_glow)"/>
         <ellipse cx="${s.x}" cy="${H*0.72-s.h-1}" rx="${s.cap*0.65}" ry="${s.cap*0.22}" fill="${lighten(c,0.35)}" opacity="0.5"/>
       `).join('')}
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // PLANTS — trees, ferns, mosses
  if (['viridiplantae','plantae','angiosperms','gymnosperms','ferns','mosses',
       'liverworts','sunflower','arabidopsis','rafflesia','titan-arum','mimosa',
       'wollemi-pine','welwitschia','sequoia','tree-fern','azolla','sphagnum','marchantia'].includes(id)) {
    const branches = Array.from({length:9},(_,i)=>({
      a: -Math.PI/2 + (i-4)*0.38, len: 55+Math.sin(i*1.1)*25, leaves: 3+Math.floor(i%3)
    }));
    return wrap(darken(c,0.78),
      `<rect x="0" y="${H*0.75}" width="${W}" height="${H*0.25}" fill="${rgba(c,0.08)}"/>
       <rect x="${W/2-5}" y="${H*0.35}" width="9" height="${H*0.4}" rx="4" fill="${darken(c,0.3)}"/>
       ${branches.map(b=>{
         const ex=W/2+Math.cos(b.a)*b.len, ey=H*0.35+Math.sin(b.a)*b.len;
         return `<line x1="${W/2}" y1="${H*0.5}" x2="${ex}" y2="${ey}" stroke="${rgba(c,0.5)}" stroke-width="2.5" stroke-linecap="round"/>
           ${Array.from({length:b.leaves},(_,j)=>{
             const t=0.3+j*0.28;
             const lx=W/2+(ex-W/2)*t, ly=H*0.5+(ey-H*0.5)*t;
             const la=b.a+Math.PI/2+(j%2===0?0.3:-0.3);
             return `<ellipse cx="${lx+Math.cos(la)*11}" cy="${ly+Math.sin(la)*11}" rx="11" ry="6" fill="${rgba(c,0.7)}" transform="rotate(${(b.a*180/Math.PI+90).toFixed(0)},${lx+Math.cos(la)*11},${ly+Math.sin(la)*11})" filter="url(#ig_glow)"/>`;
           }).join('')}`;
       }).join('')}
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // OCEAN / FISH / AQUATIC
  if (['fish','sharks','coelacanth','white-shark','cetaceans','blue-whale'].includes(id)) {
    return wrap(darken(c,0.82),
      `${Array.from({length:6},(_,i)=>`<ellipse cx="${W/2}" cy="${H/2}" rx="${30+i*28}" ry="${14+i*9}" fill="none" stroke="${rgba(c,0.06+i*0.03)}" stroke-width="1"/>`).join('')}
       <path d="M90,${H/2} Q180,${H/2-28} ${W/2},${H/2} Q${W-180},${H/2+28} ${W-90},${H/2}" fill="none" stroke="${rgba(c,0.6)}" stroke-width="3" stroke-linecap="round" filter="url(#ig_glow)"/>
       <path d="M${W-90},${H/2} L${W-60},${H/2-22} L${W-60},${H/2+22} Z" fill="${rgba(c,0.7)}"/>
       <ellipse cx="118" cy="${H/2}" rx="9" ry="6" fill="${lighten(c,0.6)}" opacity="0.85"/>
       ${Array.from({length:18},(_,i)=>{const x=30+i*22, y=H/2+Math.sin(i*0.7+1)*18; return `<circle cx="${x}" cy="${y}" r="1.5" fill="${rgba(c,0.3)}"/>`}).join('')}
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // BIRDS
  if (['birds','aves','archaeopteryx','peregrine-falcon'].includes(id)) {
    return wrap(darken(c,0.82),
      `${Array.from({length:5},(_,i)=>{ const y=H*0.25+i*18; return `<path d="M${W/2-60-i*15},${y} Q${W/2},${y-28-i*4} ${W/2+60+i*15},${y}" fill="none" stroke="${rgba(c,0.15+i*0.1)}" stroke-width="${2.5-i*0.3}"/>`; }).join('')}
       <path d="M${W/2-65},${H*0.35} Q${W/2},${H*0.05} ${W/2+65},${H*0.35}" fill="${rgba(c,0.55)}" filter="url(#ig_glow)"/>
       <path d="M${W/2-65},${H*0.35} Q${W/2},${H*0.22} ${W/2+65},${H*0.35}" fill="${lighten(c,0.25)}" opacity="0.55"/>
       <ellipse cx="${W/2}" cy="${H*0.45}" rx="9" ry="12" fill="${rgba(c,0.8)}"/>
       <ellipse cx="${W/2+4}" cy="${H*0.44}" rx="3.5" ry="3.5" fill="${lighten(c,0.7)}" opacity="0.9"/>
       ${Array.from({length:5},(_,i)=>{ const y=H*0.62+i*7; return `<path d="M${W/2-16},${y} L${W/2},${y-4} L${W/2+16},${y}" fill="${rgba(c,0.25+i*0.06)}" stroke="${rgba(c,0.3)}" stroke-width="0.8"/>`; }).join('')}
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // REPTILES
  if (['reptilia','komodo-dragon','tuatara'].includes(id)) {
    return wrap(darken(c,0.8),
      `<path d="M60,${H*0.55} Q120,${H*0.3} ${W/2},${H*0.45} Q${W-120},${H*0.6} ${W-60},${H*0.5}" fill="${rgba(c,0.45)}" stroke="${rgba(c,0.7)}" stroke-width="2" filter="url(#ig_glow)"/>
       <path d="M60,${H*0.55} Q80,${H*0.5} 100,${H*0.55} Q80,${H*0.65} 60,${H*0.55}" fill="${rgba(c,0.7)}"/>
       ${Array.from({length:24},(_,i)=>{ const t=i/23; const x=60+(W-120)*t; const y=H*0.45+Math.sin(t*Math.PI*2.5)*18; return `<ellipse cx="${x}" cy="${y}" rx="${5+Math.sin(i)*2}" ry="${3.5+Math.cos(i)*1}" fill="${rgba(c,0.45+Math.sin(i*0.7)*0.25)}" transform="rotate(${t*20},${x},${y})"/>`;}).join('')}
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // MOLLUSCS / OCTOPUS / NAUTILUS
  if (['cephalopods','octopus','octopus-day','nautilus'].includes(id)) {
    const arms = 8;
    return wrap(darken(c,0.82),
      `<circle cx="${W/2}" cy="${H/2-5}" r="32" fill="${rgba(c,0.6)}" filter="url(#ig_glow)"/>
       <circle cx="${W/2}" cy="${H/2-5}" r="20" fill="${lighten(c,0.2)}" opacity="0.5"/>
       ${Array.from({length:arms},(_,i)=>{
         const a=(i/arms)*Math.PI*2; const len=62+Math.sin(i*1.3)*18;
         const cx=W/2+Math.cos(a)*18, cy=H/2-5+Math.sin(a)*18;
         const ex=W/2+Math.cos(a)*len, ey=H/2-5+Math.sin(a)*len;
         return `<path d="M${cx},${cy} Q${(cx+ex)/2+Math.cos(a+Math.PI/2)*22},${(cy+ey)/2+Math.sin(a+Math.PI/2)*22} ${ex},${ey}" fill="none" stroke="${rgba(c,0.7)}" stroke-width="5" stroke-linecap="round"/>
           ${Array.from({length:5},(_,j)=>{const t=0.25+j*0.16; const sx=cx+(ex-cx)*t, sy=cy+(ey-cy)*t; return `<circle cx="${sx}" cy="${sy}" r="2.5" fill="${lighten(c,0.5)}" opacity="0.7"/>`;}).join('')}`;
       }).join('')}
       <circle cx="${W/2+11}" cy="${H/2-11}" r="5" fill="${lighten(c,0.8)}" opacity="0.9"/>
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // INSECTS / ARTHROPODS
  if (['arthropoda','insecta','honey-bee','mantis-shrimp','horseshoe-crab'].includes(id)) {
    return wrap(darken(c,0.82),
      `<ellipse cx="${W/2}" cy="${H*0.42}" rx="28" ry="22" fill="${rgba(c,0.7)}" filter="url(#ig_glow)"/>
       <ellipse cx="${W/2}" cy="${H*0.62}" rx="22" ry="17" fill="${rgba(c,0.55)}"/>
       <ellipse cx="${W/2}" cy="${H*0.28}" rx="14" ry="11" fill="${rgba(c,0.65)}"/>
       ${[-1,1].map(side=>Array.from({length:3},(_,i)=>`<path d="M${W/2+side*28},${H*0.35+i*14} Q${W/2+side*(60+i*18)},${H*0.3+i*12} ${W/2+side*(72+i*20)},${H*0.38+i*16}" fill="none" stroke="${rgba(c,0.55)}" stroke-width="1.8" stroke-linecap="round"/>`).join('')).join('')}
       ${[-1,1].map(side=>`<path d="M${W/2+side*11},${H*0.27} Q${W/2+side*22},${H*0.1} ${W/2+side*18},${H*0.12}" fill="none" stroke="${rgba(c,0.6)}" stroke-width="1.5" stroke-linecap="round"/>`).join('')}
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // MAMMALS — generic
  if (['mammalia','mammals','cetaceans','naked-mole-rat','platypus'].includes(id)) {
    return wrap(darken(c,0.8),
      `<ellipse cx="${W/2}" cy="${H*0.55}" rx="80" ry="48" fill="${rgba(c,0.5)}" filter="url(#ig_glow)"/>
       <ellipse cx="${W/2+72}" cy="${H*0.48}" rx="28" ry="22" fill="${rgba(c,0.55)}"/>
       ${[-1,1].map(side=>`<ellipse cx="${W/2+side*22}" cy="${H*0.82}" rx="11" ry="20" fill="${rgba(c,0.45)}" transform="rotate(${side*8},${W/2+side*22},${H*0.82})"/>`).join('')}
       <ellipse cx="${W/2-72}" cy="${H*0.48}" rx="15" ry="10" fill="${rgba(c,0.4)}"/>
       <ellipse cx="${W/2+86}" cy="${H*0.43}" rx="9" ry="6" fill="${lighten(c,0.5)}" opacity="0.8"/>
       <circle cx="${W/2+92}" cy="${H*0.41}" r="3.5" fill="${lighten(c,0.8)}" opacity="0.9"/>
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // PRIMATES / GREAT APES / HUMANS
  if (['primates','great-apes','chimpanzee','gorilla','orangutan','bonobo','hominini','h_sapiens'].includes(id) || (nodeMap[id] && nodeMap[id]._hominin)) {
    return wrap(darken(c,0.78),
      `<ellipse cx="${W/2}" cy="${H*0.38}" rx="38" ry="40" fill="${rgba(c,0.55)}" filter="url(#ig_glow)"/>
       <ellipse cx="${W/2}" cy="${H*0.38}" rx="26" ry="28" fill="${lighten(c,0.15)}" opacity="0.5"/>
       <ellipse cx="${W/2}" cy="${H*0.62}" rx="32" ry="26" fill="${rgba(c,0.45)}"/>
       ${[-1,1].map(side=>[
         `<path d="M${W/2+side*26},${H*0.48} Q${W/2+side*68},${H*0.52} ${W/2+side*72},${H*0.72}" fill="none" stroke="${rgba(c,0.5)}" stroke-width="8" stroke-linecap="round"/>`,
         `<ellipse cx="${W/2+side*26}" cy="${H*0.78}" rx="10" ry="7" fill="${rgba(c,0.45)}" transform="rotate(${side*15},${W/2+side*26},${H*0.78})"/>`
       ].join('')).join('')}
       ${[-1,1].map(side=>`<circle cx="${W/2+side*18}" cy="${H*0.34}" r="7" fill="${lighten(c,0.5)}" opacity="0.75"/>`).join('')}
       <ellipse cx="${W/2}" cy="${H*0.44}" rx="14" ry="8" fill="${rgba(c,0.35)}"/>
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // CNIDARIA / CORAL / JELLYFISH
  if (['cnidaria','turritopsis','coral-reef'].includes(id)) {
    const tendrils = Array.from({length:16},(_,i)=>({a:i/16*Math.PI*2, len:40+Math.sin(i*1.7)*20}));
    return wrap(darken(c,0.82),
      `<ellipse cx="${W/2}" cy="${H*0.38}" rx="42" ry="28" fill="${rgba(c,0.55)}" filter="url(#ig_glow)"/>
       <ellipse cx="${W/2}" cy="${H*0.38}" rx="30" ry="18}" fill="${lighten(c,0.3)}" opacity="0.45"/>
       ${tendrils.map(t=>`<path d="M${W/2+Math.cos(t.a)*40},${H*0.38+Math.sin(t.a)*26} Q${W/2+Math.cos(t.a+0.4)*(t.len+18)},${H*0.38+Math.sin(t.a+0.4)*(t.len+18)} ${W/2+Math.cos(t.a+0.8)*t.len},${H*0.38+28+t.len*0.9}" fill="none" stroke="${rgba(c,0.4)}" stroke-width="1.5" stroke-linecap="round"/>`).join('')}
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // PROTISTS
  if (['protists','alveolates','plasmodium','paramecium','dinoflagellates',
       'diatoms','phytophthora','amoeba','volvox'].includes(id)) {
    return wrap(darken(c,0.82),
      `${Array.from({length:5},(_,i)=>{
        const cx=W/2+Math.sin(i*1.26)*90, cy=H/2+Math.cos(i*0.9)*38;
        const r=14+Math.sin(i*2)*7;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${rgba(c,0.5)}" filter="url(#ig_glow)"/>
          <circle cx="${cx}" cy="${cy}" r="${r*0.55}" fill="${lighten(c,0.4)}" opacity="0.5"/>
          ${Array.from({length:8},(_,j)=>{const a=j/8*Math.PI*2; return `<line x1="${cx+Math.cos(a)*r}" y1="${cy+Math.sin(a)*r}" x2="${cx+Math.cos(a)*(r+12)}" y2="${cy+Math.sin(a)*(r+12)}" stroke="${rgba(c,0.35)}" stroke-width="1.2" stroke-linecap="round"/>`;}).join('')}`;
      }).join('')}
      <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // HOMININS (fossils)
  if (id.startsWith('h-') || id.startsWith('homo-') || id.startsWith('au_') || id.startsWith('au-') ||
      ['sahelanthropus','orrorin','ardipithecus_r','au_afarensis','au_africanus','paranthropus-boisei',
       'paranthropus-robustus','h_habilis','h_erectus','h_heidelbergensis','h_neanderthalensis',
       'h_naledi','h_floresiensis','h_luzonensis','denisovan','homo-naledi','homo-floresiensis'].includes(id)) {
    return wrap(darken(c,0.85),
      `<rect x="0" y="${H*0.72}" width="${W}" height="${H*0.28}" fill="${rgba(c,0.06)}"/>
       <path d="M${W/2-55},${H*0.72} L${W/2-55},${H*0.28} Q${W/2-55},${H*0.08} ${W/2},${H*0.08} Q${W/2+55},${H*0.08} ${W/2+55},${H*0.28} L${W/2+55},${H*0.72} Z" fill="${rgba(c,0.25)}" filter="url(#ig_glow)"/>
       <ellipse cx="${W/2}" cy="${H*0.22}" rx="44" ry="38" fill="${rgba(c,0.45)}" filter="url(#ig_glow)"/>
       <ellipse cx="${W/2}" cy="${H*0.22}" rx="28" ry="22}" fill="${lighten(c,0.2)}" opacity="0.45"/>
       ${[-1,1].map(side=>`<ellipse cx="${W/2+side*20}" cy="${H*0.21}" rx="8" ry="5" fill="${lighten(c,0.55)}" opacity="0.6"/>`).join('')}
       <path d="M${W/2-14},${H*0.3} Q${W/2},${H*0.34} ${W/2+14},${H*0.3}" fill="none" stroke="${rgba(c,0.5)}" stroke-width="2.5" stroke-linecap="round"/>
       ${[H*0.52,H*0.58,H*0.64].map((y,i)=>`<rect x="${W/2-28+i*3}" y="${y}" width="${56-i*6}" height="4" rx="2" fill="${rgba(c,0.3+i*0.08)}"/>`).join('')}
       <line x1="${W/2}" y1="${H*0.68}" x2="${W/2}" y2="${H*0.72}" stroke="${rgba(c,0.4)}" stroke-width="6" stroke-linecap="round"/>
       ${[-1,1].map(side=>`<path d="M${W/2},${H*0.72} L${W/2+side*30},${H*0.72} L${W/2+side*32},${H*0.95}" fill="none" stroke="${rgba(c,0.4)}" stroke-width="5" stroke-linecap="round"/>`).join('')}
       <text x="${W/2}" y="${H-6}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // LUCA / ROOT
  if (id === 'luca') {
    return wrap('#050302',
      `${Array.from({length:7},(_,i)=>`<circle cx="${W/2}" cy="${H/2}" r="${22+i*18}" fill="none" stroke="${rgba(c,0.04+i*0.035)}" stroke-width="${1.5-i*0.15}"/>`).join('')}
       <circle cx="${W/2}" cy="${H/2}" r="22" fill="url(#ig_rg)" filter="url(#ig_glow)"/>
       ${Array.from({length:24},(_,i)=>{const a=i/24*Math.PI*2; const r1=22, r2=28+Math.sin(i*3)*6; return `<line x1="${W/2+Math.cos(a)*r1}" y1="${H/2+Math.sin(a)*r1}" x2="${W/2+Math.cos(a)*r2}" y2="${H/2+Math.sin(a)*r2}" stroke="${rgba(c,0.5)}" stroke-width="1.5"/>`}).join('')}
       ${Array.from({length:6},(_,i)=>{const a=i/6*Math.PI*2; return Array.from({length:3},(_,j)=>{const r=45+j*22; const bx=W/2+Math.cos(a)*r, by=H/2+Math.sin(a)*r; return `<circle cx="${bx}" cy="${by}" r="${4-j*0.8}" fill="${rgba(c,0.45-j*0.1)}" filter="url(#ig_glow)"/><line x1="${W/2+Math.cos(a)*(r-12)}" y1="${H/2+Math.sin(a)*(r-12)}" x2="${bx}" y2="${by}" stroke="${rgba(c,0.2)}" stroke-width="0.8"/>`;}).join('');}).join('')}
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.6)}" letter-spacing="3">Last Universal Common Ancestor</text>`
    );
  }

  // EUKARYOTA / METAZOA / broad groups
  if (['eukaryota','metazoa','chordata','amphibia','porifera','echinodermata'].includes(id)) {
    const pts = Array.from({length:20},(_,i)=>({ x:W/2+Math.cos(i/20*Math.PI*2)*(100+Math.sin(i*3)*20), y:H/2+Math.sin(i/20*Math.PI*2)*(70+Math.cos(i*2.5)*15) }));
    return wrap(darken(c,0.82),
      `<polygon points="${pts.map(p=>`${p.x},${p.y}`).join(' ')}" fill="${rgba(c,0.12)}" stroke="${rgba(c,0.3)}" stroke-width="1.5" filter="url(#ig_soft)"/>
       ${Array.from({length:5},(_,i)=>`<circle cx="${pts[i*4].x}" cy="${pts[i*4].y}" r="${6+i*2}" fill="${rgba(c,0.55+i*0.06)}" filter="url(#ig_glow)"/>`).join('')}
       <circle cx="${W/2}" cy="${H/2}" r="18" fill="${rgba(c,0.7)}" filter="url(#ig_glow)"/>
       <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.55)}" letter-spacing="2">${node.latin||node.name}</text>`
    );
  }

  // DEFAULT — elegant radial burst
  const spokes = Array.from({length:16},(_,i)=>{ const a=i/16*Math.PI*2; const r=55+Math.sin(i*2.3)*25; return {x:W/2+Math.cos(a)*r, y:H/2+Math.sin(a)*r, a}; });
  return wrap(darken(c,0.82),
    `${spokes.map(s=>`<line x1="${W/2}" y1="${H/2}" x2="${s.x}" y2="${s.y}" stroke="${rgba(c,0.18)}" stroke-width="1.2"/>`).join('')}
     ${spokes.map(s=>`<circle cx="${s.x}" cy="${s.y}" r="${4+Math.random()*3}" fill="${rgba(c,0.5)}" filter="url(#ig_glow)"/>`).join('')}
     ${Array.from({length:3},(_,i)=>`<circle cx="${W/2}" cy="${H/2}" r="${14+i*16}" fill="none" stroke="${rgba(c,0.14+i*0.06)}" stroke-width="1.2"/>`).join('')}
     <circle cx="${W/2}" cy="${H/2}" r="14" fill="${rgba(c,0.75)}" filter="url(#ig_glow)"/>
     <text x="${W/2}" y="${H*0.85}" text-anchor="middle" font-family="'Inter',sans-serif" font-size="${Math.min(16,220/Math.max(node.name.length,1))}px" fill="${lighten(c,0.55)}" font-weight="600" opacity="0.9">${icon} ${node.name}</text>
     <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Inter',sans-serif" font-style="italic" font-size="11" fill="${rgba(c,0.5)}" letter-spacing="2">${node.latin||''}</text>`
  );
}

// ══════════════════════════════════════════════════════
// PROGRESS TRACKER & ACHIEVEMENTS
// ══════════════════════════════════════════════════════

const EXPLORED_KEY = 'tol-explored';
const ACHIEVE_KEY  = 'tol-achievements';
const TRACK_KEY    = 'tol-engage-track';

let _explored    = new Set(JSON.parse(localStorage.getItem(EXPLORED_KEY) || '[]'));
let _achievements = new Set(JSON.parse(localStorage.getItem(ACHIEVE_KEY) || '[]'));
let _tracking    = JSON.parse(localStorage.getItem(TRACK_KEY) || '{}');
if (!_tracking.extinctionsClicked) _tracking.extinctionsClicked = [];
if (!_tracking.dnaCompares) _tracking.dnaCompares = 0;
if (!_tracking.domainsToggled) _tracking.domainsToggled = [];
if (!_tracking.viewModes) _tracking.viewModes = [];

const ACHIEVEMENTS = [
  { id:'first_steps',        name:'First Steps',         icon:'\uD83D\uDC63', desc:'Explore your first species' },
  { id:'curious_mind',       name:'Curious Mind',        icon:'\uD83D\uDD0D', desc:'Explore 10 species' },
  { id:'explorer',           name:'Explorer',            icon:'\uD83E\uDDED', desc:'Explore 50 species' },
  { id:'completionist',      name:'Completionist',       icon:'\uD83C\uDFC6', desc:'Explore every species in the tree' },
  { id:'primatologist',      name:'Primatologist',       icon:'\uD83D\uDC12', desc:'Explore all primate species' },
  { id:'deep_time',          name:'Deep Time Traveler',  icon:'\u231B',       desc:'Travel back to the origin of life' },
  { id:'extinction_witness', name:'Extinction Witness',  icon:'\uD83D\uDC80', desc:'Visit all 5 mass extinction events' },
  { id:'dna_wizard',         name:'DNA Wizard',          icon:'\uD83E\uDDEC', desc:'Compare 5 DNA pairs' },
  { id:'quiz_champion',      name:'Quiz Champion',       icon:'\uD83C\uDF93', desc:'Score 100% on a quiz' },
  { id:'night_owl',          name:'Night Owl',           icon:'\uD83C\uDF19', desc:'Toggle dark mode' },
  { id:'domain_master',      name:'Domain Master',       icon:'\uD83D\uDD2C', desc:'Filter each domain individually' },
  { id:'view_master',        name:'View Master',         icon:'\uD83D\uDC41\uFE0F', desc:'Use all 3 view modes' },
];

function _saveExplored() { localStorage.setItem(EXPLORED_KEY, JSON.stringify([..._explored])); }
function _saveAchievements() { localStorage.setItem(ACHIEVE_KEY, JSON.stringify([..._achievements])); }
function _saveTracking() { localStorage.setItem(TRACK_KEY, JSON.stringify(_tracking)); }

export function updateProgressBadge() {
  const countEl = document.getElementById('progress-count');
  const totalEl = document.getElementById('progress-total');
  if (countEl) countEl.textContent = _explored.size;
  if (totalEl) totalEl.textContent = Object.keys(nodeMap).length;
}

export function markExplored(nodeId) {
  if (!nodeId) return;
  const wasNew = !_explored.has(nodeId);
  _explored.add(nodeId);
  if (wasNew) {
    _saveExplored();
    updateProgressBadge();
    const badge = document.getElementById('progress-badge');
    if (badge) { badge.classList.remove('pulse'); void badge.offsetWidth; badge.classList.add('pulse'); }
    _checkExplorationAchievements();
  }
}

export function isExplored(id) { return _explored.has(id); }

function _checkExplorationAchievements() {
  const count = _explored.size;
  const total = Object.keys(nodeMap).length;
  if (count >= 1)  _unlock('first_steps');
  if (count >= 10) _unlock('curious_mind');
  if (count >= 50) _unlock('explorer');
  if (count >= total && total > 0) _unlock('completionist');
  // Primatologist: check all primate subtree nodes
  const primatesNode = nodeMap['primates'];
  if (primatesNode) {
    const ids = [];
    (function collect(n) { ids.push(n.id); if (n.children) n.children.forEach(collect); })(primatesNode);
    if (ids.length > 0 && ids.every(id => _explored.has(id))) _unlock('primatologist');
  }
}

export function checkAchievement(id) { _unlock(id); }

function _unlock(id) {
  if (_achievements.has(id)) return;
  _achievements.add(id);
  _saveAchievements();
  const def = ACHIEVEMENTS.find(a => a.id === id);
  if (def) _showAchievementToast(def);
}

function _showAchievementToast(def) {
  const container = document.getElementById('achievement-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `<span class="at-icon">${def.icon}</span><div class="at-body"><div class="at-title">Achievement Unlocked!</div><div class="at-name">${def.name}</div><div class="at-desc">${def.desc}</div></div>`;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3200);
}

export function trackDomainToggle(domain) {
  if (!_tracking.domainsToggled.includes(domain)) { _tracking.domainsToggled.push(domain); _saveTracking(); }
  if (_tracking.domainsToggled.length >= 6) _unlock('domain_master');
}

export function trackViewMode(mode) {
  if (mode === 'playback') return;
  if (!_tracking.viewModes.includes(mode)) { _tracking.viewModes.push(mode); _saveTracking(); }
  if (_tracking.viewModes.length >= 3) _unlock('view_master');
}

export function trackExtinctionClick(mya) {
  if (!_tracking.extinctionsClicked.includes(mya)) { _tracking.extinctionsClicked.push(mya); _saveTracking(); }
  if (_tracking.extinctionsClicked.length >= 5) _unlock('extinction_witness');
}

export function trackDnaCompare() {
  _tracking.dnaCompares = (_tracking.dnaCompares || 0) + 1;
  _saveTracking();
  if (_tracking.dnaCompares >= 5) _unlock('dna_wizard');
}
