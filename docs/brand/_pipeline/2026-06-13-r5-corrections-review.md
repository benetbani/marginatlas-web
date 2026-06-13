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

## Shipped in wave 2 (Parts 5, 6, 8, run as two multi-agent workflows)

### Part 6: one card grammar, one type scale
- Every page's section cards now route through the single BeatCard primitive (city, country,
  industry, neighbourhood), so the card hand, eyebrow size, and heading treatment stop drifting.
- The legacy city blocks (break-in strip, signature panel, peers) are pulled onto the kit
  heading scale + rhythm, so they no longer read as oversized leftovers.
- The neighbourhood page now opens with the same AnswerFirstMasthead as every other type.
- A light two-step elevation: the honest-take and money-breakdown read one depth above the
  resting cards (kept within the flat SaaS look, no seam).
- Grammar: "How a restaurant makes money" (no double noun, parentheticals stripped); the live
  "a expensive area" / "a East London read" bugs fixed with an a/an helper; the industry H1
  ends in a full stop like the others.

### Part 5: answer-first order
- The honest-take box now leads the body on the country page too (it was buried under the
  decisive read), and is always-present on every type.
- Thin countries open with a real headline number (days-to-start / registration cost /
  self-employed share) instead of a blank anchor.
- The country cost-to-register figure no longer prints twice (the formation table folded under
  the decisive read), and the best-city callout is renamed so it stops colliding with the
  activity break-in panel.
- The neighbourhood lift breakdown is scoped + captioned so a single-trade decomposition no
  longer reads as the whole-ranking explanation; the city visitor-split bar accents the
  dominant resident slice, matching the copy.

### Part 8: the 375px mandate
- The signature spread renders a legible HTML compact view on a phone instead of ~5px SVG
  labels; the desktop SVG is unchanged.
- The comparison tables (both the kit table and the /compare grid) reflow into stacked labeled
  lists below sm, so the primary content is never behind horizontal scroll.
- A real mobile nav exists (a token-built hamburger menu); the dead mobile folder that pulled a
  banned icon dependency is deleted; the sticky in-page nav no longer collides with the header.
- /compare now lands on a real, server-rendered default matchup (no more three empty dropdowns
  on first paint or for crawlers).

## The preview
A Vercel preview of the R5 branch (reform-v2/r5-corrections) is built from this wave. The remote
build runs the full 31-gate suite + tsc + every page, so it is a true end-to-end green check.
Production stays on reform-v2/palette-brick, untouched and held for your nod.

## Still to come (Parts 9 and 10, the forward architecture)
- **Part 9 (interaction):** sub-type + venue switching in the masthead, a make-it-yours
  calculator feeding the spread, save / compare-from-anywhere, gentle scroll reveal.
- **Part 10 (deepen):** operator voices + the raw-perspectives pipeline, myth-vs-reality
  generalized, the storytelling furniture site-wide, the comparison kit, the homepage brought
  onto the system, and the constitution amended to the flat SaaS look.
