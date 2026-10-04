/**
 * src/lib/spine/city_market_rows.ts
 *
 * WHO IS ALREADY TRADING HERE, the city page's `18 market` (MODEL.md 8.3 since
 * the late evening of 2026-09-20; his word after the push of that day: the
 * main pages hold "more sections", from what the files hold, MODEL PART 9
 * clause 63). The first question, PART 9 clause 57: six trades' density is a
 * ranking of one quantity, and a ranking of under seven members is his B1
 * bars (RankedBars, the districts card's form), each row wearing its trade's
 * icon tile (the site's trade-rows grammar, PART 5), which is what makes the
 * page's second ranked-bars card look unlike its first (clause 55: two of
 * one kind must differ; `data-look="icons"` says how).
 *
 * WHERE THE ROWS COME FROM, each figure with its file and field, on the
 * city shard (data/facts/city/<ISO2>-<slug>.json through city_shard.ts):
 *  - the bars: `comp.by_trade.*.trade` and `comp.by_trade.*.per_10k_residents`,
 *    businesses for every 10,000 residents by trade (London: six trades,
 *    restaurants 9.1 to fitness 1.3, modelled), the densest first, the set's
 *    own densest as the ceiling (`data-track="set"`);
 *  - the plus (his clause 60, the details behind the drawing): `comp.total_businesses`,
 *    `comp.new_firms_per_yr`, `comp.closure_rate_pct`, `comp.independents_pct`,
 *    each a row where it is on file, the panel drawn from two rows.
 * `comp.density_per_10k` (the city's own total density) is the board's row
 * and prints nowhere here. A shard with fewer than three trades draws no card.
 *
 * A CITY HELD TO A REGISTER REGION (London, Greater London since his ruling of
 * 2026-10-04; register_city.ts) draws the register's counts instead (plan 06,
 * task B3): each of the shard's trades read through the register's code for it
 * (london_trade.ts, a shared code named as its group, never as one trade), one
 * row a code, the businesses registered in the region, the largest first. Its
 * densities were modelled over the 14.3M metro, its focal total (531,000) and
 * the plus's openings and closures modelled too: none of them prints there.
 *
 * THE ICON follows the trade's name through one map below, by the words the
 * shards use; a name the map does not know takes the high-street tile, so
 * no row stands without a tile beside its fellows.
 *
 * Pure over the shard, synchronous.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityEntityId, cityFigure, loadCityShard } from "@/lib/facts/city_shard";
import { queryFacts } from "@/lib/facts/store";
import type { FactTag } from "@/lib/facts/types";
import type { BarRow } from "@/components/spine/archetypes/RankedBars";
import type { AtlasIconId } from "@/components/brand/icons";
import { COPY } from "@/lib/spine/copy";
import { cityRegisterPlace } from "@/lib/uk/registers/register_city";
import { LONDON_GEOGRAPHY, londonTradeRegister } from "@/lib/uk/registers/london_trade";

type CityRow = { slug: string; name: string; iso2: string };
const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The fewest trades a ranking draws (a bar chart of two is a comparison, not a ranking). */
export const CITY_MARKET_MIN_TRADES = 3;

/** The trade's icon by the words the shards use for it; the high-street tile for the rest. */
/* FIRST MATCH WINS, so the specific words stand first (2026-09-25, with the ten
   new trade glyphs). Two wrong pictures came out of the old order: "bar"
   matched "barbershops" (a cocktail glass for a barber) and "car" matched "pet
   care" (a wrench for a vet); the bar's word is bounded now and the vet is read
   before the garage. */
