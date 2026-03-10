# Prompt 00 — Baseline Audit

**Date:** 2026-03-10
**Branch:** claude/upbeat-tharp

## Request

Read all source files completely (index.html, style.css, js/*.js, .github/workflows/)
and produce an honest audit of the current state — what is working, what is broken,
what languages exist, how data is structured, what rendering library is used, species
count, Hebrew RTL status, and filter status.

Then create docs/ with ARCHITECTURE.md, docs/PROMPTS/, and CHANGELOG.md
documenting only what actually exists in the code.

## Findings Summary

See docs/ARCHITECTURE.md for the complete audit.

Key discovery: the repository contains two architecturally incompatible applications.
App A (inline monolith in index.html) is the only functional application.
App B (js/*.js + style.css) loads but cannot run because its required DOM elements
do not exist in index.html.

## Files Created

- `docs/ARCHITECTURE.md` — complete architecture documentation based on code audit
- `docs/PROMPTS/README.md` — prompt archive index
- `docs/PROMPTS/PROMPT_00_baseline_audit.md` — this file
- `CHANGELOG.md` — baseline changelog

## No code was changed. Audit only.
