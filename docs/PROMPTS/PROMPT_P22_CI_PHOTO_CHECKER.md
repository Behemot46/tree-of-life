# P22 — CI Photo Link Checker

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p22** (Tier 1 — High Priority).

**Your scope:** Create a CI workflow that verifies all PHOTO_MAP URLs return valid responses. You create a GitHub Actions workflow and a Node.js checker script. You do NOT touch any rendering, layout, or UI code.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Catch URL rot in PHOTO_MAP before it reaches users. A weekly CI job and on-push check for data file changes.

### Success Criteria

1. Script checks every URL in PHOTO_MAP (228 entries) for HTTP 200 response
2. Reports broken URLs with species ID and URL
3. Runs in CI (GitHub Actions) on push when `js/speciesData.js` changes
4. Also runs on a weekly schedule (cron)
5. Tolerates transient failures (retry once, timeout 10s per URL)
6. Parallel checks for speed (batch 10 concurrent)
7. Exit code 1 if any URL is permanently broken
8. No runtime dependencies (uses Node.js built-in `https` or `fetch`)

---

## Context

### PHOTO_MAP in js/speciesData.js

```js
const PHOTO_MAP = {
  'homo-sapiens': 'https://upload.wikimedia.org/...jpg',
  'chimpanzee': 'https://upload.wikimedia.org/...jpg',
  // ... 228 entries total
};
```

All URLs point to Wikimedia Commons. Some may go stale as Wikimedia reorganizes or removes files.

### Existing CI

- `.github/workflows/deploy.yml` — deploys to GitHub Pages on push to master
- `.github/workflows/deploy-check.yml` — validates required files exist

---

## Implementation Plan

### Phase A: Create checker script

1. Create `scripts/check-photos.js`:
   ```js
   // 1. Read js/speciesData.js
   // 2. Extract PHOTO_MAP entries (eval or regex)
   // 3. For each URL: HEAD request with 10s timeout
   // 4. Retry once on failure
   // 5. Batch 10 concurrent requests
   // 6. Report: total checked, OK count, broken list
   // 7. Exit 0 if all OK, exit 1 if any broken
   ```
2. Use Node.js 20+ built-in `fetch` (no npm deps)
3. Output format:
   ```
   Checking 228 PHOTO_MAP URLs...
   [OK]     homo-sapiens (200)
   [BROKEN] some-species (404) https://upload.wikimedia.org/...
   ...
   Results: 226 OK, 2 broken
   ```

### Phase B: Create CI workflow

1. Create `.github/workflows/check-photos.yml`:
   ```yaml
   name: Check Photo URLs
   on:
     push:
       paths: ['js/speciesData.js']
     schedule:
       - cron: '0 6 * * 1'  # Weekly Monday 6am UTC
     workflow_dispatch:  # Manual trigger
   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 20 }
         - run: node scripts/check-photos.js
   ```

### Phase C: Handle Wikimedia rate limiting

1. Add `User-Agent` header (Wikimedia requires it): `Tree-of-Life-Bot/1.0 (https://github.com/Behemot46/tree-of-life)`
2. Add 100ms delay between batches to avoid rate limiting
3. Treat 429 (rate limited) as transient — retry after 2s

---

## Files You Will Create

| File | What changes |
|------|-------------|
| `scripts/check-photos.js` | **NEW** — URL checker script |
| `.github/workflows/check-photos.yml` | **NEW** — CI workflow |
| `PROJECT_PROGRESS.md` | Add p22 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `js/speciesData.js` — read only, don't modify
- `index.html` — no UI changes
- Any rendering or layout code

---

## Testing Checklist

1. `node scripts/check-photos.js` → runs, checks all 228 URLs, exits 0
2. Temporarily add a broken URL → script catches it, exits 1
3. Script completes in < 60 seconds (parallel batching works)
4. CI workflow YAML is valid syntax
5. No console errors in browser (app unchanged)

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p22-photo-checker`
- PR title: `feat: add CI photo link checker for PHOTO_MAP URL validation`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p22 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
