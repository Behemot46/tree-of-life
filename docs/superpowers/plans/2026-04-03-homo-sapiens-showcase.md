# Homo sapiens Showcase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen immersive Homo sapiens showcase page that replaces the regular panel when clicking on `h_sapiens` or `hominini` in the tree.

**Architecture:** Overlay component pattern — a lazily-created full-screen `<div>` (z-index 500) injected into `<body>`, with 5 scrollable sections and a slide-out drawer. Intercepts `showMainPanel()` for sapiens/hominini nodes. Three new files (`js/sapiens.js`, `js/sapiensData.js`, `css/sapiens.css`) plus minor edits to `panel.js`, `app.js`, and `index.html`.

**Tech Stack:** Vanilla JS (ES modules), CSS custom properties, SVG, IntersectionObserver, no libraries.

**Design Spec:** `docs/superpowers/specs/2026-04-03-homo-sapiens-showcase-design.md`

**Important codebase conventions:**
- Late-binding dependency injection via `initXxxDeps()` — no direct cross-module function imports for functions that cause circular deps
- `reducedMotion()` from `utils.js` gates decorative animations
- All state in `js/state.js` single exported object
- `nodeMap` for O(1) node lookup by ID
- Existing z-index scale: `--z-panel:400`, `--z-toast:500`, `--z-modal:1000`
- No tests exist in this project — verify by running locally in browser at `http://localhost:5555`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `js/sapiensData.js` | **Create** | All static data: hero config, migration routes, trait cards, comparison species, timeline events, skull image URLs |
| `js/sapiens.js` | **Create** | Overlay lifecycle (open/close), DOM building for all 5 sections, drawer, animations, event handlers |
| `css/sapiens.css` | **Create** | All showcase styling — overlay, sections, cards, table, timeline, drawer, responsive, light theme |
| `js/panel.js` | **Modify** (line 819) | Add early return for `h_sapiens`/`hominini` → call `openSapiens()` |
| `js/app.js` | **Modify** (lines 31, 71) | Import sapiens module, wire `initSapiensDeps()` |
| `index.html` | **Modify** (line 41) | Add `<link rel="stylesheet" href="css/sapiens.css">` |

---

### Task 1: Data Module (`sapiensData.js`)

**Files:**
- Create: `js/sapiensData.js`

This task creates the pure-data module with zero logic. All other tasks import from it.

- [ ] **Step 1: Create `js/sapiensData.js` with hero data**

```js
// ══════════════════════════════════════════════════════
// SAPIENS DATA — static content for Homo sapiens showcase
// ══════════════════════════════════════════════════════

// ── Hero Section ──
export const SAPIENS_HERO = {
  bgImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Serengeti-African-Savanna.jpg/1280px-Serengeti-African-Savanna.jpg',
  overline: { en: 'The Story of Us', he: 'הסיפור שלנו', ru: 'Наша история' },
  tagline: { en: '300,000 Years and Counting', he: '300,000 שנה וסופרים', ru: '300 000 лет и продолжаем' },
  counters: [
    { value: 8000000000, label: { en: 'individuals', he: 'פרטים', ru: 'людей' }, suffix: '+' },
    { value: 1, label: { en: 'species', he: 'מין', ru: 'вид' } },
    { value: 300000, label: { en: 'years', he: 'שנה', ru: 'лет' } },
  ],
  etymologyTitle: { en: 'Why "sapiens"?', he: 'למה "סאפיינס"?', ru: 'Почему «sapiens»?' },
  etymologyContent: {
    en: 'The name <em>Homo sapiens</em> means "wise man" in Latin. Carl Linnaeus chose it in 1758 when he classified humans in his <em>Systema Naturae</em>. The choice was controversial — Linnaeus was essentially naming our species after our own self-image. Some scientists have argued we should be <em>Homo narrans</em> (storytelling man) or <em>Homo faber</em> (tool-making man). The debate continues.',
    he: 'השם <em>הומו סאפיינס</em> פירושו "אדם חכם" בלטינית. קרל לינאוס בחר בו ב-1758 כשסיווג את בני האדם ב-<em>Systema Naturae</em>. הבחירה הייתה שנויה במחלוקת — לינאוס בעצם קרא למין שלנו על שם הדימוי העצמי שלנו.',
    ru: 'Название <em>Homo sapiens</em> означает «человек разумный» на латыни. Карл Линней выбрал его в 1758 году. Выбор был спорным — Линней назвал наш вид по нашему собственному представлению о себе.',
  },
};
```

- [ ] **Step 2: Add migration route data**

Append to the same file. Routes use normalized coordinates on a 100×50 viewBox that overlays the Wikimedia equirectangular map image.

```js
// ── Migration Map ──
export const MIGRATION_ROUTES = [
  { id: 'middle-east', path: 'M53,30 Q55,24 56,20', date: 120,
    label: { en: 'Levant', he: 'לבנט', ru: 'Левант' },
    site: { en: 'Qafzeh Cave, Israel — earliest burial', he: 'מערת קפזה, ישראל', ru: 'Пещера Кафзех, Израиль' } },
  { id: 'south-asia', path: 'M57,22 Q62,24 66,27', date: 70,
    label: { en: 'South Asia', he: 'דרום אסיה', ru: 'Южная Азия' },
    site: { en: 'Coastal route along Arabian Sea', he: 'מסלול חופי לאורך ים ערב', ru: 'Прибрежный маршрут' } },
  { id: 'australia', path: 'M72,30 Q78,36 82,42', date: 65,
    label: { en: 'Australia', he: 'אוסטרליה', ru: 'Австралия' },
    site: { en: 'Madjedbebe — 90km sea crossing', he: 'מדג\'דבבה — חציית ים 90 ק"מ', ru: 'Маджедбебе — 90 км по морю' } },
  { id: 'europe', path: 'M55,19 Q50,15 46,14', date: 45,
    label: { en: 'Europe', he: 'אירופה', ru: 'Европа' },
    site: { en: 'Bacho Kiro Cave, Bulgaria', he: 'מערת באצ\'ו קירו, בולגריה', ru: 'Пещера Бачо-Киро, Болгария' } },
  { id: 'central-asia', path: 'M57,19 Q62,13 70,11', date: 40,
    label: { en: 'Central Asia', he: 'מרכז אסיה', ru: 'Центральная Азия' },
    site: { en: 'Steppe corridor migration', he: 'הגירה דרך מסדרון הערבה', ru: 'Степной коридор' } },
  { id: 'east-asia', path: 'M70,11 Q76,13 80,17', date: 35,
    label: { en: 'East Asia', he: 'מזרח אסיה', ru: 'Восточная Азия' },
    site: { en: 'Tianyuan Cave, China', he: 'מערת טיאניואן, סין', ru: 'Пещера Тяньюань, Китай' } },
  { id: 'americas', path: 'M82,12 Q90,6 95,4 Q50,3 20,12 Q12,16 10,22', date: 15,
    label: { en: 'Americas', he: 'אמריקה', ru: 'Америка' },
    site: { en: 'Beringia land bridge or coastal route', he: 'גשר יבשת ברינגיה', ru: 'Берингийский мост' } },
  { id: 'polynesia', path: 'M78,30 Q84,35 90,38', date: 3,
    label: { en: 'Polynesia', he: 'פולינזיה', ru: 'Полинезия' },
    site: { en: 'Masterful open-ocean navigation', he: 'ניווט באוקיינוס הפתוח', ru: 'Навигация в открытом океане' } },
];

export const MIGRATION_ORIGIN = { x: 53, y: 30, date: 300 };

export const MIGRATION_MAP_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Equirectangular-projection.jpg/1280px-Equirectangular-projection.jpg';
```

- [ ] **Step 3: Add trait card data**

