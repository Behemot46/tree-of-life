# Roadmap — Tree of Life

> Last updated: 2026-03-28

## Vision

Make Tree of Life the most **engaging, intuitive, accurate, and fun** phylogenetic explorer on the web. English-only focus. Clear design across desktop and mobile.

---

## Completed Milestones (p-series)

| Phase | Milestone | PR / Branch |
|-------|-----------|-------------|
| p1 | Extract data to external JS files | PR #38 |
| p2 | Fuzzy multilingual search (EN/HE/RU) | `claude/inspiring-burnell` |
| p3 | Main-tree hominin lineage (28 species) | PR #35 |
| p4 | Interactive geological timeline | `claude/epic-mayer` (merged as p11) |
| p6 | Hominin access improvements (floating button, golden ring) | PR #39 |
| p7 | Visual overhaul (Heebo font, photo thumbnails, WCAG contrast) | PR #39 |
| p8 | Dead CSS cleanup (deleted `style.css` + 17 dead rules) | PR #39 |
| p9 | Legacy JS cleanup (deleted 7 dead modules, ~2,800 lines) | PR #39 |
| p10 | Mobile responsiveness (bottom-sheet, touch gestures, pinch-to-zoom) | PR #45 |
| p11 | Interactive timeline + 3 alternate tree views | `claude/epic-mayer` |
| p12 | Modern scientific visual overhaul (Inter/JetBrains, SVG icons, human path) | PR #48 |
| p13a | Back & Home navigation buttons with history stack | PR #51 |
| p13b | Species image system (ImageLoader + AI prompt library + PHOTO_MAP 228 entries) | PR #52 |
| p14 | Inline hominin family tree (28 hominins as tree nodes) | PR #53 |
| p15 | Stabilization & docs (duplicate removal, scope fixes, doc updates) | PR #54 |
| p16 | Inline hominin subtree fixes | PR #55 |
| p17 | Subtree-weighted radial spacing | PR #56 |
| p18 | Fix overlapping header controls | PR #57 |
| p19 | Roadmap, project health, splash/intro i18n | PR #58 |
| p23 | DNA similarity calculator (35 known pairs + LCA estimation model) | PR #60 |

### Features shipped without phase numbers

- **Domain legend interactivity** — `toggleDomain()` / `resetDomains()` with click handlers and "Show All" reset
- **Rich species panels** — Photo hero, funFact, facts table, tags, links, hominin brain/tools/DNA/fossils
- **Procedural SVG illustrations** — `generateSpeciesIllustration()` (440×200 domain-specific SVG)
- **Partial ARIA** — roles, labels on all controls
- **Hominin deep-dive view** — Full-screen view with filtering, timeline cards, compare mode

---

## J-Series — Next Generation

English-only. Focus: clear design, engaging, intuitive, accurate, fun.

### ✅ J1 — Design System Cleanup — **Done** (PR #121)
**Effort:** Small | **Prompt:** `docs/PROMPTS/SPRINT_J1_DESIGN_CLEANUP.md`

- Renamed `--gold` → `--accent`, removed duplicate `--teal`/`--teal-dim` (~60 refs)
- Consolidated duplicate light/dark `#panel` rules
- Defined 13 z-index CSS custom properties, replaced ~30 magic numbers
- Removed 3 dead CSS classes (`.search-result-*`)
- Extracted 7 CSS utility classes from JS `cssText`
- Added `reducedMotion()` JS helper + guards on node/intro animations
- Unified mobile breakpoints: 3 components `600px` → `768px`

### J2 — Navigation & Interaction Polish ✅
**Effort:** Small | **Prompt:** `docs/PROMPTS/SPRINT_J2_NAV_POLISH.md`

- ✅ Unified navigation: `panelHistory`/`panelBack()` removed, all nav through `navStack`/`navBack()`
- ✅ Smooth auto-pan (`smoothPanTo`) on `navigateTo()` and `showMainPanel()`
- ✅ Keyboard: Escape = Back, Shift+Escape = Home, `?` = shortcuts help overlay
- ✅ `navHome()` closes all overlays (DNA, evo-path, trivia, kbd-help)
- ✅ Deleted stale modularized files (core.js, panel.js, renderer.js, search.js)
- ✅ Fixed dead `openHomininView()` → `navigateTo('hominini')`

### ✅ J3 — Code Modularization — **Done**
**Effort:** Large | **Prompt:** `docs/PROMPTS/SPRINT_J3_MODULARIZATION.md`

