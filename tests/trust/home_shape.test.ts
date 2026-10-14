/**
 * THE HOME, QUIET EDITORIAL (plan docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Task 1A; spec
 * docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, approved 2026-10-13). His words that led to it: the home
 * "fails all the premises of what a homepage should include", and "fails on establishing brand, not elegant and slaps infographics". In
 * this order and nothing else: the search zone (the positioning line beside the compass mark, above his h1 with its two moving words, and
 * the picker that follows the h1's case), the contents (six numbered departments in one wide zone), Pro only while the paywall is on, the
 * band (one solid statement on the brand terracotta), then the colophon. Three wide zones by name; three seats: the band a field, the
 * contents and the colophon none; no worked example, proofs, counts band, city rows or where-to-next list; one h2 a department and none
 * skipped; every figure stamped but Pro's prices; no reader text under 14px. The colophon prints no checked date (the plan's Q3, ruled B:
 * src/lib/spine/checked.ts prints a date only on a page whose figures that data backs, and the home prints no register figure). Read from
 * src/components/spine/home/home-view.tsx, src/components/spine/home/HomeAsk.tsx, src/app/page.tsx, src/components/NavigatorForm.tsx,
 * src/components/StructuredData.tsx and src/components/spine/archetypes/Department.tsx, and from the harness render
 * scratchpad/harness/pages/home-gb.html, which pages-fresh writes first in the chain: a missing render is a red, so the render's half never
 * passes having read nothing.
 * Run: node node_modules/tsx/dist/cli.mjs tests/trust/home_shape.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { HERO_BUSINESSES, HERO_CITIES } from "../../src/lib/hero-words";
import { COPY } from "../../src/lib/spine/copy";
import { priceLine, yearlyHeadline } from "../../src/lib/monetization/plan";
import { OGL_LINE, UK_SOURCES_FOOT } from "../../src/lib/spine/uk_sources";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { readTypeFloor } from "../../scripts/lib/type_floor.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-shape";
const VIEW = "src/components/spine/home/home-view.tsx";
const ASK = "src/components/spine/home/HomeAsk.tsx";
const RENDER = "scratchpad/harness/pages/home-gb.html";
const REMEDY = `keep ${VIEW} to plan 2026-10-13 home-quiet-editorial: zones search (the positioning line, then HomeAsk), contents (HomeContents), (pro behind isPaywallOn), band (HomeBand on the terracotta tone); seats contents none, band FIELD, colophon none; then HomeColophon`;
let failed = 0;
const check = (label: string, ok: boolean, file = VIEW, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };
const read = (f: string) => (existsSync(f) ? readFileSync(f, "utf8") : "");
/** A COPY.home string by its path, or "" where the key has not landed yet (each lands with its task; a missing one is a red, never a crash). */
const copyAt = (path: string): string => { let v: unknown = COPY.home; for (const k of path.split(".")) v = v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined; return typeof v === "string" ? v : ""; };

/* JSX COMMENTS GO FIRST, WHOLE (kept from the test this replaces): one that runs over two lines leaves its braces to stripCommentLines, and a
   slice ending at the first line that starts with `}` would stop early; tempered, so a match never runs past its own comment. */
const view = read(VIEW);
const code = stripCommentLines(view.replace(/\{\s*\/\*(?:(?!\*\/)[\s\S])*\*\/\s*\}/g, "").split("\n")).join("\n");
const askCode = stripCommentLines(read(ASK).replace(/\{\s*\/\*(?:(?!\*\/)[\s\S])*\*\/\s*\}/g, "").split("\n")).join("\n");
const live = read("src/app/page.tsx");
const picker = read("src/components/NavigatorForm.tsx");
const sd = read("src/components/StructuredData.tsx");

