# Tree of Life Visual Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current tree rendering (colored circles + emoji, geometric lines) with a photo-driven horizontal cladogram featuring organic "living wood" branches, circular species portraits, always-visible human path, and smooth expand/collapse animations.

**Architecture:** The renderer (`js/renderer.js`) gets a full rewrite. The layout algorithm (`js/layout.js`) gets a new horizontal cladogram. CSS (`css/tree.css`, `css/variables.css`) gets new custom properties and animation classes. Navigation (`js/navigation.js`) gets breadcrumb click handlers and human-path auto-expand. The SVG `<defs>` in `index.html` gets new gradient definitions. View mode UI hides Timeline but keeps the function stub.

**Tech Stack:** Vanilla JS, SVG, CSS custom properties. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-04-04-tree-visual-redesign-design.md`

---

## File Map

| File | Responsibility | Action |
|------|---------------|--------|
| `css/variables.css` | New CSS variables for tree redesign | Modify (add vars) |
| `css/tree.css` | Node photo styles, branch animations, collapsed indicators, minimap, breadcrumb | Rewrite |
| `index.html:119-132` | SVG `<defs>` — add gradient templates | Modify |
| `index.html:236-243` | View toggle — hide Timeline button | Modify |
| `js/layout.js` | New `layoutCladogram()`, stub `layoutChronological()` | Modify |
| `js/renderer.js` | Full rewrite — photo nodes, gradient branches, ghost children, hover | Rewrite |
| `js/navigation.js` | Breadcrumb click handlers, human-path auto-expand | Modify |
| `js/state.js` | No changes needed (chronological stays in enum) | No change |
| `js/app.js:165-180` | `setViewMode()` — default to cladogram, handle chronological gracefully | Modify |

---

### Task 1: CSS Variables and Foundation

**Files:**
- Modify: `css/variables.css:15-101`

- [ ] **Step 1: Add tree redesign CSS variables to `:root`**

Add these variables inside the existing `:root` block in `css/variables.css`, after the `--z-tour-content` line (line 101):

```css
  /* ── Tree Redesign ── */
  --tree-node-size:52px;
  --tree-node-size-mobile:44px;
  --tree-node-fill:#1a0f08;
  --tree-branch-brown:#8b6a3a;
  --tree-branch-brown-light:#c4a882;
  --tree-human-path:#c8883a;
  --tree-human-path-light:#a06a28;
  --tree-photo-opacity:0.93;
  --tree-photo-opacity-hover:1;
  --tree-sibling-dim:0.3;
  --tree-ghost-size:18px;
  --tree-label-name-size:11px;
  --tree-label-latin-size:9px;
  --tree-label-name-size-mobile:10px;
  --tree-label-latin-size-mobile:8px;
  --tree-minimap-w:120px;
  --tree-minimap-h:80px;
```

- [ ] **Step 2: Verify no name conflicts**

Run: `grep -r "tree-node-size\|tree-branch-brown\|tree-human-path\|tree-photo-opacity" css/ js/`
Expected: Only hits in `css/variables.css` from Step 1.

- [ ] **Step 3: Commit**

```bash
git add css/variables.css
git commit -m "feat(tree): add CSS variables for visual redesign"
```

---

### Task 2: Rewrite `css/tree.css` — Node and Branch Styles

**Files:**
- Rewrite: `css/tree.css`

- [ ] **Step 1: Replace the entire contents of `css/tree.css`**

```css
/* ══════════════════════════════════════════════════════
   TREE.CSS — Photo nodes, living wood branches, animations
   ══════════════════════════════════════════════════════ */

/* ── MAIN SVG ── */
#canvas-wrap{position:fixed;inset:0;z-index:var(--z-tree);}
svg{width:100%;height:100%;}
#viewport{will-change:transform;}

/* ── NODE GROUPS ── */
.node-group{cursor:pointer;}

/* ── PHOTO NODE CIRCLES ── */
.node-border{transition:filter var(--transition-fast);}
.node-group:hover .node-border{
  filter:brightness(1.4) drop-shadow(0 0 6px var(--nc,currentColor));
}

/* Photo wrapper inside foreignObject */
.node-img-wrap{
  border-radius:50%;
  overflow:hidden;
  pointer-events:none;
}
.node-img{
  width:100%;height:100%;
  object-fit:cover;
  border-radius:50%;
  opacity:var(--tree-photo-opacity);
  transition:opacity var(--transition-fast);
}
.node-img.loaded{opacity:var(--tree-photo-opacity);}
.node-group:hover .node-img.loaded{opacity:var(--tree-photo-opacity-hover);}

/* ── SILHOUETTE FALLBACK ── */
.node-fallback-icon{pointer-events:none;}

/* ── LABELS ── */
.node-label-name{
  pointer-events:none;
  font-family:var(--font-sans);
  font-weight:600;
  font-size:var(--tree-label-name-size);
}
.node-label-latin{
  pointer-events:none;
  font-family:var(--font-sans);
  font-style:italic;
  font-weight:400;
  font-size:var(--tree-label-latin-size);
  fill:rgba(255,255,255,0.35);
}
[data-theme="light"] .node-label-latin{fill:rgba(0,0,0,0.45);}

/* ── COLLAPSED INDICATORS ── */
.node-stack-card{pointer-events:none;}
.node-ghost{pointer-events:none;}

/* Ghost child preview */
.node-ghost-wrap{
  border-radius:50%;
  overflow:hidden;
  pointer-events:none;
}
.node-ghost-img{
  width:100%;height:100%;
  object-fit:cover;
  border-radius:50%;
}

/* Count badge (frosted glass) */
.node-count-badge{
  pointer-events:none;
}
.node-badge-bg{
  fill:rgba(255,255,255,0.1);
  backdrop-filter:blur(8px);
}
[data-theme="light"] .node-badge-bg{fill:rgba(0,0,0,0.06);}

/* ── BRANCHES ── */
.branch-path{
  fill:none;
  stroke-linecap:round;
  stroke-linejoin:round;
  cursor:default;
}

/* Human path overlay branch */
.branch-human-path{
  fill:none;
  stroke:var(--tree-human-path);
  stroke-linecap:round;
  pointer-events:none;
}
[data-theme="light"] .branch-human-path{stroke:var(--tree-human-path-light);}

/* Human path golden arrow indicator */
.human-path-arrow{
  cursor:pointer;
  transition:filter var(--transition-fast);
}
.human-path-arrow:hover{
  filter:brightness(1.3) drop-shadow(0 0 4px var(--tree-human-path));
}

/* Human path dashed continuation line */
.human-path-dash{
  fill:none;
  stroke:var(--tree-human-path);
  stroke-dasharray:4 3;
  stroke-width:1;
  opacity:0.2;
  pointer-events:none;
}

/* ── BRANCH ANIMATIONS ── */
.branch-entering{stroke-dasharray:9999;stroke-dashoffset:9999;}
.branch-entered{
  stroke-dashoffset:0;
  transition:stroke-dashoffset 0.4s cubic-bezier(.4,0,.2,1) calc(var(--stagger,0) * 80ms);
}

/* ── NODE ANIMATIONS ── */
.node-entering{opacity:0;transform:translateX(-8px);}
.node-entered{
  opacity:1;transform:translateX(0);
  transition:opacity 0.3s ease calc(var(--stagger,0) * 80ms),
             transform 0.3s ease calc(var(--stagger,0) * 80ms);
}

