// ══════════════════════════════════════════════════════
// CORE — shared state, tree preprocessing, layout, i18n, theming, init
// ══════════════════════════════════════════════════════

// HOMININS, MAX_BRAIN, ERA_GROUPS, HOMININ_ID_ALIASES loaded from treeData.js
function canonicalHomininId(id){
  return HOMININ_ID_ALIASES[id]||id;
}
function getHomininById(id){
  const canonical=canonicalHomininId(id);
  return HOMININS.find(h=>h.id===canonical)||null;
}
function resolveHomininTarget(id){
  const canonical=canonicalHomininId(id);
  if(getHomininById(canonical)) return canonical;
  return null;
}

/* ===========================
   TAXON I18N — Hebrew + Russian names for search
   =========================== */
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

// ══════════════════════════════════════════════════════
// BUILD HOMININ SUBTREE
// ══════════════════════════════════════════════════════
function homininToTreeNode(h){
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

function buildHomininTree(){
  // Find hominini node in the tree (under Great Apes)
  let homininiNode=null;
  (function walk(n){
    if(n.id==='hominini'){homininiNode=n;return;}
    if(n.children) n.children.forEach(walk);
  })(TREE);
  if(!homininiNode){console.warn('hominini node not found in TREE');return;}

  // Define 4 group nodes
  const groups=[
    {id:'group-proto',icon:'🦴',color:'#8B5E3C',r:10,appeared:7,extinct:true,
      name:'Proto-Hominins',latin:'Early Hominini',era:'7–3 Ma',
      desc:'The earliest members of the human lineage — bipedal apes from Africa\'s forests and lakeshores. These species bridge the gap between the human-chimp common ancestor and the australopiths.',
      detail:'Proto-hominins show the first signs of bipedalism while retaining many ape-like features. They are known from fragmentary fossils in Chad, Kenya, and Ethiopia.',
      facts:[{l:'Time span',v:'7–3 Mya'},{l:'Key trait',v:'Early bipedalism'},{l:'Regions',v:'Chad, Kenya, Ethiopia'}],
      tags:['Bipedalism origins','Forest dwellers','Human-chimp split'],
      filter:'proto'},
    {id:'group-australopith',icon:'🐒',color:'#b07840',r:10,appeared:4.2,extinct:true,
      name:'Australopithecus',latin:'Genus Australopithecus',era:'4.2–1.8 Ma',
      desc:'The "southern apes" — small-brained but fully bipedal hominins that dominated Africa for over 2 million years. Includes Lucy (Au. afarensis), the most famous fossil hominin.',
      detail:'Australopiths were the first hominins to thrive in open savanna environments. Some species may have used simple tools before the emergence of Homo.',
      facts:[{l:'Time span',v:'4.2–1.8 Mya'},{l:'Famous fossil',v:'Lucy (AL 288-1)'},{l:'Brain range',v:'370–500 cc'}],
      tags:['Lucy','Bipedal','Savanna','Southern apes'],
      filter:'australopith'},
    {id:'group-paranthropus',icon:'💪',color:'#9B3A3A',r:9,appeared:2.7,extinct:true,
      name:'Paranthropus',latin:'Genus Paranthropus',era:'2.7–1.2 Ma',
      desc:'The "robust" hominins — with massive jaws, huge molars, and dramatic sagittal crests for anchoring powerful chewing muscles. A specialized side branch that coexisted with early Homo for over a million years.',
      detail:'Paranthropus represents an evolutionary experiment in dietary specialization. While Homo invested in brains and tools, Paranthropus invested in jaw power.',
      facts:[{l:'Time span',v:'2.7–1.2 Mya'},{l:'Key trait',v:'Massive jaws & molars'},{l:'Species',v:'3 known'}],
      tags:['Robust hominins','Massive jaws','Sagittal crest','Dead-end lineage'],
      filter:'paranthropus'},
    {id:'group-homo',icon:'🧠',color:'#6B8B5E',r:11,appeared:2.4,extinct:null,
      name:'Genus Homo',latin:'Genus Homo',era:'2.4 Ma – present',
      desc:'Our own genus — from the first stone toolmakers to the species that split the atom. Homo is defined by increasing brain size, sophisticated tool use, fire control, and eventually language and symbolic thought.',
      detail:'The genus Homo emerged in Africa around 2.4 million years ago and eventually spread across every continent. Only one species survives today.',
      facts:[{l:'Time span',v:'2.4 Mya – present'},{l:'Living species',v:'1 (H. sapiens)'},{l:'Max brain',v:'~1,750 cc (Neanderthal)'}],
      tags:['Tool makers','Fire','Language','Global dispersal'],
      filter:'homo'}
  ];

  // Build group nodes with their children from HOMININS
  const groupNodes=groups.map(g=>{
    const species=HOMININS.filter(h=>h.group===g.filter).map(homininToTreeNode);
    return {
      id:g.id, icon:g.icon, color:g.color, r:g.r,
      appeared:g.appeared, extinct:g.extinct,
      name:g.name, latin:g.latin, era:g.era,
      desc:g.desc, detail:g.detail,
      facts:g.facts, tags:g.tags,
      children:species
    };
  });

  homininiNode.children=groupNodes;
}
buildHomininTree();

// Canonical HOMININS IDs to skip in search (duplicates with different IDs)
const HOMININ_SKIP_IDS = new Set(['homo-naledi','homo-floresiensis','denisovan']);

// ══════════════════════════════════════════════════════
// NODE MAP + PREPROCESSING
// ══════════════════════════════════════════════════════
const nodeMap = {};
function preprocess(n,parent=null,depth=0){
  n._parent=parent; n.depth=depth;
  if(n._collapsed === undefined) n._collapsed=false;
  nodeMap[n.id]=n;
  if(n.children) n.children.forEach(c=>preprocess(c,n,depth+1));
}
preprocess(TREE);
// Collapse hominini subtree by default so tree isn't visually overloaded
if(nodeMap['hominini']) nodeMap['hominini']._collapsed=true;
['group-proto','group-australopith','group-paranthropus','group-homo'].forEach(id=>{
  if(nodeMap[id]) nodeMap[id]._collapsed=true;
});
window.getNodeById = id=>nodeMap[id];

// ══════════════════════════════════════════════════════
// SHARED MUTABLE STATE (used across modules)
// ══════════════════════════════════════════════════════
var viewMode='radial';
var currentEra = 3800;
var activeDomains = new Set(['luca','bacteria','archaea','eukaryota','protists','fungi','plantae','animalia']);
var showExtinct = true;
var transform={x:0,y:0,s:0.6};
var animDone=new Set();
var highlightedId=null;
var renderQueued=false;
var searchIndex=null;
var currentPanelNode=null;
var panelHistory=[];
var currentLang=localStorage.getItem('tol-lang')||'en';
var isDark = (localStorage.getItem('theme') || 'light') === 'dark';
var selectedHominin=null;
var currentHomFilter='all';
var compareMode=false;
var compareSelected=new Set();
var dnaSlotA = null;
var dnaSlotB = null;
var dnaSearchTarget = null;
var eraPlayId=null;
var _tipTimer = null;

// ══════════════════════════════════════════════════════
// LAYOUT
// ══════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════
// ERA FILTER
// ══════════════════════════════════════════════════════
function nodeInEra(n){
  if(!n.appeared) return true;
  const mya = n.appeared;
  const extinctMya = n.extinct || 0;
  const showFrom = currentEra;
  return mya >= extinctMya && mya <= showFrom + 200;
}

// ══════════════════════════════════════════════════════
// EXTINCT TOGGLE
// ══════════════════════════════════════════════════════
function toggleExtinct() {
  showExtinct = !showExtinct;
  document.getElementById('extinct-label').textContent = showExtinct ? 'Hide Extinct' : 'Show Extinct';
  document.getElementById('extinct-toggle').style.opacity = showExtinct ? '1' : '0.6';
  scheduleRender();
}

// ══════════════════════════════════════════════════════
// DOMAIN FILTER
// ══════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════
// i18n — EN / HE / RU  (TRANSLATIONS defined in js/uiData.js)
// ══════════════════════════════════════════════════════
function t(key){return(TRANSLATIONS[currentLang]&&TRANSLATIONS[currentLang][key])||TRANSLATIONS.en[key]||key;}

function setLang(lang){
  if(!TRANSLATIONS[lang])return;
  currentLang=lang;
  localStorage.setItem('tol-lang',lang);
  const isRtl=lang==='he';
  document.documentElement.dir=isRtl?'rtl':'ltr';
  document.documentElement.lang=lang;
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.lang===lang);
    btn.setAttribute('aria-pressed',btn.dataset.lang===lang?'true':'false');
  });
  applyI18n();
}

