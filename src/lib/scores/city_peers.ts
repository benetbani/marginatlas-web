/**
 * src/lib/scores/city_peers.ts
 *
 * "Cities like this" peer comparison for the city page. Given a seed city, pick
 * a few PEER cities by economic similarity and carry each peer's own 0-100 city
 * attractiveness score, so the city page can show real comparable metros, each
 * ranked on the same headline scale and each linking to that peer's CITY page.
 *
 * This is the city-page sibling of the cell page's "comparable cities" ribbon,
 * but where the cell ribbon fixes one industry and links each peer to that
 * industry's cell, this surface stays at the city altitude: it links each peer
 * to its own /cities/{slug} page and shows that peer's headline city score.
 *
 * Two reused parts, no new selection logic:
 *   - getComparableCities(citySlug, limit) does the SELECTION exactly as the
 *     cell ribbon uses it: peers chosen by similarity on (log population, log
 *     GDP, wealth), a different-country preference, at most one per country.
 *   - buildCityScore(input) computes each peer's headline 0-100 city score
 *     through the exact production path the city page itself uses, banded on the
 *     same thresholds as the cell break-in rating, so a peer's badge reads
 *     identically to its own masthead. A thin peer with no demand signal scores
 *     null, and the surface simply shows that peer's card without a badge.
 *
 * Pure and synchronous: a local JSON lookup over data/cities/city_list_v1.json
 * plus the pure economics snapshot accessor and the pure score function. No
 * Supabase, no fs, no async, no React, so it stays trivially testable and cannot
 * trip the layering gate. Constraint-safe: no em-dashes, no source-agency names,
 * USD-only.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { getCityPeerSet, type PeerRole } from "@/lib/cities/comparable_cities";
import { buildCityScore } from "@/lib/scores/city_board";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import type { BreakInBand } from "@/lib/scores/break_in_rating";

/** The city record fields the peer score reads, narrowed from the full record.
 * Every figure is optional; a missing one degrades the score per the score's own
 * missing-data discipline (demand absent -> null; a secondary absent -> neutral). */
type CityRecord = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  pop_m?: number;
  avg_gross_salary_usd_year?: number;
  cost_of_living_index?: number;
  tourist_arrivals_m?: number;
};

const CITIES = (cityListJson as { cities: CityRecord[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

/**
 * One peer city, with its own headline city score. score and band are null for a
 * thin peer the score refuses to rate (no demand signal at all); the card still
 * renders, just without a badge.
 */
export type CityPeer = {
  /** URL slug, e.g. "paris" (links to /cities/{slug}). */
  slug: string;
  /** Display name, e.g. "Paris". */
  name: string;
  /** ISO-2 country code, e.g. "FR" (drives the flag). */
  iso2: string;
  /** Continent label, e.g. "Europe". */
  continent: string;
  /** Why this city is a peer: a local competitor, a classic rival, or a peer abroad. */
  role: PeerRole;
  /** This peer's headline 0-100 city score, or null when it cannot be scored. */
  score: number | null;
  /** The score's band (same scale as the cell break-in rating), or null. */
  band: BreakInBand | null;
};

/**
 * Build up to `limit` peer cities for a seed city, each with its own headline
 * city score. Selection is delegated wholesale to getComparableCities (similar
 * scale, different-country preference, max one per country); this function only
 * resolves each chosen peer's full record and scores it through buildCityScore,
 * the same path the city page uses for its own score. Deterministic and pure.
 */
export function buildCityPeers(citySlug: string, limit = 3): CityPeer[] {
  const peers = getCityPeerSet(citySlug).slice(0, limit);
  const out: CityPeer[] = [];

  for (const peer of peers) {
    const record = BY_SLUG.get(peer.slug);
    // The selection list is built from the same file, so a chosen peer is always
    // present; guard anyway so a future divergence degrades to no-badge, not a crash.
    const econ = getCountryEconomicsSnapshot(peer.iso2);
    const scored = record
      ? buildCityScore({
          city: {
            slug: record.slug,
            popM: record.pop_m ?? null,
            avgGrossSalaryUsdYear: record.avg_gross_salary_usd_year ?? null,
            costOfLivingIndex: record.cost_of_living_index ?? null,
            touristArrivalsM: record.tourist_arrivals_m ?? null,
          },
          econ: {
            selfEmploymentPct: econ.selfEmploymentPct,
            avgMonthlySalary: econ.avgMonthlySalary,
          },
        })
      : null;

    out.push({
      slug: peer.slug,
      name: peer.name,
      iso2: peer.iso2,
      continent: peer.continent,
      role: peer.role,
      score: scored ? scored.score : null,
      band: scored ? scored.band : null,
    });
  }

  return out;
}
