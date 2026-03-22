# P21 — Species Panel Visual Identity

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p21** as part of a parallel batch (p20 + p21 + p23 run concurrently in separate worktrees).

**Your scope:** Replace emoji headers and improve visual presentation in the species detail panel (`renderPanelContent()` function). You touch the panel rendering code, panel CSS, and the image display within panels. You do NOT touch the tree canvas `render()` function, node icons, DNA/compare features, or tree layout.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Replace the emoji-based species headers in the detail panel with high-quality photos or artwork, creating a visually rich "species card" experience when users click on any tree node.

### Success Criteria

1. Panel header shows a large, attractive hero image for the species (not an emoji)
2. Image sourcing priority: PHOTO_MAP (Wikimedia) → Wikipedia API fetch → AI-generated (assets/species/) → graceful fallback (styled placeholder with icon, not raw emoji)
3. Image presentation: consistent framing — rounded corners, proper aspect ratio, credit attribution
4. Fallback is visually polished — not a broken image or ugly emoji dump
5. Works for all ~130+ species panels (not just a subset)
6. Panel loads fast — image loading is non-blocking (panel content appears immediately, image fills in)
7. Dark and light themes both look good
8. Mobile bottom-sheet panel still works correctly
9. RTL (Hebrew) layout not broken
10. Zero console errors

---

## Context: Current Panel Implementation

### renderPanelContent(node) — index.html ~line 2521

This function builds the entire panel HTML as a template string and sets `innerHTML`. Key sections:

```
1. Header: node.icon (emoji) + node.name + node.latin + extinct badge
2. Photo section: PHOTO_MAP lookup → <img> with loading state, OR fetchWikiPhoto() fallback
3. Traits: node.tags as chips
4. Description: node.desc + node.detail paragraphs
5. Facts: node.facts as label/value grid
6. Sub-groups: children list with click handlers
7. Hominin-specific: brain volume bar, tools/fire/language badges, DNA introgression, fossil sites
```

### CRITICAL BUG: Duplicate PHOTO_MAP

