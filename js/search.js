// ══════════════════════════════════════════════════════
// SEARCH — fuzzy matching, search index, enrichment patching
// ══════════════════════════════════════════════════════

import { state, nodeMap, TAXON_I18N, HOMININ_SKIP_IDS } from './state.js';
import { ENRICHMENT } from './speciesData.js';
import { HOMININS } from './treeData.js';

// Uses globals: HOMININS, ENRICHMENT

export function normalizeSearchText(str){
  return String(str||"")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g,"")
    .trim();
}

/* Bigram-based fuzzy similarity (0..1) */
function _bigramSet(s){
  const bg=new Set();
  for(let i=0;i<s.length-1;i++) bg.add(s.charAt(i)+s.charAt(i+1));
  return bg;
}
function _fuzzyScore(a,b){
  if(a.length<2||b.length<2) return a===b?1:0;
  const sa=_bigramSet(a),sb=_bigramSet(b);
  let inter=0;
  sa.forEach(x=>{if(sb.has(x))inter++;});
  return(2*inter)/(sa.size+sb.size);
}

export function buildSearchIndex(){
  state.searchIndex=[];
  // Track IDs already added to prevent duplicates
  const addedIds = new Set();
  Object.values(nodeMap).forEach(n=>{
    if(addedIds.has(n.id)) return;
    addedIds.add(n.id);
    const i18n=TAXON_I18N[n.id];
    const extra=i18n?[i18n.he||'',i18n.ru||'']:[];
    // For hominin tree nodes, include full latin name in haystack
    const extraHaystack = n._hominData
      ? [n._hominData.name, n._hominData.short, (n._hominData.tags||[]).join(" ")].join(" ")
      : "";
    state.searchIndex.push({
      id:n.id,
      name:n._hominData ? n._hominData.name : n.name,
      nameHe:i18n?.he||'',
      nameRu:i18n?.ru||'',
      latin:n.latin||"",
      era:n.era||"",
      icon:n.icon,
      depth:n.depth,
      tags:(n.tags||[]).join(" "),
      type:n._hominData ? "hominin" : "tree",
      haystack:normalizeSearchText(
        [n.name,n.latin,(n.tags||[]).join(" "),n.id,...extra,extraHaystack].join(" ")
      )
    });
  });
  // Also index HOMININS entries that aren't in the tree (e.g. h_sapiens maps to homo-sapiens)
  HOMININS.forEach(h=>{
    if(HOMININ_SKIP_IDS.has(h.id)) return;
    // Skip if this hominin is already in the tree (via buildHomininTree)
    if(nodeMap[h.id] || addedIds.has(h.id)) return;
    const treeId = h.id === 'h_sapiens' ? 'homo-sapiens' : h.id;
    if(addedIds.has(treeId)) return;
    addedIds.add(h.id);
    const i18n=TAXON_I18N[h.id];
    const extra=i18n?[i18n.he||'',i18n.ru||'']:[];
    state.searchIndex.push({
      id:treeId,
      name:h.name,
      nameHe:i18n?.he||'',
      nameRu:i18n?.ru||'',
      latin:h.short||"",
      era:h.mya[0]+"–"+h.mya[1]+" Mya",
      icon:h.icon,
      depth:0,
      tags:(h.tags||[]).join(" "),
      type:"hominin",
      haystack:normalizeSearchText(
        [h.name,h.short,(h.tags||[]).join(" "),h.id,...extra].join(" ")
      )
    });
  });
}

export function searchEntities(query){
  const q=normalizeSearchText(query);
  if(!q) return[];
  const scored=[];
  for(const x of state.searchIndex){
    let score=0;
    // 1. Exact substring match (highest priority)
    const pos=x.haystack.indexOf(q);
    if(pos!==-1){
      score=100;
      if(pos===0||x.haystack.charAt(pos-1)===' ') score+=20; // word-start bonus
      score-=Math.min(15,x.haystack.length/20); // specificity bonus
    }
    // 2. Fuzzy match on individual words (for typos)
    if(score===0&&q.length>=3){
      const words=x.haystack.split(/\s+/);
      let best=0;
      for(const w of words){
        if(w.length<2) continue;
        const sim=_fuzzyScore(q,w);
        if(sim>best) best=sim;
        // Also check if query is a fuzzy prefix of longer words
        if(w.length>q.length){
          const prefix=w.slice(0,q.length+1);
          const psim=_fuzzyScore(q,prefix);
          if(psim>best) best=psim;
        }
      }
      if(best>0.35) score=Math.round(best*60);
    }
    if(score>0) scored.push(Object.assign({},x,{_score:score}));
  }
  return scored.sort((a,b)=>b._score-a._score).slice(0,12);
}

// Patch enrichment data into the nodeMap
export function patchEnrichment(){
  Object.entries(ENRICHMENT).forEach(([id, data]) => {
    const node = nodeMap[id];
    if (node) {
      if (data.altFacts) node.altFacts = data.altFacts;
      if (data.links) node.links = data.links;
    }
  });
}
