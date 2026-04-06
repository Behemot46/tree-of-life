// ══════════════════════════════════════════════════════
// GEO DATA — geographic distribution for all tree nodes
// ══════════════════════════════════════════════════════

export const GEO_DATA = {
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
  'thermus-aquaticus':    { regions: ['north-america', 'east-asia', 'worldwide'], label: 'Hot springs worldwide; Yellowstone, New Zealand, Japan — source of Taq polymerase (PCR)', type: 'habitat' },
  'borrelia':             { regions: ['north-america', 'europe', 'east-asia'], label: 'Temperate forests of North America, Europe, and East Asia — Lyme disease agent', type: 'habitat' },
  'treponema':            { regions: ['worldwide'], label: 'Human mucous membranes worldwide — syphilis agent (Treponema pallidum)', type: 'habitat' },
  'rhizobium':            { regions: ['worldwide'], label: 'Soil worldwide; root nodules of legumes, fixing atmospheric nitrogen', type: 'habitat' },
  'wolbachia':            { regions: ['worldwide'], label: 'Intracellular parasite of insects and nematodes on every continent except Antarctica', type: 'habitat' },
  'staphylococcus':       { regions: ['worldwide'], label: 'Human skin and nasal passages worldwide; soil and surfaces', type: 'habitat' },
  'spirulina':            { regions: ['africa', 'central-america', 'east-asia', 'worldwide'], label: 'Alkaline lakes — Lake Chad, Lake Texcoco, East African rift lakes; cultivated globally', type: 'habitat' },
  'campylobacter':        { regions: ['worldwide'], label: 'Intestines of warm-blooded animals worldwide; leading bacterial cause of food-borne illness', type: 'habitat' },
  'aliivibrio':           { regions: ['north-america', 'southeast-asia', 'marine-global'], label: 'Shallow tropical and temperate coastal waters worldwide; symbiont of bobtail squids', type: 'habitat' },

  // ── ARCHAEA ──
  'euryarchaeota':    { regions: ['worldwide'], label: 'Salt lakes, deep sea, wetlands, animal guts', type: 'habitat' },
  'methanobacterium': { regions: ['worldwide'], label: 'Wetlands, ruminant guts, anaerobic sediments', type: 'habitat' },
  'asgard':           { regions: ['marine-deep'], label: 'Deep-sea sediments, hydrothermal vents', type: 'habitat' },
  'halobacterium':    { regions: ['north-africa', 'west-asia', 'central-asia'], label: 'Hypersaline lakes — Dead Sea, Great Salt Lake, salt flats', type: 'habitat' },
  'sulfolobus':       { regions: ['worldwide'], label: 'Hot acidic springs, volcanic areas worldwide', type: 'habitat' },
  'pyrolobus':        { regions: ['marine-deep'], label: 'Deep-sea hydrothermal vents, Mid-Atlantic Ridge', type: 'habitat' },
  'lokiarchaeota':    { regions: ['marine-deep'], label: 'Loki\'s Castle hydrothermal vent, Arctic Mid-Ocean Ridge', type: 'habitat' },
  'thermococcus':     { regions: ['marine-deep'], label: 'Hydrothermal vents and hot marine sediments worldwide; Pacific, Atlantic, and Mediterranean', type: 'habitat' },
  'haloquadratum':    { regions: ['west-asia', 'north-africa', 'central-asia'], label: 'Hypersaline lakes and salt evaporation ponds — Dead Sea, Lake Assal, salterns', type: 'habitat' },
  'nanoarchaeum':     { regions: ['marine-deep'], label: 'Hydrothermal vent at Kolbeinsey Ridge, Iceland; also deep sea globally', type: 'endemic' },
  'thaumarchaeota':   { regions: ['worldwide', 'marine-global'], label: 'Oceans, soils, and freshwater worldwide; one of the most abundant archaea in the ocean', type: 'habitat' },
  'methanopyrus':     { regions: ['marine-deep'], label: 'Hydrothermal vents — Gulf of California, Mid-Atlantic Ridge; grows at 122°C', type: 'habitat' },
  'ferroplasma':      { regions: ['worldwide'], label: 'Acidic mine drainage worldwide; Rio Tinto (Spain), Iron Mountain (USA), and similar sites', type: 'habitat' },

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
  'euglena':          { regions: ['worldwide', 'freshwater'], label: 'Freshwater ponds, ditches, and nutrient-rich water worldwide', type: 'habitat' },
  'radiolarian':      { regions: ['marine-global'], label: 'Open ocean worldwide; surface to deep water', type: 'habitat' },
  'slime-mold':       { regions: ['worldwide'], label: 'Forest floors, decaying wood, leaf litter worldwide', type: 'habitat' },
  'stentor':          { regions: ['worldwide', 'freshwater'], label: 'Freshwater ponds, lakes, and quiet streams worldwide', type: 'habitat' },
  'foraminifera':     { regions: ['marine-global'], label: 'All oceans from surface to deep seafloor; shells form limestone chalk deposits', type: 'habitat' },
  'trypanosoma':      { regions: ['africa', 'central-america', 'south-america'], label: 'Sub-Saharan Africa (sleeping sickness); Central and South America (Chagas disease)', type: 'habitat' },
  'toxoplasma':       { regions: ['worldwide'], label: 'Worldwide in warm-blooded vertebrates; carried by ~30% of humans globally', type: 'habitat' },
  'radiolaria':       { regions: ['marine-global'], label: 'Open ocean worldwide from surface to deep water; skeletons form radiolarian ooze on seafloor', type: 'habitat' },
  'kelp':             { regions: ['north-america', 'south-america', 'europe', 'oceania', 'marine-global'], label: 'Cold temperate coastal seas worldwide; kelp forests along Pacific and Atlantic coasts', type: 'habitat' },
  'bioluminescent-dino': { regions: ['marine-global'], label: 'Coastal and open oceans worldwide; blooms visible as glowing blue waves at night', type: 'habitat' },

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
  'truffle':          { regions: ['europe', 'north-america', 'east-asia'], label: 'Temperate forests of Europe, North America, and East Asia; underground', type: 'habitat' },
  'cordyceps':        { regions: ['worldwide'], label: 'Tropical and temperate forests worldwide; on insect hosts', type: 'habitat' },
  'chanterelle':      { regions: ['europe', 'north-america', 'east-asia', 'africa'], label: 'Temperate and tropical forests worldwide', type: 'habitat' },
  'lichen':           { regions: ['worldwide'], label: 'Every terrestrial habitat from tropics to polar regions; rocks, bark, soil', type: 'habitat' },
  'morel':            { regions: ['north-america', 'europe', 'east-asia'], label: 'Temperate forests of the Northern Hemisphere; often near ash, elm, and apple trees', type: 'habitat' },
  'ergot':            { regions: ['europe', 'north-america', 'worldwide'], label: 'Temperate grain-growing regions worldwide; infects rye and other cereals', type: 'habitat' },
  'death-cap':        { regions: ['europe', 'north-america', 'east-asia', 'oceania'], label: 'Temperate deciduous forests worldwide; responsible for 90% of fatal mushroom poisonings', type: 'habitat' },
  'shiitake':         { regions: ['east-asia', 'worldwide'], label: 'Native to East Asian deciduous forests; now cultivated worldwide', type: 'habitat' },
  'lions-mane':       { regions: ['north-america', 'europe', 'east-asia'], label: 'Temperate hardwood forests of North America, Europe, and East Asia', type: 'habitat' },
  'fly-agaric':       { regions: ['europe', 'north-america', 'east-asia', 'oceania'], label: 'Temperate and boreal forests of the Northern Hemisphere; introduced to Southern Hemisphere', type: 'habitat' },

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
  'water-lily':       { regions: ['worldwide', 'freshwater'], label: 'Freshwater ponds, lakes, and slow rivers on every continent', type: 'habitat' },
  'orchid':           { regions: ['worldwide'], label: 'Every continent except Antarctica; greatest diversity in tropics', type: 'habitat' },
  'bamboo':           { regions: ['south-asia', 'southeast-asia', 'east-asia', 'south-america', 'africa'], label: 'Tropical and subtropical regions of Asia, Africa, and the Americas', type: 'habitat' },
  'cactus':           { regions: ['north-america', 'central-america', 'south-america'], label: 'Deserts and arid regions of the Americas; one species native to Africa', type: 'habitat' },
  'sundew':           { regions: ['worldwide'], label: 'Bogs and wetlands on every continent except Antarctica', type: 'habitat' },
  'venus-flytrap':    { regions: ['north-america'], label: 'Coastal plains of North and South Carolina, USA — extremely restricted endemic range', type: 'endemic' },
  'baobab':           { regions: ['africa', 'south-asia', 'oceania'], label: 'Savannas of sub-Saharan Africa, Madagascar; also northwestern India and Australia', type: 'habitat' },
  'sunflower':        { regions: ['north-america', 'worldwide'], label: 'Native to North America; cultivated on every continent for oil and seeds', type: 'habitat' },
  'rice':             { regions: ['worldwide'], label: 'Cultivated worldwide; native to Asia — feeds over half the world population', type: 'habitat' },
  'oak':              { regions: ['north-america', 'europe', 'east-asia'], label: 'Temperate and subtropical forests of the Northern Hemisphere', type: 'habitat' },
  'pitcher-plant':    { regions: ['north-america', 'southeast-asia', 'oceania'], label: 'Bogs of eastern North America; tropical forests of Southeast Asia and Australia', type: 'habitat' },
  'lotus':            { regions: ['south-asia', 'southeast-asia', 'east-asia', 'freshwater'], label: 'Shallow freshwater ponds and lakes of South and East Asia; sacred plant', type: 'habitat' },
  'eucalyptus':       { regions: ['oceania'], label: 'Native to Australia and nearby islands; introduced to temperate and tropical regions worldwide', type: 'habitat' },
  'coffee':           { regions: ['east-africa', 'worldwide'], label: 'Native to Ethiopian highlands; cultivated in tropical belt worldwide (Coffee Belt)', type: 'habitat' },
  'magnolia':         { regions: ['north-america', 'east-asia', 'central-america', 'south-asia'], label: 'Temperate and subtropical forests of the Americas and Asia', type: 'habitat' },
  'acacia':           { regions: ['africa', 'oceania', 'south-asia', 'central-america', 'south-america'], label: 'Tropical and subtropical savannas worldwide; greatest diversity in Africa and Australia', type: 'habitat' },
  'cycad':            { regions: ['central-america', 'south-america', 'africa', 'south-asia', 'southeast-asia', 'oceania'], label: 'Tropical and subtropical regions worldwide; relict group from dinosaur era', type: 'habitat' },
  'corpse-flower':    { regions: ['southeast-asia'], label: 'Rainforests of Sumatra, Indonesia — among the rarest plants in the world', type: 'endemic' },
  'strangler-fig':    { regions: ['south-asia', 'southeast-asia', 'central-america', 'south-america', 'africa', 'oceania'], label: 'Tropical rainforests worldwide; keystone species in many tropical ecosystems', type: 'habitat' },
  'welwitschia-2':    { regions: ['southern-africa'], label: 'Namib Desert, Namibia and Angola — lives 1,000-2,000 years', type: 'endemic' },
  'titan-sequoia':    { regions: ['north-america'], label: 'Sierra Nevada foothills, California, USA — largest trees by volume on Earth', type: 'endemic' },
  'sensitive-fern':   { regions: ['north-america', 'east-asia'], label: 'Wetlands and moist forests of eastern North America and East Asia', type: 'habitat' },
  'resurrection-fern': { regions: ['north-america', 'africa'], label: 'Eastern North America and southern Africa; epiphyte on tree branches', type: 'habitat' },

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
  'tardigrade':         { regions: ['worldwide'], label: 'Every habitat on Earth — soil, deep sea, mountaintops, Antarctic ice', type: 'habitat' },
  'firefly':            { regions: ['worldwide'], label: 'Temperate and tropical regions worldwide; moist habitats', type: 'habitat' },
  'atlas-moth':         { regions: ['south-asia', 'southeast-asia', 'east-asia'], label: 'Tropical and subtropical forests of South and Southeast Asia', type: 'habitat' },
  'army-ant':           { regions: ['central-america', 'south-america', 'africa', 'south-asia', 'southeast-asia'], label: 'Tropical forests of the Americas, Africa, and Asia', type: 'habitat' },
  'japanese-spider-crab': { regions: ['east-asia'], label: 'Pacific Ocean around Japan; 50-600 m depth', type: 'habitat' },
  'garden-spider':      { regions: ['europe', 'north-america', 'east-asia'], label: 'Gardens, meadows, and woodlands of the Northern Hemisphere', type: 'habitat' },
  'hermit-crab':        { regions: ['marine-global'], label: 'Tropical and temperate coastal waters and shorelines worldwide', type: 'habitat' },
  'portuguese-man-o-war': { regions: ['marine-global'], label: 'Tropical and subtropical Atlantic, Pacific, and Indian oceans', type: 'habitat' },
  'arthropoda':         { regions: ['worldwide'], label: 'Every terrestrial, freshwater, and marine habitat', type: 'habitat' },
  'monarch-butterfly':  { regions: ['north-america', 'central-america'], label: 'North America; overwinters in central Mexico and coastal California', type: 'habitat' },
  'leafcutter-ant':     { regions: ['central-america', 'south-america'], label: 'Tropical and subtropical forests from Texas to Argentina', type: 'habitat' },
  'dragonfly':          { regions: ['worldwide', 'freshwater'], label: 'Near freshwater on every continent except Antarctica', type: 'habitat' },
  'mollusca':           { regions: ['worldwide', 'marine-global', 'freshwater'], label: 'Marine, freshwater, and terrestrial worldwide', type: 'habitat' },
  'giant-squid':        { regions: ['marine-deep', 'marine-global'], label: 'Deep ocean worldwide, 300-1,000 m depth; all temperate and tropical oceans', type: 'habitat' },
  'common-starfish':    { regions: ['europe', 'marine-global'], label: 'Northeastern Atlantic coasts from Norway to Senegal', type: 'habitat' },
  'common-earthworm':   { regions: ['worldwide'], label: 'Temperate soils worldwide; native to Europe, introduced globally', type: 'habitat' },
  'platyhelminthes':    { regions: ['worldwide', 'marine-global', 'freshwater'], label: 'Marine, freshwater, and terrestrial worldwide; many parasitic', type: 'habitat' },
  'planarian':          { regions: ['worldwide', 'freshwater'], label: 'Freshwater streams, ponds, and springs worldwide', type: 'habitat' },
  'tardigrada':         { regions: ['worldwide'], label: 'Every habitat on Earth — moss, deep sea, mountaintops, Antarctic ice', type: 'habitat' },
  'chordata':           { regions: ['worldwide', 'marine-global'], label: 'Every terrestrial, freshwater, and marine habitat on Earth', type: 'habitat' },
  'sponges':            { regions: ['marine-global', 'freshwater'], label: 'All oceans from intertidal to abyssal; some freshwater species', type: 'habitat' },
  'glass-sponge':       { regions: ['marine-deep'], label: 'Deep ocean worldwide, 200-6,000 m; glass sponge reefs in British Columbia', type: 'habitat' },
  'barrel-sponge':      { regions: ['marine-global'], label: 'Tropical coral reefs of the Caribbean, Indo-Pacific, and Red Sea', type: 'habitat' },
  'mollusks':           { regions: ['worldwide', 'marine-global', 'freshwater'], label: 'Marine, freshwater, and terrestrial worldwide', type: 'habitat' },
  'giant-clam':         { regions: ['southeast-asia', 'oceania'], label: 'Shallow coral reefs of the Indo-Pacific, from East Africa to Micronesia', type: 'habitat' },
  'cone-snail':         { regions: ['marine-global'], label: 'Tropical and subtropical coral reefs and sandy shallows worldwide', type: 'habitat' },
  'hercules-beetle':    { regions: ['central-america', 'south-america'], label: 'Tropical rainforests from Mexico to Bolivia and the Caribbean', type: 'habitat' },
  'mosquito':           { regions: ['worldwide'], label: 'Every continent except Antarctica; tropics to Arctic tundra', type: 'habitat' },
  'praying-mantis':     { regions: ['worldwide'], label: 'Tropical and temperate regions worldwide; greatest diversity in tropics', type: 'habitat' },
  'cockroach':          { regions: ['worldwide'], label: 'Every continent except Antarctica; tropical to temperate habitats', type: 'habitat' },
  'golden-orb-spider':  { regions: ['africa', 'south-asia', 'southeast-asia', 'oceania', 'south-america'], label: 'Tropical and subtropical forests worldwide', type: 'habitat' },
  'emperor-scorpion':   { regions: ['west-africa'], label: 'Tropical rainforests and savannas of West Africa — Nigeria to Senegal', type: 'habitat' },
  'lobster':            { regions: ['north-america', 'europe', 'marine-global'], label: 'Cold-water Atlantic coasts; also tropical seas worldwide', type: 'habitat' },
  'stick-insect':       { regions: ['worldwide'], label: 'Tropical and temperate forests worldwide; greatest diversity in Southeast Asia', type: 'habitat' },
  'bumblebee':          { regions: ['north-america', 'europe', 'east-asia', 'south-america'], label: 'Temperate regions of the Northern Hemisphere; some South American species', type: 'habitat' },
  'termite':            { regions: ['worldwide'], label: 'Tropical and subtropical regions worldwide; some temperate species', type: 'habitat' },
  'cicada':             { regions: ['worldwide'], label: 'Temperate and tropical regions on every continent except Antarctica', type: 'habitat' },
  'dung-beetle':        { regions: ['worldwide'], label: 'Every continent except Antarctica; grasslands, forests, and deserts', type: 'habitat' },
  'crown-of-thorns':    { regions: ['marine-global', 'southeast-asia', 'oceania'], label: 'Coral reefs of the Indo-Pacific from Red Sea to Central America', type: 'habitat' },
  'earthworm':          { regions: ['worldwide'], label: 'Temperate and tropical soils worldwide', type: 'habitat' },
  'giant-tube-worm':    { regions: ['marine-deep'], label: 'Hydrothermal vents in the eastern Pacific, 2,000+ m depth', type: 'habitat' },
  'leaf-insect':        { regions: ['south-asia', 'southeast-asia', 'oceania'], label: 'Tropical forests of South Asia, Southeast Asia, and Australia', type: 'habitat' },
  'leech':              { regions: ['worldwide', 'freshwater'], label: 'Freshwater, terrestrial, and marine habitats worldwide', type: 'habitat' },
  'feather-star':       { regions: ['marine-global'], label: 'Tropical and temperate oceans worldwide; shallow reefs to deep sea', type: 'habitat' },
  'nematodes':          { regions: ['worldwide'], label: 'Every habitat on Earth — soil, marine, freshwater, parasitic in plants and animals', type: 'habitat' },
  'c-elegans':          { regions: ['worldwide'], label: 'Temperate soils worldwide; rotting vegetation and compost', type: 'habitat' },

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
  'chameleon':        { regions: ['africa', 'south-asia', 'southeast-asia', 'europe'], label: 'Africa (especially Madagascar), southern Europe, and South Asia', type: 'habitat' },
  'electric-eel':     { regions: ['south-america', 'freshwater'], label: 'Amazon and Orinoco river basins, South America', type: 'habitat' },
  'poison-dart-frog': { regions: ['central-america', 'south-america'], label: 'Tropical rainforests of Central and South America', type: 'habitat' },
  'hammerhead-shark': { regions: ['marine-global'], label: 'Tropical and warm temperate oceans worldwide; coastal and pelagic', type: 'habitat' },
  'bald-eagle':       { regions: ['north-america'], label: 'North America from Alaska to northern Mexico; near water', type: 'habitat' },
  'condor':           { regions: ['north-america', 'south-america'], label: 'Andes of South America; California, USA (reintroduced)', type: 'habitat' },
  'flamingo':         { regions: ['africa', 'south-america', 'europe', 'south-asia', 'central-america'], label: 'Alkaline and saline lakes in Africa, the Americas, and southern Eurasia', type: 'habitat' },
  'barn-owl':         { regions: ['worldwide'], label: 'Every continent except Antarctica; the most widespread owl', type: 'habitat' },
  'cassowary':        { regions: ['oceania', 'southeast-asia'], label: 'Tropical rainforests of New Guinea and northeastern Australia', type: 'habitat' },
  'emperor-penguin':  { regions: ['marine-global'], label: 'Antarctic coasts and surrounding Southern Ocean', type: 'habitat' },
  'hummingbird':      { regions: ['north-america', 'central-america', 'south-america'], label: 'The Americas — from Alaska to Tierra del Fuego', type: 'habitat' },
  'african-grey-parrot': { regions: ['africa'], label: 'Dense lowland rainforests of West and Central Africa', type: 'habitat' },
  'wandering-albatross': { regions: ['marine-global'], label: 'Southern Ocean; breeds on sub-Antarctic islands', type: 'habitat' },
  'bee-hummingbird':  { regions: ['central-america'], label: 'Cuba and Isla de la Juventud — endemic', type: 'endemic' },
  'new-caledonian-crow': { regions: ['oceania'], label: 'New Caledonia archipelago, South Pacific', type: 'endemic' },
  'ostrich':          { regions: ['africa'], label: 'Savannas, grasslands, and semi-arid regions of sub-Saharan Africa', type: 'habitat' },
  'kiwi':             { regions: ['oceania'], label: 'Forests and shrublands across New Zealand', type: 'endemic' },
  'secretary-bird':   { regions: ['africa'], label: 'Open grasslands and savannas of sub-Saharan Africa', type: 'habitat' },
  'toucan':           { regions: ['central-america', 'south-america'], label: 'Tropical and subtropical forests from Mexico to Argentina', type: 'habitat' },
  'pelican':          { regions: ['worldwide'], label: 'Coasts, lakes, and rivers on every continent except Antarctica', type: 'habitat' },
  'woodpecker':       { regions: ['worldwide'], label: 'Forests worldwide except Australia, Madagascar, and Antarctica', type: 'habitat' },
  'swift':            { regions: ['worldwide'], label: 'Breeds across Europe and Asia; winters in sub-Saharan Africa', type: 'habitat' },
  'lyrebird':         { regions: ['oceania'], label: 'Temperate rainforests of southeastern Australia', type: 'endemic' },
  'hoatzin':          { regions: ['south-america'], label: 'Swamps and riverine forests of the Amazon and Orinoco basins', type: 'habitat' },
  'arctic-tern':      { regions: ['worldwide', 'marine-global'], label: 'Breeds in Arctic; migrates to Antarctic — every ocean', type: 'habitat' },
  'harpy-eagle':      { regions: ['central-america', 'south-america'], label: 'Lowland tropical rainforests from Mexico to Argentina', type: 'habitat' },
  'shoebill':         { regions: ['africa'], label: 'Freshwater swamps of central tropical Africa — Uganda, Zambia, South Sudan', type: 'habitat' },
  'superb-fairywren': { regions: ['oceania'], label: 'Woodlands and gardens across southeastern Australia', type: 'habitat' },
  'green-sea-turtle': { regions: ['marine-global'], label: 'Tropical and subtropical oceans worldwide; nests on sandy beaches', type: 'habitat' },
  'king-cobra':       { regions: ['south-asia', 'southeast-asia'], label: 'Rainforests and mangrove swamps of India and Southeast Asia', type: 'habitat' },
  'saltwater-crocodile': { regions: ['southeast-asia', 'oceania', 'south-asia'], label: 'Coastal and brackish waters from India to northern Australia', type: 'habitat' },
  'anaconda':         { regions: ['south-america'], label: 'Swamps, marshes, and rivers of the Amazon and Orinoco basins', type: 'habitat' },
  'gecko':            { regions: ['worldwide'], label: 'Tropical and subtropical habitats worldwide; also warm temperate regions', type: 'habitat' },
  'python':           { regions: ['africa', 'south-asia', 'southeast-asia', 'oceania'], label: 'Tropical and subtropical forests of Africa, Asia, and Australia', type: 'habitat' },
  'iguana':           { regions: ['central-america', 'south-america'], label: 'Central and South America, Caribbean islands; marine iguana endemic to Galápagos', type: 'habitat' },
  'leatherback-turtle': { regions: ['marine-global'], label: 'All tropical and temperate oceans; most wide-ranging reptile', type: 'habitat' },
  'golden-poison-frog': { regions: ['south-america'], label: 'Pacific coast rainforests of Colombia — extremely restricted range', type: 'endemic' },
  'axolotl':          { regions: ['central-america'], label: 'Lake Xochimilco, Mexico City — critically restricted habitat', type: 'endemic' },
  'chinese-giant-salamander': { regions: ['east-asia'], label: 'Mountain streams and lakes of central and southern China', type: 'endemic' },
  'giant-salamander': { regions: ['east-asia'], label: 'Cool mountain streams of Japan', type: 'endemic' },
  'red-eyed-tree-frog': { regions: ['central-america', 'south-america'], label: 'Lowland tropical rainforests from Mexico to Colombia', type: 'habitat' },
  'clownfish':          { regions: ['south-asia', 'southeast-asia', 'oceania'], label: 'Coral reefs of the Indian and western Pacific oceans', type: 'habitat' },
  'anglerfish':         { regions: ['marine-deep', 'marine-global'], label: 'Deep ocean worldwide, 200-2,000+ m depth', type: 'habitat' },
  'seahorse':           { regions: ['marine-global'], label: 'Shallow tropical and temperate coastal waters worldwide', type: 'habitat' },
  'manta-ray':          { regions: ['marine-global'], label: 'Tropical and subtropical oceans worldwide; coastal and pelagic', type: 'habitat' },
  'pufferfish':         { regions: ['marine-global', 'freshwater'], label: 'Tropical and subtropical oceans; some freshwater species', type: 'habitat' },
  'whale-shark':        { regions: ['marine-global'], label: 'Tropical and warm temperate oceans worldwide; pelagic', type: 'habitat' },
  'piranha':            { regions: ['south-america', 'freshwater'], label: 'Rivers and lakes of the Amazon, Orinoco, and other South American basins', type: 'habitat' },
  'mola-mola':          { regions: ['marine-global'], label: 'Tropical and temperate oceans worldwide; surface to 600 m', type: 'habitat' },
  'salmon':             { regions: ['north-america', 'europe', 'east-asia', 'marine-global'], label: 'North Pacific and North Atlantic; anadromous — ocean to freshwater rivers', type: 'habitat' },
  'flying-fish':        { regions: ['marine-global'], label: 'Tropical and subtropical open ocean worldwide', type: 'habitat' },
  'tuna':               { regions: ['marine-global'], label: 'All oceans; temperate and tropical pelagic waters', type: 'habitat' },
  'swordfish':          { regions: ['marine-global'], label: 'Tropical and temperate oceans worldwide; surface to 550 m', type: 'habitat' },
  'mudskipper':         { regions: ['africa', 'south-asia', 'southeast-asia', 'oceania'], label: 'Mangrove swamps and tidal mudflats of Indo-Pacific coasts', type: 'habitat' },
  'blobfish':           { regions: ['oceania', 'marine-deep'], label: 'Deep waters (600-1,200 m) off southeastern Australia and New Zealand', type: 'habitat' },
  'arapaima':           { regions: ['south-america', 'freshwater'], label: 'Amazon and Essequibo river basins; floodplain lakes', type: 'habitat' },
  'mammals':          { regions: ['worldwide'], label: 'Every terrestrial, marine, and aerial habitat', type: 'habitat' },
  'cetaceans':        { regions: ['marine-global'], label: 'All oceans; some river dolphins in freshwater', type: 'habitat' },
  'blue-whale':       { regions: ['marine-global'], label: 'All oceans; migrates pole-to-equator seasonally', type: 'habitat' },
  'naked-mole-rat':   { regions: ['east-africa'], label: 'Arid grasslands of Ethiopia, Somalia, Kenya', type: 'endemic' },
  'platypus':         { regions: ['oceania'], label: 'Eastern Australia and Tasmania; freshwater streams', type: 'endemic' },
  'primates':         { regions: ['africa', 'south-asia', 'southeast-asia', 'south-america', 'east-asia'], label: 'Tropical forests of Africa, Asia, and the Americas', type: 'habitat' },
  'lion':             { regions: ['africa', 'south-asia'], label: 'Sub-Saharan Africa and Gir Forest, India', type: 'habitat' },
  'tiger':            { regions: ['south-asia', 'southeast-asia', 'east-asia'], label: 'India, Southeast Asia, Siberia, and Sumatra', type: 'habitat' },
  'polar-bear':       { regions: ['north-america', 'europe', 'central-asia'], label: 'Arctic sea ice — Canada, Russia, Norway, Greenland, Alaska', type: 'habitat' },
  'giant-panda':      { regions: ['east-asia'], label: 'Mountain bamboo forests of central China (Sichuan, Shaanxi, Gansu)', type: 'endemic' },
  'snow-leopard':     { regions: ['central-asia', 'south-asia', 'east-asia'], label: 'High mountain ranges — Himalayas, Altai, Hindu Kush, Tian Shan', type: 'habitat' },
  'red-panda':        { regions: ['south-asia', 'east-asia'], label: 'Temperate forests of the eastern Himalayas and southwestern China', type: 'habitat' },
  'pangolin':         { regions: ['africa', 'south-asia', 'southeast-asia'], label: 'Tropical forests and savannas of Africa and Asia', type: 'habitat' },
  'red-kangaroo':     { regions: ['oceania'], label: 'Arid and semi-arid interior of Australia', type: 'habitat' },
  'koala':            { regions: ['oceania'], label: 'Eucalyptus forests of eastern and southeastern Australia', type: 'endemic' },
  'moose':            { regions: ['north-america', 'europe', 'east-asia'], label: 'Boreal and mixed forests of North America, Scandinavia, and Russia', type: 'habitat' },
  'hippopotamus':     { regions: ['africa'], label: 'Rivers, lakes, and wetlands of sub-Saharan Africa', type: 'habitat' },
  'wolverine':        { regions: ['north-america', 'europe', 'east-asia'], label: 'Boreal forests and tundra of North America, Scandinavia, and Siberia', type: 'habitat' },
  'humpback-whale':   { regions: ['marine-global'], label: 'All oceans; migrates from polar feeding grounds to tropical breeding waters', type: 'habitat' },
  'narwhal':          { regions: ['north-america', 'europe'], label: 'Arctic waters — Canadian Archipelago, Greenland, Svalbard', type: 'habitat' },
  'sea-otter':        { regions: ['north-america', 'east-asia'], label: 'North Pacific coast — Alaska, California, Russia, Japan (historically)', type: 'habitat' },
  'bottlenose-dolphin': { regions: ['marine-global'], label: 'Temperate and tropical oceans worldwide; coastal and offshore', type: 'habitat' },
  'flying-fox':       { regions: ['south-asia', 'southeast-asia', 'oceania', 'east-africa'], label: 'Tropical and subtropical forests of South Asia, Southeast Asia, and Australia', type: 'habitat' },
  'african-elephant': { regions: ['africa'], label: 'Sub-Saharan Africa — savannas, forests, deserts, and marshes', type: 'habitat' },
  'gray-wolf':        { regions: ['north-america', 'europe', 'east-asia', 'central-asia'], label: 'Northern Hemisphere — forests, tundra, grasslands, and mountains', type: 'habitat' },
  'three-toed-sloth': { regions: ['central-america', 'south-america'], label: 'Tropical rainforests of Central and South America', type: 'habitat' },
  'wolf':             { regions: ['north-america', 'europe', 'east-asia', 'central-asia'], label: 'Northern Hemisphere — boreal forests, tundra, and mountains', type: 'habitat' },
  'dolphin':          { regions: ['marine-global'], label: 'All oceans; temperate and tropical coastal waters', type: 'habitat' },
  'echidna':          { regions: ['oceania'], label: 'Australia, Tasmania, and New Guinea — forests, grasslands, and arid scrub', type: 'habitat' },
  'giraffe':          { regions: ['africa'], label: 'Savannas and woodlands of sub-Saharan Africa', type: 'habitat' },
  'white-rhinoceros': { regions: ['africa'], label: 'Grasslands and savannas of eastern and southern Africa', type: 'habitat' },
  'cheetah':          { regions: ['africa', 'west-asia'], label: 'Sub-Saharan Africa; tiny population in Iran', type: 'habitat' },
  'manatee':          { regions: ['north-america', 'central-america', 'south-america', 'africa'], label: 'Warm coastal waters, rivers, and estuaries of the Americas and West Africa', type: 'habitat' },
  'beaver':           { regions: ['north-america', 'europe', 'east-asia'], label: 'Freshwater rivers, streams, and wetlands of North America and Eurasia', type: 'habitat' },
  'capybara':         { regions: ['south-america'], label: 'Wetlands, rivers, and lakes of South America east of the Andes', type: 'habitat' },
  'armadillo':        { regions: ['north-america', 'central-america', 'south-america'], label: 'Grasslands and forests from southern USA to Argentina', type: 'habitat' },
  'gibbon':           { regions: ['south-asia', 'southeast-asia', 'east-asia'], label: 'Tropical and subtropical forests of Southeast Asia, India, and southern China', type: 'habitat' },
  'spotted-hyena':    { regions: ['africa'], label: 'Sub-Saharan Africa — savannas, woodlands, forest edges, and even mountains', type: 'habitat' },
  'meerkat':          { regions: ['southern-africa'], label: 'Kalahari Desert and arid regions of southern Africa', type: 'habitat' },
  'walrus':           { regions: ['north-america', 'europe', 'east-asia'], label: 'Arctic and subarctic seas — Pacific and Atlantic populations', type: 'habitat' },
  'dugong':           { regions: ['east-africa', 'south-asia', 'southeast-asia', 'oceania'], label: 'Warm coastal waters of the Indian and western Pacific oceans', type: 'habitat' },
  'wombat':           { regions: ['oceania'], label: 'Forests, mountains, and grasslands of southeastern Australia and Tasmania', type: 'endemic' },
  'hedgehog':         { regions: ['europe', 'africa', 'west-asia', 'south-asia'], label: 'Woodlands, hedgerows, and gardens of Europe, Africa, and Asia', type: 'habitat' },
  'jaguar':           { regions: ['central-america', 'south-america'], label: 'Tropical rainforests, wetlands, and grasslands from Mexico to Argentina', type: 'habitat' },
  'vampire-bat':      { regions: ['central-america', 'south-america'], label: 'Tropical and subtropical forests from Mexico to Brazil, Argentina, and Chile', type: 'habitat' },
  'elephant-seal':    { regions: ['north-america', 'south-america'], label: 'North Pacific coast and sub-Antarctic islands; breeds on beaches', type: 'habitat' },
  'okapi':            { regions: ['africa'], label: 'Dense tropical rainforests of the northeastern Democratic Republic of Congo', type: 'endemic' },
  'aye-aye':          { regions: ['africa'], label: 'Eastern rainforests and dry deciduous forests of Madagascar', type: 'endemic' },
  'african-wild-dog': { regions: ['africa'], label: 'Sub-Saharan Africa — savannas, grasslands, and sparse woodlands', type: 'habitat' },

  // ── GREAT APES ──
  'great-apes': { regions: ['africa', 'southeast-asia'], label: 'Tropical forests of Africa and Southeast Asia', type: 'habitat' },
  'orangutan':  { regions: ['southeast-asia'], label: 'Rainforests of Borneo and Sumatra', type: 'endemic' },
  'gorilla':    { regions: ['africa'], label: 'Tropical forests of Central and West Africa', type: 'endemic' },
  'chimpanzee': { regions: ['africa'], label: 'Tropical forests and savannas of Central and West Africa', type: 'habitat' },
  'bonobo':     { regions: ['africa'], label: 'Dense rainforests south of the Congo River, DRC', type: 'habitat' },
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

export const BRANCH_DATA = {
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
  'bonobo': {
    size: '1.1-1.5 m standing, 30-45 kg',
    diet: 'Omnivore — primarily fruit, supplemented with leaves, seeds, insects',
    lifespan: '~40 years in the wild',
    conservation: 'Endangered; ~15,000-20,000 remaining',
    ability: 'Matriarchal society; resolves conflict through social bonding; walks bipedally more than other apes'
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

  // ── NEW BIRDS ──
  'birds': {
    ability: 'Living dinosaurs — the only surviving theropods; evolved flight, hollow bones, feathers, endothermy, and the most efficient respiratory system of any vertebrate'
  },
  'emperor-penguin': {
    diet: 'Carnivore — fish, squid, krill',
    lifespan: '15-20 years in the wild',
    conservation: 'Near Threatened; declining due to sea ice loss',
    size: 'Up to 1.2 m tall, 45 kg; tallest and heaviest living penguin',
    ability: 'Dives to 565 m and holds breath 22 minutes; breeds in -60°C; males incubate eggs 65 days without food'
  },
  'hummingbird': {
    diet: 'Nectarivore — flower nectar, tiny insects, spiders',
    lifespan: '3-5 years (wild), up to 12 years',
    conservation: 'Least Concern (most species); some critically endangered',
    size: '5.5-21.5 cm; 1.8-20 g; smallest: bee hummingbird at 1.8 g',
    ability: 'Only birds that fly backwards; wings beat 12-80 times/sec; heart rate up to 1,260 bpm; enter torpor nightly'
  },
  'african-grey-parrot': {
    diet: 'Herbivore — seeds, nuts, fruits, berries, bark',
    lifespan: '40-60 years in captivity, 23 years in wild',
    conservation: 'Endangered; severe decline from wild trapping for pet trade',
    size: '300-500 g; 33 cm body length',
    ability: 'Cognitive ability of a 4-6 year old child; Alex learned 100+ English words, could count, identify colors and shapes'
  },
  'wandering-albatross': {
    diet: 'Carnivore — squid, fish, crustaceans, carrion',
    lifespan: '~50 years; some recorded over 70',
    conservation: 'Vulnerable; longline fishing bycatch is primary threat',
    size: 'Wingspan 3.1-3.5 m — longest of any living bird; 6-12 kg',
    ability: 'Flies 120,000 km/year without flapping via dynamic soaring; can sleep while gliding; travels entire Southern Ocean'
  },
  'bee-hummingbird': {
    diet: 'Nectarivore — nectar from 1,500+ flowers per day, tiny insects',
    lifespan: '~7 years',
    conservation: 'Near Threatened; habitat loss in Cuba',
    size: '5.5 cm, 1.8 g — smallest bird and smallest warm-blooded animal on Earth',
    ability: 'Wings beat 80 times/sec; heart rate 1,260 bpm; eggs the size of coffee beans; weighs less than a US penny'
  },
  'new-caledonian-crow': {
    diet: 'Omnivore — insects, larvae, nuts, seeds, fruit',
    lifespan: '~15 years in the wild',
    conservation: 'Least Concern',
    size: '~350 g; 40 cm',
    ability: 'Manufactures multi-step tools from raw materials; passes tool designs between generations; solves 8-step puzzle boxes'
  },
  'ostrich': {
    diet: 'Omnivore — seeds, shrubs, grasses, insects, lizards',
    lifespan: '40-45 years in the wild',
    conservation: 'Least Concern',
    size: 'Up to 2.7 m, 156 kg — largest living bird; eyes 5 cm across (largest of any land animal)',
    ability: 'Runs 70 km/h sustained — fastest two-legged animal; kick can kill a lion; lays the largest eggs (1.4 kg each)'
  },
  'kiwi': {
    diet: 'Omnivore — earthworms, insects, berries, seeds',
    lifespan: '25-50 years',
    conservation: 'Vulnerable (most species); intensive conservation in NZ',
    size: '1.3-3.3 kg; 25-45 cm — similar size to a chicken',
    ability: 'Only bird with nostrils at beak tip; best sense of smell of any bird; lays eggs 25% of body weight; whiskers like a cat'
  },
  'secretary-bird': {
    diet: 'Carnivore — snakes, lizards, insects, rodents, bird eggs',
    lifespan: '10-15 years in the wild',
    conservation: 'Endangered; rapid decline across African range',
    size: '1.2-1.5 m tall, 3.5-4.5 kg; legs can be 1 m long',
    ability: 'Kills venomous snakes by stomping — delivers 195 N of force in 15 ms; only raptor that hunts primarily on foot'
  },
  'toucan': {
    diet: 'Omnivore — fruit, insects, small lizards, eggs, nestlings',
    lifespan: '~20 years',
    conservation: 'Variable; toco toucan Least Concern; some species Vulnerable',
    size: '130-680 g; bill up to 1/3 of body length',
    ability: 'Bill is a thermoregulator — flushes with blood to dump body heat; lightweight honeycomb keratin structure; key seed disperser'
  },
  'pelican': {
    diet: 'Carnivore — fish, occasionally crustaceans and amphibians',
    lifespan: '15-25 years in the wild, up to 54 in captivity',
    conservation: 'Variable; Dalmatian pelican Vulnerable, others Least Concern',
    size: '4-15 kg; wingspan up to 3.6 m; throat pouch holds 11 liters',
    ability: 'Cooperative fishing — herds fish in synchronized crescent; throat pouch holds 3× more than stomach; plunge-dives from 20 m'
  },
  'woodpecker': {
    diet: 'Insectivore — wood-boring larvae, ants, sap, nuts, seeds',
    lifespan: '4-12 years depending on species',
    conservation: 'Variable; ivory-billed woodpecker likely extinct; most species Least Concern',
    size: '7 cm (piculet) to 58 cm (imperial); most 15-35 cm',
    ability: 'Strikes at 20 hits/sec, 1,200 g deceleration; spongy skull bone + tongue wrapping skull absorbs impact; barbed tongue extracts larvae'
  },
  'swift': {
    diet: 'Insectivore — aerial insects caught on the wing',
    lifespan: '~5 years; record 21 years',
    conservation: 'Least Concern (common swift); declining in Europe',
    size: '30-55 g; 16-17 cm; scimitar-shaped wings span 40-44 cm',
    ability: 'Stays airborne 10 months nonstop — eats, sleeps, and mates in flight; among fastest in level flight at 110 km/h'
  },
  'lyrebird': {
    diet: 'Insectivore — invertebrates from leaf litter, worms, spiders',
    lifespan: '~30 years',
    conservation: 'Albert\'s lyrebird Near Threatened; superb lyrebird Least Concern',
    size: '0.8-1.0 kg; male tail feathers reach 60 cm',
    ability: 'Most accomplished vocal mimic in the animal kingdom — chainsaws, camera shutters, other bird species, human speech; accuracy fools target species'
  },
  'hoatzin': {
    diet: 'Herbivore — leaves, flowers, fruit (fermented in crop)',
    lifespan: '~15 years',
    conservation: 'Least Concern; common in Amazon basin',
    size: '700-900 g; 65 cm; stocky with tiny head crest',
    ability: 'Only bird that ferment-digests like a cow; chicks have functional wing claws for climbing (lost as adults); smells like manure from fermentation'
  },
  'arctic-tern': {
    diet: 'Carnivore — small fish, crustaceans, insects',
    lifespan: '~30 years; record 34 years',
    conservation: 'Least Concern',
    size: '86-127 g; 33-36 cm; wingspan 76-85 cm',
    ability: 'Longest migration of any animal — 70,000 km Arctic to Antarctic annually; sees more daylight than any other creature'
  },
  'harpy-eagle': {
    diet: 'Carnivore — monkeys, sloths, macaws, iguanas',
    lifespan: '25-35 years',
    conservation: 'Vulnerable; deforestation is primary threat',
    size: 'Up to 9 kg; talons 13 cm (grizzly bear–sized); wingspan 2 m',
    ability: 'Strongest grip of any eagle — 530 PSI; snatches monkeys and sloths from canopy at 80 km/h; rear talon matches bear claw'
  },
  'shoebill': {
    diet: 'Carnivore — lungfish, catfish, frogs, baby crocodiles, water snakes',
    lifespan: '~35 years; up to 50 in captivity',
    conservation: 'Vulnerable; ~5,000-8,000 remaining; swamp drainage main threat',
    size: '4-7 kg; 1.1-1.4 m tall; bill 12 cm wide, 23 cm long',
    ability: 'Stands motionless for hours; decapitation strike on fish; bill-clattering sounds like machine-gun fire audible 100 m away'
  },
  'superb-fairywren': {
    diet: 'Insectivore — insects, spiders, small seeds',
    lifespan: '5-6 years',
    conservation: 'Least Concern; common across Australia',
    size: '8-13 g; 14 cm; one of the smallest passerines',
    ability: 'Males pluck yellow petals as courtship gifts; females teach embryos a "password" song through the egg shell — chicks must sing it to be fed'
  },

  // ── NEW MAMMALS ──
  'lion': {
    diet: 'Carnivore; large ungulates, zebra, wildebeest',
    lifespan: '10-14 years (wild), 20+ years (captivity)',
    conservation: 'Vulnerable; ~23,000 remaining, declining 43% in 21 years',
    size: 'Males 190 kg, females 130 kg; up to 2.5 m length',
    ability: 'Only social cat; cooperative hunting in prides'
  },
  'tiger': {
    diet: 'Carnivore; deer, wild boar, water buffalo',
    lifespan: '10-15 years (wild), 20-26 years (captivity)',
    conservation: 'Endangered; ~4,500 remaining in the wild',
    size: 'Males up to 300 kg, 3.3 m total length',
    ability: 'Largest living cat; powerful swimmers; solitary apex predator'
  },
  'polar-bear': {
    diet: 'Carnivore; ringed seals, bearded seals, walrus',
    lifespan: '25-30 years in the wild',
    conservation: 'Vulnerable; ~22,000-31,000 remaining; threatened by sea ice loss',
    size: 'Males 350-700 kg; largest living land carnivore',
    ability: 'Swims 100+ km in open ocean; black skin under white fur absorbs heat'
  },
  'giant-panda': {
    diet: 'Herbivore; 99% bamboo, eats 12-38 kg per day',
    lifespan: '20 years (wild), 30+ years (captivity)',
    conservation: 'Vulnerable; ~1,860 in the wild; recovering due to conservation efforts',
    size: '70-125 kg; 1.2-1.9 m length',
    ability: 'Pseudothumb (enlarged wrist bone) for gripping bamboo; solitary lifestyle'
  },
  'snow-leopard': {
    diet: 'Carnivore; bharal, ibex, marmots, hares',
    lifespan: '10-12 years (wild), 20+ years (captivity)',
    conservation: 'Vulnerable; 4,000-6,500 estimated in the wild',
    size: '22-55 kg; tail nearly as long as body for balance',
    ability: 'Leaps up to 15 m; lives at 3,000-5,500 m altitude; cannot roar'
  },
  'red-panda': {
    diet: 'Herbivore; mostly bamboo leaves and shoots, some fruit and insects',
    lifespan: '8-10 years (wild), 15 years (captivity)',
    conservation: 'Endangered; fewer than 10,000 remaining; habitat fragmentation',
    size: '3-6 kg; 50-64 cm body length plus 28-49 cm tail',
    ability: 'Extended wrist bone acts as false thumb; arboreal lifestyle in cold mountain forests'
  },
  'pangolin': {
    diet: 'Insectivore; ants and termites using 40 cm sticky tongue',
    lifespan: '~20 years',
    conservation: 'Critically Endangered (3 of 8 species); most trafficked mammal on Earth',
    size: '1.6-33 kg depending on species; 30-100 cm body length',
    ability: 'Only mammal with keratinous scales; rolls into armored ball; no teeth'
  },
  'red-kangaroo': {
    diet: 'Herbivore; grasses and shrubs of arid Australia',
    lifespan: '12-18 years in the wild',
    conservation: 'Least Concern; ~11 million individuals',
    size: 'Males up to 90 kg, 1.8 m tall; largest living marsupial',
    ability: 'Hops at 56 km/h; energy-efficient pentapedal locomotion using tail as fifth limb'
  },
  'koala': {
    diet: 'Herbivore; eucalyptus leaves exclusively; selects from ~50 of 700+ species',
    lifespan: '13-18 years in the wild',
    conservation: 'Vulnerable; declining from habitat loss, bushfire, disease, and climate change',
    size: '4-15 kg; 60-85 cm length',
    ability: 'Sleeps 18-22 hours/day; fingerprints nearly identical to humans; cecum 2 m long for digesting toxic leaves'
  },
  'moose': {
    diet: 'Herbivore; aquatic plants, bark, twigs, willows',
    lifespan: '15-25 years in the wild',
    conservation: 'Least Concern; ~1.5 million worldwide',
    size: 'Males up to 700 kg, 2.1 m at shoulder; largest living deer',
    ability: 'Antlers span up to 1.8 m; dives to eat aquatic plants; closes nostrils underwater'
  },
  'hippopotamus': {
    diet: 'Herbivore; grazes 35 kg of grass nightly',
    lifespan: '40-50 years in the wild',
    conservation: 'Vulnerable; ~115,000-130,000 remaining',
    size: '1,300-1,800 kg; 3.5-5 m length; third-largest land animal',
    ability: 'Secretes red "blood sweat" sunscreen; most dangerous large animal in Africa; runs 30 km/h'
  },
  'wolverine': {
    diet: 'Omnivore; carrion, small mammals, birds, berries',
    lifespan: '5-13 years in the wild',
    conservation: 'Least Concern globally; threatened in southern range',
    size: '9-25 kg; 65-107 cm body length',
    ability: 'Strongest bite relative to size of any mammal; travels 24 km/day; climbs near-vertical cliffs'
  },
  'humpback-whale': {
    diet: 'Carnivore; krill and small schooling fish',
    lifespan: '~80-90 years',
    conservation: 'Least Concern (recovered); ~80,000 from near extinction',
    size: '25-30 tonnes; 12-16 m length',
    ability: 'Complex songs last up to 20 minutes; bubble-net feeding; migrates 25,000 km/year'
  },
  'narwhal': {
    diet: 'Carnivore; Greenland halibut, Arctic cod, squid, shrimp',
    lifespan: '~50 years',
    conservation: 'Least Concern; ~80,000 estimated; threatened by climate change',
    size: '800-1,600 kg; tusk up to 3 m long',
    ability: 'Tusk is a sensory organ with 10 million nerve endings; dives to 1,500 m'
  },
  'sea-otter': {
    diet: 'Carnivore; sea urchins, crabs, clams, abalone',
    lifespan: '15-20 years',
    conservation: 'Endangered; ~106,000 remaining; keystone species for kelp forests',
    size: '14-45 kg; 1-1.5 m length',
    ability: 'Densest fur of any mammal (1 million hairs/cm2); uses rocks as tools to crack shellfish'
  },

  // ── MAMMAL GROUP NODES ──
  'mammals': {
    ability: 'Defining traits: hair/fur, mammary glands, three middle ear bones, neocortex; endothermy enables colonization of every habitat from deep ocean to high altitude'
  },
  'cetaceans': {
    ability: 'Most dramatic mammalian transition: land-dwelling ancestors returned to the sea ~50 Mya; evolved echolocation, largest brains, and deepest dives of any mammal'
  },
  'primates': {
    ability: 'Forward-facing eyes for stereoscopic vision, grasping hands with opposable thumbs, enlarged brains relative to body size; the order that produced language, tools, and culture'
  },
  'great-apes': {
    ability: 'No tail, largest primate brains, prolonged childhood learning, tool use across all species; closest living relatives share 95-99% DNA with humans'
  },
  'hominini': {
    ability: 'The human-chimp clade; evolved bipedalism, dramatically expanded brains (400→1400 cm³), controlled fire, symbolic language, and cumulative culture'
  },

  // ── MORE MAMMALS ──
  'bottlenose-dolphin': {
    diet: 'Carnivore — fish, squid, shrimp',
    lifespan: '40-50 years (wild)',
    conservation: 'Least Concern; population stable worldwide',
    size: '150-650 kg; 2-4 m length',
    ability: 'Echolocation resolves objects millimeters apart; sleeps with one brain hemisphere at a time; recognizes itself in mirrors'
  },
  'sperm-whale': {
    diet: 'Carnivore — giant squid, colossal squid, deep-sea fish',
    lifespan: '~70 years',
    conservation: 'Vulnerable; ~300,000 estimated worldwide',
    size: 'Up to 57 tonnes; 18 m length; largest toothed animal ever',
    ability: 'Dives to 2,250 m for over 2 hours; largest brain of any animal (7.8 kg); clicks reach 236 dB'
  },
  'orca': {
    diet: 'Carnivore — fish, seals, sharks, whales (varies by ecotype)',
    lifespan: '50-80 years (females up to 90)',
    conservation: 'Data Deficient (species-wide); some populations Critically Endangered',
    size: 'Males up to 9 tonnes, 9.8 m; largest member of the dolphin family',
    ability: 'Apex predator of every ocean; culture-specific hunting dialects; teaches cooperative hunting techniques across generations'
  },
  'flying-fox': {
    diet: 'Frugivore — fruit, nectar, pollen',
    lifespan: '15-20 years (wild), 25+ years (captivity)',
    conservation: 'Variable; several species Endangered or Critically Endangered',
    size: 'Up to 1.6 kg; wingspan up to 1.7 m; largest bat',
    ability: 'Keystone pollinator and seed disperser for tropical forests; navigates by sight, not echolocation'
  },
  'african-elephant': {
    diet: 'Herbivore — grasses, bark, roots, fruit (up to 150 kg/day)',
    lifespan: '60-70 years in the wild',
    conservation: 'Endangered; ~415,000 remaining; poaching and habitat loss',
    size: 'Up to 6,000 kg, 3.3 m at shoulder; largest living land animal',
    ability: 'Infrasonic communication travels 10 km; mourns dead; 40,000 muscles in trunk'
  },
  'gray-wolf': {
    diet: 'Carnivore — elk, deer, moose, bison',
    lifespan: '6-8 years (wild), 15 years (captivity)',
    conservation: 'Least Concern globally; extirpated from much of historic range',
    size: '25-80 kg; 1.0-1.6 m body length',
    ability: 'Pack coordination rivals primate social intelligence; stamina running (can travel 70 km/day); howl audible 16 km away'
  },
  'three-toed-sloth': {
    diet: 'Herbivore — leaves, buds, and tender shoots from tropical trees',
    lifespan: '25-30 years in the wild',
    conservation: 'Least Concern (most species); Pygmy three-toed sloth Critically Endangered',
    size: '2.3-5.5 kg; 45-60 cm body length',
    ability: 'Moves so slowly algae grows on fur providing camouflage; metabolic rate 40-45% of expected; can rotate head 270°'
  },
  'tarsier': {
    diet: 'Carnivore — insects, small vertebrates, birds',
    lifespan: '12-20 years',
    conservation: 'Variable by species; Philippine tarsier Near Threatened',
    size: '80-150 g; 10-15 cm body; each eye larger than its brain',
    ability: 'Enormous eyes (16 mm diameter) for nocturnal hunting; can rotate head 180° like an owl; leaps 40× its body length'
  },
  'ring-tailed-lemur': {
    diet: 'Omnivore — fruit, leaves, flowers, bark, sap, insects',
    lifespan: '16-19 years (wild), 27+ years (captivity)',
    conservation: 'Endangered; ~2,000-2,500 remaining in the wild',
    size: '2.2 kg; tail up to 63 cm, longer than body',
    ability: 'Females dominate males (rare in primates); "stink fights" using scent-glands on wrists; sunbathes in lotus position'
  },
  'japanese-macaque': {
    diet: 'Omnivore — fruit, seeds, leaves, insects, fungi, bark',
    lifespan: '27 years (wild), 30+ years (captivity)',
    conservation: 'Least Concern; ~100,000 in Japan',
    size: '8-14 kg; 47-60 cm body length',
    ability: 'Northernmost non-human primate; bathes in hot springs at -15°C; culturally transmits food-washing behavior'
  },
  'mandrill': {
    diet: 'Omnivore — fruits, seeds, insects, small vertebrates',
    lifespan: '20 years (wild), 40+ years (captivity)',
    conservation: 'Vulnerable; declining due to bushmeat hunting and deforestation',
    size: 'Males up to 37 kg; 55-95 cm body length; largest Old World monkey',
    ability: 'Most colorful mammal face: blue and red skin intensifies with rank; forms supergroups of 800+ individuals'
  },
  'star-nosed-mole': {
    diet: 'Insectivore — earthworms, aquatic insects, mollusks',
    lifespan: '3-4 years',
    conservation: 'Least Concern; stable populations in eastern North America',
    size: '35-75 g; 15-20 cm total length',
    ability: 'Fastest-eating mammal: identifies and consumes prey in 120 milliseconds; nose has 25,000 sensory receptors (Eimer\'s organs)'
  },
  'honey-badger': {
    diet: 'Omnivore — honey, insects, snakes, small mammals, fruit',
    lifespan: '~7 years (wild), 24 years (captivity)',
    conservation: 'Least Concern; widespread across Africa and Asia',
    size: '6-16 kg; 55-77 cm body length',
    ability: 'Immune to cobra and scorpion venom; loose thick skin allows twisting to bite attacker when grabbed; fearlessly attacks much larger animals'
  },
  'wolf': {
    diet: 'Carnivore — ungulates, hares, rodents, carrion',
    lifespan: '6-8 years (wild), 15 years (captivity)',
    conservation: 'Least Concern globally; recovering in parts of Europe and North America',
    size: '25-80 kg; 1.0-1.6 m body length',
    ability: 'Ancestor of all domestic dogs; complex social hierarchies; cooperative pack hunting of prey 10× their weight'
  },
  'dolphin': {
    diet: 'Carnivore — fish, squid, crustaceans',
    lifespan: '20-50 years depending on species',
    conservation: 'Variable; most Least Concern, some river dolphins Critically Endangered',
    size: '1.5-4 m length; 40-650 kg depending on species',
    ability: 'Unihemispheric sleep allows constant vigilance; echolocation creates 3D mental images; exhibits culture and cooperative behavior'
  },
  'echidna': {
    diet: 'Insectivore — ants, termites, worms (using electroreceptors in bill)',
    lifespan: '15-20 years (wild), up to 50 years (captivity)',
    conservation: 'Least Concern (short-beaked); Critically Endangered (all long-beaked species)',
    size: '2-7 kg; 30-45 cm body length',
    ability: 'One of only five egg-laying mammals (monotremes); electroreception detects prey; body temperature lowest of any mammal (30-32°C)'
  },
  'giraffe': {
    diet: 'Herbivore — acacia and mimosa leaves, up to 34 kg/day',
    lifespan: '25 years (wild), 28 years (captivity)',
    conservation: 'Vulnerable; ~117,000 remaining; 40% decline in 30 years',
    size: 'Up to 1,900 kg; 5.7 m tall; tallest living animal',
    ability: 'Heart weighs 11 kg and pumps at twice human blood pressure to reach the brain; 45 cm prehensile tongue; each individual has unique spot pattern'
  },
  'white-rhinoceros': {
    diet: 'Herbivore — grasses; grazer with wide flat mouth',
    lifespan: '40-50 years in the wild',
    conservation: 'Near Threatened (Southern, ~18,000); Northern subspecies functionally extinct (2 females remain)',
    size: 'Up to 2,300 kg; 3.7-4 m length; second-largest land animal',
    ability: 'Horn grows up to 1.5 m; charges at 50 km/h despite bulk; creates "middens" (dung piles) as chemical communication boards'
  },
  'cheetah': {
    diet: 'Carnivore — gazelles, impalas, hares, small antelope',
    lifespan: '10-12 years (wild), 15 years (captivity)',
    conservation: 'Vulnerable; ~6,500-7,100 remaining; very low genetic diversity',
    size: '21-72 kg; 1.1-1.5 m body length',
    ability: 'Fastest land animal: 112 km/h in 3 seconds; semi-retractable claws grip like cleats; tail acts as rudder for 90° turns at speed'
  },
  'manatee': {
    diet: 'Herbivore — sea grasses, freshwater vegetation (up to 50 kg/day)',
    lifespan: '40-60 years',
    conservation: 'Vulnerable; West Indian manatee ~13,000; threatened by boat strikes and habitat loss',
    size: '400-590 kg; 2.8-3.6 m length',
    ability: 'Continuously replaces worn teeth from the back of the jaw (marching molars); closest living relative of elephants alongside hyraxes'
  },
  'beaver': {
    diet: 'Herbivore — bark, cambium, aquatic plants, roots',
    lifespan: '10-15 years (wild), 24 years (captivity)',
    conservation: 'Least Concern; recovered from near-extinction after fur trade',
    size: '11-32 kg; 80-120 cm including tail; largest North American rodent',
    ability: 'Supreme ecosystem engineer: builds dams up to 850 m long; creates wetland habitats that increase local biodiversity by 33%'
  },
  'capybara': {
    diet: 'Herbivore — grasses, aquatic plants, bark, fruit',
    lifespan: '8-10 years (wild), 12 years (captivity)',
    conservation: 'Least Concern; stable populations throughout South America',
    size: '35-66 kg; up to 134 cm length; largest living rodent',
    ability: 'Semi-aquatic: swims with eyes, ears, and nostrils above water like a hippo; practices coprophagy to digest cellulose; highly social herds of 10-20'
  },
  'armadillo': {
    diet: 'Insectivore — ants, termites, beetles, grubs',
    lifespan: '12-15 years (wild), 20+ years (captivity)',
    conservation: 'Variable; nine-banded Least Concern; giant armadillo Vulnerable',
    size: '1-54 kg depending on species; nine-banded ~4 kg, 40 cm body',
    ability: 'Bony armor plates (osteoderms) for defense; nine-banded always gives birth to identical quadruplets; can hold breath 6 minutes'
  },
  'gibbon': {
    diet: 'Omnivore — ripe fruit (60%), leaves, flowers, insects',
    lifespan: '25 years (wild), 35-40 years (captivity)',
    conservation: 'Most species Endangered or Critically Endangered; rapid deforestation',
    size: '5-13 kg; 45-90 cm body length; arms longer than legs',
    ability: 'Fastest arboreal mammal: brachiates at 55 km/h swinging 15 m per leap; monogamous pair-bonds; territorial duet songs audible 1 km away'
  },
  'spotted-hyena': {
    diet: 'Carnivore — wildebeest, zebra, antelope; also scavenges',
    lifespan: '12-25 years (wild)',
    conservation: 'Least Concern; ~27,000-47,000 remaining',
    size: '40-86 kg; 95-166 cm body length',
    ability: 'Bite force of 1,100 PSI crushes bone; digests everything including hooves and horns; matriarchal clans with complex social hierarchies rivaling primates'
  },
  'meerkat': {
    diet: 'Omnivore — insects, scorpions, spiders, small vertebrates, tubers',
    lifespan: '12-14 years (captivity), 6-7 years (wild)',
    conservation: 'Least Concern; stable populations in southern Africa',
    size: '620-970 g; 25-35 cm body length',
    ability: 'Sentinel system: designated lookouts scan for predators while group forages; teaches pups to handle scorpions by progressively removing stingers; immune to some venoms'
  },
  'walrus': {
    diet: 'Carnivore — benthic bivalves, clams, snails, sea cucumbers',
    lifespan: '~40 years',
    conservation: 'Vulnerable; ~225,000 remaining; threatened by Arctic sea ice loss',
    size: 'Males up to 1,800 kg; 3.6 m length; tusks up to 1 m',
    ability: 'Uses tusks as ice picks and social rank signals; vibrissae (whiskers) detect shellfish on dark ocean floor; can slow heart rate for 10-minute dives'
  },
  'dugong': {
    diet: 'Herbivore — seagrass exclusively; "sea cow"',
    lifespan: '~70 years',
    conservation: 'Vulnerable; declining due to habitat loss and boat strikes',
    size: '230-500 kg; 2.4-3 m length',
    ability: 'Only strictly marine herbivorous mammal; "cultivates" seagrass by grazing patterns that promote regrowth; inspired mermaid legends'
  },
  'wombat': {
    diet: 'Herbivore — grasses, sedges, roots, bark',
    lifespan: '15 years (wild), 20-30 years (captivity)',
    conservation: 'Least Concern (common); Northern hairy-nosed wombat Critically Endangered (~300)',
    size: '20-35 kg; 84-115 cm length',
    ability: 'Produces cube-shaped feces (unique in nature) for territorial marking; backward-facing pouch protects joey while digging; reinforced cartilage rump plate deters predators'
  },
  'hedgehog': {
    diet: 'Omnivore — insects, snails, frogs, small snakes, berries, mushrooms',
    lifespan: '3-5 years (wild), 8-10 years (captivity)',
    conservation: 'Least Concern (most species); declining in Western Europe from habitat loss',
    size: '0.5-1.2 kg; 15-30 cm body length; ~5,000-7,000 spines',
    ability: 'Rolls into a spiny ball with 5,000+ keratin spines; practices "self-anointing" — chews toxic substances and spreads frothy saliva on spines'
  },
  'jaguar': {
    diet: 'Carnivore — peccaries, capybara, caimans, deer, fish, turtles',
    lifespan: '12-15 years (wild), 20+ years (captivity)',
    conservation: 'Near Threatened; ~64,000 remaining; habitat fragmentation',
    size: '56-96 kg; 1.1-1.9 m body length',
    ability: 'Strongest bite of any big cat (1,500 PSI); pierces turtle shells and caiman skulls; strong swimmer that hunts in water'
  },
  'vampire-bat': {
    diet: 'Sanguivore — blood of livestock and wild mammals',
    lifespan: '9 years (wild), 20 years (captivity)',
    conservation: 'Least Concern; expanding range as livestock spreads',
    size: '25-40 g; 7-9 cm body length; 18 cm wingspan',
    ability: 'Only mammal that feeds entirely on blood; infrared nose pits detect veins; anticoagulant saliva (draculin); shares blood meals with hungry roostmates via reciprocal altruism'
  },
  'elephant-seal': {
    diet: 'Carnivore — deep-sea fish, squid, rays, small sharks',
    lifespan: '20-22 years (females), 14 years (males)',
    conservation: 'Least Concern; recovered from near-extinction in 1890s (~20-100 individuals)',
    size: 'Males up to 3,700 kg, 6 m length; largest pinniped',
    ability: 'Dives to 1,750 m for up to 2 hours; spends 80% of life underwater; males inflate proboscis to produce thundering roars in mating battles'
  },
  'okapi': {
    diet: 'Herbivore — leaves, buds, ferns, fruit, fungi',
    lifespan: '20-30 years',
    conservation: 'Endangered; ~35,000 remaining in Congo; first discovered by Western science in 1901',
    size: '200-350 kg; 1.5 m at shoulder',
    ability: 'Closest living relative of the giraffe; 35 cm prehensile tongue cleans its own ears; zebra-striped legs serve as camouflage and calf-following pattern in dense forest'
  },
  'aye-aye': {
    diet: 'Omnivore — insect larvae (extracted from wood), seeds, nectar, fungi',
    lifespan: '20-23 years (captivity)',
    conservation: 'Endangered; declining due to habitat loss and superstition-based killing',
    size: '2-2.7 kg; 36-44 cm body length; 44-53 cm tail',
    ability: 'Elongated skeletal middle finger taps on wood and listens for grubs (percussive foraging); only primate to use echolocation-like technique; continuously growing rodent-like incisors'
  },
  'african-wild-dog': {
    diet: 'Carnivore — medium antelope, impala, kudu, wildebeest calves',
    lifespan: '10-12 years in the wild',
    conservation: 'Endangered; ~6,600 remaining in fragmented populations',
    size: '18-36 kg; 75-110 cm body length',
    ability: 'Highest hunt success rate of any large predator (80%); "sneeze voting" to decide group hunts; regurgitates food for pups, sick, and elderly pack members'
  },

  // ── INVERTEBRATES ──
  'invertebrates': {
    ability: 'Comprise 97% of all animal species; pioneered every major body plan innovation from bilateral symmetry to compound eyes'
  },
  'arthropoda': {
    ability: 'Most species-rich phylum on Earth with over 1.2 million described species; evolved the exoskeleton, jointed limbs, and compound eyes that enabled dominance of land, sea, and air'
  },
  'insects': {
    ability: 'Most diverse class of organisms with ~1 million described species; evolved flight 100 million years before any vertebrate; underpin most terrestrial food webs as pollinators, decomposers, and prey'
  },
  'monarch-butterfly': {
    diet: 'Herbivore — milkweed (Asclepias) as larva; flower nectar as adult',
    lifespan: '2-6 weeks (summer); 8-9 months (migratory generation)',
    conservation: 'Endangered (IUCN); western population declined 99% since 1980s',
    size: '0.5 g; 8.9-10.2 cm wingspan',
    ability: 'Multi-generational 4,800 km migration from Canada to Mexico using a time-compensated sun compass and magnetic sensing; sequesters cardiac glycosides from milkweed making them toxic to predators'
  },
  'leafcutter-ant': {
    diet: 'Fungivore — cultivates Leucoagaricus fungus gardens using fresh leaf fragments',
    lifespan: '1-3 years (workers); 10-20 years (queen)',
    conservation: 'Least Concern; abundant in Neotropical forests',
    size: '1-14 mm depending on caste',
    ability: 'Agriculture — farms fungus in underground gardens 50 million years before humans; colonies of 5-8 million ants with complex caste system; can carry 50× own body weight'
  },
  'dragonfly': {
    diet: 'Carnivore — mosquitoes, midges, flies, and other small insects caught in flight',
    lifespan: '6 months-6 years (mostly as aquatic nymph); 1-6 months as adult',
    conservation: 'Variable; many species Least Concern; some tropical species threatened',
    size: '2-15 cm wingspan depending on species',
    ability: 'Intercept prey with 95% success rate — highest of any predator; each eye has 30,000 facets; can fly backward, hover, and reach 56 km/h; oldest flying insects (325 Mya)'
  },
  'bombardier-beetle': {
    diet: 'Carnivore — small insects, larvae',
    lifespan: '~2-3 years',
    conservation: 'Least Concern; common in temperate woodlands',
    size: '1-2 cm',
    ability: 'Chemical warfare — ejects boiling (100 °C) benzoquinone spray from twin abdominal glands at 500 pulses per second; the reaction is explosive, producing an audible pop'
  },
  'mollusca': {
    ability: 'Second-largest animal phylum with ~85,000 species; evolved the radula, mantle, and shell that enabled radiation into marine, freshwater, and terrestrial niches'
  },
  'cephalopods': {
    ability: 'Most intelligent invertebrates; evolved camera-type eyes independently from vertebrates, jet propulsion, and the most complex nervous system of any invertebrate'
  },
  'giant-squid': {
    diet: 'Carnivore — deep-sea fish, other squid',
    lifespan: '~5 years',
    conservation: 'Least Concern; deep-sea population likely large but poorly known',
    size: 'Up to 13 m total length; 275 kg; largest invertebrate eyes (27 cm diameter)',
    ability: 'Largest eyes in the animal kingdom — the size of dinner plates — optimized to detect bioluminescent flashes from sperm whale approach in pitch-dark deep ocean'
  },
  'cuttlefish': {
    diet: 'Carnivore — crabs, shrimp, fish, mollusks',
    lifespan: '1-2 years',
    conservation: 'Least Concern (most species)',
    size: '15-50 cm mantle length depending on species',
    ability: 'Hypnotic camouflage — millions of chromatophores change color and texture in milliseconds; can display two different patterns simultaneously; W-shaped pupils see polarized light'
  },
  'cnidarians': {
    ability: 'Pioneered the first true tissues and the cnidocyte — the fastest biological mechanism known (700 nanosecond discharge); includes corals that build the largest biological structures on Earth'
  },
  'box-jellyfish': {
    diet: 'Carnivore — small fish, shrimp',
    lifespan: '~1 year',
    conservation: 'Not assessed; common in Indo-Pacific',
    size: '16-24 tentacles up to 3 m long; bell 20-30 cm',
    ability: 'Most venomous marine animal — can kill a human in minutes; possesses 24 eyes including 4 with true lenses; actively hunts prey rather than drifting like most jellyfish'
  },
  'echinoderms': {
    ability: 'Unique water vascular system powers thousands of tube feet for locomotion and feeding; pentaradial symmetry evolved from bilateral ancestors; closest invertebrate relatives of vertebrates'
  },
  'common-starfish': {
    diet: 'Carnivore — mussels, barnacles, snails; everts stomach to digest prey externally',
    lifespan: '5-10 years',
    conservation: 'Least Concern; common on rocky shores',
    size: '10-30 cm diameter; 5 arms',
    ability: 'Regeneration — can regrow an entire arm in months; everts its cardiac stomach through its mouth to envelop and externally digest prey larger than itself'
  },
  'sea-urchin': {
    diet: 'Herbivore — algae, kelp, encrusting organisms',
    lifespan: '30-200+ years (red sea urchin may reach 200)',
    conservation: 'Variable by species; some overabundant due to predator loss',
    size: '3-10 cm diameter',
    ability: 'Aristotle\'s lantern — 5-toothed jaw apparatus that can bore into solid rock; some species among the longest-lived animals on Earth; spines regenerate continuously'
  },
  'sea-cucumber': {
    diet: 'Detritivore — sediment, decomposing matter, plankton',
    lifespan: '5-10 years (most species)',
    conservation: 'Many species Vulnerable or Endangered due to overharvesting',
    size: '10-180 cm depending on species',
    ability: 'Evisceration defense — expels internal organs to entangle or distract predators, then fully regenerates them in weeks; can liquefy and re-solidify body wall at will'
  },
  'sea-lily': {
    diet: 'Filter feeder — plankton and detritus from water column',
    lifespan: '10-20+ years',
    conservation: 'Not assessed; deep-sea species poorly known',
    size: '30-60 cm stalk; arms span 10-30 cm',
    ability: 'Living fossil — crinoids dominated Paleozoic seas 480 Mya; feathery arms create a fan to filter microscopic food; can detach from stalk and swim using rhythmic arm undulations'
  },
  'annelids': {
    ability: 'Pioneered segmentation — the repeating body plan that allows specialization of body regions; ecosystem engineers that aerate soil and process 50% of leaf litter in temperate forests'
  },
  'common-earthworm': {
    diet: 'Detritivore — decaying plant matter, soil microorganisms',
    lifespan: '4-8 years',
    conservation: 'Least Concern; extremely abundant in temperate soils',
    size: '9-30 cm long; 6-10 g',
    ability: 'Ecosystem engineer — Charles Darwin called them "the most important animal in the history of the world"; processes 36 tons of soil per hectare per year; 5 pairs of aortic arches (hearts)'
  },
  'medicinal-leech': {
    diet: 'Hematophagous — blood of vertebrates; single meal lasts months',
    lifespan: '20-25 years',
    conservation: 'Near Threatened; declining due to wetland loss',
    size: '10-15 cm extended',
    ability: 'Pharmaceutical factory — saliva contains 100+ bioactive compounds including hirudin (anticoagulant), hyaluronidase, and anesthetic; still used in modern microsurgery to relieve venous congestion'
  },
  'pompeii-worm': {
    diet: 'Chemosynthetic bacteria — farms bacteria on its back; detritus',
    lifespan: 'Unknown; likely short-lived',
    conservation: 'Not assessed; deep-sea specialist',
    size: '10-13 cm',
    ability: 'Most heat-tolerant complex animal — survives 80°C near hydrothermal vents while keeping its head at 22°C; symbiotic bacteria on its back may provide thermal insulation'
  },
  'platyhelminthes': {
    ability: 'Simplest animals with bilateral symmetry and cephalization (head); pioneered the centralized nervous system and organ-level organization without a body cavity'
  },
  'planarian': {
    diet: 'Carnivore/scavenger — small invertebrates, detritus; pharynx everts to feed',
    lifespan: 'Potentially immortal through continuous regeneration',
    conservation: 'Least Concern; common in freshwater habitats',
    size: '3-15 mm',
    ability: 'Champion regenerator — a fragment 1/279th of the body can regrow a complete organism; retains memories after head regeneration; model organism for stem cell and regeneration research'
  },
  'tardigrada': {
    ability: 'Most resilient animals on Earth — survive vacuum of space, 6,000 atm pressure, −272°C to 150°C, and decades without water via cryptobiosis; found in every habitat from deep ocean to Himalayan peaks'
  },
  'chordata': {
    ability: 'Evolved the notochord, dorsal nerve cord, and pharyngeal slits that gave rise to all vertebrates — the dominant large animals on Earth for 500 million years'
  },
  'sponges': {
    ability: 'Oldest surviving animal phylum (~600 Mya); filter up to 20,000 liters of water per day; lack true tissues but produce over 5,300 bioactive compounds used in pharmaceutical research'
  },
  'glass-sponge': {
    diet: 'Filter feeder — bacteria, plankton, dissolved organic matter',
    lifespan: '100-15,000+ years (some deep-sea specimens)',
    conservation: 'Vulnerable; glass sponge reefs are protected in British Columbia',
    size: '10-100 cm; reef structures span kilometers',
    ability: 'Builds skeleton of pure silica (glass) spicules that transmit light like fiber optic cables; glass sponge reefs in British Columbia are 9,000 years old — once thought extinct since the Cretaceous'
  },
  'barrel-sponge': {
    diet: 'Filter feeder — bacteria, phytoplankton, dissolved nutrients',
    lifespan: '100-2,300+ years; among the longest-lived animals',
    conservation: 'Not formally assessed; threatened by warming and ocean acidification',
    size: 'Up to 1.8 m diameter and 1.8 m tall',
    ability: 'Nicknamed "redwood of the reef" — pumps thousands of liters of water daily; hosts hundreds of symbiotic species inside its cavity; individual specimens may be over 2,000 years old'
  },
  'mollusks': {
    ability: 'Second-largest animal phylum; evolved the radula, mantle, and shell; includes the most intelligent invertebrates (cephalopods) and the longest-lived non-colonial animals (ocean quahog, 507 years)'
  },
  'giant-clam': {
    diet: 'Filter feeder + photosymbiont — zooxanthellae algae provide 70% of nutrition',
    lifespan: '100+ years',
    conservation: 'Vulnerable (IUCN); overharvested for food and aquarium trade',
    size: 'Up to 137 cm shell length; 200+ kg; largest living bivalve',
    ability: 'Solar-powered — mantle tissue is a biological greenhouse for symbiotic algae; can produce over 500 million eggs per spawning; shell grows throughout life and never stops'
  },
  'cone-snail': {
    diet: 'Carnivore — fish, worms, or other mollusks (varies by species)',
    lifespan: '5-15 years',
    conservation: 'Variable; several species Vulnerable due to collection',
    size: '1-23 cm shell length',
    ability: 'Fastest-acting venom delivery — fires a harpoon-like radula tooth with venom containing 100-200 unique conotoxins; one compound (ziconotide) is 1,000× more potent than morphine and is an approved painkiller'
  },
  'hercules-beetle': {
    diet: 'Herbivore — decaying fruit, tree sap as adult; rotting wood as larva',
    lifespan: '3-6 months as adult; 1-2 years as larva',
    conservation: 'Not formally assessed; locally common in rainforests',
    size: 'Up to 17.5 cm including horn; largest beetle by length',
    ability: 'Proportionally strongest animal on Earth — can carry 850× its own body weight; horn used in male combat can grow longer than the body; elytra change color from green to black with humidity'
  },
  'mosquito': {
    diet: 'Nectarivore (both sexes); females also hematophagous — blood needed for egg production',
    lifespan: '2-4 weeks (males); 1-5 months (females)',
    conservation: 'Least Concern; ~3,500 species worldwide',
    size: '3-6 mm; 2-2.5 mg',
    ability: 'Deadliest animal on Earth — responsible for ~700,000 human deaths annually via malaria, dengue, Zika, and yellow fever; detects CO₂ plumes from 50 m and body heat from 1 m'
  },
  'praying-mantis': {
    diet: 'Carnivore — insects, spiders; large species take frogs, lizards, hummingbirds',
    lifespan: '6-12 months',
    conservation: 'Least Concern (most species)',
    size: '1-16 cm depending on species',
    ability: 'Only insect that can rotate its head 180° to scan for prey with stereoscopic vision; raptorial forelegs strike in 50-70 milliseconds — faster than a fly can react; sway mimics leaves in wind'
  },
  'cockroach': {
    diet: 'Omnivore/scavenger — virtually anything organic',
    lifespan: '1-2 years',
    conservation: 'Least Concern; among the most abundant insects',
    size: '1-8 cm depending on species',
    ability: 'Ultimate survivor — withstands 10× the radiation dose lethal to humans; can live weeks without a head; fastest land insect (5.4 km/h, 50 body lengths/sec); 300+ million years virtually unchanged'
  },
  'golden-orb-spider': {
    diet: 'Carnivore — flying insects, sometimes small birds and bats',
    lifespan: '1-2 years',
    conservation: 'Least Concern; common in tropical forests',
    size: 'Female body 3-5 cm; web up to 1.5 m diameter',
    ability: 'Spins the strongest biological fiber known — golden silk 6× tougher than Kevlar per weight; web strands visible to the naked eye; extreme sexual dimorphism (females 10× larger than males)'
  },
  'emperor-scorpion': {
    diet: 'Carnivore — insects, spiders, small vertebrates',
    lifespan: '6-8 years',
    conservation: 'Not formally assessed; CITES Appendix II (trade regulated)',
    size: '20 cm; up to 30 g; one of the largest scorpions',
    ability: 'Fluoresces brilliant blue-green under UV light due to beta-carboline in cuticle; despite fearsome size, venom is relatively mild; sensory hairs detect air vibrations from prey'
  },
  'lobster': {
    diet: 'Omnivore — fish, mollusks, other crustaceans, algae, sea plants',
    lifespan: '50-100+ years; negligible senescence',
    conservation: 'Vulnerable (European lobster); American lobster Least Concern',
    size: 'Up to 64 cm body length; record 20.1 kg',
    ability: 'Biologically "immortal" — telomerase expression prevents cellular aging; continues growing throughout life, molting shell annually; crushes shells with 100+ lbs of claw force'
  },
  'stick-insect': {
    diet: 'Herbivore — leaves of bramble, oak, eucalyptus, and other trees',
    lifespan: '1-3 years',
    conservation: 'Variable; Lord Howe Island stick insect Critically Endangered',
    size: '1.5-60 cm; Phryganistria chinensis is the longest insect at 64 cm',
    ability: 'Master of camouflage — mimics twigs, leaves, and bark down to simulating wind-sway; can reproduce via parthenogenesis (no males needed); eggs mimic plant seeds for ant dispersal'
  },
  'bumblebee': {
    diet: 'Nectarivore/pollinivore — flower nectar and pollen',
    lifespan: '2-6 weeks (workers); 1 year (queen)',
    conservation: 'Several species Endangered or Vulnerable; rusty patched bumblebee Critically Endangered',
    size: '1-2.5 cm; queens up to 2.8 cm',
    ability: 'Buzz pollination — vibrates flight muscles at 130-400 Hz to shake pollen from flowers that honey bees cannot access; can fly in rain and near-freezing temperatures by shivering to warm up'
  },
  'termite': {
    diet: 'Detritivore — dead wood, leaf litter, soil, dung; symbiotic gut microbes digest cellulose',
    lifespan: '1-2 years (workers); 25-50 years (queen)',
    conservation: 'Least Concern (most species); ecologically essential',
    size: '4-15 mm; queen can reach 10 cm',
    ability: 'Master architects — build mounds up to 9 m tall with passive ventilation, temperature regulation to ±1°C, and fungus farms; queens are the longest-lived insects, producing 30,000 eggs/day'
  },
  'cicada': {
    diet: 'Herbivore — xylem sap from tree roots (nymph) and twigs (adult)',
    lifespan: '2-17 years underground as nymph; 2-6 weeks as adult',
    conservation: 'Least Concern (most species); some island species endangered',
    size: '2-7 cm body length',
    ability: 'Loudest insect — males produce calls up to 120 dB (louder than a chainsaw); periodical cicadas emerge in synchronized broods of billions after 13 or 17 years underground (prime number strategy)'
  },
  'dung-beetle': {
    diet: 'Coprophage — animal dung; some species also eat fungi and decaying fruit',
    lifespan: '3-5 years',
    conservation: 'Least Concern (most species); threatened by livestock deworming chemicals',
    size: '1-6 cm',
    ability: 'Strongest animal relative to body weight — pulls 1,141× own mass; only known non-human animal that navigates by the Milky Way; buries 250× its weight in dung nightly, recycling nutrients into soil'
  },
  'crown-of-thorns': {
    diet: 'Corallivore — digests coral polyps by everting stomach over reef',
    lifespan: '15-17 years',
    conservation: 'Not assessed; population outbreaks cause massive reef damage',
    size: '25-60 cm diameter; up to 21 arms',
    ability: 'Coral reef\'s most destructive predator — a single individual eats 5-13 m² of coral per year; covered in venomous spines; can regenerate from a single arm; outbreaks driven by nutrient runoff'
  },
  'earthworm': {
    diet: 'Detritivore — decaying plant matter, soil microorganisms',
    lifespan: '4-8 years',
    conservation: 'Least Concern; among the most abundant soil animals',
    size: '5-30 cm (most species); giant Australian earthworm reaches 3 m',
    ability: 'Ecosystem engineer — aerates soil, improves drainage, and recycles nutrients; processes its own weight in soil daily; 5 pairs of aortic arches act as hearts'
  },
  'giant-tube-worm': {
    diet: 'Chemosymbiotic — no gut; relies entirely on internal sulfide-oxidizing bacteria',
    lifespan: '170-250+ years; one of the longest-lived invertebrates',
    conservation: 'Not assessed; dependent on active hydrothermal vents',
    size: 'Up to 2.4 m long; tube diameter 4 cm',
    ability: 'Fastest-growing marine invertebrate — up to 85 cm/year; survives without mouth, gut, or anus; symbiotic bacteria convert H₂S into organic compounds; blood contains special sulfide-binding hemoglobin'
  },
  'leaf-insect': {
    diet: 'Herbivore — leaves; preferring guava, mango, and rambutan',
    lifespan: '6-12 months',
    conservation: 'Not formally assessed; some species rare due to deforestation',
    size: '5-10 cm',
    ability: 'Pinnacle of leaf mimicry — body, legs, and wing venation perfectly replicate a living leaf including "bite marks" and brown spots; sways in breeze; eggs mimic plant seeds'
  },
  'leech': {
    diet: 'Hematophagous (most species) — blood of vertebrates; some species predatory on invertebrates',
    lifespan: '2-20 years depending on species',
    conservation: 'Variable; medicinal leech Near Threatened; most species Least Concern',
    size: '1-30 cm depending on species',
    ability: 'Painless bite — saliva contains anesthetic, vasodilator, and hirudin anticoagulant; a single blood meal can sustain them for months; 3 jaws with ~100 teeth each'
  },
  'feather-star': {
    diet: 'Filter feeder — plankton and suspended organic particles',
    lifespan: '10-20+ years',
    conservation: 'Not formally assessed; diverse on tropical reefs',
    size: '10-30 cm arm span; up to 200 arms in some species',
    ability: 'Unstalked crinoid that swims by undulating its feathery arms in mesmerizing waves; can crawl, walk, and swim; earliest crinoids date to 480 Mya; regenerates lost arms readily'
  },
  'nematodes': {
    ability: 'Most abundant multicellular animals on Earth — 4 of every 5 animals is a nematode; found in every habitat from deep mines to mountain peaks; total biomass rivals that of all other animals combined'
  },
  'c-elegans': {
    diet: 'Bacterivore — soil bacteria, primarily E. coli in lab culture',
    lifespan: '2-3 weeks',
    conservation: 'Least Concern; ubiquitous in temperate soils',
    size: '1 mm long; ~1,000 cells',
    ability: 'First multicellular organism to have its complete connectome mapped (302 neurons, 7,000 synapses) and entire genome sequenced; every cell division from egg to adult is known — the most understood animal in biology'
  },

  // ── FISH ──
  'vertebrates': {
    ability: 'Evolved the internal skeleton, jaws, and paired limbs that enabled vertebrates to become the dominant large animals on land, sea, and air'
  },
  'lungfish': {
    diet: 'Omnivore — insects, crustaceans, mollusks, plant matter',
    lifespan: '~25 years; possibly much longer',
    conservation: 'Vulnerable (Australian); other species less threatened',
    size: 'Up to 1.5 m (Australian lungfish)',
    ability: 'Can breathe air using a primitive lung; estivates in mud cocoons for months during drought; closest living fish relative of all land vertebrates'
  },
  'clownfish': {
    diet: 'Omnivore — algae, zooplankton, worms, small crustaceans',
    lifespan: '6-10 years',
    conservation: 'Least Concern (most species); reef habitat declining',
    size: '6-11 cm; 10-50 g',
    ability: 'Immune to anemone stings via mucus coating; all born male with sex change to female; symbiotic relationship benefits both fish and anemone'
  },
  'anglerfish': {
    diet: 'Carnivore — fish, crustaceans, anything attracted to bioluminescent lure',
    lifespan: '~25 years (females); males live only months after fusion',
    conservation: 'Not evaluated; deep-sea, rarely encountered',
    size: 'Female 20-100 cm; parasitic male 1-3 cm',
    ability: 'Bioluminescent lure attracts prey in total darkness; males permanently fuse to females, dissolving into gonads; survives crushing pressures at 2,000+ m'
  },
  'seahorse': {
    diet: 'Carnivore — tiny crustaceans, plankton, larval fish (suction feeding)',
    lifespan: '1-5 years depending on species',
    conservation: 'Variable; many species Vulnerable; 37 million traded annually for traditional medicine',
    size: '1.5-35 cm depending on species',
    ability: 'Males get pregnant and give birth to up to 2,000 young; prehensile tail grips coral; eyes move independently; no stomach — must eat constantly'
  },
  'manta-ray': {
    diet: 'Filter-feeder — zooplankton, fish larvae, small fish',
    lifespan: '40-50 years',
    conservation: 'Vulnerable (giant manta); declining from fishing bycatch and gill plate trade',
    size: 'Wingspan up to 7 m, 2,000 kg (giant manta) — largest ray',
    ability: 'Largest brain-to-body ratio of any cold-blooded fish; passes mirror self-recognition test; barrel-rolls to concentrate plankton while feeding'
  },
  'pufferfish': {
    diet: 'Omnivore — algae, invertebrates, shellfish (crushed with beak-like teeth)',
    lifespan: '~10 years',
    conservation: 'Variable; some species Least Concern, others Near Threatened',
    size: '2.5-60 cm depending on species',
    ability: 'Inflates to 2-3× normal size; tetrodotoxin 1,200× more poisonous than cyanide; males create elaborate sand circles on the ocean floor to attract mates'
  },
  'whale-shark': {
    diet: 'Filter-feeder — plankton, fish eggs, small fish, squid',
    lifespan: '~70-100 years',
    conservation: 'Endangered; declining from fishing, boat strikes, and bycatch',
    size: 'Up to 18.8 m, 20+ tonnes — largest living fish',
    ability: 'Filters 6,000 liters/hour through 1.5 m–wide mouth; unique spot pattern (like fingerprints); migrates 12,000+ km following plankton blooms'
  },
  'piranha': {
    diet: 'Omnivore — fish, insects, crustaceans, seeds, fruit; occasionally scavenge larger prey',
    lifespan: '~10 years',
    conservation: 'Least Concern (most species)',
    size: '15-25 cm (most); up to 50 cm (black piranha)',
    ability: 'Interlocking razor teeth replaced continuously; bite force of 320 N (3× body weight) — strongest of any bony fish; more prey than predator in practice'
  },
  'mola-mola': {
    diet: 'Carnivore — jellyfish, salps, small fish, squid, crustaceans',
    lifespan: '~20-25 years',
    conservation: 'Vulnerable; bycatch in drift gillnets',
    size: 'Up to 3.3 m, 2,300 kg — heaviest bony fish on Earth',
    ability: 'Grows 60 million times its birth size; basks at surface to thermoregulate after deep dives; produces 300 million eggs at once — most of any vertebrate'
  },
  'salmon': {
    diet: 'Carnivore — insects (freshwater), fish, squid, crustaceans (ocean)',
    lifespan: '2-8 years depending on species',
    conservation: 'Variable; many Pacific runs threatened or endangered; Atlantic salmon Least Concern globally',
    size: '50-150 cm; 2-35 kg depending on species',
    ability: 'Navigates thousands of km using magnetic fields and olfactory memory to return to natal stream; body transforms dramatically — silver to red, hooked jaw — then dies after spawning'
  },
  'flying-fish': {
    diet: 'Omnivore — plankton, small crustaceans, algae',
    lifespan: '~5 years',
    conservation: 'Least Concern',
    size: '15-30 cm; enlarged pectoral fins span up to 45 cm',
    ability: 'Launches at 60 km/h, glides up to 200 m for 45 seconds on enlarged pectoral fins; tail beats 70×/sec during takeoff; evades predators by leaving the water entirely'
  },
  'tuna': {
    diet: 'Carnivore — fish, squid, crustaceans',
    lifespan: '15-40 years (bluefin)',
    conservation: 'Variable; Pacific bluefin Vulnerable, Atlantic bluefin recovering; skipjack Least Concern',
    size: 'Bluefin up to 3 m, 680 kg; one of the largest bony fish',
    ability: 'Warm-blooded fish — maintains body temp 10-20°C above water; bursts to 75 km/h; retractable fins reduce drag; a single bluefin sold for $3.1 million in 2019'
  },
  'swordfish': {
    diet: 'Carnivore — fish, squid',
    lifespan: '~9 years',
    conservation: 'Least Concern; managed fisheries',
    size: 'Up to 4.5 m, 650 kg (including bill)',
    ability: 'Bill slashes through fish schools at 100 km/h; special organ heats brain and eyes 15°C above water for sharper vision during deep dives to 800 m'
  },
  'mudskipper': {
    diet: 'Omnivore — insects, worms, small crabs, algae',
    lifespan: '~5 years',
    conservation: 'Least Concern',
    size: '5-25 cm',
    ability: 'Spends 90% of time on land; breathes through skin and mouth lining; walks on modified pectoral fins; can climb trees and leap 60 cm; rolls eyes to moisten them'
  },
  'blobfish': {
    diet: 'Carnivore — crabs, sea urchins, shellfish, whatever drifts past',
    lifespan: '~100+ years (estimated)',
    conservation: 'Not evaluated; deep-sea bycatch threat',
    size: '~30 cm, ~2 kg',
    ability: 'Gelatinous body slightly less dense than water — hovers just above the seafloor with zero energy expenditure; famous "melted face" is decompression damage, not natural appearance'
  },
  'arapaima': {
    diet: 'Carnivore — fish, crustaceans, birds, small mammals near surface',
    lifespan: '15-20 years',
    conservation: 'Data Deficient; overfished but recovering with community management',
    size: 'Up to 3 m, 200 kg — one of the largest freshwater fish',
    ability: 'Obligate air-breather — surfaces every 10-20 min; bony tongue used to crush prey against palate; scales are so tough they resist piranha bites'
  },

  // ── REPTILES & AMPHIBIANS ──
  'reptiles': {
    ability: 'First amniotes — evolved the shelled egg 312 Mya, freeing vertebrates from water for reproduction; scales, ectothermy, and efficient kidneys enabled colonization of arid habitats'
  },
  'amphibians': {
    ability: 'First vertebrates on land (~370 Mya); dual life — aquatic larvae and terrestrial adults; permeable skin doubles as a respiratory organ; most sensitive vertebrate bioindicators of environmental health'
  },
  'green-sea-turtle': {
    diet: 'Herbivore (adults) — seagrass and algae; juveniles eat jellyfish and invertebrates',
    lifespan: '60-80 years; possibly over 100',
    conservation: 'Endangered; nesting beach loss, fishing bycatch, plastic ingestion',
    size: 'Up to 1.5 m carapace, 315 kg',
    ability: 'Navigates thousands of km using Earth\'s magnetic field; returns to natal beach to nest; grazes seagrass meadows that store 2× more carbon than forests'
  },
  'king-cobra': {
    diet: 'Carnivore — almost exclusively other snakes (ophiophagous)',
    lifespan: '~20 years in the wild',
    conservation: 'Vulnerable; habitat loss and persecution',
    size: 'Up to 5.5 m — longest venomous snake on Earth',
    ability: 'Only snake that builds a nest; can deliver enough neurotoxin in one bite to kill an elephant; raises 1/3 of body off ground when threatened'
  },
  'saltwater-crocodile': {
    diet: 'Carnivore — fish, birds, mammals, other reptiles; apex predator',
    lifespan: '~70 years; possibly over 100',
    conservation: 'Least Concern; recovered well from near-extinction',
    size: 'Up to 6-7 m, 1,000+ kg — largest living reptile',
    ability: 'Strongest bite ever measured (3,700 PSI); death roll tears prey apart; saltwater tolerance allows open-ocean crossings of 500+ km'
  },
  'anaconda': {
    diet: 'Carnivore — capybara, deer, caimans, large fish',
    lifespan: '~10 years in the wild; 30+ in captivity',
    conservation: 'Not evaluated; locally common but declining',
    size: 'Up to 250 kg, 9 m — heaviest snake on Earth',
    ability: 'Constriction stops prey\'s heart between beats; semi-aquatic ambush predator; can swallow prey 25% of its body weight whole'
  },
  'gecko': {
    diet: 'Insectivore — insects, spiders; some species eat nectar and fruit',
    lifespan: '5-20 years depending on species',
    conservation: 'Variable; many species Least Concern; some island endemics threatened',
    size: '1.6 cm (nano-chameleon size) to 60 cm (tokay gecko); most 10-15 cm',
    ability: 'Van der Waals adhesion via millions of setae — walks on ceilings; each foot can support 130 kg; tail autotomy and regrowth for predator escape'
  },
  'python': {
    diet: 'Carnivore — mammals, birds, reptiles; ambush constrictor',
    lifespan: '20-30 years',
    conservation: 'Variable; Burmese python invasive in Florida; others declining from trade',
    size: 'Reticulated python up to 7.5 m — longest snake on Earth; Burmese up to 90 kg',
    ability: 'Infrared pit organs detect prey body heat at 1 m; can swallow prey 5× head width; jaw bones connected by elastic ligaments, not fused'
  },
  'iguana': {
    diet: 'Herbivore (green iguana) — leaves, flowers, fruit; marine iguana grazes underwater algae',
    lifespan: '12-15 years (wild), 20+ (captivity)',
    conservation: 'Variable; marine iguana Vulnerable; several Caribbean species Critically Endangered',
    size: 'Green iguana up to 2 m total length, 9 kg',
    ability: 'Marine iguanas dive 12 m to graze algae, sneeze crystallized salt; green iguanas survive falls from 15 m into water unharmed'
  },
  'leatherback-turtle': {
    diet: 'Carnivore — jellyfish (can eat 200 kg/day), salps, squid',
    lifespan: '~45 years; possibly over 100',
    conservation: 'Vulnerable; declining 40% in 20 years; plastic bags mistaken for jellyfish',
    size: 'Up to 2 m, 900 kg — largest living turtle',
    ability: 'Dives to 1,280 m (deepest of any reptile); unique leathery shell; countercurrent heat exchangers maintain body temp 18°C above water; unchanged for 100 million years'
  },
  'golden-poison-frog': {
    diet: 'Insectivore — ants, mites, termites, beetles (toxins derived from diet)',
    lifespan: '~10 years',
    conservation: 'Endangered; restricted to a few km² of Colombian rainforest',
    size: '~5 cm, 1 g — tiny but most toxic animal on Earth',
    ability: 'Carries enough batrachotoxin to kill 10 humans; 1 mg is lethal; indigenous Emberá people tip blowdarts with its skin secretions'
  },
  'axolotl': {
    diet: 'Carnivore — worms, insects, small fish, larvae',
    lifespan: '10-15 years in captivity',
    conservation: 'Critically Endangered; wild population may be under 1,000; restricted to Lake Xochimilco canals in Mexico City',
    size: '15-45 cm; 60-225 g',
    ability: 'Regenerates entire limbs, spinal cord, heart tissue, and brain parts; retains larval gills for life (neoteny); 10× more DNA than humans'
  },
  'chinese-giant-salamander': {
    diet: 'Carnivore — fish, crayfish, crabs, frogs, insects',
    lifespan: '~60 years in the wild; potentially much longer',
    conservation: 'Critically Endangered; 80% decline from overharvesting and habitat destruction',
    size: 'Up to 1.8 m — largest living amphibian on Earth',
    ability: 'Detects prey through lateral line vibrations; essentially unchanged for 170 million years; breathes primarily through wrinkled skin'
  },
  'caecilian': {
    diet: 'Carnivore — earthworms, termites, beetle larvae',
    lifespan: '~13 years',
    conservation: 'Variable; many species Data Deficient due to secretive lifestyle',
    size: '10-150 cm; limbless, worm-like amphibians',
    ability: 'Limbless, nearly blind, burrowing amphibians with tentacle-like sensory organs; some species have skin-feeding young that scrape mother\'s nutritious outer skin layer'
  },
  'giant-salamander': {
    diet: 'Carnivore — fish, crabs, insects, smaller salamanders',
    lifespan: 'Over 80 years documented',
    conservation: 'Vulnerable; protected in Japan as "special natural monument"',
    size: 'Up to 1.5 m — second-largest living amphibian',
    ability: 'Called "living fossil" — virtually unchanged from 30 Mya fossils; nocturnal ambush predator; absorbs oxygen primarily through wrinkled skin'
  },
  'red-eyed-tree-frog': {
    diet: 'Insectivore — moths, flies, crickets, grasshoppers',
    lifespan: '~5 years',
    conservation: 'Least Concern; common in intact habitat',
    size: '4-7 cm, 6-15 g',
    ability: 'Flash-coloration defense: opening red eyes startles predators, buying escape time; embryos detect snake vibrations and hatch early to drop into water below'
  },

  // ── NEW BIRDS ──
  'bald-eagle': {
    diet: 'Carnivore; fish, waterfowl, small mammals',
    lifespan: '20-30 years in the wild',
    conservation: 'Least Concern (recovered); from 417 pairs in 1963 to 300,000+ today',
    size: '3-6.3 kg; 1.8-2.3 m wingspan',
    ability: 'Eyesight 4-8x sharper than humans; builds largest bird nests (up to 2.7 tonnes); US national symbol'
  },
  'condor': {
    diet: 'Scavenger; exclusively carrion',
    lifespan: '50-70 years',
    conservation: 'Critically Endangered (California Condor, ~500); Andean Condor Vulnerable',
    size: '8-15 kg; 2.7-3.2 m wingspan; largest flying land bird',
    ability: 'Soars on thermals to 4,600 m without flapping; California Condor recovered from 22 individuals'
  },
  'flamingo': {
    diet: 'Omnivore; brine shrimp, algae, crustaceans filtered through lamellae',
    lifespan: '20-30 years (wild), 50+ years (captivity)',
    conservation: 'Variable by species; Lesser Flamingo Near Threatened',
    size: '1.1-1.5 m tall; 2-4 kg',
    ability: 'Pink coloration from carotenoid pigments in diet; stands on one leg to conserve heat; filter-feeder'
  },
  'barn-owl': {
    diet: 'Carnivore; rodents, voles, shrews, small birds',
    lifespan: '~4 years (wild); up to 15 years',
    conservation: 'Least Concern; most widespread owl species',
    size: '250-480 g; 80-95 cm wingspan',
    ability: 'Asymmetrical ears pinpoint prey by sound in total darkness; silent flight from serrated feathers'
  },
  'cassowary': {
    diet: 'Omnivore; fallen fruit, fungi, insects, small vertebrates',
    lifespan: '40-50 years',
    conservation: 'Least Concern (Southern); endangered in parts of Australia',
    size: 'Up to 60 kg, 1.8 m tall; second-heaviest living bird',
    ability: 'Dagger-like claw up to 12 cm; can run 50 km/h; critical seed disperser for 238+ rainforest species'
  },

  // ── NEW REPTILES/AMPHIBIANS ──
  'chameleon': {
    diet: 'Insectivore; captures prey with ballistic tongue (2x body length)',
    lifespan: '2-10 years depending on species',
    conservation: 'Variable; many species threatened; 40% of species in Madagascar',
    size: '1.5 cm (Brookesia nana) to 68 cm (Parson\'s chameleon)',
    ability: 'Independent eye movement; color change for communication; zygodactylous feet for gripping'
  },
  'electric-eel': {
    diet: 'Carnivore; fish, amphibians, invertebrates',
    lifespan: '10-15 years',
    conservation: 'Least Concern',
    size: 'Up to 2.5 m long, 20 kg',
    ability: 'Generates up to 860 volts; not a true eel (knifefish order); uses electric field for navigation and hunting'
  },
  'poison-dart-frog': {
    diet: 'Insectivore; ants, mites, termites (toxins derived from diet)',
    lifespan: '3-15 years',
    conservation: 'Variable; many species Endangered or Critically Endangered',
    size: '1-6 cm; tiny but extremely toxic',
    ability: 'Golden poison frog carries enough toxin to kill 10 humans; aposematic coloration warns predators'
  },

  // ── NEW FISH ──
  'hammerhead-shark': {
    diet: 'Carnivore; stingrays, fish, squid, crustaceans',
    lifespan: '20-30 years',
    conservation: 'Critically Endangered (Great Hammerhead); most species declining',
    size: 'Up to 6.1 m (Great Hammerhead); 230-450 kg',
    ability: 'Cephalofoil head provides 360-degree vision and enhanced electroreception for detecting buried prey'
  },

  // ── NEW INVERTEBRATES ──
  'tardigrade': {
    size: '0.1-1.5 mm',
    diet: 'Plant cells, algae, small invertebrates',
    lifespan: '~2 years active; survives decades in cryptobiosis',
    conservation: 'Least Concern; ubiquitous and extremely resilient',
    ability: 'Survives vacuum of space, -272C, 150C, 6,000 atm pressure, and extreme radiation'
  },
  'firefly': {
    size: '5-25 mm',
    diet: 'Larvae: snails, worms; adults: nectar or nothing',
    lifespan: '~2 months as adults; 1-2 years as larvae',
    conservation: 'Many species declining; threatened by light pollution and habitat loss',
    ability: 'Bioluminescence via luciferin-luciferase reaction; species-specific flash patterns for mating'
  },
  'atlas-moth': {
    size: 'Wingspan up to 30 cm; largest moth species by wing area',
    diet: 'Adults do not eat (no functional mouthparts); larvae eat citrus and other leaves',
    lifespan: '1-2 weeks as adults',
    conservation: 'Not evaluated; locally common',
    ability: 'Wingtip patterns mimic snake heads to deter predators; cocoon silk used for fabric (fagara silk)'
  },
  'army-ant': {
    size: '3-12 mm workers; queen up to 5 cm',
    diet: 'Carnivore; insects, spiders, small vertebrates raided in swarms',
    lifespan: 'Workers: months; queen: 10-20 years',
    conservation: 'Least Concern; ecologically vital',
    ability: 'Nomadic bivouac colonies of 200,000-700,000; form living bridges and rafts with their bodies'
  },
  'japanese-spider-crab': {
    size: 'Leg span up to 3.7 m; body 40 cm; largest living arthropod',
    diet: 'Omnivore; shellfish, dead animals, algae, plants',
    lifespan: 'Up to 100 years',
    conservation: 'Not evaluated; harvested as delicacy',
    ability: 'Largest leg span of any arthropod; decorates shell with sponges and anemones for camouflage'
  },
  'garden-spider': {
    size: 'Female 13-30 mm body length; males much smaller',
    diet: 'Carnivore; flying insects caught in orb web',
    lifespan: '~1 year',
    conservation: 'Least Concern; common and widespread',
    ability: 'Builds geometric orb web up to 40 cm wide with stabilimentum; recycles silk nightly'
  },
  'hermit-crab': {
    size: '1-15 cm depending on species',
    diet: 'Omnivore; algae, detritus, small invertebrates',
    lifespan: '1-10 years (marine); up to 30 years (coconut crab relative)',
    conservation: 'Variable; shell availability limits populations',
    ability: 'Occupies empty gastropod shells for protection; forms shell-exchange chains with other crabs'
  },
  'portuguese-man-o-war': {
    size: 'Float: 15-30 cm; tentacles up to 30 m long',
    diet: 'Carnivore; fish and plankton paralyzed by nematocysts',
    lifespan: '~1 year',
    conservation: 'Least Concern; abundant',
    ability: 'Not a single animal but a colonial organism of 4 specialized polyps (siphonophore); sails on wind'
  },

  // ── NEW PLANTS ──
  'water-lily': {
    pollination: 'Beetles and flies; some species self-pollinate',
    conservation: 'Least Concern; some species locally threatened',
    record: 'Giant water lily (Victoria amazonica) leaves reach 3 m diameter, support 45 kg',
    ecoRole: 'Shade aquatic habitats, reduce algae growth, provide shelter for fish and amphibians'
  },
  'orchid': {
    pollination: 'Highly specialized; species-specific pollinators including bees, moths, and birds',
    conservation: 'Many species threatened; most-traded CITES plant family',
    record: 'Largest plant family with 28,000+ species; some mimic female insects for pollination',
    ecoRole: 'Epiphytes in tropical forests; mycorrhizal partnerships; indicator species for habitat health'
  },
  'bamboo': {
    pollination: 'Wind-pollinated; mass flowering events every 40-120 years',
    conservation: 'Variable; some species threatened by habitat conversion',
    record: 'Fastest-growing plant — up to 91 cm/day; some species reach 30 m tall',
    ecoRole: 'Carbon sequestration; soil erosion prevention; critical panda habitat; 1,500+ uses in construction and crafts'
  },
  'cactus': {
    pollination: 'Bats, bees, birds, moths; some self-pollinate',
    conservation: '31% of species threatened; illegal collection and habitat loss',
    record: 'Saguaro cactus lives 150-200 years and stores 4,800 liters of water',
    ecoRole: 'Keystone desert species; provides water and shelter for birds, bats, and insects in arid ecosystems'
  },
  'sundew': {
    pollination: 'Insects (different species from prey); some self-pollinate',
    conservation: 'Variable; wetland drainage threatens many species',
    record: 'Over 200 species; sticky mucilage traps curl around prey in minutes',
    ecoRole: 'Carnivorous adaptation to nutrient-poor bogs; supplements nitrogen and phosphorus from insect prey'
  },

  // ── NEW FUNGI ──
  'truffle': {
    substrate: 'Ectomycorrhizal with oak, hazel, beech, and pine roots',
    symbiosis: 'Mutualistic — exchanges soil minerals for plant sugars',
    edibility: 'Prized gourmet delicacy; white truffle up to $4,000/kg',
    dispersal: 'Underground fruiting body; relies on animals (squirrels, pigs, insects) digging up spores'
  },
  'cordyceps': {
    substrate: 'Insect hosts — ants, caterpillars, beetles, spiders',
    symbiosis: 'Parasitic — hijacks host behavior before killing it',
    edibility: 'Ophiocordyceps sinensis used in traditional Chinese medicine; $20,000+/kg',
    dispersal: 'Spores released from stalk growing out of dead host; species-specific targeting'
  },
  'chanterelle': {
    substrate: 'Ectomycorrhizal with oaks, conifers, and beeches',
    symbiosis: 'Mutualistic — nutrient exchange with tree roots',
    edibility: 'Choice edible mushroom; peppery apricot aroma; cannot be cultivated commercially',
    dispersal: 'Wind-dispersed basidiospores; fruiting after rain in summer and autumn'
  },
  'lichen': {
    substrate: 'Rock, bark, soil, man-made surfaces',
    symbiosis: 'Mutualistic composite — fungus + alga or cyanobacterium (and sometimes yeast)',
    edibility: 'Some edible (Iceland moss, rock tripe); reindeer lichen critical for caribou',
    dispersal: 'Soredia and fragments; extremely slow growth (0.5-5 mm/year); some are 4,500+ years old'
  },

  // ── NEW PROTISTS ──
  'euglena': {
    cellType: 'Flagellate protist with chloroplasts',
    metabolism: 'Mixotrophic — photosynthetic in light, heterotrophic in dark',
    habitat: 'Freshwater ponds, ditches, nutrient-rich waters',
    relevance: 'Classic model for studying photosynthesis and cell motility; eyespot detects light direction'
  },
  'radiolarian': {
    cellType: 'Amoeboid protist with silica skeleton',
    metabolism: 'Heterotroph with photosynthetic algal symbionts',
    habitat: 'Open ocean plankton worldwide',
    relevance: 'Intricate geometric shells; siliceous ooze on ocean floor used for geological dating'
  },
  'slime-mold': {
    cellType: 'Amoebozoan (plasmodial or cellular)',
    metabolism: 'Heterotroph — engulfs bacteria and decaying matter',
    habitat: 'Forest floor leaf litter and decaying wood',
    relevance: 'No brain yet solves mazes and optimizes networks; used to model city planning and rail systems'
  },
  'stentor': {
    cellType: 'Ciliate protist (trumpet-shaped)',
    metabolism: 'Heterotroph — filter-feeds on bacteria and algae',
    habitat: 'Freshwater ponds, lakes, and quiet streams',
    relevance: 'Largest single-celled organism visible to naked eye (up to 2 mm); remarkable regeneration ability'
  },
};
