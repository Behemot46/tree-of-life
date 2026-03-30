# Sprint J10 — Image & Visual Polish

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` — resolve merge conflicts first
4. Read `js/speciesData.js` — understand current PHOTO_MAP coverage
5. Read `js/imageLoader.js` — understand fallback chain
6. Read `js/nodeIcons.js` — understand silhouette icon system
7. Count all node IDs in `js/treeData.js` and compare against PHOTO_MAP keys
8. List all files in `assets/species/`

**After ALL code changes:**
1. Start dev server (`node serve.js`) and open in browser
2. Click through at least 20 species — verify every one shows a real photo
3. Verify panel hero images load for ALL nodes (no emoji fallbacks visible)
4. Verify tree node circular photos appear on zoom
5. Test dark + light theme
6. Test mobile 375×812
7. Check console for zero image-related errors
8. Commit: `feat: J10 — 100% photo coverage and image polish`
9. Push branch and create PR to main
10. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md

---

## Sprint Goal

**Every single node in the tree must display a real, beautiful photograph** — either a curated Wikimedia Commons photo or a high-quality AI-generated image. No emoji fallbacks. No blank spaces. No broken images. 100% coverage, 100% reliability.

---

## Current State (audit results)

- **Total nodes:** ~157
- **Nodes with PHOTO_MAP entries:** ~44 (28%)
- **Nodes with AI-generated images:** 10 (in `assets/species/`)
- **Nodes with NO image at all:** ~113 (72%) — these show silhouette icons or emoji
- **Panel fallback:** 72px emoji character — ugly and inconsistent
- **Tree fallback:** SVG silhouette path — acceptable but not beautiful

## Tasks

### 1. Complete PHOTO_MAP to 100% Coverage

**Every single node ID in treeData.js must have a PHOTO_MAP entry.**

For each missing node, find a high-quality Wikimedia Commons photo URL. Use this process:

1. Go to Wikimedia Commons and search for the species/taxon
2. Pick a photo that is:
   - **Real photography** (not illustrations, diagrams, or clipart)
   - **High quality** (sharp, well-lit, good composition)
   - **Representative** (shows the actual organism clearly)
   - **Properly licensed** (CC BY-SA, CC BY, CC0, or Public Domain)
3. Use the **960px thumbnail URL** format: `https://upload.wikimedia.org/wikipedia/commons/thumb/{path}/960px-{filename}`
4. Include credit attribution

**URL format for PHOTO_MAP entries:**
```js
'node-id': {
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/X/XX/Filename.jpg/960px-Filename.jpg',
  credit: 'Author Name, License'
}
```

**Priority categories to fill (all currently missing or incomplete):**

#### Bacteria & Archaea (~25 nodes)
Find electron microscope or culture photos for:
- actinobacteria, bacteroides, clostridium-botulinum, cyanobacteria, deinococcus, ecoli, firmicutes, helicobacter, lactobacillus, lokiarchaeota, methanobacterium, mycobacterium-tb, nostoc, prochlorococcus, proteobacteria, pyrolobus, spirochetes, streptomyces, sulfolobus, vibrio-cholerae, euryarchaeota, asgard
- For microscopic organisms: electron micrographs, fluorescence images, or colony photos are acceptable

#### Protists (~8 nodes)
- alveolates, amoeba-proteus, amoebozoa, diatoms, dinoflagellates, paramecium, phytophthora, plasmodium, volvox, stramenopiles, protists

#### Fungi (~8 nodes)
- ascomycetes, basidiomycetes, batrachochytrium, chytrids, penicillium, psilocybe, armillaria

#### Plants (~15 nodes)
- angiosperms, arabidopsis, azolla, baobab, bryophytes, ferns, gymnosperms, marchantia, mimosa-pudica, sphagnum, titan-arum, tree-fern, venus-flytrap, wollemia

#### Invertebrates (~15 nodes)
- annelids, cephalopods, cnidarians, common-earthworm, common-starfish, dragonfly, echinoderms, giant-squid, horseshoe-crab, insects, invertebrates, monarch-butterfly, seahorse

#### Vertebrates (~15 nodes)
- amphibians, axolotl, birds, bottlenose-dolphin, chinese-giant-salamander, clownfish, emperor-penguin, fish, flying-fox, golden-poison-frog, gray-wolf, green-sea-turtle, hummingbird, king-cobra, reptiles, saltwater-crocodile, shark, three-toed-sloth

#### Hominins (~20 nodes)
For extinct hominins, use:
- Fossil skull photos (museum specimens)
- Reconstruction photos (museum dioramas/busts)
- Archaeological site photos
- Famous fossil specimen photos (Lucy, Turkana Boy, etc.)

Nodes: ardipithecus_r, au_afarensis, au_africanus, au_anamensis, au_bahrelghazali, au_deyiremeda, au_garhi, au_prometheus, au_sediba, denisovan, denisovans, h_antecessor, h_bodoensis, h_erectus, h_floresiensis, h_habilis, h_heidelbergensis, h_longi, h_luzonensis, h_naledi, h_rudolfensis, homo-floresiensis, homo-naledi, kenyanthropus, neanderthal, orrorin, par_aethiopicus, par_boisei, par_robustus, sahelanthropus

#### Higher taxa / Abstract groups (~10 nodes)
For abstract grouping nodes (e.g., "vertebrates", "mammals"), use:
- Collage-style Wikimedia images showing diversity
- Iconic representative species photos
- Museum exhibit photos showing the group

Nodes: animalia, eukaryota, great-apes, mammals, primates, vertebrates, plantae, luca

### 2. Verify All PHOTO_MAP URLs Work

After adding all entries, verify every single URL:

