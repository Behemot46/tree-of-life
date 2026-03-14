// ══════════════════════════════════════════════════════
// FACT LIBRARY — Structured fact pool for loading screen
// and future surfaces (discovery cards, quiz, tooltips)
// ══════════════════════════════════════════════════════
const FACTS = (() => {

  // ── Loading-safe facts ─────────────────────────────
  // Short, standalone, awe-inspiring. Trilingual.
  // These are curated for the splash screen tagline.
  const facts = [
    {
      id: 'load_01',
      en: 'Every living thing is your cousin.',
      he: 'כל יצור חי הוא קרוב משפחה שלך.',
      ru: 'Каждое живое существо — ваш родственник.',
      tags: ['kinship', 'general'],
      loading: true
    },
    {
      id: 'load_02',
      en: 'You share 50% of your DNA with a banana.',
      he: 'אתה חולק 50% מה-DNA שלך עם בננה.',
      ru: 'У вас 50% общей ДНК с бананом.',
      tags: ['genetics', 'plants'],
      loading: true
    },
    {
      id: 'load_03',
      en: 'Life found a way — 3.8 billion years ago.',
      he: 'החיים מצאו דרך — לפני 3.8 מיליארד שנים.',
      ru: 'Жизнь нашла способ — 3,8 миллиарда лет назад.',
      tags: ['origin', 'general'],
      loading: true
    },
    {
      id: 'load_04',
      en: 'From a single cell to 8 billion humans.',
      he: 'מתא בודד ל-8 מיליארד בני אדם.',
      ru: 'От одной клетки до 8 миллиардов людей.',
      tags: ['evolution', 'humans'],
      loading: true
    },
    {
      id: 'load_05',
      en: 'The tree is real. You are a leaf.',
      he: 'העץ הזה אמיתי. אתה עלה בו.',
      ru: 'Это дерево реально. Вы — его лист.',
      tags: ['metaphor', 'general'],
      loading: true
    },
    {
      id: 'load_06',
      en: 'Sharks are older than trees.',
      he: 'כרישים קדומים יותר מעצים.',
      ru: 'Акулы старше деревьев.',
      tags: ['animals', 'deep-time'],
      loading: true
    },
    {
      id: 'load_07',
      en: 'Fungi are closer to animals than to plants.',
      he: 'פטריות קרובות יותר לבעלי חיים מאשר לצמחים.',
      ru: 'Грибы ближе к животным, чем к растениям.',
      tags: ['fungi', 'taxonomy'],
      loading: true
    },
    {
      id: 'load_08',
      en: 'The largest organism on Earth is a fungus.',
      he: 'האורגניזם הגדול ביותר על פני כדור הארץ הוא פטרייה.',
      ru: 'Крупнейший организм на Земле — гриб.',
      tags: ['fungi', 'records'],
      loading: true
    },
    {
      id: 'load_09',
      en: 'Diatoms produce more oxygen than all rainforests combined.',
      he: 'דיאטומיות מייצרות יותר חמצן מכל יערות הגשם יחד.',
      ru: 'Диатомеи производят больше кислорода, чем все тропические леса.',
      tags: ['protists', 'ecology'],
      loading: true
    },
    {
      id: 'load_10',
      en: 'Coral reefs cover 1% of the ocean but host 25% of marine species.',
      he: 'שוניות אלמוגים מכסות 1% מהאוקיינוס אך מארחות 25% מהמינים הימיים.',
      ru: 'Коралловые рифы — 1% океана, но 25% морских видов.',
      tags: ['animals', 'ecology'],
      loading: true
    },
    {
      id: 'load_11',
      en: 'Your body carries 1.5 kg of bacteria.',
      he: 'גופך מכיל 1.5 ק״ג של חיידקים.',
      ru: 'Ваше тело содержит 1,5 кг бактерий.',
      tags: ['bacteria', 'humans'],
      loading: true
    },
    {
      id: 'load_12',
      en: 'All humans descend from roughly 10,000 survivors.',
      he: 'כל בני האדם צאצאים של כ-10,000 שורדים.',
      ru: 'Все люди произошли от примерно 10 000 выживших.',
      tags: ['humans', 'genetics'],
      loading: true
    },
    {
      id: 'load_13',
      en: 'The coelacanth was thought extinct for 65 million years.',
      he: 'הסילקנת נחשבה לנכחדת במשך 65 מיליון שנה.',
      ru: 'Латимерию считали вымершей 65 миллионов лет.',
      tags: ['animals', 'deep-time'],
      loading: true
    },
    {
      id: 'load_14',
      en: 'An octopus has two thirds of its neurons in its arms.',
      he: 'לתמנון שני שלישים מהנוירונים בזרועותיו.',
      ru: 'Две трети нейронов осьминога — в его щупальцах.',
      tags: ['animals', 'neuroscience'],
      loading: true
    },
    {
      id: 'load_15',
      en: 'A blue whale\'s heart is the size of a small car.',
      he: 'לבו של לוויתן כחול בגודל מכונית קטנה.',
      ru: 'Сердце синего кита размером с небольшой автомобиль.',
      tags: ['animals', 'records'],
      loading: true
    },
    {
      id: 'load_16',
      en: 'Horseshoe crab blood is blue — and saves millions of lives each year.',
      he: 'דמו של סרטן פרסה כחול — ומציל מיליוני חיים מדי שנה.',
      ru: 'Кровь мечехвоста голубая — и спасает миллионы жизней ежегодно.',
      tags: ['animals', 'medicine'],
      loading: true
    },
    {
      id: 'load_17',
      en: 'Mimosa pudica can learn and remember for 28 days — with no brain.',
      he: 'מימוזה פודיקה יכולה ללמוד ולזכור 28 יום — בלי מוח.',
      ru: 'Мимоза стыдливая учится и помнит 28 дней — без мозга.',
      tags: ['plants', 'neuroscience'],
      loading: true
    },
    {
      id: 'load_18',
      en: 'The peregrine falcon dives at 389 km/h — faster than a Formula 1 car.',
      he: 'בז נודד צולל במהירות 389 קמ״ש — מהר יותר ממכונית פורמולה 1.',
      ru: 'Сапсан пикирует со скоростью 389 км/ч — быстрее болида Формулы-1.',
      tags: ['animals', 'records'],
      loading: true
    }
  ];

  // ── Public API ─────────────────────────────────────

  /** Get a random loading-safe fact in the given language */
  function getLoadingFact(lang) {
    const pool = facts.filter(f => f.loading);
    const f = pool[Math.floor(Math.random() * pool.length)];
    return f[lang] || f.en;
  }

  /** Get all facts */
  function getAll() { return facts; }

  /** Get a fact by its stable ID */
  function getById(id) { return facts.find(f => f.id === id) || null; }

  /** Get all facts matching a tag */
  function getByTag(tag) { return facts.filter(f => f.tags.includes(tag)); }

  /** Get all loading-safe facts */
  function getLoadingPool() { return facts.filter(f => f.loading); }

  return { getLoadingFact, getAll, getById, getByTag, getLoadingPool, facts };
})();
