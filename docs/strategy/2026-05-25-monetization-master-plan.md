# Margin Atlas — monetization master plan (v32)

> One ambitious end-to-end plan covering the next phase of work:
> visible-lock paywall pattern across the site, smart paywall modal,
> two paid tiers, premium feature set, UX-psychology grounding, design
> language for lock indicators, the custom-icons / visual-assets
> circle-back, and a multi-phase implementation sequence with quality
> checks at every step.
>
> Reads top-to-bottom. Skip to "What I propose to build first" if
> you only want the punchline.

---

## Why we're doing this now

State of the product, end of May 2026:

- 16 industries baselined; 20 cities have hand-written character
  pages; cell pages now ship three Tier-1 distinctive features
  (TangibleUnits, FailureModes, IfYouOpenedToday); cost-stack
  + setup-cost + city-rent layers all integrated into the
  SmartWaterfall.
- Editorial brand is calm and consistent. Atlas paper pattern,
  dark footer, vermillion accent.
- Data quality is defensible. Currency bug patched, plausibility
  floors AND ceilings, seven prebuild gates.
- Performance is acceptable. Vercel + Supabase Pro, region-pinned,
  static top cells, lazy-loaded heavy chunks.
- Two paid tiers structurally defined: $37 basic, $77 premium.
  Stripe wiring not yet built.
- Pricing page exists, header now has a button-style Pricing CTA.

**What's missing**: the visible promise of value beyond what the free
visitor sees. Today a visitor lands on a cell page, reads everything,
leaves. There's no signal that more depth exists for someone who
pays. There's no "moment of awareness" that turns a curious browser
into a considering buyer.

This plan fixes that.

---

## Part 1 — Monetization research (what to lock, where, how)

### 1.1 The mental model: gating resolution, not topic

From the May 24 monetization research and the founder-locked decision:
**free shows the answer to the search query; paid shows the deeper
resolution.** A free visitor searching "average cafe revenue Madrid"
sees the median, the 10th percentile, the 90th percentile, the basic
cost mix, the top 3 cost lines, the headline setup cost. A Basic
subscriber sees the 25th and 75th percentiles, the full 8-line cost
stack, the itemized setup-cost boxes, the time-series tail, the
city-level cut. A Premium subscriber sees sub-industry variants,
exports, the comparison tool unlocked to 5 cells, the API, the
"premium peek" rotating feature.

This is the gating logic from the existing locked decisions. The
question this plan answers: **how is it implemented visually + UX-wise
so that visitors recognize the unlock signal without feeling alienated.**

### 1.2 The visible-lock pattern (founder-explicit)

Founder mandate: "every page that has some sort of importance, some
data behind the lock, just like the big sides do, in order to visually
give the visitor the feeling that there is more data to be explored
beyond what they can see for free."

This is the Crunchbase / Statista / SimilarWeb pattern done right. The
key elements:

**Three lock states the visitor sees:**

1. **Inline lock pill on a sourced data point.** A small "Pro" or
   "Premium" pill next to a number or chart title. Reads as "this
   value comes from a paid tier." Editorial-toned, not SaaS-spammy.
   Visual: a thin rounded chip with a small lock glyph + tier label.

2. **Blurred-data preview on a chart or table.** The DOM contains
   the real values; a CSS overlay blurs the bars / numbers below
   what's visible to free; a "Show me with Pro" CTA sits centered
   over the blur. Click → opens the paywall modal.

3. **Truncated rows with the count-tease.** A list shows the first N
   rows in full; the (N+1)th row is replaced with "and 87 more
   cities — Pro." Click → opens the paywall.

**Where these appear (this is the catalog):**

| Page | Locked element | Lock type | Tier |
|---|---|---|---|
| Cell page | 25th + 75th percentile bars in distribution chart | Blurred preview | Basic |
| Cell page | Cost stack lines 4-8 (utilities, marketing, insurance, equipment, regulatory) | Blurred preview | Basic |
| Cell page | Setup-cost itemization (box-1 and box-2 breakdown) | Blurred preview | Basic |
| Cell page | Time-series tail (years before the most recent 3) | Blurred preview | Basic |
| Cell page | City-level cut (sub-region within country) | Inline lock pill on tab | Basic |
| Cell page | Sub-industry variant chips (3+ variants) | Inline lock pill | Premium |
| Cell page | "Download cell as CSV" button | Locked button | Basic |
| Cell page | "Download cell as PDF" button | Locked button | Premium |
| Calculator | "Compare to 4 similar businesses" | Locked button | Basic |
| Calculator | "Save this calculation" | Locked button | Basic |
| Compare | Add 3rd, 4th, 5th cell to comparison | Truncated row | Basic |
| Compare | Export comparison as image / PDF | Locked button | Premium |
| /industries | "Open all 192 industries as a CSV" | Locked button | Premium |
| /cities | Top-200 cities pre-ranked report | Locked link | Premium |
| /world | Per-country exports | Locked button | Premium |
| API | Endpoint listing | Locked button | Premium |
| Pricing page | Already public | n/a | n/a |
| Footer of every page | "Cancel anytime" microcopy | n/a | n/a |

