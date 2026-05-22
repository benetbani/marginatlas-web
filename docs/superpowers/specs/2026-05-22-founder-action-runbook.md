# Founder action runbook — Plan v26 follow-ups

What you, the founder, need to do (in order, with effort estimates).

## 1. Pay Supabase Pro — $25/mo (5 minutes)

- Dashboard: https://supabase.com/dashboard/project/_/settings/billing
- Pick the Pro plan.
- Immediately unlocks: no auto-pause, 8 GB DB, 250 GB egress, daily
  backups, dedicated compute, larger DB row caps.
- Does NOT immediately fix the statement-timeout (still 60s). That's
  what the indexes in step 2 fix.

## 2. Run Migration 1+2 in Supabase SQL Editor (10 minutes)

These are the indexes that unlock all the `.order()` clauses that
have been silently timing out. Highest-impact single action in this
runbook.

Where: Supabase Dashboard → SQL Editor → New query.

Paste this whole block:

```sql
-- Migration 1 — indexes on regional_cells
CREATE INDEX IF NOT EXISTS idx_regional_cells_quality_score
  ON regional_cells (quality_score DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_regional_cells_n_enterprises
  ON regional_cells (n_enterprises DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_regional_cells_country_industry
  ON regional_cells (country, industry_id);

CREATE INDEX IF NOT EXISTS idx_regional_cells_year_country
  ON regional_cells (year DESC, country);

CREATE INDEX IF NOT EXISTS idx_regional_cells_geo_id
  ON regional_cells (geo_id);

CREATE INDEX IF NOT EXISTS idx_regional_cells_lookup
  ON regional_cells (country, geo_id, industry_id, year DESC);

-- Migration 2 — indexes on cells_master
CREATE INDEX IF NOT EXISTS idx_cells_master_n
  ON cells_master (n DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_cells_master_total_employment
  ON cells_master (total_employment DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_cells_master_lookup
  ON cells_master (country, geo_id, naics_6, year DESC);

CREATE INDEX IF NOT EXISTS idx_cells_master_quality
  ON cells_master (quality_score DESC NULLS LAST);
```

Click Run. Wait for "Success. No rows returned." (the indexes are
empty until queries use them).

After running:
- Reply to me with "indexes done"
- I'll revert the `getTopRegionalCells` workaround (drop order-by
  was an emergency fix) and the `maxDuration = 60` overrides
- Cell pages should respond in <1s cold-start instead of 13-15s

## 3. Run Migration 3 (suppression flag column) (2 minutes)

Same SQL editor. Paste:

```sql
ALTER TABLE regional_cells
  ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS suppress_reason TEXT;

ALTER TABLE cells_master
  ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS suppress_reason TEXT;

ALTER TABLE extrapolated_cells
  ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS suppress_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_regional_cells_suppressed
  ON regional_cells (country, geo_id, industry_id)
  WHERE is_suppressed = TRUE;

CREATE INDEX IF NOT EXISTS idx_cells_master_suppressed
  ON cells_master (country, geo_id, naics_6)
  WHERE is_suppressed = TRUE;

CREATE INDEX IF NOT EXISTS idx_extrapolated_cells_suppressed
  ON extrapolated_cells (country_iso3, industry_id)
  WHERE is_suppressed = TRUE;
```

After this:
- Reply "suppression flag added"
- I run `scripts/ingest/suppression_backfill.ts` to migrate the JSON
  suppression to the DB
- Then I can delete the bundled triage.ts file entirely

## 4. Run extrapolation backfill (dry run first) (3 minutes)

Fills the 115 missing countries in extrapolated_cells with bounded
estimates from the country_smb_baseline.

```bash
npx tsx scripts/ingest/extrapolation_backfill.ts --dry-run
```

Reply with the dry-run output. If it looks sane (countries match,
revenues within SMB bounds), then:

```bash
npx tsx scripts/ingest/extrapolation_backfill.ts
```

## 5. Acquire NUTS-3 European business stats CSV (30 minutes)

Source: search for "Structural Business Statistics" at the European
statistical portal. Download the regional / sub-national variant
that goes to NUTS-3 granularity. Output is a CSV with columns like
GEO (NUTS code), NACE_R2 (industry), INDIC_SBS (metric), TIME_PERIOD
(year), OBS_VALUE.

Drop the CSV into the project somewhere (eg `data/sources/sbs_nuts3.csv`).
Then:

```bash
npx tsx scripts/ingest/nuts3_eurostat_template.ts \
  --csv data/sources/sbs_nuts3.csv \
  --industry-map config/nace_to_industry_id.json \
  --dry-run
```

You'll need to provide `config/nace_to_industry_id.json` — a mapping
from NACE codes (eg `I56.1`) to our friendly industry slugs (eg
`restaurants`). Reply with a sample of the CSV headers and I'll
write the mapping.

## 6. Pay Vercel Pro — $20/mo (5 minutes, OPTIONAL FOR NOW)

Status: not strictly needed yet. Hobby works with the maxDuration
=60 override. But if you start seeing 60s timeouts on cold pages
(post-deploy or after a long idle), Vercel Pro raises serverless
function timeout to 300s, gives 1 TB bandwidth, dedicated edge.

Defer this until:
- Bandwidth approaches 50 GB/mo, OR
- You hit a 60s timeout in production again

## 7. (Optional) Run percentile backfill (5 minutes)

After migrations 1-3:

```bash
# Fill regional_cells null percentiles (currently 100% null)
npx tsx scripts/ingest/percentile_backfill.ts --table regional_cells --dry-run

# Then live
npx tsx scripts/ingest/percentile_backfill.ts --table regional_cells

# Same for cells_master (currently 14% null)
npx tsx scripts/ingest/percentile_backfill.ts --table cells_master --dry-run
npx tsx scripts/ingest/percentile_backfill.ts --table cells_master
```

After this, the render-layer synthesis of percentiles becomes a
true fallback that almost never fires (only for truly novel
country×industry combos).

## What this unlocks

| After step | What works |
|---|---|
| 1 (Pro) | No auto-pause, room for traffic, daily backups |
| 2 (indexes) | Cell pages cold-start <1s, sitemap queries reliable, no more `.order()` timeouts |
| 3 + script | Suppression in DB, drop bundled triage |
| 4 | 115 new countries get country-level extrapolated data |
| 5 | European cities get actual NUTS-3 measurements instead of regional masquerade |
| 6 (Vercel Pro) | More headroom (not urgent yet) |
| 7 | Distribution percentiles stop being synthesized everywhere |

## Total time investment

- Steps 1-3: 17 minutes (one-time)
- Step 4: 3 minutes (one-time)
- Step 5: 30 minutes + finding the data source
- Step 6: 5 minutes (when needed)
- Step 7: 5 minutes (after migrations)

**~60 minutes of focused work, $25/mo in fixed cost, unlocks roughly
everything left in the audit.** All other priority items in the
backend audit are either already shipped at the code layer or
depend on one of these steps.
