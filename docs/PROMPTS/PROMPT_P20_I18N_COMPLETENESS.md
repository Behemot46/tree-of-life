# P20 — i18n Completeness & Translation Files

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p20** (Tier 1 — High Priority).

**Your scope:** Complete the internationalization layer — split translations into per-language files, audit hardcoded English, fix number formatting, and improve HE/RU translation quality. You touch `js/uiData.js`, create new `js/i18n/` files, and update `index.html` i18n wiring. You do NOT touch tree rendering, layout, panel infographics, or any visual features.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make the i18n system production-ready: cleaner code, faster loads at scale, zero hardcoded English in UI, and natural-sounding HE/RU translations.

### Success Criteria

1. Translations split into `js/i18n/en.js`, `js/i18n/he.js`, `js/i18n/ru.js` — loaded on demand or statically
2. `TRANSLATIONS` object in `js/uiData.js` replaced by imports from per-language files
3. Splash header number formatting respects locale (comma vs period vs space)
4. Zero hardcoded English strings in panel content template or UI controls
5. All existing i18n keys preserved — no regressions
6. `t()` and `applyI18n()` work exactly as before
7. Works in all 3 languages with correct RTL for Hebrew
8. Zero console errors

---

## Context

### Current i18n architecture

- `TRANSLATIONS` in `js/uiData.js` — single object with `en`, `he`, `ru` sub-objects (~200+ keys each)
- `t(key)` returns `TRANSLATIONS[currentLang][key] || TRANSLATIONS.en[key]`
- `applyI18n()` iterates element IDs calling `set(id, value)` to update textContent
- `setLang(lang)` sets `currentLang`, updates `localStorage`, sets `dir="rtl"` for Hebrew
- Language stored in `localStorage` key `tol-lang`
- Some strings still hardcoded in `renderPanelContent()` template

### Known hardcoded English

- Panel "Sub-groups" section header
- Panel "Appeared ~X Mya" formatting
- Compare mode labels
- Extinct badge text "Extinct"
- Some DNA calculator labels (check after p23 merge)
- Number formatting uses JS default `.toLocaleString()` without explicit locale

---

## Implementation Plan

### Phase A: Create per-language files

1. Create directory `js/i18n/`
2. Extract `TRANSLATIONS.en` → `js/i18n/en.js` exporting `const LANG_EN = { ... }`
3. Extract `TRANSLATIONS.he` → `js/i18n/he.js` exporting `const LANG_HE = { ... }`
4. Extract `TRANSLATIONS.ru` → `js/i18n/ru.js` exporting `const LANG_RU = { ... }`
5. Update `js/uiData.js` to construct `TRANSLATIONS` from the three imports:
   ```js
   const TRANSLATIONS = { en: LANG_EN, he: LANG_HE, ru: LANG_RU };
   ```
6. Add `<script src="js/i18n/en.js">`, `he.js`, `ru.js` to `index.html` BEFORE `uiData.js`

### Phase B: Audit and fix hardcoded English

1. Search `index.html` for string literals in `renderPanelContent()` template
2. Extract each to a `t()` key
3. Add corresponding HE/RU translations
4. Check `toggleCompareMode()`, `closeCompare()`, DNA calculator labels
5. Check tooltip text, breadcrumb text, error messages

### Phase C: Locale-aware number formatting

1. Create helper: `function formatNumber(n) { return n.toLocaleString(currentLang === 'he' ? 'he-IL' : currentLang === 'ru' ? 'ru-RU' : 'en-US'); }`
2. Apply to splash header "3,800,000,000"
3. Apply to panel "Appeared ~X Mya" values
4. Apply to DNA similarity percentages
5. Apply to species count display

### Phase D: Translation quality review

1. Review all HE translations for natural phrasing
2. Review all RU translations for natural phrasing
3. Ensure scientific terms use standard terminology in each language
4. Verify RTL punctuation (Hebrew colon, parentheses, numbers)

---

## Files You Will Create/Modify

| File | What changes |
|------|-------------|
| `js/i18n/en.js` | **NEW** — English translations |
| `js/i18n/he.js` | **NEW** — Hebrew translations |
| `js/i18n/ru.js` | **NEW** — Russian translations |
| `js/uiData.js` | Remove inline TRANSLATIONS content, import from i18n files |
| `index.html` | Add 3 `<script>` tags, fix hardcoded strings, add `formatNumber()` |
| `PROJECT_PROGRESS.md` | Add p20 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` — tree canvas rendering
- `renderPanelContent()` structure — only add `t()` calls to existing strings
- `js/treeData.js` — tree data
- `js/factLibrary.js` — facts system
- `js/imageLoader.js` — image system

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Default language loads correctly (English)
3. Switch to Hebrew (`?lang=he`) — all UI text in Hebrew, RTL layout correct
4. Switch to Russian (`?lang=ru`) — all UI text in Russian
5. Splash screen number formatted with locale separators
6. Open species panel — no English strings leak through in HE/RU
7. DNA calculator labels translated
8. Compare mode labels translated
9. Extinct badge text translated
10. Panel "Appeared ~X Mya" uses localized number
11. `t('any_key')` returns correct string for each language
12. Toggle languages multiple times — no stale text
13. Zero console errors
14. Performance: page load time not degraded by extra script files

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p20-i18n-completeness`
- PR title: `feat: split translations into per-language files and fix hardcoded English`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p20 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
