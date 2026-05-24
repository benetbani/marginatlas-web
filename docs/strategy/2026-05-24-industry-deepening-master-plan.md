# Industry deepening — master plan (v32, Sprint G)

> Founder mandate: take Margin Atlas from one number per industry to a
> texture of numbers — sub-industry variants where they matter, a
> per-industry cost stack, one-time setup costs, hidden costs, and
> dynamic page sections that only appear when relevant. Premium-tier
> material; the long arc that turns Atlas from a reference into a
> decision-support product. **This document is plan only — no
> execution.**

---

## TL;DR

Four interlocking systems to build:

1. **Sub-industry variants** — a curated split layer for the ~30 of 192
   industries that genuinely contain different sub-shapes (barbershops:
   men's vs women's; fast food: global brands vs traditional vs kebab;
   lawyers: corporate vs divorce vs immigration). Variants surface as a
   chip selector on the cell page; the underlying data is real, not
   synthesized.
2. **Cost stack per cell** — beyond revenue/payroll/owner-take, add the
   *annual* operating cost stack (rent, utilities, supplies, marketing,
   insurance, regulatory) at industry × country resolution.
3. **Setup-cost block** — one-time costs to actually open the business:
   registration, licensing, fit-out, equipment, deposits. Country-
   specific and industry-specific.
4. **Dynamic page sections** — a section registry where each section
   declares which industries it applies to. Hostels get a construction-
   cost section; consultants do not. The cell page composes itself from
   the applicable sections instead of forcing every page through the
   same template.

Position the whole thing as the Margin Atlas Pro / Professional tier
content (free shows the parent industry's median; Pro shows the
sub-industry variant, the cost stack, and the setup-cost block).
Aligns directly with the gating recommendations from the May 24
monetization research.

This is months of work. The plan covers Phase 0 (framework + first 5
industries) through Phase 6 (full coverage + premium gating).

---

## Why this exists

Three problems the founder named:

1. **"Auto dealers" hides three businesses inside one number.** A used-
   car lot, a new-car franchise dealership, and an exotic-import
   showroom have completely different revenue, margin, and capital
   structures. Publishing one "auto dealers" median averages across all
   three and is useful to nobody.
2. **Every page is shaped the same.** The cell-page template renders
   the same set of sections for every (country × industry) — revenue
   tiles, distribution, waterfall, related. But construction needs a
   capital-cost section; consulting doesn't. Hotels need a property-
   acquisition section; software doesn't. Treating every industry
   uniformly makes the product feel generic.
3. **Setup costs are missing entirely.** The page tells you what a
   business *makes*, never what it *costs to open*. For anyone
   considering starting a business — which is half the audience — that
   omission is more important than the revenue figure.

The deepening fixes all three. It is the move from "directory of
benchmarks" to "decision-support tool for someone actually opening or
running a business."

---

## The split decision framework

When does an industry get sub-categories? When does it stay flat?

### Rule 1 — split when the sub-shapes have *materially different
economics*

A barbershop serving men vs a salon serving women differ by ~30% in
average ticket price, ~50% in average dwell time, ~3x in product
sales attached to the haircut. That's a material difference. Split.

A bakery selling bread vs a bakery selling pastries vs a bakery
selling birthday cakes differ but not by enough to matter for revenue
benchmarking. Don't split.

The diagnostic: **would the numbers for the sub-shapes differ by more
than 30% on at least two of the four core variables** (revenue,
payroll, owner take, margin)?

If yes → split candidate.
If no → leave flat.

### Rule 2 — split only when *real data exists* for each sub-shape

The reason to split is to surface real differences. Splitting an
industry into three sub-categories and then back-filling with the
parent average for all three is worse than not splitting — it
fabricates differentiation.

Diagnostic: **does the source data for the country actually break out
the sub-categories?** If yes, split is real. If no, the split is
synthesized and the page should NOT display it as separate variants.
Synthesized splits go on the Pro tier with an explicit "modeled"
badge, or not at all.

### Rule 3 — never split when the sub-shapes are *naming variants of
the same business*

