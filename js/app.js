// ══════════════════════════════════════════════════════
// APP.JS — Entry point module
// Imports all modules, wires dependencies, runs init()
// ══════════════════════════════════════════════════════

// ── State ──
import { state, nodeMap, navStack, animDone, confirmedPhotoUrls, HUMAN_PATH, TAXON_I18N, HOMININ_SKIP_IDS } from './state.js';

// ── Utilities ──
import { reducedMotion, canonicalHomininId, preprocess, sortChildrenByAge, homininToTreeNode } from './utils.js';

// ── Layout ──
import { layout, getVisible } from './layout.js';

// ── Zoom / Pan ──
import { applyT, smoothPanTo, smoothZoomTo, centerOnTree, centerOnRoot, initZoomDeps, initPointerEvents } from './zoom.js';

// ── Renderer ──
import { render, scheduleRender, branchPath, initRendererDeps } from './renderer.js';

// ── Navigation ──
import { currentNavState, pushNav, restoreNavState, navBack, navHome, updateNavButtons, traceLineage, getAncestors, focusNode, updateBreadcrumb, showTip, hideTip, initNavDeps } from './navigation.js';

// ── Search ──
import { buildSearchIndex, searchEntities, normalizeSearchText, patchEnrichment } from './search.js';

// ── Timeline / Era Browser ──
import { nodeInEra, toggleExtinct, toggleDomain, resetDomains, getEraName, buildExtinctionMarkers, showExtinctionPopover, updateEraTint, updateSpeciesCount, updateThumbPosition, updateEraTimeRange, toggleEraPlay, animateSliderTo, updatePresetHighlight, buildEraPresets, buildEraSegments, buildDensitySparkline, initThumbDrag, initSpeedButtons, initTimelineDeps } from './timeline.js';

// ── Panel ──
import { renderPanelContent, showMainPanel, closePanel, openHominins, openHomininView, setHomininOverlayOpener, buildHeroFallback, getBranchType, renderBranchSection, renderMiniMap, renderPrimateCard, initPanelDeps, initPanelListeners } from './panel.js';

// ── Hominin / Compare ──
import { buildHomininTree, showComparePanel, closeCompare, finishCompare, cancelCompare, startCompareFromPanel, interceptShowMainPanel, initHomininDeps, openHomininOverlay, closeHomininOverlay, renderHominins, showHominDetail, toggleCompareMode, viewHomininOnTree, initHomininOverlay } from './hominin.js';

// ── DNA Calculator ──
import { openDnaCalc, closeDnaCalc, resetDnaUI, openDnaSearch, selectDnaSpecies, dnaPreset, showDnaResults, animateCounter, initDnaCalcDeps, initDnaCalcEvents } from './dnaCalc.js';

// ── Evolutionary Path ──
import { openEvoPath, closeEvoPath, openEvoSearch, fillEvoSlot, selectEvoSpecies, evoPreset, computeEvoPath, showEvoOnTree, clearEvoPath, clearEvoHighlight, getEvoFunFact, initEvoPathDeps, initEvoPathEvents } from './evoPath.js';

// ── Unified Game ──
import { openGame, closeGame, initGameEvents, initGameDeps } from './game.js';

// ── Playback ──
import { inferAppeared, enterPlaybackMode, exitPlaybackMode, startPlayback, pausePlayback, togglePlayback, setPlaybackSpeed, resetPlayback, skipToNextEvent, buildPlaybackControls, updatePlaybackControlState, updatePlaybackStates, initPlaybackDeps } from './playback.js';

// ── Theme / i18n ──
import { t, setLang, applyI18n, applyTheme, toggleTheme, initThemeDeps } from './theme.js';

// ── Engagement / UI effects ──
import { showToast, dismissToast, showSpeciesToast, showIdleToast, resetIdleTimer, onUserActivity, a11yAnnounce, spawnParticles, showIntro, animateTreeEntrance, generateSpeciesIllustration, initEngagementDeps, markExplored, isExplored, updateProgressBadge, checkAchievement, trackDomainToggle, trackViewMode, trackExtinctionClick, trackDnaCompare } from './engagement.js';


// ── Data (barrel + direct for niche modules) ──
import { TREE, lightenColor, PHOTO_MAP, FACTS, ImageLoader } from './data.js';
import { expandTree } from './treeExpansion.js';
import { initTourDeps, showTourSelector, startTour, endTour } from './tours.js';
import { initSplash } from './splash.js';
import { ERA_NAMES } from './uiData.js';
import { openSapiens, closeSapiens, initSapiensDeps } from './sapiens.js';

// ── Minimap ──
import { renderMinimap } from './minimap.js';
window._onRenderComplete=renderMinimap;


// ══════════════════════════════════════════════════════
// 1. WIRE LATE-BOUND DEPENDENCIES
// ══════════════════════════════════════════════════════

initRendererDeps({ showMainPanel, showTip, hideTip, smoothPanTo, smoothZoomTo, layout, updateBreadcrumb });
initZoomDeps({ scheduleRender, layout, getVisible });
initNavDeps({ showMainPanel, closePanel, smoothPanTo, smoothZoomTo, scheduleRender, layout, centerOnRoot, applyT, renderPanelContent, closeDnaCalc, closeEvoPath, closeGame });
initTimelineDeps({ scheduleRender, t, togglePlayback, pausePlayback });
initPanelDeps({ pushNav, updateNavButtons, updateBreadcrumb, scheduleRender, smoothPanTo, focusNode, t, generateSpeciesIllustration, navBack, layout, applyT, centerOnRoot, openSapiens });
initSapiensDeps({ pushNav, navBack, showMainPanel, t, scheduleRender, smoothPanTo });
initHomininDeps({ scheduleRender, showMainPanel, renderPanelContent, t });
setHomininOverlayOpener(openHomininOverlay);
initDnaCalcDeps({ searchEntities, t, showMainPanel });
initEvoPathDeps({ searchEntities, t, scheduleRender, smoothPanTo, layout, applyT });
initGameDeps({ t, navigateTo: (...args) => navigateTo(...args) });
initPlaybackDeps({ layout, centerOnTree, scheduleRender, applyT, buildEraPresets, getEraName, updateEraTint, updateSpeciesCount, t });
initThemeDeps({ buildEraPresets, buildExtinctionMarkers, buildEraSegments, updateSpeciesCount, buildDensitySparkline, scheduleRender });
initEngagementDeps({ t, navigateTo: (...args) => navigateTo(...args), showMainPanel });


// ══════════════════════════════════════════════════════
// 2. STARTUP CODE (runs at module load time)
// ══════════════════════════════════════════════════════

// Register PHOTO_MAP (from speciesData.js) with ImageLoader for tree node rendering
if(ImageLoader&&PHOTO_MAP&&ImageLoader.registerPhotoMap){
  ImageLoader.registerPhotoMap(PHOTO_MAP);
}

// Build hominin subtree
buildHomininTree();

// Expand tree (adds ~200 species with IUCN data)
expandTree(TREE, lightenColor);

// Preprocess tree
preprocess(TREE);
sortChildrenByAge(TREE);

// Patch enrichment data into the nodeMap
patchEnrichment();

