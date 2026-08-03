---
name: Margin Atlas
description: A global small-business benchmarks site in an editorial-broadsheet register.
colors:
  ink-900: "#1A1A1A"
  ink-800: "#27272A"
  ink-700: "#3F3F3D"
  ink-600: "#525252"
  ink-500: "#737373"
  ink-300: "#D4D4CE"
  ink-200: "#E5E5E0"
  ink-100: "#F0F0EA"
  ink-50: "#FAFAF7"
  cream-50: "#FEFBF6"
  cream-100: "#F8F2E4"
  cream-200: "#EEE6D2"
  cream-300: "#E8DDC7"
  cream-400: "#D9C9A8"
  cream-500: "#C2AE85"
  parchment: "#E8DDC7"
  atlas-500: "#D97706"
  atlas-600: "#C2410C"
  atlas-700: "#9A3412"
  atlas-800: "#7C2D12"
  atlas-400: "#F59E0B"
  atlas-300: "#FBBF24"
  atlas-200: "#FDBA74"
  atlas-100: "#FDE9CC"
  atlas-50: "#FEF7ED"
  cocoa-900: "#451A03"
  cocoa-700: "#78350F"
  cocoa-500: "#A1856A"
  cocoa-300: "#C9B59A"
  cocoa-100: "#F2E8DC"
  cocoa-50: "#FBF7F2"
  moss-700: "#3F6212"
  moss-500: "#65A30D"
  moss-100: "#ECFCCB"
  moss-50: "#F7FCE8"
  clay-700: "#991B1B"
  clay-500: "#DC2626"
  clay-100: "#FEE2E2"
  clay-50: "#FEF2F2"
  teal-700: "#0F766E"
  teal-500: "#0F766E"
  teal-50: "#F0FDFA"
typography:
  display:
    fontFamily: "Tiempos, Georgia, ui-serif, serif"
    fontSize: "clamp(2rem, 6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
    fontFeature: "ss01, cv11"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "80px"
components:
  card:
    backgroundColor: "{colors.cream-50}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-cream:
    backgroundColor: "{colors.cream-100}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "24px"
  pill:
    backgroundColor: "{colors.parchment}"
    textColor: "{colors.cocoa-700}"
    rounded: "{rounded.xl}"
    padding: "2px 10px"
  link-atlas:
    textColor: "{colors.atlas-600}"
  hero-section:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.cream-50}"
    padding: "80px 24px"
---

# Design System: Margin Atlas

## 1. Overview

**Creative North Star: "The Broadsheet Atlas."**

Margin Atlas is a global benchmarks reference, dressed in the typographic and structural conventions of a well-printed broadsheet weekly. The visual register is closer to a working economic-statistics annual or a serious weekly briefing than to any contemporary SaaS marketing aesthetic. Warm paper-tone surfaces (cream, parchment, faint amber) replace the white-on-blue-gradient defaults of the category. Type does most of the work. Numbers are integrated into the page the way they sit in a column of editorial copy: tabular figures, the denominator visible, no decorative stat tile.

