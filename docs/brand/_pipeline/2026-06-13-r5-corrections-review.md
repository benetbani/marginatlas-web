# Round 5, 2026-06-13: corrections + advance (wave 1)

> The 10-part deep-audit plan you approved (`~/.claude/plans/linked-seeking-goblet.md`).
> Work is on branch `reform-v2/r5-corrections`, committed in verified waves. Production is
> untouched and held for your nod. tsc clean + all 31 prebuild gates green at every commit.
> A Vercel preview comes after the consolidation + mobile waves (so you review a coherent
> visual state, not a half-restructured one). Local dev DB is too slow to render the data
> tables reliably right now, so the data fixes are verified by gates + careful logic review.

## Shipped in wave 1 (Parts 1, 2, 3, 7, plus parts of 4 and 5)

### Part 1: the visibly-wrong numbers are gone
- The New York grocery owner clearing **$497K** (5x the next trade, an establishment
  aggregate leaking into a single-site take-home) no longer tops the city ranking. A
  common-sense guard dashes any take-home wildly out of line with comparable trades in the
  same city.
- The country "easiest to break in" panel no longer prints the **identical 97 / 95 / 94**
  scores for Uganda, Nepal, the UK and the Netherlands. On a modeled-tier country it now
  shows the ranking ORDER and the ease tone, without the false-precise number. (You said
  keep the panel; this keeps it, honestly.)
- The city Business-Climate score no longer saturates: London and New York are no longer
  both exactly 90.
- The country neighbour table drops its indefensible "typical monthly pay" row (Belgium $2K
  beside the UK/Netherlands $5K).
- The homepage no longer surfaces a "Hotels in Cancun, owner keeps ~$5K" tile beside
  six-figure ones (example tiles are floored at a sane owner take-home).
- A luxury neighbourhood (Westside) no longer crowns Pharmacies as its strongest trade: the
  headline activity set is now tag-aware (luxury leads with jewelry / fashion / spa).

### Part 2: the always-present contract is now real
- **Cost to open is always present** (a real block or a calm placeholder, with a working
  nav anchor) on every cell, including the London exemplar where it used to vanish entirely.
- The **London city page is no longer emptier than New York**: "what owners keep" and the
  break-in strip now fill from the curated London exemplar economics.
- Uganda no longer dashes "what the owner keeps" while printing "owner keeps $3" two cards
  above; the cost split is gated like the take-home.
- The City-of-London neighbourhood page no longer serves London's data verbatim: the doubled
  "City of London, London" name is fixed, the borrowed 13,000-firm count is dropped, and a
  square-mile district is no longer compared to whole cities.

### Part 3: empty states read calm, not like a TODO list
- The placeholder is now a **compact single row** with a quiet "Not held yet" tag, not a
  full-height dashed card.
- A run of three or more empty sections collapses into **one calm "still filling in" block**
  that lists the missing section names, while every section keeps its nav anchor. The thin
  cell page that stacked up to 18 dashed cards now leads with content.
- "How to read benchmarks" concept articles no longer force a worked-P&L / benchmark
  placeholder for a page that has no trade.

### Part 7: the accessibility floor (WCAG AA)
- Every interactive element in the kit now has a visible focus ring (there were none).
- Section eyebrows render at the 12px floor, not 10px.
- The banned opacity-faded grey text is retired for solid, AA-passing tokens; the
  meaning-bearing "not held" dash went from ~2:1 to ~9:1 contrast; the breadcrumb is fixed.

### Parts 4 and 5 (in progress)
- De-dup: the industry verdict no longer prints twice (honest-take box vs "how it makes
  money"); the learn body no longer reprints its own closing paragraph; the compare page's
  duplicate sub-headline is gone.
- Order: the masthead break-in chip now sits BELOW the headline number, so the figure leads.

## Still to come (next waves)
- **Part 5 rest:** honest-take always-present + first on every page type; a real headline
  number for thin countries; the compare page landing on a real comparison server-side; the
  neighbourhood lift breakdown scoped honestly; the visitor-split bar weighting the resident
  majority.
- **Part 6 (consolidation):** route every page's section cards through one card primitive
  (BeatCard), pull the legacy city blocks onto the kit scale, the neighbourhood page onto the
  shared masthead, one eyebrow everywhere, the a/an grammar fixes, a light elevation step.
- **Part 8 (mobile):** the signature spread legible on a phone, comparison tables reflowing
  to bar-lists instead of sideways scroll, a real mobile nav.
- **Part 9 (interaction):** sub-type + venue switching in the masthead, a "make it yours"
  calculator, save / compare-from-anywhere, gentle scroll reveal.
- **Part 10 (deepen):** operator voices, the storytelling furniture site-wide, the comparison
  kit, the homepage brought onto the system, the constitution amended to the flat SaaS look.

The Vercel preview will land after Part 6 + Part 8 so the whole surface reads coherently.
