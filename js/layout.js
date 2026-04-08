// ══════════════════════════════════════════════════════
// LAYOUT — tree layout algorithms
// ══════════════════════════════════════════════════════

import { state, MIN_ARC_PX, MAX_ARC_PER_LEAF } from './state.js';
import { DEPTH_R } from './uiData.js';
import { TREE } from './data.js';

export function getVisible(n){let a=[n];if(n.children&&!n._collapsed)n.children.forEach(c=>a=a.concat(getVisible(c)));return a;}
export function getVisibleEdges(n){let a=[];if(n.children&&!n._collapsed){n.children.forEach(c=>{a.push({from:n,to:c});a=a.concat(getVisibleEdges(c));});}return a;}

/* Count visible leaves in a subtree — used to weight angular allocation proportionally */
export function leafCount(n){
  if(!n.children||!n.children.length||n._collapsed) return 1;
  let sum=0;
  n.children.forEach(c=>{ sum+=leafCount(c); });
  return Math.max(1,sum);
}

// Count of currently-visible descendants + 1. Collapsed subtrees weigh 1
// so they reclaim space when closed. Called once per layout() pass before
// computing positions.
function computeWeight(node){
  if(!node.children||!node.children.length||node._collapsed){
    node._weight=1;
    return 1;
  }
  let sum=0;
  for(const c of node.children){
    if(c._hiddenByToggle) continue; // species toggle (PR 2)
    sum+=computeWeight(c);
  }
  node._weight=Math.max(1,sum);
  return node._weight;
}
/* Count all descendants (not just visible) for collapse badge */
export function countDescendants(n){
  if(!n.children||!n.children.length) return 0;
  let c=n.children.length;
  n.children.forEach(ch=>{ c+=countDescendants(ch); });
  return c;
}

/* Subtree-weighted angle assignment — larger subtrees get proportionally more room */
export function assignAngles(n,a0,a1){
  n._a0=a0; n._a1=a1; n._angle=(a0+a1)/2;
  if(!n.children||!n.children.length||n._collapsed) return;
  const visible=n.children.filter(c=>!c._hiddenByToggle);
  if(!visible.length) return;
  const range=a1-a0;

  /* Child depth radius — used for arc-based spacing */
  const childDepth=(n.depth!==undefined?n.depth:0)+1;
  const r=DEPTH_R[childDepth]||(DEPTH_R[DEPTH_R.length-1]+(childDepth-DEPTH_R.length+1)*120);

  const weights=visible.map(c=>{
    const lc=c._weight||1;
    return Math.max(1.0, Math.sqrt(lc)); /* sqrt dampens extreme ratios */
  });

  /* Cap weight ratio: no child gets more than 2.5× the lightest sibling */
  const MAX_WEIGHT_RATIO=2.5;
  const minW=Math.min(...weights);
  const cap=minW*MAX_WEIGHT_RATIO;
  for(let i=0;i<weights.length;i++){
    if(weights[i]>cap) weights[i]=cap;
  }

  const totalWeight=weights.reduce((s,w)=>s+w,0);

  /* Depth-aware minimum separation: fixed px gap → smaller angle at large radii */
  const minAngleSep=r>0?Math.max(0.04,MIN_ARC_PX/r):0.22;
  const minTotal=visible.length*minAngleSep;
  let effectiveRange=Math.max(range,minTotal);

  /* Arc-length clamping: keep siblings tight at large radii */
  if(r>0){
    const totalLeaves=visible.reduce((s,c)=>s+(c._weight||1),0);
    const maxAngle=(totalLeaves*MAX_ARC_PER_LEAF)/r;
    if(effectiveRange>maxAngle&&maxAngle>=minTotal) effectiveRange=maxAngle;
  }

  // Angular gap between hominin group siblings for visual distinction
  const GROUP_GAP_RAD=0.08;
  let gapCount=0;
  if(n.id==='hominini'){
    for(let i=1;i<visible.length;i++){
      if(visible[i]._isHomininGroup) gapCount++;
    }
  }
  const totalGap=gapCount*GROUP_GAP_RAD;
  effectiveRange=Math.max(effectiveRange,effectiveRange+totalGap);
  const distributable=effectiveRange-totalGap;

  /* Center clamped range within parent arc */
  const parentMid=(a0+a1)/2;
  let a=parentMid-effectiveRange/2;

  visible.forEach((c,i)=>{
    if(i>0 && n.id==='hominini' && c._isHomininGroup) a+=GROUP_GAP_RAD;
    const share=distributable*(weights[i]/totalWeight);
    assignAngles(c,a,a+share);
    a+=share;
  });
}

export function assignPositions(n,cx,cy){
  const r=n.depth<DEPTH_R.length?DEPTH_R[n.depth]:(DEPTH_R[DEPTH_R.length-1]+(n.depth-DEPTH_R.length+1)*1400);
  n._x=cx+Math.cos(n._angle-Math.PI/2)*r;
  n._y=cy+Math.sin(n._angle-Math.PI/2)*r;
  if(n.children&&!n._collapsed) n.children.forEach(c=>assignPositions(c,cx,cy));
}

export function layoutRadial(){computeWeight(TREE);const cx=window.innerWidth/2,cy=window.innerHeight/2+35;assignAngles(TREE,0,Math.PI*2);assignPositions(TREE,cx,cy);}

