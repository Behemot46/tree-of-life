# Roadmap — Tree of Life

> Last updated: 2026-03-15

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

---

## Upcoming Phases

### p16 — i18n Completeness & Polish
**Priority:** High — gaps are user-facing
**Effort:** Small–Medium

- [ ] Localize splash screen text ("3,800,000,000 years of evolution", "Tree of Life")
- [ ] Localize `showIntro()` overlay (3 hardcoded English strings)
- [ ] Localize splash header number formatting (comma vs period by locale)
- [ ] Audit remaining hardcoded English in panel content template
- [ ] Native speaker review of HE/RU translations (especially loading facts)
- [ ] Localize node `desc` / `detail` / `facts` in treeData.js (large effort — may be its own phase)

### p17 — Legend Interactivity
**Priority:** Medium — decorative-only legend is a UX gap
**Effort:** Small

- [ ] Click domain in legend → highlight/filter that domain's subtree
- [ ] Active state styling on legend items
- [ ] "Show all" reset behavior
- [ ] Ensure highlight works across all 3 view modes (radial, cladogram, chronological)

### p18 — Navigation Stack Unification
**Priority:** Medium — two parallel stacks is technical debt
**Effort:** Small

- [ ] Merge `panelHistory` and `navStack` into a single unified stack
- [ ] Consolidate Back button logic (panel-internal vs global nav)
- [ ] Add keyboard shortcuts: Escape → Back, Shift+Escape → Home
- [ ] Test all navigation paths after unification

### p19 — Offline Resilience
**Priority:** Medium — GitHub Pages users on flaky connections
**Effort:** Medium

- [ ] Add service worker for static asset caching (index.html, JS files, fonts)
- [ ] Graceful fallback when Wikipedia photo API fails (already partially handled by ImageLoader)
- [ ] Cache fetched Wikipedia photos in IndexedDB or service worker cache
- [ ] Add offline indicator in UI
- [ ] Ensure service worker doesn't break GitHub Pages deployment

### p20 — Performance & Code Organization
**Priority:** Medium — index.html at 4,012 lines is maintenance risk
**Effort:** Medium–Large

- [ ] Extract rendering logic from index.html to `js/renderer.js`
- [ ] Extract panel logic to `js/panel.js`
- [ ] Extract navigation/state to `js/navigation.js`
- [ ] Extract search logic to `js/search.js`
- [ ] Keep inline only: HTML structure, CSS, bootstrap/init
- [ ] Ensure extraction doesn't break global scope dependencies
- [ ] Profile rendering performance (130+ nodes, DocumentFragment pattern)
- [ ] Lazy-load hominin data only when needed

### p21 — Accessibility (a11y)
**Priority:** Medium — partially addressed in p7/p10
**Effort:** Medium

- [ ] Full keyboard navigation through tree nodes (arrow keys)
- [ ] Screen reader announcements for node focus, panel open/close
- [ ] ARIA tree role on SVG tree structure
- [ ] Focus management: trap focus in panel when open, restore on close
- [ ] Skip-to-content link
- [ ] Reduced motion: respect `prefers-reduced-motion` for all animations
- [ ] High contrast mode testing

### p22 — Discovery & Engagement Features
**Priority:** Low — nice-to-have, extends fact library
**Effort:** Medium

- [ ] Random fact cards on idle (use FACTS library)
- [ ] "Did you know?" tooltip on node hover (use node `funFact` strings)
- [ ] Quiz mode: "Which domain does X belong to?"
- [ ] Achievement system: "You've explored 50% of the tree"
- [ ] Share a species card (generate image or link)

### p23 — Data Enrichment
**Priority:** Low — content quality improvement
**Effort:** Large

- [ ] Add more species (target: 300+ nodes)
- [ ] Add conservation status (IUCN Red List) to node data
- [ ] Add Wikipedia summary fetching for panel enrichment
- [ ] Add iNaturalist observation counts
- [ ] Add fossil record data for extinct species
- [ ] Localize node descriptions to HE/RU (large translation effort)

### p24 — AI-Generated Species Illustrations
**Priority:** Low — infrastructure exists (imagePrompts.js), needs execution
**Effort:** Large (generation + review + hosting)

- [ ] Generate illustrations using imagePrompts.js prompt library
- [ ] Review generated images for scientific accuracy
- [ ] Host in `assets/species/` directory
- [ ] Wire ImageLoader to prefer local illustrations over Wikimedia URLs
- [ ] Add image attribution metadata

---

## Architectural Principles

1. **No build step** — static files, CDN dependencies only
2. **GitHub Pages compatible** — no server-side logic
3. **Vanilla JS** — no frameworks, no package manager
4. **Incremental extraction** — move logic out of index.html gradually, not all at once
5. **Data-driven** — content in JS data files, rendering logic separate
6. **i18n first-class** — Hebrew RTL is not an afterthought
7. **Museum-quality UX** — polish over features

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-10 | Keep all CSS inline in index.html | No build step; external style.css was deleted as dead code |
| 2026-03-11 | Use Inter + JetBrains Mono + Heebo | Modern scientific look; Heebo covers EN/HE/RU |
| 2026-03-12 | SVG silhouette icons over emojis | Consistent cross-platform rendering, professional aesthetic |
| 2026-03-13 | ImageLoader fallback chain | Generated → PHOTO_MAP → emoji; graceful degradation |
| 2026-03-14 | Separate navStack from panelHistory | Quick ship; unification deferred to p18 |
| 2026-03-15 | Roadmap created | Formalize priorities, reduce ad-hoc scope creep |
