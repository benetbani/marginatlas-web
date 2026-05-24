# Research Prompt 2 of 3 — Pricing Strategy, Value Metrics, and Tier Construction for Data and Research Products

**Status:** Paste-ready for a deep-research model. Theory-first. No company context. Answers feed back into the monetization mega plan.

**Companion prompts (complementary, do not overlap):**
- Prompt 1 of 3 — Design Psychology of Paywalls and Locked Content (the *how it feels*)
- Prompt 3 of 3 — Competitive UI/UX Teardown of Data-Product Paywalls (the *who-does-what* in the wild)

This prompt covers the *what to charge for, how much, and how to slice it*: pricing mechanics, value-metric selection, tier construction, geographic and segment pricing, and the economics of free.

---

## How to use the answer

Return one long, structured report. Where the literature is settled, summarise. Where it is contested, surface the disagreement and the experimental designs behind each side. Where you make a claim with no source, mark it `[author opinion]`. Avoid "it depends" without saying *on what specifically*.

---

## The brief

You are writing a 6,000–10,000 word research note on **pricing strategy for self-serve, online-distributed data and research products** sold primarily to prosumer, small-business, and small-team buyers (single-decision buyers paying with a personal or company card, no procurement involvement). The audience is a founder who understands cost structure and unit economics and is now choosing the *shape* of a multi-tier subscription system.

Stay theory-first. Do not name specific competitor companies in your tier examples (that is Prompt 3). Do not describe paywall visual design or psychology (that is Prompt 1). Do not recommend specific dollar amounts for an unknown product; instead, give frameworks for *how to choose* the amount given known inputs.

Treat the pricing decision as a system of coupled levers — value metric, price point, tier count, tier gates, free-tier generosity, billing period, currency, refund policy — that interact, and where changing one without rebalancing the others tends to destroy revenue.

---

## Required sections

### 1. Value-metric selection: the foundational choice

The single most consequential pricing decision is **what to charge for** — the unit of value that scales with the customer.

- Define the value-metric framework cleanly. Cite the standard sources (Kyle Poyar, Madhavan Ramanujam, Patrick Campbell, OpenView surveys).
- For data and research products, enumerate the candidate value metrics and the conditions under which each wins:
  - Per-seat / per-user
  - Per-query / per-API-call / usage
  - Per-record / per-row downloaded
  - Per-segment-unlocked (e.g., per industry, per region, per ticker)
  - Per-feature-tier (Free / Basic / Premium)
  - Per-time (subscription with no usage cap)
  - Hybrid (subscription + overage)
- The **alignment principle**: the value metric should grow as the customer extracts more value, but not so steeply that engaged customers feel penalised. How is this principle operationalised in practice?
- The **"too cheap to bother counting"** trap: when does a per-query meter create more anxiety than revenue, even at a generous quota?
- When is **flat-rate "all you can eat"** the right answer despite the textbook argument for usage-based?
- The **segment-unlock metric** specifically: charge per industry, per geography, per dataset. Is this used in the data-product world and where does it fit best? Discuss salary-data products, market-research products, and benchmarking products in particular.

### 2. The economics of free: how much to give away

The free tier is not charity. It is acquisition spend that takes the form of unsold inventory.

- Quantify the **tradeoffs of free-tier generosity**:
  - More free content → more organic acquisition (SEO traffic, virality, link-bait) and more conversion-pool growth
  - More free content → more cannibalisation of paid tiers
- What does the literature show about the **optimal generosity ratio**? Is there a known sweet spot expressed as percent-of-paid-content-visible, or as feature-count-ratio?
- The **freemium-vs-free-trial-vs-reverse-trial** decision. When does each win? What does the academic and practitioner evidence show across categories?
- The **forever-free** tier as a moat: does giving away enough to never need to pay create durable brand loyalty that compounds, or does it train users to expect free forever? Cite both sides.
- For **SEO-driven products** specifically: how much content must be visible to search-engine crawlers (and therefore to humans) for the page to rank, and how does that constraint dominate the cannibalisation worry?
- The **"valuable free, premium paid"** ratio: is there a heuristic like 80/20 where the most-valuable 20% is gated and the long-tail 80% is free, or its inverse (long-tail premium, mainstream free)?
- For data products with **percentile information** (showing distribution): is showing median + edges (p10, p50, p90) for free and locking quartiles (p25, p75) a coherent split, or does it leave the free tier feeling neither generous nor restrained?

### 3. Tier construction: number and shape

