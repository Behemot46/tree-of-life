# P27 — Always-Visible Hominin Branch

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p27** (Tier 2 — Medium Priority).

**Your scope:** Make the full hominin family tree always visible as an expanded branch on the main tree canvas. You touch `render()`, `buildHomininTree()`, layout functions, and the hominini collapse logic. You do NOT touch `renderPanelContent()`, legend/domain highlighting, or panel data.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Show the full hominin family tree (28 species, 4 groups) expanded by default on the main canvas so users see human evolution immediately.

### Success Criteria

1. Hominini branch expanded by default (28 species visible on load)
2. Layout adapts — no overlap with other major branches
3. Hominin labels readable (larger than typical deep nodes)
4. Golden path extends through hominini → group-homo → homo-sapiens
5. Works in all 3 view modes (radial, cladogram, chronological)
6. "Human Evolution" floating button still opens dedicated view
7. Mobile: visible after reasonable zoom
8. No performance regression
9. Zero console errors

---

## Context

### Current default

```js
// index.html ~line 1461
if(nodeMap['hominini']) nodeMap['hominini']._collapsed=true;
```

Hominini starts collapsed. The 28 species are hidden until user clicks to expand.

### HUMAN_PATH

```js
const HUMAN_PATH = new Set(['luca','eukaryota','animalia','vertebrates','mammals','primates','great-apes','homo-sapiens']);
```

Does NOT include `hominini` or `group-homo`. Needs extension.

### Layout

- `subtreeWeight(n)` gives more angular space to branches with more visible descendants
- With 28 new visible leaves, radial layout should automatically allocate more space
- Cladogram distributes leaves evenly — 28 extra leaves affect Y distribution
- Chronological: hominins cluster at 0–7 Mya (recent time)

---

## Implementation Plan

### Phase A: Expand by default

1. Change `_collapsed=true` to `_collapsed=false` for hominini
2. Also expand 4 group nodes: group-proto, group-australopith, group-paranthropus, group-homo

### Phase B: Extend HUMAN_PATH

```js
const HUMAN_PATH = new Set([
  'luca','eukaryota','animalia','vertebrates','mammals','primates','great-apes',
  'hominini','group-homo','homo-sapiens'
]);
```

### Phase C: Layout tuning

1. Verify radial layout gives enough angular space
2. If crowded: add `minAngle` floor for hominini subtree or reduce depth radius step
3. Test cladogram and chronological views
4. Adjust label font size for hominin depth nodes (10-11px instead of 8-9px)

### Phase D: Label priority

1. Add hominin group IDs to label priority system (always visible like HUMAN_PATH)
2. Consider abbreviated labels ("H. erectus") if full names collide

### Phase E: Tone down hominini special rendering

1. Remove "Explore →" badge (no longer needed)
2. Keep golden ring but remove pulsing animation (branch is visible)
3. Keep "Human Evolution" button — it opens dedicated side panel

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | Remove hominini collapse, extend HUMAN_PATH, label priority, layout tuning, reduce special rendering |
| `PROJECT_PROGRESS.md` | Add p27 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `renderPanelContent()` — panel content
- `toggleDomain()` / legend
- `js/treeData.js` — tree data (hominins come from buildHomininTree)
- `js/speciesData.js` — don't restructure
- `js/imageLoader.js`

---

## Testing Checklist

1. `node serve.js` → tree loads with hominini branch visible
2. Radial view: hominin branch fans out without overlapping other branches
3. Cladogram: hominin species as leaves on right
4. Chronological: hominins clustered at 0–7 Mya
5. Golden path: LUCA through hominini → group-homo → H. sapiens
6. Labels readable without zoom
7. Click hominin species → panel opens
8. Manual collapse/expand still works on hominini
9. "Human Evolution" button still works
10. Mobile: visible after reasonable zoom, touch targets OK
11. Dark/light theme correct
12. Hebrew RTL correct
13. Zero console errors, smooth performance

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p27-hominin-branch`
- PR title: `feat: show hominin family tree as always-visible expanded branch`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p27 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
