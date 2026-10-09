/**
 * A US STATE PAGE PRINTS THE TRADE ITS ADDRESS NAMES (P1-D of the page architecture, 2026-10-09). /us/mississippi/offices-of-lawyers
 * printed "Software development" (saved by the research of 2026-10-09; two of six sampled description pages printed another
 * trade): the state lookup's last step took the first row its loose description match returned and named it by the taxonomy's
 * first trade of the row's three-digit group (541, Software development). Now the label and every figure come from the one row
 * whose description is the word, named by that description; a word the taxonomy reads keeps the matcher's validated trade; a word
 * no description is draws the estimated page even when the loose match found rows, never the first of them.
 *
 * THE INSTRUMENT: the rows are fixtures (tests/fixtures/seo/state_trade_rows.json: official industry titles, codes and size bands,
 * no figure), answered by a stand-in for the database that filters them the way PostgREST does for the two queries the lookup
 * sends (the description's ilike, the three-digit group's like); the lookup is the real getCellBySlug. The stand-in IGNORES the
 * queries' order and limit (year then count, descending; 50 and 1000 rows) and answers in the fixture's order, so the fixture
 * lists each state's rows as the database would: Offices of Lawyers is held twice, the all-sizes row and then its 1-4 band, and
 * the lookup must take the first. WHAT IT CANNOT SEE: the database's own rows and order. The floor census, run by hand with the
 * database, lists any live description page whose label misses its word (label_misses in data/seo/floor_census.json).
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/seo/state_trade_label.test.ts
 */
import { readFileSync } from "node:fs";
import { rowForWord, labelMissesWord } from "../../src/lib/cells/us_industry_match";
import { INDUSTRIES, INDUSTRY_BY_ID, industryToSlug, slugToIndustry } from "../../src/lib/taxonomy";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "state-trade-label";
const CELLS = "src/lib/cells.ts";
const MATCH = "src/lib/cells/us_industry_match.ts";
const ROWS = "tests/fixtures/seo/state_trade_rows.json";
/* Each check names the module it guards and what to do there: the lookup's checks point at cells.ts, the rule checks at
   us_industry_match.ts, a fixture premise at the fixture, and the census loop (the lookup's label read through the census's
   rule) at both modules. */
const REMEDY = "Take label and figures from one matching row (src/lib/cells.ts)";
const RULE_REMEDY = "Correct the rule in src/lib/cells/us_industry_match.ts (rowForWord names the row, labelMissesWord reads the label)";
const ROWS_REMEDY = "Restore the premise in tests/fixtures/seo/state_trade_rows.json (loose matches for the word, no row that is the word), or pick another word for the lookup check it guards";
const LABEL_REMEDY = "Print the row's own description in src/lib/cells.ts, or correct labelMissesWord in src/lib/cells/us_industry_match.ts";
const SUMMARY_REMEDY = "Fix the module each finding above names (src/lib/cells.ts or src/lib/cells/us_industry_match.ts)";
const REMEDY_FOR: Record<string, string> = { [CELLS]: REMEDY, [MATCH]: RULE_REMEDY, [ROWS]: ROWS_REMEDY };
let failed = 0;
const check = (label: string, ok: boolean, file = CELLS, remedy = REMEDY_FOR[file] ?? REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};

type Row = { country: string; geo_id: string; industry_description: string; naics_6: string; year: number; size_band: string | null };
const FIXTURE = JSON.parse(readFileSync(ROWS, "utf8")) as { rows: Row[] };
const mississippi = FIXTURE.rows.filter((r) => r.geo_id === "US-28");

/* (1) THE PURE RULES */
const infoRows = mississippi.filter((r) => /other.*information.*services/i.test(r.industry_description));
check("rowForWord picks the row whose description is the word, not the first the loose match returned", infoRows[0]?.industry_description === "All Other Information Services" && rowForWord(infoRows, "other-information-services")?.industry_description === "Other Information Services", MATCH);
check("rowForWord finds no row when no description is the word", rowForWord(mississippi, "general-rental-centers") === null, MATCH);
const lawyerRows = mississippi.filter((r) => r.industry_description === "Offices of Lawyers");
check(
  "rowForWord takes the first of two rows with one description, in the caller's order: the all-sizes row, not the 1-4 band after it",
  lawyerRows.length === 2 && lawyerRows[0].size_band === null && lawyerRows[1].size_band === "1-4" && rowForWord(mississippi, "offices-of-lawyers") === lawyerRows[0],
  MATCH,
);
/* The premise of the lookup check on information-services, below: a lookup that returns early (no loose match at all, or a trade the
   taxonomy reads) never reaches rowForWord, which is how the first check on a missing word could not fail. */
const looseRows = mississippi.filter((r) => /information.*services/i.test(r.industry_description));
check(
  "the premise of the lookup check on information-services: the taxonomy does not read it, the loose match finds rows, and none of them is its own",
  !slugToIndustry("information-services") && looseRows.length > 0 && rowForWord(looseRows, "information-services") === null,
  ROWS,
);
check("a label that is the word's own description reads as the word", !labelMissesWord("Offices of Lawyers", "offices-of-lawyers"), MATCH);
check("the label of 2026-10-09 misses: Software development on offices-of-lawyers", labelMissesWord("Software development", "offices-of-lawyers"), MATCH);
check("the trade the taxonomy reads a word as reads as the word: Legal services on legal-services", !labelMissesWord("Legal services", "legal-services"), MATCH);
check("no label misses its word: a null or an empty label", labelMissesWord(null, "offices-of-lawyers") && labelMissesWord("", "offices-of-lawyers"), MATCH);
const child = INDUSTRIES.find((i) => i.parent_id && INDUSTRY_BY_ID[i.parent_id]);
check(
  `a trade's parent reads as its word too, the matcher's inheritance${child ? ` (${INDUSTRY_BY_ID[child.parent_id as string].name} on ${industryToSlug(child.id)})` : " (no live trade has a parent)"}`,
  !child || !labelMissesWord(INDUSTRY_BY_ID[child.parent_id as string].name, industryToSlug(child.id)),
  MATCH,
);

