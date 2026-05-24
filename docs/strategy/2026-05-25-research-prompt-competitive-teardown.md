# Research Prompt 3 of 3 — Competitive UI/UX Teardown of Data-Product Paywalls

**Status:** Paste-ready for a deep-research model. Concrete and specific. Names real products. Answers feed back into the monetization mega plan.

**Companion prompts (complementary, do not overlap):**
- Prompt 1 of 3 — Design Psychology of Paywalls and Locked Content (the *why it works on humans*)
- Prompt 2 of 3 — Pricing Strategy, Value Metrics, and Tier Construction (the *what to charge*)

This prompt is the *field guide*: walk the public surface of every important data, research, and benchmark product on the web, document exactly what they do, and extract the patterns worth copying and the patterns worth avoiding.

---

## How to use the answer

For each product, return a structured teardown using the schema in section 2. Treat this as forensic UX reporting: describe what is actually visible on the live site as of the answer date, not what the company claims in marketing. If a product has changed materially in the last 12 months, note the version. Include screenshots or detailed visual descriptions where helpful. Where you cannot access something (paywalled, login required, region-locked), say so explicitly rather than inventing.

---

## The brief

You are writing a competitive UI/UX teardown report on **paywall, lock, and pricing-page implementations across the data, research, and benchmark-product industry**. The audience is a product team building a SaaS-plus-SEO hybrid: a free-to-browse data site that converts a fraction of its visitors into paid subscribers via inline locks, modal paywalls, and a pricing page.

For each product, do not summarise marketing claims; document *what a visitor actually sees and clicks through*. Be specific about pixel-level details that other reports glaze over: button colours, lock-icon style, blur radius, modal anatomy, microcopy verbatim.

---

## The products to cover

Cover at least the following (add others where you find them especially instructive — e.g., niche data products in finance, real estate, jobs, or scientific research that are exemplary in either direction):

### Tier 1 — must cover, multi-page deep teardown each

1. **Statista** (statista.com) — the canonical data-paywall product. Inline locks on charts, "Premium statistic" labels, the methodology pages, the academic pricing tier, the notorious cancellation flow.
2. **Crunchbase** (crunchbase.com) — company-profile gating, the locked-profile-row pattern, Pro tier upsell on filters and exports.
3. **PitchBook** (pitchbook.com) — enterprise-tier paywall; teaser pages, lead-capture-as-paywall, the "request demo" wall.
4. **SimilarWeb** (similarweb.com) — the inline-blur-on-traffic-numbers pattern, the free-account-vs-paid gating, the country / industry coverage maps.
5. **Glassdoor** (glassdoor.com) — the give-to-get pattern (post a review to see reviews), the "free preview" salary ranges, the locked employer-data tiers.
6. **Levels.fyi** (levels.fyi) — the modern, designer-grade take on salary data; free vs Premium ($25 one-time and subscription tiers); the negotiation-coach upsell.
7. **Trading Economics** (tradingeconomics.com) — the data-everywhere, paywall-on-export pattern; API tier as the main paid product.
8. **Numbeo** (numbeo.com) — the user-contribution-as-currency pattern (contribute data to see data); cost-of-living comparison gating.

### Tier 2 — important, briefer teardown each

9. **Owler** (owler.com) — free-with-account gating, alerts as the value, Owler Pro / Max tiers.
10. **CB Insights** (cbinsights.com) — premium-research gating, the report-tease-then-paywall pattern.
11. **ZoomInfo** (zoominfo.com) — the "credit"-based usage pricing, the unfriendly UX as a feature for high-intent buyers.
12. **Apollo.io** (apollo.io) — credit-based gating on prospecting data, the multi-tier seat-plus-credits model.
13. **G2** (g2.com) — free-to-browse reviews, paid-for-vendors; the lock pattern on competitor analytics.
14. **Capterra / Software Advice / GetApp** — the lead-broker model where there is no consumer paywall; what does the page do instead?
15. **Owl Labs / state-of-remote-work-style annual reports** — the email-as-paywall pattern.
16. **WhatToBecome / industry-benchmark blogs** — pure SEO plays with no paywall; what they monetise through instead (ads, affiliate, lead-gen).

### Tier 3 — specialised, instructive in narrow ways

