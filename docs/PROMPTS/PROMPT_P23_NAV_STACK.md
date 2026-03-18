# P23 — Navigation Stack Unification

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p23** (Tier 1 — High Priority).

**Your scope:** Merge the two parallel navigation stacks (`panelHistory` and `navStack`) into a single unified system. You touch navigation state, Back/Home button logic, and keyboard shortcuts in `index.html`. You do NOT touch rendering, layout, panel content, or visual features.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Eliminate the technical debt of two parallel history stacks. Create one clean navigation model that handles both tree focus and panel navigation.

### Success Criteria

1. Single `navHistory` array replaces both `panelHistory` and `navStack`
2. Back button works for: panel-to-panel, panel close, tree zoom back, hominin view close
3. Home button resets everything to initial state
4. Keyboard shortcuts: Escape → Back, Shift+Escape → Home
5. Browser back button (popstate) integrates with unified stack
6. No navigation regressions — all existing paths still work
7. Zero console errors

---

## Context

### Current dual-stack system

**navStack** (~line 2367):
```js
const navStack = [];
function pushNav(s) { ... }  // saves {type, nodeId, transform}
function navBack() { ... }   // pops and restores state
function navHome() { ... }   // clears stack, resets view
```
- Used by: tree node clicks (zoom into subtree), `#nav-back` and `#nav-home` buttons
- Stores: tree transform state, focused node

**panelHistory** (~line 2362):
```js
let panelHistory = [];
```
- Used by: `renderPanelContent()` when clicking sub-group links inside the panel
- Back button inside panel pops from `panelHistory`
- Separate from the global nav buttons

### Pain points

- Pressing global Back doesn't undo panel-to-panel navigation
- Pressing panel Back doesn't undo tree zoom
- Two stacks grow independently — confusing state
- Browser popstate only handles one stack

### Navigation entry points

1. Click tree node → zoom + open panel (pushes to navStack)
2. Click sub-group in panel → navigate to child panel (pushes to panelHistory)
3. Click "Human Evolution" button → opens hominin view
4. Click breadcrumb → jumps to ancestor
5. Browser back button → popstate handler
6. `#nav-back` button → `navBack()`
7. Panel internal back button → `panelHistory.pop()`

---

## Implementation Plan

### Phase A: Design unified history entry

```js
// Each entry captures a full snapshot
{
  type: 'tree' | 'panel' | 'hominin',
  nodeId: string | null,
  transform: { x, y, s },
  panelOpen: boolean,
  panelNodeId: string | null
}
```

### Phase B: Replace dual stacks

1. Remove `let panelHistory = []` and `const navStack = []`
2. Create `const navHistory = []`
3. Create `function pushState(entry)` — deduplicates consecutive identical states
4. Create `function goBack()` — pops last entry, restores state
5. Create `function goHome()` — clears stack, resets to initial view
6. Cap at 50 entries (shift oldest)

### Phase C: Wire all navigation paths

1. Tree node click → `pushState({ type:'tree', ... })`
2. Panel sub-group click → `pushState({ type:'panel', ... })`
3. Hominin view open → `pushState({ type:'hominin', ... })`
4. `#nav-back` and panel back button → both call `goBack()`
5. `#nav-home` → calls `goHome()`
6. Popstate → calls `goBack()`
7. Update button visibility based on `navHistory.length`

### Phase D: Keyboard shortcuts

1. Add keydown listener:
   ```js
   document.addEventListener('keydown', e => {
     if (e.key === 'Escape' && !e.shiftKey) goBack();
     if (e.key === 'Escape' && e.shiftKey) goHome();
   });
   ```
2. Don't fire when search input is focused
3. Add to i18n: keyboard shortcut hints (optional)

### Phase E: Cleanup

1. Remove all references to `panelHistory`
2. Remove all references to `navStack`
3. Ensure `pushNav()`, `navBack()`, `navHome()` are either removed or redirected to new functions
4. Test every navigation path

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | Replace panelHistory + navStack with navHistory, new goBack/goHome, keyboard shortcuts, update all callsites |
| `PROJECT_PROGRESS.md` | Add p23 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` — tree rendering
- `renderPanelContent()` structure — only change navigation calls within it
- `js/treeData.js`, `js/speciesData.js` — data files
- CSS — no visual changes needed

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Click node → panel opens. Click sub-group → navigates. Press Back → returns to previous panel. Press Back again → closes panel.
3. Click multiple nodes in sequence → Back walks through all of them
4. Home → resets to initial tree view, panel closed
5. Escape key → same as Back
6. Shift+Escape → same as Home
7. Browser back button → works like Back
8. Open hominin view → Back closes it
9. Search → click result → Back returns to previous state
10. Mobile: swipe-to-close panel → history entry removed
11. Dark/light theme — Back/Home buttons styled correctly
12. Hebrew RTL — Back arrow direction correct
13. Zero console errors
14. No `panelHistory` or `navStack` references remain in code

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p23-nav-unification`
- PR title: `feat: unify panelHistory and navStack into single navigation model`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p23 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
