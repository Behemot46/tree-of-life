# Roadmap — Tree of Life

> Last updated: 2026-03-16

## Completed Milestones

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
| p23 | DNA similarity calculator with species comparison | PR #60 |
| ~~p21~~ | ~~Legend interactivity~~ | Already implemented — `toggleDomain()` + `activeDomains` filtering works |

---

## Upcoming Phases

### Tier 1 — High Priority (foundations & data integrity)

#### p20 — i18n Completeness & Translation Files
**Priority:** High | **Effort:** Small–Medium

- [x] Localize splash screen text — done in p19
- [x] Localize `showIntro()` overlay — done in p19
- [ ] **Split translations into per-language files** (`js/i18n/en.js`, `he.js`, `ru.js`) — cleaner code, faster loads at scale
- [ ] Localize splash header number formatting (comma vs period by locale)
- [ ] Audit remaining hardcoded English in panel content template
- [ ] Native speaker review of HE/RU translations
- [ ] Localize node `desc` / `detail` / `facts` in treeData.js (large — may be its own phase)

#### p21 — JSON Data & Schema Validation
**Priority:** High | **Effort:** Medium
**Why now:** CI safety net at 132 nodes, essential at 1K+

- [ ] Convert `treeData.js` TREE constant to JSON (loaded at init)
- [ ] Define JSON schema for node shape (`id`, `appeared`, `children`, etc.)
- [ ] Add CI validation step (schema check on push)
- [ ] Convert `speciesData.js` maps to JSON where appropriate
- [ ] Validate PHOTO_MAP URLs, WIKI_TITLES keys against node IDs

#### p22 — CI Photo Link Checker
**Priority:** High | **Effort:** Low
**Why now:** Catches URL rot early — same value at any scale

- [ ] GitHub Actions workflow to verify PHOTO_MAP URLs return 200
- [ ] Run weekly or on data file changes
- [ ] Report broken links as PR check / issue

#### p23 — Navigation Stack Unification
**Priority:** High | **Effort:** Small

- [ ] Merge `panelHistory` and `navStack` into a single unified stack
- [ ] Consolidate Back button logic (panel-internal vs global nav)
- [ ] Add keyboard shortcuts: Escape → Back, Shift+Escape → Home
- [ ] Test all navigation paths after unification

---

### Tier 2 — Medium Priority (UX & architecture)

#### p24 — Code Organization & Extraction
**Priority:** Medium | **Effort:** Medium–Large

- [ ] Extract rendering logic from index.html to `js/renderer.js`
- [ ] Extract panel logic to `js/panel.js`
- [ ] Extract navigation/state to `js/navigation.js`
- [ ] Extract search logic to `js/search.js`
- [ ] Keep inline only: HTML structure, CSS, bootstrap/init
- [ ] Ensure extraction doesn't break global scope dependencies

#### p25 — Accessibility (a11y)
**Priority:** Medium | **Effort:** Medium

- [ ] Full keyboard navigation through tree nodes (arrow keys)
- [ ] Screen reader announcements for node focus, panel open/close
- [ ] ARIA tree role on SVG tree structure
- [ ] Focus management: trap focus in panel when open, restore on close
- [ ] Skip-to-content link
- [ ] `prefers-reduced-motion` for all animations (currently 0 matches)
- [ ] High contrast mode testing

#### p26 — Rich Data Panels & Infographics
**Priority:** Medium | **Effort:** Medium–Large

- [ ] Increase font sizes, add descriptive paragraphs
- [ ] Layered data sections (habitat, diet, morphology, fossil record)
- [ ] Inline mini-infographics: size comparisons, range maps
- [ ] Trait radar charts per species
- [ ] Consistent panel visual identity (curated photos / GenAI artwork headers)

#### p27 — Always-Visible Hominin Branch
**Priority:** Medium | **Effort:** Medium

- [ ] Show full hominin family tree expanded on main canvas
- [ ] No "explore deeper" required — visible at all times
- [ ] Auto-layout to avoid crowding
- [ ] Golden path emphasis, larger labels

---

### Tier 3 — Scale & Performance (needed for 1K+ nodes)

#### p28 — Lazy-Loaded Subtrees
**Priority:** Medium (at 132 nodes) → **Critical** (at 1K+) | **Effort:** Medium

- [ ] Load subtree data on demand (expand → fetch children)
- [ ] Chunk large data files by domain/clade
- [ ] Skeleton loading state for expanding nodes
- [ ] Prefetch adjacent subtrees for snappy UX

#### p29 — Inverted Search Index
**Priority:** Low (at 132 nodes) → **Necessary** (at 1K+) | **Effort:** Medium

