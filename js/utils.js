// ══════════════════════════════════════════════════════
// UTILS — shared utility functions
// ══════════════════════════════════════════════════════

import { nodeMap, PHOTO_STATUS_CACHE, PHOTO_VERIFY_PROMISES } from './state.js';

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
  if(n._collapsed === undefined) n._collapsed=false;
  nodeMap[n.id]=n;
  if(n.children) n.children.forEach(c=>preprocess(c,n,depth+1));
}

// Sort all children by appeared (oldest first) for consistent ordering
export function sortChildrenByAge(n){
  if(n.children && n.children.length>1){
    n.children.sort((a,b)=>(b.appeared||0)-(a.appeared||0));
  }
  if(n.children) n.children.forEach(sortChildrenByAge);
}

// ── PHOTO RELIABILITY LAYER ──

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
