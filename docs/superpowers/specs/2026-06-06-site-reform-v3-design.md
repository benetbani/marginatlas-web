# Site Reform v3 — Visual reset, Activities reform, Agency models, Solo policy

**Date:** 2026-06-06
**Status:** Design, pending founder approval to execute.
**Branch:** continues on `reform-v2/palette-brick` (already merged to main once; will ship in waves).

## Locked decisions (from founder)

1. **Backgrounds: pure white everywhere.** Remove every cream/dark section tone and the warm paper texture; the whole site reads white so the graphics carry it.
2. **Footer: true black** (currently near-black graphite `#2E2418`).
3. **Homepage hero:** push eyebrow + title + subtitle up; lift the navigator table and make it more readable.
4. **Cities directory (`/cities`): the world map goes at the very top**, above the breadcrumb/intro. (Not individual city pages.)
5. **Logo: keep** the current compass-rose wordmark (confirmed it changed May 24, from founder-supplied SVGs; no revert).
6. **Solo businesses: exclude by SHAPE, not headcount.** Drop inherently solo-professional-services (no overhead, really a wage); keep overhead-bearing businesses (shops, trades, food, care) even at 1 employee. Implemented via the per-activity `audience` tag, not a blunt employee cut.
7. **New activities: agencies (multi-person only).** Ship the 8 clean-industry-code agencies first; stage the ~5 curated ones second.

## A note that reframes the data work (important)

While verifying the revenue fix I learned the displayed wrong-looking revenue is almost never the raw mega-figure (those were already clamped to the industry ceiling `hi`). It is the ceiling value itself: a cell whose raw revenue is over `hi` clamps to `hi`, and for loosely-bounded industries that ceiling reads too high (e.g. management consulting `hi` = $30M, so a junk cell prints "$30M typical"). So the real lever for "no visibly-wrong numbers" is **tightening the per-industry bounds**, with the hi*3 dash as a backstop for the truly catastrophic. This is folded into Phase E.

---

## Phase A — Visual reset (fast, low risk, big impact)

- **A1. Section tones to white.** `src/lib/page-layout/section-order.ts`: change every `cream-50` / `cream-100` / `ink-dark` / `paper` entry in `SECTION_TONES` to `white`. One file controls all page backgrounds.
- **A2. Body to white.** `src/app/globals.css`: replace the cream-100 html background and the `--atlas-surface-paper` body color + compass-star pattern with plain white. Remove the texture.
- **A3. Footer black.** `src/app/layout.tsx` footer: graphite -> true black, keep white text.
- **A4. Homepage hero.** `src/app/page.tsx` + `NavigatorForm.tsx`: tighten `pt-6/mb-4/mt-4/mt-6` rhythm upward; lift the navigator; increase field size/spacing and drop the card's cream pattern so the table reads cleanly on white.
- **A5. Cities map to top.** `src/app/cities/page.tsx`: hoist `<CitiesWorldMap>` above the breadcrumb/intro so the map is the first thing on `/cities`.
- **Separation risk:** pure white removes the tint that separated sections. Replace with thin hairline rules / generous spacing / subtle shadows (tokens only), not tints, so sections stay legible.
- **Verify:** preview screenshots desktop + mobile of home, cell, country, city, `/cities`, activities; confirm uniform white, black footer, hero lift, map-on-top.

## Phase B — Activities page reform

- **B1. Categorize by sector.** `src/app/industries/page.tsx`: replace the flat A-Z grid with per-sector sections (mirror `countries/page.tsx` continent grouping) using `visibleSectors()` + `visibleIndustriesInSector()`. More activities in a sector -> more rows.
- **B2. Search bar.** Add a client search/filter over the activity list (filter-as-you-type, no backend).
- **Verify:** `/industries` screenshot, search interaction.

## Phase C — Solo exclusion by shape (data/taxonomy; dry-run + show first)

- **C1. Define the exclusion.** Identify the activities that are inherently solo-professional-services using the existing `audience` taxonomy field (and add a `solo_professional` flag where the existing tags do not separate it cleanly).
- **C2. Hide, do not rename.** Excluded activities drop out of nav, the activities page, and pickers; existing URLs are NOT renamed (SEO rule). Decide per-activity: hide entirely vs keep a thin page.
- **Dry-run + show:** produce the full list of activities that would be excluded and show the founder before anything changes (founder rule on data/render changes).
- **Verify:** the exclusion list, then the activities page + pickers.

## Phase D — New agency activities (research-backed)

**Wave 1 — clean industry codes (real public data, ship first):**
| Activity | Code | Notes |
|---|---|---|
| Managed IT services (MSP) | 541512 | gross ~52%, RPE ~$142k, per-seat retainer |
| Cybersecurity firm | 541512/541519 | split from generic IT (light curation) |
| PR / communications agency | 541820 | dedicated code |
| Advertising / performance-marketing | 541810 | best-covered marketing code |
| SEO / content-marketing | 541613 | sub-slice of marketing consulting |
| Branding / graphic-design studio | 541430 | dedicated code; watch solo low end |
| Web / app development studio | 541511 | very well covered |
| Video / podcast production studio | 512110 | dedicated code, clean data |

**Wave 2 — curated economics (no dedicated code yet; label modeled, like London):**
AI agency (541690 closest), creator/influencer agency, email/CRM/lifecycle agency, e-commerce (Shopify/Amazon) agency, UX/product-design agency.

**Borderline (mostly solo, default OUT under the Phase C policy):** UGC, generic SMMA, lead-gen, CRO, fractional-exec. Re-include only the explicitly staffed-firm version if desired.

- **Decision needed:** confirm the Wave 1 list + codes; confirm Wave 2 is staged.
- **Data risk:** modern-model margins are blog-sourced, not statistical; Wave 2 must be curated + labeled, never shown as precise (no-wrong-numbers bar).
- **Verify:** a few new activity pages on real vs curated data.

## Phase E — Data quality (continues the earlier audit stream)

- **E1. Finalize + verify the revenue suppression (C1).** Re-run the dry-run against RESOLVED page values (not raw rows) to measure true visible impact; confirm the >hi*3 dash fires on a real default-resolved cell.
- **E2. Tighten loose per-industry bounds** (`src/lib/qa/smb_bounds.ts`) so the clamp-to-hi shows a sane ceiling (mgmt consulting $30M etc. are too high). This is the real fix for the visible wrong numbers. Dry-run + show the before/after.
- **E3. Remaining audit items, staged:** currency-as-USD beyond Mexico (suppress non-MX local-currency band), wrong-industry remaps, extrapolated_cells size-band dedupe. Each dry-run + show; the band dedupe touches the DB + pipeline, off-peak.

---

## Sequencing + risk

- Ship **Phase A** first (pure UI, fast, reversible, high visual payoff), then B, then the data phases C/D/E which each gate on a dry-run + founder sign-off.
- All work stays on the branch with preview screenshots before any fast-forward to main.
- Hard constraints respected throughout: no URL renames, no em-dashes, tokens only, gates green.
