/**
 * Plan v24 Block 4.4 — diagnostic: what geo_id format does regional_cells
 * actually use for European cities? The case-insensitive probe found
 * zero rows for DE712, FRK26, UKG31, etc. — but the data may be there
 * under a different code format (lowercase, NUTS-2 only, etc.).
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const client = createClient(url, key, { auth: { persistSession: false } });

async function probe(country: string) {
  console.log(`\n=== ${country} ===`);
  const { data } = await client
    .from("regional_cells")
    .select("geo_id, geo_level, geo_name")
    .eq("country", country)
    .limit(20);
  if (!data || data.length === 0) {
    console.log("  (no rows)");
    return;
  }
  for (const r of data) {
    console.log(
      `  geo_id=${r.geo_id} level=${r.geo_level} name=${r.geo_name}`,
    );
  }
}

async function probePattern(country: string, prefix: string) {
  console.log(`\n=== ${country} where geo_id like '${prefix}%' ===`);
  const { data } = await client
    .from("regional_cells")
    .select("geo_id, geo_level, geo_name")
    .eq("country", country)
    .ilike("geo_id", `${prefix}%`)
    .limit(30);
  if (!data || data.length === 0) {
    console.log("  (no rows)");
    return;
  }
  const seen = new Set<string>();
  for (const r of data) {
    const key = `${r.geo_id}|${r.geo_level}|${r.geo_name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(
      `  geo_id=${r.geo_id} level=${r.geo_level} name=${r.geo_name}`,
    );
  }
}

async function main() {
  for (const c of ["DE", "FR", "GB", "IT", "ES"]) {
    await probe(c);
  }
  console.log("\n--- Targeted probes ---");
  await probePattern("DE", "de7");
  await probePattern("DE", "DE7");
  await probePattern("FR", "fr");
  await probePattern("GB", "uk");
  await probePattern("IT", "it");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
