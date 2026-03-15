# P24 — Always-Visible Hominin Branch

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p24** as part of a parallel batch (p22 + p24 + p25 run concurrently in separate worktrees).

**Your scope:** Make the full hominin family tree always visible as an expanded branch with twigs on the main tree canvas — no "explore deeper" button required. You touch `render()`, `buildHomininTree()`, layout functions, and the hominini node collapse logic. You do NOT touch `renderPanelContent()`, legend/domain highlighting, or panel data/infographics.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Show the full hominin family tree (28 species in 4 groups) as an expanded branch with twigs directly on the main tree canvas, so users can see the spread of human evolution without pressing any button.

### Success Criteria

1. Hominin branch (hominini node → 4 groups → 28 species) is visible and expanded by default on the main tree
2. Hominin twigs don't crowd or overlap other major branches — layout adapts automatically
3. Hominin species labels are readable (larger than typical deep nodes)
4. Golden path emphasis continues through the hominin branch to Homo sapiens
5. Clicking any hominin species opens its panel (existing behavior preserved)
6. Works in all 3 view modes: radial, cladogram, chronological
7. The "Human Evolution" floating button and dedicated hominin view still work as alternative access
8. Mobile: hominin branch visible without excessive zoom
9. No performance regression
10. Zero console errors

---

## Context: Current Hominin Implementation

### buildHomininTree() — index.html ~line 1389

Builds 4 group nodes (Proto-Hominins, Australopithecus, Paranthropus, Genus Homo) under the `hominini` node, each with their HOMININS species as children. Called at module load time.

### Default collapse — index.html ~line 1461–1462

```js
// Collapse hominini subtree by default so tree isn't visually overloaded
if(nodeMap['hominini']) nodeMap['hominini']._collapsed=true;
```

**This is the key line to change.** Currently hominini starts collapsed, hiding all 28 species until the user clicks to expand.

### HUMAN_PATH — index.html ~line 1877

```js
const HUMAN_PATH=new Set(['luca','eukaryota','animalia','vertebrates','mammals','primates','great-apes','homo-sapiens']);
```

This highlights the path from LUCA to Homo sapiens with accent color and 3px stroke. It does NOT currently include the hominini node or intermediate group nodes.

### Layout functions

- `layoutRadial()` — angular positioning, uses `assignAngles()` and `assignPositions()`
- `layoutCladogram()` — left-to-right tree, leaf counting for Y distribution
- `layoutChronological()` — time-axis positioning with domain lanes
- `subtreeWeight(n)` — counts visible (non-collapsed) descendants, used for angular spacing in radial layout

### Rendering of hominini node — index.html ~line 1990

Special rendering: golden pulsing ring (`@keyframes homininGlow`), "Explore →" badge. This will need adjustment since the branch will be expanded by default.

### Key constraints

- `render()` rebuilds entire SVG on every call (DocumentFragment pattern)
- `_collapsed` flag on nodes controls whether children are rendered
- Label collision detection uses global bounding-box priority (HUMAN_PATH nodes always visible)
- Subtree-weighted radial spacing (p17) gives more angular room to branches with more visible descendants

---

## Implementation Plan

### Phase A: Expand hominini by default

1. **Remove or invert** the collapse default at ~line 1461:
   ```js
   // Was: if(nodeMap['hominini']) nodeMap['hominini']._collapsed=true;
   // Now: hominini starts expanded
   if(nodeMap['hominini']) nodeMap['hominini']._collapsed=false;
   ```
2. Also ensure the 4 group nodes start expanded:
   ```js
   ['group-proto','group-australopith','group-paranthropus','group-homo'].forEach(id => {
     if(nodeMap[id]) nodeMap[id]._collapsed = false;
   });
   ```

### Phase B: Layout adaptation

1. **Radial layout**: The subtree-weighted spacing (p17) should automatically give hominini more angular room since its descendants are now visible. Verify this works correctly — if the 28 species crowd too much:
   - Consider applying a `minAngle` floor for the hominini subtree
   - Or slightly reduce the radius step (`DEPTH_R`) for hominin-depth nodes to create a tighter fan

