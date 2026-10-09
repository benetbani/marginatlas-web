/**
 * scripts/gen_place_slugs.ts
 *
 * Writes src/lib/routing/place_slugs_generated.ts: every place word the site's tables hold, per country, and the United States'
 * census descriptions (P1-A of the page architecture, 2026-10-09; docs/superpowers/specs/2026-10-09-page-architecture-design.md
 * in the design repo). The edge answers 404 for /{country}/{place}/{trade} when no table holds the place
 * (src/lib/routing/place_words.ts) and for a United States word that is no trade and no description
 * (src/lib/routing/edge_not_found.ts); the index policy reads the descriptions (src/lib/seo/indexable.ts).
 *
 * TWO SOURCES.
 *  - The site's own tables, read here on every run: the country's own code (/gb/gb), its regions (getRegionsForCountry: admin1,
 *    the US states), its listed cities (city_paths_generated.ts) and the label each one's links spell (cellUrl slugifies the
 *    display label: /de/frankfurt-am-main), the friendly, manual and district aliases the cell route reads
 *    (regionalSlugToGeoId) with their labels, the cities by state the search offers, the generated region table (also for the
 *    country codes the statistics carry that COUNTRIES does not hold: statisticsCodes()), the popular-name keys and the places
 *    the trade routes prerender (generateStaticParams). An address built from a word one of
 *    these holds may be real (the spec's own definition), so none of them is the edge's to 404 before the inventory.
 *  - The database, read only with --database: every geo id regional_cells holds per country and per statistics code (the counties,
 *    city overlays and the NUTS and province codes), and every industry description cells_master holds for the United States, slugified as the US
 *    shard of the sitemap built its addresses. Written to data/seo/place_db_words.json, so the table can be written again offline
 *    and the edge gate can hold it to a fresh generation, as it holds served_files.ts and hood_slugs.ts.
 *
 * usage, from E:/atlas/website:
 *   node node_modules/tsx/dist/cli.mjs --require ./scripts/harness/env.cjs scripts/gen_place_slugs.ts --database
 *       scans the database (by hand, never in the chain), then writes the table
 *   node node_modules/tsx/dist/cli.mjs scripts/gen_place_slugs.ts
 *       writes the table from the committed scan, offline
 * A scan that fails stops with nothing written: a table missing rows would answer 404 for real addresses.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { COUNTRIES } from "../src/lib/taxonomy";
import { getRegionsForCountry } from "../src/lib/regions/regions-by-country";
import { REGIONS_BY_COUNTRY_AUTO } from "../src/lib/regions/regions_generated";
import { CITY_SLUGS_BY_COUNTRY } from "../src/lib/routing/city_paths_generated";
import { CITY_FRIENDLY_TO_GEO_ID, CITY_FRIENDLY_DISPLAY_LABEL, CITIES_BY_STATE } from "../src/lib/cities/city_aliases_generated";
import { MANUAL_CITY_ALIASES } from "../src/lib/cities/manual_city_aliases";
import { NEIGHBORHOOD_ALIASES } from "../src/lib/cities";
import { SLUG_TO_GEO_ID, geoNameFromSlug, slugify } from "../src/lib/cells/geo";
import popularJson from "../src/lib/geo/popular_place_overrides.json";
import { own } from "../src/lib/own";

export const PLACE_SLUGS_FILE = "src/lib/routing/place_slugs_generated.ts";
export const PLACE_DB_FILE = "data/seo/place_db_words.json";
/** What the edge may carry of this table on every request: the middleware bundles it, and Vercel caps the middleware's gzipped
 *  size (scripts/verify_edge_function_sizes.ts holds it at 1 MB; this text compresses about five to one). A table over it is
 *  made smaller at its source, never given a larger budget. */
export const PLACE_TABLE_BUDGET_BYTES = 600_000;

/** The routes whose generateStaticParams prerender trade pages at every build: their places are addresses the build publishes. */
export const PRERENDERING_ROUTES = [
  "src/app/[country]/[geo]/[industry]/page.tsx",
  "src/app/[country]/[geo]/[industry]/opening/page.tsx",
  "src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx",
];

export type DbWords = {
  why: string;
  scanned_at: string;
  regional_rows: number;
  us_rows: number;
  /** Every geo id regional_cells holds, lowercase, per lowercase country code. */
  places: Record<string, string[]>;
  /** Every United States industry description cells_master holds, slugified as the sitemap built its addresses. */
  us_descriptions: string[];
};

const WHY =
  "The place words the database holds, for P1-A of the page architecture (2026-10-09): every geo id regional_cells holds per country, and every United States industry description cells_master holds, slugified. Written by scripts/gen_place_slugs.ts with --database; never edited by hand.";

