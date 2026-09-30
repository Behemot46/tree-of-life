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
                n('placentalia',
                  n('elephantidae', 'elephant', 'mammoth'),
                  n('boreoeutheria',
                    n('euarchontoglires',
                      n('glires', 'rabbit', n('muroidea', 'mouse', 'hamster')),
                      n('hominidae', 'orangutan', n('homininae', 'gorilla', 'you'))),
                    n('laurasiatheria', 'hedgehog',
                      /* Bats, carnivores, odd-toed and even-toed hoofed mammals:
                         the order of these four is still argued over. */
                      n('scrotifera', 'bat',
                        n('carnivora', 'cat',
                          n('caniformia', 'dog',
                            n('arctoidea', 'bear', 'seal', n('musteloidea', 'raccoon', 'otter')))),
                        n('perissodactyla', 'horse', 'rhino'),
                        n('artiodactyla', 'camel',
                          n('artiofabula', 'pig',
                            n('cetruminantia',
                              n('pecora', 'giraffe', 'cow'),
                              n('whippomorpha', 'hippo', n('cetacea', 'whale', 'dolphin')))))))))),
              n('sauria',
                n('squamata', 'gecko', 'snake'),
                n('archelosauria', 'turtle',
                  n('archosauria', 'croc',
                    n('tyrannoraptora', 'trex',
                      n('neognathae',
                        n('galloanserae', 'chicken', 'duck'),
                        /* The Neoaves radiation was fast and its order is unsettled. */
                        n('neoaves', 'flamingo', 'pigeon', 'penguin', 'eagle'))))))))))),
    'mushroom'),
  n('mesangiospermae',
    n('monocots_lilies_grasses', 'tulip',
      n('commelinids', 'palm', 'banana', n('poales', 'pineapple', n('poaceae', 'rice', 'corn')))),
    n('pentapetalae',
      n('rosids', 'grape',
        n('eurosids',
          n('fabids',
            n('rosaceae',
              n('rosoideae', 'rose', 'strawberry'),
              n('amygdaloideae', 'apple', n('prunus', 'cherry', 'peach'))),
            n('benincaseae', 'cucumber', 'watermelon')),
          n('malvids', n('sapindales', 'orange', 'maple'), 'choc'))),
      n('superasterids', 'cactus',
        n('asterids',
          n('ericales', 'kiwi', 'blueberry'),
          n('euasterids',
            n('lamiids', 'coffee',
              n('solanum_eggplant', 'eggplant', n('solanum_tomato_potato', 'tomato', 'potato'))),
            n('asteraceae', 'lettuce', n('asteroideae', 'sunflower', 'daisy'))))))));
