/**
 * Plan v18 Phase 0 — build-time pre-bake of homepage data snapshots.
 *
 * Runs once locally (or on-demand when data changes). Output:
 *   data/snapshots/featured-tiles.json
 *   data/snapshots/cell-of-the-week.json
 *   data/snapshots/popular-cell-rotation.json
 *
 * Frontend components read these JSONs instead of making per-request
 * Supabase round-trips. The homepage goes from 9-11 DB queries on first
 * paint to zero.
 *
 * Streaming friendly: queries are sequential, results are small, peak
 * RAM is well under 50 MB. Honors the 600 MB cap (D-055).
 *
 * Run: `npx tsx scripts/snapshots/build_homepage_snapshots.ts`
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "data", "snapshots");
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://npfqasdghbffqgmzgxzr.supabase.co";

function loadEnvLocal() {
  // Pull SUPABASE_SERVICE_ROLE_KEY out of .env.local without a dep.
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
      if (key === "NEXT_PUBLIC_SUPABASE_URL" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        process.env.NEXT_PUBLIC_SUPABASE_URL = value;
      }
    }
  } catch {
    // ignore
  }
}
loadEnvLocal();

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!SUPABASE_KEY) {
  console.error("✗ SUPABASE_SERVICE_ROLE_KEY not found in env or .env.local");
  process.exit(1);
}

// ----- Snapshot specs (mirror src/app/page.tsx FEATURED + rotation arrays) -----

type CellSpec = {
  iso2: string;
  geo: string;
  industry: string;
};

const FEATURED: CellSpec[] = [
  { iso2: "US", geo: "california",   industry: "software_development" },
  { iso2: "GB", geo: "gb",           industry: "legal_services" },
  { iso2: "DE", geo: "de21",         industry: "fabricated_metal_mfg" },
  { iso2: "JP", geo: "jp-13000",     industry: "restaurants" },
  { iso2: "US", geo: "us-06-037",    industry: "sports_fitness" },
  { iso2: "IT", geo: "itc4c",        industry: "clothing_stores" },
  { iso2: "FR", geo: "fr101",        industry: "jewelry_stores" },
  { iso2: "ES", geo: "es511",        industry: "restaurants" },
  { iso2: "MX", geo: "mx-roo",       industry: "hotels_lodging" },
];

const CELL_OF_THE_WEEK: CellSpec[] = [
  { iso2: "US", geo: "california", industry: "restaurants" },
  { iso2: "US", geo: "new-york",   industry: "real_estate_agencies" },
  { iso2: "DE", geo: "de21",       industry: "fabricated_metal_mfg" },
  { iso2: "FR", geo: "fr101",      industry: "hotels_lodging" },
  { iso2: "US", geo: "texas",      industry: "residential_construction" },
  { iso2: "US", geo: "florida",    industry: "hairdressers_beauty" },
  { iso2: "US", geo: "california", industry: "software_development" },
  { iso2: "IT", geo: "itc4c",      industry: "restaurants" },
  { iso2: "JP", geo: "jp-13000",   industry: "restaurants" },
];

const POPULAR_ROTATION: CellSpec[] = [
  { iso2: "US", geo: "california",            industry: "restaurants" },
  { iso2: "US", geo: "new-york",              industry: "real_estate_agencies" },
  { iso2: "US", geo: "florida",               industry: "hairdressers_beauty" },
  { iso2: "US", geo: "texas",                 industry: "auto_repair_shops" },
  { iso2: "US", geo: "california",            industry: "software_development" },
  { iso2: "US", geo: "district-of-columbia",  industry: "management_consulting" },
  { iso2: "DE", geo: "de21",                  industry: "fabricated_metal_mfg" },
  { iso2: "FR", geo: "fr101",                 industry: "hotels_lodging" },
  { iso2: "IT", geo: "itc4c",                 industry: "restaurants" },
  { iso2: "JP", geo: "jp-13000",              industry: "restaurants" },
];

// ----- Supabase REST helpers -----

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

async function selectOne(
  table: string,
  filters: Record<string, string>,
  cols = "*",
): Promise<Record<string, unknown> | null> {
  const qs = new URLSearchParams({ select: cols, limit: "1" });
  for (const [k, v] of Object.entries(filters)) qs.set(k, `eq.${v}`);
  const url = `${SUPABASE_URL}/rest/v1/${table}?${qs.toString()}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return null;
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows[0] || null;
  } catch {
    return null;
  }
}

// ----- ISO-2 → ISO-3 (minimal subset, expanded as needed) -----
const ISO2_TO_ISO3: Record<string, string> = {
  US: "USA", GB: "GBR", DE: "DEU", FR: "FRA", IT: "ITA", ES: "ESP",
  JP: "JPN", BR: "BRA", MX: "MEX", CA: "CAN", AU: "AUS", NL: "NLD",
  IN: "IND", CN: "CHN", RU: "RUS", PL: "POL", PT: "PRT", BE: "BEL",
  AT: "AUT", CH: "CHE", SE: "SWE", NO: "NOR", DK: "DNK", FI: "FIN",
  IE: "IRL", GR: "GRC", CZ: "CZE", HU: "HUN", RO: "ROU",
};

// ----- Cell resolution (lite version of getCellBySlug) -----

type CellSummary = {
  iso2: string;
  geo: string;
  industry_id: string;
  // surface fields
  revenue_per_firm: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
  quality_score: number | null;
  coverage_tier: string | null;
  year: number;
  // human labels
  geo_name: string | null;
  industry_name: string | null;
};

const API_BASE = process.env.SNAPSHOT_API_BASE || "https://www.marginatlas.com";

/** Cell resolution via the production /api/cell-snapshot endpoint, which
 * already implements the full fallback chain. Falls back to direct
 * Supabase queries if the API is unreachable. */
