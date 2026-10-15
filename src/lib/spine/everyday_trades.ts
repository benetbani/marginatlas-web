/**
 * src/lib/spine/everyday_trades.ts
 *
 * THE EVERYDAY SET, §32, IN A MODULE OF ITS OWN (plan 2026-10-13 home-quiet-editorial, Task 4A): the eight trades a street actually
 * carries, as hyphenated trade slugs. The city adapter (src/lib/spine/adapt_city.ts) filters by it and re-exports it, where its history
 * is written; it stands here so a reader of the set alone (the home's contents, src/lib/home/contents.ts, and the trade-set gate) does not
 * load the cell adapter, which builds the database client at import and so needs a Supabase URL the prebuild chain must not need.
 */
export const EVERYDAY_TRADES: ReadonlySet<string> = new Set([
  "restaurants", "grocery-stores", "pharmacies", "hairdressers-beauty",
  "sports-fitness", "auto-repair-shops", "cafes-coffee-shops", "bars-nightclubs",
]);
