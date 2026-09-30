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

const g = (en, he) => ({ en, he });

export const GROUPS = {
  opisthokonta: g(
    'Animals and fungi are sister kingdoms on one branch of life; plants split off earlier.',
    'בעלי החיים והפטריות הן ממלכות אחיות על ענף אחד של החיים; הצמחים התפצלו לפני כן.'),
  bilateria: g(
    'Bilaterians: animals with a left and a right side, from worms and insects to fish and people.',
    'בעלי סימטריה דו־צדדית: בעלי חיים עם צד ימין וצד שמאל, מתולעים וחרקים ועד דגים ובני אדם.'),
  protostomia: g(
    'Protostomes: the great branch of insects, spiders, crabs, snails and octopuses.',
    'הענף הגדול של החרקים, העכבישים, הסרטנים, החלזונות והתמנונים.'),
  arthropoda: g(
    'Arthropods: jointed legs and an outer skeleton. Insects, spiders and crustaceans.',
    'פרוקי רגליים: רגליים מפרקיות ושלד חיצוני. חרקים, עכבישנים וסרטנאים.'),
  arachnopulmonata: g(
    'Spiders and scorpions are close cousins among the eight-legged arachnids.',
    'עכבישים ועקרבים הם בני דודים קרובים בין העכבישנים בעלי שמונה הרגליים.'),
  pancrustacea: g(
    'Crustaceans and insects form one branch: insects grew out of the crustacean family tree.',
    'סרטנאים וחרקים הם ענף אחד: החרקים צמחו מתוך עץ המשפחה של הסרטנאים.'),
  holometabola: g(
    'Insects that grow up through a larva and a pupa: bees, ants, beetles, butterflies and flies.',
    'חרקים שעוברים גלגול מלא, מזחל דרך גולם: דבורים, נמלים, חיפושיות, פרפרים וזבובים.'),
  diptera: g(
    'True flies: insects with a single pair of wings, like houseflies and mosquitoes.',
    'דו־כנפיים: חרקים עם זוג כנפיים אחד, כמו זבוב הבית והיתוש.'),
  mollusca: g(
    'Molluscs: soft-bodied animals, many with shells. Snails, clams, squid and octopuses.',
    'רכיכות: בעלי חיים רכי גוף, רבים מהם עם קונכייה. חלזונות, צדפות, דיונונים ותמנונים.'),

  gnathostomata: g(
    'Jawed vertebrates: every animal with a backbone and jaws, from sharks and fish to frogs, birds and people.',
    'בעלי חוליות עם לסתות: מכרישים ודגים ועד צפרדעים, ציפורים ובני אדם.'),
  osteichthyes: g(
    'Bony vertebrates: bony fish like salmon, and the land animals that grew out of them.',
    'בעלי חוליות גרמיים: דגי גרם כמו הסלמון, וחיות היבשה שצמחו מהם.'),
  tetrapoda: g(
    'Tetrapods, the four-limbed animals: amphibians, reptiles, birds and mammals.',
    'בעלי ארבע גפיים: דו־חיים, זוחלים, ציפורים ויונקים.'),
  sauria: g(
    'Reptiles in the broad sense: lizards and snakes on one branch; turtles, crocodiles and birds on the other.',
    'זוחלים במובן הרחב: לטאות ונחשים בענף אחד; צבים, תנינים וציפורים בענף השני.'),
  squamata: g(
    'Squamates, the scaled reptiles: lizards and snakes.',
    'זוחלים קשקשיים: לטאות ונחשים.'),
  archelosauria: g(
    'Turtles are closest kin to crocodiles and birds, a branch that DNA revealed.',
    'הצבים הם הקרובים ביותר לתנינים ולציפורים, ענף שהדנ״א חשף.'),
  archosauria: g(
    'Archosaurs: crocodiles on one branch, dinosaurs and birds on the other.',
    'ארכוזאורים: התנינים בענף אחד, הדינוזאורים והציפורים בענף השני.'),
  tyrannoraptora: g(
    'Birds are theropod dinosaurs, from the same branch as T. rex.',
    'הציפורים הן דינוזאורים תרופודים, מאותו ענף כמו הטירנוזאורוס.'),
  neognathae: g(
    'Nearly all living birds: the chicken-and-duck branch, and the branch of all the rest.',
    'כמעט כל הציפורים של היום: ענף התרנגולות והברווזים, וענף כל השאר.'),
  neoaves: g(
    'Neoaves: most living birds, from flamingos and pigeons to penguins and eagles.',
    'רוב הציפורים של היום: מפלמינגו ויונים ועד פינגווינים ועיטים.'),

  theria: g(
    'Therian mammals give birth to live young: marsupials and placental mammals.',
    'יונקים שממליטים ולדות חיים: חיות כיס ויונקי שליה.'),
  diprotodontia: g(
    'One order of marsupials: koalas, wombats and kangaroos.',
    'סדרה אחת של חיות כיס: קואלות, וומבטים וקנגורו.'),
  placentalia: g(
    'Placental mammals: the young grow inside the mother, fed through a placenta.',
    'יונקי שליה: הוולד גדל ברחם האם וניזון דרך השליה.'),
  elephantidae: g(
    'The elephant family: African and Asian elephants, and the mammoths.',
    'משפחת הפילים: הפילים האפריקניים והאסייתיים, והממותות.'),
  boreoeutheria: g(
    'The northern branch of placental mammals, from mice and monkeys to cats, horses and whales.',
    'הענף הצפוני של יונקי השליה: מעכברים וקופים ועד חתולים, סוסים ולווייתנים.'),
  hominidae: g(
    'Great apes: orangutans, gorillas, chimpanzees and people.',
    'קופי האדם הגדולים: אורנגאוטנים, גורילות, שימפנזים ובני אדם.'),
  homininae: g(
    'African great apes: gorillas, chimpanzees and people.',
    'קופי האדם של אפריקה: גורילות, שימפנזים ובני אדם.'),
  laurasiatheria: g(
    'One big branch of mammals: hedgehogs, bats, cats, horses, cows and whales.',
    'ענף גדול של יונקים: קיפודים, עטלפים, חתולים, סוסים, פרות ולווייתנים.'),
  scrotifera: g(
    'Bats, carnivores and the hoofed mammals, whales included, share one branch.',
    'עטלפים, טורפים ובעלי פרסות, כולל הלווייתנים, חולקים ענף אחד.'),
  carnivora: g(
    'Carnivorans: cats, dogs, bears, seals, weasels and their kin.',
    'טורפים: חתולים, כלבים, דובים, כלבי ים, סמורים וקרוביהם.'),
  caniformia: g(
    'Caniforms, the dog-like carnivores: dogs, bears, seals, weasels and raccoons.',
    'טורפים דמויי כלב: כלבים, דובים, כלבי ים, סמורים ודביבונים.'),
  arctoidea: g(
    'Bears, seals, weasels and raccoons: the dog-like carnivores, minus the dogs.',
    'דובים, כלבי ים, סמורים ודביבונים: הטורפים דמויי הכלב, בלי הכלבים.'),
  musteloidea: g(
    "The raccoon family and the weasel family, which includes otters and badgers, are each other's closest kin.",
    'משפחת הדביבונים ומשפחת הסמוריים, שכוללת לוטרות וגיריות, הן הקרובות ביותר זו לזו.'),
  artiodactyla: g(
    'Even-toed hoofed mammals: camels, pigs, cows, deer, giraffes and hippos, and the whales that came from them.',
    "בעלי פרסות עם מספר זוגי של אצבעות: גמלים, חזירים, פרות, צבאים, ג'ירפות והיפופוטמים, והלווייתנים שהתפתחו מהם."),
  artiofabula: g(
    'Pigs, ruminants, hippos and whales: the even-toed mammals left after the camels branched off.',
    'חזירים, מעלי גירה, היפופוטמים ולווייתנים: בעלי הפרסות הזוגיות שנשארו אחרי שהגמלים התפצלו.'),
  cetruminantia: g(
    'Ruminants and the whale-hippo branch: cows, deer and giraffes on one side, hippos and whales on the other.',
    "מעלי הגירה וענף הלווייתן וההיפופוטם: פרות, צבאים וג'ירפות מצד אחד, היפופוטמים ולווייתנים מהצד השני."),
  whippomorpha: g(
    'Hippos, whales and dolphins: whales grew out of this branch of hoofed mammals.',
    'היפופוטמים, לווייתנים ודולפינים: הלווייתנים צמחו מהענף הזה של בעלי הפרסות.'),
  pecora: g(
    'Ruminants with horns or antlers: cows, sheep, goats, deer and giraffes.',
    "מעלי גירה עם קרניים: פרות, כבשים, עיזים, צבאים וג'ירפות."),
  perissodactyla: g(
    'Odd-toed hoofed mammals: horses, rhinos and tapirs.',
    'בעלי פרסות עם מספר אי־זוגי של אצבעות: סוסים, קרנפים וטפירים.'),

  mesangiospermae: g(
    'Nearly all flowering plants: monocots like grasses and lilies, and eudicots like roses and daisies.',
    'כמעט כל הצמחים הפורחים: חד־פסיגיים כמו דגניים ושושנים, ודו־פסיגיים כמו ורדים וחינניות.'),
  monocots_lilies_grasses: g(
    'Monocots: flowering plants with one seed leaf, like lilies, tulips, orchids, palms, bananas and grasses.',
    'חד־פסיגיים: צמחים פורחים עם עלה פסיג אחד, כמו שושנים, צבעונים, סחלבים, דקלים, בננות ודגניים.'),
  commelinids: g(
    'Commelinids: the monocot branch of palms, bananas, ginger, pineapples and grasses.',
    'ענף של החד־פסיגיים: דקלים, בננות, זנגביל, אננס ודגניים.'),
  poaceae: g(
    'Grasses: rice, corn, wheat, bamboo and the grass on a lawn.',
    'דגניים: אורז, תירס, חיטה, במבוק ועשב המדשאה.'),
  pentapetalae: g(
    'Core eudicots: most flowering plants, from roses and apples to tomatoes and daisies.',
    'רוב הצמחים הדו־פסיגיים: מוורדים ותפוחים ועד עגבניות וחינניות.'),
  rosids: g(
    'Rosids: grapes, roses, apples, gourds, citrus, maples and cocoa all sit on this branch.',
    'ענף גדול של צמחים: גפנים, ורדים, תפוחים, דלועים, הדרים, אדרים וקקאו.'),
  eurosids: g(
    'Apples, roses and gourds on one side, citrus, maples and cocoa on the other: the rosids after the grapes branched off.',
    'תפוחים, ורדים ודלועים מצד אחד, הדרים, אדרים וקקאו מהצד השני: הענף שנשאר אחרי שהגפן התפצלה.'),
  sapindales: g(
    'One order of plants: citrus, maples, mangoes, cashews and lychees.',
    "סדרה אחת של צמחים: הדרים, אדרים, מנגו, קשיו וליצ'י."),
  rosoideae: g(
    'The rose subfamily: roses, strawberries and raspberries.',
    'תת־משפחת הוורד: ורדים, תותים ופטל.'),
  prunus: g(
    'One genus, Prunus: cherries, peaches, plums, apricots and almonds.',
    'סוג אחד, פרונוס: דובדבנים, אפרסקים, שזיפים, משמשים ושקדים.'),
  benincaseae: g(
    'The melon branch of the gourd family: cucumbers, melons and watermelons.',
    'ענף המלונים במשפחת הדלועיים: מלפפונים, מלונים ואבטיחים.'),
  ericales: g(
    'One order of plants, Ericales: kiwifruit, blueberries, tea and persimmons.',
    'סדרה אחת של צמחים: קיווי, אוכמניות, תה ואפרסמון.'),
  lamiids: g(
    'Lamiids: coffee, tomatoes, potatoes, mint and olives sit on this branch.',
    'ענף של צמחים שכולל קפה, עגבניות, תפוחי אדמה, נענע וזיתים.'),
  solanum_eggplant: g(
    'One genus, Solanum: eggplants, tomatoes and potatoes.',
    'סוג אחד, סולנום: חצילים, עגבניות ותפוחי אדמה.'),
  solanum_tomato_potato: g(
    'Tomatoes and potatoes are sister lines inside the genus Solanum.',
    'העגבנייה ותפוח האדמה הם שושלות אחיות בתוך הסוג סולנום.'),
  asteraceae: g(
    'The daisy family: sunflowers, daisies, lettuce, dandelions and artichokes.',
    'משפחת המורכבים: חמניות, חינניות, חסה, שן הארי וארטישוק.'),
};
