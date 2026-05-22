import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const client = createClient(url, key, { auth: { persistSession: false } });

async function findCity(country: string, level: string, namePart: string) {
  const { data } = await client
    .from("regional_cells")
    .select("geo_id, geo_name")
    .eq("country", country)
    .eq("geo_level", level)
    .ilike("geo_name", `%${namePart}%`)
    .limit(5);
  const seen = new Set<string>();
  for (const r of data || []) {
    const key = `${r.geo_id}|${r.geo_name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`    ${country} ${level} ${namePart}: ${r.geo_id} = ${r.geo_name}`);
  }
  if (data?.length === 0) console.log(`    ${country} ${level} ${namePart}: NONE`);
}

async function main() {
  console.log("=== GB LADs ===");
  for (const n of [
    "Birmingham",
    "Manchester",
    "Liverpool",
    "Leeds",
    "Sheffield",
    "Edinburgh",
    "Glasgow",
    "Bristol",
    "Newcastle",
    "Cardiff",
    "Belfast",
    "London",
  ]) {
    await findCity("GB", "lad", n);
  }
  console.log("\n=== NL municipalities ===");
  for (const n of [
    "Amsterdam",
    "Rotterdam",
    "'s-Gravenhage",
    "Den Haag",
    "Utrecht",
    "Eindhoven",
  ]) {
    await findCity("NL", "municipality", n);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
