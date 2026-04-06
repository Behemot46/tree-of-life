# Species Images & World Map Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every species gets a working hero image at 800px; the minimap becomes an accurate Scientific Atlas with teal highlights.

**Architecture:** Data-heavy upgrade with minimal code changes. PHOTO_MAP gets 800px URLs for all ~358 species. MAP_PATHS gets accurate Natural Earth geometry. `renderMiniMap()` gets Scientific Atlas styling with CSS custom properties. All changes are additive — no existing features break.

**Tech Stack:** Vanilla JS/CSS, SVG paths, Wikimedia Commons URLs

**Spec:** `docs/superpowers/specs/2026-04-05-species-images-worldmap-design.md`

---

## Progress Tracker

Update this tracker as each batch completes. If a session runs out of context, the next session picks up from unchecked items.

```
MAP_PATHS + Map Restyle (code changes):
- [ ] CSS variables in variables.css + panel.css updates
- [ ] Replace MAP_PATHS with accurate geometry
- [ ] Restyle renderMiniMap() + visibility logic

PHOTO_MAP — Upgrade existing 272 entries to 800px:
- [ ] Bacteria + Archaea (24 entries)
- [ ] Protists + Fungi (24 entries)
- [ ] Plants (23 entries)
- [ ] Invertebrates — cnidarians, mollusks, annelids, echinoderms, arthropods (24 entries)
- [ ] Fish + Amphibians + Reptiles (21 entries)
- [ ] Birds (9 entries)
- [ ] Mammals + Primates (34 entries)
- [ ] Hominins + grouping nodes (17 entries)
- [ ] Remaining/misc entries

PHOTO_MAP — Add missing ~86 entries:
- [ ] Bacteria (11 missing)
- [ ] Archaea (6 missing)
- [ ] Protists (7 missing)
- [ ] Fungi (6 missing)
- [ ] Plants (16 missing)
- [ ] Invertebrates — all groups (14 missing)
- [ ] Fish (11 missing)
- [ ] Amphibians + Reptiles (10 missing)
- [ ] Birds (18 missing)
- [ ] Mammals + Primates (22 missing)
- [ ] Hominins + grouping nodes (~6 missing)

GEO_DATA — Add missing ~156 entries:
- [ ] Bacteria + Archaea (~32 missing)
- [ ] Protists + Fungi (~27 missing)
- [ ] Plants (~30 missing)
- [ ] Invertebrates (~36 missing)
- [ ] Fish (~24 missing)
- [ ] Amphibians + Reptiles (~15 missing)
- [ ] Birds (~22 missing)
- [ ] Mammals + Primates (~40 missing)

Validation:
- [ ] Image URL validation (HEAD requests)
- [ ] Visual verification in browser
```

---

### Task 1: Add Map CSS Variables

**Files:**
- Modify: `css/variables.css:15-134` (`:root` block)
- Modify: `css/theme.css:17-62` (`[data-theme="light"]` block)
- Modify: `css/panel.css:248-257` (`.mini-map` styles)

- [ ] **Step 1: Add map tokens to `:root` in variables.css**

