/**
 * sapiensData.js — Static content for the Homo sapiens showcase page.
 * Pure data module: zero logic, only exported constants.
 */

// ---------------------------------------------------------------------------
// 1. SAPIENS_HERO
// ---------------------------------------------------------------------------
export const SAPIENS_HERO = {
  bgImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Serengeti_National_Park_Lion.jpg/1280px-Serengeti_National_Park_Lion.jpg',

  overline: {
    en: 'Homo sapiens',
    he: 'הומו ספיינס',
    ru: 'Homo sapiens',
  },

  tagline: {
    en: '300,000 Years of Human Story',
    he: '300,000 שנות הסיפור האנושי',
    ru: '300 000 лет человеческой истории',
  },

  counters: [
    {
      value: '8B',
      label: { en: 'Individuals alive today', he: 'בני אדם חיים היום', ru: 'Живых людей сегодня' },
    },
    {
      value: '1',
      label: { en: 'Species — us', he: 'מין יחיד — אנחנו', ru: 'Один вид — мы' },
    },
    {
      value: '300K',
      label: { en: 'Years since first appearance', he: 'שנים מאז ההופעה הראשונה', ru: 'Лет с момента появления' },
    },
  ],

  etymologyTitle: {
    en: 'What Does "Sapiens" Mean?',
    he: 'מה פירוש "ספיינס"?',
    ru: 'Что означает «sapiens»?',
  },

  etymologyContent: {
    en: 'Carl Linnaeus gave us our name in 1758 in Systema Naturae. "Homo sapiens" is Latin for "wise man" or "knowing man." Linnaeus classified humans alongside other primates — a radical act at the time — and added the instruction "Know thyself," adapted from the Delphic oracle, as the only species description.',
    he: 'קרל לינאוס נתן לנו את שמנו בשנת 1758 בספרו Systema Naturae. "הומו ספיינס" בלטינית פירושו "האדם החכם" או "האדם היודע". לינאוס סיווג את בני האדם יחד עם פרימטים אחרים — מעשה קיצוני בזמנו — והוסיף את ההנחיה "דע את עצמך", שאולה מהאורקל הדלפי, כתיאור המין היחיד.',
    ru: 'Карл Линней дал нам имя в 1758 году в «Системе природы». «Homo sapiens» — латынь, означающая «человек мудрый» или «человек знающий». Линней классифицировал людей вместе с другими приматами — радикальный поступок для своего времени — и добавил указание «Познай самого себя», заимствованное у дельфийского оракула, в качестве единственного описания вида.',
  },
};

// ---------------------------------------------------------------------------
// 2. MIGRATION_ROUTES (SVG Q-bezier on 100×50 viewBox)
// ---------------------------------------------------------------------------
export const MIGRATION_ROUTES = [
  // Equirectangular 100×50: x=0 is 180°W, x=50 is 0°(Greenwich), x=100 is 180°E
  // y=0 is 90°N, y=25 is equator, y=50 is 90°S
  // East Africa origin ≈ x:56, y:31 (Ethiopia/Rift Valley)
  // Routes form a branching tree: Origin → Middle East → (Europe | Central Asia → East Asia → Americas) and → (South Asia → Australia → Polynesia)
  {
    id: 'middle-east',
    path: 'M 56 31 Q 58 27 60 24',
    date: 120,
    label: { en: 'Middle East', he: 'המזרח התיכון', ru: 'Ближний Восток' },
    site: { en: 'Skhul & Qafzeh, Israel', he: 'סחול וקפזה, ישראל', ru: 'Схул и Кафзе, Израиль' },
  },
  {
    id: 'south-asia',
    path: 'M 60 24 Q 64 26 68 27 Q 72 28 75 28',
    date: 70,
    label: { en: 'South Asia', he: 'דרום אסיה', ru: 'Южная Азия' },
    site: { en: 'Coastal route via Arabia & India', he: 'מסלול חופי דרך ערב והודו', ru: 'Прибрежный маршрут через Аравию и Индию' },
  },
  {
    id: 'australia',
    path: 'M 75 28 Q 79 32 82 38',
    date: 65,
    label: { en: 'Australia', he: 'אוסטרליה', ru: 'Австралия' },
    site: { en: 'Madjedbebe — 90km sea crossing', he: 'מדג\'דבבה — חציית ים 90 ק"מ', ru: 'Маджедбебе — 90 км по морю' },
  },
  {
    id: 'europe',
    path: 'M 60 24 Q 55 19 50 17',
    date: 45,
    label: { en: 'Europe', he: 'אירופה', ru: 'Европа' },
    site: { en: 'Bacho Kiro, Bulgaria', he: 'בכו קירו, בולגריה', ru: 'Бачо Киро, Болгария' },
  },
  {
    id: 'central-asia',
    path: 'M 60 24 Q 66 20 72 18',
    date: 40,
    label: { en: 'Central Asia', he: 'מרכז אסיה', ru: 'Центральная Азия' },
    site: { en: 'Steppe corridor', he: 'מסדרון הערבה', ru: 'Степной коридор' },
  },
  {
    id: 'east-asia',
    path: 'M 72 18 Q 78 19 82 22',
    date: 35,
    label: { en: 'East Asia', he: 'מזרח אסיה', ru: 'Восточная Азия' },
    site: { en: 'Tianyuan Cave, China', he: 'מערת טיאניואן, סין', ru: 'Пещера Тяньюань, Китай' },
  },
  {
    id: 'americas',
    path: 'M 82 22 Q 89 14 95 7 Q 5 6 15 15 Q 20 20 25 25',
    date: 15,
    label: { en: 'Americas', he: 'אמריקה', ru: 'Америка' },
    site: { en: 'Via Beringia; Monte Verde, Chile', he: 'דרך ברינגיה; מונטה וורדה, צ\'ילה', ru: 'Через Берингию; Монте-Верде, Чили' },
  },
  {
    id: 'polynesia',
    path: 'M 82 38 Q 88 37 93 35',
    date: 3,
    label: { en: 'Polynesia', he: 'פולינזיה', ru: 'Полинезия' },
    site: { en: 'Open-ocean navigation', he: 'ניווט באוקיינוס הפתוח', ru: 'Навигация в открытом океане' },
  },
];

