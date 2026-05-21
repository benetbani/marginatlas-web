/**
 * Plan v17 Phase 1.1 — URL inventory generator.
 *
 * Walks src/ for every URL literal the site can emit, fans out dynamic
 * routes from the taxonomy + regions data, samples a representative slice
 * of cell URLs, and writes data/audit/url-inventory.json.
 *
 * Run: `npx tsx scripts/audit/enumerate_urls.ts`
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

type Url = {
  path: string;
  source: "literal" | "sector" | "industry" | "country" | "cell" | "api" | "static";
  origin?: string;
};

const ROOT = process.cwd();
const SRC = resolve(ROOT, "src");
const OUT_DIR = resolve(ROOT, "data", "audit");

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

function extractLiterals(): Url[] {
  const out: Url[] = [];
  const files = walk(SRC);
  // Match href="...", router.push("..."), redirect("..."), <Link href="...">
  const patterns = [
    /href=["']([^"']+)["']/g,
    /router\.push\(["']([^"']+)["']\)/g,
    /redirect\(["']([^"']+)["']\)/g,
    /window\.location\.href\s*=\s*["']([^"']+)["']/g,
  ];
  for (const file of files) {
    const src = readFileSync(file, "utf-8");
    for (const re of patterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(src)) !== null) {
        const u = m[1].trim();
        if (!u || u.startsWith("#") || u.startsWith("mailto:") || u.startsWith("tel:") || u.startsWith("http")) continue;
        if (u.includes("${")) continue; // template literal; will fan via dynamic routes
        out.push({ path: u, source: "literal", origin: file.replace(ROOT, ".") });
      }
    }
  }
  return out;
}

function loadJson<T>(p: string): T {
  return JSON.parse(readFileSync(p, "utf-8")) as T;
}

type Sector = { id: string; audience_default?: string };
type Industry = { id: string; audience?: string };
type CountryEntry = { code: string };

function slugify(id: string): string {
  return id.replace(/_/g, "-").toLowerCase();
}

function fanSectors(): Url[] {
  const data = loadJson<{ sectors: Sector[] }>(resolve(SRC, "lib/taxonomy/sectors.json"));
  return data.sectors
    .filter((s) => (s.audience_default ?? "visible") !== "hidden")
    .map((s) => ({ path: `/sectors/${s.id}`, source: "sector" as const, origin: s.id }));
}

function fanIndustries(): Url[] {
  const data = loadJson<{ industries: Industry[] }>(resolve(SRC, "lib/taxonomy/industries.json"));
  return data.industries
    .filter((i) => {
      const a = i.audience ?? "smb_friendly";
      return a === "smb_core" || a === "smb_friendly";
    })
    .map((i) => ({ path: `/industries/${slugify(i.id)}`, source: "industry" as const, origin: i.id }));
}

function fanCountries(): Url[] {
  // COUNTRIES is generated at runtime from taxonomy.ts; for the inventory
  // we read the ISO-2 list off the regions table since it's authoritative.
  const regionsFile = readFileSync(resolve(SRC, "lib/regions/regions-by-country.ts"), "utf-8");
  const iso2s = Array.from(regionsFile.matchAll(/^\s\s([A-Z]{2}):\s\[/gm)).map((m) => m[1]);
  // Plus a handful of countries that may not be in the regions table but
  // are valid country pages (extrapolated_cells coverage).
  const extra = ["US", "GB", "DE", "FR", "IT", "ES", "JP", "BR", "MX", "CA", "AU", "NL", "IN", "CN", "RU"];
  const dedup = new Set<string>([...iso2s, ...extra]);
  return Array.from(dedup).map((iso2) => ({
    path: `/${iso2.toLowerCase()}`,
    source: "country" as const,
    origin: iso2,
  }));
}

function sampledCells(): Url[] {
  // A representative slice of /{country}/{geo}/{industry} URLs taken from
  // chapter 12 + 15 verification lists. These are known-good slugs so
  // failures here mean genuine route or data regressions.
  const samples: Array<[string, string, string]> = [
    ["us", "california", "restaurants"],
    ["us", "new-york", "legal-services"],
    ["us", "us-06-037", "restaurants"],
    ["us", "us-06-037", "sports-fitness"],
    ["gb", "gb", "legal-services"],
    ["de", "de21", "fabricated-metal-mfg"],
    ["de", "de212", "restaurants"],
    ["fr", "fr101", "jewelry-stores"],
    ["fr", "fr101", "restaurants"],
    ["it", "itc4c", "clothing-stores"],
    ["it", "itc4c", "restaurants"],
    ["es", "es511", "restaurants"],
    ["jp", "jp-13000", "restaurants"],
    ["jp", "japan", "restaurants"],
    ["br", "br-sp", "restaurants"],
    ["br", "br-city-sao-paulo", "restaurants"],
    ["mx", "mexico", "wholesale-food-beverages"],
    ["mx", "mx-roo", "hotels-lodging"],
    ["ca", "ca-on", "restaurants"],
    ["au", "au-nsw", "restaurants"],
    ["in", "india", "software-development"],
  ];
  return samples.map(([country, geo, industry]) => ({
    path: `/${country}/${geo}/${industry}`,
    source: "cell" as const,
    origin: `${country}|${geo}|${industry}`,
  }));
}

function apiSamples(): Url[] {
  return [
    { path: "/api/cell-lookup?country=us&industry=restaurants&region=california", source: "api" },
    { path: "/api/cell-snapshot?country=us&geo=california&industry=restaurants", source: "api" },
    { path: "/api/popular-cell-snapshot", source: "api" },
    {
      path: "/api/export-csv?country=us&region=california&industry=restaurants",
      source: "api",
    },
  ];
}

function staticTop(): Url[] {
  return [
    { path: "/", source: "static" },
    { path: "/pricing", source: "static" },
    { path: "/world", source: "static" },
    { path: "/compare", source: "static" },
    { path: "/you", source: "static" },
    { path: "/saved", source: "static" },
    { path: "/browse", source: "static" },
    { path: "/industries", source: "static" },
    { path: "/sectors", source: "static" },
    { path: "/about-data", source: "static" },
    { path: "/methodology", source: "static" },
    { path: "/coverage", source: "static" },
    { path: "/blog", source: "static" },
    { path: "/random", source: "static" },
    { path: "/calculator", source: "static" },
    { path: "/ask", source: "static" },
    { path: "/status", source: "static" },
    { path: "/sitemap.xml", source: "static" },
    { path: "/robots.txt", source: "static" },
  ];
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const all: Url[] = [
    ...staticTop(),
    ...fanSectors(),
    ...fanIndustries(),
    ...fanCountries(),
    ...sampledCells(),
    ...apiSamples(),
    ...extractLiterals(),
  ];
  // Dedup by path, keep first source attribution
  const seen = new Set<string>();
  const dedup = all.filter((u) => {
    if (seen.has(u.path)) return false;
    seen.add(u.path);
    return true;
  });
  const outPath = join(OUT_DIR, "url-inventory.json");
  writeFileSync(outPath, JSON.stringify(dedup, null, 2));
  console.log(`✓ Inventory: ${dedup.length} unique URLs written to ${outPath}`);
  console.log(`  static: ${dedup.filter((u) => u.source === "static").length}`);
  console.log(`  sector: ${dedup.filter((u) => u.source === "sector").length}`);
  console.log(`  industry: ${dedup.filter((u) => u.source === "industry").length}`);
  console.log(`  country: ${dedup.filter((u) => u.source === "country").length}`);
  console.log(`  cell: ${dedup.filter((u) => u.source === "cell").length}`);
  console.log(`  api: ${dedup.filter((u) => u.source === "api").length}`);
  console.log(`  literal: ${dedup.filter((u) => u.source === "literal").length}`);
}

main();
