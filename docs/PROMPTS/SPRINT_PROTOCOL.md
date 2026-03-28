# Sprint Execution Protocol

## How to Start Any Sprint

Open a new Claude Code session and say:

> "Execute Sprint J[N]. Read `docs/PROMPTS/SPRINT_J[N]_[NAME].md` and follow the protocol."

Claude will orchestrate the entire sprint autonomously, only asking you for decisions when needed.

---

## Phase 1: Context Loading (mandatory, every sprint)

1. Read `CLAUDE.md` — project architecture and conventions
2. Read `ROADMAP.md` — understand where this sprint fits
3. Read `PROJECT_PROGRESS.md` — see what's already done
4. Read `SESSION_HANDOFF.md` — get context from last session
5. Read the specific sprint prompt file
6. Run `git fetch origin && git status`
7. If merge conflicts exist → resolve them first, commit resolution

## Phase 2: Planning & Exploration (use agents)

Launch up to 3 **Explore agents** in parallel to deeply understand the code areas this sprint touches. Each agent gets a specific focus area from the sprint prompt.

Then launch 1 **Plan agent** to design the implementation approach based on exploration results.

## Phase 3: Implementation (use agents for parallel work)

For large sprints, launch multiple agents in parallel:
- **Code agents** for independent file changes
- **Explore agents** to verify patterns before modifying
- **Code review agents** after changes are made

The lead agent (you, Claude) orchestrates: assigns work, merges results, resolves conflicts between agents.

## Phase 4: Verification

1. Start the dev server: `node serve.js`
2. Use **Claude Preview** tools to verify:
   - `preview_start` → `preview_screenshot` for visual check
   - `preview_console_logs` for zero errors
   - `preview_snapshot` for accessibility tree
   - `preview_inspect` for CSS values
3. Test dark + light theme
4. Test mobile viewport (375×812)
5. Run through the sprint's success criteria checklist

## Phase 5: Ship

1. `git add` only the changed files (never `git add -A`)
2. Commit with message: `feat: J[N] — [description]`
3. Push branch and create PR to main using `gh pr create`
4. Update these files:
   - `SESSION_HANDOFF.md` — prepend new session entry (what changed, why, what's next)
   - `PROJECT_PROGRESS.md` — mark sprint as Done
   - `ROADMAP.md` — move sprint to Completed
5. Commit doc updates: `docs: update project tracking for J[N]`

---

## Agent Allocation per Sprint

| Sprint | Explore Agents | Plan Agent | Implementation | Review |
|--------|---------------|------------|----------------|--------|
| J1 | 1 (CSS audit) | 1 | Direct (small) | 1 code-simplifier |
| J2 | 1 (nav system) | 1 | Direct (small) | 1 code-simplifier |
| J3 | 3 (JS structure, globals, onclick deps) | 1 | 3 parallel (extract modules) | 1 code-reviewer |
| J4 | 2 (a11y state, mobile layout) | 1 | Direct | 1 code-reviewer |
| J5 | 2 (render perf, animation system) | 1 | Direct | 1 (profile verification) |
| J6 | 2 (localStorage patterns, UI slots) | 1 | 2 parallel (engagement + quiz) | 1 code-simplifier |
| J7 | 3 (tree structure, DNA data, facts) | 1 | 3 parallel (species, DNA, facts) | 1 code-reviewer |
| J8 | 1 (deployment infra) | 1 | Direct | 1 (offline test) |
| J9 | 2 (tour engine, node paths) | 1 | 2 parallel (engine + tour content) | 1 code-reviewer |
