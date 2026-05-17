# 05 · Track C — North America Recovery

> Two jobs: (1) retry Canada with the correct StatCan table, (2)
> re-execute US Census after Track B's NAICS expansion lands more
> codes.

---

## 1 · Goal

Bring Canada from 65 rows (wrong table) to 12,000+, and bring US
Census Phase 10 from 87,573 to 140,000+ by re-running with expanded
NAICS-3 coverage.

---

## 2 · Targets

| Task | Current | Target |
|---|---|---|
| C.1 Canada row count | 65 | **12,000+** |
| C.2 Canada spot-check URLs | 0 | **5/5 render** |
| C.3 US Census row count | 87,573 | **140,000+** |
| C.4 US spot-check URLs | n/a | **8/8 render** |

---

## 3 · T-C.1 · Canada retry with correct table

### Root cause

`scripts/ingest/ca_statcan/fetch.py` currently uses table
`33-10-0307-01` ("Expected change in business activity" survey).
That's the wrong dataset. Correct: **`33-10-0418-01`** (Canadian
Business Counts, by NAICS-4 + Province).

### Steps

#### T-C.1.1 — Read the current fetch.py

```python
# E:\atlas\scripts\ingest\ca_statcan\fetch.py
# Look for the line that defines the table:
table = "33100307"
```

#### T-C.1.2 — Change the table ID

```python
table = "33100418"  # Canadian Business Counts, with employees, by NAICS-4 + Province
```

#### T-C.1.3 — Verify the column schema matches our expectation

StatCan table 33-10-0418-01 columns (per their schema docs):

- GEO: Province (10 + 3 territories)
- NAICS_4: 4-digit NAICS code with description
- SIZE_BAND: Employment size class (Total / 1-4 / 5-9 / 10-19 / 20-49 / 50-99 / 100-199 / 200-499 / 500+)
- REF_DATE: Year
- VALUE: Count of businesses

Adjust the script's row normalisation to match.

#### T-C.1.4 — Clear cached wrong-table CSV

```bash
# PowerShell
Remove-Item E:\atlas\delivery\regional\ca_statcan\33100307.csv -ErrorAction SilentlyContinue
Remove-Item E:\atlas\delivery\regional\ca_statcan\progress.json -ErrorAction SilentlyContinue
```

The wrong-table cache is ~300 MB. Don't keep it.

#### T-C.1.5 — Add NAICS-4 lookup to industry_mapper

In `scripts/ingest/common/industry_mapper.py`, ensure NAICS-4 codes
roll up to NAICS-3 → industry_id. If Track B added NAICS-4 arrays
to industries, use those directly. Otherwise:

```python
def naics4_to_industry_id(code: str) -> str | None:
    """NAICS-4 → industry_id. Falls through to NAICS-3 lookup."""
    if not code or len(code) < 3:
        return None
    # First try exact NAICS-4 match (if industries.json has naics_4)
    for ind in INDUSTRIES:
        if code in ind.get("naics_4", []):
            return ind["id"]
    # Fall through to NAICS-3 prefix
    return naics_to_industry_id(code[:3])
```

#### T-C.1.6 — Run the pipeline

```bash
cd E:\atlas
python scripts/ingest/ca_statcan/fetch.py
```

Expected:
- ~12,000 rows ingested
- Coverage: 13 provinces/territories × ~80 industries × multiple size bands
- Tier 'P'
- Runtime: ~1 hour
- Peak RAM: < 200 MB (StatCan CSV is ~50 MB)

#### T-C.1.7 — Monitor

If using `Bash run_in_background=True`, schedule a wake-up:

```
ScheduleWakeup at 60s after launch
```

Watch for:

- 600 MB RAM cap not exceeded (`ram_guard` aborts if so)
- Upload batches landing (logs every 10 batches)
- No 429 / 503 storms from StatCan

#### T-C.1.8 — Commit

```bash
git add scripts/ingest/ca_statcan/fetch.py scripts/ingest/common/industry_mapper.py
git commit -m "$(cat <<'EOF'
ingest: phase 11 Canada — +<N> rows (correct table 33-10-0418-01)

- Switched from 33-10-0307 (business dynamics, wrong) to 33-10-0418 (business counts)
- ~12k rows across 13 provinces x ~80 industries x size bands
- Tier P
- Total regional_cells: <NEW_TOTAL>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
git push origin main
```

---

## 4 · T-C.2 · Canada spot-check

Open Vercel preview and verify these 5 URLs render with real numbers:

| URL | Geography | Industry |
|---|---|---|
| `/ca/ca-on/restaurants` | Ontario | Restaurants |
| `/ca/ca-qc/cafes-coffee-shops` | Quebec | Cafés |
| `/ca/ca-bc/web-mobile-dev-shops` | British Columbia | Software dev |
| `/ca/ca-ab/auto-repair-shops` | Alberta | Auto repair |
| `/ca/ca-mb/management-consulting` | Manitoba | Consulting |

Each should show:
- 5-star QualityBadge (tier P)
- Real n_enterprises + n_employees
- Source label = "National business statistics" (generic, R-002)
- No "Coming soon" or fallback warning

If any fails:
- Check Supabase directly: `?country=eq.CA&geo_id=eq.CA-ON&industry_id=eq.restaurants`
- If 0 rows: slug mismatch (geo_id vs URL slug)
- If rows present but page doesn't render: check `getCellBySlug` slug resolution

---

## 5 · T-C.3 · US Census re-execute (after Track B)

