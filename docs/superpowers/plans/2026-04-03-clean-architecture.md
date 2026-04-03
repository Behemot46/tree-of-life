# Clean Architecture Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform index.html from a 2,580-line monolith into clean architecture with external CSS, ES module data files, and a single JS entry point — zero regressions.

**Architecture:** Phase 1 extracts ~2,113 lines of inline CSS into 10 external files loaded via `<link>` tags. Phase 2 converts 14 global `<script>` data files to ES modules one at a time, creating a barrel (`js/data.js`) for widely-shared constants. The single entry point `<script type="module" src="js/app.js">` remains.

**Tech Stack:** Vanilla JS, ES modules, CSS (no build tools, no dependencies)

**Spec:** `docs/superpowers/specs/2026-04-03-clean-architecture-design.md`

**Branch:** `refactor/clean-architecture`

---

## Verification Checklist (run after every task)

Open `http://localhost:5555` and verify:
1. Tree renders in radial view (default), switch to timeline and cladogram
2. Dark/light theme toggle (D key or button)
3. EN/HE/RU language switch, Hebrew is RTL
4. Search for "mammals" — fuzzy results appear
5. Click a species node — panel opens with hero image, facts, tags
6. Click "Human Evolution" FAB — hominin overlay opens
7. Timeline: drag thumb, click era segments, extinction markers show popovers
8. Open DNA Compare, select two species, see similarity result
9. Open Evo Path, click a preset, see path highlighted
10. Click quiz button, answer a question
11. Press ? — keyboard shortcuts overlay appears
12. Zero console errors

Quick version (minimum after low-risk steps): items 1, 2, 3, 5, 12.

---

## Phase 1: CSS Extraction

### Task 1: Create css/variables.css

**Files:**
- Create: `css/variables.css`

- [ ] **Step 1: Create the css directory**

```bash
mkdir -p css
```

- [ ] **Step 2: Extract lines 33–137 from index.html into css/variables.css**

Extract everything from the reset rule through the `:root` block closing brace, `html,body`, `body`, and `body.dragging` rules. Include the skip-link and focus-visible sections (lines 35–46). The file should begin with:

```css
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── SKIP TO CONTENT ── */
.skip-link{position:absolute;top:-100%;...
```

And end with:

```css
body.dragging{cursor:grabbing;}
```

This is lines 33–137 of the current `<style>` block (index.html lines 33–137).

- [ ] **Step 3: Verify the file is self-contained**

The file should contain:
- Reset rule (`*,*::before,*::after`)
- Skip-link rules (`.skip-link`, `.skip-link:focus`)
- Focus-visible rules (`:focus-visible`, `button:focus-visible` etc.)
- Full `:root { ... }` block with all custom properties
- `html,body`, `body`, `body.dragging` rules

No rule should reference a class/ID defined elsewhere — this file is pure foundation.

---

### Task 2: Create css/layout.css

**Files:**
- Create: `css/layout.css`

- [ ] **Step 1: Extract lines 139–219 from index.html into css/layout.css**

Sections to include (in order):
- `/* ── BACKGROUND ── */` (lines 139–141)
- `/* ── PARTICLES ── */` (lines 143–145)
- `/* ── HEADER ── */` (lines 147–157) — includes `[data-theme="light"]` title overrides
- `/* ── SEARCH BAR ── */` (lines 158–180)
- `/* ── SEARCH PILLS ── */` (lines 181–189) — includes `[data-theme="light"]` pill overrides
- `/* ── BREADCRUMB ── */` (lines 191–202)
- `/* ── NAV CONTROLS ── */` (lines 204–219) — includes `[data-theme="light"]` and `[dir="rtl"]` nav overrides

These are all top-level layout/chrome rules. Light-theme and RTL overrides that are co-located with their component stay with the component (not moved to theme.css/rtl.css) to preserve locality.

---

### Task 3: Create css/tree.css

**Files:**
- Create: `css/tree.css`

- [ ] **Step 1: Extract lines 254–277 from index.html into css/tree.css**

Section: `/* ── MAIN SVG ── */`

Contains: `#canvas-wrap`, `svg`, `.node-group`, `.node-circle`, `.branch-path`, `.badge-pulse`, `@keyframes badgePulse`, `#viewport`, `.branch-entering`, `.branch-entered`, `.node-entering`, `.node-entered`, `.node-label-text`, `.node-species-img`, `.node-pulse`, and the hominin-view-removed comment.

---

### Task 4: Create css/timeline.css

**Files:**
- Create: `css/timeline.css`

- [ ] **Step 1: Extract lines 221–252 from index.html into css/timeline.css**

Section: `/* ── ERA BROWSER / TIMELINE BAR ── */`

Contains: `#timeline`, `[data-theme="light"] #timeline`, `#tl-info-bar`, `#tl-era-info`, `#era-label`, `#era-time-range`, `#tl-density`, `#tl-track-wrap`, `#era-track`, `#era-segments`, `.era-seg`, `.era-seg-label`, `[data-theme="light"] .era-seg-label`, `#tl-thumb` and its states/pseudo-elements, `[data-theme="light"] #tl-thumb`, `#extinction-markers`.

Also include the later timeline-related sections:
- `/* ── ERA TINT OVERLAY ── */` (lines 1373–1375)
- `/* ── EXTINCTION MARKERS ── */` (lines 1376–1397) — includes `[data-theme="light"] .ext-popover`
- `/* ── SPECIES COUNT ── */` (lines 1398–1401) — includes `[data-theme="light"]` override
- `/* ── TIMELINE CONTROLS ROW ── */` (lines 1402–1415) — includes `[data-theme="light"]` preset overrides
- `/* ── PLAYBACK CONTROLS ── */` (lines 1416–1434) — includes `[data-theme="light"]` and `[dir="rtl"]` overrides

---

### Task 5: Create css/panel.css

**Files:**
- Create: `css/panel.css`

- [ ] **Step 1: Extract panel-related sections from index.html into css/panel.css**

