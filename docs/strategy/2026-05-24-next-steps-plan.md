# What to do next — opinionated 4-week plan

> Not a menu of options. One specific recommendation, sequenced, with
> a stated thesis. Alternatives at the end if you disagree.

---

## Where we are

The product is now substantially deeper than it was three weeks ago:

- **Data quality is defensible.** Currency bug patched (Mexico 17×
  overstatement fixed). Plausibility suppression catches the worst
  scale anomalies. Seven prebuild gates. Vacuum + ANALYZE done.
- **Editorial layer is real.** Twenty cities have hand-written
  character pages. Sixteen industries have cost-stack baselines,
  failure-mode lists, operating-units translations. The
  "IfYouOpenedToday" composition turns benchmark data into calendar
  dates.
- **Architecture is right-sized.** Vercel Pro + Supabase Pro, region
  pinned, top 20 cells pre-rendered at build, CorrectionForm lazy-
  loaded. Site loads in the realistic range for what it is.
- **Brand polish landed.** Atlas pattern site-wide. Dark footer.
  Sectional rhythm. Calm editorial typography. No SaaS-flavored cards
  or growth-hack chrome.

What the product still does NOT have:

- **Anything monetizable.** Pricing page exists but no actual gates.
  The data deepening is built but nothing is locked. The Pro
  subscription button doesn't go anywhere meaningful. No way for a
  visitor to give us money.
- **Real conversion path.** Visitors land, read, leave. No email
  capture except the slim footer bar. No upgrade prompt anywhere.
  No nurture sequence. No retargeting hook.
- **Compare and Calculator.** Both queued for redesign weeks ago.
  Both still bare. These are tools that materially change "look at
  data" into "use data."
- **Sub-industry variants.** Picker is built; data_ready=false for
  all 33 variants. None render.

---

## The thesis

**Now's the time to monetize.**

Reasoning in three points:

1. **The free product is good enough.** Cost stack, setup costs,
   tangible units, failure modes, city character, decile distribution,
   calendar dates — every visitor sees substantially more than they
   would on a competitor. The reasons to give us money are concrete
   (city-level cost data, full distribution, time series, exports,
   API). The reasons to stay free are equally clear (the basic
   benchmark answer to their search query).
2. **Every week of unmonetized launch is a missed signal.** We have
   no data on what people would pay for, what conversion rate looks
   like, what the right price point actually is. Until we charge,
   every product decision is a guess.
3. **Bigger features wait on monetization revenue.** Long-form
   articles, voice narration, public-company peer data, API tier —
   these are the Pro-tier flagship features per the research. Each
   takes weeks of work and costs real money to maintain. None of
   them should ship before the revenue motion exists.

Trade-off acknowledged: monetizing too early loses some SEO traffic
and brand goodwill. The mitigation is the gating policy from the May
24 monetization research — **gate resolution, not topic.** Free
visitors still get a useful answer to their search query. Paid users
get the deeper resolution. That's how Trading Economics, Crunchbase,
and Levels.fyi run it, and that's what we follow.

---

## The 4-week plan

Sprint blocks, not calendar weeks. Each "week" is a focused 4-7 day
block. The order matters; the earlier ones unblock the later ones.

### Week 1 — Pro tier infrastructure (the plumbing)

The goal: a paying customer can sign up, pay $39, and unlock the gated
data. No fancy features, just the working chain.

- **Stripe integration.** Subscription product at $39/mo + $390/yr.
  Customer Portal for self-service cancellation. Webhook handlers for
  signup / cancel / failed payment.
- **Auth + tier read.** Wire the existing Supabase Auth to a
  `tier` column on the user. Server-side helper: `getViewerTier()`
  returns `"free" | "pro" | "professional"`.
