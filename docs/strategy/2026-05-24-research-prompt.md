# Research prompt — Margin Atlas monetization, conversion, SEO+SaaS hybrid

> Paste this whole block into a web-research-capable model (deep-research mode,
> with browsing on). Expect a 6000–10000 word answer back. Re-run it on a
> second model and diff the answers; the disagreements are where the real
> uncertainty is.

---

You are doing deep web research to help me make product, pricing, and
conversion decisions for **Margin Atlas (marginatlas.com)**.

Spend the time. Use the browser. Cite specific URLs. Where evidence is thin,
say so explicitly — do not paper over it. Where two reasonable sources
disagree, surface the disagreement.

## What Margin Atlas is

Margin Atlas is a small-business benchmark site. Every page is a country ×
city × industry "cell" — for example, *typical bakery in Lisbon, Portugal*.
Each cell shows typical revenue, payroll, after-tax owner take-home, the
distribution from bottom 10% to top 10%, and a multi-year time series.

Coverage today: ~194 countries, ~192 industries, 100+ ranked cities. The
data is real — compiled from official small-business statistics and
standardized for cross-country comparison. Not LLM-generated. Not survey
data. Not user-submitted.

The audience is:
- Small-business owners doing comp work on their own business.
- People considering opening a business and trying to size the opportunity.
- Consultants and accountants pricing engagements or building decks.
- Investors and M&A advisors sizing SMB markets or pricing acquisitions.
- Journalists looking up sector medians for stories.

Today everything is free and indexable. The visual brand is editorial —
calm, refined, no growth-hacky chrome, Stripe-level polish as a north star.
Not Gumroad. Not a course funnel. Not a hype-driven SaaS landing page.

## What I'm trying to decide

The product is **both** of two things at once, and that is the central
tension:

1. **An SEO destination.** Programmatic country × city × industry pages
   need to rank for long-tail queries like "average bakery revenue Lisbon"
   so anonymous traffic finds us. SEO traffic is the top of every funnel
   we will ever have. Aggressively gating content kills SEO.

2. **A future paid SaaS.** I need to monetize. The plan is a
   subscription tier (or two) that unlocks deeper data, exports, alerts,
   API, or other workflow features. Without paid revenue this is a hobby
   site.

Every decision I make has to satisfy both constraints. The job of this
research is to tell me how to draw the line — what stays free forever, what
goes behind the paywall, how to gate without breaking SEO, what nudge UI
to use, what pricing to set, and where the well-known sharp edges are.

## What I want from you

A long, opinionated research report. Use this structure:

### Section 1 — Comparable products: paywall structure

For each comp below, map out their actual paywall:

- What's free, indexed in the HTML, and visible to logged-out users?
- What's gated, and what's the gating mechanism (CSS overlay, server-side
  removal, login wall, registration wall, metered, hard paywall)?
- What's the pricing? Individual vs team vs enterprise tiers and their
  features.
- What's the nudge UI doing on a logged-out page? Modal? Inline lock
  icon? Blur? Gradient fade? Sticky upgrade bar? Be specific.
- How healthy is their SEO (do they rank for the queries you'd expect)?
- What's the lesson for Margin Atlas — copy this, avoid this, or
  irrelevant?

Mandatory comps to investigate (with browsing):
1. Glassdoor — login wall, give-to-get
2. Statista — premium statistics paywall
3. Crunchbase — Pro tier
4. PitchBook — enterprise gate
5. IBISWorld — industry reports
6. Numbeo — cost-of-living, mostly free
7. Trading Economics — macro freemium
8. Owler — small Pro tier
9. Levels.fyi — comp data, contribute-to-unlock
10. SimilarWeb — web analytics, hard quota
11. Zillow — programmatic SEO at scale, monetizes the other side
12. Ahrefs / Semrush — SEO data tools, hard paywall

Add 2–3 more you discover that fit the SEO+SaaS hybrid shape.

End with a table comparing all comps on: free depth, paid depth, gate UI,
price floor, SEO health, lesson for Margin Atlas.

### Section 2 — The cloaking question

This is the highest-stakes technical question. Answer it definitively.

- What is Google's actual policy on gated/paywalled content? Quote the
  official Search Central docs by URL.
- What's the difference between a paywall Google accepts and cloaking
  that gets you manually penalized? Define both precisely.
- What's the role of structured data — `isAccessibleForFree`, `hasPart`,
  `cssSelector` — in keeping a paywalled page indexed? Walk through a
  concrete example.
- What architectural pattern is safe? (Server-render full content, gate
  with CSS overlay, declare in JSON-LD — is that the right answer?)
- What's *not* safe? (Server-side removing data for non-subscribers and
  JS-injecting it after auth — explain why this is dangerous.)
- What does Google's "flexible sampling" guidance say about metering,
  and what are the thresholds?
- What real-world penalties have sites taken for getting this wrong?
  Cite cases.

### Section 3 — Programmatic SEO without thin-content penalties

Margin Atlas will eventually have tens or hundreds of thousands of
indexed pages (country × city × industry combinations). Most programmatic
SEO sites get penalized for thin content.

- What's the actual threshold for "thin content" — word counts, unique
  data points, internal links per page? Cite sources.
- How do sites that succeed at programmatic SEO (Zillow, Numbeo, Yelp,
  Wise, TripAdvisor) defend against thin-content penalties? What do
  their pages have that the penalized sites don't?
- How do you structure URLs so authority compounds and doesn't get
  diluted across duplicate canonical paths?
- How do you handle the cold-start problem — pages with little or no
  real data? Delete? noindex? Stub with a fallback?
- What's the role of internal linking density? How many internal links
  should a single cell page carry?
- How important are country/industry hub pages as link-equity
  reservoirs? What should they contain?

