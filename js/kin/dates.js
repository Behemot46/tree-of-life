// ══════════════════════════════════════════════════════
// KIN — WHEN THE BRANCHES SPLIT
//
// The age, in millions of years, of each node in js/kin/tree.js that a
// question can land on, with the openly citable source it came from.
//
// `min: true` marks a fossil minimum: the split is at least this old, and
// the reveal says "more than".
//
// Where a source gives only a range, the value is its midpoint, or the end of
// it that keeps every split younger than the one it sits inside; the comment
// says which. Sources disagree on most of these by 10–20%, and on the deepest
// splits by far more; the aim is a defensible mainstream figure, not the
// last word. The unit tests fail if any split comes out older than its parent.
//
// TimeTree (timetree.org) is deliberately absent. Its terms allow personal
// research and teaching use and forbid redistribution, so it was used only
// to sanity-check these figures, never as their source.
// ══════════════════════════════════════════════════════

const doi = (id) => `https://doi.org/${id}`;
const wiki = (page) => `https://en.wikipedia.org/wiki/${page}`;

export const SOURCES = {
  alabady2026: { title: 'Alabady et al. 2026', url: doi('10.1002/tpg2.70221') },
  bibi2013: { title: 'Bibi 2013', url: doi('10.1186/1471-2148-13-166') },
  carlisle2024: { title: 'Carlisle et al. 2024', url: doi('10.1126/sciadv.adp7161') },
  chen2021: { title: 'Chen et al. 2021', url: doi('10.1186/s12862-021-01935-1') },
  cvetkovic2021: { title: 'Cvetković et al. 2021', url: doi('10.1093/g3journal/jkab136') },
  desojo2020: { title: 'Desojo et al. 2020', url: doi('10.1038/s41598-020-67854-1') },
  dosreis2012: { title: 'dos Reis et al. 2012', url: doi('10.1098/rspb.2012.0683') },
  han2024: { title: 'Han et al. 2024', url: doi('10.3389/fevo.2024.1327007') },
  hassanin2021: { title: 'Hassanin et al. 2021', url: doi('10.1371/journal.pone.0240770') },
  hibrand2018: { title: 'Hibrand Saint-Oyant et al. 2018', url: doi('10.1038/s41477-018-0166-1') },
  huang2023: { title: 'Huang et al. 2023', url: doi('10.1016/j.xplc.2023.100595') },
  irisarri2017: { title: 'Irisarri et al. 2017', url: doi('10.1038/s41559-017-0240-5') },
  johnson2018: { title: 'Johnson et al. 2018', url: doi('10.1038/s41588-018-0153-5') },
  jones2013: { title: 'Jones et al. 2013', url: doi('10.1186/1471-2148-13-208') },
  jonsson2014: { title: 'Jónsson et al. 2014', url: doi('10.1073/pnas.1412627111') },
  joyce2023: { title: 'Joyce et al. 2023', url: doi('10.3389/fpls.2023.1063174') },
  kellogg2009: { title: 'Kellogg 2009', url: doi('10.1007/s12284-009-9022-2') },
  kimura2015: { title: 'Kimura et al. 2015', url: doi('10.1038/srep14444') },
  krause2008: { title: 'Krause et al. 2008', url: doi('10.1186/1471-2148-8-220') },
  li2022: { title: 'Li et al. 2022', url: doi('10.3389/fpls.2021.699226') },
  li2015: { title: 'Li et al. 2015', url: doi('10.1038/srep14023') },
  li2023: { title: 'Li et al. 2023', url: doi('10.3390/ijms241915031') },
  lozano2020: { title: 'Lozano-Fernandez et al. 2020', url: doi('10.3389/fgene.2020.00182') },
  lu2023: { title: 'Lu et al. 2023', url: doi('10.1093/g3journal/jkad233') },
  mandel2019: { title: 'Mandel et al. 2019', url: doi('10.1073/pnas.1903871116') },
  morris2018: { title: 'Morris et al. 2018', url: doi('10.1073/pnas.1719588115') },
  parfrey2011: { title: 'Parfrey et al. 2011', url: doi('10.1073/pnas.1110633108') },
  richardson2015: { title: 'Richardson et al. 2015', url: doi('10.3389/fevo.2015.00120') },
  rohland2007: { title: 'Rohland et al. 2007', url: doi('10.1371/journal.pbio.0050207') },
  rotastabelli2013: { title: 'Rota-Stabelli et al. 2013', url: doi('10.1016/j.cub.2013.01.026') },
  sarkinen2013: { title: 'Särkinen et al. 2013', url: doi('10.1186/1471-2148-13-214') },
  sebastian2010: { title: 'Sebastian et al. 2010', url: doi('10.1073/pnas.1005338107') },
  soares2016: { title: 'Soares et al. 2016', url: doi('10.1186/s12862-016-0800-3') },
  stiller2024: { title: 'Stiller et al. 2024', url: doi('10.1038/s41586-024-07323-1') },
  steppan2017: { title: 'Steppan & Schenk 2017', url: doi('10.1371/journal.pone.0183070') },
  su2023: { title: 'Su et al. 2023', url: doi('10.1016/j.pld.2023.03.013') },
  sun2017: { title: 'Sun et al. 2017', url: doi('10.1371/journal.pone.0184529') },
  upham2019: { title: 'Upham et al. 2019', url: doi('10.1371/journal.pbio.3000494') },
  wang2009: { title: 'Wang et al. 2009', url: doi('10.1073/pnas.0813376106') },
  wiegmann2009: { title: 'Wiegmann et al. 2009', url: doi('10.1186/1741-7007-7-34') },
  wikstrom2015: { title: 'Wikström et al. 2015', url: doi('10.1371/journal.pone.0126690') },
  xie2019: { title: 'Xie et al. 2019', url: doi('10.1038/s41467-019-13185-3') },
  zhou2012: { title: 'Zhou et al. 2012', url: doi('10.1093/sysbio/syr089') },

  wAnopheles: { title: 'Wikipedia: Anopheles', url: wiki('Anopheles') },
  wArchosaur: { title: 'Wikipedia: Archosaur', url: wiki('Archosaur') },
  wBirds: { title: 'Wikipedia: Evolution of birds', url: wiki('Evolution_of_birds') },
  wCamelidae: { title: 'Wikipedia: Camelidae', url: wiki('Camelidae') },
  wDalbergioids: { title: 'Wikipedia: Dalbergioids', url: wiki('Dalbergioids') },
  wEuarchontoglires: { title: 'Wikipedia: Euarchontoglires', url: wiki('Euarchontoglires') },
  wHomininae: { title: 'Wikipedia: Homininae', url: wiki('Homininae') },
  wKileskus: { title: 'Wikipedia: Kileskus', url: wiki('Kileskus') },
  wLaurasiatheria: { title: 'Wikipedia: Laurasiatheria', url: wiki('Laurasiatheria') },
  wMarsupial: { title: 'Wikipedia: Marsupial', url: wiki('Marsupial') },
  wMesangiospermae: { title: 'Wikipedia: Mesangiospermae', url: wiki('Mesangiospermae') },
  wMonocots: { title: 'Wikipedia: Monocotyledon', url: wiki('Monocotyledon') },
  wMustelidae: { title: 'Wikipedia: Mustelidae', url: wiki('Mustelidae') },
  wOddToed: { title: 'Wikipedia: Odd-toed ungulate', url: wiki('Odd-toed_ungulate') },
  wOldWorldMonkey: { title: 'Wikipedia: Old World monkey', url: wiki('Old_World_monkey') },
  wOrangutan: { title: 'Wikipedia: Orangutan', url: wiki('Orangutan') },
  wPanthera: { title: 'Wikipedia: Panthera', url: wiki('Panthera') },
  wPecora: { title: 'Wikipedia: Pecora', url: wiki('Pecora') },
  wScrotifera: { title: 'Wikipedia: Scrotifera', url: wiki('Scrotifera') },
  wTurtle: { title: 'Wikipedia: Turtle', url: wiki('Turtle') },
  wVulpes: { title: 'Wikipedia: Vulpes', url: wiki('Vulpes') },
  wWhippomorpha: { title: 'Wikipedia: Whippomorpha', url: wiki('Whippomorpha') },
  wZebra: { title: 'Wikipedia: Zebra', url: wiki('Zebra') },
};

