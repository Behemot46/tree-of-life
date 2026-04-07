# Collapsed-by-Default Tree Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a collapsed-by-default tree that reveals itself through manual clicks, a depth slider, or a species toggle — with unambiguous parent/leaf interaction, dynamic layout spacing, and duplicate species resolved manually upfront.

**Architecture:** Three sequential PRs on one feature branch. PR 0 cleans duplicate data by hand + adds a small `ID_REDIRECTS` map. PR 1 changes `preprocess()` to honor a `depthLimit`, splits click handlers, renders badges + ⓘ buttons on parents, adds `frameSubtree()` auto-zoom, and bumps layout spacing constants. PR 2 adds the Reveal panel (depth slider, Collapse/Expand All, Show All Species toggle) with `localStorage` persistence and i18n.

**Tech Stack:** Vanilla JS ES modules, SVG + HTML `<foreignObject>`, CSS custom properties, `localStorage`. No build step, no test framework. Verification is manual browser QA on `node serve.js` at `http://localhost:5555`.

**Spec:** `docs/superpowers/specs/2026-04-07-collapsed-by-default-tree-design.md`

**Branch:** `feat/collapsed-by-default-tree` (create fresh from `main`)

---

## File Map

### PR 0 — Manual duplicate cleanup
- **Modify:** `js/treeData.js`, `js/treeExpansion.js`, `js/speciesData.js` (PHOTO_MAP, WIKI_TITLES, ENRICHMENT), `js/geoData.js` (GEO_DATA, BRANCH_DATA)
- **Modify:** `js/navigation.js` — add `ID_REDIRECTS` map + resolver

### PR 1 — Collapse + click + ⓘ + auto-zoom + spacing
- **Modify:** `js/state.js` — new fields
- **Modify:** `js/utils.js` — `preprocess()` honors `depthLimit` + `_manualExpand`
- **Modify:** `js/layout.js` — dynamic `_weight`, new spacing constants, DEPTH_R bump
- **Modify:** `js/zoom.js` — new `frameSubtree()` helper with clamp
- **Modify:** `js/renderer.js` — badge + ring + ⓘ button rendering, cursors
- **Modify:** `js/app.js` — split click handlers (collapsed parent / expanded parent / leaf / ⓘ)
- **Modify:** `js/panel.js` — expose `openPanelForNode(id)` hook for ⓘ button
- **Modify:** `css/tree.css` — badge, ring, ⓘ contrast chip, cursor states
- **Modify:** `js/uiData.js` — tooltip translation keys (en/he/ru)

### PR 2 — Reveal panel (slider + toggle)
- **Modify:** `index.html` — Reveal panel markup
- **Modify:** `css/layout.css` — Reveal panel layout
- **Modify:** `css/responsive.css` — Reveal panel on mobile
- **Modify:** `js/state.js` — slider wiring fields (if not added in PR 1)
- **Modify:** `js/app.js` — slider/toggle event listeners, persistence load
- **Modify:** `js/uiData.js` — Reveal panel translation keys

---

# PR 0 — Manual Duplicate Cleanup

### Task 0.1: Branch setup

**Files:** none

- [ ] **Step 1:** Create and switch to the feature branch.

```bash
git checkout main
git pull
git checkout -b feat/collapsed-by-default-tree
```

- [ ] **Step 2:** Start the dev server in a second terminal for ongoing verification.

```bash
node serve.js
```

Expected: `Serving http://localhost:5555`

---

### Task 0.2: Scan for duplicates

**Files:**
- Read: `js/treeData.js`, `js/treeExpansion.js`

- [ ] **Step 1:** Walk both files and collect every node with a `latin` field. Normalize: lowercase, trim whitespace, strip parenthetical authorities (e.g. `(Linnaeus, 1758)`), collapse multiple spaces.

- [ ] **Step 2:** Group by normalized latin. Any group of size ≥ 2 is a duplicate cluster. Also scan for duplicate `id` fields across both files (there should be zero by definition — flag any found).

- [ ] **Step 3:** For common names, group by `(normalized_common_name, parent_id)`. Flag clusters of size ≥ 2 where the parent differs.

- [ ] **Step 4:** Write the raw list to a scratch file `docs/dedupe-scratch.md` with one section per cluster:

```markdown
## Cluster 1: Pan troglodytes
- [treeData.js] id: `chimpanzee`, parent: `pan`, desc length: 142, children: 0, facts: 4
- [treeExpansion.js] id: `p_troglodytes`, parent: `pan`, desc length: 38, children: 0, facts: 1

Winner: `chimpanzee` (richer desc, more facts)
Losers: `p_troglodytes`
```

- [ ] **Step 5:** Commit the scratch file.

```bash
git add docs/dedupe-scratch.md
git commit -m "chore: scratch list of duplicate species clusters"
```

---

### Task 0.3: Apply merges

**Files:**
- Modify: `js/treeData.js`, `js/treeExpansion.js`, `js/speciesData.js`, `js/geoData.js`

- [ ] **Step 1:** For each cluster in `docs/dedupe-scratch.md`, edit the loser's source file to:
  1. Merge unique children into the winner.
  2. Copy any richer field (`desc`, `detail`, `facts`, `tags`, `appeared`, `era`) into the winner where the winner is empty or shorter.
  3. Delete the loser node from its parent's `children` array.

- [ ] **Step 2:** In `js/speciesData.js`, update `PHOTO_MAP`, `WIKI_TITLES`, and `ENRICHMENT` — remove every loser id key; if the winner had no entry and the loser did, rename the key to the winner id.

- [ ] **Step 3:** In `js/geoData.js`, do the same for `GEO_DATA` and `BRANCH_DATA`.

- [ ] **Step 4:** Grep for any lingering references to loser ids.

