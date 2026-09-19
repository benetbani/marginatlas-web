/**
 * src/lib/geo/page_targets.ts , which place pages actually exist.
 *
 * WHY THIS IS ITS OWN MODULE. The equivalent resolvers live in
 * `related_links.ts`, which imports a Supabase client because it also fetches
 * rows. That is right for that module and wrong for everyone else: importing it
 * into the country adapter dragged a database client into a pure transformer,
 * and the adapter threw at module load trying to construct one.
 *
 * These two need nothing but two static tables, so they live where any surface
 * can ask "does this page exist" without paying for a database connection to
 * find out. That is the only way they get used everywhere they should be.
 *
 * They exist at all because of seven live link defects found in one night, every
 * one a URL assembled from parts and hoped over. The worst did not even 404:
 * "All of New York" opened New York STATE, because `new-york` is a city in one
 * list and a state in another.
 *
 * EVERY TARGET CARRIES WHAT ITS PAGE ANSWERS (plan step 39, 2026-09-19):
 * `answers`, a kind from src/lib/spine/door_kinds.ts, declared once per
 * surface there and handed to the door's builder here, so a door that names a
 * page promises exactly what that page's masthead leads with, and the chain's
 * `doors` gate (scripts/verify_doors.ts) can hold the promise to the route the
 * href actually reaches.
 *
 * PURE. No fetch, no client, no environment. Unit-runnable.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { getCityIdentity } from "@/lib/cities/city_tier";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { spineHoodDistrict, spineHoodDistricts, districtPageHref, hasHoodScheme, hoodHubHref } from "@/lib/spine/hood_scheme";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";
import { SURFACE_ANSWERS, type DoorKind } from "@/lib/spine/door_kinds";

export type GeoPageTarget = { href: string; name: string; kind: "city" | "region"; answers: DoorKind };
export type CountryPageTarget = { href: string; label: string; answers: DoorKind };
export type DistrictPageTarget = { href: string; name: string; answers: DoorKind };
export type HubPageTarget = { href: string; /** True where the hub is the neighbourhood spine (the admitted cities, London today), false where it is the legacy page. */ spine: boolean; answers: DoorKind };

/**
 * The page for a district of a city, or null when none exists (MODEL.md 8.8;
 * plan step 35, 2026-09-19, the controller's route ruling: the district page
 * is `/cities/[slug]/neighborhoods/[district]`, under the hub, never the trade
 * route's third segment, where every unknown slug answers 404 by design).
 *
 * A page exists for exactly the districts the hub's admission gate admits
 * (hood_scheme.ts: four or more curated districts with an authored centroid,
 * London's seven today), and only while the neighbourhood spine is on: with
 * `NEXT_PUBLIC_SPINE_REFORM_HOOD=0` the hub serves the legacy page, whose
 * cards carry the district anchors, and the district route answers 404, so
 * the city's cards must land on the anchors again. Reading the flag here
 * keeps the two in step from one place. Where this returns null the caller
 * links the hub's anchor or omits the link; it never assembles the URL.
 */
export function districtPageTarget(citySlug: string, districtSlug: string): DistrictPageTarget | null {
  if (!isSpineReformEnabledFor("hood")) return null;
  const city = (citySlug ?? "").toLowerCase();
  const district = spineHoodDistrict(city, districtSlug);
  return district ? { href: districtPageHref(city, district.slug), name: district.name, answers: SURFACE_ANSWERS.district } : null;
}

/**
 * The neighbourhoods hub of a city, or null when the route would answer 404
 * (no city of that slug, or no scheme in the neighbourhoods file: the hub
 * route's own two `notFound()` lines, read through hood_scheme.ts). WHAT THE
 * HUB ANSWERS DEPENDS ON THE CITY: the admitted cities (the gate above, with
 * the neighbourhood spine on) serve the spine hub, whose masthead leads with
 * the rent spread (`rent-lightest`, 8.8 `00 take`); every other city serves
 * the legacy hub, a list of the city's districts (`districts`). The city's
 * districts door and its neighbourhood cards read one answer from here.
 */
export function neighbourhoodsHubTarget(citySlug: string): HubPageTarget | null {
  const city = (citySlug ?? "").toLowerCase();
  if (!hasHoodScheme(city)) return null;
  const spine = isSpineReformEnabledFor("hood") && spineHoodDistricts(city) != null;
  return { href: hoodHubHref(city), spine, answers: spine ? SURFACE_ANSWERS.hood : SURFACE_ANSWERS["hub-legacy"] };
}

/**
 * The country page, or null when we do not publish one.
 *
 * Checked against the same list `/[country]` gates on, so this cannot claim a
 * page the route would refuse. Greece is the case that proves it matters: the
 * country is held as `GR`, so every `/el` link ever emitted was dead, on every
 * Greek trade page, in the visible crumb and in the structured data.
 */
export function countryPageTarget(countrySlug: string): CountryPageTarget | null {
  const iso2 = (countrySlug ?? "").toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  return meta ? { href: `/${iso2.toLowerCase()}`, label: meta.name, answers: SURFACE_ANSWERS.country } : null;
}

/**
 * The page for a place inside a country, or null when nothing resolves.
 *
 * A CITY IS TRIED FIRST AND THE ORDER IS LOAD-BEARING. The two-segment region
 * route accepts only US states and admin1 regions, so it 404s for a city slug.
 * Of 290 real country and place pairs, 248 resolve to nothing at all, which is
 * the scale at which "assemble it and trust it" produces dead links.
 *
 * Where this returns null the caller renders plain text or omits the link. It
 * must never fall back to the two-segment form, which is the bug this exists to
 * end.
 *
 * A city page answers customer pay; a region page is an index into its cities
 * (`region-cities`, door_kinds.ts), and a door that lands there says so.
 */
export function geoPageTarget(countrySlug: string, geoSlug: string): GeoPageTarget | null {
  const iso2 = (countrySlug ?? "").toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  if (!meta) return null;
  const slug = (geoSlug ?? "").toLowerCase();
  if (!slug) return null;

  const city = getCityIdentity(slug);
  if (city && city.iso2.toUpperCase() === iso2) {
    return { href: `/cities/${slug}`, name: city.name, kind: "city", answers: SURFACE_ANSWERS.city };
  }

  const region = getRegionsForCountry(iso2, meta.name).find((r) => r.value === slug);
  if (region) {
    return { href: `/${iso2.toLowerCase()}/${slug}`, name: region.label, kind: "region", answers: SURFACE_ANSWERS.region };
  }
  return null;
}
