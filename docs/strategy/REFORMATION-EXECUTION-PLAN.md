# Margin Atlas Reformation — Execution Plan

Status: AWAITING FOUNDER APPROVAL. Nothing builds or ships until the founder says go.

Authority: `docs/strategy/REFORMATION-BIBLE.md` is the project bible. Every page, module,
score, and line of copy traces back to a section of it. When this plan and the bible
disagree, the bible wins.

This plan was set by the founder's 10 answers:

1. **1-b** keep every existing page live for SEO; deeply rebuild the flagship templates first, the rest catch up over time.
2. **Entity + Country + Industry** are the priority templates.
3. **Hide our lack of strength** never display an apologetic "thin data" badge. Weakness is omitted gracefully, not advertised.
4. **Build real proprietary scores now** the 0 to 100 banded scores ship from day one.
5. **Forget paid** free editorial pages only this round. No auth, no Stripe, no paywall, no "unlock" CTAs.
6. **The bible is the maximum reference.** Saved in-repo, cited per page.
7. **Stay on this stack** Next.js + Supabase + Vercel. No platform migration. v0 dropped (it was founder homework; I build components directly).
8. **Warm, cozy, terracotta, lifestyle feeling** not cold SaaS-tech, but still delivering huge value.
9. **Opinionated voice** the blunt, skeptical register from bible Section 25.
10. **One perfected page per category, under 10 total.** Market choice delegated to me (pick least-problem data).

---

## 0. Operating model (how we work now)

Three standing fixes, applied as method, not as one-off tasks:

- **Fix 1 — Preview-first verification (the reliability unlock).** The 8 GB local box OOMs on
  data-heavy routes. We stop depending on it. Every page ships to a **Vercel preview URL** on
  real infrastructure. The founder opens the link on a phone and replies one line. Previews are
  also the "dry-run + show" step required before any render or data change goes live.
- **Fix 2 — Locked warm design system.** One token pass, one component kit, built once.
  Everything reads from tokens. No page invents a color, size, or shadow. This is what removes
  "I am not a designer" from the loop: the system carries the taste.
- **Fix 3 — Flagship-first.** Perfect the entity page (Restaurant in a city) to a high bar,
  get sign-off, then fan the same language out to the other categories.

Role split: I act as project manager, designer, and engineer. The founder is hands-off, having
given the taste anchor (warm/cozy/terracotta/high-value). The founder only sees preview links
and gives one-line approvals or redirects.

Guardrails honored throughout: no em-dashes, no source-agency names in copy, tokens-only (no raw
hex/px/ms in components), mobile-first, backend kept solid, no autonomous builds without
permission, all existing pages stay live, no slug renames, no desktop screenshots, paid layer
untouched.

---

## 1. Scope — the perfected page set (under 10)

One flawless instance of each core category. Each maps to bible sections.

| # | Category | Route | Drives from bible | Wave |
| - | -------- | ----- | ----------------- | ---- |
| 1 | **Entity (industry + city)** FLAGSHIP | `/[country]/[geo]/[industry]` | S6 (29-module blueprint), S10 scores, S25 voice | 1 |
| 2 | **Country** | `/[country]` | S5 country page, S3 friction view, S10 scores | 2 |
| 3 | **Industry** | `/industries/[industry]` | S5 industry page, S4 angles, "business model anatomy" | 2 |
| 4 | **City** | `/[country]/[geo]` | S5 city page, S5 opportunity, S12 loops | 2 |
| 5 | **Home** | `/` | S25 homepage copy, S5 portal, S14 IA | 3 |
| 6 | **Compare** | `/compare` | S5 comparison page, "where margin goes" waterfall | 3 |
| 7 | **Calculator** | `/calculator` | S8 break-even + owner take-home, S4 unit economics | 3 |
| 8 | **Sectors index** | `/sectors` | S5 directory, S14 industry directory | 3 |

Pricing page is excluded this round (answer 5). All other live routes (world, cities index,
countries, coverage, methodology, learn, blog, decide, check, browse, sub-cells) stay live and
unchanged; they adopt the new system in a later pass.

---

