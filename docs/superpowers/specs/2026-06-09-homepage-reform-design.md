# Homepage Reform: Design (2026-06-09)

Status: DESIGN, from the 2026-06-09 founder interview (44-question quiz). Source of
truth for the homepage (`src/app/page.tsx`) content architecture. Architecture-first:
the existing look / graphics are reused; specific copy and number-tuning are deferred.
This pins WHAT the front door shows, in what order, and how a visitor moves through it.

Canon it sits under: the country + city reforms, `docs/design-system/GUIDELINES.md`
(tokens, layering), and the standing constraints (no em-dashes, no source-agency
names, no slug renames, tokens only, no-visibly-wrong-numbers).

---

## 1. Role and stance

The homepage is a **balanced tool-and-marketing front door, but the tool leads**.
Its number-one job is to get a visitor searching a business + place and landing
straight on its numbers. The marketing (how it works, who it is for, upgrade) lives
below for those who scroll. A longer page is fine if every section earns its place.

- **Voice:** confident, plain, a sharp analyst (the quiet-authority register the
  rest of the site uses).
- **Trust** is conveyed through DEMONSTRATED breadth (the world map + the range of
  real examples + the audience band), NOT a literal coverage counter and NOT a
  methodology lecture.
- **Mobile** leads with the search box; everything else stacks below.
- **SEO:** the hero H1 + copy target the head term (how much businesses make /
  small-business profit) so the page ranks.
- **No-visibly-wrong-numbers** holds: example-tile figures are REAL (resolved from
  live cells); the audience band names audience CATEGORIES (built on real early
  interest), not fabricated company logos or testimonial quotes.

---

## 2. New top-to-bottom order

1. Hero (eyebrow + rotating-question headline + subtitle + search) [above the fold]
2. Example tiles (the lead data hook, right under the search)
3. World map (the one secondary browse)
4. Easiest vs hardest places to start (the second data hook)
5. Depth proof (the neighborhoods panel)
6. How it works (3-step)
7. Who it is for / used by (the audience band)
8. Upgrade (free-vs-premium table + CTA to /pricing)
9. Blog ("from the notebook" rail, compact)
10. Newsletter (prominent, free-report lead magnet)

This is the authoritative order. The footer (browse links + methodology + the
newsletter bar) is unchanged below this.

---

## 3. Hero (above the fold)

- Eyebrow: "The #1 atlas of local profit intelligence" (kept).
- H1: the rotating question "How much does a [business] make in [city]?" (kept). The
  H1 server-renders a concrete question for crawlers (head-term SEO); the words
  rotate client-side.
- Subtitle: "Know if a business works before you risk your money" (kept).
- The search box sits immediately under, in the same band. First screen = headline +
  search only, nothing else above the fold.

---

## 4. Search (the lead tool)

Rework the navigator into a guided cascade:

- **Three fields, in order: country, then city, then business.** Picking a country
  narrows the cities; picking a city narrows the businesses.
- **Pre-filled with a rotating example** (e.g. a country/city/business already in the
  fields), so it never reads as a blank form.
- **Forgiving of loose / partial input** (e.g. "barber NYC" resolves to the closest
  match), not strict-dropdown-only.
- It lands the visitor **straight on the specific business-in-place page** (the cell),
  not an intermediate place page or a results list.
- The homepage **funnels through this search**; the world map is the ONLY secondary
  browse. No separate country/city/business browse rails on the homepage.

(The existing NavigatorForm is the starting point; this is an enhancement, sequenced
as its own sub-project because it is the interactive piece.)

---

## 5. Example tiles (the lead data hook)

Directly under the search, doubling as the "I do not know what to search" helper:

