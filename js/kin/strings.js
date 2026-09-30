// ══════════════════════════════════════════════════════
// KIN — WORDS
//
// Everything the player reads, in English, Hebrew and Russian.
//
// The game's Hebrew name is קרובים ("relatives", and also "close ones"),
// not a transliteration: "Kin" written in Hebrew letters is קין, Cain.
//
// Sentences are built per language rather than translated from one template,
// because the grammar differs: English says "Whales and hippos last shared
// an ancestor…", Hebrew says "ללווייתן ולהיפופוטם היה אב קדמון משותף…",
// with the preposition fused onto each noun (the `le` forms in creatures.js),
// and Russian says "Последний общий предок кита и бегемота жил…", with both
// nouns in the genitive (the `g` forms).
//
// The Russian name is Родня ("kin", "family"). Its prompt ends where the
// target's card begins: "С кем в более близком родстве…" + "Бегемот" reads as
// one sentence with the card as its subject, so the card keeps its plain
// name, where a dative "ближе к…" would have needed "бегемоту" on the card.
//
// Each language names itself (`code`, `name`) for the switcher, so adding a
// language never means editing the others.
// ══════════════════════════════════════════════════════

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* Mya → "53", "8.7", "1,200". One decimal below 20 million years, where the
   decimal is the difference between gorilla (8.7) and orangutan (15.6). */
function num(mya) {
  if (mya < 20) return String(+mya.toFixed(1));
  return Math.round(mya).toLocaleString('en-US');
}

/* Russian writes the decimal with a comma: "8,7", "1,5 млрд". */
const numRu = (mya) => num(mya).replace('.', ',');
const bnRu = (mya) => (mya / 1000).toFixed(1).replace('.', ',');

/* Russian picks one of three forms by the number — 1 день, 2 дня, 5 дней —
   and 11 to 14 always take the third. Written out rather than sampled from
   the numbers the game happens to show today. */
function plural(n, one, few, many) {
  const d = n % 10, h = n % 100;
  if (d === 1 && h !== 11) return one;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
}

