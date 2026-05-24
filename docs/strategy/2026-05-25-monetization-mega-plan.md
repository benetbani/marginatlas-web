# Margin Atlas — monetization MEGA plan (v33)

> Successor to the v32 master plan. Doubled depth. Every section now has
> open research-question placeholders that the three external research
> prompts (saved alongside this file) will fill in over the next 1-2
> weeks. Stripe wiring is deferred per founder. Email defaults to a
> Tesseract Research sender for v1.
>
> Length warning: this is long on purpose. The earlier plan moved too
> fast on UX and pricing decisions that need real research backing.
> This version is structured so research findings drop into named
> slots rather than retrofitting a half-built plan.

---

## Table of contents

- Part 0 — How to read this document
- Part 1 — Strategic context (what we know, what we don't)
- Part 2 — Monetization research (visible-lock pattern)
- Part 3 — UX psychology of paywalls
- Part 4 — Pricing + tier construction
- Part 5 — Custom icons + visual assets circle-back
- Part 6 — Implementation phases (A through M)
- Part 7 — Site-wide quality sweeps
- Part 8 — The research backlog (what the three prompts will answer)
- Part 9 — Open questions for the founder
- Part 10 — Sequencing + dependencies
- Part 11 — Acceptance criteria
- Part 12 — Tier-3 ambitious bets circle-back
- Part 13 — Anti-patterns we explicitly avoid
- Part 14 — Risk register
- Part 15 — Long-term roadmap (year 1, year 2, year 3)
- Part 16 — Tone-of-voice and editorial rules

---

## Part 0 — How to read this document

The plan is structured in three layers:

1. **Decisions** — things the founder has already locked or that
   external research will lock. These are unambiguous and become
   the constraints every other choice is built around.

2. **Specifications** — concrete design + engineering details that
   follow from decisions. Code-level where useful. These can ship
   without further input.

3. **Open research questions** — explicit slots marked
   `[RESEARCH NEEDED: ...]` where the three external research
   prompts will plug in answers. Until those answers arrive, the
   implementation pauses on those specific items only; everything
   else proceeds.

The three external research prompts live next to this file:

- `2026-05-25-research-prompt-design-psychology.md`
- `2026-05-25-research-prompt-pricing-strategy.md`
- `2026-05-25-research-prompt-competitive-teardown.md`

The founder will paste each into a deep-research model
(Claude Research, ChatGPT Deep Research, Gemini Deep Research, or
similar) and return the responses. Findings get triaged here.

---

## Part 1 — Strategic context

### 1.1 Where we are at the end of May 2026

- **Editorial layer is mature.** 16 industries baselined with full
  cost-stack ratios cited to 2024 trade sources. 20 cities with
  hand-written character pages, each ~600-1200 words of original
  prose. Three Tier-1 distinctive features (TangibleUnits per
  industry, FailureModes per industry, IfYouOpenedToday date-aware
  composition) live on every cell page. SmartWaterfall reads the
  cost_stack when present; city rent multipliers apply on city-level
  rows. All this is unique to Margin Atlas in the SMB-benchmark
  category.
- **Data quality is defensible.** Currency bug patched (Mexico's
  17× overstatement is corrected at render time). Plausibility
  suppression catches both catastrophic-high values (Swiss grocery
  at $1.8B per firm) and catastrophic-low values (Mexican gallery
  at $5K per year). Seven prebuild gates block regressions on
  taxonomy, em-dashes, source-agency leaks, dead links, featured-
  tile resolution, render-time data guards, deepening framework.
- **Performance is acceptable.** Vercel Pro + Supabase Pro,
  region-pinned to Frankfurt, top 20 cells pre-rendered at build,
  CorrectionForm lazy-loaded, ISR at 24h. The main "Show me the
  numbers" button is fixed (no more startTransition suppressing the
  loading skeleton).
- **Visual brand is calm.** Atlas paper pattern site-wide.
  Dark footer with the inverted pattern. Vermillion accent.
  Newsreader serif for display, Inter for sans. No SaaS-flavored
  growth-hack chrome.
- **Two paid tiers have been spec'd and prices locked.** $37/mo
  Basic, $77/mo Premium. No trial. No money-back. Stripe wiring
  parked per founder; will plug in when Stripe products are
  created.

### 1.2 What's missing

The visible promise of value beyond what the free visitor sees.

Today: visitor lands → reads the full page (which is genuinely
rich) → leaves with no awareness that more depth exists for paid
users.

The Big-Sites pattern (Crunchbase, Statista, SimilarWeb, etc.)
solves this with VISIBLE LOCK INDICATORS scattered tastefully
across content surfaces: small "Pro" pills inline next to gated
values, blurred-data previews on charts where the visitor can still
see shape but not detail, truncated row counts ("and 87 more
cities — Pro"). The lock indicator is itself the soft promotion.
No popup, no urgency, no upsell — just the constant signal that
there's more behind the paywall.

That's what this plan builds. It does it editorially (no SaaS-spam
tone), accessibly (keyboard + screen-reader + mobile), and with the
brand's calm voice intact.

### 1.3 What this plan does NOT cover

- Stripe wiring (deferred per founder; will be picked up when
  Stripe products are created in the Tesseract Research account)
- The actual money-flow plumbing (Phase D in the implementation
  sequence is built but commented out until Stripe is ready)
- New data acquisition (existing 16-industry baselines + 20-city
  character + cost-stack import sufficient for v1 launch)
- Marketing acquisition (paid ads, SEO content production, PR — all
  separate tracks)
- Annual report production (Tier-3 circle-back, separate plan)
- Custom icons full rollout (spike happens; full rollout post-
  launch)

### 1.4 Strategic thesis (one paragraph)

The product is already deeper than competitors in the SMB-benchmark
category. The remaining work is converting that depth into a
visible value proposition that the casual visitor recognizes within
3-5 seconds of landing. The lock pattern is the mechanism. The
modal is the conversion surface. The pricing is the threshold. The
brand voice keeps it editorial. Build this carefully and the
product transitions from "good free website" to "monetized data
product" without sacrificing the SEO-first compounding traffic
moat.

---

## Part 2 — Monetization research (visible-lock pattern, deepened)

### 2.1 Mental model — gating resolution, not topic

The founder-locked principle: free shows the answer to the search
query; paid shows the deeper resolution. A free visitor searching
"average cafe revenue Madrid" gets a useful answer with median,
top decile, bottom decile, headline cost mix, and full editorial.
A Basic subscriber gets the 25th and 75th percentiles, the full
8-line cost stack, the itemized setup costs, the time-series tail,
and the city-level cut. A Premium subscriber gets sub-industry
variants, exports, the comparison tool unlocked to 5 cells, the
API, and member-only analyst notes.

This rule has three operational implications:

1. **No editorial content is gated.** City character, failure
   modes, tangible units, IfYouOpenedToday, the narrative paragraph
   — all visible to free visitors. The editorial layer compounds
   in SEO and brand trust; gating it would be self-defeating.

2. **Headline data values are free.** Typical revenue, median, top
   decile, bottom decile, employees, payroll — all visible. The
   visitor's search query gets answered. They leave with a useful
   datapoint they can quote.

3. **Resolution and tools are gated.** The 25th + 75th percentiles
   (filling in the spread between top decile and median); per-line
   cost itemization; the time series; the city cut; sub-industry
   variants; the comparison tool's 3rd-5th cells; exports;
   downloads; API access. None of these change the answer; all of
   them deepen the answer.

### 2.2 The three lock states (with implementation patterns)

**State 1 — Inline lock pill on a sourced value.**

