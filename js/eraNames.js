// ══════════════════════════════════════════════════════
// ERA NAMES — a node's `era` string, in the reader's language
//
// `era` is data on every node: a period ("Cretaceous"), an age ("~66 Mya"), or
// one of a few annotated forms ("~14 Mya divergence"). Ranked groups have
// translated names; this does the same for the line beneath them. Anything it
// does not recognise comes back unchanged, so a new era string is English
// until it is added here rather than broken.
// ══════════════════════════════════════════════════════

const PERIODS = {
  he: {
    Hadean: 'האדאיקון', Archean: 'ארכאיקון', Proterozoic: 'פרוטרוזואיקון',
    Neoproterozoic: 'ניאופרוטרוזואיקון', Ediacaran: 'אדיאקרן', Cambrian: 'קמבריום',
    Ordovician: 'אורדוביק', Silurian: 'סילור', Devonian: 'דבון', Carboniferous: 'פחמן',
    Permian: 'פרם', Triassic: 'טריאס', Jurassic: 'יורה', Cretaceous: 'קרטיקון',
    Paleogene: 'פלאוגן', Paleocene: 'פלאוקן', Eocene: 'איאוקן', Oligocene: 'אוליגוקן',
    Neogene: 'ניאוגן', Miocene: 'מיוקן', Pliocene: 'פליוקן', Quaternary: 'קוורטרנר',
    Pleistocene: 'פלייסטוקן', Holocene: 'הולוקן', Modern: 'ימינו',
  },
  ru: {
    Hadean: 'Гадей', Archean: 'Архей', Proterozoic: 'Протерозой',
    Neoproterozoic: 'Неопротерозой', Ediacaran: 'Эдиакарий', Cambrian: 'Кембрий',
    Ordovician: 'Ордовик', Silurian: 'Силур', Devonian: 'Девон', Carboniferous: 'Карбон',
    Permian: 'Пермь', Triassic: 'Триас', Jurassic: 'Юра', Cretaceous: 'Мел',
    Paleogene: 'Палеоген', Paleocene: 'Палеоцен', Eocene: 'Эоцен', Oligocene: 'Олигоцен',
    Neogene: 'Неоген', Miocene: 'Миоцен', Pliocene: 'Плиоцен', Quaternary: 'Четвертичный период',
    Pleistocene: 'Плейстоцен', Holocene: 'Голоцен', Modern: 'Наши дни',
  },
};

const WORDS = {
  he: { Early: 'מוקדם', Late: 'מאוחר', lineage: 'שושלת', divergence: 'התפצלות', land: 'ביבשה',
        Mya: 'מל"ש', Billion: 'מיליארד שנה', Million: 'מיליון שנה' },
  ru: { Early: 'ранний', Late: 'поздний', lineage: 'линия', divergence: 'расхождение', land: 'на суше',
        Mya: 'млн лет назад', Billion: 'млрд лет назад', Million: 'млн лет назад' },
};

/* "Late Cretaceous" is "קרטיקון מאוחר" in Hebrew, where the adjective follows,
   and "Поздний мел" in Russian, where it agrees with the noun's gender. */
const RU_ADJ = { Early: ['Ранний', 'Ранняя'], Late: ['Поздний', 'Поздняя'] };
const RU_FEM = new Set(['Jurassic']);

function period(p, lang, mod) {
  const name = PERIODS[lang][p];
  if (!name) return null;
  if (!mod) return name;
  if (lang === 'he') return `${name} ${WORDS.he[mod]}`;
  return `${RU_ADJ[mod][RU_FEM.has(p) ? 1 : 0]} ${name.toLowerCase()}`;
}

export function eraLabel(era, lang) {
  if (!era || !PERIODS[lang]) return era;
  const w = WORDS[lang];
  const e = era.trim();

  // A period, with an optional Early/Late and an optional "(lineage)".
  let m = /^(?:(Early|Late) )?([A-Za-z]+)(?: \((lineage)\))?$/.exec(e);
  if (m) {
    const base = period(m[2], lang, m[1]);
    if (base) return m[3] ? `${base} (${w.lineage})` : base;
  }

  // "~66 Mya", "~6–7 Mya divergence", "~150 Mya (Archaeopteryx)", "~3.5 Billion Years Ago".
  m = /^~?([\d.]+(?:–[\d.]+)?) (Mya|Billion Years Ago|Million Years Ago)(?: \(?(divergence|land|[A-Za-z]+)\)?)?$/.exec(e);
  if (m) {
    const unit = m[2] === 'Mya' ? w.Mya : m[2].startsWith('Billion') ? w.Billion : w.Million;
    const tail = m[3] ? ` (${w[m[3]] || m[3]})` : '';
    // Hebrew's "ago" is implicit in the unit; Russian carries it in the unit too.
    return `~${m[1]} ${unit}${tail}`;
  }
  return era;
}
