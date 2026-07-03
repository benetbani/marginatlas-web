/**
 * src/lib/spine-seeds , the domain accessor for the bundled spine seeds.
 *
 * The spine page-type surfaces (country / city / neighborhood / cell / industry)
 * render from illustrative placeholder seeds. Those seeds' canonical home is the
 * parent repo at `E:/atlas/page-data/`, which is OUTSIDE the Vercel deploy root
 * (`website/`), so the pages cannot read them with `fs` at build time. A snapshot is
 * bundled here (see ./README.md) and exposed through this ONE lib module so the
 * pages import data the layered way (app -> lib), never a raw `data/*.json` path.
 *
 * These numbers are placeholders (`overall_confidence: "placeholder"`). On promotion
 * Phase B the spine pages switch from these consts to the real accessors
 * (getCellBySlug, getCountry*, etc.) via per-page adapters, and this module retires.
 */
import cellSeed from "./cells/GB-london-restaurants.json";
import citySeed from "./cities/GB-london.json";
import hoodSeed from "./cities/GB-london-neighborhoods.json";
import industrySeed from "./industries/restaurants.json";
import GB from "./countries/GB.json";
import DE from "./countries/DE.json";
import FR from "./countries/FR.json";
import NL from "./countries/NL.json";
import IE from "./countries/IE.json";

export const spineCellSeed: any = cellSeed;
export const spineCitySeed: any = citySeed;
export const spineHoodSeed: any = hoodSeed;
export const spineIndustrySeed: any = industrySeed;
export const spineCountrySeed: any = GB;

/** GB + its peer_set (DE / FR / NL / IE), keyed by ISO2, for the country compare table. */
export const SPINE_COUNTRIES: Record<string, any> = { GB, DE, FR, NL, IE };