// ---------------------------------------------------------------------------
// 3. MIGRATION_ORIGIN
// ---------------------------------------------------------------------------
export const MIGRATION_ORIGIN = { x: 56, y: 31, date: 300 }; // East Africa (Rift Valley)

// ---------------------------------------------------------------------------
// 4. MIGRATION_MAP_IMAGE
// ---------------------------------------------------------------------------
export const MIGRATION_MAP_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Equirectangular-projection.jpg/1280px-Equirectangular-projection.jpg';

// ---------------------------------------------------------------------------
// 5. TRAIT_CARDS
// ---------------------------------------------------------------------------
export const TRAIT_CARDS = [
  {
    id: 'brain',
    icon: '🧠',
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Gyrification_in_Human_Brain.png/640px-Gyrification_in_Human_Brain.png',
    label: { en: 'The Remarkable Brain', he: 'המוח המדהים', ru: 'Удивительный мозг' },
    stat: '86B',
    unit: { en: 'neurons', he: 'נוירונים', ru: 'нейронов' },
    desc: {
      en: '🧠 At ~1,400 cm³ the human brain is three times larger than expected for a mammal our size. Uniquely folded cortex, massive prefrontal lobe, and dense inter-hemispheric connections underpin abstract thought, language, and creativity.',
      he: '🧠 במשקל של כ-1,400 סמ"ק, המוח האנושי גדול פי שלוש מהמצופה ממינית בגודלנו. קליפת המוח המקופלת בצורה ייחודית, האונה הקדמית המסיבית וחיבורים בין-המיספריים צפופים מניחים את הבסיס לחשיבה מופשטת, שפה ויצירתיות.',
      ru: '🧠 При объёме ~1 400 см³ человеческий мозг втрое крупнее, чем ожидается для млекопитающего нашего размера. Уникально сложенная кора, массивная префронтальная доля и плотные межполушарные связи лежат в основе абстрактного мышления, языка и творчества.',
    },
    funFact: {
      en: '💡 Your brain generates about 20 watts of power — enough to dim a light bulb — while consuming only 20% of your body\'s energy despite being just 2% of your mass.',
      he: '💡 המוח שלך מייצר כ-20 וואט — מספיק להדלקת נורה חלשה — תוך שהוא צורך רק 20% מאנרגיית הגוף, למרות שהוא מהווה רק 2% ממשקלו.',
      ru: '💡 Ваш мозг вырабатывает около 20 ватт — достаточно, чтобы зажечь лампочку — потребляя всего 20% энергии тела, хотя составляет лишь 2% его массы.',
    },
    cta: { en: 'Explore Brain Evolution', he: 'חקור את אבולוציית המוח', ru: 'Исследуйте эволюцию мозга' },
  },
  {
    id: 'language',
    icon: '💬',
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Rosetta_Stone.JPG/640px-Rosetta_Stone.JPG',
    label: { en: 'Language & Symbolic Thought', he: 'שפה וחשיבה סמלית', ru: 'Язык и символическое мышление' },
    stat: '7,000+',
    unit: { en: 'languages spoken today', he: 'שפות מדוברות כיום', ru: 'языков говорят сегодня' },
    desc: {
      en: '💬 Language is our superpower. Uniquely among animals, we can share abstract concepts, cooperate across generations, and accumulate knowledge in writing. The FOXP2 gene — also present in Neanderthals — is linked to speech and language circuits.',
      he: '💬 שפה היא כוח העל שלנו. בצורה ייחודית בין בעלי החיים, אנו יכולים לשתף מושגים מופשטים, לשתף פעולה בין דורות ולצבור ידע בכתיבה. הגן FOXP2 — הנמצא גם אצל הניאנדרתלים — קשור למעגלי דיבור ושפה.',
      ru: '💬 Язык — наша сверхспособность. Уникально среди животных, мы можем обмениваться абстрактными понятиями, сотрудничать между поколениями и накапливать знания в письменной форме. Ген FOXP2 — присутствующий также у неандертальцев — связан с речевыми и языковыми цепями.',
    },
    funFact: {
      en: '🗣️ The oldest known written symbols date to ~5,000 years ago in Mesopotamia — but spoken language likely emerged 100,000+ years ago based on brain anatomy fossils.',
      he: '🗣️ הסמלים הכתובים הידועים הקדומים ביותר מתוארכים לכ-5,000 שנה לפני הספירה במסופוטמיה — אך שפה מדוברת כנראה צמחה לפני 100,000+ שנה על בסיס מאובני אנטומיית המוח.',
      ru: '🗣️ Древнейшие известные письменные символы датируются ~5 000 лет назад в Месопотамии — но устная речь, вероятно, появилась 100 000+ лет назад, судя по ископаемой анатомии мозга.',
    },
    cta: { en: 'See Language Origins', he: 'ראה את מקורות השפה', ru: 'Смотрите истоки языка' },
  },
  {
    id: 'technology',
    icon: '🔧',
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bifaz_de_El_Sartalejo.jpg/640px-Bifaz_de_El_Sartalejo.jpg',
    label: { en: 'Technology & Cumulative Culture', he: 'טכנולוגיה ותרבות מצטברת', ru: 'Технология и накопленная культура' },
    stat: '3.3M',
    unit: { en: 'years of tool use', he: 'שנות שימוש בכלים', ru: 'лет использования орудий' },
    desc: {
      en: '🔧 From Lomekwi stone flakes 3.3 million years ago to quantum computers, tool use defines our lineage. Crucially, humans accumulate technological knowledge across generations — the "ratchet effect" — allowing exponential cultural complexity impossible for any other species.',
      he: '🔧 מסכיני האבן של לומקווי לפני 3.3 מיליון שנה ועד למחשבים קוונטיים, שימוש בכלים מגדיר את השושלת שלנו. החשוב מכך, בני האדם צוברים ידע טכנולוגי על פני דורות — "אפקט המחגר" — המאפשר מורכבות תרבותית אקספוננציאלית שאינה אפשרית לאף מין אחר.',
      ru: '🔧 От каменных отщепов Ломекви 3,3 миллиона лет назад до квантовых компьютеров — использование орудий определяет нашу линию. Что важно, люди накапливают технологические знания между поколениями — «эффект храповика» — что позволяет экспоненциально сложную культуру, невозможную для любого другого вида.',
    },
    funFact: {
      en: '⚙️ The stone hand axe was used for over 1 million years with almost no design changes — then in the last 200 years we went from steam engines to smartphones.',
      he: '⚙️ גרזן היד האבני שימש במשך יותר מ-1 מיליון שנה כמעט ללא שינויי עיצוב — ואז ב-200 השנים האחרונות עברנו ממנועי קיטור לסמארטפונים.',
      ru: '⚙️ Каменное ручное рубило использовалось более 1 миллиона лет почти без изменений дизайна — а потом за последние 200 лет мы прошли путь от паровых машин до смартфонов.',
    },
    cta: { en: 'Trace Technology History', he: 'עקוב אחר היסטוריית הטכנולוגיה', ru: 'Проследите историю технологий' },
  },
  {
    id: 'dna',
    icon: '🧬',
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/DNA_orbit_animated.gif/640px-DNA_orbit_animated.gif',
    label: { en: 'DNA & Shared Ancestry', he: 'DNA ואבות משותפים', ru: 'ДНК и общее происхождение' },
    stat: '99.9%',
    unit: { en: 'DNA shared among all humans', he: 'DNA משותף לכלל בני האדם', ru: 'ДНК, общей для всех людей' },
    desc: {
      en: '🧬 All 8 billion of us share 99.9% identical DNA. We differ from chimpanzees by only ~1.2% — yet that fraction underlies everything human. Non-African humans carry ~1–4% Neanderthal DNA and some populations retain up to 5% Denisovan DNA.',
      he: '🧬 כל 8 מיליארד מאיתנו חולקים DNA זהה ב-99.9%. אנו שונים מהשימפנזים רק בכ-1.2% — אך חלק זה עומד בבסיס כל מה שאנושי. בני אדם לא-אפריקאים נושאים כ-1–4% DNA ניאנדרתלי ואוכלוסיות מסוימות שומרות על עד 5% DNA דניסובי.',
      ru: '🧬 Все 8 миллиардов из нас разделяют 99,9% идентичной ДНК. Мы отличаемся от шимпанзе всего на ~1,2% — но именно эта доля лежит в основе всего человеческого. Не-африканские люди несут ~1–4% неандертальской ДНК, а некоторые популяции сохраняют до 5% денисовской ДНК.',
    },
    funFact: {
      en: '🔬 You share 60% of your DNA with a banana, and 85% with a mouse — proving all life on Earth traces back to a single common ancestor billions of years ago.',
      he: '🔬 אתה חולק 60% מה-DNA שלך עם בננה, ו-85% עם עכבר — מה שמוכיח שכל החיים על כדור הארץ מצביעים על אב משותף אחד לפני מיליארדי שנים.',
      ru: '🔬 Вы разделяете 60% ДНК с бананом и 85% с мышью — доказывая, что всё живое на Земле восходит к единому общему предку миллиарды лет назад.',
    },
    cta: { en: 'Compare Your DNA', he: 'השווה את ה-DNA שלך', ru: 'Сравните вашу ДНК' },
  },
];

