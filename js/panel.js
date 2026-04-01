// ══════════════════════════════════════════════════════
// PANEL — info panel, navigation, zoom/pan, search UI, hominin view,
//         compare mode, DNA calculator, tooltip, keyboard, mobile
// ══════════════════════════════════════════════════════

// ── DOM REFS ──
const panel=document.getElementById('panel');
const panelAccent=document.getElementById('panel-accent');

// ── Unified Navigation Stack ──
const navStack=[];
function currentNavState(){
  const homView=document.getElementById('hominin-view');
  const isHomOpen=homView&&homView.classList.contains('open');
  if(isHomOpen&&selectedHominin) return {type:'hominin-detail',homininId:selectedHominin};
  if(isHomOpen) return {type:'hominin'};
  if(currentPanelNode) return {type:'panel',nodeId:currentPanelNode.id};
  return {type:'tree'};
}
function pushNav(){
  const s=currentNavState();
  if(navStack.length>0){
    const top=navStack[navStack.length-1];
    if(top.type===s.type&&top.nodeId===s.nodeId&&top.homininId===s.homininId) return;
  }
  navStack.push(s);
  if(navStack.length>30) navStack.shift();
  updateNavButtons();
}
function restoreNavState(s){
  const homView=document.getElementById('hominin-view');
  if(homView) homView.classList.remove('open');
  panel.classList.remove('open');
  currentPanelNode=null;
  panelHistory=[];

  if(s.type==='tree'){
    updateBreadcrumb(null);
  } else if(s.type==='panel'){
    const node=getNodeById(s.nodeId);
    if(node){
      currentPanelNode=node;
      renderPanelContent(node);
      panel.classList.add('open');
      updateBreadcrumb(node);
    }
  } else if(s.type==='hominin'){
    homView.classList.add('open');
    selectedHominin=null;
    renderHominins();
  } else if(s.type==='hominin-detail'){
    homView.classList.add('open');
    selectedHominin=s.homininId;
    renderHominins();
    const hom=HOMININS.find(h=>h.id===s.homininId);
    if(hom) showHominDetail(hom);
  }
}
function navBack(){
  if(navStack.length===0) return;
  const prev=navStack.pop();
  restoreNavState(prev);
  updateNavButtons();
}
function navHome(){
  navStack.length=0;
  panelHistory=[];
  currentPanelNode=null;
  const homView=document.getElementById('hominin-view');
  if(homView) homView.classList.remove('open');
  panel.classList.remove('open');
  updateBreadcrumb(null);
  transform={x:0,y:0,s:1};applyT();
  history.replaceState(null,'',location.pathname);
  updateNavButtons();
}
function updateNavButtons(){
  const ctrl=document.getElementById('nav-ctrl');
  if(!ctrl) return;
  const backBtn=document.getElementById('nav-back');
  if(navStack.length>0){
    ctrl.classList.add('visible');
    if(backBtn) backBtn.disabled=false;
  } else {
    const s=currentNavState();
    if(s.type!=='tree'){
      ctrl.classList.add('visible');
      if(backBtn) backBtn.disabled=true;
    } else {
      ctrl.classList.remove('visible');
    }
  }
}

