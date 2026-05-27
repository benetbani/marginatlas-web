/**
 * scripts/data/parse_au_primary_benchmarks.ts
 *
 * Phase 1 — Australia flagship parser.
 *
 * Reads the ATO Small Business Benchmarks markdown export at
 * data/finance/au_primary_benchmarks_v1.md and produces the
 * structured JSON at data/finance/au_primary_benchmarks_v1.json.
 *
 * The markdown is a "print all" dump of the ATO A-Z page. Structure
 * is repetitive across ~100 industries:
 *
 *   <Industry name>
 *   Check the performance benchmarks for <industry>.
 *   Last updated <date>
 *   On this page
 *   Businesses in this industry
 *   What are performance benchmarks
 *   Key benchmark range
 *   2023-24 benchmarks
 *   Businesses in this industry
 *   <description>
 *   What are performance benchmarks
 *   Performance benchmarks use information reported on tax returns ...
 *   Key benchmark range
 *   <Key benchmark type> to turnover is the key benchmark range ...
 *   ...
 *   2023-24 benchmarks
 *   Key benchmarks for 2023-24
 *   Annual turnover range
 *   $<low> – $<mid>
 *   $<mid+1> – $<high>
 *   More than $<high>
 *   '<ratio name>' divided by 'Annual turnover'
 *   <low>% to <high>%
 *   <low>% to <high>%
 *   <low>% to <high>%
 *   Average <ratio name>
 *   <avg>%
 *   <avg>%
 *   <avg>%
 *   ...
 *   QC<digits>
 *
 * Run: npx tsx scripts/data/parse_au_primary_benchmarks.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MD_PATH = path.resolve(ROOT, "data/finance/au_primary_benchmarks_v1.md");
const OUT_PATH = path.resolve(ROOT, "data/finance/au_primary_benchmarks_v1.json");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Ratio = "total_expenses" | "cost_of_sales" | "labour" | "rent" | "motor_vehicle" | "other";

export type RatioRange = {
  /** Lower bound as a decimal fraction of turnover (0..1). */
  low: number;
  /** Upper bound as a decimal fraction of turnover (0..1). */
  high: number;
};

export type BandRatio = {
  /** Per-band low-high range. Three entries (small / medium / large). */
  ranges: [RatioRange, RatioRange, RatioRange];
  /** Per-band average value (decimal fraction). Only populated for the
   *  key benchmark; the ATO doesn't publish averages for non-key ratios. */
  averages?: [number, number, number];
};

export type Band = {
  /** Lower turnover bound in AUD, inclusive. */
  min_aud: number;
  /** Upper turnover bound in AUD, exclusive. null for the open-ended top band. */
  max_aud: number | null;
};

export type AustralianIndustry = {
  /** ATO display name. */
  ato_name: string;
  /** Last updated date string from the ATO page. */
  last_updated: string;
  /** ATO content-management identifier (QC<digits>). */
  qc_id: string;
  /** Short description of which businesses are covered. */
  description: string;
  /** Which ratio the ATO designates as the headline. */
  key_benchmark: "total_expenses" | "cost_of_sales";
  /** Three turnover bands (small / medium / large), AUD per year. */
  bands: [Band, Band, Band];
  /** Map from ratio name to per-band ranges. */
  ratios: Partial<Record<Ratio, BandRatio>>;
};

export type ParsedFile = {
  version: string;
  source: string;
  source_year: string;
  source_url: string;
  parsed_at: string;
  /** Total industries successfully parsed. */
  industry_count: number;
  industries: Record<string, AustralianIndustry>;
};

// ---------------------------------------------------------------------------
// Parser utilities
// ---------------------------------------------------------------------------

/** Parse "$50,000 - $150,000" or "More than $600,000" or "$0 - $50,000" into a Band. */
function parseBand(s: string): Band | null {
  const cleaned = s.replace(/[–—]/g, "-").trim();
  // "More than $600,000"
  const moreMatch = cleaned.match(/More than\s+\$([\d,]+)/i);
  if (moreMatch) {
    return { min_aud: parseUsd(moreMatch[1]) + 1, max_aud: null };
  }
  // "$50,000 - $150,000"
  const rangeMatch = cleaned.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
  if (rangeMatch) {
    return { min_aud: parseUsd(rangeMatch[1]), max_aud: parseUsd(rangeMatch[2]) };
  }
  return null;
}

function parseUsd(s: string): number {
  return parseInt(s.replace(/[,$]/g, ""), 10);
}

