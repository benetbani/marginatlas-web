/**
 * Smart-404 suggestion engine. Given a path that 404'd, return up to 6
 * candidate URLs the user probably wanted.
 *
 * Strategy:
 *   - Parse path into 1-4 segments: country / geo / industry [/ extra]
 *   - For each segment, find the closest valid token via Levenshtein
 *   - Score combinations; cap at 6 unique URLs
 *   - Always include "parent" path (drop the deepest segment) as a fallback
 */
import { COUNTRIES, INDUSTRIES, industryToSlug, slugToIndustry } from "./taxonomy";

const COUNTRY_SLUGS = new Set(COUNTRIES.map((c) => c.code.toLowerCase()));

const INDUSTRY_SLUGS = INDUSTRIES.map((ind) => industryToSlug(ind.id));

export type Suggestion = {
  href: string;
  label: string;
  hint: string;
};

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function closestMatches(needle: string, haystack: string[], k: number): string[] {
  const scored = haystack
    .map((h) => ({ h, d: levenshtein(needle.toLowerCase(), h.toLowerCase()) }))
    .filter((x) => x.d <= Math.max(3, Math.ceil(needle.length / 2)))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((x) => x.h);
  return scored;
}

function closestCountry(slug: string): string | null {
  const lower = slug.toLowerCase();
  if (COUNTRY_SLUGS.has(lower)) return lower;
  const match = closestMatches(lower, [...COUNTRY_SLUGS], 1);
  return match[0] || null;
}

function closestIndustrySlug(slug: string): string | null {
  // slugToIndustry already handles alias + tight fuzzy
  const direct = slugToIndustry(slug);
  if (direct) return industryToSlug(direct.id);
  const match = closestMatches(slug, INDUSTRY_SLUGS, 1);
  return match[0] || null;
}

/**
 * Build smart suggestions for a failed path like /xx/yy/zz.
 * Returns up to 6 unique candidates.
 */
export function suggestForPath(rawPath: string): Suggestion[] {
  if (!rawPath || rawPath === "/") return [];
  const parts = rawPath.split("/").filter(Boolean);
  if (parts.length === 0) return [];

  const out: Suggestion[] = [];
  const seen = new Set<string>();
  const push = (s: Suggestion) => {
    if (seen.has(s.href)) return;
    seen.add(s.href);
    out.push(s);
  };

  // 3-segment cell URL: /country/geo/industry
  if (parts.length >= 3) {
    const [c, g, i] = parts;
    const countryFix = closestCountry(c);
    const indFix = closestIndustrySlug(i);
    if (countryFix && countryFix === c && indFix && indFix !== i) {
      push({
        href: `/${c}/${g}/${indFix}`,
        label: `Did you mean ${indFix.replace(/-/g, " ")}?`,
        hint: "Looks like an industry-slug typo",
      });
    }
    if (countryFix && countryFix !== c) {
      push({
        href: `/${countryFix}/${g}/${indFix || i}`,
        label: `Try /${countryFix}/${g}/${indFix || i}`,
        hint: "Closest country match",
      });
    }
    // Drop the deepest segment
    push({
      href: `/${countryFix || c}/${g}`,
      label: `See all ${g.replace(/-/g, " ")} cells`,
      hint: "Drop the industry to browse the region",
    });
    push({
      href: `/${countryFix || c}`,
      label: `Open the ${(countryFix || c).toUpperCase()} country page`,
      hint: "Start higher up in the tree",
    });
  } else if (parts.length === 2) {
    const [c, g] = parts;
    const countryFix = closestCountry(c);
    // Could be country/industry shortcut OR country/region
    const indFix = closestIndustrySlug(g);
    if (countryFix && indFix) {
      push({
        href: `/${countryFix}/${g.toLowerCase()}/${indFix}`,
        label: `Try ${indFix.replace(/-/g, " ")} in that region`,
        hint: "Add the country up-front",
      });
    }
    if (countryFix && countryFix !== c) {
      push({
        href: `/${countryFix}/${g}`,
        label: `Try /${countryFix}/${g}`,
        hint: "Closest country match",
      });
    }
    push({
      href: `/${countryFix || c}`,
      label: `Open the ${(countryFix || c).toUpperCase()} country page`,
      hint: "Drop the second segment",
    });
  } else {
    // single segment
    const [c] = parts;
    const countryFix = closestCountry(c);
    const indFix = closestIndustrySlug(c);
    if (countryFix) {
      push({
        href: `/${countryFix}`,
        label: `${countryFix.toUpperCase()} country page`,
        hint: countryFix === c ? "Exact country match" : "Closest country match",
      });
    }
    if (indFix) {
      push({
        href: `/us/california/${indFix}`,
        label: `${indFix.replace(/-/g, " ")} in California`,
        hint: "Closest industry match (showing a sample geography)",
      });
    }
  }

  // Always include browse + home as final safety nets
  push({
    href: "/browse",
    label: "Browse all countries",
    hint: "190+ covered countries",
  });
  push({
    href: "/",
    label: "Open the navigator",
    hint: "Country / industry / size picker",
  });

  return out.slice(0, 6);
}
