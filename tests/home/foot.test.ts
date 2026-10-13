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
import { WhereNext } from "../../src/components/spine/WhereNext";
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
  /* THE BASIS LINE GOES ONLY WHERE A HEAD SAYS IT (fix round F1, group G9; the D2 review's Minor 7a). CityRows hid its basis line from 768 on the assumption that its
     page draws CityRowsHead over the figures, which only the home does, so a second consumer without the head would have lost the figures' only label from 768. The
     caller now says it draws the head (`headed`, passed by HomeCities); without it the line stays at every width. BLIND SPOT: classes as written. */
  const basisOf = (props: Record<string, unknown>) => /<p data-basis="" class="([^"]*)">A basis line\.<\/p>/.exec(renderToStaticMarkup(React.createElement(CityRows, { cards: gb.cards, basis: "A basis line.", allHref: "/gb#cities", allLabel: "All", unit: "a year", ...props })))?.[1].split(" ") ?? [];
  const basisAlone = basisOf({}), basisHeaded = basisOf({ headed: true });
  check(`CityRows hides its basis line from 768 only when told its page draws the column head (headed): alone it keeps it at every width (${basisAlone.includes("md:hidden") ? "md:hidden" : "no md:hidden"}), headed it goes from 768 (${basisHeaded.includes("md:hidden") ? "md:hidden" : "no md:hidden"})`, basisAlone.length > 1 && !basisAlone.includes("md:hidden") && basisHeaded.includes("md:hidden"), { file: "src/components/spine/archetypes/CityRows.tsx", remedy: "give CityRows a `headed` prop (default false) and put md:hidden on the basis line only when it is true; HomeCities passes headed, since it draws CityRowsHead over the figures" });
  const doors = [...html.matchAll(/<a href="([^"]+)" data-card="([^"]+)" data-lands="([^"]+)"/g)];
  check(`every city a door to its page, with its promise (${doors.length} of ${gb.cards.length})`, doors.length === gb.cards.length && gb.cards.every((c, i) => doors[i]?.[1] === c.href && doors[i]?.[2] === c.id && doors[i]?.[3] === c.lands));
  const imgs = [...html.matchAll(/<img [^>]*>/g)].map((m) => m[0]);
  check(`each row's picture is its city's small copy, lazy, decoding off the main thread, at its own size, in grey at its crop (${imgs.length})`, imgs.length === gb.cards.length && gb.cards.every((c, i) => { const t = cityThumb(c.id); return !!t && !!imgs[i] && imgs[i].includes(`src="${t.src}"`) && imgs[i].includes('loading="lazy"') && imgs[i].includes('decoding="async"') && imgs[i].includes('width="480"') && imgs[i].includes('height="360"') && imgs[i].includes("filter:grayscale(1)") && imgs[i].includes(`object-position:${t.position}`); }));
  const veils = [...html.matchAll(/<span aria-hidden="true" data-veil="true" class="absolute inset-0 bg-white" style="opacity:([0-9.]+)"><\/span>/g)].map((m) => Number(m[1]));
  check(`grey and no wash: a white veil at ${ROW_VEIL} over each phone cell's picture, no terracotta (${veils.length})`, ROW_VEIL === 0.6 && veils.length === gb.cards.length && veils.every((v) => v === ROW_VEIL) && !/data-tint/.test(html) && !/var\(--terra/.test(html));
  /* INK ON THE DARKEST PIXEL (decision 2): white at the veil over black is 255 times the veil in each channel, and --c-ink on it must
     read 4.5 to 1 at the least (WCAG AA, this repo's floor); at 0.6 it reads 6.05. */
  const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  const lum = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const floor = Math.round(255 * ROW_VEIL);
  const ink = /--c-ink:\s*#([0-9a-f]{6})/i.exec(readFileSync("src/app/globals.css", "utf8"))?.[1] ?? "";
  const [ir, ig, ib] = [0, 2, 4].map((k) => parseInt(ink.slice(k, k + 2), 16));
  const ratio = (lum(floor, floor, floor) + 0.05) / (lum(ir, ig, ib) + 0.05);
  check(`ink on the darkest pixel under the veil reads ${ratio.toFixed(2)} to 1 (rgb(${floor}, ${floor}, ${floor}) under #${ink}), in the phone's cells where the name stands over the picture`, ink.length === 6 && ratio >= 4.5, { remedy: "keep ROW_VEIL where ink on the veiled darkest pixel reads 4.5 to 1 or more (0.6 reads 6.05)" });
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
  /* ONE PITCH WITH THE DOORS (critique pass 2, fix round C2, item P1.3): from 768 each city is a slot of 56px (the row 48 tall, 4 either
     side) in a grid of fixed rows, so the foot's two lists meet row for row; `md:auto-rows-fr` let the pitch follow the height the half
     lent, 52 apart beside the doors' 49, and by the seventh row Edinburgh stood 22px below "About the figures". */
  check("two to a row under 768 and one row a city from 768, each a 56px slot (the doors' own pitch)", html.includes('<div class="grid flex-1 grid-cols-2 gap-2 md:grid-cols-1 md:auto-rows-[56px] md:gap-0">') && !/md:auto-rows-fr/.test(html) && /data-archetype="city-cards" data-look="grey" data-form="rows"/.test(html));
  const all = /<a href="\/gb#cities" data-all-cities="" class="([^"]*)"><span>([^<]*)<\/span><span aria-hidden="true" class="([^"]*)">→<\/span><\/a>/.exec(html);
  /* THE EIGHTH CELL'S WORDS ARE THE NAMES' (critique pass 3, fix round D2, item P2.7): the seven names stand at 20 semibold on a phone and the
     eighth cell, "All UK cities", stood at 14 medium until 768, in a white cell beside them. Its type is the names' own recipe, read from the
     rendered rows and not typed here: the size, the weight, the leading and the tracking, at every width and never behind a breakpoint. */
  const NAME_TYPE = (rowTexts[0]?.name ?? []).filter((k) => /^(text-\[length:var\(--t-head\)\]|font-semibold|leading-\[1\.15\]|tracking-tight)$/.test(k));
  const allClasses = (all?.[1] ?? "").split(" ");
  check(`the eighth cell's words are the names' type at every width, "${NAME_TYPE.join(" ")}", with no 14 medium left under 768 (${allClasses.filter((k) => NAME_TYPE.includes(k)).length} of ${NAME_TYPE.length})`, NAME_TYPE.length === 4 && NAME_TYPE.every((k) => allClasses.includes(k)) && !allClasses.some((k) => /^(md:)?(text-\[length:var\(--t-body\)\]|font-medium|leading-5)$/.test(k) || /^md:(text-\[length:var\(--t-head\)\]|font-semibold|leading-\[1\.15\]|tracking-tight)$/.test(k)), { remedy: "give the All UK cities cell the names' own type with no md: prefix (text-[length:var(--t-head)] font-semibold leading-[1.15] tracking-tight), and drop its text-[length:var(--t-body)] font-medium leading-5 and the md: overrides that took it to 20" });
  /* THE PHOTO CELLS DROP THEIR ARROWS UNDER 768 (the same item): the cell is the door, and the arrow on Birmingham's discs nearly disappeared. It stays
     from 768, where the row's right edge is its mark, and the eighth cell keeps its own at every width (it has no picture to be the door's mark). */
  const rowArrows = rowTexts.map((t) => t.arrow);
  check(`under 768 the photo cells carry no arrow and from 768 each row's stands at its edge (hidden and md:block on ${rowArrows.filter((c) => c.includes("hidden") && c.includes("md:block")).length} of ${gb.cards.length}), and the eighth cell keeps its own at every width`, rowArrows.length === gb.cards.length && rowArrows.every((c) => c.includes("hidden") && c.includes("md:block")) && !!all && !(all[3] ?? "").split(" ").includes("hidden") && !(all[3] ?? "").split(" ").some((k) => k.startsWith("md:hidden")), { remedy: "give each row's arrow `hidden` and `md:block` (the cell is the door under 768), and leave the All UK cities cell's arrow shown at every width" });
  /* THE EIGHTH CELL'S ARROW IS THE ROWS' FROM 768 (critique pass 4, fix round F2, item P2.3): it took its cell's 20 semibold and measured 20 by 8px
     beside the seven rows' 14 by 5 (2.6 times their ink, 52 dark pixels to 20), a bolder mark that meant nothing more, standing under seven light ones.
     From 768, where it stands under them, it takes the rows' own arrow: the size and the leading read from the rendered rows (not typed here), and
     the normal weight; on a phone it keeps its 20 beside its 20px words, no other arrow in that grid. BLIND SPOT: classes as written; the ink
     measured at 768, 1024 and 1280 is the browser's (f2_p23_probe.mjs). */
  const ROW_ARROW_TYPE = (rowArrows[0] ?? []).filter((k) => /^(text-\[length:var\(--t-body\)\]|leading-none)$/.test(k));
  const allArrow = (all?.[3] ?? "").split(" ");
  check(`from 768 the eighth cell's arrow is the rows' own, "${ROW_ARROW_TYPE.join(" ")}" at a normal weight (${ROW_ARROW_TYPE.filter((k) => allArrow.includes(`md:${k}`)).length} of ${ROW_ARROW_TYPE.length} with md:, md:font-normal ${allArrow.includes("md:font-normal")}), and under 768 it keeps its cell's 20 (no unprefixed size, weight or leading on it)`, ROW_ARROW_TYPE.length === 2 && ROW_ARROW_TYPE.every((k) => allArrow.includes(`md:${k}`)) && allArrow.includes("md:font-normal") && !allArrow.some((k) => /^(text-\[length:var\(--t-body\)\]|font-normal|leading-none)$/.test(k)), { remedy: "give the All UK cities cell's arrow md:text-[length:var(--t-body)] md:font-normal md:leading-none, the rows' own arrow size from 768, and no unprefixed size, weight or leading: under 768 it keeps the 20px of its words" });
  /* AT EVERY WIDTH (critique pass 2, fix round C2, item P1.3): the door to every city was a phone's (md:hidden) and from 768 the half held
     seven cities beside the doors' eight. From 768 it is a row with no picture, in the slot after Edinburgh: its words at 20 semibold in
     ink, the arrow at the edge, the edge it always had. */
  check(`an eighth cell at every width, "${COPY.home.citiesAll}", to /gb's cities: under 768 so seven cities and the door fill four rows, from 768 a row with no picture in the eighth slot, its words at 20 semibold in ink`, !!all && all[2] === COPY.home.citiesAll && !/\bhidden\b/.test(all[1]) && /\bmin-h-16\b/.test(all[1]) && /\bmd:min-h-0\b/.test(all[1]) && /\bmd:my-1\b/.test(all[1]) && /\btext-\[var\(--c-ink\)\]/.test(all[1]) && /\bborder-\[var\(--c-line-strong\)\]/.test(all[1]) && gb.cards.length + 1 === 8 && (html.match(/<a /g) ?? []).length === gb.cards.length + 1);
  const cells = (html.match(/class="group relative grid min-h-16 grid-cols-\[minmax\(0,1fr\)_auto\][^"]*md:min-h-0 md:grid-cols-\[72px_minmax\(0,22ch\)_2\.25rem_1fr_0\.75rem\]/g) ?? []).length;
  const names = (html.match(/data-city-name="true" class="relative col-span-2 block min-w-0 text-\[length:var\(--t-head\)\]/g) ?? []).length;
  check(`each row 64px tall on a phone and the whole 56px slot from 768, its name at 20 across the cell over its figure (${cells} rows, ${names} names)`, cells === gb.cards.length && names === gb.cards.length);
  /* THE PICTURE IS A THUMBNAIL FROM 768 (critique pass 2, fix round C2, item P1.4): under the 0.6 veil each picture read as a pale grey
     smear in a 44px row, and the busiest ground on the page (Birmingham's discs) stood behind "$48K" and the arrow, so a washed row
     looked disabled. From 768 the picture leaves the row's ground: a 72 by 48 thumbnail at the left in grey with no veil, the row on
     white with a hairline above it as Where to next rules its doors (none above the first), the name underlined on hover. Under 768
     the two-up photo cells stay as they were. The thumbnail carries no text, so the ink-on-picture check above reads the phone's cells
     only: the text spans are the wrapper's siblings, never inside it. */
  const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<");
  const wrappers = rowHtml.map((r) => /^<a [^>]*><span aria-hidden="true" class="([^"]*)"><img [^>]*><span aria-hidden="true" data-veil="true"[^>]*><\/span><\/span><span data-city-name/.exec(r)?.[1]).map((c) => (c ? decode(c).split(" ") : []));
  const THUMB = ["absolute", "inset-0", "md:relative", "md:inset-auto", "md:block", "md:h-12", "md:w-[72px]", "md:overflow-hidden", "md:rounded-[8px]", "md:[&>[data-veil]]:hidden"];
  check(`from 768 the picture is a 72 by 48 thumbnail at the row's left, rounded 8, its white veil not drawn, and no text inside it (${wrappers.filter((c) => THUMB.every((k) => c.includes(k))).length} of ${gb.cards.length})`, rowHtml.length === gb.cards.length && wrappers.every((c) => THUMB.every((k) => c.includes(k))));
  const rowClasses = rowHtml.map((r) => decode(/^<a [^>]*class="([^"]*)"/.exec(r)?.[1] ?? "").split(" "));
  const WHITE = ["md:overflow-visible", "md:rounded-none", "md:border-0", "md:px-0", "md:py-0", "md:border-[var(--c-border)]", "md:hover:border-[var(--c-border)]", "md:grid-cols-[72px_minmax(0,22ch)_2.25rem_1fr_0.75rem]"];
  check(`from 768 each row is on white with a hairline above it, none above the first: no box, no veil, ink on white (${rowClasses.filter((c) => WHITE.every((k) => c.includes(k))).length} of ${gb.cards.length} rows, ${rowClasses.filter((c) => c.includes("md:border-t")).length} with the hairline)`, rowClasses.length === gb.cards.length && rowClasses.every((c, i) => WHITE.every((k) => c.includes(k)) && c.includes("md:border-t") === (i > 0)) && rowHtml.every((r) => /data-city-name="true" class="[^"]*md:group-hover:underline/.test(r)));
  /* THE DOORS' PITCH (item P1.3): Where to next takes a `pitch` from the page that stands it beside a list of rows (the home), so its
     rows are the same 56px slots and its first row starts where London's does; the pages that stand it alone keep the shared height. */
  const doorsList = (props: Record<string, unknown>) => renderToStaticMarkup(React.createElement(WhereNext, { title: "Where to next", doors: nextDoors("/"), ...props }));
  const pitched = doorsList({ pitch: true }), plain = doorsList({});
  const pitchOf = (h: string) => /md:auto-rows-\[(\d+)px\]/.exec(h)?.[1] ?? "";
  check(`Where to next takes a pitch: its rows 56px slots from 768 and the list 16px under its heading, as the cities' (${pitchOf(pitched) || "none"} against ${pitchOf(html) || "none"}); without it the rows share the height (md:auto-rows-fr) and the list is 12px under`, pitchOf(pitched) === "56" && pitchOf(pitched) === pitchOf(html) && /<ul class="mt-4 grid flex-1 grid-cols-1 md:auto-rows-\[56px\]">/.test(pitched) && !/md:auto-rows-fr/.test(pitched) && /<ul class="mt-3 grid flex-1 grid-cols-1 md:auto-rows-fr">/.test(plain), { file: "src/components/spine/WhereNext.tsx", remedy: "give WhereNext a `pitch` prop: the list mt-4 with md:auto-rows-[56px] when the page asks for it (the home), mt-3 and md:auto-rows-fr otherwise; the cities' grid is md:auto-rows-[56px]" });
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
  /* THE COLUMN HEAD (critique pass 3, fix round D2, item P2.2): the figures were named only by the basis line under the eighth row, about 450px
     below them, so "London $62K" read as a business's takings first (clause 66: text away from what it belongs to). From 768 a column head,
     "Typical pay", stands in the title row over the figures: 12 in the muted grey, on the h2's baseline, drawn out of flow so no row moves
     and the 56px register with Where to next holds; the basis line under the rows goes from 768, and under 768 the two-up cells keep it
     under the grid. The head is the rows' own grid laid over the title row, its words in the third column, so it stands over the figures at
     every width by construction; that holds only while the figure and arrow columns are fixed lengths (an `auto` column takes the width of
     what is in it, and the head's grid holds a head where the rows hold figures). BLIND SPOT: this reads classes, so that the head's
     baseline is the h2's (a strut of the title's own type, the head's line-height 1) is measured by the round's browser probe, not here. */
  const HEAD_AT = { file: "src/components/spine/archetypes/CityRows.tsx", remedy: "draw the head with CityRowsHead over HomeCities' title row (its Box relative): the rows' own grid (CityRows' one column template), the words in the third column at 12 semibold muted inside a strut of the title's type, out of flow and hidden under 768; give the basis line md:hidden; then render the home (bash scratchpad/reform/render_some.sh \"home gb\")" };
  const headWords: string | undefined = COPY.home.citiesHead;
  const headEl = /<div data-column-head="" class="([^"]*)"><span class="([^"]*)"><span class="([^"]*)">([^<]*)<\/span><\/span><\/div>/.exec(foot);
  const firstRow = /<a href="[^"]*" data-card="[^"]*" data-lands="[^"]*" class="([^"]*)"/.exec(foot);
  check(`the home's render draws the cities' column head, "${headWords ?? "none"}" (the copy's), in the title row between the title and the first row`, typeof headWords === "string" && !!headEl && headEl[4] === headWords && foot.indexOf("data-rail-title") >= 0 && foot.indexOf("data-rail-title") < foot.indexOf("data-column-head") && foot.indexOf("data-column-head") < foot.search(/data-card="[^"]+"/), HEAD_AT);
  const gridTokens = (cls: string | undefined) => (cls ?? "").split(" ").filter((k) => k.startsWith("md:grid-cols-[") || k === "md:gap-x-3");
  const tracks = (/md:grid-cols-\[([^\]]*)\]/.exec(firstRow?.[1] ?? "")?.[1] ?? "").split("_");
  check(`the head stands over the figures by construction: its grid is the rows' own (${gridTokens(headEl?.[1]).join(" ") || "none"} against ${gridTokens(firstRow?.[1]).join(" ") || "none"}) and the figure and arrow columns are fixed lengths, never auto (${tracks.join(" ")})`, gridTokens(firstRow?.[1]).length === 2 && JSON.stringify(gridTokens(firstRow?.[1])) === JSON.stringify(gridTokens(headEl?.[1])) && tracks.length === 5 && tracks[0] === "72px" && tracks[1] === "minmax(0,22ch)" && /^[\d.]+(rem|px)$/.test(tracks[2]) && tracks[3] === "1fr" && /^[\d.]+(rem|px)$/.test(tracks[4]), HEAD_AT);
  const headClasses = (headEl?.[1] ?? "").split(" ");
  check("the head is out of flow over the title row, so no row moves: absolute, pinned to the Box's top and sides at the title row's 28px (h-7), hidden under 768 and a centred grid from it", ["pointer-events-none", "absolute", "inset-x-0", "top-0", "h-7", "hidden", "md:grid", "md:items-center"].every((k) => headClasses.includes(k)), HEAD_AT);
  const strutClasses = (headEl?.[2] ?? "").split(" "), wordClasses = (headEl?.[3] ?? "").split(" ");
  check("the head is 12 in the muted grey on the h2's baseline: its words at the micro rung, semibold, muted, line-height 1, inside a strut of the title's own type (the head rung, a 28px line, semibold) in the third column, so the line box is the title's and the baseline is its", ["text-[length:var(--t-micro)]", "font-semibold", "text-[var(--c-muted)]", "leading-none"].every((k) => wordClasses.includes(k)) && ["col-start-3", "whitespace-nowrap", "text-[length:var(--t-head)]", "leading-7", "font-semibold"].every((k) => strutClasses.includes(k)), HEAD_AT);
  const basisWords = COPY.cityCards.plain.basis;
  const basisEl = new RegExp(`<p data-basis="" class="([^"]*)">${basisWords.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</p>`).exec(foot);
  check(`the basis line, "${basisWords}", stays under the grid under 768 and goes from 768 (md:hidden), where the head says it`, !!basisEl && basisEl[1].split(" ").includes("md:hidden"), HEAD_AT);
  const homeCode = stripCommentLines(view.split("\n")).join("\n");
  const homeCities = /function HomeCities[\s\S]*?\n\}\r?\n/.exec(homeCode)?.[0] ?? "";
  check("HomeCities stands the head over its title row: its Box is relative (the head's containing block) and draws the Rail, then CityRowsHead, then CityRows", /<Box id="cities" className="relative flex flex-col">/.test(homeCities) && /<Rail [^>]*level=\{2\} \/>\s*<CityRowsHead>\{COPY\.home\.citiesHead\}<\/CityRowsHead>\s*<CityRows\b/.test(homeCities), { file: VIEW, remedy: "in HomeCities: <Box id=\"cities\" className=\"relative flex flex-col\">, the Rail at level 2, <CityRowsHead>{COPY.home.citiesHead}</CityRowsHead>, then <CityRows ...>" });
  check("HomeCities tells CityRows it draws the head: <CityRows ... headed>, so the basis line goes from 768 there and only there", /<CityRows\b[^>]*\bheaded\b/.test(homeCities), { file: VIEW, remedy: "pass `headed` to CityRows in HomeCities: it draws CityRowsHead over the figures from 768, which is what lets the rows drop their basis line there" });
  check(`"${headWords ?? "none"}" is typed in no component: it lives in src/lib/spine/copy.ts beside "${COPY.home.citiesAll}"`, typeof headWords === "string" && headWords.length > 0 && [FILE, VIEW].every((f) => !stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n").includes(headWords)), { file: "src/lib/spine/copy.ts", remedy: "put the head's words in COPY.home.citiesHead, beside citiesAll and citiesUnit, and read them in HomeCities" });
  const doorsAt = end < 0 ? "" : home.slice(end, end + 600);
  check("the home's render draws the cities and the doors on one pitch: the cities' grid and the doors' list both md:auto-rows-[56px], the doors' list 16px under its heading", /md:auto-rows-\[56px\]/.test(foot) && /<ul class="mt-4 grid flex-1 grid-cols-1 md:auto-rows-\[56px\]">/.test(doorsAt), { file: VIEW, remedy: "<WhereNext key=\"next\" pitch ... /> on the home, then render the home (bash scratchpad/reform/render_some.sh \"home gb\")" });
  check(`the home's render prints "Checked" with ${REGISTER_BUILT ?? "the slices' date"} at its foot`, !!REGISTER_BUILT && new RegExp(`data-checked="1"[^>]*>[^<]*<time datetime="${REGISTER_BUILT}"`, "i").test(home), { file: VIEW, remedy: "pass ReportFoot the checked date, then render the home" });
  check("the home's render says \"From the blog\" and never the notebook", home.includes(">From the blog<") && !/From the notebook/.test(home), { file: "src/lib/home/next_doors.ts" });
} else console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the home's render checks did not run");
if (gbPage) check("/gb's render holds the cities' anchor that All UK cities opens (id=\"cities\")", /id="cities"/.test(gbPage), { file: "src/components/spine/country/country-view.tsx", remedy: "keep the country page's cities card at id=\"cities\", the home's All UK cities door" });
else console.log("DEFER  scratchpad/harness/pages/country-GB.html is not rendered here; the anchor check did not run");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/foot: all pass");
