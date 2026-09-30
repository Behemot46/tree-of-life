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
  carlisle2024: { title: 'Carlisle et al. 2024', url: doi('10.1126/sciadv.adp7161') },
  dosreis2012: { title: 'dos Reis et al. 2012', url: doi('10.1098/rspb.2012.0683') },
  han2024: { title: 'Han et al. 2024', url: doi('10.3389/fevo.2024.1327007') },
  hassanin2021: { title: 'Hassanin et al. 2021', url: doi('10.1371/journal.pone.0240770') },
  hibrand2018: { title: 'Hibrand Saint-Oyant et al. 2018', url: doi('10.1038/s41477-018-0166-1') },
  irisarri2017: { title: 'Irisarri et al. 2017', url: doi('10.1038/s41559-017-0240-5') },
  johnson2018: { title: 'Johnson et al. 2018', url: doi('10.1038/s41588-018-0153-5') },
  jones2013: { title: 'Jones et al. 2013', url: doi('10.1186/1471-2148-13-208') },
  kellogg2009: { title: 'Kellogg 2009', url: doi('10.1007/s12284-009-9022-2') },
  li2022: { title: 'Li et al. 2022', url: doi('10.3389/fpls.2021.699226') },
  lozano2020: { title: 'Lozano-Fernandez et al. 2020', url: doi('10.3389/fgene.2020.00182') },
  lu2023: { title: 'Lu et al. 2023', url: doi('10.1093/g3journal/jkad233') },
  mandel2019: { title: 'Mandel et al. 2019', url: doi('10.1073/pnas.1903871116') },
  parfrey2011: { title: 'Parfrey et al. 2011', url: doi('10.1073/pnas.1110633108') },
  rohland2007: { title: 'Rohland et al. 2007', url: doi('10.1371/journal.pbio.0050207') },
  rotastabelli2013: { title: 'Rota-Stabelli et al. 2013', url: doi('10.1016/j.cub.2013.01.026') },
  sarkinen2013: { title: 'Särkinen et al. 2013', url: doi('10.1186/1471-2148-13-214') },
  stiller2024: { title: 'Stiller et al. 2024', url: doi('10.1038/s41586-024-07323-1') },
  su2023: { title: 'Su et al. 2023', url: doi('10.1016/j.pld.2023.03.013') },
  wang2009: { title: 'Wang et al. 2009', url: doi('10.1073/pnas.0813376106') },
  wiegmann2009: { title: 'Wiegmann et al. 2009', url: doi('10.1186/1741-7007-7-34') },
  wikstrom2015: { title: 'Wikström et al. 2015', url: doi('10.1371/journal.pone.0126690') },
  xie2019: { title: 'Xie et al. 2019', url: doi('10.1038/s41467-019-13185-3') },
  zhou2012: { title: 'Zhou et al. 2012', url: doi('10.1093/sysbio/syr089') },

  wAnopheles: { title: 'Wikipedia: Anopheles', url: wiki('Anopheles') },
  wArchosaur: { title: 'Wikipedia: Archosaur', url: wiki('Archosaur') },
  wBirds: { title: 'Wikipedia: Evolution of birds', url: wiki('Evolution_of_birds') },
  wEuarchontoglires: { title: 'Wikipedia: Euarchontoglires', url: wiki('Euarchontoglires') },
  wHomininae: { title: 'Wikipedia: Homininae', url: wiki('Homininae') },
  wKileskus: { title: 'Wikipedia: Kileskus', url: wiki('Kileskus') },
  wLaurasiatheria: { title: 'Wikipedia: Laurasiatheria', url: wiki('Laurasiatheria') },
  wMarsupial: { title: 'Wikipedia: Marsupial', url: wiki('Marsupial') },
  wMesangiospermae: { title: 'Wikipedia: Mesangiospermae', url: wiki('Mesangiospermae') },
  wMonocots: { title: 'Wikipedia: Monocotyledon', url: wiki('Monocotyledon') },
  wMustelidae: { title: 'Wikipedia: Mustelidae', url: wiki('Mustelidae') },
  wOddToed: { title: 'Wikipedia: Odd-toed ungulate', url: wiki('Odd-toed_ungulate') },
  wOrangutan: { title: 'Wikipedia: Orangutan', url: wiki('Orangutan') },
  wPecora: { title: 'Wikipedia: Pecora', url: wiki('Pecora') },
  wScrotifera: { title: 'Wikipedia: Scrotifera', url: wiki('Scrotifera') },
  wTurtle: { title: 'Wikipedia: Turtle', url: wiki('Turtle') },
  wWhippomorpha: { title: 'Wikipedia: Whippomorpha', url: wiki('Whippomorpha') },
};

