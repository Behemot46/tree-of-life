// ══════════════════════════════════════════════════════
// KIN — WHAT EACH BRANCH IS
//
// One line per dated node of js/kin/tree.js, in every language: the "why"
// shown under the reveal of a question nobody wrote by hand. When a target
// meets its nearer relative at a node, this is the line about that node.
//
// Each line names the group the node defines — never a broader one — so it
// always separates the right answer from the wrong one: the farther
// relative is, by construction, outside the group. "Monocots" is fine for
// tulip and rice against a rose; it would not be for banana and palm
// against a tulip, which is why the commelinids get their own line.
//
// Lines never repeat a date (the headline already says it), so a better-
// sourced age can never contradict them. No line names the target or the
// candidates either, which keeps Hebrew free of gender agreement between a
// sentence and whichever two creatures it happens to be about.
// ══════════════════════════════════════════════════════

const g = (en, he, ru) => ({ en, he, ru });

export const GROUPS = {
  opisthokonta: g(
    'Animals and fungi are sister kingdoms on one branch of life; plants split off earlier.',
    'בעלי החיים והפטריות הן ממלכות אחיות על ענף אחד של החיים; הצמחים התפצלו לפני כן.',
    'Животные и грибы — сестринские царства на одной ветви жизни; растения отделились раньше.'),
  bilateria: g(
    'Bilaterians: animals with a left and a right side, from worms and insects to fish and people.',
    'בעלי סימטריה דו־צדדית: בעלי חיים עם צד ימין וצד שמאל, מתולעים וחרקים ועד דגים ובני אדם.',
    'Двусторонне-симметричные: животные с левой и правой стороной, от червей и насекомых до рыб и людей.'),
  protostomia: g(
    'Protostomes: the great branch of insects, spiders, crabs, snails and octopuses.',
    'הענף הגדול של החרקים, העכבישים, הסרטנים, החלזונות והתמנונים.',
    'Первичноротые: большая ветвь насекомых, пауков, крабов, улиток и осьминогов.'),
  arthropoda: g(
    'Arthropods: jointed legs and an outer skeleton. Insects, spiders and crustaceans.',
    'פרוקי רגליים: רגליים מפרקיות ושלד חיצוני. חרקים, עכבישנים וסרטנאים.',
    'Членистоногие: членистые ноги и наружный скелет. Насекомые, паукообразные и ракообразные.'),
  arachnopulmonata: g(
    'Spiders and scorpions are close cousins among the eight-legged arachnids.',
    'עכבישים ועקרבים הם בני דודים קרובים בין העכבישנים בעלי שמונה הרגליים.',
    'Пауки и скорпионы — близкие родственники среди восьминогих паукообразных.'),
  pancrustacea: g(
    'Crustaceans and insects form one branch: insects grew out of the crustacean family tree.',
    'סרטנאים וחרקים הם ענף אחד: החרקים צמחו מתוך עץ המשפחה של הסרטנאים.',
    'Ракообразные и насекомые — одна ветвь: насекомые возникли внутри родословного древа ракообразных.'),
  holometabola: g(
    'Insects that grow up through a larva and a pupa: bees, ants, beetles, butterflies and flies.',
    'חרקים שעוברים גלגול מלא, מזחל דרך גולם: דבורים, נמלים, חיפושיות, פרפרים וזבובים.',
    'Насекомые с полным превращением, от личинки через куколку: пчёлы, муравьи, жуки, бабочки и мухи.'),
  diptera: g(
    'True flies: insects with a single pair of wings, like houseflies and mosquitoes.',
    'דו־כנפיים: חרקים עם זוג כנפיים אחד, כמו זבוב הבית והיתוש.',
    'Двукрылые: насекомые с одной парой крыльев, как комнатная муха и комар.'),
  mollusca: g(
    'Molluscs: soft-bodied animals, many with shells. Snails, clams, squid and octopuses.',
    'רכיכות: בעלי חיים רכי גוף, רבים מהם עם קונכייה. חלזונות, צדפות, דיונונים ותמנונים.',
    'Моллюски: мягкотелые животные, многие с раковиной. Улитки, мидии, кальмары и осьминоги.'),

  gnathostomata: g(
    'Jawed vertebrates: every animal with a backbone and jaws, from sharks and fish to frogs, birds and people.',
    'בעלי חוליות עם לסתות: מכרישים ודגים ועד צפרדעים, ציפורים ובני אדם.',
    'Челюстноротые: все животные с позвоночником и челюстями, от акул и рыб до лягушек, птиц и людей.'),
  osteichthyes: g(
    'Bony vertebrates: bony fish like salmon, and the land animals that grew out of them.',
    'בעלי חוליות גרמיים: דגי גרם כמו הסלמון, וחיות היבשה שצמחו מהם.',
    'Костные позвоночные: костные рыбы вроде лосося и наземные животные, которые от них произошли.'),
  tetrapoda: g(
    'Tetrapods, the four-limbed animals: amphibians, reptiles, birds and mammals.',
    'בעלי ארבע גפיים: דו־חיים, זוחלים, ציפורים ויונקים.',
    'Четвероногие: земноводные, пресмыкающиеся, птицы и млекопитающие.'),
  sauria: g(
    'Reptiles in the broad sense: lizards and snakes on one branch; turtles, crocodiles and birds on the other.',
    'זוחלים במובן הרחב: לטאות ונחשים בענף אחד; צבים, תנינים וציפורים בענף השני.',
    'Пресмыкающиеся в широком смысле: ящерицы и змеи на одной ветви; черепахи, крокодилы и птицы — на другой.'),
  squamata: g(
    'Squamates, the scaled reptiles: lizards and snakes.',
    'זוחלים קשקשיים: לטאות ונחשים.',
    'Чешуйчатые пресмыкающиеся: ящерицы и змеи.'),
  archelosauria: g(
    'Turtles are closest kin to crocodiles and birds, a branch that DNA revealed.',
    'הצבים הם הקרובים ביותר לתנינים ולציפורים, ענף שהדנ״א חשף.',
    'Черепахи — ближайшая родня крокодилам и птицам; эту ветвь обнаружили по ДНК.'),
  archosauria: g(
    'Archosaurs: crocodiles on one branch, dinosaurs and birds on the other.',
    'ארכוזאורים: התנינים בענף אחד, הדינוזאורים והציפורים בענף השני.',
    'Архозавры: крокодилы на одной ветви, динозавры и птицы — на другой.'),
  tyrannoraptora: g(
    'Birds are theropod dinosaurs, from the same branch as T. rex.',
    'הציפורים הן דינוזאורים תרופודים, מאותו ענף כמו הטירנוזאורוס.',
    'Птицы — это динозавры-тероподы, с той же ветви, что и тираннозавр.'),
  neognathae: g(
    'Nearly all living birds: the chicken-and-duck branch, and the branch of all the rest.',
    'כמעט כל הציפורים של היום: ענף התרנגולות והברווזים, וענף כל השאר.',
    'Почти все современные птицы: ветвь кур и уток и ветвь всех остальных.'),
  neoaves: g(
    'Neoaves: most living birds, from flamingos and pigeons to penguins and eagles.',
    'רוב הציפורים של היום: מפלמינגו ויונים ועד פינגווינים ועיטים.',
    'Большинство современных птиц: от фламинго и голубей до пингвинов и орлов.'),

  theria: g(
    'Therian mammals give birth to live young: marsupials and placental mammals.',
    'יונקים שממליטים ולדות חיים: חיות כיס ויונקי שליה.',
    'Живородящие млекопитающие: сумчатые и плацентарные.'),
  diprotodontia: g(
    'One order of marsupials: koalas, wombats and kangaroos.',
    'סדרה אחת של חיות כיס: קואלות, וומבטים וקנגורו.',
    'Один отряд сумчатых: коалы, вомбаты и кенгуру.'),
  placentalia: g(
    'Placental mammals: the young grow inside the mother, fed through a placenta.',
    'יונקי שליה: הוולד גדל ברחם האם וניזון דרך השליה.',
    'Плацентарные млекопитающие: детёныш растёт в теле матери и питается через плаценту.'),
  elephantidae: g(
    'The elephant family: African and Asian elephants, and the mammoths.',
    'משפחת הפילים: הפילים האפריקניים והאסייתיים, והממותות.',
    'Семейство слоновых: африканские и азиатские слоны и мамонты.'),
  boreoeutheria: g(
    'The northern branch of placental mammals, from mice and monkeys to cats, horses and whales.',
    'הענף הצפוני של יונקי השליה: מעכברים וקופים ועד חתולים, סוסים ולווייתנים.',
    'Северная ветвь плацентарных: от мышей и обезьян до кошек, лошадей и китов.'),
  hominidae: g(
    'Great apes: orangutans, gorillas, chimpanzees and people.',
    'קופי האדם הגדולים: אורנגאוטנים, גורילות, שימפנזים ובני אדם.',
    'Большие человекообразные обезьяны: орангутаны, гориллы, шимпанзе и люди.'),
  homininae: g(
    'African great apes: gorillas, chimpanzees and people.',
    'קופי האדם של אפריקה: גורילות, שימפנזים ובני אדם.',
    'Африканские человекообразные обезьяны: гориллы, шимпанзе и люди.'),
  laurasiatheria: g(
    'One big branch of mammals: hedgehogs, bats, cats, horses, cows and whales.',
    'ענף גדול של יונקים: קיפודים, עטלפים, חתולים, סוסים, פרות ולווייתנים.',
    'Одна большая ветвь млекопитающих: ежи, летучие мыши, кошки, лошади, коровы и киты.'),
  scrotifera: g(
    'Bats, carnivores and the hoofed mammals, whales included, share one branch.',
    'עטלפים, טורפים ובעלי פרסות, כולל הלווייתנים, חולקים ענף אחד.',
    'Летучие мыши, хищные и копытные, включая китов, делят одну ветвь.'),
  carnivora: g(
    'Carnivorans: cats, dogs, bears, seals, weasels and their kin.',
    'טורפים: חתולים, כלבים, דובים, כלבי ים, סמורים וקרוביהם.',
    'Хищные: кошки, собаки, медведи, тюлени, ласки и их родня.'),
  caniformia: g(
    'Caniforms, the dog-like carnivores: dogs, bears, seals, weasels and raccoons.',
    'טורפים דמויי כלב: כלבים, דובים, כלבי ים, סמורים ודביבונים.',
    'Псообразные хищники: собаки, медведи, тюлени, ласки и еноты.'),
  arctoidea: g(
    'Bears, seals, weasels and raccoons: the dog-like carnivores, minus the dog family.',
    'דובים, כלבי ים, סמורים ודביבונים: הטורפים דמויי הכלב, בלי משפחת הכלביים.',
    'Медведи, тюлени, ласки и еноты: псообразные хищники, кроме семейства псовых.'),
  procyonids_mustelids: g(
    "The raccoon family and the weasel family, which includes otters and badgers, are each other's closest kin.",
    'משפחת הדביבונים ומשפחת הסמוריים, שכוללת לוטרות וגיריות, הן הקרובות ביותר זו לזו.',
    'Семейство енотовых и семейство куньих, к которому относятся выдры и барсуки, — ближайшая родня друг другу.'),
  artiodactyla: g(
    'Even-toed hoofed mammals: camels, pigs, cows, deer, giraffes and hippos, and the whales that came from them.',
    "בעלי פרסות עם מספר זוגי של אצבעות: גמלים, חזירים, פרות, צבאים, ג'ירפות והיפופוטמים, והלווייתנים שהתפתחו מהם.",
    'Парнокопытные: верблюды, свиньи, коровы, олени, жирафы и бегемоты, а также произошедшие от них киты.'),
  artiofabula: g(
    'Pigs, ruminants, hippos and whales: the even-toed mammals left after the camels branched off.',
    'חזירים, מעלי גירה, היפופוטמים ולווייתנים: בעלי הפרסות הזוגיות שנשארו אחרי שהגמלים התפצלו.',
    'Свиньи, жвачные, бегемоты и киты: парнокопытные, оставшиеся после того, как отделились верблюды.'),
  cetruminantia: g(
    'Ruminants and the whale-hippo branch: cows, deer and giraffes on one side, hippos and whales on the other.',
    "מעלי הגירה וענף הלווייתן וההיפופוטם: פרות, צבאים וג'ירפות מצד אחד, היפופוטמים ולווייתנים מהצד השני.",
    'Жвачные и ветвь китов и бегемотов: коровы, олени и жирафы с одной стороны, бегемоты и киты — с другой.'),
  whippomorpha: g(
    'Hippos, whales and dolphins: whales grew out of this branch of hoofed mammals.',
    'היפופוטמים, לווייתנים ודולפינים: הלווייתנים צמחו מהענף הזה של בעלי הפרסות.',
    'Бегемоты, киты и дельфины: киты произошли от этой ветви копытных.'),
  pecora: g(
    'Ruminants with horns or antlers: cows, sheep, goats, deer and giraffes.',
    "מעלי גירה עם קרניים: פרות, כבשים, עיזים, צבאים וג'ירפות.",
    'Жвачные с рогами: коровы, овцы, козы, олени и жирафы.'),
  perissodactyla: g(
    'Odd-toed hoofed mammals: horses, rhinos and tapirs.',
    'בעלי פרסות עם מספר אי־זוגי של אצבעות: סוסים, קרנפים וטפירים.',
    'Непарнокопытные: лошади, носороги и тапиры.'),

  mesangiospermae: g(
    'Nearly all flowering plants: magnolias and avocados, monocots like grasses and lilies, and eudicots like roses and daisies.',
    'כמעט כל הצמחים הפורחים: מגנוליות ואבוקדו, חד־פסיגיים כמו דגניים ושושנים, ודו־פסיגיים כמו ורדים וחינניות.',
    'Почти все цветковые растения: магнолии и авокадо, однодольные вроде злаков и лилий и двудольные вроде роз и маргариток.'),
  monocots_lilies_grasses: g(
    'Monocots: flowering plants with one seed leaf, like lilies, tulips, orchids, palms, bananas and grasses.',
    'חד־פסיגיים: צמחים פורחים עם עלה פסיג אחד, כמו שושנים, צבעונים, סחלבים, דקלים, בננות ודגניים.',
    'Однодольные: цветковые растения с одной семядолей, как лилии, тюльпаны, орхидеи, пальмы, бананы и злаки.'),
  commelinids: g(
    'Commelinids: the monocot branch of palms, bananas, ginger, pineapples and grasses.',
    "ענף של החד־פסיגיים: דקלים, בננות, ג'ינג'ר, אננס ודגניים.",
    'Коммелиниды: ветвь однодольных, к которой относятся пальмы, бананы, имбирь, ананасы и злаки.'),
  poaceae: g(
    'Grasses: rice, corn, wheat, bamboo and the grass on a lawn.',
    'דגניים: אורז, תירס, חיטה, במבוק ועשב המדשאה.',
    'Злаки: рис, кукуруза, пшеница, бамбук и трава на газоне.'),
  pentapetalae: g(
    'Core eudicots: most flowering plants, from roses and apples to tomatoes and daisies.',
    'רוב הצמחים הדו־פסיגיים: מוורדים ותפוחים ועד עגבניות וחינניות.',
    'Настоящие двудольные: большинство цветковых растений, от роз и яблонь до помидоров и маргариток.'),
  rosids: g(
    'Rosids: grapes, roses, apples, gourds, citrus, maples and cocoa all sit on this branch.',
    'ענף גדול של צמחים: גפנים, ורדים, תפוחים, דלועים, הדרים, אדרים וקקאו.',
    'Розиды: на этой ветви виноград, розы, яблони, тыквенные, цитрусовые, клёны и какао.'),
  eurosids: g(
    'Apples, roses and gourds on one side, citrus, maples and cocoa on the other: the rosids after the grapes branched off.',
    'תפוחים, ורדים ודלועים מצד אחד, הדרים, אדרים וקקאו מהצד השני: הענף שנשאר אחרי שהגפן התפצלה.',
    'Яблони, розы и тыквенные с одной стороны, цитрусовые, клёны и какао — с другой: розиды, оставшиеся после того, как отделился виноград.'),
  sapindales: g(
    'One order of plants: citrus, maples, mangoes, cashews and lychees.',
    "סדרה אחת של צמחים: הדרים, אדרים, מנגו, קשיו וליצ'י.",
    'Один порядок растений: цитрусовые, клёны, манго, кешью и личи.'),
  rosoideae: g(
    'The rose subfamily: roses, strawberries and raspberries.',
    'תת־משפחת הוורד: ורדים, תותים ופטל.',
    'Подсемейство розовых: розы, клубника и малина.'),
  prunus: g(
    'One genus, Prunus: cherries, peaches, plums, apricots and almonds.',
    'סוג אחד, פרונוס: דובדבנים, אפרסקים, שזיפים, משמשים ושקדים.',
    'Один род, слива: черешни, вишни, персики, абрикосы, миндаль и сами сливы.'),
  benincaseae: g(
    'The melon branch of the gourd family: cucumbers, melons and watermelons.',
    'ענף המלונים במשפחת הדלועיים: מלפפונים, מלונים ואבטיחים.',
    'Дынная ветвь семейства тыквенных: огурцы, дыни и арбузы.'),
  ericales: g(
    'One order of plants, Ericales: kiwifruit, blueberries, tea and persimmons.',
    'סדרה אחת של צמחים: קיווי, אוכמניות, תה ואפרסמון.',
    'Один порядок растений, верескоцветные: киви, голубика, чай и хурма.'),
  lamiids: g(
    'Lamiids: coffee, tomatoes, potatoes, mint and olives sit on this branch.',
    'ענף של צמחים שכולל קפה, עגבניות, תפוחי אדמה, נענע וזיתים.',
    'Ламииды: на этой ветви кофе, помидоры, картофель, мята и оливы.'),
  solanum_eggplant: g(
    'One genus, Solanum: eggplants, tomatoes and potatoes.',
    'סוג אחד, סולנום: חצילים, עגבניות ותפוחי אדמה.',
    'Один род, паслён: баклажаны, помидоры и картофель.'),
  solanum_tomato_potato: g(
    'Tomatoes and potatoes are sister lines inside the genus Solanum.',
    'העגבנייה ותפוח האדמה הם שושלות אחיות בתוך הסוג סולנום.',
    'Помидор и картофель — сестринские линии внутри рода паслён.'),
  asteraceae: g(
    'The daisy family: sunflowers, daisies, lettuce, dandelions and artichokes.',
    'משפחת המורכבים: חמניות, חינניות, חסה, שן הארי וארטישוק.',
    'Семейство астровых, или сложноцветных: подсолнухи, маргаритки, салат, одуванчики и артишоки.'),

  // ── Added with the second set of creatures ──
  planulozoa: g(
    'Jellyfish and corals, and the animals with a left and a right side, from worms to people, share one branch of the animal tree.',
    'מדוזות ואלמוגים, ובעלי החיים עם צד ימין וצד שמאל, מתולעים ועד בני אדם, חולקים ענף אחד בעץ בעלי החיים.',
    'Медузы и кораллы, а также животные с левой и правой стороной, от червей до людей, делят одну ветвь древа животных.'),
  cnidaria: g(
    'Cnidarians: jellyfish, corals and sea anemones, armed with stinging cells.',
    'צורבים: מדוזות, אלמוגים ושושנות ים, עם תאים צורבים.',
    'Стрекающие: медузы, кораллы и актинии, вооружённые стрекательными клетками.'),
  dinosauria: g(
    'Long-necked sauropods and the theropods, which include T. rex and the birds, are all dinosaurs.',
    'הסאורופודים ארוכי הצוואר והתרופודים, שכוללים את הטירנוזאורוס ואת הציפורים, הם כולם דינוזאורים.',
    'Длинношеие зауроподы и тероподы, к которым относятся тираннозавр и птицы, — все они динозавры.'),
  galloanserae: g(
    'Landfowl and waterfowl: chickens, turkeys and peacocks on one side, ducks, geese and swans on the other.',
    'עופות יבשה ועופות מים: תרנגולות, תרנגולי הודו וטווסים מצד אחד, ברווזים, אווזים וברבורים מהצד השני.',
    'Курообразные и гусеобразные: куры, индейки и павлины с одной стороны, утки, гуси и лебеди — с другой.'),
  core_phasianids: g(
    'Chickens, turkeys and peafowl: the core of the pheasant family, with pheasants and partridges.',
    'תרנגולות, תרנגולי הודו וטווסים: לב משפחת הפסיוניים, יחד עם פסיונים וחוגלות.',
    'Куры, индейки и павлины: ядро семейства фазановых, вместе с фазанами и куропатками.'),
  anatidae: g(
    'The duck family: ducks, geese and swans.',
    'משפחת הברווזיים: ברווזים, אווזים וברבורים.',
    'Семейство утиных: утки, гуси и лебеди.'),
  columbidae: g(
    'The pigeon family: pigeons, doves, and the extinct dodo.',
    'משפחת היוניים: יונים, תורים והדודו שנכחד.',
    'Семейство голубиных: голуби, горлицы и вымерший додо.'),
  glires: g(
    'Rodents and rabbits: the gnawing mammals, with front teeth that never stop growing.',
    'מכרסמים וארנבאים: היונקים המכרסמים, עם שיני חזית שגדלות כל החיים.',
    'Грызуны и зайцеобразные: млекопитающие с передними зубами, которые растут всю жизнь.'),
  rodentia: g(
    'Rodents: mice, rats, hamsters, squirrels and beavers.',
    'מכרסמים: עכברים, חולדות, אוגרים, סנאים ובונים.',
    'Грызуны: мыши, крысы, хомяки, белки и бобры.'),
  mouse_related: g(
    'The mouse-related rodents: mice, rats, hamsters and beavers, with gophers and jerboas.',
    'המכרסמים הקרובים לעכבר: עכברים, חולדות, אוגרים ובונים, יחד עם גופרים וירבועים.',
    'Мышиная ветвь грызунов: мыши, крысы, хомяки и бобры, а также гоферы и тушканчики.'),
  muroidea: g(
    'Mice, rats, hamsters, gerbils and voles: the largest branch of the rodents.',
    'עכברים, חולדות, אוגרים, גרבילים ונברנים: הענף הגדול ביותר של המכרסמים.',
    'Мыши, крысы, хомяки, песчанки и полёвки: самая большая ветвь грызунов.'),
  murinae: g(
    'Mice and rats are close cousins, from the same subfamily of rodents.',
    'עכברים וחולדות הם בני דודים קרובים, מאותה תת־משפחה של מכרסמים.',
    'Мыши и крысы — близкие родственники из одного подсемейства грызунов.'),
  catarrhini: g(
    'Old World monkeys and apes: macaques and baboons on one side, gibbons, great apes and people on the other.',
    'קופי העולם הישן וקופי האדם: מקוקים ובבונים מצד אחד, גיבונים, קופי אדם ובני אדם מהצד השני.',
    'Узконосые обезьяны: макаки и павианы с одной стороны, гиббоны, человекообразные обезьяны и люди — с другой.'),
  felidae: g(
    'The cat family: house cats, lions, tigers, lynxes and cheetahs.',
    'משפחת החתוליים: חתולי בית, אריות, טיגריסים, לינקסים וברדלסים.',
    'Семейство кошачьих: домашние кошки, львы, тигры, рыси и гепарды.'),
  panthera: g(
    'The big cats of one genus: lions, tigers, leopards, jaguars and snow leopards.',
    'החתולים הגדולים מסוג אחד: אריות, טיגריסים, נמרים, יגוארים ונמרי שלג.',
    'Большие кошки одного рода: львы, тигры, леопарды, ягуары и снежные барсы.'),
  canidae: g(
    'The dog family: dogs, wolves, foxes and jackals.',
    'משפחת הכלביים: כלבים, זאבים, שועלים ותנים.',
    'Семейство псовых: собаки, волки, лисы и шакалы.'),
  ursidae: g(
    'The bear family, giant pandas included.',
    'משפחת הדוביים, כולל הפנדה הענקית.',
    'Семейство медвежьих, включая большую панду.'),
  musteloidea: g(
    'Skunks, raccoons, weasels, otters and badgers: one branch of the dog-like carnivores.',
    'בואשים, דביבונים, סמורים, לוטרות וגיריות: ענף אחד של הטורפים דמויי הכלב.',
    'Скунсы, еноты, ласки, выдры и барсуки: одна ветвь псообразных хищников.'),
  mustelidae: g(
    'The weasel family: weasels, otters, badgers and wolverines.',
    'משפחת הסמוריים: סמורים, לוטרות, גיריות וגרגרנים.',
    'Семейство куньих: ласки, выдры, барсуки и росомахи.'),
  camelidae: g(
    'The camel family: camels, llamas, alpacas and vicuñas.',
    'משפחת הגמליים: גמלים, לאמות, אלפקות וויקוניות.',
    'Семейство верблюдовых: верблюды, ламы, альпаки и викуньи.'),
  bovidae: g(
    'The cattle family: cows, sheep, goats, antelopes and buffalo.',
    'משפחת הפריים: פרות, כבשים, עיזים, אנטילופות ותאואים.',
    'Семейство полорогих: коровы, овцы, козы, антилопы и буйволы.'),
  equus: g(
    'One genus: horses, donkeys and zebras.',
    'סוג אחד: סוסים, חמורים וזברות.',
    'Один род: лошади, ослы и зебры.'),
  asses_zebras: g(
    'Donkeys and zebras: the branch of the horse genus that split away from horses.',
    'חמורים וזברות: הענף בסוג של הסוסים שהתפצל מהסוסים.',
    'Ослы и зебры: ветвь рода лошадей, отделившаяся от самих лошадей.'),
  spermatophyta: g(
    'Seed plants: conifers, cycads and ginkgo on one side, flowering plants on the other.',
    'צמחי זרע: מחטניים, ציקסים וגינקו מצד אחד, צמחים פורחים מהצד השני.',
    'Семенные растения: хвойные, саговники и гинкго с одной стороны, цветковые — с другой.'),
  zingiberales: g(
    'One order of plants: bananas, ginger, turmeric, cardamom and bird-of-paradise flowers.',
    'סדרה אחת של צמחים: בננות, ג\'ינג\'ר, כורכום, הל ופרחי ציפור גן עדן.',
    'Один порядок растений: бананы, имбирь, куркума, кардамон и стрелиция.'),
  nfc: g(
    'One branch of the rosids: legumes, the rose family, gourds, and oaks and chestnuts.',
    'ענף אחד של הצמחים: קטניות, משפחת הוורדיים, דלועים, ואלונים וערמונים.',
    'Одна ветвь розид: бобовые, семейство розовых, тыквенные, а также дубы и каштаны.'),
  papilionoideae: g(
    'Peas, beans, lentils, chickpeas and peanuts: legumes of the pea subfamily.',
    'אפונה, שעועית, עדשים, חומוס ובוטנים: קטניות מתת־משפחת הפרפרניים.',
    'Горох, фасоль, чечевица, нут и арахис: бобовые из подсемейства мотыльковых.'),
  malvids: g(
    'One branch of the rosids: citrus, maples and mangoes, cabbages and broccoli, and cocoa, cotton and hibiscus.',
    'ענף אחד של הצמחים: הדרים, אדרים ומנגו, כרוב וברוקולי, וקקאו, כותנה והיביסקוס.',
    'Одна ветвь розид: цитрусовые, клёны и манго, капуста и брокколи, а ещё какао, хлопок и гибискус.'),
  brassicales_malvales: g(
    'The cabbage order and the mallow order: broccoli and mustard on one side, cocoa, cotton and hibiscus on the other.',
    'סדרת הכרוב וסדרת החלמית: ברוקולי וחרדל מצד אחד, קקאו, כותנה והיביסקוס מהצד השני.',
    'Капустоцветные и мальвоцветные: брокколи и горчица с одной стороны, какао, хлопок и гибискус — с другой.'),
  malvaceae: g(
    'The mallow family: cocoa, cotton, okra, hibiscus and baobabs.',
    'משפחת החלמיתיים: קקאו, כותנה, במיה, היביסקוס ובאובב.',
    'Семейство мальвовых: какао, хлопок, бамия, гибискус и баобаб.'),
  cucumis: g(
    'One genus: cucumbers and melons.',
    'סוג אחד: מלפפונים ומלונים.',
    'Один род: огурцы и дыни.'),
  euasterids: g(
    'Two big branches of asterids: coffee, tomatoes and olives on one, carrots, lettuce and sunflowers on the other.',
    'שני ענפים גדולים של צמחים: קפה, עגבניות וזיתים באחד, גזר, חסה וחמניות בשני.',
    'Две большие ветви астерид: кофе, помидоры и оливы на одной, морковь, салат и подсолнухи — на другой.'),
  solanales: g(
    'The nightshade family and the morning glories: potatoes, tomatoes and peppers, and sweet potatoes.',
    'משפחת הסולניים ומשפחת החבלבליים: תפוחי אדמה, עגבניות ופלפלים, ובטטות.',
    'Паслёновые и вьюнковые: картофель, помидоры и перцы, а также батат.'),
  solanaceae: g(
    'One branch of the nightshade family: tomatoes, potatoes and eggplants, and sweet and hot peppers.',
    'ענף אחד במשפחת הסולניים: עגבניות, תפוחי אדמה וחצילים, ופלפלים מתוקים וחריפים.',
    'Одна ветвь паслёновых: помидоры, картофель и баклажаны, а также сладкие и острые перцы.'),
  campanulids: g(
    'One branch of plants: carrots, parsley and celery, and the daisy family.',
    'ענף של צמחים שכולל גזר, פטרוזיליה וסלרי, ואת משפחת המורכבים.',
    'Одна ветвь растений: морковь, петрушка и сельдерей, а также семейство астровых.'),
};
