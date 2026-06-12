# Fable autonomous run, 2026-06-12: founder review pack

> You said "Fable, go, more SaaS, less newspaper" and left for a few hours. Here is
> everything that happened, what to look at, and the three decisions waiting for you.
> Production was NOT touched; everything lives on `reform-v2/palette-brick` + previews.

---

## The one-paragraph summary

The site moved from flat newsprint to a layered product surface, site-wide and in one
coherent system: a barely-warm app ground (cream-75), white cards seated on it with soft
two-layer warm shadows, 16px radii, serif reserved for headings and numbers. The flagship
business page, the homepage, the country page, and the industry page all speak it (the
city board inherits automatically). On the way there the foundation got fixed: the design
tokens now carry the SaaS surface layer, every stale off-palette hex in the repo was
conformed to the warm tokens, the font showcase is live for your display-face decision,
and the US wrong-industry bug (legal-services rendering software numbers) is root-caused
and fixed with dry-run evidence. Seven commits, each independently revertable.

## The preview

A second preview with the complete run deploys at the end of the session; the first
validated preview (all 29 gates + tsc green, everything except the final glyph commit):

    https://marginatlas-web-twtl-co1az82ef-benets-projects-3110e8e1.vercel.app

(needs the protection-bypass header or your logged-in Vercel session; the final preview
URL is in the session terminal output.)

## What to try (in order)

1. **The flagship cell page**: `/us/california/legal-services` on the preview.
   It now shows real Legal Services data (it used to silently show Software development),
   and the page is a card stack on the warm ground. Also try `/us/california/restaurants`
   and a non-US cell.
2. **The homepage**: the navigator card, tiles, and bands now sit on the warm ground.
3. **The font showcase**: `/dev/font-showcase`. Five voices, one identical page.
   Scroll, feel, pick.
4. **A country + an industry page**: `/de` and `/industries/restaurants`.

## The three decisions waiting for you

1. **The display face.** /dev/font-showcase renders Newsreader (current) against
   Fraunces, Literata, Besley, Source Serif 4. My read, for what it is worth: Fraunces
   is the boldest signature, Literata the safest upgrade with the best numerals.
   The swap is a one-line `--font-display` change once you name it.
2. **Ship call on this branch.** Everything is commits on `reform-v2/palette-brick`;
   `git push origin reform-v2/palette-brick:main` ships it. The US industry fix alone
   is worth shipping fast (it corrects silently-wrong numbers on live URLs).
3. **SP3 + HP-v2 Pass A** (from before this run) are still parked and now sit ON the
   new surface system; retry them on the preview before deciding.

## What changed, commit by commit

| Commit | What |
|---|---|
| de9315ec | Tokens: warm app ground (cream-75), layered warm elevation scale exposed as `shadow-subtle/card/lift/modal`, cards back to 16px (reverses the 2026-05-26 "not SaaS" radius), body onto the ground, design-system.md amended in the open (Article 4, §3.1, §7) |
| 8b941759 | Stale-palette sweep: every functional banned hex in src/ + public/ conformed (30 files): old burnt-orange ramps, cool greys, blue/teal strays, hardcoded Newsreader props, the motif SVGs, the OG image, the welcome email |
| 4b6f2499 | Font showcase at /dev/font-showcase (SAMPLE-marked, noindex) |
| 2cf5f8a6 | **US wrong-industry bug fixed** (see below) |
| 1a9d26d2 | Flagship business page onto the SaaS surface (board system shared, so country + city boards inherit) |
| 14c22784 | Homepage onto the warm ground (home-* tones -> "paper") |
| c6788fe7 | Country + industry bespoke sections onto the card shell |
| a801bf01 | The ma- glyph families ported: 40 icons + 64 pictograms as typed React primitives (AtlasIcon / AtlasPictogram), accent bound to the vermillion token; all 104 on /dev/brand-glyphs |

## The US wrong-industry fix, in plain words

The lookup used to grab the single biggest row in the industry's NAICS-3 group, so
/us/california/legal-services rendered the biggest "541" row: software development. Same
disease in the naming layer (first-3-digits mapping). Now every candidate row is validated
against the requested industry's own name + keywords; specific rows beat sector
aggregates; sub-niches may inherit from a TRUE taxonomy parent; the curated proxy map
(pharmacy -> grocery) may NOT silently substitute anymore; and when nothing honest exists
the page gets a correctly-named modeled cell. Verified against live data
(`npx tsx scripts/audit/dryrun_us_industry_fix.ts`):

- CA legal-services: was the 541 aggregate (labeled software) -> now "Legal Services", $520K typical
- CA dental-practices: -> "Offices of Dentists" $546K
- CA hairdressers-beauty: -> "Hair, Nail, and Skin Care Services"
- CA independent-pharmacy: -> honest modeled cell (no real pharmacy rows in the group)
- CA sit-down-restaurants: -> "Full-Service Restaurants" (sub-niche inheritance, better than before)
- Controls (restaurants, software, trucking, real estate) all unchanged or improved

This was the blocker on the cross-trade comparisons, the search cascade, and the learn
deep-links. It is now ungated.

## Evidence

Screenshots (desktop + mobile, before/after) in `docs/brand/_pipeline/evidence/p1/`.
Pipeline state: `docs/brand/_pipeline/fable-state.md`.

## What did NOT happen (and why)

- **No production push.** Founder-gate discipline: high-stakes surfaces get your try first.
- **Spot illustrations + chart grammar (P1-06/07)** are queued, not done: the page
  overhauls you asked for took priority. (The icon/pictogram port DID land; see
  /dev/brand-glyphs.)
- **The /_design catalog gate 404s on local dev even with the .env.local ADMIN_KEY**
  (pre-existing; untouched sibling pages 404 the same way). The new glyph catalog
  section is in the page and compiles; verify on a deployed preview where the env is
  the real one.
- **Deeper template recomposition** (HonestTakeBox, AnswerFirstMasthead, the content-map
  reading order, the sub-type switcher) is P2 work with the kit; today's pass changed the
  surface language everywhere without touching data plumbing or section order (all
  prebuild gate contracts preserved).
- One small copy bug spotted en route, not fixed (out of scope): the decide page title
  reads "a restaurants" (`/decide/cafe/london`).

## Known notes

- The subagent/workflow session limit was hit early in the run; everything was done
  solo-inline. No quality impact, just pacing.
- A Vercel preview was deployed at the end of the run (the remote build runs all 29
  gates + tsc); the URL is in the session log / terminal output.
