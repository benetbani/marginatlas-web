/**
 * THE HOME AS AN INTRODUCTION (the spec docs/superpowers/specs/2026-10-09-home-introduction-design.md in the design repo, approved as
 * written on 2026-10-09; plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 10). His words that led to it: the home "is
 * vastly problematic and not serving as an elegant introduction of the concept but rather: here is what we have". In this order and
 * nothing else: the hero (his h1, still, "restaurant" first among its words, the picker with no heading, its three examples links, the
 * one line that says what the site is, after the form), the worked example (two halves, even), Pro only while the paywall is on, the
 * three proofs (a level of three, even), the band of the site's own counts (its own zone on the terracotta; plan 2026-10-10, Task 5),
 * the foot (the UK's cities, still, beside where to next, even); then the licence line and Report a mistake. Two wide zones, the
 * hero's and the band's, by name. Three seats: step 3 lit, the band a field, the foot none. No ledger counts (the band's four
 * evidence counts are tests/home/site_counts.test.ts's), no newsletter band,
 * no picker heading, no section the plan re-homed. One h2 a section and none skipped. Every figure carries its stamp, but for Pro's
 * three prices as the plan prints them (src/lib/monetization/plan.ts): an offer, no statistic. Read from src/components/spine/home/home-view.tsx,
 * src/app/page.tsx, src/components/NavigatorForm.tsx and src/components/StructuredData.tsx, and from the harness render
 * scratchpad/harness/pages/home-gb.html where it exists.
 * Run: npx tsx tests/trust/home_shape.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { CityRows } from "../../src/components/spine/archetypes/CityRows";
import { buildCityCards } from "../../src/lib/spine/city_cards";
import { HERO_BUSINESSES, HERO_CITIES } from "../../src/lib/hero-words";
import { homeTryLinks, homeTryCityLabel } from "../../src/lib/home/destination";
import { COPY } from "../../src/lib/spine/copy";
import { priceLine, yearlyHeadline } from "../../src/lib/monetization/plan";
import { OGL_LINE, UK_SOURCES_FOOT } from "../../src/lib/spine/uk_sources";
import { stripCommentLines } from "../../scripts/lib/strip_comments";

let failed = 0;
let deferred = 0;
const check = (name: string, ok: boolean, remedy?: string) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); if (!ok && remedy) console.log(`      Remedy: ${remedy}`); };
const VIEW = "src/components/spine/home/home-view.tsx";
const view = readFileSync(VIEW, "utf8");
/* JSX COMMENTS GO FIRST, WHOLE (fix round B): one that runs over two lines leaves its `{` and its `}` for stripCommentLines to hand back,
   the closing one at column 0, and the slices below that end at the first line starting with `}` would stop there, early. Tempered,
   so a match never runs past the end of its own comment: a plain lazy match could start at a brace that opens a comment in code and
   end at a later JSX comment, deleting the code between (the re-review of fix round B). */
const code = stripCommentLines(view.replace(/\{\s*\/\*(?:(?!\*\/)[\s\S])*\*\/\s*\}/g, "").split("\n")).join("\n");
const live = readFileSync("src/app/page.tsx", "utf8");
const picker = readFileSync("src/components/NavigatorForm.tsx", "utf8");
const sd = readFileSync("src/components/StructuredData.tsx", "utf8");

