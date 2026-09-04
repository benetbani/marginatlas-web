/**
 * src/lib/spine/peer_rows.ts
 *
 * THE COMPARISON TABLE'S ROWS for a country: the home row and its ratified
 * peers (PEER_GROUPS, comparable market size, not bordering), four
 * like-for-like facts per country from the same modules the masthead reads,
 * so the home row and the masthead can never disagree. Local and
 * synchronous, so the archetype harness can build every country.
 *
 * THE FOUNDER'S RULINGS OF 2026-09-04 (3 and 4): the registration columns are
 * the LLC's. The file holds the government fee and the filing time; the
 * all-in cost to put an LLC in action and the time until the activity opens
 * are a defined data requirement (design/loop/architecture/research/
 * country-take-llc.md), so the column heads say what is measured until then.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { PEER_GROUPS } from "@/lib/countries/country_view";
import { getCountryRates, getFormationRowByTier } from "@/lib/tax/country_rates";
import { getSmbRegime } from "@/lib/tax/smb_effective_rates";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type PeerRow = { iso2: string; name: string; home: boolean; values: Record<string, number | null> };
export type PeerColumn = { key: string; head: string; unit: "pct" | "usd" | "days"; best: "min" | "max" };

export const PEER_COLUMNS: PeerColumn[] = [
  { key: "effective_tax_pct", head: COPY.peers.cols.tax, unit: "pct", best: "min" },
  { key: "payroll_pct", head: COPY.peers.cols.payroll, unit: "pct", best: "min" },
  { key: "llc_cost_usd", head: COPY.peers.cols.llcCost, unit: "usd", best: "min" },
  { key: "llc_days", head: COPY.peers.cols.llcDays, unit: "days", best: "min" },
];

export type PeerTable = { rows: PeerRow[]; columns: PeerColumn[]; caveat: string };

function nameOf(iso2: string): string | null {
  const hit = (COUNTRIES as Array<{ code: string; name: string }>).find((c) => c.code === iso2);
  return hit ? hit.name : null;
}

/** Null when the country has no peer group or fewer than two rows resolve. */
export function buildPeerTable(iso2In: string): PeerTable | null {
  const code = iso2In.toUpperCase();
  const peerCodes = (PEER_GROUPS[code] ?? []).slice(0, 4);
  if (peerCodes.length === 0) return null;
  const rows: PeerRow[] = [];
  for (const pc of [code, ...peerCodes]) {
    const name = nameOf(pc);
    if (!name) continue;
    const regime = getSmbRegime(pc);
    const rates = getCountryRates(pc);
    const llc = getFormationRowByTier(pc, "LLC");
    rows.push({
      iso2: pc,
      name,
      home: pc === code,
      values: {
        effective_tax_pct: regime && isNum(regime.effective_rate) ? Math.round(regime.effective_rate * 1000) / 10 : null,
        payroll_pct: isNum(rates.employerSocial) && rates.employerSocial > 0 ? Math.round(rates.employerSocial * 1000) / 10 : null,
        llc_cost_usd: llc && isNum(llc.costUsd) ? Math.round(llc.costUsd) : null,
        llc_days: llc && isNum(llc.days) ? Math.round(llc.days) : null,
      },
    });
  }
  if (rows.length < 2) return null;
  return { rows, columns: PEER_COLUMNS, caveat: COPY.peers.caveat };
}
