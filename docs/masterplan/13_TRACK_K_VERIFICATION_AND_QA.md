# 13 · Track K — Verification + QA

> Per-track gates run in flight (already covered in each track's
> own file). This track is the **final sweep** — across-track
> verification + smoke test + final report.

---

## 1 · Goal

Confirm every track lands correctly and the new state of the
product is consistent.

Critically: produce a final report that the founder can read in 5
minutes to know what landed.

---

## 2 · Targets

| Task | Target | Gate |
|---|---|---|
| K.1 Per-track row count delta | Matches expected from Track 01 | Each track's gate already verified |
| K.2 Smoke test 200 random URLs | ≥ 95% pass | Test script output |
| K.3 Taxonomy CI | Passes | `verify_taxonomy.ts` exit 0 |
| K.4 TypeScript | Clean | `tsc --noEmit` exit 0 |
| K.5 Coverage tier distribution | Matches expectation per phase | Tier distribution query |
| K.6 Final report | Written to `docs/ingest/FINAL_REPORT_v2.md` | File exists |
| K.7 Commit message | Includes summary numbers | Commit log |

---

## 3 · T-K.1 · Per-track row count summary

Pull from Supabase the row count per country, then compute deltas
from the baseline in `docs/handoff/04_CURRENT_STATE.md`.

### Helper script

`scripts/audit_regional_coverage.py`:

```python
"""Audit current regional_cells state per country + per industry."""
import os, requests, json
from collections import Counter

SUPABASE = "https://npfqasdghbffqgmzgxzr.supabase.co"
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
H = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"}

# Total
r = requests.head(f"{SUPABASE}/rest/v1/regional_cells?select=country",
                  headers={**H, "Prefer": "count=exact"})
total = int(r.headers["content-range"].split("/")[-1])
print(f"Total regional_cells: {total:,}")

# Per country
COUNTRIES = ["US", "DE", "FR", "IT", "ES", "PL", "NL", "SE", "JP", "BR", "CA",
             "GB", "AU", "NZ", "MX", "AR", "CL", "CO", "PE", "KR", "IL", "CN", "IN", "RU"]
for iso in COUNTRIES:
    r = requests.head(f"{SUPABASE}/rest/v1/regional_cells?country=eq.{iso}&select=country",
                      headers={**H, "Prefer": "count=exact"})
    n = int(r.headers["content-range"].split("/")[-1])
    if n > 0:
        print(f"  {iso}: {n:,}")

# Per coverage tier
for tier in ["P", "S", "M", "T", "X"]:
    r = requests.head(f"{SUPABASE}/rest/v1/regional_cells?coverage_tier=eq.{tier}&select=country",
                      headers={**H, "Prefer": "count=exact"})
    n = int(r.headers["content-range"].split("/")[-1])
    print(f"  tier {tier}: {n:,}")
```

Save output to `delivery/regional/audit_post_sweep.txt`.

---

## 4 · T-K.2 · Smoke test on 200 random URLs

### Script

`scripts/test/regional_smoke_test.py`:

