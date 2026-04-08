// ══════════════════════════════════════════════════════
// UTILS — shared utility functions
// ══════════════════════════════════════════════════════

import { nodeMap, state, PHOTO_STATUS_CACHE, PHOTO_VERIFY_PROMISES } from './state.js';
import { HOMININS, MAX_BRAIN, HOMININ_ID_ALIASES } from './data.js';

// ── REDUCED MOTION HELPER ──
export const reducedMotion=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;

// ── HOMININ ID HELPERS ──
// Uses globals: HOMININ_ID_ALIASES, HOMININS, MAX_BRAIN

export function canonicalHomininId(id){
  return HOMININ_ID_ALIASES[id]||id;
}
export function getHomininById(id){
  const canonical=canonicalHomininId(id);
  return HOMININS.find(h=>h.id===canonical)||null;
}
export function resolveHomininTarget(id){
  const canonical=canonicalHomininId(id);
  if(getHomininById(canonical)) return canonical;
  return null;
}

// ── BUILD HOMININ SUBTREE ──
// Uses global: MAX_BRAIN

export function homininToTreeNode(h){
  const brainMax=h.brain[1]||h.brain[0]||0;
  const r=brainMax?Math.round(7+(brainMax/MAX_BRAIN)*7):8;
  return {
    id:h.id, icon:h.icon, color:h.color, r:r,
    appeared:h.mya[0],
    extinct:h.status==='extinct'?true:null,
    name:h.name, latin:h.name,
    era:h.mya[1]===0?h.mya[0]+' Ma – present':h.mya[0]+'–'+h.mya[1]+' Ma',
    desc:h.desc, detail:h.detail, funFact:h.funFact||null,
    facts:h.facts||[], tags:h.tags||[],
    img:h.img||null, imgCredit:h.imgCredit||null,
    children:[],
    _hominin:true,
    _hominData:h
  };
}

// ── NODE MAP + PREPROCESSING ──

export function preprocess(n,parent=null,depth=0){
  n._parent=parent; n.depth=depth;
  // Collapsed-by-default: nodes past depthLimit start collapsed unless the
  // user manually expanded them. _hiddenByToggle is used by the species toggle
  // (PR 2). Root (depth 0) is never collapsed.
  if(state.collapsedByDefault && depth>0){
    n._collapsed = (depth > state.depthLimit && !n._manualExpand) || !!n._hiddenByToggle;
  } else if(n._collapsed === undefined){
    n._collapsed=false;
  }
  nodeMap[n.id]=n;
  if(n.children) n.children.forEach(c=>preprocess(c,n,depth+1));
  // Compute maxBaseDepth on the root call (depth 0).
  if(depth===0){
    let max=0;
    for(const id in nodeMap){
      const node=nodeMap[id];
      if(!node._fromExpansion && node.depth>max) max=node.depth;
    }
    state.maxBaseDepth=max;
  }
}

// Sort all children by appeared (oldest first) for consistent ordering
export function sortChildrenByAge(n){
  if(n.children && n.children.length>1){
    n.children.sort((a,b)=>(b.appeared||0)-(a.appeared||0));
  }
  if(n.children) n.children.forEach(sortChildrenByAge);
}

// ── PHOTO RELIABILITY LAYER ──

/**
 * Pick a random leaf node (species) from the tree.
 * Returns the node object, or null if nodeMap is empty.
 */
export function getRandomSpecies(nodeMapRef) {
  const leaves = Object.values(nodeMapRef).filter(n => !n.children || n.children.length === 0);
  if (!leaves.length) return null;
  return leaves[Math.floor(Math.random() * leaves.length)];
}

/**
 * Generate a human-scale time comparison for a species' appearance date.
 * Returns { metaphor, text } or null. Deterministic per speciesId.
 */
export function getTimeContext(appearedMya, speciesId) {
  if (!appearedMya || appearedMya <= 0) return null;
  const EARTH_AGE = 3800;
  const fraction = 1 - appearedMya / EARTH_AGE;
  let hash = 0;
  for (let i = 0; i < speciesId.length; i++) {
    hash = ((hash << 5) - hash + speciesId.charCodeAt(i)) | 0;
  }
  const metaphors = ['clock', 'calendar', 'marathon'];
  const idx = ((hash % metaphors.length) + metaphors.length) % metaphors.length;
  const metaphor = metaphors[idx];
  let text;
  if (metaphor === 'clock') {
    const totalMinutes = Math.round(fraction * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeStr = `${hours}:${String(minutes).padStart(2, '0')}`;
    if (appearedMya >= EARTH_AGE - 10) {
      text = `If Earth\u2019s history were 24 hours, this is midnight \u2014 the very beginning`;
    } else {
      text = `If Earth\u2019s history were 24 hours, this species appeared at ${timeStr}`;
    }
  } else if (metaphor === 'calendar') {
    const dayOfYear = Math.round(fraction * 365);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    let d = Math.max(1, dayOfYear);
    let m = 0;
    while (m < 11 && d > daysInMonth[m]) { d -= daysInMonth[m]; m++; }
    if (appearedMya >= EARTH_AGE - 10) {
      text = `If Earth\u2019s history were a calendar year, this is January 1st`;
    } else {
      text = `If Earth\u2019s history were a calendar year, this species appeared on ${months[m]} ${d}`;
    }
  } else {
    const km = fraction * 42.195;
    if (appearedMya >= EARTH_AGE - 10) {
      text = `If Earth\u2019s history were a marathon, this is the starting line`;
    } else if (km > 42.1) {
      const cm = Math.round((42.195 - km + 0.001) * 100);
      text = `If Earth\u2019s history were a marathon, this species appeared in the last ${Math.max(1, cm)} cm`;
    } else {
      text = `If Earth\u2019s history were a marathon, this species appeared at the ${km.toFixed(1)} km mark`;
    }
  }
  return { metaphor, text };
}

export function verifyPhotoUrl(url){
  if(!url) return Promise.resolve(false);
  const cached=PHOTO_STATUS_CACHE.get(url);
  if(cached==="ok") return Promise.resolve(true);
  if(cached==="bad") return Promise.resolve(false);
  if(PHOTO_VERIFY_PROMISES.has(url))
    return PHOTO_VERIFY_PROMISES.get(url);
  const promise=new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      PHOTO_STATUS_CACHE.set(url,"ok");
      PHOTO_VERIFY_PROMISES.delete(url);
      resolve(true);
    };
    img.onerror=()=>{
      PHOTO_STATUS_CACHE.set(url,"bad");
      PHOTO_VERIFY_PROMISES.delete(url);
      resolve(false);
    };
    img.src=url;
  });
  PHOTO_VERIFY_PROMISES.set(url,promise);
  return promise;
}