There is a **duplicate `const PHOTO_MAP`** defined inside `renderPanelContent()` starting at ~line 2571. This shadows the global PHOTO_MAP from `js/speciesData.js`. This inline copy has 228 entries. **You must remove this duplicate** and use the global PHOTO_MAP instead (it's already loaded via `<script src="js/speciesData.js">`).

### Current photo loading in panel

The panel currently uses:
1. Inline PHOTO_MAP (the duplicate — should use global instead)
2. `fetchWikiPhoto()` — defined inside renderPanelContent(), fetches from Wikipedia REST API, caches in `window._photoCache`
3. On success: shows `<img>` and hides emoji fallback div
4. On failure: emoji fallback remains visible

### ImageLoader (js/imageLoader.js)

Already exists and handles the fallback chain: PHOTO_MAP → generated (.webp) → node.img → emoji. The panel should leverage `ImageLoader.getBestUrl()` and `ImageLoader.loadInto()` instead of reimplementing the logic.

### Key files

- `index.html` — renderPanelContent() at ~line 2521, panel CSS in `<style>` block
- `js/speciesData.js` — global PHOTO_MAP (228 entries), WIKI_TITLES, ENRICHMENT
- `js/imageLoader.js` — ImageLoader module with fallback chain
- Panel HTML element: `<div id="panel">` at ~line 1110

---

## Implementation Plan

### Phase A: Clean up duplicate PHOTO_MAP

1. **Delete** the inline `const PHOTO_MAP = { ... }` inside `renderPanelContent()` (~lines 2571–2800+)
2. Verify that the global `PHOTO_MAP` from `js/speciesData.js` is accessible (it is — loaded via `<script>` tag)
3. Update any references inside `renderPanelContent()` that used the local PHOTO_MAP to use the global one

### Phase B: Redesign panel hero image section

1. **Hero image area:** Replace the current emoji + small photo approach with a prominent hero image section:
   - Full-width image area at top of panel (below the back button, above the title)
   - Or: large circular/rounded image next to the title (museum card style)
   - Height: ~200px on desktop, ~150px on mobile
   - `object-fit: cover` for consistent framing
   - Subtle overlay gradient at bottom for text readability if title overlaps

2. **Image loading UX:**
   - Show a styled placeholder/skeleton while image loads (CSS shimmer animation or domain-colored background)
   - Use `ImageLoader.getBestUrl(node)` for initial URL
   - If PHOTO_MAP hit: load directly
   - If no PHOTO_MAP: fall back to `fetchWikiPhoto()` (keep this as secondary source)
   - If all fail: show a styled placeholder with the node's SVG silhouette icon (from NODE_ICONS) or domain color fill — NOT a raw emoji

3. **Credit line:** Small text below image: "Photo: Wikipedia / Wikimedia Commons" or "AI-generated illustration" based on source

### Phase C: Improve panel header typography

1. **Species name:** Large, prominent (Inter bold, ~1.4rem)
2. **Latin/scientific name:** Italic, muted color, below common name
3. **Extinct badge:** Keep existing red pill badge
4. **Remove raw emoji** from the header — the hero image replaces it

### Phase D: Style the fallback state

1. When no image is available at all, show a visually designed placeholder:
   - Domain-colored gradient background (use `node.color`)
   - Large centered SVG silhouette icon (from NODE_ICONS/getIconGroup)
   - Or: `assets/placeholder.svg` with a tinted overlay
2. This should look intentional, not broken

### Phase E: Mobile & theme compatibility

1. Test panel as bottom-sheet on mobile (max-height: 75vh, swipe-to-close)
2. Hero image should not consume too much vertical space on mobile — cap at 150px
3. Dark theme: image container blends with `--surface` background
4. Light theme: subtle border or shadow around image
5. RTL: image section should not flip (images are not directional)

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | `renderPanelContent()` — hero image section rewrite, remove duplicate PHOTO_MAP, update header HTML template. Panel CSS in `<style>` block — hero image styles, skeleton loading, fallback placeholder |
| `PROJECT_PROGRESS.md` | Add p17 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` function (tree canvas) — that's p20's scope
- `NODE_ICONS` / `getIconGroup()` — that's p20's scope (but you may READ them for fallback rendering)
- `js/speciesData.js` — shared data, don't restructure
- `js/imageLoader.js` — shared module, don't modify its API
- Compare/DNA features — that's p23's scope

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Click any tree node → panel opens with hero image (not emoji)
3. Click nodes that have PHOTO_MAP entries → photo loads quickly
4. Click nodes without PHOTO_MAP → Wikipedia fetch attempted → fallback if no result
5. Check a node with no image at all → styled placeholder (not broken image icon)
6. Credit text shows below image
7. Toggle dark/light theme with panel open — image area looks good in both
8. Mobile viewport (375px width) — panel as bottom-sheet, image not too tall
9. Hebrew RTL — panel layout correct, image not mirrored
10. Russian — panel text renders correctly
11. Open panel, close, open different node — no stale images
12. Zero console errors
13. Check that global PHOTO_MAP is used (no duplicate const in renderPanelContent)

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p17-panel-visuals`
- PR title: `feat: replace panel emoji headers with hero images and styled fallbacks`
- PR against `main`
- Mention the duplicate PHOTO_MAP cleanup in PR description

---

## Documentation Updates

### PROJECT_PROGRESS.md

Add to the Completed table:
```
| p21 | Species panel visual identity — hero images, PHOTO_MAP dedup, styled fallbacks | PR #XX |
```

Change status in Upcoming table from `Pending` to `Done`.

### SESSION_HANDOFF.md

Write a complete handoff with:
- What was done (summary)
- The duplicate PHOTO_MAP removal
- How the new hero image section works (sourcing chain)
- What the fallback looks like
- Current state (branch, PR, clean/dirty)
- Known issues or follow-up items