A "trattoria" in Italy and a "ramen shop" in Japan and a "diner" in
the US are all the same business shape (small-format casual
restaurant, single-cuisine, owner-operated, 20-60 seats). Different
names, same economics. These are *local-name flavor* (see Section
"Local-name flavor layer"), not sub-industries.

### Rule 4 — when in doubt, don't split

The founder is explicit: over-splitting "misses the point." It's
better to have 192 well-populated parent industries than 600
half-empty sub-industries. The default answer is no.

### The first 30-ish split candidates

Based on the diagnostic above and the founder's examples, here is the
candidate list. Each line is `parent → proposed variants`. The third
column is the data-availability question that decides whether the
split actually ships.

| Parent industry | Proposed variants | Data availability |
|---|---|---|
| barbershops_hair_salons | men's barbershop / women's salon / unisex | Statista + national surveys often split |
| auto_dealers | used-car lot / new-franchise dealer / luxury-import | Trade-assoc reports usually split |
| restaurants | fast-food chain / sit-down independent / fine-dining | NAICS does this; most countries do |
| fast_food | global brand franchise / regional fast-casual / traditional street-food | NAICS partial; some countries miss |
| bars_pubs_clubs | neighborhood bar / nightclub / sports bar / cocktail lounge | Mixed; nightclub usually split |
| hotels_lodging | budget hostel / mid-market / boutique / luxury / extended-stay | Country-tourism boards split this |
| legal_services | corporate / litigation / family/divorce / immigration / solo-general | Bar associations split heavily |
| medical_practices | primary care / specialist solo / specialist group | Health-ministry data usually splits |
| accounting_bookkeeping | bookkeeping / small-firm / audit-firm | Trade-assoc data |
| clothing_stores | luxury / mid-market chain / value / vintage/used / sportswear | Retail-industry reports |
| jewelry_stores | luxury / mid-market / costume / pawn-resale | Industry reports |
| auto_repair_shops | independent general / dealership service / specialist (tire/glass/body) | Trade reports |
| beauty_wellness | hair salon / nail salon / spa / massage / med-spa | Mixed |
| fitness_gyms | big-box / boutique-studio / personal-training | Trade-assoc data |
| construction_residential | new-build single-family / renovation / multi-family / specialty trade | Census of construction does this |
| construction_commercial | general / specialty / infrastructure | Same |
| real_estate_agencies | residential brokerage / commercial brokerage / property management | NAR-type reports |
| veterinary_pet_care | small-animal clinic / large-animal-rural / specialty / mobile | Vet-association data |
| schools_education | private K-12 / language school / vocational / tutoring | Education ministries |
| dental_practices | general dental / orthodontics / cosmetic | Dental-association data |
| insurance_agencies | property/casualty broker / life-health broker / commercial broker | Industry-association data |
| event_planning | weddings / corporate events / festivals | Limited; trade publications |
| cleaning_services | residential maid / commercial janitorial / specialty (windows/carpets) | Trade data |
| transport_logistics | trucking / courier / freight-forwarding / warehousing | NAICS splits all |
| software_development | SaaS product / custom-build agency / consulting | Mixed; harder to source |
| beverage_manufacturing | beer microbrewery / wine / spirits / soft-drinks | Excise-tax registry |
| food_beverage_mfg | bakery wholesale / dairy / meat-processing / specialty | Census of manufactures |
| arts_entertainment | live-venue / theater / cinema / gallery | Mixed |
| funeral_services | full-service / cremation-only / cemetery | Trade data |
| childcare_services | home-based / center-based / preschool | Government registries |

That's 30 split candidates. Conservative estimate: ~half will pass the
data-availability test in the first round; ~75% will eventually be
covered.

### Industries that should NOT split (representative list)

- consultants (already single-shape)
- veterinary practices below the small-animal/large-animal cut
- locksmiths
- single-trade specialists (plumber, electrician, painter)
- most of the manufacturing 4-digit codes (already specific)
- newsstands / kiosks
- single-shape services (notaries, translators, photographers,
  freelance writers)

Default answer for everything not on the split list: leave flat.

---

## Global vs national categories — verdict

Founder's instinct is right: **go global, add local-name flavor as a
display layer, don't create country-specific category trees.**

Why:

- A national category tree multiplies maintenance by ~190× (every
  country needs its own taxonomy). Unsustainable.