/** Parse "26% to 45%" into { low: 0.26, high: 0.45 } */
function parsePercentRange(s: string): RatioRange | null {
  const cleaned = s.trim();
  // "26% to 45%"
  const m = cleaned.match(/(\d+(?:\.\d+)?)\s*%\s*to\s*(\d+(?:\.\d+)?)\s*%/);
  if (m) {
    return { low: parseFloat(m[1]) / 100, high: parseFloat(m[2]) / 100 };
  }
  return null;
}

/** Parse "63%" into 0.63 */
function parsePercent(s: string): number | null {
  const cleaned = s.trim();
  const m = cleaned.match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (m) return parseFloat(m[1]) / 100;
  return null;
}

/**
 * Detect ratio name from the ATO heading.
 * "'Total expenses' divided by 'Annual turnover'" → total_expenses
 * "'Cost of sales' divided by 'Annual turnover'" → cost_of_sales
 * "Average total expenses" → total_expenses (as average source)
 */
function detectRatio(s: string): Ratio | null {
  const lower = s.toLowerCase();
  if (lower.includes("total expenses")) return "total_expenses";
  if (lower.includes("cost of sales")) return "cost_of_sales";
  if (lower.includes("labour") || lower.includes("labor")) return "labour";
  if (lower.includes("rent")) return "rent";
  if (lower.includes("motor vehicle")) return "motor_vehicle";
  return null;
}

function detectKeyBenchmark(text: string): "total_expenses" | "cost_of_sales" {
  // ATO sentence: "<Type> to turnover is the key benchmark range for this industry."
  const m = text.match(/^(.+?)\s+to turnover is the key benchmark range/im);
  if (m) {
    const which = m[1].toLowerCase().trim();
    if (which.includes("cost of sales")) return "cost_of_sales";
  }
  return "total_expenses";
}

/** Industry-id slug from ATO display name. */
function slugifyIndustry(name: string): string {
  return name
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

function parseMarkdown(md: string): AustralianIndustry[] {
  const lines = md.split(/\r?\n/);

  // Find boundaries: each industry ends with "QC<digits>".
  const qcLineIndices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^QC\d+$/.test(lines[i].trim())) qcLineIndices.push(i);
  }
  if (qcLineIndices.length === 0) throw new Error("No QC identifiers found; file may be malformed");

  const industries: AustralianIndustry[] = [];
  let start = 0;
  for (const qcIdx of qcLineIndices) {
    const block = lines.slice(start, qcIdx + 1);
    const parsed = parseIndustryBlock(block);
    if (parsed) industries.push(parsed);
    start = qcIdx + 1;
  }
  return industries;
}

