# P23 — DNA Similarity Calculator

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p23** as part of a parallel batch (p20 + p21 + p23 run concurrently in separate worktrees).

**Your scope:** Build a new DNA similarity calculator feature that lets users pick two species and see their estimated DNA similarity percentage. This is a self-contained new feature — new UI, new data module, new interaction flow. You do NOT touch the tree canvas `render()`, node icons, or the panel `renderPanelContent()` function.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Add an interactive DNA similarity calculator that allows users to select any two species from the tree and see an estimated DNA match percentage, with educational context about what the number means.

### Success Criteria

1. Users can select two species from anywhere in the tree
2. Display shows: estimated DNA similarity %, divergence time (Mya), visual comparison bar
3. Educational "fun fact" context (e.g., "Humans share ~60% of their DNA with bananas")
4. Data is scientifically reasonable (based on published estimates where available, phylogenetic distance-based estimates for others)
5. UI is accessible from the main interface without disrupting existing features
6. Works on mobile and desktop
7. Supports dark/light themes
8. i18n ready (EN/HE/RU labels)
9. Zero console errors
10. Does not conflict with p16 (node icons) or p17 (panel visuals) code changes

---

## Context: Existing Compare Feature

There is already a basic **Compare Mode** in the app:

### Current compare infrastructure (~index.html)

- `<button id="compare-btn">` — toggles compare mode on/off
- `<span id="compare-hint">` — "Select 2–4 species"
- `<div id="compare-panel">` — overlay panel with `#compare-grid`
- CSS classes: `.compare-card`, `.cc-dna-bg`, `.cc-dna-label`
- `toggleCompareMode()`, `closeCompare()` functions exist
- Compare mode lets users click nodes to select 2-4 species, then shows side-by-side cards

### DNA data already in the app

- Hominin species in `js/speciesData.js` have `dna` fields (e.g., Neanderthal: `dna: {match: 99.7, note: '...'}`)
- `.hp-dna`, `.dna-fill`, `.dna-fill-inner` CSS classes exist for DNA bars in hominin panel

### Tree data structure

- Every node has `appeared` (Mya) — can be used to estimate divergence time
- Tree is navigable via `_parent` chain — LCA (Lowest Common Ancestor) can be computed
- `nodeMap` gives O(1) lookup by node ID

---

## Implementation Plan

### Phase A: DNA similarity data module — `js/dnaSimilarity.js`

Create a new data module with:

1. **Known DNA similarities** — a curated lookup table of published estimates:
   ```js
   const DNA_KNOWN = {
     // Key: sorted pair "id1|id2", value: { percent, source, note }
     'homo-sapiens|chimpanzee': { percent: 98.8, source: 'Nature 2005', note: 'Our closest living relative' },
     'homo-sapiens|gorilla': { percent: 98.4, source: 'Nature 2012' },
     'homo-sapiens|orangutan': { percent: 96.9, source: 'Nature 2011' },
     'homo-sapiens|rhesus-macaque': { percent: 93.0, source: 'Science 2007' },
     'homo-sapiens|mice': { percent: 85.0, source: 'Nature 2002' },
     'homo-sapiens|dogs': { percent: 84.0, source: 'Nature 2005' },
     'homo-sapiens|cattle': { percent: 80.0, source: 'Science 2009' },
     'homo-sapiens|chicken': { percent: 60.0, source: 'Nature 2004' },
     'homo-sapiens|zebrafish': { percent: 70.0, source: 'Nature 2013' },
     'homo-sapiens|fruit-fly': { percent: 60.0, source: 'Science 2000' },
     'homo-sapiens|saccharomyces': { percent: 31.0, source: 'Nature 1997', note: 'Baker\'s yeast' },
     'homo-sapiens|banana-plant': { percent: 60.0, source: 'Popular estimate' },
     // ... more pairs
   };
   ```

