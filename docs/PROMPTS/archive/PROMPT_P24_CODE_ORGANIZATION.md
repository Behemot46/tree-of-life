# P24 — Code Organization & Extraction

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p24** (Tier 2 — Medium Priority).

**Your scope:** Extract rendering, panel, navigation, and search logic from the monolithic `index.html` inline `<script>` into separate JS modules. You touch `index.html` (extracting code out) and create new `js/*.js` files. You must NOT change any behavior — this is a pure refactor.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `refactor:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Reduce `index.html` from ~4,000 lines to ~500 lines (HTML + CSS + init bootstrap) by extracting JS logic into focused modules.

### Success Criteria

1. `index.html` inline `<script>` reduced to: variable declarations, `init()`, and event listener setup
2. New modules: `js/renderer.js`, `js/panel.js`, `js/navigation.js`, `js/search.js`, `js/timeline.js`
3. All modules use globals (no import/export — no build step)
4. App behavior is **identical** before and after extraction
5. All features work: tree rendering, panel, search, timeline, compare, DNA calc, navigation
6. All 3 languages work, RTL works, dark/light theme works
7. Zero console errors
8. No new npm dependencies

---

## Context

### Current index.html inline script (~3,200 lines)

The inline `<script>` block contains:
- State variables (~50 lines)
- `preprocess()`, `buildHomininTree()` (~80 lines)
- Layout functions: `layout()`, `layoutRadial()`, `layoutCladogram()`, `layoutChronological()` (~300 lines)
- `render()` — main tree renderer (~350 lines)
- `renderPanelContent()` — panel HTML builder (~400 lines)
- Navigation: `pushNav()`, `navBack()`, `navHome()`, `panelHistory` (~80 lines)
- Search: `buildSearchIndex()`, `searchEntities()`, fuzzy matching (~200 lines)
- Timeline: `buildExtinctionMarkers()`, `updateEraTint()`, slider handlers (~200 lines)
- Compare mode (~100 lines)
- DNA calculator (~200 lines)
- Zoom/pan handlers (~100 lines)
- `init()` and event listeners (~200 lines)
- `applyI18n()` and language switching (~100 lines)
- Miscellaneous utilities (~100 lines)

### Constraints

- **No module system** — all files loaded via `<script src>` tags, sharing global scope
- **Order matters** — data files must load before logic files, which must load before init
- Functions reference each other freely (e.g., `render()` calls `layoutRadial()`, which reads `viewMode`)
- State variables (`transform`, `currentRoot`, `viewMode`, etc.) are shared across all functions

### Script load order (current)

```html
<script src="js/treeData.js"></script>
<script src="js/speciesData.js"></script>
<script src="js/uiData.js"></script>
<script src="js/factLibrary.js"></script>
<script src="js/imagePrompts.js"></script>
<script src="js/imageLoader.js"></script>
<script> /* ~3,200 lines of inline code */ </script>
```

---

## Implementation Plan

### Phase A: Identify extraction boundaries

1. Read the full inline script and map function-to-function dependencies
2. Group functions into modules based on cohesion:
   - **renderer.js**: `render()`, `addSilhouette()`, label collision, `scheduleRender()`
   - **layout.js**: `layout()`, `layoutRadial()`, `layoutCladogram()`, `layoutChronological()`, `subtreeWeight()`, `assignAngles()`, `assignPositions()`
   - **panel.js**: `renderPanelContent()`, `showMainPanel()`, `closePanel()`, panel-internal navigation
   - **navigation.js**: `pushNav()`, `navBack()`, `navHome()`, popstate handler, breadcrumb
   - **search.js**: `buildSearchIndex()`, `searchEntities()`, `_bigramSet()`, `_fuzzyScore()`, TAXON_I18N
   - **timeline.js**: `buildExtinctionMarkers()`, `updateEraTint()`, `updateSpeciesCount()`, era presets, play button
   - **compare.js**: `toggleCompareMode()`, `closeCompare()`, compare card rendering
   - **dna-calc.js**: `openDnaCalc()`, DNA similarity functions, DNA panel rendering
3. Shared state variables stay in `index.html` inline script (they're the "glue")

### Phase B: Extract one module at a time

For each module:
1. Create `js/modulename.js`
2. Move functions into it (as global functions — no wrapping IIFE unless needed for private state)
3. Add `<script src="js/modulename.js"></script>` in correct load order
4. Test that app still works after each extraction
5. Commit each extraction separately for easy bisect

**Load order after extraction:**
```html
<!-- Data -->
<script src="js/treeData.js"></script>
<script src="js/speciesData.js"></script>
<script src="js/uiData.js"></script>
<script src="js/factLibrary.js"></script>
<script src="js/imagePrompts.js"></script>
<script src="js/imageLoader.js"></script>
<!-- Logic -->
<script src="js/search.js"></script>
<script src="js/layout.js"></script>
<script src="js/renderer.js"></script>
<script src="js/panel.js"></script>
<script src="js/navigation.js"></script>
<script src="js/timeline.js"></script>
<script src="js/compare.js"></script>
<script src="js/dna-calc.js"></script>
<!-- Bootstrap (inline — just state vars + init + event listeners) -->
<script> ... </script>
```

### Phase C: Verify and clean up

1. Run full test checklist
2. Remove any dead code exposed during extraction
3. Add brief header comments to each new file (module purpose, dependencies)
4. Update deploy-check.yml to include new files

---

## Files You Will Create/Modify

| File | What changes |
|------|-------------|
| `js/renderer.js` | **NEW** — render(), addSilhouette(), scheduleRender() |
| `js/layout.js` | **NEW** — layout functions |
| `js/panel.js` | **NEW** — renderPanelContent(), panel show/close |
| `js/navigation.js` | **NEW** — nav stack, back/home, popstate |
| `js/search.js` | **NEW** — search index, fuzzy matching |
| `js/timeline.js` | **NEW** — timeline slider, extinction markers |
| `js/compare.js` | **NEW** — compare mode |
| `js/dna-calc.js` | **NEW** — DNA similarity calculator |
| `index.html` | Remove extracted code, add script tags, keep state + init |
| `.github/workflows/deploy-check.yml` | Add new JS files to required list |
| `PROJECT_PROGRESS.md` | Add p24 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `js/treeData.js` — data file
- `js/speciesData.js` — data file
- `js/uiData.js` — data file (unless moving i18n helpers)
- `js/factLibrary.js` — data file
- `js/imageLoader.js` — already extracted

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Tree renders with all nodes and icons
3. Click node → panel opens with correct content
4. Search → results appear, click navigates
5. Timeline slider works, extinction markers show tooltips
6. View mode toggle: radial, cladogram, chronological
7. Compare mode: select species, compare cards appear
8. DNA calculator: select two species, result shows
9. Back/Home navigation works
10. Dark/light theme toggle
11. Hebrew RTL — everything correct
12. Russian — everything correct
13. Mobile viewport — bottom-sheet panel, touch gestures
14. Zero console errors
15. `index.html` inline script < 500 lines

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p24-code-organization`
- PR title: `refactor: extract JS modules from index.html (renderer, panel, search, nav, timeline)`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `refactor:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p24 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
