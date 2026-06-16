# Web-research prompt — establish the visual ideology + resource stack for Margin Atlas

> Paste everything below the line into a powerful web-capable research model
> (one with live web search + browsing). It is self-contained: the model needs
> no access to our codebase. Its job is to search the live web and return a
> curated, install-ready resource stack plus a single recommended design
> ideology. Return real URLs, real repos, real install commands. No invented
> repos, no hallucinated packages, no dead links.

---

## ROLE

You are a principal product-design researcher and design-systems engineer. You
have deep taste in editorial design, information design, and data visualization,
and you know the current (2024–2026) open-source and commercial design ecosystem
cold. Your output will be used to lock a **single coherent visual ideology** for a
production web product and to **install the actual libraries** that realize it.
Be exhaustive but curated, opinionated, and concrete. Prefer currently-maintained
resources with permissive licenses. Verify everything you cite actually exists and
is active; if you are not sure a repo/package is real and maintained, say so
rather than inventing it.

## THE PRODUCT (full context — read carefully)

**Margin Atlas** (marginatlas.com) is a global small-business benchmarks product.
Every page answers one question — *"how much does an X business make in Y place?"*
— with three things: the number, the structural reason behind it, and an honest
read of the trade. Coverage spans ~191 countries and 180+ industries; it is free
to browse, with a paid tier for depth.

- **Register:** editorial + premium data product. It should feel like a trusted
  *almanac / reference work crossed with a modern data product* — warm, human,
  authoritative, calm. NOT a cold analytics dashboard, NOT a generic SaaS
  template, NOT chart-junk.
- **Audience:** professionals who must *trust the data and digest it fast* —
  private-equity and corporate analysts, agencies, founders, operators,
  journalists. They skim, they compare, they need hierarchy.
- **The pages are DENSE and multi-section.** A single business page carries ~18
  distinct sections in a fixed order: a revenue masthead with a distribution
  spread + an interactive "make it yours" calculator; an honest-take verdict; the
  number in tangible units; a full cost-structure P&L; "what moves the cost"
  levers; what the owner keeps; break-even; risks; pay-by-role; cost-to-open;
  seasonality; a realistic first-year ramp; same-business-in-comparable-places
  peers; operator voices; versus-the-world; a prose story; a one-line takeaway;
  related links; and a methodology/trust block. Country, city, and neighbourhood
  page types are similarly multi-section.
- **Stack:** Next.js 15 (App Router, React Server Components), React 19,
  TypeScript (strict), Tailwind CSS 3.4, server-rendered/static pages, Vercel.
  Charts must be **server-renderable** (work without client JS where possible)
  and **token-themeable**. Accessibility target WCAG AA. Must be legible at 1280
  and 375 with no horizontal scroll.
- **Current brand tokens (the starting point, open to refinement):** a *warm*
  palette — a terracotta / burnt-sienna red as the single loud accent, cream /
  warm-sand / parchment surfaces, warm brown-black ink text, a moss green for
  positive/"kept" values, amber reserved for caution only. Display type is a
  serif (Newsreader); body is a humanist sans (Inter). No raw hex in components
  (design tokens only). No em dashes in copy.

## THE DESIGN PROBLEM YOU ARE SOLVING

Our data pages currently **feel dense, undirected, and flat** — every element
competes for attention, there is too little hierarchy, too much is said in words
that should be shown as visuals, and the reader is not guided through the page.
It reads "artificial" and "bland," and it has drifted because the team has been
mixing several contradictory design directions instead of committing to one.

We need a **single, opinionated visual ideology** and the concrete resources to
build it, such that a dense ~18-section data page becomes **calm, guided,
skimmable, and beautiful** — with clear hierarchy, confident whitespace, an
unmistakable reading order, and *the right visual for each kind of statistic*
(distributions, breakdowns, thresholds, ranges, comparisons, time series,
sequences, severity), all inside one warm, editorial, premium brand.

## WHAT TO FIND (search the live web for the best in each category)

For each category, find the strongest **current, real, maintained** options.

1. **North-star reference products / sites** — the best-in-class examples that
   already solve "lots of dense data, made calm, guided, editorial, and
   beautiful." Look across: data journalism (e.g. the great interactive/editorial
   data desks), financial / benchmarking / comps products, almanac & reference
   works, "dashboard done right" products, and premium fintech/data brands.
   For each: what specifically they do well on hierarchy, density, chart choice,
   typography, color, and reading guidance — that we should steal.

2. **Open-source design systems & component libraries** (installable) that fit a
   Next 15 / React 19 / Tailwind 3 / TypeScript stack and a warm-editorial brand:
   token architecture, type scale, spacing/density philosophy, accessible
   primitives. Examples of the *kind* of thing (find the best + current): Radix
   Primitives, shadcn/ui, Base UI, Park UI, Vercel Geist, Tailwind UI, Catalyst,
   Ark UI, etc. Recommend which to actually adopt and why.

