# Session Handoff — 2026-03-15 (p25 — Interactive Legend & Domain Highlighting)

**Status: done**
**Branch:** `claude/stupefied-leakey`

## 1. Session Goal
Make the legend fully interactive — clicking a domain highlights that subtree while dimming everything else, with clear visual feedback.

## 2. What I Changed

### index.html
- **CSS**: Added `.leg-row.active` / `.leg-row.dimmed` classes with transitions (opacity, background, font-weight). Added `#leg-show-all` button styling with `.filtering` state. Light theme variant for `.leg-row.active`.
- **HTML**: Replaced inline-styled Show All `<button>` with `<button id="leg-show-all">` using CSS classes. Added `<span id="i-leg-show-all">` for i18n.
- **JS — `toggleDomain()`**: Rewrote with smart single-click logic:
  - All domains active + click one → solo that domain (deactivate all others)
  - Some active + click inactive → add it
  - Some active + click active → remove it (unless last non-luca domain)
- **JS — `resetDomains()`**: Resets to full set, updates legend UI via `updateLegendUI()`.
- **JS — `updateLegendUI()`**: New helper that applies `active`/`dimmed` CSS classes to legend rows and `filtering` class to Show All button.
- **JS — `ALL_DOMAINS` constant**: Array of all 8 domain IDs.
- **JS — `isAllDomainsActive()`**: Helper to check if filtering is active.
- **JS — `render()` changes**: Inactive domain nodes/branches are dimmed (opacity 0.15/0.06) instead of hidden. Tree structure always visible. Dimmed nodes still clickable (panels open normally).
- **JS — `applyI18n()`**: Added `i-leg-show-all` translation.

### js/uiData.js
- Added `leg_show_all` translation key: EN "Show All", HE "הצג הכל", RU "Показать все".

### PROJECT_PROGRESS.md
- Added p25 to Completed table, marked Done in Upcoming table.

## 3. How Toggle Behavior Works
- **Solo mode**: When all domains active, clicking one solos it (only that domain + LUCA visible)
- **Add mode**: When filtering, clicking an inactive domain adds it
- **Remove mode**: When filtering, clicking an active domain removes it (minimum 1 non-luca domain enforced)
- **Reset**: Show All button restores all domains

## 4. How Dimming Works
- Dimming uses inline `g.style.opacity='0.15'` on node groups and `stroke-opacity=0.06` on branches
- Legend rows use CSS classes `.active` (highlight with background) and `.dimmed` (opacity 0.35) with 0.3s transitions
- Show All button gets `.filtering` class when domains are filtered (accent border/color)
- All domains active = no dimming applied, no active/dimmed classes on legend rows

## 5. Tests Performed
- Toggle logic: solo → add → remove → reset flow verified programmatically
- Domain filtering: 82 nodes correctly dimmed when bacteria solo'd, 18 active
- Legend row classes correctly applied (active/dimmed)
- Show All button `.filtering` class toggles correctly
- Zero console errors
- Dimmed nodes remain clickable (panel opens)

## 6. Not Tested
- Visual rendering at desktop width (preview browser viewport was narrow)
- Mobile layout
- Hebrew RTL layout
- Russian language
- Dark theme
- Cladogram/chronological view modes
- Search across dimmed domains

## 7. Known Issues
- Legend is positioned off-screen on narrow viewports due to `bottom: 5rem` mobile CSS (pre-existing, not introduced by this change)
- The 480px breakpoint hides the legend entirely (pre-existing)

---

# Session Handoff — 2026-03-15 (p23 — DNA Similarity Calculator)

**Status: done**
**Branch:** `claude/crazy-villani`

## 1. Session Goal
Build a DNA similarity calculator: users pick two species and see estimated DNA similarity %, divergence time, shared ancestor, and educational context.

## 2. What I Changed

### js/dnaSimilarity.js (NEW — ~130 lines)
- `DNA_KNOWN` — 35 curated DNA similarity pairs with published sources (Nature, Science) where available
- `estimateFromDivergence(mya)` — piecewise linear model mapping divergence time to estimated DNA similarity %
- `findLCA(nodeA, nodeB)` — walks `_parent` chains to find lowest common ancestor
- `estimateDnaSimilarity(nodeA, nodeB)` — main function: checks known lookup, falls back to estimation
- `DNA_FUN_FACTS` — 8 educational facts by similarity threshold
- `getDnaFunFact(percent, speciesName)` — returns relevant fun fact