// Patch funFact onto treeExpansion.js nodes that lack it (these nodes are added at runtime without funFact)
(function patchFunFacts(){
  const ff={
    'lion':'A lion\'s roar reaches 114 decibels and can be heard 8 km away — it\'s not just territorial, it\'s a precise social signal that allows individuals to count and locate their pride mates in the dark.',
    'tiger':'Tiger stripes are not just on their fur — their skin is striped too. No two tigers have the same pattern, making stripes as unique as human fingerprints.',
    'polar-bear':'Polar bear fur is not white — it\'s transparent and hollow. Each hair is a fiber-optic strand that funnels ultraviolet light to the black skin beneath, which absorbs heat.',
    'giant-panda':'Giant pandas have a "false thumb" — an enlarged radial sesamoid bone that acts as a sixth digit, evolved specifically for gripping bamboo. It\'s convergent evolution with the red panda\'s identical solution.',
    'snow-leopard':'Snow leopards cannot roar — the hyoid bone in their throat is not fully ossified. Instead, they communicate with chuffs, wails, and a unique "prusten" puffing sound also used by tigers.',
    'red-panda':'The red panda was classified in its own family for over 100 years before DNA analysis settled the debate — it is the sole living member of Ailuridae, more closely related to weasels than to giant pandas.',
    'pangolin':'Pangolins are the world\'s most trafficked mammal — over a million were taken from the wild in the last decade. Their scales are pure keratin, identical in composition to human fingernails.',
    'red-kangaroo':'Female red kangaroos can pause a pregnancy — a fertilized embryo enters dormancy while the pouch is occupied, resuming development only after the joey leaves. Two joeys at different stages can nurse simultaneously.',
    'koala':'Koalas have fingerprints nearly indistinguishable from human fingerprints — independently evolved, they have fooled crime scene investigators. They sleep 20 hours a day to process toxic eucalyptus leaves.',
    'moose':'A moose\'s antlers can grow 2.5 cm per day — the fastest-growing tissue of any animal on Earth. They are shed and regrown annually, requiring more calcium than the entire skeleton contains.',
    'humpback-whale':'Humpback whale songs evolve like cultural fads — a new song style that appears in one ocean population is adopted across thousands of miles within two years, spreading from group to group like a hit record.',
    'narwhal':'The narwhal\'s tusk is a tooth — specifically the left upper canine grown through the upper lip. It contains 10 million nerve endings and may be a sensory organ that detects salinity and temperature.',
    'wolverine':'The wolverine has a superpower: a unique mucous membrane that lets it eat frozen carrion. It has been documented driving grizzly bears from kills three times its size through sheer ferocity.',
    'hippopotamus':'Hippos secrete a red oily substance from their skin that acts as sunscreen, antiseptic, and moisturizer simultaneously — it is sometimes called "blood sweat" though it contains none of either.',
    'bald-eagle':'Bald eagles were removed from the US Endangered Species List in 2007 after recovering from fewer than 500 breeding pairs in 1963 to over 9,800 today — one of conservation\'s greatest success stories.',
    'condor':'California condors became extinct in the wild in 1987 — every living bird was captured. Through captive breeding, there are now 500+ birds including 300 in the wild, a conservation resurrection.',
    'flamingo':'Flamingos are not born pink — their color comes entirely from carotenoid pigments in the algae and crustaceans they eat. A flamingo fed a colorless diet turns white within months.',
    'barn-owl':'Barn owls can locate prey in total darkness by sound alone — their facial disc acts as a parabolic dish, and their asymmetrically placed ears triangulate sound in three dimensions.',
    'cassowary':'The cassowary\'s casque is hollow and may function as a low-frequency amplifier — some researchers think it allows cassowaries to communicate in sounds too low for humans to hear.',
    'hammerhead-shark':'The hammerhead\'s wide-set eyes give it 360-degree vertical vision — it can see above and below simultaneously, but has a blind spot directly in front of its nose.',
    'chameleon':'Chameleons do not change color for camouflage — they change color to communicate mood and social status. The skin contains crystalline nanostructures that shift light reflection based on emotion.',
    'tardigrade':'Tardigrades can survive in the vacuum of space, temperatures from -272°C to 150°C, radiation doses 1,000x lethal to humans, and pressures six times the deepest ocean. They enter cryptobiosis — virtual suspended animation.',
    'firefly':'Firefly light is the most efficient light ever measured — nearly 100% of the energy becomes light with almost no heat. LED engineers have used firefly lantern geometry to improve LED efficiency by 50%.',
    'atlas-moth':'The atlas moth has no mouth — it cannot eat. It survives its entire adult life on fat reserves from its caterpillar stage, living only 1-2 weeks solely to reproduce.',
    'army-ant':'Army ant colonies are a superorganism — 700,000 individuals with no queen directing behavior. Complex collective intelligence emerges from simple rules followed by each ant, including building living bridges from their own bodies.',
    'japanese-spider-crab':'The Japanese spider crab has the largest leg span of any arthropod — up to 3.7 meters. Despite their fearsome appearance, they are gentle omnivores that can live over 100 years.',
    'garden-spider':'The garden spider rebuilds its entire web every single day — consuming the old silk to recycle proteins, then spinning a new geometrically perfect orb in under an hour.',
    'hermit-crab':'Hermit crabs hold "vacancy chains" — when a new large shell arrives on the beach, crabs line up by size, then swap shells simultaneously in a coordinated chain, each one upgrading to the shell vacated by the crab ahead of it.',
    'water-lily':'The giant water lily\'s leaf is a feat of structural engineering — a network of air-filled ribs on the underside distributes weight so evenly that a single leaf can support a human child.',
    'orchid':'Orchids represent the most extreme evolutionary deception in nature — some species mimic female insects in both appearance and pheromone scent so precisely that male insects attempt to mate with them, inadvertently pollinating the flower.',
    'bamboo':'Bamboo can grow 91 cm in a single day — the fastest growth of any plant on Earth. Some species flower only once every 120 years, then die simultaneously across entire forests.',
    'cactus':'The saguaro cactus grows only 2.5 cm in its first decade of life but can live 200 years and store 750 liters of water in its accordion-like ribs after a single rainfall.',
    'sundew':'The sundew\'s sticky tentacles move with detectable speed — a tentacle can curve around an insect in 10 seconds. The plant distinguishes food from debris: it ignores sand grains but responds to nitrogen-containing compounds.',
    'cordyceps':'Cordyceps fungi are mind-controlling parasites — they infect ants, alter their behavior to climb to a precise height, force them to bite a leaf vein, then erupt through the skull. Each species targets a single host.',
    'truffle':'Truffles cannot reproduce without animals — they grow entirely underground and rely on being eaten and their spores dispersed. They evolved an extraordinary smell to attract the mammals that dig them up.',
    'lichen':'Lichen is not one organism but a symbiosis of fungus and algae — and recent research found a third partner, a yeast. They are the first colonizers of bare rock, creating soil that makes all terrestrial life possible.',
    'chanterelle':'Chanterelles form mycorrhizal networks with tree roots that can span entire forests — they trade minerals the tree cannot access for sugars the fungus cannot photosynthesize. The network transfers nutrients between trees.',
    'euglena':'Euglena is the organism that broke the animal-plant divide — it photosynthesizes in light and hunts for food in darkness, forcing 19th-century scientists to create an entirely new kingdom of life to classify it.',
    'radiolarian':'Radiolarian skeletons are geometric perfection on a microscopic scale — intricate silica lattices that inspired architect Buckminster Fuller\'s geodesic dome. They have been building the same structures for 540 million years.',
    'slime-mold':'Slime molds can solve mazes and optimize transport networks without a brain or nervous system. When grown on a map with food at major cities, they recreate the Tokyo rail network — the result of millions of years of trial and error.',
    'stentor':'Stentor can regenerate an entirely new organism from a fragment 1/27th of its original volume — the smallest piece that can rebuild a complete functional cell of any known organism.',
    'african-wild-dog':'African wild dogs have the highest hunting success rate of any large predator — 80%, compared to 25% for lions. They vote on group decisions by sneezing: enough sneezes and the pack moves.',
    'armadillo':'Nine-banded armadillos always give birth to genetically identical quadruplets — the fertilized egg splits into four every single time. They can also hold their breath for up to 6 minutes to walk along river bottoms.',
    'aye-aye':'The aye-aye taps on tree bark up to 8 times per second, using echolocation-like perception through its skeletal middle finger to detect hollow cavities where grubs hide — the only primate to use this sonar-like foraging technique.',
    'beaver':'A beaver\'s teeth are orange because they contain iron — the enamel is reinforced with iron compounds that make it stronger than human teeth and self-sharpening, since the softer back wears faster than the hard front.',
    'capybara':'Capybaras are so socially tolerant that birds, monkeys, and even caimans rest on top of them unbothered. They are obligate coprophages — they must eat their own feces each morning to digest the cellulose from the previous day.',
    'cheetah':'Cheetahs accelerate from 0 to 100 km/h in 3 seconds — faster than most supercars — but overheat so quickly that they must cool down for 30 minutes after a sprint, during which they are too exhausted to defend their kill.',
    'dolphin':'Dolphins sleep with one eye open — literally. Only one brain hemisphere sleeps at a time, while the other stays alert for predators and controls breathing. They switch sides every two hours throughout the night.',
    'dugong':'Dugongs are the only strictly marine herbivorous mammal, grazing on seagrass meadows like underwater cows. Ancient sailors likely mistook them for mermaids — their nursing behavior, cradling calves at the surface, fueled the myth.',
    'echidna':'Echidnas are one of only five egg-laying mammals on Earth. They have no nipples — milk oozes through patches of skin, and the puggle laps it up. Their body temperature of 32°C is the lowest of any mammal.',
    'elephant-seal':'Male elephant seals can hold their breath for over 2 hours and dive to 1,750 meters — deeper than most military submarines. They spend 80% of their lives underwater, sleeping in brief 10-minute naps during descent.',
    'gibbon':'Gibbons are the fastest non-flying arboreal mammals, brachiating through trees at up to 55 km/h with 15-meter leaps. They are also the only apes that form lifelong monogamous pair bonds and sing elaborate duets at dawn.',
    'giraffe':'A giraffe\'s heart weighs 11 kg and generates blood pressure twice that of humans — without it, blood could never reach the brain 2 meters above the heart. Special valves in the neck prevent blackouts when they bend to drink.',
    'hedgehog':'Hedgehogs practice "self-anointing" — when they encounter a new smell, they chew the source into a frothy paste and spread it over their spines with their tongue. Scientists still don\'t fully understand why.',
    'jaguar':'The jaguar has the strongest bite force relative to size of any big cat — 1,500 PSI, strong enough to crack a sea turtle\'s shell or pierce a caiman skull. Unlike other cats, it kills by biting directly through the temporal bones of the brain.',
    'manatee':'Manatees constantly replace their teeth — new molars grow at the back of the jaw and migrate forward like a conveyor belt, pushing worn teeth out the front. They share this "marching molars" trait with elephants, their closest relative.',
    'meerkat':'Meerkat sentinels produce different alarm calls for aerial versus ground predators — each call triggers a specific escape response. Pups learn these calls through deliberate teaching: adults bring them progressively more dangerous live prey.',
    'okapi':'The okapi was unknown to Western science until 1901, making it one of the last large mammals discovered. Its tongue is 35 cm long and prehensile enough to wash its own eyelids and clean inside its ears.',
    'sea-otter':'Sea otters have the densest fur of any mammal — up to 1 million hairs per square inch, compared to about 100,000 on an entire human head. They have a favorite rock they keep in a skin pouch under their arm for cracking shellfish.',
    'spotted-hyena':'Spotted hyenas have the strongest bite force of any mammal relative to body size — 1,100 PSI — and their stomach acid is so potent it dissolves bone completely. Their clans are matriarchal, with females outranking all males.',
    'vampire-bat':'Vampire bats are the only mammals that survive entirely on blood. They share meals with hungry roostmates by regurgitating blood — and remember which individuals returned the favor, forming reciprocal altruism networks tracked over years.',
    'walrus':'A walrus\'s tusks never stop growing and can reach 1 meter long. They use them as ice picks to haul their 1,400 kg body onto ice floes — the genus name Odobenus literally means "one who walks with teeth."',
    'white-rhinoceros':'The white rhino\'s name has nothing to do with color — it comes from the Dutch "wijd" meaning "wide," describing its flat, wide mouth adapted for grazing. Its horn is not bone but compressed keratin, the same protein as human hair.',
    'wolf':'Wolves can detect scent from nearly 3 km away and distinguish between 200 million different odors. A pack\'s howl contains individual voice signatures — researchers can identify specific wolves from recordings alone.',
    'wombat':'Wombats produce cube-shaped droppings — the only animal known to do so. The cubes are formed by varying elasticity in the intestinal wall and don\'t roll off the rocks and logs where wombats stack them as territorial markers.',
    'birds':'Birds are living dinosaurs — every sparrow, eagle, and penguin is a direct descendant of theropod dinosaurs that survived the K-Pg extinction 66 million years ago.',
    'archaeopteryx':'Archaeopteryx is the most famous transitional fossil in history — a 150-million-year-old creature with the feathered wings of a bird, the teeth and bony tail of a dinosaur, and claws on its wings.',
    'peregrine-falcon':'The peregrine falcon is the fastest animal on Earth — reaching 389 km/h in a hunting dive (stoop), faster than a Formula 1 car at top speed. Special baffles in its nostrils prevent its lungs from bursting at speed.',
    'emperor-penguin':'Emperor penguins endure the harshest breeding conditions of any bird — males incubate eggs for 65 days in -60°C Antarctic winters without eating, huddling in groups and rotating to share warmth.',
    'hummingbird':'Hummingbirds are the only birds that can fly backwards. Their hearts beat up to 1,260 times per minute and they visit 1,000-2,000 flowers daily, yet they enter torpor each night to survive — dropping their heart rate to 50 bpm.',
    'african-grey-parrot':'African grey parrots have the cognitive ability of a 4-6 year old human child. Alex, the most famous, learned over 100 English words and could identify colors, shapes, and quantities — and his last words were "You be good. I love you."',
    'wandering-albatross':'The wandering albatross has the longest wingspan of any living bird — 3.5 meters — and can fly 120,000 km per year without flapping, using a technique called dynamic soaring to harvest wind energy.',
    'bee-hummingbird':'The bee hummingbird is the smallest bird and smallest warm-blooded animal on Earth — at 5.5 cm and 1.8 grams, it weighs less than a US penny and lays eggs the size of coffee beans.',
    'new-caledonian-crow':'New Caledonian crows are the only non-primate species that manufactures tools from raw materials — they carve hooks from twigs and fashion barbed probes from pandanus leaves, with designs passed between generations.',
    'ostrich':'The ostrich is the largest living bird — up to 2.7 m tall and 156 kg — with the largest eyes of any land animal (5 cm across, larger than its brain). A single kick can kill a lion.',
    'kiwi':'Kiwis are the only birds with nostrils at the tip of their beak, giving them the best sense of smell of any bird. They are essentially nocturnal, flightless, whisker-bearing mammals that happen to be birds.',
    'secretary-bird':'The secretary bird kills venomous snakes by stamping on them with a force five times its body weight — delivering kicks with 195 newtons in just 15 milliseconds, faster than the blink of an eye.',
    'toucan':'A toucan\'s bill can be one-third of its body length yet weighs almost nothing — it\'s a honeycomb of keratin and bone filled with air. The bill acts as a thermoregulator, flushing with blood to dump excess body heat.',
    'pelican':'A pelican\'s throat pouch can hold up to 11 liters of water — three times more than its stomach. They fish cooperatively, herding fish into shallows in a synchronized crescent formation.',
    'woodpecker':'Woodpeckers hammer at 20 strikes per second with a deceleration force of 1,200 g — yet never get concussions. A spongy bone behind the bill and a tongue that wraps around the skull absorb the impact.',
    'swift':'Common swifts can stay airborne for 10 months straight without landing — they eat, sleep, and mate on the wing. They are among the fastest birds in level flight, reaching 110 km/h.',
    'lyrebird':'The superb lyrebird can mimic virtually any sound it hears — chainsaws, camera shutters, car alarms, other bird species, and even human speech — with such accuracy that other species are fooled.',
    'hoatzin':'The hoatzin is the only bird that digests food by fermentation, like a cow. Its crop is so large it compresses the flight muscles, making it one of the poorest fliers of any bird. Chicks have clawed wings for climbing.',
    'arctic-tern':'The Arctic tern sees more daylight than any other animal — it migrates from Arctic to Antarctic and back each year, covering 70,000 km, experiencing two summers and perpetual light.',
    'harpy-eagle':'The harpy eagle has the largest talons of any living eagle — 13 cm long, the size of grizzly bear claws — and enough grip strength (530 PSI) to crush the bones of a howler monkey in flight.',
    'shoebill':'The shoebill can stand motionless for hours before striking with a bill powerful enough to decapitate a lungfish. Its bill-clattering display sounds like machine-gun fire and can be heard 100 meters away.',
    'superb-fairywren':'Male superb fairywrens pluck yellow petals and present them to females as courtship gifts — one of the only known examples of non-food gift-giving in birds.',
    'komodo-dragon':'Komodo dragons kill with a venomous bite — glands in their lower jaw deliver toxins that prevent blood clotting and drop blood pressure, causing prey to go into shock within minutes.',
    'tuatara':'The tuatara is the sole surviving member of an order that thrived 200 million years ago alongside the dinosaurs. It has a vestigial "third eye" on top of its head with a lens and retina — functional only in juveniles.',
    'green-sea-turtle':'Green sea turtles navigate thousands of kilometers across open ocean to return to the exact beach where they hatched — using Earth\'s magnetic field as an internal GPS that they imprint at birth.',
    'king-cobra':'The king cobra is the longest venomous snake on Earth at up to 5.5 meters — and it\'s the only snake that builds a nest for its eggs, guarding them fiercely for 60-90 days.',
    'saltwater-crocodile':'The saltwater crocodile has the strongest bite force ever measured in any living animal — 3,700 PSI, enough to crush a turtle shell or a boat hull. Yet it cannot chew; it must tear and swallow.',
    'anaconda':'The green anaconda is the heaviest snake on Earth — up to 250 kg and 9 meters — it kills by constriction, squeezing with enough force to stop a prey animal\'s heart between beats.',
    'gecko':'Geckos walk on ceilings using millions of microscopic hair-like structures (setae) on their toe pads that exploit van der Waals forces — each foot generates enough adhesion to support 130 kg.',
    'python':'Burmese pythons can swallow prey five times wider than their head — their jaw bones are connected by elastic ligaments, not fused, allowing the mouth to stretch to extraordinary proportions.',
    'iguana':'Marine iguanas in the Galápagos are the only lizards that forage in the sea — they dive up to 12 meters to graze on algae, then bask on rocks to rewarm, sneezing crystallized salt from nasal glands.',
    'leatherback-turtle':'The leatherback is the largest living turtle — up to 900 kg and 2 meters — and dives deeper than 1,200 meters, nearly as deep as a sperm whale. It has survived virtually unchanged for 100 million years.',
    'golden-poison-frog':'One golden poison frog carries enough batrachotoxin to kill 10 adult humans — yet it is harmless in captivity, because its toxin is derived entirely from the ants and beetles it eats in the wild.',
    'axolotl':'The axolotl can regenerate entire limbs, spinal cord, heart tissue, and parts of its brain — making it the most regenerative vertebrate known to science. It never metamorphoses, remaining aquatic and gilled for life.',
    'chinese-giant-salamander':'The Chinese giant salamander can reach 1.8 meters — the largest living amphibian — and has remained essentially unchanged for 170 million years. It detects prey through vibrations in the water.',
    'giant-salamander':'Japanese giant salamanders can live over 80 years and remain virtually unchanged from 30-million-year-old fossils. Called "living fossils," they breathe almost entirely through their wrinkled skin.',
    'red-eyed-tree-frog':'Red-eyed tree frog embryos can detect vibrations from approaching snakes and hatch prematurely — escaping the egg days early and dropping into water below to survive.',
    'coelacanth':'The coelacanth was thought extinct for 66 million years until a living specimen was caught off South Africa in 1938 — the most famous "living fossil" in biology. Its lobe fins move in an alternating pattern eerily similar to four-legged walking.',
    'shark':'Sharks predate trees. Their lineage has persisted for 450 million years — surviving all five mass extinctions — yet humans kill roughly 100 million sharks per year, pushing many species toward extinction.',
    'clownfish':'All clownfish are born male. The dominant individual in a group becomes female; if she dies, the next-ranking male changes sex to replace her — a sequential hermaphroditism governed by social hierarchy.',
    'anglerfish':'In deep-sea anglerfish, the tiny male fuses permanently to the female — his body dissolves until he is nothing but a pair of gonads supplying sperm on demand. Up to 8 males can merge with one female.',
    'seahorse':'Seahorse males get pregnant — the female deposits eggs into the male\'s brood pouch, where he fertilizes and incubates them for 2-4 weeks before giving birth to up to 2,000 tiny seahorses in a single labor.',
    'manta-ray':'Manta rays have the largest brain-to-body ratio of any cold-blooded fish and are one of the few fish species that can recognize themselves in mirrors — passing the "mirror test" that most mammals fail.',
    'pufferfish':'Pufferfish contain tetrodotoxin — 1,200 times more poisonous than cyanide — yet in Japan, specially licensed chefs prepare fugu as a delicacy. The toxin paralyzes muscles while the victim remains fully conscious.',
    'whale-shark':'The whale shark is the largest fish on Earth — up to 18 meters and 20 tonnes — yet feeds exclusively on plankton, filtering 6,000 liters of water per hour through its 1.5-meter-wide mouth.',
    'electric-eel':'Electric eels are not actually eels — they\'re knifefish related to catfish. They generate 860-volt shocks using three specialized electric organs that make up 80% of their body.',
    'piranha':'Piranhas are more often prey than predator — they are a key food source for caimans, river dolphins, and herons. Their fearsome reputation was largely invented by Theodore Roosevelt after a staged demonstration in 1913.',
    'mola-mola':'The ocean sunfish (mola mola) is the heaviest bony fish on Earth — up to 2,300 kg — yet it starts life as a tiny 2.5 mm larva, growing 60 million times its birth size.',
    'salmon':'Pacific salmon undergo one of the most dramatic transformations in nature — their bodies literally disintegrate as they swim upstream to spawn, their flesh turning from silver to red as they redirect all energy to reproduction, then die.',
    'flying-fish':'Flying fish don\'t actually fly — they launch themselves at 60 km/h and glide on enlarged pectoral fins for distances up to 200 meters, staying airborne for 45 seconds. Their tail beats 70 times per second during takeoff.',
    'tuna':'Bluefin tuna are warm-blooded fish — they maintain body temperature 10-20°C above surrounding water using countercurrent heat exchangers, enabling bursts up to 75 km/h, among the fastest in the ocean.',
    'swordfish':'The swordfish\'s bill is not used for spearing — it slashes through schools of fish at speeds up to 100 km/h, stunning or killing multiple prey. A special organ behind the eyes heats the brain and eyes by up to 15°C for sharper vision in cold deep water.',
    'mudskipper':'Mudskippers are fish that spend up to 90% of their time on land — they breathe through their skin and the lining of their mouth, walk on modified pectoral fins, and can even climb trees.',
    'blobfish':'The blobfish looks perfectly normal in its deep-sea habitat at 600-1,200 m — the famous droopy face is caused by decompression damage when hauled to the surface, where the lack of pressure causes its gelatinous body to collapse.',
    'arapaima':'The arapaima is one of the largest freshwater fish on Earth — up to 3 meters and 200 kg — and it breathes air, surfacing every 10-20 minutes with a distinctive gulp. Its tongue is bony and covered in teeth.',
    'invertebrates':'Invertebrates make up 97% of all known animal species — over 1.3 million described so far — yet they were lumped into a single category by Lamarck in 1801 as simply "animals without backbones."',
    'arthropoda':'Arthropods are the most successful animal phylum in Earth\'s history — they account for over 80% of all known living animal species, with an estimated 10 quintillion individuals alive at any moment.',
    'insects':'Insects outnumber humans 1.4 billion to one. Their combined biomass exceeds that of all humans by a factor of 17, and they pollinate 75% of the world\'s food crops.',
    'honey-bee':'A single honeybee produces only 1/12th of a teaspoon of honey in its entire lifetime. To make one pound, a colony flies a cumulative distance equal to twice around the Earth.',
    'monarch-butterfly':'Monarch butterflies migrate up to 4,800 km from Canada to a single mountain forest in Mexico — yet no individual makes the round trip. It takes four generations to complete the cycle.',
    'leafcutter-ant':'Leafcutter ants don\'t eat the leaves they carry — they use them to cultivate fungus gardens underground, making them the world\'s first farmers, practicing agriculture 50 million years before humans.',
    'dragonfly':'Dragonflies are the most efficient hunters on Earth — they catch 95% of the prey they pursue, compared to 25% for lions. Their four wings operate independently, enabling hovering, backward flight, and instant direction changes.',
    'horseshoe-crab':'Horseshoe crabs predate the dinosaurs by 200 million years and have remained virtually unchanged for 450 million years. Their blue copper-based blood is used to test every injectable drug and vaccine for bacterial contamination.',
    'mantis-shrimp':'The mantis shrimp strikes with the fastest punch in the animal kingdom — accelerating its club at 23 m/s, generating a force of 1,500 newtons. The impact creates cavitation bubbles that produce a second shockwave of light and heat.',
    'mollusca':'Mollusks are the second-largest animal phylum, with over 85,000 living species ranging from 1 mm snails to 13-meter giant squid. They invented the camera eye independently from vertebrates at least twice.',
    'mollusks':'The mollusk body plan is one of nature\'s most versatile — from sessile clams to jet-propelled squid, from microscopic sea slugs to the 250 kg giant clam, all built on the same basic mantle-foot-visceral mass blueprint.',
    'octopus':'Octopuses have three hearts, blue blood, and 500 million neurons — two-thirds of which are in their arms, meaning each arm can "think" independently. They also edit their own RNA at rates unseen in any other animal.',
    'nautilus':'The nautilus has survived five mass extinctions over 500 million years with virtually no change to its shell design. It controls buoyancy by pumping gas and fluid through its chambered shell — the same principle used in submarines.',
    'giant-squid':'The giant squid has the largest eyes in the animal kingdom — up to 27 cm across, the size of a dinner plate. These enormous eyes evolved specifically to detect the bioluminescent disturbance of approaching sperm whales in the deep.',
    'turritopsis':'Turritopsis dohrnii, the "immortal jellyfish," can revert from its adult medusa stage back to a juvenile polyp when stressed — effectively resetting its biological clock. It is the only known animal capable of true biological immortality.',
    'coral':'Coral reefs cover less than 0.1% of the ocean floor yet support 25% of all marine species. Individual coral polyps are tiny animals, each only 1-3 mm, that build the largest biological structures on Earth visible from space.',
    'common-starfish':'Starfish have no brain and no blood — they use a water vascular system for movement and pump seawater through their bodies instead of blood. They can regenerate an entire body from a single severed arm.',
    'common-earthworm':'A single acre of healthy soil contains up to 1 million earthworms that process 10-18 tonnes of soil per year. Darwin spent 39 years studying them and concluded they are "the most important creatures in the history of the world."',
    'platyhelminthes':'Flatworms are the simplest animals with bilateral symmetry and a true brain. Some planarian species can be trained, then cut in half — and both halves retain the learned behavior, suggesting memory is stored throughout the body.',
    'planarian':'A planarian can be cut into 279 pieces and each piece will regenerate into a complete worm. They are essentially immortal through regeneration and show no signs of aging even after being maintained in labs for decades.',
    'tardigrada':'The phylum Tardigrada contains over 1,300 known species found in every environment on Earth — from Himalayan peaks to deep ocean trenches. In 2019, a spacecraft crashed on the Moon carrying thousands of tardigrades, which may have survived.',
    'chordata':'Chordates — animals with a notochord — include all vertebrates but began as soft-bodied marine filter feeders. The 540-million-year-old Pikaia from the Burgess Shale is among the earliest known, a 5 cm worm-like creature ancestral to every fish, reptile, bird, and mammal.',
    'sponges':'Sponges are the oldest animal phylum — they have no organs, no nervous system, and no muscles, yet they\'ve thrived for 600 million years. If you push a living sponge through a sieve, the separated cells will reaggregate into a new sponge.',
    'glass-sponge':'Glass sponges build skeletons from silica fibers that transmit light as efficiently as commercial fiber-optic cables. Engineers study their lattice structure — it achieves greater strength with less material than any human-designed framework.',
    'barrel-sponge':'Barrel sponges can live over 2,000 years, making them among the longest-lived animals on Earth. A single large specimen filters its own volume of seawater every 5 seconds — up to 50,000 liters per day.',
    'giant-clam':'Giant clams can weigh over 200 kg and live for 100+ years. They farm symbiotic algae inside their mantle tissue and have evolved iridescent cells that act as tiny lenses, focusing light onto their algal gardens.',
    'cone-snail':'Cone snails fire a hollow, harpoon-like tooth loaded with venom containing up to 200 different peptides. One species can kill a human in minutes, yet these toxins have yielded a painkiller 1,000 times more potent than morphine.',
    'portuguese-man-o-war':'The Portuguese man-o-war is not a jellyfish — it\'s a colonial organism made of four types of specialized polyps so interdependent that none can survive alone. Its tentacles can trail 50 meters and still sting weeks after being detached.',
    'hercules-beetle':'The Hercules beetle is the longest beetle on Earth — up to 17 cm including its horn — and can lift 850 times its own body weight, making it one of the strongest animals relative to size ever measured.',
    'mosquito':'Mosquitoes have killed more humans than all wars combined — an estimated 52 billion people throughout history, roughly half of all humans who have ever lived. Only females bite, requiring blood protein to produce eggs.',
    'praying-mantis':'The praying mantis is the only insect that can turn its head 180 degrees to look over its shoulder. It has a single ear in the middle of its chest, tuned specifically to detect the echolocation calls of hunting bats.',
    'cockroach':'Cockroaches can survive for a week without their head — they breathe through spiracles on their body and only die from dehydration. They have existed for 320 million years, predating the dinosaurs by 150 million years.',
    'golden-orb-spider':'Golden orb-weaver silk is five times stronger than steel by weight and more elastic than nylon. Their webs can span up to 2 meters and are strong enough to catch small birds — fishermen in the Indo-Pacific use them as fishing nets.',
    'emperor-scorpion':'Emperor scorpions glow bright blue-green under ultraviolet light due to fluorescent compounds in their exoskeleton. Despite their fearsome 20 cm size, their venom is relatively mild — roughly equivalent to a bee sting.',
    'lobster':'Lobsters don\'t age in the conventional sense — they show no measurable decline in strength, metabolism, or reproductive ability as they grow older. They can live over 100 years and continue growing throughout their lives.',
    'stick-insect':'The Chan\'s megastick from Borneo is the longest insect on Earth at 56.7 cm — longer than a human forearm. Stick insects have perfected camouflage for 126 million years; some species even produce eggs that mimic plant seeds.',
    'bumblebee':'According to simplified aerodynamics, bumblebees shouldn\'t be able to fly — their wings are too small for their body mass. They solve this by rotating their wings in a figure-eight pattern, creating tiny vortices that generate extra lift.',
    'termite':'Termite mounds are the largest structures built by any non-human animal — up to 9 meters tall, with ventilation systems that maintain constant temperature and humidity. Some mounds in Brazil are 4,000 years old and visible from space.',
    'cicada':'Periodical cicadas spend 13 or 17 years underground — both prime numbers — then emerge simultaneously in billions. The prime-number cycle is thought to prevent predators from synchronizing their own population booms.',
    'dung-beetle':'Dung beetles are the only known non-human animals that navigate by the Milky Way. They roll their dung balls in perfectly straight lines by orienting to the band of light from our galaxy.',
    'crown-of-thorns':'A single crown-of-thorns starfish can consume up to 10 square meters of coral per year. During population outbreaks, they are one of the greatest threats to the Great Barrier Reef — second only to coral bleaching.',
    'earthworm':'Earthworms possess five pairs of aortic arches that function as hearts, pumping blood through a closed circulatory system. They can consume their own body weight in organic matter daily and are responsible for turning over 25 tonnes of soil per acre per year.',
    'giant-tube-worm':'Giant tube worms live at hydrothermal vents 2,400 meters deep, thriving at temperatures up to 80°C with no sunlight. They have no mouth, no stomach, and no gut — instead, billions of chemosynthetic bacteria inside them convert hydrogen sulfide into food.',
    'leaf-insect':'Leaf insects have evolved such precise plant mimicry that their bodies feature fake leaf veins, bite marks, and brown decay spots. They even sway gently when they walk, perfectly imitating a leaf rustling in the breeze.',
    'leech':'Medicinal leeches inject a cocktail of 100+ bioactive compounds including hirudin, the most potent natural anticoagulant known. They are FDA-approved medical devices, used in modern microsurgery to relieve venous congestion after reattachment procedures.',
    'feather-star':'Feather stars are free-swimming relatives of sea lilies that have existed for 200 million years. They can detach from surfaces and swim through open water by rhythmically waving their feathery arms — an eerily graceful movement unlike any other marine animal.',
    'nematodes':'Nematodes are the most abundant multicellular animals on Earth — an estimated 57 billion per human. Four out of every five animals on the planet is a nematode, and they inhabit every ecosystem from Arctic ice to deep-sea trenches.',
    'c-elegans':'C. elegans was the first multicellular organism to have its entire genome sequenced and every cell mapped — exactly 959 cells in an adult. It is the only animal whose complete neural wiring diagram (302 neurons, 7,000 connections) has been fully documented.',
    'thermus-aquaticus':'Thermus aquaticus lives in near-boiling hot springs and donated the Taq polymerase enzyme that makes PCR possible — the technique behind every COVID test, crime scene DNA analysis, and paternity test on Earth.',
    'borrelia':'Borrelia burgdorferi, the Lyme disease spirochete, has one of the most complex genomes of any bacterium — a linear chromosome plus 21 plasmids — and can evade the immune system for years by constantly reshuffling its surface proteins.',
    'treponema':'Treponema pallidum, the cause of syphilis, cannot be grown in a lab dish to this day — after over a century of trying. It has the smallest genome of any spirochete, having discarded genes for nearly all metabolic functions.',
    'rhizobium':'Rhizobium bacteria fix 40 million tonnes of atmospheric nitrogen per year inside plant root nodules — more than all industrial fertilizer factories combined — feeding roughly half the world\'s population indirectly.',
    'wolbachia':'Wolbachia infects an estimated 60% of all insect species on Earth — over 1 million species — and can manipulate host reproduction so effectively it has been called the most successful parasite in the history of life.',
    'staphylococcus':'Staphylococcus aureus lives harmlessly on the skin of 30% of all humans, but MRSA strains resist nearly every antibiotic — a single gene transfer event in 1961 launched one of medicine\'s most dangerous superbugs.',
    'spirulina':'Spirulina contains up to 70% protein by dry weight — more than any other natural food — and NASA has studied it as a primary food source for long-duration space missions.',
    'campylobacter':'Campylobacter is the most common bacterial cause of food poisoning worldwide, infecting over 1 million Americans annually — yet it was not recognized as a human pathogen until 1972.',
    'aliivibrio':'Aliivibrio fischeri produces bioluminescence inside the Hawaiian bobtail squid, which uses the glow to eliminate its shadow and hide from predators below — one of the best-studied symbioses in biology.',
    'thermococcus':'Thermococcus kodakarensis thrives at 95°C near deep-sea hydrothermal vents and is one of the few archaea with a complete genetic toolkit, making it the go-to model organism for archaeal molecular biology.',
    'haloquadratum':'Haloquadratum walsbyi is the only known organism shaped like a flat square — paper-thin cells that tile together like postage stamps in salt lakes, maximizing surface area for light absorption.',
    'nanoarchaeum':'Nanoarchaeum equitans has the smallest cellular genome of any organism — just 490,885 base pairs — and cannot survive without physically attaching to another archaeon, making it an obligate parasite at the domain level.',
    'thaumarchaeota':'Thaumarchaeota are the most abundant archaea in the ocean, performing ammonia oxidation that drives the global nitrogen cycle — there are an estimated 10^28 cells in Earth\'s oceans alone.',
    'methanopyrus':'Methanopyrus kandleri holds the record for growth at the highest temperature of any known organism — 122°C, well above water\'s boiling point, sustained by pressures found at deep-sea hydrothermal vents.',
    'ferroplasma':'Ferroplasma acidiphilum thrives in pH 0 environments — essentially battery acid — and has no cell wall, surviving conditions that would dissolve most biological structures in seconds.',
    'morel':'Morels fruit prolifically in forests the year after a wildfire, thriving in the nutrient-rich ash — making burned landscapes a closely guarded secret among foragers willing to hike miles for a $50-per-pound delicacy.',
    'ergot':'Ergot fungus contaminating rye grain may have caused the Salem witch trials of 1692 — its alkaloids produce convulsions, hallucinations, and gangrenous limbs, and it is also the chemical precursor to LSD.',
    'death-cap':'The death cap mushroom (Amanita phalloides) is responsible for over 90% of fatal mushroom poisonings worldwide — its amatoxins destroy liver cells so slowly that symptoms don\'t appear until 6-12 hours after ingestion, when treatment is often too late.',
    'shiitake':'Shiitake mushrooms have been cultivated in East Asia for over 1,000 years, making them one of humanity\'s oldest farmed crops — and they contain lentinan, a compound now used in cancer immunotherapy in Japan.',
    'lions-mane':'Lion\'s mane mushroom stimulates nerve growth factor (NGF) production in laboratory studies — it is the only known food source that may directly promote nerve regeneration, attracting intense research for Alzheimer\'s treatment.',
    'kelp':'Giant kelp can grow up to 60 cm per day — the fastest growth rate of any marine organism — forming underwater forests up to 45 meters tall that shelter over 800 species.',
    'sunflower':'Young sunflowers track the sun from east to west each day using differential growth rates on each side of the stem — a behavior called heliotropism that ceases once the flower matures and locks facing east.',
    'rice':'Rice feeds more people than any other crop — 3.5 billion depend on it daily. A single grain contains enough genetic information to code for roughly 37,500 genes, more than the human genome.',
    'mangrove':'Mangrove forests protect coastlines from storm surges, filter pollutants, and store 3 to 5 times more carbon per hectare than terrestrial forests — yet the world has lost over 35% of its mangroves since the 1980s.',
    'oak':'A single mature oak tree produces roughly 70,000 acorns per year and supports over 2,300 species of insects, birds, fungi, and lichens — more than any other tree genus in the Northern Hemisphere.',
    'pitcher-plant':'Pitcher plants in Borneo have evolved a secondary function: tree shrews perch on the rim and defecate into the pitcher, providing the plant with 57-100% of its nitrogen — an elaborate toilet-for-food exchange.',
    'lotus':'Lotus seeds recovered from a dry lake bed in China germinated successfully after 1,300 years of dormancy — the oldest viable seeds ever confirmed, protected by an impermeable seed coat.',
    'eucalyptus':'Eucalyptus trees actively promote forest fires — their oil-rich leaves are essentially natural firebombs — because the trees resprout rapidly from underground lignotubers while competitors are destroyed.',
    'coffee':'All commercial Arabica coffee descends from a few plants smuggled out of Ethiopia, giving the $100 billion global industry dangerously low genetic diversity — a single disease could wipe out the world\'s coffee supply.',
    'magnolia':'Magnolias evolved their large, sturdy flowers before bees existed — they are pollinated by beetles, making them among the earliest flowering plants at 95 million years old, predating most modern pollinators.',
    'acacia':'Acacia trees under attack by herbivores release ethylene gas that warns neighboring trees to increase toxic tannin production in their leaves — giraffes have learned to browse upwind to avoid triggering the alarm.',
    'cycad':'Cycads dominated the landscape during the age of dinosaurs 200 million years ago and are now the most endangered group of plants on Earth — over 60% of species face extinction, declining faster than any other plant group.',
    'welwitschia-2':'Welwitschia mirabilis grows only two leaves in its entire life, which can span over 2,000 years — the oldest known specimens were seedlings when the Roman Empire was at its peak.',
    'titan-sequoia':'General Sherman, a giant sequoia, is the largest living organism by volume at 1,487 cubic meters — it adds enough wood each year to build a five-bedroom house and has been growing for approximately 2,200 years.',
    'sensitive-fern':'The sensitive fern earned its name because its fronds die back at the first frost, making it one of the most cold-sensitive ferns despite having survived since the Carboniferous period over 300 million years ago.',
    'resurrection-fern':'The resurrection fern can lose 97% of its water content and appear completely dead, then fully revive within hours of rainfall — NASA took it aboard the Space Shuttle Discovery in 1997 to study its extreme desiccation tolerance.',
    'corpse-flower':'Rafflesia arnoldii, the corpse flower, produces the largest individual flower on Earth at up to 1 meter across and 11 kg — it has no roots, stems, or leaves and lives entirely as a parasite inside tropical vines.',
    'strangler-fig':'Strangler figs begin life as an epiphyte high in the canopy, then send roots down to the ground that slowly encase and kill the host tree over decades — a single fig tree can support over 1,200 animal species.',
    'foraminifera':'Foraminifera are single-celled organisms whose calcium carbonate shells have accumulated on the ocean floor for 540 million years — the White Cliffs of Dover and the limestone of the Egyptian pyramids are built from their remains.',
    'trypanosoma':'Trypanosoma brucei, the parasite causing African sleeping sickness, has a wardrobe of 1,000 surface protein genes and switches its coat every few days — staying permanently one step ahead of the immune system.',
    'toxoplasma':'Toxoplasma gondii infects an estimated one-third of all humans alive today and can alter host behavior — infected rodents lose their fear of cats, walking directly toward them, completing the parasite\'s life cycle.',
    'bioluminescent-dino':'Bioluminescent dinoflagellates produce the electric-blue glow seen in breaking waves at night — each flash lasts just 100 milliseconds, triggered by mechanical disturbance, and a single liter of seawater can contain millions of them.',
    'sarcopterygii':'Your arms and legs are modified lobe fins — the bones in a sarcopterygian fin 375 million years ago (humerus, radius, ulna) are the same bones in your arm today, rearranged but never reinvented.',
    'chondrichthyes':'Cartilaginous fish predate trees by 200 million years and have survived all five mass extinctions. A shark can detect one drop of blood in 25 gallons of water and sense the electromagnetic field of a heartbeat buried in sand.',
    'actinopterygii':'Ray-finned fish account for half of all living vertebrate species — roughly 34,000 — making them the most successful vertebrate group by far. Their secret weapon is a protrusible jaw that can shoot forward to snatch prey in milliseconds.',
    'platypus-frog':'The gastric-brooding frog swallowed its own fertilized eggs, turned its stomach into a womb, and gave birth through its mouth — it went extinct in the 1980s before scientists could study the enzyme that shut off its stomach acid.',
    'blue-ringed-octopus':'The blue-ringed octopus is the size of a golf ball yet carries enough tetrodotoxin to kill 26 adults within minutes — there is no antivenom, and its painless bite means victims often don\'t realize they\'ve been envenomated.',
    'bdelloid-rotifer':'Bdelloid rotifers have survived for over 80 million years without any sexual reproduction — the longest known period of obligate asexuality in the animal kingdom — defying the theory that sex is essential for long-term survival.',
    'kakapo':'The kakapo is the world\'s heaviest parrot and the only flightless one — with fewer than 250 individuals remaining, every single bird has a name, a tracking transmitter, and a dedicated conservation team.',
    'resplendent-quetzal':'The resplendent quetzal was sacred to the Maya and Aztec, who considered killing one a capital crime — its iridescent tail feathers, up to 65 cm long, were used as currency and worn only by royalty.',
    'greater-bird-of-paradise':'Male greater birds-of-paradise perform one of the most elaborate courtship displays in nature — hanging upside down from branches and transforming their plumage into a cascading golden fountain to attract females.',
    'radiolaria':'Radiolarian skeletons are geometric perfection on a microscopic scale — intricate silica lattices so beautiful they inspired Buckminster Fuller\'s geodesic dome. They have been building these structures for 540 million years.',
    'fly-agaric':'The iconic red-and-white fly agaric is the most recognizable mushroom on Earth — and possibly the inspiration for Santa\'s red suit. Siberian shamans consumed it for visionary rituals, and reindeer eat it deliberately.'
  };
  Object.entries(ff).forEach(([id,fact])=>{
    const n=nodeMap[id];
    if(n && !n.funFact) n.funFact=fact;
  });
})();

