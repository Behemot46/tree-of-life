// ══════════════════════════════════════════════════════
// SPECIES DATA — enrichment, photos, wiki mappings
// ══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
// SPECIES ENRICHMENT — alt facts + educational links
// ══════════════════════════════════════════════════════
export const ENRICHMENT = {
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
  'dolphin': {
    altFacts:[
      'Dolphins sleep with one eye open — literally. One brain hemisphere stays awake while the other rests, a trick called unihemispheric sleep.',
      'A bottlenose dolphin\'s echolocation is so precise it can detect a ping-pong ball from 100 meters away and distinguish between objects differing by less than a millimeter in size.',
      'Dolphins and whales share a common ancestor with hippos — a wolf-sized land mammal called Pakicetus that returned to the sea roughly 50 million years ago.',
      'The word "dolphin" comes from the Greek delphis, meaning "womb," because the Greeks recognized them as mammals that bear live young.',
      'Dolphins have been observed using sea sponges as nose guards while foraging on the seafloor — one of the few examples of tool use in marine mammals.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Bottlenose_dolphin'},
      {label:'NOAA Fisheries', url:'https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/bottlenose-dolphin'},
    ]
  },
  'echidna': {
    altFacts:[
      'Echidnas are one of only five surviving species of monotremes — egg-laying mammals that have persisted for over 200 million years, predating the dinosaur extinction.',
      'An echidna\'s snout contains electroreceptors that detect the faint electrical signals of insect muscles, making it the only land mammal with this sixth sense.',
      'Despite looking like hedgehogs, echidnas are more closely related to platypuses — both lineages split from other mammals before the marsupial–placental divide.',
      'Echidnas were named after a half-woman, half-serpent creature from Greek mythology, reflecting early European puzzlement at an animal that seemed half-mammal, half-reptile.',
      'Baby echidnas are called puggles. They hatch from leathery eggs after about 10 days, then spend months in their mother\'s pouch lapping up milk that oozes from patches of skin — echidnas have no nipples.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Echidna'},
      {label:'Australian Museum', url:'https://australian.museum/learn/animals/mammals/short-beaked-echidna/'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/echidna'},
    ]
  },
  'white-rhinoceros': {
    altFacts:[
      'The "white" in white rhinoceros is a mistranslation of the Afrikaans word wijd (wide), describing its broad, square lip — it has nothing to do with color.',
      'A white rhino can weigh over 2,300 kg, making it the second-largest land animal after the elephant and capable of reaching 50 km/h in short bursts despite its bulk.',
      'Rhinos are odd-toed ungulates, placing them in the same order as horses and tapirs — a surprising family reunion considering their vastly different appearances.',
      'The northern white rhinoceros is functionally extinct with only two females surviving, but scientists are attempting to revive the subspecies using IVF with stored sperm and stem cell technology.',
      'Rhino horn is made entirely of keratin — the same protein in human fingernails — yet it has driven poaching that killed over 1,000 rhinos per year in the 2010s.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/White_rhinoceros'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/white-rhino'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/4185/16980466'},
    ]
  },
  'cheetah': {
    altFacts:[
      'Cheetahs can accelerate from 0 to 100 km/h in just three seconds — faster than most sports cars — making them the fastest land animal on Earth.',
      'A cheetah\'s semi-retractable claws and hard foot pads work like cleats, and its oversized nasal passages allow massive oxygen intake during high-speed chases.',
      'Cheetahs are more closely related to house cats than to leopards or jaguars — they split from the Felis lineage about 6.7 million years ago.',
      'All living cheetahs are so genetically similar they can accept skin grafts from any other cheetah without rejection — the result of a population bottleneck roughly 10,000 years ago.',
      'Unlike other big cats, cheetahs cannot roar. Instead, they chirp like birds and purr like domestic cats.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Cheetah'},
      {label:'Cheetah Conservation Fund', url:'https://cheetah.org/'},
      {label:'Smithsonian National Zoo', url:'https://nationalzoo.si.edu/animals/cheetah'},
    ]
  },
  'manatee': {
    altFacts:[
      'Manatees are the likely inspiration for mermaid legends — Christopher Columbus reported seeing "mermaids" off Haiti in 1493, almost certainly manatees.',
      'A manatee replaces its teeth continuously from back to front throughout its life, a conveyor-belt system shared only with kangaroos among mammals.',
      'Despite being fully aquatic, manatees\' closest living relative is the elephant — they share a common ancestor from about 60 million years ago.',
      'The name "manatee" derives from the Carib word manati, meaning "breast," referring to the way mothers nurse calves at chest-level flippers.',
      'Manatees have no natural predators and can live over 60 years, yet they face serious threats from boat strikes — propeller scars mark the majority of Florida\'s manatee population.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Manatee'},
      {label:'U.S. Fish & Wildlife', url:'https://www.fws.gov/species/west-indian-manatee-trichechus-manatus'},
      {label:'Save the Manatee Club', url:'https://www.savethemanatee.org/'},
    ]
  },
  'beaver': {
    altFacts:[
      'Beavers are the only animals besides humans that deliberately reshape entire landscapes — a single beaver family can create a wetland ecosystem that supports hundreds of species.',
      'Beaver teeth never stop growing and are self-sharpening: the front enamel is harder than the back, so chewing wears a permanent chisel edge.',
      'Beavers are rodents, placing them in the same order as mice and capybaras — the second-largest rodent alive, after the capybara.',
      'The beaver appears on the Canadian nickel and was once so valuable for its fur that it served as currency in colonial North America — the Hudson\'s Bay Company literally priced goods in beaver pelts.',
      'Beaver dams can be enormous: the longest known dam, in Alberta, Canada, stretches 850 meters and is visible from space.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Beaver'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/beavers'},
      {label:'Beaver Institute', url:'https://www.beaverinstitute.org/'},
    ]
  },
  'capybara': {
    altFacts:[
      'The capybara is the world\'s largest living rodent, weighing up to 65 kg — essentially a guinea pig scaled up to the size of a large dog.',
      'Capybaras are semi-aquatic and can hold their breath for up to five minutes, with eyes, ears, and nostrils positioned on top of the head like a hippo.',
      'As rodents, capybaras share a surprisingly recent common ancestor with mice, rats, and beavers — they\'re basically giant, social, swimming guinea pigs.',
      'In 16th-century South America, the Catholic Church classified capybaras as fish for Lenten dietary purposes because they live in water — a ruling that technically still stands.',
      'Capybaras are famously tolerant, and dozens of other species — birds, monkeys, even crocodilians — have been photographed sitting on or beside them without conflict.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Capybara'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/capybara'},
      {label:'Smithsonian Magazine', url:'https://www.smithsonianmag.com/science-nature/why-capybaras-are-so-chill-180977440/'},
    ]
  },
  'armadillo': {
    altFacts:[
      'The nine-banded armadillo almost always gives birth to genetically identical quadruplets — the only mammal that routinely produces natural clones.',
      'An armadillo\'s bony shell is strong enough to deflect a low-caliber bullet, and the three-banded armadillo can roll into a perfectly sealed ball like a medieval knight.',
      'Armadillos are xenarthrans, an ancient South American lineage they share with sloths and anteaters — they crossed into North America only about 3 million years ago when the Isthmus of Panama formed.',
      'The word "armadillo" is Spanish for "little armored one," given by conquistadors who had never seen anything like these walking tanks.',
      'Armadillos are one of the few animals besides humans that can contract leprosy, making them invaluable to medical research on the disease.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Armadillo'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/nine-banded-armadillo'},
      {label:'Smithsonian National Zoo', url:'https://nationalzoo.si.edu/animals/nine-banded-armadillo'},
    ]
  },
  'gibbon': {
    altFacts:[
      'Gibbons are the fastest and most acrobatic of all primates, brachiating through trees at up to 55 km/h and covering 15-meter gaps in a single swing.',
      'A gibbon\'s arms are so long relative to its body that if a human had the same proportions, our fingertips would touch the ground while standing.',
      'Gibbons are apes, not monkeys — they\'re our closest relatives after the great apes, sharing about 96% of their DNA with humans.',
      'Mated gibbon pairs sing elaborate duets at dawn that can carry over two kilometers through the forest — each species has a unique song that helps prevent hybridization.',
      'Unlike great apes, gibbons are strictly monogamous and form lifelong pair bonds, with both parents sharing in the care of offspring.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Gibbon'},
      {label:'IUCN SSC Primate Specialist Group', url:'https://www.primate-sg.org/gibbons'},
      {label:'Gibbon Conservation Center', url:'https://www.gibboncenter.org/'},
    ]
  },
  'spotted-hyena': {
    altFacts:[
      'Spotted hyenas have the strongest bite force relative to body size of any mammal, capable of crushing giraffe bones to access the marrow inside.',
      'A spotted hyena\'s digestive system is so powerful it can dissolve bone, horns, and hooves — their droppings are chalky white from all the calcium.',
      'Despite looking dog-like, hyenas are more closely related to cats — they belong to the suborder Feliformia and split from the mongoose lineage about 29 million years ago.',
      'Female spotted hyenas outrank all males in the clan hierarchy and have masculinized genitalia so similar to males that even experienced researchers struggle to tell them apart.',
      'Spotted hyenas live in complex societies of up to 80 individuals with intricate social alliances, and research shows they can outperform chimpanzees in cooperative problem-solving tests.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Spotted_hyena'},
      {label:'IUCN Hyaena Specialist Group', url:'https://hyaenidae.org/'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/spotted-hyena'},
    ]
  },
  'meerkat': {
    altFacts:[
      'Meerkats post sentinels that stand upright scanning for predators and give different alarm calls for aerial vs. ground threats — each call triggers a specific escape behavior.',
      'Meerkat adults deliberately teach pups to handle scorpions by first bringing dead ones, then disabled ones, and finally live ones — one of the clearest examples of teaching in non-human animals.',
      'Meerkats are mongooses (family Herpestidae) and are more closely related to hyenas and cats than to any rodent they might resemble.',
      'The word "meerkat" comes from the Afrikaans for "lake cat," despite the fact that they live in arid deserts and have no particular affinity for water.',
      'Meerkats are immune to many venoms that would kill a similarly sized mammal, including the stings of scorpions and the bites of some snakes.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Meerkat'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/meerkat'},
      {label:'BBC Earth', url:'https://www.bbcearth.com/meerkats'},
    ]
  },
  'walrus': {
    altFacts:[
      'A walrus can eat 3,000 to 6,000 clams in a single feeding session, using sensitive whiskers — not its tusks — to detect them in murky Arctic sediment.',
      'Walrus tusks are actually elongated canine teeth that can grow up to a meter long and are used for hauling out onto ice, dominance displays, and defense against polar bears.',
      'Walruses are pinnipeds, closely related to seals and sea lions — all descended from a bear-like ancestor that took to the sea about 23 million years ago.',
      'The word "walrus" likely derives from Old Norse hrosshvalr, meaning "horse-whale," a fitting name for an animal that can weigh 1,800 kg.',
      'Walruses can slow their heart rate to conserve oxygen during dives and have special blood vessel networks that let them withstand icy water without losing core body heat.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Walrus'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/walrus'},
      {label:'NOAA Fisheries', url:'https://www.fisheries.noaa.gov/species/pacific-walrus'},
    ]
  },
  'dugong': {
    altFacts:[
      'Dugongs are the only strictly marine herbivorous mammal, spending their entire lives grazing on seagrass meadows — earning them the nickname "sea cow."',
      'A dugong can hold its breath for up to six minutes and uses its horseshoe-shaped snout as a vacuum cleaner to uproot entire seagrass plants from the seafloor.',
      'Dugongs are sirenians, sharing their order with manatees — and their closest land relative is the elephant, not the whale.',
      'Ancient sailors\' accounts of dugongs nursing their calves at the surface likely contributed to the mermaid and siren myths across the Indian and Pacific Oceans.',
      'Dugongs can live over 70 years, but they reproduce extremely slowly — a female may produce only five or six calves in her lifetime, making populations vulnerable to even modest threats.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Dugong'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/6909/160756767'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/dugong'},
    ]
  },
  'wombat': {
    altFacts:[
      'Wombats produce cube-shaped droppings — the only animal known to do so — likely an adaptation to stack scent markers on logs and rocks without them rolling away.',
      'A wombat\'s rear end is mostly cartilage and acts as a fortified shield: when threatened in its burrow, it blocks the entrance with its rump and can crush a predator\'s skull against the ceiling.',
      'Wombats are marsupials whose pouches open backward (toward the tail) so dirt doesn\'t fly in while they dig — they share this feature with koalas, their closest living relatives.',
      'The word "wombat" comes from the Dharug Aboriginal language of the Sydney region, making it one of the earliest Australian Indigenous words adopted into English (1798).',
      'Despite their stocky build, wombats can sprint at 40 km/h over short distances and maintain underground burrow systems stretching up to 200 meters.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Wombat'},
      {label:'Australian Museum', url:'https://australian.museum/learn/animals/mammals/common-wombat/'},
      {label:'Wombat Foundation', url:'https://www.wombatfoundation.com.au/'},
    ]
  },
  'hedgehog': {
    altFacts:[
      'A hedgehog has about 5,000 to 7,000 spines on its back, each lasting about a year before being replaced — and it can roll into a tight ball protected on all sides in under a second.',
      'Hedgehogs practice "self-anointing": when they encounter a new smell, they lick the source, whip up a frothy saliva, and spread it over their spines — the purpose is still debated by scientists.',
      'Despite their spiny appearance, hedgehogs are insectivores more closely related to shrews and moles than to porcupines, which are rodents on a completely different branch of the mammal tree.',
      'The word "hedgehog" dates to 1450s Middle English — "hedge" for their preferred habitat and "hog" for the pig-like snuffling sounds they make while foraging.',
      'Hedgehogs are naturally resistant to adder venom, though not fully immune, and will actively attack and eat snakes when given the opportunity.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Hedgehog'},
      {label:'Wildlife Trusts (UK)', url:'https://www.wildlifetrusts.org/wildlife-explorer/mammals/hedgehog'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/hedgehog'},
    ]
  },
  'jaguar': {
    altFacts:[
      'Jaguars have the strongest bite of any big cat relative to size — powerful enough to pierce a turtle shell or crush a caiman skull, and they\'re the only big cat that routinely kills by biting through the skull.',
      'Unlike most cats, jaguars love water and are excellent swimmers, regularly hunting caimans, fish, and capybaras in rivers and swamps.',
      'Jaguars and leopards look similar but diverged about 3 million years ago; jaguars have stockier builds, larger rosettes with central spots, and are native to the Americas while leopards are Old World cats.',
      'The name "jaguar" comes from the Tupi-Guarani word yaguara, meaning "beast that kills its prey in a single bound."',
      'Black jaguars (melanistic individuals) still have rosette patterns — they\'re visible under certain light as darker spots on the dark fur, a condition called "ghost rosettes."',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Jaguar'},
      {label:'Panthera', url:'https://www.panthera.org/cat/jaguar'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/jaguar'},
    ]
  },
  'vampire-bat': {
    altFacts:[
      'Vampire bats are the only mammals that feed exclusively on blood — they can consume up to half their body weight in a single 20-minute meal.',
      'A vampire bat\'s saliva contains draculin, a powerful anticoagulant now being studied as a treatment for human stroke patients because it dissolves blood clots more safely than existing drugs.',
      'Vampire bats share food with hungry roost-mates by regurgitating blood, and they keep track of who helped them — one of the best-documented examples of reciprocal altruism outside primates.',
      'There are only three vampire bat species, all in the Americas, and they\'re named after the folklore vampire — not the other way around. Bram Stoker\'s Dracula came after the bats were already known to Europeans.',
      'Vampire bats locate blood vessels using infrared-sensing pit organs on their noses — a heat-vision ability shared with only a few snake species.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Vampire_bat'},
      {label:'Smithsonian National Zoo', url:'https://nationalzoo.si.edu/animals/common-vampire-bat'},
      {label:'Bat Conservation International', url:'https://www.batcon.org/'},
    ]
  },
  'elephant-seal': {
    altFacts:[
      'Southern elephant seals are the largest carnivores on Earth — males can weigh over 3,600 kg, roughly the weight of a pickup truck, and grow to 6 meters long.',
      'Elephant seals can dive to depths of 1,750 meters and hold their breath for over two hours, collapsing their lungs to avoid nitrogen narcosis during descent.',
      'As pinnipeds, elephant seals share an ancestor with bears and dogs — they\'re essentially marine carnivores that returned to the sea about 23 million years ago.',
      'The "elephant" in their name refers to the male\'s inflatable proboscis, used as a resonating chamber to produce thunderous roars during territorial battles.',
      'Elephant seals spend up to 10 months per year at sea and sleep during deep dives, spiraling slowly downward while napping — they average only two minutes of surface breathing per hour.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Elephant_seal'},
      {label:'NOAA Fisheries', url:'https://www.fisheries.noaa.gov/species/northern-elephant-seal'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/elephant-seals'},
    ]
  },
  'okapi': {
    altFacts:[
      'The okapi was the last large mammal species discovered by Western science, not described until 1901 — the Indigenous Mbuti people of the Congo had known it for centuries.',
      'An okapi\'s tongue is 35–45 cm long, prehensile, and dark blue-purple; it can lick its own eyelids and clean its own ears.',
      'Despite the zebra-like stripes on its legs, the okapi\'s only living relative is the giraffe — they shared a common ancestor about 11.5 million years ago.',
      'The okapi\'s genus name Okapia derives from the Lese Karo language of the Ituri Forest, where it is called o\'api.',
      'Okapis are so elusive that they were not photographed in the wild until 2008, more than a century after their scientific description.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Okapi'},
      {label:'Okapi Conservation Project', url:'https://www.okapiconservation.org/'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/15188/51140517'},
    ]
  },
  'aye-aye': {
    altFacts:[
      'The aye-aye\'s skeletally thin middle finger can tap branches up to eight times per second and detect hollow chambers inside wood by echolocation — it is the only primate that finds food this way.',
      'An aye-aye\'s continuously growing incisors are so rodent-like that it was originally classified as a rodent; its teeth grow back if broken, a trait unique among primates.',
      'Aye-ayes are lemurs and thus primates — they\'re more closely related to us than to the rodents or bats they superficially resemble.',
      'In Malagasy folklore, the aye-aye is considered an omen of death — villagers sometimes kill them on sight, a superstition that tragically compounds the threat from habitat loss.',
      'The aye-aye is the world\'s largest nocturnal primate, with enormous ears, reflective eyes, and bat-like membranous fingers adapted for life in total darkness.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Aye-aye'},
      {label:'Duke Lemur Center', url:'https://lemur.duke.edu/discover/meet-the-lemurs/aye-aye/'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/6302/115560793'},
    ]
  },
  'african-wild-dog': {
    altFacts:[
      'African wild dogs have the highest hunting success rate of any large predator — roughly 80%, compared to about 25% for lions and 30% for wolves.',
      'Their enormous rounded ears serve as radiators for heat dissipation and can independently rotate like satellite dishes to pinpoint the sounds of prey or pack-mates across kilometers of savanna.',
      'African wild dogs are canids but split from wolves and domestic dogs about 6 million years ago — they cannot interbreed with any other canine species.',
      'Also called painted wolves, each individual has a unique coat pattern of black, white, and tan — no two wild dogs look alike, and researchers use these patterns for identification.',
      'Before each hunt, the pack holds a "rally" ceremony with excited greeting, sneezing, and social bonding — and research shows that more sneezes during rallies increase the probability the hunt will proceed.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/African_wild_dog'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/african-wild-dog'},
      {label:'Painted Dog Conservation', url:'https://www.painteddog.org/'},
    ]
  },
  'gray-wolf': {
    altFacts:[
      'Every domestic dog on Earth — from Chihuahuas to Great Danes — is descended from gray wolves, domesticated somewhere between 15,000 and 40,000 years ago.',
      'A wolf pack can travel 70 km in a single day without rest, running at a steady 8 km/h trot that outlasts nearly every prey animal on the continent.',
      'Wolves are the ancestor of the domestic dog, which makes them a close relative of every pet in the Canidae family tree — yet they diverged from coyotes only about 1 million years ago.',
      'The word "lupus" (wolf in Latin) gives us "lupine" for wolf-like traits. In Norse mythology, the great wolf Fenrir swallows the sun at Ragnarök.',
      'When wolves were reintroduced to Yellowstone in 1995, they triggered a trophic cascade that changed the course of rivers — elk stopped overgrazing riverbanks, allowing willows to regrow and stabilize the soil.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Wolf'},
      {label:'International Wolf Center', url:'https://wolf.org/'},
      {label:'Yellowstone Wolf Project', url:'https://www.nps.gov/yell/learn/nature/wolves.htm'},
    ]
  },
  'bottlenose-dolphin': {
    altFacts:[
      'Bottlenose dolphins call each other by unique signature whistles — essentially names. They remember the whistles of companions they haven\'t seen for over 20 years.',
      'A dolphin\'s echolocation can detect a ping-pong ball from 100 meters away and even sense the difference between a hollow and solid metal sphere.',
      'Dolphins share a common ancestor with hippos — Pakicetus, a wolf-sized land mammal that returned to the sea roughly 50 million years ago.',
      'The genus name Tursiops comes from Latin tursio (dolphin-like fish). Ancient Greeks considered killing a dolphin as grave as killing a person.',
      'Dolphins use sea sponges as nose guards while foraging on the seafloor — a culturally transmitted tool use passed from mother to daughter in Shark Bay, Australia.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Common_bottlenose_dolphin'},
      {label:'NOAA Fisheries', url:'https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin'},
      {label:'Dolphin Research Center', url:'https://dolphins.org/'},
    ]
  },
  'humpback-whale': {
    altFacts:[
      'Humpback whale songs evolve like cultural fads — a new melody that appears in one population spreads across entire ocean basins within two years, adopted group by group.',
      'A humpback can launch its 36-tonne body completely out of the water in a breach, generating enough force on reentry to be heard underwater 3 km away.',
      'Humpbacks share the cetacean lineage with dolphins and porpoises — all descended from a land-dwelling ancestor that returned to the sea about 50 million years ago.',
      'The genus name Megaptera means "giant wing," referring to their enormous pectoral fins — the longest limbs of any animal, reaching 5 meters each.',
      'Humpbacks have been observed protecting other species from orca attacks — shielding seals, sea lions, and even sunfish — a behavior scientists call interspecific altruism.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Humpback_whale'},
      {label:'NOAA Fisheries', url:'https://www.fisheries.noaa.gov/species/humpback-whale'},
      {label:'Whale Trust', url:'https://whaletrust.org/'},
    ]
  },
  'sperm-whale': {
    altFacts:[
      'The sperm whale has the largest brain of any animal ever — 7.8 kg, six times heavier than a human\'s — yet we still don\'t know what it does with all that neural tissue.',
      'Sperm whales dive to 2,250 meters and hold their breath for over 2 hours, hunting giant squid in total darkness using the loudest clicks of any animal: 236 dB.',
      'Sperm whales belong to the toothed whale lineage that diverged from baleen whales about 34 million years ago — despite their enormous size, they\'re technically oversized dolphins.',
      'The name "sperm whale" comes from spermaceti, the waxy oil filling their massive heads. It was once prized for candles and lubricants, driving 19th-century whaling.',
      'Sperm whale clans have distinct click dialects that function as cultural identities — calves learn their clan\'s pattern, and different clans avoid each other.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Sperm_whale'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/41755/160983555'},
      {label:'Ocean Alliance', url:'https://whale.org/'},
    ]
  },
  'orca': {
    altFacts:[
      'Orca ecotypes are so genetically distinct — some haven\'t interbred for 700,000 years — that scientists believe they may actually be several separate species.',
      'Orcas are the only known non-human animal to have culturally driven dietary specializations: some pods eat only salmon, others only seals, others only sharks.',
      'Despite their common name "killer whale," orcas are actually the largest member of the dolphin family — Delphinidae — not whales at all.',
      'The name "orca" comes from Orcus, the Roman god of the underworld. Ancient Romans called them "demons of the sea."',
      'Orca grandmothers are among the few non-human animals to experience menopause — post-reproductive females lead their pods and share knowledge of food sources during lean years.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Orca'},
      {label:'NOAA Fisheries', url:'https://www.fisheries.noaa.gov/species/killer-whale'},
      {label:'Orca Conservancy', url:'https://www.orcaconservancy.org/'},
    ]
  },
  'flying-fox': {
    altFacts:[
      'Flying foxes are the largest bats on Earth — with wingspans reaching 1.7 meters — yet they eat nothing but fruit, nectar, and pollen.',
      'Unlike insectivorous bats, flying foxes navigate by sight and smell rather than echolocation — they have large eyes and excellent night vision.',
      'Bats are the only mammals capable of true powered flight. Flying foxes are megabats, a lineage that diverged from microbats roughly 50 million years ago.',
      'In many Pacific Island cultures, flying foxes hold spiritual significance — in Samoa, they are messengers of the war goddess Nafanua.',
      'A single flying fox can disperse seeds across 60 km in one night, making them keystone pollinators and seed dispersers for over 300 tropical plant species.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Large_flying_fox'},
      {label:'Bat Conservation International', url:'https://www.batcon.org/'},
      {label:'IUCN Bat Specialist Group', url:'https://www.iucnbsg.org/'},
    ]
  },
  'three-toed-sloth': {
    altFacts:[
      'Three-toed sloths move so slowly — 2.4 meters per minute — that algae grows in grooves on their fur, giving them a green tint that serves as camouflage.',
      'A sloth\'s metabolism is 40-45% slower than expected for its body size. It can take 30 days to fully digest a single meal.',
      'Sloths are related to anteaters and armadillos — all three belong to the superorder Xenarthra, an ancient mammalian lineage unique to the Americas.',
      'The word "sloth" has meant "laziness" in English since the 12th century, but the animal\'s slowness is an adaptation, not laziness — it conserves energy on a low-calorie leaf diet.',
      'Three-toed sloths can rotate their heads 270 degrees thanks to extra cervical vertebrae — they have 9, while almost all other mammals (including giraffes) have exactly 7.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Three-toed_sloth'},
      {label:'Sloth Conservation Foundation', url:'https://slothconservation.org/'},
      {label:'Smithsonian', url:'https://nationalzoo.si.edu/animals/two-toed-sloth'},
    ]
  },
  'moose': {
    altFacts:[
      'Moose antlers can grow 2.5 cm per day — the fastest-growing tissue of any animal — and are shed and completely regrown every year, requiring more calcium than the animal\'s entire skeleton.',
      'Despite weighing up to 700 kg, a moose can run 56 km/h and swim at 10 km/h. They are strong enough swimmers to dive 6 meters underwater to eat aquatic plants.',
      'Moose are the largest living deer species. Their closest relative in this tree is the elk — both belong to the family Cervidae.',
      'The word "moose" comes from the Algonquian mos or moz, meaning "twig-eater." In Europe, the same species is called "elk."',
      'Moose are one of the few animals that can kick in all four directions. A single kick can kill a wolf or crush a car hood.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Moose'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/moose'},
      {label:'Alaska Dept. Fish & Game', url:'https://www.adfg.alaska.gov/index.cfm?adfg=moose.main'},
    ]
  },
  'bonobo': {
    altFacts:[
      'Bonobos resolve nearly all social conflicts through physical affection rather than aggression — the only great ape to consistently choose this strategy.',
      'Bonobos walk bipedally more often than any other non-human ape, spending up to 25% of their locomotion time upright, offering clues about how our ancestors first stood.',
      'Bonobos share 98.7% of their DNA with humans — the same percentage as chimpanzees. The three species last shared a common ancestor about 6 million years ago.',
      'The bonobo was the last great ape to be formally described by science, not recognized as a distinct species until 1929.',
      'Female bonobos form strong alliances that outrank all males in the group — one of the few primate societies with true female social dominance.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Bonobo'},
      {label:'Bonobo Conservation Initiative', url:'https://www.bonobo.org/'},
      {label:'Max Planck Institute', url:'https://www.eva.mpg.de/primat/research-groups/bonobos/'},
    ]
  },
  'tarsier': {
    altFacts:[
      'Each of a tarsier\'s eyeballs is 16 mm in diameter — larger than its brain — and cannot move in their sockets. It compensates by rotating its head 180° like an owl.',
      'Tarsiers can leap 40 times their own body length in a single bound, snatching insects out of the air in total darkness.',
      'Tarsiers are one of the most ancient primate lineages, splitting from other primates about 58 million years ago — closer to us than to lemurs, despite appearances.',
      'The name "tarsier" comes from the elongated tarsal (ankle) bones that give these primates their extraordinary leaping ability.',
      'Philippine tarsiers communicate in ultrasound — their calls reach 91 kHz, far beyond the 20 kHz upper limit of human hearing.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Tarsier'},
      {label:'Philippine Tarsier Foundation', url:'https://www.tarsierfoundation.org/'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/21492/9289252'},
    ]
  },
  'ring-tailed-lemur': {
    altFacts:[
      'Male ring-tailed lemurs settle disputes with "stink fights" — they smear scent from wrist glands onto their tails and waft them at rivals.',
      'Ring-tailed lemurs spend more time on the ground than any other lemur species and sunbathe in a seated lotus position with arms outstretched each morning.',
      'As primates, lemurs are our distant relatives — the lemur lineage split from the line leading to monkeys, apes, and humans about 60 million years ago.',
      'The name "lemur" comes from Latin lemures, meaning "ghosts" or "spirits" — early naturalists were struck by their haunting reflective eyes and nocturnal calls.',
      '98% of all lemur species face extinction — they are the most endangered mammal group on Earth, found only in Madagascar.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Ring-tailed_lemur'},
      {label:'Duke Lemur Center', url:'https://lemur.duke.edu/'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/lemur'},
    ]
  },
  'japanese-macaque': {
    altFacts:[
      'Japanese macaques in Nagano learned to bathe in hot springs during winter — a cultural behavior that started with one troop and has been transmitted for over 60 years.',
      'They are the northernmost non-human primate, surviving winter temperatures as low as -15°C with thick fur and social huddling.',
      'As Old World monkeys, Japanese macaques belong to the same superfamily as baboons and humans — Cercopithecoidea split from the ape lineage about 25 million years ago.',
      'In Japanese, they are called nihonzaru (日本猿). The "three wise monkeys" — see no evil, hear no evil, speak no evil — are Japanese macaques.',
      'A female macaque named Imo invented food-washing behavior in the 1950s — separating wheat from sand by dropping both in water. The innovation spread through her troop within a generation.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Japanese_macaque'},
      {label:'Japan Monkey Centre', url:'https://www.j-monkey.jp/english/'},
      {label:'Primate Info Net', url:'https://pin.primate.wisc.edu/factsheets/entry/japanese_macaque'},
    ]
  },
  'mandrill': {
    altFacts:[
      'The mandrill is the most colorful mammal on Earth — males sport vivid blue and red facial skin, with blue-purple buttocks. The colors intensify with social rank.',
      'Mandrills are the largest monkey species, with dominant males reaching 35 kg — three times the weight of females.',
      'As Old World monkeys, mandrills are more closely related to humans than to any New World monkey like capuchins or howlers.',
      'The mandrill\'s facial color comes from structural coloration — nanoscale collagen fibers in the skin scatter light like a prism, similar to how a butterfly wing creates color without pigment.',
      'Mandrill troops can number over 600 individuals, making them the largest primate groups outside of humans.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Mandrill'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/mandrill'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/12754/17952325'},
    ]
  },
  'pangolin': {
    altFacts:[
      'Pangolins are the most trafficked mammal on Earth — over one million were poached in the last decade, driven by demand for their scales in traditional medicine.',
      'A pangolin\'s tongue can extend 40 cm — longer than its body — and is anchored to the pelvis rather than the jaw. It has no teeth and swallows gravel to grind food in its stomach.',
      'Pangolins are more closely related to cats, dogs, and bears (order Carnivora) than to armadillos, which they superficially resemble — a striking case of convergent evolution.',
      'The name "pangolin" comes from the Malay pengguling, meaning "one who rolls up." When threatened, it curls into a ball that even lions cannot pry open.',
      'Pangolin scales are made of keratin — the exact same protein as human fingernails — yet this has driven a billion-dollar illegal trade.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Pangolin'},
      {label:'Save Pangolins', url:'https://savepangolins.org/'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/pangolin'},
    ]
  },
  'star-nosed-mole': {
    altFacts:[
      'The star-nosed mole identifies and eats food in 120 milliseconds — the fastest eating of any mammal — using 22 fleshy tentacles containing 100,000 nerve fibers.',
      'It can smell underwater by blowing air bubbles onto objects and re-inhaling them — the only mammal known to smell while submerged.',
      'Moles belong to the order Eulipotyphla, along with shrews and hedgehogs — a lineage that diverged from the common ancestor of primates and rodents about 85 million years ago.',
      'The star organ on its nose is the most sensitive touch organ of any mammal — it has five times more nerve fibers than a human hand packed into an area 1 cm across.',
      'Star-nosed moles are excellent swimmers and can even forage under ice in winter, detecting the faint electrical fields of aquatic invertebrates.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Star-nosed_mole'},
      {label:'Smithsonian', url:'https://nationalzoo.si.edu/animals/star-nosed-mole'},
      {label:'Nature — K. Catania research', url:'https://www.nature.com/articles/nature04403'},
    ]
  },
  'honey-badger': {
    altFacts:[
      'Honey badgers have been documented attacking lions, buffalo, and cobras. Their thick, loose skin lets them twist around inside it and bite an attacker that has grabbed them.',
      'Their skin is nearly impervious to porcupine quills, bee stings, and most snake venom — they are immune to the venom of cobras, puff adders, and scorpions.',
      'Honey badgers belong to the weasel family (Mustelidae), making wolverines and otters their closest relatives in this tree.',
      'The honey badger\'s Afrikaans name is ratel, from the Dutch for "rattle," referring to the sound it makes when agitated. Its Latin name Mellivora capensis means "honey-eater of the Cape."',
      'Honey badgers use tools in captivity — they\'ve been observed stacking objects to climb out of enclosures, making them one of very few non-primate tool-users.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Honey_badger'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/honey-badger'},
      {label:'African Wildlife Foundation', url:'https://www.awf.org/wildlife-conservation/honey-badger'},
    ]
  },
  'lion': {
    altFacts:[
      'Lions are the only truly social cat — prides can include up to 30 individuals, with females doing 90% of the hunting through coordinated group tactics.',
      'A lion\'s roar reaches 114 decibels and can be heard 8 km away. The sound contains individual voice signatures that allow pride members to identify each other in darkness.',
      'Lions and tigers diverged from a common ancestor about 3.5 million years ago. Despite their differences, they can hybridize — ligers and tigons exist in captivity.',
      'The genus name Panthera may derive from the Sanskrit pundarika or the Greek pan (all) + ther (beast). Lions have been symbols of royal power in virtually every culture they\'ve touched.',
      'Ten thousand years ago, lions were the most widespread large land mammal after humans — ranging from Africa through Europe to India and the Americas. Today they occupy just 8% of that historic range.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Lion'},
      {label:'Panthera', url:'https://www.panthera.org/cat/lion'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/15951/115130419'},
    ]
  },
  'wolf': {
    altFacts:[
      'Wolves howl in different pitches deliberately — a pack of 3 can sound like 20 by staggering their harmonics, a deception that deters rival packs.',
      'A wolf pack can bring down prey 10 times its individual members\' weight through coordinated relay chases that may cover 20 km before the prey tires.',
      'The wolf (Canis lupus) is the ancestor of all 400+ domestic dog breeds — from toy poodles to mastiffs, every pet dog carries wolf DNA.',
      'In many Indigenous North American cultures, the wolf is a teacher figure. The Pawnee word for wolf, skiri, was also their word for the stars — they believed wolves taught humans to hunt.',
      'Wolves mate for life. When a mate dies, the surviving wolf often howls mournfully — a behavior researchers believe indicates genuine grief.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Wolf'},
      {label:'International Wolf Center', url:'https://wolf.org/'},
      {label:'Defenders of Wildlife', url:'https://defenders.org/wildlife/gray-wolf'},
    ]
  },
  'polar-bear': {
    altFacts:[
      'Polar bear fur is not white — each hair is a transparent, hollow tube. The fur appears white because it scatters visible light, much like snow.',
      'Polar bears can swim continuously for over 100 hours, covering 680 km of open ocean. Their massive paws — up to 30 cm across — work as paddles.',
      'Polar bears are classified as marine mammals (like whales and seals) because they depend on the ocean for food. They diverged from brown bears only about 500,000 years ago.',
      'The Inuit name nanuq means "the ever-wandering one." In Norse mythology, polar bears were considered the spirit of the Arctic.',
      'A polar bear\'s black skin absorbs heat beneath its insulating fur. Their body temperature rarely fluctuates even at -40°C.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Polar_bear'},
      {label:'Polar Bears International', url:'https://polarbearsinternational.org/'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/polar-bear'},
    ]
  },
  'red-kangaroo': {
    altFacts:[
      'Female kangaroos can freeze embryo development — a fertilized egg enters dormancy while the pouch is occupied, resuming growth only when the first joey departs.',
      'A red kangaroo can leap 9 meters in a single bound and reach 56 km/h. At high speeds, hopping is more energy-efficient than running on four legs.',
      'Kangaroos are marsupials, a lineage that split from placental mammals about 190 million years ago. Their closest relative in this tree is the wombat and koala.',
      'The word "kangaroo" likely comes from the Guugu Yimithirr word gangurru, referring specifically to the gray kangaroo. Captain Cook recorded it in 1770.',
      'Red kangaroos are the largest living marsupials — males can stand 1.8 m tall and weigh 90 kg, with a tail so muscular it can support their entire body weight.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Red_kangaroo'},
      {label:'Australian Museum', url:'https://australian.museum/learn/animals/mammals/red-kangaroo/'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/red-kangaroo'},
    ]
  },
  'giraffe': {
    altFacts:[
      'A giraffe\'s heart weighs 11 kg and generates blood pressure twice that of humans — without it, blood could never reach the brain 2 meters above. Special jugular valves prevent blackouts when it bends to drink.',
      'Giraffes sleep only 30 minutes per day in brief 5-minute naps — the least sleep of any mammal — and give birth standing up, the calf falling 1.5 meters to the ground.',
      'Recent genetic analysis revealed there are four distinct giraffe species, not one — Masai, reticulated, northern, and southern — more genetically different from each other than brown bears are from polar bears.',
      'The genus name Giraffa derives from the Arabic zarafa, meaning "fast-walker." Medieval Europeans called it the cameleopard, believing it was a camel-leopard hybrid.',
      'No two giraffes have the same spot pattern — like human fingerprints, each is unique. Researchers use photo-recognition software to identify individuals from their markings.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Giraffe'},
      {label:'Giraffe Conservation Foundation', url:'https://giraffeconservation.org/'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/giraffe'},
    ]
  },
  'hippopotamus': {
    altFacts:[
      'Hippos secrete a red, oily substance from their skin that acts as a natural sunscreen, antiseptic, and moisturizer — sometimes called "blood sweat," though it contains neither.',
      'Despite weighing up to 2,000 kg, hippos can run 30 km/h on land and are surprisingly agile underwater, galloping along the bottom rather than swimming.',
      'Hippos are the closest living relatives of whales — they shared a common ancestor roughly 55 million years ago, before the cetacean lineage returned to the sea.',
      'The name hippopotamus comes from the Greek hippos (horse) + potamos (river) = "river horse." Ancient Egyptians revered and feared them in equal measure.',
      'Hippos kill more humans in Africa than any other large animal — estimated at 500 per year — far more than lions, elephants, or crocodiles.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Hippopotamus'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/hippo'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/10103/18567364'},
    ]
  },
  'tiger': {
    altFacts:[
      'Tigers are one of the few big cats that genuinely enjoy water — they swim for pleasure, not just necessity, and have been recorded crossing rivers up to 29 km wide.',
      'A tiger can leap forward 10 meters in a single bound and deliver a bite force of 1,050 PSI — strong enough to crush a buffalo skull.',
      'Despite looking nothing alike, tigers share a common ancestor with your house cat from about 10.8 million years ago. Their closest wild relative is the snow leopard.',
      'The name Panthera tigris combines Greek panthera (hunting animal) with tigris (arrow, for speed). In Sanskrit, vyaghra (tiger) is the root of the word "vigor."',
      'India\'s Project Tiger has been a conservation triumph — the population doubled from 1,400 in 2006 to over 3,600 today, making it one of the largest species recovery programs in history.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Tiger'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/tiger'},
      {label:'Panthera', url:'https://www.panthera.org/cat/tiger'},
    ]
  },
  'koala': {
    altFacts:[
      'Koalas have fingerprints nearly indistinguishable from human fingerprints — independently evolved, they have actually confused crime scene investigators.',
      'Koalas sleep 20-22 hours per day because eucalyptus leaves are so low in nutrition and so full of toxins that digestion requires enormous energy.',
      'Despite being called "koala bears," koalas are marsupials — more closely related to wombats and kangaroos than to any bear.',
      'The word "koala" comes from the Dharug language gula, meaning "no water" — koalas get almost all their moisture from eucalyptus leaves and rarely drink.',
      'Koala joeys eat a special form of their mother\'s feces called pap to inoculate their gut with the bacteria needed to digest toxic eucalyptus — without it, they cannot survive.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Koala'},
      {label:'Australian Koala Foundation', url:'https://www.savethekoala.com/'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/koala'},
    ]
  },
  'red-panda': {
    altFacts:[
      'The red panda was discovered by Western science 48 years before the giant panda — it was the original "panda," and the giant panda was named after it.',
      'Red pandas have a "false thumb" — an extended wrist bone that works as a sixth digit for gripping bamboo, convergently evolved with the giant panda\'s identical adaptation.',
      'Despite its name and bamboo diet, the red panda is not related to the giant panda. It is the sole living member of its own family, Ailuridae, more closely related to weasels and raccoons.',
      'The name "panda" may derive from the Nepali ponya, meaning "bamboo eater." Red pandas are called firefox in Chinese — Mozilla\'s logo is a red panda, not a fox.',
      'Red pandas have extraordinarily dense fur on the soles of their feet, insulating them from ice and snow in their high-altitude Himalayan habitat.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Red_panda'},
      {label:'Red Panda Network', url:'https://www.redpandanetwork.org/'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/red-panda'},
    ]
  },
  'snow-leopard': {
    altFacts:[
      'Snow leopards cannot roar — the hyoid bone in their throat is not fully ossified. They communicate with chuffs, wails, and a puffing sound called "prusten."',
      'Their tails are nearly as long as their bodies — up to 1 meter — and serve as a counterbalance on cliff faces and as a cozy nose-warmer wrapped around the face during sleep.',
      'Snow leopards are the closest living relative of the tiger, despite their very different appearance and habitat — the two lineages diverged about 3.9 million years ago.',
      'Called "Ghost of the Mountains" in Central Asia, snow leopards are so elusive that the first photograph of one in the wild was not taken until 1971.',
      'Snow leopards can leap 15 meters horizontally and 6 meters vertically in a single bound — the equivalent of jumping onto a two-story roof.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Snow_leopard'},
      {label:'Snow Leopard Trust', url:'https://www.snowleopard.org/'},
      {label:'Panthera', url:'https://www.panthera.org/cat/snow-leopard'},
    ]
  },
  'narwhal': {
    altFacts:[
      'The narwhal\'s tusk is actually the left upper canine tooth, grown through the lip in a counter-clockwise spiral. It contains 10 million nerve endings and may sense salinity and temperature.',
      'Male narwhals occasionally cross tusks in a behavior called "tusking" — likely a sensory exchange rather than combat, as the tusks are too fragile for fighting.',
      'Narwhals are Arctic whales closely related to belugas — the two species diverged only about 5 million years ago and can even hybridize.',
      'Medieval Europeans believed narwhal tusks were unicorn horns — they were worth ten times their weight in gold. Queen Elizabeth I kept one as a prized treasure.',
      'Narwhals can dive to 1,500 meters and spend up to 25 minutes at depth, making them among the deepest-diving marine mammals.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Narwhal'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/narwhal'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/narwhal'},
    ]
  },
  'sea-otter': {
    altFacts:[
      'Sea otters have up to 1 million hairs per square inch — the densest fur of any mammal — because they have no blubber and rely entirely on fur for insulation.',
      'Each sea otter has a favorite rock, kept in a skin pouch under the arm, used as an anvil to crack open shellfish — one of the few tool-using marine mammals.',
      'Sea otters are a keystone species: by eating sea urchins, they prevent urchin "barrens" and protect the kelp forests that shelter hundreds of other species.',
      'The genus name Enhydra means "in water" in Greek. Sea otters were hunted nearly to extinction during the fur trade — from 300,000 to just 2,000 by 1911.',
      'Sea otters hold hands while sleeping to avoid drifting apart — groups of rafting otters can number over 100, bobbing together on the ocean surface.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Sea_otter'},
      {label:'Monterey Bay Aquarium', url:'https://www.montereybayaquarium.org/animals/animals-a-to-z/sea-otter'},
      {label:'Defenders of Wildlife', url:'https://defenders.org/wildlife/sea-otter'},
    ]
  },
  'giant-panda': {
    altFacts:[
      'Giant pandas have a "false thumb" — an enlarged radial sesamoid bone that acts as a sixth digit — evolved specifically for gripping bamboo stalks.',
      'Despite being classified as carnivores, giant pandas eat almost nothing but bamboo — 12-38 kg per day — because their digestive system still lacks the gut bacteria to efficiently extract nutrients from it.',
      'Pandas belong to the bear family (Ursidae) and are more closely related to spectacled bears and sun bears than to the red panda, which is in its own family entirely.',
      'The giant panda is known as dà xióng māo (大熊猫) in Chinese, meaning "big bear cat" — a name that reflects centuries of debate about whether it was a bear, raccoon, or something entirely new.',
      'The panda\'s black-and-white coloring may serve dual purposes: white fur provides camouflage in snow, while black patches help pandas recognize each other and may intimidate rivals.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Giant_panda'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/giant-panda'},
      {label:'Smithsonian National Zoo', url:'https://nationalzoo.si.edu/animals/giant-panda'},
    ]
  },
  'wolverine': {
    altFacts:[
      'Wolverines have been documented driving grizzly bears and wolf packs from kills three times their size through sheer aggression and a unique mucous membrane that lets them eat frozen carrion.',
      'Wolverines can travel 24 km in a single day across deep snow using snowshoe-like paws, covering territories of up to 920 km² — larger than some small countries.',
      'Wolverines are the largest terrestrial members of the weasel family (Mustelidae), making them relatives of otters, badgers, and ferrets.',
      'The scientific name Gulo gulo is Latin for "glutton glutton" — a double emphasis on their legendary appetite. Scandinavians called them fjällfräs, "mountain cat."',
      'Wolverines are so tough that their fur is frost-resistant — it sheds ice more readily than any other fur, which is why it was traditionally used to line Arctic parkas.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Wolverine'},
      {label:'Wolverine Foundation', url:'https://www.wolverinefoundation.org/'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/mammals/facts/wolverine'},
    ]
  },
};