That's ~16 distinct lock placements across the site, each editorially
appropriate, each leading to the same modal.

### 1.3 The smart paywall modal

When any lock is clicked, a single overlay opens. Founder mandate:
"smart, designed to include the benefits, assuming the two levels of
premium."

**Modal structure (top-to-bottom):**

1. **Context line at top.** "You're trying to unlock [the city-level
   restaurant cost stack for Madrid]." This is the recovered intent —
   shows the user we understood why they clicked.
2. **Headline above the tier table.** Single benefit-led line that
   names the tier they need. "Get the full Margin Atlas resolution
   for $37/month."
3. **Two-tier comparison table.** Free / Basic / Premium columns.
   Basic column visually highlighted (recommended). Each row is one
   feature with a clear check or X per column. ~12-15 rows max.
4. **Two CTAs at the bottom.** "Start with Basic, $37/mo" (primary)
   and "Get Premium, $77/mo" (secondary, less visually prominent).
   No trial. No money-back. "Charged immediately. Cancel any time."
5. **Tiny trust footer.** "Used by analysts, owners, and journalists
   in 80+ countries. Calm monthly subscription, no upsells."

**Modal anti-patterns (founder + research):**
- No scroll-jacking
- No exit-intent dramatization
- No fake scarcity timers
- No badges shouting "limited time"
- No social proof claims that aren't true
- No interstitial that blocks the page on first load
- Closing the modal returns the user to exactly where they were

### 1.4 What gets locked vs. what stays free — the philosophical rule

Free tier shows enough to be **the best free SMB benchmark on the
internet**. Paid tier shows enough to be **the most useful business
decision tool for an owner / consultant / investor**.

Concretely on a cell page, free visitors see:

- Industry name + city + country + headline editorial
- Typical revenue (median)
- Bottom 10% and top 10% (the spread the founder explicitly wanted free)
- Employees per typical firm + payroll per employee
- Operating profit % (single number)
- Top 3 cost lines summed (rent + payroll + COGS, the dominant 70-80%)
- Setup-cost grand totals (registration + capital, single number each)
- The narrative + city character + failure modes + tangible units +
  IfYouOpenedToday (full editorial layer free)
- Related industries / nearby cities (full SEO link layer free)

That's a full, useful, citable page. Free visitors get the answer.

Paid visitors get the resolution: 25th + 75th percentiles, all 8 cost
lines individually with %, itemized setup boxes, time series, city
cut, sub-industry, exports.

The free tier is intentionally generous because (a) it's the SEO moat
and (b) the founder explicitly chose it.

### 1.5 Underused data we could lock behind premium

We already have data in the DB that could enrich the paid tier
without new ingestion. Listed by ease-of-implementation:

| Data | What it enables | Tier | Implementation lift |
|---|---|---|---|
| Quality grade per cell (A/B/C/D) | A "trust the number / interpret with caution" indicator | Free | trivial — already in the schema |
| Source citation per cost-stack line | "this number comes from NRA 2024 Operations Survey" inline tooltip | Basic | 1 hr — already in source_note |
| Sample size N | "based on 1,247 firms" | Free for headline N; Basic for per-percentile N | 1 hr |
| Year-over-year delta per cost line | "rent is up 8% vs 2023" | Basic | 4 hr if we extend the schema |
| Confidence interval per percentile | "p50 = $1.1M ± $200K" | Premium | 4-8 hr |
| Atlas Score composite | A single 0-100 score per cell | Basic (currently shows for all) | Already shipped |
| Coverage tier chip | Measured / Regional / Estimated / Modeled | Free (currently shows) | Already shipped |
| Compare against 5 hand-picked peer cells | One-click side-by-side | Basic | New UI component, 1 day |
| "Best month to open" + seasonality | Calendar heatmap of typical revenue per month | Premium | 1-2 days |

That's 9 data layers, 7 of which are largely free-text-plus-a-bit-of-JSON
on top of what we already have. **The tier value proposition can grow
substantially with no new data acquisition.**

### 1.6 Subtle credible promotion tactics

The founder asked: "what subtle ways can we use on the site to
actually promote the whole thing in a more credible way?"

Five tactics, in order from least-invasive to most-invasive. Each
respects the editorial brand.

