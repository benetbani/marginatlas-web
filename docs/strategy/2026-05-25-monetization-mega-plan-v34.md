# Margin Atlas — monetization MEGA plan (v34, research-locked)

**Supersedes** `2026-05-25-monetization-mega-plan.md` (v33).
**Effective date:** 2026-05-25.
**Why this rewrite:** the three external research reports landed
(design-psychology, pricing-scoping, competitive-teardown). v33
had `[RESEARCH NEEDED]` markers throughout; v34 replaces those
with citable findings and tightens every page, lock, and CTA
against verifiable evidence. v34 also adds an aggressive
per-page quality matrix and discrepancy / truncated-logic gates
that were absent in v33.

**Authoritative source files (do not delete):**
- `C:\Users\benet\Downloads\deep-research-report (2).md` — design psychology
- `C:\Users\benet\Downloads\deep-research-report (1).md` — pricing scoping
- `C:\Users\benet\Downloads\deep-research-report.md` — competitive teardown

**Status:** awaiting founder approval to execute. Once approved,
implementation runs in the order in Part 6 below.

---

## Table of contents

- Part 0 — How v34 differs from v33 (the diff in one page)
- Part 1 — 30 locked conclusions from the research reports
  - 1A — Design psychology (10)
  - 1B — Pricing scoping (10)
  - 1C — Competitive teardown (10)
- Part 2 — The locked design system (every primitive, with numbers)
- Part 3 — Locked microcopy lexicon (verbatim, no more guessing)
- Part 4 — Locked pricing system (tiers, framing, refund posture)
- Part 5 — The per-page upgrade matrix (every URL, every check)
- Part 6 — Implementation phases (A through N), re-sequenced
- Part 7 — Quality-check regime (discrepancy + truncation gates)
- Part 8 — Anti-pattern register (hard "do not ship" list)
- Part 9 — Acceptance criteria for v34 to be considered "shipped"
- Part 10 — What remains as live experiment (not pre-decided)
- Part 11 — Founder open questions (must answer before Phase D)

---

## Part 0 — How v34 differs from v33 (the diff in one page)

| Topic | v33 (old) | v34 (locked) | Source |
|---|---|---|---|
| Reveal depth | "show enough teaser, lock the rest" — vague | Reveal the four-thing object (what / when / why / why-credible). Hide the functional summary. Visible stand-firsts depress conversion 86.3% in field evidence | Psych §reveal |
| Blur primitive | "blur with hover reveal" | Structural concealment, not perceptual torment. Show chart axes + legend + one segment; redact the decisive numbers. No "grey soup" | Psych §blur |
| Lock density | "≤ 6 per page" | ≤ 4 per page on cell views, ≤ 2 above the fold, ≤ 1 on mobile above the fold | Psych §choice-overload + Teardown best-practice |
| Tier count | three (Free / Basic / Premium) | unchanged — three tiers stay, but Basic and Premium gates locked to the value-metric axis (per-segment-unlock + depth, not per-seat) | Pricing §value-metric |
| Charm pricing | $37 / $77 | unchanged. .99 endings explicitly avoided (weak field evidence; cheapens premium) | Psych §price-tag |
| Annual framing | not specified | Annual price shown as monthly equivalent + full billed total in the same line: `$31/mo billed annually as $372` | Psych §periodic-framing |
| Trial | none | unchanged. NO trial. Replace with "Cancel anytime, no long-term commitment" verbatim from Numbeo | Teardown §G + Psych §trial |
| Money-back | none | unchanged. NO money-back. We do not ape Trading Economics' non-refundable trap either — pricing copy must explicitly say "First month is your full evaluation. Cancel any time." | Teardown §worst-practice |
| Trust signals on paywall modal | "logos + testimonials + security badge" | **At most TWO** assurance cues. More than two reduces completion (field data, n=288,169 transactions) | Psych §trust |
| Pricing transparency | three tiers visible | unchanged + locked: NO "Contact sales" tier. Every tier shows a real number. (Anti-PitchBook stance, justified for prosumer band) | Teardown §J |
| Microcopy | "TBD per founder voice" | LOCKED lexicon in Part 3 below, copied from the verbatim industry standard | Teardown §E |
| Free-tier generosity | "median + p10 + p90 visible" | unchanged, but ALSO: city character, failure modes, tangible units, IfYouOpenedToday, narrative, p10/p50/p90, headline cost, grand setup-cost total. Gate only depth (p25/p75, full waterfall, exports, comparisons, alerts, watchlist > 5) | Teardown §SaaS+SEO patterns |
| Mobile paywall | "modal works on mobile" | Mobile gets a different treatment: NO mid-content modal interrupt. Bottom-sheet only. One primary action. Email-me-the-plan / save-for-desktop handoff for checkout if needed | Psych §mobile |
| Quality regime | three post-Phase-C sweeps | per-page matrix (Part 5) + four gate scripts (Part 7) + pre-merge discrepancy check + truncation check | new in v34 |
| Phase order | A→M | A→N (new Phase N = research-finding regression suite); Phase B (modal) cannot ship until Phase 0Q (quality gates) is wired | new in v34 |