// ---------------------------------------------------------------------------
// 6. SKULL_IMAGES
// ---------------------------------------------------------------------------
export const SKULL_IMAGES = {
  chimpanzee: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Pan_troglodytes_02_MWNH_230.jpg/{W}px-Pan_troglodytes_02_MWNH_230.jpg',
    emoji: '🐒',
    volume: 400,
    height: 70,
    name: { en: 'Chimpanzee', he: 'שימפנזה', ru: 'Шимпанзе' },
  },
  erectus: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Homo_erectus_skull.jpg/{W}px-Homo_erectus_skull.jpg',
    emoji: '🔥',
    volume: 900,
    height: 88,
    name: { en: 'Homo erectus', he: 'הומו ארקטוס', ru: 'Homo erectus' },
  },
  sapiens: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Human_Skull_Lateral_View_Unlabeled.jpg/{W}px-Human_Skull_Lateral_View_Unlabeled.jpg',
    emoji: '🧠',
    volume: 1400,
    height: 100,
    highlight: true,
    name: { en: 'Homo sapiens', he: 'הומו ספיינס', ru: 'Homo sapiens' },
  },
  neanderthal: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Neanderthal_Skull_%288624714463%29.jpg/{W}px-Neanderthal_Skull_%288624714463%29.jpg',
    emoji: '🏔️',
    volume: 1500,
    height: 103,
    surprise: true,
    name: { en: 'Neanderthal', he: 'ניאנדרתל', ru: 'Неандерталец' },
  },
};

