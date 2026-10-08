/**
 * WHERE US RESTAURANTS GREW AND SHRANK (plan 2026-10-08, home sections, section 3; his idea of 2026-10-08, "US biggest winners and
 * losers ranking of top 5 cities bottom 5"). One trade held (full-service restaurants, private establishments), every US metro the
 * site has a city page for, its count in the first and the last year on disk (data/home/us_restaurants.json, from the employment
 * census's parsed files by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's, the metros ranked and the metros held out together; every US city with a page is ranked or
 * held out with its reason (the export's HELD_OUT map; plan decision 12, Detroit today), never both and never neither, and under the
 * city's own name; each metro's code a metro area whose published title names the city, no two cities on one code; each metro's
 * state, typed beside its code in the export's METROS table, one of the states its title names, so a metro of the same name in
 * another state (Columbus in Georgia or in Indiana, for Columbus in Ohio) does not pass for the city's, and, where the titles file
 * is on this machine, each title the file's own, read again; whole counts in both years; the mark a row may carry withholds
 * employment and pay and never the count (every row keeps its count). Every one of these holds for a metro held out as for one
 * ranked, so a held-out metro's counts stay the publisher's. Five or more ranked metros grew and five or more shrank, so both ends
 * of the ranking stand.
 *
 * Run: npx tsx tests/home/us_restaurants.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-us-restaurants";
const FILE = "data/home/us_restaurants.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py us_restaurants, never edit data/home by hand; then draw section 3 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/* A metro's code and its state are typed in the export's METROS table, so that table is where a finding about either is put right. */
const AT_METROS = { remedy: "put the city's own metro code and state beside it in the METROS table of scripts/data/home/export_home.py, then re-run python -P scripts/data/home/export_home.py us_restaurants" };

/* A metro is held out of the ranking, and the reason given, in the export's HELD_OUT map, so that map is where a finding about either is put right. */
const AT_HELD = { remedy: "give the metro its reason in the HELD_OUT map of scripts/data/home/export_home.py (or take it out of the map), then re-run python -P scripts/data/home/export_home.py us_restaurants" };

type Metro = { slug: string; name: string; area: string; state: string; title: string; y_from: number; y_to: number; codes: Array<string | null> };
/** A metro the export holds out of the ranking: its row as any metro's, and the reason, recorded and never printed. */
type HeldOut = Metro & { why: string };
type Export = { trade: { naics: string; title: string }; ownership: string; from: number; to: number; metros: Metro[]; held_out: HeldOut[] };

/** The states a metro's title names, read as the export reads them: the text after the last comma and before " Metro Area",
 *  split on "-" ("Columbus, GA-AL Metro Area" names GA and AL). */
const statesOf = (title: string): string[] => (title.includes(",") ? title.slice(title.lastIndexOf(",") + 1).replace(/ Metro Area$/, "").trim().split("-").filter((s) => s !== "") : []);
/** The titles file's metro areas: its one total row a CBSA (industry "--", enterprise size "01"), keyed as the export keys them
 *  ("C" and the first four digits of the code). The title is the tenth field, quoted when it holds a comma. */