---

## Part 1 — 30 locked conclusions from the research reports

These are not optional. They override every contrary instinct in
v33. Every conclusion is paraphrased with the supporting study
or product named where applicable.

### 1A — Design psychology (10 conclusions)

1. **Legible scarcity, not blank obstruction.** Curiosity is
   highest at moderate confidence — users must believe a
   concrete, important object exists behind the wall. Show
   title, scope, date, source, methodology. A blank wall
   reads as emptiness, not value.
2. **Reveal less than instinct says.** Field study on 21
   German/Austrian news sites: visible stand-firsts reduced
   the odds of clicking "subscribe now" by **86.3%**.
   Show structure, hide the functional summary.
3. **Structural concealment beats perceptual torment.** Show
   chart title + axes + legend + one segment; redact the
   decisive numbers. Heavy blur into "grey soup" backfires
   (disfluency literature is null/inconsistent).
4. **The four-thing reveal rule.** Every locked surface must
   communicate: (1) what the object is, (2) how current it
   is, (3) why it matters, (4) why our version is credible.
   Absent any of these, the wall reads as emptiness.
5. **Choice architecture: simpler wins.** Two-tier and
   three-tier both work; sprawling grids hurt. Defaults are
   powerful but reversible; pre-selecting a tier with a clear
   un-select is fine.
6. **Annual-as-monthly framing lifts subscription intent.**
   (Atlas & Bartels.) Display annual plan as `$X/mo billed
   annually as $Y`. Total must be visible.
7. **Discounts at close work; theatrical urgency backfires.**
   Genuine launch discount with a real end date: fine.
   Countdown timers, "3 left" scarcity, confirmshaming:
   reduces benevolence, increases aversion.
8. **At most two trust signals on the paywall modal.** Field
   study (n=288,169 transactions, 493 retailers): more than
   two seals **reduces** purchase completion. Pick the two
   that matter (methodology link + cancel-anytime).
9. **Category-congruent seriousness beats luxury ornament.**
   Premium = restrained typography, stable layout, credible
   graphs, visible publication dates, consistent iconography.
   Not: gold gradients, gem icons, animated badges.
10. **Mobile changes the funnel role.** Mobile is upper-funnel.
    Optimize mobile for relevance + trust proof, not checkout.
    Offer "email me the plan" / "save for desktop" as the
    explicit handoff when the checkout would be awkward.

### 1B — Pricing scoping (10 conclusions)

1. **Value metric is THE foundational decision.** Every other
   lever (free generosity, price points, geo, churn) is
   downstream. We commit: **per-tier-feature unlocks** as the
   primary value metric (not per-seat, not per-query). Basic
   unlocks depth-on-current-cell; Premium unlocks
   compare/watchlist/export/alerts cross-cell.
2. **Per-tier-feature beats per-query for browsing products.**
   "Ticking-meter" anxiety destroys engagement on inherently
   browsing-driven tools (Balasubramanian, Bhattacharya,
   Krishnan; Bhargava & Choudhary). We do not meter cell
   views.
3. **Versioning is only optimal under specific segmentation
   conditions** (Bhargava & Choudhary). Our two paid tiers
   are justified because Basic and Premium serve genuinely
   different jobs: Basic = "I am one small-business owner
   benchmarking myself"; Premium = "I am an advisor/analyst
   evaluating multiple cells".
4. **For SEO-exposed paywalled content, Google's flexible
   sampling spec governs.** We must mark gated regions with
   the correct structured data so Google can still rank
   them. Free-tier content must remain crawlable.
5. **Freemium conversion depends on the FIT between free and
   paid plans** (Wagner, Benlian & Hess). Free must feel
   complete-for-its-purpose, not crippled. Paid must
   feel like "more depth", not "now I can finally use it".
