# ATO framework execution plan — Margin Atlas v35

**Date:** 2026-05-26
**Status:** Draft. Awaiting founder approval before execution.
**Parent doc:** [2026-05-26-ato-benchmark-framework-research.md](./2026-05-26-ato-benchmark-framework-research.md)

This is the execution plan that takes the ATO research and converts
it into a sequenced, methodical, ambitious upgrade to Margin Atlas's
benchmark infrastructure. Eight phases, end-to-end, with deliverables,
files, risks, and gates per phase. Everything ships behind the existing
14-gate prebuild chain.

---

## 0. Executive summary

We are upgrading Margin Atlas from a *descriptive* benchmark site
("typical revenue is $X") into a *comparative* benchmark site ("here's
where your business sits in this distribution, and the one ratio you
should be watching is Y"). The ATO has spent two decades figuring out
the operator-facing framework for this. We are adopting their
framework, not their data — globally, across 196 countries.

**Five structural moves:**

1. **`key_benchmark` per industry** — designate ONE ratio as the
   headline answer to "am I normal?" Restaurants → COGS; trades →
   total expenses; agencies → labour.
2. **Add `motor_vehicle_share` to the cost stack** — currently
   absent. Worth 4-8% of revenue for every trade.
3. **Turnover-band axis alongside size-band** — pre-launch operators
   know revenue, not headcount. The ATO's primary segmentation.
4. **20 net-new sub-industry splits** — bricklaying vs blocklaying vs
   cement rendering, catering vs restaurants, coffee shops vs cafés
   vs cake shops. The ATO's resolution is what operators recognise.
5. **Interactive "Compare your business" tool at `/check`** — the
   single biggest acquisition + monetisation hook on the site.

**Plus two supporting moves:**

6. **Editorial voice pass** — rewrite hero copy from descriptive to
   comparative across every cell page.
7. **Public methodology surface** — make the new framework legible to
   operators on `/methodology` and `/about-data`.

**Effort estimate:** 4-6 weeks of focused work, sequenced across 8
phases. Each phase ships independently behind the existing 14-gate
prebuild and can be paused without breaking the next.

**Quality gates added:** 4 new prebuild rules locking the new schema
fields, cost-share invariants, and copy-voice patterns.

---

## 1. Goals and non-goals

### 1.1 Goals

- Make every cell page answer the operator's actual question ("am I
  normal?") not just describe the typical firm.
- Surface ONE ratio per industry as the headline — not five
  equal-weight ratios.
- Add a turnover-revenue axis so pre-launch operators can navigate
  without knowing their final headcount.
- Cover the trades cost stack honestly (motor vehicle is a real,
  large line item; hand-waving it into "other overhead" is dishonest).
- Ship an interactive comparison tool that captures operator data
  and feeds the email funnel.
- Document the new framework on a public methodology page so the
  rigour is visible.

### 1.2 Non-goals

- Audit-risk / cash-economy framing. Not our vibe.
- Reducing scope to a single country. The Margin Atlas value is the
  multi-country lens; we keep it.
- Replacing tax-return data with anything we don't have. We continue
  to use Eurostat SBS, US Census BDS, World Bank Enterprise Surveys.
- Rewriting the entire taxonomy. The ~20 new splits extend it; we do
  not replace the existing 192-industry visible taxonomy.
- Building a tax-filing tool. We help operators benchmark; we do not
  do their taxes.

---

## 2. Architectural deltas

### 2.1 Schema extensions

Two data files extended, one new:

**`data/finance/industry_cost_profile_v1.json`** — extend each
industry record with:

```json
{
  "industry_id": "restaurants",
  "cogs_share": 0.32,
  "labor_share": 0.32,
  "rent_share": 0.08,
  "energy_share": 0.025,
  "marketing_share": 0.02,
  "software_share": 0.005,
  "insurance_share": 0.012,
  "motor_vehicle_share": 0.012,    // NEW
  "other_overhead_share": 0.196,
  "key_benchmark": "cogs",          // NEW: one of cogs|labor|rent|motor_vehicle|total_expenses
  "key_benchmark_rationale": "Variable food cost is the most accurate predictor of true turnover for restaurants."  // NEW
}
```

Invariant the verify gate enforces:
```
cogs + labor + rent + energy + marketing + software + insurance
  + motor_vehicle + other_overhead + typical_net_margin == 1.0 ± 0.005
```

**`data/finance/turnover_bands_v1.json`** — NEW. Per-industry
turnover bands in USD (international comparability):

```json
{
  "version": "1.0.0",
  "convention": "Turnover bands in USD per year. Each industry has three bands. Country-level conversion applies the country PPP factor at render time.",
  "industries": {
    "restaurants": { "bands": [{"max": 300000}, {"max": 1000000}, {"max": null}] },
    "bricklaying":  { "bands": [{"max": 150000}, {"max": 500000}, {"max": null}] },
    "law-firms":   { "bands": [{"max": 500000}, {"max": 2000000}, {"max": null}] }
  }
}
```

**`data/finance/key_benchmark_assignments_v1.json`** — NEW.
Industry → key_benchmark mapping with one-sentence rationale per
assignment. This file is the *source of truth*; the same fields on
IndustryCostProfile are denormalised for the cost-engine's
convenience.

### 2.2 TypeScript types

`src/lib/cost_engine/engine.ts`:
```ts
export type KeyBenchmark = "cogs" | "labor" | "rent" | "motor_vehicle" | "total_expenses";

export interface IndustryCostProfile {
  // ...existing fields...
  motor_vehicle_share: number;     // 0..1
  key_benchmark: KeyBenchmark;
  key_benchmark_rationale: string;
}
```

`src/lib/cells/cell.ts` — extend `Cell` type with optional
`turnover_band: 1 | 2 | 3` derived at compute time.

### 2.3 New routes

- `/check` — Compare-your-business tool (server-rendered form +
  client validation, results page shareable via URL params)
- `/methodology/key-benchmarks` — public-facing framework explainer

### 2.4 New components

- `KeyBenchmarkBanner` — the hero ribbon that calls out "Your key
  ratio: COGS. Typical range: 33-37%."
- `TurnoverBandSwitcher` — UI control for switching segmentation
  axis between size-band and turnover-band.
- `CompareForm` — the interactive checker.
- `CompareResult` — verdict display: ratio-by-ratio, deviation
  flag, suggested action.
- `MotorVehicleStrip` — small visual showing transport cost as a
  share of revenue (renders only when share > 1%).

### 2.5 New prebuild gates (4)

1. **`verify_cost_share_invariant.ts`** — every cost profile's shares
   sum to 1.0 ± 0.005 including the new motor_vehicle_share.
2. **`verify_key_benchmark_assignment.ts`** — every visible industry
   has a `key_benchmark` field that resolves to a non-zero share in
   the cost profile.
3. **`verify_turnover_bands.ts`** — every visible industry has 3
   ordered turnover bands; thresholds are positive and monotonic.
4. **`verify_comparative_voice.ts`** — cell-page hero strings do not
   start with "Typical" / "Average" / "Most" / "Usually" (the
   passive descriptive openers). Warn-only initially, hard-gate
   after Phase 3 ships.

These bring the gate chain to **18 gates**.

---

## 3. Phase-by-phase plan

Each phase has: deliverables, files touched, quality gates run,
risks, rollback strategy, founder-visible artefact.

### Phase 1 — Schema foundation (1-2 days)

**Goal:** lay every new schema field without changing UI.

**Deliverables:**
- Extend `IndustryCostProfile` type with `motor_vehicle_share`,
  `key_benchmark`, `key_benchmark_rationale`.
- Create `data/finance/turnover_bands_v1.json` (initially populated
  with 6 sentinel industries: restaurants, cafés, bakeries, law
  firms, plumbing, retail clothing).
- Create `data/finance/key_benchmark_assignments_v1.json` (initially
  the same 6 industries).
- Default every other industry's `motor_vehicle_share` to 0 and
  rebalance `other_overhead_share` to keep the invariant.
- Add `verify_cost_share_invariant.ts` and
  `verify_key_benchmark_assignment.ts` to the prebuild chain.

**Files touched:**
- `src/lib/cost_engine/engine.ts`
- `data/finance/industry_cost_profile_v1.json`
- `data/finance/turnover_bands_v1.json` (new)
- `data/finance/key_benchmark_assignments_v1.json` (new)
- `scripts/verify_cost_share_invariant.ts` (new)
- `scripts/verify_key_benchmark_assignment.ts` (new)
- `package.json` (prebuild chain)

**Risks:** the invariant gate may flag the existing cost-profile
JSON if any industry's shares don't sum to 1.0 today. Mitigation:
the same script self-reports the residual and we patch the JSON
before flipping the gate to hard-fail.

**Rollback:** none needed — schema is additive.

**Founder artefact:** prebuild chain reports "✓ All 192 industries
have key_benchmark assigned" and "✓ All cost profiles invariant
≤ 0.005."

---

### Phase 2 — Key benchmark on the cell page (2-3 days)

**Goal:** every cell page now visibly answers "which ratio is THE
ratio for this industry?"

**Deliverables:**
- New component `KeyBenchmarkBanner` — sits at the top of the cell
  page, below H1. Renders the assigned ratio + typical range + one
  sentence rationale.
- Distribution chart on the cell page gets a shaded "key benchmark
  range" band (middle 30% of similar firms, centred on the per-band
  average).