// Expose getNodeById globally
window.getNodeById = id => nodeMap[id];


// ══════════════════════════════════════════════════════
// 3. setViewMode() — coordinator function
// ══════════════════════════════════════════════════════

function setViewMode(mode){
  if(state.playbackMode&&mode!=='playback') exitPlaybackMode();
  if(mode==='playback'){enterPlaybackMode();return;}
  if(mode==='chronological') mode='cladogram';
  state.viewMode=mode;
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.mode===mode);
  });
  animDone.clear();
  layout();
  if(mode==='radial'){centerOnRoot(0.18);}
  else if(mode==='cladogram'){
    // Fit entire visible tree into viewport
    const vis=getVisible(TREE);
    if(vis.length){
      const xs=vis.map(n=>n._x),ys=vis.map(n=>n._y);
      const bw=(Math.max(...xs)-Math.min(...xs))||400;
      const bh=(Math.max(...ys)-Math.min(...ys))||400;
      const fitS=Math.min(window.innerWidth*0.85/bw,window.innerHeight*0.85/bh,1.0);
      centerOnTree(Math.max(0.05,fitS));
    }
  }
  scheduleRender(true);applyT();
  a11yAnnounce('Switched to '+mode+' view');
  trackViewMode(mode);
}


// ══════════════════════════════════════════════════════
// 4. navigateTo() — key coordinator function
// ══════════════════════════════════════════════════════

