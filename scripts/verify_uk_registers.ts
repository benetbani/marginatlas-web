/**
 * scripts/verify_uk_registers.ts , THE REGISTER FIGURES ARE THE REGISTERS' (chain gate `uk-registers`).
 *
 * data/uk/registers/ holds slices of the UK register tables, written by E:/atlas/registers/uk/export_for_site.py with a
 * manifest of each file's SHA-256. This gate recomputes every hash: a figure edited by hand in the website repo changes a
 * hash and fails the chain, so the only way a register figure changes is by re-running the export from the tables. The
 * manifest must list exactly the four slices, and no other .json may sit beside them: a slice dropped from the manifest, or
 * a file nothing hashes, would let a hand edit through. It also checks the shape the pages rely on: every trade carries
 * London with its ten band counts, and every trade with live companies carries a rate inside its interval.
 *
 * The slices are hashed as written, in LF; .gitattributes pins data/uk/registers/*.json to LF, or a Windows checkout
 * would rewrite them and every hash would fail here while the deploy passed.
 *
 * It reads only files in this repo (the chain never touches the network or another repo).
 *
 * What it cannot see: whether the tables themselves are right (the registers' own tests, E:/atlas/registers/uk/tests, and
 * their builders' checks); a hand edit that also rewrites manifest.json, since nothing signs the manifest; and a stale
 * export, slices older than tables rebuilt since (the chain never reads the other repo): re-export after every rebuild.
 *
 *   npx tsx scripts/verify_uk_registers.ts
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { red, redSummary } from "./lib/red";

const RULE = "uk-registers";
const DIR = path.join(process.cwd(), "data", "uk", "registers");
const MANIFEST = path.join(DIR, "manifest.json");
const SLICES = ["failures.json", "premises.json", "survival.json", "turnover.json"];
let failures = 0;
const fail = (file: string, detail: string, remedy: string) => {
  failures++;
  red({ rule: RULE, file, detail, remedy });
};

if (!existsSync(MANIFEST)) {
  fail(MANIFEST, "no manifest", "run python E:/atlas/registers/uk/export_for_site.py");
} else {
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as { files: Record<string, { sha256: string; rows: number }> };
  const listed = Object.keys(manifest.files).sort();
  if (listed.join() !== SLICES.join()) fail(MANIFEST, `lists ${listed.join(", ") || "nothing"}, not exactly ${SLICES.join(", ")}`, "re-run the export; never edit the manifest");
  for (const name of readdirSync(DIR).filter((f) => f.endsWith(".json") && f !== "manifest.json" && !SLICES.includes(f))) {
    fail(path.join(DIR, name), "a file the manifest does not hash", "delete it; only the export writes this folder");
  }
  for (const [name, entry] of Object.entries(manifest.files)) {
    const file = path.join(DIR, name);
    if (!existsSync(file)) {
      fail(file, "listed in the manifest but missing", "re-run the export");
      continue;
    }
    const raw = readFileSync(file);
    const sha = createHash("sha256").update(raw).digest("hex");
    if (sha === entry.sha256) continue;
    // a checkout that rewrote LF to CRLF changes every byte hash and no figure: say so, never "edited by hand"
    const asLf = createHash("sha256").update(raw.toString("utf8").replace(/\r\n/g, "\n")).digest("hex");
    if (asLf === entry.sha256) fail(file, "its line ends were rewritten to CRLF; the figures are unchanged", "keep data/uk/registers/*.json text eol=lf in .gitattributes and re-run the export");
    else fail(file, `hash ${sha.slice(0, 12)} is not the manifest's ${entry.sha256.slice(0, 12)}: edited by hand`, "never edit a register slice; re-run the export from the tables");
  }
  const turnover = path.join(DIR, "turnover.json");
  if (existsSync(turnover)) {
    const t = JSON.parse(readFileSync(turnover, "utf8")) as { trades: Record<string, { by_geography: Record<string, { turnover_bands_k?: number[] }> }> };
    for (const [slug, v] of Object.entries(t.trades)) {
      const london = v.by_geography["E12000007"];
      if (!london || !Array.isArray(london.turnover_bands_k) || london.turnover_bands_k.length !== 10) {
        fail(turnover, `${slug} has no London row with ten band counts`, "re-run build_nomis.py and the export");
      }
    }
  }
  const failuresFile = path.join(DIR, "failures.json");
  if (existsSync(failuresFile)) {
    const f = JSON.parse(readFileSync(failuresFile, "utf8")) as { trades: Record<string, { uk_live_companies: number | null; uk_rate: { lo: number; hi: number; value: number } | null }> };
    for (const [slug, v] of Object.entries(f.trades)) {
      if (v.uk_rate === null || v.uk_rate === undefined) {
        if (v.uk_live_companies) fail(failuresFile, `${slug}: ${v.uk_live_companies} live companies and no rate`, "re-run enrich_failure_rates.py and the export");
      } else if (!(v.uk_rate.lo <= v.uk_rate.value && v.uk_rate.value <= v.uk_rate.hi)) {
        fail(failuresFile, `${slug}: the rate sits outside its own interval`, "re-run enrich_failure_rates.py and the export");
      }
    }
  }
}

if (failures > 0) {
  redSummary(RULE, failures, "re-run the registers export; never edit data/uk/registers by hand");
  process.exit(1);
}
console.log(`PASS ${RULE}: every register slice matches its manifest`);
