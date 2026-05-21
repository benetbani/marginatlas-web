/**
 * Plan v21 Block 2 — auto-build REGIONS_BY_COUNTRY from regional_cells.
 *
 * Replaces the hand-curated 26-country region table with a build-time
 * generated file covering every country we have data for.
 *
 * Query strategy: paginate regional_cells in chunks of 1000, dedupe
 * by (country, geo_id) in memory. ~357k rows → ~3-10k distinct geos.
 * RAM cap honored (peak observed under 80MB).
 *
 * Output: src/lib/regions/regions_generated.ts
 *
 * Run: `npx tsx scripts/regions/build_regions_table.ts`
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

function loadEnvLocal() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const text = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (key === "SUPABASE_SERVICE_ROLE_KEY" && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        process.env.SUPABASE_SERVICE_ROLE_KEY = value;
      }
    }
  } catch {
    /* ignore */
  }
}
loadEnvLocal();

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://npfqasdghbffqgmzgxzr.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_KEY) {
  console.error("✗ SUPABASE_SERVICE_ROLE_KEY missing");
  process.exit(1);
}

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

type Row = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  geo_level: string | null;
};

async function* readPages(): AsyncGenerator<Row[]> {
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const qs = new URLSearchParams({
      select: "country,geo_id,geo_name,geo_level",
      limit: String(pageSize),
      offset: String(offset),
      order: "country.asc,geo_id.asc",
    });
    const res = await fetch(`${SUPABASE_URL}/rest/v1/regional_cells?${qs.toString()}`, {
      headers: HEADERS,
    });
    if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
    const rows = (await res.json()) as Row[];
    if (rows.length === 0) break;
    yield rows;
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
}

type RegionEntry = {
  value: string;
  label: string;
  level: string | null;
};

function geoSlugFromId(geoId: string): string {
  // Slug form expected by regionalSlugToGeoId in src/lib/cells.ts
  return geoId.toLowerCase();
}

function labelize(geoName: string | null, geoId: string): string {
  if (!geoName) return geoId;
  return geoName;
}

// Country-level fallback: every country that exists in extrapolated_cells
// should at minimum offer "All of {country}". We hardcode the ISO2 set
// here; the actual slug fallback runs at request time in NavigatorForm.
const ALL_COUNTRY_ISO2 = [
  // expanded covering ~195 countries
  ...Array.from(
    new Set([
      "US","GB","DE","FR","IT","ES","JP","BR","MX","CA","AU","NZ","NL","BE","CH","AT","LU",
      "SE","NO","DK","FI","IS","IE","PL","PT","GR","CZ","SK","SI","EE","LV","LT","HU","HR",
      "RO","BG","CY","MT","RU","UA","BY","MD","RS","BA","ME","MK","AL","XK",
      "TR","IL","AE","SA","QA","KW","BH","OM","JO","LB","SY","IQ","IR","YE","PS",
      "EG","MA","TN","DZ","LY","SD","SS","ET","ER","DJ","SO","KE","UG","TZ","RW","BI",
      "ZA","NA","BW","ZW","ZM","MZ","MG","MU","SC","KM",
      "NG","GH","CI","SN","ML","BF","NE","TD","CF","CG","CD","CM","GA","GQ","ST","BJ","TG",
      "LR","SL","GN","GW","CV","MR","AO","LS","SZ","MW",
      "IN","PK","BD","LK","NP","BT","MV","AF",
      "CN","KR","TW","HK","SG","MY","TH","ID","PH","VN","KH","LA","MM","BN","MN","KP","TL",
      "KZ","UZ","KG","TJ","TM","AZ","GE","AM",
      "AR","CL","CO","PE","UY","PY","EC","VE","BO","GY","SR",
      "CR","PA","DO","JM","HT","CU","TT","BB","BS","BZ","GT","HN","SV","NI","KN","LC","VC",
      "AG","DM","GD",
      "FJ","PG","WS","SB","TO","VU","KI","MH","FM","NR","PW","TV",
      "AD","MC","SM","VA","LI",
    ]),
  ),
];