```js
// ── Trait Cards (Section 3) ──
export const TRAIT_CARDS = [
  {
    id: 'brain',
    icon: '🧠',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Human_brain_NIH.png/640px-Human_brain_NIH.png',
    label: { en: 'The Brain', he: 'המוח', ru: 'Мозг' },
    stat: '1,400', unit: { en: 'cubic cm', he: 'סמ"ק', ru: 'куб. см' },
    desc: {
      en: '⚡ The largest brain-to-body ratio of any primate. 86 billion neurons firing in concert.',
      he: '⚡ היחס הגדול ביותר בין מוח לגוף בין כל הפרימטים.',
      ru: '⚡ Наибольшее соотношение мозга к телу среди приматов.',
    },
    funFact: {
      en: '🤯 Plot twist: Neanderthals actually had <em>bigger</em> brains than us. Size isn\'t everything.',
      he: '🤯 טוויסט: לניאנדרטלים היה מוח <em>גדול יותר</em> משלנו.',
      ru: '🤯 Сюрприз: у неандертальцев мозг был <em>больше</em> нашего.',
    },
    cta: { en: 'Compare brain sizes', he: 'השוואת גודל מוח', ru: 'Сравнить размеры мозга' },
  },
  {
    id: 'language',
    icon: '🗣️',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Rosetta_Stone_-_front_face_-_corrected.jpg/640px-Rosetta_Stone_-_front_face_-_corrected.jpg',
    label: { en: 'Language', he: 'שפה', ru: 'Язык' },
    stat: '6,000+', unit: { en: 'living languages', he: 'שפות חיות', ru: 'живых языков' },
    desc: {
      en: '🌍 The only species with full symbolic language — we can discuss the past, imagine the future, and argue about fiction.',
      he: '🌍 המין היחיד עם שפה סימבולית מלאה.',
      ru: '🌍 Единственный вид с полным символическим языком.',
    },
    funFact: {
      en: '📜 Writing was invented just 5,000 years ago — only 1.7% of our species\' existence.',
      he: '📜 הכתיבה הומצאה לפני 5,000 שנה בלבד — 1.7% מקיום המין שלנו.',
      ru: '📜 Письменность изобретена лишь 5000 лет назад — 1,7% существования нашего вида.',
    },
    cta: { en: 'Evolution of communication', he: 'אבולוציה של תקשורת', ru: 'Эволюция коммуникации' },
  },
  {
    id: 'technology',
    icon: '⚒️',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bifaz_de_San_Isidro_%28M.A.N._Madrid%29_01.jpg/640px-Bifaz_de_San_Isidro_%28M.A.N._Madrid%29_01.jpg',
    label: { en: 'Technology', he: 'טכנולוגיה', ru: 'Технологии' },
    stat: '3.3M', unit: { en: 'years of tools', he: 'שנות כלים', ru: 'лет инструментов' },
    desc: {
      en: '🚀 From stone flakes to Moon landings. The acceleration is staggering — and still speeding up.',
      he: '🚀 מרסיסי אבן לנחיתה על הירח. ההאצה מדהימה.',
      ru: '🚀 От каменных отщепов до высадки на Луну.',
    },
    funFact: {
      en: '⏳ 99% of tool-use history = stone tools. Smartphones, rockets, antibiotics — all in the last 1%.',
      he: '⏳ 99% מהיסטוריית הכלים = כלי אבן. סמארטפונים, רקטות — באחוז האחרון.',
      ru: '⏳ 99% истории инструментов = каменные орудия. Всё остальное — в последнем 1%.',
    },
    cta: { en: 'The exponential curve', he: 'העקומה המעריכית', ru: 'Экспоненциальная кривая' },
  },
  {
    id: 'dna',
    icon: '🧬',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/DNA_orbit_animated.gif/640px-DNA_orbit_animated.gif',
    label: { en: 'Our DNA', he: 'ה-DNA שלנו', ru: 'Наша ДНК' },
    stat: '99.9%', unit: { en: 'identical', he: 'זהים', ru: 'идентичны' },
    desc: {
      en: '🤝 The lowest genetic diversity of any great ape. Every human is more related than two random chimps.',
      he: '🤝 השונות הגנטית הנמוכה ביותר מבין כל הקופים הגדולים.',
      ru: '🤝 Наименьшее генетическое разнообразие среди человекообразных обезьян.',
    },
    funFact: {
      en: '👻 You carry 1-4% Neanderthal DNA. Some of us carry Denisovan DNA too. We\'re a remix.',
      he: '👻 אתם נושאים 1-4% DNA ניאנדרטלי. חלקנו גם דניסובי. אנחנו רמיקס.',
      ru: '👻 В вас 1-4% ДНК неандертальца. Мы — ремикс.',
    },
    cta: { en: 'The 0.1% that makes us different', he: 'ה-0.1% שמבדיל אותנו', ru: '0,1% которые нас различают' },
  },
];
```

- [ ] **Step 4: Add skull images and brain drawer data**

```js
// ── Brain Drawer Data ──
export const SKULL_IMAGES = {
  chimpanzee: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Pan_troglodytes_02_MWNH_230.jpg/{W}px-Pan_troglodytes_02_MWNH_230.jpg',
    emoji: '🐵', volume: 400, height: 74,
    name: { en: 'Chimpanzee', he: 'שימפנזה', ru: 'Шимпанзе' },
  },
  erectus: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Homo_erectus_skull.jpg/{W}px-Homo_erectus_skull.jpg',
    emoji: '🦴', volume: 900, height: 100,
    name: { en: 'H. erectus', he: 'ה. ארקטוס', ru: 'Х. эректус' },
  },
  sapiens: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Human_Skull_Lateral_View_Unlabeled.jpg/{W}px-Human_Skull_Lateral_View_Unlabeled.jpg',
    emoji: '🧍', volume: 1400, height: 120, highlight: true,
    name: { en: 'H. sapiens', he: 'ה. סאפיינס', ru: 'Х. сапиенс' },
  },
  neanderthal: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Neanderthal_Skull_%288624714463%29.jpg/{W}px-Neanderthal_Skull_%288624714463%29.jpg',
    emoji: '🏔️', volume: 1500, height: 128, surprise: true,
    name: { en: 'Neanderthal', he: 'ניאנדרטל', ru: 'Неандерталец' },
  },
};

export const NEURAL_DENSITY = [
  { id: 'sapiens-neurons', emoji: '🧍', label: { en: 'H. sapiens', he: 'ה. סאפיינס', ru: 'Х. сапиенс' }, value: '16B', desc: { en: 'neurons in cortex alone', he: 'נוירונים בקורטקס בלבד', ru: 'нейронов только в коре' }, highlight: true },
  { id: 'neanderthal-neurons', emoji: '🏔️', label: { en: 'Neanderthal', he: 'ניאנדרטל', ru: 'Неандерталец' }, value: '~12B', desc: { en: 'neurons in cortex (est.)', he: 'נוירונים בקורטקס (הערכה)', ru: 'нейронов в коре (оценка)' } },
  { id: 'prefrontal', emoji: '🎯', label: { en: 'Prefrontal Cortex', he: 'קורטקס פרה-פרונטלי', ru: 'Префронтальная кора' }, value: '38%', desc: { en: 'of sapiens cortex = planning, language', he: 'מקורטקס סאפיינס = תכנון, שפה', ru: 'коры сапиенса = планирование, язык' } },
  { id: 'occipital', emoji: '👁️', label: { en: 'Occipital Lobe', he: 'אונה עורפית', ru: 'Затылочная доля' }, value: { en: 'larger', he: 'גדולה יותר', ru: 'крупнее' }, desc: { en: 'in Neanderthals = vision, not thinking', he: 'אצל ניאנדרטלים = ראייה', ru: 'у неандертальцев = зрение' } },
];

export const BRAIN_ENERGY = [
  { emoji: '⚖️', text: { en: 'Only <strong>2%</strong> of body mass — but burns <strong>20%</strong> of all calories', he: 'רק <strong>2%</strong> ממסת הגוף — אבל שורף <strong>20%</strong> מהקלוריות', ru: 'Только <strong>2%</strong> массы тела — но сжигает <strong>20%</strong> калорий' } },
  { emoji: '⚡', text: { en: 'Uses <strong>20 watts</strong> — same as a dim lightbulb, running 24/7', he: 'צורך <strong>20 וואט</strong> — כמו נורה חלשה, 24/7', ru: 'Потребляет <strong>20 ватт</strong> — как тусклая лампочка, 24/7' } },
  { emoji: '🍖', text: { en: 'Cooking food unlocked <strong>extra calories</strong> needed to fuel brain growth', he: 'בישול אוכל שחרר <strong>קלוריות נוספות</strong> לצמיחת המוח', ru: 'Приготовление пищи высвободило <strong>калории</strong> для роста мозга' } },
  { emoji: '💀', text: { en: 'Our gut <strong>shrank</strong> as our brain grew — can\'t run two expensive organs', he: 'המעי שלנו <strong>התכווץ</strong> ככל שהמוח גדל', ru: 'Наш кишечник <strong>уменьшился</strong> по мере роста мозга' } },
];

export const BRAIN_TIMELINE = [
  { date: '6 Ma', emoji: '🐵', text: { en: 'Split from chimps — brain ~350 cc', he: 'פיצול מהשימפנזים — מוח ~350 סמ"ק', ru: 'Разделение с шимпанзе — мозг ~350 куб.см' } },
  { date: '2.5 Ma', emoji: '🪨', text: { en: 'First stone tools + <strong>brain hits 600 cc</strong>', he: 'כלי אבן ראשונים + <strong>מוח מגיע ל-600 סמ"ק</strong>', ru: 'Первые каменные орудия + <strong>мозг 600 куб.см</strong>' } },
  { date: '1.8 Ma', emoji: '🔥', text: { en: 'H. erectus masters fire — <strong>900 cc</strong>', he: 'ה. ארקטוס מאלף אש — <strong>900 סמ"ק</strong>', ru: 'Х. эректус приручает огонь — <strong>900 куб.см</strong>' } },
  { date: '600 Ka', emoji: '📈', text: { en: 'Rapid expansion — brain growing <strong>35% in 400K years</strong>', he: 'התרחבות מהירה — צמיחה של <strong>35% ב-400 אלף שנה</strong>', ru: 'Быстрый рост — <strong>35% за 400 тыс. лет</strong>' } },
  { date: '300 Ka', emoji: '🧍', text: { en: 'H. sapiens appears — <strong>1,400 cc</strong> 🎯', he: 'ה. סאפיינס מופיע — <strong>1,400 סמ"ק</strong> 🎯', ru: 'Х. сапиенс — <strong>1400 куб.см</strong> 🎯' } },
];
```