const searchInput=document.getElementById('search-input');
const searchResults=document.getElementById('search-results');

function navigateTo(id){
  searchInput.value='';searchResults.classList.remove('show');searchInput.setAttribute('aria-expanded','false');
  // Handle legacy hom: prefixed IDs from old search entries
  if(id.startsWith('hom:')){
    const homId=id.slice(4);
    const canonId=canonicalHomininId(homId);
    // Try tree node first (hominins are now in the main tree)
    if(nodeMap[canonId]){
      id=canonId;
    } else if(nodeMap[homId]){
      id=homId;
    } else {
      // Map h_sapiens to its tree node ID
      if(homId === 'h_sapiens') id = 'homo-sapiens';
    }
  }
  const n=nodeMap[id];if(!n)return;
  state.highlightedId=id;
  // Ensure path is not collapsed
  let c=n;while(c._parent){c._parent._collapsed=false;c=c._parent;}
  layout();scheduleRender(true);applyT();
  // Smooth pan to node (instant if reduced motion)
  if(reducedMotion()){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    state.transform.x=cx-n._x*state.transform.s;state.transform.y=cy-n._y*state.transform.s;applyT();
    showMainPanel(n,'?node='+encodeURIComponent(id));
  } else {
    smoothPanTo(n._x,n._y);
    setTimeout(()=>showMainPanel(n,'?node='+encodeURIComponent(id)),250);
  }
  setTimeout(()=>{state.highlightedId=null;scheduleRender();},2500);
}


