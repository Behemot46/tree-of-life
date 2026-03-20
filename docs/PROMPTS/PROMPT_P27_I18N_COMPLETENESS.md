# P27 — i18n Completeness & Polish

## Meta Instructions

You are a Claude Code agent working on the **Tree of Life** project — an interactive browser-based phylogenetic visualization. You are executing **phase p27** — completing internationalization coverage across the entire UI.

**Your scope:** Audit and localize all remaining hardcoded English text. You touch `js/uiData.js` (TRANSLATIONS), `js/treeData.js` (node `desc`/`detail`/`facts` localization), `index.html` (template strings in `renderPanelContent()` and other rendering functions), and locale-specific formatting. You do NOT modify `render()` tree layout, `NODE_ICONS`, legend filtering, or any structural/layout code.

**Workflow:** Read CLAUDE.md fully. Understand the codebase. Plan. Implement. Test via `node serve.js`. Commit with `feat:` prefix. Push branch. Open a merge-safe PR against `main`. Update PROJECT_PROGRESS.md and SESSION_HANDOFF.md.

---

## Goal

Achieve full trilingual coverage (EN/HE/RU) so no English text leaks when the user switches to Hebrew or Russian.

### Success Criteria

1. Every user-visible string is translated (EN/HE/RU)
2. Number formatting respects locale (comma vs period separator, RTL digit grouping)
3. Panel content template strings use `t()` for all labels (currently some are hardcoded)
4. `node.desc`, `node.detail`, and `node.facts` labels have HE/RU translations for at least the top 30 most-visited nodes
5. Date/era strings localized (e.g., "Million years ago" → "מיליון שנים" / "Миллионов лет назад")
6. Splash screen number formatting by locale (3,800,000,000 vs 3.800.000.000)
7. Tooltip text translated
8. All ARIA labels translated (if any exist)
9. `?lang=he` shows zero English strings in the main UI flow
10. `?lang=ru` shows zero English strings in the main UI flow
11. Zero console errors

---

## Audit Approach

### Step 1: Find all hardcoded English strings

Search `index.html` inline `<script>` for:
- Quoted strings in template literals that contain English words
- `textContent =` or `innerHTML =` assignments with English
- Strings passed to `set()` or displayed in UI that don't go through `t()`

### Step 2: Categorize findings

- **Quick wins**: UI labels, button text, section headers → add to TRANSLATIONS
- **Medium effort**: Panel template strings → wrap in `t()` calls
- **Large effort**: `node.desc` / `node.detail` in treeData.js → add i18n layer

### Step 3: Implement i18n for node data

For node descriptions, add a translation layer:
```js
// In uiData.js, add NODE_TRANSLATIONS
const NODE_TRANSLATIONS = {
  'luca': {
    desc: { he: '...', ru: '...' },
    detail: { he: '...', ru: '...' },
    facts: [{ l: { he: '...', ru: '...' }, v: { he: '...', ru: '...' } }]
  },
  // ... top 30 nodes
};
```

Add a helper: `tNode(node, field)` that returns translated text or falls back to English.

---

## Files You Will Modify

| File | What changes |
|------|-------------|
| `js/uiData.js` | Add missing TRANSLATIONS keys, add NODE_TRANSLATIONS for top 30 nodes |
| `index.html` | Wrap hardcoded strings in `t()`, add `tNode()` helper, locale number formatting |
| `PROJECT_PROGRESS.md` | Add p27 completion entry |
| `SESSION_HANDOFF.md` | Write handoff notes |

### Files you must NOT modify

- `render()` tree layout
- `NODE_ICONS` / `getIconGroup()`
- `toggleDomain()` / `resetDomains()`
- `js/imageLoader.js`
- `buildHomininTree()` structure

---

## Testing Checklist

1. `node serve.js` → open http://localhost:5555
2. `?lang=en` — all text displays correctly (baseline)
3. `?lang=he` — **zero English strings** in splash, tree labels, panel, timeline, legend, tooltips
4. `?lang=ru` — **zero English strings** in same surfaces
5. Hebrew: RTL direction correct, numbers display properly
6. Russian: Cyrillic renders in Heebo font
7. Switch languages mid-session — all dynamic content updates
8. Panel content for top 30 nodes shows translated desc/detail
9. Splash number formatting: commas in EN, periods in RU, correct in HE
10. Mobile: translated text doesn't overflow containers
11. Zero console errors

---

## Branch & PR

- Branch from `main`
- Branch name: use the worktree name or `claude/p27-i18n-completeness`
- PR title: `feat: complete i18n coverage — zero English leaks in HE/RU modes`
- PR against `main`
