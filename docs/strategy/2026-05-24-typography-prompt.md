# Research prompt — Typography for Margin Atlas

> Paste this whole block into a web-research-capable model. Expect a
> 3000-5000 word answer back. The deliverable is a small set of concrete
> font pairing recommendations with rationale, not a typography lecture.

---

You are doing focused research on **typography for Margin Atlas
(marginatlas.com)**. Only fonts. Not layout, not color, not anything else.
Stay on this question.

## What the site is

Margin Atlas is a small-business benchmark site. Every page is a country
× city × industry "cell" — e.g. *typical bakery in Lisbon, Portugal*.
Each page shows real numbers: median annual revenue, payroll, owner take-
home, distribution by decile, multi-year time series. Tables are dense,
numbers are large, comparisons are everywhere.

The audience is small-business owners, consultants, M&A advisors,
investors, and journalists. People who read the page seriously.

The brand reference is **editorial, refined, calm — Stripe-level polish
applied to small-business benchmarks**. Not a SaaS landing page. Not a
Gumroad page. Not Bloomberg-terminal density either. Think: *Financial
Times redesigned by Stripe*, *The Economist if it were a data product*.

## The current type stack (what's shipping today)

Two Google Fonts loaded via Next.js `next/font/google`:

- **Display:** `Newsreader` — warm editorial serif, used on `<h1>`,
  `<h2>`, `<h3>`, and the single hero number per page. Loaded weights
  400/500/600/700, normal + italic. Has display optical size cuts.
- **Sans / body / numbers:** `Inter` — used on body copy, table cells,
  card metadata, all number-in-table contexts. Loaded with `tabular-nums`
  enabled. Weights 400/500/600/700.

Tailwind tokens: `font-display` -> Newsreader, `font-sans` -> Inter.

## The problem to solve

The founder's verdatim feedback: *"The font of the most cards is quite
basic. And that doesn't feel good because it makes the whole thing feel
cheap."*

What this likely means in practice:

- The display serif (Newsreader) is doing well on H1/H2/H3 and on
  the single big hero number.
- The card-level typography (industry name, sector label, revenue
  figure, tier badge) is all Inter, and Inter is the default-feeling
  sans of 2026. It works but doesn't feel *bespoke*.
- The numbers in particular feel generic. A bespoke product with
  numbers as the core asset deserves numerical typography that feels
  intentional, not just "Inter with tabular-nums turned on."

The site already uses `font-feature-settings: "ss01" on, "cv11" on` on
body, which is a halfway-house attempt to make Inter feel less default —
worth noting but not enough.

## What I want from you

A focused research report that answers these questions in order.

### Section 1 — What "editorial-data" actually means typographically

Define the typographic vocabulary of editorial data products. Examples
in the wild to study:

- **Stripe** — single most-cited polish reference. What do they use, where,
  and why does it read as "the standard"?
- **Linear** — clean SaaS, strong tabular treatment.
- **Crunchbase** — data product with editorial aspirations.
- **The Financial Times** — gold standard for newspaper-style data.
- **The Economist** — same lineage.
- **Bloomberg.com** (consumer-facing, not the terminal) — extreme data
  density done editorially.
- **NYT Upshot** — data journalism reference.
- **Pitch** (the presentation tool) — opinionated type system.
- **Vercel docs / homepage** — current SaaS reference point.
- **Levels.fyi** — closest brand-shape comp to Margin Atlas.
- **Trading Economics** — data product, freemium.
- **Numbeo** — data product, free.

For each: identify the display font, the body font, the numeric font (if
distinct), and the role of each. Cite the actual font families. Do not
guess — inspect the live sites with browser DevTools and report what's
actually loaded.

End the section with a short essay: *what unifies the typographic feel
of editorial data products?* What separates the "cheap SaaS" feeling
from the "Stripe-level polish" feeling, *typographically only*?

### Section 2 — The numeric typography question

The single most important thing on a Margin Atlas page is the number.
"$510,200." "33.4%." Decile rows with five aligned figures. Time-series
charts with year labels and currency amounts. The numbers must feel
designed.

- What numeric-type features matter for a benchmark site? (Tabular
  figures, lining figures, old-style figures, monospaced digits, slashed
  zero, alternate currencies, descender alignment.)
- Which fonts have *deliberate* numerical typography vs which just have
  "tabular-nums" turned on as an OpenType feature?
