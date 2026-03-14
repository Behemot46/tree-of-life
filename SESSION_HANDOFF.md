# Session Handoff — 2026-03-14

**Status: done**

## 1. Session Goal
Integrate the full hominin family tree inline with the main Tree of Life visualization — 28 species as first-class tree nodes, not a separate overlay. Merge with latest design (p12 visual overhaul + p13a nav buttons).

## 2. What I Changed
- **Hominin panel enrichment** in `index.html`: brain volume bars, capabilities badges (tools/fire/language), DNA introgression bars (Neanderthal/Denisovan %), fossil sites
- **Search deduplication**: `HOMININ_SKIP_IDS` prevents duplicate results for aliased entries; `canonicalHomininId()` resolves aliases
- **Navigation rewiring**: `openHominins()` uses `navigateTo()` instead of overlay; "Human Evolution" button and 'H' keyboard shortcut call `navigateTo('hominini')`
- **Collapse defaults**: hominini + 4 group nodes (group-proto, group-australopith, group-paranthropus, group-homo) start collapsed
- **DEPTH_R extended**: added depth 10 (1365) in `js/uiData.js` for deeper hominin nodes
- **Merge resolution**: resolved 9 conflicts with origin/main, removed duplicate `buildHomininTree()`, fixed duplicate `DEPTH_R` const, renamed `_homininData` → `_hominData`, replaced `Source Sans 3` → `Inter`

## 3. Why These Changes Were Made
Hominins were previously in a completely separate overlay mode, disconnected from the main tree visualization. The goal was to make them first-class citizens of the tree — same rendering, same branch lines, same search, same panel — so users experience a continuous phylogenetic exploration from LUCA to Homo sapiens.

## 4. Files Touched
- `index.html` — Hominin panel enrichment (~50 lines), search dedup logic, navigation rewiring, merge conflict resolution (9 conflicts)
- `js/uiData.js` — Extended DEPTH_R array to depth 10
- `serve.js` — `process.env.PORT` support (from prior session, included in merge)
- `PROJECT_PROGRESS.md` — Added p14 milestone + session handoff

## 5. Key Implementation Notes
- `buildHomininTree()` already existed in main's code (in treeData.js) — creates 4 group nodes under hominini from HOMININS array via `homininToTreeNode()`, setting `_hominin: true` and `_hominData: h` on each species node
- `HOMININ_SKIP_IDS = new Set(['homo-naledi','homo-floresiensis','denisovan'])` — these are aliases of h_naledi/h_floresiensis/denisovans already in the HOMININS array
- `canonicalHomininId()` uses `HOMININ_ID_ALIASES` from treeData.js to resolve between naming formats
- Panel detects hominin nodes via `node._hominData` property — shows brain volume, capabilities, DNA introgression, fossil sites
- "Hominin Deep Dive" button detection: `node._hominData || node.id === 'hominini' || (node.id && node.id.startsWith('hom-'))`
- Group nodes (group-proto etc.) are created by `buildHomininTree()` which runs during treeData.js load, before `preprocess(TREE)` in inline script
- After `preprocess(TREE)`, inline script sets `_collapsed: true` on hominini and all 4 group nodes

## 6. Risks / Caveats
- Hominin nodes are at depth 8-9 in the tree, requiring extended DEPTH_R — if more levels are added, DEPTH_R needs further extension
- The `HOMININ_SKIP_IDS` set is hardcoded — if new aliased entries are added to HOMININS, they need manual addition
- Panel enrichment section is within the very long `renderPanelContent()` template string — becomes harder to maintain as it grows
- Merge resolution was complex (9 conflicts) — future merges touching index.html should be done carefully

## 7. Tests Performed
- Page load: zero console errors
- Tree renders correctly in radial view
- Hominini node exists with 4 group children (Proto-Hominins: 4, Australopithecus: 8, Paranthropus: 3, Genus Homo: 13 = 28 total)
- All groups collapsed by default
- "Human Evolution" button navigates to hominini and opens panel with photo + description
- Homo sapiens node has `_hominData` with brain volume [1350, 1500]
- Search index includes "neanderthal" (2 results)
- Light/dark theme working

## 8. Not Tested
- Expanding group nodes and clicking individual hominin species in browser
- Brain volume / capabilities / DNA introgression rendering in panel (code verified, not visually confirmed)
- "Hide Extinct" toggle on hominin nodes
- Hebrew/Russian language switching with hominin panel
- Mobile layout with hominin nodes expanded
- Cladogram/chronological view with hominin nodes

## 9. Known Issues Still Open
- Panel HTML template is very long — modularization opportunity
- `panelHistory` and `navStack` are two parallel history stacks
- CLAUDE.md has stale references to old architecture
- Legend is decorative only
- Mobile nav button positioning may overlap with bottom panel

## 10. Recommended Next Step
- Visually test hominin panel enrichment (brain volume bar, capabilities, DNA introgression)
- Test "Hide Extinct" toggle with hominin nodes
- Test all 3 view modes (radial, cladogram, chronological) with expanded hominini
- Test Hebrew/Russian with hominin panel content

## 11. Suggested Commit Message
feat: integrate hominin family tree inline with main tree visualization

## 12. Suggested PR Title
feat: inline hominin family tree in main visualization

## 13. Suggested PR Description
## Summary
- 28 hominin species integrated as first-class tree nodes under hominini branch (4 groups)
- Panel enrichment: brain volume, capabilities, DNA introgression, fossil sites
- Search index includes all hominins with deduplication
- Merged with p12 design overhaul + p13a nav buttons (9 conflicts resolved)

## Test plan
- [ ] Tree renders with no console errors
- [ ] "Human Evolution" button navigates to hominini
- [ ] Expand hominini → 4 group nodes appear
- [ ] Click hominin species → panel shows brain volume, capabilities
- [ ] Search "neanderthal" → appears in results
- [ ] Toggle "Hide Extinct" → extinct hominins hidden
- [ ] Switch languages EN/HE/RU → no regressions

---

**Branch:** `claude/strange-rosalind`
**PR:** https://github.com/Behemot46/tree-of-life/pull/53
**Worktree:** `C:\Users\GAMER\tree-of-life\.claude\worktrees\strange-rosalind`
