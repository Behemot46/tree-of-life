# P34 — Naturalist Node Artwork

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p34** (Tier 4 — Content).

**Your scope:** Replace all SVG silhouette node icons on the main tree canvas with high-quality, consistent artistic illustrations. You touch `render()` node rendering, `NODE_ICONS`, `getIconGroup()`, and the icon asset pipeline. You do NOT touch the detail panel, DNA/compare features, or layout algorithms.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Replace the 20 monochrome SVG silhouettes with a richer icon set (~30-40 distinct icons) that gives every tree node a recognizable artistic identity.

### Success Criteria

1. Every tree node (~130+) displays a visually distinct, high-quality icon
2. Consistent style: all pen-and-ink naturalist sketches or scientific illustrations
3. Icons scale cleanly with node radius (8–26px rendered)
4. Work in dark and light themes
5. Photo overlay from ImageLoader preserved on top
6. Fallback chain: icon → photo overlay → error removes photo, icon remains
7. No performance regression
8. Zero console errors

---

## Context

### Current NODE_ICONS (index.html ~line 1742)

20 categories: bacteria, archaea, plant, fungus, animal, fish, bird, reptile, amphibian, insect, mollusk, cnidarian, sponge, echinoderm, worm, crustacean, primate, hominin, mammal, default. Each is a single SVG `d` path in a 24×24 viewbox.

### getIconGroup(n)

Maps node IDs to icon categories via string matching and ancestry walks.

### Rendering in render()

```
1. Circle (filled with node.color)
2. addSilhouette() — SVG <path> from NODE_ICONS[getIconGroup(n)]
3. If ImageLoader URL → foreignObject + HTML <img> overlay
```

---

## Implementation Plan

### Phase A: Expand icon library to ~35 categories

Add icons for: dinosaur, whale, spider, coral, fern, conifer, flowering plant, moss, algae, protist/amoeba, butterfly, beetle, seahorse, turtle, penguin. Each as a single-path SVG `d` string.

### Phase B: Update getIconGroup() mapping

Expand to return more specific categories. Add ID-based matches for distinctive species.

### Phase C: Improve rendering quality

- Subtle background disc behind icons for visibility
- Theme adaptation (fill color check)
- Test photo overlay still works

### Phase D: Optional extraction to js/nodeIcons.js

Move NODE_ICONS and getIconGroup to separate file for maintainability.

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | NODE_ICONS expanded, getIconGroup() expanded, addSilhouette() tweaks |
| `js/nodeIcons.js` | **NEW** (optional) — extracted icons module |
| `PROJECT_PROGRESS.md` | Add p34 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `renderPanelContent()` — panel
- `js/speciesData.js` — shared data
- `js/imageLoader.js` — image system
- Compare/DNA features

---

## Testing Checklist

1. All nodes render with icons (no blank circles)
2. Photo overlay works on top of icons
3. Expand/collapse → icons render after re-render
4. Zoom in/out → icons scale
5. Dark/light theme → icons visible in both
6. Cladogram and chronological views → icons render
7. Hebrew RTL → no icon mirroring issues
8. Zero console errors
9. Performance smooth

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p34-naturalist-art`
- PR title: `feat: expand tree node icon library with naturalist illustrations (20→35 icons)`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p34 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