17. **The Information / Stratechery / Bloomberg / WSJ / FT / Economist** — news paywall variants (metered, hard wall, freemium, modal-first-visit). Note: these are *content*, not *data*, but their paywall mechanics are the most experimented-on in the industry.
18. **Bloomberg Terminal sales page** (bloomberg.com/professional) — the *anti-pricing-page*; how does it convert without showing price?
19. **Y Combinator's Work at a Startup / RFS pages** — free-to-public data products with no monetisation; instructive for what a *no-paywall* take looks like.
20. **Common Crawl / Our World in Data / data.gov** — non-commercial data products; useful as a contrast.
21. **Owl-eyed niche: Yardstik / Ramp benchmarks / Maxio benchmarks / OpenView SaaS benchmarks** — small specialised benchmark products that gate downloads behind email or paid account. The "report-as-magnet" pattern.
22. **Numbeo, Expatistan, Mercer cost-of-living** — three takes on the same data, three monetisation philosophies (community, freemium-with-ads, enterprise-paid).
23. **Built In / LinkedIn Salary / Comparably** — three more takes on salary data.
24. **Real-estate data sites**: Zillow (free with ads), Redfin (free, agent-fee monetisation), CoStar (enterprise paid). Three monetisation paths on similar data.
25. **Academic / scholarly**: JSTOR, Sci-Hub (the negative case), SSRN, arXiv. The free-vs-paid landscape in research.
26. **Bonus niches** worth investigating if time permits: Owler, Wappalyzer / BuiltWith, SEMrush / Ahrefs (the SEO-tools-as-data products), Tracxn, Dealroom, Beauhurst.

---

## The teardown schema

For each product covered, return a structured record with these fields (use the same field names for every product so the report is comparable):

### Identity
- **Product name and URL**
- **Category in one phrase** (e.g., "salary data", "company intelligence", "market research")
- **Primary monetisation model** (subscription / one-time / ads / lead-gen / hybrid)
- **Free-vs-paid split in one sentence** (what a logged-out visitor can do)

### Free-tier behaviour
- What is visible **without any account** (cold visitor)
- What is visible **with a free account** (give email)
- What is gated for **paid only**
- **Quota or cap** structure on the free tier (if any), with exact numbers
- Quote the **exact prompt copy** that appears when the free tier is exhausted

### Inline lock implementation
- **Where** are inline locks placed on a typical data page (above the fold, mid-page, end-of-table, on chart, on a specific column)?
- **Visual primitive**: blur / redaction / ghost row / lock icon / "Premium" pill / asterisk-with-footnote / other
- **Affordance**: does the lock respond to hover, click, scroll? Does it open a modal, navigate to /pricing, or scroll-anchor?
- **Quote the exact lock label** verbatim (e.g., "Premium statistic", "Unlock with Pro", "Upgrade to view")
- **Visual register**: aggressive (red, urgent), neutral (grey, calm), or premium (gold, badge)
- **Density**: how many locks per page on a typical data page?

### Paywall modal anatomy
- **Trigger**: what action opens the modal? (clicking lock, exhausting quota, attempting an action)
- **Modal size and position**: full-screen, centered, side-drawer, sticky bar
- **Modal headline** verbatim
- **Value-prop bullets** verbatim
- **Tier presentation in the modal**: does the modal show prices, or does it deflect to /pricing?
- **CTAs**: button copy, primary vs secondary, colour, count
- **Trust elements in the modal**: logos, money-back, "cancel anytime", testimonials, security badges
- **Dismissal**: how easy is it to close? Is there a "no thanks" link, an X, an escape key, or is it modal-trap?

### Pricing page
- **URL** of the pricing page
- **Layout**: 2-tier / 3-tier / 4-tier / comparison-table / configurator / "contact sales"
- **Tier names and prices** verbatim, including annual/monthly toggle behaviour
- **Most-prominent tier** and how it is highlighted (badge, colour, scale)
- **Feature comparison density** (how many rows in the comparison table; how long does the page scroll?)
- **FAQ section**: how many questions, which questions
- **Trust block**: logos, testimonials, press, security
- **Risk reversal**: trial offered? money-back? cancel-anytime language?
- **PPP / geo pricing**: any evidence of localized pricing? Test by VPN if possible.
- **Annual discount**: percentage off vs monthly
- **CTA copy** on each tier
- **Below-the-fold content**: case studies, blog links, footer

### Onboarding and post-payment
- What happens **immediately after** payment (where the user lands, what they see)?
- **Aha-moment design**: is there a designed first-success experience or does it dump the user back on the landing page?
- **Welcome email** flow (subject lines, cadence, content) if observable

### Cancellation flow
- **How many clicks** from logged-in account to cancel-confirmed?
- **Friction injected**: hold-back offer, pause option, downgrade option, "are you sure" steps, required reason
- **Quote the most aggressive copy** in the cancellation flow verbatim
- **Confirmation experience** (email, on-screen, etc.)

### What they do well
- Three things this product does that are worth copying, with one-sentence justification each.

### What they do badly (or that we should avoid)
- Three things this product does that backfire, with one-sentence justification each.

### Overall verdict
- One paragraph: what is the **defining design choice** of this product's paywall system, and what *type* of buyer is it optimised for?

---

## Cross-cutting analysis (after the per-product teardowns)

After completing the individual records, write a **cross-cutting analysis** with the following sections.

### A. Paywall pattern taxonomy

Catalogue the distinct paywall patterns observed across all products, with examples of which products use each. Examples:

