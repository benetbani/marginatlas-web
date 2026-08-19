# Reference Page Architecture: what the world's best data / entity pages actually do

Research date: 2026-08-19
Scope: structure, not styling. Transferable rules for marginatlas page types.
Method: 20 pages fetched and read directly, plus 4 targeted searches to cover sites that blocked fetching.

> Note on the site's own copy rules: this document names sources because the assignment requires evidence.
> The recommendations at the end are written so that the SHIPPED page never has to name a statistics agency.

---

## EXECUTIVE SUMMARY: the transferable rules

1. The answer belongs at roughly position 3, after an identity line and nothing else. Every page that works puts one number above the fold; every page that does not is an encyclopedia, not a benchmark.
2. A number alone is not an answer. The complete answer unit is: number, band (low to high or percentiles), one provenance sentence, one comparison anchor. Indeed compresses all four into two lines.
3. Provenance reads best as ONE sentence directly under the number stating count, window, basis and update date. Not a footnote, not a tooltip, not a methodology page.
4. Prose volume is inversely proportional to page usefulness as a lookup. Pure benchmark pages carry 40 to 250 words in the top two screens. Encyclopedic pages carry 350 to 2,500 and read slower.
5. Prose earns its place only when it makes a claim a table cannot: a definition of scope, a causal explanation, or a disclosure of method. Every other paragraph is filler.
6. Do not delete a row because its value is missing. Keep the label, type the absence. World Bank prints "No data available" in the tile; the census-style approach gives absence a code and a legend.
7. When you must answer at a coarser resolution than the reader asked for, say so in the same sentence. Data USA does exactly this and it is the single most transferable honesty pattern found.
8. A low-to-high range column next to every average is the cheapest, fastest and most honest comparison device in existence. Numbeo earns more trust from one extra column than Glassdoor earns from a confidence badge.
9. The highest information density observed anywhere is Trading Economics' four-column row: Last, Previous, Highest, Lowest, every value unit-stamped and date-stamped. One row replaces a chart.
10. Looking modern and reading fast are different axes. Nomad List looks 2026 and reads slow. Trading Economics looks 2009 and reads fastest of anything fetched. Take the second one's architecture and the first one's typography.

---

## 1. SECTION ORDER

Thirteen page orders recorded as observed. The recurring skeleton is named at the end.

### 1.1 Levels.fyi, role plus location page (`/t/software-engineer/locations/san-francisco-bay-area`)
1. Nav
2. H1 "Software Engineer Salary in San Francisco Bay Area, US"
3. Median Total Comp, $275,083
4. Percentile row: 25th $203K, 75th $385K, 90th $525K
5. "All Levels" selector
6. Recently Submitted Salaries (table)
7. Top Paying Companies, then Top Paying US Locations
8. Get Expert Help (commercial)
9. FAQ
10. Footer

Answer at position 3. Evidence at 4 through 7. Commerce at 8. Definitions last. This is the cleanest instance of the skeleton found.

### 1.2 Levels.fyi, company plus role page (`/companies/google/salaries/software-engineer`)
1. Nav
2. Hero: company mark plus role title
3. Range headline, $209K to $1.79M, median $300K, "Last updated: 8/19/2026"
4. Level compensation table (L3 to L6 visible, "View 4 More Levels")
5. Latest salary submissions
6. Vesting schedule (tabbed)
7. Included titles
8. FAQ
9. Related companies
10. Footer

Same skeleton, different filter. Note that the two Levels.fyi pages are one template with a swapped facet.

### 1.3 Indeed salary page (`/career/software-engineer/salaries`)
1. H1 phrased as a question: "How much does a Software Engineer make in the United States?"
2. Average base salary, $135,396, with Low $80,018 and High $229,101, plus a provenance line
3. Job openings (commercial)
4. Highest paying companies
5. "Looking to Hire?" (commercial, interrupting the evidence run)
6. Highest paying cities
7. "Where can a Software Engineer earn more?" (compare tool)
8. FAQ

### 1.4 Payscale (`/research/US/Job=Software_Engineer/Salary`)
1. Average Software Engineer Salary: $98,200, 25,510 profiles, updated 14 July 2026, $72k to $142k, 10th / 50th / 90th
2. Tab bar: Pay, Job Details, Skills, Job Listings, Employers
3. Base salary ranges
4. "EXPLORE BY": City, Experience, Skill, Employer, Job
5. Pay by Experience Level
6. "What Do Software Engineers Do?" (generic prose, position 6)
7. "How do Software Engineers Rate Their Jobs?"
8. Common Health Benefits
9. Gender Breakdown
10. FAQs

