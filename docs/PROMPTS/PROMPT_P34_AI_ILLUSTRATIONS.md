# P34 — AI-Generated Species Illustrations

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p34** — generating and integrating AI-created species illustrations using the existing prompt library.

**Your scope:** Use `js/imagePrompts.js` to generate illustration prompts, organize the output in `assets/species/`, wire `ImageLoader` to prefer local illustrations, and add attribution metadata. You modify `js/imageLoader.js` and the assets directory. You do NOT modify rendering logic, panel templates, or tree data.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Populate `assets/species/` with high-quality, scientifically accurate AI-generated illustrations for tree species, and wire ImageLoader to use them as the preferred image source.

### Success Criteria

1. At least 50 species have AI-generated illustrations in `assets/species/`
2. Images in consistent style: naturalist watercolor/pen-and-ink (matching the scientific aesthetic)
3. File format: WebP, optimized for web (< 100KB each, 512x512 or 768x768)
4. File naming: `{node-id}.webp` (e.g., `homo-sapiens.webp`, `coelacanth.webp`)
5. ImageLoader prefers local illustration over PHOTO_MAP (Wikimedia) when available
6. Fallback chain: `assets/species/{id}.webp` → PHOTO_MAP → Wikipedia fetch → placeholder
7. Attribution metadata in a JSON manifest: `assets/species/manifest.json`
8. No impact on load time for species without illustrations (lazy loading)
9. Zero console errors
10. Images display correctly in both panel hero and tree node overlay

---

## Implementation Plan

### Phase A: Generate illustration prompts

1. Read `js/imagePrompts.js` — it contains prompt templates per species
2. For each species, generate the appropriate prompt
3. Prioritize: iconic species first (LUCA, E. coli, T-rex, blue whale, oak tree, octopus, etc.)

### Phase B: Image generation and review

1. Generate images using the prompts (external AI tool — not automated in this phase)
2. Review each image for scientific accuracy (correct anatomy, proportions, features)
3. Optimize to WebP format, 512x512, < 100KB
4. Save to `assets/species/{node-id}.webp`

### Phase C: Create manifest

```json
// assets/species/manifest.json
{
  "version": 1,
  "style": "naturalist watercolor",
  "images": {
    "luca": { "file": "luca.webp", "prompt": "...", "generated": "2026-03-15" },
    "homo-sapiens": { "file": "homo-sapiens.webp", "prompt": "...", "generated": "2026-03-15" }
  }
}
```

### Phase D: Wire ImageLoader

Update `js/imageLoader.js` fallback chain:
```js
// Current: PHOTO_MAP → node.img → emoji
// New:     assets/species/{id}.webp → PHOTO_MAP → node.img → emoji
```

Add to `getBestUrl(node)`:
1. Check if `assets/species/${node.id}.webp` exists (via manifest or trial load)
2. If available, return local path (fast, no CORS issues)
3. Else fall through to existing PHOTO_MAP logic

### Phase E: Preload strategy

- Don't preload all illustrations on page load
- Load illustration only when node is clicked (panel) or visible (tree render)
- Use `loading="lazy"` on `<img>` elements

---

## Files You Will Create

| File | Contents |
|------|----------|
| `assets/species/manifest.json` | Image manifest with metadata |
| `assets/species/*.webp` | AI-generated species illustrations |

## Files You Will Modify

| File | What changes |
|------|-------------|
| `js/imageLoader.js` | Add local illustration as top priority in fallback chain |
| `PROJECT_PROGRESS.md` | Add p34 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

---

## Testing Checklist

1. Species with illustrations show AI art in panel (not Wikimedia photo)
2. Species without illustrations still fall back to PHOTO_MAP → placeholder
3. Illustrations display on tree node overlay (circular clip)
4. Illustrations render in both dark and light themes
5. manifest.json loads without error
6. No CORS issues (local files)
7. Mobile: illustrations load at appropriate resolution
8. No increase in initial page load time
9. Zero console errors
