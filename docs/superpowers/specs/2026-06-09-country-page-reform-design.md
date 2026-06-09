# Country Page Reform: Design (2026-06-09)

Status: DESIGN, from the 2026-06-09 founder interview (30-question quiz). Source of
truth for the `/[country]` content architecture. Where it conflicts with older
notes, this wins. Graphics are deliberately out of scope: the existing table /
card / board look is reused as-is. This pass fixes the ARCHITECTURE of the
content (what is shown, in what order, at what altitude, routing) and the
correctness of which numbers belong here. Pixel polish comes later.

Canon it sits under: the city/neighborhood reform (`2026-06-08-city-and-neighborhood-pages-design.md`),
`docs/design-system/GUIDELINES.md` (tokens, layering), and the standing
constraints (no em-dashes, no source-agency names, no slug renames, tokens only,
no-visibly-wrong-numbers).

---

## 1. Role and stance

The country page is a **standalone decision surface**, not a thin router. It
answers, at country altitude, "can a person make a living running a small
business in this country, and what does it take to set up and run one here?" It
still routes down (every business and city is a link), but it is a destination in
its own right, the country-altitude sibling of the cell page.

Settled stances from the interview:

- **No headline score.** Cities stay the only entity with a single 0-100 headline
  score. The country masthead carries no score (the score strip stays empty).
- **One family with the city page.** Country and city pages share broadly the
  same shape and running order (numbers board, then verdict, then activities,
  then cities, then character, then compare), with altitude-specific differences
  where they earn it. A reader who learned the city page reads this one for free.
- **Most decisive read = tax + set-up friction.** The cost and difficulty of
  setting up and running a business is the read the page orbits, surfaced as a
  prominent early block.
- **Honest scaffold, no special thin state.** Every country renders the same full
  layout; a datum we do not hold shows as the board's dash. No separate
  thin-coverage page shape.
- **Keep the soft country photo** behind the masthead as atmosphere (self-omits
  when no photo resolves), exactly as today.
- **No worked example on the page.** The country page stays general; the worked
  "what an owner keeps" math lives on the business (cell) page it links to.
- **Scope boundary (stays on city pages, never duplicated up here):** per-city
  rent and commercial-street detail, neighborhood-level data, and city-by-city
  business rankings.

---

## 2. New top-to-bottom order

1. Masthead (photo + flag + name, no score)
2. The data board (leads, key numbers)
3. The verdict (fuller opinionated paragraph)
4. The set-up-and-run cost block (prominent)
5. Easiest businesses to start here (the one business ranking)
6. Cities (one section, best and worst highlighted)
7. Country character (demographics + culture + government)
8. Compare ending

This numbered list is the authoritative order. The subsections below are grouped
by topic for readability.

---

## 3. The data board (leads the page)

Keep the full board scaffold (every section and row always present, honest
dashes), but reform its contents:

- **Fill the currently-blank sections with modeled, labeled reads.** Institutional
  friction (bureaucracy, permits, enforcing contracts, inspection/bribery
  exposure) and the survival baseline are 100% blank today. As a decision
  surface, fill them with directional, clearly-labeled modeled estimates (the
  same "modeled" footnote treatment the cell board uses), so the lead reads full,
  not broken. Where a defensible modeled value cannot be produced, the row still
  dashes.
- **Add a demand / market-size section.** The board lacks any read of how big the
  market is. Add a demand-depth section (market size / customer base / purchasing
  power) so a would-be owner sees the size of the opportunity, mirroring the cell
  and city boards' demand section.
- **Consolidate the economics into the board, shown once.** GDP per capita,
  average salary, net wealth per adult, and self-employment currently repeat
  across the board, a separate 5-tile at-a-glance row, and (inflation) a separate
  strip. The board becomes the single home for these figures: the standalone
  5-tile at-a-glance row is removed, and its numbers live in the board.
- **Add minimum wage** (the wage floor for employing staff) and an
  **ease-of-doing-business-style rank** (a single summary of how business-friendly
  the country is). The rank is a reference figure shown as a board row, NOT a
  marginatlas headline score (it does not reintroduce a country score). Data note:
  the official ease-of-doing-business index was discontinued, so the source for
  this rank is a data-phase decision (a modeled composite or a successor index),
  flagged here and resolved when the numbers are sourced; the architecture slot is
  fixed now.
- **Drop inflation entirely.** Remove the price-stability board row AND the
  separate inflation strip. It is not central to a start-a-business decision.
- **Keep tax OUT of the board.** Taxes and registration live once, in the set-up
  cost block (section 5), not as board rows.
- **Align section vocabulary with the shared board** where natural (one family),
  so country, city, and cell boards read alike.

Resulting board sections (proposed): Demand depth, Labor and skills (wages, GDP
per head, minimum wage, skills), Market structure (self-employment, net wealth,
concentration), Institutional friction (modeled), Survival baseline (modeled).

---

## 4. The verdict

Keep the opinionated country read as a **fuller paragraph** (not trimmed to one
line), placed right after the board: where the money tends to be, the operating
reality that gets in the way, and the condition under which a business actually
clears a living wage. Pure synthesis from figures the page already holds; mounts
only when the synthesis produces real signal (unchanged self-omit rule).

