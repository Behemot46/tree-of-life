// ══════════════════════════════════════════════════════
// KIN — WORDS
//
// Everything the player reads, in English and Hebrew. Russian joins in
// phase 2, when every creature has a reviewed Russian name.
//
// The game's Hebrew name is קרובים ("relatives", and also "close ones"),
// not a transliteration: "Kin" written in Hebrew letters is קין, Cain.
//
// Sentences are built per language rather than translated from one template,
// because the grammar differs: English says "Whales and hippos last shared
// an ancestor…", Hebrew says "ללווייתן ולהיפופוטם היה אב קדמון משותף…",
// with the preposition fused onto each noun (the `le` forms in creatures.js).
// ══════════════════════════════════════════════════════

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* Mya → "53", "8.7", "1,200". One decimal below 20 million years, where the
   decimal is the difference between gorilla (8.7) and orangutan (15.6). */
function num(mya) {
  if (mya < 20) return String(+mya.toFixed(1));
  return Math.round(mya).toLocaleString('en-US');
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
           + `The ${F.en.n.toLowerCase()} line branched off ${this.years(df)} ago.`;
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
    switchLang: 'עב', switchLangLabel: 'עברית',
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
    switchLang: 'EN', switchLangLabel: 'English',
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
};

export const LANGS = Object.keys(STRINGS);
