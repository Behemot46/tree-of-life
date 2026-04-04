// ══════════════════════════════════════════════════════
// MINIMAP — overview of full tree in corner
// ══════════════════════════════════════════════════════

import { state } from './state.js';
import { getVisible, getVisibleEdges } from './layout.js';
import { TREE } from './data.js';

const minimapEl=document.getElementById('minimap');
const minimapSvg=document.getElementById('minimap-svg');
let _fadeTimer=null;

export function renderMinimap(){
  if(!minimapEl||!minimapSvg) return;
  if(window.innerWidth<768) return;

  const nodes=getVisible(TREE);
  const edges=getVisibleEdges(TREE);
  if(nodes.length===0) return;

  const xs=nodes.map(n=>n._x),ys=nodes.map(n=>n._y);
  const minX=Math.min(...xs),maxX=Math.max(...xs);
  const minY=Math.min(...ys),maxY=Math.max(...ys);
  const pad=40;
  const bw=(maxX-minX)||200,bh=(maxY-minY)||200;
  minimapSvg.setAttribute('viewBox',`${minX-pad} ${minY-pad} ${bw+pad*2} ${bh+pad*2}`);

  let html='';

  edges.forEach(({from,to})=>{
    if(to._domain&&to._domain!=='luca'&&!state.activeDomains.has(to._domain)) return;
    html+=`<line x1="${from._x}" y1="${from._y}" x2="${to._x}" y2="${to._y}" stroke="${to.color}" stroke-width="0.5" opacity="0.3"/>`;
  });

  nodes.forEach(n=>{
    if(n._domain&&n._domain!=='luca'&&!state.activeDomains.has(n._domain)) return;
    html+=`<circle cx="${n._x}" cy="${n._y}" r="2" fill="${n.color}" opacity="0.6"/>`;
  });

  const s=state.transform.s;
  const vx=(0-state.transform.x)/s;
  const vy=(0-state.transform.y)/s;
  const vw=window.innerWidth/s;
  const vh=window.innerHeight/s;
  html+=`<rect class="minimap-viewport" x="${vx}" y="${vy}" width="${vw}" height="${vh}"/>`;

  minimapSvg.innerHTML=html;
  showMinimap();
}

function showMinimap(){
  if(!minimapEl) return;
  minimapEl.classList.remove('faded');
  clearTimeout(_fadeTimer);
  _fadeTimer=setTimeout(()=>{minimapEl.classList.add('faded');},3000);
}

export function onMinimapInteraction(){showMinimap();}
