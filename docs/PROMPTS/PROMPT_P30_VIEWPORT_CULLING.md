# P30 — Viewport Culling (Quadtree)

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p30** (Tier 3 — Scale & Performance).

**Your scope:** Implement spatial indexing so that `render()` only draws nodes and branches within the current viewport. You touch `render()`, add a quadtree spatial index, and modify zoom/pan handlers. You do NOT touch panel content, search, timeline, or data files.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `perf:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Achieve 60fps rendering at 1,000+ visible nodes by only drawing what's on screen.

### Success Criteria

1. Render time per frame proportional to visible nodes, not total nodes
2. 60fps maintained at 1K+ nodes during pan/zoom
3. Quadtree rebuilt on layout change, queried on every render
4. Buffer zone around viewport prevents pop-in artifacts
5. Labels, branches, and photos all culled consistently
6. No visual artifacts — nodes appear/disappear smoothly at viewport edges
7. Current 130-node behavior unchanged (all nodes visible at default zoom)
8. Zero console errors

---

## Context

### Current render() pattern

```js
function render() {
  // 1. layout() — computes _x, _y for ALL visible nodes
  // 2. Build DocumentFragment with ALL nodes + branches
  //    - branchFrag: SVG paths for every parent-child connection
  //    - nodesFrag: SVG groups for every node (circle + icon + label + photo)
  // 3. branchLayer.replaceChildren(branchFrag)
  //    nodesLayer.replaceChildren(nodesFrag)
}
```

- Rebuilds entire SVG every call (~130 SVG groups + ~130 paths)
- At 1K nodes: ~2K SVG elements per frame → potential jank
- Called on: zoom, pan, expand/collapse, window resize

### Transform state

```js
let transform = { x: 0, y: 0, s: 1 }; // pan x/y, zoom scale
```

Applied as `setAttribute('transform', 'translate(x,y) scale(s)')` on the main SVG `<g>`.

### Viewport calculation

The SVG viewBox is the full window. The visible area in tree coordinates is:
```js
const vw = window.innerWidth;
const vh = window.innerHeight;
const visibleRect = {
  x: -transform.x / transform.s,
  y: -transform.y / transform.s,
  w: vw / transform.s,
  h: vh / transform.s
};
```

---

## Implementation Plan

### Phase A: Implement quadtree

1. Create `js/quadtree.js` — simple 2D quadtree:
   ```js
   class Quadtree {
     constructor(bounds, capacity = 10) { ... }
     insert(point) { ... }     // { x, y, id }
     query(rect) { ... }       // returns points within rect
     clear() { ... }
     rebuild(points) { ... }
   }
   ```
2. No npm deps — pure vanilla JS implementation
3. Bounds: computed from all node positions after layout

### Phase B: Build spatial index after layout

1. After `layout()` completes, rebuild quadtree:
   ```js
   const spatialIndex = new Quadtree(treeBounds);
   for (const [id, node] of nodeMap) {
     if (!node._collapsed_ancestor) {  // only visible nodes
       spatialIndex.insert({ x: node._x, y: node._y, id: node.id });
     }
   }
   ```
2. Only rebuild when layout changes (expand/collapse, view mode change), NOT on pan/zoom

### Phase C: Query visible nodes in render()

1. Compute visible rect from current transform:
   ```js
   const buffer = 100 / transform.s; // 100px buffer in screen space
   const visibleRect = {
     x: -transform.x / transform.s - buffer,
     y: -transform.y / transform.s - buffer,
     w: window.innerWidth / transform.s + 2 * buffer,
     h: window.innerHeight / transform.s + 2 * buffer
   };
   ```
2. Query quadtree: `const visibleIds = new Set(spatialIndex.query(visibleRect).map(p => p.id))`
3. In render loop, skip nodes not in `visibleIds`
4. For branches: include if either parent or child is visible

### Phase D: Optimize branch culling

Branches connect parent → child. Include a branch if:
- Parent is visible, OR
- Child is visible, OR
- Branch line intersects viewport (optional — simpler to just check endpoints)

### Phase E: Pan/zoom optimization

1. On pan: don't rebuild quadtree, just requery with new viewport rect
2. On zoom: same — requery only
3. Only rebuild quadtree on: expand/collapse, view mode switch, window resize
4. Use `requestAnimationFrame` to debounce render during continuous pan/zoom

### Phase F: Benchmarking

1. Add optional debug overlay showing: visible/total node count, render time per frame
2. Toggle with a keyboard shortcut (Ctrl+Shift+D)
3. Target: <16ms render time (60fps budget)

---

## Files You Will Create/Modify

| File | What changes |
|------|-------------|
| `js/quadtree.js` | **NEW** — spatial index implementation |
| `index.html` | Integrate quadtree in render(), viewport calculation, script tag |
| `PROJECT_PROGRESS.md` | Add p30 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `renderPanelContent()` — panel
- `js/treeData.js`, `js/speciesData.js` — data
- Search, timeline, compare, DNA calc
- CSS (except optional debug overlay)

---

## Testing Checklist

1. `node serve.js` → tree renders identically at current 130 nodes
2. Zoom in → only nearby nodes rendered (check SVG element count in DevTools)
3. Zoom out → all nodes rendered
4. Pan → nodes appear at edges without pop-in (buffer zone works)
5. Expand/collapse → quadtree rebuilds, new nodes appear correctly
6. Switch view modes → works in radial, cladogram, chronological
7. Click node → panel opens (node was in visible set)
8. Search → found node highlighted even if off-screen (auto-zoom to it)
9. Mobile: pinch-to-zoom + pan → smooth
10. Performance: `console.time('render')` shows <16ms
11. Debug overlay (if added): shows visible/total counts
12. Zero console errors

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p30-viewport-culling`
- PR title: `perf: add quadtree viewport culling for scalable rendering at 1K+ nodes`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `perf:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p30 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