// ---------------------------------------------------------------------------
// 7. NEURAL_DENSITY
// ---------------------------------------------------------------------------
export const NEURAL_DENSITY = [
  {
    id: 'sapiens-neurons',
    title: { en: 'Sapiens Cortical Neurons', he: 'נוירונים קורטיקליים של ספיינס', ru: 'Корковые нейроны сапиенс' },
    value: '16B',
    unit: { en: 'cortical neurons', he: 'נוירונים קורטיקליים', ru: 'корковых нейронов' },
    desc: {
      en: 'The human cerebral cortex holds ~16 billion neurons — more than any other primate — enabling complex reasoning and abstract thought.',
      he: 'קליפת המוח האנושית מכילה כ-16 מיליארד נוירונים — יותר מכל פרימט אחר — המאפשרים חשיבה מורכבת וחשיבה מופשטת.',
      ru: 'Кора головного мозга человека содержит ~16 миллиардов нейронов — больше, чем у любого другого примата — обеспечивая сложное рассуждение и абстрактное мышление.',
    },
    highlight: true,
  },
  {
    id: 'neanderthal-neurons',
    title: { en: 'Neanderthal Cortical Neurons', he: 'נוירונים קורטיקליים ניאנדרתליים', ru: 'Корковые нейроны неандертальцев' },
    value: '~12B',
    unit: { en: 'cortical neurons (estimated)', he: 'נוירונים קורטיקליים (מוערך)', ru: 'корковых нейронов (оценка)' },
    desc: {
      en: 'Neanderthals had larger overall brains but an estimated ~12B cortical neurons, with relatively more occipital (visual) processing and less frontal integration.',
      he: 'לניאנדרתלים היו מוחות גדולים יותר בסך הכל, אך כ-12 מיליארד נוירונים קורטיקליים מוערכים, עם עיבוד עורפי (חזותי) יחסי רב יותר ואינטגרציה חזיתית פחותה.',
      ru: 'У неандертальцев был больший общий мозг, но примерно ~12B корковых нейронов, с относительно большей затылочной (зрительной) обработкой и меньшей фронтальной интеграцией.',
    },
  },
  {
    id: 'prefrontal',
    title: { en: 'Prefrontal Cortex', he: 'קליפת המוח הקדם-מצחית', ru: 'Префронтальная кора' },
    value: '38%',
    unit: { en: 'of neocortex (sapiens)', he: 'מהנאוקורטקס (ספיינס)', ru: 'неокортекса (сапиенс)' },
    desc: {
      en: 'The human prefrontal cortex is proportionally the largest of any primate, governing planning, social cognition, and impulse control.',
      he: 'קליפת המוח הקדם-מצחית האנושית היא הגדולה ביחס לכל פרימט, ממשלת על תכנון, קוגניציה חברתית ושליטה בדחפים.',
      ru: 'Префронтальная кора человека пропорционально наибольшая среди всех приматов, управляет планированием, социальным познанием и контролем импульсов.',
    },
  },
  {
    id: 'occipital',
    title: { en: 'Occipital Lobe Advantage', he: 'יתרון האונה העורפית', ru: 'Преимущество затылочной доли' },
    value: 'Larger',
    unit: { en: 'in Neanderthals', he: 'אצל ניאנדרתלים', ru: 'у неандертальцев' },
    desc: {
      en: 'Neanderthals had proportionally larger occipital lobes (vision processing) — possibly an adaptation to low-light European environments rather than enhanced social cognition.',
      he: 'לניאנדרתלים היו אונות עורפיות גדולות יחסית (עיבוד חזותי) — אולי הסתגלות לסביבות אירופאיות עם תאורה נמוכה ולא קוגניציה חברתית משופרת.',
      ru: 'У неандертальцев были пропорционально большие затылочные доли (обработка зрения) — возможно, адаптация к условиям слабой освещённости в Европе, а не к усиленному социальному познанию.',
    },
  },
];