// ══════════════════════════════════════════════════════
// 5. COMPARE MODE — wrap showMainPanel for intercept
// ══════════════════════════════════════════════════════

// Compare mode functions are in hominin.js.
// Wrap showMainPanel via interceptShowMainPanel for compare mode + a11y
const wrappedShowMainPanel = interceptShowMainPanel(showMainPanel);


// ══════════════════════════════════════════════════════
// 6. init() function
// ══════════════════════════════════════════════════════

function init(){
  // ── Splash animation ──
  const _splashCanvas = document.getElementById('splash-canvas');
  const _splashFallback = document.getElementById('splash-fallback');

  // Fallback: if Canvas doesn't init within 500ms, show CSS fallback
  setTimeout(() => {
    if (_splashCanvas && !_splashCanvas.dataset.ready && _splashFallback) {
      _splashCanvas.style.display = 'none';
      _splashFallback.style.display = 'flex';
      _splashFallback.addEventListener('click', () => {
        const s = document.getElementById('splash');
        if (s) { s.style.opacity = '0'; setTimeout(() => { s.style.display = 'none'; animateTreeEntrance(); }, 500); }
      });
    }
  }, 500);

  if (_splashCanvas) {
    initSplash(_splashCanvas, {
      tree: TREE,
      photoMap: PHOTO_MAP,
      t,
      facts: FACTS,
      eraNames: ERA_NAMES,
      onDone: () => {
        animateTreeEntrance();
        if (!localStorage.getItem('tol-tour-done') && !new URLSearchParams(location.search).get('node')) {
          setTimeout(showTourSelector, 1200);
        }
      }
    });
  }
  function assignDomains(node, domain) {
    node._domain = domain;
    if (node.children) {
      node.children.forEach(child => {
        const childDomain = (node.id === 'luca' || node.id === 'eukaryota') ? child.id : domain;
        assignDomains(child, childDomain);
      });
    }
  }
  assignDomains(TREE, 'luca');
  layout();centerOnRoot(0.18);scheduleRender(true);applyT();
  spawnParticles();
  buildExtinctionMarkers();
  buildEraPresets();
  buildEraSegments();
  buildDensitySparkline();
  initThumbDrag();
  initSpeedButtons();
  updateThumbPosition(state.currentEra);
  eraLabel.textContent=getEraName(state.currentEra);
  updateEraTimeRange(state.currentEra);
  updateSpeciesCount();
  updateEraTint(state.currentEra);
  buildSearchIndex();
  // Restore saved theme & language
  state.isDark=localStorage.getItem('theme')==='dark';
  applyTheme();
  state.currentLang=localStorage.getItem('tol-lang')||'en';
  document.documentElement.dir=state.currentLang==='he'?'rtl':'ltr';
  document.documentElement.lang=state.currentLang;
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.lang===state.currentLang);
    btn.setAttribute('aria-pressed',btn.dataset.lang===state.currentLang?'true':'false');
  });
  applyI18n();
  // Restore URL state (?node=id)
  const urlNode=new URLSearchParams(location.search).get('node');
  if(urlNode){
    setTimeout(()=>navigateTo(urlNode),120);
  } else {
    showIntro();
  }
  // Keyboard shortcut hint
  setTimeout(()=>{
    const hint=document.getElementById('shortcuts-hint');
    if(hint&&!localStorage.getItem('hints-shown')){
      hint.style.opacity='1';
      setTimeout(()=>{hint.style.opacity='0';},4000);
      localStorage.setItem('hints-shown','1');
    }
  },3000);
  // Initialize engagement progress badge and quiz events
  updateProgressBadge();
  initGameEvents();
}


