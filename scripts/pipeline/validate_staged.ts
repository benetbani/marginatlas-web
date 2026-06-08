/**
 * scripts/pipeline/validate_staged.ts
 *
 * City-data pipeline, the validation gate. Reads a staged file
 * (data/cities/_staged/<slug>.json) and checks every filled target against the
 * plausibility bounds + schema rules in RUNBOOK.md. Prints a per-target verdict.
 * A field that fails is reported so the runner can downgrade it to "skipped"
 * rather than stage a wrong number. Exits non-zero if any FILLED target fails, so
 * the loop and the reviewer both have a hard gate.
 *
 * Run: npx tsx scripts/pipeline/validate_staged.ts <slug>
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { INDUSTRIES, industryToSlug } from "@/lib/taxonomy";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: npx tsx scripts/pipeline/validate_staged.ts <slug>");
  process.exit(2);
}

const path = resolve(process.cwd(), "data", "cities", "_staged", `${slug}.json`);
if (!existsSync(path)) {
  console.error(`no staged file: ${path}`);
  process.exit(2);
}
const staged = JSON.parse(readFileSync(path, "utf-8"));

// Slug resolution mirrors CitySignaturePanel.industryHref: a sector links to a
// real cell, so its industry_slug must resolve either as a direct slug or as an
// id-with-underscores candidate.
const SLUGS = new Set(INDUSTRIES.map((i) => industryToSlug(i.id)));
const IDS = new Set(INDUSTRIES.map((i) => i.id));
function slugResolves(s: string): boolean {
  return SLUGS.has(s) || IDS.has(s.replace(/-/g, "_"));
}

// A minimal source-agency blocklist mirroring the live gate's intent (the rendered
// blurbs must not name a source agency). Full list lives in verify_no_source_agencies.
const AGENCY = /\b(eurostat|ons|bls|ato|ine|insee|istat|destatis|oecd|world bank|census bureau)\b/i;

const fails: string[] = [];
const notes: string[] = [];

function bound(target: string, field: string, v: unknown, lo: number, hi: number): void {
  if (typeof v !== "number" || !Number.isFinite(v) || v < lo || v > hi) {
    fails.push(`${target}.${field}: ${JSON.stringify(v)} out of [${lo}, ${hi}]`);
  }
}
function checkText(target: string, label: string, s: unknown): void {
  if (typeof s !== "string" || s.trim().length === 0) {
    fails.push(`${target}.${label}: empty`);
    return;
  }
  if (s.includes("—")) fails.push(`${target}.${label}: contains an em-dash`);
  if (AGENCY.test(s)) fails.push(`${target}.${label}: names a source agency (keep sources in metadata)`);
}

const targets = staged.targets ?? {};
for (const [key, t] of Object.entries<Record<string, unknown>>(targets)) {
  if ((t as { status?: string }).status !== "filled") {
    notes.push(`${key}: ${(t as { status?: string }).status ?? "no status"} (skipped, not validated)`);
    continue;
  }
  const values = (t as { values?: Record<string, unknown> }).values ?? {};
  const sources = (t as { sources?: unknown[] }).sources ?? [];
  if (!Array.isArray(sources) || sources.length === 0) {
    fails.push(`${key}: filled but has no sources`);
  }

  if (key === "demographics") {
    bound(key, "foreign_born_pct", values.foreign_born_pct, 0, 70);
    bound(key, "foreign_owned_pct", values.foreign_owned_pct, 0, 60);
  } else if (key === "board_economics") {
    if ("avg_gross_salary_usd_year" in values)
      bound(key, "avg_gross_salary_usd_year", values.avg_gross_salary_usd_year, 2000, 250000);
    if ("cost_of_living_index" in values)
      bound(key, "cost_of_living_index", values.cost_of_living_index, 15, 200);
    if ("tourist_arrivals_m" in values)
      bound(key, "tourist_arrivals_m", values.tourist_arrivals_m, 0, 120);
  } else if (key === "sectors") {
    const sectors = values.signature_sectors;
    if (!Array.isArray(sectors) || sectors.length !== 3) {
      fails.push(`sectors: must be exactly 3 (got ${Array.isArray(sectors) ? sectors.length : "none"})`);
    } else {
      const labels = new Set<string>();
      for (const sec of sectors as Array<Record<string, unknown>>) {
        const label = String(sec.label ?? "");
        const islug = String(sec.industry_slug ?? "");
        if (labels.has(label)) fails.push(`sectors: duplicate label "${label}"`);
        labels.add(label);
        if (!slugResolves(islug)) fails.push(`sectors: industry_slug "${islug}" does not resolve in the taxonomy`);
        checkText("sectors", `blurb[${label}]`, sec.blurb);
        checkText("sectors", `label[${label}]`, sec.label);
      }
    }
  } else if (key === "nbhd_economics") {
    const hoods = values.neighborhoods;
    if (Array.isArray(hoods)) {
      // Legacy per-neighborhood row shape: driver mix must sum to ~100;
      // spend/rent bounded.
      for (const h of hoods as Array<Record<string, unknown>>) {
        const mix = (h.demand_drivers ?? {}) as Record<string, number>;
        const sum = Object.values(mix).reduce((a, b) => a + (Number(b) || 0), 0);
        if (mix && Object.keys(mix).length && Math.abs(sum - 100) > 1)
          fails.push(`nbhd_economics[${h.slug}]: demand-driver mix sums to ${sum}, not 100`);
        if ("spend_per_visit_usd" in h) bound(`nbhd[${h.slug}]`, "spend_per_visit_usd", h.spend_per_visit_usd, 1, 5000);
        if ("rent_vs_city" in h) bound(`nbhd[${h.slug}]`, "rent_vs_city", h.rent_vs_city, 0.2, 5);
      }
    } else if (hoods && typeof hoods === "object") {
      // Prime-streets map shape: `${citySlug}.${nbSlug}` -> { prime_streets,
      // notes }. Each street: name + sells non-empty, no em-dash / no source
      // agency on sells; optional spend_per_visit_usd in [1, 5000] and
      // rent_vs_city in [0.2, 5].
      for (const [hk, hv] of Object.entries(hoods as Record<string, unknown>)) {
        const entry = (hv ?? {}) as Record<string, unknown>;
        const streets = entry.prime_streets;
        if (!Array.isArray(streets) || streets.length < 1) {
          fails.push(`nbhd_economics[${hk}]: prime_streets must have at least one street`);
          continue;
        }
        for (const st of streets as Array<Record<string, unknown>>) {
          const nm = String(st.name ?? "");
          checkText(`nbhd[${hk}]`, "street name", st.name);
          checkText(`nbhd[${hk}]`, `sells[${nm}]`, st.sells);
          if ("spend_per_visit_usd" in st)
            bound(`nbhd[${hk}]`, `spend_per_visit_usd[${nm}]`, st.spend_per_visit_usd, 1, 5000);
          if ("rent_vs_city" in st)
            bound(`nbhd[${hk}]`, `rent_vs_city[${nm}]`, st.rent_vs_city, 0.2, 5);
        }
      }
    }
  }
}

console.log("");
console.log(`VALIDATE staged/${slug}.json`);
for (const n of notes) console.log(`  - ${n}`);
if (fails.length === 0) {
  console.log(`  GATE: PASS (all filled targets in bounds)`);
  process.exit(0);
}
console.log(`  GATE: FAIL`);
for (const f of fails) console.log(`    x ${f}`);
process.exit(1);