/* Sibling dimming */
.node-group.dimmed{opacity:var(--tree-sibling-dim);transition:opacity 0.2s ease;}
.branch-path.dimmed{opacity:calc(var(--tree-sibling-dim) * 0.5);transition:opacity 0.2s ease;}
.node-group.undimmed,.branch-path.undimmed{opacity:1;transition:opacity 0.2s ease;}

/* ── LUCA PULSE ── */
@keyframes lucaPulse{
  0%,100%{r:calc(var(--tree-node-size) / 2 + 4);opacity:0.4;}
  50%{r:calc(var(--tree-node-size) / 2 + 7);opacity:0.2;}
}

/* ── HOMININ GROUP CHIPS ── */
.chip-badge{
  display:inline-flex;align-items:center;gap:4px;
  padding:0 12px;border-radius:14px;
  font-family:var(--font-sans);font-size:12px;font-weight:500;
  white-space:nowrap;cursor:pointer;
  transition:background var(--transition-fast),border-color var(--transition-fast);
}

/* ── BADGE PULSE ── */
.badge-pulse{animation:badgePulse 2s ease-in-out infinite;}
@keyframes badgePulse{
  0%,100%{filter:drop-shadow(0 0 2px rgba(200,136,58,0.3));}
  50%{filter:drop-shadow(0 0 8px rgba(200,136,58,0.7));}
}

/* ── PLAYBACK LOCKED NODE ── */
.node-locked{
  fill:none;stroke:var(--text-muted);stroke-width:1.5;
  stroke-dasharray:4 3;opacity:0.35;
}

/* ── MINI-MAP ── */
#minimap{
  position:fixed;
  bottom:16px;right:16px;
  width:var(--tree-minimap-w);height:var(--tree-minimap-h);
  background:rgba(0,0,0,0.6);
  backdrop-filter:blur(4px);
  border-radius:8px;
  border:1px solid rgba(255,255,255,0.08);
  z-index:var(--z-controls);
  opacity:1;
  transition:opacity 0.3s ease;
  pointer-events:all;
  overflow:hidden;
}
#minimap.faded{opacity:0.15;}
#minimap svg{width:100%;height:100%;}
.minimap-viewport{
  fill:rgba(255,255,255,0.08);
  stroke:rgba(255,255,255,0.4);
  stroke-width:1;
  cursor:grab;
}

/* ── RESPONSIVE ── */
@media(max-width:768px){
  .node-label-name{font-size:var(--tree-label-name-size-mobile);}
  .node-label-latin{font-size:var(--tree-label-latin-size-mobile);}
  #minimap{display:none;}
}

/* ── REDUCED MOTION ── */
@media(prefers-reduced-motion:reduce){
  .branch-entered{transition:none;}
  .node-entered{transition:none;}
  .node-group.dimmed,.branch-path.dimmed,
  .node-group.undimmed,.branch-path.undimmed{transition:none;}
}
```

- [ ] **Step 2: Verify the CSS loads without errors**

Run: `node serve.js` and open `http://localhost:5555` in browser. Check DevTools console for CSS parse errors. The tree will look broken at this point (expected — renderer hasn't been updated yet).

- [ ] **Step 3: Commit**

```bash
git add css/tree.css
git commit -m "feat(tree): rewrite tree.css with photo node and branch styles"
```

---

### Task 3: Update SVG Defs and Hide Timeline View Button

**Files:**
- Modify: `index.html:119-132` (SVG defs)
- Modify: `index.html:238` (Timeline button)

- [ ] **Step 1: Add gradient defs for branch coloring**

In `index.html`, find the `<defs>` block (lines 119-133). Add these new gradient definitions BEFORE the closing `</defs>` tag (before line 133):

```html
      <!-- Branch gradient template (cloned per-branch in JS) -->
      <linearGradient id="branch-grad-template" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#8b6a3a"/>
        <stop offset="100%" stop-color="#8b6a3a"/>
      </linearGradient>
      <!-- Human path glow endpoint -->
      <radialGradient id="human-path-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#c8883a" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#c8883a" stop-opacity="0"/>
      </radialGradient>
      <!-- Node fallback gradient template -->
      <radialGradient id="node-fallback-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#8b6a3a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#8b6a3a" stop-opacity="0.05"/>
      </radialGradient>
```

- [ ] **Step 2: Hide the Timeline view button**

In `index.html`, find line 238:
```html
  <button class="view-btn" data-mode="chronological" onclick="setViewMode('chronological')">&#8594; Timeline</button>
```

Replace with:
```html
  <!-- Timeline view deferred — hidden but not deleted -->
  <button class="view-btn" data-mode="chronological" onclick="setViewMode('chronological')" style="display:none">&#8594; Timeline</button>
```

- [ ] **Step 3: Add minimap container**

In `index.html`, find line 139 (`</svg>` closing tag inside `canvas-wrap`). Add AFTER the `</svg>` but BEFORE the closing `</div>` of `canvas-wrap`:

```html
  <!-- MINI-MAP -->
  <div id="minimap" class="faded" aria-hidden="true">
    <svg id="minimap-svg" viewBox="0 0 120 80"></svg>
  </div>
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(tree): add SVG gradient defs, minimap container, hide timeline button"
```

---

### Task 4: Rewrite Layout — New Horizontal Cladogram

**Files:**
- Modify: `js/layout.js`

- [ ] **Step 1: Rewrite `layoutCladogram()` with new spacing algorithm**

Replace the existing `layoutCladogram()` function (lines 100-138) with:

```js
export function layoutCladogram(){
  const isRtl=document.documentElement.dir==='rtl';
  const W=window.innerWidth,H=window.innerHeight;
  const marginL=80,marginR=60,marginV=60;
  const isMobile=W<768;
  const nodeSize=isMobile?44:52;
  const minGap=isMobile?56:64; // nodeSize + 12px breathing room
  const GROUP_GAP_FACTOR=1.5;

  // Find max visible depth
  function maxDepth(n,d){
    if(!n.children||!n.children.length||n._collapsed) return d;
    let m=d;
    n.children.forEach(c=>{m=Math.max(m,maxDepth(c,d+1));});
    return m;
  }
  const mxd=Math.max(1,maxDepth(TREE,0));
  const depthSpacing=Math.min(220,Math.max(140,(W-marginL-marginR)/mxd));

  // Count visible leaves for vertical spacing
  function countLeaves(n){
    if(!n.children||!n.children.length||n._collapsed) return 1;
    let c=0;
    n.children.forEach(ch=>c+=countLeaves(ch));
    // Add gap for hominin group boundaries
    if(n.id==='hominini'){
      const groups=n.children.filter(ch=>ch._isHomininGroup);
      c+=Math.max(0,(groups.length-1))*GROUP_GAP_FACTOR;
    }
    return c;
  }
  const totalLeaves=countLeaves(TREE);
  const leafSpacing=Math.max(minGap,(H-marginV*2)/totalLeaves);

  let leafIdx=0;
  let lastHomininGroup=null;

  function assign(n,depth){
    if(!n.children||!n.children.length||n._collapsed){
      // Insert vertical gap between hominin groups
      if(n._parent&&n._parent._isHomininGroup){
        const gid=n._parent.id;
        if(lastHomininGroup&&lastHomininGroup!==gid) leafIdx+=GROUP_GAP_FACTOR;
        lastHomininGroup=gid;
      }
      const x=marginL+depth*depthSpacing;
      n._x=isRtl?W-x:x;
      n._y=marginV+leafIdx*leafSpacing;
      n._angle=0;
      leafIdx++;
    } else {
      n.children.forEach(c=>assign(c,depth+1));
      const ys=n.children.map(c=>c._y);
      const x=marginL+depth*depthSpacing;
      n._x=isRtl?W-x:x;
      n._y=(Math.min(...ys)+Math.max(...ys))/2;
      n._angle=0;
    }
  }
  assign(TREE,0);
}
```

