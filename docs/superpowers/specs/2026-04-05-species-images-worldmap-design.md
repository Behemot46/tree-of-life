# Species Images for All + World Map Upgrade — Design Spec

**Date:** 2026-04-05
**Goal:** Every species has a working hero image; the world minimap becomes an accurate, beautiful Scientific Atlas.

---

## 1. Image System Upgrade

### 1.1 PHOTO_MAP Expansion

**File:** `js/speciesData.js` — `PHOTO_MAP` object

**Current state:** 255 entries at 320px Wikimedia thumbnail width. ~137 species fall back to emoji.

**Changes:**

1. **Upgrade existing 255 entries** from `320px-` to `800px-` in the Wikimedia thumbnail URL path. Same base URL, just the size number changes.

2. **Add ~137 new entries** for all species currently missing a PHOTO_MAP entry. Each entry follows the existing format:
   ```js
   'species-id': { url: 'https://upload.wikimedia.org/...800px-...', credit: 'Author, License' }
   ```

3. **Image requirements:**
   - Resolution: 800px wide minimum (Wikimedia thumbnail URL)
   - Subject: the actual species in natural habitat when possible; prefer visually striking photos
   - Source: Wikimedia Commons (preferred), any public domain / CC-licensed source with stable URLs
   - Credit: attribution string in the `credit` field

4. **Hard-to-find species fallback:**
   - Use a close relative or representative organism from the same group
   - Credit field notes this (e.g., `'Representative cyanobacteria colony — USGS, Public Domain'`)
   - If no photo exists at all, the existing ImageLoader emoji fallback handles it

5. **Batching:** Done by domain/kingdom — bacteria, archaea, plants, fungi, animals, hominins. Commit after each batch.

### 1.2 Image Validation

After populating all 800px URLs, run a validation pass:

1. Fetch HEAD for each PHOTO_MAP URL and log any 404s
2. For failed URLs, try fallback widths: 640px, then 480px, then original resolution
3. Update the entry with the largest working thumbnail URL
4. Log final results: total entries, working count, fallback count, remaining failures

### 1.3 No Code Changes

The existing image pipeline handles everything:
- `ImageLoader` fallback chain: generated assets -> PHOTO_MAP -> node.img -> emoji
- `renderPanelContent()` hero markup: 16:9 aspect, `object-fit: cover`, gradient overlay, fade-in
- `css/panel.css` hero styles: `.panel-hero`, `.panel-hero-overlay`, `.panel-hero-meta`, `.panel-hero-credit`

None of these change. More data flows through the same pipeline.

---

## 2. World Map Overhaul

### 2.1 Replace MAP_PATHS Geometry

**File:** `js/mapPaths.js`

**Current state:** Hand-drawn approximations. Major inaccuracies: egg-shaped South America, missing Alaska/Florida, round Australia, oversized India.

**Changes:**

Replace all SVG path `d` strings with properly traced simplified Natural Earth outlines. Requirements:
- Same 18 region keys (no key renames)
- Same `viewBox="0 0 800 400"` equirectangular projection
- Recognizable continent shapes at minimap size (~350px wide): Alaska, Florida, Horn of Africa, Indian subcontinent, Great Australian Bight all visible
- File size under 50KB
- Path complexity: simplified enough for fast SVG rendering, detailed enough to be geographically accurate

### 2.2 Map Rendering Restyle — Scientific Atlas Theme

**File:** `js/panel.js` — `renderMiniMap()` function

Replace the current rendering style with the Scientific Atlas look:

**Dark theme (default):**
- Ocean background: `var(--map-ocean)` (`#0f1923`)
- Faint grid lines: 3 horizontal + 3 vertical, dashed, `var(--map-grid)` (`#1a2a3a`), 0.5px
- Inactive land: fill `var(--map-land)` (`#152030`), stroke `var(--map-land-border)` (`#2a4060`), 0.5px
- Active regions: fill `var(--map-highlight)` (`#0d7377`) at 60% opacity, stroke `var(--map-highlight-border)` (`#15b3b8`) at 1.5px

**Light theme:**
- Ocean: `var(--map-ocean)` overridden to `#e8f0f8`
- Land: `var(--map-land)` overridden to `#d0d8e0`
- Land border: `var(--map-land-border)` overridden to `#b8c4d0`
- Highlights: same teal values — they read well on both backgrounds
- Grid: `var(--map-grid)` overridden to `#c0d0e0`

**Marine species variant:**
- When regions include `marine-global`, `marine-deep`, or `freshwater`: apply translucent teal wash (`var(--map-highlight)` at 20% opacity) as a full-width rectangle over the ocean area, instead of highlighting land regions
- Land stays in inactive colors
- If the species has BOTH marine and land regions, highlight both

### 2.3 Map CSS Variables

**File:** `css/variables.css` (where all CSS custom properties are defined)

Define map-specific color tokens:

```css
:root {
  --map-ocean: #0f1923;
  --map-land: #152030;
  --map-land-border: #2a4060;
  --map-grid: #1a2a3a;
  --map-highlight: #0d7377;
  --map-highlight-border: #15b3b8;
}

[data-theme="light"] {
  --map-ocean: #e8f0f8;
  --map-land: #d0d8e0;
  --map-land-border: #b8c4d0;
  --map-grid: #c0d0e0;
  --map-highlight: #0d7377;
  --map-highlight-border: #15b3b8;
}
```

Additional CSS for `.mini-map svg`:
- `border-radius: 8px` for polish
- Caption styling updated to match teal palette