- [ ] Build inverted index at init from node fields (name, latin, tags, desc)
- [ ] Replace current linear scan with index lookup
- [ ] Maintain fuzzy/bigram matching quality
- [ ] Benchmark: target <10ms search at 1K+ nodes

#### p30 — Viewport Culling (Quadtree)
**Priority:** Low (at 132 nodes) → **Critical** (at 1K+) | **Effort:** High

- [ ] Implement spatial index (quadtree) for visible-area queries
- [ ] Render only nodes within current viewport + buffer zone
- [ ] Update culling on pan/zoom
- [ ] Benchmark: target 60fps at 1K+ nodes

---

### Tier 4 — Low Priority (content & engagement)

#### p31 — Discovery & Engagement Features
**Priority:** Low | **Effort:** Medium

- [ ] Random fact cards on idle (use FACTS library)
- [ ] "Did you know?" tooltip on node hover
- [ ] Quiz mode: "Which domain does X belong to?"
- [ ] Achievement system: "You've explored 50% of the tree"
- [ ] Share a species card (generate image or link)

#### p32 — Data Enrichment (300+ nodes)
**Priority:** Low | **Effort:** Large

- [ ] Add more species (target: 300+ nodes)
- [ ] Add conservation status (IUCN Red List) to node data
- [ ] Add Wikipedia summary fetching for panel enrichment
- [ ] Add iNaturalist observation counts
- [ ] Add fossil record data for extinct species
- [ ] Localize node descriptions to HE/RU

#### p33 — AI-Generated Species Illustrations
**Priority:** Low | **Effort:** Large

- [ ] Generate illustrations using imagePrompts.js prompt library
- [ ] Review generated images for scientific accuracy
- [ ] Host in `assets/species/` directory
- [ ] Wire ImageLoader to prefer local illustrations over Wikimedia URLs
- [ ] Add image attribution metadata

#### p34 — Naturalist Node Artwork
**Priority:** Low | **Effort:** Large

- [ ] Replace SVG silhouettes with pen-and-ink naturalist sketches for all 130+ nodes
- [ ] Build asset pipeline (SVG/WebP format)
- [ ] Consistent art style across all domains
- [ ] Fallback chain integration with ImageLoader

#### p35 — IndexedDB & Offline Mode
**Priority:** Low (at 132 nodes) → **Nice-to-have** (at 1K+) | **Effort:** High

- [ ] Service worker for static asset caching (index.html, JS, fonts)
- [ ] Cache fetched Wikipedia photos in IndexedDB
- [ ] Offline indicator in UI
- [ ] Graceful fallback when APIs fail
- [ ] Ensure service worker doesn't break GitHub Pages deployment

---

## Scaling Readiness Matrix

| # | Change | Effort | Impact at 132 nodes | Impact at 1K+ nodes |
|---|--------|--------|---------------------|---------------------|
| 1 | JSON data + schema validation (p21) | Medium | CI safety net | Essential |
| 2 | Per-language translation files (p20) | Low | Cleaner code | Faster loads |
| 3 | Lazy-loaded subtrees (p28) | Medium | Minimal | Critical |
| 4 | CI link checker for photos (p22) | Low | Catches rot early | Same |
| 5 | Inverted search index (p29) | Medium | Overkill | Necessary |
| 6 | Viewport culling / quadtree (p30) | High | Overkill | Critical |
| 7 | IndexedDB / offline (p35) | High | Overkill | Nice-to-have |

---

## Architectural Principles

1. **No build step** — static files, CDN dependencies only
2. **GitHub Pages compatible** — no server-side logic
3. **Vanilla JS** — no frameworks, no package manager
4. **Incremental extraction** — move logic out of index.html gradually, not all at once
5. **Data-driven** — content in JS data files, rendering logic separate
6. **i18n first-class** — Hebrew RTL is not an afterthought
7. **Museum-quality UX** — polish over features
8. **Scale-aware** — build foundations now that won't block growth to 1K+ nodes

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-10 | Keep all CSS inline in index.html | No build step; external style.css was deleted as dead code |
| 2026-03-11 | Use Inter + JetBrains Mono + Heebo | Modern scientific look; Heebo covers EN/HE/RU |
| 2026-03-12 | SVG silhouette icons over emojis | Consistent cross-platform rendering, professional aesthetic |
| 2026-03-13 | ImageLoader fallback chain | Generated → PHOTO_MAP → emoji; graceful degradation |
| 2026-03-14 | Separate navStack from panelHistory | Quick ship; unification deferred to p23 |
| 2026-03-15 | Roadmap created | Formalize priorities, reduce ad-hoc scope creep |
| 2026-03-16 | Unified roadmap with scaling tiers | Reconciled duplicate phases, integrated data infrastructure priorities |
