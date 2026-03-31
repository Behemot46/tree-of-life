// ══════════════════════════════════════════════════════
// SPECIES DATA — enrichment, photos, wiki mappings
// ══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
// SPECIES ENRICHMENT — alt facts + educational links
// ══════════════════════════════════════════════════════
const ENRICHMENT = {
  'luca': {
    altFacts:[
      'LUCA likely lived in hydrothermal vents 3.8–4 billion years ago, where chemical energy replaced sunlight.',
      'By analyzing 355 universally conserved genes, scientists in 2016 reconstructed LUCA\'s likely metabolism — it consumed hydrogen and CO₂ and exhaled methane.',
      'LUCA already had DNA, ribosomes, and a genetic code almost identical to the one used by every living cell today.',
      'The last universal common ancestor of all life was probably anaerobic — it lived before oxygen became common in Earth\'s atmosphere.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Last_universal_common_ancestor'},
      {label:'HHMI BioInteractive', url:'https://www.biointeractive.org/classroom-resources/origin-life'},
      {label:'Nature paper (2016)', url:'https://www.nature.com/articles/nmicrobiol201648'},
    ]
  },
  'bacteria': {
    altFacts:[
      'There are more bacteria in one gram of healthy soil than there are humans who have ever lived on Earth.',
      'Bacteria collectively outweigh all animals on Earth combined — by a factor of roughly 35.',
      'The human gut contains ~38 trillion bacterial cells — slightly more than the total number of human cells in the body.',
      'Some bacteria can survive in pure bleach, inside nuclear reactors, and in the vacuum of space.',
      'Bacteria can share genes horizontally — directly between cells — allowing antibiotic resistance to spread across entire ecosystems within days.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Bacteria'},
      {label:'Khan Academy', url:'https://www.khanacademy.org/science/ap-biology/natural-selection/Hardy-Weinberg/a/bacteria'},
      {label:'Microbiology Society', url:'https://microbiologysociety.org/why-microbiology-matters/what-is-microbiology/bacteria.html'},
    ]
  },
  'cyanobacteria': {
    altFacts:[
      'Cyanobacteria caused the Great Oxidation Event ~2.4 billion years ago — essentially poisoning most life on Earth at the time with their oxygen byproduct.',
      'The chloroplasts inside every plant cell are the direct descendants of cyanobacteria that were engulfed and enslaved by a eukaryote ~1.5 billion years ago.',
      'Some cyanobacteria can fix atmospheric nitrogen AND photosynthesize — doing the work of two separate kingdoms simultaneously.',
      'Spirulina, sold as a health supplement, is a cyanobacterium — making it one of the oldest foods humans deliberately consume.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Cyanobacteria'},
      {label:'NOAA Ocean Facts', url:'https://oceanservice.noaa.gov/facts/cyanobacteria.html'},
      {label:'Smithsonian Ocean', url:'https://ocean.si.edu/ocean-life/microbes/cyanobacteria'},
    ]
  },
  'ecoli': {
    altFacts:[
      'E. coli reproduces every 20 minutes under ideal conditions — a single cell could theoretically produce a mass exceeding Earth\'s weight in two days.',
      'The E. coli genome was the first complex organism genome sequenced, in 1997, and remains the most studied organism in biology.',
      'E. coli has been engineered to produce human insulin (saving millions of diabetics), biofuels, and even spider silk proteins.',
      'Most E. coli strains are harmless and essential — the dangerous pathogenic strains like O157:H7 are rare mutants.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Escherichia_coli'},
      {label:'CDC factsheet', url:'https://www.cdc.gov/ecoli/index.html'},
      {label:'NCBI Gene', url:'https://www.ncbi.nlm.nih.gov/genome/?term=escherichia+coli'},
    ]
  },
  'helicobacter': {
    altFacts:[
      'H. pylori infects ~50% of all living humans — making it one of the most successful pathogens in history, co-evolving with us for at least 100,000 years.',
      'Barry Marshall won the 2005 Nobel Prize after drinking a culture of H. pylori to prove it caused ulcers — and then curing himself with antibiotics.',
      'H. pylori has a unique spiral shape and produces urease, which converts urea to ammonia, neutralizing stomach acid to survive.',
      'Some research suggests H. pylori infections may protect against allergies and asthma — its disappearance may be contributing to rising rates of these conditions.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Helicobacter_pylori'},
      {label:'CDC H. pylori', url:'https://www.cdc.gov/ulcer/index.htm'},
      {label:'Nobel Prize story', url:'https://www.nobelprize.org/prizes/medicine/2005/press-release/'},
    ]
  },
  'archaea': {
    altFacts:[
      'Archaea were only recognized as a separate domain of life in 1977 — before that, they were lumped with bacteria.',
      'Archaea produce all the methane generated by cows, wetlands, and landfills — making them significant actors in climate change.',
      'Some archaea thrive at 121°C (250°F) — hotter than boiling water — inside deep-sea hydrothermal vents.',
      'Genetic evidence suggests eukaryotes (including us) actually evolved FROM archaea — making archaea our closest prokaryotic relatives.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Archaea'},
      {label:'Tree of Life Web', url:'http://tolweb.org/Archaea/2'},
      {label:'Nature Microbiology', url:'https://www.nature.com/subjects/archaea'},
    ]
  },
  'halobacterium': {
    altFacts:[
      'Halobacterium uses bacteriorhodopsin — a light-driven proton pump — to generate energy from sunlight without chlorophyll, a completely independent invention of photosynthesis.',
      'It thrives in salt concentrations that would kill virtually any other organism, including the Dead Sea.',
      'Halobacterium colonies turn salt flats and salt lakes pink or red — the color comes from carotenoid pigments in the cells.',
      'NASA has studied Halobacterium as a model for potential life on Mars, which may once have had high-salt environments.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Halobacterium'},
      {label:'Astrobiology NASA', url:'https://astrobiology.nasa.gov/news/extreme-life/'},
    ]
  },
  'fungi': {
    altFacts:[
      'Fungi are more closely related to animals than to plants — the animal-fungi split occurred ~1 billion years ago.',
      'The largest living organism on Earth by area is a honey fungus (Armillaria) in Oregon\'s Blue Mountains, covering 9.65 km² and estimated to be 8,000 years old.',
      'Fungi were essential to the colonization of land by plants — mycorrhizal networks helped the first plants absorb nutrients from barren rock.',
      'Penicillin, statins, cyclosporin (preventing organ rejection), and LSD all come from fungi.',
      'Some fungi can "hear" vibrations and respond to sound — they grow faster when exposed to certain frequencies.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Fungus'},
      {label:'Merlin Sheldrake (Entangled Life)', url:'https://www.merlinsheldrake.com/entangled-life'},
      {label:'MycoWeb', url:'http://www.mykoweb.com/'},
    ]
  },
  'amanita-muscaria': {
    altFacts:[
      'Amanita muscaria is the iconic red-and-white toadstool of fairy tales, and contains ibotenic acid and muscimol — psychoactive compounds, not psilocybin.',
      'Reindeer in Siberia actively seek out fly agaric mushrooms and eat them — shamans in Siberia reportedly consumed the mushrooms (or reindeer urine) for ritual purposes.',
      'Despite its reputation, Amanita muscaria rarely kills — but Amanita phalloides (the death cap) causes ~90% of fatal mushroom poisonings worldwide.',
      'The fly agaric forms mycorrhizal partnerships with birch and pine trees and is considered essential to the health of boreal forests.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Amanita_muscaria'},
      {label:'First Nature fungi guide', url:'https://www.first-nature.com/fungi/amanita-muscaria.php'},
    ]
  },
  'saccharomyces': {
    altFacts:[
      'Saccharomyces cerevisiae (baker\'s yeast) has been serving humanity for at least 6,000 years — found in ancient Egyptian bread and wine residues.',
      'It was the first eukaryote to have its entire genome sequenced, in 1996.',
      'Yeast cells are used as model organisms to study cancer, aging, and Parkinson\'s disease because ~30% of yeast genes have human equivalents.',
      'A single yeast cell produces CO₂ and ethanol through fermentation — the basis of every beer, wine, and sourdough bread ever made.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Saccharomyces_cerevisiae'},
      {label:'SGD (Saccharomyces Genome Database)', url:'https://www.yeastgenome.org/'},
    ]
  },
  'viridiplantae': {
    altFacts:[
      'Plants colonized land approximately 470 million years ago, fundamentally transforming Earth\'s atmosphere and climate.',
      'The first land plants descended from freshwater green algae — their closest living relatives are the Charophytes.',
      'Plants produce ~50% of Earth\'s atmospheric oxygen through photosynthesis, even though phytoplankton produce the other ~50%.',
      'The "wood wide web" — mycorrhizal networks connecting tree roots — allows trees to exchange sugars and chemical warning signals across entire forests.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Viridiplantae'},
      {label:'PLANTS Database (USDA)', url:'https://plants.usda.gov/'},
      {label:'Kew Gardens', url:'https://www.kew.org/science/our-science/science-priorities/plants-fungi'},
    ]
  },
  'sunflower': {
    altFacts:[
      'A sunflower head is not a single flower — it is a composite of up to 2,000 tiny individual florets arranged in Fibonacci spirals.',
      'Young sunflowers track the sun from east to west each day (heliotropism) through differential stem growth — mature flowers face east permanently.',
      'Sunflowers were cultivated by Native Americans at least 4,000 years ago, making them one of the few crops domesticated in North America.',
      'Sunflowers were planted around Chernobyl after the 1986 disaster — they absorb radioactive cesium and strontium from soil through phytoremediation.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Helianthus_annuus'},
      {label:'Britannica', url:'https://www.britannica.com/plant/common-sunflower'},
    ]
  },
  'sequoia': {
    altFacts:[
      'General Sherman, a giant sequoia in California, is the largest known living tree by volume at 1,487 m³ — its largest branch alone is bigger than most trees.',
      'Giant sequoias require fire to reproduce — heat from wildfires opens their cones and clears the forest floor for seedlings.',
      'A giant sequoia can live over 3,000 years, grow to 115 meters, and weigh 1,400 tonnes.',
      'Sequoia bark can be 90 cm thick — a natural fireproof armor that protects them from most wildfires.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Sequoiadendron_giganteum'},
      {label:'National Park Service', url:'https://www.nps.gov/seki/learn/nature/bigtrees.htm'},
    ]
  },
  'welwitschia': {
    altFacts:[
      'Welwitschia has only two leaves — ever. They grow continuously from the base while the tips fray and split, creating the appearance of many leaves.',
      'Individual plants are estimated to live over 2,000 years, making them among the oldest living organisms on Earth.',
      'It only grows in the Namib Desert in Namibia and Angola — one of the driest places on Earth — collecting moisture from coastal fog.',
      'Charles Darwin called it "the most wonderful plant in the world" after seeing specimens for the first time.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Welwitschia'},
      {label:'Kew Gardens', url:'https://www.kew.org/plants/welwitschia'},
    ]
  },
  'rafflesia': {
    altFacts:[
      'Rafflesia arnoldii produces the largest individual flower in the world — up to 1 meter in diameter and weighing up to 11 kg.',
      'It has no roots, stems, or leaves — it exists entirely as a parasite inside the tissues of its host vine (Tetrastigma).',
      'Rafflesia flowers smell like rotting flesh to attract carrion flies that pollinate them.',
      'A Rafflesia flower takes 9–12 months to develop and blooms for only 5–7 days.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Rafflesia_arnoldii'},
      {label:'Kew Gardens', url:'https://www.kew.org/plants/rafflesia'},
    ]
  },
  'metazoa': {
    altFacts:[
      'All animals evolved from a single-celled choanoflagellate ancestor around 700–800 million years ago.',
      'The first animals were almost certainly similar to modern sponges — sessile, filter-feeding, and without a nervous system.',
      'The Cambrian Explosion 541 million years ago saw virtually all modern animal body plans appear within ~20 million years — one of evolution\'s most dramatic events.',
      'Animals are defined by multicellularity, sexual reproduction, and heterotrophy — consuming other organisms for energy.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Animal'},
      {label:'UCMP (Berkeley)', url:'https://ucmp.berkeley.edu/phyla/metazoa.html'},
    ]
  },
  'turritopsis': {
    altFacts:[
      'When stressed, aged, or injured, Turritopsis dohrnii can revert its cells back to their earliest developmental state — essentially becoming a polyp again and restarting its life cycle.',
      'This cellular reprogramming process is called transdifferentiation — the only known case of a complete, repeatable reversal of biological aging in a multicellular animal.',
      'Scientists are studying the mechanism behind Turritopsis\'s immortality for potential applications in human aging research.',
      'Despite being "biologically immortal," Turritopsis still dies from predation, disease, and environmental stress — just not from old age.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Turritopsis_dohrnii'},
      {label:'Smithsonian Magazine', url:'https://www.smithsonianmag.com/science-nature/the-animal-that-wont-die-no-matter-what-172453810/'},
    ]
  },
  'octopus': {
    altFacts:[
      'Octopuses have three hearts, blue copper-based blood (hemocyanin), and a brain-to-body ratio comparable to many mammals.',
      'Two-thirds of an octopus\'s neurons are in its arms — each arm can taste, touch, and make decisions independently, and continues responding to stimuli even when severed.',
      'Octopuses can edit their own RNA in real time to adapt proteins to temperature changes — a form of genetic flexibility not seen in any vertebrate.',
      'The mimic octopus can impersonate at least 15 different species — including lionfish, flatfish, and sea snakes — by changing shape, color, and behavior simultaneously.',
      'Octopuses carry coconut shell halves across the ocean floor and reassemble them into portable shelters — one of the clearest examples of tool use in invertebrates.',
      'An octopus\'s beak — made of chitin — is the only hard part of its body, allowing it to squeeze through any gap larger than the beak itself.',
      'Octopus ink contains tyrosinase, an enzyme that disrupts a predator\'s sense of smell and taste, not just its vision.',
      'Female octopuses guard their eggs for months without eating, and die shortly after the eggs hatch — a sacrifice called semelparity.',
      'In lab experiments, octopuses have learned to open childproof jars from the inside, navigate complex mazes, and recognize individual human researchers.',
      'Male octopuses deliver sperm using a modified arm called a hectocotylus — in some species, the arm detaches and crawls to the female on its own.',
      'Octopuses can regenerate lost arms completely, including all nerve tissue and suckers.',
      'Their chromatophores change color in under 200 milliseconds, while papillae change skin texture to match coral, rocks, or seaweed in 3D.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Octopus'},
      {label:'Cephalopod Page', url:'https://www.thecephalopodpage.org/'},
      {label:'PBS NOVA (Other Minds)', url:'https://www.pbs.org/wgbh/nova/article/are-octopuses-smart/'},
      {label:'Monterey Bay Aquarium', url:'https://www.montereybayaquarium.org/animals/animals-a-to-z/giant-pacific-octopus'},
      {label:'Nature — Octopus Genome', url:'https://www.nature.com/articles/nature14668'},
    ]
  },
  'nautilus': {
    altFacts:[
      'The nautilus has remained virtually unchanged for 500 million years — surviving five mass extinctions that wiped out most complex life.',
      'Unlike its cephalopod relatives, the nautilus has up to 90 tentacles without suckers, and lacks the advanced intelligence of octopuses and squid.',
      'The nautilus shell is divided into gas-filled chambers that it adjusts for buoyancy — the same principle used in modern submarines.',
      'The nautilus has a primitive pinhole eye with no lens — essentially a camera obscura — giving it blurry but wide-angle vision.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Nautilus_(genus)'},
      {label:'Smithsonian Ocean', url:'https://ocean.si.edu/ocean-life/invertebrates/nautilus'},
    ]
  },
  'mantis-shrimp': {
    altFacts:[
      'Mantis shrimp strike with the force of a .22 caliber bullet — their clubs accelerate at 10,400g and move at 23 m/s, generating cavitation bubbles that deliver a second shockwave on top of the physical hit.',
      'They have 16 types of photoreceptors — compared to 3 in humans — but use a unique "barcode" scanning strategy rather than our brain-intensive color comparison.',
      'Mantis shrimp are the only animals known to see circular polarized light — they use it for private communication invisible to predators.',
      'Each eye has trinocular depth perception and rotates independently on three axes, giving a single eye capabilities that require two eyes in every other animal.',
      'There are two body types: "smashers" with calcified clubs that crack shells (and aquarium glass), and "spearers" with barbed appendages that impale soft-bodied prey.',
      'The smasher\'s club is made of a bio-ceramic composite called a Bouligand structure — layered to resist cracking — now studied for next-generation body armor and aircraft panels.',
      'Some mantis shrimp species mate for life and share a burrow for over 20 years, with both parents guarding the eggs.',
      'Their fluorescent body patterns are used for signaling in conditions where visible colors are absorbed by seawater.',
      'The strike generates a brief flash of light (sonoluminescence) and temperatures approaching the surface of the sun — all from an animal that fits in your hand.',
      'Aquarium hobbyists call them "thumb splitters" — they have been known to crack double-layered aquarium glass and must be kept in acrylic tanks.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Mantis_shrimp'},
      {label:'Smithsonian Ocean', url:'https://ocean.si.edu/ocean-life/invertebrates/mantis-shrimp'},
      {label:'UC Berkeley — Patek Lab', url:'https://pateklab.biology.duke.edu/'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/invertebrates/facts/mantis-shrimp'},
    ]
  },
  'coelacanth': {
    altFacts:[
      'The coelacanth was known only from 65-million-year-old fossils until a live specimen was caught off South Africa in 1938 — one of the greatest zoological discoveries of the 20th century.',
      'Coelacanths have a unique "intracranial joint" that allows the front of the skull to lift relative to the lower jaw, vastly increasing gape.',
      'They give birth to live young after a gestation period of about 3 years — the longest known gestation of any animal.',
      'Coelacanth lobed fins move in an alternating gait exactly like the legs of a walking tetrapod — they are our closest living fish relatives.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Coelacanth'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/12379/12591775'},
      {label:'Smithsonian Ocean', url:'https://ocean.si.edu/ocean-life/fish/coelacanth'},
    ]
  },
  'white-shark': {
    altFacts:[
      'Great white sharks have existed largely unchanged for ~16 million years, surviving every mass extinction since then.',
      'They are endothermic (warm-blooded relative to their environment) — their muscles generate heat, giving them faster reaction times than cold-blooded fish.',
      'A great white\'s genome is 1.5× larger than a human\'s and contains extensive DNA repair mechanisms that may explain their rarity of cancer.',
      'Shark skin is covered in microscopic tooth-like scales called dermal denticles that reduce drag — swimsuit manufacturers have copied the design.',
      'Great whites can detect one drop of blood in 100 liters of water and sense electromagnetic fields from prey\'s heartbeats.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Great_white_shark'},
      {label:'Shark Trust', url:'https://www.sharktrust.org/great-white-shark'},
      {label:'OCEARCH', url:'https://www.ocearch.org/'},
    ]
  },
  'komodo-dragon': {
    altFacts:[
      'Komodo dragons were unknown to Western science until 1910, when a Dutch colonial officer confirmed the Flores islanders\' stories of giant land lizards — previously dismissed as folklore.',
      'They can eat 80% of their body weight in a single meal — swallowing goat-sized prey nearly whole — and then survive on as few as 12 large meals per year.',
      'Female Komodo dragons can reproduce parthenogenetically — without a male — but all offspring are male, making it a one-generation strategy for isolated females.',
      'MRI scans in 2009 revealed sophisticated venom glands in the lower jaw that deliver anticoagulant and hypotensive toxins — settling a decades-long debate about whether kills were due to bacteria or venom.',
      'Juvenile Komodos spend their first years living in trees — specifically to avoid being eaten by cannibalistic adults on the ground.',
      'Their forked tongue can detect chemical trails from rotting carcasses up to 4 km away by sampling the air from two directions simultaneously for directional scent tracking.',
      'Komodo dragons have 60 serrated teeth that are continuously replaced throughout their lives, similar to sharks.',
      'They can sprint at 20 km/h in short bursts and are strong swimmers — they have been observed swimming between Indonesian islands.',
      'Iron-coated teeth give the Komodo dragon\'s bite its distinctive orange-tipped appearance — the iron cap keeps the serrated edges razor-sharp.',
      'Only about 3,000 wild Komodos remain, all on a handful of Indonesian islands — they are listed as Endangered by the IUCN.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Komodo_dragon'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/komodo-dragon'},
      {label:'Smithsonian\'s National Zoo', url:'https://nationalzoo.si.edu/animals/komodo-dragon'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/22884/123633058'},
      {label:'Nature — Komodo Venom', url:'https://www.nature.com/articles/news.2009.443'},
    ]
  },
  'archaeopteryx': {
    altFacts:[
      'Archaeopteryx was discovered just two years after Darwin published On the Origin of Species — it was immediately recognized as the "missing link" between reptiles and birds.',
      'It had fully formed feathers identical in structure to modern bird feathers, yet retained teeth, clawed wing fingers, and a bony tail.',
      'Recent analysis shows Archaeopteryx could fly, but awkwardly — more like a pheasant bursting from undergrowth than a soaring hawk.',
      'Only 12 specimens have ever been found, all in the Solnhofen limestone of Bavaria, Germany.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Archaeopteryx'},
      {label:'Natural History Museum London', url:'https://www.nhm.ac.uk/discover/archaeopteryx-the-link-between-dinosaurs-and-birds.html'},
    ]
  },
  'peregrine-falcon': {
    altFacts:[
      'The peregrine falcon is the fastest animal on Earth — in a hunting stoop it reaches 390 km/h (242 mph), faster than a Formula 1 car.',
      'It was nearly driven to extinction by DDT in the mid-20th century; bans on DDT and intensive captive breeding programs brought it back from the brink.',
      'Peregrines now nest on skyscrapers in cities worldwide, hunting pigeons — one of conservation\'s greatest success stories.',
      'Their nostrils contain tubercles that redirect incoming air during high-speed dives, preventing lung damage from the extreme air pressure.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Peregrine_falcon'},
      {label:'RSPB', url:'https://www.rspb.org.uk/birds-and-wildlife/wildlife-guides/bird-a-z/peregrine-falcon/'},
      {label:'Cornell Lab of Ornithology', url:'https://www.allaboutbirds.org/guide/Peregrine_Falcon/'},
    ]
  },
  'mammals': {
    altFacts:[
      'The bumblebee bat weighs just 2 grams — the smallest mammal — while the blue whale reaches 190 tonnes, a 95-million-fold size range within a single class.',
      'Mammals evolved three middle-ear bones from reptilian jaw bones, one of the most completely documented evolutionary transitions in the fossil record.',
      'The platypus, echidna, and three other monotremes are the only mammals that lay eggs — a trait inherited from our reptilian ancestors.',
      'After the asteroid wiped out non-avian dinosaurs 66 million years ago, mammals radiated explosively from small, shrew-sized nocturnal forms into every ecological niche on the planet.',
      'All mammals produce milk, but its composition varies wildly: hooded seal milk is 60% fat (thickest), while horse milk is only 1% fat.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Mammal'},
      {label:'Animal Diversity Web', url:'https://animaldiversity.org/accounts/Mammalia/'},
      {label:'IUCN Red List — Mammals', url:'https://www.iucnredlist.org/search?taxonomies=100089'},
    ]
  },
  'cetaceans': {
    altFacts:[
      'Whales evolved from small, four-legged, dog-like land animals — Pakicetus — that lived near rivers about 50 million years ago. The entire land-to-sea transition took only ~10 million years.',
      'Sperm whales have the largest brain of any animal (7.8 kg) and communicate using codas — distinct clicking patterns that vary by clan, functioning like dialects.',
      'Cuvier\'s beaked whale holds the record for the deepest mammal dive: 2,992 meters (nearly 2 miles) — deeper than many submarines can go.',
      'Humpback whale songs can propagate across entire ocean basins and evolve culturally, with new song motifs spreading thousands of kilometers between populations.',
      'Bowhead whales can live over 200 years — the longest-lived mammal — with stone harpoon points from the 1800s found embedded in living whales.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Cetacea'},
      {label:'NOAA Fisheries — Cetaceans', url:'https://www.fisheries.noaa.gov/topic/marine-life'},
      {label:'Whale & Dolphin Conservation', url:'https://us.whales.org/'},
    ]
  },
  'blue-whale': {
    altFacts:[
      'The blue whale\'s heart is the size of a small car and beats as slowly as 2 times per minute during deep dives.',
      'A blue whale calf gains ~90 kg per day from its mother\'s milk — the fastest growth rate of any animal.',
      'Blue whale calls at ~188 decibels are the loudest sounds produced by any animal — audible to other whales across entire ocean basins.',
      'They were hunted to near-extinction in the 20th century; the global population fell from ~350,000 to fewer than 10,000 before whaling bans.',
      'A blue whale\'s tongue alone weighs as much as an elephant.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Blue_whale'},
      {label:'WWF Blue Whale', url:'https://www.worldwildlife.org/species/blue-whale'},
      {label:'NOAA Fisheries', url:'https://www.fisheries.noaa.gov/species/blue-whale'},
    ]
  },
  'platypus': {
    altFacts:[
      'The platypus bill contains ~40,000 electroreceptors and ~60,000 mechanoreceptors that together create a detailed electrical map of the riverbed — it hunts with its eyes, ears, and nostrils sealed shut.',
      'Male platypus venom causes excruciating pain in humans that is completely unresponsive to morphine — it can persist for weeks and requires specialized nerve-blocking treatment.',
      'The platypus genome is a chimera of mammalian, reptilian, and avian genes — its Y chromosomes share more similarity with bird sex chromosomes than with those of any other mammal.',
      'Platypuses glow blue-green under ultraviolet light — a biofluorescence discovered in 2020 whose biological purpose remains completely unknown.',
      'They have 10 sex chromosomes (humans have 2), the most of any mammal, arranged in a chain during meiosis.',
      'Platypuses have no stomach — they lost it during evolution and their food passes directly from the esophagus to the intestine.',
      'Mother platypuses have no nipples — they secrete milk through specialized patches of skin, and the milk contains unique antibacterial proteins now studied for antibiotic-resistant infections.',
      'Adult platypuses have no teeth — they grind food between horny pads using gravel scooped from the riverbed.',
      'A fossil giant platypus (Obdurodon tharalkooschild) from 5–15 million years ago was nearly a meter long — twice the size of modern platypuses.',
      'Their body temperature of 32°C is the lowest of any mammal — 5 degrees below the typical mammalian 37°C.',
      'When the zoologist George Shaw received the first specimen in 1799, he took scissors to the pelt to check for stitches — convinced it was a taxidermy hoax.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Platypus'},
      {label:'Australian Museum', url:'https://australian.museum/learn/animals/mammals/platypus/'},
      {label:'Platypus Conservation Initiative', url:'https://www.unsw.edu.au/research/platypus-conservation-initiative'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/platypus'},
    ]
  },
  'african-elephant': {
    altFacts:[
      'Elephants mourn their dead — they have been observed holding vigils over fallen companions, gently touching the bones with their trunks, and returning to death sites years later.',
      'An elephant\'s trunk contains approximately 40,000 muscles — more than 60 times the total muscles in a human body — yet is precise enough to pick up a single blade of grass.',
      'Matriarch elephants carry mental maps of water sources across hundreds of kilometers, memories that span decades and save the herd during droughts.',
      'Elephants communicate with infrasound below 20 Hz — inaudible to humans — that can travel over 10 km through both the air and the ground.',
      'Their feet contain specialized fat pads with sensitive nerve endings that detect seismic vibrations, allowing them to "hear" other elephants communicating through the ground.',
      'Elephants are one of only five animals confirmed to recognize themselves in a mirror — a marker of self-awareness alongside great apes, dolphins, magpies, and cleaner wrasse.',
      'During musth, male elephants experience a testosterone surge up to 60 times normal levels — they become unpredictable and are avoided by all other elephants.',
      'Elephants are ecosystem engineers — they dig waterholes that other species depend on, knock down trees to create grasslands, and disperse seeds across enormous distances.',
      'An elephant goes through 6 sets of teeth in its lifetime — when the last set wears out (usually around age 60–70), the animal can no longer feed and dies.',
      'The ivory trade killed an estimated 100,000 African elephants per year during the 1980s — the global population fell from 1.3 million to around 400,000.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/African_elephant'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/african-elephant'},
      {label:'Amboseli Trust for Elephants', url:'https://www.elephanttrust.org/'},
      {label:'Save the Elephants', url:'https://www.savetheelephants.org/'},
      {label:'Elephant Voices', url:'https://www.elephantvoices.org/'},
    ]
  },
  'leafcutter-ant': {
    altFacts:[
      'Leafcutter ants have been farming fungus for approximately 50 million years — making them Earth\'s first agriculturalists, tens of millions of years before humans planted a single crop.',
      'They never eat the leaves they cut — instead they chew them into mulch to feed a domesticated fungus that exists nowhere else in nature, in an obligate mutualism.',
      'A colony can contain up to 8 million individuals across at least four specialized castes: tiny minims tend the fungus, mediae cut leaves, majors defend the colony, and a single queen lays every egg.',
      'The ants carry symbiotic bacteria (Pseudonocardia) on their bodies that produce natural antifungal compounds to protect their crop from parasites — a form of pharmaceutical agriculture.',
      'Their underground nests can be 8 meters deep with thousands of chambers, complete with engineered ventilation shafts that regulate temperature and carbon dioxide levels.',
      'A single large colony harvests 15–20% of all leaf production in its surrounding forest — making them the dominant herbivores in tropical ecosystems.',
      'The queen mates only once during a single nuptial flight, storing enough sperm to produce hundreds of millions of offspring over her 15–20-year lifespan.',
      'When a colony outgrows its fungus, worker ants create "waste management" chambers and designate specific castes to handle refuse — maintaining garden hygiene.',
      'Leafcutter ant highways — cleared trails up to 30 meters wide — are visible from aerial photographs and represent one of the largest construction projects by any non-human animal.',
      'Their total biomass in South America is estimated at 15% of all animal biomass — pound for pound, they may be the most ecologically dominant animal group on the continent.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Leafcutter_ant'},
      {label:'Smithsonian', url:'https://www.si.edu/spotlight/buginfo/leafcutter'},
      {label:'AntWiki', url:'https://www.antwiki.org/wiki/Atta'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/invertebrates/facts/leafcutter-ants'},
    ]
  },
  'naked-mole-rat': {
    altFacts:[
      'Naked mole-rats are virtually immune to cancer — in 30 years of lab studies, almost no cases of cancer have ever been recorded.',
      'They can survive 18 minutes without oxygen by switching to fructose-based metabolism, like plants.',
      'Naked mole-rats are eusocial like ants and bees — they live in colonies of up to 300 with a single breeding queen who suppresses reproduction in all other females.',
      'They feel no pain from acid or capsaicin — their neurons lack a key ion channel that transmits pain signals in other mammals.',
      'Naked mole-rats are the longest-lived rodents, reaching 37 years — 10× longer than mice of similar size.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Naked_mole-rat'},
      {label:'Smithsonian\'s National Zoo', url:'https://nationalzoo.si.edu/animals/naked-mole-rat'},
      {label:'Science — Aging Research', url:'https://www.science.org/topic/naked-mole-rat'},
    ]
  },
  'primates': {
    altFacts:[
      'Primates are the only mammals with flat nails instead of claws — an adaptation for grasping branches and manipulating objects.',
      'The tarsier has the largest eyes relative to body size of any mammal — each eye is as large as its entire brain.',
      'Primates have the longest childhoods relative to lifespan of any animal group, allowing extended learning periods.',
      'New World monkeys evolved independently in South America after ancestral primates somehow crossed the Atlantic from Africa ~40 million years ago — probably on floating vegetation.',
      'Primates have the highest brain-to-body mass ratio of any mammalian order — the human brain is ~2% of body weight but uses ~20% of its energy.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Primate'},
      {label:'Primate Info Net', url:'https://pin.primate.wisc.edu/'},
      {label:'IUCN Primate Specialist Group', url:'https://www.primate-sg.org/'},
    ]
  },
  'great-apes': {
    altFacts:[
      'All great apes pass the mirror test — recognizing themselves in a mirror — suggesting self-awareness, a capacity shared by very few species.',
      'Bonobos, our co-closest relative alongside chimpanzees, resolve conflict with sex rather than aggression and live in female-dominated societies.',
      'Great apes show empathy, altruism, grief, and can plan for the future — abilities once thought uniquely human.',
      'Every great ape species except Homo sapiens is endangered or critically endangered, mostly due to habitat destruction.',
      'Great apes diverged from lesser apes (gibbons) around 20 million years ago — humans and orangutans last shared a common ancestor roughly 14 million years ago.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Hominidae'},
      {label:'Great Apes Survival Partnership (UNEP)', url:'https://www.un-grasp.org/'},
      {label:'WWF Great Apes', url:'https://www.worldwildlife.org/initiatives/great-apes'},
    ]
  },
  'gorilla': {
    altFacts:[
      'Gorillas are mostly vegetarian and spend up to 14 hours a day eating — a 200 kg silverback needs ~18 kg of vegetation daily.',
      'Silverback gorillas beat their chests not primarily as aggression, but as communication — it can be heard up to 1 km away.',
      'Koko the western lowland gorilla had a measured IQ of between 75 and 95 and learned ~1,000 signs in American Sign Language.',
      'Mountain gorillas were brought back from fewer than 250 individuals in the 1980s to over 1,000 today — one of conservation\'s great success stories.',
      'Gorillas construct a fresh nest to sleep in every night — a new bed, every single evening.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Gorilla'},
      {label:'WWF Gorilla', url:'https://www.worldwildlife.org/species/gorilla'},
      {label:'Dian Fossey Gorilla Fund', url:'https://gorillafund.org/'},
    ]
  },
  'orangutan': {
    altFacts:[
      'Orangutans are the only great ape native to Asia — all others are African.',
      'They have the longest birth interval of any land mammal: 7–9 years between births, meaning a female may have only 3–4 offspring in her lifetime.',
      'Young orangutans spend up to 8 years with their mothers — the longest dependency period of any non-human animal.',
      'Different orangutan populations have distinct cultural repertoires of tool use and foraging techniques not seen in other populations.',
      '"Orangutan" means "person of the forest" in Malay and Indonesian.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Orangutan'},
      {label:'WWF Orangutan', url:'https://www.worldwildlife.org/species/orangutan'},
      {label:'Orangutan Foundation International', url:'https://www.orangutan.org/'},
    ]
  },
  'chimpanzee': {
    altFacts:[
      'Chimpanzees wage coordinated lethal warfare against neighboring groups — raiding parties kill rivals and gradually annex territory.',
      'They have been observed mourning their dead, carrying deceased infants for weeks, and returning to visit the corpses of community members.',
      'Chimps in the wild self-medicate — swallowing rough leaves to dislodge intestinal parasites and chewing bitter plants with antibiotic properties.',
      'Different chimpanzee communities have distinct "cultures" — techniques for cracking nuts, fishing for termites, or greeting each other that are learned, not innate.',
      'Jane Goodall\'s 1960 discovery that chimpanzees use tools revolutionized science — until then, tool use was considered uniquely human.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Chimpanzee'},
      {label:'Jane Goodall Institute', url:'https://www.janegoodall.org/'},
      {label:'WWF Chimpanzee', url:'https://www.worldwildlife.org/species/chimpanzee'},
    ]
  },
  'hominini': {
    altFacts:[
      'At least 9 different hominin species coexisted on Earth as recently as 100,000 years ago — Homo sapiens is the sole survivor of a once-diverse lineage.',
      'The oldest known stone tools (3.3 million years old, from Lomekwi, Kenya) predate the genus Homo — they were likely made by Australopithecus or Kenyanthropus.',
      'Bipedalism — walking upright on two legs — appeared at least 6 million years ago, long before brain size began increasing significantly.',
      'Homo erectus was the first hominin to leave Africa, spreading to Asia and Europe nearly 2 million years ago and surviving for over 1.5 million years.',
      'DNA evidence shows that Homo sapiens interbred with at least three other hominin species: Neanderthals, Denisovans, and an unknown "ghost" population.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Hominini'},
      {label:'Smithsonian Human Origins', url:'https://humanorigins.si.edu/'},
      {label:'Becoming Human', url:'https://www.becominghuman.org/'},
    ]
  },
  'homo-sapiens': {
    altFacts:[
      'Every non-African human alive today carries ~1–4% Neanderthal DNA from interbreeding that occurred ~50,000–60,000 years ago.',
      'The human brain uses ~20% of all the body\'s energy despite being only ~2% of its weight.',
      'Modern humans have been on Earth for 300,000 years — agriculture only appeared ~12,000 years ago, meaning we spent 96% of our existence as hunter-gatherers.',
      'The human genome contains ~20,000 protein-coding genes — about the same number as a roundworm — but vastly more complex regulation.',
      'Humans are one of very few species that can recognize their own reflection, experience embarrassment, and plan deliberately for their own death.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Human'},
      {label:'Smithsonian Human Origins', url:'https://humanorigins.si.edu/'},
      {label:'NHGRI Human Genome', url:'https://www.genome.gov/human-genome-project'},
    ]
  },
  'plasmodium': {
    altFacts:[
      'Malaria has killed more humans than all wars in history combined — estimated at ~50 billion deaths over recorded history.',
      'Plasmodium has a complex two-host life cycle requiring both a mosquito and a vertebrate — it undergoes sexual reproduction only inside the mosquito.',
      'Sickle-cell trait (one defective hemoglobin gene) provides significant resistance to malaria — a classic example of balancing selection.',
      'The 2015 Nobel Prize in Medicine was awarded for artemisinin, an anti-malaria compound derived from a Chinese herb, now saving hundreds of thousands of lives annually.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Plasmodium_(biology)'},
      {label:'WHO Malaria', url:'https://www.who.int/news-room/fact-sheets/detail/malaria'},
      {label:'Malaria Consortium', url:'https://www.malariaconsortium.org/'},
    ]
  },
  'diatoms': {
    altFacts:[
      'Diatoms produce ~20–25% of all the oxygen generated on Earth annually — more than all the world\'s rainforests.',
      'Their cell walls (frustules) are made of silica glass and are so precisely structured they are used as calibration standards in microscopy.',
      'When diatoms die, their silica shells accumulate on the ocean floor — deposits thousands of meters thick form diatomite, used in filters, abrasives, and insecticides.',
      'Each diatom frustule is unique in geometry — there are estimated 200,000+ species, most still undescribed.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Diatom'},
      {label:'Diatom of the Month', url:'https://diatomsofna.myspecies.info/'},
    ]
  },
  'volvox': {
    altFacts:[
      'Volvox is a transitional organism — colonies of ~500–50,000 cells differentiate into somatic cells (which cannot reproduce) and germ cells, making it key evidence for the evolution of multicellularity.',
      'The colony rotates as it swims, driven by coordinated flagella — the rotation is how it got its name (from Latin volvere, to roll).',
      'Daughter colonies develop inside the parent, then must invert themselves — turning inside out — before being released.',
      'Volvox evolved multicellularity independently from animals, plants, and fungi — a striking example of convergent evolution.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Volvox'},
      {label:'Microbiology Society', url:'https://microbiologysociety.org/'},
    ]
  },
  'sahelanthropus': {
    altFacts:[
      'Sahelanthropus tchadensis, nicknamed "Toumaï" (meaning "hope of life" in the Goran language), was discovered in Chad in 2001.',
      'Its small canine teeth and possible foramen magnum position suggest bipedalism — but a femur found nearby was recently attributed to it, reigniting debate over whether it walked upright.',
      'It lived 6–7 million years ago — just after the human-chimp split — making it potentially the oldest known hominin, though some researchers place it on the chimp lineage.',
      'Its discovery in Chad, 2,500 km west of the East African Rift Valley, challenged the long-held assumption that human evolution was exclusively East African.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Sahelanthropus'},
      {label:'Smithsonian Human Origins', url:'https://humanorigins.si.edu/evidence/human-fossils/species/sahelanthropus-tchadensis'},
    ]
  },
  'au_afarensis': {
    altFacts:[
      '"Lucy" (AL 288-1), discovered in Ethiopia in 1974, is the most complete Australopithecus afarensis skeleton ever found, and transformed our understanding of early bipedalism.',
      'Lucy\'s knee joint proved she walked upright long before human-sized brains evolved — overturning the assumption that intelligence drove bipedalism.',
      'Laetoli footprints in Tanzania, 3.6 million years old, were made by A. afarensis and show a fully modern bipedal gait — with no knuckle-dragging.',
      'A. afarensis had a brain only slightly larger than a chimpanzee\'s, yet stood fully upright — body form evolved millions of years before cognitive expansion.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Australopithecus_afarensis'},
      {label:'Smithsonian Human Origins', url:'https://humanorigins.si.edu/evidence/human-fossils/species/australopithecus-afarensis'},
      {label:'IHO (Institute of Human Origins)', url:'https://iho.asu.edu/'},
    ]
  },
  'h_neanderthalensis': {
    altFacts:[
      'Neanderthals buried their dead, created art, made jewelry from eagle claws and shells, and cared for injured and elderly individuals.',
      'Their brains were on average slightly larger than modern humans\' — they were not the brutish creatures once depicted.',
      'Neanderthals and modern humans interbred extensively — all non-African humans carry 1–4% Neanderthal DNA.',
      'Inherited Neanderthal gene variants still affect modern humans today — influencing immune response, skin pigmentation, and COVID-19 severity.',
      'They survived in Europe for ~400,000 years before disappearing ~40,000 years ago, shortly after modern humans arrived.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Neanderthal'},
      {label:'Smithsonian Human Origins', url:'https://humanorigins.si.edu/evidence/human-fossils/species/homo-neanderthalensis'},
      {label:'Max Planck Ancient DNA', url:'https://www.eva.mpg.de/genetics/'},
    ]
  },
  'h_erectus': {
    altFacts:[
      'Homo erectus was the first hominin to leave Africa, reaching Asia ~1.8 million years ago, and survived until ~100,000–70,000 years ago.',
      'Turkana Boy (KNM-WT 15000), found in Kenya in 1984, is the most complete early Homo skeleton ever found.',
      'H. erectus was likely the first hominin to control fire and cook food — a development that may have driven brain expansion by increasing calorie availability.',
      'Their basic body plan — long legs, narrow hips, reduced gut — is essentially the same as modern humans\', suggesting a lifestyle of distance running and persistence hunting.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Homo_erectus'},
      {label:'Smithsonian Human Origins', url:'https://humanorigins.si.edu/evidence/human-fossils/species/homo-erectus'},
    ]
  },
  'coral': {
    altFacts:[
      'Coral polyps are tiny animals related to jellyfish — each only 1–3 mm — that secrete calcium carbonate skeletons, building reef structures over thousands of years.',
      'Corals derive up to 90% of their energy from symbiotic algae called zooxanthellae that live inside their tissues — when stressed, corals expel these algae and "bleach" white.',
      'Once a year under a full moon, entire reef systems spawn simultaneously — billions of polyps release eggs and sperm in a synchronized underwater snowstorm timed by moonlight and water temperature.',
      'Coral growth bands record centuries of ocean temperature, chemistry, and storm history — functioning as climate archives similar to tree rings.',
      'The Great Barrier Reef is the largest living structure on Earth — stretching 2,300 km and visible from space, yet individual polyps are smaller than a pencil eraser.',
      'Deep-sea corals exist at depths exceeding 6,000 m in total darkness — they survive without zooxanthellae by filter-feeding particles from the water.',
      'A healthy coral reef is one of the loudest ecosystems on Earth — the crackling of snapping shrimp and the calls of fish create an underwater soundscape audible to the naked ear.',
      'Green fluorescent protein (GFP) — one of the most important tools in modern biology — was originally discovered in a cnidarian relative of corals.',
      'Scientists are using coral "IVF" — collecting and cross-breeding heat-resistant coral fragments — to breed more resilient reef populations for restoration efforts.',
      'Coral reefs provide coastal protection worth $9 billion annually by absorbing up to 97% of wave energy before it reaches shore.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Coral'},
      {label:'Coral Reef Alliance', url:'https://coral.org/'},
      {label:'NOAA Coral Reef Conservation', url:'https://coralreef.noaa.gov/'},
      {label:'Great Barrier Reef Foundation', url:'https://www.barrierreef.org/'},
      {label:'Reef Check', url:'https://www.reefcheck.org/'},
    ]
  },
  'honey-bee': {
    altFacts:[
      'A honeybee colony of ~60,000 individuals functions as a superorganism — collective decisions like nest-site selection are made through "dance debates" that work identically to how neurons vote in a primate brain.',
      'Worker bees communicate the exact distance and direction of food sources through the waggle dance — using the sun as a compass and compensating for its movement throughout the day.',
      'One-third of all human food depends on pollination by bees and other insects — an ecosystem service valued at over $200 billion annually.',
      'Bees navigate using the Earth\'s magnetic field and the polarization patterns of sunlight — they can find their hive even on overcast days.',
      'A single worker bee produces only 1/12 of a teaspoon of honey in her entire 6-week life — a jar of honey represents 2.5 million flower visits.',
      'The hive maintains its temperature at exactly 35°C year-round — workers fan their wings to cool it in summer and vibrate their flight muscles to heat it in winter.',
      'When a virgin queen emerges, she and rival queens engage in "piping" — musical duels of vibrations through the comb — the loser is stung to death.',
      'Honey found in 3,000-year-old Egyptian tombs was still perfectly edible — its low moisture, high acidity, and natural hydrogen peroxide make it one of the only foods that never spoils.',
      'Worker bees change jobs as they age: they start as nurse bees (cleaning cells), graduate to wax builders, then become foragers in their final weeks of life.',
      'Colony collapse disorder — where worker bees abandon the hive — has been linked to neonicotinoid pesticides, varroa mites, and habitat loss, with some regions losing 40% of colonies annually.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Western_honey_bee'},
      {label:'USDA Bee Research', url:'https://www.ars.usda.gov/research/programs/honeybees/'},
      {label:'Bee Informed Partnership', url:'https://beeinformed.org/'},
      {label:'Cornell Dyce Lab', url:'https://pollinator.cals.cornell.edu/'},
      {label:'Bumblebee Conservation Trust', url:'https://www.bumblebeeconservation.org/'},
    ]
  },
  'tuatara': {
    altFacts:[
      'Tuatara have a third "parietal eye" on top of their skulls — complete with lens, retina, and cornea — which becomes covered by scales in adults but may detect light for circadian rhythms.',
      'They are the only surviving member of the order Rhynchocephalia, which was globally distributed during the Jurassic period ~200 million years ago.',
      'Tuatara have the slowest metabolism of any reptile and can live over 100 years.',
      'They thrive in cool temperatures (16–21°C) — unusual for reptiles — and are most active at night.',
      'Sex is determined by incubation temperature: eggs above 22°C produce mostly males.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Tuatara'},
      {label:'New Zealand Dept of Conservation', url:'https://www.doc.govt.nz/nature/native-animals/reptiles-and-frogs/tuatara/'},
    ]
  },
  'streptomyces': {
    altFacts:[
      'Streptomyces bacteria produce more than two-thirds of all naturally derived antibiotics used in medicine, including streptomycin, tetracycline, and erythromycin.',
      'The distinctive earthy smell of soil after rain (petrichor) is caused by geosmin, a compound produced by Streptomyces.',
      'Streptomyces have complex multicellular life cycles, forming aerial hyphae and spores — more structurally complex than most bacteria.',
      'Leaf-cutter ants cultivate Streptomyces on their bodies to produce antifungal compounds that protect their fungal gardens — a 50-million-year-old agricultural partnership.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Streptomyces'},
      {label:'Microbiology Society', url:'https://microbiologysociety.org/'},
    ]
  },
  'mycobacterium-tb': {
    altFacts:[
      'Mycobacterium tuberculosis has infected roughly 2 billion people alive today — most carry a latent infection that may never cause disease.',
      'TB kills ~1.5 million people per year, making it the deadliest infectious disease caused by a single bacterium.',
      'The M. tuberculosis genome has barely changed in 70,000 years — tracking human migrations out of Africa as the bacteria spread with us.',
      'It can survive for weeks in dried sputum on surfaces and is extraordinarily resistant to many disinfectants.',
      'The BCG vaccine against TB has been given to more children than any other vaccine in history.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Mycobacterium_tuberculosis'},
      {label:'WHO TB facts', url:'https://www.who.int/news-room/fact-sheets/detail/tuberculosis'},
    ]
  },
};