Add these lines inside the `:root` block, after the `--tree-*` variables (before line 134's closing `}`):

```css
  /* ── World map (Scientific Atlas) ── */
  --map-ocean:#0f1923;
  --map-land:#152030;
  --map-land-border:#2a4060;
  --map-grid:#1a2a3a;
  --map-highlight:#0d7377;
  --map-highlight-border:#15b3b8;
```

- [ ] **Step 2: Add light theme overrides in theme.css**

Add these lines inside the `[data-theme="light"]` block, after the tree redesign variables (after line 61 `--tree-photo-opacity:0.95;`):

```css
  /* ── World map (light) ── */
  --map-ocean:#e8f0f8;
  --map-land:#d0d8e0;
  --map-land-border:#b8c4d0;
  --map-grid:#c0d0e0;
  --map-highlight:#0d7377;
  --map-highlight-border:#15b3b8;
```

- [ ] **Step 3: Update mini-map CSS in panel.css**

Replace lines 248-257 (the `/* ── MINI WORLD MAP ── */` block) with:

```css
/* ── MINI WORLD MAP ── */
.mini-map{width:100%;border-radius:var(--radius-md);overflow:hidden;
  border:1px solid var(--map-land-border);}
.mini-map svg{width:100%;height:auto;display:block;background:var(--map-ocean);border-radius:var(--radius-md);}
.mini-map .grid-line{stroke:var(--map-grid);stroke-width:0.5;stroke-dasharray:4,4;}
.mini-map .region{fill:var(--map-land);stroke:var(--map-land-border);stroke-width:0.5;
  transition:fill 0.3s,opacity 0.3s;}
.mini-map .region.active{fill:var(--map-highlight);opacity:0.6;stroke:var(--map-highlight-border);stroke-width:1.5;}
.mini-map .ocean-wash{fill:var(--map-highlight);opacity:0.2;}
.mini-map .map-label{font-size:7px;fill:var(--text-secondary);font-family:var(--font-sans);pointer-events:none;}
.mini-map-caption{font-size:var(--text-2xs);color:var(--text-secondary);margin-top:6px;font-family:var(--font-sans);
  display:flex;align-items:center;gap:6px;}
.mini-map-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;background:var(--map-highlight-border);}
```

Also update the light theme override in theme.css (line 117):

Replace:
```css
[data-theme="light"] .mini-map .region{fill:var(--surface-raised);stroke:var(--border);}
```
With:
```css
[data-theme="light"] .mini-map .region{fill:var(--map-land);stroke:var(--map-land-border);}
```

- [ ] **Step 4: Verify in browser**

Run: `node serve.js`
Open http://localhost:5555, click on a species with geo data (e.g., "Lion", "E. coli").
Verify: map renders with dark blue ocean, grid lines not yet visible (that's Task 3), land in muted blue-gray.
Toggle to light theme — verify light ocean, darker land.

- [ ] **Step 5: Commit**

```bash
git add css/variables.css css/theme.css css/panel.css
git commit -m "style: add Scientific Atlas CSS variables for world map"
```

---

### Task 2: Replace MAP_PATHS with Accurate Geometry

**Files:**
- Modify: `js/mapPaths.js` (full rewrite of path `d` strings, keep same keys)

- [ ] **Step 1: Replace mapPaths.js content**

Replace the entire file with accurate simplified Natural Earth outlines. Keep the exact same structure: `export const MAP_PATHS = { ... }` with the same 18 region keys, each mapping to an array of SVG path `d` strings.

Requirements for the new paths:
- `viewBox="0 0 800 400"` equirectangular projection (same as current)
- Recognizable shapes: Alaska peninsula, Florida, Gulf of Mexico, Great Lakes, Hudson Bay, Horn of Africa, Arabian Peninsula, Indian subcontinent, Malay Peninsula, Japanese archipelago, Great Australian Bight, New Zealand's two islands
- South America must show wide Amazon basin tapering to narrow Patagonia
- Each path should be simplified (30-60 coordinate points per major landmass) — not too detailed, not blob-like
- Sub-regions must tile correctly when rendered together (no gaps between north-africa and west-africa, etc.)
- File size target: under 40KB

The 18 region keys to preserve:
`north-america`, `central-america`, `south-america`, `europe`, `north-africa`, `west-africa`, `east-africa`, `southern-africa`, `africa` (super-region), `west-asia`, `central-asia`, `south-asia`, `east-asia`, `southeast-asia`, `oceania`, `antarctica`, `marine-global`, `marine-deep`

Note: `marine-global`, `marine-deep`, and `freshwater` don't have paths (they trigger the ocean wash). If they currently have no paths in MAP_PATHS, that's correct — skip them.

Also note: `freshwater` is used in GEO_DATA but has no entry in MAP_PATHS — this is fine, it triggers the ocean wash in renderMiniMap.

- [ ] **Step 2: Verify in browser**

Open http://localhost:5555, click on species with known regional distributions:
- Lion → should highlight Africa sub-regions
- E. coli → worldwide → all land highlighted
- Blue whale → marine → ocean wash
- Komodo dragon → should highlight Southeast Asia

Verify continent shapes are recognizable. Check that sub-regions tile together without gaps (click a species that highlights "africa" super-region — all 4 Africa sub-regions should light up seamlessly).

- [ ] **Step 3: Commit**

```bash
git add js/mapPaths.js
git commit -m "data: replace MAP_PATHS with accurate Natural Earth continent outlines"
```

---

### Task 3: Restyle renderMiniMap() with Scientific Atlas Theme

**Files:**
- Modify: `js/panel.js:162-198` (`renderMiniMap` function)

- [ ] **Step 1: Replace the renderMiniMap function**

Replace lines 162-198 in `js/panel.js` with:

```js
// ── Panel helper: render mini world map ──
export function renderMiniMap(nodeId, nodeColor, hasChildren) {
  const geo = GEO_DATA ? GEO_DATA[nodeId] : null;
  if (!geo || !geo.regions || !geo.regions.length) return '';
  if (!MAP_PATHS) return '';
  // Hide map for broad taxonomic groups with only 'worldwide'
  if (hasChildren && geo.regions.length === 1 && geo.regions[0] === 'worldwide') return '';

  const active = new Set(geo.regions);
  const isWorldwide = active.has('worldwide');
  const isMarine = active.has('marine-global') || active.has('marine-deep') || active.has('freshwater');

  // Grid lines (3 horizontal + 3 vertical)
  let svg = '';
  svg += '<line class="grid-line" x1="0" y1="100" x2="800" y2="100"/>';
  svg += '<line class="grid-line" x1="0" y1="200" x2="800" y2="200"/>';
  svg += '<line class="grid-line" x1="0" y1="300" x2="800" y2="300"/>';
  svg += '<line class="grid-line" x1="200" y1="0" x2="200" y2="400"/>';
  svg += '<line class="grid-line" x1="400" y1="0" x2="400" y2="400"/>';
  svg += '<line class="grid-line" x1="600" y1="0" x2="600" y2="400"/>';

  // Ocean wash for marine species
  if (isMarine) {
    svg += '<rect class="ocean-wash" x="0" y="0" width="800" height="400"/>';
  }

  // Continent paths
  for (const [rid, dArr] of Object.entries(MAP_PATHS)) {
    const isActive = isWorldwide || active.has(rid) ||
      (active.has('africa') && (rid === 'north-africa' || rid === 'west-africa' || rid === 'east-africa' || rid === 'southern-africa'));
    for (const d of dArr) {
      svg += `<path class="region${isActive ? ' active' : ''}" d="${d}"/>`;
    }
  }

  const typeIcon = geo.type === 'fossil' ? '🦴' : geo.type === 'endemic' ? '📌' : '🌍';
  const typeLabel = geo.type === 'fossil' ? 'Fossil sites' : geo.type === 'endemic' ? 'Endemic range' : 'Distribution';
  return `<div class="panel-section">
    <div class="p-section">📍 ${typeLabel.toUpperCase()}</div>
    <div class="mini-map">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">${svg}</svg>
    </div>
    <div class="mini-map-caption">
      <span class="mini-map-dot"></span>
      ${typeIcon} ${geo.label}
    </div>
  </div>`;
}
```

Key changes from current code:
- Added `hasChildren` parameter for visibility logic
- Removed inline `style="fill:${color}"` — active regions now use CSS class `.region.active` with `var(--map-highlight)`
- Added grid lines (6 `<line>` elements with class `grid-line`)
- Ocean wash uses class `ocean-wash` instead of inline style
- Caption dot no longer uses inline `style="background:${color}"` — uses CSS `var(--map-highlight-border)`

- [ ] **Step 2: Update the call site**

In `js/panel.js` line 552, change:

```js
${renderMiniMap(node.id, node.color)}
```

to:

```js
${renderMiniMap(node.id, node.color, !!node.children)}
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:5555 and test:
1. Click a specific-range species (e.g., Lion) → teal highlighted regions on dark blue map with grid
2. Click a worldwide leaf species (e.g., E. coli) → all land regions highlighted
3. Click a marine species (e.g., blue whale) → ocean wash visible
4. Click a broad group node (e.g., "Vertebrates") → map should be hidden if only worldwide
5. Toggle light theme → verify light blue ocean, light gray land, same teal highlights
6. Check mobile view (resize to <768px) → map should fit within panel

- [ ] **Step 4: Commit**

```bash
git add js/panel.js
git commit -m "feat: restyle world map as Scientific Atlas with teal highlights and visibility logic"
```

---

### Task 4: Upgrade Existing PHOTO_MAP URLs to 800px

**Files:**
- Modify: `js/speciesData.js` — PHOTO_MAP object

This task upgrades all ~272 existing PHOTO_MAP entries from their current thumbnail width (mostly 320px) to 800px. For each entry, change the width number in the Wikimedia thumbnail URL path.

Example transformation:
```
Before: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Foo.jpg/320px-Foo.jpg
After:  https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Foo.jpg/800px-Foo.jpg
```

**Important:** Some URLs may not follow the `/NNNpx-` pattern (e.g., direct file URLs without thumbnails). For those, leave them unchanged — they're already full resolution.

- [ ] **Step 1: Upgrade Bacteria + Archaea entries (~24)**

Find all PHOTO_MAP entries for bacteria and archaea species. Change `320px-` (or whatever width) to `800px-` in the URL. If the URL doesn't contain a `/NNNpx-` segment, leave it unchanged.

- [ ] **Step 2: Upgrade Protists + Fungi entries (~24)**

Same width upgrade for protist and fungi species.

- [ ] **Step 3: Upgrade Plants entries (~23)**

Same width upgrade for plant species.

- [ ] **Step 4: Upgrade Invertebrates entries (~24)**

Same width upgrade for cnidarians, mollusks, annelids, echinoderms, arthropods.

- [ ] **Step 5: Upgrade Fish + Amphibians + Reptiles entries (~21)**

Same width upgrade.

- [ ] **Step 6: Upgrade Birds entries (~9)**

Same width upgrade.

- [ ] **Step 7: Upgrade Mammals + Primates entries (~34)**

Same width upgrade.

- [ ] **Step 8: Upgrade Hominins + grouping nodes + remaining entries**

Same width upgrade for all remaining entries.

- [ ] **Step 9: Commit**

```bash
git add js/speciesData.js
git commit -m "data: upgrade all PHOTO_MAP URLs from 320px to 800px thumbnails"
```

---

### Task 5: Add Missing PHOTO_MAP Entries — Bacteria, Archaea, Protists, Fungi

**Files:**
- Modify: `js/speciesData.js` — PHOTO_MAP object

For each missing species, add a new entry with an 800px Wikimedia Commons thumbnail URL and credit string.

- [ ] **Step 1: Add Bacteria entries (~11 missing)**

Missing IDs: `aliivibrio`, `borrelia`, `campylobacter`, `ferroplasma`, `rhizobium`, `spirulina`, `staphylococcus`, `thermus-aquaticus`, `treponema`, `vibrio-cholerae`, `wolbachia`

For each, find an appropriate Wikimedia Commons image (electron micrograph, culture photo, or scientific illustration) and add:
```js
'species-id': {url:'https://upload.wikimedia.org/.../800px-...', credit:'Author, License'},
```

- [ ] **Step 2: Add Archaea entries (~6 missing)**

Missing IDs: `asgard`, `lokiarchaeota`, `methanopyrus`, `nanoarchaeum`, `thaumarchaeota`, `thermococcus`

These are extremophiles — look for electron micrographs or habitat photos (hot springs, deep sea vents).

- [ ] **Step 3: Add Protist entries (~7 missing)**

Missing IDs: `bdelloid-rotifer`, `bioluminescent-dino`, `foraminifera`, `radiolarian`, `stentor`, `toxoplasma`, `trypanosoma`

- [ ] **Step 4: Add Fungi entries (~6 missing)**

Missing IDs: `cordyceps`, `ergot`, `fly-agaric`, `lions-mane`, `morel`, `shiitake`

These are well-photographed species — prioritize striking nature photos.

- [ ] **Step 5: Verify images load in browser**

Open http://localhost:5555, click on each newly-added species. Verify:
- Hero image loads and displays correctly
- No broken image placeholder
- Image is relevant and visually appropriate

- [ ] **Step 6: Commit**

```bash
git add js/speciesData.js
git commit -m "data: add PHOTO_MAP entries for bacteria, archaea, protists, and fungi"
```

---

### Task 6: Add Missing PHOTO_MAP Entries — Plants, Invertebrates

**Files:**
- Modify: `js/speciesData.js` — PHOTO_MAP object

- [ ] **Step 1: Add Plant entries (~16 missing)**

Missing IDs: `acacia`, `coffee`, `cycad`, `eucalyptus`, `kelp`, `lotus`, `magnolia`, `mangrove`, `oak`, `pitcher-plant`, `resurrection-fern`, `rice`, `sensitive-fern`, `strangler-fig`, `titan-sequoia`, `welwitschia-2`

Prioritize photos showing the whole plant or its most distinctive feature (flower, leaf, habitat).

- [ ] **Step 2: Add Invertebrate entries (~14 missing)**

Missing IDs from cnidarians: `blue-ringed-octopus`, `portuguese-man-o-war`, `crown-of-thorns`
Missing from mollusks: `cone-snail`, `giant-clam`, `mollusks`
Missing from annelids: `earthworm`, `giant-tube-worm`, `leech`
Missing from echinoderms: `feather-star`, `sea-lily`
Missing from arthropods/insects: `bumblebee`, `cicada`, `cockroach`, `dung-beetle`, `hercules-beetle`, `leaf-insect`, `mosquito`, `praying-mantis`, `stick-insect`, `emperor-scorpion`, `garden-spider`, `lobster`

(The exact count may differ slightly from the audit — add entries for every invertebrate node missing from PHOTO_MAP.)

- [ ] **Step 3: Verify images load in browser**

Spot-check 5-6 species from each group.

- [ ] **Step 4: Commit**

```bash
git add js/speciesData.js
git commit -m "data: add PHOTO_MAP entries for plants and invertebrates"
```

---

### Task 7: Add Missing PHOTO_MAP Entries — Vertebrates (Fish, Amphibians, Reptiles, Birds)

**Files:**
- Modify: `js/speciesData.js` — PHOTO_MAP object

- [ ] **Step 1: Add Fish entries (~11 missing)**

Missing IDs: `anglerfish`, `arapaima`, `blobfish`, `flying-fish`, `hammerhead-shark`, `mudskipper`, `pufferfish`, `salmon`, `swordfish`, `tuna`, `whale-shark`

- [ ] **Step 2: Add Amphibian + Reptile entries (~10 missing)**

Missing amphibians: `caecilian`, `giant-salamander`, `platypus-frog`, `c-elegans` (actually a nematode, but add image for whatever the node represents)
Missing reptiles: `anaconda`, `gecko`, `iguana`, `leatherback-turtle`, `marine-iguana`, `python`

- [ ] **Step 3: Add Bird entries (~18 missing)**

Missing IDs: `arctic-tern`, `bee-hummingbird`, `greater-bird-of-paradise`, `harpy-eagle`, `hoatzin`, `kakapo`, `kiwi`, `lyrebird`, `new-caledonian-crow`, `ostrich`, `pelican`, `resplendent-quetzal`, `secretary-bird`, `shoebill`, `swift`, `superb-fairywren`, `toucan`, `woodpecker`

Birds are highly photogenic — prioritize vivid, in-habitat shots.

- [ ] **Step 4: Verify images load in browser**

Spot-check across all three groups.

- [ ] **Step 5: Commit**

```bash
git add js/speciesData.js
git commit -m "data: add PHOTO_MAP entries for fish, amphibians, reptiles, and birds"
```

---

### Task 8: Add Missing PHOTO_MAP Entries — Mammals, Primates, Hominins, Grouping Nodes

**Files:**
- Modify: `js/speciesData.js` — PHOTO_MAP object

- [ ] **Step 1: Add Mammal entries (~19 missing)**

Missing IDs: `armadillo`, `aye-aye`, `beaver`, `capybara`, `cheetah`, `dugong`, `echidna`, `elephant-seal`, `gibbon`, `hedgehog`, `jaguar`, `meerkat`, `moose`, `okapi`, `spotted-hyena`, `three-toed-sloth`, `vampire-bat`, `walrus`, `wombat`

- [ ] **Step 2: Add Primate entries (~3 missing)**

Missing IDs: `great-apes`, `mandrill`, `tarsier`

- [ ] **Step 3: Add Hominin entries (remaining missing)**

Check which hominin IDs are missing from PHOTO_MAP. For extinct hominins without photos, use:
- Skull reconstruction photos from Wikimedia
- Museum exhibit photos
- Paleoart reconstructions (with appropriate credit)

- [ ] **Step 4: Add Grouping node entries (~5 missing)**

Missing IDs: `arthropoda`, `chordata`, `eukaryota`, `invertebrates`, `vertebrates`

For abstract grouping nodes, use representative photos:
- `arthropoda` → striking arthropod diversity photo
- `chordata` → diverse vertebrate collage or representative
- `eukaryota` → microscope image of eukaryotic cells
- `invertebrates` → coral reef or diverse invertebrate scene
- `vertebrates` → representative vertebrate

- [ ] **Step 5: Verify all images load**

Run through the entire tree, checking that every species panel shows a hero image (not an emoji fallback). Flag any remaining gaps.

- [ ] **Step 6: Commit**

```bash
git add js/speciesData.js
git commit -m "data: add PHOTO_MAP entries for mammals, primates, hominins, and grouping nodes"
```

---

### Task 9: Add Missing GEO_DATA — Bacteria, Archaea, Protists, Fungi, Plants

**Files:**
- Modify: `js/geoData.js`

- [ ] **Step 1: Add Bacteria + Archaea GEO_DATA (~32 missing)**

Most bacteria/archaea are cosmopolitan → `regions: ['worldwide']`. Exceptions:
- Hydrothermal vent species → `['marine-deep']`
- Gut bacteria → `['worldwide']` (found in all human populations)
- Habitat-specific extremophiles → appropriate marine/thermal regions

Format:
```js
'species-id': { regions: ['worldwide'], label: 'Found in all habitats worldwide', type: 'habitat' },
```

- [ ] **Step 2: Add Protist + Fungi GEO_DATA (~27 missing)**

Protists: many are cosmopolitan; parasites like Plasmodium have specific tropical ranges.
Fungi: most are cosmopolitan; some are region-specific (truffle → Europe, shiitake → East Asia).

- [ ] **Step 3: Add Plant GEO_DATA (~30 missing)**

Plants have more specific ranges:
- Baobab → `['africa', 'south-asia', 'oceania']`
- Sequoia → `['north-america']`
- Bamboo → `['east-asia', 'southeast-asia', 'south-america']`
- Rice/wheat → `['worldwide']` (cultivated globally)

Use most specific sub-regions available.

- [ ] **Step 4: Verify maps in browser**

Open panel for 5-6 newly-added species per group. Verify correct regions highlighted.

- [ ] **Step 5: Commit**

```bash
git add js/geoData.js
git commit -m "data: add GEO_DATA for bacteria, archaea, protists, fungi, and plants"
```

---

### Task 10: Add Missing GEO_DATA — Invertebrates, Fish

**Files:**
- Modify: `js/geoData.js`

- [ ] **Step 1: Add Invertebrate GEO_DATA (~36 missing)**

Key ranges to get right:
- Horseshoe crab → `['north-america', 'east-asia', 'southeast-asia']`
- Mantis shrimp → `['marine-global']`
- Monarch butterfly → `['north-america', 'central-america']`
- Honey bee → `['worldwide']`
- Giant tube worm → `['marine-deep']`
- Coral → `['marine-global']`

- [ ] **Step 2: Add Fish GEO_DATA (~24 missing)**

Most fish are marine:
- Coelacanth → `['east-africa']` (endemic — type: 'endemic')
- Clownfish → `['southeast-asia', 'oceania']`
- Great white shark → `['marine-global']`
- Whale shark → `['marine-global']`
- Freshwater fish → `['freshwater']` + specific continents

- [ ] **Step 3: Verify maps in browser**

Spot-check marine species (ocean wash) and regional species (land highlights).

- [ ] **Step 4: Commit**

```bash
git add js/geoData.js
git commit -m "data: add GEO_DATA for invertebrates and fish"
```

---

### Task 11: Add Missing GEO_DATA — Amphibians, Reptiles, Birds, Mammals, Primates

**Files:**
- Modify: `js/geoData.js`

- [ ] **Step 1: Add Amphibian + Reptile GEO_DATA (~15 missing)**

Key ranges:
- Axolotl → `['central-america']` (endemic — type: 'endemic')
- Komodo dragon → `['southeast-asia']` (endemic)
- Green sea turtle → `['marine-global']`
- King cobra → `['south-asia', 'southeast-asia']`

- [ ] **Step 2: Add Bird GEO_DATA (~22 missing)**

Key ranges:
- Emperor penguin → `['antarctica']`
- Bald eagle → `['north-america']`
- Kiwi → `['oceania']` (endemic)
- Arctic tern → `['marine-global']` (migrates pole to pole)
- Wandering albatross → `['marine-global']`

- [ ] **Step 3: Add Mammal + Primate GEO_DATA (~40 missing)**

Key ranges:
- Polar bear → `['north-america', 'europe', 'central-asia']` (Arctic regions)
- Platypus → `['oceania']` (endemic)
- Orangutan → `['southeast-asia']` (endemic)
- African elephant → `['africa']`
- Blue whale → `['marine-global']`

- [ ] **Step 4: Verify maps in browser**

Systematic check: open 10+ species across all groups. Verify:
- Correct regions highlighted
- Marine species show ocean wash
- Endemic species show narrow ranges
- Worldwide species (rats, cockroaches) show all-land highlight

- [ ] **Step 5: Commit**

```bash
git add js/geoData.js
git commit -m "data: add GEO_DATA for amphibians, reptiles, birds, mammals, and primates"
```

---

### Task 12: Image URL Validation

**Files:**
- No files modified (validation only; fixes applied to `js/speciesData.js` if needed)

- [ ] **Step 1: Write a validation script**

Create a temporary Node.js script (do not commit) that:
1. Imports PHOTO_MAP from `js/speciesData.js`
2. For each entry, sends a HEAD request to the URL
3. Logs: status code, content-type, and any 404s/errors
4. For 404s: tries fallback widths (640px, 480px, original)
5. Outputs a summary: total, working, failed, fallback-needed

```bash
node validate-images.js
```

- [ ] **Step 2: Fix any broken URLs**

For each 404'd URL:
- Try 640px width → if works, update the entry
- Try 480px width → if works, update the entry
- Try original (remove `/thumb/` path and `/NNNpx-` suffix) → if works, update
- If all fail: find a replacement image on Wikimedia Commons

- [ ] **Step 3: Re-run validation**

Verify 0 failures (or only intentional emoji-fallback species).

- [ ] **Step 4: Commit fixes (if any)**

```bash
git add js/speciesData.js
git commit -m "fix: resolve broken PHOTO_MAP URLs found during validation"
```

- [ ] **Step 5: Delete temporary validation script**

```bash
rm validate-images.js
```

---

### Task 13: Final Visual Verification

- [ ] **Step 1: Full panel walkthrough**

Open http://localhost:5555 and systematically test:
1. Click 5 species per major group (bacteria, plants, insects, fish, birds, mammals)
2. For each: verify hero image loads, map displays correctly, no console errors
3. Test panel open/close animation
4. Test navigation (breadcrumb, back button)

- [ ] **Step 2: Theme + responsive check**

1. Toggle light theme → verify map colors invert correctly
2. Resize browser to mobile width (<768px) → verify panel scrolls, image doesn't overflow, map fits
3. Check all three languages (`?lang=en`, `?lang=he`, `?lang=ru`) → verify no text overlap in map section

- [ ] **Step 3: Edge cases**

1. Click LUCA (root node) → should have image + worldwide map or no map (it's a grouping node)
2. Click "Vertebrates" grouping node → map should be hidden (broad group + worldwide)
3. Click a deep-sea species → ocean wash visible
4. Click an extinct species (e.g., archaeopteryx) → fossil map type with 🦴 icon

- [ ] **Step 4: Performance spot-check**

1. Open DevTools Network tab
2. Click rapidly through 10 species
3. Verify: no waterfall of image requests, images load within 2-3 seconds, no layout shift

- [ ] **Step 5: Update progress tracker**

Mark all items in the progress tracker at the top of this plan as complete.