const word = (s: unknown): string => String(s ?? "").trim().toLowerCase();

/** The country codes the statistics carry that COUNTRIES does not hold. regions_generated.ts is keyed by the codes the statistics
 *  use (EL for Greece, which COUNTRIES holds as GR; also UK, ER, KP, SS and VA), and the sitemap and the floor census publish trade
 *  pages under them (/el/el3/plastics-rubber-products; src/app/[country]/[geo]/[industry]/page.tsx says Greek cells are stored
 *  under EL). Their regions are places the site holds although no country page is: the table keeps them, and the edge judges only
 *  the countries it holds (src/lib/routing/place_words.ts). */
export function statisticsCodes(): string[] {
  const held = new Set(COUNTRIES.map((c) => c.code.toLowerCase()));
  return Object.keys(REGIONS_BY_COUNTRY_AUTO).map((k) => k.toLowerCase()).filter((cc) => !held.has(cc)).sort();
}

export function readDbWords(): DbWords {
  return JSON.parse(readFileSync(PLACE_DB_FILE, "utf8")) as DbWords;
}

/** The (country, place) pairs the trade routes prerender, read from their literal lists. */
export function prerenderedPlaces(): Array<[string, string]> {
  return PRERENDERING_ROUTES.flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(/\{\s*country:\s*"([a-z]{2})",\s*geo:\s*"([a-z0-9-]+)",\s*industry:\s*"[a-z0-9-]+"\s*\}/g)].map(
      (m) => [m[1], m[2]] as [string, string],
    ),
  );
}

/** Every place word the site's own tables hold, per lowercase country code; no database. */
export function staticPlaceWords(): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  const add = (cc: string, w: unknown) => {
    const v = word(w);
    if (!v) return;
    let set = out.get(cc);
    if (!set) {
      set = new Set();
      out.set(cc, set);
    }
    set.add(v);
  };
  for (const c of COUNTRIES) {
    const cc = c.code.toLowerCase();
    const CC = c.code.toUpperCase();
    add(cc, cc);
    for (const r of getRegionsForCountry(CC, c.name)) add(cc, r.value);
    for (const s of own(CITY_SLUGS_BY_COUNTRY, cc) ?? []) {
      add(cc, s);
      add(cc, slugify(geoNameFromSlug(CC, s)));
    }
    for (const [s, g] of Object.entries(own(CITY_FRIENDLY_TO_GEO_ID, CC) ?? {})) {
      add(cc, s);
      add(cc, g);
    }
    for (const label of Object.values(own(CITY_FRIENDLY_DISPLAY_LABEL, CC) ?? {})) add(cc, slugify(label));
    for (const m of own(MANUAL_CITY_ALIASES, CC) ?? []) {
      add(cc, m.slug);
      add(cc, m.geo_id);
      add(cc, slugify(m.label));
    }
    for (const [s, g] of Object.entries(own(NEIGHBORHOOD_ALIASES, CC) ?? {})) {
      add(cc, s);
      add(cc, g);
    }
    for (const [state, cities] of Object.entries(own(CITIES_BY_STATE, CC) ?? {})) {
      add(cc, state);
      for (const s of cities) add(cc, s);
    }
    for (const r of own(REGIONS_BY_COUNTRY_AUTO, CC) ?? []) add(cc, r.value);
  }
  for (const cc of statisticsCodes()) for (const r of own(REGIONS_BY_COUNTRY_AUTO, cc.toUpperCase()) ?? []) add(cc, r.value);
  for (const [key, name] of Object.entries((popularJson as { overrides: Record<string, string> }).overrides)) {
    const [cc, slug] = key.split("/");
    if (!out.has(cc)) continue;
    add(cc, slug);
    add(cc, slugify(name));
  }
  for (const [cc, place] of prerenderedPlaces()) if (out.has(cc)) add(cc, place);
  return out;
}