- Hero copy includes a new line: *"For [industry] the most predictive
  ratio is [name]. Operators in this band typically sit at X% (range
  Y-Z%)."*
- Key-benchmark assignment expanded from 6 sentinel industries to
  all 192 visible industries. Each gets a one-sentence rationale.

**Files touched:**
- `src/components/KeyBenchmarkBanner.tsx` (new)
- `src/components/RevenueDistribution.tsx` (modify — add shaded band)
- `src/app/[country]/[geo]/[industry]/page.tsx` (mount banner)
- `data/finance/key_benchmark_assignments_v1.json` (expand to 192)

**Risks:** assigning the wrong key benchmark for an industry. The
ATO data covers most retail/food/trades; for the long tail
(software-development, marketing-design, etc.) we need to pick a
defensible ratio. Default rule: if cogs_share >= 0.25 → COGS;
elif labor_share >= 0.40 → Labour; else → Total expenses.

**Rollback:** the banner is wrapped in a feature flag; setting it
off restores the previous hero layout.

**Founder artefact:** screenshot of `/us/california/restaurants`
showing the new ribbon: *"Watch this ratio: COGS. Typical range
33-37%."*

---

### Phase 3 — Motor vehicle cost line (1-2 days)

**Goal:** the cost stack tells the truth for trades.