The system is **light-first** and warm. There is one dark surface in the entire system — the hero on cell pages and the homepage — and it exists to mark a threshold (you've arrived at the briefing) rather than to convey "this is serious because it's dark." Everywhere else, the page is cream paper.

The system explicitly rejects: SaaS-cream-and-purple landing pages; investor-deck data-density-as-design; Bloomberg-terminal dark mode; AI-tool gradient-on-black hero; agency-template cinematic city b-roll; consultant-corporate stock photography; content-farm card grids; creator-economy testimonial carousels.

**Key Characteristics:**
- Warm earth-tone surfaces (cream, parchment, cocoa), never cool grays.
- One accent: burnt amber (atlas-500/600/700). Used on <10% of any screen.
- Tiempos serif for the display tier, Inter for everything else.
- Numbers in `tabular-nums`. The denominator always present.
- Flat-by-default elevation. Soft warm shadows only on `.card:hover`.
- Section rhythm via alternating cream / white / cream-100 backgrounds, not bordered cards.
- Mobile: type scales down, sections stack, no "card density" lost.

## 2. Colors

The palette is a warm-earth-tone family: cream paper backgrounds, burnt-amber accent, cocoa text, and two narrow delta colors (moss for positive, clay for negative). No cool gray, no pure white, no pure black anywhere. One sparse deep teal is reserved as a single signature data accent (<5% of surface) and currently unused in the homepage.

### Primary
- **Burnt Amber** (`atlas-500` #D97706): The single brand accent. Used on link tone, key chip backgrounds, the founder wordmark gradient, occasional ATLAS-tier badges. The "one accent ≤10% of surface" rule is hard.
- **Deep Terracotta** (`atlas-600` #C2410C): Hover state on accent links, deeper accent fills. Appears in the brand wordmark gradient.
- **Headline Amber** (`atlas-700` #9A3412): The amber used for small-caps `text-xs` section eyebrows inside `.card` blocks ("THE FULL DISTRIBUTION", "SIDE-BY-SIDE COMPARISONS"). Carries the editorial-briefing feel.

### Neutral — Surfaces
- **Warm Page Cream** (`cream-50` #FEFBF6): The default page background. Set as `--background` and gradient-faded to itself from `cream-100` at the top of every page.
- **Soft Wash Cream** (`cream-100` #F8F2E4): The "alternate" section background and primary card surface for `.card-cream`. Gives a printed-page feel between sections without using a border.
- **Hover Surface** (`cream-200` #EEE6D2): Hover state on tiles.
- **Parchment** (`cream-300` / `parchment` #E8DDC7): All borders, dividers, coverage badges. The site never uses cool gray for borders.

### Neutral — Text
- **Rich Graphite** (`ink-900` #1A1A1A): Primary text. Headlines, paragraph body, key labels.
- **Mid Graphite** (`ink-700` #3F3F3D): Secondary text in dark sections.
- **Deep Cocoa** (`cocoa-700` #78350F): Section dividers and warm body text inside cream surfaces. The site's "secondary text" color in light contexts — never use a cool slate-500. Often appears as `text-cocoa-700/80` for paragraph body next to amber eyebrows.
- **Deep Cocoa Ink** (`cocoa-900` #451A03): Footer text, attribution lines, deepest body text.

### Neutral — Inverted (hero section only)
- **Hero Ink** (`ink-900` #1A1A1A): The single dark surface in the system, used as `bg-ink-900` on the homepage and cell-page hero only.
- **Cream-on-Ink** (`cream-50` #FEFBF6): Text inside the hero section.

### Tertiary — Delta colors (data only)
- **Positive Moss** (`moss-500/700` #65A30D / #3F6212): Positive deltas on YoY values, chart positive areas. Replaces the harsh emerald/green-500 reflex.
- **Negative Clay** (`clay-500/700` #DC2626 / #991B1B): Negative deltas. Replaces harsh rose/red-500.
- **Sparse Teal** (`teal-700` #0F766E): Reserved for one signature data accent (e.g. a single trend line). Used <5% of any chart surface. Not currently active on the homepage.

### Founder wordmark colors
The MARGIN ATLAS wordmark uses **dark cocoa** for "MARGIN" and **burnt amber** for "ATLAS" — canonical. The `.gradient-name` class in `globals.css` implements this as a linear-gradient on the amber half. Never substitute any other color combination for the wordmark.

### Named Rules
**The One Accent Rule.** Burnt amber appears on no more than ~10% of any visible screen. If a page reads "amber everywhere," strip it back. The amber is rare on purpose.

**The Warm-Only Rule.** No cool grays. No pure white (`#fff`). No pure black (`#000`). Every neutral is tinted toward the earth-tone family. The cream-100 hero-fade gradient at the top of every page is the doctrine made visible.

**The Single Dark Surface Rule.** Exactly one section per page is `bg-ink-900`: the hero. Everywhere else, cream paper. This is what makes the dark hero feel like a threshold rather than a theme.

### Color strategy: Restrained
This is a **Restrained** palette by impeccable's framework: tinted neutrals (cream / parchment / cocoa) plus one accent (atlas amber) used on ≤10% of surface. The hero is the one place this loosens — the dark surface owns 100% of itself, but it's a single section, not a theme.

## 3. Typography

**Display Font:** Tiempos (with Georgia, ui-serif, serif fallback) — used on editorial moments: cell-page headlines, blog headers, the `font-serif` utility class. Friendly serif with kerning, ligatures, and contextual alternates enabled.

**Body Font:** Inter (with ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif fallback) — used on almost everything: navigation, body copy, labels, buttons, tile copy, headlines on non-cell pages. Font-feature-settings `ss01` and `cv11` are enabled globally to get the "less geometric, more literary" Inter character set.

**Character:** The pairing is the broadsheet's pairing — a literary serif for the page's editorial moments, a quietly humanist sans for everything that needs to read like running prose. Avoid letting Inter feel "tech-sans"; the ss01/cv11 features are doing real work here.

### Hierarchy

- **Display** (Tiempos, 600, `clamp(2rem, 6vw, 3.75rem)`, line-height 1.1, tracking -0.02em): The cell-page hero headline ("How much does a coffee shop make in Lisbon?") and editorial blog headers. The serif's job is to mark "this is the writing."
- **Headline** (Inter, 600, `clamp(1.5rem, 3vw, 1.875rem)`, line-height 1.2): Section headers across the homepage and cell pages ("Start with something familiar", "What you'll see on every cell"). `tracking-tight` consistently applied.
- **Title** (Inter, 600, 1.125rem, line-height 1.35): Card titles, tile labels, mid-page emphasis lines.
- **Body** (Inter, 400, 0.9375rem (15px), line-height 1.6): Paragraph copy. Always `text-cocoa-900/80` or `text-cocoa-700/80` inside cream surfaces — never `text-gray-500`. Cap line length at 65-75ch; the homepage paragraphs use `max-w-2xl` which lands inside that range.
- **Label** (Inter, 600, 0.75rem (12px), letter-spacing 0.06em, often `uppercase`): The amber section eyebrows ("THE FULL DISTRIBUTION"), pill labels, axis labels on charts. The small-caps treatment is part of the broadsheet voice.

### Named Rules
**The Tabular Numbers Rule.** Every figure on the site uses `tabular-nums`. Numbers in editorial copy line up vertically across rows; numbers in stat tiles don't shimmer when they change. The rule is hard.

**The Display-Serif-for-Editorial Rule.** Tiempos appears on the cell-page hero headline and on long-form editorial pages only. The homepage hero, ironically, currently uses Inter — that's a known issue and may move to Tiempos under a future audit. Section headers on tool pages stay in Inter; the serif is for the writing, not for chrome.

**The No-Hero-Metric-Template Rule.** No big-number-with-small-label tiles in marketing copy. The "Stats strip" on the homepage (`191 countries / 180+ industries / 357k+ cells / Free`) is the closest the site gets — it's tolerated because each number has its denominator immediately under it, but this is the ceiling. Never repeat this pattern.

## 4. Elevation

The system is **flat by default**. There are no decorative shadows, no glassmorphism (well — the hero card has a `backdrop-blur-md` which is flagged for audit), no shadow stacks signaling "premium." Depth is conveyed through warm paper-on-paper layering: cream-50 page, cream-100 sections, white cards, parchment borders.

Shadows appear only as a response to state — specifically, on `.card:hover`. The shadow is warm, low-intensity, and reads as "the card lifted slightly off the page" rather than "the card is now glowing."

### Shadow Vocabulary
- **Card resting** (`box-shadow: 0 1px 2px rgba(76, 39, 18, 0.04), 0 0 0 1px rgba(76, 39, 18, 0.02)`): The default `.card` shadow. A 1px tinted shadow plus a near-invisible parchment-tinted ring. Reads as paper resting on paper.
- **Card hover** (`box-shadow: 0 6px 18px rgba(120, 53, 15, 0.08), 0 0 0 1px rgba(217, 119, 6, 0.18)`): The hover state — a slightly warmer, deeper shadow plus a faint amber ring. Paired with a 1px `transform: translateY(-1px)`. The transition is 180ms ease-out.
- **Hero card shadow** (`shadow-lg` on the hero glass card): The single Tailwind-named shadow in active use, on the homepage hero card. Inherited from the default Tailwind value. Flagged for audit; should probably be a warm tinted shadow if it's kept at all.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The only shadow at rest is the 1px ring on `.card`. State changes (hover, focus) earn a slightly warmer shadow. No section ever has a "lifted card" shadow at rest.

**The Warm-Tinted Shadow Rule.** Every shadow value uses an rgba tinted toward cocoa/amber (`rgba(76, 39, 18, ...)`, `rgba(120, 53, 15, ...)`, `rgba(217, 119, 6, ...)`). No `rgba(0,0,0,...)`. Cool gray shadows on warm paper read as Photoshop, not as paper.

**The No-Glassmorphism Rule.** Backdrop blur and glass-card treatments are forbidden by default. The current homepage hero uses `bg-cream-50/85 backdrop-blur-md` over the video — this is a known violation, flagged for audit. If the dark hero stays, the card should be solid cream, not glass.

## 5. Components

The component library is small, specialized to the benchmarks-page job. Most components are data-display, not generic UI primitives. The visual signature is: cream surface, parchment border, amber eyebrow, cocoa body, tabular numbers.

### Buttons
- **Shape:** Generally `rounded-md` to `rounded-lg` (8-16px) depending on context. The site does not use a single canonical button radius.
- **Primary:** No styled primary button exists site-wide. CTAs are either plain text links in `text-atlas-700` or `text-atlas-600` (the `a.atlas-link` class) or styled inline per-page. This is a gap worth filling.
- **Hover / Focus:** Links shift from `text-atlas-600` to `text-atlas-700` on hover with a 180ms `transition-colors`. No glow, no scale, no underline shift.
- **Tertiary / "Browse everything →" pattern:** Small `text-sm font-medium` link in amber, no chrome, often with an arrow.

### Cards
- **Corner Style:** `rounded-2xl` (16px). All cards. No nested cards.
- **Background:** `bg-white` for `.card`, `cream-100` for `.card-cream`. Never `bg-gray-50`.
- **Shadow Strategy:** Per Elevation section. 1px parchment ring at rest, warm amber ring on hover with `translateY(-1px)`.
- **Border:** `1px solid #E8DDC7` (parchment). Always.
- **Internal Padding:** `p-6` (24px). Consistent across `.card` and `.card-cream`.

### Pills (chips, badges)
- **Style:** `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`. Parchment background or cream-100 background with cocoa text.
- **State:** Used for category labels, tier ratings, coverage badges. Stateless.

### Cell tiles (FeaturedCellTile, signature component)
- **Layout:** Industry glyph (emoji), title, region, headline figure. Square aspect.
- **Treatment:** Cream-50 surface, parchment border, cocoa body, amber on hover only. Tabular numbers.

### Hero (signature, currently flagged)
- **Surface:** `bg-ink-900` full-bleed (`left-1/2 right-1/2 -mx-[50vw] w-screen`), 80vh, with a background video at `opacity-60` and a vertical gradient overlay for legibility.
- **Card inside:** `bg-cream-50/85 backdrop-blur-md border border-cream-200/50 rounded-3xl shadow-lg p-6 sm:p-8 md:p-12 max-w-3xl`.
- **Headline:** Inter, font-semibold, `text-2xl sm:text-3xl md:text-5xl lg:text-6xl`, center-aligned, with a rotating word in `text-atlas-600`.
- **Status:** Multiple known issues — glassmorphism, hero-video b-roll cliché, no-Tiempos. See homepage audit.

### Data display primitives
- **RevenueTiles:** Bottom-decile / Typical / Top-decile in three columns. Tabular numbers. Single denominator label across the row.
- **RevenueDistribution:** Histogram-style distribution chart, moss/clay/cocoa palette only, no neon.
- **MarginWaterfall:** Stepped bar chart, parchment background, ink-900 text, single accent.
- **CountryFlag:** Twemoji-fallback flag emoji, fixed line-height.
- **AtlasHeroImage:** Section header image; uses SmartImage. Always cream-surfaced, no rounded-pill cropping, no oversized hero overlays.
- **QualityDots / QualityBadge:** 5-dot rating. Amber filled, parchment empty. No stars, no thumbs.

### Navigation
- **Style:** Quiet inline top nav, Inter regular. Links are cocoa-700, hover to atlas-700. No dropdowns on mobile; mobile collapses to a search-led layout.
- **Section anchors:** `scroll-mt-20` everywhere `id` anchors exist (`#ask-atlas`, `#pick-a-city`).

### Forms (NavigatorForm, CalculatorForm)
- **Style:** Single-line inputs with parchment borders, cream-50 background, ink-900 text, no inner shadow. Focus state is a 2px ring in atlas-300.

## 6. Do's and Don'ts

### Do:
- **Do** use the warm earth-tone palette across every surface (cream, parchment, cocoa, ink-900). Reach for cream-100 instead of slate-50 every time.
- **Do** use Tiempos for editorial headlines (cell-page hero, blog) and Inter with `ss01, cv11` enabled for everything else.
- **Do** apply `tabular-nums` on every numeric value, every chart axis, every stat.
- **Do** treat amber as rare. ≤10% of any visible screen. If it feels "amber-heavy," strip back.
- **Do** alternate section backgrounds (cream-50, white, cream-100) for rhythm, per `SECTION_TONES` in `src/lib/page-layout/section-order.ts`.
- **Do** keep cards flat at rest. Hover gets a single warm shadow + 1px lift.
- **Do** show the denominator next to every number. Revenue per seat. Margin per location. Never a naked figure.
- **Do** render nothing when data is missing — no "Coming soon," no "Not available" banner, no empty placeholder card. Pages are shorter when data is thin.

### Don't:
- **Don't** use any cool gray (`gray-*`, `slate-*`, `zinc-*`, `neutral-*` from Tailwind defaults). Every neutral is cream/parchment/cocoa/ink.
- **Don't** use pure white (`#fff`) or pure black (`#000`). Tint every neutral toward the earth-tone family.
- **Don't** use em dashes anywhere — in copy, in buttons, in error messages. Semicolons, periods, commas, parentheses. Also not `--`. (En dashes for number ranges are fine: `$2-4M`.)
- **Don't** use first-person voice anywhere — "we," "us," "our," "I," "our team," "our analysts." The site is a thing, not a personality.
- **Don't** use glassmorphism (backdrop-blur on a translucent card). The current hero card violates this; if the dark hero stays, the card goes solid cream.
- **Don't** use gradient text (`background-clip: text` with a gradient). The wordmark `.gradient-name` is the single tolerated exception, and only for the founder wordmark.
- **Don't** use side-stripe borders (`border-left` > 1px as a colored accent on cards or callouts).
- **Don't** nest cards. A card inside a card is a tell. Use a hairline divider or a tone shift instead.
- **Don't** render identical card grids of "icon + heading + text." The homepage "What you'll see on every cell" three-card row currently does this; flagged.
- **Don't** ship a hero-metric template ("big number, small label, supporting stats, gradient accent"). SaaS cliché.
- **Don't** name the source agencies, registries, or databases in user-visible text (R-002).
- **Don't** broadcast brokenness. No "Coming soon," no "Not available," no skeleton that never resolves. Render nothing when the data is missing.
- **Don't** use playful or cartoonish icons. Industry emoji glyphs on tiles are tolerated; mascots, characters, illustrated avatars are not.
- **Don't** use cinematic city-skyline b-roll in any hero. The current homepage hero plans a 60-90s `hero-cities-loop.mp4` background video — flagged.
- **Don't** use `text-gray-500` or `text-slate-500` for body copy. The correct color is `text-cocoa-900/80` or `text-cocoa-700/80` depending on surface.