### index.html
- **HTML**: DNA Compare button (`#btn-dna-calc`), modal panel (`#dna-panel`) with species selectors, search overlay, results display, 4 quick presets
- **CSS**: ~130 lines — modal styling, species slots, DNA bar, percentage display, badges, mobile responsive, dark/light theme
- **JS**: ~120 lines — `openDnaCalc()`, `closeDnaCalc()`, `dnaPreset()`, search integration via `searchEntities()`, animated counter, Escape key handling, backdrop click close
- **applyI18n()**: 10 new DNA calculator entries

### js/uiData.js
- 13 new i18n keys per language (EN/HE/RU): `dna_calc_title`, `dna_calc_btn`, `dna_select_species`, `dna_similarity`, `dna_divergence`, `dna_shared_ancestor`, `dna_method_known`, `dna_method_estimated`, `dna_search_placeholder`, 4 preset labels

### PROJECT_PROGRESS.md
- Added p23 to Completed table, marked as Done in Upcoming table

## 3. How the Estimation Model Works
- **Known pairs**: 35 curated entries in `DNA_KNOWN`, keyed by sorted `"idA|idB"`. Uses actual nodeMap IDs (e.g., `h_sapiens` not `homo-sapiens`)
- **Estimation**: For unknown pairs, finds LCA via `_parent` chain walk, uses LCA's `appeared` (Mya) as divergence time, then applies piecewise linear decay:
  - 0–7 Mya: ~98.5–99.5% (hominins)
  - 7–85 Mya: ~85–98.5% (mammals)
  - 85–500 Mya: ~40–85% (vertebrates→invertebrates)
  - 500–2000 Mya: ~17–40% (cross-kingdom)
  - 2000+ Mya: ~10–17% (cross-domain)

## 4. How to Add More Known Pairs
1. Open `js/dnaSimilarity.js`
2. Add entry to `DNA_KNOWN`: key is sorted `"idA|idB"` using actual nodeMap IDs
3. Check IDs exist: run `Object.keys(nodeMap).filter(k => k.includes('keyword'))` in console
4. Important: the tree uses `h_sapiens` (not `homo-sapiens`) for Homo sapiens due to `buildHomininTree()`

## 5. Known Issues / Follow-up
- Some tree nodes use group IDs (e.g., `mammals`, `birds`) rather than species IDs — the calculator works with any node
- The LCA divergence time uses the ancestor node's `appeared` field, which represents when the group appeared, not necessarily the exact divergence date
- 4 preset buttons: Chimp (98.8%), Banana/Plants (60%), Mushroom (30%), Bacterium (18%)
- The preset "You & a Banana" actually compares against "Flowering Plants" (`angiosperms`) since there's no banana-plant node in the tree

## 6. Tests Performed
- All 4 presets produce correct results with Published data badges
- Search-and-select flow works for both slots
- Dark/light theme both render correctly
- Zero console errors
- Escape key closes panel
- Backdrop click closes panel
- Shared ancestor link is clickable (navigates to LCA node)
- Animated percentage counter works smoothly

## 7. Not Tested
- Hebrew RTL layout (translations added but not visually verified)
- Russian language (translations added but not visually verified)
- Mobile viewport
- All 35 known pairs individually

---

# Session Handoff — 2026-03-15 (p19 — Roadmap & Project Health)

**Status: done**

## 1. Session Goal
Create a clear development roadmap, update all project tracking docs to reflect completed milestones (p13a–p15), and fix project health gaps (deploy validation, README, i18n).

## 2. What I Changed
- Created `ROADMAP.md` — prioritized development phases p16–p24 with checklists, architectural principles, and decision log
- Updated `PROJECT_PROGRESS.md` — added p13a, p13b, p14, p15, p16 milestone entries and milestone table rows
- Updated `CHANGELOG.md` — documented all merged milestones from p1 through p15 in reverse-chronological sections
- Fixed `deploy-check.yml` — added 3 missing JS files to required file validation (factLibrary.js, imagePrompts.js, imageLoader.js)
- Fixed `README.md` — corrected local dev instructions from `npx serve .` to `node serve.js`
- Localized splash screen — added IDs to splash title/years elements, wired to `t()` function
- Localized `showIntro()` overlay — 3 hardcoded English strings now use `t('title')`, `t('subtitle')`, `t('intro_quote')`
- Added `splash_years` and `intro_quote` i18n keys to EN/HE/RU in `js/uiData.js`
- Updated `applyI18n()` to set splash text on language switch
- Updated `init()` to set splash text from i18n at startup

