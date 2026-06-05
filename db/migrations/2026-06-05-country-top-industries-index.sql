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
-- CONCURRENTLY + IF NOT EXISTS: safe on a live database, idempotent on
-- partial failure. Postgres refuses CONCURRENTLY inside a transaction, so
-- run this statement on its own in the Supabase SQL Editor (do NOT wrap
-- it). Build time on the current row count is a few seconds.
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

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_extrapolated_country_quality
  ON extrapolated_cells (country_iso3, quality_score DESC NULLS LAST);

ANALYZE extrapolated_cells;