**Deliverables:**
- Populate `motor_vehicle_share` for every visible industry. Defaults:
  - Trades (plumber, electrician, carpenter, builder, hvac, roofer,
    landscaping, mobile-services): 0.05-0.08
  - Field services (cleaning, pest control, courier): 0.03-0.06
  - Trucking, freight, taxi: 0.18-0.25 (this is the *whole* business)
  - Retail with delivery: 0.01-0.02
  - Office-based services: 0.00-0.01
- Rebalance `other_overhead_share` to maintain invariant.
- Update `SmartWaterfall` and `AnnualCostStack` components to show
  motor vehicle as a distinct line when share ≥ 0.01.
- Add `MotorVehicleStrip` to cell-page sections.

**Files touched:**
- `data/finance/industry_cost_profile_v1.json` (192 industries
  re-balanced)
- `src/components/SmartWaterfall.tsx`
- `src/components/sections/AnnualCostStack.tsx`
- `src/components/MotorVehicleStrip.tsx` (new)
- `src/app/[country]/[geo]/[industry]/page.tsx`

**Risks:** mis-categorising a sector and giving a CPA office 5%
motor vehicle. Mitigation: the assignment rule above + a manual
review pass of trades industries.

**Rollback:** the strip self-suppresses when share < 0.01. Restoring
prior behaviour = setting all values to 0.

