# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

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