- [ ] **Step 5: Add comparison table data**

```js
// ── Comparison Table (Section 4) ──
export const COMPARISON_SPECIES = [
  { id: 'chimpanzee', nodeId: 'chimpanzee', emoji: '🐵',
    name: { en: 'Chimpanzee', he: 'שימפנזה', ru: 'Шимпанзе' },
    latin: 'Pan troglodytes',
    brain: 400, height: '~1.1', lived: { from: 7000, to: 0 },
    tools: 1, language: { en: 'Gestures + calls', he: 'מחוות + קריאות', ru: 'Жесты + крики' },
    art: 'no', dna: 98.8, status: 'alive' },
  { id: 'lucy', nodeId: 'australopithecines', emoji: '🦴',
    name: { en: 'Lucy', he: 'לוסי', ru: 'Люси' },
    latin: 'A. afarensis',
    brain: 430, height: '~1.1', lived: { from: 3900, to: 2900 },
    tools: 1, language: { en: 'Unknown', he: 'לא ידוע', ru: 'Неизвестно' },
    art: 'no', dna: null, status: { date: 2900 } },
  { id: 'erectus', nodeId: 'h_erectus', emoji: '🔥',
    name: { en: 'H. erectus', he: 'ה. ארקטוס', ru: 'Х. эректус' },
    latin: 'Homo erectus',
    brain: 900, height: '~1.7', lived: { from: 1900, to: 110 },
    tools: 2, language: { en: 'Basic vocal?', he: 'קולי בסיסי?', ru: 'Базовая речь?' },
    art: 'no', dna: null, status: { date: 110 } },
  { id: 'neanderthal', nodeId: 'h_neanderthalensis', emoji: '🏔️',
    name: { en: 'Neanderthal', he: 'ניאנדרטל', ru: 'Неандерталец' },
    latin: 'H. neanderthalensis',
    brain: 1500, height: '~1.65', lived: { from: 400, to: 40 },
    tools: 3, language: { en: 'Proto-language?', he: 'פרוטו-שפה?', ru: 'Протоязык?' },
    art: 'debated', dna: 99.7, status: { date: 40 } },
  { id: 'sapiens', nodeId: 'h_sapiens', emoji: '🧍',
    name: { en: 'Us', he: 'אנחנו', ru: 'Мы' },
    latin: 'Homo sapiens',
    brain: 1400, height: '~1.7', lived: { from: 300, to: 0 },
    tools: 5, language: { en: 'Full symbolic', he: 'סימבולית מלאה', ru: 'Полный символический' },
    art: 'yes', dna: null, status: 'alive', highlight: true },
];

// Max brain for bar width normalization
export const MAX_BRAIN_CC = 1500;

// Max time in Ka for lifespan bar normalization
export const MAX_LIVED_KA = 8000;
```

- [ ] **Step 6: Add timeline events data**