**Founder artefact:** spot-check `/us/california/plumbing-services`
shows the new 5-6% motor vehicle line.

---

### Phase 4 — Comparative voice rewrite (3-5 days)

**Goal:** every cell-page hero starts with "Where you stand" not
"Typical operators report".

**Deliverables:**
- Editorial pass across every hero string in `src/lib/content/`.
- New module `src/lib/content/comparative_narratives.ts` — generates
  per-industry, per-band hero copy in the new voice.
- Add `verify_comparative_voice.ts` to the prebuild chain (warn-only
  for one week, then hard-fail).
- Update the `getCellNarrative()` callers to use the new generator.

**Files touched:**
- `src/lib/content/narratives.ts`
- `src/lib/content/comparative_narratives.ts` (new)
- `src/app/[country]/[geo]/[industry]/page.tsx`
- `scripts/verify_comparative_voice.ts` (new)
- Possibly ~30 hand-tuned narrative files

**Risks:** large diff, lots of copy. Mitigation: ship the generator
first (covers 90% of cells), then targeted hand-tunes for the top
~30 industries.

**Rollback:** the new generator runs through a feature flag; the
old descriptive copy stays as fallback.

**Founder artefact:** before/after copy diff on the top 5 cell pages.

---

### Phase 5 — Sub-industry splits (1 week)

**Goal:** taxonomy resolution matches operator reality.

**Deliverables:** split the following into their own industry rows
in the taxonomy + cost-profile + key-benchmark assignment files:

| Currently bundled into | New sub-industry | Why split |
|---|---|---|
| construction-general | blocklaying | Different turnover band shape |
| construction-general | bricklaying | Distinct from blocklaying |
| construction-general | cement-rendering | Lower labour, higher material |
| construction-general | carpet-laying | Equipment-heavy sub-niche |
| construction-general | cabinet-making | Higher COGS than general carpentry |
| restaurants | catering | Lower rent, higher motor vehicle |
| restaurants | chicken-shops | Globally distinctive sub-format |
| coffee-shops | cafés-full-menu | Cafés have food labour, coffee shops don't |
| bakeries | cake-shops-patisseries | Higher labour, lower bread COGS |
| electrical-services | alarm-systems-install | Recurring-revenue monitoring tail |
| cleaning-services | cleaning-building-industrial | B2B contract structure |
| cleaning-services | cleaning-carpet-upholstery | Equipment-heavy |
| retail-clothing | bottle-shops-liquor | Distinct from grocery |
| auto-services | automotive-electrical | Sub-trade with own benchmarks |
| hairdressing | barber-mens-hairdressing | Different cost structure |
| hairdressing | beauty-services | Higher COGS (product sales) |
| childcare-services | childcare-formal | Different licensing burden |
| repair-services | air-conditioning-refrigeration-heating | Higher motor vehicle |
| construction-general | carpentry-services | Currently absent as own line |
| retail-general | book-retailing | Currently absent as own line |

That's 20 splits.

**Files touched:**
- `src/lib/taxonomy.ts` (add 20 industry entries)
- `data/finance/industry_cost_profile_v1.json` (add 20 cost profiles)
- `data/finance/key_benchmark_assignments_v1.json` (add 20 assignments)
- `data/finance/turnover_bands_v1.json` (add 20 band definitions)
- `data/cities/country_signature_v1.json` (no change — country-level
  signature_sectors are already industry-agnostic)
- New SQL migration `data/sub_industries/seed_v2.sql` (extend the
  existing sub-industry registry)