The skeleton is intact through position 5 and then collapses into template filler.

### 1.5 Numbeo, cost of living (`/cost-of-living/in/Lisbon`)
1. Nav
2. Breadcrumb: Home, Portugal, Lisbon
3. H1 "Cost of Living in Lisbon"
4. Summary box: family of four EUR 2,748.9 per month excluding rent; single person EUR 762.5; "13.6% more expensive" than the compared city; rent "107.4% higher"; data month "Aug 2026"; "1892 entries in the past 12 months by 214 different contributors"; last update 15 August 2026
5 to 14. Category tables in fixed order: Restaurants, Markets, Transportation, Utilities (Monthly), Sports And Leisure, Childcare, Clothing And Shoes, Rent Per Month, Buy Apartment Price, Salaries And Financing
15. Sources and References
16. Related exploration links
17. User comments (50)

### 1.6 Data USA, place profile (`/profile/geo/austin-tx`)
1. Headline stats row, seven tiles: 2024 Population 979,539; US Senators; Median Age 34.7; Poverty Rate 12%; Median Household Income $93,658; Median Property Value $555,300; Employed Population 588,819
2. Population and Diversity
3. Health
4. Economy
5. Civics
6. Education
7. Housing and Living

Plus numbered in-page jump links and a "Keep Exploring" sidebar to parent (Texas, US) and neighbour geographies (Travis County, Hays, Williamson, Austin-Round Rock MSA).

### 1.7 Trading Economics, country indicators (`/portugal/indicators`)
1. Nav
2. Overview metrics table
3. GDP
4. Labour
5. Prices
6. Money
7. Trade
8. Government
9. Business
10. Consumer
11. Housing
12. Energy
13. Health
14. Footer

There is no hero and no headline number. The table IS the answer. This works only because the reader arrives already knowing which row they want.

### 1.8 Our World in Data, topic page (`/life-expectancy`)
1. Opening statement
2. "Key Insights", five entries, each one being claim, prose, one chart, then "What you should know about this data"
3. Research and Writing
4. More articles
5. "Key Charts", 43 visualisations
6. Featured Data
7. Endnotes (15)
8. Citation box (Chicago and BibTeX)
9. Reuse and licence block

### 1.9 Wikipedia country article (`/wiki/Portugal`)
Infobox with roughly 35 fields, then a 5-paragraph, roughly 350-word lead, then:
1. Etymology
2. History
3. Geography
4. Government and politics
5. Economy
6. Demographics
7. Culture
8. See also
9. Notes
10. References
11. External links

### 1.10 Wikipedia city article (`/wiki/Austin,_Texas`)
Infobox with 34 fields, then a 4-paragraph, roughly 520-word lead, then 16 top-level sections: History, Geography, Demographics, Economy, Infrastructure, Culture, Government, Education, Mass media, Notable people, International relations, See also, Notes, References, Further reading, External links.

### 1.11 IBISWorld industry report (`/united-states/industry/coffee-shops/1973/`)
1. Nav
2. Breadcrumb
3. Title plus metadata (analyst, date)
4. Executive summary with the headline numbers
5. Access options
6. Data access methods
7. Industry coverage (nested accordions)
8. Related industries
9. Testimonials
10. FAQ
11. CTA
12. Sample download form
13. Footer

Five of thirteen sections are sales.

### 1.12 World Bank country data (`/country/portugal`)
1. Portugal
2. "Jump to"
3. Topic switcher (Social, Economic, Environment, Institutions)
4. Social
5. Economic
6. Environment
7. Institutions
8. Download
9. Projects and Operations
10. Finances
11. Surveys
12. Human Capital Index
13. Climate Change

### 1.13 stockanalysis.com entity profile (`/stocks/sbux/`)
1. Header plus tab bar: Overview, Financials, Forecast, Statistics, Metrics, Dividends, History, Profile, Chart
2. Price with change
3. Chart with time-range toggles
4. Key statistics grid, roughly 16 label-and-value pairs in two columns
5. About
6. Financial Performance
7. Analyst Summary
8. News

### THE SKELETON
Across the pages that work, the order is:

**Identity line, Answer, Decomposition, Recency proof, Peer position, Method, Lateral navigation.**

Answer first, evidence below, context last is real and near-universal on lookup pages. It is absent on Wikipedia and Trading Economics, and both are exceptions for the same reason: the reader already knows which fact they came for, so the "answer" is a row they scan to rather than a number the page pushes at them. marginatlas readers do NOT arrive knowing, so marginatlas needs the answer-first form.

