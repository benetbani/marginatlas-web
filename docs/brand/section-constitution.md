# The Section Constitution

The fixed, standardized section set for every repeated page type on
marginatlas.com. This is the constitution: what each page type MUST contain, in
what order, no matter the country, city, or trade. It ends the per-page
improvisation and the per-graphic back-and-forth.

Authority order: this document is the human-readable law. `src/lib/page-sections.ts`
is the machine-enforced manifest. `scripts/verify_page_sections.ts` is the gate.
When they disagree, this document wins and the others are corrected to it.

---

## The five standing rules

1. **Fixed spine per type.** Every page of a type renders the SAME ordered
   sections. A reader who learns one country page can read every country page.

2. **Always present, never blank, never fabricated.** Every section renders on
   every instance. Real data where held. Where a figure is genuinely not held,
   the section shows a clearly-marked SAMPLE / illustrative state (muted, tagged),
   never a real-looking invented number, and never a blank. Long runs of unheld
   sections collapse into one calm "still filling in" strip, not a wall.

3. **Graphics are code, not hand-generated assets.** Each section is ONE reusable
   component (coded SVG + React), built once and reused on every instance, filled
   by data. Generated design assets are STYLE REFERENCE, ported into the component
   once, then reused everywhere. No section depends on a per-instance hand-made
   graphic.

4. **Data leads, opinion follows. Minimal text, one visual.** No prose walls. Each
   section is a short direct line or two plus its coded visual. Verdicts and
   opinions sit low, after the reader has the data.

5. **No silent change.** A required section is never removed, renamed, or
   reordered without a change to this document first. Removals are proposed here,
   never enacted in code first.

---

## How a place is judged: the nine lenses

A person deciding whether to start a business in a place runs through nine
questions. These lenses are the LOGIC behind the country and city spines, and the
order sections appear in.

| Lens | The question |
|---|---|
| Reward | If it works, what do I actually keep? |
| Cost | What will it cost me to operate? |
| Entry | How hard is it to get in and stay legal? |
| People | Can I find a team, and can I afford one? |
| Demand | Is there money here, and on what? |
| Edge | Is there an angle most people miss? |
| Risk | Will the ground hold under me? |
| Momentum | Which way is this place heading? |
| Path | Can I grow it, sell it, or walk away? |

---

## COUNTRY page spine (e.g. /gb)

The flagship. Organized by lens; the sticky nav lists the lens groups, not all
sections, so 20+ sections stay navigable.

**Opening**
1. **Hero** — the country engraving as a faded backdrop (no colour wash), the
   flag, H1 = the country name only, one fixed subtitle identical on every
   country: "What it costs, what you keep, and how hard it is to run a small
   business here."
2. **Scorecard** — eight headline metrics: GDP per capita, average salary, net
   wealth per adult, days to start, ease of doing business, minimum wage,
   population, cost of living. Real or tagged sample per cell.