const TRADE_ICONS: Array<[RegExp, AtlasIconId]> = [
  [/barber/i, "trade-barber"],
  [/nail/i, "trade-nails"],
  [/hotel|lodging|guest ?house|b&b/i, "trade-hotel"],
  [/vet|pet/i, "trade-vet"],
  [/account|tax adviser|bookkeep/i, "trade-accounting"],
  [/agenc|marketing|design studio/i, "trade-agency"],
  [/bakery|bakeries|baker/i, "trade-bakery"],
  [/laundr|dry clean/i, "trade-laundry"],
  [/clean/i, "trade-cleaning"],
  [/food truck|street food/i, "trade-food-truck"],
  [/restaurant/i, "trade-restaurant"],
  [/caf[eé]|coffee/i, "trade-cafe"],
  [/\bbars?\b|pub|nightclub/i, "trade-bar"],
  [/hair|beauty|salon/i, "trade-salon"],
  [/grocer|convenience|supermarket/i, "trade-grocery"],
  [/fitness|gym/i, "trade-gym"],
  [/dental|dentist/i, "trade-dental"],
  [/auto|car|garage|repair/i, "trade-auto"],
  [/child|nursery/i, "trade-childcare"],
  [/taxi|ride/i, "trade-taxi"],
  [/retail|shop|store/i, "trade-retail"],
];
export const tradeIconFor = (name: string): AtlasIconId => TRADE_ICONS.find(([re]) => re.test(name))?.[1] ?? "high-street";

/** The register's trade for each of the shard's trade words (the shard's six: "Restaurants", "Cafes & coffee", "Bars & pubs", "Hair &
 *  beauty", "Convenience & grocery", "Fitness & gyms"), first match wins; a word with no row here draws no register row. Each slug is
 *  the one whose code is the trade's (trades_sic.json): licensed restaurants 56101, unlicensed restaurants and cafes 56102, public
 *  houses and bars 56302, hairdressing and other beauty treatment 96020, non-specialised stores with food predominating 47110,
 *  fitness facilities 93130. The printed name is COPY.cityMarket.register.names[slug], the code's group in plain words. */
const REGISTER_TRADES: Array<[RegExp, string]> = [
  [/caf[eé]|coffee/i, "cafes-coffee-shops"],
  [/restaurant/i, "restaurants"],
  [/\bbars?\b|pub/i, "pubs-taverns"],
  [/hair|beauty/i, "hairdressers-beauty"],
  [/grocer|convenience/i, "grocery-stores"],
  [/fitness|gym/i, "yoga-pilates-studios"],
];

export type CityMarketDetailRow = { key: string; label: string; value: string; tag: FactTag };

export type CityMarketData = {
  /** "density": the shard's businesses per 10,000 residents; "register": the register's businesses in the city's region (a count). */
  form: "density" | "register";
  slug: string;
  iso2: string;
  name: string;
  rows: BarRow[];
  /** The set's densest, the ceiling of every track. */
  worldMax: number;
  basis: string;
  foot: string | null;
  sample: boolean;
  /** The market in figures behind his plus (two or more rows), or null. */
  detail: { summary: string; rows: CityMarketDetailRow[] } | null;
  /** The card's one figure at 30: every business in the city (`comp.total_businesses`), the figure the bars do not print (PART 4), or null where the shard holds none. */
  focal: { figure: string; tag: FactTag } | null;
};

