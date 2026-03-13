# Project Progress — Tree of Life

## Milestones

| # | Milestone | Status | Branch / PR |
|---|-----------|--------|-------------|
| p1 | Extract tree + hominin data to `js/treeData.js` | **Done** | PR #38 (`claude/cool-pascal`) |
| p2 | Fuzzy multilingual search (EN/HE/RU) | **Done** | `claude/inspiring-burnell` |
| p3 | Main-tree hominin lineage access | **Done** | PR #35 (`claude/admiring-wiles`) |
| p4 | Interactive geological timeline | Pending | — |
| p5 | Offline fallback for API failures | Pending | — |
| p6 | Hominin access improvements | **In Progress** | PR #39 (`feature/hominin-access`) |
| p7 | Visual overhaul — font, buttons, icons, timeline, contrast | **In Progress** | `feature/hominin-access` (same branch) |
| p8 | Dead CSS cleanup — delete `style.css` + remove dead inline rules | **In Progress** | `feature/hominin-access` (same branch) |

---

## p2 — Fuzzy Multilingual Search

**Branch:** `claude/inspiring-burnell`
**Commit:** `33e87b7`

### What was added

- **Bigram fuzzy matching** — `_bigramSet()` / `_fuzzyScore()` using Sorensen-Dice coefficient for typo tolerance (threshold 0.35)
- **TAXON_I18N dictionary** — ~130 entries mapping node IDs to Hebrew and Russian translations
- **Multilingual search index** — `buildSearchIndex()` includes Hebrew/Russian names in each entry's haystack
- **Multilingual results display** — shows localized taxon name with English subtitle when searching in non-English language
- **i18n keys** — `search_hint` and `search_no_results` added to inline TRANSLATIONS (en/he/ru)
- **serve.js** — uses `process.env.PORT || 5555` for preview server compatibility

### Files changed

| File | Lines | Summary |
|------|-------|---------|
| `index.html` | +228 | TAXON_I18N dict, fuzzy search algorithm, multilingual display, i18n keys |
| `js/i18n.js` | +9 | Matching search_hint/search_no_results keys (for future external module use) |
| `serve.js` | ~1 | PORT env variable support |

### Verified

- Fuzzy: "mammls" → Mammals, "fungl" → Fungi
- Hebrew: "יונקים" → Mammals, "חיידקים" → Bacteria
- Russian: "Грибы" → Fungi, "Бактерии" → Bacteria
- Zero console errors on load and search interaction

---

## p3 — Main-Tree Hominin Lineage Access

