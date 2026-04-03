// ══════════════════════════════════════════════════════
// PRIMATE ENRICHMENT DATA
// Scientific data for primate-lineage info cards:
// taxonomy, genome, physical traits, behavior, conservation
// ══════════════════════════════════════════════════════

export const PRIMATE_DATA = {

  // ── GROUP NODES ──────────────────────────────────────

  'primates': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates' },
    genome: { size:'~3 Gbp', chromosomes:null, dnaSimHuman:null },
    brain: { volume:null, eq:null },
    physical: {
      height:null, weight:null,
      dentition:'2.1.2.3 / 2.1.3.3 (varies)',
      skull:'Large braincase relative to body, forward-facing orbits with postorbital bar',
      locomotion:'Arboreal to bipedal (highly varied)'
    },
    behavior: {
      socialStructure:'Solitary to large multi-male/multi-female groups',
      toolUse:'Present in many lineages (apes, capuchins, macaques)',
      communication:'Vocalizations, facial expressions, gestures',
      culture:'Documented in great apes and some monkeys'
    },
    conservation: { iucnStatus:null, population:'~500 living species', threat:'Habitat loss, bushmeat hunting' }
  },

  'great-apes': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae' },
    genome: { size:'~3.1 Gbp', chromosomes:'46–48', dnaSimHuman:'96–99%' },
    brain: { volume:null, eq:null },
    physical: {
      height:null, weight:null,
      dentition:'2.1.2.3 (Y-5 molar pattern)',
      skull:'Large braincase, no tail, broad face',
      locomotion:'Knuckle-walking, brachiation, or bipedal (varied)'
    },
    behavior: {
      socialStructure:'Complex hierarchical groups with alliances',
      toolUse:'All species use and manufacture tools',
      communication:'Gestures, vocalizations, some sign language capacity',
      culture:'Distinct cultural traditions documented in all species'
    },
    conservation: { iucnStatus:null, population:'7 living species', threat:'All endangered except Homo sapiens' }
  },

  // ── LIVING APE SPECIES ──────────────────────────────

  'orangutan': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Ponginae', genus:'Pongo', species:'P. pygmaeus / P. abelii / P. tapanuliensis' },
    genome: { size:'3.09 Gbp', chromosomes:48, dnaSimHuman:96.9 },
    brain: { volume:[275,500], eq:1.7 },
    physical: {
      height:'127–152 cm (standing)',
      weight:'30–82 kg (extreme dimorphism)',
      dentition:'Large molars with thick enamel for fruit and bark',
      skull:'Flanged cheek pads in mature males, concave facial profile',
      locomotion:'Quadrumanous climbing; largest arboreal mammal'
    },
    behavior: {
      socialStructure:'Semi-solitary; mothers with dependent offspring',
      toolUse:'Sticks for insects and honey, leaves as rain covers and gloves',
      communication:'Kiss-squeaks, long calls (flanged males carry 1+ km)',
      culture:'Tool traditions vary by population; some use leaf gloves, others never do'
    },
    conservation: { iucnStatus:'Critically Endangered', population:'~120,000 (all 3 species)', threat:'Palm oil deforestation, illegal pet trade' }
  },

  'gorilla': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Gorillini', genus:'Gorilla', species:'G. gorilla / G. beringei' },
    genome: { size:'3.04 Gbp', chromosomes:48, dnaSimHuman:98.3 },
    brain: { volume:[340,752], eq:1.8 },
    physical: {
      height:'150–180 cm (standing)',
      weight:'68–220 kg (males much larger)',
      dentition:'Large molars, sagittal crest in males for jaw muscle attachment',
      skull:'Pronounced sagittal crest (males), large brow ridges',
      locomotion:'Knuckle-walking; rare bipedal episodes'
    },
    behavior: {
      socialStructure:'One-male harem (silverback-led troops of 5–30)',
      toolUse:'Sticks to gauge water depth, chest-beating for communication',
      communication:'22+ vocalizations, chest beats, Koko learned 1,000+ ASL signs',
      culture:'Chest-beating dialects differ between groups; food processing techniques vary'
    },
    conservation: { iucnStatus:'Critically Endangered', population:'~360,000 (western) / ~1,000 (mountain)', threat:'Ebola, habitat loss, poaching, civil conflict' }
  },

  'chimpanzee': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini (broad)', genus:'Pan', species:'P. troglodytes' },
    genome: { size:'3.1 Gbp', chromosomes:48, dnaSimHuman:98.7 },
    brain: { volume:[282,500], eq:2.2 },
    physical: {
      height:'100–170 cm (standing)',
      weight:'32–60 kg',
      dentition:'Large canines (males), thin enamel adapted to ripe fruit',
      skull:'Prognathic face, prominent brow ridges, no chin',
      locomotion:'Knuckle-walking and arboreal climbing; occasional bipedalism'
    },
    behavior: {
      socialStructure:'Fission-fusion communities of 20–150, male-bonded',
      toolUse:'Stone hammers for nuts, termite fishing sticks, leaf sponges, spears for bushbabies',
      communication:'Pant-hoots, screams, gestures; 66+ gesture types documented',
      culture:'40+ distinct cultural traditions; tool techniques passed maternally'
    },
    conservation: { iucnStatus:'Endangered', population:'~170,000–300,000', threat:'Habitat loss, bushmeat, disease (Ebola, respiratory)' }
  },

  // ── HOMININI TRIBE NODE ─────────────────────────────

  'hominini': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini' },
    genome: { size:'~3.1 Gbp', chromosomes:'46–48', dnaSimHuman:null },
    brain: { volume:null, eq:null },
    physical: {
      height:null, weight:null,
      dentition:'Reduced canines vs. apes; variable molar size across genera',
      skull:'Trend toward larger braincase, reduced prognathism over time',
      locomotion:'Habitual bipedalism (defining trait of the tribe)'
    },
    behavior: {
      socialStructure:'Variable; inferred from comparative anatomy and archaeology',
      toolUse:'Stone tools from at least 3.3 Mya (Lomekwi 3)',
      communication:'Unknown for early members; full language in Homo sapiens',
      culture:'Fire use from ~1 Mya; burial from ~300 Kya; art from ~100 Kya'
    },
    conservation: { iucnStatus:null, population:'1 surviving species', threat:'25+ species extinct; sole survivor' }
  },

  // ── HOMO SAPIENS (main tree node) ───────────────────

  'homo-sapiens': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. sapiens' },
    genome: { size:'3.1 Gbp', chromosomes:46, dnaSimHuman:100, note:'Reference genome (GRCh38). ~20,000 protein-coding genes.' },
    brain: { volume:[1200,1700], eq:7.4 },
    physical: {
      height:'~170 cm avg (highly variable)',
      weight:'~62–80 kg avg',
      dentition:'Small canines, small molars with thin enamel, 3rd molar often vestigial',
      skull:'Globular braincase, prominent chin (mental eminence), high forehead, no brow ridge',
      locomotion:'Obligate biped; endurance running adaptation'
    },
    behavior: {
      socialStructure:'Flexible; pair-bonding within larger cooperative groups of 50–150 (Dunbar\'s number)',
      toolUse:'All technology in history — from Oldowan to spaceflight',
      communication:'Full recursive syntactic language; ~7,000 living languages',
      culture:'Cumulative culture; agriculture ~12 Kya; writing ~5 Kya; science ~400 years'
    },
    conservation: { iucnStatus:'Least Concern', population:'~8.1 billion', threat:'Self-inflicted existential risks' }
  },

  // ── HOMININ GROUP NODES ─────────────────────────────

  'group-proto': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA recovered from any proto-hominin' },
    brain: { volume:null, eq:null },
    physical: { height:null, weight:null, dentition:'Reduced canines compared to apes', skull:'Small braincase (280–400 cc)', locomotion:'Possible bipedalism; retained arboreal features' },
    behavior: { socialStructure:'Unknown', toolUse:'None documented', communication:'Unknown', culture:null },
    conservation: null
  },

  'group-australopith': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA recovered from any Australopithecus' },
    brain: { volume:[370,500], eq:null },
    physical: { height:'105–150 cm', weight:'27–55 kg', dentition:'Large molars with thick enamel; small canines', skull:'Prognathic face, moderate brow ridges, 370–500 cc braincase', locomotion:'Fully bipedal; some species retained arboreal climbing' },
    behavior: { socialStructure:'Likely small groups', toolUse:'Possible from 3.3 Mya', communication:'Vocalizations', culture:null },
    conservation: null
  },

  'group-paranthropus': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Paranthropus' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA recovered from any Paranthropus' },
    brain: { volume:[410,530], eq:null },
    physical: { height:'120–137 cm', weight:'40–68 kg', dentition:'Massive molars (largest in any hominin), sagittal crest', skull:'Dramatic sagittal crest for jaw muscle, dish-shaped face', locomotion:'Bipedal' },
    behavior: { socialStructure:'Unknown; possibly small groups', toolUse:'Possible bone tools (P. robustus)', communication:'Unknown', culture:null },
    conservation: null
  },

  'group-homo': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo' },
    genome: { size:'~3.1 Gbp', chromosomes:46, dnaSimHuman:null, note:'Ancient DNA recovered from Neanderthals, Denisovans, and some early H. sapiens' },
    brain: { volume:[510,1750], eq:null },
    physical: { height:'100–185 cm', weight:'25–90 kg', dentition:'Progressively smaller teeth and jaws through time', skull:'Trend toward larger, rounder braincase; chin appears in H. sapiens', locomotion:'Obligate bipeds' },
    behavior: { socialStructure:'Increasingly complex social groups', toolUse:'Oldowan → Acheulean → Mousterian → Upper Paleolithic → Modern', communication:'Proto-language to full recursive syntax', culture:'Fire ~1 Mya; burial ~300 Kya; art ~100 Kya; agriculture ~12 Kya' },
    conservation: null
  },

  // ── PROTO-HOMININS ──────────────────────────────────

  'sahelanthropus': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Sahelanthropus', species:'S. tchadensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (7–6 Mya)' },
    brain: { volume:[320,380], eq:null },
    physical: { height:'~120 cm', weight:'30–50 kg', dentition:'Small canines (human-like), large brow ridges', skull:'Crushed but reconstructed; anteriorly-placed foramen magnum suggests upright posture', locomotion:'Possibly bipedal (debated); femur evidence controversial' },
    behavior: { socialStructure:'Unknown', toolUse:'None known', communication:'Unknown', culture:null },
    conservation: null
  },

  'orrorin': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Orrorin', species:'O. tugenensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (6.1–5.7 Mya)' },
    brain: { volume:null, eq:null },
    physical: { height:'~120 cm', weight:'35–50 kg', dentition:'Small canines, thick enamel molars', skull:'No cranial remains found', locomotion:'Bipedal femur morphology; curved finger bones for climbing' },
    behavior: { socialStructure:'Unknown', toolUse:'None known', communication:'Unknown', culture:null },
    conservation: null
  },

  'ardipithecus_r': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Ardipithecus', species:'Ar. ramidus' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (4.4 Mya)' },
    brain: { volume:[280,350], eq:null },
    physical: { height:'~120 cm', weight:'~50 kg', dentition:'Small canines (unlike chimps), thin enamel', skull:'Small braincase (~300 cc), slightly prognathic face', locomotion:'Bipedal midfoot but opposable big toe; arboreal + terrestrial' },
    behavior: { socialStructure:'Inferred reduced male-male competition (small canines)', toolUse:'None known', communication:'Unknown', culture:null },
    conservation: null
  },

  'kenyanthropus': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Kenyanthropus', species:'K. platyops' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (3.5–3.2 Mya)' },
    brain: { volume:null, eq:null },
    physical: { height:'~130 cm', weight:'~40 kg', dentition:'Small molars relative to other australopiths', skull:'Remarkably flat face (derived); small ear canals', locomotion:'Presumably bipedal (no postcranial remains)' },
    behavior: { socialStructure:'Unknown', toolUse:'None known; but near Lomekwi 3 tool site (3.3 Mya)', communication:'Unknown', culture:null },
    conservation: null
  },

  // ── AUSTRALOPITHECINES ──────────────────────────────

  'au_anamensis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus', species:'Au. anamensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (4.2–3.8 Mya)' },
    brain: { volume:[370,400], eq:null },
    physical: { height:'~145 cm', weight:'45–55 kg', dentition:'Thick enamel, large canines (more ape-like than later Australopithecus)', skull:'2019 cranium: small braincase, prognathic with ape-like features', locomotion:'Bipedal (tibia morphology); possible arboreal component' },
    behavior: { socialStructure:'Unknown', toolUse:'None known', communication:'Unknown', culture:null },
    conservation: null
  },

  'au_afarensis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus', species:'Au. afarensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (3.9–2.9 Mya)' },
    brain: { volume:[380,450], eq:null },
    physical: { height:'105–150 cm (high dimorphism)', weight:'30–55 kg', dentition:'Intermediate between apes and humans; thick enamel', skull:'Prognathic, small braincase (380–450 cc), sagittal crest in some males', locomotion:'Fully bipedal (Laetoli footprints); long curved arms for climbing' },
    behavior: { socialStructure:'Likely multi-male groups with high sexual dimorphism', toolUse:'Possible (cut marks at Dikika, 3.4 Mya)', communication:'Vocalizations', culture:null },
    conservation: null
  },

  'au_africanus': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus', species:'Au. africanus' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (3.3–2.1 Mya)' },
    brain: { volume:[420,500], eq:null },
    physical: { height:'115–138 cm', weight:'30–45 kg', dentition:'More human-like proportions; smaller canines than afarensis', skull:'Rounder braincase, less prognathic, no sagittal crest', locomotion:'Bipedal; reduced arboreal adaptations vs. afarensis' },
    behavior: { socialStructure:'Unknown; smaller sexual dimorphism suggests different mating system', toolUse:'Possible bone tools', communication:'Unknown', culture:null },
    conservation: null
  },

  'au_bahrelghazali': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus', species:'Au. bahrelghazali' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (3.6–3.0 Mya)' },
    brain: { volume:null, eq:null },
    physical: { height:'~120 cm', weight:'30–40 kg', dentition:'Thick enamel, premolar root morphology distinct from afarensis', skull:'Known only from mandible; no cranial data', locomotion:'Presumably bipedal' },
    behavior: { socialStructure:'Unknown', toolUse:'None known', communication:'Unknown', culture:null },
    conservation: null
  },

  'au_deyiremeda': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus', species:'Au. deyiremeda' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (3.5–3.3 Mya)' },
    brain: { volume:null, eq:null },
    physical: { height:'~120 cm', weight:'30–45 kg', dentition:'Smaller teeth than afarensis; distinct enamel thickness', skull:'Robust maxilla and mandible; distinct from contemporary afarensis', locomotion:'Presumably bipedal' },
    behavior: { socialStructure:'Unknown', toolUse:'None known', communication:'Unknown', culture:null },
    conservation: null
  },

  'au_garhi': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus', species:'Au. garhi' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (2.5 Mya)' },
    brain: { volume:[450,450], eq:null },
    physical: { height:'~130 cm', weight:'40–50 kg', dentition:'Large anterior teeth; unusual proportions', skull:'~450 cc braincase; prognathic face', locomotion:'Bipedal; long femur relative to humerus (more human-like)' },
    behavior: { socialStructure:'Unknown', toolUse:'Associated with cut-marked animal bones (butchery)', communication:'Unknown', culture:null },
    conservation: null
  },

  'au_sediba': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus', species:'Au. sediba' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (1.98–1.78 Mya)' },
    brain: { volume:[420,440], eq:null },
    physical: { height:'~130 cm', weight:'27–33 kg', dentition:'Small teeth for an australopith', skull:'Small braincase (420–440 cc) but human-like frontal lobe shape', locomotion:'Bipedal with unique hyperpronating gait; Homo-like pelvis' },
    behavior: { socialStructure:'Unknown', toolUse:'None confirmed', communication:'Unknown', culture:null },
    conservation: null
  },

  'au_prometheus': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Australopithecus', species:'Au. prometheus (debated)' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (~3.67 Mya)' },
    brain: { volume:[408,408], eq:null },
    physical: { height:'~135 cm', weight:'40–50 kg', dentition:'Large molars; thick enamel', skull:'408 cc braincase; slightly more robust than africanus', locomotion:'Bipedal with strong arboreal adaptations (grasping foot)' },
    behavior: { socialStructure:'Unknown', toolUse:'None', communication:'Unknown', culture:null },
    conservation: null
  },

  // ── PARANTHROPUS ────────────────────────────────────

  'par_aethiopicus': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Paranthropus', species:'P. aethiopicus' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (2.7–2.3 Mya)' },
    brain: { volume:[410,410], eq:null },
    physical: { height:'~125 cm', weight:'~44 kg', dentition:'Massive molars, very large premolars', skull:'Largest sagittal crest of any hominin; extremely prognathic face; Black Skull (manganese-stained)', locomotion:'Bipedal' },
    behavior: { socialStructure:'Unknown', toolUse:'None', communication:'Unknown', culture:null },
    conservation: null
  },

  'par_boisei': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Paranthropus', species:'P. boisei' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (2.4–1.4 Mya)' },
    brain: { volume:[410,530], eq:null },
    physical: { height:'124–137 cm', weight:'44–68 kg', dentition:'Largest molars of any hominin; 4× area of human molars', skull:'Massive sagittal crest, dish-shaped face, huge zygomatic arches', locomotion:'Bipedal' },
    behavior: { socialStructure:'Unknown', toolUse:'None documented', communication:'Unknown', culture:null },
    conservation: null
  },

  'par_robustus': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Paranthropus', species:'P. robustus' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA record (2.0–1.2 Mya)' },
    brain: { volume:[450,530], eq:null },
    physical: { height:'120–132 cm', weight:'40–54 kg', dentition:'Very large molars; moderate sagittal crest', skull:'Moderate sagittal crest; flat face; robust mandible', locomotion:'Bipedal' },
    behavior: { socialStructure:'Unknown', toolUse:'Possible bone digging tools for termite mounds', communication:'Unknown', culture:null },
    conservation: null
  },

  // ── GENUS HOMO ──────────────────────────────────────

  'h_habilis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. habilis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA era (2.4–1.4 Mya)' },
    brain: { volume:[510,680], eq:3.3 },
    physical: { height:'100–135 cm', weight:'~32 kg', dentition:'Smaller teeth than australopiths; narrower molars', skull:'510–680 cc braincase; rounder than australopiths', locomotion:'Bipedal; long arms suggest continued arboreal behavior' },
    behavior: { socialStructure:'Likely small groups', toolUse:'Oldowan stone tools (Mode 1)', communication:'Proto-language possible', culture:'First confirmed stone tool tradition (Oldowan)' },
    conservation: null
  },

  'h_rudolfensis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. rudolfensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Pre-DNA era (2.4–1.8 Mya)' },
    brain: { volume:[700,800], eq:null },
    physical: { height:'~150 cm', weight:'~45 kg', dentition:'Large flat face; broad palate', skull:'700–800 cc; flat, broad face (KNM-ER 1470)', locomotion:'Bipedal' },
    behavior: { socialStructure:'Unknown', toolUse:'Oldowan possible', communication:'Rudimentary', culture:null },
    conservation: null
  },

  'h_erectus': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. erectus' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No ancient DNA recovered; too old for preservation' },
    brain: { volume:[600,1100], eq:3.3 },
    physical: { height:'145–185 cm', weight:'40–68 kg', dentition:'Smaller teeth than habilis; thinner enamel', skull:'Thick skull walls, prominent brow ridge, occipital torus, 600–1100 cc', locomotion:'Fully modern bipedal body proportions (Nariokotome Boy)' },
    behavior: { socialStructure:'Cooperative groups; first intercontinental dispersal', toolUse:'Acheulean hand axes (Mode 2)', communication:'Proto-language likely', culture:'Fire control (~1 Mya), first to leave Africa, ~1.8 million year persistence' },
    conservation: null
  },

  'h_antecessor': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. antecessor' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'Ancient protein analysis links to Neanderthal lineage' },
    brain: { volume:[1000,1100], eq:null },
    physical: { height:'~170 cm', weight:'60–90 kg', dentition:'Modern-looking anterior teeth', skull:'Strikingly modern face; 1,000–1,100 cc braincase', locomotion:'Fully bipedal; modern body proportions' },
    behavior: { socialStructure:'Unknown', toolUse:'Acheulean', communication:'Proto-language', culture:'Cannibalism evidence (defleshing marks on juvenile bones)' },
    conservation: null
  },

  'h_heidelbergensis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. heidelbergensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA; protein analysis groups with Neanderthal clade' },
    brain: { volume:[1100,1400], eq:4.8 },
    physical: { height:'~175 cm', weight:'60–80 kg', dentition:'Intermediate between erectus and Neanderthal', skull:'Large brow ridge, 1,100–1,400 cc braincase, occipital bun developing', locomotion:'Fully bipedal; robust, cold-adapted body in European populations' },
    behavior: { socialStructure:'Cooperative hunting groups', toolUse:'Advanced Acheulean, wooden spears (Schoeningen, 400 Kya)', communication:'Advanced proto-language', culture:'Routine fire use; strategic big-game hunting; possible symbolic behavior' },
    conservation: null
  },

  'h_bodoensis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. bodoensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA; proposed direct sapiens ancestor (2021)' },
    brain: { volume:[1250,1250], eq:null },
    physical: { height:'~175 cm', weight:'~65 kg', dentition:'Intermediate size', skull:'1,250 cc braincase; large face with prominent brow ridge', locomotion:'Fully bipedal' },
    behavior: { socialStructure:'Unknown', toolUse:'Acheulean', communication:'Advanced proto-language', culture:'Deliberate defleshing of skulls (Bodo D\'ar)' },
    conservation: null
  },

  'neanderthal': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. neanderthalensis' },
    genome: { size:'~3.2 Gbp', chromosomes:46, dnaSimHuman:99.7, note:'Full genome sequenced (Vindija Cave, 2010). 1–4% persists in non-African humans.' },
    brain: { volume:[1200,1750], eq:4.8 },
    physical: { height:'164–168 cm', weight:'64–82 kg', dentition:'Large incisors used as tools; taurodont molars', skull:'Elongated braincase (1,200–1,750 cc), occipital bun, mid-facial prognathism, no chin', locomotion:'Bipedal; stocky cold-adapted body with short limbs (Allen\'s rule)' },
    behavior: { socialStructure:'Small family groups (5–15); cared for injured members', toolUse:'Mousterian (Mode 3); hafted stone points, birch-tar glue, personal ornaments', communication:'Complex — FOXP2 speech gene (modern variant); hyoid bone present', culture:'Buried dead (Shanidar, La Chapelle), cave art (65 Kya), eagle talon jewelry, medicinal plants' },
    conservation: null
  },

  'denisovans': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'Denisova hominin (unnamed)' },
    genome: { size:'~3.1 Gbp', chromosomes:46, dnaSimHuman:99.7, note:'Full genome from pinky bone (2010). 3–5% in Melanesian/Aboriginal Australian DNA. EPAS1 high-altitude gene.' },
    brain: { volume:null, eq:null },
    physical: { height:null, weight:null, dentition:'Very large molars (larger than Neanderthal or sapiens)', skull:'Reconstructed from DNA methylation: wide skull, protruding jaw, low forehead', locomotion:'Bipedal (inferred)' },
    behavior: { socialStructure:'Unknown; interbred with both Neanderthals and sapiens', toolUse:'Advanced stone tools, bone points, beads/jewelry', communication:'Likely complex (sister group to Neanderthals)', culture:'Jewelry and beads; high-altitude occupation (Baishiya Cave, 160 Kya)' },
    conservation: null
  },

  'h_naledi': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. naledi' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA recovered from hot humid caves' },
    brain: { volume:[465,610], eq:null },
    physical: { height:'143–150 cm', weight:'39–55 kg', dentition:'Small teeth relative to skull size', skull:'Small braincase (465–610 cc) with surprisingly human-like frontal lobe', locomotion:'Modern feet and legs; curved fingers for climbing' },
    behavior: { socialStructure:'Unknown; deliberate cave deposition suggests social complexity', toolUse:'Possible', communication:'Unknown', culture:'Possible deliberate burial; possible fire use and engravings in cave (2022, debated)' },
    conservation: null
  },

  'h_floresiensis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. floresiensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA recovered' },
    brain: { volume:[380,417], eq:null },
    physical: { height:'~106 cm', weight:'25–30 kg', dentition:'Small teeth; no chin', skull:'Tiny braincase (380–417 cc) — smaller than chimp; no brow ridge', locomotion:'Bipedal; long flat feet, short legs (island dwarfism)' },
    behavior: { socialStructure:'Unknown', toolUse:'Sophisticated stone tools despite tiny brain', communication:'Unknown', culture:'Evidence of fire use; Ebu Gogo folklore may be cultural memory' },
    conservation: null
  },

  'h_luzonensis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. luzonensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA recovered from tropical site' },
    brain: { volume:null, eq:null },
    physical: { height:'~120 cm', weight:'~25 kg', dentition:'Small premolars and molars; unique cusp patterns', skull:'No cranial remains; known from teeth, hand, and foot bones', locomotion:'Curved toe bones (Australopithecus-like); bipedal' },
    behavior: { socialStructure:'Unknown', toolUse:'Stone tools in cave deposits', communication:'Unknown', culture:null },
    conservation: null
  },

  'h_longi': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. longi' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA; protein analysis places near sapiens lineage' },
    brain: { volume:[1420,1420], eq:null },
    physical: { height:'~180 cm', weight:'~70 kg', dentition:'Large but human-like teeth', skull:'1,420 cc; massive but low skull, wide nose, square eye sockets, large brow ridge', locomotion:'Fully bipedal (inferred from skull)' },
    behavior: { socialStructure:'Unknown', toolUse:'Unknown', communication:'Possible', culture:null },
    conservation: null
  },

  // ── ALIASES (for duplicate nodes in HOMININS array) ─

  'h_sapiens': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. sapiens' },
    genome: { size:'3.1 Gbp', chromosomes:46, dnaSimHuman:100, note:'Reference genome (GRCh38). ~20,000 protein-coding genes.' },
    brain: { volume:[1200,1700], eq:7.4 },
    physical: {
      height:'~170 cm avg',
      weight:'~62–80 kg avg',
      dentition:'Small canines, small molars, 3rd molar often vestigial',
      skull:'Globular braincase, prominent chin, high forehead',
      locomotion:'Obligate biped; endurance running adaptation'
    },
    behavior: {
      socialStructure:'Flexible pair-bonding within cooperative groups (Dunbar\'s number ~150)',
      toolUse:'All technology in history',
      communication:'Full recursive syntactic language; ~7,000 living languages',
      culture:'Cumulative culture; agriculture ~12 Kya; writing ~5 Kya; science ~400 years'
    },
    conservation: { iucnStatus:'Least Concern', population:'~8.1 billion', threat:'Self-inflicted existential risks' }
  },

  'homo-naledi': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. naledi' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA recovered' },
    brain: { volume:[465,610], eq:null },
    physical: { height:'~144 cm', weight:'~40 kg', dentition:'Small teeth', skull:'465–610 cc braincase', locomotion:'Modern feet; curved fingers' },
    behavior: { socialStructure:'Unknown', toolUse:'Possible fire use', communication:'Unknown', culture:'Possible deliberate burial' },
    conservation: null
  },

  'homo-floresiensis': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'H. floresiensis' },
    genome: { size:null, chromosomes:null, dnaSimHuman:null, note:'No DNA recovered' },
    brain: { volume:[380,380], eq:null },
    physical: { height:'~106 cm', weight:'~25 kg', dentition:'Small teeth', skull:'380 cc braincase', locomotion:'Bipedal; long flat feet' },
    behavior: { socialStructure:'Unknown', toolUse:'Stone tools', communication:'Unknown', culture:'Fire use evidence' },
    conservation: null
  },

  'denisovan': {
    taxonomy: { kingdom:'Animalia', phylum:'Chordata', class:'Mammalia', order:'Primates', family:'Hominidae', subfamily:'Homininae', tribe:'Hominini', genus:'Homo', species:'Denisova hominin' },
    genome: { size:'~3.1 Gbp', chromosomes:46, dnaSimHuman:99.7, note:'Full genome sequenced. EPAS1 gene gift to Tibetans.' },
    brain: { volume:[1200,1400], eq:null },
    physical: { height:null, weight:null, dentition:'Very large molars', skull:'Wide skull (DNA methylation reconstruction)', locomotion:'Bipedal' },
    behavior: { socialStructure:'Interbred with Neanderthals and sapiens', toolUse:'Advanced stone tools, beads', communication:'Likely complex', culture:'Jewelry; high-altitude living' },
    conservation: null
  }
};