```js
// ── Timeline Events (Section 5) ──
export const TIMELINE_ERAS = [
  { id: 'origins', label: { en: '🌅 Origins', he: '🌅 מקורות', ru: '🌅 Истоки' } },
  { id: 'behavioral', label: { en: '💡 Behavioral Revolution', he: '💡 מהפכה התנהגותית', ru: '💡 Поведенческая революция' } },
  { id: 'global', label: { en: '🌍 Global Spread', he: '🌍 התפשטות גלובלית', ru: '🌍 Глобальное расселение' } },
  { id: 'civilization', label: { en: '🏛️ Civilization', he: '🏛️ ציוויליזציה', ru: '🏛️ Цивилизация' } },
  { id: 'modern', label: { en: '⚡ Modern Era', he: '⚡ עידן מודרני', ru: '⚡ Современная эра' } },
];

export const TIMELINE_EVENTS = [
  { era: 'origins', date: 300000, major: true, emoji: '🦴',
    title: { en: 'First Homo sapiens', he: 'הומו סאפיינס הראשונים', ru: 'Первые Homo sapiens' },
    desc: { en: 'Jebel Irhoud, Morocco — the oldest known fossils of our species. Not yet "modern" in behavior, but anatomically us.', he: 'ג\'בל אירהוד, מרוקו — המאובנים העתיקים ביותר של המין שלנו.', ru: 'Джебель-Ирхуд, Марокко — древнейшие окаменелости нашего вида.' } },
  { era: 'origins', date: 200000, major: false, emoji: '⚰️',
    title: { en: 'Omo remains', he: 'שרידי אומו', ru: 'Остатки Омо' },
    desc: { en: 'Omo Kibish, Ethiopia — more modern features. East Africa as our evolutionary cradle becomes clear.', he: 'אומו קיביש, אתיופיה — מאפיינים מודרניים יותר.', ru: 'Омо-Кибиш, Эфиопия — более современные черты.' } },
  { era: 'origins', date: 100000, major: true, emoji: '🪦',
    title: { en: 'First intentional burial', he: 'קבורה מכוונת ראשונה', ru: 'Первое намеренное погребение' },
    desc: { en: 'Qafzeh Cave, Israel — bodies arranged with care, ochre pigments. The first evidence that we thought about death.', he: 'מערת קפזה, ישראל — גופות שסודרו בקפידה.', ru: 'Пещера Кафзех, Израиль — тела уложены с заботой.' } },
  { era: 'behavioral', date: 77000, major: false, emoji: '✏️',
    title: { en: 'First symbolic marks', he: 'סימנים סימבוליים ראשונים', ru: 'Первые символические знаки' },
    desc: { en: 'Blombos Cave, South Africa — cross-hatched ochre blocks. Abstract thought made visible for the first time.', he: 'מערת בלומבוס, דרום אפריקה — בלוקי אוכרה עם קווים צולבים.', ru: 'Пещера Бломбос, ЮАР — заштрихованные блоки охры.' } },
  { era: 'behavioral', date: 65000, major: true, emoji: '🌏',
    title: { en: 'Arrival in Australia', he: 'הגעה לאוסטרליה', ru: 'Прибытие в Австралию' },
    desc: { en: 'Madjedbebe, Northern Territory — required crossing 90km of open sea. First proof of seafaring.', he: 'מדג\'דבבה — דרשה חציית 90 ק"מ של ים פתוח.', ru: 'Маджедбебе — пересечение 90 км открытого моря.' } },
  { era: 'behavioral', date: 45000, major: true, emoji: '🎨',
    title: { en: 'Cave art begins', he: 'אמנות מערות מתחילה', ru: 'Начало пещерного искусства' },
    desc: { en: 'Sulawesi, Indonesia — a hand stencil and a warty pig. The oldest known figurative art.', he: 'סולאווסי, אינדונזיה — שבלונית יד וחזיר. האמנות הפיגורטיבית העתיקה ביותר.', ru: 'Сулавеси, Индонезия — трафарет руки и бородавчатая свинья.' } },
  { era: 'behavioral', date: 40000, major: false, emoji: '👋',
    title: { en: 'Neanderthals vanish', he: 'ניאנדרטלים נעלמים', ru: 'Неандертальцы исчезают' },
    desc: { en: 'The last Neanderthals disappear from Gibraltar. We are now the last human species standing.', he: 'ניאנדרטלים אחרונים נעלמים מגיברלטר.', ru: 'Последние неандертальцы исчезают из Гибралтара.' } },
  { era: 'behavioral', date: 36000, major: false, emoji: '🐻',
    title: { en: 'Chauvet Cave paintings', he: 'ציורי מערת שובה', ru: 'Пещера Шове' },
    desc: { en: 'Southern France — lions, horses, rhinos painted with astonishing skill.', he: 'דרום צרפת — אריות, סוסים, קרנפים צוירו במיומנות מדהימה.', ru: 'Юг Франции — львы, лошади, носороги с поразительным мастерством.' } },
  { era: 'global', date: 15000, major: true, emoji: '🏔️',
    title: { en: 'Arrival in the Americas', he: 'הגעה לאמריקה', ru: 'Прибытие в Америку' },
    desc: { en: 'Via Beringia land bridge or Pacific coast. The last major continent colonized.', he: 'דרך גשר יבשת ברינגיה או חוף האוקיינוס השקט.', ru: 'Через Берингийский мост или тихоокеанское побережье.' } },
  { era: 'global', date: 12000, major: true, emoji: '🌾',
    title: { en: 'Agriculture invented', he: 'חקלאות מומצאת', ru: 'Изобретение земледелия' },
    desc: { en: 'The Fertile Crescent — wheat, barley, goats, sheep. Everything changes: settlements, hierarchy, surplus, civilization.', he: 'הסהר הפורה — חיטה, שעורה, עזים, כבשים. הכל משתנה.', ru: 'Плодородный полумесяц — пшеница, ячмень, козы, овцы. Всё меняется.' } },
  { era: 'civilization', date: 5000, major: true, emoji: '📝',
    title: { en: 'Writing invented', he: 'הכתיבה מומצאת', ru: 'Изобретение письменности' },
    desc: { en: 'Sumer, Mesopotamia — cuneiform on clay tablets. For the first time, knowledge outlives the knower.', he: 'שומר, מסופוטמיה — כתב יתדות על לוחות חרס.', ru: 'Шумер, Месопотамия — клинопись на глиняных табличках.' } },
  { era: 'civilization', date: 2500, major: false, emoji: '🤔',
    title: { en: 'Philosophy & science', he: 'פילוסופיה ומדע', ru: 'Философия и наука' },
    desc: { en: 'Greece, China, India simultaneously — Socrates, Confucius, Buddha. The "Axial Age" of human thought.', he: 'יוון, סין, הודו בו-זמנית — סוקרטס, קונפוציוס, בודהא.', ru: 'Греция, Китай, Индия одновременно — Сократ, Конфуций, Будда.' } },
  { era: 'modern', date: 500, major: false, emoji: '🔬',
    title: { en: 'Scientific revolution', he: 'המהפכה המדעית', ru: 'Научная революция' },
    desc: { en: 'Copernicus, Galileo, Newton — we start understanding the rules of the universe.', he: 'קופרניקוס, גלילאו, ניוטון — מתחילים להבין את חוקי היקום.', ru: 'Коперник, Галилей, Ньютон — мы начинаем понимать законы вселенной.' } },
  { era: 'modern', date: 70, major: false, emoji: '🧬',
    title: { en: 'DNA structure discovered', he: 'מבנה ה-DNA מתגלה', ru: 'Открытие структуры ДНК' },
    desc: { en: 'Watson, Crick & Franklin — we read our own source code for the first time.', he: 'ווטסון, קריק ופרנקלין — קוראים לראשונה את קוד המקור שלנו.', ru: 'Уотсон, Крик и Франклин — мы впервые читаем свой исходный код.' } },
  { era: 'modern', date: 55, major: false, emoji: '🌙',
    title: { en: 'Moon landing', he: 'נחיתה על הירח', ru: 'Высадка на Луну' },
    desc: { en: 'Apollo 11, 1969 — a primate from the African savanna walks on another world.', he: 'אפולו 11, 1969 — פרימט מהסוואנה האפריקאית הולך על עולם אחר.', ru: 'Аполлон-11, 1969 — примат из африканской саванны ступает на другой мир.' } },
  { era: 'modern', date: 0, major: true, emoji: '🌐', now: true,
    title: { en: '8,000,000,000 humans', he: '8,000,000,000 בני אדם', ru: '8 000 000 000 людей' },
    desc: { en: 'Every continent, every climate zone, from ocean floor to orbit. One species, 6,000 languages, and counting.', he: 'כל יבשת, כל אזור אקלים. מין אחד, 6,000 שפות, וסופרים.', ru: 'Каждый континент, каждая климатическая зона. Один вид, 6000 языков.' } },
];
```

- [ ] **Step 7: Verify data module loads**

Run: `node serve.js` and open browser console at `http://localhost:5555`.
Temporarily add `import * as SD from './sapiensData.js'; window._SD = SD;` to `app.js`, verify `_SD.TRAIT_CARDS.length === 4` in console, then remove the temp import.

- [ ] **Step 8: Commit**

```bash
git add js/sapiensData.js
git commit -m "data: add sapiensData.js — static content for Homo sapiens showcase"
```

---

### Task 2: CSS Foundation (`css/sapiens.css`)

**Files:**
- Create: `css/sapiens.css`
- Modify: `index.html` (line 41)

- [ ] **Step 1: Create `css/sapiens.css` with overlay + scroll snap + close button + drawer**

