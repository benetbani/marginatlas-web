# Plan v18 Phase 3 — New homepage sections and free tools

Ranked candidates, each scored on Effort (E1-E5), SEO Lift (S1-S5),
Moat Strength (M1-M5), and Time-on-Site (T1-T5). Higher = stronger.

---

## 1 · Free tools (engineering-as-marketing)

### 1.1 Surprise-numbers gallery `★★★★★`

**Concept.** A rotating "you'll never guess" tile that pulls cells where
the median revenue is unintuitive — e.g. typical jewelry shop in a
mid-sized French city makes more than a typical software dev shop in
San Francisco. Click → cell page. Updates daily from a curated list of
anomalies the cross-country detector (Phase 7) surfaces.

**Why it works.** Curiosity is the #1 driver of click-through on data
sites. NYT data journalism ships this style every week. Costs zero
extra data — we already have the anomalies.

**Build.** New section on home + dedicated `/surprises` page with 50
fixed entries refreshed quarterly.

| E | S | M | T |
|---|---|---|---|
| 2 | 4 | 4 | 5 |

### 1.2 SMB cash-runway calculator `★★★★`

**Concept.** Type your industry + region + monthly revenue + headcount.
Tool tells you typical burn for your size, expected gross margin range,
months of runway given X cash on hand. Pulls from existing Atlas data.

**Why it works.** Solo operators search "how long will my cash last"
weekly. Currently no free tool answers it with country-localised data.
Drives signups for the AI layer (asking follow-up questions).

**Build.** Client component at `/tools/cash-runway`, reads from
`/api/cell-lookup`, produces a chart + plain-language summary. ~1 day.

| E | S | M | T |
|---|---|---|---|
| 2 | 5 | 3 | 4 |

### 1.3 "Is your margin healthy?" grader `★★★★`

**Concept.** Type your industry + country + your actual net margin. Tool
returns a letter grade (A-F) + percentile rank against country peers +
specific cost lines where you're high or low vs typical. Shareable
result page for backlinks.

**Why it works.** Operators love benchmarking themselves. The shareable
result page is SEO gold (each user generates a permalink-able page).
Atlas-badge embed program (Phase 5 moat work) plugs in here.

**Build.** Client component at `/tools/margin-grader`. ~1.5 days.

| E | S | M | T |
|---|---|---|---|
| 3 | 5 | 4 | 5 |

### 1.4 Two-country side-by-side widget `★★★`

**Concept.** Embedded on every country page: "How does this country
compare to X?" picker. Pre-populated with neighbours and major economies.
One click loads the same industry's numbers across both.

**Why it works.** Increases time-on-site, surfaces new pages, generates
internal links. Low build cost since `/compare` already exists.

**Build.** Reuse the compare logic; new mini-widget that's an iframe
or inline component. ~0.5 day.

| E | S | M | T |
|---|---|---|---|
| 1 | 3 | 2 | 4 |

### 1.5 "Build vs buy?" SMB unit-economics simulator `★★★`

**Concept.** Want to know if buying an existing business beats starting
one in this industry × region? Tool models 5-year cash flow under both
paths using Atlas's typical revenue, margin, and growth assumptions.

**Why it works.** High-intent search ("buy small business in X" is a
huge keyword family). Tool output is shareable + screenshot-friendly.

**Build.** Tougher math; needs an asset-intensity column from Atlas.
~3 days.

| E | S | M | T |
|---|---|---|---|
| 4 | 4 | 4 | 4 |

### 1.6 "What's typical for me?" anonymous instant benchmark `★★★★`

**Concept.** Single text field: "I run a [bakery] in [Lyon]." NLP parses
it, returns typical revenue, headcount, margin, and a "you stand out
because…" line. No signup. Numbers stay client-side.

**Why it works.** Lowest friction onboarding tool on the site. Funnels
into Pro tier ("see your full distribution + percentile rank").

**Build.** Hooks into the existing /ask LLM layer with a structured
output mode. ~1 day if /ask is live.

| E | S | M | T |
|---|---|---|---|
| 2 | 4 | 5 | 5 |

---

## 2 · New homepage sections

### 2.1 Pareto-tail showcase `★★★★`

**Concept.** New full-bleed section below the FEATURED grid: "What does
the top 0.1% earn in restaurants in California?" — shows the modeled
Pareto-tail number (already computed per cell). Three-tile carousel
rotating through dramatic top-0.1% values.

