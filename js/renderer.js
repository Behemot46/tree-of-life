// ══════════════════════════════════════════════════════
// RENDERER — Layout, SVG rendering, era browser, pan/zoom
// Extracted from index.html (p24)
// ══════════════════════════════════════════════════════

// ── LAYOUT ──
let viewMode='radial';
function getVisible(n){let a=[n];if(n.children&&!n._collapsed)n.children.forEach(c=>a=a.concat(getVisible(c)));return a;}
function getVisibleEdges(n){let a=[];if(n.children&&!n._collapsed){n.children.forEach(c=>{a.push({from:n,to:c});a=a.concat(getVisibleEdges(c));});}return a;}

/* Count visible leaves in a subtree — used to weight angular allocation proportionally */
function leafCount(n){
  if(!n.children||!n.children.length||n._collapsed) return 1;
  let sum=0;
  n.children.forEach(c=>{ sum+=leafCount(c); });
  return Math.max(1,sum);
}

/* Minimum angular separation per sibling (radians) */
const MIN_ANGLE_SEP=0.22;

/* Subtree-weighted angle assignment — larger subtrees get proportionally more room */
function assignAngles(n,a0,a1){
  n._a0=a0; n._a1=a1; n._angle=(a0+a1)/2;
  if(!n.children||!n.children.length||n._collapsed) return;
  const visible=n.children;
  const range=a1-a0;

  const weights=visible.map(c=>{
    const lc=leafCount(c);
    return Math.max(1.0, Math.sqrt(lc)); /* sqrt dampens extreme ratios */
  });
  const totalWeight=weights.reduce((s,w)=>s+w,0);

  const minTotal=visible.length*MIN_ANGLE_SEP;
  const effectiveRange=Math.max(range,minTotal);
  let a=a0-(effectiveRange-range)/2;

  visible.forEach((c,i)=>{
    const share=effectiveRange*(weights[i]/totalWeight);
    assignAngles(c,a,a+share);
    a+=share;
  });
}

function assignPositions(n,cx,cy){
  const r=DEPTH_R[n.depth]||(DEPTH_R[DEPTH_R.length-1]+(n.depth-DEPTH_R.length+1)*120);
  n._x=cx+Math.cos(n._angle-Math.PI/2)*r;
  n._y=cy+Math.sin(n._angle-Math.PI/2)*r;
  if(n.children&&!n._collapsed) n.children.forEach(c=>assignPositions(c,cx,cy));
}

function layoutRadial(){const cx=window.innerWidth/2,cy=window.innerHeight/2+35;assignAngles(TREE,0,Math.PI*2);assignPositions(TREE,cx,cy);}

function layoutCladogram(){
  const isRtl=document.documentElement.dir==='rtl';
  const W=window.innerWidth,H=window.innerHeight;
  const margin=120;
  const depthSpacing=Math.min(140,(W-margin*2)/8);
  function countLeaves(n){if(!n.children||!n.children.length||n._collapsed)return 1;let c=0;n.children.forEach(ch=>c+=countLeaves(ch));return c;}
  const totalLeaves=countLeaves(TREE);
  const leafSpacing=Math.max(20,(H-margin*2)/totalLeaves);
  let leafIdx=0;
  function assign(n,depth){
    if(!n.children||!n.children.length||n._collapsed){
      const x=margin+depth*depthSpacing;
      n._x=isRtl?W-x:x;n._y=margin+leafIdx*leafSpacing;n._angle=0;leafIdx++;
    } else {
      n.children.forEach(c=>assign(c,depth+1));
      const ys=n.children.map(c=>c._y);
      const x=margin+depth*depthSpacing;
      n._x=isRtl?W-x:x;n._y=(Math.min(...ys)+Math.max(...ys))/2;n._angle=0;
    }
  }
  assign(TREE,0);
}

