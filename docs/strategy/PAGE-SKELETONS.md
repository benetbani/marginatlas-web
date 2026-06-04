# Page Skeletons (Bible-grounded blueprint)

> Written 2026-06-04. The super-detailed, written skeleton of what every page
> of Margin Atlas should contain, derived from REFORMATION-BIBLE.md. Each
> section names: what it shows, the Bible reference, the data source, and the
> status (HAVE = already on the cell/country data; COMPUTE = derivable from
> existing fields; CURATE = needs a curated dataset like the London drop;
> DROP = needs a research/data drop or a new table). No code here. This is the
> spec; implementation follows it page by page.

---

## 0. Global conventions (apply to every page)

**Voice (Bible S25).** Blunt, practical, data-rich, skeptical of easy money,
slightly witty, never corporate fluff. The one hard rule: never name an upside
without naming the thing that can kill it. Reuse the S25 microcopy registers:
weak market, strong-but-not-idiot-proof, thin data, high-friction,
expensive-but-profitable, poor-owner-economics.

**Decision-first order (S1, S5, S14).** Every page leads with the answer, not a
description. The top of every data page is a DASHBOARD of tables and stat-grids
that can be perceived in seconds. Prose drops below the data. The page must
answer: can this business make money here, and under what conditions.

**Confidence (S9, S19).** Show a number when the source is official/recent and
the geo/industry match is good. Show a range when modeled or the country has
informality. Hide or downgrade when the sample is thin or precision would
mislead. NEVER fake a number, never show a "low confidence" badge, never an
apologetic placeholder. Modeled data carries ONE quiet methodology line per
block ("Modeled from national business demography. Directional."), never
per-row badges. Anti-fake-precision: never "12.4%" when the honest answer is
"8 to 15%".

**Scores (S10).** 0 to 100, banded (80+ strong, 60 to 79 workable, 40 to 59
mixed, 20 to 39 weak, under 20 avoid), no decimals, higher always better, shown
only when defensible. Best-early five surfaced on data pages: Opportunity,
Local Profitability, Market Saturation, Rent Pressure, Owner Take-Home. Market
Deformation is a deeper/expert layer, never the hero score.

**Hide-weakness + self-omit.** Any module whose data is null renders nothing.
No "coming soon", no "data unavailable", no zeros-as-data.

**Free-only this round.** No paywalls/auth/Stripe. Where the Bible marks a
module "paid", we either show the free version or omit; the skeleton tags the
intended free/paid split for later, but everything ships free now.

**Chrome (every page).** Header: brand, primary nav (Activities, Countries,
Cities, Compare, Calculator, Learn), search. Footer: browse columns
(All countries, All cities, All activities), Methodology, About the data,
Blog, status. Mobile-first; real h1/h2/h3; preserve SEO (canonical, JSON-LD,
breadcrumbs); never rename slugs.

---

## 1. Home ( / )

Purpose (S8, S25, S26): make a stranger understand the product in one screen and
start a search.

- Eyebrow: the #1 leadership claim.
- H1: the rotating question "How much does a [business] make in [city]?"
  (server-renders a concrete question for crawlers).
- Subtitle: "Know if a business works before you risk your money."
- Primary CTA: the navigator search (business + place). [HAVE]
- World map "pick a country" (browse by place). [HAVE]
- "What Atlas weighs" strip: the forces the product accounts for (rent, wages,
  taxes, competition, pricing power, owner take-home, survival, friction). S1/S26. [HAVE]
- Featured cells grid: 6 real industry-in-place tiles. [HAVE]
- "What you can ask Atlas": 6 decision-first example questions, each lands on a
  live cell (S25 voice). [HAVE]
- Editorial rail: latest data stories (S13 Tier 3). [HAVE]
- Trust strip: one line to methodology (S19). [HAVE]
- NOT on the home: no whole-world averages, no generic SaaS hero.

---

## 2. Activity in a place / CELL ( /[country]/[geo]/[industry] ) FLAGSHIP

The S6 29-module blueprint, reorganized decision-first: a dashboard of tables at
the top, then the deep-dive. This is the page that must be nailed.

### 2.1 Hero (S6 #1, S25)
- Eyebrow: activity + place.
- H1: "How much does a [activity] make in [place]?"
- Verdict: one sentence naming the upside AND what can kill it (S25). [HAVE]
- Headline Opportunity score (0 to 100) + typical revenue range. [HAVE]
- Coverage/quality dot + currency + year/size switcher. [HAVE]

