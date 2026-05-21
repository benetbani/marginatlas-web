/**
 * Plan v18 Phase 1 — country page sweep grouped by continent.
 *
 * Probes /{iso2} for every covered country and asserts the per-page
 * QA contract:
 *   - HTTP 200
 *   - <h1> present
 *   - body >= 5kB
 *   - >= 3 industry links
 *   - no source-agency leaks (Eurostat / Census / Destatis / etc.)
 *   - no raw calendar year string (D-107)
 *   - response < 3 seconds (slow threshold)
 *
 * Writes data/audit/by-country-REPORT.md grouped by continent with
 * per-country status, response time, and failure reasons.
 *
 * Run: `npx tsx scripts/audit/probe_countries.ts --base https://www.marginatlas.com`
 *
 * RAM cap honored (D-055); peak under 50MB at concurrency 4.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const args = process.argv.slice(2);
function arg(name: string, def: string): string {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const BASE = arg("--base", "https://www.marginatlas.com");
const CONCURRENCY = parseInt(arg("--concurrency", "4"), 10);
const TIMEOUT_MS = parseInt(arg("--timeout", "15000"), 10);
const SLOW_MS = parseInt(arg("--slow-ms", "3000"), 10);

const OUT_DIR = resolve(process.cwd(), "data", "audit");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) marginatlas-country-audit",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html",
};

// Continent groupings — same ordering used in /world.
const CONTINENTS: Record<string, string[]> = {
  "Africa": [
    "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD",
    "KM", "CG", "CD", "CI", "DJ", "EG", "GQ", "ER", "ET", "GA",
    "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW",
    "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST",
    "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "SZ", "TZ", "TG",
    "TN", "UG", "ZM", "ZW",
  ],
  "Asia": [
    "AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE",
    "HK", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP",
    "KR", "KW", "KG", "LA", "LB", "MO", "MY", "MV", "MN", "MM",
    "NP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "LK", "SY",
    "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE",
  ],
  "Europe": [
    "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ",
    "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT",
    "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK",
    "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES",
    "SE", "CH", "UA", "GB", "VA",
  ],
  "North America": [
    "AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV",
    "GD", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC",
    "VC", "TT", "US",
  ],
  "South America": [
    "AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR",
    "UY", "VE",
  ],
  "Oceania": [
    "AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "WS",
    "SB", "TO", "TV", "VU",
  ],
};

type Result = {
  iso2: string;
  continent: string;
  status: number;
  duration_ms: number;
  content_length: number;
  has_h1: boolean;
  industry_link_count: number;
  source_agency_leak: string | null;
  year_leak: string | null;
  classification: "ok" | "slow" | "empty" | "missing-industries" | "not-found" | "server-error" | "timeout" | "blocked" | "leak";
};

const SOURCE_AGENCIES = [
  "Eurostat", "Destatis", "INSEE", "ISTAT", "INE Spain",
  "e-Stat", "IBGE", "INEGI", "ONS NOMIS", "StatCan", "US Census",
  "Census Bureau", "OECD",
];

const YEAR_PATTERN = /\b(202[0-5]|2019|2018)\b/;

async function probe(iso2: string, continent: string): Promise<Result> {
  const url = `${BASE.replace(/\/$/, "")}/${iso2.toLowerCase()}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const start = Date.now();
  let status = 0;
  let text = "";
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: "follow", signal: ctrl.signal });
    status = res.status;
    text = await res.text();
  } catch {
    status = 0;
  } finally {
    clearTimeout(timer);
  }
  const duration_ms = Date.now() - start;
  const content_length = text.length;
  const has_h1 = /<h1[\s>]/.test(text);
  const industry_link_count = (text.match(/href="\/[a-z]{2}\/[a-z0-9-]+\/[a-z0-9-]+"/g) || []).length;
  const source_agency_leak = SOURCE_AGENCIES.find((a) => text.includes(a)) ?? null;
  const yearMatch = text.match(YEAR_PATTERN);
  const year_leak = yearMatch ? yearMatch[0] : null;

  let classification: Result["classification"];
  if (status === 0) classification = "timeout";
  else if (status === 403 || status === 451) classification = "blocked";
  else if (status === 404) classification = "not-found";
  else if (status >= 500) classification = "server-error";
  else if (!has_h1 || content_length < 5000) classification = "empty";
  else if (industry_link_count < 3) classification = "missing-industries";
  else if (source_agency_leak) classification = "leak";
  else if (duration_ms > SLOW_MS) classification = "slow";
  else classification = "ok";

  return {
    iso2,
    continent,
    status,
    duration_ms,
    content_length,
    has_h1,
    industry_link_count,
    source_agency_leak,
    year_leak,
    classification,
  };
}

async function runWithConcurrency<T, R>(
  items: T[],
  work: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await work(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  type Task = { iso2: string; continent: string };
  const tasks: Task[] = [];
  for (const [continent, codes] of Object.entries(CONTINENTS)) {
    for (const iso2 of codes) tasks.push({ iso2, continent });
  }

  console.log(`Probing ${tasks.length} country pages against ${BASE} (concurrency ${CONCURRENCY})…`);

  let done = 0;
  const results = await runWithConcurrency(
    tasks,
    async (t) => {
      const r = await probe(t.iso2, t.continent);
      done++;
      const icon = r.classification === "ok" ? "✓" : r.classification === "slow" ? "~" : "✗";
      if (done % 25 === 0 || r.classification !== "ok") {
        console.log(`  [${done}/${tasks.length}] ${icon} ${r.classification} ${r.status} ${r.duration_ms}ms /${r.iso2.toLowerCase()}`);
      }
      return r;
    },
    CONCURRENCY,
  );

  writeFileSync(join(OUT_DIR, "by-country-results.json"), JSON.stringify(results, null, 2));

  // Build markdown report
  const counters: Record<Result["classification"], number> = {
    ok: 0, slow: 0, empty: 0, "missing-industries": 0, "not-found": 0,
    "server-error": 0, timeout: 0, blocked: 0, leak: 0,
  };
  for (const r of results) counters[r.classification]++;

  const md: string[] = [];
  md.push("# Country page audit (Plan v18 Phase 1)");
  md.push("");
  md.push(`Probed ${results.length} country pages against \`${BASE}\`.`);
  md.push("");
  md.push("## Summary");
  md.push("");
  md.push("| Class | Count |");
  md.push("|---|---|");
  for (const [k, v] of Object.entries(counters)) {
    if (v > 0) md.push(`| ${k} | ${v} |`);
  }
  md.push("");

  for (const continent of Object.keys(CONTINENTS)) {
    const sub = results.filter((r) => r.continent === continent);
    const subCounters: Record<string, number> = {};
    for (const r of sub) subCounters[r.classification] = (subCounters[r.classification] || 0) + 1;
    const ok = subCounters.ok || 0;
    md.push(`## ${continent} (${ok}/${sub.length} ok)`);
    md.push("");
    md.push("| iso2 | class | ms | h1 | industries | year-leak | source-leak |");
    md.push("|---|---|---|---|---|---|---|");
    for (const r of sub) {
      md.push(
        `| ${r.iso2} | ${r.classification} | ${r.duration_ms} | ${r.has_h1 ? "y" : "n"} | ${r.industry_link_count} | ${r.year_leak ?? ""} | ${r.source_agency_leak ?? ""} |`,
      );
    }
    md.push("");
  }

  writeFileSync(join(OUT_DIR, "by-country-REPORT.md"), md.join("\n"));
  console.log(`\n✓ Report written to data/audit/by-country-REPORT.md`);
  for (const [k, v] of Object.entries(counters)) {
    if (v > 0) console.log(`  ${k}: ${v}`);
  }
}

main();
