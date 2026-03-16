# Session Handoff — 2026-03-16 (p21 — Species Panel Visual Identity)

**Status: done**
**Branch:** `claude/romantic-napier`

## 1. Session Goal
Replace emoji-based panel headers with hero images and polished SVG silhouette fallbacks, creating a visually rich "species card" experience.

## 2. What I Changed

### index.html — CSS (`<style>` block)
- Added ~90 lines of new CSS classes for the panel:
  - `.panel-hero` — full-width 16:9 hero image container with domain-colored gradient background
  - `.panel-hero-img` / `.panel-hero-img.loaded` — image display controlled via CSS class toggle (not inline styles)
  - `.panel-hero-fallback` — SVG silhouette icon fallback with node's domain color
  - `.panel-hero-gradient` — bottom gradient overlay for text readability
  - `.panel-hero-shimmer` — loading shimmer animation, auto-hidden when image loads
  - `.panel-hero-credit` — photo attribution overlay
  - `.panel-body` — scrollable content container (replaces inline `style="padding:20px..."`)
  - `.panel-lineage-badge` (`.human` / `.great-ape`) — lineage classification badges
  - `.panel-header`, `.panel-title`, `.panel-latin`, `.panel-era` — header typography
  - `.panel-desc`, `.panel-detail`, `.panel-fun-fact` — content sections
  - `.panel-facts-grid`, `.panel-fact-row` — alternating-row fact grid
  - `.panel-tags`, `.panel-tag` — trait chips
  - `.panel-section-title` — section headers (BRAIN VOLUME, DNA LEGACY, etc.)
  - `.panel-brain-bar`, `.panel-dna-bar` — progress bars
  - `.panel-close-btn`, `.panel-hominin-btn`, `.panel-link-btn` — action buttons
- Mobile `@media (max-width: 768px)` additions: hero capped at `aspect-ratio:2/1; max-height:150px`, body padding reduced
- Light/dark theme support via `[data-theme]` selectors

### index.html — `renderPanelContent()` (~line 2860)
- Complete rewrite using CSS classes instead of inline styles
- Hero image section with fallback chain: PHOTO_MAP → generated image → Wikipedia API → SVG silhouette
- SVG silhouette uses `getIconGroup(node)` + `NODE_ICONS` for domain-appropriate icon
- Domain-colored gradient backgrounds (`node.color`) for visual identity
- `onload`/`onerror` handlers toggle CSS classes (not inline display styles)
- Back button injection uses `.panel-body` class selector instead of `[style*="padding:20px"]`

### index.html — `fetchWikiPhoto()` (~line 2830)
- Updated to use CSS class toggles (`classList.add('loaded')`, `classList.add('hidden')`) instead of `style.display`
- Sets `.has-image` on `.panel-hero` container to hide shimmer

### HOMININ_IDS fix
- Updated from stale IDs (`homo-sapiens`, `denisovan`) to actual tree node IDs (`h_sapiens`, `denisovans`, plus 10 additional hominins)

### PROJECT_PROGRESS.md
- Added p21 to Completed table, marked as Done in Upcoming table

## 3. Image Sourcing Chain
1. **ImageLoader generated** (`.webp`/`.png` in `assets/species/`) — highest priority
2. **PHOTO_MAP** (Wikimedia URLs from `js/speciesData.js`) — primary source
3. **`node.img`** — legacy per-node image field
4. **Wikipedia REST API** (`fetchWikiPhoto()`) — async fetch after panel renders
5. **SVG silhouette fallback** — `NODE_ICONS[getIconGroup(node)]` with domain-colored gradient

## 4. No Duplicate PHOTO_MAP
The prompt mentioned a duplicate `const PHOTO_MAP` inside `renderPanelContent()` — this was already cleaned up in p15. No action needed.

## 5. Known Issues / Follow-ups
- Claude Preview browser blocks Wikimedia URLs (CORS), so photos appear as silhouette fallbacks in preview — works fine in real browser
- The static panel HTML (`#panel` element at line 1255) still contains old `.panel-scroll`, `.p-close` etc. children — these are overwritten by `renderPanelContent()` on every panel open, but could be cleaned up
- Panel `panel-close` event listener is attached to the static `#panel-close` button which gets replaced — the close button in the new panel uses `onclick="closePanel()"` inline handler instead