- [ ] **Step 2: Stub out `layoutChronological()`**

Replace the existing `layoutChronological()` function (lines 140-159) with:

```js
export function layoutChronological(){
  // TODO: timeline view deferred — fall back to cladogram
  layoutCladogram();
}
```

- [ ] **Step 3: Verify layout module exports still match**

Run: `grep "export function" js/layout.js`
Expected output should include: `getVisible`, `getVisibleEdges`, `leafCount`, `countDescendants`, `assignAngles`, `assignPositions`, `layoutRadial`, `layoutCladogram`, `layoutChronological`, `layoutPlayback`, `layout`.

- [ ] **Step 4: Commit**

```bash
git add js/layout.js
git commit -m "feat(tree): rewrite layoutCladogram() with horizontal spacing, stub timeline"
```

---

### Task 5: Update `app.js` — Default to Cladogram View

**Files:**
- Modify: `js/app.js:165-180` (`setViewMode` function)

- [ ] **Step 1: Update `setViewMode()` to handle chronological gracefully**

Replace the `setViewMode` function (lines 165-180) with:

```js
function setViewMode(mode){
  if(state.playbackMode&&mode!=='playback') exitPlaybackMode();
  if(mode==='playback'){enterPlaybackMode();return;}
  // Chronological is deferred — silently redirect to cladogram
  if(mode==='chronological') mode='cladogram';
  state.viewMode=mode;
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.mode===mode);
  });
  animDone.clear();
  layout();
  if(mode==='radial'){centerOnRoot(0.18);}
  else if(mode==='cladogram'){centerOnTree(0.7);}
  scheduleRender(true);applyT();
  a11yAnnounce('Switched to '+mode+' view');
  trackViewMode(mode);
}
```

- [ ] **Step 2: Verify the app still loads**