- Comparability across countries is Atlas's core promise. National
  trees break it. A reader can't compare "what Italian people open as
  a *trattoria* vs what Spanish people open as a *bar de tapas*" if
  those are entirely separate taxonomy entries.
- Sub-shape differences are mostly captured by the sub-industry split
  above (men's vs women's barber works in every country); the
  remaining country-flavor is naming, not economics.

The architectural answer:

- Taxonomy stays global (sectors → industries → sub-industries).
- A small `local_aliases` table maps `(industry_id, country_iso2) →
  local_name`. The page displays the local name in parentheses next
  to the global name. Example: "Fast food (traditional) — *Kebab
  shop* in Turkey, *Pita shop* in Greece, *Doner shop* in Germany."
- No national-only taxonomy entries unless the business genuinely
  exists nowhere else (rare; e.g. "pachinko parlors" in Japan).
  These get added to the global taxonomy with a `prevalent_in:
  ["JP"]` flag and hidden by default in other countries.

### Local-name flavor layer — schema sketch

```ts
// One row per (industry, country) combination where a local name
// adds value. Most combinations have no row; the global name is used.
type LocalAlias = {
  industry_id: string;      // e.g. "fast_food_traditional"
  country_iso2: string;     // e.g. "IT"
  local_name: string;       // e.g. "Trattoria"
  local_name_translit?: string;
  pronunciation_hint?: string;
};
```

Used purely in the display layer (the heading on cell pages, the
search auto-complete, the OG-card title). The cell URL, the taxonomy,
the API stay in the global vocabulary.

---

## The per-industry cost stack

This is the biggest single change. Every cell needs a structured cost
breakdown, not just a revenue figure.

### Canonical annual cost stack

Eight line items per industry, every one in USD per typical firm per
year:

| # | Line item | What it covers | Why it matters |
|---|---|---|---|
| 1 | Rent / occupancy | Lease, mortgage, common-area charges | Single biggest fixed cost for most SMBs |
| 2 | Payroll (incl. employer side) | Wages + employer social contributions + payroll taxes | Already covered; refine to include employer side |
| 3 | Cost of goods sold | Inventory, raw materials, food/beverage | Defines gross margin |
| 4 | Utilities | Electric, water, gas, heat, internet, phone | Material for hospitality + manufacturing |
| 5 | Marketing / customer acquisition | Ads, SEO, listing fees, signage | Heavy for retail + restaurants |
| 6 | Insurance + professional services | Liability, accountant, lawyer, payroll service | Often 2-5% of revenue, sometimes more |
| 7 | Equipment + maintenance | Depreciation, repairs, replacement | Differentiates capital-intensive industries |
| 8 | Regulatory / licensing / industry fees | Annual permits, trade-assoc dues, training certifications | The hidden line founder explicit |

The cost stack rolls up to operating profit; operating profit minus
financing minus tax = owner take-home. The current waterfall on cell
pages already has a simpler version of this; the new version adds the
eight lines as real data, not heuristic ratios.

### Cost-stack variation by industry — examples

The same eight categories but the *weights* differ dramatically:

| Industry | Rent | Payroll | COGS | Utilities | Marketing | Insurance | Equipment | Regulatory |
|---|---|---|---|---|---|---|---|---|
| Restaurant (sit-down) | 8% | 32% | 30% | 4% | 3% | 3% | 2% | 1% |
| Software development | 6% | 65% | 1% | 2% | 8% | 2% | 4% | 1% |
| Hostel (mid-market) | 28% | 18% | 2% | 8% | 6% | 4% | 5% | 3% |
| Auto repair shop | 5% | 28% | 35% | 3% | 4% | 5% | 8% | 2% |
| Hair salon | 12% | 38% | 8% | 3% | 4% | 2% | 1% | 1% |
| Construction (residential) | 1% | 22% | 55% | 1% | 3% | 6% | 4% | 2% |
| Law firm (solo general) | 12% | 35% | 1% | 2% | 8% | 6% | 2% | 5% |
| Hotel (mid-market) | 22% | 28% | 6% | 7% | 7% | 4% | 8% | 3% |