// Wikipedia article titles for each node
export const WIKI_TITLES = {
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
  'orangutan':'Orangutan','chimpanzee':'Chimpanzee','bonobo':'Bonobo',
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
  'halococcus':'Halococcus','methanosarcina':'Methanosarcina','synchytrium':'Synchytrium_endobioticum','allomyces':'Allomyces',
  'sea-urchin':'Sea_urchin','sea-cucumber':'Sea_cucumber','sea-lily':'Crinoid',
  'medicinal-leech':'Hirudo_medicinalis','pompeii-worm':'Alvinella_pompejana',
  'humpback-whale':'Humpback_whale','sperm-whale':'Sperm_whale','orca':'Orca',
  'tarsier':'Philippine_tarsier','ring-tailed-lemur':'Ring-tailed_lemur','japanese-macaque':'Japanese_macaque','mandrill':'Mandrill',
  'pangolin':'Pangolin','star-nosed-mole':'Star-nosed_mole','honey-badger':'Honey_badger',
  'caecilian':'Caecilian','chameleon':'Panther_chameleon','box-jellyfish':'Chironex_fleckeri',
  'cuttlefish':'Common_cuttlefish','atlas-moth':'Atlas_moth','bombardier-beetle':'Bombardier_beetle',
  'lungfish':'Australian_lungfish','ginkgo':'Ginkgo','dragon-blood-tree':'Dracaena_cinnabari',
};

