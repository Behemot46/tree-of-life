// ══════════════════════════════════════════════════════
// SEARCH — fuzzy matching, search index, enrichment patching
// ══════════════════════════════════════════════════════

import { state, nodeMap, TAXON_I18N, HOMININ_SKIP_IDS } from './state.js';
import { HOMININS, ENRICHMENT } from './data.js';

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

/* Ranking is per field, not over one blended haystack.

   Every entry used to be flattened into a single string of name, Latin name,
   tags, id and translations, and a hit anywhere in it scored the same 100. The
   results were not merely imperfect, they were wrong: "human" returned
   Proto-Hominins, Koala and Sea urchin — all of which mention humans in their
   tags — and never returned Homo sapiens at all. "whale" put Hippopotamus
   above Humpback whale. Below the top hit came a tail of bigram noise:
   Trypanosoma and Common starfish for "tiger".

   So a match is now scored by where it landed and how much of the field it
   covered. A name beats a Latin name beats a tag; whole beats prefix beats
   word-start beats anywhere. Fuzzy matching is a fallback for typos only —
   names alone, and only when nothing matched literally. */

/* Common names for things the tree only holds under their scientific or
   specific names. Searching "human" returned Koala, Hominini and Sea urchin —
   all of which mention humans in their tags — and never Homo sapiens, because
   no node is called that. "cat" found Meerkat. These are the words a visitor
   actually types, mapped to what is actually in the data; each pattern is
   checked against the built index by the smoke suite, so one that stops
   matching anything is a failure rather than a silent dead end. */
export const SEARCH_ALIASES = [
  { words: ['human', 'humans', 'people', 'person', 'mankind', 'us'], match: /^homo sapiens$/ },
  { words: ['cat', 'cats', 'feline', 'felines'], match: /^(tiger|lion|cheetah|jaguar|snow leopard)$/ },
  { words: ['dog', 'dogs', 'canine'], match: /^(gray wolf|african wild dog)$/ },
  { words: ['monkey', 'monkeys'], match: /^(japanese macaque|mandrill)$/ },
  { words: ['ape', 'apes'], match: /^(great apes|chimpanzee|bonobo|gorilla|orangutan|lar gibbon)$/ },
  { words: ['snake', 'snakes', 'serpent'], match: /^(king cobra|green anaconda|reticulated python)$/ },
  { words: ['lizard', 'lizards'], match: /^(komodo dragon|panther chameleon|tokay gecko|marine iguana)$/ },
  { words: ['dinosaur', 'dinosaurs'], match: /^(birds|archaeopteryx)$/ },
  { words: ['spider', 'spiders'], match: /^golden orb-weaver$/ },
  { words: ['crab', 'crabs'], match: /^(horseshoe crab|japanese spider crab)$/ },
  { words: ['bat', 'bats'], match: /^(common vampire bat|large flying fox)$/ },
  { words: ['rodent', 'rodents', 'mouse', 'rat'], match: /^(naked mole rat|capybara|north american beaver)$/ },
  { words: ['turtle', 'turtles', 'tortoise'], match: /^(green sea turtle|leatherback sea turtle)$/ },
  { words: ['bear', 'bears'], match: /^polar bear$/ },
  { words: ['fish', 'fishes'], match: /^(clownfish|anglerfish|coelacanth|australian lungfish|actinopterygii|chondrichthyes)$/ },
  { words: ['algae', 'seaweed', 'kelp'], match: /^(giant kelp|diatoms|volvox|spirulina|euglena|nostoc)$/ },
  { words: ['mushroom', 'mushrooms', 'fungus'], match: /^(fungi|death cap|destroying angel|shiitake|chanterelle|morel|amanita muscaria|psilocybe cubensis)$/ },
  { words: ['tree', 'trees'], match: /^(oak|giant sequoia|ginkgo|magnolia|eucalyptus|african baobab|dragon blood tree|wollemi pine|strangler fig)$/ },
  { words: ['flower', 'flowers'], match: /^(flowering plants|orchid|sunflower|water lily|sacred lotus|magnolia|rafflesia arnoldii)$/ },
];

