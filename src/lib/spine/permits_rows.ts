/**
 * src/lib/spine/permits_rows.ts
 *
 * THE PERMITS YOU NEED, the trade page's `03 permits` (MODEL.md 8.6; plan
 * step 33, second dispatch, 2026-09-18). A KvGrid card: each licence the
 * trade needs is a label over one figure, the typical days to get it, in two
 * columns with no group heading. Pure over the shard, synchronous, so the
 * stories, the copy gate and the harness build it without the database.
 *
 * Each figure with its file and field: `licensing.licences.*.name` and
 * `licensing.licences.*.typical_days` in data/facts/industry/<id>.json,
 * read through src/lib/facts/industry_shard.ts into the fact store. Counted
 * over the 243 shards on 2026-09-18: 243 of 243 hold licences, two to five
 * per shard (2 / 46 / 146 / 49; the composition's "three to five, 48 / 146 /
 * 49" folded the two two-licence shards, pipeline_transport and
 * watch_jewelry_repair, into its 48), 971 named licences each with its days
 * (two `typical_days` rows carry no name row and are not licences to draw),
 * every one tagged modelled. Not a ranking, so the card draws under four
 * cells (clause 22 does not bind it).
 *
 * WHAT IS NOT PRINTED. `typical_cost_band` is a word (low, medium, high) and
 * a word never stands where a figure goes (PART 5), so it is not the cell's
 * figure; SINCE 2026-09-20 LATE EVENING it is the cell's NOTE under the
 * days ("Low fee", "High fee"), a category label and not a figure, because
 * his word after the push of that day was that a figure without its
 * details is surface (MODEL PART 9 clause 60) and the fee band is the one
 * detail the shard holds beside the wait; the burden score
 * (`licensing.compliance_burden_0_100`) is a coined index (clause 17). A
 * licence whose wait is on file as ZERO days is not a wait (one row on one
 * shard, engineering_architecture's "Continuing education upkeep", an
 * ongoing obligation and not a permit to get): it is withheld with a stated
 * line counting it, never printed as "0 days" and never dropped in silence.
 *
 * THE LONGEST WAIT LEADS THE CELLS. The composition names it the focal cell
 * at 30 in ink, the one to plan for; the fact card with a focal is candidate
 * 1 of FORM-CATALOG's CANDIDATES AWAITING HIS CLICK, so until he clicks the
 * cell draws at the head rung like its siblings (the country's and the
 * city's seats, the same rule). The builder still puts it FIRST, because on
 * an odd count KvGrid's COMPLETE ROWS gives the first cell the card's width,
 * which is the silhouette the focal would take; `longest` names it so the
 * view can raise it the day the click lands. A tie for the longest wait (34
 * shards) keeps the shard's own order among the tied.
 *
 * MODELLED SAYS MODELLED. Every shard figure is modelled on the page (R12,
 * item 61); the basis is 8.6's own sentence and the foot says the waits are
 * modelled in words, because the sample mark is behind his switch.
 */
import { industryRows } from "@/lib/facts/industry_shard";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import { COPY } from "@/lib/spine/copy";
import { daysFigure } from "@/lib/spine/entry_bill_rows";

export const PERMITS_METRICS = { name: "licensing.licences.*.name", days: "licensing.licences.*.typical_days", band: "licensing.licences.*.typical_cost_band" } as const;

export type PermitsData = {
  industryId: string;
  cells: KvCell[];
  /** The longest wait among the printed cells: the candidate's focal, first in the cells. Null when no cell prints. */
  longest: { key: string; days: number } | null;
  /** The zero-day licences, withheld with this line; null when every licence prints. */
  withheld: string | null;
  basis: string;
  foot: string;
  /** The licences the shard holds, printed and withheld together. */
  count: number;
  confidence: "modeled";
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * A LICENCE NAMED FOR A UNITED STATES JURISDICTION (the goal's A9, 2026-09-24).
 * The shard's licences are the trade's, not a country's, and the card's basis
 * says "typical for the trade anywhere"; nine of the live trades' names are
 * not: a "Federal brewer's notice", a "State dental licence", a "State clinical
 * licence (LCSW, LPC, LMFT, psychologist)". Photographed on production on
 * /gb/london/craft-breweries-taprooms, where a London brewery was told to file
 * a Federal notice. A name carrying "federal", or "state" without "or
 * national" beside it, is that country's own: printed on a United States page,
 * withheld with its line everywhere else. "State or national pharmacy premises
 * permit" names both and prints anywhere. The UK's own licences are research
 * (DATA-REQUIREMENTS item 92), never a renamed US one.
 */
export function isUsJurisdictionLicence(name: string): boolean {
  if (/\bfederal\b/i.test(name)) return true;
  return /\bstate\b/i.test(name) && !/\b(?:state or national|national or state)\b/i.test(name);
}

export function buildPermits(industryId: string, iso2?: string | null): PermitsData | null {
  const names = industryRows(industryId, PERMITS_METRICS.name);
  if (names.length === 0) return null;
  const days = new Map(industryRows(industryId, PERMITS_METRICS.days).map((f) => [f.rowKey, f.value] as const));
  const bands = new Map(industryRows(industryId, PERMITS_METRICS.band).map((f) => [f.rowKey, typeof f.value === "string" ? f.value.trim().toLowerCase() : ""] as const));
  const rows: Array<{ key: string; name: string; days: number; band: "low" | "medium" | "high" | null }> = [];
  let zero = 0;
  let foreign = 0;
  /* A country given and not the United States: its page withholds the US-named licences (above). No country: every name, as the copy sweeps read them. */
  const offUs = typeof iso2 === "string" && iso2.trim() !== "" && iso2.trim().toUpperCase() !== "US";
  for (const n of names) {
    const name = typeof n.value === "string" ? n.value.trim() : "";
    const d = days.get(n.rowKey);
    if (!name || !isNum(d) || d < 0) continue;
    if (d === 0) { zero++; continue; }
    if (offUs && isUsJurisdictionLicence(name)) { foreign++; continue; }
    const b = bands.get(n.rowKey);
    rows.push({ key: n.rowKey, name, days: Math.round(d), band: b === "low" || b === "medium" || b === "high" ? b : null });
  }
  /* The longest wait first, the rest in the shard's order (a stable sort on one key). */
  const longest = rows.reduce<typeof rows[number] | null>((best, r) => (best == null || r.days > best.days ? r : best), null);
  const ordered = longest ? [longest, ...rows.filter((r) => r !== longest)] : rows;
  const cells: KvCell[] = ordered.map((r) => ({ key: r.key, label: r.name, value: daysFigure(r.days), note: r.band ? COPY.tradePermits.feeBand[r.band] : undefined, confidence: "modeled" }));
  if (cells.length === 0 && zero === 0 && foreign === 0) return null;
  const zeroLine = zero === 0 ? null : zero === 1 ? COPY.tradePermits.withheldOne : COPY.tradePermits.withheldMany.replace("{n}", String(zero));
  const foreignLine = foreign === 0 ? null : foreign === 1 ? COPY.tradePermits.foreignOne : COPY.tradePermits.foreignMany.replace("{n}", String(foreign));
  const withheld = [zeroLine, foreignLine].filter((l): l is string => l != null).join(" ") || null;
  return {
    industryId,
    cells,
    longest: longest ? { key: longest.key, days: longest.days } : null,
    withheld,
    basis: COPY.tradePermits.basis,
    foot: COPY.tradePermits.foot,
    count: rows.length + zero + foreign,
    confidence: "modeled",
  };
}
