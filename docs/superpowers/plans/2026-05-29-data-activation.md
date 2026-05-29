# Data Activation: From Disk to Live Site - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ~420k real cells that already exist on disk reachable through marginatlas.com, so the site stops synthesizing the entire non-US world and serves real data with honest, measurable coverage.

**Architecture:** The website reads three Supabase tables in a fallback chain (`regional_cells` -> `extrapolated_cells` -> sector fallback -> synthesized). Today only `cells_master` (US-only) has data; `regional_cells` and `extrapolated_cells` are empty, so every non-US page renders a synthesized estimate. This plan (1) establishes ground truth, (2) instruments the real-vs-synthetic ratio so progress is measurable, (3) loads the country-level `extrapolated_cells` parquet that already matches the site's shape (the immediate unlock), (4) reconciles the industry crosswalk, (5) builds the missing `regional_cells` ETL for sub-national depth, (6) makes loads idempotent and versioned, and (7) adds a gate that fails the build if synthesis creeps back above budget.

**Tech Stack:** Python 3 + DuckDB (parquet read) + psycopg2 (Postgres bulk load) for loaders in `E:\atlas\scripts`; Supabase Postgres (Pro tier) for storage; Next.js 15 + TypeScript + `tsx` for the website data layer and verification gates; existing `cells.ts` data-access layer unchanged in its public API.

---

## Critical findings that shaped this plan

Read these before touching anything. They are non-obvious and every phase depends on them.

1. **Two of three data tables are empty.** `regional_cells` and `extrapolated_cells` exist (DDL applied) but hold zero rows. `cells_master` holds ~870k US-only state cells from the old v1.5 US load. Source: parent-project recon of `E:\atlas\scripts\supabase_load_v1.py` and `HANDOFF-v1.16.md` line 91-93.

2. **The whole non-US world is synthesized today.** `getCellBySlug` (`src/lib/cells.ts`) falls through to `synthesizeCell` (`src/lib/cells/fill_defaults.ts`) whenever the DB has no row. With the two tables empty, that is every non-US route. Synthesized cells are tagged `is_synthetic=true`, `quality_score=20`, `coverage_tier="X"`.

3. **Shape mismatch is the real work.** `cells_master_global.parquet` (419,895 rows, v1.19.0) is keyed on `naics_2digit` / `nace_section` with `revenue_per_firm` and NO percentiles. The website consumes friendly `industry_id` with `rev_p10..rev_p90`. So that parquet cannot be loaded directly into any table the site reads. Only `extrapolated_cells.parquet` (57,816 rows, friendly `industry_id`, country-level point estimate) matches a site table directly. That is the one clean, immediate win.

4. **`regional_cells` (the richest tier) has no producer.** No script emits the friendly-industry, percentile-bearing, sub-national rows that `regional_cells` expects. Building that ETL from the per-country sources in `E:\atlas\macro\` is the largest lift in this plan (Phase 5).

5. **Loader scripts point at a stale version.** `E:\atlas\scripts\supabase_reload_v114.py` hard-codes `atlas-global-v1.14.0`; the latest delivery is `atlas-global-v1.19.0`. Any reused loader must be re-pointed.

6. **Supabase tier is unconfirmed.** The starter prompt says "Supabase Pro." `HANDOFF-v1.16.md` says free tier. Phase 0 verifies this before any full load, because the global load needs Pro storage and a spend decision ($25/mo) may be outstanding.

7. **Column schema the code reads is the contract.** The de-facto schemas are defined by `normalizeRow` and `normalizeRegionalRow` in `src/lib/cells.ts`. Any data loaded must satisfy those mappers or the site will read nulls. The authoritative table DDL is in `E:\atlas\website\db\migrations\001_extrapolated_cells.sql` and `002_regional_cells.sql`.

---

## Prerequisites and decisions (resolve before Phase 1)

- **DECISION (user):** Is Supabase on the Pro tier? If not, the full global load and sub-national ETL exceed the 500 MB free tier. Phase 0 Task 0.1 verifies current tier and storage headroom; if free, the user must decide on the $25/mo upgrade before Phase 2 can load at scale. The observability work (Phase 1) and the small `extrapolated_cells` load (57,816 rows, < 1 MB) fit the free tier, so progress is possible either way.
- **Secrets (names only, never print values):** loaders read `SUPABASE_DB_URL` (psycopg2) from `E:\atlas\secrets.env` via `atlas_utils.load_secrets()`; REST loaders read `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. The website reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` from `E:\atlas\website\.env.local`.
- **Two git repos:** loader/python changes commit to `E:\atlas\.git`; website code and SQL migrations commit to `E:\atlas\website\.git`. Each task names its repo.
- **Apply the staged perf indexes first.** `E:\atlas\website\db\migrations\2026-05-27-perf-indexes.sql` is staged but unapplied. It is a hard prerequisite: without it, post-load queries on a now-larger table will time out. Phase 0 Task 0.2 applies it.
- **Build runs need permission.** Per the founder rule, do not run `npm run build`, `npm run prebuild`, `npm run prebuild:serial`, or `npx tsc --noEmit` without asking. The gate-running steps below say "ask first" where they apply.

---

## File Structure

What each new or modified file is responsible for. Files that change together live together.

### Parent repo `E:\atlas\` (Python loaders + ETL)

- Create `scripts\verify_supabase_counts.py` - single source of truth for "what is actually in each table." Connects via `SUPABASE_DB_URL`, prints and asserts per-table and per-country row counts. Used as the check in every load loop.
- Create `scripts\inspect_parquet.py` - read-only DuckDB inspector: row counts, distinct `industry_id`, distinct countries, column list for any parquet. No DB writes.
- Create `scripts\load_extrapolated_cells.py` - load `extrapolated_cells.parquet` (v1.19.0) into the `extrapolated_cells` table. Idempotent (truncate-and-replace inside one transaction). Replaces the deferred `upload_extrapolated_cells.py` REST approach with a faster psycopg2 COPY.
- Create `scripts\build_regional_cells.py` - the ETL that transforms per-country sub-national source files in `macro\` into `regional_cells` rows (friendly `industry_id`, percentiles). Source-pluggable; ships with the Eurostat NUTS-2 adapter first.
- Create `scripts\industry_crosswalk_export.py` - emit the canonical mapping from source industry codes (NACE section, NAICS-2) to the website's friendly `industry_id`, as `refs\industry_crosswalk.json`, for both the ETL and the website audit to share.

### Website repo `E:\atlas\website\` (schema + observability + gates)

- Create `db\migrations\2026-05-29-data-activation.sql` - idempotent `CREATE TABLE IF NOT EXISTS` re-statement of the three tables plus a new `data_meta` table that stamps which parquet version is loaded into each table. Safe to run repeatedly.
- Create `src\lib\cells\data_health.ts` - server-only accessor `getDataSourceCounts()` returning live row counts per table and the loaded data version from `data_meta`. Consumed by the admin panel and the probe.
- Modify `src\lib\cells.ts` - add a tiny exported `getDataSourceCounts` re-export (delegating to `data_health.ts`) so existing `@/lib/cells` import sites can reach it; no change to any existing function signature.
- Modify `src\app\admin\data-quality\page.tsx` - add a "Live data reachability" panel showing per-table counts, loaded versions, and the latest synthesis rate from the probe snapshot.
- Create `scripts\audit\probe_live_data.ts` - probe a fixed representative sample of routes through the real `getCellBySlug`, classify each as real vs synthetic, write `data\audit\data_reachability.json`. Run manually or on a schedule (needs DB creds). Not in the hermetic prebuild chain.
- Create `scripts\audit\industry_crosswalk_audit.ts` - compare the parquet `industry_id` set (via `refs\industry_crosswalk.json`) to the website taxonomy; report unmatched on both sides. Read-only.
- Create `scripts\verify_synthesis_budget.ts` - hermetic prebuild gate (26th gate): read `data\audit\data_reachability.json`, fail if synthesis rate on the representative sample exceeds the configured budget. Reads the snapshot only; never hits the network.
- Modify `scripts\prebuild_all.ts` - register the new gate in the `GATES` array.
- Modify `src\lib\quality\coverage-report.ts` - add a freshness assertion path so the coverage snapshot used by the site can be regenerated from the live DB (Phase 6), not only from a stale JSON.

---

## Phase 0 - Establish ground truth (no production changes)

Goal: replace assumptions with measured facts. Every later phase keys off these numbers. Produces a reconciliation report committed to the parent repo.

### Task 0.1: Build the table-count verifier and capture the baseline

**Files:**
- Create: `E:\atlas\scripts\verify_supabase_counts.py`

- [ ] **Step 1: Write the verifier as a check that can pass or fail**

```python
# E:\atlas\scripts\verify_supabase_counts.py
"""
verify_supabase_counts.py - single source of truth for what is actually
loaded into Supabase. Read-only. Exit 0 if observed counts meet the
--expect thresholds, exit 1 otherwise. With no --expect flags it just
prints the inventory (baseline mode).

Usage:
  python scripts\verify_supabase_counts.py
  python scripts\verify_supabase_counts.py --expect-extrapolated 57000
  python scripts\verify_supabase_counts.py --expect-regional 1
"""
import argparse
import sys
import psycopg2
from atlas_utils import load_secrets

