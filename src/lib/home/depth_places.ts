/**
 * src/lib/home/depth_places.ts
 *
 * THE CITIES A READER CAN WAIT FOR (his interview of 2026-09-26: "the 'notify me when my place reaches this depth' capture"; the
 * checkup of 2026-10-06, finding 5). The home page's ask, in place of a free report nobody is writing, offers every city whose
 * page the floor census counts under its floor: the same bounded set the newsletter's allowlist accepts
 * (src/lib/seo/depth_source.ts), so each choice posts its own tag and the list knows which city each reader waits for. No
 * country page is under its floor, so the place is a city. Sorted by name.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { depthSourceFor, isThinPage } from "@/lib/seo/depth_source";

export type DepthPlace = { label: string; source: string };

export function depthCities(): DepthPlace[] {
  const cities = (cityListJson as { cities: Array<{ slug: string; name: string }> }).cities;
  const out: DepthPlace[] = [];
  for (const c of cities) {
    const path = `/cities/${c.slug}`;
    if (!isThinPage(path)) continue;
    const source = depthSourceFor(path);
    if (source) out.push({ label: c.name, source });
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}