```js
// Run this verification in browser console or as a script
Object.entries(PHOTO_MAP).forEach(([id, entry]) => {
  const img = new Image();
  img.onload = () => console.log(`✓ ${id}`);
  img.onerror = () => console.error(`✗ ${id}: ${entry.url}`);
  img.src = entry.url;
});
```

Fix any broken URLs immediately. Common issues:
- File was renamed on Wikimedia (check current filename)
- Thumbnail size not available (try 800px or 1024px instead of 960px)
- File was deleted (find alternative)

### 3. Improve Panel Hero Fallback

Replace the ugly 72px emoji fallback with a dignified placeholder:

**Current (bad):**
```html
<div class="panel-hero-fb" style="font-size:72px;">🦠</div>
```

**New (good):**
```html
<div class="panel-hero-fb">
  <svg class="panel-hero-placeholder" viewBox="0 0 24 24">
    <!-- Use the NODE_ICONS silhouette for this species, centered and large -->
  </svg>
  <span class="panel-hero-fb-label">Photo loading...</span>
</div>
```

CSS:
```css
.panel-hero-fb {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%);
}
.panel-hero-placeholder {
  width: 80px;
  height: 80px;
  opacity: 0.3;
  fill: var(--text);
}
.panel-hero-fb-label {
  font-size: 0.7rem;
  color: var(--parchment);
  opacity: 0.5;
  margin-top: 8px;
}
```

**Important:** With 100% PHOTO_MAP coverage, this fallback should almost never appear — only during slow network loads.

### 4. Improve Image Loading UX

#### 4a. Smooth image reveal
Add a fade-in when the hero image loads:

```css
.panel-hero img {
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.panel-hero img.loaded {
  opacity: 1;
}
```

In the onload handler, add the `loaded` class:
```js
img.onload = () => {
  img.classList.add('loaded');
  fallbackDiv.style.display = 'none';
};
```

#### 4b. Better shimmer skeleton
Ensure the shimmer animation plays while the image loads:
```css
.panel-hero-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    var(--surface) 25%,
    color-mix(in srgb, var(--surface), var(--text) 8%) 50%,
    var(--surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

#### 4c. Tree node photo fade-in
Add opacity transition to tree node circular photos:
```css
/* In the foreignObject img styling */
opacity: 0;
transition: opacity 0.3s ease;
```
Set `opacity: 1` in the onload handler.

### 5. Fix Image Reliability Issues

#### 5a. Increase timeout
Current: 6 seconds. Some Wikimedia images are slow.
Change to 10 seconds before giving up.

#### 5b. Retry on transient failure
If a PHOTO_MAP URL fails, retry once after 2 seconds before falling back:
```js
img.onerror = () => {
  if (!retried) {
    retried = true;
    setTimeout(() => { img.src = url; }, 2000);
  } else {
    // show fallback
  }
};
```

#### 5c. Remove emoji from tree view entirely
The tree view should show either:
1. Photo (circular, overlaid on node) — if PHOTO_MAP/generated exists
2. SVG silhouette icon — always visible as base layer

Never show emoji text in the tree SVG. Verify no code path renders emoji in tree nodes.

### 6. Upgrade Image Resolution

#### 6a. Panel hero: use 1280px thumbnails
Change PHOTO_MAP URL pattern from `960px-` to `1280px-` for sharper hero images on retina displays.

**Important:** Test that Wikimedia serves this size. If a specific image doesn't have 1280px, fall back to 960px.

#### 6b. Tree nodes: match node radius
Ensure tree node photos are rendered at `2 × devicePixelRatio × node.r` for crisp display on retina screens.

### 7. Photo Quality Standards

Every PHOTO_MAP entry must meet these standards:

| Criterion | Requirement |
|-----------|-------------|
| Type | Real photograph or scientific image (electron micrograph, fluorescence, etc.) |
| Resolution | ≥ 960px wide on Wikimedia |
| Quality | Sharp, well-exposed, properly focused |
| Subject | Clearly shows the organism (not a habitat shot with tiny subject) |
| License | CC BY-SA, CC BY, CC0, or Public Domain |
| Format | JPG or PNG (Wikimedia serves both) |
| NOT allowed | Illustrations, diagrams, clipart, AI art with visible artifacts, blurry photos, watermarked images |

For **extinct species** (hominins, dinosaurs):
- Museum fossil specimens (skulls, bones) ✓
- Scientific reconstructions by reputable museums ✓
- Archaeological site photos ✓
- Artist illustrations only if photorealistic and from museum exhibits ✓

---

## New / Modified Files

- `js/speciesData.js` — Expand PHOTO_MAP from ~44 to ~157 entries (100% coverage)
- `js/imageLoader.js` — Retry logic, increased timeout, resolution upgrade
- `index.html` — Improved fallback UI, fade-in transitions, tree photo polish
- `js/panel.js` — Updated hero image loading with fade-in

## Success Criteria

- [ ] Every node in the tree has a PHOTO_MAP entry (100% coverage)
- [ ] All PHOTO_MAP URLs return 200 (verified with test script)
- [ ] Panel hero shows a real photo for every species — no emoji fallbacks
- [ ] Tree nodes show circular photos when zoomed in
- [ ] Images fade in smoothly (no pop-in)
- [ ] Shimmer skeleton shows during load
- [ ] Dark and light themes both look good
- [ ] Mobile 375×812: hero images display correctly
- [ ] Retry logic handles transient network failures
- [ ] No emoji characters visible anywhere in tree or panel hero
- [ ] All photos are real/scientific images — no illustrations or clipart
- [ ] Zero console errors related to images
- [ ] All photo credits are accurate and displayed
