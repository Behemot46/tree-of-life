# Panel Photo Flash-Then-Revert Fix

**Date:** 2026-04-07
**Status:** Approved
**Files:** `js/panel.js`

## Problem

When opening a species info panel, the hero photo often appears for a fraction of a second and then reverts to an emoji fallback. Affects many species across the tree.

## Root Cause

In `js/panel.js` `renderPanelContent()` (lines ~658–684), after the static photo loads successfully via `imgEl.src = staticUrl`, the code unconditionally calls `fetchWikiPhoto(node.id, wikiTitle, imgEl, fbEl, crEl)`. That function reassigns `imgEl.src` to a Wikipedia REST API thumbnail. Three failure modes:

1. **Stale `onerror`:** the `imgEl.onerror` handler installed for the static URL (line 667) is never cleared. When the wiki URL fails (404, CORS, network), that handler fires and hides the already-working static image.
2. **Unconditional override:** even when PHOTO_MAP has a perfectly good URL, the wiki request races against it and can replace it with a worse or broken result.
3. **6-second timeout race:** `setTimeout` (line 673) checks `imgEl.complete || naturalWidth === 0` without distinguishing "never loaded" from "currently mid-reload after wiki overwrite", and can hide a successful image.

`fetchWikiPhoto` was a secondary upgrade path from before PHOTO_MAP reached 100% node coverage. It is now obsolete and harmful.

## Fix

Remove `fetchWikiPhoto` and its supporting scaffolding entirely. Rely on the existing static URL chain (PHOTO_MAP → generated → `node.img`), which already covers all 132 nodes.

### Changes to `js/panel.js`

1. **Remove module-scope photo cache scaffolding** (lines ~39–95):
   - `_PHOTO_LS_KEY`, `_PHOTO_TTL_MS` constants
   - `restorePhotoCache` IIFE
   - `window._photoCache`, `window._failedPhotos` globals
   - `_savePhotoCache` exported function
   - `fetchWikiPhoto` exported async function
2. **Remove `WIKI_TITLES` from the import on line 8** (no other consumers in `panel.js`). Leave `WIKI_TITLES` itself defined in `speciesData.js` and re-exported from `data.js` — out of scope.
3. **Simplify the image-load block at lines ~658–684** in `renderPanelContent()`:
   - Drop the line that checks `window._failedPhotos.has('static:' + node.id)` (line 499) — the failed-photos set is gone.
   - Drop the `if (wikiTitle)` block that calls `fetchWikiPhoto`.
   - Use a local `loadedOnce` flag, set in `imgEl.onload`, so the 6-second timeout only hides the image if no successful load ever occurred.
   - `onload`: reveal `imgEl`, hide `fbEl`, set `loadedOnce = true`.
   - `onerror`: hide `imgEl`, show `fbEl`.
4. **One-shot localStorage cleanup** at module load: `try { localStorage.removeItem('tol-photo-cache'); } catch(e) {}` to tidy up stale cache entries from prior versions. Add a brief comment.

### No changes elsewhere

- `WIKI_TITLES` data: leave alone.
- `ImageLoader`: no changes.
- Tree node rendering: unaffected (uses ImageLoader directly, not `fetchWikiPhoto`).

## Testing

Manual smoke test in browser at `http://localhost:5555`:

1. Open panels for: humans, blue-whale, a microbe (e.g. e-coli), a hominin (e.g. neanderthal), a plant (e.g. oak), a fungus.
2. Verify the photo appears within ~1s and **stays** — no flash-revert.
3. Verify console has no errors related to photo loading.
4. Verify nodes without any photo source still show the emoji fallback (try a deep taxonomic group if any lacks PHOTO_MAP coverage).
5. Test all three languages (`?lang=en`, `?lang=he`, `?lang=ru`) to confirm no regression.

## Risk

**Low.** PHOTO_MAP has 100% node coverage. The removed code path was the bug source. No other module imports `fetchWikiPhoto`, `_savePhotoCache`, `_photoCache`, or `_failedPhotos` (verified via grep).

## Out of Scope

- Removing `WIKI_TITLES` data and its export chain.
- Refactoring `ImageLoader` itself.
- Offline resilience (separate concern, see `docs/PROMPTS/PROMPT_P31_OFFLINE_RESILIENCE.md`).