- For the single hero figure (the big "$510M" at the top of each cell),
  what font choice would feel bespoke without crossing into novelty?
  Options to evaluate:
  - Serif with display nums (e.g. Tiempos Headline, GT Sectra Display)
  - Humanist sans with bespoke numerals (e.g. GT America Mono, Söhne
    Mono, Inter Display)
  - Slab serif (e.g. Roboto Slab, Tiempos Text in slab cut)
  - Geometric sans (e.g. Söhne, Founders Grotesk, Söhne Schmal)
- For table cells with dozens of aligned figures, what fits? (Probably
  a tabular-figure sans; recommend specific families.)

### Section 3 — Pairings

Recommend three to five concrete font pairings for Margin Atlas. For
each pairing:

- Display face (H1/H2/H3, hero number)
- Body face (paragraphs, card descriptions, table cells)
- Numeric face (if different from body)
- Rationale: what makes this pairing feel editorial, not cheap
- Whether it's free (Google Fonts, open-source) or commercial
  (Klim, Commercial Type, Pangram Pangram, Grilli Type, etc.)
- Estimated annual licensing cost if commercial, for a site projected
  to hit ~1-5M monthly pageviews
- Honest weaknesses of the pairing

At minimum include:
- One pairing using only free Google Fonts (current constraint).
- One pairing using Adobe Fonts (Typekit subscription, included with
  Creative Cloud).
- One pairing using a commercial foundry (Klim, Commercial Type,
  Pangram, etc.) where cost is the only barrier.
- One pairing that swaps the display serif (Newsreader is fine but
  is the right serif?).
- One pairing that introduces a third font specifically for numbers.

Rank the five from most-aligned with editorial-data brand to least.
Lead with your strongest recommendation.

### Section 4 — Specific element-by-element recommendation

Now make a concrete recommendation for each element on the current cell
page, in order:

1. **Eyebrow label** ("INDUSTRY · LISBON")
2. **Card sector label** (small caps, "CONSTRUCTION", etc.)
3. **Card industry name** (currently Newsreader, e.g. "Residential
   construction")
4. **Hero H1** (currently Newsreader, "United Kingdom")
5. **Page tagline** (currently Inter, the one-sentence subtitle)
6. **At-a-glance tile labels** ("Industries covered", "Cities ranked")
7. **At-a-glance tile values** (currently Inter, "60", "4", "$213M")
8. **Section headings H2/H3** (currently Newsreader)
9. **Paragraph body** (currently Inter)
10. **Table column headers** (currently Inter all-caps)
11. **Table number cells** (currently Inter with tabular-nums)
12. **Decile chart axis labels and bar labels** (Inter)
13. **Footer links** (Inter)

For each, specify: font, weight, size scale, letter-spacing, optical-size
axis if variable. Give Tailwind class names where helpful.

### Section 5 — Loading and performance

Practical constraints:

- The site is on Next.js 15 App Router with `next/font/google`. Cannot
  use commercial fonts without self-hosting and a license.
- Core Web Vitals matter (Vercel Speed Insights tracks LCP/CLS/INP per
  route).
- Pages must not have CLS from font-swap.
- Bundle size matters; loading 6 fonts with 8 weights each is bad.

For each recommended pairing in Section 3, describe the loading
strategy. Variable font vs static. How many weights. Subsetting. Display
strategy (`swap` / `optional` / `block`). Fallback stack.

### Section 6 — What to absolutely avoid

Anti-recommendations. Fonts and patterns that would actively damage the
brand:

- Monospace as a primary font (terminal feel, wrong)
- Geometric display fonts that read as crypto / startup (Avenir
  variants, Futura PT, etc.)
- Trendy variable-axis-marketing fonts (the "morphing" hero treatments)
- Anything that requires JavaScript for legibility
- Anything with poor numeral design (Open Sans, Lato, the early
  default-Google-Font era)
- Anything with weak tabular figures
- Display fonts at body sizes
- More than three families on one page

### Section 7 — Decision

End with a single, ranked, opinionated recommendation. Not "here are
options." A real call: *for Margin Atlas, ship X for display, Y for
body, Z for numbers, swap immediately, and here's why.*

## Quality bar

- Use browser DevTools on every reference site you cite. Don't guess
  what they're using.
- Specific font names, not categories.
- Real costs and licensing terms for commercial fonts.
- Be opinionated. The founder is asking for taste, not a survey.

Length: 3000-5000 words. Include a short appendix of every URL you
inspected with a one-line note on what's running.
