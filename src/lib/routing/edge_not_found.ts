/**
 * src/lib/routing/edge_not_found.ts
 *
 * AN ADDRESS FOR NOTHING ANSWERS 404 AT THE EDGE (masterplan step 01, 2026-10-05; QUEUE launch:retired-trades-live, whose
 * recommendation milestone 1 left half built; P1-A of the page architecture, 2026-10-09, which added the place, the United
 * States' words, the trade pages' sub-pages and the /decide pairs). `/gb/london/<any word>` rendered a synthesized "Small
 * business" page at 200, canonical to itself and indexable like every UK page: the cell lookup never returns nothing
 * (getCellBySlug synthesizes), so the route's own notFound() could not fire. `/industries/<word>` and `/cities/<word>` did call
 * notFound(), inside a streamed page, after the 200 was on the wire (the middleware's note on isPlaceWeDoNotHold says why). The
 * middleware is the one place that runs first, so it judges here, and pins the status the same way the place rule does.
 *
 * THE RULE: each shape is judged by the resolver its own route runs, never by a guess.
 *  - `/{country}/{place}/{word}`, a country the site holds: the place names nothing when no table of the site holds the word
 *    (src/lib/routing/place_words.ts: the country's own code, its regions, its listed cities and the label addresses their links
 *    spell, every city, district and state alias the cell route reads, the places the trade routes prerender, and the ids the
 *    database holds). The word names nothing when the cell route's own resolver (`resolveDisplayIndustry`: the taxonomy's exact
 *    slug, id, alias, phrase and tight fuzzy match, plus the legacy data crosswalk) finds no live trade, no redirect owns it
 *    (retired, renamed), it is not one of the place's static children (`/gb/london/industries`, a page of its own) or an old
 *    neighbourhood address (`legacyHoodTarget`, below), and, under a state of the United States, it is no census description the
 *    database holds (that lookup's last step reads them: getCellBySlugRaw in src/lib/cells.ts).
 *  - `/{country}/{place}/{word}/opening` and `/{country}/{place}/{word}/buy-or-start` (TRADE_SUB_PAGES): the same place and trade
 *    word, but not the two exemptions that belong to the three-part address alone. Their route draws a trade, and a static child
 *    (`/gb/london/industries/opening`) or an old neighbourhood address is none.
 *  - `/{country}/{place}/{district}/{trade}`, a district's trade page: its place alone; the rest is its route's.
 *  - `/industries/{word}` and `/industries/{word}/across`: the industry routes' resolver (`slugToIndustry`) finds nothing.
 *  - `/cities/{slug}`: the city list holds no such city (the generated slug table `cityPathFor` reads).
 *  - `/cities/{slug}/neighborhoods[/{district}]`: no hub (`hasHoodScheme`), or no admitted district (`spineHoodDistrict`,
 *    while the neighbourhood spine is on), read from the generated table src/lib/routing/hood_slugs.ts.
 *  - `/decide/{activity}/{city}`: the pair route's own resolvers: no trade for the activity (`slugToIndustry`), or no
 *    neighbourhood scheme for the city (`hasHoodScheme`, the keys of src/lib/routing/hood_slugs.ts).
 *  - Any address whose last part has a dot names a file (2026-10-06), at any depth: it names nothing unless the site serves that
 *    file, a file under public/ or one a route of src/app writes (`/robots.txt`, `/sitemap/0.xml`), read from the generated table
 *    src/lib/routing/served_files.ts; the platform's own addresses under `/_vercel/` are Vercel's. No page takes a dotted part
 *    (no country, region, city, trade, district, post or article slug holds a dot; the test reds when one does), so a dotted
 *    address that is no file could only ever have drawn a page's not-found, or worse, a synthesized page at 200.
 * Everything else is left alone: one- and two-part paths are isPlaceWeDoNotHold's.
 *
 * EACH PART IS THE ROUTE'S WORD (the review of 2026-10-09). The pathname is percent-encoded and the route's params are not, so every
 * part is percent-decoded and lowercased before any table is asked (routeWord, src/lib/routing/place_words.ts): the place table
 * spells six places with an accent, decoded (`/br/s%c3%a3o-paulo/restaurants` is the address of one). A malformed escape keeps the
 * part as written and names nothing. The file rule reads the last part as written, so an encoded dot (`x%2ey`) is no file.
 *
 * WHAT IT CANNOT SEE, said once. The place table is the database's as of its last scan (data/seo/place_db_words.json): a county
 * or a description loaded since answers 404 until scripts/gen_place_slugs.ts runs with the database again. A census description
 * is judged for the whole country: a word one state holds passes under every state, and a state without that row draws the
 * estimated page. A dotted United States word IS judged, as a file: that lookup's last step (`ilike` on the word, hyphens as
 * wildcards) could match a description with a dot in it, but no published address holds a dot, so such a match could only be a
 * second address for a page the site already publishes. Pure, and small enough for the edge: the taxonomy module the middleware
 * already imports, two small crosswalks and five generated tables; never src/lib/spine/hood_scheme.ts, which pulls the
 * neighbourhood data in.
 *
 * Next strips an RSC request's `.rsc` ending before the middleware sees the path (normalizeRscURL in
 * next/dist/server/web/adapter.js), so a page's payload is judged as its page. The `.segments/` prefetch addresses of Next's client
 * segment cache would not be: that cache is experimental in Next 15 and off here (next.config.js turns nothing experimental on).
 */
