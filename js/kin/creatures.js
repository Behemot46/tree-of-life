// ══════════════════════════════════════════════════════
// KIN — THE CREATURES
//
// Every leaf of js/kin/tree.js. Emoji stand in for the site's photographs
// and silhouettes in this test build: they need no credit line, load
// instantly, and read at a glance at any size. Photographs arrive with
// their credits in phase 2.
//
// Sentences are assembled from parts, so each language carries the forms
// its grammar needs:
//   en.n    name on the card        en.p   plural, used in "Whales and hippos…"
//   en.the  "the hippo" in "Yes, the hippo."
//   he.n    name on the card        he.def definite form, "ההיפופוטם"
//   he.le   with the preposition ל, "להיפופוטם", in "ללווייתן ולהיפופוטם היה…"
// `k` is the kingdom, which colours the dot on the card.
//
// Hebrew "you" is gendered, so the human card reads אנחנו ("us") in Hebrew.
// ══════════════════════════════════════════════════════

const c = (e, k, en, he) => ({ e, k, en, he });
const en = (n, p, the) => ({ n, p, the });
const he = (n, def, le) => ({ n, def, le });

export const CREATURES = {
  you:        c('🧑', 'animal', en('You', 'you', 'you'), he('אנחנו', 'אנחנו', 'לנו')),
  gorilla:    c('🦍', 'animal', en('Gorilla', 'gorillas', 'the gorilla'), he('גורילה', 'הגורילה', 'לגורילה')),
  orangutan:  c('🦧', 'animal', en('Orangutan', 'orangutans', 'the orangutan'), he('אורנגאוטן', 'האורנגאוטן', 'לאורנגאוטן')),
  mouse:      c('🐁', 'animal', en('Mouse', 'mice', 'the mouse'), he('עכבר', 'העכבר', 'לעכבר')),
  hamster:    c('🐹', 'animal', en('Hamster', 'hamsters', 'the hamster'), he('אוגר', 'האוגר', 'לאוגר')),
  rabbit:     c('🐇', 'animal', en('Rabbit', 'rabbits', 'the rabbit'), he('ארנב', 'הארנב', 'לארנב')),
  hedgehog:   c('🦔', 'animal', en('Hedgehog', 'hedgehogs', 'the hedgehog'), he('קיפוד', 'הקיפוד', 'לקיפוד')),
  bat:        c('🦇', 'animal', en('Bat', 'bats', 'the bat'), he('עטלף', 'העטלף', 'לעטלף')),
  cat:        c('🐈', 'animal', en('Cat', 'cats', 'the cat'), he('חתול', 'החתול', 'לחתול')),
  dog:        c('🐕', 'animal', en('Dog', 'dogs', 'the dog'), he('כלב', 'הכלב', 'לכלב')),
  bear:       c('🐻', 'animal', en('Bear', 'bears', 'the bear'), he('דוב', 'הדוב', 'לדוב')),
  seal:       c('🦭', 'animal', en('Seal', 'seals', 'the seal'), he('כלב ים', 'כלב הים', 'לכלב הים')),
  raccoon:    c('🦝', 'animal', en('Raccoon', 'raccoons', 'the raccoon'), he('דביבון', 'הדביבון', 'לדביבון')),
  otter:      c('🦦', 'animal', en('Otter', 'otters', 'the otter'), he('לוטרה', 'הלוטרה', 'ללוטרה')),
  horse:      c('🐎', 'animal', en('Horse', 'horses', 'the horse'), he('סוס', 'הסוס', 'לסוס')),
  rhino:      c('🦏', 'animal', en('Rhino', 'rhinos', 'the rhino'), he('קרנף', 'הקרנף', 'לקרנף')),
  camel:      c('🐪', 'animal', en('Camel', 'camels', 'the camel'), he('גמל', 'הגמל', 'לגמל')),
  pig:        c('🐖', 'animal', en('Pig', 'pigs', 'the pig'), he('חזיר', 'החזיר', 'לחזיר')),
  giraffe:    c('🦒', 'animal', en('Giraffe', 'giraffes', 'the giraffe'), he("ג'ירפה", "הג'ירפה", "לג'ירפה")),
  cow:        c('🐄', 'animal', en('Cow', 'cows', 'the cow'), he('פרה', 'הפרה', 'לפרה')),
  hippo:      c('🦛', 'animal', en('Hippo', 'hippos', 'the hippo'), he('היפופוטם', 'ההיפופוטם', 'להיפופוטם')),
  whale:      c('🐳', 'animal', en('Whale', 'whales', 'the whale'), he('לווייתן', 'הלווייתן', 'ללווייתן')),
  dolphin:    c('🐬', 'animal', en('Dolphin', 'dolphins', 'the dolphin'), he('דולפין', 'הדולפין', 'לדולפין')),
  elephant:   c('🐘', 'animal', en('Elephant', 'elephants', 'the elephant'), he('פיל', 'הפיל', 'לפיל')),
  mammoth:    c('🦣', 'animal', en('Mammoth', 'mammoths', 'the mammoth'), he('ממותה', 'הממותה', 'לממותה')),
  koala:      c('🐨', 'animal', en('Koala', 'koalas', 'the koala'), he('קואלה', 'הקואלה', 'לקואלה')),
  kangaroo:   c('🦘', 'animal', en('Kangaroo', 'kangaroos', 'the kangaroo'), he('קנגורו', 'הקנגורו', 'לקנגורו')),
  chicken:    c('🐔', 'animal', en('Chicken', 'chickens', 'the chicken'), he('תרנגולת', 'התרנגולת', 'לתרנגולת')),
  duck:       c('🦆', 'animal', en('Duck', 'ducks', 'the duck'), he('ברווז', 'הברווז', 'לברווז')),
  flamingo:   c('🦩', 'animal', en('Flamingo', 'flamingos', 'the flamingo'), he('פלמינגו', 'הפלמינגו', 'לפלמינגו')),
  pigeon:     c('🕊️', 'animal', en('Pigeon', 'pigeons', 'the pigeon'), he('יונה', 'היונה', 'ליונה')),
  penguin:    c('🐧', 'animal', en('Penguin', 'penguins', 'the penguin'), he('פינגווין', 'הפינגווין', 'לפינגווין')),
  eagle:      c('🦅', 'animal', en('Eagle', 'eagles', 'the eagle'), he('עיט', 'העיט', 'לעיט')),
  trex:       c('🦖', 'animal', en('T. rex', 'T. rex', 'T. rex'), he('טירנוזאורוס', 'הטירנוזאורוס', 'לטירנוזאורוס')),
  croc:       c('🐊', 'animal', en('Crocodile', 'crocodiles', 'the crocodile'), he('תנין', 'התנין', 'לתנין')),
  turtle:     c('🐢', 'animal', en('Turtle', 'turtles', 'the turtle'), he('צב', 'הצב', 'לצב')),
  gecko:      c('🦎', 'animal', en('Gecko', 'geckos', 'the gecko'), he('שממית', 'השממית', 'לשממית')),
  snake:      c('🐍', 'animal', en('Snake', 'snakes', 'the snake'), he('נחש', 'הנחש', 'לנחש')),
  frog:       c('🐸', 'animal', en('Frog', 'frogs', 'the frog'), he('צפרדע', 'הצפרדע', 'לצפרדע')),
  salmon:     c('🐟', 'animal', en('Salmon', 'salmon', 'the salmon'), he('סלמון', 'הסלמון', 'לסלמון')),
  shark:      c('🦈', 'animal', en('Shark', 'sharks', 'the shark'), he('כריש', 'הכריש', 'לכריש')),
  octopus:    c('🐙', 'animal', en('Octopus', 'octopuses', 'the octopus'), he('תמנון', 'התמנון', 'לתמנון')),
  snail:      c('🐌', 'animal', en('Snail', 'snails', 'the snail'), he('חילזון', 'החילזון', 'לחילזון')),
  lobster:    c('🦞', 'animal', en('Lobster', 'lobsters', 'the lobster'), he('לובסטר', 'הלובסטר', 'ללובסטר')),
  crab:       c('🦀', 'animal', en('Crab', 'crabs', 'the crab'), he('סרטן', 'הסרטן', 'לסרטן')),
  bee:        c('🐝', 'animal', en('Bee', 'bees', 'the bee'), he('דבורה', 'הדבורה', 'לדבורה')),
  ant:        c('🐜', 'animal', en('Ant', 'ants', 'the ant'), he('נמלה', 'הנמלה', 'לנמלה')),
  butterfly:  c('🦋', 'animal', en('Butterfly', 'butterflies', 'the butterfly'), he('פרפר', 'הפרפר', 'לפרפר')),
  mosquito:   c('🦟', 'animal', en('Mosquito', 'mosquitoes', 'the mosquito'), he('יתוש', 'היתוש', 'ליתוש')),
  fly:        c('🪰', 'animal', en('Fly', 'flies', 'the fly'), he('זבוב', 'הזבוב', 'לזבוב')),
  spider:     c('🕷️', 'animal', en('Spider', 'spiders', 'the spider'), he('עכביש', 'העכביש', 'לעכביש')),
  scorpion:   c('🦂', 'animal', en('Scorpion', 'scorpions', 'the scorpion'), he('עקרב', 'העקרב', 'לעקרב')),
  mushroom:   c('🍄', 'fungus', en('Mushroom', 'mushrooms', 'the mushroom'), he('פטרייה', 'הפטרייה', 'לפטרייה')),
  daisy:      c('🌼', 'plant', en('Daisy', 'daisies', 'the daisy'), he('חיננית', 'החיננית', 'לחיננית')),
  sunflower:  c('🌻', 'plant', en('Sunflower', 'sunflowers', 'the sunflower'), he('חמנייה', 'החמנייה', 'לחמנייה')),
  lettuce:    c('🥬', 'plant', en('Lettuce', 'lettuce', 'lettuce'), he('חסה', 'החסה', 'לחסה')),
  coffee:     c('☕', 'plant', en('Coffee', 'coffee plants', 'coffee'), he('קפה', 'הקפה', 'לקפה')),
  tomato:     c('🍅', 'plant', en('Tomato', 'tomatoes', 'the tomato'), he('עגבנייה', 'העגבנייה', 'לעגבנייה')),
  potato:     c('🥔', 'plant', en('Potato', 'potatoes', 'the potato'), he('תפוח אדמה', 'תפוח האדמה', 'לתפוח האדמה')),
  eggplant:   c('🍆', 'plant', en('Eggplant', 'eggplants', 'the eggplant'), he('חציל', 'החציל', 'לחציל')),
  kiwi:       c('🥝', 'plant', en('Kiwifruit', 'kiwifruit', 'the kiwifruit'), he('קיווי', 'הקיווי', 'לקיווי')),
  blueberry:  c('🫐', 'plant', en('Blueberry', 'blueberries', 'the blueberry'), he('אוכמנית', 'האוכמנית', 'לאוכמנית')),
  cactus:     c('🌵', 'plant', en('Cactus', 'cacti', 'the cactus'), he('קקטוס', 'הקקטוס', 'לקקטוס')),
  rose:       c('🌹', 'plant', en('Rose', 'roses', 'the rose'), he('ורד', 'הוורד', 'לוורד')),
  strawberry: c('🍓', 'plant', en('Strawberry', 'strawberries', 'the strawberry'), he('תות', 'התות', 'לתות')),
  apple:      c('🍎', 'plant', en('Apple', 'apples', 'the apple'), he('תפוח', 'התפוח', 'לתפוח')),
  cherry:     c('🍒', 'plant', en('Cherry', 'cherries', 'the cherry'), he('דובדבן', 'הדובדבן', 'לדובדבן')),
  peach:      c('🍑', 'plant', en('Peach', 'peaches', 'the peach'), he('אפרסק', 'האפרסק', 'לאפרסק')),
  cucumber:   c('🥒', 'plant', en('Cucumber', 'cucumbers', 'the cucumber'), he('מלפפון', 'המלפפון', 'למלפפון')),
  watermelon: c('🍉', 'plant', en('Watermelon', 'watermelons', 'the watermelon'), he('אבטיח', 'האבטיח', 'לאבטיח')),
  orange:     c('🍊', 'plant', en('Orange', 'oranges', 'the orange'), he('תפוז', 'התפוז', 'לתפוז')),
  maple:      c('🍁', 'plant', en('Maple', 'maples', 'the maple'), he('אדר', 'האדר', 'לאדר')),
  choc:       c('🍫', 'plant', en('Chocolate', 'cocoa trees', 'chocolate'), he('שוקולד', 'השוקולד', 'לשוקולד')),
  grape:      c('🍇', 'plant', en('Grapes', 'grapes', 'the grape'), he('ענבים', 'הענבים', 'לענבים')),
  tulip:      c('🌷', 'plant', en('Tulip', 'tulips', 'the tulip'), he('צבעוני', 'הצבעוני', 'לצבעוני')),
  palm:       c('🌴', 'plant', en('Palm', 'palms', 'the palm'), he('דקל', 'הדקל', 'לדקל')),
  banana:     c('🍌', 'plant', en('Banana', 'bananas', 'the banana'), he('בננה', 'הבננה', 'לבננה')),
  pineapple:  c('🍍', 'plant', en('Pineapple', 'pineapples', 'the pineapple'), he('אננס', 'האננס', 'לאננס')),
  rice:       c('🌾', 'plant', en('Rice', 'rice', 'rice'), he('אורז', 'האורז', 'לאורז')),
  corn:       c('🌽', 'plant', en('Corn', 'corn', 'corn'), he('תירס', 'התירס', 'לתירס')),
};