3. **Chart / data-visualization libraries** (installable GitHub repos) best for
   **server-renderable, token-themeable, editorial** charts in React/SVG —
   distributions, ranges, waterfalls/breakdowns, thresholds, ranked comparisons,
   time series, sequences. Consider the *kind*: visx, Observable Plot, Recharts,
   nivo, Tremor, unovis, Apache ECharts, D3 modules, layerchart, etc. Evaluate
   SSR support, bundle weight, theming, and editorial polish. Recommend the
   primary + fallback.

4. **Typography** — the best **serif-display + humanist-sans** pairings for a
   warm editorial data brand (alternatives to and including Newsreader / Inter),
   variable-font options, type-scale tools, and tabular-figures handling for data.
   Include where to get the fonts (Google Fonts / Fontshare / foundries) and
   licensing.

5. **Color & design tokens** — warm-palette systems, OKLCH-based palette
   generators and tooling, accessible-contrast tooling, and token pipelines
   (e.g. Style Dictionary, Radix Colors, Tailwind token patterns) that fit our
   "terracotta accent + cream/parchment + moss" direction.

6. **Layout, grid, density & hierarchy** — the canonical resources, patterns, and
   articles on making **information-dense, multi-section pages** calm and guided:
   editorial grids, vertical rhythm, scale/weight hierarchy, whitespace strategy,
   section-banding, and "one idea per band." Include the seminal information-design
   references (books, essays, talks) worth internalizing.

7. **Motion** (light, purposeful), **icon sets** (cohesive, editorial, outline),
   and any **editorial / data-viz inspiration galleries** worth bookmarking.

## CONSTRAINTS ON WHAT YOU RETURN

- Real, working URLs. Real GitHub repos with real `npm` / `npx` / `git` commands.
- Prefer MIT / Apache / permissive licenses; flag any that are restrictive or paid.
- Must be compatible with Next.js 15 (App Router/RSC) + React 19 + Tailwind 3 +
  TypeScript. Flag anything that is React-18-only, client-only, or fights SSR.
- Prefer maintained-in-2024–2026 projects; note last-release/activity where you can.
- Be curated: for each category, a short ranked shortlist with a clear #1, not a
  dump of everything. Quality over quantity.
- Do not invent packages, repos, commands, or stars. If unsure, label it
  "unverified."

## REQUIRED OUTPUT FORMAT

### Part A — Resource catalog (grouped by the 7 categories above)

For **every** resource, return this exact block:

```
- Name: <name>
- Type: <reference site | design system | component lib | chart lib | font | token tool | article/book | icon set | inspiration>
- URL: <primary url>
- Repo: <github url, or "n/a">
- License: <e.g. MIT> · Maintained: <last activity / "active 2026" / "unverified">
- Stack fit: <Next 15 / React 19 / Tailwind 3 / SSR notes, or "reference only">
- Why it fits Margin Atlas: <2–4 sentences tied to our dense-data-made-calm,
  warm-editorial, professional-trust problem>
- Install: <exact command(s), e.g. `npm install @visx/visx`, `npx shadcn@latest add ...`,
  `git clone ...`, or "n/a — reference only">
- How we'd use it: <1–2 lines, concrete to our page types>
- Priority: <must-have | strong | optional>
```

### Part B — The recommended ideology (synthesis)

A single, opinionated **Margin Atlas Visual Ideology** drawing on the best of what
you found:
- The one-sentence design thesis (the feeling + the principle).
- The grid + density philosophy (how a dense ~18-section page is made calm and
  guided — banding, rhythm, hierarchy, whitespace, reading order).
- The type system (display + body + scale + tabular figures), with the fonts.
- The color + token law (the warm palette, the single accent, the semantic roles).
- The chart language: which chart type maps to which kind of statistic, and which
  library renders them.
- The 3–5 north-star products this ideology is most inspired by, and exactly what
  we take from each.

### Part C — The adopt-list + combined install plan

The **5–10 resources we should actually adopt** (the minimum coherent stack), in
priority order, with a single combined, copy-pasteable install block (npm/npx/git)
for the Next 15 + React 19 + Tailwind 3 project, plus a one-paragraph note on how
they fit together without conflicts.

### Part D — Open questions / tradeoffs

Anything where you would need a human decision (e.g. "serif-forward vs
sans-forward," "single chart lib vs visx-primitives," license tradeoffs), framed
as a short either/or with your recommendation.

---

Be thorough, current, and concrete. The goal: someone can read Part B, run Part
C's install block, and start building a coherent, world-class, warm-editorial,
data-dense product the same day.
