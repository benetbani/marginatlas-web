/**
 * src/lib/facts/confidence.ts, the seam where four confidence scales meet.
 *
 * This project has described how much it trusts a figure in four
 * incompatible ways, and all four are still in use:
 *
 *   tier            "measured" | "built" | "thin"
 *                   data/cells/*.json, and the Tier type declared in
 *                   src/lib/cells/spine2_types.ts, src/lib/cities/city_spine2_types.ts,
 *                   src/lib/countries/country_spine2_types.ts.
 *                   Not the same field as coverage_tier (a differently-shaped
 *                   "measured" | "regional" | "estimated" | "modeled" scale
 *                   glossed in src/lib/coverage_tier_copy.ts), which shares
 *                   the word "tier" but is a separate vocabulary this module
 *                   does not touch.
 *
 *   quality_score   0..100
 *                   Supabase cells_master, read throughout src/lib/cells.ts.
 *
 *   source_quality  "A" | "B" | "C"
 *                   the wage data files, data/economics/median_monthly_wage_usd_v1.json
 *                   and city_wage_premium_v1.json, read in
 *                   src/lib/economic_profile/wages.ts and city_wages.ts.
 *
 *   tag (FactTag)   "held" | "modeled" | "extrapolated" | "placeholder"
 *                   the fact warehouse, declared in ./types.
 *
 * Nothing here is being deleted. Each of the first three scales already has
 * its own callers and its own reasons for existing at its own altitude, a
 * quality_score of 63 is more useful to a ranking query than "modeled" ever
 * could be. This module adds exactly ONE thing: a way to read any of the
 * first three AS a FactTag, so a client that only understands the
 * warehouse's vocabulary, an MCP tool or a public API, gets one consistent
 * answer to "how much do I trust this" no matter which subsystem the figure
 * came from.
 *
 * Every unknown input maps to "placeholder". This module never guesses a
 * better answer than the input actually supports, the same rule shard.ts
 * applies to a tag arriving from a shard file it does not recognise.
 */
import type { FactTag } from "./types";

/**
 * data/cells/*.json's tier field, three values from measured (a direct count
 * for this place and activity) down to thin (sparse enough that the figure
 * is closer to a guess than a measurement).
 */
const TIER_TO_TAG: Readonly<Record<string, FactTag>> = {
  measured: "held",
  built: "modeled",
  thin: "extrapolated",
};

/** Maps a data/cells/*.json tier to a FactTag. An unrecognised tier is placeholder. */
export function fromTier(tier: string): FactTag {
  return TIER_TO_TAG[tier] ?? "placeholder";
}

/**
 * Supabase cells_master's quality_score, 0..100, read throughout src/lib/cells.ts.
 *
 * The one threshold the live code already commits to is 40. src/app/sitemap.ts
 * keeps a regional cell in the sitemap only when quality_score >= 40, and
 * documents that as the 0..100 equivalent of a retired score100to10(...) >= 4
 * filter (score100to10 itself no longer ships, it now lives only in
 * _archive/2026-08-03-dead-code/src/components/QualityDots.tsx). That same 40
 * is reused here as the modeled floor: below it a cell is carrying a generic,
 * pattern-based estimate rather than a fitted one, src/lib/cells.ts's
 * synthesizeCell gives a fully invented cell quality_score 20, and
 * getSectorFallbackCell caps a borrowed-adjacent-industry proxy at 30, both
 * comfortably under 40.
 *
 * The held floor, 85, is not pinned down anywhere live, this project has not
 * had to defend it in public yet. It is read off the archived QualityDots
 * dot labels, where 9-10 dots (score 85 and up, given the archived
 * score100to10's round(score/10)) is the only band called "direct
 * measurement", and 8 dots (score 75-84) is called "secondary published
 * source". Drawing the line at 85 keeps this function consistent with
 * fromSourceQuality below: "secondary source" is exactly what source_quality
 * grade B means there, and grade B maps to modeled, not held.
 *
 * The mapping is deliberately lossy in one direction: quality_score 88 and
 * 91 both become "held", because that distinction is not one this project
 * has ever defended in public and a FactTag has no room to carry it.
 */
export function fromQualityScore(score: number): FactTag {
  if (!Number.isFinite(score) || score <= 0) return "placeholder";
  if (score >= 85) return "held";
  if (score >= 40) return "modeled";
  return "extrapolated";
}

/**
 * The wage data files' source_quality grade, defined in
 * data/economics/median_monthly_wage_usd_v1.json's convention.source_quality
 * block as A, hand-anchored from a national stats agency publication or the
 * ILO wage database within 24 months, direct observation. B, anchored from a
 * secondary or regional-aggregate source, or 24-48 months old. C,
 * GDP-per-capita-derived using labor share and an informal-economy uplift,
 * no direct wage observation at all. Case-insensitive, because the type the
 * wage libs declare, "A" | "B" | "C", is not itself checked for case before
 * it reaches a caller.
 */
const GRADE_TO_TAG: Readonly<Record<string, FactTag>> = {
  A: "held",
  B: "modeled",
  C: "extrapolated",
};

/** Maps a wage file's source_quality grade to a FactTag. An unrecognised grade is placeholder. */
export function fromSourceQuality(grade: string): FactTag {
  return GRADE_TO_TAG[grade.toUpperCase()] ?? "placeholder";
}

/**
 * A FactTag is internal vocabulary, "extrapolated" is not a word a reader
 * should have to parse on a page. band() converts a tag into the word a
 * page can actually show.
 */
const TAG_TO_BAND: Readonly<Record<FactTag, "strong" | "fair" | "weak" | "none">> = {
  held: "strong",
  modeled: "fair",
  extrapolated: "weak",
  placeholder: "none",
};

/** Converts a FactTag into reader-facing strength copy. */
export function band(tag: FactTag): "strong" | "fair" | "weak" | "none" {
  return TAG_TO_BAND[tag];
}
