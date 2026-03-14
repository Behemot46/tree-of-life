# Session Handoff — 2026-03-14

**Status: done**

## 1. Session Goal
Add persistent Back and Home navigation buttons across all views and states, with a unified client-side navigation history stack.

## 2. What I Changed
- Added `#nav-ctrl` container with Back and Home buttons (HTML, positioned fixed top-left)
- Added unified `navStack[]` with `pushNav()`, `navBack()`, `navHome()`, `restoreNavState()`, `updateNavButtons()`, `currentNavState()`
- Hooked `pushNav()` into `showMainPanel()`, `openHomininView()`, and hominin species selection
- `navBack()` pops the stack and restores the previous state (tree, panel, hominin, or hominin-detail)
- `navHome()` clears everything: stack, panel, hominin view, zoom/pan reset
- Buttons auto-show when history exists, auto-hide at root with no history
- Back button disables (but Home stays) when at a non-root state with empty stack
- Added i18n keys: `nav_back` / `nav_home` for EN ("Back"/"Home"), HE ("חזרה"/"בית"), RU ("Назад"/"Главная")
- RTL support: buttons mirror to top-right, back arrow flips direction via `scaleX(-1)`
- Mobile layout: buttons move to `bottom:5rem; left:50%` centered
- Light/dark theme styling for buttons
- `applyI18n()` updates button labels and aria-labels on language switch
- `serve.js`: made port configurable via `process.env.PORT || 5555`

## 3. Why These Changes Were Made
Users had no reliable way to step back through navigation states or return to the root tree view without reloading the page. The only "back" existed as a dynamically injected button inside the panel content (panel-to-panel only). This feature adds a consistent, persistent navigation layer across all views.

## 4. Files Touched
- `index.html` — CSS (nav-ctrl styles, light/dark/RTL/mobile), HTML (nav buttons), JS (navStack logic, hooks, i18n keys, applyI18n update)
- `serve.js` — `process.env.PORT` support (minor adjacent improvement)
- `.claude/launch.json` — `autoPort: true` for dev server

