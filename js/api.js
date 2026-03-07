/* ═══════════════════════════════════════════════════════════════
   api.js — Data layer: Open Tree of Life, Wikipedia, iNaturalist
   All calls are CORS-friendly; no API keys required.
   ═══════════════════════════════════════════════════════════════ */

const API = (() => {
  const OTL  = 'https://api.opentreeoflife.org/v3';
  const WIKI = 'https://en.wikipedia.org/api/rest_v1/page/summary';
  const INAT = 'https://api.inaturalist.org/v1';

  /* ── LRU Cache ─────────────────────────────────────────────── */
  const MAX_CACHE = 600;
  const cache = new Map();
  function cacheGet(key) { const v = cache.get(key); if (v) { cache.delete(key); cache.set(key, v); } return v; }
  function cacheSet(key, val) { if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value); cache.set(key, val); }

  async function fetchJSON(url, opts = {}) {
    const key = url + JSON.stringify(opts.body || '');
    const cached = cacheGet(key);
    if (cached) return cached;
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(opts.headers||{}) }, ...opts });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const json = await res.json();
    cacheSet(key, json);
    return json;
  }

  async function postOTL(path, body) {
    return fetchJSON(`${OTL}${path}`, { method: 'POST', body: JSON.stringify(body) });
  }

  /* ── Open Tree of Life ─────────────────────────────────────── */

  /**
   * Get direct children of a taxon node.
   * Returns array of {ott_id, name, rank, num_tips, is_extinct}
   */
  async function getChildren(ottId) {
    try {
      const data = await postOTL('/taxonomy/node_info', {
        ott_id: ottId,
        include_children: true,
        include_lineage: false
      });
      const children = (data.children || [])
        .filter(c => c.name && !c.name.startsWith('mrcaott')) // filter synthetic nodes
        .map(c => ({
          ott_id:    c.ott_id,
          name:      c.name,
          rank:      c.rank || 'no rank',
          num_tips:  c.num_tips || 1,
          is_extinct: !!(c.flags && c.flags.includes('extinct')),
          flags:     c.flags || []
        }));
      return children;
    } catch (e) {
      console.warn('getChildren failed for', ottId, e);
      return [];
    }
  }

  /**
   * Get metadata for a single OTT node (lineage, synonyms, flags).
   */
  async function getNodeInfo(ottId) {
    try {
      return await postOTL('/taxonomy/node_info', {
        ott_id: ottId,
        include_lineage: true,
        include_children: false
      });
    } catch (e) {
      console.warn('getNodeInfo failed for', ottId, e);
      return null;
    }
  }

  /**
   * Autocomplete search for taxon names.
   * Returns array of {ott_id, name, unique_name, rank, score}
   */
  async function searchTaxa(query, limit = 12) {
    if (!query || query.length < 2) return [];
    try {
      const data = await postOTL('/tnrs/autocomplete', {
        name: query,
        context_name: 'Life',
        include_suppressed: false
      });
      return (data || []).slice(0, limit).map(r => ({
        ott_id:      r.ott_id,
        name:        r.name,
        unique_name: r.unique_name || r.name,
        rank:        r.rank || 'no rank',
        is_extinct:  !!(r.flags && r.flags.includes('extinct'))
      }));
    } catch (e) {
      console.warn('searchTaxa failed:', e);
      return [];
    }
  }

  /* ── Wikipedia ─────────────────────────────────────────────── */

  /**
   * Get Wikipedia summary for a taxon name.
   * Returns {extract, thumbnail, page_url} or null.
   */
  async function getWikiSummary(name) {
    if (!name) return null;
    const encoded = encodeURIComponent(name.replace(/ /g, '_'));
    try {
      const data = await fetchJSON(`${WIKI}/${encoded}`);
      if (data.type === 'disambiguation' || !data.extract) return null;
      return {
        extract:   data.extract,
        thumbnail: data.thumbnail?.source || null,
        page_url:  data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encoded}`
      };
    } catch (e) {
      // Try the common name as fallback if scientific name fails
      return null;
    }
  }

  /* ── iNaturalist ───────────────────────────────────────────── */

  /**
   * Get photos for a taxon from iNaturalist.
   * Returns array of {url, attribution, thumb_url}
   */
  async function getINatPhotos(name, limit = 8) {
    if (!name) return [];
    try {
      const search = await fetchJSON(
        `${INAT}/taxa?q=${encodeURIComponent(name)}&per_page=1&rank_level=10,20,30,40,50,60,70`
      );
      const taxon = search.results?.[0];
      if (!taxon) return [];

      const photos = taxon.taxon_photos || [];
      // Also include default_photo
      const result = [];
      if (taxon.default_photo?.medium_url) {
        result.push({
          url:         taxon.default_photo.medium_url,
          thumb_url:   taxon.default_photo.square_url,
          attribution: taxon.default_photo.attribution
        });
      }
      for (const tp of photos) {
        if (!tp.photo) continue;
        const p = tp.photo;
        result.push({
          url:         p.medium_url || p.url,
          thumb_url:   p.square_url || p.url,
          attribution: p.attribution
        });
      }
      return [...new Map(result.map(p => [p.url, p])).values()].slice(0, limit);
    } catch (e) {
      console.warn('getINatPhotos failed for', name, e);
      return [];
    }
  }

  /**
   * Get combined iNaturalist taxon info (common name, conservation, counts).
   */
  async function getINatTaxon(name) {
    if (!name) return null;
    try {
      const search = await fetchJSON(
        `${INAT}/taxa?q=${encodeURIComponent(name)}&per_page=1`
      );
      const t = search.results?.[0];
      if (!t) return null;
      return {
        inat_id:       t.id,
        common_name:   t.preferred_common_name || t.english_common_name || null,
        observations:  t.observations_count || 0,
        conservation:  t.conservation_status?.status_name || null,
        extinct:       t.extinct || false,
        wikipedia_url: t.wikipedia_url || null
      };
    } catch (e) {
      return null;
    }
  }

  /* ── Batch enrichment ──────────────────────────────────────── */

  /**
   * Fully enrich a node: wiki + iNat photos + iNat taxon info.
   * Returns a merged object, never throws.
   */
  async function enrichNode(name, commonName) {
    const [wiki, inatTaxon, photos] = await Promise.allSettled([
      getWikiSummary(name),
      getINatTaxon(name),
      getINatPhotos(name)
    ]);
    return {
      wiki:        wiki.status === 'fulfilled' ? wiki.value : null,
      inat_taxon:  inatTaxon.status === 'fulfilled' ? inatTaxon.value : null,
      photos:      photos.status === 'fulfilled' ? photos.value : []
    };
  }

  return { getChildren, getNodeInfo, searchTaxa, getWikiSummary, getINatPhotos, getINatTaxon, enrichNode };
})();


/* ═══════════════════════════════════════════════════════════════
   INITIAL TREE DATA — hardcoded top 4 levels for instant display.
   Nodes with _children: [] are expandable but not yet loaded.
   ═══════════════════════════════════════════════════════════════ */
const INITIAL_TREE = {
  id: 'ott93302', name: 'Life', common: 'All Life', ott_id: 93302,
  rank: 'no rank', color: '#4a9eff', num_tips: 3000000, divergence_mya: 3800,
  children: [
    {
      id: 'ott844192', name: 'Bacteria', common: 'Bacteria', ott_id: 844192,
      rank: 'domain', color: '#e8a838', num_tips: 15000, divergence_mya: 3500,
      children: [
        { id: 'ott860828', name: 'Pseudomonadota', common: 'Proteobacteria', ott_id: 860828, rank: 'phylum', color: '#e8a838', num_tips: 2000, _children: [] },
        { id: 'ott356462', name: 'Firmicutes', common: 'Firmicutes', ott_id: 356462, rank: 'phylum', color: '#e8a838', num_tips: 1000, _children: [] },
        { id: 'ott132745', name: 'Actinomycetota', common: 'Actinobacteria', ott_id: 132745, rank: 'phylum', color: '#e8a838', num_tips: 800, _children: [] },
        { id: 'ott878647', name: 'Cyanobacteria', common: 'Cyanobacteria', ott_id: 878647, rank: 'phylum', color: '#e8a838', num_tips: 300, _children: [] },
        { id: 'ott490099', name: 'Spirochaetota', common: 'Spirochaetes', ott_id: 490099, rank: 'phylum', color: '#e8a838', num_tips: 150, _children: [] }
      ]
    },
    {
      id: 'ott996421', name: 'Archaea', common: 'Archaea', ott_id: 996421,
      rank: 'domain', color: '#9b59b6', num_tips: 2000, divergence_mya: 3500,
      children: [
        { id: 'ott4795',    name: 'Euryarchaeota',   common: 'Euryarchaeota', ott_id: 4795,    rank: 'phylum', color: '#9b59b6', num_tips: 500, _children: [] },
        { id: 'ott10399',   name: 'Thermoproteota',  common: 'Crenarchaeota', ott_id: 10399,   rank: 'phylum', color: '#9b59b6', num_tips: 200, _children: [] },
        { id: 'ott1063543', name: 'Nitrososphaerota', common: 'Thaumarchaeota', ott_id: 1063543, rank: 'phylum', color: '#9b59b6', num_tips: 100, _children: [] }
      ]
    },
    {
      id: 'ott304358', name: 'Eukaryota', common: 'Eukaryotes', ott_id: 304358,
      rank: 'domain', color: '#4a9eff', num_tips: 300000, divergence_mya: 2100,
      children: [
        {
          id: 'ott631176', name: 'Viridiplantae', common: 'Plants', ott_id: 631176,
          rank: 'kingdom', color: '#27ae60', num_tips: 350000, divergence_mya: 1000,
          children: [
            { id: 'ott100248', name: 'Bryophyta',     common: 'Mosses',           ott_id: 100248, rank: 'phylum', color: '#27ae60', num_tips: 12000, _children: [] },
            { id: 'ott341609', name: 'Polypodiopsida', common: 'Ferns',           ott_id: 341609, rank: 'class',  color: '#27ae60', num_tips: 10000, _children: [] },
            { id: 'ott36652',  name: 'Gymnospermae',  common: 'Conifers & Cycads', ott_id: 36652,  rank: 'no rank', color: '#27ae60', num_tips: 1000, _children: [] },
            { id: 'ott316264', name: 'Magnoliopsida', common: 'Flowering Plants', ott_id: 316264, rank: 'class',  color: '#27ae60', num_tips: 300000, _children: [] }
          ]
        },
        {
          id: 'ott352914', name: 'Fungi', common: 'Fungi', ott_id: 352914,
          rank: 'kingdom', color: '#e67e22', num_tips: 120000, divergence_mya: 1000,
          children: [
            { id: 'ott439373', name: 'Ascomycota',      common: 'Sac Fungi',   ott_id: 439373, rank: 'phylum', color: '#e67e22', num_tips: 64000, _children: [] },
            { id: 'ott634628', name: 'Basidiomycota',   common: 'Club Fungi',  ott_id: 634628, rank: 'phylum', color: '#e67e22', num_tips: 32000, _children: [] },
            { id: 'ott801601', name: 'Chytridiomycota', common: 'Chytrids',    ott_id: 801601, rank: 'phylum', color: '#e67e22', num_tips: 700,   _children: [] }
          ]
        },
        {
          id: 'ott691846', name: 'Metazoa', common: 'Animals', ott_id: 691846,
          rank: 'kingdom', color: '#2980b9', num_tips: 1500000, divergence_mya: 800,
          children: [
            { id: 'ott67819',  name: 'Porifera',       common: 'Sponges',              ott_id: 67819,  rank: 'phylum', color: '#2980b9', num_tips: 8000,  _children: [] },
            { id: 'ott641489', name: 'Cnidaria',       common: 'Jellyfish & Corals',   ott_id: 641489, rank: 'phylum', color: '#2980b9', num_tips: 11000, _children: [] },
            { id: 'ott802117', name: 'Mollusca',       common: 'Mollusks',             ott_id: 802117, rank: 'phylum', color: '#2980b9', num_tips: 85000, _children: [] },
            { id: 'ott343420', name: 'Annelida',       common: 'Segmented Worms',      ott_id: 343420, rank: 'phylum', color: '#2980b9', num_tips: 17000, _children: [] },
            {
              id: 'ott632179', name: 'Arthropoda', common: 'Arthropods', ott_id: 632179,
              rank: 'phylum', color: '#2980b9', num_tips: 1000000,
              children: [
                { id: 'ott496100', name: 'Insecta',      common: 'Insects',         ott_id: 496100, rank: 'class', color: '#2980b9', num_tips: 1000000, _children: [] },
                { id: 'ott51963',  name: 'Arachnida',   common: 'Spiders & Scorpions', ott_id: 51963,  rank: 'class', color: '#2980b9', num_tips: 100000, _children: [] },
                { id: 'ott392534', name: 'Malacostraca', common: 'Crabs & Shrimp',  ott_id: 392534, rank: 'class', color: '#2980b9', num_tips: 25000,  _children: [] },
                { id: 'ott573853', name: 'Myriapoda',   common: 'Centipedes',       ott_id: 573853, rank: 'subphylum', color: '#2980b9', num_tips: 13000, _children: [] }
              ]
            },
            { id: 'ott451764', name: 'Echinodermata', common: 'Sea Stars & Urchins', ott_id: 451764, rank: 'phylum', color: '#2980b9', num_tips: 7000, _children: [] },
            {
              id: 'ott125642', name: 'Chordata', common: 'Chordates', ott_id: 125642,
              rank: 'phylum', color: '#2980b9', num_tips: 65000, divergence_mya: 500,
              children: [
                { id: 'ott1308461', name: 'Actinopterygii', common: 'Ray-finned Fishes', ott_id: 1308461, rank: 'class', color: '#2980b9', num_tips: 30000, _children: [] },
                { id: 'ott83373',   name: 'Chondrichthyes', common: 'Sharks & Rays',     ott_id: 83373,   rank: 'class', color: '#2980b9', num_tips: 1100,  _children: [] },
                { id: 'ott544595',  name: 'Amphibia',       common: 'Amphibians',        ott_id: 544595,  rank: 'class', color: '#2980b9', num_tips: 8000,  _children: [] },
                { id: 'ott26334',   name: 'Reptilia',        common: 'Reptiles',         ott_id: 26334,   rank: 'class', color: '#2980b9', num_tips: 10000, _children: [] },
                { id: 'ott212314',  name: 'Aves',           common: 'Birds',             ott_id: 212314,  rank: 'class', color: '#2980b9', num_tips: 10000, _children: [] },
                {
                  id: 'ott244265', name: 'Mammalia', common: 'Mammals', ott_id: 244265,
                  rank: 'class', color: '#2980b9', num_tips: 5500, divergence_mya: 160,
                  children: [
                    { id: 'ott372676', name: 'Monotremata',  common: 'Platypus & Echidnas', ott_id: 372676, rank: 'order', color: '#2980b9', num_tips: 5,    _children: [] },
                    { id: 'ott485902', name: 'Marsupialia',  common: 'Marsupials',           ott_id: 485902, rank: 'order', color: '#2980b9', num_tips: 330,  _children: [] },
                    { id: 'ott341475', name: 'Rodentia',     common: 'Rodents',              ott_id: 341475, rank: 'order', color: '#2980b9', num_tips: 2200, _children: [] },
                    { id: 'ott84017',  name: 'Chiroptera',   common: 'Bats',                 ott_id: 84017,  rank: 'order', color: '#2980b9', num_tips: 1400, _children: [] },
                    { id: 'ott44568',  name: 'Carnivora',    common: 'Carnivores',           ott_id: 44568,  rank: 'order', color: '#2980b9', num_tips: 280,  _children: [] },
                    { id: 'ott698424', name: 'Cetacea',      common: 'Whales & Dolphins',    ott_id: 698424, rank: 'order', color: '#2980b9', num_tips: 90,   _children: [] },
                    { id: 'ott913935', name: 'Primates',     common: 'Primates',             ott_id: 913935, rank: 'order', color: '#2980b9', num_tips: 500,  _children: [] },
                    { id: 'ott848481', name: 'Artiodactyla', common: 'Even-toed Ungulates',  ott_id: 848481, rank: 'order', color: '#2980b9', num_tips: 280,  _children: [] }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'ott266751', name: 'Chromista', common: 'Chromists', ott_id: 266751,
          rank: 'kingdom', color: '#1abc9c', num_tips: 25000, divergence_mya: 1200,
          _children: []
        }
      ]
    }
  ]
};

/* Notable species for "Discover" random feature */
const NOTABLE_SPECIES = [
  { name: 'Homo sapiens',         common: 'Human',            ott_id: 770315  },
  { name: 'Pan troglodytes',      common: 'Chimpanzee',       ott_id: 417950  },
  { name: 'Aquila chrysaetos',    common: 'Golden Eagle',     ott_id: 839028  },
  { name: 'Carcharodon carcharias', common: 'Great White Shark', ott_id: 105721 },
  { name: 'Octopus vulgaris',     common: 'Common Octopus',   ott_id: 631695  },
  { name: 'Ginkgo biloba',        common: 'Ginkgo',           ott_id: 535022  },
  { name: 'Quercus robur',        common: 'English Oak',      ott_id: 535016  },
  { name: 'Agaricus bisporus',    common: 'Button Mushroom',  ott_id: 52392   },
  { name: 'Ailuropoda melanoleuca', common: 'Giant Panda',    ott_id: 254646  },
  { name: 'Mantis religiosa',     common: 'Praying Mantis',   ott_id: 205263  },
  { name: 'Aequorea victoria',    common: 'Crystal Jellyfish',ott_id: 367994  },
  { name: 'Arabidopsis thaliana', common: 'Thale Cress',      ott_id: 231529  },
  { name: 'Escherichia coli',     common: 'E. coli',          ott_id: 474506  },
  { name: 'Turritopsis dohrnii',  common: 'Immortal Jellyfish', ott_id: 1088415 },
  { name: 'Deinococcus radiodurans', common: 'Radiodurans',   ott_id: 463094  }
];
