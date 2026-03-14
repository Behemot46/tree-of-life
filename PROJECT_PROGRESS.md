# PROJECT PROGRESS — Tree of Life

## Completed Milestones

### p11 — Interactive Timeline + Alternate Tree Views (PR: claude/epic-mayer)

**Branch:** `claude/epic-mayer`
**Scope:** Phase 1 (Interactive Timeline) + Phase 2 (Alternate Tree Views)

#### Phase 1 — Interactive Timeline

**1A: Era Tint Background (Fixed)**
- Added `<div id="era-tint-overlay">` after `#bg` — `position:fixed;inset:0;z-index:0;pointer-events:none;transition:background 0.6s`
- Added `ERA_COLORS` map with dark/light rgba values for 9 geological eras
- Rewrote `updateEraTint(mya)` to set inline background on overlay div using `ERA_COLORS` + theme check
- Removed dependency on old CSS class-based approach (`.era-hadean` etc.)

**1B: Interactive Extinction Markers with Tooltips**
- Added `EXTINCTION_DETAILS` array — 5 mass extinctions with mya, % species lost, cause, survivors
- Consolidated into single `buildExtinctionMarkers()` function
- Markers: 3px wide, expand on hover (`scaleY(1.5)`)
- Tooltip card on hover: name, "X% species lost", cause, survivors — styled with gold border
- Click marker → smooth-animates slider to that Mya value via `animateSliderTo()`
- Removed duplicate `addTimelineMarkers()` from init (~80 lines removed)

**1C: Species Count Indicator**
- Added `<span id="era-species-count">` next to `#era-label`
- `updateSpeciesCount()` counts nodes passing `nodeInEra(n)` vs total
- Display: "42 / 100 species visible" (translated)
- Called from slider handler, play animation, and preset clicks

**1D: Play/Animate Button**
- Added `<button id="era-play">▶</button>` next to timeline track
- `toggleEraPlay()` — uses `requestAnimationFrame` to sweep slider from current position to 0 (Present) over 12 seconds
- Toggle between ▶ and ⏸ states
- Stops if user manually touches slider

**1E: Era Preset Quick-Jump Buttons**
- Added `<div id="era-presets">` with 6 pill buttons: LUCA (3800), O₂ Crisis (2400), Cambrian (541), Dinosaurs (200), K-Pg (66), Now (0)
- Click → smooth-animate slider to target value (250ms ease via `animateSliderTo()`)
- Active state highlight on closest preset via `updatePresetHighlight()`
- Small pill buttons with gold border, themed for dark/light

**1F: Timeline i18n**
- All 5 extinction names + causes + survivors translated (EN/HE/RU)
- 6 preset labels translated
- `era_play`, `era_pause`, `era_species_count` translated
- Presets and markers rebuild on language change via `applyI18n()`

#### Phase 2 — Alternate Tree Views

**2A: View Mode Toggle UI + State**
- Added `let viewMode = 'radial'` state variable (values: 'radial' | 'chronological' | 'cladogram')
- Added `<div id="view-toggle">` with 3 buttons — fixed position bottom-right (mobile) / top-right
- Each button: Unicode icon + translated text label
- CSS: dark/light theme variants, RTL position flip, mobile stacking

**2B: Refactored layout() to Dispatch**
- `layout()` → `switch(viewMode)` dispatching to `layoutRadial()`, `layoutCladogram()`, `layoutChronological()`
- No behavior change for radial — existing code moved to `layoutRadial()`

**2C: Cladogram Layout (Left-to-Right Tree)**
- `layoutCladogram()` — X based on depth * depthSpacing, Y distributes leaves evenly
- Leaf counting for Y distribution — each leaf gets equal vertical space, parents centered on children
- Branch paths: right-angle connections (`M→H→V→H` SVG path) via updated `branchPath()`
- Labels positioned to right of node (`text-anchor: start`)
- RTL check: flips X-axis if `dir="rtl"`

