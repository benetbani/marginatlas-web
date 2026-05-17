# 15 · Execution Prompt

> Paste-ready prompt for a fresh Claude Code session to execute
> the entire master plan. Single block; self-contained.

---

## How to use

1. Open a new Claude Code session in `E:\atlas\website` (or any
   working dir — paths inside the prompt are absolute).
2. Copy the block between the BEGIN / END markers below.
3. Paste into the session.
4. The session reads the plan, confirms, then executes.

---

## The prompt

```
You are picking up the Margin Atlas master plan execution sweep. Do
NOT start work yet.

STEP 1 — Read the master plan in order, fully, before responding:
  E:\atlas\website\docs\masterplan\00_README.md
  E:\atlas\website\docs\masterplan\01_OBJECTIVES_AND_TARGETS.md
  E:\atlas\website\docs\masterplan\02_RAM_AND_OPERATIONS_DISCIPLINE.md
  E:\atlas\website\docs\masterplan\03_TRACK_A_FOUNDER_BLOCKERS.md
  E:\atlas\website\docs\masterplan\04_TRACK_B_TAXONOMY_NAICS_EXPANSION.md
  E:\atlas\website\docs\masterplan\05_TRACK_C_NORTH_AMERICA_RECOVERY.md
  E:\atlas\website\docs\masterplan\06_TRACK_D_EU_LAU_PIPELINE.md
  E:\atlas\website\docs\masterplan\07_TRACK_E_UK_NOMIS.md
  E:\atlas\website\docs\masterplan\08_TRACK_F_OECD_OVERLAY.md
  E:\atlas\website\docs\masterplan\09_TRACK_G_ANGLO_PACIFIC.md
  E:\atlas\website\docs\masterplan\10_TRACK_H_FRANCE_SIRENE.md
  E:\atlas\website\docs\masterplan\11_TRACK_I_LATAM_EXPANSION.md
  E:\atlas\website\docs\masterplan\12_TRACK_J_FRONTEND_AND_SEO.md
  E:\atlas\website\docs\masterplan\13_TRACK_K_VERIFICATION_AND_QA.md
  E:\atlas\website\docs\masterplan\14_TRACK_L_HANDOFF_REFRESH.md

Also re-read the handoff folder for current state:
  E:\atlas\website\docs\handoff\02_FOUNDER_PROFILE.md
  E:\atlas\website\docs\handoff\04_CURRENT_STATE.md
  E:\atlas\website\docs\handoff\10_NEVER_DO_RULES.md

STEP 2 — Hard rules you MUST honour:
  - Never use the word "okay" in any response. Founder explicit.
  - Never reveal source agencies (Eurostat, Census, e-Stat, IBGE,
    INE, ISTAT, ABS, CBS, NOMIS, INEGI, DANE, INDEC, INEI, OECD,
    SUNAT, etc.) in user-visible text. Internal docs only.
  - Aquamarine / teal / cyan is reserved for Tesseract Stock Agent.
    Atlas uses warm-earth palette only.
  - Banking, oil & gas, pharma, telecom, large insurance, hospitals,
    universities stay OFF default UI (corp_only audience tag).
  - /ask route stays preview-stub until editorial tone is decided.
  - No paid Destatis. No "Coming soon" tiles. No alphabetical sector
    sort. No image-on-right hero layouts.
  - Never commit .env.local. Never echo secret keys into chat.
  - Python ingest: chunksize streaming only, DuckDB for >1 GB files,
    RSS cap 600 MB enforced by ram_guard.py, sequential pipelines
    only (no parallel), resume via per-phase progress.json.
  - tsc --noEmit + verify_taxonomy.ts + npm run lint before every
    commit. No --no-verify. No force push to main.
  - Generic coverage_source labels only ("National business
    statistics", "European business statistics", "Cross-country
    economic indicators", "Estimated from regional patterns").

STEP 3 — Execution order:

Tier 0 (parallel-able with engineering tracks — these are founder
deps, not your work):
  - Track A.1 DNS — if still OPEN, click-by-click the founder
  - Track A.2 tone — wait for founder
  - Track A.3 ANTHROPIC key — depends on A.2
  - Track A.4 Sirene CSV — gate for Track H
  - Track A.5 images — defer indefinitely unless founder asks

Tier 1 (sequential engineering):
  1. Track B (NAICS expansion) — 2 hours
  2. Track C (Canada retry + US re-execute) — 3 hours active + 3 hours wall (US background)
  3. Track D (EU LAU: NL → ES → IT) — 9-15 hours
  4. Track E (UK NOMIS) — 4 hours
  5. Track F (OECD overlay) — 2-3 hours
  6. Track G (AU + NZ) — 4-5 hours
  7. Track H (France Sirene) — 2 hours IF A.4 resolved; else SKIP
  8. Track I (LATAM: MX, AR, CL, CO, PE) — 14-19 hours
  9. Track J (sitemap + badges + featured tiles) — 4-6 hours
  10. Track K (verification + smoke test + final report) — 2.5 hours
  11. Track L (handoff refresh) — 2 hours

Total active engineering: ~45 hours. Single session won't fit;
spread across multiple sessions. Each session executes as many
tracks as context allows, then runs Track L (even partial), then
stops.

STEP 4 — Per-track procedure:

For each track:
  a) Read the track's own .md file in full
  b) Execute its steps in order
  c) Hit its verification gate (defined in §2 of each track file)
  d) If gate passes: commit + push + move to next track
  e) If gate fails: STOP, diagnose, fix, re-verify; do not skip
  f) If track is blocked on founder dependency: pause, report,
     move to next independent track
  g) Update docs/masterplan/PROGRESS.md after each track

STEP 5 — Communication protocol:

  - When a track lands: brief "Track <X> done — +<N> rows, total
    <NEW_TOTAL>."
  - When pausing on a blocker: brief "Track <X> blocked on <reason>.
    Moving to Track <Y>."
  - When a session ends: run Track L (even partial), commit, push,
    summary message: rows added this session, tracks completed,
    tracks remaining.
  - When asked for current status: read docs/masterplan/PROGRESS.md
    and summarise in <30 lines.

STEP 6 — When to pause and ask:

  - Genuine API key registration needed (e.g. INEGI Mexico) → tell
    founder which page, what to register, what to paste in
    .env.local
  - Destructive operation (DROP, rm -rf, force push) → ask first
  - Surprise data shape that breaks the pattern → try one fix, then
    document + move on
  - Cost-incurring action → direct yes/no recommendation + alternatives
  - Question only founder can answer (naming, tone, money) → ask
    one clear question

STEP 7 — When NOT to pause:

  - Sub-phase boundary inside a track ("should I move to D.5?") →
    just move
  - Successful gate ("should I commit?") → commit + push
  - Long-running pipeline ("should I wait?") → use ScheduleWakeup,
    work on independent track
  - Standard ingest pattern questions ("how do I write the
    pipeline?") → follow docs/handoff/08_INGEST_SCRIPTS.md §4

STEP 8 — After reading all 15 files in STEP 1, reply with EXACTLY:

  Master plan loaded.
  Current regional_cells: <number from handoff/04_CURRENT_STATE.md>
  Tracks ready to execute: B, [C if A.2 OR independent], D, E, F, G,
    [H if A.4 done], I, J, K, L
  Tracks blocked on founder: <list from A>
  Recommended starting track: <T-X> — <one sentence why>
  Awaiting "go" signal.

Do NOT start executing until founder responds.

That's the bootstrap. Begin.
```