Run: Open `http://localhost:5555`, switch between Radial and Cladogram views. Timeline button should be hidden. No console errors.

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat(tree): default setViewMode handles chronological redirect"
```

---

### Task 6: Rewrite Renderer — Branch Rendering

This is the first half of the renderer rewrite. It replaces the branch rendering logic with gradient-colored, tapered, organic S-curves.

**Files:**
- Modify: `js/renderer.js:1-85` (imports, helpers, branchPath)
- Modify: `js/renderer.js:109-173` (branch rendering in `render()`)

- [ ] **Step 1: Update `branchPath()` for horizontal cladogram**

Replace the existing `branchPath()` function (lines 71-85) with:

```js
export function branchPath(x1,y1,x2,y2){
  if(state.viewMode==='cladogram'){
    // Organic S-curve with wobble for horizontal layout
    const dx=x2-x1,dy=y2-y1;
    const dist=Math.hypot(dx,dy)||1;
    const seed=(((x1*7+y1*13+x2*11+y2*17)%1000)+1000)%1000/1000;
    const wobble=(seed-0.5)*Math.abs(dy)*0.10;
    const isRtl=document.documentElement.dir==='rtl';
    const dir=isRtl?-1:1;
    const cx1=x1+dx*0.5*dir+wobble;
    const cx2=x1+dx*0.5*dir-wobble*0.5;
    return `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`;
  }
  if(state.viewMode==='chronological'){return `M${x1},${y1} L${x2},${y2}`;}
  if(state.viewMode==='playback'){return `M${x1},${y1} C${x1+(x2-x1)*0.5},${y1} ${x1+(x2-x1)*0.5},${y2} ${x2},${y2}`;}
  // Radial: organic curve with perpendicular wobble
  const dx=x2-x1,dy=y2-y1;
  const dist=Math.hypot(dx,dy)||1;
  const px=-dy/dist,py=dx/dist;
  const seed=(((x1*7+y1*13+x2*11+y2*17)%1000)+1000)%1000/1000;
  const wobble=(seed-0.5)*dist*0.10;
  const c1x=x1+dx*0.3+px*(dist*0.22+wobble);
  const c1y=y1+dy*0.3+py*(dist*0.22+wobble);
  const c2x=x1+dx*0.7+px*(dist*0.10-wobble*0.5);
  const c2y=y1+dy*0.7+py*(dist*0.10-wobble*0.5);
  return `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
}
```

- [ ] **Step 2: Add branch gradient helper**

Add this new function AFTER the `branchPath()` function:

```js
// Create or reuse SVG linearGradient for a branch
const _gradCache=new Map();
function getBranchGradId(fromColor,toColor){
  const key=fromColor+'|'+toColor;
  if(_gradCache.has(key)) return _gradCache.get(key);
  const id='bg-'+(Math.random()*1e9|0);
  const defs=document.getElementById('svg').querySelector('defs');
  const grad=document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
  grad.id=id;
  grad.setAttribute('x1','0');grad.setAttribute('y1','0');
  grad.setAttribute('x2','1');grad.setAttribute('y2','0');
  const s1=document.createElementNS('http://www.w3.org/2000/svg','stop');
  s1.setAttribute('offset','0%');s1.setAttribute('stop-color',fromColor);
  const s2=document.createElementNS('http://www.w3.org/2000/svg','stop');
  s2.setAttribute('offset','100%');s2.setAttribute('stop-color',toColor);
  grad.appendChild(s1);grad.appendChild(s2);
  defs.appendChild(grad);
  _gradCache.set(key,id);
  return id;
}

// Get branch stroke width by depth (tapering)
function getBranchWidth(depth){
  if(depth<=0) return 5;
  if(depth===1) return 3.5;
  if(depth===2) return 2.5;
  return 1.5;
}

// Get branch opacity by depth
function getBranchOpacity(depth){
  if(depth<=0) return 0.8;
  if(depth===1) return 0.6;
  if(depth===2) return 0.45;
  return 0.3;
}

// Clear gradient cache on full re-render
export function clearGradCache(){ _gradCache.clear(); }
```

- [ ] **Step 3: Update branch rendering in `render()`**

Replace the branch rendering section inside `render()` (the `// Branches` block, from `const humanPathEdges=[];` to `evoPathEdges.forEach(...)`) with:

```js
  // Branches
  const humanPathEdges=[];
  const branchBrown=getComputedStyle(document.documentElement).getPropertyValue('--tree-branch-brown').trim()||'#8b6a3a';

  edges.forEach(({from,to})=>{
    if(to._domain && to._domain!=='luca' && !state.activeDomains.has(to._domain)) return;
    if(!state.showExtinct && to.extinct) return;

    // Playback: skip branch if child is hidden
    if(state.playbackMode){
      const childState=state.playbackNodeStates.get(to.id)||getPlaybackNodeState(to);
      if(childState==='hidden') return;
    }
    // Viewport culling
    if(!isInView(from._x,from._y,vb)&&!isInView(to._x,to._y,vb)) return;

    const inEra=nodeInEra(to);
    const onHumanPath=HUMAN_PATH.has(from.id)&&HUMAN_PATH.has(to.id);
    const onEvoPath=state.evoPathActive&&state.evoPathEdgeSet.has(from.id+'|'+to.id);

    // Branch path element
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    const d=branchPath(from._x,from._y,to._x,to._y);
    p.setAttribute('d',d);
    p.setAttribute('class','branch-path');

    // Tapering width and opacity
    const sw=getBranchWidth(to.depth);
    let op=getBranchOpacity(to.depth);

    // Playback dimming
    if(state.playbackMode){
      const childState=state.playbackNodeStates.get(to.id)||getPlaybackNodeState(to);
      if(childState==='locked') op=0.12;
    }
    if(!inEra) op=0.12;

    // Gradient color: brown → domain color (depth 0-1), parent domain → child domain (depth 2+)
    if(state.viewMode==='cladogram'&&!onEvoPath){
      const fromColor=to.depth<=1?branchBrown:(from.color||branchBrown);
      const toColor=to.color||branchBrown;
      const gradId=getBranchGradId(fromColor,toColor);
      p.setAttribute('stroke','url(#'+gradId+')');
    } else {
      p.setAttribute('stroke',onEvoPath?'var(--accent-secondary)':to.color);
    }

    p.setAttribute('stroke-width',onEvoPath||onHumanPath?Math.max(sw,2):sw);
    p.setAttribute('stroke-opacity',onEvoPath?0.95:op);

    // Entrance animation
    if(!animDone.has(to.id)){
      if(state.playbackMode){
        const len=9999;p.style.strokeDasharray=len;p.style.strokeDashoffset=len;
        p.classList.add('branch-pb-grow');
        setTimeout(()=>{p.style.strokeDashoffset=0;},30);
      } else if(!reducedMotion()){
        p.style.setProperty('--stagger',to._sibIndex||0);
        p.classList.add('branch-entering');
        animDeferred.push(p);
      }
    }

    branchFrag.appendChild(p);

    // Collect human path branches for overlay
    if(onHumanPath) humanPathEdges.push({d,depth:to.depth});
    if(onEvoPath){
      // Evo path rendered inline with accent color (already handled above)
    }
  });

  // Human path golden overlay — drawn on top
  humanPathEdges.forEach(({d,depth})=>{
    const hp=document.createElementNS('http://www.w3.org/2000/svg','path');
    hp.setAttribute('d',d);
    hp.setAttribute('class','branch-human-path');
    hp.setAttribute('stroke-width',depth<=1?2:1.5);
    hp.setAttribute('stroke-opacity',depth<=1?0.5:0.4);
    branchFrag.appendChild(hp);
  });
```

- [ ] **Step 4: Verify branches render with gradients**

Run: Open `http://localhost:5555`, switch to Cladogram view. Branches should have warm brown→domain color gradients, tapered widths, and organic S-curves. Human path should show golden overlay.

- [ ] **Step 5: Commit**

```bash
git add js/renderer.js
git commit -m "feat(tree): gradient branches with tapering and organic S-curves"
```

---

### Task 7: Rewrite Renderer — Photo Node Rendering

This is the second half of the renderer rewrite. It replaces the node rendering logic with circular photo portraits, collapsed indicators, and proper hover effects.

**Files:**
- Modify: `js/renderer.js` (node rendering section in `render()`, lines 175-600+)

- [ ] **Step 1: Add node size helper at the top of the file (after imports)**

Add after the existing `initRendererDeps` function:

```js
// Node diameter based on viewport
function getNodeR(){
  return window.innerWidth<768?22:26; // radius = half of 44px or 52px
}

// Count collapsed siblings visible at the same level
function countCollapsedSiblings(node){
  if(!node._parent||!node._parent.children) return 0;
  return node._parent.children.filter(sib=>sib._collapsed&&sib.children&&sib.children.length).length;
}
```

- [ ] **Step 2: Rewrite the node rendering block inside `render()`**

Replace the entire `// Nodes` section (from `const pendingLabels=[];` through the label collision resolution and through `nodesLayer.replaceChildren(nodesFrag);`) with the new node rendering code. This is the largest change:

```js
  // Nodes
  const pendingLabels=[];
  const nodeR=getNodeR();
  const nodeD=nodeR*2;

  nodes.forEach(n=>{
    if(n._domain && n._domain!=='luca' && !state.activeDomains.has(n._domain)) return;
    if(!state.showExtinct && n.extinct) return;
    if(!isInView(n._x,n._y,vb)) return;

    // Playback locked/hidden
    const pbState=state.playbackMode?(state.playbackNodeStates.get(n.id)||getPlaybackNodeState(n)):null;
    if(state.playbackMode&&pbState==='hidden') return;

    if(state.playbackMode&&pbState==='locked'){
      // Locked node (playback) — keep existing behavior
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('class','node-group');
      g.style.cursor='pointer';
      const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hit.setAttribute('cx',n._x);hit.setAttribute('cy',n._y);hit.setAttribute('r',nodeR+14);
      hit.setAttribute('fill','transparent');hit.style.cursor='pointer';
      hit.addEventListener('click',e=>{e.stopPropagation();discoverNode(n);});
      g.appendChild(hit);
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx',n._x);c.setAttribute('cy',n._y);c.setAttribute('r',nodeR);
      c.setAttribute('class','node-locked');
      c.addEventListener('click',e=>{e.stopPropagation();discoverNode(n);});
      g.appendChild(c);
      const qm=document.createElementNS('http://www.w3.org/2000/svg','text');
      qm.setAttribute('x',n._x);qm.setAttribute('y',n._y+4);
      qm.setAttribute('text-anchor','middle');qm.setAttribute('font-size',Math.max(10,nodeR*0.6));
      qm.setAttribute('fill','var(--parchment)');qm.setAttribute('fill-opacity','0.5');
      qm.setAttribute('font-family','Inter,sans-serif');qm.setAttribute('font-weight','700');
      qm.style.pointerEvents='none';
      qm.textContent='?';
      g.appendChild(qm);
      nodesFrag.appendChild(g);
      return;
    }

    const inEra=nodeInEra(n);
    const isHighlighted=state.highlightedId===n.id;
    const isGroupChip=n.id&&n.id.startsWith('group-');
    const onHumanPath=HUMAN_PATH.has(n.id);
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','node-group');
    g.setAttribute('role','treeitem');
    g.setAttribute('tabindex',n.id==='luca'?'0':'-1');
    g.setAttribute('aria-label',n.name+(n.latin?' ('+n.latin+')':'')+(n.extinct?' - extinct':''));
    g.setAttribute('data-node-id',n.id);
    if(state.focusedNodeId===n.id) g.setAttribute('aria-selected','true');
    if(n.children&&n.children.length) g.setAttribute('aria-expanded',String(!n._collapsed));
    g.style.cursor='pointer';

    // Group chip rendering (hominin groups) — keep existing
    if(isGroupChip){
      const pillW=Math.max(n.name.length*7+32,100);
      const pillH=28;
      const px=n._x-pillW/2,py=n._y-pillH/2;
      const colAlpha=n.color+'33',colBorder=n.color+'66';
      const indicator=n._collapsed?'+':'\u2212';
      const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
      fo.setAttribute('x',px);fo.setAttribute('y',py);
      fo.setAttribute('width',pillW);fo.setAttribute('height',pillH);
      fo.style.overflow='visible';
      const chip=document.createElement('div');
      chip.className='chip-badge';
      chip.style.border=`1.5px solid ${colBorder}`;
      chip.style.background=colAlpha;
      chip.style.color=n.color;
      chip.style.height=`${pillH}px`;
      chip.textContent=`${n.icon} ${n.name} ${indicator}`;
      chip.addEventListener('mouseenter',()=>{chip.style.borderColor=n.color;chip.style.background=n.color+'44';_showTip(n.name,n.icon);});
      chip.addEventListener('mouseleave',()=>{chip.style.borderColor=colBorder;chip.style.background=colAlpha;_hideTip();});
      fo.appendChild(chip);g.appendChild(fo);
      if(!animDone.has(n.id)&&!reducedMotion()){
        g.style.transformOrigin=`${n._x}px ${n._y}px`;
        g.style.setProperty('--stagger',0);
        g.classList.add('node-entering');
        animDeferred.push(g);
        setTimeout(()=>animDone.add(n.id),550);
      } else { animDone.add(n.id); }
      g.addEventListener('click',e=>{e.stopPropagation();n._collapsed=!n._collapsed;_layout();scheduleRender(true);a11yAnnounce(n.name+(n._collapsed?' collapsed':' expanded'));});
      g.addEventListener('dblclick',e=>{e.stopPropagation();_showMainPanel(n);});
      nodesFrag.appendChild(g);
      return;
    }

    // ── COLLAPSED INDICATORS (stacked cards + ghost children) ──
    const isCollapsed=n.children&&n.children.length&&n._collapsed;

    if(isCollapsed){
      const collapsedSibCount=countCollapsedSiblings(n);

      // Stacked card circles behind main node
      for(let i=2;i>=1;i--){
        const sc=document.createElementNS('http://www.w3.org/2000/svg','circle');
        sc.setAttribute('cx',n._x+i*4);sc.setAttribute('cy',n._y);sc.setAttribute('r',nodeR);
        sc.setAttribute('fill','var(--tree-node-fill)');
        sc.setAttribute('stroke',n.color);sc.setAttribute('stroke-width','1');
        sc.setAttribute('opacity',i===2?'0.2':'0.4');
        sc.setAttribute('class','node-stack-card');
        g.appendChild(sc);
      }

      // Ghost children (max 3, only if 3+ children and <8 collapsed siblings)
      if(n.children.length>=3&&collapsedSibCount<8){
        const ghostCount=Math.min(3,n.children.length);
        for(let i=0;i<ghostCount;i++){
          const child=n.children[i];
          const angle=-20+i*20; // fan arc in degrees
          const rad=angle*Math.PI/180;
          const gx=n._x+nodeR+20+i*24;
          const gy=n._y+Math.sin(rad)*16;
          const ghostR=9; // 18px diameter
          const ghostOp=[0.3,0.2,0.1][i];

          // Ghost circle
          const gc=document.createElementNS('http://www.w3.org/2000/svg','circle');
          gc.setAttribute('cx',gx);gc.setAttribute('cy',gy);gc.setAttribute('r',ghostR);
          gc.setAttribute('fill','var(--tree-node-fill)');
          gc.setAttribute('stroke',child.color||n.color);gc.setAttribute('stroke-width','1');
          gc.setAttribute('opacity',String(ghostOp));
          gc.setAttribute('class','node-ghost');
          g.appendChild(gc);

          // Ghost photo or silhouette
          if(inEra&&ImageLoader){
            const best=ImageLoader.getBestUrl(child);
            if(best.url){
              const gfo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
              gfo.setAttribute('x',gx-ghostR);gfo.setAttribute('y',gy-ghostR);
              gfo.setAttribute('width',ghostR*2);gfo.setAttribute('height',ghostR*2);
              gfo.style.pointerEvents='none';gfo.style.overflow='hidden';
              gfo.setAttribute('opacity',String(ghostOp));
              const gw=document.createElement('div');
              gw.className='node-ghost-wrap';
              gw.style.width=`${ghostR*2}px`;gw.style.height=`${ghostR*2}px`;
              const gi=document.createElement('img');
              gi.className='node-ghost-img';
              gi.src=best.url;gi.alt='';
              gi.addEventListener('error',()=>{if(gfo.parentNode)gfo.remove();});
              gw.appendChild(gi);gfo.appendChild(gw);g.appendChild(gfo);
            }
          }
        }
      }

      // Count badge (only if descendant count > 2)
      const totalKids=countDescendants(n);
      if(totalKids>2){
        const bx=n._x+nodeR*0.65,by=n._y-nodeR*0.65;
        const badgeW=totalKids>=100?28:totalKids>=10?22:18;
        const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');
        rect.setAttribute('x',bx-badgeW/2);rect.setAttribute('y',by-9);
        rect.setAttribute('width',badgeW);rect.setAttribute('height',18);
        rect.setAttribute('rx','9');
        rect.setAttribute('class','node-badge-bg');
        g.appendChild(rect);
        const bt=document.createElementNS('http://www.w3.org/2000/svg','text');
        bt.setAttribute('x',bx);bt.setAttribute('y',by);
        bt.setAttribute('text-anchor','middle');bt.setAttribute('dominant-baseline','central');
        bt.setAttribute('fill','#fff');bt.setAttribute('font-size','9');
        bt.setAttribute('font-weight','700');bt.setAttribute('font-family','Inter,sans-serif');
        bt.style.pointerEvents='none';
        bt.textContent=String(totalKids);
        g.appendChild(bt);
      }
    }

    // ── HUMAN PATH: golden border + arrow for collapsed human-path nodes ──
    const isOnHumanPathCollapsed=isCollapsed&&onHumanPath;
    const borderColor=isOnHumanPathCollapsed?'var(--tree-human-path)':n.color;
    const borderWidth=n.depth===0?3.5:n.depth<=1?2.5:2;

    // Highlight ring (search)
    if(isHighlighted){
      const hl=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hl.setAttribute('cx',n._x);hl.setAttribute('cy',n._y);hl.setAttribute('r',nodeR+6);
      hl.setAttribute('fill','none');hl.setAttribute('stroke','#c8883a');
      hl.setAttribute('stroke-width','2');hl.setAttribute('stroke-opacity','0.9');
      g.appendChild(hl);
    }

    // LUCA pulse ring
    if(n.depth===0){
      const pulse=document.createElementNS('http://www.w3.org/2000/svg','circle');
      pulse.setAttribute('cx',n._x);pulse.setAttribute('cy',n._y);pulse.setAttribute('r',nodeR+4);
      pulse.setAttribute('fill','none');pulse.setAttribute('stroke','#c8883a');
      pulse.setAttribute('stroke-width','1.5');pulse.setAttribute('stroke-opacity','0.4');
      if(!reducedMotion()){
        pulse.innerHTML=`<animate attributeName="r" values="${nodeR+4};${nodeR+7};${nodeR+4}" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.2;0.4" dur="3s" repeatCount="indefinite"/>`;
      }
      g.appendChild(pulse);
    }

    // Human path accent ring (for expanded human-path nodes)
    if(onHumanPath&&n.depth>0&&!isOnHumanPathCollapsed){
      const hpRing=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hpRing.setAttribute('cx',n._x);hpRing.setAttribute('cy',n._y);hpRing.setAttribute('r',nodeR+4);
      hpRing.setAttribute('fill','none');hpRing.setAttribute('stroke','var(--tree-human-path)');
      hpRing.setAttribute('stroke-width','1.2');hpRing.setAttribute('stroke-opacity','0.5');
      hpRing.setAttribute('stroke-dasharray','3 3');
      g.appendChild(hpRing);
    }

    // Invisible hit area
    const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
    hit.setAttribute('cx',n._x);hit.setAttribute('cy',n._y);hit.setAttribute('r',nodeR+12);
    hit.setAttribute('fill','transparent');hit.style.cursor='pointer';
    g.appendChild(hit);

    // Main circle (dark background behind photo)
    const bg=document.createElementNS('http://www.w3.org/2000/svg','circle');
    bg.setAttribute('cx',n._x);bg.setAttribute('cy',n._y);bg.setAttribute('r',nodeR);
    bg.setAttribute('fill',n.depth===0?'url(#rootGrad)':'var(--tree-node-fill)');
    if(!inEra) bg.setAttribute('opacity','0.3');
    g.appendChild(bg);

    // Domain color tint (for fallback / behind photo)
    if(n.depth>0){
      const tint=document.createElementNS('http://www.w3.org/2000/svg','circle');
      tint.setAttribute('cx',n._x);tint.setAttribute('cy',n._y);tint.setAttribute('r',nodeR);
      tint.setAttribute('fill',n.color);tint.setAttribute('opacity','0.2');
      g.appendChild(tint);
    }

    // Silhouette icon fallback (always rendered behind photo)
    if(inEra){
      const ig=getIconGroup(n);
      const iconPath=NODE_ICONS[ig]||NODE_ICONS.default;
      const s=Math.max(14,nodeR*1.1);
      const icon=document.createElementNS('http://www.w3.org/2000/svg','path');
      icon.setAttribute('d',iconPath);
      icon.setAttribute('fill',document.documentElement.getAttribute('data-theme')==='light'?'rgba(30,30,30,0.5)':'rgba(255,255,255,0.7)');
      icon.setAttribute('transform',`translate(${n._x-s/2},${n._y-s/2}) scale(${s/24})`);
      icon.setAttribute('class','node-fallback-icon');
      g.appendChild(icon);

      // Photo overlay via foreignObject
      if(ImageLoader){
        const cachedUrl=confirmedPhotoUrls.get(n.id);
        const best=cachedUrl?{url:cachedUrl}:ImageLoader.getBestUrl(n);
        if(best.url){
          const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
          fo.setAttribute('x',n._x-nodeR);fo.setAttribute('y',n._y-nodeR);
          fo.setAttribute('width',nodeD);fo.setAttribute('height',nodeD);
          fo.style.pointerEvents='none';fo.style.overflow='hidden';
          const wrap=document.createElement('div');
          wrap.className='node-img-wrap';
          wrap.style.width=`${nodeD}px`;wrap.style.height=`${nodeD}px`;
          const htmlImg=document.createElement('img');
          htmlImg.className='node-img';
          htmlImg.alt=n.name||'';
          htmlImg.addEventListener('load',function(){this.classList.add('loaded');});
          if(cachedUrl){
            htmlImg.addEventListener('error',function(){
              if(!this.dataset.retried){this.dataset.retried='1';this.src=cachedUrl+'?retry=1';}
              else{if(fo.parentNode)fo.remove();confirmedPhotoUrls.delete(n.id);}
            });
            htmlImg.src=cachedUrl;
          } else {
            ImageLoader.loadInto(n,htmlImg,{
              onLoad:function(){confirmedPhotoUrls.set(n.id,htmlImg.src);},
              onFallback:function(){if(fo.parentNode)fo.remove();}
            });
          }
          wrap.appendChild(htmlImg);fo.appendChild(wrap);g.appendChild(fo);
        }
      }
    }

    // Border circle (domain-colored, ON TOP of photo)
    const border=document.createElementNS('http://www.w3.org/2000/svg','circle');
    border.setAttribute('cx',n._x);border.setAttribute('cy',n._y);border.setAttribute('r',nodeR);
    border.setAttribute('fill','none');
    border.setAttribute('stroke',borderColor);
    border.setAttribute('stroke-width',String(borderWidth));
    border.setAttribute('class','node-border');
    border.style.setProperty('--nc',n.color);
    if(n.extinct){border.setAttribute('stroke-dasharray','4 2');border.setAttribute('opacity','0.6');}
    g.appendChild(border);

    // Golden arrow indicator for collapsed human-path nodes
    if(isOnHumanPathCollapsed){
      const arrowX=n._x+nodeR+10,arrowY=n._y;
      const arrow=document.createElementNS('http://www.w3.org/2000/svg','text');
      arrow.setAttribute('x',arrowX);arrow.setAttribute('y',arrowY+1);
      arrow.setAttribute('text-anchor','middle');arrow.setAttribute('dominant-baseline','central');
      arrow.setAttribute('fill','var(--tree-human-path)');
      arrow.setAttribute('font-size','16');arrow.setAttribute('font-weight','700');
      arrow.setAttribute('font-family','Inter,sans-serif');
      arrow.setAttribute('class','human-path-arrow');
      arrow.style.cursor='pointer';
      arrow.textContent='→';
      arrow.addEventListener('click',e=>{
        e.stopPropagation();
        autoExpandHumanPath(n);
      });
      g.appendChild(arrow);

      // Glow endpoint
      const glow=document.createElementNS('http://www.w3.org/2000/svg','circle');
      glow.setAttribute('cx',n._x+nodeR);glow.setAttribute('cy',n._y);glow.setAttribute('r','8');
      glow.setAttribute('fill','url(#human-path-glow)');glow.style.pointerEvents='none';
      g.appendChild(glow);

      // Dashed continuation line
      const dash=document.createElementNS('http://www.w3.org/2000/svg','line');
      dash.setAttribute('x1',arrowX+8);dash.setAttribute('y1',arrowY);
      dash.setAttribute('x2',n._x+500);dash.setAttribute('y2',arrowY);
      dash.setAttribute('class','human-path-dash');
      g.appendChild(dash);
    }

    // ── LABELS ──
    if(inEra){
      const labelText=n._hominData?n._hominData.short:n.name;
      const latinText=n.latin||'';
      const fontSize=n.depth===0?14:11;
      const ly=n._y+nodeR+14;
      const textW=labelText.length*fontSize*0.55;
      const textH=fontSize+12; // name + latin
      const bx=n._x-textW/2;
      pendingLabels.push({n,lx:n._x,ly,fontSize,textW,textH,bx,by:ly-textH/2,labelText,latinText,g,onHumanPath});
    }

    // Hover events
    g.addEventListener('mouseenter',()=>{_showTip(n.name,n.icon,n.funFact);});
    g.addEventListener('mouseleave',()=>{_hideTip();});

    // Animate in
    if(!state.playbackMode&&!animDone.has(n.id)){
      if(reducedMotion()){
        animDone.add(n.id);
      } else {
        g.style.setProperty('--stagger',n._sibIndex||0);
        g.classList.add('node-entering');
        animDeferred.push(g);
        setTimeout(()=>animDone.add(n.id),600);
      }
    }

    // Click events
    g.addEventListener('click',e=>{
      e.stopPropagation();
      if(state.playbackMode){showDiscoveryCard(n);return;}
      if(n.children&&n.children.length){
        const wasCollapsed=n._collapsed;
        if(wasCollapsed&&n._parent&&n._parent.children){
          n._parent.children.forEach(sib=>{
            if(sib!==n&&sib.children&&!sib._collapsed) sib._collapsed=true;
          });
        }
        n._collapsed=!n._collapsed;
        _layout();scheduleRender(true);
        a11yAnnounce(n.name+(n._collapsed?' collapsed':' expanded'));
        if(!n._collapsed){
          setTimeout(()=>{
            const kids=getVisible(n).filter(k=>k._parent===n);
            if(!kids.length) return;
            const allPts=[n,...kids];
            const xs=allPts.map(k=>k._x),ys=allPts.map(k=>k._y);
            const bw=(Math.max(...xs)-Math.min(...xs))||200;
            const bh=(Math.max(...ys)-Math.min(...ys))||200;
            const svgR=(document.getElementById('canvas-wrap')||document.getElementById('svg')).getBoundingClientRect();
            const fitScale=Math.min(svgR.width*0.8/bw,svgR.height*0.8/bh);
            const targetS=Math.min(2.0,Math.max(state.transform.s,fitScale));
            _smoothZoomTo((Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2,targetS);
            if(_updateBreadcrumb) _updateBreadcrumb(n);
          },100);
        }
      } else {
        _showMainPanel(n);
      }
    });
    g.addEventListener('dblclick',e=>{e.stopPropagation();e.preventDefault();if(!state.playbackMode)_showMainPanel(n);});
    nodesFrag.appendChild(g);
  });

  // ── LABEL COLLISION RESOLUTION ──
  pendingLabels.sort((a,b)=>{
    const aHP=a.onHumanPath?0:1;
    const bHP=b.onHumanPath?0:1;
    if(aHP!==bHP) return aHP-bHP;
    if(a.n.depth<=1&&b.n.depth>1) return -1;
    if(b.n.depth<=1&&a.n.depth>1) return 1;
    return a.n.depth-b.n.depth;
  });
  const labelGrid=createSpatialHash(100);
  function boxesOverlap(a,b){
    return a.bx<b.bx+b.textW&&a.bx+a.textW>b.bx&&a.by<b.by+b.textH&&a.by+a.textH>b.by;
  }
  pendingLabels.forEach(lb=>{
    const forceShow=lb.n.depth<=1||lb.onHumanPath;
    if(!forceShow){
      const nearby=labelGrid.query(lb);
      for(const placed of nearby){
        if(boxesOverlap(lb,placed)) return;
      }
    }
    labelGrid.insert(lb);

    // Species name
    const svgText=document.createElementNS('http://www.w3.org/2000/svg','text');
    svgText.setAttribute('x',lb.lx);svgText.setAttribute('y',lb.ly);
    svgText.setAttribute('text-anchor','middle');
    svgText.setAttribute('fill',lb.onHumanPath?'var(--tree-human-path)':lb.n.color);
    svgText.setAttribute('font-size',lb.fontSize);
    svgText.setAttribute('class','node-label-name');
    svgText.textContent=lb.labelText;
    lb.g.appendChild(svgText);

    // Latin name (below species name)
    if(lb.latinText){
      const latin=document.createElementNS('http://www.w3.org/2000/svg','text');
      latin.setAttribute('x',lb.lx);latin.setAttribute('y',lb.ly+12);
      latin.setAttribute('text-anchor','middle');
      latin.setAttribute('class','node-label-latin');
      latin.textContent=lb.latinText;
      lb.g.appendChild(latin);
    }
  });

  branchLayer.replaceChildren(branchFrag);
  nodesLayer.replaceChildren(nodesFrag);

  // Batch-trigger entrance animations
  if(animDeferred.length){
    requestAnimationFrame(()=>{
      for(const el of animDeferred){
        el.classList.add(el.tagName==='path'?'branch-entered':'node-entered');
      }
    });
  }

  // Restore keyboard focus
  if(state.focusedNodeId){
    const fg=document.querySelector('.node-group[data-node-id="'+state.focusedNodeId+'"]');
    if(fg) fg.focus({preventScroll:true});
  }