```python
"""Smoke-test 200 random regional_cells URLs against production."""
import os, requests, random
from urllib.parse import quote

SUPABASE = "https://npfqasdghbffqgmzgxzr.supabase.co"
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
BASE = "https://marginatlas-web-twtl.vercel.app"
H = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"}

# Pull 200 random cells weighted by quality_score
r = requests.get(f"{SUPABASE}/rest/v1/regional_cells"
                 f"?select=country,geo_id,geo_name,industry_id,coverage_tier"
                 f"&n_enterprises=gte.5"
                 f"&order=quality_score.desc"
                 f"&limit=2000",
                 headers=H)
candidates = r.json()
sample = random.sample(candidates, min(200, len(candidates)))

def slugify_geo(geo_id, geo_name):
    """Derive URL slug from geo_id or geo_name."""
    # Pattern depends on country; use lowercased geo_id as a safe default
    return geo_id.lower()

def slugify_industry(industry_id):
    return industry_id.replace("_", "-")

passes, fails = [], []
for cell in sample:
    url = f"{BASE}/{cell['country'].lower()}/{slugify_geo(cell['geo_id'], cell['geo_name'])}/{slugify_industry(cell['industry_id'])}"
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200 and "<h1" in r.text and "Coming soon" not in r.text:
            passes.append(url)
        else:
            fails.append((url, r.status_code, "no h1" if "<h1" not in r.text else "coming soon"))
    except Exception as e:
        fails.append((url, "ERR", str(e)))

print(f"Pass: {len(passes)}/{len(sample)} ({100*len(passes)/len(sample):.1f}%)")
print(f"Fails ({len(fails)}):")
for url, status, why in fails[:20]:  # show first 20
    print(f"  {status} {url} — {why}")
```

### Pass criterion

≥ 190 of 200 pass (95%).

If 90-95%: investigate the failures; classify (slug bug, missing
data, route bug) and fix the highest-frequency cause.

If < 90%: stop. Something is structurally wrong. Diagnose before
moving to Track L.

---

## 5 · T-K.3 · Taxonomy CI

```bash
cd E:\atlas\website
npx tsx scripts/verify_taxonomy.ts
```

Expected: `✓ Taxonomy verification passed`.

If fails: do not commit Track L. Fix the taxonomy issue first.

Common failures after Tracks B + D + I:

- A new industry's `sector_id` doesn't match any sector
- First 3 sectors changed order accidentally
- A new sub-niche's `parent_id` doesn't resolve
- A new Pro-only sector accidentally has `audience_default: "visible"`

---

## 6 · T-K.4 · TypeScript clean

```bash
cd E:\atlas\website
npx tsc --noEmit
```

Expected: no output.

If errors: fix or revert the offending change.

---

## 7 · T-K.5 · Coverage tier distribution

Verify each track's coverage tier matches what was promised:

| Phase / track | Expected tier | Confirm via |
|---|---|---|
| C (US Census) | Mostly 'P' | Query country=US, coverage_tier='P' count |
| C (Canada) | All 'P' | Query country=CA, tier distribution |
| D (NL/ES/IT) | All 'P' | Per-country tier distribution |
| E (UK) | All 'P' | Query country=GB |
| F (OECD) | All 'S' | Query coverage_source='Cross-country economic indicators' |
| G (AU/NZ) | All 'P' | Per-country tier |
| H (FR Sirene) | All 'P' | Query country=FR, geo_level=commune |
| I (LATAM) | Mostly 'P', some 'S' | Per-country tier |

Run a single query for the full distribution:

```python
import requests, os
SUPABASE = "https://npfqasdghbffqgmzgxzr.supabase.co"
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
H = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"}

# Per (country, tier) crosstab
for country in ["US","CA","NL","ES","IT","GB","AU","NZ","FR","MX","AR","CL","CO","PE","KR","IL"]:
    r = requests.get(f"{SUPABASE}/rest/v1/regional_cells"
                     f"?country=eq.{country}&select=coverage_tier",
                     headers={**H, "Prefer": "count=exact"})
    from collections import Counter
    tiers = Counter([row["coverage_tier"] for row in r.json()])
    print(f"  {country}: {dict(tiers)}")
```

If a country has unexpected mixed tiers (e.g. UK should be all 'P'
but shows 50% 'S'): investigate the offending ingest.

---

## 8 · T-K.6 · Final report

### File

`E:\atlas\website\docs\ingest\FINAL_REPORT_v2.md`

### Template