// ══════════════════════════════════════════════════════
// 7. EVENT LISTENERS
// ══════════════════════════════════════════════════════

// ── Era Slider ──
const eraSlider=document.getElementById('era-slider');
const eraLabel=document.getElementById('era-label');
const eraFill=document.getElementById('era-fill');
eraSlider.addEventListener('input',()=>{
  state.currentEra=parseInt(eraSlider.value);
  const pct=(state.currentEra/3800)*100;
  if(eraFill) eraFill.style.width=pct+'%';
  eraLabel.textContent=getEraName(state.currentEra);
  updateEraTint(state.currentEra);
  updateSpeciesCount();
  if(state.currentEra>=3800) checkAchievement('deep_time');
  if(state.playbackMode){
    pausePlayback();
    state.playbackCursor=state.currentEra;
    state.pbFiredExtinctions.clear();
    state.playbackEvents.forEach(e=>{if(e.type==='extinction'&&e.mya>=state.playbackCursor)state.pbFiredExtinctions.add(e.mya);});
    updatePlaybackStates();
  } else {
    updatePresetHighlight(state.currentEra);
  }
  scheduleRender();
});

// ── Search UI ──
searchInput.addEventListener('input',()=>{
  const q=searchInput.value.trim();
  if(!q){
    searchResults.innerHTML=`
      <div style="padding:16px;text-align:center;font-family:'Inter',sans-serif;">
        <div style="font-size:24px;margin-bottom:8px;">🔍</div>
        <div style="font-size:var(--text-sm);color:var(--text-muted);">${t('search_hint')}</div>
      </div>
    `;
    searchResults.style.display='block';
    searchResults.classList.add('show');
    searchInput.setAttribute('aria-expanded','true');
    return;
  }
  const matches=searchEntities(q);
  const lang=state.currentLang;
  searchResults.innerHTML=matches.map(m=>{
    const lookupId=m.homId||m.id;
    const i18nEntry=TAXON_I18N[lookupId];
    const localName=(lang!=='en'&&i18nEntry&&i18nEntry[lang])?i18nEntry[lang]:null;
    const displayName=localName||m.name;
    const subName=localName?m.name:'';
    const eraText=m.era?m.era.replace('~','').split(' ').slice(0,3).join(' '):'';
    return `<div class="sr-item" role="option" tabindex="-1" onclick="navigateTo('${m.id}')"><span class="sri-icon" aria-hidden="true">${m.icon}</span><span class="sri-name">${displayName}${subName?' <span style="font-size:0.8em;opacity:0.55;font-style:italic">'+subName+'</span>':''}</span><span class="sri-sub">${eraText}</span></div>`;
  }).join('');
  if(!matches.length){
    searchResults.innerHTML=`<div style="padding:16px;text-align:center;font-size:var(--text-sm);color:var(--text-muted);font-family:'Heebo',sans-serif;">${t('search_no_results')}</div>`;
    searchResults.classList.add('show');
    a11yAnnounce('No results found');
  } else {
    searchResults.classList.add('show');
    a11yAnnounce(matches.length+' results found');
  }
  searchInput.setAttribute('aria-expanded',matches.length>0?'true':'false');
});
searchInput.addEventListener('blur',()=>setTimeout(()=>{searchResults.classList.remove('show');searchInput.setAttribute('aria-expanded','false');},200));

