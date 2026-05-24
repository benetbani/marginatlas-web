# Distinctive features research — what only Margin Atlas would have

> Founder mandate: ideas that "cannot be found easily somewhere else."
> Not generic SaaS patterns. Not "more charts." Things distinctive
> enough that they'd become reasons-to-cite Margin Atlas.
>
> Organized in three tiers: things doable inside one sprint, things
> doable inside one quarter, and ambitious bets that would take
> longer but would define the product.

---

## The lens

Comparable benchmark sites (Numbeo, IBISWorld, Statista, Crunchbase,
Glassdoor, Levels.fyi, BizStats, ProjectionHub) all converge on the
same shape: a table of numbers + a chart + a methodology page. The
moment Margin Atlas does the same, it's a worse version of one of
them.

What's missing across the whole category:

1. **Make the number tangible.** Nobody translates "$1.2M annual
   revenue" into "5 covers/hour × 11 hours × 365 days × $52 average
   ticket." A reader who doesn't already think in those units can't
   sanity-check the number. We can.
2. **Show the failure case.** Every benchmark site shows the median.
   None show the 30% who go out of business in year 3, or what
   distinguished the survivors. We can.
3. **Connect the dots between businesses.** Numbeo shows cost of
   living. Crunchbase shows companies. Nobody shows that "if you
   open a bakery in Lisbon you'll buy flour from supplier X who is
   the same supplier of every other bakery within 50km, which is
   why margins compress in clusters." We can.
4. **Voice + character.** Every other site reads like a textbook.
   Margin Atlas can read like a knowledgeable friend.
5. **Treat the owner as the audience.** Most benchmark sites
   address analysts. The actual buyer of a $39 Pro subscription is
   the owner or aspiring owner. The product should look at them
   directly.

These five lenses generate every idea below.

---

## Tier 1 — distinctive but shippable this sprint

Each item is small enough to ship within a few hours of work. None
require new data acquisition; they're new ways to present what we
already have.

### 1. "In tangible units" panel on every cell page

Translate the annual revenue into operating units:
- "A typical bakery in Lisbon makes **€480 / day** in revenue across
  **~140 customer transactions** at an average ticket of **€3.40**."
- "That's roughly **22 loaves of bread + 56 pastries + 47 coffees
  per day** by typical revenue mix."
- "Across the country, this works out to **one new bakery opening
  every 11 days** and **one closing every 14 days**."

Why distinctive: nobody else does this. The unit-translation alone
makes the page memorable.

Build: a small "tangible units" component that takes revenue +
industry baseline (customers per day, average ticket per industry).
The data already exists as ratios in industry_baselines.ts; just
needs a per-industry "units" table.

### 2. "What would change if..." sliders

Three sliders below the revenue card:
- **If rent dropped 20%**, owner take-home goes from $X to $Y.
- **If you serve 10 more customers a day**, revenue goes from $X to $Y.
- **If you cut food cost from 32% to 28%**, profit margin doubles
  from 4% to 8%.

Why distinctive: nobody else lets you ask "what changes if I tweak
this." It positions Atlas as a thinking tool, not a directory.

Build: client component reading from cost_stack, recomputes
downstream lines on slider change. No DB writes; pure presentation.

### 3. "Five reasons this business fails" panel

A 5-bullet list per industry of the top failure modes, sourced from
industry studies (SBA failure data, restaurant trade-press
post-mortems, etc.). Specific, not generic. For restaurants:
1. Lease terms misjudged (8.5% of failures, year 1)
2. Owner-as-only-cook burnout (15% of failures, year 2)
3. Liquor license delays past opening (3% of failures, year 1)
4. POS / payment fees underestimated (chronic margin erosion)
5. Cash flow miscalculation on tax-due quarters

Why distinctive: every other site shows the median; we show the
ditch. This is the single most-requested feature in SBA owner
surveys ("tell me how I fail").

Build: per-industry JSON list of 5 failure modes. Show on cell pages.

### 4. "Owner's day" calendar

A small visual showing the typical operating calendar of this
business: when's peak day (Saturday), peak month (December for
retail, July for hostels, etc.), slow stretches (January 2nd to
February), regulatory deadlines (food permits expire annually on
[X]).

Why distinctive: time-aware. Most sites are point-in-time;
businesses are time-shaped.

Build: per-industry typical calendar JSON, render as a 12-month
strip with intensity coloring.

### 5. "How long until break-even" computed visualization

