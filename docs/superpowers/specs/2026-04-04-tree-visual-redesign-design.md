# Tree of Life — Visual Redesign Spec

**Date:** 2026-04-04
**Status:** Approved
**Scope:** Complete visual overhaul of the tree rendering — nodes, branches, layout, navigation, and animations.

---

## 1. Overview

Replace the current tree visualization (colored circles with emoji/silhouette overlays, geometric branch lines) with a premium, photo-driven experience. The primary layout is a horizontal cladogram ("Flowing River") where LUCA sits on the left and modern species flow to the right. Two additional view modes (radial "Photo Garden" and "Galaxy Spiral") share the same visual components but use different layout algorithms — they are out of scope for this spec and will be designed separately.

### Design Principles

- **Photos first:** Every node is a circular species portrait, not a colored dot
- **Organic, not technical:** Branches feel like living wood, not graph edges
- **Spacious:** Generous whitespace, no visual clutter
- **Guided:** The human evolutionary path is always visible as a golden trace
- **Smooth:** Every state change is animated — expand, collapse, pan, zoom
- **Accessible:** Reduced-motion safe, keyboard navigable, WCAG-compliant contrast

### View Modes After Redesign

| Mode | Status |
|------|--------|
| Horizontal cladogram (new default) | **This spec** |
| Radial ("Photo Garden") | Future spec, same visual components |
| Galaxy Spiral | Future spec, same visual components |
| Timeline / Chronological | **Dropped** |
| Playback | Unchanged (separate feature) |

---

## 2. Node Design

### 2.1 Photo Portrait Nodes

All nodes at all tree depths are rendered as circular photo portraits.

| Property | Desktop | Mobile (< 768px) |
|----------|---------|-------------------|
| Diameter | 52px | 44px |
| Border width (LUCA) | 3.5px | 3px |
| Border width (domains, depth 1) | 2.5px | 2.5px |
| Border width (depth 2+) | 2px | 1.5px |
| Border color | Node's domain color | Same |

**LUCA special treatment:**
- 52px (desktop) / 44px (mobile) circle with 3.5px gold (`#c8883a`) border
- Outer glow ring: animated pulse (r oscillates 56→62px, opacity 0.4→0.2, 3s ease-in-out infinite)
- Interior: purple gradient (`#8b5cf6` at 25% opacity) over dark background

**Photo rendering:**
- `<foreignObject>` + HTML `<img>` inside SVG (proven technique from current renderer)
- Circular crop via CSS `border-radius: 50%; overflow: hidden` on wrapper div
- Photo source: `PHOTO_MAP` URL via `ImageLoader.getBestUrl(node)`
- Photos render at 93% opacity to blend with the dark background; full opacity on hover

**Photo fallback (when image fails to load):**
- Dark circle fill (`#1a0f08`)
- Domain-colored radial gradient at 20-25% opacity
- Existing SVG silhouette icon (from `NODE_ICONS` via `getIconGroup()`) centered, white at 70% opacity
- No broken image indicators — fallback looks intentional and clean

### 2.2 Labels

Rendered below each node circle:

| Element | Font | Size (desktop) | Size (mobile) | Color |
|---------|------|-----------------|----------------|-------|
| Species name | Inter semibold (600) | 11px | 10px | Domain color |
| Latin name | Inter italic (400) | 9px | 8px | `rgba(255,255,255,0.35)` |

- Labels only render if they pass collision detection (existing spatial hash from `createSpatialHash()`)
- Human path labels always render (forced, same as current)
- Depth 0-1 labels always render (forced)

### 2.3 Collapsed Branch Indicator

When a branch node is collapsed and has children:

**Stacked cards effect:**
- 2 semi-transparent circles peek from behind the main node
- Offset: +4px and +8px to the right of center
- Opacity: 40% and 20% respectively
- Same border color as the main node, 1px stroke
- Size: same as main node (not smaller)

**Ghost children preview:**
- Maximum 3 tiny thumbnails (18px diameter) fan out to the right of the node
- Positioned in a slight arc, spaced 24px apart
- Opacity fades: first child 30%, second 20%, third 10%
- Use the first 3 children's photos (or fallback silhouettes)
- **Clutter control:** ghost previews only render when the collapsed node has 3+ children AND there are fewer than 8 collapsed sibling nodes visible. If 8+ collapsed siblings are visible, suppress ghost previews entirely to avoid visual noise.

