/**
 * THE SOURCED-DATA LOADER, ON FIXTURES (plan 2026-10-17 replicable pages, Task 4). The fixtures under ./__fixtures__ are in the
 * contract shape, their values copied from the research reports with their sources (/srv/atlas/wc/reports/research-business.md:
 * London 9,560 licensed restaurants, March 2026; UK 528,000 GBP sales per restaurant enterprise, 2024; Italy's survival 87.3 and
 * 62.6, 2024, and 46.7 at five years, 2020; Italy's absent statutory minimum wage). Wired in GATES as `sourced-loader`.
 * BLIND SPOT: it proves the loader on fixtures, never that the live files hold any figure a page needs (the page jobs' tests do).
 *
 * Run: node node_modules/tsx/dist/cli.mjs src/lib/sourced/load.test.ts
 */
import { checkFile, type SourcedFile } from "./schema";
import { makeSourced, sourcesFor, yearOrder } from "./load";
import { PER_ROW_HEADING, sourceEntries, sourceHref, yearsHeld } from "./sources_page";
import uk from "./__fixtures__/uk-business.json";
import it from "./__fixtures__/it-business.json";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "sourced-loader";
const FILE = "src/lib/sourced/load.ts";
const REMEDY = "mend src/lib/sourced/load.ts or schema.ts so the loader keeps the contract of plan Task 4";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const files = [uk, it] as unknown as SourcedFile[];
const { sourcedRows, sourcedOne } = makeSourced(files);
const rows = sourcedRows();

