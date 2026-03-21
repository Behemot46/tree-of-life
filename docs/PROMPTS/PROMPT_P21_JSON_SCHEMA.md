# P21 — JSON Data & Schema Validation

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p21** (Tier 1 — High Priority).

**Your scope:** Convert tree data from JS constants to validated JSON, add schema definitions, and create a CI validation step. You touch `js/treeData.js`, `js/speciesData.js`, create JSON files and a validation script. You do NOT touch rendering, layout, panel, or any visual features.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Add CI safety net for data integrity. Convert the main data files to validated JSON so errors are caught before deployment, not in the browser.

### Success Criteria

1. Tree data available as JSON (loaded at init or compiled to JS)
2. JSON schema defined for node shape, PHOTO_MAP, WIKI_TITLES
3. CI validation script runs on push and catches: missing required fields, invalid types, orphan references, duplicate IDs
4. Cross-validation: every PHOTO_MAP key matches a node ID, every WIKI_TITLES key matches a node ID
5. All ~130+ nodes pass validation
6. App still works identically in browser (no behavioral change)
7. Zero console errors

---

## Context

### Current data files

- `js/treeData.js` — `const TREE = { ... }` nested object, ~130+ nodes. Also exports `lightenColor()`
- `js/speciesData.js` — `const PHOTO_MAP = { ... }` (228 entries), `const WIKI_TITLES = { ... }`, `const ENRICHMENT = { ... }`, `const GREAT_APE_IDS`, `const HOMININ_IDS`
- All loaded via `<script>` tags as globals — no module system

### Node shape

```js
{
  id: string,        // required, unique
  icon: string,      // emoji
  color: string,     // hex color
  r: number,         // circle radius 8-26
  appeared: number,  // Mya
  name: string,      // display name
  latin: string,     // scientific name
  era: string,       // era string
  desc: string,      // description
  detail: string,    // longer detail
  facts: [{l, v}],   // label/value pairs
  tags: string[],    // trait chips
  children: Node[]   // nested (optional)
}
```

### Constraints

- No build step — no webpack/bundler
- No npm — can't use ajv or similar from node_modules at runtime
- CI can use Node.js (GitHub Actions has Node)
- Browser must still load data via `<script>` tags

---

## Implementation Plan

### Phase A: Create JSON schema

1. Create `data/schema/node.schema.json` — JSON Schema for a single tree node
2. Create `data/schema/photo-map.schema.json` — validates PHOTO_MAP structure
3. Create `data/schema/wiki-titles.schema.json` — validates WIKI_TITLES structure
4. Schema should enforce: required fields, types, ID uniqueness, valid hex colors, appeared > 0

### Phase B: Create validation script

1. Create `scripts/validate-data.js` — Node.js script (no npm deps, use built-in `fs`, `path`, `assert`)
2. Validation checks:
   - Parse TREE and walk all nodes — collect all IDs
   - Check ID uniqueness (no duplicates)
   - Check required fields present on each node
   - Check type correctness (appeared is number, color is hex, etc.)
   - Cross-reference: every PHOTO_MAP key exists as a node ID
   - Cross-reference: every WIKI_TITLES key exists as a node ID
   - Report errors with node ID and field name
3. Script reads the JS files, extracts the constants (eval or regex parse), then validates
4. Exit code 0 on success, 1 on failure with error list

### Phase C: CI integration

1. Create `.github/workflows/validate-data.yml`:
   ```yaml
   name: Validate Data
   on: [push, pull_request]
   jobs:
     validate:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 20 }
         - run: node scripts/validate-data.js
   ```
2. Ensure it runs on PRs and push to main

### Phase D: Optional — JSON extraction

If feasible without breaking the app:
1. Extract TREE to `data/tree.json`
2. Create a thin `js/treeData.js` wrapper that loads the JSON synchronously via `<script>` or XHR at init
3. This makes the data editable as pure JSON

**Alternative** (simpler): Keep TREE in `js/treeData.js` as-is, but have the validation script parse the JS file to extract the data. This avoids any runtime changes.

---

## Files You Will Create/Modify

| File | What changes |
|------|-------------|
| `data/schema/node.schema.json` | **NEW** — JSON Schema for tree nodes |
| `data/schema/photo-map.schema.json` | **NEW** — JSON Schema for PHOTO_MAP |
| `scripts/validate-data.js` | **NEW** — Validation script |
| `.github/workflows/validate-data.yml` | **NEW** — CI workflow |
| `PROJECT_PROGRESS.md` | Add p21 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `index.html` — no rendering changes
- `js/treeData.js` — don't change runtime behavior (validation script reads it externally)
- `js/imageLoader.js` — image system
- Any rendering or layout code

---

## Testing Checklist

1. `node scripts/validate-data.js` → exits 0, all checks pass
2. Intentionally break a node (remove `id`) → script catches and reports error
3. Add a PHOTO_MAP entry with non-existent ID → script catches it
4. `node serve.js` → app loads identically, zero console errors
5. All tree nodes render, panels open, search works
6. CI workflow syntax is valid (`act` or push to test branch)

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p21-json-schema`
- PR title: `feat: add JSON schema validation and CI data integrity checks`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `feat:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p21 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
