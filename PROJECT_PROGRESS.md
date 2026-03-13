# Project Progress — Tree of Life

## Milestones

| # | Milestone | Status | Branch / PR |
|---|-----------|--------|-------------|
| p1 | Extract tree + hominin data to `js/treeData.js` | **Done** | PR #38 (`claude/cool-pascal`) |
| p2 | Fuzzy multilingual search (EN/HE/RU) | **Done** | `claude/inspiring-burnell` |
| p3 | Main-tree hominin lineage access | **Done** | PR #35 (`claude/admiring-wiles`) |
| p4 | Interactive geological timeline | Pending | — |
| p5 | Offline fallback for API failures | Pending | — |
| p6 | Hominin access improvements | **Done** | PR #39 (`feature/hominin-access`) |
| p7 | Visual overhaul — font, buttons, icons, timeline, contrast | **Done** | `feature/hominin-access` (same branch) |
| p8 | Dead CSS cleanup — delete `style.css` + remove dead inline rules | **Done** | `feature/hominin-access` (same branch) |
| p9 | Legacy JS cleanup — delete 7 dead App B modules | **Done** | `feature/hominin-access` (same branch) |
| p10 | Mobile Responsiveness | **Done** | `claude/inspiring-shockley` |

---

## p10 — Mobile Responsiveness

**Branch:** `claude/inspiring-shockley`

### What was added

#### CSS — 3 responsive breakpoints (768px, 480px, landscape)

- **Detail panel → bottom-sheet** on mobile: slides up from bottom with 16px rounded corners, swipe handle, 75vh max-height
- **Touch targets enlarged** to WCAG 44px minimum: zoom buttons (.zbtn), close button (.p-close), lang buttons, theme button, hominin close
- **Search bar full-width** on mobile: stretches edge-to-edge below header, buttons wrap naturally
- **Header compact**: hint bar hidden, title/subtitle shrunk, no overlap with controls
- **Breadcrumb hidden** on mobile (too narrow for path display)
- **Legend collapsible** on mobile: tap "Domains" title to expand/collapse, starts collapsed
- **Hominin view stacks vertically**: species list full-width, detail panel below (was side-by-side)
- **Hominin filters** scroll horizontally (nowrap + overflow-x) instead of wrapping badly
- **Timeline compact**: reduced padding, smaller tick labels, taller slider hit area
- **Tooltip hidden** on mobile (touch devices use panel instead)
- **Compare grid** single-column on mobile
- **480px ultra-small**: lang switcher hidden, legend hidden, title-sub hidden, panel facts single-column
- **Landscape mobile** (max-height:500px): reduced panel/timeline heights

#### CSS — Light theme + RTL compatibility

- Panel bottom-sheet overrides work for both `[data-theme="light"]` and `[dir="rtl"]`
- RTL panel uses same translateY bottom-sheet behavior

#### JS — Touch interaction enhancements

- **Swipe-to-close panel**: drag panel down >80px to dismiss (with live drag tracking)
- **Swipe-to-close hominin view**: swipe right (LTR) or left (RTL) >100px to dismiss
- **Pinch-to-zoom**: two-finger gesture on SVG canvas with center-point zoom
- **Legend auto-collapse**: starts collapsed on mobile, toggles on title tap, auto-expands on desktop resize
- **Back button/popstate**: closes panel and hominin view on browser back
- **Panel transform fix**: `showMainPanel()` no longer sets inline `translateX(0)` that conflicted with mobile `translateY` animation; `closePanel()` clears inline transform/transition

#### JS — serve.js

- `PORT` env variable support for preview server compatibility

### Files changed

| File | Change | Summary |
|------|--------|---------|
| `index.html` | ~250 lines | 3 media query blocks (768/480/landscape), mobile JS patch IIFE, panel transform fixes |
| `serve.js` | ~1 line | `process.env.PORT` support |
| `.claude/launch.json` | ~1 line | `autoPort: true` |

### Verified

- **Mobile (375×812)**: tree renders, panel opens as bottom-sheet with swipe handle, closes on swipe-down, search bar full-width, hominin view stacks vertically, zoom buttons 44px, no console errors
- **Desktop (1280×800)**: no regressions — panel slides from right, legend expanded, controls in standard positions, tree renders normally
- **Panel open/close**: inline transform cleared properly on both mobile and desktop

### Known remaining items

- Touch-based node click sometimes races with SVG background click handler (pre-existing)
- Pinch-to-zoom and pan can conflict during fast two-finger gestures (acceptable UX)