/* (2) THE LOOKUP ITSELF, offline: src/lib/supabase.ts builds its client when first imported and needs a URL, so the environment is
   set and fetch replaced BEFORE the import below. */
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
async function lookupPart(): Promise<void> {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://offline.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "offline";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  globalThis.fetch = (async (input: string | URL | Request) => {
    const u = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    let rows: Row[] = [];
    if (u.pathname.endsWith("/cells_master")) {
      const geo = (u.searchParams.get("geo_id") ?? "").replace(/^eq\./, "");
      rows = FIXTURE.rows.filter((r) => r.geo_id === geo);
      const like = u.searchParams.get("industry_description");
      if (like) {
        const re = new RegExp(like.replace(/^ilike\./, "").split("%").map(esc).join(".*"), "i");
        rows = rows.filter((r) => re.test(r.industry_description));
      }
      const or = u.searchParams.get("or");
      if (or) {
        const prefixes = [...or.matchAll(/naics_6\.like\.(\d+)/g)].map((m) => m[1]);
        rows = rows.filter((r) => prefixes.some((p) => r.naics_6.startsWith(p)));
      }
    }
    return new Response(JSON.stringify(rows), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  const { getCellBySlug } = await import("../../src/lib/cells");
  const cell = (word: string, state = "mississippi") => getCellBySlug("us", state, word, { sizeBand: null, year: null });

  const lawyers = await cell("offices-of-lawyers");
  check(`/us/mississippi/offices-of-lawyers prints "Offices of Lawyers" (printed: ${lawyers.industry_name})`, lawyers.industry_name === "Offices of Lawyers" && lawyers.industry_description === "Offices of Lawyers");
  check(`and carries no other trade: no taxonomy id, no Software development (id: ${lawyers.industry_id})`, lawyers.industry_id == null && lawyers.industry_name !== "Software development");
  check(`the row it reads is the lawyers' own, by its code (the fixture holds codes, not figures; code ${lawyers.naics_6})`, lawyers.naics_6 === "541110");
  check(`and the first of the two lawyers rows the database answers: the all-sizes row, not the 1-4 band (size band: ${lawyers.size_band ?? "all sizes"})`, lawyers.size_band === null);
  const info = await cell("other-information-services");
  check(`/us/mississippi/other-information-services prints its own description, not the first row's (printed: ${info.industry_name})`, info.industry_name === "Other Information Services" && info.naics_6 === "5191");
  const roofing = await cell("roofing-contractors");
  check(`/us/mississippi/roofing-contractors prints "Roofing Contractors" (printed: ${roofing.industry_name})`, roofing.industry_name === "Roofing Contractors");
  const legal = await cell("legal-services");
  check(`a word the taxonomy reads keeps the matcher's trade: /us/mississippi/legal-services prints Legal services (printed: ${legal.industry_name})`, legal.industry_name === "Legal services" && legal.industry_id === "legal_services");
  const missing = await cell("general-rental-centers");
  check(`a description this state does not hold at all (the loose match finds no row) draws the estimated page (estimated: ${missing.is_synthetic === true})`, missing.is_synthetic === true);
  /* information-services: the loose pattern finds the two Information Services rows and neither is its own (premise pinned in (1)),
     so the lookup reaches rowForWord and must answer with no row. */
  const looseOnly = await cell("information-services");
  check(`a word no description is, though the loose match finds rows, draws the estimated page, never the first loose row (estimated: ${looseOnly.is_synthetic === true}; printed: ${looseOnly.industry_name}; code ${looseOnly.naics_6})`, looseOnly.is_synthetic === true);
  for (const [word, c] of [["offices-of-lawyers", lawyers], ["other-information-services", info], ["roofing-contractors", roofing], ["legal-services", legal]] as const) {
    check(`the census would not list /us/mississippi/${word}: its label reads as its word`, !labelMissesWord(c.industry_name, word), MATCH, LABEL_REMEDY);
  }

  /* (3) THE OLD LINE CANNOT COME BACK */
  const code = stripCommentLines(readFileSync(CELLS, "utf8").split("\n")).join("\n");
  check("the lookup no longer names the first loose-match row by its group: normalizeRow(data[0] is gone", !/normalizeRow\(\s*data\[0\]/.test(code));
  check("the description branch reads rowForWord", /rowForWord\(/.test(code));
}

lookupPart().then(
  () => {
    if (failed > 0) { redSummary(RULE, failed, SUMMARY_REMEDY, "checks failed"); process.exit(1); }
    console.log("seo/state_trade_label: all pass");
    process.exit(0);
  },
  (e: unknown) => {
    failed++;
    red({ rule: RULE, file: "tests/seo/state_trade_label.test.ts", detail: `the lookup part could not run: ${e instanceof Error ? e.stack ?? e.message : String(e)}`.slice(0, 400), remedy: REMEDY });
    redSummary(RULE, failed, REMEDY, "checks failed");
    process.exit(1);
  },
);
