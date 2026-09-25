/**
 * WHO THE CUSTOMERS ARE (2026-09-25; his message that night: "Type of customers by mode of transport pedestrians, car or online ...
 * By age, generation based ... By origin, native, immigrant, tourist"). Page-agnostic, keyed by country and, where the file holds
 * it, a city.
 *
 * THE FILE, data/sections/people.json: population by age band, how trips are made, the online share of retail sales and overseas
 * visits, each for one period and place as published; a band marked `computed` is the published total less the published bands.
 * BORN ABROAD IS NOT IN IT: it is the signature files' `foreign_born_pct` (data/cities/country_signature_v1.json, the UN's migrant
 * stock share for every country alike; city_signature_v1.json for a city), the one figure every page prints, so no two cards on
 * the site can disagree about it. Nothing is drawn from a gap.
 */
import peopleJson from "../../../../data/sections/people.json";
import countrySigJson from "../../../../data/cities/country_signature_v1.json";
import citySigJson from "../../../../data/cities/city_signature_v1.json";
import { COPY } from "@/lib/spine/copy";

type Band = { key: string; pct: number; computed?: boolean };
type FileCity = { name: string; age?: { bands: Band[] }; visits?: { millions: number; overnight?: boolean } };
type FileCountry = {
  name: string;
  age?: { bands: Band[] };
  trips?: { place: string; parts: Array<{ key: string; pct: number }> };
  online?: { place: string; pct: number };
  visits?: { millions: number };
  cities?: Record<string, FileCity>;
};
const file = peopleJson as unknown as Record<string, FileCountry | string>;
const countryOf = (iso2: string): FileCountry | null => {
  const c = file[iso2.toUpperCase()];
  return c && typeof c === "object" ? c : null;
};
const isPct = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0 && v < 100;
const pctText = (v: number) => `${Math.round(v)}%`;

export type AgeBar = { name: string; bands: Array<{ key: string; label: string; pct: number }>; focal: boolean };
export type AgeMix = { figure: string; words: string; bars: AgeBar[] };

function bandsOf(src: { bands: Band[] } | undefined): AgeBar["bands"] | null {
  const labels = COPY.people.age.bands;
  const b = (src?.bands ?? []).filter((x) => isPct(x.pct) && labels[x.key]).map((x) => ({ key: x.key, label: labels[x.key], pct: x.pct }));
  const sum = b.reduce((n, x) => n + x.pct, 0);
  return b.length >= 4 && Math.abs(sum - 100) <= 1 ? b : null;
}

/** The age mix: the city's bar against its country's where the file holds the city, else the country's alone; the card's figure is
 *  the focal place's share aged 25 to 49. */
export function buildAgeMix(iso2: string, city?: string): AgeMix | null {
  const c = countryOf(iso2);
  if (!c) return null;
  const countryBands = bandsOf(c.age);
  if (!countryBands) return null;
  const ci = city ? c.cities?.[city] : undefined;
  const cityBands = ci ? bandsOf(ci.age) : null;
  const focalBands = cityBands ?? countryBands;
  const focalName = cityBands && ci ? ci.name : c.name;
  const core = focalBands.find((b) => b.key === "25to49");
  if (!core) return null;
  const bars: AgeBar[] = [{ name: c.name, bands: countryBands, focal: !cityBands }];
  if (cityBands && ci) bars.push({ name: ci.name, bands: cityBands, focal: true });
  return { figure: pctText(core.pct), words: COPY.people.age.focalWords.replace("{place}", focalName), bars };
}

export type CustomersCome = { figure: string; words: string; online: number; tripsPlace: string; parts: Array<{ key: string; name: string; share: number }> };

/** How customers come: the online share of retail sales as the card's figure (and its pie), the trips by how they are made as one bar. */
export function buildCustomersCome(iso2: string): CustomersCome | null {
  const c = countryOf(iso2);
  if (!c?.online || !isPct(c.online.pct) || !c.trips) return null;
  const modes = COPY.people.come.modes;
  const parts = c.trips.parts.filter((p) => isPct(p.pct) && modes[p.key]).map((p) => ({ key: p.key, name: modes[p.key], share: p.pct }));
  if (parts.length < 3 || !parts.some((p) => p.key === "walk") || !parts.some((p) => p.key === "car")) return null;
  const online = c.online.pct;
  return { figure: `${Number.isInteger(online) ? online : online.toFixed(1)}%`, words: COPY.people.come.focalWords, online, tripsPlace: c.trips.place, parts };
}

export type Origin = { figure: string; words: string; places: Array<{ name: string; pct: number; focal: boolean }>; visits: Array<{ name: string; millions: number; overnight: boolean }> };

const COUNTRY_SIG = (countrySigJson as unknown as { countries: Record<string, { foreign_born_pct?: unknown }> }).countries;
const CITY_SIG = (() => {
  const raw = (citySigJson as unknown as { cities: Record<string, { foreign_born_pct?: unknown }> | Array<{ slug?: string; foreign_born_pct?: unknown }> }).cities;
  if (Array.isArray(raw)) return Object.fromEntries(raw.filter((x) => typeof x.slug === "string").map((x) => [x.slug as string, x]));
  return raw;
})();

/** Born abroad (the signature files' one figure) for the country and, where held, its city; overseas visits from this file. */
export function buildOrigin(iso2: string, city?: string): Origin | null {
  const c = countryOf(iso2);
  if (!c) return null;
  const countryPct = COUNTRY_SIG[iso2.toUpperCase()]?.foreign_born_pct;
  if (!isPct(countryPct)) return null;
  const ci = city ? c.cities?.[city] : undefined;
  const cityPct = city ? CITY_SIG[city]?.foreign_born_pct : undefined;
  const hasCity = !!ci && isPct(cityPct);
  const places = [{ name: c.name, pct: countryPct, focal: !hasCity }];
  if (hasCity && ci) places.push({ name: ci.name, pct: cityPct as number, focal: true });
  const focal = places.find((p) => p.focal)!;
  const visits: Origin["visits"] = [];
  if (c.visits && c.visits.millions > 0) visits.push({ name: c.name, millions: c.visits.millions, overnight: false });
  if (hasCity && ci?.visits && ci.visits.millions > 0) visits.push({ name: ci.name, millions: ci.visits.millions, overnight: !!ci.visits.overnight });
  return { figure: pctText(focal.pct), words: COPY.people.origin.focalWords.replace("{place}", focal.name), places, visits };
}

/** The countries the file holds, and each one's cities, for the stories. */
export function listPeoplePlaces(): Array<{ iso2: string; city?: string }> {
  const out: Array<{ iso2: string; city?: string }> = [];
  for (const [iso2, v] of Object.entries(file)) {
    if (iso2.startsWith("_") || typeof v !== "object") continue;
    const cities = Object.keys(v.cities ?? {});
    out.push({ iso2, city: cities[0] });
  }
  return out;
}