Sections to include (in order):
- `/* ── MAIN DETAIL PANEL ── */` (lines 279–311) — includes `[data-theme="light"]` btn-back overrides
- `/* ── PANEL HERO IMAGE ── */` (lines 312–343) — first definition, includes `@keyframes shimmer`, `[data-theme="light"]` overrides, and the `@media (max-width:768px)` block at line 341–343
- `/* ── PRIMATE ENRICHED CARD SECTIONS ── */` (lines 367–413)
- `.p-children` rules (lines 414–418)
- `/* ── PANEL HERO IMAGE ── */` (lines 420–446) — second definition (keep both as-is, no dedup)
- `/* ── PANEL CONTENT SECTIONS ── */` (lines 448–451)
- `/* ── PANEL SECTION ANIMATION ── */` (lines 453–468) — includes `@keyframes panelSlideUp` and `@media(prefers-reduced-motion:reduce)` block
- `/* ── FUN FACT BLOCK ── */` (lines 470–478)
- `/* ── FACT CARD ENHANCEMENTS ── */` (lines 480–483)
- `/* ── TAG ENHANCEMENTS ── */` (lines 485–488)
- `/* ── PANEL CTA BUTTON ── */` (lines 490–495)
- `/* ── LEARN MORE LINKS ── */` (lines 497–502)
- `/* ── ALT FACTS ── */` (lines 504–508)
- `/* ── TIP FACT ── */` (lines 510–512)
- `/* ── PROGRESS BAR ── */` (lines 514–518)
- `/* ── CAPABILITY BADGES ── */` (lines 520–524)
- `/* ── MINI WORLD MAP ── */` (lines 526–536)
- `/* ── BRANCH-SPECIFIC BADGES ── */` (lines 537–540)
- `/* ── PANEL INFOGRAPHIC CLASSES ── */` (lines 549–610)
- `/* ── COLLAPSIBLE PANEL SECTIONS ── */` (lines 611–623)
- `/* ── TIMELINE BAR (p26) ── */` (lines 624–630)
- `/* ── TRAIT RADAR CHART ── */` (lines 631–635)
- `/* ── ENRICHMENT CARDS ── */` (lines 636–644) — includes `[dir="rtl"]` override

Note: The inline `@media` blocks at lines 341–343 and 468 stay with their component in panel.css (not moved to responsive.css) because they are tightly coupled to specific panel rules.

---

### Task 6: Create css/hominin.css

**Files:**
- Create: `css/hominin.css`

- [ ] **Step 1: Extract hominin-related sections from index.html into css/hominin.css**

Sections to include:
- `/* ── HOMININ ENTER BUTTON ── */` (lines 542–548)
- `/* ── HOMININ DEEP-DIVE OVERLAY ── */` (lines 1015–1077) — includes the `@media(max-width:768px)` block at lines 1070–1077
- `/* ── COMPARE CARD CSS CLASSES ── */` (lines 1078–1090)

---

### Task 7: Create css/features.css

**Files:**
- Create: `css/features.css`

- [ ] **Step 1: Extract feature sections from index.html into css/features.css**

Sections to include (in order), each with a clear section comment:
- `/* ── LEGEND ── */` (lines 646–662)
- `/* ── ZOOM CONTROLS ── */` (lines 663–674)
- `/* ── TOOLTIP ── */` (lines 675–684)
- `/* ── DISCOVERY FACT TOAST ── */` (lines 685–712) — includes `@keyframes badgePulse` (second definition at line 711)
- `/* ── ACHIEVEMENT TOAST ── */` (lines 713–728) — includes `@keyframes toastSlideIn/Out`
- `/* ── QUIZ MODAL ── */` (lines 729–767)
- `/* ── QUIZ BUTTON ── */` (lines 768–773)
- `/* ── ANIMATIONS ── */` (lines 790–795) — `@keyframes rootPulse, fadeIn, livingPulse, spin, searchHighlight`
- `/* ── SPECIES IMAGE ── */` (lines 1010–1014)
- `/* ── VIEW TOGGLE ── */` (lines 1436–1448) — includes `[dir="rtl"]` override
- `/* ── PLAYBACK MODE ── */` (lines 1566–1589) — includes `@keyframes nodeRevealBurst, extinctionFlash`
- DNA calculator styles (lines 1450–1557 within the mobile block — extract the non-media-query DNA panel rules: `.dna-panel`, `.dna-panel-inner`, etc., plus `[data-theme="light"]` at line 1481)
- Evo Path styles (lines 1590–1755 — `.evo-panel`, `.evo-panel-inner`, etc., plus `[data-theme="light"]` at line 1608, `@keyframes evoReveal` at line 1712)
- `/* ── TRIVIA GAME ── */` (lines 1756–1888) — includes `@keyframes trivia-*`, `[data-theme="light"]` overrides, and `@media(max-width:768px)` at lines 1884–1888
- `/* ── ACCESSIBILITY ── */` (lines 1889–1942) — `.sr-only`, live region
- `/* ── Guided Tour ── */` (lines 1944–1983) — includes `@keyframes tourPulse`
- `/* ── FLOATING ACTION BUTTONS (FAB) ── */` (lines 1984–2032) — includes `[dir="rtl"]`, `[data-theme="light"]`, `@keyframes tourPulseLight`, and `@media(max-width:768px)` at lines 2029–2032
- `/* ── TOUR SELECTOR ── */` (lines 2033–2083) — includes `[data-theme="light"]` and `@media(max-width:768px)` overrides
- `/* ── KEYBOARD HELP OVERLAY ── */` (lines 2084–2110) — includes `[data-theme="light"]` and `@media(max-width:768px)` overrides
- `/* ── JS-EXTRACTED UTILITY CLASSES ── */` (lines 2112–2144)

Note: Small inline `@media` blocks tightly coupled to their component (like trivia 768px, FAB 768px, tour selector 768px, kbd 768px) stay in features.css under their component section — not moved to responsive.css.

---

### Task 8: Create css/theme.css

**Files:**
- Create: `css/theme.css`

- [ ] **Step 1: Extract theme override sections from index.html into css/theme.css**

Sections to include:
- `/* ── LANGUAGE SWITCHER ── */` (lines 829–836)
- `/* ── THEME TOGGLE ── */` (lines 837–843)
- `/* ── LIGHT THEME — Museum Style ── */` (lines 844–909) — the main `[data-theme="light"]` block
- `/* ── SEMANTIC COLOR VARIABLES ── */` (lines 957–972)
- `/* ── LIGHT THEME: ELEMENT CONTRAST FIXES ── */` (lines 973–994)
- `/* ── LIGHT THEME: NEW PANEL ELEMENTS ── */` (lines 995–1009)
- `/* ── DARK MODE POLISH ── */` (lines 1091–1108)
- `/* ── SPLASH POLISH ── */` (lines 1109–1118)
- `/* ── PANEL ANIMATION ── */` (lines 1119–1125)

