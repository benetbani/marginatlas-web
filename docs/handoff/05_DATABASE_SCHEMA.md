# 05 · Database Schema

> Three tables in Supabase Postgres + the fallback chain that ties
> them together. Schemas are authoritative — copy from this file
> when writing new ingest scripts.

---

## 1 · Database overview

| Project | `npfqasdghbffqgmzgxzr` |
| Tier | Pro ($25/mo, 8 GB) |
| Postgres version | (whatever Supabase ships, currently 15+) |
| Access mode | PostgREST + Supabase JS client |
| Connection pooling | Yes (Pro tier) |
| Backups | Daily (Pro tier) |
| RLS enabled on | `extrapolated_cells`, `regional_cells` (cells_master pre-dates RLS migration) |

---

## 2 · Table `cells_master` (pre-existing from v1.5)

US state-level data from the original Census SUSB pull. This was
created before the handoff folder existed; the schema is implicit
from the data layer.

```sql
-- inferred from src/lib/cells.ts normalizeRow()
CREATE TABLE cells_master (
  country VARCHAR(2),                    -- 'US' for all rows
  geo_id TEXT,                           -- e.g. 'US-06' for California
  geo_level TEXT,                        -- 'state' for all rows currently
  geo_name TEXT,                         -- e.g. 'California'
  naics_6 TEXT,                          -- 6-digit NAICS code
  naics_4 TEXT,                          -- 4-digit NAICS code (optional)
  industry_description TEXT,             -- raw native description
  size_band TEXT,                        -- '1-4', '5-9', '10-19', etc.
  year INTEGER,                          -- e.g. 2021
  n BIGINT,                              -- enterprise count (mapped to n_enterprises)
  total_employment BIGINT,
  total_payroll BIGINT,                  -- annual payroll in USD thousands
  mean_wage_per_employee_usd DOUBLE PRECISION,
  rev_p10 DOUBLE PRECISION,
  rev_p25 DOUBLE PRECISION,
  rev_p50 DOUBLE PRECISION,              -- median; also revenue_per_firm
  rev_p75 DOUBLE PRECISION,
  rev_p90 DOUBLE PRECISION,
  quality_score INTEGER,
  coverage_tier VARCHAR(2),              -- 'P' / 'S' / 'M' / 'T' / 'X'
  coverage_source TEXT,                  -- agency-specific (genericised by UI)
  currency VARCHAR(3)                    -- 'USD' for all rows
);
```

Row count: ~722,000. Indexed on `(country, geo_id, naics_6, year)`.

---

## 3 · Table `extrapolated_cells` (created session 3)

Country-level regression estimates for ~220 country codes. Created
by `scripts/migrations/001_extrapolated_cells.sql`.

```sql
CREATE TABLE extrapolated_cells (
  country_iso3 VARCHAR(3) NOT NULL,         -- 'USA', 'DEU', 'FRA', 'JPN', etc. + WB aggregates
  country_name TEXT NOT NULL,               -- 'United States', 'Africa Eastern and Southern', etc.
  year INTEGER NOT NULL,                    -- 2024 for current rows
  industry_id TEXT NOT NULL,                -- our taxonomy industry_id, e.g. 'restaurants'
  size_band TEXT NOT NULL,                  -- '0-9', '10-49', etc. or 'GE250' / 'total'
  predicted_rev_per_firm DOUBLE PRECISION,  -- USD
  coverage_tier VARCHAR(2),                 -- 'X' for all (Extrapolated)
  coverage_source TEXT,                     -- 'Estimated from regional patterns'
  quality_score INTEGER,                    -- 40 for most
  PRIMARY KEY (country_iso3, year, industry_id, size_band)
);

CREATE INDEX idx_extrapolated_country ON extrapolated_cells (country_iso3);
CREATE INDEX idx_extrapolated_industry ON extrapolated_cells (industry_id);

ALTER TABLE extrapolated_cells ENABLE ROW LEVEL SECURITY;

CREATE POLICY extrapolated_cells_read ON extrapolated_cells
  FOR SELECT USING (true);
```

Row count: 57,816. Coverage: 219 country codes — 182 individual
countries + 37 World Bank regional aggregates (AFE, ARB, ECS, EUU,
etc.). Notable individual-country absences: USA, GBR, DEU, FRA, ITA,
ESP, JPN, BRA (excluded as regression-fit anchors).

Only 44 of 202 industries have entries; the rest are unblocked via
the `PARENT_FALLBACK_MAP` in `taxonomy.ts`.

---

## 4 · Table `regional_cells` (created session 4)

Sub-national data added across sessions 3-4. Created by
`scripts/migrations/002_regional_cells.sql`.

