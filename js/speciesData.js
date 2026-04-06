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
  'birds': {
    altFacts:[
      'Birds are the only surviving dinosaurs — every living bird is a theropod dinosaur, more closely related to Velociraptor than Velociraptor was to Triceratops.',
      'Bird lungs are the most efficient of any vertebrate — air flows in one direction through rigid tubes, extracting oxygen on both inhale and exhale.',
      'The oldest known bird-line dinosaur is Archaeopteryx, found in this tree — a 150-million-year-old fossil with feathered wings, reptilian teeth, and a bony dinosaur tail.',
      'The class Aves contains over 10,000 species — the most diverse group of land vertebrates, found on every continent including Antarctica.',
      'Feathers evolved before flight — early theropod dinosaurs used them for insulation and display. Flight came later, repurposing an existing structure.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Bird'},
      {label:'Cornell Lab of Ornithology', url:'https://www.birds.cornell.edu/home/'},
      {label:'BirdLife International', url:'https://www.birdlife.org/'},
    ]
  },
  'emperor-penguin': {
    altFacts:[
      'Male emperor penguins incubate eggs on their feet for 65 days in -60°C winter darkness, losing 45% of body weight — the most extreme parental sacrifice in the bird world.',
      'Emperor penguins can dive to 565 meters and hold their breath for 22 minutes — deeper and longer than any other bird.',
      'Penguins are flightless birds that evolved from flying ancestors — their wings became flippers about 60 million years ago as they adapted to an aquatic lifestyle.',
      'The genus name Aptenodytes means "wingless diver" in Greek, though of course penguins do have wings — just not for flying.',
      'Emperor penguin chicks huddle in crèches of up to 5,000 — yet parents can locate their own chick by voice alone in the cacophony.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Emperor_penguin'},
      {label:'Australian Antarctic Program', url:'https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/emperor-penguin'},
    ]
  },
  'hummingbird': {
    altFacts:[
      'Hummingbirds are the only birds that can fly backwards, upside down, and hover in place — their figure-eight wing stroke generates lift on both the up and down beat.',
      'A hummingbird\'s heart beats up to 1,260 times per minute — yet to survive the night, it enters torpor, dropping its heart rate to 50 bpm and its body temperature by 30°C.',
      'Hummingbirds are exclusively American — found only in the New World from Alaska to Tierra del Fuego, with greatest diversity in the Andes.',
      'The family name Trochilidae comes from Greek trochilos (a small bird mentioned by Aristotle). Aztecs believed dead warriors were reincarnated as hummingbirds.',
      'Hummingbirds see in ultraviolet and perceive "non-spectral" colors invisible to humans — their world is richer in color than ours.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Hummingbird'},
      {label:'Audubon Society', url:'https://www.audubon.org/birds/hummingbirds'},
      {label:'Cornell Lab', url:'https://www.allaboutbirds.org/guide/Ruby-throated_Hummingbird'},
    ]
  },
  'african-grey-parrot': {
    altFacts:[
      'Alex, the most famous African grey, could identify 50 objects, 7 colors, 5 shapes, and understood concepts like "same," "different," "bigger," and "zero" — a concept most children don\'t grasp until age 3.',
      'African greys don\'t just mimic — they understand context. They\'ve been documented using words appropriately in novel situations, asking questions, and expressing preferences.',
      'Parrots and songbirds are more closely related to each other than to most other birds — both belong to a lineage that evolved vocal learning independently from humans.',
      'The species name erithacus comes from a Greek word for a solitary bird. In West Africa, the Yoruba consider the parrot a sacred messenger.',
      'African grey populations have declined by up to 99% in some regions due to the pet trade — Ghana lost virtually its entire wild population between 1992 and 2014.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Grey_parrot'},
      {label:'World Parrot Trust', url:'https://www.parrots.org/'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/22724813/154428817'},
    ]
  },
  'wandering-albatross': {
    altFacts:[
      'Wandering albatrosses can fly 120,000 km per year without flapping — they harvest wind energy via dynamic soaring, rising and dipping between wind layers above the waves.',
      'Their wingspan of 3.5 meters is the longest of any living bird — they can lock their wings in an extended position and glide for hours using zero muscular effort.',
      'Albatrosses are tubenoses (order Procellariiformes) — an ancient seabird lineage that diverged from other birds about 70 million years ago.',
      'The word "albatross" likely derives from the Arabic al-qadus (water carrier) via Portuguese alcatraz. Coleridge\'s Rime of the Ancient Mariner made it a symbol of burden.',
      'Albatross pairs mate for life with elaborate dances. But they only breed every two years — raising a single chick takes a full year of tag-team parenting.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Wandering_albatross'},
      {label:'BirdLife International', url:'https://www.birdlife.org/species/wandering-albatross/'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/22698305/132640680'},
    ]
  },
  'bee-hummingbird': {
    altFacts:[
      'The bee hummingbird weighs 1.8 grams — less than a US penny — and its eggs are the size of coffee beans, yet it is warm-blooded and must eat half its body weight daily.',
      'Its wings beat 80 times per second in normal flight and up to 200 times during courtship displays — the fastest wing movement of any bird.',
      'As the smallest bird, it occupies the extreme lower end of the warm-blooded size spectrum — below this, an animal cannot eat fast enough to maintain body temperature.',
      'Found only in Cuba, the bee hummingbird was named zunzuncito by locals — an onomatopoeia for the humming sound of its wings.',
      'Male bee hummingbirds have iridescent pink-red throat feathers that flash like jewels in sunlight — yet the entire bird fits comfortably on a human thumb.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Bee_hummingbird'},
      {label:'Cornell Lab', url:'https://www.allaboutbirds.org/guide/Bee_Hummingbird'},
      {label:'Audubon', url:'https://www.audubon.org/news/the-bee-hummingbird-worlds-smallest-bird'},
    ]
  },
  'barn-owl': {
    altFacts:[
      'Barn owls can locate prey in total darkness by sound alone — their heart-shaped facial disc funnels sound to asymmetrically placed ears that triangulate location in 3D.',
      'Serrated leading edges on their flight feathers break up air turbulence, making barn owls virtually silent in flight — prey never hears them coming.',
      'Owls are raptors but not closely related to hawks or eagles — they belong to order Strigiformes, a lineage that evolved nocturnal hunting independently.',
      'The barn owl\'s genus name Tyto comes from Greek tyto (night owl). They are the most widespread land bird species on Earth, found on every continent except Antarctica.',
      'A single barn owl family consumes about 3,000 rodents per year, making them among the most effective natural pest controllers in agriculture.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Barn_owl'},
      {label:'The Barn Owl Trust', url:'https://www.barnowltrust.org.uk/'},
      {label:'Cornell Lab', url:'https://www.allaboutbirds.org/guide/Barn_Owl'},
    ]
  },
  'new-caledonian-crow': {
    altFacts:[
      'New Caledonian crows manufacture tools from raw materials — carving hooks from twigs and cutting barbed probes from pandanus leaves with a standardized sequence of cuts.',
      'They can solve 8-step sequential puzzles and use tools to obtain other tools — a meta-tool-use behavior previously thought unique to great apes.',
      'Crows are corvids — a family that includes ravens, magpies, and jays — all notable for intelligence that rivals great apes despite brains the size of walnuts.',
      'Found only on the islands of New Caledonia in the South Pacific, these crows have local "tool cultures" — different populations make differently shaped tools.',
      'In laboratory tests, New Caledonian crows spontaneously bent wire into hooks to retrieve food — innovating a tool design they had never seen before.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/New_Caledonian_crow'},
      {label:'Nature Research', url:'https://www.nature.com/articles/nature01468'},
      {label:'BBC Wildlife', url:'https://www.discoverwildlife.com/animal-facts/birds/facts-about-new-caledonian-crows/'},
    ]
  },
  'bald-eagle': {
    altFacts:[
      'Bald eagles recovered from fewer than 500 nesting pairs in 1963 to over 300,000 today — one of conservation\'s greatest success stories, driven by the DDT ban and legal protection.',
      'Bald eagle nests are the largest of any bird in North America — some weigh over 2 tonnes and measure 4 meters deep, added to year after year.',
      'Despite the name, bald eagles are not bald — "bald" comes from the old English "balde" meaning white, referring to the distinctive white head feathers that develop at age 4-5.',
      'Benjamin Franklin famously objected to the bald eagle as America\'s symbol, calling it "a bird of bad moral character" because it steals fish from ospreys.',
      'Bald eagles can see fish underwater from 300 meters in the air — their vision is roughly 8 times sharper than a human\'s.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Bald_eagle'},
      {label:'National Eagle Center', url:'https://www.nationaleaglecenter.org/'},
      {label:'Audubon', url:'https://www.audubon.org/field-guide/bird/bald-eagle'},
    ]
  },
  'ostrich': {
    altFacts:[
      'An ostrich can run at 70 km/h — the fastest of any bird and faster than most horses — using powerful legs that can also kill a lion with a single kick.',
      'Ostrich eyes are 5 cm across, the largest of any land animal — larger than their own brain — giving them extraordinary visual range across open savanna.',
      'Ostriches are ratites, a group of flightless birds that includes emus, kiwis, and cassowaries — they all descended from a common flying ancestor and lost flight independently.',
      'The name "ostrich" comes from the Greek strouthion (sparrow) + Latin avis (bird), combined into a word meaning "sparrow-camel" — a nod to their long necks.',
      'Ostriches don\'t bury their heads in sand — that myth may come from their habit of pressing their pale heads flat against the ground to hide, which from a distance looks like disappearing into the earth.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Common_ostrich'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/ostrich'},
      {label:'African Wildlife Foundation', url:'https://www.awf.org/wildlife-conservation/ostrich'},
    ]
  },
  'flamingo': {
    altFacts:[
      'Flamingos are not born pink — chicks are grey-white. The pink color comes entirely from carotenoid pigments in their diet of brine shrimp and algae.',
      'A flamingo can stand on one leg for hours — this isn\'t muscular effort but a passive locking mechanism in the joints that requires zero energy to maintain.',
      'Flamingos are filter-feeders, like baleen whales — they hold their bill upside down in the water and pump it to strain tiny organisms through comb-like lamellae.',
      'The name "flamingo" comes from Spanish/Portuguese flamengo (flame-colored). Ancient Egyptians considered them a living representation of the sun god Ra.',
      'Flamingo parents produce "crop milk" — a bright red protein-and-fat-rich liquid secreted from the lining of the digestive tract to feed chicks. Only pigeons and penguins also do this.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Flamingo'},
      {label:'Smithsonian National Zoo', url:'https://nationalzoo.si.edu/animals/flamingo'},
      {label:'Audubon', url:'https://www.audubon.org/field-guide/bird/american-flamingo'},
    ]
  },
  'kiwi': {
    altFacts:[
      'Kiwis are the only birds with nostrils at the tip of their beak — they find food by smell, snuffling through leaf litter like a mammal rather than hunting by sight like other birds.',
      'A kiwi egg is 25% of the mother\'s body weight — proportionally the largest egg of any bird. It\'s so big that the female must stop eating days before laying because the egg compresses her stomach.',
      'Kiwis are ratites — distantly related to ostriches, emus, and cassowaries — but their closest relative is the elephant bird of Madagascar, which stood 3 meters tall.',
      'The kiwi was named by the Māori people of New Zealand for its shrill kee-wee call. New Zealanders adopted it as their national symbol and nickname.',
      'Kiwis have cat-like whiskers (vibrissae), heavy bones (unlike most birds), body temperature 2°C lower than other birds, and fur-like feathers — they are essentially nocturnal ground mammals that happen to be birds.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Kiwi_(bird)'},
      {label:'Kiwis for kiwi', url:'https://www.kiwisforkiwi.org/'},
      {label:'NZ Department of Conservation', url:'https://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/kiwi/'},
    ]
  },
  'secretary-bird': {
    altFacts:[
      'Secretary birds kill venomous snakes by stomping them with 195 newtons of force in just 15 milliseconds — five times their body weight applied faster than an eye blink.',
      'Despite being a raptor, the secretary bird hunts almost exclusively on foot, walking up to 30 km per day across the African savanna on crane-like legs.',
      'Secretary birds are the only raptor in their own family (Sagittariidae) — they diverged from other birds of prey about 50 million years ago.',
      'The name may come from the quill-like crest feathers resembling 19th-century secretaries who tucked quill pens behind their ears — or from the Arabic saqr-et-tair (hunter bird).',
      'Secretary birds are declining so rapidly they were uplisted to Endangered in 2020 — grassland conversion and human disturbance are shrinking their habitat across Africa.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Secretary_bird'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/22696221/181281809'},
      {label:'African Raptor Databank', url:'https://www.habitatinfo.com/ardb/'},
    ]
  },
  'toucan': {
    altFacts:[
      'A toucan\'s bill can be one-third of its body length yet weighs almost nothing — a honeycomb matrix of keratin and bone filled with air pockets.',
      'The bill acts as a thermoregulator — blood vessels near the surface dilate to dump excess heat or constrict to conserve warmth, functioning like an elephant\'s ears.',
      'Toucans belong to the order Piciformes — they\'re actually relatives of woodpeckers, not parrots, despite their colorful appearance.',
      'The name "toucan" comes from the Tupí language tucana, imitating the bird\'s call. In Amazonian mythology, toucans are mediators between the worlds of the living and spirits.',
      'Toucans sleep by tucking their bill over their back and folding their tail over the bill — they become a compact feathered ball, conserving heat in the canopy.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Toucan'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/toucan'},
      {label:'Cornell Lab', url:'https://www.allaboutbirds.org/guide/Keel-billed_Toucan/'},
    ]
  },
  'cassowary': {
    altFacts:[
      'The cassowary\'s dagger-like inner claw is up to 12 cm long and can disembowel a human or dog with a single kick — making it the most dangerous bird on Earth.',
      'Cassowaries can run 50 km/h through dense forest and swim across rivers. Their bony casque may amplify low-frequency calls or serve as a head shield in dense undergrowth.',
      'Cassowaries are ratites — flightless birds related to ostriches and emus — but their closest living relative is actually the tiny kiwi of New Zealand.',
      'The name "cassowary" comes from Papuan kasu (horn) + weri (head). In Papua New Guinea, cassowary feathers are used as currency and ceremonial headdresses.',
      'Cassowaries are essential seed dispersers for over 238 rainforest plant species — some seeds will not germinate unless they pass through a cassowary\'s digestive tract.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Cassowary'},
      {label:'Australian Museum', url:'https://australian.museum/learn/animals/birds/southern-cassowary/'},
      {label:'Rainforest Trust', url:'https://www.rainforesttrust.org/species/southern-cassowary/'},
    ]
  },
  'pelican': {
    altFacts:[
      'A pelican\'s throat pouch can hold 11 liters of water — three times more than its stomach — and functions as a dip net for scooping fish.',
      'Brown pelicans plunge-dive from 20 meters, hitting the water at 100 km/h. Air sacs under their skin cushion the impact and help them float back up.',
      'Pelicans are among the oldest bird lineages — fossils date back 30 million years, and they\'re related to cormorants and frigatebirds in the order Suliformes.',
      'In medieval European heraldry, the pelican symbolized self-sacrifice — a legend claimed it fed its young with blood from its own breast (actually, the red-tipped bill pressed against white chest feathers).',
      'Pelicans fish cooperatively — groups form a crescent line and drive fish into shallows with synchronized wing-beating, then scoop simultaneously.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Pelican'},
      {label:'Audubon', url:'https://www.audubon.org/field-guide/bird/brown-pelican'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/22697599/131932990'},
    ]
  },
  'woodpecker': {
    altFacts:[
      'Woodpeckers hammer at 20 strikes per second with 1,200 g of deceleration — a spongy hyoid bone that wraps around the skull and a shock-absorbing gap between brain and skull prevent concussions.',
      'A woodpecker\'s tongue can extend up to 1/3 its body length, is barbed at the tip, and coated in sticky saliva to extract insect larvae from deep wood tunnels.',
      'Woodpeckers and toucans are close relatives — both belong to the order Piciformes, despite their radically different lifestyles.',
      'The family Picidae gets its name from Picus, a figure in Roman mythology who was turned into a woodpecker by the sorceress Circe.',
      'Acorn woodpeckers create "granary trees" with thousands of individually drilled holes, each storing a single acorn — some trees contain over 50,000 acorns.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Woodpecker'},
      {label:'Cornell Lab', url:'https://www.allaboutbirds.org/guide/browse/shape/Woodpeckers'},
      {label:'Audubon', url:'https://www.audubon.org/birds/woodpeckers'},
    ]
  },
  'swift': {
    altFacts:[
      'Common swifts can stay airborne for 10 consecutive months — the longest continuous flight of any bird. They eat, sleep, and even mate on the wing.',
      'Swifts sleep in flight by ascending to 2,000+ meters at dusk and entering microsleep — brief unconscious periods while gliding in slow descending spirals.',
      'Swifts are not related to swallows despite looking similar — they\'re more closely related to hummingbirds, sharing the order Apodiformes.',
      'The order name Apodiformes means "footless" — early naturalists who only saw them in flight believed swifts had no feet. Their feet are tiny but functional.',
      'Swift populations are declining across Europe as modern buildings eliminate the gaps and crevices under roof tiles where they traditionally nest.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Common_swift'},
      {label:'Swift Conservation', url:'https://swift-conservation.org/'},
      {label:'RSPB', url:'https://www.rspb.org.uk/birds-and-wildlife/swift'},
    ]
  },
  'lyrebird': {
    altFacts:[
      'Superb lyrebirds can mimic virtually any sound — chainsaws, camera shutters, car alarms, crying babies, and at least 20 other bird species — with such accuracy that targeted species respond.',
      'Male lyrebirds perform an elaborate courtship display, fanning their spectacular tail feathers into a shimmering silver canopy while singing a medley of mimicked sounds.',
      'Lyrebirds are ancient passerines endemic to Australia — they diverged from other songbirds about 60 million years ago.',
      'The lyrebird gets its name from its tail feathers, which resemble a lyre (ancient Greek harp) when fanned during display. It appears on the Australian 10-cent coin.',
      'Lyrebirds are ecosystem engineers — their constant scratching through leaf litter turns over more soil per hectare than any other Australian animal, accelerating decomposition and nutrient cycling.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Superb_lyrebird'},
      {label:'Australian Museum', url:'https://australian.museum/learn/animals/birds/superb-lyrebird/'},
      {label:'ABC Science', url:'https://www.abc.net.au/news/science/lyrebird'},
    ]
  },
  'hoatzin': {
    altFacts:[
      'The hoatzin is the only bird that digests food by fermentation in an enlarged crop — like a cow\'s rumen — giving it a permanent smell of manure.',
      'Hoatzin chicks are born with functional claws on their wings — used to climb back to the nest after escaping predators by diving into water. The claws disappear as adults.',
      'The hoatzin is so genetically unique that it was placed in its own order (Opisthocomiformes) — its closest relatives remain controversial, with no clear link to any other living bird.',
      'Called "stinkbird" in many languages, the hoatzin\'s fermentation-based digestion was likely an independent evolution of the same strategy used by cows and other ruminants.',
      'Hoatzins are poor fliers because their enormous crop compresses the flight muscles — they rely more on climbing and gliding than sustained flight.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Hoatzin'},
      {label:'Cornell Lab', url:'https://www.allaboutbirds.org/guide/Hoatzin/'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/birds/facts/hoatzin'},
    ]
  },
  'arctic-tern': {
    altFacts:[
      'Arctic terns migrate 70,000 km annually — from Arctic to Antarctic and back — seeing more daylight than any other animal on Earth.',
      'Over its ~30-year lifespan, an Arctic tern travels roughly 2.4 million km — equivalent to three round trips to the Moon.',
      'Despite weighing only 100 grams, Arctic terns aggressively defend their nests — they dive-bomb humans, foxes, and even polar bears.',
      'The species name paradisaea means "of paradise" — the tern experiences endless summer, breeding in the Arctic and wintering in the Antarctic.',
      'Arctic terns are closely related to other terns and skimmers — all belong to the family Laridae, which also includes gulls.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Arctic_tern'},
      {label:'Audubon', url:'https://www.audubon.org/field-guide/bird/arctic-tern'},
      {label:'RSPB', url:'https://www.rspb.org.uk/birds-and-wildlife/arctic-tern'},
    ]
  },
  'harpy-eagle': {
    altFacts:[
      'Harpy eagle talons are 13 cm long — the size of grizzly bear claws — with a grip strength of 530 PSI, enough to crush the bones of a howler monkey.',
      'Harpies snatch sloths and monkeys from the canopy at speeds up to 80 km/h, maneuvering through dense forest with a 2-meter wingspan.',
      'Harpy eagles are among the largest and most powerful raptors alive — rivaled only by the Philippine eagle and Steller\'s sea eagle.',
      'Named after the harpies of Greek mythology — winged creatures that snatched food and people — the genus name Harpia was given by Linnaeus in 1758.',
      'Harpy eagles need vast tracts of unbroken forest — a single pair requires 5,000 hectares of territory, making deforestation an existential threat.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Harpy_eagle'},
      {label:'Peregrine Fund', url:'https://www.peregrinefund.org/explore-raptors-species/eagles/harpy-eagle'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/22695998/93534473'},
    ]
  },
  'shoebill': {
    altFacts:[
      'The shoebill can stand motionless for hours before launching a decapitation strike — its massive shoe-shaped bill slams down to sever the heads of lungfish and baby crocodiles.',
      'Shoebill bill-clattering sounds like machine-gun fire and can be heard from 100 meters away — used in courtship and territorial displays.',
      'The shoebill is so taxonomically unusual that its classification has been debated for 170 years — currently placed in its own family, most closely related to pelicans.',
      'Known as abu markub in Arabic ("father of a shoe"), the shoebill has been revered in African cultures — South Sudanese tribes consider seeing one a sign of good fortune.',
      'Only 5,000-8,000 shoebills remain in the wild, restricted to papyrus swamps in central-east Africa — they are one of the most sought-after species by birdwatchers.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Shoebill'},
      {label:'BirdLife International', url:'https://www.birdlife.org/species/shoebill/'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/22697583/93622396'},
    ]
  },
  'superb-fairywren': {
    altFacts:[
      'Male superb fairywrens pluck yellow flower petals and present them to females as courtship gifts — one of the only known examples of non-food gift-giving in birds.',
      'Females teach a unique "password" song to their unhatched embryos through the egg shell — after hatching, chicks must sing this call to be fed, preventing brood parasitism by cuckoos.',
      'Fairywrens are Australian endemics in the family Maluridae — despite their wren-like appearance, they\'re not related to true wrens at all.',
      'The vivid blue breeding plumage of males is among the brightest in the bird world — produced by structural coloration (light scattering) rather than pigments.',
      'Superb fairywrens are socially monogamous but sexually promiscuous — over 75% of chicks are fathered by males outside the pair bond, one of the highest rates of extra-pair mating in any bird.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Superb_fairywren'},
      {label:'Australian Museum', url:'https://australian.museum/learn/animals/birds/superb-fairy-wren/'},
      {label:'BirdLife Australia', url:'https://birdlife.org.au/bird-profiles/superb-fairywren'},
    ]
  },
  'condor': {
    altFacts:[
      'California condors were extinct in the wild by 1987 — all 27 surviving birds were captured. Through captive breeding, there are now 500+ birds including 300+ flying free.',
      'Condors soar on thermals to 4,600 meters without a single wingbeat, covering vast distances while expending almost no energy — their 3-meter wingspan is the largest of any North American bird.',
      'Condors are New World vultures — not closely related to Old World vultures like the griffon, but convergently evolved the same bald head and scavenging lifestyle.',
      'The Andean condor was sacred to the Inca as a messenger to the gods. The California condor holds similar significance for many Native American peoples, including the Wiyot and Yurok.',
      'Condors can go two weeks without eating, then consume up to 1.5 kg of carrion in a single meal. Their powerful stomach acid destroys anthrax, botulism, and cholera bacteria.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/California_condor'},
      {label:'Ventana Wildlife Society', url:'https://www.ventanaws.org/california-condor'},
      {label:'U.S. Fish & Wildlife', url:'https://www.fws.gov/species/california-condor-gymnogyps-californianus'},
    ]
  },
  'reptiles': {
    altFacts:[
      'Reptiles were the first fully terrestrial vertebrates — the evolution of the amniotic egg 312 million years ago freed them from needing water to reproduce.',
      'Modern reptiles include turtles, crocodilians, lizards, snakes, and the tuatara — but birds are also technically reptiles, making them the most diverse "reptile" group.',
      'The dinosaurs in this tree\'s bird lineage were reptiles — every chicken, sparrow, and eagle is a living dinosaur and a member of class Reptilia.',
      'Reptiles dominated Earth for over 180 million years during the Mesozoic Era — the "Age of Reptiles" lasted 50× longer than the entire existence of Homo sapiens.',
      'Many reptiles can regrow lost tails, and some can shift sex based on incubation temperature — crocodilians and turtles produce males or females depending on nest warmth.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Reptile'},
      {label:'Reptile Database', url:'https://reptile-database.reptarium.cz/'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals?type=reptiles'},
    ]
  },
  'amphibians': {
    altFacts:[
      'Amphibians were the first vertebrates to walk on land — about 370 million years ago, fish-like tetrapods hauled themselves onto shore and changed the course of evolution.',
      'Amphibian skin is so thin and permeable that many species can breathe through it — some lungless salamanders have no lungs at all and rely entirely on skin respiration.',
      'The global amphibian crisis is the worst extinction event since the dinosaurs — 41% of amphibian species are threatened, largely due to the chytrid fungus Batrachochytrium.',
      'The class name Amphibia comes from Greek amphi (both) + bios (life), reflecting their dual life — aquatic larvae with gills that metamorphose into air-breathing terrestrial adults.',
      'Amphibians produce a pharmacy of bioactive skin compounds — painkillers, antibiotics, and antiviral agents. The phantasmal poison frog\'s epibatidine is 200× more potent than morphine.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Amphibian'},
      {label:'AmphibiaWeb', url:'https://amphibiaweb.org/'},
      {label:'IUCN Amphibian Specialist Group', url:'https://www.iucn-amphibians.org/'},
    ]
  },
  'green-sea-turtle': {
    altFacts:[
      'Green sea turtles navigate thousands of kilometers across open ocean to the exact beach where they hatched — imprinting on Earth\'s magnetic signature at birth as an internal GPS.',
      'Despite weighing up to 315 kg, green turtles can swim at 35 km/h in short bursts and hold their breath for up to 5 hours while sleeping underwater.',
      'Sea turtles are ancient reptiles — they diverged from other reptiles about 200 million years ago, predating the dinosaur extinction by over 130 million years.',
      'The "green" in green sea turtle refers not to their shell but to the green color of their body fat, tinted by the seagrass and algae they eat.',
      'Green turtle grazing maintains healthy seagrass meadows — without them, seagrass beds become overgrown and collapse, losing their role as critical carbon sinks.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Green_sea_turtle'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/green-turtle'},
      {label:'Sea Turtle Conservancy', url:'https://conserveturtles.org/'},
    ]
  },
  'king-cobra': {
    altFacts:[
      'The king cobra is the only snake in the world that builds a nest for its eggs — the female constructs a mound of leaves and guards it fiercely for 60-90 days.',
      'A single bite delivers enough neurotoxin to kill an Asian elephant or 20 humans — yet king cobras are shy and will flee if given the chance.',
      'King cobras eat almost exclusively other snakes — their genus name Ophiophagus literally means "snake-eater." They are immune to the venom of the snakes they consume.',
      'In Hindu mythology, cobras (nagas) are sacred guardians of treasure and water. King cobras are revered across South and Southeast Asia.',
      'King cobras can raise the front third of their body off the ground when threatened — standing eye-to-eye with a human — and will growl rather than hiss, a sound unique among snakes.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/King_cobra'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/reptiles/facts/king-cobra'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/177540/1491874'},
    ]
  },
  'saltwater-crocodile': {
    altFacts:[
      'The saltwater crocodile has the strongest bite ever measured — 3,700 PSI — yet its jaw-opening muscles are so weak that a few layers of duct tape can hold its mouth shut.',
      'Saltwater crocs can swim in the open ocean for weeks, riding currents across 500+ km of sea — they\'ve been tracked moving between Australia and Southeast Asian islands.',
      'Crocodilians are archosaurs — the same group that includes dinosaurs and birds. A crocodile is more closely related to a sparrow than to any lizard.',
      'The species name Crocodylus porosus means "pored crocodile," referring to the sensory pits on their snout that detect water pressure changes — essentially a sixth sense.',
      'Saltwater crocodiles survived the K-Pg extinction that killed the non-avian dinosaurs — their lineage has been essentially unchanged for 80 million years.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Saltwater_crocodile'},
      {label:'Australia Zoo', url:'https://www.australiazoo.com.au/our-animals/reptiles/crocodilians/saltwater-crocodile'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/reptiles/facts/saltwater-crocodile'},
    ]
  },
  'chameleon': {
    altFacts:[
      'Chameleons don\'t change color for camouflage — they change color to communicate mood, social status, and temperature. The skin contains nanocrystal lattices that shift light reflection.',
      'A chameleon\'s tongue accelerates at 2,590 m/s² — 264 g of force — and reaches prey in 20 milliseconds, faster than a jet fighter catapult.',
      'Chameleons are a specialized clade of lizards — over half of all species live in Madagascar, suggesting the island was a major center of their evolution.',
      'The name "chameleon" comes from Greek chamai (on the ground) + leon (lion) = "ground lion." Ancient Aristotle studied their color change.',
      'Each of a chameleon\'s eyes moves independently, giving 360-degree vision. When prey is spotted, both eyes converge to provide stereoscopic depth perception for the tongue strike.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Chameleon'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/chameleon'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/reptiles/facts/chameleon'},
    ]
  },
  'anaconda': {
    altFacts:[
      'The green anaconda is the heaviest snake on Earth — up to 250 kg and 9 meters long — yet moves through water with surprising grace and stealth.',
      'Anacondas kill by constriction, tightening each time the prey exhales until the heart can no longer pump. They swallow prey whole, including caimans and capybaras.',
      'Anacondas are boas — members of the family Boidae — which are more distantly related to pythons than they appear. The two groups convergently evolved similar body plans.',
      'The name "anaconda" may come from the Tamil anai-kondra (elephant killer) or the Sinhalese hena-kanda (thunder snake).',
      'Female anacondas are much larger than males and sometimes eat their mates after breeding — providing nutrients for the 7-month gestation of up to 80 live young.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Green_anaconda'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/reptiles/facts/green-anaconda'},
      {label:'Smithsonian National Zoo', url:'https://nationalzoo.si.edu/animals/green-anaconda'},
    ]
  },
  'gecko': {
    altFacts:[
      'Gecko toe pads use van der Waals forces — weak molecular attractions between billions of microscopic hair-like setae and any surface — no glue, suction, or chemicals involved.',
      'A gecko\'s adhesion is so strong that a single toe can support its entire body weight, yet it peels off effortlessly by changing the angle — inspiring self-cleaning adhesive tape.',
      'Geckos are one of the most species-rich lizard families, with over 2,000 species — they diverged from other lizards about 200 million years ago.',
      'The word "gecko" comes from the Malay ge\'kok or Javanese toké, imitating the distinctive clicking call that many species produce at night.',
      'Most geckos lack eyelids and instead lick their eyes clean with their tongue. Some species have UV vision and can see color in near-total darkness.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Gecko'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/gecko'},
      {label:'Nature — gecko adhesion', url:'https://www.nature.com/articles/35025141'},
    ]
  },
  'python': {
    altFacts:[
      'Pythons have infrared-sensing pit organs along their lips that detect temperature differences of 0.003°C — they can "see" the body heat of prey in total darkness.',
      'A python\'s jaw is not dislocated when feeding — instead, the two halves of the lower jaw are connected by elastic ligaments, and each side walks forward independently to swallow prey.',
      'Pythons are among the most ancient snakes — the family Pythonidae diverged from other snakes about 70 million years ago. They retain vestigial pelvic bones and tiny hind leg claws.',
      'The name "python" comes from the mythological Greek serpent Python, slain by Apollo at Delphi. The Oracle at Delphi was originally called Pythia.',
      'Female Burmese pythons can raise their body temperature by "shivering" their muscles to incubate eggs — they coil around the clutch and generate heat for months.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Pythonidae'},
      {label:'Reptile Database', url:'https://reptile-database.reptarium.cz/advanced_search?taxon=Pythonidae'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/reptiles/facts/burmese-python'},
    ]
  },
  'iguana': {
    altFacts:[
      'Marine iguanas in the Galápagos are the world\'s only sea-going lizards — they dive up to 12 meters to graze on algae, then bask on rocks and sneeze crystallized salt from nasal glands.',
      'Green iguanas can survive falls from 15 meters onto hard ground or water, landing on their hind legs — a useful skill for a tree-dwelling reptile escaping predators.',
      'Iguanas are part of the squamate order — closely related to other lizards and snakes in this tree, sharing a common ancestor about 200 million years ago.',
      'The word "iguana" comes from the Taíno iwana, adopted by Spanish colonists. The marine iguana\'s species name cristatus means "crested."',
      'Charles Darwin was so unimpressed by marine iguanas he called them "disgusting, clumsy lizards" — yet they became a key exhibit in his theory of adaptation to environment.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Iguana'},
      {label:'Galápagos Conservation Trust', url:'https://galapagosconservation.org.uk/wildlife/marine-iguana/'},
      {label:'San Diego Zoo Wildlife', url:'https://animals.sandiegozoo.org/animals/green-iguana'},
    ]
  },
  'leatherback-turtle': {
    altFacts:[
      'The leatherback turtle dives to 1,280 meters — deeper than most military submarines — making it the deepest-diving reptile on Earth.',
      'Leatherbacks can maintain a body temperature 18°C above the surrounding water using countercurrent heat exchangers — unique among reptiles and approaching warm-blooded physiology.',
      'Leatherbacks are the most ancient living turtle lineage — virtually unchanged for 100 million years. They outlasted the dinosaurs, but may not outlast plastic bags.',
      'The name "leatherback" refers to its unique shell — instead of bony scutes, it has a flexible, leathery carapace with embedded bone pieces, reducing drag for deep diving.',
      'Leatherbacks eat their body weight in jellyfish every day (~200 kg) — they mistake floating plastic bags for jellyfish, a leading cause of death for the species.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Leatherback_sea_turtle'},
      {label:'Sea Turtle Conservancy', url:'https://conserveturtles.org/information-about-sea-turtles-leatherback-sea-turtle/'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/6494/43526147'},
    ]
  },
  'golden-poison-frog': {
    altFacts:[
      'One golden poison frog carries enough batrachotoxin to kill 10 adult humans — making it the most toxic animal on Earth, gram for gram.',
      'The frog\'s toxin works by permanently opening sodium channels in nerve cells, causing uncontrollable muscle contraction and heart failure within minutes.',
      'Poison dart frogs are closely related to other tree frogs in the order Anura — their toxicity evolved from dietary sequestration of alkaloids from the ants and beetles they eat.',
      'The Emberá people of Colombia tip blowgun darts with the frog\'s skin secretions — the toxin remains potent for over a year. The scientific name Phyllobates terribilis means "terrifying leaf-climber."',
      'Captive-bred golden poison frogs are completely harmless — they become non-toxic because they lack the specific wild insect diet that provides the alkaloid precursors.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Golden_poison_frog'},
      {label:'AmphibiaWeb', url:'https://amphibiaweb.org/species/1894'},
      {label:'Smithsonian', url:'https://nationalzoo.si.edu/animals/golden-poison-frog'},
    ]
  },
  'axolotl': {
    altFacts:[
      'Axolotls can regenerate entire limbs, spinal cord, heart tissue, and parts of their brain with zero scarring — a superpower that scientists are studying for potential human medical applications.',
      'Unlike most amphibians, axolotls never metamorphose — they retain their larval gills and aquatic form throughout life, a condition called neoteny.',
      'Axolotls are salamanders, closely related to the tiger salamander — they\'re part of the ancient amphibian lineage that first walked on land 370 million years ago.',
      'The name "axolotl" comes from Nahuatl atl (water) + xolotl (monster/deity) — Xolotl was the Aztec god of fire and lightning who transformed into an axolotl to escape sacrifice.',
      'Wild axolotls may number fewer than 1,000, confined to the canals of Lake Xochimilco in Mexico City — yet millions exist in laboratories and aquariums worldwide.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Axolotl'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/1095/53947766'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/amphibians/facts/axolotl'},
    ]
  },
  'chinese-giant-salamander': {
    altFacts:[
      'The Chinese giant salamander can reach 1.8 meters — the largest amphibian on Earth — and has remained essentially unchanged for 170 million years.',
      'It detects prey using a lateral line system similar to fish — sensing vibrations in the water to locate crayfish, frogs, and fish in total darkness.',
      'Giant salamanders belong to the most ancient salamander family (Cryptobranchidae), which diverged from other salamanders about 170 million years ago — they\'re living fossils.',
      'Called wáwa yú (baby fish) in Chinese for the crying sound it makes when distressed. Despite being critically endangered, it is considered a luxury food item.',
      'Recent genetic studies revealed that what was thought to be one species is actually at least five distinct species — some already extinct before they were even described.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Chinese_giant_salamander'},
      {label:'ZSL Conservation', url:'https://www.zsl.org/conservation/regions/asia/chinese-giant-salamander'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/3854/22469898'},
    ]
  },
  'caecilian': {
    altFacts:[
      'Caecilians are the least-known order of amphibians — limbless, mostly blind, worm-like burrowers that most biologists have never seen alive.',
      'Some caecilian mothers grow a nutrient-rich outer skin layer that their young scrape off and eat — a form of parental care called dermatotrophy found nowhere else in nature.',
      'Caecilians are true amphibians, more closely related to frogs and salamanders than to snakes or worms — despite looking almost identical to earthworms.',
      'The name "caecilian" comes from Latin caecus (blind) — most species have tiny eyes hidden beneath skin or bone, and some have none at all.',
      'Some aquatic caecilians have a unique retractable tentacle between the eye and nostril — a sensory organ found in no other vertebrate.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Caecilian'},
      {label:'AmphibiaWeb', url:'https://amphibiaweb.org/lists/Gymnophiona.shtml'},
      {label:'Natural History Museum', url:'https://www.nhm.ac.uk/discover/what-is-a-caecilian.html'},
    ]
  },
  'giant-salamander': {
    altFacts:[
      'Japanese giant salamanders can live over 80 years — the longest-lived amphibian — and grow to 1.5 meters in cool mountain streams.',
      'They are nocturnal ambush predators that sit motionless on the river bottom, detecting prey through lateral line vibrations — then strike with a powerful sideways snap.',
      'Japanese giant salamanders are in the same ancient family as the Chinese giant salamander — Cryptobranchidae, a lineage essentially unchanged since the Jurassic.',
      'Called ōsanshōuo (大山椒魚, "giant pepper fish") in Japanese because their skin secretions smell like Japanese pepper. They are a protected national monument.',
      'Giant salamanders breathe almost entirely through their heavily wrinkled skin — the folds increase surface area for gas exchange, as their lungs are too small to meet oxygen demands.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Japanese_giant_salamander'},
      {label:'IUCN Red List', url:'https://www.iucnredlist.org/species/1273/3375181'},
      {label:'Japan Times', url:'https://www.japantimes.co.jp/news/giant-salamander/'},
    ]
  },
  'red-eyed-tree-frog': {
    altFacts:[
      'Red-eyed tree frog embryos can detect approaching snake vibrations through the egg membrane and hatch prematurely — dropping into water below to escape, days before normal hatching.',
      'The brilliant red eyes may serve as a "startle defense" — when a sleeping frog is disturbed, it opens its eyes wide, the flash of red potentially confusing a predator long enough to escape.',
      'Red-eyed tree frogs are part of the neotropical tree frog family Phyllomedusidae — related to other tree frogs but not closely related to poison dart frogs despite sharing habitat.',
      'The species name Agalychnis callidryas means "beautiful tree nymph" — from Greek kallos (beauty) + dryas (tree nymph).',
      'Despite their vivid coloring, red-eyed tree frogs are not poisonous — their bright colors are a bluff (Batesian mimicry) that makes predators assume they\'re toxic.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Agalychnis_callidryas'},
      {label:'National Geographic', url:'https://www.nationalgeographic.com/animals/amphibians/facts/red-eyed-tree-frog'},
      {label:'Smithsonian', url:'https://nationalzoo.si.edu/animals/red-eyed-tree-frog'},
    ]
  },
  'shark': { altFacts:['Sharks have been on Earth for 450 million years — they predate trees, dinosaurs, and the first land vertebrates.','Sharks sense electromagnetic fields from a fish\'s heartbeat at 1 meter using ampullae of Lorenzini.','Sharks are cartilaginous fish (Chondrichthyes), more distantly related to bony fish than those fish are to us.','The word "shark" may come from the Mayan xok, brought back by 16th-century English sailors.','Humans kill ~100 million sharks per year — mostly for shark fin soup. Sharks kill ~5 humans per year.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Shark'},{label:'Shark Trust',url:'https://www.sharktrust.org/'},{label:'IUCN SSG',url:'https://www.iucnssg.org/'}] },
  'lungfish': { altFacts:['Lungfish can estivate for up to 4 years in a mucus cocoon in dried mud — then revive when rains return.','The Australian lungfish has the largest genome of any animal — 43 billion base pairs, 14× the human genome.','Lungfish are the closest living fish relatives of all land vertebrates — more closely related to you than to a tuna.','The name "lungfish" is literal — they have true lungs in addition to gills.','Australian lungfish Granddad at Shedd Aquarium survived from 1933 to 2017 — over 80 years.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Lungfish'},{label:'Australian Museum',url:'https://australian.museum/learn/animals/fishes/australian-lungfish/'},{label:'Nature',url:'https://www.nature.com/articles/s41586-021-03198-8'}] },
  'coelacanth': { altFacts:['The coelacanth was presumed extinct for 66 million years until a living specimen was caught off South Africa in 1938.','Coelacanth lobe fins move in an alternating pattern similar to four-legged walking — foreshadowing tetrapod limbs.','Coelacanths are lobe-finned fish, placing them closer to humans than to most other fish.','The name means "hollow spine" in Greek — referring to unique hollow fin rays.','Only ~500 coelacanths exist — split between Comoro Islands and Indonesia. They can live over 100 years.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Coelacanth'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/fish/coelacanth'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/5765/154789136'}] },
  'clownfish': { altFacts:['All clownfish are born male — the dominant individual changes sex to female irreversibly.','Clownfish are immune to anemone stings via a mucus coating — a symbiosis benefiting both species.','Finding Nemo triggered a 40% increase in wild-caught clownfish demand. "Nemo" means "nobody" in Latin.','Clownfish produce clicking sounds to communicate dominance — the largest female produces the lowest pitch.','Clownfish are damselfish (Pomacentridae) — not closely related to most reef fish despite sharing habitat.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Clownfish'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/clown-anemonefish'},{label:'NOAA',url:'https://oceanservice.noaa.gov/facts/clownfish.html'}] },
  'anglerfish': { altFacts:['Male deep-sea anglerfish fuse permanently to the female — dissolving until nothing remains but gonads supplying sperm on demand.','The bioluminescent lure is powered by symbiotic bacteria — producing light at zero energy cost in pitch darkness.','Anglerfish are ray-finned fish (Lophiiformes) with 200+ species that diversified in the deep sea.','The "angler" refers to a modified dorsal fin spine acting as a fishing rod tipped with a glowing lure.','Anglerfish can swallow prey twice their own size — an adaptation to deep-ocean food scarcity.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Anglerfish'},{label:'Monterey Bay Aquarium',url:'https://www.montereybayaquarium.org/animals/animals-a-to-z/deep-sea-anglerfish'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/fish/anglerfish'}] },
  'seahorse': { altFacts:['Male seahorses get pregnant — the female deposits eggs into his brood pouch, where he gives birth to up to 2,000 young.','Seahorses have a 1-millisecond strike speed — their snout creates a "no-wake zone" for ambushing copepods.','The genus Hippocampus means "horse sea-monster" in Greek. The brain\'s seahorse-shaped structure shares the name.','Over 37 million seahorses are traded annually for traditional medicine — most species are declining.','Seahorses are highly modified pipefish that evolved their upright posture about 25 million years ago.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Seahorse'},{label:'Project Seahorse',url:'https://www.projectseahorse.org/'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/seahorses'}] },
  'manta-ray': { altFacts:['Manta rays have the largest brain-to-body ratio of any cold-blooded fish and pass the mirror self-recognition test.','Giant mantas barrel-roll through plankton clouds — using cephalic fins to funnel water into their 1-meter mouths.','Mantas are cartilaginous fish related to sharks — both diverged from bony fish ~430 million years ago.','The word "manta" means "blanket" in Spanish, given by pearl divers who saw them as living cloaks.','Each manta has unique belly spots used for identification — some individuals tracked for 20+ years.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Manta_ray'},{label:'Manta Trust',url:'https://www.mantatrust.org/'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/198921/126669349'}] },
  'pufferfish': { altFacts:['Pufferfish contain tetrodotoxin — 1,200× more poisonous than cyanide — with no known antidote.','Males construct elaborate geometric sand circles on the ocean floor — the most complex structure built by any fish.','Pufferfish are related to ocean sunfish and triggerfish in the order Tetraodontiformes.','In Japan, fugu requires 3+ years of chef training. About 50 people are poisoned annually.','Pufferfish inflate by gulping water to 2-3× normal size. Their beak-like teeth crush shellfish.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Tetraodontidae'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/pufferfish'},{label:'Monterey Bay Aquarium',url:'https://www.montereybayaquarium.org/animals/animals-a-to-z/pufferfish'}] },
  'whale-shark': { altFacts:['The whale shark is the largest fish at up to 18.8 m — yet feeds exclusively on plankton, filtering 6,000 liters/hour.','NASA adapted star-mapping software to identify individual whale sharks from their unique spot patterns.','Whale sharks are sharks (Chondrichthyes), not whales — they diverged from other sharks ~60 million years ago.','In Vietnam, whale sharks are cá ông (Mr. Fish) — fishermen pray to them for sea protection.','Whale shark eyes are covered with tooth-like denticles — unique armor found nowhere else.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Whale_shark'},{label:'WWF',url:'https://www.worldwildlife.org/species/whale-shark'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/19488/2365291'}] },
  'electric-eel': { altFacts:['Electric eels are not eels — they\'re knifefish related to catfish. Three electric organs produce 860-volt shocks.','They remotely control prey — high-voltage pulses cause involuntary muscle twitches, revealing hidden fish.','Alexander von Humboldt\'s 1800 account of electric eels fighting horses was long dismissed but recently confirmed.','The genus Electrophorus means "electricity bearer." They must surface every 10 minutes to breathe air.','Electric eels leap from water to shock threats — pressing their chin against a predator for direct-contact pulses.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Electric_eel'},{label:'Smithsonian',url:'https://nationalzoo.si.edu/animals/electric-eel'},{label:'Nature',url:'https://www.nature.com/articles/nature.2014.16499'}] },
  'piranha': { altFacts:['Piranhas\' reputation was largely staged — Roosevelt witnessed a 1913 feeding frenzy using starved piranhas in a netted river section.','Red-bellied piranha bite force is 320 N — 3× body weight, strongest of any bony fish relative to size.','The word "piranha" comes from Tupí pira (fish) + sainha (tooth). People eat piranhas more than piranhas eat people.','Piranhas bark — producing distinct sounds for confrontation, chasing, and biting.','Piranhas are in Characiformes, closely related to peaceful tetras and the vegetarian tambaqui.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Piranha'},{label:'Smithsonian',url:'https://www.si.edu/stories/everything-you-know-about-piranhas-wrong'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/piranha'}] },
  'hammerhead-shark': { altFacts:['The hammerhead\'s cephalofoil gives nearly 360° binocular vision — seeing above and below simultaneously.','Hammerheads scan the ocean floor like metal detectors — dense electroreceptor arrays detect buried stingrays.','Hammerheads evolved their head shape ~20 million years ago — relatively recently for sharks.','Great hammerheads use their dorsal fin for banking turns — essentially flying through water.','Great hammerheads are Critically Endangered — populations declined 80%+ from the shark fin trade.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Hammerhead_shark'},{label:'Shark Research Institute',url:'https://www.sharks.org/species/hammerhead-sharks'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/39386/2920499'}] },
  'mola-mola': { altFacts:['The ocean sunfish grows from a 2.5 mm larva to 2,300 kg — a 60-million-fold increase, greatest of any vertebrate.','Mola mola produces 300 million eggs at once — more than any other known vertebrate.','Ocean sunfish are related to pufferfish — both share order Tetraodontiformes and fused beak-like mouths.','The name "mola" means "millstone" in Latin. In German: Mondfisch (moon fish), Japanese: mambo.','Mola mola has no true tail fin — it steers by squirting water from its gills.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Ocean_sunfish'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/ocean-sunfish-mola'},{label:'Monterey Bay Aquarium',url:'https://www.montereybayaquarium.org/animals/animals-a-to-z/ocean-sunfish'}] },
  'salmon': { altFacts:['Pacific salmon die after spawning — bodies decompose while alive as they redirect all energy to reproduction.','Salmon navigate thousands of km using magnetic fields, then switch to smell to find their natal stream.','The word "salmon" from Latin salmo may derive from salire (to leap) — referencing their waterfall jumps.','Spawning salmon fertilize forests — decomposing bodies provide nitrogen to trees 500 m from rivers.','Salmon are Salmonidae, related to trout and char — one of the more ancient ray-finned fish lineages.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Salmon'},{label:'NOAA Fisheries',url:'https://www.fisheries.noaa.gov/species/pacific-salmon'},{label:'Wild Salmon Center',url:'https://wildsalmoncenter.org/'}] },
  'flying-fish': { altFacts:['Flying fish launch at 60 km/h and glide up to 200 m for 45 seconds — tail beats 70×/sec during takeoff.','Their "flight" evolved as anti-predator defense — escaping tuna, dolphins, and marlins by leaving the water.','The genus Exocoetus means "sleeping outside" — ancients thought they left the water to sleep on shore.','In Japan, flying fish (tobiuo) are used for dashi broth and tobiko — the tiny orange eggs on sushi.','Flying fish are ray-finned fish (Exocoetidae) — their gliding evolved independently from bird flight.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Flying_fish'},{label:'Ocean Conservancy',url:'https://oceanconservancy.org/wildlife-factsheet/flying-fish/'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/flying-fish'}] },
  'tuna': { altFacts:['Bluefin tuna are warm-blooded — countercurrent heat exchangers keep muscles 10-20°C above surrounding water.','A single bluefin sold for $3.1 million in 2019. They cross the Atlantic in 60 days at 75 km/h.','Tuna are Scombridae with mackerels — pelagic predators with retractable fins and streamlined bodies.','The word traces from Spanish atún to Arabic tun to Latin thunnus to Greek thynnos.','Bluefin have been overfished to <3% of original populations — strict quotas since 2010 are showing recovery.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Tuna'},{label:'ISSF',url:'https://www.iss-foundation.org/'},{label:'WWF',url:'https://www.worldwildlife.org/species/bluefin-tuna'}] },
  'swordfish': { altFacts:['A special organ heats the swordfish\'s brain and eyes 15°C above water — giving sharper vision in cold depths.','The bill slashes laterally through fish schools at 100 km/h, stunning multiple prey — it\'s not for spearing.','Swordfish are the sole species in family Xiphiidae — one of the most taxonomically isolated fish.','Xiphias comes from Greek xiphos (sword). Romans prized swordfish as food for gladiators.','Young swordfish have teeth and scales — adults lose both for a smooth, drag-reducing body.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Swordfish'},{label:'NOAA Fisheries',url:'https://www.fisheries.noaa.gov/species/north-atlantic-swordfish'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/swordfish'}] },
  'mudskipper': { altFacts:['Mudskippers spend 90% of time on land — breathing through skin and mouth lining, carrying water in enlarged gill chambers.','They walk on modified pectoral fins, leap 60 cm, and climb trees using fins as grippers.','Mudskippers are true fish (Oxudercidae) — not transitional forms, but fish that independently evolved terrestrial abilities.','In Japanese: mutsugorou (ムツゴロウ), a protected species in Ariake Bay.','They roll bulging eyes into moist sockets to keep them wet — and retract eyes to push food down their throat.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Mudskipper'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/mudskipper'},{label:'BBC Wildlife',url:'https://www.discoverwildlife.com/animal-facts/fish/facts-about-mudskippers/'}] },
  'blobfish': { altFacts:['The blobfish\'s droopy face is decompression damage — at its natural 600-1,200 m depth, it looks like a normal fish.','Its gelatinous body hovers above the seafloor at zero energy cost — passively eating whatever drifts past.','Blobfish are fathead sculpins (Psychrolutidae), related to scorpionfish and lionfish.','Voted "World\'s Ugliest Animal" in 2013 — entirely from decompressed specimen photos.','Almost everything known comes from bycatch in deep-sea trawl nets off Australia.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Blobfish'},{label:'Australian Museum',url:'https://australian.museum/learn/animals/fishes/smooth-head-blobfish/'},{label:'Deep Sea Conservation',url:'https://www.savethehighseas.org/'}] },
  'arapaima': { altFacts:['The arapaima must surface every 10-20 minutes to gulp air — the distinctive sound helps fishermen locate them.','Arapaima scales resist piranha bites — hard mineral over flexible collagen has inspired bulletproof vest research.','Arapaima are "bony tongues" (Osteoglossiformes) — an ancient lineage from the Jurassic.','Called pirarucu in Brazil from Tupí pira (fish) + urucu (red) for its red tail markings.','Their bony, tooth-covered tongue crushes prey against the palate — a "second jaw."'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Arapaima'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/fish/facts/arapaima'},{label:'WWF',url:'https://www.worldwildlife.org/species/arapaima'}] },
  'invertebrates': { altFacts:['Invertebrates make up 97% of all known animal species — roughly 1.3 million described, with millions more undiscovered.','Some invertebrates regenerate entire bodies from fragments, tolerate near-absolute-zero temperatures, or survive the vacuum of space.','Vertebrates evolved from invertebrate ancestors — the chordate lineage branched off from deuterostomes over 540 million years ago.','The term "invertebrata" was coined by Jean-Baptiste Lamarck in 1801 to describe animals without a backbone.','Invertebrate biomass dwarfs vertebrates: ants alone outweigh all wild mammals combined.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Invertebrate'},{label:'Smithsonian',url:'https://naturalhistory.si.edu/research/invertebrate-zoology'},{label:'AMNH',url:'https://www.amnh.org/research/invertebrate-zoology'}] },
  'arthropoda': { altFacts:['Arthropods account for over 80% of all known animal species — more than 1.2 million described, dominating every habitat on Earth.','The exoskeleton is made of chitin — lighter than bone, stronger per weight than steel, and shed periodically to allow growth.','Arthropods share a common ancestor with velvet worms (Onychophora), which resemble the soft-bodied precursors of all jointed-legged animals.','The name means "jointed foot" from Greek arthron (joint) + pous (foot) — first used by Siebold and Stannius in 1845.','A single swarm of Antarctic krill weighs more than all humans on Earth — roughly 500 million tonnes.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Arthropod'},{label:'Tree of Life Web',url:'http://tolweb.org/Arthropoda'},{label:'AMNH',url:'https://www.amnh.org/research/invertebrate-zoology'}] },
  'insects': { altFacts:['There are roughly 10 quintillion (10,000,000,000,000,000,000) individual insects alive at any given moment.','Some beetles survive being frozen at −60°C by producing antifreeze proteins; others withstand 50°C deserts by stilting on long legs.','Insects are nested within Crustacea — making them essentially terrestrial crustaceans, more closely related to shrimp than to spiders.','The word "insect" comes from Latin insectum ("cut into"), a calque of Greek entomon — referring to their segmented bodies.','Insects pollinate 75% of food crops, decompose organic matter, and form the base of most terrestrial food webs.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Insect'},{label:'Entomological Society',url:'https://www.entsoc.org/'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/insects.html'}] },
  'monarch-butterfly': { altFacts:['Monarchs migrate up to 4,800 km from Canada to a few hectares of Mexican fir forest — no individual makes the round trip; it takes 4 generations.','They store cardiac glycosides from milkweed, making them toxic to birds — a single monarch contains enough poison to sicken 5 blue jays.','Monarchs are Lepidoptera, sharing the order with moths — the butterfly lineage is actually nested within moths.','In Mexico, monarchs arrive around Dia de los Muertos — Aztecs believed they carried the souls of the dead.','Monarch populations have declined ~80% since the 1990s due to herbicide-driven loss of milkweed.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Monarch_butterfly'},{label:'Monarch Watch',url:'https://www.monarchwatch.org/'},{label:'WWF',url:'https://www.worldwildlife.org/species/monarch-butterfly'}] },
  'dragonfly': { altFacts:['Dragonflies have a 95% hunting success rate — the highest of any predator, compared to 25% for lions and 50% for great white sharks.','They fly at 55 km/h, hover, fly backwards, and each wing moves independently — four-wing flight unmatched by any aircraft.','Carboniferous dragonflies (Meganeura) had 70 cm wingspans — giant insects enabled by 35% atmospheric oxygen levels.','The order Odonata means "toothed ones" in Greek, referring to their serrated mandibles.','Dragonfly larvae are aquatic apex predators for 1-5 years before a single day of metamorphosis into adults.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Dragonfly'},{label:'British Dragonfly Society',url:'https://british-dragonflies.org.uk/'},{label:'Smithsonian',url:'https://www.si.edu/spotlight/buginfo/dragonfly'}] },
  'atlas-moth': { altFacts:['The atlas moth has no functional mouth — adults cannot eat and survive only 1-2 weeks on fat reserves stored as caterpillars.','With a wingspan up to 27 cm and wing area of 400 cm², it is one of the largest insects by total wing surface.','Atlas moths are Saturniidae, sharing the family with luna moths and cecropia moths — all lack functional adult mouthparts.','The wingtips mimic cobra heads — a defense that startles predators. "Atlas" may reference the Titan or the map-like wing patterns.','Caterpillars spin silk cocoons once used commercially in India — the silk (fagara) is brown and more durable than Bombyx silk.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Atlas_moth'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/atlas-moth.html'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/atlas-moth'}] },
  'bombardier-beetle': { altFacts:['Bombardier beetles fire boiling-hot (100°C) chemical spray from their abdomen at 500 pulses per second — a biological pulse jet.','The spray combines hydroquinone and hydrogen peroxide in a reinforced reaction chamber — producing an explosive exothermic reaction.','Bombardier beetles are ground beetles (Carabidae) — one of the largest beetle families, with over 40,000 species.','Charles Darwin once put a bombardier beetle in his mouth while collecting specimens — and was sprayed, dropping all three beetles he was holding.','The pulsed spray mechanism inspired biomimetic research into fuel injection and pharmaceutical misting devices.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Bombardier_beetle'},{label:'Smithsonian',url:'https://www.si.edu/spotlight/buginfo/bombardier-beetle'},{label:'Science',url:'https://www.science.org/doi/10.1126/science.1099545'}] },
  'horseshoe-crab': { altFacts:['Horseshoe crabs predate dinosaurs by 200 million years — virtually unchanged for 450 million years, the oldest living arthropod design.','Their blue, copper-based blood contains LAL, which detects bacterial toxins — every injectable drug and vaccine is tested with it.','Despite the name, horseshoe crabs are not crabs — they are chelicerates, more closely related to spiders and scorpions.','Called "living fossils" since Darwin, though they have diversified significantly at the molecular level.','Each spring, millions spawn on Delaware Bay beaches — their eggs fuel the entire Red Knot shorebird migration.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Horseshoe_crab'},{label:'Ecological Research & Development Group',url:'https://www.horseshoecrab.org/'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/11987/13413456'}] },
  'mollusca': { altFacts:['Mollusks include the most intelligent invertebrate (octopus), the largest invertebrate (colossal squid), and animals with the most eyes (chiton: ~1,000 lenses).','The giant squid\'s eye is the size of a dinner plate (27 cm) — the largest in the animal kingdom, evolved to spot sperm whales in the deep.','Mollusks are lophotrochozoans — more closely related to earthworms than to arthropods, despite superficial similarity to crustaceans.','The phylum name comes from Latin mollis (soft) — referring to their soft bodies, though many produce the hardest biomineral structures known.','Mollusks have been used as currency (cowrie shells), dye (Tyrian purple from murex), and food worldwide for over 100,000 years.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Mollusca'},{label:'Tree of Life Web',url:'http://tolweb.org/Mollusca'},{label:'AMNH',url:'https://www.amnh.org/research/invertebrate-zoology/research/mollusca'}] },
  'cephalopods': { altFacts:['Octopuses have 500 million neurons — 2/3 in their arms, which can taste, smell, and make decisions independently of the brain.','Cuttlefish change color in 200 milliseconds using chromatophores — faster than any other color-changing animal, despite being colorblind.','Cephalopods are the only mollusks with closed circulatory systems and complex brains — convergently evolving intelligence with vertebrates.','The name means "head-foot" in Greek — their arms grow directly from their head, a body plan unique among animals.','The nautilus has survived 5 mass extinctions virtually unchanged, while ammonites — once far more diverse — went extinct with the dinosaurs.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cephalopod'},{label:'CephRes',url:'https://www.cephalopodresearch.org/'},{label:'Monterey Bay Aquarium',url:'https://www.montereybayaquarium.org/animals/animals-a-to-z/cephalopods'}] },
  'giant-squid': { altFacts:['The giant squid was not photographed alive until 2004 — after centuries of kraken legends, the first image came from 900 m depth off Japan.','Its tentacles reach 13 m, lined with serrated sucker rings that leave permanent circular scars on sperm whale skin.','Giant squid are architeuthids — closer to the tiny bobtail squid than to the colossal squid, which belongs to a different family.','The genus Architeuthis means "ruling squid" — Aristotle described giant squid, but science dismissed them as myth until 1857.','Giant squid have the largest axons in the animal kingdom (1 mm diameter) — so large they were the basis for Nobel Prize-winning nerve research.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Giant_squid'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/giant-squid'},{label:'TONMO',url:'https://tonmo.com/'}] },
  'cuttlefish': { altFacts:['Cuttlefish can simultaneously display different colors on each side of their body — courting a female on one side while showing male-threat on the other.','The cuttlebone is a unique internal shell that controls buoyancy by adjusting gas-to-liquid ratios in its chambers — inspiring submarine design.','Cuttlefish are decapods (10 arms) within cephalopods — more closely related to squid than to octopuses.','In Italian, "seppia" (cuttlefish) gives us "sepia" — the rich brown pigment from their ink, used since Greco-Roman times.','Cuttlefish pass the marshmallow test — they delay gratification, waiting for a preferred food, showing self-control rivaling primates.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cuttlefish'},{label:'NOVA',url:'https://www.pbs.org/wgbh/nova/cuttlefish/'},{label:'Monterey Bay Aquarium',url:'https://www.montereybayaquarium.org/animals/animals-a-to-z/flamboyant-cuttlefish'}] },
  'cnidarians': { altFacts:['Turritopsis dohrnii, the "immortal jellyfish," can revert from adult to polyp stage indefinitely — the only animal known to reverse its life cycle.','Box jellyfish have 24 eyes, including 4 with corneas, lenses, and retinas — more optically complex than most vertebrate eyes.','Cnidarians are among the earliest branching animal lineages — their radial body plan diverged from bilateral animals over 600 million years ago.','The name comes from Greek knide (nettle) — each cnidocyte fires a harpoon at 5 million g of acceleration, the fastest biological mechanism.','Coral reefs built by cnidarians cover <0.1% of the ocean floor but support 25% of all marine species.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cnidaria'},{label:'Tree of Life Web',url:'http://tolweb.org/Cnidaria'},{label:'Coral Reef Alliance',url:'https://coral.org/'}] },
  'box-jellyfish': { altFacts:['Chironex fleckeri venom can kill a human in 2 minutes — the most lethal venom of any animal, attacking heart, nervous system, and skin cells simultaneously.','Box jellyfish have 24 eyes arranged in clusters of 6, including image-forming eyes with lenses — in an animal with no brain.','Box jellyfish are cubozoans, not true jellyfish (scyphozoans) — they diverged over 500 million years ago.','In Australia, "stinger season" (October-May) closes beaches. Vinegar is the only first aid that deactivates unfired nematocysts.','They actively hunt using vision and can swim at 6 km/h — unlike true jellyfish, which mostly drift on currents.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Box_jellyfish'},{label:'Australian Museum',url:'https://australian.museum/learn/animals/jellyfish/box-jellyfish/'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/box-jellyfish'}] },
  'echinoderms': { altFacts:['Echinoderms have no brain, no blood, and no heart — they run on a hydraulic water vascular system that powers thousands of tube feet.','Starfish regenerate entire arms; some species regenerate a whole body from a single severed arm plus a piece of the central disc.','Echinoderms are deuterostomes — sharing embryonic development with vertebrates, making them our closest invertebrate relatives.','The name means "spiny skin" from Greek echinos (hedgehog) + derma (skin). Sea urchin means "sea hedgehog" in multiple languages.','The fossil record of echinoderms stretches back 540 million years and includes over 13,000 extinct species in bizarre body plans.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Echinoderm'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/echinodermata/echinodermata.html'},{label:'Tree of Life Web',url:'http://tolweb.org/Echinodermata'}] },
  'common-starfish': { altFacts:['Starfish eat by extruding their stomach out through their mouth, digesting prey externally, then retracting the stomach — dining inside-out.','They pry open mussels with sustained hydraulic force from hundreds of tube feet, each exerting just 0.02 N but together overwhelming the shell.','Starfish are echinoderms — deuterostomes more closely related to humans than to any insect, crab, or worm.','The common starfish (Asterias rubens) was one of the first animals described by Linnaeus in his 1758 Systema Naturae.','Starfish lack a centralized brain — a nerve ring coordinates 5 radial nerves, and any arm can lead locomotion.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Asterias_rubens'},{label:'MarLIN',url:'https://www.marlin.ac.uk/species/detail/1194'},{label:'Arkive',url:'https://www.arkive.org/common-starfish/asterias-rubens/'}] },
  'sea-urchin': { altFacts:['Sea urchin larvae have bilateral symmetry — then undergo radical metamorphosis into pentaradial adults, rebuilding their entire body plan.','Red sea urchins can live over 200 years — among the longest-lived animals, with no signs of aging even in centenarians.','Sea urchins share 70% of genes with humans — their genome was pivotal in discovering gene regulatory networks governing embryonic development.','Aristotle described the sea urchin mouth apparatus so precisely that it is still called "Aristotle\'s lantern" — 5 calcium teeth that self-sharpen.','Sea urchin overgrazing creates "urchin barrens" — kelp-free dead zones. Sea otter reintroduction reverses this via trophic cascade.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Sea_urchin'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/sea-urchins'},{label:'Nature',url:'https://www.nature.com/articles/nature05027'}] },
  'sea-cucumber': { altFacts:['When threatened, sea cucumbers eviscerate — ejecting their internal organs at a predator, then regenerating them within weeks.','They breathe through their anus — rhythmically pumping water through a respiratory tree inside their cloaca.','Sea cucumbers are echinoderms, related to starfish and sea urchins — all sharing the water vascular system and pentaradial symmetry.','In Chinese cuisine, sea cucumbers (haishēn, "sea ginseng") have been a luxury food for 1,000+ years, now worth $3 billion annually.','Sea cucumbers recycle seafloor sediment — a single individual processes 45 kg of sand per year, like earthworms of the ocean.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Sea_cucumber'},{label:'NOAA',url:'https://oceanservice.noaa.gov/facts/sea-cucumber.html'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/sea-cucumbers'}] },
  'sea-lily': { altFacts:['Sea lilies (crinoids) dominated Paleozoic oceans for 300 million years — their fossils form entire limestone formations.','They are animals, not plants — though they look like flowers, they are filter-feeding echinoderms anchored by stalks up to 20 m long.','Crinoids are the most ancient living echinoderm group — their body plan has persisted largely unchanged since the Ordovician (480 Mya).','The name Crinoidea means "lily-like" from Greek krinon (lily). Medieval Europeans called their fossils "St. Cuthbert\'s beads."','Modern crinoids have 200+ species and can detach their stalks to swim — rowing through water with feathered arms.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Crinoid'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/echinodermata/crinoidea.html'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/what-are-crinoids.html'}] },
  'annelids': { altFacts:['The giant tube worm (Riftia) grows up to 2.4 m at hydrothermal vents — fueled entirely by chemosynthetic bacteria, with no mouth, gut, or anus.','Earthworms turn 90 tonnes of soil per hectare per year — Darwin spent 39 years studying them and called them the most important animals in history.','Annelids are lophotrochozoans, more closely related to mollusks than to nematode worms — segmentation evolved independently from arthropods.','The name means "little rings" from Latin annellus — referring to their repeating body segments, each with its own nerve ganglion.','Leeches produce hirudin, the most potent natural anticoagulant — still used in microsurgery to prevent blood clots in reattached tissue.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Annelid'},{label:'Tree of Life Web',url:'http://tolweb.org/Annelida'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/annelida/annelida.html'}] },
  'common-earthworm': { altFacts:['Charles Darwin calculated that earthworms pass 10 tonnes of soil per acre through their bodies annually — his last book was entirely about them.','Earthworms have 5 pairs of aortic arches (pseudo-hearts) pumping blood through a closed circulatory system — rare among invertebrates.','Earthworms are oligochaete annelids — segmented worms more closely related to leeches than to flatworms or nematodes.','The species name Lumbricus terrestris was given by Linnaeus in 1758. "Lumbricus" meant "intestinal worm" in Latin.','After glaciers scraped North America clean 10,000 years ago, European earthworms reintroduced by settlers are now transforming forest soils.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Lumbricus_terrestris'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/earthworms.html'},{label:'Soil Biology',url:'https://www.soilbiologyprimers.com/earthworms/'}] },
  'medicinal-leech': { altFacts:['Medicinal leeches are FDA-approved medical devices — used in 60,000+ surgeries annually to drain congested blood from reattached fingers, ears, and flaps.','Leech saliva contains 100+ bioactive compounds — anticoagulants, vasodilators, anesthetics, and anti-inflammatories, a living pharmacy.','Leeches are clitellate annelids — more closely related to earthworms than to flatworms. They evolved bloodsucking independently from ticks and mosquitoes.','Hirudo medicinalis means "medical leech" — physicians from ancient Egypt to 19th-century Europe prescribed them, using 100 million per year in France alone.','Leeches have 32 brains (one ganglion per segment) and 3 jaws with 100 teeth each, leaving a distinctive Y-shaped bite mark.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Hirudo_medicinalis'},{label:'Biopharm Leeches',url:'https://www.biopharm-leeches.com/'},{label:'Smithsonian',url:'https://www.si.edu/stories/medicinal-leeches'}] },
  'pompeii-worm': { altFacts:['The Pompeii worm survives the steepest temperature gradient on any animal — 80°C at its tail, 22°C at its head, on hydrothermal vent chimneys.','A symbiotic bacterial fleece covers its back, possibly insulating it from heat — one of the most extreme animal-microbe partnerships known.','Pompeii worms are polychaete annelids — segmented worms in the family Alvinellidae, found only at Pacific hydrothermal vents.','Named Alvinella pompejana after the submersible Alvin and the city of Pompeii — both associated with volcanic destruction.','Discovered in 1980 at 2,600 m depth, they were among the first animals found thriving in conditions thought impossible for complex life.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Alvinella_pompejana'},{label:'MBARI',url:'https://www.mbari.org/'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/pompeii-worm'}] },
  'platyhelminthes': { altFacts:['Planarians can be cut into 279 pieces and each piece regenerates a complete worm — including a new brain, within 2 weeks.','Parasitic flatworms (flukes and tapeworms) infect over 1 billion people worldwide — the beef tapeworm can reach 25 m inside the human gut.','Flatworms are lophotrochozoans — more closely related to mollusks and annelids than to roundworms (nematodes), despite similar worm-like shapes.','The name means "flat worm" from Greek platys (flat) + helmins (worm). They were among the first bilaterally symmetric animals.','Flatworms have no circulatory or respiratory systems — oxygen diffuses directly through their thin bodies, limiting them to flat shapes.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Flatworm'},{label:'Tree of Life Web',url:'http://tolweb.org/Platyhelminthes'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/platyhelminthes/platyhelminthes.html'}] },
  'planarian': { altFacts:['If you cut a planarian\'s head in half lengthwise, it regenerates two heads — creating a permanently two-headed worm that remembers both personalities.','Planarians have stem cells (neoblasts) comprising 20% of their body — the highest stem cell proportion of any adult animal.','Planarians are free-living flatworms (Turbellaria), distantly related to the parasitic tapeworms and flukes that cause human disease.','Trained planarians that are decapitated retain learned behaviors after regrowing their heads — memories may be stored outside the brain.','The planarian eye has a simple cup shape with ~100 photoreceptors — the minimal structure needed for directional light sensing.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Planarian'},{label:'Stowers Institute',url:'https://www.stowers.org/research/planarian'},{label:'Nature',url:'https://www.nature.com/articles/nature12160'}] },
  'tardigrada': { altFacts:['Tardigrades survived 10 days in the vacuum of outer space — exposed to full solar UV radiation on the FOTON-M3 satellite in 2007.','In cryptobiosis, they replace water with trehalose glass, withstanding -272°C, +150°C, 6,000 atmospheres of pressure, and 1,000x lethal radiation.','Tardigrades are ecdysozoans — more closely related to arthropods and nematodes than to any other animal group.','The name means "slow stepper" from Latin tardus (slow) + gradus (step). Johann August Ephraim Goeze called them "kleiner Wasserbar" (little water bear) in 1773.','Over 1,300 species are known, found everywhere from Himalayan peaks to deep ocean trenches to Antarctic moss.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Tardigrade'},{label:'Smithsonian',url:'https://www.si.edu/stories/tardigrades'},{label:'Nature',url:'https://www.nature.com/articles/ncomms12808'}] },
  'tardigrade': { altFacts:['A tardigrade was revived after 30 years frozen at -20°C in Antarctic moss — and immediately laid viable eggs.','Tardigrades produce Dsup protein that shields DNA from radiation — when transferred to human cells, it reduces X-ray damage by 40%.','Tardigrades are micro-animals (0.1-1.5 mm) in their own phylum, more closely related to arthropods than to any worm.','Water bears were first described by Johann August Ephraim Goeze in 1773 — Lazzaro Spallanzani coined "tardigrada" (slow walker) in 1776.','Tardigrades have been found alive on every continent, from 6,000 m Himalayan altitude to 4,000 m ocean depth.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Tardigrade'},{label:'Tardigrada Newsletter',url:'https://www.tardigrada.net/'},{label:'Science',url:'https://www.science.org/doi/10.1126/science.aad1470'}] },
  'chordata': { altFacts:['Every vertebrate — fish, frog, bird, human — belongs to Chordata, but so do sea squirts, which look like blobs and eat their own brains during metamorphosis.','The defining notochord is a flexible rod replaced by the vertebral column in most chordates — in humans, remnants persist as the nucleus pulposus of spinal discs.','Chordates evolved from invertebrate deuterostomes — the transition from headless filter-feeders to vertebrates is one of evolution\'s greatest leaps.','The name comes from Latin chorda (string), referring to the notochord. Haeckel first used "Chordata" as a phylum name in 1874.','Of ~81,000 chordate species, the vast majority are ray-finned fish (~33,000) — mammals (6,400) are a small twig on the chordate tree.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Chordate'},{label:'Tree of Life Web',url:'http://tolweb.org/Chordata'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/chordata/chordata.html'}] },
  'sponges': { altFacts:['Sponges have no organs, no nervous system, and no muscles — yet they are animals, diverging from all other animal lineages over 600 million years ago.','A sponge pushed through a sieve will reassemble itself — individual cells crawl back together and rebuild the original structure.','Sponges (Porifera) are the sister group to all other animals — understanding them is key to understanding how animal multicellularity evolved.','The bath sponge industry dates to ancient Greece — Aristotle correctly identified sponges as animals in 350 BCE when others called them plants.','Sponges filter 20,000 liters of water per day — a reef sponge community filters the entire overlying water column every 24 hours.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Sponge'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/porifera/porifera.html'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/sponges'}] },
  'glass-sponge': { altFacts:['Glass sponge skeletons are made of silica spicules that transmit light like fiber optic cables — inspiring photonic engineering research.','Venus\' flower basket (Euplectella) houses a mated pair of shrimp that enter as larvae and grow too large to leave — a symbol of eternal love in Japan.','Glass sponges (Hexactinellida) diverged from other sponges over 540 million years ago — among the most ancient animal body plans still living.','The silica skeleton is mechanically superior to industrial glass fiber — assembled at ambient temperature and pressure, unlike manufactured glass.','Glass sponge reefs in British Columbia extend 19 km — thought extinct for 40 million years until discovered alive in 1987.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Glass_sponge'},{label:'DFO Canada',url:'https://www.dfo-mpo.gc.ca/species-especes/profiles-profils/glasssponge-epongesdeverre-eng.html'},{label:'Nature',url:'https://www.nature.com/articles/nature03000'}] },
  'barrel-sponge': { altFacts:['Giant barrel sponges can live over 2,000 years — potentially the oldest living animals, predating the Roman Empire.','A single barrel sponge filters 50,000 liters of seawater daily — extracting bacteria, viruses, and dissolved organic matter.','Barrel sponges are demosponges (Demospongiae), the largest sponge class, containing 90% of all sponge species.','Called "redwood of the reef" for their massive size (up to 1.8 m tall) and extreme longevity.','They host dense microbial communities — symbiotic bacteria make up 40% of the sponge\'s tissue volume, blurring the line between organism and ecosystem.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Xestospongia_muta'},{label:'Coral Reef Info',url:'https://www.coralreef.gov/'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/sponges'}] },
  'mollusks': { altFacts:['The geographic cone snail fires a venom-tipped harpoon at 645 km/h — containing 100+ toxins, several now developed into painkillers 1,000x stronger than morphine.','Giant clams can reach 200 kg and live 100+ years — the largest bivalves, powered partly by photosynthetic algae in their mantle tissue.','Mollusks are lophotrochozoans — more closely related to segmented worms than to arthropods, despite some species having shells like crabs.','The word "mollusk" comes from Latin mollis (soft). The group includes snails, clams, squid, octopuses, and chitons — wildly different body plans from one ancestor.','Nudibranchs (sea slugs) steal stinging cells from cnidarians they eat and deploy them in their own skin — biological weapons recycling.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Mollusca'},{label:'AMNH',url:'https://www.amnh.org/research/invertebrate-zoology/research/mollusca'},{label:'Conchologists of America',url:'https://conchologistsofamerica.org/'}] },
  'giant-clam': { altFacts:['Giant clams farm algae inside their own flesh — photosynthetic zooxanthellae in the mantle provide up to 70% of the clam\'s nutrition.','Tridacna gigas reaches 1.2 m and 200 kg — the largest living bivalve, cemented permanently in one spot for its 100+ year lifespan.','Giant clams are bivalve mollusks — sharing the class with mussels and oysters but having evolved symbiotic photosynthesis independently.','The "killer clam" reputation is a myth — no human death from giant clams has ever been verified. They close too slowly to trap a hand.','Giant clam shells refract and focus light onto their algal farms using iridocytes — biological solar concentrators studied for photovoltaic inspiration.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Tridacna_gigas'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/22137/9362283'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/giant-clams'}] },
  'cone-snail': { altFacts:['Cone snail venom contains 100-200 unique peptides per species — the pharmaceutical library of a single snail rivals some biotech companies.','They fire a hollow, barbed tooth like a hypodermic harpoon at prey — the strike takes 250 microseconds, among the fastest movements in nature.','Cone snails are gastropod mollusks — predatory snails that evolved venom independently from spiders, snakes, and scorpions.','Ziconotide (Prialt), derived from cone snail venom, is 1,000x more potent than morphine for chronic pain — approved by the FDA in 2004.','About 30 human deaths have been attributed to cone snails — the "cigarette snail" (C. geographus) is so named because you supposedly have time for one smoke before dying.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cone_snail'},{label:'Nature',url:'https://www.nature.com/articles/nature01652'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/cone-snails'}] },
  'portuguese-man-o-war': { altFacts:['The Portuguese man-o-war is not a jellyfish — it is a siphonophore, a colonial organism of 4 specialized polyp types functioning as one "animal."','Its tentacles extend up to 50 m — longer than a blue whale — and fire nematocysts that remain venomous even weeks after washing ashore.','As a siphonophore, it belongs to Hydrozoa within Cnidaria — more closely related to tiny hydroids than to true jellyfish (Scyphozoa).','Named by 18th-century sailors for resembling the Portuguese caravel warship — its gas-filled bladder acts as a sail, traveling by wind.','The blanket octopus is immune to man-o-war stings and rips off tentacles to wield as weapons — one of nature\'s most creative arms deals.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Portuguese_man_o%27_war'},{label:'NOAA',url:'https://oceanservice.noaa.gov/facts/portuguese-man-o-war.html'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/portuguese-man-of-war'}] },
  'hercules-beetle': { altFacts:['The Hercules beetle is the longest beetle at up to 17 cm — its horn comprises half its body length and can lift 850x its own body weight.','Males joust with horns, clamping opponents and flipping them off branches — winners mate with watching females.','Hercules beetles are scarab beetles (Dynastinae) — related to dung beetles and Japanese beetles within the family Scarabaeidae.','Named after the Greek demigod Heracles for its extraordinary strength. The species name "hercules" was given by Linnaeus in 1758.','Their elytra (wing covers) change color — turning from green to black when humidity rises, via microscopic structures that fill with water.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Dynastes_hercules'},{label:'Smithsonian',url:'https://www.si.edu/spotlight/buginfo/beetle'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/hercules-beetle.html'}] },
  'mosquito': { altFacts:['Mosquitoes have killed more humans than all wars combined — transmitting malaria, dengue, Zika, and yellow fever, causing ~700,000 deaths annually.','Only females bite — they need blood protein for egg production. Males drink nectar and are important pollinators.','Mosquitoes are true flies (Diptera, family Culicidae) — more closely related to midges and gnats than to other biting insects like fleas.','The word comes from Spanish/Portuguese "little fly" (mosca + diminutive -ito). There are 3,500+ species, but only ~100 bite humans.','Mosquitoes detect CO2 from 50 m away, body heat from 1 m, and prefer Type O blood — a suite of sensors rivaling military-grade detection.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Mosquito'},{label:'WHO',url:'https://www.who.int/news-room/fact-sheets/detail/vector-borne-diseases'},{label:'CDC',url:'https://www.cdc.gov/mosquitoes/'}] },
  'firefly': { altFacts:['Firefly light is the most efficient in nature — nearly 100% of energy becomes light (vs. 10% for incandescent bulbs), with zero heat.','Some Southeast Asian fireflies synchronize flashes across thousands of individuals — entire riverbanks pulse in unison, the mechanism still debated.','Fireflies are beetles (Coleoptera, family Lampyridae), not flies — more closely related to ladybugs than to any fly.','In Japanese, hotaru symbolizes souls of the dead. The "Grave of the Fireflies" film draws on this cultural connection.','Photinus females mimic the flash patterns of other species to lure males — then eat them. This is called "femmes fatales" signaling.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Firefly'},{label:'Xerces Society',url:'https://www.xerces.org/endangered-species/fireflies'},{label:'Smithsonian',url:'https://www.si.edu/stories/fireflies'}] },
  'praying-mantis': { altFacts:['The mantis is the only insect that can turn its head 180 degrees — scanning for prey with binocular 3D vision using miniature stereo depth perception.','Females sometimes eat males during mating — but this occurs in only 13-28% of encounters in the wild, far less than popularly believed.','Mantises are in order Mantodea — more closely related to cockroaches and termites than to any other insect group.','The name comes from Greek mantis (prophet/seer) — their prayer-like posture inspired both scientific and spiritual naming across cultures.','Mantises catch prey in 50-70 milliseconds — their raptorial forelegs strike faster than a human can blink (300 ms).'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Mantis'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/praying-mantis'},{label:'Smithsonian',url:'https://www.si.edu/spotlight/buginfo/mantid'}] },
  'cockroach': { altFacts:['Cockroaches have survived virtually unchanged for 300 million years — predating dinosaurs by 70 million years and outlasting them by 66 million.','A headless cockroach survives for weeks — it breathes through spiracles, has no blood pressure to lose, and dies only of thirst.','Cockroaches are Blattodea — termites are actually eusocial cockroaches, nested within the cockroach family tree.','The word comes from Spanish cucaracha. Only 30 of 4,600 species live near humans — the rest are forest-dwelling and ecologically important.','Cockroaches can withstand 10x more radiation than humans — their slow cell division gives DNA more time to repair between exposures.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cockroach'},{label:'Smithsonian',url:'https://www.si.edu/spotlight/buginfo/roach'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/cockroaches.html'}] },
  'golden-orb-spider': { altFacts:['Golden orb-weaver silk is 6x stronger than steel by weight and tougher than Kevlar — a pencil-thick strand could stop a Boeing 747 in flight.','Their webs span up to 2 m, last years, and glow gold in sunlight — the color attracts bees and deters birds who see the strands.','Golden orb-weavers are araneomorph spiders (Nephilidae), with the female 10x larger than the male — extreme sexual dimorphism.','In Madagascar, a textile made entirely from golden orb-weaver silk took 1.2 million spiders and 4 years — the only spider-silk fabric in existence.','Males are so small they often mate while the female eats — their diminutive size appears to be an evolutionary strategy to avoid detection.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Nephila'},{label:'Australian Museum',url:'https://australian.museum/learn/animals/spiders/golden-orb-weaving-spiders/'},{label:'Science',url:'https://www.science.org/doi/10.1126/science.1168960'}] },
  'emperor-scorpion': { altFacts:['Emperor scorpions glow bright cyan under UV light — the fluorescence is in the cuticle and persists in 400-million-year-old fossils, purpose unknown.','Despite their intimidating 20 cm size, their venom is mild — roughly equivalent to a bee sting, making them the most popular pet scorpion.','Scorpions are arachnids — more closely related to spiders and ticks than to insects, sharing 8 legs and chelicerae.','Scorpions predate all other arachnids — appearing in the Silurian (435 Mya), originally as aquatic animals that later colonized land.','Mother emperor scorpions carry 30+ babies on their backs for weeks — one of few invertebrates with extended parental care.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Pandinus_imperator'},{label:'Smithsonian Zoo',url:'https://nationalzoo.si.edu/animals/emperor-scorpion'},{label:'CITES',url:'https://cites.org/eng/gallery/species/invertebrate/emperor_scorpion.html'}] },
  'lobster': { altFacts:['Lobsters show no measurable signs of aging — they grow stronger, more fertile, and larger with age. The largest recorded was 20 kg and estimated at 100+ years.','They taste with their feet, chew with their stomach (a "gastric mill" of 3 grinding teeth), and urinate from their face to communicate.','Lobsters are decapod crustaceans — more closely related to crabs and shrimp than to any insect, despite all being arthropods.','Lobster was once so abundant in colonial America it was fed to prisoners and servants — considered a poverty food until the 1880s railroad era.','Lobster blood is blue — it uses copper-based hemocyanin instead of iron-based hemoglobin, more efficient for oxygen transport in cold water.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Lobster'},{label:'NOAA Fisheries',url:'https://www.fisheries.noaa.gov/species/american-lobster'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/lobsters'}] },
  'japanese-spider-crab': { altFacts:['The Japanese spider crab has the longest leg span of any arthropod — up to 3.7 m from claw tip to claw tip, wider than a car.','They live at 150-800 m depth and can live 100+ years — molting becomes increasingly dangerous with size as the soft body is vulnerable.','Spider crabs are decapod crustaceans (Majoidea) — "true crabs" more closely related to swimming crabs than to king crabs (which are actually hermit crabs).','In Japanese: takaashigani (tall-legged crab). They are considered a delicacy, though deep-sea harvesting limits commercial fishing.','During molting, they gather in stacking piles of hundreds — vulnerable crabs shelter beneath newly-hardened individuals for protection.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Japanese_spider_crab'},{label:'Monterey Bay Aquarium',url:'https://www.montereybayaquarium.org/animals/animals-a-to-z/japanese-spider-crab'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/japanese-spider-crab.html'}] },
  'stick-insect': { altFacts:['Chan\'s megastick (Phobaeticus chani) is the longest insect at 56.7 cm — discovered in 2008 in Borneo, only 6 specimens are known.','Stick insects reproduce via parthenogenesis — some species have no known males, with females cloning themselves for millions of years.','Stick insects (Phasmatodea) are related to mantises and cockroaches — they diverged from other polyneopteran insects ~300 million years ago.','The order name Phasmatodea comes from Greek phasma (phantom/apparition) — referring to their ghostly ability to vanish among foliage.','Their eggs mimic seeds so precisely that ants carry them underground — the ants eat an edible appendage (capitulum) and discard the egg safely buried.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Phasmatodea'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/stick-insects.html'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/stick-insects'}] },
  'bumblebee': { altFacts:['By the laws of fixed-wing aerodynamics, bumblebees "shouldn\'t" fly — their wings create vortices like helicopter blades, generating 2-3x more lift than predicted.','Bumblebees can learn to pull strings and roll balls for rewards — passing the knowledge to hive-mates through observation, a form of insect culture.','Bumblebees (Bombus) are in family Apidae with honeybees — but diverged ~87 million years ago and evolved eusociality independently.','The word "bumble" comes from Middle English bomblen (to buzz). They can buzz-pollinate (sonicate) flowers by vibrating at 400 Hz — honeybees cannot.','Bumblebee queens hibernate alone underground for 6-9 months, then found an entire colony single-handedly in spring.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Bumblebee'},{label:'Bumblebee Conservation Trust',url:'https://www.bumblebeeconservation.org/'},{label:'Xerces Society',url:'https://www.xerces.org/bumblebees'}] },
  'termite': { altFacts:['Termite mounds in Africa maintain a constant 30°C with 1°C variation — their ventilation shafts inspired the Eastgate Centre building in Zimbabwe.','A single colony can number 3 million individuals with a queen that lives 50 years — the longest-lived insect, laying 30,000 eggs per day.','Termites are eusocial cockroaches — molecular phylogenetics proved they nest within Blattodea, not a separate order.','The word comes from Latin termes (woodworm). In many African and Australian cultures, termite mounds are sacred sites associated with creation myths.','Termites produce 1-3% of global atmospheric methane — their gut bacteria ferment cellulose, making them second only to wetlands as a natural methane source.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Termite'},{label:'Smithsonian',url:'https://www.si.edu/spotlight/buginfo/termite'},{label:'Nature',url:'https://www.nature.com/articles/nature14589'}] },
  'cicada': { altFacts:['Periodical cicadas spend 13 or 17 years underground (both prime numbers) — emerging en masse to overwhelm predators through sheer abundance.','Male cicadas are the loudest insects at 120 dB — louder than a chainsaw, produced by vibrating tymbals 300-400x per second.','Cicadas are hemipterans (true bugs) — more closely related to aphids and leafhoppers than to beetles or flies.','In ancient Greece, cicadas symbolized immortality and resurrection. Socrates called them blessed creatures who sing without needing food.','Cicada wings are self-cleaning and bactericidal — nanopillar structures physically rupture bacterial cell membranes on contact.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cicada'},{label:'Cicada Mania',url:'https://www.cicadamania.com/'},{label:'Smithsonian',url:'https://www.si.edu/stories/periodical-cicadas'}] },
  'dung-beetle': { altFacts:['Dung beetles navigate at night using the Milky Way — the first animal proven to orient by the galactic light band, earning an Ig Nobel Prize in 2013.','The horned dung beetle (Onthophagus taurus) pulls 1,141x its body weight — the strongest animal relative to size.','Dung beetles are scarab beetles (Scarabaeidae) — in the same family as Hercules beetles and June bugs.','Ancient Egyptians worshipped the scarab (Khepri) as the god of sunrise — the beetle rolling dung mirrored the sun rolling across the sky.','By burying dung, they recycle nutrients, aerate soil, and reduce livestock parasites — saving the US cattle industry an estimated $380 million annually.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Dung_beetle'},{label:'Current Biology',url:'https://www.cell.com/current-biology/fulltext/S0960-9822(12)01507-1'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/dung-beetle'}] },
  'crown-of-thorns': { altFacts:['A single crown-of-thorns starfish eats up to 10 m2 of coral per year — outbreaks on the Great Barrier Reef have destroyed more coral than cyclones or bleaching.','They have up to 23 arms covered in venomous spines that cause intense pain for hours — one of the few dangerously venomous echinoderms.','Crown-of-thorns are asteroid echinoderms — deuterostomes more closely related to humans than to any insect or crustacean.','Named Acanthaster planci — "thorny star" in Greek/Latin. Called onihitode ("demon starfish") in Japanese.','Giant triton snails are their main predator — a single triton eats one crown-of-thorns per week, making triton conservation crucial for reef health.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Crown-of-thorns_starfish'},{label:'AIMS',url:'https://www.aims.gov.au/research-topics/crown-thorns-starfish'},{label:'Great Barrier Reef Foundation',url:'https://www.barrierreef.org/the-reef/threats/crown-of-thorns-starfish'}] },
  'earthworm': { altFacts:['Earthworms have been called "ecosystem engineers" — a single acre can contain 1 million worms processing 10-18 tonnes of soil per year.','They move by coordinating circular and longitudinal muscles in peristaltic waves — each segment contracts independently via its own nerve ganglion.','Earthworms are oligochaete annelids — more closely related to leeches than to roundworms or flatworms.','Darwin\'s final book "The Formation of Vegetable Mould Through the Action of Worms" (1881) was his best-seller during his lifetime.','Earthworms are hermaphrodites — each individual has both male and female organs, but they still mate with partners in mutual sperm exchange.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Earthworm'},{label:'Soil Biology',url:'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-biology'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/earthworms.html'}] },
  'giant-tube-worm': { altFacts:['Giant tube worms have no mouth, gut, or anus — they are entirely sustained by billions of chemosynthetic bacteria packed inside a specialized organ (trophosome).','They grow up to 2.4 m at hydrothermal vents, reaching full size in just 2 years — among the fastest growth rates in the deep sea.','Tube worms are polychaete annelids (Siboglinidae) — relatives of the common earthworm that adapted to one of Earth\'s most extreme environments.','Discovered in 1977 at the Galapagos Rift — their existence was so unexpected that the expedition initially had no biologist on board.','They thrive at 2,500 m depth where 400°C vent fluid meets 2°C seawater — their hemoglobin binds both oxygen and hydrogen sulfide simultaneously.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Riftia_pachyptila'},{label:'MBARI',url:'https://www.mbari.org/'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/giant-tube-worms'}] },
  'leaf-insect': { altFacts:['Leaf insects mimic leaves so precisely that their bodies have fake veins, bite marks, and brown spots simulating decay — predators walk right past them.','They sway gently when walking, mimicking a leaf in the breeze — one of the most sophisticated behavioral camouflage strategies in nature.','Leaf insects (Phylliidae) are phasmids — closely related to stick insects, both masters of plant mimicry within Phasmatodea.','The genus Phyllium means "leaf" in Greek. The first species described (1798) was initially placed in the genus Mantis by mistake.','Females drop eggs that mimic seeds — some have a capitulum (fatty knob) that tricks ants into carrying them underground for safe incubation.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Phylliidae'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/leaf-insects.html'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/leaf-insects'}] },
  'leech': { altFacts:['Leech saliva contains hirudin (anticoagulant), hyaluronidase (tissue spreader), and an anesthetic — you often do not feel the bite until you see the blood.','A leech can consume 5-15 ml of blood (5-10x its body weight) in a single feeding, then survive 6-12 months without eating again.','Leeches are clitellate annelids — a specialized subgroup of segmented worms, closer to earthworms than to flatworms or nematodes.','The word "leech" comes from Old English laece (physician) — the same root as "leechcraft" for medicine. Doctors were once called leeches.','Aquatic leeches swim with elegant undulating motions — on land they move by looping (inchworm gait) using anterior and posterior suckers.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Leech'},{label:'Smithsonian',url:'https://www.si.edu/stories/medicinal-leeches'},{label:'Biopharm Leeches',url:'https://www.biopharm-leeches.com/'}] },
  'feather-star': { altFacts:['Feather stars can detach from surfaces and swim through open water — rowing with 20-200 feathered arms in an eerily graceful underwater ballet.','They are the only free-moving crinoids — unlike sea lilies, they shed their stalks as juveniles and roam the reef as adults.','Feather stars are crinoid echinoderms — the most ancient living echinoderm body plan, dating to the Ordovician (480 Mya).','Their arms are covered in sticky tube feet that trap plankton — food is passed along grooves to a mouth on the top surface.','When a predator grabs an arm, feather stars autotomize (shed) it and regrow a replacement — some shed all arms and regenerate from the disc.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Crinoid'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/invertebrates/crinoids'},{label:'Australian Museum',url:'https://australian.museum/learn/animals/sea-stars/feather-stars/'}] },
  'nematodes': { altFacts:['If every non-nematode animal on Earth vanished, nematodes would still outline every ecosystem — soil, ocean, plant, and animal — as ghostly worm shapes.','Four out of five individual animals on Earth are nematodes — an estimated 57 billion per human, totaling ~80 billion billion individuals.','Nematodes are ecdysozoans — they molt their cuticle, placing them closer to arthropods and tardigrades than to earthworms or flatworms.','The name comes from Greek nema (thread). Nathan Cobb wrote in 1915 that nematodes would "still dimly reveal" every landscape if all else disappeared.','Nematode parasites infect 1.5 billion people worldwide — hookworms, roundworms, and filarial worms remain among the most neglected tropical diseases.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Nematode'},{label:'Tree of Life Web',url:'http://tolweb.org/Nematoda'},{label:'WHO',url:'https://www.who.int/health-topics/soil-transmitted-helminthiases'}] },
  'c-elegans': { altFacts:['C. elegans is the only animal with a completely mapped connectome — all 302 neurons and 7,000 synapses, charted in a 1986 effort that won a Nobel Prize.','It was the first multicellular organism to have its genome fully sequenced (1998) — 20,444 genes in 100 million base pairs.','C. elegans is a free-living nematode — unlike its parasitic relatives, it eats bacteria in rotting fruit and compost.','Sydney Brenner chose C. elegans in 1963 specifically because it is transparent, has exactly 959 cells, and lives only 2-3 weeks — the perfect model organism.','Every cell division in C. elegans development is mapped — 131 cells are programmed to die (apoptosis), a discovery that won the 2002 Nobel Prize in Medicine.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Caenorhabditis_elegans'},{label:'WormBase',url:'https://wormbase.org/'},{label:'Nobel Prize',url:'https://www.nobelprize.org/prizes/medicine/2002/summary/'}] },
  'garden-spider': { altFacts:['Garden spiders rebuild their entire web every single day — consuming the old silk to recycle proteins, then spinning a geometrically perfect orb in under an hour.','Spider silk is stronger than steel by weight and more elastic than nylon — a web strand 1 cm thick could theoretically stop a Boeing 747 in flight.','Spiders are arachnids, not insects — they have 8 legs, no antennae, and no wings. Arachnids diverged from insects over 400 million years ago.','The genus Araneus comes from Latin aranea (spider). In Greek mythology, Arachne was a weaver who challenged Athena and was turned into the first spider.','The stabilimentum — the zig-zag pattern some garden spiders weave into their web — may attract pollinating insects, warn birds to avoid the web, or help camouflage the spider.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Araneus_diadematus'},{label:'Natural History Museum',url:'https://www.nhm.ac.uk/discover/garden-spiders.html'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/garden-spider'}] },
  // ── Bacteria ──────────────────────────────────────────────────────
  'prochlorococcus': { altFacts:['Prochlorococcus is the smallest and most abundant photosynthetic organism on Earth — roughly 3 billion billion billion cells produce ~5% of global oxygen.','At just 0.5–0.7 micrometers wide, it has the smallest genome of any free-living phototroph — only ~1,700 genes, stripped to the essentials.','Prochlorococcus is a cyanobacterium, placing it in one of Earth\'s oldest lineages — yet it was not discovered until 1986 by Penny Chisholm using flow cytometry.','Different ecotypes specialize at different ocean depths — high-light strains dominate the sunlit surface while low-light strains thrive at 200 m.','If Prochlorococcus vanished overnight, atmospheric oxygen would begin to decline measurably within years.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Prochlorococcus'},{label:'MIT Chisholm Lab',url:'https://chisholmlab.mit.edu/'},{label:'Nature Review',url:'https://www.nature.com/articles/nrmicro3378'}] },
  'nostoc': { altFacts:['Nostoc forms jelly-like colonies visible to the naked eye — green blobs in wet soil once called "star jelly" and thought to fall from the sky.','It is one of few organisms that both photosynthesize and fix atmospheric nitrogen — performing both tasks by segregating them into specialized cells called heterocysts.','Nostoc is a cyanobacterium, part of the lineage that oxygenated Earth\'s atmosphere 2.4 billion years ago during the Great Oxidation Event.','The name "Nostoc" was coined by Paracelsus in the 16th century, possibly from the Old English nosthryl (nostril) for its mucilaginous texture.','Nostoc has been eaten in China for 2,000 years (fat choy) and in parts of South America, valued as a nitrogen-rich food supplement.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Nostoc'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'Algaebase',url:'https://www.algaebase.org/'}] },
  'proteobacteria': { altFacts:['Proteobacteria is the single most metabolically diverse bacterial phylum — members photosynthesize, fix nitrogen, cause plague, and generate electricity.','The mitochondria inside every eukaryotic cell descended from an ancient alphaproteobacterium — making Proteobacteria ancestors of all complex life\'s power supply.','Proteobacteria are Gram-negative bacteria named after Proteus, the shape-shifting Greek god, reflecting their extraordinary morphological diversity.','E. coli, Salmonella, Vibrio, Helicobacter, and Rhizobium are all proteobacteria — spanning essential symbionts to deadly pathogens.','They dominate the human gut microbiome in infancy and in dysbiosis — a bloom of Proteobacteria is now considered a microbial signature of disease.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Proteobacteria'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'NCBI Taxonomy',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1224'}] },
  'vibrio-cholerae': { altFacts:['Vibrio cholerae causes cholera, a disease that can kill within hours through massive fluid loss — up to 20 liters of diarrhea per day.','John Snow traced the 1854 London cholera outbreak to the Broad Street pump, founding modern epidemiology — decades before germ theory was accepted.','V. cholerae is a gammaproteobacterium, in the same phylum as E. coli but in a different order — both are Gram-negative rods.','The name Vibrio means "to vibrate" in Latin, describing the bacterium\'s curved, comma-shaped cell that swims with a single polar flagellum.','V. cholerae lives naturally in warm coastal waters attached to copepod shells — climate change is expanding its range into previously unaffected regions.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Vibrio_cholerae'},{label:'WHO Cholera',url:'https://www.who.int/news-room/fact-sheets/detail/cholera'},{label:'CDC',url:'https://www.cdc.gov/cholera/index.html'}] },
  'firmicutes': { altFacts:['Firmicutes and Bacteroidetes together make up ~90% of the adult human gut microbiome — their ratio is linked to obesity, diet, and metabolic health.','Many Firmicutes form endospores that survive boiling, radiation, and centuries of dormancy — Clostridium and Bacillus spores have been revived after thousands of years.','Firmicutes are Gram-positive bacteria with a thick peptidoglycan cell wall — the name means "strong skin" in Latin.','Lactobacillus (yogurt), Clostridium (botulism), Staphylococcus (staph infections), and Bacillus (anthrax) are all Firmicutes — spanning beneficial to deadly.','A higher Firmicutes-to-Bacteroidetes ratio in the gut correlates with increased caloric extraction from food — obese individuals consistently show this pattern.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Firmicutes'},{label:'NCBI Taxonomy',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=1239'},{label:'Nature Reviews Microbiology',url:'https://www.nature.com/nrmicro/'}] },
  'lactobacillus': { altFacts:['Lactobacillus has been humanity\'s invisible partner for millennia — it ferments yogurt, cheese, sauerkraut, kimchi, and sourdough bread.','It produces lactic acid that drops pH below 4.5, inhibiting pathogenic bacteria — a natural preservation method older than refrigeration.','Lactobacillus is a Firmicute in the order Lactobacillales — Gram-positive, rod-shaped, and one of the first bacteria cultured in a lab (1901).','The name means "little milk rod" in Latin — lacto (milk) + bacillus (small rod), describing both its shape and its habitat.','Vaginal Lactobacillus populations protect against infection by maintaining acidic pH — disruption of this community is linked to bacterial vaginosis.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Lactobacillus'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'NIH Probiotics',url:'https://www.nccih.nih.gov/health/probiotics-what-you-need-to-know'}] },
  'clostridium-botulinum': { altFacts:['Botulinum toxin is the most potent biological substance known — one gram could theoretically kill 1 million people, yet it is used cosmetically as Botox.','C. botulinum spores survive boiling for hours — improper home canning is the most common source of botulism outbreaks.','C. botulinum is a Firmicute, closely related to C. tetani (tetanus) and C. difficile — all spore-forming, anaerobic Gram-positive rods.','The name comes from Latin botulus (sausage) — the first recognized outbreak in 1793 was traced to contaminated German blood sausage.','Medical Botox blocks acetylcholine release at neuromuscular junctions — the same paralytic mechanism that makes the toxin lethal is harnessed at tiny doses for wrinkles, migraines, and muscle spasms.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Clostridium_botulinum'},{label:'CDC Botulism',url:'https://www.cdc.gov/botulism/index.html'},{label:'WHO',url:'https://www.who.int/news-room/fact-sheets/detail/botulism'}] },
  'deinococcus': { altFacts:['Deinococcus radiodurans survives 5,000 Gy of ionizing radiation — 1,000 times the lethal dose for a human — earning it the nickname "Conan the Bacterium."','It repairs shattered DNA within hours — its genome is blasted into hundreds of fragments by radiation, yet specialized repair enzymes piece it back together perfectly.','Deinococcus belongs to its own deep-branching phylum (Deinococcota), distantly related to Thermus — both extremophiles.','The name means "terrible berry" in Greek — deinon (terrible) + kokkos (berry) — describing its clustered, radiation-resistant cells.','Scientists have engineered Deinococcus to break down radioactive waste — its radiation tolerance makes it ideal for bioremediation at nuclear sites.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Deinococcus_radiodurans'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'Nature',url:'https://www.nature.com/articles/nrmicro1991'}] },
  'bacteroides': { altFacts:['Bacteroides species make up ~25% of the human colon microbiome by cell count — they are the dominant bacteria processing complex plant polysaccharides we cannot digest.','They produce short-chain fatty acids (propionate, acetate) that feed colon cells and regulate immune function — essential metabolites derived from fiber.','Bacteroides are Gram-negative, obligately anaerobic bacteria in the phylum Bacteroidota — phylogenetically distant from Firmicutes despite sharing the gut habitat.','The name means "rod-like" in Greek (bakterion + eidos) — among the first anaerobes described, by Veillon and Zuber in 1898.','When Bacteroides escape the gut through injury, they cause severe abscesses — they are the most commonly isolated anaerobic pathogen in clinical infections.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Bacteroides'},{label:'Human Microbiome Project',url:'https://hmpdacc.org/'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=816'}] },
  'spirochetes': { altFacts:['Spirochetes include the agents of syphilis (Treponema pallidum), Lyme disease (Borrelia burgdorferi), and leptospirosis — all using a unique corkscrew motility.','Their flagella are hidden inside the cell — sandwiched between inner and outer membranes — spinning the entire cell like a drill to bore through viscous tissue.','Spirochetes are a distinct bacterial phylum (Spirochaetota), not closely related to other Gram-negative bacteria despite sharing a double membrane.','The name means "coiled hair" in Greek — speira (coil) + khaite (hair), perfectly describing their helical shape.','Termite guts harbor spirochetes that fix nitrogen and break down cellulose — a symbiosis crucial to wood digestion.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Spirochaete'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'CDC Lyme Disease',url:'https://www.cdc.gov/lyme/index.html'}] },
  'thermus-aquaticus': { altFacts:['Thermus aquaticus gave us Taq polymerase — the heat-stable enzyme that makes PCR possible, revolutionizing genetics, forensics, and COVID testing.','It thrives at 70–80°C in hot springs, where most proteins would denature — its enzymes are engineered by evolution to fold stably at near-boiling temperatures.','Thermus is in the phylum Deinococcota, closely related to the radiation-resistant Deinococcus — both are ancient extremophile lineages.','Discovered in 1969 by Thomas Brock at Yellowstone\'s Great Fountain hot spring — a finding that transformed molecular biology within two decades.','The 1993 Nobel Prize in Chemistry honored Kary Mullis for PCR — a technique entirely dependent on Thermus aquaticus Taq polymerase.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Thermus_aquaticus'},{label:'Yellowstone NPS',url:'https://www.nps.gov/yell/learn/nature/thermophilic-bacteria.htm'},{label:'Nobel Prize 1993',url:'https://www.nobelprize.org/prizes/chemistry/1993/summary/'}] },
  'borrelia': { altFacts:['Borrelia burgdorferi causes Lyme disease — the most common vector-borne illness in the Northern Hemisphere, transmitted by Ixodes tick bites.','Borrelia evades the immune system by rapidly switching its surface proteins through a process called antigenic variation — a molecular shell game.','Borrelia are spirochetes — corkscrew-shaped bacteria that swim through tissue using internal flagella, unrelated to most other pathogens.','Named after French biologist Amédée Borrel. "Lyme disease" was named after Lyme, Connecticut, where a cluster of juvenile arthritis cases was investigated in 1975.','The characteristic bull\'s-eye rash (erythema migrans) appears in ~70% of Lyme cases — but its absence does not rule out infection.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Borrelia'},{label:'CDC Lyme Disease',url:'https://www.cdc.gov/lyme/'},{label:'ILADS',url:'https://www.ilads.org/'}] },
  'treponema': { altFacts:['Treponema pallidum causes syphilis — a disease that shaped history, possibly killing Henry VIII, Beethoven, and Al Capone.','T. pallidum cannot be cultured in a laboratory dish — it is an obligate human parasite that has never been grown outside living tissue.','Treponema is a spirochete, sharing the phylum with Borrelia (Lyme disease) — both use internal flagella to drill through tissue.','The name means "turning thread" in Greek — trepo (to turn) + nema (thread), describing its tightly wound helical shape.','The Tuskegee syphilis study (1932–1972), in which treatment was withheld from Black men, became a landmark case in medical ethics reform.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Treponema_pallidum'},{label:'WHO Syphilis',url:'https://www.who.int/news-room/fact-sheets/detail/syphilis'},{label:'CDC STI',url:'https://www.cdc.gov/std/syphilis/'}] },
  'rhizobium': { altFacts:['Rhizobium bacteria fix atmospheric nitrogen inside root nodules of legumes — converting N₂ gas into ammonia, fertilizing the soil without synthetic chemicals.','This symbiosis provides ~65% of all biologically fixed nitrogen on Earth — equivalent to billions of dollars of fertilizer annually.','Rhizobium is an alphaproteobacterium, in the same class as the ancestor of mitochondria — both established endosymbioses inside eukaryotic cells.','The name means "root life" in Greek — rhiza (root) + bios (life), describing its intimate partnership with plant roots.','Legume crops like soybeans, clover, and alfalfa are rotated with cereals specifically because Rhizobium enriches the soil with nitrogen for the next crop.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Rhizobium'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'Nature Education',url:'https://www.nature.com/scitable/topicpage/biological-nitrogen-fixation-6587416/'}] },
  'wolbachia': { altFacts:['Wolbachia infects an estimated 40–60% of all insect species on Earth — it is arguably the most successful parasite in the history of life.','It manipulates host reproduction through cytoplasmic incompatibility, feminization, and male-killing — ensuring its own maternal transmission.','Wolbachia is an alphaproteobacterium, related to Rickettsia — both are obligate intracellular parasites that evolved from free-living ancestors.','Named after Simeon Burt Wolbach who first described it in 1924 in mosquito ovaries — its global significance was not understood until the 1990s.','Releasing Wolbachia-infected mosquitoes dramatically reduces dengue transmission — a strategy now deployed in over a dozen countries.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Wolbachia'},{label:'World Mosquito Program',url:'https://www.worldmosquitoprogram.org/'},{label:'Nature Reviews',url:'https://www.nature.com/articles/nrmicro1969'}] },
  'staphylococcus': { altFacts:['Staphylococcus aureus lives harmlessly on the skin of ~30% of healthy humans — but when it enters wounds or the bloodstream, it causes life-threatening infections.','MRSA (methicillin-resistant S. aureus) is one of the most urgent antibiotic resistance threats — killing more Americans annually than HIV/AIDS.','Staphylococcus is a Firmicute, in the same phylum as Lactobacillus and Clostridium — Gram-positive cocci that divide in grape-like clusters.','The name means "grape berry" in Greek — staphyle (bunch of grapes) + kokkos (berry), describing its microscopic appearance.','S. aureus produces a golden pigment (staphyloxanthin) that acts as an antioxidant shield against immune cell attacks — the aureus means "golden."'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Staphylococcus_aureus'},{label:'CDC MRSA',url:'https://www.cdc.gov/mrsa/'},{label:'WHO AMR',url:'https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance'}] },
  'spirulina': { altFacts:['Spirulina contains up to 70% protein by dry weight — more than any other natural food — and has been eaten by humans for centuries in Chad and Mexico.','NASA studied Spirulina as a candidate food for long-duration space missions — its nutritional density and rapid growth make it ideal for closed-loop life support.','Spirulina is a cyanobacterium (genus Arthrospira), not a plant or alga — it is among the oldest photosynthetic lineages on Earth.','The name comes from Latin spira (coil), describing its helical filament shape. Aztecs harvested it from Lake Texcoco as tecuitlatl (stone excrement).','A single hectare of Spirulina production yields 20 times more protein per year than soybeans grown on the same area.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Spirulina_(dietary_supplement)'},{label:'NASA Technical Reports',url:'https://ntrs.nasa.gov/'},{label:'FAO Spirulina',url:'https://www.fao.org/documents/card/en/c/81ac13ee-5d0e-5b4a-b280-2df0fc69b64c/'}] },
  'campylobacter': { altFacts:['Campylobacter is the most common bacterial cause of food poisoning worldwide — infecting ~1% of the population of Western countries every year.','It needs only 500 cells to cause infection — one of the lowest infectious doses of any foodborne pathogen.','Campylobacter is an epsilonproteobacterium with a distinctive spiral shape and corkscrew motility — unrelated to Salmonella despite causing similar symptoms.','The name means "curved rod" in Greek — kampylos (curved) + bacter (rod), perfectly describing its comma or S-shaped morphology.','Guillain-Barré syndrome, a serious autoimmune paralysis, is most commonly triggered by prior Campylobacter infection — molecular mimicry between bacterial and nerve surface sugars.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Campylobacter'},{label:'CDC Campylobacter',url:'https://www.cdc.gov/campylobacter/'},{label:'WHO',url:'https://www.who.int/news-room/fact-sheets/detail/campylobacter'}] },
  'aliivibrio': { altFacts:['Aliivibrio fischeri is the textbook model for bacterial bioluminescence — it glows blue-green through a luciferase enzyme system studied for over a century.','It colonizes the light organ of the Hawaiian bobtail squid, producing counter-illumination camouflage that erases the squid\'s shadow from below.','Aliivibrio is a gammaproteobacterium in the family Vibrionaceae — closely related to Vibrio cholerae but harmless and luminescent.','Quorum sensing was discovered in A. fischeri — bacteria "count" their population density via signaling molecules (autoinducers) and switch on light production only when crowded enough.','The squid expels 95% of its Aliivibrio each dawn and re-grows the population from the remaining 5% by nightfall — a daily cycle of symbiont management.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Aliivibrio_fischeri'},{label:'MicrobeWiki',url:'https://microbewiki.kenyon.edu/index.php/Vibrio_fischeri'},{label:'Nature Education',url:'https://www.nature.com/scitable/topicpage/quorum-sensing-14459893/'}] },
  // ── Archaea ───────────────────────────────────────────────────────
  'methanobacterium': { altFacts:['Methanobacterium produces methane as a metabolic byproduct — it is one of the key methanogens driving biogas production in landfills, wetlands, and cow stomachs.','It thrives without oxygen and uses hydrogen and CO₂ to generate energy — a metabolism thought to resemble some of the earliest life on Earth.','Methanobacterium is a euryarchaeon in the order Methanobacteriales — an archaeon, not a bacterium, despite the misleading name.','The name means "methane rod" — methano (methane) + bacterium (rod), assigned before archaea were recognized as a separate domain.','Methanobacterium-like organisms are prime candidates for life on Mars or Enceladus — any world with hydrogen and CO₂ could support this metabolism.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Methanobacterium'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'NASA Astrobiology',url:'https://astrobiology.nasa.gov/'}] },
  'halococcus': { altFacts:['Halococcus thrives in salt concentrations that would kill virtually any other cell — up to 5 M NaCl, ten times saltier than the ocean.','Halococcus cells have been revived from 250-million-year-old salt crystals — among the oldest viable organisms ever recovered, though the claim remains debated.','Halococcus is a euryarchaeon in the class Halobacteria — an archaeon that uses carotenoid pigments to turn salt lakes pink and red.','The name means "salt berry" — halo (salt) + kokkos (berry), describing its coccoid shape and extreme halophilic lifestyle.','Its cell wall lacks peptidoglycan (unlike bacteria) and instead uses a sulfated heteropolysaccharide — a fundamentally different architecture.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Halococcus'},{label:'Extremophiles Journal',url:'https://link.springer.com/journal/792'},{label:'NCBI Taxonomy',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=2235'}] },
  'methanosarcina': { altFacts:['Methanosarcina is the most metabolically versatile methanogen — it can produce methane from hydrogen, acetate, or methanol, giving it a competitive edge in diverse environments.','A massive bloom of Methanosarcina may have triggered the Permian extinction 252 Mya — horizontal gene transfer of an acetoclastic pathway allowed explosive methane production.','Methanosarcina is a euryarchaeon — one of the few methanogens that forms multicellular packets resembling tiny grapes.','The name means "methane flesh" — methano (methane) + sarcina (bundle of flesh), describing its clustered cell arrangement.','It thrives in anaerobic digesters that convert organic waste to biogas — Methanosarcina is the workhorse of renewable methane energy production.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Methanosarcina'},{label:'MIT News (Permian)',url:'https://news.mit.edu/2014/ancient-whodunit-may-be-solved-microbes-did-it-0331'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=2207'}] },
  'sulfolobus': { altFacts:['Sulfolobus thrives at 75–80°C and pH 2–3 — the equivalent of living in boiling battery acid, one of the most extreme environments colonized by any organism.','It was the first archaeon shown to have a CRISPR system — the adaptive immune defense that bacteria and archaea use to fight viruses, later repurposed for gene editing.','Sulfolobus is a crenarchaeon in the order Sulfolobales — distantly related to euryarchaea like methanogens.','The name means "sulfur lobe" — from its lobed cell shape and dependence on sulfur metabolism in volcanic hot springs.','Sulfolobus uses sulfur as an electron acceptor instead of oxygen — oxidizing it to sulfuric acid, which further acidifies its volcanic pool habitat.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Sulfolobus'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'Nature CRISPR',url:'https://www.nature.com/articles/nrmicro2577'}] },
  'pyrolobus': { altFacts:['Pyrolobus fumarii holds the record for the highest growth temperature — it reproduces at 113°C and cannot grow below 90°C, treating boiling water as uncomfortably cold.','It was discovered in 1997 at a Mid-Atlantic Ridge hydrothermal vent — "black smoker" chimneys where superheated water reaches 400°C.','Pyrolobus is a crenarchaeon, closely related to Sulfolobus and other thermophilic archaea that dominated early Earth.','The name means "fire lobe" — pyro (fire) + lobus (lobe), with fumarii meaning "of the chimney," referring to its smoker vent habitat.','Its proteins are so heat-stable they can be autoclaved (121°C for 1 hour) without denaturing — making Pyrolobus enzymes of interest for industrial biotechnology.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Pyrolobus_fumarii'},{label:'Extremophiles Journal',url:'https://link.springer.com/journal/792'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=56636'}] },
  'lokiarchaeota': { altFacts:['Lokiarchaeota is the closest known prokaryotic relative of all eukaryotes — its genome contains genes for cytoskeleton-like proteins previously thought unique to complex cells.','It was discovered in deep-sea sediments near Loki\'s Castle hydrothermal vent field in the Arctic Ocean, 2,352 m below the surface.','Lokiarchaeota belongs to the Asgard archaea superphylum — a group that has reshaped our understanding of how eukaryotic cells evolved from archaea.','Named after Loki, the Norse trickster god, because it blurs the boundary between prokaryotes and eukaryotes — a trickster in the tree of life.','In 2020, Japanese researchers cultured a Lokiarchaeota-related organism for the first time — it took 12 years and grows excruciatingly slowly.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Lokiarchaeota'},{label:'Nature (2015)',url:'https://www.nature.com/articles/nature14447'},{label:'Nature (2020 culture)',url:'https://www.nature.com/articles/s41586-019-1916-6'}] },
  'thermococcus': { altFacts:['Thermococcus grows optimally at 85°C near deep-sea hydrothermal vents — it is a fast-growing hyperthermophile used as a model organism for archaeal research.','Its DNA polymerase is used in high-fidelity PCR — proofreading errors 10× better than Taq, making it essential for precision molecular biology.','Thermococcus is a euryarchaeon in the order Thermococcales — closely related to Pyrococcus, another model hyperthermophile.','The name means "heat berry" — thermo (heat) + kokkos (berry), describing its coccoid cells thriving at near-boiling temperatures.','Thermococcus produces hydrogen gas as a metabolic byproduct — making it a candidate for biological hydrogen fuel production.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Thermococcus'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=2263'}] },
  'haloquadratum': { altFacts:['Haloquadratum walsbyi is the only known organism with perfectly square, flat cells — paper-thin squares just 0.2 micrometers thick.','It floats in hypersaline lakes like postage stamps, maximizing surface-area-to-volume ratio for light absorption and nutrient uptake.','Haloquadratum is a euryarchaeon in the class Halobacteria — an extreme halophile requiring at least 14% salt to survive.','Named for its remarkable geometry — halo (salt) + quadratum (square). Walsby first observed it in 1980 but it was not cultured until 2004.','Its gas vesicles provide buoyancy to stay near the sunlit surface — it also contains bacteriorhodopsin for light-driven energy generation.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Haloquadratum'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=351628'}] },
  'nanoarchaeum': { altFacts:['Nanoarchaeum equitans is one of the smallest known organisms — just 400 nm in diameter, it must physically attach to a larger archaeon (Ignicoccus) to survive.','It has the smallest non-viral genome at just 490 kilobases — so stripped down it cannot synthesize its own lipids, amino acids, or nucleotides.','Nanoarchaeum was placed in its own phylum (Nanoarchaeota) when discovered in 2002 — one of the most unusual archaea known.','The name means "dwarf ancient one" — nanos (dwarf) + archaios (ancient), equitans (riding), because it rides on its host cell.','It grows at 80–100°C in deep-sea hydrothermal vents — an obligate parasite of Ignicoccus hospitalis, forming intimate cell-to-cell junctions.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Nanoarchaeum_equitans'},{label:'Nature (2002)',url:'https://www.nature.com/articles/417063a'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=228908'}] },
  'thaumarchaeota': { altFacts:['Thaumarchaeota are the dominant ammonia-oxidizing organisms in the ocean — they drive the first step of the global nitrogen cycle, converting ammonia to nitrite.','They are among the most abundant organisms on Earth — estimated at 10²⁸ cells in the oceans alone, rivaling the total number of bacteria.','Thaumarchaeota were reclassified from Crenarchaeota into their own phylum in 2008 — a major revision of the archaeal tree of life.','The name means "wonder ancient ones" — thauma (wonder) + archaios (ancient), reflecting the surprise of their discovery and ecological importance.','They thrive from Antarctic sea ice to hot springs — their ammonia monooxygenase enzyme is now used as a molecular marker to track nitrogen cycling globally.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Thaumarchaeota'},{label:'Nature (2008)',url:'https://www.nature.com/articles/ismej200894'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=651137'}] },
  'methanopyrus': { altFacts:['Methanopyrus kandleri grows at 122°C — the highest confirmed growth temperature for any organism, set in a 2003 high-pressure experiment.','It produces methane from hydrogen and CO₂ at temperatures where most proteins would denature within seconds.','Methanopyrus is the sole genus in the order Methanopyrales — one of the deepest-branching lineages in the euryarchaeotal tree.','The name means "methane fire" — methano (methane) + pyrus (fire), reflecting both its metabolism and its extreme heat tolerance.','Its enzymes function because of unique lipid membranes — ether-linked, branched-chain lipids that remain fluid at temperatures lethal to all bacterial membranes.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Methanopyrus'},{label:'Extremophiles Journal',url:'https://link.springer.com/journal/792'},{label:'PNAS',url:'https://www.pnas.org/doi/10.1073/pnas.0404789101'}] },
  'ferroplasma': { altFacts:['Ferroplasma acidiphilum thrives at pH 0 — the acidity of concentrated sulfuric acid — making it one of the most acid-tolerant organisms known.','It has no cell wall, held together only by its membrane — one of very few archaea with this feature, resembling Mycoplasma bacteria.','Ferroplasma is a euryarchaeon in the order Thermoplasmatales — closely related to Thermoplasma, another wall-less extremophile.','The name means "iron plasma" — ferro (iron) + plasma (formed thing), describing its dependence on iron oxidation for energy.','It dominates acid mine drainage ecosystems, where sulfuric acid leaches from exposed ore — its iron metabolism produces the rusty-orange water seen at abandoned mines.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Ferroplasma'},{label:'Extremophiles Journal',url:'https://link.springer.com/journal/792'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=161364'}] },
  'euryarchaeota': { altFacts:['Euryarchaeota is the most metabolically diverse archaeal phylum — it includes methanogens, extreme halophiles, thermophiles, and even organisms in the human gut.','All biological methane on Earth is produced by euryarchaeal methanogens — from rice paddies to cow intestines to deep-sea vents.','Euryarchaeota is one of the two original archaeal phyla defined by Woese in 1990, alongside Crenarchaeota.','The name means "broadly ancient" — eurys (broad/wide) + archaios (ancient), reflecting the phylum\'s enormous metabolic and ecological breadth.','The human gut contains euryarchaeal methanogens (Methanobrevibacter) that consume hydrogen and produce methane — you exhale archaeal metabolic products with every breath.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Euryarchaeota'},{label:'Tree of Life Web',url:'http://tolweb.org/Euryarchaeota'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=28890'}] },
  'asgard': { altFacts:['Asgard archaea are the closest known prokaryotic relatives of eukaryotes — the discovery that complex cells evolved from within the archaea, not alongside them.','They encode eukaryotic-like proteins for cytoskeleton, membrane remodeling, and vesicle trafficking — genes previously thought to exist only in complex cells.','Asgard is an archaeal superphylum containing Lokiarchaeota, Thorarchaeota, Odinarchaeota, and Heimdallarchaeota — all named after Norse mythology.','Named after Asgard, the realm of the gods in Norse mythology — fitting for organisms that bridged the prokaryote-eukaryote divide.','The "eocyte hypothesis" — that eukaryotes arose from within archaea — was vindicated by Asgard discovery, overturning the classic three-domain tree.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Asgard_(archaea)'},{label:'Nature (2017)',url:'https://www.nature.com/articles/nature21031'},{label:'Science',url:'https://www.science.org/doi/10.1126/science.abe6136'}] },
  // ── Fungi ─────────────────────────────────────────────────────────
  'penicillium': { altFacts:['Alexander Fleming\'s accidental discovery of penicillin from Penicillium notatum in 1928 launched the antibiotic era — saving an estimated 200 million lives since.','Penicillium species give Camembert, Brie, Roquefort, and Gorgonzola their distinctive flavors — P. camemberti and P. roqueforti are essential to cheesemaking.','Penicillium is an ascomycete fungus — in the same division as yeast and morel mushrooms, reproducing via spores in brush-like structures.','The name means "little brush" in Latin — penicillus (paintbrush), describing the brush-shaped spore-bearing structures visible under a microscope.','Penicillium species are everywhere — in soil, air, and food — with over 400 described species, making them among the most common molds on Earth.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Penicillium'},{label:'Nobel Prize 1945',url:'https://www.nobelprize.org/prizes/medicine/1945/summary/'},{label:'Mycology Online',url:'https://mycology.adelaide.edu.au/'}] },
  'armillaria': { altFacts:['The Armillaria ostoyae in Oregon\'s Blue Mountains spans 9.65 km² and weighs an estimated 6,000 tonnes — the largest known organism on Earth by area and mass.','It is a parasitic and saprotrophic fungus that kills trees by attacking their roots — then feeds on the dead wood, glowing faintly in the dark through bioluminescence.','Armillaria is a basidiomycete in the family Physalacriaceae — the honey mushroom fruiting bodies are edible when properly cooked.','The name comes from Latin armilla (bracelet), referring to the ring-like annulus on the mushroom stalk. Common name "honey fungus" describes its golden cap color.','Armillaria spreads underground via black, root-like rhizomorphs that can extend meters through soil — invisible networks that connect and kill trees across entire forests.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Armillaria'},{label:'USDA Forest Service',url:'https://www.fs.usda.gov/Internet/FSE_DOCUMENTS/fsbdev3_033146.pdf'},{label:'Oregon Live',url:'https://www.oregonlive.com/travel/humongous-fungus-oregon'}] },
  'psilocybe': { altFacts:['Psilocybin, the psychoactive compound in Psilocybe mushrooms, is now being studied in FDA-approved trials for treatment-resistant depression, PTSD, and end-of-life anxiety.','Psilocybin evolved independently in multiple fungal lineages — horizontal gene transfer between species spread the biosynthetic gene cluster.','Psilocybe is a basidiomycete in the family Hymenogastraceae — over 200 species exist worldwide, most producing psilocybin.','The name comes from Greek psilos (bare/smooth) + kybe (head), describing the smooth cap. Albert Hofmann (who also synthesized LSD) first isolated psilocybin in 1958.','Indigenous Mesoamerican cultures used psilocybin mushrooms (teonanácatl, "flesh of the gods") in spiritual ceremonies for at least 2,000 years.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Psilocybe'},{label:'Johns Hopkins Center',url:'https://hopkinspsychedelic.org/'},{label:'Mycological Society of America',url:'https://msafungi.org/'}] },
  'batrachochytrium': { altFacts:['Batrachochytrium dendrobatidis (Bd) has caused the decline of over 500 amphibian species and the extinction of at least 90 — the worst disease-driven biodiversity loss ever recorded.','It digests keratin in amphibian skin, disrupting electrolyte balance and eventually causing cardiac arrest — frogs literally die of heart failure.','Batrachochytrium is a chytrid fungus — an ancient fungal lineage with motile, flagellated zoospores, unlike any other major fungal group.','The name means "frog-diminishing" — batrachos (frog) + chytrion (little pot, for the spore case). It was not described until 1999.','Bd likely originated in East Asia and spread globally via the pet trade in African clawed frogs — an unintended biological catastrophe.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Batrachochytrium_dendrobatidis'},{label:'Amphibian Ark',url:'https://www.amphibianark.org/'},{label:'Science',url:'https://www.science.org/doi/10.1126/science.aav0379'}] },
  'synchytrium': { altFacts:['Synchytrium endobioticum causes potato wart disease — producing grotesque tumor-like growths on tubers that make them unmarketable.','Its resting spores can persist in soil for over 40 years, making eradication virtually impossible once land is contaminated.','Synchytrium is a chytrid fungus — one of the most primitive fungal lineages, retaining flagellated zoospores from an aquatic ancestor.','The name means "fused little pot" — syn (together) + chytrion (little pot), describing the fused sporangia in infected plant tissue.','Potato wart is a quarantine disease in most countries — discovery of Synchytrium triggers immediate trade restrictions and soil quarantine measures.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Synchytrium_endobioticum'},{label:'EPPO',url:'https://gd.eppo.int/taxon/SYNCEN'},{label:'CABI',url:'https://www.cabi.org/isc/datasheet/52348'}] },
  'cordyceps': { altFacts:['Cordyceps fungi hijack ant brains — infected ants climb to a precise height, clamp their jaws on a leaf vein, and die as the fungus erupts a stalk from their head to rain spores below.','The "zombie ant" behavior is controlled by the fungus manipulating host muscle and nerve cells — the ant\'s brain is surprisingly not directly invaded.','Cordyceps are ascomycete fungi in the order Hypocreales — over 600 species parasitize insects and other arthropods worldwide.','The name comes from Greek kordyle (club) + Latin ceps (head), describing the club-shaped fruiting body that sprouts from infected insects.','Ophiocordyceps sinensis (caterpillar fungus) sells for over $50,000 per kilogram in traditional Chinese medicine — making it more expensive than gold.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cordyceps'},{label:'Nature (zombie ants)',url:'https://www.nature.com/articles/ncomms12915'},{label:'BBC Earth',url:'https://www.bbcearth.com/news/the-truth-behind-zombie-ants'}] },
  'truffle': { altFacts:['White truffles (Tuber magnatum) sell for up to $4,000 per kilogram — their complex aroma cannot be artificially replicated, making them the world\'s most expensive food by weight.','Truffles fruit underground and depend entirely on animals to find and eat them — the intense aroma evolved to attract boars, squirrels, and trained dogs.','Truffles are ascomycete fungi in the order Pezizales — they form ectomycorrhizal partnerships with tree roots, exchanging minerals for sugars.','The name likely comes from Latin tufer, itself from the Etruscan. Truffles contain androstenol, a compound also found in human sweat and boar saliva.','Despite centuries of attempts, truffles remain nearly impossible to farm reliably — they require specific soil chemistry, tree partnerships, and years of patience.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Truffle'},{label:'Mycological Society of America',url:'https://msafungi.org/'},{label:'Truffle Farming (UK)',url:'https://www.trufflefarminguk.com/'}] },
  'morel': { altFacts:['Morels are among the most prized wild mushrooms — their honeycomb-like cap concentrates flavor and commands prices of $50–100 per kilogram dried.','They fruit prolifically after forest fires — the 2019 Australian bushfires and Pacific Northwest burns triggered massive morel harvests the following spring.','Morels are ascomycete fungi in the family Morchellaceae — their spores form inside the pits of the honeycomb cap, not on gills like basidiomycetes.','The name Morchella may come from the Old German morchel (mushroom). False morels (Gyromitra) look similar but contain the rocket fuel precursor monomethylhydrazine.','Morels have resisted commercial cultivation for over a century — only in 2023 did Chinese growers achieve the first reliable indoor morel farming at scale.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Morchella'},{label:'Mycological Society of America',url:'https://msafungi.org/'},{label:'North American Mycological Association',url:'https://www.namyco.org/'}] },
  'ergot': { altFacts:['Ergot alkaloids from Claviceps purpurea cause convulsive hallucinations — some historians believe the Salem witch trials of 1692 were triggered by ergot-contaminated rye.','LSD (lysergic acid diethylamide) was first synthesized from ergot alkaloids by Albert Hofmann in 1938 — he accidentally discovered its psychoactive effects in 1943.','Ergot is an ascomycete fungus in the order Hypocreales — it infects cereal grains, replacing seeds with dark, horn-shaped sclerotia.','The name comes from Old French argot (cock\'s spur), describing the pointed shape of the fungal body protruding from infected grain heads.','Ergotamine, derived from ergot, is still used to treat migraines and control postpartum hemorrhage — a direct medical application of a deadly fungal toxin.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Ergot'},{label:'CDC Ergotism',url:'https://www.cdc.gov/'},{label:'Science History Institute',url:'https://www.sciencehistory.org/stories/magazine/accidentally-acid/'}] },
  'chanterelle': { altFacts:['Chanterelles are among the most commercially important wild mushrooms — golden chanterelles (Cantharellus cibarius) have a fruity apricot aroma prized by chefs worldwide.','They form ectomycorrhizal partnerships with tree roots — chanterelles cannot be farmed because they require living forest ecosystems to fruit.','Chanterelles are basidiomycete fungi in the order Cantharellales — an ancient lineage that diverged early from gilled mushrooms.','The name comes from Greek kantharos (cup/goblet), describing their vase-shaped caps with false gills (ridges) rather than true blade-like gills.','Chanterelle season is a cultural event in Scandinavian countries — Swedish forests produce ~2,000 tonnes of wild chanterelles annually.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cantharellus_cibarius'},{label:'North American Mycological Association',url:'https://www.namyco.org/'},{label:'First Nature',url:'https://www.first-nature.com/fungi/cantharellus-cibarius.php'}] },
  'death-cap': { altFacts:['Amanita phalloides is responsible for ~90% of fatal mushroom poisonings worldwide — its amatoxins destroy liver cells with a 48-hour delayed onset that makes treatment difficult.','A single death cap mushroom contains enough amatoxin to kill an adult human — and it looks deceptively similar to edible species like paddy straw mushrooms.','The death cap is a basidiomycete in the family Amanitaceae — closely related to the fly agaric (Amanita muscaria) but far more lethal.','The species name phalloides means "phallus-shaped," referring to the immature egg stage. It was introduced to new continents on the roots of imported oak trees.','Amatoxins block RNA polymerase II — halting all protein synthesis in liver cells, leading to organ failure 3–5 days after ingestion.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Amanita_phalloides'},{label:'North American Mycological Association',url:'https://www.namyco.org/'},{label:'Poison Control',url:'https://www.poison.org/articles/mushroom-poisoning'}] },
  'shiitake': { altFacts:['Shiitake is the second most cultivated mushroom worldwide — over 5 million tonnes per year, primarily in China where it has been grown on logs for over 1,000 years.','Lentinan, a beta-glucan from shiitake, is an approved anti-cancer adjuvant in Japan — it stimulates immune cells to attack tumors.','Shiitake (Lentinula edodes) is a basidiomycete in the family Omphalotaceae — a white-rot fungus that decomposes dead hardwood.','The name comes from Japanese shii (Castanopsis tree) + take (mushroom) — historically cultivated on shii tree logs.','Shiitake contains eritadenine, a compound that lowers blood cholesterol in animal studies — making it one of the most researched medicinal mushrooms.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Shiitake'},{label:'Mycological Society of America',url:'https://msafungi.org/'},{label:'Memorial Sloan Kettering',url:'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/shiitake-mushroom'}] },
  'lions-mane': { altFacts:['Lion\'s mane mushroom (Hericium erinaceus) stimulates nerve growth factor (NGF) synthesis in lab studies — research suggests potential benefits for neurodegenerative diseases.','Its cascading white spines look like a waterfall of icicles — one of the most visually distinctive mushrooms in any forest.','Lion\'s mane is a basidiomycete in the family Hericiaceae — a tooth fungus that grows on dead or dying hardwood trees.','In Chinese medicine it is called hou tou gu (monkey head mushroom). Japanese name yamabushitake references mountain monks (yamabushi).','Unlike most medicinal mushrooms, lion\'s mane is also a gourmet ingredient — its flavor and texture resemble crab or lobster meat when sautéed.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Hericium_erinaceus'},{label:'Mycological Society of America',url:'https://msafungi.org/'},{label:'PubMed',url:'https://pubmed.ncbi.nlm.nih.gov/24266378/'}] },
  'lichen': { altFacts:['A lichen is not a single organism but a stable symbiosis — a fungus (mycobiont) farming photosynthetic algae or cyanobacteria (photobiont) for sugars.','Lichens can survive in outer space — experiments on the ISS showed they tolerate vacuum, UV radiation, and cosmic rays for months.','The fungal partner is usually an ascomycete (90% of cases) — the photobiont is typically a green alga or cyanobacterium.','The word "lichen" comes from Greek leichen (tree moss). Lichens produce over 1,000 unique secondary metabolites, many with antibiotic properties.','Lichens are bioindicators of air quality — they absorb everything from the air and die when pollution rises, making them canaries in the coal mine for ecosystems.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Lichen'},{label:'British Lichen Society',url:'https://www.britishlichensociety.org.uk/'},{label:'Consortium of Lichen Herbaria',url:'https://lichenportal.org/'}] },
  'allomyces': { altFacts:['Allomyces is one of the few fungi with flagellated spores — a trait lost in most other fungal lineages, retained from an aquatic ancestor.','It has a true alternation of generations like plants — a haploid and diploid phase, each producing different types of spores.','Allomyces is a chytrid-relative in the order Blastocladiales — one of the most basal fungal lineages with motile zoospores.','The name means "other fungus" — allo (other) + myces (fungus), reflecting its unusual biology compared to typical molds and mushrooms.','Allomyces was a key model organism for understanding fungal genetics in the mid-20th century — its large cells and clear life cycle made it ideal for lab work.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Allomyces'},{label:'Mycological Society of America',url:'https://msafungi.org/'},{label:'Tree of Life Web',url:'http://tolweb.org/Blastocladiomycota'}] },
  // ── Plants ────────────────────────────────────────────────────────
  'sphagnum': { altFacts:['Sphagnum peat bogs store twice as much carbon as all the world\'s forests combined — making them the single most important terrestrial carbon sink.','Sphagnum moss acidifies its environment to pH 3–4 by exchanging hydrogen ions for nutrients — creating conditions hostile to competing plants and decomposers.','Sphagnum is a bryophyte — a non-vascular plant in the class Sphagnopsida, diverging from other mosses over 350 million years ago.','The name comes from Greek sphagnos (a type of moss). Sphagnum has been used as wound dressing since ancient times — it is naturally antiseptic and absorbs 20× its weight in water.','Peat bogs preserve organic material for millennia — "bog bodies" like Tollund Man have been found with skin, hair, and stomach contents intact after 2,400 years.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Sphagnum'},{label:'IUCN Peatland Programme',url:'https://www.iucn.org/resources/issues-brief/peatlands-and-climate-change'},{label:'Kew Gardens',url:'https://www.kew.org/'}] },
  'marchantia': { altFacts:['Marchantia is a liverwort — one of the earliest land plant lineages, with fossils dating back 470 million years to the first colonization of terrestrial habitats.','It reproduces asexually by growing tiny "gemmae" in cup-shaped structures on its surface — rain splashes launch them up to a meter away.','Marchantia is a bryophyte in the class Marchantiopsida — a non-vascular plant more ancient than any moss, fern, or seed plant.','Named after 17th-century French botanist Nicolas Marchant. The Doctrine of Signatures led medieval herbalists to use liverworts (liver-shaped) to treat liver diseases.','Marchantia polymorpha has become a model organism for plant biology — its small genome and easy transformation make it ideal for studying land plant evolution.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Marchantia'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'MarpolBase',url:'https://marchantia.info/'}] },
  'arabidopsis': { altFacts:['Arabidopsis thaliana is the most studied plant in biology — its small genome (135 Mb, 27,000 genes) was the first plant genome fully sequenced, in 2000.','It completes its life cycle in just 6 weeks, produces thousands of seeds, and can be grown in a petri dish — the "lab mouse" of the plant kingdom.','Arabidopsis is a flowering plant (angiosperm) in the mustard family (Brassicaceae) — related to cabbage, broccoli, and canola.','The name honors German botanist Johannes Thal who first described it in the Harz Mountains in the 16th century. Thaliana means "of Thal."','More than 750,000 scientific papers reference Arabidopsis — it has contributed to discoveries in flowering, hormone signaling, disease resistance, and circadian rhythms.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Arabidopsis_thaliana'},{label:'TAIR',url:'https://www.arabidopsis.org/'},{label:'NCBI Genome',url:'https://www.ncbi.nlm.nih.gov/genome/?term=arabidopsis'}] },
  'titan-arum': { altFacts:['The titan arum produces the largest unbranched inflorescence in the plant kingdom — up to 3 meters tall — and smells like rotting flesh to attract carrion beetle pollinators.','A titan arum may grow for 7–10 years before flowering for the first time, and each bloom lasts only 24–48 hours.','Titan arum is an angiosperm in the family Araceae — related to common houseplants like philodendrons and peace lilies.','Its scientific name Amorphophallus titanum means "giant misshapen phallus" — a name so scandalous that Victorian-era Kew Gardens renamed it "titan arum."','The bloom generates metabolic heat up to 36°C — near human body temperature — to volatilize its stench compounds and attract pollinators from kilometers away.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Amorphophallus_titanum'},{label:'Kew Gardens',url:'https://www.kew.org/plants/titan-arum'},{label:'Chicago Botanic Garden',url:'https://www.chicagobotanic.org/titan'}] },
  'mimosa-pudica': { altFacts:['Mimosa pudica folds its leaves within seconds of being touched — the fastest visible plant movement, driven by rapid water expulsion from cells at leaf joints (pulvini).','The touch response is an action potential — an electrical signal that propagates through the plant, strikingly similar to nerve impulses in animals.','Mimosa is an angiosperm in the legume family (Fabaceae) — it fixes nitrogen through Rhizobium root nodules like other legumes.','The name means "bashful mimic" — mimosa (mimic) + pudica (shy/bashful). In many languages it is called the "sensitive plant" or "touch-me-not."','Research shows Mimosa can learn — plants repeatedly dropped from a safe height stop folding their leaves, demonstrating habituation memory that persists for weeks.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Mimosa_pudica'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'Oecologia (learning)',url:'https://link.springer.com/article/10.1007/s00442-013-2873-7'}] },
  'wollemia': { altFacts:['The Wollemi pine was known only from 90-million-year-old fossils until 1994, when David Noble discovered a living grove of just 100 trees in a remote Australian canyon.','Fewer than 100 adult trees exist in the wild — their exact location remains a closely guarded secret to protect them from disease and collectors.','Wollemia is a gymnosperm in the family Araucariaceae — related to monkey puzzle trees and Norfolk Island pines, a lineage from the age of dinosaurs.','Named after the Wollemi National Park in New South Wales where it was found. The species name nobilis honors its discoverer, David Noble.','A global propagation program has distributed thousands of Wollemi pines to botanical gardens and private buyers — an insurance policy against extinction.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Wollemia'},{label:'Royal Botanic Gardens Sydney',url:'https://www.rbgsyd.nsw.gov.au/Science/Wollemi-Pine'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/34926/2857905'}] },
  'tree-fern': { altFacts:['Tree ferns can reach 20 meters tall — the only living ferns that grow into tree-like forms, with trunks made not of wood but of densely packed roots and old leaf bases.','They are ancient — tree ferns dominated Carboniferous forests 350 million years ago, and their compressed remains form much of today\'s coal deposits.','Tree ferns are in the families Cyatheaceae and Dicksoniaceae — true ferns that reproduce via spores, not seeds, like all pteridophytes.','The Maori word for tree fern is ponga (Cyathea dealbata) — the silver fern is New Zealand\'s national symbol, appearing on the All Blacks jersey.','Tree fern trunks are used as growing medium for orchids and epiphytes — their fibrous structure retains moisture while allowing airflow.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Tree_fern'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'NZ Dept of Conservation',url:'https://www.doc.govt.nz/nature/native-plants/ferns/'}] },
  'azolla': { altFacts:['The "Azolla Event" 49 million years ago may have cooled Earth from a greenhouse state — massive Arctic Azolla blooms drew down so much CO₂ that global temperatures plummeted.','Azolla doubles its biomass every 2–3 days, making it one of the fastest-growing plants — a living carbon-capture machine.','Azolla is an aquatic fern in the family Salviniaceae — one of the few ferns that floats, forming dense mats on still water.','The name may come from Greek azo (to dry) + ollyo (to kill) — it dies when dried out. In Asia, Azolla has been used as rice paddy fertilizer for over 1,000 years.','Azolla harbors the cyanobacterium Anabaena in leaf cavities — a permanent symbiosis that fixes atmospheric nitrogen, fertilizing the water below.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Azolla'},{label:'Azolla Foundation',url:'https://theazollafoundation.org/'},{label:'Nature',url:'https://www.nature.com/articles/nature02853'}] },
  'venus-flytrap': { altFacts:['The Venus flytrap counts — trigger hairs must be touched twice within 20 seconds to spring the trap, preventing false closures from raindrops or debris.','After closing, the trap seals and floods with digestive enzymes for 5–12 days — dissolving the insect and absorbing its nitrogen, then reopening.','The Venus flytrap is an angiosperm in the family Droseraceae — related to sundews and more distantly to the carnivorous pitcher plants.','Its scientific name Dionaea muscipula means "Aphrodite\'s mousetrap." Charles Darwin called it "the most wonderful plant in the world."','Venus flytraps naturally grow only within a 120 km radius of Wilmington, North Carolina — one of the most restricted natural ranges of any plant species.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Venus_flytrap'},{label:'NC Botanical Garden',url:'https://ncbg.unc.edu/'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/39636/97398220'}] },
  'baobab': { altFacts:['Baobab trunks can store up to 120,000 liters of water — a living reservoir that sustains the tree through months-long droughts in African savannas.','Some baobabs are over 2,000 years old — carbon dating of the largest specimens reveals they were seedlings when the Roman Republic was young.','Baobabs are angiosperms in the family Malvaceae — related to cotton, cacao, and okra, despite looking nothing like them.','In many African cultures, baobabs are called "the tree of life" — providing food, water, shelter, and medicine. The Senegalese proverb says "knowledge is like a baobab — no one person can embrace it."','Six of the thirteen oldest known baobabs died or collapsed between 2005 and 2020 — a die-off scientists linked to climate change.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Adansonia'},{label:'Kew Gardens',url:'https://www.kew.org/plants/baobab'},{label:'Nature Plants',url:'https://www.nature.com/articles/s41477-018-0170-5'}] },
  'ginkgo': { altFacts:['Ginkgo biloba is the last survivor of an entire division of plants (Ginkgophyta) — all other members went extinct millions of years ago, making it a true "living fossil."','Individual ginkgo trees survived the Hiroshima atomic bombing in 1945 — six trees within 1–2 km of the blast center are still alive today.','Ginkgo is a gymnosperm — not a flowering plant — but so distantly related to pines and cycads that it sits in its own division, Ginkgophyta.','The name comes from Japanese ginkyō (silver apricot), a transliteration of Chinese yínxìng. Fossils virtually identical to modern ginkgo date to 200 million years ago.','Female ginkgo trees produce foul-smelling seeds containing butyric acid — the same compound in rancid butter — which is why most planted urban ginkgos are male clones.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Ginkgo_biloba'},{label:'Missouri Botanical Garden',url:'https://www.missouribotanicalgarden.org/'},{label:'Kew Gardens',url:'https://www.kew.org/plants/ginkgo'}] },
  'dragon-blood-tree': { altFacts:['The dragon blood tree bleeds — when its bark is cut, deep red resin flows out, used since ancient times as medicine, dye, varnish, and ritual incense.','Its umbrella-shaped crown is an adaptation to capture moisture from the fog and mist of Socotra\'s arid mountains — water drips down the branches to the roots.','The dragon blood tree is an angiosperm (Dracaena cinnabari) in the family Asparagaceae — surprisingly related to asparagus and agave.','Socotra Island (Yemen) was called the "most alien-looking place on Earth" by UNESCO — the dragon blood tree is its iconic symbol. The island has 30% plant endemism.','Ancient Romans used dragon\'s blood resin as a wound sealant and pigment. Stradivarius may have used it as varnish on his famous violins.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Dracaena_cinnabari'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'UNESCO Socotra',url:'https://whc.unesco.org/en/list/1263'}] },
  // ── Protists ──────────────────────────────────────────────────────
  'paramecium': { altFacts:['Paramecium was one of the first microorganisms observed under a microscope — Antonie van Leeuwenhoek described "animalcules" in 1674, likely including Paramecium.','It navigates by trial and error — when it hits an obstacle, it reverses, turns slightly, and tries again, a behavior called the "avoiding reaction."','Paramecium is a ciliate protist in the phylum Ciliophora — an alveolate, more closely related to Plasmodium (malaria) than to amoebae.','The name comes from Greek paramekes (oblong), describing its slipper-like shape. It has been called the "slipper animalcule" since the 18th century.','Paramecium has two nuclei — a small micronucleus for sexual reproduction and a large macronucleus that runs daily gene expression, a unique nuclear dimorphism.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Paramecium'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'Protist Info Server',url:'https://protist.i.hosei.ac.jp/'}] },
  'dinoflagellates': { altFacts:['Dinoflagellates cause bioluminescent waves — their blue glow when disturbed creates the spectacular "sea sparkle" visible on beaches worldwide.','Toxic dinoflagellate blooms (red tides) produce saxitoxin and brevetoxin — killing fish by the millions and making shellfish deadly to humans.','Dinoflagellates are alveolate protists — more closely related to Plasmodium (malaria) and ciliates than to any plant or alga.','The name means "whirling whip" — dinos (whirling) + flagellum (whip), describing the spinning motion created by their two perpendicular flagella.','Symbiotic dinoflagellates (zooxanthellae) live inside coral tissue, providing up to 90% of the coral\'s energy — their expulsion during heat stress causes coral bleaching.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Dinoflagellate'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/plankton/dinoflagellates'},{label:'NOAA Red Tide',url:'https://oceanservice.noaa.gov/facts/redtide.html'}] },
  'phytophthora': { altFacts:['Phytophthora infestans caused the Irish Potato Famine (1845–1852) — killing over 1 million people and triggering the emigration of another million.','Despite looking like fungi, Phytophthora species are oomycetes — "water molds" more closely related to brown algae and diatoms than to any true fungus.','Phytophthora is a stramenopile in the class Oomycetes — convergently evolving hyphal growth and plant parasitism independently from fungi.','The name means "plant destroyer" — phyton (plant) + phthora (destruction), coined by Anton de Bary in 1876.','Phytophthora ramorum causes Sudden Oak Death — devastating forests across California and Oregon, and spreading to the UK and Europe.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Phytophthora'},{label:'USDA APHIS',url:'https://www.aphis.usda.gov/aphis/ourfocus/planthealth/plant-pest-and-disease-programs/pests-and-diseases/phytophthora-ramorum'},{label:'Oomycete World',url:'https://www.oomyceteworld.net/'}] },
  'amoeba-proteus': { altFacts:['Amoeba proteus moves by extending pseudopods — temporary projections of cytoplasm that flow forward, pulling the cell along at up to 5 micrometers per second.','It engulfs prey whole by phagocytosis — wrapping pseudopods around bacteria and algae, then digesting them in vacuoles.','Amoeba proteus belongs to the Amoebozoa — a eukaryotic supergroup more closely related to animals and fungi than to plants or algae.','Named after Proteus, the shape-shifting Greek sea god, for its constantly changing form. It was among the first protists described by 18th-century microscopists.','Despite having no brain, nervous system, or fixed shape, amoebae can solve simple mazes, find shortest paths to food, and show rudimentary learning behavior.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Amoeba_proteus'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'Protist Info Server',url:'https://protist.i.hosei.ac.jp/'}] },
  'euglena': { altFacts:['Euglena photosynthesizes like a plant in light but hunts and engulfs food like an animal in the dark — it defied the plant/animal boundary for centuries.','It has a red "eyespot" (stigma) that detects light direction and guides the cell toward optimal illumination — one of the simplest known visual systems.','Euglena is an excavate protist in the phylum Euglenozoa — more closely related to Trypanosoma (sleeping sickness) than to any plant or alga.','The name means "true eye" — eu (true) + glene (eyeball/socket), referring to the prominent eyespot. Antonie van Leeuwenhoek observed it in the 1670s.','Euglena gracilis is cultivated commercially in Japan as a food supplement — rich in paramylon (a unique beta-glucan), protein, and vitamins.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Euglena'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'Nature Education',url:'https://www.nature.com/scitable/topicpage/euglena-14046267/'}] },
  'foraminifera': { altFacts:['Foraminifera shells (tests) accumulate on the ocean floor in such quantities that the White Cliffs of Dover are largely composed of foram fossils — pure calcium carbonate.','Living forams extend threadlike pseudopods through pores in their shells to capture prey — some even farm symbiotic algae inside their chambers.','Foraminifera are rhizarian protists — not closely related to amoebae despite their pseudopods, belonging instead to the SAR supergroup.','The name means "hole bearers" — foramen (hole/opening) + ferre (to bear), describing the perforated shells. Over 275,000 fossil species are described.','Oil companies use foram fossils to date and correlate sedimentary rock layers — micropaleontology of forams is essential to petroleum geology.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Foraminifera'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/plankton/foraminifera'},{label:'UCL Micropalaeontology',url:'https://www.ucl.ac.uk/earth-sciences/research/micropalaeontology'}] },
  'trypanosoma': { altFacts:['Trypanosoma brucei causes African sleeping sickness — a fatal disease if untreated, transmitted by the tsetse fly and affecting 60 million people in at-risk areas.','It evades the immune system through antigenic variation — switching its surface coat from a library of ~1,000 variant genes, always staying one step ahead.','Trypanosoma is an excavate protist in the phylum Euglenozoa — closely related to Euglena, though one photosynthesizes and the other parasitizes blood.','The name means "boring body" — trypano (borer) + soma (body), describing its corkscrew-like movement through blood plasma.','T. cruzi causes Chagas disease in the Americas — transmitted by "kissing bugs" that defecate in bite wounds while feeding on sleeping humans.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Trypanosoma'},{label:'WHO Sleeping Sickness',url:'https://www.who.int/news-room/fact-sheets/detail/trypanosomiasis-human-african-(sleeping-sickness)'},{label:'CDC Chagas',url:'https://www.cdc.gov/chagas/'}] },
  'toxoplasma': { altFacts:['Toxoplasma gondii infects ~30% of all humans on Earth — in some countries over 80% of the population carries chronic latent infections.','Infected mice lose their fear of cats — the parasite manipulates rodent behavior to increase transmission to cats, its definitive host.','Toxoplasma is an alveolate protist in the phylum Apicomplexa — closely related to Plasmodium (malaria), both obligate intracellular parasites.','The name comes from Greek toxon (bow/arc) + plasma (form), describing the crescent shape of the tachyzoite stage. It was discovered in a North African rodent (gundi) in 1908.','Toxoplasma infection in humans has been linked to behavioral changes — studies suggest correlations with risk-taking, reaction times, and even car accident rates, though causation remains debated.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Toxoplasma_gondii'},{label:'CDC Toxoplasmosis',url:'https://www.cdc.gov/toxoplasmosis/'},{label:'Nature',url:'https://www.nature.com/articles/nrmicro1853'}] },
  'slime-mold': { altFacts:['Slime molds have no brain, yet Physarum polycephalum can solve mazes, find shortest paths between food sources, and replicate the Tokyo rail network.','They exist as single cells that aggregate into a unified mass — a plasmodium that can cover several square meters of forest floor.','Slime molds are amoebozoan protists — more closely related to animals and fungi than to bacteria, despite their shapeless appearance.','The name Mycetozoa means "fungus animal" — they were classified as fungi, then plants, then protists. Their true identity eluded biologists for over a century.','Physarum makes decisions by balancing chemical signals across its network — a form of distributed computation without any central processing, inspiring computer algorithm design.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Slime_mold'},{label:'Science (maze)',url:'https://www.science.org/doi/10.1126/science.289.5484.1557'},{label:'Smithsonian',url:'https://www.si.edu/stories/slime-molds'}] },
  'radiolaria': { altFacts:['Radiolarian skeletons are among the most geometrically perfect structures in nature — silica lattices in perfect icosahedral and geodesic patterns inspired Buckminster Fuller\'s domes.','Their fossilized silica shells accumulate as radiolarian ooze — deep-sea sediments that eventually lithify into the rock chert, used by prehistoric humans for tools.','Radiolaria are rhizarian protists in the SAR supergroup — not closely related to foraminifera despite similar appearances, a case of convergent evolution.','The name comes from Latin radiolus (small ray), describing the needle-like pseudopods (axopods) radiating from their spherical bodies.','Ernst Haeckel\'s exquisite 1904 illustrations of radiolaria in "Kunstformen der Natur" influenced Art Nouveau architecture and design worldwide.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Radiolaria'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/protista/radiolaria.html'},{label:'Haeckel Kunstformen',url:'https://www.biodiversitylibrary.org/item/31936'}] },
  'stentor': { altFacts:['Stentor coeruleus is one of the largest single-celled organisms — up to 2 mm long, visible to the naked eye, with a trumpet-shaped body covered in cilia.','When repeatedly irritated, Stentor shows a hierarchy of avoidance responses — bending, reversing cilia, contracting, and finally detaching — a form of decision-making without a brain.','Stentor is a ciliate protist in the order Heterotrichida — an alveolate related to Paramecium, with thousands of cilia coordinated like a conveyor belt.','Named after Stentor, the Greek herald in the Iliad whose voice was as loud as 50 men — for the organism\'s trumpet shape, not its volume.','Stentor can regenerate from fragments — even 1/64th of the cell can regrow into a complete organism, making it a model for single-cell regeneration research.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Stentor_(genus)'},{label:'Nature',url:'https://www.nature.com/articles/s41586-019-1161-z'},{label:'Protist Info Server',url:'https://protist.i.hosei.ac.jp/'}] },
  // ── Top-level groups ──────────────────────────────────────────────
  'eukaryota': { altFacts:['Every plant, animal, fungus, and protist is a eukaryote — cells with a true nucleus, a feature that evolved only once in the history of life.','The eukaryotic cell arose from a merger — an archaeon engulfed a bacterium, which became the mitochondrion, in the most consequential symbiosis in evolutionary history.','Eukaryota is one of three domains of life alongside Bacteria and Archaea — molecular evidence now places eukaryotes within the archaeal tree, as close relatives of Asgard archaea.','The name means "true kernel" — eu (true) + karyon (nut/kernel), referring to the membrane-bound nucleus that defines the group.','The oldest confirmed eukaryotic fossils are ~1.65 billion years old — but molecular clocks suggest the lineage may have originated over 2 billion years ago.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Eukaryote'},{label:'Tree of Life Web',url:'http://tolweb.org/Eukaryotes'},{label:'Nature Reviews Genetics',url:'https://www.nature.com/nrg/'}] },
  'animalia': { altFacts:['All animals share a single common ancestor — a colonial choanoflagellate that evolved multicellularity roughly 700–800 million years ago.','Animals are the only kingdom whose members all consume other organisms for energy — heterotrophy defines the kingdom from sponges to whales.','Animalia is nested within the eukaryotic supergroup Opisthokonta — animals are more closely related to fungi than to plants.','The word "animal" derives from Latin anima (breath/soul). Aristotle\'s History of Animals was the first systematic classification, distinguishing "blooded" from "bloodless" creatures.','Of ~1.5 million described animal species, over 1.2 million are arthropods — vertebrates (including all mammals) account for only ~5%.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Animal'},{label:'Animal Diversity Web',url:'https://animaldiversity.org/'},{label:'Tree of Life Web',url:'http://tolweb.org/Animals'}] },
  'plantae': { altFacts:['Plants produce the oxygen in roughly every other breath you take — photosynthesis generates ~50% of atmospheric O₂ (phytoplankton produce the other ~50%).','The first land plants transformed barren rock into soil — partnering with fungi to break down minerals, creating the foundation for terrestrial ecosystems.','Plantae are eukaryotes whose chloroplasts descend from an engulfed cyanobacterium — primary endosymbiosis occurred only once, ~1.5 billion years ago.','The word "plant" comes from Latin planta (sprout/shoot). The oldest land plant fossils are 470-million-year-old liverwort spores from Ordovician Argentina.','There are ~400,000 known plant species — but 40% are threatened with extinction, losing species faster than scientists can describe them.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Plant'},{label:'Kew State of the World\'s Plants',url:'https://www.kew.org/science/state-of-the-worlds-plants-and-fungi'},{label:'PLANTS Database (USDA)',url:'https://plants.usda.gov/'}] },
  'protists': { altFacts:['Protists are not a natural group — "protist" is a catch-all for eukaryotes that are not animals, plants, or fungi, spanning enormous evolutionary diversity.','A single drop of pond water can contain dozens of protist species — amoebae, ciliates, flagellates, and algae, each on a different branch of the eukaryotic tree.','Protists include lineages that diverged over a billion years ago — the genetic distance between a diatom and an amoeba is greater than between a human and a mushroom.','The term was coined by Ernst Haeckel in 1866, from Greek protistos (the very first), believing them to be the most primitive eukaryotes.','Malaria (Plasmodium), red tides (dinoflagellates), potato blight (Phytophthora), and sleeping sickness (Trypanosoma) are all caused by protists.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Protist'},{label:'Tree of Life Web',url:'http://tolweb.org/Eukaryotes'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'}] },
  // ── Other missing species ─────────────────────────────────────────
  'bdelloid-rotifer': { altFacts:['Bdelloid rotifers have survived for over 80 million years without any sexual reproduction — the longest known asexual lineage in the animal kingdom.','They can survive desiccation for years, then revive when wetted — during dry periods their DNA shatters, and upon rehydration they repair it, incorporating foreign genes in the process.','Bdelloid rotifers are microscopic invertebrates in the phylum Rotifera — their "wheel organ" (corona) of beating cilia gives them their name: rota (wheel) + ferre (to bear).','They steal genes from bacteria, fungi, and plants via horizontal gene transfer — up to 10% of their genome is foreign, the highest proportion of any animal.','A bdelloid rotifer was revived in 2021 after being frozen for 24,000 years in Siberian permafrost — still capable of feeding and reproducing.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Bdelloidea'},{label:'Current Biology (2021)',url:'https://www.cell.com/current-biology/fulltext/S0960-9822(21)00624-2'},{label:'Nature',url:'https://www.nature.com/articles/nature07153'}] },
  'blue-ringed-octopus': { altFacts:['The blue-ringed octopus carries enough tetrodotoxin to kill 26 adults within minutes — and there is no antivenom.','Its iridescent blue rings flash as a warning only when threatened — normally it is a drab yellow-brown, nearly invisible against coral rubble.','Blue-ringed octopuses are cephalopod mollusks in the genus Hapalochlaena — closely related to other octopuses but uniquely venomous among them.','Despite being only 12–20 cm across, they are considered one of the most dangerous marine animals — their painless bite often goes unnoticed until paralysis begins.','The tetrodotoxin is produced by symbiotic bacteria in their salivary glands — the same toxin found in pufferfish, acquired independently through convergent symbiosis.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Blue-ringed_octopus'},{label:'Australian Museum',url:'https://australian.museum/learn/animals/molluscs/blue-ringed-octopus/'},{label:'National Geographic',url:'https://www.nationalgeographic.com/animals/invertebrates/facts/blue-ringed-octopus'}] },
  'platypus-frog': { altFacts:['The gastric-brooding frog (Rheobatrachus) swallowed its fertilized eggs and incubated tadpoles in its stomach — the only known vertebrate to gestate young in the digestive tract.','The mother switched off stomach acid production during brooding using prostaglandin E₂ — a mechanism of intense medical interest for treating peptic ulcers.','Rheobatrachus was a frog in the family Myobatrachidae — an Australian endemic that went extinct in the mid-1980s, likely from chytrid fungus.','Both species (R. silus and R. vitellinus) went extinct before scientists could fully study their extraordinary reproductive biology — discovered in 1973, gone by 1985.','The "Lazarus Project" attempted to clone the gastric-brooding frog from preserved tissue — in 2013 scientists briefly created living embryos, though none survived to tadpole stage.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Gastric-brooding_frog'},{label:'Australian Museum',url:'https://australian.museum/learn/animals/frogs/southern-gastric-brooding-frog/'},{label:'Revive & Restore',url:'https://reviverestore.org/'}] },
  'kakapo': { altFacts:['The kakapo is the world\'s only flightless parrot — it is also nocturnal, the heaviest parrot (up to 4 kg), and one of the longest-lived birds (80+ years).','Males attract mates by inflating air sacs and booming at 11 Hz — audible 5 km away. They boom every night for 2–4 months, losing half their body weight.','The kakapo is a parrot in the family Strigopidae — an ancient New Zealand lineage that diverged from other parrots ~80 million years ago.','The Maori name kakapo means "night parrot" — kaka (parrot) + po (night). They were nearly extinct by the 1990s with only 51 individuals remaining.','Every kakapo alive has a name — intensive conservation including hand-rearing, genetic management, and predator-free islands brought the population to over 250.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/K%C4%81k%C4%81p%C5%8D'},{label:'Kakapo Recovery',url:'https://www.doc.govt.nz/our-work/kakapo-recovery/'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/22685245/163543046'}] },
  'resplendent-quetzal': { altFacts:['The resplendent quetzal\'s iridescent green tail coverts can reach 65 cm — longer than its body — shimmering from green to blue to gold as light shifts.','It was sacred to the Maya and Aztec — Quetzalcoatl (the feathered serpent god) took the quetzal\'s plumage. Killing one was a capital offense in the Aztec Empire.','The quetzal is a trogon in the family Trogonidae — a pantropical bird family whose nearest relatives are surprisingly poorly resolved in avian phylogenetics.','The word "quetzal" comes from Nahuatl quetzalli (precious feather). Guatemala\'s currency is named after this bird, which also appears on the national flag.','Despite its stunning beauty, the quetzal is shy and difficult to spot in cloud forest canopy — its green plumage provides excellent camouflage among epiphytes and moss.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Resplendent_quetzal'},{label:'Cornell Lab',url:'https://www.allaboutbirds.org/guide/Resplendent_Quetzal/'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/22682727/131483764'}] },
  'greater-bird-of-paradise': { altFacts:['Males perform elaborate courtship displays — hanging upside down from branches with cascading golden plumes fanned over their backs, dancing for hours.','When European traders first brought bird of paradise skins to Europe in 1522, the feet had been removed — leading to the myth that they never landed, living permanently in flight.','Birds of paradise are passerines in the family Paradisaeidae — a corvid-adjacent lineage endemic to New Guinea and nearby islands, with 45 species.','The scientific name Paradisaea apoda means "footless bird of paradise" — Linnaeus perpetuated the myth by naming it after the legless trade skins.','Sexual selection in birds of paradise is so extreme that males of different species evolved wildly different displays — from riflebird chest-puffing to parotia ballerina dances.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Greater_bird-of-paradise'},{label:'Cornell Lab Birds of Paradise',url:'https://www.birdsofparadiseproject.org/'},{label:'IUCN Red List',url:'https://www.iucnredlist.org/species/22706222/131752274'}] },
  // ── Additional tree nodes missing ENRICHMENT ──────────────────────
  'actinobacteria': { altFacts:['Actinobacteria produce the majority of naturally derived antibiotics — streptomycin, tetracycline, erythromycin, and vancomycin all come from this single phylum.','They give soil its characteristic earthy smell — geosmin, the compound responsible, is produced by Streptomyces and detected by humans at concentrations as low as 5 parts per trillion.','Actinobacteria are Gram-positive, high-GC bacteria — a distinct phylum from Firmicutes (low-GC Gram-positives), despite both staining similarly.','The name means "ray fungus" — aktis (ray) + bakterion (rod), because early microbiologists mistook their branching filaments for fungal hyphae.','Mycobacterium tuberculosis, the deadliest bacterial pathogen, is an actinobacterium — the same phylum that gives us life-saving antibiotics also harbors one of our greatest killers.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Actinomycetota'},{label:'Microbiology Society',url:'https://microbiologysociety.org/'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=201174'}] },
  'ascomycetes': { altFacts:['Ascomycetes are the largest fungal phylum — over 64,000 species including yeasts, molds, morels, truffles, and the fungal partners of most lichens.','They produce spores inside sac-like structures called asci — each ascus typically contains 8 spores, launched at up to 25 m/s.','Ascomycetes (Ascomycota) include Penicillium, Saccharomyces, and Aspergillus — fungi that gave us antibiotics, bread, beer, and soy sauce.','The name means "sac fungi" — askos (sac/wineskin) + mykes (fungus), for the distinctive ascus spore structure.','Neurospora crassa, a bread mold, was the organism Beadle and Tatum used to prove the "one gene, one enzyme" hypothesis — earning the 1958 Nobel Prize.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Ascomycota'},{label:'Mycological Society of America',url:'https://msafungi.org/'},{label:'Tree of Life Web',url:'http://tolweb.org/Ascomycota'}] },
  'basidiomycetes': { altFacts:['Basidiomycetes include most of the mushrooms you recognize — from button mushrooms to porcini to the deadly death cap, plus puffballs, shelf fungi, and rusts.','They produce spores on club-shaped structures called basidia — the "gills" under a mushroom cap are surfaces maximized for basidium production.','Basidiomycetes (Basidiomycota) are the sister group to Ascomycetes — together they form the subkingdom Dikarya, the "higher fungi."','The name means "small pedestal fungi" — basidion (small base/pedestal) + mykes (fungus), for the basidia that bear spores.','Many basidiomycetes form vast underground networks of mycelium — the "wood wide web" connecting trees via mycorrhizal networks is largely basidiomycete-driven.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Basidiomycota'},{label:'Mycological Society of America',url:'https://msafungi.org/'},{label:'Tree of Life Web',url:'http://tolweb.org/Basidiomycota'}] },
  'chytrids': { altFacts:['Chytrids are the only fungi with flagellated spores (zoospores) — a trait retained from their aquatic ancestor that all other fungi lost.','Batrachochytrium dendrobatidis, a chytrid, has caused the worst wildlife disease ever recorded — devastating amphibian populations across six continents.','Chytrids (Chytridiomycota) are among the most basal fungal lineages — they diverged early from the fungal tree, retaining ancestral aquatic features.','The name comes from Greek chytridion (little pot), describing the spherical sporangia that release flagellated zoospores into water.','Most chytrids are decomposers in soil and freshwater — they break down pollen, chitin, and cellulose, playing essential roles in nutrient cycling.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Chytridiomycota'},{label:'AmphibiaWeb',url:'https://amphibiaweb.org/chytrid/chytridfungus.html'},{label:'Tree of Life Web',url:'http://tolweb.org/Chytridiomycota'}] },
  'bryophytes': { altFacts:['Bryophytes (mosses, liverworts, hornworts) were the first plants to colonize land ~470 million years ago — paving the way for all terrestrial plant life.','They have no true roots, stems, or vascular tissue — absorbing water and nutrients directly through their surfaces, which is why they stay small and low.','Bryophytes are the most basal living land plants — they diverged before the evolution of vascular tissue, seeds, or flowers.','The name comes from Greek bryon (moss) + phyton (plant). There are over 20,000 bryophyte species, found on every continent including Antarctica.','Peat mosses (Sphagnum) alone store more carbon than all the world\'s forests combined — bryophyte ecology has global climate significance.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Bryophyte'},{label:'British Bryological Society',url:'https://www.britishbryologicalsociety.org.uk/'},{label:'Kew Gardens',url:'https://www.kew.org/'}] },
  'angiosperms': { altFacts:['Angiosperms (flowering plants) account for ~90% of all living plant species — over 350,000 species dominating nearly every terrestrial ecosystem.','Charles Darwin called the rapid diversification of flowering plants "an abominable mystery" — how they came to dominate in just 20 million years remains debated.','Angiosperms are the most derived plant clade — nested within seed plants, they evolved flowers and enclosed seeds as key innovations.','The name means "vessel seed" — angeion (vessel) + sperma (seed), referring to seeds enclosed within a fruit (carpel), unlike the naked seeds of gymnosperms.','The co-evolution of flowers and pollinators drove an explosive diversification — angiosperms and their insect pollinators speciated in tandem, each driving the other\'s evolution.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Flowering_plant'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'Angiosperm Phylogeny Group',url:'https://www.mobot.org/MOBOT/research/APweb/'}] },
  'gymnosperms': { altFacts:['Gymnosperms dominated Earth\'s forests for 200 million years before flowering plants arose — conifers, cycads, and ginkgos were the trees of the dinosaur age.','They produce "naked seeds" — not enclosed in a fruit — typically in cones, making them the oldest living seed plants.','Gymnosperms are a paraphyletic group of seed plants including conifers, cycads, ginkgos, and gnetales — they diverged from the angiosperm lineage ~300 million years ago.','The name means "naked seed" — gymnos (naked) + sperma (seed), contrasting with the enclosed seeds of angiosperms.','Conifers remain the tallest (coast redwood, 115 m), most massive (giant sequoia, 1,487 m³), and oldest (bristlecone pine, 5,000 years) individual organisms on Earth.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Gymnosperm'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'Tree of Life Web',url:'http://tolweb.org/Spermatophyta'}] },
  'ferns': { altFacts:['Ferns are the second most diverse group of vascular plants after angiosperms — over 10,500 species, thriving in every habitat from tropical forests to arctic tundra.','They reproduce via spores, not seeds — a life cycle alternating between a leafy sporophyte and a tiny, heart-shaped gametophyte (prothallus).','Ferns are pteridophytes — vascular plants that evolved true roots, stems, and leaves but diverged before the evolution of seeds.','The word "fern" comes from Old English fearn. Fern "fiddleheads" (coiled young fronds) are eaten as a delicacy in many cultures.','Carboniferous fern forests (~350 Mya) compressed into the coal deposits that fueled the Industrial Revolution — ancient fern photosynthesis powers modern civilization.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Fern'},{label:'American Fern Society',url:'https://www.amerfernsoc.org/'},{label:'Kew Gardens',url:'https://www.kew.org/'}] },
  'alveolates': { altFacts:['Alveolates include three wildly different groups — ciliates (Paramecium), apicomplexans (Plasmodium/malaria), and dinoflagellates — united by membrane sacs (alveoli) beneath the cell surface.','They span free-living phototrophs, apex predators of the microbial world, and obligate intracellular parasites — one of the most ecologically diverse eukaryotic clades.','Alveolates are a clade within the SAR supergroup — more closely related to stramenopiles (diatoms, kelp) than to animals or plants.','The name refers to cortical alveoli — flattened membrane sacs under the plasma membrane, a synapomorphy visible only by electron microscopy.','Alveolates are responsible for both the beauty (bioluminescent dinoflagellates) and the terror (malaria, killing 600,000 people annually) of the protist world.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Alveolata'},{label:'Tree of Life Web',url:'http://tolweb.org/Alveolata'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=33630'}] },
  'stramenopiles': { altFacts:['Stramenopiles include brown algae (kelp), diatoms, and the oomycete "water molds" — groups so different they were once placed in separate kingdoms.','Diatoms alone produce 20–25% of global oxygen — stramenopile photosynthesis is as important to Earth\'s atmosphere as all terrestrial forests.','Stramenopiles are SAR eukaryotes — their chloroplasts came from a secondary endosymbiosis (engulfing a red alga), not directly from a cyanobacterium.','The name means "straw hairs" — stramen (straw) + pilos (hair), for the distinctive tubular hairs (mastigonemes) on one flagellum.','Giant kelp (Macrocystis) can grow 60 cm per day — the fastest sustained growth of any organism, forming underwater forests that shelter hundreds of species.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Stramenopiles'},{label:'Tree of Life Web',url:'http://tolweb.org/Stramenopiles'},{label:'Algaebase',url:'https://www.algaebase.org/'}] },
  'amoebozoa': { altFacts:['Amoebozoa is the eukaryotic supergroup closest to the animal-fungal lineage (Opisthokonta) — amoebae are more closely related to you than to any plant or alga.','The group includes the slime molds (Dictyostelium, Physarum) that can solve mazes and replicate transport networks — intelligence without a brain.','Amoebozoa are defined by lobose pseudopods — broad, blunt cytoplasmic extensions used for locomotion and feeding.','The name combines Greek amoibe (change) + zoa (animals), reflecting the constantly changing shapes of these protists.','Entamoeba histolytica, an amoebozoan parasite, causes amoebic dysentery — infecting 50 million people and killing ~100,000 annually worldwide.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Amoebozoa'},{label:'Tree of Life Web',url:'http://tolweb.org/Amoebozoa'},{label:'NCBI',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=554915'}] },
  'vertebrates': { altFacts:['Vertebrates account for less than 5% of all animal species — yet they dominate most macroscopic ecosystems as top predators, grazers, and ecosystem engineers.','The first vertebrates were jawless fish resembling modern lampreys — jaws evolved later from gill arches, one of evolution\'s most consequential repurposings.','Vertebrates are chordates in the subphylum Vertebrata — defined by a vertebral column (backbone) that replaced the notochord.','The word comes from Latin vertebra (joint), from vertere (to turn). There are ~72,000 described vertebrate species, from hagfish to blue whales.','The vertebrate endoskeleton grows with the animal — unlike arthropod exoskeletons that must be molted, vertebrate bones remodel throughout life.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Vertebrate'},{label:'Tree of Life Web',url:'http://tolweb.org/Vertebrata'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/vertebrates/vertintro.html'}] },
  'sarcopterygii': { altFacts:['Sarcopterygii (lobe-finned fish) includes coelacanths, lungfish, and all tetrapods — meaning you are technically a lobe-finned fish.','The muscular, bony fins of sarcopterygians evolved into the limbs of land vertebrates — the same skeletal pattern (humerus-radius-ulna) persists from fish to humans.','Sarcopterygii diverged from ray-finned fish (Actinopterygii) about 420 million years ago — a split that eventually produced every land vertebrate.','The name means "flesh fin" — sarx (flesh) + pterygion (fin/wing), describing the fleshy, limb-like fins.','Only 8 living species of non-tetrapod sarcopterygians remain — 2 coelacanths and 6 lungfish — compared to 33,000+ ray-finned fish species.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Sarcopterygii'},{label:'UCMP Berkeley',url:'https://ucmp.berkeley.edu/vertebrates/basalfish/sarcopterygii.html'},{label:'Tree of Life Web',url:'http://tolweb.org/Sarcopterygii'}] },
  'chondrichthyes': { altFacts:['Chondrichthyes (sharks, rays, skates, chimaeras) have skeletons made entirely of cartilage — lighter and more flexible than bone, a design unchanged for 450 million years.','They predate the first trees, the first land vertebrates, and all four of Earth\'s most recent mass extinctions — one of the most enduring vertebrate body plans.','Chondrichthyes diverged from bony fish (Osteichthyes) over 420 million years ago — a deep split in the vertebrate tree.','The name means "cartilage fish" — chondros (cartilage) + ichthys (fish). There are over 1,200 living species.','Shark skin is covered in tooth-like denticles that reduce drag — the same biomimetic principle has been applied to Olympic swimsuits and aircraft coatings.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Chondrichthyes'},{label:'Shark Trust',url:'https://www.sharktrust.org/'},{label:'IUCN Shark Specialist Group',url:'https://www.iucnssg.org/'}] },
  'actinopterygii': { altFacts:['Ray-finned fish (Actinopterygii) are the most species-rich vertebrate group — over 33,000 species, more than all mammals, birds, reptiles, and amphibians combined.','They dominate every aquatic habitat — from 8,000 m deep ocean trenches to 5,000 m alpine lakes, from polar seas to desert springs.','Actinopterygii diverged from lobe-finned fish (Sarcopterygii) about 420 million years ago — both are bony fish (Osteichthyes).','The name means "ray fin" — aktis (ray) + pterygion (fin), for the thin, bony fin rays that support their fins (unlike the fleshy fins of sarcopterygians).','Teleosts (advanced ray-finned fish) underwent an extra whole-genome duplication ~320 Mya — this genetic redundancy may have fueled their explosive diversification.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Actinopterygii'},{label:'FishBase',url:'https://www.fishbase.org/'},{label:'Tree of Life Web',url:'http://tolweb.org/Actinopterygii'}] },
  'kelp': { altFacts:['Giant kelp can grow 60 cm per day — the fastest sustained growth of any organism — forming underwater forests that shelter over 800 species.','Kelp forests absorb 20 times more CO₂ per hectare than land forests, making them critical carbon sinks that help fight climate change.','Kelp are brown algae (Phaeophyceae) in the stramenopile lineage — not plants, despite their plant-like appearance. They acquired photosynthesis through secondary endosymbiosis.','The word "kelp" may derive from Middle English culpe (seaweed). Sea otters are keystone predators that maintain kelp forests by eating sea urchins.','Kelp forests are disappearing globally — "urchin barrens" form when sea otter populations decline and urchins overgraze, creating a feedback loop.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Kelp'},{label:'Monterey Bay Aquarium',url:'https://www.montereybayaquarium.org/animals/habitats/kelp-forest'},{label:'NOAA',url:'https://sanctuaries.noaa.gov/visit/ecosystems/kelpdesc.html'}] },
  'orchid': { altFacts:['Orchids are the largest flowering plant family with 28,000+ species — more than mammals, birds, and reptiles combined.','Some orchids mimic female insects so precisely — in shape, texture, and pheromone scent — that males attempt to mate with them, inadvertently pollinating the flower.','Orchids are monocots, related to grasses and palms — they diverged from other flowering plants about 80 million years ago.','The name comes from Greek orchis (testicle), referring to the paired underground tubers of some European species.','Vanilla is an orchid — the seed pods of Vanilla planifolia are the second most expensive spice after saffron.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Orchid'},{label:'Kew Orchid Collection',url:'https://www.kew.org/science/collections-and-resources/data-and-digital/orchid-list'},{label:'American Orchid Society',url:'https://www.aos.org/'}] },
  'rice': { altFacts:['Rice feeds more humans than any other crop — over 3.5 billion people depend on it as their primary calorie source.','Rice paddies produce 12% of global methane emissions — the flooded fields create anaerobic conditions where archaea produce methane, contributing to climate change.','Rice (Oryza sativa) is a grass in the family Poaceae — closely related to wheat, corn, and bamboo.','Rice was domesticated independently in China (~9,000 years ago) and Africa (~3,000 years ago) from different wild species.','A single rice plant can produce over 3,000 grains. Golden rice, engineered with beta-carotene, could prevent 500,000 cases of childhood blindness annually.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Rice'},{label:'IRRI',url:'https://www.irri.org/'},{label:'FAO',url:'https://www.fao.org/rice2004/'}] },
  'bamboo': { altFacts:['Bamboo can grow 91 cm in a single day — the fastest growth of any plant on Earth — and some species reach 30 m tall.','Some bamboo species flower simultaneously worldwide after 40-120 years of vegetative growth, then die — a synchronized mass event that baffles botanists.','Bamboo is a grass (family Poaceae), not a tree — making it a close relative of wheat, rice, and your lawn.','In Chinese culture, bamboo symbolizes resilience and integrity. Its hollow stem represents humility, and it is one of the "Four Gentlemen" of Chinese art.','Bamboo sequesters carbon 4x faster than an equivalent stand of trees and can be harvested annually without killing the plant.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Bamboo'},{label:'World Bamboo Organization',url:'https://worldbamboo.net/'},{label:'Kew Gardens',url:'https://www.kew.org/'}] },
  'cactus': { altFacts:['The saguaro cactus grows only 2.5 cm in its first decade but can live 200 years, reach 12 m tall, and store 4,800 liters of water.','31% of cactus species are threatened — they are one of the most endangered plant groups, driven by illegal collection and habitat loss.','Cacti are in the order Caryophyllales, related to beets, carnations, and amaranth — not closely related to other spiny desert plants.','All cacti are native to the Americas except one species (Rhipsalis baccifera) found in Africa — likely carried there by migratory birds.','Cactus spines are modified leaves — the photosynthesis happens in the green stem, and the spines reduce water loss and deter herbivores.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cactus'},{label:'IUCN SSC Cactus Specialist Group',url:'https://www.iucn.org/our-union/commissions/group/iucn-ssc-cactus-and-succulent-plants-specialist-group'},{label:'Desert Botanical Garden',url:'https://dbg.org/'}] },
  'mangrove': { altFacts:['Mangrove forests protect coastlines from storm surge better than any human-built structure — reducing wave energy by 66-100% within 500 meters.','They store 3-5 times more carbon per hectare than terrestrial forests, locked in waterlogged, oxygen-free soil where decomposition is nearly halted.','Mangroves are not a single species but a convergent group — 80+ species from 16 different plant families independently evolved the ability to tolerate saltwater.','The word "mangrove" may come from Portuguese mangue or Malay manggi-manggi — reflecting the global distribution of these coastal forests.','Despite their ecological importance, 35% of mangrove forests have been destroyed since the 1980s — primarily for shrimp farming and coastal development.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Mangrove'},{label:'Global Mangrove Alliance',url:'https://www.mangrovealliance.org/'},{label:'IUCN',url:'https://www.iucn.org/resources/issues-brief/mangroves-and-coastal-ecosystems'}] },
  'water-lily': { altFacts:['The giant water lily\'s leaf can reach 3 m in diameter and support 45 kg — its underside is a masterpiece of structural engineering with air-filled ribs that distribute weight evenly.','Water lilies are among the most ancient flowering plants — they diverged from other angiosperms about 130 million years ago, near the very base of the flowering plant tree.','Some water lily flowers open only at night and are pollinated by beetles — they trap the beetles inside and dust them with pollen before releasing them the next evening.','The genus Nymphaea is named after the Greek nymphs — water spirits that inhabited springs and streams.','Claude Monet painted over 250 water lily paintings — his garden at Giverny, with its Japanese bridge and lily pond, became the most famous botanical garden in art history.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Nymphaeaceae'},{label:'Kew Gardens',url:'https://www.kew.org/plants/water-lilies'},{label:'Missouri Botanical Garden',url:'https://www.missouribotanicalgarden.org/'}] },
  'oak': { altFacts:['A single mature oak tree supports over 2,300 species — more than any other tree in temperate forests — providing food, shelter, and habitat.','Oaks can live over 1,000 years. The Pechanga Great Oak in California is estimated at 2,000 years old.','Oaks are in the beech family (Fagaceae), related to beeches and chestnuts — they diversified explosively about 56 million years ago.','Oak has been sacred across cultures — the druids worshipped in oak groves, Zeus\'s oracle at Dodona spoke through a sacred oak, and "robust" comes from Latin robur (oak).','Acorns were a staple food for Indigenous peoples across North America and Europe for millennia — they require leaching to remove bitter tannins before eating.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Oak'},{label:'Woodland Trust',url:'https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/british-trees/a-z-of-british-trees/oak/'},{label:'Royal Botanic Gardens',url:'https://www.kew.org/'}] },
  'pitcher-plant': { altFacts:['Pitcher plants lure insects with nectar and bright colors, then drown them in digestive fluid — some tropical species are large enough to trap rats and frogs.','The largest pitcher plants (Nepenthes rajah) hold 3.5 liters of fluid and have been found containing drowned rats, lizards, and even small birds.','Pitcher plants evolved carnivory independently at least 6 times in different plant families — Nepenthes, Sarracenia, Cephalotus, and others are not closely related.','Nepenthes is named after nepenthe, the drug of forgetfulness in Homer\'s Odyssey — perhaps because the plants were thought to cure sadness.','Some pitcher plants have evolved mutualistic relationships — Nepenthes lowii produces a sweet exudate that attracts tree shrews, which defecate into the pitcher, providing nitrogen.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Pitcher_plant'},{label:'ICPS',url:'https://www.carnivorousplants.org/'},{label:'Kew Gardens',url:'https://www.kew.org/'}] },
  'lotus': { altFacts:['The lotus effect — water rolls off lotus leaves carrying all dirt with it — inspired self-cleaning nanotechnology coatings worth billions in commercial applications.','Lotus seeds can remain viable for over 1,300 years — ancient seeds from a dry lake bed in China germinated successfully after more than a millennium of dormancy.','The sacred lotus (Nelumbo) is not a water lily — it belongs to its own family Nelumbonaceae, more closely related to sycamores and proteas.','The lotus is sacred in Buddhism (purity rising from muddy water), Hinduism (seat of Brahma), and ancient Egyptian religion (creation myth).','Lotus flowers are thermoregulatory — they maintain their temperature between 30-36°C even when ambient temperature drops to 10°C, attracting pollinators with warmth.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Nelumbo_nucifera'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'National Geographic',url:'https://www.nationalgeographic.com/science/article/lotus-effect'}] },
  'eucalyptus': { altFacts:['Eucalyptus trees are fire-adapted — their oil-rich leaves burn explosively, killing competing species, while the eucalyptus regrows from protected buds under its thick bark.','Eucalyptus oil is both antiseptic and insecticidal — koalas can eat toxic eucalyptus leaves only because they have specialized liver enzymes most mammals lack.','Eucalyptus is a myrtaceous tree (Myrtaceae), related to cloves, guava, and tea tree — the family is centered in the Southern Hemisphere.','The name comes from Greek eu (well) + kalyptos (covered), referring to the cap that covers flower buds before they open.','Eucalyptus was introduced to California in the 1850s gold rush and now covers 40,000+ acres — but in Australia, it is the dominant tree across 90% of forests.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Eucalyptus'},{label:'Australian National Botanic Gardens',url:'https://www.anbg.gov.au/'},{label:'CSIRO',url:'https://www.csiro.au/'}] },
  'coffee': { altFacts:['Coffee is the second most traded commodity on Earth after crude oil — over 2.25 billion cups are consumed daily worldwide.','Caffeine evolved as a natural insecticide — it paralyzes and kills herbivorous insects, but also boosts the memory of pollinating bees, encouraging return visits.','Coffee is a flowering plant in the family Rubiaceae, related to gardenias and quinine — there are 125+ species, but only 2 (arabica and robusta) dominate commercial production.','The word "coffee" traces from Arabic qahwa to Turkish kahve to Italian caffè — according to legend, an Ethiopian goatherd named Kaldi noticed his goats dancing after eating coffee berries.','Wild Arabica coffee is Endangered — climate change could make 60% of current growing areas unsuitable by 2050, threatening the genetic diversity needed to breed resilient varieties.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Coffee'},{label:'World Coffee Research',url:'https://worldcoffeeresearch.org/'},{label:'Royal Botanic Gardens Kew',url:'https://www.kew.org/'}] },
  'magnolia': { altFacts:['Magnolias are among the most ancient flowering plants — they appeared before bees existed and were originally pollinated by beetles, which is why their flowers are so tough and leathery.','Magnolia fossils date back 95 million years — they survived the K-Pg extinction that killed the dinosaurs and have barely changed since.','Magnolias are in the order Magnoliales — one of the most basal angiosperm lineages, diverging near the base of the flowering plant tree.','Named by Linnaeus in 1737 after French botanist Pierre Magnol, who invented the concept of plant families — a foundational idea in taxonomy.','Magnolia bark and flowers have been used in traditional Chinese medicine for over 2,000 years — modern research has identified honokiol, a compound with anti-inflammatory and anti-tumor properties.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Magnolia'},{label:'Magnolia Society International',url:'https://www.magnoliasociety.org/'},{label:'Missouri Botanical Garden',url:'https://www.missouribotanicalgarden.org/'}] },
  'acacia': { altFacts:['When an acacia is grazed, it releases ethylene gas that warns neighboring trees — within minutes, surrounding acacias increase tannin production to make their leaves bitter and toxic.','Acacias have symbiotic relationships with ants — the tree provides hollow thorns for nesting and nutritious nectar bodies; the ants attack any animal that touches the tree.','Acacias are legumes (Fabaceae), related to beans, peas, and clovers — many species fix nitrogen through root bacteria, enriching poor savanna soils.','The name comes from Greek akakia, from akis (thorn). The Ark of the Covenant was said to be made from acacia wood (shittim wood in Hebrew).','The iconic flat-topped acacia silhouette of the African savanna is shaped by browsing elephants and giraffes — removing the canopy species creates the umbrella form.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Acacia'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'African Wildlife Foundation',url:'https://www.awf.org/'}] },
  'cycad': { altFacts:['Cycads are living fossils — they dominated the Mesozoic landscape alongside dinosaurs and have survived virtually unchanged for 280 million years.','Despite resembling palms, cycads are gymnosperms more closely related to pine trees. Their seeds are often toxic, containing neurotoxins linked to ALS-like diseases.','Cycads are the only gymnosperms with motile (swimming) sperm — a primitive trait shared with ferns and mosses but lost in all other seed plants.','The name "cycad" comes from Greek kykas, a scribal error for koikas (palm) — Theophrastus mistakenly applied it, and the name stuck.','Cycads are the most threatened plant group on Earth — 63% of species are at risk of extinction, primarily from habitat loss and illegal collection.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Cycad'},{label:'IUCN Cycad Specialist Group',url:'https://www.iucn.org/commissions/ssc-groups/plants-fungi/plant-specialist-groups/cycad'},{label:'Montgomery Botanical Center',url:'https://www.montgomerybotanical.org/'}] },
  'corpse-flower': { altFacts:['The corpse flower (Amorphophallus titanum) produces the largest unbranched flower structure on Earth — up to 3 m tall — and smells like rotting flesh to attract carrion beetle pollinators.','It blooms only once every 7-10 years, and each bloom lasts just 24-48 hours — when a botanic garden\'s corpse flower opens, thousands of visitors line up.','Despite its size, the corpse flower is an aroid (Araceae), related to common houseplants like philodendrons and peace lilies.','The scientific name means "giant misshapen phallus" — Amorpho (misshapen) + phallus. Victorian botanists were both scandalized and fascinated.','The flower generates its own heat — the spadix warms to 36°C (human body temperature) to volatilize the stench chemicals and attract pollinators from over a kilometer away.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Amorphophallus_titanum'},{label:'Chicago Botanic Garden',url:'https://www.chicagobotanic.org/'},{label:'Kew Gardens',url:'https://www.kew.org/'}] },
  'strangler-fig': { altFacts:['Strangler figs germinate in the canopy, send roots down to the ground, then slowly envelop and kill their host tree — leaving a hollow lattice trunk when the host rots away.','Figs are keystone species in tropical forests — their asynchronous fruiting provides food year-round, sustaining over 1,200 bird and mammal species during lean periods.','Figs are in the mulberry family (Moraceae) — each of the 850+ Ficus species has its own specific fig wasp pollinator, a co-evolution spanning 80 million years.','The Bodhi tree under which the Buddha achieved enlightenment was a strangler fig (Ficus religiosa). Figs are sacred in Hinduism, Buddhism, and Islam.','Every fig fruit is actually an inside-out flower — the tiny flowers line the interior, pollinated by wasps that enter through a tiny pore and die inside.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Strangler_fig'},{label:'Smithsonian Tropical Research',url:'https://stri.si.edu/'},{label:'Mongabay',url:'https://news.mongabay.com/'}] },
  'welwitschia-2': { altFacts:['Welwitschia produces only two leaves in its entire lifetime — they grow continuously from the base and shred at the tips, creating a tangled mass that can span 4 meters.','Some Welwitschia plants are over 2,000 years old — they have survived in the Namib Desert since before the Roman Empire.','Welwitschia is a gymnosperm in its own order (Welwitschiales) — its closest relatives went extinct millions of years ago, making it a true living fossil.','Named after Friedrich Welwitsch, who discovered it in Angola in 1859 — he reportedly stood staring at it in disbelief, unsure if it was alive.','Welwitschia survives on fog — in a desert receiving less than 25 mm of rain annually, it absorbs moisture from Atlantic fog through stomata on its leaves.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Welwitschia'},{label:'Kew Gardens',url:'https://www.kew.org/'},{label:'Plantzafrica',url:'http://pza.sanbi.org/welwitschia-mirabilis'}] },
  'titan-sequoia': { altFacts:['Giant sequoias are the most massive living organisms on Earth — General Sherman weighs an estimated 1,487 tonnes, more than a fully loaded 747.','Their bark can be 90 cm thick and is nearly fireproof — giant sequoias actually need fire to reproduce, as heat opens their cones and clears competing vegetation.','Giant sequoias are conifers (family Cupressaceae), related to redwoods and junipers — the dawn redwood, thought extinct, was rediscovered alive in China in 1944.','The genus Sequoiadendron was named after Sequoyah, the Cherokee scholar who created the Cherokee syllabary — one of the few trees named after a specific person.','Giant sequoias can live over 3,000 years. They grow in only 77 groves on the western slope of the Sierra Nevada — nowhere else on Earth.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Sequoiadendron_giganteum'},{label:'National Park Service',url:'https://www.nps.gov/seki/'},{label:'Save the Redwoods League',url:'https://www.savetheredwoods.org/'}] },
  'sensitive-fern': { altFacts:['Sensitive ferns collapse their fronds at the first frost — the "sensitive" name refers to cold sensitivity, not touch (unlike Mimosa pudica).','Their fertile fronds have bead-like structures that persist through winter, releasing spores in spring — these dried structures are often used in flower arrangements.','Sensitive ferns are true ferns (Onocleaceae) — they reproduce via spores, not seeds, and have a two-stage life cycle with a tiny heart-shaped gametophyte.','The genus Onoclea comes from Greek onos (vessel) + kleio (to close), referring to the tightly rolled fertile pinnae.','Sensitive ferns are living fossils — fossil fronds from 57 million years ago are virtually identical to modern plants.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Onoclea_sensibilis'},{label:'USDA Plants',url:'https://plants.usda.gov/'},{label:'Lady Bird Johnson Wildflower Center',url:'https://www.wildflower.org/'}] },
  'resurrection-fern': { altFacts:['Resurrection ferns can lose 97% of their water content and appear completely dead — then fully revive within hours of rainfall, uncurling green fronds as if nothing happened.','They survive desiccation by folding their fronds inward and producing trehalose, a sugar that replaces water around cell membranes and prevents structural collapse.','Resurrection ferns are true ferns (Polypodiaceae) — epiphytes that grow on tree branches, especially live oaks in the American Southeast.','NASA took resurrection ferns to space aboard Discovery in 1997 to study how their cells recover from extreme dehydration — relevant to long-duration space travel.','The species name Pleopeltis polypodioides literally means "many-footed shield fern" — referring to the shield-like scales that cover the underside.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Pleopeltis_polypodioides'},{label:'University of Florida',url:'https://edis.ifas.ufl.edu/'},{label:'NASA',url:'https://www.nasa.gov/'}] },
  'bioluminescent-dino': { altFacts:['Bioluminescent dinoflagellates create the glowing blue waves seen in tropical bays — each cell produces a flash when mechanically disturbed, turning breaking waves into liquid light.','A single liter of bioluminescent bay water can contain over 700,000 dinoflagellates — each one a tiny chemical flashlight powered by luciferin and luciferase.','Dinoflagellates are alveolate protists — closely related to the malaria parasite Plasmodium and to ciliates like Paramecium.','The name "dinoflagellate" comes from Greek dinos (whirling) + Latin flagellum (whip), describing their spinning motion from two whip-like flagella.','Some dinoflagellates produce harmful algal blooms (red tides) that kill fish and make shellfish toxic — yet others are essential symbionts inside coral cells, providing 90% of the coral\'s energy.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Dinoflagellate'},{label:'Smithsonian Ocean',url:'https://ocean.si.edu/ocean-life/plankton/bioluminescence'},{label:'NOAA',url:'https://oceanservice.noaa.gov/facts/biolum.html'}] },
  'fly-agaric': { altFacts:['The fly agaric (Amanita muscaria) is the most iconic mushroom on Earth — its red cap with white spots appears in fairy tales, video games (Super Mario), and Christmas decorations worldwide.','It contains muscimol and ibotenic acid — psychoactive compounds that cause hallucinations, euphoria, and the sensation of size distortion (possibly inspiring Alice in Wonderland).','Fly agaric is a basidiomycete in the genus Amanita — related to the deadly death cap, but also to delicious Caesar\'s mushroom (A. caesarea).','The name "fly agaric" comes from its traditional use as an insecticide — pieces soaked in milk attract and kill flies.','Siberian shamans consumed fly agaric for spiritual rituals. Reindeer also eat it deliberately — some researchers hypothesize this inspired flying reindeer legends.'], links:[{label:'Wikipedia',url:'https://en.wikipedia.org/wiki/Amanita_muscaria'},{label:'First Nature',url:'https://www.first-nature.com/fungi/amanita-muscaria.php'},{label:'Kew Gardens',url:'https://www.kew.org/'}] },
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
  'luca':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg/960px-Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg', credit:'NOAA/Wikipedia, CC BY 2.0'},
  'bacteria':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Bacteria_collage.jpg/960px-Bacteria_collage.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'cyanobacteria':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Simplefilaments022_Anabaena.jpg/960px-Simplefilaments022_Anabaena.jpg', credit:'Kristian Peters, CC BY-SA 3.0'},
  'proteobacteria':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/E._coli_Bacteria_%287316101966%29.jpg/960px-E._coli_Bacteria_%287316101966%29.jpg', credit:'NIAID, CC BY 2.0'},
  'ecoli':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/E._coli_Bacteria_%287316101966%29.jpg/960px-E._coli_Bacteria_%287316101966%29.jpg', credit:'NIAID, CC BY 2.0'},
  'helicobacter':          {url:'https://upload.wikimedia.org/wikipedia/commons/d/d6/EMpylori.jpg', credit:'Yutaka Tsutsumi, CC BY 2.5'},
  'vibrio-cholerae':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Cholera_bacteria_SEM.jpg/960px-Cholera_bacteria_SEM.jpg', credit:'Tom Kirn/Louisa Howard, Public Domain'},
  'firmicutes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Lactobacillus_acidophilus_SEM.jpg/960px-Lactobacillus_acidophilus_SEM.jpg', credit:'Bob Blaylock, CC BY-SA 3.0'},
  'lactobacillus':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Lactobacillus_acidophilus_SEM.jpg/960px-Lactobacillus_acidophilus_SEM.jpg', credit:'Bob Blaylock, CC BY-SA 3.0'},
  'clostridium-botulinum': {url:'https://upload.wikimedia.org/wikipedia/commons/f/f0/Clostridium_botulinum.jpg', credit:'CDC, Public Domain'},
  'actinobacteria':        {url:'https://upload.wikimedia.org/wikipedia/commons/9/9d/Streptomyces_coelicolor.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'streptomyces':          {url:'https://upload.wikimedia.org/wikipedia/commons/9/9d/Streptomyces_coelicolor.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'mycobacterium-tb':      {url:'https://upload.wikimedia.org/wikipedia/commons/0/0a/TB_Culture.jpg', credit:'CDC, Public Domain'},
  'deinococcus':           {url:'https://upload.wikimedia.org/wikipedia/commons/7/73/Deinococcus_radiodurans.jpg', credit:'Michael Daly, Public Domain'},
  'bacteroides':           {url:'https://upload.wikimedia.org/wikipedia/commons/6/6d/BacteroidesFragilis_Gram.jpg', credit:'CDC, Public Domain'},
  'prochlorococcus':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Prochlorococcus_SEM.png/960px-Prochlorococcus_SEM.png', credit:'Luke Thompson/Chisholm Lab, CC BY 2.5'},
  // Archaea
  'archaea':               {url:'https://upload.wikimedia.org/wikipedia/commons/a/a1/Halobacteria.jpg', credit:'NASA, Public Domain'},
  'halobacterium':         {url:'https://upload.wikimedia.org/wikipedia/commons/a/a1/Halobacteria.jpg', credit:'NASA, Public Domain'},
  'sulfolobus':            {url:'https://upload.wikimedia.org/wikipedia/commons/2/2f/Fmicb-03-00295-g001.jpg', credit:'Dr. Wolfram Zillig, Public Domain'},
  'pyrolobus':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg/960px-Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg', credit:'NOAA, CC BY 2.0'},
  'lokiarchaeota':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Champagne_vent_white_smokers.jpg/960px-Champagne_vent_white_smokers.jpg', credit:'NOAA, Public Domain'},
  // Fungi
  'fungi':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/960px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'ascomycetes':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/S_cerevisiae_under_DIC_microscopy.jpg/960px-S_cerevisiae_under_DIC_microscopy.jpg', credit:'Masur, Public Domain'},
  'saccharomyces':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/S_cerevisiae_under_DIC_microscopy.jpg/960px-S_cerevisiae_under_DIC_microscopy.jpg', credit:'Masur, Public Domain'},
  'penicillium':           {url:'https://upload.wikimedia.org/wikipedia/commons/c/c9/Penicillium_chrysogenum.jpg', credit:'Ajc1, CC BY-SA 3.0'},
  'basidiomycetes':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/960px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'amanita-muscaria':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/960px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'armillaria':            {url:'https://upload.wikimedia.org/wikipedia/commons/a/ab/Armillaria_ostoyae.jpg', credit:'USFS, Public Domain'},
  'psilocybe':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Psilocybe_Cubensis_Imire_%28Psilocybe_Cubensis_Zimbabwe%29_2.jpg/960px-Psilocybe_Cubensis_Imire_%28Psilocybe_Cubensis_Zimbabwe%29_2.jpg', credit:'Workman, CC BY-SA 3.0'},
  'chytrids':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ranoidea_caerulea_-_Wilhelma_01.jpg/960px-Ranoidea_caerulea_-_Wilhelma_01.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'batrachochytrium':      {url:'https://upload.wikimedia.org/wikipedia/commons/a/a5/Batrachochytrium_dendrobatidis.jpg', credit:'Dr. Alex Hyatt, CSIRO, CC BY 3.0'},
  // Plants
  'viridiplantae':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/960px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'mosses':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sphagnum_Moss.jpg/960px-Sphagnum_Moss.jpg', credit:'Bff, CC BY-SA 3.0'},
  'sphagnum':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sphagnum_Moss.jpg/960px-Sphagnum_Moss.jpg', credit:'Bff, CC BY-SA 3.0'},
  'liverworts':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Marchantia_polymorpha.jpg/960px-Marchantia_polymorpha.jpg', credit:'Hermann Schachner, CC0'},
  'marchantia':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Marchantia_polymorpha.jpg/960px-Marchantia_polymorpha.jpg', credit:'Hermann Schachner, CC0'},
  'angiosperms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/960px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'sunflower':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/960px-Sunflower_sky_backdrop.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'arabidopsis':           {url:'https://upload.wikimedia.org/wikipedia/commons/6/6f/Arabidopsis_thaliana.jpg', credit:'Nikolai Sitnov, Public Domain'},
  'rafflesia':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Rafflesia_arnoldii_-_Choix_des_plantes_rares_ou_nouvelles_-_plate_01_%281864%29.jpg/960px-Rafflesia_arnoldii_-_Choix_des_plantes_rares_ou_nouvelles_-_plate_01_%281864%29.jpg', credit:'Rendra Regen Rais, CC BY 2.0'},
  'titan-arum':            {url:'https://upload.wikimedia.org/wikipedia/commons/8/84/Titan_arum_in_bloom_at_the_Nashville_Zoo_October_2020.jpg', credit:'Rhett A. Butler, CC BY 2.5'},
  'mimosa':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Close-up_of_Sensitive_Plant_%28Mimosa_pudica%29_Leaves_at_Night.jpg/960px-Close-up_of_Sensitive_Plant_%28Mimosa_pudica%29_Leaves_at_Night.jpg', credit:'Hrushikesh, CC BY-SA 3.0'},
  'gymnosperms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/General_Sherman_tree_looking_up.jpg/960px-General_Sherman_tree_looking_up.jpg', credit:'Jim Bahn, CC BY 2.0'},
  'wollemi-pine':          {url:'https://upload.wikimedia.org/wikipedia/commons/5/5d/Wollemia_bark.JPG', credit:'Brent Miller, CC BY 2.0'},
  'welwitschia':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Welwitschia_mirabilis2.jpg/960px-Welwitschia_mirabilis2.jpg', credit:'Thomas Schoch, CC BY-SA 2.5'},
  'sequoia':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/General_Sherman_tree_looking_up.jpg/960px-General_Sherman_tree_looking_up.jpg', credit:'Jim Bahn, CC BY 2.0'},
  'ferns':                 {url:'https://upload.wikimedia.org/wikipedia/commons/1/11/Cyathea_cooperi.jpg', credit:'Photohound, CC BY-SA 3.0'},
  'tree-fern':             {url:'https://upload.wikimedia.org/wikipedia/commons/1/11/Cyathea_cooperi.jpg', credit:'Photohound, CC BY-SA 3.0'},
  'azolla':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Azolla_caroliniana.jpg/960px-Azolla_caroliniana.jpg', credit:'Christian Fischer, CC BY-SA 3.0'},
  // Animals
  'metazoa':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Turritopsis_nutricula_Kamo.jpg/960px-Turritopsis_nutricula_Kamo.jpg', credit:'Bachware, Public Domain'},
  'porifera':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Coral_reef_at_palmyra.jpg/960px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'cnidaria':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Turritopsis_nutricula_Kamo.jpg/960px-Turritopsis_nutricula_Kamo.jpg', credit:'Bachware, Public Domain'},
  'turritopsis':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Turritopsis_nutricula_Kamo.jpg/960px-Turritopsis_nutricula_Kamo.jpg', credit:'Bachware, Public Domain'},
  'coral-reef':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Coral_reef_at_palmyra.jpg/960px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'arthropoda':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Odontodactylus_scyllarus.jpg/960px-Odontodactylus_scyllarus.jpg', credit:'Roy Caldwell, Public Domain'},
  'insecta':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/960px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'honey-bee':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/960px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'leafcutter-ant':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Atta_cephalotes-pjt.jpg/960px-Atta_cephalotes-pjt.jpg', credit:'Bandmann, CC BY-SA 3.0'},
  'mantis-shrimp':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Odontodactylus_scyllarus.jpg/960px-Odontodactylus_scyllarus.jpg', credit:'Roy Caldwell, Public Domain'},
  'horseshoe-crab':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Horseshoe_Crab_Returning_To_Sea_After_Spawning_Per_%28111773087%29.jpeg/960px-Horseshoe_Crab_Returning_To_Sea_After_Spawning_Per_%28111773087%29.jpeg', credit:'Steve Droter/CBF, CC BY 2.0'},
  'platyhelminthes':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Schmidtea_polychroa.jpg/960px-Schmidtea_polychroa.jpg', credit:'Alejandro Sánchez Alvarado, CC BY 2.5'},
  'planarian':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Schmidtea_polychroa.jpg/960px-Schmidtea_polychroa.jpg', credit:'Alejandro Sánchez Alvarado, CC BY 2.5'},
  'tardigrada':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png/960px-SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png', credit:'Schokraie et al., CC BY 2.5'},
  'mollusca':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Octopus3.jpg/960px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'cephalopods':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Octopus3.jpg/960px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'octopus':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Octopus3.jpg/960px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'octopus-day':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Octopus3.jpg/960px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'nautilus':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Nautilus_pompilius_3.jpg/960px-Nautilus_pompilius_3.jpg', credit:'Profberger, CC BY-SA 4.0'},
  'echinodermata':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Coral_reef_at_palmyra.jpg/960px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'chordata':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg/960px-Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg', credit:'Citron, CC BY-SA 3.0'},
  'sarcopterygii':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg/960px-Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg', credit:'Citron, CC BY-SA 3.0'},
  'chondrichthyes':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'actinopterygii':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg/960px-Clown_fish_in_the_Andaman_Coral_Reef.jpg', credit:'Ritiks, CC BY-SA 3.0'},
  'fish':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'sharks':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'white-shark':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'coelacanth':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg/960px-Latimeria_chalumnae_%28model%29_%28coelacanth%29_2_%2815717251761%29.jpg', credit:'Citron, CC BY-SA 3.0'},
  'amphibia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ranoidea_caerulea_-_Wilhelma_01.jpg/960px-Ranoidea_caerulea_-_Wilhelma_01.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'reptilia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg/960px-Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'komodo-dragon':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg/960px-Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'tuatara':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sphenodon_punctatus_in_Waikanae%2C_New_Zealand.jpg/960px-Sphenodon_punctatus_in_Waikanae%2C_New_Zealand.jpg', credit:'KeresH, CC BY-SA 3.0'},
  'aves':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Falco_peregrinus_-_01.jpg/960px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'birds':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Falco_peregrinus_-_01.jpg/960px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'archaeopteryx':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Archaeopteryx_lithographica_%28Berlin_specimen%29.jpg/960px-Archaeopteryx_lithographica_%28Berlin_specimen%29.jpg', credit:'H. Raab, CC BY-SA 3.0'},
  'peregrine-falcon':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Falco_peregrinus_-_01.jpg/960px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'mammalia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Humpback_whales_in_singing_position.jpg/960px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'cetaceans':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Humpback_whales_in_singing_position.jpg/960px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'blue-whale':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg/960px-Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg', credit:'NOAA, Public Domain'},
  'naked-mole-rat':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Model_of_naked_mole-rat_soldiers%2C_workers%2C_and_queen.jpg/960px-Model_of_naked_mole-rat_soldiers%2C_workers%2C_and_queen.jpg', credit:'Jedimentat44, CC BY 2.0'},
  'platypus':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Duck-billed_platypus_%28Ornithorhynchus_anatinus%29_Scottsdale.jpg/960px-Duck-billed_platypus_%28Ornithorhynchus_anatinus%29_Scottsdale.jpg', credit:'Stefan Kraft, CC BY-SA 3.0'},
  'african-elephant':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/960px-African_Bush_Elephant.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  // Primates & great apes
  'primates':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/A_chimpanzee_at_the_Kumasi_Zoo.jpg/960px-A_chimpanzee_at_the_Kumasi_Zoo.jpg', credit:'Thomas Lersch, CC BY-SA 3.0'},
  'great-apes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Evidence_as_to_Man%27s_Place_in_Naturep2.jpg/960px-Evidence_as_to_Man%27s_Place_in_Naturep2.jpg', credit:'T.H. Huxley (1863), Public Domain'},
  'gorilla':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Gorilla_Male_Global.jpg/960px-Gorilla_Male_Global.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'orangutan':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Orang_Utan%2C_Semenggok_Forest_Reserve%2C_Sarawak%2C_Borneo%2C_Malaysia.JPG/960px-Orang_Utan%2C_Semenggok_Forest_Reserve%2C_Sarawak%2C_Borneo%2C_Malaysia.JPG', credit:'Thorsten Bachner, CC BY-SA 3.0'},
  'chimpanzee':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/A_chimpanzee_at_the_Kumasi_Zoo.jpg/960px-A_chimpanzee_at_the_Kumasi_Zoo.jpg', credit:'Thomas Lersch, CC BY-SA 3.0'},
  'homo-sapiens':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Woman_from_Akha_tribe.jpg/960px-Woman_from_Akha_tribe.jpg', credit:'Steve Evans, CC BY 2.0'},
  // Protists
  'protists':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Diatoms_through_the_microscope.jpg/960px-Diatoms_through_the_microscope.jpg', credit:'Wipeter, CC BY-SA 3.0'},
  'alveolates':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ceratium_tripos.jpg/960px-Ceratium_tripos.jpg', credit:'NOAA, Public Domain'},
  'plasmodium':            {url:'https://upload.wikimedia.org/wikipedia/commons/f/fc/Plasmodium_falciparum_01.png', credit:'CDC, Public Domain'},
  'dinoflagellates':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ceratium_tripos.jpg/960px-Ceratium_tripos.jpg', credit:'NOAA, Public Domain'},
  'diatoms':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Diatoms_through_the_microscope.jpg/960px-Diatoms_through_the_microscope.jpg', credit:'Wipeter, CC BY-SA 3.0'},
  'phytophthora':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tomato_with_Phytophthora_infestans_%28late_blight%29.jpg/960px-Tomato_with_Phytophthora_infestans_%28late_blight%29.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'amoeba':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Amoeba_proteus_with_many_pseudopodia.jpg/960px-Amoeba_proteus_with_many_pseudopodia.jpg', credit:'Deuterostome, CC BY-SA 3.0'},
  'volvox':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Volvox_aureus_3_Ansichten.jpg/960px-Volvox_aureus_3_Ansichten.jpg', credit:'Frank Fox, CC BY-SA 3.0'},
  // Hominin fossils
  'homo-naledi':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Homo_naledi_cranial_paratypes.jpg/960px-Homo_naledi_cranial_paratypes.jpg', credit:'Lee Roger Berger, CC BY 4.0'},
  'h_naledi':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Homo_naledi_cranial_paratypes.jpg/960px-Homo_naledi_cranial_paratypes.jpg', credit:'Lee Roger Berger, CC BY 4.0'},
  'homo-floresiensis':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Homo_floresiensis_cave.jpg/960px-Homo_floresiensis_cave.jpg', credit:'Rosino, CC BY-SA 2.0'},
  'h_floresiensis':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Homo_floresiensis_cave.jpg/960px-Homo_floresiensis_cave.jpg', credit:'Rosino, CC BY-SA 2.0'},
  'h_luzonensis':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Callao_Eco_Tourism_Zone.jpg/960px-Callao_Eco_Tourism_Zone.jpg', credit:'Judgefloro, CC0'},
  'denisovan':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Denisova_cave_01.jpg/960px-Denisova_cave_01.jpg', credit:'Демин Алексей Барнаул, CC BY-SA 3.0'},
  'h_neanderthalensis':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Homo_neanderthalensis.jpg/960px-Homo_neanderthalensis.jpg', credit:'Erich Ferdinand, CC BY 2.0'},
  'h_erectus':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Turkana_Boy_at_Nairobi_National_Museum.jpg/960px-Turkana_Boy_at_Nairobi_National_Museum.jpg', credit:'Locutus Borg, CC BY-SA 3.0'},
  'h_heidelbergensis':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Homo_heidelbergensis.004_-_Domus_%28A_Coru%C3%B1a%29.jpg/960px-Homo_heidelbergensis.004_-_Domus_%28A_Coru%C3%B1a%29.jpg', credit:'Cicero Moraes, CC BY-SA 3.0'},
  'h_habilis':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Homo_habilis.jpg/960px-Homo_habilis.jpg', credit:'Lillyundfreya, CC BY-SA 2.5'},
  'au_afarensis':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Lucy_Skeleton.jpg/960px-Lucy_Skeleton.jpg', credit:'Cleveland Museum, CC BY 4.0'},
  'au_africanus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Australopithecus_africanus_-_Cast_of_taung_child.jpg/960px-Australopithecus_africanus_-_Cast_of_taung_child.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'sahelanthropus':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg/960px-Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg', credit:'Didier Descouens, CC BY-SA 4.0'},
  'ardipithecus_r':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ardipithecus_ramidus.jpg/960px-Ardipithecus_ramidus.jpg', credit:'Science, Educational use'},
  // ── Tree node ID aliases (correcting naming mismatches) ──
  'plantae':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/960px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'mimosa-pudica':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Close-up_of_Sensitive_Plant_%28Mimosa_pudica%29_Leaves_at_Night.jpg/960px-Close-up_of_Sensitive_Plant_%28Mimosa_pudica%29_Leaves_at_Night.jpg', credit:'Hrushikesh, CC BY-SA 3.0'},
  'wollemia':              {url:'https://upload.wikimedia.org/wikipedia/commons/5/5d/Wollemia_bark.JPG', credit:'Brent Miller, CC BY 2.0'},
  'animalia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Invertebrate_montage_%282022%29.jpg/960px-Invertebrate_montage_%282022%29.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'insects':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/960px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'shark':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'reptiles':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg/960px-Komodo_Dragons_in_the_wild_on_Rinca_island_Indonesia..jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'amphibians':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ranoidea_caerulea_-_Wilhelma_01.jpg/960px-Ranoidea_caerulea_-_Wilhelma_01.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'mammals':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Humpback_whales_in_singing_position.jpg/960px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'cnidarians':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Turritopsis_nutricula_Kamo.jpg/960px-Turritopsis_nutricula_Kamo.jpg', credit:'Bachware, Public Domain'},
  'echinoderms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Echinoderm_collage_2.jpg/960px-Echinoderm_collage_2.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'coral':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Coral_reef_at_palmyra.jpg/960px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'amoeba-proteus':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Amoeba_proteus_with_many_pseudopodia.jpg/960px-Amoeba_proteus_with_many_pseudopodia.jpg', credit:'Deuterostome, CC BY-SA 3.0'},
  'neanderthal':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Homo_neanderthalensis.jpg/960px-Homo_neanderthalensis.jpg', credit:'Erich Ferdinand, CC BY 2.0'},
  'denisovans':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Denisova_cave_01.jpg/960px-Denisova_cave_01.jpg', credit:'Демин Алексей Барнаул, CC BY-SA 3.0'},
  'h_sapiens':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Woman_from_Akha_tribe.jpg/960px-Woman_from_Akha_tribe.jpg', credit:'Steve Evans, CC BY 2.0'},
  // ── New entries for previously missing tree nodes ──
  'nostoc':                {url:'https://upload.wikimedia.org/wikipedia/commons/c/c8/Nostoc_commune.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'spirochetes':           {url:'https://upload.wikimedia.org/wikipedia/commons/2/29/Treponema_pallidum.jpg', credit:'CDC, Public Domain'},
  'euryarchaeota':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Thermococcus_gammatolerans.jpg/960px-Thermococcus_gammatolerans.jpg', credit:'Xaviermartin, CC BY-SA 3.0'},
  'asgard':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Blacksmoker_in_Atlantic_Ocean.jpg/960px-Blacksmoker_in_Atlantic_Ocean.jpg', credit:'NOAA/P. Rona, OAR/NURP, Public Domain'},
  'eukaryota':             {url:'https://upload.wikimedia.org/wikipedia/commons/c/ce/Rhodomonas_salina_CCMP_322_%28cropped%29.jpg', credit:'Javier Arístegui, CC BY 4.0'},
  'bryophytes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/MarchantiophytaSp.NonD%C3%A9termin%C3%A9eFL3.jpg/960px-MarchantiophytaSp.NonD%C3%A9termin%C3%A9eFL3.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'invertebrates':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Invertebrate_montage_%282022%29.jpg/960px-Invertebrate_montage_%282022%29.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'vertebrates':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Vertebrata_002.png/960px-Vertebrata_002.png', credit:'Wikipedia, CC BY-SA 3.0'},
  'annelids':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Annelida_collage_%282%29.png/960px-Annelida_collage_%282%29.png', credit:'Wikipedia, CC BY-SA 4.0'},
  'hominini':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Mrs_Ples_Face.jpg/960px-Mrs_Ples_Face.jpg', credit:'Jose Braga, CC BY-SA 4.0'},
  'amoebozoa':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Leocarpus_fragilis_10649909.jpg/960px-Leocarpus_fragilis_10649909.jpg', credit:'Zack Abbey, CC BY 4.0'},
  'paramecium':            {url:'https://upload.wikimedia.org/wikipedia/commons/c/cb/Paramecium.jpg', credit:'Barfooz, CC BY-SA 3.0'},
  'stramenopiles':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Stramenopiles_diversity.png/960px-Stramenopiles_diversity.png', credit:'Wikipedia, CC BY-SA 4.0'},
  // ── Missing hominin fossil entries ──
  'orrorin':               {url:'https://upload.wikimedia.org/wikipedia/commons/d/d1/Orrorin_tugenensis.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'kenyanthropus':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Kenyanthropus_platyops-MGL_95210-P5030042-white.jpg/960px-Kenyanthropus_platyops-MGL_95210-P5030042-white.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'au_anamensis':          {url:'https://upload.wikimedia.org/wikipedia/commons/2/24/Australopithecus_anamensis_skull.png', credit:'Wikipedia, CC BY-SA 4.0'},
  'au_bahrelghazali':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Abel_australopithecus.png/960px-Abel_australopithecus.png', credit:'Wikipedia, CC BY-SA 3.0'},
  'au_deyiremeda':         {url:'https://upload.wikimedia.org/wikipedia/commons/3/31/Australopithecus_deyiremeda.png', credit:'Wikipedia, CC BY-SA 4.0'},
  'au_prometheus':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Australopithecus_africanus_-_Cast_of_taung_child.jpg/960px-Australopithecus_africanus_-_Cast_of_taung_child.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'au_garhi':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Resti_di_australopithecus_garhi%2C_da_bouri_in_afar%2C_2%2C5_milioni_di_anni_fa.jpg/960px-Resti_di_australopithecus_garhi%2C_da_bouri_in_afar%2C_2%2C5_milioni_di_anni_fa.jpg', credit:'Sailko, CC BY-SA 3.0'},
  'au_sediba':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Australopithecus_sediba.JPG/960px-Australopithecus_sediba.JPG', credit:'Brett Eloff, CC BY-SA 3.0'},
  'par_aethiopicus':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Paranthropus_aethiopicus.JPG/960px-Paranthropus_aethiopicus.JPG', credit:'Wikipedia, CC BY-SA 3.0'},
  'par_robustus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Original_of_Paranthropus_robustus_Face.jpg/960px-Original_of_Paranthropus_robustus_Face.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'par_boisei':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Australophithecus_boisei_%28cast%29%2C_Olduvai_Gorge_-_Springfield_Science_Museum_-_Springfield%2C_MA_-_DSC03368.JPG/960px-Australophithecus_boisei_%28cast%29%2C_Olduvai_Gorge_-_Springfield_Science_Museum_-_Springfield%2C_MA_-_DSC03368.JPG', credit:'Daderot, CC0'},
  'h_rudolfensis':         {url:'https://upload.wikimedia.org/wikipedia/commons/4/44/KNM_ER_1470_%28H._rudolfensis%29.png', credit:'Wikipedia, CC BY-SA 4.0'},
  'h_bodoensis':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Rhodesian_Man.jpg/960px-Rhodesian_Man.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'h_antecessor':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Reproducciones_del_cr%C3%A1neo_%28frontal_ATD6-15_%29_y_mand%C3%ADbula_%28parte_del_esqueleto_facial_ATD6-69%29_del_Ni%C3%B1o_de_la_Gran_Dolina_%28Hom%C3%ADnido_3%29._Museo_Arqueol%C3%B3gico_Nacional_de_Espa%C3%B1a.jpg/960px-thumbnail.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'h_longi':               {url:'https://upload.wikimedia.org/wikipedia/commons/9/95/Homo_longi_holotype.jpg', credit:'Kai Geng, CC BY 4.0'},
  // ── Remaining missing nodes ──
  'methanobacterium':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Sn%C3%ADmek_ze_skenovac%C3%ADho_elektronov%C3%A9ho_mikroskopu_Methanobacterium_formicicum.jpg/960px-Sn%C3%ADmek_ze_skenovac%C3%ADho_elektronov%C3%A9ho_mikroskopu_Methanobacterium_formicicum.jpg', credit:'Wikipedia, CC BY-SA 4.0'},
  'group-proto':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg/960px-Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg', credit:'Didier Descouens, CC BY-SA 4.0'},
  'group-australopith':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Mrs_Ples_Face.jpg/960px-Mrs_Ples_Face.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'group-paranthropus':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Original_of_Paranthropus_robustus_Face.jpg/960px-Original_of_Paranthropus_robustus_Face.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'group-homo':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Woman_from_Akha_tribe.jpg/960px-Woman_from_Akha_tribe.jpg', credit:'Steve Evans, CC BY 2.0'},
  // ── P32 EXPANSION SPECIES ──
  'venus-flytrap':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Venus_Flytrap_showing_trigger_hairs.jpg/960px-Venus_Flytrap_showing_trigger_hairs.jpg', credit:'NoahElhardt, CC BY 2.5'},
  'baobab':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Adansonia_grandidieri04.jpg/960px-Adansonia_grandidieri04.jpg', credit:'Bernard Gagnon, CC BY-SA 3.0'},
  'ginkgo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Ginkgo_biloba_MHNT.BOT.2010.13.1.jpg/960px-Ginkgo_biloba_MHNT.BOT.2010.13.1.jpg', credit:'Joe Mabel, CC BY-SA 3.0'},
  'orchid':                {url:'https://upload.wikimedia.org/wikipedia/commons/f/f5/Ophrys_apifera_flower1.jpg', credit:'BerndH, CC BY-SA 3.0'},
  'sunflower':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/960px-Sunflower_sky_backdrop.jpg', credit:'Kevin Connors, Public Domain'},
  'cordyceps':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Cordyceps_sinensis.jpg/960px-Cordyceps_sinensis.jpg', credit:'Biodiversity Heritage Library, Public Domain'},
  'death-cap':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Amanita_phalloides_1.JPG/960px-Amanita_phalloides_1.JPG', credit:'Archenzo, CC BY-SA 3.0'},
  'tardigrade':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png/960px-SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png', credit:'Schokraie et al., CC BY 2.5'},
  'monarch-butterfly':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Monarch_In_May.jpg/960px-Monarch_In_May.jpg', credit:'Kenneth Dwain Harrelson, CC BY-SA 3.0'},
  'golden-orb-spider':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Nephila_clavipes_2004.JPG/960px-Nephila_clavipes_2004.JPG', credit:'Judy Gallagher, CC BY 2.0'},
  'giant-squid':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Giant_squid_melb_aquarium03.jpg/960px-Giant_squid_melb_aquarium03.jpg', credit:'Mgiganteus, CC BY-SA 3.0'},
  'box-jellyfish':         {url:'https://upload.wikimedia.org/wikipedia/commons/3/3a/Avispa_marina.jpg', credit:'Guido Gautsch, CC BY-SA 2.0'},
  'axolotl':               {url:'https://upload.wikimedia.org/wikipedia/commons/6/60/Ambystoma_mexicanum.jpg', credit:'th1098, CC BY-SA 2.0'},
  'golden-poison-frog':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Golden_Poison_dart_frog_Phyllobates_terribilis.jpg/960px-Golden_Poison_dart_frog_Phyllobates_terribilis.jpg', credit:'Wilfried Berns, CC BY-SA 2.0 DE'},
  'whale-shark':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Whale_shark_Georgia_aquarium.jpg/960px-Whale_shark_Georgia_aquarium.jpg', credit:'Zac Wolf, CC BY-SA 2.5'},
  'seahorse':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Long-snouted_Seahorse_-_Hippocampus_guttulatus.jpg/960px-Long-snouted_Seahorse_-_Hippocampus_guttulatus.jpg', credit:'Florin DUMITRESCU, CC BY-SA 4.0'},
  'anglerfish':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Lophius_piscatorius_MHNT.jpg/960px-Lophius_piscatorius_MHNT.jpg', credit:'Didier Descouens, CC BY-SA 4.0'},
  'manta-ray':             {url:'https://upload.wikimedia.org/wikipedia/commons/d/df/Manta_birostris-Thailand4.jpg', credit:'Jon Hanson, CC BY-SA 2.0'},
  'emperor-penguin':       {url:'https://upload.wikimedia.org/wikipedia/commons/0/07/Emperor_Penguin_Manchot_empereur.jpg', credit:'Samuel Blanc, CC BY-SA 3.0'},
  'wandering-albatross':   {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Diomedea_exulans_in_flight_-_SE_Tasmania.jpg/960px-Diomedea_exulans_in_flight_-_SE_Tasmania.jpg', credit:'JJ Harrison, CC BY-SA 3.0'},
  'bald-eagle':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg/960px-Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg', credit:'Andy Morffew, CC BY 2.0'},
  'kakapo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Kakapo_Sirocco_1.jpg/960px-Kakapo_Sirocco_1.jpg', credit:'Department of Conservation, CC BY 2.0'},
  'african-elephant':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/960px-African_Bush_Elephant.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'tiger':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/960px-Cat03.jpg', credit:'S. Taheri, CC BY-SA 3.0'},
  'lion':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/960px-Lion_waiting_in_Namibia.jpg', credit:'Kevin Pluck, CC BY 2.0'},
  'wolf':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Canis_lupus_laying_in_grass.jpg/960px-Canis_lupus_laying_in_grass.jpg', credit:'Retron, CC BY-SA 3.0'},
  'polar-bear':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Ursus_maritimus_Steve_Amstrup.jpg/960px-Ursus_maritimus_Steve_Amstrup.jpg', credit:'Steve Amstrup/USGS, Public Domain'},
  'pangolin':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Tree_Pangolin.JPG/960px-Tree_Pangolin.JPG', credit:'David Brossard, CC BY-SA 2.0'},
  'giraffe':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/960px-Giraffe_Mikumi_National_Park.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'koala':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Koala_climbing_tree.jpg/960px-Koala_climbing_tree.jpg', credit:'David Iliff, CC BY-SA 3.0'},
  'snow-leopard':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Irbis4.JPG/960px-Irbis4.JPG', credit:'Bernard Landgraf, CC BY-SA 3.0'},
  'orca':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Killerwhales_jumping.jpg/960px-Killerwhales_jumping.jpg', credit:'Robert Pitman, Public Domain'},
  'red-panda':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/RedPandaFullBody.JPG/960px-RedPandaFullBody.JPG', credit:'Greg Hume, CC BY-SA 3.0'},
  'bonobo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Apeldoorn_Apenheul_zoo_Bonobo.jpg/960px-Apeldoorn_Apenheul_zoo_Bonobo.jpg', credit:'Ltshears, CC BY-SA 3.0'},
  'saltwater-crocodile':   {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Crocodylus_porosus_-_Wilhelma.jpg/960px-Crocodylus_porosus_-_Wilhelma.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'green-sea-turtle':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Green_turtle_swimming_over_coral_reefs_in_Kona.jpg/960px-Green_turtle_swimming_over_coral_reefs_in_Kona.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'king-cobra':            {url:'https://upload.wikimedia.org/wikipedia/commons/3/33/Ophiophagus_hannah2.jpg', credit:'Michael Allen Smith, CC BY-SA 2.0'},
  'chameleon':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cameleon_Tunisie.jpg/960px-Cameleon_Tunisie.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'slime-mold':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Physarum_polycephalum_plasmodium.jpg/960px-Physarum_polycephalum_plasmodium.jpg', credit:'Frankenstoen, CC BY 2.0'},
  'toxoplasma':            {url:'https://upload.wikimedia.org/wikipedia/commons/3/39/Toxoplasma_gondii_tachy.jpg', credit:'Ke Hu and John Murray, CC BY 4.0'},
  'kelp':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Kelp_forest_Otago_1s.JPG/960px-Kelp_forest_Otago_1s.JPG', credit:'Stef Maruch, CC BY-SA 2.0'},
  // ── New species with scientific classification ──
  'chinese-giant-salamander':{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Velemlok_%C4%8D%C3%ADnsk%C3%BD_zoo_praha_1.jpg/960px-Velemlok_%C4%8D%C3%ADnsk%C3%BD_zoo_praha_1.jpg', credit:'Petr Hamernik, CC BY-SA 4.0'},
  'clownfish':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg/960px-Clown_fish_in_the_Andaman_Coral_Reef.jpg', credit:'Ritiks, CC BY-SA 3.0'},
  'hummingbird':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Archilochus_colubris_-flying_-male-8.jpg/960px-Archilochus_colubris_-flying_-male-8.jpg', credit:'jeffreyw, CC BY 2.0'},
  'african-grey-parrot':   {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Perroquet_%C3%A0_Yampopo_Beach_-_Douala.jpg/960px-Perroquet_%C3%A0_Yampopo_Beach_-_Douala.jpg', credit:'Florettesokeng, CC BY-SA 4.0'},
  'flying-fox':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Wilhelma_Kalong-Flughund_Pteropus_vampyrus_0513.jpg/960px-Wilhelma_Kalong-Flughund_Pteropus_vampyrus_0513.jpg', credit:'NobbiP, CC BY-SA 3.0'},
  'gray-wolf':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Eurasian_wolf_2.jpg/960px-Eurasian_wolf_2.jpg', credit:'Mas3cf, CC BY-SA 4.0'},
  'bottlenose-dolphin':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Tursiops_truncatus_01-cropped.jpg/960px-Tursiops_truncatus_01-cropped.jpg', credit:'NASA, Public domain'},
  'three-toed-sloth':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bradypus.jpg/960px-Bradypus.jpg', credit:'Stefan Laube, Public domain'},
  'leaf-cutter-ant':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Atta_cephalotes-pjt.jpg/960px-Atta_cephalotes-pjt.jpg', credit:'Pjt56, CC BY-SA 4.0'},
  'dragonfly':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Common_Green_Darner_Anax_junius_JG.jpg/960px-Common_Green_Darner_Anax_junius_JG.jpg', credit:'JeffreyGammon, CC BY 4.0'},
  'common-earthworm':      {url:'https://upload.wikimedia.org/wikipedia/commons/3/30/Regenwurm1.jpg', credit:'Michael Linnenbach, CC BY-SA 3.0'},
  'common-starfish':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Asterias_rubens.jpg/960px-Asterias_rubens.jpg', credit:'Hans Hillewaert, CC BY-SA 4.0'},
  'halococcus':            {url:'https://upload.wikimedia.org/wikipedia/commons/a/a1/Halobacteria.jpg', credit:'NASA'},
  'methanosarcina':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Life-05-01652-g001.png/960px-Life-05-01652-g001.png', credit:'Public domain'},
  'synchytrium':           {url:'https://upload.wikimedia.org/wikipedia/commons/5/5b/Synchytrium_on_Erodium_cicutarium.jpg', credit:'EPPO'},
  'allomyces':             {url:'https://upload.wikimedia.org/wikipedia/commons/8/88/Allomyces.jpg', credit:'Public domain'},
  'sea-urchin':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Strongylocentrotus_purpuratus.jpg/960px-Strongylocentrotus_purpuratus.jpg', credit:'Kirt L. Onthank, CC BY-SA 3.0'},
  'sea-cucumber':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Periclimenes_imperator_%28Emperor_shrimp%29_on_Bohadschia_argus_%28Sea_cucumber%29.jpg/960px-Periclimenes_imperator_%28Emperor_shrimp%29_on_Bohadschia_argus_%28Sea_cucumber%29.jpg', credit:'Peter Southwood, CC BY-SA 3.0'},
  'sea-lily':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crinoid_on_the_reef_of_Batu_Moncho_Island.JPG/960px-Crinoid_on_the_reef_of_Batu_Moncho_Island.JPG', credit:'Alexander Vasenin, CC BY-SA 3.0'},
  'medicinal-leech':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Hirudo_medicinalis.jpg/960px-Hirudo_medicinalis.jpg', credit:'GlebK, CC BY-SA 3.0'},
  'pompeii-worm':          {url:'https://upload.wikimedia.org/wikipedia/commons/3/3e/Alvinella_pompejana01.jpg', credit:'NOAA'},
  'sperm-whale':           {url:'https://upload.wikimedia.org/wikipedia/commons/7/76/Sperm_whale_fluke.jpg', credit:'Gregory Smith, CC BY-SA 2.0'},
  'orca':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Killerwhales_jumping.jpg/960px-Killerwhales_jumping.jpg', credit:'Robert Pittman, NOAA'},
  'tarsier':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Philippine_Tarsier.jpg/960px-Philippine_Tarsier.jpg', credit:'Jasper Greek Golangco, CC BY 3.0'},
  'ring-tailed-lemur':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Lemur_catta_001.jpg/960px-Lemur_catta_001.jpg', credit:'Alex Dunkel, CC BY 3.0'},
  'japanese-macaque':      {url:'https://upload.wikimedia.org/wikipedia/commons/8/8c/Jigokudani_hotspring_in_Nagano_Japan_001.jpg', credit:'Yosemite, CC BY-SA 3.0'},
  'mandrill':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mandrill_at_SF_Zoo.jpg/960px-Mandrill_at_SF_Zoo.jpg', credit:'Frank Wouters, CC BY 2.0'},
  'pangolin':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Tree_Pangolin.JPG/960px-Tree_Pangolin.JPG', credit:'Valerius Tygart, CC BY-SA 3.0'},
  'star-nosed-mole':       {url:'https://upload.wikimedia.org/wikipedia/commons/e/ef/Condylura.jpg', credit:'US NPS'},
  'honey-badger':          {url:'https://upload.wikimedia.org/wikipedia/commons/a/af/Honey_badger.jpg', credit:'Derek Keats, CC BY 2.0'},
  'caecilian':             {url:'https://upload.wikimedia.org/wikipedia/commons/c/c0/Siphonops_annulatus.jpg', credit:'Diogo B. Provete, CC BY 4.0'},
  'chameleon':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cameleon_Tunisie.jpg/960px-Cameleon_Tunisie.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'box-jellyfish':         {url:'https://upload.wikimedia.org/wikipedia/commons/3/3a/Avispa_marina.jpg', credit:'Guido Gautsch, CC BY-SA 2.0'},
  'cuttlefish':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Georgia_Aquarium_-_Cuttlefish_Jan_2006.jpg/960px-Georgia_Aquarium_-_Cuttlefish_Jan_2006.jpg', credit:'Hans Hillewaert, CC BY-SA 4.0'},
  'bombardier-beetle':     {url:'https://upload.wikimedia.org/wikipedia/commons/a/a3/Brachinus_spPCCA20060328-2821B.jpg', credit:'Siga, CC BY-SA 3.0'},
  'lungfish':              {url:'https://upload.wikimedia.org/wikipedia/commons/0/09/Neoceratodus_forsteri.jpg', credit:'Public domain'},
  'ginkgo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Ginkgo_biloba_MHNT.BOT.2010.13.1.jpg/960px-Ginkgo_biloba_MHNT.BOT.2010.13.1.jpg', credit:'Cayambe, CC BY-SA 3.0'},
  'dragon-blood-tree':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Socotra_dragon_tree.JPG/960px-Socotra_dragon_tree.JPG', credit:'Boris Khvostichenko, CC BY-SA 4.0'},
  'giant-panda':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/960px-Grosser_Panda.JPG', credit:'J. Patrick Fischer, CC BY-SA 3.0'},
  'red-kangaroo':          {url:'https://upload.wikimedia.org/wikipedia/commons/4/44/Macropus_rufus.jpg', credit:'fir0002, GFDL 1.2'},
  'moose':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Moose_superior.jpg/960px-Moose_superior.jpg', credit:'USDA, Public Domain'},
  'hippopotamus':          {url:'https://upload.wikimedia.org/wikipedia/commons/f/fa/Hippopotamus_amphibius.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'wolverine':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Gulo_gulo_1.jpg/960px-Gulo_gulo_1.jpg', credit:'Zefram, CC BY-SA 3.0'},
  'humpback-whale':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Humpback_stellwagen_edit.jpg/960px-Humpback_stellwagen_edit.jpg', credit:'Whit Welles, CC BY 3.0'},
  'narwhal':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Monodon_monoceros.jpg/960px-Monodon_monoceros.jpg', credit:'Ansgar Walk, CC BY-SA 2.5'},
  'sea-otter':             {url:'https://upload.wikimedia.org/wikipedia/commons/1/15/Sea_otter_cropped.jpg', credit:'Marshal Hedin, CC BY-SA 2.0'},
  'condor':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Gymnogyps_californianus_-San_Diego_Zoo-8a.jpg/960px-Gymnogyps_californianus_-San_Diego_Zoo-8a.jpg', credit:'Stacy, CC BY 2.0'},
  'flamingo':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Phoenicopterus_roseus.jpg/960px-Phoenicopterus_roseus.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'barn-owl':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Tyto_alba.jpg/960px-Tyto_alba.jpg', credit:'Bohushan, Public Domain'},
  'cassowary':             {url:'https://upload.wikimedia.org/wikipedia/commons/9/9b/Cassowary.jpg', credit:'Mfield, CC BY-SA 3.0'},
  'electric-eel':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Electrophorus_electricus.jpg/960px-Electrophorus_electricus.jpg', credit:'Steven G. Johnson, CC BY-SA 3.0'},
  'poison-dart-frog':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Ranitomeya_amazonica.jpg/960px-Ranitomeya_amazonica.jpg', credit:'Geoff Gallice, CC BY 2.0'},
  'firefly':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Photinus_pyralis_Firefly_2.jpg/960px-Photinus_pyralis_Firefly_2.jpg', credit:'Quit007, CC BY-SA 3.0'},
  'atlas-moth':            {url:'https://upload.wikimedia.org/wikipedia/commons/a/a6/Atlas_moth.jpg', credit:'Quartl, CC BY-SA 3.0'},
  'army-ant':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Army_ants.jpg/960px-Army_ants.jpg', credit:'Nick Hobgood, CC BY-SA 3.0'},
  'japanese-spider-crab':  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Japanese_Spider_Crab.jpg/960px-Japanese_Spider_Crab.jpg', credit:'OpenCage, CC BY-SA 2.5'},
  'garden-spider':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Argiope_aurantia_male.jpg/960px-Argiope_aurantia_male.jpg', credit:'Luc Viatour, CC BY-SA 3.0'},
  'hermit-crab':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Pagurus_bernhardus.jpg/960px-Pagurus_bernhardus.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'portuguese-man-o-war':  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Physalia_physalis.jpg/960px-Physalia_physalis.jpg', credit:'Volkan Yuksel, CC BY-SA 3.0'},
  'hammerhead-shark':      {url:'https://upload.wikimedia.org/wikipedia/commons/9/9b/Sphyrna_lewini.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'water-lily':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Water_lily_2.jpg/960px-Water_lily_2.jpg', credit:'Abrahami, CC BY-SA 3.0'},
  'bamboo':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bamboo.jpg/960px-Bamboo.jpg', credit:'Cntras, CC BY-SA 3.0'},
  'cactus':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Saguaro_cactus.jpg/960px-Saguaro_cactus.jpg', credit:'Derek Ramsey, GFDL 1.2'},
  'sundew':                {url:'https://upload.wikimedia.org/wikipedia/commons/0/0f/Drosera_capensis.jpg', credit:'Noah Elhardt, CC BY 2.5'},
  'truffle':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Tuber_aestivum.jpg/960px-Tuber_aestivum.jpg', credit:'Archenzo, CC BY-SA 3.0'},
  'chanterelle':           {url:'https://upload.wikimedia.org/wikipedia/commons/6/68/Cantharellus_cibarius.jpg', credit:'Archenzo, CC BY-SA 3.0'},
  'lichen':                {url:'https://upload.wikimedia.org/wikipedia/commons/e/ec/Lichen_on_a_rock.jpg', credit:'Jason Hollinger, CC BY 2.0'},
  'euglena':               {url:'https://upload.wikimedia.org/wikipedia/commons/b/b4/Photosynthetic_euglenid.jpg', credit:'Claudio Miklos, CC BY 2.5'},
  'radiolarian':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Acantharia.jpg/960px-Acantharia.jpg', credit:'Ernst Haeckel, Public Domain'},
  'stentor':               {url:'https://upload.wikimedia.org/wikipedia/commons/9/9b/Stentor_coeruleus.jpg', credit:'Picturepest, CC BY 2.0'},
  // ── Additional bacteria ──
  'aliivibrio':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Aliivibrio_fischeri.jpg/960px-Aliivibrio_fischeri.jpg', credit:'Courtesy of American Society for Microbiology, CC BY 3.0'},
  'borrelia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Borrelia_burgdorferi_%28CDC-PHIL_-6631%29_lores.jpg/960px-Borrelia_burgdorferi_%28CDC-PHIL_-6631%29_lores.jpg', credit:'CDC, Public Domain'},
  'campylobacter':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/ARS_Campylobacter_jejuni.jpg/960px-ARS_Campylobacter_jejuni.jpg', credit:'USDA ARS, Public Domain'},
  'ferroplasma':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg/960px-Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg', credit:'Representative acidic hot spring habitat — NOAA, CC BY 2.0'},
  'rhizobium':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Rhizobium_tropici_strain_BR816_on_TY_agar.JPG/960px-Rhizobium_tropici_strain_BR816_on_TY_agar.JPG', credit:'Tracing Nitrogen, CC BY-SA 4.0'},
  'spirulina':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Spirulina_tablets.jpg/960px-Spirulina_tablets.jpg', credit:'Perdita, CC BY-SA 3.0'},
  'staphylococcus':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Staphylococcus_aureus_VISA_2.jpg/960px-Staphylococcus_aureus_VISA_2.jpg', credit:'CDC/Matthew J. Arduino, Public Domain'},
  'thermus-aquaticus':     {url:'https://upload.wikimedia.org/wikipedia/commons/4/48/Thermus_aquaticus.JPG', credit:'Diane Montpetit, CC BY-SA 4.0'},
  'treponema':             {url:'https://upload.wikimedia.org/wikipedia/commons/2/29/Treponema_pallidum.jpg', credit:'CDC, Public Domain'},
  'wolbachia':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Wolbachia.png/800px-Wolbachia.png', credit:'Scott O\'Neill, CC BY 2.5'},
  // ── Additional archaea ──
  'methanopyrus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Blacksmoker_in_Atlantic_Ocean.jpg/960px-Blacksmoker_in_Atlantic_Ocean.jpg', credit:'Representative black smoker hydrothermal vent — NOAA/P. Rona, Public Domain'},
  'nanoarchaeum':          {url:'https://upload.wikimedia.org/wikipedia/commons/d/dc/Urzwerg.jpg', credit:'Karl O. Stetter, Public Domain'},
  'thaumarchaeota':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg/960px-Inactive_hydrothermal_vents%2C_Galapagos_Rift_%28Expl6488_9667229132%29.jpg', credit:'Representative ocean/soil archaea habitat — NOAA, CC BY 2.0'},
  'thermococcus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Thermococcus_gammatolerans.jpg/960px-Thermococcus_gammatolerans.jpg', credit:'Xaviermartin, CC BY-SA 3.0'},
  // ── Additional protists ──
  'bdelloid-rotifer':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Bdelloid_Rotifer.jpg/960px-Bdelloid_Rotifer.jpg', credit:'Bob Blaylock, CC BY-SA 4.0'},
  'bioluminescent-dino':   {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bioluminescent_dinoflagellates.jpg/960px-Bioluminescent_dinoflagellates.jpg', credit:'Catalina Island Marine Institute, CC BY-SA 4.0'},
  'foraminifera':          {url:'https://upload.wikimedia.org/wikipedia/commons/1/10/Benthic_foraminifera.jpg', credit:'Hannes Grobe, CC BY 3.0'},
  'trypanosoma':           {url:'https://upload.wikimedia.org/wikipedia/commons/0/0b/Trypanosoma_cruzi_crithidia.jpeg', credit:'CDC, Public Domain'},
  // ── Additional fungi ──
  'ergot':                 {url:'https://upload.wikimedia.org/wikipedia/commons/2/26/Claviceps_purpurea_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-185.jpg', credit:'Accipiter, CC BY-SA 3.0'},
  'fly-agaric':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/960px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 2.5 NL'},
  'lions-mane':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Igelstachelbart_Nov_06.jpg/960px-Igelstachelbart_Nov_06.jpg', credit:'Lebrac, CC BY-SA 3.0'},
  'morel':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Morchella_conica_1_beentree.jpg/960px-Morchella_conica_1_beentree.jpg', credit:'Peter Preusse, CC BY-SA 3.0'},
  'shiitake':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Shiitakegrowing.jpg/960px-Shiitakegrowing.jpg', credit:'Frankenstoen, CC BY 2.0'},
  // ── Plants ──
  'acacia':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Acacia_Kenya_Savannah.jpg/960px-Acacia_Kenya_Savannah.jpg', credit:'Nevit Dilmen, CC BY-SA 3.0'},
  'coffee':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ripe_coffee_fruits.jpg/960px-Ripe_coffee_fruits.jpg', credit:'Leonora Enking, CC BY-SA 2.0'},
  'cycad':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Cycas_circinalis.jpg/960px-Cycas_circinalis.jpg', credit:'Krzysztof Ziarnek, CC BY-SA 4.0'},
  'eucalyptus':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Eucalyptus_tereticornis_flowers%2C_capsules%2C_buds_and_foliage.jpeg/960px-Eucalyptus_tereticornis_flowers%2C_capsules%2C_buds_and_foliage.jpeg', credit:'Fir0002, GFDL 1.2'},
  'lotus':                {url:'https://upload.wikimedia.org/wikipedia/commons/3/31/Nelumbo_nucifera1.jpg', credit:'Amada44, CC BY 3.0'},
  'magnolia':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Magnolia_%C3%97_soulangeana_blossom.jpg/960px-Magnolia_%C3%97_soulangeana_blossom.jpg', credit:'Peter Coxhead, CC BY-SA 3.0'},
  'mangrove':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Detail_of_mangrove_roots.jpg/960px-Detail_of_mangrove_roots.jpg', credit:'Rufino Uribe, CC BY-SA 2.0'},
  'oak':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Montes_de_Vitoria_-_Quercus_ilex_01.jpg/960px-Montes_de_Vitoria_-_Quercus_ilex_01.jpg', credit:'Andreas Trepte, CC BY-SA 2.5'},
  'pitcher-plant':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Nepenthes_lowii1.jpg/800px-Nepenthes_lowii1.jpg', credit:'Ch\'ien C. Lee, CC BY-SA 3.0'},
  'resurrection-fern':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/GreenPolypods.jpg/960px-GreenPolypods.jpg', credit:'Stan Shebs, CC BY-SA 3.0'},
  'rice':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Oryza_sativa_MHNT.BOT.2015.2.52.jpg/960px-Oryza_sativa_MHNT.BOT.2015.2.52.jpg', credit:'Duong Thanh Son, CC BY-SA 3.0'},
  'sensitive-fern':       {url:'https://upload.wikimedia.org/wikipedia/commons/3/34/Onoclea_sensibilis_KS-01.jpg', credit:'H. Zell, CC BY-SA 3.0'},
  'strangler-fig':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Strangler_Fig_Tree_at_Garden_of_the_Groves_Botanical_Garden_in_Grand_Bahama.jpg/960px-Strangler_Fig_Tree_at_Garden_of_the_Groves_Botanical_Garden_in_Grand_Bahama.jpg', credit:'Cgoodwin, CC BY-SA 3.0'},
  'titan-sequoia':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/General_Sherman_tree_looking_up.jpg/960px-General_Sherman_tree_looking_up.jpg', credit:'Msanderhoff, CC BY-SA 4.0'},
  'welwitschia-2':        {url:'https://upload.wikimedia.org/wikipedia/commons/5/59/N-welwitschia-2.jpg', credit:'Thomas Schoch, CC BY-SA 2.5'},
  // ── Invertebrates — Cnidarians ──
  'blue-ringed-octopus':  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Hapalochlaena_lunulata.JPG/960px-Hapalochlaena_lunulata.JPG', credit:'paulshaffner, CC BY 2.0'},
  'crown-of-thorns':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Crown_of_Thorns_Starfish_at_Malapascuas_Island_v._II.jpg/960px-Crown_of_Thorns_Starfish_at_Malapascuas_Island_v._II.jpg', credit:'Jon Hanson, CC BY-SA 2.0'},
  // ── Invertebrates — Mollusks ──
  'cone-snail':           {url:'https://upload.wikimedia.org/wikipedia/commons/7/79/Conus-geographicus.jpg', credit:'Richard Ling, CC BY-SA 2.0'},
  'giant-clam':           {url:'https://upload.wikimedia.org/wikipedia/commons/0/0a/Tridacna_gigas.jpg', credit:'Janderk, CC BY-SA 3.0'},
  'mollusks':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Octopus_vulgaris2.jpg/960px-Octopus_vulgaris2.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  // ── Invertebrates — Annelids ──
  'earthworm':            {url:'https://upload.wikimedia.org/wikipedia/commons/3/30/Regenwurm1.jpg', credit:'Michael Linnenbach, CC BY-SA 3.0'},
  'giant-tube-worm':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Nur04505.jpg/960px-Nur04505.jpg', credit:'NOAA, Public Domain'},
  'leech':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Hirudo_medicinalis.jpg/960px-Hirudo_medicinalis.jpg', credit:'GlebK, CC BY-SA 3.0'},
  // ── Invertebrates — Echinoderms ──
  'feather-star':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Feather_Star_%28Lamprometra_palmata%29.jpg/960px-Feather_Star_%28Lamprometra_palmata%29.jpg', credit:'Nick Hobgood, CC BY-SA 3.0'},
  // ── Invertebrates — Insects ──
  'bumblebee':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bumblebee_October_2007-2.jpg/960px-Bumblebee_October_2007-2.jpg', credit:'Alvesgaspar, CC BY-SA 3.0'},
  'cicada':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Neotibicen_linnei.jpg/960px-Neotibicen_linnei.jpg', credit:'Bruce Marlin, CC BY-SA 3.0'},
  'cockroach':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Periplaneta_americana.jpg/960px-Periplaneta_americana.jpg', credit:'Gary Alpert, CC BY-SA 2.5'},
  'dung-beetle':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Flightless_Dung_Beetle_Circellium_Bachuss%2C_Addo_Elephant_National_Park%2C_South_Africa.JPG/960px-Flightless_Dung_Beetle_Circellium_Bachuss%2C_Addo_Elephant_National_Park%2C_South_Africa.JPG', credit:'Dawson, CC BY-SA 2.5'},
  'hercules-beetle':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Dynastes_hercules_%28female%29.jpg/960px-Dynastes_hercules_%28female%29.jpg', credit:'Fritz Geller-Grimm, CC BY-SA 2.5'},
  'leaf-insect':          {url:'https://upload.wikimedia.org/wikipedia/commons/1/12/LeafInsect.jpg', credit:'Drägüs, CC BY-SA 3.0'},
  'mosquito':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Aedes_aegypti.jpg/960px-Aedes_aegypti.jpg', credit:'James Gathany/CDC, Public Domain'},
  'praying-mantis':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Mantis_religiosa_2.jpg/960px-Mantis_religiosa_2.jpg', credit:'Luc Viatour, CC BY-SA 3.0'},
  'stick-insect':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Phasmatodea_00613.jpg/960px-Phasmatodea_00613.jpg', credit:'Luc Viatour, CC BY-SA 3.0'},
  // ── Invertebrates — Other arthropods ──
  'emperor-scorpion':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Pandinus_imperator_2009_G1.jpg/960px-Pandinus_imperator_2009_G1.jpg', credit:'Dezidor, CC BY 3.0'},
  'lobster':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/American_Lobster_%28Homarus_americanus%29_-_Gooseberry_Cove_Provincial_Park%2C_Newfoundland_2019-08-10_%2801%29.jpg/960px-American_Lobster_%28Homarus_americanus%29_-_Gooseberry_Cove_Provincial_Park%2C_Newfoundland_2019-08-10_%2801%29.jpg', credit:'Steven G. Johnson, CC BY-SA 3.0'},
  // ── Fish (missing entries) ──
  'arapaima':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Arapaima_leptosoma_2009_G2.jpg/960px-Arapaima_leptosoma_2009_G2.jpg', credit:'Bjørn Christian Tørrissen, CC BY-SA 3.0'},
  'blobfish':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Psychrolutes_marcidus.jpg/960px-Psychrolutes_marcidus.jpg', credit:'Kerryn Parkinson/NORFANZ, CC BY 3.0'},
  'flying-fish':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Exocoetus_obtusirostris.jpg/960px-Exocoetus_obtusirostris.jpg', credit:'NOAA, Public Domain'},
  'mudskipper':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Boleophthalmus_boddarti.jpg/960px-Boleophthalmus_boddarti.jpg', credit:'Bjørn Christian Tørrissen, CC BY-SA 3.0'},
  'pufferfish':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Arothron_hispidus.jpg/960px-Arothron_hispidus.jpg', credit:'Jens Petersen, CC BY-SA 3.0'},
  'salmon':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Pink_salmon_FWS.jpg/960px-Pink_salmon_FWS.jpg', credit:'USFWS, Public Domain'},
  'swordfish':            {url:'https://upload.wikimedia.org/wikipedia/commons/9/98/Xiphias_gladius1.jpg', credit:'NOAA, Public Domain'},
  'tuna':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bluefin-big.jpg/960px-Bluefin-big.jpg', credit:'NOAA, Public Domain'},
  // ── Amphibians (missing entries) ──
  'platypus-frog':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Rheobatrachus_silus.jpg/960px-Rheobatrachus_silus.jpg', credit:'Michael Tyler, Public Domain'},
  'c-elegans':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Adult_Caenorhabditis_elegans.jpg/960px-Adult_Caenorhabditis_elegans.jpg', credit:'Zeynep F. Altun, CC BY-SA 2.5'},
  // ── Reptiles (missing entries) ──
  'marine-iguana':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Marine-Iguana-Espanola.jpg/960px-Marine-Iguana-Espanola.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  // ── Birds (missing entries) ──
  'resplendent-quetzal':  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/056_Male_Resplendent_quetzal_in_Los_Quetzales_National_Park_Photo_by_Giles_Laurent.jpg/960px-056_Male_Resplendent_quetzal_in_Los_Quetzales_National_Park_Photo_by_Giles_Laurent.jpg', credit:'Francesco Veronesi, CC BY-SA 2.0'},
  'greater-bird-of-paradise': {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Paradisaea_apoda_-Bali_Bird_Park-6.jpg/960px-Paradisaea_apoda_-Bali_Bird_Park-6.jpg', credit:'John Gould, Public Domain'},
  // ── Mammals (previously missing) ──
  'armadillo':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Nine-banded_Armadillo.jpg/960px-Nine-banded_Armadillo.jpg', credit:'Wildfeuer, CC BY 3.0'},
  'aye-aye':                {url:'https://upload.wikimedia.org/wikipedia/commons/e/ef/Aye-aye_%28Daubentonia_madagascariensis%29_1.jpg', credit:'Frank Vassen, CC BY 2.0'},
  'beaver':                 {url:'https://upload.wikimedia.org/wikipedia/commons/6/6b/American_Beaver.jpg', credit:'Steve, CC BY-SA 2.0'},
  'capybara':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Capybara_%28Hydrochoerus_hydrochaeris%29.jpg/960px-Capybara_%28Hydrochoerus_hydrochaeris%29.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'cheetah':                {url:'https://upload.wikimedia.org/wikipedia/commons/0/09/TheCheethcat.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'dugong':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dugong_Marsa_Alam.jpg/960px-Dugong_Marsa_Alam.jpg', credit:'Julien Willem, CC BY-SA 3.0'},
  'echidna':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Wild_shortbeak_echidna.jpg/960px-Wild_shortbeak_echidna.jpg', credit:'JJ Harrison, CC BY-SA 3.0'},
  'elephant-seal':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Northern_Elephant_Seal%2C_San_Simeon2.jpg/960px-Northern_Elephant_Seal%2C_San_Simeon2.jpg', credit:'Liam Quinn, CC BY-SA 2.0'},
  'gibbon':                 {url:'https://upload.wikimedia.org/wikipedia/commons/4/48/Nomascus_leucogenys.jpg', credit:'Thomas Schoch, CC BY-SA 2.5'},
  'hedgehog':               {url:'https://upload.wikimedia.org/wikipedia/commons/e/e1/Erinaceus_europaeus_%28Marek_Szczepanek%29.jpg', credit:'GerardM, CC BY-SA 3.0'},
  'jaguar':                 {url:'https://upload.wikimedia.org/wikipedia/commons/0/0a/Standing_jaguar.jpg', credit:'Cburnett, CC BY-SA 3.0'},
  'meerkat':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Meerkat_%28Suricata_suricatta%29_Tswalu.jpg/960px-Meerkat_%28Suricata_suricatta%29_Tswalu.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'okapi':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Okapi2.jpg/960px-Okapi2.jpg', credit:'Raul654, CC BY-SA 3.0'},
  'spotted-hyena':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Crocuta_crocuta.jpg/960px-Crocuta_crocuta.jpg', credit:'Muhammad Mahdi Karim, GFDL 1.2'},
  'vampire-bat':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Desmodus_rotundus_A_Catenazzi.jpg/960px-Desmodus_rotundus_A_Catenazzi.jpg', credit:'Acatenazzi, CC BY-SA 3.0'},
  'walrus':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Pacific_Walrus_-_Bull_%288247646168%29.jpg/960px-Pacific_Walrus_-_Bull_%288247646168%29.jpg', credit:'Arturo de Frias Marques, CC BY-SA 3.0'},
  'wombat':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Vombatus_ursinus_-Maria_Island_National_Park.jpg/960px-Vombatus_ursinus_-Maria_Island_National_Park.jpg', credit:'JJ Harrison, CC BY-SA 3.0'},
  // ── 34 remaining coverage gaps ──
  // Archaea
  'haloquadratum':          {url:'https://upload.wikimedia.org/wikipedia/commons/0/03/Haloquadratum_walsbyi00.jpg', credit:'Mike Dyall-Smith, CC BY-SA 3.0'},
  // Plants
  'corpse-flower':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Corpse_flower_%2871198%29a.jpg/960px-Corpse_flower_%2871198%29a.jpg', credit:'Michael Shafto, CC BY 2.0'},
  // Invertebrates — Insects
  'termite':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Odontotermes_obesus_Termites_Isoptera_%281%29_03.jpg/960px-Odontotermes_obesus_Termites_Isoptera_%281%29_03.jpg', credit:'Scott Bauer/USDA, Public Domain'},
  // Invertebrates — Sponges
  'sponges':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Sanc0534_-_Flickr_-_NOAA_Photo_Library.jpg/960px-Sanc0534_-_Flickr_-_NOAA_Photo_Library.jpg', credit:'Nick Hobgood, CC BY-SA 3.0'},
  'glass-sponge':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Euplectella_aspergillum_Okeanos.jpg/960px-Euplectella_aspergillum_Okeanos.jpg', credit:'NOAA, Public Domain'},
  'barrel-sponge':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Barrel_sponge_%2827865354839%29.jpg/960px-Barrel_sponge_%2827865354839%29.jpg', credit:'Nick Hobgood, CC BY-SA 3.0'},
  // Invertebrates — Nematodes
  'nematodes':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Adult_Caenorhabditis_elegans.jpg/960px-Adult_Caenorhabditis_elegans.jpg', credit:'Zeynep F. Altun, CC BY-SA 2.5'},
  // Birds
  'bee-hummingbird':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Bee_hummingbird_%28Mellisuga_helenae%29_adult_male_non-breeding.jpg/960px-Bee_hummingbird_%28Mellisuga_helenae%29_adult_male_non-breeding.jpg', credit:'Ekaterina Chernetsova, CC BY 2.0'},
  'new-caledonian-crow':    {url:'https://upload.wikimedia.org/wikipedia/commons/7/77/Corvus_moneduloides_212163787_%28cropped%29.jpg', credit:'Neitram, CC BY-SA 3.0'},
  'ostrich':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ostrich_-_melbourne_zoo.jpg/960px-Ostrich_-_melbourne_zoo.jpg', credit:'fir0002, GFDL 1.2'},
  'kiwi':                   {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Kiwi_aka.jpg/960px-Kiwi_aka.jpg', credit:'Glen Fergus, CC BY-SA 2.5'},
  'secretary-bird':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Sagittarius_serpentarius_%28Tierpark_Berlin%2C_2008%29.jpg/960px-Sagittarius_serpentarius_%28Tierpark_Berlin%2C_2008%29.jpg', credit:'Alastair Rae, CC BY-SA 2.0'},
  'toucan':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Toco_Toucan_%28Ramphastos_toco%29_-_48153967707.jpg/960px-Toco_Toucan_%28Ramphastos_toco%29_-_48153967707.jpg', credit:'Carlos Delgado, CC BY-SA 3.0'},
  'pelican':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pelecanus_occidentalis_Caye_Caulker_03.JPG/960px-Pelecanus_occidentalis_Caye_Caulker_03.JPG', credit:'Ómar Runólfsson, CC BY 2.0'},
  'woodpecker':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Dryocopus_pileatus_MP2.jpg/960px-Dryocopus_pileatus_MP2.jpg', credit:'Ken Thomas, Public Domain'},
  'swift':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Apus_apus_01.jpg/960px-Apus_apus_01.jpg', credit:'Andreas Trepte, CC BY-SA 2.5'},
  'lyrebird':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Superb_lyrbird_in_scrub.jpg/960px-Superb_lyrbird_in_scrub.jpg', credit:'fir0002, GFDL 1.2'},
  'hoatzin':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Hoatzin_%28Opisthocomus_hoazin%29.jpg/960px-Hoatzin_%28Opisthocomus_hoazin%29.jpg', credit:'Joseph Smit, Public Domain'},
  'arctic-tern':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Arctic_tern_%28Sterna_paradisaea%29_attacking%2C_Amsterdam_island%2C_Svalbard.jpg/960px-Arctic_tern_%28Sterna_paradisaea%29_attacking%2C_Amsterdam_island%2C_Svalbard.jpg', credit:'OldakQuill, CC BY-SA 3.0'},
  'harpy-eagle':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Harpia-harpyja-001.jpg/960px-Harpia-harpyja-001.jpg', credit:'Piotr Trela, CC BY-SA 3.0'},
  'shoebill':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Balaeniceps_rex_-_Weltvogelpark_Walsrode_09-2010.jpg/960px-Balaeniceps_rex_-_Weltvogelpark_Walsrode_09-2010.jpg', credit:'Ltshears, CC BY-SA 3.0'},
  'superb-fairywren':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Male_and_female_superb_fairy_wren.jpg/960px-Male_and_female_superb_fairy_wren.jpg', credit:'JJ Harrison, CC BY-SA 3.0'},
  // Reptiles
  'anaconda':               {url:'https://upload.wikimedia.org/wikipedia/commons/b/b2/Eunectes_murinus2.jpg', credit:'Ltshears, CC BY-SA 3.0'},
  'gecko':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Chinese_gecko_%28Gekko_chinensis%29_Aberdeen.jpg/960px-Chinese_gecko_%28Gekko_chinensis%29_Aberdeen.jpg', credit:'Rushenb, CC BY-SA 3.0'},
  'python':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Ball_python_lucy.JPG/960px-Ball_python_lucy.JPG', credit:'Mokele, CC BY-SA 3.0'},
  'iguana':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Portrait_of_an_Iguana.jpg/960px-Portrait_of_an_Iguana.jpg', credit:'Charlesjsharp, CC BY-SA 4.0'},
  'leatherback-turtle':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Leatherback_sea_turtle_Tinglar%2C_USVI_%285839996547%29.jpg/960px-Leatherback_sea_turtle_Tinglar%2C_USVI_%285839996547%29.jpg', credit:'USFWS, Public Domain'},
  // Amphibians
  'giant-salamander':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Velemlok_%C4%8D%C3%ADnsk%C3%BD_zoo_praha_1.jpg/960px-Velemlok_%C4%8D%C3%ADnsk%C3%BD_zoo_praha_1.jpg', credit:'Petr Hamernik, CC BY-SA 4.0'},
  'red-eyed-tree-frog':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Agalychnis_callidryas.jpg/960px-Agalychnis_callidryas.jpg', credit:'Carey James Balboa, Public Domain'},
  // Mammals
  'dolphin':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/960px-Tursiops_truncatus_01.jpg', credit:'NASA, Public Domain'},
  'white-rhinoceros':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/White_Rhino.jpg/960px-White_Rhino.jpg', credit:'Ikiwaner, GFDL 1.2'},
  'manatee':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Manatee_photo.jpg/960px-Manatee_photo.jpg', credit:'USFWS, Public Domain'},
  'african-wild-dog':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Lycaon_pictus_%28Temminck%2C_1820%29.jpg/960px-Lycaon_pictus_%28Temminck%2C_1820%29.jpg', credit:'Lip Kee Yap, CC BY-SA 2.0'},
  // Protists
  'radiolaria':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Acantharia.jpg/960px-Acantharia.jpg', credit:'Ernst Haeckel, Public Domain'},
};

export const GREAT_APE_IDS = ['great-apes','gorilla','orangutan','chimpanzee','bonobo','hominini'];
export const HOMININ_IDS   = ['homo-sapiens','h_erectus','h_habilis','h_neanderthalensis','h_heidelbergensis','h_floresiensis','h_naledi','h_luzonensis','denisovan','au_afarensis','au_africanus','sahelanthropus','ardipithecus_r'];
