# Sprint J2 — Navigation & Interaction Polish

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` to check branch state
4. Resolve any merge conflicts with `origin/main` before starting work
5. Read the navigation system in index.html (search for `navStack`, `panelHistory`, `pushNav`, `navBack`, `navHome`, `panelBack`, `restoreNavState`)

**After ALL code changes:**
1. Test all 6 navigation paths (see verification below)
2. Verify zero console errors
3. Commit: `feat: J2 — navigation stack unification`
4. Push branch and create PR to main
5. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md

---

## Sprint Goal

Unify the two parallel navigation stacks into one clean model. Every "Back" action uses the same stack. Add smooth auto-pan on navigation.

## Context

Currently there are TWO navigation stacks:
- `panelHistory` (line ~2362) — tracks panel-to-panel transitions, used by the "← Back" button inside the panel
- `navStack` (line ~2367) — unified state stack for global Back/Home buttons

This causes confusion: the panel back button uses `panelBack()` which pops from `panelHistory`, while the global back button uses `navBack()` which pops from `navStack`. They don't sync.

## Tasks

### 1. Merge panelHistory into navStack

- Remove `let panelHistory = []` declaration
- Remove the `panelBack()` function entirely
- Modify `showMainPanel(n)` to push a full state snapshot to `navStack` (not `panelHistory`)
- Modify the injected panel back button (line ~2937-2946) to call `navBack()` instead of `panelBack()`
- Show the panel back button when `navStack` has entries with type `'panel'`
- Update `closePanel()` to NOT clear `panelHistory` (it no longer exists)
- Update `navHome()` to NOT reference `panelHistory`

### 2. Update restoreNavState for panel-to-panel

- `restoreNavState({type: 'panel', nodeId})` should call `renderPanelContent(nodeMap[nodeId])` and set `currentPanelNode`
- Ensure panel stays open (don't close + reopen) on panel-to-panel back navigation

### 3. Keyboard shortcuts

- Escape → `navBack()` (already partially works — verify it handles all views)
- Shift+Escape → `navHome()` (new shortcut)
- Document shortcuts in a tooltip or help overlay

### 4. Smooth auto-pan to focused node

After `showMainPanel(n)` or `navigateTo(id)`, smoothly animate the viewport to center on the node:
```js
function smoothPanTo(x, y, duration = 400) {
  // Animate transform.x and transform.y to center (x,y) in viewport
  // Use requestAnimationFrame + easing
}
```

### 5. Clean up state serialization

- `currentNavState()` should capture everything needed to restore any view state
- Add `panelNodeId` to the state object when a panel is open
- Test that navigating Back from hominin-detail → panel restores the correct panel

---

## Navigation Paths to Test

| # | Path | Steps | Expected Back behavior |
|---|------|-------|----------------------|
| 1 | Tree → Panel | Click node | Back returns to tree, camera position preserved |
| 2 | Panel → Panel | Click child in panel | Back shows previous panel |
| 3 | Tree → Hominin view | Click "Human Evolution" | Back returns to tree |
| 4 | Hominin → Detail | Click a hominin | Back returns to hominin list |
| 5 | Panel → Hominin | Click "Hominin Deep Dive" in panel | Back returns to panel |
| 6 | DNA calc open/close | Open DNA calc | Escape closes it, back button works |

## Success Criteria

- [ ] `panelHistory` variable completely removed
- [ ] `panelBack()` function completely removed
- [ ] All 6 navigation paths work correctly
- [ ] Escape always goes Back, Shift+Escape always goes Home
- [ ] Smooth pan animation when navigating to a node
- [ ] Zero console errors
- [ ] Mobile bottom-sheet panel back navigation works