export const STRINGS = {
  en: {
    dir: 'ltr',
    brand: 'Kin',
    title: 'Kin · Tree of Life',
    promptYou: 'Who is your closer cousin?',
    prompt: 'Who is the closer cousin of…',
    tapHint: 'Tap the one you think is more closely related',
    right: (c) => `✓ Yes, ${c.en.the}.`,
    wrong: (c) => `✗ Surprise, it's ${c.en.the}.`,
    years(d) {
      if (d.min) return `more than ${num(d.mya)} million years`;
      if (d.mya >= 1000) return `about ${(d.mya / 1000).toFixed(1)} billion years`;
      return `about ${num(d.mya)} million years`;
    },
    short(d) {
      if (d.mya >= 1000) return `${(d.mya / 1000).toFixed(1)}B yrs ago`;
      return `${num(d.mya)}M${d.min ? '+' : ''} yrs ago`;
    },
    headline(T, N, F, dn, df) {
      return `${cap(T.en.p)} and ${N.en.p} last shared an ancestor ${this.years(dn)} ago. `
           + `The ${F.en.line} line branched off ${this.years(df)} ago.`;
    },
    headlineNoDates: (T, N, F) => `${cap(T.en.p)} and ${N.en.p} share a more recent ancestor than either does with ${F.en.p}.`,
    past: 'past', now: 'now',
    sources: 'Dates:',
    next: 'Next', seeResult: 'See your result', seeRun: 'See your run', finish: 'Finish',
    intro: "That's Kin: ten of these a day, the same for everyone. Each tree shows when two living things last shared an ancestor.",
    resultEyebrow: (n) => `Kin #${n} · your result`,
    titles: ['Seedling', 'Sprout', 'Sapling', 'Old growth', 'Tree of Life'],
    share: 'Share your result', copied: 'Copied. Paste it anywhere.', shared: 'Shared',
    copyFallback: 'Select the text and copy it',
    playArcade: 'Play Arcade: endless',
    nextKin: (t) => `Next Kin in ${t}`,
    streak: (n) => (n === 1 ? '🔥 Day 1 of your streak' : `🔥 ${n} days in a row`),
    recap: 'Your answers',
    arcade: 'Arcade',
    lives: (n) => `${n} ${n === 1 ? 'life' : 'lives'} left`,
    pts: (n) => `${n} pts`,
    inARow: (n) => `${n} in a row`,
    runOver: 'Arcade · run over', allPlayed: 'Arcade · every question played',
    newBest: 'New best run', best: (n) => `Best run: ${n}`,
    playAgain: 'Play again', backToResult: 'Back to your result', backToKin: "Back to today's Kin",
    arcadeNote: 'Three wrong answers end a run. Every question in the game is in here.',
    soundOn: 'Sound on', soundOff: 'Sound off',
    code: 'EN', name: 'English',
    testBuild: 'Test build · treeoflife.wiki',
    stats: 'This device', statsReset: 'Reset this device',
    statsRows: (s) => [
      ['First played', s.firstSeen || '—'],
      ['Days played', String(s.days.length)],
      ['Dailies finished', String(s.dailies)],
      ['Questions answered', `${s.answers} (${s.correct} right)`],
      ['Arcade runs', String(s.arcadeRuns)],
      ['Best arcade run', String(s.bestArcade)],
      ['Results shared', String(s.shares)],
    ],
    statsNote: 'Kept only on this device. Nothing is sent anywhere.',
    statsBack: 'Back to the game',
  },

  he: {
    dir: 'rtl',
    brand: 'קרובים',
    title: 'קרובים · עץ החיים',
    promptYou: 'מי קרוב יותר אלינו?',
    prompt: 'מי קרוב יותר ל…',
    tapHint: 'הקישו על מי שלדעתכם קרוב יותר',
    right: (c) => `✓ נכון! ${c.he.def}.`,
    wrong: (c) => `✗ הפתעה: ${c.he.def}.`,
    years(d) {
      if (d.min) return `יותר מ־${num(d.mya)} מיליון שנה`;
      if (d.mya >= 1000) return `כ־${(d.mya / 1000).toFixed(1)} מיליארד שנה`;
      return `כ־${num(d.mya)} מיליון שנה`;
    },
    short(d) {
      if (d.mya >= 1000) return `לפני ${(d.mya / 1000).toFixed(1)} מיליארד שנה`;
      return d.min ? `לפני יותר מ־${num(d.mya)} מיל׳ שנה` : `לפני ${num(d.mya)} מיל׳ שנה`;
    },
    headline(T, N, F, dn, df) {
      return `${T.he.le} ו${N.he.le} היה אב קדמון משותף לפני ${this.years(dn)}. `
           + `הקו של ${F.he.def} התפצל לפני ${this.years(df)}.`;
    },
    headlineNoDates: (T, N, F) => `${T.he.le} ו${N.he.le} יש אב קדמון משותף מאוחר יותר מאשר ${F.he.le}.`,
    past: 'עבר', now: 'היום',
    sources: 'מקורות לתאריכים:',
    next: 'הבא', seeResult: 'לתוצאה שלך', seeRun: 'לסיכום הריצה', finish: 'סיום',
    intro: 'זה המשחק: עשר שאלות כאלה ביום, זהות לכולם. כל עץ מראה מתי היה לשני יצורים אב קדמון משותף.',
    resultEyebrow: (n) => `קרובים #${n} · התוצאה שלך`,
    titles: ['זרע', 'נבט', 'שתיל', 'עץ עתיק', 'עץ החיים'],
    share: 'שיתוף התוצאה', copied: 'הועתק. אפשר להדביק בכל מקום.', shared: 'שותף',
    copyFallback: 'סמנו את הטקסט והעתיקו',
    playArcade: 'ארקייד: משחק בלי סוף',
    nextKin: (t) => `המשחק הבא בעוד ${t}`,
    streak: (n) => (n === 1 ? '🔥 יום ראשון ברצף' : `🔥 ${n} ימים ברצף`),
    recap: 'התשובות שלך',
    arcade: 'ארקייד',
    lives: (n) => (n === 1 ? 'נותרו חיים אחרונים' : `נותרו ${n} חיים`),
    pts: (n) => `${n} נק׳`,
    inARow: (n) => `${n} ברצף`,
    runOver: 'ארקייד · הריצה הסתיימה', allPlayed: 'ארקייד · שיחקת בכל השאלות',
    newBest: 'שיא חדש', best: (n) => `השיא: ${n}`,
    playAgain: 'עוד סיבוב', backToResult: 'חזרה לתוצאה', backToKin: 'חזרה למשחק היומי',
    arcadeNote: 'שלוש טעויות מסיימות ריצה. כל השאלות של המשחק נמצאות כאן.',
    soundOn: 'צליל פועל', soundOff: 'צליל כבוי',
    code: 'עב', name: 'עברית',
    testBuild: 'גרסת ניסיון · treeoflife.wiki',
    stats: 'המכשיר הזה', statsReset: 'איפוס המכשיר',
    statsRows: (s) => [
      ['שיחקת לראשונה', s.firstSeen || '—'],
      ['ימי משחק', String(s.days.length)],
      ['משחקים יומיים שהושלמו', String(s.dailies)],
      ['שאלות שנענו', `${s.answers} (${s.correct} נכונות)`],
      ['ריצות ארקייד', String(s.arcadeRuns)],
      ['שיא בארקייד', String(s.bestArcade)],
      ['שיתופים', String(s.shares)],
    ],
    statsNote: 'נשמר רק במכשיר הזה. שום דבר לא נשלח.',
    statsBack: 'חזרה למשחק',
  },
  ru: {
    dir: 'ltr',
    brand: 'Родня',
    title: 'Родня · Древо жизни',
    promptYou: 'С кем мы в более близком родстве?',
    prompt: 'С кем в более близком родстве…',
    tapHint: 'Нажмите на того, кто, по-вашему, ближе по родству',
    right: (c) => `✓ Да, ${c.ru.the}.`,
    wrong: (c) => `✗ Сюрприз: ближе ${c.ru.the}.`,
    years(d) {
      if (d.min) return `более ${numRu(d.mya)} млн лет`;
      if (d.mya >= 1000) return `около ${bnRu(d.mya)} млрд лет`;
      return `около ${numRu(d.mya)} млн лет`;
    },
    short(d) {
      if (d.mya >= 1000) return `${bnRu(d.mya)} млрд лет назад`;
      return `${numRu(d.mya)}${d.min ? '+' : ''} млн лет назад`;
    },
    headline(T, N, F, dn, df) {
      return `Последний общий предок ${T.ru.g} и ${N.ru.g} жил ${this.years(dn)} назад. `
           + `Предки ${F.ru.line} отделились ${this.years(df)} назад.`;
    },
    headlineNoDates: (T, N, F) => `${cap(T.ru.the)} и ${N.ru.the} в более близком родстве, чем любой из них и ${F.ru.the}.`,
    past: 'прошлое', now: 'сегодня',
    sources: 'Источники дат:',
    next: 'Дальше', seeResult: 'Посмотреть результат', seeRun: 'К итогам игры', finish: 'Завершить',
    intro: 'Это «Родня»: десять таких вопросов в день, одинаковых для всех. Каждое дерево показывает, когда жил последний общий предок двух живых существ.',
    resultEyebrow: (n) => `Родня #${n} · ваш результат`,
    titles: ['Семечко', 'Росток', 'Саженец', 'Вековое дерево', 'Древо жизни'],
    share: 'Поделиться результатом', copied: 'Скопировано. Вставьте куда угодно.', shared: 'Отправлено',
    copyFallback: 'Выделите текст и скопируйте его',
    playArcade: 'Аркада: игра без конца',
    nextKin: (t) => `Следующая «Родня» через ${t}`,
    streak: (n) => (n === 1 ? '🔥 Первый день серии' : `🔥 ${n} ${plural(n, 'день', 'дня', 'дней')} подряд`),
    recap: 'Ваши ответы',
    arcade: 'Аркада',
    lives: (n) => (n === 0 ? 'Жизней не осталось' : n === 1 ? 'Осталась последняя жизнь'
      : `Осталось ${n} ${plural(n, 'жизнь', 'жизни', 'жизней')}`),
    pts: (n) => `${n} ${plural(n, 'очко', 'очка', 'очков')}`,
    inARow: (n) => `${n} подряд`,
    runOver: 'Аркада · игра окончена', allPlayed: 'Аркада · вы ответили на все вопросы',
    newBest: 'Новый рекорд', best: (n) => `Рекорд: ${n}`,
    playAgain: 'Сыграть ещё', backToResult: 'К вашему результату', backToKin: 'К сегодняшней «Родне»',
    arcadeNote: 'Три ошибки — и игра окончена. Здесь собраны все вопросы игры.',
    soundOn: 'Звук включён', soundOff: 'Звук выключен',
    code: 'РУ', name: 'Русский',
    testBuild: 'Тестовая версия · treeoflife.wiki',
    stats: 'Это устройство', statsReset: 'Стереть данные на этом устройстве',
    statsRows: (s) => [
      ['Первая игра', s.firstSeen || '—'],
      ['Дней в игре', String(s.days.length)],
      ['Пройдено ежедневных игр', String(s.dailies)],
      ['Ответов', `${s.answers} (верных: ${s.correct})`],
      ['Забегов в аркаде', String(s.arcadeRuns)],
      ['Рекорд в аркаде', String(s.bestArcade)],
      ['Поделились результатом', String(s.shares)],
    ],
    statsNote: 'Хранится только на этом устройстве. Ничего никуда не отправляется.',
    statsBack: 'Вернуться к игре',
  },
};

export const LANGS = Object.keys(STRINGS);
