# Sprint J5 — SVG Performance & Viewport Culling

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` — resolve merge conflicts first
4. Read render() function thoroughly — understand DocumentFragment pattern, node/branch rendering
5. Profile current performance: open Chrome DevTools → Performance → record a full tree expand + zoom cycle

**After ALL code changes:**
1. Profile again and compare (target: 60fps with full tree)
2. Test all 3 view modes: radial, cladogram, chronological
3. Verify zero console errors, dark/light theme, mobile
4. Commit: `feat: J5 — SVG viewport culling and performance`
5. Push branch and create PR to main
6. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md

---

## Sprint Goal

Achieve buttery 60fps rendering with 200+ nodes by culling invisible SVG elements and optimizing animation patterns.

## Tasks

### 1. Viewport Culling

Only render nodes and branches that fall within the visible viewport.

**Algorithm:**
```js
function isInViewport(node, transform, viewW, viewH) {
  // Transform node world coords to screen coords
  const sx = node._x * transform.s + transform.x;
  const sy = node._y * transform.s + transform.y;
  const margin = 100; // render slightly beyond viewport for smooth scroll
  return sx > -margin && sx < viewW + margin && sy > -margin && sy < viewH + margin;
}
```

**In render():**
- Before rendering each node/branch, check `isInViewport()`
- Skip nodes and their labels if outside viewport
- For branches: skip if BOTH endpoints are outside viewport

**Impact:** At high zoom, only 20-30 nodes render instead of 130+

### 2. GPU Compositing

Add to CSS:
```css
#viewport { will-change: transform; }
```

This promotes the SVG viewport layer to its own compositing layer, making zoom/pan GPU-accelerated.

### 3. CSS-Class Animations Instead of Inline Styles

Replace inline animation styles in render() with CSS classes:

**Current (inline):**
```js
p.style.strokeDasharray = len;
p.style.strokeDashoffset = len;
p.style.transition = `stroke-dashoffset ${duration}s ...`;
```

**Target (class-based):**
```css
.branch-entering { stroke-dasharray: 300; stroke-dashoffset: 300; }
.branch-entered { stroke-dashoffset: 0; transition: stroke-dashoffset 0.3s cubic-bezier(.4,0,.2,1); }
```

```js
p.classList.add('branch-entering');
requestAnimationFrame(() => p.classList.add('branch-entered'));
```

Same for node entrance animations.

### 4. Reset animDone on View Mode Switch

Currently `animDone` Set accumulates forever. In `setViewMode()`, clear it:
```js
animDone.clear();
```
This allows entrance animations to replay when switching views.

### 5. Debounce pointermove with rAF

Current `pointermove` handler calls `applyT()` synchronously on every move event (~60fps+).

Replace with rAF coalescing:
```js
let pendingPan = null;
svgEl.addEventListener('pointermove', e => {
  if (!isPointerPanning) return;
  pendingPan = e;
  if (!panRAF) {
    panRAF = requestAnimationFrame(() => {
      // apply transform from pendingPan
      panRAF = null;
    });
  }
});
```

### 6. Optimize Label Collision Detection

Current: O(n²) AABB test for all labels.

Optimization: Use spatial hashing — divide viewport into grid cells, only test labels in same/adjacent cells.

```js
const CELL_SIZE = 100; // pixels
const grid = new Map();
function cellKey(x, y) { return `${Math.floor(x/CELL_SIZE)},${Math.floor(y/CELL_SIZE)}`; }
```

This reduces collision checks from ~100×100 to ~100×5.

---

## Success Criteria

- [ ] Viewport culling implemented — nodes outside view not rendered
- [ ] `will-change: transform` on viewport layer
- [ ] Branch/node entrance animations use CSS classes, not inline styles
- [ ] animDone clears on view mode switch
- [ ] pointermove debounced with rAF
- [ ] 60fps maintained with full tree expanded (Chrome DevTools Performance)
- [ ] All 3 view modes render correctly
- [ ] Zero console errors