function layoutChronological(){
  const W=window.innerWidth,H=window.innerHeight;
  const margin=100;const maxTime=3800;
  function timeToX(mya){return margin+(1-mya/maxTime)*(W-margin*2);}
  const domainOrder=['bacteria','archaea','protists','fungi','plantae','animalia'];
  const laneH=(H-margin*2)/domainOrder.length;
  function hashCode(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return h;}
  function getDomainLane(n){const d=n._domain||'luca';const idx=domainOrder.indexOf(d);return idx>=0?idx:Math.floor(domainOrder.length/2);}
  function assign(n){
    const mya=n.appeared||3800;
    n._x=timeToX(mya);
    const lane=getDomainLane(n);
    const laneTop=margin+lane*laneH;
    const laneCenter=laneTop+laneH/2;
    const jitter=((hashCode(n.id||'x')%100)-50)/50*laneH*0.35;
    n._y=laneCenter+jitter;n._angle=0;
    if(n.children&&!n._collapsed)n.children.forEach(c=>assign(c));
  }
  assign(TREE);
}

function layout(){
  switch(viewMode){
    case 'cladogram':layoutCladogram();break;
    case 'chronological':layoutChronological();break;
    default:layoutRadial();
  }
}

// ── ERA FILTER ──
let currentEra = 3800;
let activeDomains = new Set(['luca','bacteria','archaea','eukaryota','protists','fungi','plantae','animalia']);
let showExtinct = true;
function nodeInEra(n){
  if(!n.appeared) return true;
  const mya = n.appeared;
  const extinctMya = n.extinct || 0;
  const showFrom = currentEra;
  return mya >= extinctMya && mya <= showFrom + 200;
}

// ── EXTINCT TOGGLE ──
function toggleExtinct() {
  showExtinct = !showExtinct;
  document.getElementById('extinct-label').textContent = showExtinct ? 'Hide Extinct' : 'Show Extinct';
  document.getElementById('extinct-toggle').style.opacity = showExtinct ? '1' : '0.6';
  scheduleRender();
}

// ── DOMAIN FILTER ──
function toggleDomain(domain) {
  if (activeDomains.has(domain)) {
    if (activeDomains.size > 2) activeDomains.delete(domain);
  } else {
    activeDomains.add(domain);
  }
  document.querySelectorAll('[data-domain]').forEach(el => {
    const d = el.getAttribute('data-domain');
    el.style.opacity = activeDomains.has(d) ? '1' : '0.35';
    el.style.fontWeight = activeDomains.has(d) ? '600' : '400';
  });
  scheduleRender();
}

function resetDomains() {
  activeDomains = new Set(['luca','bacteria','archaea','eukaryota','protists','fungi','plantae','animalia']);
  document.querySelectorAll('[data-domain]').forEach(el => {
    el.style.opacity = '1';
    el.style.fontWeight = '400';
  });
  scheduleRender();
}