---

## Notes for the founder

### What "go" means

Once the session confirms with "Awaiting 'go' signal", the founder
can say any of:

- `go` — execute the full sequence, pause only on real blockers
- `start with B` — execute just Track B, then stop and report
- `do B and C` — execute B then C, then stop
- `skip H` — execute everything except H
- `go but stop after each track` — verbose mode, founder approves between tracks

### What blocks execution

The session pauses for:

- Founder dependencies (A.1, A.2, A.3, A.4)
- Destructive operations
- Genuine "I don't know which option you want" questions
- API key registrations needing the founder's email/phone/card

The session does NOT pause for:

- Sub-phase decisions inside a track
- Successful verification gates
- Long-running pipelines (uses ScheduleWakeup)
- Standard pattern questions (answered in the handoff)

### How to resume after a session ends

The session writes `docs/masterplan/PROGRESS.md` continuously. A
new session resumes by:

1. Reading this same prompt
2. Reading `PROGRESS.md`
3. Knowing which tracks landed
4. Picking up from the next un-landed track

No coordination needed between sessions beyond `PROGRESS.md`.

---

## The progress file

`E:\atlas\website\docs\masterplan\PROGRESS.md` template (session
creates if absent):

```markdown
# Master Plan Progress

| Track | Status | Rows added | Completed at |
|---|---|---|---|
| A.1 DNS | OPEN / DONE | — | — |
| A.2 Tone | OPEN / DONE | — | — |
| A.3 Key | OPEN / DONE | — | — |
| A.4 Sirene CSV | OPEN / DONE | — | — |
| A.5 Images | OPEN / DEFERRED | — | — |
| B NAICS | OPEN / DONE | n/a (taxonomy) | — |
| C.1 Canada | OPEN / DONE | <N> | — |
| C.3 US re-execute | OPEN / DONE | <N> | — |
| D.2 Netherlands | OPEN / DONE | <N> | — |
| D.5 Spain | OPEN / DONE | <N> | — |
| D.8 Italy | OPEN / DONE | <N> | — |
| E.2 UK LAD | OPEN / DONE | <N> | — |
| E.3 UK MSOA | OPEN / DONE | <N> | — |
| F OECD | OPEN / DONE | <N> | — |
| G.2 Australia | OPEN / DONE | <N> | — |
| G.4 New Zealand | OPEN / DONE | <N> | — |
| H France | BLOCKED-A.4 / DONE | <N> | — |
| I.1 Mexico | OPEN / DONE | <N> | — |
| I.2 Argentina | OPEN / DONE | <N> | — |
| I.3 Chile | OPEN / DONE | <N> | — |
| I.4 Colombia | OPEN / DONE | <N> | — |
| I.5 Peru | OPEN / DONE | <N> | — |
| J.1 Sitemap | OPEN / DONE | n/a | — |
| J.2 Badges | OPEN / DONE | n/a | — |
| J.3 Last-updated | OPEN / DONE | n/a | — |
| J.4 OG images | OPEN / DEFERRED | n/a | — |
| J.5 Country pages | OPEN / DONE | n/a | — |
| J.6 Featured tiles | OPEN / DONE | n/a | — |
| K Verification | OPEN / DONE | n/a | — |
| L Handoff | OPEN / DONE | n/a | — |

## Notes per track

(blank — session adds notes as tracks land or block)

## Session log

(blank — session appends one line per session start/end)
```

---

## Variants

### Short variant — single track

To execute just one track, paste this shorter prompt:

```
Execute Track <X> from E:\atlas\website\docs\masterplan\.

Read 02_RAM_AND_OPERATIONS_DISCIPLINE.md and the track's own file
(e.g. 04_TRACK_B_*.md). Honour the never-do rules in
docs/handoff/10_NEVER_DO_RULES.md.

After completion: update docs/masterplan/PROGRESS.md and commit.
Do NOT execute other tracks.
```

### Verification-only variant

To run just Track K's final smoke test on the current state:

```
Run Track K verification from E:\atlas\website\docs\masterplan\13_TRACK_K_VERIFICATION_AND_QA.md
without doing any ingest. Report the 200-URL smoke test pass rate
and any failures. Update PROGRESS.md and stop.
```

### Handoff-refresh-only variant

After founder-driven changes that don't involve the session:

```
Run Track L from E:\atlas\website\docs\masterplan\14_TRACK_L_HANDOFF_REFRESH.md
to refresh the handoff folder. No new code, no new ingest. Just
sync docs/handoff/ with current Supabase state.
```
