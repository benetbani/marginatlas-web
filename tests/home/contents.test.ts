/**
 * THE ATLAS AS A CONTENTS PAGE (plan docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Tasks 1B, 4A and 4B; spec
 * docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 3). Six numbered departments in one section,
 * each its number, its marks, a title of four words or fewer, one line of twelve words or fewer, at most four members and its door. Holds:
 *  - THE RULES, recomputed here from the modules each rule names and never from the builder's own reading: 01 the countries held to the
 *    registers, then the world page's broadest; 02 one city for each 01 country, its largest with its own figure, never two of one country; 03 rule 32's
 *    trades whose world net is their own, each printing its industry page's answer; 04 the four tools; 05 the tracks that hold an article
 *    and the newest post whose title counts nothing and names no place; 06 the method's three pages and About the figures;
 *  - THIN STATES (Review Focus 3): each builder fed an empty or odd source draws fewer rows, never a placeholder, and keeps its door;
 *  - A TRADE'S OWN FIGURE (Review Focus 4): a trade whose net is its sector profile's residual is left out, never printed as the trade's;
 *  - A POST THAT COUNTS (Review Focus 5): the reading department passes over a title holding a list count;
 *  - THE ANATOMY: the Department archetype as it renders, HomeContents' six literal sections, the marks in ink, the home's render;
 *  - THE SMALL COPIES the cities department draws, their crops and the root route's closure (moved from tests/home/foot.test.ts, which
 *    retires with the home's foot in Task 7A);
 *  - every member and door lands on a page the edge serves; the learn page holds each track's anchor; the trade-set gate's registry.
 * Every module this plan creates is loaded with import() through a specifier held in a string, so the file runs (and typechecks) before
 * the code it holds exists, and a missing module is a red by name, never a crash.
 * BLIND SPOT, stated: edgeNotFound is the edge's answer, so a route that answers notFound() after the edge lets an address through reads as
 * a page here (the production probe after a push is that instrument); a photograph is held to its file and crop, not to what a reader sees
 * (the photographs of Task 9 are).
 * Run: node node_modules/tsx/dist/cli.mjs tests/home/contents.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { posix } from "node:path";
import { JSDOM } from "jsdom";
import { COUNTRIES, INDUSTRIES, INDUSTRY_BY_ID, industryToSlug, slugToIndustry, tradeRowName } from "../../src/lib/taxonomy";
import { countryHeldToRegisters } from "../../src/lib/uk/registers/register_city";
import { countryPageTarget } from "../../src/lib/geo/page_targets";
import { getCoverageReport } from "../../src/lib/quality/coverage-report";
import { getCoverageRows } from "../../src/lib/coverage/report";
import { buildWorldAtlas } from "../../src/lib/scores/world_atlas";
import { buildCityCards } from "../../src/lib/spine/city_cards";
import { cityThumb } from "../../src/lib/cities/city_images";
import { EVERYDAY_TRADES } from "../../src/lib/spine/everyday_trades";
import { industryHeroFacts } from "../../src/lib/spine/industry_hero_facts";
import { resolveTradeNet } from "../../src/lib/spine/trade_net";
import { LEARN_BY_FAMILY } from "../../src/lib/learn/articles";
import { LEARN_TRACKS } from "../../src/lib/learn/tracks";
import { getAllPosts } from "../../src/lib/blog";
import { SHEET_TRUST } from "../../src/lib/nav";
import { UK_SOURCES_FOOT } from "../../src/lib/spine/uk_sources";
import { DOOR_ARROW } from "../../src/lib/spine/door_look";
import { edgeNotFound } from "../../src/lib/routing/edge_not_found";
import { COPY } from "../../src/lib/spine/copy";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-contents";
const BUILDER = "src/lib/home/contents.ts";
const DEPT_FILE = "src/components/spine/archetypes/Department.tsx";
const HC = "src/components/spine/home/HomeContents.tsx";
const RENDER = "scratchpad/harness/pages/home-gb.html";
const REMEDY = "build the six departments as plan 2026-10-13 Tasks 4A and 4B give them: each member from its rule read from the code, at most four, none padded, every door kept, a trade row printing its industry page's own figure";
const ORDER = ["countries", "cities", "trades", "tools", "reading", "method"] as const;
/* The modules this plan creates, by specifier held in a string: import() of a string the compiler cannot resolve types it loosely, so the
   file typechecks before the module exists, and the check that follows reds by name where it is missing. */
