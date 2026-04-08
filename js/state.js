// ══════════════════════════════════════════════════════
// STATE — shared mutable state across all modules
// ══════════════════════════════════════════════════════

// Mutable state object — all modules import and mutate this directly.
// Using a single object avoids ES module live-binding reassignment issues.
export const state = {
  // ── View & Layout ──
  viewMode: 'radial',       // 'radial' | 'cladogram' | 'chronological' | 'playback'
  currentEra: 3800,
  showExtinct: true,
  activeDomains: new Set(['luca','bacteria','archaea','eukaryota','protists','fungi','plantae','animalia']),
  highlightedId: null,

  // ── Panel ──
  currentPanelNode: null,
  focusedBranch: null,

  // ── Transform (zoom/pan) ──
  transform: { x: 0, y: 0, s: 0.2 },

  // ── Search ──
  searchIndex: null,

  // ── Playback Mode ──
  playbackMode: false,
  playbackCursor: 3800,
  playbackSpeed: 1,
  playbackAnimId: null,
  playbackStartTime: null,
  playbackStartCursor: 3800,
  playbackNodeStates: new Map(),
  discoveredNodes: new Set(),
  playbackEvents: [],
  previousViewMode: 'radial',
  pbLastEraBadge: '',
  pbFiredExtinctions: new Set(),

  // ── Navigation ──
  _suppressPopstate: false,

  // ── Theme / i18n ──
  currentLang: 'en',
  isDark: true,

  // ── Accessibility ──
  focusedNodeId: null,         // currently keyboard-focused tree node
  _panelTriggerFocus: null,    // DOM element that opened the current modal (for focus restore)

  // ── Render internals ──
  renderQueued: false,

  // ── Evo Path (set by evoPath.js) ──
  evoPathActive: false,
  evoPathSet: new Set(),
  evoPathEdgeSet: new Set(),

  // ── Collapsed-by-default tree feature ──
  collapsedByDefault: true,
  depthLimit: 1,            // 0 = LUCA only; 1 = LUCA + domains; max = full base tree
  maxBaseDepth: 1,          // computed once at startup in app.js
  baseTreeZoom: 0,          // floor zoom for frameSubtree(); computed at startup
  speciesLoaded: false,     // whether expandTree() has been merged into the live tree
  _draggingSlider: false,   // PR 2: true while user is dragging the depth slider
};

// ── Immutable shared structures ──
export const nodeMap = {};
export const navStack = [];
export const animDone = new Set();
export const confirmedPhotoUrls = new Map();
export const PHOTO_STATUS_CACHE = new Map();
export const PHOTO_VERIFY_PROMISES = new Map();

// ── Constants ──
export const HUMAN_PATH = new Set([
  'luca','eukaryota','animalia','vertebrates','mammals',
  'primates','great-apes','hominini','group-homo','h_sapiens'
]);
export const HOMININ_SKIP_IDS = new Set(['homo-naledi','homo-floresiensis','denisovan']);
export const MIN_ARC_PX = 75;
export const MAX_ARC_PER_LEAF = 110;
export const PLAYBACK_LOCK_PREVIEW = 200;
export const PLAYBACK_DURATION = 90000; // 90 seconds at 1x

// ── Multilingual taxon names for search ──
export const TAXON_I18N = {
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
  // Aliases
  'homo-naledi':{he:'הומו נלדי',ru:'Человек наледи'},
  'homo-floresiensis':{he:'הומו פלורסינסיס',ru:'Человек флоресский'},
  'denisovan':{he:'דניסובנים',ru:'Денисовец'},
  'homo-sapiens':{he:'אדם נבון',ru:'Человек разумный'},
};
