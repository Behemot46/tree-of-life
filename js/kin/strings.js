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
    footAtlas: 'Atlas',
    credits: 'Credits',
    home: 'Home',
    homeToday: "Today's Kin",
    homeSub: 'Ten questions · about a minute',
    homePlay: 'Play',
    homeContinue: 'Continue',
    homeProgress: (n, of) => `${n} of ${of} answered`,
    homeArcade: 'Arcade',
    homeArcadeSub: (best) => (best ? `Endless · your best run is ${best}` : 'Endless · three lives'),
    homeAtlas: 'Atlas',
    homeAtlasSub: 'Explore the whole tree of life',
    streakStart: 'Play today to start a streak',
    streakKeep: 'Play today to keep it going',
    streakCovered: 'A freeze will cover yesterday',
    freezes: (n) => (n === 1 ? '🧊 1 streak freeze' : `🧊 ${n} streak freezes`),
    freezeUsed: '🧊 A streak freeze covered the day you missed',
    freezeEarned: (n) => `🧊 Streak freeze earned. You now hold ${n}.`,
    dialLabel: (n) => `You played on ${n} of the last 7 days`,
    friendBanner: (n) => `Kin #${n} · shared with you`,
    playToday: "Play today's Kin",
    challengeBanner: (s) => (s === null ? "A friend's challenge · same questions as theirs" : `Beat ${s} · same questions as your friend`),
    challengeBtn: 'Challenge a friend',
    challengeShare: (n) => `I got ${n} in Kin Arcade. Can you beat me?`,
    challengeResult: (you, them) => (you > them ? `You beat the challenge: ${you} to ${them}`
      : you === them ? `A tie: ${you} each` : `The challenge was ${them}. You got ${you}`),
    stats: 'Your stats', statsReset: 'Erase this device', statsResetSure: 'Tap again to erase everything',
    statsDist: 'Finished dailies, by title',
    statsRows: (v) => [
      ['streak', 'Current streak (days)', String(v.streak)],
      ['best-streak', 'Best streak (days)', String(v.bestStreak)],
      ['dailies', 'Dailies finished', String(v.finished)],
      ['average', 'Average score', v.scored ? `${v.average}/10` : '—'],
      ['best', 'Best score', v.scored ? `${v.best}/10` : '—'],
      ['answers', 'Questions answered', `${v.answers} (${v.correct} right)`],
      ['arcade-runs', 'Arcade runs', String(v.arcadeRuns)],
      ['arcade-best', 'Best arcade run', String(v.bestArcade)],
      ['shares', 'Results shared', String(v.shares)],
      ['first', 'First played', v.firstSeen || '—'],
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
    footAtlas: 'האטלס',
    credits: 'קרדיטים',
    home: 'לדף הבית',
    homeToday: 'קרובים של היום',
    homeSub: 'עשר שאלות · בערך דקה',
    homePlay: 'לשחק',
    homeContinue: 'להמשיך',
    homeProgress: (n, of) => `${n} מתוך ${of} נענו`,
    homeArcade: 'ארקייד',
    homeArcadeSub: (best) => (best ? `בלי סוף · השיא שלך ${best}` : 'בלי סוף · שלושה חיים'),
    homeAtlas: 'האטלס',
    homeAtlasSub: 'לחקור את כל עץ החיים',
    streakStart: 'שחקו היום כדי להתחיל רצף',
    streakKeep: 'שחקו היום כדי להמשיך את הרצף',
    streakCovered: 'הקפאה תכסה את אתמול',
    freezes: (n) => (n === 1 ? '🧊 הקפאת רצף אחת' : `🧊 ${n} הקפאות רצף`),
    freezeUsed: '🧊 הקפאת רצף כיסתה יום שהוחמץ',
    freezeEarned: (n) => `🧊 הרווחתם הקפאת רצף. יש לכם ${n}.`,
    dialLabel: (n) => `שיחקתם ב־${n} מתוך 7 הימים האחרונים`,
    friendBanner: (n) => `קרובים #${n} · שותף איתך`,
    playToday: 'לשחק במשחק של היום',
    challengeBanner: (s) => (s === null ? 'אתגר · אותן שאלות בדיוק' : `אתגר: לעקוף את ${s} · אותן שאלות בדיוק`),
    challengeBtn: 'לאתגר מישהו',
    challengeShare: (n) => `קיבלתי ${n} בארקייד של קרובים. תצליחו לעקוף אותי?`,
    challengeResult: (you, them) => (you > them ? `עקפתם את האתגר: ${you} מול ${them}`
      : you === them ? `תיקו: ${you} בדיוק כמו באתגר` : `האתגר היה ${them}. קיבלתם ${you}`),
    stats: 'הסטטיסטיקה שלך', statsReset: 'מחיקת כל הנתונים במכשיר', statsResetSure: 'הקישו שוב כדי למחוק הכול',
    statsDist: 'משחקים יומיים שהושלמו, לפי דרגה',
    statsRows: (v) => [
      ['streak', 'רצף נוכחי (ימים)', String(v.streak)],
      ['best-streak', 'רצף שיא (ימים)', String(v.bestStreak)],
      ['dailies', 'משחקים יומיים שהושלמו', String(v.finished)],
      ['average', 'ציון ממוצע', v.scored ? `${v.average}/10` : '—'],
      ['best', 'ציון שיא', v.scored ? `${v.best}/10` : '—'],
      ['answers', 'שאלות שנענו', `${v.answers} (${v.correct} נכונות)`],
      ['arcade-runs', 'ריצות ארקייד', String(v.arcadeRuns)],
      ['arcade-best', 'שיא בארקייד', String(v.bestArcade)],
      ['shares', 'שיתופים', String(v.shares)],
      ['first', 'שיחקת לראשונה', v.firstSeen || '—'],
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
    footAtlas: 'Атлас',
    credits: 'Авторы и лицензии',
    home: 'На главную',
    homeToday: 'Родня на сегодня',
    homeSub: 'Десять вопросов · около минуты',
    homePlay: 'Играть',
    homeContinue: 'Продолжить',
    homeProgress: (n, of) => `Отвечено: ${n} из ${of}`,
    homeArcade: 'Аркада',
    homeArcadeSub: (best) => (best ? `Без конца · ваш рекорд: ${best}` : 'Без конца · три жизни'),
    homeAtlas: 'Атлас',
    homeAtlasSub: 'Исследовать всё древо жизни',
    streakStart: 'Сыграйте сегодня, чтобы начать серию',
    streakKeep: 'Сыграйте сегодня, чтобы серия продолжилась',
    streakCovered: 'Заморозка прикроет вчерашний день',
    freezes: (n) => (n === 1 ? '🧊 1 заморозка серии' : `🧊 ${n} ${plural(n, 'заморозка', 'заморозки', 'заморозок')} серии`),
    freezeUsed: '🧊 Заморозка серии прикрыла пропущенный день',
    freezeEarned: (n) => `🧊 Вы получили заморозку серии. Сейчас их: ${n}.`,
    dialLabel: (n) => `Вы играли в ${n} из последних 7 дней`,
    friendBanner: (n) => `Родня #${n} · прислано вам`,
    playToday: 'Сыграть в сегодняшнюю «Родню»',
    challengeBanner: (s) => (s === null ? 'Вызов · те же вопросы, что у отправителя' : `Побейте ${s} · те же вопросы, что у отправителя`),
    challengeBtn: 'Бросить вызов',
    challengeShare: (n) => `У меня ${n} в аркаде «Родни». Сможете лучше?`,
    challengeResult: (you, them) => (you > them ? `Вы победили: ${you} против ${them}`
      : you === them ? `Ничья: у обоих по ${you}` : `В вызове было ${them}. У вас ${you}`),
    stats: 'Ваша статистика', statsReset: 'Стереть данные на этом устройстве', statsResetSure: 'Нажмите ещё раз, чтобы стереть всё',
    statsDist: 'Пройденные ежедневные игры по званиям',
    statsRows: (v) => [
      ['streak', 'Текущая серия, дней', String(v.streak)],
      ['best-streak', 'Лучшая серия, дней', String(v.bestStreak)],
      ['dailies', 'Пройдено ежедневных игр', String(v.finished)],
      ['average', 'Средний результат', v.scored ? `${String(v.average).replace('.', ',')}/10` : '—'],
      ['best', 'Лучший результат', v.scored ? `${v.best}/10` : '—'],
      ['answers', 'Ответов', `${v.answers} (верных: ${v.correct})`],
      ['arcade-runs', 'Забегов в аркаде', String(v.arcadeRuns)],
      ['arcade-best', 'Рекорд в аркаде', String(v.bestArcade)],
      ['shares', 'Поделились результатом', String(v.shares)],
      ['first', 'Первая игра', v.firstSeen || '—'],
    ],
    statsNote: 'Хранится только на этом устройстве. Ничего никуда не отправляется.',
    statsBack: 'Вернуться к игре',
  },
};

export const LANGS = Object.keys(STRINGS);
