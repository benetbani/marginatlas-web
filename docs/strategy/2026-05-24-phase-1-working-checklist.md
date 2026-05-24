# Phase 1 working checklist — founder + agent, no outside researchers

> Companion to `2026-05-24-industry-deepening-master-plan.md`. This is
> the operational doc we work through together. Each row is one
> (industry × country) data-acquisition task: the founder confirms
> sources, the agent writes the import script, runs prebuild, ships.
>
> Phase 1 scope: 5 industries × 10 pilot countries = 50 cells fully
> deepened with cost stack + setup-cost block + sub-industry variants
> where data supports them.

---

## Pilot countries (founder confirmed 2026-05-24)

| Tier | Country | ISO2 | Why |
|---|---|---|---|
| Wave 1 | United States | US | Best data ecosystem; FDD goldmine |
| Wave 1 | United Kingdom | GB | Companies House + ONS + sector trade reports |
| Wave 1 | Germany | DE | Destatis + Handwerkskammer |
| Wave 1 | France | FR | INSEE + CCI + sector federations |
| Wave 1 | Italy | IT | ISTAT + CCIAA + Confcommercio / Confindustria |
| Wave 1 | Spain | ES | INE + sector federations |
| Wave 1 | Japan | JP | MIC + JETRO + sector chambers |
| Wave 1 | UAE | AE | Federal Competitiveness + DET |
| Wave 1 | Singapore | SG | SingStat + Enterprise Singapore |
| Wave 1 | Switzerland | CH | BFS / OFS + cantonal chambers |

10 wave-1 countries. Master plan allows expansion to 30 pilots later.

## Pilot industries (Phase 1 scope)

Five highest-traffic, strongest-data:

1. `restaurants`
2. `cafes_coffee`
3. `hairdressers_beauty`
4. `auto_repair_shops`
5. `hotels_lodging`

50 cells total: 5 industries × 10 countries.

---

## The per-cell research checklist

For each (industry × country) pair, the founder + agent walk through
this list. Each item is a decision the founder confirms; the agent
captures the answer in the SQL import script under
`scripts/import/deepening/<country>/<industry>.sql`.

### Step 1 — confirm canonical source

Per (industry, country), identify the single best primary source.

- [ ] National statistical office (NSO) industry-output report exists?
  URL + access date.
- [ ] Sector trade association annual report exists? URL + access date.
- [ ] US: FDD database lookup performed for the corresponding NAICS?
  Number of FDDs reviewed.
- [ ] Government regulator licensing/registration fee schedule URL.
- [ ] Year of underlying data; flag any older than 3 years.

### Step 2 — extract the 8-line annual cost stack

USD per typical firm per year. Mark each line:

- [ ] `rent_occupancy` — source / value / year
- [ ] `payroll_total` (wages + employer social side) — source / value / year
- [ ] `cost_of_goods_sold` — source / value / year
- [ ] `utilities` — source / value / year
- [ ] `marketing_acquisition` — source / value / year
- [ ] `insurance_professional` — source / value / year
- [ ] `equipment_maintenance` — source / value / year
- [ ] `regulatory_licensing` — source / value / year
- [ ] Sum reconciles to within 25% of (revenue − operating margin)? If
  not, document the gap.

### Step 3 — extract the setup-cost block

#### Box 1 — registration + licensing

- [ ] `business_registration_fee`
- [ ] `industry_licenses_fee`
- [ ] `professional_license_fee` (if applicable)
- [ ] `insurance_bond_initial`
- [ ] `certifications_initial`
- [ ] Total estimated

#### Box 2 — capital fit-out + equipment

- [ ] `property_fitout`
- [ ] `equipment_initial`
- [ ] `initial_inventory`
- [ ] `working_capital_reserve_months` (typically 3-6)
- [ ] `lease_deposit`
- [ ] `pre_opening_marketing`
- [ ] Total estimated

### Step 4 — sub-industry split decision

For this (industry × country):

- [ ] Does the source data break out variants at the granularity our
  seed proposes? (e.g., does the country's restaurant report split
  quick-service vs full-service vs fine-dining?)
- [ ] If YES: per-variant cost stacks captured? If yes, flip the
  corresponding `data_ready` flag in `src/lib/taxonomy/sub_industries_seed.ts`.
- [ ] If NO: leave the variants as data_ready=false for this country.
  The picker shows only the parent.

### Step 5 — local-name flavor

- [ ] Country has a colloquial / industry-specific local name for this
  business? (Trattoria, izakaya, kebapci, etc.)
- [ ] If yes, add a row to `local_aliases` with the local_name +
  transliteration + pronunciation hint.
- [ ] Web-search verify the name is current (not an archaic term).

### Step 6 — quality grade + source note

- [ ] Assign A / B / C / D grade per the rubric:
  - A: all from primary sources within last 2 years
  - B: mix; at least the headline + 4 cost lines from primary
  - C: mostly extrapolated, anchored to a recent benchmark
  - D: mostly modeled, no recent primary data
- [ ] Write the source_note paragraph (3-5 sentences, what was sourced
  from where, what was modeled).

### Step 7 — write the import