// ══════════════════════════════════════════════════════
// SPECIES ILLUSTRATION (SVG)
// ══════════════════════════════════════════════════════
function generateSpeciesIllustration(node) {
  const id = node.id || '';
  const color = node.color || '#0ea5e9';
  const icon = node.icon || '🌿';
  const c = color;
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

  // PLANTS
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
  if (['primates','great-apes','chimpanzee','gorilla','orangutan','hominini','h_sapiens'].includes(id) || (nodeMap[id] && nodeMap[id]._hominin)) {
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

// ── Photo cache + Wikipedia photo fetcher ──
window._photoCache = window._photoCache || {};
window._failedPhotos = window._failedPhotos || new Set();

async function fetchWikiPhoto(nodeId, wikiTitle, imgEl, fallbackEl, creditEl) {
  const cacheKey = nodeId;
  if (window._failedPhotos.has(cacheKey)) return;
  if (window._photoCache[cacheKey]) {
    const cached = window._photoCache[cacheKey];
    imgEl.src = cached.url;
    imgEl.style.display = 'block';
    if (fallbackEl) fallbackEl.style.display = 'none';
    if (creditEl && cached.credit) creditEl.textContent = cached.credit;
    return;
  }
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const thumb = data.thumbnail;
    if (thumb && thumb.source) {
      const url = thumb.source.replace(/\/\d+px-/, '/640px-');
      window._photoCache[cacheKey] = { url, credit: 'Wikipedia / Wikimedia Commons' };
      imgEl.src = url;
      imgEl.style.display = 'block';
      if (fallbackEl) fallbackEl.style.display = 'none';
      if (creditEl) creditEl.textContent = 'Wikipedia / Wikimedia Commons';
    } else {
      throw new Error('No thumbnail');
    }
  } catch(e) {
    window._failedPhotos.add(cacheKey);
  }
}

// ── J18 Panel helpers ──

function leafDividerHtml() {
  return `<div class="panel-leaf-divider"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="1.5"><path d="M12 2C6.5 6 4 12 4 18c0 1 .5 2 1.5 2.5C8 19 10 14 12 10c2 4 4 9 6.5 10.5 1-.5 1.5-1.5 1.5-2.5 0-6-2.5-12-8-16z"/></svg></div>`;
}

function sectionHdrHtml(label) {
  return `<div class="panel-orn-hdr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="1.5"><path d="M12 2L9 7H3l5 4-2 7 6-4 6 4-2-7 5-4h-6z"/></svg><span>${label}</span></div>`;
}

function renderStatBars(nodeId) {
  const stats = (typeof SPECIES_STATS !== 'undefined') && SPECIES_STATS[nodeId];
  if (!stats) return '';
  const names = ['size','speed','intelligence','sociality','adaptability','danger'];
  const labels = {size:'Size',speed:'Speed',intelligence:'Intelligence',sociality:'Sociality',adaptability:'Adaptability',danger:'Danger'};
  let html = '';
  if (stats.archetype) {
    html += `<div class="panel-section"><span class="stat-archetype">${stats.archetype}</span></div>`;
  }
  html += `<div class="panel-section">${sectionHdrHtml('STATS')}<div class="stat-bar-group">`;
  for (const name of names) {
    const v = (stats.stats && stats.stats[name]) || 0;
    html += `<div class="stat-bar"><span class="stat-bar-label">${labels[name]}</span><div class="stat-bar-track"><div class="stat-bar-fill" data-width="${v*10}%" style="width:0%"></div></div><span class="stat-bar-value">${v}</span></div>`;
  }
  html += `</div></div>`;
  return html;
}

function renderStrengthsWeaknesses(nodeId) {
  const stats = (typeof SPECIES_STATS !== 'undefined') && SPECIES_STATS[nodeId];
  if (!stats) return '';
  const s = stats.strengths || [];
  const w = stats.weaknesses || [];
  if (!s.length && !w.length) return '';
  let html = `<div class="panel-section">${sectionHdrHtml('STRENGTHS & WEAKNESSES')}<div class="sw-grid">`;
  for (const item of s) {
    html += `<div class="sw-card strength"><div class="sw-card-icon">${item.icon}</div><div class="sw-card-label">${item.label}</div><div class="sw-card-desc">${item.desc}</div></div>`;
  }
  for (const item of w) {
    html += `<div class="sw-card weakness"><div class="sw-card-icon">${item.icon}</div><div class="sw-card-label">${item.label}</div><div class="sw-card-desc">${item.desc}</div></div>`;
  }
  html += `</div></div>`;
  return html;
}

function renderRangeMinimap(nodeId) {
  if (typeof CONTINENT_PATHS === 'undefined' || typeof GEO_DATA === 'undefined') return '';
  const geo = GEO_DATA[nodeId];
  if (!geo) return '';
  const regions = geo.regions || [];
  const isWorldwide = regions.includes('worldwide');
  const isMarine = regions.some(r => r.startsWith('marine-'));

  // Determine which continents to highlight
  const highlighted = new Set();
  const dots = [];
  for (const r of regions) {
    if (r === 'worldwide') {
      Object.keys(CONTINENT_PATHS).forEach(c => highlighted.add(c));
    } else if (typeof REGION_TO_CONTINENT !== 'undefined' && REGION_TO_CONTINENT[r]) {
      highlighted.add(REGION_TO_CONTINENT[r]);
    }
    if (typeof REGION_CENTROIDS !== 'undefined' && REGION_CENTROIDS[r]) {
      dots.push(REGION_CENTROIDS[r]);
    }
  }

  let svg = `<svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Range map: ${geo.label}">`;
  if (isMarine) {
    svg += `<rect x="0" y="0" width="360" height="180" class="range-ocean-highlight" rx="4"/>`;
  }
  for (const [name, path] of Object.entries(CONTINENT_PATHS)) {
    svg += `<path d="${path}" class="range-continent${highlighted.has(name) ? ' highlighted' : ''}"/>`;
  }
  for (const [cx, cy] of dots) {
    svg += `<circle cx="${cx}" cy="${cy}" r="3" class="range-dot"/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="3" class="range-dot-pulse"/>`;
  }
  svg += `</svg>`;

  return `<div class="panel-section"><div class="range-minimap">${svg}</div><div class="range-caption">${geo.label}</div></div>`;
}

function renderIUCNDetail(node) {
  if (!node.iucn || node.iucn === 'NE') return '';
  const codes = ['EX','EW','CR','EN','VU','NT','LC'];
  const names = {EX:'Extinct',EW:'Extinct Wild',CR:'Critical',EN:'Endangered',VU:'Vulnerable',NT:'Near Threat.',LC:'Least Concern'};
  let html = `<div class="panel-section">${sectionHdrHtml('CONSERVATION STATUS')}<div class="iucn-scale">`;
  for (const c of codes) {
    html += `<div class="iucn-seg iucn-seg-${c}${c === node.iucn ? ' active' : ''}">${c}</div>`;
  }
  html += `</div>`;
  if (names[node.iucn]) {
    html += `<div class="iucn-label">${names[node.iucn]}</div>`;
  }
  html += `</div>`;
  return html;
}

function renderHomininData(node) {
  const h = node._hominData;
  if (!h) return '';
  const brainMax = h.brain && (h.brain[1] || h.brain[0]);
  const neanPct = h.dna && h.dna.neanderthal != null ? h.dna.neanderthal : null;
  const denPct = h.dna && h.dna.denisovan != null ? h.dna.denisovan : null;
  let html = '';
  if (brainMax) {
    html += `<div class="panel-section">${sectionHdrHtml('BRAIN VOLUME')}<div class="panel-bar-wrap"><div class="panel-bar-track"><div class="panel-bar-fill" style="width:${Math.round(brainMax / 1750 * 100)}%;background:${h.color};"></div></div><span class="panel-bar-label">${brainMax} cm\u00B3</span></div></div>`;
  }
  const hasTools = h.tools && h.tools !== 'None known' && h.tools !== 'None';
  const hasFire = h.fire && h.fire !== 'No';
  const hasLang = h.language && h.language !== 'None';
  if (hasTools || hasFire || hasLang) {
    html += `<div class="panel-section panel-cap-row">`;
    if (hasTools) html += `<span>\u{1FAA8} ${h.tools}</span>`;
    if (hasFire) html += `<span>\u{1F525} ${h.fire}</span>`;
    if (hasLang) html += `<span>\u{1F5E3}\uFE0F ${h.language}</span>`;
    html += `</div>`;
  }
  if (neanPct != null || denPct != null) {
    html += `<div class="panel-section">${sectionHdrHtml('DNA LEGACY')}`;
    if (neanPct != null) html += `<div class="panel-bar-wrap" style="margin-bottom:6px"><span class="stat-bar-label" style="min-width:80px">Neanderthal</span><div class="panel-bar-track"><div class="panel-bar-fill" style="width:${Math.min(100, neanPct * 25)}%;background:#7A9BAA;"></div></div><span class="panel-bar-label">${neanPct}%</span></div>`;
    if (denPct != null) html += `<div class="panel-bar-wrap"><span class="stat-bar-label" style="min-width:80px">Denisovan</span><div class="panel-bar-track"><div class="panel-bar-fill" style="width:${Math.min(100, denPct * 20)}%;background:#7A8BAA;"></div></div><span class="panel-bar-label">${denPct}%</span></div>`;
    if (h.dna && h.dna.note) html += `<div style="font-size:11px;color:var(--text-muted);font-style:italic;margin-top:4px;">${h.dna.note}</div>`;
    html += `</div>`;
  }
  if (h.sites && h.sites.length) {
    html += `<div class="panel-section">${sectionHdrHtml('FOSSIL SITES')}<div class="panel-sites">${h.sites.join(' \u00B7 ')}</div></div>`;
  }
  return html;
}

function animateStatBars(container) {
  if (!container) return;
  const fills = container.querySelectorAll('.stat-bar-fill[data-width]');
  fills.forEach(el => { el.style.width = '0%'; });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fills.forEach(el => { el.style.width = el.dataset.width; });
    });
  });
}

function initPanelTabs(panelEl) {
  const tabs = panelEl.querySelectorAll('.panel-tab');
  const contents = panelEl.querySelectorAll('.panel-tab-content');
  const body = panelEl.querySelector('.panel-body');

  function activateTab(tabName) {
    tabs.forEach(t => {
      const isActive = t.dataset.tab === tabName;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.tabIndex = isActive ? 0 : -1;
    });
    contents.forEach(c => {
      const isActive = c.dataset.tab === tabName;
      c.classList.toggle('active', isActive);
      if (isActive) {
        // Retrigger stagger animation
        const sections = c.querySelectorAll('.panel-section');
        sections.forEach(s => {
          s.style.animation = 'none';
          s.offsetHeight; // force reflow
          s.style.animation = '';
        });
        // Animate stat bars if switching to stats tab
        if (tabName === 'stats') animateStatBars(c);
      }
    });
    if (body) body.scrollTop = 0;
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => activateTab(t.dataset.tab));
  });

  // Keyboard nav for tabs
  const tabBar = panelEl.querySelector('.panel-tabs');
  if (tabBar) {
    tabBar.addEventListener('keydown', e => {
      const visible = Array.from(tabs).filter(t => t.style.display !== 'none');
      const idx = visible.indexOf(document.activeElement);
      if (idx < 0) return;
      let next = -1;
      if (e.key === 'ArrowRight') next = (idx + 1) % visible.length;
      else if (e.key === 'ArrowLeft') next = (idx - 1 + visible.length) % visible.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = visible.length - 1;
      if (next >= 0) {
        e.preventDefault();
        visible[next].focus();
        activateTab(visible[next].dataset.tab);
      }
    });
  }
}

