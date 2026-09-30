// ══════════════════════════════════════════════════════
// KIN — THE ANSWER KEY
//
// A small, curated family tree of every creature the game can ask about.
// Every answer in Kin is derived from this shape, never typed by hand: a
// question "is A closer to B or to C?" is only valid if A and B meet at a
// node strictly inside the node where A meets C. The engine checks that for
// every question, and the unit tests fail the build if one ever stops being
// true.
//
// **Only uncontested branching is resolved.** Where biologists still
// disagree about the order of splits — the placement of bats among the
// hoofed mammals and carnivores, the relationships inside Neoaves, the
// three arctoid families — the node is left as a polytomy. A question can
// still be asked across such a node, because its answer does not depend on
// the disputed order; it cannot be asked *inside* one.
//
// **Dates belong to nodes, not to questions.** A split time is the age of
// the node where two lineages meet, so every question that crosses a node
// shows the same number, and an ancestor is always older than its
// descendants (tested). Ages come from openly citable publications; see
// js/kin/dates.js. TimeTree (timetree.org) was used only to cross-check —
// its terms forbid redistributing its data.
// ══════════════════════════════════════════════════════

const n = (id, ...kids) => ({ id, kids });

/* Leaves are creature ids from js/kin/creatures.js. Internal ids are the
   keys of NODE_DATES; a node with no entry there is never the meeting point
   of a published question, which the tests also enforce. */
export const TREE =
n('eukaryota',
  n('opisthokonta',
    n('planulozoa',
      n('cnidaria', 'jellyfish', 'coral'),
      n('bilateria',
        n('protostomia',
          n('arthropoda',
            n('arachnopulmonata', 'spider', 'scorpion'),
            n('pancrustacea',
              n('reptantia', 'lobster', 'crab'),
              n('holometabola',
                n('hymenoptera', 'bee', 'ant'),
                n('mecopterida', 'butterfly', n('diptera', 'mosquito', 'fly'))))),
          n('mollusca', 'octopus', 'snail')),
        n('gnathostomata', 'shark',
          n('osteichthyes', 'salmon',
            n('tetrapoda', 'frog',
              n('amniota',
                n('theria',
                  n('diprotodontia', 'koala', 'kangaroo'),
                  /* Which came first at the placental root — the sloth's
                     xenarthrans, the elephant's afrotherians, or neither — is
                     still argued over. */
                  n('placentalia', 'sloth',
                    n('elephantidae', 'elephant', 'mammoth'),
                    n('boreoeutheria',
                      n('euarchontoglires',
                        n('glires', 'rabbit',
                          n('rodentia', 'squirrel',
                            n('mouse_related', 'beaver',
                              n('muroidea', 'hamster', n('murinae', 'mouse', 'rat'))))),
                        n('catarrhini', 'monkey',
                          n('hominidae', 'orangutan', n('homininae', 'gorilla', 'you')))),
                      n('laurasiatheria', 'hedgehog',
                        /* Bats, carnivores, odd-toed and even-toed hoofed mammals:
                           the order of these four is still argued over. */
                        n('scrotifera', 'bat',
                          n('carnivora',
                            n('felidae', 'cat', n('panthera', 'lion', 'tiger')),
                            n('caniformia',
                              n('canidae', 'dog', 'fox'),
                              n('arctoidea', n('ursidae', 'bear', 'panda'), 'seal',
                                n('musteloidea', 'skunk',
                                  n('procyonids_mustelids', 'raccoon', n('mustelidae', 'otter', 'badger')))))),
                          n('perissodactyla', 'rhino',
                            n('equus', 'horse', n('asses_zebras', 'donkey', 'zebra'))),
                          n('artiodactyla',
                            n('camelidae', 'camel', 'llama'),
                            n('artiofabula', 'pig',
                              n('cetruminantia',
                                /* Giraffes, deer and the cattle family: the order
                                   of the three is argued over. */
                                n('pecora', 'giraffe', 'deer',
                                  n('bovidae', 'cow', n('caprinae', 'sheep', 'goat'))),
                                n('whippomorpha', 'hippo', n('cetacea', 'whale', 'dolphin')))))))))),
                n('sauria',
                  n('squamata', 'gecko', 'snake'),
                  n('archelosauria', 'turtle',
                    n('archosauria', 'croc',
                      n('dinosauria', 'sauropod',
                        n('tyrannoraptora', 'trex',
                          n('neognathae',
                            n('galloanserae',
                              n('core_phasianids', 'chicken', 'turkey', 'peacock'),
                              n('anatidae', 'duck', 'swan')),
                            /* The Neoaves radiation was fast and its order is unsettled. */
                            n('neoaves', 'flamingo', n('columbidae', 'pigeon', 'dodo'),
                              'penguin', 'eagle', 'parrot', 'owl'))))))))))))),
    'mushroom'),
  n('spermatophyta', 'pine',
    /* Where magnoliids like the avocado sit, against monocots and eudicots,
       is unsettled. */
    n('mesangiospermae', 'avocado',
      n('monocots_lilies_grasses', 'tulip',
        n('commelinids', 'palm', n('zingiberales', 'banana', 'ginger'),
          n('poales', 'pineapple', n('poaceae', 'rice', 'corn', 'bamboo')))),
      /* Cacti were grouped with the asterids as "superasterids"; Open Tree
         does not agree, so the three are left side by side. */
      n('pentapetalae', 'cactus',
        n('rosids', 'grape',
          n('eurosids',
            /* The four orders of the nitrogen-fixing clade: their order is
               argued over. */
            n('nfc',
              n('papilionoideae', 'pea', 'peanut'),
              n('rosaceae',
                n('rosoideae', 'rose', 'strawberry'),
                n('amygdaloideae', 'apple', n('prunus', 'cherry', 'peach'))),
              n('benincaseae', n('cucumis', 'cucumber', 'melon'), 'watermelon'),
              'chestnut'),
            n('malvids',
              /* Citrus, maples and mangoes: which two are closest is argued
                 over. Orange and lemon are both hybrids, so no question asks
                 how close they are to each other; their node stays undated. */
              n('sapindales', 'maple', 'mango', n('citrus', 'orange', 'lemon')),
              n('brassicales_malvales', 'broccoli', n('malvaceae', 'choc', 'hibiscus'))))),
        n('asterids',
          n('ericales', 'kiwi', 'blueberry'),
          n('euasterids',
            n('lamiids', 'coffee', 'olive',
              n('solanales', 'sweetpotato',
                n('solanaceae', 'chili',
                  n('solanum_eggplant', 'eggplant', n('solanum_tomato_potato', 'tomato', 'potato'))))),
            n('campanulids', 'carrot',
              n('asteraceae', 'lettuce', n('asteroideae', 'sunflower', 'daisy')))))))));