## 2. The "Warm Atlas" design system (Fix 2)

The current tokens deliberately drained warmth: `cocoa` was "retokenized from warm browns to
neutral gray," and "warm sand / amber" were "retokenized away." The terracotta direction simply
reverses that drain. This is a contained, high-leverage change to one file plus the CSS variables.

**Palette (intent; exact OKLCH tuned at build, all values become tokens):**
- Surface: warm sand / paper. Page `#faf4ec`, card `#fffaf3`. Replaces cold white.
- Ink: warm near-black brown `#2b2118` for headlines, warm graphite `#5b5043` for body. Replaces pure black/gray.
- Primary accent: terracotta `#bd5b38` (surfaces) / deeper clay `#9a4527` (text + headline). An earthier, calmer descendant of the old loud vermillion.
- Supporting warmth: soft clay, muted olive/sage `#7e7d56` as the cool counterweight, warm taupe border `#e7dccb`.
- Semantics stay meaningful: positive = warm moss, negative = clay-red, but reseated into the warm field.

**Typography:** keep Newsreader serif for headlines and the single hero number (editorial warmth
is already there); keep Inter for data and body legibility. Larger, more confident serif display
sizes. Generous line-height.

**Texture:** soft warm-tinted shadows, generous whitespace, rounded but not bubbly radii, an
optional faint paper grain on hero bands. Atlas + financial briefing, reread as cozy not clinical.

**Deliverables:** rewrite `src/lib/design-tokens.ts` warm families (names preserved, so consumers
do not churn); update the `globals.css` CSS variables; tailwind config inherits automatically;
refresh the `_design` catalog page as living proof of the system before any real page ships.

---

## 3. The value engine (backend — answer 4, plus the "huge value" half of answer 8)

This is where the product earns trust. Built before the visuals.

- **Scoring engine — new `src/lib/scores/`.** The MVP five from bible S10/S17/S21:
  Local Profitability, Rent Pressure, Market Saturation, Owner Take-Home, Founder Opportunity.
  All 0 to 100, displayed in bands (80+ strong, 60-79 workable, 40-59 mixed, 20-39 weak, under 20
  avoid), **no decimals**. Computed from data we actually hold (cell economics, country-industry
  economics, cost structure, firm distribution). Each score is methodology-backed and has a
  "how we calculate this" basis recorded.
- **The "hide weakness" policy in code (answer 3).** One presentation rule, applied everywhere:
  show a **range** when a number is modeled (range width scales with uncertainty, so honesty lives
  in the width, not in a scarlet badge); **omit** a module or score entirely when inputs are below
  threshold (graceful silent omission, the existing canonical pattern); **never** render a "thin
  data / low confidence" label. Strength shown, weakness hidden.
- **Voice engine — new `src/lib/copy/`.** Opinionated, context-aware verdicts and microcopy from
  bible S25 ("never say 'great opportunity' without saying what can kill it"). Generates the hero
  verdict, the weak/strong/expensive-market lines, the "what kills weak operators" cards. Runs
  through the no-em-dash and no-source-agency constraints automatically.
- **Reused accessors:** `getCellBySlug`, country economics (`resolveEconomics`), firm distribution,
  `blendBandsToAllSizesRevenue` (the locked all-sizes fix). Add the small math the modules need:
  break-even, owner take-home after local tax, rent/wage sensitivity.

---

## 4. Wave 1 — the flagship entity page

Template: **"Restaurant in [city]: margins, costs, competition, owner take-home, and whether it
still works"** (bible S6). This page sets the visual and editorial language for everything after.

**Market choice (answers 6 + 10):** the bible's showcase is Lisbon. I validate Lisbon restaurant
data depth first; if it is thin enough to force visible weakness (which answer 3 forbids), I fall
back to the US metro with the strongest measured data for the showcase instance. The *template* is
identical either way; only the first reviewed instance differs. Founder can veto the pick.

