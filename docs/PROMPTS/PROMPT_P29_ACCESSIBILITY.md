# P29 — Accessibility (a11y)

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p29** — making the application accessible to keyboard-only users, screen readers, and users with motion sensitivities.

**Your scope:** Add ARIA roles/labels to the SVG tree and panel, implement keyboard navigation through tree nodes, manage focus trapping in panels, add skip-to-content link, and respect `prefers-reduced-motion`. You touch `render()` only for ARIA attributes, `index.html` markup, CSS for focus styles, and keyboard event handlers. You do NOT restructure the rendering pipeline, change layout algorithms, or modify data files.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make the Tree of Life usable by people who navigate with keyboards, use screen readers, or are sensitive to motion — meeting WCAG 2.1 AA standards where feasible for an SVG-based interactive visualization.

### Success Criteria

1. Full keyboard navigation: Tab to tree → arrow keys to traverse nodes → Enter to open panel
2. Screen reader announces: node name, latin name, domain, "has N children" on focus
3. ARIA tree role on SVG container with `role="tree"`, nodes as `role="treeitem"`
4. Focus visible: high-contrast focus ring on focused tree node (not just browser default)
5. Focus trap in panel: Tab cycles within panel when open, Escape closes
6. Skip-to-content link: first Tab press shows "Skip to tree" link
7. `prefers-reduced-motion`: disable zoom animations, pan transitions, pulsing rings, loading shimmer
8. All interactive elements (buttons, links, legend items) keyboard-accessible with visible focus
9. Color is not the only differentiator (shapes/icons supplement color-coded domains)
10. Zero console errors

---

## Implementation Plan

### Phase A: Keyboard tree navigation

1. Make SVG tree focusable: `tabindex="0"` on `#tree-container` or the SVG element
2. Track `focusedNodeId` state variable
3. Arrow key handlers when tree has focus:
   - **Right/Down**: move to first child (or next sibling if leaf)
   - **Left/Up**: move to parent
   - **Enter/Space**: open panel for focused node
   - **+/-**: expand/collapse focused node
4. Visual focus indicator: bright ring around focused node (distinct from hover)
5. On focus change: smoothly pan tree to center focused node

### Phase B: ARIA attributes in render()

In the `render()` function, add to each node group element:
```js
g.setAttribute('role', 'treeitem');
g.setAttribute('aria-label', `${n.name}, ${n.latin || ''}, ${n.era || ''}`);
g.setAttribute('aria-expanded', n.children && !n._collapsed ? 'true' : 'false');
g.setAttribute('aria-level', n.depth + 1);
g.setAttribute('tabindex', '-1'); // programmatic focus only
```

On the tree container SVG:
```js
svg.setAttribute('role', 'tree');
svg.setAttribute('aria-label', t('tree_of_life'));
```

### Phase C: Panel focus management

1. When panel opens: move focus to panel heading (or close button)
2. Tab within panel: cycle through interactive elements (close button, child links, external links)
3. Escape: close panel, return focus to the tree node that opened it
4. Panel close button: `aria-label="Close panel"`

### Phase D: Skip-to-content link

1. Add visually hidden link as first element in `<body>`:
   ```html
   <a href="#tree-container" class="skip-link">Skip to tree</a>
   ```
2. CSS: `.skip-link` is off-screen, appears on focus
3. Trilingual: `t('skip_to_tree')` key

### Phase E: Reduced motion

1. Add media query and CSS:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
2. In JS: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
3. If reduced motion: skip `smoothPan()` transitions, disable pulsing glow, no zoom animations

### Phase F: Focus styles

Add visible focus styles for all interactive elements:
```css
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}
button:focus-visible, .leg-row:focus-visible {
  outline: 2px solid var(--gold);
  border-radius: 4px;
}
```

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | Skip link, ARIA attributes in `render()`, keyboard handlers, focus management, panel focus trap, CSS focus styles, reduced-motion media query |
| `js/uiData.js` | Add `skip_to_tree` and other a11y-related translation keys |
| `PROJECT_PROGRESS.md` | Add p29 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `js/treeData.js` — tree data structure
- `js/speciesData.js` — species data
- `js/imageLoader.js` — image system
- `js/factLibrary.js` — facts
- Tree layout algorithms (`layoutRadial`, `layoutCladogram`, `layoutChronological`)
- `buildHomininTree()` — hominin structure

---

## Testing Checklist

1. Tab from page top → skip-link appears → Enter → focus lands on tree
2. Arrow keys traverse tree nodes visually and audibly (screen reader)
3. Enter on focused node → panel opens with focus on heading
4. Tab within panel cycles through elements, doesn't escape
5. Escape from panel → panel closes, focus returns to tree node
6. All buttons (theme, language, zoom, legend) reachable via Tab
7. Focus ring visible on all interactive elements
8. Screen reader (NVDA/JAWS or VoiceOver): announce node name, children count, expand state
9. `prefers-reduced-motion`: no animations, instant transitions
10. Dark and light themes: focus ring visible in both
11. Mobile: touch still works as before (keyboard enhancements don't break touch)
12. Zero console errors
