/**
 * us_industry_match.ts - validates that a US cells_master row actually IS
 * the industry a URL asked for (Fable foundation fix, 2026-06-12).
 *
 * THE BUG THIS KILLS: the US branch of getCellBySlugRaw scoped its query to
 * the industry's NAICS-3 group and took the single row with the largest n.
 * Inside "541" that row is Software development, so /us/california/
 * legal-services silently rendered software numbers under a legal URL
 * (dental -> software, hairdressers -> employment services, pharmacy ->
 * grocery via the proxy fallback map). The product bar: never show industry
 * B's data under industry A's URL without an honest label; either find the
 * real row, inherit from a TRUE taxonomic parent, or fall through to the
 * correctly-named modeled cell.
 *
 * Matching is lexical: the taxonomy's name + keywords against the row's
 * industry_description, with phrase hits weighted above stemmed word-prefix
 * hits. Tier 2 inheritance walks parent_id ONLY; the curated
 * PARENT_FALLBACK_MAP proxies (accounting -> legal, pharmacy -> grocery)
 * are deliberately excluded because a proxy row under the original URL is
 * exactly the reported bug.
 */
import { INDUSTRY_BY_ID, type Industry } from "../taxonomy";

/** Generic words that appear in half the taxonomy and prove nothing. */
const STOPWORDS = new Set([
  "the",
  "and",
  "other",
  "misc",
  "general",
  "service",
  "services",
  "store",
  "stores",
  "shop",
  "shops",
  "office",
  "offices",
  "business",
  "businesses",
  "company",
  "companies",
  "local",
  "independent",
]);

/** Light stemmer: trailing plural endings only; keeps tokens comparable. */
function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 3 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

function cleanToken(t: string): string | null {
  const n = t.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (n.length < 3 || STOPWORDS.has(n)) return null;
  return stem(n);
}

export type IndustryTerms = { phrases: string[]; tokens: string[] };

/** The match vocabulary for one industry: keyword phrases + stemmed tokens. */
export function industryTerms(ind: Industry): IndustryTerms {
  const phrases: string[] = [];
  const tokens = new Set<string>();
  const addToken = (t: string) => {
    const c = cleanToken(t);
    if (c) tokens.add(c);
  };
  for (const w of ind.name.split(/[\s&/,+()-]+/)) addToken(w);
  for (const k of ind.keywords ?? []) {
    const norm = k.toLowerCase().trim();
    if (!norm) continue;
    if (norm.includes(" ")) phrases.push(norm);
    for (const w of norm.split(/\s+/)) addToken(w);
  }
  // Prefix-dedup: when one token is a prefix of another ("caf" from café
  // beside "cafe"), keep only the shorter; the word-prefix matcher makes the
  // longer redundant and double-counting inflated niche rows (Cafeterias
  // outscoring Restaurants).
  const list = [...tokens].sort((a, b) => a.length - b.length);
  const kept: string[] = [];
  for (const t of list) {
    if (!kept.some((k) => t.startsWith(k))) kept.push(t);
  }
  return { phrases, tokens: kept };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * How strongly a cells_master industry_description reads as this industry.
 * 0 = no evidence; phrase hits count double. Callers treat >0 as a match
 * and keep their own (year, n) ordering among matches.
 */
export function industryMatchScore(
  ind: Industry,
  description: string | null | undefined,
): number {
  if (!description) return 0;
  // Hyphens read as spaces so "Full-Service Restaurants" satisfies the
  // "full service" keyword phrase.
  const desc = description.toLowerCase().replace(/-/g, " ");
  const { phrases, tokens } = industryTerms(ind);
  let score = 0;
  for (const p of phrases) {
    if (desc.includes(p)) score += 2;
  }
  for (const t of tokens) {
    // Word-prefix match so "lawyer" hits "lawyers", "dentist" hits
    // "dentists' offices" without a full stemmer on the description side.
    if (new RegExp(`\\b${escapeRe(t)}`).test(desc)) score += 1;
  }
  return score;
}

/**
 * TRUE taxonomic ancestors (parent_id walk only), nearest first. A
 * sit-down restaurant IS a restaurant, so inheriting the parent's row under
 * the sub-niche URL is honest; the PARENT_FALLBACK_MAP proxies are not in
 * this chain on purpose.
 */
export function parentIdChain(ind: Industry): Industry[] {
  const out: Industry[] = [];
  const seen = new Set<string>([ind.id]);
  let current: Industry = ind;
  while (current.parent_id && INDUSTRY_BY_ID[current.parent_id] && !seen.has(current.parent_id)) {
    current = INDUSTRY_BY_ID[current.parent_id];
    seen.add(current.id);
    out.push(current);
  }
  return out;
}

/**
 * Pick the best row for the requested industry, two specificity tiers:
 *
 *   Tier A: rows at a SPECIFIC industry grain (naics deeper than 3 digits)
 *           whose description matches; highest score wins, the caller's
 *           (year, n) order breaks ties. These are the real answers
 *           ("Offices of Dentists", "Full-Service Restaurants").
 *   Tier B: the 3-digit sector-aggregate rows, same scoring. Honest when
 *           the data simply has no deeper grain for this group.
 *
 * Failing every exact match, TRUE parent_id ancestors get the same two
 * tiers. Returns null when the candidate set holds no honest match (the
 * caller then synthesizes a modeled cell named for the REQUESTED industry).
 */
export function pickMatchingRow<
  R extends { industry_description?: unknown; naics_6?: unknown },
>(
  rows: R[],
  requested: Industry,
): { row: R; matchedVia: "exact" | "parent"; matchedIndustry: Industry } | null {
  const isSpecific = (row: R): boolean =>
    String(row.naics_6 ?? "").trim().length > 3;

  const bestFor = (ind: Industry, pool: R[]): R | null => {
    let best: R | null = null;
    let bestScore = 0;
    for (const row of pool) {
      const desc = (row.industry_description as string | null | undefined) ?? null;
      const s = industryMatchScore(ind, desc);
      // Strictly-greater keeps the caller's (year, n) order among ties.
      if (s > bestScore) {
        best = row;
        bestScore = s;
      }
    }
    return best;
  };

  const specific = rows.filter(isSpecific);
  const aggregate = rows.filter((r) => !isSpecific(r));

  for (const [via, ind] of [
    ["exact", requested] as const,
    ...parentIdChain(requested).map((a) => ["parent", a] as const),
  ]) {
    const fromSpecific = bestFor(ind, specific);
    if (fromSpecific) return { row: fromSpecific, matchedVia: via, matchedIndustry: ind };
    const fromAggregate = bestFor(ind, aggregate);
    if (fromAggregate) return { row: fromAggregate, matchedVia: via, matchedIndustry: ind };
  }
  return null;
}