2. **Estimation function** for pairs without known data:
   ```js
   function estimateDnaSimilarity(nodeA, nodeB) {
     // 1. Check known lookup (both directions)
     // 2. If not known, compute LCA and use divergence time
     // 3. Apply a rough model: similarity ≈ f(divergence_time)
     //    - 0-10 Mya: ~97-99%
     //    - 10-100 Mya: ~85-97%
     //    - 100-500 Mya: ~60-85%
     //    - 500-1000 Mya: ~40-60%
     //    - 1000-2000 Mya: ~25-40%
     //    - 2000+ Mya: ~15-25%
     // Return { percent, divergenceMya, method: 'known'|'estimated', source?, note? }
   }
   ```

3. **LCA computation:**
   ```js
   function findLCA(nodeA, nodeB) {
     // Walk _parent chains to find lowest common ancestor
     // Return the LCA node
   }
   ```

4. **Fun facts** — curated educational comparisons:
   ```js
   const DNA_FUN_FACTS = [
     { threshold: 99, text: 'Closer than identical twins raised apart!' },
     { threshold: 95, text: 'You share more DNA with {species} than a wolf shares with a chihuahua.' },
     { threshold: 60, text: 'Surprisingly, you share about 60% of your genes with a banana!' },
     { threshold: 30, text: 'Even with this distant relative, you share core cellular machinery.' },
     // ...
   ];
   ```

### Phase B: DNA Calculator UI

1. **Entry point — toolbar button:**
   - Add a `<button id="dna-calc-btn">` near the existing compare button or in the controls area
   - Icon: 🧬 or a simple DNA helix SVG
   - Label: "DNA Compare" (translated)
   - Click opens the DNA calculator panel/modal

2. **Calculator panel — `<div id="dna-panel">`:**
   - Overlay panel (similar to compare-panel) or modal
   - Two species picker slots: "Species A" and "Species B"
   - Each slot: click to search/select a species (reuse the existing search infrastructure — `searchEntities()`)
   - After both selected: show results

3. **Species picker interaction:**
   - Click empty slot → opens a mini-search input
   - Type to search (reuse `searchEntities()` / `buildSearchIndex()`)
   - Click result → fills that slot with species name + icon
   - Can clear and re-pick

4. **Results display:**
   - Large percentage number (e.g., "98.8%") with animation (count up from 0)
   - Visual bar showing DNA overlap (filled portion = similarity)
   - Divergence time: "These species diverged ~6.5 million years ago"
   - Method badge: "Published data" or "Estimated from phylogeny"
   - Source citation if from published data
   - Fun fact / educational note
   - Shared ancestor: show the LCA node name with a link to open it in the tree

5. **Quick presets:**
   - "You & a Chimp" (human ↔ chimpanzee)
   - "You & a Banana" (human ↔ banana plant)
   - "You & a Mushroom" (human ↔ fungi)
   - "You & a Bacterium" (human ↔ E. coli)
   - These are fun conversation starters that immediately show results

### Phase C: CSS styling

1. Panel styling consistent with existing UI:
   - Background: `var(--surface)` / `var(--surface-raised)`
   - Border: `var(--border)`
   - Rounded corners: `var(--radius-lg)`
   - Font: Inter for UI, JetBrains Mono for the percentage number
2. DNA bar: gradient fill from `var(--accent-primary)` to `var(--accent-secondary)`
3. Species picker slots: bordered cards with hover state
4. Mobile: full-screen overlay or bottom-sheet pattern
5. Dark/light theme variants
6. Animation: percentage counter (CSS or JS counter from 0 to target)

### Phase D: Internationalization

Add to `TRANSLATIONS` in `js/uiData.js`:

```js
// EN
dna_calc_title: 'DNA Similarity Calculator',
dna_calc_btn: 'DNA Compare',
dna_select_species: 'Select a species',
dna_similarity: 'DNA Similarity',
dna_divergence: 'Diverged ~{mya} million years ago',
dna_shared_ancestor: 'Shared ancestor',
dna_method_known: 'Published data',
dna_method_estimated: 'Estimated from phylogeny',
dna_search_placeholder: 'Search species...',
dna_preset_chimp: 'You & a Chimp',
dna_preset_banana: 'You & a Banana',
dna_preset_mushroom: 'You & a Mushroom',
dna_preset_bacterium: 'You & a Bacterium',

// HE (Hebrew translations)
// RU (Russian translations)
```