- Split 4,783-line index.html inline JS → 17 ES modules + state.js
- `<script type="module">` — no build step needed
- Modules: app, state, renderer, layout, panel, navigation, search, timeline, hominin, dnaCalc, evoPath, trivia, playback, zoom, theme, engagement, utils
- Deleted outdated p24 extraction files (core.js + old renderer/panel/search)

### J4 — Accessibility Foundation
**Effort:** Medium | **Prompt:** `docs/PROMPTS/SPRINT_J4_ACCESSIBILITY.md`

- ARIA tree roles on SVG nodes, `aria-expanded`, `aria-selected`
- Arrow-key tree navigation (Up/Down/Left/Right)
- Focus trapping in modals, skip-to-content link
- Touch targets ≥ 44px on mobile
- `aria-live` announcements

### J5 — SVG Performance
**Effort:** Medium | **Prompt:** `docs/PROMPTS/SPRINT_J5_PERFORMANCE.md`

- Viewport culling — only render visible nodes
- GPU compositing with `will-change: transform`
- CSS-class animations instead of inline styles
- rAF-debounced pointer pan
- Target: 60fps with 300+ nodes

### J6 — Discovery & Fun
**Effort:** Medium | **Prompt:** `docs/PROMPTS/SPRINT_J6_ENGAGEMENT.md`

- Progress tracker: "X/132 species discovered"
- 12 unlockable achievements with toast notifications
- Idle fact cards (30s timer)
- Enhanced hover tooltips with funFact data
- Quiz mode: "Which domain?" multiple choice
- Exploration visual cue on visited nodes

### J7 — Data Enrichment
**Effort:** Large | **Prompt:** `docs/PROMPTS/SPRINT_J7_DATA_ENRICHMENT.md`

- Expand tree from 132 → 200+ species
- IUCN conservation status with color-coded badges
- Expand DNA_KNOWN from 36 → 60+ pairs
- Expand FACTS library from 18 → 40+ facts
- Add funFact to all nodes

### J8 — Offline & PWA
**Effort:** Medium | **Prompt:** `docs/PROMPTS/SPRINT_J8_PWA.md`

- Hand-rolled service worker (cache-first for app shell)
- Web app manifest (installable PWA)
- Offline indicator banner
- Stale-while-revalidate for Wikipedia photos

### J9 — Guided Educational Tours
**Effort:** Medium | **Prompt:** `docs/PROMPTS/SPRINT_J9_GUIDED_TOURS.md`

- "From LUCA to You" — 8-step human evolution path
- "The Five Kingdoms" — 7-step domain tour
- "Mass Extinctions" — 7-step timeline tour
- Spotlight overlay + narration cards
- First-visit prompt, "?" button for replay

---

## Execution Order

```
Sprint 1: J1 + J2 (foundation cleanup)
Sprint 2: J3 (modularization)
Sprint 3: J4 (accessibility)
Sprint 4: J5 (performance)
Sprint 5: J6 (engagement)
Sprint 6: J7 (data enrichment)
Sprint 7: J8 (PWA)
Sprint 8: J9 (guided tours)
```

## Deferred (Future Series)

- HE/RU i18n completeness and RTL polish
- Node content localization (desc/detail/facts × 3 languages)
- AI-generated species illustrations pipeline
- Naturalist pen-and-ink node artwork

---

## Architectural Principles

1. **No build step** — static files, CDN dependencies, ES modules natively
2. **GitHub Pages compatible** — no server-side logic
3. **Vanilla JS** — no frameworks, no package manager
4. **Data-driven** — content in JS data files, rendering logic separate
5. **Museum-quality UX** — polish over features
6. **English-first** — i18n infrastructure stays but expansion deferred

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-10 | Keep all CSS inline in index.html | No build step; external style.css was deleted |
| 2026-03-11 | Use Inter + JetBrains Mono + Heebo | Modern scientific look |
| 2026-03-12 | SVG silhouette icons over emojis | Cross-platform consistency |
| 2026-03-13 | ImageLoader fallback chain | Generated → PHOTO_MAP → emoji; graceful degradation |
| 2026-03-14 | Separate navStack from panelHistory | Quick ship; unification deferred to J2 |
| 2026-03-29 | J2: Unified nav stack, deleted stale JS modules | panelHistory/panelBack removed; smooth pan; kbd help overlay |
| 2026-03-15 | Roadmap created | Formalize priorities |
| 2026-03-16 | Unified roadmap with scaling tiers | Reconciled duplicate phases, integrated data infrastructure priorities |
| 2026-03-28 | J-series replaces p-series | Fresh start with 7-agent audit, English-only focus |
| 2026-03-28 | Sprint prompt files per phase | Self-contained session instructions for reproducible execution |