```sql
CREATE TABLE regional_cells (
  country VARCHAR(2) NOT NULL,              -- ISO-2: 'US', 'DE', 'FR', 'JP', 'BR', etc.
  geo_id TEXT NOT NULL,                     -- hierarchical, source-coded:
                                            --   'US-06-037'         US county (state FIPS + county FIPS)
                                            --   'DE21'              EU NUTS-2 (Eurostat raw)
                                            --   'DE212'             EU NUTS-3
                                            --   'JP-13000'          JP prefecture (5-digit JIS)
                                            --   'JP-13104'          JP municipality
                                            --   'BR-SP'             BR state (ISO 3166-2)
                                            --   'BR-CITY-sao-paulo' BR city (derived)
                                            --   'US-CITY-new-york'  Global city overlay
                                            --   'GB-E09000033'      UK LAD (when ingested)
  geo_level TEXT NOT NULL,                  -- 'state' / 'province' / 'county' / 'prefecture' /
                                            --   'municipality' / 'nuts1' / 'nuts2' / 'nuts3' /
                                            --   'lad' / 'msoa' / 'city' / 'kreis' / 'comune' /
                                            --   'commune' / 'departement' / 'sa2' / etc.
  geo_name TEXT NOT NULL,                   -- human-readable, e.g. 'Bavaria', 'Munich', 'Los Angeles County'
  industry_id TEXT NOT NULL,                -- our taxonomy industry_id
  year INTEGER NOT NULL,                    -- e.g. 2022 (US), 2020 (EU), 2024 (JP)
  size_band TEXT,                           -- '1' / '2-9' / '10-49' / '50-249' / '250+' / 'total'
  n_enterprises BIGINT,                     -- nullable
  n_employees BIGINT,                       -- nullable
  rev_p10 DOUBLE PRECISION,                 -- USD; nullable
  rev_p25 DOUBLE PRECISION,
  rev_p50 DOUBLE PRECISION,
  rev_p75 DOUBLE PRECISION,
  rev_p90 DOUBLE PRECISION,
  revenue_per_firm DOUBLE PRECISION,        -- typically = rev_p50; USD
  payroll_per_employee DOUBLE PRECISION,    -- USD annual
  quality_score INTEGER,                    -- 0-100; see quality_score.py for formula
  coverage_tier VARCHAR(2),                 -- 'P' / 'S' / 'M' / 'T' / 'X'
  coverage_source TEXT,                     -- generic label per Plan A lockdown
  currency VARCHAR(3) DEFAULT 'USD',
  PRIMARY KEY (country, geo_id, industry_id, year, size_band)
);

CREATE INDEX idx_regional_country_geo ON regional_cells (country, geo_id);
CREATE INDEX idx_regional_industry ON regional_cells (industry_id);
CREATE INDEX idx_regional_country_industry ON regional_cells (country, industry_id);

ALTER TABLE regional_cells ENABLE ROW LEVEL SECURITY;

CREATE POLICY regional_cells_read ON regional_cells
  FOR SELECT USING (true);
```

Row count (session 4 end): **179,409**.

---

## 5 · Quality tiers

The `coverage_tier` field uses this 5-tier system everywhere:

| Tier | Code | Meaning | Quality score base | UI stars |
|---|---|---|---|---|
| Primary | `P` | Direct measurement from a national statistical office | 85 | ★★★★★ |
| Secondary | `S` | Modelled from primary (e.g. Eurostat re-publishing) | 70 | ★★★★☆ |
| Modelled | `M` | Imputed using primary + auxiliary data | 60 | ★★★☆☆ |
| Tabulated | `T` | Counts only; no distribution | 50 | ★★☆☆☆ |
| Extrapolated | `X` | Regression / inference; not measured | 35 | ★★☆☆☆ |

`quality_score.py` adjusts the base by:
- +3 if has n_enterprises
- +3 if has n_employees
- +6 if has revenue
- +4 if has payroll
- +4 if has distribution (p10/p25/p75/p90)
- +1 per year newer than 2022 (cap +3); −2 per year older (cap −10)

Final score clamped to 20-100.

---

## 6 · Fallback chain in `getCellBySlug`

When the client requests a cell at URL `/{country}/{geo}/{industry}`,
the data layer in `src/lib/cells.ts` walks this chain:

```
1. resolveToMeasuredIndustry(industry):
     industry → parent_id → PARENT_FALLBACK_MAP[id] → industry (no change)

2. IF country == 'US':
     → query cells_master where (country='US', geo_id matches geo slug,
       naics_6 matches resolved industry's NAICS prefix)
     → IF no match, query cells_master with looser industry_description LIKE
     → IF no match, fall through to extrapolated_cells

3. ELSE (non-US):
     → query regional_cells where (country=ISO2, geo_id matches geo slug,
       industry_id = resolved industry_id)
     → IF no match, fall through to extrapolated_cells

4. extrapolated_cells:
     → ISO2 → ISO3, query (country_iso3, industry_id)
     → IF found, render with tier 'X' badge
     → IF not found, return null → 404 (handled by not-found.tsx)
```

The PARENT_FALLBACK_MAP (step 1) handles cases like
`boutique_clothing` (a sub-niche with no direct data) →
`clothing_stores` (also no data) → `textile_apparel_mfg` (covered).

---

## 7 · `PARENT_FALLBACK_MAP` excerpts

Full map in `src/lib/taxonomy.ts`. Representative entries:

