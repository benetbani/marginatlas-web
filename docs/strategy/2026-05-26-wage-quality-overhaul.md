# Wage data quality overhaul

Date: 2026-05-26.
Trigger: founder reality check — "you put Albania at $400 while in
reality it is around $1,000 USD. Do this for all countries of the
world."

## What was wrong

Country profile median wages were systematically too low for emerging
markets, especially Eastern Europe. Sample of original vs reality:

| Country | Old median (atlas) | Real 2024 | Error |
|---|---|---|---|
| Albania | $561/mo | $1,000/mo | -44% |
| Romania | $1,000/mo | $1,400/mo | -29% |
| Poland | $1,500/mo | $1,900/mo | -21% |
| Czechia | (similar) | (similar) | — |
| Tirana (city) | $425/mo | $950/mo | -55% |

The root causes:
1. Original tier B/C derivation used `GDP/cap nominal × productivity
   index` which under-counts informal economy income.
2. No vintage adjustment — anchor was 2020-2021 baseline; wages have
   risen 20-40% nominal since in Eastern Europe.
3. No informal-economy uplift — countries where 30-60% of work is
   informal (most of Africa, LatAm, South Asia) report only formal-
   sector wages in the official stats, missing the felt income.
4. Stale GDP/cap nominal values cascaded into wage derivation.

## What the overhaul does

### New file: `data/economics/median_monthly_wage_usd_v1.json`

Hand-anchored median monthly gross wage in USD for 200 countries,
anchored to 2024-2025 publications from national stats agencies +
ILO + Schneider shadow-economy estimates, with growth applied to
the 2026 horizon.

Each entry carries `source_quality`:
- **A** (~60 countries): hand-anchored from a national statistical
  agency publication or ILO wage database within 24 months. The
  number a local resident would quote as the average monthly gross.
- **B** (~80 countries): anchored from a secondary source (OECD
  aggregate, regional-cluster median, ILO when national agency is
  not granular) or 24-48 months old.
- **C** (~60 countries): GDP-per-capita-derived with labor share +
  informal-economy uplift. No direct wage observation.

### Updated: `data/economic_indicators/country_profile_v2.json`

`scripts/data/recompute_wages_from_median.ts` pushes the new monthly
× 12 into `median_wage_full_time_usd`, plus derives:
- `wage_p25_usd` = median × 0.65 (the typical p25 / median ratio)
- `wage_p75_usd` = median × 1.55
- `minimum_wage_annual_usd` = max(existing, median × 0.45)

196 of 197 countries got updated values.

### Updated: `data/cities/city_list_v1.json`

All 252 cities recomputed:
```
city_wage = country_median_monthly × 12 × city_tier_multiplier
```

City tier multipliers (deliberately conservative):
- Tier 1 (top 20 mega-metros): **1.25** — NYC, SF, London, Tokyo etc.
- Tier 2 (next 50): **1.05**
- Tier 3 (smaller 130): **0.95**

Why 1.25 and not 1.45 like the first pass: across the 20 tier-1
cities the wage premium over national varies hugely. NYC, SF, San
Jose, London, Singapore pay 30-70% above national; Berlin, Rome,
Madrid pay AT OR BELOW national. 1.25 is the honest middle.
True premium cities get under-counted by ~15%; under-paid tier-1s
(Berlin) get over-counted by ~25%. Worse outliers than per-city
data, but better than the original 1.45.

## Quality checks (3 gates)

### Gate 1: tier-aware wage/GDP ratio bounds

```
GDP/cap nominal range  |  acceptable wage/GDP ratio range
$0 – $2,000  (LDC)     |  0.3 – 4.5   (subsistence + informal high)
$2,000 – $10,000       |  0.4 – 2.5
$10,000+               |  0.4 – 1.8
```

Why tier-aware: LDC formal GDP undercounts subsistence + informal
income, so wage-to-GDP ratios of 2.5-4.0 are normal there. In mature
economies, GDP captures most income, so wage/GDP rarely exceeds 1.5.

### Gate 2: absolute bounds

- $50/mo poverty floor (below this, the formal wage is meaningless
  because the economy is collapsed / war / subsistence)
- $15,000/mo ceiling (above this implies CEO data leaked in)

### Gate 3: city ratio bounds

City wage between 0.6× and 1.7× country baseline. Outside this range
implies either wrong tier classification or a city-specific data
problem.

### Current state