---

## 2. THE ANSWER-FIRST MOMENT

| Site and page | The answer | Position | Band | Provenance shown | Comparison anchor |
|---|---|---|---|---|---|
| Levels.fyi, SWE SF Bay | $275,083 median total comp | 3rd | 25th $203K, 75th $385K, 90th $525K | update date in footer only; **no sample size** | top paying locations, companies |
| Levels.fyi, Google SWE | $209K to $1.79M, median $300K | 3rd | range across levels | "Last updated: 8/19/2026" | level table, compare-levels link |
| Indeed, SWE US | $135,396 average base | 2nd | Low $80,018, High $229,101 | "39.1k salaries taken from job postings on Indeed in the past 36 months (updated August 10, 2026)" | top cities, top companies, compare tool |
| Payscale, SWE | $98,200 average base | 1st | $72k to $142k, 10th / 50th / 90th | "25,510 salary profiles", updated 14 July 2026 | experience bands, city filter |
| Numbeo, Lisbon | EUR 2,748.9 family, EUR 762.5 single | 4th | low to high on every line item below | "1892 entries in the past 12 months by 214 different contributors", data month plus last-update date | "13.6% more expensive" than a named city |
| Nomad List, Lisbon | 3.64 out of 5, Rank #134 | 3rd | none | "3,687 reviews", updated 2026-08-19 | explicit global rank, similar cities |
| RentCafe, Austin | $1,638 average rent | 2nd | by bedroom below | "as of August 1, 2026", universe stated (50+ unit apartments) | "2.09% decrease compared to the previous year, when the average rent was $1,673" |
| IBISWorld, coffee shops | $75.5 billion (2026) | 4th | none | analyst plus date in the title block | 2.5% CAGR 2021 to 2026, 94,331 businesses |
| Data USA, Austin | seven tiles, no single answer | 1st | none | year inside the tile ("2024 Population") | national constants quoted inline |
| Trading Economics | none | n/a | Highest and Lowest columns | date stamp per value | Previous, Highest, Lowest |
| Wikipedia | none; first sentence is a definition | n/a | n/a | citations per fact | none |

### What the best answer moment looks like
Indeed's is the strongest single construction observed. Under one number it states, in one sentence: **the count (39.1k), the window (past 36 months), the basis (job postings, not self-reports), and the update date (10 August 2026).** Four provenance facts, one sentence, no click. Every other site splits these across a footer, a tooltip and a methodology page.

RentCafe's delta construction is the second-best idea: it does not just say "down 2.09%", it states the prior value ($1,673). A delta without its base is unverifiable; a delta with its base is a second data point for free.

Redfin, which blocked direct fetching, puts the data month in the page title itself: its city pages are titled in the form "2026 Austin Housing Market: House Prices and Trends as of July". Freshness as part of the page's identity, not a footnote.

### The failure
Levels.fyi, the most-loved page in this set, shows **no sample size at all** next to its headline median. The percentile ladder is doing the honesty work by implication. That is a decision marginatlas should not copy, because n is exactly the number a sceptical owner will ask for.

---

## 3. TEXT DISCIPLINE

Running prose (sentences, not labels) in the top two screens, as observed:

| Page | Words, top two screens |
|---|---|
| Levels.fyi, SWE SF Bay | 40 to 50 |
| Trading Economics, Portugal | 50 to 100 (whole page) |
| Numbeo, quality of life | 50 to 75 |
| World Bank, Portugal | 150 to 200, mostly labels |
| stockanalysis.com, SBUX | 150 to 200 |
| RentCafe, Austin | 180 to 220 |
| Statista, coffee Portugal | 180 to 220 |
| Numbeo, cost of living | 200 to 250 including nav |
| Indeed, SWE | 200 to 250 |
| IBISWorld, coffee shops | 250 to 300 |
| Robert Half salary guide | 300 to 400 |
| Data USA, Austin | 300 to 400 |
| Payscale, SWE | 400 to 500 |
| OWID, life expectancy | 600 to 800 |
| Nomad List, Lisbon | 800 to 1,200 (mostly user reviews) |
| Wikipedia, Portugal | 350-word lead; 2,000 to 2,500 including infobox |

The correlation is clean: **the more the page is a lookup, the less prose it carries.** The four fastest-reading pages in the set all sit under 250 words in two screens.

### What earns prose

