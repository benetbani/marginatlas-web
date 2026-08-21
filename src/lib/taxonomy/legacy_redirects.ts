/**
 * src/lib/taxonomy/legacy_redirects.ts
 *
 * Old activity slugs that were renamed, and what they were renamed to.
 * Plan v13 Wave 4b. Matched on the LAST URL segment, so it serves both
 * `/industries/<old>` and `/<country>/<geo>/<old>`.
 *
 * MOVED OUT OF src/middleware.ts 2026-08-21, unchanged, for one reason: the
 * scope retirement in the same commit needs to READ this map to avoid building
 * redirect chains, and a constant living inside the middleware module cannot be
 * read by a build script without dragging `next/server` in with it.
 *
 * THE CHAIN THIS PREVENTS. Thirteen of these sixteen entries point at an
 * activity that scope_rules.ts has now retired. Left alone, `/industries/
 * crop-farming` would answer 308 to `/industries/grain-farming`, which would
 * itself answer 308 to `/industries`: two hops. Search engines follow a chain
 * but dilute equity across it and treat longer ones as soft 404s, and the
 * founder named search as his specific fear about the retirement. So
 * scripts/gen_retired.ts reads this map and emits a DIRECT entry for every
 * legacy slug whose target is retired, collapsing two hops into one.
 *
 * Adding an entry here is therefore not free: re-run `npx tsx
 * scripts/gen_retired.ts` afterwards, and the retired gate will tell you if you
 * forgot.
 */
export const TAXONOMY_REDIRECTS: Record<string, string> = {
  "auto-dealers-gas-stations": "auto-dealers",
  "broadcasting-telecom": "broadcasting",
  "chemical-pharmaceutical-manufacturing": "chemical-pharma-manufacturing",
  "crop-farming": "grain-farming",
  "food-beverage-manufacturing": "food-manufacturing",
  "furniture-home-goods-stores": "furniture-stores",
  "furniture-other-manufacturing": "furniture-manufacturing",
  "investment-securities": "securities-brokerage",
  "media-publishing": "news-periodical-publishing",
  "metal-products-manufacturing": "fabricated-metal-manufacturing",
  "mining-quarrying": "mining-quarrying-metals-stone",
  "passenger-transport": "transit-ground-passenger-transport",
  "postal-courier": "postal-service",
  "property-leasing-rental": "real-estate-leasing",
  "textile-apparel-manufacturing": "apparel-manufacturing",
  "wood-paper-products": "wood-products-manufacturing",
};
