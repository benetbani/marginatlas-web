# The homepage, quiet editorial: the brand first, the atlas as a contents page (2026-10-13) Design

Project 3 of the owner's design goals of 2026-10-12, moved ahead of the London trade picker on 2026-10-13 at his word ("Homepage now").
The rhythm project (spec 2026-10-12-rhythm-air-inside-design.md) keeps building on its own branch; this page is designed now and built
in the next slot, on top of the rhythm branch's shared-component changes.

## 1. Intent

**His words (2026-10-13):** "The homepage talks about London and fails all the premises of what a homepage should include. Furthermore
the terracotta used in the background of that section is very light. Homepage is a total mess." Then: "It fails on establishing brand,
not elegant and slaps infographics which is soooo wrong at so many levels."

**His decisions (2026-10-13, in chat):**
- Reference: **quiet editorial** (think FT or Monocle): a confident brand line, lots of air, fine rules, serious type, the catalog laid
  out like a contents page, no charts.
- The top: **"The question with moving parts should remain, for the other things do as you choose, but position the page as #1 page on
  its own niche, above this H1 with moving parts, it is deeply needed."**
- The band: **one solid statement**: full-width brand terracotta at full strength, white type, one sentence, a link to the method.

**What the page is for (the premises he named):** say what Margin Atlas is and own its category; let a reader ask the site's question at
once; let them browse the whole atlas from the first two screens; say plainly how the figures are made and where to check them. Success:
a reader can name the site's category after the first screen, every catalog entry is reachable above the fold's second screen at 1280, and
no part of the page is a chart, a single city's story or a run of figures.

**What binds it (his standing rulings):** no country, city or trade-list count on the home (2026-10-07); no testimonial, press line, client
logo or byline (PRODUCT.md); every figure from its builder with its provenance, never typed; terracotta and neutral greys only; copy rules
(four-word headings, twelve words a line, no semicolon, no em-dash, never "modelled", "withheld" or "on file", no source-agency names, no
"we"); no carousel, pager, modal, drawer, toast, loader or filter chip.

## 2. The page, top to bottom

Today (research R3, E:/atlas/docs/superpowers/research/2026-10-12-design-goals/R3-home.md, section 1): the hero, London restaurants'
worked example, three proof cards with drawings, a pale terracotta band of four counts, UK city pay rows and the doors last. Three of five
zones are show-off and take half the page; the catalog is 14px grey rows two thirds down.

New order:

**1. The positioning line (new), above the question.** One statement that names the category Margin Atlas owns, set as a serious line
beside the compass mark, never a small uppercase kicker. It claims the category, not a rank: the site holds no ranking evidence and his
never-list forbids an invented credential, so no "#1", "most trusted" or "most used". **His pick (2026-10-13): "The reference atlas
of small-business earnings."** (The other candidate was "Small-business earnings, mapped across the world.")
The site-wide no-eyebrow rule gets one named exception for this element, his instruction of 2026-10-13.

**2. The question with moving parts (kept as built), and the picker.** The h1 "How much does a {trade} make in {place}?" with its red
words changing in place stays. The picker under it follows the question's current case until the reader touches it (no single default city).
The Try line that names London's trades goes; the definition line goes too (the positioning line carries it).

**3. The atlas, as a contents page (new): one section, six numbered departments.** A muted index 01 to 06, departments in two rows of
three at 1024 and up, one column on a phone, hairline rules between them, generous air. Each department has the same anatomy: its number,
its marks, a title of four words or fewer, one plain line of twelve words or fewer, three or four member rows, and an "All" door row. A
member row is one shape everywhere: mark, name, a figure only where the model requires one, an arrow.
- **01 Countries**: country flags; member countries chosen by a rule read from the code (the countries whose pages are most complete),
  never a hand-kept list; "All countries".
- **02 Cities**: the grey city photographs the site already holds; members by the same kind of rule (the cities whose pages carry their own
  figures); names only, no figure; "All cities".
- **03 Trades**: the trade pictograms; each member row carries the trade's own world-typical figure from the builder the trade's industry
  page uses (MODEL PART 9: a trade row carries its own figure), never one place's; "Every trade".
- **04 Tools**: the site's icons; Decide, Check, Calculator, Compare; "All tools".
- **05 Reading**: the three learn tracks (the knowledge base, linked from nowhere today) and the newest blog post; "All reading".
- **06 How it is made**: About the figures, Sources and licences, the corrections log, coverage; no count.
A seventh department for buyers comes with project 4 (the buyer layer) and is not built now.

**4. The band (changed): one solid statement.** Full width, the brand terracotta at full strength (not the pale tint), white type that
meets WCAG AA, one sentence on how the figures are made and one link to the method. No figure and no count. The page's one show-off.

**5. The colophon (new, replaces the two 12px lines).** A ruled block that gathers the licence line, Sources and licences, Report a
mistake, the corrections log, status and "Checked {date}", the date from the builder that prints it today.

**The Pro band** keeps its slot and its rule (drawn only while the paywall is on).

**Removed:** the worked example (HomeExample), the three proof cards (HomeProofs), the band's four counts (HomeRecord), the UK cities' pay
rows, and "Where to next" as its own list (its doors end each department). Each removed section's tests leave with it; a test of a removed
component that stays would test nothing (CLAUDE.md).

## 3. The look

Quiet editorial, from parts the site owns: the site's own typefaces (no new font), its figure style (tabular numerals), hairline rules,
the muted index, flags and trade pictograms as the marks, terracotta in four places only (the mark, the question's moving words, the
positioning line's mark and the band). Air follows the rhythm spec's in-section distances where the home shares components, and a larger
step between the page's parts. Phone first: every part reads as one column at 375 with the 16px gutter.

## 4. Laws and gates

- tests/trust/home_shape.test.ts and the home's LOUD_SEATS change with the new order (the band the one loud seat, the question's moving
  words as today).
- The no-eyebrow gate takes the named exception for the positioning line, with his words and date.
- The home reads under the type floor's rule (reader text 14 or larger), though the type-floor gate's scope is the spine pages.
- A gate for his ruling of 2026-10-07 already exists or is added: no country, city or trade-list count on the home.
- Departments are members of one section, so the rule that no two adjacent sections share a form does not apply inside it; the section's
  neighbours (the question above, the band below) differ in form.
- Every new string meets the copy rules; no source-agency name; no typed figure.

## 5. Verification

Before and after renders of the home, photographs at 1280, 768 and 375 (top, the contents, the band, the colophon), read by the implementer
and by the controller; the page laws, page holes, plain copy, readability, model laws and the paywall on the locked form; the whole chain and
the build; the built page seen with `next start`; after his deploy word, a production probe and photographs.

## 6. Out of scope

The buyer department (project 4), the London trade picker (project 2), the rhythm reform (project 1, in flight on its own branch). The
positioning line's final wording is his pick from the candidates above (or his own words) at spec review.