- **About six tiles.**
- Each shows **business + city + one real headline number** (e.g. "Restaurants in
  Barcelona, owner keeps about $X"). The number is resolved from the live cell, never
  invented; a tile whose number cannot resolve is swapped for one that can.
- **Curated, recognizable, familiar** examples (hand-picked, always-good), favouring
  relatable big examples over maximizing variety.
- Each tile links to that business-in-place page.
- This REPLACES the old pointed-question list (HOME_QUESTIONS).

---

## 6. World map

The clickable world map stays as the single secondary browse, below the example
tiles. Picking a country routes to that country page.

---

## 7. Easiest vs hardest places to start (the second data hook)

Keep the live break-in beat: **two short ranked lists, the 5 easiest and the 5
hardest places to break in right now**, resolved from the same data the /extremes hub
and the cell mastheads use. Self-omits when both ends cannot resolve.

---

## 8. Depth proof

Keep the "drilled to the neighborhood" panel: three real districts (flagship cities)
with their economic character, resolved live from the neighborhood scheme. Proves the
data reaches neighborhood resolution. Self-omits below three districts.

---

## 9. How it works (new)

A compact **3-step explainer: search, see the numbers, decide.** Three simple steps
showing the flow from a query to a decision. Tokens only, no new graphics.

---

## 10. Who it is for / used by (new)

A band naming the audiences Atlas serves, framed as **"who it is for"** (built on real
early interest, NOT fabricated company logos or testimonial quotes). Four prestigious
B2B categories:

- Private equity + investors
- Marketing / growth agencies
- Management consultants
- Founders + operators

Honest form: it names audience categories, so it carries no fabricated endorsement.
If real named references / press land later, they can be added; until then it is the
audience read, not invented social proof.

---

## 11. Upgrade (new)

A **free-vs-premium mini comparison table** naming what premium unlocks (deeper
numbers, exports, comparison), with a **clear upgrade CTA pointing to /pricing**. Ties
the homepage to the monetization work (the pricing page exists; Stripe is dormant
until activation). No checkout from the homepage, the CTA is /pricing.

---

## 12. Blog and newsletter

- **Blog:** the compact "from the notebook" rail of recent posts, near the bottom
  (kept, compact).
- **Newsletter:** a MORE prominent email capture to close, offering a **free
  benchmark report** (a lead magnet, e.g. the existing /download/2026-benchmarks
  report) in exchange for the email.

---

## 13. Cuts, adds, keeps (summary)

- **Cut:** the editorial thesis line (WhatAtlasWeighs); the earnings/gym leaderboard
  data beat (MoneyBeats); the pointed-question list (HOME_QUESTIONS, becomes tiles).
- **Add:** the curated example tiles; the 3-step how-it-works; the who-it-is-for
  audience band; the free-vs-premium upgrade table + CTA; the free-report newsletter;
  the country -> city -> business search cascade.
- **Keep:** the rotating-question hero + the "#1" eyebrow + the subtitle; the
  search-led funnel; the world map (secondary); the easiest/hardest beat; the depth
  proof; the blog rail.

---

## 14. Decomposition and sequence

Strictly sequential, each its own plan, shipped + Vercel-verified + screenshotted
before the next (the city/country reform discipline):

1. **SP1, cuts + reorder + example tiles** (mostly existing data/content): cut the
   thesis + the earnings leaderboard; build the ~6 curated example tiles (real
   numbers from live cells) to replace the pointed-question list; reorder the page to
   section-2's order. Highest-visibility, lowest-risk, shippable soonest.
2. **SP2, the marketing band** (new sections, mostly copy + the upgrade link): the
   3-step how-it-works; the who-it-is-for audience band; the free-vs-premium upgrade
   table + CTA to /pricing; the prominent free-report newsletter.
3. **SP3, the search cascade** (the interactive piece): rework the navigator into
   country -> city -> business with a rotating pre-fill and forgiving input. Its own
   sub-project because it is the interactive component change.

---

## 15. Open items for the sub-specs

- The exact six example businesses + cities (curated), and which headline number each
  tile shows (owner take-home vs typical revenue) for the cleanest resolution.
- The precise copy for the how-it-works steps, the audience band, and the
  free-vs-premium table (deferred copy polish, but the table's premium rows must match
  the real tier features).
- The search cascade's data source for the country -> city -> business lists + the
  forgiving-match behaviour (reuse the navigator's existing data where possible).
- Whether the newsletter lead magnet is the existing /download/2026-benchmarks report
  or a new gated asset.

---

## 16. Constraints honored

- No fabricated social proof: audience categories, not invented logos / quotes; tile
  numbers are real or the tile is swapped.
- No visibly-wrong numbers: real, modeled-and-labeled, or self-omitted.
- Tokens only, no raw hex; existing graphics reused (architecture-first).
- No em-dashes, no source-agency names, no slug renames.
- Tool-first, search-led; mobile leads with search; the page funnels to the cell.
