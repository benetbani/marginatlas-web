/**
 * src/lib/spine/city_texture_rows.ts
 *
 * HOW THIS CITY DOES BUSINESS, the city page's `21 texture` (2026-09-23; the
 * brief's method applied to a field its own table missed, since section 1 read
 * only the metrics it had already listed).
 *
 * THE PAIN, and it is the one a person cannot look up: every city has a way of
 * dealing that a newcomer learns in the first expensive year. Is the money
 * card or cash? Does the lease read as the landlord's document? Are the rules
 * enforced to the letter? Does a deal take one meeting or five? Nobody
 * publishes that, because it is not a statistic anywhere; this bank holds it
 * as a position between two named ends, which is the honest way to say it.
 *
 * WHERE THE READS COME FROM, with their coverage, measured 2026-09-23:
 * `character.texture.*.left_label`, `.right_label` and `.position_0_1` on the
 * city shard, held by 252 of 252 cities and read by nothing until this
 * builder. SIX PAIRS ACROSS THE WHOLE BANK and not one more, counted over the
 * 252 shards: slow to open up against quick to deal, cash-friendly against
 * card-first, loose on rules against strict compliance, landlord-friendly
 * against tenant-friendly, relationship-led against transactional, relaxed
 * pace against always-on. 251 cities hold six of them and London holds four.
 * Every read is tagged modelled on every city, and the basis line says so.
 *
 * THE TRAIT NAMES ARE THIS SITE'S AND SO IS ONE POLE. The shard names the two
 * ends and not the subject, and a row needs a subject; because the six pairs
 * are universal, the subjects are a fixed table in `COPY.cityTexture`, keyed by
 * the pair itself, and a pair the copy does not name withholds that ROW (not
 * the card), so a seventh pair appearing in the bank cannot print a machine
 * word. The ends print as the shard writes them with ONE exception: "Slow to
 * open up" is four words, and the model laws read a four-word pole as a
 * sentence (measured on this card's first render), so the site says "Slow to
 * trust", which is what the shard's own takeaway line means by it.
 *
 * FIVE ROWS, NOT SIX, by his ruling of 2026-09-19 on the same form ("there have
 * to be five categories, six is a little bit too much"), which the country's
 * character pair already obeys. The five are the first five of the copy's own
 * order, which is the order of what a person meets first: how a deal is done,
 * how money is taken, how the rules are enforced, whose document the lease is,
 * how work is won. The pace pair is the one that drops on the 251, and London
 * holds four of the five it would print anyway.
 *
 * NOT A COINED INDEX (clause 17): nothing prints the 0-to-1 position as a
 * number; it is a dot's place between two words a reader can act on, which is
 * the form his own character tables have used since 2026-08-30.
 *
 * WITHHOLDING: two named rows is the archetype's floor, and under it the card
 * does not draw.
 */
import { loadCityShard, cityEntityId, cityFigure } from "@/lib/facts/city_shard";
import { queryFacts } from "@/lib/facts/store";
import type { FactTag } from "@/lib/facts/types";
import type { SpectraRow } from "@/components/spine/archetypes/SpectraTable";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COPY } from "@/lib/spine/copy";

type CityRow = { slug: string; name: string; iso2: string };
const BY_SLUG = new Map((cityListJson as { cities: CityRow[] }).cities.map((c) => [c.slug, c]));

export const TEXTURE_PREFIX = "character.texture.*.";
/** His cap on this form (2026-09-19), applied here as it is on the country's pair. */
export const TEXTURE_ROWS = 5;

export type CityTextureData = {
  slug: string;
  rows: SpectraRow[];
  /** The card's one figure at 30: how often somebody official walks in. */
  visits: { figure: string; label: string };
  basis: string;
  tag: FactTag;
};

/** The pair as the copy table keys it, so a name cannot drift from its poles. */
const pairKey = (left: string, right: string) => `${left} | ${right}`;

export function buildCityTexture(slug: string): CityTextureData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  if (!loadCityShard(iso2, slug)) return null;
  const id = cityEntityId(iso2, slug);
  const byKey = new Map<string, { key: string; left?: string; right?: string; pos?: number; tag?: FactTag }>();
  for (const f of queryFacts({ entityId: id })) {
    if (!f.metric.startsWith(TEXTURE_PREFIX)) continue;
    const field = f.metric.slice(TEXTURE_PREFIX.length);
    const key = String(f.rowKey ?? "");
    const row = byKey.get(key) ?? { key };
    if (field === "left_label" && typeof f.value === "string" && f.value.trim()) row.left = f.value.trim();
    if (field === "right_label" && typeof f.value === "string" && f.value.trim()) row.right = f.value.trim();
    if (field === "position_0_1" && typeof f.value === "number" && Number.isFinite(f.value)) row.pos = Math.max(0, Math.min(1, f.value));
    if (f.tag === "placeholder") return null;
    if (f.tag && f.tag !== "held") row.tag = "modeled";
    byKey.set(key, row);
  }
  const names = COPY.cityTexture.traits as Record<string, { name: string; left: string; right: string }>;
  /* THE COPY'S ORDER IS THE CARD'S ORDER, not the file's: the file's row keys
     are 0 to 5 and their subjects are not in one order across the bank, so the
     card would otherwise change its reading order city by city. */
  const live = [...byKey.values()].filter((r) => r.left && r.right && typeof r.pos === "number" && names[pairKey(r.left, r.right)]);
  const order = Object.keys(names);
  const rows: SpectraRow[] = live
    .sort((a, b) => order.indexOf(pairKey(a.left as string, a.right as string)) - order.indexOf(pairKey(b.left as string, b.right as string)))
    .slice(0, TEXTURE_ROWS)
    .map((r) => {
      const t = names[pairKey(r.left as string, r.right as string)];
      return { key: r.key, name: t.name, left: t.left, right: t.right, position: r.pos as number };
    });
  if (rows.length < 2) return null;
  /* THE CARD'S ONE FIGURE, and it is not one of the reads: `reg.inspections_per_yr`
     on the same shard, held by 252 of 252 (133 gathered, 119 modelled; 0 to 4 a
     year, London 1). Two reasons it is here and not in a card of its own. PART 4
     says every section card takes exactly one figure at 30 and a spectrum has
     none by its own law, which is why the country's character pair carries that
     row on the laws list; and how often the state walks in is the hardest fact
     there is about how a city does business. No figure, no card. */
  const visits = cityFigure(iso2, slug, "reg.inspections_per_yr");
  if (!visits || !Number.isFinite(visits.value) || visits.value < 0) return null;
  const n = Math.round(visits.value);
  return {
    slug,
    rows,
    visits: { figure: String(n), label: n === 1 ? COPY.cityTexture.visits.one : COPY.cityTexture.visits.many },
    basis: COPY.cityTexture.basis,
    tag: live.some((r) => r.tag === "modeled") || visits.tag !== "held" ? "modeled" : "held",
  };
}
