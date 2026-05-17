# 99 — The Execution Prompt

> Paste the prompt below into a fresh Claude Code message to start the
> sub-national ingest. It tells me to read the master plan, execute the
> phases in priority order, commit + push after each phase, and report
> the running scoreboard.

---

## The prompt

```
Execute the sub-national ingest plan documented in docs/ingest/.

Sequence:
1. Read docs/ingest/00_MASTER.md to absorb the overall strategy, RAM discipline, common contract, and the per-phase priority order.
2. Build the shared helpers under scripts/ingest/common/ (upload_to_supabase.py, industry_mapper.py, currency_convert.py, geo_name_normalize.py, quality_score.py, pagination.py, dedup.py, ram_guard.py). One commit per helper.
3. Execute phases in this order, one at a time. After each phase: type-check, run the spot-check URLs against production, commit with the phase tag, push, then append a summary row to docs/ingest/19_VERIFICATION_QUALITY.md and update the scoreboard table at the top.

Priority order:
  Phase 1  → docs/ingest/01_EU_EUROSTAT_NUTS.md          (~260,000 cells)
  Phase 8  → docs/ingest/08_JAPAN_ESTAT_MUNICIPALITIES.md (~7,500 cells)   # quick win, validates pattern
  Phase 9  → docs/ingest/09_KOREA_KOSIS_SIGUNGU.md       (~7,000)
  Phase 3  → docs/ingest/03_GERMANY_DESTATIS_KREISE.md   (~24,000)         # founder priority
  Phase 5  → docs/ingest/05_ITALY_ISTAT_COMUNI.md        (~30,000)
  Phase 6  → docs/ingest/06_SPAIN_INE_MUNICIPIOS.md      (~30,000)
  Phase 7  → docs/ingest/07_UK_ONS_LAD.md                (~37,000)
  Phase 11 → docs/ingest/11_CANADA_STATCAN_CSD.md        (~30,000)
  Phase 12 → docs/ingest/12_AUSTRALIA_NZ_ABS.md          (~22,500)
  Phase 2  → docs/ingest/02_EU_LAU_DEEP.md               (~150,000)         # heavy, after pattern is proven
  Phase 4  → docs/ingest/04_FRANCE_INSEE_COMMUNES.md     (~60,000)          # heaviest single source
  Phase 10 → docs/ingest/10_US_CENSUS_COUNTIES_MSA.md    (~175,000)         # triggers Supabase Pro decision
  Phase 13 → docs/ingest/13_INDIA_CHINA.md               (~20,000)
  Phase 14 → docs/ingest/14_SEA_CLUSTER.md               (~15,000)
  Phase 15 → docs/ingest/15_LATAM_CLUSTER.md             (~35,000)
  Phase 16 → docs/ingest/16_MENA_AFRICA.md               (~22,000)
  Phase 17 → docs/ingest/17_OECD_WB_OVERLAY.md           (~8,000 + anomaly report)
  Phase 18 → docs/ingest/18_CITY_OVERLAY.md              (~5,000)

Constraints (NON-NEGOTIABLE):
  - RAM peak per script must stay under 600 MB RSS. Use ram_guard.py wrapper. Abort + resume on overshoot.
  - One country at a time inside each phase. No parallel pipelines.
  - All Sirene-class large CSVs streamed via DuckDB with memory_limit='400MB'. NEVER pd.read_csv without chunksize.
  - Batch upserts to Supabase in chunks of 500. Idempotent (PK conflict OK).
  - Per-country resume files (e.g. fr_insee_progress.json) committed alongside source code.
  - Coverage_source text uses GENERIC labels (Plan v3.0 §A lockdown). The QualityBadge component generizes.
  - Audience filter applied at write time: corp_only industries are uploaded but flagged; default UI hides.

Pause conditions:
  - After Phase 4 (France) finishes, pause and report Supabase storage delta. If projection shows we'll exceed 500 MB free tier within the next 2 phases, ask the founder to upgrade Supabase Pro ($25/mo for 8 GB) before continuing with Phase 10 (US).
  - After Phase 10, pause and let the founder review the live site at 5 sample county URLs before continuing.
  - Stop immediately and ask before applying any DDL beyond the existing regional_cells migration.

Reporting:
  - After each phase: paste the updated scoreboard table from docs/ingest/19_VERIFICATION_QUALITY.md.
  - After every 3 phases: paste the new total row count in regional_cells and a list of the top 20 highest-traffic new URLs.

If a source's API is down or rate-limited beyond patience:
  - Mark the phase as PARTIAL in the scoreboard with rowcount achieved.
  - Move to the next phase. Come back later.
  - Do NOT fail the whole run.

Begin. Start with the common helpers, then Phase 1 (EU NUTS).
```

---

## Notes on the prompt

- Phases are reordered from the master doc's "natural" order to optimize for fast-feedback wins first (Japan + Korea are small and validate the pattern; Germany is the founder's stated priority), heavy ingests after (Phase 2 EU LAU, Phase 4 France, Phase 10 US), and lower-priority/region-of-last-resort phases at the end.
- The two pause conditions exist because:
  - Phase 4 (France) + Phase 10 (US) together will burst free-tier Supabase storage. The founder may want to upgrade BEFORE rather than discover mid-run.
  - Phase 10 is the highest-traffic single phase; landing it correctly matters more than landing the rest. A founder spot-check before continuing protects against systemic data quality issues.
- "Begin" at the end is the trigger phrase — I'll start with `scripts/ingest/common/upload_to_supabase.py` and work down.