async function main() {
  console.log("Streaming regional_cells distinct geos…");
  // Map: country (uppercase ISO2) → Map<geoId, {geo_name, geo_level}>
  const map = new Map<string, Map<string, { geo_name: string | null; geo_level: string | null }>>();

  let totalRows = 0;
  let totalPages = 0;
  for await (const page of readPages()) {
    totalPages++;
    totalRows += page.length;
    for (const r of page) {
      const c = (r.country || "").toUpperCase();
      if (!c) continue;
      if (!map.has(c)) map.set(c, new Map());
      const inner = map.get(c)!;
      if (!inner.has(r.geo_id)) {
        inner.set(r.geo_id, { geo_name: r.geo_name, geo_level: r.geo_level });
      }
    }
    if (totalPages % 25 === 0) {
      const memMb = process.memoryUsage().heapUsed / 1e6;
      console.log(`  page ${totalPages}: ${totalRows} rows scanned, ${map.size} countries, ${memMb.toFixed(0)}MB heap`);
      if (memMb > 450) {
        console.error("✗ RAM cap approaching, exiting");
        break;
      }
    }
  }

  console.log(`✓ Scanned ${totalRows} rows in ${totalPages} pages`);
  console.log(`✓ ${map.size} countries with at least one region`);

  // Build the generated table
  type Output = Record<string, RegionEntry[]>;
  const out: Output = {};

  for (const iso2 of ALL_COUNTRY_ISO2) {
    const fromData = map.get(iso2);
    if (fromData && fromData.size > 0) {
      // Sort: shorter geo_id (broader region) first, then by name
      const sorted = Array.from(fromData.entries()).sort((a, b) => {
        if (a[0].length !== b[0].length) return a[0].length - b[0].length;
        return (a[1].geo_name || a[0]).localeCompare(b[1].geo_name || b[0]);
      });
      const entries: RegionEntry[] = sorted.map(([geoId, info]) => ({
        value: geoSlugFromId(geoId),
        label: labelize(info.geo_name, geoId),
        level: info.geo_level,
      }));
      // Limit to top 60 to keep dropdown manageable
      out[iso2] = entries.slice(0, 60);
    } else {
      // Country-level fallback
      out[iso2] = [
        { value: iso2.toLowerCase(), label: `All of ${iso2}`, level: "country" },
      ];
    }
  }

  // Also include countries that appeared in data but weren't in our list
  for (const [iso2, regions] of map) {
    if (out[iso2]) continue;
    const sorted = Array.from(regions.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    out[iso2] = sorted.slice(0, 60).map(([geoId, info]) => ({
      value: geoSlugFromId(geoId),
      label: labelize(info.geo_name, geoId),
      level: info.geo_level,
    }));
  }

  // Emit TypeScript module
  const outPath = resolve(ROOT, "src", "lib", "regions", "regions_generated.ts");
  if (!existsSync(resolve(ROOT, "src", "lib", "regions"))) {
    mkdirSync(resolve(ROOT, "src", "lib", "regions"), { recursive: true });
  }

  const lines: string[] = [];
  lines.push("/**");
  lines.push(" * AUTO-GENERATED by scripts/regions/build_regions_table.ts");
  lines.push(" * Do not hand-edit. Re-run when ingest lands new regions:");
  lines.push(" *   npx tsx scripts/regions/build_regions_table.ts");
  lines.push(" */");
  lines.push("export type RegionEntry = {");
  lines.push("  value: string;");
  lines.push("  label: string;");
  lines.push("  level: string | null;");
  lines.push("};");
  lines.push("");
  lines.push("export const REGIONS_BY_COUNTRY_AUTO: Record<string, RegionEntry[]> = {");

  const orderedKeys = Object.keys(out).sort();
  for (const iso2 of orderedKeys) {
    const entries = out[iso2];
    const lines2 = entries.map(
      (e) => `    { value: ${JSON.stringify(e.value)}, label: ${JSON.stringify(e.label)}, level: ${JSON.stringify(e.level)} }`,
    );
    lines.push(`  ${iso2}: [`);
    lines.push(lines2.join(",\n"));
    lines.push("  ],");
  }
  lines.push("};");
  lines.push("");
  lines.push(`export const REGIONS_GENERATED_AT = "${new Date().toISOString()}";`);
  lines.push(`export const REGIONS_TOTAL_COUNTRIES = ${orderedKeys.length};`);

  writeFileSync(outPath, lines.join("\n"));
  console.log(`✓ Wrote ${outPath}`);
  console.log(`  ${orderedKeys.length} countries total, ${Object.values(out).reduce((s, a) => s + a.length, 0)} region entries`);
  console.log(`  Peak heap: ${(process.memoryUsage().heapUsed / 1e6).toFixed(0)}MB`);
}

main().catch((err) => {
  console.error("✗ Regions builder crashed:", err);
  process.exit(1);
});