/* THE ZONE ORDER, as the body lists its zones (each `key:` inside SpineHomeBody's `zones` array), and each zone's line. */
const body = /const zones[\s\S]*?\n  \];/.exec(code)?.[0] ?? "";
const keys = [...body.matchAll(/\bkey: "([a-z-]+)"/g)].map((m) => m[1]);
check(`the zones run the search, the contents, then the band (read: ${keys.join(", ") || "none"})`, JSON.stringify(keys.filter((k) => k !== "pro")) === JSON.stringify(["search", "contents", "band"]));
const pro = keys.indexOf("pro");
check("Pro, where it is listed, stands after the contents and before the band, behind the paywall's switch", pro === -1 || (pro > keys.indexOf("contents") && pro < keys.indexOf("band") && /isPaywallOn\(\) \? \[\{ key: "pro"/.test(body)));
const zoneLine = (key: string) => new RegExp(`\\{ key: "${key}", split: "([^"]+)"[^\\n]*`).exec(body);
const split = (key: string) => zoneLine(key)?.[1];
check(`three full widths and no other split but Pro's: the search, the contents and the band (read: ${["search", "contents", "band"].map((k) => `${k} ${split(k) ?? "none"}`).join(", ")})`, split("search") === "wide" && split("contents") === "wide" && split("band") === "wide" && (body.match(/split: "wide"/g) ?? []).length === 3 && (body.match(/split: "/g) ?? []).length === 4);
check("the contents zone draws HomeContents from buildContents, under the zone name the copy gives it", /\{ key: "contents", split: "wide", label: COPY\.home\.contents\.label, body: \[<HomeContents key="contents" contents=\{contents\} \/>\] \}/.test(body) && /const contents = buildContents\(\);/.test(code), VIEW, `list it as { key: "contents", split: "wide", label: COPY.home.contents.label, body: [<HomeContents key="contents" contents={contents} />] } with const contents = buildContents();`);
check("the band is HomeBand, its own zone on the terracotta tone the alternation skips", /\{ key: "band", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY\.home\.band\.label, body: \[<HomeBand key="band" \/>\] \}/.test(body) && /const toned = zones\.filter\(\(z\) => z\.tone !== "terra"\);/.test(code) && /zoneTone\(toned\.indexOf\(z\)\)/.test(code));

/* THE SEATS (the spec's section 4: the band the one loud seat; the question's moving words his h1's red, never a seat). */
const seats = /export const LOUD_SEATS = \[[\s\S]*?\] as const/.exec(code)?.[0] ?? "";
check("three seats: the contents none, the band a field, the colophon none; no seat lit by a figure", !/state: "LIT"/.test(seats) && /seat: 1, card: "contents"[^\n]*state: "NO HONEST CANDIDATE"/.test(seats) && /seat: 2, card: "band", id: "band"[^\n]*state: "FIELD"/.test(seats) && /seat: 3, card: "colophon"[^\n]*state: "NO HONEST CANDIDATE"/.test(seats));

/* THE SEARCH (the spec's section 2, items 1 and 2). */
const search = /function HomeSearch[\s\S]*?\n\}/.exec(code)?.[0] ?? "";
const posAt = search.indexOf("<p data-positioning");
check("the positioning line stands first in the search, the compass mark in the brand terracotta beside its words, at the head rung, before the question", posAt > -1 && posAt < search.indexOf("<HomeAsk") && /<p data-positioning="" className="mb-4 flex items-center gap-3 text-\[length:var\(--t-head\)\] font-semibold leading-7 text-\[var\(--c-ink\)\] lg:mb-6">\s*<LogoMark size=\{24\} className="shrink-0 text-\[var\(--terra-full\)\]" \/>\s*<span>\{C\.positioning\}<\/span>\s*<\/p>/.test(search));
check("the question and its picker are HomeAsk, handed the h1's words and the cases the picker follows; no h1, picker or definition of the view's own", /<HomeAsk lead=\{C\.h1\.lead\} middle=\{C\.h1\.middle\} businesses=\{HERO_BUSINESSES\} cities=\{HERO_CITIES\} cases=\{homePickerCases\(\)\} \/>/.test(search) && !/<h1\b|<NavigatorForm|data-definition|\.definition\b/.test(search));
check("HomeAsk holds the h1 on its words' one timer, told the index, and under it the picker that follows that index, with no heading", /<h1 className="font-display text-\[1\.75rem\] sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-\[var\(--c-ink\)\] leading-\[1\.08\]">\s*<HeroWords lead=\{lead\} middle=\{middle\} businesses=\{businesses\} cities=\{cities\} onIndex=\{setAt\} \/>\s*<\/h1>/.test(askCode) && /<div className="relative z-30 mt-4 lg:mt-8 w-full">\s*<NavigatorForm showHeading=\{false\} cases=\{cases\} caseIndex=\{at\} \/>\s*<\/div>/.test(askCode), ASK, "write src/components/spine/home/HomeAsk.tsx as plan 2026-10-13 Task 3 gives it");
check("the live home renders the picker with its heading, its first paint from the server's seed", /^import \{ homePickerSeed \} from "@\/lib\/home\/picker";/m.test(live) && /<NavigatorForm seed=\{homePickerSeed\(\)\} \/>/.test(live) && !/<NavigatorForm[^>]*showHeading=\{false\}/.test(live), "src/app/page.tsx");
check("the picker's heading is drawn by default and only when asked", /showHeading = true/.test(picker) && /\{showHeading \? \(/.test(picker) && /Pick a country, a city, and a business\./.test(picker), "src/components/NavigatorForm.tsx");
check(`the h1's first words ask the case the picker opens on ("a ${HERO_BUSINESSES[0]}" in "${HERO_CITIES[0]}")`, HERO_BUSINESSES[0] === "restaurant" && HERO_CITIES[0] === "London", "src/lib/hero-words.ts");
const sdFn = (name: string) => { const at = sd.indexOf(`export function ${name}(`); if (at < 0) return ""; const next = sd.indexOf("\nexport function ", at + 1); return sd.slice(at, next < 0 ? undefined : next); };
check("the WebSite's and the Organization's descriptions in the structured data are the site's one definition", /description:\s*COPY\.home\.definition/.test(sdFn("WebSite")) && /description:\s*COPY\.home\.definition/.test(sdFn("Organization")), "src/components/StructuredData.tsx");

/* THE COLOPHON (the spec's section 2, item 5; the plan's Q3, ruled B): one block in place of the two foot lines, and no checked date. */
check("the colophon closes the page, with no checked date, and the two foot lines are gone", /<HomeColophon \/>/.test(code) && !/<SourcesFoot\b|<ReportFoot\b/.test(code));

/* NOTHING THE REFORM RETIRED (the spec's section 2, "Removed", and the plans before it). */
const RETIRED = ["HomePlace", "HomePays", "HomeExample", "ProofJoins", "ProofArchive", "ProofTax", "HomeProofs", "HomeRecord", "buildSiteCounts", "buildWorkedExample", "buildProofs", "CityRows", "CityRowsHead", "HomeCities", "WhereNext", "nextDoors", "HomeDuel", "HomeKitchens", "HomeFirmsLast", "HomeNewCompanies", "HomeUsRestaurants", "HomeHowMade", "Notebook", "buildNotebook", "AnswerDoor", "TaxAnswer", "TradesAnswer", "YearsAnswer", "buildHomeAnswers", "HomeNewsletter", "AtlasHolds", "buildAtlasHolds", "getAtlasLedger"];
const still = RETIRED.filter((n) => new RegExp(`\\b${n}\\b`).test(code));
check(`no section the reform retired is drawn (${still.join(", ") || "none"})`, still.length === 0);

/* CURLY APOSTROPHES (kept from the test this replaces, critique pass 2, P2.3; fix rounds F1 and F2): no string of COPY.home, the city rows'
   basis, the free doors or the locked cards prints a straight apostrophe, and the locked cities line begins with the free doors' own name. */
const straight: string[] = [];
const walkStrings = (v: unknown, path: string): void => { if (typeof v === "string") { if (v.includes("'")) straight.push(`${path}: ${v.slice(0, 40)}`); } else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walkStrings(x, `${path}.${k}`); };
walkStrings(COPY.home, "COPY.home");
walkStrings(COPY.cityCards.plain, "COPY.cityCards.plain");
walkStrings(COPY.freeDoors, "COPY.freeDoors");
walkStrings(COPY.locked, "COPY.locked");
check(`the home's, the free doors' and the locked cards' words print curly apostrophes (${straight.length ? straight.join("; ") : "none straight"})`, straight.length === 0, "src/lib/spine/copy.ts", "write the typographic apostrophe (U+2019) in every string of COPY.home, COPY.cityCards.plain, COPY.freeDoors and COPY.locked");
check(`the locked card's line for the UK's cities begins with the free doors' name for them ("${COPY.locked.lines.cities}")`, COPY.locked.lines.cities.startsWith(COPY.freeDoors.cities) && !COPY.locked.lines.cities.includes("'"), "src/lib/spine/copy.ts", "COPY.locked.lines.cities begins with COPY.freeDoors.cities's string, the typographic apostrophe in it");

/* A DEPARTMENT'S TITLE IS SET AS EVERY SECTION TITLE ON A ZONE (the critique's P2.2 of plan 2026-10-10: one tracking for the h2 rung). */
const railTracking = /\[data-zone\] \.spine-card:not\(\[data-keep-card\]\) \[data-rail-title\] \{[^}]*letter-spacing:\s*(-?[\d.]+em)/.exec(read("src/app/globals.css"))?.[1] ?? "none";
const deptH2 = /<h2[^>]*className="([^"]*)"/.exec(read("src/components/spine/archetypes/Department.tsx"))?.[1] ?? "";
check(`a department's title takes the zone title's tracking, ${railTracking}, and no tracking-tight (read: ${deptH2 || "no Department.tsx"})`, railTracking === "-0.01em" && deptH2.includes(`tracking-[${railTracking}]`) && !/tracking-tight/.test(deptH2), "src/components/spine/archetypes/Department.tsx", "give Department's h2 tracking-[-0.01em], the letter-spacing globals.css gives every Rail title on a zone");

/* THE RENDER, where pages-fresh wrote it. */
const render = read(RENDER);
if (!render) check("the home's render is there to read", false, RENDER, "run the pages-fresh gate (GATES --only=pages-fresh), which renders home gb first in the chain");
else {
  const doc = new JSDOM(render.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "")).window.document;
  const main = doc.querySelector("main") ?? doc.body;
  const zones = [...main.querySelectorAll("[data-zone]")];
  const labels = zones.map((z) => z.getAttribute("data-zone-label") ?? "");
  check(`the render's zones run the search, the contents, then the band (${labels.join(" | ")})`, copyAt("contents.label") !== "" && copyAt("band.label") !== "" && JSON.stringify(labels.filter((l) => l !== COPY.home.pro.kicker)) === JSON.stringify([COPY.home.searchLabel, copyAt("contents.label"), copyAt("band.label")]), RENDER);
  const wides = zones.filter((z) => z.getAttribute("data-zone") === "wide");
  const band = doc.getElementById("band");
  check(`three full widths by name, the search, the contents and the band (${wides.map((z) => z.getAttribute("data-zone-label")).join(" | ") || "none"}), the band the one terracotta zone`, wides.length === 3 && !!wides[0].querySelector("[data-hero]") && !!wides[1].querySelector("[data-contents]") && wides[2] === band && band?.getAttribute("data-tone") === "terra" && main.querySelectorAll('[data-tone="terra"]').length === 1, RENDER);
  const searchEl = doc.getElementById("search");
  const pos = searchEl?.querySelector("[data-positioning]") ?? null;
  const h1El = searchEl?.querySelector("h1") ?? null;
  check(`the positioning line stands in the search before the question, in its own words, beside the mark, never in capitals ("${pos?.textContent?.trim() ?? ""}")`, !!pos && !!h1El && (pos.compareDocumentPosition(h1El) & 4) !== 0 && copyAt("positioning") !== "" && pos.textContent?.trim() === copyAt("positioning") && !!pos.querySelector("svg") && !/uppercase|tracking-/.test(pos.getAttribute("class") ?? ""), RENDER);
  /* THE HERO AS THE SERVER DRAWS IT (kept from the test this replaces): the h1 on set lines, the picker's case and its no-script fields. */
  const h1At = render.indexOf("<h1");
  const h1 = h1At < 0 ? "" : render.slice(h1At, render.indexOf("</h1>", h1At) + 5);
  const h1Text = h1.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  check(`the h1 reads as one question ("${h1Text}")`, h1Text === `${COPY.home.h1.lead} ${HERO_BUSINESSES[0]} ${COPY.home.h1.middle} ${HERO_CITIES[0]}?`, RENDER);
  check("the h1 stands on set lines: a phone's break after the lead, a break after the business, each word ending its line", /^<h1 [^>]*>How much does a <br class="sm:hidden"\/><span class="text-atlas-700" data-founder-accent="">[\s\S]*?data-w="restaurant"[\s\S]*?<\/span><\/span><\/span> <br\/>make in <span class="text-atlas-700" data-founder-accent="">[\s\S]*?data-w="Shanghai\?"/.test(h1), RENDER);
  check("the \"?\" stands inside the city's slot against its word, no space before it", h1.includes(`>${HERO_CITIES[0]}<span class="text-[var(--c-ink)]">?</span></span>`) && !/<\/span>\s*\?/.test(h1), RENDER);
  const formAt = render.indexOf("<form");
  const formHtml = formAt < 0 ? "" : render.slice(formAt, render.indexOf("</form>", formAt) + 7);
  check("the picker paints the h1's first case on the first paint, and its no-script fields hold it", ["United Kingdom", "London", "Restaurants"].every((v) => formHtml.includes(`value="${v}"`)) && ['name="country" value="gb"', 'name="subdivision" value="london"', 'name="industry" value="restaurants"'].every((v) => formHtml.includes(v)), RENDER);
  check("the picker's labels read in sentence case, and its one action is the ink button", ["Country", "City", "Business"].every((l) => new RegExp(`<label for="[a-z]+" class="[^"]*">${l}</label>`).test(formHtml)) && !/uppercase|tracking-/.test(formHtml) && /<button type="submit"[^>]*class="[^"]*bg-\[var\(--c-ink\)\][^"]*">Show me the numbers /.test(formHtml), RENDER);
  check("the picker draws no examples' line and the page no definition line (the positioning line says what the site is)", !/<p data-try/.test(render) && !/data-definition/.test(render) && !(main.textContent ?? "").includes(COPY.home.definition), RENDER);
  /* One h1, one h2 a department (and Pro's where the switch is on in the render's environment), none skipped. */
  const count = (sel: string) => main.querySelectorAll(sel).length;
  const proOn = labels.includes(COPY.home.pro.kicker);
  check(`one h1 and one h2 a department, none skipped (h1 ${count("h1")}, h2 ${count("h2")} of ${6 + (proOn ? 1 : 0)}, h3 ${count("h3")})`, count("h1") === 1 && count("h2") === 6 + (proOn ? 1 : 0) && count("h3") === 0, RENDER);
  /* A PRO PRICE IS THE SITE'S OWN OFFER, NOT A STATISTIC (his decision of 2026-10-09): exempt only inside the Pro zone, as the band prints it. */
  const PRICES = [priceLine("year"), priceLine("month"), yearlyHeadline().replace(/ (?=\S+$)/, "\xa0")];
  const proZone = zones.find((z) => z.getAttribute("data-zone-label") === COPY.home.pro.kicker) ?? null;
  const figs = [...main.querySelectorAll(".fig")];
  const bare = figs.filter((f) => (!f.hasAttribute("data-src") || !f.hasAttribute("data-kind")) && !(proZone?.contains(f) && PRICES.includes(f.textContent ?? "")));
  check(`every figure says where it came from (${figs.length} figures, ${bare.length} without${bare.length ? `: ${bare.map((f) => JSON.stringify(f.textContent)).join(", ")}` : ""})`, bare.length === 0, RENDER, "give the figure its builder's prov (provAttrs, src/lib/spine/provenance.ts); a Pro price is exempt only as the plan prints it");
  const colophon = doc.getElementById("colophon");
  check("the colophon closes the page after the band: the licence line, Sources and licences, Report a mistake, the corrections log and status, no checked date, and no foot line beside it", !!colophon && !!band && (band.compareDocumentPosition(colophon) & 4) !== 0 && (colophon.textContent ?? "").includes(OGL_LINE) && !!colophon.querySelector(`a[href="${UK_SOURCES_FOOT.href}"]`) && !!colophon.querySelector('a[data-report="1"]') && !!colophon.querySelector('a[href="/corrections"]') && !!colophon.querySelector('a[href="/status"]') && !colophon.querySelector("[data-checked]") && main.querySelectorAll("[data-sources-foot]").length === 0, RENDER);
  /* THE TYPE FLOOR ON THE HOME (the spec's section 4: reader text 14 or larger, though the type-floor gate reads the spine pages): read as
     scripts/lib/type_floor.mjs reads (its blind spot is stated there); the home holds no chart and no 12px foot line, so it allows nothing. */
  const allow = new Set((JSON.parse(read("scripts/harness/type_floor_allow.json") || "[]") as Array<{ key: string }>).map((e) => e.key));
  const tf = readTypeFloor(doc, allow);
  check(`no reader text under 14px on the home, and no 12px place to allow (${tf.small} small and ${tf.allowed} allowed of ${tf.chars} characters${tf.runs.length ? `; ${tf.runs.slice(0, 4).map(([at, c]: [string, number]) => `${at} ${c}`).join("; ")}` : ""})`, tf.chars > 0 && tf.small === 0 && tf.allowed === 0, RENDER, "set every line of the home at var(--t-body) or larger: the colophon's licence line is 14 too, so nothing on the home needs an allowance");
  check("no retired section is on the home", !/id="(answer|years|trades|duel|kitchens|firms-last|new-companies|us-restaurants|how-made|place|pays|joins|archive|tax|record|cities|next)"/.test(render) && !/data-notebook|data-next=/.test(render), RENDER);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("trust/home_shape: all pass");
