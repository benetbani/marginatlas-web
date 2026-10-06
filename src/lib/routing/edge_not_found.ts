/**
 * src/lib/routing/edge_not_found.ts
 *
 * AN ADDRESS FOR NOTHING ANSWERS 404 AT THE EDGE (masterplan step 01, 2026-10-05; QUEUE launch:retired-trades-live, whose
 * recommendation milestone 1 left half built). `/gb/london/<any word>` rendered a synthesized "Small business" page at 200,
 * canonical to itself and indexable like every UK page: the cell lookup never returns nothing (getCellBySlug synthesizes),
 * so the route's own notFound() could not fire. `/industries/<word>` and `/cities/<word>` did call notFound(), inside a
 * streamed page, after the 200 was on the wire (the middleware's note on isPlaceWeDoNotHold says why). The middleware is
 * the one place that runs first, so it judges here, and pins the status the same way the place rule does.
 *
 * THE RULE: each shape is judged by the resolver its own route runs, never by a guess.
 *  - `/{country}/{place}/{word}`, a country the site holds other than the United States (below): the word names nothing
 *    when the cell route's own resolver
 *    (`resolveDisplayIndustry`: the taxonomy's exact slug, id, alias, phrase and tight fuzzy match, plus the legacy data
 *    crosswalk) finds no live trade, and no redirect owns it (retired, renamed), and it is not one of the place's static
 *    children (`/gb/london/industries`) or an old neighbourhood address (`legacyHoodTarget`, below).
 *  - `/industries/{word}` and `/industries/{word}/across`: the industry routes' resolver (`slugToIndustry`) finds nothing.
 *  - `/cities/{slug}`: the city list holds no such city (the generated slug table `cityPathFor` reads).
 *  - `/cities/{slug}/neighborhoods[/{district}]`: no hub (`hasHoodScheme`), or no admitted district (`spineHoodDistrict`,
 *    while the neighbourhood spine is on), read from the generated table src/lib/routing/hood_slugs.ts.
 *  - Any address whose last part has a dot names a file (2026-10-06), at any depth: it names nothing unless the site serves that
 *    file, a file under public/ or one a route of src/app writes (`/robots.txt`, `/sitemap/0.xml`), read from the generated table
 *    src/lib/routing/served_files.ts; the platform's own addresses under `/_vercel/` are Vercel's. No page takes a dotted part
 *    (no country, region, city, trade, district, post or article slug holds a dot; the test reds when one does), so a dotted
 *    address that is no file could only ever have drawn a page's not-found, or worse, a synthesized page at 200.
 * Everything else is left alone: one- and two-part paths are isPlaceWeDoNotHold's, four-part trade paths are their routes'.
 *
 * WHAT IT CANNOT SEE, said once. A place segment is not judged (`/us/us-06-037/restaurants` is a county the database
 * holds and no table here lists), so `/gb/atlantis/restaurants` still renders. And a United States word is never judged:
 * the US state lookup's last step matches the word against the census descriptions by the database's own text
 * (getCellBySlugRaw in src/lib/cells.ts), and the US shard declares 469 such pages
 * (`/us/mississippi/business-support-services`, floor census of 2026-10-05), so a word the taxonomy does not hold may
 * still name a real row there. No other country's lookup reads a word the taxonomy cannot. A dotted United States word IS judged,
 * as a file: that lookup's last step (`ilike` on the word, hyphens as wildcards) could match a description with a dot in it, but
 * no published address holds a dot, so such a match could only be a second address for a page the site already publishes. Pure,
 * and small enough for the edge: the taxonomy module the middleware already imports, two small crosswalks and three generated
 * tables; never src/lib/spine/hood_scheme.ts, which pulls the neighbourhood data in.
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
import { cityPathFor } from "@/lib/cities/city_path";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";

/** The static folders of src/app/[country]/[geo], each a real page at `/{country}/{place}/{name}`; the step's test reads
 *  the filesystem and reds when this set and the folders disagree. */
export const GEO_STATIC_CHILDREN: ReadonlySet<string> = new Set(["industries"]);

const HELD_COUNTRIES = new Set(COUNTRIES.map((c) => c.code.toLowerCase()));
/** Countries whose cell lookup can match a word the taxonomy does not hold, by the database's own text (the note above). */
const DATABASE_WORDS = new Set(["us"]);
const LISTED_CITIES = new Set(Object.values(CITY_SLUGS_BY_COUNTRY).flat());

/** A redirect earlier in the middleware owns the word: a retired trade, or one renamed to another slug. */
function ownedByRedirect(word: string): boolean {
  return redirectFor(word) !== null || (TAXONOMY_REDIRECTS[word] !== undefined && TAXONOMY_REDIRECTS[word] !== word);
}

function parts(path: string): string[] | null {
  const segs = String(path ?? "").split("/").filter(Boolean).map((s) => s.toLowerCase());
  /* A file is not a page (the world map's TopoJSON lesson, src/middleware.ts isPlaceWeDoNotHold). */
  if (segs.length === 0 || segs[segs.length - 1].includes(".")) return null;
  return segs;
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
  if (!cityPathFor(country, city) || !(NEIGHBORHOOD_SLUGS[city] ?? []).includes(word)) return null;
  if (isSpineReformEnabledFor("hood") && (HOOD_DISTRICT_SLUGS[city] ?? []).includes(word)) return `/cities/${city}/neighborhoods/${word}`;
  return `/cities/${city}/neighborhoods`;
}

/** The last part of the address has a dot in it: the address names a file, not a page. */
function namesFile(path: string): boolean {
  return (String(path ?? "").split("/").filter(Boolean).pop() ?? "").includes(".");
}

/** True only for an address its own route would render as nothing (the rule above); the middleware pins it to 404. */
export function edgeNotFound(path: string): boolean {
  /* A FILE ONLY IF IT IS ONE (2026-10-06). The address exactly as the middleware has it, canonical by then: Vercel's files are
     case-sensitive, so `/cities/README.txt` is listed and its lowercase address, the only one a request reaches, is not. */
  if (namesFile(path)) return !SERVED_FILES.has(path) && !path.startsWith("/_vercel/");
  const segs = parts(path);
  if (!segs) return false;
  const [first, second, third, fourth] = segs;

  if (first === "industries" && (segs.length === 2 || (segs.length === 3 && third === "across"))) {
    return slugToIndustry(second) === null && !ownedByRedirect(second);
  }

  if (first === "cities" && segs.length >= 2 && segs.length <= 4) {
    if (segs.length === 2) return !LISTED_CITIES.has(second);
    if (third !== "neighborhoods") return false;
    if (segs.length === 3) return NEIGHBORHOOD_SLUGS[second] === undefined;
    return !(isSpineReformEnabledFor("hood") && (HOOD_DISTRICT_SLUGS[second] ?? []).includes(fourth));
  }

  if (segs.length === 3 && HELD_COUNTRIES.has(first) && !TOP_LEVEL_SEGMENTS.has(first) && !DATABASE_WORDS.has(first)) {
    if (GEO_STATIC_CHILDREN.has(third) || ownedByRedirect(third)) return false;
    if (resolveDisplayIndustry(third)) return false;
    return legacyHoodTarget(path) === null;
  }

  return false;
}
