# P32 — Data Enrichment (300+ Nodes)

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p32** (Tier 4 — Content).

**Your scope:** Expand the phylogenetic tree from ~130 to 300+ nodes by adding new species across all domains. Add IUCN conservation status, Wikipedia summary fetching, and fossil record data. You primarily touch `js/treeData.js` and `js/speciesData.js`. You do NOT touch rendering logic, layout algorithms, or UI code (the tree should automatically display new nodes).

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `data:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Triple the tree's species coverage for a richer, more educational experience.

### Success Criteria

1. TREE object contains 300+ nodes (up from ~130)
2. New nodes follow the exact same data shape as existing ones
3. Every domain gets meaningful additions (not just charismatic animals)
4. PHOTO_MAP expanded for new species (Wikimedia URLs)
5. WIKI_TITLES expanded for new species
6. IUCN conservation status field added to relevant species
7. All new nodes render correctly in all 3 view modes
8. Search finds all new species
9. No performance degradation (benchmark render time)
10. Zero console errors

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

## Implementation Plan

### Phase A: Plan new species list

Target additions by domain (~170 new nodes):

- **Bacteria** (+10): E. coli, Streptococcus, Staphylococcus, Lactobacillus, Helicobacter, Clostridium, Mycobacterium, Rhizobium, Borrelia, Treponema
- **Archaea** (+5): Halobacterium, Thermoplasma, Methanococcus, Sulfolobus, Pyrococcus
- **Protists** (+8): Amoeba, Paramecium, Euglena, Trypanosoma, Giardia, Toxoplasma, Volvox, Foraminifera
- **Fungi** (+8): Amanita, Chanterelle, Morel, Truffle, Cordyceps, Aspergillus, Candida, Mucor
- **Plants** (+20): various flowering plants, grasses, ferns, mosses, liverworts
- **Invertebrates** (+30): additional arthropods, mollusks, echinoderms, cnidarians, worms
- **Fish** (+15): salmon, tuna, seahorse, anglerfish, pufferfish, rays, lampreys, etc.
- **Amphibians** (+8): various frogs, salamanders, caecilians
- **Reptiles** (+12): various snakes, lizards, geckos, iguanas, monitors
- **Birds** (+20): eagles, penguins, hummingbirds, parrots, crows, owls, flamingos, etc.
- **Mammals** (+30): additional primates, rodents, bats, marine mammals, ungulates, carnivores

### Phase B: Add IUCN conservation status

1. Add optional `iucn` field to node data shape:
   ```js
   iucn: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX' | null
   ```
2. Add IUCN status to all extant species where data is available
3. This is data-only — panel rendering of IUCN badges is a separate concern

### Phase C: Add nodes to TREE

1. Add each new species to the correct parent's children array
2. Ensure IDs are unique and kebab-case
3. Include all required fields: id, icon, color, r, appeared, name, latin, era, desc, detail, facts, tags
4. Use scientifically accurate `appeared` values (Mya)
5. Use domain-appropriate colors (inherit from parent or use standard domain palette)

### Phase D: Expand PHOTO_MAP and WIKI_TITLES

1. For each new species, find a Wikimedia Commons photo URL
2. Add to PHOTO_MAP in `js/speciesData.js`
3. Add Wikipedia article title to WIKI_TITLES
4. Target: 90%+ coverage for new species

### Phase E: Validation

1. Run validation script (p21) if available
2. Manual check: all IDs unique, all required fields present
3. Test tree renders with 300+ nodes — check performance

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `js/treeData.js` | Add ~170 new nodes to TREE |
| `js/speciesData.js` | Expand PHOTO_MAP and WIKI_TITLES |
| `PROJECT_PROGRESS.md` | Add p32 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `index.html` — no UI changes needed
- `js/imageLoader.js` — image system
- Layout algorithms — should work automatically with more nodes
- Panel template — should work with new data fields

---

## Testing Checklist

1. `node serve.js` → tree renders with 300+ nodes
2. All 3 view modes work (radial, cladogram, chronological)
3. New species panels open with correct data
4. Search finds new species
5. PHOTO_MAP photos load for new species
6. No overlapping labels (label collision system handles it)
7. Performance: render time < 50ms at 300 nodes
8. `Object.keys(nodeMap).length` → 300+
9. Zero console errors
10. All domains have meaningful representation

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
