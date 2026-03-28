# Sprint J4 — Accessibility & Mobile Polish

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` — resolve merge conflicts first
4. Understand current ARIA state: search for `aria-`, `role=`, `tabindex` in index.html
5. Test current keyboard navigation to establish baseline

**After ALL code changes:**
1. Navigate the entire app keyboard-only (no mouse)
2. Run axe DevTools accessibility scan if available
3. Test on mobile 375×812 — verify all touch targets ≥ 44px
4. Verify zero console errors
5. Commit: `feat: J4 — accessibility foundation and mobile polish`
6. Push branch and create PR to main
7. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md

---

## Sprint Goal

Make the Tree of Life fully keyboard-navigable, screen-reader friendly, and comfortable on mobile touchscreens.

## Tasks

### 1. Tree Keyboard Navigation (WCAG 2.1.1)

**Pattern:** W3C WAI TreeView (https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)

- Add `role="tree"` on the SVG viewport element
- Add `role="treeitem"` on each node `<g>` group in render()
- Add `aria-expanded="true/false"` on collapsible nodes
- Add `aria-selected="true"` on the currently focused node
- Add `tabindex="0"` on the root node; `tabindex="-1"` on all others

**Arrow key handling:**
- **Right arrow:** If collapsed → expand. If expanded → move to first child
- **Left arrow:** If expanded → collapse. If leaf or collapsed → move to parent
- **Down arrow:** Move to next visible node (tree-order traversal)
- **Up arrow:** Move to previous visible node
- **Enter/Space:** Open panel for focused node (like click)
- **Home:** Focus root node (LUCA)
- **End:** Focus last visible node

**Implementation:**
- Track `focusedNodeId` in state
- On arrow key: compute next node, update `focusedNodeId`, call `element.focus()` on the node's `<g>`
- Add visible focus ring: `.node-group:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }`
- Render focused node's info in `aria-live` region

### 2. Skip-to-Content Link

Add as first element in `<body>`:
```html
<a href="#tree-container" class="skip-link">Skip to tree</a>
```

CSS:
```css
.skip-link {
  position: absolute; left: -9999px; top: auto;
  z-index: 9999; padding: 8px 16px;
  background: var(--accent); color: white;
  font-family: var(--font-body);
}
.skip-link:focus { left: 50%; transform: translateX(-50%); top: 8px; }
```

### 3. Focus Trapping in Modals

When these views open, trap focus inside them:

- **Species panel** (`#panel.open`)
- **DNA calculator** (`.dna-panel.open`)
- **Hominin view** (`#hominin-view.open`)

Implementation:
```js
function trapFocus(container) {
  const focusable = container.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length - 1];
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  first?.focus();
}
```

Save previously focused element; restore on close.

### 4. aria-live Announcements

Add a visually hidden live region:
```html
<div id="a11y-announcer" aria-live="polite" class="sr-only"></div>
```

Announce:
- Panel opened: "Opened species panel for [species name]"
- Panel closed: "Panel closed"
- Species count change: "[N] of [total] species visible"
- View mode change: "Switched to [mode] view"
- Search results: "[N] results found"

### 5. Touch Targets ≥ 44px (WCAG 2.5.8)

Enlarge these controls on mobile (≤768px):

| Control | Current | Target | How |
|---------|---------|--------|-----|
| Zoom buttons (.zbtn) | 32px | 44px | `min-width: 44px; min-height: 44px` |
| Language buttons (.lang-btn) | 32px | 44px | Same |
| Theme button (#theme-btn) | 32px | 44px | Same |
| Extinct toggle | ~24px tall | 44px | `min-height: 44px; padding: 10px 14px` |
| Legend rows (.leg-row) | 28px | 44px | `min-height: 44px` |
| Hominin filter buttons (.hom-filter) | ~26px | 44px | `min-height: 44px; padding: 10px 16px` |

### 6. Screen Reader SVG Description

Enhance the SVG `aria-label` to be more descriptive:
```html
<svg aria-label="Interactive phylogenetic tree showing 132 species across 3.8 billion years of evolution. Use arrow keys to navigate between species." role="application">
```

Add `<title>` and `<desc>` inside SVG for older screen readers.

---

## Success Criteria

- [ ] Can navigate entire tree with arrow keys only (no mouse)
- [ ] Enter opens panel for any focused node
- [ ] Skip-to-content link visible on Tab from page top
- [ ] Focus trapped in panel/DNA calc/hominin view when open
- [ ] Focus restored to trigger element on modal close
- [ ] aria-live announces panel open/close and view mode changes
- [ ] All touch targets ≥ 44px on mobile
- [ ] Zero console errors
- [ ] Visible focus ring on keyboard-focused nodes