const W = {
  nameExact: 1000, namePrefix: 780, nameWord: 660, nameAny: 520,
  latinExact: 900, latinPrefix: 620, latinWord: 520, latinAny: 380,
  tag: 170, id: 150, other: 70,
  alias: 840, fuzzy: 300,
};

/* How well `q` sits inside `text`, as one of four tiers. Returns 0 for no
   match. `tiers` supplies the score for each. */
function placeScore(q, text, tiers) {
  if (!text) return 0;
  if (text === q) return tiers[0];
  if (text.startsWith(q)) return tiers[1];
  const pos = text.indexOf(q);
  if (pos === -1) return 0;
  return text.charAt(pos - 1) === ' ' ? tiers[2] : tiers[3];
}

export function searchEntities(query){
  const q=normalizeSearchText(query);
  if(!q) return[];
  const alias=SEARCH_ALIASES.find(a=>a.words.includes(q));
  const scored=[];
  for(const x of state.searchIndex){
    const names=[x.name,x.nameHe,x.nameRu].filter(Boolean).map(normalizeSearchText);
    const latin=normalizeSearchText(x.latin);
    const tags=normalizeSearchText(x.tags);
    const id=normalizeSearchText(x.id);

    let score=0;
    for(const n of names){
      score=Math.max(score,placeScore(q,n,[W.nameExact,W.namePrefix,W.nameWord,W.nameAny]));
    }
    score=Math.max(score,placeScore(q,latin,[W.latinExact,W.latinPrefix,W.latinWord,W.latinAny]));
    if(!score&&tags.includes(q)) score=W.tag;
    if(!score&&id.includes(q)) score=W.id;
    if(!score&&x.haystack.includes(q)) score=W.other;

    /* Typo tolerance, against names only. Bigram similarity over a blended
       haystack is what produced Trypanosoma for "tiger": with enough words to
       choose from, something always resembles something. */
    if(!score&&!alias&&q.length>=4){
      let best=0;
      for(const n of names){
        for(const w of [n,...n.split(/\s+/)]){
          /* Same opening letter required. Typists transpose and drop letters in
             the middle of a word, not at the front, and without this rule the
             bigram score put "Naked mole rat" at the top of a search for
             "snake" — three shared pairs out of four. */
          if(w.length<3||w.charAt(0)!==q.charAt(0)) continue;
          best=Math.max(best,_fuzzyScore(q,w));
        }
      }
      /* 0.55, not a stricter figure: "sapeins" for sapiens shares only half
         its letter pairs. The first-letter rule above is what keeps this from
         letting nonsense through. */
      if(best>=0.55) score=Math.round(W.fuzzy*best);
    }

    /* A curated common name outranks an incidental literal one. Someone
       typing "bat" means the animal, not Batrachochytrium dendrobatidis; "bear"
       means the polar bear before the tardigrade called a water bear. */
    if(alias&&alias.match.test(names[0])) score=Math.max(score,W.alias);

    if(!score) continue;
    /* Shorter names win ties: for "oak", Oak should come before Oak Woodland,
       and a domain should outrank a species that merely contains its name. */
    const shortest=Math.min(...names.map(n=>n.length),latin.length||99);
    score+=Math.max(0,40-shortest)*0.5;
    scored.push(Object.assign({},x,{_score:score}));
  }

  scored.sort((a,b)=>b._score-a._score);
  /* Once something has matched a name outright, stop showing the also-rans.
     A tag hit is worth offering when nothing better exists and is noise
     underneath a real answer. */
  if(scored.length&&scored[0]._score>=W.nameAny){
    return scored.filter(r=>r._score>=W.tag).slice(0,12);
  }
  return scored.slice(0,12);
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
