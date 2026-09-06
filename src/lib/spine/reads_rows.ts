/**
 * src/lib/spine/reads_rows.ts
 *
 * THE QUICK READS' ROWS for a city (city:quick-reads, the build loop's run 16,
 * 2026-09-06): the seed's lens scales, six ranks among the cities carried
 * (demand depth, customer income, cost of living, talent pool, trade from
 * outside, market size), each a position from 0 to 100 between two named
 * poles that the adapter composes from the city list, mapped to the spectra
 * archetype's rows; the registration days as the foot figure, the paperwork
 * alone. Local and synchronous. Null below two reads; the adapter's own floor
 * is five of six. The words of the reads live with the adapter that ranks
 * them; the foot's words live in the copy table.
 */
import type { SpectraRow } from "@/components/spine/archetypes/SpectraTable";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type QuickReads = { rows: SpectraRow[]; foot: { value: string; label: string } | null; sample: boolean };

export function buildCityQuickReads(seed: any): QuickReads | null {
  const o = seed?.lenses;
  const scales: any[] = Array.isArray(o?.scales) ? o.scales : [];
  const rows: SpectraRow[] = scales
    .filter((s) => s && isNum(s.pos) && s.label && s.left && s.right)
    .map((s, i) => ({ key: String(s.key ?? s.label ?? i), name: String(s.label), left: String(s.left), right: String(s.right), position: Math.max(0, Math.min(1, s.pos / 100)) }));
  if (rows.length < 2) return null;
  const days = o.days_to_register;
  const foot = isNum(days) && days >= 0 ? { value: String(Math.round(days)), label: Math.round(days) === 1 ? COPY.cityReads.daysOne : COPY.cityReads.daysMany } : null;
  const conf = o._meta?.confidence;
  return { rows, foot, sample: conf === "placeholder" || conf === "modeled" };
}