```

- [ ] **Step 3: Add `autoExpandHumanPath()` function**

Add this function BEFORE the `render()` function:

```js
// Auto-expand human path from a collapsed node (max 4 levels)
function autoExpandHumanPath(startNode){
  let current=startNode;
  let expanded=0;
  const MAX_DEPTH=4;
  while(current&&expanded<MAX_DEPTH){
    if(!current.children||!current.children.length) break;
    current._collapsed=false;
    expanded++;
    // Find the child on human path
    const hpChild=current.children.find(c=>HUMAN_PATH.has(c.id));
    if(!hpChild) break;
    // If hpChild has non-human-path siblings, stop expanding (branch point)
    const nonHpSiblings=current.children.filter(c=>c!==hpChild);
    if(nonHpSiblings.length>0&&!hpChild._collapsed) break;
    current=hpChild;
  }
  _layout();scheduleRender(true);
  // Pan to the last expanded node
  setTimeout(()=>{
    if(current._x!==undefined) _smoothPanTo(current._x,current._y);
    if(_updateBreadcrumb) _updateBreadcrumb(current);
  },200);
  a11yAnnounce('Expanded human evolutionary path');
}
```

- [ ] **Step 4: Add sibling index for stagger animation**

In `js/layout.js`, add sibling index assignment at the end of the `layoutCladogram()` function, before the closing brace:

```js
  // Assign sibling indices for stagger animation
  function assignSibIndex(n){
    if(n.children&&!n._collapsed){
      n.children.forEach((c,i)=>{c._sibIndex=i;assignSibIndex(c);});
    }
  }
  assignSibIndex(TREE);
