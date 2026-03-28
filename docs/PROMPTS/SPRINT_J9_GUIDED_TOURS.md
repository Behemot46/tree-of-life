# Sprint J9 — Guided Educational Tours

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` — resolve merge conflicts first
4. Check if js/tour.js already exists (may have been created in earlier milestone)
5. Understand the achievement system from J6 (if completed)
6. Read the HUMAN_PATH Set and extinction marker data

**After ALL code changes:**
1. Complete each tour end-to-end (all 3 tours)
2. Test keyboard navigation through tour steps (arrows, Escape)
3. Test on mobile 375×812
4. Verify tour completion triggers achievement (if J6 is done)
5. Commit: `feat: J9 — three guided educational tour paths`
6. Push branch and create PR to main
7. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md

---

## Sprint Goal

Build 3 guided tour paths that make the Tree of Life approachable for first-timers and useful for classrooms.

## Tasks

### 1. Tour Engine

**Core mechanism:**
- Array of step objects, each with: target element/node, title, description, position
- Box-shadow spotlight: `box-shadow: 0 0 0 9999px rgba(0,0,0,0.75)` on a positioned overlay matching the target element's bounds
- Narration card positioned relative to spotlight (above, below, left, right — auto-positioned)
- Controls: "Next", "Back", "Skip" (+ step counter "3/8")

**Tour step shape:**
```js
{
  target: '#element-id' | { nodeId: 'luca' },  // CSS selector or tree node
  title: 'Welcome to the Tree of Life',
  description: 'This interactive map shows...',
  position: 'bottom',  // card position relative to target
  action: null | () => { /* auto-action: expand node, zoom, etc. */ }
}
```

**If a step targets a tree node:**
- Auto-pan/zoom to center that node
- Highlight the node (use existing `highlightedId` mechanism)
- Wait for pan animation to complete before showing card

**Keyboard:**
- Right arrow / Enter → Next step
- Left arrow → Previous step
- Escape → End tour

### 2. Tour 1: "From LUCA to You" (8 steps)

Walk the HUMAN_PATH from root to Homo sapiens:

| Step | Node | Title | Key message |
|------|------|-------|-------------|
| 1 | — (overview) | Welcome | "Let's trace your ancestry across 3.8 billion years" |
| 2 | luca | LUCA | "Every living thing descends from this single ancestor" |
| 3 | eukaryota | The Great Leap | "Cells with nuclei changed everything" |
| 4 | animalia | Animals Emerge | "From sponges to the Cambrian explosion" |
| 5 | vertebrates | Getting a Backbone | "The first fish-like creatures with spinal cords" |
| 6 | mammals | Mammals Rise | "After the dinosaurs fell, mammals took over" |
| 7 | primates | Our Primate Family | "Opposable thumbs, forward-facing eyes, big brains" |
| 8 | h_sapiens | You Are Here | "300,000 years young — and still evolving" |

**Auto-actions:** Expand collapsed branches along HUMAN_PATH as the tour progresses.

### 3. Tour 2: "The Five Kingdoms" (7 steps)

| Step | Node | Title | Key message |
|------|------|-------|-------------|
| 1 | — (overview) | Life's Diversity | "Life split into vastly different kingdoms" |
| 2 | bacteria | Bacteria | "The original life form — still the most abundant" |
| 3 | archaea | Archaea | "Extremophiles that thrive where nothing else can" |
| 4 | protists | Protists | "The forgotten kingdom — neither plant, animal, nor fungus" |
| 5 | fungi | Fungi | "Earth's recyclers — and they're closer to animals than plants" |
| 6 | plantae | Plants | "The oxygen makers that colonized land 470 million years ago" |
| 7 | animalia | Animals | "From sponges to blue whales — the most diverse kingdom" |

### 4. Tour 3: "Mass Extinctions" (7 steps)

Uses the timeline slider to travel through time:

| Step | Target | Title | Key message |
|------|--------|-------|-------------|
| 1 | timeline (3800) | Deep Time | "Let's travel through the 5 great catastrophes" |
| 2 | ext marker 445 | Ordovician (445 Mya) | "86% of species lost — glaciation froze the oceans" |
| 3 | ext marker 370 | Devonian (370 Mya) | "75% lost — the oceans ran out of oxygen" |
| 4 | ext marker 252 | The Great Dying (252 Mya) | "96% of all species — the worst extinction ever" |
| 5 | ext marker 200 | Triassic (200 Mya) | "This one cleared the way for dinosaurs to dominate" |
| 6 | ext marker 66 | K-Pg (66 Mya) | "The asteroid that ended the dinosaurs — and started our story" |
| 7 | timeline (0) | Recovery | "Life always bounces back — but it takes millions of years" |

**Auto-actions:** Animate the timeline slider to each extinction event's Mya value.

### 5. Tour Launcher UI

- First visit (no `tol-tour-done` in localStorage): Show prompt "Would you like a guided tour?" with 3 tour cards to choose from
- "?" help button (already exists) → opens tour selector
- Tour selector: 3 cards with tour name, description, step count, estimated time
- Each card is a button that starts the tour

### 6. Achievement Integration

If J6 achievement system exists:
- Add 3 tour achievements: `tour_luca` (complete "From LUCA to You"), `tour_kingdoms` (complete "Five Kingdoms"), `tour_extinctions` (complete "Mass Extinctions")
- Unlock on completing the final step of each tour

---

## New Files

- `js/tours.js` — Tour engine + all 3 tour definitions + tour selector UI

## Success Criteria

- [ ] All 3 tours complete end-to-end without errors
- [ ] Spotlight correctly highlights each target
- [ ] Tree auto-pans to nodes during tour
- [ ] Timeline auto-animates during extinction tour
- [ ] Keyboard navigation works (arrows, Escape)
- [ ] Mobile: tour cards display properly at bottom of screen
- [ ] First-visit prompt appears (controlled by localStorage)
- [ ] "?" button opens tour selector on repeat visits
- [ ] Tour achievements unlock (if J6 is done)
- [ ] Zero console errors
