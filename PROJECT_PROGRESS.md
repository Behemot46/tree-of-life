# PROJECT_PROGRESS.md — Tree of Life

> Last updated: 2026-03-13

---

## 1. Current State of Development

### Architecture Reality

The project has **two coexisting, incompatible architectures**:

| Layer | Status | Lines | Notes |
|-------|--------|-------|-------|
| **App A** (index.html monolith) | **Working** | 4,299 | All rendering, data, search, i18n, theming inline |
| **App B** (js/*.js modules) | **Dead** | 1,737 | 7 modules load but crash immediately — DOM targets missing |
| **style.css** | **Orphaned** | 757 | Targets App B classes that don't exist in App A's DOM |

**App A is the product.** App B is legacy scaffolding that never got wired up.

### Feature Inventory

| Feature | Status | Details |
|---------|--------|---------|
| Radial SVG tree | Done | ~47 nodes, vanilla JS (no D3), custom DEPTH_R layout |
| Pan / zoom / drag | Done | Mouse + touch + pinch |
| Node collapse/expand | Done | Click to toggle |
| 32 hominin species | Done | Full data: brain, tools, fire, language, fossils, DNA |
| Hominin overlay | Done | 5 filter categories, scrollable timeline |
| Compare mode | Done | 2-4 species side-by-side |
| Detail panel | Done | Description, facts, tags, images, sub-groups |
| Search | Done | Substring on name/latin/tags across 79 items |
| i18n (EN/HE/RU) | Done | 43+ keys, RTL for Hebrew, localStorage |
| Dark/light theme | Done | CSS custom properties, localStorage |
| Particles + intro animation | Done | 22 particles, 3.2s splash |
| Era slider | Done | 0-3800 Ma, filters visible nodes |
| Timeline markers | Done | 5 extinctions + 6 innovations, tooltip on hover |
| Keyboard shortcuts | Done | F=search, H=hominin, R=reset, Esc=close |
| URL state | Done | `?node=id` persistence |
| Random species (dice) | Done | Picks random node |

### What's Missing or Broken

| Gap | Severity | Source |
|-----|----------|--------|
| App B modules are dead code | Medium | CHANGELOG baseline |
| style.css is orphaned | Low | Targets non-existent DOM |
| No live API enrichment | Medium | All data hardcoded, no Wikipedia/iNat calls at runtime |
| No fuzzy/transliterated search | Low | MEMORY gap #2 |
| Timeline not interactive | Low | MEMORY gap #4, markers are visual-only |
| No offline fallback | Low | MEMORY gap #5 |
| No tests | Medium | Manual browser testing only |
| Legend domain highlight missing | Low | CHANGELOG baseline |
| index.html is 4,299-line monolith | High | Hard to diff, review, maintain |
| serve.js hardcodes port 5555 | Low | No process.env.PORT |

---

## 2. Completed Milestones

| Milestone | PR | Branch | Status |
|-----------|----|--------|--------|
| Baseline audit + CHANGELOG | — | main | Merged |
| Museum-quality overhaul (accessibility, theming, data) | — | main | Merged |
| i18n EN/HE/RU + theme toggle | — | main | Merged |
| Hominin deep dive (overlay, compare, DNA viz) | — | main | Merged |
| Main-tree hominin integration (28→32 species) | #35 | claude/admiring-wiles | Merged |
| Structural upgrade (rendering, search, touch, photo) | — | main | Merged (674f344) |
| Homo sapiens fill color + hominins nav + compare panel | #31 | — | Merged |
| **Hominin access improvements** | — | feature/hominin-access | **In progress** |

### Latest: Hominin Access Improvements (feature/hominin-access)

**Changes:**
1. Added `hominini` branch node to TREE under great-apes, with homo-sapiens as child
2. Floating "Human Evolution" button (bottom-right, calls openHomininView directly)
3. Golden pulsing ring + "Explore →" badge on hominini node in render()
4. Upgraded panel: prominent gateway card with description + gradient button for hominini
5. i18n: added `btn_hominin` key in EN/HE/RU

**Verified:** Dark theme, light theme, Hebrew RTL — all working.

---

## 3. Proposed Next Steps (Priority Order)

### Phase A — Cleanup & Stability

**A1. Kill App B / Unify Architecture**
- Delete or archive `js/api.js`, `js/tree.js`, `js/panel.js`, `js/search.js`, `js/timeline.js`, `js/i18n.js`, `js/main.js`
- Keep `style.css` only if migrating styles there (see Phase C)
- Remove dead `<script>` tags from index.html
- Rationale: Dead code confuses contributors and inflates repo

**A2. Extract Data from index.html**
- Move TREE object to `js/treeData.js`
- Move HOMININS array to `js/homininData.js`
- Move TRANSLATIONS to `js/translations.js`
- Load via `<script>` tags — keeps zero-build-step workflow
- Drops index.html from ~4,300 → ~2,000 lines

**A3. Fix serve.js**
- Use `process.env.PORT || 5555` for preview server compatibility
- Ensure `__dirname` resolves correctly from worktrees

### Phase B — Feature Gaps

**B1. Live API Enrichment**
- Wire Wikipedia REST API for species summaries on panel open
- Wire iNaturalist API for photos + conservation status
- Keep hardcoded data as fallback (offline mode for free)
- Add loading spinner to panel while fetching

**B2. Interactive Timeline**
- Click extinction/innovation markers to jump era slider
- Highlight affected clades when hovering a marker
- Add geological period labels (Cambrian, Jurassic, etc.)

**B3. Fuzzy + Transliterated Search**
- Add Levenshtein distance or trigram matching
- Support Hebrew/Russian queries mapping to Latin names
- Show "Did you mean...?" suggestions

**B4. Legend Domain Highlight**
- Click a domain color in the legend to highlight that subtree
- Dim other branches, pulse the selected domain

### Phase C — Visual Overhaul (see Section 4)

### Phase D — Quality & DevEx

**D1. Basic Test Suite**
- Add unit tests for pure functions (search, canonicalHomininId, i18n t())
- Use a zero-config runner (e.g., inline `<script>` test page, or single-file Deno test)

**D2. Linting**
- Add `.eslintrc` with minimal rules matching existing style
- CI check in deploy-check.yml

---

## 4. Visual Overhaul Plan

### Goals
- Modern, immersive "science museum" aesthetic
- Better information density without clutter
- Consistent component design language
- Responsive: desktop-first, tablet-usable, phone-viewable
- Accessibility: WCAG AA color contrast, focus indicators, screen reader labels

### 4.1 Color System Refresh

**Current:** 9 CSS custom properties, dark theme default, basic light theme.

**Proposed:** Expand to a layered token system.

```
Semantic tokens (what they mean):
  --color-bg-primary        Deep space / paper
  --color-bg-secondary      Card / panel surfaces
  --color-bg-tertiary       Hover states, insets
  --color-text-primary      Main body text
  --color-text-secondary    Captions, metadata
  --color-text-muted        Disabled, hints
  --color-accent-primary    Gold — CTAs, active states
  --color-accent-secondary  Teal — links, info
  --color-accent-tertiary   Terra — warnings, alerts
  --color-border            Subtle dividers

Domain tokens (what they represent):
  --domain-bacteria         #e8a838  (keep)
  --domain-archaea          #9b59b6  (keep)
  --domain-plants           #27ae60  (keep)
  --domain-fungi            #e67e22  (keep)
  --domain-animals          #2980b9  (keep)
  --domain-default          #4a9e5c  (keep)
```

Dark theme: deep navy/charcoal background (#0a0e1a → #141824)
Light theme: warm paper tones (#f5f0e8 → #faf7f2)

### 4.2 Typography

**Current:** System fonts, inconsistent sizing.

**Proposed:**
- Headings: `Inter` or `Space Grotesk` (CDN) — geometric, scientific feel
- Body: `Inter` — highly legible at all sizes
- Data/labels: `JetBrains Mono` or `IBM Plex Mono` — for numbers, IDs, MYA values
- Scale: modular scale (1.25 ratio), base 16px
  - h1: 2.441rem, h2: 1.953rem, h3: 1.563rem, body: 1rem, small: 0.8rem

### 4.3 Tree Visualization Redesign

**Current:** Flat circles, straight radial lines, emoji icons.

**Proposed upgrades:**
- **Nodes:** Replace flat circles with gradient-filled orbs + subtle glow matching domain color; size still log-scaled by num_tips
- **Edges:** Replace straight lines with organic bezier curves; add subtle gradient along branch (parent color → child color)
- **Labels:** Pull labels outward with leader lines; use smaller mono font for rank, larger sans for common name
- **Hover state:** Node scales up 1.2x, shows tooltip card with name + MYA + tip count
- **Expanded state:** Subtle radial burst animation when children appear
- **Collapsed indicator:** Small "+" badge on collapsed nodes instead of relying on click discovery
- **Depth rings:** Faint concentric circles at each depth level with geological era labels (Hadean, Archean, etc.)
- **Minimap:** Restore minimap in bottom-left with current viewport indicator

### 4.4 Panel Redesign

**Current:** Slide-in panel, basic layout, limited visual hierarchy.

**Proposed:**
- **Card-based layout:** Each section (description, facts, images, sub-groups) in a distinct card with rounded corners + subtle shadow
- **Hero image:** Large header image (from iNat/Wikipedia) with gradient overlay for text
- **Tabbed sections:** Horizontal tab bar with animated underline indicator
- **Stats row:** Horizontal chips for key stats (MYA, tip count, rank) with icons
- **Hominin-specific:** Brain volume as an animated fill bar, DNA introgression as a donut chart, fossil sites on a mini world map (SVG)
- **Close animation:** Slide + fade out, not just translate

### 4.5 Hominin Overlay Redesign

**Current:** Full-screen overlay, vertical list, basic styling.

**Proposed:**
- **Split layout:** Left = scrollable species list (40%), right = detail card (60%)
- **Timeline spine:** Vertical timeline with species branching off at their MYA position
- **Species cards:** Compact cards with silhouette icon, name, date range bar, brain bar
- **Compare mode:** Side-by-side cards with animated bar chart comparison
- **Filter pills:** Horizontal scrollable pills instead of buttons
- **Transitions:** Staggered entrance animation for list items

### 4.6 Search Redesign

**Current:** Simple text input, dropdown list.

**Proposed:**
- **Command palette style:** Centered overlay (Cmd+K pattern), blurred background
- **Rich results:** Each result shows icon + name + common name + rank + domain color dot
- **Category headers:** Group results by "Tree Nodes" / "Hominins"
- **Keyboard navigation:** Arrow keys + Enter, highlighted selection
- **Recent searches:** Show last 5 searches when opening empty

### 4.7 Timeline Redesign

**Current:** Bottom bar, static markers, basic slider.

**Proposed:**
- **Full-width timeline rail** at bottom with labeled geological periods (color-coded bands)
- **Interactive markers:** Click extinction event → era slider jumps, tree highlights affected era
- **Scrubber handle:** Styled thumb with current MYA tooltip
- **Period labels:** Hover a period band to see name + date range
- **"Now" indicator:** Right edge marked with pulsing dot

### 4.8 Controls & Chrome

**Current:** Scattered buttons, inconsistent styling.

**Proposed:**
- **Floating toolbar:** Grouped icon buttons (zoom +/-, reset, layout toggle, theme, language, dice) in a vertical pill on the left edge
- **Consistent icon set:** Use Lucide icons (CDN, MIT license) or SVG sprites
- **Tooltip on hover** for every control
- **Breadcrumb trail:** Show path from LUCA to selected node at top of screen

### 4.9 Animations & Micro-interactions

- **Page load:** Fade in from center, tree nodes stagger by depth (keep current, refine timing)
- **Node expand:** Children fly in from parent with spring easing
- **Theme toggle:** Smooth CSS transition (0.3s) on all color properties
- **Panel open/close:** Slide + scale with backdrop dim
- **Scroll indicators:** Fade edges on scrollable lists
- **Loading states:** Skeleton screens instead of spinners where possible

### 4.10 Responsive Breakpoints

```
Desktop:   > 1024px  — full layout (tree + panel side-by-side)
Tablet:    768-1024px — panel overlays tree, smaller nodes
Mobile:    < 768px    — bottom sheet panel, simplified tree, hamburger menu for controls
```

### 4.11 Accessibility

- All interactive elements get `role`, `aria-label`, `tabindex`
- Focus ring visible on keyboard navigation (`:focus-visible`)
- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for large text/icons
- Skip-to-content link
- Reduced motion: `@media (prefers-reduced-motion)` disables particles + animations
- Screen reader announcements for tree navigation (`aria-live` region)

---

## 5. Implementation Sequence (Recommended)

```
Phase A (Cleanup)           ~1-2 sessions
  A1  Kill App B dead code
  A2  Extract data to separate files
  A3  Fix serve.js

Phase C (Visual Overhaul)   ~3-5 sessions
  C.1  Color system + typography (4.1 + 4.2)
  C.2  Tree visualization (4.3)
  C.3  Panel redesign (4.4)
  C.4  Hominin overlay (4.5)
  C.5  Search command palette (4.6)
  C.6  Timeline redesign (4.7)
  C.7  Controls + chrome (4.8)
  C.8  Animations + responsive (4.9 + 4.10)
  C.9  Accessibility pass (4.11)

Phase B (Features)          ~2-3 sessions
  B1  Live API enrichment
  B2  Interactive timeline
  B3  Fuzzy search
  B4  Legend highlight

Phase D (Quality)           ~1 session
  D1  Test suite
  D2  Linting
```

Phases A and C can be interleaved. Phase B depends on stable architecture from A.

---

## 6. SESSION HANDOFF

### Last session: 2026-03-13 (session 2)
- **Branch:** `feature/hominin-access`
- **What was done:**
  - Added `hominini` branch node to TREE data under great-apes
  - Floating "Human Evolution" button with i18n (EN/HE/RU) + RTL + light/dark theme
  - Golden pulsing ring + "Explore →" badge on hominini node in render()
  - Upgraded panel: prominent gateway card with description for hominini node
  - Added `@keyframes homininGlow` animation
  - Browser-verified: dark theme, light theme, Hebrew RTL — all working
- **Files changed:** `index.html` (data + CSS + HTML + render + panel + i18n), `PROJECT_PROGRESS.md`
- **Blockers:** None
- **Next action:** Commit, push, create PR for review

### Commit / Push / Merge Safety Status
- **Committed:** Pending user approval
- **Pushed:** No
- **PR created:** No
- **Safe to merge:** Yes — touches only index.html rendering/data/panel sections; no overlap with other branches