function applyI18n(){
  const el=id=>document.getElementById(id);
  const set=(id,v)=>{const e=el(id);if(e)e.textContent=v;};
  set('i-title',t('title'));
  set('i-subtitle',t('subtitle'));
  set('splash-title',t('title'));
  set('splash-years',t('splash_years'));
  const hints=el('i-hints');if(hints)hints.innerHTML=t('hint1')+'<br>'+t('hint2');
  const si=el('search-input');if(si)si.placeholder=t('search_ph');
  set('i-leg-title',t('leg_title'));
  set('i-leg-luca',t('leg_luca'));
  set('i-leg-bact',t('leg_bact'));
  set('i-leg-arch',t('leg_arch'));
  set('i-leg-plant',t('leg_plant'));
  set('i-leg-anim',t('leg_anim'));
  set('i-leg-fungi',t('leg_fungi'));
  set('i-leg-prot',t('leg_prot'));
  set('i-p-traits',t('p_traits'));
  set('i-p-evo',t('p_evo'));
  set('i-p-sub',t('p_sub'));
  set('i-btn-hominin',t('btn_hominin'));
  set('hom-title',t('hom_title'));
  set('hom-sub',t('hom_sub'));
  set('hom-close',t('hom_back'));
  set('i-hf-all',t('hom_all'));
  set('i-hf-proto',t('hom_proto'));
  set('i-hf-australo',t('hom_australo'));
  set('i-hf-paranth',t('hom_paranth'));
  set('i-hf-homo',t('hom_homo'));
  set('i-hf-surv',t('hom_surv'));
  const cb=el('compare-btn');if(cb)cb.textContent=t('compare_btn');
  // DNA Calculator i18n
  set('i-dna-title',t('dna_calc_title'));
  set('i-btn-dna-calc',t('dna_calc_btn'));
  set('i-dna-similarity-label',t('dna_similarity'));
  set('i-dna-preset-chimp',t('dna_preset_chimp'));
  set('i-dna-preset-banana',t('dna_preset_banana'));
  set('i-dna-preset-mushroom',t('dna_preset_mushroom'));
  set('i-dna-preset-bacterium',t('dna_preset_bacterium'));
  const dnaLabelA=el('dna-label-a');if(dnaLabelA&&!document.getElementById('dna-slot-a').classList.contains('filled'))dnaLabelA.textContent=t('dna_select_species');
  const dnaLabelB=el('dna-label-b');if(dnaLabelB&&!document.getElementById('dna-slot-b').classList.contains('filled'))dnaLabelB.textContent=t('dna_select_species');
  const ch=el('compare-hint');if(ch)ch.textContent=t('compare_hint');
  set('i-compare-title',t('compare_title'));
  set('i-compare-back',t('compare_back'));
  const hpe=el('hom-panel-empty');
  if(hpe){const parts=t('hom_empty').split('\n');hpe.innerHTML=parts.join('<br>');}
  // Nav buttons
  set('nav-back-label',t('nav_back'));
  set('nav-home-label',t('nav_home'));
  const navBackBtn=el('nav-back');
  if(navBackBtn) navBackBtn.setAttribute('aria-label',t('nav_back'));
  const navHomeBtn=el('nav-home');
  if(navHomeBtn) navHomeBtn.setAttribute('aria-label',t('nav_home'));
  // Update page title
  document.title=t('title')+' \u2014 '+t('subtitle').split(' ').slice(0,3).join(' ')+'...';
  // Update view toggle labels
  document.querySelectorAll('.view-btn').forEach(btn=>{
    const mode=btn.dataset.mode;
    if(mode==='radial')btn.innerHTML='&#9673; '+t('view_radial');
    else if(mode==='chronological')btn.innerHTML='&#8594; '+t('view_chrono');
    else if(mode==='cladogram')btn.innerHTML='&#9500; '+t('view_clado');
  });
  // Update play button
  const playBtn=document.getElementById('era-play');
  if(playBtn)playBtn.title=eraPlayId?t('era_pause'):t('era_play');
  // Rebuild era presets and extinction markers with translated labels
  buildEraPresets();
  buildExtinctionMarkers();
  updateSpeciesCount();
}

