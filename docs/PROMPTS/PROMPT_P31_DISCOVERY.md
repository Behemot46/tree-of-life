# P31 — Discovery & Engagement Features

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p31** (Tier 4 — Content & Engagement).

**Your scope:** Build discovery features: expand the fact library to ~130 trilingual facts, wire facts into panel/tooltip/toast surfaces, add quiz mode and achievement tracking. You touch `js/factLibrary.js`, tooltip rendering, and add new UI components. You do NOT touch tree layout, node icons, panel structure (beyond the "DID YOU KNOW" block), or navigation.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make the Tree of Life a place of continuous discovery — users encounter fascinating facts naturally, can quiz themselves, and track exploration progress.

### Success Criteria

1. ~130 trilingual facts (EN/HE/RU) covering all domains
2. Facts appear in 5 surfaces: loading, panel, tooltip, discovery toast, random-fact button
3. Quiz mode: "Which domain does X belong to?" with score tracking
4. Achievement system: "Explored 50% of the tree", milestone badges
5. Share a species card (generate shareable image or link)
6. Session dedup — no repeated facts
7. Zero console errors

---

## Context

### Current facts infrastructure

- `js/factLibrary.js` — 18 facts with `FACTS.getLoadingFact(lang)`
- `ENRICHMENT` in `js/speciesData.js` — ~46 entries with `altFacts[]` (English only, not rendered)
- `node.funFact` — some nodes have a funFact string (rendered in panel)

### UI safe zones for new elements

```
TOP-LEFT:      #nav-ctrl — top:4.2rem, left:1.2rem
TOP-CENTER:    #search-wrap — top:1rem
TOP-RIGHT:     #lang-switcher, #theme-btn, #view-toggle
BOTTOM-LEFT:   #legend, #btn-dna-calc
BOTTOM-RIGHT:  #zoom-ctrl, #btn-hominin
BOTTOM-FULL:   #timeline
```

New buttons: add inside `#zoom-ctrl` flex column (safest) or as top-center toast.

---

## Implementation Plan

### Phase A: Expand fact library to ~130 facts

See the fact writing guidelines in the old PROMPT_P26_FACTS_INTEGRATION.md for categories, quality standards, and API expansion. Each fact needs: `id`, `en`, `he`, `ru`, `tags`, `species`, surface flags (`loading`, `panel`, `tooltip`, `discovery`).

### Phase B: Wire facts into surfaces

1. **Panel**: enhance "DID YOU KNOW" with `FACTS.getPanelFact(nodeId, lang)`
2. **Tooltip**: add one-liner fact below node name on hover
3. **Discovery toast**: top-center auto-dismissing toast (6-8s)
4. **Random button**: add 💡 inside `#zoom-ctrl` column

### Phase C: Quiz mode

1. Button in `#zoom-ctrl`: "🧠 Quiz"
2. Modal overlay: shows a random species, asks "Which domain?"
3. Multiple choice: 4 domain options
4. Score tracking (session-only, localStorage optional)
5. 10-question rounds

### Phase D: Achievement system

1. Track in `localStorage`: nodes visited, species viewed, domains explored
2. Milestones: 10%, 25%, 50%, 75%, 100% of tree explored
3. Toast notification on achievement unlock
4. Small badge counter on a "🏆" button in `#zoom-ctrl`

### Phase E: Share card (stretch)

1. Click "Share" in species panel → generate shareable link with species pre-selected
2. URL parameter: `?species=homo-sapiens` → auto-open panel on load

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `js/factLibrary.js` | Expand to ~130 facts, add API methods |
| `index.html` | Toast UI, quiz modal, achievement tracking, tooltip enhancement, CSS |
| `js/uiData.js` | i18n keys for quiz/achievement labels |
| `PROJECT_PROGRESS.md` | Add p31 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` layout — tree rendering
- `renderPanelContent()` structure (only add to DID YOU KNOW block)
- `js/treeData.js` — tree data
- Navigation stack, search algorithm

---

## Testing Checklist

1. `FACTS.getAll().length` → ~130
2. Loading screen shows random fact
3. Panel DID YOU KNOW shows trilingual facts
4. Tooltip shows one-liner fact on hover (desktop)
5. Discovery toast appears, auto-dismisses
6. Quiz mode: 10 questions, score shown
7. Achievements: visit 10 nodes → toast notification
8. Language switch → facts/quiz in selected language
9. Mobile: quiz and achievements usable
10. Zero console errors

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p31-discovery`
- PR title: `feat: discovery features with 130 facts, quiz mode, and achievement tracking`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p31 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