// ── Nav buttons ──
document.getElementById('nav-back').addEventListener('click',navBack);
document.getElementById('nav-home').addEventListener('click',navHome);

// ── Pointer / Zoom events (from zoom.js) ──
initPointerEvents();

// ── Panel listeners (close, svg click) ──
initPanelListeners();

// ── Hominin overlay listeners (close, filters, escape) ──
initHomininOverlay();

// ── DNA Calculator events ──
initDnaCalcEvents();

// ── Evo Path events ──
initEvoPathEvents();

// ── Keyboard handlers ──
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    // Close keyboard help overlay first
    const kbdHelp=document.getElementById('kbd-help');
    if(kbdHelp&&kbdHelp.classList.contains('visible')){kbdHelp.classList.remove('visible');return;}
    if(state.playbackMode){exitPlaybackMode();return;}
    const _toastEl = document.getElementById('fact-toast');
    if(_toastEl && _toastEl.classList.contains('visible')){dismissToast();return;}
    if(document.getElementById('evo-path-panel').classList.contains('open')){closeEvoPath();return;}
    if(document.getElementById('game-panel').classList.contains('open')){closeGame();return;}
    // Close search dropdown first if open (not a nav action)
    if(searchResults.classList.contains('show')){
      searchResults.classList.remove('show');
      searchInput.setAttribute('aria-expanded','false');
      searchInput.blur();
      return;
    }
    // Close DNA calculator if open (not a nav action)
    if(document.getElementById('dna-panel').classList.contains('open')){closeDnaCalc();return;}
    // Shift+Escape = Home (reset everything)
    if(e.shiftKey){navHome();return;}
    // Escape = Back (step back one level)
    navBack();
    return;
  }
  // Prevent shortcuts firing while typing in any input/textarea
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable) return;
  // Toggle keyboard help overlay
  if(e.key==='?'){
    const kbdHelp=document.getElementById('kbd-help');
    if(kbdHelp) kbdHelp.classList.toggle('visible');
    return;
  }
  // Playback keyboard shortcuts
  if(state.playbackMode){
    if(e.key===' '){e.preventDefault();togglePlayback();}
    if(e.key==='ArrowRight'){e.preventDefault();skipToNextEvent();}
    return;
  }
  if(e.key==='f'||e.key==='F'){searchInput.focus();e.preventDefault();}
  if(e.key==='/'){e.preventDefault();const search=document.getElementById('search-input');if(search)search.focus();}
  if(e.key==='h'||e.key==='H'){navigateTo('hominini');}
  if(e.key==='r'||e.key==='R'){layout();centerOnRoot(0.18);scheduleRender(true);applyT();}
  if(e.key==='d'){const toggle=document.getElementById('theme-btn');if(toggle)toggle.click();}
});

// ── SVG tree keyboard navigation (WAI TreeView pattern) ──

// Pre-order traversal of visible (non-collapsed) tree nodes
function getVisibleTreeOrder(){
  const order=[];
  (function walk(n){
    order.push(n.id);
    if(n.children&&!n._collapsed) n.children.forEach(walk);
  })(TREE);
  return order;
}

function focusTreeNode(id){
  state.focusedNodeId=id;
  const g=document.querySelector('.node-group[data-node-id="'+id+'"]');
  if(g){
    g.focus({preventScroll:true});
    const label=g.getAttribute('aria-label');
    a11yAnnounce(label||nodeMap[id]?.name||id);
  }
}