check(`the fixtures hold the contract (${files.map((f) => checkFile(f, f.id).join("; ") || "ok").join(" / ")})`, files.every((f) => checkFile(f, f.id).length === 0));
check(`the loader read every fixture row (${rows.length} of 9)`, rows.length === 9);
check("every row has a year", rows.length > 0 && rows.every((r) => /^\d{4}/.test(r.year)));
check("every row has a source url", rows.length > 0 && rows.every((r) => /^https?:\/\//.test(r.source.url)));
check("a row's own source overrides its file's", sourcedOne("business_count", "restaurants", "E12000007")?.source.title.includes("NM_141_1") === true
  && sourcedOne("sales_per_business", "restaurants", "GB")?.source.title.includes("Annual Business Survey") === true);
check("a row carries its file's id", sourcedOne("survival_1y", "restaurants", "IT")?.fileId === "fixture-it-business");

const lon = sourcedOne("business_count", "restaurants", "E12000007", "enterprises");
check(`measure picks one class (London enterprises ${lon?.value})`, lon?.value === 7865);
const uks = sourcedOne("sales_per_business", "restaurants", "GB");
check(`UK sales per restaurant 528,000 GBP, 2024, country (${uks?.value} ${uks?.unit} ${uks?.year} ${uks?.geo.level})`, uks?.value === 528000 && uks.unit === "GBP" && uks.year === "2024" && uks.geo.level === "country");
check("Italy's survival is 87.3 at one year and 62.6 at three", sourcedOne("survival_1y", "restaurants", "IT")?.value === 87.3 && sourcedOne("survival_3y", "restaurants", "IT")?.value === 62.6);

/* The latest year wins, on the fixtures and on a planted older and newer row. */
const later = makeSourced([...files, { id: "plant", source: uk.source, retrieved: "2026-10-17", rows: [
  { item: "survival_1y", trade: "restaurants", geo: { level: "country", code: "IT", name: "Italy" }, value: 80, unit: "%", year: "2019" },
  { item: "survival_1y", trade: "restaurants", geo: { level: "country", code: "IT", name: "Italy" }, value: 88, unit: "%", year: "2025/26" },
] } as SourcedFile]);
check("sourcedOne returns the latest year", later.sourcedOne("survival_1y", "restaurants", "IT")?.value === 88);
check("year order reads the four digits first (2026-03 after 2025/26, 2023 before 2024)", yearOrder("2026-03", "2025/26") > 0 && yearOrder("2023", "2024") < 0);

/* Data note 34: a row read through one route only stays in its file and never reaches a page. */
const held = makeSourced([{ id: "plant-unconfirmed", source: uk.source, retrieved: "2026-10-18", rows: [
  { item: "minimum_wage", geo: { level: "country", code: "XX", name: "Planted" }, value: 1, unit: "XXX per hour", year: "2026", note: "read once", unconfirmed: true },
  { item: "minimum_wage", geo: { level: "country", code: "XY", name: "Planted" }, value: 2, unit: "XXX per hour", year: "2026" },
] } as SourcedFile]);
check("an unconfirmed row is never handed out, a confirmed one is", held.sourcedOne("minimum_wage", null, "XX") === null && held.sourcedOne("minimum_wage", null, "XY")?.value === 2);
check("sourcedOne returns null for a missing trade", sourcedOne("survival_1y", "barbershops", "IT") === null);
check("trade null asks for a row with no trade", sourcedOne("minimum_wage", null, "IT") !== null && sourcedOne("minimum_wage", "restaurants", "IT") === null);
const mw = sourcedOne("minimum_wage", null, "IT");
check("a null value carries its note", mw?.value === null && /no statutory minimum wage/.test(mw.note ?? ""));

const srcs = sourcesFor(sourcedRows({ geo: "IT" }));
check(`sourcesFor lists each source once (${srcs.length} for Italy's rows: bd_size, bd_9bd, sbs_ovw_act, earn_mw_cur)`, srcs.length === 4);
check("filters by level", sourcedRows({ level: "region" }).length === 2 && sourcedRows({ item: "survival_1y", geo: "GB" }).length === 1);

/* The Sources page's entries: one a file, its anchor its id, the years its rows hold, the row-level sources beneath. */
const entries = sourceEntries(files);
const itE = entries.find((e) => e.anchor === "source-fixture-it-business");
check(`one entry a file, each anchored by its id (${entries.map((e) => e.anchor).join(", ")})`, entries.length === 2 && new Set(entries.map((e) => e.anchor)).size === 2);
check(`Italy's entry holds its years and its three row-level sources (${itE?.years}; ${itE?.also.length})`, itE?.years === "2020, 2023 to 2024, 2026" && itE?.also.length === 3);
check(`years held are the calendar years covered, in runs (${yearsHeld(["2024", "2022", "2023-05-01", "2019", "2025-Q3", "2014-2015", "2010/11"])}; ${yearsHeld(["2026-27"])})`, yearsHeld(["2024", "2022", "2023-05-01", "2019", "2025-Q3", "2014-2015", "2010/11"]) === "2010 to 2011, 2014 to 2015, 2019, 2022 to 2025" && yearsHeld(["2026-27"]) === "2026 to 2027");
check("a source line's link is the Sources page's anchor", sourceHref("fixture-uk-business") === "/about-data#source-fixture-uk-business");

/* A file whose rows each name their own issuer (I1 step 5, on the live files): headed by what it holds, never "Each row's own
   issuer", its title unlinked, every issuer its rows name listed under it. */
const perRowPlant = sourceEntries([{ id: "plant-rules", source: { publisher: "Each row's own issuer (see the row's source)", title: "Fees", url: "https://a.example/1" }, retrieved: "2026-10-18", rows: [
  { item: "fee", geo: { level: "country", code: "GB", name: "United Kingdom" }, value: 1, unit: "GBP", year: "2026", source: { publisher: "Registry A", title: "A fees", url: "https://a.example/1" } },
  { item: "fee", geo: { level: "country", code: "IT", name: "Italy" }, value: 2, unit: "EUR", year: "2026", source: { publisher: "Registry B", title: "B fees", url: "https://b.example/2" } },
] }] as unknown as SourcedFile[])[0];
check(`a planted file of two issuers is headed by what it holds and lists both (${perRowPlant.publisher}; ${perRowPlant.also.map((a) => a.publisher).join(", ")})`, perRowPlant.perRow && perRowPlant.publisher === PER_ROW_HEADING && perRowPlant.also.length === 2);
const live = sourceEntries();
const headedByRows = live.filter((e) => /Each row's own issuer/.test(e.publisher));
check(`no live entry is headed "Each row's own issuer" (${headedByRows.map((e) => e.anchor).join(", ") || "none"})`, headedByRows.length === 0);
const perRowLive = live.filter((e) => e.perRow);
check(`the live per-row files each list their issuers (${perRowLive.map((e) => `${e.anchor} ${e.also.length}`).join("; ")})`, perRowLive.length > 0 && perRowLive.every((e) => e.also.length > 0));

/* A class-keyed row (data-trades' files) never reaches a trade-less query, and is read through sourcedClassRows (S-U1, 2026-10-20). */
const classed = makeSourced([{ id: "fixture-classed", source: uk.source, retrieved: "2026-10-20", rows: [
  { item: "sales_per_business", classCode: "56.10", geo: { level: "country", code: "GB", name: "United Kingdom" }, value: 1, unit: "GBP", year: "2024" },
] }] as unknown as SourcedFile[]);
check("a class-keyed row stays out of sourcedRows", classed.sourcedRows({ item: "sales_per_business" }).length === 0 && classed.sourcedOne("sales_per_business", null, "GB") === null);
check("a class-keyed row is read by its code", classed.sourcedClassRows({ item: "sales_per_business", classCode: "56.10", geo: "GB" }).length === 1);

/* The judge sees a bad row: no year, no unit, no level, no source url, a null without a note. */
const bad = { id: "bad", source: { publisher: "x", title: "y", url: "" }, retrieved: "2026-10-17", rows: [{ item: "a", geo: { level: "town", code: "x", name: "x" }, value: null, unit: "" }] };
const faults = checkFile(bad, "bad");
check(`the judge reds a planted bad file (${faults.length} faults: ${faults.join("; ")})`, ["source.url", "geo.level", "null without a note", "unit missing", "year"].every((k) => faults.some((f) => f.includes(k))));

if (failed) { redSummary(RULE, failed, REMEDY); process.exit(1); }
console.log(`ok ${RULE}: the loader keeps the contract on ${files.length} fixture files, ${rows.length} rows`);
