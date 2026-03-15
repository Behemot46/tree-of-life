# P32 — Data Enrichment (300+ Species)

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p32** — expanding the tree from ~130 nodes to 300+ species with richer data.

**Your scope:** Expand `js/treeData.js` TREE with new nodes, add PHOTO_MAP entries in `js/speciesData.js`, add WIKI_TITLES entries, and ensure all new nodes have complete data (desc, detail, facts, tags, appeared, era). You do NOT modify rendering logic, layout algorithms, or UI code.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Expand the tree to 300+ scientifically accurate species nodes, covering all major taxonomic groups with balanced representation and rich educational data.

### Success Criteria

1. 300+ total nodes in TREE (up from ~130)
2. Balanced coverage: no single domain has >40% of new nodes
3. Every new node has: `id`, `name`, `latin`, `icon`, `color`, `r`, `appeared`, `era`, `desc`, `detail`, `facts[]`, `tags[]`
4. New nodes placed correctly in the phylogenetic tree (proper parent-child relationships)
5. PHOTO_MAP entries for at least 80% of new species (Wikimedia Commons URLs)
6. WIKI_TITLES entries for all new species
7. IUCN conservation status added to node.facts where applicable
8. `appeared` values scientifically accurate (million years ago)
9. Tree renders without layout issues (radial, cladogram, chronological)
10. Search index picks up new species (EN + HE + RU names where possible)
11. Zero console errors

---

## Expansion Targets

### By domain (approximate new node targets)

| Domain | Current | Target | Gap |
|--------|---------|--------|-----|
| Bacteria | ~8 | 20 | +12 |
| Archaea | ~5 | 12 | +7 |
| Protists | ~6 | 15 | +9 |
| Fungi | ~6 | 18 | +12 |
| Plants | ~15 | 40 | +25 |
| Invertebrates | ~20 | 50 | +30 |
| Fish | ~8 | 20 | +12 |
| Amphibians | ~5 | 12 | +7 |
| Reptiles | ~8 | 18 | +10 |
| Birds | ~10 | 25 | +15 |
| Mammals | ~20 | 45 | +25 |
| Hominins | 28 | 28 | 0 |

### Priority additions (iconic/educational species)

**Bacteria:** MRSA, Helicobacter pylori, Rhizobium, Magnetotactic bacteria
**Archaea:** Lokiarchaeota, Asgard archaea, halophiles
**Protists:** Paramecium, Euglena, diatoms, dinoflagellates
**Fungi:** Cordyceps, truffle, death cap, chanterelle, lichen
**Plants:** Sequoia, Welwitschia, Venus flytrap, bamboo, Rafflesia, baobab
**Invertebrates:** Horseshoe crab, mantis shrimp, tardigrade, nautilus, monarch butterfly, Portuguese man o' war
**Fish:** Coelacanth, anglerfish, seahorse, manta ray, lungfish
**Amphibians:** Axolotl, poison dart frog, caecilian, hellbender
**Reptiles:** Tuatara, Komodo dragon, leatherback turtle, gharial
**Birds:** Kiwi, albatross, hummingbird, secretary bird, kakapo, archaeopteryx
**Mammals:** Pangolin, narwhal, aye-aye, echidna, Tasmanian devil, snow leopard

### Conservation status

Add IUCN Red List status to `node.facts` for extant species:
```js
facts: [
  ...,
  { l: 'Conservation', v: 'Critically Endangered (IUCN)' }
]
```

Categories: LC, NT, VU, EN, CR, EW, EX

---

## Node data template

```js
{
  id: 'species-id',
  icon: '🦎',
  color: '#parentColor',
  r: 10,
  appeared: 250,
  name: 'Common Name',
  latin: 'Genus species',
  era: 'Late Triassic',
  desc: 'One-sentence summary of what makes this species notable.',
  detail: 'Longer paragraph with evolutionary context, habitat, behavior, and significance.',
  facts: [
    { l: 'Size', v: '1.5 m' },
    { l: 'Diet', v: 'Carnivore' },
    { l: 'Habitat', v: 'Tropical forests' },
    { l: 'Conservation', v: 'Vulnerable (IUCN)' }
  ],
  tags: ['reptile', 'predator', 'island-endemic']
}
```

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `js/treeData.js` | Add ~170 new species nodes to TREE |
| `js/speciesData.js` | Add PHOTO_MAP entries (Wikimedia URLs), WIKI_TITLES entries |
| `PROJECT_PROGRESS.md` | Add p32 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `index.html` — rendering/UI code
- `js/imageLoader.js` — image system
- `js/uiData.js` — translations (unless adding search terms for new species)
- Layout algorithms

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Tree renders with 300+ nodes — no overlapping or missing nodes
3. New species appear under correct parent nodes
4. Click any new species → panel shows complete data
5. Search finds new species by common name and latin name
6. Radial view: tree balanced, not lopsided
7. Cladogram view: all leaves render
8. Chronological view: appeared dates position correctly
9. PHOTO_MAP entries load photos in panel
10. Mobile: tree still navigable with more nodes
11. Zero console errors
12. `Object.keys(nodeMap).length` → 300+