- Why **three tiers** has become the default. Cite the experimental and survey work. Where does 2-tier or 4-tier beat 3-tier?
- The **good-better-best framework**: when does it produce the highest revenue per visitor vs cheap-only or premium-only?
- The **decoy effect** in pricing pages: empirical record of when the expensive third tier actually pulls customers up vs when it just confuses them. Conditions for success.
- **Naming tiers**: Free / Basic / Premium vs Starter / Pro / Business vs custom playful names. What does the literature show about clarity and conversion?
- **Tier gating axes** — what should differ between tiers:
  - Feature presence (binary)
  - Quantity limits (numeric)
  - Quality tier (e.g., basic data vs enriched data)
  - Support level
  - Update frequency (free = monthly, paid = daily)
  - Format access (free = web view, paid = export)
  - Concurrency / seats
- The **export-as-gate** pattern: putting the data behind free view, the *download* behind paid. Effects on conversion and on SEO. When does this work and when does it feel cheap?
- The **API-as-top-tier** pattern: free and paid web access, API access as a top-tier-only feature. Pros, cons, and when it makes sense.
- The **"unlocks everywhere" tier vs the "specific datasets" tier**: is breadth or depth a stronger upgrade pull?

### 4. Price-point selection

- How to choose specific dollar amounts. The framework choices:
  - Cost-plus (almost always wrong for software)
  - Competitor-based (anchored, often too low)
  - Value-based (correct but hard to estimate)
  - Willingness-to-pay survey methods: Van Westendorp, Gabor-Granger, conjoint analysis. Describe each, when each is appropriate, and their limitations.
- **Price psychology at common breakpoints**: $9 vs $10, $19 vs $20, $29/$39/$49, $99 vs $100. What does the empirical record show for prosumer subscription products?
- **Charm pricing** ($X.99) vs **round pricing** ($X.00): when does each win, and is the answer different for serious / professional audiences vs consumer audiences?
- **Two-tier price ratios**: is 2.0x (e.g., $37 vs $77) optimal, or 2.5x, or 3.0x? Is there a known optimum for the *gap* between Basic and Premium that maximises mix into Premium without losing Basic conversions?
- **Annual vs monthly pricing**:
  - Standard discount range and the literature behind it (typically 15-25%)
  - What does the discount do to LTV, churn, and acquisition cost?
  - Annual-default vs monthly-default on the pricing page: empirical effect on average plan length and revenue
  - When does *only-annual* make sense, and when does it kill conversion?
- **Lifetime deals**: when do they help (early-stage acquisition burst) and when do they destroy a business (cap on future revenue, support cost forever)?

### 5. Refund, trial, and risk-reversal policies

- The **free trial vs money-back vs neither** decision. Empirical evidence by category.
- For **prosumer and small-business** buyers specifically, is a free trial expected or is "cancel anytime" sufficient?
- **Trial length**: 7 / 14 / 30 days. What does the data show? Is the optimum a function of time-to-value or a fixed psychological number?
- The **reverse trial** (paid features unlocked for new users, then downgrades to free): conversion lift and the categories where it works.
- **Money-back guarantees**: 7-day vs 14-day vs 30-day vs 60-day. The Zappos lesson — does a longer guarantee actually reduce refund requests by reducing buying urgency, or does it raise them?
- **No-refund policies** in serious / niche markets: does explicit "no refunds, you can cancel future renewals" actually convert worse, or does it select for serious buyers and improve retention?
- **Cancellation friction**: where is the line between *low-friction cancel* (Statista-style multi-step is widely hated) and *too-low friction* (one-click cancel can hurt by enabling impulse churn)?

### 6. Geographic and PPP pricing

- The case for and against **purchasing-power-parity (PPP)** pricing on globally-distributed digital goods. Cite the literature.
- **Conversion impact** of localized pricing in lower-income markets. The order-of-magnitude lifts that have been documented in published cases.
- **Arbitrage and VPN abuse**: how do products defend against it without alienating legitimate users? IP-based, card-issuer-based, and self-declared mechanisms. Cost / benefit.
- The **currency-display question**: show prices in user's local currency, in USD, or both? What does the conversion data show?
- The **"one global price" simplicity** argument: when is simplicity worth more than localized optimisation?
- For data and research products specifically (where the *use case* may be locally-priced — a Mexican user benchmarking a Mexican business — but the *cost to serve* is global): how should this be priced? Per-region pricing, per-region content, or a single global tier?

### 7. Segment pricing and B2B vs prosumer split

- **Personal vs team vs business** pricing pages: when to split and when to keep one pricing page.
- **Seat-based add-ons** on otherwise flat-rate plans.
- The **"contact sales" wall** for an enterprise tier: when does its presence add revenue (anchoring) and when does it cost revenue (alienating self-serve buyers)? The honest answer including the trust impact.
- **Education, non-profit, government, and student discounts**: does the lift in goodwill and acquisition justify the revenue forgone? What does the empirical record show?

### 8. Upgrade, downgrade, and expansion dynamics