document.getElementById('svg').addEventListener('keydown',function(e){
  const focused=document.activeElement;
  if(!focused||!focused.classList.contains('node-group')) return;
  const nid=focused.getAttribute('data-node-id');
  const node=nodeMap[nid];
  if(!node) return;

  if(e.key==='Enter'||e.key===' '){
    e.preventDefault();
    wrappedShowMainPanel(node);
    a11yAnnounce(node.name+' details opened');
    return;
  }

  // ArrowRight: expand collapsed → first child of expanded → noop on leaf
  if(e.key==='ArrowRight'){
    e.preventDefault();
    if(node.children&&node.children.length){
      if(node._collapsed){
        node._collapsed=false;
        state.focusedNodeId=nid;
        layout();scheduleRender(true);
        a11yAnnounce(node.name+' expanded, '+node.children.length+' children');
      } else {
        focusTreeNode(node.children[0].id);
      }
    }
    return;
  }

  // ArrowLeft: collapse expanded → parent of collapsed/leaf
  if(e.key==='ArrowLeft'){
    e.preventDefault();
    if(node.children&&node.children.length&&!node._collapsed){
      node._collapsed=true;
      state.focusedNodeId=nid;
      layout();scheduleRender(true);
      a11yAnnounce(node.name+' collapsed');
    } else if(node._parent){
      focusTreeNode(node._parent.id);
    }
    return;
  }

  // ArrowDown: next visible node in pre-order traversal
  if(e.key==='ArrowDown'){
    e.preventDefault();
    const order=getVisibleTreeOrder();
    const i=order.indexOf(nid);
    if(i>=0&&i<order.length-1) focusTreeNode(order[i+1]);
    return;
  }

  // ArrowUp: previous visible node in pre-order traversal
  if(e.key==='ArrowUp'){
    e.preventDefault();
    const order=getVisibleTreeOrder();
    const i=order.indexOf(nid);
    if(i>0) focusTreeNode(order[i-1]);
    return;
  }

  if(e.key==='Home'){
    e.preventDefault();
    focusTreeNode('luca');
    return;
  }
  if(e.key==='End'){
    e.preventDefault();
    const order=getVisibleTreeOrder();
    if(order.length) focusTreeNode(order[order.length-1]);
    return;
  }
});

// ── Panel focus trap (a11y) ──
(function setupPanelFocusTrap(){
  const panelEl=document.getElementById('panel');
  panelEl.addEventListener('keydown',function(e){
    if(e.key!=='Tab') return;
    const focusable=panelEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!focusable.length) return;
    const first=focusable[0];
    const last=focusable[focusable.length-1];
    if(e.shiftKey){
      if(document.activeElement===first){e.preventDefault();last.focus();}
    } else {
      if(document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
})();

// ── DNA panel focus trap (a11y) ──
(function setupDnaFocusTrap(){
  const dnaEl=document.getElementById('dna-panel');
  dnaEl.addEventListener('keydown',function(e){
    if(e.key==='Escape'){closeDnaCalc();return;}
    if(e.key!=='Tab') return;
    const focusable=dnaEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!focusable.length) return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey){
      if(document.activeElement===first){e.preventDefault();last.focus();}
    } else {
      if(document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
})();

// ── Evo-path panel focus trap (a11y) ──
(function setupEvoFocusTrap(){
  const evoEl=document.getElementById('evo-path-panel');
  evoEl.addEventListener('keydown',function(e){
    if(e.key==='Escape'){closeEvoPath();return;}
    if(e.key!=='Tab') return;
    const focusable=evoEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!focusable.length) return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey){
      if(document.activeElement===first){e.preventDefault();last.focus();}
    } else {
      if(document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
})();

// ── Keyboard help backdrop click ──
const _kbdHelp=document.getElementById('kbd-help');
if(_kbdHelp) _kbdHelp.addEventListener('click',function(e){
  if(e.target===this) this.classList.remove('visible');
});

// ── Resize handler ──
window.addEventListener('resize',()=>{layout();if(state.viewMode==='radial')centerOnRoot(state.transform.s);scheduleRender();applyT();});

// ── Mobile enhancements ──
(function mobilePatch(){
  const isMobile=()=>window.innerWidth<=768;
  const panel=document.getElementById('panel');
  const svgEl=document.getElementById('svg');

  // ── Swipe-to-close panel ──
  let panelTouchStartY=0, panelTouchDelta=0, panelSwiping=false;
  panel.addEventListener('touchstart',e=>{
    if(!isMobile()) return;
    const t=e.touches[0];
    panelTouchStartY=t.clientY;
    panelTouchDelta=0;
    panelSwiping=true;
  },{passive:true});
  panel.addEventListener('touchmove',e=>{
    if(!panelSwiping||!isMobile()) return;
    const t=e.touches[0];
    panelTouchDelta=t.clientY-panelTouchStartY;
    if(panelTouchDelta>0 && panel.scrollTop<=0){
      panel.style.transform=`translateY(${panelTouchDelta}px)`;
      panel.style.transition='none';
    }
  },{passive:true});
  panel.addEventListener('touchend',()=>{
    if(!panelSwiping||!isMobile()) return;
    panelSwiping=false;
    panel.style.transition='';
    if(panelTouchDelta>80){
      closePanel();
    } else {
      panel.style.transform='translateY(0)';
    }
    panelTouchDelta=0;
  },{passive:true});

  // ── Legend toggle on mobile ──
  const legend=document.getElementById('legend');
  if(legend){
    const legTitle=legend.querySelector('.leg-title');
    if(legTitle){
      legTitle.addEventListener('click',()=>{
        if(!isMobile()) return;
        legend.classList.toggle('m-collapsed');
      });
    }
    // Start collapsed on mobile
    if(isMobile()) legend.classList.add('m-collapsed');
    window.addEventListener('resize',()=>{
      if(!isMobile()) legend.classList.remove('m-collapsed');
      else if(!legend.classList.contains('m-collapsed')) legend.classList.add('m-collapsed');
    });
  }

  // ── Pinch-to-zoom (two-finger) ──
  let lastPinchDist=0;
  svgEl.addEventListener('touchstart',e=>{
    if(e.touches.length===2){
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      lastPinchDist=Math.hypot(dx,dy);
    }
  },{passive:true});
  svgEl.addEventListener('touchmove',e=>{
    if(e.touches.length===2){
      e.preventDefault();
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      const dist=Math.hypot(dx,dy);
      if(lastPinchDist>0){
        const scale=dist/lastPinchDist;
        const cx=(e.touches[0].clientX+e.touches[1].clientX)/2;
        const cy=(e.touches[0].clientY+e.touches[1].clientY)/2;
        const ns=Math.min(6,Math.max(0.05,state.transform.s*scale));
        state.transform.x=cx-(cx-state.transform.x)*(ns/state.transform.s);
        state.transform.y=cy-(cy-state.transform.y)*(ns/state.transform.s);
        state.transform.s=ns;
        applyT();
      }
      lastPinchDist=dist;
    }
  },{passive:false});
  svgEl.addEventListener('touchend',()=>{lastPinchDist=0;},{passive:true});

  // ── Browser back button integrates with navStack ──
  window.addEventListener('popstate',()=>{
    if(state._suppressPopstate) return;
    navBack();
  });
})();


// ══════════════════════════════════════════════════════
// 8. WINDOW EXPOSURES
// ══════════════════════════════════════════════════════

// Core UI
window.setLang = setLang;
window.toggleTheme = toggleTheme;
window.toggleExtinct = toggleExtinct;
window.navigateTo = navigateTo;

// Domain filtering
window.toggleDomain = toggleDomain;
window.resetDomains = resetDomains;

// View modes
window.setViewMode = setViewMode;
window.enterPlaybackMode = enterPlaybackMode;

// Panel & navigation
window.showMainPanel = wrappedShowMainPanel;
window.closePanel = closePanel;
window.openHomininView = openHomininView;
window.toggleCompareMode = toggleCompareMode;
window.viewHomininOnTree = viewHomininOnTree;
window.closeCompare = closeCompare;
window.finishCompare = finishCompare;
window.cancelCompare = cancelCompare;
window.startCompareFromPanel = startCompareFromPanel;

// DNA calculator
window.openDnaCalc = openDnaCalc;
window.closeDnaCalc = closeDnaCalc;
window.dnaPreset = dnaPreset;
window.openDnaSearch = openDnaSearch;
window.selectDnaSpecies = selectDnaSpecies;

// Evolutionary path
window.openEvoPath = openEvoPath;
window.closeEvoPath = closeEvoPath;
window.evoPreset = evoPreset;
window.openEvoSearch = openEvoSearch;
window.selectEvoSpecies = selectEvoSpecies;
window.showEvoOnTree = showEvoOnTree;
window.clearEvoPath = clearEvoPath;
window.clearEvoHighlight = clearEvoHighlight;

// Trivia
window.openGame = openGame;
window.closeGame = closeGame;

// Tours
initTourDeps({ state, nodeMap, layout, scheduleRender, applyT, animateSliderTo, t });
window.showTourSelector = showTourSelector;
window.startTour = startTour;
window.endTour = endTour;
window.t = t;

// Helpers
window.focusNode = focusNode;
window.a11yAnnounce = a11yAnnounce;
window.getNodeById = id => nodeMap[id];

// Playback
window.togglePlayback = togglePlayback;
window.exitPlaybackMode = exitPlaybackMode;
window.skipToNextEvent = skipToNextEvent;
window.setPlaybackSpeed = setPlaybackSpeed;
window.resetPlayback = resetPlayback;

// Toast
window.dismissToast = dismissToast;

// Timeline
window.toggleEraPlay = toggleEraPlay;
window.showExtinctionPopover = showExtinctionPopover;


// ══════════════════════════════════════════════════════
// 9. SERVICE WORKER + OFFLINE INDICATOR
// ══════════════════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

(function() {
  const banner = document.createElement('div');
  banner.id = 'offline-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.className = 'offline-banner';
  banner.textContent = 'You are offline — cached content is being used';
  document.body.appendChild(banner);

  function update() {
    banner.classList.toggle('visible', !navigator.onLine);
  }
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
})();


// ══════════════════════════════════════════════════════
// 10. RUN INIT
// ══════════════════════════════════════════════════════

init();