Running `scripts/verify_wage_quality.ts`:
- Hard failures: **0**
- Warnings: **2** (both are stale GDP/cap in country profile, not
  wage problems: ZA wage $1,400/mo against stale GDP/cap $6,300;
  CU wage $200/mo against stale GDP/cap $9,500)

## Informal economy uplift methodology

For LDCs and lower-middle income countries where Schneider 2010-2024
shadow-economy estimates exceed 35% of GDP, the wage value reflects:

```
median_monthly_wage = formal_sector_wage × (1 + informal_share × 0.4)
```

The 0.4 multiplier means: 1% of additional informal share adds 0.4%
to the effective median wage. This captures the income that local
people actually earn but isn't in official stats, without naively
adding 100% of the informal share (which would double-count people
who work both formal AND informal jobs).

Applied where notes mention "+ informal uplift": Bangladesh, India,
Nigeria, Vietnam, Philippines, Indonesia, Brazil, Colombia, Kenya
(among others).

## Annual growth methodology

For 2024 anchor → 2026 current, applied nominal wage growth by region:

- Mature (US, EU, JP, KR, AU, NZ): ~3-4%/year
- Emerging Europe (PL, CZ, RO, BG, etc.): 5-8%/year
- LatAm: 4-6%/year (FX-adjusted)
- Asia ex-Japan: 4-7%/year
- Africa: 3-5%/year
- High-inflation (TR, AR, EG): ~0% in USD (local wage growth
  offset by FX depreciation)
- Sanctioned / collapsed (RU, IR, VE, MM, SY, SD): -2 to -5%/year USD

## Sample of post-overhaul wages (sanity check)

| City | Pre-overhaul | Post-overhaul | Reality check |
|---|---|---|---|
| NYC | $7,105 | $6,125 | ~$7,500 — slight under |
| London | $4,640 | $4,000 | ~$4,100 — close |
| Tirana | $425 | $950 | **~$1,000 — matches** |
| Berlin | $5,945 | $5,125 | ~$3,800 — still over |
| Tokyo | $5,000 | $3,625 | ~$3,500 — close |
| Singapore | n/a | $5,250 | ~$5,000 — close |
| Lagos | $300 | $263 | ~$250 — close |
| São Paulo | n/a | $938 | ~$1,000 — close |
| Mumbai | $250 | $438 | ~$500 formal, ~$350 informal-aware |
| Dubai | n/a | $5,625 | ~$5,000 — slight over |

The Berlin over-estimation is a known limitation of the tier-1
multiplier (Berlin pays below German national average). Future
improvement: per-city wage premium data (rather than tier-uniform
1.25 multiplier) would fix it.

## How to keep it current

Quarterly:
1. Update entries in `median_monthly_wage_usd_v1.json` with fresh
   stat agency publications (top 30 countries).
2. Run `npx tsx scripts/data/recompute_wages_from_median.ts` to
   propagate to country profile + cities.
3. Run `npx tsx scripts/verify_wage_quality.ts` to confirm no
   regressions.
4. Commit.

If a country reports new wage data:
1. Edit just that country's entry in
   `median_monthly_wage_usd_v1.json`.
2. Re-run the recompute script.
3. Verify.

## Files in this overhaul

- `data/economics/median_monthly_wage_usd_v1.json` — NEW, 200
  countries hand-anchored
- `data/economic_indicators/country_profile_v2.json` — UPDATED, 196
  countries got new `median_wage_full_time_usd` + p25/p75
- `data/cities/city_list_v1.json` — UPDATED, 252 cities got new
  `avg_gross_salary_usd_year` from country baseline × tier multiplier
- `scripts/data/recompute_wages_from_median.ts` — NEW, the pipeline
- `scripts/verify_wage_quality.ts` — NEW, standalone QC gate

## Open follow-ups

1. **GDP/cap nominal in country_profile_v2.json** is stale for some
   countries (ZA, CU, MG, MZ, NE, SL, SD shown by QC). Separate
   pass would refresh from World Bank 2024 numbers.
2. **Per-city wage premium** instead of uniform 1.25× would fix
   Berlin / Rome / Madrid being over-stated. Requires per-metro
   wage data (Eurostat NUTS 3, BLS MSA, etc.) — week of work.
3. **Add to prebuild gate chain**: once stable, add
   `scripts/verify_wage_quality.ts` to the prebuild chain so any
   future wage edit gets checked automatically.