**Module set (bible S6's 29, filtered to free-only + scores-now + hide-weakness):**
- Hero verdict (opinionated one-liner + the headline numbers as ranges)
- Profit snapshot (revenue, gross, operating, net as ranges)
- Owner take-home ("can it support an owner?" with the local-tax math)
- Cost structure waterfall (payroll, COGS, rent, utilities)
- Break-even mini (sales needed per month / day)
- The five scores, banded, with one-line component explanations
- Competition density, rent pressure, demand mix, seasonality, survival outlook
- "What kills weak operators" failure cards, "what strong operators do"
- Works elsewhere / related cities / related industries
- Each module renders only if its data clears threshold; otherwise it silently drops.

**Preserve (non-negotiable):** `generateMetadata` (title, description, canonical, og, twitter),
the `getCellBySlug` + variants + `withBudget` fan-out, neighborhood dispatch, `notFound()` on miss,
structured data, the URL slug, and every edge case (US measured path, missing-data cells, all geos).

**Build order:** backend (scores + copy + math) first, then the warm mobile-first render, then
desktop. Self-critique against the design laws (/impeccable, /ui-ux-pro-max) to a high bar before
the founder sees it. Ship to a Vercel preview URL. Founder reviews on phone. Iterate on one-line
feedback until it is the page that defines the site.

---

## 5. Waves 2 and 3 — fan-out

Same system, same engine, same loop. Each page gets a short module spec drawn from its bible
section, a preview URL, and a one-line approval.

- **Wave 2 (high-intent trio): Country, Industry, City.**
  - Country: business climate, tax/wage/friction view, top industries, the scores rolled up. Bible S5/S3.
  - Industry: "business model anatomy," margin range, cost structure, best/worst cities. Bible S5/S4.
  - City: best and hardest businesses here, demand, rent, competition, rankings. Bible S5.
- **Wave 3 (the rest): Home, Compare, Calculator, Sectors.**
  - Home: the hero promise ("Know if a business works before you risk your money"), search, top cards, methodology trust strip. Bible S25/S5/S14.
  - Compare: side-by-side economics with the "where margin goes" waterfall. Bible S5.
  - Calculator: break-even + owner take-home, the strongest free interactive hooks. Bible S8.
  - Sectors: the directory done as an editorial index, not an alphabetical dump. Bible S14.

---

## 6. Quality gates (every page, every deploy)

All must pass before anything is pushed:
- `npx tsc --noEmit` clean.
- `npm run prebuild:serial` all 25 gates green (no-em-dash, no-source-agencies, plausibility,
  cost-share invariant, layering, typography, render-guards, hardcoded-hex, and the rest).
- Self-critique against the design laws; mobile at 390 px verified on the preview; a11y AA
  (contrast, heading order, tap targets >= 44 px).
- Data sanity: no NaN, no undefined, no absurd numbers on a sample of real cells.
- SEO preserved: titles, canonical, structured data present; zero slug renames.

The Vercel preview URL is the founder-facing proof at each step.

---

## 7. Deploy and rollback

- Scoped commits, pushed to `main`. Vercel builds remotely (the 25 gates run again there).
- Monitor to **Ready** (not Error). Remote build only, never a local `npm run build`.
- Verify live via the preview loop on marginatlas.com.
- Rollback: prod stays on the last good deploy on build failure; on a live defect, one
  `git revert` + push. The old design is always one revert away.

---

## 8. Sequence and cadence

1. **Design system + flagship** (Wave 1). This is the big one: it sets the language. Founder signs off here before anything else moves.
2. **High-intent trio** (Wave 2): country, industry, city.
3. **The rest** (Wave 3): home, compare, calculator, sectors.

Build to a high bar, deploy a preview, get a one-line approval, move to the next. Once the
flagship language is approved, the fan-out runs with maximum autonomy and minimum interruptions.

---

## 9. Explicit non-goals (guardrails restated)

No paid / auth / Stripe. No new thin pages. No slug renames. No deleting or hiding existing pages
(breadth stays live). No autonomous builds without the founder's go. No em-dashes or source-agency
names. No desktop screenshots. No platform migration.

---

## 10. What I need to start

Just **"approved, go."** Optionally one reference image if the founder has a look in mind;
otherwise I design to the bible's warm direction. After that, the founder only sees preview links.