- **Scope definition.** Wikipedia's first sentence defines the entity. This is the one thing a table cannot do. One sentence, once.
- **Method disclosure.** OWID pairs every Key Insight chart with a "What you should know about this data" block. Prose as caveat, attached to the specific figure it qualifies, not pooled into a methodology page.
- **A claim the chart cannot make.** OWID's insight prose states the interpretation (life expectancy "more than doubled") rather than describing the chart. Description of a chart is always waste.
- **One-sentence claims that carry their own number.** Data USA's pattern is a sentence stating a figure ("88.3% of residents are citizens") sitting directly above the visualisation of that figure. This is the cheapest useful prose form found: one sentence, one number, one chart, repeated.
- **The causal story behind a movement.** IBISWorld's executive summary explains why growth happened. A number cannot.

### What does not earn prose

- Payscale's "What Do Software Engineers Do?" at position 6 of a salary page. The fetched sentence was truncated mid-clause, which is the tell of template generation at volume.
- Indeed's and Payscale's question-form headings ("How do Software Engineers Rate Their Jobs?", "Where can a Software Engineer earn more?"). These are search-engine artefacts wearing the costume of an information architecture.
- IBISWorld's testimonials.
- Numbeo's 50-comment thread.
- Nomad List's review text, which places opinion adjacent to scored data at equal weight.

### Where each format is used
- **Stat tile:** the answer, and only facts that need no context (Data USA's seven-tile row, Levels.fyi's percentile ladder).
- **Table:** anything with more than three rows or two dimensions. Numbeo, Trading Economics, the Levels.fyi level table, Robert Half.
- **Chart:** trend over time, or distribution. OWID uses charts for both and almost nothing else.
- **Prose:** definition, caveat, causal claim. Nothing else.

---

## 4. SPARSE AND MISSING DATA

This is where the strongest transferable material sits.

### 4.1 Typed absence with a published legend (strongest)
The US occupational wage statistics use numbered footnote codes on the value itself. Code 8 means "Estimate not released". Code 5 means the wage is at or above a stated cap ($115.00 per hour or $239,200 per year), which is a top-code rather than an invented number. Crucially, the publisher **refuses to state which reason applied to a given cell**, in order to protect confidentiality. The lesson: absence is a typed value, not a blank, and the type does not have to be fully explanatory to be honest.

Census QuickFacts does the same with letter symbols in a legend: D means withheld to avoid disclosing data for individual companies, with the note that the value is still included in higher-level totals; S means the estimate does not meet publication standards because of high sampling variability; X means not applicable.

**Transfer:** marginatlas should have a fixed, small vocabulary of absence types (for example: not measured, below reporting threshold, withheld, not applicable, estimated from a wider set) rendered as a short token in the value slot, with one legend on the page.

### 4.2 Fallback with disclosure in the same sentence (most transferable)
Data USA, when a dataset does not exist at the requested resolution, prints the substitution inline: it states plainly that the underlying survey is not available at the place level, so it is showing the state figure instead. The reader learns about the resolution downgrade at the exact moment they read the number.

**Transfer:** this is the honest answer to marginatlas' sample-tag problem. When the cell-level figure does not exist, do not omit and do not silently show the national number. Show the coarser number and name the coarser geography in the same line as the value.

### 4.3 Per-value provenance downgrade marker
Nomad List marks certain metrics with an asterisk and one footnote saying those values are derived from national statistics and might differ from the city itself. One character on the value, one line of legend.

### 4.4 Keep the row, kill the value
World Bank prints "No data available" in the tile where the value would sit. The indicator label survives. The reader can see the shape of the coverage gap, which is itself information.

Contrast Levels.fyi, which **hides** thin levels behind a "View 4 More Levels" control and leaves cells blank. It is the only site in the set where you cannot tell what is missing.

### 4.5 Range as implicit sample disclosure
Numbeo shows a low-to-high range beside every average (for example an average price with a "10.00 to 20.00" range column). It publishes contributor counts globally ("1892 entries in the past 12 months by 214 different contributors") and a floor for its quality-of-life indices ("Minimum contributors for an underlying section: 176"). It does not warn per item. But the range column does the work: a wide range signals thin or dispersed data without needing an n.

### 4.6 Confidence badges (weakest)
Glassdoor, which blocked fetching, presents a "Most Likely Range" defined as the 25th to 75th percentile of available pay data, plus confidence labels. Per third-party reporting, those confidence labels reflect **sample volume, not the consistency or quality of what was submitted**. A confidence chip that encodes only n is a decoration that reads as a guarantee. Do not ship one.

