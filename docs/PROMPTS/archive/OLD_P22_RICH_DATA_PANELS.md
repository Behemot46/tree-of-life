# P22 — Rich Data Panels & Infographics

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p22** as part of a parallel batch (p22 + p24 + p25 run concurrently in separate worktrees).

**Your scope:** Enhance the species detail panel (`renderPanelContent()`) with richer data, larger fonts, descriptive paragraphs, and inline mini-infographics. You touch `renderPanelContent()`, panel CSS, and species data enrichment. You do NOT touch the tree canvas `render()`, node icons, layout functions, legend, or hominin tree structure.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make the species detail panel a rich, educational experience — larger readable text, multi-section data layers, and inline visual infographics for each species.

### Success Criteria

1. Panel text is significantly larger and more readable (body text ≥14px, headings ≥20px)
2. Each species panel has expanded descriptive content — not just a one-liner but contextual paragraphs
3. Data is organized into clear collapsible sections: Overview, Habitat & Range, Morphology, Fossil Record (where applicable), Evolutionary Significance
4. Inline mini-infographics where data exists:
   - **Size comparison**: simple SVG bar or silhouette showing relative size (e.g., vs human height)
   - **Trait radar chart**: small SVG radar/spider chart for key attributes (e.g., brain size, speed, lifespan)
   - **Timeline position**: mini horizontal bar showing when this species appeared relative to Earth's history
5. Facts grid uses JetBrains Mono for data values (consistent with scientific theme)
6. Panel scrolls smoothly, loads instantly (no API calls for new data — all data inline)
7. Works on mobile bottom-sheet panel (max-height 75vh)
8. Dark/light themes both look polished
9. RTL (Hebrew) layout correct
10. Zero console errors

---

## Context: Current Panel Implementation

### renderPanelContent(node) — index.html ~line 2599

Builds panel HTML as a template string → `p.innerHTML`. Current sections:
1. Hero image (16:9 aspect, photo or emoji fallback) — ~lines 2620-2636
2. Lineage badge (Human Lineage / Great Apes) — ~lines 2638-2646
3. Title (name + latin + era + appeared) — ~lines 2647-2654
4. Description (`node.desc`) — single `<p>` tag, 14px — ~line 2655
5. Fun fact box — ~lines 2656-2660
6. Detail paragraph (`node.detail`) — ~line 2661+
7. Traits as chips (`node.tags`) — small pill badges
8. Facts grid (`node.facts` as `[{l, v}]` pairs) — two-column grid
9. Sub-groups (children list with onclick)
10. Hominin-specific: brain volume bar, tools/fire/language, DNA introgression, fossil sites

### Node data shape (in js/treeData.js)

```js
{
  id, icon, color, r, appeared, name, latin, era,
  desc,     // 1-2 sentence description
  detail,   // longer paragraph
  facts,    // [{l:'Label', v:'Value'}, ...]
  tags,     // ['trait1', 'trait2', ...]
  children, // nested nodes
  extinct   // boolean (optional)
}
```

### ENRICHMENT data (js/speciesData.js)

Already exists with `altFacts[]` and `links[]` for many species. Currently underutilized in the panel.

### Key constraints

- All data must be inline (no API calls) — panel must render instantly
- Panel HTML is a single template string in `renderPanelContent()`
- Mobile: panel is a bottom-sheet (translateY animation, 75vh max)
- Touch: swipe-down to close

---

## Implementation Plan

### Phase A: Typography & spacing overhaul

1. **Increase base font sizes** in panel:
   - Species name: 22px → 26px, font-weight 800
   - Latin name: 13px → 15px
   - Body text (desc, detail): 14px → 15px, line-height 1.8
   - Facts values: 13px → 14px, use `font-family:'JetBrains Mono',monospace`
   - Section headings: add explicit section headers at 12px uppercase, letter-spacing 0.1em
2. **Improve spacing**: increase gap between sections from 16px to 20px
3. **Era/appeared line**: slightly larger, add a colored dot matching domain color

### Phase B: Expandable data sections

1. Add collapsible section pattern — click header to expand/collapse:
   ```html
   <div class="panel-section">
     <div class="panel-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
       <span>Section Title</span>
       <span class="panel-chevron">▼</span>
     </div>
     <div class="panel-section-body">...content...</div>
   </div>
   ```