import { COUNTRIES, slugToIndustry } from "@/lib/taxonomy";
import { resolveDisplayIndustry } from "@/lib/cells/industry_resolution";
import { redirectFor } from "@/lib/taxonomy/retired";
import { TAXONOMY_REDIRECTS } from "@/lib/taxonomy/legacy_redirects";
import { TOP_LEVEL_SEGMENTS } from "@/lib/routing/top_level_segments";
import { CITY_SLUGS_BY_COUNTRY } from "@/lib/routing/city_paths_generated";
import { HOOD_DISTRICT_SLUGS, NEIGHBORHOOD_SLUGS } from "@/lib/routing/hood_slugs";
import { SERVED_FILES } from "@/lib/routing/served_files";
import { US_DESCRIPTION_SLUGS } from "@/lib/routing/place_slugs_generated";
import { isHeldPlace, routeWord } from "@/lib/routing/place_words";
import { namesFile } from "@/lib/routing/names_file";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { cityPathFor } from "@/lib/cities/city_path";
import { own } from "@/lib/own";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";

/** The static folders of src/app/[country]/[geo], each a real page at `/{country}/{place}/{name}`; the step's test reads
 *  the filesystem and reds when this set and the folders disagree. */
export const GEO_STATIC_CHILDREN: ReadonlySet<string> = new Set(["industries"]);

/** The static folders of src/app/[country]/[geo]/[industry], each a page under its trade page that names nothing when its trade
 *  page names nothing (P1-A); the edge test reds when this set and the folders disagree. The index policy and the alias
 *  canonicals read it too. */
export const TRADE_SUB_PAGES: ReadonlySet<string> = new Set(["opening", "buy-or-start"]);

const HELD_COUNTRIES = new Set(COUNTRIES.map((c) => c.code.toLowerCase()));
const LISTED_CITIES = new Set(Object.values(CITY_SLUGS_BY_COUNTRY).flat());
/** The United States' states: the only places whose lookup reads a census description (getCellBySlugRaw, src/lib/cells.ts). Read
 *  from the regions table the middleware already bundles, never from SLUG_TO_GEO_ID (src/lib/cells/geo.ts), whose module pulls the
 *  city alias tables into the edge; the edge test holds the two equal (51 of 51 on 2026-10-09). */
export const US_STATES: ReadonlySet<string> = new Set(getRegionsForCountry("US", "United States").map((r) => r.value));

/** A redirect earlier in the middleware owns the word: a retired trade, or one renamed to another slug. Every table here is read
 *  for its own entries (src/lib/own.ts), so a word that names a built-in ("constructor", "__proto__") names nothing. */
function ownedByRedirect(word: string): boolean {
  const renamed = own(TAXONOMY_REDIRECTS, word);
  return redirectFor(word) !== null || (renamed !== undefined && renamed !== word);
}

function parts(path: string): string[] | null {
  const written = String(path ?? "").split("/").filter(Boolean);
  /* A file is not a page (the world map's TopoJSON lesson, src/middleware.ts isPlaceWeDoNotHold). Judged on the last part as written,
     like namesFile: an encoded dot (`x%2ey`) is no file's ending, and as a word it names nothing. */
  if (written.length === 0 || written[written.length - 1].includes(".")) return null;
  /* Each part as its route reads it (routeWord): the pathname the middleware sees is percent-encoded, the route's params are not,
     and the place table spells the six accented places decoded (the review of 2026-10-09). */
  return written.map(routeWord);
}