export function buildCityMarket(slug: string): CityMarketData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  if (!loadCityShard(iso2, slug)) return null;
  const id = cityEntityId(iso2, slug);
  const C = COPY.cityMarket;

  const byKey = new Map<string, { key: string; name?: string; value?: number; tag: FactTag }>();
  for (const f of queryFacts({ entityId: id })) {
    if (!f.metric.startsWith("comp.by_trade.*.")) continue;
    const field = f.metric.slice("comp.by_trade.*.".length);
    const key = String(f.rowKey ?? "");
    const r = byKey.get(key) ?? { key, tag: f.tag };
    if (field === "trade" && typeof f.value === "string") r.name = f.value.trim();
    if (field === "per_10k_residents" && isNum(f.value) && f.value > 0) r.value = f.value;
    if (f.tag !== "held") r.tag = f.tag;
    byKey.set(key, r);
  }
  const trades = [...byKey.values()].filter((r): r is { key: string; name: string; value: number; tag: FactTag } => typeof r.name === "string" && r.name.length > 0 && isNum(r.value));
  const place = cityRegisterPlace(iso2, slug);
  if (place) return registerMarket(city, iso2, place.geography, trades.map((t) => t.name));
  if (trades.length < CITY_MARKET_MIN_TRADES) return null;
  trades.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  const rows: BarRow[] = trades.map((t) => ({ key: `trade-${t.key}`, name: t.name, value: t.value, icon: tradeIconFor(t.name) }));
  const sampleBars = trades.some((t) => t.tag !== "held");

  const D = C.detail;
  const whole = (v: number) => Math.round(v).toLocaleString("en-US");
  const pct = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}%`;
  const spec: Array<{ key: string; metric: string; label: string; print: (v: number) => string }> = [
    { key: "all", metric: "comp.total_businesses", label: D.rows.all, print: whole },
    /* The labels say "each year"; the figures do not say it again. */
    { key: "new", metric: "comp.new_firms_per_yr", label: D.rows.newYear, print: whole },
    { key: "close", metric: "comp.closure_rate_pct", label: D.rows.closeYear, print: pct },
    { key: "independents", metric: "comp.independents_pct", label: D.rows.independents, print: pct },
  ];
  const detailRows: CityMarketDetailRow[] = spec.flatMap((r) => {
    const f = cityFigure(iso2, slug, r.metric);
    return f && f.value > 0 ? [{ key: r.key, label: r.label, value: r.print(f.value), tag: f.tag }] : [];
  });
  /* THE FOCAL is the count of every business here, drawn at 30 above the bars
     and taken out of the plus (a figure prints once on a card); the plus keeps
     the openings, the closures and the independents. */
  const allFig = cityFigure(iso2, slug, "comp.total_businesses");
  const focal = allFig && allFig.value > 0 ? { figure: whole(allFig.value), tag: allFig.tag } : null;
  const plusRows = focal ? detailRows.filter((r) => r.key !== "all") : detailRows;
  const sample = sampleBars || detailRows.some((r) => r.tag !== "held");
  return {
    form: "density",
    slug,
    iso2,
    name: city.name,
    rows,
    worldMax: trades[0].value,
    basis: C.basis,
    foot: sample ? C.footModelled : null,
    sample,
    detail: plusRows.length >= 2 ? { summary: D.summary, rows: plusRows } : null,
    focal,
  };
}

/** The register's counts for a city held to a register region: one row a code, the largest first; the focal is their sum (every
 *  registered business in the trades drawn, a figure the bars do not print: PART 4), and no plus. Only London's region has an
 *  accessor today; another region draws no card rather than London's figures. */
function registerMarket(city: CityRow, iso2: string, geography: string, shardNames: string[]): CityMarketData | null {
  if (geography !== LONDON_GEOGRAPHY) return null;
  const R = COPY.cityMarket.register;
  const seen = new Set<string>();
  const rows: BarRow[] = [];
  for (const word of shardNames) {
    const slug = REGISTER_TRADES.find(([re]) => re.test(word))?.[1];
    const reg = slug ? londonTradeRegister(slug) : null;
    const name = slug ? R.names[slug] : undefined;
    if (!slug || !reg || !name) continue;
    /* ONE ROW A CODE: two of the shard's words on one code would print one count twice. */
    const code = reg.sic.join("+");
    if (seen.has(code)) continue;
    seen.add(code);
    /* The tile follows the shard's word ("Cafes & coffee" is a cafe), never the group's ("unlicensed restaurants" would read as a restaurant). */
    rows.push({ key: slug, name, value: reg.enterprises, icon: tradeIconFor(word) });
  }
  if (rows.length < CITY_MARKET_MIN_TRADES) return null;
  rows.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  /* One code a row, so the sum counts no business twice; each count is the register's, rounded to 5 by the statistics office. */
  const all = rows.reduce((n, r) => n + r.value, 0);
  return {
    form: "register",
    slug: city.slug,
    iso2,
    name: city.name,
    rows,
    worldMax: rows[0].value,
    basis: R.basis.replace("{city}", city.name),
    foot: null,
    sample: false,
    detail: null,
    focal: { figure: all.toLocaleString("en-US"), tag: "held" },
  };
}
