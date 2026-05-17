# 01 · Objectives and Targets

> Specific numbers. Specific dates. Specific outcomes. A track is
> DONE only when it hits its target.

---

## 1 · Top-line targets

### Base targets (must hit to call this sweep a success)

| Metric | Current | Target | Delta |
|---|---|---|---|
| `regional_cells` rows | 179,409 | **400,000+** | +220k |
| Countries with measured sub-national data | ~70 | **80+** | +10 |
| US Census Phase 10 row count | 87,573 | **140,000+** | +52k |
| Canada row count | 65 | **12,000+** | +12k |
| Netherlands row count | 0 | **10,000+** | +10k |
| Spain LAU row count | 0 | **30,000+** | +30k |
| Italy LAU row count | 0 | **30,000+** | +30k |
| UK NOMIS row count | 0 | **30,000+** | +30k |
| AU + NZ row count | 0 | **22,000+** | +22k |
| OECD overlay row count | 0 | **8,000+** | +8k |
| LATAM (MX + AR + CL + CO + PE) | 2,317 (BR only) | **25,000+** | +23k |
| Production URL `marginatlas.com` HTTP status | 522 | **200** | live |
| Supabase storage usage | ~360 MB | **< 1 GB** | within 12% of Pro tier |
| Smoke-test pass rate on 200 URLs | not measured | **≥ 95%** | new gate |

### Stretch targets (if France lands + LATAM expands fully)

| Metric | Stretch | Delta over base |
|---|---|---|
| `regional_cells` rows | **460,000+** | +60k (France) |
| Countries with measured sub-national data | **85+** | +5 (full LATAM) |
| France commune-level rows | 60,000+ | new |
| Mexico INEGI rows | 10,000+ | new |

### Anti-targets (must not exceed)

| Metric | Cap | Why |
|---|---|---|
| RSS per Python script | **600 MB** | R-009; founder explicit |
| Parallel ingest pipelines | **1 at a time** | R-008 |
| New banking/oil/pharma/telecom sectors in default UI | **0** | R-003, R-011 |
| Source agency names in user-visible text | **0** | R-002 |
| Aquamarine / teal / cyan in UI | **0** (one sparse deep teal exception) | R-001 |
| Force pushes to main | **0** | R-012 |
| `--no-verify` skips | **0** | R-013 |
| `.env.local` git commits | **0** | R-006 |

---

## 2 · Per-track targets and gates

### Track A · Founder blockers

| Task | Owner | Target | Gate |
|---|---|---|---|
| A.1 Cloudflare DNS | Founder | `marginatlas.com` returns 200 | `curl -sI https://marginatlas.com` returns `HTTP/1.1 200 OK` |
| A.2 Editorial tone | Founder | One choice per surface (cell / country / sector / blog / /ask) | Founder posts a decision in chat |
| A.3 ANTHROPIC key in Vercel | Founder | Key in production env vars | `/api/ask` flips from `preview: true` to real Claude response |
| A.4 France Sirene CSV | Founder (optional) | File at `E:\atlas\delivery\regional\fr_insee\StockUniteLegale.csv` | `Test-Path` returns true; file size > 5 GB |
| A.5 Image commission | Founder (optional) | Decision: commission or stay placeholder | Founder posts a decision |

### Track B · NAICS-3 taxonomy expansion

| Metric | Current | Target |
|---|---|---|
| NAICS-3 codes in `industries.json` | 73 | **~250** (full NAICS-3 universe minus non-applicable codes) |
| Sub-niches added | 0 | **+10 to +30** new sub-niches where a NAICS-3 doesn't fit an existing industry |
| `verify_taxonomy.ts` exit code | 0 | **0** (must stay clean) |
| `tsc --noEmit` exit code | 0 | **0** |
| US Phase 10 yield delta on re-run | n/a | **+50k rows minimum** (gate for Track C.3) |

### Track C · North America recovery

| Task | Target | Gate |
|---|---|---|
| C.1 Canada retry | 12,000+ rows | Supabase count check |
| C.2 Canada spot-check | 5/5 URLs render | Visual check on Vercel preview |
| C.3 US Census re-execute | 140,000+ total rows in `regional_cells` for US | Count check |
| C.4 US spot-check | 8/8 URLs render | Visual check |

### Track D · EU LAU pilot

| Task | Target | Gate |
|---|---|---|
| D.1-D.3 Netherlands CBS | 10,000+ rows | Count + spot-check 5 URLs |
| D.4-D.6 Spain INE DIRCE | 30,000+ rows | Count + spot-check 5 URLs |
| D.7-D.9 Italy ISTAT | 30,000+ rows | Count + spot-check 5 URLs |

### Track E · UK NOMIS

| Task | Target | Gate |
|---|---|---|
| E.1 ID discovery | LAD geography type + SIC industry IDs documented | Numeric IDs hardcoded in script |
| E.2 LAD ingest | 20,000+ rows | Count + spot-check 5 LADs |
| E.3 MSOA ingest (optional) | +10,000 rows | Count + spot-check 3 MSOAs |

### Track F · OECD overlay

| Task | Target | Gate |
|---|---|---|
| F.1 Endpoint probe | New dataflow ID confirmed | Successful single-region query |
| F.2 Pipeline rewrite | Script returns rows | Dry-run: 1 country, 1 region |
| F.3 Full execute | 8,000+ rows | Count check |

### Track G · Anglo Pacific