3. **The country shape** — the nine-lens profile rendered as a radar / shape, the
   verdict at a glance (qualitative, never a single number; cities stay the only
   scored entity). [accepted #21]

**Reward + Cost**
4. **Cost and rules to set up** — tax, cost to register, payroll on-cost, time to
   start, as a compact stepper, not prose. [Entry]
5. **Where the margin leaks** — the country's cost signature: rent country, labour
   country, or tax country. [Cost]

**People**
6. **Hiring and the cost of a team** — wage floor, typical pay, and what a small
   team costs all-in (pay plus on-costs). [accepted #9]
7. **The talent reality** — can you find and keep skilled people, and the work
   culture. [accepted #19]

**Demand**
8. **Who has money to spend** — spending power and what locals spend on vs skimp
   on. [accepted #13]
9. **How far you can reach** — addressable market: density, delivery and
   e-commerce reach. [accepted #14]

**Comparison + Edge**
10. **Versus the neighbours** — like-for-like vs comparable neighbours on tax,
    pay, setup. No winner crown.
11. **The opportunity gap** — trades thin on the ground relative to the money
    around. [accepted #3]
12. **Same business, here vs abroad** — what an owner keeps here vs the best
    comparable country. [accepted #4]
13. **Special zones and structures** — free zones / regimes that change the math,
    only where they materially matter; self-omits otherwise. [accepted #5]
14. **Licences** — what you need to open one here. [Entry]

**Risk**
15. **The ground under you** — stability, rule of law, currency, and how much
    corruption actually taxes a small operator. [accepted #11]

**The place**
16. **Cities** — uniform, equal-weight city cards, no good/bad ranking, plain
    heading.
17. **Character** — culture, government, demographics.
18. **What locals know** — a short visual list, not a text wall.
19. **What your life looks like here** — the owner's lived reality: hours, stress,
    how relationship-driven business is. [accepted #20]

**Close**
20. **Versus the world** — the country vs a global median on one honest metric.
21. **The honest take** — small, low on the page.
22. **One quick gut-check** — three plain questions as a small visual.
23. **One thing to remember** — the warm closing line + freshness + flag-it.
24. **Related countries** — the compare CTA.

---

## CITY page spine (e.g. /cities/london)

Cities ARE scored (the Business Climate Score). Same lens logic, place-scaled.

1. **Hero** — city name, country flag, the Business Climate Score.
2. **Scorecard** — metro metrics: population, average salary, cost of living, net
   wealth, unemployment.
3. **Who the local customer is** — spending power. [Demand]
4. **What space costs** — commercial rent character. [Cost]
5. **Tourist money vs local money** — the visitor split. [Demand]
6. **What owners keep across trades** — the take-home read. [Reward]
7. **Best areas to set up** — which neighbourhood suits which business. [Entry]
8. **Neighbourhoods** — the drilled-down districts (clickable).
9. **How the city is changing** — real trend only. [Momentum]
10. **Rival and peer cities** — vs peers on the shared score.
11. **Operator voices** — what operators here actually say.
12. **One thing to remember** — the close.

---

## ACTIVITY-IN-CITY page spine (the cell, e.g. /gb/london/restaurants)

The most complete page: a business in a place. The masthead number IS the lead,
so the honest take may follow it directly.

1. **Masthead** — business + place + the anchor revenue with its spread.
2. **The honest take** — the one-line verdict.
3. **The story in plain words** — the narrative.
4. **In plain terms** — the number in tangible units.
5. **Where the money goes** — per $100 of revenue.
6. **What moves the cost** — the cost drivers.
7. **What the owner keeps** — take-home.
8. **Break-even** — the survival line.
9. **Pay by role** — wages.
10. **Cost to open** — itemized startup cost.
11. **Through the year** — seasonality.
12. **Your realistic first year** — ramp + break-even timing.
13. **The same business nearby** — like-for-like neighbours.
14. **Operator voices** — what operators say.
15. **What to watch** — the honest risk read.
16. **Versus the world** — the global anchor.
17. **One thing to remember** — the close.
18. **Related** — nearby businesses and places.

Plus, above the body: the make-it-yours calculator (the reader's own scenario).

---

## INDUSTRY page spine (e.g. /industries/bakeries)

1. **Hero** — the business type, leading with the verdict.
2. **A typical operator** — the average operator's shape.
3. **Where it earns most** — ranked across comparable places only.
4. **How the economics work** — the cost structure / margin anatomy.
5. **What moves the cost** — the cost drivers.
6. **Operator voices** — what operators say.
7. **Versus the world** — the global anchor.
8. **Go deeper** — links into the places + business pages.

---

## NEIGHBOURHOOD page spine

1. **Hero** — the district.
2. **Street by street** — the street character.
3. **What thrives here and why** — the businesses that do well + the real reason.
4. **Who lives and shops here** — the make-up + the customer.
5. **Cost to operate** — rent / price tier.
6. **Versus next door** — like-for-like vs adjacent districts.
7. **The businesses here** — the district's trades.
8. **Operator voices** — what operators say.
9. **One thing to remember** — the close.

---

## LEARN page spine ("how much does an X make")

1. **The question and the headline answer.**
2. **A worked example** — a real sample year, revenue minus each cost.
3. **The explanation in plain words.**
4. **Other businesses worth a look.**
5. **The live benchmarks** — into the real data.

---

## COMPARE page spine

1. **The two sides** — the matchup and the headline.
2. **The head-to-head numbers.**
3. **Where each one wins** — balanced, honest, never "this one is bad".

---

## DIRECTORY pages (/countries, /cities, /industries, /world)

1. **The world map** — the cities-of-the-world map as the hero, at the top.
2. **Search by name.**
3. **The grouped directory** — by region or sector, uniform tiles.
4. **Highlights** — a small curated set, never a vanity coverage counter.

---

## Enforcement

- The required ids per type live in `src/lib/page-sections.ts` and the gate
  `scripts/verify_page_sections.ts`. When this document adds a section, the
  manifest + gate are updated to match in the same change.
- Each section maps to one component in `src/components/kit/` (or a page-type
  folder). The component is the single implementation; instances differ only by
  data. The engraved style reference (the generated country/engraved asset set)
  is ported into these components once.
