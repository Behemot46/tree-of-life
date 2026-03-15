# P25 — Interactive Legend & Domain Highlighting

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p25** as part of a parallel batch (p22 + p24 + p25 run concurrently in separate worktrees).

**Your scope:** Make the legend interactive — clicking a domain highlights/filters that domain's subtree on the canvas with clear visual feedback. You touch `toggleDomain()`, `resetDomains()`, legend CSS, and `render()` only for domain-visibility filtering. You do NOT touch `renderPanelContent()`, hominin tree structure, or panel data.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make the legend a fully interactive filter — clicking a domain highlights that subtree on the tree canvas while dimming everything else, with clear visual feedback on which domains are active.

### Success Criteria

1. Clicking a domain in the legend visually highlights that domain's subtree on the canvas
2. Non-selected domains are visually dimmed (reduced opacity, desaturated)
3. Multiple domains can be active simultaneously (toggle behavior)
4. "Show All" button restores full visibility
5. Active domains have clear visual indicator in the legend (bold, colored underline, or checkmark)
6. Highlight effect works in all 3 view modes (radial, cladogram, chronological)
7. Smooth CSS transitions for highlight/dim animations
8. Legend is usable on mobile (collapsed by default, expands on tap)
9. Works with dark/light themes
10. Zero console errors

---

## Context: Current Legend Implementation

### Legend HTML — index.html ~line 1125

```html
<div id="legend">
  <div class="leg-title" id="i-leg-title">Domains</div>
  <div class="leg-row" data-domain="luca" onclick="toggleDomain('luca')" style="cursor:pointer;">
    <div class="leg-dot" style="background:#8b5cf6"></div>
    <span id="i-leg-luca">LUCA / Root</span>
  </div>
  <!-- ... bacteria, archaea, plantae, animalia, fungi, protists ... -->
  <button onclick="resetDomains()">Show All</button>
</div>
```

7 domain rows + 1 reset button. Each row already has `onclick="toggleDomain(...)"` and `data-domain` attribute.

### toggleDomain() — index.html ~line 1756

```js
function toggleDomain(domain) {
  if (activeDomains.has(domain)) {
    if (activeDomains.size > 2) activeDomains.delete(domain);
  } else {
    activeDomains.add(domain);
  }
  document.querySelectorAll('[data-domain]').forEach(el => {
    const d = el.getAttribute('data-domain');
    el.style.opacity = activeDomains.has(d) ? '1' : '0.35';
    el.style.fontWeight = activeDomains.has(d) ? '600' : '400';
  });
  scheduleRender();
}
```

Currently: toggles membership in `activeDomains` Set. Updates legend row opacity. Calls `scheduleRender()`.

**Minimum of 2 domains** enforced (prevents hiding everything).

### resetDomains() — index.html ~line 1770

Resets `activeDomains` to full set, restores opacity on all legend rows.

### activeDomains — used in render()

The `activeDomains` Set is checked during rendering to determine node visibility. Nodes belonging to inactive domains are skipped or dimmed.

### How domain membership is determined

Each node in TREE has a `color` and exists under a domain subtree. The domain is determined by the top-level ancestor:
- LUCA (root)
- Bacteria (under LUCA)
- Archaea (under LUCA)
- Eukaryota → splits into Protists, Fungi, Plantae, Animalia

### Legend CSS

```css
#legend — fixed position bottom-left, z-index 100
.leg-title — clickable on mobile (toggles collapse)
.leg-row — flex row with dot + label
.leg-dot — 10px colored circle
```

Mobile: legend starts collapsed, expands on title tap.

### Key constraints

- `render()` is called on every toggle (full SVG rebuild)
- Domain filtering affects which nodes/branches are drawn
- Label collision detection runs after filtering
- HUMAN_PATH highlighting should still work within active domains

---

## Implementation Plan

### Phase A: Enhance domain filtering in render()

1. **Dim inactive nodes** instead of hiding them completely:
   - Active domain nodes: full opacity (1.0), normal colors
   - Inactive domain nodes: reduced opacity (0.15-0.2), grayscale or desaturated
   - This keeps tree structure visible while highlighting the selected domain

2. **Dim inactive branches**: branches connecting inactive nodes get reduced opacity

3. **Domain membership function**: Create a helper `getNodeDomain(node)` that walks up the `_parent` chain to find which top-level domain a node belongs to:
   ```js
   function getNodeDomain(n) {
     let current = n;
     while (current._parent && current._parent._parent) {
       current = current._parent;
     }
     // current is now a child of LUCA (or LUCA itself)
     return current.id; // 'bacteria', 'archaea', 'eukaryota', etc.
   }
   ```
   Map eukaryota children to their sub-domains (protists, fungi, plantae, animalia).