```bash
git grep -n "p_troglodytes"   # example — repeat per loser id
```

Expected: zero matches.

- [ ] **Step 5:** Reload `http://localhost:5555` in the browser. Verify:
  - No console errors.
  - The winner nodes still render with photos and descriptions.
  - Navigation to each winner still opens the panel cleanly.

- [ ] **Step 6:** Commit.

```bash
git add js/treeData.js js/treeExpansion.js js/speciesData.js js/geoData.js
git commit -m "fix: manually resolve duplicate species nodes"
```

---

### Task 0.4: ID_REDIRECTS map for deep links

**Files:**
- Modify: `js/navigation.js`
- Read: `docs/dedupe-scratch.md`

- [ ] **Step 1:** At the top of `js/navigation.js` (after imports), add the redirect map. One entry per loser id.

```js
// Redirects for species ids removed during manual duplicate cleanup (PR 0).
// Preserves bookmarked ?node=<old-id> deep links.
const ID_REDIRECTS = {
  'p_troglodytes': 'chimpanzee',
  // ... one line per loser
};

export function resolveNodeId(id) {
  return ID_REDIRECTS[id] || id;
}
```

- [ ] **Step 2:** Find every call site that reads `?node=` from the URL or looks up an id in `nodeMap`. Wrap the id with `resolveNodeId()` at the earliest point (deep-link handler in `app.js` init, `navigation.js` helpers).

```bash
git grep -n "nodeMap\[" js/
git grep -n "searchParams.get('node')" js/
```

For each match, import `resolveNodeId` and wrap the id.

- [ ] **Step 3:** Test deep link in browser.

```
http://localhost:5555/?node=p_troglodytes
```

Expected: opens the `chimpanzee` panel, no console error.

- [ ] **Step 4:** Delete the scratch file (it has served its purpose — the merges are in git history).

```bash
git rm docs/dedupe-scratch.md
```

- [ ] **Step 5:** Commit.

```bash
git add js/navigation.js
git commit -m "feat: ID_REDIRECTS map preserves deep links after dedupe cleanup"
```

---

### Task 0.5: PR 0 smoke test

- [ ] **Step 1:** Hard reload `http://localhost:5555` (Ctrl+Shift+R) and open console.

- [ ] **Step 2:** Verify: zero errors, zero warnings about missing photos, tree renders normally, search still finds all winner species.

- [ ] **Step 3:** Open the Species Compare tool and compare two species that had duplicate entries — both must resolve.

- [ ] **Step 4:** Switch language to `?lang=he` and `?lang=ru` — no broken refs.

- [ ] **Step 5:** If all green, PR 0 is done. Push the branch (do not open PR yet — stack PR 1 and PR 2 on top).

```bash
git push -u origin feat/collapsed-by-default-tree
```

---

# PR 1 — Collapse + Click + ⓘ + Auto-Zoom + Spacing

### Task 1.1: New state fields

**Files:**
- Modify: `js/state.js`

- [ ] **Step 1:** Read the current `state.js` to find where the `state` object is defined.

- [ ] **Step 2:** Add these fields to the `state` object (grouped together with a comment):

```js
// Collapsed-by-default tree feature
collapsedByDefault: true,
depthLimit: 1,            // 0 = LUCA only; 1 = LUCA + domains; computed max = full base tree
maxBaseDepth: 1,          // computed once at startup in app.js
speciesLoaded: false,     // whether expandTree() has been merged into the live tree
```

- [ ] **Step 3:** Reload browser — no console errors (no behavior change yet).

- [ ] **Step 4:** Commit.

```bash
git add js/state.js
git commit -m "feat(state): add collapsed-by-default state fields"
```

---

### Task 1.2: preprocess() honors depthLimit and _manualExpand

**Files:**
- Modify: `js/utils.js`

- [ ] **Step 1:** Read `preprocess()` in `js/utils.js` and locate where `_collapsed` is set (currently `false` for all nodes).

- [ ] **Step 2:** Change the assignment to honor the depth limit and manual overrides:

```js
// Was: node._collapsed = false;
node._collapsed = (state.collapsedByDefault && node.depth > state.depthLimit && !node._manualExpand);
```

Make sure `state` is imported at the top of the file.

- [ ] **Step 3:** In the same walk, also compute `state.maxBaseDepth` — track the max `depth` seen on a node whose `_fromExpansion` flag is NOT set. Write to `state.maxBaseDepth` after the walk completes.