// ---------------------------------------------------------------------------
// 8. BRAIN_ENERGY
// ---------------------------------------------------------------------------
export const BRAIN_ENERGY = [
  {
    emoji: '⚡',
    text: {
      en: '2% of body mass, 20% of energy — the brain is the most expensive organ you own.',
      he: '2% ממסת הגוף, 20% מהאנרגיה — המוח הוא האיבר היקר ביותר שבבעלותך.',
      ru: '2% массы тела, 20% энергии — мозг это самый дорогой орган, которым вы владеете.',
    },
  },
  {
    emoji: '💡',
    text: {
      en: 'Running at ~20 watts, your brain could power a dim light bulb — continuously, night and day.',
      he: 'פועל בכ-20 וואט, המוח שלך יכול להפעיל נורה חלשה — ברציפות, יום ולילה.',
      ru: 'Работая на ~20 ваттах, ваш мозг мог бы питать тусклую лампочку — непрерывно, днём и ночью.',
    },
  },
  {
    emoji: '🍳',
    text: {
      en: 'Cooking unlocked the energy surplus that fueled brain expansion — our big brains are a direct product of fire.',
      he: 'הבישול שחרר את עודף האנרגיה שהזין את התרחבות המוח — המוחות הגדולים שלנו הם תוצר ישיר של האש.',
      ru: 'Приготовление пищи высвободило избыток энергии, который питал расширение мозга — наши большие мозги являются прямым продуктом огня.',
    },
  },
  {
    emoji: '🦠',
    text: {
      en: 'As our brains grew, our guts shrank — we traded digestive power for cognitive power over 2 million years.',
      he: 'כשהמוחות שלנו גדלו, המעיים שלנו התכווצו — החלפנו כוח עיכול בכוח קוגניטיבי במשך 2 מיליון שנה.',
      ru: 'По мере роста нашего мозга кишечник сократился — мы обменяли пищеварительную силу на когнитивную за 2 миллиона лет.',
    },
  },
];

// ---------------------------------------------------------------------------
// 9. BRAIN_TIMELINE
// ---------------------------------------------------------------------------
export const BRAIN_TIMELINE = [
  {
    date: 6,
    unit: 'Ma',
    title: { en: 'Chimp–Human Split', he: 'פיצול שימפנזה-אדם', ru: 'Расхождение шимпанзе и человека' },
    desc: { en: 'Last common ancestor of humans and chimpanzees. Brain ~400 cc.', he: 'אב משותף אחרון של בני אדם ושימפנזים. מוח כ-400 סמ"ק.', ru: 'Последний общий предок людей и шимпанзе. Мозг ~400 см³.' },
  },
  {
    date: 2.5,
    unit: 'Ma',
    title: { en: 'First Stone Tools', he: 'כלי אבן ראשונים', ru: 'Первые каменные орудия' },
    desc: { en: 'Oldowan tools appear. Genus Homo begins. Brain ~600–700 cc.', he: 'מופיעים כלים אולדוואנים. סוג הומו מתחיל. מוח כ-600–700 סמ"ק.', ru: 'Появляются олдованские орудия. Начинается род Homo. Мозг ~600–700 см³.' },
  },
  {
    date: 1.8,
    unit: 'Ma',
    title: { en: 'Control of Fire', he: 'שליטה באש', ru: 'Контроль над огнём' },
    desc: { en: 'H. erectus uses fire routinely. Cooking calories drive brain growth.', he: 'H. erectus משתמש באש באופן קבוע. קלוריות בישול מניעות צמיחת מוח.', ru: 'H. erectus регулярно использует огонь. Калории из приготовленной пищи стимулируют рост мозга.' },
  },
  {
    date: 0.6,
    unit: 'Ma',
    title: { en: 'Brain Volume Surges', he: 'נפח המוח מזנק', ru: 'Объём мозга резко возрастает' },
    desc: { en: 'Middle Pleistocene brain expansion. H. heidelbergensis reaches 1,400 cc.', he: 'התרחבות מוח בפליסטוקן האמצעי. H. heidelbergensis מגיע ל-1,400 סמ"ק.', ru: 'Расширение мозга в среднем плейстоцене. H. heidelbergensis достигает 1 400 см³.' },
  },
  {
    date: 0.3,
    unit: 'Ma',
    title: { en: 'Homo sapiens Appears', he: 'הומו ספיינס מופיע', ru: 'Появляется Homo sapiens' },
    desc: { en: 'Modern human brain at ~1,400 cc. Abstract thought, language, art emerge.', he: 'מוח אנושי מודרני בכ-1,400 סמ"ק. חשיבה מופשטת, שפה ואמנות מתפתחות.', ru: 'Современный мозг человека ~1 400 см³. Появляются абстрактное мышление, язык и искусство.' },
  },
];

