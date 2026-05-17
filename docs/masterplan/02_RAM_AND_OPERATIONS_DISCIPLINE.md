# 02 · RAM and Operations Discipline

> Non-negotiable operational rules. Every track inherits these.
> Violations block the dev machine, leak data, or break production.

---

## 1 · The RAM contract

### Hard cap: 600 MB RSS per Python script

The dev machine has finite RAM. Founder explicit: "do not exceed
70% RAM" / "do not block the machine". Single biggest source of
operational pain.

### How it's enforced

Every Python ingest script wraps execution in `RamGuard`:

```python
from common.ram_guard import RamGuard, current_rss_mb

with RamGuard(cap_mb=600, label="my-phase") as g:
    for unit in units:
        process(unit)
        g.tick()    # raises RamGuardError if RSS > 600 MB
```

If `tick()` fires the error, the script aborts cleanly with a
diagnostic message. Resume support (per-phase `progress.json`)
ensures no work is lost.

### What to NEVER do (R-007, R-008, R-009)

| Pattern | Why it breaks the cap | Alternative |
|---|---|---|
| `pd.read_csv(huge_file)` | Loads full 6 GB into memory | `pd.read_csv(huge_file, chunksize=50000)` for small files; **DuckDB streaming** for huge ones |
| Parallel `requests.get` across countries | RAM × N | Sequential — one country at a time |
| Loading entire Supabase table into memory | Could be GB | Paginate with `range=0-999`, `range=1000-1999`, etc. |
| Accumulating raw API responses for a whole multi-country sweep | OK if < 500 MB; risky if more | Flush to disk every N batches; merge from disk |
| Building 10M-row dicts in Python | Each dict entry ~200 bytes overhead | Use a generator; write to disk |

### DuckDB streaming pattern (for files > 1 GB)

```python
import duckdb
con = duckdb.connect(":memory:")
con.execute("SET memory_limit='400MB'")
con.execute("SET threads=2")  # don't overdo it
con.execute("""
    CREATE TABLE agg AS
    SELECT codeCommune, NAF3, COUNT(*) AS n
    FROM read_csv('StockUniteLegale.csv', auto_detect=true)
    WHERE etablissementSiege = true
    GROUP BY 1, 2
""")
# DuckDB spills to disk when memory exceeded;
# Python process RSS stays under 100 MB.
```

---

## 2 · Sequential execution

### One country at a time, one phase at a time

Never run two ingests in parallel — neither via `&`, nor via two
terminals, nor via `concurrent.futures`. Even API I/O (waiting on
external HTTP) is sequential.

Why: even idle-waiting consumes connection pools, file handles, and
keeps Python's working set in RAM. Two pipelines doubles the
exposure to bursts.

### What "sequential" actually means

| Concept | Allowed | Not allowed |
|---|---|---|
| Multiple `requests.get` inside one script, with `time.sleep` | Yes | n/a |
| `Bash run_in_background=True` for a long pipeline + monitoring | Yes (the script is sequential internally) | Running 2 background bash with different pipelines |
| Multiple Bash calls in parallel inside one turn | Only for fast, independent, low-RAM reads (e.g. `Read` calls or row-count queries) | Not for ingest scripts |
| `ScheduleWakeup` to check on a long script | Yes | n/a |

---

## 3 · Idempotency

### All Supabase upserts must use `Prefer: resolution=merge-duplicates`

This is what `common/upload_to_supabase.py` does by default. Don't
roll your own upsert.

Why it matters:

- Resume after crash: re-upserting the same rows merges instead of
  failing with PK conflict
- Re-run after schema change: same rows, additional columns now
  populated, merge handles it
- Idempotent CI: running an ingest twice in dry-run mode doesn't
  pollute the table

---

## 4 · Resume support

### Every pipeline writes `delivery/regional/<phase>/progress.json`

Per `D-059`. Granularity: per (country, NAICS-3) for US, per
(indicator, year) for Eurostat, per (CNAE category, year) for IBGE.

After every unit of work:

```python
progress.setdefault("done", []).append(unit_id)
save_progress(progress)
```

On startup, skip any unit already in `progress["done"]`.

### Never delete `progress.json` mid-run

R-028. If you genuinely need to start fresh, remove only the
specific `<phase>/progress.json` file. Never `rm -rf delivery/`.

---

## 5 · Commit cadence

### Commit per phase, push immediately

Per `D-092`. Every Python pipeline that lands rows produces:

1. A commit on `main` with message:
   ```
   ingest: phase <N> <country> — +<row_count> rows
   
   <one-line description of method>
   Total regional_cells: <new_total>
   
   Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
   ```
2. `git push origin main`
3. Vercel auto-deploys
4. Verify on `marginatlas-web-twtl.vercel.app` within 60 seconds

### Commit per frontend change

Same pattern. Message:

```
<area>: <one-line summary>

<bullet list of what changed>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

### Never use `--no-verify`

R-013. If the pre-commit hook fails, fix the issue.

### Never use `git push --force` to main

R-012. Destructive.

---

## 6 · Verification gates

### Per-track gates from `01_OBJECTIVES_AND_TARGETS.md`

Each track has a gate. Do not proceed to the next track until the
current gate passes. If a gate fails:

1. Stop
2. Diagnose
3. Fix
4. Re-run
5. Re-verify

Do not "ship and circle back". Circling back never happens.

### Universal gates (run after every track)

| Check | Command |
|---|---|
| TypeScript | `npx tsc --noEmit` |
| Taxonomy | `npx tsx scripts/verify_taxonomy.ts` |
| Lint | `npm run lint` |
| Smoke test (post-deploy) | `curl -sI https://marginatlas-web-twtl.vercel.app/` returns 200 |

