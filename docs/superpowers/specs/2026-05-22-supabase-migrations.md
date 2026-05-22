# Supabase migrations — Plan v26 backend improvements

> SQL to run in the Supabase SQL editor (Project → SQL Editor → New
> query → paste → Run). Each migration is independent. Run in order;
> none are destructive.

## Why these are needed

Surfaced by the Plan v26 audit:

- **No index on regional_cells.quality_score / n_enterprises** → every
  `.order()` clause times out at 60 seconds. Caused the empty sitemap
  shard 2 for weeks.
- **No DB-level suppression flag** → triage decisions live in a JSON
  file that has to ship with every deploy. Bundle-size issues.
- **No `geos` table** → URL slug → geo_id resolution is per-country
  code branches and a manual alias TS file.
- **No `aliases` table** → same problem for industry slugs.
- **No `data_quality_metrics` table** → operating blind on health.

## Migration 1 — Indexes on regional_cells (P0)

```sql
-- Plan v26 P0 — enables ordering and filtering at scale.
-- These indexes specifically support the sitemap and cross-country
-- queries that have been silently failing due to 60s statement
-- timeout on unordered scans.

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

-- Composite for the common cell-page lookup pattern
CREATE INDEX IF NOT EXISTS idx_regional_cells_lookup
  ON regional_cells (country, geo_id, industry_id, year DESC);
```

Expected effect: every `.order()` clause on regional_cells should
complete in <2 seconds even at limit=10000. The shard 2 fix that
dropped `.order()` can be reverted to keep the high-quality
ranking.

## Migration 2 — Same indexes on cells_master (P0)

```sql
-- Plan v26 P0 — cells_master had a similar timeout issue earlier
-- in getTopCells (Plan v24 Block 11 workaround was .gte('year', 2020)).
-- Proper indexes let us restore the original "top by n_enterprises"
-- ranking.

CREATE INDEX IF NOT EXISTS idx_cells_master_n
  ON cells_master (n DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_cells_master_total_employment
  ON cells_master (total_employment DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_cells_master_industry_description
  ON cells_master (industry_description)
  WHERE industry_description IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cells_master_lookup
  ON cells_master (country, geo_id, naics_6, year DESC);

CREATE INDEX IF NOT EXISTS idx_cells_master_quality
  ON cells_master (quality_score DESC NULLS LAST);
```

## Migration 3 — Suppression flag on cells (P4)

Eliminates the bundled JSON triage file. Suppression becomes a
DB-side decision.

```sql
-- Plan v26 P4 — DB-side suppression flag.

ALTER TABLE regional_cells
  ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS suppress_reason TEXT;

ALTER TABLE cells_master
  ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS suppress_reason TEXT;

ALTER TABLE extrapolated_cells
  ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS suppress_reason TEXT;

-- Indexes on the new flag (most rows will have FALSE, so partial
-- indexes are more efficient).
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

After running this, ship a one-time backfill that reads
`data/quality/cell_triage_slim_v1.json` and sets `is_suppressed =
TRUE` on the matching rows. Then triage.ts can be removed entirely
and the suppression check becomes a `.eq('is_suppressed', FALSE)`
filter in the query.

## Migration 4 — Geos master table (P9)

Single source of truth for every region the site can render.

```sql
-- Plan v26 P9 — replaces per-country code branches in
-- regionalSlugToGeoId() and the entire manual_city_aliases.ts file.

CREATE TABLE IF NOT EXISTS geos (
  geo_id TEXT PRIMARY KEY,
  country_iso2 TEXT NOT NULL,
  geo_name TEXT NOT NULL,
  geo_level TEXT NOT NULL, -- 'country' | 'nuts1' | 'nuts2' | 'nuts3' | 'lad' | 'province' | 'municipality' | 'city' | 'state' | 'county' | 'neighborhood'
  parent_geo_id TEXT REFERENCES geos(geo_id),
  url_slug TEXT NOT NULL, -- the slug used in URLs
  display_label TEXT,     -- friendlier "Frankfurt am Main" vs raw "DE71"
  pop_million NUMERIC,
  gdp_billion_usd NUMERIC,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geos_country_slug
  ON geos (country_iso2, url_slug);

CREATE INDEX IF NOT EXISTS idx_geos_parent
  ON geos (parent_geo_id);

CREATE INDEX IF NOT EXISTS idx_geos_level
  ON geos (country_iso2, geo_level);
```

## Migration 5 — Slug aliases table (P9)

URL alias resolution becomes a DB lookup instead of a code edit.

```sql
-- Plan v26 P9 — aliases for URL slugs that should map to a different
-- canonical geo or industry.
-- Examples: 'frankfurt' (DE) → DE71. 'fab-shops' → fabricated_metal_mfg.

CREATE TABLE IF NOT EXISTS slug_aliases (
  id SERIAL PRIMARY KEY,
  alias_type TEXT NOT NULL CHECK (alias_type IN ('geo', 'industry')),
  country_iso2 TEXT,                -- NULL for industry aliases
  alias_slug TEXT NOT NULL,
  canonical_id TEXT NOT NULL,        -- geo_id or industry_id
  display_label TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (alias_type, country_iso2, alias_slug)
);

CREATE INDEX IF NOT EXISTS idx_slug_aliases_lookup
  ON slug_aliases (alias_type, country_iso2, alias_slug);
```

## Migration 6 — Data quality metrics table (P10)

Powers the /admin/data-quality dashboard.

```sql
-- Plan v26 P10 — health metrics surfaced to the internal admin dashboard.

CREATE TABLE IF NOT EXISTS data_quality_metrics (
  id SERIAL PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_text TEXT,
  context JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_data_quality_metrics_name_time
  ON data_quality_metrics (metric_name, recorded_at DESC);
```

Wire post-deploy smoke tests to write into this table so the admin
dashboard shows a time series of "sitemap_shard_0_bytes",
"reality_audit_pass_rate", "neighborhood_synth_test_pass_rate" etc.

## Migration 7 — Increase Supabase row cap (optional)

PostgREST's default `Max Rows` setting is 1000 per request. Some
internal queries (sitemap generation, audit scripts) would benefit
from 5000.

```text
In Supabase dashboard:
  Project Settings → API → Max Rows
  Change from 1000 → 5000

(Some routes get larger requests; rate-limit them at app layer if needed.)
```

## Order of execution

1. **Migration 1 + 2 (indexes)** — run first. Zero-risk DDL,
   improves query performance immediately.
2. **Migration 3 (suppression flag)** — adds nullable columns. Safe.
   Backfill in a follow-up script.
3. **Migration 4 + 5 (geos + aliases tables)** — empty tables, safe.
   Backfill from `manual_city_aliases.ts` + `city_aliases_generated.ts`
   in a follow-up script.
4. **Migration 6 (metrics)** — empty table, safe.
5. **Migration 7 (max rows)** — config change, takes effect on next
   request.

## Rollback

Every CREATE INDEX uses IF NOT EXISTS. Every CREATE TABLE uses
IF NOT EXISTS. Every ALTER TABLE ADD COLUMN uses IF NOT EXISTS.
All migrations are idempotent.

To roll back:
- Indexes: `DROP INDEX <name>;`
- Columns: `ALTER TABLE <t> DROP COLUMN IF EXISTS <c>;`
- Tables: `DROP TABLE IF EXISTS <t>;`

## After running

Reply to me with the output of each migration's "Run" result. Once
indexes are in, I'll re-enable the `.order()` clauses in
getTopCells / getTopRegionalCells and remove the workaround comments.
