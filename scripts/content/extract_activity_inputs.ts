/**
 * extract_activity_inputs.ts — emit the per-activity inputs the character
 * drafters need, grounded in real data. One JSON row per taxonomy activity:
 * id, name, sector, examples, and the curated margin profile (gross / op /
 * net / asset-intensity / notes). Read-only.
 *
 * Run: npx tsx scripts/content/extract_activity_inputs.ts
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { INDUSTRIES, SECTOR_BY_ID } from "../../src/lib/taxonomy";
import margins from "../../src/lib/finance/industry_margins.json";

type MarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  asset_intensity?: number;
  notes?: string;
};
const M = margins as unknown as {
  default_fallback: MarginRow;
  industries: Record<string, MarginRow>;
};

const rows = INDUSTRIES.map((i) => {
  const m = M.industries[i.id] ?? null;
  return {
    id: i.id,
    name: i.name,
    sector: SECTOR_BY_ID[i.sector_id]?.name ?? i.sector_id,
    audience: i.audience ?? "smb_friendly",
    examples: (i.examples ?? []).slice(0, 6),
    gross_margin: m?.gross_margin ?? null,
    operating_margin: m?.operating_margin ?? null,
    net_margin: m?.net_margin ?? null,
    asset_intensity: m?.asset_intensity ?? null,
    notes: m?.notes ?? null,
  };
});

const out = resolve(process.cwd(), "data/content/activity_inputs.json");
writeFileSync(out, JSON.stringify(rows, null, 2));
console.log(`Wrote ${rows.length} activity inputs to ${out}`);
