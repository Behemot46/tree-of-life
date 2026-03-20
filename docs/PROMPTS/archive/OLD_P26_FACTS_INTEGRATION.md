# P26a — 130 Facts Pack Integration

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p26a** — integrating a large facts pack across the website.

**Your scope:** Expand the fact library, wire facts into multiple UI surfaces (panel, tooltips, loading, discovery), and ensure trilingual support. You touch `js/factLibrary.js`, `js/speciesData.js` (ENRICHMENT only), `js/uiData.js` (translations), and specific rendering callsites in `index.html`. You do NOT modify `render()` tree layout, `NODE_ICONS`, `buildHomininTree()`, `toggleDomain()`, or any structural/layout code.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Integrate ~130 curated facts into the Tree of Life, distributing them wisely across multiple surfaces so users encounter fascinating information naturally throughout their exploration.

### Success Criteria

1. ~130 facts in the library, each tagged by species/domain and classified by surface suitability
2. Facts appear in **5 surfaces**: loading screen, species panel, node hover tooltip, discovery carousel, random-fact button
3. Every fact is trilingual (EN/HE/RU)
4. Facts are scientifically accurate and educational
5. Each fact is tagged with `species` (node ID linkage) so the right fact appears on the right panel
6. No fact appears in an inappropriate context (e.g., a bacteria fact on a mammal panel)
7. Discovery/random surfaces don't repeat recently shown facts (session dedup)
8. Zero console errors, no performance impact

---

## Context: Current Facts Infrastructure

### 1. factLibrary.js (18 facts)

```js
const FACTS = (() => {
  const facts = [
    { id: 'load_01', en: '...', he: '...', ru: '...', tags: ['kinship','general'], loading: true },
    // ... 18 total
  ];
  return { getLoadingFact, getAll, getById, getByTag, getLoadingPool, facts };
})();
```

- Used only on the **splash/loading screen** via `FACTS.getLoadingFact(currentLang)` (index.html ~line 3641)
- All 18 facts have `loading: true`
- Tags: general, genetics, plants, fungi, animals, protists, bacteria, humans, deep-time, ecology, etc.
- API: `getLoadingFact(lang)`, `getAll()`, `getById(id)`, `getByTag(tag)`, `getLoadingPool()`

### 2. ENRICHMENT in speciesData.js (~46 entries)

```js
const ENRICHMENT = {
  'luca': { altFacts: ['...', '...'], links: [{label, url}] },
  'bacteria': { altFacts: ['...'], links: [...] },
  // ~46 species
};
```

- Patched into `nodeMap` at init time (index.html ~line 1618): `node.altFacts = data.altFacts`
- **English only** — no HE/RU translations
- `altFacts` are longer, species-specific educational paragraphs
- `links` are external resource URLs (Wikipedia, Khan Academy, etc.)
- Currently **NOT rendered in the panel** — the data is patched but the panel template doesn't use `node.altFacts` or `node.links`

### 3. node.funFact (per-node, in treeData.js)

- Some TREE nodes have a `funFact` string property
- Rendered in panel as a "DID YOU KNOW" box (index.html ~line 2656)
- English only, not all nodes have one

### Key observation

The ENRICHMENT `altFacts` and `links` data is loaded and patched but **never displayed**. This is a wasted asset. The facts pack should fix this gap.

---

## Implementation Plan

### Phase A: Expand factLibrary.js to ~130 facts

1. **Keep existing 18 facts** unchanged (backward compatible)
2. **Add ~112 new facts**, each with:
   ```js
   {
     id: 'fact_XXX',           // stable unique ID
     en: 'English text',
     he: 'Hebrew text',
     ru: 'Russian text',
     tags: ['domain', 'topic'],  // for filtering
     species: 'node-id',         // links to a specific tree node (null = general)
     loading: true/false,        // suitable for splash screen?
     panel: true/false,          // suitable for species panel "Did You Know"?
     tooltip: true/false,        // suitable for hover tooltip?
     discovery: true/false       // suitable for discovery carousel?
   }
   ```

3. **Fact categories** to cover (aim for breadth across the tree):
   - **Bacteria & Archaea** (~15 facts): extremophiles, gut microbiome, antibiotic resistance, CRISPR origins, cyanobacteria oxygen
   - **Protists** (~8 facts): diatoms, algae, malaria parasite, slime molds
   - **Fungi** (~10 facts): mycorrhizal networks, largest organism, bioluminescent fungi, yeast, penicillin
   - **Plants** (~15 facts): oldest tree, plant communication, carnivorous plants, photosynthesis efficiency, seed dormancy
   - **Invertebrates** (~15 facts): octopus intelligence, ant supercolonies, jellyfish immortality, coral symbiosis, silk strength
   - **Fish & Amphibians** (~10 facts): electric eels, coelacanth, axolotl regeneration, shark electroreception
   - **Reptiles & Birds** (~12 facts): dinosaur descendants, migration records, crocodilian parenting, chameleon color
   - **Mammals** (~15 facts): whale songs, elephant memory, bat echolocation, platypus electroreception, naked mole rat longevity
   - **Human evolution** (~15 facts): DNA with Neanderthals, brain evolution, bipedalism, fire, language origins
   - **General/cross-domain** (~15 facts): convergent evolution, mass extinctions, horizontal gene transfer, endosymbiosis, deep time scale

