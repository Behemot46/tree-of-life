# Collapsed-by-Default Tree — Design Spec

**Date:** 2026-04-07
**Status:** Approved for implementation
**Scope:** Default tree-of-life view starts collapsed; users discover the tree by clicking parent nodes or via a global depth control. Parent vs. leaf interaction is unambiguous. Layout breathes. Duplicates resolved manually as a prerequisite data commit.

---

## 1. Goals

1. On main-screen load (post-splash), the tree shows only **LUCA + its 3 direct domain children**, all collapsed. Nothing else is visible.
2. Clicking a collapsed parent reveals **one level** of children and auto-pans/zooms to frame them. Clicking again collapses.
3. Clicking a leaf opens its species panel. Clicking a parent **never** opens a panel directly — a dedicated **ⓘ button** does that.
4. A global **depth slider** + **Collapse all / Expand all** buttons let users sweep the tree open or shut.
5. A separate **"Show all species"** toggle lazy-loads the ~300-node `expandTree()` overlay.
6. Layout uses dynamic per-subtree spacing so collapsed branches stay compact and expanded ones get room. No more hidden/overlapping branches.
7. Parent nodes are visually distinct from leaf nodes (size + glowing ring + `+`/`−` badge).
8. Duplicate species (~23 known) are resolved by hand in a prerequisite data commit. No runtime dedupe code.

---

## 2. Architecture & State

### New state fields (`js/state.js`)

- `state.collapsedByDefault: true` — feature flag
- `state.depthLimit: 1` — current global depth cap (0 = LUCA only, 1 = LUCA + domains, …)
- `state.maxBaseDepth: number` — computed once from base TREE at startup
- `state.speciesLoaded: false` — whether `expandTree()` has been merged into the live tree

### Modified preprocessing (`js/utils.js`)

`preprocess()` sets `_collapsed = (depth > state.depthLimit) && !node._manualExpand` instead of `false`. A node is "expandable" if `children?.length && _collapsed`.

New per-node runtime flag:
- `_manualExpand: boolean` — set `true` when the user clicks to expand. The depth slider only collapses nodes where `_manualExpand === false`. "Collapse All" clears all `_manualExpand` flags.

### Click-handler split (`js/zoom.js` / `js/app.js`)

- **Click on collapsed parent** → expand one level, set `_manualExpand = true`, re-layout, `frameSubtree(node)` to auto-pan/zoom.
- **Click on expanded parent** → collapse subtree, clear `_manualExpand`, re-layout, frame parent. (Note: clearing on collapse means if the user later raises the slider past that depth, the branch auto-expands again — natural behavior, intentional.)
- **Click on leaf** → open species panel (unchanged).
- **Click on ⓘ button** (parents only) → open info panel for the parent. Does not expand/collapse.

### Persistence (`localStorage`)

- `tol-depth` → `state.depthLimit`
- `tol-species` → `state.speciesLoaded`
- `tol-expand-hint-seen` → first-time hint dismissal flag

First-time visitors always start with `depthLimit = 1`.

---

## 3. Interaction Model

**Core rule:** *parents expand, leaves inform.* A node's primary click is never ambiguous.

### ⓘ info button

- Always positioned **top-right of the node circle**, offset by node radius. Consistent placement everywhere — muscle memory matters more than per-node space optimization.
- **Visibility:**
  - **Desktop:** visible on hover for collapsed parents; **always visible** for fully-expanded parents (since clicking the circle would collapse them).
  - **Mobile:** **always visible** on all parent nodes at 60% opacity, brightens to 100% on tap. Long-press also opens the info panel as a bonus shortcut, but the always-visible button is the primary affordance.
- **Contrast treatment:** semi-opaque dark disc + light glyph (or inverse in light theme), with a 1px outline ring. Must remain legible against bright photo thumbnails *and* dark backgrounds. Reuses badge styling pattern from `panel.css`.

### Visual cues

