// ══════════════════════════════════════════════════════
// SPECIES STATS — gamified stat profiles, archetypes,
// strengths & weaknesses for species info panel
// ══════════════════════════════════════════════════════

const SPECIES_STATS = {
  // ── MEGAFAUNA ──
  'blue-whale': {
    archetype: 'Ocean Titan',
    stats: { size: 10, speed: 6, intelligence: 7, sociality: 6, adaptability: 5, danger: 2 },
    strengths: [
      { icon: '\u{1F40B}', label: 'Largest Ever', desc: 'Largest animal to have ever lived — up to 30 m and 180 tonnes' },
      { icon: '\u{1F50A}', label: 'Long-Range Song', desc: 'Low-frequency calls travel over 1,600 km across ocean basins' },
      { icon: '\u{1FAC1}', label: 'Oxygen Efficiency', desc: 'A single breath fuels 20-minute dives to 500 m depth' }
    ],
    weaknesses: [
      { icon: '\u{1F6A2}', label: 'Ship Strikes', desc: 'Major mortality source from commercial shipping lanes' },
      { icon: '\u{1F507}', label: 'Noise Pollution', desc: 'Sonar and engine noise disrupts communication and navigation' },
      { icon: '\u{1F423}', label: 'Slow Reproduction', desc: 'One calf every 2-3 years after 11-month gestation' }
    ]
  },
  'african-elephant': {
    archetype: 'Gentle Giant',
    stats: { size: 9, speed: 5, intelligence: 9, sociality: 9, adaptability: 6, danger: 6 },
    strengths: [
      { icon: '\u{1F9E0}', label: 'Exceptional Memory', desc: 'Remembers water sources, migration routes, and individuals for decades' },
      { icon: '\u{1F46A}', label: 'Matriarchal Society', desc: 'Herds led by experienced matriarchs with complex social bonds' },
      { icon: '\u{1F4AA}', label: 'Ecosystem Engineer', desc: 'Creates water holes, clears paths, and shapes entire landscapes' }
    ],
    weaknesses: [
      { icon: '\u{1F9B7}', label: 'Ivory Poaching', desc: 'Tusks make them a prime target for illegal wildlife trade' },
      { icon: '\u{1F3D7}', label: 'Habitat Fragmentation', desc: 'Needs vast ranges; increasingly blocked by human infrastructure' },
      { icon: '\u{1F4C5}', label: 'Long Gestation', desc: '22-month pregnancy — the longest of any land animal' }
    ]
  },
  'giraffe': {
    archetype: 'Canopy Browser',
    stats: { size: 8, speed: 7, intelligence: 5, sociality: 5, adaptability: 4, danger: 3 },
    strengths: [
      { icon: '\u{1F333}', label: 'Height Advantage', desc: 'At 5.5 m tall, feeds on foliage no competitor can reach' },
      { icon: '\u{2764}', label: 'Powerful Heart', desc: '11 kg heart generates twice the blood pressure of other mammals' },
      { icon: '\u{1F441}', label: 'Panoramic Vision', desc: 'Elevated eyes provide the best vantage point on the savanna' }
    ],
    weaknesses: [
      { icon: '\u{1F4A7}', label: 'Vulnerable Drinking', desc: 'Must splay legs awkwardly to drink, exposing neck to predators' },
      { icon: '\u{26A1}', label: 'Lightning Risk', desc: 'Tallest object on the plains — disproportionately struck by lightning' },
      { icon: '\u{1F476}', label: 'Calf Mortality', desc: 'Over 50% of calves are killed by predators in their first year' }
    ]
  },

  // ── APEX PREDATORS ──
  'white-shark': {
    archetype: 'Apex Predator',
    stats: { size: 8, speed: 8, intelligence: 5, sociality: 2, adaptability: 7, danger: 9 },
    strengths: [
      { icon: '\u{1F9B7}', label: 'Electroreception', desc: 'Ampullae of Lorenzini detect electrical fields of hidden prey' },
      { icon: '\u{1F525}', label: 'Warm-Blooded Edge', desc: 'Regional endothermy keeps muscles warm for explosive speed bursts' },
      { icon: '\u{267B}', label: 'Tooth Regeneration', desc: 'Produces over 20,000 teeth in a lifetime — never runs out' }
    ],
    weaknesses: [
      { icon: '\u{1F423}', label: 'Slow Maturity', desc: 'Takes 12-15 years to reach sexual maturity; few offspring' },
      { icon: '\u{1FA7C}', label: 'Bycatch Risk', desc: 'Frequently caught as bycatch in commercial fishing operations' },
      { icon: '\u{1F30A}', label: 'Orca Predation', desc: 'Orcas have learned to hunt great whites for their nutrient-rich livers' }
    ]
  },
  'lion': {
    archetype: 'Pack Strategist',
    stats: { size: 7, speed: 8, intelligence: 7, sociality: 9, adaptability: 5, danger: 9 },
    strengths: [
      { icon: '\u{1F43E}', label: 'Cooperative Hunting', desc: 'Prides use coordinated ambush tactics to take down large prey' },
      { icon: '\u{1F981}', label: 'Territorial Dominance', desc: 'Males defend territories of up to 400 km\u00B2 with deafening roars' },
      { icon: '\u{1F4AA}', label: 'Brute Strength', desc: 'Bite force of 650 PSI; can bring down buffalo and young elephants' }
    ],
    weaknesses: [
      { icon: '\u{1F3D9}', label: 'Habitat Loss', desc: 'African lion range has shrunk by 90% in the last century' },
      { icon: '\u{2694}', label: 'Infanticide', desc: 'New dominant males kill existing cubs to bring females into estrus' },
      { icon: '\u{1F3AF}', label: 'Trophy Hunting', desc: 'Legal and illegal hunting remains a significant population pressure' }
    ]
  },
  'tiger': {
    archetype: 'Stealth Hunter',
    stats: { size: 7, speed: 8, intelligence: 7, sociality: 2, adaptability: 5, danger: 10 },
    strengths: [
      { icon: '\u{1F405}', label: 'Ambush Mastery', desc: 'Striped camouflage enables near-invisible approach in tall grass' },
      { icon: '\u{1F4AA}', label: 'Raw Power', desc: 'Can drag prey twice their own weight up a hillside' },
      { icon: '\u{1F3CA}', label: 'Strong Swimmer', desc: 'Readily crosses rivers and lakes — hunts in water when needed' }
    ],
    weaknesses: [
      { icon: '\u{1F30D}', label: 'Range Collapse', desc: 'Occupies only 7% of its historical range across Asia' },
      { icon: '\u{1F48A}', label: 'TCM Poaching', desc: 'Traditional medicine demand drives persistent poaching pressure' },
      { icon: '\u{1F6B6}', label: 'Solitary Life', desc: 'Territorial isolation makes finding mates increasingly difficult' }
    ]
  },
  'orca': {
    archetype: 'Ocean Strategist',
    stats: { size: 8, speed: 8, intelligence: 9, sociality: 10, adaptability: 8, danger: 9 },
    strengths: [
      { icon: '\u{1F9E0}', label: 'Cultural Transmission', desc: 'Distinct hunting techniques passed down through matrilineal pods' },
      { icon: '\u{1F91D}', label: 'Cooperative Tactics', desc: 'Wave-washing seals off ice floes, carousel feeding on herring' },
      { icon: '\u{1F30D}', label: 'Global Range', desc: 'Found in every ocean from the Arctic to Antarctic' }
    ],
    weaknesses: [
      { icon: '\u{2623}', label: 'Bioaccumulation', desc: 'Apex position means extreme accumulation of PCBs and heavy metals' },
      { icon: '\u{1F507}', label: 'Acoustic Disturbance', desc: 'Shipping noise interferes with echolocation and communication' },
      { icon: '\u{1F41F}', label: 'Prey Depletion', desc: 'Salmon-specialist pods starving as fish stocks collapse' }
    ]
  },
  'komodo-dragon': {
    archetype: 'Living Fossil',
    stats: { size: 7, speed: 5, intelligence: 4, sociality: 2, adaptability: 6, danger: 8 },
    strengths: [
      { icon: '\u{1F9EA}', label: 'Venomous Bite', desc: 'Venom glands deliver anticoagulant toxins that prevent wound clotting' },
      { icon: '\u{1F52C}', label: 'Chemical Tracking', desc: 'Forked tongue samples airborne molecules to track prey over kilometers' },
      { icon: '\u{1F9B4}', label: 'Iron-Coated Teeth', desc: 'Tooth enamel reinforced with iron for serrated cutting edges' }
    ],
    weaknesses: [
      { icon: '\u{1F3DD}', label: 'Island Isolation', desc: 'Restricted to a few Indonesian islands — tiny global range' },
      { icon: '\u{1F321}', label: 'Temperature Dependent', desc: 'Ectothermic — activity drops dramatically in cool weather' },
      { icon: '\u{1F95A}', label: 'Nest Vulnerability', desc: 'Eggs incubated 7-8 months; hatchlings must flee cannibalistic adults' }
    ]
  },
  'saltwater-crocodile': {
    archetype: 'Ambush Titan',
    stats: { size: 8, speed: 6, intelligence: 5, sociality: 2, adaptability: 8, danger: 10 },
    strengths: [
      { icon: '\u{1F9B7}', label: 'Crushing Bite', desc: 'Bite force of 3,700 PSI — strongest of any living animal' },
      { icon: '\u{23F3}', label: 'Patience Hunter', desc: 'Can wait motionless for hours, then explode from water in milliseconds' },
      { icon: '\u{1F9EC}', label: 'Ancient Design', desc: '200 million years of evolution with virtually unchanged body plan' }
    ],
    weaknesses: [
      { icon: '\u{1F4A8}', label: 'Weak Jaw Opening', desc: 'Massive closing force but jaw-opening muscles are surprisingly weak' },
      { icon: '\u{2744}', label: 'Cold Intolerance', desc: 'Cannot regulate body temperature — dormant in cool periods' },
      { icon: '\u{1F95A}', label: 'Nest Predation', desc: 'Monitor lizards and wild pigs raid nests; 99% of hatchlings die' }
    ]
  },
  'peregrine-falcon': {
    archetype: 'Speed Demon',
    stats: { size: 3, speed: 10, intelligence: 6, sociality: 3, adaptability: 8, danger: 5 },
    strengths: [
      { icon: '\u{1F4A8}', label: 'Fastest Animal', desc: 'Stoops at over 390 km/h — the fastest creature on Earth' },
      { icon: '\u{1F441}', label: 'Raptor Vision', desc: 'Resolves detail at 8x human acuity; tracks prey from 3 km away' },
      { icon: '\u{1F3D9}', label: 'Urban Adaptation', desc: 'Thrives on skyscraper ledges, treating cities as artificial cliffs' }
    ],
    weaknesses: [
      { icon: '\u{2623}', label: 'DDT Legacy', desc: 'Nearly driven extinct by pesticide-caused eggshell thinning' },
      { icon: '\u{1F3AF}', label: 'High-Speed Risk', desc: 'Stoop miscalculations at 390 km/h can be instantly fatal' },
      { icon: '\u{1F4A1}', label: 'Light Pollution', desc: 'Urban lights disorient migratory prey and disrupt hunting patterns' }
    ]
  },
  'gray-wolf': {
    archetype: 'Pack Strategist',
    stats: { size: 6, speed: 7, intelligence: 8, sociality: 10, adaptability: 8, danger: 7 },
    strengths: [
      { icon: '\u{1F43A}', label: 'Pack Coordination', desc: 'Complex social hierarchy enables coordinated pursuit hunting' },
      { icon: '\u{1F4CF}', label: 'Endurance Running', desc: 'Can maintain a steady trot for hours, exhausting prey over distance' },
      { icon: '\u{1F30D}', label: 'Habitat Versatility', desc: 'Thrives from Arctic tundra to deserts to temperate forests' }
    ],
    weaknesses: [
      { icon: '\u{1F468}', label: 'Human Conflict', desc: 'Centuries of persecution from livestock predation; still controversial' },
      { icon: '\u{1F3D7}', label: 'Territory Needs', desc: 'Packs require 80-1,000 km\u00B2 — squeezed by human land use' },
      { icon: '\u{1FA7A}', label: 'Disease Susceptibility', desc: 'Canine distemper and mange can devastate entire packs' }
    ]
  },

  // ── INTELLIGENT SPECIES ──
  'homo-sapiens': {
    archetype: 'Keystone Species',
    stats: { size: 5, speed: 5, intelligence: 10, sociality: 10, adaptability: 10, danger: 10 },
    strengths: [
      { icon: '\u{1F9E0}', label: 'Abstract Thought', desc: 'Language, mathematics, art — no other species comes close' },
      { icon: '\u{1F30D}', label: 'Global Colonizer', desc: 'Inhabits every continent and biome; reached space in 300,000 years' },
      { icon: '\u{1F91D}', label: 'Cumulative Culture', desc: 'Knowledge compounds across generations — each builds on the last' }
    ],
    weaknesses: [
      { icon: '\u{1F4A5}', label: 'Self-Destructive', desc: 'Unique capacity for warfare, ecological destruction, and extinction causation' },
      { icon: '\u{1F476}', label: 'Helpless Infancy', desc: 'Born profoundly undeveloped; years of parental investment required' },
      { icon: '\u{1FA7A}', label: 'Chronic Disease', desc: 'Agriculture and sedentism introduced obesity, diabetes, and pandemics' }
    ]
  },
  'chimpanzee': {
    archetype: 'Tool Maker',
    stats: { size: 5, speed: 6, intelligence: 9, sociality: 9, adaptability: 6, danger: 7 },
    strengths: [
      { icon: '\u{1F9F0}', label: 'Tool Innovation', desc: 'Crafts and uses 20+ distinct tool types — sticks, sponges, hammers' },
      { icon: '\u{1F4AA}', label: 'Superior Strength', desc: 'Pound-for-pound 1.5x stronger than humans due to muscle fiber density' },
      { icon: '\u{1F9EC}', label: 'Genetic Kin', desc: '98.7% DNA similarity to humans — our closest living relative' }
    ],
    weaknesses: [
      { icon: '\u{1F332}', label: 'Forest Dependent', desc: 'Requires intact tropical forest — cannot survive habitat conversion' },
      { icon: '\u{1FA7A}', label: 'Disease Transfer', desc: 'Highly susceptible to human diseases like Ebola and respiratory viruses' },
      { icon: '\u{2694}', label: 'Lethal Aggression', desc: 'Inter-group warfare and infanticide are significant mortality sources' }
    ]
  },
  'gorilla': {
    archetype: 'Gentle Giant',
    stats: { size: 7, speed: 5, intelligence: 8, sociality: 8, adaptability: 4, danger: 6 },
    strengths: [
      { icon: '\u{1F4AA}', label: 'Immense Strength', desc: '10x stronger than an adult human; can bend iron bars' },
      { icon: '\u{1F46A}', label: 'Family Bonds', desc: 'Silverbacks protect family groups with fierce loyalty and tenderness' },
      { icon: '\u{1F33F}', label: 'Herbivore Efficiency', desc: 'Extracts nutrients from 200+ plant species; gut adapted for cellulose' }
    ],
    weaknesses: [
      { icon: '\u{1FA7A}', label: 'Ebola Devastation', desc: 'Ebola outbreaks have killed up to 95% of local gorilla populations' },
      { icon: '\u{1F423}', label: 'Slow Reproduction', desc: 'One infant every 4-6 years; population recovery is glacially slow' },
      { icon: '\u{1F3D7}', label: 'Habitat Shrinkage', desc: 'Mountain gorillas confined to two tiny forest patches in central Africa' }
    ]
  },
  'orangutan': {
    archetype: 'Canopy Sage',
    stats: { size: 6, speed: 4, intelligence: 9, sociality: 3, adaptability: 4, danger: 4 },
    strengths: [
      { icon: '\u{1F9E0}', label: 'Problem Solving', desc: 'Uses tools, plans ahead, and learns complex tasks from observation' },
      { icon: '\u{1F333}', label: 'Arboreal Mastery', desc: 'Builds new sleeping nests every night from branches and leaves' },
      { icon: '\u{1F4D6}', label: 'Cultural Learning', desc: 'Different populations have distinct cultural traditions passed to offspring' }
    ],
    weaknesses: [
      { icon: '\u{1F525}', label: 'Palm Oil Crisis', desc: 'Borneo deforestation for palm oil is the primary extinction driver' },
      { icon: '\u{1F6B6}', label: 'Semi-Solitary', desc: 'Low population density and solitary nature make breeding encounters rare' },
      { icon: '\u{1F4C5}', label: 'Longest Birth Interval', desc: '8-year gap between births — slowest of any mammal' }
    ]
  },
  'octopus': {
    archetype: 'Alien Intelligence',
    stats: { size: 4, speed: 7, intelligence: 9, sociality: 1, adaptability: 9, danger: 3 },
    strengths: [
      { icon: '\u{1F9E0}', label: 'Distributed Brain', desc: 'Two-thirds of neurons are in the arms — each arm thinks independently' },
      { icon: '\u{1F3A8}', label: 'Instant Camouflage', desc: 'Changes color, texture, and shape in milliseconds using chromatophores' },
      { icon: '\u{1F4AA}', label: 'Boneless Escape', desc: 'Entire body can squeeze through any gap larger than its beak' }
    ],
    weaknesses: [
      { icon: '\u{23F3}', label: 'Short Lifespan', desc: 'Most species live only 1-2 years despite enormous cognitive investment' },
      { icon: '\u{1F494}', label: 'Senescent Death', desc: 'Females die after egg-guarding; males senesce after mating' },
      { icon: '\u{1F6B6}', label: 'Solitary Existence', desc: 'Intelligence cannot accumulate culturally — each generation starts fresh' }
    ]
  },
  'bottlenose-dolphin': {
    archetype: 'Ocean Empath',
    stats: { size: 5, speed: 8, intelligence: 9, sociality: 10, adaptability: 7, danger: 3 },
    strengths: [
      { icon: '\u{1F4E1}', label: 'Echolocation', desc: 'Sonar resolution can detect a golf ball at 100 meters in murky water' },
      { icon: '\u{1F91D}', label: 'Alliance Networks', desc: 'Males form multi-level alliances — politics rivaling primate societies' },
      { icon: '\u{1F3CA}', label: 'Breath-Hold Diving', desc: 'Can dive 300+ meters and hold breath for 12 minutes' }
    ],
    weaknesses: [
      { icon: '\u{1F3A3}', label: 'Bycatch Mortality', desc: 'Gill nets and trawls kill hundreds of thousands of dolphins annually' },
      { icon: '\u{2623}', label: 'Pollution Burden', desc: 'Coastal habitats concentrate toxins in their blubber' },
      { icon: '\u{1F3E2}', label: 'Captivity Stress', desc: 'Highly social brains suffer profoundly from tank confinement' }
    ]
  },

  // ── EXTREME SURVIVORS ──
  'tardigrade': {
    archetype: 'Micro Titan',
    stats: { size: 1, speed: 1, intelligence: 1, sociality: 1, adaptability: 10, danger: 1 },
    strengths: [
      { icon: '\u{2744}', label: 'Cryptobiosis', desc: 'Survives -272\u00B0C to 150\u00B0C by entering a dehydrated tun state' },
      { icon: '\u{2622}', label: 'Radiation Proof', desc: 'Withstands 1,000x the lethal human radiation dose via DNA repair proteins' },
      { icon: '\u{1F680}', label: 'Space Survivor', desc: 'Survived 10 days of unprotected exposure to the vacuum of space' }
    ],
    weaknesses: [
      { icon: '\u{1F52C}', label: 'Microscopic', desc: 'At 0.1-1.5 mm, vulnerable to being consumed by virtually everything' },
      { icon: '\u{1F40C}', label: 'Minimal Mobility', desc: 'Stumpy legs move at a glacial 2-3 body lengths per second' },
      { icon: '\u{1F4A7}', label: 'Needs Water Active', desc: 'Must be in a water film to eat, move, or reproduce — dry = dormant' }
    ]
  },
  'deinococcus': {
    archetype: 'Extremophile',
    stats: { size: 1, speed: 1, intelligence: 1, sociality: 3, adaptability: 10, danger: 1 },
    strengths: [
      { icon: '\u{2622}', label: 'Radiation King', desc: 'Survives 5,000 Gy of radiation — 500x the human lethal dose' },
      { icon: '\u{1F9EC}', label: 'DNA Repair', desc: 'Reassembles shattered genome from hundreds of fragments in hours' },
      { icon: '\u{1F6E1}', label: 'Antioxidant Shield', desc: 'Manganese complexes protect proteins while DNA is being repaired' }
    ],
    weaknesses: [
      { icon: '\u{1F52C}', label: 'Tiny Size', desc: 'A single bacterium — no structural defenses against predation' },
      { icon: '\u{1F374}', label: 'Limited Metabolism', desc: 'Slow-growing heterotroph; outcompeted in nutrient-rich environments' },
      { icon: '\u{1F3DC}', label: 'Niche Specialist', desc: 'Extreme tolerance is overkill in most habitats — a costly strategy' }
    ]
  },
  'coelacanth': {
    archetype: 'Living Fossil',
    stats: { size: 6, speed: 3, intelligence: 3, sociality: 2, adaptability: 5, danger: 2 },
    strengths: [
      { icon: '\u{23F3}', label: '400 Million Years', desc: 'Virtually unchanged since the Devonian — older than dinosaurs' },
      { icon: '\u{1F9B4}', label: 'Lobed Fins', desc: 'Fleshy, limb-like fins hint at the fish-to-tetrapod transition' },
      { icon: '\u{1F30A}', label: 'Deep Refuge', desc: 'Lives at 150-700 m depth, sheltered from surface-world changes' }
    ],
    weaknesses: [
      { icon: '\u{1F3DD}', label: 'Tiny Range', desc: 'Known from only two locations — Comoros Islands and South Africa' },
      { icon: '\u{1F423}', label: 'Slow Reproduction', desc: 'Gestation may last 3-5 years — one of the longest of any vertebrate' },
      { icon: '\u{1F321}', label: 'Temperature Sensitive', desc: 'Requires stable deep-water temperatures; climate change is a threat' }
    ]
  },
  'horseshoe-crab': {
    archetype: 'Living Fossil',
    stats: { size: 4, speed: 2, intelligence: 2, sociality: 4, adaptability: 8, danger: 1 },
    strengths: [
      { icon: '\u{23F3}', label: '450 Million Years', desc: 'Predates dinosaurs by 200 million years; survived all 5 mass extinctions' },
      { icon: '\u{1FA78}', label: 'Blue Blood', desc: 'Copper-based blood with LAL clotting agent — essential for medical safety testing' },
      { icon: '\u{1F440}', label: '10 Eyes', desc: 'Ten eyes of different types detect UV, visible light, and even infrared' }
    ],
    weaknesses: [
      { icon: '\u{1F3E5}', label: 'Biomedical Harvest', desc: 'Hundreds of thousands bled annually for LAL extraction' },
      { icon: '\u{1F3D6}', label: 'Beach Dependence', desc: 'Must spawn on sandy beaches — coastal development destroys spawning grounds' },
      { icon: '\u{1F41E}', label: 'Not a Crab', desc: 'Closer to spiders than crabs — misunderstood and often killed on sight' }
    ]
  },
  'tuatara': {
    archetype: 'Living Fossil',
    stats: { size: 4, speed: 3, intelligence: 4, sociality: 2, adaptability: 5, danger: 2 },
    strengths: [
      { icon: '\u{1F440}', label: 'Third Eye', desc: 'Parietal eye on top of skull detects light/dark cycles for thermoregulation' },
      { icon: '\u{23F3}', label: '250 Million Years', desc: 'Sole survivor of order Rhynchocephalia — last of an ancient lineage' },
      { icon: '\u{2744}', label: 'Cold Tolerance', desc: 'Active at 5-11\u00B0C — far colder than any other reptile can tolerate' }
    ],
    weaknesses: [
      { icon: '\u{1F3DD}', label: 'Island Only', desc: 'Restricted to 32 tiny New Zealand islands — no mainland populations' },
      { icon: '\u{1F401}', label: 'Rat Predation', desc: 'Introduced rats devastated populations by eating eggs and juveniles' },
      { icon: '\u{1F4C5}', label: 'Glacial Maturity', desc: 'Takes 10-20 years to reach sexual maturity; breeds every 4 years' }
    ]
  },
  'nautilus': {
    archetype: 'Deep Drifter',
    stats: { size: 3, speed: 2, intelligence: 3, sociality: 2, adaptability: 5, danger: 1 },
    strengths: [
      { icon: '\u{1F41A}', label: 'Buoyancy Control', desc: 'Chambered shell acts as a precision ballast system for vertical migration' },
      { icon: '\u{23F3}', label: '500 Million Years', desc: 'Survived all five mass extinctions with a design older than fish' },
      { icon: '\u{1F9F2}', label: 'Jet Propulsion', desc: 'Siphon-powered jet locomotion — the original biological rocket' }
    ],
    weaknesses: [
      { icon: '\u{1F41A}', label: 'Shell Trade', desc: 'Beautiful shells make them targets for collectors and jewelry makers' },
      { icon: '\u{1F440}', label: 'Pinhole Eyes', desc: 'Camera-like but lensless eyes — far worse vision than modern cephalopods' },
      { icon: '\u{1F4CA}', label: 'Depth Limit', desc: 'Shell implodes below 800 m — cannot escape to the deep ocean' }
    ]
  },

  // ── PLANTS ──
  'sequoia': {
    archetype: 'Ancient Colossus',
    stats: { size: 10, speed: 1, intelligence: 1, sociality: 5, adaptability: 4, danger: 1 },
    strengths: [
      { icon: '\u{1F332}', label: 'Tallest Living Thing', desc: 'Coast redwoods reach 115 m — taller than the Statue of Liberty' },
      { icon: '\u{1F525}', label: 'Fire Adapted', desc: 'Bark up to 30 cm thick insulates against wildfire' },
      { icon: '\u{23F3}', label: 'Millennial Lifespan', desc: 'Individual trees live 2,000+ years; some groves are 3,000+ years old' }
    ],
    weaknesses: [
      { icon: '\u{1F32B}', label: 'Fog Dependent', desc: 'Needs coastal fog for 25-40% of water intake — vulnerable to climate shifts' },
      { icon: '\u{1FAB5}', label: 'Logging History', desc: '96% of old-growth redwood forest has been cut since 1850' },
      { icon: '\u{1F525}', label: 'Megafire Threat', desc: 'While fire-adapted, unprecedented megafires now overwhelm even thick bark' }
    ]
  },
  'venus-flytrap': {
    archetype: 'Chemical Warrior',
    stats: { size: 1, speed: 3, intelligence: 2, sociality: 1, adaptability: 3, danger: 2 },
    strengths: [
      { icon: '\u{26A1}', label: 'Snap Trap', desc: 'Closes in 100 milliseconds — one of the fastest movements in the plant kingdom' },
      { icon: '\u{1F9EC}', label: 'Counting Ability', desc: 'Trigger hairs must be touched twice in 20 seconds — prevents false alarms' },
      { icon: '\u{1F9EA}', label: 'Digestive Enzymes', desc: 'Produces its own proteases and chitinases to dissolve insect prey' }
    ],
    weaknesses: [
      { icon: '\u{1F3DD}', label: 'Tiny Native Range', desc: 'Wild populations only within 120 km of Wilmington, North Carolina' },
      { icon: '\u{1F4B0}', label: 'Poaching', desc: 'Wild poaching is a felony in NC yet remains a persistent threat' },
      { icon: '\u{1F525}', label: 'Fire Dependent', desc: 'Needs periodic fire to prevent overgrowth by competing plants' }
    ]
  },

  // ── MICRO-ORGANISMS ──
  'ecoli': {
    archetype: 'Micro Titan',
    stats: { size: 1, speed: 2, intelligence: 1, sociality: 7, adaptability: 9, danger: 3 },
    strengths: [
      { icon: '\u{23F1}', label: 'Rapid Division', desc: 'Doubles every 20 minutes — one cell becomes billions overnight' },
      { icon: '\u{1F9EC}', label: 'Gene Swapping', desc: 'Horizontal gene transfer acquires antibiotic resistance in real time' },
      { icon: '\u{1F52C}', label: 'Lab Workhorse', desc: 'The most studied organism on Earth; backbone of biotechnology' }
    ],
    weaknesses: [
      { icon: '\u{2623}', label: 'Pathogenic Strains', desc: 'O157:H7 and similar strains cause deadly outbreaks, damaging the species reputation' },
      { icon: '\u{1FA7A}', label: 'Antibiotic Arms Race', desc: 'Resistance genes spread fast but new antibiotics target E. coli first' },
      { icon: '\u{1F321}', label: 'Temperature Bound', desc: 'Optimal at 37\u00B0C; cannot survive extended heat or cold extremes' }
    ]
  },

  // ── NOTABLE INVERTEBRATES ──
  'honey-bee': {
    archetype: 'Swarm Intelligence',
    stats: { size: 1, speed: 4, intelligence: 6, sociality: 10, adaptability: 6, danger: 3 },
    strengths: [
      { icon: '\u{1F4AC}', label: 'Waggle Dance', desc: 'Communicates precise flower locations through symbolic body language' },
      { icon: '\u{1F36F}', label: 'Food Engineering', desc: 'Converts nectar into honey — a food with virtually infinite shelf life' },
      { icon: '\u{1F331}', label: 'Pollination Engine', desc: 'Responsible for pollinating 75% of the world\u2019s flowering plant species' }
    ],
    weaknesses: [
      { icon: '\u{1FA7A}', label: 'Colony Collapse', desc: 'CCD has devastated populations — causes still debated but likely multifactorial' },
      { icon: '\u{1F9EA}', label: 'Neonicotinoids', desc: 'Pesticides impair navigation, memory, and immune response at sub-lethal doses' },
      { icon: '\u{1F41E}', label: 'Varroa Mites', desc: 'Parasitic mites feed on fat bodies, transmit viruses, and weaken colonies' }
    ]
  },
  'mantis-shrimp': {
    archetype: 'Super Sensor',
    stats: { size: 3, speed: 9, intelligence: 5, sociality: 2, adaptability: 5, danger: 7 },
    strengths: [
      { icon: '\u{1F44A}', label: 'Ballistic Strike', desc: 'Clubs accelerate at 10,400 g — strike creates cavitation bubbles that flash-boil water' },
      { icon: '\u{1F308}', label: 'Hyperspectral Vision', desc: '16 types of photoreceptors see UV, visible, and polarized light' },
      { icon: '\u{1F6E1}', label: 'Bio-Armor', desc: 'Club structure inspires military body armor — absorbs impact without cracking' }
    ],
    weaknesses: [
      { icon: '\u{1F3DD}', label: 'Reef Dependent', desc: 'Needs coral reef burrows — directly threatened by reef bleaching' },
      { icon: '\u{1F6B6}', label: 'Territorial Isolation', desc: 'Fiercely territorial; kills tankmates in aquariums and conspecifics in the wild' },
      { icon: '\u{1F52C}', label: 'Small Size', desc: 'Despite fearsome weapons, eaten by groupers, octopuses, and larger predators' }
    ]
  },
  'monarch-butterfly': {
    archetype: 'Endurance Champion',
    stats: { size: 1, speed: 4, intelligence: 3, sociality: 6, adaptability: 4, danger: 1 },
    strengths: [
      { icon: '\u{1F9ED}', label: 'Epic Migration', desc: '4,800 km journey across North America using a sun compass and magnetic sense' },
      { icon: '\u{2623}', label: 'Toxic Warning', desc: 'Milkweed-derived cardenolides make them poisonous; orange warns predators' },
      { icon: '\u{1F504}', label: 'Multi-Generation Relay', desc: 'Migration spans 4 generations — the final "super generation" lives 8x longer' }
    ],
    weaknesses: [
      { icon: '\u{1F33F}', label: 'Milkweed Decline', desc: 'Herbicide-resistant crops eliminated milkweed from 80% of farmland' },
      { icon: '\u{1F321}', label: 'Climate Disruption', desc: 'Warming shifts milkweed phenology out of sync with migration timing' },
      { icon: '\u{1F332}', label: 'Overwintering Threat', desc: 'Mexican oyamel fir forests — the only winter refuge — are shrinking' }
    ]
  },

  // ── NOTABLE REPTILES & AMPHIBIANS ──
  'green-sea-turtle': {
    archetype: 'Ocean Navigator',
    stats: { size: 6, speed: 5, intelligence: 4, sociality: 3, adaptability: 5, danger: 1 },
    strengths: [
      { icon: '\u{1F9ED}', label: 'Magnetic Navigation', desc: 'Returns to the exact beach of its birth using Earth\u2019s magnetic field' },
      { icon: '\u{1F3CA}', label: 'Ocean Endurance', desc: 'Migrates up to 2,600 km between feeding and nesting grounds' },
      { icon: '\u{23F3}', label: 'Ancient Lineage', desc: '110 million years of sea turtle evolution — outlived the dinosaurs' }
    ],
    weaknesses: [
      { icon: '\u{1FAA3}', label: 'Plastic Ingestion', desc: 'Mistakes plastic bags for jellyfish — leading cause of juvenile mortality' },
      { icon: '\u{1F4A1}', label: 'Light Pollution', desc: 'Hatchlings navigate by moonlight on water — artificial lights disorient them inland' },
      { icon: '\u{1F321}', label: 'Temperature Sex', desc: 'Nest temperature determines sex — warming produces almost all females' }
    ]
  },
  'golden-poison-frog': {
    archetype: 'Chemical Warrior',
    stats: { size: 1, speed: 3, intelligence: 3, sociality: 3, adaptability: 3, danger: 10 },
    strengths: [
      { icon: '\u{2620}', label: 'Most Toxic Animal', desc: 'One frog carries enough batrachotoxin to kill 10 adult humans' },
      { icon: '\u{1F3A8}', label: 'Aposematic Color', desc: 'Brilliant gold warns predators — one taste teaches a lifetime of avoidance' },
      { icon: '\u{1F468}', label: 'Paternal Care', desc: 'Males carry tadpoles on their backs to individual water-filled bromeliads' }
    ],
    weaknesses: [
      { icon: '\u{1F332}', label: 'Rainforest Only', desc: 'Endemic to a small area of Colombian Pacific coast rainforest' },
      { icon: '\u{1F4A7}', label: 'Moisture Dependent', desc: 'Permeable skin requires constant humidity — desiccation is lethal' },
      { icon: '\u{1F344}', label: 'Chytrid Fungus', desc: 'Batrachochytrium dendrobatidis has devastated amphibians worldwide' }
    ]
  },
  'platypus': {
    archetype: 'Evolutionary Enigma',
    stats: { size: 3, speed: 5, intelligence: 5, sociality: 2, adaptability: 5, danger: 4 },
    strengths: [
      { icon: '\u{26A1}', label: 'Electroreception', desc: 'Bill detects micro-electric fields of shrimp and larvae in murky water' },
      { icon: '\u{1F9EA}', label: 'Venomous Spur', desc: 'Male hind-leg spurs deliver excruciating venom — rare among mammals' },
      { icon: '\u{1F95A}', label: 'Egg-Laying Mammal', desc: 'One of only five living monotremes — bridges reptilian and mammalian worlds' }
    ],
    weaknesses: [
      { icon: '\u{1F4A7}', label: 'Waterway Dependent', desc: 'Requires clean freshwater streams — sensitive to any water quality changes' },
      { icon: '\u{1F321}', label: 'Climate Vulnerable', desc: 'Drought and rising temperatures dry out the creeks they depend on' },
      { icon: '\u{1F3D7}', label: 'Dam Disruption', desc: 'Dams and water extraction destroy the stream habitats they rely on' }
    ]
  },
  'polar-bear': {
    archetype: 'Arctic Apex',
    stats: { size: 8, speed: 6, intelligence: 7, sociality: 3, adaptability: 4, danger: 9 },
    strengths: [
      { icon: '\u{2744}', label: 'Cold Mastery', desc: '10 cm of blubber plus hollow fur shafts insulate to -50\u00B0C' },
      { icon: '\u{1F43E}', label: 'Ice Hunter', desc: 'Waits hours motionlessly at seal breathing holes — patience incarnate' },
      { icon: '\u{1F3CA}', label: 'Marathon Swimmer', desc: 'Documented swimming 687 km continuously across open Arctic water' }
    ],
    weaknesses: [
      { icon: '\u{1F321}', label: 'Ice Dependency', desc: 'Sea ice loss from climate change is the existential threat — no ice, no seals' },
      { icon: '\u{2623}', label: 'Pollution Load', desc: 'Arctic food chain concentrates POPs in polar bear fat and milk' },
      { icon: '\u{1F423}', label: 'Low Reproduction', desc: 'Females breed only every 3 years; cubs stay dependent for 2.5 years' }
    ]
  },

  // ── EXTINCT ICONS ──
  'archaeopteryx': {
    archetype: 'Transitional Form',
    stats: { size: 2, speed: 5, intelligence: 4, sociality: 3, adaptability: 5, danger: 2 },
    strengths: [
      { icon: '\u{1F9EC}', label: 'Bridge Species', desc: 'Feathered wings with clawed fingers — the dinosaur-to-bird missing link' },
      { icon: '\u{1F99A}', label: 'Feathered Flight', desc: 'Asymmetric flight feathers suggest powered or gliding flight capability' },
      { icon: '\u{1F9B7}', label: 'Toothed Beak', desc: 'Jaws lined with sharp teeth — a hunter with the body plan of a bird' }
    ],
    weaknesses: [
      { icon: '\u{1F4A8}', label: 'Weak Flier', desc: 'Likely a poor or short-distance flier compared to modern birds' },
      { icon: '\u{1F52C}', label: 'Small Size', desc: 'Crow-sized and lightly built — vulnerable to larger Jurassic predators' },
      { icon: '\u{2753}', label: 'Debated Ancestry', desc: 'Exact phylogenetic position still debated — avialan or close relative?' }
    ]
  }
};