The fact that restaurants are 30% COGS but software is 1% COGS is
exactly what makes per-industry treatment necessary. The current
generic waterfall flattens these into the same shape and is wrong on
most pages.

### Where the data comes from

Per cost line, per (industry, country), the candidate sources:

- **Trade-association annual reports**: NRA (restaurants), AHLA
  (hotels), NAR (real estate), ABA (lawyers), etc. Most G20 countries
  have national equivalents. Cost-line breakouts usually published.
- **Industry-research vendors**: IBISWorld, Statista premium,
  Euromonitor. Expensive but precise.
- **Government tax filings**: aggregate corporate tax returns
  published by NSO sometimes break out cost lines (especially in EU
  via VAT records).
- **Franchise disclosure documents (US)**: every US franchise must
  publish an FDD with detailed cost breakdowns. ~3000+ FDDs available
  free via FTC database. Goldmine for restaurants, hotels, retail.
- **Cost-of-doing-business surveys**: World Bank Doing Business, OECD
  SME Outlook, Eurostat SBS.
- **Manual researcher curation**: for the 10-30 most important
  industries × top 20 countries, a researcher manually compiles the
  cost stack from primary sources. Slow but high-quality.

The cost-stack values are **NOT extrapolated by formula** the way
revenue currently is. They are either real (from a source) or absent.
Synthesizing them defeats the purpose.

---

## The setup-cost block

Two boxes per cell — *one-time costs to open*, separate from annual
costs.

### Box 1 — registration + licensing (the legal/regulatory cost)

What it costs to legally exist as this business in this country:

| Field | Example values |
|---|---|
| Business registration fee | US LLC $50-500; Italy SRL ~€2,500; UK Ltd £12 |
| Industry-specific licenses | Restaurant: health permit, alcohol license; Salon: cosmetology board; Hostel: tourism license |
| Professional licenses (if required) | Lawyer: bar admission; Accountant: CPA; Vet: state license |
| Insurance bonds | Contractor bond, liquor liability, etc. |
| Annual permit renewals (one-time first year) | Usually small but additive |
| Industry-specific certifications | Food handler, OSHA, HACCP, etc. |

Country-specific. Industry-specific. Often small numbers (€500-€5K)
but the user needs the actual figure.

### Box 2 — capital fit-out + equipment (the physical-business cost)

What it costs to actually open the doors and serve the first customer:

| Field | Example values |
|---|---|
| Property fit-out / build-out | Restaurant kitchen ~$150K-$500K; hostel rooms ~$10K/room |
| Equipment | Salon chairs/stations; pizza oven; gym equipment |
| Initial inventory | Restaurant 1-month food; clothing store opening collection |
| Working-capital reserve | 3-6 months of operating cost as cash buffer |
| Lease deposit | Usually 2-6 months rent |
| Pre-opening marketing | Branding, signage, soft-launch, opening event |

This is where the big numbers are. A hostel opening in Madrid might be
€80K-€200K depending on rooms; a consultant opening in Madrid is ~€500.
The user comparing "do I open a hostel or do I become a consultant" needs
to see this gap.

### Display behavior

Both boxes appear ABOVE the revenue tiles on the cell page, marked
clearly as one-time costs. The annual revenue and cost stack are
separately marked as recurring. The user can mentally compute "payback
in years = setup / (revenue × margin)" — and we should compute it for
them as a single derived field at the bottom of the setup-cost block.

### When the boxes do NOT appear

Setup costs are irrelevant for some industries:

- **Pure independent professionals** (consultant, freelance writer,
  translator) — setup ≈ $0 in any country, no need for a section
- **Pre-existing structures** (franchisee buying an existing
  location) — the section should be replaced by a "franchise fee +
  acquisition" alternate panel
- **Industries we don't have setup-cost data for** — section
  suppressed entirely (the dynamic-section system handles this)

---

## The dynamic page-section system

The cell page is currently a fixed sequence: hero → narrative →
revenue tiles → distribution → waterfall → tax/cost panel → related
cells. Every cell goes through it. The deepening introduces sections
that should only appear for certain industries.

### Architecture: a section registry

Each section is a typed entry:

