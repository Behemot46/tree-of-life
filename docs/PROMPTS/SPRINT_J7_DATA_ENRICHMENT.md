# Sprint J7 — Data Enrichment & Tree Expansion

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` — resolve merge conflicts first
4. Read js/treeData.js structure — understand node shape and tree hierarchy
5. Count current nodes: `grep -c "id:'" js/treeData.js`
6. Read js/speciesData.js — understand PHOTO_MAP, WIKI_TITLES coverage
7. Read js/dnaSimilarity.js — understand DNA_KNOWN pairs

**After ALL code changes:**
1. Verify all new nodes render correctly in all 3 view modes
2. Verify new PHOTO_MAP entries load images
3. Verify new DNA_KNOWN pairs return results in DNA calculator
4. Verify conservation badges display correctly
5. Commit: `feat: J7 — expand tree to 200+ species with conservation data`
6. Push branch and create PR to main
7. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md

---

## Sprint Goal

Double the tree from 132 to 200+ species. Add IUCN conservation status. Deepen the educational content.

## Tasks

### 1. Add 70+ New Species Nodes

**Priority species to add (organized by domain):**

**Animals — Vertebrates (~25 new):**
- Great white shark, hammerhead shark (Chondrichthyes)
- Seahorse, clownfish, anglerfish (ray-finned fish diversity)
- King cobra, green sea turtle, Komodo dragon (reptile diversity)
- Emperor penguin, peregrine falcon, hummingbird (bird diversity)
- Red kangaroo, koala (marsupials)
- African elephant, lion, tiger, polar bear (charismatic megafauna)
- Bottlenose dolphin, humpback whale (cetaceans beyond blue whale)
- Giant panda, snow leopard (endangered flagships)
- Bald eagle, condor

**Animals — Invertebrates (~15 new):**
- Monarch butterfly, honeybee, dragonfly (insect diversity)
- Giant squid (deep sea)
- Portuguese man o' war (cnidarian)
- Horseshoe crab (living fossil)
- Tardigrade (extremophile)
- Mantis shrimp
- Leafcutter ant, firefly

**Plants (~10 new):**
- Giant sequoia, baobab (iconic trees)
- Venus flytrap (carnivorous)
- Rafflesia (largest flower)
- Welwitschia (living fossil)
- Water lily, orchid (diversity)
- Moss, fern (non-seed plants)

**Fungi (~5 new):**
- Amanita muscaria (iconic)
- Cordyceps (parasitic)
- Truffle
- Lichen (symbiosis example)

**Microbes (~5 new):**
- Tardigrade (if not under animals)
- Diatom
- Paramecium
- Plasmodium (malaria)
- Prochlorococcus (most abundant photosynthesizer)

**For each new node, provide:**
- `id`, `name`, `latin`, `icon` (emoji), `color` (inherit from parent or domain)
- `r` (radius: 8-14 for species, 16-20 for groups)
- `appeared` (Mya), `era` (human-readable)
- `desc` (2-3 sentences), `detail` (3-5 sentences)
- `facts` (3-5 label/value pairs)
- `tags` (2-5 trait chips)
- `funFact` (1 engaging fact)
- `conservation` (IUCN status: CR/EN/VU/NT/LC or null)
- `extinct` (true/false)

### 2. IUCN Conservation Status

Add `conservation` field to ALL nodes where applicable.

**Display in renderPanelContent():**
```html
<span class="conservation-badge conservation-{status}">{status_label}</span>
```

**CSS:**
```css
.conservation-badge { font-size: 10px; padding: 2px 8px; border-radius: 9999px; font-weight: 600; }
.conservation-CR { background: #dc2626; color: white; } /* Critically Endangered */
.conservation-EN { background: #ea580c; color: white; } /* Endangered */
.conservation-VU { background: #f59e0b; color: white; } /* Vulnerable */
.conservation-NT { background: #84cc16; color: #1a1d23; } /* Near Threatened */
.conservation-LC { background: #22c55e; color: #1a1d23; } /* Least Concern */
```

### 3. Expand PHOTO_MAP

Add Wikimedia Commons photo URLs for all new species. Target: 200+ PHOTO_MAP entries.

### 4. Expand DNA_KNOWN

Add 25+ new DNA similarity pairs:
- Human vs new charismatic species (shark, butterfly, tardigrade, etc.)
- Cross-kingdom comparisons
- Target: 60+ total pairs

### 5. Expand FACTS Library

Add 22+ new facts (English only) to js/factLibrary.js:
- Conservation-themed: "X species go extinct every day"
- Amazing abilities: tardigrade survival, mantis shrimp vision
- Scale facts: "The largest organism is a honey mushroom spanning 2,385 acres"
- Target: 40+ total facts

### 6. Add funFact to Existing Nodes

Audit existing 132 nodes. Add `funFact` to any node that currently lacks one.

---

## Success Criteria

- [ ] 200+ total nodes in TREE
- [ ] All new nodes have: id, name, latin, icon, color, appeared, era, desc, facts, tags
- [ ] Conservation status displayed for applicable species
- [ ] PHOTO_MAP covers all new nodes (200+ entries)
- [ ] 60+ DNA_KNOWN pairs
- [ ] 40+ facts in FACTS library
- [ ] All nodes have funFact
- [ ] All 3 view modes render correctly with expanded tree
- [ ] Search finds all new species
- [ ] Zero console errors
