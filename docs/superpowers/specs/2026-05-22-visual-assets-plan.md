# Visual assets plan — under $50, brand-tinted, Unsplash live

## Big news first

**The Unsplash API responded successfully** to a test call (`GET
/photos/random?query=frankfurt+city`). Application status: approved.
That means we have:

- Up to **5,000 requests / hour** on production tier
- **Free**, with required attribution + a tracking download ping
- High-resolution (~3000×2000) photos
- Coverage of every major and most minor cities in our 200-city list

This makes the photo problem mostly solved without spending anything.
The $50 budget can go to filling the gaps and to brand polish.

## Sources, ranked by cost-effectiveness

### 1. Unsplash API — $0 (LIVE)
- Coverage: excellent for major cities, sectors, business contexts
- Attribution: "Photo by [name] on Unsplash" + download ping required
- Quality: editorial-level photography
- Use for: hero images, photo galleries, blog post imagery

### 2. Pexels API — $0
- Coverage: similar to Unsplash, slightly less editorial-heavy
- Attribution: name + Pexels link (optional but encouraged)
- Quality: high
- Use for: backup when Unsplash misses, variety in photo galleries
- API key already in .env.local

### 3. Pixabay API — $0 (no key set yet)
- Coverage: huge volume, more vector + illustration content
- Attribution: optional
- Quality: variable
- Use for: illustration / icon backup

### 4. Wikimedia Commons — $0 (no API needed, already using)
- Coverage: every notable landmark and most cities
- Attribution: complex (CC-BY-SA usually, varies per image)
- Quality: variable (volunteer-uploaded)
- Use for: landmarks, historical context, specific named buildings
- Already integrated in cities_manifest.json

### 5. Atlas-branded illustration kit — $20-40 one-time
- **Recommended purchase: Storyset.com Premium** ($16/mo or $144/yr)
  - 4,000+ vector illustrations, recolorable to brand palette
  - Industry-specific (restaurants, offices, construction, retail)
  - Use as section dividers, empty states, "starter pack" graphics
- **Or: unDraw** (free, requires brand color customization)
- **Or: Open Peeps** (free, hand-drawn people)
- **Or: Lucide / Phosphor Icons** (free, already using Phosphor)

### 6. Custom AI-generated brand imagery — $10-30
- **Midjourney** ($10/mo basic) — 25 jobs/month, good for hero shots
  in a unified style
- **Ideogram** ($8/mo) — text-in-image capability
- **DALL-E API via OpenAI** ($0.02-0.04 per image)
- Use for: branded blog post imagery, custom illustrations we
  can't find via stock

### 7. Direct purchase — $30-50 one-time
- **Creative Market bundles** — illustration packs for ~$15-30
- **Envato Elements** ($16.50/mo, unlimited downloads)
- Use for: when we want a single coherent illustration style across
  the site

## Recommended spend ($45 total)

| Item | Cost | One-time vs recurring | Why |
|---|---:|---|---|
| Storyset Premium | $16/mo | Recurring (cancel after 1 mo) | Get 4,000 illustrations in brand colors, download in bulk, cancel |
| Midjourney Basic | $10/mo | Recurring (1 mo first) | 25 custom hero shots in a unified style |
| Pexels / Unsplash / Wikimedia | $0 | Free | The photo workhorses |
| Phosphor Pro | $0 | Free (already installed) | Icons across the site |
| **Sub-total spend** | **$26** for 1 month bulk download |

The strategy: **subscribe to Storyset + Midjourney for ONE month,
download a curated kit of ~200 illustrations + 30 hero shots, cancel
both, work with the kit indefinitely.** $26 total.

Optional add-on if you want bespoke landmark photography for the
top 30 cities: $200-500 to a local photographer via Upwork. Out of
the $50 budget.

## Brand-tinted treatment (cross-cutting)

Every photo, regardless of source, gets the same treatment:

### CSS-only duotone (free, no preprocessing)

```css
.atlas-photo {
  filter: contrast(1.08) saturate(0.85);
}

.atlas-photo--duotone {
  filter:
    sepia(0.5)
    hue-rotate(-10deg)  /* push toward amber */
    saturate(1.1)
    contrast(1.1);
}

.atlas-photo--tinted {
  position: relative;
}
.atlas-photo--tinted::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 247, 230, 0.0) 0%,
    rgba(212, 119, 6, 0.18) 100%  /* atlas amber */
  );
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

Effect: every photo on the site feels like it belongs to the same
visual brand even when sourced from 4 different APIs.

### Aspect ratios

- Hero: 16:9 or 21:9 cinematic
- Gallery: 4:3 or 1:1
- Inline editorial: 3:2
- Never: stretched, cropped to faces, weirdly tall

### Lazy loading

All decorative photos use `loading="lazy"` + `decoding="async"`.
Above-the-fold hero stays eager-load.

## Image-pipeline strategy

### Source mapping

| Cell type | Primary source | Fallback |
|---|---|---|
| Tier 1 city × industry | Unsplash with query "{city} {industry}" | Pexels |
| Tier 2 city | Unsplash with query "{city}" | Wikimedia |
| Tier 3 city | Unsplash with query "{city}" | Pexels |
| Country page | Wikimedia (landmark) | Unsplash |
| Industry page | Unsplash with "industry name" | Pexels |
| Sector page | Unsplash with sector concept | Pexels |

### Caching

Don't re-fetch on every render. Pipeline:

1. Build-time: a script (`scripts/images/build_city_hero_cache.ts`)
   pre-fetches one hero per Tier 1 + Tier 2 city, stores the URL +
   attribution in `data/images/city_heroes_v1.json`.
2. Render-time: cell page reads the cached URL, uses Next's
   `<Image>` for optimization. No API call.
3. Refresh: re-run the cache builder monthly.

### Attribution

Unsplash requires:

1. Photographer credit visible in UI
2. Hyperlink to photographer's Unsplash profile
3. "Photo by [name] on Unsplash" wording
4. A download-tracking ping (one HTTP request to
   `download_location` URL on each cell page view)

Solution: small `<PhotoCredit />` component at the bottom of every
page with an image. Plus a server-side proxy endpoint to ping the
download tracker without exposing the access key.

## Smart-spending pyramid

| Budget tier | What it buys | When to upgrade |
|---|---|---|
| **$0** | Unsplash + Pexels + Wikimedia + free Phosphor | Right now |
| **$26 one-time** | + Storyset bulk download + Midjourney bulk download | When pages need illustration variety |
| **$50 + $30/mo** | + Envato unlimited stock | When we publish weekly editorial content |
| **$200-500 one-time** | + commissioned hero photography for top 30 cities | When traffic justifies the bespoke quality |
| **$2-5k** | + brand photographer for a global hero campaign | Post-monetization |

**Start at $0.** The Unsplash unlock changes the math — we have a
production-quality source with zero recurring cost. Add Storyset
later if illustration variety becomes a pain point.

## What ships next session

1. Build the Unsplash fetcher (script + cache file)
2. Pre-fetch hero images for top 30 Tier 1+2 cities
3. Add `<CityHero />` component with the duotone treatment
4. Add `<PhotoCredit />` component for attribution
5. Add server-side download-tracking ping
6. Roll the hero out to cell pages, then neighborhood pages

Effort: 1 day.