A small chip rendered immediately to the right of a value or chart
title, indicating "this specific number / chart comes from the
paid tier." Click opens the paywall modal with context preserved.

Visual: 16-20px wide, rounded-full, atlas-50 background (very pale
vermillion tint), atlas-700 text, thin outline lock glyph at
12px, tier name in 11px uppercase. The pill should read as
"informational, not adversarial."

DOM sketch:
```html
<span class="lock-pill" data-tier="basic">
  <svg aria-hidden>...lock outline...</svg>
  <span>Basic</span>
</span>
```

Render rule: only shows when `viewerTier !== requiredTier`. For
Premium-tier visitors, the pill is hidden because they have access.

Use cases on the site:
- City-level cut tab on cell pages
- "Compare to 4 similar businesses" button on calculator
- Sub-industry variant chips (where variant data_ready and
  variant requires Premium)
- Export buttons (CSV, PDF, embed code)

**State 2 — Blurred-data preview.**

A chart or table area where the DOM contains the real values but
a CSS overlay blurs them visually. The visitor sees the shape
(axes, legend, the anchor median bar) but cannot read the precise
values. A centered CTA card invites them to unlock.

Visual: 4-6px CSS filter blur on the content. A vertical linear-
gradient overlay from transparent (top) to ~70% white (bottom).
The CTA card sits centered, ~280-360px wide, with a one-line
explanation and a Show-me-with-Pro button. The chart's reference
elements (axes, legend, one anchor value like the median) stay
unblurred for orientation.

DOM sketch:
```html
<div class="blurred-preview" data-tier="basic">
  <div class="blurred-content">
    [...real chart bars rendered server-side...]
  </div>
  <div class="blur-overlay" aria-hidden></div>
  <div class="cta-card">
    <p>The 25th and 75th percentiles are part of the Basic plan.</p>
    <button>Show me with Basic — $37/mo</button>
  </div>
</div>
```

Use cases on the site:
- Decile distribution chart: free shows bars at p10, p50, p90;
  the p25 and p75 bars sit blurred behind the overlay
- Cost stack table: free shows lines 1-3 + the operating profit
  total; lines 4-8 sit blurred
- Setup-cost block: free shows the two grand totals; the itemized
  box-1 / box-2 lines sit blurred
- Time-series chart: free shows the last 3 years; the historical
  tail (years 4-10) sits at reduced opacity with a small lock pill
- AnnualCostStack details expansion: same pattern

[RESEARCH NEEDED: optimal blur radius, gradient strength, CTA card
copy length — the design-psychology research prompt will fill this in.]

**State 3 — Truncated row-count tease.**

A list shows the first N rows in full; the (N+1)th row is replaced
with a single inline "and X more — [tier]" line. No blur, no overlay
— just a clean inline count.

Visual: same typography as the rows above it, but the value column
shows the count instead of a dollar figure, and the row's hover
state is the same color as the lock pill.

DOM sketch:
```html
<tr class="truncated-row" data-tier="basic">
  <td>and 87 more cities</td>
  <td><span class="lock-pill" data-tier="basic">Basic</span></td>
</tr>
```

Use cases:
- "Compare to other cities" section on cell pages: 5 cities free,
  rest gated
- "Top countries for [industry]" on industry pages: 9 free, rest
  gated
- Watchlist / saved cells: 0 free, 25 Basic, unlimited Premium

### 2.3 Lock-placement catalog (exhaustive)

The full inventory of every lock placement on the site. Each row
is one element that gets a lock indicator for free visitors.

| Page | Element | Lock type | Tier | Implementation effort |
|---|---|---|---|---|
| Cell page | p25 + p75 bars on distribution chart | Blurred preview | Basic | M |
| Cell page | Cost-stack lines 4-8 | Blurred preview | Basic | S |
| Cell page | Setup-cost itemization (box 1 + box 2) | Blurred preview | Basic | S |
| Cell page | Time-series tail (years 4-10) | Reduced-opacity + lock pill | Basic | M |
| Cell page | City-level cut tab | Inline lock pill on tab | Basic | S |
| Cell page | Sub-industry variant chips | Lock pill (Premium-only) | Premium | S |
| Cell page | Year-over-year delta arrows next to numbers | Inline pill | Basic | XS |
| Cell page | Per-percentile sample-size annotation | Inline pill | Basic | XS |
| Cell page | "Best month to open" seasonality heatmap | Blurred preview | Premium | M |
| Cell page | Public-company peers section | Blurred preview | Premium | M |
| Cell page | "Download as CSV" button | Locked button | Basic | S |
| Cell page | "Download as PDF" button | Locked button | Premium | S |
| Cell page | "Get the API endpoint for this cell" link | Locked link | Premium | XS |
| Cell page | "Source citation" tooltips per cost line | Inline pill (Basic) | Basic | S |
| Calculator | Compare to 4 similar businesses | Locked CTA | Basic | M |
| Calculator | Save calculation to watchlist | Locked CTA | Basic | XS |
| Calculator | Export result as PDF | Locked CTA | Premium | XS |
| Compare | Add 3rd, 4th, 5th cell | Truncated row | Basic | M |
| Compare | Export comparison as PDF / image | Locked button | Premium | S |
| Compare | Save comparison as a permalink | Locked button | Basic | S |
| /industries | "Open the full industry directory as CSV" | Locked button | Premium | XS |
| /cities | "Top 100 cities ranked CSV download" | Locked button | Premium | XS |
| /cities | Per-city pre-built reports | Locked link | Premium | M |
| /world | "Per-country export bundle" | Locked button | Premium | XS |
| Country page | Industries-in-this-country full export | Locked button | Premium | XS |
| Industry page | Cross-country comparison full table | Truncated row | Basic | S |
| Industry page | "Bookmark this industry" | Locked CTA | Basic | XS |
| Sector page | "All industries in this sector" full data export | Locked button | Premium | XS |
| Search results | Saved searches | Locked CTA | Basic | XS |
| API page | Endpoint listing + documentation | Locked content area | Premium | M |
| Account page | Member-only analyst notes archive | Locked area | Premium | M |
| Account page | Email-alerts setup | Locked area | Basic | S |
| Pricing page | n/a (always public) | — | — | — |
| Header CTA | "Pricing" button | — | — | already shipped |
| Footer | Trust microcopy "Cancel any time" | — | — | M |

That's 32 distinct lock placements across the site. After Phase C
ships, every meaningful surface carries the signal.

[RESEARCH NEEDED: what's the optimal density of lock indicators per
page before it feels half-hidden vs informative? The competitive-
teardown research prompt will answer this from comp examples.]

### 2.4 The smart paywall modal (full anatomy)

Single overlay, opens from any lock click, designed to convert
without manipulating.

**Top of modal — Context line.**

A short line of recovered intent. "You're trying to unlock [the
city-level restaurant cost stack for Madrid]." The bracketed string
is dynamically generated from the trigger context. This works for
about 85% of triggers; the rest fall back to a generic "Get the
full Margin Atlas resolution."

This single design choice is the highest-leverage UX element of
the modal because it eliminates the visitor's mental friction of
"why did this open?" — they see immediately that the modal knows
what they were after.

**Headline above the tier table.**

One line, ~50-70 characters. Benefit-led but factual.

Examples that pass the editorial bar:
- "Get the full Margin Atlas resolution for $37/month."
- "Unlock every cost line and every percentile for $37/month."
- "Margin Atlas Basic adds the depth most analysts need."

Examples that fail the editorial bar (avoid):
- "Don't miss out on the data your competitors already have!"
- "Join 10,000+ subscribers exploring the deeper data!"
- "Try Margin Atlas Pro now and transform your business!"

