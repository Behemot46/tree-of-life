# P20 — Naturalist Node Artwork

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p20** as part of a parallel batch (p20 + p21 + p23 run concurrently in separate worktrees).

**Your scope:** Replace all SVG silhouette node icons on the main tree canvas with high-quality, consistent artistic illustrations. You touch `render()` node rendering and the icon/image asset pipeline. You do NOT touch the detail panel (`renderPanelContent()`), the DNA/compare features, or any other UI beyond tree node visuals.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Replace the current 20 monochrome SVG path silhouettes (`NODE_ICONS` map in index.html ~line 1742) with a richer, more visually appealing icon system that gives every tree node a consistent, recognizable artistic identity.

### Success Criteria

1. Every tree node (~130+) displays a visually distinct, high-quality icon on the canvas
2. Icons are consistent in style (same visual language — e.g., all line-art, all filled naturalist sketches, or all scientific diagram style)
3. Icons scale cleanly with node radius (`n.r` ranges 8–26px, rendered at `n.r * 1.1` scale)
4. Icons work in both dark and light themes (appropriate fill/stroke colors via CSS or theme check)
5. Photo overlay from ImageLoader still works on top of icons (existing `foreignObject` + `<img>` pattern preserved)
6. Fallback chain intact: icon renders immediately, photo overlays on load, error removes photo and icon remains visible
7. No performance regression — `render()` rebuilds full tree via DocumentFragment on every call
8. Zero console errors on load and interaction

---

## Context: Current Implementation

### How node icons work now (index.html ~lines 2012–2057)

```
render() builds SVG per node:
  1. Circle (filled with node.color)
  2. addSilhouette() — appends SVG <path> from NODE_ICONS[getIconGroup(n)]
  3. If ImageLoader has a URL → foreignObject + HTML <img> overlays on top
     - On img load: photo covers silhouette naturally
     - On img error: foreignObject removed, silhouette remains visible
```

### NODE_ICONS map (~line 1742)

20 categories: bacteria, archaea, plant, fungus, animal, fish, bird, reptile, amphibian, insect, mollusk, cnidarian, sponge, echinoderm, worm, crustacean, primate, hominin, mammal, default. Each is a single SVG `d` path string drawn in a 24x24 viewbox.

### getIconGroup(n) (~line 1766)

Maps node IDs to icon categories based on `n.id` string matching and ancestry checks (walks `_parent` chain). Returns one of the 20 category strings.

### Key constraints

- `render()` is called frequently (zoom, pan, expand/collapse) — it rebuilds the entire SVG via DocumentFragments
- Each icon is created as `document.createElementNS('svg','path')` with `setAttribute('d', iconPath)` and a `transform` for position+scale
- Icons must be purely SVG (no external image loads that would add latency to render)
- The `<foreignObject>` photo overlay pattern must be preserved — icons sit underneath photos

---

## Implementation Plan

### Phase A: Expand and improve the icon library

1. **Audit all ~130+ nodes** in `js/treeData.js` TREE object — list every node ID and what `getIconGroup()` currently returns for it
2. **Design an expanded icon set** targeting ~30-40 distinct icons (up from 20) to better differentiate:
   - Split "animal" into sub-categories where meaningful (e.g., arthropod vs vertebrate distinction)
   - Add icons for specific notable groups: dinosaur/archosaur, whale/cetacean, spider/arachnid, coral, jellyfish, fern, conifer, flowering plant, moss, algae, protist/amoeba
   - Ensure each icon is visually distinct at 10-26px rendered size
3. **Create SVG path data** for each new icon — consistent style:
   - Filled silhouette style (not outline-only — these are small)
   - Designed for a 24x24 viewbox (matching current system)
   - Recognizable at small sizes — distinctive profile/shape
   - Single path `d` string (no multi-path, no strokes, just fill)

### Phase B: Update getIconGroup() mapping

1. Expand `getIconGroup(n)` to return more specific categories
2. Add new ID-based matches for nodes that deserve specific icons
3. Preserve the ancestry-walk fallback logic for unmapped nodes
4. Ensure every node in TREE maps to a valid icon

### Phase C: Improve rendering quality

1. Update `addSilhouette()` in `render()` if needed for the new icons
2. Consider adding a subtle background disc behind icons for better visibility against varied branch colors
3. Ensure theme adaptation: icons should be clearly visible on both dark (`--bg:#1a1d23`) and light backgrounds
4. Test that photo overlay still covers icons correctly

### Phase D: Extract to module (optional but recommended)

1. Move `NODE_ICONS` and `getIconGroup()` from inline script to a new `js/nodeIcons.js`
2. Add `<script src="js/nodeIcons.js"></script>` before the main script block
3. This keeps inline script cleaner and makes icons independently maintainable

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | `NODE_ICONS` map (expanded), `getIconGroup()` (expanded), possibly `addSilhouette()` in `render()` |
| `js/nodeIcons.js` | **NEW** — extracted icon map + mapping function (if extracting) |
| `PROJECT_PROGRESS.md` | Add p16 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `renderPanelContent()` — that's p21's scope
- `js/speciesData.js` PHOTO_MAP — shared, don't touch
- `js/imageLoader.js` — shared, don't touch
- Compare/DNA features — that's p23's scope
- Any CSS for panel, compare, hominin view

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. All tree nodes render with icons (no blank circles)
3. Nodes with PHOTO_MAP entries show photo overlay on top of icon
4. Expand/collapse branches — icons render correctly after re-render
5. Zoom in/out — icons scale properly
6. Toggle dark/light theme — icons visible in both
7. Switch to cladogram and chronological views — icons render
8. Hebrew RTL — no icon mirroring issues
9. Zero console errors
10. Performance: tree interaction feels smooth (no perceptible lag vs current)

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p16-node-artwork`
- PR title: `feat: expand tree node icon library with naturalist illustrations`
- PR against `main`
- Include before/after description of icon count (20 → N)

---

## Documentation Updates

### PROJECT_PROGRESS.md

Add to the Completed table:
```
| p20 | Naturalist node artwork — expanded icon library (20→N icons), improved mapping | PR #XX |
```

Change status in Upcoming table from `Pending` to `Done`.

### SESSION_HANDOFF.md

Write a complete handoff with:
- What was done (summary)
- List of new icon categories added
- Any nodes that still need better icon matches
- Current state (branch, PR, clean/dirty)
- Known issues or follow-up items
