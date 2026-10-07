/**
 * THE REBUILT HOME'S SHAPE (his instruction of 2026-10-07: "reform home drastically"; he called the live home "catastrophically
 * bad"). In this order and nothing else: the search (the h1 asks the question, so the picker draws no heading of its own), the UK's
 * three answers, the duel and the kitchens list from the registers, Pro only while the paywall is on, and the last level, two
 * halves: the UK's city pages held still (his refusal of carousels and pagination, 2026-09-22) beside the notebook. The cities
 * stood third and alone across the level until the visual gates' finding of 2026-10-07 (the section-bands gate bars a full-width
 * section that is not the hero, and the baseline may only come down), so they stand in a half, in the row form, beside the
 * notebook. No counts of what the atlas holds (its cities count took in the non-UK city pages, which are not indexed) and no
 * newsletter band (the footer's bar asks once). The live home keeps the picker's heading. Read from
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
const check = (name: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };
const view = readFileSync("src/components/spine/home/home-view.tsx", "utf8");
const live = readFileSync("src/app/page.tsx", "utf8");
const picker = readFileSync("src/components/NavigatorForm.tsx", "utf8");

/* THE ZONE ORDER, as the body lists its zones (each `key:` inside the `zones` array of SpineHomeBody). */
const body = /const zones[\s\S]*?\n  \];/.exec(view)?.[0] ?? "";
const keys = [...body.matchAll(/\bkey: "([a-z-]+)"/g)].map((m) => m[1]);
const want = ["search", "answers", "registers", "cities"];
check(`the zones run search, answers, registers, then the last level (the UK's cities beside the notebook) (read: ${keys.join(", ") || "none"})`, JSON.stringify(keys.filter((k) => k !== "pro")) === JSON.stringify(want));
const pro = keys.indexOf("pro");
check("Pro, where it is listed, stands after the registers and before the last level, behind the paywall's switch", pro === -1 || (pro > keys.indexOf("registers") && pro < keys.indexOf("cities") && /isPaywallOn\(\) \? \[\{ key: "pro"/.test(body)));
/* THE LAST LEVEL IS A PAIR, NOT A FULL WIDTH (section-bands: no section but the hero spans the page, and the home's baseline is 0). */
const last = /key: "cities",\s*split: "([^"]+)"[\s\S]*?body: (\[[^\n]*\])/.exec(body);
check(`the last level is two halves, the cities' section then the notebook's, and is not a wide zone (read: split ${last?.[1] ?? "none"})`, !!last && last[1] === "1-1" && last[2].indexOf("<HomeCities") !== -1 && last[2].indexOf("<Notebook") > last[2].indexOf("<HomeCities"));
check("the last level ends level (`even` while both draw) and the notebook's list fills its half in equal rows, so no blank stands under the posts", /key: "cities",[\s\S]*?even: !!\(cities && notebook\.length\)/.test(body) && /<ul className="[^"]*\bflex-1\b[^"]*\bmd:auto-rows-fr\b[^"]*">/.test(view));

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

/* THE PICKER'S HEADING: off on the rebuilt home, on (the default) on the live home. */
check("the rebuilt home renders the picker without its heading", /<NavigatorForm showHeading=\{false\} \/>/.test(view));
check("the live home renders the picker with its heading", /<NavigatorForm \/>/.test(live) && !/<NavigatorForm[^>]*showHeading=\{false\}/.test(live));
check("the picker's heading is drawn by default and only when asked", /showHeading = true/.test(picker) && /\{showHeading \? \(/.test(picker) && /Pick a country, a city, and a business\./.test(picker));

/* THE RENDER, where the harness wrote it (pages-fresh renders it first in the chain). */
const render = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (render) {
  const labels = [...render.matchAll(/<section data-zone="[^"]*"(?: data-tone="[^"]*")? data-zone-label="([^"]*)"/g)].map((m) => m[1].replace(/&#x27;/g, "'"));
  check(`the render's zones run in that order (${labels.join(" | ")})`, JSON.stringify(labels.filter((l) => l !== "Pro")) === JSON.stringify(["Search", "The UK's answers", "From the registers", "The UK's cities"]));
  check("the render's last level holds the cities and the notebook side by side (data-zone 1-1), and no zone of the page is a wide zone but the search", /<section data-zone="1-1"[^>]*data-zone-label="The UK&#x27;s cities"/.test(render) && render.indexOf('id="cities"') < render.indexOf("data-notebook") && [...render.matchAll(/<section data-zone="wide"/g)].length === 1);
  check("the render prints no picker heading, no counts and no newsletter form", !/Pick a country, a city, and a business\./.test(render) && !/What the atlas holds|atlas_ledger\.ts:/.test(render) && !/Notify me when my city/.test(render));
  check("the render's cities zone carries no pager", !/aria-label="(Previous cities|More cities)"/.test(render));
} else console.log("NOTE  scratchpad/harness/pages/home-gb.html is not rendered here; the render's checks did not run");

if (failed > 0) { console.error(`trust/home_shape: ${failed} failure(s). Remedy: keep src/components/spine/home/home-view.tsx to the zones search, answers, registers, (pro), then the last level (the cities beside the notebook, split 1-1, never a wide zone: the section-bands gate bars a full width that is not the hero), with no HomeNewsletter and no counts section, its cities a <CityCards still stack> with no pager labels and its picker <NavigatorForm showHeading={false} />; keep <NavigatorForm /> with its heading in src/app/page.tsx and the heading behind showHeading (default true) in src/components/NavigatorForm.tsx, then run npx tsx tests/trust/home_shape.test.ts`); process.exit(1); }
console.log("trust/home_shape: all pass");
