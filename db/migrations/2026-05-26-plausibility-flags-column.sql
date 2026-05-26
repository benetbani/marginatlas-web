-- Backend Phase 4 — persist render-time plausibility decisions.
--
-- The render layer has been suppressing implausible cell values (e.g.,
-- $1.87B per-firm Swiss grocery revenue) for months via the
-- applyPlausibilitySuppression() function in
-- src/lib/qa/plausibility_suppression.ts. This migration adds a column
-- so the same decision can be persisted and used by audit scripts,
-- downstream consumers, and any future direct-query path that
-- bypasses the render layer.
--
-- The column is OPTIONAL on read: code that doesn't know about it
-- continues to work. Code that wants the persistent decision reads
-- the column.
--
-- 2026-05-26.

-- 1. Add the column to extrapolated_cells. JSONB to allow per-field
--    reason codes plus the threshold context.
--    Default NULL = "not yet analyzed"; populated by the backfill
--    script. Render layer treats NULL as "fall back to live
--    analysis" so behaviour is identical pre- and post-backfill.
ALTER TABLE extrapolated_cells
  ADD COLUMN IF NOT EXISTS plausibility_flags JSONB DEFAULT NULL;

-- 2. Index on the status field for fast filtering of suppressed rows
--    in audit + reporting queries. The expression index lets us
--    write WHERE (plausibility_flags->>'status') = 'suppressed'
--    without scanning every row.
CREATE INDEX IF NOT EXISTS extrapolated_cells_plausibility_status_idx
  ON extrapolated_cells ((plausibility_flags->>'status'));

-- 3. Document the column shape.
COMMENT ON COLUMN extrapolated_cells.plausibility_flags IS
  'Per-cell plausibility analysis from analyzePlausibility() in src/lib/qa/plausibility_suppression.ts. Shape: {status: "ok"|"suppressed", fields: {<field>: <reason_code>}, thresholds: {ceiling, floor, payroll_ceiling}}. Populated by scripts/db/backfill_plausibility_flags.ts; NULL means not yet analyzed (render layer falls back to live analysis).';

-- The same column may be added to regional_cells and cells_master
-- once we've validated the backfill on extrapolated_cells (the
-- noisiest table). Deliberately not adding here.