6. **Two plans usually beat three for self-serve.** We
   ship three (Free/Basic/Premium) but the pricing page
   visually emphasizes ONE paid tier (Basic) as the
   default-recommended.
7. **Low-ARPA businesses rarely achieve enterprise-like NRR**
   (ChartMogul). We must engineer expansion via natural
   gates (watchlist limit, export count, region count) not
   per-seat add-ons.
8. **Involuntary churn is a non-trivial slice** (Recurly).
   Dunning + card-updater + retry cadence are pre-launch
   requirements, not afterthoughts.
9. **Pricing A/B tests are statistically expensive.** Survey
   methods (Van Westendorp, Gabor-Granger) and cohort
   analysis come BEFORE live pricing splits. We do not
   randomize $37 vs $39 in week one.
10. **The brief's fallback condition triggers for us.** Our
    product IS primarily SEO-exposed paywalled content, so
    the free-access / SEO / paywall question is as important
    as the value-metric question. Google's documentation
    governs Phase 0G.

### 1C — Competitive teardown (10 conclusions)

1. **The dominant winning pattern for SEO+SaaS hybrids:
    "deep public proof with shallow paid cliffs"** (Similarweb,
    Glassdoor, Levels.fyi, Numbeo). Let visitors verify the
    product is real BEFORE asking for money.
2. **Gate the NEXT analytical step**, not the first page load.
    Similarweb gates comparison + export + country expansion,
    not the headline number.
3. **Context-specific locks at curiosity-spike moments.**
    Levels.fyi puts the wall at "Latest Salary Submissions"
    exactly where curiosity peaks. We will mirror: put the
    p25/p75 gate at the distribution chart, not at the
    headline median.
4. **Numbeo cancellation copy is the gold standard**:
    "Subscriptions renew automatically. Cancel anytime.
    No long-term commitment." We copy this verbatim.