## 5. Key Implementation Notes
- `navStack` is separate from the legacy `panelHistory` — panelHistory still powers the dynamic "← Back" button inside panel content for panel-to-panel jumps; navStack tracks cross-view transitions
- `pushNav()` is called **before** state transitions (records current state before change)
- `restoreNavState()` first closes everything, then re-opens to the target state — avoids stale UI
- `closePanel()` does NOT push to navStack (closing is a deliberate forward action, not something you'd "back" into)
- The `currentNavState()` function reads live DOM/state to build snapshot objects
- All functions referenced in navStack code (`getNodeById`, `renderPanelContent`, `HOMININS`, `showHominDetail`, `transform`, `applyT`) are defined before navStack in execution order

## 6. Risks / Caveats
- The mobile `bottom:5rem` positioning may overlap with the timeline or legend on very short viewports — monitor in real device testing
- The panel's `panel-enter` animation class is not re-applied during `restoreNavState` (panel just opens without entrance animation) — acceptable tradeoff for simplicity
- `panelHistory` (legacy) and `navStack` are two parallel stacks — could be unified in future if complexity warrants it
- `closePanel` sets `currentPanelNode=null` which I added; previously it was not cleared, which could leave stale state

## 7. Tests Performed
- Syntax check: `new Function()` on inline script — passes
- Page load: no console errors
- **Back navigation chain**: Tree → Bacteria → Eukaryota → Animals → Back → Back → Back → root. Verified: correct node restored at each step, panel opens/closes correctly, stack grows/shrinks correctly, buttons hide at root
- **Home from deep nav**: 3-deep navigation → Home → everything reset (stack=0, panel closed, hominin closed, zoom/pan to identity)
- **Hominin view**: Open hominin → Back → hominin closes, tree restored
- **Home from hominin+zoom**: Panel → Hominin → manual zoom change → Home → all reset including zoom
- **Hebrew RTL**: Labels show "חזרה"/"בית", buttons mirror to right side, arrow flips via `scaleX(-1)` (matrix confirmed)
- **Russian**: Labels show "Назад"/"Главная", LTR layout
- **English**: Labels "Back"/"Home"
- **Desktop 1400x900**: buttons visible top-left below title

## 8. Not Tested
- Real mobile device / touch interaction with nav buttons
- Mobile bottom-positioned buttons with open panel (potential overlap)
- Keyboard navigation / screen reader with nav buttons
- Hominin species detail → Back → correct hominin state restoration (tested programmatically but not via real click)
- Dark theme visual appearance of nav buttons (CSS is there, not visually verified)

## 9. Known Issues Still Open
- Mobile nav button positioning may need refinement for overlap with bottom panel
- `panelHistory` and `navStack` are two parallel stacks (could be unified)
- Panel content text is still English-only (not i18n) — pre-existing, not introduced by this session

## 10. Recommended Next Step
- Visual polish pass on nav buttons: fine-tune position/size for mobile, test dark theme appearance
- Consider adding keyboard shortcut (e.g. Escape for Back, Shift+Escape for Home)
- Test on real mobile devices

## 11. Suggested Commit Message
feat: add persistent Back and Home navigation buttons with unified history stack

## 12. Suggested PR Title
feat: add Back and Home navigation with cross-view history stack

## 13. Suggested PR Description
## Summary
- Adds persistent Back and Home buttons visible across all views (tree, panel, hominin, compare)
- Back steps to previous navigation state using a client-side history stack
- Home resets to root: closes all panels, resets zoom, clears history
- Fully localized labels in EN, HE, RU with correct RTL arrow mirroring

## Test plan
- [ ] Click nodes to open panels, verify Back/Home buttons appear
- [ ] Navigate through multiple nodes, click Back to step through each
- [ ] Click Home from deep navigation — verify full reset
- [ ] Open hominin view, click Back — verify return to tree
- [ ] Switch to Hebrew — verify RTL mirroring and Hebrew labels
- [ ] Switch to Russian — verify Russian labels
- [ ] Verify no console errors

---

**Branch:** `claude/compassionate-gagarin`
**Worktree:** `C:\Users\GAMER\tree-of-life\.claude\worktrees\compassionate-gagarin`

---

# Session Handoff — Fact Library (prior session)

**Branch:** `claude/tender-greider`
**Status:** done

## 1. Session goal
Implement a structured, reusable loading-subtitle system. Curate a production-ready loading pool from an approved fact library. Wire it into the splash screen with full i18n support.

## 2. What I changed
- Created `js/factLibrary.js` — new IIFE module (`FACTS`) with 18 curated trilingual loading facts
- Added `<script src="js/factLibrary.js">` to `index.html` before the main `<script>` block
- Replaced 5 hardcoded English-only splash taglines in `init()` with `FACTS.getLoadingFact(currentLang)`
- Localized "Growing the tree…" loading spinner text via new `loading_text` translation key (EN/HE/RU)
- Made `serve.js` respect `PORT` env var for dev tooling compatibility

## 3. Why these changes were made
- Loading taglines were English-only (i18n gap for HE/RU users)
- No structured source for facts — scattered inline strings with no IDs, tags, or filtering
- Need a reusable fact pool for future surfaces (discovery cards, quiz, tooltips, timeline)

## 4. Files touched
| File | Change |
|------|--------|
| `js/factLibrary.js` | **NEW** — structured fact library with 18 trilingual loading-safe facts |
| `index.html` | Added script tag; wired splash to FACTS module; localized loader text; added `loading_text` to EN/HE/RU translations |
| `serve.js` | `const port = process.env.PORT \|\| 5555` (was hardcoded 5555) |
| `.claude/launch.json` | Added `autoPort: true` for dev tooling |

## 5. Key implementation notes
- `FACTS` module follows project IIFE pattern with public API: `getLoadingFact(lang)`, `getById(id)`, `getByTag(tag)`, `getLoadingPool()`, `getAll()`
- Each fact has: stable `id` (e.g. `load_01`), `en`/`he`/`ru` text, `tags` array, `loading` boolean
- `currentLang` is already set from localStorage before `init()` runs, so language-aware splash works on first load
- Node `funFact` strings in TREE data are untouched — no duplication, no migration
- The fact library is additive and safe to extend

## 6. Risks / caveats
- Hebrew and Russian translations for the 18 loading facts should be reviewed by native speakers
- The splash header text "3,800,000,000 years of evolution" (line 626) remains English-only hardcoded — not part of this task but worth localizing later
- `showIntro()` function (line 3863) has hardcoded English text — not called in current flow, but should be localized if reactivated

## 7. Tests performed
- App loads without console errors
- FACTS module verified: 18 facts in pool, all 3 languages return correct strings
- Language switching EN → HE → RU → EN: all UI text updates correctly
- Hebrew RTL layout confirmed working
- Russian translation confirmed working
- Search tested ("octopus") — fuzzy search returns correct result
- Tree rendering verified — no visual regressions

## 8. Not tested
- Mobile/touch behavior
- Splash screen tagline visual rendering (splash auto-dismisses in 2.8s, screenshots captured after)
- Offline/cached behavior
- GitHub Pages deployment

## 9. Known issues still open
- `showIntro()` has hardcoded English (not in current flow)
- Splash header "3,800,000,000 years of evolution" not localized
- Node funFacts are English-only (future i18n task)
- Timeline not fully interactive (pre-existing)

## 10. Recommended next step
- Native speaker review of HE/RU loading fact translations
- Extend fact library with domain-tagged facts for discovery cards / node tooltips
- Localize remaining hardcoded English strings (splash header, showIntro)

## 11. Suggested commit message
feat: add structured fact library with trilingual loading subtitles

## 12. Suggested PR title
feat: structured fact library with trilingual loading subtitles

## 13. Suggested PR description
Add a structured, reusable fact library (`js/factLibrary.js`) with 18 curated trilingual facts for the splash screen loading tagline. Replaces 5 hardcoded English-only taglines with language-aware random selection. Also localizes the "Growing the tree…" loading spinner text for EN/HE/RU.