```

- [ ] **Step 5: Test the full rendering**

Run: Open `http://localhost:5555` in Cladogram view. Verify:
- Photo circles render for all visible nodes
- Silhouette icons appear behind photos
- Collapsed nodes show stacked cards + ghost children
- Human path has golden borders and arrow indicators
- Labels render below nodes with collision detection
- Hover shows glow effect without node movement

- [ ] **Step 6: Commit**

```bash
git add js/renderer.js js/layout.js
git commit -m "feat(tree): photo portrait nodes with collapsed indicators and human path"
```

---

### Task 8: Navigation — Breadcrumb Clicks and Human Path

**Files:**
- Modify: `js/navigation.js:162-194` (breadcrumb rendering)

- [ ] **Step 1: Update breadcrumb rendering to use domain colors**

Replace the `updateBreadcrumb` function (lines 162-174) with:

```js
export function updateBreadcrumb(n){
  const bc=document.getElementById('breadcrumb');
  if(n) state.focusedBranch=n;
  const target=n||state.focusedBranch;
  if(!target){bc.classList.add('hidden');return;}
  const path=getAncestors(target);
  if(path.length<1){bc.classList.add('hidden');return;}
  bc.classList.remove('hidden');

  // Truncate middle for deep paths (>6 levels)
  let displayPath=path;
  if(path.length>6){
    displayPath=[path[0],{id:'_ellipsis',name:'...',icon:'',color:''},...path.slice(-3)];
  }

  bc.innerHTML=displayPath.map((p,i)=>{
    const isLast=i===displayPath.length-1;
    const color=p.color||'var(--parchment)';
    const style=isLast?`color:${color};font-weight:600`:`color:${color};opacity:0.5`;
    if(p.id==='_ellipsis') return `<span class="bc-item" style="opacity:0.3">…</span><span class="bc-sep">›</span>`;
    return `<span class="bc-item ${isLast?'active':''}" style="${style}" onclick="${isLast?'':`collapseBelow('${p.id}')`}">${p.icon} ${p.name}</span>${isLast?'':'<span class="bc-sep">›</span>'}`;
  }).join('');
}
```

