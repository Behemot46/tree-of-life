# Sprint J3 — Code Modularization

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` — resolve merge conflicts first
4. Read index.html's inline `<script>` block to understand current function organization
5. Identify all `onclick="functionName()"` HTML attributes — these functions MUST remain on `window`

**After ALL code changes:**
1. Test every interactive feature: tree click, search, panel, hominin view, DNA calc, timeline, zoom, theme toggle
2. Verify zero console errors
3. Commit: `feat: J3 — modularize inline JS into ES modules`
4. Push branch and create PR to main
5. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md
6. Update CLAUDE.md to reflect new file structure

---

## Sprint Goal

Split the 4,251-line monolithic index.html into 12 focused ES modules. No build step — use native `<script type="module">`.

## Architecture

### Module Map

```
js/app.js           ← Entry point. Imports all modules, runs init()
js/renderer.js      ← render(), branchPath(), scheduleRender(), animDone, getVisible, getVisibleEdges
js/layout.js        ← layout(), layoutRadial/Cladogram/Chronological, assignAngles, assignPositions, leafCount
js/panel.js         ← renderPanelContent(), showMainPanel(), closePanel(), fetchWikiPhoto()
js/navigation.js    ← navStack, pushNav, navBack, navHome, currentNavState, restoreNavState, updateNavButtons
js/search.js        ← buildSearchIndex(), searchEntities(), normalizeSearchText, _bigramSet, _fuzzyScore
js/timeline.js      ← era slider, buildExtinctionMarkers, buildEraPresets, toggleEraPlay, animateSliderTo, updateEraTint, updateSpeciesCount
js/hominin.js       ← openHomininView, renderHominins, showHominDetail, compare mode functions
js/dnaCalc.js       ← openDnaCalc, closeDnaCalc, resetDnaUI, openDnaSearch, selectDnaSpecies, dnaPreset, showDnaResults
js/zoom.js          ← transform state, wheel handler, pointer pan, zoom buttons, centerOnTree
js/theme.js         ← toggleTheme, setLang, applyI18n, t(), showLoading, showIntro
js/utils.js         ← generateSpeciesIllustration, hexToRgb/rgba/lighten/darken, getIconGroup, NODE_ICONS
```

### Shared State

These module-level variables are shared across modules. Use a `state.js` module or pass via function parameters:

```js
// js/state.js — shared mutable state
export let viewMode = 'radial';
export let currentEra = 3800;
export let showExtinct = true;
export let activeDomains = new Set([...]);
export let highlightedId = null;
export let currentPanelNode = null;
export let transform = { x: 0, y: 0, s: 0.6 };
export const nodeMap = {};
export const animDone = new Set();
```

### HTML onclick Compatibility

Functions called from `onclick="..."` HTML attributes MUST be exposed on `window`:

```js
// In app.js, after importing:
import { toggleDomain, resetDomains } from './renderer.js';
window.toggleDomain = toggleDomain;
window.resetDomains = resetDomains;
// ... same for all onclick-referenced functions
```

**Functions needing window exposure (check HTML for all onclick/onmouseover/onerror attributes):**
- `toggleDomain()`, `resetDomains()`
- `toggleExtinct()`
- `setLang()`, `toggleTheme()`
- `setViewMode()`
- `openDnaCalc()`, `closeDnaCalc()`, `openDnaSearch()`, `selectDnaSpecies()`, `dnaPreset()`
- `navigateTo()`
- `openHomininView()`
- `closePanel()`
- `focusNode()`

### Script Tag Change

Replace the current `<script>` tags with:
```html
<!-- Data modules (must load before app module) -->
<script src="js/treeData.js"></script>
<script src="js/speciesData.js"></script>
<script src="js/uiData.js"></script>
<script src="js/factLibrary.js"></script>
<script src="js/imagePrompts.js"></script>
<script src="js/imageLoader.js"></script>
<script src="js/dnaSimilarity.js"></script>

<!-- Application (ES module) -->
<script type="module" src="js/app.js"></script>
```

**Important:** The data files (treeData.js, speciesData.js, etc.) remain as classic scripts with globals. Only the application logic becomes ES modules.

## Extraction Strategy

Extract one module at a time in this order (dependencies flow downward):

1. `js/utils.js` — no dependencies on other app modules
2. `js/state.js` — shared state object
3. `js/layout.js` — depends on state
4. `js/zoom.js` — depends on state
5. `js/renderer.js` — depends on state, layout, utils
6. `js/navigation.js` — depends on state
7. `js/search.js` — depends on state (nodeMap)
8. `js/timeline.js` — depends on state, renderer
9. `js/panel.js` — depends on state, navigation
10. `js/hominin.js` — depends on state, navigation, panel
11. `js/dnaCalc.js` — depends on state, search
12. `js/theme.js` — depends on state
13. `js/app.js` — imports everything, runs init()

Test after each extraction before proceeding to the next.

---

## Success Criteria

- [ ] index.html inline `<script>` block reduced to < 50 lines (just the module import)
- [ ] 12+ new JS files in `js/` directory
- [ ] All features work exactly as before (tree, search, panel, timeline, DNA calc, hominins, zoom, theme)
- [ ] All onclick handlers still fire
- [ ] Zero console errors
- [ ] Dark/light theme works
- [ ] Mobile viewport works
- [ ] deploy-check.yml updated to verify new files