// ── SVG SILHOUETTE ICONS ──
const NODE_ICONS = {
  bacteria: 'M12 4c-1.5 0-3 .8-3 2.5v11c0 1.7 1.5 2.5 3 2.5s3-.8 3-2.5v-11C15 4.8 13.5 4 12 4z',
  archaea: 'M12 3l-3 5.5 1.5 3-2.5 4.5L12 21l4-5-2.5-4.5L15 8.5 12 3z',
  plant: 'M12 22V12m0 0c0-4-3-7-7-8 1 3 3.5 6 7 8zm0 0c0-4 3-7 7-8-1 3-3.5 6-7 8z',
  fungus: 'M12 22v-8m0 0c-5 0-8-3-8-6s3-5 8-5 8 2 8 5-3 6-8 6z',
  animal: 'M4 13c0-4.4 3.6-8 8-8s8 3.6 8 8c0 2-1.5 3-3 3h-2l-1 3h-4l-1-3H7c-1.5 0-3-1-3-3z',
  fish: 'M2 12c3-4 7-6 11-6 2 0 4 1.5 5 3l4-3v6l-4-3c-1 1.5-3 3-5 3-4 0-8-2-11-6zm13-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  bird: 'M3 15c2-4 6-7 10-7h3l5-4-2 5c1 2 1 4 0 6l-4-1-3 3-2-3c-3 0-5 .5-7 1z',
  reptile: 'M3 14c1-2 3-3 5-3h2l2-2h3l3 1 3-1 1 2-2 1v2l-2 1-3-1-3 1-2-1H8l-3 2-2-2z',
  amphibian: 'M7 8a5 5 0 0 1 10 0c0 2-1 3-2 4v3c0 1-1 2-3 2s-3-1-3-2v-3c-1-1-2-2-2-4zm3-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  insect: 'M12 4a2 2 0 0 1 2 2c0 .5-.2 1-.5 1.3.9.5 1.5 1.4 1.5 2.7 0 1-.4 1.8-1 2.3.6.7 1 1.6 1 2.7 0 2-1.3 3-3 3s-3-1-3-3c0-1.1.4-2 1-2.7-.6-.5-1-1.3-1-2.3 0-1.3.6-2.2 1.5-2.7-.3-.3-.5-.8-.5-1.3a2 2 0 0 1 2-2zM8 9l-3-2m0 6l3-1m8-3l3-2m0 6l-3-1',
  mollusk: 'M16 12a6 6 0 0 0-5-5.9c.6-1.2 1-2.1 1-2.1s-2 .5-3.5 2C5.5 8 4 11 6 14s5 4 8 3c1.5-.5 2.5-2 2.5-4-.2-.3-.3-.7-.5-1z',
  cnidarian: 'M12 3c-3 0-6 3-6 7 0 2 1 3 2 3h8c1 0 2-1 2-3 0-4-3-7-6-7zm-4 12l-1 5m2-5v5m2-5l1 5m2-5v5m2-5l1 5',
  sponge: 'M8 4c-2 1-3 4-3 8s1 7 3 8h8c2-1 3-4 3-8s-1-7-3-8H8zm1 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  primate: 'M8 6a4 4 0 0 1 8 0c0 1.5-1 3-2 3.5.6.5 1 1.3 1 2.5v4c0 1-1 2-3 2s-3-1-3-2v-4c0-1.2.4-2 1-2.5C9 9 8 7.5 8 6zm2 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  hominin: 'M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-2 7c-1.5 0-2.5 1-2.5 2.5V15l-2 7h3l1.5-5 .5 1.5V22h3v-3.5l.5-1.5L15.5 22h3l-2-7v-3.5C16.5 10 15.5 9 14 9h-4z',
  mammal: 'M4 11c0-3 2-5 5-5h1l2-2 2 2h1c3 0 5 2 5 5v2c0 2-1 3-2 3l-1 3h-2l-1-3h-4l-1 3H7l-1-3c-1 0-2-1-2-3v-2zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  default: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10z',
  echinoderm: 'M12 2l2.5 6.5L21 10l-5 4.5 1.5 7L12 18l-5.5 3.5L8 14.5 3 10l6.5-1.5L12 2z',
  worm: 'M6 8c0-2 2-3 4-3s3 1 3 3c0 1.5-1 2.5-2 3 1.5.5 3 2 3 4 0 2.5-2 4-4.5 4S5 17.5 5 15c0-2 1.5-3.5 3-4-1-.5-2-1.5-2-3z',
  crustacean: 'M5 10c0-2 3-4 7-4s7 2 7 4c0 1.5-1 2.5-2.5 3l1.5 4h-3l-1-3h-4l-1 3H6l1.5-4C6 12.5 5 11.5 5 10zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'
};