/**
 * Where a three-part neighbourhood address of before 2026-08-16 now lives, or null. Seven call sites linked
 * `/{country}/{city}/{district}` (commit b1496df2 moved them to the hub), and before the cell spine went live on 2026-09-07
 * the cell route rendered those as district overviews; since then they rendered a synthesized trade page. A URL carries
 * what equity it earned and never dies without a redirect, so each goes, in one hop, to the district's own page where the
 * district is admitted, else to its city's hub. A trade of the same word keeps its page; another country's path reaches
 * no district.
 */
export function legacyHoodTarget(path: string): string | null {
  const segs = parts(path);
  if (!segs || segs.length !== 3) return null;
  const [country, city, word] = segs;
  if (!HELD_COUNTRIES.has(country) || TOP_LEVEL_SEGMENTS.has(country)) return null;
  if (resolveDisplayIndustry(word) || ownedByRedirect(word)) return null;
  if (!cityPathFor(country, city) || !(own(NEIGHBORHOOD_SLUGS, city) ?? []).includes(word)) return null;
  if (isSpineReformEnabledFor("hood") && (own(HOOD_DISTRICT_SLUGS, city) ?? []).includes(word)) return `/cities/${city}/neighborhoods/${word}`;
  return `/cities/${city}/neighborhoods`;
}

/** A FILE ONLY IF IT IS ONE (2026-10-06): the address names a file and the site serves no such file. The address exactly as the
 *  middleware has it, canonical by then: Vercel's files are case-sensitive, so `/cities/README.txt` is listed and its lowercase
 *  address, the only one a request reaches, is not. The middleware also asks this alone under the prefixes its rate limit skips. */
export function fileNotServed(path: string): boolean {
  return namesFile(path) && !SERVED_FILES.has(path) && !path.startsWith("/_vercel/");
}

/** The trade slot of a place's address names nothing (P1-A): no live trade, no redirect, and, under a state of the United States,
 *  no census description the database holds. A static child of the place (`industries`) is no trade: it is exempt for its own
 *  three-part address only, in edgeNotFound, so its /opening and /buy-or-start (which the route draws for a trade) name nothing. */
function tradeWordNamesNothing(country: string, place: string, word: string): boolean {
  if (ownedByRedirect(word) || resolveDisplayIndustry(word)) return false;
  return !(country === "us" && US_STATES.has(place) && US_DESCRIPTION_SLUGS.has(word));
}

/** True only for an address its own route would render as nothing (the rule above); the middleware pins it to 404. */
export function edgeNotFound(path: string): boolean {
  if (namesFile(path)) return fileNotServed(path);
  const segs = parts(path);
  if (!segs) return false;
  const [first, second, third, fourth] = segs;

  if (first === "industries" && (segs.length === 2 || (segs.length === 3 && third === "across"))) {
    return slugToIndustry(second) === null && !ownedByRedirect(second);
  }

  if (first === "cities" && segs.length >= 2 && segs.length <= 4) {
    if (segs.length === 2) return !LISTED_CITIES.has(second);
    if (third !== "neighborhoods") return false;
    if (segs.length === 3) return own(NEIGHBORHOOD_SLUGS, second) === undefined;
    return !(isSpineReformEnabledFor("hood") && (own(HOOD_DISTRICT_SLUGS, second) ?? []).includes(fourth));
  }

  if (first === "decide" && segs.length === 3) {
    return slugToIndustry(second) === null || own(NEIGHBORHOOD_SLUGS, third) === undefined;
  }

  if ((segs.length === 3 || segs.length === 4) && HELD_COUNTRIES.has(first) && !TOP_LEVEL_SEGMENTS.has(first)) {
    if (!isHeldPlace(first, second)) return true;
    if (segs.length === 3) return legacyHoodTarget(path) === null && !GEO_STATIC_CHILDREN.has(third) && tradeWordNamesNothing(first, second, third);
    return TRADE_SUB_PAGES.has(fourth) && tradeWordNamesNothing(first, second, third);
  }

  return false;
}