| State | Treatment |
|---|---|
| Collapsed parent | Larger radius, glowing ring, **`+` badge** in corner, ⓘ on hover (desktop) / always (mobile) |
| Expanded parent (some children visible) | Same size, ring dims, **`−` badge**, ⓘ on hover (desktop) / always (mobile) |
| Fully expanded parent | Same size, ring dims, **`−` badge**, ⓘ **always visible** (desktop + mobile) |
| Leaf | Smaller, flat, no badge, no ring, no ⓘ |

### Cursor & tooltip

- Parents: `cursor: zoom-in` when collapsed, `zoom-out` when expanded. Tooltip: *"Click to expand • ⓘ for info"* / *"Click to collapse • ⓘ for info"*.
- Leaves: `cursor: help`. Tooltip: *"Click for details"*.

### First-time hint

On the first manual expand of LUCA, a one-shot tooltip floats near the next collapsed parent: *"Tap any glowing circle to reveal what's inside."* Dismissed forever after first interaction. Stored under `tol-expand-hint-seen`.

---

## 4. Layout & Spacing

### Dynamic subtree weight

In `js/layout.js`, each visible node gets a computed `_weight = (count of currently-visible descendants) + 1`. Sibling spacing (angular for radial, perpendicular for cladogram/chronological) is proportional to `_weight`, not raw child count. Collapsed branches weigh 1 → reclaim space instantly.

### Increased base spacing constants

- `MIN_ARC_PX`: 50 → **75**
- `MAX_ARC_PER_LEAF`: 80 → **110**
- `DEPTH_R` ring gaps: **+25%** across the board
- Cladogram row height: **+30%**

All three layouts (radial, cladogram, chronological) honor `_weight`. Chronological keeps its time axis; siblings spread on the perpendicular axis by weight.

### Auto-zoom on expand/collapse

New helper `frameSubtree(node)` in `zoom.js`:
1. Compute bounding box of `node` + all its currently-visible descendants.
2. Pick a transform `{x, y, s}` that fits the box with ~15% padding.
3. Tween via existing `smoothPanTo()` (400ms ease-out, respects reduced-motion).

Called after every manual expand/collapse and after the depth slider settles.

**Max zoom-out clamp:** `frameSubtree()` must never zoom out further than the zoom level that frames the full base tree. If a subtree's bounding box is larger than that (e.g., expanding a node with many grandchildren), clamp to the base-tree zoom and let the user pan manually. Prevents newly-revealed children from looking tiny.

### Collision safety net

After layout, the existing label-collision detector runs. If any node-circle bounding boxes still overlap (rare wide-expansion edge case), the layout function nudges the smaller subtree outward by one spacing increment and re-checks (max 3 passes).

### Performance flag

Measure `layout()` cost during slider drag early in development. **If it exceeds 16ms per frame at the full ~393-node count**, the fallback is:
- During drag: skip the collision-safety pass, render at lower fidelity.
- On drag-end: run full layout once.

---

## 5. Global Controls — "Reveal" Panel

A new compact UI cluster labeled **"Reveal"**. Exact placement is decided during PR 2 implementation by looking at where other controls currently sit (breadcrumb, view mode, timeline). Default candidate: a small floating cluster at **bottom-left on all screen sizes**. Show placement options to the user before committing.

### A) Depth slider

- Horizontal slider, range `0 … state.maxBaseDepth` (computed from base TREE only, ~6–7 levels).
- Tick labels are **generic numbers**, not taxonomic ranks: `0 · 1 · 2 · 3 · 4 · 5 · 6 · All` (or `Shallow · · · · · Deep · All`). The depth-to-rank mapping is not consistent across branches, so naming a depth "Phyla" would mislead.
- Slider tooltip: *"Controls how many levels of the tree are visible."*
- Dragging sets `state.depthLimit` (debounced ~60ms). `preprocess()` re-flags `_collapsed`, `layout()` re-runs, `render()` tweens.
- **Slider respects manual expansions.** Sliding *down* only collapses nodes where `_manualExpand === false`. Manually-expanded branches stay open until the user collapses them or hits "Collapse All".
- Sliding *up* respects existing manual expansions and reveals additional levels per the new limit.

