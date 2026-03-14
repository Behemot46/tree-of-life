# Session Handoff — 2026-03-14

**Status: done**

## 1. Session Goal
Replace species icon emojis with AI-generated photorealistic images: build the image prompt library, image loading infrastructure, and graceful fallback chain.

## 2. What I Changed

### New Files
- **`js/imagePrompts.js`** — AI image generation prompt library for all 131 TREE nodes + HOMININS entries. Each entry has `prompt` (text for image generation), `style` (photo/micro/fossil/illustration), and `tags` (reusable metadata).
- **`js/imageLoader.js`** — `ImageLoader` IIFE module implementing:
  - URL pattern: `assets/species/{id}.webp`
  - Fallback chain: generated image → node `img` field → emoji
  - Session-scoped fail-once tracking (no retry loops)
  - `loadInto()` for SVG `<image>` and HTML `<img>` elements
  - `getBestUrl()`, `createImage()`, `preload()` public API
- **`assets/species/.gitkeep`** — Directory for future AI-generated species images

### Modified Files
- **`index.html`**:
  - Added `<script src>` tags for imagePrompts.js and imageLoader.js (before inline script)
  - Modified tree node rendering (lines ~2700): tries ImageLoader species image first, clips to circle via SVG `<clipPath>`, falls back to emoji `foreignObject` on error
  - Modified panel hero image: ImageLoader generated URL tried first, then PHOTO_MAP, then node.img, then emoji
  - Added `.node-species-img` CSS class with fade-in transition
- **`serve.js`**: Uses `process.env.PORT || 5555` for port (preview compatibility), added `.webp` MIME type

## 3. Why These Changes Were Made
- The prompt library enables future AI image generation for every species node
- The ImageLoader provides a single source of truth for images across tree, panel, and search
- The fallback chain ensures no broken nodes: generated → curated → emoji
- Fail-once tracking prevents retry loops on missing images

## 4. Files Touched
- `js/imagePrompts.js` (new, ~500 lines)
- `js/imageLoader.js` (new, ~160 lines)
- `assets/species/.gitkeep` (new)
- `index.html` (modified, +82 -13 lines)
- `serve.js` (modified, +2 -1 lines)

## 5. Key Implementation Notes
- The external `js/tree.js`, `js/panel.js`, etc. are **dead code** — not loaded by any `<script>` tag. All rendering logic is inline in the single `<script>` block in `index.html`.
- ImageLoader is designed to work with or without imagePrompts.js — it only uses node data's `id` and `img` fields
- SVG images use `<clipPath>` with `<circle>` for circular cropping, matching node radius
- Panel hero `onerror` handler has multi-stage fallback: generated → PHOTO_MAP → node.img → emoji div
- No actual AI-generated images exist yet — the system gracefully falls back to existing behavior

## 6. Risks / Caveats
- When actual .webp images are placed in `assets/species/`, they will load automatically (no code change needed)
- The first render with no images will briefly attempt to load each `assets/species/{id}.webp`, get 404s, and cache failures for the session. This is by design and has no visible impact.
- `js/tree.js` and `js/panel.js` are dead code but were not deleted (out of scope for this session)

## 7. Tests Performed
- Verified tree renders correctly with emoji fallback (screenshot)
- Verified panel opens with correct content for LUCA node
- Verified Hebrew (RTL) language switch works without regression
- Verified zero console errors and warnings
- Verified JS syntax of new files with `node -c`

## 8. Not Tested
- Russian language
- Mobile responsive layout
- Search functionality with image thumbnails (not yet implemented)
- Actual .webp image loading (no images generated yet)
- Cladogram layout toggle

## 9. Known Issues Still Open
- Search results don't show thumbnails yet (planned next step)
- Dead JS modules (tree.js, panel.js, etc.) still in repository
- Breadcrumb still uses emoji (`n.icon`) — could use images in future
- Tooltip still uses emoji (`showTip(n.name, n.icon)`)

## 10. Recommended Next Step
1. Generate actual .webp images using the prompt library — place in `assets/species/{id}.webp`
2. Add image thumbnails to search results
3. Clean up dead JS modules (tree.js, panel.js, api.js, etc.)

## 11. Suggested Commit Message
```
feat: add species image system with AI prompt library, loader, and fallback chain
```

## 12. Suggested PR Title
`feat: species image system with AI prompt library and graceful fallback`

## 13. Suggested PR Description
```
## Summary
- Add AI image generation prompt library (131 species) in `js/imagePrompts.js`
- Add `ImageLoader` module with fail-once tracking and 3-tier fallback chain
- Integrate species images into tree nodes (SVG circular crop) and panel hero
- Graceful degradation: generated image → curated photo → emoji icon

## Test plan
- [ ] Verify tree renders with emoji fallback (no generated images yet)
- [ ] Verify panel opens correctly with image/emoji hero
- [ ] Verify Hebrew RTL still works
- [ ] Verify no console errors
- [ ] Drop a test .webp into assets/species/ and verify it loads
```

## Branch
`claude/strange-dewdney`

## Next Session Starting Point
- Image prompt library and loader infrastructure are complete
- Generate actual images using prompts, or add search result thumbnails