2. **Cladogram layout**: Verify leaf counting distributes space properly with 28 extra visible leaves

3. **Chronological layout**: Hominin species have `appeared` values (0.3–7 Mya) — they should cluster in the recent time segment. Verify they don't pile on top of each other. May need dedicated Y-lane or jitter for hominins.

4. **Test all 3 views** and adjust spacing as needed

### Phase C: Update HUMAN_PATH

Extend `HUMAN_PATH` to include the hominini node and the group-homo node so the golden path continues through the hominin branch:

```js
const HUMAN_PATH = new Set([
  'luca','eukaryota','animalia','vertebrates','mammals','primates','great-apes',
  'hominini','group-homo','homo-sapiens'
]);
```

### Phase D: Hominin label visibility

1. **Force hominin labels visible**: Add hominin group IDs and key species to the label priority system so they always show (like HUMAN_PATH nodes)
2. **Larger labels for hominin species**: Override font size for nodes at hominin depth (depth ≥ 5 under hominini) to be 10-11px instead of the default 8-9px for deep nodes
3. **Consider abbreviated labels**: If full species names collide, use abbreviated forms (e.g., "H. erectus" instead of "Homo erectus")

### Phase E: Adjust hominini node special rendering

Since hominini is now expanded by default:
1. **Remove or tone down** the "Explore →" badge — it's no longer needed as a call-to-action
2. **Keep the golden ring** but remove the pulsing animation (or make it subtle) — the branch itself is now visible
3. The "Human Evolution" floating button (`#btn-hominin`) should still work — it opens the dedicated hominin side panel view, which is a different UX from the inline tree

### Phase F: Mobile considerations

1. On mobile, 28 extra nodes may make the tree denser. Verify:
   - Pinch-to-zoom still works to see hominin detail
   - Touch targets for hominin nodes are adequate (≥ 44px touch area)
   - The tree doesn't become unusable on small screens
2. Consider: on very small screens (< 480px), maybe keep hominini collapsed but with visual indicator? Or just let users zoom in — the branch is always there.

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | Remove hominini collapse default, update HUMAN_PATH, adjust label priority for hominins, modify hominini node special rendering, possibly tweak layout spacing |
| `PROJECT_PROGRESS.md` | Add p24 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `renderPanelContent()` — that's p22's scope
- `toggleDomain()` / `resetDomains()` / legend — that's p25's scope
- `js/speciesData.js` — don't restructure
- `js/imageLoader.js` — don't modify
- `js/treeData.js` — don't restructure the TREE (hominin data comes from buildHomininTree())

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. **On load**: hominini branch visible with 4 groups and species twigs
3. **Radial view**: hominin branch fans out without overlapping Animals/Fungi branches
4. **Cladogram view**: hominin species listed as leaves at the right
5. **Chronological view**: hominin species clustered in recent time (0–7 Mya)
6. **Golden path**: accent-colored line from LUCA through to Homo sapiens (including hominini → group-homo)
7. **Labels**: hominin group names and key species readable without zoom
8. **Click hominin species**: panel opens with enriched hominin data
9. **Right-click hominini**: can still manually collapse/expand
10. **"Human Evolution" button**: still opens dedicated hominin side panel
11. **Mobile (375px)**: tree usable, hominins visible after reasonable zoom
12. **Dark/light theme**: hominin branch styled correctly
13. **Hebrew RTL**: branch direction correct
14. Zero console errors
15. No performance regression (tree interaction smooth)

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p24-hominin-branch`
- PR title: `feat: show hominin family tree as always-visible branch on main canvas`
- PR against `main`

---

## Documentation Updates

### PROJECT_PROGRESS.md

Add to the Completed table:
```
| p24 | Always-visible hominin branch — expanded by default, golden path, label priority | PR #XX |
```

Change status in Upcoming table from `Pending` to `Done`.

### SESSION_HANDOFF.md

Write a complete handoff with:
- What was done (summary)
- How the layout adapted to 28 extra visible nodes
- HUMAN_PATH changes
- What was kept/removed from special hominini rendering
- Current state (branch, PR, clean/dirty)
- Known issues or follow-up items