### Phase E: Integration & wiring

1. Add `<script src="js/dnaSimilarity.js"></script>` to index.html before the main script block
2. Wire the DNA calculator button in the HTML
3. Wire `init()` to set up DNA calculator event listeners
4. Ensure the DNA panel closes properly (back button, escape key, click outside)
5. Add to `applyI18n()` for language switching

---

## Files You Will Create/Modify

| File | What changes |
|------|-------------|
| `js/dnaSimilarity.js` | **NEW** — DNA_KNOWN lookup, estimateDnaSimilarity(), findLCA(), DNA_FUN_FACTS |
| `index.html` | CSS for DNA panel, HTML for DNA panel + button, JS wiring in init(), i18n integration |
| `js/uiData.js` | Add dna_* translation keys to TRANSLATIONS (EN/HE/RU) |
| `PROJECT_PROGRESS.md` | Add p19 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` function — that's p20's scope
- `renderPanelContent()` — that's p21's scope
- `NODE_ICONS` / `getIconGroup()` — that's p20's scope
- `js/speciesData.js` PHOTO_MAP — shared, don't restructure
- `js/imageLoader.js` — shared, don't modify

---

## Data Accuracy Notes

- Use real published DNA similarity percentages where available (cite source)
- For estimated values, be transparent: label as "Estimated from phylogenetic distance"
- The estimation model doesn't need to be scientifically precise — it's educational. But it should be in the right ballpark.
- DNA similarity between domains (e.g., bacteria vs animals) should show low percentages (15-25%) reflecting conserved core genes only
- Within mammals: 80-99% range is appropriate
- Human-yeast (~31%), human-banana (~60%), human-fly (~60%) are widely cited popular figures

## Node ID Reference

Key species IDs in the tree (for building the known pairs table):
- `homo-sapiens`, `chimpanzee`, `gorilla`, `orangutan`, `gibbons`
- `mice`, `rats`, `dogs`, `cats`, `cattle`, `horses`, `elephants`, `whales`
- `chicken`, `crocodilians`, `turtles`, `snakes-lizards`
- `frogs`, `zebrafish`, `sharks`
- `fruit-fly`, `honeybees`, `beetles`, `butterflies-moths`
- `octopus`, `snails`, `earthworms`, `coral`, `jellyfish`
- `saccharomyces`, `penicillium`, `fungi`
- `rice`, `wheat`, `banana-plant`, `flowering-plants`, `conifers`
- `ecoli`, `bacteria`, `cyanobacteria`
- `archaea`

Check `js/treeData.js` for the exact IDs — some may differ from the above. Use the actual IDs from the TREE object.

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. DNA Compare button visible in UI
3. Click button → DNA panel opens
4. Click "Species A" slot → search input appears
5. Type "human" → results appear, click to select
6. Click "Species B" slot → search, select "chimpanzee"
7. Results show: ~98.8%, divergence ~6.5 Mya, "Published data" badge
8. Try preset buttons: "You & a Banana" → ~60%, "You & a Bacterium" → low %
9. Try two species with no known data → "Estimated from phylogeny" badge
10. Close and reopen → no stale state
11. Dark/light theme — panel looks good in both
12. Mobile viewport — panel usable as overlay/bottom-sheet
13. Hebrew RTL — layout correct, search works
14. Russian — labels translated
15. Zero console errors
16. Clicking "Shared ancestor" link navigates to LCA in tree (optional stretch goal)

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p19-dna-calculator`
- PR title: `feat: add DNA similarity calculator with species comparison`
- PR against `main`

---

## Documentation Updates

### PROJECT_PROGRESS.md

Add to the Completed table:
```
| p23 | DNA similarity calculator — species comparator with known + estimated data | PR #XX |
```

Change status in Upcoming table from `Pending` to `Done`.

### SESSION_HANDOFF.md

Write a complete handoff with:
- What was done (summary)
- How the estimation model works
- Number of known DNA pairs in the lookup table
- How to add more known pairs
- Current state (branch, PR, clean/dirty)
- Known issues or follow-up items
