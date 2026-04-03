// ══════════════════════════════════════════════════════
// LAYOUT — tree layout algorithms
// ══════════════════════════════════════════════════════

import { state, MIN_ARC_PX, MAX_ARC_PER_LEAF } from './state.js';
import { DEPTH_R } from './uiData.js';

// Uses globals: DEPTH_R, TREE

export function getVisible(n){let a=[n];if(n.children&&!n._collapsed)n.children.forEach(c=>a=a.concat(getVisible(c)));return a;}
export function getVisibleEdges(n){let a=[];if(n.children&&!n._collapsed){n.children.forEach(c=>{a.push({from:n,to:c});a=a.concat(getVisibleEdges(c));});}return a;}

/* Count visible leaves in a subtree — used to weight angular allocation proportionally */
export function leafCount(n){
  if(!n.children||!n.children.length||n._collapsed) return 1;
  let sum=0;
  n.children.forEach(c=>{ sum+=leafCount(c); });
  return Math.max(1,sum);
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
  const visible=n.children;
  const range=a1-a0;

  /* Child depth radius — used for arc-based spacing */
  const childDepth=(n.depth!==undefined?n.depth:0)+1;
  const r=DEPTH_R[childDepth]||(DEPTH_R[DEPTH_R.length-1]+(childDepth-DEPTH_R.length+1)*120);

  const weights=visible.map(c=>{
    const lc=leafCount(c);
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
    const totalLeaves=visible.reduce((s,c)=>s+leafCount(c),0);
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

export function layoutRadial(){const cx=window.innerWidth/2,cy=window.innerHeight/2+35;assignAngles(TREE,0,Math.PI*2);assignPositions(TREE,cx,cy);}

export function layoutCladogram(){
  const isRtl=document.documentElement.dir==='rtl';
  const W=window.innerWidth,H=window.innerHeight;
  const margin=120;
  const depthSpacing=Math.min(200,(W-margin*2)/8);
  const GROUP_GAP_LEAVES=1.5;
  function countLeaves(n){
    if(!n.children||!n.children.length||n._collapsed)return 1;
    let c=0;n.children.forEach(ch=>c+=countLeaves(ch));
    // Add virtual gap leaves for hominin group boundaries
    if(n.id==='hominini'){
      const groups=n.children.filter(ch=>ch._isHomininGroup);
      c+=Math.max(0,(groups.length-1))*GROUP_GAP_LEAVES;
    }
    return c;
  }
  const totalLeaves=countLeaves(TREE);
  const leafSpacing=Math.max(36,(H-margin*2)/totalLeaves);
  let leafIdx=0;
  let lastHomininGroup=null;
  function assign(n,depth){
    if(!n.children||!n.children.length||n._collapsed){
      // Insert vertical gap between hominin groups
      if(n._parent && n._parent._isHomininGroup){
        const gid=n._parent.id;
        if(lastHomininGroup && lastHomininGroup!==gid) leafIdx+=GROUP_GAP_LEAVES;
        lastHomininGroup=gid;
      }
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

export function layoutChronological(){
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

/* Infer appeared value for nodes missing it (use parent's value) */
function inferAppeared(n){
  if(n.appeared!==undefined&&n.appeared!==null) return n.appeared;
  if(n._parent) return inferAppeared(n._parent);
  return 0;
}

export function layoutPlayback(){
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
    if(n.children&&!n._collapsed)n.children.forEach(c=>assign(c));
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