---

### Task 9: Create css/rtl.css

**Files:**
- Create: `css/rtl.css`

- [ ] **Step 1: Extract RTL sections from index.html into css/rtl.css**

Sections to include:
- `/* ── RTL (Hebrew) ── */` (lines 910–946)
- `/* ── RTL: NEW PANEL ELEMENTS ── */` (lines 947–956)

Note: Small `[dir="rtl"]` rules co-located with their component (like nav-ctrl at line 218–219, enrichment cards at line 640, timeline controls at lines 1431–1434, view toggle at line 1447, FABs at line 1990, tour card at lines 2027–2028) stay in their component file. Only the dedicated RTL override blocks move here.

---

### Task 10: Create css/responsive.css

**Files:**
- Create: `css/responsive.css`

- [ ] **Step 1: Extract the main responsive media query blocks from index.html into css/responsive.css**

Sections to include, with component-origin comments:

```css
/* ══════════════════════════════════════════════════
   FOCUS VISIBLE — enhanced focus ring overrides
   ══════════════════════════════════════════════════ */
```
- `/* ── FOCUS VISIBLE ── */` (lines 797–809) — second definition, contains `a:focus-visible` etc.

```css
/* ══════════════════════════════════════════════════
   HIGH CONTRAST
   ══════════════════════════════════════════════════ */
```
- `/* ── HIGH CONTRAST ── */` (lines 810–818) — `@media (forced-colors: active)`

```css
/* ══════════════════════════════════════════════════
   REDUCED MOTION
   ══════════════════════════════════════════════════ */
```
- `/* ── REDUCED MOTION ── */` (lines 819–828) — `@media (prefers-reduced-motion: reduce)` (the main one, not the inline panel one at 468)

```css
/* ══════════════════════════════════════════════════
   MOBILE ENGAGEMENT — (from features)
   ══════════════════════════════════════════════════ */
```
- `/* ── MOBILE ENGAGEMENT ── */` (lines 774–789) — `@media(max-width:768px)` and `@media(max-width:480px)` blocks

```css
/* ══════════════════════════════════════════════════
   MOBILE LAYOUT — main 768px breakpoint
   ══════════════════════════════════════════════════ */
```
- Main `@media (max-width: 768px)` block (lines 1127–1333) — the large responsive block with sections for header, breadcrumb, nav-ctrl, search bar, lang/theme, detail panel, zoom, FAB, legend, timeline, canvas, compare, splash, tooltip, footer

```css
/* ══════════════════════════════════════════════════
   ULTRA-SMALL — 480px breakpoint
   ══════════════════════════════════════════════════ */
```
- `@media (max-width: 480px)` block (lines 1334–1364)

```css
/* ══════════════════════════════════════════════════
   LANDSCAPE MOBILE
   ══════════════════════════════════════════════════ */
```
- `@media (max-height: 500px) and (max-width: 900px)` block (lines 1365–1372)

```css
/* ══════════════════════════════════════════════════
   MOBILE — NEW ELEMENTS (timeline, DNA, evo path)
   ══════════════════════════════════════════════════ */
```
- `/* ── MOBILE FOR NEW ELEMENTS ── */` `@media (max-width: 768px)` (lines 1449–1480) — but only the parts that are pure responsive overrides for already-extracted components. DNA and evo path responsive rules that were extracted with their component into features.css should NOT be duplicated here.

```css
/* ══════════════════════════════════════════════════
   MOBILE — DNA CALC (from features)
   ══════════════════════════════════════════════════ */
```
- `@media(max-width:768px)` DNA calc block (lines 1558–1564)

```css
/* ══════════════════════════════════════════════════
   MOBILE — PLAYBACK (from features)
   ══════════════════════════════════════════════════ */
```
- `@media(max-width:768px)` playback block (lines 1590–1607)

```css
/* ══════════════════════════════════════════════════
   MOBILE — EVO PATH (from features)
   ══════════════════════════════════════════════════ */
```
- `@media(max-width:768px)` evo path block (lines 1747–1755)

```css
/* ══════════════════════════════════════════════════
   REDUCED MOTION — engagement (from features)
   ══════════════════════════════════════════════════ */
```
- `@media(prefers-reduced-motion:reduce)` engagement block (lines 1923–1940)

---

### Task 11: Update index.html — replace `<style>` block with `<link>` tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the entire `<style>...</style>` block (lines 32–2145) with link tags**

Replace lines 32–2145 of index.html with:

```html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/tree.css">
<link rel="stylesheet" href="css/timeline.css">
<link rel="stylesheet" href="css/panel.css">
<link rel="stylesheet" href="css/hominin.css">
<link rel="stylesheet" href="css/features.css">
<link rel="stylesheet" href="css/theme.css">
<link rel="stylesheet" href="css/rtl.css">
<link rel="stylesheet" href="css/responsive.css">
```

- [ ] **Step 2: Verify line count**

```bash
wc -l index.html
```

Expected: ~447 lines (2580 - 2113 removed + 10 added).

- [ ] **Step 3: Run full verification checklist**

Start server: `node serve.js`

Run through all 12 items of the verification checklist. Pay special attention to:
- Light theme (specificity-sensitive)
- Hebrew RTL layout
- Mobile responsive (resize to 375px width)
- Reduced-motion (enable in OS/browser settings if possible)

- [ ] **Step 4: Commit**

```bash
git add css/ index.html
git commit -m "refactor: extract inline CSS into 10 external files

Phase 1 of clean architecture refactor. Moves ~2,113 lines of inline
CSS from index.html <style> block into 10 external files organized by
concern. Zero CSS rules modified — purely structural extraction.

Files: variables, layout, tree, timeline, panel, hominin, features,
theme, rtl, responsive."
```

---

### Task 12: Update service worker for CSS files

**Files:**
- Modify: `sw.js`

- [ ] **Step 1: Add CSS files to APP_SHELL array in sw.js**

Add these entries to the `APP_SHELL` array after `'/index.html'`:

```js
'/css/variables.css',
'/css/layout.css',
'/css/tree.css',
'/css/timeline.css',
'/css/panel.css',
'/css/hominin.css',
'/css/features.css',
'/css/theme.css',
'/css/rtl.css',
'/css/responsive.css',
```

- [ ] **Step 2: Bump CACHE_VERSION**

