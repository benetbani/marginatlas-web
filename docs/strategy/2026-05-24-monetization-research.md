# Conversion + monetization research for Margin Atlas

> Internal research report. Companion to `2026-05-24-research-prompt.md`
> (the founder's paste-ready brief). Produced by an in-house research
> agent over a single phased run on 2026-05-24. Use it as the first-pass
> answer to the same questions in the prompt; cross-check against the
> external model's answer when that comes back.

## Executive summary

Five things to internalize before any UI work:

1. **The cloaking risk is real but solvable, and the solution is mostly a single schema property.** Google explicitly accepts paywalled and CSS-overlay-gated content as long as the full HTML reaches Googlebot and you declare the gated regions with `isAccessibleForFree: false` plus `hasPart.cssSelector`. This is the single most important technical decision: render everything server-side, gate visually with CSS overlays on top of real DOM nodes, and mark the gated regions in JSON-LD. Anything else (server-side removing data for non-subscribers, dynamic JS injection of "real" data after auth) puts traffic at risk.

2. **The "Levels.fyi pattern" — contribution as currency — is the most aligned with Margin Atlas's brand.** Editorial sites that need both SEO scale and a paid future fare better with "give to get" or "log in to see one more level of detail" than with hard paywalls. Glassdoor and Levels.fyi both built audiences this way before monetizing employers, not individuals.

3. **Gate resolution, not topic.** Free pages should show the median, the country, the broad industry, and the most recent year. Paid should show the distribution (deciles), the city-level cut, the sub-industry, and the time series. Doing it this way preserves the SEO answer ("typical bakery in Lisbon makes X") while making the paid version genuinely more useful, not artificially crippled.

4. **The right first paid tier for Margin Atlas is one tier, around $29–$49/month, for individuals — not enterprise sales.** The audience (owners, consultants, prospective founders) does not buy $15k IBISWorld licenses. Statista at ~$400+/year for individuals is the upper bound; Owler Pro at $35/month and Crunchbase Pro at $99/month are the corridor. Margin Atlas should land at the lower end to maximize conversion volume from SEO traffic, and add a second "Professional" tier later for CSV/API/embed.

5. **The brand constraint cuts most growth-hacky patterns.** No exit-intent modals, no scroll-jacking, no countdown timers, no "100 people are viewing this now," no aggressive sticky bars, no upgrade interstitials between page views. Leave them on the table even though they convert — they cost more in brand than they earn in MRR for a site whose moat is editorial trust.

---

## Phase 1: Comparable products

### 1. Glassdoor — login wall, "give to get"

**Pattern:** Aggressive login wall with the "Give to Get" reciprocity model. Visitors get a small sample (salary headline, range, a few reviews) before a fullscreen overlay locks the page. To get unlimited access for a year, the user must submit either a salary, a review, an interview, or a benefits review.

**SEO posture:** Salary headline and a few data points are in the HTML and indexed. The overlay is CSS/JS on top of real DOM, which is why Google still ranks Glassdoor pages and why third-party "paywall remover" userscripts work by just removing the overlay class — confirming the underlying data sits in the page.

**Nudge UI:** Hardsell modal that prevents scroll (`overflow: hidden; position: fixed`), social proof in modal ("Join X million members"), single primary CTA.

**Pricing:** Free to consumers; monetization is recruiter B2B (Glassdoor for Employers), not individual subscriptions.

**Lesson for Margin Atlas:** The "give to get" mechanic is a soft alternative to a hard paywall and works specifically because the contribution improves the dataset. Margin Atlas has a structural disadvantage here: visitors don't have proprietary data to contribute (revenue figures are sensitive, not casually shared). So pure Glassdoor-style reciprocity won't work, but a lite version — "log in with email to unlock one more decile" — could.

### 2. Statista — soft metered + hard paywall on data assets

**Pattern:** Heavy SEO-optimized intro text and educational copy (fully visible and indexed). The actual chart / table is the gated asset — sometimes a preview thumbnail with "Premium Statistic" badge, sometimes a download button that requires subscription.

**SEO posture:** Statista pages rank because they publish substantial indexable prose around each statistic — the description, the source citation, the methodology, related links. The data itself is the upsell.

**Nudge UI:** "Premium statistic" badge on the chart, locked download buttons, sidebar of related premium stats, soft modal ("Get this statistic with a subscription").

**Pricing:** ~$199 single-stat purchase historically; individual annual plans in the $400–$600/year range; enterprise from there. Pricing deliberately opaque.

**Lesson for Margin Atlas:** Statista's structural insight is that the *chart is the product*. The surrounding context is SEO bait. Margin Atlas can borrow this — let the page narrate the typical revenue/payroll/take-home in prose, with one summary chart free, and reserve the deep distribution chart as a "Pro statistic."

### 3. Crunchbase — generous logged-out preview, Pro for depth + workflow

**Pattern:** Logged-out users see the company name, description, basic firmographics. Funding totals are visible at low resolution (round count, total raised). Individual round details, investor lists, employee growth signals, exports, alerts, advanced search, and CRM integrations are Pro/Business. Pro is $99/month or $588/year.

**SEO posture:** Crunchbase pages rank well because the surface layer (description, headcount range, founded year, location, top investors at low fidelity) is in the HTML. Detail rows have a lock icon and a teaser of what they contain.

**Nudge UI:** Lock icons inline next to gated fields. "Unlock with Pro" inline buttons. Persistent "Try Pro free for 7 days" header CTA.

**Lesson for Margin Atlas:** The inline lock-icon pattern is the most editorial-feeling of all paywall UIs — it sits inside the data, doesn't break flow, and the gate appears precisely where the user wanted more. This is the single most copyable UI motif.

### 4. PitchBook — fully gated, B2B-only

**Pattern:** No real free tier. Marketing pages are SEO-indexed, but data pages are behind a paywall starting at ~$25k/year. Free trial available on request.

**Lesson for Margin Atlas:** This is the wrong shape for Margin Atlas — it works for PitchBook because the buyer is an institutional bank/PE firm with budget. Margin Atlas's buyer is an SMB owner who will not even start a sales conversation. A Crunchbase-style self-serve tier is correct; a PitchBook-style enterprise gate is not. Mentioned only to mark the boundary of what *not* to do.

### 5. IBISWorld — sample reports as lead magnets, enterprise sales

**Pattern:** Industry pages indexable as overview/teaser. Full reports are a paid download, and the "free sample" is a lead-gen form (you give email + company info to get a sample of the industry report). Most actual buyers are universities and Fortune 500 strategy teams.

**SEO posture:** Strong because IBISWorld has been publishing industry-named URLs for two decades. Each industry has an evergreen URL and a high-authority backlink profile from libraries and citations.

**Lesson for Margin Atlas:** IBISWorld monetization is enterprise sales — wrong model for Margin Atlas. But the URL structure (industry-name URLs that compound link equity over years) is the right structural bet. Margin Atlas's country × industry × city grid is the IBISWorld URL move at programmatic scale.

### 6. Numbeo — fully free pages, monetization via API and ads

**Pattern:** Almost everything visible. Premium tools (historical analysis, salary calculator, downloadable CSVs, commercial API, HR reports) sit in sub-pages linked from navigation. Cost-of-living pages have no blur, no login wall — just navigation links to "Premium" tools.

**SEO posture:** Probably the closest analog to what Margin Atlas is today. Numbeo dominates "cost of living [city]" because the page is fully readable, fully indexable, fully linkable. Monetization is downstream: API subscriptions, data licenses, ads.

**Lesson for Margin Atlas:** Numbeo's lesson is that *you can keep the page mostly free and still monetize* — but you do it by selling the asset wholesale (API, CSV, license) and the dashboard tools, not by gating the page itself. This is a viable end state for Margin Atlas if it wants to preserve maximum SEO. The tradeoff is that consumer subscriptions become impossible — you'd never gate enough to justify $29/month.

### 7. Trading Economics — visible chart, gated history + API

**Pattern:** Each indicator page (US GDP, etc.) shows the most recent value, a chart of recent history, a forecast, and related metrics in the page. Full historical depth, download, and API live behind a subscription. Navigation aggressively promotes API Gateway and Data Plans.

**SEO posture:** Fully indexed; the gate is on *depth* (historical), *format* (download), and *programmatic access*, not on the answer to the visitor's question.

**Lesson for Margin Atlas:** This is the cleanest blueprint for the SEO-first SaaS hybrid. The free page answers the search query ("US GDP 2024"), the paid product is everything you'd want next (history, download, API). Margin Atlas should mostly copy this.

### 8. Owler — small free tier as community wedge

**Pattern:** Community plan is free but capped at 5 tracked companies and 1 profile view/month. Pro at $35/month unlocks the dataset and alerts. Enterprise adds CRM integrations.

**Lesson for Margin Atlas:** The $35 Pro tier is in the corridor that small business owners and consultants can self-justify. The freemium cap (5 tracked companies, 1 view/month) is a usage-based gate, not a content gate, which preserves SEO.

### 9. Levels.fyi — contribution unlock, B2B as the real business

**Pattern:** Aggregated salary data is free and indexed. Individual salary submissions in the "Latest Submissions" table are masked with asterisks; you unlock by submitting your own comp. Real revenue is from Levels.fyi for Employers (compensation benchmarking) and negotiation coaching.

**SEO posture:** Excellent — pages rank for "Google L4 software engineer salary" and similar queries because the medians, ranges, and distribution chart are all visible and in the HTML.

**Lesson for Margin Atlas:** Of all comps, Levels.fyi has the closest brand shape — editorial, calm, not gimmicky, monetizes B2B (employers). Margin Atlas could legitimately follow the Levels playbook: keep consumer-facing pages free and beautifully ranked; monetize through a B2B offering for consultants/franchisors/investors who need bulk access and exports.

### 10. SimilarWeb — fast free→paid drop-off, hard upper limits

**Pattern:** Free Chrome extension and a public-domain dashboard show high-level traffic. Once you try to drill into countries, keywords, demographics, history, or competitor lists, you hit upgrade walls within ~15 actions/day. Starter is $1,500/year.

**SEO posture:** Strong — the high-level overview is indexable. Drilldowns are gated.

**Lesson for Margin Atlas:** SimilarWeb is the warning case for what happens when the gate is too aggressive. G2 reviews repeatedly say "you hit the paywall the moment you do anything useful," which makes them feel adversarial. Margin Atlas should err in the opposite direction.

### Two additional patterns worth noting

**Zillow** — pure SEO domination via programmatic pages (~5.2M pages, 33M visits/month). Free to consumers; monetizes via agents/lenders paying for leads. Validates the "stay free, monetize the other side of the marketplace" model for Margin Atlas, *if* there is a clear "other side" (recruiters? franchisors? lenders to SMBs?).

**Glassdoor + Levels.fyi convergence** — both started as consumer-facing free databases, then built the real business selling to the other side (employers). For Margin Atlas, the structural equivalent is selling to franchisors, M&A advisors valuing SMBs, lenders underwriting SMBs, and SaaS companies pricing into SMB verticals. Worth keeping as a possible Phase 2 monetization beyond the individual subscription.

### Comp summary table

| Comp | Free depth | Paid depth | Gate UI | Price floor | SEO health |
|---|---|---|---|---|---|
| Glassdoor | Salary headline + few reviews | Full reviews/details | Hardsell login modal | Free, B2B revenue | Strong |
| Statista | Description + 1 free chart | The chart itself + downloads | Premium badge + locked DL | ~$400/yr individual | Strong |
| Crunchbase | Firmographics + low-res funding | Round details, exports, alerts | Inline lock icons | $99/mo | Strong |
| PitchBook | Marketing pages only | Everything | None (request demo) | $25k+/yr | Weak (B2B) |
| IBISWorld | Industry teaser | Full PDF report | Sample-download lead form | $1k+/report | Strong |
| Numbeo | Almost everything | Tools + API + CSV | Navigation links only | API pricing varies | Very strong |
| Trading Economics | Headline value + recent chart | History + downloads + API | Sticky promo nav | Tiered | Strong |
| Owler | 5 companies tracked | Full dataset + alerts | Usage cap | $35/mo | Moderate |
| Levels.fyi | Aggregated comp | Individual rows + B2B tools | Asterisks on rows | Free, B2B revenue | Strong |
| SimilarWeb | High-level traffic | Country/keyword drilldowns | Action quota + walls | $1,500/yr | Strong |

---

## Phase 2: Nudge pattern library

### 1. Blurred-data preview

The most-recognized paywall pattern. A chart, table, or field is rendered but with a CSS blur filter (`filter: blur(4–8px)`) and a centered overlay with lock icon + CTA. Used by app paywalls, news outlets, and analytics tools. The underlying DOM is real, which means it's indexable, and the blur is purely visual.

Caveat: heavy blur on charts can feel tacky. A subtler variant — render real axis labels but blur only the bar/line geometry — reads as more editorial.

### 2. Truncated row count ("showing 10 of 247")

A list shows the first N rows clearly, then either fades to gradient + CTA or shows a row count: "Showing 10 of 247 — unlock all." Used by SimilarWeb, Owler, Crunchbase competitor lists.

Strength: zero distortion of what's shown; just a visible cap. Weakness: the visible 10 may already answer the question, so conversion depends on the user *needing* the long tail.

### 3. Locked time series

Free shows the last year (or last quarter); the chart x-axis extends backward into a grayed-out region with "Subscribe for 10-year history." Trading Economics uses a softer variant of this. Strong fit for a benchmark site like Margin Atlas because longitudinal data is genuinely a different product, not a crippled version.

### 4. Locked granularity (resolution gate)

Free shows the country aggregate; paid shows the city-level cut. Or: free shows the broad industry; paid shows the 4-digit sub-industry. Free shows the median; paid shows percentiles. The user sees a satisfying answer at low resolution and discovers paid as a zoom-in.

This is the single most important pattern for Margin Atlas. Every other paywall UI is window dressing; this is the actual monetization logic.

### 5. Locked exports / downloads / embeds

The data is visible on-screen, but CSV download, PNG export, embed code, and API are paid. Trading Economics, Statista, Numbeo all do this. Cheap to implement, doesn't dilute SEO at all, and aligns with the buyer profile (consultants and analysts who need the data in their own deliverables).

### 6. Email gate (soft paywall, no payment)

A modal asks for email after some scroll depth or page-count threshold. Sometimes called a "registration wall." Used by NYT, FT, many B2B research sites. Two purposes: build the email list for nurture; cap anonymous scrapers.

For Margin Atlas: probably too aggressive in pure form, but a small inline "Get the weekly small-business benchmarks email" placement is fine.

### 7. Metered access

Free for N pageviews/month per device or per cookie; after N, hit the wall. Industry default for news sites; Google has explicit "flexible sampling" guidance saying 6–10 per month is fine for news. For a data product, you'd meter on "deep views" (deciles, time series) rather than on basic page hits.

### 8. Hard paywall

No access without subscription. PitchBook, S&P Capital IQ. Wrong for SEO-first; the only reason to ever use this is if the data is so unique and high-value that buyers will find you anyway.

### 9. "Premium peek" (one paid feature shown free per page)

The user gets to see one paid feature unblurred on each page as a taste — different page, different sample. The mechanic builds curiosity ("what else is in here?") without giving away the catalog. Underused in the wild; works particularly well on programmatic SEO sites because page volume is the offset.

### 10. Sticky upgrade bar

A persistent footer or top bar with "Unlock all 247 industries × 100 cities — start free trial." Effective but visually loud. For Margin Atlas's editorial brand, only use it on the second page-view in a session, not on the first; first impressions should feel calm.

### 11. Contextual upgrade after action

"You've viewed 5 cells this week" or "You've compared 3 cities this week." Triggered by behavior, shown only after the user has demonstrated intent. Highest-converting nudge pattern in SaaS research — contextual prompts hit 3x baseline conversion. Editorial-safe because it only fires for engaged users.

### 12. Comparison gate

Free shows one cell (one country × industry); paid shows side-by-side comparison of two or more. For Margin Atlas this is obvious and powerful: "Compare Lisbon bakery to Madrid bakery — Pro." The free user can intuitively see why they'd want this; the gate doesn't feel arbitrary.

### 13. Resolution gate (distinct from granularity)

Free shows the median; paid shows the full decile distribution. Free shows a single year; paid shows the 5-year time series at the same node. This is a sibling of granularity (#4) but operates on *statistical depth* rather than *geographic/industry depth*. Both should be used.

### 14. Outline reveal / partial chart

Render the axes, the title, the legend — but blur or empty the data series itself. The chart's "shape" is teased. Lower-key than full blur because the data shape is genuinely hidden.

### 15. Pro badge on inline numbers

A small "Pro" pill next to specific numerical fields inline in the data. Crunchbase does this for funding round details. Most editorial-feeling of the patterns because it doesn't change layout; it just labels which fields are members-only.

That's 15 distinct patterns. The ones that fit Margin Atlas's brand are #2, #3, #4, #5, #9, #11, #12, #13, #15. The ones that don't: #1 (too tacky), #6 (too transactional), #8 (kills SEO), #10 (too loud).

---

## Phase 3: SEO-first SaaS strategy

### The cloaking question, settled

Google's position is unambiguous and worth quoting in plain terms: a paywall or content gate is not cloaking *if* Googlebot can see the same underlying content a paying user would see, and *if* the gating is declared via structured data.

The mechanics:

- Render the full content server-side. The data is in the HTML response.
- Gate visually with CSS overlays, blur filters, or `display: none` on a wrapping container. The DOM still contains the data.
- Mark the gated regions with a class selector (e.g. `.paywall`).
- Add JSON-LD with `"isAccessibleForFree": false` and `"hasPart": { "@type": "WebPageElement", "isAccessibleForFree": false, "cssSelector": ".paywall" }`.
- Google's own documentation confirms HTML overlays on top of underlying content are explicitly fine and analogous to cookie banners.

What you must *not* do:

- Strip the data from the server response for non-subscribers, then inject it via JS after auth. Googlebot won't see it on subsequent crawls and you lose ranking.
- Show Googlebot one version (full data) via user-agent sniffing and humans another. This is textbook cloaking and gets manually penalized.
- Hide content with `visibility: hidden` or `display: none` without the structured data declaration. Google may still index it, but you lose the safety net.

For Margin Atlas, the implication is architectural: every page must server-render the full data, and the gate is a presentation-layer concern. If the engineering team is building the gate by fetching gated data only when authenticated, that's the wrong shape and will hurt SEO.

### Programmatic SEO that doesn't get punished

The thin-content penalty is the other half of the equation. Google penalizes programmatic pages that swap a city name into otherwise identical boilerplate. The defense is:

- **Real, differentiated data on every page.** The country × industry × city cell must contain numbers that are actually different from neighboring cells. This is already Margin Atlas's strength — the data is real.
- **Editorial framing per page.** A short, generated-but-data-driven paragraph: "The typical bakery in Lisbon reports €X in annual revenue, with the top decile clearing €Y. This is N% above/below the country median." This isn't AI slop if it cites real numbers and is short.
- **Internal linking that compounds.** Each cell links to its country page, its industry page, its city page, and its nearest comparables. This is the structural reason Numbeo, Zillow, and IBISWorld rank so widely.
- **Thresholds:** at least ~300 words of meaningful content per page, at least three unique data points per page, valid canonical tags, fast Core Web Vitals.

The trap to avoid: building 50,000 pages with the same chart template, the same paragraph template, just swapping country names. Google's quality systems detect that and the whole site gets devalued, not just the empty cells. Better to launch 10,000 well-populated cells than 100,000 sparse ones.

### URL structure for compounding authority

Three rules:

1. URLs name the thing, not the path to it. `marginatlas.com/portugal/lisbon/bakery` is right; `marginatlas.com/data/cells?country=pt&city=lisbon&industry=311811` is wrong. The first accumulates inbound links over time as a stable canonical address; the second is dead to SEO.
2. Avoid duplicate canonical paths. A bakery in Lisbon shouldn't also be reachable at `/lisbon/portugal/bakery` and `/industries/bakery/lisbon`. Pick one canonical; the others should 301-redirect or use `rel=canonical`.
3. Country and industry hub pages must exist and be high-quality. They're where authority concentrates and gets pushed down to leaf cells.

### The free → email → paid funnel

Of all the lifecycle questions, the most important is: what's the bridge between an anonymous SEO visitor and a paying customer? The pattern that works for editorial data sites:

1. **Anonymous SEO visit.** Reads the free median + chart for their cell. No friction.
2. **Email capture, optional and low-key.** Inline newsletter signup ("Weekly small-business benchmarks — Sundays") or a benchmarking PDF for their industry. No popup.
3. **Email nurture.** 6–10 emails: methodology, surprising findings, comparison stories, a "your industry vs. neighbors" rundown. Each email naturally references the deeper paid product.
4. **Trigger-based upgrade prompt.** After a user has viewed N cells or compared M cities, contextual prompt: "You're using Margin Atlas like a Pro user — here's what Pro unlocks." This converts at ~3x the baseline of a blind upgrade prompt.
5. **Free trial or money-back.** 7-day free trial with credit card, or 30-day money-back. SimilarWeb requires CC; Levels.fyi B2B doesn't. For SMB owners, the trial-with-CC pattern has higher conversion-to-paid but lower trial start rate. Pick based on what you want to optimize.

### Pricing positioning for data SaaS

The market gives clear corridors:

- **$10–$30/mo:** Consumer tools, low-cost SMB tools. High volume, high churn.
- **$30–$100/mo:** SMB-friendly research tools. Owler $35, Crunchbase Pro $99. Where Margin Atlas's first tier should land.
- **$100–$500/mo:** Analyst/consultant tools. Statista individual (~$40/mo equivalent), SimilarWeb Starter (~$199), Ahrefs Lite $129.
- **$500–$2,000/mo:** Team and small enterprise. SimilarWeb Pro, Crunchbase Business.
- **$10,000+/yr:** True enterprise data (PitchBook, IBISWorld, S&P Capital IQ).

For Margin Atlas's audience, the bull case is two consumer-ish tiers: a $29 or $39 individual tier (unlocks resolution + city + history), and a $99–$149 Pro tier (unlocks exports, API rate, embeds, comparison views, multi-seat). Resist enterprise sales motion for at least two years — the SEO traffic moat is more valuable than five $10k accounts.

Billing model: monthly subscription with annual discount (2 months free is standard). Pure usage-based is the wrong fit because the buyer isn't a developer; they want predictable cost. If the API/embeds business grows, layer a usage-based meter on top of the Pro tier later.

---

## Phase 4: Margin Atlas recommendations

### (a) What to keep free forever

For each cell page (country × city × industry):

- Cell title and headline: "Typical bakery in Lisbon, Portugal."
- One-paragraph editorial summary built from the data.
- Median annual revenue (single number).
- Median payroll cost (single number).
- Median after-tax owner take-home (single number).
- One summary chart showing the median over the last three years.
- Sample size note ("Based on N businesses").
- Source citation and methodology link.
- "See typical [industry] in [other city]" related-cell links (10–20 internal links).
- "Compare to country median" with a single comparison bar (free version of the comparison feature — see (d) for the gated version).

Country and industry hub pages should be fully free — they're the link-equity reservoirs.

Rationale: this set answers the user's search query and earns the page its right to rank. Everything more granular is a legitimate upsell.

### (b) First paid tier — Margin Atlas Pro, ~$29–$39/month

On every cell:

- Full decile distribution (10th / 25th / 50th / 75th / 90th percentile) instead of just median.
- City-level cut where the free view only showed country.
- Sub-industry cut (4-digit NAICS / ISIC) where the free view showed broad sector.
- Time series back to data availability (typically 5–10 years) instead of 3 years.
- Side-by-side comparison view: drop in 2–5 cells, see them on one chart.
- CSV export of the current cell's data.
- Saved cells / watchlists.
- Ad-free (if free pages ever carry ads).
- Newsletter from the analyst team, with proprietary takes that don't appear on public pages.

Rationale: this is the "zoom in" tier. Every Pro feature is a genuine extra resolution of what the free user already saw. None of it is a free feature artificially crippled, which is the difference between feeling generous and feeling extortive.

### (c) Higher tier — Margin Atlas Professional, ~$99–$149/month

- API access with reasonable rate (e.g. 10k calls/month).
- Bulk CSV export by industry or by country.
- Embed code for charts on consultant sites with attribution.
- Multi-seat (up to 3 users).
- Custom comparison reports (PDF generation).
- Email alerts when a tracked cell updates.
- Priority data requests (request a sub-industry that isn't yet covered).

Rationale: this is for the consultant, the M&A advisor, the franchisor doing market sizing. The features are workflow features, not data features.

Defer enterprise sales (custom contracts, white-label, full-dataset license) until there's clear inbound demand.

### (d) Specific UI patterns to add

**(i) Blurred preview — distribution chart.**

Placement: directly below the free median chart, same page. Header reads "Distribution by decile." Render the actual decile bars at their real heights server-side, then apply a CSS overlay with a soft gradient fade and a subtle lock pill in the corner reading "Pro." Hover/tap surfaces a tooltip: "See the full distribution from 10th to 90th percentile — Margin Atlas Pro, $29/mo."

Treatment notes: do not use heavy blur. Use a `mask-image` linear gradient that fades the bars to 30% opacity from left to right, leaving the leftmost bar (10th percentile) faintly readable as a teaser. The chart axes, title, and legend stay crisp. Reads as editorial restraint, not as paywall.

Copy: "Distribution — Pro" badge in the chart header. No giant CTA in the chart itself; the chart links to the pricing page.

**(ii) Row count truncation — comparable cells list.**

Placement: bottom-of-page "Compare to other cities" section. Show 5 city comparisons fully (city name, median revenue, % difference from current cell). Then a single inline row: "and 87 more cities — Pro."

Treatment: the 6th row is a real row with the same typography as rows 1–5, but the values are dimmed and the city name is replaced with the count line. No modal, no button, no gradient. Click takes the user to the pricing page with the current city pre-selected for trial.

Copy: "and 87 more cities — open with Pro." Lowercase, no exclamation marks.

**(iii) Locked time series.**

Placement: chart of typical revenue over time. The chart x-axis spans 2014–2024 (the full available history). The free user sees the line/bars for 2022–2024 fully rendered; 2014–2021 is rendered but with reduced opacity (~25%) and the years are dimmed.

Treatment: a single thin vertical divider at the 2022 boundary, with a small "Pro" pill on the historical side. No overlay, no blur, no CTA on the chart itself. A small caption below: "Full history available with Margin Atlas Pro."

Why this works: the user immediately understands what's gated (older years) and what they have (recent). No mystery, no manipulation.

**(iv) Comparison gate — one comparison free, two+ paid.**

Placement: a "Compare" tool either as a dedicated page or as an expandable panel on each cell. Free user can compare the current cell to one other cell (typically the country median, prefilled). To add a second comparison, the "+ Add comparison" button shows a Pro pill and opens a trial signup on click.

Treatment: the first comparison appears as a clean side-by-side bar chart. The "+ Add" button is grayed but visible, with the Pro pill. Hover: "Compare up to 5 cells with Pro."

Copy: "Add another cell to compare — Pro."

**(v) Premium peek — one Pro feature unblurred per page.**

Placement: rotate which feature is shown free on each cell page. On the Lisbon bakery page, show the full decile distribution unblurred but show the time series as the locked one. On the Madrid bakery page, show the time series unblurred but lock the distribution. Different cells, different unlocked features.

Treatment: at the top of the unblurred feature, a single subtle line: "Today's Pro preview." This signals to the user that they're seeing something usually paid, that the site is fundamentally generous, and that there's more behind the gate.

Why this works: it functionally lets the user experience the paid product across many sessions without ever giving away the whole catalog on one page. It also turns repeat visits into a kind of treasure hunt, which is good for engagement and retention.

### (e) Pricing recommendation

- **Free:** unlimited browsing, median data, country-level granularity, last 3 years.
- **Pro:** $29/mo or $290/yr (~$24/mo effective). Resolution, granularity, history, exports, comparisons, watchlists, ad-free.
- **Professional:** $99/mo or $990/yr. API, bulk export, embeds, 3 seats, alerts.
- **Enterprise:** defer, "contact us" placeholder if needed for credibility.

Trial: 7-day free trial with credit card required for Pro. 14-day for Professional. Money-back guarantee on the first invoice.

Why this shape: Pro at $29 is in the impulse-purchase zone for an SMB owner who's already on the site looking up their own industry. $99 is consultant-justifiable. Anything north of $99 needs a sales motion that doesn't fit the audience.

### (f) Anti-patterns — what NOT to do

- **No exit-intent modals.** Cheap; brand-corrosive.
- **No scroll-jacking.** Visitors should be able to scroll through any free page without being interrupted.
- **No countdown timers.** Not editorial.
- **No social proof shouts.** Not editorial.
- **No heavy chart blur.** Use opacity fades and gradients. Heavy blur reads as cheap SaaS.
- **No fake scarcity.** Not editorial.
- **No upgrade interstitials between page views.** The page is the product; never block the page.
- **No login wall on the first visit.** Glassdoor-style hardsell modals would tank Margin Atlas's brand.
- **No "free trial" buttons in body text on every page.** Make the CTAs feel earned by the data.
- **No clickbait copy.** Just don't.
- **No AI-generated editorial paragraphs that overclaim.** Generated copy is fine if it's tight, data-cited, and adds nothing the data doesn't already say.
- **No dark patterns in cancellation.** One-click cancel. This is brand-defining for an editorial product.

### (g) Quick wins (next sprint, no architecture changes)

1. Add structured data (`isAccessibleForFree: false` on the to-be-gated regions, even before they're gated) so the marker is in place when gates ship.
2. Audit URL structure for canonical paths and redirects. Lock down the structure before traffic compounds on the wrong URLs.
3. Add an inline newsletter signup at the end of each cell page. Plain, small, single-field. Start building the email list now.
4. Add the "Today's Pro preview" header to one section per page, even before there's a Pro tier — establishes the visual vocabulary.
5. Add "Distribution — Pro" badges to chart titles even with no gate behind them, just to start training the visual hierarchy.
6. Add a methodology page linked from every cell. Builds trust and SEO depth.
7. Add a pricing page (even with placeholder pricing) at `/pricing` and link from the footer. Creates the destination for future CTAs.
8. Internal linking sweep: every cell should link to 10–20 related cells. Trivial to ship; large compounding effect.

### (h) Long arc (3–6 months)

1. **Ship Pro tier with one gated feature first** (probably the decile distribution). Measure conversion rate. Don't ship all gates at once.
2. **Build the comparison view** as the second gated feature. This is the most "obviously valuable" upgrade and is a strong conversion trigger.
3. **Ship CSV export.** Smallest engineering effort, highest perceived value for analysts.
4. **Build the email nurture sequence** (6–10 emails over 30 days) and connect it to the inline newsletter signup.
5. **Add API in beta** (waitlist, then private beta, then Professional tier launch).
6. **Ship watchlist + alerts.** Turns the site from a reference into a workflow tool, which is how reference data products graduate to retained subscribers.
7. **Decide on B2B motion.** After 3 months of consumer Pro signups, look at who's converting. If franchisors, M&A advisors, or lenders show up, the second monetization wedge is selling to them — and that's where Margin Atlas can eventually be a much bigger business than the consumer subscription alone.

---

## Appendix: sources

- Google Search Central — Subscription and paywalled content structured data: https://developers.google.com/search/docs/appearance/structured-data/paywalled-content
- Google Search Central — Flexible Sampling Guidelines: https://developers.google.com/search/docs/appearance/flexible-sampling
- Google Search Central — Spam Policies: https://developers.google.com/search/docs/essentials/spam-policies
- Playwire — isAccessibleForFree complete guide: https://www.playwire.com/blog/isaccessibleforfree-the-complete-guide-to-structured-data-for-paywalled-and-gated-content
- Search Engine Land — Google replaces First Click Free with Flexible Sampling: https://searchengineland.com/google-first-click-free-replaced-flexible-sampling-283667
- Glassdoor blog — Give to Get policy explained: https://www.glassdoor.com/blog/give-to-get/
- Levels.fyi homepage and contribution flow: https://www.levels.fyi/
- Levels.fyi offerings page: https://www.levels.fyi/offerings/
- Statista pricing on Vendr: https://www.vendr.com/marketplace/statista
- Crunchbase Knowledge Center — free vs paid tiers: https://support.crunchbase.com/hc/en-us/articles/360062989313
- Crunchbase Pro pricing on G2: https://www.g2.com/products/crunchbase/pricing
- PitchBook pricing breakdown on EasyVC: https://easyvc.ai/vs/pitchbook-pricing/
- IBISWorld free sample landing page: https://www.ibisworld.com/free-report-sample/
- Numbeo motivation and methodology: https://www.numbeo.com/common/motivation_and_methodology.jsp
- Numbeo Lisbon cost of living page: https://www.numbeo.com/cost-of-living/in/Lisbon
- Trading Economics US GDP page: https://tradingeconomics.com/united-states/gdp
- Trading Economics API pricing: https://tradingeconomics.com/api/pricing.aspx
- Owler pricing on G2: https://www.g2.com/products/owler/pricing
- SimilarWeb pricing: https://www.similarweb.com/packages/marketing/
- Zillow programmatic SEO breakdown — Daydream: https://www.withdaydream.com/library/zillow
- Backlinko — Programmatic SEO guide: https://backlinko.com/programmatic-seo
- Discovered Labs — Programmatic SEO mistakes: https://discoveredlabs.com/blog/common-programmatic-seo-mistakes-that-kill-pipeline-and-how-to-fix-them
- RevenueCat — Freemium tier design: https://www.revenuecat.com/blog/growth/freemium-tier-design/
- Userpilot — Free trial conversion rates: https://userpilot.com/blog/free-trial-conversion-rate/
- Appcues — Free-to-paid upgrade prompts: https://www.appcues.com/blog/best-freemium-upgrade-prompts
- Maxio / NxCode — SaaS pricing models 2026: https://www.nxcode.io/resources/news/saas-pricing-strategy-guide-2026
- Ahrefs — Gated content glossary: https://ahrefs.com/seo/glossary/gated-content