// ── Panel rendering ──
function renderPanelContent(node) {
  const p = document.getElementById('panel') || document.getElementById('info-panel');
  if (!p) return;

  // Merge ENRICHMENT data without mutating TREE node
  const n = Object.assign({}, node);
  if (typeof ENRICHMENT !== 'undefined' && ENRICHMENT[n.id]) {
    const enrich = ENRICHMENT[n.id];
    if (enrich.altFacts && !n.altFacts) n.altFacts = enrich.altFacts;
    if (enrich.links && !n.links) n.links = enrich.links;
  }

  // Image setup (preserved from original)
  const photoEntry = PHOTO_MAP[n.id];
  const generatedUrl = (typeof ImageLoader !== 'undefined') ? ImageLoader.getGeneratedUrl(n.id) : null;
  let staticUrl = generatedUrl || (photoEntry && photoEntry.url) || n.img || null;
  const staticCredit = generatedUrl ? 'AI-generated illustration' : (photoEntry && photoEntry.credit) || n.imgCredit || null;
  const wikiTitle = WIKI_TITLES[n.id] || null;
  if (staticUrl && window._failedPhotos && window._failedPhotos.has('static:' + n.id)) {
    staticUrl = null;
  }
  const safeId = n.id.replace(/[^a-z0-9]/g, '_');
  const panelImgId = 'panel-species-img-' + safeId;
  const panelFbId = 'panel-species-fb-' + safeId;
  const panelCrId = 'panel-species-cr-' + safeId;

  // Feature flags
  const hasStats = (typeof SPECIES_STATS !== 'undefined') && SPECIES_STATS[n.id];
  const hasGeo = (typeof GEO_DATA !== 'undefined') && GEO_DATA[n.id];
  const hasBranch = (typeof BRANCH_DATA !== 'undefined') && BRANCH_DATA[n.id];
  const isHominin = n._hominData || n.id === 'hominini' || (n.id && n.id.startsWith('hom-'));

  // Lineage badge
  const GREAT_APE_IDS = ['great-apes','gorilla','orangutan','chimpanzee','homo-sapiens'];
  const HOMININ_IDS = ['homo-sapiens','h_erectus','h_habilis','h_neanderthalensis','h_heidelbergensis','h_floresiensis','h_naledi','h_luzonensis','denisovan','au_afarensis','au_africanus','sahelanthropus','ardipithecus_r'];
  const isHumanLineage = HOMININ_IDS.includes(n.id) || (n.tags && (n.tags.includes('Hominin') || n.tags.includes('Human evolution')));
  const isGreatApe = GREAT_APE_IDS.includes(n.id);
  let lineageBadge = '';
  if (isHumanLineage) lineageBadge = '<span class="panel-lineage-badge human">\u{1F9EC} Human Lineage</span>';
  else if (isGreatApe) lineageBadge = '<span class="panel-lineage-badge ape">\u{1F98D} Great Apes</span>';

  // Extinct badge
  const extinctBadge = n.extinct ? '<span class="badge-extinct">\u2020 EXTINCT</span>' : '';

  // IUCN badge (compact, for overview header)
  let iucnBadge = '';
  if (n.iucn && n.iucn !== 'NE') {
    const iucnMap = {EX:{bg:'#000'},EW:{bg:'#542344'},CR:{bg:'#d32f2f'},EN:{bg:'#e65100'},VU:{bg:'#f9a825'},NT:{bg:'#7cb342'},LC:{bg:'#388e3c'},DD:{bg:'#757575'}};
    const info = iucnMap[n.iucn];
    if (info) {
      const tc = ['VU','NT'].includes(n.iucn) ? '#000' : '#fff';
      iucnBadge = `<span style="background:${info.bg};color:${tc};font-size:10px;padding:2px 8px;border-radius:9999px;font-family:Inter,sans-serif;font-weight:600;letter-spacing:0.05em;">IUCN: ${n.iucn}</span>`;
    }
  }

  // ── BRANCH DATA cards (for ecology/evolution tabs) ──
  let branchEcoHtml = '';
  let branchEvoHtml = '';
  if (hasBranch) {
    const bd = BRANCH_DATA[n.id];
    const ecoFields = [
      {key:'size',icon:'\u{1F4CF}',label:'Size'},
      {key:'diet',icon:'\u{1F37D}\uFE0F',label:'Diet'},
      {key:'lifespan',icon:'\u{23F3}',label:'Lifespan'},
      {key:'conservation',icon:'\u{1F6E1}\uFE0F',label:'Conservation'},
      {key:'habitat',icon:'\u{1F3DE}\uFE0F',label:'Habitat'},
      {key:'substrate',icon:'\u{1F33F}',label:'Substrate'},
      {key:'symbiosis',icon:'\u{1F91D}',label:'Symbiosis'},
      {key:'edibility',icon:'\u{1F344}',label:'Edibility'},
      {key:'dispersal',icon:'\u{1F4A8}',label:'Dispersal'}
    ];
    const evoFields = [
      {key:'cellType',icon:'\u{1F52C}',label:'Cell Type'},
      {key:'metabolism',icon:'\u{26A1}',label:'Metabolism'},
      {key:'relevance',icon:'\u{2B50}',label:'Significance'},
      {key:'ability',icon:'\u{1F4AB}',label:'Key Ability'}
    ];
    for (const f of ecoFields) {
      if (bd[f.key]) branchEcoHtml += `<div class="eco-card"><div class="eco-card-icon">${f.icon}</div><div><div class="eco-card-label">${f.label}</div><div class="eco-card-value">${bd[f.key]}</div></div></div>`;
    }
    for (const f of evoFields) {
      if (bd[f.key]) branchEvoHtml += `<div class="eco-card"><div class="eco-card-icon">${f.icon}</div><div><div class="eco-card-label">${f.label}</div><div class="eco-card-value">${bd[f.key]}</div></div></div>`;
    }
  }

  // ── LINEAGE PATH (evolution tab) ──
  let lineagePathHtml = '';
  if (typeof getAncestors === 'function') {
    const ancestors = getAncestors(node);
    if (ancestors.length > 1) {
      lineagePathHtml = `<div class="panel-section">${sectionHdrHtml('LINEAGE')}<div class="lineage-path">`;
      for (let i = 0; i < ancestors.length; i++) {
        const a = ancestors[i];
        const isCurrent = i === ancestors.length - 1;
        lineagePathHtml += `<div class="lineage-step${isCurrent ? ' current' : ''}">${a.name}${a.appeared ? ' <span style="font-family:var(--font-mono);font-size:0.625rem;opacity:0.6;">' + a.appeared + ' Mya</span>' : ''}</div>`;
      }
      lineagePathHtml += `</div></div>`;
    }
  }

  // ══════════════════════════════════════════════════════
  // BUILD HTML
  // ══════════════════════════════════════════════════════

  p.innerHTML = `
    <div class="panel-hero" style="background:var(--surface-raised);">
      <img id="${panelImgId}" class="panel-hero-img${staticUrl ? ' loaded' : ''}" src="${staticUrl || ''}" alt="${n.name}"
        style="${staticUrl ? '' : 'display:none;'}"
        onerror="(function(el){
          if(typeof ImageLoader!=='undefined'&&el.dataset.source==='generated'){
            if(!el.dataset.triedAlt){
              el.dataset.triedAlt='1';
              var altUrl=ImageLoader.getAlternateGeneratedUrl('${n.id}',el.src);
              if(altUrl){el.src=altUrl;return;}
            }
            ImageLoader.markFailed('${n.id}');
            var fb=${photoEntry ? `'${(photoEntry.url || '').replace(/'/g, "\\'")}'` : 'null'}||'${(n.img || '').replace(/'/g, "\\'")}';
            if(fb){el.dataset.source='fallback';el.src=fb;return;}
          }
          (window._failedPhotos||(window._failedPhotos=new Set())).add('static:${n.id}');
          el.style.display='none';document.getElementById('${panelFbId}').style.display='flex';
        })(this);"
        data-source="${generatedUrl ? 'generated' : 'static'}"
      />
      <div id="${panelFbId}" class="panel-hero-fallback" style="display:${staticUrl ? 'none' : 'flex'};">${n.icon || '\u{1F33F}'}</div>
      <div class="panel-hero-gradient"></div>
      <div id="${panelCrId}" class="panel-hero-credit" style="display:flex;align-items:center;gap:4px;">${generatedUrl ? '<span style="background:rgba(139,92,246,0.7);color:white;font-size:8px;font-weight:700;padding:1px 4px;border-radius:2px;letter-spacing:0.05em;">AI</span>' : ''}${staticCredit || ''}</div>
      <button class="p-close" onclick="closePanel()" aria-label="Close">\u2715</button>
    </div>

    <div class="panel-tabs" role="tablist" aria-label="Species information tabs">
      <button class="panel-tab active" data-tab="overview" role="tab" aria-selected="true" aria-controls="ptab-overview" tabindex="0">Overview</button>
      <button class="panel-tab" data-tab="stats" role="tab" aria-selected="false" aria-controls="ptab-stats" tabindex="-1" style="${hasStats ? '' : 'display:none'}">Stats</button>
      <button class="panel-tab" data-tab="ecology" role="tab" aria-selected="false" aria-controls="ptab-ecology" tabindex="-1">Ecology</button>
      <button class="panel-tab" data-tab="evolution" role="tab" aria-selected="false" aria-controls="ptab-evolution" tabindex="-1">Evolution</button>
    </div>

    <div class="panel-body" style="overflow-y:auto;flex:1;padding:0 var(--sp-4);">

      <!-- ── OVERVIEW TAB ── -->
      <div class="panel-tab-content active" data-tab="overview" id="ptab-overview" role="tabpanel" aria-labelledby="ptab-overview">
        <div class="panel-section">
          ${lineageBadge ? `<div style="margin-bottom:6px">${lineageBadge}</div>` : ''}
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <h2 class="panel-node-name">${n.name}</h2>
            ${extinctBadge}
            ${iucnBadge}
          </div>
          ${n.latin ? `<div class="panel-latin">${n.latin}</div>` : ''}
          ${n.era ? `<div class="panel-era-info">\u{1F4C5} ${n.era}${n.appeared ? ' \u00B7 ' + n.appeared + ' Mya' : ''}</div>` : ''}
        </div>

        ${n.desc ? `<div class="panel-section"><p class="panel-desc">${n.desc}</p></div>` : ''}

        ${n.funFact ? `<div class="panel-section"><div class="panel-funfact"><div class="panel-funfact-label">\u{1F4A1} DID YOU KNOW</div><p class="panel-funfact-text">${n.funFact}</p></div></div>` : ''}

        ${n.tags && n.tags.length ? `<div class="panel-section">${sectionHdrHtml('KEY TRAITS')}<div class="panel-tags">${n.tags.map(t => `<span class="panel-tag">${t}</span>`).join('')}</div></div>` : ''}

        ${n.tipFact ? `<div class="panel-section"><div class="panel-tip">\u{1F33F} ${n.tipFact}</div></div>` : ''}
      </div>

      <!-- ── STATS TAB ── -->
      <div class="panel-tab-content" data-tab="stats" id="ptab-stats" role="tabpanel" aria-labelledby="ptab-stats">
        ${renderStatBars(n.id)}
        ${leafDividerHtml()}
        ${renderStrengthsWeaknesses(n.id)}
        ${n.facts && n.facts.length ? `<div class="panel-section">${sectionHdrHtml('KEY DATA')}<div class="panel-facts-grid">${n.facts.map(f => `<div class="panel-fact-card"><div class="panel-fact-label">${f.l}</div><div class="panel-fact-value">${f.v}</div></div>`).join('')}</div></div>` : ''}
      </div>

      <!-- ── ECOLOGY TAB ── -->
      <div class="panel-tab-content" data-tab="ecology" id="ptab-ecology" role="tabpanel" aria-labelledby="ptab-ecology">
        ${renderRangeMinimap(n.id)}
        ${branchEcoHtml ? `<div class="panel-section">${sectionHdrHtml('ECOLOGY')}<div style="display:flex;flex-direction:column;gap:var(--sp-2);">${branchEcoHtml}</div></div>` : ''}
        ${renderIUCNDetail(n)}
        ${n.altFacts && n.altFacts.length ? `<div class="panel-section">${sectionHdrHtml('DID YOU KNOW?')}<div style="display:flex;flex-direction:column;gap:6px;">${n.altFacts.map(f => `<div class="panel-enrich-card">${f}</div>`).join('')}</div></div>` : ''}
        ${n.links && n.links.length ? `<div class="panel-section">${sectionHdrHtml('LEARN MORE')}<div style="display:flex;flex-wrap:wrap;gap:6px;">${n.links.map(lnk => `<a href="${lnk.url}" target="_blank" rel="noopener noreferrer" class="panel-link-pill">\u2197 ${lnk.label}</a>`).join('')}</div></div>` : ''}
      </div>

      <!-- ── EVOLUTION TAB ── -->
      <div class="panel-tab-content" data-tab="evolution" id="ptab-evolution" role="tabpanel" aria-labelledby="ptab-evolution">
        ${n.appeared ? `<div class="panel-section"><div class="eco-card"><div class="eco-card-icon">\u{23F3}</div><div><div class="eco-card-label">Appeared</div><div class="eco-card-value">${n.appeared} million years ago${n.era ? ' \u00B7 ' + n.era : ''}</div></div></div></div>` : ''}
        ${lineagePathHtml}
        ${n.detail ? `<div class="panel-section">${sectionHdrHtml('EVOLUTIONARY DETAIL')}<p class="panel-detail">${n.detail}</p></div>` : ''}
        ${branchEvoHtml ? `<div class="panel-section">${sectionHdrHtml('BIOLOGY')}<div style="display:flex;flex-direction:column;gap:var(--sp-2);">${branchEvoHtml}</div></div>` : ''}
        ${renderHomininData(node)}
        ${isHominin ? `<div class="panel-section"><button onclick="openHomininView()" class="panel-btn-primary">\u{1F9EC} Hominin Deep Dive</button></div>` : ''}
      </div>

      <button onclick="closePanel()" class="panel-btn-close">Close</button>
    </div>
  `;

  // Back button
  if (panelHistory.length > 0) {
    const body = p.querySelector('.panel-body');
    if (body) {
      const backBtn = document.createElement('button');
      backBtn.textContent = '\u2190 Back';
      backBtn.onclick = panelBack;
      backBtn.className = 'btn-back';
      backBtn.style.marginBottom = '4px';
      backBtn.style.marginTop = 'var(--sp-3)';
      body.insertBefore(backBtn, body.firstChild);
    }
  }

  // Initialize tabs
  initPanelTabs(p);

  // Animate stat bars on initial load if stats tab is visible
  if (hasStats) {
    const statsContent = p.querySelector('[data-tab="stats"].panel-tab-content');
    // Stat bars start at 0 width; they animate when the user clicks the Stats tab
  }

  // Wiki photo fetch (preserved)
  if (wikiTitle) {
    const imgEl = document.getElementById(panelImgId);
    const fbEl = document.getElementById(panelFbId);
    const crEl = document.getElementById(panelCrId);
    if (imgEl && fbEl) {
      fetchWikiPhoto(n.id, wikiTitle, imgEl, fbEl, crEl);
    }
  }
}

function openHominins(nodeId) {
  const canonId = canonicalHomininId(nodeId);
  const treeNode = nodeMap[canonId] || nodeMap[nodeId];
  if(treeNode){
    navigateTo(treeNode.id);
    return;
  }
  const homininiNode = nodeMap['hominini'];
  if(homininiNode){
    navigateTo('hominini');
  }
}
function showMainPanel(n){
  pushNav();
  if(currentPanelNode && currentPanelNode.id !== n.id){
    panelHistory.push(currentPanelNode);
    if(panelHistory.length>20) panelHistory.shift();
  }
  currentPanelNode=n;
  renderPanelContent(n);
  panel.classList.add('panel-enter');
  panel.classList.add('open');
  requestAnimationFrame(() => {
    panel.classList.remove('panel-enter');
    panel.style.opacity = '1';
    panel.style.transform = '';
  });
  updateBreadcrumb(n);
  updateNavButtons();
}

function panelBack(){
  if(panelHistory.length===0) return;
  const prev=panelHistory.pop();
  currentPanelNode=prev;
  renderPanelContent(prev);
  updateBreadcrumb(prev);
}

function closePanel(){
  const p=document.getElementById('panel')||document.getElementById('info-panel');
  if(p){p.classList.remove('open');p.style.transform='';p.style.transition='';}
  updateBreadcrumb(null);panelHistory=[];currentPanelNode=null;
  history.replaceState(null,'',location.pathname);
  updateNavButtons();
}
// Close panel via event delegation (panel-close element is dynamically created)
const _panelCloseEl = document.getElementById('panel-close');
if (_panelCloseEl) _panelCloseEl.addEventListener('click', closePanel);
document.getElementById('svg').addEventListener('click',closePanel);

// ══════════════════════════════════════════════════════
// BREADCRUMB
// ══════════════════════════════════════════════════════
function getAncestors(n){const path=[];let c=n;while(c){path.unshift(c);c=c._parent;}return path;}

function focusNode(id) {
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
  if (node) showMainPanel(node);
}
function updateBreadcrumb(n){
  const bc=document.getElementById('breadcrumb');
  const path=getAncestors(n);
  if(path.length<=1){bc.classList.add('hidden');return;}
  bc.classList.remove('hidden');
  bc.innerHTML=path.map((p,i)=>{
    const isLast=i===path.length-1;
    return `<span class="bc-item ${isLast?'active':''}" onclick="${isLast?'':`showMainPanel(getNodeById('${p.id}'))`}">${p.icon} ${p.name}</span>${isLast?'':'<span class="bc-sep">›</span>'}`;
  }).join('');
}

// ══════════════════════════════════════════════════════
// TOOLTIP
// ══════════════════════════════════════════════════════
const tooltipEl = document.getElementById('tooltip');
document.addEventListener('mousemove', function(e) {
  if (tooltipEl.classList.contains('visible')) {
    tooltipEl.style.left = e.clientX + 'px';
    tooltipEl.style.top = e.clientY + 'px';
  }
});
function showTip(text, icon) {
  clearTimeout(_tipTimer);
  tooltipEl.innerHTML = (icon ? icon + ' ' : '') + text;
  tooltipEl.classList.add('visible');
}
function hideTip() {
  clearTimeout(_tipTimer);
  _tipTimer = setTimeout(() => {
    tooltipEl.classList.remove('visible');
  }, 80);
}

// ══════════════════════════════════════════════════════
// SEARCH UI
// ══════════════════════════════════════════════════════
const searchInput=document.getElementById('search-input');
const searchResults=document.getElementById('search-results');
const allNodes=Object.values(nodeMap);

searchInput.addEventListener('input',()=>{
  const q=searchInput.value.trim();
  if(!q){
    searchResults.innerHTML=`
      <div style="padding:16px;text-align:center;font-family:'Inter',sans-serif;">
        <div style="font-size:24px;margin-bottom:8px;">🔍</div>
        <div style="font-size:13px;color:var(--color-text-muted);">${t('search_hint')}</div>
      </div>
    `;
    searchResults.style.display='block';
    searchResults.classList.add('show');
    searchInput.setAttribute('aria-expanded','true');
    return;
  }
  const matches=searchEntities(q);
  const lang=currentLang;
  searchResults.innerHTML=matches.map(m=>{
    const lookupId=m.homId||m.id;
    const i18nEntry=TAXON_I18N[lookupId];
    const localName=(lang!=='en'&&i18nEntry&&i18nEntry[lang])?i18nEntry[lang]:null;
    const displayName=localName||m.name;
    const subName=localName?m.name:'';
    const eraText=m.era?m.era.replace('~','').split(' ').slice(0,3).join(' '):'';
    return `<div class="sr-item" role="option" tabindex="-1" onclick="navigateTo('${m.id}')"><span class="sri-icon" aria-hidden="true">${m.icon}</span><span class="sri-name">${displayName}${subName?' <span style="font-size:0.8em;opacity:0.55;font-style:italic">'+subName+'</span>':''}</span><span class="sri-sub">${eraText}</span></div>`;
  }).join('');
  if(!matches.length){
    searchResults.innerHTML=`<div style="padding:16px;text-align:center;font-size:13px;color:var(--color-text-muted);font-family:'Heebo',sans-serif;">${t('search_no_results')}</div>`;
    searchResults.classList.add('show');
  } else {
    searchResults.classList.add('show');
  }
  searchInput.setAttribute('aria-expanded',matches.length>0?'true':'false');
});
searchInput.addEventListener('blur',()=>setTimeout(()=>{searchResults.classList.remove('show');searchInput.setAttribute('aria-expanded','false');},200));

window.navigateTo=function(id){
  searchInput.value='';searchResults.classList.remove('show');searchInput.setAttribute('aria-expanded','false');
  if(id.startsWith('hom:')){
    const homId=id.slice(4);
    const canonId=canonicalHomininId(homId);
    if(nodeMap[canonId]){
      id=canonId;
    } else if(nodeMap[homId]){
      id=homId;
    } else {
      if(homId === 'h_sapiens') id = 'homo-sapiens';
    }
  }
  const n=nodeMap[id];if(!n)return;
  highlightedId=id;
  let c=n;while(c._parent){c._parent._collapsed=false;c=c._parent;}
  layout();scheduleRender(true);applyT();
  const cx=window.innerWidth/2,cy=window.innerHeight/2;
  transform.x=cx-n._x*transform.s;
  transform.y=cy-n._y*transform.s;
  applyT();
  showMainPanel(n);
  history.replaceState(null,'','?node='+encodeURIComponent(id));
  setTimeout(()=>{highlightedId=null;scheduleRender();},2500);
};

// ══════════════════════════════════════════════════════
// HOMININ VIEW
// ══════════════════════════════════════════════════════
window.openHomininView=function(){
  // Expand hominini and its child groups on the main tree, then zoom to them
  const hom = nodeMap['hominini'];
  if (!hom) return;
  // Expand ancestors so hominini is visible
  let cur = hom._parent;
  while (cur) { cur._collapsed = false; cur = cur._parent; }
  // Expand hominini and its 4 group nodes
  hom._collapsed = false;
  if (hom.children) hom.children.forEach(g => { g._collapsed = false; });
  // Close any open panel
  panel.classList.remove('open');
  // Re-layout and render
  layout();
  // Zoom centered on hominini node at a readable scale
  const s = 0.7;
  transform = { x: window.innerWidth / 2 - hom._x * s, y: window.innerHeight / 2 - hom._y * s, s };
  scheduleRender(true); applyT();
};
document.getElementById('hom-close').addEventListener('click',()=>{
  document.getElementById('hominin-view').classList.remove('open');
  updateNavButtons();
});

// ── Nav button click handlers ──
document.getElementById('nav-back').addEventListener('click',navBack);
document.getElementById('nav-home').addEventListener('click',navHome);

document.querySelectorAll('.hom-filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.hom-filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentHomFilter=btn.dataset.filter;
    renderHominins();
  });
});

function renderHominins(){
  const tl=document.getElementById('hom-timeline');
  const filtered=HOMININS.filter(h=>{
    if(currentHomFilter==='all')return true;
    if(currentHomFilter==='surviving')return h.status==='surviving';
    return h.group===currentHomFilter;
  });
  tl.innerHTML='';
  ERA_GROUPS.forEach(eg=>{
    const items=filtered.filter(eg.filter);
    if(!items.length)return;
    const group=document.createElement('div');group.className='hom-era-group';
    const title=document.createElement('div');title.className='hom-era-title';title.textContent=eg.label;
    group.appendChild(title);
    items.sort((a,b)=>b.mya[0]-a.mya[0]).forEach(h=>{
      const el=document.createElement('div');
      el.className=`hom-species hs-status-${h.status}${selectedHominin===h.id?' selected':''}${compareMode&&compareSelected.has(h.id)?' selected':''}`;
      el.setAttribute('data-hominin-id', h.id);
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
          <div class="hs-icons-row">${hasTools?t('cap_tools'):''} ${hasFire?t('cap_fire'):''} ${hasLang?t('cap_lang'):''}</div>
          <div class="hs-tags">${(h.tags||[]).slice(0,3).map(t=>`<span class="hs-tag">${t}</span>`).join('')}</div>
        </div>`;
      el.addEventListener('click',()=>{
        if(compareMode){toggleCompareSelect(h.id);}
        else{pushNav();selectedHominin=h.id;renderHominins();showHominDetail(h);updateNavButtons();}
      });
      group.appendChild(el);
    });
    tl.appendChild(group);
  });
}