async function resolveCell(spec: CellSpec): Promise<CellSummary | null> {
  const iso2 = spec.iso2.toUpperCase();
  // Industry IDs in the DB use underscores; the API expects the slug form
  // (hyphen) per industryToSlug().
  const industrySlug = spec.industry.replace(/_/g, "-");
  // Try the production API first — it has the parent-fallback walk.
  try {
    const qs = new URLSearchParams({
      country: spec.iso2.toLowerCase(),
      geo: spec.geo,
      industry: industrySlug,
    });
    const res = await fetch(`${API_BASE}/api/cell-snapshot?${qs.toString()}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 marginatlas-snapshot-builder",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const json = (await res.json()) as {
        found?: boolean;
        revenue_per_firm?: number | null;
        n_enterprises?: number | null;
        quality_score?: number | null;
        year?: number | null;
      };
      if (json.found && json.revenue_per_firm != null) {
        return {
          iso2,
          geo: spec.geo,
          industry_id: spec.industry,
          revenue_per_firm: json.revenue_per_firm ?? null,
          n_enterprises: json.n_enterprises ?? null,
          n_employees: null,
          payroll_per_employee: null,
          quality_score: json.quality_score ?? null,
          coverage_tier: null,
          year: json.year ?? 2025,
          geo_name: null,
          industry_name: null,
        };
      }
    }
  } catch {
    // Fall through to Supabase direct.
  }

  // Fallback: direct Supabase REST. Best-effort across the three tables.
  const geoSlug = spec.geo.toLowerCase();
  const geoIdUpper = geoSlug.toUpperCase();
  const regional = await selectOne("regional_cells", {
    country: iso2,
    geo_id: geoIdUpper,
    industry_id: spec.industry,
  });
  if (regional) {
    return {
      iso2,
      geo: spec.geo,
      industry_id: spec.industry,
      revenue_per_firm: (regional.revenue_per_firm as number | null) ?? (regional.rev_p50 as number | null) ?? null,
      n_enterprises: (regional.n_enterprises as number | null) ?? null,
      n_employees: (regional.n_employees as number | null) ?? null,
      payroll_per_employee: (regional.payroll_per_employee as number | null) ?? null,
      quality_score: (regional.quality_score as number | null) ?? null,
      coverage_tier: (regional.coverage_tier as string | null) ?? "P",
      year: (regional.year as number) || 2024,
      geo_name: (regional.geo_name as string | null) ?? null,
      industry_name: null,
    };
  }

  const iso3 = ISO2_TO_ISO3[iso2] || iso2;
  const extra = await selectOne("extrapolated_cells", {
    country_iso3: iso3,
    industry_id: spec.industry,
    size_band: "total",
  });
  if (extra) {
    return {
      iso2,
      geo: spec.geo,
      industry_id: spec.industry,
      revenue_per_firm: (extra.predicted_rev_per_firm as number | null) ?? null,
      n_enterprises: null,
      n_employees: null,
      payroll_per_employee: null,
      quality_score: (extra.quality_score as number | null) ?? 35,
      coverage_tier: (extra.coverage_tier as string | null) ?? "X",
      year: (extra.year as number) || 2024,
      geo_name: (extra.country_name as string | null) ?? null,
      industry_name: null,
    };
  }

  return null;
}

// ----- Driver -----

async function buildSnapshot(name: string, specs: CellSpec[]): Promise<CellSummary[]> {
  const out: CellSummary[] = [];
  for (const spec of specs) {
    const cell = await resolveCell(spec);
    if (cell) out.push(cell);
    else {
      // Keep order; insert a placeholder so the frontend knows the slot was attempted.
      out.push({
        iso2: spec.iso2,
        geo: spec.geo,
        industry_id: spec.industry,
        revenue_per_firm: null,
        n_enterprises: null,
        n_employees: null,
        payroll_per_employee: null,
        quality_score: null,
        coverage_tier: null,
        year: 2025,
        geo_name: null,
        industry_name: null,
      });
    }
  }
  console.log(
    `  ${name}: ${out.filter((c) => c.revenue_per_firm != null).length} / ${specs.length} resolved`,
  );
  return out;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  console.log("Building homepage snapshots…");
  const featured = await buildSnapshot("featured", FEATURED);
  const cotw = await buildSnapshot("cell-of-the-week", CELL_OF_THE_WEEK);
  const popular = await buildSnapshot("popular-rotation", POPULAR_ROTATION);

  writeFileSync(
    join(OUT_DIR, "featured-tiles.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), cells: featured }, null, 2),
  );
  writeFileSync(
    join(OUT_DIR, "cell-of-the-week.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), cells: cotw }, null, 2),
  );
  writeFileSync(
    join(OUT_DIR, "popular-cell-rotation.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), cells: popular }, null, 2),
  );
  console.log(`✓ Snapshots written to ${OUT_DIR}`);
}

main();
