# P32 — Data Enrichment (300+ Nodes)

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p32** (Tier 4 — Content).

**Your scope:** Expand the phylogenetic tree from ~130 to 300+ nodes by adding new species across all domains. Add IUCN conservation status, PHOTO_MAP entries, and WIKI_TITLES entries. You primarily touch `js/treeData.js` and `js/speciesData.js`. You do NOT touch rendering logic, layout algorithms, or UI code (the tree should automatically display new nodes).

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `data:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Triple the tree's species coverage for a richer, more educational experience.

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

## Context

### Current coverage (~130 nodes)

- Bacteria: ~8 nodes
- Archaea: ~4 nodes
- Protists: ~6 nodes
- Fungi: ~6 nodes
- Plants: ~12 nodes
- Animals: ~80 nodes (invertebrates + vertebrates)
- Hominins: 28 nodes (via buildHomininTree)

### Node data shape

```js
{
  id: string, icon: string, color: string, r: number,
  appeared: number, name: string, latin: string, era: string,
  desc: string, detail: string,
  facts: [{l, v}], tags: string[],
  children: Node[],
  extinct: boolean  // optional
}
```

### Adding new species

1. Add node object to appropriate parent's `children` array in `js/treeData.js`
2. Add PHOTO_MAP entry in `js/speciesData.js`
3. Add WIKI_TITLES entry in `js/speciesData.js`
4. `preprocess()` automatically sets `_parent`, `depth`, populates `nodeMap`
5. `buildSearchIndex()` automatically includes new nodes
6. `render()` automatically renders new nodes

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

**Bacteria:** MRSA, Helicobacter pylori, Rhizobium, Magnetotactic bacteria, Lactobacillus, Clostridium, Mycobacterium, Borrelia
**Archaea:** Lokiarchaeota, Asgard archaea, halophiles, Thermoplasma, Sulfolobus
**Protists:** Paramecium, Euglena, diatoms, dinoflagellates, Trypanosoma, Giardia, Toxoplasma
**Fungi:** Cordyceps, truffle, death cap, chanterelle, lichen, Aspergillus, Candida
**Plants:** Sequoia, Welwitschia, Venus flytrap, bamboo, Rafflesia, baobab, ferns, mosses
**Invertebrates:** Horseshoe crab, mantis shrimp, tardigrade, nautilus, monarch butterfly, Portuguese man o' war
**Fish:** Coelacanth, anglerfish, seahorse, manta ray, lungfish, pufferfish
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

## Implementation Plan

### Phase A: Plan new species list

Review expansion targets above and finalize the ~170 new species to add.

### Phase B: Add nodes to TREE

1. Add each new species to the correct parent's children array in `js/treeData.js`
2. Ensure IDs are unique and kebab-case
3. Include all required fields
4. Use scientifically accurate `appeared` values (Mya)
5. Use domain-appropriate colors (inherit from parent)

### Phase C: Expand PHOTO_MAP and WIKI_TITLES

1. For each new species, find a Wikimedia Commons photo URL
2. Add to PHOTO_MAP in `js/speciesData.js`
3. Add Wikipedia article title to WIKI_TITLES
4. Target: 80%+ coverage for new species

### Phase D: Validation

1. Run validation script (p21) if available
2. Manual check: all IDs unique, all required fields present
3. Test tree renders with 300+ nodes — check performance

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
- Layout algorithms — should work automatically with more nodes

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

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p32-data-enrichment`
- PR title: `data: expand tree to 300+ species with IUCN status and Wikimedia photos`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `data:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p32 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