**Count badge:**
- Small pill shape (frosted glass: `rgba(255,255,255,0.1)` background, `backdrop-filter: blur(8px)`)
- Positioned at top-right of the node (+8px, -8px offset)
- Text: descendant count in white, 9px Inter bold
- Only shows when collapsed and descendant count > 2

### 2.4 Hover Effects (No Movement)

Hover must never cause nodes to shift position. No `transform: scale()` on SVG `<g>` elements.

- **Border:** brightens via `filter: brightness(1.4) drop-shadow(0 0 6px <domain-color>)`
- **Photo:** opacity increases from 93% to 100%
- **Tooltip:** appears near the node showing name + `funFact` text (existing tooltip system)
- **Transition:** 0.2s ease on filter property

---

## 3. Branch Design ("Living Wood")

### 3.1 Path Geometry

Horizontal S-curves (cubic bezier) connecting parent to child:

```
M x1,y1 C x1+(dx*0.5),y1  x1+(dx*0.5),y2  x2,y2
```

Plus organic wobble on control points:
- Seed: deterministic hash from `(x1*7 + y1*13 + x2*11 + y2*17) % 1000 / 1000`
- Wobble magnitude: `(seed - 0.5) * distance * 0.10`
- Applied perpendicular to the branch direction
- Same technique as current `branchPath()`, adapted for horizontal layout

### 3.2 Tapering

| Depth | Stroke width | Opacity |
|-------|-------------|---------|
| 0 (LUCA → domains) | 5px | 0.8 |
| 1 (domains → phyla) | 3.5px | 0.6 |
| 2 (phyla → classes) | 2.5px | 0.45 |
| 3+ (classes → species) | 1.5px | 0.3 |

All branches: `stroke-linecap: round`, `stroke-linejoin: round`.

### 3.3 Color Gradient

Each branch has its own SVG `<linearGradient>`:
- Start color (`offset="0%"`): warm brown `#8b6a3a`
- End color (`offset="100%"`): child node's domain color

At depth 2+, the start color shifts from brown to the parent's domain color (so the gradient becomes "parent domain → child domain" instead of "brown → child domain").

### 3.4 Human Path Highlight

Golden trace drawn ON TOP of regular branches (appended after all normal branches in the SVG):
- Stroke: `#c8883a`
- Width: 2px at depth 0, tapering to 1.5px at depth 3+
- Opacity: 0.5 at depth 0, 0.4 at depth 3+
- Reuses the exact same `d` path as the underlying branch (including its organic wobble) — drawn on top as a second stroke

---

## 4. Layout Algorithm (Horizontal Cladogram)

### 4.1 Column Spacing

```
depthSpacing = clamp(
  (viewportWidth - margins * 2) / maxVisibleDepth,
  min: 140px,
  max: 220px
)
```

- Left margin: 80px (room for LUCA + label)
- Right margin: 60px

### 4.2 Vertical Spacing

- Leaf nodes: evenly spaced at the rightmost visible depth
- Minimum vertical gap: 64px on desktop (52px node + 12px breathing room), 56px on mobile (44px + 12px)
- Parent nodes: centered vertically on their children's Y range
- Hominin group nodes: extra 1.5× leaf gap between groups (same as current `GROUP_GAP_LEAVES`)

### 4.3 Initial State

- LUCA visible at the left
- All 6 domain children visible (Bacteria, Archaea, Protists, Fungi, Plants, Animals)
- Everything below domains is collapsed
- Human path golden trace visible from LUCA through all collapsed nodes to the rightmost visible human-path node
- View centered on LUCA + domains

### 4.4 RTL Support

When `document.documentElement.dir === 'rtl'`:
- Layout mirrors horizontally: LUCA on the right, species flow left
- `x = viewportWidth - x` for all node positions
- Bezier control points also flip: S-curves flow right-to-left (swap control point x-offsets so `dx*0.5` becomes `dx*-0.5` relative to child)
- `stroke-dashoffset` draw-in animation direction reverses (branches draw right-to-left)
- Time axis labels reverse

---

## 5. Human Path — Always Visible

