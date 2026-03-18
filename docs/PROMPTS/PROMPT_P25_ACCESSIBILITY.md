# P25 — Accessibility (a11y)

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p25** (Tier 2 — Medium Priority).

**Your scope:** Add keyboard navigation, ARIA roles, focus management, screen reader support, and reduced-motion respect. You touch `index.html` (JS event handlers, HTML attributes, CSS). You do NOT restructure rendering logic, change layout algorithms, or modify data files.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `a11y:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make the Tree of Life usable by keyboard-only users and screen reader users, and respect motion preferences.

### Success Criteria

1. Full keyboard navigation: Tab through controls, arrow keys through tree nodes
2. ARIA tree role on SVG tree, treeitem on nodes
3. Screen reader announces: node name, species info, panel open/close
4. Focus trapped in panel when open, restored on close
5. Skip-to-content link
6. `prefers-reduced-motion` disables all CSS animations and JS transitions
7. High contrast mode: text remains readable
8. WCAG 2.1 AA compliance for all interactive elements
9. Zero console errors

---

## Context

### Current a11y state

- WCAG contrast partially addressed in p7/p10
- Touch targets ≥44px on mobile (p10)
- No keyboard navigation for tree nodes
- No ARIA roles on SVG tree
- No focus management for panel
- No `prefers-reduced-motion` support (0 matches in codebase)
- No skip-to-content link

### Key interactive elements

- SVG tree nodes (circles with click handlers)
- Panel (`#panel`) — slides from right, has close button
- Search input (`#search-input`)
- Timeline slider (`#era-slider`)
- Zoom buttons (`#zoom-in`, `#zoom-out`)
- View mode toggle buttons
- Language switcher buttons
- Theme toggle button
- DNA calculator panel
- Compare mode

### CSS animations in use

- `@keyframes homininGlow` — pulsing ring on hominini node
- `@keyframes branchGrow` — loading screen tree animation
- `@keyframes nodeAppear` — loading screen node dots
- Various `transition` properties on panel slide, tooltip fade, button hover

---

## Implementation Plan

### Phase A: Skip-to-content link

1. Add hidden link at top of `<body>`: `<a href="#tree-container" class="skip-link">Skip to tree</a>`
2. CSS: visually hidden, appears on focus with high z-index
3. Translatable via `t('skip_to_tree')`

### Phase B: Keyboard navigation for tree nodes

1. Add `tabindex="0"` and `role="treeitem"` to SVG node groups in `render()`
2. Add `aria-label` with node name and species info
3. Add `aria-expanded` for nodes with children (collapsed/expanded state)
4. Add keydown handler on tree container:
   - Arrow Up/Down: move focus between sibling nodes
   - Arrow Right: expand node / move to first child
   - Arrow Left: collapse node / move to parent
   - Enter/Space: open panel for focused node
   - Home: focus root node
   - End: focus last visible node
5. Maintain a `focusedNodeId` state variable
6. Visual focus indicator: outline ring on focused node (CSS `outline` or custom SVG ring)

### Phase C: ARIA tree structure

1. Add `role="tree"` to the SVG tree container or a wrapper `<div>`
2. Add `role="treeitem"` to each rendered node group
3. Add `aria-level` based on node depth
4. Add `aria-setsize` and `aria-posinset` for sibling count/position
5. Screen reader announces: "Mammals, expanded, 12 of 15 items, level 3"

### Phase D: Focus management for panel

1. When panel opens: move focus to panel heading or close button
2. Trap Tab within panel (cycle through interactive elements)
3. When panel closes: restore focus to the tree node that opened it
4. Panel close triggers: close button, Escape key, click outside
5. Add `role="dialog"` and `aria-modal="true"` to `#panel`
6. Add `aria-labelledby` pointing to panel title

### Phase E: Reduced motion

1. Add CSS media query:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
2. In JS: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before:
   - Animated slider sweep (`toggleEraPlay()`)
   - Panel slide transitions
   - Smooth zoom animations
3. Add `aria-live="polite"` region for dynamic announcements (species count, era label)

### Phase F: Remaining WCAG fixes

1. Ensure all `<button>` and `<input>` elements have accessible names
2. Add `aria-label` to icon-only buttons (zoom, theme, close)
3. Verify color contrast for all text (use browser DevTools audit)
4. Ensure form controls have visible labels or `aria-label`

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | Skip link HTML, ARIA attributes in render(), keyboard handlers, focus management, reduced-motion CSS, aria-live regions |
| `js/uiData.js` | Add `skip_to_tree` i18n key |
| `PROJECT_PROGRESS.md` | Add p25 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `js/treeData.js` — tree data
- `js/speciesData.js` — species data
- Layout algorithms — don't change positioning logic
- `js/imageLoader.js` — image system

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Tab from address bar → skip link appears → activates → focus moves to tree
3. Arrow keys navigate between tree nodes with visible focus ring
4. Enter on focused node → panel opens, focus moves to panel
5. Tab cycles through panel interactive elements (close, links, sub-groups)
6. Escape closes panel, focus returns to tree node
7. Screen reader (NVDA/VoiceOver) announces node names, expanded/collapsed state
8. Panel announced as dialog
9. Enable `prefers-reduced-motion` in browser settings → no animations
10. Timeline play button → no sweep animation in reduced-motion mode
11. Dark/light theme → focus ring visible in both
12. Mobile → keyboard not needed but no errors from a11y code
13. Zero console errors

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p25-accessibility`
- PR title: `a11y: add keyboard navigation, ARIA tree roles, focus management, reduced motion`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `a11y:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p25 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