```typescript
export const PARENT_FALLBACK_MAP: Record<string, string> = {
  // Apparel chain
  clothing_stores: "textile_apparel_mfg",

  // Beauty services
  hairdressers_beauty: "cleaning_services",
  hair_salons: "cleaning_services",
  barbershops: "cleaning_services",
  nail_salons: "cleaning_services",
  day_spas: "cleaning_services",

  // Specialty retail aggregates
  general_merchandise: "grocery_stores",
  furniture_home_stores: "grocery_stores",
  electronics_appliance_stores: "grocery_stores",
  health_beauty_stores: "grocery_stores",
  ecommerce_mail_order: "grocery_stores",

  // Health small clinics
  doctors_clinics: "veterinary_pet_care",
  dental_practices: "veterinary_pet_care",

  // Auto repair
  auto_repair_shops: "motor_vehicles_mfg",

  // ...25+ entries total
};
```

Where each entry maps an UNCOVERED parent industry (no rows in
extrapolated_cells) to the closest COVERED industry. The chain is
walked iteratively with a visited-set cycle guard.

---

## 8 · Industry classification crosswalks

Industries are keyed by our internal `industry_id` (string,
snake_case, e.g. `restaurants`). Each entry in `industries.json`
carries crosswalks back to standard classifications:

```json
{
  "id": "restaurants",
  "name": "Restaurants",
  "audience": "smb_core",
  "examples": ["sit-down restaurants", "fast casual", "fine dining"],
  "keywords": ["restaurant", "dining", "food service", "eatery"],
  "sector_id": "food_drink",
  "isic_divisions": ["56"],
  "naics_3": ["722"],
  "nace_divisions": ["56"]
}
```

The Python `common/industry_mapper.py` walks classification codes
backwards to industry_id:

- NAICS 6-digit → 5 → 4 → 3-digit prefix → industry_id (via `naics_3`)
- NACE Rev.2 letter+digit → 2-digit division → industry_id (via `nace_divisions`)
- ISIC Rev.4 → 2-digit division → industry_id (via `isic_divisions`)
- JSIC → 2-digit → ISIC bridge (broadly aligned)
- ANZSIC → 3-digit lookup in `ANZSIC_BRIDGE` constant
- KSIC → 2-digit lookup in `KSIC_BRIDGE` constant

Each per-country ingest script uses `map_industry(country_iso2, code)`
which dispatches to the right classifier per country.

---

## 9 · Common query patterns

### Cell page query (server-side, via supabase-js)

```typescript
// in src/lib/cells.ts
const { data } = await supabaseAdmin
  .from("regional_cells")
  .select("*")
  .eq("country", iso2)
  .eq("geo_id", geoId)
  .eq("industry_id", industryId)
  .order("year", { ascending: false })
  .limit(1);
```

### Direct REST API (from Python ingest)

```python
import requests
SUPABASE_URL = "https://npfqasdghbffqgmzgxzr.supabase.co"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",  # idempotent upsert
}

# Upsert (POST with merge-duplicates → INSERT or UPDATE)
r = requests.post(
    f"{SUPABASE_URL}/rest/v1/regional_cells",
    headers=HEADERS,
    json=batch_of_500_rows,
    timeout=60,
)
```

### Count rows

```python
r = requests.head(
    f"{SUPABASE_URL}/rest/v1/regional_cells?country=eq.US",
    headers={**HEADERS, "Prefer": "count=exact"},
    timeout=10,
)
print(r.headers["Content-Range"])  # e.g. "0-0/87573"
```

---

## 10 · Storage growth projection

Current state: ~360 MB of 8 GB Pro tier (4.5%).

Projection if remaining ingest phases land:

| Phase | Expected rows | Bytes/row | MB |
|---|---|---|---|
| France Sirene communes | 60,000 | 300 | 18 |
| EU LAU (DE/IT/ES/NL) | 150,000 | 300 | 45 |
| UK LAD + MSOA | 30,000 | 300 | 9 |
| Canada CSD (retry) | 12,000 | 300 | 4 |
| AU + NZ | 22,500 | 300 | 7 |
| LATAM remaining (MX/AR/CL/CO/PE) | 25,000 | 300 | 8 |
| MENA + Africa | 22,000 | 300 | 7 |
| OECD overlay | 8,000 | 300 | 3 |
| **Total additional** | ~330,000 | | **~100 MB** |

After full execution: ~460 MB of 8 GB (5.75%). Still comfortable.

---

## 11 · Backup and recovery

- Pro tier provides daily automated backups (last 7 days retained)
- Point-in-time recovery available via Supabase dashboard
- No manual backup pipeline; rely on Supabase

Recovery from accidental data loss:

1. Supabase dashboard → Database → Backups → restore from snapshot
2. Or re-run the relevant ingest pipeline (all are idempotent)

---

## 12 · Migration history

| # | File | Applied | Description |
|---|---|---|---|
| 001 | `scripts/migrations/001_extrapolated_cells.sql` | ✅ | Created extrapolated_cells table + indexes + RLS |
| 002 | `scripts/migrations/002_regional_cells.sql` | ✅ | Created regional_cells table + indexes + RLS |

Future migrations should follow the same pattern:
`scripts/migrations/NNN_description.sql`. Run manually in the
Supabase SQL editor — no automated migration runner (intentional;
keeps schema changes deliberate).
