# P33 — Guided Tours & Educational Mode

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p33** — adding guided walkthrough tours that narrate key evolutionary milestones.

**Your scope:** Create a tour system with step-by-step overlays, automated tree navigation, and educational narration. You add `js/tours.js` for tour data and engine, modify `index.html` for tour UI overlay and trigger buttons. You do NOT modify tree rendering algorithms, panel data, or layout functions.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Add pre-built guided tours that automatically navigate the tree while narrating evolutionary milestones — turning the Tree of Life into an educational journey, not just a reference tool.

### Success Criteria

1. At least 3 tours available: "Life's Greatest Hits", "Human Ancestry", "Mass Extinctions"
2. Each tour has 8-15 steps with: target node, narration text, highlight, auto-navigation
3. Tour overlay: step counter, narration text, Next/Prev/Exit buttons
4. Auto-navigation: tree pans/zooms to each tour stop
5. Target node highlighted with a spotlight effect (dim surroundings)
6. All narration text trilingual (EN/HE/RU)
7. Tour can be paused, resumed, and exited at any step
8. Tour trigger: button in UI or splash screen option
9. Mobile-friendly: overlay doesn't block critical controls
10. Zero console errors

---

## Tour Definitions

### Tour 1: "Life's Greatest Hits" (12 stops)

1. LUCA → "All life descends from one ancestor, ~3.8 billion years ago"
2. Bacteria → "Bacteria dominated Earth for 2 billion years"
3. Cyanobacteria → "The Great Oxidation Event — cyanobacteria created our atmosphere"
4. Eukaryota → "Endosymbiosis: a cell swallowed a bacterium, creating complex life"
5. Fungi → "Fungi colonized land before plants, preparing the soil"
6. Plants → "Photosynthesis on land — the green revolution"
7. Animals → "The Cambrian Explosion — most animal body plans appeared in 20M years"
8. Vertebrates → "The first backbones — a new architecture for life"
9. Mammals → "Mammals survived the asteroid that killed the dinosaurs"
10. Primates → "Life takes to the trees — depth perception, grasping hands"
11. Hominini → "Walking upright — the path to humanity"
12. Homo sapiens → "300,000 years young — the latest chapter"

### Tour 2: "Human Ancestry" (10 stops)

Trace HUMAN_PATH from LUCA to Homo sapiens with detailed narration at each branch point.

### Tour 3: "Mass Extinctions" (6 stops)

Visit nodes near each major extinction event, explain what died and what survived.

---

## Implementation Plan

### Phase A: Tour engine (`js/tours.js`)

```js
const TOURS = {
  greatest_hits: {
    title: { en: "Life's Greatest Hits", he: '...', ru: '...' },
    steps: [
      { nodeId: 'luca', narration: { en: '...', he: '...', ru: '...' } },
      // ...
    ]
  },
  // ...
};

const TourEngine = {
  currentTour: null,
  currentStep: 0,
  start(tourId) { ... },
  next() { ... },
  prev() { ... },
  goToStep(i) { ... },
  exit() { ... }
};
```

### Phase B: Tour overlay UI

```html
<div id="tour-overlay" class="hidden">
  <div class="tour-card">
    <div class="tour-progress">Step 3 / 12</div>
    <p class="tour-narration">...</p>
    <div class="tour-controls">
      <button onclick="TourEngine.prev()">← Prev</button>
      <button onclick="TourEngine.next()">Next →</button>
      <button onclick="TourEngine.exit()">Exit</button>
    </div>
  </div>
</div>
```

### Phase C: Spotlight effect

On each tour step:
1. Dim entire tree (opacity 0.2 overlay on SVG container)
2. Spotlight the target node (clip-path or separate highlight layer)
3. Animate pan/zoom to center target node

### Phase D: Tour trigger

Add "Guided Tours" button inside the intro overlay or as a menu option.

---

## Files You Will Create

| File | Contents |
|------|----------|
| `js/tours.js` | `TOURS` data (3 tours, trilingual), `TourEngine` (start/next/prev/exit) |

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | Tour overlay HTML, tour CSS, tour trigger button, `<script src="js/tours.js">` |
| `js/uiData.js` | Tour-related translation keys (button labels, step counter text) |
| `PROJECT_PROGRESS.md` | Add p33 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

---

## Testing Checklist

1. Start "Life's Greatest Hits" → overlay appears with step 1
2. Next → tree pans to step 2 node, narration updates
3. Prev → returns to step 1
4. Complete all steps → tour ends, overlay dismisses
5. Exit mid-tour → overlay dismisses, tree state restored
6. Switch to Hebrew → narration in Hebrew
7. Switch to Russian → narration in Russian
8. Mobile: overlay usable, controls reachable
9. Start tour → panel closes if open
10. Each step's target node highlighted with spotlight
11. Zero console errors