// ══════════════════════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════════════════════
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function applyTheme(){
  if(isDark){
    document.documentElement.setAttribute('data-theme','dark');
    document.getElementById('theme-btn').textContent='\u2600';
  } else {
    document.documentElement.setAttribute('data-theme','light');
    document.getElementById('theme-btn').textContent='\ud83c\udf19';
  }
  // Re-render SVG so stroke CSS vars pick up new --bg value
  scheduleRender();
}

function toggleTheme(){
  isDark=!isDark;
  localStorage.setItem('theme',isDark?'dark':'light');
  applyTheme();
}

// ══════════════════════════════════════════════════════
// LUCA OPENING ANIMATION
// ══════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════
// PARTICLES
// ══════════════════════════════════════════════════════
function spawnParticles(){
  return; // Disabled in modern scientific theme
  const container=document.getElementById('particles');
  for(let i=0;i<22;i++){
    const p=document.createElement('div');
    p.className='particle';
    const sz=1.5+Math.random()*3.5;
    const colors=['rgba(45,212,191,0.4)','rgba(122,184,96,0.4)','rgba(200,136,58,0.3)'];
    p.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;bottom:${Math.random()*25}%;background:${colors[Math.floor(Math.random()*3)]};animation:drift ${9+Math.random()*14}s linear ${Math.random()*12}s infinite;`;
    container.appendChild(p);
  }
}

// ══════════════════════════════════════════════════════
// INTRO ANIMATION
// ══════════════════════════════════════════════════════
function showIntro(){
  // Skip intro if loading a specific node from URL
  if(new URLSearchParams(location.search).get('node')) return;
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;z-index:999;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;transition:background 0s;';
  overlay.innerHTML=`
    <div style="font-family:'Inter',sans-serif;font-size:clamp(1.8rem,4vw,3rem);color:var(--parchment);text-align:center;letter-spacing:0.05em;opacity:0;transition:opacity 1.5s" id="intro-text1">${t('title')}</div>
    <div style="font-size:clamp(0.75rem,1.5vw,0.9rem);color:var(--gold-text);text-align:center;letter-spacing:0.25em;text-transform:uppercase;margin-top:0.8rem;opacity:0;transition:opacity 1.5s 0.5s" id="intro-text2">${t('subtitle')}</div>
    <div style="font-size:0.7rem;color:var(--sage);text-align:center;margin-top:1.5rem;opacity:0;transition:opacity 1.5s 1.2s;font-style:italic" id="intro-text3">${t('intro_quote')}</div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>{
    document.getElementById('intro-text1').style.opacity='1';
    document.getElementById('intro-text2').style.opacity='1';
    document.getElementById('intro-text3').style.opacity='1';
  });
  setTimeout(()=>{
    overlay.style.transition='opacity 1.2s';overlay.style.opacity='0';
    setTimeout(()=>overlay.remove(),1200);
  },3200);
}