### Why re-execute

Track B added ~80 NAICS-3 codes that weren't previously mapped. The
existing 87,573 rows were ingested when the script silently dropped
unmapped codes. Re-running with the expanded taxonomy should land
~50,000 additional rows.

### Steps

#### T-C.3.1 — Verify Track B is fully merged

```bash
# Check that industries.json has been updated
cd E:\atlas\website
python -c "import json; d=json.load(open('src/lib/taxonomy/industries.json',encoding='utf-8')); codes=set(); [codes.update(i.get('naics_3',[])) for i in d]; print(f'NAICS-3 codes: {len(codes)}')"
# expect: ≥ 95
```

If still 73, Track B isn't fully landed — go back to Track B.

#### T-C.3.2 — Clear US Census progress.json

```bash
# PowerShell
Remove-Item E:\atlas\delivery\regional\us_census\progress.json
```

The pipeline will re-iterate all 51 states × ~99 NAICS-3 codes =
5,049 API calls. This is a re-run; the existing 87,573 rows in
Supabase will be UPDATED in place (PK merge) — no duplicates.

#### T-C.3.3 — Estimate run time

Previous run: 3,723 calls in 1h50m → ~50 calls/min.
New run: 5,049 calls → ~1h40m → 2h10m.

Round up: **2.5 hours wall-time** budget.

#### T-C.3.4 — Launch in background with wake-up monitor

```python
# Pseudo-code for what the session does:
launch_background("python scripts/ingest/us_census/fetch_cbp.py")
ScheduleWakeup(60s)  # first check
# On wake: check progress.json line count, check RSS, check for errors
# Repeat until done or error
```

Per `D-093` and `D-094`: background bash + ScheduleWakeup is the
right pattern for unattended long-running pipelines.

#### T-C.3.5 — Monitor RAM and progress

Watch for:

- Peak RSS < 600 MB (the script is streaming; should stay under 200)
- Progress.json appending new (state, naics3) pairs
- Supabase row count climbing

#### T-C.3.6 — Verify row count delta

```bash
curl -s 'https://npfqasdghbffqgmzgxzr.supabase.co/rest/v1/regional_cells?country=eq.US&select=country&limit=1' \
  -H "apikey: <SERVICE_KEY>" \
  -H "Prefer: count=exact" \
  -I 2>&1 | grep -i content-range
# expect: Content-Range: 0-0/140000+ (was 87573)
```

If delta < +30k: investigate. Likely missing NAICS-3 coverage in
industries.json (Track B incomplete).

#### T-C.3.7 — Commit

```bash
git commit --allow-empty -m "$(cat <<'EOF'
ingest: phase 10 US Census re-execute with expanded NAICS-3

- 5,049 API calls (51 states x ~99 NAICS-3)
- 87,573 → <NEW_US_COUNT> rows (delta +<DELTA>)
- All rows tier P, PAYANN-derived payroll/employee
- Total regional_cells: <NEW_TOTAL>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
git push origin main
```

Empty commit because no code changed — but the deploy refresh
ensures Vercel picks up new sitemap entries.

---

## 6 · T-C.4 · US spot-check

Verify 8 URLs across newly-covered NAICS-3 codes:

| URL | Geography | Industry / NAICS-3 |
|---|---|---|
| `/us/us-06-037/printing-services` | LA County | NAICS 323 (new from Track B) |
| `/us/us-17-031/sporting-hobby-books` | Cook County | NAICS 459 (new) |
| `/us/us-48-201/warehousing-storage` | Harris County | NAICS 493 (new) |
| `/us/us-36-061/management-of-companies` | Manhattan | NAICS 551 (should be 404 — non-applicable) |
| `/us/us-06-085/web-mobile-dev-shops` | Santa Clara | NAICS 5415 (existing) |
| `/us/us-25-025/social-assistance` | Suffolk | NAICS 624 (new) |
| `/us/us-12-086/scenic-transportation` | Miami-Dade | NAICS 487 (new) |
| `/us/us-53-033/waste-management` | King County | NAICS 562 (new) |

For each:
- New NAICS-3 codes should render with real data
- Non-applicable codes (e.g. 551) should 404 cleanly
- All other existing cells continue to work (no regression)

---

## 7 · Verification gate (combined C.1 + C.3)

| Check | Pass criterion |
|---|---|
| Canada row count | ≥ 12,000 |
| Canada spot-check | 5/5 URLs render with real data |
| US Census row count | ≥ 140,000 |
| US spot-check | 8/8 URLs render correctly (including 404 for non-applicable) |
| Coverage tier distribution | Mostly 'P' for both |
| Sitemap | Includes new US county × NAICS-3 cells |
| RAM peak in either run | < 600 MB |
| `progress.json` preserved | Yes |

When all eight pass: **C is DONE.** Move to Track D.

---

## 8 · Time estimate

| Task | Time |
|---|---|
| C.1 Canada retry (script edit + run + verify) | 2 hours |
| C.2 Canada spot-check | 15 min |
| C.3 US re-execute (mostly waiting on background) | 2.5 hours wall + 30 min active |
| C.4 US spot-check | 30 min |
| **Total active engineering** | ~3 hours |
| **Total wall-time** | ~5 hours |

---

## 9 · What this unlocks

Beyond the row count: better SEO discoverability for ~60 new
industry × county pages × all 1,700 counties.

Also: every featured tile / search result that uses the new
industries gets fresh data.