export const PHOTO_MAP = {
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
  'platyhelminthes':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Schmidtea_polychroa.jpg/330px-Schmidtea_polychroa.jpg', credit:'Alejandro Sánchez Alvarado, CC BY 2.5'},
  'planarian':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Schmidtea_polychroa.jpg/330px-Schmidtea_polychroa.jpg', credit:'Alejandro Sánchez Alvarado, CC BY 2.5'},
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
  'great-apes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Evidence_as_to_Man%27s_Place_in_Naturep2.jpg/960px-Evidence_as_to_Man%27s_Place_in_Naturep2.jpg', credit:'T.H. Huxley (1863), Public Domain'},
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
  'hominini':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Mrs_Ples_Face.jpg/960px-Mrs_Ples_Face.jpg', credit:'Jose Braga, CC BY-SA 4.0'},
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
  'bonobo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Apeldoorn_Apenheul_zoo_Bonobo.jpg/640px-Apeldoorn_Apenheul_zoo_Bonobo.jpg', credit:'Ltshears, CC BY-SA 3.0'},
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
  'halococcus':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Halobacteria.jpg/320px-Halobacteria.jpg', credit:'NASA'},
  'methanosarcina':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Methanosarcina_barkeri.jpg/320px-Methanosarcina_barkeri.jpg', credit:'Public domain'},
  'synchytrium':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Synchytrium_endobioticum_on_potato.jpg/320px-Synchytrium_endobioticum_on_potato.jpg', credit:'EPPO'},
  'allomyces':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Allomyces.jpg/320px-Allomyces.jpg', credit:'Public domain'},
  'sea-urchin':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Strongylocentrotus_purpuratus.jpg/320px-Strongylocentrotus_purpuratus.jpg', credit:'Kirt L. Onthank, CC BY-SA 3.0'},
  'sea-cucumber':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Sea_cucumber_at_Steenbras_Deep_P9100406.jpg/320px-Sea_cucumber_at_Steenbras_Deep_P9100406.jpg', credit:'Peter Southwood, CC BY-SA 3.0'},
  'sea-lily':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Crinoid_on_the_reef_of_Batu_Moncho_Island.JPG/320px-Crinoid_on_the_reef_of_Batu_Moncho_Island.JPG', credit:'Alexander Vasenin, CC BY-SA 3.0'},
  'medicinal-leech':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Hirudo_medicinalis.jpg/320px-Hirudo_medicinalis.jpg', credit:'GlebK, CC BY-SA 3.0'},
  'pompeii-worm':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Alvinella_pompejana.jpg/320px-Alvinella_pompejana.jpg', credit:'NOAA'},
  'sperm-whale':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sperm_whale_fluke.jpg/320px-Sperm_whale_fluke.jpg', credit:'Gregory Smith, CC BY-SA 2.0'},
  'orca':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Killerwhales_jumping.jpg/320px-Killerwhales_jumping.jpg', credit:'Robert Pittman, NOAA'},
  'tarsier':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Philippine_Tarsier.jpg/320px-Philippine_Tarsier.jpg', credit:'Jasper Greek Golangco, CC BY 3.0'},
  'ring-tailed-lemur':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Lemur_catta_001.jpg/320px-Lemur_catta_001.jpg', credit:'Alex Dunkel, CC BY 3.0'},
  'japanese-macaque':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Jigokudani_hotspring_in_Nagano_Japan_001.jpg/320px-Jigokudani_hotspring_in_Nagano_Japan_001.jpg', credit:'Yosemite, CC BY-SA 3.0'},
  'mandrill':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mandrill_at_SF_Zoo.jpg/320px-Mandrill_at_SF_Zoo.jpg', credit:'Frank Wouters, CC BY 2.0'},
  'pangolin':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Tree_Pangolin.JPG/320px-Tree_Pangolin.JPG', credit:'Valerius Tygart, CC BY-SA 3.0'},
  'star-nosed-mole':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Condylura_cristata.jpg/320px-Condylura_cristata.jpg', credit:'US NPS'},
  'honey-badger':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Honey_badger.jpg/320px-Honey_badger.jpg', credit:'Derek Keats, CC BY 2.0'},
  'caecilian':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Siphonops_annulatus.jpg/320px-Siphonops_annulatus.jpg', credit:'Diogo B. Provete, CC BY 4.0'},
  'chameleon':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Panther_chameleon_%28Furcifer_pardalis%29.jpg/320px-Panther_chameleon_%28Furcifer_pardalis%29.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'box-jellyfish':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Avispa_marina.jpg/320px-Avispa_marina.jpg', credit:'Guido Gautsch, CC BY-SA 2.0'},
  'cuttlefish':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Sepia_officinalis_Cuttlefish_striridge.jpg/320px-Sepia_officinalis_Cuttlefish_striridge.jpg', credit:'Hans Hillewaert, CC BY-SA 4.0'},
  'bombardier-beetle':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Brachinus_crepitans_bl.jpg/320px-Brachinus_crepitans_bl.jpg', credit:'Siga, CC BY-SA 3.0'},
  'lungfish':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Neoceratodus_forsteri.jpg/320px-Neoceratodus_forsteri.jpg', credit:'Public domain'},
  'ginkgo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ginkgo_biloba_leaf_-_autumn.jpg/320px-Ginkgo_biloba_leaf_-_autumn.jpg', credit:'Cayambe, CC BY-SA 3.0'},
  'dragon-blood-tree':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Socotra_dragon_tree.JPG/320px-Socotra_dragon_tree.JPG', credit:'Boris Khvostichenko, CC BY-SA 4.0'},
  'giant-panda':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/320px-Grosser_Panda.JPG', credit:'J. Patrick Fischer, CC BY-SA 3.0'},
  'red-kangaroo':          {url:'https://upload.wikimedia.org/wikipedia/commons/4/44/Macropus_rufus.jpg', credit:'fir0002, GFDL 1.2'},
  'moose':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Moose_superior.jpg/320px-Moose_superior.jpg', credit:'USDA, Public Domain'},
  'hippopotamus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Hippopotamus_amphibius.jpg/330px-Hippopotamus_amphibius.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'wolverine':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Gulo_gulo_1.jpg/330px-Gulo_gulo_1.jpg', credit:'Zefram, CC BY-SA 3.0'},
  'humpback-whale':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Humpback_stellwagen_edit.jpg/320px-Humpback_stellwagen_edit.jpg', credit:'Whit Welles, CC BY 3.0'},
  'narwhal':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Monodon_monoceros.jpg/330px-Monodon_monoceros.jpg', credit:'Ansgar Walk, CC BY-SA 2.5'},
  'sea-otter':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sea_otter_cropped.jpg/320px-Sea_otter_cropped.jpg', credit:'Marshal Hedin, CC BY-SA 2.0'},
  'condor':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Gymnogyps_californianus_-San_Diego_Zoo-8a.jpg/320px-Gymnogyps_californianus_-San_Diego_Zoo-8a.jpg', credit:'Stacy, CC BY 2.0'},
  'flamingo':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Phoenicopterus_roseus.jpg/330px-Phoenicopterus_roseus.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'barn-owl':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Tyto_alba.jpg/330px-Tyto_alba.jpg', credit:'Bohushan, Public Domain'},
  'cassowary':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cassowary.jpg/330px-Cassowary.jpg', credit:'Mfield, CC BY-SA 3.0'},
  'electric-eel':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Electrophorus_electricus.jpg/330px-Electrophorus_electricus.jpg', credit:'Steven G. Johnson, CC BY-SA 3.0'},
  'poison-dart-frog':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Ranitomeya_amazonica.jpg/330px-Ranitomeya_amazonica.jpg', credit:'Geoff Gallice, CC BY 2.0'},
  'firefly':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Photinus_pyralis_Firefly_2.jpg/330px-Photinus_pyralis_Firefly_2.jpg', credit:'Quit007, CC BY-SA 3.0'},
  'atlas-moth':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Atlas_moth.jpg/330px-Atlas_moth.jpg', credit:'Quartl, CC BY-SA 3.0'},
  'army-ant':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Army_ants.jpg/330px-Army_ants.jpg', credit:'Nick Hobgood, CC BY-SA 3.0'},
  'japanese-spider-crab':  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Japanese_Spider_Crab.jpg/330px-Japanese_Spider_Crab.jpg', credit:'OpenCage, CC BY-SA 2.5'},
  'garden-spider':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Argiope_aurantia_male.jpg/330px-Argiope_aurantia_male.jpg', credit:'Luc Viatour, CC BY-SA 3.0'},
  'hermit-crab':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Pagurus_bernhardus.jpg/330px-Pagurus_bernhardus.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'portuguese-man-o-war':  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Physalia_physalis.jpg/330px-Physalia_physalis.jpg', credit:'Volkan Yuksel, CC BY-SA 3.0'},
  'hammerhead-shark':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Sphyrna_lewini.jpg/330px-Sphyrna_lewini.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'water-lily':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Water_lily_2.jpg/330px-Water_lily_2.jpg', credit:'Abrahami, CC BY-SA 3.0'},
  'bamboo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bamboo.jpg/330px-Bamboo.jpg', credit:'Cntras, CC BY-SA 3.0'},
  'cactus':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Saguaro_cactus.jpg/330px-Saguaro_cactus.jpg', credit:'Derek Ramsey, GFDL 1.2'},
  'sundew':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Drosera_capensis.jpg/330px-Drosera_capensis.jpg', credit:'Noah Elhardt, CC BY 2.5'},
  'truffle':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Tuber_aestivum.jpg/330px-Tuber_aestivum.jpg', credit:'Archenzo, CC BY-SA 3.0'},
  'chanterelle':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Cantharellus_cibarius.jpg/330px-Cantharellus_cibarius.jpg', credit:'Archenzo, CC BY-SA 3.0'},
  'lichen':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Lichen_on_a_rock.jpg/330px-Lichen_on_a_rock.jpg', credit:'Jason Hollinger, CC BY 2.0'},
  'euglena':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Photosynthetic_euglenid.jpg/330px-Photosynthetic_euglenid.jpg', credit:'Claudio Miklos, CC BY 2.5'},
  'radiolarian':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Acantharia.jpg/330px-Acantharia.jpg', credit:'Ernst Haeckel, Public Domain'},
  'stentor':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Stentor_coeruleus.jpg/330px-Stentor_coeruleus.jpg', credit:'Picturepest, CC BY 2.0'},};

export const GREAT_APE_IDS = ['great-apes','gorilla','orangutan','chimpanzee','bonobo','hominini'];
export const HOMININ_IDS   = ['homo-sapiens','h_erectus','h_habilis','h_neanderthalensis','h_heidelbergensis','h_floresiensis','h_naledi','h_luzonensis','denisovan','au_afarensis','au_africanus','sahelanthropus','ardipithecus_r'];