function showHominDetail(h){
  const p=document.getElementById('hom-panel');
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
    <div class="hp-facts">
      ${(h.facts||[]).map(f=>`<div class="hp-fact"><div class="hp-fact-l">${f.l}</div><div class="hp-fact-v">${f.v}</div></div>`).join('')}
    </div>
    ${neanPct!=null||denPct!=null?`
    <div class="hp-section">${t('sec_dna')}</div>
    ${neanPct!=null?`<div class="hp-dna"><span style="font-size:0.65rem;min-width:80px;color:var(--gold-text)">${t('lbl_nean').replace(' DNA','')}</span><div class="dna-fill"><div class="dna-fill-inner" style="width:${Math.min(100,neanPct*25)}%;background:#7A9BAA"></div></div><span style="font-size:0.65rem;color:#7A9BAA;min-width:28px;text-align:right">${neanPct}%</span></div>`:''}
    ${denPct!=null?`<div class="hp-dna"><span style="font-size:0.65rem;min-width:80px;color:var(--gold-text)">${t('lbl_den').replace(' DNA','')}</span><div class="dna-fill"><div class="dna-fill-inner" style="width:${Math.min(100,denPct*20)}%;background:#7A8BAA"></div></div><span style="font-size:0.65rem;color:#7A8BAA;min-width:28px;text-align:right">${denPct}%</span></div>`:''}
    <div style="font-size:0.65rem;color:var(--gold-text-dim);margin-top:0.3rem;font-style:italic">${h.dna.note||''}</div>`:''}
    <div class="hp-section">${t('sec_evo')}</div>
    <div class="hp-detail">${h.detail||''}</div>
    <div class="hp-section">${t('sec_traits')}</div>
    <div class="hp-tags">${(h.tags||[]).map(tag=>`<span class="hp-tag">${tag}</span>`).join('')}</div>
    <div style="margin-top:0.8rem;font-size:0.65rem;color:var(--gold-text-dim);letter-spacing:0.1em">${t('sec_fossil')}</div>
    <div style="font-size:0.75rem;color:var(--text-dim);margin-top:0.3rem;line-height:1.7">${(h.sites||[]).join(' · ')}</div>`;
}

// ══════════════════════════════════════════════════════
// PAN & ZOOM
// ══════════════════════════════════════════════════════
const svgEl=document.getElementById('svg');
svgEl.style.touchAction="none";
let isPointerPanning=false;
let pointerStart={x:0,y:0};
let transformStart={x:0,y:0};
const activePointers=new Map();
let pinchGesture=null;
svgEl.addEventListener("pointerdown",e=>{
  if(e.pointerType==="mouse" && e.button!==0) return;
  activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(activePointers.size===1){
    isPointerPanning=true;
    pointerStart={x:e.clientX,y:e.clientY};
    transformStart={...transform};
  }
});
svgEl.addEventListener("pointermove",e=>{
  if(!activePointers.has(e.pointerId)) return;
  activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(activePointers.size===1 && isPointerPanning){
    transform.x=transformStart.x+(e.clientX-pointerStart.x);
    transform.y=transformStart.y+(e.clientY-pointerStart.y);
    applyT();
  }
});
svgEl.addEventListener("pointerup",e=>{
  activePointers.delete(e.pointerId);
  if(activePointers.size===0){
    isPointerPanning=false;
  }
});
svgEl.addEventListener('wheel',e=>{e.preventDefault();const f=e.deltaY<0?1.13:0.88;const rect=svgEl.getBoundingClientRect();const mx=e.clientX-rect.left,my=e.clientY-rect.top;const ns=Math.min(6,Math.max(0.12,transform.s*f));transform.x=mx-(mx-transform.x)*(ns/transform.s);transform.y=my-(my-transform.y)*(ns/transform.s);transform.s=ns;applyT();},{passive:false});
document.getElementById('btn-in').addEventListener('click',()=>{transform.s=Math.min(6,transform.s*1.2);applyT();});
document.getElementById('btn-out').addEventListener('click',()=>{transform.s=Math.max(0.12,transform.s*0.83);applyT();});
document.getElementById('btn-reset').addEventListener('click',()=>{transform={x:0,y:0,s:1};applyT();});

// ══════════════════════════════════════════════════════
// COMPARE MODE
// ══════════════════════════════════════════════════════
function toggleCompareMode(){
  compareMode=!compareMode;
  compareSelected.clear();
  const btn=document.getElementById('compare-btn');
  const hint=document.getElementById('compare-hint');
  if(compareMode){
    btn.style.borderColor='var(--accent-primary)';
    btn.style.color='var(--accent-primary)';
    btn.style.background='var(--accent-primary-dim)';
    hint.style.display='inline';
  } else {
    btn.style.borderColor='var(--border)';
    btn.style.color='var(--text-secondary)';
    btn.style.background='transparent';
    hint.style.display='none';
    renderHominins();
  }
  renderHominins();
}

function toggleCompareSelect(hId){
  if(compareSelected.has(hId)){
    compareSelected.delete(hId);
  } else if(compareSelected.size<4){
    compareSelected.add(hId);
  }
  renderHominins();
  if(compareSelected.size>=2){
    showComparePanel();
  }
}

function showComparePanel(){
  const panel=document.getElementById('compare-panel');
  const grid=document.getElementById('compare-grid');
  const species=Array.from(compareSelected).map(id=>HOMININS.find(h=>h.id===id)).filter(Boolean);
  panel.style.display='flex';
  panel.style.flexDirection='column';

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

function closeCompare(){
  document.getElementById('compare-panel').style.display='none';
}

// ══════════════════════════════════════════════════════
// DNA SIMILARITY CALCULATOR
// ══════════════════════════════════════════════════════
function openDnaCalc() {
  dnaSlotA = null;
  dnaSlotB = null;
  dnaSearchTarget = null;
  resetDnaUI();
  const panel = document.getElementById('dna-panel');
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

function closeDnaCalc() {
  const panel = document.getElementById('dna-panel');
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  document.getElementById('dna-search-overlay').style.display = 'none';
}

function resetDnaUI() {
  const selectText = t('dna_select_species') || 'Select a species';
  document.getElementById('dna-icon-a').textContent = '?';
  document.getElementById('dna-label-a').textContent = selectText;
  document.getElementById('dna-icon-b').textContent = '?';
  document.getElementById('dna-label-b').textContent = selectText;
  document.getElementById('dna-slot-a').classList.remove('filled');
  document.getElementById('dna-slot-b').classList.remove('filled');
  document.getElementById('dna-results').style.display = 'none';
  document.getElementById('dna-search-overlay').style.display = 'none';
}

function openDnaSearch(slot) {
  dnaSearchTarget = slot;
  const overlay = document.getElementById('dna-search-overlay');
  overlay.style.display = 'block';
  const input = document.getElementById('dna-search-input');
  input.value = '';
  input.placeholder = t('dna_search_placeholder') || 'Search species...';
  input.focus();
  document.getElementById('dna-search-results').innerHTML = '';
}

document.getElementById('dna-search-input').addEventListener('input', function() {
  const q = this.value.trim();
  const container = document.getElementById('dna-search-results');
  if (q.length < 1) { container.innerHTML = ''; return; }
  const matches = searchEntities(q).slice(0, 12);
  container.innerHTML = matches.map(m => {
    const node = nodeMap[m.id];
    const icon = node ? node.icon : m.icon || '🔬';
    const name = m.name || (node && node.name) || m.id;
    const latin = m.latin || (node && node.latin) || '';
    return `<div class="dna-search-item" onclick="selectDnaSpecies('${m.id}')">
      <span class="dna-search-item-icon">${icon}</span>
      <span class="dna-search-item-name">${name}</span>
      <span class="dna-search-item-latin">${latin}</span>
    </div>`;
  }).join('');
});

function selectDnaSpecies(id) {
  const node = nodeMap[id];
  if (!node) return;
  const data = { id: node.id, name: node.name, icon: node.icon };
  if (dnaSearchTarget === 'a') {
    dnaSlotA = data;
    document.getElementById('dna-icon-a').textContent = data.icon;
    document.getElementById('dna-label-a').textContent = data.name;
    document.getElementById('dna-slot-a').classList.add('filled');
  } else {
    dnaSlotB = data;
    document.getElementById('dna-icon-b').textContent = data.icon;
    document.getElementById('dna-label-b').textContent = data.name;
    document.getElementById('dna-slot-b').classList.add('filled');
  }
  document.getElementById('dna-search-overlay').style.display = 'none';
  if (dnaSlotA && dnaSlotB) {
    showDnaResults();
  }
}

function dnaPreset(idA, idB) {
  const nodeA = nodeMap[idA];
  const nodeB = nodeMap[idB];
  if (!nodeA || !nodeB) return;
  dnaSlotA = { id: nodeA.id, name: nodeA.name, icon: nodeA.icon };
  dnaSlotB = { id: nodeB.id, name: nodeB.name, icon: nodeB.icon };
  document.getElementById('dna-icon-a').textContent = nodeA.icon;
  document.getElementById('dna-label-a').textContent = nodeA.name;
  document.getElementById('dna-slot-a').classList.add('filled');
  document.getElementById('dna-icon-b').textContent = nodeB.icon;
  document.getElementById('dna-label-b').textContent = nodeB.name;
  document.getElementById('dna-slot-b').classList.add('filled');
  document.getElementById('dna-search-overlay').style.display = 'none';
  showDnaResults();
}

function showDnaResults() {
  if (!dnaSlotA || !dnaSlotB) return;
  const nodeA = nodeMap[dnaSlotA.id];
  const nodeB = nodeMap[dnaSlotB.id];
  const result = estimateDnaSimilarity(nodeA, nodeB);
  if (!result) return;

  const resultsEl = document.getElementById('dna-results');
  resultsEl.style.display = 'block';

  const percentEl = document.getElementById('dna-percent');
  animateCounter(percentEl, result.percent);

  setTimeout(() => {
    document.getElementById('dna-bar-fill').style.width = result.percent + '%';
  }, 100);

  const divEl = document.getElementById('dna-divergence');
  if (result.divergenceMya != null) {
    const tmpl = t('dna_divergence') || 'Diverged ~{mya} million years ago';
    divEl.textContent = tmpl.replace('{mya}', result.divergenceMya.toLocaleString());
  } else {
    divEl.textContent = '';
  }

  const badge = document.getElementById('dna-method-badge');
  badge.className = 'dna-method-badge ' + result.method;
  if (result.method === 'known') {
    badge.textContent = t('dna_method_known') || 'Published data';
  } else if (result.method === 'estimated') {
    badge.textContent = t('dna_method_estimated') || 'Estimated from phylogeny';
  } else {
    badge.textContent = result.method;
  }

  const sourceEl = document.getElementById('dna-source');
  sourceEl.textContent = result.source ? 'Source: ' + result.source : '';

  const ancEl = document.getElementById('dna-ancestor');
  if (result.lca) {
    const label = t('dna_shared_ancestor') || 'Shared ancestor';
    ancEl.innerHTML = label + ': <a onclick="closeDnaCalc();navigateTo(\'' + result.lca.id + '\');setTimeout(()=>showMainPanel(nodeMap[\'' + result.lca.id + '\']),300)">' + result.lca.name + '</a>';
  } else {
    ancEl.textContent = '';
  }

  const factEl = document.getElementById('dna-fun-fact');
  const fact = getDnaFunFact(result.percent, dnaSlotB.name);
  factEl.textContent = result.note || fact;
}

function animateCounter(el, target) {
  const duration = 800;
  const start = performance.now();
  const from = 0;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (target - from) * eased;
    el.textContent = current.toFixed(1);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.getElementById('dna-panel').addEventListener('click', function(e) {
  if (e.target === this) closeDnaCalc();
});

// ══════════════════════════════════════════════════════
// RANDOM SPECIES
// ══════════════════════════════════════════════════════
document.getElementById('btn-random').addEventListener('click',()=>{
  const allNodes=Object.values(nodeMap);
  const leaves=allNodes.filter(n=>!n.children||!n.children.length);
  if(leaves.length){
    const pick=leaves[Math.floor(Math.random()*leaves.length)];
    navigateTo(pick.id);
    setTimeout(()=>showMainPanel(pick),300);
  }
});

// ══════════════════════════════════════════════════════
// KEYBOARD
// ══════════════════════════════════════════════════════
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(document.getElementById('dna-panel').classList.contains('open')){closeDnaCalc();return;}
    panel.classList.remove('open');
    updateBreadcrumb(null);
    document.getElementById('hominin-view').classList.remove('open');
    searchResults.classList.remove('show');
    searchInput.setAttribute('aria-expanded','false');
    history.replaceState(null,'',location.pathname);
    return;
  }
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable) return;
  if(e.key==='f'||e.key==='F'){searchInput.focus();e.preventDefault();}
  if(e.key==='/'){e.preventDefault();const search=document.getElementById('search-input');if(search)search.focus();}
  if(e.key==='h'||e.key==='H'){navigateTo('hominini');}
  if(e.key==='r'||e.key==='R'){transform={x:0,y:0,s:1};applyT();}
  if(e.key==='d'){const toggle=document.getElementById('theme-btn');if(toggle)toggle.click();}
});

// ══════════════════════════════════════════════════════
// RESIZE
// ══════════════════════════════════════════════════════
window.addEventListener('resize',()=>{layout();scheduleRender();});

// ══════════════════════════════════════════════════════
// MOBILE ENHANCEMENTS
// ══════════════════════════════════════════════════════
(function mobilePatch(){
  const isMobile=()=>window.innerWidth<=768;

  // ── Swipe-to-close panel ──
  let panelTouchStartY=0, panelTouchDelta=0, panelSwiping=false;
  panel.addEventListener('touchstart',e=>{
    if(!isMobile()) return;
    const t=e.touches[0];
    panelTouchStartY=t.clientY;
    panelTouchDelta=0;
    panelSwiping=true;
  },{passive:true});
  panel.addEventListener('touchmove',e=>{
    if(!panelSwiping||!isMobile()) return;
    const t=e.touches[0];
    panelTouchDelta=t.clientY-panelTouchStartY;
    if(panelTouchDelta>0 && panel.scrollTop<=0){
      panel.style.transform=`translateY(${panelTouchDelta}px)`;
      panel.style.transition='none';
    }
  },{passive:true});
  panel.addEventListener('touchend',()=>{
    if(!panelSwiping||!isMobile()) return;
    panelSwiping=false;
    panel.style.transition='';
    if(panelTouchDelta>80){
      closePanel();
    } else {
      panel.style.transform='translateY(0)';
    }
    panelTouchDelta=0;
  },{passive:true});

  // ── Legend toggle on mobile ──
  const legend=document.getElementById('legend');
  if(legend){
    const legTitle=legend.querySelector('.leg-title');
    if(legTitle){
      legTitle.addEventListener('click',()=>{
        if(!isMobile()) return;
        legend.classList.toggle('m-collapsed');
      });
    }
    if(isMobile()) legend.classList.add('m-collapsed');
    window.addEventListener('resize',()=>{
      if(!isMobile()) legend.classList.remove('m-collapsed');
      else if(!legend.classList.contains('m-collapsed')) legend.classList.add('m-collapsed');
    });
  }

  // ── Pinch-to-zoom (two-finger) ──
  let lastPinchDist=0;
  svgEl.addEventListener('touchstart',e=>{
    if(e.touches.length===2){
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      lastPinchDist=Math.hypot(dx,dy);
    }
  },{passive:true});
  svgEl.addEventListener('touchmove',e=>{
    if(e.touches.length===2){
      e.preventDefault();
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      const dist=Math.hypot(dx,dy);
      if(lastPinchDist>0){
        const scale=dist/lastPinchDist;
        const cx=(e.touches[0].clientX+e.touches[1].clientX)/2;
        const cy=(e.touches[0].clientY+e.touches[1].clientY)/2;
        const ns=Math.min(6,Math.max(0.12,transform.s*scale));
        transform.x=cx-(cx-transform.x)*(ns/transform.s);
        transform.y=cy-(cy-transform.y)*(ns/transform.s);
        transform.s=ns;
        applyT();
      }
      lastPinchDist=dist;
    }
  },{passive:false});
  svgEl.addEventListener('touchend',()=>{lastPinchDist=0;},{passive:true});

  // ── Swipe-to-close hominin view ──
  const homView=document.getElementById('hominin-view');
  let homTouchStartX=0, homSwiping=false;
  if(homView){
    homView.addEventListener('touchstart',e=>{
      if(!isMobile()) return;
      homTouchStartX=e.touches[0].clientX;
      homSwiping=true;
    },{passive:true});
    homView.addEventListener('touchend',e=>{
      if(!homSwiping||!isMobile()) return;
      homSwiping=false;
      const dx=e.changedTouches[0].clientX-homTouchStartX;
      const isRtl=document.documentElement.dir==='rtl';
      if((!isRtl && dx>100)||(isRtl && dx<-100)){
        homView.classList.remove('open');
      }
    },{passive:true});
  }

  // ── Close panel on back-gesture / history ──
  window.addEventListener('popstate',()=>{
    if(panel.classList.contains('open')){
      closePanel();
    }
    if(homView && homView.classList.contains('open')){
      homView.classList.remove('open');
    }
  });
})();