4. **Filtering logic in render()**:
   - If all domains active → render normally (no dimming)
   - If subset active → render all nodes but apply dim class/opacity to inactive ones
   - Branches: if either endpoint is inactive, dim the branch

### Phase B: Legend visual feedback

1. **Active state**: When a domain is selected (and others are dimmed):
   - Legend row gets a left border or background highlight in the domain color
   - Label becomes bold
   - Dot gets a subtle glow or ring

2. **Inactive state**:
   - Legend row at reduced opacity (0.4)
   - Dot at reduced saturation

3. **"Solo mode" hint**: When only 1-2 domains are active, add a subtle tooltip or hint "Click another domain to add it, or Show All to reset"

4. **Transitions**: CSS transitions on opacity and background (0.3s ease)

### Phase C: Improved toggle behavior

1. **Single-click behavior**:
   - If all domains are active and you click one → solo that domain (deactivate all others)
   - If one domain is active and you click another → add it (now two active)
   - If a domain is active and you click it → deactivate it (unless it's the last one)

2. **Double-click shortcut** (optional): Double-click a domain to solo it (show only that domain)

3. **Remove the minimum-2 constraint** — allow showing just 1 domain. The tree structure is still visible via dimmed nodes.

4. **"Show All" button**: Styled more prominently when filters are active (e.g., pulsing border or highlighted text)

### Phase D: CSS for highlighting

Add to `<style>` block:

```css
/* Legend row states */
.leg-row { transition: opacity 0.3s, background 0.3s; padding: 4px 8px; border-radius: 6px; }
.leg-row.active { background: rgba(255,255,255,0.08); font-weight: 600; }
.leg-row.dimmed { opacity: 0.35; }
.leg-dot { transition: box-shadow 0.3s; }
.leg-row.active .leg-dot { box-shadow: 0 0 6px currentColor; }

/* Show All button highlight when filters active */
#legend .show-all-active { border-color: var(--accent-primary); color: var(--accent-primary); }

/* Dark/light variants */
[data-theme="light"] .leg-row.active { background: rgba(0,0,0,0.06); }
```

### Phase E: Integration with existing features

1. **Species count**: The existing `updateSpeciesCount()` in the timeline should reflect domain filtering (show "X / Y visible" based on active domains)
2. **Search**: Search results should still find species in inactive domains (search is global)
3. **Panel**: Clicking a dimmed node should still open its panel normally
4. **HUMAN_PATH**: If Animals domain is active, human path should still highlight normally

### Phase F: i18n

Add/verify translation keys in `js/uiData.js` TRANSLATIONS:
```js
leg_show_all: 'Show All' / 'הצג הכל' / 'Показать все',
leg_filter_hint: 'Click to filter' / '...' / '...',
```

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | `toggleDomain()` and `resetDomains()` rewrite, `render()` domain dimming logic, legend CSS, `getNodeDomain()` helper |
| `js/uiData.js` | Legend-related translation keys (if adding new ones) |
| `PROJECT_PROGRESS.md` | Add p25 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `renderPanelContent()` — that's p22's scope
- `buildHomininTree()` / hominin collapse defaults — that's p24's scope
- `NODE_ICONS` / `getIconGroup()` — that's p20's scope
- `js/speciesData.js` — don't restructure
- `js/imageLoader.js` — don't modify
- `js/treeData.js` — don't restructure

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Click "Bacteria" in legend → Bacteria subtree highlighted, everything else dimmed
3. Click "Animals" → both Bacteria and Animals highlighted
4. Click "Bacteria" again → only Animals highlighted
5. Click "Show All" → full tree restored
6. Legend rows show active/dimmed visual states
7. Dimmed nodes are still visible (not hidden) — tree structure preserved
8. Click a dimmed node → panel opens normally
9. Search finds species in dimmed domains
10. **Radial view**: highlighting works correctly
11. **Cladogram view**: highlighting works correctly
12. **Chronological view**: highlighting works correctly
13. Dark/light theme — legend and highlighting look correct
14. Mobile — legend collapsed by default, expands, filter works
15. Hebrew RTL — legend positioned correctly
16. Species count updates with domain filter
17. Zero console errors
18. Smooth transitions (no flicker on toggle)

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p25-legend-highlight`
- PR title: `feat: interactive legend with domain highlighting and filtering`
- PR against `main`

---

## Documentation Updates

### PROJECT_PROGRESS.md

Add to the Completed table:
```
| p25 | Interactive legend & domain highlighting — filter, dim, visual feedback | PR #XX |
```

Change status in Upcoming table from `Pending` to `Done`.

### SESSION_HANDOFF.md

Write a complete handoff with:
- What was done (summary)
- How the toggle behavior works (single-click logic)
- How dimming is implemented (opacity? CSS class? SVG attribute?)
- Current state (branch, PR, clean/dirty)
- Known issues or follow-up items
