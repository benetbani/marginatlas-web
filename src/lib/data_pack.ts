/**
 * src/lib/data_pack.ts
 *
 * THE FREE UK DATA PACK (his ruling of 2026-10-05 on PARKED P0.3, option (a): "free and public, cited, as the credibility plan
 * proposes"). One version of the tables the registers build (E:/atlas/cache/uk/pack/<version>, registers/uk/build_pack.py),
 * published under public/data/uk/<version>/ by scripts/data/publish_pack.ts and listed on /data. The words below say what each
 * file holds, read off its header and the pack's own README; the gate data-pack holds the files, the page and this list together.
 *
 * Held back, by the credibility plan's free line (CREDIBILITY.md, decision 3: street-level joins and history stay out of the free
 * line): the companies joined to postcode districts and the monthly series of new companies. Nothing on the site promises them.
 */
export const PACK_VERSION = "2026.10";
export const PACK_RELEASED = "4 October 2026";
export const PACK_HELD_BACK: readonly string[] = ["companies_by_district.csv", "new_companies_by_month.csv"];

export type PackFile = { file: string; title: string; holds: string };

/** The published files, tables first, then the files that explain them. */
export const PACK_FILES: readonly PackFile[] = [
  { file: "trades_by_borough.csv", title: "Trades by borough", holds: "Businesses, premises and the middle business's yearly turnover, per trade and London borough." },
  { file: "failures_by_trade.csv", title: "Failures by trade", holds: "Company insolvencies a year per 1,000 live companies, per trade, UK and London." },
  { file: "survival_by_trade_group.csv", title: "Survival by trade", holds: "New businesses still trading after one to five years, per trade group, UK." },
  { file: "survival_by_borough.csv", title: "Survival by borough", holds: "New businesses still trading after one to five years, and births and deaths, per London borough." },
  { file: "food_by_borough.csv", title: "Food by borough", holds: "Food businesses, hygiene ratings and new kitchens awaiting a first inspection, per London borough." },
  { file: "rateable_value_by_borough.csv", title: "Rent by borough", holds: "The official estimate of a year's rent per square metre, by kind of premises and London area." },
  { file: "station_footfall.csv", title: "Station footfall", holds: "Entries and exits at London stations on a weekday, a Saturday and a Sunday." },
  { file: "trades_sic.json", title: "Trades and codes", holds: "The site's trades mapped to UK SIC 2007 codes, each match exact, shared or near." },
  { file: "ledger.json", title: "The ledger", holds: "Every kind of figure: how it is made, its source, its date, its licence line and what it leaves out." },
  { file: "README.md", title: "Read me", holds: "What each table is, where it comes from and what it cannot see, with every attribution line." },
  { file: "CITATION.cff", title: "How to cite", holds: "The citation for this version, in the Citation File Format." },
];

/** A file's address on the site. */
export const packHref = (file: string) => `/data/uk/${PACK_VERSION}/${file}`;
