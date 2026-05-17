# 12 · Verification URLs and Spot-Check Commands

> Concrete URLs and commands to verify the site is working. Use these
> after any deploy or ingest run.

---

## 1 · Base URLs

| Purpose | URL |
|---|---|
| Production (when DNS fixed) | `https://marginatlas.com` |
| Vercel preview (always works) | `https://marginatlas-web-twtl.vercel.app` |
| Supabase REST | `https://npfqasdghbffqgmzgxzr.supabase.co/rest/v1` |

The Vercel preview URL is the fallback while DNS is broken (B-001).
All verification URLs below use the base URL of your choice — for
this doc, replace `BASE` with whichever URL is working.

---

## 2 · Smoke test sequence (run after any deploy)

```bash
# 1. Home page loads
curl -sI -L https://marginatlas-web-twtl.vercel.app/ | head -3
# expect: HTTP/1.1 200 OK

# 2. Cell page loads and renders <h1>
curl -s https://marginatlas-web-twtl.vercel.app/us/california/restaurants \
  | grep -c '<h1'
# expect: 1 or more

# 3. Sitemap accessible
curl -sI https://marginatlas-web-twtl.vercel.app/sitemap.xml | head -3
# expect: HTTP/1.1 200 OK

# 4. robots.txt blocks AI crawlers
curl -s https://marginatlas-web-twtl.vercel.app/robots.txt | grep -A1 GPTBot
# expect: "Disallow: /"

# 5. AI crawler is blocked at edge
curl -sI -A "GPTBot" https://marginatlas-web-twtl.vercel.app/ | head -1
# expect: HTTP/1.1 451 (or similar non-200)

# 6. Rate limit triggers
for i in {1..65}; do curl -so /dev/null -w "%{http_code}\n" https://marginatlas-web-twtl.vercel.app/; done
# expect: first 60 → 200, then → 429 (or 429 may appear sooner if you ran tests earlier this minute)
```

---

## 3 · Phase 1 EU NUTS (43,903 rows)

These should render measured data, not country-level extrapolation:

| URL | Geography | Industry |
|---|---|---|
| `/de/de21/restaurants` | Oberbayern (NUTS-2, Bavaria) | restaurants |
| `/de/de212/restaurants` | Munich Stadt (NUTS-3) | restaurants |
| `/fr/fr10/cosmetics-shops` | Île-de-France | cosmetics_shops |
| `/fr/fr101/restaurants` | Paris département (NUTS-3) | restaurants |
| `/it/itc4/clothing-stores` | Lombardia | clothing_stores |
| `/it/itc4c/jewelry-stores` | Milan (NUTS-3) | jewelry_stores |
| `/es/es51/hotels-lodging` | Cataluña | hotels_lodging |
| `/es/es511/restaurants` | Barcelona | restaurants |
| `/pl/pl12/software-development` | Mazowieckie (Warsaw region) | software_development |
| `/nl/nl3/management-consulting` | Western Netherlands | management_consulting |
| `/se/se11/web-mobile-dev-shops` | Stockholm region | software_development |

Spot-check by viewing the page — should show:
- Hero with industry name + region
- AtlasScore card with a number
- TypicalFirmCard with firms / employees / wage
- DistributionHistogram with bars
- QualityBadge showing 3-4 stars ("Modeled" or "Secondary")
- Source label = "European business statistics"

---

## 4 · Phase 8 Japan e-Stat (6,951 rows)

| URL | Geography | Industry |
|---|---|---|
| `/jp/jp-13000/restaurants` | Tokyo prefecture | restaurants |
| `/jp/jp-27100/cafes-coffee-shops` | Osaka | cafes_coffee_shops |
| `/jp/jp-26100/hotels-lodging` | Kyoto | hotels_lodging |
| `/jp/jp-23100/auto-repair-shops` | Nagoya | auto_repair_shops |
| `/jp/jp-01100/food-beverage-mfg` | Sapporo | food_beverage_mfg |

Source label = "National business census". 5 stars on Tokyo
prefecture (Primary tier).

---

## 5 · Phase 10 US Census counties (87,573 rows)

| URL | Geography | Industry |
|---|---|---|
| `/us/us-06-037/restaurants` | Los Angeles County | restaurants |
| `/us/us-17-031/legal-services` | Cook County (Chicago) | legal_services |
| `/us/us-48-201/auto-repair-shops` | Harris County (Houston) | auto_repair_shops |
| `/us/us-06-085/software-development` | Santa Clara (Silicon Valley) | software_development |
| `/us/us-25-025/management-consulting` | Suffolk County (Boston) | management_consulting |
| `/us/us-12-086/hotels-lodging` | Miami-Dade | hotels_lodging |
| `/us/us-36-061/real-estate-agencies` | Manhattan | real_estate_agencies |
| `/us/us-53-033/web-mobile-dev-shops` | King County (Seattle) | web_mobile_dev_shops |

Source label = "National business statistics". 5 stars. Should show
real n_enterprises + n_employees + payroll_per_employee.

---

## 6 · Phase 15 Brazil IBGE (2,317 rows)