Given setup_costs and operating cost_stack and revenue, compute the
breakeven month. Show as a line chart that crosses zero at month X.

Why distinctive: nobody renders break-even as a visual on a benchmark
page. It IS the most important number for an owner-buyer.

Build: pure math from existing data; visualization is a 50-line
component.

### 6. "Currency conversion that respects PPP"

When viewing a French cell, show the values in EUR (local), USD
(international comparison), and "PPP USD" (what it feels like to
spend that money in France). The last one is what economists know
matters; nobody surfaces it on benchmark pages.

Why distinctive: PPP-adjusted numbers in the UI is a category
differentiator. It's the analytical correction the IMF makes; we'd
make it visible.

Build: small PPP factor table per country, three-toggle UI on
revenue display.

### 7. "What a salaried alternative would pay"

For every cell, surface: "A salaried manager in this industry in
this country makes about $X. The typical owner takes home $Y. The
spread is $Z."

Why distinctive: every owner asks this. No site shows it on the
cell page. Comparable to opportunity-cost analysis but as a number.

Build: needs salaried-manager data per industry per country (we have
payroll_per_employee). One row of data + a sentence of editorial.

### 8. "Three businesses you could open instead"

At the bottom of each cell, "if you have $X to invest, these three
businesses give you better/different return profiles." Selected by
similar setup-cost band, different sector.

Why distinctive: positions Margin Atlas as a decision-support tool,
not a reference. Drives engagement (multi-cell sessions).

Build: query setup_costs to find neighbors; surface 3 with brief
why-cards.

---

## Tier 2 — distinctive and a full sprint of work

### 9. "The atlas of where every kind of business actually exists"

Take the firm-count data we have and render it as a literal
density-of-businesses map per industry. "Where do the most coffee
shops per capita exist?" → choropleth. The answer is **not** the
city you'd guess (highest density of coffee shops is Reykjavik per
capita, then Helsinki, not Seattle). These surprising-rankings
charts are inherently shareable.

Why distinctive: choropleths exist; choropleths of "per-capita
density of a specific small-business type" don't. Single most
shareable artifact category.

Build: one shared choropleth component, fed by per-industry per-
country density. Each industry gets its own /maps/[industry] page.

### 10. "If you opened today" — date-aware page

A "today" view of every cell that says: "If you opened this business
on [today's date], you'd:
- Pay $X to register (broken down by step + estimated days for each)
- Be operational on roughly [date 6 weeks from now]
- See your first revenue by [date 8 weeks from now]
- Break even on operating by month [Z]
- Pass full payback by year [W]"

Why distinctive: time-aware, today-relative, names actual dates. The
visceral effect is huge — it stops being "abstract benchmark" and
starts being "I could do this."

Build: combines setup_costs, cost_stack, today's date, country-
specific business-registration timing. Doable; mostly composition.

### 11. "Read like an operator" mode

A toggle that rewrites the page in operator voice. Instead of:
> "Typical annual revenue: $1,100,000. Typical payroll cost:
> $400,000."

It reads:
> "You'll do about $1.1M a year, $90K a month at the high end. You'll
> pay yourself last and your staff first; expect to write checks for
> about $33K a month in wages plus another $8K for employer-side.
> The bank will see you as a small business and treat your loans
> accordingly."

Why distinctive: the same data, rendered in the buyer's voice.
Should make the page feel written *for* them rather than *about*
them.

Build: this is mostly a copy-rewrite job per industry. The toggle
is a 10-line client component; the content is the work.

### 12. "Behind the average" - distribution stories

The decile distribution (which we have) becomes a narrative: "If
you're in the bottom 10%, you probably:
- Have only one location
- Don't yet have a manager so you can take a day off
- Are still doing your own bookkeeping
If you're in the top 10%, you probably:
- Have 3-5 locations or one premium one
- Have a salaried general manager
- Sublease space or have negotiated below-market rent"

Why distinctive: percentile is a stat; this turns it into recognized
trajectories. Owner reads "that's me" and identifies.

Build: per-industry trajectory text for bottom-10/median/top-10.

### 13. "Adjacency map" — what businesses cluster nearby

For every (city, industry) cell, show what other businesses tend to
exist within walking distance. Bakeries cluster near cafes (shared
foot traffic) but compete with grocery stores (substitute). Hair
salons benefit from being near nail salons (cross-trip
customers) but suffer from being near drugstores (DIY substitution).

Why distinctive: nobody has spatial-economics data on small business
adjacency at the city level. Hard to source but where it exists
(via Yelp/OSM scraping) it's incredibly compelling.

Build: longest single project on this list. Needs spatial-data
acquisition + clustering analysis. Defer to Tier 3.

### 14. "Real menu" / "real price list" for the industry

For consumer businesses (restaurants, salons, cafes, hotels), show
the typical price list at typical revenue. "A median bakery in
Lisbon charges €1.20 for a pastel de nata, €0.80 for a coffee,
€1.80 for a croissant. Average ticket €3.40."

Why distinctive: nobody publishes per-industry per-country typical
price lists for small businesses on a benchmark site. The numbers
exist (consumer price indices) but nobody assembles them this way.

Build: medium effort. Per-industry per-country price list JSON.
Render as a typical menu/price-list panel.

### 15. "Equipment shopping list with prices"

For capital-intensive businesses (restaurants, salons, gyms, auto
repair), a literal equipment shopping list at typical scale. "A
median restaurant of this kind buys: pizza oven ~$8K, walk-in
cooler ~$15K, 8-burner range ~$5K, dishwasher ~$4K, POS ~$3K,
chairs ~$3K..." Same approach for gyms (treadmills, benches,
free weights, etc.).