- **Metered paywall**: free count of items per period (NYT, Statista downloads, Apollo credits)
- **Hard wall**: nothing visible without paid account (PitchBook, CoStar)
- **Freemium**: free tier with feature-limited access, premium unlocks features (Crunchbase, SimilarWeb)
- **Inline-lock + free-browse**: page is visible with locks on specific data points (Statista, Levels.fyi)
- **Give-to-get / community**: contribute to access (Numbeo, Glassdoor)
- **Email-as-paywall**: free to read after email submission (industry reports, magnets)
- **Demo-wall**: schedule a call to access (PitchBook enterprise, ZoomInfo)
- **Ads-only**: no paywall, monetise through ads or affiliate (Zillow, Built In)
- **Lead-broker**: free for users, vendors pay (Capterra, G2)

For each pattern, document **what category of product it suits**, **what audience it suits**, and **what monetisation outcome it produces** (volume vs ARPU vs ARR mix).

### B. Best practices observed across products

Aggregate the "what they do well" sections into a ranked list of the top 15–20 design moves observed across multiple products, in order of how often they appear and how much evidence there is that they work.

### C. Worst practices observed across products

Aggregate the "what they do badly" sections into a ranked anti-pattern catalogue, with the products where each is observed.

### D. Visual-design vocabulary

Document the visual conventions that have emerged as the de-facto standard for this product category. Cover:

- **Lock icon vocabulary**: which products use padlock, key, eye-slash, gem, crown, "Pro" badge, etc.
- **Blur radius and opacity** (estimate from inspection)
- **Pill / badge styling** for "Premium", "Pro", "Enterprise"
- **Colour palette** for paid-vs-free signalling (gold, blue, purple, etc.)
- **Modal layout conventions**: where the close button sits, where the CTA sits, where the price sits
- **Pricing-page conventions**: card-based vs table-based, recommended-tier highlight style

### E. Microcopy lexicon

Build a dictionary of the **verbatim microcopy** used across the products for each role:

- Lock label ("Premium statistic", "Unlock", "Upgrade to view", ...)
- Modal headline ("Get unlimited access", "Continue with Premium", ...)
- Tier CTA ("Get Started", "Try Free", "Upgrade Now", "Continue with Pro", ...)
- No-thanks dismissal ("Maybe later", "Not now", "Continue with free", ...)
- Free-tier-cap message
- Trust statements ("Cancel anytime", "Trusted by X teams")
- Annual savings copy
- Money-back guarantee copy

For each role, identify which copy is most-used and which is most-distinctive.

### F. Onboarding and aha-moment design

Compare how products handle the first 60 seconds after payment. Which products engineer an aha-moment, and how? Which dump the user into a generic dashboard?

### G. The cancellation flow Hall of Shame and Hall of Fame

Rank the cancellation flows observed from most-respectful to most-dark-pattern. Highlight the products that have moved to one-click cancel and the conversion / churn implications they have publicly disclosed.

### H. Patterns specifically for SaaS-plus-SEO hybrids

The product type in scope is **SEO-driven traffic** (search engine landing on a data page) **monetised via a paywall**. Document the products in the survey that fit this hybrid model exactly (Statista, Crunchbase, Levels.fyi, Numbeo, Glassdoor are the clearest examples) and extract the patterns that distinguish them from pure-funnel SaaS or pure-content products.

Specifically:
- How do they balance **content visibility for SEO** with **content gating for revenue**? Cite the dominant patterns.
- How do they handle **the first-time SEO visitor** vs the **returning logged-in user**? Different paywall behaviour for each?
- How do they handle **the deep-link landing** problem (user arrives on page 7,453 of the product, not the homepage)? Onboarding, persistent header CTAs, etc.

### I. The premium-feeling pricing page

Identify the 3–5 pricing pages that read as the most premium / serious / professional vs the most aggressive / consumer / pushy, and document the specific design choices that produce that impression.

### J. The 10 highest-leverage patterns worth copying

Close with a ranked top-10 list of the **specific design moves** observed in this survey that a new entrant in the data-product space should copy, in order of expected impact-to-cost ratio.

### K. The 10 highest-risk anti-patterns to avoid

Closing twin list: ranked top-10 of the **specific design moves** that have either been measured to backfire or are widely-condemned in the literature, with examples of which products do them.

---

## Format

- For each product, use the schema in section 2 verbatim. Same field names.
- After all per-product records, deliver sections A through K.
- Cite as you go (URLs, screenshot references, dates of observation).
- Where you have access to a product behind a paywall (paid account), say so and report from that vantage. Where you do not, report from the cold-visitor view and say so.
- Date every observation. The web changes; the report must be falsifiable.

---

## What NOT to do

- Do not summarise marketing copy. Report what is actually rendered to the visitor.
- Do not skip products because they are obvious (the *exact* implementation details are what we need, not the high-level concept).
- Do not propose strategy for our product. Document what others do; the synthesis is downstream.
- Do not paywall-shame products that have legitimate enterprise reasons for their friction; note the reason and let the reader judge.
- Do not avoid quoting microcopy verbatim because of length; the microcopy *is* the research.
