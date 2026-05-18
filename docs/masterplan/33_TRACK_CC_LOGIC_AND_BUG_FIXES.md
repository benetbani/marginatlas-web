# 33 · Track CC — Logic Improvements + Bug Fixes

> Existing slug-resolution bug surfaced multiple times. CDMX cells say
> "Municipio 015" instead of "Cuauhtémoc". Smart 404 handling missing.
> Error boundaries inconsistent. This track fixes the accumulated debt.

---

## 1 · Goal

Fix the known-but-deferred bugs and tighten the data-layer logic so
edge cases behave correctly. No new features, just sharper foundations.

---

## 2 · Bug fixes

### CC.1 — Slug-to-industry resolution bug

**Symptom**: `/de/munich/metal-products-mfg` resolves to "Mining &
quarrying" (wrong industry). `/gb/camden/cafes-coffee` resolves to
"Food & beverage manufacturing".

**Root cause**: `slugToIndustry()` in `taxonomy.ts` does
`s.includes(k) || k.includes(s)` matching, which causes the FIRST
industry with any matching keyword to win.

**Fix**:
1. Build a precomputed `SLUG_TO_INDUSTRY_ID` map at module load that
   maps `industryToSlug(ind.id)` → `ind.id` directly. Exact match wins.
2. Fall through to current fuzzy matching only when exact fails.
3. Add explicit aliases for known ambiguous slugs (e.g.
   `cafes-coffee → cafes_coffee` not `coffee_roasters`).

Effort: 2 hr.

### CC.2 — Mexico CDMX alcaldía names

**Symptom**: `/mx/cuauhtemoc/restaurants` page title says "Municipio
015, Ciudad de México" instead of "Cuauhtémoc, Ciudad de México".

**Root cause**: MX pipeline (Track I.1) didn't use INEGI's
`tc_entidad_municipio.csv` lookup. Wrote rows with generic
"Municipio NNN" names.

**Fix**:
1. Update `scripts/ingest/mx_inegi/fetch.py` to use the municipality
   lookup that's already in the script (was loaded but only for
   geo_name; need to verify it's actually applied).
2. Run a SQL UPDATE (via PostgREST PATCH) on existing rows to rewrite
   the geo_name field per the lookup.

Effort: 1.5 hr.

### CC.3 — Country signature emoji fallback

**Symptom**: Some new country signatures use 🏬 fallback emoji
instead of country-specific one.

**Fix**: Update `COUNTRY_SIGNATURE` in `[country]/page.tsx` to use
country-relevant emojis (🦘 AU is already there; add 🐘 IN, 🐉 CN,
🌅 JP, 🎴 KR, etc.).

Effort: 1 hr.

### CC.4 — Histogram tail clipping

**Symptom**: For cells with very high p90/p10 ratio (long-tail
distributions), the histogram's rightmost bars get cut off.

**Fix**: In `DistributionHistogram.tsx`, increase `tailAbove`
multiplier from 0.6 to 1.0 for cells where p90 > 5 × p50. Also clamp
maxH to 90th percentile of bar heights (so a single huge bar doesn't
crush all others).

Effort: 1.5 hr.

### CC.5 — Tax overlay shows $0 payroll for cells without data

**Symptom**: Cells from Wave 3 city overlay (tier X) have `payroll =
null`. Tax overlay shows "Payroll: $0", which looks wrong.

**Fix**: In `PostTaxToggle.tsx`, when payroll is null, hide the
employer social row + show a small "Payroll data not available for
this cell" note. Compute owner take-home as gross - cit_rate × gross
in that case.

Effort: 45 min.

### CC.6 — Edge middleware false positives

**Symptom**: Some legitimate users with privacy-focused browsers get
403'd by the bare-scraper check (missing Accept-Language).

**Fix**: Soften the check — only block if BOTH Accept-Language is
missing AND User-Agent contains common bot patterns (curl, wget,
python-requests, scrapy). Whitelist Brave / Firefox no-tracking modes.

Effort: 1 hr.

### CC.7 — Cell page fallback chain when industry unmapped

**Symptom**: When a sub-niche industry has no parent data AND no
fallback, `getCellBySlug` returns null → 404.

**Fix**: Final fallback to country-level extrapolated_cells for the
*sector* (instead of industry). Render with a "Showing sector
average" chip.

Effort: 1.5 hr.

### CC.8 — Smart 404 with suggestions

**Symptom**: 404 page shows generic "page not found" with no
suggestions.

**Fix**: When a cell URL 404s, fuzzy-match the slug components to
suggest the closest valid URL:
- "Did you mean /us/california/restaurants?"
- "Or try /us/california to see all California cells"

Effort: 2 hr.

### CC.9 — Error boundaries

**Symptom**: Any uncaught error in a server component crashes the
whole page.

**Fix**: Wrap key page sections (cell histogram, tax overlay,
across-states-strip) in error boundaries that render a small
fallback note instead.

Effort: 1.5 hr.

### CC.10 — Adaptive breadcrumb

**Symptom**: Breadcrumb assumes country → state → cell. New URLs
(country → city → neighborhood → industry, or country → industry
direct) have inconsistent breadcrumb behavior.

**Fix**: Generalize `<Breadcrumbs>` to accept arbitrary level depth
and adapt rendering. Collapse skipped levels with "···".

Effort: 1 hr.

---

## 3 · Logic improvements

### CC.11 — Industry slug aliases

Add a `INDUSTRY_SLUG_ALIASES` map to handle common misspellings:
- "restaurant" → "restaurants" industry
- "lawyer" → "legal_services"
- "cafe" → "cafes_coffee"
- "tax accountant" → "accounting_tax"
- etc. ~50 aliases

Effort: 1 hr.

### CC.12 — Better URL canonicalization

When user lands on `/us/CALIFORNIA/RESTAURANTS` (uppercase), redirect
to lowercase canonical. When trailing slash present, redirect to no-slash.

Effort: 1 hr.

### CC.13 — Empty state handling per page

When `/us/wyoming/management-consulting` has no measured data,
currently shows "Open for full numbers →" but no clear next-best action.

Fix: render a "Closest match" card pointing at the most relevant
neighbor cell + "expand search" CTAs.

Effort: 1.5 hr.

---

## 4 · Steps + effort

| Step | Effort | Critical? |
|---|---|---|
| CC.1 Slug resolution bug | 2 hr | HIGH |
| CC.2 CDMX alcaldía names | 1.5 hr | MED |
| CC.3 Country emojis | 1 hr | LOW |
| CC.4 Histogram tail clipping | 1.5 hr | MED |
| CC.5 Tax overlay null payroll | 45 min | MED |
| CC.6 Middleware false positives | 1 hr | LOW |
| CC.7 Sector fallback chain | 1.5 hr | MED |
| CC.8 Smart 404 | 2 hr | MED |
| CC.9 Error boundaries | 1.5 hr | HIGH |
| CC.10 Adaptive breadcrumb | 1 hr | LOW |
| CC.11 Industry slug aliases | 1 hr | LOW |
| CC.12 URL canonicalization | 1 hr | LOW |
| CC.13 Empty state per page | 1.5 hr | LOW |
| **Total** | **~17 hr** | |

---

## 5 · Verification gate

- All 13 fixes verified live on staging/dev
- Smoke test on 200 random URLs: ≥ 98% pass rate (up from current ~95%)
- `tsc` strict mode: 0 errors
- Error rate in Vercel logs drops post-deploy

---

## 6 · What this unlocks

Less time debugging in future sessions. Users hit fewer dead-ends.
The "professional" feel of the site goes up materially.