```css
/* ══════════════════════════════════════════════════════
   SAPIENS — Homo sapiens showcase overlay
   ══════════════════════════════════════════════════════ */

/* ── Overlay shell ── */
.sapiens-overlay{
  position:fixed;inset:0;z-index:var(--z-toast);
  background:var(--bg);
  opacity:0;transition:opacity 0.3s ease;
}
.sapiens-overlay.open{opacity:1;}

.sapiens-scroll{
  height:100vh;overflow-y:auto;
  scroll-snap-type:y proximity;
  scroll-behavior:smooth;
}

.sapiens-section{
  min-height:100vh;
  scroll-snap-align:start;
  position:relative;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:80px 24px 64px;
}

/* ── Close button ── */
.sapiens-close{
  position:fixed;top:16px;right:16px;z-index:calc(var(--z-toast) + 20);
  width:40px;height:40px;border-radius:var(--radius-md);
  border:1px solid var(--glass-border);
  background:rgba(20,22,24,0.6);backdrop-filter:var(--glass-blur);
  color:var(--text-secondary);font-size:20px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all var(--transition-normal);
}
.sapiens-close:hover{background:rgba(200,136,58,0.12);color:var(--text-primary);}

/* ── Drawer ── */
.sapiens-drawer{
  position:fixed;top:0;right:-480px;
  width:min(480px,100vw);height:100vh;
  z-index:calc(var(--z-toast) + 10);
  background:var(--surface-overlay);
  backdrop-filter:blur(24px);
  border-left:1px solid rgba(var(--accent-rgb),0.08);
  box-shadow:-8px 0 40px rgba(0,0,0,0.5);
  overflow-y:auto;
  transition:right 0.35s cubic-bezier(0.16,1,0.3,1);
}
.sapiens-drawer.open{right:0;}

.sapiens-drawer-close{
  position:sticky;top:14px;float:right;margin:14px 14px 0 0;z-index:2;
  width:34px;height:34px;border-radius:var(--radius-md);
  border:1px solid var(--glass-border);
  background:rgba(14,16,20,0.6);backdrop-filter:blur(8px);
  color:var(--text-secondary);font-size:18px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all var(--transition-normal);
}
.sapiens-drawer-close:hover{background:rgba(200,136,58,0.15);color:var(--text-primary);}

/* ── Section typography ── */
.sap-overline{
  font-size:var(--text-xs);font-weight:500;letter-spacing:5px;
  text-transform:uppercase;color:var(--accent);opacity:0.5;margin-bottom:14px;
}
.sap-title{
  font-size:clamp(30px,4.5vw,48px);font-weight:200;
  color:var(--text-primary);margin-bottom:10px;
}
.sap-sub{
  font-size:15px;font-weight:300;
  color:var(--text-dim);margin-bottom:48px;
  max-width:560px;line-height:1.6;
}
```

This is a starter CSS. Each subsequent task will append section-specific styles.

- [ ] **Step 2: Add the stylesheet link to `index.html`**

In `index.html` at line 41, after the `responsive.css` link, add:
```html
<link rel="stylesheet" href="css/sapiens.css">
```

- [ ] **Step 3: Verify CSS loads**

Open `http://localhost:5555` in browser, check Network tab confirms `sapiens.css` loads with 200 status.

- [ ] **Step 4: Commit**

```bash
git add css/sapiens.css index.html
git commit -m "style: add css/sapiens.css shell — overlay, drawer, typography"
```

---

### Task 3: Overlay Lifecycle + Hero Section (`js/sapiens.js`)

**Files:**
- Create: `js/sapiens.js`
- Modify: `js/panel.js` (line 819)
- Modify: `js/app.js` (lines 31, 71)

This is the core task — creates the module, wires it into the app, and renders the hero section.

- [ ] **Step 1: Create `js/sapiens.js` with lifecycle and hero**

```js
// ══════════════════════════════════════════════════════
// SAPIENS — Homo sapiens full-screen showcase
// ══════════════════════════════════════════════════════

import { state, nodeMap, navStack } from './state.js';
import { reducedMotion } from './utils.js';
import { SAPIENS_HERO, TRAIT_CARDS, COMPARISON_SPECIES, TIMELINE_EVENTS, TIMELINE_ERAS,
         MIGRATION_ROUTES, MIGRATION_ORIGIN, MIGRATION_MAP_IMAGE,
         SKULL_IMAGES, NEURAL_DENSITY, BRAIN_ENERGY, BRAIN_TIMELINE,
         MAX_BRAIN_CC, MAX_LIVED_KA } from './sapiensData.js';

// ── Late-binding deps ──
let _pushNav, _navBack, _showMainPanel, _t, _scheduleRender, _smoothPanTo;
export function initSapiensDeps(deps) {
  _pushNav = deps.pushNav;
  _navBack = deps.navBack;
  _showMainPanel = deps.showMainPanel;
  _t = deps.t;
  _scheduleRender = deps.scheduleRender;
  _smoothPanTo = deps.smoothPanTo;
}

let overlay = null;
let drawer = null;
let observers = [];

// ── Public API ──

export function openSapiens() {
  if (overlay) return;
  _pushNav();

  overlay = document.createElement('div');
  overlay.className = 'sapiens-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Homo sapiens showcase');

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'sapiens-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closeSapiens);
  overlay.appendChild(closeBtn);

  // Scroll container
  const scroll = document.createElement('div');
  scroll.className = 'sapiens-scroll';
  overlay.appendChild(scroll);

  // Drawer
  drawer = document.createElement('div');
  drawer.className = 'sapiens-drawer';
  const drawerClose = document.createElement('button');
  drawerClose.className = 'sapiens-drawer-close';
  drawerClose.setAttribute('aria-label', 'Close');
  drawerClose.innerHTML = '&times;';
  drawerClose.addEventListener('click', closeDrawer);
  drawer.appendChild(drawerClose);
  const drawerContent = document.createElement('div');
  drawerContent.className = 'sapiens-drawer-content';
  drawer.appendChild(drawerContent);
  overlay.appendChild(drawer);

  // Build sections
  scroll.appendChild(buildHero());
  // Sections 2-5 will be added in Tasks 4-7

  // Lock body scroll and show
  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));

  // Keyboard handler
  overlay._onKey = e => {
    if (e.key === 'Escape') {
      if (drawer.classList.contains('open')) closeDrawer();
      else closeSapiens();
    }
  };
  document.addEventListener('keydown', overlay._onKey);
}

export function closeSapiens() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.removeEventListener('keydown', overlay._onKey);
  observers.forEach(o => o.disconnect());
  observers = [];
  setTimeout(() => {
    overlay.remove();
    overlay = null;
    drawer = null;
    document.body.style.overflow = '';
  }, 300);
}

// ── Drawer ──

function openDrawer(buildFn) {
  const content = drawer.querySelector('.sapiens-drawer-content');
  content.innerHTML = '';
  buildFn(content);
  drawer.classList.add('open');
}

function closeDrawer() {
  drawer.classList.remove('open');
}

// ── Helper: localized text ──
function txt(obj) {
  if (typeof obj === 'string') return obj;
  return obj[state.currentLang] || obj.en || '';
}

// ── Helper: observe for scroll-triggered animation ──
function onVisible(el, callback, opts = {}) {
  if (reducedMotion() && !opts.essential) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { callback(e.target); if (!opts.repeat) obs.unobserve(e.target); } });
  }, { threshold: opts.threshold || 0.2 });
  obs.observe(el);
  observers.push(obs);
}

// ── Hero Section ──

function buildHero() {
  const sec = document.createElement('section');
  sec.className = 'sapiens-section sap-hero';

  const h = SAPIENS_HERO;
  sec.innerHTML = `
    <img class="sap-hero-bg" src="${h.bgImage}" alt="" loading="eager"
         onerror="this.style.display='none'"/>
    <div class="sap-hero-gradient"></div>
    <div class="sap-hero-glow"></div>
    <div class="sap-hero-content">
      <div class="sap-overline">${txt(h.overline)}</div>
      <h1 class="sap-hero-title"><em>Homo sapiens</em></h1>
      <p class="sap-hero-tagline">${txt(h.tagline)}</p>
      <div class="sap-hero-counters" id="sap-counters">
        ${h.counters.map((c, i) => `
          ${i > 0 ? '<div class="sap-counter-divider"></div>' : ''}
          <div class="sap-counter-block">
            <div class="sap-counter-value" data-target="${c.value}" data-suffix="${c.suffix || ''}">${c.suffix ? '0+' : '0'}</div>
            <div class="sap-counter-label">${txt(c.label)}</div>
          </div>
        `).join('')}
      </div>
      <button class="sap-hero-pill" id="sap-etymology-btn">
        <span>${txt(h.etymologyTitle)}</span>
        <span class="sap-pill-arrow">&#9660;</span>
      </button>
      <div class="sap-hero-scroll">
        <span>${txt({ en: 'Explore', he: 'גלה', ru: 'Узнать' })}</span>
        <div class="sap-scroll-line"></div>
      </div>
    </div>
  `;

  // Wire etymology pill
  requestAnimationFrame(() => {
    const btn = sec.querySelector('#sap-etymology-btn');
    if (btn) btn.addEventListener('click', () => {
      openDrawer(el => {
        el.innerHTML = `
          <div style="padding:32px 28px;">
            <div style="font-size:28px;margin-bottom:12px;">📖</div>
            <h3 style="font-size:20px;font-weight:300;color:var(--text-primary);margin-bottom:6px;">
              ${txt(h.etymologyTitle)}
            </h3>
            <div style="font-size:14px;color:var(--text-dim);line-height:1.7;margin-top:16px;">
              ${txt(h.etymologyContent)}
            </div>
          </div>
        `;
      });
    });

    // Animate counters
    animateCounters(sec);
  });

  return sec;
}

function animateCounters(sec) {
  const counters = sec.querySelectorAll('.sap-counter-value');
  if (reducedMotion()) {
    counters.forEach(el => {
      const target = Number(el.dataset.target);
      el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
    });
    return;
  }
  counters.forEach(el => {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const current = Math.round(target * ease);
      el.textContent = current.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
```

