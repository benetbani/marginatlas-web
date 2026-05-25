# brain-skeleton snapshot

**Source of truth:** `E:\Archive\Projects\UI-UX\brain-skeleton\sources\_bulk\` on the founder's local machine. That folder is the canonical Python data-pipeline for the sibling `researchtesseract.com` project. This folder is a one-way **snapshot** of the CSVs Margin Atlas actually reads at build time.

**Why we copy instead of import:** the brain-skeleton lives outside this Next.js project's working tree, so we cannot reliably import from it across machines and CI. A snapshot also lets us pin a known-good version and refresh deliberately.

**Snapshot date:** 2026-05-25.

## Files

| File | Rows | Shape | Used by |
|---|---|---|---|
| `world_bank_countries.csv` | 217 | iso2, iso3, name, region, income_group, currency | country master enrichment |
| `world_bank_population.csv` | 265 | iso2, year, population | cities §6 saturation (per-capita), country pages |
| `world_bank_gdp_per_capita.csv` | 259 | iso2, year, gdp_per_capita_usd | cities §5 metro-GDP fallback, country pages |
| `world_bank_implied_fx.csv` | 210 | iso2, year, implied_fx_local_per_usd | currency correction fallback |
| `informal_share.csv` | 162 | iso2, iso3, country_name, year, dge_pct, mimic_pct, informal_pct | cell-page plausibility bounds widening for high-informality countries |
| `world_bank_cpi.csv` | 9106 | iso2, year, cpi_2010_100 | inflation-adjusting historical cells |

## Refresh protocol

When the brain-skeleton's CSVs update:

```bash
# from the Margin Atlas root
cp "E:/Archive/Projects/UI-UX/brain-skeleton/sources/_bulk/world_bank_countries.csv" data/external/brain-skeleton/
cp "E:/Archive/Projects/UI-UX/brain-skeleton/sources/_bulk/world_bank_population.csv" data/external/brain-skeleton/
cp "E:/Archive/Projects/UI-UX/brain-skeleton/sources/_bulk/world_bank_gdp_per_capita.csv" data/external/brain-skeleton/
cp "E:/Archive/Projects/UI-UX/brain-skeleton/sources/_bulk/world_bank_implied_fx.csv" data/external/brain-skeleton/
cp "E:/Archive/Projects/UI-UX/brain-skeleton/sources/_bulk/informal_share.csv" data/external/brain-skeleton/
cp "E:/Archive/Projects/UI-UX/brain-skeleton/sources/_bulk/world_bank_cpi.csv" data/external/brain-skeleton/
```

Then update the snapshot date above and the row counts.

## Rules

- **Never edit these CSVs in place.** They are immutable snapshots.
- **Never write to this folder from a script.** Read-only.
- **Don't add new files here** without first adding them to the brain-skeleton repo. Anything bespoke to Margin Atlas lives under `data/` directly, not under `data/external/`.

## Loader

The TypeScript loader lives at `src/lib/external/brain_data.ts`. Every consumer reads through that loader (never `fs.readFileSync` directly on these CSVs).
