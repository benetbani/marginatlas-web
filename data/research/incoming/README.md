# Research drops — incoming

Drop converted research JSON here, one file per (country, sector) run:
`<iso2>_<sector>_<date>.json` (e.g. `in_food_hospitality_2026-05-31.json`).

Schema + flow: `docs/research-ingestion.md`. Template: `_SAMPLE_in_food_hospitality.json`.

## Commands (run from E:/atlas/website)
```
npx tsx scripts/ingest/validate_research_drop.ts data/research/incoming/<file>.json
npx tsx scripts/ingest/load_research_drop.ts     data/research/incoming/<file>.json            # dry-run
npx tsx scripts/ingest/load_research_drop.ts     data/research/incoming/<file>.json --commit   # write
npx tsx scripts/ingest/load_research_drop.ts     --rollback <drop_id>                          # undo
```
Always validate, then dry-run, then commit. Loads need SUPABASE_DB_URL (from
E:/atlas/secrets.env) or the PostgREST env in .env.local.