**2D: Chronological Layout (Time-Axis View)**
- `layoutChronological()` — X = `timeToX(node.appeared)` mapping 3800→left, 0→right
- Y distributed by domain lanes (Bacteria, Archaea, Protists, Fungi, Plants, Animals)
- Deterministic jitter via `hashCode(node.id)` for consistent positioning
- Straight-line branches connecting parent to child

**2E: View Mode Integration**
- `setViewMode(mode)` — updates state, runs layout, auto-centers tree via `centerOnTree(scale)`
- `branchPath()` returns right-angle paths for cladogram, straight lines for chronological, bezier curves for radial
- Label positioning adapts per view mode (right-of-node for cladogram, above-node for chronological, angle-based for radial)

**2F: View Mode i18n**
- `view_radial`, `view_chrono`, `view_clado` translated (EN/HE/RU)
- View toggle labels update on language change

#### Files Modified
- `index.html` — CSS (~70 lines added), HTML (era-tint-overlay, view-toggle, timeline restructure), JS (all new functions + refactored layout)

#### Verification Results
- Zero console errors in all views
- Radial view: unchanged behavior, smooth transitions
- Cladogram view: left-to-right tree, right-angle branches, auto-centered
- Chronological view: time-axis positioning, domain lanes, auto-centered
- Era presets: all 6 buttons work, smooth animation, active highlighting
- Extinction markers: tooltips on hover, click-to-jump
- Play button: animates slider sweep, toggles play/pause
- Species count: updates with slider, shows visible/total
- Light/dark theme: all new elements styled correctly
- RTL support: view toggle flips position

---

## SESSION HANDOFF

### What was done
Implemented the full Interactive Timeline (p11 Phase 1) and Alternate Tree Views (p11 Phase 2) milestone. This adds:
- 6 era preset quick-jump buttons with smooth animation
- Interactive extinction markers with rich tooltips (name, % lost, cause, survivors)
- Species count indicator that updates in real-time with the slider
- Play/animate button for a 12-second timeline sweep
- Era tint background overlay that changes color per geological period
- Three tree view modes: Radial (default), Cladogram (left-to-right), Chronological (time-axis)
- Full i18n support for all new features (EN/HE/RU)

### What was NOT done
- Chronological view auto-pan with slider (slider filters by opacity in all modes — more useful than auto-pan)
- Domain lane labels in chronological view (labels exist on nodes, adding lane headers felt cluttered)
- Collision nudging in chronological view (deterministic hash jitter handles most overlap well)

### Known Issues / Follow-up
1. The old `.era-*` CSS classes (lines 486-494) are now unused — safe to remove in a future cleanup
2. Chronological view could benefit from vertical domain lane separator lines
3. View mode is not persisted to localStorage (intentional — always starts in radial)
4. The species count uses `nodeInEra()` which counts all nodes in `nodeMap`, including internal branch nodes — could be refined to count only leaf species

### Key Functions Added
| Function | Purpose |
|----------|---------|
| `layoutRadial()` | Existing radial layout, extracted from `layout()` |
| `layoutCladogram()` | Left-to-right tree with depth-based X, leaf-distributed Y |
| `layoutChronological()` | Time-axis X, domain-lane Y with hash jitter |
| `centerOnTree(scale)` | Auto-centers viewport on tree bounding box |
| `setViewMode(mode)` | Switches view mode, re-layouts, centers |
| `buildExtinctionMarkers()` | Creates interactive extinction marker DOM |
| `updateSpeciesCount()` | Updates species visible counter |
| `toggleEraPlay()` | Play/pause timeline animation |
| `animateSliderTo(target)` | Smooth 250ms slider animation |
| `buildEraPresets()` | Creates era preset pill buttons |
| `updatePresetHighlight(mya)` | Highlights active preset |
| `updateEraTint(mya)` | Sets era overlay background color |

### Commit/Push/Merge Status
- Branch: `claude/epic-mayer`
- Base: `main`
- Status: Ready for PR
