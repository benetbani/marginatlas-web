/**
 * THE HOME'S FOOT (plan docs/superpowers/plans/2026-10-10-home-reform, Task 6; the spec's decisions 2 and 5; the critique's P1.10,
 * P1.11, P1.12 and P2.7; the ship audit's 3.3, 3.5, 4.4 and 5.8). Holds:
 *  - the small copies: one 480 by 360 JPEG for each city photograph, each under 50,000 bytes and all under 200,000 (the seven
 *    originals weigh 1,003,967), each named in the manifest with the crop that keeps its landmark in a short row;
 *  - the rows (src/components/spine/archetypes/CityRows.tsx): a server component (no client directive, no state, no button), every
 *    city a door with its promise, its small copy loading lazily and decoding off the main thread at its own size, in grey under a
 *    0.6 veil (ink on its darkest pixel 6.05 to 1, worked out here), two to a row under 768 with an eighth cell, "All UK cities", to
 *    /gb's cities, one row a city from 768, each figure stamped and saying its unit to a screen reader;
 *  - the doors: "From the blog" opens /blog, and no door is called the notebook;
 *  - the date: the home's foot asks the date the London restaurant page prints, whose figures its worked example prints;
 *  - where the harness wrote them, the home's render (the grey rows, the date, the blog, and the home's own door props: the eighth
 *    cell's address, its words and the unit each figure says) and /gb's (the anchor All UK cities opens);
 *  - the guards the closing cleanup of plan 2026-10-10 (items 21 to 24) added: the root route's static import closure holds no pager
 *    (CityCards.tsx, a client file; the picture's recipe is imported from CityParts.tsx); CityRows.tsx and CityParts.tsx stay server
 *    modules and reach no client module; the manifest's crops are the credits file's; and the ink the contrast check measures is the
 *    ink the rows draw. BLIND SPOT: the closure is a static walk of import and export statements, so it cannot see an import() call
 *    or a require, and a text class is read as written, never as computed.
 *
 * Run: npx tsx tests/home/foot.test.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { posix } from "node:path";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CityRows, ROW_VEIL } from "../../src/components/spine/archetypes/CityRows";
import { buildCityCards } from "../../src/lib/spine/city_cards";
import { cityThumb } from "../../src/lib/cities/city_images";
import { nextDoors } from "../../src/lib/home/next_doors";
import { checkedDateForTrade, REGISTER_BUILT } from "../../src/lib/spine/checked";
import { EXAMPLE_TRADE } from "../../src/lib/home/worked_example";
import { COPY } from "../../src/lib/spine/copy";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-foot";
const FILE = "src/components/spine/archetypes/CityRows.tsx";
const REMEDY = "draw the home's cities with CityRows (grey small copies at their crops, two to a row under 768 with All UK cities, one row a city from 768), name the blog door by the blog, and give the foot its checked date";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/** A JPEG's width and height, read from its first start-of-frame marker (no image library: the chain installs and runs none). */
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

/** The files a module reaches by static import or re-export (a type-only clause is erased, a package and a JSON file are left out),
 *  the module itself first, each with whether it carries a "use client" directive. A static walk of the source, as the 404's check in
 *  tests/chrome/masthead.test.ts walks the chrome's graph: it cannot see an import() call. */
function reaches(entry: string): Array<{ file: string; client: boolean }> {
  const seen = new Map<string, boolean>();
  const resolve = (from: string, spec: string): string | null => {
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
      const to = resolve(file, m[3] ?? m[4]);
      if (to) walk(to);
    }
  };
  walk(entry);
  return [...seen].map(([file, client]) => ({ file, client }));
}