## 3. Why These Changes Were Made
- Project had 4 undocumented milestones and no forward-looking roadmap
- CHANGELOG was empty since baseline — all post-baseline work was undocumented
- deploy-check.yml wasn't validating 3 JS files added in p13b/p15
- README gave wrong local dev command
- Splash screen and intro overlay were English-only (i18n gap for HE/RU users)

## 4. Files Touched
| File | Change |
|------|--------|
| `ROADMAP.md` | **NEW** — development roadmap with phases p16–p24 |
| `PROJECT_PROGRESS.md` | Added p13a–p16 milestones |
| `CHANGELOG.md` | Documented all milestones p1–p15 |
| `.github/workflows/deploy-check.yml` | Added 3 missing JS files to required list |
| `README.md` | Fixed local dev instructions |
| `js/uiData.js` | Added `splash_years` and `intro_quote` keys (EN/HE/RU) |
| `index.html` | Splash IDs, `showIntro()` i18n, `applyI18n()` splash support, `init()` splash i18n |

## 5. Key Implementation Notes
- `splash_years` and `intro_quote` are new i18n keys; `title` and `subtitle` already existed
- Russian number formatting uses spaces (3 800 000 000) per locale convention
- Splash HTML elements now have `id="splash-title"` and `id="splash-years"` for `applyI18n()` targeting
- `init()` sets splash text from i18n before the splash auto-dismisses (handles non-English first load)
- ROADMAP phases are advisory and can be reordered

## 6. Risks / Caveats
- Hebrew/Russian translations for `splash_years` and `intro_quote` should be reviewed by native speakers
- Splash screen auto-dismisses in 2.8s — language switch during splash is unlikely but handled
- `showIntro()` uses template literal interpolation with `t()` — safe since no user input

## 7. Tests Performed
- JS syntax check: main inline script and uiData.js both parse without errors
- App loads with zero console errors
- Language switching EN → HE → RU → EN: all new i18n keys return correct translations
- Hebrew RTL direction confirmed (`dir="rtl"`)
- Russian LTR direction confirmed
- Tree renders correctly after language switches
- All TRANSLATIONS keys verified present in all 3 languages

## 8. Not Tested
- Splash screen visual rendering (auto-dismisses in 2.8s before screenshot capture)
- `showIntro()` visual rendering in HE/RU (requires fresh page load with `?lang=he`)
- Mobile layout
- GitHub Pages deployment
- deploy-check.yml CI run

## 9. Known Issues Still Open
- Legend is decorative only (domain highlight not implemented) → ROADMAP p17
- `panelHistory` and `navStack` are two parallel stacks → ROADMAP p18
- No offline fallback → ROADMAP p19
- index.html is 4,012 lines → ROADMAP p20
- Panel content strings are English-only (node desc/detail/facts)
- D3.js CDN loaded but unused

## 10. Recommended Next Step
- p17: Legend interactivity (click domain → highlight/filter subtree)
- Or: native speaker review of HE/RU translations across factLibrary and new i18n keys

## 11. Suggested Commit Message
feat: add development roadmap, update project docs, localize splash/intro (p16)

## 12. Suggested PR Title
feat: development roadmap, project health fixes, splash i18n

## 13. Suggested PR Description
## Summary
- Creates comprehensive development roadmap (`ROADMAP.md`) with prioritized phases p16–p24
- Updates PROJECT_PROGRESS.md and CHANGELOG.md with all milestones p1–p15
- Fixes deploy-check.yml to validate all 6 JS files
- Fixes README.md local dev instructions
- Localizes splash screen and intro overlay for EN/HE/RU

## Test plan
- [ ] App loads without console errors
- [ ] Switch to Hebrew — verify RTL layout, splash text would show Hebrew
- [ ] Switch to Russian — verify Russian text
- [ ] Switch back to English — verify no regressions
- [ ] Fresh load with `?lang=he` — verify intro overlay shows Hebrew text
- [ ] Verify ROADMAP.md is readable and phases are logically ordered