(If nodes from `expandTree()` are not currently flagged, add a `_fromExpansion: true` tag inside `treeExpansion.js`'s `expandTree()` function when it attaches new children — a one-line change.)

- [ ] **Step 4:** Reload browser. Expected: the tree now shows only LUCA + its 3 domain children (Bacteria, Archaea, Eukaryota). Everything else is hidden. If LUCA is at depth 0, depth 1 = domains; domain children (kingdoms) should NOT be visible.

- [ ] **Step 5:** If you see more than 4 nodes, set `state.depthLimit = 0` temporarily via the console — only LUCA should show. Then `state.depthLimit = 1; scheduleRender()` — domains appear. Restore `depthLimit = 1` as the default.

- [ ] **Step 6:** Commit.

```bash
git add js/utils.js js/treeExpansion.js
git commit -m "feat(preprocess): collapse nodes past depthLimit on load"
```

---

### Task 1.3: Layout spacing constants bump

**Files:**
- Modify: `js/layout.js`

- [ ] **Step 1:** Find the constants `MIN_ARC_PX` and `MAX_ARC_PER_LEAF` in `layout.js`.

- [ ] **Step 2:** Update them:

```js
const MIN_ARC_PX = 75;          // was 50
const MAX_ARC_PER_LEAF = 110;   // was 80
```

- [ ] **Step 3:** Find `DEPTH_R` (either here or imported from `uiData.js`). Multiply every entry by 1.25 and round. Keep `DEPTH_R[0] = 0` untouched.

- [ ] **Step 4:** Find the cladogram row-height constant (search `rowHeight` or similar). Multiply by 1.3.

- [ ] **Step 5:** Reload — tree should look more spacious. LUCA + 3 domains should be well separated.

- [ ] **Step 6:** Commit.

```bash
git add js/layout.js js/uiData.js
git commit -m "feat(layout): increase base spacing constants for breathing room"
```

---

### Task 1.4: Dynamic subtree weight

**Files:**
- Modify: `js/layout.js`

- [ ] **Step 1:** Add a helper at the top of `layout.js`:

```js
// Count of currently-visible descendants + 1. Collapsed subtrees weigh 1.
function computeWeight(node) {
  if (!node.children || node._collapsed) {
    node._weight = 1;
    return 1;
  }
  let sum = 0;
  for (const c of node.children) sum += computeWeight(c);
  node._weight = Math.max(1, sum);
  return node._weight;
}
```

- [ ] **Step 2:** At the start of each layout function (`layoutRadial`, `layoutCladogram`, `layoutChronological`, `layoutPlayback`), call `computeWeight(TREE)` once before computing positions.

- [ ] **Step 3:** Replace sibling-spacing allocation to use `child._weight` as the divisor weight instead of raw child count or equal slices. For radial: allocate angular range proportional to `_weight`. For cladogram: allocate vertical slot height proportional to `_weight`.

```js
// Example for radial inside layoutRadial:
const totalWeight = node.children.reduce((s, c) => s + c._weight, 0);
let offset = startAngle;
for (const child of node.children) {
  const span = (endAngle - startAngle) * (child._weight / totalWeight);
  // recurse with [offset, offset + span]
  offset += span;
}
```

(Adapt to the actual function signatures in `layout.js` — the principle is "allocate space proportional to `_weight`, not equal slices.")

- [ ] **Step 4:** Reload. Expected: with LUCA + 3 collapsed domains, all three domains get equal space (each has weight 1). Manually set `state.depthLimit = 2; scheduleRender()` in console — one domain with more children should now occupy more space than the others.

- [ ] **Step 5:** Commit.

```bash
git add js/layout.js
git commit -m "feat(layout): dynamic subtree weighting so collapsed branches stay compact"
```

---

### Task 1.5: frameSubtree() with max-zoom-out clamp

**Files:**
- Modify: `js/zoom.js`

- [ ] **Step 1:** Add the helper at the bottom of `zoom.js`:

```js
// Compute a transform that frames `node` + all currently-visible descendants
// with ~15% padding. Clamped so we never zoom out further than the full base tree.
export function frameSubtree(node, opts = {}) {
  const padding = opts.padding ?? 0.15;

  // Collect visible descendants
  const pts = [];
  (function walk(n) {
    pts.push({ x: n._x, y: n._y, r: n.r || 12 });
    if (n.children && !n._collapsed) n.children.forEach(walk);
  })(node);

  const minX = Math.min(...pts.map(p => p.x - p.r));
  const maxX = Math.max(...pts.map(p => p.x + p.r));
  const minY = Math.min(...pts.map(p => p.y - p.r));
  const maxY = Math.max(...pts.map(p => p.y + p.r));

  const bw = maxX - minX;
  const bh = maxY - minY;
  const vw = container.clientWidth;
  const vh = container.clientHeight;

  const s = Math.min(
    vw / (bw * (1 + padding)),
    vh / (bh * (1 + padding))
  );

  // Clamp: never zoom out further than the full-base-tree zoom
  const sClamped = Math.max(s, state.baseTreeZoom || 0);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const x = vw / 2 - cx * sClamped;
  const y = vh / 2 - cy * sClamped;

  smoothPanTo(x, y, sClamped);
}
```

- [ ] **Step 2:** In `app.js` init (after the first layout completes), compute and store the base-tree zoom:

```js
// Snapshot the zoom level that frames the full base tree.
// Used as the floor for frameSubtree() so we never zoom out past this.
state.depthLimit = state.maxBaseDepth;
preprocess(TREE);
layout();
state.baseTreeZoom = computeBaseFitZoom(TREE); // helper that returns just the scale, not the transform
state.depthLimit = 1;
preprocess(TREE);
layout();
```

Add `computeBaseFitZoom()` in `zoom.js` — same math as `frameSubtree` but returns just `s`.

- [ ] **Step 3:** Reload browser. In console: `frameSubtree(nodeMap.bacteria)`. Expected: camera smoothly pans/zooms to frame Bacteria. Try on a tiny node — should NOT zoom in past readable. Try on LUCA with everything expanded — should NOT zoom out past base-tree fit.

- [ ] **Step 4:** Commit.

```bash
git add js/zoom.js js/app.js
git commit -m "feat(zoom): frameSubtree() with max-zoom-out clamp"
```

---

### Task 1.6: Split click handlers

**Files:**
- Modify: `js/app.js` (or wherever node click is currently wired)

- [ ] **Step 1:** Find the current node-click handler. Replace its body:

```js
function handleNodeClick(node, ev) {
  const isParent = !!(node.children && node.children.length);

  if (!isParent) {
    // Leaf: open species panel (unchanged behavior)
    showMainPanel(node);
    return;
  }

  // Parent: expand/collapse only. Never open panel directly.
  if (node._collapsed) {
    node._collapsed = false;
    node._manualExpand = true;
    scheduleRender();
    // Wait for render, then frame the newly-visible subtree
    requestAnimationFrame(() => frameSubtree(node));
  } else {
    // Collapse: clear manual flag so the slider can re-expand naturally
    collapseSubtree(node);
    node._manualExpand = false;
    scheduleRender();
    requestAnimationFrame(() => frameSubtree(node));
  }
}

function collapseSubtree(node) {
  node._collapsed = true;
  if (node.children) {
    node.children.forEach(c => {
      c._manualExpand = false;
      if (c.children) collapseSubtree(c);
    });
  }
}
```

- [ ] **Step 2:** Import `frameSubtree` from `zoom.js` and `scheduleRender` from `renderer.js`.

- [ ] **Step 3:** Reload. Click Bacteria → it should expand one level + camera frames its new children. Click again → collapses, camera reframes. Click a leaf species → panel opens as before.

- [ ] **Step 4:** Commit.

```bash
git add js/app.js
git commit -m "feat(click): split parent expand vs leaf open-panel"
```

---

### Task 1.7: Render ⓘ button, +/− badge, glowing ring

**Files:**
- Modify: `js/renderer.js`
- Modify: `css/tree.css`

- [ ] **Step 1:** In `renderer.js`, inside the per-node render loop, for parent nodes add an SVG `<g>` child with two elements: the badge and the info button. Place them in top-right of the node circle (offset = +r, -r from node center).

```js
if (node.children && node.children.length) {
  // Glowing ring on collapsed parents
  if (node._collapsed) {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', node._x);
    ring.setAttribute('cy', node._y);
    ring.setAttribute('r', (node.r || 12) + 4);
    ring.setAttribute('class', 'node-ring-expandable');
    group.appendChild(ring);
  }

  // +/- badge in bottom-right
  const badge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  badge.setAttribute('class', 'node-badge');
  badge.setAttribute('transform', `translate(${node._x + (node.r || 12) * 0.75}, ${node._y + (node.r || 12) * 0.75})`);
  const badgeBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  badgeBg.setAttribute('r', 7);
  badgeBg.setAttribute('class', 'node-badge-bg');
  const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  badgeText.setAttribute('text-anchor', 'middle');
  badgeText.setAttribute('dominant-baseline', 'central');
  badgeText.setAttribute('class', 'node-badge-text');
  badgeText.textContent = node._collapsed ? '+' : '−';
  badge.appendChild(badgeBg);
  badge.appendChild(badgeText);
  group.appendChild(badge);

  // ⓘ info button in top-right
  const info = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  info.setAttribute('class', 'node-info-btn');
  info.setAttribute('transform', `translate(${node._x + (node.r || 12) * 0.75}, ${node._y - (node.r || 12) * 0.75})`);
  info.setAttribute('data-node-id', node.id);
  const infoBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  infoBg.setAttribute('r', 8);
  infoBg.setAttribute('class', 'node-info-bg');
  const infoText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  infoText.setAttribute('text-anchor', 'middle');
  infoText.setAttribute('dominant-baseline', 'central');
  infoText.setAttribute('class', 'node-info-text');
  infoText.textContent = 'i';
  info.appendChild(infoBg);
  info.appendChild(infoText);
  group.appendChild(info);
}
```

- [ ] **Step 2:** Add a class `node-fully-expanded` to parents whose `_collapsed === false` AND every descendant `_collapsed === false` — used by CSS to force-show the ⓘ button.

- [ ] **Step 3:** In `css/tree.css`, add:

```css
/* Collapsed-parent glowing ring */
.node-ring-expandable {
  fill: none;
  stroke: var(--gold);
  stroke-width: 2;
  opacity: 0.55;
  filter: drop-shadow(0 0 6px var(--gold));
  animation: nodeRingPulse 2.4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes nodeRingPulse {
  0%,100% { opacity: 0.35; }
  50%     { opacity: 0.75; }
}

/* +/- badge */
.node-badge-bg {
  fill: rgba(10, 8, 6, 0.85);
  stroke: var(--gold);
  stroke-width: 1;
}
.node-badge-text {
  fill: var(--gold);
  font: 700 10px/1 var(--font-sans, 'Inter', sans-serif);
  pointer-events: none;
  user-select: none;
}

/* ⓘ info button — high-contrast chip, legible on any background */
.node-info-btn { cursor: help; opacity: 0; transition: opacity 0.18s ease; }
.node-circle-parent:hover + .node-info-btn,
.node-info-btn:hover,
.node-fully-expanded .node-info-btn { opacity: 1; }
.node-info-bg {
  fill: rgba(10, 8, 6, 0.88);
  stroke: #fff;
  stroke-width: 1.25;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6));
}
.node-info-text {
  fill: #fff;
  font: 700 11px/1 Georgia, 'Times New Roman', serif;
  font-style: italic;
  pointer-events: none;
  user-select: none;
}

/* Mobile: always-visible ⓘ at 60% opacity */
@media (hover: none), (max-width: 768px) {
  .node-info-btn { opacity: 0.6; }
  .node-info-btn:active { opacity: 1; }
}

/* Cursor states */
.node-circle-parent { cursor: zoom-in; }
.node-circle-parent.expanded { cursor: zoom-out; }
.node-circle-leaf { cursor: help; }
```

- [ ] **Step 4:** In `renderer.js`, add the `expanded` class to parent node circles when `!node._collapsed`, and use `.node-circle-parent` / `.node-circle-leaf` on the main node circle depending on whether it has children.

- [ ] **Step 5:** Reload. Expected: LUCA + 3 domains each have a glowing ring, `+` badge, and an ⓘ button visible on hover (desktop). On mobile emulation, ⓘ is always visible at 60%.

- [ ] **Step 6:** Commit.

```bash
git add js/renderer.js css/tree.css
git commit -m "feat(render): glowing ring, +/- badge, and high-contrast info button on parents"
```

---

### Task 1.8: ⓘ button click → open panel

**Files:**
- Modify: `js/app.js`
- Modify: `js/panel.js`

- [ ] **Step 1:** Make sure `panel.js` exports a way to open the panel for any node id. If not present, add:

```js
export function openPanelForNode(id) {
  const node = nodeMap[id];
  if (!node) return;
  showMainPanel(node);
}
```

- [ ] **Step 2:** In `app.js`, add a delegated click handler on the SVG root that stops event propagation and routes ⓘ clicks separately from node circle clicks:

```js
svgRoot.addEventListener('click', (ev) => {
  const infoBtn = ev.target.closest('.node-info-btn');
  if (infoBtn) {
    ev.stopPropagation();
    ev.preventDefault();
    const id = infoBtn.getAttribute('data-node-id');
    openPanelForNode(id);
    return;
  }
  // ... existing node click routing continues
}, true); // capture phase so we fire before any node click handler
```

- [ ] **Step 3:** Reload. Click a domain node circle → expands. Click the ⓘ button on that domain → opens its info panel (expansion state unchanged). Verify the two never fire together.

- [ ] **Step 4:** On mobile emulation, tap the always-visible ⓘ → opens panel.

- [ ] **Step 5:** Commit.

```bash
git add js/app.js js/panel.js
git commit -m "feat(info-btn): open panel from info button, never conflict with expand"
```

---

### Task 1.9: Long-press opens info panel (mobile bonus)

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1:** Add a touchstart/touchend long-press detector on parent node circles:

```js
let longPressTimer = null;
let longPressFired = false;

svgRoot.addEventListener('touchstart', (ev) => {
  const circle = ev.target.closest('.node-circle-parent');
  if (!circle) return;
  const id = circle.getAttribute('data-node-id');
  longPressFired = false;
  longPressTimer = setTimeout(() => {
    longPressFired = true;
    openPanelForNode(id);
  }, 550);
}, { passive: true });

svgRoot.addEventListener('touchend', () => { clearTimeout(longPressTimer); }, { passive: true });
svgRoot.addEventListener('touchmove', () => { clearTimeout(longPressTimer); }, { passive: true });
```

- [ ] **Step 2:** In `handleNodeClick`, early-return if `longPressFired` is true (and reset it).

- [ ] **Step 3:** On mobile emulation: short tap expands, long-press opens panel. Verify the short tap still works immediately after a long-press.

- [ ] **Step 4:** Commit.

```bash
git add js/app.js
git commit -m "feat(mobile): long-press on parent node opens info panel"
```

---

### Task 1.10: First-time expand hint

**Files:**
- Modify: `js/app.js` (or `js/engagement.js`)
- Modify: `js/uiData.js`

- [ ] **Step 1:** In `uiData.js` `TRANSLATIONS`, add a new key to all three languages:

```js
// en
expand_hint_first_time: 'Tap any glowing circle to reveal what's inside.',
// he
expand_hint_first_time: 'הקש על כל עיגול זוהר כדי לחשוף מה בפנים.',
// ru
expand_hint_first_time: 'Нажмите на любой светящийся круг, чтобы раскрыть его содержимое.',
```

- [ ] **Step 2:** In `handleNodeClick` (parent-expand branch), after the first successful manual expand, check `localStorage.getItem('tol-expand-hint-seen')`. If null, show a one-shot tooltip near the next collapsed sibling and set the key.

```js
if (!localStorage.getItem('tol-expand-hint-seen')) {
  const nextCollapsed = node.children?.find(c => c._collapsed && c.children?.length);
  if (nextCollapsed) {
    showTransientTooltip(nextCollapsed, t('expand_hint_first_time'), { durationMs: 4500 });
  }
  localStorage.setItem('tol-expand-hint-seen', '1');
}
```

`showTransientTooltip` can reuse the existing tooltip element in `navigation.js` — just reposition and auto-hide.

- [ ] **Step 3:** Clear localStorage, reload, click Bacteria → hint appears near Archaea or a Bacteria child. Click again → hint does not reappear.

- [ ] **Step 4:** Commit.

```bash
git add js/app.js js/uiData.js
git commit -m "feat(onboarding): first-time hint after initial parent expand"
```

---

### Task 1.11: PR 1 smoke test

- [ ] **Step 1:** Clear localStorage, hard reload.
- [ ] **Step 2:** Verify: LUCA + 3 domains visible, all collapsed, glowing rings + `+` badges.
- [ ] **Step 3:** Click Bacteria → expands one level, auto-zooms to frame new children.
- [ ] **Step 4:** Click Bacteria again → collapses, reframes.
- [ ] **Step 5:** Hover a parent → ⓘ appears. Click ⓘ → panel opens, no expansion.
- [ ] **Step 6:** Click a leaf → species panel opens.
- [ ] **Step 7:** Switch to `?lang=he` — layout still works, tooltips translated.
- [ ] **Step 8:** DevTools mobile emulation — ⓘ always visible at 60%, long-press opens panel, short-tap expands.
- [ ] **Step 9:** Enable reduced-motion in OS — auto-zoom becomes instant (via existing smoothPanTo reduced-motion check).
- [ ] **Step 10:** Push branch.

```bash
git push
```

---

# PR 2 — Reveal Panel (Slider + Toggle)

### Task 2.1: Reveal panel markup

**Files:**
- Modify: `index.html`

- [ ] **Step 1:** Find a good spot near the existing floating controls. Add the Reveal panel markup (use i18n via element IDs the same way other UI elements do):

```html
<div id="reveal-panel" class="reveal-panel" role="group" aria-labelledby="reveal-title">
  <div class="reveal-header">
    <span id="reveal-title">Reveal</span>
    <button id="reveal-help" class="reveal-help" aria-label="Help">?</button>
  </div>
  <div class="reveal-slider-row">
    <input type="range" id="reveal-depth-slider" min="0" max="6" value="1" step="1"
           aria-label="Tree depth" title="Controls how many levels of the tree are visible." />
    <span id="reveal-depth-value" class="reveal-depth-value">1</span>
  </div>
  <div class="reveal-ticks" id="reveal-ticks"><!-- filled by JS: 0 1 2 3 ... All --></div>
  <div class="reveal-buttons">
    <button id="btn-collapse-all" class="reveal-btn">Collapse All</button>
    <button id="btn-expand-all" class="reveal-btn">Expand All</button>
  </div>
  <label class="reveal-species-toggle">
    <input type="checkbox" id="reveal-species-toggle" />
    <span id="reveal-species-label">Show all species</span>
    <span class="reveal-species-warn" title="Adds ~300 species. Tree gets dense.">⚠</span>
  </label>
</div>
```

- [ ] **Step 2:** Reload — panel appears unstyled in DOM order. No JS wiring yet, so controls are inert.

- [ ] **Step 3:** Commit.

```bash
git add index.html
git commit -m "feat(reveal): add Reveal panel markup"
```

---

### Task 2.2: Reveal panel styles

**Files:**
- Modify: `css/layout.css`
- Modify: `css/responsive.css`

- [ ] **Step 1:** Look at the current placement of other floating controls in `layout.css`. Pick the least-crowded corner. Default: **bottom-left**. Add:

```css
.reveal-panel {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(12, 8, 6, 0.82);
  border: 1px solid rgba(200, 136, 58, 0.35);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  color: var(--parchment);
  font: 500 12px/1.3 var(--font-sans, 'Inter', sans-serif);
  min-width: 220px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.4);
}
.reveal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 11px;
}
.reveal-help {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  cursor: help;
  font-weight: 700;
}
.reveal-slider-row { display: flex; align-items: center; gap: 10px; }
#reveal-depth-slider { flex: 1; accent-color: var(--gold); }
.reveal-depth-value {
  min-width: 20px;
  text-align: right;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  color: var(--gold);
}
.reveal-ticks {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  opacity: 0.6;
}
.reveal-buttons { display: flex; gap: 6px; }
.reveal-btn {
  flex: 1;
  padding: 6px 8px;
  background: rgba(200, 136, 58, 0.12);
  border: 1px solid rgba(200, 136, 58, 0.4);
  border-radius: 6px;
  color: var(--parchment);
  cursor: pointer;
  font: 500 11px var(--font-sans, 'Inter', sans-serif);
}
.reveal-btn:hover { background: rgba(200, 136, 58, 0.25); }
.reveal-species-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(200, 136, 58, 0.2);
  cursor: pointer;
}
.reveal-species-warn { color: #f4c16a; cursor: help; }
```

- [ ] **Step 2:** In `responsive.css`:

```css
@media (max-width: 768px) {
  .reveal-panel {
    left: 8px;
    right: 8px;
    bottom: 8px;
    min-width: 0;
    padding: 10px 12px;
  }
}
```

- [ ] **Step 3:** Reload — panel visible and styled. Take a screenshot or eyeball it against other controls. **Show the placement to the user before committing** (per spec).

- [ ] **Step 4:** After approval, commit.

```bash
git add css/layout.css css/responsive.css
git commit -m "style(reveal): bottom-left floating Reveal panel"
```

---

### Task 2.3: Wire depth slider

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1:** Compute `state.maxBaseDepth` is already done in Task 1.2. Initialize slider `max` attribute to it on boot:

```js
const slider = document.getElementById('reveal-depth-slider');
const valueEl = document.getElementById('reveal-depth-value');
const ticksEl = document.getElementById('reveal-ticks');

slider.max = String(state.maxBaseDepth);
slider.value = String(state.depthLimit);
valueEl.textContent = String(state.depthLimit);

// Populate ticks: 0 1 2 ... maxBaseDepth All
ticksEl.innerHTML = '';
for (let i = 0; i <= state.maxBaseDepth; i++) {
  const span = document.createElement('span');
  span.textContent = i === state.maxBaseDepth ? 'All' : String(i);
  ticksEl.appendChild(span);
}
```

- [ ] **Step 2:** Add a debounced `input` handler:

```js
let sliderDebounce = null;
slider.addEventListener('input', () => {
  valueEl.textContent = slider.value;
  clearTimeout(sliderDebounce);
  sliderDebounce = setTimeout(() => {
    applyDepthLimit(parseInt(slider.value, 10));
  }, 60);
});

function applyDepthLimit(newLimit) {
  state.depthLimit = newLimit;
  // Re-flag _collapsed. preprocess() already honors _manualExpand,
  // so manually-expanded branches stay open even when sliding down.
  preprocess(TREE);
  scheduleRender();
  localStorage.setItem('tol-depth', String(newLimit));
}
```

- [ ] **Step 3:** Reload. Drag the slider. Expected: tree fans out/in level by level. Manually expand a deep branch, then drag slider to 0 → manually-expanded branch **stays open** (this is the critical Test #11 from the spec). Verify.

- [ ] **Step 4:** Commit.

```bash
git add js/app.js
git commit -m "feat(reveal): wire depth slider with _manualExpand respect"
```

---

### Task 2.4: Collapse All / Expand All buttons

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1:**

```js
document.getElementById('btn-collapse-all').addEventListener('click', () => {
  // Clear ALL manual overrides, then snap to 0
  walkTree(TREE, n => { n._manualExpand = false; });
  state.depthLimit = 0;
  slider.value = '0';
  valueEl.textContent = '0';
  preprocess(TREE);
  scheduleRender();
  localStorage.setItem('tol-depth', '0');
  requestAnimationFrame(() => frameSubtree(TREE));
});

document.getElementById('btn-expand-all').addEventListener('click', () => {
  state.depthLimit = state.maxBaseDepth;
  slider.value = String(state.maxBaseDepth);
  valueEl.textContent = String(state.maxBaseDepth);
  preprocess(TREE);
  scheduleRender();
  localStorage.setItem('tol-depth', String(state.maxBaseDepth));
  requestAnimationFrame(() => frameSubtree(TREE));
});

function walkTree(n, fn) {
  fn(n);
  if (n.children) n.children.forEach(c => walkTree(c, fn));
}
```

- [ ] **Step 2:** Test: manually expand a branch → click Collapse All → everything collapses including the manual branch. Click Expand All → all base nodes visible.

- [ ] **Step 3:** Commit.

```bash
git add js/app.js
git commit -m "feat(reveal): collapse-all clears manual overrides, expand-all shows base tree"
```

---

### Task 2.5: Show All Species toggle (lazy-load)

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1:**

```js
const speciesToggle = document.getElementById('reveal-species-toggle');

speciesToggle.addEventListener('change', async () => {
  if (speciesToggle.checked && !state.speciesLoaded) {
    // Lazy import — expandTree is already a module
    const { expandTree } = await import('./treeExpansion.js');
    expandTree(TREE);              // mutates TREE in place, adding children
    state.speciesLoaded = true;
  }
  // Toggle visibility of expansion-only nodes via a flag on the node
  walkTree(TREE, n => {
    if (n._fromExpansion) n._hiddenByToggle = !speciesToggle.checked;
  });
  preprocess(TREE);
  scheduleRender();
  localStorage.setItem('tol-species', speciesToggle.checked ? '1' : '0');
});
```

- [ ] **Step 2:** In `utils.js` `preprocess()`, extend the collapse check to also honor `_hiddenByToggle`:

```js
node._collapsed = (
  state.collapsedByDefault &&
  node.depth > state.depthLimit &&
  !node._manualExpand
) || node._hiddenByToggle;
```

Also: during the render walk in `renderer.js`, skip nodes where `_hiddenByToggle === true` entirely (don't just collapse — remove from render). Add a check near the top of the per-node render block:

```js
if (node._hiddenByToggle) return;
```

- [ ] **Step 3:** Reload, toggle on → ~300 species merge in, layout re-runs. Toggle off → back to base tree.

- [ ] **Step 4:** Commit.

```bash
git add js/app.js js/utils.js js/renderer.js
git commit -m "feat(reveal): lazy-load species toggle"
```

---

### Task 2.6: Persistence on load

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1:** Early in `init()` — **before** the first `preprocess()` — read saved state:

```js
const savedDepth = localStorage.getItem('tol-depth');
if (savedDepth !== null) {
  state.depthLimit = parseInt(savedDepth, 10);
}
const savedSpecies = localStorage.getItem('tol-species');
if (savedSpecies === '1') {
  const { expandTree } = await import('./treeExpansion.js');
  expandTree(TREE);
  state.speciesLoaded = true;
}
```

Note: first-time visitors (no `tol-depth` key) always get `depthLimit = 1` from the default.

- [ ] **Step 2:** After init completes, sync the slider + checkbox UI to the loaded state.

- [ ] **Step 3:** Reload, set slider to 3, enable species toggle, reload → slider stays at 3, species still on.

- [ ] **Step 4:** Commit.

```bash
git add js/app.js
git commit -m "feat(reveal): persist depth and species settings across reloads"
```

---

### Task 2.7: Translations

**Files:**
- Modify: `js/uiData.js`

- [ ] **Step 1:** Add keys to `TRANSLATIONS` for en/he/ru:

```js
// en
reveal: 'Reveal',
collapse_all: 'Collapse All',
expand_all: 'Expand All',
show_all_species: 'Show all species',
slider_tooltip: 'Controls how many levels of the tree are visible.',
species_warning_tooltip: 'Adds ~300 species. Tree gets dense.',
info_btn_aria: 'More info',
parent_tooltip_collapsed: 'Click to expand • ⓘ for info',
parent_tooltip_expanded: 'Click to collapse • ⓘ for info',
leaf_tooltip: 'Click for details',

// he
reveal: 'חשוף',
collapse_all: 'כווץ הכל',
expand_all: 'הרחב הכל',
show_all_species: 'הצג את כל המינים',
slider_tooltip: 'קובע כמה רמות של העץ מוצגות.',
species_warning_tooltip: 'מוסיף כ-300 מינים. העץ הופך צפוף.',
info_btn_aria: 'מידע נוסף',
parent_tooltip_collapsed: 'לחץ להרחבה • ⓘ למידע',
parent_tooltip_expanded: 'לחץ לכיווץ • ⓘ למידע',
leaf_tooltip: 'לחץ לפרטים',

// ru
reveal: 'Показать',
collapse_all: 'Свернуть все',
expand_all: 'Развернуть все',
show_all_species: 'Показать все виды',
slider_tooltip: 'Управляет количеством видимых уровней дерева.',
species_warning_tooltip: 'Добавляет ~300 видов. Дерево становится плотным.',
info_btn_aria: 'Подробнее',
parent_tooltip_collapsed: 'Нажмите, чтобы раскрыть • ⓘ для информации',
parent_tooltip_expanded: 'Нажмите, чтобы свернуть • ⓘ для информации',
leaf_tooltip: 'Нажмите для подробностей',
```

- [ ] **Step 2:** In `theme.js` `applyI18n()`, add imperative `set()` calls for the Reveal panel elements by id: `reveal-title`, `btn-collapse-all`, `btn-expand-all`, `reveal-species-label`, plus the `title` / `aria-label` attributes on `reveal-depth-slider` and `.reveal-species-warn`.

- [ ] **Step 3:** Reload with `?lang=he` → Reveal panel is in Hebrew, RTL layout intact. Same for `?lang=ru`.

- [ ] **Step 4:** Commit.

```bash
git add js/uiData.js js/theme.js
git commit -m "i18n(reveal): translations for Reveal panel and tooltips"
```

---

### Task 2.8: Layout perf check

**Files:** none (measurement only)

- [ ] **Step 1:** Open DevTools Performance tab. Start recording. Drag the slider from 0 to max rapidly. Stop recording.

- [ ] **Step 2:** Inspect frame durations during drag. **If any `layout()` call exceeds 16ms** at full-species load, implement the fallback: during drag, skip the collision-safety pass. Add a flag:

```js
state._draggingSlider = false;
slider.addEventListener('input', () => { state._draggingSlider = true; /* ... */ });
slider.addEventListener('change', () => { state._draggingSlider = false; preprocess(TREE); scheduleRender(); });
```

And in the collision-safety pass in `layout.js`, early-return if `state._draggingSlider`.

- [ ] **Step 3:** Re-measure. Confirm under 16ms per frame during drag.

- [ ] **Step 4:** Commit (only if fallback was needed).

```bash
git add js/layout.js js/app.js js/state.js
git commit -m "perf(layout): skip collision pass during slider drag"
```

---

### Task 2.9: PR 2 smoke test + full spec checklist

Run every item from Section 8 of the spec:

- [ ] PR 0 tests (data integrity) — passed earlier, re-verify no regressions.
- [ ] PR 1 tests 1-9 — re-verify under PR 2 code.
- [ ] **Test #10:** Drag depth slider 0 → max → tree fans out level by level, no overlap at any stop.
- [ ] **Test #11 (CRITICAL):** Manually expand a deep branch, then drag slider to depth 1 → manually-expanded branch **stays open**, all other branches collapse.
- [ ] **Test #12:** Click Collapse All → manually-expanded branch also collapses, slider snaps to 0.
- [ ] **Test #13:** Toggle "Show all species" on → ~300 species merge in, layout still readable.
- [ ] **Test #14:** Toggle off → species hidden, slider unchanged.
- [ ] **Test #15:** Reload → `depthLimit` and `speciesLoaded` persisted.
- [ ] **Test #16:** Slider drag perf under 16ms/frame (or fallback engages).
- [ ] **Regressions:** Sapiens showcase still opens for h_sapiens. Hominin overlay still opens. Existing tours still expand paths. Search still finds species after toggle.

- [ ] **Step 1:** Push branch.

```bash
git push
```

- [ ] **Step 2:** Open three PRs stacked (or one bundled PR with clear commit sections) against `main`.

```bash
gh pr create --title "feat: collapsed-by-default tree with Reveal panel" --body "$(cat <<'EOF'
## Summary
- PR 0: Manual duplicate cleanup + ID_REDIRECTS for deep links
- PR 1: Collapsed-by-default tree, click expand/collapse, ⓘ info button, auto-zoom on expand, dynamic layout spacing
- PR 2: Reveal panel (depth slider, Collapse/Expand All, Show All Species toggle) with persistence and i18n

Spec: docs/superpowers/specs/2026-04-07-collapsed-by-default-tree-design.md
Plan: docs/superpowers/plans/2026-04-07-collapsed-by-default-tree.md

## Test plan
- [ ] Fresh load shows LUCA + 3 domains only
- [ ] Click parent expands + auto-zooms, click again collapses
- [ ] ⓘ button opens info panel, never conflicts with expand
- [ ] Leaf click opens species panel
- [ ] Depth slider respects manual expansions (critical)
- [ ] Collapse All clears manual overrides
- [ ] Show all species lazy-loads expandTree
- [ ] Settings persist across reloads
- [ ] All three languages render correctly
- [ ] Mobile: ⓘ always visible, long-press opens panel
- [ ] Deep links to old duplicate ids still resolve

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review

**Spec coverage:**
- §1 Goals 1-8 → PR 1 Tasks 1.2, 1.6, 1.7, 1.8 + PR 2 Tasks 2.3-2.5 + PR 0 Tasks 0.3-0.4 ✓
- §2 State fields → Task 1.1 ✓
- §2 preprocess change → Task 1.2 ✓
- §2 Click handler split → Task 1.6 ✓
- §2 Persistence → Task 2.6 ✓
- §3 ⓘ button visibility rules → Task 1.7 (CSS), 1.8 (handler), 1.9 (long-press) ✓
- §3 Contrast chip → Task 1.7 CSS ✓
- §3 Cursors + tooltips → Task 1.7 + Task 2.7 ✓
- §3 First-time hint → Task 1.10 ✓
- §4 Dynamic weight → Task 1.4 ✓
- §4 Spacing constants → Task 1.3 ✓
- §4 frameSubtree with clamp → Task 1.5 ✓
- §4 Perf fallback → Task 2.8 ✓
- §5 Reveal panel + slider + buttons + toggle → Tasks 2.1-2.5 ✓
- §5 `_manualExpand` respect → Task 2.3 ✓
- §5 Generic tick labels → Task 2.3 ✓
- §5 Persistence → Task 2.6 ✓
- §5 i18n → Task 2.7 ✓
- §6 Manual dedupe + ID_REDIRECTS → Tasks 0.2-0.4 ✓
- §8 Test checklist → Task 2.9 ✓

**Placeholder scan:** No TBDs, all code blocks present, all commands concrete. Task 0.3 intentionally leaves per-cluster decisions to human judgment (correct — that's what "manual cleanup" means).

**Type consistency:** `frameSubtree`, `scheduleRender`, `preprocess`, `computeWeight`, `openPanelForNode`, `resolveNodeId`, `walkTree` used consistently across tasks. `_collapsed`, `_manualExpand`, `_weight`, `_fromExpansion`, `_hiddenByToggle` flags named consistently.

---

Plan complete.