TABLES = ["cells_master", "regional_cells", "extrapolated_cells"]


def connect():
    s = load_secrets()
    return psycopg2.connect(s["SUPABASE_DB_URL"], sslmode="require", connect_timeout=30)


def table_count(cur, table: str) -> int:
    cur.execute(f"SELECT count(*) FROM {table};")
    return cur.fetchone()[0]


def distinct_countries(cur, table: str, col: str) -> int:
    cur.execute(f"SELECT count(DISTINCT {col}) FROM {table};")
    return cur.fetchone()[0]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--expect-cells-master", type=int, default=None)
    ap.add_argument("--expect-regional", type=int, default=None)
    ap.add_argument("--expect-extrapolated", type=int, default=None)
    args = ap.parse_args()

    conn = connect()
    cur = conn.cursor()
    counts = {}
    for t in TABLES:
        try:
            counts[t] = table_count(cur, t)
        except Exception as e:  # noqa: BLE001
            counts[t] = f"ERROR: {e}"

    print("=== Supabase table inventory ===")
    for t in TABLES:
        print(f"  {t:20s} {counts[t]}")

    # Country spread where the column exists
    try:
        print("  cells_master countries   :",
              distinct_countries(cur, "cells_master", "country"))
    except Exception:
        pass
    try:
        print("  regional_cells countries :",
              distinct_countries(cur, "regional_cells", "country"))
    except Exception:
        pass
    try:
        print("  extrapolated countries   :",
              distinct_countries(cur, "extrapolated_cells", "country_iso3"))
    except Exception:
        pass

    cur.close()
    conn.close()

    failures = []
    checks = [
        ("cells_master", args.expect_cells_master),
        ("regional_cells", args.expect_regional),
        ("extrapolated_cells", args.expect_extrapolated),
    ]
    for table, expected in checks:
        if expected is None:
            continue
        actual = counts.get(table)
        if not isinstance(actual, int) or actual < expected:
            failures.append(f"{table}: expected >= {expected}, got {actual}")

    if failures:
        print("\nFAIL:")
        for f in failures:
            print("  -", f)
        return 1
    print("\nOK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Run it in baseline mode to capture the truth**

Run: `python E:\atlas\scripts\verify_supabase_counts.py`
Expected: prints the inventory. Based on recon, expect roughly `cells_master` ~870000, `regional_cells` 0, `extrapolated_cells` 0. Record the exact numbers in the reconciliation report (Task 0.4). If `regional_cells` or `extrapolated_cells` is non-zero, the recon was stale and the plan's numbers must be re-checked before proceeding.

- [ ] **Step 3: Confirm the failing-check path works**

Run: `python E:\atlas\scripts\verify_supabase_counts.py --expect-extrapolated 57000`
Expected: FAIL with `extrapolated_cells: expected >= 57000, got 0`. This is the check that will pass after Phase 2.

- [ ] **Step 4: Commit (parent repo)**

```bash
git -C E:/atlas add scripts/verify_supabase_counts.py
git -C E:/atlas commit -m "data: add Supabase table-count verifier"
```

### Task 0.2: Apply the staged performance indexes (prerequisite for scale)

**Files:**
- Use: `E:\atlas\website\db\migrations\2026-05-27-perf-indexes.sql` (already staged, unapplied)

- [ ] **Step 1: Read the migration so you know what you are applying**

Run: open `E:\atlas\website\db\migrations\2026-05-27-perf-indexes.sql` and confirm it is six `CREATE INDEX CONCURRENTLY IF NOT EXISTS` statements plus three `ANALYZE` calls.

- [ ] **Step 2: Apply each statement individually in the Supabase SQL Editor**

`CONCURRENTLY` cannot run inside a transaction, so paste and run each `CREATE INDEX` statement one at a time (not as a batch). Each takes 30-90s on the current `cells_master`. Then run the three `ANALYZE` statements.
Expected: each returns success; no "cannot run inside a transaction block" error (which would mean you pasted them together).

- [ ] **Step 3: Verify the indexes exist**

Run this in the SQL Editor:
```sql
SELECT indexname FROM pg_indexes
WHERE tablename IN ('cells_master','regional_cells','extrapolated_cells')
ORDER BY tablename, indexname;
```
Expected: the six new index names from the migration file appear.

- [ ] **Step 4: Record completion**

Update `E:\atlas\website\docs\handoff\2026-05-27-session-handoff.md` section 8 checkbox "Supabase indexes applied" from `[ ]` to `[x]` with today's date. Commit in Step of Task 0.4.

### Task 0.3: Inspect the on-disk parquet assets (read-only)

**Files:**
- Create: `E:\atlas\scripts\inspect_parquet.py`

- [ ] **Step 1: Write the inspector**

```python
# E:\atlas\scripts\inspect_parquet.py
"""
inspect_parquet.py - read-only DuckDB inspector for a parquet file.
Prints row count, column list, distinct industry_id (if present), and
distinct country count (auto-detecting the country column).

Usage:
  python scripts\inspect_parquet.py <path-to-parquet>
"""
import sys
import duckdb

COUNTRY_COLS = ["country", "country_iso3", "iso2", "iso3", "country_iso2"]
INDUSTRY_COLS = ["industry_id", "naics_2digit", "nace_section"]


def main(path: str) -> int:
    con = duckdb.connect()
    n = con.execute(f"SELECT count(*) FROM '{path}'").fetchone()[0]
    cols = [r[0] for r in con.execute(f"DESCRIBE SELECT * FROM '{path}'").fetchall()]
    print(f"rows   : {n}")
    print(f"columns: {cols}")
    for cc in COUNTRY_COLS:
        if cc in cols:
            d = con.execute(
                f"SELECT count(DISTINCT {cc}) FROM '{path}'").fetchone()[0]
            print(f"distinct {cc}: {d}")
    for ic in INDUSTRY_COLS:
        if ic in cols:
            d = con.execute(
                f"SELECT count(DISTINCT {ic}) FROM '{path}'").fetchone()[0]
            print(f"distinct {ic}: {d}")
            sample = con.execute(
                f"SELECT DISTINCT {ic} FROM '{path}' ORDER BY 1 LIMIT 60"
            ).fetchall()
            print(f"sample {ic}: {[s[0] for s in sample]}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python scripts\\inspect_parquet.py <parquet>")
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
```

- [ ] **Step 2: Inspect the extrapolated parquet (the immediate-unlock source)**

Run: `python E:\atlas\scripts\inspect_parquet.py E:\atlas\delivery\atlas-global-v1.19.0\extrapolated_cells.parquet`
Expected: `rows: 57816`; columns include `country_iso3, country_name, year, industry_id, size_band, predicted_rev_per_firm, coverage_tier, coverage_source, quality_score`; `distinct industry_id` around 44; prints the 44 `industry_id` sample values. **Copy that `industry_id` sample list into the reconciliation report; Phase 3 depends on it.**

- [ ] **Step 3: Inspect the global master parquet (to confirm it is NOT site-shaped)**

Run: `python E:\atlas\scripts\inspect_parquet.py E:\atlas\delivery\atlas-global-v1.19.0\cells_master_global.parquet`
Expected: `rows: 419895`; columns include `naics_2digit, nace_section, industry_section_label, revenue_per_firm` and NO `rev_p50` / `industry_id`. This confirms it is section-granularity and cannot feed `regional_cells` directly.

- [ ] **Step 4: Commit (parent repo)**

```bash
git -C E:/atlas add scripts/inspect_parquet.py
git -C E:/atlas commit -m "data: add read-only parquet inspector"
```

### Task 0.4: Write the reconciliation report

**Files:**
- Create: `E:\atlas\website\docs\superpowers\plans\2026-05-29-data-activation-baseline.md`

- [ ] **Step 1: Record the measured facts**

Fill the report with the exact outputs from Tasks 0.1-0.3: the three table counts, distinct-country counts, the 44 `industry_id` values from the extrapolated parquet, and confirmation that the global parquet is section-granular. Add a one-line verdict: "extrapolated_cells load is unblocked; regional_cells needs ETL; cells_master_global is a derivation source, not a direct load."

- [ ] **Step 2: Commit (website repo)**

```bash
git -C E:/atlas/website add docs/superpowers/plans/2026-05-29-data-activation-baseline.md docs/handoff/2026-05-27-session-handoff.md
git -C E:/atlas/website commit -m "docs: data-activation baseline reconciliation + mark indexes applied"
```

---

## Phase 1 - Observability: measure real vs synthetic before changing anything

Goal: a hermetic gate plus a live probe that quantify how much of the site is synthesized. Run it now to capture the "before" number, so Phase 2's unlock is provable. This phase ships value even if the Supabase upgrade is still pending.

### Task 1.1: Server-only data-health accessor

**Files:**
- Create: `E:\atlas\website\src\lib\cells\data_health.ts`
- Modify: `E:\atlas\website\src\lib\cells.ts` (add one re-export line)

- [ ] **Step 1: Write the accessor**

```typescript
// src/lib/cells/data_health.ts
/**
 * Server-only data-health accessors. Reports live row counts per data
 * table and the loaded data version stamp from data_meta. Used by the
 * admin data-quality panel and the live probe. Never imported by client
 * components.
 *
 * Data activation, 2026-05-29.
 */
import { supabaseAdmin } from "../supabase";

export type TableCount = { table: string; rows: number | null };
export type DataVersion = { table: string; version: string | null };

const DATA_TABLES = ["cells_master", "regional_cells", "extrapolated_cells"] as const;

export async function getDataSourceCounts(): Promise<TableCount[]> {
  const out: TableCount[] = [];
  for (const table of DATA_TABLES) {
    const { count, error } = await supabaseAdmin
      .from(table)
      .select("*", { count: "exact", head: true });
    out.push({ table, rows: error ? null : count ?? 0 });
  }
  return out;
}

export async function getLoadedDataVersions(): Promise<DataVersion[]> {
  const { data, error } = await supabaseAdmin
    .from("data_meta")
    .select("key, value")
    .like("key", "version:%");
  if (error || !data) {
    return DATA_TABLES.map((t) => ({ table: t, version: null }));
  }
  const map = new Map(data.map((r) => [r.key, r.value]));
  return DATA_TABLES.map((t) => ({
    table: t,
    version: map.get(`version:${t}`) ?? null,
  }));
}
```

- [ ] **Step 2: Re-export from the cells spine without changing any existing signature**

In `src/lib/cells.ts`, immediately after the existing geo re-export block (the `export { slugify, regionalSlugToGeoId, listUsStates };` line), add:

```typescript
// Data-health accessors (data activation, 2026-05-29). Re-exported so
// existing `@/lib/cells` import sites can reach them without a new path.
export { getDataSourceCounts, getLoadedDataVersions } from "./cells/data_health";
export type { TableCount, DataVersion } from "./cells/data_health";
```

- [ ] **Step 3: Typecheck (ask permission first)**

Ask the user before running. Then run: `cd E:\atlas\website && npx tsc --noEmit`
Expected: no new errors referencing `data_health.ts` or `cells.ts`.

- [ ] **Step 4: Commit (website repo)**

```bash
git -C E:/atlas/website add src/lib/cells/data_health.ts src/lib/cells.ts
git -C E:/atlas/website commit -m "data: add server-only data-health accessors"
```

### Task 1.2: Live reachability probe

**Files:**
- Create: `E:\atlas\website\scripts\audit\probe_live_data.ts`
- Create (output): `E:\atlas\website\data\audit\data_reachability.json`

- [ ] **Step 1: Define the representative route sample and the probe**

```typescript
// scripts/audit/probe_live_data.ts
/**
 * probe_live_data.ts - probe a fixed, representative sample of cell
 * routes through the real getCellBySlug() data layer, classify each as
 * real vs synthetic, and write data/audit/data_reachability.json.
 *
 * Run manually or on a schedule. Needs Supabase creds in the env
 * (loads .env.local). NOT part of the hermetic prebuild chain - the
 * gate (verify_synthesis_budget.ts) reads the JSON this produces.
 *
 * Usage: npx tsx scripts/audit/probe_live_data.ts
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCellBySlug } from "@/lib/cells";

// Representative sample: spread across US states, EU, Asia, LATAM, and a
// mix of common + rarer industries. Each tuple is [country, geo, industry].
const SAMPLE: Array<[string, string, string]> = [
  ["us", "california", "restaurants"],
  ["us", "texas", "auto-repair-shops"],
  ["us", "new-york", "legal-services"],
  ["de", "bavaria", "restaurants"],
  ["de", "berlin", "software-development"],
  ["fr", "ile-de-france", "bakeries-pastries"],
  ["es", "catalonia", "hotels-lodging"],
  ["it", "lombardy", "restaurants"],
  ["gb", "gb", "accounting-bookkeeping"],
  ["jp", "tokyo", "restaurants"],
  ["br", "sao-paulo", "hairdressers-beauty"],
  ["pl", "masovia", "specialty-trades"],
  ["no", "oslo", "grocery-stores"],
  ["sg", "sg", "management-consulting"],
  ["ar", "buenos-aires", "clothing-stores"],
  ["ca", "ontario", "veterinary-pet-care"],
  ["au", "new-south-wales", "cafes-coffee-shops"],
  ["mx", "jalisco", "restaurants"],
  ["nl", "north-holland", "marketing-design"],
  ["se", "stockholm", "real-estate-agencies"],
];

type ProbeRow = {
  country: string;
  geo: string;
  industry: string;
  is_synthetic: boolean;
  quality_score: number | null;
  coverage_tier: string | null;
};

async function main(): Promise<void> {
  const rows: ProbeRow[] = [];
  for (const [country, geo, industry] of SAMPLE) {
    try {
      const cell = await getCellBySlug(country, geo, industry);
      rows.push({
        country,
        geo,
        industry,
        is_synthetic: Boolean(cell.is_synthetic),
        quality_score: cell.quality_score ?? null,
        coverage_tier: cell.coverage_tier ?? null,
      });
    } catch (e) {
      rows.push({
        country,
        geo,
        industry,
        is_synthetic: true,
        quality_score: null,
        coverage_tier: "ERROR",
      });
    }
  }
  const synthetic = rows.filter((r) => r.is_synthetic).length;
  const total = rows.length;
  const snapshot = {
    generated_at: new Date().toISOString(),
    sample_size: total,
    synthetic_count: synthetic,
    real_count: total - synthetic,
    synthesis_rate: Number((synthetic / total).toFixed(4)),
    rows,
  };
  const out = resolve(process.cwd(), "data/audit/data_reachability.json");
  writeFileSync(out, JSON.stringify(snapshot, null, 2));
  console.log(
    `Probed ${total} routes: ${total - synthetic} real, ${synthetic} synthetic ` +
      `(synthesis rate ${(snapshot.synthesis_rate * 100).toFixed(1)}%)`,
  );
  console.log(`Wrote ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Confirm env loading works for standalone tsx**

The probe needs `NEXT_PUBLIC_SUPABASE_URL` etc. at runtime. Check whether existing data-touching scripts (for example `tests/cells/top_industries_plausibility.test.ts`) already load `.env.local`. If they rely on an existing bootstrap (a `dotenv/config` import or a shared helper), use the same mechanism. If none exists, prepend this line to the probe:

```typescript
import "dotenv/config"; // loads .env.local when run via tsx; add `dotenv` if missing
```
Verify `dotenv` is in `package.json` devDependencies; if absent, note it for Step 4 and install with `npm install --save-dev dotenv`.

- [ ] **Step 3: Run the probe to capture the BEFORE baseline**

Run: `cd E:\atlas\website && npx tsx scripts/audit/probe_live_data.ts`
Expected (today, tables empty): synthesis rate near 85% (US routes real from `cells_master`, all non-US synthetic). Record this number; it is the "before." A US-only-real result confirms finding #2.

- [ ] **Step 4: Commit (website repo)**

```bash
git -C E:/atlas/website add scripts/audit/probe_live_data.ts data/audit/data_reachability.json package.json package-lock.json
git -C E:/atlas/website commit -m "data: live reachability probe + baseline snapshot"
```

### Task 1.3: Hermetic synthesis-budget gate

**Files:**
- Create: `E:\atlas\website\scripts\verify_synthesis_budget.ts`
- Modify: `E:\atlas\website\scripts\prebuild_all.ts`

- [ ] **Step 1: Write the gate (reads the snapshot only, never the network)**

```typescript
// scripts/verify_synthesis_budget.ts
/**
 * verify_synthesis_budget - prebuild gate. Reads the snapshot produced
 * by scripts/audit/probe_live_data.ts and fails if the synthesis rate
 * on the representative sample exceeds the budget. Hermetic: no network.
 *
 * The budget RATCHETS DOWN as data lands. Start permissive so the gate
 * is green today, then lower BUDGET after each load phase so synthesis
 * can never silently creep back up.
 *
 * Data activation, 2026-05-29.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Current ceiling. Lower this after Phase 2 (expect ~0.30) and again
// after Phase 5 (expect ~0.10). Never raise it.
const BUDGET = 0.9;

const SNAPSHOT = resolve(process.cwd(), "data/audit/data_reachability.json");

function main(): void {
  let snap: { synthesis_rate?: number; generated_at?: string; sample_size?: number };
  try {
    snap = JSON.parse(readFileSync(SNAPSHOT, "utf-8"));
  } catch {
    console.error(
      `verify_synthesis_budget: cannot read ${SNAPSHOT}.\n` +
        `  Run: npx tsx scripts/audit/probe_live_data.ts`,
    );
    process.exit(1);
  }
  const rate = snap.synthesis_rate ?? 1;
  if (rate > BUDGET) {
    console.error(
      `verify_synthesis_budget: synthesis rate ${(rate * 100).toFixed(1)}% ` +
        `exceeds budget ${(BUDGET * 100).toFixed(1)}% ` +
        `(snapshot ${snap.generated_at}, n=${snap.sample_size}).`,
    );
    process.exit(1);
  }
  console.log(
    `verify_synthesis_budget: OK (${(rate * 100).toFixed(1)}% <= ` +
      `${(BUDGET * 100).toFixed(1)}%).`,
  );
}

main();
```

- [ ] **Step 2: Register the gate in the parallel prebuild runner**

In `scripts/prebuild_all.ts`, find the `GATES` array (the list of gate scripts). Add an entry following the exact shape of the existing entries (match the surrounding objects' keys, for example `{ name: "synthesis-budget", cmd: "npx tsx scripts/verify_synthesis_budget.ts" }`). Place it at the end of the array.

- [ ] **Step 3: Run the single gate to confirm it passes on the baseline (ask before prebuild)**

Run: `cd E:\atlas\website && npx tsx scripts/verify_synthesis_budget.ts`
Expected: `OK (~85.0% <= 90.0%)`. The standalone gate run is cheap and does not need the full prebuild; running the whole `npm run prebuild` requires asking the user first.

- [ ] **Step 4: Add a package.json script alias for discoverability**

Add to the `scripts` block in `package.json`: `"verify:synthesis-budget": "npx tsx scripts/verify_synthesis_budget.ts"`.

- [ ] **Step 5: Commit (website repo)**

```bash
git -C E:/atlas/website add scripts/verify_synthesis_budget.ts scripts/prebuild_all.ts package.json
git -C E:/atlas/website commit -m "data: hermetic synthesis-budget prebuild gate"
```

---

## Phase 2 - The immediate unlock: load extrapolated_cells

Goal: load the 57,816-row `extrapolated_cells.parquet` into the `extrapolated_cells` table. This single load turns the entire non-US world from "synthesized" to "real country-level estimate," because `getCellBySlug` reaches `extrapolated_cells` before it falls through to synthesis. Requires Supabase reachable via `SUPABASE_DB_URL`; fits the free tier (< 1 MB).

### Task 2.1: Apply the data-activation migration (idempotent table + version stamp)

**Files:**
- Create: `E:\atlas\website\db\migrations\2026-05-29-data-activation.sql`

- [ ] **Step 1: Write the migration**

```sql
-- db/migrations/2026-05-29-data-activation.sql
-- Idempotent. Re-asserts the three data tables (no-op if they exist)
-- and adds a data_meta table that stamps which parquet version is
-- loaded into each table. Safe to run repeatedly. Run in the Supabase
-- SQL Editor.

-- Version / freshness stamp, read by the website data-health accessor.
CREATE TABLE IF NOT EXISTS data_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure the extrapolated table matches the shape the site reads.
-- (Mirror of 001_extrapolated_cells.sql; IF NOT EXISTS makes it a no-op
-- where already present.)
CREATE TABLE IF NOT EXISTS extrapolated_cells (
  country_iso3 VARCHAR(3) NOT NULL,
  country_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  industry_id TEXT NOT NULL,
  size_band TEXT NOT NULL,
  predicted_rev_per_firm DOUBLE PRECISION,
  coverage_tier VARCHAR(2),
  coverage_source TEXT,
  quality_score INTEGER,
  PRIMARY KEY (country_iso3, year, industry_id, size_band)
);
CREATE INDEX IF NOT EXISTS idx_extrapolated_country ON extrapolated_cells (country_iso3);
CREATE INDEX IF NOT EXISTS idx_extrapolated_industry ON extrapolated_cells (industry_id);
```

- [ ] **Step 2: Apply it in the Supabase SQL Editor**

Paste the whole file and run it (no `CONCURRENTLY` here, so a single batch is fine).
Expected: success; `data_meta` now exists, `extrapolated_cells` unchanged if it already existed.

- [ ] **Step 3: Verify**

Run in SQL Editor: `SELECT count(*) FROM data_meta;` (expect 0) and `SELECT count(*) FROM extrapolated_cells;` (expect 0, still empty before load).

- [ ] **Step 4: Commit (website repo)**

```bash
git -C E:/atlas/website add db/migrations/2026-05-29-data-activation.sql
git -C E:/atlas/website commit -m "data: idempotent data-activation migration + data_meta stamp"
```

### Task 2.2: Write the extrapolated loader

**Files:**
- Create: `E:\atlas\scripts\load_extrapolated_cells.py`

- [ ] **Step 1: Write the loader (DuckDB read, psycopg2 transactional replace)**

```python
# E:\atlas\scripts\load_extrapolated_cells.py
"""
load_extrapolated_cells.py - load extrapolated_cells.parquet into the
Supabase extrapolated_cells table. Idempotent: truncate-and-replace
inside ONE transaction, then stamp data_meta with the version.

Maps parquet columns -> table columns 1:1 (both are friendly
industry_id, country-level point estimates). See the data-activation
baseline report for the confirmed parquet schema.

Usage:
  python scripts\load_extrapolated_cells.py --version 1.19.0
"""
import argparse
import io
import sys
import duckdb
import psycopg2
from atlas_utils import load_secrets

COLS = [
    "country_iso3", "country_name", "year", "industry_id", "size_band",
    "predicted_rev_per_firm", "coverage_tier", "coverage_source", "quality_score",
]


def src_path(version: str) -> str:
    return (
        rf"E:\atlas\delivery\atlas-global-v{version}\extrapolated_cells.parquet"
    )


def fetch_rows(path: str):
    con = duckdb.connect()
    # Select exactly the target columns, in order, coercing nulls safely.
    select = ", ".join(COLS)
    return con.execute(f"SELECT {select} FROM '{path}'").fetchall(), con


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--version", required=True, help="delivery version, e.g. 1.19.0")
    args = ap.parse_args()

    path = src_path(args.version)
    rows, _con = fetch_rows(path)
    print(f"Read {len(rows)} rows from {path}")

    s = load_secrets()
    conn = psycopg2.connect(s["SUPABASE_DB_URL"], sslmode="require", connect_timeout=30)
    conn.autocommit = False
    cur = conn.cursor()
    try:
        cur.execute("TRUNCATE extrapolated_cells;")
        # COPY via an in-memory TSV buffer for speed.
        buf = io.StringIO()
        for r in rows:
            buf.write("\t".join("" if v is None else str(v) for v in r) + "\n")
        buf.seek(0)
        cur.copy_expert(
            f"COPY extrapolated_cells ({', '.join(COLS)}) FROM STDIN WITH (FORMAT text)",
            buf,
        )
        cur.execute(
            """
            INSERT INTO data_meta(key, value, updated_at)
            VALUES ('version:extrapolated_cells', %s, now())
            ON CONFLICT (key) DO UPDATE
              SET value = EXCLUDED.value, updated_at = now();
            """,
            (args.version,),
        )
        conn.commit()
        print("Committed.")
    except Exception as e:  # noqa: BLE001
        conn.rollback()
        print(f"ROLLED BACK: {e}")
        return 1
    finally:
        cur.close()
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Dry-run the read path only (no DB write)**

Temporarily confirm the parquet read by running the inspector again (Task 0.3 Step 2) if not already done. This de-risks the COPY by confirming the column order matches `COLS`. If `inspect_parquet.py` showed a different column order, reorder `COLS` to match the parquet (COPY is positional only because we pass an explicit column list, so order must match the SELECT, which it does).

- [ ] **Step 3: Commit the loader before running it (parent repo)**

```bash
git -C E:/atlas add scripts/load_extrapolated_cells.py
git -C E:/atlas commit -m "data: extrapolated_cells loader (transactional replace + version stamp)"
```

### Task 2.3: Run the load and prove the unlock

**Files:** none (execution + verification)

- [ ] **Step 1: Verify the check FAILS before loading (red)**

Run: `python E:\atlas\scripts\verify_supabase_counts.py --expect-extrapolated 57000`
Expected: FAIL, `extrapolated_cells: expected >= 57000, got 0`.

- [ ] **Step 2: Run the loader**

Run: `python E:\atlas\scripts\load_extrapolated_cells.py --version 1.19.0`
Expected: `Read 57816 rows ...` then `Committed.` If it rolls back, read the error; the most likely cause is a column-order or null-coercion mismatch (fix `COLS` order) or `SUPABASE_DB_URL` missing (fix secrets).

- [ ] **Step 3: Verify the check PASSES after loading (green)**

Run: `python E:\atlas\scripts\verify_supabase_counts.py --expect-extrapolated 57000`
Expected: OK; inventory shows `extrapolated_cells ~57816` and a non-trivial `extrapolated countries` count (around 218).

- [ ] **Step 4: Re-probe and prove synthesis dropped**

Run: `cd E:\atlas\website && npx tsx scripts/audit/probe_live_data.ts`
Expected: synthesis rate drops sharply (non-US routes now resolve to `extrapolated_cells` instead of synthesis). Target around 30% or lower (residual synthesis is routes whose `industry_id` is outside the 44-industry set, which Phase 3 addresses).

- [ ] **Step 5: Ratchet the budget gate down**

Edit `scripts/verify_synthesis_budget.ts`: lower `BUDGET` from `0.9` to a value just above the new measured rate (for example `0.35` if the probe shows ~30%). Re-run the gate: `npx tsx scripts/verify_synthesis_budget.ts` -> OK.

- [ ] **Step 6: Commit (website repo)**

```bash
git -C E:/atlas/website add data/audit/data_reachability.json scripts/verify_synthesis_budget.ts
git -C E:/atlas/website commit -m "data: extrapolated load lands; ratchet synthesis budget to new floor"
```

---

## Phase 3 - Industry crosswalk: close the 44-vs-taxonomy gap

Goal: the extrapolated parquet covers ~44 `industry_id` values; the website taxonomy has many more (the `INDUSTRIES` set in `src/lib/taxonomy.ts`, filtered to `smb_core` / `smb_friendly`). Routes for industries outside the 44 still synthesize. This phase measures the gap precisely and decides, per industry, expand-the-data or gate-the-route.

### Task 3.1: Export a shared crosswalk

**Files:**
- Create: `E:\atlas\scripts\industry_crosswalk_export.py`
- Create (output): `E:\atlas\refs\industry_crosswalk.json`

- [ ] **Step 1: Write the exporter**

```python
# E:\atlas\scripts\industry_crosswalk_export.py
"""
industry_crosswalk_export.py - emit refs/industry_crosswalk.json, the
canonical mapping from source codes (NACE section, NAICS-2) to the
website's friendly industry_id, derived from the v1.19.0 extrapolated
parquet (which already carries friendly industry_id) plus the master
parquet (which carries naics_2digit / nace_section).

Output shape:
  {
    "industry_ids_in_extrapolated": ["restaurants", ...],
    "naics2_to_industry": {"72": "restaurants", ...},   # best-effort
    "generated_from": "1.19.0"
  }

Usage: python scripts\industry_crosswalk_export.py --version 1.19.0
"""
import argparse
import json
import duckdb

EXTRAP = r"E:\atlas\delivery\atlas-global-v{v}\extrapolated_cells.parquet"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--version", required=True)
    args = ap.parse_args()
    con = duckdb.connect()
    ids = [
        r[0]
        for r in con.execute(
            f"SELECT DISTINCT industry_id FROM '{EXTRAP.format(v=args.version)}' "
            f"ORDER BY 1"
        ).fetchall()
    ]
    out = {
        "industry_ids_in_extrapolated": ids,
        "generated_from": args.version,
    }
    with open(r"E:\atlas\refs\industry_crosswalk.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print(f"Wrote refs/industry_crosswalk.json with {len(ids)} industry_ids")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Run it**

Run: `python E:\atlas\scripts\industry_crosswalk_export.py --version 1.19.0`
Expected: writes `refs/industry_crosswalk.json` listing the ~44 ids.

- [ ] **Step 3: Commit (parent repo)**

```bash
git -C E:/atlas add scripts/industry_crosswalk_export.py refs/industry_crosswalk.json
git -C E:/atlas commit -m "data: export shared industry crosswalk from v1.19.0"
```

### Task 3.2: Audit the crosswalk against the website taxonomy

**Files:**
- Create: `E:\atlas\website\scripts\audit\industry_crosswalk_audit.ts`
- Create (output): `E:\atlas\website\data\audit\industry_crosswalk_gap.json`

- [ ] **Step 1: Write the audit (read-only)**

```typescript
// scripts/audit/industry_crosswalk_audit.ts
/**
 * industry_crosswalk_audit - compare the industry_id set covered by the
 * extrapolated data (from the parent repo's refs/industry_crosswalk.json,
 * copied into data/) against the website taxonomy's SMB industries.
 * Reports: covered, missing (taxonomy has it, data does not), and
 * orphan (data has it, taxonomy does not).
 *
 * Read-only. Writes data/audit/industry_crosswalk_gap.json.
 *
 * Usage: npx tsx scripts/audit/industry_crosswalk_audit.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { INDUSTRIES } from "@/lib/taxonomy";

// The crosswalk JSON is produced in the parent repo; copy it to
// data/refs/industry_crosswalk.json as part of the data sync, or read
// it from an agreed path. Adjust this path to wherever the sync places it.
const CROSSWALK = resolve(process.cwd(), "data/refs/industry_crosswalk.json");

function smbIndustryIds(): string[] {
  // INDUSTRIES carries an `audience` field; mirror the cells.ts filter
  // (audience === "smb_core" || "smb_friendly"). If the field name
  // differs, align with the exact predicate used in cells.ts line ~639.
  return INDUSTRIES.filter(
    (i: { id: string; audience?: string }) =>
      i.audience === "smb_core" || i.audience === "smb_friendly",
  ).map((i: { id: string }) => i.id);
}

function main(): void {
  const cw = JSON.parse(readFileSync(CROSSWALK, "utf-8")) as {
    industry_ids_in_extrapolated: string[];
  };
  const covered = new Set(cw.industry_ids_in_extrapolated);
  const taxonomy = smbIndustryIds();
  const taxonomySet = new Set(taxonomy);

  const missing = taxonomy.filter((id) => !covered.has(id)); // synthesize today
  const orphan = [...covered].filter((id) => !taxonomySet.has(id)); // unreachable data
  const intersect = taxonomy.filter((id) => covered.has(id));

  const report = {
    generated_at: new Date().toISOString(),
    taxonomy_smb_count: taxonomy.length,
    covered_count: intersect.length,
    missing_count: missing.length,
    orphan_count: orphan.length,
    missing,
    orphan,
  };
  const out = resolve(process.cwd(), "data/audit/industry_crosswalk_gap.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(
    `Taxonomy SMB: ${taxonomy.length}; covered by data: ${intersect.length}; ` +
      `missing: ${missing.length}; orphan: ${orphan.length}`,
  );
  console.log(`Wrote ${out}`);
}

main();
```

- [ ] **Step 2: Sync the crosswalk file into the website and run the audit**

Copy `E:\atlas\refs\industry_crosswalk.json` to `E:\atlas\website\data\refs\industry_crosswalk.json` (create the `data/refs/` dir). Then run: `cd E:\atlas\website && npx tsx scripts/audit/industry_crosswalk_audit.ts`
Expected: prints the four counts and the `missing` / `orphan` lists. The `missing` list is the exact set of industries still synthesizing after Phase 2.

- [ ] **Step 3: Decide expand-or-gate per missing industry (write it down)**

Append a short decision section to the baseline report (`docs/superpowers/plans/2026-05-29-data-activation-baseline.md`): for each `missing` industry, mark `EXPAND` (worth regenerating extrapolated data for, because traffic or strategic value is high) or `GATE` (low value; route should show an honest "coverage coming" state rather than a fabricated number). `orphan` industries are data with no route; mark `ADD-ROUTE` or `DROP`.

- [ ] **Step 4: Commit (website repo)**

```bash
git -C E:/atlas/website add scripts/audit/industry_crosswalk_audit.ts data/refs/industry_crosswalk.json data/audit/industry_crosswalk_gap.json docs/superpowers/plans/2026-05-29-data-activation-baseline.md
git -C E:/atlas/website commit -m "data: industry crosswalk gap audit + expand/gate decisions"
```

### Task 3.3: Honest state for GATE industries (no fabricated numbers)

**Files:**
- Modify: `E:\atlas\website\src\lib\cells.ts` (the synthesis decision point only)

- [ ] **Step 1: Find the synthesis fallthrough**

In `src/lib/cells.ts`, locate `getCellBySlug` (around line 419) and the point where `getCellBySlugRaw` returns null and `synthesizeCell` is called. This is the single place where a fabricated cell is produced.

- [ ] **Step 2: Gate synthesis behind an allowlist for GATE industries**

Add, near the top of `cells.ts` after imports, a small set built from the audit decisions (hard-code the `GATE` list from Task 3.2 Step 3; keep it short and commented):

```typescript
// Industries deliberately NOT synthesized: we would rather show an
// honest "coverage coming" state than a fabricated number. Sourced from
// the Phase 3 crosswalk audit (data/audit/industry_crosswalk_gap.json,
// entries marked GATE). Data activation, 2026-05-29.
const SYNTHESIS_GATED_INDUSTRIES = new Set<string>([
  // fill from the audit's GATE decisions, e.g. "niche-industry-id",
]);
```

Then, where `synthesizeCell` is about to be called, branch: if the resolved `industry_id` is in `SYNTHESIS_GATED_INDUSTRIES`, return a cell with `is_synthetic=true`, `coverage_tier="X"`, and a new `coverage_state="coming"` marker (add the optional field to the `Cell` type) and NO fabricated revenue numbers (leave `rev_*` null), so the render layer shows the empty/coming state per the existing `EmptyState` primitive. Do not change the function signature.

- [ ] **Step 3: Typecheck (ask permission first)**

Ask, then run: `cd E:\atlas\website && npx tsc --noEmit`. Expected: clean.

- [ ] **Step 4: Commit (website repo)**

```bash
git -C E:/atlas/website add src/lib/cells.ts
git -C E:/atlas/website commit -m "data: gate synthesis for low-value industries (honest coming state)"
```

> Note: the EXPAND path (regenerating extrapolated data for high-value missing industries) is a parent-project data task. It belongs to the acquisition pipeline in `E:\atlas` and is tracked there, not in the website build. Scope it as a follow-on; do not block this plan on it.

---

## Phase 4 - Surface the data that is now reachable (navigation + discovery)

Goal: loading data is necessary but not sufficient. Today the cell routes are dynamic (ISR) and discovery flows mostly through synthesized-era assumptions. Make the newly-real country-level data discoverable and prerender the high-value real routes.

### Task 4.1: Prerender real country-level routes

**Files:**
- Modify: `E:\atlas\website\src\app\[country]\[geo]\[industry]\page.tsx` (the `generateStaticParams` only)

- [ ] **Step 1: Read the current generateStaticParams**

It currently returns ~24 hard-coded tuples (6 featured + traffic clusters). Confirm the exact array.

- [ ] **Step 2: Add the top covered (country, industry) pairs from real data**

Extend `generateStaticParams` to also enumerate the highest-quality country-level cells now in `extrapolated_cells`. Add a helper that queries the top N by `quality_score` and maps each to a `{ country, geo, industry }` tuple (geo = country slug for country-level). Keep N modest (for example 200) to bound build memory, consistent with the existing sitemap caps (`getTopCells(500)`, `getTopRegionalCells(300)`):

```typescript
// Inside generateStaticParams, after the hard-coded list:
import { supabaseAdmin } from "@/lib/supabase";
import { iso3ToIso2 } from "@/lib/countries";

const { data } = await supabaseAdmin
  .from("extrapolated_cells")
  .select("country_iso3, industry_id, quality_score")
  .order("quality_score", { ascending: false })
  .limit(200);

const fromData = (data ?? [])
  .map((r) => {
    const iso2 = iso3ToIso2(r.country_iso3);
    if (!iso2) return null;
    return { country: iso2.toLowerCase(), geo: iso2.toLowerCase(), industry: r.industry_id };
  })
  .filter((x): x is { country: string; geo: string; industry: string } => x !== null);

return [...hardCoded, ...fromData];
```
(Use the existing hard-coded array variable name in place of `hardCoded`.)

- [ ] **Step 3: Verify the enumeration query works against live data**

Run a throwaway probe in the existing probe script style, or add a temporary `console.log(fromData.length)` and run the page's data path via `npx tsx` against a tiny harness. Expected: ~200 tuples, all with non-empty `industry` in the taxonomy.

- [ ] **Step 4: Full build is required to confirm prerender (ASK FIRST)**

This is the one place a real build matters. Ask the user before running `npm run build`. Expected after approval: build prerenders the new country-level routes without OOM; build log shows more static pages than the prior 615 and fewer `getNudgeNeighbor` timeouts (because indexes are applied).

- [ ] **Step 5: Commit (website repo)**

```bash
git -C E:/atlas/website add "src/app/[country]/[geo]/[industry]/page.tsx"
git -C E:/atlas/website commit -m "data: prerender top real country-level cells"
```

### Task 4.2: Make the coverage page reflect live counts

**Files:**
- Modify: `E:\atlas\website\src\app\admin\data-quality\page.tsx`

- [ ] **Step 1: Add a live reachability panel**

Import `getDataSourceCounts` and `getLoadedDataVersions` from `@/lib/cells`, and read `data/audit/data_reachability.json`. Render a small table: per-table row count, loaded version, and the latest synthesis rate. Follow the existing admin-page section pattern (the page already renders backend_inventory). Use real `<h2>`/`<h3>` headings and the design-system primitives; no inline hex.

- [ ] **Step 2: Typecheck (ask first), then commit (website repo)**

Ask, run `npx tsc --noEmit`, expect clean.
```bash
git -C E:/atlas/website add "src/app/admin/data-quality/page.tsx"
git -C E:/atlas/website commit -m "data: admin panel shows live reachability + loaded versions"
```

---

## Phase 5 - Build the regional_cells ETL (sub-national depth)

Goal: populate the richest tier. `regional_cells` wants friendly `industry_id`, percentiles, sub-national geo. No producer exists. Build a source-pluggable ETL and ship the Eurostat NUTS-2 adapter first (largest, cleanest source). This is the biggest lift; it is decomposed so each source is independently shippable.

> This phase depends on inspecting the actual source files in `E:\atlas\macro\`. Task 5.1 is mandatory recon; the transform in 5.2 uses column names that MUST be confirmed against the real file before the transform is trusted.

### Task 5.1: Recon the Eurostat sub-national source (mandatory before transform)

**Files:** none (investigation; findings go into the baseline report)

- [ ] **Step 1: Locate the Eurostat SBS regional files**

Run: `python E:\atlas\scripts\inspect_parquet.py <each candidate>` for the regional Eurostat SBS files under `E:\atlas\macro\` (search for files matching `sbs` and `r2` or `nuts`). Identify the one carrying NACE x NUTS-2 x size-band with enterprise counts and turnover.

- [ ] **Step 2: Record the exact column names**

Write into the baseline report the real columns: the NUTS region code column, the NACE code column, the size-band column, the year column, the enterprise-count column, the turnover column, and any per-firm or percentile columns. The transform in 5.2 references these by the names you record here.

- [ ] **Step 3: Confirm the geo_id convention**

Compare the source NUTS codes (for example `DE21`) to what `regionalSlugToGeoId` in `src/lib/cells/geo.ts` expects (the recon shows it handles NUTS for EU). Confirm the geo_id format the table needs (for example lowercase `de21` vs `DE21`). The ETL must emit geo_ids that `regionalSlugToGeoId` round-trips.

### Task 5.2: Eurostat NUTS-2 to regional_cells transform

**Files:**
- Create: `E:\atlas\scripts\build_regional_cells.py`

- [ ] **Step 1: Write the transform with the confirmed column names**

```python
# E:\atlas\scripts\build_regional_cells.py
"""
build_regional_cells.py - transform per-country sub-national source data
into regional_cells rows (friendly industry_id, percentiles, sub-national
geo). Source-pluggable; ships with the Eurostat NUTS-2 adapter.

IMPORTANT: the COLUMN NAMES below are placeholders until Task 5.1 records
the real ones. Replace the *_COL constants with the confirmed columns
before trusting output. The script refuses to run until they are set.

Pipeline per source:
  1. read source via DuckDB
  2. map NACE/NAICS code -> friendly industry_id via refs/industry_crosswalk.json
  3. derive percentiles: if the source lacks p10..p90, apply US-anchored
     shape transfer (same method synthesizeCell uses) around the source
     revenue_per_firm; mark coverage_tier accordingly
  4. emit regional_cells rows; load via transactional replace per country

Usage:
  python scripts\build_regional_cells.py --source eurostat --dry-run
  python scripts\build_regional_cells.py --source eurostat --load
"""
import argparse
import io
import json
import sys
import duckdb
import psycopg2
from atlas_utils import load_secrets

# --- Eurostat source config (FILL FROM TASK 5.1) ---
EUROSTAT_FILE = r"E:\atlas\macro\<confirmed-eurostat-regional-file>.parquet"
NUTS_COL = "<confirmed_nuts_code_col>"
NACE_COL = "<confirmed_nace_code_col>"
SIZE_COL = "<confirmed_size_band_col>"
YEAR_COL = "<confirmed_year_col>"
NENT_COL = "<confirmed_enterprise_count_col>"
TURNOVER_COL = "<confirmed_turnover_col>"

REGIONAL_COLS = [
    "country", "geo_id", "geo_level", "geo_name", "industry_id", "year",
    "size_band", "n_enterprises", "n_employees",
    "rev_p10", "rev_p25", "rev_p50", "rev_p75", "rev_p90",
    "revenue_per_firm", "payroll_per_employee",
    "quality_score", "coverage_tier", "coverage_source", "currency",
]

# US-anchored log-normal spread multipliers (matches synthesizeCell).
SPREAD = {"p10": 0.25, "p25": 0.55, "p50": 1.0, "p75": 1.85, "p90": 3.4}


def guard_columns() -> None:
    placeholders = [c for c in (NUTS_COL, NACE_COL, SIZE_COL, YEAR_COL,
                                NENT_COL, TURNOVER_COL) if c.startswith("<")]
    if placeholders or EUROSTAT_FILE.find("<") >= 0:
        print("REFUSING TO RUN: confirm Task 5.1 columns first:", placeholders)
        sys.exit(2)


def load_crosswalk() -> dict:
    with open(r"E:\atlas\refs\industry_crosswalk.json", encoding="utf-8") as f:
        return json.load(f)


def nace_to_industry(nace: str, crosswalk: dict) -> str | None:
    # The crosswalk maps source codes to friendly industry_id. If the
    # export from Phase 3 only listed ids, extend it in Task 5.1 with a
    # nace->id dict. Returns None if unmapped (row is skipped, counted).
    return crosswalk.get("nace_to_industry", {}).get(nace)


def build_rows():
    con = duckdb.connect()
    raw = con.execute(
        f"SELECT {NUTS_COL}, {NACE_COL}, {SIZE_COL}, {YEAR_COL}, "
        f"{NENT_COL}, {TURNOVER_COL} FROM '{EUROSTAT_FILE}'"
    ).fetchall()
    crosswalk = load_crosswalk()
    rows, skipped = [], 0
    for nuts, nace, size, year, nent, turnover in raw:
        industry_id = nace_to_industry(str(nace), crosswalk)
        if industry_id is None or not nent or nent <= 0:
            skipped += 1
            continue
        rev_per_firm = (turnover / nent) if (turnover and nent) else None
        if rev_per_firm is None:
            skipped += 1
            continue
        country = str(nuts)[:2].upper()
        geo_id = str(nuts).lower()
        p = {k: round(rev_per_firm * m, 2) for k, m in SPREAD.items()}
        rows.append((
            country, geo_id, "nuts2", str(nuts), industry_id, int(year),
            str(size), int(nent), None,
            p["p10"], p["p25"], p["p50"], p["p75"], p["p90"],
            round(rev_per_firm, 2), None,
            55, "M", "Regional source, modeled distribution", "EUR",
        ))
    print(f"Built {len(rows)} rows, skipped {skipped} (unmapped/zero).")
    return rows


def load_rows(rows) -> int:
    s = load_secrets()
    conn = psycopg2.connect(s["SUPABASE_DB_URL"], sslmode="require", connect_timeout=30)
    conn.autocommit = False
    cur = conn.cursor()
    try:
        # Replace only the EU rows this adapter owns (coverage_source tag).
        cur.execute("DELETE FROM regional_cells WHERE geo_level = 'nuts2';")
        buf = io.StringIO()
        for r in rows:
            buf.write("\t".join("" if v is None else str(v) for v in r) + "\n")
        buf.seek(0)
        cur.copy_expert(
            f"COPY regional_cells ({', '.join(REGIONAL_COLS)}) FROM STDIN WITH (FORMAT text)",
            buf,
        )
        cur.execute(
            """INSERT INTO data_meta(key, value, updated_at)
               VALUES ('version:regional_cells:eurostat', %s, now())
               ON CONFLICT (key) DO UPDATE
                 SET value = EXCLUDED.value, updated_at = now();""",
            ("nuts2-1.0",),
        )
        conn.commit()
        print(f"Committed {len(rows)} regional rows.")
    except Exception as e:  # noqa: BLE001
        conn.rollback()
        print(f"ROLLED BACK: {e}")
        return 1
    finally:
        cur.close()
        conn.close()
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default="eurostat")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--load", action="store_true")
    args = ap.parse_args()
    guard_columns()
    rows = build_rows()
    if args.dry_run or not args.load:
        # Print a few sample rows for eyeballing; no DB write.
        for r in rows[:5]:
            print(r)
        return 0
    return load_rows(rows)


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Extend the crosswalk with a nace_to_industry map**

The transform needs `crosswalk["nace_to_industry"]`. In `industry_crosswalk_export.py` (Task 3.1), add a hand-curated `naics2_to_industry` / `nace_to_industry` dict mapping the source NACE codes present in the Eurostat file to friendly ids (derive the list of NACE codes from Task 5.1 recon; map each to the closest friendly id; leave genuinely-unmappable codes out so their rows skip rather than mis-map). Re-run the exporter.

- [ ] **Step 3: Dry-run the transform (red: nothing loaded yet)**

Run: `python E:\atlas\scripts\build_regional_cells.py --source eurostat --dry-run`
Expected: prints `Built N rows, skipped M` and 5 sample tuples. Eyeball the samples: `country` is a 2-letter code, `geo_id` is lowercase NUTS, `industry_id` is a real friendly id, percentiles ascend p10<p25<p50<p75<p90, `revenue_per_firm` is plausible (SMB range). If `REFUSING TO RUN` prints, you skipped Task 5.1.

- [ ] **Step 4: Commit the ETL before loading (parent repo)**

```bash
git -C E:/atlas add scripts/build_regional_cells.py scripts/industry_crosswalk_export.py refs/industry_crosswalk.json
git -C E:/atlas commit -m "data: regional_cells ETL with Eurostat NUTS-2 adapter (dry-run verified)"
```

### Task 5.3: Load regional_cells and prove sub-national reach

**Files:** none (execution + verification)

- [ ] **Step 1: Confirm the check fails first (red)**

Run: `python E:\atlas\scripts\verify_supabase_counts.py --expect-regional 1`
Expected: FAIL, `regional_cells: expected >= 1, got 0`.

- [ ] **Step 2: Load**

Run: `python E:\atlas\scripts\build_regional_cells.py --source eurostat --load`
Expected: `Committed N regional rows.`

- [ ] **Step 3: Confirm the check passes (green)**

Run: `python E:\atlas\scripts\verify_supabase_counts.py --expect-regional 1000`
Expected: OK; inventory shows a five-figure `regional_cells` count and a non-trivial country spread.

- [ ] **Step 4: Re-probe; expect another synthesis drop**

Add 4-6 EU NUTS-2 routes to the probe's `SAMPLE` (for example `["de","de21","restaurants"]`) so the probe exercises the regional tier, then run `npx tsx scripts/audit/probe_live_data.ts`.
Expected: those EU routes now resolve to `regional_cells` (real, tier M), synthesis rate drops again. Target around 10% or lower.

- [ ] **Step 5: Ratchet the budget down again**

Lower `BUDGET` in `verify_synthesis_budget.ts` to just above the new rate. Re-run the gate; expect OK.

- [ ] **Step 6: Commit (website repo)**

```bash
git -C E:/atlas/website add data/audit/data_reachability.json scripts/audit/probe_live_data.ts scripts/verify_synthesis_budget.ts
git -C E:/atlas/website commit -m "data: regional tier live; probe covers NUTS-2; ratchet budget"
```

> Follow-on (separate tasks, same pattern, do NOT inline here): Japan e-Stat prefecture adapter, Brazil IBGE state adapter, and the US county/city `regional_cells` rows. Each is a new `--source` branch in `build_regional_cells.py` plus its column config and crosswalk additions, followed by the same red/load/green/probe/ratchet loop.

---

## Phase 6 - Make it repeatable, versioned, and self-protecting

Goal: one runbook reloads everything; the site shows its data vintage; the coverage snapshot regenerates from the live DB; the gate guards against regression.

### Task 6.1: One-command reload runbook

**Files:**
- Create: `E:\atlas\scripts\data_activate.py`

- [ ] **Step 1: Write a thin orchestrator**

```python
# E:\atlas\scripts\data_activate.py
"""
data_activate.py - one-command reload of all site-facing data tables,
in dependency order, with a count check after each step. Stops on first
failure. Does NOT apply SQL migrations (those are manual in the Supabase
SQL Editor by design).

Usage: python scripts\data_activate.py --version 1.19.0
"""
import argparse
import subprocess
import sys

PY = sys.executable


def run(cmd: list[str]) -> None:
    print(">>", " ".join(cmd))
    r = subprocess.run(cmd)
    if r.returncode != 0:
        print("STEP FAILED; aborting.")
        sys.exit(r.returncode)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--version", required=True)
    args = ap.parse_args()
    base = r"E:\atlas\scripts"
    run([PY, rf"{base}\load_extrapolated_cells.py", "--version", args.version])
    run([PY, rf"{base}\verify_supabase_counts.py", "--expect-extrapolated", "57000"])
    run([PY, rf"{base}\build_regional_cells.py", "--source", "eurostat", "--load"])
    run([PY, rf"{base}\verify_supabase_counts.py", "--expect-regional", "1000"])
    print("\nData activation complete.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Run the full runbook end to end**

Run: `python E:\atlas\scripts\data_activate.py --version 1.19.0`
Expected: each step prints, all count checks pass, ends with `Data activation complete.`

- [ ] **Step 3: Commit (parent repo)**

```bash
git -C E:/atlas add scripts/data_activate.py
git -C E:/atlas commit -m "data: one-command reload runbook"
```

### Task 6.2: Show data vintage on the site (honesty surface)

**Files:**
- Modify: `E:\atlas\website\src\app\coverage\page.tsx` (or the coverage index; confirm exact file)

- [ ] **Step 1: Read the loaded versions and render a vintage line**

Use `getLoadedDataVersions()` from `@/lib/cells` to render a small "Data vintage" line on the public coverage page (for example "Country estimates: v1.19.0; regional: nuts2-1.0"). Real heading, design-system text styles, no source-agency names, no em-dashes.

- [ ] **Step 2: Typecheck (ask first), commit (website repo)**

```bash
git -C E:/atlas/website add "src/app/coverage/page.tsx"
git -C E:/atlas/website commit -m "data: show data vintage on coverage page"
```

### Task 6.3: Regenerate coverage_v2.json from the live DB

**Files:**
- Create: `E:\atlas\scripts\build_coverage_v2.py`
- Target: `E:\atlas\website\data\quality\coverage_v2.json` (consumed by `src/lib/quality/coverage-report.ts`)

- [ ] **Step 1: Write the generator**

Query `regional_cells` and `extrapolated_cells` grouped by country, producing the exact `CoverageReport` shape that `coverage-report.ts` types declare (`totals` + `countries[]` with `regional_cells`, `extrapolated_cells`, `industries`, `geographies`, `tiers`, `avg_quality`, `year_range`). Write to the website's `data/quality/coverage_v2.json`. Match the existing field names exactly (see `CoverageCountry` type) so the website reads it without code changes.

- [ ] **Step 2: Run and verify the website reads it**

Run the generator, then load the coverage page locally (ask before any `npm run dev`/build) or assert the JSON parses and has `countries.length > 100`.

- [ ] **Step 3: Commit (both repos as appropriate)**

```bash
git -C E:/atlas add scripts/build_coverage_v2.py
git -C E:/atlas commit -m "data: regenerate coverage_v2 from live DB"
git -C E:/atlas/website add data/quality/coverage_v2.json
git -C E:/atlas/website commit -m "data: refresh coverage snapshot from live DB"
```

### Task 6.4: Final gate pass

**Files:** none (verification)

- [ ] **Step 1: Run the full prebuild (ASK FIRST)**

Ask the user. Then run: `cd E:\atlas\website && npm run prebuild` (or `npm run prebuild:serial` if the parallel runner is flaky; concurrency stays <= 4 on Windows).
Expected: all gates pass, including the new `synthesis-budget` gate at its ratcheted floor.

- [ ] **Step 2: Update the handoff**

Add a `2026-05-29-session-handoff.md` under `docs/handoff/` recording: tables now loaded with counts, the synthesis rate before/after, the budget floor, the follow-on adapters (JP/BR/US-regional) and EXPAND industries left to do. Commit (website repo).

---

## Self-Review

**Spec coverage.** The request was "reach the data that is on our website," ambitious and detailed. Coverage: Phase 0 measures the true gap; Phase 1 instruments it; Phase 2 lands the immediate country-level unlock; Phase 3 closes the industry-coverage gap and replaces fabrication with honesty where data is absent; Phase 4 makes the new data discoverable and prerendered; Phase 5 builds the missing sub-national tier; Phase 6 makes it repeatable, versioned, visible, and self-protecting. Every phase ends in working, committed software.

**Placeholder scan.** The one intentional, flagged placeholder set is in `build_regional_cells.py` (the `*_COL` constants and `EUROSTAT_FILE`), guarded by `guard_columns()` which hard-refuses to run until Task 5.1 confirms the real column names against the actual file. This is honest: those names cannot be known without reading a file that was not in scope to open during planning, and the guard prevents silent wrong output. The `SYNTHESIS_GATED_INDUSTRIES` set and the crosswalk `nace_to_industry` dict are populated from concrete audit outputs produced earlier in the same plan, not left vague.

**Type consistency.** `getDataSourceCounts` / `getLoadedDataVersions` are defined in `data_health.ts` (Task 1.1) and re-exported and consumed under the same names in Tasks 4.2 and 6.2. The loader `COLS` / `REGIONAL_COLS` arrays match the table DDL columns from the recon. `verify_synthesis_budget.ts` reads the exact JSON shape `probe_live_data.ts` writes (`synthesis_rate`, `generated_at`, `sample_size`). The `Cell.coverage_state` field added in Task 3.3 is optional, preserving every existing call site.

**Risk notes.** (1) Phase 2 and beyond need `SUPABASE_DB_URL` and, for scale, Pro tier; Phase 0 verifies tier first and the small extrapolated load fits free tier so progress is never fully blocked. (2) The only mandatory full build is Task 4.1 Step 4, explicitly gated behind asking. (3) `cells.ts` changes are additive (one re-export, one guarded synthesis branch); no existing signature changes, honoring "do not break the current structure." (4) Salaries are untouched, per constraint.

---

Plan complete and saved to `docs/superpowers/plans/2026-05-29-data-activation.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