### B) Shortcut buttons

- **Collapse All** → `depthLimit = 0`, clears **all** `_manualExpand` flags, frames LUCA.
- **Expand All** → `depthLimit = maxBaseDepth`, frames whole base tree.

### C) Species toggle

- Switch labeled **"Show all species"** (off by default).
- **On:** lazy-loads `expandTree()` data the first time, merges into the live tree, re-preprocesses, re-layouts. Subsequent toggles are instant.
- **Off:** hides expansion-only nodes from render (data stays in memory). Slider's max stays at base depth — species are an *overlay*, not an additional depth level.
- Warning icon + tooltip: *"Adds ~300 species. Tree gets dense."*

### Persistence

`depthLimit` and `speciesLoaded` saved to `localStorage`. First-time visitors always get `depthLimit = 1`.

### i18n

New translation keys (en/he/ru) in `uiData.js`:
- `reveal`, `collapse_all`, `expand_all`, `show_all_species`
- `slider_tooltip`, `species_warning_tooltip`, `expand_hint_first_time`
- ⓘ button aria-label, parent/leaf tooltip strings

---

## 6. Duplicate Cleanup — Manual, Prerequisite

**No runtime dedupe code.** The ~23 known duplicates are resolved by hand in a **prerequisite data commit (PR 0)** before the feature branch begins.

### Process

1. One-time scan (manual or quick throwaway script) lists suspected duplicates by normalized latin name.
2. For each cluster, manually decide winner vs. losers.
3. Move any unique children from loser → winner.
4. Merge metadata by hand (richer `desc`, union of `facts` / `tags`, best `appeared` / `era`).
5. Delete loser nodes from `treeData.js` / `treeExpansion.js`.
6. Update references in `PHOTO_MAP`, `GEO_DATA`, `ENRICHMENT`, `BRANCH_DATA`, `WIKI_TITLES` to point to winner ids.
7. Commit: `fix: manually resolve 23 duplicate species nodes`.

### Deep-link redirects

Bookmarked `?node=<old-loser-id>` URLs would otherwise break. Add a small **`ID_REDIRECTS` map** in `js/navigation.js`:

```js
const ID_REDIRECTS = {
  'old-loser-id-1': 'winner-id-1',
  // ~23 entries
};
```

When resolving `?node=X`, check `ID_REDIRECTS` first. ~10 lines of code total.

### Future work (not in this spec)

- **Standalone CLI tool** `scripts/find-duplicates.js` — runs against `treeData.js` + `treeExpansion.js`, outputs a markdown report. Uses normalized latin names + bigram similarity (≥0.95) within the same genus. Human reviews the report and applies merges by hand. Never runs in browser, never runtime code. Estimated 2–3 hours.
- **Pre-commit validation** `scripts/validate-tree.js` — checks for duplicate latin names, orphan refs in `PHOTO_MAP` / `GEO_DATA`, missing required fields. Developer tool only. Estimated 1–2 hours.

These are deferred until species data batches are stable.

---

## 7. Files Touched

### PR 0 — Manual duplicate cleanup (data only)

- `js/treeData.js`
- `js/treeExpansion.js`
- `js/speciesData.js`
- `js/geoData.js`
- (any other file referencing loser ids)

### PR 1 — Collapsed-by-default + click expand/collapse + ⓘ button + auto-zoom

- **New:** none
- **Modified:** `js/state.js`, `js/utils.js` (`preprocess`), `js/layout.js` (weights, spacing constants, frameSubtree integration), `js/zoom.js` (`frameSubtree`, click handlers), `js/renderer.js` (badge, ring, ⓘ button rendering), `js/app.js` (init wiring), `js/panel.js` (ⓘ button → panel hookup), `js/navigation.js` (`ID_REDIRECTS`), `css/tree.css` (badges, rings, cursors, ⓘ contrast chip), `index.html` (ⓘ template if needed)