- [ ] **Step 2: Add hero CSS to `css/sapiens.css`**

Append to `css/sapiens.css`:

```css
/* ── Hero Section ── */
.sap-hero{padding:0;overflow:hidden;}

.sap-hero-bg{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;object-position:center 30%;
  opacity:0.25;filter:saturate(0.4) brightness(0.5);
  z-index:0;
}
.sap-hero-gradient{
  position:absolute;inset:0;z-index:1;
  background:linear-gradient(180deg,
    rgba(20,22,24,0) 0%,
    rgba(20,22,24,0.4) 50%,
    var(--bg) 100%
  );
}
.sap-hero-glow{
  position:absolute;width:600px;height:600px;border-radius:50%;
  top:50%;left:50%;transform:translate(-50%,-55%);z-index:0;
  background:radial-gradient(circle,rgba(var(--accent-rgb),0.06) 0%,transparent 70%);
}

.sap-hero-content{
  position:relative;z-index:2;text-align:center;padding:0 24px;
}

.sap-hero-title{
  font-size:clamp(40px,7vw,72px);font-weight:200;
  color:var(--text-primary);line-height:1.1;margin-bottom:12px;letter-spacing:1px;
}
.sap-hero-title em{font-weight:300;font-style:italic;}

.sap-hero-tagline{
  font-size:clamp(15px,2.2vw,20px);font-weight:300;
  color:var(--accent);letter-spacing:0.5px;margin-bottom:56px;
}

.sap-hero-counters{
  display:flex;align-items:center;justify-content:center;margin-bottom:56px;
}
.sap-counter-block{padding:0 clamp(20px,4vw,48px);}
.sap-counter-divider{
  width:1px;height:48px;
  background:linear-gradient(180deg,transparent,rgba(var(--accent-rgb),0.3),transparent);
}
.sap-counter-value{
  font-family:var(--font-mono);font-size:clamp(22px,3.5vw,36px);
  font-weight:500;color:var(--text-primary);line-height:1.2;
}
.sap-counter-label{
  font-size:10px;font-weight:400;letter-spacing:3px;
  text-transform:uppercase;color:var(--text-faint);margin-top:8px;
}

.sap-hero-pill{
  display:inline-flex;align-items:center;gap:10px;
  padding:10px 24px;border-radius:24px;cursor:pointer;
  border:1px solid rgba(var(--accent-rgb),0.2);
  background:rgba(var(--accent-rgb),0.04);
  color:rgba(var(--accent-rgb),0.7);
  font-family:var(--font-body);font-size:13px;font-weight:400;
  transition:all 0.3s ease;
}
.sap-hero-pill:hover{
  border-color:rgba(var(--accent-rgb),0.4);
  background:rgba(var(--accent-rgb),0.08);color:var(--accent);
}
.sap-pill-arrow{font-size:9px;transition:transform 0.3s ease;}
.sap-hero-pill:hover .sap-pill-arrow{transform:translateY(2px);}

.sap-hero-scroll{
  position:absolute;bottom:32px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0.3;
}
.sap-hero-scroll span{
  font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text-dim);
}
.sap-scroll-line{
  width:1px;height:32px;
  background:linear-gradient(180deg,rgba(var(--accent-rgb),0.4),transparent);
  animation:sapScrollPulse 2s ease-in-out infinite;
}
@keyframes sapScrollPulse{
  0%,100%{opacity:0.3;transform:scaleY(1);}
  50%{opacity:0.8;transform:scaleY(1.2);transform-origin:top;}
}

/* Reduced motion */
@media(prefers-reduced-motion:reduce){
  .sap-scroll-line{animation:none;opacity:0.4;}
}
```

- [ ] **Step 3: Wire sapiens into `app.js`**

In `js/app.js`, add the import after the tours import (line 60):
```js
import { openSapiens, closeSapiens, initSapiensDeps } from './sapiens.js';
```

Add the dep wiring after `initPanelDeps` (line 71), add:
```js
initSapiensDeps({ pushNav, navBack, showMainPanel, t, scheduleRender, smoothPanTo });
```

- [ ] **Step 4: Add interception in `panel.js`**

At the top of `panel.js`, add to the late-binding deps section (after line 16):
```js
let _openSapiens;
```

In `initPanelDeps` (line 17), add `_openSapiens = deps.openSapiens;` to the function body.

At the top of `showMainPanel` function (line 820, after the existing early return), add:

```js
  // Homo sapiens showcase intercept
  if (n.id === 'h_sapiens' || n.id === 'hominini') {
    if (_openSapiens) _openSapiens();
    return;
  }
```

In `app.js`, update the `initPanelDeps` call to include `openSapiens`:
```js
initPanelDeps({ pushNav, updateNavButtons, updateBreadcrumb, scheduleRender, smoothPanTo, focusNode, t, generateSpeciesIllustration, navBack, layout, applyT, centerOnRoot, openSapiens });
```

This follows the existing late-binding pattern — no dynamic imports needed.

- [ ] **Step 5: Verify hero section works**

Open `http://localhost:5555`, navigate to the Homo sapiens node in the tree, click it. Expected:
- Full-screen overlay fades in
- Hero section visible with title, counters animating, tagline
- ESC closes the overlay
- "Why sapiens?" pill opens the drawer

- [ ] **Step 6: Commit**

```bash
git add js/sapiens.js js/app.js js/panel.js css/sapiens.css
git commit -m "feat: add Homo sapiens showcase — overlay lifecycle + hero section"
```

---

### Task 4: Migration Map (Section 2)

**Files:**
- Modify: `js/sapiens.js`
- Modify: `css/sapiens.css`

- [ ] **Step 1: Add `buildMigrationMap()` to `sapiens.js`**

Add this function before the hero section:

