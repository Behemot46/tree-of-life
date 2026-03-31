// ══════════════════════════════════════════════════════
// GEO DATA — geographic distribution for all tree nodes
// ══════════════════════════════════════════════════════

const GEO_DATA = {
  // ── ROOT & DOMAINS ──
  'luca':       { regions: ['marine-deep'], label: 'Hydrothermal vents, ancient ocean floor', type: 'fossil' },
  'bacteria':   { regions: ['worldwide'], label: 'Every habitat on Earth', type: 'habitat' },
  'archaea':    { regions: ['worldwide'], label: 'Extreme and moderate environments worldwide', type: 'habitat' },
  'eukaryota':  { regions: ['worldwide'], label: 'All terrestrial and aquatic habitats', type: 'habitat' },

  // ── BACTERIA ──
  'cyanobacteria':        { regions: ['worldwide', 'freshwater', 'marine-global'], label: 'Freshwater, marine, and terrestrial worldwide', type: 'habitat' },
  'prochlorococcus':      { regions: ['marine-global'], label: 'Tropical and subtropical oceans, 0-200 m depth', type: 'habitat' },
  'nostoc':               { regions: ['worldwide'], label: 'Soil, freshwater, and rocks worldwide', type: 'habitat' },
  'proteobacteria':       { regions: ['worldwide'], label: 'Soil, water, and animal hosts worldwide', type: 'habitat' },
  'ecoli':                { regions: ['worldwide'], label: 'Mammalian gut; found wherever warm-blooded animals live', type: 'habitat' },
  'helicobacter':         { regions: ['worldwide'], label: 'Human stomach lining; infects ~50% of global population', type: 'habitat' },
  'vibrio-cholerae':      { regions: ['south-asia', 'africa', 'central-america'], label: 'Tropical estuaries and coastal waters', type: 'habitat' },
  'firmicutes':           { regions: ['worldwide'], label: 'Soil, gut, fermented foods worldwide', type: 'habitat' },
  'lactobacillus':        { regions: ['worldwide'], label: 'Mammalian gut, fermented foods, vaginal flora', type: 'habitat' },
  'clostridium-botulinum': { regions: ['worldwide'], label: 'Soil and sediments worldwide', type: 'habitat' },
  'actinobacteria':       { regions: ['worldwide'], label: 'Soil, freshwater, marine environments', type: 'habitat' },
  'streptomyces':         { regions: ['worldwide'], label: 'Soil worldwide; dominant soil bacterium', type: 'habitat' },
  'mycobacterium-tb':     { regions: ['worldwide'], label: 'Human lungs; endemic in Africa and South Asia', type: 'habitat' },
  'spirochetes':          { regions: ['worldwide'], label: 'Aquatic environments, animal hosts, soil', type: 'habitat' },
  'deinococcus':          { regions: ['worldwide'], label: 'Soil, dried foods, irradiated environments', type: 'habitat' },
  'bacteroides':          { regions: ['worldwide'], label: 'Mammalian gut; dominant anaerobe in human colon', type: 'habitat' },

  // ── ARCHAEA ──
  'euryarchaeota':    { regions: ['worldwide'], label: 'Salt lakes, deep sea, wetlands, animal guts', type: 'habitat' },
  'methanobacterium': { regions: ['worldwide'], label: 'Wetlands, ruminant guts, anaerobic sediments', type: 'habitat' },
  'asgard':           { regions: ['marine-deep'], label: 'Deep-sea sediments, hydrothermal vents', type: 'habitat' },
  'halobacterium':    { regions: ['north-africa', 'west-asia', 'central-asia'], label: 'Hypersaline lakes — Dead Sea, Great Salt Lake, salt flats', type: 'habitat' },
  'sulfolobus':       { regions: ['worldwide'], label: 'Hot acidic springs, volcanic areas worldwide', type: 'habitat' },
  'pyrolobus':        { regions: ['marine-deep'], label: 'Deep-sea hydrothermal vents, Mid-Atlantic Ridge', type: 'habitat' },
  'lokiarchaeota':    { regions: ['marine-deep'], label: 'Loki\'s Castle hydrothermal vent, Arctic Mid-Ocean Ridge', type: 'habitat' },

  // ── PROTISTS ──
  'protists':         { regions: ['worldwide', 'freshwater', 'marine-global'], label: 'Aquatic and moist environments worldwide', type: 'habitat' },
  'alveolates':       { regions: ['worldwide', 'marine-global', 'freshwater'], label: 'Marine, freshwater, and parasitic worldwide', type: 'habitat' },
  'plasmodium':       { regions: ['africa', 'south-asia', 'southeast-asia', 'south-america'], label: 'Tropical and subtropical regions; 95% of deaths in Africa', type: 'habitat' },
  'paramecium':       { regions: ['worldwide', 'freshwater'], label: 'Freshwater ponds, lakes, and streams worldwide', type: 'habitat' },
  'dinoflagellates':  { regions: ['marine-global', 'freshwater'], label: 'Marine and freshwater worldwide; cause red tides', type: 'habitat' },
  'stramenopiles':    { regions: ['worldwide', 'marine-global', 'freshwater'], label: 'Marine, freshwater, and terrestrial worldwide', type: 'habitat' },
  'diatoms':          { regions: ['worldwide', 'marine-global', 'freshwater'], label: 'Oceans and freshwater worldwide; produce ~20% of global oxygen', type: 'habitat' },
  'phytophthora':     { regions: ['worldwide'], label: 'Soil and water worldwide; notorious plant pathogen', type: 'habitat' },
  'amoebozoa':        { regions: ['worldwide', 'freshwater'], label: 'Soil, freshwater, and marine worldwide', type: 'habitat' },
  'amoeba-proteus':   { regions: ['worldwide', 'freshwater'], label: 'Freshwater ponds, ditches, and slow streams', type: 'habitat' },
  'volvox':           { regions: ['worldwide', 'freshwater'], label: 'Freshwater ponds and ditches worldwide', type: 'habitat' },

  // ── FUNGI ──
  'fungi':            { regions: ['worldwide'], label: 'Terrestrial, freshwater, and marine worldwide', type: 'habitat' },
  'ascomycetes':      { regions: ['worldwide'], label: 'Soil, decaying matter, plant surfaces worldwide', type: 'habitat' },
  'saccharomyces':    { regions: ['worldwide'], label: 'Fruit surfaces, soil, fermentation worldwide', type: 'habitat' },
  'penicillium':      { regions: ['worldwide'], label: 'Soil, decaying vegetation, food worldwide', type: 'habitat' },
  'basidiomycetes':   { regions: ['worldwide'], label: 'Forest floors, wood, soil worldwide', type: 'habitat' },
  'amanita-muscaria': { regions: ['europe', 'north-america', 'east-asia', 'south-asia'], label: 'Temperate and boreal forests of Northern Hemisphere', type: 'habitat' },
  'armillaria':       { regions: ['north-america', 'europe', 'east-asia'], label: 'Temperate forests; largest organism: 2,385 acres in Oregon', type: 'habitat' },
  'psilocybe':        { regions: ['central-america', 'north-america', 'south-america', 'southeast-asia'], label: 'Tropical and subtropical forests, dung, wood chips', type: 'habitat' },
  'chytrids':         { regions: ['worldwide', 'freshwater'], label: 'Freshwater and moist soil worldwide', type: 'habitat' },
  'batrachochytrium': { regions: ['worldwide'], label: 'Amphibian skin worldwide; causing global amphibian decline', type: 'habitat' },

  // ── PLANTS ──
  'plantae':          { regions: ['worldwide'], label: 'Terrestrial and freshwater habitats worldwide', type: 'habitat' },
  'bryophytes':       { regions: ['worldwide'], label: 'Moist terrestrial habitats worldwide', type: 'habitat' },
  'sphagnum':         { regions: ['north-america', 'europe', 'east-asia'], label: 'Peat bogs of Northern Hemisphere; stores 1/3 of soil carbon', type: 'habitat' },
  'marchantia':       { regions: ['worldwide'], label: 'Moist shaded banks, rocks, and soil worldwide', type: 'habitat' },
  'angiosperms':      { regions: ['worldwide'], label: 'Dominant land plants in nearly every biome', type: 'habitat' },
  'arabidopsis':      { regions: ['europe', 'central-asia', 'north-africa'], label: 'Eurasia and North Africa; model organism in labs worldwide', type: 'habitat' },
  'rafflesia':        { regions: ['southeast-asia'], label: 'Rainforests of Borneo, Sumatra, Philippines', type: 'endemic' },
  'titan-arum':       { regions: ['southeast-asia'], label: 'Rainforests of western Sumatra, Indonesia', type: 'endemic' },
  'mimosa-pudica':    { regions: ['central-america', 'south-america'], label: 'Native to Central and South America; introduced pantropically', type: 'habitat' },
  'gymnosperms':      { regions: ['worldwide'], label: 'Temperate and boreal forests worldwide', type: 'habitat' },
  'wollemia':         { regions: ['oceania'], label: 'Wollemi National Park, New South Wales, Australia — fewer than 100 wild trees', type: 'endemic' },
  'welwitschia':      { regions: ['southern-africa'], label: 'Namib Desert, Namibia and Angola', type: 'endemic' },
  'sequoia':          { regions: ['north-america'], label: 'Sierra Nevada mountains, California, USA', type: 'endemic' },
  'ferns':            { regions: ['worldwide'], label: 'Tropical and temperate forests worldwide', type: 'habitat' },
  'tree-fern':        { regions: ['oceania', 'southeast-asia', 'south-america'], label: 'Tropical and southern temperate rainforests', type: 'habitat' },
  'azolla':           { regions: ['worldwide', 'freshwater'], label: 'Freshwater surfaces worldwide; Arctic Azolla Event 49 Mya', type: 'habitat' },

  // ── ANIMALS — INVERTEBRATES ──
  'animalia':       { regions: ['worldwide'], label: 'Every habitat on Earth', type: 'habitat' },
  'invertebrates':  { regions: ['worldwide'], label: 'Terrestrial, marine, and freshwater worldwide', type: 'habitat' },
  'insects':        { regions: ['worldwide'], label: 'Every terrestrial and freshwater habitat', type: 'habitat' },
  'horseshoe-crab': { regions: ['north-america', 'east-asia', 'southeast-asia'], label: 'Atlantic coast of N. America; coasts of East and Southeast Asia', type: 'habitat' },
  'mantis-shrimp':  { regions: ['marine-global'], label: 'Tropical and subtropical shallow marine waters', type: 'habitat' },
  'honey-bee':      { regions: ['worldwide'], label: 'Native to Eurasia and Africa; introduced worldwide', type: 'habitat' },
  'cephalopods':    { regions: ['marine-global'], label: 'All oceans, surface to deep sea', type: 'habitat' },
  'octopus':        { regions: ['marine-global'], label: 'All oceans; tropical reefs to deep trenches', type: 'habitat' },
  'nautilus':       { regions: ['southeast-asia', 'oceania'], label: 'Indo-Pacific deep reef slopes, 100-700 m depth', type: 'habitat' },
  'cnidarians':     { regions: ['marine-global', 'freshwater'], label: 'Marine worldwide; some freshwater (Hydra)', type: 'habitat' },
  'turritopsis':    { regions: ['marine-global'], label: 'Mediterranean Sea; now spread to oceans worldwide', type: 'habitat' },
  'coral':          { regions: ['marine-global'], label: 'Tropical and subtropical shallow seas; reef belt 30°N-30°S', type: 'habitat' },
  'echinoderms':    { regions: ['marine-global'], label: 'All oceans, intertidal to abyssal', type: 'habitat' },
  'annelids':       { regions: ['worldwide', 'marine-global', 'freshwater'], label: 'Soil, marine, and freshwater worldwide', type: 'habitat' },

  // ── ANIMALS — VERTEBRATES ──
  'vertebrates':      { regions: ['worldwide'], label: 'Every habitat on Earth', type: 'habitat' },
  'fish':             { regions: ['marine-global', 'freshwater'], label: 'All oceans and freshwater bodies worldwide', type: 'habitat' },
  'coelacanth':       { regions: ['africa', 'southeast-asia'], label: 'Deep waters off Comoros Islands and Sulawesi, Indonesia', type: 'habitat' },
  'shark':            { regions: ['marine-global'], label: 'All oceans; some rivers and estuaries', type: 'habitat' },
  'amphibians':       { regions: ['worldwide'], label: 'Moist habitats on every continent except Antarctica', type: 'habitat' },
  'reptiles':         { regions: ['worldwide'], label: 'Terrestrial habitats on every continent except Antarctica', type: 'habitat' },
  'birds':            { regions: ['worldwide'], label: 'Every continent including Antarctica', type: 'habitat' },
  'archaeopteryx':    { regions: ['europe'], label: 'Late Jurassic lagoons, Solnhofen, Bavaria, Germany', type: 'fossil' },
  'peregrine-falcon': { regions: ['worldwide'], label: 'Every continent except Antarctica; most widespread raptor', type: 'habitat' },
  'komodo-dragon':    { regions: ['southeast-asia'], label: 'Komodo, Rinca, Flores, and Gili Motang islands, Indonesia', type: 'endemic' },
  'tuatara':          { regions: ['oceania'], label: 'Small offshore islands of New Zealand', type: 'endemic' },
  'mammals':          { regions: ['worldwide'], label: 'Every terrestrial, marine, and aerial habitat', type: 'habitat' },
  'cetaceans':        { regions: ['marine-global'], label: 'All oceans; some river dolphins in freshwater', type: 'habitat' },
  'blue-whale':       { regions: ['marine-global'], label: 'All oceans; migrates pole-to-equator seasonally', type: 'habitat' },
  'naked-mole-rat':   { regions: ['east-africa'], label: 'Arid grasslands of Ethiopia, Somalia, Kenya', type: 'endemic' },
  'platypus':         { regions: ['oceania'], label: 'Eastern Australia and Tasmania; freshwater streams', type: 'endemic' },
  'primates':         { regions: ['africa', 'south-asia', 'southeast-asia', 'south-america', 'east-asia'], label: 'Tropical forests of Africa, Asia, and the Americas', type: 'habitat' },

  // ── GREAT APES ──
  'great-apes': { regions: ['africa', 'southeast-asia'], label: 'Tropical forests of Africa and Southeast Asia', type: 'habitat' },
  'orangutan':  { regions: ['southeast-asia'], label: 'Rainforests of Borneo and Sumatra', type: 'endemic' },
  'gorilla':    { regions: ['africa'], label: 'Tropical forests of Central and West Africa', type: 'endemic' },
  'chimpanzee': { regions: ['africa'], label: 'Tropical forests and savannas of Central and West Africa', type: 'habitat' },
  'hominini':   { regions: ['africa'], label: 'Originated in Africa; human lineage went worldwide', type: 'habitat' },

  // ── HOMININS ──
  'sahelanthropus':      { regions: ['africa'], label: 'Djurab Desert, Chad — 6-7 Mya', type: 'fossil' },
  'orrorin':             { regions: ['east-africa'], label: 'Tugen Hills, Kenya — 6.1-5.7 Mya', type: 'fossil' },
  'ardipithecus_r':      { regions: ['east-africa'], label: 'Afar Depression, Ethiopia — 4.4 Mya', type: 'fossil' },
  'au_anamensis':        { regions: ['east-africa'], label: 'Kanapoi and Allia Bay, Kenya — 4.2-3.9 Mya', type: 'fossil' },
  'au_afarensis':        { regions: ['east-africa'], label: 'Hadar, Ethiopia and Laetoli, Tanzania — 3.9-2.9 Mya', type: 'fossil' },
  'au_bahrelghazali':    { regions: ['africa'], label: 'Bahr el Ghazal, Chad — 3.6 Mya', type: 'fossil' },
  'au_deyiremeda':       { regions: ['east-africa'], label: 'Woranso-Mille, Afar, Ethiopia — 3.5-3.3 Mya', type: 'fossil' },
  'kenyanthropus':       { regions: ['east-africa'], label: 'West Turkana, Kenya — 3.5 Mya', type: 'fossil' },
  'au_africanus':        { regions: ['southern-africa'], label: 'Sterkfontein and Taung, South Africa — 3.3-2.1 Mya', type: 'fossil' },
  'au_prometheus':       { regions: ['southern-africa'], label: 'Sterkfontein Cave, South Africa — 3.7 Mya', type: 'fossil' },
  'au_garhi':            { regions: ['east-africa'], label: 'Middle Awash, Ethiopia — 2.5 Mya', type: 'fossil' },
  'par_aethiopicus':     { regions: ['east-africa'], label: 'Omo Valley, Ethiopia and West Turkana, Kenya — 2.7-2.3 Mya', type: 'fossil' },
  'par_boisei':          { regions: ['east-africa'], label: 'Olduvai Gorge, Tanzania and Koobi Fora, Kenya — 2.3-1.2 Mya', type: 'fossil' },
  'par_robustus':        { regions: ['southern-africa'], label: 'Swartkrans and Kromdraai, South Africa — 2.0-1.2 Mya', type: 'fossil' },
  'au_sediba':           { regions: ['southern-africa'], label: 'Malapa, South Africa — 1.98 Mya', type: 'fossil' },
  'h_rudolfensis':       { regions: ['east-africa'], label: 'Koobi Fora, Kenya — 1.9 Mya', type: 'fossil' },
  'h_habilis':           { regions: ['east-africa'], label: 'Olduvai Gorge, Tanzania and Koobi Fora, Kenya — 2.4-1.4 Mya', type: 'fossil' },
  'h_erectus':           { regions: ['africa', 'east-asia', 'southeast-asia'], label: 'Africa, Java, China, Georgia — 1.9 Mya to 110 Kya', type: 'fossil' },
  'h_antecessor':        { regions: ['europe'], label: 'Gran Dolina, Atapuerca, Spain — 1.2-0.8 Mya', type: 'fossil' },
  'h_bodoensis':         { regions: ['africa', 'europe'], label: 'Bodo, Ethiopia and possibly Europe — 774-126 Kya', type: 'fossil' },
  'h_heidelbergensis':   { regions: ['africa', 'europe'], label: 'Mauer, Germany and Kabwe, Zambia — 700-200 Kya', type: 'fossil' },
  'h_naledi':            { regions: ['southern-africa'], label: 'Rising Star Cave, South Africa — 335-236 Kya', type: 'fossil' },
  'homo-naledi':         { regions: ['southern-africa'], label: 'Rising Star Cave, South Africa — 335-236 Kya', type: 'fossil' },
  'h_longi':             { regions: ['east-asia'], label: 'Harbin, Heilongjiang, China — ~146 Kya', type: 'fossil' },
  'denisovan':           { regions: ['east-asia', 'south-asia'], label: 'Denisova Cave, Siberia and Baishiya Cave, Tibet', type: 'fossil' },
  'denisovans':          { regions: ['east-asia', 'south-asia'], label: 'Denisova Cave, Siberia and Baishiya Cave, Tibet', type: 'fossil' },
  'neanderthal':         { regions: ['europe', 'west-asia'], label: 'Europe and Western Asia — 400-40 Kya', type: 'fossil' },
  'h_floresiensis':      { regions: ['southeast-asia'], label: 'Liang Bua cave, Flores, Indonesia — 100-50 Kya', type: 'fossil' },
  'homo-floresiensis':   { regions: ['southeast-asia'], label: 'Liang Bua cave, Flores, Indonesia — 100-50 Kya', type: 'fossil' },
  'h_luzonensis':        { regions: ['southeast-asia'], label: 'Callao Cave, Luzon, Philippines — 67 Kya', type: 'fossil' },
  'h_sapiens':           { regions: ['worldwide'], label: 'Originated in Africa ~300 Kya; now every continent', type: 'habitat' },
  'homo-sapiens':        { regions: ['worldwide'], label: 'Originated in Africa ~300 Kya; now every continent', type: 'habitat' },
  // J12 — new species
  'halococcus':          { regions: ['worldwide'], label: 'Salt mines and evaporites worldwide', type: 'habitat' },
  'methanosarcina':      { regions: ['worldwide'], label: 'Wetlands, sediments, ruminant guts worldwide', type: 'habitat' },
  'synchytrium':         { regions: ['europe', 'north-america'], label: 'Temperate agricultural regions', type: 'habitat' },
  'allomyces':           { regions: ['worldwide'], label: 'Freshwater and soil worldwide', type: 'habitat' },
  'sea-urchin':          { regions: ['marine-global'], label: 'Temperate and tropical oceans', type: 'habitat' },
  'sea-cucumber':        { regions: ['marine-global'], label: 'All oceans, shallow to deep sea', type: 'habitat' },
  'sea-lily':            { regions: ['marine-global'], label: 'Deep ocean, tropical reefs', type: 'habitat' },
  'medicinal-leech':     { regions: ['europe'], label: 'European freshwater marshes and ponds', type: 'habitat' },
  'pompeii-worm':        { regions: ['marine-deep'], label: 'Hydrothermal vents, East Pacific Rise', type: 'habitat' },
  'humpback-whale':      { regions: ['marine-global'], label: 'All oceans, seasonal migration', type: 'habitat' },
  'sperm-whale':         { regions: ['marine-global'], label: 'Deep waters of all oceans', type: 'habitat' },
  'orca':                { regions: ['marine-global'], label: 'All oceans, poles to tropics', type: 'habitat' },
  'tarsier':             { regions: ['southeast-asia'], label: 'Philippines', type: 'endemic' },
  'ring-tailed-lemur':   { regions: ['africa'], label: 'Madagascar (southwest)', type: 'endemic' },
  'japanese-macaque':    { regions: ['east-asia'], label: 'Japanese archipelago', type: 'endemic' },
  'mandrill':            { regions: ['africa'], label: 'Central African rainforests', type: 'habitat' },
  'pangolin':            { regions: ['southeast-asia'], label: 'Southeast Asian tropical forests', type: 'habitat' },
  'star-nosed-mole':     { regions: ['north-america'], label: 'Eastern North America wetlands', type: 'habitat' },
  'honey-badger':        { regions: ['africa', 'south-asia', 'west-asia'], label: 'Africa, Middle East, India', type: 'habitat' },
  'caecilian':           { regions: ['south-america', 'africa', 'southeast-asia'], label: 'Tropical regions worldwide', type: 'habitat' },
  'chameleon':           { regions: ['africa'], label: 'Madagascar and East Africa', type: 'habitat' },
  'box-jellyfish':       { regions: ['southeast-asia', 'oceania'], label: 'Indo-Pacific tropical waters', type: 'habitat' },
  'cuttlefish':          { regions: ['europe', 'africa'], label: 'Mediterranean and Eastern Atlantic', type: 'habitat' },
  'atlas-moth':          { regions: ['southeast-asia', 'south-asia'], label: 'South and Southeast Asian forests', type: 'habitat' },
  'bombardier-beetle':   { regions: ['europe', 'north-america', 'africa'], label: 'Temperate woodland worldwide', type: 'habitat' },
  'lungfish':            { regions: ['oceania'], label: 'Freshwater rivers of Queensland, Australia', type: 'endemic' },
  'ginkgo':              { regions: ['east-asia'], label: 'Native to China; cultivated worldwide', type: 'habitat' },
  'dragon-blood-tree':   { regions: ['west-asia'], label: 'Socotra Island, Yemen', type: 'endemic' },
};


