/**
 * src/lib/seo/depth_source.ts
 *
 * THE "NOTIFY ME" TAG FOR A THIN PAGE (milestone 1, M9; his interview of 2026-09-26: "the 'notify me when my place reaches this
 * depth' capture on thinner pages"). A thin page is a spine page outside the United Kingdom the floor census counted under its
 * floor, and the robots tag keeps it out of the index (indexable.ts); the converse does not hold. Since Phase 1 (P1-B) the
 * industries hubs, the /decide pairs, the UK trade pages off London and the United States pages named by a census description
 * are noindex whatever the census counted, so a United States page at its floor is out of the index and is not thin. A thin
 * page's form posts the address with the source `depth:<the page's path>`, so the list knows which place each reader is
 * waiting for.
 *
 * The newsletter endpoint takes its source from an unauthenticated POST and keeps an allowlist for that reason (an unbounded
 * string from a public form is a column that ends up holding anything); a depth tag passes only when its path is one the census
 * counted under its floor, a bounded set the file holds, so the column stays bounded too.
 */
import { floorStanding, isUkPage } from "@/lib/seo/indexable";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COUNTRIES } from "@/lib/taxonomy";

const CITY_NAMES = new Map((cityListJson as { cities: Array<{ slug: string; name: string }> }).cities.map((c) => [c.slug, c.name]));
const COUNTRY_NAMES = new Map((COUNTRIES as Array<{ code: string; name: string }>).map((c) => [c.code.toLowerCase(), c.name]));
const titled = (slug: string) => slug.split("-").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");

/** The place a spine page is about, for the capture's words: the country of `/xx` and its how-to page, the city of `/cities/x`,
 *  the place of a trade page (its city's name, else its region's slug in words). */
export function placeOfPath(path: string): string | null {
  const parts = String(path).toLowerCase().split("/").filter(Boolean);
  if (parts[0] === "cities" && parts[1]) return CITY_NAMES.get(parts[1]) ?? null;
  const country = COUNTRY_NAMES.get(parts[0] ?? "");
  if (!country) return null;
  if (parts.length === 1 || (parts.length === 2 && parts[1] === "how-to-open")) return country;
  if (parts.length === 3) return CITY_NAMES.get(parts[1]) ?? titled(parts[1]);
  return null;
}

const PREFIX = "depth:";

/** True for a page that draws the capture: counted by the census, under its floor, outside the UK. */
export function isThinPage(path: string): boolean {
  if (isUkPage(path)) return false;
  const s = floorStanding(path);
  return !!s && !s.atFloor;
}

/** The source tag a thin page's form sends, or null where the page is not thin. */
export function depthSourceFor(path: string): string | null {
  return isThinPage(path) ? `${PREFIX}${String(path).toLowerCase().replace(/\/+$/, "")}` : null;
}

/** True when a posted source is a depth tag for a thin page (the endpoint's check). */
export function isDepthSource(source: string): boolean {
  return source.startsWith(PREFIX) && isThinPage(source.slice(PREFIX.length)) && depthSourceFor(source.slice(PREFIX.length)) === source;
}