// ══════════════════════════════════════════════════════
// LOADING
// ══════════════════════════════════════════════════════
function showLoading() {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.style.cssText = `
    position:fixed;inset:0;
    background:var(--bg, #1a1d23);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    z-index:9999;font-family:'Inter',system-ui,sans-serif;
    transition:opacity 600ms ease;
  `;
  loader.innerHTML = `
    <style>
      @keyframes loadBranchGrow{from{stroke-dashoffset:60;opacity:0}to{stroke-dashoffset:0;opacity:1}}
      @keyframes loadNodeAppear{from{r:0;opacity:0}to{opacity:1}}
      .load-branch{stroke-dasharray:60;opacity:0;animation:loadBranchGrow 0.5s ease forwards}
      .load-node{opacity:0;animation:loadNodeAppear 0.3s ease forwards}
    </style>
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="100" r="4" fill="#8b5cf6" class="load-node" style="animation-delay:0s"/>
      <line x1="60" y1="96" x2="60" y2="70" stroke="#8b5cf6" stroke-width="2" class="load-branch" style="animation-delay:0.2s"/>
      <line x1="60" y1="70" x2="30" y2="50" stroke="#ef4444" stroke-width="1.5" class="load-branch" style="animation-delay:0.4s"/>
      <line x1="60" y1="70" x2="90" y2="50" stroke="#3b82f6" stroke-width="1.5" class="load-branch" style="animation-delay:0.4s"/>
      <circle cx="30" cy="50" r="3" fill="#ef4444" class="load-node" style="animation-delay:0.6s"/>
      <circle cx="90" cy="50" r="3" fill="#3b82f6" class="load-node" style="animation-delay:0.6s"/>
      <line x1="30" y1="50" x2="15" y2="30" stroke="#22c55e" stroke-width="1" class="load-branch" style="animation-delay:0.8s"/>
      <line x1="30" y1="50" x2="45" y2="30" stroke="#f59e0b" stroke-width="1" class="load-branch" style="animation-delay:0.8s"/>
      <line x1="90" y1="50" x2="75" y2="30" stroke="#f97316" stroke-width="1" class="load-branch" style="animation-delay:0.8s"/>
      <line x1="90" y1="50" x2="105" y2="30" stroke="#a855f7" stroke-width="1" class="load-branch" style="animation-delay:0.8s"/>
      <circle cx="15" cy="30" r="2.5" fill="#22c55e" class="load-node" style="animation-delay:1s"/>
      <circle cx="45" cy="30" r="2.5" fill="#f59e0b" class="load-node" style="animation-delay:1s"/>
      <circle cx="75" cy="30" r="2.5" fill="#f97316" class="load-node" style="animation-delay:1s"/>
      <circle cx="105" cy="30" r="2.5" fill="#a855f7" class="load-node" style="animation-delay:1s"/>
    </svg>
    <div style="margin-top:20px;font-size:13px;color:var(--text-secondary, #a0a4b0);letter-spacing:0.08em;">
      Loading Tree of Life...
    </div>
  `;
  document.body.appendChild(loader);
  return loader;
}
function hideLoading(loader) {
  if (!loader) return;
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 600);
}

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
function init(){
  const loader = showLoading();
  const _splash = document.getElementById('splash');
  const _taglineEl = document.getElementById('splash-tagline');
  if (_splash && _taglineEl) {
    _taglineEl.textContent = FACTS.getLoadingFact(currentLang);
    const _splashTitle = document.getElementById('splash-title');
    const _splashYears = document.getElementById('splash-years');
    if(_splashTitle) _splashTitle.textContent = t('title');
    if(_splashYears) _splashYears.textContent = t('splash_years');
    const _dismissSplash = () => {
      _splash.style.opacity = '0';
      setTimeout(() => { _splash.style.display = 'none'; animateTreeEntrance(); }, 800);
    };
    setTimeout(_dismissSplash, 2800);
    _splash.addEventListener('click', _dismissSplash);
  }
  function assignDomains(node, domain) {
    node._domain = domain;
    if (node.children) {
      node.children.forEach(child => {
        const childDomain = (node.id === 'luca' || node.id === 'eukaryota') ? child.id : domain;
        assignDomains(child, childDomain);
      });
    }
  }
  assignDomains(TREE, 'luca');
  layout();scheduleRender(true);applyT();
  setTimeout(() => hideLoading(loader), 400);
  spawnParticles();
  buildExtinctionMarkers();
  buildEraPresets();
  updateSpeciesCount();
  updateEraTint(currentEra);
  buildSearchIndex();
  const EXTINCTION_EVENTS = [
    { name: 'End-Ordovician', time: 443, short: '†' },
    { name: 'Late Devonian', time: 372, short: '†' },
    { name: 'The Great Dying', time: 252, short: '†' },
    { name: 'End-Triassic', time: 201, short: '†' },
    { name: 'K-Pg Extinction', time: 66, short: '†' }
  ];
  const INNOVATIONS = [
    { name: 'First Photosynthesis', time: 3500, icon: '☀️' },
    { name: 'First Eukaryotes', time: 2100, icon: '🔬' },
    { name: 'Cambrian Explosion', time: 541, icon: '💥' },
    { name: 'First Land Plants', time: 470, icon: '🌿' },
    { name: 'First Flight', time: 150, icon: '🦅' },
    { name: 'First Flowers', time: 130, icon: '🌸' }
  ];
  function addTimelineMarkers() {
    const timeline = document.getElementById('timeline') ||
      document.getElementById('era-bar') ||
      document.getElementById('timeline-bar') ||
      document.querySelector('.timeline') ||
      document.querySelector('.era-bar') ||
      document.querySelector('[class*="timeline"]');

    if (!timeline) {
      console.warn('Timeline element not found');
      return;
    }

    timeline.id = 'timeline';
    const totalTime = 3800;
    EXTINCTION_EVENTS.forEach(ext => {
      const pct = (1 - ext.time / totalTime) * 100;
      const marker = document.createElement('div');
      marker.style.cssText = `position:absolute;left:${pct}%;top:0;bottom:0;width:2px;background:#ef4444;opacity:0.7;cursor:pointer;z-index:10;pointer-events:all;`;
      marker.title = ext.name + ' (' + ext.time + ' Ma)';
      const label = document.createElement('div');
      label.style.cssText = `position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:10px;color:#ef4444;font-weight:700;white-space:nowrap;font-family:'Inter',sans-serif;`;
      label.textContent = '†';
      marker.appendChild(label);
      marker.addEventListener('mouseenter', () => { label.textContent = ext.name; });
      marker.addEventListener('mouseleave', () => { label.textContent = '†'; });
      timeline.appendChild(marker);
    });
    INNOVATIONS.forEach(inv => {
      const pct = (1 - inv.time / totalTime) * 100;
      const marker = document.createElement('div');
      marker.style.cssText = `position:absolute;left:${pct}%;top:0;bottom:0;width:1px;background:#2e7d32;opacity:0.5;cursor:pointer;z-index:9;pointer-events:all;`;
      marker.title = inv.name + ' (' + inv.time + ' Ma)';
      const label = document.createElement('div');
      label.style.cssText = `position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);font-size:11px;white-space:nowrap;transition:transform 150ms ease;`;
      label.textContent = inv.icon;
      label.title = inv.name;
      marker.appendChild(label);
      marker.addEventListener('mouseenter', () => { label.style.transform = 'translateX(-50%) scale(1.4)'; });
      marker.addEventListener('mouseleave', () => { label.style.transform = 'translateX(-50%) scale(1)'; });
      timeline.appendChild(marker);
    });
  }
  setTimeout(addTimelineMarkers, 500);
  // Restore saved theme & language
  isDark=localStorage.getItem('theme')==='dark';
  applyTheme();
  currentLang=localStorage.getItem('tol-lang')||'en';
  document.documentElement.dir=currentLang==='he'?'rtl':'ltr';
  document.documentElement.lang=currentLang;
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.lang===currentLang);
    btn.setAttribute('aria-pressed',btn.dataset.lang===currentLang?'true':'false');
  });
  applyI18n();
  // Restore URL state (?node=id)
  const urlNode=new URLSearchParams(location.search).get('node');
  if(urlNode){
    setTimeout(()=>navigateTo(urlNode),120);
  } else {
    showIntro();
  }
  // Keyboard shortcut hint
  setTimeout(()=>{
    const hint=document.getElementById('shortcuts-hint');
    if(hint&&!localStorage.getItem('hints-shown')){
      hint.style.opacity='1';
      setTimeout(()=>{hint.style.opacity='0';},4000);
      localStorage.setItem('hints-shown','1');
    }
  },3000);
}