Why distinctive: nobody does this. It bridges "abstract setup cost"
into "what specifically do I buy."

Build: per-industry equipment list with typical specs + 2024 price
ranges. Per-industry editorial content but worth it for top 10
capital-intensive industries.

### 16. "Pricing power index" per industry

A single number per industry: "how much pricing power does the
average operator have?" Bakeries: low (commodity, price-sensitive
customers, easy substitution). Surgeons: very high (specialized,
trust-driven, no substitution). Compute from churn data + price
elasticity proxies.

Why distinctive: this is what private equity calls "moat depth."
Nobody surfaces it for small businesses. Owners and buyers want it.

Build: composite score from existing data + industry-specific
modifiers. Visual: a 1-100 dial.

---

## Tier 3 — distinctive AND ambitious

These would take weeks to months. Each could individually become a
defining feature of the product.

### 17. The Atlas Index

A composite "small-business economy" index per country and
metropolitan area, updated quarterly. Composed of:
- Median SMB revenue growth YoY
- Survival rate (year 3 + year 5)
- Owner take-home / median wage ratio
- Net new business formation rate
- Bankruptcy rate

Brand this. Publish it. Get cited. Become the SMB equivalent of
"S&P 500" reference.

Why distinctive: nobody owns this index. The data to build it
exists. The brand value is enormous if we own it for 3+ years.

### 18. Voice-narrated cell pages

Every cell gets a 30-60 second voiced summary. Auto-generated from
the data via a high-quality TTS (ElevenLabs / Cartesia). Listen while
driving / commuting. Cached as MP3 served via R2.

Why distinctive: audio is a different content medium. Nobody in the
benchmark space does it. The cost (~$0.05 per generated cell) is
trivial.

### 19. "Decade pages" per industry — long-form narrative

A 5,000-word long-form narrative per industry: "A decade of
restaurants" — how the industry has changed since 2014. Real
journalism, hand-written or co-written, citing the data. 25
industries × 1 piece each = a content moat that takes weeks to
write but compounds in SEO + brand value for years.

Why distinctive: long-form journalism on small-business economics.
Nobody combines it with benchmark data on the same site.

### 20. Founder profiles — real people, real numbers

Interview / data-share with 100 real owners per year. Each gets a
profile page citing real numbers (with consent) + their story. The
"data of the dataset" — actual humans whose numbers feed the
benchmarks. Becomes the social proof + the editorial spine.

Why distinctive: huge effort, huge moat. The interviews are content
forever.

### 21. The Atlas mortgage / loan calculator

Given a cell + a target equity contribution from the buyer, compute:
- What size loan you'd need
- What rate the bank would charge for that industry in that country
- Monthly debt service
- DSCR (debt service coverage ratio)
- Bank's likely lending decision (approve / approve-with-conditions /
  decline)

Why distinctive: the actual "would the bank lend me this money"
question. Bridges Margin Atlas to the financing decision. Plumbs
into SBA / bank rate data.

### 22. Public-company peers per cell

For every cell, surface the 3 closest publicly-traded comparables
(e.g., restaurants → Darden, Brinker; coffee → Starbucks, Dutch
Bros; hotels → Marriott, Hilton). Show real EBITDA margins,
revenue multiples, recent stock performance. Helps SMB owners
understand what their industry looks like at scale.

