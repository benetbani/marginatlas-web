# Design-sourcing research prompt (for a web research model)

Paste everything below the line into a strong web-research model (one that can browse).
It is written for the machine, not for a human reader. It will ask clarifying
questions first, then return a costed, citation-backed sourcing report.

---

## ROLE

You are a senior design-systems and front-end tooling analyst. Produce a
decision-grade, citation-backed sourcing report. Be exhaustive and technical;
assume the reader is an engineer. Every pricing claim must cite the official URL
and the date checked. Flag any price you cannot confirm from an official source as
"UNCONFIRMED". Use USD (note the original currency if a tool prices in another).

## PRODUCT CONTEXT (the thing we are sourcing FOR)

- **Product:** Margin Atlas (marginatlas.com), a global small-business benchmarks
  site. Statistic-heavy pages that answer "how much does an X make in Y": the
  number, the structural reason, an honest read. ~191 countries, 180+ industries,
  5 locked page types (cell, country, city, neighbourhood, home), each with a fixed
  section order that any design must preserve.
- **Stack (a hard integration constraint):** Next.js 15.5 (App Router / RSC),
  React 19.2, TypeScript 5 strict, Tailwind 3.4, shadcn-ui (current), Radix,
  lucide-react, visx 3.x + d3 + Observable Plot available, Framer Motion. Fonts:
  Newsreader (display) + Inter (sans). A warm OKLCH design-token system already
  exists (terracotta accent, cream, ink, cocoa, moss; semantic tier/delta scales).
- **Aesthetic target:** warm editorial "almanac" with a CLEAN, DATA-DENSE core.
  Data-journalism chart references: FT visual vocabulary, Our World in Data,
  Datawrapper. One loud accent only; tabular figures on all data.
- **Operating model (critical):** the FOUNDER selects/composes the design (in a
  tool, or by choosing pre-made blocks); an AI engineer then PORTS the result 1:1
  into the existing stack and wires real data. The founder is NOT a designer but
  has a strong aesthetic eye. Past failure mode: the AI inventing visuals from
  scratch produced slop; and the repo carried five competing design directions.
- **Goal:** ONE professional, buyable/subscribable SOURCE OF TRUTH to standardize
  on. Optimize for: (1) instant professional quality, (2) minimal translation cost
  into the existing React/Tailwind/shadcn stack, (3) suitability for dense,
  data-heavy editorial pages (not just marketing), (4) a single coherent system
  (no mixing), (5) transparent current pricing.

## THE THREE LAYERS TO SOURCE (treat separately)

1. **Section / block patterns** , the page compositions (hero, stat strips,
   comparison blocks, pricing-style tables, editorial layouts). The main gap.
2. **Design-to-code origination** , a tool the founder uses to compose/customize a
   page that exports clean React + Tailwind (ideally shadcn) for the engineer to
   port. The pivot depends on this.
3. **Data-visualization grammar / kit** , how a benchmark number, distribution,
   comparison, timeline, or small-multiple gets drawn. Specialized; most block
   libraries do NOT solve this.

The UI shell (buttons, cards, nav, tokens) is already solved by shadcn + the token
system. Do not re-recommend a base component primitive library unless one is
clearly superior for this case.

## STEP 1 , ASK CLARIFYING QUESTIONS FIRST

Before researching, ask me up to 8 clarifying questions for anything below that is
unspecified, then proceed once answered:

- Budget ceiling, and shape: one-time purchase vs monthly subscription vs one-off
  hire. A rough number.
- Willingness to hire a designer vs stay fully DIY/buy.
- License needs: commercial use is required; is redistribution of source needed;
  number of seats.
- Is Figma already in the workflow, or should the tool be standalone?
- Target date to have a standardized system in use.
- Preference between PROMPT-based design tools (e.g. v0) vs CANVAS-based ones
  (e.g. Subframe / Figma).
- 3-5 reference products or sites whose look/feel the founder admires (URLs).
- Tolerance for generative-AI-in-the-loop (some tools generate; that reintroduces
  some "AI invents" risk the founder is wary of).

## STEP 2 , RESEARCH AND DELIVER

For EACH candidate below, research its CURRENT (2026) state from official sources
and report: official link; what it is; **exact current pricing for every tier**
(price, billing cadence, seats, what is included, free tier); **license terms**
(commercial use, can the founder ship exported code, redistribution); React 19 /
Tailwind 3.4 / shadcn compatibility and translation cost; code-export fidelity (for
design-to-code tools); **data-dense-editorial suitability** (explicitly: is it good
for statistic-heavy pages, or only marketing pages?); maintenance/health (last
release, ownership changes, discontinuation risk); and 2-3 real example sites or
products using it.

Evaluate these named candidates (research current state, do not assume), and add
any strong option not listed:

- **Design-to-code:** Subframe; v0 by Vercel; Figma Dev Mode + Anima +
  Builder.io Visual Copilot.
- **Block / section libraries:** Tailwind Plus (formerly Tailwind UI, incl.
  Catalyst); Untitled UI (React + Figma); shadcnblocks.com; Tailark; Origin UI;
  Aceternity UI; Magic UI.
- **Data-viz kits:** Tremor (confirm current 2026 ownership/OSS/paid status and
  maintenance); Recharts; Nivo; visx; Observable Plot; Chart.js.
- **Chart references (free):** FT Visual Vocabulary; Our World in Data / grapher;
  Datawrapper.
- **Hire path:** realistic 2026 USD ranges for (i) a contract product/UI designer
  delivering a design system + 3-5 page designs in Figma, (ii) a small studio
  engagement, (iii) premium React/Tailwind dashboard/SaaS/editorial templates
  (Cruip, ThemeForest, Tailwind Awesome, etc.). Where to source designers (Contra,
  Dribbble, Toptal) and the tradeoffs.

## STEP 3 , SYNTHESIZE

- A one-paragraph headline recommendation.
- A comparison TABLE per layer (block / design-to-code / data-viz) with a Price
  column and a "data-dense suitability" column.
- **2-3 complete recommended STACKS at different budget tiers** (e.g. "lean
  one-time", "subscription", "bespoke/hire"). For each: the exact tools, the
  itemized total first-year cost, the end-to-end workflow (how the founder produces
  a page and how the engineer ports it), and the single biggest risk.
- An explicit call on which candidates are genuinely fit for DATA-DENSE editorial
  pages vs which are marketing-only (most block libraries are marketing-only;
  say so).

Output the report in markdown. Lead with the recommendation. Cite every pricing
claim with an official URL + date checked.
