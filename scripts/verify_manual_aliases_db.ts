/**
 * Plan v24 Block 4.4 (DB hit) — verify a sample of manual aliases has
 * actual rows in regional_cells. URL resolution is necessary but not
 * sufficient: the alias must point to a geo_id that has real data.
 *
 * Run: `npx tsx scripts/verify_manual_aliases_db.ts`
 *
 * Reports PASS/EMPTY for each (country, geo_id) pair across the
 * sample. EMPTY rows do not fail the build (the alias still maps the
 * URL correctly), but flagging them is useful for downstream coverage
 * work.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "node:path";
import { MANUAL_CITY_ALIASES } from "../src/lib/cities/manual_city_aliases";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("FAIL  Missing Supabase env vars.");
  process.exit(1);
}
const client = createClient(url, key, { auth: { persistSession: false } });

type Result = {
  country: string;
  slug: string;
  geo_id: string;
  rows: number;
  industries: number;
};

function resolveGeo(geoId: string): string {
  // Mirror regionalSlugToGeoId: city-overlay codes keep the city-name
  // suffix lowercase, everything else is fully uppercased.
  if (geoId.includes("-city-")) {
    const idx = geoId.indexOf("-city-");
    const prefix = geoId.slice(0, idx).toUpperCase();
    return `${prefix}-CITY-${geoId.slice(idx + 6)}`;
  }
  return geoId.toUpperCase();
}

async function check(
  country: string,
  slug: string,
  geoId: string,
): Promise<Result> {
  const resolved = resolveGeo(geoId);
  const { data, error } = await client
    .from("regional_cells")
    .select("industry_id", { count: "exact" })
    .eq("country", country)
    .eq("geo_id", resolved)
    .limit(500);
  if (error) {
    console.error(`  ERROR ${country}/${slug}/${resolved}: ${error.message}`);
    return { country, slug, geo_id: resolved, rows: 0, industries: 0 };
  }
  const industries = new Set<string>();
  for (const r of data || []) {
    if (r.industry_id) industries.add(r.industry_id as string);
  }
  return {
    country,
    slug,
    geo_id: resolved,
    rows: data?.length || 0,
    industries: industries.size,
  };
}

async function main() {
  const flat: Array<{ country: string; slug: string; geo_id: string }> = [];
  for (const [country, entries] of Object.entries(MANUAL_CITY_ALIASES)) {
    for (const e of entries) {
      flat.push({ country, slug: e.slug, geo_id: e.geo_id });
    }
  }
  console.log(`Probing ${flat.length} manual aliases against regional_cells\n`);

  const results: Result[] = [];
  for (const f of flat) {
    results.push(await check(f.country, f.slug, f.geo_id));
  }

  const empty = results.filter((r) => r.rows === 0);
  const populated = results.filter((r) => r.rows > 0);

  console.log("\n=== Populated aliases (data present) ===");
  for (const r of populated) {
    console.log(
      `  ${r.country}/${r.slug} -> ${r.geo_id}: ${r.rows} rows / ${r.industries} industries`,
    );
  }

  if (empty.length > 0) {
    console.log("\n=== Empty aliases (URL resolves but no data) ===");
    for (const r of empty) {
      console.log(`  ${r.country}/${r.slug} -> ${r.geo_id}: NO ROWS`);
    }
  }

  console.log(
    `\nSUMMARY  ${populated.length} populated, ${empty.length} empty out of ${results.length} total.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
