# Page type: Home  (/)

## The one job
Answer one question on sight: "this tool tells me what a specific business actually makes in a specific place, with real numbers." The single focal point is the rotating Newsreader question headline sitting directly on top of the search navigator; everything below is proof that the search leads somewhere real.

## Locked section order

| # | section id | label | data source | realness | block / chart to use | highest-grade treatment |
|---|---|---|---|---|---|---|
| 1 | `home-hero` | Hero (rotating question + search) | `RotatingWord` over `HERO_BUSINESSES`/`HERO_CITIES`; `NavigatorForm` | real | `hero2` (heading + sub + a single CTA), navigator preserved verbatim as the in-band primary action | The page's one Newsreader moment. Centered, generous top air, no hero image, no second loud color. Question H1 at the largest step; one-line subtitle in Inter muted; search card floats just under, reading as one section. Tap targets 44px, no horizontal scroll at 375. |
| 2 | `home-featured` | Live example tiles | `loadExampleTiles()` (real take-home / revenue per cell) | real | Stats-Card grid (`stats-card1` shape, 3-up) of business-in-city tiles | Six to a 3-up calm grid. Each tile: business + city in Inter, one real headline number in tabular figures (the only place numbers appear this high). Quiet hairline cards, hover lifts border to atlas, no change-arrows (these are absolutes, not deltas). Self-omits below three. |
| 3 | `home-city-picker` | World map city picker | bespoke `WorldMapSection` | real | KEEP the bespoke `WorldMapSection` (do not swap for a block) | Full-bleed paper band, the map as a quiet exploratory surface, not a data viz. One accent only on hover/active pins. Generous vertical padding so it breathes after the dense tile grid. Caption is a plain invitation, no coverage vanity counter. |
| 4 | `home-featured` (state comparison) | State comparison | `loadStateComparisons()` (trusted-local US states, real revenue) | real (self-omits when thin) | KEEP kit `LikeForLikeBars` / `ComparisonBars` (the honesty rail is load-bearing) | Like-for-like bars, same trade across 3-4 US states, no winner crown, no cross-geography ranking. atlas-500 = the subject bar, neutral for the rest, direct end-labels in tabular figures. Whole section drops if it cannot resolve cleanly. |
| 5 | `home-cities-placeholder` | Neighbourhood proof cards | `loadNeighborhoodCards()` (real flavor data) | real (self-omits below four) | Gallery cards (3-up) from flavor data | Editorial card grid: district + city heading (Newsreader small), "known for" + one specific "don't miss" line + price-tier chip in Inter. No fabricated place detail. Calm, magazine spacing; this is texture/proof, not a stat block, so no numbers here. |
| 6 | `home-audience` | Audience band | `AudienceBand` (editorial, 4 roles) | editorial (real positioning) | Feature block (`feature43` icon grid, 4-up) | Quiet who-it-is-for row. One terracotta icon per card, Newsreader role name, Inter use-line. PE/consulting framed as clients, never subjects. This is the breathing "selling" beat, lower density than the data sections above. |
| 7 | `home-upgrade` | Pricing teaser | `UpgradeTeaser` (shared `TIERS` constant) | editorial (real prices) | three tier cards, `pricing2` mini, CTA to /pricing | Re-skin the feature-matrix subset as the calmer `pricing2` mini (Free / Basic / Premium), prices from `TIERS` so they cannot drift. No checkout. One CTA to /pricing. Tabular figures on prices; checks in moss, dashes in faint cocoa. |
| 8 | `home-blog-rail` | Blog rail | `getAllPosts()`, `BLOG_FALLBACK` with token gradient covers | real (fallback covers) | Blog/Gallery cards (3-up), `feature` gallery shape | Newsreader title per card, date in tabular figures, two-line excerpt clamp, token-gradient cover when no image. "All posts" as the quiet text link. Even rhythm, restrained. |
| 9 | `home-newsletter` | Newsletter / free report | `HomeNewsletter` + `LeadMagnetForm`; sample-report preview image | real | `cta10` / Banner panel + a sample-report preview image | White band close. Calm accent panel: Newsreader heading, three plain bullets, the lead-magnet form, and a real sample-report preview image (never a placeholder cloudfront slot). One CTA. The page's quiet exhale before the global footer. |

## Hero + focal point
The eye lands on the rotating Newsreader question: "How much does a [business] make in [city]?" with the two rotating slots in atlas-700. That is the ONE display-type moment on the page and the ONE hero "number-shaped" element (the question stands in for a hero number, since the homepage has no single canonical figure to crown). Directly beneath: the one-line Inter subtitle ("Know if a business works before you risk your money"), then the `NavigatorForm` search as the primary CTA/answer-path. No competing hero image, no second accent. First real numbers appear one section down, in the example tiles, so the hero stays calm.

