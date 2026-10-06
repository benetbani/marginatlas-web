/**
 * src/lib/uk/registers/survival.ts
 *
 * How many of a trade's businesses survive, across the UK (plan 06, task A2; his ruling of 2026-10-04: the period figure
 * first, the 2019 starters' record beside it once). The source slice holds the business demography's three-digit trade
 * groups (data/uk/registers/survival.json): a PERIOD curve, each year's survival taken from a different birth cohort and
 * chained (what a new owner faces at today's closure rates), with its interval, and the 2019 cohort's own five-year share.
 *
 * A trade that maps to two groups or none has no single figure here: a mix weighted by births would be a model of ours, and
 * the page's old figure (the trade's world shard) is not the UK's, so the card does not draw. A group prints only under its
 * plain name (SURVIVAL_GROUP_NAME), because the group is broader than the trade (barbers sit in "other personal services"
 * with laundries and funerals) and the page must say whose figure it prints.
 */
import survivalJson from "../../../../data/uk/registers/survival.json";
import { own } from "../../own";

type Point = { year: number; cohort: number; hazard: number; survival: number; lo: number; hi: number };
type Group = { name: string; births_2019: number; cohort_2019_five_years: number; period: Point[] };
type SurvivalFile = { groups: Record<string, Group>; trade_groups: Record<string, string[]> };
const SURVIVAL = survivalJson as unknown as SurvivalFile;

/** Each three-digit group a trade maps to alone, in plain plural words faithful to its official name. */
export const SURVIVAL_GROUP_NAME: Readonly<Record<string, string>> = {
  "108": "other food makers",
  "110": "drinks makers",
  "141": "clothing makers",
  "151": "leather goods makers",
  "181": "printers",
  "204": "soap and toiletry makers",
  "310": "furniture makers",
  "321": "jewellery makers",
  "329": "other manufacturers",
  "432": "electrical and plumbing installers",
  "433": "building finishers",
  "439": "other specialised builders",
  "451": "motor dealers",
  "452": "motor repairers",
  "471": "general stores",
  "472": "specialist food and drink shops",
  "473": "petrol stations",
  "475": "household goods shops",
  "476": "book, sport and toy shops",
  "477": "other specialist shops",
  "493": "other passenger transport",
  "494": "road freight and removals",
  "532": "couriers",
  "551": "hotels",
  "552": "holiday lets and hostels",
  "553": "campsites",
  "561": "restaurants and mobile food",
  "562": "caterers",
  "563": "pubs, bars and clubs",
  "581": "publishers",
  "620": "software and IT consultancies",
  "662": "insurance brokers and agents",
  "683": "estate and letting agents",
  "691": "legal practices",
  "692": "accountants and tax advisers",
  "711": "architects and engineers",
  "742": "photographers",
  "750": "vets",
  "791": "travel agents and tour operators",
  "801": "security firms",
  "802": "security systems firms",
  "812": "cleaners",
  "813": "landscapers",
  "855": "other schools and tutors",
  "862": "medical and dental practices",
  "869": "other health practices",
  "900": "creative and performing arts",
  "910": "museums and cultural sites",
  "931": "gyms, sports clubs and venues",
  "952": "repairers of personal goods",
  "960": "other personal services",
};

export type SurvivalPoint = { survival: number; lo: number; hi: number };
export type TradeSurvivalUk = {
  group: string;
  groupName: string;
  /** Period survival after one, three and five years (fractions, each inside its interval). */
  period: Record<1 | 3 | 5, SurvivalPoint>;
  /** The 2019 starters still trading after five years (a fraction). */
  cohort2019Five: number;
};

export function tradeSurvivalUk(slug: string): TradeSurvivalUk | null {
  const groups = own(SURVIVAL.trade_groups, slug);
  if (!groups || groups.length !== 1) return null;
  const group = groups[0];
  const g = SURVIVAL.groups[group];
  const groupName = SURVIVAL_GROUP_NAME[group];
  if (!g || !groupName) return null;
  const at = (t: number): SurvivalPoint | null => {
    const p = g.period.find((x) => x.year === t);
    return p && p.lo <= p.survival && p.survival <= p.hi ? { survival: p.survival, lo: p.lo, hi: p.hi } : null;
  };
  const p1 = at(1), p3 = at(3), p5 = at(5);
  if (!p1 || !p3 || !p5 || !(g.cohort_2019_five_years > 0)) return null;
  return { group, groupName, period: { 1: p1, 3: p3, 5: p5 }, cohort2019Five: g.cohort_2019_five_years };
}