- **The first three gates.** Three render-time treatments:
  - Decile distribution chart: free shows median bar only; Pro shows
    the full 10-25-50-75-90 spread.
  - Cost stack: free shows the top 3 lines (rent + payroll + COGS);
    Pro shows all 8 lines plus the operating profit number.
  - Setup costs: free shows the total estimate only; Pro shows the
    itemized box-1 + box-2 breakdown.
  - All three implemented as `if (viewer === "free")` branches in the
    existing components. No new components.
- **The gate UI.** A small inline "Pro" pill + a blurred-content
  treatment (`backdrop-filter: blur(6px)` + a "Show me with Pro" CTA
  overlay). Editorial-toned, not SaaS-spammy. Follows the May 24
  research recommendations.
- **Pricing page updates.** Replace placeholder $19 Pro with $39.
  Update feature matrix to reflect the actual gates. Trial: 7 days,
  card required.
- **Acceptance criteria for Week 1:** I can pay $39 on the live site,
  receive a confirmation email, return to any cell page, and see
  full decile + cost stack + setup-cost detail that a non-paying
  visitor cannot see.

Effort estimate: 5-6 focused days. Half is the Stripe boilerplate;
half is the gate logic and visual treatment.

### Week 2 — Calculator + Compare redesigns (the SaaS-tools moment)

Both have been queued since the v32 audit; both are tools that
materially upgrade Atlas from "reference" to "decision-support."

- **Calculator redesign.** Per the audit doc:
  - Hero: 2-column layout, left = title + tagline, right = real-time
    compact form (country / industry / your revenue).
  - Result panel: percentile placement vs the cell's distribution,
    full decile readout (Pro), bar chart with user's position marked.
  - Auto-generated editorial framing of the result (2-3 sentences
    based on percentile).
  - CTA: "View the full cell page →" + 4-6 related calculators
    pre-filled with nearby cells.
- **Compare redesign.** Per the audit doc:
  - Default state: 2 cells pre-loaded (NYC restaurants vs London
    restaurants). User replaces either, or adds up to 4 (Pro).
  - Dense comparison table: revenue, payroll, owner take, employees,
    sample size, distribution percentiles.
  - Quick swaps row at the bottom: 4 suggested comparisons.
  - Save / share: persistent URL encoding the comparison.

Both are 100% client-side after data load. Free users see 1 saved
comparison; Pro users get unlimited.

Acceptance criteria: each tool feels like a real product, not a form.
Founder + 2-3 trusted reviewers say "I'd use this."

Effort estimate: 6-8 days combined.

### Week 3 — Conversion engine (the funnel)

The point is to convert free traffic into either email subscribers
or paying customers. Currently we capture neither.

- **Email capture (above-fold + contextual).** Add a small "Get the
  weekly small-business benchmarks digest" prompt with three
  placements:
  - Inline on cell pages, after the failure-modes section (visitor
    has read the page, ready for the soft ask).
  - In the AskWidget slot on the calculator and compare tools.
  - Existing footer bar stays.
- **Email nurture sequence.** A 6-email sequence (week 1-6) for new
  subscribers:
  - Week 1: "Welcome + here are the three cells you searched."
  - Week 2: A surprising cross-country comparison (e.g., why bakery
    margins in Tokyo are half what they are in Paris — we already
    have this in the blog rail).
  - Week 3: Methodology — how the numbers actually get to the page.
  - Week 4: "Did you see this?" — a hand-picked sub-industry / city
    comparison.
  - Week 5: Pro tier soft pitch — "if you're looking up cells
    weekly, here's what unlocking the resolution costs."
  - Week 6: Last-mile pitch + 30-day-money-back offer.
  - Sent from Klaviyo / Mailchimp / ConvertKit; doesn't matter which.
- **Contextual upgrade prompts.** Per the May 24 monetization
  research: "you've viewed 5 cells this week — Pro unlocks the
  decile detail on all of them" prompt, only on visitors who hit
  N cells. Stored client-side in localStorage; no auth required.
  This converts 3-5× better than blind upgrade CTAs.
- **The "Today's Pro preview"** rotating teaser. One paid feature
  unblurred per cell page, different cells show different teasers.
  Editorial framing: "Today's Pro preview." Trains the visual
  vocabulary; trains the user that Pro has more.

