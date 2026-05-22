/**
 * Plan v24 Block 4.4 — full inventory of geo_id codes present in
 * regional_cells per European country. Diagnoses why the NUTS-3 manual
 * aliases (DE712, FRK26, etc.) return zero rows.
 *
 * Output: data/quality/eu_geo_inventory.json
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const client = createClient(url, key, { auth: { persistSession: false } });

const COUNTRIES = [
  "DE",
  "FR",
  "GB",
  "IT",
  "ES",
  "NL",
  "BE",
  "CH",
  "AT",
  "PL",
  "PT",
  "SE",
  "DK",
  "NO",
  "FI",
  "GR",
  "CZ",
  "HU",
  "RO",
  "TR",
  "RU",
  "IE",
];

type Inventory = {
  country: string;
  totalRows: number;
  uniqueGeos: number;
  byLevel: Record<string, number>;
  sample: Array<{ geo_id: string; geo_level: string; geo_name: string }>;
};

async function inventory(country: string): Promise<Inventory> {
  const seen = new Map<string, { level: string; name: string }>();
  const byLevel: Record<string, number> = {};
  let total = 0;
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await client
      .from("regional_cells")
      .select("geo_id, geo_level, geo_name")
      .eq("country", country)
      .range(offset, offset + pageSize - 1);
    if (error || !data || data.length === 0) break;
    for (const r of data) {
      total++;
      const geoId = (r.geo_id as string) || "";
      const level = (r.geo_level as string) || "?";
      const name = (r.geo_name as string) || "";
      if (!seen.has(geoId)) seen.set(geoId, { level, name });
    }
    if (data.length < pageSize) break;
    offset += pageSize;
    if (offset > 50000) break;
  }
  for (const { level } of seen.values()) {
    byLevel[level] = (byLevel[level] || 0) + 1;
  }
  return {
    country,
    totalRows: total,
    uniqueGeos: seen.size,
    byLevel,
    sample: Array.from(seen.entries())
      .slice(0, 25)
      .map(([geo_id, v]) => ({ geo_id, geo_level: v.level, geo_name: v.name })),
  };
}

async function main() {
  const out: Inventory[] = [];
  for (const c of COUNTRIES) {
    process.stdout.write(`  ${c}... `);
    const inv = await inventory(c);
    out.push(inv);
    console.log(`${inv.uniqueGeos} unique geos (${inv.totalRows} rows)`);
    for (const [lvl, n] of Object.entries(inv.byLevel)) {
      console.log(`    ${lvl}: ${n}`);
    }
  }
  mkdirSync(resolve(process.cwd(), "data", "quality"), { recursive: true });
  const path = resolve(process.cwd(), "data", "quality", "eu_geo_inventory.json");
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${path}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