// ---------------------------------------------------------------------------
// 10. COMPARISON_SPECIES
// ---------------------------------------------------------------------------
export const COMPARISON_SPECIES = [
  {
    id: 'chimpanzee',
    nodeId: 'chimpanzee',
    emoji: '🐒',
    name: { en: 'Chimpanzee', he: 'שימפנזה', ru: 'Шимпанзе' },
    latin: 'Pan troglodytes',
    brain: 400,
    height: 130,
    lived: { from: 6000, to: 0 },
    tools: 2,
    language: { en: 'Calls & gestures', he: 'קריאות ומחוות', ru: 'Крики и жесты' },
    art: 'no',
    dna: 98.8,
    status: 'alive',
  },
  {
    id: 'lucy',
    nodeId: 'au_afarensis',
    emoji: '🚶',
    name: { en: 'Lucy (A. afarensis)', he: 'לוסי (א. אפרנסיס)', ru: 'Люси (A. afarensis)' },
    latin: 'Australopithecus afarensis',
    brain: 420,
    height: 120,
    lived: { from: 3900, to: 2900 },
    tools: 1,
    language: { en: 'None', he: 'אין', ru: 'Нет' },
    art: 'no',
    dna: null,
    status: '2.9 Ma',
  },
  {
    id: 'erectus',
    nodeId: 'h_erectus',
    emoji: '🔥',
    name: { en: 'Homo erectus', he: 'הומו ארקטוס', ru: 'Homo erectus' },
    latin: 'Homo erectus',
    brain: 900,
    height: 170,
    lived: { from: 1890, to: 110 },
    tools: 3,
    language: { en: 'Proto-language', he: 'פרוטו-שפה', ru: 'Протоязык' },
    art: 'debated',
    dna: null,
    status: '110 Ka',
  },
  {
    id: 'neanderthal',
    nodeId: 'neanderthal',
    emoji: '🏔️',
    name: { en: 'Neanderthal', he: 'ניאנדרתל', ru: 'Неандерталец' },
    latin: 'Homo neanderthalensis',
    brain: 1500,
    height: 166,
    lived: { from: 400, to: 40 },
    tools: 4,
    language: { en: 'Complex language', he: 'שפה מורכבת', ru: 'Сложный язык' },
    art: 'yes',
    dna: 99.7,
    status: '40 Ka',
  },
  {
    id: 'sapiens',
    nodeId: 'h_sapiens',
    emoji: '🧠',
    name: { en: 'Homo sapiens', he: 'הומו ספיינס', ru: 'Homo sapiens' },
    latin: 'Homo sapiens',
    brain: 1400,
    height: 170,
    lived: { from: 300, to: 0 },
    tools: 5,
    language: { en: 'Full language', he: 'שפה מלאה', ru: 'Полноценный язык' },
    art: 'yes',
    dna: 100,
    status: 'alive',
    highlight: true,
  },
];

// ---------------------------------------------------------------------------
// 11. MAX_BRAIN_CC, MAX_LIVED_KA
// ---------------------------------------------------------------------------
export const MAX_BRAIN_CC = 1500;
export const MAX_LIVED_KA = 8000;

// ---------------------------------------------------------------------------
// 12. TIMELINE_ERAS
// ---------------------------------------------------------------------------
export const TIMELINE_ERAS = [
  {
    id: 'origins',
    label: { en: 'Origins', he: 'מקורות', ru: 'Истоки' },
  },
  {
    id: 'behavioral-revolution',
    label: { en: 'Behavioral Revolution', he: 'המהפכה ההתנהגותית', ru: 'Поведенческая революция' },
  },
  {
    id: 'global-spread',
    label: { en: 'Global Spread', he: 'ההתפשטות הגלובלית', ru: 'Глобальное распространение' },
  },
  {
    id: 'civilization',
    label: { en: 'Civilization', he: 'ציוויליזציה', ru: 'Цивилизация' },
  },
  {
    id: 'modern-era',
    label: { en: 'Modern Era', he: 'העידן המודרני', ru: 'Современная эпоха' },
  },
];