Acceptance criteria: email list growing measurably (target 100+
subscribers in first 2 weeks of the prompt being live). At least
one organic Pro signup (i.e. not founder testing).

Effort estimate: 4-5 days.

### Week 4 — Sub-industry depth + first Pro-tier flagship feature

By now Pro tier exists and works. Now make it materially better than
free in ways that are obviously worth $39.

- **Sub-industry data for 3 of the highest-leverage splits.** Pick
  three from the seed: barbershops m/w/unisex, auto dealers
  used/new/luxury, lawyers corporate/family/immigration. For each,
  research the cost-stack data per top 5 countries; flip data_ready
  to true; surface the variant picker. Each variant becomes its own
  URL pattern.
- **Locked time-series tail (per the May research).** Years 2022-2024
  visible to free; 2014-2021 visible to Pro. Cell pages currently
  don't have time series at all — Pro tier needs to build it from
  the snapshot data (which has historical points).
- **Pro-only export.** Single button: "Download this cell as CSV."
  Free shows the button + "Pro feature." Pro downloads the full
  cost stack + setup costs + distribution + time series as CSV.

Acceptance criteria: a paying customer can do at least 3 things they
couldn't do for free. The "why $39" answer becomes self-evident from
the product.

Effort estimate: 5-7 days. The CSV export is small; the time-series
build is the bigger lift; sub-industry data is straightforward
research.

---

## Recommended sprint sequence

If you say "go," I do:

| Day | Track | Output |
|---|---|---|
| 1-2 | Stripe + auth | Subscription flow live in staging |
| 3-4 | First three gates | Decile + cost stack + setup costs gated |
| 5 | Pricing page update | $39 + real feature matrix |
| 6 | Trial signup flow | Test card → 7-day trial → invoice |
| 7-9 | Calculator redesign | Real-time results panel + percentile chart |
| 10-12 | Compare redesign | 2-cell default + dense table + share URL |
| 13-14 | Email capture + first 2 nurture emails | Subscribers landing in mailing list |
| 15-16 | Contextual upgrade prompts | "You've viewed N cells" prompt |
| 17 | Sub-industry data for 3 splits | Variant pickers showing data |
| 18-19 | Time-series tail (Pro-gated) | Multi-year cell-page chart |
| 20-21 | CSV export (Pro) | Single-button download |
| 22+ | Measure, iterate, decide next | First conversion data in hand |

That's ~22 working days = ~4-6 calendar weeks depending on pace.

---

## What I'd explicitly NOT do in this sprint

Things that are tempting but distract from the thesis:

- **Industry baseline extension beyond 16.** We have enough for
  proof of value. Adding 5 more industries before monetization is in
  place doesn't move conversion at all.
- **More city character entries.** Same logic. 20 cities is enough
  to demonstrate the editorial layer; the next 10 cities don't
  unblock revenue.
- **Voice narration / long-form articles / public-peer companies.**
  These are Tier-3 ambitious bets from the May 24 research. They
  cost weeks and money to maintain. They should ship AFTER Pro tier
  is generating revenue that can fund them.
- **Image import for cities.** Built; staging-ready. Activating it
  is a hand-curation effort that benefits brand polish but doesn't
  move conversion. Defer to post-monetization.
- **The "what-if sliders" idea** from Tier 1. Cool feature; doesn't
  unblock revenue. Could be a Pro feature later.
- **More performance optimization** beyond what's already shipped.
  We're past the threshold of "noticeably slow." Further work has
  diminishing returns until traffic grows materially.
- **Pricing experimentation.** Set $39, commit, run for 60-90 days,
  then look at conversion data. Iterating prices before there's
  signal is theater.

---

## Open questions for the founder before Day 1

If any of these answers are "I don't know yet," that's fine — but
they need answers by Day 1 of the sprint.