const SPEC_CONTENTS: string = "../../src/lib/home/contents";
const SPEC_LIST_COUNTS: string = "../../src/lib/home/list_counts";
const SPEC_DEPARTMENT: string = "../../src/components/spine/archetypes/Department";
let failed = 0;
const check = (label: string, ok: boolean, file = BUILDER, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };
const read = (f: string) => (existsSync(f) ? readFileSync(f, "utf8") : "");
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
/** A COPY.home string by its path, or "" until its task lands it. */
const copyAt = (path: string): string => { let v: unknown = COPY.home; for (const k of path.split(".")) v = v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined; return typeof v === "string" ? v : ""; };

/** A JPEG's width and height, read from its first start-of-frame marker (moved from tests/home/foot.test.ts; no image library). */
function jpegSize(path: string): { width: number; height: number } | null {
  const b = readFileSync(path);
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

/** The files a module reaches by static import or re-export, each with whether it carries "use client" (moved from tests/home/foot.test.ts;
 *  a static walk of the source: it cannot see an import() call). */
function reaches(entry: string): Array<{ file: string; client: boolean }> {
  const seen = new Map<string, boolean>();
  const resolveSpec = (from: string, spec: string): string | null => {
    const base = spec.startsWith("@/") ? posix.join("src", spec.slice(2)) : spec.startsWith(".") ? posix.join(posix.dirname(from), spec) : null;
    if (!base) return null;
    return [base, `${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`].find((c) => /\.tsx?$/.test(c) && existsSync(c)) ?? null;
  };
  const walk = (file: string): void => {
    if (seen.has(file)) return;
    const text = stripCommentLines(readFileSync(file, "utf8").split("\n")).join("\n");
    seen.set(file, /^\s*["']use client["']/.test(text));
    for (const m of text.matchAll(/(?:^|[\n;])\s*(?:import|export)\s+(type\s+)?([^;"']*?)\s*from\s*["']([^"']+)["']|(?:^|[\n;])\s*import\s*["']([^"']+)["']/g)) {
      if (m[1]) continue;
      const named = m[2] === undefined ? null : /^\{([\s\S]*)\}$/.exec(m[2].trim());
      if (named) { const specs = named[1].split(",").map((s) => s.trim()).filter(Boolean); if (specs.length > 0 && specs.every((s) => /^type\s/.test(s))) continue; }
      const to = resolveSpec(file, m[3] ?? m[4]);
      if (to) walk(to);
    }
  };
  walk(entry);
  return [...seen].map(([file, client]) => ({ file, client }));
}

async function main(): Promise<void> {
  /* ---------------- THE RULES (Task 4A) ---------------- */
  const B = await import(SPEC_CONTENTS).catch(() => null);
  check("the contents builder is there", !!B, BUILDER, "create src/lib/home/contents.ts as plan 2026-10-13 Task 4A gives it");
  if (B) {
    const contents = B.buildContents();
    check(`six departments in their order, numbered 01 to 06 (${B.DEPARTMENT_ORDER.join(", ")}), at most ${B.MEMBERS_MAX} members each`, JSON.stringify(B.DEPARTMENT_ORDER) === JSON.stringify(ORDER) && B.MEMBERS_MAX === 4 && ORDER.every((k, i) => contents[k].key === k && contents[k].index === String(i + 1).padStart(2, "0")));
    for (const k of ORDER) {
      const d = contents[k];
      check(`${d.index} ${d.title}: a title of four words or fewer and one plain line of twelve or fewer ("${d.line}")`, words(d.title) >= 1 && words(d.title) <= 4 && words(d.line) <= 12 && /^[A-Z]/.test(d.line) && d.line.endsWith(".") && !/[;—–]/.test(d.title + d.line) && !/\b(we|our|modelled|withheld)\b|on file/i.test(`${d.title} ${d.line}`), "src/lib/spine/copy.ts");
      check(`${d.index} ${d.title}: at most four members, none padded (${d.members.length}: ${d.members.map((m: { name: string }) => m.name).join(", ") || "none"})`, d.members.length <= 4 && d.members.every((m: { key: string; name: string; href: string }) => m.key !== "" && m.name.trim() !== "" && m.href.startsWith("/")));
      check(`${d.index} ${d.title}: its door, "${d.door.label}" to ${d.door.href}`, d.door.label.trim() !== "" && d.door.href.startsWith("/"));
    }
    /* 01: held to the registers first, then the world page's "where the map goes furthest", as /world builds it. */
    const report = getCoverageReport();
    const deepest = buildWorldAtlas({ ...report, countries: getCoverageRows() } as Parameters<typeof buildWorldAtlas>[0], new Set(COUNTRIES.map((c) => c.code)), (iso2) => COUNTRIES.find((c) => c.code === iso2)?.name || iso2, report?.totals?.industries_covered ?? 0).deepest.map((c) => c.iso2);
    const wantCountries = [...new Set([...COUNTRIES.filter((c) => countryHeldToRegisters(c.code)).map((c) => c.code), ...deepest])].filter((c) => countryPageTarget(c)).slice(0, 4);
    check(`01: the countries held to the registers, then the world page's broadest, each with a page (${contents.countries.members.map((m: { key: string }) => m.key).join(", ")}; recomputed ${wantCountries.join(", ")})`, JSON.stringify(contents.countries.members.map((m: { key: string }) => m.key.toUpperCase())) === JSON.stringify(wantCountries) && contents.countries.members.every((m: { key: string; name: string; href: string; mark: { kind: string }; figure: unknown }) => m.mark.kind === "flag" && m.figure === null && m.href === countryPageTarget(m.key)?.href && m.name === countryPageTarget(m.key)?.label));
    /* 02: one city for each country 01 lists, in its order: the first of the country's cards (largest metro first) that prints its own figure;
       its small photograph where the site holds one, else its country's flag (fix round 1, the final review's I3). */
    const cityCountry = new Map<string, string>();
    const wantCities = contents.countries.members.map((m: { key: string }) => m.key.toUpperCase()).flatMap((code: string) => { const card = (buildCityCards(code)?.cards ?? []).find((c) => typeof c.payUsd === "number"); if (card) cityCountry.set(card.id, code); return card ? [card.id] : []; }).slice(0, 4);
    check(`02: one city for each country of 01, its largest with its own figure, names only (${contents.cities.members.map((m: { key: string }) => m.key).join(", ")}; recomputed ${wantCities.join(", ")})`, JSON.stringify(contents.cities.members.map((m: { key: string }) => m.key)) === JSON.stringify(wantCities) && contents.cities.members.every((m: { key: string; href: string; mark: { kind: string; iso2?: string }; figure: unknown }) => m.figure === null && m.href === `/cities/${m.key}` && (cityThumb(m.key) ? m.mark.kind === "photo" : m.mark.kind === "flag" && m.mark.iso2 === cityCountry.get(m.key))));
    const cityCountries = contents.cities.members.map((m: { key: string }) => cityCountry.get(m.key) ?? "?");
    check(`02: no two city rows share a country (${cityCountries.join(", ")})`, cityCountries.length > 0 && new Set(cityCountries).size === cityCountries.length && !cityCountries.includes("?"));
    /* 03: rule 32's trades in its order whose world net is the trade's own (the shard branch), each the industry page's answer. */
    const everyday = [...new Set([...EVERYDAY_TRADES].map((s) => slugToIndustry(s)?.id).filter((x): x is string => !!x))];
    const wantTrades = everyday.filter((id) => resolveTradeNet(id, { moneyShown: false, netMarginPct: null })?.branch === "shard").slice(0, 4);
    check(`03: rule 32's trades in its order whose world net is the trade's own (${contents.trades.members.map((m: { key: string }) => m.key).join(", ")}; recomputed ${wantTrades.join(", ")})`, JSON.stringify(contents.trades.members.map((m: { key: string }) => m.key)) === JSON.stringify(wantTrades));
    for (const m of contents.trades.members as Array<{ key: string; name: string; href: string; mark: { kind: string }; figure: { text: string; prov: { src: string; kind: string } } | null }>) {
      const answer = industryHeroFacts(m.key)?.answer?.value;
      check(`03 ${m.name}: the industry page's own figure, "${m.figure?.text}" against its answer "${answer}", stamped from the trade's shard`, !!m.figure && m.figure.text === answer && m.figure.prov.src === `facts/industry/${m.key}.json:margin_ladder.net_margin_pct` && m.figure.prov.kind === "estimate" && m.name === tradeRowName(m.key, INDUSTRY_BY_ID[m.key]?.name ?? "") && m.href === `/industries/${industryToSlug(m.key)}` && m.mark.kind === "pictogram");
    }
    /* EACH TRADE ITS OWN MARK (the final review's I4, fix round 1): pharmacies drew the salon's scissors, the hairdressers' mark too. */
    const tradeMarks = contents.trades.members.map((m: { mark: { id?: string } }) => m.mark.id ?? "");
    check(`no two trade rows draw one mark (${tradeMarks.join(", ")})`, new Set(tradeMarks).size === tradeMarks.length && !tradeMarks.includes(""), "src/lib/brand/industry_pictogram.ts", "give the trade its own pictogram in DIRECT (src/lib/brand/industry_pictogram.ts)");
    const profileId = INDUSTRIES.map((i) => i.id).find((id) => resolveTradeNet(id, { moneyShown: false, netMarginPct: null })?.branch === "profile" && slugToIndustry(industryToSlug(id))?.id === id);
    const viaProfile = profileId ? B.contentsTrades([industryToSlug(profileId)]) : null;
    check(`a trade whose net is its sector's residual is left out, never printed under its name (${profileId ?? "no such trade found"}: ${viaProfile ? viaProfile.members.length : "not run"} member(s), figure ${profileId ? JSON.stringify(B.tradeOwnFigure(profileId)) : "none"})`, !!profileId && !!viaProfile && viaProfile.members.length === 0 && B.tradeOwnFigure(profileId) === null && viaProfile.door.href === "/industries");
    /* 04, 05, 06. */
    check("04: the four tools, Decide, Check, Calculator and Compare, each to its page", JSON.stringify(contents.tools.members.map((m: { name: string; href: string }) => [m.name, m.href])) === JSON.stringify([["Decide", "/decide"], ["Check", "/check"], ["Calculator", "/calculator"], ["Compare", "/compare"]]) && contents.tools.members.every((m: { mark: { kind: string }; figure: unknown }) => m.mark.kind === "icon" && m.figure === null));
    const L = await import(SPEC_LIST_COUNTS).catch(() => null);
    check("the count words are there (src/lib/home/list_counts.ts, Task 1C)", !!L, "src/lib/home/list_counts.ts");
    const tracksHeld = (["A", "B", "C"] as const).filter((f) => LEARN_BY_FAMILY(f).length > 0);
    /* The places a title can name, read again here from the code's own lists: every country's name and every covered city's, whole and in case. */
    const cityNames = (JSON.parse(read("data/cities/city_list_v1.json") || "{\"cities\":[]}") as { cities: Array<{ name: string }> }).cities.map((c) => c.name.replace(/\s*\([^)]*\)\s*$/, ""));
    const placeNames = [...COUNTRIES.map((c) => c.name), ...cityNames].filter((n) => n.trim() !== "");
    const titledPlace = (t: string) => placeNames.some((n) => { const at = t.indexOf(n); return at >= 0 && !/\p{L}/u.test(t[at - 1] ?? " ") && !/\p{L}/u.test(t[at + n.length] ?? " "); });
    const newest = L ? getAllPosts().find((p) => p.title.trim() !== "" && !L.holdsListCount(p.title) && !titledPlace(p.title)) : undefined;
    const wantReading = [...tracksHeld.map((f) => `/learn#track-${f}`), ...(newest ? [`/blog/${newest.slug}`] : [])];
    check(`05: the knowledge base's tracks that hold an article, then the newest post whose title counts nothing and names no place (${contents.reading.members.map((m: { href: string }) => m.href).join(", ")}; recomputed ${wantReading.join(", ")})`, JSON.stringify(contents.reading.members.map((m: { href: string }) => m.href)) === JSON.stringify(wantReading));
    const counted = B.contentsReading([{ slug: "a", title: "The 12 cities where rent fell" }, { slug: "b", title: "What a pharmacy keeps" }], () => false);
    check(`a post whose title counts a list is passed over for the next (${counted.members.map((m: { href: string }) => m.href).join(", ") || "none"})`, counted.members.map((m: { href: string }) => m.href).join() === "/blog/b");
    const placed = B.contentsReading([{ slug: "a", title: "Hairdressing and beauty businesses in each London borough" }, { slug: "b", title: "What a pharmacy keeps" }], () => false);
    check(`a post whose title names a place (London) is passed over for the next, so the home tells no one city's story (${placed.members.map((m: { href: string }) => m.href).join(", ") || "none"})`, placed.members.map((m: { href: string }) => m.href).join() === "/blog/b");
    check(`05: each track is named by the learn page's own heading (${contents.reading.members.filter((m: { key: string }) => m.key.startsWith("track-")).map((m: { name: string }) => m.name).join(" | ")})`, contents.reading.members.filter((m: { key: string }) => m.key.startsWith("track-")).every((m: { key: string; name: string }) => m.name === LEARN_TRACKS.find((t) => `track-${t.family}` === m.key)?.title));
    const about = SHEET_TRUST.find((n) => n.href.startsWith("/about-data"));
    check("06: Sources and licences, the corrections log, the coverage report; its door About the figures, the sheet's own name and address for it", JSON.stringify(contents.method.members.map((m: { href: string }) => m.href)) === JSON.stringify([UK_SOURCES_FOOT.href, "/corrections", "/coverage"]) && contents.method.members[0]?.name === UK_SOURCES_FOOT.link && !!about && contents.method.door.label === about.label && contents.method.door.href === about.href && B.ABOUT_THE_FIGURES.label === about.label && B.ABOUT_THE_FIGURES.href === about.href);
    /* THIN AND ODD STATES (Review Focus 3). */
    const thinC = B.contentsCountries([]);
    check(`a world with no coverage keeps the countries held to the registers and the door (${thinC.members.map((m: { key: string }) => m.key).join(", ")})`, thinC.members.map((m: { key: string }) => m.key).join() === "gb" && thinC.door.href === "/countries");
    const oddC = B.contentsCountries(["GB", "XX", "gb", "FR"]);
    check(`a country twice, or one with no page, is drawn once or not at all (${oddC.members.map((m: { key: string }) => m.key).join(", ")})`, oddC.members.map((m: { key: string }) => m.key).join() === "gb,fr");
    check(`a long list is cut at four (${B.contentsCountries(COUNTRIES.map((c) => c.code)).members.length})`, B.contentsCountries(COUNTRIES.map((c) => c.code)).members.length === 4);
    const london = buildCityCards("GB")?.cards.find((c) => c.id === "london");
    const manchester = buildCityCards("GB")?.cards.find((c) => c.id === "manchester");
    const thinCity = B.contentsCities([]);
    const noPay = london ? B.contentsCities([{ iso2: "GB", card: { ...london, payUsd: undefined } }]) : null;
    const twoOfOne = manchester && london ? B.contentsCities([{ iso2: "GB", card: london }, { iso2: "GB", card: manchester }]) : null;
    check(`no city card or a city with no figure of its own leaves the department its door and no such row; two cities of one country draw one row (${twoOfOne ? twoOfOne.members.map((m: { key: string }) => m.key).join(", ") : "not run"})`, thinCity.members.length === 0 && thinCity.door.href === "/cities" && !!noPay && noPay.members.length === 0 && !!twoOfOne && twoOfOne.members.map((m: { key: string }) => m.key).join() === "london");
    const thinT = B.contentsTrades([]);
    const oddT = B.contentsTrades(["restaurants", "restaurants", "no-such-trade"]);
    check(`no trade leaves the door alone; a trade twice or no trade at all is drawn once or not at all (${oddT.members.map((m: { key: string }) => m.key).join(", ")})`, thinT.members.length === 0 && thinT.door.href === "/industries" && oddT.members.length <= 1 && oddT.members.every((m: { key: string }) => m.key === "restaurants"));
    const thinR = B.contentsReading([], () => false);
    check("no track with an article and no post leaves the reading department its door alone", thinR.members.length === 0 && thinR.door.href === "/learn");
    /* EVERY MEMBER AND DOOR LANDS. */
    const hrefs: string[] = ORDER.flatMap((k) => [...contents[k].members.map((m: { href: string }) => m.href), contents[k].door.href]);
    const nowhere = hrefs.filter((h) => edgeNotFound(h.split("#")[0]));
    check(`every member and door lands on a page the edge serves (${hrefs.length} read${nowhere.length ? `; nowhere: ${nowhere.join(", ")}` : ""})`, hrefs.length >= 12 && nowhere.length === 0);
    (globalThis as unknown as { React: typeof React }).React = React;
    const { default: LearnHub } = await import("../../src/app/(site)/learn/page");
    const learn = renderToStaticMarkup(React.createElement(LearnHub));
    const anchors: string[] = contents.reading.members.filter((m: { href: string }) => m.href.startsWith("/learn#")).map((m: { href: string }) => m.href.split("#")[1]);
    check(`the learn page holds each track's anchor (${anchors.join(", ") || "none"})`, anchors.every((a) => learn.includes(`id="${a}"`)), "src/app/(site)/learn/page.tsx");
    const names: string[] = ORDER.flatMap((k) => contents[k].members.map((m: { name: string }) => m.name));
    const counting = L ? names.filter((n) => L.holdsListCount(n)) : names;
    check(`no member's name counts a list (${counting.join(" | ") || "none"})`, counting.length === 0);
    const tradeSet = (JSON.parse(read("scripts/gates.json") || "{\"gates\":[]}") as { gates: Array<{ name: string; reads?: string[] }> }).gates.find((g) => g.name === "trade-set");
    check(`the registry lists src/lib/home/contents.ts among the trade-set gate's reads (${(tradeSet?.reads ?? []).join(", ") || "no reads"})`, !!tradeSet && (tradeSet.reads ?? []).includes(BUILDER) && !(tradeSet.reads ?? []).includes("src/lib/home/destination.ts"), "scripts/verify_trade_set.ts", "name src/lib/home/contents.ts as a path literal in scripts/verify_trade_set.ts (HOME_TRADES_FILE), then run node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write");

    /* ---------------- THE ANATOMY (Task 4B) ---------------- */
    const D = await import(SPEC_DEPARTMENT).catch(() => null);
    check("the Department archetype is there", !!D, DEPT_FILE, "create it as plan 2026-10-13 Task 4B gives it");
    if (D) {
      const prov = { src: "facts/industry/restaurants.json:margin_ladder.net_margin_pct", kind: "estimate" as const };
      const props = { dept: "trades", index: "03", title: "Trades", line: "What each trade keeps from its sales, after all costs.", door: { label: "Every trade", href: "/industries" } };
      const html = renderToStaticMarkup(React.createElement(D.Department, { ...props, rows: [{ key: "a", href: "/industries/a", name: "Alpha", mark: React.createElement("span", null, "m"), figure: { text: "7%", unit: "of sales kept", prov } }, { key: "b", href: "/industries/b", name: "Beta", mark: React.createElement("span", null, "m"), figure: null }] }));
      const doc = new JSDOM(`<!doctype html><body>${html}</body>`).window.document;
      const root = doc.querySelector('[data-archetype="department"]');
      const index = root?.querySelector("[data-dept-index]");
      check("the form stamps its archetype and department, its index muted in the figures' face, hidden from a screen reader, no figure class", !!root && root.getAttribute("data-dept") === "trades" && index?.textContent === "03" && index.getAttribute("aria-hidden") === "true" && /tabular-nums/.test(index.className) && /text-\[var\(--c-muted\)\]/.test(index.className) && !/\bfig\b/.test(index.className), DEPT_FILE);
      check("its title an h2 the zones' title rule reads, its one line under it, marked a line", root?.querySelector("h2[data-rail-title]")?.textContent === "Trades" && root?.querySelectorAll("p").length === 1 && root?.querySelector("p[data-dept-line][data-line]")?.textContent === props.line, DEPT_FILE);
      const rowsEls = [...(root?.querySelectorAll("a[data-member]") ?? [])];
      const door = root?.querySelector("a[data-dept-all]");
      const arrows = [...(root?.querySelectorAll('span[aria-hidden="true"]') ?? [])].filter((s) => s.textContent === "→");
      check(`each member one shape: a link 44 tall, its mark hidden, its name, the door's arrow at its end; the door last (${rowsEls.length} rows, ${arrows.length} arrows)`, rowsEls.length === 2 && rowsEls.every((r) => /\bmin-h-11\b/.test(r.className) && r.querySelector('[data-member-mark][aria-hidden="true"]') && r.querySelector("[data-member-name]")) && arrows.length === 3 && arrows.every((a) => a.className === DOOR_ARROW) && door?.getAttribute("href") === "/industries" && (door.textContent ?? "").includes("Every trade") && /\bmin-h-11\b/.test(door.className) && root?.querySelector("li:last-child a") === door, DEPT_FILE);
      const fig = rowsEls[0]?.querySelector(".fig");
      check("a trade row's figure is stamped and says its unit to a screen reader; a row without one draws none", fig?.textContent === "7%" && fig.getAttribute("data-src") === prov.src && fig.getAttribute("data-kind") === "estimate" && rowsEls[0]?.querySelector(".sr-only")?.textContent === " of sales kept" && !rowsEls[1]?.querySelector(".fig"), DEPT_FILE);
      check("no terracotta anywhere in the form", !/terra|atlas-\d/.test(html), DEPT_FILE);
      const none = new JSDOM(`<!doctype html><body>${renderToStaticMarkup(React.createElement(D.Department, { ...props, rows: [] }))}</body>`).window.document;
      check("a department with no member draws its number, title, line and door, and no row (Review Focus 3)", !!none.querySelector("h2") && !!none.querySelector("[data-dept-line]") && none.querySelectorAll("a[data-member]").length === 0 && !!none.querySelector("a[data-dept-all]"), DEPT_FILE);
    }
    const hc = stripCommentLines(read(HC).split("\n")).join("\n");
    const boxes = [...hc.matchAll(/<Box id="(dept-[a-z]+)" className="flex flex-col">\s*<Department \{\.\.\.dept\("([a-z]+)"\)\} \/>\s*<\/Box>/g)].map((m) => [m[1], m[2]]);
    check(`six literal sections, each one department, in the order (${boxes.map(([id]) => id).join(", ") || "none"})`, JSON.stringify(boxes) === JSON.stringify(ORDER.map((k) => [`dept-${k}`, k])), HC, "write each department's Box on its own line in HomeContents.tsx: the census reads a Box's id from its literal");
    check("the grid: one column, two from 768, three from 1024, hairlines between departments, no sm: pairing", /md:grid-cols-2/.test(hc) && /lg:grid-cols-3/.test(hc) && /\[&>\*\+\*\]:border-t/.test(hc) && !/\bsm:grid-cols/.test(hc), HC);
    check("the marks: a flag, the city's small photograph in grey with no wash, a pictogram or an icon in ink (ma-mono)", /<CountryFlag iso2=\{mark\.iso2\} \/>/.test(hc) && /<DuotonePhoto [^>]*tint=\{false\}/.test(hc) && (hc.match(/className="ma-mono text-\[var\(--c-ink2\)\]"/g) ?? []).length === 2, HC);
    const css = read("src/app/globals.css");
    check("a glyph marked ma-mono draws its accent in its own ink, not the terracotta", /\.spine-scope \.ma-glyph\.ma-mono \.a \{\s*stroke: currentColor;\s*\}/.test(css) && /\.spine-scope \.ma-glyph\.ma-mono \.af \{\s*fill: currentColor;\s*stroke: none;\s*\}/.test(css), "src/app/globals.css");
    const render = read(RENDER);
    if (!render) check("the home's render is there to read", false, RENDER, "run the pages-fresh gate (GATES --only=pages-fresh)");
    else {
      const doc = new JSDOM(render.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
      const zone = [...doc.querySelectorAll("main [data-zone]")].find((z) => z.getAttribute("data-zone-label") === copyAt("contents.label"));
      const blocks = zone ? [...zone.querySelectorAll("[data-block]")].map((b) => b.getAttribute("data-block")) : [];
      check(`the contents zone is one full width holding the six departments in order (${blocks.join(", ") || "none"})`, !!zone && zone.getAttribute("data-zone") === "wide" && JSON.stringify(blocks) === JSON.stringify(ORDER.map((k) => `dept-${k}`)), RENDER);
      for (const k of ORDER) {
        const box = doc.getElementById(`dept-${k}`);
        const d = contents[k];
        const rowsEls = box ? [...box.querySelectorAll("a[data-member]")] : [];
        check(`${d.index} ${d.title} as drawn: its number, its title, ${d.members.length} row(s) as built, its door`, !!box && box.querySelector("[data-dept-index]")?.textContent === d.index && box.querySelector("h2")?.textContent === d.title && rowsEls.length === d.members.length && rowsEls.every((r, i) => r.getAttribute("href") === d.members[i].href) && box.querySelector("a[data-dept-all]")?.getAttribute("href") === d.door.href, RENDER);
      }
    }
  }

  /* ---------------- THE SMALL COPIES (moved from tests/home/foot.test.ts; the critique's P1.11, the ship audit's 3.3) ---------------- */
  const THUMBS = "public/cities/thumbs";
  const THUMBS_REMEDY = "run node node_modules/tsx/dist/cli.mjs scripts/build_city_images_manifest.ts --thumbs, then node node_modules/tsx/dist/cli.mjs scripts/gen_served_files.ts, and commit public/cities/thumbs with the manifest and src/lib/routing/served_files.ts";
  const photos = readdirSync("public/cities").filter((f) => /^[a-z0-9-]+\.jpe?g$/i.test(f));
  const copies = photos.map((f) => { const path = `${THUMBS}/${f}`; const held = existsSync(path); return { f, bytes: held ? statSync(path).size : 0, dims: held ? jpegSize(path) : null }; });
  const total = copies.reduce((s, c) => s + c.bytes, 0);
  check(`every city photograph has its small copy, 480 by 360 (${copies.filter((c) => c.dims?.width === 480 && c.dims?.height === 360).length} of ${photos.length})`, photos.length > 0 && copies.every((c) => c.dims?.width === 480 && c.dims?.height === 360), THUMBS, THUMBS_REMEDY);
  check(`each under 50,000 bytes and all under 200,000 (${total.toLocaleString("en-US")} in all)`, copies.every((c) => c.bytes > 0 && c.bytes < 50_000) && total < 200_000, THUMBS, THUMBS_REMEDY);
  const manifest = JSON.parse(read("data/cities/images_manifest.json") || "{\"cities\":{}}") as { cities: Record<string, { file: string; thumb?: string; position?: string }> };
  const MANIFEST = "data/cities/images_manifest.json";
  const MANIFEST_REMEDY = "give each city a position in data/cities/images_credits.json, then run node node_modules/tsx/dist/cli.mjs scripts/build_city_images_manifest.ts --thumbs; never edit the manifest by hand";
  const entries = Object.entries(manifest.cities);
  check(`the manifest names each small copy and its crop (${entries.length} cities)`, entries.length === photos.length && entries.every(([slug, e]) => e.thumb === `/cities/thumbs/${e.file.split("/").pop()}` && /^\d{1,3}% \d{1,3}%$/.test(e.position ?? "") && cityThumb(slug)?.src === e.thumb && cityThumb(slug)?.position === e.position), MANIFEST, MANIFEST_REMEDY);
  const credits = JSON.parse(read("data/cities/images_credits.json") || "{\"photos\":{}}") as { photos: Record<string, { position?: string }> };
  const apart = entries.filter(([slug, e]) => credits.photos[slug.toLowerCase()]?.position !== e.position).map(([slug]) => slug);
  check(`each city's crop in the manifest is the credits file's${apart.length ? `; apart: ${apart.join(", ")}` : ""}`, apart.length === 0, MANIFEST, MANIFEST_REMEDY);
  const PARTS = "src/components/spine/archetypes/CityParts.tsx";
  const clients = reaches(PARTS).filter((r) => r.client).map((r) => r.file);
  check(`CityParts.tsx, the photograph's recipe the contents draw, is a server module and reaches no client module${clients.length ? `; client: ${clients.join(", ")}` : ""}`, clients.length === 0, PARTS, "keep CityParts.tsx free of a \"use client\" directive and of any import that reaches a client module");
  const PAGER = "src/components/spine/archetypes/CityCards.tsx";
  const rootReach = [...reaches("src/app/layout.tsx"), ...reaches("src/app/page.tsx")];
  check("the root route's static import closure holds no pager (CityCards.tsx), and CityCards re-exports no DuotonePhoto", !rootReach.some((r) => r.file === PAGER) && !/export\s*\{\s*DuotonePhoto\s*\}/.test(read(PAGER)), "src/app/page.tsx", "import DuotonePhoto from \"@/components/spine/archetypes/CityParts\", never from CityCards.tsx");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("home/contents: all pass");
}

main().catch((e) => { red({ rule: RULE, file: BUILDER, detail: `the contents test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY }); process.exit(1); });
