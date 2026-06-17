# 08 , Build sequence and QA

How the upgrade is built, in order, with the definition of done for each step.

## Two phases
- PHASE A (now, what we execute first): produce the six STATIC HTML page-type
  mockups for founder review. No app code changes, no server, no browser
  automation. Each is a self-contained `.html` openable by double-click. This is
  the cheap, reversible way to lock the visual direction.
- PHASE B (later, after the founder approves the direction AND Supastarter is in):
  port the approved compositions into the real Next.js app (on the Supastarter
  shell, Tailwind v4 + shadcn), wire live data, run the gates. Not started until
  Phase A is signed off.

## Phase A , the wave order
Foundation first, then one page per wave, hardest-and-most-exemplar first so the
system is proven on the richest page before the rest.

- WAVE 0 , Foundation (do once, shared by every mockup):
  1. Write the ONE token map (01 section 2) as a reusable `:root` CSS block +
     the Google Fonts link (Newsreader + Inter). This is the shared head of every
     mockup file.
  2. Decide the two genuinely-new chart treatments on paper: the wages
     range/dumbbell primitive and the ported seasonality area-gradient (single
     atlas series, stripped axes), plus the one site-wide vs-world ScoreBand.
  3. Confirm a small set of real shadcnblocks slugs to lean on (hero2,
     stats-card1, feature43, pricing2, cta10, navbar1, footer7, chart-card1,
     data-table1), fetched via the registry to study their exact markup.
- WAVE 1 , Cell (London restaurants). The flagship and the filled exemplar; it
  proves the whole system (masthead RangeStrip, money Waterfall, break-even gauge,
  wages range, seasonality area, first-year ribbon, the collapse strip). Spec: `05-cell.md`.
- WAVE 2 , Home. The commercial front door; proves the marketing/blocks side
  (hero2, the varied card grammars, pricing teaser, the calm panels). Spec: `02-home.md`.
- WAVE 3 , Country (United Kingdom). The densest page; proves the collapse strip
  at scale and the scorecard/radar/neighbours treatment. Spec: `03-country.md`.
- WAVE 4 , City (London). Proves the single-score hero + the peers comparison.
  Spec: `04-city.md`.
- WAVE 5 , Industry (Restaurants). Proves the verdict hero + the model anatomy +
  the cost-stack waterfall, no London fill. Spec: `07-industry.md`.
- WAVE 6 , Neighbourhood (London West End). Proves the relative-multiplier
  hero and the no-absolute-money discipline. Spec: `06-neighbourhood.md`.

After each wave: the founder opens the `.html`, reacts (closer / off, bolder /
quieter), we iterate on that one file to approval, then move to the next wave.
The Foundation token map and any shared primitive carry forward, so later waves
get faster and more consistent.

## Definition of done , each Phase A mockup
- Matches its page spec (02-07): every locked section present, in order; the
  recommended block/chart per section; the density and collapse rules applied.
- Tokens only (the `:root` map); one loud accent (atlas); no second loud color;
  no gradient text; no side-stripe accent borders; no identical card-grid repeat;
  no decorative animation.
- Honesty boundary holds: real or London/UK-exemplar data; unheld sections shown
  as the calm "still filling in" strip; never a fabricated real-looking number;
  no source-agency names; no em-dashes.
- Legible at 1280 AND 375, no horizontal scroll at 375, 44px tap targets,
  WCAG AA contrast, tabular figures on every number.
- Passes the four lead-designer questions out loud: sense / not-cringe /
  typography / can-it-be-quieter. If any fails, iterate before showing.

## Definition of done , each Phase B app port (later)
Everything above, plus the Verification Protocol (`docs/verification-protocol.md`):
- `npx tsc --noEmit` clean; `npm run prebuild` 31/31.
- `verify_page_sections` + `verify_section_order` PASS (no section dropped /
  reordered without changing the constitution doc first).
- The data honesty + like-for-like gates preserved (moneyShown, trusted-local
  link-gate, no cross-business-x-geography ranking, cities the only scored entity,
  districts never vs whole cities).
- Charts: nullable-in / silence-out, filled + empty states, server-renderable
  (any ported Recharts shape wrapped `"use client"` so SSR pages still prerender).
- SEE it (the founder opens the rendered page / a static export), then preview ->
  founder nod -> promote. All work on `reform-v2/r6-forward`; nothing to
  production before the single cohesive sign-off.

## Risk + rollback
Phase A touches no app code (only new `.html` files + the design-tokens-derived
`:root` block + optionally `globals.css` for the token map). Phase B is staged on
the branch and gated. Nothing reaches production without the founder's review.