---

## 7 · Secret handling

### Never echo a key in chat (R-018)

| Need | Do this |
|---|---|
| Run a Python ingest | Read key from `os.environ.get(...)` with hardcoded default |
| Need to update Vercel env var | Read `.env.local` with `Read` tool, then ask founder to paste click-by-click |
| Confused which key is which | Reference key NAME in chat; never the value |
| Founder asks "what's my X key" | Read `.env.local`, paste value in chat (they asked, they get it) |

### Never commit `.env.local` (R-006)

`.gitignore` already excludes it. If `git status` ever shows
`.env.local` as new or modified, stop and verify the gitignore is
working before staging anything.

---

## 8 · Source-agency lockdown (R-002)

### When ingesting a new source

The `coverage_source` field on each row goes to the database — but
the UI never shows the raw value. `QualityBadge.tsx`'s
`genericSource()` function maps every agency keyword to a generic
label.

Pattern when normalising a new source:

```python
return {
    ...
    "coverage_source": "National business statistics",  # GENERIC label
    # NEVER: "coverage_source": "Eurostat sbs_r_nuts06_r2"
    ...
}
```

If the new source's specific name is useful internally, store it
internally (e.g. in `progress.json`) — but the table column gets
the generic label.

---

## 9 · Storage discipline

### Supabase has 8 GB Pro tier — currently ~360 MB used

Adding 220k rows at ~300 bytes/row = ~66 MB. Still 5% usage after
sweep. No pressure.

But: never upload duplicate rows. Use the PK (`country, geo_id,
industry_id, year, size_band`). If you accidentally created
duplicates from a re-run with wrong data: delete the bad rows
first, then re-run.

### Never commit large source files to git (R-025)

CSVs / parquet / cached SDMX responses go to
`E:\atlas\delivery\regional\<phase>/`. That folder is NOT in git
(intentional).

---

## 10 · Frontend discipline

### Tailwind palette is closed (R-001)

`tailwind.config.ts` defines `atlas`, `cream`, `parchment`, `moss`,
`clay`, `cocoa`, `ink`, sparse `teal-700`. Do not add `cyan`,
`sky`, `azure`, `indigo`, `aquamarine`. Sibling product reservation.

### No editorial content without tone decision (R-026)

Cell narratives stay dry-factual. Country pages stay neutral. /ask
stays preview-stub. Plan v3 Phases B.5 / G / H are deferred until
Track A.2 lands.

### No "Coming soon" tiles (R-016)

A featured tile with no data returns `null` from its server
component — the tile is dropped, not placeholder'd.

### No banking / oil / pharma in default UI (R-003, R-011)

Pro-only sectors are gated by `?pro=1` or `atlas_pro=1` cookie. CI
fails the build if any default-visible sector has the words
"banking", "mining", "energy", "pharma", "telecom" in its name.

---

## 11 · Pause-vs-execute decision tree

When the session is mid-execution and hits something unexpected:

```
Did you hit:
├── A genuine blocker (missing API key, founder-only action, payment required)?
│   → PAUSE. Report. Move to next independent track.
├── A failed gate (target not hit)?
│   → STOP that track. Diagnose. Fix. Re-run. Re-verify.
├── A non-blocking warning (LF/CRLF, deprecation notice)?
│   → CONTINUE. Note in commit message if relevant.
├── A surprise data shape (extra column, missing column, encoding)?
│   → Try one fix. If still failing, document + move on to next country.
├── A destructive operation prompt (DROP, rm -rf, force push)?
│   → STOP. Ask founder.
├── A question only founder can answer (tone, naming, money)?
│   → STOP. Ask one clear question.
└── Otherwise:
    → EXECUTE.
```

---

## 12 · End-of-session protocol

Before stopping a session (planned or unplanned):

1. Save any in-flight `progress.json`
2. Commit + push all completed tracks (don't leave landed rows un-committed)
3. Update `docs/handoff/04_CURRENT_STATE.md` if a major delta landed
4. Update `docs/ingest/19_VERIFICATION_QUALITY.md` scoreboard
5. If any track is mid-flight: note where you stopped in
   `docs/masterplan/PROGRESS.md` (create if absent) — one line per
   in-flight track
6. Last commit message includes: rows added this session, tracks
   completed this session, tracks remaining

This is what makes the next session pick up cleanly.

---

## 13 · Summary card

| Rule | Source |
|---|---|
| 600 MB RSS cap | R-009, D-055 |
| Sequential only | R-008, D-056 |
| Idempotent upserts | R-030, D-058 |
| Resume via progress.json | D-059, R-028 |
| Commit per phase, push immediately | D-092 |
| No `--no-verify`, no force push | R-012, R-013 |
| Never echo or commit secrets | R-006, R-018 |
| Generic `coverage_source` labels | R-002 |
| Tailwind palette closed | R-001 |
| No editorial before tone | R-026 |
| No "Coming soon" tiles | R-016 |
| No banking/oil/pharma in default UI | R-003, R-011 |
| `tsc --noEmit` clean before any TS commit | R-010 |
| `verify_taxonomy.ts` clean after taxonomy edit | R-024 |
| Plain language ("slop" not "flop"; no fluff) | R-019, R-021 |
| No "okay" in responses | R-004 |