| URL | Geography | Industry |
|---|---|---|
| `/br/br-sp/restaurants` | São Paulo state | restaurants |
| `/br/br-rj/cafes-coffee-shops` | Rio de Janeiro state | cafes_coffee_shops |
| `/br/br-mg/clothing-stores` | Minas Gerais | clothing_stores |
| `/br/br-rs/web-mobile-dev-shops` | Rio Grande do Sul | software_development |
| `/br/br-city-sao-paulo/restaurants` | São Paulo city | restaurants |
| `/br/br-city-rio-de-janeiro/cafes-coffee-shops` | Rio city | cafes_coffee_shops |
| `/br/br-city-curitiba/management-consulting` | Curitiba | management_consulting |

Source label = "National business statistics" (for states) or
"Estimated from city share of state activity" (for cities). 4-5
stars for states, 2 stars for cities (tier 'X').

---

## 7 · Phase 18 Global city overlay (41,448 rows)

| URL | Geography | Industry |
|---|---|---|
| `/us/city/new-york/restaurants` | New York City | restaurants |
| `/us/city/los-angeles/cafes-coffee-shops` | LA | cafes_coffee_shops |
| `/cn/city/shanghai/restaurants` | Shanghai | restaurants |
| `/cn/city/beijing/web-mobile-dev-shops` | Beijing | software_development |
| `/in/city/mumbai/web-mobile-dev-shops` | Mumbai | software_development |
| `/in/city/bangalore/custom-software-contract` | Bangalore | custom_software_contract |
| `/ru/city/moscow/restaurants` | Moscow | restaurants |
| `/au/city/sydney/cafes-coffee-shops` | Sydney | cafes_coffee_shops |
| `/mx/city/mexico-city/restaurants` | Mexico City | restaurants |
| `/eg/city/cairo/hotels-lodging` | Cairo | hotels_lodging |
| `/za/city/johannesburg/restaurants` | Johannesburg | restaurants |

Source label = "Estimated from city share of national activity". 2
stars (tier 'X'). Quality_score around 37.

---

## 8 · Sub-niche → parent fallback verification

Sub-niches that don't have direct data but resolve via PARENT_FALLBACK_MAP:

| URL | Sub-niche | Falls back to |
|---|---|---|
| `/de/de212/boutique-clothing` | boutique_clothing | clothing_stores → textile_apparel_mfg |
| `/fr/fr101/jewelry-stores` | jewelry_stores | clothing_stores → textile_apparel_mfg |
| `/us/us-06-037/hair-salons` | hair_salons | cleaning_services |
| `/us/us-06-037/auto-repair-shops` | auto_repair_shops | motor_vehicles_mfg |

These should render with a slightly lower tier badge but still show
real numbers (from the fallback parent).

---

## 9 · Pro-only sectors (hidden by default)

```bash
# Default visit — Banking absent
curl -s https://marginatlas-web-twtl.vercel.app/sectors | grep -c 'Banking'
# expect: 0

# With ?pro=1 — Banking visible
curl -s 'https://marginatlas-web-twtl.vercel.app/sectors?pro=1' | grep -c 'Banking'
# expect: 1
```

Try in browser too:

- `https://marginatlas-web-twtl.vercel.app/sectors` — should show 20 sector tiles, NO banking/oil/pharma/telecom
- `https://marginatlas-web-twtl.vercel.app/sectors?pro=1` — should show 25 sector tiles INCLUDING the 5 Pro-only

---

## 10 · Country landing pages

| URL | Status |
|---|---|
| `/us` | ✅ Full coverage (states from cells_master + counties from regional_cells) |
| `/de` | ✅ EU NUTS coverage from Phase 1 |
| `/fr` | ✅ EU NUTS coverage from Phase 1 |
| `/it` | ✅ EU NUTS coverage from Phase 1 |
| `/es` | ✅ EU NUTS coverage from Phase 1 |
| `/jp` | ✅ Prefecture + municipality from Phase 8 |
| `/br` | ✅ States + cities from Phase 15 |
| `/ru` | ✅ City overlay only (Phase 18) |
| `/ke` | ✅ City overlay only (Phase 18) |

Each should show:
- Flag emoji + country name + coverage tier badge
- Signature line (curated per-country)
- Top SMB industries grid with quick stats
- Compare CTA

---

## 11 · Compare page

```
https://marginatlas-web-twtl.vercel.app/compare
```

Should:
- Default to 4 cells (California restaurants, Texas restaurants, New York real estate, Florida hairdressers)
- Show real numbers in the comparison table
- Allow changing country, region, industry per slot
- Hit `/api/cell-lookup` per slot change

---

## 12 · /you (Compare-to-me)

```
https://marginatlas-web-twtl.vercel.app/you
```

Should:
- Show industry + region picker on left
- Show numeric inputs (revenue, employees) below
- After typing numbers: show percentile rank + revenue-vs-typical + headcount-vs-typical
- "Numbers stay in your browser" disclosure visible

---

## 13 · Random cell

```bash
curl -sI -L https://marginatlas-web-twtl.vercel.app/random
# expect: 307 redirect to a real cell URL
```

