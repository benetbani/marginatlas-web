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
