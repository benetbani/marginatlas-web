# Plan v18 Phase 4 — Branding direction research

Founder asked for a verdict on which direction Atlas should lean,
what custom visual assets are worth commissioning, and where the
"idiotic icons and animations" should be replaced. Below: four
candidate directions with mock-up specs, plus a ranked asset
spend list with concrete dollar figures.

---

## Four direction candidates

### A · Premium fintech (current)

Stripe-meets-Bloomberg-Terminal-warmed-up. Heavy serif headlines on
cream paper, sparse colour, refined gradients. This is what the site
already looks like as of Plan v15-v16.

| Strength | Weakness |
|---|---|
| Already implemented. Zero migration cost. | Reads as "another SaaS landing page" if everything sits at the same elevation. |
| Cream + warm-graphite palette is unique against competitors who all run cool blue or stark monochrome. | The emoji icons + cream-gradient placeholder images feel placeholder-shaped to founders who have seen real fintech sites. |
| Plays well with the data density Atlas needs. | Doesn't reward the user for the depth of data — the surface looks lighter than the substance is. |

**Verdict.** Keep as the floor. We are not redoing the palette.

### B · Editorial broadsheet (NYT data journalism)

Cormorant Garamond display serif (already in use for hero), heavier
line spacing, full-bleed photography, drop-caps on long-form sections,
breakouts with thick rules and sans-serif captions.

| Strength | Weakness |
|---|---|
| Strongest moat against AI-generated competitors — feels intentional. | Higher production cost per page (deep-dives need real layout). |
| Press loves it; backlinks come for free. | Requires real photography or commissioned illustration. |
| Already 80% there with the hero + methodology sections. | The featured grid and navigator stick out as "from a different site." |

**Verdict.** This is the direction Atlas should lean into. The hero
is already broadsheet-shaped; we extend.

### C · Investment-research (Bloomberg-Terminal-warmed-up)

Dense data, monospace numerics, tighter line height, grids of numbers
above the fold, eyebrow tags everywhere, ticker-style updates.

| Strength | Weakness |
|---|---|
| Reads as "professional tool" instantly. Pro tier converts faster. | SMB operators bounce — too much noise. |
| Backlinks from finance press. | Loses the warm differentiator. |

**Verdict.** Reserve for the Pro / Enterprise marketing surface
(separate page tree). Don't redo the public site.

### D · Engineering-craft (Linear, Vercel)

Soft monochrome, generous whitespace, single accent colour, motion
on hover only, no decoration.

| Strength | Weakness |
|---|---|
| Reads as "made by smart people." | Reads as "made by software-people-not-finance-people," undermines authority on numbers. |
| Cheap to maintain. | Atlas's data depth doesn't get visual reward. |

**Verdict.** Skip. Wrong domain signal.

---

## Spending list — ranked

All prices are mid-market freelance ranges in USD. Lower bound assumes
an independent illustrator/designer; upper bound a small studio.

### Tier 1 — Spend now ($1.8k - $3.5k total)

| # | Asset | Cost | Why now |
|---|---|---|---|
| 1 | 25 custom sector icons | $800 - $1,500 | The current emoji + cream-gradient placeholders kill the broadsheet illusion every time the user scrolls past the master menu. Single biggest perceived-quality lift per dollar. |
| 2 | 9 hero illustrations (one per FEATURED tile) | $900 - $1,800 | Same logic. Each tile becomes a tiny editorial composition. Style consistency matters here, so commission the same artist as the icons. |
| 3 | Country page hero treatment (flag + tagline framing) | $100 - $200 | Replace the current flag-emoji-and-text with a designed flag plate. 195 countries, one template, single $100-200 design fee. |

### Tier 2 — Spend after Tier 1 lands ($2.5k - $5k)

| # | Asset | Cost | Why later |
|---|---|---|---|
| 4 | 12-15 industry editorial photographs | $1,500 - $3,000 | For the weekly deep-dive section (Phase 3 §2.2). Only valuable once the deep-dive cadence ships. |
| 5 | Animated SVG world map | $500 - $1,200 | Replaces CitiesDotsMap. Beautiful but not load-bearing. |
| 6 | Brand book + design tokens manual | $500 - $1,000 | When a second contributor joins, this saves a week of bikeshedding. Premature without it. |

### Tier 3 — Skip until 100k MAU ($5k+)

| # | Asset | Cost | Why skip |
|---|---|---|---|
| 7 | Full logo system redesign | $3,000 - $8,000 | Current wordmark is fine. Not the bottleneck. |
| 8 | Marketing video / explainer | $5,000 - $15,000 | Pre-MAU spend that rarely pays off. Build the audience first. |
| 9 | Custom font commission | $10,000+ | Cormorant Garamond is free and excellent. |

---

## What to kill immediately

Things that read as placeholder and undermine the broadsheet feel:

1. **Sector master menu emoji** (currently 🍽️ 🛒 ✂️ etc.). Replace with the 25 custom icons from Tier 1. Until that lands, switch to a thin-weight Lucide icon set as a $0 interim.
2. **Cream-gradient placeholder images** on cell pages. Better: just text + a thin colored bar above the headline. Less visually noisy.
3. **The CitiesDotsMap SVG** if it's still rendering off-center. Cheap fix is to remove dots until Tier 2 commissions a real map.
4. **AskWidget purple/cyan accent** if it bleeds into the cream palette. Audit needed.

Total interim cost to remove these: ~$0 (Lucide is free, the rest is deletion).

---

## Recommended path

Spend **$2k - $3k** in Tier 1 over the next two weeks. Specifically:

- Find one illustrator on Behance with editorial-broadsheet portfolio
- Brief: 25 sector icons + 9 hero illustrations in matching style
- Timeline: 2-3 weeks of back-and-forth
- Deliverables: SVG + PNG + design source
- Use the design folder structure already present (`public/images/`)

Defer all of Tier 2 until at least one of:
- The weekly deep-dive cadence is shipping
- 10k monthly visitors are landing on the site
- A specific PR opportunity needs the polish

Skip all of Tier 3.

---

## Direction verdict

**Go editorial-broadsheet (Direction B).** Atlas is already 80% there.
The Tier 1 spend closes the gap. The result feels like a magazine that
respects its readers' intelligence — which matches the data depth.
