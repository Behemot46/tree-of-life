# Prompt 0.5 — Documentation, GitHub Setup & Project Connection

**Archived:** 2026-03-10
**Status:** Completed

---

## Purpose

This prompt ran once, before any code changes. Its job was to establish the project's professional foundation: version control, documentation, and a deployment pipeline. All future prompts build on top of this.

## What Was Done

### Section A — Prerequisites (manual steps by Gabi)
- Confirmed GitHub access at https://github.com/behemot46
- Generated Personal Access Token for repo access
- Confirmed local clone exists and is up to date
- Confirmed GitHub Pages is active at https://behemot46.github.io/tree-of-life/

### Section B — Automated steps (executed by code generator)

1. **Updated `.gitignore`** — added `.env`, `.env.local`, `*.tmp`, `.claude/worktrees/`

2. **Created `README.md`** — public-facing project description with:
   - Feature list
   - Language table
   - Local development instructions
   - Links to all docs

3. **Created `CHANGELOG.md`** — version history starting from baseline

4. **Created `docs/` folder** with:
   - `ARCHITECTURE.md` — full audit of rendering engine, state management, file structure, technical decisions, risk flags, and gap inventory
   - `DATA_SCHEMA.md` — format spec for tree nodes, hominin data, and API responses
   - `I18N_GUIDE.md` — how to add/edit translations and RTL support
   - `ASSETS.md` — image sources, licenses, attribution requirements
   - `PROMPTS/` — this folder, for archiving each prompt

5. **Created `.github/workflows/deploy-check.yml`** — validates required files exist on every push to main

## What Was NOT Changed

- No functional code was touched
- `index.html`, `style.css`, `js/*.js` are unchanged
- The live site at https://behemot46.github.io/tree-of-life/ looks and works exactly as before

## Verification Checklist

- [ ] README.md renders on GitHub homepage
- [ ] `docs/` folder visible in file tree
- [ ] GitHub Actions "Deploy Check" workflow shows green
- [ ] Live site still works correctly

---

## Next: Prompt 1 — Data Foundation

Prompt 1 will extract tree data and hominin data from `index.html` into dedicated `js/treeData.js` and `js/homininsData.js` files, and validate the data against the schema defined in `docs/DATA_SCHEMA.md`.