## Density & rhythm
- Big and loud: the hero question (largest Newsreader step) and the world map band (full-bleed, the largest spatial beat).
- Medium, numeric: example tiles and state-comparison bars, the only two places tabular figures cluster, kept to 3-up so they read calm not dense.
- Quiet, editorial: neighbourhood cards, audience band, pricing teaser, blog rail, newsletter, all on generous padding (py-12/md:py-16+), lower contrast, fewer-but-bigger.
- Where it breathes: between every band via the full-bleed `ToneBand` paper grounds and the map's vertical air. Alternate dense (tiles/bars) with airy (map/audience/blog) so the page never stacks two stat grids back to back.
- Collapse rule: the home page is almost entirely real or editorial, so it does NOT carry a long run of unheld sections. The one structural risk is `home-featured` (state comparison) and `home-cities-placeholder` (neighbourhood cards) failing to resolve. When either resolves thin, it self-omits entirely (no stub). In the mockup, if both were ever to fail at once, the two would COLLAPSE into a single calm "More comparisons are filling in" SectionEmpty strip rather than two empty bands, but the default mockup shows them filled.

## Realness handling
- Real (shown filled): hero (rotating question + search), example tiles (real take-home/revenue, sanity-floored at $15K), world map, state comparison (trusted-local US revenue, distinct-values gate), neighbourhood cards (real flavor data), blog rail (live or token-gradient fallback covers), newsletter form.
- Editorial (real, not invented numbers): audience band (4 real audience categories, no fake logos/quotes), pricing teaser (prices from the shared `TIERS` constant).
- Placeholder behavior: there is no fake-number risk on this page. The two self-omitting sections (state comparison, neighbourhood cards) drop silently when they cannot resolve cleanly, exactly as the loaders already do. If a future state forced an empty band, it reads as one calm `SectionEmpty`: muted cream panel, a one-line "Filling this in" in Inter muted, no number, no skeleton, no "coming soon" stub. The newsletter's sample-report image must be a real preview render, never a placeholder image slot.

## The static-HTML mockup deliverable
A single self-contained `.html` (precedent: `london-prototype-v1.html`), Newsreader + Inter via one Google Fonts link, the section-2 token map declared in `:root`.

At 1280:
- Hero: hand-ported `hero2` markup, centered, with the rotating question rendered as a static "How much does a coffee shop make in Barcelona?" (one frozen frame, no JS rotation needed for the mockup) plus the navigator search bar as a static styled card.
- Example tiles: 3-up `stats-card1` grid filled with the real curated cells (e.g. "Restaurants, Barcelona", "Software developers, San Francisco", "Law firms, the UK") and their real headline numbers in tabular figures.
- World map: a faithful static rendering of the `WorldMapSection` surface (a simplified SVG world with a few accent pins), full-bleed.
- State comparison: hand-ported `LikeForLikeBars` with real restaurant revenue across California / New York / Texas / Florida, subject bar in atlas, others neutral, direct labels.
- Neighbourhood cards: 3-up Gallery cards from real flavor data (Queens, Le Marais, Shitamachi) with known-for + don't-miss + price tier.
- Audience (`feature43` 4-up), pricing teaser (`pricing2` mini, prices from `TIERS`), blog rail (3-up, two real or fallback-gradient covers), newsletter (`cta10` panel + a real sample-report preview image).

At 375: single-column stack, hero question wraps cleanly with no horizontal scroll, tiles/bars/cards collapse to 1-up, world map shrinks to a calm static image, all tap targets >= 44px. Everything is shown filled; nothing is collapsed in the default mockup (both self-omitting sections resolve). A second smaller mockup state may demonstrate the single collapsed "filling in" strip for the founder, clearly labeled as the failure state.

## Lead-designer QA (page-specific)
- Cringe risk: "marketing-y everything." A SaaS home tempts a wall of identical card grids (tiles, audience, pricing, blog, neighbourhoods are all card-shaped). Defense: vary the card grammar deliberately, stats-cards (numeric) vs feature-cards (icon) vs gallery-cards (editorial) vs pricing-cards, and break the rhythm with the full-bleed map and the panel-shaped newsletter so it never reads as five clones.
- Typography risk: two display moments fighting. Only the hero question is Newsreader-large. Section H2s step down clearly (>=1.25 ratio gap) so nothing competes with the hero. Every number, on tiles, bars, prices, dates, is tabular lining figures; body copy stays 65-75ch.
- Density risk: numbers too high, too fast. The hero deliberately carries no number; the first figures arrive in the tiles one band down. This keeps the focal point singular and stops the page reading like an almanac.
- Honesty risk: the state comparison must never crown a winner or rank across geography; neighbourhood cards must carry only real flavor detail; pricing must pull from `TIERS`; no source-agency names, no em-dashes, no placeholder image in the newsletter.

Four questions:
1. Sense at a glance? Yes, the rotating question + search states the job in one focal point; everything below is proof, not competing claims.
2. Cringe? Avoided by deliberately varying the five card grammars and interrupting them with the full-bleed map and the panel close, so it does not read as an AI-generated card-wall.
3. Typography? One Newsreader hero moment, a clean stepped Inter hierarchy below, tabular figures on every number, controlled measure, no flat scale.
4. Can it be better / quieter? Yes, and it is: numbers held off the hero, six example tiles trimmed to three, the duplicate newsletter card retired in favor of the single calm panel, and the two fragile data sections self-omit rather than ever showing a stub.
