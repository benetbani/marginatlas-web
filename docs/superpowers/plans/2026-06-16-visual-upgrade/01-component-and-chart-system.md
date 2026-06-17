# 01 , Component and chart system

How every page is built: the shadcnblocks registry, the one token map that themes
the whole library, the block-to-section menu, the chart strategy, and the static
HTML delivery method. The per-page specs (02-07) reference this file by section.

## 1. The shadcnblocks registry (wired + owned)
- Registry `@shadcnblocks` is configured in `components.json`. URL MUST be the
  `www` host: `https://www.shadcnblocks.com/r/{name}` (the bare domain
  308-redirects and DROPS the auth header -> 401).
- API key `SHADCNBLOCKS_API_KEY` lives in `.env.local` (gitignored). Rotate it if
  this machine's transcript is ever shared.
- Install a block: `npx shadcn add @shadcnblocks/{slug}` (needs the env var set),
  or fetch the JSON and paste `files[].content` (the blocks are plain owned React
  you keep). Confirmed working:
  `key=$(grep -m1 '^SHADCNBLOCKS_API_KEY=' /e/atlas/website/.env.local | cut -d= -f2-); curl -s -H "Authorization: Bearer $key" https://www.shadcnblocks.com/r/hero2`
- Slug gotcha: marketing slugs are `word+number` no separator (`hero2`,
  `feature43`, `pricing2`, `cta10`, `navbar1`, `footer7`). App slugs are
  hyphenated (`chart-card1`, `data-table1`, `stats-card1`). Concatenated forms
  404 to an empty body. ALWAYS confirm a slug from its category page before fetch.
- Block JSON: `{ name, type:"registry:block", dependencies[], registryDependencies[], files:[{path,content}] }`. Each is one typed `.tsx` with an exported
  Props interface + a `defaultProps` it spreads, plus a `className` passthrough.
  Content is prop-array driven (features[], plans[], menu[], chartData), so we
  feed our own numbers and copy.

## 2. THE ONE TOKEN MAP (the leverage point)
Every block and every shadcn chart reads ONLY shadcn semantic CSS variables and
`--chart-1..5`. Map the Atlas tokens onto those variables ONCE (in `globals.css`
for the app; in the mockup `:root` for static HTML) and the entire library
inherits the warm look with zero per-block color edits:

| shadcn var | Atlas token | hex |
| --- | --- | --- |
| `--background` | cream-75 | #fbfaf7 |
| `--card` / `--popover` | cream-50 | #ffffff |
| `--foreground` / `--card-foreground` | ink-900 | #211810 |
| `--muted` | cream-100 | #f7f6f4 |
| `--muted-foreground` | ink-500 | #7d6c58 |
| `--border` / `--input` | cream-300 | #e4e2dd |
| `--primary` | atlas-700 | #991600 |
| `--primary-foreground` | cream-50 | #ffffff |
| `--accent` | atlas-50 | #fff1ee |
| `--accent-foreground` | atlas-700 | #991600 |
| `--ring` | atlas-700 | #991600 |
| `--secondary` | cream-100 | #f7f6f4 |
| `--destructive` | clay-700 | #5c1813 |
| `--chart-1` | atlas-500 | #e62200 (the subject / spotlight) |
| `--chart-2` | moss-600 | #5c781e (kept / positive) |
| `--chart-3` | cocoa-500 | #87745d (cost mass) |
| `--chart-4` | ink-500 | #7d6c58 (neutral data) |
| `--chart-5` | amber-600 | #b06a08 (caution) |
| `--radius` | radius.lg | 1rem |
Fonts: `--font-display` Newsreader (headlines + the one hero number),
`--font-sans` Inter (everything else). In static mockups, load both via a Google
Fonts link.

Do this map first. It is the single thing that makes "upgrade every page type"
tractable.

## 3. Pre-install set (so any selected block resolves)
npm: `lucide-react`, `recharts`, `@tanstack/react-table`, `zod`, `react-icons`,
`embla-carousel-react`.
shadcn base parts: `button card badge separator switch tabs table avatar carousel
accordion navigation-menu sheet chart` (+ `@/lib/utils` cn). Most blocks list
these as `registryDependencies`; installing the base set once resolves them all.

## 4. Block-to-section menu (the vocabulary)
The prop-driven variants to prefer (avoid the hardcoded ones: `stats5`,
`compare1`, `testimonial14` need their content arrays lifted to props + scrubbed
for the honesty rules before use).