// ══════════════════════════════════════════════════════
// BRANCH DATA — species-specific display data for panels
// ══════════════════════════════════════════════════════

const BRANCH_DATA = {
  // ── BACTERIA ──
  'ecoli': {
    cellType: 'Gram-negative bacterium',
    metabolism: 'Facultative anaerobe',
    habitat: 'Mammalian gut',
    relevance: 'Model organism, gut commensal, some strains pathogenic'
  },
  'helicobacter': {
    cellType: 'Gram-negative bacterium',
    metabolism: 'Microaerophilic',
    habitat: 'Human stomach lining',
    relevance: 'Causes gastric ulcers, linked to stomach cancer'
  },
  'vibrio-cholerae': {
    cellType: 'Gram-negative bacterium',
    metabolism: 'Facultative anaerobe',
    habitat: 'Tropical estuaries; human intestine during infection',
    relevance: 'Causes cholera; 1-4 million cases per year worldwide'
  },
  'prochlorococcus': {
    cellType: 'Gram-negative cyanobacterium',
    metabolism: 'Obligate photoautotroph',
    habitat: 'Open ocean, 0-200 m depth',
    relevance: 'Produces ~20% of global oxygen; most abundant photosynthesizer'
  },
  'nostoc': {
    cellType: 'Filamentous cyanobacterium',
    metabolism: 'Photoautotroph with N2 fixation',
    habitat: 'Soil, rocks, freshwater worldwide',
    relevance: 'Lichen partner, cycad symbiont, edible in East Asia'
  },
  'lactobacillus': {
    cellType: 'Gram-positive bacterium',
    metabolism: 'Obligate anaerobe / microaerophilic',
    habitat: 'Mammalian gut, fermented foods, vaginal flora',
    relevance: 'Probiotic; essential for yogurt, cheese, sauerkraut production'
  },
  'clostridium-botulinum': {
    cellType: 'Gram-positive bacterium',
    metabolism: 'Obligate anaerobe',
    habitat: 'Soil and aquatic sediments',
    relevance: 'Produces botulinum toxin — deadliest known toxin; also used medically (Botox)'
  },
  'streptomyces': {
    cellType: 'Gram-positive bacterium',
    metabolism: 'Obligate aerobe',
    habitat: 'Soil worldwide',
    relevance: 'Source of ~70% of natural antibiotics including streptomycin and tetracycline'
  },
  'mycobacterium-tb': {
    cellType: 'Acid-fast bacterium',
    metabolism: 'Obligate aerobe',
    habitat: 'Human lungs',
    relevance: 'Causes tuberculosis; ~1.3 million deaths/year, oldest known human pathogen'
  },
  'deinococcus': {
    cellType: 'Gram-positive bacterium',
    metabolism: 'Obligate aerobe',
    habitat: 'Soil, dried foods, irradiated environments',
    relevance: 'Survives 5,000 Gy radiation (500× human lethal dose); repairs shattered DNA'
  },
  'bacteroides': {
    cellType: 'Gram-negative bacterium',
    metabolism: 'Obligate anaerobe',
    habitat: 'Human colon',
    relevance: 'Dominant gut anaerobe; digests complex carbohydrates, produces vitamins'
  },

  // ── ARCHAEA ──
  'methanobacterium': {
    cellType: 'Archaeon',
    metabolism: 'Methanogen — CO2 + H2 → CH4',
    habitat: 'Wetlands, ruminant guts, anaerobic sediments',
    relevance: 'Major source of atmospheric methane; used in biogas production'
  },
  'halobacterium': {
    cellType: 'Archaeon',
    metabolism: 'Aerobic heterotroph with bacteriorhodopsin',
    habitat: 'Hypersaline lakes and salt flats',
    relevance: 'Turns salt lakes pink/red; uses light-driven proton pump'
  },
  'sulfolobus': {
    cellType: 'Archaeon',
    metabolism: 'Aerobic chemolithotroph (sulfur oxidation)',
    habitat: 'Hot acidic springs, 75-80°C, pH 2-3',
    relevance: 'Model for archaeal molecular biology; source of thermostable enzymes'
  },
  'pyrolobus': {
    cellType: 'Archaeon',
    metabolism: 'Chemolithoautotroph (H2 + NO3)',
    habitat: 'Hydrothermal vents, 106°C optimum',
    relevance: 'Holds record for highest growth temperature (113°C); survives autoclaving'
  },
  'lokiarchaeota': {
    cellType: 'Archaeon (Asgard superphylum)',
    metabolism: 'Anaerobic, hydrogen-dependent',
    habitat: 'Deep-sea sediments near Loki\'s Castle vent',
    relevance: 'Closest known prokaryotic relative of eukaryotes; key to understanding eukaryogenesis'
  },

  // ── PROTISTS ──
  'plasmodium': {
    cellType: 'Apicomplexan protist',
    metabolism: 'Obligate intracellular parasite',
    habitat: 'Human red blood cells; Anopheles mosquito vector',
    relevance: 'Causes malaria; ~600,000 deaths/year, mostly children in Africa'
  },
  'paramecium': {
    cellType: 'Ciliate protist',
    metabolism: 'Heterotroph (bacterivore)',
    habitat: 'Freshwater ponds and streams',
    relevance: 'Classic model organism; demonstrates avoidance behavior and conjugation'
  },
  'dinoflagellates': {
    cellType: 'Flagellate protist',
    metabolism: 'Mixotrophic — photosynthetic and heterotrophic',
    habitat: 'Marine and freshwater worldwide',
    relevance: 'Cause red tides (HABs); coral symbiont (zooxanthellae); bioluminescence'
  },
  'diatoms': {
    cellType: 'Silica-shelled protist',
    metabolism: 'Photoautotroph',
    habitat: 'Oceans and freshwater worldwide',
    relevance: 'Produce ~20% of global oxygen; silica frustules used in diatomaceous earth'
  },
  'phytophthora': {
    cellType: 'Oomycete (water mold)',
    metabolism: 'Heterotroph (plant pathogen)',
    habitat: 'Soil and water; infects plant roots and stems',
    relevance: 'P. infestans caused the Irish Potato Famine (1845-1852); ~1 million deaths'
  },
  'amoeba-proteus': {
    cellType: 'Amoeboid protist',
    metabolism: 'Heterotroph (phagocytosis)',
    habitat: 'Freshwater ponds and slow streams',
    relevance: 'Classic model for cell motility and phagocytosis'
  },
  'volvox': {
    cellType: 'Colonial green alga',
    metabolism: 'Photoautotroph',
    habitat: 'Freshwater ponds and ditches',
    relevance: 'Model for evolution of multicellularity; colonies show cell differentiation'
  },

  // ── FUNGI ──
  'saccharomyces': {
    substrate: 'Sugars (glucose, fructose, maltose)',
    symbiosis: 'Commensal with humans (domesticated)',
    edibility: 'Safe — essential for bread, beer, and wine',
    dispersal: 'Insect vectors and human cultivation'
  },
  'penicillium': {
    substrate: 'Decaying organic matter, food surfaces',
    symbiosis: 'Saprophyte',
    edibility: 'Some species used in cheese (P. camemberti, P. roqueforti)',
    dispersal: 'Airborne conidia; ubiquitous in indoor environments'
  },
  'amanita-muscaria': {
    substrate: 'Ectomycorrhizal with birch, pine, spruce',
    symbiosis: 'Mutualistic — exchanges soil nutrients for plant sugars',
    edibility: 'Toxic — contains ibotenic acid and muscimol; hallucinogenic',
    dispersal: 'Wind-dispersed basidiospores'
  },
  'armillaria': {
    substrate: 'Living and dead tree roots, wood',
    symbiosis: 'Parasitic and saprophytic',
    edibility: 'Edible when cooked (honey mushroom)',
    dispersal: 'Rhizomorphs (root-like cords) spread underground; largest organism on Earth'
  },
  'psilocybe': {
    substrate: 'Decaying wood, dung, grassland soil',
    symbiosis: 'Saprophyte',
    edibility: 'Psychoactive — contains psilocybin and psilocin',
    dispersal: 'Basidiospores; studied for treatment of depression and PTSD'
  },
  'batrachochytrium': {
    substrate: 'Amphibian skin (keratin)',
    symbiosis: 'Parasitic — obligate pathogen',
    edibility: 'N/A — not a food species',
    dispersal: 'Waterborne zoospores; causing global amphibian extinction crisis'
  },

  // ── PLANTS ──
  'sphagnum': {
    pollination: 'Spores (non-flowering)',
    conservation: 'Least Concern; widespread',
    record: 'Peatlands store ~30% of global soil carbon despite covering only 3% of land',
    ecoRole: 'Peat formation, carbon sequestration, water retention'
  },
  'marchantia': {
    pollination: 'Spores; splash-cup gemmae',
    conservation: 'Least Concern; cosmopolitan',
    record: 'One of the oldest land plant lineages; key model for plant evo-devo',
    ecoRole: 'Soil stabilization, pioneer colonizer of disturbed habitats'
  },
  'arabidopsis': {
    pollination: 'Self-pollinating',
    conservation: 'Least Concern; common weed',
    record: 'First plant with fully sequenced genome (2000); ~27,000 genes',
    ecoRole: 'Model organism — most studied plant in biology'
  },
  'rafflesia': {
    pollination: 'Carrion flies attracted by rotting-flesh odor',
    conservation: 'Critically Endangered; habitat destruction in Borneo/Sumatra',
    record: 'Largest single flower in the world — up to 1 meter across, 11 kg',
    ecoRole: 'Holoparasite of Tetrastigma vines; no roots, stems, or leaves'
  },
  'titan-arum': {
    pollination: 'Carrion beetles and flies attracted by cadaverine odor',
    conservation: 'Vulnerable; endemic to Sumatran rainforests',
    record: 'Tallest unbranched inflorescence — up to 3.1 m; heats to 36°C',
    ecoRole: 'Thermogenic pollination; blooms every 7-10 years'
  },
  'mimosa-pudica': {
    pollination: 'Insects (wind-assisted)',
    conservation: 'Least Concern; invasive in some tropical regions',
    record: 'Fastest plant movement — leaves fold in ~0.1 seconds when touched',
    ecoRole: 'Nitrogen fixer (legume); demonstrates plant memory/habituation'
  },
  'wollemia': {
    pollination: 'Wind-pollinated (conifer)',
    conservation: 'Critically Endangered; fewer than 100 wild trees',
    record: 'Living fossil — unchanged for 200 million years; discovered 1994',
    ecoRole: 'Conservation icon; cultivated worldwide from seed to prevent extinction'
  },
  'welwitschia': {
    pollination: 'Insects (bugs of order Hemiptera)',
    conservation: 'Near Threatened; restricted to Namib Desert',
    record: 'Lives 1,000-2,000 years; produces only two leaves in its entire lifetime',
    ecoRole: 'Fog harvester; provides microhabitat in hyper-arid desert'
  },
  'sequoia': {
    pollination: 'Wind-pollinated (conifer)',
    conservation: 'Endangered; limited to Sierra Nevada groves',
    record: 'Largest tree by volume — General Sherman: 1,487 m3; lives 3,000+ years',
    ecoRole: 'Carbon storage; fire-dependent ecology; watershed protection'
  },
  'tree-fern': {
    pollination: 'Spores (non-flowering)',
    conservation: 'Variable; some species threatened by habitat loss',
    record: 'Can reach 20 m tall; some of the oldest tree-like forms on land',
    ecoRole: 'Understory canopy in tropical and temperate rainforests'
  },
  'azolla': {
    pollination: 'Spores (aquatic fern)',
    conservation: 'Least Concern; widespread',
    record: 'Arctic Azolla Event (49 Mya) — drew down CO2 and cooled Earth by 10°C',
    ecoRole: 'Nitrogen fixation (Anabaena symbiont); used as rice paddy biofertilizer'
  },

  // ── ANIMALS — INVERTEBRATES ──
  'horseshoe-crab': {
    size: 'Up to 60 cm long',
    diet: 'Worms, clams, algae',
    lifespan: '20-40 years',
    conservation: 'Vulnerable (IUCN); population declining',
    ability: 'Blue copper-based blood (LAL) detects bacterial endotoxins; used in pharmaceutical testing'
  },
  'mantis-shrimp': {
    size: '10-38 cm',
    diet: 'Crustaceans, mollusks, fish',
    lifespan: '3-6 years',
    conservation: 'Least Concern',
    ability: '16 types of color receptors (humans have 3); club strike at 23 m/s with force of a .22 caliber bullet'
  },
  'honey-bee': {
    size: '12-15 mm worker',
    diet: 'Nectar and pollen',
    lifespan: '6 weeks (worker) to 5 years (queen)',
    conservation: 'Managed species; wild populations declining',
    ability: 'Waggle dance communication; pollinates ~75% of global food crops'
  },
  'octopus': {
    size: '1 cm to 9 m (giant Pacific)',
    diet: 'Crabs, clams, fish',
    lifespan: '1-5 years',
    conservation: 'Variable by species',
    ability: '3 hearts, blue blood, 500M neurons (2/3 in arms), instant camouflage, tool use'
  },
  'nautilus': {
    size: '15-25 cm shell diameter',
    diet: 'Crustaceans, carrion',
    lifespan: '15-20 years',
    conservation: 'Near Threatened; over-harvested for shells',
    ability: 'Living fossil — unchanged for 500 million years; adjusts buoyancy via gas-filled chambers'
  },
  'turritopsis': {
    size: '4.5 mm bell diameter',
    diet: 'Plankton, fish eggs',
    lifespan: 'Potentially immortal (transdifferentiation)',
    conservation: 'Least Concern; spreading worldwide',
    ability: 'Biologically immortal — reverts to polyp stage when stressed or aged'
  },
  'coral': {
    size: 'Colonies: mm to 5,000 km (Great Barrier Reef)',
    diet: 'Photosynthesis (zooxanthellae) + zooplankton',
    lifespan: 'Colonies survive hundreds to thousands of years',
    conservation: 'Critically threatened by ocean warming and acidification',
    ability: 'Build largest biological structures on Earth; support 25% of marine species'
  },

  // ── ANIMALS — VERTEBRATES ──
  'coelacanth': {
    size: 'Up to 2 m, 90 kg',
    diet: 'Cuttlefish, squid, small sharks',
    lifespan: '~100 years (slowest metabolism of any fish)',
    conservation: 'Critically Endangered; ~500 individuals estimated',
    ability: 'Living fossil — 400 million years; lobed fins move in tetrapod walking gait'
  },
  'shark': {
    size: '17 cm (dwarf lanternshark) to 18 m (whale shark)',
    diet: 'Variable — plankton to marine mammals',
    lifespan: '20-500 years (Greenland shark)',
    conservation: '37% of shark species threatened with extinction',
    ability: 'Electroreception (ampullae of Lorenzini); skeleton of cartilage; 450 million years old'
  },
  'archaeopteryx': {
    size: '~50 cm long, crow-sized',
    diet: 'Likely insects and small vertebrates',
    lifespan: 'Unknown',
    conservation: 'Extinct (~150 Mya)',
    ability: 'Transitional fossil — feathered wings + dinosaur teeth and bony tail'
  },
  'peregrine-falcon': {
    size: '34-58 cm; wingspan 74-120 cm',
    diet: 'Medium-sized birds caught in flight',
    lifespan: '~17 years in the wild',
    conservation: 'Least Concern; recovered from DDT-era decline',
    ability: 'Fastest animal on Earth — 389 km/h (242 mph) in hunting stoop dive'
  },
  'komodo-dragon': {
    size: 'Up to 3 m long, 70 kg',
    diet: 'Deer, pigs, water buffalo, carrion',
    lifespan: '~30 years in the wild',
    conservation: 'Endangered; ~3,000 individuals remain',
    ability: 'Largest living lizard; venomous bite with anticoagulant toxins'
  },
  'tuatara': {
    size: 'Up to 80 cm, 1.3 kg',
    diet: 'Insects, lizards, seabird eggs',
    lifespan: '100+ years',
    conservation: 'Near Threatened; restricted to ~32 offshore islands',
    ability: 'Living fossil — last survivor of order Rhynchocephalia (250 Mya); parietal (third) eye'
  },
  'blue-whale': {
    size: 'Up to 30 m, 190 tonnes',
    diet: 'Krill (up to 3.6 tonnes per day)',
    lifespan: '~90 years',
    conservation: 'Endangered; ~10,000-25,000 individuals',
    ability: 'Largest animal ever; heart weighs 400 kg; call reaches 188 dB across oceans'
  },
  'naked-mole-rat': {
    size: '8-10 cm, 30-35 g',
    diet: 'Underground tubers and roots',
    lifespan: '~32 years (10× expected for body size)',
    conservation: 'Least Concern',
    ability: 'Eusocial mammal (insect-like colony); cancer-resistant; feels no skin pain; survives 18 min without O2'
  },
  'platypus': {
    size: '40-50 cm, 1-2.4 kg',
    diet: 'Aquatic invertebrates, larvae, worms',
    lifespan: '~12 years in the wild',
    conservation: 'Near Threatened; declining from habitat loss',
    ability: 'Egg-laying mammal; venomous spur; electroreception via bill; biofluorescent fur'
  },
  'orangutan': {
    size: 'Males: 1.2-1.5 m, 75 kg',
    diet: 'Fruit, bark, insects, honey',
    lifespan: '35-45 years in the wild',
    conservation: 'Critically Endangered (Bornean, Sumatran, Tapanuli)',
    ability: 'Tool use, nest building, cultural transmission; 97% DNA similarity to humans'
  },
  'gorilla': {
    size: 'Males: 1.7 m standing, 160 kg',
    diet: 'Herbivore — leaves, shoots, fruit, bark',
    lifespan: '35-40 years in the wild',
    conservation: 'Critically Endangered (Cross River, Grauer\'s gorillas)',
    ability: 'Strongest living primate; sign language learners (Koko); 98.3% DNA match to humans'
  },
  'chimpanzee': {
    size: '1-1.7 m standing, 40-60 kg',
    diet: 'Omnivore — fruit, leaves, insects, meat',
    lifespan: '~33 years in the wild',
    conservation: 'Endangered; ~170,000-300,000 remaining',
    ability: 'Closest living relative to humans (98.7% DNA); tool use, culture, warfare, altruism'
  },

  // ── HOMININS ──
  'sahelanthropus': {
    size: 'Chimp-sized, ~320-380 cm3 brain',
    diet: 'Likely omnivore — fruit, seeds, plants',
    lifespan: 'Unknown',
    conservation: 'Extinct (~7-6 Mya)',
    ability: 'Oldest possible hominin; foramen magnum suggests upright posture'
  },
  'orrorin': {
    size: 'Chimp-sized, ~35 kg',
    diet: 'Fruit, seeds, insects',
    lifespan: 'Unknown',
    conservation: 'Extinct (~6 Mya)',
    ability: 'Femur suggests bipedal walking — oldest evidence of upright locomotion'
  },
  'ardipithecus_r': {
    size: '~120 cm, 50 kg, 300-350 cm3 brain',
    diet: 'Omnivore — fruit, nuts, leaves, insects',
    lifespan: 'Unknown',
    conservation: 'Extinct (~4.4 Mya)',
    ability: 'Bipedal on ground but retained grasping big toe for tree climbing'
  },
  'au_afarensis': {
    size: '~107-152 cm, 30-45 kg, 380-430 cm3 brain',
    diet: 'Fruit, leaves, seeds, tubers',
    lifespan: 'Unknown',
    conservation: 'Extinct (~3.9-2.9 Mya)',
    ability: 'Lucy\'s species — definitive bipedal walker; Laetoli footprints prove upright gait'
  },
  'au_africanus': {
    size: '~138 cm, 30-40 kg, 420-500 cm3 brain',
    diet: 'Omnivore — fruit, leaves, possibly meat',
    lifespan: 'Unknown',
    conservation: 'Extinct (~3.3-2.1 Mya)',
    ability: 'Taung Child — first australopithecine discovered (1924); more human-like hand proportions'
  },
  'h_habilis': {
    size: '~100-135 cm, 32 kg, 510-690 cm3 brain',
    diet: 'Omnivore — scavenged meat, fruit, tubers',
    lifespan: 'Unknown',
    conservation: 'Extinct (~2.4-1.4 Mya)',
    ability: 'First stone toolmaker (Oldowan tools); name means "handy man"'
  },
  'h_erectus': {
    size: '~145-185 cm, 40-68 kg, 600-1100 cm3 brain',
    diet: 'Omnivore — hunted, cooked food (fire ~1 Mya)',
    lifespan: '~40-50 years',
    conservation: 'Extinct (~1.9 Mya - 110 Kya)',
    ability: 'First hominin to leave Africa; controlled fire; Acheulean hand axes; lived ~1.8 million years'
  },
  'neanderthal': {
    size: '~164-168 cm, 64-82 kg, 1200-1740 cm3 brain',
    diet: 'Large game hunter; also plants, seafood',
    lifespan: '~40 years',
    conservation: 'Extinct (~400-40 Kya)',
    ability: 'Made tools, art, burials; controlled fire; 1-4% DNA in modern non-African humans'
  },
  'denisovan': {
    size: 'Similar to Neanderthals; limited skeletal remains',
    diet: 'Unknown — likely similar to Neanderthals',
    lifespan: 'Unknown',
    conservation: 'Extinct',
    ability: 'Known from DNA in a finger bone; EPAS1 gene in Tibetans enables high-altitude survival'
  },
  'h_floresiensis': {
    size: '~106 cm, 25 kg, 380 cm3 brain',
    diet: 'Stegodon (dwarf elephant), Komodo dragon, rats',
    lifespan: 'Unknown',
    conservation: 'Extinct (~100-50 Kya)',
    ability: 'Island dwarf — nicknamed "Hobbit"; made stone tools despite small brain'
  },
  'homo-floresiensis': {
    size: '~106 cm, 25 kg, 380 cm3 brain',
    diet: 'Stegodon, Komodo dragon, rats',
    lifespan: 'Unknown',
    conservation: 'Extinct (~100-50 Kya)',
    ability: 'Island dwarf on Flores; made tools, hunted cooperatively'
  },
  'h_naledi': {
    size: '~144-147 cm, 40-55 kg, 465-560 cm3 brain',
    diet: 'Unknown — mixed diet likely',
    lifespan: 'Unknown',
    conservation: 'Extinct (~335-236 Kya)',
    ability: 'Intentional body disposal deep in Rising Star Cave; mix of primitive and modern traits'
  },
  'homo-naledi': {
    size: '~144-147 cm, 40-55 kg, 465-560 cm3 brain',
    diet: 'Unknown — mixed diet likely',
    lifespan: 'Unknown',
    conservation: 'Extinct (~335-236 Kya)',
    ability: 'Deliberate cave burial suggests symbolic behavior despite small brain'
  },
  'h_sapiens': {
    size: '~160-180 cm, 50-80 kg, 1100-1700 cm3 brain',
    diet: 'Omnivore — the most generalized diet of any primate',
    lifespan: '~72 years global average',
    conservation: '~8 billion individuals; not threatened',
    ability: 'Language, cumulative culture, agriculture, technology, space exploration'
  },
  'homo-sapiens': {
    size: '~160-180 cm, 50-80 kg, 1100-1700 cm3 brain',
    diet: 'Omnivore — the most generalized diet of any primate',
    lifespan: '~72 years global average',
    conservation: '~8 billion individuals; not threatened',
    ability: 'Language, cumulative culture, agriculture, technology, space exploration'
  },
  'h_longi': {
    size: 'Large — massive skull, 1420 cm3 brain',
    diet: 'Unknown',
    lifespan: 'Unknown',
    conservation: 'Extinct (~146 Kya)',
    ability: 'Harbin cranium — one of largest known Homo skulls; possibly closer to H. sapiens than Neanderthals'
  },
  'h_luzonensis': {
    size: 'Small — similar to H. floresiensis',
    diet: 'Unknown',
    lifespan: 'Unknown',
    conservation: 'Extinct (~67 Kya)',
    ability: 'Curved foot bones suggest tree climbing; island evolution in the Philippines'
  },
  'h_antecessor': {
    size: '~160-185 cm, 1000 cm3 brain',
    diet: 'Omnivore — evidence of cannibalism',
    lifespan: 'Unknown',
    conservation: 'Extinct (~1.2-0.8 Mya)',
    ability: 'Oldest known hominin in Europe; modern-like facial features despite early date'
  },
  'h_heidelbergensis': {
    size: '~157-175 cm, 62 kg, 1100-1400 cm3 brain',
    diet: 'Large game hunter; controlled fire',
    lifespan: '~40 years',
    conservation: 'Extinct (~700-200 Kya)',
    ability: 'Likely ancestor of both Neanderthals and H. sapiens; first wooden spears (Schoningen)'
  },
  'h_bodoensis': {
    size: '~1250 cm3 brain',
    diet: 'Omnivore',
    lifespan: 'Unknown',
    conservation: 'Extinct (~774-126 Kya)',
    ability: 'Proposed to replace H. heidelbergensis in Africa; represents Middle Pleistocene ancestor of H. sapiens'
  },
  'h_rudolfensis': {
    size: '~160 cm, 50 kg, 750 cm3 brain',
    diet: 'Omnivore',
    lifespan: 'Unknown',
    conservation: 'Extinct (~1.9 Mya)',
    ability: 'Larger brain than H. habilis; debated whether separate species or variant'
  },
};
