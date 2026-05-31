# Research ingestion pipeline

How heavy-research-model output (from `E:\atlas\research-prompts\*`) gets into the
Margin Atlas database, safely and reviewably.

## The flow

1. You paste a prompt into the research model, it returns prose + tables.
2. Convert that answer into a **research drop** JSON file (schema below), saved to
   `data/research/incoming/<country>_<sector>_<date>.json`. (A converter agent or a
   manual paste both work; the schema is small.)
3. `npm run research:validate -- <file>` checks the drop is well-formed and sane.
4. `npm run research:load -- <file> --dry-run` prints a diff of what WOULD change in
   Supabase, with no writes.
5. `npm run research:load -- <file>` applies it: upserts `regional_cells` /
   `extrapolated_cells` rows and updates the activity margin/cost layer, stamping
   `coverage_source` and a `research_drop_id` for provenance.

Nothing auto-writes to production. Dry-run first, always.

## The two layers a drop can feed

- **Activity economics** (transferable within a country): net-margin band + cost
  structure per (country, activity, size_band). Lands in `regional_cells` /
  `extrapolated_cells` as real rows, and optionally refines the per-activity
  `industry_margins.json` when the research is strong and broad.
- **Geo signal**: regional variation multipliers per (country, region). Stored for
  the geo-multiplier layer.

## Research-drop JSON schema (v1)

```json
{
  "schema": "research-drop/v1",
  "country_iso2": "IN",
  "sector_cluster": "food_hospitality",
  "source_model": "gpt-deep-research",
  "captured_at": "2026-05-31",
  "confidence_default": "modeled",
  "activities": [
    {
      "industry_id": "restaurants",
      "currency": "INR",
      "fx_to_usd": 0.012,
      "fx_date": "2026-05-31",
      "size_bands": [
        {
          "band": "1-4",
          "revenue_per_firm_local": 2500000,
          "net_margin_pct_low": 3,
          "net_margin_pct_high": 8,
          "margin_basis": "owner take-home",
          "cost_structure_pct": {
            "cogs": 35, "labor": 25, "rent": 12, "utilities": 6,
            "tax": 5, "other": 17
          },
          "share_of_firms_pct": 70,
          "share_of_revenue_pct": 30,
          "confidence": "modeled",
          "source": "NSS unincorporated enterprise survey 2023"
        }
      ],
      "regional_variation": [
        { "region": "Mumbai", "revenue_multiplier_vs_national": 1.6, "confidence": "modeled", "source": "NRAI 2024" }
      ]
    }
  ]
}
```

### Field rules
- `country_iso2`: 2-letter, uppercase. Mapped to iso3 for `extrapolated_cells`.
- `industry_id`: MUST exist in the taxonomy (validator checks). Use the friendly id
  (e.g. `restaurants`, `hairdressers_beauty`), not a NAICS code.
- `band`: one of `1-4`, `5-9`, `10-19`, `20-49`, `50-99`, `100+`, `1-9`, `10-49`,
  `50-299`, `300+`, or `solo`. The loader normalizes to the DB `size_band` values.
- Money is in LOCAL currency; `fx_to_usd` converts. Never store a bare number
  without currency.
- `cost_structure_pct` should sum to roughly 100 (validator warns if it does not).
- `confidence`: `observed` | `modeled` | `low`. Drives `quality_score` and
  `coverage_tier` on the resulting row.
- Every figure carries a `source` string. No source = validator rejects.

## What the loader writes
- For each (country, activity, band): a `regional_cells` row when regional data is
  present, else an `extrapolated_cells` row (country-level). It derives
  `rev_p10..rev_p90` from `revenue_per_firm` + a per-activity spread, sets
  `coverage_source` to the drop's source, and `quality_score` from `confidence`.
- It NEVER deletes existing rows; it upserts by primary key and records a
  `research_drop_id` so a bad drop can be rolled back.

## Provenance + rollback
Every loaded row gets `coverage_source = "research-drop:<id>"`. To roll back a drop,
`npm run research:rollback -- <drop_id>` deletes only rows tagged with that id.
