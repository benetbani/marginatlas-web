/**
 * src/lib/spine/team_rows.ts
 *
 * WHAT STAFF COST, the trade page's `06 team` (MODEL.md 8.6; plan step 33,
 * third dispatch, 2026-09-18): the trade's roles on TiersTable with two
 * figure columns, how many (a count) and pay a year (currency), no winner
 * mark because a wage row has no best. Pure over the shard and the pay
 * builder, synchronous, no database: the view, the stories and the copy
 * gate build every case from a trade id and a country code.
 *
 * THE ROLES are the shard's `roles.*.role / headcount_typical /
 * wage_index_vs_national_median`. THE THREE KEY SPELLINGS ARE FOLDED HERE:
 * the export filed the collection under `roles.list` on 192 shards,
 * `roles.roles` on 33 and `roles.items` on 18 (counted 2026-09-18, the
 * trade composition's FH4), and this builder reads whichever the shard
 * holds so a caller never learns there were three. Two to seven rows on the
 * 243 (3 / 69 / 116 / 45 / 9 / 1 by count), 53 of the 963 tagged held, every
 * one printed as modelled (R12). The rows stand dearest first (the wage
 * index decides, then the headcount), because a budget starts at the hire
 * that costs most, the old wage card's own order.
 *
 * THE PAY is the wage index times THE COUNTRY'S MEDIAN PAY, the pay
 * builder's average row (`median_wage_full_time_usd` off the profile,
 * pay_rows.ts, DATA-REQUIREMENTS item 9), never measured for the role. Where
 * the country holds no credible median (the pair the pay builder withholds,
 * Cuba and Egypt, 2 of 195, counted 2026-09-18; and any country the profile
 * does not hold) the pay column prints dashes and the card says so once
 * (clause 18: a dash is explained once, a column never dropped); the
 * headcount column still reads.
 *
 * THE NAME BLOCK'S TWO LINES carry the role as the shard wrote it, nothing
 * shortened and nothing dropped (`roleLines`): a role with a trailing
 * parenthetical puts the parenthetical on the block's second line; a role
 * named as alternatives ("Owner or general manager", 147 of the 963) puts
 * its first alternative on the label line and the rest on the second ("or
 * general manager"), the slot PART 5 gives a second name; a compound role
 * ("Owner and lead installer"; 427 of the 963 run past three words) stays
 * whole on the label line and wraps within the block's two-line reserve,
 * never truncated (clause 31). The label law's three words (PART 5) is a
 * copy fault the harness reports on those, the data track's to fix in the
 * shards (DATA-REQUIREMENTS item 54), never a taller row and never a
 * mechanical cut that would turn "Body and collision technician" into
 * "Body".
 *
 * THE HEADCOUNT prints as the file holds it: whole people as whole numbers,
 * and on a shard where any role is a fraction of a person (nine rows on the
 * 243, a half-time bookkeeper) the whole column takes one decimal, so a
 * column never mixes decimal counts (PART 5).
 */
import type { TiersFigureRow } from "@/components/spine/archetypes/TiersTable";
import { industryRows } from "@/lib/facts/industry_shard";
import { buildPayBars } from "@/lib/spine/pay_rows";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

/** The three spellings the export filed the collection under, tried in order of their count. */
export const ROLE_PREFIXES = ["roles.list.", "roles.roles.", "roles.items."] as const;

/** The most rows the data holds on one shard, and the table's own cap. */
export const TEAM_ROWS_CAP = 7;

export type TeamRole = {
  key: string;
  /** The shard's role name, whole. */
  role: string;
  /** The label line and the second line, split at the first "or" where the role names alternatives. */
  name: string;
  sub: string | null;
  headcount: number;
  wageIndex: number;
  /** The pay a year in dollars, or null where the country holds no median. */
  pay: number | null;
  tag: string;
};

