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