[RESEARCH NEEDED: best-converting headline patterns for editorial-
tone paywalls. Design-psychology research prompt.]

**Tier table — 3 columns.**

| Column | Header |
|---|---|
| Free | "What you have" |
| Basic ($37/mo) | "Recommended" (visually highlighted) |
| Premium ($77/mo) | "For analysts and journalists" |

Per-row: feature name + check or em-dash per column. Visible
"Most popular" pill above the Basic column header. Basic column
uses a subtle vermillion border to distinguish.

The table should have ~12-15 rows. Too many is overwhelming;
fewer than ~10 doesn't convey value.

Suggested row order (most generally-recognized value first):
1. Browse every cell page (free, basic, premium)
2. Editorial: city character, failure modes, IfYouOpenedToday (all)
3. Median + 10th + 90th percentile (all)
4. 25th + 75th percentile (basic, premium)
5. Full 8-line cost stack with shares (basic, premium)
6. Itemized setup-cost boxes (basic, premium)
7. Year-over-year deltas (basic, premium)
8. Time-series tail (years 4-10) (basic, premium)
9. Save cells / build watchlist (basic 25, premium unlimited)
10. CSV export of cells (basic, premium)
11. Sub-industry variants (premium only)
12. PDF export + bulk export (premium only)
13. Public-company peers (premium only)
14. Seasonality + best-month-to-open (premium only)
15. API access (premium 10K calls/mo)

[RESEARCH NEEDED: ideal row count, ideal feature ordering, whether
"Free" column should be the leftmost or rightmost position. The
design-psychology research prompt.]

**Two CTAs at the bottom.**

Primary: "Start with Basic — $37/mo" (ink-900 bg, cream-50 text,
prominent).
Secondary: "Get Premium — $77/mo instead" (white bg, ink-900
border, less prominent).
Tertiary close: "Maybe later" (text only, no border, far right).

Both CTAs link to Stripe Checkout once Phase D ships. Before
Stripe is wired, they link to the pricing page.

**Tiny trust footer.**

One line. "Charged immediately. Cancel any time. No trial, no
money-back." This is editorial honesty rather than scarcity
play; some buyers prefer this signal of "we're confident enough
in the product that we don't need to dangle a refund."

**Modal interaction details.**

- Fade-in 200ms ease-out
- Scrim rgba(0, 0, 0, 0.35)
- Click-outside, ESC, X-button all close
- Focus trap inside modal
- First focus: the context line (so screen readers announce intent)
- Mobile: full-width with 16px outer padding; tier table scrolls
  horizontally if needed
- Tab order: context → tier table cells → primary CTA → secondary
  CTA → close

[RESEARCH NEEDED: what's the best practice for tier-table mobile
layout? Stacked vs horizontal scroll. Design-psychology +
competitive-teardown research.]

### 2.5 What gets locked vs what stays free — the philosophical rule

Already covered in 2.1. Repeating the operational test here for
implementation discipline:

For any candidate gated element, ask:
1. Does the visitor's search-query answer require this element to
   be useful? If yes → must be free.
2. Does this element substantially deepen the answer? If yes → can
   be gated.
3. Is this element a tool or workflow capability (export, save,
   compare)? If yes → can be gated.
4. Is this element editorial (text, narrative, context)? If yes →
   must be free.

If any single answer says "must be free," the element stays free
regardless of how tempting it is to gate.

### 2.6 Underused data we can lock without new ingestion

Inventory of data that already exists in the DB or can be derived
without research effort, ranked by ease of implementation.

| Data | Description | Tier | Lift |
|---|---|---|---|
| Quality grade per cell (A/B/C/D) | Already shown in coverage chip | Free | shipped |
| Source citation per cost line | Reads from cost_stack.source_note | Basic | 1-2 hr |
| Sample size N (headline) | Already in cell | Free | shipped |
| Sample size per percentile | Derived from N × spread | Basic | 2-4 hr |
| Year-over-year delta per cost line | Requires snapshot diff vs prior year | Basic | 6-8 hr |
| Confidence interval per percentile | Derived from N + variance estimate | Premium | 4-8 hr |
| Atlas Score composite | Already shipped, currently visible | Free | shipped |
| Coverage tier chip | Already shipped | Free | shipped |
| Compare against 5 peer cells | New UI component | Basic | 1 day |
| "Best month to open" / seasonality | Per-industry calendar JSON | Premium | 1-2 days |
| Public-company peers per cell | Per-industry peer mapping JSON | Premium | 1-2 days |
| Per-cell tax-residency-aware tax breakdown | Existing post-tax engine | Basic (per cell) | 2-4 hr |
| "Time to break even" line on the IfYouOpenedToday timeline | Derived from setup/revenue/margin | Free (basic), Premium (custom scenario) | shipped |
| "Equipment shopping list" per industry | Per-industry JSON | Premium | 1 day per industry |
| "Real menu / price list" per (industry × country) | Per-cell JSON | Premium | 1 day per (industry × country) |
| Tools-of-the-trade list | Per-industry JSON | Premium | half day |
| Hours of operation typical | Per-industry JSON | Free | half day |

That's 17 layers. 4 are already shipped. The other 13 are largely
JSON-plus-render work; cumulatively ~3 weeks of effort to deepen
all of them. Each one moves the product noticeably forward.

### 2.7 Subtle credible promotion tactics

Five tactics in order from least-invasive to most-invasive. Each
respects the editorial brand.

1. **The visible-lock pattern itself.** Already detailed.

2. **The "Today's Premium preview" rotating teaser.** One paid
   feature unblurred per cell page, rotating per cell-page-load.
   Banner at the top of the chosen section: "Today's Premium
   preview." Trains the visual vocabulary; reveals exact value;
   turns repeat visits into a treasure hunt.

   Implementation: on each cell-page render, hash the cell-ID +
   today's date to select one of ~5 candidate features to unblur
   (cost-line itemization, time-series tail, setup-cost items,
   sub-industry variant, public-peer chart). Render that feature
   without the lock; render the others with the lock. Banner above
   the chosen feature.

3. **The 5-cell contextual prompt.** After the visitor views 5
   cells in the past 7 days, a small bottom-right toast surfaces
   once. Dismissible. Dismissal saved 30 days. Click opens the
   paywall modal.

4. **Email-nurture sequence (Week 5).** The fifth email in the
   nurture chain includes a digest of two cells fully unlocked
   (rendered as if the recipient were Pro), plus a single CTA
   to upgrade.

5. **The Margin Atlas Annual.** Each September, a beautifully
   designed annual report PDF + interactive web summary. Free
   PDF for everyone. Pro/Premium users get an unlocked
   interactive-web version with custom slices and exports.

[RESEARCH NEEDED: which of these five tactics statistically
converts best for editorial-tone products? Design-psychology +
competitive-teardown.]

### 2.8 Open monetization-research questions

These slots get filled by the design-psychology research prompt:

1. Optimal blur radius and gradient strength on the data preview
2. Optimal lock-indicator density per page
3. Best-converting headline patterns for editorial-tone paywalls
4. Best tier-table layout for mobile (stacked vs horizontal scroll)
5. Whether to lead the tier table with "Free" column or hide it
6. Which of the five promotion tactics statistically converts best
7. Whether to A/B test prompt timing (5 cells vs 10 vs 3)
8. Whether to show the upgrade prompt at all for sub-10-second
   bouncers vs only for engaged readers

---

## Part 3 — UX psychology of paywalls

### 3.1 Four principles (operationalized)

**Principle 1 — Visibility without obstruction.**

