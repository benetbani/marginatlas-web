-- Performance indexes for the hot Supabase read paths.
--
-- The 2026-05-27 architecture audit + perf pass surfaced four query
-- patterns that consistently exceeded their 4-5s budget on the cell
-- page render. Build-log evidence: ~20 getNudgeNeighbor timeouts and
-- ~9 getSameIndustryAcrossStates timeouts per build of 615 pages.
--
-- Root cause is unindexed scans. The B-tree indexes already on
-- cells_master / regional_cells / extrapolated_cells don't cover
-- (country, geo_id, naics_6 prefix) or (country, naics_6 prefix, n)
-- query shapes, so Postgres falls back to a sequential scan filtered
-- by an OR of LIKE prefixes — slow on the 722k-row cells_master
-- and gets slower as the table grows.
--
-- The text_pattern_ops opclass on naics_6 lets B-tree support
-- `LIKE 'prefix%'` matches via index range scan. Without it the
-- default locale-aware opclass forces a sequential scan even when
-- an index exists.
--
-- All statements are CONCURRENTLY + IF NOT EXISTS so this migration
-- is safe to run against a live production database and is idempotent
-- on partial failure. Total build time on Supabase Pro for cells_master
-- (~722k rows) is roughly 30-90s per index — non-blocking but slow.
-- Run in the Supabase SQL Editor, one statement at a time. Postgres
-- refuses CONCURRENTLY inside a transaction, so do NOT wrap these.
--
-- Expected impact:
--   - getCellBySlugRaw (US):           ~500ms → ~5ms
--   - getCellVariants (US):            ~800ms → ~10ms
--   - getRegionalCell (non-US):        ~300ms → ~8ms
--   - getSameIndustryAcrossStates:     ~4s+ → ~50ms
--   - getNudgeNeighbor:                ~4s+ → ~30ms
--   - getTopIndustriesForCountry (US): ~1.5s → ~80ms
--
-- 2026-05-27.

-- =============================================================
-- cells_master (US state-level cells, ~722k rows)
-- =============================================================

-- Covers: getCellBySlugRaw + getCellVariants (US path) — both filter
-- (country='US', geo_id='US-XX') and match naics_6 with LIKE 'XXX%'.
-- Selectivity comes from geo_id (~14k rows per state) then narrows
-- further by naics_6. text_pattern_ops is required for the LIKE
-- prefix pattern to use the index.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cells_master_country_geo_naics
  ON cells_master (country, geo_id, naics_6 text_pattern_ops);

-- Covers: getNudgeNeighbor + getSameIndustryAcrossStates — both scan
-- ALL states for a (country, naics_6 prefix) pair and order by n DESC.
-- The DESC NULLS LAST clause matches the query's ORDER BY exactly,
-- so the planner can use the index for both the WHERE filter and
-- the ORDER BY without a separate sort step.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cells_master_country_naics_n
  ON cells_master (country, naics_6 text_pattern_ops, n DESC NULLS LAST);

-- Covers: getTopIndustriesForCountry (US path) — scans every row
-- for a (country, geo_id) state and orders by n DESC. The earlier
-- existing idx_cells_master_naics_subindustry doesn't help; this
-- one's only purpose is the top-N-by-firm-count read.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cells_master_country_geo_n
  ON cells_master (country, geo_id, n DESC NULLS LAST);

-- =============================================================
-- regional_cells (non-US sub-national rows)
-- =============================================================

-- Covers: getRegionalCell + getRegionalCellVariants — every non-US
-- cell page hits this with (country, geo_id, industry_id) and orders
-- by year DESC, n_enterprises DESC. The composite index serves both
-- the equality filters and the ORDER BY in one index scan.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_regional_cells_country_geo_industry_year
  ON regional_cells (country, geo_id, industry_id, year DESC NULLS LAST, n_enterprises DESC NULLS LAST);

-- =============================================================
-- extrapolated_cells (country-level estimates)
-- =============================================================

-- Covers: getExtrapolatedCell + getExtrapolatedVariants — keyed by
-- (country_iso3, industry_id), most-recent-year preference. This is
-- the fallback path for every non-US country that lacks regional_cells
-- coverage, so it fires on most international cell pages.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_extrapolated_country_industry_year
  ON extrapolated_cells (country_iso3, industry_id, year DESC NULLS LAST);

-- Covers: getSameIndustryAcrossCountries — scans all countries for
-- one industry, orders by quality then by predicted_rev_per_firm.
-- Selectivity is industry_id (~140 countries per industry); the
-- quality_score ordering is the secondary key.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_extrapolated_industry_quality
  ON extrapolated_cells (industry_id, quality_score DESC NULLS LAST, predicted_rev_per_firm DESC NULLS LAST);

-- =============================================================
-- After running: tell Postgres about the new statistics.
-- ANALYZE is safe to run on a live table (acquires SHARE UPDATE
-- EXCLUSIVE which doesn't block reads or normal writes).
-- =============================================================
ANALYZE cells_master;
ANALYZE regional_cells;
ANALYZE extrapolated_cells;