```js
// ── Migration Map (Section 2) ──

function buildMigrationMap() {
  const sec = document.createElement('section');
  sec.className = 'sapiens-section sap-migration';

  const routes = MIGRATION_ROUTES;
  const origin = MIGRATION_ORIGIN;

  sec.innerHTML = `
    <div class="sap-section-inner">
      <div class="sap-overline">${txt({ en: 'Our Journey', he: 'המסע שלנו', ru: 'Наше путешествие' })}</div>
      <h2 class="sap-title">${txt({ en: 'Out of Africa', he: 'מחוץ לאפריקה', ru: 'Из Африки' })}</h2>
      <p class="sap-sub">${txt({ en: 'One species walked out of East Africa and colonized every continent on Earth.', he: 'מין אחד יצא ממזרח אפריקה וכבש כל יבשת על פני כדור הארץ.', ru: 'Один вид вышел из Восточной Африки и заселил все континенты.' })}</p>

      <div class="sap-map-frame">
        <img class="sap-map-img" src="${MIGRATION_MAP_IMAGE}" alt=""
             onerror="this.style.display='none'" loading="lazy"/>
        <svg class="sap-map-svg" viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
          ${routes.map(r => `
            <g class="sap-route" data-date="${r.date}" data-id="${r.id}">
              <path class="sap-route-bg" d="${r.path}"/>
              <path class="sap-route-active" d="${r.path}"/>
              <path class="sap-route-flow" d="${r.path}"/>
            </g>
          `).join('')}
          <circle class="sap-origin-glow" cx="${origin.x}" cy="${origin.y}" r="3"/>
          <circle class="sap-origin-pulse" cx="${origin.x}" cy="${origin.y}" r="5"/>
          <circle class="sap-origin-core" cx="${origin.x}" cy="${origin.y}" r="1.2"/>
          ${routes.map(r => {
            const end = r.path.split(/[MQLC]\s*/i).filter(Boolean).pop().trim().split(/[,\s]+/);
            const ex = parseFloat(end[0]), ey = parseFloat(end[1]);
            return `
              <g class="sap-dest" data-date="${r.date}">
                <circle class="sap-dest-glow" cx="${ex}" cy="${ey}" r="2.5"/>
                <circle class="sap-dest-core" cx="${ex}" cy="${ey}" r="0.9"/>
                <text class="sap-dest-label" x="${ex+1.5}" y="${ey-0.5}">${r.date} Ka</text>
              </g>
            `;
          }).join('')}
        </svg>
        <div class="sap-map-tooltip" id="sap-map-tt"></div>
      </div>

      <div class="sap-map-controls">
        <button class="sap-play-btn" id="sap-map-play" aria-label="Play animation">
          <svg viewBox="0 0 24 24" width="12" height="12"><polygon points="6,4 20,12 6,20" fill="currentColor"/></svg>
        </button>
        <span class="sap-map-bound">300 Ka</span>
        <input type="range" class="sap-map-slider" id="sap-map-slider"
               min="0" max="300" value="0" step="1"/>
        <span class="sap-map-bound">${txt({ en: 'Now', he: 'עכשיו', ru: 'Сейчас' })}</span>
        <span class="sap-map-time" id="sap-map-time">300 Ka</span>
      </div>
    </div>
  `;

  // Wire interactions after DOM insert
  requestAnimationFrame(() => {
    const slider = sec.querySelector('#sap-map-slider');
    const timeLabel = sec.querySelector('#sap-map-time');
    const playBtn = sec.querySelector('#sap-map-play');
    let playId = null;

    function updateMap(ka) {
      timeLabel.textContent = ka > 0 ? `${ka} Ka` : txt({ en: 'Present', he: 'הווה', ru: 'Сейчас' });
      const age = 300 - ka; // slider 0 = 300Ka, slider 300 = present
      sec.querySelectorAll('.sap-route').forEach(g => {
        const d = parseInt(g.dataset.date);
        g.classList.toggle('visible', d >= age);
      });
      sec.querySelectorAll('.sap-dest').forEach(g => {
        const d = parseInt(g.dataset.date);
        g.classList.toggle('visible', d >= age);
      });
    }

    if (slider) {
      slider.addEventListener('input', () => {
        const ka = 300 - parseInt(slider.value);
        updateMap(ka);
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (playId) { cancelAnimationFrame(playId); playId = null; return; }
        slider.value = 0;
        updateMap(300);
        const start = performance.now();
        const dur = 10000;
        function tick(now) {
          const t = Math.min((now - start) / dur, 1);
          const val = Math.round(t * 300);
          slider.value = val;
          updateMap(300 - val);
          if (t < 1) playId = requestAnimationFrame(tick);
          else playId = null;
        }
        playId = requestAnimationFrame(tick);
      });
    }

    // Tooltip on dest hover
    sec.querySelectorAll('.sap-dest').forEach(g => {
      const date = g.dataset.date;
      const route = routes.find(r => String(r.date) === date);
      if (!route) return;
      g.addEventListener('mouseenter', e => {
        const tt = sec.querySelector('#sap-map-tt');
        if (!tt) return;
        tt.innerHTML = `
          <div class="sap-tt-date">${route.date === 0 ? txt({en:'Present',he:'הווה',ru:'Сейчас'}) : route.date + ' Ka'}</div>
          <div class="sap-tt-place">${txt(route.label)}</div>
          <div class="sap-tt-site">${txt(route.site)}</div>
        `;
        const rect = g.getBoundingClientRect();
        const frame = sec.querySelector('.sap-map-frame').getBoundingClientRect();
        tt.style.left = (rect.left - frame.left + rect.width / 2) + 'px';
        tt.style.top = (rect.top - frame.top - 60) + 'px';
        tt.classList.add('visible');
      });
      g.addEventListener('mouseleave', () => {
        const tt = sec.querySelector('#sap-map-tt');
        if (tt) tt.classList.remove('visible');
      });
    });

    // Auto-play on scroll
    onVisible(sec, () => {
      if (playBtn && !playId) playBtn.click();
    }, { essential: true });
  });

  return sec;
}
```

- [ ] **Step 2: Register section in `openSapiens()`**

In `openSapiens()`, after `scroll.appendChild(buildHero());`, add:
```js
  scroll.appendChild(buildMigrationMap());
```

- [ ] **Step 3: Add migration CSS to `css/sapiens.css`**

Append the migration map styles (map frame, SVG routes/dots, slider, tooltip, responsive). This is a large CSS block — see the full content in the design spec mockup `migration-map-v3.html`. Key classes: `.sap-map-frame`, `.sap-map-img`, `.sap-map-svg`, `.sap-route`, `.sap-route.visible`, `.sap-dest`, `.sap-dest.visible`, `.sap-map-controls`, `.sap-map-slider`, `.sap-map-tooltip`.

- [ ] **Step 4: Verify migration map**

Open showcase, scroll to section 2. Expected:
- World map background visible (desaturated)
- Play button auto-triggers on scroll
- Routes animate sequentially
- Slider scrubs time manually
- Dot hover shows tooltip

- [ ] **Step 5: Commit**

```bash
git add js/sapiens.js css/sapiens.css
git commit -m "feat: add migration map section — routes, slider, auto-play"
```

---

### Task 5: Trait Cards + Brain Drawer (Section 3)

**Files:**
- Modify: `js/sapiens.js`
- Modify: `css/sapiens.css`

- [ ] **Step 1: Add `buildTraitCards()` to `sapiens.js`**

Build the 2x2 card grid. Each card has a hero image, badge, stat, fun fact, and CTA that opens a drawer. The brain drawer includes skull lineup, neural density cards, energy ring, and growth timeline. Other drawers (language, technology, DNA) use simpler content.

- [ ] **Step 2: Register in `openSapiens()`**

After migration map: `scroll.appendChild(buildTraitCards());`

- [ ] **Step 3: Add trait card + drawer CSS**

Card grid, card hover effects, drawer hero, bar charts, skull lineup, density cards, energy ring, insight callout. Key classes: `.sap-card-grid`, `.sap-card`, `.sap-card-hero`, `.sap-card-badge`, `.sap-skull-lineup`, `.sap-density-grid`, `.sap-energy-wrap`, `.sap-ring-chart`, `.sap-insight`.

- [ ] **Step 4: Verify cards and brain drawer**

Click Brain card → drawer opens with skull images, neural density comparison, energy ring, growth timeline. ESC closes drawer. Other cards open simpler drawers.

- [ ] **Step 5: Commit**

```bash
git add js/sapiens.js css/sapiens.css
git commit -m "feat: add trait cards section — 4 cards with brain drawer deep-dive"
```

---

### Task 6: Comparison Table (Section 4)

**Files:**
- Modify: `js/sapiens.js`
- Modify: `css/sapiens.css`

- [ ] **Step 1: Add `buildComparisonTable()` to `sapiens.js`**

