# Data Schema

This document describes the data structures used in the Tree of Life project.

---

## Tree Node (`INITIAL_TREE` and dynamic nodes)

Defined in `js/api.js`. Each node in the tree follows this shape:

```js
{
  id:             "ott93302",        // String — "ott" + ott_id (used as D3 key)
  name:           "Life",            // String — scientific/taxonomic name
  common:         "All Life",        // String — common name (English)
  ott_id:         93302,             // Number — Open Tree of Life taxon ID
  rank:           "no rank",         // String — taxonomic rank (domain, phylum, class, order, family, genus, species, "no rank")
  color:          "#4a9eff",         // String — hex color for rendering
  num_tips:       3000000,           // Number — estimated number of descendant species
  divergence_mya: 3800,              // Number (optional) — million years ago divergence estimate

  // Tree structure — exactly one of these:
  children:  [ ...nodes ],           // Array — currently expanded children (renders as open node)
  _children: [ ...nodes ],           // Array — collapsed children (renders as closed node, click to expand)
                                     // _children: [] means expandable but not yet loaded from API
}
```

### Taxon Ranks (in use)

`domain` > `kingdom` > `phylum` > `subphylum` > `class` > `order` > `family` > `genus` > `species` > `no rank`

---

## API-Enriched Node (from `API.enrichNode()`)

When a node is clicked and the panel opens, it is enriched with:

```js
{
  wiki: {
    extract:   "Text summary from Wikipedia",
    thumbnail: "https://...",          // or null
    page_url:  "https://en.wikipedia.org/wiki/..."
  },
  inat_taxon: {
    inat_id:      12345,
    common_name:  "English Oak",
    observations: 150000,
    conservation: "Least Concern",     // or null
    extinct:      false,
    wikipedia_url: "https://..."       // or null
  },
  photos: [
    {
      url:         "https://...medium.jpg",
      thumb_url:   "https://...square.jpg",
      attribution: "(c) Author, CC BY-NC"
    }
  ]
}
```

---

## Hominin Data (in `index.html`)

The hominin section uses a separate dataset (currently embedded in `index.html`, to be extracted to `js/homininsData.js` in Prompt 1).

Each hominin entry:

```js
{
  id:          "homo-sapiens",          // String — slug ID
  name:        "Homo sapiens",          // String — scientific name
  period:      "300,000 ya – present",  // String — temporal range
  brain:       1350,                    // Number — brain volume in cc
  height:      170,                     // Number — average height in cm
  status:      "extant",               // String — "extant" | "extinct"
  tools:       "Advanced stone tools", // String — tool use description
  region:      "Global",               // String — geographic range
  description: "...",                  // String — paragraph description
  image:       "assets/..."            // String — image path or URL
}
```

---

## i18n Translation Keys

See `docs/I18N_GUIDE.md` for the full key list and how to add a new language.

---

## NOTABLE_SPECIES (in `js/api.js`)

Used by the "Discover" random species button:

```js
[
  { name: "Homo sapiens", common: "Human", ott_id: 770315 },
  ...
]
```

Fields: `name` (scientific), `common` (English common name), `ott_id` (Open Tree of Life ID).