```ts
type SectionDef = {
  id: string;                       // "setup-costs"
  title: string;                    // "Cost to open"
  appliesTo: {
    industries?: string[];          // explicit allow-list
    sectors?: string[];             // by sector (broader)
    minCapitalIntensity?: number;   // dynamic rule
  };
  requiresData: string[];           // e.g. ["registration_fee", "fit_out_cost"]
  priority: number;                 // render order
  tier: "free" | "pro";             // gating
  Component: React.ComponentType<{ cell: Cell }>;
};
```

A section renders if:
1. The industry matches `appliesTo`
2. All `requiresData` fields are populated on the cell
3. The user's tier permits

Otherwise it's skipped. The page composes from the matching list,
sorted by `priority`.

### Concrete section catalog (proposed)

| Section ID | Title | Applies to | Free / Pro |
|---|---|---|---|
| identity | (hero) | all | free |
| coverage-indicator | (chip) | all | free |
| editorial-note | (one-paragraph context) | all | free |
| revenue-tiles | Typical revenue + employees + wage | all | free |
| sub-industry-picker | Variant selector chips | only industries with split-list variants | free (parent), Pro (deep variant) |
| setup-cost-block | One-time registration + capital fit-out | only industries with capital-intensity > 0 | Pro |
| annual-cost-stack | Eight-line cost breakdown | only industries with stack data | Pro |
| margin-waterfall | Revenue → owner take | all | free (simple), Pro (decile bands) |
| distribution | Decile distribution | all | free (median), Pro (full distribution) |
| time-series | Multi-year trend | only cells with > 3 years history | Pro |
| franchise-economics | Initial fee + royalty + AUV | only retail + restaurant + service-franchise industries | Pro |
| local-regulation-notes | Notable local rules (alcohol licensing, professional req's) | only industries that are heavily regulated locally | Pro |
| climate-risk | For industries weather-sensitive (agriculture, tourism, outdoor leisure) | flagged industries | Pro |
| seasonality | For industries with strong seasonal swings | flagged industries | Pro |
| comparison-panel | Side-by-side vs nearby cells | all | free (1 compare), Pro (5 compares) |
| related-cells | "See nearby cities/industries" | all | free |

This is ~16 distinct section types, of which any given cell renders
maybe 6-10. The hostel-in-Madrid page would render: identity, coverage,
narrative, revenue tiles, sub-industry picker (if hostels split into
boutique/budget/etc.), setup-cost block (big number), annual cost
stack, margin waterfall, time series, comparison panel, related cells.
That's ~10 sections — rich without being noisy.

The consultant-in-Madrid page would render: identity, coverage,
narrative, revenue tiles, margin waterfall, comparison, related. ~7
sections. No setup-cost block (≈$0), no time series if data thin, no
regulation notes.

This is the founder's "each business category should not be treated in
the same exact way" — operationalized.

---

## Data acquisition methodology

The biggest unknown is sourcing. Per the cost-stack section, we have
five candidate channels: trade-association reports, premium research
vendors, government filings, franchise FDDs, manual researcher
curation. The realistic operating model:

### Tier 1 — countries where we go deep

Pick **5 pilot countries** with the strongest data ecosystem:

1. **United States** — FDD database, Census economic statistics, BLS
   wage data, state-by-state licensing databases. Best coverage.
2. **United Kingdom** — Companies House filings, ONS small-business
   data, trade-association annual reports, FCA registry.
3. **Germany** — Destatis SBS, Handwerkskammer (chamber data), VDP
   real-estate, sector-specific industry reports.
4. **France** — INSEE SBS, CCI data, sector federations (Synhorcat for
   restaurants, etc.).
5. **Italy** — ISTAT, CCIAA chamber data, sector federations
   (Confcommercio, Confindustria).

For these five, target **full coverage of the 30 split candidates plus
the cost stack**. Manual researcher time: ~2 weeks per country to
build the v1 dataset, then quarterly refresh.

### Tier 2 — countries where we cover the basics

A second wave of ~15 countries (Spain, NL, BE, AT, CH, NO, SE, DK, FI,
PL, CZ, AU, CA, JP, KR). Cover the top 50 industries with revenue +
cost stack from public sources only; skip the setup-cost block where
data thin.

### Tier 3 — countries where we currently have extrapolation

The remaining ~170 countries continue with the current extrapolation
model, with new sub-industry / cost-stack data marked clearly as
"estimated from regional patterns" and hidden behind the Pro tier
"modeled" badge.

### Researcher process per industry × country

For each (industry, country) in Tier 1-2 scope:

1. **Identify the canonical sources**: government NSO + trade
   association + (if US) FDD. Document the URL + access date.
2. **Extract the cost stack** from those sources into the canonical
   8-line schema. If a source uses different cost-line definitions,
   document the mapping.
3. **Extract the setup-cost block**: registration fee from
   government, licensing fees from regulator, fit-out from FDDs or
   trade reports, working-capital reserve = 0.25 × annual operating
   cost.
4. **Calibrate against the existing revenue benchmark**. Implied
   operating margin from cost stack should be within 25% of the
   currently-reported margin. If not, investigate.
5. **Write a one-paragraph methodology note** for the cell — what the
   sources are and what's modeled vs measured. The note is hidden
   from the public page but available in the admin review interface
   and in the audit trail.
6. **Quality-grade the cell**: A (all from primary sources within last
   2 years), B (mix), C (mostly extrapolated, anchored to recent
   benchmark), D (mostly modeled).

Time estimate: 30-60 min per (industry, country) for an experienced
researcher. For 30 industries × 5 Tier-1 countries = 150 cells,
~75-150 hours of research per pass. Quarterly refresh.

### Algorithmic / extrapolation channel for Tier 3

For countries we can't research manually, the existing extrapolation
engine extends to the new cost-stack fields by:

- Building per-industry cost-share ratios from Tier 1 data
  (e.g., "globally restaurants average 30% COGS, 32% payroll, 8%
  rent")
- Scaling rent by city-level rent indices (we have these)
- Scaling payroll by country-level wage indices (we have these)
- Marking the result as "Modeled" with a low quality grade

This works as a fallback but is not the primary source. The Pro tier
should ideally surface Modeled cells with a clear caveat, not the
Modeled values dressed up as measurement.

---

## Phased rollout

Six phases, ~12-18 months total to "full coverage." Each phase ships
independently; nothing waits on the next.

### Phase 0 — framework + data schema (2 weeks)

- Define the `SectionDef` registry and the cell-page composer.
- Extend the `Cell` type with `sub_industry_id`, `cost_stack`,
  `setup_costs`.
- Add a `sub_industries` table to Supabase + a `local_aliases` table.
- Migrate the existing cell-page render to read from the registry
  (every section becomes a registry entry). Compatibility: no visible
  change yet; this is plumbing.
- Add Phase-0 prebuild gates that verify the registry is well-formed.

### Phase 1 — first 5 industries fully deepened in US + UK (4 weeks)

Pick the 5 highest-traffic industries with the strongest data
availability:

1. Restaurants
2. Coffee shops / cafes
3. Hair / beauty salons
4. Auto repair shops
5. Hotels (mid-market)

For each, in US + UK:
- Define sub-industry variants
- Source the cost stack from FDDs + trade reports + government
- Source the setup-cost block
- Build & deploy the sub-industry picker UI
- Build & deploy the setup-cost-block component
- Build & deploy the annual-cost-stack component
- Quality-grade every cell

Ship behind a feature flag at first. Internal review. Iterate copy
and visualization until it reads well. Then unflag.

### Phase 2 — DE + FR + IT for the same 5 industries (3 weeks)

Same pattern, three more countries. Tests whether the framework
generalizes outside Anglo data ecosystems.

### Phase 3 — expand to the full 30-industry split list (8-12 weeks)

For the original 5 pilot countries, deepen the remaining 25 industries
on the split list. Researcher time is the gating factor; parallelize
with 2-3 researchers if budget allows.

### Phase 4 — Tier-2 countries (the 15-country expansion) (8 weeks)

Spain, NL, BE, AT, CH, etc. Cost stack + setup-cost block from public
sources; sub-industry splits only where source data supports them.

### Phase 5 — premium tier launch (parallel with Phase 3-4)

Wire the existing free / Pro / Professional plan structure to the
section registry. Free users see parent industry + median revenue +
basic margin waterfall. Pro users see sub-industry variants + cost
stack + setup-cost block + distribution. Professional adds API,
exports, comparison-with-multiple-cells.

Coordinate with the monetization research recommendations
(Crunchbase-style inline lock icons, no scroll-jacking, no exit-intent).

### Phase 6 — Tier-3 algorithmic extrapolation + local-name flavor (ongoing)

For the remaining 170 countries, apply the algorithmic cost-stack
extrapolation, mark cells Modeled. Local-name flavor layer rolls out
country-by-country as researchers add aliases.

---

## What we do NOT build (deliberate omissions)

- **National-only taxonomy trees.** Founder explicit. Local-name
  flavor handles 95% of the value; national taxonomy handles 5% at
  10x the maintenance cost.
- **A "build a business plan for me" generator.** Margin Atlas
  provides the inputs; it does not write the user's plan. Sliding
  into plan-generation territory turns us into a different (worse)
  product.
- **Real-time cost data.** Cost stacks refresh quarterly at best.
  Anything faster requires payment-data partnerships we don't have.
- **AI-generated sub-industry text.** All sub-industry naming,
  copy, and methodology notes are human-authored. AI-generated
  category names destroy editorial trust faster than anything else
  on this list.
- **Hyper-local variants below sub-industry.** "Italian restaurant in
  the Marais vs Belleville" is too granular. We stop at sub-industry
  × city, not sub-industry × neighborhood.
- **A "compare to my actual P&L" tool.** Calculator already does
  this in a simplified way. Going deeper requires real accounting
  integration which is a different product.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Data sourcing slower than estimated | High | High | Start Phase 1 small (5 industries × 2 countries); learn pacing before scaling |
| Cost-stack data quality is poor for non-US countries | Medium | High | Tier 1 vs Tier 2 split; suppress sections rather than show bad data |
| Sub-industry splits proliferate beyond the 30 | Medium | Medium | Hard rule: split list grows only by founder approval; reject "but this industry should also be split" requests by default |
| Dynamic-section system gets too complex | Medium | Medium | Cap section count at 20; cap conditions at allow-list + 1 dynamic rule per section |
| Pro-tier paywall over-aggressively gates the free site | Medium | High | Follow May 24 monetization research: gate resolution not topic; free user must still see useful pages |
| Synthesized sub-industry data leaks onto pages without "modeled" badge | High | High | Phase 0 prebuild gate verifies every sub-industry-variant cell has a quality_grade ≥ C OR a modeled flag |
| Local-name flavor confuses search / SEO | Low | Medium | Local names appear in display only; URLs, sitemap, OG titles stay in the global vocabulary |
| Researcher time exceeds budget | High | High | Start with researcher contract that covers Phase 1 only; expand based on results |
| The framework outgrows what the SMB audience needs | Medium | Medium | Pilot with 5 industries; review with the founder + 3-5 real SMB users before Phase 2 |

---

## Acceptance criteria per phase

The phase is "shippable" when:

**Phase 0** — registry exists; every existing cell-page section reads
from registry; no visible change to live site; prebuild gates pass.

**Phase 1** — 5 industries × 2 countries (US + UK) fully deepened;
every Phase-1 cell has a quality_grade ≥ B (mostly primary sources);
side-by-side comparison shows the new pages are richer than the old.

**Phase 2** — same as Phase 1, three more countries (DE, FR, IT).

**Phase 3** — full 30-industry split deployed in the 5 pilot countries;
< 5% of split cells fall back to parent-industry data.

**Phase 4** — Tier-2 countries covered; ≥ 80% of top-50-industry cells
in those countries have a populated cost stack.

**Phase 5** — Pro tier shipped; free cells still answer the SEO query;
Pro cells unlock genuine extra resolution; conversion rate is measured.

**Phase 6** — every cell in every country renders the appropriate
section composition (no orphan sections, no missing-data warnings on
public-facing pages).

---

## Decisions (founder confirmed 2026-05-24)

All eight open questions resolved before Phase 0 execution started:

1. **Researcher budget: zero outside researchers.** Founder + agent do
   the work together. Paid subscriptions OK only when ROI is obvious
   and pre-approved. Candidate paid sources to evaluate later (NOT
   purchased now):
   - Statista premium individual (~$1K/yr) — likely worth it for the
     cost-stack lines on common industries
   - IBISWorld pay-per-report (~$1K each) — probably worth it for the
     5 pilot industries × 2 reports each
   - Bureau van Dijk Orbis subset — likely too expensive
   - Trade-association memberships per country (varies, $200-$2000/yr)
   - All FREE: US FDD database (FTC), Eurostat SBS, country NSO portals
   This collapses the Phase 1-4 cost estimate from $40K-$100K to
   roughly $2K-$10K total in subscriptions across the whole 18 months.

2. **Pro tier pricing: $39/month for now.** Locked enough to design
   features against; not so locked that we can't adjust at launch.

3. **Pilot countries: expanded set.** Original 5 (US, UK, DE, FR, IT)
   plus founder additions (ES, JP, AE, SG, CH). Stretch list of 30
   pilot countries acceptable; first wave of 10 above. Adding UAE +
   Singapore expands the geographic coverage into MENA and Southeast
   Asia, which the original Anglo + EU sample missed.

4. **Split-list approval process: Phase 1 exposes issues.** No
   per-industry 1-pagers up front. Trust the framework, ship the
   first 5 industries, let real data acquisition tell us which splits
   were wrong.

5. **Sub-industry fabrication policy: hard no.** A sub-industry
   variant ships only when real primary-source data exists for it.
   Variants with only parent-extrapolated data stay hidden. Prebuild
   gate enforces this (see Phase 0f).

6. **Local-name flavor sourcing: web search + crowdsourced.** Founder
   + agent populate the obvious ones from web searches (Italian
   "trattoria", Japanese "izakaya", Turkish "kebapci"). Add a small
   inline UI later for native speakers to suggest corrections; review
   queue handles them. No paid translators.

7. **Mobile section behavior: expanders.** Sliver of each section
   visible by default (title + a teaser line); user taps to expand.
   Not collapsed-to-zero, not all-inline. Founder explicit.

8. **Cost-stack versioning: overwrite (no history).** Latest values
   only. Simpler schema, less storage, no time-series risk-of-staleness.
   If we later want time-series, we can introduce versioning as an
   additive schema change.

These decisions are baked into the Phase 0 code and SQL migrations
that ship alongside this plan.

---

## How this connects to other in-flight work

This plan touches several existing threads:

- **Phase 0 currency fix (`185349a`)** — sub-industry data for Mexico
  needs the same FX correction. The pipeline extension should respect
  the existing `CURRENCY_FX_CORRECTIONS` map.
- **Phase 1+3+6 plausibility suppression (`a68f319`)** — sub-industry
  bounds need to be added to `REVENUE_PER_FIRM_BOUNDS`. A women's
  salon shouldn't be tested against the same range as a unisex shop.
- **Monetization research (`docs/strategy/2026-05-24-monetization-research.md`)**
   — Pro tier gating shape is already specced; this plan is the
  content that fills it.
- **Quality audit / reformation plan
  (`docs/strategy/2026-05-24-quality-audit-and-reformation.md`)** —
  the dynamic section system replaces ad-hoc section additions and
  removals on the homepage and cell pages. Once registry exists, the
  audit becomes "which sections does each route compose, and do
  any need to be added or removed."
- **Typography research prompt
  (`docs/strategy/2026-05-24-typography-prompt.md`)** — when the
  typography decision lands, every new component built for the
  deepening (sub-industry chip, cost-stack tile, setup-cost block)
  should ship with the new typography from day one.

---

## Position statement (for the founder to keep on the wall)

The deepening is what turns Margin Atlas from "a directory of
benchmarks" into "the tool you actually use before you sign a lease."

The free site stays the SEO destination — answers "how much does a
restaurant in Madrid make." The Pro tier becomes the decision-support
product — answers "what kind of restaurant, what does it cost to open
this kind specifically, what's the cost stack quarter by quarter, am I
overpaying on rent vs the median, and what's the break-even payback
in months."

The free product compounds traffic. The Pro product compounds
revenue. The deepening is the bridge between them.