function parseIndustryBlock(block: string[]): AustralianIndustry | null {
  // First non-blank line is the industry name.
  const firstIdx = block.findIndex((l) => l.trim().length > 0);
  if (firstIdx < 0) return null;
  const atoName = block[firstIdx].trim();

  const text = block.join("\n");
  const qcMatch = text.match(/QC(\d+)/);
  const qcId = qcMatch ? `QC${qcMatch[1]}` : "";

  const updatedMatch = text.match(/Last updated\s+([^\n]+)/);
  const lastUpdated = updatedMatch ? updatedMatch[1].trim() : "";

  // Description: between the first "Businesses in this industry" heading
  // and the next "What are performance benchmarks" heading.
  let description = "";
  const descMatch = text.match(
    /Businesses in this industry\s*\n((?:[^\n]+\n)+?)What are performance benchmarks/,
  );
  if (descMatch) description = descMatch[1].trim();

  // Key benchmark detection.
  const keyBenchmark = detectKeyBenchmark(text);

  // Find the "Annual turnover range" block — there are typically two
  // (one for key benchmarks, one for other benchmarks) but the bands
  // should agree. Take the first.
  const turnoverIdx = block.findIndex((l) => /^Annual turnover range\s*$/.test(l.trim()));
  if (turnoverIdx < 0) return null;

  // Following the "Annual turnover range" line, the next 3 non-blank
  // lines are the three band labels.
  const bandLines: string[] = [];
  for (let i = turnoverIdx + 1; i < block.length && bandLines.length < 3; i++) {
    const l = block[i].trim();
    if (l.length === 0) continue;
    bandLines.push(l);
  }
  if (bandLines.length !== 3) return null;
  const bands = bandLines.map(parseBand).filter((b): b is Band => b !== null);
  if (bands.length !== 3) return null;

  // Parse all ratio blocks. A ratio block opens with a line like
  //   "'Total expenses' divided by 'Annual turnover'"
  // or
  //   "Average total expenses"
  // and is followed by 3 percentage lines (range OR single percent).
  const ratios: Partial<Record<Ratio, BandRatio>> = {};
  let i = turnoverIdx + 4; // skip the 3 band lines
  while (i < block.length) {
    const l = block[i].trim();
    if (l.length === 0) {
      i++;
      continue;
    }
    // Range header: "'<X>' divided by 'Annual turnover'"
    const rangeMatch = l.match(/^'([^']+)'\s+divided by\s+'Annual turnover'$/);
    // Average header: "Average <X>" (only for the key benchmark)
    const avgMatch = l.match(/^Average\s+(.+)$/);
    if (rangeMatch || avgMatch) {
      const ratioName = rangeMatch ? rangeMatch[1] : avgMatch![1];
      const ratio = detectRatio(ratioName);
      if (ratio) {
        // Consume next 3 non-blank lines as the values.
        const values: string[] = [];
        let j = i + 1;
        while (j < block.length && values.length < 3) {
          const ll = block[j].trim();
          if (ll.length > 0) values.push(ll);
          j++;
        }
        if (values.length === 3) {
          if (rangeMatch) {
            const parsedRanges = values.map(parsePercentRange);
            if (parsedRanges.every((r): r is RatioRange => r !== null)) {
              const existing = ratios[ratio] ?? { ranges: parsedRanges as [RatioRange, RatioRange, RatioRange] };
              existing.ranges = parsedRanges as [RatioRange, RatioRange, RatioRange];
              ratios[ratio] = existing;
            }
          } else {
            // Average values.
            const parsedAvgs = values.map(parsePercent);
            if (parsedAvgs.every((v): v is number => v !== null)) {
              const existing = ratios[ratio] ?? {
                ranges: [
                  { low: 0, high: 0 },
                  { low: 0, high: 0 },
                  { low: 0, high: 0 },
                ],
              };
              existing.averages = parsedAvgs as [number, number, number];
              ratios[ratio] = existing;
            }
          }
        }
        i = j;
        continue;
      }
    }
    i++;
  }

  return {
    ato_name: atoName,
    last_updated: lastUpdated,
    qc_id: qcId,
    description,
    key_benchmark: keyBenchmark,
    bands: bands as [Band, Band, Band],
    ratios,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  if (!fs.existsSync(MD_PATH)) {
    console.error(`✗ Input file not found: ${MD_PATH}`);
    process.exit(1);
  }
  const md = fs.readFileSync(MD_PATH, "utf-8");
  console.log("=== Parsing AU primary benchmarks ===");
  console.log(`Input: ${MD_PATH} (${(md.length / 1024).toFixed(1)} KB)`);
  console.log("");

  const industries = parseMarkdown(md);

  // Build the output dictionary keyed by slug.
  const byId: Record<string, AustralianIndustry> = {};
  for (const ind of industries) {
    const slug = slugifyIndustry(ind.ato_name);
    byId[slug] = ind;
  }

  // Validation summary.
  let withTotalExp = 0;
  let withCogs = 0;
  let withLabour = 0;
  let withRent = 0;
  let withMotor = 0;
  for (const ind of industries) {
    if (ind.ratios.total_expenses) withTotalExp++;
    if (ind.ratios.cost_of_sales) withCogs++;
    if (ind.ratios.labour) withLabour++;
    if (ind.ratios.rent) withRent++;
    if (ind.ratios.motor_vehicle) withMotor++;
  }
  console.log(`Parsed ${industries.length} industries.`);
  console.log(`  with total_expenses ratio:  ${withTotalExp}`);
  console.log(`  with cost_of_sales ratio:   ${withCogs}`);
  console.log(`  with labour ratio:          ${withLabour}`);
  console.log(`  with rent ratio:            ${withRent}`);
  console.log(`  with motor_vehicle ratio:   ${withMotor}`);

  // Sanity: every industry has at least 1 ratio.
  const withNoRatios = industries.filter((i) => Object.keys(i.ratios).length === 0);
  if (withNoRatios.length > 0) {
    console.warn(`! ${withNoRatios.length} industries have no ratios parsed:`);
    for (const i of withNoRatios) console.warn(`  - ${i.ato_name}`);
  }

  const out: ParsedFile = {
    version: "1.0.0",
    source: "ATO Small Business Benchmarks A-Z",
    source_year: "2023-24",
    source_url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/small-business-benchmarks/benchmarks-a-z",
    parsed_at: new Date().toISOString(),
    industry_count: industries.length,
    industries: byId,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf-8");
  console.log("");
  console.log(`Wrote ${industries.length} industries to ${OUT_PATH}.`);
}

main();