4. **Quality standards**:
   - Each fact must be scientifically accurate (cite source mentally)
   - Short enough for a tooltip (≤ 120 chars for tooltip-suitable facts)
   - Panel-suitable facts can be longer (up to ~200 chars)
   - Loading-suitable facts should be awe-inspiring one-liners
   - Hebrew and Russian translations must be natural, not machine-translated-sounding

### Phase B: Expand FACTS API

Add new methods to the FACTS module:

```js
/** Get facts linked to a specific species/node ID */
function getForSpecies(nodeId) {
  return facts.filter(f => f.species === nodeId);
}

/** Get a random panel-suitable fact for a species (or general if none) */
function getPanelFact(nodeId, lang) {
  const pool = facts.filter(f => f.panel && (f.species === nodeId || f.species === null));
  if (!pool.length) return null;
  const f = pool[Math.floor(Math.random() * pool.length)];
  return f[lang] || f.en;
}

/** Get a random tooltip fact for a species */
function getTooltipFact(nodeId, lang) {
  const pool = facts.filter(f => f.tooltip && (f.species === nodeId || matchesDomain(f, nodeId)));
  if (!pool.length) return null;
  const f = pool[Math.floor(Math.random() * pool.length)];
  return f[lang] || f.en;
}

/** Get a random discovery fact (not recently shown) */
function getDiscoveryFact(lang, shownIds = []) {
  const pool = facts.filter(f => f.discovery && !shownIds.includes(f.id));
  if (!pool.length) return getDiscoveryFact(lang, []); // reset if exhausted
  const f = pool[Math.floor(Math.random() * pool.length)];
  return { ...f, text: f[lang] || f.en };
}

/** Check if a fact's tags match a node's domain ancestry */
function matchesDomain(fact, nodeId) { ... }
```

### Phase C: Wire facts into the species panel

In `renderPanelContent()` (~line 2656), enhance the "DID YOU KNOW" section:

1. **Primary source**: `node.funFact` (existing per-node fact from treeData.js)
2. **Secondary source**: `FACTS.getPanelFact(node.id, currentLang)` — trilingual fact from library
3. **Tertiary source**: `node.altFacts` from ENRICHMENT (English-only fallback)
4. Show 1-2 facts, not all — rotate on each panel open

**Important**: Only ADD to the existing "DID YOU KNOW" rendering block. Do NOT restructure the panel template — p22 handles panel redesign.

### Phase D: Wire facts into node hover tooltip

The tooltip element (`#tooltip`, index.html ~line 1135 area) currently shows node name on hover. Enhance:

