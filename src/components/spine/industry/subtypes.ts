/* Subtype adapter , ONE source of truth for the derived subtype shape, server-safe
 * (NO "use client", so both the server page and the client where-pays island can
 * import it). The seed carries subtypes as deltas off a blended baseline
 * (margin_delta_pp, capital_delta_pct) so the numbers stay coherent when the base
 * moves; the page and the where-pays island both need the resolved keep% and
 * cost-to-open, so derive them once here: keep% = base net margin + the format
 * delta; capital = base first-year capital scaled by the format's capital delta.
 * Slug + rent_sensitivity are pure data. */
export type SubtypeRow = {
  name: string;
  slug: string;
  keeps_pct: number;
  capital_usd: number;
  rent_sensitivity: number;
  note: string;
};

export function deriveSubtypes(d: any): SubtypeRow[] {
  const st = d?.subtypes ?? {};
  const list: any[] = st.list ?? [];
  const baseNet: number = st.base_net_pct ?? d?.margins?.net_pct ?? d?.margin_index?.keeps_per_100 ?? 0;
  const baseCap: number = st.base_capital_usd ?? d?.operator?.capital_to_open_usd ?? d?.payback?.capital_usd ?? 0;
  return list.map((s, i) => ({
    name: s.name,
    slug: s.slug ?? `subtype-${i}`,
    keeps_pct: +(baseNet + (s.margin_delta_pp ?? 0)).toFixed(1),
    capital_usd: Math.round((baseCap * (1 + (s.capital_delta_pct ?? 0) / 100)) / 1000) * 1000,
    rent_sensitivity: s.rent_sensitivity ?? 1,
    note: s.note ?? "",
  }));
}
