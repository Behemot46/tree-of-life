# P28 — Lazy-Loaded Subtrees

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p28** (Tier 3 — Scale & Performance).

**Your scope:** Implement lazy loading of subtree data so that expanding a collapsed branch loads its children on demand instead of having all ~1K+ nodes in memory at init. You touch `js/treeData.js` (split into chunks), `preprocess()`, `render()` expand logic, and create a data loader. You do NOT touch panel content, search UI, timeline, or CSS.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Enable the tree to scale to 1,000+ nodes without degrading initial load time. Only load top-level nodes initially; fetch deeper subtrees when the user expands a branch.

### Success Criteria

1. Initial load includes only top 2-3 depth levels (~30-50 nodes)
2. Expanding a collapsed node fetches and injects its children
3. Loading state: skeleton placeholder while subtree loads
4. Fetched subtrees cached — re-collapsing and re-expanding is instant
5. Search still finds nodes in unloaded subtrees (search index includes all)
6. `nodeMap` populated lazily as subtrees load
7. Back-compatible: works at current 130 nodes (loads everything as one chunk)
8. No visual regression at current scale
9. Zero console errors

---

## Context

### Current data loading

- `js/treeData.js` defines `const TREE = { ... }` — entire nested tree in one object
- `preprocess(TREE)` walks all nodes at init, sets `_parent`, `depth`, populates `nodeMap`
- All ~130 nodes in memory from the start
- `render()` checks `_collapsed` to skip children — but they're still in memory

### Expand/collapse

- Click node → toggles `n._collapsed`
- `scheduleRender()` rebuilds entire SVG
- Currently no concept of "not yet loaded"

---

## Implementation Plan

### Phase A: Design chunk format

1. Split tree data by domain/clade into chunk files:
   ```
   data/tree-root.json      — top 2-3 levels (~40 nodes)
   data/tree-bacteria.json   — bacteria subtree
   data/tree-archaea.json    — archaea subtree
   data/tree-fungi.json      — fungi subtree
   data/tree-plantae.json    — plantae subtree
   data/tree-animalia.json   — animalia subtree (largest)
   data/tree-hominini.json   — hominin subtree (always loaded for golden path)
   ```
2. Root nodes have a `_lazy: 'data/tree-bacteria.json'` marker instead of `children`
3. Hominini subtree always included in initial load (golden path must be visible)

### Phase B: Create data loader

1. Create `js/treeLoader.js`:
   ```js
   const TreeLoader = (() => {
     const cache = {};
     async function loadSubtree(url) {
       if (cache[url]) return cache[url];
       const resp = await fetch(url);
       const data = await resp.json();
       cache[url] = data;
       return data;
     }
     function isLazy(node) { return !!node._lazy && !node.children; }
     return { loadSubtree, isLazy };
   })();
   ```

### Phase C: Modify expand logic

1. In the click handler for tree nodes, before toggling `_collapsed`:
   ```js
   if (TreeLoader.isLazy(node)) {
     node._loading = true;
     scheduleRender(); // show skeleton
     const children = await TreeLoader.loadSubtree(node._lazy);
     node.children = children;
     preprocess(node); // set _parent, depth, populate nodeMap
     delete node._lazy;
     node._loading = false;
     node._collapsed = false;
     scheduleRender();
     return;
   }
   ```

### Phase D: Loading state in render()

1. If `node._loading`, render a pulsing placeholder instead of children:
   - Faded circles at estimated child positions
   - Or a simple "Loading..." text near the node

### Phase E: Search index for lazy nodes

1. Build initial search index from root chunk
2. Include a lightweight metadata index for lazy chunks:
   ```js
   // In tree-root.json, each lazy node includes:
   { id: 'bacteria', _lazy: 'data/tree-bacteria.json',
     _lazyMeta: ['ecoli', 'cyanobacteria', 'mycoplasma', ...] }
   ```
3. Search results for lazy nodes show "Expand to view" hint
4. Clicking a lazy search result triggers the load

### Phase F: Back-compatibility

1. If all data is in a single TREE object (current state), skip lazy loading entirely
2. Detect: `if (typeof TREE.children[0]._lazy === 'undefined')` → use current path
3. This ensures the feature is opt-in and doesn't break existing 130-node setup

---

## Files You Will Create/Modify

| File | What changes |
|------|-------------|
| `js/treeLoader.js` | **NEW** — lazy loading module |
| `data/tree-root.json` | **NEW** — top-level tree (optional, for future use) |
| `index.html` | Modify expand click handler, add loading state to render(), script tag for treeLoader |
| `js/treeData.js` | Add `_lazy` markers to domain root nodes (future-ready) |
| `PROJECT_PROGRESS.md` | Add p28 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `renderPanelContent()` — panel content
- `js/speciesData.js` — photo/wiki data
- CSS layout/theme
- Timeline, compare, DNA calc

---

## Testing Checklist

1. `node serve.js` → app loads with current TREE (back-compat mode)
2. All nodes visible, expandable, panels work
3. If lazy chunks exist: initial load shows only top levels
4. Click lazy node → loading state → children appear
5. Re-collapse and re-expand → instant (cached)
6. Search finds nodes in loaded subtrees
7. Search shows hint for unloaded lazy nodes
8. All 3 view modes work
9. Mobile: lazy loading works on touch
10. Zero console errors

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p28-lazy-subtrees`
- PR title: `feat: add lazy-loaded subtrees for scalable tree data loading`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p28 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
