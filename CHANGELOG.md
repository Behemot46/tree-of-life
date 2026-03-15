# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

### Added
- Development roadmap (`ROADMAP.md`) with prioritized phases p16+
- Localized `showIntro()` overlay and splash screen text (EN/HE/RU)
- `intro_quote` i18n key for intro overlay
- `splash_years` i18n key for splash header

### Fixed
- `deploy-check.yml` now validates all 6 JS files (was missing factLibrary, imagePrompts, imageLoader)
- `README.md` local dev instructions corrected to use `node serve.js`

---

## 2026-03-14 — p14/p15: Inline Hominins & Stabilization

### Added (p14 — PR #53)
- 28 hominin species rendered as inline tree nodes in 4 groups
- Panel enrichment with paleoanthropology data

### Added (p15 — PR #54)
- `js/factLibrary.js` — structured fact library with 18 trilingual loading facts
- Splash screen wired to `FACTS.getLoadingFact(currentLang)`

### Fixed (p15)
- Removed 168-line duplicate inline PHOTO_MAP shadowing speciesData.js
- Hoisted `fetchWikiPhoto()` to module scope
- Fixed `EXTINCTIONS` variable shadowing in init()

---

## 2026-03-13 — p13a/p13b: Navigation & Image System

### Added (p13a — PR #51)
- Persistent Back and Home navigation buttons with unified history stack
- Cross-view navigation: tree → panel → hominin → back
- i18n labels for nav buttons (EN/HE/RU), RTL mirroring

### Added (p13b — PR #52)
- `js/imageLoader.js` — fallback chain: generated → PHOTO_MAP → emoji
- `js/imagePrompts.js` — AI image prompt library for species illustrations
- PHOTO_MAP expanded to 228 Wikimedia entries

---

## 2026-03-12 — p12: Modern Scientific Visual Overhaul (PR #48)

### Changed
- Color palette: slate backgrounds (#1a1d23), sky-blue accents (#0ea5e9)
- Typography: Inter + JetBrains Mono + Heebo (replacing Playfair Display)
- 20 SVG silhouette icons replacing emoji node rendering
- Loading screen: animated SVG branching tree
- Removed noise overlays, floating particles, glow filters

### Added
- Global label collision detection with human-path priority
- Human evolution path highlighting (LUCA → Homo sapiens)

### Removed
- ~1,000 lines of duplicate inline const declarations

---

## 2026-03-11 — p6–p11: Features & Cleanup (PRs #39, #45)

### Added (p6–p7)
- Floating "Human Evolution" button with golden pulsing ring on hominini node
- Font migration to Heebo, photo thumbnails on tree nodes
- WCAG AA contrast fixes, `.btn-back` unified button style

### Added (p10)
- Mobile responsiveness: bottom-sheet panel, touch gestures, pinch-to-zoom
- Swipe-to-close panel and hominin view
- 3 responsive breakpoints (768px, 480px, landscape)

### Added (p11)
- Interactive timeline: extinction tooltips, era presets, play/animate, species counter
- 3 tree view modes: radial, cladogram, chronological
- View mode toggle UI with i18n

### Removed (p8–p9)
- `style.css` (757 lines, dead code)
- 7 dead legacy JS modules (~2,000 lines)

---

## 2026-03-10 — p1–p3: Foundation (PRs #35, #38)

### Added (p1)
- Extracted TREE, HOMININS, PHOTO_MAP to `js/treeData.js`, `js/speciesData.js`, `js/uiData.js`

### Added (p2)
- Fuzzy multilingual search with bigram matching (Sorensen-Dice)
- TAXON_I18N dictionary (~130 entries for HE/RU)

### Added (p3)
- 28 hominin species as first-class tree nodes in 4 groups
- Hominin-specific panel with brain volume, tools, fossil sites

---

## Baseline — 2026-03-10

> Documented from code audit. This represents the actual state of the codebase
> as of the last merged commit on `main` (d080e7c).

### What exists

**Application (index.html — 1,886 lines)**
- Self-contained monolith: all styles, data, and logic inline
- SVG tree renderer (vanilla JS, no D3) with radial layout
- ~47 hardcoded species/clade nodes (LUCA through Homo sapiens)
- 28 hominin species with brain volume, DNA introgression, fossil sites
- Pan, zoom, drag (mouse + touch + pinch)
- Node collapse/expand on click
- Era slider (0–3,800 Ma) filtering visible nodes
- Click-to-open detail panel: description, facts, tags, image, sub-groups
- Hominin view overlay with 5 filter categories + compare mode (2–4 species)
- Inline search across tree nodes + hominins (substring match on name/latin/tags)
- URL state persistence (`?node=id`)
- Random species button (🎲)
- Keyboard shortcuts: F=search, H=hominin view, R=reset, Esc=close
- i18n: English, Hebrew, Russian (inline TRANSLATIONS object, ~40 keys each)
- RTL layout for Hebrew (CSS `[dir="rtl"]` rules)
- Dark/light theme toggle (CSS custom properties, localStorage)
- Particles animation (22 floating particles)
- Intro animation (3.2 s fade-in on first load)

**Modular JS system (js/*.js + style.css — non-functional)**
- api.js: Open Tree of Life, Wikipedia, iNaturalist API clients + LRU cache
- tree.js: D3 v7 radial/cladogram renderer (loads, crashes on init — DOM missing)
- panel.js: 4-tab detail panel (loads, crashes — DOM missing)
- search.js: OTL autocomplete search (loads, crashes — DOM missing)
- timeline.js: Geological timeline bar (loads, crashes — DOM missing)
- i18n.js: data-i18n attribute system (loads, applyAll() finds no elements)
- main.js: orchestrator (crashes immediately — all DOM targets missing)
- style.css: 757-line stylesheet targeting App B classes (loaded but mostly unused)

**Infrastructure**
- GitHub Actions deploy to GitHub Pages on push to main
- serve.js local dev server

### Known gaps at baseline

1. App B (js/*.js) is entirely dead — wrong DOM structure
2. Two duplicate i18n systems with different keys/mechanisms
3. Two duplicate tree datasets in incompatible schemas
4. Legend domain highlight not implemented (App A)
5. No Wikipedia/iNaturalist enrichment in App A (all data hardcoded)
6. No fuzzy or transliterated search
7. Hominins not connected to main tree graph
8. index.html is a 1,886-line monolith

---

## Prior commits (from git log, reconstructed)

| Commit | Message |
|---|---|
| d080e7c | Merge claude/pedantic-lovelace: museum-quality overhaul |
| 80af684 | Museum-quality overhaul: accessibility, theming, data expansion, bug fixes |
| e563380 | Merge claude/pedantic-lovelace: v4 features + i18n + theme toggle |
| f81b9ba | Merge v4: add i18n (EN/HE/RU), theme toggle, full feature set |
| 1e9f7e8 | Fix layout, add i18n EN/HE/RU support |
