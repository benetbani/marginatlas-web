-- Performance index for the non-US country page top-industries read.
--
-- getTopIndustriesForCountry (non-US path, src/lib/cells.ts) filters
-- extrapolated_cells by country_iso3 and orders by quality_score DESC,
-- limit 500. The 2026-05-27 perf pass indexed the US path
-- (idx_cells_master_country_geo_n) and the extrapolated lookups keyed by
-- (country_iso3, industry_id) and (industry_id, quality_score), but NOT
-- the (country_iso3 then quality_score) shape this read needs. Without it
-- Postgres filters by country_iso3 and then sorts the matched rows by
-- quality_score, and on countries with many extrapolated rows (the
-- layered duplicate and junk bands) that sort dominates: the country page
-- render measured about 10s warm and exceeded the 60s function limit on a
-- cold first hit, returning 504 before the page could cache.
--
-- This composite serves the WHERE filter and the ORDER BY in one index
-- range scan, so the limit-500 read returns without a separate sort step.
--
-- NON-concurrent on purpose. The Supabase SQL Editor wraps statements in a
-- transaction, and CREATE INDEX CONCURRENTLY cannot run inside one
-- (ERROR 25001). extrapolated_cells is read-heavy and written only by the
-- offline data pipeline, never by the website, so a plain CREATE INDEX is
-- safe: it takes a brief SHARE lock that blocks writes for the few seconds
-- of the build but never blocks reads. IF NOT EXISTS keeps it idempotent.
-- (If you would rather build it CONCURRENTLY, run it from psql / a direct
-- connection that is not wrapped in a transaction.)
--
-- Expected impact:
--   - getTopIndustriesForCountry (non-US): ~10s -> ~tens of ms
--
-- After this lands, the country top-industries read is "materialized" in
-- the sense the 2026-06-04 generateStaticParams note in
-- src/app/[country]/page.tsx requires, so a small prerender list for the
-- major economies can be re-enabled safely.
--
-- 2026-06-05.

CREATE INDEX IF NOT EXISTS idx_extrapolated_country_quality
  ON extrapolated_cells (country_iso3, quality_score DESC NULLS LAST);

ANALYZE extrapolated_cells;
