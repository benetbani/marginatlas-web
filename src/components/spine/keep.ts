/* KEEP INDEX , the honest counterweight, derived not stored. Revenue index is
 * 1 + rev_vs_city_pct/100 (city = 1.0); rent load is rent_mult (city = 1.0).
 * keep = 100 x revenue / rent, so 100 means a district keeps the same share of
 * each pound as the city average. Above 100 the cheaper rent more than pays for
 * any shortfall in takings; below 100 a fat rent eats the headline lift. This is
 * what makes Mayfair (high revenue, heavy rent) read honestly against Brixton.
 *
 * Server-safe (no "use client") so BOTH the hub page (server) and the explorer
 * island (client) can call it; a client-exported function cannot be invoked from
 * the server. */
export function keepIndex(d: { rev_vs_city_pct?: number; rent_mult?: number }): number {
  const revenue = 1 + (d.rev_vs_city_pct || 0) / 100;
  const rent = d.rent_mult && d.rent_mult > 0 ? d.rent_mult : 1;
  return Math.round((revenue / rent) * 100);
}
