/* KEEP INDEX , RETIRED from every neighborhood-hub surface (rulebook v1 §5,
 * founder 2026-07-11): a per-district "what you keep" ranking has no statistical
 * basis, so the hood page now ranks on the knowable seed input, rent load, and
 * nothing renders this index. The helper survives ONLY because the /dev/decide
 * sandbox (src/app/dev/decide/page.tsx) still imports it; delete this file when
 * that route is reformed.
 *
 * Formula, for the record: revenue index is 1 + rev_vs_city_pct/100 (city = 1.0);
 * rent load is rent_mult (city = 1.0); keep = 100 x revenue / rent.
 *
 * Server-safe (no "use client") so server and client callers can both use it. */
export function keepIndex(d: { rev_vs_city_pct?: number; rent_mult?: number }): number {
  const revenue = 1 + (d.rev_vs_city_pct || 0) / 100;
  const rent = d.rent_mult && d.rent_mult > 0 ? d.rent_mult : 1;
  return Math.round((revenue / rent) * 100);
}
