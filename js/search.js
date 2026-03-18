// ══════════════════════════════════════════════════════
// SEARCH — fuzzy multilingual search index + UI
// Extracted from index.html (p24)
// ══════════════════════════════════════════════════════

const TAXON_I18N = {
  // ── Bacteria ──
  'luca':{he:'אב קדמון משותף',ru:'Последний общий предок'},
  'bacteria':{he:'חיידקים',ru:'Бактерии'},
  'cyanobacteria':{he:'ציאנובקטריה',ru:'Цианобактерии'},
  'prochlorococcus':{he:'פרוכלורוקוקוס',ru:'Прохлорококк'},
  'nostoc':{he:'נוסטוק',ru:'Носток'},
  'proteobacteria':{he:'פרוטאובקטריה',ru:'Протеобактерии'},
  'ecoli':{he:'אי קולי',ru:'Кишечная палочка'},
  'helicobacter':{he:'הליקובקטר פילורי',ru:'Хеликобактер пилори'},
  'vibrio-cholerae':{he:'ויבריו כולרה',ru:'Холерный вибрион'},
  'firmicutes':{he:'פירמיקוטס',ru:'Фирмикуты'},
  'lactobacillus':{he:'לקטובצילוס',ru:'Лактобацилла'},
  'clostridium-botulinum':{he:'קלוסטרידיום בוטולינום',ru:'Клостридия ботулизма'},
  'actinobacteria':{he:'אקטינובקטריה',ru:'Актинобактерии'},
  'streptomyces':{he:'סטרפטומיצס',ru:'Стрептомицеты'},
  'mycobacterium-tb':{he:'מיקובקטריום שחפת',ru:'Туберкулёзная палочка'},
  'spirochetes':{he:'ספירוכטות',ru:'Спирохеты'},
  'deinococcus':{he:'דיינוקוקוס',ru:'Дейнококк'},
  'bacteroides':{he:'בקטרואידס',ru:'Бактероиды'},
  // ── Archaea ──
  'archaea':{he:'ארכיאות',ru:'Археи'},
  'euryarchaeota':{he:'אוריארכאוטה',ru:'Эвриархеоты'},
  'methanobacterium':{he:'מתנובקטריום',ru:'Метанобактерии'},
  'asgard':{he:'ארכיאות אסגארד',ru:'Асгардархеоты'},
  'halobacterium':{he:'הלובקטריום',ru:'Галобактерии'},
  'sulfolobus':{he:'סולפולובוס',ru:'Сульфолобус'},
  'pyrolobus':{he:'פירולובוס',ru:'Пиролобус'},
  'lokiarchaeota':{he:'לוקיארכאוטה',ru:'Локиархеоты'},
  // ── Eukaryota ──
  'eukaryota':{he:'איקריוטים',ru:'Эукариоты'},
  // ── Fungi ──
  'fungi':{he:'פטריות',ru:'Грибы'},
  'ascomycetes':{he:'פטריות שק',ru:'Аскомицеты'},
  'saccharomyces':{he:'שמרים',ru:'Дрожжи'},
  'penicillium':{he:'פניצילום',ru:'Пенициллиум'},
  'psilocybe':{he:'פסילוציבה',ru:'Псилоцибе'},
  'basidiomycetes':{he:'בזידיומיצטים',ru:'Базидиомицеты'},
  'amanita-muscaria':{he:'זבוב אגרטל',ru:'Мухомор'},
  'armillaria':{he:'ארמילריה',ru:'Опёнок'},
  'chytrids':{he:'כיטרידים',ru:'Хитридиомицеты'},
  'batrachochytrium':{he:'כיטריד צפרדעים',ru:'Батрахохитриум'},
  // ── Plants ──
  'plantae':{he:'צמחים',ru:'Растения'},
  'bryophytes':{he:'טחבים',ru:'Мхи'},
  'sphagnum':{he:'ספאגנום',ru:'Сфагнум'},
  'marchantia':{he:'מרכנטיה',ru:'Маршанция'},
  'ferns':{he:'שרכים',ru:'Папоротники'},
  'tree-fern':{he:'שרך עץ',ru:'Древовидный папоротник'},
  'azolla':{he:'אזולה',ru:'Азолла'},
  'gymnosperms':{he:'מערטילי זרע',ru:'Голосеменные'},
  'sequoia':{he:'סקויה',ru:'Секвойя'},
  'welwitschia':{he:'ולוויצ׳יה',ru:'Вельвичия'},
  'wollemia':{he:'וולמיה',ru:'Воллемия'},
  'angiosperms':{he:'מכוסי זרע',ru:'Покрытосеменные'},
  'arabidopsis':{he:'ארבידופסיס',ru:'Арабидопсис'},
  'rafflesia':{he:'רפלזיה',ru:'Раффлезия'},
  'titan-arum':{he:'ארום ענק',ru:'Аморфофаллус титанический'},
  'mimosa-pudica':{he:'מימוזה ביישנית',ru:'Мимоза стыдливая'},
  // ── Animals ──
  'animalia':{he:'בעלי חיים',ru:'Животные'},
  'invertebrates':{he:'חסרי חוליות',ru:'Беспозвоночные'},
  'cnidarians':{he:'צורבי רקמות',ru:'Стрекающие'},
  'coral':{he:'אלמוגים',ru:'Кораллы'},
  'turritopsis':{he:'מדוזה אלמוותית',ru:'Бессмертная медуза'},
  'annelids':{he:'טבעתנים',ru:'Кольчатые черви'},
  'insects':{he:'חרקים',ru:'Насекомые'},
  'horseshoe-crab':{he:'דרבנית',ru:'Мечехвост'},
  'honey-bee':{he:'דבורת דבש',ru:'Медоносная пчела'},
  'mantis-shrimp':{he:'שרימפס גמלון',ru:'Рак-богомол'},
  'echinoderms':{he:'עורניתנים',ru:'Иглокожие'},
  'cephalopods':{he:'ראשרגליים',ru:'Головоногие'},
  'octopus':{he:'תמנון',ru:'Осьминог'},
  'nautilus':{he:'נאוטילוס',ru:'Наутилус'},
  'vertebrates':{he:'בעלי חוליות',ru:'Позвоночные'},
  'fish':{he:'דגים',ru:'Рыбы'},
  'coelacanth':{he:'סלקנת',ru:'Латимерия'},
  'shark':{he:'כריש',ru:'Акула'},
  'amphibians':{he:'דו-חיים',ru:'Земноводные'},
  'reptiles':{he:'זוחלים',ru:'Рептилии'},
  'tuatara':{he:'טואטרה',ru:'Туатара'},
  'komodo-dragon':{he:'דרקון קומודו',ru:'Комодский варан'},
  'archaeopteryx':{he:'ארכיאופטריקס',ru:'Археоптерикс'},
  'birds':{he:'ציפורים',ru:'Птицы'},
  'peregrine-falcon':{he:'בז נודד',ru:'Сапсан'},
  'mammals':{he:'יונקים',ru:'Млекопитающие'},
  'platypus':{he:'ברווזן',ru:'Утконос'},
  'cetaceans':{he:'לווייתנאים',ru:'Китообразные'},
  'blue-whale':{he:'לוויתן כחול',ru:'Голубой кит'},
  'primates':{he:'פרימטים',ru:'Приматы'},
  'orangutan':{he:'אורנגאוטן',ru:'Орангутан'},
  'gorilla':{he:'גורילה',ru:'Горилла'},
  'chimpanzee':{he:'שימפנזה',ru:'Шимпанзе'},
  'great-apes':{he:'קופי אדם',ru:'Человекообразные обезьяны'},
  'naked-mole-rat':{he:'חולד עירום',ru:'Голый землекоп'},
  // ── Protists ──
  'protists':{he:'פרוטיסטים',ru:'Протисты'},
  'amoebozoa':{he:'אמבואזואה',ru:'Амёбозои'},
  'amoeba-proteus':{he:'אמבה',ru:'Амёба'},
  'alveolates':{he:'אלוואולטים',ru:'Альвеоляты'},
  'paramecium':{he:'נעלית',ru:'Парамеция'},
  'plasmodium':{he:'פלסמודיום מלריה',ru:'Малярийный плазмодий'},
  'dinoflagellates':{he:'דינופלגלטים',ru:'Динофлагелляты'},
  'stramenopiles':{he:'סטרמנופילים',ru:'Страменопилы'},
  'diatoms':{he:'דיאטומים',ru:'Диатомеи'},
  'phytophthora':{he:'פיטופטורה',ru:'Фитофтора'},
  'volvox':{he:'וולווקס',ru:'Вольвокс'},
  // ── Hominins ──
  'sahelanthropus':{he:'סהלנתרופוס',ru:'Сахелантроп'},
  'orrorin':{he:'אורורין',ru:'Оррорин'},
  'ardipithecus_r':{he:'ארדיפיתקוס',ru:'Ардипитек'},
  'au_anamensis':{he:'אוסטרלופיתקוס אנמנסיס',ru:'Австралопитек анамский'},
  'au_afarensis':{he:'לוסי אוסטרלופיתקוס',ru:'Австралопитек афарский'},
  'au_africanus':{he:'אוסטרלופיתקוס אפריקנוס',ru:'Австралопитек африканский'},
  'au_bahrelghazali':{he:'אוסטרלופיתקוס בהרלגזלי',ru:'Австралопитек бахр-эль-газальский'},
  'au_deyiremeda':{he:'אוסטרלופיתקוס דיירמדה',ru:'Австралопитек дейиремеда'},
  'au_garhi':{he:'אוסטרלופיתקוס גרהי',ru:'Австралопитек гархи'},
  'au_sediba':{he:'אוסטרלופיתקוס סדיבה',ru:'Австралопитек седиба'},
  'au_prometheus':{he:'כף רגל קטנה',ru:'Маленькая Нога'},
  'kenyanthropus':{he:'קניאנתרופוס',ru:'Кениантроп'},
  'par_aethiopicus':{he:'פרנתרופוס אתיופיקוס',ru:'Парантроп эфиопский'},
  'par_boisei':{he:'פרנתרופוס בויסי',ru:'Парантроп Бойса'},
  'par_robustus':{he:'פרנתרופוס רובוסטוס',ru:'Парантроп массивный'},
  'h_habilis':{he:'הומו הביליס',ru:'Человек умелый'},
  'h_erectus':{he:'הומו ארקטוס',ru:'Человек прямоходящий'},
  'h_rudolfensis':{he:'הומו רודולפנסיס',ru:'Человек рудольфский'},
  'h_antecessor':{he:'הומו אנטצסור',ru:'Человек-предшественник'},
  'h_heidelbergensis':{he:'הומו הידלברגנסיס',ru:'Гейдельбергский человек'},
  'h_bodoensis':{he:'הומו בודואנסיס',ru:'Человек бодоэнсис'},
  'h_floresiensis':{he:'הומו פלורסינסיס ההוביט',ru:'Хоббит человек флоресский'},
  'h_luzonensis':{he:'הומו לוזוננסיס',ru:'Человек лусонский'},
  'h_longi':{he:'איש הדרקון',ru:'Человек-дракон'},
  'h_naledi':{he:'הומו נלדי',ru:'Человек наледи'},
  'neanderthal':{he:'ניאנדרטלי',ru:'Неандерталец'},
  'denisovans':{he:'דניסובנים',ru:'Денисовец'},
  'h_sapiens':{he:'אדם נבון',ru:'Человек разумный'},
  // Aliases for duplicate HOMININS entries
  'homo-naledi':{he:'הומו נלדי',ru:'Человек наледи'},
  'homo-floresiensis':{he:'הומו פלורסינסיס',ru:'Человек флоресский'},
  'denisovan':{he:'דניסובנים',ru:'Денисовец'},
  'homo-sapiens':{he:'אדם נבון',ru:'Человек разумный'},
};

