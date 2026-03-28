# P33 — AI-Generated Species Illustrations

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p33** (Tier 4 — Content).

**Your scope:** Generate species illustrations using the existing `js/imagePrompts.js` prompt library, review and host them, and wire ImageLoader to prefer local illustrations. You primarily work with assets and the image pipeline. You do NOT touch tree rendering, panel structure, or layout.

**Workflow:** Read CLAUDE.md fully and `js/imagePrompts.js` fully. Understand the prompt library. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Populate `assets/species/` with AI-generated illustrations for tree nodes, giving the app a consistent artistic identity.

### Success Criteria

1. At least 50 species have AI-generated illustrations in `assets/species/`
2. Images in WebP format, ~200×200px, <50KB each
3. Consistent art style across all illustrations (naturalist watercolor or scientific illustration)
4. ImageLoader prefers local `assets/species/{id}.webp` over PHOTO_MAP URLs
5. Fallback chain: local illustration → PHOTO_MAP → emoji
6. Image attribution metadata file (`assets/species/ATTRIBUTION.md`)
7. No broken images — fallback chain works correctly
8. Zero console errors

---

## Context

### js/imagePrompts.js (~694 lines)

Contains `IMAGE_PROMPTS` — a map of node IDs to detailed image generation prompts. Each prompt specifies:
- Species name and key visual features
- Art style guidance (consistent across all prompts)
- Background/composition suggestions

### js/imageLoader.js

```js
const ImageLoader = (() => {
  function getBestUrl(node) {
    // 1. Check assets/species/{id}.webp (generated)
    // 2. Check PHOTO_MAP[id] (Wikimedia)
    // 3. Check node.img
    // 4. Return null (emoji fallback)
  }
  function loadInto(img, node) { ... }
  function registerPhotoMap(map) { ... }
  return { getBestUrl, loadInto, registerPhotoMap };
})();
```

Already supports the `assets/species/{id}.webp` path — just needs the files to exist.

### assets/species/

Currently contains only `.gitkeep`. Ready for images.

---

## Implementation Plan

### Phase A: Prioritize species for illustration

1. Audit all nodes and IMAGE_PROMPTS entries
2. Prioritize by visibility: HUMAN_PATH nodes first, then domain roots, then popular species
3. Create generation list of ~50 highest-priority species

### Phase B: Generate illustrations

1. Use IMAGE_PROMPTS to generate illustrations (via external AI image tool)
2. Target style: scientific illustration / naturalist watercolor — consistent across all
3. Format: WebP, 200×200px, transparent or white background
4. Naming: `assets/species/{node-id}.webp` (matching TREE node IDs exactly)

**Note:** If AI image generation is not available in the current session, create the pipeline and tooling so it can be run later:
- Script to batch-generate prompts from IMAGE_PROMPTS
- Script to resize/convert images to WebP
- Document the generation workflow

### Phase C: Optimize and host images

1. Ensure all images are <50KB (compress with quality 80)
2. Place in `assets/species/` directory
3. Create `assets/species/ATTRIBUTION.md` with:
   - Generation method
   - AI model used
   - License (CC0 or project license)
   - Per-species notes if needed

### Phase D: Verify ImageLoader integration

1. Confirm `ImageLoader.getBestUrl()` checks `assets/species/{id}.webp` first
2. If not: update the check path in `js/imageLoader.js`
3. Test: node with local image → shows local image (not Wikimedia)
4. Test: node without local image → falls back to PHOTO_MAP

### Phase E: Create generation tooling

1. Create `scripts/generate-images.sh` or `scripts/generate-images.js`:
   - Reads IMAGE_PROMPTS
   - Outputs prompt text for batch generation
   - Includes resize/convert step (using ImageMagick or similar)
2. Document in `assets/species/README.md`:
   - How to generate new images
   - Required tools
   - Quality/size standards

---

## Files You Will Create/Modify

| File | What changes |
|------|-------------|
| `assets/species/*.webp` | **NEW** — AI-generated illustrations |
| `assets/species/ATTRIBUTION.md` | **NEW** — image attribution |
| `scripts/generate-images.js` | **NEW** — generation tooling |
| `js/imageLoader.js` | Verify/fix local image path check |
| `PROJECT_PROGRESS.md` | Add p33 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `index.html` — no UI changes
- `render()` — rendering logic
- `js/treeData.js` — tree data
- Panel template

---

## Testing Checklist

1. `node serve.js` → tree renders with local images where available
2. Nodes with `assets/species/{id}.webp` → local image displayed
3. Nodes without local image → PHOTO_MAP fallback
4. Nodes without any image → emoji fallback
5. Panel hero image uses local illustration when available
6. Images load quickly (local files, no network latency)
7. All images render correctly (no broken images)
8. Dark/light theme — images look good in both
9. Mobile — images scale correctly
10. Zero console errors

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p33-ai-illustrations`
- PR title: `feat: add AI-generated species illustrations with generation pipeline`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p33 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