/** The table's whole text: the site's words and the database's scan, sorted, one line per country. */
export function renderPlaceSlugs(db: DbWords = readDbWords()): string {
  const words = staticPlaceWords();
  for (const [cc, ids] of Object.entries(db.places)) {
    const set = words.get(cc);
    if (!set) continue; // a country the site does not hold: the edge never asks for it
    for (const id of ids) {
      const v = word(id);
      if (v) set.add(v);
    }
  }
  const rows = [...words.keys()].sort().map((cc) => `  ${JSON.stringify(cc)}: ${JSON.stringify([...(words.get(cc) ?? [])].sort())},`);
  const descriptions = [...new Set(db.us_descriptions.map(word).filter(Boolean))].sort();
  return [
    "/**",
    " * GENERATED by scripts/gen_place_slugs.ts from the site's place tables and data/seo/place_db_words.json (the database's scan);",
    " * do not edit by hand. The edge middleware reads it (src/lib/routing/place_words.ts, src/lib/routing/edge_not_found.ts) and so",
    " * does the index policy (src/lib/seo/indexable.ts); tests/routing/edge_not_found.test.ts reds when this file and a fresh",
    " * generation differ.",
    " */",
    "",
    "/** Every place word a table holds, per country (its lowercase code): the middle part of /{country}/{place}/{trade}. */",
    "export const PLACE_SLUGS_BY_COUNTRY: Readonly<Record<string, readonly string[]>> = {",
    ...rows,
    "};",
    "",
    "/** Every United States industry description the database holds, slugified as the sitemap built its addresses. */",
    `export const US_DESCRIPTION_SLUGS: ReadonlySet<string> = new Set(${JSON.stringify(descriptions)});`,
    "",
  ].join("\n");
}

/** Reads the database: every geo id regional_cells holds, and every United States description. Throws on the first error. */
export async function scanDatabase(): Promise<DbWords> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("the service key is not set: run with --require ./scripts/harness/env.cjs, which reads .env.local");
  }
  const { supabaseAdmin } = await import("../src/lib/supabase");
  const PAGE = 1000;
  const places: Record<string, Set<string>> = {};
  let regionalRows = 0;
  let pages = 0;
  for (const CC of [...COUNTRIES.map((c) => c.code.toUpperCase()), ...statisticsCodes().map((cc) => cc.toUpperCase())]) {
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabaseAdmin
        .from("regional_cells")
        .select("geo_id")
        .eq("country", CC)
        .order("geo_id", { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) throw new Error(`regional_cells for ${CC} from row ${from}: ${error.message}`);
      const rows = (data ?? []) as Array<{ geo_id: string | null }>;
      regionalRows += rows.length;
      for (const r of rows) {
        const v = word(r.geo_id);
        if (v) (places[CC.toLowerCase()] ??= new Set()).add(v);
      }
      if (++pages % 50 === 0) console.log(`gen_place_slugs: ${pages} pages read (${regionalRows} regional rows; at ${CC})`);
      if (rows.length < PAGE) break;
    }
  }
  const descriptions = new Set<string>();
  let usRows = 0;
  for (const geoId of Object.values(SLUG_TO_GEO_ID).sort()) {
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabaseAdmin
        .from("cells_master")
        .select("industry_description")
        .eq("country", "US")
        .eq("geo_id", geoId)
        .order("n", { ascending: false, nullsFirst: false })
        .order("naics_6", { ascending: true })
        .order("year", { ascending: true })
        .order("size_band", { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) throw new Error(`cells_master for ${geoId} from row ${from}: ${error.message}`);
      const rows = (data ?? []) as Array<{ industry_description: string | null }>;
      usRows += rows.length;
      for (const r of rows) {
        const s = slugify(r.industry_description);
        if (s) descriptions.add(s);
      }
      if (++pages % 50 === 0) console.log(`gen_place_slugs: ${pages} pages read (${usRows} United States rows; at ${geoId})`);
      if (rows.length < PAGE) break;
    }
  }
  return {
    why: WHY,
    scanned_at: new Date().toISOString(),
    regional_rows: regionalRows,
    us_rows: usRows,
    places: Object.fromEntries(Object.keys(places).sort().map((cc) => [cc, [...places[cc]].sort()])),
    us_descriptions: [...descriptions].sort(),
  };
}

async function main(): Promise<void> {
  if (process.argv.includes("--database")) {
    const db = await scanDatabase();
    writeFileSync(PLACE_DB_FILE, `${JSON.stringify(db, null, 1)}\n`);
    const ids = Object.values(db.places).reduce((n, list) => n + list.length, 0);
    console.log(
      `gen_place_slugs: ${db.regional_rows} regional rows and ${db.us_rows} United States rows scanned; ${ids} place ids in ${Object.keys(db.places).length} countries and ${db.us_descriptions.length} descriptions written to ${PLACE_DB_FILE}`,
    );
  }
  const text = renderPlaceSlugs();
  writeFileSync(PLACE_SLUGS_FILE, text);
  const countries = (text.match(/^ {2}"[a-z]{2}": /gm) ?? []).length;
  console.log(`gen_place_slugs: ${countries} countries written to ${PLACE_SLUGS_FILE} (${text.length} bytes; the edge's budget is ${PLACE_TABLE_BUDGET_BYTES})`);
}

if (require.main === module) {
  main().catch((e: unknown) => {
    console.error(`gen_place_slugs: ${e instanceof Error ? e.message : String(e)}`);
    process.exit(1);
  });
}