const metroTitles = (path: string): Map<string, string> => {
  const by = new Map<string, string>();
  for (const m of readFileSync(path).toString("latin1").matchAll(/^(\d{4})0,--,01,(?:[^,\n]*,){6}(?:"([^"\n]*)"|([^,\n]*)),/gm)) by.set(`C${m[1]}`, m[2] ?? m[3]);
  return by;
};

const held = holdHomeExport("us_restaurants.json", check);
const d = (held?.data ?? null) as Export | null;
if (held && d) {
  /* THE RANKED AND THE HELD OUT. A metro the export holds out (its HELD_OUT map gives the reason) keeps its counts in the slice and is
     never ranked. Every per-metro check below runs over both lists, so a held-out metro's counts, code, title and state are the
     publisher's as any ranked metro's are. */
  const out = Array.isArray(d.held_out) ? d.held_out : [];
  const all: Metro[] = [...d.metros, ...out];
  check(`the slice lists the metros it holds out, an empty list if none (${Array.isArray(d.held_out) ? `${out.length} held out` : "no list"})`, Array.isArray(d.held_out));
  check(`the manifest's rows are the slice's: one a metro, ranked or held out (${held.entry.rows} against ${d.metros.length} and ${out.length})`, held.entry.rows === all.length);
  const us = (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ slug: string; name: string; iso2: string }> }).cities.filter((c) => c.iso2.toUpperCase() === "US");
  const ranked = d.metros.map((m) => m.slug), heldOut = out.map((m) => m.slug);
  check(`every US city with a page is ranked or held out, never both (${us.length} pages; ${ranked.length} ranked; held out ${heldOut.join(", ") || "none"})`, JSON.stringify([...ranked, ...heldOut].sort()) === JSON.stringify(us.map((c) => c.slug).sort()) && !ranked.some((s) => heldOut.includes(s)));
  check(`every metro held out carries its reason (${out.map((h) => `${h.slug}: ${h.why}`).join("; ") || "none held out"})`, out.every((h) => typeof h.why === "string" && h.why.trim().length > 0), AT_HELD);
  check("each metro under its city's own name", all.every((m) => us.find((c) => c.slug === m.slug)?.name === m.name));
  check("each code is a metro area whose title names the city, and no two cities share one", all.every((m) => /^C\d{4}$/.test(m.area) && / Metro Area$/.test(m.title) && m.title.toLowerCase().includes(m.name.split(",")[0].trim().toLowerCase())) && new Set(all.map((m) => m.area)).size === all.length);
  const inState = all.filter((m) => statesOf(m.title).includes(m.state)).length;
  check(`each metro's state is one of its title's states, so a metro of the same name in another state is not the city's (${inState} of ${all.length})`, inState === all.length, AT_METROS);
  check(`one trade held, private establishments (${d.trade.naics}, ${d.trade.title}, ${d.ownership})`, d.trade.naics === "722511" && d.ownership === "private");
  check(`whole counts in both years, ${d.from} and ${d.to}`, d.from < d.to && all.every((m) => Number.isInteger(m.y_from) && Number.isInteger(m.y_to) && m.y_from > 0 && m.y_to > 0));
  const marked = all.filter((m) => m.codes.includes("N")).length;
  check(`a row may carry the mark N and every row keeps its whole count (${marked} rows marked)`, all.every((m) => m.codes.length === 2 && m.codes.every((c) => c === null || c === "N") && Number.isInteger(m.y_from) && m.y_from > 0 && Number.isInteger(m.y_to) && m.y_to > 0));
  /* The ranking's two ends are drawn from the metros ranked, so these two counts are theirs alone. */
  const grew = d.metros.filter((m) => m.y_to > m.y_from).length, shrank = d.metros.filter((m) => m.y_to < m.y_from).length;
  check(`five or more ranked metros grew and five or more shrank (${grew} and ${shrank})`, grew >= 5 && shrank >= 5);

  /* THE TITLES, READ AGAIN, where the file is on this machine. A machine without it is deferred by the holder, and its key ends the last line. */
  const titlesFile = held.entry.sources.find((s) => s.key === "metro_titles");
  check("the manifest names the titles file the codes were checked against (metro_titles)", !!titlesFile);
  if (titlesFile && existsSync(titlesFile.path)) {
    const titles = metroTitles(titlesFile.path);
    const wrong = all.filter((m) => titles.get(m.area) !== m.title || !statesOf(titles.get(m.area) ?? "").includes(m.state)).map((m) => m.slug);
    check(`each metro's title is the titles file's for its code, read again here, and names the metro's state${wrong.length ? `: differs on ${wrong.join(", ")}` : ""}`, wrong.length === 0, AT_METROS);
  }
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/us_restaurants", held));
