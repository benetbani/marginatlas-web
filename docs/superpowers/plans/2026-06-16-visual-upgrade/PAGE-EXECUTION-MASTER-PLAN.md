# Page Execution Master Plan (country, city, cell) , the anti-slop, high-craft rebuild

Status: DRAFT for founder approval, 2026-06-21. Built from the 30-question interview + the founder's detailed critique of the country/city/cell reform pages. This plan AMENDS the Execution Constitution where noted (chiefly: it replaces the "small set of 8 primitives" with a rich, data-mapped chart library). Nothing is built until the founder approves this plan.

Goal: stop delivering slop. Pages must be readable, exclusive, varied, alive, and pass a cringe test. Highest-end SaaS designer standard.

---

## A. The diagnosis (why the reform pages still read mediocre)
1. Too few chart types, repeated , the page is a "blast of horizontal bars and tables".
2. Arbitrary terracotta (e.g. Hospitality coloured for no reason) , emphasis on things that do not matter.
3. Broken hierarchy , mismatched sibling-card heights, lost section spacing, value huge / label unreadable.
4. Weak/cringe copy , vague, non-skimmable, non-exclusive, says nothing while sounding sophisticated.
5. Hero is detached , orphan numbers, dark gradient, contour lines that look bad, a non-exclusive "19%".
6. Premium hidden during build , the founder cannot review what he is designing.
7. No visual self-check , layout bugs (overlaps, clipping, slashed-zero font) ship because the builder never SEES the render.

---

## B. The Chart Library (rich, mapped to data) , AMENDS the "8 primitives" rule

We build a library of ~16 chart types. Variety is now PRINCIPLED: each kind of data has a defined chart (the decision table below). Rule: **max 2 of any one type per page.** Every chart still obeys the visual law (terracotta + cool greys, flat fills, direct labels, one baseline, mono numbers, aria + plain-text takeaway).

### The decision table (data relationship -> chart)
| The data is... | Use | Notes |
|---|---|---|
| One headline magnitude | Big stat (Space Grotesk) | label-first, value second |
| A 0-100 / score | Radial gauge or bullet | one per page |
| Composition (<=4 parts) | Donut or pie (hover) | one per page; key slice the only accent |
| Composition (ordered/linear) | 100% stacked bar | labels in-segment or direct |
| Ranking, few items | Horizontal bars | subject = accent, rest grey |
| Ranking/spread, many items | Dot plot / lollipop | lighter than many bars |
| Compare categories | Grouped/column bars (vertical) | the missing vertical bars |
| Change over time | Line, area, or period columns | |
| Two-point change | Slope chart | e.g. vs a peer, before/after |
| Distribution / spread | Histogram columns or dot strip | |
| Min / typical / max | Range bar with marker | |
| Value vs target/benchmark | Bullet bar | replaces many "diverging" hacks |
| Two variables | Scatter | sparingly |
| Flow / sequence / funnel | Funnel / stepped bars | revenue -> take-home, setup steps |
| Geographic | Custom minimal map | brand-toned |
| One entity, many axes | Radar | ONE per page (country profile showpiece) |
| Intensity over 2 dims | Heatmap / small-multiples grid | seasonality, by-area |
| Two-pole rating | Spectrum track + marker | character |
| Yes/no/status | Status table (check/word) | not a chart |

Cost-to-set-up specifically: use a **stepped funnel or a labelled range**, never the botched bar that was there.

---

## C. Universal execution rules
- **Equal-height sibling cards.** Cards in a row align to the same height. No exceptions.
- **Section spacing is a fixed token** (the `--movement` rhythm). Never collapses between sections (fixes the "no gap between Pay and Talent" bug).
- **One earned terracotta accent per section, max.** It marks the single most important thing. Everything else neutral. No decorative terracotta.
- **Number font: Space Grotesk** (clean round zero), tabular, medium 500, tight tracking. Retires Geist Mono (slashed zero rejected).
- **Alive:** crisp hover feedback on every interactive element + a few genuine interactive levers per page. (Donut and charts react to hover.)
- **Imagery:** tasteful data-art + maps where they add meaning; not decoration.
- **Footer:** richer multi-column (Explore / Product / Company / Legal). Real links, SEO value.
- **Hover must be clearly visible** (border + lift + background shift), not a 1px whisper.

---

## D. Copy & content law (kills cringe)
- **Point first.** Every line front-loads its conclusion; skimmable; detail follows.
- **The 4 claim gates , every section must pass ALL:**
  1. **Exclusive** , not Googleable in 5 seconds.
  2. **Specific** , real figures/facts, never "comfortable", "vibrant".
  3. **Says something** , informs a decision; no slop dressed as sophistication.
  4. **Skimmable in 2 seconds.**
- **The cringe test:** if a line mixes vague adjectives to sound sophisticated while telling you nothing (e.g. "brutal December to January and prime rent among Europe's cities"), it FAILS and is cut or rewritten to a concrete figure.
- **Voice:** plain + specific, the numbers lead. The trusted instrument.
- **Fewer, deeper, genuinely useful sections.** Cut filler; make survivors substantial.
- **Titles for normal people**, often as questions ("Can a foreigner open a business bank account?"). No "Getting in and getting legal", no "Will the red tape be in order".

---