- The **natural expansion-revenue** sources on a tiered subscription product. What does the SaaS benchmark data show for negative-net-churn drivers in prosumer products specifically (vs enterprise)?
- **Mid-cycle upgrade prompts**: when are they welcome, when are they annoying? What is the empirical effect on lifetime value and churn?
- **Downgrade flows**: do you let people downgrade self-serve or require contact? Effect on retention and trust.
- **Pause** as an alternative to cancel: the win-back data.

### 9. Price changes over time

- **Grandfathering existing customers** when prices rise: full lifetime grandfather vs 12-month grace vs none. The literature on customer-equity damage from each.
- **Price increases on new customers only**: announcement strategy, the effect on a pre-announcement signup burst.
- **Discount sales and seasonal pricing**: when does a Black Friday discount on a serious product *help* (acquisition burst) and when does it *destroy positioning* (trains the market that the price is fake)?
- The **"never discount" school**: empirical case for and against.

### 10. The metering / quota system as a designed object

- **Soft caps** ("you have used 8 of your 10 free queries this month") vs **hard caps** ("upgrade to continue"). Conversion and retention effects.
- The **reset cadence**: rolling-30-day vs calendar-month vs no-reset (lifetime quota). User perception of fairness and the conversion implications.
- The **overage model**: when should hitting a quota trigger a paid upgrade prompt vs charge-per-overage vs throttle-and-wait?
- The **counter design** problem: showing the user how much they have left can be motivational (gamification) or anxiety-inducing (depletion aversion). When does each effect dominate?

### 11. Anti-patterns and dark patterns to avoid

For each, document the short-term lift and long-term cost:

- Drip pricing (showing low price, adding fees at checkout)
- Hidden auto-renew clauses
- Surprise mid-cycle price hike
- Tier confusion (overlapping or vague feature splits)
- Forced annual commitment with no monthly fallback
- Required credit card for "free" trial
- Cancellation-by-phone-only or cancellation-by-email-only
- Renewal at higher price than signup
- "Pro" tier features that should obviously be in base
- Geo-detection that prices a low-income-country user at high-income rates
- "Was $X, now $Y" anchoring where $X was never charged

### 12. Pricing-page layout and information architecture

(This sits at the boundary with Prompt 1; cover the pricing-page-specific items here, leave the modal and inline-lock visual design to Prompt 1.)

- **Comparison table** vs **three-card layout** vs **interactive configurator**: empirical conversion data.
- **Feature row ordering**: most-differentiating-first vs core-features-first. What does the literature show?
- **Highlighting the recommended tier**: badge text, colour, scale. When does it move customers up and when does it backfire?
- **FAQ-on-pricing-page**: which questions actually reduce abandonment, and which are filler?
- **Live chat / contact** widget on the pricing page: conversion impact vs distraction.

### 13. Frameworks for pricing experimentation

- **A/B testing pricing**: the ethical and legal limits, and the statistical pitfalls (sample size for revenue-per-visitor lift detection is enormous).
- **Cohort-based** vs **traffic-split** vs **time-based** pricing tests. Which is statistically honest?
- **Willingness-to-pay survey methods** revisited: how to actually run a Van Westendorp survey on existing traffic and avoid the common errors.
- **Conjoint analysis** for tier-feature optimisation. Worth the effort or overkill for a small product?

### 14. The economics of churn and the LTV trap

- The **LTV / CAC ratio** rule (3:1 is the folklore, but the empirical distribution is far wider). What does the actual prosumer-SaaS data show?
- The **church-of-LTV** critique: when is LTV a misleading optimisation target?
- **Voluntary** vs **involuntary** churn (failed payments, expired cards). How much revenue is lost to involuntary churn and what is the recovery playbook (dunning, card-updater, retry cadence)?
- The **first-month churn cliff**: typical magnitude and the design interventions that flatten it.

### 15. Open empirical questions

End with a short list of pricing questions that **deserve to be tested** rather than answered from the literature, with proposed test designs.

---

## Format

- Use the section headings above verbatim.
- Cite as you go. Bibliography at the end.
- Mark `[finding]` / `[recommendation]` / `[speculation]`.
- Close with a one-page **pricing-system decision checklist**: the 10–15 questions a founder must answer in order to lock a coherent pricing system, with the order in which the questions should be answered (e.g., value metric → free generosity → tier count → price points → billing periods → refund policy → geo).

---

## What NOT to do

- Do not propose specific dollar amounts for an unknown product. Give the *framework* and the *typical ranges* for the category.
- Do not describe paywall visual design or modal UX (Prompt 1 covers this).
- Do not catalogue specific competitor pricing pages (Prompt 3 covers this).
- Do not give a SaaS-pricing-101 introduction. Assume the reader has read the standard practitioner books and wants depth.
