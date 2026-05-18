# 47 · Plan v10 — From benchmark to net-profit picture

> Founder direction (2026-05-18, after Plan v9 push #4):
>
> "Focus more on perfecting quality checks between countries regarding
> potential disturbances. A country significantly poorer seems to have
> significantly higher business revenue, things like that. The tax text
> for every country should be checked and updated to the maximum level
> while not becoming a behemoth. Sub-regional tax logic — UK regions,
> US states major major major. We should have a section for fixed costs
> the business is forced to pay monthly or annually. Property taxes.
> Final point: not only gross profit but also NET profit. We are
> shifting to a more granular system. Go deeper."

Plan v10 takes the atlas from "typical revenue per firm" to a defensible
**net-profit waterfall** per cell, with cross-country plausibility guards
so the database stops telling people a café in Tirana earns more than one
in Zurich. Eleven new tracks (PP–ZZ), ~84 hours total.

---

## 1 · What ships at the end of Plan v10

- Every cell page renders a **net profit** estimate, not just gross revenue.
- US cells use **state + city** specific tax rates (51 states + ~20 major metro surcharges).
- Nine multi-region countries use sub-regional tax variance (CH, DE, FR, IT, ES, UK, CA, AU, BR).
- Tax overlay text reviewed for all 146 countries, with VAT + PIT brackets added (capped at 4-sentence narrative per country — never a behemoth).
- Cross-country plausibility scanner flags implausible cells using real WID income data; UI shows a quiet warning chip.
- Fixed costs (rent, property tax, insurance, utilities, software, overhead) modeled per cell.
- 180 industries have curated margin reference data.
- Top 200 cities have commercial rent estimates.
- Per-country operating-cost multipliers calibrate net-profit math across rich and poor economies.

## 2 · Track list

| # | Track | Theme | Effort |
|---|---|---|---|
| 48 | **PP** — Cross-country plausibility scanner | Quality | 8 hr |
| 49 | **QQ** — Per-country tax-text quality pass (146 countries) | Quality | 12 hr |
| 50 | **RR** — US state + major-city tax overlay | Sub-regional | 10 hr |
| 51 | **SS** — UK/DE/FR/IT/ES/CH/CA/AU/BR sub-regional tax | Sub-regional | 12 hr |
| 52 | **TT** — Fixed cost section on cell pages | Granular | 10 hr |
| 53 | **UU** — Net profit waterfall logic | Granular | 8 hr |
| 54 | **VV** — Industry margin reference table (180 industries) | Granular | 4 hr |
| 55 | **WW** — Plausibility flag in user UI | Quality | 3 hr |
| 56 | **XX** — Property tax + commercial rent data layer | Granular | 8 hr |
| 57 | **YY** — Per-country operating cost multipliers | Granular | 5 hr |
| 58 | **ZZ** — Net-profit waterfall visual (SVG) | Granular | 4 hr |
| **Total** | | | **~84 hr** |

## 3 · Tracks in detail

### Track PP — Cross-country plausibility scanner (8 hr)

The "potential disturbances" check. A scanner that flags cells whose
numbers don't make economic sense relative to neighbours:

- **GDP-per-capita correlation check**: for each `(industry, size_band)`
  group, regress USD revenue-per-firm against GDP/capita across all
  covered countries. Flag cells where the residual exceeds 3σ.
- **Poorer-richer inversion check**: for any pair `(poor=A, rich=B)`
  where GDP/capita ratio > 1.5, flag any industry where
  revenue-per-firm in A > revenue-per-firm in B.
- **Within-country sanity**: revenue-per-firm should correlate with
  employees-per-firm within ±50%.

**Data source**: WID at `C:\Users\benet\Downloads\wid_all_data\` —
specifically `mnninc999i` (real per-adult national income, EUR ppp) or
`mhweal999i` (real wealth per adult). The executor must parse the per-country
CSVs once and write `scripts/quality/gdp_per_capita.json` keyed by ISO2.

**Output**: `delivery/quality/plausibility_scan_v1.json` consumed by
`/admin/anomalies` + a new "cross-country" tab.

### Track QQ — Per-country tax-text quality pass (12 hr)

Currently 146 tax-table notes are uneven. Goal: reviewed paragraphs of
≤ 4 sentences each, covering:

- Headline CIT
- Small-business or pass-through alternative rate (where it exists)
- Special regimes (Ireland 12.5% trading vs 25% passive, Bahamas zero
  CIT, Estonia retain-and-reinvest, etc.)
- One common SMB deduction lever
- VAT/GST rate (new field added to the JSON schema)
- Personal income tax range for sole proprietors (new field — relevant
  since most SMBs are pass-through entities)

Bulk-process in batches of ~25 countries per commit so review feels
incremental rather than one giant diff.

### Track RR — US state + major-city tax overlay (10 hr)

The US currently uses one flat federal rate. Build:

- **51-state table** at `src/lib/tax/us_states_2024.json` with:
  - State corporate income tax (CA 8.84%, NY 7.25%, TX 0%, NV 0%, SD 0%,
    WY 0%, OH commercial activity tax instead, WA B&O instead, etc.)
  - State sales tax (0% in NH/OR/MT/DE/AK, 7.25% in CA)
  - State pass-through entity tax / PIT (matters because most SMBs are LLCs)
- **City surcharges for major metros**:
  - NYC: UBT 4% on unincorporated entities + general corp tax
  - SF: gross receipts tax tiered by sector
  - Philadelphia: BIRT net income 5.81% + gross receipts 0.1415%
  - DC: franchise tax 8.25%
  - Los Angeles: gross receipts tax
  - Portland (OR): clean energy surcharge + arts tax
  - Chicago: personal property lease tax
- New helper `getUsStateTaxRates(stateId)` + city overlay merge.

### Track SS — Sub-regional tax overlay for 9 critical countries (12 hr)

The countries where sub-region materially changes the number:

- **UK** — England/Scotland/Wales/NI: same CIT but different reliefs
  (Welsh LTT, Scottish income tax bands for sole traders, NI lower
  combined-employer-NIC for some manufacturers).
- **Germany** — 16 Länder × Gewerbesteuer **Hebesatz**: Munich 490%,
  Frankfurt 460%, Berlin 410%, rural Saxony-Anhalt 250%. Swings effective
  corporate burden from ~28% (low-Hebesatz) to ~33% (Munich). Material.
- **France** — 18 régions with CFE + CVAE variation + Corsica special.
- **Italy** — 20 regions with IRAP regional surcharge (3.9% standard,
  up to 4.82% in some sectors).
- **Spain** — 17 autonomous communities + Basque + Navarre foral
  exceptions (own tax administration).
- **Switzerland** — 26 cantons. Massive variation: Zug ~11.9%, Geneva ~14%,
  Zurich ~19.7%. Biggest sub-national tax variance globally.
- **Canada** — 10 provinces with provincial CIT 8% (AB) → 16% (PEI).
- **Australia** — payroll tax differs by state (0% → 6.85% NSW).
- **Brazil** — 26 states with ICMS + state-level ISS.

New files: `src/lib/tax/{gb,de,fr,it,es,ch,ca,au,br}_subregional_2024.json`.

### Track VV — Industry margin reference table (4 hr)

For every default-visible industry, curated:
- **Gross margin** (revenue minus COGS): restaurants ~65%, retail ~30%,
  software ~85%, legal ~95%, manufacturing 20-35%, etc.
- **Operating margin** (before fixed costs + tax): restaurants ~10-12%,
  retail ~4-6%, software ~30%.
- **Asset intensity** (gross fixed assets as % of annual revenue): feeds
  XX property-tax calculation.

Source-cross-referenced from IRS SOI ratios, Damodaran's NYU industry
margin dataset, RMA Annual Statement Studies (notes only — never user-visible).

New file: `src/lib/finance/industry_margins.json`.

### Track WW — Plausibility flag in user UI (3 hr)

When a cell hits a PP flag, render a quiet chip on the cell page:

> Cross-country check: this revenue is materially higher than expected for [country]'s GDP/capita. Under review.

Doesn't hide the number, just calls it out. Adds a corresponding row
to the existing `/admin/anomalies` dashboard.

### Track XX — Property tax + commercial rent (8 hr)

Two tables:

1. `src/lib/finance/property_tax_2024.json` — commercial property tax
   rate per country (commercial often distinct from residential — UK
   business rates, US local property tax 0.5–2.5%, Germany Grundsteuer
   + Gewerbeimmobilien rate, etc.).
2. `src/lib/finance/commercial_rent_2024.json` — top-200 city
   commercial rent in USD/m²/year (Manhattan Midtown ~$1,000/m²,
   Tirana ~$80/m², São Paulo Jardins ~$450/m²).

Fallback: country median when the city isn't in the table.

### Track YY — Per-country operating cost calibration (5 hr)

Per-country multiplier so the same industry's fixed costs scale
correctly across rich and poor countries:

- Software priced in USD globally → disproportionate in low-GDP countries
- Utilities high in island nations (Iceland, Hawaii, NZ, Jamaica)
- Compliance overhead high in DE/FR, low in EE/SG

New file: `src/lib/finance/operating_cost_multipliers_2024.json`.

### Track TT — Fixed cost section on cell pages (10 hr)

New `<FixedCostsBreakdown>` component renders below PostTaxToggle:
- Estimated rent (city or country median × typical sqm for the industry)
- Estimated property tax (asset value × country property-tax rate)
- Estimated insurance + licensing (industry-typical fraction of revenue)
- Estimated utilities + software (revenue × per-country multiplier)
- Estimated other overhead

Each line labeled clearly as **estimate**. Methodology link explains
the assumption stack.

### Track UU — Net profit waterfall logic (8 hr)

Replace the current 3-line tax overlay with the full waterfall when
expanded:

```
Gross revenue          $X
− COGS (gross margin)  $X
= Gross profit         $X
− Payroll              $X
− Employer social      $X
= Operating profit     $X (EBITDA proxy)
− Rent                 $X
− Property tax         $X
− Insurance            $X
− Utilities + software $X
= Pre-tax profit       $X
− Corporate income tax $X
= Net profit / owner take  $X  ← headline
```

Disclaimer banner front-and-center. Each row hoverable for the
assumption that produced it.

### Track ZZ — Net-profit waterfall visual (4 hr)

Horizontal stacked-bar SVG showing the full waterfall. Pure server-
rendered SVG, no client JS. Lives next to the text breakdown in UU.

## 4 · Verification gate (Plan v10 complete)

- /us/california/restaurants renders a 13-row net-profit waterfall + a horizontal stacked-bar visual
- /us/california/restaurants tax overlay shows "California: 21% federal + 8.84% state + Los Angeles surcharge" combined
- /de/de21/metal-products-manufacturing tax overlay shows Bayern Hebesatz factored in
- /admin/anomalies has a "cross-country" tab with > 50 flagged cells
- 146/146 country tax narratives reviewed (no boilerplate placeholders)
- All 180 default-visible industries have margin reference entries
- Top 200 cities in commercial_rent_2024.json have explicit rates
- WID parser produced gdp_per_capita.json from local WID_data_XX.csv files

## 5 · Maintenance protocol (unchanged)

Same as previous plans:
1. Update `04_CURRENT_STATE.md` at session end
2. Append decisions to `03_DECISION_LOG.md`
3. Commit `handoff: <summary>` and push
4. `tsc --noEmit` + `verify_taxonomy.ts` + `npm run lint` before every commit
