# Sprint J6 — Discovery & Fun

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` — resolve merge conflicts first
4. Read js/factLibrary.js (existing facts system)
5. Check which nodes have `funFact` field in js/treeData.js
6. Understand localStorage usage patterns in the app

**After ALL code changes:**
1. Test each engagement feature individually
2. Clear localStorage and verify first-visit experience
3. Verify achievements persist across page refresh
4. Test on mobile viewport
5. Commit: `feat: J6 — discovery, achievements, and quiz mode`
6. Push branch and create PR to main
7. Update SESSION_HANDOFF.md, PROJECT_PROGRESS.md, ROADMAP.md

---

## Sprint Goal

Make exploring the tree addictive and educational. Track progress, reward curiosity, surface knowledge.

## Tasks

### 1. Progress Tracker

**localStorage key:** `tol-explored` (JSON Set of node IDs)

- When a user opens a species panel → add node ID to explored set
- Display persistent badge in header: "🔬 42/132 discovered"
- Style as subtle pill badge (not intrusive)
- Animate count when it changes (CSS counter transition)
- Show progress bar in a "Profile" or "Stats" popover (optional)

### 2. Achievement System

**localStorage key:** `tol-achievements` (JSON array of achievement IDs)

**Define 12 achievements:**

| ID | Name | Trigger | Icon |
|----|------|---------|------|
| `first_steps` | First Steps | Explore 1 species | 👣 |
| `curious_mind` | Curious Mind | Explore 10 species | 🔍 |
| `explorer` | Explorer | Explore 50 species | 🧭 |
| `completionist` | Completionist | Explore all 132 species | 🏆 |
| `primatologist` | Primatologist | Explore all primate species | 🐒 |
| `deep_time` | Deep Time Traveler | Use timeline to visit 3800 Mya | ⏳ |
| `extinction_witness` | Extinction Witness | Click all 5 extinction markers | 💀 |
| `dna_wizard` | DNA Wizard | Compare 5 DNA pairs | 🧬 |
| `quiz_champion` | Quiz Champion | Score 100% on a quiz | 🎓 |
| `night_owl` | Night Owl | Toggle dark mode | 🌙 |
| `domain_master` | Domain Master | Filter each domain individually | 🔬 |
| `view_master` | View Master | Use all 3 view modes | 👁️ |

**Achievement unlock flow:**
1. Check triggers on relevant actions (panel open, timeline change, etc.)
2. If new achievement → show toast notification
3. Save to localStorage
4. Toast: slide-in from bottom-right, 3s duration, accent color, icon + name + description

**Toast CSS:**
```css
.achievement-toast {
  position: fixed; bottom: 80px; right: 20px;
  background: var(--surface); border: 1px solid var(--accent);
  border-radius: var(--radius-lg); padding: 12px 20px;
  display: flex; align-items: center; gap: 12px;
  animation: toastSlideIn 0.3s ease, toastSlideOut 0.3s ease 2.7s forwards;
  z-index: var(--z-tooltip);
}
```

### 3. Idle Fact Cards

After 30 seconds of no interaction:
- Show a floating fact card from FACTS library (18 existing facts, English)
- Card appears bottom-center, subtle slide-up animation
- Click to dismiss, or auto-dismiss after 8 seconds
- Don't repeat facts within a session (track shown IDs)
- Pause timer when panel/modal is open

### 4. "Did You Know?" on Hover

When hovering a node that has `funFact` data:
- Show an enhanced tooltip with the fact (not just the species name)
- Format: "💡 Did you know? [fact text]"
- Max width 280px, positioned near cursor
- Only show if hover lasts > 500ms (avoid flickering)

### 5. Quiz Mode

**UI:** Button in header or controls area: "🧪 Quiz"

**Flow:**
1. Open quiz modal
2. Pick 5 random species from the tree
3. For each: show species name + icon, ask "Which domain?" with 4 multiple-choice options
4. Highlight correct/incorrect immediately (green/red)
5. Show final score: "4/5 correct!"
6. Track high score in localStorage (`tol-quiz-high`)
7. Trigger `quiz_champion` achievement on 5/5

**Data:** Use `node._domain` for correct answer. Generate 3 wrong options from other domains.

### 6. Exploration Visual Cue

Nodes the user has explored get a subtle visual distinction:
- **Explored nodes:** Normal rendering (full opacity)
- **Unexplored nodes:** Slightly dimmer fill opacity (0.6 instead of 0.8)
- OR: Explored nodes get a tiny checkmark dot overlay
- Keep it subtle — don't distract from the science

---

## New Files

- `js/engagement.js` — progress tracker, achievement system, idle facts, exploration cue
- `js/quiz.js` — quiz mode logic and UI

## Success Criteria

- [ ] Progress badge shows "X/132 discovered" and updates on panel open
- [ ] All 12 achievements trigger correctly on their conditions
- [ ] Achievement toast slides in on unlock, persists across refresh
- [ ] Idle fact card appears after 30s inactivity
- [ ] Enhanced hover tooltip shows funFact where available
- [ ] Quiz mode: 5 questions, multiple choice, score tracking
- [ ] High score persists in localStorage
- [ ] All engagement features work on mobile
- [ ] Zero console errors