### 4.7 The worst observed
RentCafe presents neighbourhood-level rents ranging from $877 to $3,508 with identical visual weight, no sample count, no caveat, and no indication that a thin neighbourhood and a dense one are different kinds of number.

### Ranked by reading speed, for marginatlas
1. Range column next to the point estimate.
2. Typed absence token plus one legend.
3. Fallback naming the substitute resolution inline.
4. Per-value asterisk for provenance downgrade.
5. Explicit "no data" retaining the row.
6. Confidence badge. Avoid.

---

## 5. COMPARISON MECHANICS

| Mechanic | Where observed | Reading cost |
|---|---|---|
| Low to high range column | Numbeo, Indeed, Robert Half | Lowest. No cognitive step, the range is the comparison |
| Fixed national anchor quoted inline | Data USA (poverty 12% against 12.5% national; homeownership against 65.2%) | Very low. The anchor is constant sitewide so it becomes learned |
| Last / Previous / Highest / Lowest in one row | Trading Economics | Very low, and the highest density found: four numbers, one row, trend plus historical position, no chart |
| Percentile ladder | Levels.fyi (25/75/90), Payscale (10/50/90) | Low. Self-contained, needs no second entity |
| Year-over-year with the prior value stated | RentCafe ($1,638, prior $1,673) | Low |
| Rank | Nomad List (#134), Numbeo | Instant to read, but brittle. Numbeo's "1st Most Expensive Toyota Corolla" within a regional set is a rank computed because it could be, not because it means anything |
| Named-peer delta | Numbeo ("13.6% more expensive" than a specific city) | Low to read, but the peer must be chosen for the reader or it is noise |
| Peer-geography toggle | Data USA (county, MSA, state) | Medium. Requires an interaction |
| Leaderboard | Levels.fyi top companies and locations, Indeed highest paying cities | High. Good for navigation, weak for judgment |
| Side-by-side compare tool | Numbeo, Indeed, stockanalysis.com | Highest. Requires the reader to construct the comparison |

**The single best device found is Trading Economics' four-column row.** For marginatlas that translates to a one-row "position" strip per figure: this cell, the national figure, the best in country, the worst in country. Four numbers, one row, no chart, and it answers "is this good?" without the reader having to leave the page.

The second best is Data USA's fixed national anchor. Because the same anchor appears on every page, a returning reader learns it, and then every figure on the site becomes self-comparing.

---

## 6. NAVIGATION AND DEPTH

### Devices observed
- **Tab bar over one entity.** stockanalysis.com carries nine tabs (Overview, Financials, Forecast, Statistics, Metrics, Dividends, History, Profile, Chart) over the same company. Payscale carries five (Pay, Job Details, Skills, Job Listings, Employers). This keeps any single view short. Cost: the reader must guess which tab holds a given fact.
- **Chart-level view switch.** The OWID chart page offers Chart, Map and Table tabs over the same data, plus a download of the full or filtered dataset, an API endpoint, the source line, the unit ("Years"), the covered range (1543 to 2023), the last-updated date (22 October 2025) and the licence (CC BY 4.0). The **Table tab is the important idea**: because any figure can be read as a table, no separate data page is needed.
- **Hatnotes.** Wikipedia's "Main article: History of Austin, Texas" sits at the TOP of a section, not the bottom. It lets the section stay short while promising the depth exists. The most directly transferable depth device found.
- **In-page jump links.** Data USA numbers its sections and anchors them; World Bank has a "Jump to" strip.
- **Progressive row disclosure.** Levels.fyi's "View 4 More Levels".
- **Accordions.** IBISWorld nests report chapters in accordions; Wikipedia collapses the table of contents.
- **Lateral relationship sidebar.** Data USA's "Keep Exploring" links to parent (state, nation) and sibling geographies (three counties plus the MSA). Navigation by relationship, not by alphabetical list.
- **Related-entity carousel.** Nomad List's nearby and similar cities with their cost and score attached, so the link itself carries data.

### Observable failure modes
- **Depth as paywall funnel.** IBISWorld's accordion headers promise chapters; the actual control is "Continue reading" into a wall, plus demo request, sample form and purchase buttons. Sections exist in order to be locked.
- **Structurally complete, informationally empty.** Statista's market page renders the shape of an answer with the figures redacted by asterisks, under a "Limited Access" label and a "Get access" button.
- **UGC tail.** Numbeo ends in 50 user comments; Nomad List ends in photo voting and review text. The last third of each page is not depth, it is community.
- **Tile-grid scroll tax.** Nomad List runs 13 sections, most of them grids of metric tiles that exist because the metric exists.
- **Duplication as completeness.** Wikipedia's Austin climate table is rendered twice, in metric and imperial.
- **Rate-limited page farm.** City-Data returned HTTP 429 on two separate attempts, which is itself a signal of a very high page-count, low-value-per-page posture.
- **Sibling-page duplication.** Numbeo's cost-of-living and quality-of-life pages for the same city share nav, breadcrumb, comparison widget, nearby-cities list and comment thread; roughly half of each page is the other page's chrome. Levels.fyi's role-by-location and company-by-role pages are the same template with a different facet.

### Sites that blocked fetching
Glassdoor, Crunchbase, Niche.com, Redfin, Zillow, Yelp, Realtor.com, BestPlaces, Expatistan, US BLS and Census QuickFacts all returned 403; City-Data returned 429; Statista topic pages returned a redirect loop. Where they mattered (Glassdoor's confidence model, census suppression symbols, occupational-wage footnote codes, Redfin's section set) evidence was taken from search results and is labelled as such above.

---

## 7. CUTTING EDGE VERSUS DATED

### Reads modern, concretely
- **Hierarchy by size ratio alone.** Levels.fyi sets one number very large and the percentile ladder immediately beneath it in much smaller type, with no card, no border and no icon. Nothing else on the screen competes.
- **Freshness in the title.** Redfin puts the data month in the page title. The page announces when it is true before it announces what it says.
- **Provenance compressed into one supporting line** under the number, at roughly half its size (Indeed).
- **A tab strip that swaps views of the same entity** rather than a nav of unrelated pages (stockanalysis.com).
- **Chart chrome that carries everything below the mark**: title, subtitle, unit, source line, licence, last-updated (OWID). No footnote hunting.
- **A qualitative word paired with a number.** Nomad List labels each metric "Great", "Mediocre" or "Bad" beside its value; Numbeo labels each index "Very High" through "Low". A word next to a number roughly halves the time to judgment.
- **Two-column label-and-value grids** with no gridlines (stockanalysis.com's roughly 16-field key statistics block).

### Reads dated, concretely
- **Headings phrased as search questions.** "What Do Software Engineers Do?", "How do Software Engineers Rate Their Jobs?", "Where can a Software Engineer earn more?" (Payscale and Indeed). Instantly legible as a content farm.
- **Template modules that ignore the page's question**: a gender-breakdown pie chart and a star rating on a salary page (Payscale).
- **Commercial blocks interleaved between data sections** (Indeed's hiring CTA at position 5; IBISWorld's testimonials at position 9).
- **Undifferentiated dense tables with row striping and no typographic hierarchy** (City-Data).
- **Comment threads under data** (Numbeo).
- **Flag and emoji tile grids** (Nomad List). Energetic, but reads as 2018.

### Looks modern is not reads fast
Nomad List looks current (rounded tiles, colour-coded qualitative labels, imagery, a live rank) and reads slowly: 13 sections, 800 to 1,200 words in two screens, and no single answer, only a composite score. Trading Economics looks a decade out of date and reads faster than anything else fetched: every value carries a unit and a reference date, four comparison columns per row, and roughly 50 to 100 words on the entire page.

**The synthesis for marginatlas: Trading Economics' information architecture, Levels.fyi's typographic hierarchy, Indeed's provenance line, Data USA's inline honesty, OWID's chart chrome.**

---

## 8. ANTI-PATTERNS OBSERVED

Each one was actually seen on a fetched page.

1. **Generic entity explainer on a benchmark page.** Payscale's "What Do Software Engineers Do?" at position 6. The sampled sentence was truncated mid-clause, evidence of templated generation at volume.
2. **Module-per-template, not module-per-question.** Payscale's gender breakdown and job-satisfaction star rating appear regardless of whether they help anyone decide anything.
3. **Commercial interruption of an evidence run.** Indeed places "Looking to Hire?" at position 5, between two data sections.
4. **Sales sections outnumbering data sections.** IBISWorld: access options, testimonials, CTA, sample-download form and demo prompts, five of thirteen sections.
5. **The shape of an answer with the answer removed.** Statista renders headline figures as asterisks behind "Limited Access".
6. **A rank computed because it could be.** Numbeo's "1st Most Expensive Toyota Corolla" within a regional set.
7. **UGC as page tail.** Numbeo's 50 comments; Nomad List's photo voting and review text.
8. **Equal weight for unequal data.** RentCafe presents an $877 neighbourhood and a $3,508 neighbourhood identically, with no sample disclosure.
9. **Hidden absence.** Levels.fyi collapses thin levels behind "View 4 More Levels" and blanks cells, so the reader cannot see the coverage gap.
10. **Headline number with no n.** Levels.fyi's median total comp carries a percentile ladder but no sample size.
11. **Duplication as completeness.** Wikipedia's Austin climate table in both metric and imperial.
12. **SEO question headings.** Payscale and Indeed, multiple instances each.
13. **Sibling pages that are mostly shared chrome.** Numbeo cost-of-living versus quality-of-life for the same city.
14. **Tile grids that exist because the metric exists.** Nomad List's lower two thirds.
15. **Page-farm posture.** City-Data rate-limited two fetch attempts.
16. **Confidence signalling that encodes only volume.** Glassdoor's confidence labels.

---

## RECOMMENDED SECTION ORDER FOR MARGINATLAS

Shared rules for all four page types:
- The answer sits at position 3, after an identity line and nothing else. Nothing renders above it except the identity line.
- Every number carries a unit, a reference date and a basis. No exceptions.
- Every headline number carries a band and one comparison anchor.
- Provenance is one sentence directly under the number, in the Indeed form: count, window, basis, updated.
- Running prose in the top two screens: target under 120 words for cell, city and industry; under 180 for country.
- Every section must change a decision on THAT page or it is cut.
- Absence is a typed token in the value slot with one legend per page, never a deleted row.

---

### CELL PAGE (country x geography x industry x sub-industry). The flagship.
Question: what does the owner of this business, in this place, actually keep?

| # | Section | Role |
|---|---|---|
| 1 | Identity line plus data month. Sub-industry, geography, country, and the period the figures describe. | Frame |
| 2 | **THE ANSWER.** Owner take-home, one number, largest type on the page. Beneath it: the low to high band, one provenance sentence, and one anchor (this figure against the country's all-trade take-home). | **ANSWERS** |
| 3 | The funnel that produces it. One table: revenue, costs, tax, take-home, with a value column and a share-of-revenue column. | EVIDENCE |
| 4 | Distribution. Take-home at the 25th, 50th and 75th, plus one line of at most 20 words naming what separates the top quartile. | EVIDENCE |
| 5 | Position row. One row, Trading Economics form: this cell, the national figure for this trade, the best and the worst covered geography in country. | EVIDENCE |
| 6 | What moves the number here. At most three factors, one sentence each, every sentence containing its own figure. | CONTEXT |
| 7 | Method and coverage. What is measured, what is estimated, what is absent, as a typed legend. | CONTEXT |
| 8 | Lateral. Same sub-industry nearby, other sub-industries here. | NAVIGATION |

**CUT:** any explainer of what the trade is beyond one clause in the identity line; a second hero chart restating the funnel; national market-size totals; demographic or lifestyle tiles; comments; testimonials; anything at all above the answer.

---

### COUNTRY PAGE
Question: of what a business earns here, what share does the owner keep?

| # | Section | Role |
|---|---|---|
| 1 | Identity line plus data year. | Frame |
| 2 | **THE ANSWER.** Government take as a percentage, one number, with band, provenance line, and the world-median anchor. | **ANSWERS** |
| 3 | Map plus cities, each city carrying its take-home number. Evidence and navigation in one component. | EVIDENCE |
| 4 | The standard trade set, six trades, one row each: revenue, cost, tax, keep. | EVIDENCE |
| 5 | Position row against peers: this country, regional median, best in region, worst in region. | EVIDENCE |
| 6 | Country character: the two six-spectrum tables (government-to-business, culture-to-outsider). | CONTEXT |
| 7 | Method and coverage legend. | CONTEXT |
| 8 | Lateral: cities, industries, neighbouring countries. | NAVIGATION |

**CUT:** population, percent urban, land area, history, geography, language lists, and every other fact Wikipedia already owns and owns better. Cut any "doing business in X" narrative block. Cut a second narrative section of any kind.

---

### CITY PAGE
Question: what does a business keep in this city, and why does it differ from the country?

| # | Section | Role |
|---|---|---|
| 1 | Identity line plus data month. | Frame |
| 2 | **THE ANSWER.** City take-home for the standard trade set, stated with its distance from the national figure in the same sentence. The parent country is the anchor, so the peer is never arbitrary. | **ANSWERS** |
| 3 | Neighbourhood spread. The intra-city range with the high and the low named, showing the range and not only the median. | EVIDENCE |
| 4 | The cost stack that explains the gap: rent, wages, tax, one row each, city against national. | EVIDENCE |
| 5 | Which trades actually clear here, ranked, with the keep number attached to each link. | EVIDENCE and NAVIGATION |
| 6 | Position row against three to five peer cities in the same country. | EVIDENCE |
| 7 | Method and coverage legend. | CONTEXT |
| 8 | Lateral: neighbourhoods, cells, the country. | NAVIGATION |

**CUT:** climate, population, tourism, things to do, photography, and every composite 0 to 100 score other than the Margin Index. Numbeo and Nomad List already own the liveability composite and it does not answer a business question.

---

### INDUSTRY PAGE
Question: what does this trade earn and keep, and where is it best?

| # | Section | Role |
|---|---|---|
| 1 | Identity line, data period, and **one sentence of scope** naming what counts as this trade and what does not. This is the single place a definition sentence earns its keep, per Wikipedia's lead rule. | Frame |
| 2 | **THE ANSWER.** Median take-home for the trade across covered geographies, with band, provenance line, and the all-trade median as the anchor. | **ANSWERS** |
| 3 | Where it pays best and worst. A ranked table capped at ten rows, with an explicit "showing 10 of N" and a real link to the rest. | EVIDENCE |
| 4 | The economics. Unit economics rows (revenue per site, cost split, keep) with a share-of-revenue column. | EVIDENCE |
| 5 | Subtype spread. Sub-industry and size-band variance, since variance-via-subtypes is the ratified stance. | EVIDENCE |
| 6 | Position row against adjacent trades. | CONTEXT |
| 7 | Method and coverage legend. | CONTEXT |
| 8 | Lateral: cells in this trade, cities, sub-industries. | NAVIGATION |

**CUT:** "what does an X do" explainers, industry history, trend commentary, and national market-size figures in currency. Market size is IBISWorld's product and it answers a question no individual owner has.

---

## OBSERVED ANTI-PATTERNS TO BAN

Each is written so a reviewer can answer yes or no against a rendered page.

1. No section explains what the industry, trade or place IS beyond one sentence of scope.
2. No commercial, CTA or upsell block appears between two data sections.
3. No heading is phrased as a search question.
4. No module appears unless it changes a decision on that specific page.
5. No number appears without a unit, a reference date and a basis.
6. No headline number appears without a band and at least one named comparison anchor.
7. No headline number appears without a stated sample size or an explicit statement that it is modelled.
8. No row is silently removed when its value is missing; the label stays and the value is a typed absence token.
9. No estimated figure is rendered at the same visual weight as a measured one.
10. No fallback to a coarser geography, a broader trade or a wider period happens without naming the substitute in the same sentence as the value.
11. No confidence badge is shown that encodes only sample volume.
12. No rank is published unless the peer set is named and the rank would change a decision.
13. No list exceeds ten rows without an explicit "showing 10 of N" and a working link to the full set.
14. No composite 0 to 100 score exists other than the Margin Index.
15. No user comments, reviews or other UGC appear anywhere below the data.
16. No two sibling pages share more than half their rendered content as chrome.
17. No metric is duplicated in two unit systems on the same page.
18. No chart restates the table immediately above or below it.
19. No prose paragraph exists that does not contain a number.
20. No element renders above the answer except the identity line.
21. No page ends in a grid of tiles that exist because the metric exists.
22. No section is gated, teased or blurred.

---

## APPENDIX: pages fetched and read

Fetched successfully (20): Levels.fyi role-by-location; Levels.fyi company-by-role; Payscale software engineer; Indeed software engineer; Robert Half salary guide hub; Numbeo Lisbon cost of living; Numbeo Lisbon quality of life; Nomad List Lisbon; Wikipedia Portugal; Wikipedia Austin, Texas; Our World in Data life expectancy topic page; Our World in Data life expectancy chart page; World Bank Portugal country data; Trading Economics Portugal indicators; IBISWorld US coffee shops; Statista Market Insights coffee Portugal; Data USA Austin; RentCafe Austin rent trends; stockanalysis.com Starbucks; GOV.UK set up a business.

Blocked (403 unless noted): Glassdoor, Crunchbase, Niche.com, Redfin, Zillow, Yelp, Realtor.com, BestPlaces, Expatistan, US BLS, Census QuickFacts; City-Data (429, twice); Statista topic pages (redirect loop); Our World in Data country profiles (client-rendered, returns a shell). Evidence for Glassdoor's confidence model, the census-style suppression symbols, the occupational-wage footnote codes and Redfin's section set was taken from search results and is labelled as such in the body.