Why distinctive: bridges public-market data into private SMB
benchmarking. Standard among PE/VC; absent from SMB tools.

### 23. "Compare to your real numbers" — Pro-tier upload

Pro users can upload their actual P&L (CSV / scan / Plaid
integration). System matches against the relevant cell, highlights
where they're above/below benchmark by line item, suggests where
to focus.

Why distinctive: turns the benchmark into a personal advisor. Real
competitive moat once people upload data (network effects on the
recommendation engine).

### 24. The Atlas API + embedded widgets

A widget that consultants/journalists embed: "Cafe benchmark in
Madrid" → live-updating Atlas mini-card on their site. Tracked
attribution; drives backlinks. Pro feature.

Why distinctive: turns the SEO traffic into a syndication network.
Every embed is a backlink.

### 25. "Open-data partnerships" with chambers of commerce

Form partnerships with national chambers of commerce / SBA / equivalents
to (a) cite their data with permission, (b) embed Atlas in their
publications, (c) potentially co-publish quarterly reports.

Why distinctive: institutional legitimacy. Even one such partnership
becomes the line "Cited by SBA / Chamber of Commerce / etc." on
every page.

### 26. The Atlas Press — quarterly print magazine

PDF / print quarterly summarizing the most striking benchmarks of
the quarter. Brand-builder. Lead-magnet. Subscription-driver. ~30
pages, beautifully designed.

Why distinctive: nobody publishes "the print magazine of small-
business economics." Could become the Economist of SMB.

### 27. Live data webhooks for the Pro tier

When a cell's numbers materially change (e.g. payroll up 8% YoY in
restaurants in California), Pro subscribers get a webhook /
email / Slack alert. Differentiated retention feature.

### 28. Cross-cell comparison "boards" — Pro feature

Pro users build personal dashboards: "my 5 cells I'm watching."
Compare side by side. Export to PDF. Share with team. This is the
analyst's workspace.

### 29. The "what if I franchise" calculator

Specifically for franchise-able businesses: "if you opened 3 of
these instead of 1, what changes?" Models economies of scale,
shared infrastructure, manager overhead. Helps owners thinking
about expansion.

### 30. Climate-adjusted projections per cell

For climate-sensitive industries (agriculture, tourism, outdoor
hospitality, fisheries), surface a "2050 outlook" tab using
climate projections + industry sensitivity. Hard to source but
absent everywhere; would be a defining feature for ESG-conscious
audiences.

---

## What I'd actually build first

If I had to pick three from Tier 1 to ship in the next 1-2 sprints,
I'd pick:

1. **#1 — "In tangible units"** on every cell page. Highest-impact
   single feature; turns abstract revenue into recognizable daily
   operating units. Hours of work, weeks of brand payoff.
2. **#3 — "Five reasons this business fails"** per industry. The
   single most-requested SMB question. Once-only per-industry content
   investment.
3. **#10 — "If you opened today"** date-aware composition. Combines
   everything Atlas already has into one visceral page section.

Each of those would individually shift the perceived quality of
Margin Atlas. Combined they make Margin Atlas feel like a different
product from every other benchmark site.

For Tier 2, the highest-leverage single bet is **#15 — "Equipment
shopping list with prices"** for capital-intensive industries. It's
the bridge from "abstract setup cost" into "what specifically do I
buy" that turns the page from reference into a buyer's tool.

For Tier 3 ambition, **#17 — The Atlas Index** is the brand bet.
Owning the "S&P of small business" reference for 3+ years compounds
in citation, link equity, and category authority in a way no
single feature can.

---

## Pattern recognition

Across all 30 ideas, three patterns repeat:

1. **Translate abstract data into recognized units** (tangible units,
   real menu, equipment list, salaried alternative) — the most
   reliably distinctive pattern, lowest cost per idea.

2. **Time-shape the data** (calendar, today-relative, break-even
   line, climate outlook) — turns point-in-time benchmarks into
   dynamic narratives.

3. **Acknowledge the failure case** (failure modes, distribution
   stories, survival rate) — every other site shows only the
   median; we'd own the spread.

Every future ideation cycle should ask: "does this idea translate,
time-shape, or acknowledge failure?" If yes, ship it. If no, it's
probably a duplicate of what Statista / IBISWorld already do.
