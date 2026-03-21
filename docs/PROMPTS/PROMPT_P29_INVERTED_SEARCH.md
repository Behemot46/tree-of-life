# P29 — Inverted Search Index

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p29** (Tier 3 — Scale & Performance).

**Your scope:** Replace the current linear-scan search with an inverted index for O(1) lookup performance at 1K+ nodes. You touch `buildSearchIndex()`, `searchEntities()`, and the fuzzy matching logic in `index.html`. You do NOT touch rendering, layout, panel, or visual features.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `perf:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Make search scale to 1,000+ nodes with <10ms response time. Build an inverted index at init that maps tokens to node IDs.

### Success Criteria

1. Search results appear in <10ms for any query at 1K+ nodes
2. Bigram fuzzy matching quality preserved (Sorensen-Dice, threshold 0.35)
3. Multilingual search works (EN, HE, RU via TAXON_I18N)
4. Inverted index built at init in <50ms
5. Memory overhead reasonable (<1MB for 1K nodes)
6. Current 130-node search behavior unchanged (results identical)
7. Zero console errors

---

## Context

### Current search (~200 lines in index.html)

```js
function buildSearchIndex() {
  // Walks all nodes in nodeMap
  // For each: creates entry with haystack string (name + latin + tags + i18n names)
  // Returns flat array of { node, haystack, ... }
}

function searchEntities(query) {
  // Linear scan through searchIndex array
  // For each entry: compute _fuzzyScore(query, haystack)
  // Filter by threshold 0.35
  // Sort by score descending
  // Return top N results
}

function _bigramSet(s) { /* bigram tokenizer */ }
function _fuzzyScore(a, b) { /* Sorensen-Dice coefficient */ }
```

- At 130 nodes: fast enough (< 5ms)
- At 1K nodes: linear scan with bigram computation on every keystroke → ~50-100ms
- At 5K nodes: unacceptable latency

### TAXON_I18N

~130 entries mapping node IDs to `{ he: 'Hebrew name', ru: 'Russian name' }`. Included in search haystack.

---

## Implementation Plan

### Phase A: Build inverted bigram index

At `buildSearchIndex()` time:

```js
// invertedIndex: Map<bigram, Set<nodeId>>
const invertedIndex = new Map();

function indexNode(nodeId, haystack) {
  const bigrams = _bigramSet(haystack.toLowerCase());
  for (const bg of bigrams) {
    if (!invertedIndex.has(bg)) invertedIndex.set(bg, new Set());
    invertedIndex.get(bg).add(nodeId);
  }
}
```

### Phase B: Fast candidate retrieval

```js
function searchEntities(query) {
  const queryBigrams = _bigramSet(query.toLowerCase());

  // 1. Collect candidates: nodes that share at least 1 bigram with query
  const candidateCounts = new Map(); // nodeId → shared bigram count
  for (const bg of queryBigrams) {
    const nodes = invertedIndex.get(bg);
    if (!nodes) continue;
    for (const id of nodes) {
      candidateCounts.set(id, (candidateCounts.get(id) || 0) + 1);
    }
  }

  // 2. Quick filter: skip candidates with <30% bigram overlap
  const minShared = Math.max(1, Math.floor(queryBigrams.size * 0.3));
  const candidates = [...candidateCounts.entries()]
    .filter(([_, count]) => count >= minShared)
    .map(([id]) => id);

  // 3. Full Sorensen-Dice only on candidates (not all nodes)
  const results = [];
  for (const id of candidates) {
    const entry = searchIndex.find(e => e.node.id === id);
    const score = _fuzzyScore(query, entry.haystack);
    if (score >= 0.35) results.push({ ...entry, score });
  }

  // 4. Sort and return top N
  return results.sort((a, b) => b.score - a.score).slice(0, 20);
}
```

### Phase C: Exact-match fast path

Before fuzzy matching, check for exact substring match:
```js
// If query is a prefix/substring of any name → instant result, skip fuzzy
const exactMatches = searchIndex.filter(e =>
  e.haystack.toLowerCase().includes(query.toLowerCase())
);
if (exactMatches.length > 0) return exactMatches.slice(0, 20);
```

### Phase D: Index rebuild on language change

When `setLang()` is called:
1. Rebuild search index (haystack includes current language names)
2. Rebuild inverted bigram index
3. Should complete in <50ms

### Phase E: Optional — precomputed bigram sets

Store bigram sets per node at index time to avoid recomputing during scoring:
```js
// searchIndex entry gets: { node, haystack, bigrams: Set }
// _fuzzyScore uses precomputed entry.bigrams instead of calling _bigramSet each time
```

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `index.html` | Rewrite `buildSearchIndex()` to build inverted index, rewrite `searchEntities()` for candidate-then-score, precompute bigrams |
| `PROJECT_PROGRESS.md` | Add p29 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` — rendering
- `renderPanelContent()` — panel
- `js/treeData.js`, `js/speciesData.js` — data
- Layout, timeline, compare, DNA calc

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. Search "mammals" → same results as before
3. Search "mammls" (typo) → fuzzy match finds Mammals
4. Hebrew search "יונקים" → Mammals
5. Russian search "Грибы" → Fungi
6. Search with 1-char query → reasonable results
7. Search with long query → no performance degradation
8. Console: `performance.now()` before/after search → <10ms
9. Change language → search still works correctly
10. Zero console errors
11. Results are identical to old linear-scan for all test queries

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p29-inverted-search`
- PR title: `perf: replace linear search with inverted bigram index for O(1) candidate retrieval`
- PR against `main`

---

## Session Closing Protocol

Before declaring the session complete, you MUST:

1. **Commit** all changes with descriptive `perf:` message
2. **Push** the branch to origin
3. **Open PR** against `main` using `gh pr create`
4. **Verify** the PR is mergeable (no conflicts with main)
5. **If conflicts exist**: pull main, resolve conflicts, push again
6. **Update** `PROJECT_PROGRESS.md` — add p29 to Completed table
7. **Update** `SESSION_HANDOFF.md` — write full handoff notes
8. **Verify** zero console errors in browser