/* THE SMALL COPIES (the critique's P1.11; the ship audit's 3.3). */
const THUMBS_AT = { file: "public/cities/thumbs", remedy: "run node node_modules/tsx/dist/cli.mjs scripts/build_city_images_manifest.ts --thumbs, then node node_modules/tsx/dist/cli.mjs scripts/gen_served_files.ts, and commit public/cities/thumbs with the manifest and src/lib/routing/served_files.ts" };
const photos = readdirSync("public/cities").filter((f) => /^[a-z0-9-]+\.jpe?g$/i.test(f));
const copies = photos.map((f) => { const path = `public/cities/thumbs/${f}`; const held = existsSync(path); return { f, bytes: held ? statSync(path).size : 0, dims: held ? jpegSize(path) : null }; });
const total = copies.reduce((s, c) => s + c.bytes, 0);
check(`every city photograph has its small copy, 480 by 360 (${copies.filter((c) => c.dims?.width === 480 && c.dims?.height === 360).length} of ${photos.length})`, photos.length > 0 && copies.every((c) => c.dims?.width === 480 && c.dims?.height === 360), THUMBS_AT);
check(`each under 50,000 bytes and all under 200,000 (${copies.map((c) => `${c.f.replace(/\.jpe?g$/i, "")} ${c.bytes.toLocaleString("en-US")}`).join(", ")}; ${total.toLocaleString("en-US")} in all)`, copies.every((c) => c.bytes > 0 && c.bytes < 50_000) && total < 200_000, THUMBS_AT);
const manifest = JSON.parse(readFileSync("data/cities/images_manifest.json", "utf8")) as { cities: Record<string, { file: string; thumb?: string; position?: string }> };
const MANIFEST_AT = { file: "data/cities/images_manifest.json", remedy: "give each city a position in data/cities/images_credits.json, then run node node_modules/tsx/dist/cli.mjs scripts/build_city_images_manifest.ts --thumbs; never edit the manifest by hand" };
const entries = Object.entries(manifest.cities);
check(`the manifest names each small copy and its crop (${entries.map(([slug, e]) => `${slug} ${e.position ?? "none"}`).join(", ")})`, entries.length === photos.length && entries.every(([slug, e]) => e.thumb === `/cities/thumbs/${e.file.split("/").pop()}` && /^\d{1,3}% \d{1,3}%$/.test(e.position ?? "") && cityThumb(slug)?.src === e.thumb && cityThumb(slug)?.position === e.position), MANIFEST_AT);

/* THE CROP IS THE CREDITS FILE'S (the closing cleanup of plan 2026-10-10, item 24). A city's position is chosen by hand in
   data/cities/images_credits.json and carried into the manifest by scripts/build_city_images_manifest.ts, which is run by hand too; the
   check above holds the manifest's position to a well-formed one and to what cityThumb hands the rows, but nothing compared it with the
   credits, so a position changed in the credits and not carried over (or a manifest edited by hand) drew the old crop silently. */
const credits = JSON.parse(readFileSync("data/cities/images_credits.json", "utf8")) as { photos: Record<string, { file?: string; position?: string }> };
const cropsApart = entries.filter(([slug, e]) => credits.photos[slug.toLowerCase()]?.position !== e.position).map(([slug, e]) => `${slug} ${e.position ?? "none"} against ${credits.photos[slug.toLowerCase()]?.position ?? "none"}`);
const unread = Object.entries(credits.photos).filter(([slug, c]) => c.position && !manifest.cities[slug]).map(([slug]) => slug);
check(`each city's crop in the manifest is the credits file's${cropsApart.length ? `; apart: ${cropsApart.join(", ")}` : ""}${unread.length ? `; credits with a position and no manifest entry: ${unread.join(", ")}` : ""} (${entries.length} cities)`, cropsApart.length === 0 && unread.length === 0, MANIFEST_AT);

/* THE ROWS (the spec's decision 2; the critique's P1.10; the ship audit's 3.5 and 4.4). */
const src = readFileSync(FILE, "utf8");
check("CityRows is a server component: no client directive, no state, no button", !/^"use client"/m.test(src) && !/useState|useEffect|<button/.test(src));
/* THE TWO SERVER MODULES STAY SERVER MODULES (the closing cleanup, item 23): neither carries a client directive, and neither reaches a
   client module through an import, however far down, so the home ships no client code for a list that never pages. */
const SERVER_AT = { remedy: "keep CityRows.tsx and CityParts.tsx free of a \"use client\" directive and of any import that reaches a client module: the home's rows are a server component, and the pager (CityCards.tsx) is the client file" };
for (const f of ["src/components/spine/archetypes/CityRows.tsx", "src/components/spine/archetypes/CityParts.tsx"]) {
  const reached = reaches(f);
  const clients = reached.filter((r) => r.client).map((r) => r.file);
  check(`${f} is a server module and reaches no client module (${reached.length} files in its static closure${clients.length ? `; client: ${clients.join(", ")}` : ""})`, clients.length === 0, { file: f, ...SERVER_AT });
}
/* THE ROOT ROUTE SHIPS NO PAGER (item 21): the home draws no pager, so the pager's client file (CityCards.tsx) is nowhere in the static
   import closure of the root layout and page. DuotonePhoto is imported from CityParts, which has no client directive, and CityCards no
   longer re-exports it. */
