# Session Handoff — 2026-03-15

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