1. **Pricing commitment.** $39/mo as base. Annual $390 (~2 months
   free)? Or $419 (10% off)? I'll default to $390 if no answer.
2. **Trial mechanic.** 7-day with card required (higher conversion
   to paid, lower trial start rate) or 14-day no card (higher trial
   starts, lower conversion to paid)? Default: 7-day card required.
3. **Stripe account.** Do you already have one for Tesseract
   Research? If yes, I'll wire that. If no, set one up first
   (15 minutes); I'll do the rest.
4. **Email platform.** Klaviyo, ConvertKit, Loops, Beehiiv, Mailchimp,
   Substack? I'll default to ConvertKit (good developer API, fair
   pricing, won't fight us on editorial tone). Tell me if you
   already have a preference.
5. **Money-back guarantee.** Per the research, 30-day money-back
   beats 7-day trial for buyer confidence in editorial brands. Add
   a 30-day money-back at the same time as the 7-day trial? My
   recommendation: yes.
6. **Gate aggressiveness.** Free tier shows decile median (one
   number) or median + adjacent bars (three numbers)? Default: just
   the median bar so the Pro unlock has obvious value. If you want
   to be more generous, default to top 3 + bottom 3 visible and
   middle 4 gated.
7. **Sub-industry approval.** When research for a (variant × country)
   completes, do you want to review each before data_ready flips on,
   or trust the methodology and ship?

---

## What this plan optimizes for

The goal: by the end of the 4-6 weeks, you have:

1. **Real revenue trickling in.** Even 10 paid subscribers = $390/mo
   gross, which validates the model and pays for Vercel + Supabase
   + Stripe with margin.
2. **An email list.** 200-500 subscribers minimum within 30 days of
   the capture going live. That's a list you can re-monetize for
   years.
3. **Conversion data.** Real numbers on what fraction of free
   visitors hit the upgrade prompt, what fraction click, what
   fraction convert. Every subsequent product decision becomes
   data-driven instead of guessed.
4. **Two genuinely useful tools.** Calculator and Compare both
   actually work as products. They become the social-share / SEO
   anchor for the "I'd use this" reaction.
5. **A monetized data product.** Not a free directory. A genuine
   buyer's tool with a paid resolution upgrade.

This is the inflection point. The next 4-6 weeks decide whether
Margin Atlas is a website project or a business.

---

## Alternative tracks (if you disagree with the thesis)

If you don't want to monetize yet, the three most defensible
alternative tracks:

### Alternative A — Content + SEO foundation

Spend the 4 weeks deepening the SEO and content moat. Long-form
articles per industry, sub-industry variant data acquisition for
all 33 variants, city character extension to 50 cities. Argument:
the bigger the free moat, the better the future Pro conversion.
Risk: you spend 4 weeks deepening and still have no monetization
signal at the end.

### Alternative B — Customer development

Actually talk to 20-30 small-business owners. Send them screenshots
of cell pages, ask what would make them pay. Use their answers to
pick the right Pro features. Argument: monetizing without knowing
what people want = building the wrong thing. Risk: takes 4 weeks
and produces only research, no shipped product.

### Alternative C — One ambitious flagship

Pick one Tier-3 idea from the May 24 research (Atlas Index, voice
narration, public-peer companies) and ship it as the defining
differentiator. Argument: the SEO + brand bet trumps the
monetization bet at this stage. Risk: you spend 4 weeks on one
feature that may or may not move the needle.

My ranking: **monetization track > alternative B > alternative A >
alternative C**. The reasoning is the same in all four — at this
point, the bottleneck is not "we don't have enough data" or "we
haven't talked to enough people"; it's "we have no economic feedback
loop." Monetization is what creates that loop.

---

## What I need from you to start

Just two things:

1. **A "yes" on the monetization thesis** (or a counter — pick an
   alternative track and tell me which).
2. **Answers to the 7 open questions above** (or "use your defaults"
   for any of them).

The moment those land, Day 1 of the sprint starts. Stripe wiring is
the first thing I do.