// Map node IDs to icon groups
function getIconGroup(n) {
  const id = n.id;
  const ID_MAP = {
    'luca': 'default',
    'bacteria': 'bacteria', 'cyanobacteria': 'bacteria', 'proteobacteria': 'bacteria',
    'firmicutes': 'bacteria', 'actinobacteria': 'bacteria', 'spirochetes': 'bacteria',
    'deinococcus': 'bacteria', 'bacteroides': 'bacteria',
    'prochlorococcus': 'bacteria', 'nostoc': 'bacteria', 'ecoli': 'bacteria',
    'helicobacter': 'bacteria', 'vibrio-cholerae': 'bacteria',
    'lactobacillus': 'bacteria', 'clostridium-botulinum': 'bacteria',
    'streptomyces': 'bacteria', 'mycobacterium-tb': 'bacteria',
    'archaea': 'archaea', 'euryarchaeota': 'archaea', 'asgard': 'archaea',
    'halobacterium': 'archaea', 'sulfolobus': 'archaea', 'pyrolobus': 'archaea',
    'lokiarchaeota': 'archaea', 'methanobacterium': 'archaea',
    'eukaryota': 'default',
    'fungi': 'fungus', 'ascomycetes': 'fungus', 'basidiomycetes': 'fungus', 'chytrids': 'fungus',
    'saccharomyces': 'fungus', 'penicillium': 'fungus', 'amanita-muscaria': 'fungus',
    'armillaria': 'fungus', 'psilocybe': 'fungus', 'batrachochytrium': 'fungus',
    'plantae': 'plant', 'bryophytes': 'plant', 'angiosperms': 'plant',
    'gymnosperms': 'plant', 'ferns': 'plant',
    'sphagnum': 'plant', 'marchantia': 'plant', 'arabidopsis': 'plant',
    'rafflesia': 'plant', 'titan-arum': 'plant', 'mimosa-pudica': 'plant',
    'wollemia': 'plant', 'welwitschia': 'plant', 'sequoia': 'plant',
    'tree-fern': 'plant', 'azolla': 'plant',
    'animalia': 'animal',
    'invertebrates': 'crustacean', 'insects': 'insect',
    'horseshoe-crab': 'crustacean', 'mantis-shrimp': 'crustacean', 'honey-bee': 'insect',
    'cephalopods': 'mollusk', 'octopus': 'mollusk', 'nautilus': 'mollusk',
    'cnidarians': 'cnidarian', 'turritopsis': 'cnidarian', 'coral': 'cnidarian',
    'echinoderms': 'echinoderm', 'annelids': 'worm',
    'vertebrates': 'fish',
    'fish': 'fish', 'coelacanth': 'fish', 'shark': 'fish',
    'reptiles': 'reptile', 'komodo-dragon': 'reptile', 'tuatara': 'reptile',
    'birds': 'bird', 'archaeopteryx': 'bird', 'peregrine-falcon': 'bird',
    'amphibians': 'amphibian',
    'mammals': 'mammal', 'cetaceans': 'mammal', 'blue-whale': 'mammal',
    'naked-mole-rat': 'mammal', 'platypus': 'mammal',
    'primates': 'primate', 'great-apes': 'primate',
    'orangutan': 'primate', 'gorilla': 'primate', 'chimpanzee': 'primate',
    'homo-sapiens': 'hominin', 'hominini': 'hominin',
    'protists': 'default', 'alveolates': 'default', 'stramenopiles': 'default',
    'amoebozoa': 'default',
    'plasmodium': 'insect', 'paramecium': 'default', 'dinoflagellates': 'default',
    'diatoms': 'default', 'phytophthora': 'default',
    'amoeba-proteus': 'default', 'volvox': 'default',
    'sponges': 'sponge',
  };
  if (ID_MAP[id]) return ID_MAP[id];
  if (n.group) {
    const HOMININ_GROUP_MAP = { 'homo': 'hominin', 'proto': 'primate', 'australopith': 'primate', 'paranthropus': 'primate' };
    if (HOMININ_GROUP_MAP[n.group]) return HOMININ_GROUP_MAP[n.group];
  }
  if (id.startsWith('group-')) return id === 'group-homo' ? 'hominin' : 'primate';
  let p = n._parent;
  while (p) {
    if (ID_MAP[p.id]) {
      const pg = ID_MAP[p.id];
      if (pg !== 'default') return pg;
    }
    p = p._parent;
  }
  return 'default';
}

// ── HUMAN EVOLUTION PATH ──
const HUMAN_PATH=new Set(['luca','eukaryota','animalia','vertebrates','mammals','primates','great-apes','homo-sapiens']);

