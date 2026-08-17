/**
 * src/lib/home/catalog.ts , the typed door onto the home page catalog.
 *
 * WHY THIS FILE EXISTS AND THE COMPONENT DOES NOT JUST READ THE JSON. The
 * layering gate forbids anything in src/components or src/app from importing
 * out of data/, and it caught the first version of CatalogPlates doing exactly
 * that. The rule is not bureaucracy: a component that reaches into a data file
 * owns a shape nobody typed, so a change to the file breaks a render rather
 * than a build, and it breaks it in production rather than in the gate.
 *
 * The data is PUSHED here from the fact warehouse by
 * page-data/tools/export/catalog_collections.py. The website cannot read
 * page-data, that has killed 49 deploys, so the export is committed.
 *
 * Regenerate with:
 *   cd E:/atlas/page-data && python tools/export/catalog_collections.py
 */
import catalogJson from "../../../data/catalog/collections_v1.json";
import { iso2ToName } from "@/lib/countries";

export type CatalogCollection = {
  id: string;
  /** The name a reader sees. A claim, never a category. */
  title: string;
  /** One sentence saying what membership means. */
  claim: string;
  /** "countries" | "cities" | "districts" | "trades". */
  unit: string;
  /** How many entities carry the figure at all. Zero means the metric is not held. */
  measured: number;
  /** How many of them qualify. */
  qualifying: number;
  /** The membership rule in words, so a reader can disagree with it. */
  rule: string;
  members: string[];
  href: string;
  /* The destination rows. The plate shows a count; /extremes shows the members
     behind it, capped at 24 in the exporter because a destination is still a
     page and not a database dump. */
  detail: { id: string; name: string; a: number | null; b: number | null }[];
  /* What the two figure columns mean, in reader words. Nulls where a
     collection carries only one figure. */
  columns: (string | null)[];
};

const COLLECTIONS = (catalogJson as { collections: CatalogCollection[] }).collections;

/**
 * Every collection, in export order.
 *
 * A collection with `measured === 0` is NOT filtered out. It ships as an honest
 * gap: districts have no decline metric yet, and the page draws the shape the
 * collection will take rather than hiding that it is coming. Dropping it here
 * would make the page silently narrower every time a metric was missing, which
 * is the failure the country character section already suffered.
 */
export function getCatalogCollections(): CatalogCollection[] {
  return COLLECTIONS;
}

/**
 * The first few members of a collection, in the words a reader knows them by.
 *
 * WHY THIS IS NOT JUST `c.members.slice(0, 3)`. The warehouse keys countries by
 * ISO-2, so the `cheap-and-light` collection ships its members as "TL, SD, VU"
 * and the home page printed exactly that: three two-letter codes offered as the
 * concrete examples on the most-read surface on the site. Nobody reads TL.
 * They are Timor-Leste, Sudan and Vanuatu, and `iso2ToName` already holds every
 * one of them.
 *
 * Only the `countries` unit is mapped. Cities and trades already ship display
 * names ("Abuja", "Mental Health Practice"), and running those through a
 * country lookup would be a no-op at best and a wrong hit at worst.
 *
 * `iso2ToName` returns the code itself when it does not know one, so an
 * unmapped country degrades to what the page shows today rather than to a blank
 * chip. The resolution happens HERE rather than in the component because it is
 * a fact about the data, and because the plate and its destination page should
 * never disagree about what a member is called.
 */
export function displayMembers(c: CatalogCollection, limit = 3): string[] {
  const raw = c.members.slice(0, limit);
  if (c.unit !== "countries") return raw;
  return raw.map((m) => (m.length === 2 ? iso2ToName(m) : m));
}