// ---------------------------------------------------------------------------
// 13. TIMELINE_EVENTS (dates in years ago, not Ka)
// ---------------------------------------------------------------------------
export const TIMELINE_EVENTS = [
  {
    era: 'origins',
    date: 300000,
    major: true,
    emoji: '🦴',
    now: false,
    title: { en: 'First Homo sapiens', he: 'הומו ספיינס הראשון', ru: 'Первый Homo sapiens' },
    desc: {
      en: 'Earliest anatomically modern humans at Jebel Irhoud, Morocco. Our species begins.',
      he: 'בני האדם האנטומית המודרנית המוקדמים ביותר בג\'בל אירהוד, מרוקו. המין שלנו מתחיל.',
      ru: 'Ранейшие анатомически современные люди в Джебель-Ирхуде, Марокко. Наш вид начинается.',
    },
  },
  {
    era: 'origins',
    date: 200000,
    major: false,
    emoji: '🦴',
    now: false,
    title: { en: 'Omo Kibish Humans', he: 'בני אדם אומו קיביש', ru: 'Люди Омо Кибиш' },
    desc: {
      en: 'Omo I & II skulls from Ethiopia confirm early sapiens diversity across Africa.',
      he: 'גולגלות אומו I ו-II מאתיופיה מאשרות את הגיוון המוקדם של ספיינס ברחבי אפריקה.',
      ru: 'Черепа Омо I и II из Эфиопии подтверждают раннее разнообразие сапиенс по всей Африке.',
    },
  },
  {
    era: 'behavioral-revolution',
    date: 100000,
    major: false,
    emoji: '⚰️',
    now: false,
    title: { en: 'Intentional Burial', he: 'קבורה מכוונת', ru: 'Намеренное захоронение' },
    desc: {
      en: 'Evidence of deliberate burial at Qafzeh, Israel — early symbolic behavior and belief in an afterlife.',
      he: 'עדות לקבורה מכוונת בקפזה, ישראל — התנהגות סמלית מוקדמת ואמונה בחיי עולם הבא.',
      ru: 'Свидетельства намеренного захоронения в Кафзе, Израиль — ранее символическое поведение и вера в загробную жизнь.',
    },
  },
  {
    era: 'behavioral-revolution',
    date: 77000,
    major: true,
    emoji: '🎨',
    now: false,
    title: { en: 'Symbolic Marks (Blombos Cave)', he: 'סימנים סמליים (מערת בלומבוס)', ru: 'Символические отметки (Пещера Бломбос)' },
    desc: {
      en: 'Geometric engravings on ochre at Blombos Cave, South Africa — the oldest confirmed abstract art.',
      he: 'חריטות גיאומטריות על אוקר במערת בלומבוס, דרום אפריקה — האמנות המופשטת המאושרת העתיקה ביותר.',
      ru: 'Геометрические гравюры на охре в пещере Бломбос, Южная Африка — древнейшее подтверждённое абстрактное искусство.',
    },
  },
  {
    era: 'behavioral-revolution',
    date: 65000,
    major: false,
    emoji: '🦘',
    now: false,
    title: { en: 'Humans Reach Australia', he: 'בני האדם מגיעים לאוסטרליה', ru: 'Люди достигают Австралии' },
    desc: {
      en: 'Maritime crossing to Australia at Madjedbebe — the first ocean voyage in human history.',
      he: 'מעבר ימי לאוסטרליה במדג\'דבבה — הנסיעה הימית הראשונה בהיסטוריה האנושית.',
      ru: 'Морской переход в Австралию в Мадьедбебе — первое морское путешествие в истории человечества.',
    },
  },
  {
    era: 'behavioral-revolution',
    date: 45000,
    major: true,
    emoji: '🖼️',
    now: false,
    title: { en: 'Cave Art in Europe', he: 'ציורי מערה באירופה', ru: 'Наскальное искусство в Европе' },
    desc: {
      en: 'Earliest European figurative cave art appears — lions, mammoths, rhinos painted with stunning skill.',
      he: 'מופיעה אמנות מערות תיאורית אירופאית מוקדמת — אריות, מאמוטים, קרנפים מצוירים בכישרון מדהים.',
      ru: 'Появляется ранее европейское фигуративное наскальное искусство — львы, мамонты, носороги, нарисованные с поразительным мастерством.',
    },
  },
  {
    era: 'global-spread',
    date: 40000,
    major: false,
    emoji: '💀',
    now: false,
    title: { en: 'Neanderthals Vanish', he: 'הניאנדרתלים נעלמים', ru: 'Неандертальцы исчезают' },
    desc: {
      en: 'Last Neanderthal populations disappear from Europe, leaving only their DNA in our genomes.',
      he: 'אוכלוסיות הניאנדרתל האחרונות נעלמות מאירופה, ומותירות רק את ה-DNA שלהן בגנומים שלנו.',
      ru: 'Последние популяции неандертальцев исчезают из Европы, оставив только их ДНК в наших геномах.',
    },
  },
  {
    era: 'global-spread',
    date: 36000,
    major: true,
    emoji: '🦁',
    now: false,
    title: { en: 'Chauvet Cave Art', he: 'ציורי מערת שובה', ru: 'Искусство пещеры Шове' },
    desc: {
      en: 'Chauvet-Pont d\'Arc paintings in France — the most sophisticated Paleolithic art ever discovered.',
      he: 'ציורי שובה-פון דארק בצרפת — האמנות הפלאוליתית המתוחכמת ביותר שהתגלתה אי פעם.',
      ru: 'Рисунки Шове-Пон д\'Арк во Франции — самое изощрённое палеолитическое искусство из когда-либо обнаруженных.',
    },
  },
  {
    era: 'global-spread',
    date: 15000,
    major: false,
    emoji: '🌎',
    now: false,
    title: { en: 'Humans Reach the Americas', he: 'בני האדם מגיעים לאמריקה', ru: 'Люди достигают Америки' },
    desc: {
      en: 'First Americans at Monte Verde, Chile — completing the human colonization of every habitable continent.',
      he: 'האמריקאים הראשונים במונטה וורדה, צ\'ילה — השלמת הקולוניזציה האנושית של כל יבשת הניתנת למגורים.',
      ru: 'Первые американцы в Монте-Верде, Чили — завершение колонизации человеком каждого обитаемого континента.',
    },
  },
  {
    era: 'civilization',
    date: 12000,
    major: true,
    emoji: '🌾',
    now: false,
    title: { en: 'Agriculture Begins', he: 'החקלאות מתחילה', ru: 'Начало земледелия' },
    desc: {
      en: 'Domestication of wheat and goats in the Fertile Crescent — the Neolithic Revolution reshapes humanity.',
      he: 'ביות חיטה ועיזים בסהר הפורה — המהפכה הניאוליתית עיצוב מחדש את האנושות.',
      ru: 'Одомашнивание пшеницы и коз на Плодородном полумесяце — Неолитическая революция преобразует человечество.',
    },
  },
  {
    era: 'civilization',
    date: 5000,
    major: true,
    emoji: '✍️',
    now: false,
    title: { en: 'Writing Invented', he: 'כתיבה הומצאת', ru: 'Изобретение письменности' },
    desc: {
      en: 'Sumerian cuneiform in Mesopotamia — humanity begins recording knowledge outside the brain for the first time.',
      he: 'כתב יתדות סומרי במסופוטמיה — האנושות מתחילה לתעד ידע מחוץ למוח בפעם הראשונה.',
      ru: 'Шумерская клинопись в Месопотамии — человечество начинает записывать знания вне мозга впервые.',
    },
  },
  {
    era: 'civilization',
    date: 2500,
    major: false,
    emoji: '🏛️',
    now: false,
    title: { en: 'Axial Age of Philosophy', he: 'עידן הציר של הפילוסופיה', ru: 'Осевой век философии' },
    desc: {
      en: 'Simultaneous emergence of Confucius, Buddha, Socrates, and the Hebrew prophets — human self-reflection peaks.',
      he: 'התהוות בו-זמנית של קונפוציוס, בודהה, סוקרטס והנביאים העבריים — השתקפות עצמית אנושית מגיעה לשיאה.',
      ru: 'Одновременное появление Конфуция, Будды, Сократа и еврейских пророков — человеческая саморефлексия достигает пика.',
    },
  },
  {
    era: 'modern-era',
    date: 500,
    major: false,
    emoji: '🔭',
    now: false,
    title: { en: 'Scientific Revolution', he: 'המהפכה המדעית', ru: 'Научная революция' },
    desc: {
      en: 'Copernicus, Galileo, Newton — systematic empirical inquiry accelerates technology and reshapes our place in the cosmos.',
      he: 'קופרניקוס, גלילאו, ניוטון — חקירה אמפירית שיטתית מאיצה את הטכנולוגיה ומעצבת מחדש את מקומנו ביקום.',
      ru: 'Коперник, Галилей, Ньютон — систематическое эмпирическое исследование ускоряет технологии и переосмысляет наше место в космосе.',
    },
  },
  {
    era: 'modern-era',
    date: 70,
    major: true,
    emoji: '🧬',
    now: false,
    title: { en: 'DNA Structure Decoded', he: 'מבנה DNA מפוענח', ru: 'Расшифрована структура ДНК' },
    desc: {
      en: 'Watson, Crick, Franklin and Wilkins reveal the double helix in 1953 — life\'s instruction manual is finally readable.',
      he: 'ווטסון, קריק, פרנקלין וווילקינס חושפים את הסליל הכפול ב-1953 — מדריך ההוראות של החיים סוף סוף קריא.',
      ru: 'Уотсон, Крик, Франклин и Уилкинс раскрывают двойную спираль в 1953 году — инструкция по эксплуатации жизни наконец читаема.',
    },
  },
  {
    era: 'modern-era',
    date: 55,
    major: false,
    emoji: '🌕',
    now: false,
    title: { en: 'Moon Landing', he: 'נחיתה על הירח', ru: 'Высадка на Луну' },
    desc: {
      en: 'Apollo 11 lands humans on the Moon in 1969 — H. sapiens becomes a multi-world species for the first time.',
      he: 'אפולו 11 מנחית בני אדם על הירח ב-1969 — H. sapiens הופך למין רב-עולמי בפעם הראשונה.',
      ru: 'Аполлон-11 высаживает людей на Луну в 1969 году — H. sapiens впервые становится межпланетным видом.',
    },
  },
  {
    era: 'modern-era',
    date: 0,
    major: true,
    emoji: '🌍',
    now: true,
    title: { en: 'The Present', he: 'ההווה', ru: 'Настоящее' },
    desc: {
      en: '8 billion humans inhabit Earth — shaping the climate, sequencing every genome, and asking: what comes next?',
      he: '8 מיליארד בני אדם מאכלסים את כדור הארץ — מעצבים את האקלים, מסדרים כל גנום, ושואלים: מה הלאה?',
      ru: '8 миллиардов человек населяют Землю — формируют климат, секвенируют каждый геном и спрашивают: что дальше?',
    },
  },
];