2. CSS: `.panel-section.collapsed .panel-section-body { display: none; }` with smooth transition
3. Sections to add:
   - **Overview** (always open): desc + detail + fun fact
   - **Key Facts** (open by default): facts grid + tags
   - **Evolutionary Context**: ENRICHMENT.altFacts, links, timeline position mini-graphic
   - **Sub-groups** (if children exist): clickable list of children
   - **Hominin Data** (if applicable): brain volume, tools, etc.

### Phase C: Inline infographics

1. **Timeline position bar** — appears for every species:
   - Thin horizontal SVG bar (width 100%, height 24px)
   - Left = 3800 Mya (LUCA), right = 0 (now)
   - A marker dot at `node.appeared` position
   - Label: "Appeared ~X Mya"
   - Color matches the node's domain color
   - Simple proportional positioning: `x = (1 - appeared/3800) * 100%`

2. **Trait radar chart** — appears when node has ≥3 facts with numeric values:
   - Small SVG (120x120px) radar/spider chart
   - Axes from node.facts where values are numeric or can be mapped to a scale
   - Filled polygon with translucent domain color
   - If insufficient numeric data, skip gracefully

3. **Size comparison** (optional, only if data exists):
   - For species with body-length/height data in facts, show a simple proportional bar vs human (1.8m)
   - SVG with two silhouettes or bars at relative scale

### Phase D: Enrichment integration

1. **ENRICHMENT.altFacts**: Render as a "Did You Know?" carousel or stacked cards below the main description
2. **ENRICHMENT.links**: Render as styled external link pills (icon + label + → arrow)
3. Check if ENRICHMENT data exists for this species via `ENRICHMENT[node.id]`

### Phase E: CSS for new components

Add to the `<style>` block in index.html:
- `.panel-section`, `.panel-section-header`, `.panel-section-body` — collapsible sections
- `.panel-section-header:hover` — highlight on hover
- `.panel-chevron` rotation transition
- `.panel-infographic` — container for SVG infographics
- `.panel-timeline-bar` — horizontal timeline
- `.panel-link-pill` — external link buttons
- Dark/light theme variants for all new classes
- RTL adjustments if needed

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | `renderPanelContent()` — add sections, infographics, enlarged typography. Panel CSS in `<style>` block — new component classes. |
| `PROJECT_PROGRESS.md` | Add p22 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` function (tree canvas) — that's p20's scope
- `NODE_ICONS` / `getIconGroup()` — that's p20's scope
- `buildHomininTree()` / hominin tree structure — that's p24's scope
- `toggleDomain()` / `resetDomains()` / legend — that's p25's scope
- `js/treeData.js` — don't restructure the TREE data
- `js/speciesData.js` — don't modify PHOTO_MAP structure
- `js/imageLoader.js` — don't modify

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Click any tree node → panel opens with larger, readable text
3. Section headers are visible; click to collapse/expand
4. Timeline position bar renders for every species
5. ENRICHMENT data shows for species that have it (try: luca, bacteria, fungi)
6. External links render as styled pills
7. Facts grid uses JetBrains Mono for values
8. Hominin species show brain volume, tools, DNA data in dedicated section
9. Toggle dark/light theme — all sections styled correctly
10. Mobile viewport (375px) — panel as bottom-sheet, all sections scroll
11. Hebrew RTL — sections layout correctly
12. Russian — text renders correctly
13. Swipe-down to close still works on mobile
14. Panel loads instantly (no spinner, no API wait)
15. Zero console errors

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p22-rich-panels`
- PR title: `feat: rich data panels with infographics, sections, and larger typography`
- PR against `main`

---

## Documentation Updates

### PROJECT_PROGRESS.md

Add to the Completed table:
```
| p22 | Rich data panels & infographics — sections, timeline bar, typography | PR #XX |
```

Change status in Upcoming table from `Pending` to `Done`.

### SESSION_HANDOFF.md

Write a complete handoff with:
- What was done (summary)
- New panel section structure
- Which infographics were implemented
- Current state (branch, PR, clean/dirty)
- Known issues or follow-up items