1. Below the node name, add a one-liner fact if available
2. Use `FACTS.getTooltipFact(node.id, currentLang)`
3. Keep tooltip compact — fact text in smaller font (11px), italic, max 1 line with ellipsis
4. Only show if a relevant fact exists (don't force generic facts into every tooltip)

### Phase E: Discovery fact toast

Show a random "Did You Know?" toast when users click a discovery button or after jumping to a random species.

**UI placement rules — CRITICAL to avoid overlap with existing fixed elements:**

The current layout has these fixed-position elements:
```
TOP-LEFT:      #nav-ctrl (back/home buttons) — top:4.2rem, left:1.2rem, z:250
TOP-CENTER:    #search-wrap — top:1rem, center, z:300
TOP-RIGHT:     #lang-switcher — top:3.2rem, right:1.2rem, z:400
               #theme-btn — top:5.2rem, right:1.2rem, z:400
               #view-toggle — top:5.5rem, right:1.2rem, z:300
BOTTOM-LEFT:   #legend — bottom:4.5rem, left:1.2rem, z:200
               #btn-dna-calc — bottom:5.5rem, left:1.2rem, z:200
BOTTOM-RIGHT:  #zoom-ctrl — bottom:4.5rem, right:1.2rem, z:200
               #btn-hominin — bottom:4.5rem, right:5rem, z:200
BOTTOM-FULL:   #timeline — bottom:0, full-width, z:200
```

**The discovery fact toast MUST:**
1. Appear as a **top-center toast** (below search bar, ~top:5rem) — the only safe zone that doesn't collide
2. OR appear as a **center-screen overlay** with backdrop (like the DNA panel at z:1100)
3. Auto-dismiss after 6-8 seconds or on click
4. NOT be a fixed button in corners — all corners are occupied
5. z-index: at least 500 (above most controls, below DNA panel's 1100)

**Trigger options (pick one, don't add a new corner button):**
- Option A: After `#btn-random` (🎲) jumps to a random species, auto-show a fact toast about that species above the panel
- Option B: Add the 💡 icon as a 4th button INSIDE `#zoom-ctrl` (it's a flex column, adding one more button is safe)
- Option C: Show a fact in the panel's "DID YOU KNOW" section when navigating to any species (no new UI element needed)

**Mobile (< 768px):**
- Toast should be full-width with padding, centered, max-width:90vw
- Must not overlap with the bottom timeline or top search bar
- Safe zone: vertical center of screen

### Phase F: Migrate ENRICHMENT altFacts to factLibrary (optional stretch)

If time permits, migrate the ~46 ENRICHMENT `altFacts` entries into the FACTS library format:
- Convert each string to a trilingual fact object with `species` linkage
- Mark as `panel: true, discovery: true`
- This unifies the two fact systems into one

If not enough time, leave ENRICHMENT as-is — it still works via the nodeMap patch.

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `js/factLibrary.js` | Expand from 18 to ~130 facts, add new API methods (getForSpecies, getPanelFact, getTooltipFact, getDiscoveryFact) |
| `index.html` | Wire facts into panel "DID YOU KNOW" section (~line 2656), tooltip enhancement, discovery button/toast. Add CSS for fact toast if needed. |
| `PROJECT_PROGRESS.md` | Add p26a completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` function — tree layout/rendering
- `NODE_ICONS` / `getIconGroup()` — node icon system
- `buildHomininTree()` — hominin tree structure
- `toggleDomain()` / `resetDomains()` — legend filtering
- `js/treeData.js` — don't modify TREE node data (existing `funFact` properties stay)
- `js/imageLoader.js` — image system
- Panel template structure beyond the "DID YOU KNOW" block — p22 handles panel redesign

### Files you MAY optionally modify

- `js/speciesData.js` — only if migrating ENRICHMENT altFacts into factLibrary (Phase F stretch goal)
- `js/uiData.js` — only to add new i18n keys for discovery UI labels

---

## Fact Writing Guidelines

1. **Accuracy**: Every fact must be scientifically defensible. No myths, no oversimplifications that are wrong.
2. **Awe factor**: Facts should make the reader go "wow" or "I didn't know that"
3. **Brevity**: Loading/tooltip facts ≤ 120 chars. Panel facts ≤ 200 chars. Discovery facts ≤ 250 chars.
4. **Specificity**: Tie facts to specific species/nodes where possible. "Octopuses have 3 hearts" → `species: 'octopus'`
5. **Diversity**: Cover all domains roughly equally. Don't over-index on charismatic megafauna.
6. **Translation quality**: Hebrew and Russian should read naturally. Use appropriate scientific terminology. Hebrew uses present tense for general facts. Russian uses formal "вы" for reader address.
7. **No duplicates**: Check against existing 18 facts in factLibrary.js and ~46 ENRICHMENT entries before adding

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. **Loading screen**: random fact appears (from expanded pool)
3. **Click any node with linked facts**: panel shows "DID YOU KNOW" with trilingual fact
4. **Hover node** (desktop): tooltip shows name + one-liner fact
5. **Random/discovery**: clicking discovery button shows fact toast with species link
6. **Switch to Hebrew**: facts appear in Hebrew
7. **Switch to Russian**: facts appear in Russian
8. **Verify no repeats**: click discovery button 10+ times — no immediate repeats
9. **Check domain coverage**: facts appear for bacteria, fungi, plants, animals, hominins
10. **Mobile**: tooltip hidden (pre-existing), panel facts work in bottom-sheet
11. Zero console errors
12. `FACTS.getAll().length` in console → ~130

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p26a-facts-pack`
- PR title: `feat: expand fact library to 130+ trilingual facts across 5 UI surfaces`
- PR against `main`
- In PR description: list fact count breakdown by domain

---

## Documentation Updates

### PROJECT_PROGRESS.md

Add to the Completed table:
```
| p26a | 130 facts pack — expanded library, panel/tooltip/discovery integration | PR #XX |
```

### SESSION_HANDOFF.md

Write a complete handoff with:
- What was done (summary)
- Fact count breakdown by domain
- Which surfaces were wired (and which were skipped)
- Whether ENRICHMENT migration was completed
- Current state (branch, PR, clean/dirty)
- Known issues or follow-up items