| Task | Target | Gate |
|---|---|---|
| G.1-G.2 Australia ABS | 15,000+ rows | Count + spot-check 5 SA-level cells |
| G.3-G.4 New Zealand Stats NZ | 7,000+ rows | Count + spot-check 5 TLA cells |

### Track H · France Sirene (conditional)

| Task | Target | Gate |
|---|---|---|
| H.1 (founder) CSV download | File at expected path | `Test-Path` returns true |
| H.2 DuckDB aggregation | Aggregated parquet at `delivery/regional/fr_insee/agg.parquet` | File exists, > 100 MB |
| H.3 Upload | 60,000+ rows | Count check |

### Track I · LATAM expansion

| Task | Target | Gate |
|---|---|---|
| I.1-I.2 Mexico INEGI | 10,000+ rows | Count + spot-check 5 states |
| I.3 Argentina INDEC | 4,000+ rows | Count |
| I.4 Chile INE | 3,000+ rows | Count |
| I.5 Colombia DANE | 3,000+ rows | Count |
| I.6 Peru INEI | 3,000+ rows | Count |

### Track J · Frontend + SEO

| Task | Target | Gate |
|---|---|---|
| J.1 Sitemap regen | Includes top 10,000 cells across regional_cells | `/sitemap.xml` returns ≥ 10,000 URLs |
| J.2 Coverage badge enhancements | Tooltip on every QualityBadge | Visual check |
| J.3 Last-updated line on cells | All cell pages show `year` | Visual check |
| J.4 OG image generation (optional) | Per-cell OG image | Twitter / Slack preview renders correctly |

### Track K · Verification

| Task | Target | Gate |
|---|---|---|
| K.1 Per-track row count delta | Matches expected from §1 of this file | Each track's gate |
| K.2 Smoke test 200 random URLs | ≥ 95% pass | Test script output |
| K.3 Taxonomy CI | Passes | `npx tsx scripts/verify_taxonomy.ts` exit 0 |
| K.4 TypeScript | No errors | `npx tsc --noEmit` exit 0 |
| K.5 Coverage tier distribution | Matches expectation per phase | Tier distribution query |
| K.6 Final report | Written to `docs/ingest/FINAL_REPORT_v2.md` | File exists |

### Track L · Handoff refresh

| Task | Target | Gate |
|---|---|---|
| L.1 `04_CURRENT_STATE.md` updated | Reflects new row counts, new countries | File diff shows changes |
| L.2 `03_DECISION_LOG.md` appended | New decisions captured | New `D-1NN` entries |
| L.3 `09_BLOCKERS_AND_RESOLUTIONS.md` updated | Resolved blockers marked CLOSED | Status changes |
| L.4 `11_NEXT_STEPS.md` reordered | Done items struck through | New priority order |
| L.5 `12_VERIFICATION_URLS.md` extended | New phases' spot-check URLs added | New sections |
| L.6 Commit + push | All handoff changes in one commit | `git log -1` shows commit |

---

## 3 · Quality bar

### What counts as DONE for a Python ingest

A pipeline is DONE when ALL of the following are true:

1. Row count delta in Supabase matches expectation (±10%)
2. ≥ 5 spot-check URLs render correctly on Vercel preview
3. Coverage tier distribution matches expectation (e.g. P for direct, S for re-published, X for derived)
4. No NULL `geo_name` rows
5. No orphan `industry_id` (every row's industry_id exists in taxonomy)
6. RAM peak logged < 600 MB
7. Resume-test passed: script killed mid-run, restarted, completes
8. Sitemap auto-updated to include new URLs
9. `progress.json` preserved (do not delete after the run)
10. Commit + push with row count in commit message

### What counts as DONE for a frontend change

1. `npx tsc --noEmit` clean
2. `npx tsx scripts/verify_taxonomy.ts` clean
3. `npm run lint` clean
4. Visible on Vercel preview within 60 seconds of push
5. No regression on the home page (spot-check)
6. Tailwind palette unchanged (no aquamarine introduced)

---

## 4 · Timeboxes

| Track | Estimate | Hard cap |
|---|---|---|
| A | Founder-paced | n/a |
| B | 2 hours | 4 hours |
| C | 3 hours (1 CA + 2 US re-run) | 5 hours |
| D | 9 hours (2 NL + 3 ES + 4 IT) | 14 hours |
| E | 4 hours | 6 hours |
| F | 2 hours | 4 hours |
| G | 4 hours | 6 hours |
| H | 2 hours pipeline (after founder CSV) | 4 hours |
| I | 14 hours (5 countries × ~3 hours) | 20 hours |
| J | 4 hours | 6 hours |
| K | 1 hour (in flight per track) + 2 hours final | 4 hours |
| L | 1 hour | 2 hours |

Total estimated engineering: **45 hours** of focused work. Spread
across multiple sessions; one session can chew through 4-6 tracks
depending on blockers.

---

## 5 · Definition of success for this entire sweep

Pasted into Track L's final commit message:

> Sweep complete. `regional_cells` at NNN,NNN rows (delta +NNN,NNN
> from 179,409). Countries with measured sub-national data: N. New
> tracks landed: B (NAICS+NNN codes), C (CA +12k, US +50k), D (NL/ES/IT
> +70k), E (UK +30k), F (OECD +8k), G (AU/NZ +22k), [H France +60k
> conditional], I (LATAM +25k). Production URL: [live | still blocked].
> /ask: [live | preview-stub pending tone]. Handoff folder refreshed.