const PAGER = "src/components/spine/archetypes/CityCards.tsx";
const rootReach = [...reaches("src/app/layout.tsx"), ...reaches("src/app/page.tsx")];
const importers = [...new Set(rootReach.map((r) => r.file))].filter((f) => f !== PAGER && readFileSync(f, "utf8").includes("/CityCards\""));
check(`the root route's static import closure holds no pager (CityCards.tsx)${importers.length ? `; imported by ${importers.join(", ")}` : ""}, and CityCards re-exports no DuotonePhoto`, !rootReach.some((r) => r.file === PAGER) && importers.length === 0 && !/export\s*\{\s*DuotonePhoto\s*\}/.test(readFileSync(PAGER, "utf8")), { file: "src/app/page.tsx", remedy: "import DuotonePhoto from \"@/components/spine/archetypes/CityParts\" in src/app/page.tsx and HeroBoard.tsx, and delete the re-export in CityCards.tsx: the root route draws no pager" });
const gb = buildCityCards("GB");
check("the UK's cities build", !!gb, { file: "src/lib/spine/city_cards.ts", remedy: "keep buildCityCards(\"GB\") holding the covered UK cities" });
if (gb) {
  const html = renderToStaticMarkup(React.createElement(CityRows, { cards: gb.cards, basis: COPY.cityCards.plain.basis, allHref: "/gb#cities", allLabel: COPY.home.citiesAll, unit: COPY.home.citiesUnit }));
  const doors = [...html.matchAll(/<a href="([^"]+)" data-card="([^"]+)" data-lands="([^"]+)"/g)];
  check(`every city a door to its page, with its promise (${doors.length} of ${gb.cards.length})`, doors.length === gb.cards.length && gb.cards.every((c, i) => doors[i]?.[1] === c.href && doors[i]?.[2] === c.id && doors[i]?.[3] === c.lands));
  const imgs = [...html.matchAll(/<img [^>]*>/g)].map((m) => m[0]);
  check(`each row's picture is its city's small copy, lazy, decoding off the main thread, at its own size, in grey at its crop (${imgs.length})`, imgs.length === gb.cards.length && gb.cards.every((c, i) => { const t = cityThumb(c.id); return !!t && !!imgs[i] && imgs[i].includes(`src="${t.src}"`) && imgs[i].includes('loading="lazy"') && imgs[i].includes('decoding="async"') && imgs[i].includes('width="480"') && imgs[i].includes('height="360"') && imgs[i].includes("filter:grayscale(1)") && imgs[i].includes(`object-position:${t.position}`); }));
  const veils = [...html.matchAll(/<span aria-hidden="true" data-veil="true" class="absolute inset-0 bg-white" style="opacity:([0-9.]+)"><\/span>/g)].map((m) => Number(m[1]));
  check(`grey and no wash: a white veil at ${ROW_VEIL} over each picture, no terracotta (${veils.length})`, ROW_VEIL === 0.6 && veils.length === gb.cards.length && veils.every((v) => v === ROW_VEIL) && !/data-tint/.test(html) && !/var\(--terra/.test(html));
  /* INK ON THE DARKEST PIXEL (decision 2): white at the veil over black is 255 times the veil in each channel, and --c-ink on it must
     read 4.5 to 1 at the least (WCAG AA, this repo's floor); at 0.6 it reads 6.05. */
  const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  const lum = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const floor = Math.round(255 * ROW_VEIL);
  const ink = /--c-ink:\s*#([0-9a-f]{6})/i.exec(readFileSync("src/app/globals.css", "utf8"))?.[1] ?? "";
  const [ir, ig, ib] = [0, 2, 4].map((k) => parseInt(ink.slice(k, k + 2), 16));
  const ratio = (lum(floor, floor, floor) + 0.05) / (lum(ir, ig, ib) + 0.05);
  check(`ink on the darkest pixel under the veil reads ${ratio.toFixed(2)} to 1 (rgb(${floor}, ${floor}, ${floor}) under #${ink})`, ink.length === 6 && ratio >= 4.5, { remedy: "keep ROW_VEIL where ink on the veiled darkest pixel reads 4.5 to 1 or more (0.6 reads 6.05)" });
  /* THE INK MEASURED IS THE INK DRAWN (the closing cleanup, item 24): the ratio above is --c-ink's, read from the stylesheet, so it
     holds only while every text on a row takes --c-ink. The name, the figure and the arrow each take text-[var(--c-ink)], and no row
     takes another colour token: ink2 or the muted grey over the veiled picture would read at a ratio this check never worked out. */
  const INK = "text-[var(--c-ink)]";
  const rowHtml = [...html.matchAll(/<a href="[^"]*" data-card="[^"]*"[^>]*>[\s\S]*?<\/a>/g)].map((m) => m[0]);
  const rowTexts = rowHtml.map((r) => ({
    name: (/<span data-city-name="true" class="([^"]*)"/.exec(r)?.[1] ?? "").split(" "),
    figure: (/<span class="(fig [^"]*)"/.exec(r)?.[1] ?? "").split(" "),
    arrow: (/<span aria-hidden="true" class="(relative [^"]*)"/.exec(r)?.[1] ?? "").split(" "),
    tokens: [...r.matchAll(/text-\[var\(--c-[a-z0-9]+\)\]/g)].map((m) => m[0]),
  }));
  check(`the ink the contrast check measures is the ink every row draws: the name, the figure and the arrow of each of ${rowHtml.length} rows take ${INK}, and no row takes another colour token`, rowHtml.length === gb.cards.length && rowTexts.every((t) => t.name.includes(INK) && t.figure.includes(INK) && t.arrow.includes(INK) && t.tokens.every((x) => x === INK)), { remedy: "every text on a row takes text-[var(--c-ink)], the ink the ratio above is worked out for: if a row's text takes another colour, work out its ratio on the veiled darkest pixel first and measure that colour here" });
  check("two to a row under 768 and one row a city from 768, sharing the height the half lends", html.includes('<div class="grid flex-1 grid-cols-2 gap-2 md:grid-cols-1 md:auto-rows-fr">') && /data-archetype="city-cards" data-look="grey" data-form="rows"/.test(html));
  const all = /<a href="\/gb#cities" data-all-cities="" class="([^"]*)"><span>([^<]*)<\/span><span aria-hidden="true" class="[^"]*">→<\/span><\/a>/.exec(html);
  check(`an eighth cell under 768, "${COPY.home.citiesAll}", to /gb's cities, so seven cities and the door fill four rows`, !!all && all[2] === COPY.home.citiesAll && /\bmd:hidden\b/.test(all[1]) && /\bmin-h-16\b/.test(all[1]) && gb.cards.length + 1 === 8 && (html.match(/<a /g) ?? []).length === gb.cards.length + 1);
  const cells = (html.match(/class="group relative grid min-h-16 grid-cols-\[minmax\(0,1fr\)_auto\][^"]*md:min-h-11 md:grid-cols-\[minmax\(0,22ch\)_auto_1fr_auto\]/g) ?? []).length;
  const names = (html.match(/data-city-name="true" class="relative col-span-2 block min-w-0 text-\[length:var\(--t-head\)\]/g) ?? []).length;
  check(`each row 64px tall on a phone and 44 at the least from 768, its name at 20 across the cell over its figure (${cells} rows, ${names} names)`, cells === gb.cards.length && names === gb.cards.length);
  const priced = gb.cards.filter((c) => typeof c.payUsd === "number").length;
  const units = (html.match(new RegExp(`<span class="sr-only"> ${COPY.home.citiesUnit}</span>`, "g")) ?? []).length;
  check(`every figure says its unit to a screen reader, "${COPY.home.citiesUnit}" (${units} of ${priced})`, priced > 0 && units === priced);
  const figs = [...html.matchAll(/<span class="fig[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure stamped from its builder (${figs.length})`, figs.length === gb.cards.length && figs.every((f) => /data-src="[^"]+" data-kind="(worked out|estimate)"/.test(f)));
}

/* THE DOORS (the critique's P2.7; the spec's decision 5): the blog under the name the nav, the footer and the page give it. */
const doors = nextDoors("/");
const blog = doors.find((d) => d.href === "/blog");
check(`"${blog?.label}" opens /blog, and no door is the notebook`, blog?.label === "From the blog" && blog?.key === "blog" && !doors.some((d) => /notebook/i.test(`${d.key} ${d.label}`)), { file: "src/lib/home/next_doors.ts", remedy: "key the /blog door blog, its words COPY.home.next.doors.blog, \"From the blog\"" });

/* THE DATE A READER CAN SEE (the critique's P1.12; the ship audit's 5.8): the home's worked example prints London restaurants'
   figures, so its foot carries that page's date. */
const VIEW = "src/components/spine/home/home-view.tsx";
const view = readFileSync(VIEW, "utf8");
check(`the home's foot asks the London restaurant page's date through its worked example's trade (${REGISTER_BUILT ?? "none held"})`, /<ReportFoot path="\/" checked=\{example \? checkedDateForTrade\("GB", "london", example\.trade\) : null\} \/>/.test(view) && REGISTER_BUILT !== null && checkedDateForTrade("GB", "london", EXAMPLE_TRADE) === REGISTER_BUILT, { file: VIEW, remedy: "<ReportFoot path=\"/\" checked={example ? checkedDateForTrade(\"GB\", \"london\", example.trade) : null} />" });

/* THE RENDERS, where the harness wrote them. */
const home = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
const gbPage = existsSync("scratchpad/harness/pages/country-GB.html") ? readFileSync("scratchpad/harness/pages/country-GB.html", "utf8") : "";
if (home) {
  const at = home.indexOf('id="cities"');
  const end = at < 0 ? -1 : home.indexOf("data-next=", at);
  const foot = at < 0 ? "" : home.slice(at, end < 0 ? undefined : end);
  check("the home's render draws the cities as grey rows with All UK cities, no wash", /data-archetype="city-cards" data-look="grey" data-form="rows"/.test(foot) && foot.includes('data-all-cities=""') && !/data-tint/.test(foot), { file: VIEW, remedy: "draw HomeCities with CityRows, then render the home (bash scratchpad/reform/render_some.sh \"home gb\")" });
  /* THE HOME'S OWN DOOR PROPS (the closing cleanup, item 22): the checks above hand CityRows their own allHref, allLabel and unit, so
     they cannot tell what the home hands it. In the home's render the eighth cell opens /gb's cities, says "All UK cities", and every
     priced figure says "a year" to a screen reader (seven today: one for each of the UK's cities the builder prices). */
  const eighth = /<a href="([^"]*)" data-all-cities="" class="[^"]*"><span>([^<]*)<\/span>/.exec(foot);
  const yearSpans = (foot.match(/<span class="sr-only"> a year<\/span>/g) ?? []).length;
  const pricedCities = gb ? gb.cards.filter((c) => typeof c.payUsd === "number").length : -1;
  check(`the home's render hands CityRows its door: the eighth cell opens ${eighth?.[1] ?? "nothing"}, says "${eighth?.[2] ?? "nothing"}", and ${yearSpans} figures say "a year" to a screen reader (${pricedCities} priced)`, eighth?.[1] === "/gb#cities" && eighth?.[2] === "All UK cities" && yearSpans > 0 && yearSpans === pricedCities, { file: "src/components/spine/home/home-view.tsx", remedy: "HomeCities hands CityRows allHref \"/gb#cities\", allLabel COPY.home.citiesAll (\"All UK cities\") and unit COPY.home.citiesUnit (\"a year\"), then render the home (bash scratchpad/reform/render_some.sh \"home gb\")" });
  check(`the home's render prints "Checked" with ${REGISTER_BUILT ?? "the slices' date"} at its foot`, !!REGISTER_BUILT && new RegExp(`data-checked="1"[^>]*>[^<]*<time datetime="${REGISTER_BUILT}"`, "i").test(home), { file: VIEW, remedy: "pass ReportFoot the checked date, then render the home" });
  check("the home's render says \"From the blog\" and never the notebook", home.includes(">From the blog<") && !/From the notebook/.test(home), { file: "src/lib/home/next_doors.ts" });
} else console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the home's render checks did not run");
if (gbPage) check("/gb's render holds the cities' anchor that All UK cities opens (id=\"cities\")", /id="cities"/.test(gbPage), { file: "src/components/spine/country/country-view.tsx", remedy: "keep the country page's cities card at id=\"cities\", the home's All UK cities door" });
else console.log("DEFER  scratchpad/harness/pages/country-GB.html is not rendered here; the anchor check did not run");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/foot: all pass");
