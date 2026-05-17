# Handoff Folder — Reader's Guide

This folder is the **canonical context package** for any new Claude
Code session picking up Margin Atlas work. It replaces carrying
hundreds of thousands of tokens of conversation history.

---

## 1 · How to use this folder

If you are a new Claude session: read the files in numbered order
(00 through 13). Then read `14_BOOTSTRAP_PROMPT.md` to understand
what to confirm back to the founder.

If you are the founder: the only file you need is
`14_BOOTSTRAP_PROMPT.md` — copy the prompt block in it into a fresh
session and paste.

---

## 2 · File map

| # | File | Purpose | Approx. lines |
|---|---|---|---|
| 00 | `00_README.md` | This file | 60 |
| 01 | `01_PROJECT_OVERVIEW.md` | What Margin Atlas is, who it's for, business model, positioning | 350 |
| 02 | `02_FOUNDER_PROFILE.md` | Founder communication style, hard rules, common phrases | 280 |
| 03 | `03_DECISION_LOG.md` | Every WHY behind every architectural decision (~80 items) | 600 |
| 04 | `04_CURRENT_STATE.md` | Live URLs, Vercel, Supabase, what works, what's broken | 350 |
| 05 | `05_DATABASE_SCHEMA.md` | Every table, column, fallback chain, row count | 400 |
| 06 | `06_API_KEYS_AND_SECRETS.md` | Every key, location, what it unlocks, how to rotate | 280 |
| 07 | `07_CODEBASE_TOUR.md` | Every directory + key file annotated | 600 |
| 08 | `08_INGEST_SCRIPTS.md` | Every Python pipeline status + execution patterns | 500 |
| 09 | `09_BLOCKERS_AND_RESOLUTIONS.md` | Open blockers + click-by-click fixes | 400 |
| 10 | `10_NEVER_DO_RULES.md` | Hard prohibitions with rationale | 250 |
| 11 | `11_NEXT_STEPS.md` | Prioritized roadmap with effort estimates | 350 |
| 12 | `12_VERIFICATION_URLS.md` | Sample URLs + spot-check commands | 250 |
| 13 | `13_GLOSSARY.md` | Industry classifications, geographic codes, internal terms | 180 |
| 14 | `14_BOOTSTRAP_PROMPT.md` | The paste-ready prompt for a new session | 220 |

---

## 3 · Reading-order rationale

The order is intentional. Each file establishes context the next file
relies on:

- 01 sets what the product *is*
- 02 sets *how to communicate* with the founder
- 03 explains *why everything is the way it is*
- 04 is the *snapshot* of right-now
- 05–08 are the *technical inventory* (data, secrets, code, pipelines)
- 09 is *what's broken*
- 10 is *what's forbidden*
- 11 is *what to do next*
- 12 is *how to verify*
- 13 is *terminology*
- 14 is the *prompt to start a new session*

---

## 4 · Conventions used across all files

| Convention | Meaning |
|---|---|
| `D-NNN` IDs | Stable decision IDs (referenced in 03_DECISION_LOG.md) |
| `B-NNN` IDs | Stable blocker IDs (referenced in 09_BLOCKERS_AND_RESOLUTIONS.md) |
| `R-NNN` IDs | Stable rule IDs (referenced in 10_NEVER_DO_RULES.md) |
| `S-NN` IDs | Stable next-step IDs (referenced in 11_NEXT_STEPS.md) |
| Tier `P/S/M/T/X` | Quality tiers: Primary / Secondary / Modeled / Tabulated / Extrapolated |
| `✓ DONE` / `⚠ PARTIAL` / `❌ BLOCKED` / `▢ DEFERRED` | Status indicators in tables |
| Absolute paths use Windows form (`E:\atlas\…`) | Founder's dev machine is Windows |
| Code blocks for any path, command, query, or env-var name | Parser-friendly |

---

## 5 · How this folder relates to other docs

- `PLAN_V3.md` (repo root) — superseded plan; reference only
- `PLAN_V4.md` (repo root) — current plan; many items shipped; still authoritative for the unshipped ones
- `docs/ingest/00_MASTER.md` and `01-18_*.md` — per-phase ingest plans; reference if executing a specific phase
- `docs/ingest/19_VERIFICATION_QUALITY.md` — running scoreboard for ingest progress
- `docs/ingest/FINAL_REPORT.md` — comprehensive end-of-session-4 ingest report
- `CLAUDE.md` (repo root + parent UI-UX folder) — project coding rules

The files in THIS folder (`docs/handoff/`) are the highest-priority
read. The above are reference.

---

## 6 · Maintenance protocol

After any major work session:

1. Update `04_CURRENT_STATE.md` with the new snapshot
2. Append new decisions to `03_DECISION_LOG.md`
3. If new blockers emerged, add to `09_BLOCKERS_AND_RESOLUTIONS.md`
4. Re-order priorities in `11_NEXT_STEPS.md`
5. Add new sample URLs to `12_VERIFICATION_URLS.md`
6. Re-run `tsc --noEmit` and `npx tsx scripts/verify_taxonomy.ts`
7. Commit with message starting `handoff: <summary>`
8. Push to `origin/main`

This keeps the handoff folder evergreen so future migrations are
even faster.