export const NODE_DATES = {
  // ── The deep splits ──
  eukaryota: { mya: 1770, src: 'parfrey2011' }, // "between 1866 and 1679 Ma": midpoint
  opisthokonta: { mya: 1315, src: 'parfrey2011' }, // "1389–1240 Ma": midpoint
  planulozoa: { mya: 584, src: 'carlisle2024' }, // crown Eumetazoa, cnidarians vs bilaterians, "590.7 to 578.2 Ma": midpoint
  cnidaria: { mya: 570, src: 'carlisle2024' }, // jellyfish vs coral: crown Cnidaria in the supplementary tables, 566–574 across clock models
  bilateria: { mya: 575, src: 'carlisle2024' }, // "581.8 to 569 Ma": midpoint
  protostomia: { mya: 565, src: 'carlisle2024' }, // "571.3 to 558.5 Ma": midpoint

  // ── Invertebrates ──
  arthropoda: { mya: 546, src: 'lozano2020' },
  arachnopulmonata: { mya: 473, src: 'lozano2020' },
  pancrustacea: { mya: 525, src: 'rotastabelli2013' }, // "∼539-511 mya": midpoint
  holometabola: { mya: 355, src: 'wiegmann2009' },
  diptera: { mya: 260, src: 'wAnopheles' },
  mollusca: { mya: 516, src: 'han2024' }, // crown Conchifera: octopus vs snail

  // ── Fish, amphibians, reptiles, birds ──
  gnathostomata: { mya: 458, src: 'irisarri2017' },
  osteichthyes: { mya: 449, src: 'irisarri2017' },
  tetrapoda: { mya: 346, src: 'irisarri2017' },
  sauria: { mya: 271, src: 'jones2013' },
  squamata: { mya: 193, src: 'jones2013' },
  archelosauria: { mya: 255, src: 'wTurtle' },
  archosauria: { mya: 247, min: true, src: 'wArchosaur' }, // oldest archosaurs, Olenekian 247–251
  dinosauria: { mya: 233, min: true, src: 'desojo2020' }, // sauropods vs theropods: "the oldest known saurischians at ca. 233 Ma"
  tyrannoraptora: { mya: 166, min: true, src: 'wKileskus' }, // oldest tyrannosauroid
  neognathae: { mya: 85, src: 'wBirds' },
  galloanserae: { mya: 68, src: 'stiller2024' }, // chicken vs duck: 68.2 in the paper's main dated tree, the same analysis as neoaves
  core_phasianids: { mya: 31.5, src: 'chen2021' }, // chicken vs turkey: "core phasianids … about 31.5 Ma"; peafowl sits inside either way
  anatidae: { mya: 25, src: 'sun2017' }, // ducks vs swans: "about 29.1 / 25.1 Ma" by two calibrations; Stiller et al. 2024 gives 25.3
  neoaves: { mya: 67.4, src: 'stiller2024' },
  columbidae: { mya: 24.7, src: 'soares2016' }, // rock pigeon vs dodo: "Holarctic and Indo-Pacific clades diverge around 24.7 Mya"

  // ── Mammals ──
  theria: { mya: 160, src: 'wMarsupial' },
  diprotodontia: { mya: 30, min: true, src: 'johnson2018' }, // koala vs wombat, 30–40; kangaroos split earlier
  placentalia: { mya: 89, src: 'dosreis2012' }, // "Placentalia diverged 88–90 Ma": midpoint
  elephantidae: { mya: 7.6, src: 'rohland2007' },
  boreoeutheria: { mya: 85, src: 'wEuarchontoglires' }, // "about 85 to 95": young end, inside placentalia
  glires: { mya: 72.5, src: 'upham2019' }, // rodents vs rabbits: S3 Table, 72.5 (64.4–81.1)
  rodentia: { mya: 67.9, src: 'upham2019' }, // squirrel vs mouse, crown Rodentia: S3 Table, 67.9 (60.5–75.2)
  mouse_related: { mya: 65, src: 'upham2019' }, // beaver vs mouse: S3 Table, "Mouse-related" 65.0 (58.4–71.6)
  muroidea: { mya: 18.8, src: 'steppan2017' }, // mouse vs hamster: after the eumuroid radiation began (20.2) and before crown Muridae (17.4): midpoint
  murinae: { mya: 11.8, src: 'kimura2015' }, // mouse vs rat: Table S4, "Core Murinae 11.81 (11.11-12.68)"
  catarrhini: { mya: 27.5, src: 'wOldWorldMonkey' }, // monkeys vs apes, "between 25 million and 30 million years ago": midpoint
  hominidae: { mya: 17, src: 'wOrangutan' }, // "between 19.3 and 15.7 mya"
  homininae: { mya: 9, src: 'wHomininae' }, // "about 8 to 10": midpoint
  laurasiatheria: { mya: 76, src: 'wLaurasiatheria' }, // "ca. 76 to 90": young end
  scrotifera: { mya: 73, src: 'wScrotifera' }, // "ca. 73.1 to 85.5": young end
  carnivora: { mya: 52.7, src: 'hassanin2021' },
  felidae: { mya: 11.3, src: 'wPanthera' }, // cat vs lion: "Panthera diverged from other cat species about 11.3 [Ma]"
  panthera: { mya: 6.55, src: 'wPanthera' }, // lion vs tiger: "evolved into the species tiger about 6.55 [Ma]"; same sentence as felidae
  caniformia: { mya: 48, src: 'hassanin2021' },
  canidae: { mya: 7, min: true, src: 'wVulpes' }, // dog vs fox: fox fossils "about 7 million years old"; published splits run 7.8–21.5
  arctoidea: { mya: 43.4, src: 'hassanin2021' },
  ursidae: { mya: 20, src: 'krause2008' }, // panda vs other bears, "between 17.9 and 22.1 Ma": midpoint
  musteloidea: { mya: 37.4, src: 'hassanin2021' }, // skunk vs raccoon and otter, "37.4–33.0 Mya": the U estimate, as for carnivora above
  procyonids_mustelids: { mya: 29, src: 'wMustelidae' }, // mustelids vs procyonids: otter vs raccoon
  mustelidae: { mya: 14.8, src: 'wMustelidae' }, // otter vs badger: "14.8 Ma for Melinae", after Law et al. 2018
  artiodactyla: { mya: 65, src: 'zhou2012' },
  camelidae: { mya: 17, src: 'wCamelidae' }, // camel vs llama: Camelini and Lamini "diverging … about 17 million years ago"
  artiofabula: { mya: 61, src: 'zhou2012' },
  cetruminantia: { mya: 59, src: 'wWhippomorpha' },
  whippomorpha: { mya: 55, src: 'wWhippomorpha' },
  pecora: { mya: 30, src: 'wPecora' },
  bovidae: { mya: 16.2, src: 'bibi2013' }, // cattle vs sheep and goats, "crown Bovidae (17.3–15.1 Ma)": midpoint
  perissodactyla: { mya: 56, src: 'wOddToed' },
  equus: { mya: 4.25, src: 'jonsson2014' }, // horse vs donkey and zebra: Equus "emerged 4.0–4.5 Mya": midpoint
  asses_zebras: { mya: 2, src: 'wZebra' }, // "Zebras and asses diverged from each other close to 2 mya"

  // ── Plants ──
  spermatophyta: { mya: 348, src: 'morris2018' }, // conifers vs flowering plants: 95% HPD 365.0–330.9, midpoint
  mesangiospermae: { mya: 145, src: 'wMesangiospermae' },
  monocots_lilies_grasses: { mya: 124, src: 'li2022' }, // stem Liliales, 123.8, after Givnish et al. 2016
  commelinids: { mya: 118, src: 'wMonocots' }, // cladogram label, after Hertweck et al. 2015
  zingiberales: { mya: 85, src: 'li2023' }, // banana vs ginger: crown Zingiberales "85.0 Mya (95% HPD: 81.6–89.3 Mya)"
  poaceae: { mya: 51.6, src: 'kellogg2009' }, // maize vs rice, after Vicentini et al. 2008
  pentapetalae: { mya: 125, src: 'lu2023' }, // rosids vs asterids, after Zeng et al. 2017
  rosids: { mya: 114, src: 'wang2009' }, // crown rosids "115 … to 113": mean of the two
  eurosids: { mya: 110, src: 'lu2023' }, // malvids vs fabids, after Zeng et al. 2017
  nfc: { mya: 101, src: 'li2015' }, // legumes vs roses vs gourds vs chestnuts: "ca. 92–110 Ma": midpoint
  papilionoideae: { mya: 55.3, min: true, src: 'wDalbergioids' }, // pea vs peanut: the peanut's branch "arisen 55.3 ± 0.5 million years ago", after Lavin et al. 2005
  malvids: { mya: 104, src: 'joyce2023' }, // Sapindales vs the cabbage and mallow orders: stem Sapindales "104 (98–112)", after Magallón et al. 2015
  brassicales_malvales: { mya: 96, src: 'cvetkovic2021' }, // broccoli vs cocoa: stem Malvales, "103.2 and 89.44 Ma", after Magallón et al. 2015: midpoint
  malvaceae: { mya: 70.7, src: 'richardson2015' }, // cocoa vs hibiscus: crown Malvaceae, "70.7 (63.4–78.6 [95% HPD]) Ma"
  sapindales: { mya: 70, src: 'wang2009' }, // crown Sapindales; estimates run from ~60 to ~125
  rosoideae: { mya: 50, src: 'hibrand2018' },
  prunus: { mya: 58, src: 'su2023' }, // solitary-flower (peach) vs corymbose (cherry) groups
  benincaseae: { mya: 18.1, src: 'xie2019' }, // Cucumis vs the watermelon clade
  cucumis: { mya: 10, src: 'sebastian2010' }, // cucumber vs melon: "diverged from the remaining Asian/Australian species approximately 10 Ma"
  ericales: { mya: 98, src: 'alabady2026' }, // sarracenioids vs ericoids, after Rose et al. 2018
  euasterids: { mya: 116, src: 'wikstrom2015' }, // lamiids vs campanulids: Table 3, "Core Asterids", separate analysis 116 (110–122)
  lamiids: { mya: 98, src: 'wikstrom2015' }, // crown core lamiids, separate analysis
  solanales: { mya: 59, src: 'wikstrom2015' }, // sweet potato vs nightshades: S2 Table node 14, separate analysis 59 (35–80)
  solanaceae: { mya: 52.2, min: true, src: 'huang2023' }, // chili vs Solanum: older than a "52.2-million-year-old fossil of lantern fruits"; Särkinen's 19.1 predates the fossil
  solanum_eggplant: { mya: 14, src: 'sarkinen2013' },
  solanum_tomato_potato: { mya: 8, src: 'sarkinen2013' },
  campanulids: { mya: 100, src: 'wikstrom2015' }, // carrot vs lettuce: Table 3, "Core campanulids", separate analysis 100 (89–110)
  asteraceae: { mya: 40, src: 'mandel2019' }, // lettuce vs sunflower, inside the 42–37 Eocene radiation
};