The visitor should always see the shape of what's gated. A blurred
chart preserves the axes, the legend, the median bar; the precise
values for p25 + p75 are masked. The shape signals "there's more
here"; the masking creates the unlock incentive. Black-box hiding
(rendering nothing where the data would be) creates frustration
instead of curiosity.

Operationalization: every blurred-preview area must show at least
two reference elements visibly (axes + one anchor value). If a
preview area cannot satisfy this, use the inline lock pill instead.

**Principle 2 — Naming what's gated.**

The lock indicator should communicate exactly what tier unlocks it
and exactly what content is gated. "Pro feature" is bad copy;
"the 25th and 75th percentiles are part of the Basic plan" is
good copy. The visitor learns the product shape before they pay.

Operationalization: every lock pill carries the tier name. Every
CTA card in a blurred preview names the specific gated thing in
plain language.

**Principle 3 — Value confirmation through partial reveal.**

The Premium-peek rotating teaser is the highest-leverage UX
pattern for converting paywall-curious users. By showing one
paid feature free on each session, the visitor gets a sample of
the gated value before being asked to pay.

Operationalization: implement Premium-peek as a cell-page feature
(rotating; date-hashed). Banner above the chosen feature reads
"Today's Premium preview." No CTA on the peek itself; the
visitor's awareness is the conversion mechanic.

**Principle 4 — Reversibility of the buying decision.**

Even without a trial or money-back guarantee, the cancellation
flow must be ONE-CLICK from the user's account page. Stripe
Customer Portal handles this natively. The footer microcopy
"Cancel any time" sits on every page.

Operationalization: Phase D includes the Stripe Customer Portal
link on the user account page. Footer microcopy ships in Phase E.

### 3.2 The grammar of the lock indicator

Design choices, opinionated:

- **Icon weight.** Thin outline lock at 12-14px. Filled icons read
  as adversarial; outlines read as informational.
- **Icon color.** Brand accent (atlas-700 vermillion). Gray reads
  as "disabled / broken." Black reads as authoritarian.
- **Pill background.** atlas-50 (pale vermillion tint). Subtly
  signals "premium feature" without screaming.