- [ ] **Step 2: Verify breadcrumb renders with colors**

Run: Open app, click to expand Animals → Vertebrates → Mammals. Breadcrumb should show: `🌐 LUCA › 🐾 Animals › 🦴 Vertebrates › 🐕 Mammals` with domain colors and the last segment bold.

- [ ] **Step 3: Commit**

```bash
git add js/navigation.js
git commit -m "feat(tree): breadcrumb with domain colors and path truncation"
```

---

### Task 9: Mini-Map

**Files:**
- Create: `js/minimap.js`
- Modify: `js/app.js` (import and wire minimap)

- [ ] **Step 1: Create `js/minimap.js`**

```js
// ══════════════════════════════════════════════════════
// MINIMAP — overview of full tree in corner
// ══════════════════════════════════════════════════════

import { state } from './state.js';
import { getVisible, getVisibleEdges } from './layout.js';
import { TREE } from './data.js';

const minimapEl=document.getElementById('minimap');
const minimapSvg=document.getElementById('minimap-svg');
let _fadeTimer=null;

// Render minimap content (tiny dots + lines)
export function renderMinimap(){
  if(!minimapEl||!minimapSvg) return;
  if(window.innerWidth<768) return; // hidden on mobile

  const nodes=getVisible(TREE);
  const edges=getVisibleEdges(TREE);
  if(nodes.length===0) return;

  // Compute bounds
  const xs=nodes.map(n=>n._x),ys=nodes.map(n=>n._y);
  const minX=Math.min(...xs),maxX=Math.max(...xs);
  const minY=Math.min(...ys),maxY=Math.max(...ys);
  const pad=40;
  const bw=(maxX-minX)||200,bh=(maxY-minY)||200;
  minimapSvg.setAttribute('viewBox',`${minX-pad} ${minY-pad} ${bw+pad*2} ${bh+pad*2}`);

  let html='';

  // Branches
  edges.forEach(({from,to})=>{
    if(to._domain&&to._domain!=='luca'&&!state.activeDomains.has(to._domain)) return;
    html+=`<line x1="${from._x}" y1="${from._y}" x2="${to._x}" y2="${to._y}" stroke="${to.color}" stroke-width="0.5" opacity="0.3"/>`;
  });

  // Nodes
  nodes.forEach(n=>{
    if(n._domain&&n._domain!=='luca'&&!state.activeDomains.has(n._domain)) return;
    html+=`<circle cx="${n._x}" cy="${n._y}" r="2" fill="${n.color}" opacity="0.6"/>`;
  });

  // Viewport indicator
  const s=state.transform.s;
  const vx=(0-state.transform.x)/s;
  const vy=(0-state.transform.y)/s;
  const vw=window.innerWidth/s;
  const vh=window.innerHeight/s;
  html+=`<rect class="minimap-viewport" x="${vx}" y="${vy}" width="${vw}" height="${vh}"/>`;

  minimapSvg.innerHTML=html;
  showMinimap();
}

function showMinimap(){
  if(!minimapEl) return;
  minimapEl.classList.remove('faded');
  clearTimeout(_fadeTimer);
  _fadeTimer=setTimeout(()=>{minimapEl.classList.add('faded');},3000);
}

export function onMinimapInteraction(){showMinimap();}
```

