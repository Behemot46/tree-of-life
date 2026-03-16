# Prompt Library — Tree of Life

> Last updated: 2026-03-16

Self-contained implementation prompts. Each can be activated standalone.
Say **"run p29"** or **"run tier 1"** to execute.

---

## Tier 1 — High Priority (foundations & data integrity)

| File | Phase | Title |
|------|-------|-------|
| `PROMPT_P20_I18N_COMPLETENESS.md` | p20 | i18n Completeness & Translation Files |
| `PROMPT_P21_JSON_SCHEMA.md` | p21 | JSON Data & Schema Validation |
| `PROMPT_P22_CI_PHOTO_CHECKER.md` | p22 | CI Photo Link Checker |
| `PROMPT_P23_NAV_STACK.md` | p23 | Navigation Stack Unification |

**Parallel-safe:** p20, p21, p22 can run concurrently (no file overlap). p23 touches `index.html` — run alone or after p20.

---

## Tier 2 — Medium Priority (UX & architecture)

| File | Phase | Title |
|------|-------|-------|
| `PROMPT_P24_CODE_ORGANIZATION.md` | p24 | Code Organization & Extraction |
| `PROMPT_P25_ACCESSIBILITY.md` | p25 | Accessibility (a11y) |
| `PROMPT_P26_RICH_PANELS.md` | p26 | Rich Data Panels & Visual Identity |
| `PROMPT_P27_HOMININ_BRANCH.md` | p27 | Always-Visible Hominin Branch |

**Parallel-safe:** p26 + p27 can run concurrently (panel vs canvas). p24 is a major refactor — run alone. p25 depends on p24 if extraction happened.

---

## Tier 3 — Scale & Performance (needed for 1K+ nodes)

| File | Phase | Title |
|------|-------|-------|
| `PROMPT_P28_LAZY_SUBTREES.md` | p28 | Lazy-Loaded Subtrees |
| `PROMPT_P29_INVERTED_SEARCH.md` | p29 | Inverted Search Index |
| `PROMPT_P30_VIEWPORT_CULLING.md` | p30 | Viewport Culling (Quadtree) |

**Parallel-safe:** p29 can run with p28 or p30 (search vs render). p28 + p30 both touch `render()` — run sequentially.

---

## Tier 4 — Low Priority (content & engagement)

| File | Phase | Title |
|------|-------|-------|
| `PROMPT_P31_DISCOVERY.md` | p31 | Discovery & Engagement Features |
| `PROMPT_P32_DATA_ENRICHMENT.md` | p32 | Data Enrichment (300+ Nodes) |
| `PROMPT_P33_AI_ILLUSTRATIONS.md` | p33 | AI-Generated Species Illustrations |
| `PROMPT_P34_NATURALIST_ART.md` | p34 | Naturalist Node Artwork |
| `PROMPT_P35_OFFLINE.md` | p35 | IndexedDB & Offline Mode |

**Parallel-safe:** p32 + p33 + p34 all touch different files. p31 touches factLibrary + index.html. p35 is standalone.

---

## Archive (completed or superseded)

| File | Original Phase | Status |
|------|----------------|--------|
| `archive/PROMPT_P23_DNA_CALCULATOR.md` | p23 (old) | Done — PR #60 |
| `archive/PROMPT_P25_LEGEND_HIGHLIGHTING.md` | p25 (old) | Done — already implemented |
| `archive/OLD_P20_NODE_ARTWORK.md` | p20 (old) | Superseded by p34 |
| `archive/OLD_P21_PANEL_VISUALS.md` | p21 (old) | Superseded by p26 |
| `archive/OLD_P22_RICH_DATA_PANELS.md` | p22 (old) | Superseded by p26 |
| `archive/OLD_P24_HOMININ_BRANCH.md` | p24 (old) | Superseded by p27 |
| `archive/OLD_P26_FACTS_INTEGRATION.md` | p26 (old) | Superseded by p31 |
| `PROMPT_00_baseline_audit.md` | — | Baseline audit |
| `PROMPT_00_DOCUMENTATION.md` | — | Documentation setup |
| `PROMPT_0_AUDIT.md` | — | Initial audit |

---

## Session Closing Protocol (all phases)

Every session MUST end by:

1. **Commit** with descriptive prefix (`feat:`, `fix:`, `refactor:`, `perf:`, `a11y:`, `data:`, `docs:`)
2. **Push** branch to origin
3. **Open PR** against `main` via `gh pr create`
4. **Verify** PR is mergeable — resolve any conflicts with main
5. **Update** `PROJECT_PROGRESS.md` — add phase to Completed table
6. **Update** `SESSION_HANDOFF.md` — full handoff notes
7. **Verify** zero console errors in browser