### 2.4 Map Visibility Logic

**Show the map when:**
- Species has a `GEO_DATA` entry with specific regions (any non-worldwide region)
- Species is a leaf node with `["worldwide"]` — highlight ALL land regions to show "this species is everywhere" (e.g., rats, E. coli, cockroaches)
- Species has marine regions — show ocean wash variant

**Hide the map when:**
- Species has NO `GEO_DATA` entry
- Species has children (is a taxonomic group) AND its only region is `["worldwide"]` — a map showing "everything" for "vertebrates" adds no information

Implementation: check in `renderMiniMap()` — if `!geo || (node.children && geo.regions.length === 1 && geo.regions[0] === 'worldwide')`, return empty string.

---

## 3. GEO_DATA Expansion

**File:** `js/geoData.js`

**Current state:** 132 entries out of ~392 species.

**Changes:** Add entries for all leaf-node species missing geo data (~200 new entries). Same format:

```js
'species-id': { regions: ['africa', 'south-asia'], label: 'Sub-Saharan Africa and Indian subcontinent', type: 'habitat' }
```

**Region keys** (existing 18, unchanged):
`north-america`, `central-america`, `south-america`, `europe`, `north-africa`, `west-africa`, `east-africa`, `southern-africa`, `africa`, `west-asia`, `central-asia`, `south-asia`, `east-asia`, `southeast-asia`, `oceania`, `antarctica`, `marine-global`, `marine-deep`, `freshwater`

**Guidelines:**
- Use the most specific sub-regions available (e.g., `['east-africa', 'southern-africa']` not just `['africa']`)
- For extinct species: historical range
- For domesticated/cosmopolitan species: `['worldwide']` (which triggers all-land highlight per Section 2.4)
- For bacteria/microorganisms: `['worldwide']` unless habitat-specific (e.g., hydrothermal vent bacteria → `['marine-deep']`)
- `type` field: `'habitat'` for extant species, `'fossil'` for extinct, `'endemic'` for narrow-range endemics

**Batching:** Done alongside PHOTO_MAP batches by kingdom.

---

## 4. Species Descriptions Gap-Fill

**Files:** `js/treeData.js`, `js/treeExpansion.js`

**Changes:** Fill missing `desc` fields only — do NOT overwrite existing descriptions.

**Description template** (3 sentences):
1. **What it IS:** Classification and defining trait (e.g., "The blue whale is the largest animal ever known to have lived on Earth, a marine mammal in the baleen whale family.")
2. **What makes it notable:** Ecological role, evolutionary significance, or human relevance (e.g., "They play a critical role in ocean ecosystems by fertilizing phytoplankton through their nutrient-rich waste.")
3. **One memorable fact:** Something surprising or sticky (e.g., "Their hearts are the size of a small car and can be heard beating from over 3 kilometers away.")

**Scope:** Only `desc` field. Do not touch `detail`, `facts`, `tags`, or `funFact`.

**Batching:** Done alongside image and geo data batches — no separate pass needed.

---

## 5. Files Modified

| File | Change |
|------|--------|
| `js/speciesData.js` | PHOTO_MAP: upgrade 255 URLs to 800px + add ~137 new entries |
| `js/mapPaths.js` | Replace all path `d` strings with accurate Natural Earth geometry |
| `js/panel.js` | `renderMiniMap()`: Scientific Atlas styling, marine variant, visibility logic |
| `css/variables.css` | Map CSS variables (dark + light theme) |
| `css/panel.css` | `.mini-map svg` border-radius, caption teal palette update |
| `js/geoData.js` | Add ~200 new GEO_DATA entries for leaf-node species |
| `js/treeData.js` | Fill empty `desc` fields |
| `js/treeExpansion.js` | Fill empty `desc` fields |

---

## 6. Out of Scope

- Tree layout, node positions, zoom/pan, navigation
- Panel structure (tabs, sections, ordering)
- DNA compare, conservation status, trivia, tours
- ImageLoader class code (no logic changes)
- Sapiens showcase overlay
- i18n translations (map has no text labels)
- Node icon/silhouette system

---

## 7. Verification Checklist

### Images
- [ ] Every species has a working PHOTO_MAP entry (or intentional emoji fallback for truly unimaginable organisms)
- [ ] All URLs validated — no 404s
- [ ] Hero images display full-width at panel top
- [ ] Images are visually striking and relevant
- [ ] All images are Wikimedia Commons / public domain / CC-licensed

### World Map
- [ ] SVG paths are geographically accurate — recognizable continents at minimap size
- [ ] Scientific Atlas theme renders correctly in dark mode
- [ ] Light theme overrides work
- [ ] Active regions highlighted in teal
- [ ] Marine species show ocean wash (not land highlights)
- [ ] Worldwide leaf nodes show all-land highlight
- [ ] Broad taxonomic groups with worldwide range: map hidden
- [ ] Map respects panel width on desktop and mobile
- [ ] File size under 50KB

### Descriptions
- [ ] All species with empty `desc` now have 3-sentence descriptions
- [ ] Existing descriptions unchanged
- [ ] Descriptions follow the template: what it is, what's notable, one fact

### General
- [ ] Panel loads without console errors
- [ ] Panel open/close works
- [ ] All existing panel features still function
- [ ] Mobile: panel scrolls smoothly, image and map don't overflow
- [ ] Tree rendering unaffected
- [ ] Pan/zoom/click still work
