# P28 — Navigation Stack Unification

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p28** — unifying the parallel navigation stacks into a single coherent model.

**Your scope:** Merge `panelHistory` and `navStack` into one unified stack. You touch navigation functions (`goBack()`, `goHome()`, `openPanel()`, `focusNode()`), keyboard shortcuts, and the Back/Home button logic in `index.html`. You do NOT modify `render()` tree layout, `renderPanelContent()` template, legend, or any data files.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Replace the two parallel navigation stacks (`panelHistory` for panel-internal navigation and `navStack` for tree focus) with a single unified history stack that tracks both tree navigation and panel state.

### Success Criteria

1. Single `history` array replaces both `panelHistory` and `navStack`
2. Each history entry captures: `{ nodeId, panelOpen, viewState: {x, y, s} }`
3. Back button undoes the last navigation action (whether tree focus or panel open)
4. Home button returns to initial view (LUCA centered, panel closed)
5. Keyboard shortcuts: Escape → Back, Shift+Escape → Home
6. Browser back button integration (pushState/popState) — optional stretch
7. No navigation edge cases: rapid clicking, back from home, forward after back
8. Panel open → click child → back → returns to parent panel (not closes panel)
9. Zero console errors
10. All existing navigation paths still work

---

## Context: Current Navigation Implementation

### Two parallel stacks

1. **`navStack`** (~line 1850): Tracks tree focus changes (which node is centered)
   - Pushed on `focusNode()` calls
   - Popped by `goBack()` — restores previous camera position

2. **`panelHistory`** (~line 2500): Tracks panel-internal navigation
   - Pushed when clicking a child species link in the panel
   - Popped by the panel's back button

### Back button (`#btn-back`, ~line 1100)
- Currently calls `goBack()` which pops from `navStack`
- Panel has its own back button that pops from `panelHistory`

### Home button (`#btn-home`)
- Resets to initial view, clears both stacks

---

## Implementation Plan

### Phase A: Design unified history entry

```js
const history = [];
// Each entry:
{
  type: 'focus' | 'panel',     // what triggered this entry
  nodeId: string,               // which node
  transform: { x, y, s },      // camera state at time of push
  panelOpen: boolean            // was panel open?
}
```

### Phase B: Replace push/pop sites

1. `focusNode(node)` → push entry before changing view
2. `openPanel(node)` → push entry before opening panel
3. Panel child click → push entry before switching panel content
4. `goBack()` → pop last entry, restore state (camera + panel)
5. `goHome()` → clear stack, reset to initial

### Phase C: Keyboard shortcuts

1. `Escape` → `goBack()` (if history not empty)
2. `Shift+Escape` → `goHome()`
3. Ensure shortcuts don't fire when search input is focused

### Phase D: Edge case handling

1. Empty stack → Back button hidden or disabled
2. Rapid clicks → debounce pushes (no duplicate consecutive entries)
3. Same node re-focused → don't push duplicate
4. Panel close via swipe-down → don't push to history

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | Replace `panelHistory` + `navStack` with unified `history[]`, rewrite `goBack()`/`goHome()`, add keyboard shortcuts, update Back/Home button visibility logic |
| `PROJECT_PROGRESS.md` | Add p28 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` tree layout
- `renderPanelContent()` template
- `toggleDomain()` / legend
- Any `js/*.js` data files

---

## Testing Checklist

1. Click node A → click node B → Back → returns to A (camera + panel state)
2. Open panel → click child → Back → parent panel shown
3. Open panel → Back → panel closes, tree position restored
4. Home → returns to initial LUCA view, panel closed
5. Escape key → same as Back
6. Shift+Escape → same as Home
7. Escape while search focused → closes search (not nav back)
8. Rapid Back clicks → no errors, stack empties gracefully
9. Mobile: swipe-close panel → no spurious history entry
10. Back button hides when stack is empty
11. Zero console errors
