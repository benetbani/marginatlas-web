/**
 * src/lib/spine/country_licences_rows.ts
 *
 * LICENCES BY TRADE, behind the bill card's plus (2026-09-25; his clause 58,
 * "a section with several parts reveals them on a click", and his correction 5
 * of 2026-09-20, the bill to register "with more context than a number"). What
 * a trade needs from the council or a regulator before it opens, and how long
 * that takes, off the country shard's `licensing.list.*` (trade, licence,
 * lead_time): the United Kingdom alone holds it today, 1 of 198 shards, so the
 * plus draws there and nowhere else.
 *
 * One row a trade: the trade as the label, the wait as the value (a duration,
 * "0 days" where no licence is needed, never a word where the figure goes), the
 * licence as its note. Two rows at least, or none. The UK's café row was
 * corrected on 2026-09-25 to the Food Standards Agency's rule (register with
 * the council at least 28 days before trading), recorded in
 * design/loop/build/research/2026-09-25-uk-official-figures.md.
 */
import { queryFacts } from "@/lib/facts/store";
import { loadCountryShard, countryEntityId } from "@/lib/facts/country_shard";
import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";
import { COPY } from "@/lib/spine/copy";

export function buildCountryLicences(iso2: string): DetailRow[] | null {
  const code = countryEntityId(iso2);
  if (!code || !loadCountryShard(code)) return null;
  const byRow = new Map<string, { trade?: string; licence?: string; wait?: string }>();
  for (const f of queryFacts({ entityId: code })) {
    if (!f.metric.startsWith("licensing.list.*.") || f.tag === "placeholder" || typeof f.value !== "string") continue;
    const key = String(f.rowKey ?? "");
    const field = f.metric.slice("licensing.list.*.".length);
    const row = byRow.get(key) ?? {};
    if (field === "trade") row.trade = f.value.trim();
    if (field === "licence") row.licence = f.value.trim();
    if (field === "lead_time") row.wait = f.value.trim();
    byRow.set(key, row);
  }
  const L = COPY.entryBill.licences;
  const rows: DetailRow[] = [];
  for (const r of byRow.values()) {
    if (!r.trade || !r.wait) continue;
    const none = !r.licence || /^none$/i.test(r.licence);
    rows.push({ label: r.trade.replace(/\s*\/\s*/g, " or "), value: none ? L.noWait : r.wait, note: none ? L.noLicence : r.licence });
  }
  return rows.length >= 2 ? rows : null;
}