### 2.2 DASHBOARD (data-first, stat-grid sections, each self-omits)
- **The numbers** (S6 #2-6): typical revenue, gross margin, net margin, owner
  take-home, break-even (orders/day vs typical), people working, wage per
  employee. [HAVE]
- **The market** (S4-B, S10 Saturation, S20): competitors (firm count) [HAVE],
  density per 10k residents [COMPUTE], market structure / typology
  (fragmented vs concentrated vs oligopoly) [COMPUTE from firm-size mix or
  CURATE], revenue concentration / top-operator share [CURATE], chain and
  franchise share [CURATE], informality pressure [CURATE].
- **Survival** (S6 #14, S10 Survival/Fragility, ONS-style demography): 1-year,
  3-year, 5-year survival, annual churn (birth/death). [CURATE]
- **Pricing and demand** (S4-C, S4-G, S6 #8, #15-17): pricing power, premium
  room, willingness to pay, demand drivers (locals/tourists/office/students),
  seasonality pattern. [CURATE; tourism/footfall later DROP]
- **Cost stack / where the money goes** (S6 #5): COGS, labor, rent, utilities,
  other as shares; the 9-line annual cost stack when present. [HAVE when
  cost_structure/cost_stack populated; else omit]
- **Setup and capital** (S4 capex, S6 #25): registration, fit-out/equipment,
  working-capital months, payback months. [HAVE when setup_costs populated]
- **Business climate** (S4-E, S4-F, S18): GDP per capita, average income, net
  wealth per adult, self-employment rate, days to register a business,
  inflation, rent pressure, labor pressure. [HAVE country economics]
- **The scores** (S10): the best-early five as a compact panel. [HAVE]

### 2.3 DEEP-DIVE (below the dashboard, prose allowed, each self-omits)
- Revenue distribution low/median/top operators (S6 #3, percentile chart). [HAVE]
- Cost waterfall with provenance (S6 #5). [HAVE]
- Break-even detail + sensitivity (rent/wage/COGS shock) (S6 #6, #23). [HAVE be; sensitivity COMPUTE]
- Owner take-home detail: salary + profit after tax, "can it support a family?"
  (S6 #4, #24). [HAVE; the 10+ employee floor applies]
- Rent pressure: rent vs revenue, viable rent ceiling (S6 #11, S4-H). [COMPUTE/CURATE]
- Labor pressure: payroll share, hiring difficulty (S6 #12, S4-I). [HAVE payroll; difficulty CURATE]
- Tax and compliance: VAT/payroll/corporate wedge, permit complexity (S6 #10, S4-E). [HAVE wedge via net-profit; permits CURATE]
- Market deformation expert layer: informality, tourism distortion, platform
  fees, enforcement (S20). Component radar/notes, clearly modeled. [CURATE/DROP]
- Independent viability: can an indie win here? (S6 #19, S10). [COMPUTE from pricing - chain/rent pressure]
- What kills weak operators (S6 #22): failure cards. [HAVE]
- Top 10% operator playbook (S6 #21). [CURATE editorial]
- Compare: same activity in other UK cities / nearby (S6 #26). [HAVE]
- Related activities + related places (S6 #27-28). [HAVE]
- "Run your exact rent, payroll, concept" link to the calculator (S6 #6). [HAVE]
- Methodology + sources + last-refreshed line (S19). [HAVE]

### 2.4 SEO/meta
- generateMetadata, Dataset + FAQ + Breadcrumb JSON-LD, canonical, ISR. Preserve. [HAVE]

---

## 3. Neighborhood cell ( /[country]/[geo]/[industry]/[sub] )

Same skeleton as the cell, scoped to a neighborhood, plus:
- Neighborhood character note (footfall, catchment, parking) (S4-H, S6 #15). [CURATE]
- Rent micro-pressure vs the city average (S4-H). [CURATE]
- "How this neighborhood differs from [city] overall" delta line. [COMPUTE]
- Self-omit aggressively; neighborhoods are thin. Show only what is defensible.

---

## 4. Country ( /[country] )

Purpose (S5 country page): the small-business operating climate of a country.

- Hero: "Small business economics in [country]" + a viability lede + the
  friction-adjusted one-liner (S5, S1). [HAVE]
- DASHBOARD:
  - Business climate stat-grid (S4-E/F, S18): GDP/capita, average income, net
    wealth, self-employment, days to register, inflation, corporate/VAT/payroll
    tax wedge. [HAVE]
  - Tax reality module: the visible tax load and what it does to take-home
    (S4-E, S10 Tax Burden). [HAVE country tax-reality]
  - Institutional friction (country-level only): permit/tax/informality signal
    (S4-F, S20), no individual accusations. [CURATE/DROP]
  - Survival baseline by sector for the country (S6 #14). [CURATE]
- Top activities in the country: ranked, with typical revenue + a one-word
  verdict each (S5). [HAVE]
- Best and hardest businesses (S5 ranking rows). [COMPUTE from net margin]
- Top cities / regions entry (S5). [HAVE]
- Compare to peer countries (S5). [COMPUTE]
- Methodology + confidence. [HAVE]
- Reform note: lead with the friction-adjusted climate, not generic macro.

---

## 5. Region / state ( /[country]/[geo] )

Purpose: the operating conditions inside a first-level region (states, Lander,
nations). Regions are always the BIGGEST first-level entities only.

- Hero: region name + flag + viability lede. [HAVE]
- DASHBOARD: regional climate (wages, rent pressure, demand depth) where it
  differs from the country (S4-H/I, S18). [COMPUTE/CURATE]
- Top cities in the region (cards). [HAVE]
- Top activities in the region by what the owner keeps (S5). [HAVE]
- Compare to other regions in the country. [COMPUTE]
- Self-omit when regional data is thin; fall back to country signal.

---

## 6. City ( /cities/[slug] ) + /neighborhoods + /curiosities

Purpose (S5 city page): local opportunity. Best and hardest businesses here.

- Hero: "Best and hardest businesses in [city]" + a city viability lede. [HAVE]
- DASHBOARD:
  - City demand stat-grid: population, income, tourism intensity, commuter/
    student/office mix (S4-G). [CURATE/DROP]
  - Rent pressure summary: where rent eats the margin (S4-H, S5 rent map). [CURATE]
  - Market saturation summary: business density per 10k (S4-B). [COMPUTE]
- Best businesses to start here (S5, S21): ranked by opportunity, segmented by
  founder type (low-capital / lifestyle / B2B). [COMPUTE]
- Hardest businesses to run here (S5): fragility, labor, rent, saturation. [COMPUTE]
- Most profitable businesses here (S5): margin vs owner take-home, kept distinct. [HAVE]
- Industry mosaic: representative activities with median revenue, each links to a
  cell. [HAVE]
- Neighborhoods entry + sister-city comparisons (S6 #26-27). [HAVE]
- City character (curated editorial) where present. [HAVE]
- /neighborhoods sub-page: ranked neighborhoods by rent/demand, each a card. [CURATE]
- /curiosities sub-page: editorial city facts (S13 Tier 3 backlink content). [HAVE]

---

## 7. Activity ( /industries/[industry] )

Purpose (S5 industry page): the business-model anatomy of an activity, then
"pick a place". Never a whole-world average (S1 avoid, S13).

- Hero: "How [activity] businesses make money" + the model lede (where the
  dollar goes, what kills weak operators) (S5 "business model anatomy"). [HAVE]
- DASHBOARD (place-agnostic structure, S4-A ratios):
  - Cost-structure anatomy: gross/operating/net margin shape, asset intensity. [HAVE]
  - Capital intensity + typical setup (S4 capex). [CURATE]
  - Labor intensity + owner-operator dependence (S4-I). [CURATE]
  - Survival baseline for the activity (S6 #14). [CURATE]
  - Pricing power archetype + demand drivers (S4-C/G). [CURATE]
- "Now pick a place": guided entry to the deepest-coverage places for this
  activity (mirror /world: breadth-first, grouped by region), with a
  data-depth signal, NOT a single global number. [COMPUTE breadth]
- Best and worst places for this activity (S5), once data supports it. [COMPUTE]
- Related activities in the same family. [HAVE]
- Reform note: fix the index copy that oversells (no "see how it earns
  worldwide: revenue/percentiles"); promise structure + "pick a place".

---

## 8. Compare

### 8.1 /compare (builder)
- Pick an activity across up to 3 places (S5 comparison, S7 MVP). [HAVE]
- Side-by-side dashboard: revenue, margins, owner take-home, rent/labor
  pressure, saturation, survival, scores. Honest p10 to p90 spreads, never a
  faked waterfall (S5 "where margin goes"). [HAVE money; market/survival CURATE]
- "Where the margin goes" differential: the single biggest reason place A beats
  place B. [COMPUTE]

### 8.2 /compare/cities/[pair]
- Pre-curated city-vs-city economics, same side-by-side dashboard, SEO landing. [HAVE]

---

## 9. Decide ( /decide, /decide/[activity]/[city] )

Purpose (S21 Founder Opportunity): "what business should I start here?"

- /decide: lead with the decision. Best vs hardest by net margin, by founder
  type (conservative / low-capital / lifestyle / B2B / scalable) (S21 variants). [HAVE best/hardest]
- /decide/[activity]/[city]: the opportunity verdict for one activity in one
  city: Founder Opportunity score + the components (demand, competition,
  pricing, capital, friction, survival) (S21 formula). [COMPUTE/CURATE]
- "Do not open unless..." warning line (S25, S5 best-businesses distinctive move). [HAVE voice]

---

## 10. Calculator ( /calculator )

Purpose (S6 #6, S8 #2-3): free break-even + owner take-home.

- Inputs: rent, payroll, COGS, concept, seats/units. [HAVE]
- Outputs: break-even revenue (month/day), owner take-home after tax,
  rent/wage sensitivity (S8 #5). [HAVE]
- "Your scenario vs the local typical" delta when arrived from a cell. [COMPUTE]
- Free-only; no scenario-save wall this round.

---

## 11. Country/region industry hubs ( /[country]/industries, /[country]/[geo]/industries )

- Grouped directory of activities by sector (taxonomy grouping kept; sector
  PAGES removed). [HAVE]
- Each activity card: typical revenue + a one-word verdict, links to the cell. [HAVE]
- Top-level internal-link nexus for topical authority (S13). On-demand ISR.

---

## 12. Indexes

- /industries: A to Z of activities + the corrected promise (structure, then
  pick a place). [HAVE, copy fix]
- /cities: directory grouped by market depth, compact cards. [HAVE]
- /countries: continent sections, each a responsive grid of country cards
  (no one-per-row). [HAVE, fixed]
- /world: breadth-first guided atlas (coverage counts, never global averages);
  hands depth to /coverage. [HAVE, already correct]

---

## 13. Coverage ( /coverage, /coverage/[iso2] )

Purpose (S9, S19): trust as a feature. What is measured vs modeled.

- /coverage: global coverage map/index. [HAVE]
- /coverage/[iso2]: per-country scorecard: regional vs extrapolated counts,
  industries, geographies, tiers, average quality, year range, last refreshed
  (S9 confidence labels, S18 source). [HAVE]
- Frame as confidence, never apology.

---

## 14. Methodology ( /methodology, /methodology/key-benchmarks )

Purpose (S19): the trust front door.

- How each score is computed (S10), source priority (S9), the confidence model,
  estimate version, data-age, "do not use this for" warnings, correction-request
  path, no-advice disclaimer (S19 trust list). [HAVE]
- /key-benchmarks: the anchor benchmarks and how they are assigned. [HAVE]
- No source-agency names; describe source TYPES ("national business statistics").

---

## 15. Learn ( /learn, /learn/[slug] )

- /learn: escalating argument, not a list; the questions a skeptical operator
  asks (S25). [HAVE]
- /learn/[slug]: one-line answer up top, then the explanation; each ties back to
  a live cell or the calculator (S13 page-types). [HAVE]

---

## 16. Blog ( /blog, /blog/[slug] )

- /blog: featured + chronological river of data stories (S13 Tier 3:
  "cities where cafes die from rent", "why bakeries look profitable but owners
  stay poor"). Editorial, Pudding/Our-World-in-Data feel, not generic tips. [HAVE]
- /blog/[slug]: the story + a chart + a link to the relevant cells. [HAVE]

---

## 17. Utility pages

- /about-data: the data guide / annex to methodology (sources by type,
  confidence, refresh). [HAVE]
- /browse: explore entry (by place, by activity, by question). [HAVE]
- /check: the viability quick-check entry (S8 #1 idea screener, free version). [HAVE]

---

## 18. What this implies for build order

1. CELL dashboard depth (done first; the flagship), then extend the curated
   data so The market / Survival / Pricing fill in for more places.
2. Country + City dashboards adopt the same stat-grid + climate + survival
   pattern.
3. Activity page reframed to anatomy + "pick a place".
4. Decide + Compare adopt the side-by-side dashboard.
5. Curate/Drop the modeled layers (market structure, survival, pricing,
   informality, tourism, footfall) city by city, London first, each dry-run and
   shown before any DB write.

Every page: data-first dashboard at the top, prose below, self-omit, blunt
voice, modeled-data honesty, free-only, mobile-first.