// Wikipedia article titles for each node
const WIKI_TITLES = {
  'luca':'Hydrothermal_vent','bacteria':'Bacteria','cyanobacteria':'Cyanobacteria',
  'prochlorococcus':'Prochlorococcus','proteobacteria':'Proteobacteria','ecoli':'Escherichia_coli',
  'helicobacter':'Helicobacter_pylori','vibrio-cholerae':'Vibrio_cholerae',
  'firmicutes':'Firmicutes','lactobacillus':'Lactobacillus','clostridium-botulinum':'Clostridium_botulinum',
  'actinobacteria':'Actinomycetota','streptomyces':'Streptomyces','mycobacterium-tb':'Mycobacterium_tuberculosis',
  'deinococcus':'Deinococcus_radiodurans','bacteroides':'Bacteroides',
  'archaea':'Archaea','halobacterium':'Halobacterium','sulfolobus':'Sulfolobus',
  'pyrolobus':'Pyrolobus_fumarii','lokiarchaeota':'Asgard_archaea',
  'fungi':'Fungus','ascomycetes':'Ascomycota','saccharomyces':'Saccharomyces_cerevisiae',
  'penicillium':'Penicillium','basidiomycetes':'Basidiomycota','amanita-muscaria':'Amanita_muscaria',
  'armillaria':'Armillaria_ostoyae','psilocybe':'Psilocybe_cubensis',
  'chytrids':'Chytridiomycota','batrachochytrium':'Batrachochytrium_dendrobatidis',
  'viridiplantae':'Viridiplantae','mosses':'Moss','sphagnum':'Sphagnum',
  'liverworts':'Marchantiophyta','marchantia':'Marchantia_polymorpha',
  'angiosperms':'Flowering_plant','sunflower':'Common_sunflower','arabidopsis':'Arabidopsis_thaliana',
  'rafflesia':'Rafflesia_arnoldii','titan-arum':'Amorphophallus_titanum','mimosa':'Mimosa_pudica',
  'gymnosperms':'Gymnosperm','wollemi-pine':'Wollemi_pine','welwitschia':'Welwitschia',
  'sequoia':'Giant_sequoia','ferns':'Fern','tree-fern':'Tree_fern','azolla':'Azolla',
  'metazoa':'Animal','porifera':'Sponge','cnidaria':'Cnidaria',
  'turritopsis':'Turritopsis_dohrnii','coral':'Coral','coral-reef':'Coral_reef',
  'arthropoda':'Arthropod','insecta':'Insect','honey-bee':'Western_honey_bee','leafcutter-ant':'Leafcutter_ant',
  'mantis-shrimp':'Mantis_shrimp','horseshoe-crab':'Horseshoe_crab',
  'mollusca':'Mollusca','cephalopods':'Cephalopod','octopus':'Octopus',
  'octopus-day':'Day_octopus','nautilus':'Nautilus_(genus)',
  'echinodermata':'Echinoderm','chordata':'Chordate',
  'fish':'Fish','sharks':'Shark','white-shark':'Great_white_shark','coelacanth':'Coelacanth',
  'amphibia':'Amphibian','reptilia':'Reptile','komodo-dragon':'Komodo_dragon','tuatara':'Tuatara',
  'aves':'Bird','birds':'Peregrine_falcon','archaeopteryx':'Archaeopteryx','peregrine-falcon':'Peregrine_falcon',
  'mammalia':'Mammal','cetaceans':'Cetacea','blue-whale':'Blue_whale',
  'naked-mole-rat':'Naked_mole-rat','platypus':'Platypus','african-elephant':'African_elephant',
  'primates':'Primate','great-apes':'Hominidae','gorilla':'Western_gorilla',
  'orangutan':'Orangutan','chimpanzee':'Chimpanzee',
  'hominini':'Hominini','h_sapiens':'Human',
  'group-proto':'Hominini','group-australopith':'Australopithecus',
  'group-paranthropus':'Paranthropus','group-homo':'Homo_(genus)',
  'protists':'Protist','alveolates':'Alveolata','plasmodium':'Plasmodium_(biology)',
  'dinoflagellates':'Dinoflagellate','diatoms':'Diatom','phytophthora':'Phytophthora',
  'amoeba':'Amoeba','volvox':'Volvox',
  'h_naledi':'Homo_naledi','h_floresiensis':'Homo_floresiensis',
  'h_luzonensis':'Homo_luzonensis','denisovans':'Denisovan',
  'neanderthal':'Neanderthal','h_erectus':'Homo_erectus',
  'h_heidelbergensis':'Homo_heidelbergensis','h_habilis':'Homo_habilis',
  'h_rudolfensis':'Homo_rudolfensis','h_antecessor':'Homo_antecessor',
  'h_bodoensis':'Homo_heidelbergensis','h_longi':'Homo_longi',
  'au_afarensis':'Australopithecus_afarensis','au_africanus':'Australopithecus_africanus',
  'au_anamensis':'Australopithecus_anamensis','au_sediba':'Australopithecus_sediba',
  'au_garhi':'Australopithecus_garhi','au_deyiremeda':'Australopithecus_deyiremeda',
  'au_bahrelghazali':'Australopithecus_bahrelghazali','au_prometheus':'Australopithecus_africanus',
  'par_boisei':'Paranthropus_boisei','par_robustus':'Paranthropus_robustus',
  'par_aethiopicus':'Paranthropus_aethiopicus',
  'sahelanthropus':'Sahelanthropus','orrorin':'Orrorin','ardipithecus_r':'Ardipithecus_ramidus',
  'kenyanthropus':'Kenyanthropus',
  // New species (p-species-classification)
  'golden-poison-frog':'Golden_poison_frog','axolotl':'Axolotl',
  'chinese-giant-salamander':'Chinese_giant_salamander',
  'clownfish':'Ocellaris_clownfish','seahorse':'Common_seahorse','anglerfish':'Anglerfish',
  'green-sea-turtle':'Green_sea_turtle','king-cobra':'King_cobra','saltwater-crocodile':'Saltwater_crocodile',
  'emperor-penguin':'Emperor_penguin','hummingbird':'Ruby-throated_hummingbird','african-grey-parrot':'Grey_parrot',
  'flying-fox':'Large_flying_fox','african-elephant':'African_bush_elephant','gray-wolf':'Wolf',
  'bottlenose-dolphin':'Common_bottlenose_dolphin','three-toed-sloth':'Brown-throated_sloth',
  'monarch-butterfly':'Monarch_butterfly','leaf-cutter-ant':'Atta_cephalotes','dragonfly':'Anax_junius',
  'giant-squid':'Giant_squid','common-earthworm':'Lumbricus_terrestris','common-starfish':'Asterias_rubens',
  'venus-flytrap':'Venus_flytrap','baobab':'Adansonia_digitata',
};