Change `const CACHE_VERSION = 'tol-v1';` to `const CACHE_VERSION = 'tol-v2';`.

- [ ] **Step 3: Commit**

```bash
git add sw.js
git commit -m "chore: update service worker precache for external CSS files"
```

---

## PHASE 1 CHECKPOINT

**Stop here.** Run the full verification checklist one more time. Verify `git log --oneline` shows 2 clean commits on the `refactor/clean-architecture` branch. This is the clean checkpoint between Phase 1 and Phase 2.

---

## Phase 2: Data Files → ES Modules

Each task converts one global data file to an ES module. The pattern for each:
1. Add `export` to declarations in the data file
2. Add `import` statements to consuming ES module files
3. Remove the `<script src="...">` tag from index.html
4. Verify in browser
5. Commit

### Task 13: Convert mapPaths.js to ES module

**Files:**
- Modify: `js/mapPaths.js`
- Modify: `js/panel.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/mapPaths.js**

Add `export` before the declaration:

```js
// Before:
const MAP_PATHS = {
// After:
export const MAP_PATHS = {
```

- [ ] **Step 2: Add import to js/panel.js**

Add at the top of panel.js, after existing imports:

```js
import { MAP_PATHS } from './mapPaths.js';
```

- [ ] **Step 3: Remove script tag from index.html**

Delete this line:
```html
<script src="js/mapPaths.js"></script>
```

- [ ] **Step 4: Verify — open app, click a species with geographic data, confirm mini-map renders**

- [ ] **Step 5: Commit**

```bash
git add js/mapPaths.js js/panel.js index.html
git commit -m "refactor: convert mapPaths.js to ES module"
```

---

### Task 14: Convert primateData.js to ES module

**Files:**
- Modify: `js/primateData.js`
- Modify: `js/panel.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/primateData.js**

```js
// Before:
const PRIMATE_DATA = {
// After:
export const PRIMATE_DATA = {
```

- [ ] **Step 2: Add import to js/panel.js**

```js
import { PRIMATE_DATA } from './primateData.js';
```

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/primateData.js"></script>`

- [ ] **Step 4: Verify — click a primate species (gorilla, chimpanzee), confirm enriched primate card renders**

- [ ] **Step 5: Commit**

```bash
git add js/primateData.js js/panel.js index.html
git commit -m "refactor: convert primateData.js to ES module"
```

---

### Task 15: Convert geoData.js to ES module

**Files:**
- Modify: `js/geoData.js`
- Modify: `js/panel.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/geoData.js**

```js
// Before:
const GEO_DATA = {
// After:
export const GEO_DATA = {

// Before:
const BRANCH_DATA = {
// After:
export const BRANCH_DATA = {
```

- [ ] **Step 2: Add import to js/panel.js**

```js
import { GEO_DATA, BRANCH_DATA } from './geoData.js';
```

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/geoData.js"></script>`

- [ ] **Step 4: Verify — click species with geo data, confirm map and branch-type badge render**

- [ ] **Step 5: Commit**

```bash
git add js/geoData.js js/panel.js index.html
git commit -m "refactor: convert geoData.js to ES module"
```

---

### Task 16: Convert triviaData.js to ES module

**Files:**
- Modify: `js/triviaData.js`
- Modify: `js/trivia.js`
- Modify: `js/quiz.js`
- Modify: `index.html`

- [ ] **Step 1: Add export to js/triviaData.js**

```js
// Before:
const TRIVIA_QUESTIONS = (() => {
// After:
export const TRIVIA_QUESTIONS = (() => {
```

- [ ] **Step 2: Add import to js/trivia.js**

```js
import { TRIVIA_QUESTIONS } from './triviaData.js';
```

- [ ] **Step 3: Add import to js/quiz.js**

```js
import { TRIVIA_QUESTIONS } from './triviaData.js';
```

- [ ] **Step 4: Remove the `typeof` guard in quiz.js**

quiz.js currently has a defensive check `if (typeof TRIVIA_QUESTIONS === 'undefined' ...)`. With the explicit import, this guard is unnecessary. Replace:

```js
// Before:
if (typeof TRIVIA_QUESTIONS === 'undefined' || !TRIVIA_QUESTIONS.length) return [];
// After:
if (!TRIVIA_QUESTIONS || !TRIVIA_QUESTIONS.length) return [];
```

- [ ] **Step 5: Remove script tag from index.html**

Delete: `<script src="js/triviaData.js"></script>`

- [ ] **Step 6: Verify — open trivia game, answer a question; open quiz, answer a question**

- [ ] **Step 7: Commit**

```bash
git add js/triviaData.js js/trivia.js js/quiz.js index.html
git commit -m "refactor: convert triviaData.js to ES module"
```

---

### Task 17: Convert imagePrompts.js to ES module

**Files:**
- Modify: `js/imagePrompts.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/imagePrompts.js**

```js
// Before:
const IMAGE_PROMPTS = {
// After:
export const IMAGE_PROMPTS = {

// Before:
function getImagePrompt(nodeId) {
// After:
export function getImagePrompt(nodeId) {
```

- [ ] **Step 2: Remove script tag from index.html**

Delete: `<script src="js/imagePrompts.js"></script>`

- [ ] **Step 3: Verify — app loads with zero console errors (no consumers exist, so nothing should break)**

- [ ] **Step 4: Commit**

```bash
git add js/imagePrompts.js index.html
git commit -m "refactor: convert imagePrompts.js to ES module (no consumers — dead code)"
```

---

### Task 18: Convert nodeIcons.js to ES module

**Files:**
- Modify: `js/nodeIcons.js`
- Modify: `js/renderer.js`
- Modify: `js/panel.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/nodeIcons.js**

```js
// Before:
const NODE_ICONS = {
// After:
export const NODE_ICONS = {

// Before:
function getIconGroup(n) {
// After:
export function getIconGroup(n) {
```

- [ ] **Step 2: Add import to js/renderer.js**

```js
import { NODE_ICONS, getIconGroup } from './nodeIcons.js';
```

- [ ] **Step 3: Add import to js/panel.js**

```js
import { NODE_ICONS, getIconGroup } from './nodeIcons.js';
```

- [ ] **Step 4: Remove script tag from index.html**

Delete: `<script src="js/nodeIcons.js"></script>`

- [ ] **Step 5: Verify — tree renders with SVG icons on nodes, panel shows icon in header**

- [ ] **Step 6: Commit**

```bash
git add js/nodeIcons.js js/renderer.js js/panel.js index.html
git commit -m "refactor: convert nodeIcons.js to ES module"
```

---

### Task 19: Convert dnaSimilarity.js to ES module

**Files:**
- Modify: `js/dnaSimilarity.js`
- Modify: `js/dnaCalc.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/dnaSimilarity.js**

Add `export` to all top-level declarations:

```js
export const DNA_KNOWN = {
export function estimateFromDivergence(mya) {
export function findLCA(nodeA, nodeB) {
export function estimateDnaSimilarity(nodeA, nodeB) {
export const DNA_FUN_FACTS = [
export function getDnaFunFact(percent, speciesName) {
```

- [ ] **Step 2: Add imports to js/dnaCalc.js**

```js
import { estimateDnaSimilarity, getDnaFunFact } from './dnaSimilarity.js';
```

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/dnaSimilarity.js"></script>`

- [ ] **Step 4: Verify — open DNA Compare, select two species, confirm similarity percentage and fun fact appear**

- [ ] **Step 5: Commit**

```bash
git add js/dnaSimilarity.js js/dnaCalc.js index.html
git commit -m "refactor: convert dnaSimilarity.js to ES module"
```

---

### Task 20: Convert factLibrary.js to ES module

**Files:**
- Modify: `js/factLibrary.js`
- Modify: `js/app.js`
- Modify: `js/panel.js`
- Modify: `js/hominin.js`
- Modify: `js/evoPath.js`
- Modify: `js/engagement.js`
- Modify: `index.html`

- [ ] **Step 1: Add export to js/factLibrary.js**

```js
// Before:
const FACTS = (() => {
// After:
export const FACTS = (() => {
```

- [ ] **Step 2: Add import to each consumer**

Add to `js/app.js` (at top with other imports):
```js
import { FACTS } from './factLibrary.js';
```

Add to `js/panel.js`:
```js
import { FACTS } from './factLibrary.js';
```

Add to `js/hominin.js`:
```js
import { FACTS } from './factLibrary.js';
```

Add to `js/evoPath.js`:
```js
import { FACTS } from './factLibrary.js';
```

Add to `js/engagement.js`:
```js
import { FACTS } from './factLibrary.js';
```

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/factLibrary.js"></script>`

- [ ] **Step 4: Verify — splash screen shows loading fact, panel shows fun facts, idle toast shows "Did You Know" facts**

- [ ] **Step 5: Commit**

```bash
git add js/factLibrary.js js/app.js js/panel.js js/hominin.js js/evoPath.js js/engagement.js index.html
git commit -m "refactor: convert factLibrary.js to ES module"
```

---

### Task 21: Convert imageLoader.js to ES module

**Files:**
- Modify: `js/imageLoader.js`
- Modify: `js/app.js`
- Modify: `js/renderer.js`
- Modify: `js/panel.js`
- Modify: `js/dnaCalc.js`
- Modify: `js/evoPath.js`
- Modify: `js/trivia.js`
- Modify: `index.html`

- [ ] **Step 1: Add export to js/imageLoader.js**

```js
// Before:
const ImageLoader = (() => {
// After:
export const ImageLoader = (() => {
```

- [ ] **Step 2: Add import to each consumer**

Add to `js/app.js`:
```js
import { ImageLoader } from './imageLoader.js';
```

Add to `js/renderer.js`:
```js
import { ImageLoader } from './imageLoader.js';
```

Add to `js/panel.js`:
```js
import { ImageLoader } from './imageLoader.js';
```

Add to `js/dnaCalc.js`:
```js
import { ImageLoader } from './imageLoader.js';
```

Add to `js/evoPath.js`:
```js
import { ImageLoader } from './imageLoader.js';
```

Add to `js/trivia.js`:
```js
import { ImageLoader } from './imageLoader.js';
```

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/imageLoader.js"></script>`

- [ ] **Step 4: Verify — tree node photos render, panel hero images load, DNA/evo/trivia show species images**

- [ ] **Step 5: Commit**

```bash
git add js/imageLoader.js js/app.js js/renderer.js js/panel.js js/dnaCalc.js js/evoPath.js js/trivia.js index.html
git commit -m "refactor: convert imageLoader.js to ES module"
```

---

### Task 22: Convert uiData.js to ES module

**Files:**
- Modify: `js/uiData.js`
- Modify: `js/theme.js`
- Modify: `js/timeline.js`
- Modify: `js/layout.js`
- Modify: `js/playback.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/uiData.js**

```js
export const DEPTH_R=[...];
export const ERA_NAMES={...};
export const EXTINCTIONS=[...];
export const ERA_TINTS=[...];
export const TIMELINE_SEGMENTS=[...];
export const TRANSLATIONS = {
```

- [ ] **Step 2: Add imports to consumers**

Add to `js/theme.js`:
```js
import { TRANSLATIONS } from './uiData.js';
```

Add to `js/timeline.js`:
```js
import { ERA_NAMES, TIMELINE_SEGMENTS } from './uiData.js';
```

Add to `js/layout.js`:
```js
import { DEPTH_R } from './uiData.js';
```

Add to `js/playback.js`:
```js
import { EXTINCTIONS } from './uiData.js';
```

- [ ] **Step 3: Check if app.js also references any uiData globals**

Search `js/app.js` for `DEPTH_R`, `ERA_NAMES`, `EXTINCTIONS`, `ERA_TINTS`, `TIMELINE_SEGMENTS`, `TRANSLATIONS`. Add imports for any found.

- [ ] **Step 4: Remove script tag from index.html**

Delete: `<script src="js/uiData.js"></script>`

- [ ] **Step 5: Verify — language switch works (EN/HE/RU), timeline segments render with era names, radial layout spacing correct**

- [ ] **Step 6: Commit**

```bash
git add js/uiData.js js/theme.js js/timeline.js js/layout.js js/playback.js index.html
git commit -m "refactor: convert uiData.js to ES module"
```

---

### Task 23: Convert speciesData.js to ES module

**Files:**
- Modify: `js/speciesData.js`
- Modify: `js/app.js`
- Modify: `js/panel.js`
- Modify: `js/search.js`
- Modify: `js/dnaCalc.js`
- Modify: `js/trivia.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/speciesData.js**

```js
export const ENRICHMENT = {
export const WIKI_TITLES = {
export const PHOTO_MAP = {
export const GREAT_APE_IDS = [...];
export const HOMININ_IDS = [...];
```

- [ ] **Step 2: Add imports to consumers**

Add to `js/app.js`:
```js
import { PHOTO_MAP } from './speciesData.js';
```

Add to `js/panel.js`:
```js
import { WIKI_TITLES } from './speciesData.js';
```

(panel.js already gets PHOTO_MAP from a future data.js barrel — for now import directly)
```js
import { PHOTO_MAP } from './speciesData.js';
```

Add to `js/search.js`:
```js
import { ENRICHMENT } from './speciesData.js';
```

Add to `js/dnaCalc.js`:
```js
import { PHOTO_MAP } from './speciesData.js';
```

Add to `js/trivia.js`:
```js
import { PHOTO_MAP } from './speciesData.js';
```

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/speciesData.js"></script>`

- [ ] **Step 4: Verify — species photos load on tree and in panel, search returns results with enrichment data**

- [ ] **Step 5: Commit**

```bash
git add js/speciesData.js js/app.js js/panel.js js/search.js js/dnaCalc.js js/trivia.js index.html
git commit -m "refactor: convert speciesData.js to ES module"
```

---

### Task 24: Convert treeData.js to ES module

**Files:**
- Modify: `js/treeData.js`
- Modify: `js/app.js`
- Modify: `js/layout.js`
- Modify: `js/renderer.js`
- Modify: `js/navigation.js`
- Modify: `js/hominin.js`
- Modify: `js/zoom.js`
- Modify: `js/utils.js`
- Modify: `js/search.js`
- Modify: `js/engagement.js`
- Modify: `index.html`

- [ ] **Step 1: Add exports to js/treeData.js**

```js
export function lightenColor(hex, level) {
export const TREE = {
export const HOMININS = [
export const MAX_BRAIN = 1750;
export const ERA_GROUPS = [
export const HOMININ_ID_ALIASES={
```

- [ ] **Step 2: Add imports to consumers**

Add to `js/app.js`:
```js
import { TREE, lightenColor } from './treeData.js';
```

Add to `js/layout.js`:
```js
import { TREE } from './treeData.js';
```

Add to `js/renderer.js`:
```js
import { TREE } from './treeData.js';
```

Add to `js/navigation.js`:
```js
import { TREE } from './treeData.js';
```

Add to `js/hominin.js`:
```js
import { TREE, HOMININS, MAX_BRAIN, ERA_GROUPS } from './treeData.js';
```

Add to `js/zoom.js`:
```js
import { TREE } from './treeData.js';
```

Add to `js/utils.js`:
```js
import { HOMININS, MAX_BRAIN, HOMININ_ID_ALIASES } from './treeData.js';
```

Add to `js/search.js`:
```js
import { HOMININS } from './treeData.js';
```

Add to `js/engagement.js`:
```js
import { HOMININS } from './treeData.js';
```

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/treeData.js"></script>`

- [ ] **Step 4: Verify — tree renders with all species, hominin branch visible, search finds hominin species, golden path highlights**

- [ ] **Step 5: Commit**

```bash
git add js/treeData.js js/app.js js/layout.js js/renderer.js js/navigation.js js/hominin.js js/zoom.js js/utils.js js/search.js js/engagement.js index.html
git commit -m "refactor: convert treeData.js to ES module"
```

---

### Task 25: Convert treeExpansion.js to ES module

**Files:**
- Modify: `js/treeExpansion.js`
- Modify: `js/app.js`
- Modify: `index.html`

- [ ] **Step 1: Convert IIFE to exported function in js/treeExpansion.js**

Replace the entire file structure. The current file is wrapped in `(function expandTree() { ... })();` which runs immediately and mutates global `TREE` using global `lightenColor`.

Convert to:

```js
// js/treeExpansion.js — Phase p32: Data Enrichment
// Expands tree from ~130 to 300+ species with IUCN conservation data

export function expandTree(TREE, lightenColor) {
  function find(node, id) {
    if (node.id === id) return node;
    if (node.children) for (const c of node.children) { const f = find(c, id); if (f) return f; }
    return null;
  }
  const N = (id) => find(TREE, id);
  function add(parentId, ...children) {
    const p = N(parentId);
    if (!p) return;
    if (!p.children) p.children = [];
    p.children.push(...children);
  }
  function iucn(id, status) { const n = N(id); if (n) n.iucn = status; }

  // ... rest of file body unchanged (all the add() and iucn() calls) ...

  // Log expansion count
  let count = 0;
  (function countNodes(n) { count++; if (n.children) n.children.forEach(countNodes); })(TREE);
  console.log('[TreeExpansion] Total nodes after expansion: ' + count);
}
```

Key changes:
- Remove wrapping `(function expandTree() { ... })();`
- Add `export function expandTree(TREE, lightenColor) {`
- Add closing `}` at end
- All internal code (the `add()` calls, `iucn()` calls, color constants) stays exactly the same

- [ ] **Step 2: Update js/app.js to call expandTree()**

Add import:
```js
import { expandTree } from './treeExpansion.js';
```

Find where `TREE` is first used in app.js initialization (around the `preprocess(TREE)` call). Add `expandTree(TREE, lightenColor)` **before** `preprocess(TREE)`:

```js
// Before:
preprocess(TREE);
sortChildrenByAge(TREE);

// After:
expandTree(TREE, lightenColor);
preprocess(TREE);
sortChildrenByAge(TREE);
```

Verify this matches the current execution order — currently treeExpansion.js runs as a `<script>` tag before the module `app.js`, so expansion happens before preprocessing. The new code preserves this order.

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/treeExpansion.js"></script>`

- [ ] **Step 4: Verify — count species in tree (should be 300+), check console for "[TreeExpansion] Total nodes" message, verify expanded species like bottlenose-dolphin appear**

- [ ] **Step 5: Commit**

```bash
git add js/treeExpansion.js js/app.js index.html
git commit -m "refactor: convert treeExpansion.js to ES module

Unwraps self-executing IIFE into exported function that receives
TREE and lightenColor as parameters. Called explicitly from app.js
before preprocess()."
```

---

### Task 26: Convert tours.js to ES module

**Files:**
- Modify: `js/tours.js`
- Modify: `js/app.js`
- Modify: `index.html`

- [ ] **Step 1: Add initTourDeps and exports to js/tours.js**

Replace the `window._tour*` accessor functions at the top of tours.js:

```js
// Before:
function _ts() { return window._tourState || {}; }
function _nm() { return window._tourNodeMap || {}; }
function _lay() { if (window._tourLayout) window._tourLayout(); }
function _sr(f) { if (window._tourScheduleRender) window._tourScheduleRender(f); }
function _at() { if (window._tourApplyT) window._tourApplyT(); }
function _slide(v) { if (window._tourAnimateSliderTo) window._tourAnimateSliderTo(v); }

// After:
let _deps = {};

export function initTourDeps(deps) {
  _deps = deps;
}

function _ts() { return _deps.state || {}; }
function _nm() { return _deps.nodeMap || {}; }
function _lay() { if (_deps.layout) _deps.layout(); }
function _sr(f) { if (_deps.scheduleRender) _deps.scheduleRender(f); }
function _at() { if (_deps.applyT) _deps.applyT(); }
function _slide(v) { if (_deps.animateSliderTo) _deps.animateSliderTo(v); }
```

Add `export` to public declarations:

```js
export var TOURS = {
export var tourState = { active: false, step: 0, tourId: null };
export function showTourSelector() {
export function startTour(tourId) {
export function endTour() {
```

Keep all other functions (`_createTourDOM`, `_showTourStep`, `_tourNavToNode`, etc.) as non-exported private functions.

- [ ] **Step 2: Update js/app.js**

Add import:
```js
import { initTourDeps, TOURS, tourState, showTourSelector, startTour, endTour } from './tours.js';
```

Replace the `window._tour*` assignments (around lines 746–756 of current app.js):

```js
// Before:
window.showTourSelector = typeof showTourSelector !== 'undefined' ? showTourSelector : () => {};
window.startTour = typeof startTour !== 'undefined' ? startTour : () => {};
window.endTour = typeof endTour !== 'undefined' ? endTour : () => {};

window._tourState = state;
window._tourNodeMap = nodeMap;
window._tourLayout = layout;
window._tourScheduleRender = scheduleRender;
window._tourApplyT = applyT;
window._tourAnimateSliderTo = animateSliderTo;

// After:
initTourDeps({ state, nodeMap, layout, scheduleRender, applyT, animateSliderTo });
window.showTourSelector = showTourSelector;
window.startTour = startTour;
window.endTour = endTour;
```

Note: `window.showTourSelector`, `window.startTour`, and `window.endTour` must remain because the HTML has `onclick="showTourSelector()"`.

- [ ] **Step 3: Remove script tag from index.html**

Delete: `<script src="js/tours.js"></script>`

- [ ] **Step 4: Verify — click the ? tour button, start each of the 3 guided tours, navigate through all steps, end tour**

- [ ] **Step 5: Commit**

```bash
git add js/tours.js js/app.js index.html
git commit -m "refactor: convert tours.js to ES module

Replaces window._tour* bridge with initTourDeps() pattern matching
the rest of the codebase. Exports TOURS, tourState, and public tour
functions."
```

---

### Task 27: Create js/data.js barrel and migrate imports

**Files:**
- Create: `js/data.js`
- Modify: `js/app.js`
- Modify: `js/layout.js`
- Modify: `js/renderer.js`
- Modify: `js/navigation.js`
- Modify: `js/hominin.js`
- Modify: `js/panel.js`
- Modify: `js/search.js`
- Modify: `js/theme.js`
- Modify: `js/dnaCalc.js`
- Modify: `js/evoPath.js`
- Modify: `js/trivia.js`
- Modify: `js/utils.js`
- Modify: `js/engagement.js`
- Modify: `js/zoom.js`

- [ ] **Step 1: Create js/data.js**

```js
// js/data.js — barrel re-exports for widely-shared data constants
// Import from here for constants used across 4+ modules.
// Import directly from source for niche/single-consumer constants.

export { TREE, HOMININS, MAX_BRAIN, ERA_GROUPS, HOMININ_ID_ALIASES, lightenColor } from './treeData.js';
export { PHOTO_MAP, ENRICHMENT, WIKI_TITLES, GREAT_APE_IDS, HOMININ_IDS } from './speciesData.js';
export { TRANSLATIONS } from './uiData.js';
export { FACTS } from './factLibrary.js';
export { ImageLoader } from './imageLoader.js';
export { NODE_ICONS, getIconGroup } from './nodeIcons.js';
```

- [ ] **Step 2: Update consumers to import from data.js instead of direct source**

For each file, replace the direct imports added in Tasks 13–26 with barrel imports where the constant is widely shared (4+ consumers). Leave direct imports for niche constants.

**js/app.js** — replace:
```js
import { TREE, lightenColor } from './treeData.js';
import { PHOTO_MAP } from './speciesData.js';
import { FACTS } from './factLibrary.js';
import { ImageLoader } from './imageLoader.js';
```
with:
```js
import { TREE, lightenColor, PHOTO_MAP, FACTS, ImageLoader } from './data.js';
```

**js/layout.js** — replace:
```js
import { TREE } from './treeData.js';
```
with:
```js
import { TREE } from './data.js';
```

**js/renderer.js** — replace:
```js
import { TREE } from './treeData.js';
import { NODE_ICONS, getIconGroup } from './nodeIcons.js';
import { ImageLoader } from './imageLoader.js';
```
with:
```js
import { TREE, NODE_ICONS, getIconGroup, ImageLoader } from './data.js';
```

**js/navigation.js** — replace:
```js
import { TREE } from './treeData.js';
```
with:
```js
import { TREE } from './data.js';
```

**js/hominin.js** — replace:
```js
import { TREE, HOMININS, MAX_BRAIN, ERA_GROUPS } from './treeData.js';
import { FACTS } from './factLibrary.js';
```
with:
```js
import { TREE, HOMININS, MAX_BRAIN, ERA_GROUPS, FACTS } from './data.js';
```

**js/panel.js** — replace:
```js
import { PHOTO_MAP } from './speciesData.js';
import { WIKI_TITLES } from './speciesData.js';
import { NODE_ICONS, getIconGroup } from './nodeIcons.js';
import { FACTS } from './factLibrary.js';
import { ImageLoader } from './imageLoader.js';
```
with:
```js
import { PHOTO_MAP, WIKI_TITLES, NODE_ICONS, getIconGroup, FACTS, ImageLoader } from './data.js';
```
(Keep direct imports for PRIMATE_DATA, GEO_DATA, BRANCH_DATA, MAP_PATHS)

**js/search.js** — replace:
```js
import { HOMININS } from './treeData.js';
import { ENRICHMENT } from './speciesData.js';
```
with:
```js
import { HOMININS, ENRICHMENT } from './data.js';
```

**js/theme.js** — replace:
```js
import { TRANSLATIONS } from './uiData.js';
```
with:
```js
import { TRANSLATIONS } from './data.js';
```

**js/dnaCalc.js** — replace:
```js
import { PHOTO_MAP } from './speciesData.js';
import { ImageLoader } from './imageLoader.js';
```
with:
```js
import { PHOTO_MAP, ImageLoader } from './data.js';
```
(Keep direct import for dnaSimilarity.js)

**js/evoPath.js** — replace:
```js
import { PHOTO_MAP } from './speciesData.js';  // or wherever added
import { FACTS } from './factLibrary.js';
import { ImageLoader } from './imageLoader.js';
```
with:
```js
import { PHOTO_MAP, FACTS, ImageLoader } from './data.js';
```

**js/trivia.js** — replace:
```js
import { PHOTO_MAP } from './speciesData.js';
import { ImageLoader } from './imageLoader.js';
```
with:
```js
import { PHOTO_MAP, ImageLoader } from './data.js';
```
(Keep direct import for TRIVIA_QUESTIONS from triviaData.js)

**js/utils.js** — replace:
```js
import { HOMININS, MAX_BRAIN, HOMININ_ID_ALIASES } from './treeData.js';
```
with:
```js
import { HOMININS, MAX_BRAIN, HOMININ_ID_ALIASES } from './data.js';
```

**js/engagement.js** — replace:
```js
import { HOMININS } from './treeData.js';
```
with:
```js
import { HOMININS } from './data.js';
```

**js/zoom.js** — replace:
```js
import { TREE } from './treeData.js';
```
with:
```js
import { TREE } from './data.js';
```

- [ ] **Step 3: Verify — full verification checklist, all 12 items**

- [ ] **Step 4: Commit**

```bash
git add js/data.js js/app.js js/layout.js js/renderer.js js/navigation.js js/hominin.js js/panel.js js/search.js js/theme.js js/dnaCalc.js js/evoPath.js js/trivia.js js/utils.js js/engagement.js js/zoom.js
git commit -m "refactor: create data.js barrel, migrate widely-shared imports

Widely-shared constants (TREE, PHOTO_MAP, FACTS, ImageLoader, etc.)
now imported from data.js barrel. Niche constants still imported
directly from source files."
```

---

### Task 28: Remove remaining global script tags and finalize

**Files:**
- Modify: `index.html`
- Modify: `sw.js`

- [ ] **Step 1: Verify all global script tags are already removed**

Check index.html for any remaining `<script src="js/...">` tags (non-module). There should only be `<script type="module" src="js/app.js">` remaining.

```bash
grep '<script src=' index.html
```

Expected: no output. If any remain, they were missed in a previous task — remove them.

- [ ] **Step 2: Update sw.js APP_SHELL with complete file list**

Replace the APP_SHELL array in sw.js with:

```js
const APP_SHELL = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/layout.css',
  '/css/tree.css',
  '/css/timeline.css',
  '/css/panel.css',
  '/css/hominin.css',
  '/css/features.css',
  '/css/theme.css',
  '/css/rtl.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/data.js',
  '/js/treeData.js',
  '/js/treeExpansion.js',
  '/js/speciesData.js',
  '/js/uiData.js',
  '/js/factLibrary.js',
  '/js/imageLoader.js',
  '/js/imagePrompts.js',
  '/js/dnaSimilarity.js',
  '/js/nodeIcons.js',
  '/js/triviaData.js',
  '/js/primateData.js',
  '/js/geoData.js',
  '/js/mapPaths.js',
  '/js/tours.js',
  '/js/state.js',
  '/js/utils.js',
  '/js/layout.js',
  '/js/renderer.js',
  '/js/panel.js',
  '/js/navigation.js',
  '/js/search.js',
  '/js/timeline.js',
  '/js/hominin.js',
  '/js/dnaCalc.js',
  '/js/evoPath.js',
  '/js/trivia.js',
  '/js/playback.js',
  '/js/theme.js',
  '/js/engagement.js',
  '/js/quiz.js',
  '/js/zoom.js',
  '/assets/placeholder.svg'
];
```

Ensure CACHE_VERSION is `'tol-v2'` (should already be from Task 12).

- [ ] **Step 3: Verify final index.html line count**

```bash
wc -l index.html
```

Expected: ~430–450 lines (pure HTML + link/script tags).

- [ ] **Step 4: Run FULL verification checklist — all items, both themes, all 3 languages**

- [ ] **Step 5: Commit**

```bash
git add index.html sw.js
git commit -m "refactor: finalize clean architecture — single entry point

index.html is now pure HTML markup (~430 lines). All CSS in 10
external files. All JS as ES modules with single entry point
(js/app.js). Service worker precache updated."
```

---

## PHASE 2 CHECKPOINT

**Stop here.** Final state verification:

```bash
wc -l index.html
# Expected: ~430-450 lines

grep '<script src=' index.html
# Expected: no output (no global scripts)

grep '<script type="module"' index.html
# Expected: <script type="module" src="js/app.js">

ls css/
# Expected: 10 files

grep '<link rel="stylesheet"' index.html
# Expected: 10 link tags
```

Run the full 19-item verification checklist from the spec one final time.

---

## Update documentation

### Task 29: Update CLAUDE.md and docs

**Files:**
- Modify: `CLAUDE.md`
- Modify: `docs/ARCHITECTURE.md`

- [ ] **Step 1: Update CLAUDE.md repository structure**

Update the repository structure section to reflect the new `css/` directory and the removal of inline CSS/JS from index.html. Update any references to "inline `<style>` block" or "inline `<script>`" to point to the external files.

- [ ] **Step 2: Update docs/ARCHITECTURE.md**

Update the architecture doc to reflect:
- CSS is in 10 external files in `css/`
- All data files are ES modules with explicit exports
- `js/data.js` barrel pattern for shared constants
- Single entry point: `<script type="module" src="js/app.js">`
- No more global `<script>` tags

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md docs/ARCHITECTURE.md
git commit -m "docs: update architecture docs for clean architecture refactor"
```