export function layoutCladogram(){
  computeWeight(TREE);
  const isRtl=document.documentElement.dir==='rtl';
  const W=window.innerWidth,H=window.innerHeight;
  const marginL=60,marginR=40,marginV=40;
  const isMobile=W<768;
  const nodeSize=isMobile?44:52;
  const GROUP_GAP_FACTOR=1.5;

  function maxDepthFn(n,d){
    if(!n.children||!n.children.length||n._collapsed) return d;
    let m=d;
    n.children.forEach(c=>{m=Math.max(m,maxDepthFn(c,d+1));});
    return m;
  }
  const mxd=Math.max(1,maxDepthFn(TREE,0));

  function countLeaves(n){
    if(!n.children||!n.children.length||n._collapsed) return 1;
    const visible=n.children.filter(ch=>!ch._hiddenByToggle);
    if(!visible.length) return 1;
    let c=0;
    visible.forEach(ch=>c+=countLeaves(ch));
    if(n.id==='hominini'){
      const groups=visible.filter(ch=>ch._isHomininGroup);
      c+=Math.max(0,(groups.length-1))*GROUP_GAP_FACTOR;
    }
    return c;
  }
  const totalLeaves=countLeaves(TREE);

  // Compute spacing to target a landscape aspect ratio (~viewport proportions)
  // Total width  = mxd * depthSpacing
  // Total height = totalLeaves * leafSpacing
  // We want width/height ≈ viewport W/H (landscape)
  const minLeafGap=isMobile?73:94;  // minimum vertical gap per leaf
  const maxLeafGap=nodeSize+40;     // maximum vertical gap per leaf (92px)
  const minDepthGap=isMobile?120:180; // minimum horizontal gap per depth
  const maxDepthGap=600;

  // Start with a comfortable leaf gap and compute depth gap to match aspect ratio
  let leafSpacing=Math.max(minLeafGap,Math.min(maxLeafGap,(H-marginV*2)/Math.max(totalLeaves,1)));
  const treeH=totalLeaves*leafSpacing;
  // Match viewport aspect ratio: depthSpacing = (W/H) * treeH / mxd
  let depthSpacing=Math.max(minDepthGap,Math.min(maxDepthGap,(W/Math.max(H,1))*treeH/Math.max(mxd,1)));

  // If tree is very bushy (many leaves), ensure it's still readable
  if(totalLeaves>30){
    leafSpacing=Math.max(minLeafGap,Math.min(94,(H*0.8)/totalLeaves));
    depthSpacing=Math.max(minDepthGap,Math.min(maxDepthGap,(W/Math.max(H,1))*(totalLeaves*leafSpacing)/Math.max(mxd,1)));
  }

  let leafIdx=0;
  let lastHomininGroup=null;

  function assign(n,depth){
    const visibleKids=n.children?n.children.filter(c=>!c._hiddenByToggle):null;
    if(!visibleKids||!visibleKids.length||n._collapsed){
      if(n._parent&&n._parent._isHomininGroup){
        const gid=n._parent.id;
        if(lastHomininGroup&&lastHomininGroup!==gid) leafIdx+=GROUP_GAP_FACTOR;
        lastHomininGroup=gid;
      }
      const x=marginL+depth*depthSpacing;
      n._x=isRtl?W-x:x;
      n._y=marginV+leafIdx*leafSpacing;
      n._angle=0;
      leafIdx++;
    } else {
      visibleKids.forEach(c=>assign(c,depth+1));
      const ys=visibleKids.map(c=>c._y);
      const x=marginL+depth*depthSpacing;
      n._x=isRtl?W-x:x;
      n._y=(Math.min(...ys)+Math.max(...ys))/2;
      n._angle=0;
    }
  }
  assign(TREE,0);

  // Assign sibling indices for stagger animation
  function assignSibIndex(n){
    if(n.children&&!n._collapsed){
      n.children.forEach((c,i)=>{c._sibIndex=i;assignSibIndex(c);});
    }
  }
  assignSibIndex(TREE);
}

export function layoutChronological(){
  computeWeight(TREE);
  // TODO: timeline view deferred — fall back to cladogram
  layoutCladogram();
}

/* Infer appeared value for nodes missing it (use parent's value) */
function inferAppeared(n){
  if(n.appeared!==undefined&&n.appeared!==null) return n.appeared;
  if(n._parent) return inferAppeared(n._parent);
  return 0;
}

export function layoutPlayback(){
  computeWeight(TREE);
  const W=window.innerWidth,H=window.innerHeight;
  const margin=120;const maxTime=3800;
  // Logarithmic x: recent eras get more space
  function timeToX(mya){
    const norm=1-(Math.log(mya+1)/Math.log(maxTime+1));
    return margin+norm*(W-margin*2);
  }
  const domainOrder=['bacteria','archaea','protists','fungi','plantae','animalia'];
  const laneH=(H-margin*2)/domainOrder.length;
  function hashCode(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return h;}
  function getDomainLane(n){const d=n._domain||'luca';const idx=domainOrder.indexOf(d);return idx>=0?idx:Math.floor(domainOrder.length/2);}
  function assign(n){
    const mya=n.appeared||inferAppeared(n);
    n._x=timeToX(mya);
    const lane=getDomainLane(n);
    const laneTop=margin+lane*laneH;
    const laneCenter=laneTop+laneH/2;
    const jitter=((hashCode(n.id||'x')%100)-50)/50*laneH*0.35;
    n._y=laneCenter+jitter;n._angle=0;
    if(n.children&&!n._collapsed)n.children.forEach(c=>{if(!c._hiddenByToggle)assign(c);});
  }
  assign(TREE);
}

export function layout(){
  switch(state.viewMode){
    case 'cladogram':layoutCladogram();break;
    case 'chronological':layoutChronological();break;
    case 'playback':layoutPlayback();break;
    default:layoutRadial();
  }
}