1. **The visible-lock pattern itself.** Every locked element is a
   silent promotion. No copy, no popup, no urgency — just a small
   "Pro" pill that says "more here behind the paywall." Compounds
   on every page view.

2. **The "Today's Premium peek" rotating teaser** (from May 24
   research). One paid feature unblurred per page, rotating per
   cell-page-load. Banner reads "Today's Premium preview." Trains
   the visual vocabulary; reveals what they'd get; turns repeat
   visits into a treasure hunt.

3. **The contextual upgrade prompt after N cell views.** Tracked
   client-side in localStorage. After the user has viewed 5 cells
   in a session, a small one-time banner: "You've explored 5 cells
   this week. Premium unlocks the deeper resolution on all of them
   for $37/mo." Single dismiss button. Cookies remember.

4. **Email nurture (Week 5 of the sequence).** Subscriber gets a
   beautifully designed digest with two cells fully unlocked. The
   call-to-action sits at the bottom, single button, no pressure.

5. **The Margin Atlas Annual.** Free PDF + interactive web summary
   published each September. The full PDF is free; the
   interactive-web Pro version has additional features (custom
   slices, exports). Each annual establishes Margin Atlas as a
   reference. Compounds over years.

All five are slow, calm, editorial. They don't fight the brand.

---

## Part 2 — UX psychology research (how to make the lock pattern not feel hostile)

The hard part of the lock-everywhere approach is psychological. Done
wrong, it triggers paywall fatigue (visitor concludes the site is
mostly hidden, leaves). Done right, it generates curiosity (visitor
recognizes there's depth, considers paying).

The literature is clear on what separates these outcomes.

### 2.1 The four principles

**Principle 1 — visibility without obstruction.** A blurred chart
where the visitor can still see the chart's shape (axes, legend, the
median bar) creates curiosity. A black box that hides everything
creates frustration. The DOM still contains the data; only the
specific values are masked.

**Principle 2 — naming what's gated, not hiding that it's gated.**
"Unlock the 25th and 75th percentiles with Basic" is more trust-
generating than a generic "Pro feature" label. The visitor learns
the shape of the paid product before they pay.

**Principle 3 — value confirmation through partial reveal.** The
"Premium peek" rotating teaser is the most-cited UX research pattern
for converting paywall-curious users to paid. By showing one paid
thing free on each session, you give the visitor a sample of value
before you ask for payment.

**Principle 4 — reversibility of the buying decision.** Even though
we have no trial and no money-back guarantee (founder decisions),
the cancellation UX must be one-click. Founder explicit: "cancel
any time" microcopy in the footer of every page. This reduces buyer
anxiety more than a 30-day money-back ever would.

### 2.2 The grammar of the lock indicator itself

Specific design choices that test well in published UX research:

- **Lock icon weight and color.** A thin outline lock at 12-14px in
  the brand's accent color (vermillion) reads as informational. A
  filled black lock at 16px+ reads as adversarial. We go with the
  outline.
- **Pill background.** A pale tint of the accent (atlas-50, very
  light vermillion) reads as "this is a premium feature." A
  neutral gray reads as "this is disabled / broken." We use the
  accent tint.