**Risks:** existing cells in `cells_master` won't have data for the
new industries. Mitigation: each new sub-industry inherits from its
parent's cells via the existing fallback mechanism until real data
is sourced.

**Rollback:** remove the 20 industry IDs from the visibility list
in taxonomy.

**Founder artefact:** spot-check `/us/california/bricklaying`
renders correctly with inherited-from-construction cost shape.

---

### Phase 6 — Turnover-band axis (1.5-2 weeks, biggest lift)

**Goal:** users can segment by revenue band, not just employee band.

**Deliverables:**
- Add `turnover_band` derivation to `getCellBySlug()`.
- New component `TurnoverBandSwitcher` (the segmentation axis
  toggle). Sticks via URL search param `?axis=turnover` to keep
  state shareable.
- `RevenueDistribution` + `RevenueTiles` accept an `axis` prop and
  render the appropriate slicing.
- Per-industry turnover-band thresholds in
  `data/finance/turnover_bands_v1.json` (all 192 industries).
- `verify_turnover_bands.ts` prebuild gate.
- Cell-page hero infers default axis from page context: opening a
  cell from `/calculator` → turnover band; from a cell index → size
  band.

**Files touched:**
- `src/lib/cells.ts` (extend Cell type + compute turnover_band)
- `src/components/TurnoverBandSwitcher.tsx` (new)
- `src/components/RevenueDistribution.tsx` (accept axis prop)
- `src/components/RevenueTiles.tsx` (accept axis prop)
- `src/app/[country]/[geo]/[industry]/page.tsx`
- `data/finance/turnover_bands_v1.json`
- `scripts/verify_turnover_bands.ts` (new)

**Risks:** the heaviest data lift in the plan. 192 industries × 3
band thresholds = 576 numbers, calibrated per industry. Mitigation:
defaults derived from observed `revenue_per_firm` quantiles in
`cells_master`, then hand-corrected for the top 30 industries.

**Rollback:** the switcher hides itself when the data file isn't
populated for the current industry; the size-band axis remains the
default.

**Founder artefact:** demo URL `/us/california/restaurants?axis=turnover`
showing three bands and the distribution properly sliced.

---

### Phase 7 — Compare Your Business tool (1 week)

**Goal:** ship the killer acquisition + monetisation hook.

**Deliverables:**
- New route `/check` (Server Component shell + Client form).
- Form fields: country, city (optional), industry, annual turnover,
  annual rent paid, headcount, total wages paid, motor-vehicle
  spend (optional, hidden unless industry is a trade).
- Verdict component renders per-ratio comparison:
  - "COGS: you're at 28%, typical for this band is 33-37%. **Below
    typical** — likely strong margin, verify you're capturing all
    food cost."
  - "Labour: you're at 32%, typical is 23-31%. **Above typical** —
    consider whether you're overstaffed or whether your menu mix
    needs more leverage."
  - "Rent: you're at 18%, typical is 9-14%. **Significantly above
    typical** — explore renegotiation or relocation."
- One sentence top-line verdict: "Your biggest deviation is rent."
- Shareable result URL with all inputs hashed in query string.
- Email capture: "Want a printable report?" → email gate.
- Hook into existing analytics events.

**Files touched:**
- `src/app/check/page.tsx` (new)
- `src/app/check/CheckForm.tsx` (new client component)
- `src/app/check/CheckResult.tsx` (new)
- `src/components/check/RatioVerdict.tsx` (new)
- `src/lib/check/verdict_engine.ts` (new)
- `src/lib/seo/structured_data.ts` (add Tool schema)
- Header nav: add "Compare your business" entry

**Risks:** validates user inputs that may be implausible (revenue
$5/yr). Mitigation: input validation + plausibility floor in the
verdict engine.

**Rollback:** remove `/check` from header nav, keep route alive but
de-indexed.

**Founder artefact:** demo URL `/check?industry=restaurants&country=us&revenue=700000`
showing live verdict.