Build the glassmorphism table with 5 species × 8 categories. First 3 rows (brain, height, lifespan) use visual elements (mini bars, stick figures, timeline bars). Remaining rows use text/emoji. Also build the mobile swipe card alternative.

Species names are clickable — call `closeSapiens()` then `_showMainPanel(nodeMap[species.nodeId])`.

- [ ] **Step 2: Add mobile swipe touch handling**

~50 lines: `touchstart`/`touchmove`/`touchend` on `.sap-swipe-container` to snap between cards. Update dot indicators on snap.

- [ ] **Step 3: Register in `openSapiens()`**

After trait cards: `scroll.appendChild(buildComparisonTable());`

- [ ] **Step 4: Add comparison CSS**

Table glassmorphism, column highlight, visual rows (brain bars, height figures, lifespan bars), status badges, mobile swipe cards + dots. Key classes: `.sap-compare-table`, `.sap-brain-cell`, `.sap-height-figure`, `.sap-span-bar`, `.sap-swipe-container`, `.sap-swipe-card`.

- [ ] **Step 5: Verify table and mobile**

Desktop: table with visual rows, sapiens column highlighted, species clickable. Resize to <768px: table replaced by swipe cards.

- [ ] **Step 6: Commit**

```bash
git add js/sapiens.js css/sapiens.css
git commit -m "feat: add comparison table — visual rows, mobile swipe cards"
```

---

### Task 7: Timeline (Section 5)

**Files:**
- Modify: `js/sapiens.js`
- Modify: `css/sapiens.css`

- [ ] **Step 1: Add `buildTimeline()` to `sapiens.js`**

Vertical timeline with logarithmic spacing. Events grouped by era. Major events get larger dots. Present event pulses. Click opens drawer with expanded content. Ends with the 1.7% callout and proportional strip.

Logarithmic spacing:
```js
function logScale(date) {
  if (date <= 0) return 1;
  const maxLog = Math.log10(300000);
  return 1 - Math.log10(date) / maxLog;
}
```

- [ ] **Step 2: Register in `openSapiens()`**

After comparison: `scroll.appendChild(buildTimeline());`

- [ ] **Step 3: Add timeline CSS**

Vertical line gradient, dot sizes, era labels, event hover, 1.7% callout, proportional strip. Key classes: `.sap-timeline`, `.sap-tl-event`, `.sap-tl-event.major`, `.sap-tl-event.now`, `.sap-scale-callout`, `.sap-scale-strip`.

- [ ] **Step 4: Verify timeline**

Scroll to section 5. Events visible with logarithmic spacing, era labels, hover effects, click opens drawer. 1.7% callout at bottom with proportional strip.

- [ ] **Step 5: Commit**

```bash
git add js/sapiens.js css/sapiens.css
git commit -m "feat: add timeline section — logarithmic scale, 1.7% callout"
```

---

### Task 8: Responsive + Light Theme + RTL

**Files:**
- Modify: `css/sapiens.css`

- [ ] **Step 1: Add responsive breakpoints**

```css
@media(max-width:768px){
  .sap-compare-table{display:none;}
  .sap-mobile-cards{display:block;}
  .sap-hero-counters{flex-direction:column;gap:24px;}
  .sap-counter-divider{width:48px;height:1px;
    background:linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.3),transparent);}
  .sapiens-drawer{width:100vw;}
  .sap-card-grid{grid-template-columns:1fr;}
  .sap-section-inner{padding:0 16px;}
}

@media(max-width:480px){
  .sap-hero-title{font-size:36px;}
  .sap-map-controls{flex-wrap:wrap;gap:8px;}
}
```

- [ ] **Step 2: Add light theme overrides**

```css
[data-theme="light"] .sapiens-overlay{background:var(--bg);}
[data-theme="light"] .sap-hero-bg{opacity:0.35;filter:saturate(0.5) brightness(0.8);}
[data-theme="light"] .sap-hero-gradient{
  background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.5) 50%,var(--bg) 100%);
}
[data-theme="light"] .sapiens-drawer{
  background:rgba(255,255,255,0.97);border-left:1px solid rgba(0,0,0,0.08);
}
[data-theme="light"] .sap-compare-table{background:rgba(255,255,255,0.6);}
```

- [ ] **Step 3: Add RTL support**

```css
[dir="rtl"] .sap-hero-content{direction:rtl;}
[dir="rtl"] .sapiens-drawer{right:auto;left:-480px;border-left:none;border-right:1px solid rgba(var(--accent-rgb),0.08);}
[dir="rtl"] .sapiens-drawer.open{left:0;right:auto;}
[dir="rtl"] .sap-tl-event{padding-left:0;padding-right:16px;}
[dir="rtl"] .sap-timeline::before{left:auto;right:19px;}
[dir="rtl"] .sapiens-close{right:auto;left:16px;}
```

- [ ] **Step 4: Verify responsive + light + RTL**

Test at 768px and 480px breakpoints. Toggle light theme. Switch to Hebrew (`?lang=he`). Expected: drawer from left, timeline mirrored, close button on left.

- [ ] **Step 5: Commit**

```bash
git add css/sapiens.css
git commit -m "style: responsive breakpoints, light theme, RTL support for showcase"
```

---

### Task 9: Polish + Verify Full Flow

**Files:**
- Modify: `js/sapiens.js` (minor)
- Modify: `css/sapiens.css` (minor)

- [ ] **Step 1: Add "View on Tree" button to hero**

In the hero section, after the scroll indicator, add a floating button:
```js
const viewBtn = document.createElement('button');
viewBtn.className = 'sap-view-tree-btn';
viewBtn.textContent = txt({ en: 'View on Tree', he: 'הצג בעץ', ru: 'Показать на дереве' });
viewBtn.addEventListener('click', () => {
  closeSapiens();
  const n = nodeMap['h_sapiens'];
  if (n && _smoothPanTo) _smoothPanTo(n._x, n._y);
});
```

- [ ] **Step 2: Hide scroll indicator after first scroll**

In `openSapiens()`, after building sections:
```js
const scrollEl = overlay.querySelector('.sapiens-scroll');
scrollEl.addEventListener('scroll', function onFirst() {
  const indicator = overlay.querySelector('.sap-hero-scroll');
  if (indicator) indicator.style.opacity = '0';
  scrollEl.removeEventListener('scroll', onFirst);
}, { passive: true });
```

- [ ] **Step 3: Full end-to-end test**

Open `http://localhost:5555`, test the complete flow:
1. Click `h_sapiens` → overlay opens with hero
2. Counters animate
3. "Why sapiens?" → drawer opens
4. Scroll → migration map auto-plays
5. Slider scrubs time
6. Scroll → trait cards visible, click Brain → drawer with skulls
7. Scroll → comparison table, visual rows, species clickable
8. Resize → swipe cards on mobile
9. Scroll → timeline with logarithmic spacing
10. Click timeline event → drawer
11. 1.7% callout visible
12. ESC closes overlay
13. Click `hominini` → also opens showcase
14. Test Hebrew RTL
15. Test light theme

- [ ] **Step 4: Commit**

```bash
git add js/sapiens.js css/sapiens.css
git commit -m "feat: polish — view on tree, scroll indicator, final tweaks"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Data module | `js/sapiensData.js` |
| 2 | CSS foundation | `css/sapiens.css`, `index.html` |
| 3 | Overlay lifecycle + Hero | `js/sapiens.js`, `js/app.js`, `js/panel.js` |
| 4 | Migration map | `js/sapiens.js`, `css/sapiens.css` |
| 5 | Trait cards + Brain drawer | `js/sapiens.js`, `css/sapiens.css` |
| 6 | Comparison table | `js/sapiens.js`, `css/sapiens.css` |
| 7 | Timeline | `js/sapiens.js`, `css/sapiens.css` |
| 8 | Responsive + Light + RTL | `css/sapiens.css` |
| 9 | Polish + Full verification | `js/sapiens.js`, `css/sapiens.css` |