export const NODE_DATES = {
  // ── The deep splits ──
  eukaryota: { mya: 1770, src: 'parfrey2011' }, // "between 1866 and 1679 Ma": midpoint
  opisthokonta: { mya: 1315, src: 'parfrey2011' }, // "1389–1240 Ma": midpoint
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
  tyrannoraptora: { mya: 166, min: true, src: 'wKileskus' }, // oldest tyrannosauroid
  neognathae: { mya: 85, src: 'wBirds' },
  neoaves: { mya: 67.4, src: 'stiller2024' },

  // ── Mammals ──
  theria: { mya: 160, src: 'wMarsupial' },
  diprotodontia: { mya: 30, min: true, src: 'johnson2018' }, // koala vs wombat, 30–40; kangaroos split earlier
  placentalia: { mya: 89, src: 'dosreis2012' }, // "Placentalia diverged 88–90 Ma": midpoint
  elephantidae: { mya: 7.6, src: 'rohland2007' },
  boreoeutheria: { mya: 85, src: 'wEuarchontoglires' }, // "about 85 to 95": young end, inside placentalia
  hominidae: { mya: 17, src: 'wOrangutan' }, // "between 19.3 and 15.7 mya"
  homininae: { mya: 9, src: 'wHomininae' }, // "about 8 to 10": midpoint
  laurasiatheria: { mya: 76, src: 'wLaurasiatheria' }, // "ca. 76 to 90": young end
  scrotifera: { mya: 73, src: 'wScrotifera' }, // "ca. 73.1 to 85.5": young end
  carnivora: { mya: 52.7, src: 'hassanin2021' },
  caniformia: { mya: 48, src: 'hassanin2021' },
  arctoidea: { mya: 43.4, src: 'hassanin2021' },
  procyonids_mustelids: { mya: 29, src: 'wMustelidae' }, // mustelids vs procyonids: otter vs raccoon
  artiodactyla: { mya: 65, src: 'zhou2012' },
  artiofabula: { mya: 61, src: 'zhou2012' },
  cetruminantia: { mya: 59, src: 'wWhippomorpha' },
  whippomorpha: { mya: 55, src: 'wWhippomorpha' },
  pecora: { mya: 30, src: 'wPecora' },
  perissodactyla: { mya: 56, src: 'wOddToed' },

  // ── Plants ──
  mesangiospermae: { mya: 145, src: 'wMesangiospermae' },
  monocots_lilies_grasses: { mya: 124, src: 'li2022' }, // stem Liliales, 123.8, after Givnish et al. 2016
  commelinids: { mya: 118, src: 'wMonocots' }, // cladogram label, after Hertweck et al. 2015
  poaceae: { mya: 51.6, src: 'kellogg2009' }, // maize vs rice, after Vicentini et al. 2008
  pentapetalae: { mya: 125, src: 'lu2023' }, // rosids vs asterids, after Zeng et al. 2017
  rosids: { mya: 114, src: 'wang2009' }, // crown rosids "115 … to 113": mean of the two
  eurosids: { mya: 110, src: 'lu2023' }, // malvids vs fabids, after Zeng et al. 2017
  sapindales: { mya: 70, src: 'wang2009' }, // crown Sapindales; estimates run from ~60 to ~125
  rosoideae: { mya: 50, src: 'hibrand2018' },
  prunus: { mya: 58, src: 'su2023' }, // solitary-flower (peach) vs corymbose (cherry) groups
  benincaseae: { mya: 18.1, src: 'xie2019' }, // Cucumis vs the watermelon clade
  ericales: { mya: 98, src: 'alabady2026' }, // sarracenioids vs ericoids, after Rose et al. 2018
  lamiids: { mya: 98, src: 'wikstrom2015' }, // crown core lamiids, separate analysis
  solanum_eggplant: { mya: 14, src: 'sarkinen2013' },
  solanum_tomato_potato: { mya: 8, src: 'sarkinen2013' },
  asteraceae: { mya: 40, src: 'mandel2019' }, // lettuce vs sunflower, inside the 42–37 Eocene radiation
};