// Canonical HOMININS IDs to skip in search (duplicates with different IDs)
const HOMININ_SKIP_IDS = new Set(['homo-naledi','homo-floresiensis','denisovan']);

/* ===========================
   SEARCH INDEX — fuzzy + multilingual
   =========================== */
let searchIndex=null;
function normalizeSearchText(str){
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

function buildSearchIndex(){
  searchIndex=[];
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
    searchIndex.push({
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
    searchIndex.push({
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

function searchEntities(query){
  const q=normalizeSearchText(query);
  if(!q) return[];
  const scored=[];
  for(const x of searchIndex){
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

// ══════════════════════════════════════════════════════
// SEARCH UI
// ══════════════════════════════════════════════════════
const searchInput=document.getElementById('search-input');
const searchResults=document.getElementById('search-results');

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
    const subName=localName?m.name:''; // show English name as subtitle when displaying translated name
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
  // Handle legacy hom: prefixed IDs from old search entries
  if(id.startsWith('hom:')){
    const homId=id.slice(4);
    const canonId=canonicalHomininId(homId);
    // Try tree node first (hominins are now in the main tree)
    if(nodeMap[canonId]){
      id=canonId;
    } else if(nodeMap[homId]){
      id=homId;
    } else {
      // Map h_sapiens to its tree node ID
      if(homId === 'h_sapiens') id = 'homo-sapiens';
    }
  }
  const n=nodeMap[id];if(!n)return;
  highlightedId=id;
  // Ensure path is not collapsed
  let c=n;while(c._parent){c._parent._collapsed=false;c=c._parent;}
  layout();scheduleRender(true);applyT();
  // Pan to node
  const cx=window.innerWidth/2,cy=window.innerHeight/2;
  transform.x=cx-n._x*transform.s;
  transform.y=cy-n._y*transform.s;
  applyT();
  showMainPanel(n);
  history.replaceState(null,'','?node='+encodeURIComponent(id));
  setTimeout(()=>{highlightedId=null;scheduleRender();},2500);
};
