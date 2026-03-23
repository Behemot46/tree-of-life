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
      'Octopuses have three hearts, blue copper-based blood, and a brain-to-body ratio comparable to many mammals.',
      'Two-thirds of an octopus\'s neurons are in its arms, not its brain — each arm can act semi-independently and continues responding to stimuli even when detached.',
      'Octopuses can edit their own RNA in real time to adapt to temperature changes — a form of gene regulation not seen in any vertebrate.',
      'An octopus in New Zealand was documented escaping its tank at night, traveling to a nearby tank, eating a shark, and returning before morning.',
      'Octopuses have been observed using tools — carrying coconut shells to use as portable shelters.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Octopus'},
      {label:'Cephalopod Page', url:'https://www.thecephalopodpage.org/'},
      {label:'PBS NOVA (Other Minds)', url:'https://www.pbs.org/wgbh/nova/article/are-octopuses-smart/'},
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
      'Mantis shrimp strike with the force of a bullet — their club-like appendages accelerate at 10,000g and move at 23 m/s, generating cavitation bubbles that release a shockwave on top of the physical strike.',
      'They have 16 types of photoreceptors — compared to 3 in humans — but research shows they may actually process color less efficiently than us, using a different perceptual strategy.',
      'Mantis shrimp can see polarized light and ultraviolet wavelengths used in the UV patterns on other mantis shrimp for communication.',
      'They are one of the few animals to have true binocular vision in each eye independently — each eye can judge distance on its own.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Mantis_shrimp'},
      {label:'Smithsonian Ocean', url:'https://ocean.si.edu/ocean-life/invertebrates/mantis-shrimp'},
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
      'Komodo dragons were unknown to Western science until 1912, when a Dutch military officer reported rumors of a "land crocodile" on Komodo Island.',
      'They can eat 80% of their body weight in a single meal and survive on as few as 12 large meals per year.',
      'Female Komodo dragons can reproduce parthenogenetically — without a male — producing only male offspring, which can then mate with the mother to produce females.',
      'Their saliva contains over 50 bacterial species, but recent research suggests they also have venom glands that cause blood-thinning and shock in prey.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Komodo_dragon'},
      {label:'WWF', url:'https://www.worldwildlife.org/species/komodo-dragon'},
      {label:'Smithsonian\'s National Zoo', url:'https://nationalzoo.si.edu/animals/komodo-dragon'},
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
      'The platypus bill contains ~40,000 electroreceptors that can detect the weak electrical fields produced by muscle contractions in prey — it hunts with its eyes and ears closed.',
      'Male platypuses have venomous spurs on their hind legs — the venom causes excruciating pain in humans and can kill a dog.',
      'The platypus genome contains genes from mammals, reptiles, and birds — reflecting its position as a very early branching mammal lineage.',
      'Platypuses glow blue-green under ultraviolet light — a phenomenon called biofluorescence discovered only in 2020.',
      'They have 10 sex chromosomes (compared to humans\' 2), and the Y chromosomes share more similarity with bird sex chromosomes than mammalian ones.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Platypus'},
      {label:'Australian Museum', url:'https://australian.museum/learn/animals/mammals/platypus/'},
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
    ]
  },
  'primates': {
    altFacts:[
      'Primates are the only mammals with flat nails instead of claws — an adaptation for grasping branches and manipulating objects.',
      'The tarsier has the largest eyes relative to body size of any mammal — each eye is as large as its entire brain.',
      'Primates have the longest childhoods relative to lifespan of any animal group, allowing extended learning periods.',
      'New World monkeys evolved independently in South America after ancestral primates somehow crossed the Atlantic from Africa ~40 million years ago — probably on floating vegetation.',
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
      'A coral "head" is a colony of thousands of genetically identical polyps, each secreting a calcium carbonate skeleton that accumulates over centuries.',
      'The Great Barrier Reef is the largest living structure on Earth — visible from space — and has existed for ~500,000 years.',
      'Coral reefs cover less than 1% of the ocean floor but support ~25% of all marine species.',
      'Coral bleaching occurs when heat stress causes corals to expel their symbiotic algae (zooxanthellae) — without them, the coral starves and dies.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Coral'},
      {label:'NOAA Coral Reef', url:'https://www.noaa.gov/education/resource-collections/ocean-coasts/coral-reefs'},
      {label:'Coral Triangle Initiative', url:'https://www.coraltriangleinitiative.org/'},
    ]
  },
  'honey-bee': {
    altFacts:[
      'A honeybee colony of ~60,000 individuals functions as a superorganism — decisions like where to move a swarm are made collectively through "dance debates."',
      'Worker bees communicate the exact distance and direction of food sources through the waggle dance — a symbolic language that encodes spatial information.',
      'One-third of all human food depends on pollination by bees and other insects.',
      'Bees navigate using the Earth\'s magnetic field and the polarization patterns of sunlight — they can find their hive even on overcast days.',
      'The honeybee venom enzyme phospholipase A2 is being studied as a potential treatment for HIV and some cancers.',
    ],
    links:[
      {label:'Wikipedia', url:'https://en.wikipedia.org/wiki/Western_honey_bee'},
      {label:'USDA Bee Research', url:'https://www.ars.usda.gov/research/programs/honeybees/'},
      {label:'Bee Informed Partnership', url:'https://beeinformed.org/'},
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
  'turritopsis':'Turritopsis_dohrnii','coral-reef':'Coral_reef',
  'arthropoda':'Arthropod','insecta':'Insect','honey-bee':'Western_honey_bee',
  'mantis-shrimp':'Mantis_shrimp','horseshoe-crab':'Horseshoe_crab',
  'mollusca':'Mollusca','cephalopods':'Cephalopod','octopus':'Octopus',
  'octopus-day':'Day_octopus','nautilus':'Nautilus_(genus)',
  'echinodermata':'Echinoderm','chordata':'Chordate',
  'fish':'Fish','sharks':'Shark','white-shark':'Great_white_shark','coelacanth':'Coelacanth',
  'amphibia':'Amphibian','reptilia':'Reptile','komodo-dragon':'Komodo_dragon','tuatara':'Tuatara',
  'aves':'Bird','birds':'Peregrine_falcon','archaeopteryx':'Archaeopteryx','peregrine-falcon':'Peregrine_falcon',
  'mammalia':'Mammal','cetaceans':'Cetacea','blue-whale':'Blue_whale',
  'naked-mole-rat':'Naked_mole-rat','platypus':'Platypus',
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
};

const PHOTO_MAP = {
  // Bacteria & microbes
  'luca':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Hydrothermal_vent_-_Lost_City_2005.jpg/640px-Hydrothermal_vent_-_Lost_City_2005.jpg', credit:'NOAA/Wikipedia, CC BY 2.0'},
  'bacteria':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Bacteria_collage.jpg/640px-Bacteria_collage.jpg', credit:'Wikipedia, CC BY-SA 3.0'},
  'cyanobacteria':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/AnabaenaFS.jpg/640px-AnabaenaFS.jpg', credit:'Kristian Peters, CC BY-SA 3.0'},
  'proteobacteria':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/EscherichiaColi_NIAID.jpg/640px-EscherichiaColi_NIAID.jpg', credit:'NIAID, CC BY 2.0'},
  'ecoli':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/EscherichiaColi_NIAID.jpg/640px-EscherichiaColi_NIAID.jpg', credit:'NIAID, CC BY 2.0'},
  'helicobacter':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/EMpylori.jpg/640px-EMpylori.jpg', credit:'Yutaka Tsutsumi, CC BY 2.5'},
  'vibrio-cholerae':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Cholera_bacteria_SEM.jpg/640px-Cholera_bacteria_SEM.jpg', credit:'Tom Kirn/Louisa Howard, Public Domain'},
  'firmicutes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Lactobacillus_acidophilus_SEM.jpg/640px-Lactobacillus_acidophilus_SEM.jpg', credit:'Bob Blaylock, CC BY-SA 3.0'},
  'lactobacillus':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Lactobacillus_acidophilus_SEM.jpg/640px-Lactobacillus_acidophilus_SEM.jpg', credit:'Bob Blaylock, CC BY-SA 3.0'},
  'clostridium-botulinum': {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Clostridium_botulinum.jpg/640px-Clostridium_botulinum.jpg', credit:'CDC, Public Domain'},
  'actinobacteria':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Streptomyces_coelicolor.jpg/640px-Streptomyces_coelicolor.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'streptomyces':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Streptomyces_coelicolor.jpg/640px-Streptomyces_coelicolor.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'mycobacterium-tb':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/TB_Culture.jpg/640px-TB_Culture.jpg', credit:'CDC, Public Domain'},
  'deinococcus':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Deinococcus_radiodurans.jpg/640px-Deinococcus_radiodurans.jpg', credit:'Michael Daly, Public Domain'},
  'bacteroides':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Bacteroides_fragilis_01.jpg/640px-Bacteroides_fragilis_01.jpg', credit:'CDC, Public Domain'},
  'prochlorococcus':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Prochlorococcus.jpg/640px-Prochlorococcus.jpg', credit:'Luke Thompson/Chisholm Lab, CC BY 2.5'},
  // Archaea
  'archaea':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Halobacterium_sp._NRC-1.jpg/640px-Halobacterium_sp._NRC-1.jpg', credit:'NASA, Public Domain'},
  'halobacterium':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Halobacterium_sp._NRC-1.jpg/640px-Halobacterium_sp._NRC-1.jpg', credit:'NASA, Public Domain'},
  'sulfolobus':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Sulfolobus_solfataricus_electron_micrograph.jpg/640px-Sulfolobus_solfataricus_electron_micrograph.jpg', credit:'Dr. Wolfram Zillig, Public Domain'},
  'pyrolobus':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Hydrothermal_vent_-_Lost_City_2005.jpg/640px-Hydrothermal_vent_-_Lost_City_2005.jpg', credit:'NOAA, CC BY 2.0'},
  'lokiarchaeota':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Halobacterium_sp._NRC-1.jpg/640px-Halobacterium_sp._NRC-1.jpg', credit:'NASA, Public Domain'},
  // Fungi
  'fungi':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/640px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'ascomycetes':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/S_cerevisiae_under_DIC_microscopy.jpg/640px-S_cerevisiae_under_DIC_microscopy.jpg', credit:'Masur, Public Domain'},
  'saccharomyces':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/S_cerevisiae_under_DIC_microscopy.jpg/640px-S_cerevisiae_under_DIC_microscopy.jpg', credit:'Masur, Public Domain'},
  'penicillium':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Penicillium_chrysogenum.jpg/640px-Penicillium_chrysogenum.jpg', credit:'Ajc1, CC BY-SA 3.0'},
  'basidiomycetes':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/640px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'amanita-muscaria':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/640px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg', credit:'Onderwijsgek, CC BY-SA 3.0'},
  'armillaria':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Armillaria_ostoyae.jpg/640px-Armillaria_ostoyae.jpg', credit:'USFS, Public Domain'},
  'psilocybe':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Psilocybe_cubensis_Maui.jpg/640px-Psilocybe_cubensis_Maui.jpg', credit:'Workman, CC BY-SA 3.0'},
  'chytrids':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Litoria_caerulea_White%27s_tree_frog.jpg/640px-Litoria_caerulea_White%27s_tree_frog.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'batrachochytrium':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Litoria_caerulea_White%27s_tree_frog.jpg/640px-Litoria_caerulea_White%27s_tree_frog.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  // Plants
  'viridiplantae':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/640px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'plantae':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/640px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'mosses':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sphagnum_Moss.jpg/640px-Sphagnum_Moss.jpg', credit:'Bff, CC BY-SA 3.0'},
  'sphagnum':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sphagnum_Moss.jpg/640px-Sphagnum_Moss.jpg', credit:'Bff, CC BY-SA 3.0'},
  'liverworts':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Marchantia_polymorpha.jpg/640px-Marchantia_polymorpha.jpg', credit:'Hermann Schachner, CC0'},
  'marchantia':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Marchantia_polymorpha.jpg/640px-Marchantia_polymorpha.jpg', credit:'Hermann Schachner, CC0'},
  'angiosperms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/640px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'sunflower':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/640px-Sunflower_from_Silesia2.jpg', credit:'Malcom Manners, CC BY 2.0'},
  'arabidopsis':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Arabidopsis_thaliana_inflorescens.jpg/640px-Arabidopsis_thaliana_inflorescens.jpg', credit:'Nikolai Sitnov, Public Domain'},
  'rafflesia':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Rafflesia_arnoldii.jpg/640px-Rafflesia_arnoldii.jpg', credit:'Rendra Regen Rais, CC BY 2.0'},
  'titan-arum':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Amorphophallus_titanum2.jpg/640px-Amorphophallus_titanum2.jpg', credit:'Rhett A. Butler, CC BY 2.5'},
  'mimosa':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mimosa_pudica_touch.jpg/640px-Mimosa_pudica_touch.jpg', credit:'Hrushikesh, CC BY-SA 3.0'},
  'mimosa-pudica':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mimosa_pudica_touch.jpg/640px-Mimosa_pudica_touch.jpg', credit:'Hrushikesh, CC BY-SA 3.0'},
  'gymnosperms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/General_Sherman_tree_looking_up.jpg/640px-General_Sherman_tree_looking_up.jpg', credit:'Jim Bahn, CC BY 2.0'},
  'wollemi-pine':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Wollemi_Pine_in_habitat.jpg/640px-Wollemi_Pine_in_habitat.jpg', credit:'Brent Miller, CC BY 2.0'},
  'wollemia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Wollemi_Pine_in_habitat.jpg/640px-Wollemi_Pine_in_habitat.jpg', credit:'Brent Miller, CC BY 2.0'},
  'welwitschia':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Welwitschia_mirabilis2.jpg/640px-Welwitschia_mirabilis2.jpg', credit:'Thomas Schoch, CC BY-SA 2.5'},
  'sequoia':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/General_Sherman_tree_looking_up.jpg/640px-General_Sherman_tree_looking_up.jpg', credit:'Jim Bahn, CC BY 2.0'},
  'ferns':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cyathea_cooperi.jpg/640px-Cyathea_cooperi.jpg', credit:'Photohound, CC BY-SA 3.0'},
  'tree-fern':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cyathea_cooperi.jpg/640px-Cyathea_cooperi.jpg', credit:'Photohound, CC BY-SA 3.0'},
  'azolla':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Azolla_caroliniana.jpg/640px-Azolla_caroliniana.jpg', credit:'Christian Fischer, CC BY-SA 3.0'},
  // Animals
  'metazoa':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Turritopsis_nutricula.jpg/640px-Turritopsis_nutricula.jpg', credit:'Bachware, Public Domain'},
  'animalia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Turritopsis_nutricula.jpg/640px-Turritopsis_nutricula.jpg', credit:'Bachware, Public Domain'},
  'porifera':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Coral_reef_at_palmyra.jpg/640px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'cnidaria':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Turritopsis_nutricula.jpg/640px-Turritopsis_nutricula.jpg', credit:'Bachware, Public Domain'},
  'cnidarians':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Turritopsis_nutricula.jpg/640px-Turritopsis_nutricula.jpg', credit:'Bachware, Public Domain'},
  'turritopsis':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Turritopsis_nutricula.jpg/640px-Turritopsis_nutricula.jpg', credit:'Bachware, Public Domain'},
  'coral-reef':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Coral_reef_at_palmyra.jpg/640px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'arthropoda':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Odontodactylus_scyllarus.jpg/640px-Odontodactylus_scyllarus.jpg', credit:'Roy Caldwell, Public Domain'},
  'insecta':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/640px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'insects':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/640px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'honey-bee':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/640px-Apis_mellifera_Western_honey_bee.jpg', credit:'Charles J. Sharp, CC BY-SA 4.0'},
  'mantis-shrimp':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Odontodactylus_scyllarus.jpg/640px-Odontodactylus_scyllarus.jpg', credit:'Roy Caldwell, Public Domain'},
  'horseshoe-crab':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Horseshoe_crab_dig.jpg/640px-Horseshoe_crab_dig.jpg', credit:'Steve Droter/CBF, CC BY 2.0'},
  'mollusca':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Octopus3.jpg/640px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'cephalopods':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Octopus3.jpg/640px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'octopus':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Octopus3.jpg/640px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'octopus-day':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Octopus3.jpg/640px-Octopus3.jpg', credit:'Albert Kok, CC BY-SA 3.0'},
  'nautilus':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Nautilus_pompilius_%28head%29.jpg/640px-Nautilus_pompilius_%28head%29.jpg', credit:'Profberger, CC BY-SA 4.0'},
  'echinodermata':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Coral_reef_at_palmyra.jpg/640px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'echinoderms':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Coral_reef_at_palmyra.jpg/640px-Coral_reef_at_palmyra.jpg', credit:'USFWS, Public Domain'},
  'chordata':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Coelacanth_cast.jpg/640px-Coelacanth_cast.jpg', credit:'Citron, CC BY-SA 3.0'},
  'fish':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'sharks':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'shark':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'white-shark':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg', credit:'Pterantula, CC BY-SA 3.0'},
  'coelacanth':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Coelacanth_cast.jpg/640px-Coelacanth_cast.jpg', credit:'Citron, CC BY-SA 3.0'},
  'amphibia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Litoria_caerulea_White%27s_tree_frog.jpg/640px-Litoria_caerulea_White%27s_tree_frog.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'amphibians':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Litoria_caerulea_White%27s_tree_frog.jpg/640px-Litoria_caerulea_White%27s_tree_frog.jpg', credit:'LiquidGhoul, CC BY-SA 3.0'},
  'reptilia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Komodo_dragon_%28Varanus_komodoensis%29_-edit2.jpg/640px-Komodo_dragon_%28Varanus_komodoensis%29_-edit2.jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'reptiles':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Komodo_dragon_%28Varanus_komodoensis%29_-edit2.jpg/640px-Komodo_dragon_%28Varanus_komodoensis%29_-edit2.jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'komodo-dragon':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Komodo_dragon_%28Varanus_komodoensis%29_-edit2.jpg/640px-Komodo_dragon_%28Varanus_komodoensis%29_-edit2.jpg', credit:'Adhi Rachdian, CC BY 2.0'},
  'tuatara':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Tuatara_%28Sphenodon_punctatus%29.jpg/640px-Tuatara_%28Sphenodon_punctatus%29.jpg', credit:'KeresH, CC BY-SA 3.0'},
  'aves':                  {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Falco_peregrinus_-_01.jpg/640px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'birds':                 {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Falco_peregrinus_-_01.jpg/640px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'archaeopteryx':         {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Archaeopteryx_lithographica_%28Berlin_specimen%29.jpg/640px-Archaeopteryx_lithographica_%28Berlin_specimen%29.jpg', credit:'H. Raab, CC BY-SA 3.0'},
  'peregrine-falcon':      {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Falco_peregrinus_-_01.jpg/640px-Falco_peregrinus_-_01.jpg', credit:'Juan Lacruz, CC BY-SA 3.0'},
  'mammalia':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Humpback_whales_in_singing_position.jpg/640px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'mammals':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Humpback_whales_in_singing_position.jpg/640px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'cetaceans':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Humpback_whales_in_singing_position.jpg/640px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'blue-whale':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Humpback_whales_in_singing_position.jpg/640px-Humpback_whales_in_singing_position.jpg', credit:'NOAA, Public Domain'},
  'naked-mole-rat':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Naked_mole_rat.jpg/640px-Naked_mole_rat.jpg', credit:'Jedimentat44, CC BY 2.0'},
  'platypus':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Platypus.jpg/640px-Platypus.jpg', credit:'Stefan Kraft, CC BY-SA 3.0'},
  // Primates & great apes
  'primates':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/ChimpanzeeZoo.jpg/640px-ChimpanzeeZoo.jpg', credit:'Thomas Lersch, CC BY-SA 3.0'},
  'great-apes':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gorilla_gorilla_gorilla_-_Gorille_des_plaines_de_l%27ouest.jpg/640px-Gorilla_gorilla_gorilla_-_Gorille_des_plaines_de_l%27ouest.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'gorilla':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gorilla_gorilla_gorilla_-_Gorille_des_plaines_de_l%27ouest.jpg/640px-Gorilla_gorilla_gorilla_-_Gorille_des_plaines_de_l%27ouest.jpg', credit:'Brocken Inaglory, CC BY-SA 3.0'},
  'orangutan':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Orang_Utan%2C_Semenggok_Forest_Reserve%2C_Sarawak%2C_Borneo%2C_Malaysia.JPG/640px-Orang_Utan%2C_Semenggok_Forest_Reserve%2C_Sarawak%2C_Borneo%2C_Malaysia.JPG', credit:'Thorsten Bachner, CC BY-SA 3.0'},
  'chimpanzee':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/ChimpanzeeZoo.jpg/640px-ChimpanzeeZoo.jpg', credit:'Thomas Lersch, CC BY-SA 3.0'},
  'homo-sapiens':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Akha_woman.jpg/640px-Akha_woman.jpg', credit:'Steve Evans, CC BY 2.0'},
  // Protists
  'protists':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Diatoms_through_the_microscope.jpg/640px-Diatoms_through_the_microscope.jpg', credit:'Wipeter, CC BY-SA 3.0'},
  'alveolates':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dinoflagellate_bloom.jpg/640px-Dinoflagellate_bloom.jpg', credit:'NOAA, Public Domain'},
  'plasmodium':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plasmodium_falciparum_01.png/640px-Plasmodium_falciparum_01.png', credit:'CDC, Public Domain'},
  'dinoflagellates':       {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dinoflagellate_bloom.jpg/640px-Dinoflagellate_bloom.jpg', credit:'NOAA, Public Domain'},
  'diatoms':               {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Diatoms_through_the_microscope.jpg/640px-Diatoms_through_the_microscope.jpg', credit:'Wipeter, CC BY-SA 3.0'},
  'phytophthora':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Phytophthora_infestans_on_tomato.jpg/640px-Phytophthora_infestans_on_tomato.jpg', credit:'Ninjatacoshell, CC BY-SA 3.0'},
  'amoeba':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Amoeba_proteus_with_many_pseudopodia.jpg/640px-Amoeba_proteus_with_many_pseudopodia.jpg', credit:'Deuterostome, CC BY-SA 3.0'},
  'amoeba-proteus':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Amoeba_proteus_with_many_pseudopodia.jpg/640px-Amoeba_proteus_with_many_pseudopodia.jpg', credit:'Deuterostome, CC BY-SA 3.0'},
  'volvox':                {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Volvox_aureus.jpg/640px-Volvox_aureus.jpg', credit:'Frank Fox, CC BY-SA 3.0'},
  // Hominin fossils
  'homo-naledi':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Homo_naledi_skull.jpg/640px-Homo_naledi_skull.jpg', credit:'Lee Roger Berger, CC BY 4.0'},
  'h_naledi':              {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Homo_naledi_skull.jpg/640px-Homo_naledi_skull.jpg', credit:'Lee Roger Berger, CC BY 4.0'},
  'homo-floresiensis':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Homo_floresiensis_cave.jpg/640px-Homo_floresiensis_cave.jpg', credit:'Rosino, CC BY-SA 2.0'},
  'h_floresiensis':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Homo_floresiensis_cave.jpg/640px-Homo_floresiensis_cave.jpg', credit:'Rosino, CC BY-SA 2.0'},
  'h_luzonensis':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Callao_Cave_Entrance.jpg/640px-Callao_Cave_Entrance.jpg', credit:'Judgefloro, CC0'},
  'denisovan':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Denisova_Cave_main_gallery.jpg/640px-Denisova_Cave_main_gallery.jpg', credit:'Демин Алексей Барнаул, CC BY-SA 3.0'},
  'denisovans':            {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Denisova_Cave_main_gallery.jpg/640px-Denisova_Cave_main_gallery.jpg', credit:'Демин Алексей Барнаул, CC BY-SA 3.0'},
  'h_neanderthalensis':    {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Homo_neanderthalensis.jpg/640px-Homo_neanderthalensis.jpg', credit:'Erich Ferdinand, CC BY 2.0'},
  'neanderthal':           {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Homo_neanderthalensis.jpg/640px-Homo_neanderthalensis.jpg', credit:'Erich Ferdinand, CC BY 2.0'},
  'h_erectus':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Turkana_Boy_1.JPG/640px-Turkana_Boy_1.JPG', credit:'Locutus Borg, CC BY-SA 3.0'},
  'h_heidelbergensis':     {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Homo_heidelbergensis-male.jpg/640px-Homo_heidelbergensis-male.jpg', credit:'Cicero Moraes, CC BY-SA 3.0'},
  'h_habilis':             {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Homo_habilis-2.JPG/640px-Homo_habilis-2.JPG', credit:'Lillyundfreya, CC BY-SA 2.5'},
  'au_afarensis':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Lucy_Skeleton.jpg/640px-Lucy_Skeleton.jpg', credit:'Cleveland Museum, CC BY 4.0'},
  'au_africanus':          {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Australopithecus_africanus_-_Cast_of_taung_child.jpg/640px-Australopithecus_africanus_-_Cast_of_taung_child.jpg', credit:'José Braga/Didier Descouens, CC BY-SA 4.0'},
  'sahelanthropus':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg/640px-Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg', credit:'Didier Descouens, CC BY-SA 4.0'},
  'ardipithecus_r':        {url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Ardipithecus_ramidus_-_Scientific_reconstruction.jpg/640px-Ardipithecus_ramidus_-_Scientific_reconstruction.jpg', credit:'Science, Educational use'},
};

const GREAT_APE_IDS = ['great-apes','gorilla','orangutan','chimpanzee','hominini'];
const HOMININ_IDS   = ['homo-sapiens','h_erectus','h_habilis','h_neanderthalensis','h_heidelbergensis','h_floresiensis','h_naledi','h_luzonensis','denisovan','au_afarensis','au_africanus','sahelanthropus','ardipithecus_r'];