```markdown
# Sweep Complete — <DATE>

## 1 · Headline numbers

- Total `regional_cells`: <N> (was 179,409; delta +<DELTA>)
- Countries with measured sub-national data: <N> (was ~70; delta +<DELTA>)
- Tracks landed: B, C, D, E, F, G, [H], I, J
- Tracks blocked: <list>

## 2 · Per-track summary

| Track | Goal | Result | Delta to baseline |
|---|---|---|---|
| B (NAICS) | 73 → 250 codes | Landed | +N codes |
| C (NA) | CA +12k, US +50k | Landed | +<N> rows |
| D (EU LAU) | +70k | Landed | +<N> rows |
| E (UK) | +30k | Landed | +<N> rows |
| F (OECD) | +8k | Landed | +<N> rows |
| G (Anglo) | +22k | Landed | +<N> rows |
| H (France) | +60k | [Landed | Blocked on A.4] | +<N> rows |
| I (LATAM) | +25k | Landed | +<N> rows |
| J (Frontend) | Sitemap + badges | Landed | n/a |

## 3 · Spot-check pass rate

Smoke test on 200 random URLs: <N>/200 (<%>)

## 4 · Coverage tier breakdown

(Per-country, per-tier table from K.5 query)

## 5 · Known issues / follow-ups

- (Anything that didn't quite land cleanly)

## 6 · Founder action items remaining

(Anything that was blocked on founder during this sweep)

## 7 · Recommended next sweep

(Highest-yield items not in this sweep)
```

---

## 9 · T-K.7 · Final commit

```bash
git add docs/ingest/FINAL_REPORT_v2.md docs/masterplan/PROGRESS.md
git commit -m "$(cat <<'EOF'
sweep: master plan complete — regional_cells <N>, +<DELTA> rows

Tracks landed: B, C, D, E, F, G, [H], I, J
Smoke-test pass rate: <%>
See docs/ingest/FINAL_REPORT_v2.md for per-track summary.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
git push origin main
```

---

## 10 · Verification gate

| Check | Pass criterion |
|---|---|
| K.1 Per-country counts | All match expected from §01 |
| K.2 Smoke test | ≥ 95% pass |
| K.3 Taxonomy CI | Clean |
| K.4 TypeScript | Clean |
| K.5 Coverage tier distribution | Matches per-track expectation |
| K.6 Final report | Exists at `docs/ingest/FINAL_REPORT_v2.md` |
| K.7 Final commit | Pushed to origin/main |
| Vercel auto-deploy | Green |

When all eight pass: **K is DONE.** Move to Track L.

---

## 11 · Time estimate

| Task | Time |
|---|---|
| K.1 Per-country counts | 15 min |
| K.2 Smoke test (200 URLs) | 30 min (most is wait for HTTP) |
| K.3 + K.4 CI runs | 5 min |
| K.5 Tier distribution | 15 min |
| K.6 Final report write | 1 hour |
| K.7 Commit + push | 10 min |
| **Total** | ~2.5 hours |

---

## 12 · What this unlocks

- Founder has a single 5-minute read to know what landed
- Issues caught before they're discovered by users
- Sitemap submission to Search Console becomes safe (no dead URLs)
- Baseline for the next sweep's targets

---

## 13 · If smoke test fails

If the 200-URL smoke test pass rate < 95%, this is the diagnostic
loop:

1. Classify failures: route 404, "Coming soon", empty render, slow render
2. Pick the most common failure class
3. Pick one URL in that class
4. Manually inspect: query Supabase directly, walk `getCellBySlug`, check slug derivation
5. Identify root cause:
   - **Slug mismatch**: geo_id format differs from URL slug expected by `getCellBySlug`
   - **Missing data**: cell exists in DB but with all null measures
   - **Wrong industry_id**: a new sub-niche from Track B has no fallback
   - **Routing bug**: `[country]/[geo]/[industry]/page.tsx` returns notFound() for valid cells
6. Fix the root cause
7. Re-run smoke test on the same 200 URLs (cache the URL list)
8. If pass rate jumps to ≥ 95%: proceed
9. If not: repeat for next failure class

Do not ship K if smoke test < 95%. Better to delay than to ship
known-broken pages.
