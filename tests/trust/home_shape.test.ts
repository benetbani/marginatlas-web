/**
 * THE REBUILT HOME'S SHAPE (his instruction of 2026-10-07: "reform home drastically"; he called the live home "catastrophically
 * bad"; his section ideas of 2026-10-08, plan docs/superpowers/plans/2026-10-08-home-sections/PLAN.md). In this order and nothing
 * else: the search (the h1 asks the question, so the picker draws no heading of its own), the UK's three answers, the duel and the
 * kitchens list from the registers, Pro only while the paywall is on, then three levels of two halves each: where new firms last
 * beside the UK's city pages held still (his refusal of carousels and pagination, 2026-09-22), where new companies open beside
 * where US restaurants grew and shrank, and how figures are made beside the notebook, last. Every level but the search is a pair:
 * the section-bands gate bars a full-width section that is not the hero, and the baseline may only come down. The UK's cities' level
 * and the last level end level (`even`), each half filling the height the pair is given; the world level does not (open sections,
 * each its own height). No counts of what the atlas holds (its cities count took in the non-UK city pages, which are not indexed)
 * and no newsletter band (the footer's bar asks once). The live home keeps the picker's heading. Read from
 * src/components/spine/home/home-view.tsx, src/app/page.tsx and src/components/NavigatorForm.tsx, and from the harness render
 * scratchpad/harness/pages/home-gb.html where it exists.
 * Run: npx tsx tests/trust/home_shape.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { CityCards } from "../../src/components/spine/archetypes/CityCards";
import { buildCityCards } from "../../src/lib/spine/city_cards";

let failed = 0;
let deferred = 0;
const check = (name: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };
const view = readFileSync("src/components/spine/home/home-view.tsx", "utf8");
const live = readFileSync("src/app/page.tsx", "utf8");
const picker = readFileSync("src/components/NavigatorForm.tsx", "utf8");

/* THE ZONE ORDER, as the body lists its zones (each `key:` inside the `zones` array of SpineHomeBody). */
const body = /const zones[\s\S]*?\n  \];/.exec(view)?.[0] ?? "";
const keys = [...body.matchAll(/\bkey: "([a-z-]+)"/g)].map((m) => m[1]);
const want = ["search", "answers", "registers", "cities", "world", "method"];
check(`the zones run search, answers, registers, the UK's cities, beyond the UK, then how figures are made (read: ${keys.join(", ") || "none"})`, JSON.stringify(keys.filter((k) => k !== "pro")) === JSON.stringify(want));
const pro = keys.indexOf("pro");
check("Pro, where it is listed, stands after the registers and before the UK's cities, behind the paywall's switch", pro === -1 || (pro > keys.indexOf("registers") && pro < keys.indexOf("cities") && /isPaywallOn\(\) \? \[\{ key: "pro"/.test(body)));
/* THE THREE PAIRS (section-bands: no section but the hero spans the page, and the home's baseline is 0). */
const levelOf = (key: string) => new RegExp(`key: "${key}",\\s*split: "([^"]+)"[\\s\\S]*?body: (\\[[^\\n]*\\])`).exec(body);
const PAIRS: Array<[string, string, string]> = [["cities", "<HomeFirmsLast", "<HomeCities"], ["world", "<HomeNewCompanies", "<HomeUsRestaurants"], ["method", "<HomeHowMade", "<Notebook"]];
for (const [key, first, second] of PAIRS) {
  const m = levelOf(key);
  check(`the ${key} level is two halves, ${first.slice(1)} then ${second.slice(1)}, never a wide zone (read: split ${m?.[1] ?? "none"})`, !!m && m[1] === "1-1" && m[2].indexOf(first) !== -1 && m[2].indexOf(second) > m[2].indexOf(first));
}
/* The bars' call is one line, and its props hold an arrow (`=>`), so the read runs to the line's end, not to the first `>`. */
check("the UK's cities' level ends level while both draw, the bars and the city rows filling their halves", /key: "cities",[\s\S]*?even: !!\(last && cities\)/.test(body) && /<CityCards\s+still\s+stack\s+fill\b/.test(view) && /<BarList [^\n]*\sfill\s/.test(readFileSync("src/components/spine/home/HomeFirmsLast.tsx", "utf8")));
const world = /key: "world",[\s\S]*?body: \[[^\n]*\]/.exec(body)?.[0] ?? "";
check("the world level is not stretched (open sections, each its own height)", world.length > 0 && !/even:/.test(world));
check("the last level ends level while both draw, and the notebook's list fills its half in equal rows", /key: "method",[\s\S]*?even: !!\(howMade && notebook\.length\)/.test(body) && /<ul className="[^"]*\bflex-1\b[^"]*\bmd:auto-rows-fr\b[^"]*">/.test(view));

/* NO NEWSLETTER BAND. */
check("the rebuilt home draws no HomeNewsletter", !/HomeNewsletter/.test(view));

/* THE UK'S CITIES HELD STILL: the home's CityCards is the still row, given no pager labels, and the still row draws no control. */
const cities = /function HomeCities[\s\S]*?\n\}/.exec(view)?.[0] ?? "";
check("the cities zone draws CityCards `still`, with no pager labels and no carousel", /<CityCards\s+still\b/.test(cities) && !/prevLabel|nextLabel|CardPager|[Cc]arousel/.test(cities));
check("the home's cities take the row form at every width (`stack`), as a half cannot hold a row of tall cards", /<CityCards\s+still\s+stack\b/.test(cities));
const gb = buildCityCards("GB");
const stacked = gb ? renderToStaticMarkup(React.createElement(CityCards, { still: true, stack: true, cards: gb.cards, basis: "basis" })) : "";
check("CityCards still + stack draws every city once, as a row (one anchor a city), no tall card and no button", !!gb && (stacked.match(/<a /g) ?? []).length === gb.cards.length && !/data-still=/.test(stacked) && !/<button/.test(stacked) && /data-form="rows"/.test(stacked) && /\bgap-2\b/.test(stacked));
const still = gb ? renderToStaticMarkup(React.createElement(CityCards, { still: true, cards: gb.cards, basis: "basis" })) : "";
/* The still row writes each city in both of its forms (the row form below 1024, the tall card from it; the width picks one), so a
   city is counted once, by its id, and each form is held to every city. */
const form = (name: "row" | "tall") => new Set([...(new RegExp(`data-still="${name}"[\\s\\S]*?(?=data-still="|<p class=)`).exec(still)?.[0] ?? "").matchAll(/data-card="([^"]+)"/g)].map((m) => m[1]));
const drawn = form("tall").size;
check(`the still row draws every UK city page at once (${drawn} of ${gb?.cards.length ?? 0}) and no button`, !!gb && gb.cards.length > 0 && drawn === gb.cards.length && !/<button/.test(still));
check(`the still row's row form, drawn below 1024, holds every city too (${form("row").size} of ${gb?.cards.length ?? 0}), hidden from 1024`, !!gb && form("row").size === gb.cards.length && /data-still="row"[^>]*\blg:hidden\b/.test(still) && /data-still="tall"[^>]*\bhidden\b[^>]*\blg:flex\b/.test(still) && !/lg:flex-nowrap|flex-wrap/.test(still));
check("the still row draws no link to the world's list, so CityCards asks for no allHref", !/CityCards[^]*?allHref/.test(cities) && /allHref\?: string/.test(readFileSync("src/components/spine/archetypes/CityCards.tsx", "utf8")));

/* NO "WHAT THE ATLAS HOLDS" COUNTS. */
check("no counts zone (no AtlasHolds, buildAtlasHolds, ledger counts or COPY.home.atlas)", !/AtlasHolds|buildAtlasHolds|atlas_ledger|getAtlasLedger|What the atlas holds|COPY\.home\.atlas\b/.test(view));

/* THE THREE LOUD MOMENTS: the UK's answer, and the leads of sections 1 and 3, each declared LIT with its card's id. */
const seats = /export const LOUD_SEATS = \[[\s\S]*?\] as const/.exec(view)?.[0] ?? "";
check("three loud moments declared LIT: the UK's answer, where new firms last, the US restaurants", (seats.match(/state: "LIT"/g) ?? []).length === 3 && /card: "00 answer"/.test(seats) && /id: "firms-last"/.test(seats) && /id: "us-restaurants"/.test(seats));

/* THE PICKER'S HEADING: off on the rebuilt home, on (the default) on the live home. */
check("the rebuilt home renders the picker without its heading", /<NavigatorForm showHeading=\{false\} \/>/.test(view));
check("the live home renders the picker with its heading", /<NavigatorForm \/>/.test(live) && !/<NavigatorForm[^>]*showHeading=\{false\}/.test(live));
check("the picker's heading is drawn by default and only when asked", /showHeading = true/.test(picker) && /\{showHeading \? \(/.test(picker) && /Pick a country, a city, and a business\./.test(picker));

/* THE RENDER, where the harness wrote it (pages-fresh renders it first in the chain). */
const render = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (render) {
  const labels = [...render.matchAll(/<section data-zone="[^"]*"(?: data-tone="[^"]*")? data-zone-label="([^"]*)"/g)].map((m) => m[1].replace(/&#x27;/g, "'"));
  check(`the render's zones run in that order (${labels.join(" | ")})`, JSON.stringify(labels.filter((l) => l !== "Pro")) === JSON.stringify(["Search", "The UK's answers", "From the registers", "The UK's cities", "Beyond the UK", "How figures are made"]));
  const zoneOf = (label: string) => { const at = render.indexOf(`data-zone-label="${label.replace(/'/g, "&#x27;")}"`); if (at < 0) return ""; const next = render.indexOf("<section data-zone", at + 1); return render.slice(at, next < 0 ? undefined : next); };
  const pair = (label: string, a: string, b: string) => new RegExp(`<section data-zone="1-1"[^>]*data-zone-label="${label.replace(/'/g, "&#x27;")}"`).test(render) && zoneOf(label).indexOf(a) !== -1 && zoneOf(label).indexOf(b) > zoneOf(label).indexOf(a);
  check("the render's UK cities level holds where new firms last, then the city pages, side by side", pair("The UK's cities", 'id="firms-last"', 'id="cities"'));
  check("the render's world level holds where new companies open, then the US restaurants, side by side", pair("Beyond the UK", 'id="new-companies"', 'id="us-restaurants"'));
  check("the render's last level holds how figures are made, then the notebook, side by side", pair("How figures are made", 'id="how-made"', "data-notebook"));
  check("no zone of the page is a wide zone but the search", [...render.matchAll(/<section data-zone="wide"/g)].length === 1);
  check("the render prints no picker heading, no counts and no newsletter form", !/Pick a country, a city, and a business\./.test(render) && !/What the atlas holds|atlas_ledger\.ts:/.test(render) && !/Notify me when my city/.test(render));
  check("the render's cities zone carries no pager", !/aria-label="(Previous cities|More cities)"/.test(render));
} else { deferred++; console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the render's checks did not run"); }

if (failed > 0) { console.error(`trust/home_shape: ${failed} failure(s). Remedy: keep src/components/spine/home/home-view.tsx to the zones search, answers, registers, (pro), then three pairs at split 1-1, never a wide zone (the section-bands gate bars a full width that is not the hero): cities [<HomeFirmsLast> | <HomeCities>] even while both draw, world [<HomeNewCompanies> | <HomeUsRestaurants>] not even, method [<HomeHowMade> | <Notebook>] even while both draw; three LIT seats (00 answer, firms-last, us-restaurants); no HomeNewsletter and no counts section; its cities a <CityCards still stack fill> with no pager labels and its picker <NavigatorForm showHeading={false} />; keep <NavigatorForm /> with its heading in src/app/page.tsx and the heading behind showHeading (default true) in src/components/NavigatorForm.tsx; then render the home (bash scratchpad/reform/render_some.sh "home gb") and run npx tsx tests/trust/home_shape.test.ts`); process.exit(1); }
console.log(deferred ? `trust/home_shape: all pass, ${deferred} deferred (render: not rendered here)` : "trust/home_shape: all pass");