---

### Phase 8 — Methodology surface + final QA (2-3 days)

**Goal:** the new framework is publicly legible.

**Deliverables:**
- New page `/methodology/key-benchmarks` explaining the key benchmark
  concept, turnover bands, and the cost stack invariant.
- Update `/about-data` to reference the new framework.
- Update the cell-page footer to link to the new methodology page.
- Lock all 4 new prebuild gates to hard-fail mode.
- Cross-browser + mobile QA of `/check` (the only new heavy client
  surface).
- Sentry + analytics dashboards updated to track:
  - `/check` form completion rate
  - per-ratio verdict distribution (how many users above / below /
    in-range)
  - email-capture rate at the verdict step

**Files touched:**
- `src/app/methodology/key-benchmarks/page.tsx` (new)
- `src/app/about-data/page.tsx`
- `src/components/CellPageFooter.tsx`
- `package.json` (prebuild gates)
- `docs/strategy/2026-05-26-ato-framework-shipped.md` (new — the
  methodology summary, parallel to 2026-05-26-signature-panel-shipped.md)

**Risks:** none significant — this is documentation + final lock-in.

**Rollback:** none needed.

**Founder artefact:** the methodology doc + a live `/methodology/key-benchmarks`
URL.

---

## 4. Cross-cutting concerns

### 4.1 Quality gates

After all 8 phases, the prebuild chain has these 18 gates (4 new):

1. verify_taxonomy
2. verify_no_em_dashes
3. verify_no_source_agencies
4. find_dead_links --strict
5. verify_featured_tiles
6. verify_render_guards
7. verify_deepening
8. verify_monetization_coverage
9. verify_v34_research_rules
10. verify_no_internal_notes
11. top_industries_plausibility
12. find_useless_tiles
13. verify_typography_consistency
14. verify_signature_quality
15. **verify_cost_share_invariant (NEW)**
16. **verify_key_benchmark_assignment (NEW)**
17. **verify_turnover_bands (NEW)**
18. **verify_comparative_voice (NEW)**

### 4.2 RAM ceiling

User constraint R-024: do not exceed 600 MB RAM. Every new script
streams its data file rather than loading whole-DB extracts. The
heaviest new script — `verify_turnover_bands.ts` — reads three
files (taxonomy, cost profile, turnover bands) and joins in memory;
peak ~80 MB.

### 4.3 SEO equity

User constraint: "Renaming URL slugs costs months of SEO equity."
None of the 20 new sub-industry splits *renames* anything. They add
new URLs (`/us/california/bricklaying`) alongside the parent
(`/us/california/construction-general`). The parent keeps existing
SEO equity.

### 4.4 Pre-existing data quality issues

The `page_sanity_audit.ts` already flags 449 plausibility issues in
`extrapolated_cells` for small Caribbean tax havens. The new
framework does NOT exacerbate these — the plausibility floor at
render time (Sanity §6) continues to suppress them. The new
verify_cost_share_invariant gate is purely structural and is
unaffected.

### 4.5 Mobile + 320px

`/check` is the only new heavy client surface. Form layout is
single-column on mobile; verdict component stacks per-ratio cards
vertically. Tested at 320px breakpoint.

### 4.6 Image policy

Pexels-only. The methodology page uses no decorative imagery; it's
a text + diagram surface.

### 4.7 No em-dashes in user-visible source (R-020)

Every new file goes through `verify_no_em_dashes.ts` automatically.
The em-dashes in *this* plan document are fine — docs are not
user-visible source.

---

## 5. Risk register