The path from LUCA to Homo sapiens is the single most important visual element. It must be visible at all times regardless of collapse state.

### 5.1 Through Collapsed Nodes

When a node ON the human path is collapsed (hiding its human-path child):

1. The collapsed node's border changes from domain color to gold (`#c8883a`, 2.5px solid)
2. A small golden arrow indicator appears to the right of the node (→), signaling "the path continues inside"
3. The golden trace line terminates at this node with a subtle glow endpoint (radial gradient, 8px radius, `#c8883a` at 30% opacity)
4. A thin golden dashed line (`stroke-dasharray: 4 3`, 1px, 20% opacity) extends from the collapsed node to the right edge of the viewport, hinting that the path continues deeper

### 5.2 When Expanding Off the Human Path

When the user expands a branch that is NOT on the human path:
- The golden trace remains visible in the background at reduced opacity (25%)
- Human-path nodes stay at full opacity even when they're siblings of the dimmed branches
- The golden trace doesn't compete for attention — it's a subtle landmark, not a distraction

### 5.3 Following the Path

Clicking the golden arrow indicator (→) on a collapsed human-path node auto-expands that node AND continues expanding human-path children until a leaf or a branch point with non-human-path children is reached. **Max depth limit: 4 levels per click.** If the path goes deeper, the last expanded node shows another golden arrow to continue. This prevents overwhelming the user and keeps animations snappy.

---

## 6. Navigation & Wayfinding

### 6.1 Click Behavior

| Target | Single click | Double click |
|--------|-------------|-------------|
| Branch node (has children) | Expand/collapse | Open species panel |
| Leaf node (no children) | Open species panel | Open species panel (same) |
| Golden arrow indicator (→) | Auto-expand human path | — |
| Breadcrumb segment | Collapse to that level + pan | — |
| Mini-map viewport rect | Drag to pan main view | — |

No conflict between single/double click: single-click on leaves goes straight to panel since there's nothing to expand.

### 6.2 Back / Home Buttons

**Home button:**
- Position: top-left, persistent, always visible
- Icon: house silhouette, `#c8883a`
- Action: collapse all branches, reset to LUCA + domains view, center viewport
- Keyboard: `Home` key

**Back button:**
- Position: next to Home button
- Icon: left arrow, `#c8883a`
- Action: undo last navigation action (collapse last expanded branch, pan back)
- Uses existing `navStack` from `navigation.js`
- Keyboard: `Escape` key
- Disabled (30% opacity) when navStack is empty

### 6.3 Breadcrumb Trail

- Position: horizontal bar below the header, above the tree
- Format: `LUCA › Animals › Vertebrates › Mammals`
- Each segment clickable — collapses everything below that level, pans to center
- Current (deepest) segment: bold, domain color
- Parent segments: 50% opacity
- **Desktop:** full breadcrumb visible, truncates middle segments with `...` if > 6 levels
- **Mobile:** scrollable horizontal strip, first and last segments always visible. Integrated into the existing header row (no separate 36px bar) to avoid eating vertical space. On iPhone SE (667px), the breadcrumb shares the header line with a compact layout: `LUCA › ... › Mammals`. If the header can't fit both title and breadcrumb inline, the breadcrumb overlays the top of the tree with a subtle `linear-gradient(to bottom, var(--bg), transparent)` fade behind it (24px height, pointer-events on text only).

### 6.4 Mini-Map

- Position: bottom-right corner, 120×80px
- Background: `rgba(0,0,0,0.6)` with `backdrop-filter: blur(4px)`, 8px border-radius
- Content: tiny dots (2px) for nodes + thin lines (0.5px) for branches, in domain colors
- Viewport indicator: semi-transparent white rectangle with 1px border
- Draggable: drag the viewport rectangle to pan the main view
- Auto-fade: fades to 15% opacity after 3s of no interaction, reappears on pan/zoom
- **Hidden on mobile** (< 768px) — breadcrumb serves as primary wayfinding

---

## 7. Animations

### 7.1 Expand Sequence (0.6s total)

