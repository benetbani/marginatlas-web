/**
 * OPENING FROM ABROAD (milestone 2, masterplan step 26; his ruling 28 of 2026-09-26; DATA-REQUIREMENTS item 74): the builder
 * against the law it reads (data/uk/law/opening_from_abroad.json, from the research of 2026-10-02, section 74) and the research's
 * worked examples (74.5).
 *
 * Run: npx tsx tests/spine/from_abroad.test.ts
 */
import { readFileSync } from "node:fs";
import { buildFromAbroad, FROM_ABROAD } from "../../src/lib/spine/sections/from_abroad";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "from-abroad";
const FILE = "src/lib/spine/sections/from_abroad.ts";
const REMEDY = "build the walls from data/uk/law/opening_from_abroad.json in the research's order, each stated and sourced, the money the research's own sum";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const a = buildFromAbroad();
check("the walls build", !!a);
if (a) {
  check(`the figure is example A's sum, the Innovator Founder route's fees for three years per person, 6,462 (${a.focal.gbp})`, a.focal.gbp === 6462);
  check(`its second figure is the weeks to a decision from outside the UK, 3 (${a.focal.weeks})`, a.focal.weeks === 3);
  check("the figure says it was worked out from the law file", a.focal.prov.kind === "worked out" && a.focal.prov.src.startsWith("uk/law/opening_from_abroad.json:"));
  const youth = a.walls.find((w) => w.key === "youth-mobility");
  check(`example B, the Youth Mobility Scheme for two years, 1,892 (${youth?.gbp})`, youth?.gbp === 1892);
  const order = ["company", "address", "identity", "tax-code", "bank", "founder-visa", "youth-mobility", "hiring"];
  check(`the walls keep the research's order (${a.walls.map((w) => w.key).join(", ")})`, JSON.stringify(a.walls.map((w) => w.key)) === JSON.stringify(order));
  check("every wall has a state: open, conditional or closed", a.walls.every((w) => ["open", "conditional", "closed"].includes(w.state)));
  const fields = FROM_ABROAD.fields as Record<string, { source_url?: string }>;
  check("every wall names the law field it reads, and every field carries an https source", a.walls.every((w) => { const key = w.prov.src.split(":")[1]; return !!key && /^https:\/\//.test(fields[key]?.source_url ?? ""); }));
  check("the money the figure holds is printed once: no wall repeats it", a.walls.every((w) => w.gbp !== a.focal.gbp));
  check("and its weeks: the founder visa's row prints no time of its own", a.walls.find((w) => w.key === "founder-visa")?.time === null);
  check("the company is open to a director who lives abroad", a.walls.find((w) => w.key === "company")?.state === "open");
  check("hiring a barber, a beautician or a cook from abroad is closed", a.walls.find((w) => w.key === "hiring")?.state === "closed");
  check("every label is three words at most", a.walls.every((w) => w.label.split(/\s+/).length <= 3));
  check("every note is one line of twelve words at most, with no semicolon or em dash", a.walls.every((w) => w.note.split(/\s+/).length <= 12 && !/[;\u2014]/.test(w.note)));
}

// No coined score: item 74's seed index goes, in the file and in what the builder returns.
const raw = readFileSync("data/uk/law/opening_from_abroad.json", "utf8");
check("no difficulty score in the data file", !/difficulty/i.test(JSON.stringify(JSON.parse(raw).fields)));
check("no score in what the builder returns", !/score|difficulty|_0_100/i.test(JSON.stringify(a)));
const parsed = JSON.parse(raw) as { fields: Record<string, { source_url?: string; quote?: string; checked?: string }> };
check("every field in the data file has its page, its quote and its day", Object.values(parsed.fields).every((f) => /^https:\/\//.test(f.source_url ?? "") && !!f.quote && /^\d{4}-\d{2}-\d{2}$/.test(f.checked ?? "")));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/from_abroad: all pass");