| Risk | Mitigation | Phase |
|---|---|---|
| Cost-share invariant fails for legacy industries | Pre-flight rebalance pass; gate as warn-only until clean | 1 |
| Wrong key_benchmark for long-tail industries | Default rule + manual review of top 30 | 2 |
| Motor vehicle line over-applies | Categorisation guide + manual trades review | 3 |
| Copy generator produces bland output | Hand-tune top 30 industries; generator handles long tail | 4 |
| 20 new sub-industries have no cell data | Inherit-from-parent fallback already exists | 5 |
| Turnover bands per industry are guess-work | Bootstrap from observed quantiles; founder hand-corrects top 30 | 6 |
| `/check` gets junk inputs | Plausibility validation; verdict engine clamps absurd values | 7 |
| Cumulative gate slowdown on prebuild | Each new gate < 2s; total chain stays under 60s | All |

---

## 6. Effort estimate

| Phase | Calendar days | Engineering effort (hours) |
|---|---|---|
| 1. Schema foundation | 1-2 | 6-10 |
| 2. Key benchmark in UI | 2-3 | 12-18 |
| 3. Motor vehicle line | 1-2 | 6-12 |
| 4. Comparative voice rewrite | 3-5 | 20-30 |
| 5. Sub-industry splits (20) | 5-7 | 30-40 |
| 6. Turnover band axis | 8-12 | 50-70 |
| 7. Compare Your Business tool | 5-7 | 30-40 |
| 8. Methodology + final QA | 2-3 | 12-18 |
| **Total** | **4-6 weeks** | **166-238 hours** |

Phases 1-3 can be batched (they all touch the cost profile) and
shipped in week 1. Phase 4 (copy) can run in parallel with Phase 5
(taxonomy splits) since they touch different surfaces. Phases 6-7
are the heavy lifts and want serial execution.

---

## 7. Decisions needed from founder before execution

1. **Default key-benchmark for service industries.** Confirmed
   rule: cogs_share ≥ 0.25 → COGS, labor_share ≥ 0.40 → Labour,
   else → Total expenses. Override?
2. **20 sub-industry split list.** Approve as-is, or add/remove?
   The list is calibrated to the ATO's own A-Z; deviations are easy.
3. **`/check` email-gate placement.** Gate the result, or gate a
   printable PDF download of the result? (Recommend the PDF — the
   verdict text itself stays free; the takeaway-friendly format is
   the gate.)
4. **Turnover-band thresholds.** Bootstrap from observed quantiles
   in `cells_master`, or use the ATO's Australian thresholds as
   the global anchor? (Recommend bootstrap — Australian wage levels
   are not globally representative.)
5. **`verify_comparative_voice.ts` strictness.** Warn-only forever
   (style guideline) or hard-fail after Phase 4 ships? (Recommend
   hard-fail — it locks the editorial voice the same way
   `verify_no_em_dashes` locks punctuation.)
6. **Phase 6 vs Phase 7 priority.** They're the two biggest lifts.
   If you can only ship one in the next month, which? (Recommend
   Phase 7 — the Compare tool is the acquisition lever; turnover
   bands are infrastructure.)

---

## 8. Pre-execution checklist

Before kicking off Phase 1:

- [ ] Founder approves the 6 decisions in §7.
- [ ] Confirm 14-gate prebuild is currently green (it is —
      commit `5cc1f2b` is the most recent prebuild-passing tip).
- [ ] Confirm RAM headroom (~150 MB used by current prebuild).
- [ ] Snapshot current `industry_cost_profile_v1.json` for rollback
      reference.
- [ ] Branch strategy: ship to `main` per phase, since each phase
      ends in a clean prebuild + commit + push (the established
      pattern for the signature panel rollout).

---

## 9. Approval

Founder, please respond with one of:

1. **"Go" / "Execute"** — I run the full 8-phase plan sequentially
   without further check-ins, committing + pushing per phase exactly
   the way I shipped the signature panel rollout.
2. **"Phase 1-3 only"** — ship the schema + key benchmark + motor
   vehicle in week 1; pause for a check-in before the copy + splits +
   compare-tool work.
3. **"Reorder"** — pick a different sequence (e.g., "Phase 7 first,
   it's the conversion hook").
4. **"Hold"** — pause, more questions, refine before any code.

Awaiting direction.
