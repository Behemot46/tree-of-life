# P26 — Rich Data Panels & Visual Identity

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p26** (Tier 2 — Medium Priority).

**Your scope:** Enhance the species detail panel with hero images, richer data sections, larger typography, and inline mini-infographics. You touch `renderPanelContent()`, panel CSS, and image display. You do NOT touch the tree canvas `render()`, node icons, layout functions, legend, navigation stack, or hominin tree structure.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Transform the species panel from a basic info card into a rich, museum-quality educational experience with hero images, collapsible sections, and inline infographics.

### Success Criteria

1. Panel header shows a large hero image (not emoji) with styled fallback
2. Image sourcing: PHOTO_MAP → Wikipedia API → SVG silhouette placeholder
3. Typography: body ≥15px, headings ≥22px, JetBrains Mono for data values
4. Collapsible data sections: Overview, Key Facts, Evolutionary Context, Sub-groups
5. Inline infographics: timeline position bar, trait radar chart (when data available)
6. ENRICHMENT `altFacts` and `links` actually rendered (currently loaded but unused)
7. Panel loads instantly — no blocking API calls
8. Works on mobile bottom-sheet, dark/light themes, RTL
9. Zero console errors

---

## Context

### renderPanelContent(node) — index.html

Builds panel HTML as template string → `p.innerHTML`. Current sections:
1. Hero image (16:9, photo or emoji fallback)
2. Lineage badge
3. Title (name + latin + era)
4. Description (node.desc) — single paragraph
5. Fun fact box
6. Detail paragraph (node.detail)
7. Traits as chips
8. Facts grid (label/value pairs)
9. Sub-groups (children list)
10. Hominin-specific data

### ENRICHMENT (js/speciesData.js)

~46 entries with `altFacts[]` and `links[]`. Patched into `nodeMap` at init. **Currently NOT rendered** — the panel template doesn't use `node.altFacts` or `node.links`. This is a wasted asset.

### ImageLoader (js/imageLoader.js)

Handles fallback chain: PHOTO_MAP → generated → node.img → emoji. Panel should leverage `ImageLoader.getBestUrl()`.

---

## Implementation Plan

### Phase A: Hero image redesign

1. Full-width image at top of panel (below back button)
2. Height: ~200px desktop, ~150px mobile
3. `object-fit: cover` for consistent framing
4. Loading: skeleton shimmer while image loads
5. Fallback: domain-colored gradient + SVG silhouette (from NODE_ICONS)
6. Credit line: "Photo: Wikimedia Commons" or source

### Phase B: Typography overhaul

1. Species name: 26px, font-weight 800
2. Latin name: 15px, italic, muted
3. Body text: 15px, line-height 1.8
4. Facts values: 14px, JetBrains Mono
5. Section headings: 12px uppercase, letter-spacing 0.1em
6. Spacing between sections: 20px

### Phase C: Collapsible sections

1. Pattern: click header → toggle `.collapsed` class
2. Chevron rotation on expand/collapse
3. Sections: Overview (always open), Key Facts, Evolutionary Context, Sub-groups
4. Hominin data as dedicated section when applicable

### Phase D: Inline infographics

1. **Timeline position bar**: thin SVG, marker at `node.appeared` on 3800→0 scale
2. **Trait radar chart**: small SVG (120×120) from numeric facts, domain-colored fill
3. Only render when sufficient data exists — skip gracefully

### Phase E: ENRICHMENT integration

1. Render `node.altFacts` as "Did You Know?" cards
2. Render `node.links` as styled external link pills
3. Check `ENRICHMENT[node.id]` existence before rendering

### Phase F: CSS

- `.panel-section`, `.panel-section-header`, `.panel-section-body` — collapsible
- `.panel-hero`, `.panel-hero-skeleton` — image area
- `.panel-infographic` — SVG containers
- `.panel-link-pill` — external links
- Dark/light and RTL variants

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | `renderPanelContent()` rewrite, panel CSS additions |
| `PROJECT_PROGRESS.md` | Add p26 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` — tree canvas
- `NODE_ICONS` / `getIconGroup()` — but you may READ them for fallback
- Layout functions
- `toggleDomain()` / legend
- `js/treeData.js`, `js/speciesData.js` structure — don't restructure
- `js/imageLoader.js` — don't modify its API

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Click any node → panel with hero image (not emoji)
3. PHOTO_MAP nodes → photo loads, credit shown
4. No-image nodes → styled placeholder with silhouette
5. Sections collapse/expand on click
6. Timeline bar renders for every species
7. ENRICHMENT data shows (try: luca, bacteria, fungi)
8. External links render as pills
9. JetBrains Mono on fact values
10. Dark/light theme — all sections styled
11. Mobile (375px) — bottom-sheet, sections scroll, image not too tall
12. Hebrew RTL — correct layout
13. Panel loads instantly
14. Zero console errors

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p26-rich-panels`
- PR title: `feat: rich data panels with hero images, infographics, and collapsible sections`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p26 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