/* THE ZONE ORDER, as the body lists its zones (each `key:` inside the `zones` array of SpineHomeBody), and each zone's line. */
const body = /const zones[\s\S]*?\n  \];/.exec(code)?.[0] ?? "";
const keys = [...body.matchAll(/\bkey: "([a-z-]+)"/g)].map((m) => m[1]);
check(`the zones run the hero, the worked example, the proofs, the band, then the foot (read: ${keys.join(", ") || "none"})`, JSON.stringify(keys.filter((k) => k !== "pro")) === JSON.stringify(["search", "example", "proofs", "record", "foot"]), `keep SpineHomeBody's zones (${VIEW}) search, example, (pro), proofs, record, foot`);
const pro = keys.indexOf("pro");
check("Pro, where it is listed, stands after the example and before the proofs, behind the paywall's switch", pro === -1 || (pro > keys.indexOf("example") && pro < keys.indexOf("proofs") && /isPaywallOn\(\) \? \[\{ key: "pro"/.test(body)));
const zoneLine = (key: string) => new RegExp(`\\{ key: "${key}", split: "([^"]+)"[^\\n]*`).exec(body);
const split = (key: string) => zoneLine(key)?.[1];
const even = (key: string) => /even: (true|!!cities)/.test(zoneLine(key)?.[0] ?? "");
check(`the splits: the hero wide, the example 1-1 even, the proofs 1-1-1 even, the band wide, the foot 1-1 even (read: ${["search", "example", "proofs", "record", "foot"].map((k) => `${k} ${split(k)}${even(k) ? " even" : ""}`).join(", ")})`, split("search") === "wide" && split("example") === "1-1" && even("example") && split("proofs") === "1-1-1" && even("proofs") && split("record") === "wide" && !even("record") && split("foot") === "1-1" && even("foot") && (body.match(/split: "wide"/g) ?? []).length === 2, "the hero and the band are the only wide zones (the spec's section 5: the band's four siblings cannot be halved); the example and the foot are halves, the proofs thirds, each even");
check("the example is two halves, the place then whether it pays", /<HomePlace key="place"[^\n]*<HomePays key="pays"/.test(zoneLine("example")?.[0] ?? ""));
check("the proofs are three doors, the joins, the archive, then the tax", /<ProofJoins key="joins"[^\n]*<ProofArchive key="archive"[^\n]*<ProofTax key="tax"/.test(zoneLine("proofs")?.[0] ?? ""));
check("the foot is the UK's cities, still, then where to next", /<HomeCities key="cities"[^\n]*<WhereNext key="next"/.test(zoneLine("foot")?.[0] ?? "") && /<CityRows\b/.test(code));

/* THE BAND (plan 2026-10-10, the home reformed to ship, Task 5): HomeRecord from its builder, listed only when all four counts build, its
   own zone on the terracotta, and the tones given by the zones that are not the band, so the foot keeps its tone. */
check("the band is HomeRecord from buildSiteCounts, listed only when it builds, on the terracotta tone the alternation skips", /\.\.\.\(record \? \[\{ key: "record", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY\.home\.record\.label, body: \[<HomeRecord key="record" record=\{record\} \/>\] \}\] : \[\]\)/.test(body) && /const record = buildSiteCounts\(\);/.test(code) && /const toned = zones\.filter\(\(z\) => z\.tone !== "terra"\);/.test(code) && /zoneTone\(toned\.indexOf\(z\)\)/.test(code), `list the band in ${VIEW} as ...(record ? [{ key: "record", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY.home.record.label, body: [<HomeRecord key="record" record={record} />] }] : []) and give the tones by the zones that are not the band`);

/* NOTHING THE PLAN RE-HOMED OR RETIRED, AND NO LEDGER COUNTS OR NEWSLETTER (the band's four evidence counts are tests/home/site_counts.test.ts's). */
const RETIRED = ["HomeDuel", "HomeKitchens", "HomeFirmsLast", "HomeNewCompanies", "HomeUsRestaurants", "HomeHowMade", "Notebook", "buildNotebook", "AnswerDoor", "TaxAnswer", "TradesAnswer", "YearsAnswer", "buildHomeAnswers", "buildDuel", "buildKitchens", "buildFirmsLast", "buildNewCompanies", "buildUsRestaurants", "buildHowMade", "HomeNewsletter", "AtlasHolds", "buildAtlasHolds", "getAtlasLedger"];
const still = RETIRED.filter((n) => new RegExp(`\\b${n}\\b`).test(code));
check(`no section the plan re-homed or retired is drawn (${still.join(", ") || "none"})`, still.length === 0, "the duel and where new firms last stand on /gb, new companies and the US restaurants on /new-businesses, the join on the first proof, the kitchens list and the notebook off the home");
check("no ledger counts zone and no newsletter band", !/atlas_ledger|What the atlas holds|COPY\.home\.atlas\b/.test(code));

/* THE SEATS (plan 2026-10-10, the home reformed to ship, Task 5: the spec's decision 7, critique section 4): step 3 lit, the band lit by
   its ground (FIELD), the foot none; the tax proof quiet. */
const seats = /export const LOUD_SEATS = \[[\s\S]*?\] as const/.exec(code)?.[0] ?? "";
check("three seats: step 3 lit, the band a field, the foot none, the tax proof quiet", (seats.match(/state: "LIT"/g) ?? []).length === 1 && /seat: 1, card: "pays", id: "pays"[^\n]*state: "LIT"/.test(seats) && /seat: 2, card: "record", id: "record"[^\n]*state: "FIELD"/.test(seats) && /seat: 3, card: "foot"[^\n]*state: "NO HONEST CANDIDATE"/.test(seats) && !/id: "tax"/.test(seats), `declare LOUD_SEATS in ${VIEW}: seat 1 pays LIT, seat 2 record FIELD, seat 3 foot NO HONEST CANDIDATE`);

/* THE HERO (the spec's sections 3 and 5; plan 2026-10-10, home reform, Task 2: the h1 on set lines with both words on one timer, the
   picker's first paint from the server's seed, the spacing and the definition of the reform's spec, decision 3 and critique P1.13). */
check("the rebuilt home renders the picker without its heading, its first paint from the server's seed", /<NavigatorForm showHeading=\{false\} seed=\{homePickerSeed\(\)\} \/>/.test(code), `in ${VIEW} HomeSearch renders <NavigatorForm showHeading={false} seed={homePickerSeed()} />`);
/* The flag-off home passes the same seed (plan 2026-10-10, Task 7, amendment 8b): without it the form's first paint was three blank fields
   and a no-script submit sent empty fields to /api/go. It keeps its heading. */
check("the live home renders the picker with its heading, its first paint from the server's seed", /^import \{ homePickerSeed \} from "@\/lib\/home\/picker";/m.test(live) && /<NavigatorForm seed=\{homePickerSeed\(\)\} \/>/.test(live) && !/<NavigatorForm[^>]*showHeading=\{false\}/.test(live), "in src/app/page.tsx import { homePickerSeed } from \"@/lib/home/picker\" and render <NavigatorForm seed={homePickerSeed()} /> in the flag-off branch, as the rebuilt home does");
check("the picker's heading is drawn by default and only when asked", /showHeading = true/.test(picker) && /\{showHeading \? \(/.test(picker) && /Pick a country, a city, and a business\./.test(picker));
const search = /function HomeSearch[\s\S]*?\n\}/.exec(code)?.[0] ?? "";
check("the definition stands once, straight after the form, at the hero's foot", search.indexOf("<NavigatorForm") > -1 && search.indexOf("data-definition") > search.indexOf("<NavigatorForm") && (code.match(/\.definition\b/g) ?? []).length === 1);
check(`the h1's first words ask the example's question ("a ${HERO_BUSINESSES[0]}" in "${HERO_CITIES[0]}")`, HERO_BUSINESSES[0] === "restaurant" && HERO_CITIES[0] === "London");
check("the h1 holds the two words on one timer (HeroWords) with the question's own words, and no bare \"?\"", /<h1 [^>]*>\s*<HeroWords lead=\{C\.h1\.lead\} middle=\{C\.h1\.middle\} businesses=\{HERO_BUSINESSES\} cities=\{HERO_CITIES\} \/>\s*<\/h1>/.test(search) && !/<RotatingWord/.test(search), `in ${VIEW} HomeSearch's h1 holds only <HeroWords lead={C.h1.lead} middle={C.h1.middle} businesses={HERO_BUSINESSES} cities={HERO_CITIES} />`);
check("32px from the h1 to the picker from 1024 and 20 on a phone; the definition at the lead rung in ink2, at most 60ch and never past half the page, 24px under the picker from 1024 and 16 below", /<div id="home-search-anchor" className="relative z-30 mt-5 lg:mt-8 w-full">/.test(search) && /<p data-definition="" className="mt-4 lg:mt-6 max-w-\[min\(60ch,var\(--measure-half\)\)\] text-\[length:var\(--t-lead\)\] leading-snug text-\[var\(--c-ink2\)\]">/.test(search), `in ${VIEW} HomeSearch: the anchor "relative z-30 mt-5 lg:mt-8 w-full"; the definition "mt-4 lg:mt-6 max-w-[min(60ch,var(--measure-half))] text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]"`);
/* Each function's own text, to the next export: the WebSite comes before the Organization, so a lazy scan from the one would run on into the other. */
const sdFn = (name: string) => { const at = sd.indexOf(`export function ${name}(`); if (at < 0) return ""; const next = sd.indexOf("\nexport function ", at + 1); return sd.slice(at, next < 0 ? undefined : next); };
check("the WebSite's and the Organization's descriptions in the structured data are both the definition, so the home states it once", /description:\s*COPY\.home\.definition/.test(sdFn("WebSite")) && /description:\s*COPY\.home\.definition/.test(sdFn("Organization")), "in src/components/StructuredData.tsx set WebSite()'s description to COPY.home.definition, as Organization()'s is");
check("under the bands: the licence line, then Report a mistake with the London restaurant page's checked date", /<SourcesFoot iso2="GB" \/>\s*<ReportFoot path="\/" checked=\{example \? checkedDateForTrade\("GB", "london", example\.trade\) : null\} \/>/.test(code));

/* THE UK'S CITIES HELD STILL (his refusal of carousels and pagination, 2026-09-22), in the foot's half: CityRows since plan 2026-10-10
   (the home reformed to ship, Task 6), a server component, every city once as a row and one door to every UK city under 768. */
const cities = /function HomeCities[\s\S]*?\n\}/.exec(code)?.[0] ?? "";
check("the cities draw CityRows, a Rail at level 2, no pager labels", /<CityRows\b/.test(cities) && /<Rail [^>]*level=\{2\}/.test(cities) && !/prevLabel|nextLabel|CardPager|[Cc]arousel/.test(cities));
const gb = buildCityCards("GB");
const rows = gb ? renderToStaticMarkup(React.createElement(CityRows, { cards: gb.cards, basis: "basis", allHref: "/gb#cities", allLabel: COPY.home.citiesAll, unit: COPY.home.citiesUnit })) : "";
check("CityRows draws every city once, as a row (one door a city), and one door to every UK city, no tall card and no button", !!gb && (rows.match(/<a [^>]*data-card=/g) ?? []).length === gb.cards.length && (rows.match(/<a /g) ?? []).length === gb.cards.length + 1 && !/data-still=/.test(rows) && !/<button/.test(rows) && /data-form="rows"/.test(rows));

/* THE RENDER, where the harness wrote it (pages-fresh renders it first in the chain). */
const render = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (render) {
  const labels = [...render.matchAll(/<section data-zone="[^"]*"(?: data-tone="[^"]*")? data-zone-label="([^"]*)"/g)].map((m) => m[1].replace(/&#x27;/g, "'"));
  check(`the render's zones run in that order (${labels.join(" | ")})`, JSON.stringify(labels.filter((l) => l !== COPY.home.pro.kicker)) === JSON.stringify([COPY.home.searchLabel, COPY.home.example.label, COPY.home.proofs.label, COPY.home.record.label, COPY.home.citiesLabel]));
  const zoneRange = (label: string): [number, number] => { const at = render.indexOf(`data-zone-label="${label.replace(/'/g, "&#x27;")}"`); if (at < 0) return [0, 0]; const next = render.indexOf("<section data-zone", at + 1); return [render.lastIndexOf("<section", at), next < 0 ? render.length : next]; };
  const zoneOf = (label: string) => render.slice(...zoneRange(label));
  const ex = zoneOf(COPY.home.example.label), pr = zoneOf(COPY.home.proofs.label), ft = zoneOf(COPY.home.citiesLabel);
  check("the example: two halves, even, the place then whether it pays", /^<section data-zone="1-1"/.test(ex) && /data-zone-even/.test(ex) && ex.indexOf('id="place"') > 0 && ex.indexOf('id="pays"') > ex.indexOf('id="place"'));
  check("the proofs: a level of three, even, the joins, the archive, the tax", /^<section data-zone="1-1-1"/.test(pr) && /data-zone-even/.test(pr) && pr.indexOf('id="joins"') > 0 && pr.indexOf('id="archive"') > pr.indexOf('id="joins"') && pr.indexOf('id="tax"') > pr.indexOf('id="archive"'));
  check("the foot: the UK's cities, then where to next, even", /^<section data-zone="1-1"/.test(ft) && /data-zone-even/.test(ft) && ft.indexOf('id="cities"') > 0 && ft.indexOf("data-next=") > ft.indexOf('id="cities"'));
  /* TWO FULL WIDTHS, BY NAME (plan 2026-10-10, Task 5; the spec's section 5): the hero's zone, then the band's on the terracotta. */
  const wides = [...render.matchAll(/<section data-zone="wide"[^>]*>/g)];
  const wideLabel = (m: RegExpMatchArray) => (/data-zone-label="([^"]*)"/.exec(m[0])?.[1] ?? "").replace(/&#x27;/g, "'");
  const afterHero = wides[0] ? render.slice((wides[0].index ?? 0) + wides[0][0].length, (wides[0].index ?? 0) + wides[0][0].length + 240) : "";
  check(`the wide zones are the hero's and the band's, by name (${wides.map(wideLabel).join(" | ") || "none"})`, wides.length === 2 && wideLabel(wides[0]) === COPY.home.searchLabel && afterHero.includes("data-hero") && wideLabel(wides[1]) === COPY.home.record.label && /data-tone="terra"/.test(wides[1][0]) && /id="record"/.test(wides[1][0]), "the hero and the band are the home's two full widths (the spec's section 5); every other level is halves or thirds");
  check(`the terracotta tone is the band's alone (${(render.match(/data-tone="terra"/g) ?? []).length} zones)`, (render.match(/data-tone="terra"/g) ?? []).length === 1, "one terracotta zone on the home, the band (ZONE TONES accepts it once, on home-gb)");
  const form = render.indexOf("<form");
  check("the definition stands once in the render, after the form", form > -1 && render.indexOf(COPY.home.definition) > form && render.split(COPY.home.definition).length === 2);
  const links = homeTryLinks();
  check(`the picker's three examples are links (${links.map((l) => l.href).join(", ")})`, links.length === 3 && links.every((l) => render.includes(`href="${l.href}"`)));
  /* THE LINE READS AS WORDS (fix round B: a reader of the markup once got "Tryrestaurants"), and since plan 2026-10-10 it offers three
     other trades than the case: "Or try {a}, {b} or {c} in {city}." Read the line's text, the tags taken out. */
  const tryAt = render.indexOf("<p data-try");
  const tryRead = tryAt < 0 ? "" : render.slice(tryAt, render.indexOf("</p>", tryAt)).replace(/<[^>]*>/g, "");
  const tryWant = `Or try ${links.map((l, i) => (i === 0 ? "" : i === links.length - 1 ? " or " : ", ") + l.word).join("")} in ${homeTryCityLabel()}.`;
  check(`the picker's line reads as words ("${tryRead}", want "${tryWant}")`, tryRead === tryWant, `in src/components/NavigatorForm.tsx keep the line <p data-try=""> "Or try {a}, {b} or {c} in {city}." with its spaces as text`);
  /* THE HERO AS THE SERVER DRAWS IT (plan 2026-10-10, home reform, Task 2): the h1 on set lines, each word ending its line, the "?"
     against the city; the picker's case and its no-script fields on the first paint; sentence-case labels and the ink action. Each of
     the two words' wrappers carries data-founder-accent (his h1, the red it has always printed: the accent walk does not count it). */
  const h1At = render.indexOf("<h1");
  const h1 = h1At < 0 ? "" : render.slice(h1At, render.indexOf("</h1>", h1At) + 5);
  const h1Text = h1.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  check(`the h1 reads as one question ("${h1Text}")`, h1Text === `${COPY.home.h1.lead} ${HERO_BUSINESSES[0]} ${COPY.home.h1.middle} ${HERO_CITIES[0]}?`);
  check("the h1 stands on set lines: a phone's break after the lead, a break after the business, each word ending its line", /^<h1 [^>]*>How much does a <br class="sm:hidden"\/><span class="text-atlas-700" data-founder-accent="">[\s\S]*?data-w="restaurant"[\s\S]*?<\/span><\/span><\/span> <br\/>make in <span class="text-atlas-700" data-founder-accent="">[\s\S]*?data-w="Shanghai\?"/.test(h1), "render HeroWords' lines: the lead, <br className=\"sm:hidden\" />, the business slot, a space and <br />, the middle, the city slot, each slot's wrapper carrying data-founder-accent");
  check("the \"?\" stands inside the city's slot against its word, no space before it", h1.includes(`>${HERO_CITIES[0]}<span class="text-[var(--c-ink)]">?</span></span>`) && !/<\/span>\s*\?/.test(h1));
  const formAt = render.indexOf("<form");
  const formHtml = formAt < 0 ? "" : render.slice(formAt, render.indexOf("</form>", formAt) + 7);
  check("the picker paints its case on the first paint, and its no-script fields hold it", ["United Kingdom", "London", "Restaurants"].every((v) => formHtml.includes(`value="${v}"`)) && ['name="country" value="gb"', 'name="subdivision" value="london"', 'name="industry" value="restaurants"'].every((v) => formHtml.includes(v)), "pass NavigatorForm the server's seed (homePickerSeed, src/lib/home/picker.ts), so the first paint carries the three labels and the no-script fields");
  check("the picker's labels read in sentence case, and its one action is the ink button", ["Country", "City", "Business"].every((l) => new RegExp(`<label for="[a-z]+" class="[^"]*">${l}</label>`).test(formHtml)) && !/uppercase|tracking-/.test(formHtml) && /<button type="submit"[^>]*class="[^"]*bg-\[var\(--c-ink\)\][^"]*">Show me the numbers /.test(formHtml), "draw ComboField's labels as their words (no capitals) and NavigatorForm's button in bg-[var(--c-ink)]");
  const h = (tag: string) => (render.match(new RegExp(`<${tag}\\b`, "g")) ?? []).length;
  /* Eight sections with a title (the place, whether it pays, the three proofs, the band, the cities, where to next), and Pro's where
     the paywall's switch is on in the render's environment. */
  const sections = 8 + (labels.includes(COPY.home.pro.kicker) ? 1 : 0);
  check(`one h1 and one h2 a section, none skipped (h1 ${h("h1")}, h2 ${h("h2")} of ${sections}, h3 ${h("h3")})`, h("h1") === 1 && h("h2") === sections && h("h3") === 0);
  /* A PRO PRICE IS THE SITE'S OWN OFFER, NOT A STATISTIC (his decision of 2026-10-09): none of the four kinds (counted, worked out,
     looked up, estimate) is true of it, so with the paywall on the band's three prices carry no stamp. The one exemption: a figure
     INSIDE THE PRO ZONE whose text is one of the plan's own price strings, as the band prints them (ProBand holds the lead's last two
     words with a no-break space). Every other figure, in Pro or out of it, and a price anywhere else, still counts. */
  const PRICES = [priceLine("year"), priceLine("month"), yearlyHeadline().replace(/ (?=\S+$)/, "\xa0")];
  const [proFrom, proTo] = zoneRange(COPY.home.pro.kicker);
  /* A figure's text: what stands between its opening tag and its own closing tag, the tags inside taken out. */
  const figText = (open: string, from: number) => { const end = render.indexOf(`</${/^<(\w+)/.exec(open)?.[1] ?? "span"}>`, from); return render.slice(from, end < 0 ? from : end).replace(/<[^>]*>/g, ""); };
  const figs = [...render.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => ({ tag: m[0], at: m.index ?? 0, text: figText(m[0], (m.index ?? 0) + m[0].length) }));
  const bare = figs.filter((f) => (!/data-src="/.test(f.tag) || !/data-kind="/.test(f.tag)) && !(f.at >= proFrom && f.at < proTo && PRICES.includes(f.text)));
  check(`every figure says where it came from (${figs.length} figures, ${bare.length} without${bare.length ? `: ${bare.map((f) => JSON.stringify(f.text).replace(/\xa0/g, "\\u00a0")).join(", ")}` : ""})`, figs.length > 0 && bare.length === 0, "give the figure its builder's prov (src/lib/spine/provenance.ts provAttrs); a Pro price is exempt only as the plan prints it");
  check("the licence line and its link, then Report a mistake, under the bands", render.includes(OGL_LINE) && render.includes(`href="${UK_SOURCES_FOOT.href}"`) && render.indexOf("data-sources-foot") > -1 && render.indexOf("data-sources-foot") < render.indexOf("data-page-foot"));
  check("the render prints no picker heading, no counts and no newsletter form", !/Pick a country, a city, and a business\./.test(render) && !/What the atlas holds|atlas_ledger\.ts:/.test(render) && !/Notify me when my city/.test(render));
  check("no re-homed section is on the home", !/id="(answer|years|trades|duel|kitchens|firms-last|new-companies|us-restaurants|how-made)"/.test(render) && !/data-notebook/.test(render));
  check("the render's cities carry no pager", !/aria-label="(Previous cities|More cities)"/.test(render));
} else { deferred++; console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the render's checks did not run"); }

if (failed > 0) { console.error(`trust/home_shape: ${failed} failure(s). Remedy: keep ${VIEW} to the zones search (wide, the hero: his h1, the picker with no heading, the definition after it), example [<HomePlace> | <HomePays>] 1-1 even, (pro behind isPaywallOn), proofs [<ProofJoins> | <ProofArchive> | <ProofTax>] 1-1-1 even, record [<HomeRecord>] wide on the terracotta tone, foot [<HomeCities> | <WhereNext>] 1-1 even; seats pays LIT, record FIELD, foot NO HONEST CANDIDATE; then <SourcesFoot iso2="GB" /> and <ReportFoot path="/" checked={example ? checkedDateForTrade("GB", "london", example.trade) : null} />; every Rail on the home at level 2; then render the home (bash scratchpad/reform/render_some.sh "home gb") and run npx tsx tests/trust/home_shape.test.ts`); process.exit(1); }
console.log(deferred ? `trust/home_shape: all pass, ${deferred} deferred (render: not rendered here)` : "trust/home_shape: all pass");
