/**
 * src/lib/spine/city_hero_facts.ts
 *
 * THE CITY MASTHEAD'S FACTS, mapped from the city seed the adapter builds: the
 * city's name and flag, its photograph (the same file the country page's
 * card shows, founder ruling 2), one answer figure, the support tiles as
 * cells, and the provenance line. The answer is the tile the quick reads
 * below do not already carry (the masthead's own rule since 2026-08, "two
 * readings of one metric near the top of a page is the founder's repeating
 * the front part"), the first tile otherwise. Its colour is ink: the city
 * blueprint reserves the page's one accent for the verdict card's rent load.
 * Synchronous over a seed; the seed itself comes from the async adapter.
 */
import { cityImageSrc } from "@/lib/cities/city_images";
import { inSentence } from "@/lib/spine/place_names";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";

type Tile = { label: string; value: string | number; unit?: string; sub?: string; confidence?: "measured" | "modeled" | "placeholder" };
type Conf = "measured" | "modeled" | "placeholder";

export type CityHeroFacts = {
  slug: string;
  name: string;
  iso2?: string;
  image: { src: string; alt: string } | null;
  subtitle: string;
  answer: { label: string; value: string; basis: string | null; confidence: Conf } | null;
  cells: KvCell[];
  foot: { text: string; modeled: boolean } | null;
};

const figure = (t: Tile) => `${t.value}${t.unit ?? ""}`;

export function cityHeroFacts(seed: any): CityHeroFacts | null {
  const meta = seed?.meta;
  if (!meta || typeof meta.city !== "string") return null;
  const scorecard: Tile[] = Array.isArray(seed?.headline?.scorecard) ? seed.headline.scorecard.filter((t: Tile) => t && t.label && t.value != null && t.value !== "") : [];
  const lensLabels = new Set(((seed?.lenses?.scales ?? []) as any[]).map((x) => String(x?.label ?? "").trim().toLowerCase()));
  const notDuplicated = scorecard.filter((t) => !lensLabels.has(String(t.label).trim().toLowerCase()));
  const chosen: Tile | null = seed?.headline?.focal ?? notDuplicated[0] ?? scorecard[0] ?? null;
  const support = seed?.headline?.focal ? scorecard : scorecard.filter((t) => t !== chosen);
  const country = typeof meta.country_in_phrase === "string" ? meta.country_in_phrase : inSentence(String(meta.country_name ?? ""));
  const src = cityImageSrc(meta.slug);
  return {
    slug: String(meta.slug ?? ""),
    name: meta.city,
    iso2: typeof meta.iso2 === "string" ? meta.iso2.toLowerCase() : undefined,
    image: src ? { src, alt: "" } : null,
    subtitle: COPY.cityHero.subtitle.replace("{country}", country),
    answer: chosen ? { label: chosen.label, value: figure(chosen), basis: chosen.sub ?? null, confidence: chosen.confidence ?? "modeled" } : null,
    cells: support.map((t, i) => ({ key: `tile-${i}`, label: t.label, value: figure(t), note: t.sub, confidence: t.confidence })),
    foot: typeof meta.provenance_line === "string" && meta.provenance_line ? { text: meta.provenance_line, modeled: true } : null,
  };
}

export type CityHeroInstance = { slug: string; why: string; seed: any };

/** The instance set for the city masthead, from the data: London, a city with one tile, the longest name, a second city with the same empty image slot (no covered city holds a photograph since the map left the folder on 2026-09-11). Async because the seeds are. */
export async function loadCityHeroInstances(): Promise<CityHeroInstance[]> {
  const { buildSpineCitySeed } = await import("@/lib/spine/adapt_city");
  const list = (await import("../../../data/cities/city_list_v1.json")).default as { cities: Array<{ slug: string; name: string }> };
  const out: CityHeroInstance[] = [];
  const seen = new Set<string>();
  const take = async (slug: string, why: string) => {
    if (seen.has(slug)) return;
    try {
      const seed = await buildSpineCitySeed(slug);
      if (seed) { seen.add(slug); out.push({ slug, why, seed }); }
    } catch { /* a city the adapter cannot build self-omits from the stories */ }
  };
  await take("london", "the exemplar");
  const byName = [...list.cities].sort((a, b) => b.name.length - a.name.length);
  if (byName[0]) await take(byName[0].slug, `the longest name, ${byName[0].name}`);
  // A city with a single tile: the scan stops at the first one found, and at 40 cities, so the sheet stays quick.
  for (const c of list.cities.slice(0, 40)) {
    if (seen.has(c.slug)) continue;
    try { const seed = await buildSpineCitySeed(c.slug); if (seed?.headline?.scorecard?.length === 1) { seen.add(c.slug); out.push({ slug: c.slug, why: "one tile, the answer without a cell", seed }); break; } } catch { /* skip */ }
  }
  const noImage = list.cities.find((c) => c.slug !== "london" && !seen.has(c.slug));
  if (noImage) await take(noImage.slug, "another city, no photograph on file either");
  return out;
}
