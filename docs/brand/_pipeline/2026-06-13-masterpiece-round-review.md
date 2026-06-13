# Masterpiece round, 2026-06-13: founder review pack

> Round 3, the masterpiece-bar rebuild. Autonomous run against your approved plan
> (`~/.claude/plans/linked-seeking-goblet.md`). One branch (`reform-v2/palette-brick`),
> production untouched, one Vercel preview at the end. Built the missing kit, rebuilt every
> page type on it, made London/UK the one fully-filled exemplar, fixed the data-sanity
> failures you named, then ran an adversarial QC pass and fixed what it found.

## The preview

    <PREVIEW_URL>

(open logged into Vercel, or with the protection-bypass header). The remote build runs the
full gate suite + tsc + all pages, so a green deploy is a real end-to-end check.

## What to look at first

- **`/gb/london/restaurants`** , the fully-filled London business exemplar. Answer-first
  masthead (the typical revenue with its 7-gradation spread), the honest-take through-line,
  then the whole content-map stack: where each $100 goes, break-even, pay by role, cost to
  open, the year's shape, your first year, the same business in nearby UK cities, what locals
  know, against the grain, myth vs reality, who it suits, a gut check, and a working sticky nav.
- **`/gb`** , the UK country exemplar. The decisive read (tax, register cost, payroll,
  time-to-start), how hard it is to hire, and the compare-to-neighbours FACTS table (UK vs
  Ireland, France, Germany, the Netherlands), side by side, never a money league table.
- **`/cities/london`** , the London city exemplar. Who the customer is, what space costs,
  tourist vs local, best areas, how the city is changing.
- **`/gb/london/city-of-london`** , a London neighbourhood. Who lives and shops here, the
  trades that lift, the districts next door.
- **`/industries/restaurants`** and **`/compare`** and a **`/learn/*`** article, the template
  pages: same kit, real data where it exists, honest self-omission where it does not.
- **`/dev/kit`** , the catalog of every kit primitive with sample data.

## The Uganda > Netherlands failure: fixed at the source

You named it: "supermarkets in Uganda make more than those in the Netherlands". The root cause
was surfaces that ranked or leader-marked raw USD across countries (where a figure is not
adjusted for local prices). Now every cross-place money surface routes through the trust gate,
or keeps US states and foreign countries in separate like-for-like cohorts:

- the compare API dashes revenue/take-home/wage for untrusted, extrapolated, or country-level
  cells (verified: Uganda and the Netherlands both dash; California $503K and London $720K
  keep theirs);
- the compare grid drops cross-country leader marks and shows a price caveat;
- the industry "where it earns most" ranks only the trusted US-state cohort;
- a new gate, `verify_cross_geography_guard`, fails the build if a surface ranks cross-country
  money without the gate.

## The nine workstreams

1. **Data-sanity** , the fix above, plus the dead cross-geo components deleted and the
   place-stable rankings (profit margins, saturation) relabelled so they no longer read as
   per-place measurements.
2. **The Atlas Page Kit** , the shared vocabulary that was missing: RangeStrip (the signature
   7-gradation spread), HonestTakeBox (the through-line), AnswerFirstMasthead, MoneyGoesBreakdown
   (per $100), the editorial beats, the data sections, the comparison grammar, a props-driven
   sticky nav, the freshness stamp and flag-it. Tokens only, self-omitting, cataloged at `/dev/kit`.
3. **Business/cell page** , rebuilt on the kit in the content-map reading order; London cells
   fully filled.
4. **Country page** , rebuilt; UK fully filled; the compare-to-neighbours table is the page's
   reason to exist and was the biggest gap.
5. **City page** , rebuilt; London fully filled; tourist-vs-local always present.
6. **Industry page** , thesis-first; killed the all-null cards; fixed a visibly-wrong $5.2M
   "typical restaurant" (the headline band now comes from the trusted US-state cohort).
7. **Neighbourhood / learn / compare** , rebuilt; the neighbourhood-cell unified onto the same
   kit; the worked P&L and spread on learn; where-each-wins on compare.
8. **Icon-family migration** , DEFERRED with rationale (see below).
9. **Craft + layered QC** , one card grammar site-wide; an adversarial QC pass; the gates.

## The QC pass and what it caught

A read-only adversarial review (one reviewer per page type) hunted for the things a sharp
founder would catch. It found, and this round fixed:

- an untrusted cell (Uganda) leaking a fabricated "$40 a head" and "1 cover a day" , now gated;
- a US cell whose old cached prose said $420K while the masthead said $503K , the stale prose
  is retired site-wide;
- hair-salons rendering an entire cleaning-services page , the misroute is fixed;
- thin-country pages showing an absurd "$16 a month" typical pay , suppressed below a floor;
- "Annual visitors 0M" on a sub-million city , fixed;
- a tourist-vs-local split mislabelled as money out of revenue , now an honest footfall share;
- "What makes United Kingdom, United Kingdom" , fixed;
- a "+200%" wall where six trades pinned to the model's ceiling , now an honest "2x or more" band;
- a raw "US-00" code in the across-states list , filtered;
- the compare grid showing empty all-dash sections on its default landing , now self-omits.

## Still open (flagged, next round)

- **Icon-family migration (WS8): deferred on purpose.** 30 files import the icon library, but
  almost all are functional UI chrome (chevrons, arrows, close, check) in disclosures,
  empty-states, mobile nav, billing. The `ma-` family is brand/domain pictograms, not chrome;
  forcing brand glyphs into chevron slots would look worse, and a wholesale swap risks 30 files.
  Your asset-usage ask is already met: the rebuilt pages deploy the spots, pictograms, the
  RangeStrip, and the cartographic motif throughout. A proper chrome-icon set is a separate task.
- A curated London cost-to-open note still reads "GBP 12 with Companies House" (a data row in
  the database, not the rendered template). Needs a data edit / re-import, not a design change.
- The neighbourhood-overview multiplier model still clamps hard (shown honestly as a band now);
  widening the model is a data task.
- The extrapolated country cells remain too noisy to rank by money; that is the Sonnet
  data-fill phase, not this Fable round.

## Verification

- Local gates green: em-dashes, source-agencies, cross-geography guard, section-order,
  layering, typography. Every rebuilt route smoke-checked 200 with no runtime errors.
- One Vercel preview at the end (remote build runs the full gate suite + tsc + all pages).
  Production held on the branch for your nod.
