# Master Plan — Reader's Guide

This folder is the **execution package** for the next Margin Atlas
work sweep. It builds on the handoff folder (`docs/handoff/`) — the
handoff describes the state of the world; this folder describes the
work.

---

## 1 · What this plan is

A single sweep of work designed to:

- Take `regional_cells` from 179,409 rows to **400,000+ rows** (base
  target) or **460,000+ rows** if the France blocker resolves (stretch).
- Unlock the production URL (`marginatlas.com`).
- Add **8+ new countries** with measured sub-national depth.
- Re-run US Census with full NAICS-3 coverage to 2× its current yield.
- Refresh the handoff folder so the next session can pick up cleanly.

Detailed hard targets are in `01_OBJECTIVES_AND_TARGETS.md`.

---

## 2 · How to execute

Two paths:

| Path | Use case |
|---|---|
| **Single-shot** | Founder pastes the prompt in `15_EXECUTION_PROMPT.md` into a fresh Claude Code session. The session reads this folder, confirms, then executes tracks B-K sequentially, pausing for Track A founder dependencies. |
| **Per-track** | Founder picks a single track (e.g. "execute Track D") and pastes a per-track command. |

Tracks are designed to be independent enough that any one can run
without the others, with the exception of:

- Track C (US re-execute) depends on Track B (NAICS expansion) for its
  full yield.
- Track H (France) depends on Track A.4 (founder downloads CSV).
- Track L (handoff refresh) runs last across all completed tracks.

---

## 3 · File map

| # | File | Purpose | Approx. lines |
|---|---|---|---|
| 00 | `00_README.md` | This file | 110 |
| 01 | `01_OBJECTIVES_AND_TARGETS.md` | Hard numerical targets per track; success criteria; stretch vs base | 250 |
| 02 | `02_RAM_AND_OPERATIONS_DISCIPLINE.md` | Non-negotiable operational rules — RAM cap, sequential, commit cadence | 220 |
| 03 | `03_TRACK_A_FOUNDER_BLOCKERS.md` | What only the founder can do — DNS, tone, key, Sirene, images | 280 |
| 04 | `04_TRACK_B_TAXONOMY_NAICS_EXPANSION.md` | Expand NAICS-3 coverage in `industries.json` from 73 → ~250 codes | 320 |
| 05 | `05_TRACK_C_NORTH_AMERICA_RECOVERY.md` | Canada retry on correct table + US Census re-execute | 280 |
| 06 | `06_TRACK_D_EU_LAU_PIPELINE.md` | Netherlands → Spain → Italy municipality-level ingest | 350 |
| 07 | `07_TRACK_E_UK_NOMIS.md` | UK NOMIS LAD + MSOA discovery + ingest | 280 |
| 08 | `08_TRACK_F_OECD_OVERLAY.md` | OECD SDMX endpoint migration + execute | 240 |
| 09 | `09_TRACK_G_ANGLO_PACIFIC.md` | Australia ABS + New Zealand Stats NZ | 280 |
| 10 | `10_TRACK_H_FRANCE_SIRENE.md` | France Sirene (conditional on founder CSV) | 280 |
| 11 | `11_TRACK_I_LATAM_EXPANSION.md` | Mexico, Argentina, Chile, Colombia, Peru | 320 |
| 12 | `12_TRACK_J_FRONTEND_AND_SEO.md` | Sitemap regen, badges, OG images, polish | 260 |
| 13 | `13_TRACK_K_VERIFICATION_AND_QA.md` | Per-track gates + final smoke test | 280 |
| 14 | `14_TRACK_L_HANDOFF_REFRESH.md` | Update `docs/handoff/` so next session picks up cleanly | 220 |
| 15 | `15_EXECUTION_PROMPT.md` | Paste-ready prompt for a fresh session | 220 |

---

## 4 · Reading order

For a new Claude session: read `00 → 01 → 02 → 15` first. Then read
individual tracks (03-14) as you execute them. Do not pre-read all
tracks before starting — keep context lean.

For the founder: read `01_OBJECTIVES_AND_TARGETS.md` to see the
ambition. Read `03_TRACK_A_FOUNDER_BLOCKERS.md` to see your
dependencies. Paste `15_EXECUTION_PROMPT.md` to launch.

---

## 5 · Conventions

Same as the handoff folder, repeated for clarity:

| Convention | Meaning |
|---|---|
| `T-X.N` | Stable task ID per track (e.g. `T-B.4` = Track B, step 4) |
| `R-NNN` | Refers to a never-do rule in `docs/handoff/10_NEVER_DO_RULES.md` |
| `D-NNN` | Refers to a decision in `docs/handoff/03_DECISION_LOG.md` |
| `B-NNN` | Refers to a blocker in `docs/handoff/09_BLOCKERS_AND_RESOLUTIONS.md` |
| `S-NN` | Refers to a next-step in `docs/handoff/11_NEXT_STEPS.md` |
| **Target** | A specific number the track must hit to be considered DONE |
| **Stretch** | A target above the base if everything goes well |
| **Gate** | A verification step that blocks moving to the next phase |
| **Pause point** | A point at which the session waits for founder input |

---

## 6 · Relationship to other docs

- `docs/handoff/` — current state of the world; what exists right now
- `docs/handoff/11_NEXT_STEPS.md` — the priority list this plan operationalises
- `docs/ingest/00_MASTER.md` and `01-18_*.md` — per-phase ingest reference
- `docs/ingest/19_VERIFICATION_QUALITY.md` — running scoreboard (this plan appends rows)
- `PLAN_V4.md` — the strategic plan; most items shipped; the unshipped items are folded into this plan's Tracks J + K

This plan supersedes nothing. It executes the next chapter.

---

## 7 · Conventions for the execution loop

When a session is executing this plan:

1. Read the per-track file before starting that track
2. Mark progress in the per-track `progress.json` (one per Python pipeline) — do NOT delete these mid-run
3. Commit + push after each track passes its gate
4. If a track fails its gate: stop, diagnose, fix, re-run; do not skip to the next track
5. If a track is blocked on a founder dependency: pause, report, move to the next independent track
6. At end-of-session, update Track L (handoff refresh) regardless of how much landed

---

## 8 · One-line summary per track

| Track | One-line goal |
|---|---|
| A | Unblock founder dependencies (DNS, tone, key, Sirene, images) |
| B | Expand `industries.json` NAICS-3 coverage 73 → ~250 codes |
| C | Retry Canada on correct table; re-execute US Census with expanded NAICS |
| D | Municipality-level coverage for Netherlands + Spain + Italy |
| E | UK Local Authority District + MSOA ingest |
| F | OECD SDMX endpoint migration + cross-validation overlay |
| G | Australia ABS + New Zealand Stats NZ ingest |
| H | France commune-level ingest from Sirene (conditional) |
| I | Mexico + Argentina + Chile + Colombia + Peru |
| J | Sitemap regen, quality badges, OG images, SEO polish |
| K | Per-track verification gates + final smoke test on 200 URLs |
| L | Refresh `docs/handoff/` to reflect the new state |