5. **Trading Economics is the worst observed case**:
    non-refundable trial, auto-charges if not cancelled,
    no refund for unused days. We REJECT this entire pattern
    AND we make our anti-pattern stance visible in copy
    ("no surprise charges, no auto-trial, no friction
    to cancel").
6. **Apollo's FAQ transparency on credits + downgrades + cancel
    is a competitive advantage.** Even though we are not
    metered, we publish a single short FAQ that addresses:
    what counts as a "view"? what happens if I cancel
    mid-month? do I lose saved watchlists?
7. **Public price transparency on lower-ticket lanes.**
    Levels.fyi, Numbeo, G2 all publish concrete numbers. We
    follow. NO "Contact sales" tier. NO opaque
    "Request your pricing".
8. **Visual primitive: greyed/reduced-depth data, not
    black-box empty page** (Similarweb's question marks
    on competitor cells). We apply: locked bars in the
    distribution show as ghost-grey with their position
    on the axis still visible.
9. **Microcopy is functional, action-verb + utility.** Locked
    lexicon (Part 3) is copied from the observed industry
    standard.
10. **Trust block formula**: logos + counts + named institutions
    + dataset names. NOT generic "industry-leading" adjectives.
    Concrete proof objects: review counts, ranks, total
    visits, query caps, median values. We have these — we
    must surface them on the paywall.

---

## Part 2 — The locked design system (every primitive, with numbers)

### 2.1 LockPill (inline indicator on a value)

Replaces v33's vague spec.

```tsx
<LockPill tier="basic" />   // shows "Basic" pill, atlas-700 bg
<LockPill tier="premium" /> // shows "Premium" pill, ink-900 bg
```

- Geometry: 20px height, 8px horizontal padding, 9999px radius,
  text-[11px] uppercase tracking-wide
- Color: Basic = `bg-atlas-700/10 text-atlas-800`; Premium =
  `bg-ink-900/8 text-ink-900`
- Icon: **NO padlock**. The word "Basic" / "Premium" is the
  signal. Padlock icons read as "you are not allowed" rather
  than "you have not paid yet" (teardown §D).
- Hover: NO modal trigger on hover. Click only. (Mobile parity.)
- Accessibility: `aria-label="Basic feature, click to learn more"`

### 2.2 BlurredOverlay (covers a section of locked content)

- Blur radius: `backdrop-blur-[6px]`. NOT 12px or higher
  (perceptual-torment threshold).
- Background overlay: `bg-cream-50/40` (preserves underlying
  shape, removes legibility).
- Centered CTA card: 320px max width, white bg, single
  paragraph + one CTA button.
- The locked content underneath must still render so screen
  readers and search crawlers see the structure (with
  `aria-hidden="true"` on the value spans and a structured
  data marker that gates the region).

### 2.3 TruncatedTease (n-more-rows tease)

- Pattern: render 3-5 visible rows (with real data), then a
  greyed row that says: `87 more cities — Basic unlocks the
  full list`.
- The visible rows include p10/p50/p90 for the headline metric
  (not gated).

### 2.4 RedactedNumber (single value gated inline)

- Show `$••,•••` in the same monospace tabular-nums style as a
  real number, so the layout doesn't shift. Underline with a
  dotted atlas-300 border to signal "click to learn what's
  here".

### 2.5 GhostBar (distribution-chart locked segments)

- Locked p25/p75 bars render at the correct x-position with
  `fill="rgba(0,0,0,0.06)"` and a `stroke-dasharray="2 2"`.
- The axis labels stay visible — the user sees the SHAPE of
  the distribution, just not the value. (Similarweb pattern.)

---

## Part 3 — Locked microcopy lexicon (verbatim, no more guessing)

Every CTA / pill / label / modal headline in the product MUST
come from this list. If a copy need arises that is not here, it
gets added here first, reviewed against the tone rules in
Part 8, and then deployed.

### 3.1 Lock labels (on the pill itself)

- `Basic` — used on inline pills
- `Premium` — used on inline pills

### 3.2 CTA copy on the lock-overlay (clicking the lock)

- Distribution chart: `See the full distribution with Basic`
- Comparison row: `Compare with Basic`
- Region expansion: `See all regions with Basic`
- Watchlist add: `Save with Basic`
- Export: `Export with Premium`
- Alerts: `Get alerts with Premium`
- Year-over-year deltas: `See YoY change with Basic`
- Confidence intervals: `See confidence bands with Premium`

NOTE: every CTA = action verb + benefit + tier. No
"Unlock" / "Get access" / "Upgrade now" (generic).

### 3.3 Modal headline (when the paywall opens)

Three variants by entry point:

- From cell-page distribution: `See the full distribution`
- From compare attempt: `Compare cells side by side`
- From export attempt: `Export this cell to CSV`

The headline does NOT say "Premium" or "Basic" — it names the
JOB the user is trying to do. The tier reveal is in the
sub-copy.

### 3.4 Modal sub-copy

```
Margin Atlas Basic unlocks p25 and p75 across every cell,
year-over-year changes, source citations on each cost line,
and saved cells (up to 25). $37/mo. Cancel any time.
```

```
Margin Atlas Premium adds side-by-side comparison, CSV
export, email alerts on cell updates, confidence bands,
and seasonality. $77/mo. Cancel any time.
```

### 3.5 Trust line (one only, ≤2 total cues)

- `Methodology` (link to /about-data)
- `Cancel any time` (placeholder, no link needed)

NO other trust signals on the modal. (Research conclusion 1A.8.)

### 3.6 Cancellation copy (footer of every paywall + pricing page)

EXACT TEXT (copied from Numbeo, slightly adapted):

```
Subscriptions renew automatically. Cancel any time.
No long-term commitment. No surprise charges.
```

### 3.7 Anti-Trading-Economics callout (pricing page only)

```
What we will never do: no auto-trial, no card-required-to-
preview, no friction to cancel, no surprise renewal-price
hikes. The price you sign up at is the price you pay until
you decide otherwise.
```

### 3.8 "Free" plan label

- Plan name on the pricing page: `Free` (not `Starter`,
  not `Browse`)
- One-line description: `Median, top decile, and bottom
  decile for every cell. The character of every place we
  cover. No account required.`

### 3.9 Refusal microcopy

If a user clicks an upgrade CTA but Stripe is not yet wired
(Phase D parked):

```
Coming soon — we're finishing payment setup this month.
Drop your email and we'll let you know the moment Basic
opens.
```

---

## Part 4 — Locked pricing system (tiers, framing, refund posture)

### 4.1 Tier matrix (LOCKED)

Three tiers. Feature gates locked to the per-tier-feature
value metric (research conclusion 1B.1).

| Feature | Free | Basic $37/mo | Premium $77/mo |
|---|---|---|---|
| Cell pages (read) | ✓ all | ✓ all | ✓ all |
| Median (p50) | ✓ | ✓ | ✓ |
| Top decile (p90) | ✓ | ✓ | ✓ |
| Bottom decile (p10) | ✓ | ✓ | ✓ |
| Headline cost line | ✓ | ✓ | ✓ |
| Grand setup-cost total | ✓ | ✓ | ✓ |
| City character | ✓ | ✓ | ✓ |
| Failure modes | ✓ | ✓ | ✓ |
| Tangible units | ✓ | ✓ | ✓ |
| IfYouOpenedToday | ✓ | ✓ | ✓ |
| Narrative paragraph | ✓ | ✓ | ✓ |
| **Lower-mid (p25)** | — | ✓ | ✓ |
| **Upper-mid (p75)** | — | ✓ | ✓ |
| **Year-over-year deltas** | — | ✓ | ✓ |
| **Source citation per cost line** | — | ✓ | ✓ |
| **Saved cells (watchlist)** | — | ✓ 25 max | ✓ unlimited |
| **Saved searches** | — | ✓ | ✓ |
| **Cell comparison (side by side)** | — | — | ✓ |
| **CSV export** | — | — | ✓ |
| **Email alerts on cell updates** | — | — | ✓ |
| **Confidence intervals** | — | — | ✓ |
| **Seasonality calendar** | — | — | ✓ |
| **Public-company peers panel** | — | — | ✓ |
| **Equipment shopping list** | — | — | ✓ |

### 4.2 Annual framing (LOCKED)

Pricing page shows the monthly price big, with the annual
equivalent below in smaller type:

```
Basic
$37/mo
or $31/mo billed annually as $372
```

NOT `$31/mo`. NOT `Save 16%`. The monthly price is the
headline because that's the commitment the user signs.

### 4.3 No-trial / no-money-back posture (LOCKED)

- NO free trial.
- NO money-back guarantee.
- Pricing copy explicitly addresses why (per Part 3.7):
  this is a deliberate anti-Trading-Economics stance.

### 4.4 Most-prominent tier (LOCKED)

Basic ($37/mo) is the visually-recommended tier. Premium is
shown but not pushed. The Free column is on the LEFT, Basic in
the MIDDLE (with a subtle `bg-atlas-50` and `border-atlas-300`),
Premium on the RIGHT.

### 4.5 Geo pricing (DEFERRED)

PPP pricing is on the roadmap but not in v34. We ship a
single global USD price for v34. Revisit after 90 days of
conversion data by country.

### 4.6 Payment provider (DEFERRED — Phase D)

Stripe wiring stays parked per founder. Pre-Phase-D, all
CTAs link to the pricing page; the pricing page CTAs link
to an email-capture form (Phase G) with the Phase 3.9
refusal microcopy.

---

## Part 5 — The per-page upgrade matrix (every URL, every check)

This is the heart of v34. Every page on the site that is
affected by monetization gets a row. Every row has a
verification command. The "evidence" column is the file the
grep / curl / playwright test asserts against. Quality gate
failure = no merge.

### 5.1 Pages that MUST receive the lock/trust treatment

| Page pattern | Locks to add | Trust to add | Verifier |
|---|---|---|---|
| `/` (homepage) | None — homepage stays editorial / inviting | One `Methodology` link in the data-confidence band | `scripts/audit/page_check_home.ts` |
| `/{country}/{region}/{industry}` (cell page) | p25/p75 GhostBar on distribution; YoY-delta LockPill on header; source-citation `RedactedNumber` per cost line | Methodology link in footer; Last-updated date in header (the "how current" cue, conclusion 1A.4) | `scripts/audit/page_check_cell.ts` |
| `/industries/{industry}` | p25/p75 column LockPill in the "top regions" table; `TruncatedTease` for regions > 10 | None additional | `scripts/audit/page_check_industry.ts` |
| `/cities/{city}` | p25/p75 column LockPill in the "top industries" table; `TruncatedTease` for industries > 10 | None additional | `scripts/audit/page_check_city.ts` |
| `/world` | None | None | `scripts/audit/page_check_world.ts` |
| `/calculator` | Result panel: percentile shown free; p25/p75 brackets shown via LockPill | Methodology link | `scripts/audit/page_check_calc.ts` |
| `/compare` | Side-by-side blocked entirely behind Premium `BlurredOverlay`; preview of layout visible | Methodology + Cancel any time | `scripts/audit/page_check_compare.ts` |
| `/pricing` | NO locks (pricing page itself is free) | Full Part 3.6 + 3.7 copy block at bottom | `scripts/audit/page_check_pricing.ts` |
| `/about-data` | NO locks | This IS the methodology page | `scripts/audit/page_check_about.ts` |
| `/blog/{slug}` | NO locks (SEO-critical) | Author + date in header | `scripts/audit/page_check_blog.ts` |
| `/sectors/{sector}` | LockPill on "deep comparison" rows | None | `scripts/audit/page_check_sector.ts` |

### 5.2 Discrepancy checks (per-page)

For every page in 5.1 above, the audit script asserts:

1. **No orphan lock**: every LockPill / BlurredOverlay / GhostBar
   that renders MUST have a matching CTA that opens the paywall
   modal. (Truncated logic gate.)
2. **No silent gate**: if a value is gated in the rendered HTML,
   it MUST also appear in `aria-label` or `aria-hidden` markers
   AND in the structured data with the correct
   `isAccessibleForFree="False"` annotation (Google paywall spec).
3. **No leakage**: a value that is supposed to be Premium-gated
   must not leak in the page source as plain text inside any
   element (e.g. data attribute, JSON-LD that's NOT marked
   gated, server-rendered SSR text). Audit greps for the actual
   p25/p75 numbers and asserts they only appear in gated
   regions.
4. **No "almost-revealed"**: per conclusion 1A.2, no page may
   show a stand-first/intro paragraph that already answers
   the user's question before the lock. Audit measures: total
   visible non-locked text characters before the first lock,
   and compares against a per-page-type cap.
5. **The four-thing test**: every cell page must render
   (a) the cell title, (b) a `data-updated="YYYY-MM-DD"` attr,
   (c) the methodology link, (d) the source-list link. Missing
   any one of these = fail.

### 5.3 Truncation-logic checks

- **No half-built sections**: every section that conditionally
  renders based on tier must have ALL THREE branches
  implemented (free / basic / premium). Audit walks the
  component tree.
- **No dead CTAs**: every CTA renders a defined click handler;
  no `href="#"` placeholders.
- **No conditional 404s**: gated pages must render the full
  shell + lock UI for free users, never a 404 or redirect.

### 5.4 Per-page "did this page receive the upgrade?" matrix

A single CI report (`audit-report.json`) lists every page in
5.1 with a green/red badge against five gates:

- `[A] lock primitives present`
- `[B] trust copy present`
- `[C] no orphan locks`
- `[D] no leaked values`
- `[E] four-thing reveal complete`

The report is rendered as `coverage/monetization-coverage.html`
and the build fails if any cell is red.

---

## Part 6 — Implementation phases (A through N), re-sequenced

Phases A-M from v33 are preserved. Phase N is new in v34.
Order is enforced: phases ship in this order, no skipping.

### Phase 0Q — Quality-gate infrastructure (NEW — must ship first, 1 day)

Before any monetization UI, the audit scripts in Part 5 ship as
stubs that return green for every page. The prebuild adds them
as required gates. This guarantees that every subsequent phase
is verified the moment it lands.

- 0Q1. `scripts/audit/page_check_*.ts` stubs for all 11 page
  patterns in 5.1
- 0Q2. `scripts/audit/run_monetization_coverage.ts` orchestrator
- 0Q3. `prebuild-monetization-coverage.ts` gate in the prebuild
  pipeline
- 0Q4. `coverage/monetization-coverage.html` template

### Phase A — Lock-pattern design tokens (1 day)

- `<LockPill />` per Part 2.1 (no padlock icon)
- `<BlurredOverlay />` per Part 2.2 (6px blur, not 12)
- `<TruncatedTease />` per Part 2.3
- `<RedactedNumber />` per Part 2.4 (NEW vs v33)
- `<GhostBar />` for distribution charts per Part 2.5 (NEW vs v33)
- Storybook at `/dev/lock-states` (gated by `?dev=1`)

QA checks (now enforced by 0Q):
- All five primitives render in all three tier states
- Each primitive has a matching modal trigger
- Reduced-motion respects user preference
- Mobile tap targets ≥ 44×44px

### Phase B — Paywall modal (1-2 days)

- `<PaywallModalRoot />` mounted in `layout.tsx`
- `<TierComparisonTable />` mirrors Part 4.1 verbatim
- Modal headline + sub-copy: pulled from Part 3 microcopy
  lexicon (hardcoded, no founder-edit-in-prod)
- Trust block: methodology link + cancel-anytime ONLY
  (no third signal)
- Mobile: bottom-sheet, not centered modal (per conclusion 1A.10)

### Phase C — Wire 32 lock placements (3-5 days)

Per the catalog in v33 section 2.3, updated for the v34
microcopy and primitives. Each placement uses the matching
audit script from Part 5.

### Phase D — Stripe + auth + tier read (parked per founder)

Unchanged from v33. When Stripe products are created in
Tesseract Research's account, this phase ships in one sprint.
Until then, CTAs link to pricing page; pricing page CTAs
link to email-capture (Phase G).

### Phase E — Pricing page update + tier-matrix sync (0.5 day)

The pricing page renders directly from Part 4.1's matrix
data structure (no copy drift between modal and pricing page).

Adds:
- Part 3.6 cancel-anytime block at the bottom
- Part 3.7 anti-Trading-Economics callout above it
- Annual framing per Part 4.2

### Phase F — 5-cell contextual prompt (1 day)

Unchanged from v33.

### Phase G — Email capture + Tesseract Research sender (2-3 days)

Unchanged from v33 except:
- Sender stays Tesseract Research per founder
- Six-email nurture sequence drafted against Part 3 lexicon
- ConvertKit API integration

### Phase H — Analytics + measurement (0.5 day)

Unchanged from v33.

### Phase I — Premium-peek rotating teaser (1 day)

Unchanged from v33.

### Phase J — Underused-data expansion (rolling)

Unchanged from v33.

### Phase K — Account dashboard + watchlist (2-3 days)

Unchanged from v33.

### Phase L — Custom-icons spike (1-2 weeks, after launch)

Unchanged from v33.

### Phase M — Image-import phase 2 (1 week, after launch)

Unchanged from v33.

### Phase N — Research-finding regression suite (NEW, 1 day)

A pre-merge gate that runs every audit script in Part 5 AND
asserts the following research conclusions encoded as tests:

- `tests/research/no_more_than_2_trust_signals.test.ts`
- `tests/research/no_padlock_icons.test.ts`
- `tests/research/no_99_pricing.test.ts`
- `tests/research/no_trial_copy.test.ts`
- `tests/research/no_money_back_copy.test.ts`
- `tests/research/no_contact_sales_tier.test.ts`
- `tests/research/no_countdown_timers.test.ts`
- `tests/research/no_confirmshaming.test.ts`
- `tests/research/annual_framing_shows_total.test.ts`
- `tests/research/blur_radius_within_bounds.test.ts`
- `tests/research/cell_page_four_thing_reveal.test.ts`
- `tests/research/cancellation_copy_present.test.ts`

Any test failing blocks merge. These tests embed the
research findings directly into CI — drift from the
research-locked plan becomes impossible without explicit
opt-out.

---

## Part 7 — Quality-check regime (discrepancy + truncation gates)

### 7.1 Prebuild-time gates (run on every `npm run build`)

- Existing gates (taxonomy, em-dashes, source-agencies,
  dead-links, featured-tiles, render-guards, deepening) —
  unchanged
- NEW: `prebuild-monetization-coverage.ts` — fails if any
  page in 5.4 matrix has a red cell
- NEW: `prebuild-microcopy-lexicon.ts` — greps for any
  CTA / pill / modal copy that is not in Part 3 lexicon,
  fails if found

### 7.2 CI-time gates (run on every PR)

- All Phase N regression tests
- Playwright walk: cold-visitor flow on 20 random cell pages
  + pricing + compare + calculator. Asserts at each step:
  (a) page renders, (b) the locks visible match the expected
  catalog, (c) the modal opens on lock click, (d) the modal
  copy matches Part 3 verbatim
- Lighthouse perf check on `/`, `/pricing`, and three random
  cell pages (regression cap: no more than 5% LCP increase
  vs main)

### 7.3 Pre-merge human review (founder)

- Screen-share walkthrough of the per-page matrix report
- Founder signs off on the `coverage/monetization-coverage.html`
- If any cell flipped red, hard block

### 7.4 Post-deploy smoke (production)

- Smoke script hits 10 random cell URLs in production, asserts
  the lock primitives are present in the rendered HTML
- Slack-alert if any smoke fails

---

## Part 8 — Anti-pattern register (hard "do not ship" list)

Encoded as failing tests in Phase N. Repeated here for the
founder's reference:

1. NO padlock icons on lock pills (use the word Basic / Premium)
2. NO blur radius > 6px (perceptual torment threshold)
3. NO more than 2 trust signals on the paywall modal
4. NO .99 / charm pricing
5. NO "Contact sales" / opaque enterprise tier
6. NO free trial copy anywhere on the site
7. NO money-back guarantee copy
8. NO countdown timers, scarcity counters, "X people viewing"
9. NO confirmshaming on cancel / dismiss buttons
10. NO auto-trial-to-paid conversion
11. NO non-refundable trial fees
12. NO required credit card to preview anything
13. NO hidden auto-renew language
14. NO "Upgrade now" / "Unlock now" generic CTAs
15. NO mid-content modal interrupts on mobile (use bottom-sheet)
16. NO orphan locks (every lock must have a defined click handler)
17. NO leaked values (a Premium number rendered in DOM as
    plain text without proper gating attributes)
18. NO half-built tier branches (every gated section must
    implement all three tier states)
19. NO mention of the source-agency name (existing rule)
20. NO em-dashes in user-visible source (existing rule)

---

## Part 9 — Acceptance criteria for v34 to be considered "shipped"

Phase D (Stripe) remains parked. v34 is "shipped" when:

- [ ] Phase 0Q quality gates wired (audit scripts pass on
      every page in 5.1)
- [ ] Phase A primitives merged + visible in Storybook
- [ ] Phase B modal opens correctly on lock click across
      all 32 placements
- [ ] Phase C lock catalog wired on every page in 5.1
- [ ] Phase E pricing page reflects Part 4 matrix verbatim
- [ ] Phase F contextual prompt fires correctly
- [ ] Phase G email capture wired with Tesseract sender
- [ ] Phase H analytics events emit on every lock click +
      modal open + CTA click
- [ ] Phase N regression suite green on main
- [ ] Per-page matrix (5.4) all-green for every page in 5.1
- [ ] Founder signed off on `coverage/monetization-coverage.html`
- [ ] Post-deploy smoke green for 24 hours
- [ ] No regressions on existing prebuild gates

Phases D, I, J, K, L, M ship after v34 baseline lands.

---

## Part 10 — What remains as live experiment (not pre-decided)

The research reports are clear that some questions cannot be
answered from literature alone. We do not pre-decide these.
They become Phase H1 experiments once we have traffic:

- Exact blur radius (4 vs 6 vs 8 px) — within the 6px-default
  bounds we ship, the test is for visual feel only
- Lock-density per page (current cap = 4 cell, 2 ATF, 1
  mobile ATF) — test ±1
- Lock copy variant: "Compare with Basic" vs "See comparison
  with Basic" — A/B once Phase H is live
- Annual discount %: currently 16% (≈ $31/mo); test 10% / 20%
  later
- Modal sub-copy length (current = 4 lines); test 2 vs 4 vs 6
- Pricing-page tier order (current = Free/Basic/Premium L→R);
  test reversed
- "Most popular" badge on Basic vs no badge
- Mobile bottom-sheet height (current = 60vh); test 50/60/70
- Time-to-first-lock on cell page (current = below the fold);
  test ATF on returning visitors only

NONE of these run until Phase D AND Phase H are live AND we
have ≥30 days of baseline data. (Research conclusion 1B.9.)

---

## Part 11 — Founder open questions (must answer before Phase D)

These remain open from v33 + sharpened by v34:

1. Stripe account: confirm Tesseract Research will house the
   Margin Atlas Stripe entity, with separate product IDs.
2. Annual discount %: locked at 16% in v34. Confirm or change
   before Phase E ships the pricing page.
3. The "Anti-Trading-Economics callout" copy in Part 3.7 — is
   the tone right, or should it be softer / harder?
4. Watchlist cap on Basic: locked at 25. Confirm.
5. Geo pricing: deferred to post-90-day-data. Confirm
   deferral is OK (vs shipping PPP at launch).
6. Email sender domain: Tesseract Research per founder.
   Confirm subdomain or alias for clarity (e.g.
   `atlas@tesseract.research` vs `noreply@tesseract.research`
   with Margin Atlas sender name).
7. Phase L (custom icons): AI path or illustrator path? v33
   recommended AI Path A first; v34 unchanged.

---

## Footer note: where to start

After founder approval:

1. Ship Phase 0Q first (quality gates as no-op stubs)
2. Ship Phase A primitives (with the v34 RedactedNumber + GhostBar additions)
3. Ship Phase B modal with locked Part 3 microcopy
4. Ship Phase E pricing page with locked Part 4 matrix
5. Ship Phase C lock placements one page-pattern at a time,
   in order: cell → industry → city → calculator → compare → sector
6. Ship Phase N regression suite
7. Walk the per-page matrix (5.4) — fix every red cell
8. Phase G email capture
9. Phase H analytics
10. Founder sign-off, deploy, smoke

Stripe (Phase D) and the post-launch phases (I, J, K, L, M)
follow once v34 baseline is live.