**Branch:** `claude/admiring-wiles` (PR #35, merged)

### What was added

- 28 hominin species connected to main D3.js tree as first-class nodes
- Organized into 4 groups: Proto-Hominins, Australopithecus, Paranthropus, Genus Homo
- Hominin-specific panel: brain volume bar, tools/fire/language badges, fossil sites, DNA introgression
- Hominini branch collapsed by default; expands on click
- Search integration for all hominin species

---

## p6 — Hominin Access Improvements

**Branch:** `feature/hominin-access` (PR #39)

### What was added

1. **Hominini branch node** — added `hominini` node to TREE under great-apes, with homo-sapiens nested as child
2. **Floating "Human Evolution" button** — persistent bottom-right button calling `openHomininView()` directly, with i18n (EN/HE/RU), RTL, light/dark theme support
3. **Golden pulsing ring + "Explore →" badge** — special rendering on hominini node in `render()` with `@keyframes homininGlow`
4. **Panel gateway card for hominini** — prominent gradient card with description + "Explore Human Evolution" button (replaces generic Deep Dive for the hominini node)
5. **i18n keys** — `btn_hominin` added in EN/HE/RU

### Files changed

| File | Changes |
|------|---------|
| `index.html` | CSS (floating button + animation + light/RTL), HTML button, render() gateway, panel upgrade |
| `js/treeData.js` | Added hominini branch node |
| `js/uiData.js` | Added btn_hominin i18n key |

### Verified

- Dark theme, light theme, Hebrew RTL — all working
- Floating button visible and functional
- Golden ring + badge on hominini node
- Panel gateway card with gradient button

---

## p7 — Visual Overhaul

**Branch:** `feature/hominin-access` (same PR #39)

### What was changed

**Phase 1 — Font Migration to Heebo**
- Replaced ~52 `Source Sans 3` inline references → `Heebo`
- Removed Lora and Noto Serif Hebrew from Google Fonts import
- Updated CSS variables: `--font-body`, `--font-sans` → Heebo
- Updated `style.css` font variables and Hebrew font rule
- Heebo handles EN, HE, RU natively (no separate Hebrew font needed)

**Phase 2 — Unified Back/Close Buttons**
- Added `.btn-back` CSS class with dark/light theme variants
- Applied to `#hom-close`, panel close button, panel back button
- Consistent pill-shaped gold-border style across the app

**Phase 3 — Node Icon Enhancement (Emoji → Photo Thumbnails)**
- Nodes with `PHOTO_MAP` entries show circular photo thumbnails with golden border
- Emoji fallback for nodes without photos or on image load error
- `loading="lazy"` for performance

**Phase 4 — Timeline Bar Fixes**
- Slider now visible (`opacity:1`) with custom golden thumb (webkit + moz)
- Taller hit target (18px) for easier interaction
- Extinction markers given `z-index:2`
- Tick labels given increased contrast

**Phase 5 — Contrast Remediation (WCAG AA)**
- Bumped ~20 light theme opacity values for WCAG AA (≥4.5:1) compliance
- Fixed dark theme `.era-tick`, `.p-detail`, `.hp-detail` contrast
- Improved node label opacity at deeper tree levels

### Files changed

| File | Changes |
|------|---------|
| `index.html` | Font refs (52 replacements), CSS variables, `.btn-back` class, photo icon rendering, timeline slider, contrast bumps |

### Verified

- Heebo font on all elements (inspected computed styles)
- Photo thumbnails on PHOTO_MAP nodes, emoji fallback on others
- Timeline slider visible and functional with golden thumb
- `.btn-back` on hom-close and panel close buttons
- Light theme, dark theme, Hebrew RTL, Russian — all working
- Zero console errors

---

## p8 — Dead CSS Cleanup

**Branch:** `feature/hominin-access` (same PR #39)

### What was changed

1. **Deleted `style.css`** (757 lines) — file was never loaded by `index.html` (no `<link>` tag); entirely dead legacy "App B" code
2. **Removed 17 dead inline CSS rules** from index.html `<style>` block:
   - `.tip-fact` light theme override (no element exists)
   - 9 `.era-*` tint classes (`.era-hadean` through `.era-cenozoic`) — never assigned to any HTML element
   - `.search-result-item`, `.search-result-name`, `.search-result-meta` dark overrides — dead classes (actual search uses `.sr-item`)
   - `#shortcuts-hint`, `kbd` dark overrides — overridden by inline `style=""`
   - `#loader` dark override — no `#loader` element exists (splash uses `#splash`)
3. **Updated `deploy-check.yml`** — removed `style.css`, `js/main.js`, `js/api.js`, `js/tree.js` from required files; added `js/treeData.js`, `js/speciesData.js`, `js/uiData.js`
4. **Updated documentation** — CLAUDE.md (repo structure, CSS guidance), docs/ARCHITECTURE.md (removed App B CSS section), PROJECT_PROGRESS.md

### Lines removed

| Item | Lines |
|------|-------|
| `style.css` (deleted) | 757 |
| Dead inline CSS rules | 17 |
| **Total dead CSS eliminated** | **774** |

### Verified

- App loads identically (style.css was never loaded — no visual change)
- Zero console errors
- Dark/light theme toggle working
- Hebrew RTL working
