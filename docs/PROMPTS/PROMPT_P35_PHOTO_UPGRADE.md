# P35 — High-Quality Photo Map Upgrade

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p35** — upgrading every species photo/artwork in PHOTO_MAP to higher-quality, consistently styled imagery.

**Your scope:** Audit and upgrade all 228 entries in `PHOTO_MAP` (in `js/speciesData.js`), add missing entries so every tree node (~130+) has a photo, verify every URL resolves, and ensure all images look good when circular-clipped at small sizes (16–52px on tree) and medium sizes (175px max-height in panel). You do NOT touch rendering logic, ImageLoader internals, or tree data structure.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `data:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Replace low-quality, inconsistent, or poorly-cropped species photos in `PHOTO_MAP` with higher-quality alternatives that look excellent when circular-clipped on tree nodes and displayed as panel hero images.

### Success Criteria

1. **Every tree node** (~130+ nodes in `js/treeData.js`) has a corresponding `PHOTO_MAP` entry — zero gaps
2. **Every URL resolves** — no 404s, no CORS failures, no placeholder/generic images
3. **Consistent visual quality** — all images are sharp, well-lit, recognizable at 40px circular crop
4. **Subject-centered composition** — the subject is in the center of the frame (critical for circular clipping via `border-radius: 50%` + `object-fit: cover`)
5. **Proper licensing** — all images from Wikimedia Commons with accurate `credit` attribution strings
6. **URL format** — use Wikimedia thumbnail URLs at appropriate resolution (e.g., `/thumb/.../{width}px-filename.jpg`)
7. **No broken fallbacks** — images that fail to load still gracefully degrade via ImageLoader chain
8. Zero console errors on load and interaction

---

## Context: Current Implementation

### PHOTO_MAP Structure (js/speciesData.js, ~228 entries)

```js
const PHOTO_MAP = {
  'luca': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/...',
    credit: 'Author, License'
  },
  // ...228 entries
};
```

### How Photos Are Displayed

1. **Tree Node Overlay** — `render()` creates `<foreignObject>` + `<div>` + `<img>` inside SVG
   - Circular clip via `border-radius: 50%` on wrapper div
   - Image sized to `imgR * 2` (16–52px diameter)
   - `object-fit: cover` — image is center-cropped
   - Only rendered when `imgR >= 8`

2. **Panel Hero** — `renderPanelContent()` uses `ImageLoader.createImage(node, 'medium')`
   - CSS class `.p-img`: `width: 100%`, `max-height: 175px`, `object-fit: cover`, `border-radius: var(--radius-md)`
   - Attribution shown below in `.p-img-attr`

3. **Search Thumbnails** — `ImageLoader.createImage(node, 'thumb')` → 32px

### ImageLoader Fallback Chain (js/imageLoader.js)

```
PHOTO_MAP URL → generated assets/species/{id}.webp → node.img → emoji
```

### Key Sizing Constants

| Context | Size |
|---------|------|
| Tree node photo | 16–52px (circular) |
| Panel hero | up to 175px height |
| Search thumb | 32px |
| ImageLoader 'medium' | 120px |
| ImageLoader 'hero' | 400px |

---

## Implementation Plan

### Phase A: Audit existing PHOTO_MAP

1. Read `js/speciesData.js` — catalog all 228 entries
2. Read `js/treeData.js` — get full list of node IDs from TREE
3. Cross-reference: find tree nodes **without** a PHOTO_MAP entry
4. For each existing entry, evaluate:
   - Does the URL use Wikimedia thumb format? (preferred: `/thumb/.../300px-filename.jpg`)
   - Is the subject centered? (critical for circular crop)
   - Is the resolution sufficient? (minimum ~300px for panel display)
   - Is the credit string accurate and complete?

### Phase B: Source replacement images

For each entry needing replacement or addition:

1. **Prioritize subject-centered photos** — portrait orientation where the organism fills the frame center
2. **Use Wikimedia Commons thumb URLs** at 300–400px width:
   ```
   https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Filename.jpg/300px-Filename.jpg
   ```
3. **Prefer these image types by taxon:**
   - **Animals:** Close-up portraits or full-body on clean background
   - **Plants:** Whole plant or distinctive feature (flower, leaf, bark)
   - **Fungi:** Fruiting body, clear cap and stem visible
   - **Bacteria/Protists:** SEM/TEM micrographs with false color
   - **Fossils/Extinct:** Best available reconstruction or fossil specimen photo
   - **Hominins:** Paleoart reconstructions or museum reconstructions (skull/bust)
   - **Abstract groups (LUCA, Eukaryota):** Representative composite or iconic imagery

4. **Credit format:** `'Photographer/Author, License (e.g., CC BY-SA 4.0)'`

### Phase C: Update PHOTO_MAP

1. Replace low-quality entries with better alternatives
2. Add new entries for tree nodes that lack photos
3. Maintain alphabetical ordering within PHOTO_MAP for readability
4. Ensure every `url` value is a valid, resolvable Wikimedia thumb URL
5. Target: **every node in TREE has a PHOTO_MAP entry** (130+ entries minimum, up from current coverage)

### Phase D: Validate all URLs

1. Write a simple validation script (or use inline checks):
   - Fetch each URL with HEAD request
   - Verify 200 status
   - Log any failures
2. Fix or replace any broken URLs
3. Remove entries for node IDs that don't exist in TREE (dead entries)

### Phase E: Visual verification

1. Run `node serve.js`
2. Expand all tree branches — verify every node shows a photo overlay
3. Click nodes — verify panel hero images are sharp and well-composed
4. Check circular crop: subject should be recognizable at 40px
5. Test both dark and light themes
6. Test mobile viewport (panel images should look good at narrow widths)

---

## Image Selection Guidelines

### What makes a GOOD tree-node photo:

- Subject fills 60–80% of the frame
- Subject is **centered** (will be circular-cropped)
- Clean, uncluttered background (or shallow depth of field)
- Sharp focus on the subject
- Good lighting (no harsh shadows obscuring features)
- Resolution: 300px+ (Wikimedia thumb URL)
- Recognizable at 40px circular crop

### What makes a BAD tree-node photo:

- Subject off-center or in a corner (gets cropped out in circle)
- Busy/cluttered background
- Multiple specimens (confusing at small size)
- Low resolution or heavily compressed
- Text overlays or watermarks
- Dark/underexposed
- Landscape/habitat shots where organism is tiny

### Wikimedia Thumb URL Pattern

```
Original: https://upload.wikimedia.org/wikipedia/commons/a/ab/Filename.jpg
Thumb:    https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Filename.jpg/300px-Filename.jpg
```

Always use the `/thumb/` variant with a pixel width (300px recommended).

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `js/speciesData.js` | Replace/add PHOTO_MAP entries (target: 130+ entries, all high-quality) |
| `PROJECT_PROGRESS.md` | Add p35 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

## Files You Will NOT Modify

- `index.html` — no rendering changes
- `js/imageLoader.js` — fallback chain unchanged
- `js/treeData.js` — tree structure unchanged
- `js/imagePrompts.js` — AI prompts unchanged

---

## Testing Checklist

1. Every tree node shows a circular photo overlay (no missing images)
2. Panel hero images are sharp and well-composed at 175px height
3. Search thumbnails are recognizable at 32px
4. Circular crop shows the subject (not background/edges)
5. All images load without CORS errors in browser console
6. Dark theme: photos have good contrast against dark background
7. Light theme: photos have good contrast against light background
8. Mobile: panel images render correctly at narrow viewport
9. No 404 errors in Network tab for any PHOTO_MAP URL
10. Credit strings are accurate and complete
11. Zero console errors on page load and during tree interaction