Each visit should redirect to a different popular cell (rotates
hourly via deterministic seed).

---

## 14 · CSV export

```bash
curl -s -o /tmp/test.csv \
  'https://marginatlas-web-twtl.vercel.app/api/export-csv?country=us&region=california&industry=restaurants'
head -10 /tmp/test.csv
```

Should produce a CSV starting with:

```
# Margin Atlas — exported 2026-XX-XX
# Source: marginatlas.com/us/california/restaurants
# Free-tier export. Cite Margin Atlas when used in published work.

country,region,industry,year,size_band,n_enterprises,...
US,California,Restaurants,2022,total,...
```

---

## 15 · API responses

```bash
# Cell snapshot (used by FeaturedCellTile)
curl -s 'https://marginatlas-web-twtl.vercel.app/api/cell-snapshot?country=us&geo=california&industry=restaurants' | head -1
# expect: JSON with { found: true, revenue_per_firm, n_enterprises, ... }

# Popular cell snapshot (used by FirstFrameStrip)
curl -s 'https://marginatlas-web-twtl.vercel.app/api/popular-cell-snapshot' | head -1
# expect: JSON with { found: true, industry, geo, revenue_per_firm, ... }

# Cell lookup (used by /compare and /you)
curl -s 'https://marginatlas-web-twtl.vercel.app/api/cell-lookup?country=US&industry=restaurants&region=california' | head -1
# expect: JSON with { cell: { revenue_per_firm, n_enterprises, employees_per_firm, ... } }

# Ask (preview-stub until ANTHROPIC_API_KEY in Vercel)
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"question":"How much do restaurants earn in California?"}' \
  https://marginatlas-web-twtl.vercel.app/api/ask
# expect (current): { answer: "...preview...", preview: true }
# after key live: { answer: "(real Claude response)", toolCalls: N, preview: false }
```

---

## 16 · Supabase direct queries (for ingest verification)

```bash
# Total row count
curl -s 'https://npfqasdghbffqgmzgxzr.supabase.co/rest/v1/regional_cells?select=country&limit=1' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: count=exact" \
  -I 2>&1 | grep -i content-range
# expect: Content-Range: 0-0/179409

# US row count
curl -s 'https://npfqasdghbffqgmzgxzr.supabase.co/rest/v1/regional_cells?country=eq.US&select=country&limit=1' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: count=exact" \
  -I 2>&1 | grep -i content-range
# expect: Content-Range: 0-0/87573

# Spot-check a specific cell
curl -s 'https://npfqasdghbffqgmzgxzr.supabase.co/rest/v1/regional_cells?country=eq.JP&geo_id=eq.JP-13000&limit=5' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY"
# expect: 5 rows of Tokyo prefecture data
```

---

## 17 · Verification after each ingest run

After running a new ingest pipeline, run all of these:

1. **Row count delta:** Query Supabase for the country's row count before and after; confirm it grew by approximately the expected amount.
2. **Spot-check 3 specific URLs:** Pick 3 from the cell list above for that phase; load them; confirm they render with real data (not extrapolation fallback).
3. **Quality tier distribution:** Query the new rows by `coverage_tier`; confirm the distribution matches expectation (e.g. US Census = mostly 'P', city overlay = all 'X').
4. **RAM peak:** Check that `ram_guard` logged a peak under 600 MB.
5. **TypeScript check:** `npx tsc --noEmit` — no errors.
6. **Taxonomy check:** `npx tsx scripts/verify_taxonomy.ts` — passes.
7. **Update scoreboard:** Edit `docs/ingest/19_VERIFICATION_QUALITY.md` with new totals.
8. **Commit + push:** Standard pattern, includes the row count in commit message.

---

## 18 · How to verify a NEW cell type loads end-to-end

When you ingest a new country / geo level / industry, this is the
end-to-end test:

1. **Pick one specific (country, geo, industry).** E.g. "Phase 7 UK NOMIS landed; pick `gb-westminster` + `legal-services`."
2. **Query Supabase directly:**
   ```bash
   curl -s 'https://npfqasdghbffqgmzgxzr.supabase.co/rest/v1/regional_cells?country=eq.GB&geo_id=eq.GB-E09000033&industry_id=eq.legal_services' \
     -H "apikey: $SUPABASE_SERVICE_ROLE_KEY"
   ```
   Expect: 1 row.
3. **Load the page URL:**
   - The slug for "Westminster" needs to be derived from the geo_name field
   - URL: `https://marginatlas-web-twtl.vercel.app/gb/westminster/legal-services`
   - Or: `https://marginatlas-web-twtl.vercel.app/gb/gb-e09000033/legal-services`
4. **Check the rendered page:**
   - Hero shows industry + region
   - QualityBadge shows tier (e.g. 'P' = 5 stars)
   - TypicalFirmCard has real numbers
   - DistributionHistogram has bars
   - No "Coming soon" or fallback warning

If any of these fail, debug:

- The slug resolution in `getCellBySlug` may not match the geo_name slug
- The fallback chain may be wrong (PARENT_FALLBACK_MAP or extrapolated_cells)
- The cell may genuinely have no data and be falling through to extrapolation