// ── RENDER ──
const branchLayer=document.getElementById('layer-branches');
const nodesLayer=document.getElementById('layer-nodes');
const viewport=document.getElementById('viewport');
let transform={x:0,y:0,s:0.6};
const applyT=()=>viewport.setAttribute('transform',`translate(${transform.x},${transform.y}) scale(${transform.s})`);
const animDone=new Set();
let highlightedId=null;

function branchPath(x1,y1,x2,y2){
  if(viewMode==='cladogram'){return `M${x1},${y1} H${(x1+x2)/2} V${y2} H${x2}`;}
  if(viewMode==='chronological'){return `M${x1},${y1} L${x2},${y2}`;}
  const mx=(x1+x2)/2,my=(y1+y2)/2;return `M${x1},${y1} Q${mx+(my-y1)*0.28},${my-(mx-x1)*0.28} ${x2},${y2}`;
}

/* RENDER SCHEDULER */
let renderQueued=false;
function scheduleRender(force=false){
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
    const sw=onHumanPath?3:Math.max(1,3-to.depth*0.3);
    const op=onHumanPath?0.9:(inEra?Math.max(0.25,0.7-to.depth*0.08):0.08);
    p.setAttribute('stroke',onHumanPath?'var(--accent-primary)':to.color);
    p.setAttribute('stroke-width',sw);
    p.setAttribute('stroke-opacity',op);
    if(!animDone.has(to.id)){
      const len=300;p.style.strokeDasharray=len;p.style.strokeDashoffset=len;
      p.style.transition=`stroke-dashoffset ${0.3+to.depth*0.05}s cubic-bezier(.4,0,.2,1) ${to.depth*0.04}s`;
      setTimeout(()=>{p.style.strokeDashoffset=0;},50);
    }
    branchFrag.appendChild(p);
    if(onHumanPath) humanPathEdges.push(p);
  });
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

    // Invisible hit area
    const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
    hit.setAttribute('cx',n._x);hit.setAttribute('cy',n._y);hit.setAttribute('r',Math.max(n.r+14,22));
    hit.setAttribute('fill','transparent');hit.style.cursor='pointer';
    hit.addEventListener('click',e=>{e.stopPropagation();showMainPanel(n);});
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
    c.addEventListener('click', e=>{ e.stopPropagation(); showMainPanel(n); });
    g.appendChild(c);

    // Species image (ImageLoader) or SVG silhouette icon fallback
    if(inEra){
      const imgR=Math.max(n.r,8);
      const imgSize=imgR*2;

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

      addSilhouette();

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
          htmlImg.addEventListener('load',function(){});
          htmlImg.addEventListener('error',function(){
            if(fo.parentNode) fo.remove();
            if(best.source==='generated') ImageLoader.markFailed(n.id);
          });
          htmlImg.src=best.url;
          wrap.appendChild(htmlImg);fo.appendChild(wrap);g.appendChild(fo);
        }
      }
    }

    // Label
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

    // Animate in
    if(!animDone.has(n.id)){
      g.style.opacity='0';g.style.transformOrigin=`${n._x}px ${n._y}px`;g.style.transform='scale(0.2)';
      setTimeout(()=>{
        g.style.transition=`opacity 0.45s ease ${n.depth*0.09}s, transform 0.45s cubic-bezier(.34,1.56,.64,1) ${n.depth*0.09}s`;
        g.style.opacity='1';g.style.transform='scale(1)';
        setTimeout(()=>animDone.add(n.id),550+n.depth*90);
      },40);
    }

    // Events
    g.addEventListener('click',e=>{e.stopPropagation();showMainPanel(n);});
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

// ── TOOLTIP ──
const tooltipEl = document.getElementById('tooltip');
let _tipTimer = null;
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

// ── ERA BROWSER ──
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

let eraPlayId=null;

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

// ── PAN & ZOOM ──
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

// ── TREE ENTRANCE ANIMATION ──
function animateTreeEntrance() {
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
}