const PHOTO_MAP = {
  // Bacteria & microbes
  'luca':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg/320px-Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg', credit:'NOAA/Wikipedia, CC BY 2.0'},
  'bacteria':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Bacteria_collage.jpg/320px-Bacteria_collage.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'cyanobacteria':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Simplefilaments022_Anabaena.jpg/320px-Simplefilaments022_Anabaena.jpg', credit:'Kristian Peters, CC BY-SA 3.0'},
  'proteobacteria':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/E._coli_Bacteria_%287316101966%29.jpg/320px-E._coli_Bacteria_%287316101966%29.jpg', credit:'NIAID, CC BY 2.0'},
  'ecoli':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/E._coli_Bacteria_%287316101966%29.jpg/320px-E._coli_Bacteria_%287316101966%29.jpg', credit:'NIAID, CC BY 2.0'},
  'helicobacter':          {url:'https://upload.wikimedia.org/wikipedia/commons/d/d6/EMpylori.jpg', credit:'Yutaka Tsutsumi, CC BY 2.5'},
  'vibrio-cholerae':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Cholera_bacteria_SEM.jpg/320px-Cholera_bacteria_SEM.jpg', credit:'Tom Kirn/Louisa Howard, Public Domain'},
  'firmicutes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Lactobacillus_acidophilus_SEM.jpg/320px-Lactobacillus_acidophilus_SEM.jpg', credit:'Bob Blaylock, CC BY-SA 3.0'},
  'lactobacillus':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Lactobacillus_acidophilus_SEM.jpg/320px-Lactobacillus_acidophilus_SEM.jpg', credit:'Bob Blaylock, CC BY-SA 3.0'},
  'clostridium-botulinum': {url:'https://upload.wikimedia.org/wikipedia/commons/f/f0/Clostridium_botulinum.jpg', credit:'CDC, Public Domain'},
  'actinobacteria':        {url:'https://upload.wikimedia.org/wikipedia/commons/9/9d/Streptomyces_coelicolor.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'streptomyces':          {url:'https://upload.wikimedia.org/wikipedia/commons/9/9d/Streptomyces_coelicolor.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'mycobacterium-tb':      {url:'https://upload.wikimedia.org/wikipedia/commons/0/0a/TB_Culture.jpg', credit:'CDC, Public Domain'},
  'deinococcus':           {url:'https://upload.wikimedia.org/wikipedia/commons/7/73/Deinococcus_radiodurans.jpg', credit:'Michael Daly, Public Domain'},
  'bacteroides':           {url:'https://upload.wikimedia.org/wikipedia/commons/6/6d/BacteroidesFragilis_Gram.jpg', credit:'CDC, Public Domain'},
  'prochlorococcus':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Prochlorococcus_SEM.png/320px-Prochlorococcus_SEM.png', credit:'Luke Thompson/Chisholm Lab, CC BY 2.5'},
  // Archaea
  'archaea':               {url:'https://upload.wikimedia.org/wikipedia/commons/a/a1/Halobacteria.jpg', credit:'NASA, Public Domain'},
  'halobacterium':         {url:'https://upload.wikimedia.org/wikipedia/commons/a/a1/Halobacteria.jpg', credit:'NASA, Public Domain'},
  'sulfolobus':            {url:'https://upload.wikimedia.org/wikipedia/commons/2/2f/Fmicb-03-00295-g001.jpg', credit:'Dr. Wolfram Zillig, Public Domain'},
  'pyrolobus':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg/320px-Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg', credit:'NOAA, CC BY 2.0'},
  'lokiarchaeota':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Champagne_vent_white_smokers.jpg/640px-Champagne_vent_white_smokers.jpg', credit:'NOAA, Public Domain'},
  // Fungi
  'fungi':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/320px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'ascomycetes':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/S_cerevisiae_under_DIC_microscopy.jpg/320px-S_cerevisiae_under_DIC_microscopy.jpg', credit:'Masur, Public Domain'},
  'saccharomyces':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/S_cerevisiae_under_DIC_microscopy.jpg/320px-S_cerevisiae_under_DIC_microscopy.jpg', credit:'Masur, Public Domain'},
  'penicillium':           {url:'https://upload.wikimedia.org/wikipedia/commons/c/c9/Penicillium_chrysogenum.jpg', credit:'Ajc1, CC BY-SA 3.0'},
  'basidiomycetes':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/320px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'amanita-muscaria':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/320px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'armillaria':            {url:'https://upload.wikimedia.org/wikipedia/commons/a/ab/Armillaria_ostoyae.jpg', credit:'USFS, Public Domain'},
  'psilocybe':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Psilocybe_Cubensis_Imire_%28Psilocybe_Cubensis_Zimbabwe%29_2.jpg/320px-Psilocybe_Cubensis_Imire_%28Psilocybe_Cubensis_Zimbabwe%29_2.jpg', credit:'Workman, CC BY-SA 3.0'},
  'chytrids':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ranoidea_caerulea_-_Wilhelma_01.jpg/320px-Ranoidea_caerulea_-_Wilhelma_01.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'batrachochytrium':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Batrachochytrium_dendrobatidis.jpg/640px-Batrachochytrium_dendrobatidis.jpg', credit:'Dr. Alex Hyatt, CSIRO, CC BY 3.0'},
  // Plants
  'viridiplantae':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/640px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'mosses':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sphagnum_Moss.jpg/320px-Sphagnum_Moss.jpg', credit:'Bff, CC BY-SA 3.0'},
  'sphagnum':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sphagnum_Moss.jpg/320px-Sphagnum_Moss.jpg', credit:'Bff, CC BY-SA 3.0'},
  'liverworts':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Marchantia_polymorpha.jpg/320px-Marchantia_polymorpha.jpg', credit:'Hermann Schachner, CC0'},
  'marchantia':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Marchantia_polymorpha.jpg/320px-Marchantia_polymorpha.jpg', credit:'Hermann Schachner, CC0'},
  'angiosperms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/640px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'sunflower':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/640px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'arabidopsis':           {url:'https://upload.wikimedia.org/wikipedia/commons/6/6f/Arabidopsis_thaliana.jpg', credit:'Nikolai Sitnov, Public Domain'},
  'rafflesia':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Rafflesia_arnoldii_-_Choix_des_plantes_rares_ou_nouvelles_-_plate_01_%281864%29.jpg/320px-Rafflesia_arnoldii_-_Choix_des_plantes_rares_ou_nouvelles_-_plate_01_%281864%29.jpg', credit:'Rendra Regen Rais, CC BY 2.0'},
  'titan-arum':            {url:'https://upload.wikimedia.org/wikipedia/commons/8/84/Titan_arum_in_bloom_at_the_Nashville_Zoo_October_2020.jpg', credit:'Rhett A. Butler, CC BY 2.5'},
  'mimosa':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Close-up_of_Sensitive_Plant_%28Mimosa_pudica%29_Leaves_at_Night.jpg/320px-Close-up_of_Sensitive_Plant_%28Mimosa_pudica%29_Leaves_at_Night.jpg', credit:'Hrushikesh, CC BY-SA 3.0'},
  'gymnosperms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/General_Sherman_tree_looking_up.jpg/320px-General_Sherman_tree_looking_up.jpg', credit:'Jim Bahn, CC BY 2.0'},
  'wollemi-pine':          {url:'https://upload.wikimedia.org/wikipedia/commons/5/5d/Wollemia_bark.JPG', credit:'Brent Miller, CC BY 2.0'},
  'welwitschia':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Welwitschia_mirabilis2.jpg/320px-Welwitschia_mirabilis2.jpg', credit:'Thomas Schoch, CC BY-SA 2.5'},
  'sequoia':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/General_Sherman_tree_looking_up.jpg/320px-General_Sherman_tree_looking_up.jpg', credit:'Jim Bahn, CC BY 2.0'},
  'ferns':                 {url:'https://upload.wikimedia.org/wikipedia/commons/1/11/Cyathea_cooperi.jpg', credit:'Photohound, CC BY-SA 3.0'},
  'tree-fern':             {url:'https://upload.wikimedia.org/wikipedia/commons/1/11/Cyathea_cooperi.jpg', credit:'Photohound, CC BY-SA 3.0'},
  'azolla':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Azolla_caroliniana.jpg/320px-Azolla_caroliniana.jpg', credit:'Christian Fischer, CC BY-SA 3.0'},
  // Animals
  'metazoa':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Turritopsis_nutricula_Kamo.jpg/320px-Turritopsis_nutricula_Kamo.jpg', credit:'Bachware, Public Domain'},
  'porifera':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Coral_reef_at_palmyra.jpg/320px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'cnidaria':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Turritopsis_nutricula_Kamo.jpg/320px-Turritopsis_nutricula_Kamo.jpg', credit:'Bachware, Public Domain'},
  'turritopsis':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Turritopsis_nutricula_Kamo.jpg/320px-Turritopsis_nutricula_Kamo.jpg', credit:'Bachware, Public Domain'},
  'coral-reef':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Coral_reef_at_palmyra.jpg/320px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'arthropoda':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Odontodactylus_scyllarus.jpg/320px-Odontodactylus_scyllarus.jpg', credit:'Roy Caldwell, Public Domain'},
  'insecta':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/640px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'honey-bee':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/640px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'leafcutter-ant':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Atta_cephalotes-pjt.jpg/320px-Atta_cephalotes-pjt.jpg', credit:'Bandmann, CC BY-SA 3.0'},
  'mantis-shrimp':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Odontodactylus_scyllarus.jpg/320px-Odontodactylus_scyllarus.jpg', credit:'Roy Caldwell, Public Domain'},
  'horseshoe-crab':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Horseshoe_Crab_Returning_To_Sea_After_Spawning_Per_%28111773087%29.jpeg/320px-Horseshoe_Crab_Returning_To_Sea_After_Spawning_Per_%28111773087%29.jpeg', credit:'Steve Droter/CBF, CC BY 2.0'},
  'platyhelminthes':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Dugesia_tigrina.jpg/320px-Dugesia_tigrina.jpg', credit:'Alejandro Sánchez Alvarado, CC BY 2.5'},
  'planarian':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Dugesia_tigrina.jpg/320px-Dugesia_tigrina.jpg', credit:'Alejandro Sánchez Alvarado, CC BY 2.5'},
  'tardigrada':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png/320px-SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png', credit:'Schokraie et al., CC BY 2.5'},
  'mollusca':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Octopus3.jpg/320px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'cephalopods':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Octopus3.jpg/320px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'octopus':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Octopus3.jpg/320px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'octopus-day':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Octopus3.jpg/320px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'nautilus':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Nautilus_pompilius_3.jpg/320px-Nautilus_pompilius_3.jpg', credit:'Profberger, CC BY-SA 4.0'},
  'echinodermata':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Coral_reef_at_palmyra.jpg/320px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'chordata':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg/320px-Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg', credit:'Citron, CC BY-SA 3.0'},
  'sarcopterygii':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg/320px-Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg', credit:'Citron, CC BY-SA 3.0'},
  'chondrichthyes':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'actinopterygii':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg/320px-Clown_fish_in_the_Andaman_Coral_Reef.jpg', credit:'Ritiks, CC BY-SA 3.0'},
  'fish':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'sharks':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'white-shark':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'coelacanth':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg/320px-Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg', credit:'Citron, CC BY-SA 3.0'},
  'amphibia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ranoidea_caerulea_-_Wilhelma_01.jpg/320px-Ranoidea_caerulea_-_Wilhelma_01.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'reptilia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg/320px-Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'komodo-dragon':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg/320px-Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'tuatara':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sphenodon_punctatus_in_Waikanae%2C_New_Zealand.jpg/320px-Sphenodon_punctatus_in_Waikanae%2C_New_Zealand.jpg', credit:'KeresH, CC BY-SA 3.0'},
  'aves':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Falco_peregrinus_-_01.jpg/320px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'birds':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Falco_peregrinus_-_01.jpg/320px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'archaeopteryx':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Archaeopteryx_lithographica_%28Berlin_specimen%29.jpg/320px-Archaeopteryx_lithographica_%28Berlin_specimen%29.jpg', credit:'H. Raab, CC BY-SA 3.0'},
  'peregrine-falcon':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Falco_peregrinus_-_01.jpg/320px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'mammalia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Humpback_whales_in_singing_position.jpg/320px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'cetaceans':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Humpback_whales_in_singing_position.jpg/320px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'blue-whale':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg/640px-Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg', credit:'NOAA, Public Domain'},
  'naked-mole-rat':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Model_of_naked_mole-rat_soldiers%2C_workers%2C_and_queen.jpg/320px-Model_of_naked_mole-rat_soldiers%2C_workers%2C_and_queen.jpg', credit:'Jedimentat44, CC BY 2.0'},
  'platypus':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Duck-billed_platypus_%28Ornithorhynchus_anatinus%29_Scottsdale.jpg/320px-Duck-billed_platypus_%28Ornithorhynchus_anatinus%29_Scottsdale.jpg', credit:'Stefan Kraft, CC BY-SA 3.0'},
  'african-elephant':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  // Primates & great apes
  'primates':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/A_chimpanzee_at_the_Kumasi_Zoo.jpg/320px-A_chimpanzee_at_the_Kumasi_Zoo.jpg', credit:'Thomas Lersch, CC BY-SA 3.0'},
  'great-apes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Gorilla_Male_Global.jpg/320px-Gorilla_Male_Global.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'gorilla':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Gorilla_Male_Global.jpg/320px-Gorilla_Male_Global.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'orangutan':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Orang_Utan%2C_Semenggok_Forest_Reserve%2C_Sarawak%2C_Borneo%2C_Malaysia.JPG/640px-Orang_Utan%2C_Semenggok_Forest_Reserve%2C_Sarawak%2C_Borneo%2C_Malaysia.JPG', credit:'Thorsten Bachner, CC BY-SA 3.0'},
  'chimpanzee':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/A_chimpanzee_at_the_Kumasi_Zoo.jpg/320px-A_chimpanzee_at_the_Kumasi_Zoo.jpg', credit:'Thomas Lersch, CC BY-SA 3.0'},
  'homo-sapiens':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Woman_from_Akha_tribe.jpg/320px-Woman_from_Akha_tribe.jpg', credit:'Steve Evans, CC BY 2.0'},
  // Protists
  'protists':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Diatoms_through_the_microscope.jpg/320px-Diatoms_through_the_microscope.jpg', credit:'Wipeter, CC BY-SA 3.0'},
  'alveolates':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ceratium_tripos.jpg/320px-Ceratium_tripos.jpg', credit:'NOAA, Public Domain'},
  'plasmodium':            {url:'https://upload.wikimedia.org/wikipedia/commons/f/fc/Plasmodium_falciparum_01.png', credit:'CDC, Public Domain'},
  'dinoflagellates':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ceratium_tripos.jpg/320px-Ceratium_tripos.jpg', credit:'NOAA, Public Domain'},
  'diatoms':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Diatoms_through_the_microscope.jpg/320px-Diatoms_through_the_microscope.jpg', credit:'Wipeter, CC BY-SA 3.0'},
  'phytophthora':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tomato_with_Phytophthora_infestans_%28late_blight%29.jpg/320px-Tomato_with_Phytophthora_infestans_%28late_blight%29.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'amoeba':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Amoeba_proteus_with_many_pseudopodia.jpg/320px-Amoeba_proteus_with_many_pseudopodia.jpg', credit:'Deuterostome, CC BY-SA 3.0'},
  'volvox':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Volvox_aureus_3_Ansichten.jpg/320px-Volvox_aureus_3_Ansichten.jpg', credit:'Frank Fox, CC BY-SA 3.0'},
  // Hominin fossils
  'homo-naledi':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Homo_naledi_cranial_paratypes.jpg/320px-Homo_naledi_cranial_paratypes.jpg', credit:'Lee Roger Berger, CC BY 4.0'},
  'h_naledi':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Homo_naledi_cranial_paratypes.jpg/320px-Homo_naledi_cranial_paratypes.jpg', credit:'Lee Roger Berger, CC BY 4.0'},
  'homo-floresiensis':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Homo_floresiensis_cave.jpg/320px-Homo_floresiensis_cave.jpg', credit:'Rosino, CC BY-SA 2.0'},
  'h_floresiensis':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Homo_floresiensis_cave.jpg/320px-Homo_floresiensis_cave.jpg', credit:'Rosino, CC BY-SA 2.0'},
  'h_luzonensis':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Callao_Eco_Tourism_Zone.jpg/320px-Callao_Eco_Tourism_Zone.jpg', credit:'Judgefloro, CC0'},
  'denisovan':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Denisova_cave_01.jpg/320px-Denisova_cave_01.jpg', credit:'Демин Алексей Барнаул, CC BY-SA 3.0'},
  'h_neanderthalensis':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Homo_neanderthalensis.jpg/320px-Homo_neanderthalensis.jpg', credit:'Erich Ferdinand, CC BY 2.0'},
  'h_erectus':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Turkana_Boy_at_Nairobi_National_Museum.jpg/320px-Turkana_Boy_at_Nairobi_National_Museum.jpg', credit:'Locutus Borg, CC BY-SA 3.0'},
  'h_heidelbergensis':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Homo_heidelbergensis.004_-_Domus_%28A_Coru%C3%B1a%29.jpg/320px-Homo_heidelbergensis.004_-_Domus_%28A_Coru%C3%B1a%29.jpg', credit:'Cicero Moraes, CC BY-SA 3.0'},
  'h_habilis':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Homo_habilis.jpg/320px-Homo_habilis.jpg', credit:'Lillyundfreya, CC BY-SA 2.5'},
  'au_afarensis':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Lucy_Skeleton.jpg/320px-Lucy_Skeleton.jpg', credit:'Cleveland Museum, CC BY 4.0'},
  'au_africanus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Australopithecus_africanus_-_Cast_of_taung_child.jpg/320px-Australopithecus_africanus_-_Cast_of_taung_child.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'sahelanthropus':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg/320px-Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg', credit:'Didier Descouens, CC BY-SA 4.0'},
  'ardipithecus_r':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ardipithecus_ramidus.jpg/320px-Ardipithecus_ramidus.jpg', credit:'Science, Educational use'},
  // ── Tree node ID aliases (correcting naming mismatches) ──
  'plantae':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/640px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'mimosa-pudica':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Close-up_of_Sensitive_Plant_%28Mimosa_pudica%29_Leaves_at_Night.jpg/320px-Close-up_of_Sensitive_Plant_%28Mimosa_pudica%29_Leaves_at_Night.jpg', credit:'Hrushikesh, CC BY-SA 3.0'},
  'wollemia':              {url:'https://upload.wikimedia.org/wikipedia/commons/5/5d/Wollemia_bark.JPG', credit:'Brent Miller, CC BY 2.0'},
  'animalia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Invertebrate_montage_%282022%29.jpg/640px-Invertebrate_montage_%282022%29.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'insects':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/640px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'shark':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'reptiles':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg/320px-Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'amphibians':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ranoidea_caerulea_-_Wilhelma_01.jpg/320px-Ranoidea_caerulea_-_Wilhelma_01.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'mammals':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Humpback_whales_in_singing_position.jpg/320px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'cnidarians':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Turritopsis_nutricula_Kamo.jpg/320px-Turritopsis_nutricula_Kamo.jpg', credit:'Bachware, Public Domain'},
  'echinoderms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Echinoderm_collage_2.jpg/640px-Echinoderm_collage_2.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'coral':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Coral_reef_at_palmyra.jpg/320px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'amoeba-proteus':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Amoeba_proteus_with_many_pseudopodia.jpg/320px-Amoeba_proteus_with_many_pseudopodia.jpg', credit:'Deuterostome, CC BY-SA 3.0'},
  'neanderthal':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Homo_neanderthalensis.jpg/320px-Homo_neanderthalensis.jpg', credit:'Erich Ferdinand, CC BY 2.0'},
  'denisovans':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Denisova_cave_01.jpg/320px-Denisova_cave_01.jpg', credit:'Демин Алексей Барнаул, CC BY-SA 3.0'},
  'h_sapiens':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Woman_from_Akha_tribe.jpg/320px-Woman_from_Akha_tribe.jpg', credit:'Steve Evans, CC BY 2.0'},
  // ── New entries for previously missing tree nodes ──
  'nostoc':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Nostoc_commune.jpg/640px-Nostoc_commune.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'spirochetes':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Treponema_pallidum.jpg/640px-Treponema_pallidum.jpg', credit:'CDC, Public Domain'},
  'euryarchaeota':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Thermococcus_gammatolerans.jpg/640px-Thermococcus_gammatolerans.jpg', credit:'Xaviermartin, CC BY-SA 3.0'},
  'asgard':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Blacksmoker_in_Atlantic_Ocean.jpg/640px-Blacksmoker_in_Atlantic_Ocean.jpg', credit:'NOAA/P. Rona, OAR/NURP, Public Domain'},
  'eukaryota':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Rhodomonas_salina_CCMP_322_%28cropped%29.jpg/640px-Rhodomonas_salina_CCMP_322_%28cropped%29.jpg', credit:'Javier Arístegui, CC BY 4.0'},
  'bryophytes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/MarchantiophytaSp.NonD%C3%A9termin%C3%A9eFL3.jpg/640px-MarchantiophytaSp.NonD%C3%A9termin%C3%A9eFL3.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'invertebrates':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Invertebrate_montage_%282022%29.jpg/640px-Invertebrate_montage_%282022%29.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'vertebrates':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Vertebrata_002.png/640px-Vertebrata_002.png', credit:'Wikipedia, CC BY-SA 3.0'},
  'annelids':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Annelida_collage_%282%29.png/640px-Annelida_collage_%282%29.png', credit:'Wikipedia, CC BY-SA 4.0'},
  'hominini':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/A_chimpanzee_at_the_Kumasi_Zoo.jpg/320px-A_chimpanzee_at_the_Kumasi_Zoo.jpg', credit:'Thomas Lersch, CC BY-SA 3.0'},
  'amoebozoa':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Leocarpus_fragilis_10649909.jpg/640px-Leocarpus_fragilis_10649909.jpg', credit:'Zack Abbey, CC BY 4.0'},
  'paramecium':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Paramecium.jpg/640px-Paramecium.jpg', credit:'Barfooz, CC BY-SA 3.0'},
  'stramenopiles':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Stramenopiles_diversity.png/640px-Stramenopiles_diversity.png', credit:'Wikipedia, CC BY-SA 4.0'},
  // ── Missing hominin fossil entries ──
  'orrorin':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Orrorin_tugenensis.jpg/640px-Orrorin_tugenensis.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'kenyanthropus':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Kenyanthropus_platyops-MGL_95210-P5030042-white.jpg/640px-Kenyanthropus_platyops-MGL_95210-P5030042-white.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'au_anamensis':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Australopithecus_anamensis_skull.png/640px-Australopithecus_anamensis_skull.png', credit:'Wikipedia, CC BY-SA 4.0'},
  'au_bahrelghazali':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Abel_australopithecus.png/640px-Abel_australopithecus.png', credit:'Wikipedia, CC BY-SA 3.0'},
  'au_deyiremeda':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Australopithecus_deyiremeda.png/640px-Australopithecus_deyiremeda.png', credit:'Wikipedia, CC BY-SA 4.0'},
  'au_prometheus':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Australopithecus_africanus_-_Cast_of_taung_child.jpg/320px-Australopithecus_africanus_-_Cast_of_taung_child.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'au_garhi':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Resti_di_australopithecus_garhi%2C_da_bouri_in_afar%2C_2%2C5_milioni_di_anni_fa.jpg/640px-Resti_di_australopithecus_garhi%2C_da_bouri_in_afar%2C_2%2C5_milioni_di_anni_fa.jpg', credit:'Sailko, CC BY-SA 3.0'},
  'au_sediba':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Australopithecus_sediba.JPG/640px-Australopithecus_sediba.JPG', credit:'Brett Eloff, CC BY-SA 3.0'},
  'par_aethiopicus':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Paranthropus_aethiopicus.JPG/640px-Paranthropus_aethiopicus.JPG', credit:'Wikipedia, CC BY-SA 3.0'},
  'par_robustus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Original_of_Paranthropus_robustus_Face.jpg/640px-Original_of_Paranthropus_robustus_Face.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'par_boisei':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Australophithecus_boisei_%28cast%29%2C_Olduvai_Gorge_-_Springfield_Science_Museum_-_Springfield%2C_MA_-_DSC03368.JPG/640px-Australophithecus_boisei_%28cast%29%2C_Olduvai_Gorge_-_Springfield_Science_Museum_-_Springfield%2C_MA_-_DSC03368.JPG', credit:'Daderot, CC0'},
  'h_rudolfensis':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/KNM_ER_1470_%28H._rudolfensis%29.png/640px-KNM_ER_1470_%28H._rudolfensis%29.png', credit:'Wikipedia, CC BY-SA 4.0'},
  'h_bodoensis':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Rhodesian_Man.jpg/640px-Rhodesian_Man.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'h_antecessor':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Reproducciones_del_cr%C3%A1neo_%28frontal_ATD6-15_%29_y_mand%C3%ADbula_%28parte_del_esqueleto_facial_ATD6-69%29_del_Ni%C3%B1o_de_la_Gran_Dolina_%28Hom%C3%ADnido_3%29._Museo_Arqueol%C3%B3gico_Nacional_de_Espa%C3%B1a.jpg/640px-thumbnail.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'h_longi':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Homo_longi_holotype.jpg/640px-Homo_longi_holotype.jpg', credit:'Kai Geng, CC BY 4.0'},
  // ── Remaining missing nodes ──
  'methanobacterium':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Sn%C3%ADmek_ze_skenovac%C3%ADho_elektronov%C3%A9ho_mikroskopu_Methanobacterium_formicicum.jpg/640px-Sn%C3%ADmek_ze_skenovac%C3%ADho_elektronov%C3%A9ho_mikroskopu_Methanobacterium_formicicum.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'group-proto':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg/320px-Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg', credit:'Didier Descouens, CC BY-SA 4.0'},
  'group-australopith':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Mrs_Ples_Face.jpg/640px-Mrs_Ples_Face.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'group-paranthropus':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Original_of_Paranthropus_robustus_Face.jpg/640px-Original_of_Paranthropus_robustus_Face.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'group-homo':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Woman_from_Akha_tribe.jpg/320px-Woman_from_Akha_tribe.jpg', credit:'Steve Evans, CC BY 2.0'},
  // ── P32 EXPANSION SPECIES ──
  'venus-flytrap':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Venus_Flytrap_showing_trigger_hairs.jpg/330px-Venus_Flytrap_showing_trigger_hairs.jpg', credit:'NoahElhardt, CC BY 2.5'},
  'baobab':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Adansonia_grandidieri04.jpg/330px-Adansonia_grandidieri04.jpg', credit:'Bernard Gagnon, CC BY-SA 3.0'},
  'ginkgo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Ginkgo_biloba_leaves.jpg/330px-Ginkgo_biloba_leaves.jpg', credit:'Joe Mabel, CC BY-SA 3.0'},
  'orchid':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ophrys_apifera_flower1.jpg/330px-Ophrys_apifera_flower1.jpg', credit:'BerndH, CC BY-SA 3.0'},
  'sunflower':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/320px-Sunflower_sky_backdrop.jpg', credit:'Kevin Connors, Public Domain'},
  'cordyceps':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Cordyceps_sinensis.jpg/330px-Cordyceps_sinensis.jpg', credit:'Biodiversity Heritage Library, Public Domain'},
  'death-cap':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Amanita_phalloides_1.JPG/320px-Amanita_phalloides_1.JPG', credit:'Archenzo, CC BY-SA 3.0'},
  'tardigrade':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png/320px-SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png', credit:'Schokraie et al., CC BY 2.5'},
  'monarch-butterfly':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Monarch_In_May.jpg/320px-Monarch_In_May.jpg', credit:'Kenneth Dwain Harrelson, CC BY-SA 3.0'},
  'golden-orb-spider':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Nephila_clavipes_2004.JPG/330px-Nephila_clavipes_2004.JPG', credit:'Judy Gallagher, CC BY 2.0'},
  'giant-squid':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Giant_squid_melb_aquarium03.jpg/330px-Giant_squid_melb_aquarium03.jpg', credit:'Mgiganteus, CC BY-SA 3.0'},
  'box-jellyfish':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Avispa_marina_cropped.png/330px-Avispa_marina_cropped.png', credit:'Guido Gautsch, CC BY-SA 2.0'},
  'axolotl':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Ambystoma_mexicanum.jpg/330px-Ambystoma_mexicanum.jpg', credit:'th1098, CC BY-SA 2.0'},
  'golden-poison-frog':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Golden_Poison_dart_frog_Phyllobates_terribilis.jpg/330px-Golden_Poison_dart_frog_Phyllobates_terribilis.jpg', credit:'Wilfried Berns, CC BY-SA 2.0 DE'},
  'whale-shark':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Whale_shark_Georgia_aquarium.jpg/330px-Whale_shark_Georgia_aquarium.jpg', credit:'Zac Wolf, CC BY-SA 2.5'},
  'seahorse':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Long-snouted_Seahorse_-_Hippocampus_guttulatus.jpg/330px-Long-snouted_Seahorse_-_Hippocampus_guttulatus.jpg', credit:'Florin DUMITRESCU, CC BY-SA 4.0'},
  'anglerfish':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Lophius_piscatorius_MHNT.jpg/330px-Lophius_piscatorius_MHNT.jpg', credit:'Didier Descouens, CC BY-SA 4.0'},
  'manta-ray':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Manta_birostris-Thailand4.jpg/330px-Manta_birostris-Thailand4.jpg', credit:'Jon Hanson, CC BY-SA 2.0'},
  'emperor-penguin':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Emperor_Penguin_Manchot_empereur.jpg/320px-Emperor_Penguin_Manchot_empereur.jpg', credit:'Samuel Blanc, CC BY-SA 3.0'},
  'wandering-albatross':   {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Diomedea_exulans_in_flight_-_SE_Tasmania.jpg/330px-Diomedea_exulans_in_flight_-_SE_Tasmania.jpg', credit:'JJ Harrison, CC BY-SA 3.0'},
  'bald-eagle':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg/330px-Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg', credit:'Andy Morffew, CC BY 2.0'},
  'kakapo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Kakapo_Sirocco_1.jpg/330px-Kakapo_Sirocco_1.jpg', credit:'Department of Conservation, CC BY 2.0'},
  'african-elephant':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/320px-African_Bush_Elephant.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'tiger':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg', credit:'S. Taheri, CC BY-SA 3.0'},
  'lion':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/320px-Lion_waiting_in_Namibia.jpg', credit:'Kevin Pluck, CC BY 2.0'},
  'wolf':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Canis_lupus_laying_in_grass.jpg/330px-Canis_lupus_laying_in_grass.jpg', credit:'Retron, CC BY-SA 3.0'},
  'polar-bear':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Ursus_maritimus_Steve_Amstrup.jpg/330px-Ursus_maritimus_Steve_Amstrup.jpg', credit:'Steve Amstrup/USGS, Public Domain'},
  'pangolin':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Ground_Pangolin_at_Madikwe_Game_Reserve.jpg/330px-Ground_Pangolin_at_Madikwe_Game_Reserve.jpg', credit:'David Brossard, CC BY-SA 2.0'},
  'giraffe':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/320px-Giraffe_Mikumi_National_Park.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'koala':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Koala_climbing_tree.jpg/320px-Koala_climbing_tree.jpg', credit:'David Iliff, CC BY-SA 3.0'},
  'snow-leopard':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Irbis4.JPG/330px-Irbis4.JPG', credit:'Bernard Landgraf, CC BY-SA 3.0'},
  'orca':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Killerwhales_jumping.jpg/320px-Killerwhales_jumping.jpg', credit:'Robert Pitman, Public Domain'},
  'red-panda':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/RedPandaFullBody.JPG/320px-RedPandaFullBody.JPG', credit:'Greg Hume, CC BY-SA 3.0'},
  'bonobo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Bonobo_009.jpg/330px-Bonobo_009.jpg', credit:'Pierre Fidenci, CC BY-SA 2.5'},
  'saltwater-crocodile':   {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Crocodylus_porosus_-_Wilhelma.jpg/330px-Crocodylus_porosus_-_Wilhelma.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'green-sea-turtle':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Green_turtle_swimming_over_coral_reefs_in_Kona.jpg/330px-Green_turtle_swimming_over_coral_reefs_in_Kona.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'king-cobra':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Ophiophagus_hannah2.jpg/330px-Ophiophagus_hannah2.jpg', credit:'Michael Allen Smith, CC BY-SA 2.0'},
  'chameleon':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Panther_chameleon_%28Furcifer_pardalis%29_male_Nosy_Be.jpg/330px-Panther_chameleon_%28Furcifer_pardalis%29_male_Nosy_Be.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'slime-mold':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Physarum_polycephalum_plasmodium.jpg/330px-Physarum_polycephalum_plasmodium.jpg', credit:'Frankenstoen, CC BY 2.0'},
  'toxoplasma':            {url:'https://upload.wikimedia.org/wikipedia/commons/3/39/Toxoplasma_gondii_tachy.jpg', credit:'Ke Hu and John Murray, CC BY 4.0'},
  'kelp':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Kelp_forest_Otago_1s.JPG/330px-Kelp_forest_Otago_1s.JPG', credit:'Stef Maruch, CC BY-SA 2.0'},
  // ── New species with scientific classification ──
  'chinese-giant-salamander':{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Velemlok_%C4%8D%C3%ADnsk%C3%BD_zoo_praha_1.jpg/640px-Velemlok_%C4%8D%C3%ADnsk%C3%BD_zoo_praha_1.jpg', credit:'Petr Hamernik, CC BY-SA 4.0'},
  'clownfish':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg/640px-Clown_fish_in_the_Andaman_Coral_Reef.jpg', credit:'Ritiks, CC BY-SA 3.0'},
  'hummingbird':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Archilochus_colubris_-flying_-male-8.jpg/640px-Archilochus_colubris_-flying_-male-8.jpg', credit:'jeffreyw, CC BY 2.0'},
  'african-grey-parrot':   {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Perroquet_%C3%A0_Yampopo_Beach_-_Douala.jpg/640px-Perroquet_%C3%A0_Yampopo_Beach_-_Douala.jpg', credit:'Florettesokeng, CC BY-SA 4.0'},
  'flying-fox':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Wilhelma_Kalong-Flughund_Pteropus_vampyrus_0513.jpg/640px-Wilhelma_Kalong-Flughund_Pteropus_vampyrus_0513.jpg', credit:'NobbiP, CC BY-SA 3.0'},
  'gray-wolf':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Eurasian_wolf_2.jpg/640px-Eurasian_wolf_2.jpg', credit:'Mas3cf, CC BY-SA 4.0'},
  'bottlenose-dolphin':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Tursiops_truncatus_01-cropped.jpg/640px-Tursiops_truncatus_01-cropped.jpg', credit:'NASA, Public domain'},
  'three-toed-sloth':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bradypus.jpg/640px-Bradypus.jpg', credit:'Stefan Laube, Public domain'},
  'leaf-cutter-ant':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Atta_cephalotes-pjt.jpg/640px-Atta_cephalotes-pjt.jpg', credit:'Pjt56, CC BY-SA 4.0'},
  'dragonfly':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Common_Green_Darner_Anax_junius_JG.jpg/640px-Common_Green_Darner_Anax_junius_JG.jpg', credit:'JeffreyGammon, CC BY 4.0'},
  'common-earthworm':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Regenwurm1.jpg/640px-Regenwurm1.jpg', credit:'Michael Linnenbach, CC BY-SA 3.0'},
  'common-starfish':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Asterias_rubens.jpg/640px-Asterias_rubens.jpg', credit:'Hans Hillewaert, CC BY-SA 4.0'},
  'giant-panda':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/320px-Grosser_Panda.JPG', credit:'J. Patrick Fischer, CC BY-SA 3.0'},
  'red-kangaroo':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Kangaroo_and_joey03.jpg/320px-Kangaroo_and_joey03.jpg', credit:'fir0002, GFDL 1.2'},
  'moose':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Moose_superior.jpg/320px-Moose_superior.jpg', credit:'USDA, Public Domain'},
  'hippopotamus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Hippopotamus_in_Serengeti.jpg/320px-Hippopotamus_in_Serengeti.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'wolverine':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Wolverine_on_rock.jpg/320px-Wolverine_on_rock.jpg', credit:'Zefram, CC BY-SA 3.0'},
  'humpback-whale':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Humpback_stellwagen_edit.jpg/320px-Humpback_stellwagen_edit.jpg', credit:'Whit Welles, CC BY 3.0'},
  'narwhal':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Narval_adulte.jpg/320px-Narval_adulte.jpg', credit:'Ansgar Walk, CC BY-SA 2.5'},
  'sea-otter':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sea_otter_cropped.jpg/320px-Sea_otter_cropped.jpg', credit:'Marshal Hedin, CC BY-SA 2.0'},
  'condor':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Gymnogyps_californianus_-San_Diego_Zoo-8a.jpg/320px-Gymnogyps_californianus_-San_Diego_Zoo-8a.jpg', credit:'Stacy, CC BY 2.0'},
  'flamingo':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Flamingos_in_Tanzania.jpg/320px-Flamingos_in_Tanzania.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'barn-owl':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tyto_Alba_10_%28Bohushan%29.jpg/320px-Tyto_Alba_10_%28Bohushan%29.jpg', credit:'Bohushan, Public Domain'},
  'cassowary':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cassowary_1.jpg/320px-Cassowary_1.jpg', credit:'Mfield, CC BY-SA 3.0'},
  'electric-eel':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Electric_eel_2.jpg/320px-Electric_eel_2.jpg', credit:'Steven G. Johnson, CC BY-SA 3.0'},
  'poison-dart-frog':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Oophaga_pumilio_-_Ranita_roja.jpg/320px-Oophaga_pumilio_-_Ranita_roja.jpg', credit:'Geoff Gallice, CC BY 2.0'},
  'firefly':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Firefly_in_the_Night.jpg/320px-Firefly_in_the_Night.jpg', credit:'Quit007, CC BY-SA 3.0'},
  'atlas-moth':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Attacus_atlas_male.jpg/320px-Attacus_atlas_male.jpg', credit:'Quartl, CC BY-SA 3.0'},
  'army-ant':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Eciton_burchellii_army_ants_nick_hobgood.jpg/320px-Eciton_burchellii_army_ants_nick_hobgood.jpg', credit:'Nick Hobgood, CC BY-SA 3.0'},
  'japanese-spider-crab':  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Macrocheira_kaempferi.jpg/320px-Macrocheira_kaempferi.jpg', credit:'OpenCage, CC BY-SA 2.5'},
  'garden-spider':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Argiope_aurantia_2.jpg/320px-Argiope_aurantia_2.jpg', credit:'Luc Viatour, CC BY-SA 3.0'},
  'hermit-crab':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Pagurus_samuelis.jpg/320px-Pagurus_samuelis.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'portuguese-man-o-war':  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Portuguese_Man-O-War_%28Physalia_physalis%29_2.jpg/320px-Portuguese_Man-O-War_%28Physalia_physalis%29_2.jpg', credit:'Volkan Yuksel, CC BY-SA 3.0'},
  'hammerhead-shark':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Great_Hammerhead_Shark.jpg/320px-Great_Hammerhead_Shark.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'water-lily':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Nymphaea_alba_-_flower_surface.jpg/320px-Nymphaea_alba_-_flower_surface.jpg', credit:'Abrahami, CC BY-SA 3.0'},
  'bamboo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Bamboo_in_Rockefeller_Forest.jpg/320px-Bamboo_in_Rockefeller_Forest.jpg', credit:'Cntras, CC BY-SA 3.0'},
  'cactus':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Carnegiea_gigantea_in_Arizona.jpg/320px-Carnegiea_gigantea_in_Arizona.jpg', credit:'Derek Ramsey, GFDL 1.2'},
  'sundew':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Drosera_capensis1.jpg/320px-Drosera_capensis1.jpg', credit:'Noah Elhardt, CC BY 2.5'},
  'truffle':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Tuber_melanosporum.jpg/320px-Tuber_melanosporum.jpg', credit:'Archenzo, CC BY-SA 3.0'},
  'chanterelle':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Cantharellus_cibarius_2.jpg/320px-Cantharellus_cibarius_2.jpg', credit:'Archenzo, CC BY-SA 3.0'},
  'lichen':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Flavoparmelia_caperata.jpg/320px-Flavoparmelia_caperata.jpg', credit:'Jason Hollinger, CC BY 2.0'},
  'euglena':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Euglena_diagram.svg/320px-Euglena_diagram.svg.png', credit:'Claudio Miklos, CC BY 2.5'},
  'radiolarian':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Haeckel_Radiolaria.jpg/320px-Haeckel_Radiolaria.jpg', credit:'Ernst Haeckel, Public Domain'},
  'stentor':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Stentor_coeruleus.jpg/320px-Stentor_coeruleus.jpg', credit:'Picturepest, CC BY 2.0'},
};

const GREAT_APE_IDS = ['great-apes','gorilla','orangutan','chimpanzee','hominini'];
const HOMININ_IDS   = ['homo-sapiens','h_erectus','h_habilis','h_neanderthalensis','h_heidelbergensis','h_floresiensis','h_naledi','h_luzonensis','denisovan','au_afarensis','au_africanus','sahelanthropus','ardipithecus_r'];