- **Inline vs corner placement.** When a value is locked, the pill
  sits **inline** with the value (right after the number / chart
  title) — not in the corner of the section. Inline placement
  preserves spatial association ("this specific thing is what's
  locked"); corner placement creates ambiguity.
- **Hover state.** Pill on hover slightly grows (scale 1.05) +
  surfaces a tooltip with the tier name. Click opens the modal. No
  surprise navigation.
- **Mobile tap target.** The pill is the click target; tap area
  expands to a 44×44px box around it for thumb accessibility (iOS
  Human Interface Guideline).
- **Color across the site.** All locks use the same color palette.
  Different colors for "Basic" vs "Premium" would be hostile.
  Single visual treatment; the tier is named in text inside the
  pill.

### 2.3 The blurred-data treatment specifically

This is the highest-stakes UI element. Done wrong, it kills brand.

- **Blur radius.** 4-6px filter blur on a transparent overlay over
  the gated data. NOT a full opaque blackout.
- **Gradient fade overlay.** A vertical linear-gradient from
  transparent at top to ~70% white at bottom. Lets the visitor see
  the shape of the chart but not the precise values.
- **CTA placement.** Centered text + button over the blurred area.
  Background of the CTA is the brand cream (cream-50) at 95%
  opacity so the chart shape still subtly shows through.
- **Anchor reference visible.** The chart axes, legend, and at least
  one reference value (e.g., the median bar) are NOT blurred. The
  visitor knows the data exists and can see the shape.
- **No animation on blur reveal.** Blur is static on render. No
  fade-in. Animations on blur feel manipulative.

### 2.4 The modal interaction specifically

- **Modal does NOT cover the trigger.** It opens centered on the
  viewport. The clicked element is still visible in peripheral
  vision (suggests close-and-return).
- **Modal has explicit close button** (X top-right) + click-outside
  dismiss + Escape key. All three work.
- **Modal animation: fade-in 200ms.** Not bounce, not slide.
  Editorial.
- **Modal background scrim.** rgba(0,0,0,0.35). Dark enough to
  isolate the modal; not so dark it feels punitive.
- **Tier comparison table inside the modal.** Three columns: Free
  / Basic / Premium. Basic visually highlighted (subtle vermillion
  border, "Most popular" pill). Each row is one feature with a
  clear ✓ or — per column. ~12-15 rows.
- **CTA buttons at the bottom of the modal.** Primary: "Start
  with Basic, $37/mo." Secondary: "Get Premium, $77/mo, instead."
  Tertiary close: "Maybe later" (one-click dismiss with no penalty).

### 2.5 The 5-cell contextual prompt

A separate UX element from the lock pattern. Triggers once per
visitor per session after they've viewed 5+ cell pages. Bottom-
right toast, dismissible. Editorial-toned:

> "You've looked up 5 small-business benchmarks this session. The
> Basic plan unlocks the full distribution and the per-line cost
> stack on every one. $37 a month, cancel any time."

Dismiss with X (saved for 30 days in localStorage). Click the toast
to open the paywall modal.

### 2.6 What we deliberately DO NOT do

These tactics statistically convert but they cost more in brand than
they earn in MRR for a site whose moat is editorial trust.

- No exit-intent modal
- No "you've used your free quota" full-page block
- No countdown timer ("Premium price goes up in 23 hours")
- No fake live-counter ("17 people from Madrid are viewing this")
- No "only X seats left at this price"
- No persistent sticky bar at the top of every page
- No "the next 3 visitors get 50% off"
- No interstitial that blocks the page on first load
- No dark-pattern cancellation (one click, period)
- No buried unsubscribe in emails

---

## Part 3 — The two-tier feature line-up

Locked decisions: Free is generous. Basic is the buy. Premium is the
power-user / professional tier. No trial. No money-back. Stripe
checkout charges immediately.

| Feature | Free | Basic ($37/mo) | Premium ($77/mo) |
|---|---|---|---|
| **Browse + read** | | | |
| Full cell page editorial (city character, failure modes, etc.) | ✓ | ✓ | ✓ |
| Typical revenue (median) | ✓ | ✓ | ✓ |
| Bottom 10% + top 10% percentiles | ✓ | ✓ | ✓ |
| 25th + 75th percentiles | — | ✓ | ✓ |
| Per-percentile sample size | — | ✓ | ✓ |
| Headline cost-stack total + top 3 lines | ✓ | ✓ | ✓ |
| All 8 cost-stack lines with % shares | — | ✓ | ✓ |
| Setup-cost grand totals | ✓ | ✓ | ✓ |
| Itemized setup-cost boxes (registration + capital) | — | ✓ | ✓ |
| Year-over-year deltas | — | ✓ | ✓ |
| Time series (last 3 years) | ✓ | ✓ | ✓ |
| Time-series tail (years 4-10) | — | ✓ | ✓ |
| Sub-industry variants | — | — | ✓ |
| Confidence intervals on percentiles | — | — | ✓ |
| "Best month to open" / seasonality heatmap | — | — | ✓ |
| Public-company peers per cell | — | — | ✓ |
| **Tools** | | | |
| Calculator (single cell) | ✓ | ✓ | ✓ |
| Compare (2 cells) | ✓ | ✓ | ✓ |
| Compare (3-5 cells) | — | ✓ | ✓ |
| Save cells / build watchlist | — | up to 25 | unlimited |
| **Exports** | | | |
| Copy chart as image | ✓ | ✓ | ✓ |
| Cell as CSV | — | ✓ | ✓ |
| Cell as PDF | — | — | ✓ |
| Bulk export by industry / by country | — | — | ✓ |
| **API + embeds** | | | |
| API access (read-only) | — | — | 10K calls/mo |
| Embed code (Atlas widget for blogs) | — | — | ✓ |
| **Communication** | | | |
| Weekly digest (Sunday newsletter) | ✓ | ✓ | ✓ |
| Member-only analyst notes (monthly) | — | — | ✓ |

That's 26 rows; 9 of them Basic-unlocks; 8 of them Premium-unlocks.
The Basic tier is the "I'm an owner / consultant who reads cells
regularly" buyer. The Premium tier is the "I'm an analyst / journalist
who needs exports + API" buyer.

The current pricing page already shows three tiers and a feature
matrix; the matrix needs updating to match the above and to reflect
the $37 / $77 locked prices instead of the placeholder $19 / $79.

---

## Part 4 — The custom-icons / visual-assets circle-back

The founder mentioned this needs picking back up. State of the
work:

- **Phase 1 (built):** `scripts/import/images/fetch_city_images.ts`
  pulls candidate city imagery from Unsplash + Pexels into a staging
  JSON for editorial review. Tightly query-qualified (no generic
  stock dumps). Editorial-status field per candidate.
- **Phase 2 (pending):** the second-stage `download_approved.ts`
  script that takes the approved candidates from the JSON and
  fetches full-res, optimizes, and places under `public/city-
  images/<city>/<slug>.jpg`.
- **Phase 3 (not started):** the actual render integration on city
  pages — where the images live on the page, how they're framed,
  alt text policy, attribution display, mobile sizing.
- **Phase 4 (not started):** custom icons. Founder mentioned custom
  icons for the site (not the Phosphor icons we currently use).
  This would mean either commissioning illustrations OR using a
  generative AI like Gemini 3 Pro / Midjourney via API to produce
  consistent SMB-industry pictographs. Either path involves an
  approval workflow + storage at `public/icons/`.

### 4.1 What to build first

The right order:

1. **Phase 2 — `download_approved.ts` script** (4-6 hours). Reads
   any `_candidates/<city>.json`, processes entries with
   `editorial_status === "approved"`, downloads at appropriate
   resolution, optimizes (next-gen image format conversion via
   `sharp`), writes to `public/city-images/<city>/<slug>.jpg`,
   updates the JSON with the local path. Includes attribution
   metadata for the display layer.

2. **Phase 3 — render integration** (1-2 days). One small
   component `<CityImagery cityGeoId={...} />` that reads from a
   manifest, renders a single hero-style image or a 3-image strip
   per the city's curated set, includes a small attribution line.
   Mounted on `/[country]/[geo]/page.tsx` above the CityCharacter
   panel. Self-suppresses when the city has no approved imagery.

3. **Phase 4 — custom icons** (separate spike, 1-2 weeks). Test a
   generative approach: pick 5 industries, generate 3 candidate
   icons per industry via Gemini 3 Pro (or Midjourney), have the
   founder pick the best one, refine the prompt, scale to all 192.
   Final assets stored at `public/icons/<industry>.svg` (vector
   format, color-token-bound via CSS variables so light/dark/print
   work). Replaces the Phosphor icons in SectorIcon / cell pages.
   Major brand uplift; non-trivial to do well.

### 4.2 Cost / time budget for the icons spike

Realistic numbers:

- Gemini 3 Pro API for icon generation: ~$0.10 per icon
  generation, 3 candidates per industry × 192 industries = ~$60
  for full coverage. Quality varies; we'd burn 3-5x that
  iterating prompts. Budget: $200-500 for the full spike.
- Manual review time: ~30 min per industry × 192 industries =
  ~96 hours of founder + agent review time. Cut to ~40 hours by
  reviewing in batches of 10.
- Alternative: hire a single illustrator on a contract for the
  full 192 icons. ~$3,000-5,000 for a stylistically consistent
  set; takes 2-3 weeks but quality is human-vetted.

My recommendation: start with the AI spike on 5 industries to test
the visual language. If the founder likes the result, scale via AI
generation. If not, the spike output guides an illustrator brief.

### 4.3 Image-import follow-up

The user previously said "go and execute the Unsplash import and
pexels import." I built the first-stage staging script but the
second-stage download script isn't built yet. The natural
sequence:

1. Founder reviews `scripts/import/images/_candidates/*.json` files
   (when generated) and flips `editorial_status` to "approved" or
   "rejected" for each candidate.
2. Agent runs `download_approved.ts` to fetch full-res + optimize.
3. CityImagery component renders the result on city pages.

This needs the founder's hand-curation as step 1 — that's the
"editorial gate" we built to prevent stock-photo dumps. It's not
agent-blockable.

---

## Part 5 — Implementation phases (the multi-step plan with quality checks)

Eight phases. Each is independently shippable. Quality checks at
every phase. Sequenced so earlier phases unblock later ones.

### Phase A — design tokens for the lock pattern (1 day)

Build the visual language ONCE so it's consistent everywhere.

Tasks:
- A1. Create `src/components/lock/LockPill.tsx` — the inline lock
  pill component. Props: `tier` ("basic" | "premium"). Renders a
  small outlined lock + tier name in atlas-50 background.
- A2. Create `src/components/lock/BlurredOverlay.tsx` — the
  gradient-fade blur overlay component. Props: `children` (the
  gated content), `cta` (string), `tier`. Renders the children with
  CSS filter blur + a centered CTA card.
- A3. Create `src/components/lock/TruncatedTease.tsx` — the "and
  N more" row component. Props: `count`, `unit`, `tier`.
- A4. Tailwind token additions: `bg-atlas-50` if not already
  defined; ensure the rounded-full lock pill has the right padding;
  ensure focus-ring states are accessible.

Quality check A:
- Storybook-style spike page at `/dev/lock-states` (gated by
  `?dev=1` URL param) showing all three lock states with both tier
  variants. Visual review: do they read as editorial, or as SaaS-
  spammy? Adjust the blur radius, the pill weight, the gradient
  intensity until they feel restrained.
- Accessibility audit: keyboard-only navigation reaches every lock
  pill; screen reader announces "locked, requires Basic plan,
  press Enter to open the upgrade modal."
- Mobile audit: lock pills are 44×44px tap targets when expanded.

### Phase B — the paywall modal (1-2 days)

The single overlay every lock opens.

Tasks:
- B1. Create `src/components/lock/PaywallModal.tsx` — the modal
  component. Props: `triggerContext` (string, e.g. "the city-level
  restaurant cost stack for Madrid"). Reads `viewer-tier` from a
  context provider; doesn't render if viewer already has the
  required tier.
- B2. Modal structure per section 1.3: context line + headline +
  two-tier table + two CTAs + trust footer.
- B3. The two-tier comparison table — populated from a typed
  `src/lib/pricing/tier_matrix.ts` file (matches section 3 of this
  doc).
- B4. Stripe checkout link: button click constructs the Stripe
  Checkout Session URL via `/api/stripe/create-session`. (Endpoint
  built in Phase D.)
- B5. Modal animations + dismiss handling: fade-in 200ms, ESC,
  click-outside, X button, all work.
- B6. URL deep-linking: modal can be triggered by adding
  `?upgrade=basic` to any URL. Useful for email + paid-ad
  landing pages.

Quality check B:
- Visual: modal feels editorial in the brand's calm voice.
- Functional: every dismiss path works; opening from a paid
  page (visitor already pro) does NOT open the modal.
- A11y: focus is trapped in the modal; first focus is on the
  context line; ESC works; tab cycles through the table + CTAs.
- Cross-device: opens correctly on iOS Safari, Android Chrome,
  Desktop Safari + Chrome + Firefox.

### Phase C — wire lock indicators across the site (2-3 days)

For each of the ~16 lock placements catalogued in section 1.2, add
the appropriate lock component. This is the big visible change.

Tasks (one per placement; group as a single sprint):
- C1. Cell page distribution chart: render p25 / p75 bars inside
  a `<BlurredOverlay>` for free viewers.
- C2. Cell page cost stack: render lines 4-8 inside a
  `<BlurredOverlay>` for free viewers.
- C3. Cell page setup costs: render the itemized box-1/2 inside
  a `<BlurredOverlay>` for free viewers.
- C4. Cell page time series: render the historical tail with
  reduced opacity + a small lock pill near the year axis.
- C5. Cell page sub-industry chips: lock pill on chips beyond the
  parent industry.
- C6. Cell page export buttons: lock the CSV / PDF buttons; click
  opens the modal.
- C7-C12. Calculator + Compare + /industries + /cities + /world
  + API page: same treatment per the catalog.

Quality check C:
- Visual audit: walk through 10 cell pages in incognito; do the
  locks feel consistent? Are they too dense (page feels half-
  hidden) or too sparse (no signal at all)?
- Founder review: a screen-share session where founder navigates
  the site as a fresh visitor. Note every lock that feels wrong;
  iterate the placement.
- SEO check: confirm the structured data on cell pages still
  marks the gated regions with `isAccessibleForFree: false` +
  `hasPart.cssSelector` per the Google paywall guidance.

### Phase D — Stripe + auth + tier read (2-3 days)

The plumbing without which Phase B's modal can't actually charge.

Tasks:
- D1. Stripe Customer Portal: configure in Stripe dashboard
  (founder), wire the link in the user-account page.
- D2. `/api/stripe/create-session` — server route that creates a
  Checkout Session given a tier ("basic" or "premium"). Reads
  `STRIPE_SECRET_KEY` from env.
- D3. `/api/stripe/webhook` — handles `checkout.session.completed`,
  `customer.subscription.deleted`, `invoice.payment_failed`.
  Updates `users.tier` in Supabase accordingly.
- D4. `getViewerTier()` server helper — reads the session/cookie/
  Supabase Auth to return `"free" | "basic" | "premium"`. Used by
  every lock component.
- D5. `TierContextProvider` — client component that hydrates the
  client-side tier state (used by client-component locks).
- D6. Account page updates: tier display, Customer Portal link,
  "manage subscription" button.
- D7. Locked-feature deep links: handle `?upgrade=basic` in middleware
  to open the paywall modal automatically on landing.

Quality check D:
- E2E test: pay $37 on the live site, return to a previously-locked
  page, see the data unlocked.
- E2E test: cancel from Customer Portal, hit the same page after
  webhook fires, see the data re-locked.
- Failed payment test: webhook handles `invoice.payment_failed`
  and notifies the user without immediately downgrading.
- Security: every lock component checks the tier server-side
  (not just client-side); a curl request to the cell-page route
  with a custom cookie cannot bypass the gate.

### Phase E — pricing page + tier matrix update (half day)

Update the existing pricing page to match the new tier structure
(locked decisions from May 24).

Tasks:
- E1. Replace placeholder $19 Pro with $37 Basic. Replace placeholder
  $79 Team with $77 Premium. Update feature matrix to match
  section 3 of this doc.
- E2. Remove trial-flow language ("Start free trial"). Replace
  with "Subscribe to Basic." Cancellation language stays prominent.
- E3. Update the hero copy to position Basic as the recommended
  default. Premium positioned as "for analysts and journalists who
  need exports + API."
- E4. Wire the pricing-page buttons to the same Stripe checkout
  endpoint as the paywall modal.

Quality check E:
- Pricing page renders cleanly on all breakpoints.
- The two CTA buttons each correctly hit Stripe checkout for the
  right product.
- All links throughout the site that say "Pricing" land at the
  correct anchor.

### Phase F — contextual upgrade prompt (1 day)

The 5-cell-visit toast.

Tasks:
- F1. Client-side cell-view counter in `localStorage`. Increments
  on every cell-page mount.
- F2. After 5 unique cells viewed in the past 7 days, show the
  toast. Bottom-right, dismissible. Dismissal saved in
  `localStorage` for 30 days.
- F3. Toast click → opens the paywall modal with appropriate
  context.
- F4. Analytics event on toast show / click / dismiss for
  conversion measurement.

Quality check F:
- Tested in incognito: navigate 5 cell pages, see toast on the
  5th. Dismiss; doesn't reappear. Clear localStorage; counts
  reset.

### Phase G — email capture + nurture wiring (1-2 days)

Email infrastructure for the soft-conversion path.

Tasks:
- G1. ConvertKit account setup: new Sender for
  `hello@marginatlas.com` once founder finishes the DNS
  configuration. Form / Tag / Subscriber-list for Margin Atlas.
- G2. Email capture component placements: inline after the
  failure-modes section on cell pages, on the calculator + compare
  tools, footer-bar stays.
- G3. Six-email nurture sequence drafted (founder approves copy):
  Welcome → surprising cell → methodology → did-you-see-this →
  Basic soft pitch → last-mile pitch.
- G4. ConvertKit API integration: subscribe events from the form
  components fire the right tag/sequence.

Quality check G:
- End-to-end test: subscribe via the inline form, receive welcome
  email within 5 minutes.
- Unsubscribe link present in every email; tested.
- All sender / from / reply-to headers correctly authenticated
  (SPF, DKIM, DMARC).

### Phase H — analytics + measurement (half day, parallel with G)

The minimum needed to know what's working.

Tasks:
- H1. Add Plausible / Posthog (cheap, privacy-respecting analytics).
- H2. Track: page views per route, cell-page-views per visitor,
  lock-pill-click events, modal-open events, modal-CTA-click
  events, conversion-to-paid.
- H3. Build a weekly internal email digest: "this week N visitors,
  M cell views, P lock clicks, Q modal opens, R Basic signups."

Quality check H:
- Internal dashboard shows real numbers within 24h of deploy.
- No PII / GDPR concerns; cookie banner already exists or is
  added.

---

## Part 6 — Quality checks across all phases

In addition to per-phase checks above, three site-wide quality
sweeps after the whole monetization layer ships:

1. **Conversion-flow test (E2E).** Founder + 1-2 trusted users
   walk the site as fresh visitors, click locks, complete checkout,
   confirm they can access locked content. Document every friction
   point.

2. **No-paywall-where-it-shouldn't-be.** Confirm that no editorial
   content is gated (the city character, failure modes, tangible
   units, IfYouOpenedToday should all be free for everyone). Only
   data resolution and tools should be gated. Walk through 20
   random cell pages as a free viewer; nothing reads as missing.

3. **Brand voice still calm.** Walk the site again as a free
   viewer. Does it read as editorial-quality? Or does it read as
   SaaS-spam with too many lock icons? Counts: total visible locks
   per cell page. If > 6, reduce.

---

## Part 7 — Open questions for the founder

A few decisions needed before Phase A can start:

1. **Modal tier-table layout.** Two-tier comparison (Basic + Premium
   side by side, no Free column) OR three-tier including Free?
   My recommendation: three-tier so the user knows what they
   already have for free. Confirm.
2. **The 5-cell prompt threshold.** 5 cells, or 10, or 3? My
   recommendation: 5 for v1, measure conversion, adjust.
3. **Currency on the paywall modal.** USD only for v1, or auto-
   detect EUR / GBP based on visitor IP? My recommendation: USD
   only for v1 to keep Stripe simpler; add EUR/GBP later when
   conversion data justifies it.
4. **The visual treatment for "Premium peek" rotating teaser.**
   Recommended: a small accent-colored band at the top of one
   chosen section on a cell page, reading "Today's Premium preview"
   + the unblurred content. Founder to confirm or adjust.
5. **Email-sender domain readiness.** When can `hello@marginatlas.com`
   be created? Phase G is blocked on this.
6. **Stripe product creation.** Two new Products inside the
   existing Stripe account (Basic $37, Premium $77). Founder to
   create + share price IDs. Phase D is blocked on this.

---

## Part 8 — Sequencing + estimates

Realistic per-phase timing. Each block is 4-7 focused days.

| Phase | What | Calendar |
|---|---|---|
| A | Lock-pattern design tokens | 1-2 days |
| B | Paywall modal | 1-2 days |
| C | Wire 16 lock placements across the site | 2-3 days |
| D | Stripe + auth + tier read | 2-3 days |
| E | Pricing page update | 0.5 day |
| F | 5-cell contextual prompt | 1 day |
| G | Email capture + ConvertKit + nurture | 1-2 days |
| H | Analytics | 0.5 day |
| QA + iterate | Full-site review + fix | 2-3 days |

Total: ~12-18 working days = ~3-4 calendar weeks at sustainable pace.

**The order that matters:**
- A unblocks B + C (design tokens first)
- D can run in parallel with A-C (different surface area)
- E can ship any time after D
- F + G + H ship together near the end
- QA loop happens after each major phase and as the final pre-launch
  sweep

---

## Part 9 — The circle-back items in one place

Three threads the founder mentioned to circle back on:

1. **Custom-icons API spike** (Part 4 + 4.2 of this doc). 5-industry
   AI-generation test next sprint after monetization ships;
   approve / iterate / scale based on results.
2. **Image-import phase 2** (Part 4 + 4.3). Build the
   `download_approved.ts` script next; founder hand-curates one
   pilot city; render integration ships on `/[country]/[geo]/page.tsx`.
3. **The Margin Atlas Annual** (May 24 spending memo, Part 4).
   Production starts in Q3 of year 1, ships in September. Combines
   the existing editorial layer into a citable annual report.

All three are post-monetization-launch. None of them block Phase A.

---

## Part 10 — Acceptance criteria for the whole plan

The plan is "done" when:

1. Free visitor lands on any cell page → sees rich editorial +
   median + top/bottom decile + headline cost-stack total + grand
   setup-cost total + visible lock indicators on the deeper data.
2. Free visitor clicks any lock → paywall modal opens with proper
   context line + tier table + Stripe-checkout CTA.
3. Free visitor pays $37 → returns to the same page → all deeper
   data unlocked, no more locks visible (except premium-tier
   locks where they still apply).
4. Pro visitor cancels → next visit re-locks the content.
5. Analytics dashboard shows real visitor → lock-click →
   modal-open → conversion funnel.
6. Email list growing measurably (target: 50+ subscribers in
   first 14 days after capture goes live).
7. At least one organic Basic signup (not founder testing) in
   the first 30 days post-launch.

All seven criteria met = the SaaS layer of Margin Atlas exists
and is monetizing. The Tier-3 ambitious bets (Annual report,
voice narration, public-peer companies) can then ship one at a
time, funded by the recurring revenue this plan unlocks.

---

## Footer note: the "tone of voice" rule

Every piece of monetization-adjacent copy in this plan — the modal
text, the toast text, the email subjects, the email bodies, the
button microcopy — follows one rule: **say what's true, leave the
emotion to the visitor.**

Bad: "Unlock the secrets of small-business success! ⚡"
Good: "The 25th and 75th percentiles for this cell are part of
the Basic plan."

Bad: "Don't miss out! Subscribe now and save!"
Good: "Subscribe to Basic for $37 a month. Cancel any time."

This is the editorial brand. The lock pattern can be visible and
frequent and still feel calm if every word it says is restrained.
That's the bet.