### Section 4 — Conversion UI: paywall and nudge patterns

Catalog every distinct UI pattern sites use to convert anonymous traffic
into paying customers. For each:

- Describe the visual treatment.
- Where in the page flow does it appear (above fold, after value
  delivered, at scroll depth, on Nth visit)?
- What does the user see vs what's gated?
- Concrete examples in the wild — URL screenshots if you can.
- Any published conversion-impact data.
- Is this pattern brand-safe for an editorial product, or growth-hacky?

Patterns to cover (find more):
- Blurred-data preview
- Truncated row count
- Locked time series
- Locked granularity / resolution gate
- Locked exports / CSV / embeds
- Email-gate (registration wall)
- Soft paywall with metered access
- Hard paywall
- "Premium peek" (one paid feature unlocked per page)
- Sticky upgrade bar
- Contextual upgrade after Nth action
- Comparison gate (one comparison free, more paid)
- Outline reveal / partial chart
- Inline "Pro" badge on numerical fields
- Free trial CTA placement: header, inline, end-of-page

### Section 5 — Pricing for data SaaS

- What are the price corridors for data products in 2026? Consumer
  (~$10–30/mo), SMB (~$30–100), analyst (~$100–500), team (~$500–2000),
  enterprise ($10k+/yr). Where do real comps land?
- What pricing structure fits Margin Atlas — flat monthly, annual
  discount, per-seat, usage-based (API calls), tiered features, lifetime
  access, freemium with caps? What's the right primary axis?
- What's the right starting tier price for a Pro individual subscription
  targeting SMB owners and consultants? Justify with comps.
- Should there be a second higher tier (Professional) immediately or
  later?
- When (if ever) should enterprise sales be added? At what triggers?
- Trial structure: 7-day free trial with credit card, 14-day without
  card, money-back guarantee, freemium-with-no-trial? Trade-offs.
- Annual discount: industry standard is ~17% (2 months free). Should
  Margin Atlas be more or less aggressive?

### Section 6 — What to give free, what to gate

This is the most product-specific section. Make a concrete recommendation
about which fields and views on a Margin Atlas cell page should be free
forever and which should be the first paid tier.

The fields available on a cell are:
- Cell title, location, industry name
- Median annual revenue
- Median payroll cost
- Median after-tax owner take-home
- Sample size
- Source citation
- Decile distribution (10th / 25th / 50th / 75th / 90th)
- Time series for each metric (5–10 years)
- City-level cut (vs country-level)
- Sub-industry cut (vs broad sector)
- Comparison to country median
- Side-by-side comparison with other cells
- CSV export of the current cell
- Embed code for charts
- API access for the cell

For each field, recommend: free / first paid tier / higher paid tier /
not yet. Explain the reasoning per field — what does the SEO traffic
need, what's the actual upsell, what would feel cheap to gate.

### Section 7 — The free → email → paid funnel

- How does an anonymous SEO visitor become a paying customer? Walk
  through the real funnel that works for editorial data products.
- What's the role of email capture — how aggressive should the inline
  newsletter signup be? Modal? Inline? End-of-page? Exit-intent?
- What's a good email nurture sequence for a data-product SEO visitor?
  Length, cadence, content mix.
- What triggers fire the in-product upgrade prompt? View count?
  Comparison count? Search depth? What's the published conversion lift
  for contextual prompts vs blind upgrade buttons?
- How important is the login wall vs going straight from anonymous to
  paid? Glassdoor argues login wall is essential; Trading Economics
  argues you can go anonymous → paid directly. Which is right for
  Margin Atlas?

### Section 8 — The "other side" of the marketplace

Glassdoor, Levels.fyi, and Zillow all started as consumer-facing free
databases and built their real businesses selling to the other side of
the transaction — employers (Glassdoor, Levels.fyi) or agents/lenders
(Zillow).

- What's the analogous "other side" for Margin Atlas? Franchisors? M&A
  advisors valuing SMBs? Lenders underwriting SMBs? SaaS companies
  pricing into SMB verticals? Be specific.
- For each candidate, what's the rough TAM and willingness-to-pay? Cite
  research.
- Is the right end-state two products (consumer subscription + B2B
  product), or just one? What's the sequencing?

### Section 9 — Anti-patterns specific to an editorial brand

The brand constraint cuts most growth-hacky conversion tactics. List
patterns that work statistically but should not be used for Margin
Atlas because they would damage the editorial brand:

- Exit-intent modals
- Scroll-jacking
- Countdown timers
- Fake scarcity ("only 3 seats left")
- Fake social proof ("100 people viewed this today")
- Aggressive sticky bars on first visit
- Upgrade interstitials between page views
- Login wall on first session
- Dark-pattern cancellation flows
- Clickbait copy
- AI-overclaim editorial paragraphs

For each: explain why it works for some sites and why it's still wrong
for an editorial brand. Don't just hand-wave — give the trade-off.

### Section 10 — Quick wins vs long arc

End with a prioritized plan.

**Quick wins** — things that can ship in the next sprint with no
architecture changes. Be specific: file changes, copy changes, UI tweaks.
At least 8 items, ranked by impact.

**Long arc** — what should ship over 3–6 months. Order them by
dependency. At least 6 items, with clear sequencing rationale.

For each item in both lists: estimate effort (S/M/L), estimate impact
(SEO / conversion / retention / brand), and flag any open questions
that need decisions before the work can start.

## Quality bar

This is going to inform real product decisions for a real business.
Honesty over confidence. Specificity over generality. URLs over
hand-waving. If you can't find evidence for a claim, say so explicitly.

If a section runs short because the evidence isn't there, that's
useful information — write the short version and flag the gap. Don't
pad.

Final length target: 6000–10000 words. Cite at least 30 URLs in the
appendix.