### PR 2 — Depth slider + species toggle + Reveal panel

- **Modified:** `js/state.js` (slider/toggle wiring), `js/app.js` (event listeners, persistence), `js/uiData.js` (translations), `css/layout.css` (Reveal panel), `css/responsive.css` (mobile placement), `index.html` (Reveal panel markup)

---

## 8. Testing — Manual Checklist

No automated tests in this repo. After each PR, verify in browser:

### PR 0 (data cleanup)

1. Page loads without console errors.
2. No broken references in `PHOTO_MAP`, `GEO_DATA`, `ENRICHMENT`, `BRANCH_DATA`.
3. Species Compare tool resolves both species correctly with cleaned data.
4. Deep link `?node=<old-loser-id>` resolves to the winner via `ID_REDIRECTS`.

### PR 1 (collapse + click + ⓘ + auto-zoom)

1. Fresh load (cleared `localStorage`) → splash → main view shows LUCA + 3 domains, all collapsed, glowing `+` badges visible.
2. Click Bacteria → expands one level, auto-pans/zooms, badge flips to `−`.
3. Click Bacteria again → collapses, frame returns to prior state.
4. Click ⓘ on Bacteria → opens info panel, no expansion.
5. Click a leaf species → opens species panel, no expansion attempt.
6. Switch language to Hebrew → ⓘ button + tooltips translated, RTL layout intact.
7. Mobile: tap parent expands; ⓘ visible at 60% always, tappable directly; long-press also opens info panel.
8. ⓘ button legible against bright photo thumbnails and dark backgrounds.
9. Reduced-motion preference disables auto-zoom tween.

### PR 2 (slider + species toggle + Reveal panel)

10. Drag depth slider 0 → max → tree fans out level by level, no overlap at any stop.
11. **(Critical test)** Manually expand a deep branch via click, then drag slider down to depth 1 → manually-expanded branch **stays open**, all other branches collapse. This is the test that validates the entire `_manualExpand` design — if it fails, slider UX is broken.
12. Click "Collapse All" → manually-expanded branch also collapses, slider snaps to 0.
13. Toggle "Show all species" on → ~300 species merge in, layout still readable, perf acceptable.
14. Toggle off → species hidden, slider unchanged.
15. Reload → `depthLimit` and `speciesLoaded` persisted.
16. `layout()` cost during slider drag stays under 16ms/frame at full node count (or fallback engages cleanly).

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Auto-zoom feels jarring | 400ms ease-out tween; respects existing reduced-motion preference |
| Slider drag perf at 393 nodes | Debounce 60ms + reuse `scheduleRender()`; fallback skips collision pass during drag |
| Manual cleanup misses a duplicate | Future CLI tool can catch leftovers; not blocking |
| Bookmarks to old ids break | `ID_REDIRECTS` map handles all 23 cases |
| Existing tours reference auto-collapsed nodes | Tour engine already calls expand-to-node helpers; verify and add `expandPathTo(nodeId)` helper if missing |
| Sapiens showcase / hominin overlay break | Both use late-binding interception — unaffected, but smoke-test after PR 1 |
| ⓘ button clutter on dense leaf-only views | ⓘ only renders on parents — leaves never get one |

---

## 10. Rollout

Three sequential commits/PRs on a single feature branch (or stacked branches):

| Order | PR | Scope | Risk |
|---|---|---|---|
| 1 | **PR 0** | Manual duplicate cleanup + `ID_REDIRECTS` | Low (data only) |
| 2 | **PR 1** | Collapse-by-default, click expand/collapse, ⓘ button, auto-zoom, layout spacing | High but testable |
| 3 | **PR 2** | Depth slider, species toggle, Reveal panel | Medium |

Each PR is independently shippable. Manual QA on `node serve.js` before merge. Each merge auto-deploys via existing GitHub Pages workflow.