---

## 5. The set-up-and-run cost block (prominent)

The decisive read, surfaced as a prominent early block (right after the verdict).
It shows the OWNER'S real cost burden:

- Corporate / business tax rate (effective on small-business profit)
- Days and cost to register a business
- Payroll / social taxes on staff (the added cost of employing people)

Sales tax / VAT is **demoted** (customers pay it, so it is secondary to the
owner's burden): shown as a quiet secondary line or omitted from the headline, not
led with. The **business-formation-costs-by-legal-tier** content folds into this
block (it is the same "what it costs to start" question), so formation costs are
no longer a separate section. **No worked example** here; a "see what an owner
keeps" link points down to the most relevant business (cell) page for the math.

---

## 6. Easiest businesses to start here (the one business ranking)

Keep exactly one business ranking: the activities ranked by how easy they are to
break in and win (the same 0-100 break-in score each business shows on its own
page). **Delete** the separate "most common businesses / where the money lands"
grid. About ten businesses, a clear shortlist, each a link down to its country-
level cell page. Self-omits below a few scored rows (unchanged honesty floor).

---

## 7. Cities (one section, best and worst highlighted)

**Merge** the two city sections (the top-cities row and the regions-and-cities
list) into one. The section **highlights the best AND the worst city to start a
business in** (using the city Business Climate Score), then lists the remaining
cities (grouped by region, as links). Every city links down to its city page.
No city-by-city business ranking here (that stays on the city page).

---

## 8. Country character

A supporting-context block (kept below the decision beats), carrying:

- **Demographics** as market context: population, share foreign-born, share of
  small businesses that are foreign-owned.
- **Culture-of-business read** (how formal / relationship-driven business is).
- **Government-from-a-business-owner's-desk scorecard.**

**Cut** the "what the country is commercially known for" / signature-industries
read (the business ranking already surfaces the real activities). The culture and
government reads keep their existing brand-token treatment.

---

## 9. Compare ending

End on the **compare-countries tool** (the existing "put {country} against its
peers" CTA to /compare). **No** "countries like this" peer suggestions (unlike the
city page, which got peer cities); the open-ended compare tool is enough here.

---

## 10. Cuts, merges, additions (summary)

- **Cut:** the most-common-businesses grid; the standalone 5-tile economics row;
  the inflation strip and the board's price-stability row; the second cities
  section; the "what it is known for" read.
- **Merge:** the two city sections into one; business-formation-costs into the
  set-up cost block.
- **Add:** modeled fills for the friction and survival board sections; a demand /
  market-size board section; minimum wage and an ease-of-doing-business rank; the
  best-and-worst-city highlight.
- **Keep:** the full board scaffold; the masthead photo; the fuller verdict; the
  culture and government reads; demographics; the compare CTA; no headline score;
  the same full layout with dashes for thin countries; everything routes down.

---

## 11. Decomposition and sequence

Strictly sequential, cheapest-and-highest-leverage first, mirroring the city
reform discipline (each sub-project ships fully, Vercel-verified and screenshotted,
before the next):

1. **Board reform** (no new external data for the consolidation): consolidate the
   economics into the board, remove the duplicate 5-tile row, drop inflation, add
   the demand section slot, and align section vocabulary. Highest leverage,
   shippable soonest against existing data.
2. **Redundancy cuts + reorder:** delete the most-common grid, merge the two city
   sections (with best/worst highlight), fold formation costs into the set-up
   block, reorder to the section-2 running order, cut the "known for" read.
3. **Set-up cost block:** corporate tax + registration + payroll taxes as the
   prominent block, sales tax demoted, the down-link to a business page.
4. **New data slots (data-phase):** modeled friction + survival fills, minimum
   wage, the ease-of-doing-business rank. These render only when their data lands;
   the slots are fixed by sub-projects 1-3, the numbers are sourced/modeled later
   (correctness of specific numbers is explicitly a later concern).

Each sub-project gets its own focused plan. Graphics stay as-is throughout.

---

## 12. Open items for the sub-specs

- The exact modeled basis for the friction index and the country survival baseline
  (which inputs, what plausibility bounds, how labeled).
- The source for the ease-of-doing-business rank (the official index is
  discontinued): a modeled composite vs a successor dataset.
- The precise demand / market-size metric set at country altitude (population,
  total consumer spend, purchasing-power proxy) without re-deriving GDP/salary.
- The exact placement of the set-up cost block relative to the verdict (both are
  "early"); lean verdict then cost block.
- Whether the board's section names rename to the shared vocabulary now or in a
  follow-up (slug/anchor stability check).

---

## 13. Constraints honored

- No headline score on countries; cities remain the only scored entity.
- No visibly-wrong numbers: real, modeled-and-labeled, dashed, or self-omitted.
- Tokens only, no raw hex; existing graphics reused (architecture-first pass).
- No em-dashes, no source-agency names, no slug renames on user-visible surfaces.
- Country and city pages stay one family; everything routes down.