- [ ] **Step 2: Import and wire minimap in `app.js`**

Add import at the top of `app.js` (after the existing imports):

```js
import { renderMinimap, onMinimapInteraction } from './minimap.js';
```

Add to the `init()` function (or after layout/render calls): call `renderMinimap()` after each `scheduleRender(true)` call. The simplest way: add a listener in the existing render scheduler. In `js/renderer.js`, add at the end of `render()`:

```js
  // Update minimap after render
  if(typeof window._onRenderComplete==='function') window._onRenderComplete();
```

Then in `app.js` init section:

```js
window._onRenderComplete=renderMinimap;
```

- [ ] **Step 3: Add minimap.js to index.html**

This is an ES module, so no `<script src>` tag needed — it's imported via `app.js`.

- [ ] **Step 4: Verify minimap renders**

Run: Open app on desktop viewport. Mini-map should appear in bottom-right showing tiny dots for nodes and a viewport rectangle. It should fade after 3 seconds. Hidden on mobile.

- [ ] **Step 5: Commit**

```bash
git add js/minimap.js js/app.js js/renderer.js
git commit -m "feat(tree): add mini-map with viewport indicator and auto-fade"
```

---

### Task 10: Light Theme Support

**Files:**
- Modify: `css/theme.css`

- [ ] **Step 1: Find the `[data-theme="light"]` block in `css/theme.css` and add tree overrides**

Add these rules inside or after the existing `[data-theme="light"]` block:

```css
/* Tree redesign light overrides */
[data-theme="light"] {
  --tree-node-fill:#f0ebe4;
  --tree-branch-brown:#c4a882;
  --tree-human-path:#a06a28;
  --tree-photo-opacity:0.95;
}
[data-theme="light"] .branch-human-path{stroke:var(--tree-human-path-light);}
[data-theme="light"] .human-path-dash{stroke:var(--tree-human-path-light);}
```

- [ ] **Step 2: Verify both themes**

Run: Toggle theme with the theme button. Dark theme: warm brown branches on `#070503` background. Light theme: lighter `#c4a882` branches on `#faf8f5` background. Photo nodes should look natural in both.

- [ ] **Step 3: Commit**

```bash
git add css/theme.css
git commit -m "feat(tree): light theme overrides for tree redesign"
```

---

### Task 11: Final Integration and Smoke Test

**Files:**
- No new files — verification only

- [ ] **Step 1: Full smoke test checklist**

Open `http://localhost:5555` and verify each item:

1. ☐ Cladogram view loads by default showing LUCA + 6 domains as photo circles
2. ☐ Branches are organic S-curves with brown→domain color gradients
3. ☐ Branch width tapers from 5px (LUCA) to 1.5px (leaves)
4. ☐ Click a domain → children appear with stagger animation
5. ☐ Collapsed nodes show stacked cards + ghost children (when <8 collapsed siblings)
6. ☐ Count badge shows on collapsed nodes with >2 descendants
7. ☐ Human path golden trace visible from LUCA through expanded nodes
8. ☐ Collapsed human-path nodes show golden border + → arrow
9. ☐ Clicking → auto-expands up to 4 levels along human path
10. ☐ Sibling branches dim to 30% when a branch is expanded
11. ☐ Hover on nodes: border brightens with glow, NO movement
12. ☐ Double-click branch node → species panel opens
13. ☐ Single-click leaf node → species panel opens
14. ☐ Breadcrumb shows path with domain colors, clicking a segment collapses below
15. ☐ Back/Home buttons work (Escape/Home keys)
16. ☐ Mini-map visible on desktop, hidden on mobile
17. ☐ Radial view still works (switch via view toggle)
18. ☐ Timeline button hidden
19. ☐ Light theme: branches, nodes, labels look correct
20. ☐ Hebrew (RTL): tree mirrors, S-curves flow right-to-left
21. ☐ Playback mode still works
22. ☐ Search highlights a node with golden ring
23. ☐ No console errors

- [ ] **Step 2: Test mobile viewport (DevTools 375×667)**

1. ☐ Node size is 44px
2. ☐ Mini-map hidden
3. ☐ Breadcrumb integrated in header, not overlapping tree
4. ☐ Touch targets are large enough for tap
5. ☐ Pan/zoom works with touch

- [ ] **Step 3: Performance check**

1. ☐ Expand all domains → verify no frame drops during animation
2. ☐ Pan/zoom with 20+ nodes visible → smooth 60fps
3. ☐ No SVG gradient memory leak (check `<defs>` element count stays reasonable)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(tree): complete visual redesign — photo nodes, living wood branches, horizontal cladogram"
```

---

## Summary

| Task | Description | Files | Est. |
|------|-------------|-------|------|
| 1 | CSS variables | `css/variables.css` | 2 min |
| 2 | Tree CSS rewrite | `css/tree.css` | 5 min |
| 3 | SVG defs + hide timeline | `index.html` | 3 min |
| 4 | Layout algorithm | `js/layout.js` | 5 min |
| 5 | App.js view mode | `js/app.js` | 2 min |
| 6 | Branch rendering | `js/renderer.js` | 5 min |
| 7 | Node rendering | `js/renderer.js`, `js/layout.js` | 10 min |
| 8 | Breadcrumb navigation | `js/navigation.js` | 3 min |
| 9 | Mini-map | `js/minimap.js`, `js/app.js` | 5 min |
| 10 | Light theme | `css/theme.css` | 2 min |
| 11 | Smoke test | — | 5 min |
