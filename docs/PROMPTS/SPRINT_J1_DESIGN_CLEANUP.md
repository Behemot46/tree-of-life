# Sprint J1 — Design System Cleanup

## Session Protocol

**Before ANY code changes, you MUST:**
1. Read CLAUDE.md, ROADMAP.md, PROJECT_PROGRESS.md, SESSION_HANDOFF.md
2. Read this sprint file completely
3. Run `git fetch origin && git status` to check branch state
4. Resolve any merge conflicts with `origin/main` before starting work
5. Read index.html CSS block (lines 1–600) and understand current state

**After ALL code changes:**
1. Test in browser: dark theme, light theme, mobile 375px viewport
2. Verify zero console errors
3. Commit changes with descriptive message: `feat: J1 — design system cleanup`
4. Push branch and create PR to main
5. Update SESSION_HANDOFF.md with what changed and why
6. Update PROJECT_PROGRESS.md — mark J1 as Done in the Upcoming table
7. Update ROADMAP.md — move J1 to Completed table

---

## Sprint Goal

Clean the CSS foundation so all future visual work builds on a consistent, well-named design token system. Fix naming confusion, remove dead code, add reduced-motion support.

## Tasks

### 1. Rename `--gold` → `--accent` (it's #0ea5e9 sky blue, not gold)

**Context:** The `--gold` CSS variable was inherited from an earlier earth-tone design. It's now sky blue (#0ea5e9) but still named "gold". This causes confusion.

**Steps:**
- In index.html `<style>` block: rename `--gold` → `--accent` in `:root` and `[data-theme="light"]`
- Rename `--gold-light` → `--accent-light`
- Rename `--gold-dim` → `--accent-dim`
- Rename `--gold-text` → `--accent-text`
- Rename `--gold-text-dim` → `--accent-text-dim`
- Remove `--teal` and `--teal-dim` (exact duplicates of `--accent`)
- Search ALL of index.html for `var(--gold` and `var(--teal` references and update
- Search JS template literals for `--gold` references and update

**Verification:** `grep -c "gold" index.html` should return 0 (or only in English text content, not CSS)

### 2. Consolidate duplicate light theme rules

**Context:** Agent 4 found 6 duplicate CSS rule blocks for light theme:

- `[data-theme="light"] #panel` appears at lines ~438 AND ~600
- `[data-theme="light"] .hom-era-title` appears at lines ~450 AND ~546
- `[data-theme="light"] #hom-header` appears at lines ~454 AND ~548

**Steps:** Merge each pair into a single rule block. Keep the most complete version. Delete the duplicate.

### 3. Define z-index scale as CSS custom properties

**Context:** Current z-index values are magic numbers scattered across the CSS (9999, 1100, 400, 300, 250, 150). No documented hierarchy.

**Steps:** Add to `:root`:
```css
--z-base: 0;
--z-tree: 1;
--z-controls: 100;
--z-nav: 200;
--z-search: 300;
--z-panel: 400;
--z-modal: 1000;
--z-tooltip: 1500;
```

Replace all hardcoded z-index values with `var(--z-*)` references.

### 4. Remove dead CSS classes

Remove these classes (defined but never used in HTML or JS):
- `.search-result-item`
- `.search-result-name`
- `.search-result-meta`

### 5. Convert inline style.cssText → CSS classes

Find the top 15 instances of `style.cssText = '...'` or multi-property inline style assignments in the JS and convert them to CSS classes. Priority targets:
- Hominini badge (line ~2177)
- Node hover effects (line ~2221)
- Extinction marker tooltips
- Particle creation
- Loading screen elements

Create named CSS classes (e.g., `.hominin-badge`, `.node-hover`, `.ext-tooltip`) and apply via `classList.add()`.

### 6. Add prefers-reduced-motion support

Add to the CSS:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7. Unify mobile breakpoints

Change the DNA calculator's `@media (max-width: 600px)` to `@media (max-width: 768px)` to match the rest of the app.

---

## Success Criteria

- [ ] Zero references to `--gold` or `--teal` in CSS (only `--accent*`)
- [ ] No duplicate light theme rules
- [ ] All z-index values use CSS custom properties
- [ ] 3 dead CSS classes removed
- [ ] 10+ inline style assignments converted to CSS classes
- [ ] `prefers-reduced-motion` media query present
- [ ] Single mobile breakpoint (768px) across all components
- [ ] Dark/light theme both render correctly
- [ ] Mobile viewport (375×812) renders correctly
- [ ] Zero console errors
