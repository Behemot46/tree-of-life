// ══════════════════════════════════════════════════════
// FACT LIBRARY — Structured fact pool for loading screen,
// toast notifications, and future surfaces
// ══════════════════════════════════════════════════════
const FACTS = (() => {

  const facts = [
    // ── Loading-safe facts (original 18) ─────────────
    {
      id: 'load_01',
      en: 'Every living thing is your cousin.',
      he: 'כל יצור חי הוא קרוב משפחה שלך.',
      ru: 'Каждое живое существо — ваш родственник.',
      tags: ['kinship', 'general'],
      species: null, loading: true, discovery: true
    },
    {
      id: 'load_02',
      en: 'You share 50% of your DNA with a banana.',
      he: 'אתה חולק 50% מה-DNA שלך עם בננה.',
      ru: 'У вас 50% общей ДНК с бананом.',
      tags: ['genetics', 'plants'],
      species: 'plantae', loading: true, discovery: true
    },
    {
      id: 'load_03',
      en: 'Life found a way — 3.8 billion years ago.',
      he: 'החיים מצאו דרך — לפני 3.8 מיליארד שנים.',
      ru: 'Жизнь нашла способ — 3,8 миллиарда лет назад.',
      tags: ['origin', 'general'],
      species: 'luca', loading: true, discovery: true
    },
    {
      id: 'load_04',
      en: 'From a single cell to 8 billion humans.',
      he: 'מתא בודד ל-8 מיליארד בני אדם.',
      ru: 'От одной клетки до 8 миллиардов людей.',
      tags: ['evolution', 'humans'],
      species: 'homo-sapiens', loading: true, discovery: true
    },
    {
      id: 'load_05',
      en: 'The tree is real. You are a leaf.',
      he: 'העץ הזה אמיתי. אתה עלה בו.',
      ru: 'Это дерево реально. Вы — его лист.',
      tags: ['metaphor', 'general'],
      species: null, loading: true, discovery: true
    },
    {
      id: 'load_06',
      en: 'Sharks are older than trees.',
      he: 'כרישים קדומים יותר מעצים.',
      ru: 'Акулы старше деревьев.',
      tags: ['animals', 'deep-time'],
      species: 'shark', loading: true, discovery: true
    },
    {
      id: 'load_07',
      en: 'Fungi are closer to animals than to plants.',
      he: 'פטריות קרובות יותר לבעלי חיים מאשר לצמחים.',
      ru: 'Грибы ближе к животным, чем к растениям.',
      tags: ['fungi', 'taxonomy'],
      species: 'fungi', loading: true, discovery: true
    },
    {
      id: 'load_08',
      en: 'The largest organism on Earth is a fungus.',
      he: 'האורגניזם הגדול ביותר על פני כדור הארץ הוא פטרייה.',
      ru: 'Крупнейший организм на Земле — гриб.',
      tags: ['fungi', 'records'],
      species: 'armillaria', loading: true, discovery: true
    },
    {
      id: 'load_09',
      en: 'Diatoms produce more oxygen than all rainforests combined.',
      he: 'דיאטומיות מייצרות יותר חמצן מכל יערות הגשם יחד.',
      ru: 'Диатомеи производят больше кислорода, чем все тропические леса.',
      tags: ['protists', 'ecology'],
      species: 'diatoms', loading: true, discovery: true
    },
    {
      id: 'load_10',
      en: 'Coral reefs cover 1% of the ocean but host 25% of marine species.',
      he: 'שוניות אלמוגים מכסות 1% מהאוקיינוס אך מארחות 25% מהמינים הימיים.',
      ru: 'Коралловые рифы — 1% океана, но 25% морских видов.',
      tags: ['animals', 'ecology'],
      species: 'coral', loading: true, discovery: true
    },
    {
      id: 'load_11',
      en: 'Your body carries 1.5 kg of bacteria.',
      he: 'גופך מכיל 1.5 ק״ג של חיידקים.',
      ru: 'Ваше тело содержит 1,5 кг бактерий.',
      tags: ['bacteria', 'humans'],
      species: 'bacteria', loading: true, discovery: true
    },
    {
      id: 'load_12',
      en: 'All humans descend from roughly 10,000 survivors.',
      he: 'כל בני האדם צאצאים של כ-10,000 שורדים.',
      ru: 'Все люди произошли от примерно 10 000 выживших.',
      tags: ['humans', 'genetics'],
      species: 'homo-sapiens', loading: true, discovery: true
    },
    {
      id: 'load_13',
      en: 'The coelacanth was thought extinct for 65 million years.',
      he: 'הסילקנת נחשבה לנכחדת במשך 65 מיליון שנה.',
      ru: 'Латимерию считали вымершей 65 миллионов лет.',
      tags: ['animals', 'deep-time'],
      species: 'coelacanth', loading: true, discovery: true
    },
    {
      id: 'load_14',
      en: 'An octopus has two thirds of its neurons in its arms.',
      he: 'לתמנון שני שלישים מהנוירונים בזרועותיו.',
      ru: 'Две трети нейронов осьминога — в его щупальцах.',
      tags: ['animals', 'neuroscience'],
      species: 'octopus', loading: true, discovery: true
    },
    {
      id: 'load_15',
      en: 'A blue whale\'s heart is the size of a small car.',
      he: 'לבו של לוויתן כחול בגודל מכונית קטנה.',
      ru: 'Сердце синего кита размером с небольшой автомобиль.',
      tags: ['animals', 'records'],
      species: 'blue-whale', loading: true, discovery: true
    },
    {
      id: 'load_16',
      en: 'Horseshoe crab blood is blue — and saves millions of lives each year.',
      he: 'דמו של סרטן פרסה כחול — ומציל מיליוני חיים מדי שנה.',
      ru: 'Кровь мечехвоста голубая — и спасает миллионы жизней ежегодно.',
      tags: ['animals', 'medicine'],
      species: 'horseshoe-crab', loading: true, discovery: true
    },
    {
      id: 'load_17',
      en: 'Mimosa pudica can learn and remember for 28 days — with no brain.',
      he: 'מימוזה פודיקה יכולה ללמוד ולזכור 28 יום — בלי מוח.',
      ru: 'Мимоза стыдливая учится и помнит 28 дней — без мозга.',
      tags: ['plants', 'neuroscience'],
      species: 'mimosa-pudica', loading: true, discovery: true
    },
    {
      id: 'load_18',
      en: 'The peregrine falcon dives at 389 km/h — faster than a Formula 1 car.',
      he: 'בז נודד צולל במהירות 389 קמ״ש — מהר יותר ממכונית פורמולה 1.',
      ru: 'Сапсан пикирует со скоростью 389 км/ч — быстрее болида Формулы-1.',
      tags: ['animals', 'records'],
      species: 'peregrine-falcon', loading: true, discovery: true
    },

    // ── LUCA / Origin of Life ────────────────────────
    {
      id: 'luca_01',
      en: 'LUCA lived near hydrothermal vents on the ocean floor.',
      he: 'לוקא חי ליד פתחים הידרותרמיים בקרקעית האוקיינוס.',
      ru: 'LUCA обитал у гидротермальных источников на дне океана.',
      tags: ['origin', 'deep-time'],
      species: 'luca', loading: false, discovery: true
    },
    {
      id: 'luca_02',
      en: 'All life on Earth shares the same genetic code — proof of a single ancestor.',
      he: 'כל החיים על פני כדור הארץ חולקים את אותו קוד גנטי — הוכחה לאב קדמון אחד.',
      ru: 'Вся жизнь на Земле использует один генетический код — доказательство общего предка.',
      tags: ['origin', 'genetics'],
      species: 'luca', loading: false, discovery: true
    },
    {
      id: 'luca_03',
      en: 'Life is at least 3.8 billion years old — older than most rocks on Earth.',
      he: 'החיים בני 3.8 מיליארד שנה לפחות — עתיקים מרוב הסלעים על פני כדור הארץ.',
      ru: 'Жизни не менее 3,8 миллиарда лет — она старше большинства горных пород.',
      tags: ['origin', 'deep-time'],
      species: 'luca', loading: false, discovery: true
    },
    {
      id: 'luca_04',
      en: 'Every cell in your body still uses ATP — the same energy currency as LUCA.',
      he: 'כל תא בגופך עדיין משתמש ב-ATP — אותו מטבע אנרגיה כמו לוקא.',
      ru: 'Каждая клетка вашего тела использует АТФ — ту же энергетическую валюту, что и LUCA.',
      tags: ['origin', 'biochemistry'],
      species: 'luca', loading: false, discovery: true
    },

    // ── General / Evolution ──────────────────────────
    {
      id: 'gen_01',
      en: '99.9% of all species that ever lived are now extinct.',
      he: '99.9% מכל המינים שחיו אי-פעם נכחדו.',
      ru: '99,9% всех видов, когда-либо живших, вымерли.',
      tags: ['evolution', 'extinction'],
      species: null, loading: false, discovery: true
    },
    {
      id: 'gen_02',
      en: 'Eyes evolved independently over 40 times across different lineages.',
      he: 'עיניים התפתחו באופן עצמאי יותר מ-40 פעמים בענפים שונים.',
      ru: 'Глаза возникали независимо более 40 раз в разных линиях.',
      tags: ['evolution', 'convergence'],
      species: null, loading: false, discovery: true
    },
    {
      id: 'gen_03',
      en: 'Horizontal gene transfer means bacteria can share genes like trading cards.',
      he: 'העברה אופקית של גנים מאפשרת לחיידקים לשתף גנים כמו קלפי משחק.',
      ru: 'Горизонтальный перенос генов позволяет бактериям обмениваться генами, как карточками.',
      tags: ['genetics', 'bacteria'],
      species: 'bacteria', loading: false, discovery: true
    },
    {
      id: 'gen_04',
      en: 'Mitochondria were once free-living bacteria that merged with early cells.',
      he: 'המיטוכונדריה היו פעם חיידקים חופשיים שהתמזגו עם תאים קדומים.',
      ru: 'Митохондрии были свободноживущими бактериями, слившимися с ранними клетками.',
      tags: ['evolution', 'endosymbiosis'],
      species: 'eukaryota', loading: false, discovery: true
    },
    {
      id: 'gen_05',
      en: 'If Earth\'s history were a 24-hour clock, humans appear at 11:58 PM.',
      he: 'אם ההיסטוריה של כדור הארץ הייתה שעון של 24 שעות, האדם מופיע ב-23:58.',
      ru: 'Если историю Земли сжать в сутки, человек появится в 23:58.',
      tags: ['deep-time', 'humans'],
      species: null, loading: true, discovery: true
    },
    {
      id: 'gen_06',
      en: 'Mass extinctions reset the tree of life — then diversity explodes anew.',
      he: 'הכחדות המוניות מאפסות את עץ החיים — ואז המגוון מתפוצץ מחדש.',
      ru: 'Массовые вымирания обнуляют древо жизни — а потом разнообразие взрывается заново.',
      tags: ['extinction', 'evolution'],
      species: null, loading: false, discovery: true
    },
    {
      id: 'gen_07',
      en: 'Convergent evolution made dolphins and sharks look alike despite 400 million years apart.',
      he: 'התפתחות מתכנסת עשתה דולפינים וכרישים דומים למרות 400 מיליון שנה של הפרדה.',
      ru: 'Конвергентная эволюция сделала дельфинов и акул похожими, хотя их разделяют 400 млн лет.',
      tags: ['evolution', 'convergence'],
      species: null, loading: false, discovery: true
    },
    {
      id: 'gen_08',
      en: '8% of human DNA comes from ancient viral infections.',
      he: '8% מה-DNA האנושי מגיע מזיהומים ויראליים קדומים.',
      ru: '8% ДНК человека — наследие древних вирусных инфекций.',
      tags: ['genetics', 'humans'],
      species: 'homo-sapiens', loading: false, discovery: true
    },
    {
      id: 'gen_09',
      en: 'The Great Dying wiped out 96% of marine species 252 million years ago.',
      he: 'ההכחדה הגדולה חיסלה 96% מהמינים הימיים לפני 252 מיליון שנה.',
      ru: 'Великое вымирание уничтожило 96% морских видов 252 млн лет назад.',
      tags: ['extinction', 'deep-time'],
      species: null, loading: false, discovery: true
    },
    {
      id: 'gen_10',
      en: 'DNA is a four-letter alphabet that writes every living thing on Earth.',
      he: 'DNA הוא אלפבית בן ארבע אותיות שכותב כל יצור חי על פני כדור הארץ.',
      ru: 'ДНК — четырёхбуквенный алфавит, которым написано всё живое на Земле.',
      tags: ['genetics', 'general'],
      species: null, loading: true, discovery: true
    },

    // ── Bacteria ─────────────────────────────────────
    {
      id: 'bact_01',
      en: 'E. coli can divide every 20 minutes — one cell becomes a billion overnight.',
      he: 'אי. קולי מתחלקת כל 20 דקות — מתא אחד למיליארד בלילה אחד.',
      ru: 'E. coli делится каждые 20 минут — из одной клетки за ночь становится миллиард.',
      tags: ['bacteria', 'records'],
      species: 'ecoli', loading: false, discovery: true
    },
    {
      id: 'bact_02',
      en: 'Cyanobacteria invented photosynthesis and filled the sky with oxygen.',
      he: 'ציאנובקטריות המציאו פוטוסינתזה ומילאו את השמיים בחמצן.',
      ru: 'Цианобактерии изобрели фотосинтез и наполнили небо кислородом.',
      tags: ['bacteria', 'evolution'],
      species: 'cyanobacteria', loading: false, discovery: true
    },
    {
      id: 'bact_03',
      en: 'Deinococcus radiodurans survives radiation 1,000 times the lethal human dose.',
      he: 'דיינוקוקוס רדיודורנס שורד קרינה פי 1,000 מהמנה הקטלנית לאדם.',
      ru: 'Deinococcus radiodurans выдерживает радиацию в 1000 раз выше смертельной для человека.',
      tags: ['bacteria', 'extremophile'],
      species: 'deinococcus', loading: false, discovery: true
    },
    {
      id: 'bact_04',
      en: 'Streptomyces bacteria produce most of the antibiotics we use today.',
      he: 'חיידקי סטרפטומיצס מייצרים את רוב האנטיביוטיקות שאנו משתמשים בהן.',
      ru: 'Бактерии Streptomyces производят большинство антибиотиков, которые мы используем.',
      tags: ['bacteria', 'medicine'],
      species: 'streptomyces', loading: false, discovery: true
    },
    {
      id: 'bact_05',
      en: 'Helicobacter pylori has lived in human stomachs for at least 100,000 years.',
      he: 'הליקובקטר פילורי חי בקיבות אנושיות כבר 100,000 שנה לפחות.',
      ru: 'Helicobacter pylori живёт в желудках людей не менее 100 000 лет.',
      tags: ['bacteria', 'humans'],
      species: 'helicobacter', loading: false, discovery: true
    },
    {
      id: 'bact_06',
      en: 'Spirochetes drill through tissue like tiny corkscrews.',
      he: 'ספירוכטות קודחות דרך רקמות כמו חולצי-פקקים זעירים.',
      ru: 'Спирохеты ввинчиваются в ткани, как крошечные штопоры.',
      tags: ['bacteria', 'morphology'],
      species: 'spirochetes', loading: false, discovery: true
    },
    {
      id: 'bact_07',
      en: 'Your gut bacteria weigh more than your brain.',
      he: 'חיידקי המעיים שלך שוקלים יותר מהמוח שלך.',
      ru: 'Бактерии вашего кишечника весят больше, чем ваш мозг.',
      tags: ['bacteria', 'humans'],
      species: 'bacteroides', loading: false, discovery: true
    },
    {
      id: 'bact_08',
      en: 'CRISPR — the gene-editing revolution — was borrowed from bacterial immune systems.',
      he: 'קריספר — מהפכת עריכת הגנים — הושאלה ממערכות החיסון של חיידקים.',
      ru: 'CRISPR — революция в редактировании генов — позаимствована у иммунной системы бактерий.',
      tags: ['bacteria', 'genetics'],
      species: 'bacteria', loading: false, discovery: true
    },
    {
      id: 'bact_09',
      en: 'Vibrio cholerae can kill within hours but is harmless in saltwater.',
      he: 'ויבריו כולרה יכול להרוג תוך שעות אך אינו מזיק במי מלח.',
      ru: 'Холерный вибрион убивает за часы, но безвреден в солёной воде.',
      tags: ['bacteria', 'disease'],
      species: 'vibrio-cholerae', loading: false, discovery: true
    },
    {
      id: 'bact_10',
      en: 'Lactobacillus turns milk into yogurt and has been our ally for 7,000 years.',
      he: 'לקטובצילוס הופך חלב ליוגורט והוא בעל ברית שלנו כבר 7,000 שנה.',
      ru: 'Лактобактерия превращает молоко в йогурт и дружит с нами уже 7000 лет.',
      tags: ['bacteria', 'food'],
      species: 'lactobacillus', loading: false, discovery: true
    },

    // ── Archaea ──────────────────────────────────────
    {
      id: 'arch_01',
      en: 'Archaea look like bacteria but are genetically closer to you.',
      he: 'ארכאות נראות כמו חיידקים אך קרובות אליך גנטית.',
      ru: 'Археи похожи на бактерий, но генетически ближе к вам.',
      tags: ['archaea', 'taxonomy'],
      species: 'archaea', loading: false, discovery: true
    },
    {
      id: 'arch_02',
      en: 'Methanogens produce methane — and may exist on Mars.',
      he: 'מתנוגנים מייצרים מתאן — ואולי קיימים על מאדים.',
      ru: 'Метаногены выделяют метан — и, возможно, существуют на Марсе.',
      tags: ['archaea', 'astrobiology'],
      species: 'methanobacterium', loading: false, discovery: true
    },
    {
      id: 'arch_03',
      en: 'Halobacterium turns salt lakes pink with its light-harvesting pigment.',
      he: 'הלובקטריום צובע אגמי מלח בוורוד עם פיגמנט לקליטת אור.',
      ru: 'Галобактерия окрашивает солёные озёра в розовый своим светособирающим пигментом.',
      tags: ['archaea', 'extremophile'],
      species: 'halobacterium', loading: false, discovery: true
    },
    {
      id: 'arch_04',
      en: 'Sulfolobus thrives in volcanic hot springs at 80 °C and pH 2.',
      he: 'סולפולובוס משגשג במעיינות חמים וולקניים ב-80°C ו-pH 2.',
      ru: 'Sulfolobus процветает в вулканических источниках при 80°C и pH 2.',
      tags: ['archaea', 'extremophile'],
      species: 'sulfolobus', loading: false, discovery: true
    },
    {
      id: 'arch_05',
      en: 'Pyrolobus fumarii holds the record: it grows at 113 °C.',
      he: 'פירולובוס פומריי מחזיק בשיא: הוא גדל ב-113°C.',
      ru: 'Pyrolobus fumarii — рекордсмен: растёт при 113°C.',
      tags: ['archaea', 'extremophile', 'records'],
      species: 'pyrolobus', loading: false, discovery: true
    },
    {
      id: 'arch_06',
      en: 'Lokiarchaeota may be the closest living relative of all eukaryotes.',
      he: 'לוקיארכאוטה עשויה להיות הקרובה החיה ביותר לכל האיוקריוטים.',
      ru: 'Локиархея может быть ближайшим живым родственником всех эукариотов.',
      tags: ['archaea', 'evolution'],
      species: 'lokiarchaeota', loading: false, discovery: true
    },
    {
      id: 'arch_07',
      en: 'Asgard archaea blur the line between simple and complex life.',
      he: 'ארכאות אסגרד מטשטשות את הגבול בין חיים פשוטים למורכבים.',
      ru: 'Архебактерии Асгарда стирают грань между простой и сложной жизнью.',
      tags: ['archaea', 'evolution'],
      species: 'asgard', loading: false, discovery: true
    },
    {
      id: 'arch_08',
      en: 'Cow burps release archaeal methane — a major greenhouse gas source.',
      he: 'גיהוקי פרות משחררים מתאן ארכאי — מקור גדול לגזי חממה.',
      ru: 'Отрыжка коров — это метан архей, один из главных парниковых газов.',
      tags: ['archaea', 'ecology'],
      species: 'methanobacterium', loading: false, discovery: true
    },

    // ── Protists ─────────────────────────────────────
    {
      id: 'prot_01',
      en: 'Plasmodium (malaria parasite) kills more people than any other organism.',
      he: 'פלסמודיום (טפיל המלריה) הורג יותר אנשים מכל אורגניזם אחר.',
      ru: 'Плазмодий (малярийный паразит) убивает больше людей, чем любой другой организм.',
      tags: ['protists', 'disease'],
      species: 'plasmodium', loading: false, discovery: true
    },
    {
      id: 'prot_02',
      en: 'Dinoflagellates create bioluminescent blue waves in the ocean at night.',
      he: 'דינופלגלטים יוצרים גלים כחולים זוהרים באוקיינוס בלילה.',
      ru: 'Динофлагелляты создают светящиеся голубые волны в океане по ночам.',
      tags: ['protists', 'bioluminescence'],
      species: 'dinoflagellates', loading: false, discovery: true
    },
    {
      id: 'prot_03',
      en: 'A single Paramecium has 40,000 cilia beating in coordinated waves.',
      he: 'לפרמציום בודד יש 40,000 ריסים הפועמים בגלים מתואמים.',
      ru: 'Одна инфузория-туфелька имеет 40 000 ресничек, бьющих согласованными волнами.',
      tags: ['protists', 'morphology'],
      species: 'paramecium', loading: false, discovery: true
    },
    {
      id: 'prot_04',
      en: 'Volvox colonies roll through water like tiny green planets.',
      he: 'מושבות וולווקס מתגלגלות במים כמו כוכבי לכת ירוקים זעירים.',
      ru: 'Колонии вольвокса катятся по воде, как крошечные зелёные планеты.',
      tags: ['protists', 'morphology'],
      species: 'volvox', loading: false, discovery: true
    },
    {
      id: 'prot_05',
      en: 'Phytophthora infestans caused the Irish Potato Famine of 1845.',
      he: 'פיטופתורה אינפסטנס גרמה לרעב הגדול של תפוחי האדמה באירלנד ב-1845.',
      ru: 'Фитофтора вызвала Великий картофельный голод в Ирландии в 1845 году.',
      tags: ['protists', 'history'],
      species: 'phytophthora', loading: false, discovery: true
    },
    {
      id: 'prot_06',
      en: 'Diatom shells are made of glass — and they built the White Cliffs of Dover.',
      he: 'שריונות דיאטומיות עשויים זכוכית — והם בנו את מצוקי דובר הלבנים.',
      ru: 'Панцири диатомей — из стекла, и они построили Белые скалы Дувра.',
      tags: ['protists', 'geology'],
      species: 'diatoms', loading: false, discovery: true
    },
    {
      id: 'prot_07',
      en: 'Amoeba proteus has no fixed shape — it flows like living water.',
      he: 'לאמבה פרוטאוס אין צורה קבועה — היא זורמת כמו מים חיים.',
      ru: 'Амёба протей не имеет постоянной формы — она течёт, как живая вода.',
      tags: ['protists', 'morphology'],
      species: 'amoeba-proteus', loading: false, discovery: true
    },
    {
      id: 'prot_08',
      en: 'Red tides are dinoflagellate blooms that can poison entire coastlines.',
      he: 'גאויות אדומות הן פריחות דינופלגלטים שיכולות להרעיל קווי חוף שלמים.',
      ru: 'Красные приливы — это цветение динофлагеллят, отравляющее целые побережья.',
      tags: ['protists', 'ecology'],
      species: 'dinoflagellates', loading: false, discovery: true
    },

    // ── Fungi ────────────────────────────────────────
    {
      id: 'fung_01',
      en: 'The honey mushroom (Armillaria) in Oregon spans 9.6 km² — the biggest organism alive.',
      he: 'פטריית הדבש (ארמילריה) באורגון משתרעת על 9.6 קמ"ר — האורגניזם הגדול בעולם.',
      ru: 'Опёнок (Armillaria) в Орегоне занимает 9,6 км² — крупнейший организм на планете.',
      tags: ['fungi', 'records'],
      species: 'armillaria', loading: false, discovery: true
    },
    {
      id: 'fung_02',
      en: 'Penicillin from Penicillium mold has saved over 200 million lives.',
      he: 'פניצילין מעובש פניצילליום הציל למעלה מ-200 מיליון חיים.',
      ru: 'Пенициллин из плесени Penicillium спас более 200 миллионов жизней.',
      tags: ['fungi', 'medicine'],
      species: 'penicillium', loading: false, discovery: true
    },
    {
      id: 'fung_03',
      en: 'Yeast (Saccharomyces) gave us bread, beer, and wine for 10,000 years.',
      he: 'שמרים (סכרומיצס) נתנו לנו לחם, בירה ויין כבר 10,000 שנה.',
      ru: 'Дрожжи дают нам хлеб, пиво и вино уже 10 000 лет.',
      tags: ['fungi', 'food'],
      species: 'saccharomyces', loading: false, discovery: true
    },
    {
      id: 'fung_04',
      en: 'Psilocybin mushrooms may have shaped early human spiritual experiences.',
      he: 'פטריות פסילוציבין אולי עיצבו חוויות רוחניות קדומות של בני אדם.',
      ru: 'Псилоцибиновые грибы, возможно, формировали ранний духовный опыт человека.',
      tags: ['fungi', 'humans'],
      species: 'psilocybe', loading: false, discovery: true
    },
    {
      id: 'fung_05',
      en: 'Chytrid fungus has driven over 90 amphibian species to extinction.',
      he: 'פטריית כיטריד הובילה להכחדת יותר מ-90 מיני דו-חיים.',
      ru: 'Хитридиевый грибок привёл к вымиранию более 90 видов амфибий.',
      tags: ['fungi', 'extinction'],
      species: 'batrachochytrium', loading: false, discovery: true
    },
    {
      id: 'fung_06',
      en: 'Mycorrhizal fungi connect 90% of land plants in an underground "wood wide web."',
      he: 'פטריות מיקוריזה מחברות 90% מצמחי היבשה ב"רשת רחבה תת-קרקעית."',
      ru: 'Микоризные грибы соединяют 90% наземных растений в подземную «грибную сеть».',
      tags: ['fungi', 'ecology'],
      species: 'fungi', loading: false, discovery: true
    },
    {
      id: 'fung_07',
      en: 'Fly agaric (Amanita muscaria) has been used in shamanic rituals for millennia.',
      he: 'זבוב האגריק (אמניטה מוסקריה) שימש בטקסים שמאניים במשך אלפי שנים.',
      ru: 'Мухомор использовался в шаманских ритуалах тысячелетиями.',
      tags: ['fungi', 'culture'],
      species: 'amanita-muscaria', loading: false, discovery: true
    },
    {
      id: 'fung_08',
      en: 'Some fungi glow in the dark — there are over 80 bioluminescent species.',
      he: 'חלק מהפטריות זוהרות בחושך — יש יותר מ-80 מינים ביולומינסצנטיים.',
      ru: 'Некоторые грибы светятся в темноте — известно более 80 биолюминесцентных видов.',
      tags: ['fungi', 'bioluminescence'],
      species: 'fungi', loading: false, discovery: true
    },
    {
      id: 'fung_09',
      en: 'Fungi break down dead matter — without them, forests would drown in their own leaves.',
      he: 'פטריות מפרקות חומר מת — בלעדיהן, היערות היו טובעים בעלים שלהם.',
      ru: 'Грибы разлагают мёртвую материю — без них леса утонули бы в собственных листьях.',
      tags: ['fungi', 'ecology'],
      species: 'fungi', loading: false, discovery: true
    },
    {
      id: 'fung_10',
      en: 'Truffles are underground fungi found by pigs and dogs — worth more per gram than gold.',
      he: 'כמהין הן פטריות תת-קרקעיות שחזירים וכלבים מוצאים — יקרות יותר לגרם מזהב.',
      ru: 'Трюфели — подземные грибы, которые ищут свиньи и собаки, дороже золота за грамм.',
      tags: ['fungi', 'food', 'records'],
      species: 'fungi', loading: false, discovery: true
    },

    // ── Plants ───────────────────────────────────────
    {
      id: 'plant_01',
      en: 'Giant sequoias can live over 3,000 years and grow taller than the Statue of Liberty.',
      he: 'סקוויות ענק יכולות לחיות מעל 3,000 שנה ולגדול גבוהות מפסל החירות.',
      ru: 'Гигантские секвойи живут более 3000 лет и вырастают выше Статуи Свободы.',
      tags: ['plants', 'records'],
      species: 'sequoia', loading: false, discovery: true
    },
    {
      id: 'plant_02',
      en: 'Welwitschia can live 2,000 years with only two leaves — ever.',
      he: 'וולוויצ\'יה יכולה לחיות 2,000 שנה עם שני עלים בלבד — לנצח.',
      ru: 'Вельвичия живёт 2000 лет всего с двумя листьями — навсегда.',
      tags: ['plants', 'records'],
      species: 'welwitschia', loading: false, discovery: true
    },
    {
      id: 'plant_03',
      en: 'Wollemia nobilis was known only from fossils until found alive in 1994.',
      he: 'וולמיה נוביליס הייתה ידועה רק ממאובנים עד שנמצאה חיה ב-1994.',
      ru: 'Воллемия была известна лишь по окаменелостям, пока не была найдена живой в 1994 году.',
      tags: ['plants', 'living-fossil'],
      species: 'wollemia', loading: false, discovery: true
    },
    {
      id: 'plant_04',
      en: 'Rafflesia produces the world\'s largest flower — up to 1 meter wide — and it smells like rotting flesh.',
      he: 'רפלזיה מייצרת את הפרח הגדול בעולם — עד מטר רוחב — והוא מריח כמו בשר נרקב.',
      ru: 'Раффлезия — самый большой цветок в мире (до 1 м), и пахнет он гнилым мясом.',
      tags: ['plants', 'records'],
      species: 'rafflesia', loading: false, discovery: true
    },
    {
      id: 'plant_05',
      en: 'Azolla ferns cooled the planet 49 million years ago by pulling CO₂ from the air.',
      he: 'שרכי אזולה קיררו את כדור הארץ לפני 49 מיליון שנה על ידי שאיבת CO₂ מהאוויר.',
      ru: 'Папоротник азолла охладил планету 49 млн лет назад, поглотив CO₂ из воздуха.',
      tags: ['plants', 'climate'],
      species: 'azolla', loading: false, discovery: true
    },
    {
      id: 'plant_06',
      en: 'Titan arum blooms once every 7-10 years and stands taller than a person.',
      he: 'טיטן ארום פורח פעם ב-7-10 שנים וגבוה יותר מאדם.',
      ru: 'Аморфофаллус титанический цветёт раз в 7-10 лет и выше человеческого роста.',
      tags: ['plants', 'records'],
      species: 'titan-arum', loading: false, discovery: true
    },
    {
      id: 'plant_07',
      en: 'Sphagnum moss holds 20 times its weight in water — nature\'s super sponge.',
      he: 'טחב ספגנום סופג פי 20 ממשקלו מים — הספוג העל של הטבע.',
      ru: 'Мох сфагнум удерживает в 20 раз больше воды, чем весит — суперабсорбент природы.',
      tags: ['plants', 'ecology'],
      species: 'sphagnum', loading: false, discovery: true
    },
    {
      id: 'plant_08',
      en: 'Arabidopsis was the first plant to have its entire genome sequenced.',
      he: 'ארבידופסיס היה הצמח הראשון שמיפו את כל הגנום שלו.',
      ru: 'Арабидопсис стал первым растением с полностью расшифрованным геномом.',
      tags: ['plants', 'genetics'],
      species: 'arabidopsis', loading: false, discovery: true
    },
    {
      id: 'plant_09',
      en: 'Tree ferns date back to the Carboniferous — they fueled the coal we burn today.',
      he: 'שרכי עץ חוזרים לתקופת הפחמן — הם יצרו את הפחם שאנו שורפים היום.',
      ru: 'Древовидные папоротники из Каменноугольного периода — из них образовался уголь.',
      tags: ['plants', 'deep-time'],
      species: 'tree-fern', loading: false, discovery: true
    },
    {
      id: 'plant_10',
      en: 'Marchantia liverworts were among the first plants to colonize land 470 million years ago.',
      he: 'כבדניות מרכנטיה היו בין הצמחים הראשונים שכבשו את היבשה לפני 470 מיליון שנה.',
      ru: 'Маршанция — одно из первых растений, освоивших сушу 470 млн лет назад.',
      tags: ['plants', 'deep-time'],
      species: 'marchantia', loading: false, discovery: true
    },
    {
      id: 'plant_11',
      en: 'Plants wage chemical warfare — some release toxins to kill rival seedlings.',
      he: 'צמחים מנהלים מלחמה כימית — חלקם משחררים רעלים להרוג שתילים מתחרים.',
      ru: 'Растения ведут химическую войну — некоторые выделяют токсины, убивая соперников.',
      tags: ['plants', 'ecology'],
      species: 'plantae', loading: false, discovery: true
    },
    {
      id: 'plant_12',
      en: 'Angiosperms — flowering plants — conquered the world in just 100 million years.',
      he: 'אנגיוספרמים — צמחים פורחים — כבשו את העולם תוך 100 מיליון שנה בלבד.',
      ru: 'Покрытосеменные — цветковые растения — покорили мир всего за 100 млн лет.',
      tags: ['plants', 'evolution'],
      species: 'angiosperms', loading: false, discovery: true
    },

    // ── Invertebrates ────────────────────────────────
    {
      id: 'inv_01',
      en: 'Octopuses can taste with their suckers and edit their own RNA.',
      he: 'תמנונים יכולים לטעום עם הוונטוזות שלהם ולערוך את ה-RNA שלהם.',
      ru: 'Осьминоги пробуют пищу присосками и редактируют собственную РНК.',
      tags: ['animals', 'intelligence'],
      species: 'octopus', loading: false, discovery: true
    },
    {
      id: 'inv_02',
      en: 'Nautilus has survived virtually unchanged for 500 million years.',
      he: 'נאוטילוס שרד כמעט ללא שינוי במשך 500 מיליון שנה.',
      ru: 'Наутилус существует практически без изменений уже 500 миллионов лет.',
      tags: ['animals', 'living-fossil'],
      species: 'nautilus', loading: false, discovery: true
    },
    {
      id: 'inv_03',
      en: 'Turritopsis dohrnii — the "immortal jellyfish" — can revert to its juvenile form.',
      he: 'טוריטופסיס דוהרני — "המדוזה האלמותית" — יכולה לחזור לצורתה הצעירה.',
      ru: 'Turritopsis dohrnii — «бессмертная медуза» — может вернуться в юную форму.',
      tags: ['animals', 'longevity'],
      species: 'turritopsis', loading: false, discovery: true
    },
    {
      id: 'inv_04',
      en: 'Mantis shrimp punch at the speed of a .22 caliber bullet.',
      he: 'שרימפס גמל מכה במהירות של כדור מקליבר 22.',
      ru: 'Рак-богомол бьёт со скоростью пули калибра .22.',
      tags: ['animals', 'records'],
      species: 'mantis-shrimp', loading: false, discovery: true
    },
    {
      id: 'inv_05',
      en: 'A honey bee visits 2,000 flowers a day and communicates by dancing.',
      he: 'דבורת דבש מבקרת ב-2,000 פרחים ביום ומתקשרת באמצעות ריקוד.',
      ru: 'Пчела посещает 2000 цветов в день и общается танцем.',
      tags: ['animals', 'behavior'],
      species: 'honey-bee', loading: false, discovery: true
    },
    {
      id: 'inv_06',
      en: 'Horseshoe crabs have existed for 450 million years — before dinosaurs, before trees.',
      he: 'סרטני פרסה קיימים כבר 450 מיליון שנה — לפני הדינוזאורים, לפני העצים.',
      ru: 'Мечехвосты существуют 450 млн лет — старше динозавров и деревьев.',
      tags: ['animals', 'living-fossil'],
      species: 'horseshoe-crab', loading: false, discovery: true
    },
    {
      id: 'inv_07',
      en: 'Corals are animals, not plants — each polyp is a tiny predator.',
      he: 'אלמוגים הם בעלי חיים, לא צמחים — כל פוליפ הוא טורף זעיר.',
      ru: 'Кораллы — животные, а не растения: каждый полип — крошечный хищник.',
      tags: ['animals', 'taxonomy'],
      species: 'coral', loading: false, discovery: true
    },
    {
      id: 'inv_08',
      en: 'Insects make up 80% of all known animal species.',
      he: 'חרקים מהווים 80% מכל מיני בעלי החיים הידועים.',
      ru: 'Насекомые составляют 80% всех известных видов животных.',
      tags: ['animals', 'diversity'],
      species: 'insects', loading: false, discovery: true
    },
    {
      id: 'inv_09',
      en: 'Starfish can regenerate an entire body from a single arm.',
      he: 'כוכבי ים יכולים לחדש גוף שלם מזרוע בודדת.',
      ru: 'Морские звёзды могут восстановить всё тело из одной руки.',
      tags: ['animals', 'regeneration'],
      species: 'echinoderms', loading: false, discovery: true
    },
    {
      id: 'inv_10',
      en: 'Spider silk is stronger than steel by weight and stretchier than nylon.',
      he: 'חוט עכביש חזק מפלדה ביחס למשקל וגמיש יותר מניילון.',
      ru: 'Паутина прочнее стали по весу и эластичнее нейлона.',
      tags: ['animals', 'materials'],
      species: 'invertebrates', loading: false, discovery: true
    },
    {
      id: 'inv_11',
      en: 'Earthworms aerate 7 tonnes of soil per acre per year.',
      he: 'תולעי אדמה מאווררות 7 טונות אדמה לדונם בשנה.',
      ru: 'Дождевые черви аэрируют 7 тонн почвы на гектар в год.',
      tags: ['animals', 'ecology'],
      species: 'annelids', loading: false, discovery: true
    },
    {
      id: 'inv_12',
      en: 'Mantis shrimp see 16 types of colour receptors — humans have only 3.',
      he: 'שרימפס גמל רואה 16 סוגי קולטני צבע — לבני אדם יש רק 3.',
      ru: 'Рак-богомол видит 16 типов цветовых рецепторов — у человека только 3.',
      tags: ['animals', 'senses'],
      species: 'mantis-shrimp', loading: false, discovery: true
    },
    {
      id: 'inv_13',
      en: 'Octopuses have three hearts: two pump blood to gills, one to the body.',
      he: 'לתמנונים שלושה לבבות: שניים שואבים דם לזימים, אחד לגוף.',
      ru: 'У осьминогов три сердца: два качают кровь к жабрам, одно — к телу.',
      tags: ['animals', 'anatomy'],
      species: 'octopus', loading: false, discovery: true
    },
    {
      id: 'inv_14',
      en: 'Cnidarians include jellyfish and corals — armed with stinging cells called nematocysts.',
      he: 'צורבים כוללים מדוזות ואלמוגים — חמושים בתאי עקיצה שנקראים נמטוציסטים.',
      ru: 'Стрекающие — медузы и кораллы — вооружены жгучими клетками нематоцистами.',
      tags: ['animals', 'morphology'],
      species: 'cnidarians', loading: false, discovery: true
    },

    // ── Fish & Amphibians ────────────────────────────
    {
      id: 'fish_01',
      en: 'Coelacanths have lobe-shaped fins — the ancestors of all land-animal limbs.',
      he: 'לסילקנתים סנפירים בצורת אונה — אבות כל גפי בעלי החיים היבשתיים.',
      ru: 'У латимерий лопастные плавники — предки конечностей всех наземных животных.',
      tags: ['animals', 'evolution'],
      species: 'coelacanth', loading: false, discovery: true
    },
    {
      id: 'fish_02',
      en: 'Sharks detect electric fields — they sense a heartbeat from meters away.',
      he: 'כרישים מזהים שדות חשמליים — הם חשים פעימת לב ממרחק מטרים.',
      ru: 'Акулы чувствуют электрические поля — они ощущают сердцебиение за метры.',
      tags: ['animals', 'senses'],
      species: 'shark', loading: false, discovery: true
    },
    {
      id: 'fish_03',
      en: 'Fish were the first vertebrates — every land animal descends from a fish.',
      he: 'דגים היו חולייתנים הראשונים — כל בעלי חיים יבשתיים צאצאים של דג.',
      ru: 'Рыбы — первые позвоночные: все наземные животные произошли от рыб.',
      tags: ['animals', 'evolution'],
      species: 'fish', loading: false, discovery: true
    },
    {
      id: 'fish_04',
      en: 'Amphibians were the first vertebrates to walk on land — 375 million years ago.',
      he: 'דו-חיים היו חולייתנים הראשונים שהלכו על יבשה — לפני 375 מיליון שנה.',
      ru: 'Амфибии первыми из позвоночных вышли на сушу — 375 млн лет назад.',
      tags: ['animals', 'evolution'],
      species: 'amphibians', loading: false, discovery: true
    },
    {
      id: 'fish_05',
      en: 'Shark skeletons are made entirely of cartilage — not a single bone.',
      he: 'שלדי כרישים עשויים כולם מסחוס — בלי עצם אחת.',
      ru: 'Скелет акулы целиком из хрящей — ни одной кости.',
      tags: ['animals', 'anatomy'],
      species: 'shark', loading: false, discovery: true
    },
    {
      id: 'fish_06',
      en: 'Some deep-sea fish create their own light in the eternal darkness.',
      he: 'חלק מדגי המעמקים יוצרים אור משלהם בחושך הנצחי.',
      ru: 'Некоторые глубоководные рыбы создают собственный свет в вечной тьме.',
      tags: ['animals', 'bioluminescence'],
      species: 'fish', loading: false, discovery: true
    },
    {
      id: 'fish_07',
      en: 'Lungfish can survive buried in mud for years, waiting for rain.',
      he: 'דגי ריאות יכולים לשרוד קבורים בבוץ שנים, ממתינים לגשם.',
      ru: 'Двоякодышащие рыбы выживают в грязи годами, ожидая дождя.',
      tags: ['animals', 'survival'],
      species: 'fish', loading: false, discovery: true
    },
    {
      id: 'fish_08',
      en: 'Frogs absorb water through their skin — they never need to drink.',
      he: 'צפרדעים סופגות מים דרך עורן — הן אף פעם לא צריכות לשתות.',
      ru: 'Лягушки впитывают воду кожей — им не нужно пить.',
      tags: ['animals', 'physiology'],
      species: 'amphibians', loading: false, discovery: true
    },

    // ── Reptiles & Birds ─────────────────────────────
    {
      id: 'rept_01',
      en: 'The tuatara has a "third eye" on top of its head — a light-sensing organ.',
      he: 'לטואטרה יש "עין שלישית" על ראשה — איבר לחישת אור.',
      ru: 'У гаттерии есть «третий глаз» на макушке — светочувствительный орган.',
      tags: ['animals', 'anatomy'],
      species: 'tuatara', loading: false, discovery: true
    },
    {
      id: 'rept_02',
      en: 'Komodo dragons can detect prey from 10 km away using their forked tongue.',
      he: 'דרקוני קומודו יכולים לזהות טרף ממרחק 10 ק"מ באמצעות לשונם המפוצלת.',
      ru: 'Комодские вараны чуют добычу за 10 км раздвоенным языком.',
      tags: ['animals', 'senses'],
      species: 'komodo-dragon', loading: false, discovery: true
    },
    {
      id: 'rept_03',
      en: 'Archaeopteryx — the first known bird — had teeth, claws, and a bony tail.',
      he: 'ארכאופטריקס — הציפור הראשונה הידועה — היו לו שיניים, טפרים וזנב עצמי.',
      ru: 'Археоптерикс — древнейшая птица — имел зубы, когти и костяной хвост.',
      tags: ['animals', 'evolution'],
      species: 'archaeopteryx', loading: false, discovery: true
    },
    {
      id: 'rept_04',
      en: 'Birds are living dinosaurs — T. rex is closer to a chicken than to a lizard.',
      he: 'ציפורים הן דינוזאורים חיים — טי-רקס קרוב יותר לתרנגולת מאשר ללטאה.',
      ru: 'Птицы — живые динозавры: тираннозавр ближе к курице, чем к ящерице.',
      tags: ['animals', 'evolution'],
      species: 'birds', loading: true, discovery: true
    },
    {
      id: 'rept_05',
      en: 'Tuatara are the sole survivors of an order that thrived with dinosaurs.',
      he: 'טואטרות הן השורדות היחידות של סדרה שפרחה עם הדינוזאורים.',
      ru: 'Гаттерии — единственные выжившие из отряда, процветавшего с динозаврами.',
      tags: ['animals', 'living-fossil'],
      species: 'tuatara', loading: false, discovery: true
    },
    {
      id: 'rept_06',
      en: 'Arctic terns migrate pole to pole — 70,000 km a year — the longest animal journey.',
      he: 'שחפיות ארקטיות נודדות מקוטב לקוטב — 70,000 ק"מ בשנה — המסע הארוך בעולם החי.',
      ru: 'Полярные крачки мигрируют от полюса к полюсу — 70 000 км в год — рекорд среди животных.',
      tags: ['animals', 'records'],
      species: 'birds', loading: false, discovery: true
    },
    {
      id: 'rept_07',
      en: 'Crocodilians have been apex predators for 200 million years.',
      he: 'תנינים היו טורפי על כבר 200 מיליון שנה.',
      ru: 'Крокодилы — верховные хищники уже 200 миллионов лет.',
      tags: ['animals', 'deep-time'],
      species: 'reptiles', loading: false, discovery: true
    },
    {
      id: 'rept_08',
      en: 'Komodo dragon saliva contains over 50 strains of bacteria — a bite is almost always fatal.',
      he: 'רוק דרקון קומודו מכיל מעל 50 זני חיידקים — נשיכה כמעט תמיד קטלנית.',
      ru: 'Слюна комодского варана содержит более 50 штаммов бактерий — укус почти всегда смертелен.',
      tags: ['animals', 'predator'],
      species: 'komodo-dragon', loading: false, discovery: true
    },

    // ── Mammals ──────────────────────────────────────
    {
      id: 'mam_01',
      en: 'Blue whales are the largest animals ever — heavier than any dinosaur.',
      he: 'לווייתנים כחולים הם בעלי החיים הגדולים בכל הזמנים — כבדים מכל דינוזאור.',
      ru: 'Синие киты — крупнейшие животные в истории, тяжелее любого динозавра.',
      tags: ['animals', 'records'],
      species: 'blue-whale', loading: false, discovery: true
    },
    {
      id: 'mam_02',
      en: 'Naked mole-rats are cancer-resistant and can live 30+ years — ten times longer than mice.',
      he: 'חולדי שומה עירומים עמידים לסרטן ויכולים לחיות 30+ שנה — פי עשרה מעכברים.',
      ru: 'Голые землекопы устойчивы к раку и живут 30+ лет — в десять раз дольше мышей.',
      tags: ['animals', 'longevity'],
      species: 'naked-mole-rat', loading: false, discovery: true
    },
    {
      id: 'mam_03',
      en: 'The platypus is one of only five mammals that lay eggs.',
      he: 'הברווזן הוא אחד מחמישה יונקים בלבד שמטילים ביצים.',
      ru: 'Утконос — одно из пяти млекопитающих, откладывающих яйца.',
      tags: ['animals', 'taxonomy'],
      species: 'platypus', loading: false, discovery: true
    },
    {
      id: 'mam_04',
      en: 'Whale songs can travel 3,000 km across the ocean.',
      he: 'שירי לווייתנים יכולים לנוע 3,000 ק"מ ברחבי האוקיינוס.',
      ru: 'Песни китов разносятся на 3000 км через океан.',
      tags: ['animals', 'communication'],
      species: 'cetaceans', loading: false, discovery: true
    },
    {
      id: 'mam_05',
      en: 'Bats are the only mammals capable of true powered flight.',
      he: 'עטלפים הם היונקים היחידים שמסוגלים לטיסה מונעת אמיתית.',
      ru: 'Летучие мыши — единственные млекопитающие, способные к настоящему полёту.',
      tags: ['animals', 'flight'],
      species: 'mammals', loading: false, discovery: true
    },
    {
      id: 'mam_06',
      en: 'Elephants mourn their dead and can recognise themselves in a mirror.',
      he: 'פילים מתאבלים על מתיהם ויכולים לזהות את עצמם במראה.',
      ru: 'Слоны оплакивают умерших и узнают себя в зеркале.',
      tags: ['animals', 'intelligence'],
      species: 'mammals', loading: false, discovery: true
    },
    {
      id: 'mam_07',
      en: 'Platypus males have venomous ankle spurs — one of the few venomous mammals.',
      he: 'לזכרי הברווזן יש דרבנות ארסיות בקרסול — מהיונקים הארסיים הבודדים.',
      ru: 'У самцов утконоса ядовитые шпоры на лапах — одно из немногих ядовитых млекопитающих.',
      tags: ['animals', 'venom'],
      species: 'platypus', loading: false, discovery: true
    },
    {
      id: 'mam_08',
      en: 'A blue whale\'s tongue weighs as much as an elephant.',
      he: 'לשון של לוויתן כחול שוקלת כמו פיל.',
      ru: 'Язык синего кита весит столько же, сколько слон.',
      tags: ['animals', 'records'],
      species: 'blue-whale', loading: false, discovery: true
    },
    {
      id: 'mam_09',
      en: 'Naked mole-rats live in colonies with a queen — like social insects.',
      he: 'חולדי שומה עירומים חיים במושבות עם מלכה — כמו חרקים חברתיים.',
      ru: 'Голые землекопы живут колониями с королевой — как социальные насекомые.',
      tags: ['animals', 'behavior'],
      species: 'naked-mole-rat', loading: false, discovery: true
    },
    {
      id: 'mam_10',
      en: 'Dolphins sleep with one eye open — literally half their brain stays awake.',
      he: 'דולפינים ישנים עם עין פקוחה — חצי מוחם ממש נשאר ער.',
      ru: 'Дельфины спят с одним открытым глазом — половина мозга бодрствует.',
      tags: ['animals', 'neuroscience'],
      species: 'cetaceans', loading: false, discovery: true
    },
    {
      id: 'mam_11',
      en: 'Mammals survived the asteroid that killed the dinosaurs by being small and burrowing.',
      he: 'יונקים שרדו את האסטרואיד שהרג את הדינוזאורים כי היו קטנים וחפרו מחילות.',
      ru: 'Млекопитающие пережили астероид, убивший динозавров, благодаря малому размеру и норам.',
      tags: ['animals', 'extinction'],
      species: 'mammals', loading: false, discovery: true
    },
    {
      id: 'mam_12',
      en: 'Whales evolved from land animals — their closest living relative is the hippo.',
      he: 'לווייתנים התפתחו מבעלי חיים יבשתיים — קרובם החי הקרוב ביותר הוא היפופוטם.',
      ru: 'Киты произошли от наземных животных — их ближайший родственник — бегемот.',
      tags: ['animals', 'evolution'],
      species: 'cetaceans', loading: false, discovery: true
    },

    // ── Hominins / Great Apes ────────────────────────
    {
      id: 'hom_01',
      en: 'Humans and chimpanzees share 98.7% of their DNA.',
      he: 'בני אדם ושימפנזים חולקים 98.7% מה-DNA שלהם.',
      ru: 'Люди и шимпанзе разделяют 98,7% ДНК.',
      tags: ['humans', 'genetics'],
      species: 'chimpanzee', loading: false, discovery: true
    },
    {
      id: 'hom_02',
      en: 'Gorillas build a fresh nest to sleep in every single night.',
      he: 'גורילות בונות קן חדש לישון בו בכל לילה.',
      ru: 'Гориллы каждую ночь строят свежее гнездо для сна.',
      tags: ['animals', 'behavior'],
      species: 'gorilla', loading: false, discovery: true
    },
    {
      id: 'hom_03',
      en: 'Orangutans are the world\'s largest tree-dwelling animals.',
      he: 'אורנגאוטנים הם בעלי החיים הגדולים בעולם שחיים על עצים.',
      ru: 'Орангутаны — крупнейшие древесные животные в мире.',
      tags: ['animals', 'records'],
      species: 'orangutan', loading: false, discovery: true
    },
    {
      id: 'hom_04',
      en: 'Homo sapiens left Africa only 70,000 years ago — a blink in evolutionary time.',
      he: 'הומו סאפיינס עזב את אפריקה רק לפני 70,000 שנה — הרף עין בזמן אבולוציוני.',
      ru: 'Homo sapiens покинул Африку лишь 70 000 лет назад — мгновение в масштабах эволюции.',
      tags: ['humans', 'migration'],
      species: 'homo-sapiens', loading: false, discovery: true
    },
    {
      id: 'hom_05',
      en: 'All non-African humans carry 1-4% Neanderthal DNA.',
      he: 'לכל בני האדם שמחוץ לאפריקה יש 1-4% DNA של ניאנדרטלים.',
      ru: 'Все неафриканцы несут 1-4% ДНК неандертальцев.',
      tags: ['humans', 'genetics'],
      species: 'hominini', loading: false, discovery: true
    },
    {
      id: 'hom_06',
      en: 'The human brain uses 20% of the body\'s energy — despite being 2% of its weight.',
      he: 'המוח האנושי צורך 20% מהאנרגיה של הגוף — למרות שהוא 2% ממשקלו.',
      ru: 'Мозг потребляет 20% энергии тела, хотя составляет лишь 2% его массы.',
      tags: ['humans', 'neuroscience'],
      species: 'homo-sapiens', loading: false, discovery: true
    },
    {
      id: 'hom_07',
      en: 'Chimpanzees use tools, wage war, and mourn their dead.',
      he: 'שימפנזים משתמשים בכלים, מנהלים מלחמות ומתאבלים על מתיהם.',
      ru: 'Шимпанзе используют орудия, ведут войны и оплакивают умерших.',
      tags: ['animals', 'intelligence'],
      species: 'chimpanzee', loading: false, discovery: true
    },
    {
      id: 'hom_08',
      en: 'Cooking food may have been the key innovation that grew our ancestor\'s brain.',
      he: 'בישול מזון אולי היה החידוש המפתח שגרם למוח של אבותינו לגדול.',
      ru: 'Приготовление пищи, возможно, стало ключевым фактором роста мозга наших предков.',
      tags: ['humans', 'evolution'],
      species: 'hominini', loading: false, discovery: true
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

  /** Get a random discovery fact for toast (excludes recently shown) */
  function getDiscoveryFact(lang, excludeIds) {
    let pool = facts.filter(f => f.discovery && !excludeIds.has(f.id));
    if (!pool.length) pool = facts.filter(f => f.discovery); // reset if exhausted
    if (!pool.length) return null;
    const f = pool[Math.floor(Math.random() * pool.length)];
    return { id: f.id, text: f[lang] || f.en, species: f.species };
  }

  /** Get a random fact for a specific species (by node ID) */
  function getForSpecies(nodeId, lang, excludeIds) {
    let pool = facts.filter(f => f.species === nodeId && f.discovery && !excludeIds.has(f.id));
    if (!pool.length) pool = facts.filter(f => f.species === nodeId && !excludeIds.has(f.id));
    if (!pool.length) return null;
    const f = pool[Math.floor(Math.random() * pool.length)];
    return { id: f.id, text: f[lang] || f.en, species: f.species };
  }

  return { getLoadingFact, getAll, getById, getByTag, getLoadingPool, getDiscoveryFact, getForSpecies, facts };
})();
