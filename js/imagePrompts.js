/* ═══════════════════════════════════════════════════════════════
   imagePrompts.js — AI image generation prompt library

   Each node ID maps to a structured prompt object:
   - prompt: text description for AI image generation
   - style: visual style hint (photo, micro, fossil, illustration)
   - tags: reusable metadata for filtering/grouping

   These prompts are designed to produce photorealistic,
   scientifically accurate images suitable for a museum-quality
   phylogenetic visualization.
   ═══════════════════════════════════════════════════════════════ */

const IMAGE_PROMPTS = {
  // ── LUCA ──
  'luca': {
    prompt: 'Photorealistic rendering of a hydrothermal vent on the ancient ocean floor, mineral-rich superheated water billowing from rocky chimneys, primitive single-celled organisms visible as faint translucent clusters on the rocks, deep ocean darkness with bioluminescent glow, 3.8 billion years ago',
    style: 'photo',
    tags: ['origin', 'deep-sea', 'prokaryote']
  },

  // ── BACTERIA ──
  'bacteria': {
    prompt: 'Scanning electron microscope image of diverse bacteria: rod-shaped bacilli, spherical cocci, and spiral spirilla, false-colored in warm amber tones, highly detailed cell surfaces with flagella and pili visible, scientific microscopy aesthetic',
    style: 'micro',
    tags: ['prokaryote', 'domain', 'microscopy']
  },
  'cyanobacteria': {
    prompt: 'Microscope image of cyanobacteria filaments, vibrant blue-green chains of cells with visible heterocysts, some forming spiral trichomes, bright-field microscopy with natural pigment colors, scientific detail',
    style: 'micro',
    tags: ['prokaryote', 'photosynthesis', 'microscopy']
  },
  'prochlorococcus': {
    prompt: 'Transmission electron microscope image of Prochlorococcus marinus, tiny spherical cyanobacterium approximately 0.6 micrometers, visible thylakoid membranes inside, false-colored in ocean blue tones, surrounded by seawater',
    style: 'micro',
    tags: ['prokaryote', 'ocean', 'microscopy']
  },
  'nostoc': {
    prompt: 'Close-up photograph of Nostoc commune colony, gelatinous blue-green sheets on wet soil, bead-like filaments visible within the translucent jelly matrix, natural outdoor lighting after rain',
    style: 'photo',
    tags: ['prokaryote', 'colonial', 'macro']
  },
  'proteobacteria': {
    prompt: 'Colorized scanning electron microscope image of diverse proteobacteria, showing gram-negative rod and comma-shaped cells with visible outer membranes and flagella, false-colored in steel blue and purple tones',
    style: 'micro',
    tags: ['prokaryote', 'microscopy']
  },
  'ecoli': {
    prompt: 'Scanning electron microscope image of Escherichia coli bacteria, rod-shaped cells with visible pili and flagella, dividing by binary fission, false-colored in warm gold tones against dark background, NIAID-style scientific imaging',
    style: 'micro',
    tags: ['prokaryote', 'model-organism', 'microscopy']
  },
  'helicobacter': {
    prompt: 'Scanning electron microscope image of Helicobacter pylori, spiral-shaped bacterium with bundle of flagella at one pole, attached to stomach epithelial cells, false-colored in warm tones, medical microscopy',
    style: 'micro',
    tags: ['prokaryote', 'pathogen', 'microscopy']
  },
  'vibrio-cholerae': {
    prompt: 'Scanning electron microscope image of Vibrio cholerae, comma-shaped bacterium with single polar flagellum, clusters on intestinal surface, false-colored in teal tones, medical microscopy aesthetic',
    style: 'micro',
    tags: ['prokaryote', 'pathogen', 'microscopy']
  },
  'firmicutes': {
    prompt: 'Scanning electron microscope image of Firmicutes bacteria showing thick-walled gram-positive cocci and bacilli, some forming endospores, false-colored in purple and lavender tones, high magnification detail',
    style: 'micro',
    tags: ['prokaryote', 'microscopy']
  },
  'lactobacillus': {
    prompt: 'Scanning electron microscope image of Lactobacillus acidophilus, long rod-shaped bacteria in chains, smooth cell surfaces, growing on dairy substrate, false-colored in cream and gold tones',
    style: 'micro',
    tags: ['prokaryote', 'beneficial', 'microscopy']
  },
  'clostridium-botulinum': {
    prompt: 'Transmission electron microscope image of Clostridium botulinum, rod-shaped bacterium with visible endospore forming at one end, giving drumstick shape, false-colored in dark amber tones, high contrast',
    style: 'micro',
    tags: ['prokaryote', 'pathogen', 'microscopy']
  },
  'actinobacteria': {
    prompt: 'Scanning electron microscope image of Actinobacteria showing branching filamentous growth resembling fungal hyphae, with chains of spores, false-colored in warm earth tones, soil microbiology aesthetic',
    style: 'micro',
    tags: ['prokaryote', 'soil', 'microscopy']
  },
  'streptomyces': {
    prompt: 'Scanning electron microscope image of Streptomyces colony showing branching aerial hyphae with spiral chains of spores, soil particles visible, false-colored in earthy brown and gold tones, antibiotic-producing organism',
    style: 'micro',
    tags: ['prokaryote', 'antibiotic', 'microscopy']
  },
  'mycobacterium-tb': {
    prompt: 'Scanning electron microscope image of Mycobacterium tuberculosis, slender rod-shaped bacteria with characteristic waxy cell wall, clustered in cord formation, false-colored in red tones, medical pathology aesthetic',
    style: 'micro',
    tags: ['prokaryote', 'pathogen', 'microscopy']
  },
  'spirochetes': {
    prompt: 'Dark-field microscope image of spirochete bacteria, brilliant white corkscrew-shaped organisms against black background, showing characteristic spiral morphology and undulating motion blur',
    style: 'micro',
    tags: ['prokaryote', 'microscopy']
  },
  'deinococcus': {
    prompt: 'Transmission electron microscope image of Deinococcus radiodurans, tetrad arrangement of spherical cells with thick multilayered cell envelope, false-colored in radiation-resistant orange-red tones',
    style: 'micro',
    tags: ['prokaryote', 'extremophile', 'microscopy']
  },
  'bacteroides': {
    prompt: 'Scanning electron microscope image of Bacteroides fragilis, pleomorphic rod-shaped bacteria colonizing intestinal surface, false-colored in warm brown tones, gut microbiome context',
    style: 'micro',
    tags: ['prokaryote', 'gut', 'microscopy']
  },

  // ── ARCHAEA ──
  'archaea': {
    prompt: 'Photorealistic rendering of extremophile archaea in a volcanic hot spring, brilliant orange and yellow thermophilic mats in steaming mineral-rich water, Yellowstone-style prismatic spring colors, aerial perspective',
    style: 'photo',
    tags: ['prokaryote', 'domain', 'extremophile']
  },
  'euryarchaeota': {
    prompt: 'Fluorescence microscope image of methanogenic archaea, blue-green autofluorescence of coenzyme F420, cells glowing against dark background, methane bubbles visible, anaerobic environment',
    style: 'micro',
    tags: ['prokaryote', 'methanogen', 'microscopy']
  },
  'methanobacterium': {
    prompt: 'Transmission electron microscope image of Methanobacterium, long rod-shaped archaeon with pseudopeptidoglycan cell wall, false-colored in warm orange tones, anaerobic sediment context',
    style: 'micro',
    tags: ['prokaryote', 'methanogen', 'microscopy']
  },
  'asgard': {
    prompt: 'Artistic scientific rendering of Asgard archaea, complex cell with internal membrane structures hinting at eukaryotic origins, cytoskeletal elements visible, surrounded by deep-sea sediment particles, warm purple tones',
    style: 'illustration',
    tags: ['prokaryote', 'eukaryote-ancestor', 'deep-sea']
  },
  'halobacterium': {
    prompt: 'Photograph of hypersaline lake colored brilliant pink-red by Halobacterium colonies, crystalline salt formations along shoreline, intense desert sunlight, aerial view showing contrast between red water and white salt',
    style: 'photo',
    tags: ['prokaryote', 'extremophile', 'halophile']
  },
  'sulfolobus': {
    prompt: 'Transmission electron microscope image of Sulfolobus, irregularly lobed spherical archaeon from volcanic hot springs, false-colored in fiery orange-red tones, visible S-layer surface coat',
    style: 'micro',
    tags: ['prokaryote', 'extremophile', 'thermophile']
  },
  'pyrolobus': {
    prompt: 'Scanning electron microscope image of Pyrolobus fumarii, irregular coccoid cells from deep-sea hydrothermal vents, false-colored in deep red and black tones suggesting extreme heat, smoker chimney context',
    style: 'micro',
    tags: ['prokaryote', 'extremophile', 'hyperthermophile']
  },
  'lokiarchaeota': {
    prompt: 'Scientific illustration of Lokiarchaeota cell, showing complex internal membrane network and actin-like cytoskeleton, transitional between prokaryote and eukaryote, deep ocean sediment background, cool blue-purple tones',
    style: 'illustration',
    tags: ['prokaryote', 'eukaryote-ancestor', 'deep-sea']
  },

  // ── EUKARYOTA ──
  'eukaryota': {
    prompt: 'Fluorescence microscopy composite showing diversity of eukaryotic cells: animal cell with blue DAPI-stained nucleus, plant cell with red chloroplast fluorescence, green-stained cytoskeleton, confocal microscopy aesthetic',
    style: 'micro',
    tags: ['eukaryote', 'domain', 'microscopy']
  },

  // ── FUNGI ──
  'fungi': {
    prompt: 'Photorealistic close-up of diverse fungi fruiting bodies in a forest floor: bracket fungi, cup fungi, and mushrooms of various shapes and colors, morning dew, soft natural light filtering through canopy, macro photography',
    style: 'photo',
    tags: ['eukaryote', 'kingdom', 'forest']
  },
  'ascomycetes': {
    prompt: 'Close-up photograph of diverse ascomycete fungi: morel mushrooms with honeycomb caps, orange peel fungi, and tiny cup fungi on decaying wood, forest floor setting, macro photography with shallow depth of field',
    style: 'photo',
    tags: ['eukaryote', 'fungi', 'macro']
  },
  'saccharomyces': {
    prompt: 'Scanning electron microscope image of Saccharomyces cerevisiae yeast cells, oval budding cells with visible bud scars, some in various stages of budding, false-colored in warm bread-dough tones',
    style: 'micro',
    tags: ['eukaryote', 'fungi', 'microscopy']
  },
  'penicillium': {
    prompt: 'Microscope image of Penicillium chrysogenum, brush-shaped conidiophores (penicillus) bearing chains of blue-green spores, growing on agar plate, characteristic blue-green colony visible',
    style: 'micro',
    tags: ['eukaryote', 'fungi', 'antibiotic']
  },
  'basidiomycetes': {
    prompt: 'Forest photograph showing diversity of basidiomycete mushrooms: red-capped Amanita, shelf fungi on tree trunk, puffballs releasing spore clouds, soft dappled forest light, autumn setting',
    style: 'photo',
    tags: ['eukaryote', 'fungi', 'forest']
  },
  'amanita-muscaria': {
    prompt: 'Photorealistic close-up of Amanita muscaria mushroom, iconic bright red cap with white warts, white gills and stem with ring, growing among birch roots on mossy forest floor, natural lighting',
    style: 'photo',
    tags: ['eukaryote', 'fungi', 'iconic']
  },
  'armillaria': {
    prompt: 'Photograph of honey mushroom (Armillaria) cluster growing at base of tree trunk, golden-brown caps with fine scales, bioluminescent mycelium faintly glowing on surrounding dead wood at twilight',
    style: 'photo',
    tags: ['eukaryote', 'fungi', 'bioluminescent']
  },
  'psilocybe': {
    prompt: 'Close-up photograph of Psilocybe cubensis mushrooms, golden-brown caps with characteristic nipple, dark purple-brown spore print visible on lower caps, growing from rich substrate, natural studio lighting',
    style: 'photo',
    tags: ['eukaryote', 'fungi', 'psychoactive']
  },
  'chytrids': {
    prompt: 'Light microscope image of chytrid fungus zoosporangia, spherical bodies with rhizoids extending into substrate, some releasing motile zoospores with single flagellum, aquatic environment',
    style: 'micro',
    tags: ['eukaryote', 'fungi', 'aquatic']
  },
  'batrachochytrium': {
    prompt: 'Histological microscope image of Batrachochytrium dendrobatidis infection in amphibian skin, chytrid sporangia visible within skin cells, discharge tubes releasing zoospores, H&E stain colors',
    style: 'micro',
    tags: ['eukaryote', 'fungi', 'pathogen']
  },

  // ── PLANTAE ──
  'plantae': {
    prompt: 'Lush overhead photograph of diverse plant life: ferns, mosses, flowering plants, and conifers in a temperate rainforest, morning mist filtering through canopy, rich green palette with dappled light',
    style: 'photo',
    tags: ['eukaryote', 'kingdom', 'plants']
  },
  'bryophytes': {
    prompt: 'Macro photograph of diverse bryophytes: emerald green mosses with sporophytes bearing capsules, leafy liverworts, and hornwort rosettes, growing on wet rock surface, water droplets catching light',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'macro']
  },
  'sphagnum': {
    prompt: 'Close-up photograph of Sphagnum peat moss, star-shaped capitula forming dense cushion, pale green to russet colors, waterlogged peatland habitat, macro detail showing hyaline cells',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'wetland']
  },
  'marchantia': {
    prompt: 'Macro photograph of Marchantia polymorpha liverwort thallus, flat green ribbon-like body with gemma cups bearing splash cups, umbrella-shaped archegoniophore rising above, wet stone surface',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'macro']
  },
  'ferns': {
    prompt: 'Photorealistic image of unfurling fern fiddleheads in a temperate forest, coiled croziers with fine scales, mature fronds with visible sori on undersides, soft backlight through translucent fronds',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'forest']
  },
  'tree-fern': {
    prompt: 'Photograph of giant tree fern (Cyathea or Dicksonia) in tropical cloud forest, trunk rising 10 meters with crown of spreading fronds, morning mist, epiphytes on trunk, prehistoric atmosphere',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'tropical']
  },
  'azolla': {
    prompt: 'Close-up photograph of Azolla water fern floating on pond surface, tiny overlapping leaves in rosette pattern turning red, roots dangling in water below, aerial macro view',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'aquatic']
  },
  'gymnosperms': {
    prompt: 'Photograph of ancient gymnosperm forest: towering conifers, a cycad with stout trunk and palm-like crown, Ginkgo with fan-shaped leaves, morning light through canopy, Mesozoic atmosphere',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'ancient']
  },
  'sequoia': {
    prompt: 'Upward perspective photograph of giant sequoia (Sequoiadendron giganteum) trunk in Sequoia National Park, massive cinnamon-red bark deeply furrowed, tiny human figure for scale at base, cathedral light',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'iconic']
  },
  'welwitschia': {
    prompt: 'Photograph of Welwitschia mirabilis in Namib Desert, two strap-like leaves splitting and curling across sand, woody disc-shaped stem, stark desert landscape, harsh midday light casting strong shadows',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'desert']
  },
  'wollemia': {
    prompt: 'Photograph of Wollemi pine (Wollemia nobilis) showing distinctive dark chocolate-brown knobbly bark, unusual branching pattern with flat spreading fronds of waxy green leaves, temperate canyon setting',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'living-fossil']
  },
  'angiosperms': {
    prompt: 'Botanical diversity photograph showing flowering plants: orchid, sunflower, water lily, grass seed head, and cherry blossom branch, arranged as natural still life with soft diffused lighting',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'flowering']
  },
  'arabidopsis': {
    prompt: 'Laboratory photograph of Arabidopsis thaliana rosette, small plant with spatulate leaves growing in controlled conditions, white flowers on thin stem, clean scientific documentation style',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'model-organism']
  },
  'rafflesia': {
    prompt: 'Photograph of Rafflesia arnoldii in bloom on Borneo rainforest floor, massive 1-meter five-petaled flower with mottled red-brown surface and white warts, no visible leaves or stem, flies attracted to center',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'parasitic']
  },
  'titan-arum': {
    prompt: 'Photograph of Amorphophallus titanum (corpse flower) in full bloom, towering dark purple-red spathe opened to reveal cream-colored spadix, greenhouse setting, dramatic scale against human observers',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'iconic']
  },
  'mimosa-pudica': {
    prompt: 'High-speed photograph of Mimosa pudica (sensitive plant) with compound leaves folding shut upon touch, delicate pink pom-pom flowers, sequence showing open and closing stages, natural garden setting',
    style: 'photo',
    tags: ['eukaryote', 'plants', 'movement']
  },

  // ── PROTISTS ──
  'protists': {
    prompt: 'Composite microscope image showing protist diversity: green Volvox colony, brown diatom with intricate silica shell, ciliated Paramecium, amoeba with pseudopods, colorful dark-field microscopy',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'microscopy']
  },
  'amoebozoa': {
    prompt: 'Differential interference contrast microscope image of amoeba extending pseudopods, transparent cytoplasm with visible nucleus, food vacuoles, and contractile vacuole, clean aquatic background',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'microscopy']
  },
  'amoeba-proteus': {
    prompt: 'Phase contrast microscope image of Amoeba proteus, large amoeba with lobose pseudopods extended, visible nucleus and multiple food vacuoles containing algae, high magnification detail',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'microscopy']
  },
  'alveolates': {
    prompt: 'Composite microscope image of alveolate protists: Paramecium with cilia, Plasmodium in blood cell, dinoflagellate with cellulose plates, showing diversity of the supergroup, colorized',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'microscopy']
  },
  'paramecium': {
    prompt: 'Dark-field microscope image of Paramecium caudatum, slipper-shaped cell with visible cilia beating in waves, oral groove, contractile vacuoles pulsing, brilliant white against black background',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'microscopy']
  },
  'plasmodium': {
    prompt: 'Light microscope image of Plasmodium falciparum in Giemsa-stained blood smear, ring-form trophozoites inside red blood cells, characteristic purple-stained parasites in pink erythrocytes, medical pathology',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'pathogen']
  },
  'dinoflagellates': {
    prompt: 'Fluorescence microscope image of bioluminescent dinoflagellates, cellulose-plated cells with two flagella, glowing blue-green in dark water, some showing red-tide density, marine plankton',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'bioluminescent']
  },
  'stramenopiles': {
    prompt: 'Composite microscope image of stramenopile diversity: golden-brown diatom frustule with intricate patterns, kelp cross-section, oomycete hyphae, showing shared tinsel-flagellum heritage',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'microscopy']
  },
  'diatoms': {
    prompt: 'Scanning electron microscope image of diverse diatom frustules, intricate geometric silica shells in circular and pennate forms, arranged as natural jewel-like collection, false-colored in gold tones',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'geometric']
  },
  'phytophthora': {
    prompt: 'Microscope image of Phytophthora infestans sporangia releasing zoospores, lemon-shaped sporangia on branching sporangiophores, infecting potato leaf tissue visible below, plant pathology context',
    style: 'micro',
    tags: ['eukaryote', 'oomycete', 'pathogen']
  },
  'volvox': {
    prompt: 'Dark-field microscope image of Volvox globator colony, hollow green sphere of cells with daughter colonies visible inside, flagella creating motion, brilliant emerald green against dark water',
    style: 'micro',
    tags: ['eukaryote', 'protist', 'colonial']
  },

  // ── ANIMALIA ──
  'animalia': {
    prompt: 'Photorealistic collage of animal kingdom diversity: butterfly wing detail, octopus eye, coral polyps, tiger face, hummingbird in flight, microscopic rotifer, unified warm lighting, museum natural history aesthetic',
    style: 'photo',
    tags: ['eukaryote', 'kingdom', 'animals']
  },
  'invertebrates': {
    prompt: 'Underwater photograph of invertebrate diversity: jellyfish trailing tentacles, starfish on reef, nautilus shell, colorful nudibranch, tropical reef setting with clear blue water',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'invertebrate']
  },
  'cnidarians': {
    prompt: 'Underwater photograph of cnidarian diversity: moon jellyfish with translucent bell, sea anemone with tentacles extended, fire coral, all in clear tropical waters with sunlight filtering from above',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'marine']
  },
  'turritopsis': {
    prompt: 'Underwater macro photograph of Turritopsis dohrnii (immortal jellyfish), tiny transparent bell-shaped medusa about 4.5mm across, visible red-orange stomach, tentacles trailing, dark ocean water background',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'marine']
  },
  'coral': {
    prompt: 'Underwater close-up photograph of live coral polyps extended at night, translucent tentacles with visible nematocysts catching plankton, fluorescent colors under UV light, macro reef photography',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'reef']
  },
  'echinoderms': {
    prompt: 'Underwater photograph of echinoderm diversity: purple sea urchin with tube feet extended, orange starfish on rock, feather star swimming with arms spread, clear tropical water',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'marine']
  },
  'annelids': {
    prompt: 'Split photograph: half showing an iridescent polychaete worm with parapodia in marine setting, half showing an earthworm in rich garden soil with visible segments, macro photography',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'worm']
  },
  'cephalopods': {
    prompt: 'Underwater photograph of a common octopus changing color and texture, chromatophores visible on skin, one eye regarding camera, arms with suckers curling, dark reef background',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'intelligent']
  },
  'octopus': {
    prompt: 'Photorealistic close-up of a giant Pacific octopus, intelligent eye with horizontal pupil, textured skin showing chromatophore color change, suckers gripping rocky substrate, clear cold water',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'intelligent']
  },
  'nautilus': {
    prompt: 'Underwater photograph of chambered nautilus (Nautilus pompilius) swimming in open water, beautiful logarithmic spiral shell with brown-and-white stripes, tentacles extended, dark deep-water background',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'living-fossil']
  },
  'insects': {
    prompt: 'Macro photograph collage of insect diversity: iridescent beetle, dragonfly compound eye detail, ant carrying leaf fragment, moth wing scales, all with extreme macro detail and natural lighting',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'arthropod']
  },
  'honey-bee': {
    prompt: 'Extreme macro photograph of Apis mellifera (honey bee) on flower, compound eyes reflecting light, pollen baskets loaded on hind legs, translucent wings with visible venation, golden natural light',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'pollinator']
  },
  'mantis-shrimp': {
    prompt: 'Underwater macro photograph of peacock mantis shrimp (Odontodactylus scyllarus), vivid neon green and red body, stalked compound eyes with 16 color receptors, raptorial appendages raised, coral rubble substrate',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'marine']
  },
  'horseshoe-crab': {
    prompt: 'Photograph of Atlantic horseshoe crab (Limulus polyphemus) on sandy beach at dawn, domed brown carapace, telson spine, compound eyes visible, waves lapping, Delaware Bay spawning scene',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'living-fossil']
  },
  'vertebrates': {
    prompt: 'Museum-quality composite of vertebrate diversity: fish skeleton, frog, snake, bird in flight, human hand X-ray, all showing vertebral column homology, natural history museum aesthetic',
    style: 'illustration',
    tags: ['eukaryote', 'animals', 'chordate']
  },
  'fish': {
    prompt: 'Underwater photograph of a coral reef fish scene: colorful reef fish school, a moray eel in crevice, a ray passing overhead, clear tropical water with sun rays, National Geographic quality',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'aquatic']
  },
  'shark': {
    prompt: 'Underwater photograph of great white shark (Carcharodon carcharias), powerful torpedo body in clear blue water, mouth slightly open showing serrated teeth, sunlight from above, respect and awe composition',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'predator']
  },
  'coelacanth': {
    prompt: 'Deep-water photograph of living coelacanth (Latimeria chalumnae), steel-blue scales with white spots, lobed fins in walking position, dark cave environment, submarine research vessel light illuminating',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'living-fossil']
  },
  'amphibians': {
    prompt: 'Rainforest photograph of amphibian diversity: red-eyed tree frog on leaf, fire salamander on mossy rock, glass frog showing internal organs, poison dart frog, tropical setting with water droplets',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'amphibian']
  },
  'reptiles': {
    prompt: 'Photorealistic composition of reptile diversity: green iguana on branch, coiled python, sea turtle swimming, chameleon catching insect, crocodile eye at water surface, warm natural lighting',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'reptile']
  },
  'tuatara': {
    prompt: 'Close-up photograph of tuatara (Sphenodon punctatus), ancient reptile with scaly olive-green skin, prominent spiny crest, visible third eye on head, alert posture on New Zealand rock outcrop',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'living-fossil']
  },
  'komodo-dragon': {
    prompt: 'Photograph of Komodo dragon (Varanus komodoensis), massive lizard walking on volcanic island beach, forked yellow tongue extended, powerful limbs and thick tail, harsh tropical sunlight, Indonesia',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'predator']
  },
  'birds': {
    prompt: 'Composite photograph of bird diversity: bald eagle in flight, hummingbird hovering at flower, penguin colony, owl face close-up, peacock displaying tail, dramatic natural lighting',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'avian']
  },
  'archaeopteryx': {
    prompt: 'Museum-quality photograph of Archaeopteryx lithographica fossil in Solnhofen limestone, clear feather impressions, skeletal detail with toothed jaw and clawed wings, dramatic side lighting on pale stone',
    style: 'fossil',
    tags: ['eukaryote', 'animals', 'transitional']
  },
  'peregrine-falcon': {
    prompt: 'Action photograph of peregrine falcon (Falco peregrinus) in hunting stoop, wings tucked, aerodynamic teardrop shape, blurred background suggesting extreme speed, dramatic raptor photography',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'speed']
  },
  'mammals': {
    prompt: 'Photorealistic composition of mammal diversity: elephant, dolphin leaping, bat in flight, mouse, whale tail, all showing fur/hair and warm-blooded adaptations, golden hour lighting',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'mammal']
  },
  'platypus': {
    prompt: 'Underwater photograph of duck-billed platypus (Ornithorhynchus anatinus) diving in clear creek, beaver-like fur with air bubbles, duck-bill electroreception, webbed feet paddling, Australian waterway',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'monotreme']
  },
  'cetaceans': {
    prompt: 'Underwater photograph of humpback whale mother and calf, massive body in clear blue tropical water, barnacles on skin, sunlight streaming from surface, intimate marine mammal portrait',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'marine-mammal']
  },
  'blue-whale': {
    prompt: 'Underwater photograph of blue whale (Balaenoptera musculus) in deep blue water, enormous mottled blue-gray body, tiny eye visible, diver silhouette for scale in distance, awe-inspiring composition',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'largest']
  },
  'naked-mole-rat': {
    prompt: 'Close-up photograph of naked mole-rat (Heterocephalus glaber), wrinkled pink skin, prominent incisors protruding outside closed lips, tiny eyes, underground tunnel context, warm lighting',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'eusocial']
  },
  'primates': {
    prompt: 'Photorealistic composition of primate diversity: ring-tailed lemur, spider monkey hanging by tail, proboscis monkey, mandrill face, Japanese macaque in hot spring, natural forest lighting',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'primate']
  },
  'great-apes': {
    prompt: 'Portrait photograph of great ape faces: thoughtful chimpanzee, silverback gorilla, orangutan with gentle expression, museum-quality black background portraits showing intelligence and emotion',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'hominoid']
  },
  'orangutan': {
    prompt: 'Portrait photograph of Bornean orangutan (Pongo pygmaeus) in rainforest canopy, intelligent brown eyes, shaggy red-orange hair, large cheek flanges on male, holding branch, dappled forest light',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'great-ape']
  },
  'gorilla': {
    prompt: 'Portrait photograph of mountain gorilla silverback (Gorilla beringei), massive black-furred body, silver saddle on back, contemplative dark eyes, misty Virunga mountain forest background',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'great-ape']
  },
  'chimpanzee': {
    prompt: 'Close-up portrait of chimpanzee (Pan troglodytes), intelligent dark eyes with visible emotion, expressive face, some gray hairs, using a twig tool, African tropical forest background',
    style: 'photo',
    tags: ['eukaryote', 'animals', 'great-ape']
  },

  // ── HOMININI (tribe) ──
  'hominini': {
    prompt: 'Museum-quality composite showing the march of human evolution: silhouettes progressing from a crouched ape-like figure through upright australopiths to a modern human, set against an African savanna sunset with acacia trees, warm golden light, scientific illustration style with anatomical accuracy',
    style: 'illustration',
    tags: ['hominin', 'tribe', 'evolution', 'iconic']
  },

  // ── HOMININS ──
  'sahelanthropus': {
    prompt: 'Scientific reconstruction of Sahelanthropus tchadensis (Toumai), ape-like face with reduced canines, small braincase, standing semi-upright in forested lake margin environment in ancient Chad, 7 million years ago, paleoart style',
    style: 'illustration',
    tags: ['hominin', 'proto', 'paleoart']
  },
  'orrorin': {
    prompt: 'Scientific reconstruction of Orrorin tugenensis walking bipedally through mixed Kenyan forest 6 million years ago, ape-like body with long arms for climbing, thick tree canopy, paleoart style',
    style: 'illustration',
    tags: ['hominin', 'proto', 'paleoart']
  },
  'ardipithecus_r': {
    prompt: 'Paleoart reconstruction of Ardipithecus ramidus (Ardi) in Ethiopian woodland 4.4 million years ago, mosaic of ape and human features, walking upright with grasping big toe, surrounded by woodland trees',
    style: 'illustration',
    tags: ['hominin', 'proto', 'paleoart']
  },
  'au_anamensis': {
    prompt: 'Scientific reconstruction of Australopithecus anamensis walking along ancient Kenyan lakeshore 4 million years ago, bipedal posture, ape-like face with projecting jaw, scattered acacia trees',
    style: 'illustration',
    tags: ['hominin', 'australopith', 'paleoart']
  },
  'au_afarensis': {
    prompt: 'Paleoart reconstruction of Australopithecus afarensis (Lucy) walking upright on East African savanna 3.2 million years ago, small stature with long arms, footprints in volcanic ash behind, dramatic sunset sky',
    style: 'illustration',
    tags: ['hominin', 'australopith', 'paleoart', 'iconic']
  },
  'au_africanus': {
    prompt: 'Scientific reconstruction of Australopithecus africanus in South African woodland, rounder braincase than afarensis, young individual (Taung Child reference), limestone cave and savanna backdrop',
    style: 'illustration',
    tags: ['hominin', 'australopith', 'paleoart']
  },
  'au_bahrelghazali': {
    prompt: 'Paleoart reconstruction of Australopithecus bahrelghazali in ancient Chad Basin savanna 3.5 million years ago, australopith walking through open grassland far from East Africa, dramatic landscape',
    style: 'illustration',
    tags: ['hominin', 'australopith', 'paleoart']
  },
  'au_deyiremeda': {
    prompt: 'Scientific reconstruction of Australopithecus deyiremeda in Ethiopian woodland alongside Au. afarensis in distance, showing species coexistence 3.4 million years ago, distinct jaw morphology highlighted',
    style: 'illustration',
    tags: ['hominin', 'australopith', 'paleoart']
  },
  'au_garhi': {
    prompt: 'Paleoart reconstruction of Australopithecus garhi using stone to cut meat from antelope carcass on Ethiopian savanna 2.5 million years ago, earliest butchery scene, dramatic pre-Homo tool use',
    style: 'illustration',
    tags: ['hominin', 'australopith', 'paleoart']
  },
  'au_sediba': {
    prompt: 'Scientific reconstruction of Australopithecus sediba pair at Malapa cave entrance in South Africa 2 million years ago, mosaic of australopith and Homo features, precision grip on small object',
    style: 'illustration',
    tags: ['hominin', 'australopith', 'paleoart']
  },
  'au_prometheus': {
    prompt: 'Paleoart reconstruction of Australopithecus prometheus (Little Foot) climbing between forest canopy and cave opening at Sterkfontein South Africa 3.67 million years ago, grasping big toe visible',
    style: 'illustration',
    tags: ['hominin', 'australopith', 'paleoart']
  },
  'kenyanthropus': {
    prompt: 'Scientific reconstruction of Kenyanthropus platyops at Lake Turkana Kenya 3.5 million years ago, remarkably flat face unlike australopiths, standing near lakeside woodland, paleoart style',
    style: 'illustration',
    tags: ['hominin', 'proto', 'paleoart']
  },
  'par_aethiopicus': {
    prompt: 'Paleoart reconstruction of Paranthropus aethiopicus, massive sagittal crest and extremely prognathic face, foraging at lakeshore in East Africa 2.5 million years ago, powerful jaw muscles emphasized',
    style: 'illustration',
    tags: ['hominin', 'paranthropus', 'paleoart']
  },
  'par_boisei': {
    prompt: 'Scientific reconstruction of Paranthropus boisei (Nutcracker Man) at Olduvai Gorge 1.8 million years ago, enormous jaw and sagittal crest, grinding sedge roots, coexisting with early Homo in background',
    style: 'illustration',
    tags: ['hominin', 'paranthropus', 'paleoart']
  },
  'par_robustus': {
    prompt: 'Paleoart reconstruction of Paranthropus robustus using bone tool to dig in termite mound in South African woodland 1.5 million years ago, robust skull with sagittal crest, strong jaw',
    style: 'illustration',
    tags: ['hominin', 'paranthropus', 'paleoart']
  },
  'h_habilis': {
    prompt: 'Scientific reconstruction of Homo habilis (Handy Man) knapping Oldowan stone tools at Olduvai Gorge 2 million years ago, larger brain than australopiths, long arms, focused expression, East African savanna',
    style: 'illustration',
    tags: ['hominin', 'early-homo', 'paleoart']
  },
  'h_rudolfensis': {
    prompt: 'Paleoart reconstruction of Homo rudolfensis at Koobi Fora Kenya 2 million years ago, large flat broad face, bigger braincase than habilis, lakeside savanna environment',
    style: 'illustration',
    tags: ['hominin', 'early-homo', 'paleoart']
  },
  'h_erectus': {
    prompt: 'Scientific reconstruction of Homo erectus (Turkana Boy proportions) wielding Acheulean hand axe, modern body proportions, campfire in background, African savanna transitioning to open woodland, 1.5 million years ago',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart', 'iconic']
  },
  'h_antecessor': {
    prompt: 'Paleoart reconstruction of Homo antecessor in Atapuerca cave Spain 900,000 years ago, modern-looking face on archaic body, cave environment with firelight, earliest western European hominin',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'h_heidelbergensis': {
    prompt: 'Scientific reconstruction of Homo heidelbergensis hunting with wooden spear (Schoningen style), heavy brow ridge, robust build, Ice Age European grassland with horses in distance, 400,000 years ago',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'h_bodoensis': {
    prompt: 'Paleoart reconstruction of Homo bodoensis in African Middle Pleistocene savanna 400,000 years ago, large-brained archaic human with robust face, Acheulean tools, direct ancestor of sapiens',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'neanderthal': {
    prompt: 'Photorealistic reconstruction of Neanderthal adult, powerful stocky build with barrel chest, prominent brow ridge, wearing simple hide clothing, applying ochre pigment in cave shelter, Ice Age European landscape visible outside',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart', 'iconic']
  },
  'denisovans': {
    prompt: 'Scientific reconstruction of a Denisovan individual based on DNA methylation morphology predictions, robust build, wide skull, large dental arch, Denisova Cave Siberia interior with bone tools and beads',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'h_naledi': {
    prompt: 'Paleoart reconstruction of Homo naledi navigating narrow dark passage in Rising Star Cave South Africa, small-brained but human-like hands and feet, carrying fire torch through 17cm squeeze, 300,000 years ago',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'h_floresiensis': {
    prompt: 'Scientific reconstruction of Homo floresiensis (The Hobbit) standing 1 meter tall in tropical Flores Island forest, making stone tools despite tiny brain, Stegodon dwarf elephant in background, 60,000 years ago',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'h_luzonensis': {
    prompt: 'Paleoart reconstruction of Homo luzonensis in Callao Cave Philippines 60,000 years ago, small-bodied island hominin with mosaic features, tropical cave environment, using stone tools',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'h_longi': {
    prompt: 'Scientific reconstruction of Homo longi (Dragon Man) based on Harbin skull, massive skull with large brain, archaic features but potentially close to sapiens, cold temperate Asian landscape with Ice Age fauna',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'h_sapiens': {
    prompt: 'Photorealistic portrait of anatomically modern Homo sapiens, diverse composite showing global human diversity, high forehead, chin, gracile build, cave art on wall behind, symbolic tools and ochre',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart', 'iconic']
  },

  // ── HOMININS (duplicate IDs from second dataset in index.html) ──
  'homo-naledi': {
    prompt: 'Paleoart reconstruction of Homo naledi navigating narrow dark passage in Rising Star Cave South Africa, small-brained but human-like hands and feet, carrying fire torch through 17cm squeeze, 300,000 years ago',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'homo-floresiensis': {
    prompt: 'Scientific reconstruction of Homo floresiensis (The Hobbit) standing 1 meter tall in tropical Flores Island forest, making stone tools despite tiny brain, Stegodon dwarf elephant in background, 60,000 years ago',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'denisovan': {
    prompt: 'Scientific reconstruction of a Denisovan individual based on DNA methylation morphology predictions, robust build, wide skull, large dental arch, Denisova Cave Siberia interior with bone tools and beads',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart']
  },
  'homo-sapiens': {
    prompt: 'Photorealistic portrait of anatomically modern Homo sapiens, diverse composite showing global human diversity, high forehead, chin, gracile build, cave art on wall behind, symbolic tools and ochre',
    style: 'illustration',
    tags: ['hominin', 'homo', 'paleoart', 'iconic']
  }
};

/* Retrieve prompt data for a node ID */
function getImagePrompt(nodeId) {
  return IMAGE_PROMPTS[nodeId] || null;
}
