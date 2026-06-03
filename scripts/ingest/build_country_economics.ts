/**
 * build_country_economics.ts — turn the research drops into a country-specific
 * economics lookup the render layer can use, WITHOUT touching the database.
 *
 * Mirrors the existing static-file pattern (industry_margins.json). For each
 * (country_iso2, industry_id) it folds the per-band drop data into ONE typical
 * profile: net/gross/operating margin, a normalized cost split, and the firm
 * size distribution. fill_defaults.ts prefers this over the generic per-industry
 * margins when an entry exists, so a Kenyan salon shows Kenyan economics instead
 * of a global average.
 *
 * Modeling: cost_structure_pct sums to 100 as a split of TOTAL COSTS, and
 * net_margin is separate. Total cost = (1 - net_margin) of revenue, so:
 *   gross_margin     = 1 - (cogs/100)               * (1 - net_margin)
 *   operating_margin = 1 - ((cogs+labor+rent)/100)  * (1 - net_margin)
 *   net_margin       = net_margin   (leaves "other" below the operating line)
 * This guarantees gross >= operating >= net.
 *
 * Bands are folded share-of-firms-weighted (the typical firm is the modal one).
 *
 * Run from website/:  npx tsx scripts/ingest/build_country_economics.ts
 * Output:  src/lib/finance/country_industry_economics.json
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const DROPS_DIR = resolve(process.cwd(), "../deep-research/drops");
const OUT = resolve(process.cwd(), "src/lib/finance/country_industry_economics.json");

type Band = {
  band?: string;
  net_margin_pct_low?: number | null;
  net_margin_pct_high?: number | null;
  cost_structure_pct?: { cogs?: number; labor?: number; rent?: number; other?: number } | null;
  share_of_firms_pct?: number | null;
};
type Activity = { industry_id?: string; size_bands?: Band[] };
type Drop = { country_iso2?: string; source_model?: string; confidence_default?: string; activities?: Activity[] };

type Profile = {
  net_margin: number;
  gross_margin: number;
  operating_margin: number;
  cost_structure: { cogs: number; labor: number; rent: number; other: number };
  firm_distribution: Record<string, number>;
  source_model: string;
  confidence: string;
};

function num(x: unknown): number | null {
  return typeof x === "number" && isFinite(x) ? x : null;
}

function foldActivity(a: Activity, srcModel: string, conf: string): Profile | null {
  const bands = (a.size_bands || []).filter((b) => b && b.band);
  if (!bands.length) return null;

  let wSum = 0;
  let nmAcc = 0;
  const cost = { cogs: 0, labor: 0, rent: 0, other: 0 };
  let costW = 0;
  const dist: Record<string, number> = {};
  let nmW = 0;

  for (const b of bands) {
    const share = num(b.share_of_firms_pct);
    const w = share != null && share > 0 ? share : 1;
    wSum += w;
    if (b.band) dist[b.band] = (dist[b.band] || 0) + (share ?? 0);

    const lo = num(b.net_margin_pct_low);
    const hi = num(b.net_margin_pct_high);
    if (lo != null && hi != null) {
      nmAcc += w * ((lo + hi) / 2);
      nmW += w;
    }
    const cs = b.cost_structure_pct;
    if (cs) {
      const c = num(cs.cogs) ?? 0, l = num(cs.labor) ?? 0, r = num(cs.rent) ?? 0, o = num(cs.other) ?? 0;
      const t = c + l + r + o;
      if (t > 0) {
        cost.cogs += w * c; cost.labor += w * l; cost.rent += w * r; cost.other += w * o;
        costW += w;
      }
    }
  }

  if (nmW === 0 || costW === 0) return null; // need both margin and cost to be useful

  const net = nmAcc / nmW / 100; // fraction
  // Normalize the cost split to sum to 100 (also repairs drops that summed to <100).
  let cg = cost.cogs / costW, lb = cost.labor / costW, rt = cost.rent / costW, ot = cost.other / costW;
  const cTot = cg + lb + rt + ot || 1;
  cg = (cg / cTot) * 100; lb = (lb / cTot) * 100; rt = (rt / cTot) * 100; ot = (ot / cTot) * 100;

  const oneMinusNet = 1 - net;
  const gross = 1 - (cg / 100) * oneMinusNet;
  const operating = 1 - ((cg + lb + rt) / 100) * oneMinusNet;

  // Normalize firm distribution to 100 (drops may sum 95-100).
  const distTot = Object.values(dist).reduce((s, v) => s + v, 0) || 1;
  const firm_distribution: Record<string, number> = {};
  for (const [k, v] of Object.entries(dist)) firm_distribution[k] = Math.round((v / distTot) * 1000) / 10;

  const round = (x: number) => Math.round(x * 1000) / 1000;
  return {
    net_margin: round(net),
    gross_margin: round(Math.max(net, gross)),
    operating_margin: round(Math.min(gross, Math.max(net, operating))),
    cost_structure: { cogs: Math.round(cg), labor: Math.round(lb), rent: Math.round(rt), other: Math.round(ot) },
    firm_distribution,
    source_model: srcModel,
    confidence: conf,
  };
}

function main(): void {
  if (!existsSync(DROPS_DIR)) {
    console.error(`drops dir not found: ${DROPS_DIR}`);
    process.exit(1);
  }
  const out: Record<string, Profile> = {};
  let drops = 0, entries = 0, skipped = 0;
  for (const f of readdirSync(DROPS_DIR)) {
    if (!f.endsWith(".json")) continue;
    let d: Drop;
    try { d = JSON.parse(readFileSync(join(DROPS_DIR, f), "utf-8")) as Drop; }
    catch { continue; }
    const iso = (d.country_iso2 || "").toUpperCase();
    if (!iso) continue;
    drops++;
    const src = d.source_model || "research-drop";
    const conf = d.confidence_default || "low";
    for (const a of d.activities || []) {
      const id = a.industry_id;
      if (!id) continue;
      const prof = foldActivity(a, src, conf);
      if (!prof) { skipped++; continue; }
      const key = `${iso}:${id}`;
      // If two drops cover the same (country, industry), keep the richer one
      // (more bands in the distribution); ties keep the first.
      const prev = out[key];
      if (!prev || Object.keys(prof.firm_distribution).length > Object.keys(prev.firm_distribution).length) {
        out[key] = prof;
        if (!prev) entries++;
      }
    }
  }
  const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n", "utf-8");
  console.log(`built ${entries} (country,industry) economics profiles from ${drops} drops (${skipped} activities skipped for missing margin/cost)`);
  console.log(`-> ${OUT}`);
}

main();