**Why it works.** Modeled-tail is unique signal nobody else has. Sticky
talking point for press / press-release angles.

**Build.** Use existing `pareto-tail-extrapolation` from Plan v15 Block
8a. New `<ParetoTailShowcase />` component. ~0.5 day.

| E | S | M | T |
|---|---|---|---|
| 1 | 3 | 5 | 4 |

### 2.2 Weekly industry deep-dive `★★★★`

**Concept.** Below "Snapshot of the week": a longer-form weekly
deep-dive on one industry with margin waterfall, top-5 cities,
correlation to GDP, founder-recommended reads. Generates 52
high-quality pages per year for SEO.

**Why it works.** Content cadence drives subscriber growth. Each
deep-dive is a backlink magnet. Templated authoring means low marginal
cost per piece.

**Build.** Markdown-driven (similar to blog) with a typed schema for
the data sections. ~2 days for the template; ongoing content cost.

| E | S | M | T |
|---|---|---|---|
| 3 | 5 | 3 | 4 |

### 2.3 Country-of-the-month spotlight `★★`

**Concept.** Replaces or augments cell-of-the-week — a deeper monthly
profile of one country's SMB landscape.

**Why it works.** Slow-burn content. Lower priority than 2.2.

**Build.** ~1 day.

| E | S | M | T |
|---|---|---|---|
| 2 | 3 | 2 | 3 |

### 2.4 "Find your number in 30 seconds" hero variant `★★★`

**Concept.** A/B alternate hero where the headline question is
interactive: user fills in `[business]` + `[city]` and the page reveals
their number inline without a route change.

**Why it works.** Reduces friction from current rotating-word hero
that doesn't act on the numbers. Same data layer; pure UX change.

**Build.** Client component variant; flag-gated. ~1 day.

| E | S | M | T |
|---|---|---|---|
| 2 | 3 | 2 | 5 |

---

## 3 · Interactive widgets / SEO levers

### 3.1 Atlas-badge embed program `★★★★★`

**Concept.** Cell pages add a "Cite this benchmark" button that copies
embed HTML. Sites that paste the embed get a real-time updating tile
plus a backlink to the cell page.

**Why it works.** Old playbook (StackOverflow, Wikipedia-style cite
buttons) that consistently builds SEO authority. Cost is one weekend.

**Build.** Static embed.js + iframe-friendly route at `/embed/...`
(already exists). Add the "Cite" CTA + share modal. ~1 day.

| E | S | M | T |
|---|---|---|---|
| 2 | 5 | 4 | 3 |

### 3.2 Hover-to-explore world map `★★★`

**Concept.** Replace the current CitiesDotsMap with an interactive
SVG world map. Hover a country → tile shows that country's top
industry. Click → navigates.

**Why it works.** Increases dwell time. Provides a guided discovery
mechanism the current navigator lacks.

**Build.** ~2 days; needs the country-by-iso2 dataset (already exists).

| E | S | M | T |
|---|---|---|---|
| 3 | 3 | 3 | 5 |

### 3.3 Margin distribution mini-chart on every search result `★★`

**Concept.** On the navigator results page (when implemented), each
search result shows a sparkline of the revenue distribution alongside
the typical number.

**Why it works.** Visual signal beats numeric signal.

**Build.** ~0.5 day once a results page exists.

| E | S | M | T |
|---|---|---|---|
| 1 | 2 | 2 | 3 |

---

## 4 · Prioritised execution order

If you tell me to build, this is the order:

1. **1.1 Surprise-numbers gallery** — feeds off Phase 7 anomaly data, minimal new code, maximum curiosity hook.
2. **3.1 Atlas-badge embed program** — single weekend, ongoing SEO compounding return.
3. **1.3 "Is your margin healthy?" grader** — shareable result pages = backlink generator.
4. **1.6 What's-typical-for-me anonymous benchmark** — funnel-of-the-funnel for Pro signups.
5. **2.1 Pareto-tail showcase** — half day, talking-point gold.
6. **2.2 Weekly industry deep-dive** — content engine.
7. **1.2 SMB cash-runway calculator** — high search intent.
8. **1.4 Two-country side-by-side widget** — low effort, modest lift.

Stop here for v1 of "new things." Items beyond this are diminishing
returns until something on this list ships and proves the channel.