---

**Branch:** `claude/keen-easley`
**Worktree:** `C:\Users\GAMER\tree-of-life\.claude\worktrees\keen-easley`

---

# Session Handoff — 2026-03-15 (p18: Fix Overlapping Header Controls)

**Status: done**
**PR:** https://github.com/Behemot46/tree-of-life/pull/57
**Branch:** `claude/sad-keller`

## 1. Session Goal
Fix overlapping UI controls in the top-right corner — hint text, language switcher (EN/עב/РУ), search bar buttons, and theme toggle were all competing for the same space.

## 2. What I Changed

### index.html (CSS changes only)
- **Header layout** — changed `#header` from `display:flex; justify-content:space-between` to `flex-direction:column; align-items:flex-start` so hint-bar renders below the title instead of beside it
- **Hint-bar repositioned** — `text-align:left` (was `right`), `line-height:1.6` (was `2`), added `margin-top:0.2rem`
- **Language switcher moved down** — `top:3.2rem` (was `1rem`) to sit below the search bar row
- **Theme toggle moved down** — `top:5.2rem` (was `3rem`) to sit below the lang-switcher
- **Search-wrap constrained** — added `max-width:calc(100% - 10rem)` to prevent buttons from bleeding into controls area

## 3. Why These Changes Were Made
- The header hint text ("Scroll to zoom | Drag to pan") was `text-align:right` in a flex row, overlapping with the language buttons
- The search bar buttons (Hide Extinct, Hominins) extended into the lang-switcher at `top:1rem`
- All three layers (z-index 200, 300, 400) occupied the same visual space in the top-right corner

## 4. Files Touched
- `index.html` — CSS only (5 properties changed across 4 selectors)