export type TeamData = {
  industryId: string;
  iso2: string;
  roles: TeamRole[];
  /** The table's rows as TiersTable draws them: the name block and the two figure columns as printed. */
  rows: TiersFigureRow[];
  heads: { name: string; a: string; b: string };
  /** The country's median pay the index multiplies, or null. */
  median: number | null;
  /** The one line said where the pay column prints dashes, else null. */
  noMedian: string | null;
  basis: string;
  foot: string;
  sample: true;
  confidence: "modeled";
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * The label line and the second line of a role name, the shard's words
 * whole: a trailing parenthetical ("Owner-operator (working supervisor,
 * sales and estimating)", 21 of the 963 run past forty characters this way)
 * is the second line without its brackets; else a role named as alternatives
 * splits at the first " or "; else the name stands whole and the second line
 * is empty. Nothing is dropped and nothing is reworded.
 */
export function roleLines(role: string): { name: string; sub: string | null } {
  const t = role.trim();
  const paren = t.match(/^(.+?)\s+\((.+)\)$/);
  if (paren) return { name: paren[1].trim(), sub: paren[2].trim() };
  const at = t.indexOf(" or ");
  if (at > 0 && at < t.length - 4) return { name: t.slice(0, at).trim(), sub: `or ${t.slice(at + 4).trim()}` };
  return { name: t, sub: null };
}

/** The shard's roles under whichever key spelling it holds, in the shard's order; empty when it holds none. */
export function shardRoles(industryId: string): TeamRole[] {
  for (const prefix of ROLE_PREFIXES) {
    const facts = industryRows(industryId, prefix);
    if (facts.length === 0) continue;
    const byRow = new Map<string, { role?: string; headcount?: number; index?: number; tag?: string }>();
    for (const f of facts) {
      const row = byRow.get(f.rowKey) ?? {};
      const leaf = f.metric.slice(prefix.length + 2); // past "*."
      if (leaf === "role" && typeof f.value === "string") row.role = f.value;
      if (leaf === "headcount_typical" && isNum(f.value)) row.headcount = f.value;
      if (leaf === "wage_index_vs_national_median" && isNum(f.value)) { row.index = f.value; row.tag = f.tag; }
      byRow.set(f.rowKey, row);
    }
    const out: TeamRole[] = [];
    for (const [key, r] of byRow) {
      if (!r.role || !isNum(r.headcount) || !isNum(r.index) || r.headcount <= 0 || r.index <= 0) continue;
      const { name, sub } = roleLines(r.role);
      out.push({ key, role: r.role, name, sub, headcount: r.headcount, wageIndex: r.index, pay: null, tag: r.tag ?? "modeled" });
    }
    if (out.length > 0) return out;
  }
  return [];
}

/** The country's median pay the index multiplies: the pay builder's average row, or null where the pair is withheld or not held. */
export function countryMedianPay(iso2: string): number | null {
  const pay = buildPayBars(iso2);
  if (!pay || pay.withheld) return null;
  const avg = pay.rows.find((r) => r.key === "average")?.value;
  return isNum(avg) && avg > 0 ? avg : null;
}

/** The headcount as printed: whole people as whole numbers; one decimal on every row of a card holding a fraction of a person. */
export function headcountFigure(n: number, oneDecimal: boolean): string {
  return oneDecimal ? n.toFixed(1) : String(Math.round(n));
}

/** The team for a trade in a country. Null when the shard holds no roles (a sector-average cell, no shard), which no shard id reaches today. */
export function buildTeam(industryId: string | null | undefined, iso2: string | null | undefined): TeamData | null {
  if (!industryId || !iso2) return null;
  const found = shardRoles(industryId);
  if (found.length === 0) return null;
  const median = countryMedianPay(iso2);
  const roles = [...found]
    .sort((a, b) => b.wageIndex - a.wageIndex || b.headcount - a.headcount)
    .slice(0, TEAM_ROWS_CAP)
    .map((r) => ({ ...r, pay: median != null ? Math.round(r.wageIndex * median) : null }));
  const oneDecimal = roles.some((r) => !Number.isInteger(r.headcount));
  const rows: TiersFigureRow[] = roles.map((r) => ({
    key: r.key,
    name: r.name,
    sub: r.sub,
    a: headcountFigure(r.headcount, oneDecimal),
    b: r.pay != null ? usd(r.pay) : null,
  }));
  return {
    industryId,
    iso2: iso2.toUpperCase(),
    roles,
    rows,
    heads: { name: COPY.tradeTeam.heads.name, a: COPY.tradeTeam.heads.count, b: COPY.tradeTeam.heads.pay },
    median,
    noMedian: median == null ? COPY.tradeTeam.noMedian : null,
    basis: COPY.tradeTeam.basis,
    foot: COPY.tradeTeam.foot,
    sample: true,
    confidence: "modeled",
  };
}

/** The shard with the most roles, for the stories: the tallest table the data holds. Counted over the ids given, ties to the first by id. */
export function tallestTeamTrade(ids: string[]): { id: string; rows: number } | null {
  let best: { id: string; rows: number } | null = null;
  for (const id of [...ids].sort()) {
    const n = shardRoles(id).length;
    if (n > 0 && (!best || n > best.rows)) best = { id, rows: n };
  }
  return best;
}

/** The row count per shard over the ids given, counted rather than remembered, for the gates and the record. */
export function countTeamRows(ids: string[]): { total: number; perCount: Record<number, number>; none: number; split: number; over: number } {
  const out = { total: ids.length, perCount: {} as Record<number, number>, none: 0, split: 0, over: 0 };
  for (const id of ids) {
    const roles = shardRoles(id);
    if (roles.length === 0) { out.none++; continue; }
    out.perCount[roles.length] = (out.perCount[roles.length] ?? 0) + 1;
    for (const r of roles) {
      if (r.sub) out.split++;
      if (r.name.split(/\s+/).filter(Boolean).length > 3) out.over++;
    }
  }
  return out;
}
