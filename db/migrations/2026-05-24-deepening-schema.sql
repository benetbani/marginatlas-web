-- Industry-deepening schema (Plan v32, Sprint G, Phase 0).
--
-- DO NOT run automatically. Founder runs this in Supabase SQL Editor
-- when ready. Inverse migration is the bottom half of this file.
--
-- This migration adds:
--   - sub_industries: catalog of sub-industry variants (rows for
--     barbershops_mens, auto_dealers_used, etc.)
--   - local_aliases: per-(industry, country) local-name overrides
--   - regional_cells.sub_industry_id (nullable): which variant this
--     row represents, or NULL for parent-industry roll-ups
--   - regional_cells.cost_stack (JSONB nullable): the 8-line annual
--     cost stack for this cell
--   - regional_cells.setup_costs (JSONB nullable): registration +
--     capital fit-out for opening this business in this place
--   - cells_master mirrors of the above three columns
--   - extrapolated_cells mirrors of the above three columns
--
-- Everything is additive and nullable. Existing reads continue to
-- work unchanged. Phase 1 starts populating the new columns per
-- (industry, country) as primary-source data lands.

-- ---------------------------------------------------------------------------
-- FORWARD migration
-- ---------------------------------------------------------------------------

-- 1. Sub-industry catalog
CREATE TABLE IF NOT EXISTS sub_industries (
  id TEXT PRIMARY KEY,
  parent_industry_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  data_ready BOOLEAN NOT NULL DEFAULT FALSE,
  prevalent_in TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_industries_parent
  ON sub_industries (parent_industry_id);

CREATE INDEX IF NOT EXISTS idx_sub_industries_data_ready
  ON sub_industries (data_ready)
  WHERE data_ready = TRUE;

-- 2. Local-name aliases
CREATE TABLE IF NOT EXISTS local_aliases (
  id BIGSERIAL PRIMARY KEY,
  industry_id TEXT NOT NULL,
  country_iso2 TEXT NOT NULL,
  local_name TEXT NOT NULL,
  local_name_translit TEXT,
  pronunciation_hint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (industry_id, country_iso2)
);

CREATE INDEX IF NOT EXISTS idx_local_aliases_lookup
  ON local_aliases (industry_id, country_iso2);

-- 3. Cell extensions on regional_cells
ALTER TABLE regional_cells
  ADD COLUMN IF NOT EXISTS sub_industry_id TEXT,
  ADD COLUMN IF NOT EXISTS sub_industry_source_kind TEXT
    CHECK (sub_industry_source_kind IN ('primary', 'modeled') OR sub_industry_source_kind IS NULL),
  ADD COLUMN IF NOT EXISTS cost_stack JSONB,
  ADD COLUMN IF NOT EXISTS setup_costs JSONB;

-- 4. Same extensions on cells_master (US source table)
ALTER TABLE cells_master
  ADD COLUMN IF NOT EXISTS sub_industry_id TEXT,
  ADD COLUMN IF NOT EXISTS sub_industry_source_kind TEXT
    CHECK (sub_industry_source_kind IN ('primary', 'modeled') OR sub_industry_source_kind IS NULL),
  ADD COLUMN IF NOT EXISTS cost_stack JSONB,
  ADD COLUMN IF NOT EXISTS setup_costs JSONB;

-- 5. Same extensions on extrapolated_cells (country-level fallback)
ALTER TABLE extrapolated_cells
  ADD COLUMN IF NOT EXISTS sub_industry_id TEXT,
  ADD COLUMN IF NOT EXISTS sub_industry_source_kind TEXT
    CHECK (sub_industry_source_kind IN ('primary', 'modeled') OR sub_industry_source_kind IS NULL),
  ADD COLUMN IF NOT EXISTS cost_stack JSONB,
  ADD COLUMN IF NOT EXISTS setup_costs JSONB;

-- 6. Quick lookup indexes on sub_industry_id (used by variant-chip
--    queries on cell pages)
CREATE INDEX IF NOT EXISTS idx_regional_cells_sub_industry
  ON regional_cells (industry_id, sub_industry_id)
  WHERE sub_industry_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cells_master_sub_industry
  ON cells_master (industry_id, sub_industry_id)
  WHERE sub_industry_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_extrapolated_cells_sub_industry
  ON extrapolated_cells (industry_id, sub_industry_id)
  WHERE sub_industry_id IS NOT NULL;

-- 7. updated_at triggers (Postgres standard pattern)
CREATE OR REPLACE FUNCTION touch_updated_at_deepening()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sub_industries_touch ON sub_industries;
CREATE TRIGGER trg_sub_industries_touch
  BEFORE UPDATE ON sub_industries
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at_deepening();

DROP TRIGGER IF EXISTS trg_local_aliases_touch ON local_aliases;
CREATE TRIGGER trg_local_aliases_touch
  BEFORE UPDATE ON local_aliases
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at_deepening();

-- ---------------------------------------------------------------------------
-- INVERSE migration (uncomment to roll back)
-- ---------------------------------------------------------------------------
--
-- DROP TRIGGER IF EXISTS trg_sub_industries_touch ON sub_industries;
-- DROP TRIGGER IF EXISTS trg_local_aliases_touch ON local_aliases;
-- DROP FUNCTION IF EXISTS touch_updated_at_deepening();
--
-- DROP INDEX IF EXISTS idx_extrapolated_cells_sub_industry;
-- DROP INDEX IF EXISTS idx_cells_master_sub_industry;
-- DROP INDEX IF EXISTS idx_regional_cells_sub_industry;
--
-- ALTER TABLE extrapolated_cells
--   DROP COLUMN IF EXISTS setup_costs,
--   DROP COLUMN IF EXISTS cost_stack,
--   DROP COLUMN IF EXISTS sub_industry_source_kind,
--   DROP COLUMN IF EXISTS sub_industry_id;
--
-- ALTER TABLE cells_master
--   DROP COLUMN IF EXISTS setup_costs,
--   DROP COLUMN IF EXISTS cost_stack,
--   DROP COLUMN IF EXISTS sub_industry_source_kind,
--   DROP COLUMN IF EXISTS sub_industry_id;
--
-- ALTER TABLE regional_cells
--   DROP COLUMN IF EXISTS setup_costs,
--   DROP COLUMN IF EXISTS cost_stack,
--   DROP COLUMN IF EXISTS sub_industry_source_kind,
--   DROP COLUMN IF EXISTS sub_industry_id;
--
-- DROP INDEX IF EXISTS idx_local_aliases_lookup;
-- DROP TABLE IF EXISTS local_aliases;
--
-- DROP INDEX IF EXISTS idx_sub_industries_data_ready;
-- DROP INDEX IF EXISTS idx_sub_industries_parent;
-- DROP TABLE IF EXISTS sub_industries;