- [ ] Agent writes `scripts/import/deepening/<country>/<industry>.sql`
  with the UPDATE statements.
- [ ] Founder reviews the SQL.
- [ ] Founder runs in Supabase SQL Editor.
- [ ] Agent runs `npm run prebuild` — all 7 gates pass.
- [ ] Agent runs the cell-page audit script — no plausibility
  regressions introduced.
- [ ] Commit + push.

---

## Wave-1 execution order (50 cells)

Suggested order to learn fastest:

| # | Country | Industry | Why this slot |
|---|---|---|---|
| 1 | US | restaurants | Goldmine data (FDDs + Census + NRA), simple sector, sanity-check the framework |
| 2 | US | cafes_coffee | Same data quality, smaller variance, validate sub-industry split logic on quick-service |
| 3 | GB | restaurants | Same industry, second country — tests cross-country comparability |
| 4 | GB | hairdressers_beauty | Different sector, GB has strong British Hairdressing Federation data |
| 5 | DE | hairdressers_beauty | EU equivalent; ZDH (Handwerk) has Friseurhandwerk-specific filings |
| 6 | DE | auto_repair_shops | Mittelstand sector; ZDK data |
| 7 | FR | restaurants | Synhorcat data; tests French-language source friction |
| 8 | IT | restaurants | Confcommercio; tests Italian-language friction |
| 9 | ES | restaurants | Hostelería Madrid + CEHE national data |
| 10 | US | hotels_lodging | AHLA + STR + FDDs for franchised hotels |
| 11 | US | auto_repair_shops | NADA + FDD data for franchised chains |
| 12-15 | GB / DE / FR / IT × hotels_lodging | Hotel data is widely published per country |
| 16-20 | Continue working the 5×10 matrix |
| 21-30 | Asia / Middle East / CH rows (JP, AE, SG, CH) — different data languages, higher friction |
| 31-50 | Fill in remaining (industry, country) gaps |

Tracking: each completed cell flips a row in the master plan's
"Phase 1 coverage" table (will live in this doc, added below).

---

## Phase 1 coverage table

Updated as cells complete. Status legend:

- ⬜ not started
- 🟨 in progress
- ✅ shipped (cost stack + setup costs + grade ≥ B)
- ⚪ deferred (data thin; revisit later)

|              | US | GB | DE | FR | IT | ES | JP | AE | SG | CH |
|---|---|---|---|---|---|---|---|---|---|---|
| restaurants            | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| cafes_coffee           | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| hairdressers_beauty    | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| auto_repair_shops      | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| hotels_lodging         | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## Subscriptions decision queue

Per founder: zero outside researchers, paid subscriptions OK when ROI
is obvious and pre-approved. Decision-by-decision queue:

| Subscription | Annual cost | Covers | Decision | Reasoning |
|---|---|---|---|---|
| Statista premium individual | ~$1,000 | Most industries × 30+ countries; ready-to-cite chart + cost data | ⬜ Pending | Probably worth it for Wave 1; cost is small vs the time saved |
| IBISWorld pay-per-report | ~$1,000 each | One US industry per report; deep cost-stack detail | ⬜ Pending | Worth it for the 5 pilot industries × 1 US report each ($5K) |
| FTC FDD database access | $0 | All US franchise filings; gold standard for restaurant/hotel/retail cost stacks | ✅ Use immediately | Free, no decision needed |
| Eurostat SBS data portal | $0 | EU-wide industry × country statistics | ✅ Use immediately | Free |
| World Bank Doing Business | $0 | Country-by-country business-opening cost benchmarks | ✅ Use immediately | Free |
| Trade-association memberships (per country) | $200-2000 / each | National sector reports | ⬜ Pending | Decide per country as needs surface |
| Bureau van Dijk Orbis | $5K+ | Firm-level financials, deep | ❌ Probably too expensive | Defer |
| Euromonitor passport | $10K+ | Cross-country consumer / sector | ❌ Probably too expensive | Defer |

Founder confirms purchases as we hit specific needs. Agent does NOT
buy on its own.

---

## Risk note: data freshness

Founder explicit (May 24): "we have to sell this website like it
actually has the recent data." Concrete implications for Phase 1:

- Reject any source > 3 years old without a documented reason.
- Stamp every cell with `cost_stack.refreshed_at` so the page can
  display the freshness date next to the section heading.
- Phase 6 prebuild gate (deferred): refuse to publish a `data_ready`
  cell whose `refreshed_at` is older than 18 months.

---

## What "Phase 1 done" looks like

When the table above is all ✅ for 5 industries × at least 7 of 10
countries (we accept up to 3 ⚪ deferred from the harder countries):

- Phase 0 stub components have real data flowing.
- Cell pages render the cost stack + setup-cost block (Pro tier only).
- The sub-industry chip appears on at least the 3-4 industries where
  the variant split is well-supported.
- The May 24 currency + plausibility QA passes continue to gate every
  deploy.
- Founder + agent have a documented playbook for adding more
  (industry × country) pairs in Phase 2.

Then Phase 2 starts: same 5 industries, next 15 countries (the Tier-2
expansion list in the master plan). And so on.