## E. The Hero system (new)
- **Image breathes:** photo owns the top; a **white gradient rises from the bottom**; content sits on the lower ~50%. No dark left-to-right. **No contour lines in the hero.**
- **Numbers in ONE clustered stat card** (a compact table-card), tightly grouped, not spread orphans. **Label readable first, value second.**
- **Headline = Total estimated tax burden** (the exclusive metric). Big, label above it ("Total estimated tax burden").
  - **Definition (per country):** corporation/profit tax + property/business rates + capital gains + dividend tax. EXCLUDES employer payroll contributions (shown separately deeper) and customer-borne VAT/sales. One % figure per country, computed consistently. This is what separates UAE from UK/Germany at a glance.
  - No hero lever (keep it calm); the business-type breakdown lives deeper.
- **Kill the limp subtitles** ("stable and fast setup, but..."). The hero states the edge and the key facts, nothing decorative.

---

## F. The Quality Gates (two, both mandatory)
### F1. Section Quality Gate (per section, before it ships)
- Passes the 4 claim gates (D) + the cringe test.
- Right chart per the decision table (B); not a repeat beyond 2/page.
- One clear focal point; the right thing emphasised; terracotta earned.
- Equal-height with its row siblings; correct section spacing.
- Readable: label-first, no tiny unreadable titles, no overflow.
- Premium content VISIBLE during build.
### F2. Visual Self-QC pass (NEW , the missing step)
Before showing the founder, I **render the page, screenshot it (desktop + 360px phone), and review the actual pixels** myself: overlaps, clipping, alignment, mismatched heights, ugly fonts, cringe, emphasis errors. Fix, re-shoot, repeat until clean. (This is my own QC, not to make the founder wait. It is the fix for "you ship visual bugs you never saw".)

---

## G. The new COUNTRY section architecture (re-architected, fewer + deeper + varied)
Proposed spine for the gold-standard country page (each section: its job, its chart, why it is exclusive):
1. **Hero , the tax/cost edge.** Stat card + total-tax-burden headline. (stat)
2. **The tax & cost edge, broken down.** Components of the burden + vs 3 peers. (stepped/grouped columns + slope) , exclusive.
3. **Economic profile.** The radar, bigger, full words, numbers under each axis, no footer. (radar showpiece)
4. **Setting up a business.** Rich steps table (~60% width): step x cost x time x HOW (online/office). Legal structures beside it. Banking as a question card with skimmable points. (table + status)
5. **People & pay.** Pay by 4 levels (generous spacing, no random accent) + hire-ease + a TRUTHFUL talent read (which sectors are genuinely deep, with a real metric, not "34M speak English"). (columns + dot plot)
6. **Money & demand.** Where the economy's money is (clean, no arbitrary accent) + how households spend (donut, hover, "Dining" capitalised, bigger). (ranked bars + donut)
7. **Cost to run, vs peers.** Energy/rent/wages/tax vs peer average. (bullet bars) , exclusive comparison.
8. **Risk & exit.** Can the ground hold + can you get out. (range tracks + funnel/range)
9. **Cities.** Real city cards (photos). (cards)
10. **Character.** The two 6-spectra tables (rules + culture), markers, no footer. (spectra)
11. **Close.** Honest take + still-filling + gut-check. (text)

(Target ~10-11 movements, each deep. Drop anything that fails the claim gates.)

---

## H. Process & rollout
1. Write + approve THIS plan (founder reviews first).
2. **Country first, to gold standard.** I propose **2-3 hero directions** (to the E spec); founder picks.
3. Build the full country page to all rules; run F1 + F2 (visual self-QC); deliver polished (fewer, polished drops).
4. Founder signs off country as the gold standard.
5. **Clone the system to city, then cell.** They inherit the library, rules, gates.
6. Premium visible throughout; gating applied only at real launch.

---

## I. Concrete fix log (every flagged item -> the rule that fixes it)
- 8 orphan hero cards -> one clustered stat card (E).
- Hero contour lines -> removed (E).
- Dark left gradient -> white-from-bottom (E).
- Value big / label tiny -> label-first (C/E).
- "19%" non-exclusive -> total tax burden (E).
- Limp hero subtitles -> removed (D/E).
- Radar numbers at edges / abbreviations / footer / small -> numbers under labels, full words, no footer, bigger (G3).
- Cost-to-set-up botched chart -> stepped funnel/range (B).
- Bad titles ("getting in and getting legal", "red tape in order") -> mass-readable, questions (D).
- Tiny ugly bullets, non-skimmable -> point-first skimmable (D).
- Setup table small/disorganised -> ~60% width, add HOW column (G4).
- Experience level wrongly terracotta -> accent discipline (C).
- Pay numbers small, levels cramped -> bigger numbers, generous spacing (G5).
- Broken spacing Pay/Talent -> fixed spacing token (C).
- Talent misrepresentation ("34M speak English, deep in...") -> truthful talent read (G5).
- Financing section mediocre -> rebuilt to pass claim gates (D/F1).
- Where-money arbitrary terracotta + poor chart -> accent discipline + right chart (B/C).
- "dining in" lowercase -> capitalised; donut no hover -> hover; section too small -> bigger (G6).
- Horizontal-bar monotony -> rich library, max 2/type (B).
- Hover barely visible -> visible hover (C).
- Mismatched sibling heights -> equal-height rule (C).
- Premium hidden -> visible during build (F1/H).
- Cell payback chart errors + overlapping PREMIUM tag -> visual self-QC (F2) + tag fix.
- Slashed-zero font -> Space Grotesk (C).
- Poor footer -> richer footer (C).
- City cringe red-flags copy -> cringe test (D).
- Limited section typology -> rich library (B).

---

## J. For founder approval
Approve this plan (or mark changes), and I will: build **2-3 country hero directions** to the E spec for you to pick, then the full gold-standard country page through both quality gates. The chart-library expansion (B) and Space Grotesk (C) formally amend the Execution Constitution.