## 5. Merge Conflicts Resolved
- **3 conflict zones** in index.html from upstream CSS variable migration (PR #56 merged to main):
  1. **Header/hint-bar block** — kept main's CSS variables (`var(--bg)`, `var(--text-primary)`, etc.), applied flex-direction:column and hint-bar repositioning
  2. **Lang-switcher/theme-btn block** — kept main's CSS variable styling, applied position offsets (top:3.2rem, top:5.2rem)
  3. **Search-wrap inline style** — kept main's CSS variable for icon color, applied max-width constraint

## 6. Risks / Caveats
- Moving lang-switcher to `top:3.2rem` means it sits lower than before — may overlap with tree content on very small viewports
- The hint-bar is now left-aligned below the title; the right side of the header gradient area is empty

## 7. Tests Performed
- Visual verification via preview screenshot: hint text no longer overlaps lang buttons
- Lang-switcher buttons fully visible and separated from search bar
- Theme toggle accessible below lang-switcher

## 8. Not Tested
- Light theme
- RTL (Hebrew) layout
- Mobile responsiveness
- Russian language switching

## 9. Known Issues Still Open
1. Hominin overlay HTML still in index.html (dead code from p16)
2. Timeline not fully interactive
3. Panel modularization opportunity
4. `panelHistory` and `navStack` are parallel stacks

## 10. Recommended Next Steps
- Test mobile layout — lang-switcher at 3.2rem may need responsive adjustment
- Test RTL layout — hint-bar left-alignment may need to flip for Hebrew
- Consider hiding hint-bar after first interaction (it's guidance text)

---

# Session Handoff — 2026-03-15 (p17: Subtree-Weighted Radial Spacing)

**Status: done**
**PR:** https://github.com/Behemot46/tree-of-life/pull/56
**Branch:** `claude/goofy-bartik`

## 1. Session Goal
Improve the spatial quality of the radial tree layout so branches feel open, breathing, and museum-quality rather than compressed or mechanical.

## 2. What I Changed

### index.html (+46 lines, -5 lines)
- **Replaced `assignAngles()`** — was equal-share (each sibling gets `range/N`); now uses `sqrt(leafCount)` weighting so larger subtrees get proportionally more angular room
- **Added `leafCount()` helper** — recursively counts visible leaves in a subtree, used by `assignAngles` for proportional weighting
- **Replaced `assignPositions()`** — improved DEPTH_R fallback from `depth*65` to `DEPTH_R[last] + (overflow)*120` for graceful handling of deep trees
- **Increased label offset** — from `r+14` to `r+18` base (with upstream's depth-adaptive `+Math.max(0,(depth-3)*4)` bonus preserved)
- **Reduced initial zoom** — from `s:0.75` to `s:0.6` to accommodate expanded canvas

### js/uiData.js (+2 lines, -1 line)
- **Updated DEPTH_R array** — old: `[0,225,412,578,725,853,965,1067,1152,1230,1300,1365]`, new: `[0,240,440,620,790,950,1100,1240,1370,1490,1600]`
- Inter-ring gaps are now more consistent (200→180→170→160→150→140→130→120→110) instead of shrinking rapidly at deeper levels

## 3. Why These Changes Were Made
- Equal angular allocation gave leaf nodes (Porifera) the same arc as massive subtrees (Animals with 40+ descendants), crowding the dense regions
- DEPTH_R gaps shrank from 225px at depth 1 to just 65px at depth 8+, causing label overlap at the deepest levels where the most species live
- The tree read as mechanically uniform — subtree-weighted angles create natural, organic variation

## 4. Files Touched
- `index.html` — layout functions (`assignAngles`, `assignPositions`, `leafCount`), label offset, initial zoom
- `js/uiData.js` — DEPTH_R spacing array

## 5. Key Implementation Notes
- `sqrt(leafCount)` dampens extreme weight ratios — Eukaryota (100+ leaves) gets ~3x the angle of Bacteria (5 leaves), not 20x
- `MIN_ANGLE_SEP=0.22` (already present in upstream) ensures even small subtrees get minimum breathing room
- Upstream's multi-view layout system (radial/cladogram/chronological) was preserved intact — changes only affect `assignAngles`, `assignPositions`, and `DEPTH_R`, which are used by `layoutRadial()`
- Cladogram view has its own independent `countLeaves` function — unaffected

## 6. Risks / Caveats
- The expanded DEPTH_R means the tree is ~17% larger overall; initial zoom reduced to compensate but users may need to zoom out more on small screens
- 3 label pairs still overlap out of 93 visible labels — the upstream global collision system handles most cases

## 7. Tests Performed
- Tree renders without JS errors
- Minimum sibling distance at all depths verified (≥83px at depth 2, ≥129px at deeper levels)
- 93 labels visible, only 3 overlapping pairs
- Hebrew RTL language switch works correctly
- Panel open/close works
- Pan and zoom reach all nodes
- Cladogram and chronological view modes unaffected (upstream code preserved through merge conflict resolution)

## 8. Not Tested
- Russian language switching
- Mobile layout
- Extinct toggle (attempted but preview browser disconnected)
- Deep zoom with all subtrees expanded
- Node click → expand children flow

## 9. Known Issues Still Open
1. Hominin overlay HTML still in index.html (dead code from p16)
2. Timeline not fully interactive
3. Panel modularization opportunity
4. `panelHistory` and `navStack` are parallel stacks

## 10. Recommended Next Steps
- Test mobile layout with expanded radii — may need responsive DEPTH_R scaling
- Consider making DEPTH_R dynamically computed based on viewport size
- Remove dead hominin overlay code

## 11. Suggested Commit Message
`feat: subtree-weighted radial layout with generous spacing`

## 12. Suggested PR Title
`feat: subtree-weighted radial layout with generous spacing`

## 13. Suggested PR Description
See PR #56

## Merge Conflicts Resolved
- **index.html** had 3 conflict zones:
  1. **Layout section** (lines ~1629–1743): Upstream added cladogram + chronological views; stash had subtree-weighted radial. **Resolution:** kept upstream's multi-view structure, applied subtree-weighted `assignAngles`/`assignPositions`/`leafCount` to the radial path only.
  2. **Image rendering** (lines ~2074–2126): Upstream added SVG silhouette + ImageLoader; stash had old label overlap code. **Resolution:** kept upstream's silhouette/ImageLoader code entirely, discarded stale label overlap code (upstream has better global collision pass).
  3. **Label distance** (lines ~2133–2137): Upstream had `r+14+depth_bonus`; stash had `r+20`. **Resolution:** merged to `r+18+depth_bonus` — larger base offset with depth adaptation.

---

# Session Handoff — 2026-03-15 (p16: Inline Hominin Subtree Fixes)

**Status: done**
**PR:** https://github.com/Behemot46/tree-of-life/pull/55
**Branch:** `claude/elated-hofstadter`

## 1. Session Goal
Expand the human lineage so that all 28 hominin species (4 groups) are rendered as real branches in the main tree.

## 2. What I Changed

### js/treeData.js
- **Added `homo-floresiensis` to `HOMININ_ID_ALIASES`** — the alias map was missing this entry, so `canonicalHomininId('homo-floresiensis')` returned the raw ID instead of resolving to `h_floresiensis`

### serve.js
- **Fixed query string handling** — `req.url` now has query params stripped before file lookup, preventing 404 when the page is reloaded with `?node=...` URL params

## 3. Why These Changes Were Made
- The inline hominin subtree was already implemented in PRs #53/#54. This session discovered two remaining bugs during testing:
  1. `homo-floresiensis` wasn't aliased, making `canonicalHomininId()` and `getHomininById()` unable to resolve this duplicate ID
  2. `navigateTo()` sets `?node=...` via `history.replaceState`, but serve.js tried to serve this as a file path

## 4. Files Touched
- `js/treeData.js` — added 1 alias line
- `serve.js` — added query string stripping (1 line change)

## 5. Key Implementation Notes
- `HOMININ_SKIP_IDS` in index.html already prevents duplicate search entries for `homo-floresiensis`, but the alias fix ensures `canonicalHomininId()` resolves correctly across all code paths
- The serve.js fix uses `req.url.split('?')[0]` — simple and safe for a static file server

## 6. Risks / Caveats
- None — both changes are minimal and isolated

## 7. Tests Performed
- Tree renders without JS errors on page load
- All 28 species confirmed present across 4 groups (4+8+3+13), no duplicates
- Expanding groups shows species with correct labels, icons, and layout
- Panel shows brain volume bar, DNA introgression, capabilities, fossil sites
- Search finds hominin species as regular tree nodes
- `navigateTo` uncollapse the full path and pans to species
- Extinct toggle correctly hides 27 extinct species, keeps H. sapiens
- Hebrew RTL renders correctly
- Page reload with `?node=...` URL works with fixed serve.js

## 8. Not Tested
- Russian language switching
- Mobile layout with expanded hominin subtree
- Deep zoom levels with all groups expanded simultaneously

## 9. Known Issues Still Open
1. The hominin overlay (`#hominin-view`) HTML is still in index.html — could be removed since the button now navigates to the tree instead
2. The `openHomininView` function in main still opens the overlay (only the button's `onclick` was changed to `navigateTo('hominini')`)
3. Timeline not fully interactive
4. Panel modularization opportunity remains
5. `panelHistory` and `navStack` are still parallel stacks

## 10. Recommended Next Steps
- Remove the hominin overlay HTML/CSS/JS (~200 lines of dead code)
- Update `openHomininView()` to navigate to tree (currently still opens overlay in main)
- Test mobile layout with expanded hominin subtree
- Consider making group nodes start expanded by default (currently all collapsed)

## 11. Suggested Commit Message
`fix: add homo-floresiensis alias, fix serve.js query string handling`

## 12. Suggested PR Title
`fix: add homo-floresiensis alias, fix serve.js query string handling`

## 13. Suggested PR Description
See PR #55

---

# Previous Session Handoff — 2026-03-15 (p15)

**Status: done**
**PR:** https://github.com/Behemot46/tree-of-life/pull/54
**Branch:** `claude/p15-stabilization`

## 1. Session Goal
Audit the codebase for accumulated drift, fix bugs, remove dead code, and update documentation to match reality.

## 2. What I Changed

### index.html (~165 lines removed)
- **Removed duplicate inline PHOTO_MAP** (168 lines) from inside `renderPanelContent()` — was shadowing the more complete global constant from `js/speciesData.js` (228 entries)
- **Hoisted `fetchWikiPhoto()` and photo cache init** (`window._photoCache`, `window._failedPhotos`) from inside `renderPanelContent()` to module scope — were re-declared on every panel open
- **Renamed `EXTINCTIONS` → `EXTINCTION_EVENTS`** inside `init()` to stop shadowing the global `EXTINCTIONS` array from `js/uiData.js` (different data shape: objects vs simple numbers)

### CLAUDE.md (updated)
- Added 3 missing JS files to repository structure: `factLibrary.js`, `imagePrompts.js`, `imageLoader.js`
- Fixed stale Playfair Display font references → Inter/JetBrains Mono/Heebo
- Updated `speciesData.js` exports list (`GREAT_APE_IDS`, `HOMININ_IDS` instead of stale names)
- Corrected index.html line count (~3,800 not ~2,860)
- Corrected JS file count (6 not 3)

## 3. Why These Changes Were Made
Multiple PRs (p1–p14) accumulated technical debt:
- PHOTO_MAP existed in both `speciesData.js` (228 entries) and inline in `renderPanelContent` (168 entries) — the inline copy was less complete and rebuilt on every panel open
- `fetchWikiPhoto()` was a function declaration inside `renderPanelContent`, re-parsed on each call
- `EXTINCTIONS` name collision between uiData.js (simple array) and init() (object array) caused confusing shadowing
- CLAUDE.md still referenced only 3 JS files when 6 exist

## 4. Files Touched
- `index.html` — removed duplicate PHOTO_MAP, hoisted fetchWikiPhoto, renamed EXTINCTIONS
- `CLAUDE.md` — updated file structure, fonts, line count, data file listing

## 5. Key Implementation Notes
- `PHOTO_MAP` from `js/speciesData.js` is loaded globally via `<script src>` tag before the inline `<script>` block — no `const` redeclaration needed
- `fetchWikiPhoto()` references `window._photoCache` and `window._failedPhotos` (module scope now)
- `EXTINCTION_EVENTS` (inside init) has objects `{name, time, short}` — different shape from global `EXTINCTIONS` array `[445,370,252,200,66]` in uiData.js. They serve different purposes:
  - Global `EXTINCTIONS`: used by `buildExtinctionMarkers()` for simple line markers
  - `EXTINCTION_EVENTS`: used by `addTimelineMarkers()` for named, interactive markers

## 6. Risks / Caveats
- If speciesData.js PHOTO_MAP is missing entries that the inline copy had, those species will show emoji fallback instead of photos. Verified: speciesData has 228 entries vs inline's 168 — it's a superset, no data loss.
- `fetchWikiPhoto` at module scope means it's available globally — acceptable since it was already functionally global (only called from panel rendering)

## 7. Tests Performed
- JS syntax check: `node --check` on extracted inline script — passes
- Verified 0 stale font references remain (Playfair Display, Source Sans, Noto Serif, Lora)
- Verified PHOTO_MAP correctly resolves from speciesData.js global scope
- Verified EXTINCTION_EVENTS rename doesn't break timeline marker rendering

## 8. Not Tested
- Live browser testing (no browser available in this session)
- Mobile layout
- Photo loading for all 228 PHOTO_MAP entries
- Hebrew/Russian i18n with updated rendering

## 9. Known Issues Still Open
1. Timeline not fully interactive (slider works but missing era period bars, preset buttons)
2. No offline fallback for API failures
3. Panel HTML template is a very long string — modularization opportunity
4. Legend is decorative only (domain highlight not implemented)
5. `panelHistory` and `navStack` are two parallel stacks (could be unified)
6. PHOTO_MAP exists in both `js/speciesData.js` (module scope) AND is registered with `ImageLoader.registerPhotoMap()` — slight redundancy but harmless

## 10. Recommended Next Steps
- **Test in browser** — verify panel photos load, timeline markers display, no console errors
- **Timeline enhancement** — make era bars interactive, add preset buttons, fix era tints
- **Panel modularization** — extract the ~300-line template literal into smaller functions
- **Unify navigation stacks** — merge `panelHistory` and `navStack` into one

---

# Previous Session Handoffs

## Session — 2026-03-14 (p13a: Back & Home Navigation)
**Branch:** `claude/compassionate-gagarin` (merged)
- Added persistent Back and Home navigation buttons with unified history stack
- Navigation history tracks node expansion/panel opens
- Full i18n support (EN/HE/RU) with RTL mirroring

## Session — Fact Library
**Branch:** `claude/tender-greider` (merged)
- Created `js/factLibrary.js` with 18 trilingual loading facts
- Wired splash screen to FACTS module with language-aware selection