| Margin Atlas section | Block category | Example (prop-driven) | Feeds |
| --- | --- | --- | --- |
| Marketing hero (home) | Hero (245) | `hero2` | badge, heading, description, buttons, image (swap image for a product/chart shot) |
| Answer hero on a report page | Stats Card + Hero | `stats-card1` row + a quiet hero | verdict line + headline KPI tiles |
| At-a-glance metrics (scorecard) | Stats Card (App, 10) | `stats-card1` | title, value, change, changeLabel |
| Per-$100 money split | Chart Card (App, 27) | `chart-card1` (stacked/bar) + KEEP kit Waterfall | cost-stack series; chartConfig colors = --chart-* |
| Break-even | Chart Card / KEEP kit ThresholdGauge | `chart-card1` line OR ThresholdGauge | cumulative cost vs revenue |
| Seasonality | Chart Card (area) | `chart-card1` (12-mo default) | monthly[] |
| Pay by role / wages | Data Table (App, 32) OR new range primitive | `data-table1` | role/low/median/high rows |
| Peers / rivals | Compare (10) / KEEP kit ComparisonBars | `compare1` (lift rows to props, drop logos) | like-for-like, honesty rail |
| Methodology / how it works | Feature (311) | `feature43` (icon grid) / `feature108` (tabbed) | features[] |
| Honest take (low verdict) | Cta / Banner / Content | `cta10` (calm accent panel, omit buttons) | heading, description |
| Related / compare hand-off | Cta / Gallery | `cta10` / Gallery grid | links |
| Pricing | Pricing (95) | `pricing2` | plans[] with monthly/yearly toggle |
| Testimonials | Testimonial (39) | a static quote wall (calmer than `testimonial14`) | quotes[] |
| Top nav | Navbar (20) | `navbar1` | logo, menu[], auth (mobile sheet built in) |
| Footer | Footer (44) | `footer7` | logo, sections[], social, legal |
| Subtle premium backdrop | Background (Pattern 52) | a faint pattern, used sparingly | none |

Full catalog counts and the slug gotcha are in the study output; browse the
category page for a calmer sibling whenever the example feels busy.

## 5. Chart strategy (KEEP the kit, re-skin it, borrow shapes)
The existing kit (`src/components/kit/charts/` + `src/components/kit/RangeStrip.tsx`)
is visx + hand-SVG on the warm tokens and encodes the brand law (one accent, no
pie, cross-currency caveat, direct labels, tabular numerals, filled + empty
states, 375 legibility, server-renderable). It already serves ~10 of 12 stats.

RULE: do NOT replace these primitives with generic Recharts; that would silently
break the honesty rails (it would crown a cross-currency leader, draw pies, lose
empty states). The premium upgrade is RE-SKINNING them: tighter type scale,
generous spacing, the Card shell, gradient fills borrowed from shadcn's area
recipe, the shared motion. The 76 shadcn v4 charts are a STYLE COOKBOOK
(gradient defs, tickless axes, ChartContainer theming), not drop-in.

Per-stat renderer (the standing grammar):
| Stat | Renderer |
| --- | --- |
| Revenue distribution / spread | KEEP visx `RangeStrip` (the site-wide signature), polish only |
| Per-$100 money split | KEEP kit `Waterfall` (+ optional 100%-wide stacked div); never a pie |
| Break-even threshold | KEEP kit `ThresholdGauge` (amber-below / moss-above, lone atlas tick; add a quiet "typical day" tick) |
| Seasonality | PORT shadcn `chart-area-gradient` SHAPE, single atlas series, stripped axes (its sweet spot) |
| Wages by role | NEW compact primitive: a floating range/dumbbell row (RangeStrip sibling); neither shadcn nor kit has it |
| Like-for-like peers | KEEP kit `ComparisonBars` / `LikeForLikeBars` (the honesty rail is load-bearing) |
| First-year timeline | KEEP kit `TimelineRibbon` |
| Versus the world | PICK ONE grammar site-wide: `ScoreBand` with a global-median peer tick (reuse on cell + country + industry) |
| Owner-keeps / single score | KEEP `ScoreBand`; ONE optional re-skinned shadcn radial for a hero moment only (city Business Climate, or owner-keeps margin ring) |
| Footfall / risk / severity | KEEP `HeatStrip` / `FootfallGrid` / `SeverityGlyph` (no shadcn equivalent) |

Net new dependencies if we adopt the shadcn shapes: `recharts` (one dep covers
the seasonality area + any optional radial), wrapped `"use client"` so SSR pages
still prerender. The kit stays visx; the two coexist.

## 6. Static HTML delivery method (for the review mockups)
For each page-type mockup: a self-contained `.html` doc that
1. loads Newsreader + Inter via a Google Fonts link,
2. declares the token map (section 2) as `:root` CSS variables,
3. hand-ports the chosen block's markup + Tailwind-equivalent styles and the
   chart shapes into static markup, faithful to the block structure,
4. fills real or London-exemplar data, with unheld sections shown as the calm
   "still filling in" strip,
5. is openable by double-click, legible at 1280 and 375.
No server, no React build, no browser automation. These prove the direction;
the approved compositions are then ported into the Next app.

## 7. Honesty + constraint flags carried into every build
- Lift `compare1` / `testimonial14` content to props AND scrub for the
  like-for-like / no-badmouthing / no-cross-geography-ranking rules before use.
- Replace every placeholder cloudfront image with a real chart / number / screen,
  or drop the image slot.
- Keep carousels / tabs / switches sparing (calm, not dense).
- Tokens only, no em-dashes, no source-agency names, nullable-in / silence-out,
  filled + empty states, 375 legibility, server-renderable.