1. **0ms:** Parent node gets outer ring (0→1 opacity, 0.15s ease)
2. **0ms:** Sibling branches + nodes transition to 30% opacity (0.2s ease)
3. **100ms:** Branch paths draw in left-to-right via `stroke-dashoffset` animation (0.4s per branch, staggered 80ms between siblings)
4. **After each branch completes:** Corresponding child node fades in + slides 8px from left (0.3s ease, staggered 80ms)
5. **300ms:** View auto-pans to center parent + children (0.4s cubic-bezier(.25,.1,.25,1))

### 7.2 Collapse Sequence (0.4s total)

1. **0ms:** Child nodes fade out (0.2s ease)
2. **100ms:** Branch paths retract via `stroke-dashoffset` (0.2s ease)
3. **200ms:** Siblings restore to full opacity (0.2s ease)
4. **200ms:** View pans to center parent among its siblings (0.3s ease)

### 7.3 Reduced Motion

When `prefers-reduced-motion: reduce` is active (checked via existing `reducedMotion()` utility):
- All expand/collapse animations → instant opacity toggle (0ms)
- No `stroke-dashoffset` animation — branches appear/disappear instantly
- Pan/zoom still animated at 0.2s (spatial transitions are necessary for orientation)
- LUCA pulse ring → static (no animation)

---

## 8. Theme Support

### 8.1 Dark Theme (Default)

| Element | Value |
|---------|-------|
| Background | `#070503` |
| Branch base color | `#8b6a3a` |
| Node fill (behind photo) | `#1a0f08` |
| Photo opacity | 93% (100% on hover) |
| Label (name) | Domain color |
| Label (latin) | `rgba(255,255,255,0.35)` |
| Human path | `#c8883a` |
| Collapsed badge bg | `rgba(255,255,255,0.1)` + blur |

### 8.2 Light Theme

| Element | Value |
|---------|-------|
| Background | `#faf8f5` |
| Branch base color | `#c4a882` |
| Node fill (behind photo) | `#f0ebe4` |
| Photo opacity | 95% (100% on hover) |
| Label (name) | Domain color darkened 10% |
| Label (latin) | `rgba(0,0,0,0.45)` |
| Human path | `#a06a28` |
| Collapsed badge bg | `rgba(0,0,0,0.06)` + blur |

Theme toggle uses existing `data-theme` attribute on `<html>` and `localStorage` persistence.

---

## 9. Files Modified

| File | Changes |
|------|---------|
| `js/renderer.js` | Rewrite `render()` — photo nodes, gradient branches, ghost children, hover effects |
| `js/layout.js` | Rewrite `layoutCladogram()` with new spacing. Stub out `layoutChronological()` (keep function, return early with `// TODO: timeline view deferred` comment). Keep `layoutRadial()` and `layoutPlayback()` unchanged for now |
| `css/tree.css` | New styles for photo nodes, branch animations, collapsed indicators, mini-map, breadcrumb |
| `css/variables.css` | Add new CSS variables for branch colors, node sizes, spacing |
| `js/state.js` | Hide `chronological` from view mode UI (keep in state enum for future restoration) |
| `js/navigation.js` | Add breadcrumb click handlers, human-path auto-expand |

Files NOT modified: `treeData.js`, `speciesData.js`, `uiData.js`, `panel.js`, `search.js`, `zoom.js`, `app.js` (except removing chronological view mode references).

---

## 10. Performance Constraints

- **Viewport culling:** Only render nodes/branches within the visible viewport + 100px margin (existing `getViewBounds()` + `isInView()`)
- **No new dependencies:** Pure vanilla JS + SVG. No D3, no external libraries
- **SVG gradients:** Create gradient `<defs>` once per render, not per branch. Reuse gradients for same-domain branches
- **Photo loading:** Existing `ImageLoader` with `confirmedPhotoUrls` cache. No new network requests
- **DOM recycling:** Continue using `DocumentFragment` + `replaceChildren()` pattern
- **Target:** 60fps pan/zoom with 154+ nodes. Benchmark against current performance

---

## 11. Out of Scope

- Radial layout visual upgrade (future spec)
- Galaxy Spiral layout (future spec)
- Timeline / Chronological view mode (dropped)
- AI-generated species images (user may add offline later — drop into `assets/species/{node-id}.webp`)
- Species detail panel redesign (separate feature)
- Tour system updates (will adapt automatically to new layout)
- i18n changes (existing `t()` system unchanged)