- **Pill border.** 1px atlas-200. Soft.
- **Pill text.** 11px uppercase tracking-wide, atlas-700.
- **Inline vs corner placement.** Inline with the value or chart
  title. Inline preserves spatial association ("this specific
  thing is what's locked"); corner placement creates ambiguity.
- **Hover behavior.** Scale 1.05 + tooltip surfaces with the tier
  name + one-line gate description.
- **Click behavior.** Opens the paywall modal with the trigger
  context preserved (no surprise navigation).
- **Tap target on mobile.** 44×44 minimum touch area around the
  pill (iOS HIG).
- **Single color across the entire site.** Both Basic and Premium
  locks use the same visual treatment; the tier is named in the
  pill text. Different colors for different tiers would feel
  hostile and chaotic.
- **No animations on idle.** The pill is static. Animation reserved
  for hover state only.

[RESEARCH NEEDED: do users prefer locked content with or without
icons? Some research suggests icons are interpreted as
"forbidden" rather than "premium." Design-psychology research.]

### 3.3 Blurred-data treatment recipe

Implementation specifics, with code examples.

**CSS treatment of the gated area:**

```css
.blurred-preview {
  position: relative;
  overflow: hidden;
}
.blurred-preview .blurred-content {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
}
.blurred-preview .blur-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.0) 40%,
    rgba(245, 245, 245, 0.6) 75%,
    rgba(245, 245, 245, 0.85) 100%
  );
  pointer-events: none;
}
.blurred-preview .cta-card {
  position: absolute;
  inset: auto 0 16% 0;
  margin: 0 auto;
  max-width: 360px;
  background: rgba(255, 250, 245, 0.95);
  border: 1px solid #DDDDDD;
  padding: 16px 20px;
  text-align: center;
  border-radius: 12px;
}
```

[RESEARCH NEEDED: optimal blur radius (3 / 4 / 5 / 6 px?) and
gradient stop positions. Design-psychology research; A/B tests
where published.]

**SSR rendering rule:**

The real data must still be in the HTML (for SEO crawlers per
Google's paywall guidance) but rendered server-side with the
gating CSS class. Cloaking risk is mitigated by:

1. Adding JSON-LD `isAccessibleForFree: false` + `hasPart` with
   the `cssSelector` of the gated region
2. Ensuring Googlebot sees the same DOM as a logged-out human

This is the architectural commitment from the May 24 monetization
research; it's what Crunchbase, Statista, Levels.fyi all do.

[RESEARCH NEEDED: any updates to Google paywall structured-data
spec since 2024? Competitive-teardown research.]

**Render trigger:**

The blur class is applied client-side based on viewer tier
(server-side rendered with the class always, then conditionally
removed for paying users via a small client component that reads
the auth cookie). This keeps the HTML cacheable for SSR and avoids
exposing tier-specific renders to ISR caching.

### 3.4 Modal interaction details

Already covered in 2.4 but elaborated here for completeness:

**Open trigger.** Click any lock element. The trigger context is
encoded in a custom event:

```ts
window.dispatchEvent(new CustomEvent("atlas:open-paywall", {
  detail: {
    contextLine: "the city-level restaurant cost stack for Madrid",
    requiredTier: "basic",
    triggerKind: "blurred-preview" | "lock-pill" | "truncated-row" | "locked-button",
  }
}));
```

A single `<PaywallModalRoot>` component at the layout level listens
for this event and renders the modal.

**Close triggers (all work).** X-button click, click-outside the
modal panel, ESC key, programmatic close (e.g., on successful
checkout). Focus returns to the original lock element so keyboard
users don't lose their position.

**Animations.** Fade-in 200ms ease-out for both the modal and the
scrim. No spring physics, no bouncing — editorial.

**Z-index.** Modal: 9000. Scrim: 8999. Below any system-level
toast notifications.

[RESEARCH NEEDED: should the modal auto-close after some idle
time, or stay open until explicitly dismissed? Design-psychology
research.]

### 3.5 The contextual prompt (5-cell toast)

After the user has loaded 5 unique cell pages in the past 7 days,
a small bottom-right toast surfaces. Editorial-toned:

> "You've looked up 5 small-business benchmarks this session. The
> Basic plan unlocks the full distribution and the per-line cost
> stack on every one. $37/month, cancel any time."

Dismissible with X. Dismissal saved in localStorage for 30 days.
Click the toast text/button to open the paywall modal.

Implementation:
```ts
// Client-side counter, tracked per visitor
const KEY = "atlas:cell_view_count";
const DISMISS_KEY = "atlas:prompt_dismissed_until";

function trackCellView() {
  const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  const today = Date.now();
  const sevenDaysAgo = today - 7 * 24 * 60 * 60 * 1000;
  const recent = [...stored.filter((t: number) => t > sevenDaysAgo), today];
  localStorage.setItem(KEY, JSON.stringify(recent));
  return recent.length;
}

function shouldShowPrompt(): boolean {
  const count = trackCellView();
  if (count < 5) return false;
  const dismissedUntil = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
  if (Date.now() < dismissedUntil) return false;
  return true;
}
```

[RESEARCH NEEDED: is 5 cells the right threshold? 3? 10? 7?
Pricing-strategy research.]

### 3.6 What we explicitly do NOT do

Each of these tactics has measurable short-term conversion lift but
each costs disproportionately in brand for an editorial product:

- **Exit-intent modals.** Trigger when the mouse leaves the
  viewport. Brand-corrosive; reads as desperate.
- **"You've used N free pages this month" hard wall.** Triggers
  a full-page block. Loses the SEO compounding traffic moat.
- **Countdown timers** ("Premium pricing rises in 23 hours").
  Manufactured scarcity. Brand-corrosive.
- **Fake live-counter** ("17 people from Madrid viewing this
  now"). Either fake or invasive. Brand-corrosive.
- **"Only 3 seats left at this price."** Manufactured scarcity.
  Brand-corrosive.
- **Persistent sticky upgrade bar at the top.** Distracts from
  content. Brand-corrosive.
- **Interstitial that blocks the page on first load.** Loses
  SEO; brand-corrosive.
- **Dark-pattern cancellation** (cancel requires phone call,
  multi-step form, "Are you sure?" loop). One-click cancel,
  always.
- **Buried unsubscribe in emails.** Footer link, single-click
  unsubscribe per CAN-SPAM.
- **Sponsored content / native ads in editorial copy.** Loses
  trust signal.
- **Affiliate links in cell-page narratives.** Same.
- **Selling visitor data.** Editorial brand kill-shot.

### 3.7 Mobile vs desktop differences

Phone-specific UX considerations:

- **Lock pill tap target.** 44×44 minimum. Pill itself is smaller
  but the click region expands.
- **Blurred preview CTA card.** Wider, sits at bottom of the
  preview area rather than centered (thumb-friendly).
- **Paywall modal layout.** Full-width with 16px padding. Tier
  table stacks vertically (Free row → Basic row → Premium row)
  rather than horizontal scroll. Sticky "Start with Basic" CTA at
  the bottom always visible.
- **5-cell toast.** Slides up from the bottom instead of
  bottom-right.
- **All hover states gracefully degrade.** Mobile has no hover;
  tooltips become click-to-dismiss popovers.
- **Scroll position preserved.** When the modal closes, the
  scroll position doesn't reset.

### 3.8 Accessibility considerations

- **Lock pills are buttons** (not divs) so they're naturally
  keyboard-focusable.
- **ARIA labels** on every lock pill: "Locked, requires Basic
  plan. Press Enter to open the upgrade modal."
- **Focus indicators visible** — atlas-500 ring on focus, not
  removed.
- **Modal traps focus** while open. ESC closes. First focus on
  context line.
- **Blurred content has `aria-hidden="true"`** — screen readers
  read the CTA card text instead of the gated values.
- **Color contrast** AA minimum (4.5:1 for normal text). Atlas-700
  on atlas-50 passes.
- **Reduced motion respected.** `prefers-reduced-motion` disables
  the fade-in and the hover scale.
- **Text alternatives for all icons.** Lock icon has aria-hidden;
  the pill text serves as the label.

### 3.9 Open UX-psychology research questions

Fed by the design-psychology prompt:

1. Best blur radius / gradient strength
2. Icon vs no-icon for lock indicators
3. Optimal density of lock indicators per page
4. Headline patterns that convert best
5. Whether to show "Free" column in tier table
6. Optimal 5-cell prompt threshold
7. Modal idle-timeout behavior
8. Sticky bottom CTA vs scroll-into-view CTA on mobile
9. Tooltip-on-hover vs tap-to-toggle on lock pills

---

## Part 4 — Pricing + tier construction

### 4.1 The tier philosophy

Three-tier structure (Free + Basic + Premium) per founder-locked
decision. The decoy / good-better-best logic:

- **Free** is the SEO trap and the search-query satisfier.
  Generous enough that visitors leave with the answer + a clear
  awareness of what's behind the paywall.
- **Basic ($37/mo)** is the buy. Targets owners and consultants
  who use the site regularly and need the deeper resolution
  + a few workflow features. ~80% of paying customers expected
  here.
- **Premium ($77/mo)** is the analyst / journalist tier. Targets
  professional users who need exports + API + custom features.
  ~20% of paying customers expected here.

The 2.1× spread between Basic and Premium creates an anchor:
Basic looks reasonable next to Premium, even before the visitor
evaluates the features. Premium also serves a status / signal
function ("I'm a serious user") that some buyers will choose for
non-economic reasons.

[RESEARCH NEEDED: what's the optimal Basic:Premium price ratio
for data subscription products? Pricing-strategy research.]

### 4.2 The full tier matrix

Refined from the v32 plan, with additions from section 2.6:

| Feature | Free | Basic ($37) | Premium ($77) |
|---|---|---|---|
| **Browse + read every cell page** | ✓ | ✓ | ✓ |
| Editorial layer (city character, failure modes, tangible units, IfYouOpenedToday, narrative) | ✓ | ✓ | ✓ |
| Median revenue | ✓ | ✓ | ✓ |
| Top 10% + bottom 10% percentiles | ✓ | ✓ | ✓ |
| 25th + 75th percentiles | — | ✓ | ✓ |
| Per-percentile sample size | — | ✓ | ✓ |
| Headline cost-stack total + top 3 lines | ✓ | ✓ | ✓ |
| Full 8-line cost-stack with shares | — | ✓ | ✓ |
| Source citations per cost line | — | ✓ | ✓ |
| Setup-cost grand totals | ✓ | ✓ | ✓ |
| Itemized setup-cost boxes | — | ✓ | ✓ |
| Year-over-year deltas | — | ✓ | ✓ |
| Time series last 3 years | ✓ | ✓ | ✓ |
| Time-series tail (years 4-10) | — | ✓ | ✓ |
| Tax-aware post-tax breakdown | ✓ | ✓ | ✓ |
| City-level cut tab | — | ✓ | ✓ |
| Sub-industry variants | — | — | ✓ |
| Confidence intervals on percentiles | — | — | ✓ |
| Seasonality / best-month-to-open heatmap | — | — | ✓ |
| Public-company peer companies | — | — | ✓ |
| Equipment shopping list per industry | — | — | ✓ |
| Real-menu / typical price list per cell | — | — | ✓ |
| Atlas Score composite | ✓ | ✓ | ✓ |
| **Tools** | | | |
| Calculator (single cell) | ✓ | ✓ | ✓ |
| Compare (2 cells) | ✓ | ✓ | ✓ |
| Compare (3-5 cells) | — | ✓ | ✓ |
| Save cells / watchlist | — | up to 25 | unlimited |
| Saved searches | — | ✓ | ✓ |
| **Exports** | | | |
| Copy chart as image | ✓ | ✓ | ✓ |
| Cell as CSV | — | ✓ | ✓ |
| Cell as PDF | — | — | ✓ |
| Bulk export (industry / country) | — | — | ✓ |
| **API + embeds** | | | |
| API access (read-only) | — | — | 10K calls/mo |
| Embed code (Atlas widget for blogs) | — | — | ✓ |
| Webhook for cell-data updates | — | — | ✓ |
| **Communication** | | | |
| Weekly digest (Sunday newsletter) | ✓ | ✓ | ✓ |
| Member-only analyst notes (monthly) | — | — | ✓ |
| Email alerts on cells you saved | — | ✓ | ✓ |
| **Account features** | | | |
| Account dashboard | ✓ | ✓ | ✓ |
| One-click cancel | n/a | ✓ | ✓ |

That's 36 rows. Worth fitting into the paywall modal as a single
table; on mobile, the table scrolls horizontally rather than
stacking (decision pending research).

### 4.3 Pricing tactics — deferred questions

Several pricing decisions are deferred for now per founder:

- **Annual pricing.** Not in v1. Most data products offer
  annual with 1-2 months free (15-17% discount). Revisit after
  60 days of monthly conversion data.
- **Team / multi-seat pricing.** Not in v1. The Premium tier as
  spec'd is single-user. Team plans could come later for
  consulting firms that buy on behalf of their analysts.
- **Geographic pricing.** Not in v1. All prices in USD. Could
  add PPP-adjusted regional pricing later (e.g., 50% off for
  India, Brazil, Indonesia) if the international acquisition
  funnel proves out.
- **Enterprise pricing.** Not in v1. Custom contracts and
  white-label deals are a separate motion.

[RESEARCH NEEDED: when to introduce annual pricing? Pricing-
strategy research.]

[RESEARCH NEEDED: best PPP-adjusted geographic pricing tactics
for data products. Pricing-strategy research.]

### 4.4 Open pricing-research questions

Fed by the pricing-strategy prompt:

1. Optimal price points for SMB-data subscription tools
2. Basic-to-Premium price ratio (currently 2.1×)
3. Annual pricing timing and discount
4. Geographic / PPP-adjusted pricing strategy
5. Team plan thresholds and pricing
6. Free-tier generosity vs conversion math
7. Should we charge in USD only or multi-currency
8. Trial vs no-trial empirical results across comparable
   products (already chose no-trial; can revisit)
9. Refund / money-back policy: empirical impact on conversion
   and brand
10. Currency / payment-method support (Apple Pay, Google Pay,
    iDEAL, SEPA, etc.) — which matter for the buyer profile

---

## Part 5 — Custom icons + visual assets circle-back

### 5.1 Image-import phase 2

Phase 1 (built last sprint): `scripts/import/images/fetch_city_images.ts`
pulls candidate city imagery from Unsplash + Pexels into a staging
JSON for editorial review.

Phase 2 (to build): `scripts/import/images/download_approved.ts`

Spec:
- Reads all `_candidates/<city>.json` files
- For each candidate with `editorial_status === "approved"`:
  - Downloads the full-resolution image via the source URL
  - Runs through `sharp` for optimization: convert to WebP at
    quality 80, resize to max 2400px wide, generate 3 derivatives
    (1200px, 800px, 400px) for responsive
  - Writes to `public/city-images/<city>/<slug>.{webp,jpg}`
  - Updates the candidate JSON entry with the local paths
- Generates an attribution manifest:
  `public/city-images/<city>/attribution.json` mapping each local
  image to its photographer + source URL + license
- Logs a summary report

Effort: 4-6 hours including testing.

### 5.2 Image render integration on city pages

A new component `<CityImagery cityGeoId={...} />`:

- Reads the manifest at `public/city-images/<city>/attribution.json`
- If no entry exists, renders nothing (self-suppress for cities
  without approved imagery)
- Renders a single hero-style image OR a 3-image strip depending
  on how many images are approved
- Includes a small attribution line at the bottom (photographer
  + source link, per Unsplash + Pexels TOS)
- Mounted on `/[country]/[geo]/page.tsx` above the CityCharacter
  panel

Effort: 1-2 days including responsive design + accessibility +
mobile testing.

### 5.3 Custom icons spike

The founder mentioned circling back on custom icons. Current state:
the site uses Phosphor icons (Duotone weight) for sector
identification. They look professional but generic — same as
hundreds of other SaaS sites.

Custom icons would mean a bespoke SVG set, one per industry, with
a coherent visual style matching the brand (calm editorial, warm
neutral palette with vermillion accent).

**Two paths to consider:**

**Path A — AI generation via Gemini 3 Pro / similar.**

- Cost: ~$0.10 per icon generation. 3 candidates per industry × 192
  industries = ~$60 raw. Realistically 3-5× that to iterate prompts:
  $200-500 for full coverage.
- Time: ~10-20 hours founder + agent review to pick the right
  candidate per industry. Batched in groups of 20.
- Quality: variable. AI-generated icons can look beautiful or
  generic depending on prompt. Requires iteration.
- Output: SVG (vector). Editable post-generation if minor tweaks
  needed.

**Path B — Hire an illustrator.**

- Cost: ~$3,000-5,000 for a full 192-icon set from a competent
  freelance illustrator, 2-3 week turnaround. Style locked at
  brief stage.
- Time: ~5-10 hours founder + agent review across milestones.
- Quality: human-vetted, stylistically consistent.
- Output: SVG vector.

**Recommendation: spike Path A on 5 industries first.**

Pick 5 industries with distinct visual personality (restaurants,
hair salons, hotels, auto repair, software development). Run 3
prompt variations through Gemini 3 Pro for each. Founder reviews
the 15 outputs, picks the most-aligned variant per industry, scores
the overall quality.

If the result reads as on-brand: scale via AI generation across
all 192 industries. Total cost ~$200-500 + ~30-40 hours of review
time. Total elapsed: 1-2 weeks.

If the result reads as off-brand: pivot to Path B (illustrator),
using the spike output to brief the illustrator. The spike isn't
wasted — it informs the brief.

[RESEARCH NEEDED: best-practice prompt patterns for AI icon
generation in 2026. Design-psychology research can include this.]

### 5.4 Brand visual system implications

If custom icons ship, several downstream consequences:

- The Phosphor icons in SectorIcon.tsx get replaced
- The "Cost stack" header uses custom icons per cost line
- The breadcrumb + nav may get custom mini-icons
- The OG cards for cell pages can incorporate the custom industry
  icon as a brand mark

These are good consequences but require coordination with the
existing visual system. Defer to post-launch.

---

## Part 6 — Implementation phases (A through M)

Thirteen phases. Each independently shippable. Quality checks
embedded per phase.

### Phase A — Lock-pattern design tokens (1-2 days)

Already specified at length earlier. Recap:
- A1. `<LockPill tier="basic" | "premium" />` component
- A2. `<BlurredOverlay tier="..." cta="...">{children}</BlurredOverlay>`
- A3. `<TruncatedTease count={87} unit="cities" tier="basic" />`
- A4. Tailwind / CSS token additions

QA checks:
- Storybook spike page at `/dev/lock-states` (gated by `?dev=1`)
- Visual review — editorial vs SaaS-spammy
- Keyboard accessibility
- Mobile tap targets
- Reduced motion behavior

### Phase B — Paywall modal (1-2 days)

Component: `<PaywallModalRoot />` mounted in `layout.tsx`. Listens
for the `atlas:open-paywall` event.

Internal subcomponents:
- `<ModalScrim />`
- `<ModalPanel />`
- `<TierComparisonTable tiers={...} />`
- `<CheckoutCtaButton tier="basic" | "premium" priceId={...} />`

QA checks:
- Visual: modal feels editorial
- Functional: all dismiss paths work
- A11y: focus trap, ESC, screen reader announcements
- Cross-browser: Safari (iOS + Mac), Chrome, Firefox, Edge

### Phase C — Wire 32 lock placements (3-5 days)

Per the catalog in section 2.3. Each placement is a small wrapper
around an existing component.

Implementation pattern:
```tsx
// Before
<DistributionChart cell={cell} />

// After
<DistributionChart
  cell={cell}
  gateBars={["p25", "p75"]}      // bars to blur for free viewers
  gateTier="basic"
/>
```

Or wrap higher up:
```tsx
<BlurredOverlay tier="basic" cta="See the full distribution with Basic">
  <DistributionChart cell={cell} bars={["p25", "p75"]} />
</BlurredOverlay>
```

Both patterns acceptable; per-component judgment.

QA checks:
- Visual audit: walk through 10 cell pages incognito
- Density check: < 6 visible locks per page
- Founder review: screen-share, note every lock that feels wrong
- SEO check: structured data still marks gated regions correctly

### Phase D — Stripe + auth + tier read (2-3 days, parked)

Already spec'd. Parked per founder. When Stripe products are
created in the Tesseract Research account and price IDs are
shared, this phase ships in a single sprint.

In the meantime: a `getViewerTier()` stub returns `"free"` for
everyone. The Phase B modal's CTA buttons link to the pricing
page (not Stripe) until Phase D unlocks.

### Phase E — Pricing page update + tier-matrix sync (0.5 day)

Already specified. $37 / $77 prices. Three-tier table. No trial.
"Cancel any time" microcopy. CTAs link to Stripe (post-Phase-D)
or to a temporary "Coming soon" notice (pre-Phase-D).

### Phase F — 5-cell contextual prompt (1 day)

Already specified.

### Phase G — Email capture + ConvertKit + nurture (2-3 days)

- G1. Email capture component placements:
  - Inline on cell pages (after failure-modes section)
  - On the calculator + compare tools
  - Existing footer bar stays
- G2. Six-email nurture sequence (drafted, founder approves copy)
- G3. ConvertKit API integration

**Email sender for v1:** Tesseract Research email (per founder).
A subdomain or label distinguishes Margin Atlas mail. Example:
`from: "Margin Atlas <atlas@tesseract.research>"`. Reply-to set
to the same. The recipient sees Margin Atlas branding in the
sender name + subject line.

When `hello@marginatlas.com` is ready (DNS + ConvertKit Sender
config), switch the sender over with no downtime.

QA checks:
- E2E: subscribe → receive welcome email within 5 min
- Unsubscribe single-click; tested
- SPF / DKIM / DMARC authenticated for the Tesseract sender

### Phase H — Analytics + measurement (0.5 day)

- H1. Plausible or Posthog (privacy-respecting)
- H2. Track: page views, cell views per visitor, lock-click
  events, modal opens, modal CTA clicks, conversions
- H3. Weekly internal email digest of key metrics

### Phase I — Premium-peek rotating teaser (1 day)

Per section 2.7 tactic 2. Cell-page render with one feature
unblurred per session, rotating by hash of cell-ID + date.

### Phase J — Underused-data expansion (rolling, 1-2 days per layer)

Per section 2.6 inventory. Ship one layer at a time, post-
launch. Each layer extends Basic or Premium value.

Order (highest-leverage first):
1. Source citations per cost line (Basic) — 1-2 hr
2. Year-over-year deltas (Basic) — 6-8 hr
3. Confidence intervals (Premium) — 4-8 hr
4. Seasonality calendar (Premium) — 1-2 days
5. Public-company peers (Premium) — 1-2 days
6. Equipment shopping list per industry (Premium) — 1 day per
   industry (rolling)

### Phase K — Account dashboard + watchlist (2-3 days)

- K1. Account page: tier display, Customer Portal link, manage
  subscription, billing history
- K2. Saved cells / watchlist (Basic 25, Premium unlimited)
- K3. Saved searches
- K4. Email alerts setup (Basic+)

### Phase L — Custom-icons spike (1-2 weeks, after launch)

Per section 5.3.

### Phase M — Image-import phase 2 + render integration (1 week, after launch)

Per sections 5.1-5.2.

---

## Part 7 — Site-wide quality sweeps

Three sweeps, executed after Phase C and before Phase D ships.

### Sweep 1 — Conversion-flow E2E test

- Founder + 1-2 trusted users walk the site as fresh visitors
- Click every kind of lock
- Open the paywall modal
- Click the primary CTA, confirm it leads to pricing page (or
  Stripe Checkout post-Phase-D)
- Document every friction point
- Iterate

### Sweep 2 — "No paywall where it shouldn't be" audit

- Walk 20 random cell pages as a free viewer
- Confirm: city character, failure modes, tangible units,
  IfYouOpenedToday, narrative are ALL visible
- Confirm: median, top decile, bottom decile, headline cost, grand
  setup-cost total are ALL visible
- Confirm: nothing essential to the search-query answer is
  gated
- Flag any over-gating

### Sweep 3 — Brand voice still calm

- Walk the site again as a free viewer
- Count visible locks per cell page (target: ≤ 6 visible)
- Count visible promotional / upgrade callouts per page
  (target: ≤ 2 visible at any time)
- Read every piece of modal / pill / CTA copy and confirm it
  matches the tone-of-voice rule (Part 16)
- Note any copy that reads as SaaS-spam; rewrite

---

## Part 8 — The research backlog (where the three prompts feed in)

Three external research prompts in this repo:

- `2026-05-25-research-prompt-design-psychology.md`
- `2026-05-25-research-prompt-pricing-strategy.md`
- `2026-05-25-research-prompt-competitive-teardown.md`

Each one fills specific slots flagged `[RESEARCH NEEDED: ...]`
throughout this document. The mapping:

### Design-psychology prompt fills:

- Optimal blur radius and gradient strength
- Optimal lock-indicator density per page
- Icon vs no-icon for lock indicators
- Best-converting headline patterns for editorial paywalls
- Modal auto-close vs explicit-dismiss
- Sticky bottom CTA vs scroll-into-view on mobile
- Tooltip-on-hover vs tap-to-toggle on lock pills
- Best practice for AI-generated icon prompts
- Updates to Google paywall structured-data spec
- "Free" column position in tier table
- Best-converting headline structure

### Pricing-strategy prompt fills:

- Optimal price points for SMB-data subscription tools
- Basic-to-Premium price ratio (currently 2.1×)
- Annual pricing timing and discount
- Geographic / PPP-adjusted pricing strategy
- Team plan thresholds
- Free-tier generosity vs conversion math
- USD-only vs multi-currency
- Trial vs no-trial empirical results
- Refund / money-back policy: empirical impact
- Payment-method support (Apple Pay, etc.)
- 5-cell prompt threshold optimization

### Competitive-teardown prompt fills:

- How comparable products structure their paywall UI
- Modal designs in the wild
- Conversion mechanics that work for editorial-tone products
- What to copy and what to avoid
- Mobile-specific patterns (tier-table layout, etc.)
- Email capture placement patterns
- Density of lock indicators per page (cross-validates
  design-psychology answer)
- How comparable products handle the "Free" column

When responses arrive:
1. Triage each finding against the slots above
2. Update the mega plan with the answer (replacing
   `[RESEARCH NEEDED: ...]` with the resolved answer)
3. Commit the update with a note linking to the research
4. Adjust implementation phases as needed

---

## Part 9 — Open questions for the founder

Pending founder input. Each has a sensible default; "use defaults"
is a valid answer.

1. **Modal tier-table column order.** Free / Basic / Premium (Free
   leftmost) or Basic / Premium / Free (Free rightmost)? Default:
   Free leftmost, Basic highlighted middle, Premium rightmost. May
   change per design-psychology research.
2. **5-cell prompt threshold.** Default: 5 cells.
3. **Currency on paywall.** Default: USD only for v1.
4. **"Today's Premium preview" concept.** Confirm or adjust.
   Default: ship as spec'd in section 2.7.
5. **Custom-icons direction.** Spike via AI first (Path A) or
   commission illustrator (Path B)? Default: AI spike on 5
   industries first.
6. **Image-import workflow.** Founder reviews `_candidates/*.json`
   files manually OR agent builds a small admin UI for approval?
   Default: manual review for v1 to avoid premature tooling.
7. **Email-sender domain for v1.** Default: Tesseract Research
   email with Margin Atlas branding in sender name. Switch to
   `hello@marginatlas.com` when DNS ready.

---

## Part 10 — Sequencing + dependencies

Recommended order, with parallelizable batches:

| Day | Track 1 | Track 2 |
|---|---|---|
| 1-2 | Phase A: design tokens | — |
| 3-4 | Phase B: paywall modal | Phase E: pricing page update |
| 5-9 | Phase C: 32 lock placements | Phase G: email capture + ConvertKit (in parallel) |
| 10 | Phase F: 5-cell prompt | Phase H: analytics |
| 11 | Site-wide Sweep 1 (conversion flow E2E) | — |
| 12 | Site-wide Sweep 2 (no-paywall audit) | — |
| 13 | Site-wide Sweep 3 (brand voice) | — |
| 14-15 | Phase I: Premium-peek rotating teaser | Phase K: account dashboard |
| 16-17 | Phase J wave 1: source citations + YoY deltas | — |
| 18 | Buffer / fixes | — |
| 19+ | Phase D: Stripe wiring | (when founder shares price IDs) |

Total elapsed: ~18-22 working days = ~4-5 calendar weeks at
sustainable pace. Phase D unblocks the actual revenue collection;
everything else can ship without it.

Post-launch (weeks 5+): Phases L (icons spike), M (image phase 2),
J waves 2-6 (more underused data).

---

## Part 11 — Acceptance criteria

The plan is "done" when:

1. Free visitor lands on any cell page → sees full editorial +
   median + top/bottom decile + headline cost-stack total + grand
   setup-cost total + visible lock indicators on the deeper data
2. Free visitor clicks any lock → paywall modal opens with proper
   context line + tier table + appropriate CTA
3. Free visitor clicks the primary CTA → redirected to Stripe
   Checkout (post-Phase-D) or pricing page (pre-Phase-D)
4. Post-Phase-D: paying customer returns to the same page → all
   their tier's content unlocked, no more locks visible for it
5. Pro visitor cancels via Customer Portal → next visit re-locks
   the gated content correctly
6. Analytics dashboard shows real visitor → lock-click → modal-
   open → conversion funnel
7. Email list growing measurably (target: 50+ in first 14 days
   post-capture-launch)
8. At least one organic Basic signup (post-Stripe) in the first
   30 days
9. Brand voice review passes: ≤ 6 visible locks per cell page;
   no SaaS-spam copy anywhere
10. No SEO regression: cells continue ranking for their target
    queries (measured 30 / 60 / 90 days post-launch)

---

## Part 12 — Tier-3 ambitious bets circle-back

Three threads from prior planning, all post-launch:

1. **The Margin Atlas Annual** — beautifully designed annual
   report published each September. Free PDF + interactive web
   summary. Combines existing editorial layers (failure modes,
   city character, surprising cells of the year). Reads as the
   institution that publishes the annual rather than "a website."
   Effort: 3-4 weeks. First annual ships Sept 2026.

2. **Public-company peers per cell** — every cell surfaces 3-5
   publicly-traded comparable companies with real EBITDA / multiples
   / stock performance. Bridges SMB benchmarking with public-market
   data. Premium-tier feature. Effort: 1-2 weeks.

3. **Voice-narrated cell pages** — every cell gets a 30-60 second
   voiced summary via TTS (ElevenLabs / Cartesia). MP3 cached on
   R2 / CDN. Audio is a different content medium; nobody in the
   benchmark space does it. Cost ~$0.05 per generated cell.
   Effort: 1-2 weeks.

All three are post-monetization-launch. Each ships independently
when monetization revenue covers its production cost.

---

## Part 13 — Anti-patterns we explicitly avoid

Already covered in 3.6. Repeating the list as a check-list:

- ☐ No exit-intent modals
- ☐ No hard "you've used N free pages" wall
- ☐ No countdown timers on pricing
- ☐ No fake live-counter
- ☐ No "only X seats left at this price" pricing claims
- ☐ No persistent sticky upgrade bar
- ☐ No first-load interstitial
- ☐ No multi-step / phone-call cancellation
- ☐ No buried unsubscribe in emails
- ☐ No sponsored / native ads in editorial copy
- ☐ No affiliate links in cell-page narratives
- ☐ No selling visitor data
- ☐ No SaaS-spam copy in any user-facing string

---

## Part 14 — Risk register

Risks to the plan + mitigations.

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Lock indicators feel too dense; visitors bounce | Medium | High | QA Sweep 3; cap at ≤6 visible locks per page; iterate per founder review |
| Conversion rate too low to fund operations | Medium | Medium | Plan covers visible lock pattern + nurture; if conversion < 0.5% at 60 days, expand promotional tactics and revisit pricing |
| Phase D delayed (Stripe products not created) | Medium | Medium | Phases A-C + E-K all ship without Phase D; lock modal CTAs link to pricing page until D is ready |
| Email-sender deliverability poor on Tesseract domain | Low | Medium | Test deliverability before launch; switch to marginatlas.com when DNS ready |
| AI-generated icons look generic / off-brand | Medium | Medium | Spike on 5 industries first; pivot to illustrator if results don't pass review |
| SEO impact of gated content (Google penalty risk) | Low | High | Use isAccessibleForFree + hasPart per Google guidance; render full DOM server-side; never cloak |
| Research findings contradict the plan structurally | Low | Medium | Plan has explicit `[RESEARCH NEEDED]` slots; designed to absorb changes without restructure |
| Vercel + Supabase costs grow non-linearly post-launch | Low | Low | Already on Pro tiers; ISR + static caching mitigates; monitor monthly |
| Cancellation rate exceeds signup rate within 90 days | Medium | High | One-click cancel maintains trust; nurture sequence aims to reduce cancellation; if rate > 50%, deep-investigate why before any tactic adjustment |
| Founder bandwidth limited; review cycles slow | Medium | Medium | Phases are independent; founder can review in async batches; default decisions provided for unblocking |

---

## Part 15 — Long-term roadmap

### Year 1 (June 2026 - May 2027)

Q3 2026 (Jun-Aug):
- Ship monetization mega plan
- Hit first 50 paying subscribers
- First Margin Atlas Annual published (September)

Q4 2026 (Sep-Nov):
- Ship Premium-peek rotating teaser
- Ship public-company peers
- Reach 200 paying subscribers
- First small press coverage

Q1 2027 (Dec-Feb):
- Ship voice narration
- Ship 3 sub-industry variant deepenings
- Reach 500 paying subscribers
- First trade-association partnership

Q2 2027 (Mar-May):
- Ship Tier 1 spending: Statista + IBISWorld for cross-validation
- Ship 10 country fact-checker retainers (Tier 3 spending if revenue allows)
- Reach 1,000 paying subscribers
- Second Margin Atlas Annual planned

### Year 2 (June 2027 - May 2028)

- Reach 3,000-5,000 paying subscribers
- Move to Tier 3 spending fully (annual survey + retainers)
- Launch B2B/team motion
- Launch API tier publicly
- Press coverage in financial / trade publications

### Year 3 (June 2028 - May 2029)

- Reach 10,000+ paying subscribers
- Launch international price tiers
- Launch enterprise / white-label
- Become the cited reference for SMB benchmarks

---

## Part 16 — Tone-of-voice and editorial rules

The single rule for every piece of monetization-adjacent copy:

**Say what's true. Leave the emotion to the visitor.**

Bad: "Unlock the secrets of small-business success! ⚡"
Good: "The 25th and 75th percentiles for this cell are part of
the Basic plan."

Bad: "Don't miss out! Subscribe now and save!"
Good: "Subscribe to Basic for $37/month. Cancel any time."

Bad: "Join thousands of smart business owners"
Good: "Margin Atlas Basic adds the depth most analysts need."

This is the editorial brand. Frequent visible locks can still feel
calm if every word they say is restrained.

---

## Footer note: where to start

When the founder is ready to start:

1. Confirm the 7 open questions in Part 9 (or "use defaults")
2. Paste the three research prompts into deep-research models;
   return responses to me
3. I triage the research findings, update this plan in place
4. Phase A starts: design tokens for the lock pattern

That sequence unblocks the whole monetization layer.
