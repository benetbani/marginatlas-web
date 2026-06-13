/**
 * neighborhood_overview_view.ts - the neighbourhood-landing view model.
 *
 * Maps a resolved (city, neighbourhood) plus its multiplier ranking, flavor,
 * intensity row, and sibling districts into the Atlas Page Kit's section props,
 * in the neighbourhood content-map reading order:
 *
 *   1. Hero / answer-first  (the single strongest trade, said up top)
 *   2. The honest take       (this is a modeled local read, scoped to one city)
 *   3. What thrives here      (the trade ranking, vs the city)
 *   4. Who lives and shops here (the loaded-but-unused demographic skew)
 *   5. How pricey to operate   (rent vs city, self-omitting)
 *   6. Adjacent districts       (like-for-like vs the neighbouring areas)
 *
 * Pure data, no React, so the page stays a thin renderer. The page keeps the
 * heavy data wiring (the multiplier engine calls, the flavor + economics loads)
 * and hands the resolved figures in.
 *
 * The London contract (founder): a curated London neighbourhood fills every
 * section the data supports, leaning on the rich flavor + intensity rows it
 * carries. Everywhere else: real modeled figures where they exist, honest
 * self-omit otherwise. Never a fabricated number, never a wall of dashes.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import type { NeighborhoodTag } from "@/lib/economics/neighborhood_multipliers";
import type { NeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";
import type { LikeForLikeColumn, LikeForLikeRow } from "@/components/kit";

/* ------------------------------ inputs ---------------------------------- */

/** One trade's modeled lift versus the city baseline, plus its cell link. */
export type RankedActivity = {
  id: string;
  name: string;
  /** Final revenue multiplier vs the city baseline (finite). */
  final: number;
  /** Resolved taxonomy cell slug, or null when it does not resolve. */
  cellSlug: string | null;
};

/** A sibling district, with its own lift for the representative trade. */
export type SiblingArea = {
  slug: string;
  name: string;
  character: string;
  /** Final multiplier for the representative trade here, or null if uncurated. */
  repFinal: number | null;
  /** Primary tag of the sibling, for the like-for-like character row. */
  primaryTag: NeighborhoodTag | null;
};

export type NeighborhoodOverviewInput = {
  cityName: string;
  neighborhoodName: string;
  /** The trade ranking for THIS area, already sorted winners-first. */
  ranked: RankedActivity[];
  /** The representative-trade breakdown (commuter / tourism / tags components). */
  rep: { commuter: number; tourism: number; tags: number; final: number };
  /** Display name of the representative trade (e.g. "restaurants"). */
  repName: string;
  /** The neighbourhood flavor row, or undefined when not curated. */
  flavor: NeighborhoodFlavor | undefined;
  /** Primary local-economics tag, or undefined when uncurated. */
  primaryTag: NeighborhoodTag | undefined;
  /** Composed rent multiplier vs the city (1.0 = neutral / unknown). */
  rentMult: number;
  /** Sibling districts of the same city (for the adjacent-area comparison). */
  siblings: SiblingArea[];
  /** True when this area carries a curated intensity row (vs city defaults). */
  isCurated: boolean;
};

/* ------------------------------ output ---------------------------------- */

export type NeighborhoodOverviewView = {
  /** The single strongest trade phrased for the headline, or null at par. */
  winnerHeadline: string | null;
  /** The lead character paragraph, or null. */
  leadLine: string | null;
  honestTake: { verdict: string; points: string[]; body: string | null } | null;
  /** "Who lives and shops here": the demographic skew, made into a beat. */
  whoLivesHere: { heading: string; notes: string[] } | null;
  /** Rent / price-tier read, or null when there is no honest signal. */
  operatingCost: { headline: string; detail: string | null } | null;
  /** Adjacent-district like-for-like table, or null when no siblings carry data. */
  adjacent: {
    columns: LikeForLikeColumn[];
    rows: LikeForLikeRow[];
    footnote: string;
  } | null;
};

/* ------------------------------ helpers --------------------------------- */

function pctLabel(final: number): string {
  const pct = Math.round((final - 1) * 100);
  if (pct === 0) return "par";
  // The underlying multiplier is clamped to a sane band (about 0.4x to 3.0x), so
  // many strong trades pin to the +200% ceiling. Printing an identical exact
  // "+200%" for half a dozen trades reads as fabricated; at the rails we show an
  // honest "2x or more" / "less than half" band instead of a false-precise number.
  if (pct >= 195) return "2x or more";
  if (pct <= -58) return "less than half";
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

/** A short human phrase for what the catchment runs on, keyed off the tag. */
function catchmentPhrase(primary: NeighborhoodTag | undefined): string {
  switch (primary) {
    case "financial_cbd":
    case "free_economic_zone":
    case "tech_corridor":
      return "weekday commuters and office workers";
    case "tourist_zone":
    case "religious_pilgrimage":
      return "visitors";
    case "university_district":
      return "students";
    case "nightlife_zone":
      return "the evening and night crowd";
    case "residential_only":
      return "local residents";
    case "medical_cluster":
      return "hospital and clinic traffic";
    case "transit_hub":
      return "passing footfall";
    case "industrial_park":
      return "the daytime workforce";
    case "luxury_district":
      return "high spenders and old money";
    default:
      return "a mixed local catchment";
  }
}

/* ------------------------------ builder --------------------------------- */

export function buildNeighborhoodOverviewView(
  input: NeighborhoodOverviewInput,
): NeighborhoodOverviewView {
  const {
    cityName,
    neighborhoodName,
    ranked,
    rep,
    repName,
    flavor,
    primaryTag,
    rentMult,
    siblings,
  } = input;

  const topWinner = ranked[0];
  const worst = ranked[ranked.length - 1];

  /* -- answer-first headline --------------------------------------------- */
  const winnerHeadline =
    topWinner && Math.round((topWinner.final - 1) * 100) !== 0
      ? `${topWinner.name} earn about ${pctLabel(
          topWinner.final,
        )} versus the rest of ${cityName} here.`
      : null;

  const leadLine = flavor?.character_paragraph || null;

  /* -- honest take ------------------------------------------------------- */
  // The through-line: this is a modeled local lift scoped to ONE city, not a
  // measured count, and the catchment is what really decides which trade wins.
  const honestPoints: string[] = [];
  honestPoints.push(
    `The pull here is ${catchmentPhrase(
      primaryTag,
    )}, which is why some trades lift and others get squeezed.`,
  );
  if (
    topWinner &&
    worst &&
    topWinner.id !== worst.id &&
    Math.round((topWinner.final - 1) * 100) !== 0
  ) {
    honestPoints.push(
      `The same trade can read very differently a few streets over, so a ${neighborhoodName} read is not a ${cityName} read.`,
    );
  }
  if (rentMult > 1.1) {
    honestPoints.push(
      "A revenue lift here is not a profit lift: the rent that buys the footfall takes much of it back.",
    );
  }
  const honestTake = {
    verdict: `Treat this as a read on ${neighborhoodName} specifically, not the city average.`,
    points: honestPoints.slice(0, 3),
    body: "These figures are modeled from the area's commuter and visitor intensity and its local character, set against the city baseline. The shape (which trades lift, which get squeezed) is the useful part; read the exact percentages as directional.",
  };

  /* -- who lives and shops here ------------------------------------------ */
  // Render the loaded-but-previously-unused demographic_skew, plus the food
  // scene and don't-miss when present, as a short "who the customer is" beat.
  const whoNotes: string[] = [];
  if (flavor?.demographic_skew) {
    const skew = flavor.demographic_skew.trim();
    whoNotes.push(
      `The make-up here skews toward ${skew.charAt(0).toLowerCase()}${skew.slice(1)}.`,
    );
  }
  if (flavor?.food_scene) {
    whoNotes.push(`What they eat: ${flavor.food_scene}`);
  }
  if (flavor?.signature_businesses?.length) {
    whoNotes.push(
      `What already works: ${flavor.signature_businesses
        .slice(0, 5)
        .join(", ")}.`,
    );
  }
  const whoLivesHere =
    whoNotes.length > 0
      ? { heading: "Who lives and shops here", notes: whoNotes }
      : null;

  /* -- operating cost (rent / price tier), honest self-omit -------------- */
  const rentPct = Math.round((rentMult - 1) * 100);
  let operatingCost: NeighborhoodOverviewView["operatingCost"] = null;
  if (rentPct !== 0) {
    const tierClause = flavor?.price_tier
      ? ` It reads as a ${flavor.price_tier} area to operate in.`
      : "";
    operatingCost = {
      headline: `Commercial rent runs about ${pctLabel(
        rentMult,
      )} versus the rest of ${cityName}.`,
      detail:
        (rentPct > 0
          ? "Budget for the premium before the revenue lift talks you into the site: the two rarely move at the same pace."
          : "The lower rent is the quiet advantage here, as long as the footfall is enough to fill the room.") +
        tierClause,
    };
  } else if (flavor?.price_tier) {
    // No honest rent signal, but the curated price tier is still a real read.
    operatingCost = {
      headline: `${neighborhoodName} reads as a ${flavor.price_tier} area to operate in.`,
      detail: null,
    };
  }

  /* -- adjacent districts (like-for-like) -------------------------------- */
  // The big gap: a real comparison of THIS area against the ones next to it,
  // on the representative trade's lift and on character. One city, one trade,
  // so the leader mark is allowed (same price regime, unlike cross-country).
  const adjacent = buildAdjacent(input);

  return {
    winnerHeadline,
    leadLine,
    honestTake,
    whoLivesHere,
    operatingCost,
    adjacent,
  };
}

/**
 * The sticky-nav sections, in reading order.
 *
 * The five NUMBERED content-map sections (thrives, who, operating-cost,
 * adjacent, businesses-here) are ALWAYS listed: they always render now, as
 * content or a calm SectionEmpty, so they are always real anchors. The honest
 * take is a brand beat and the streets / ground zones are curated flourishes
 * that still self-omit, so they stay conditional. StickySectionNav drops any
 * dead anchor on mount, so a listed-but-absent flourish is harmless.
 */
export function neighborhoodOverviewNav(
  view: NeighborhoodOverviewView,
  hasStreets: boolean,
  hasTexture: boolean,
): Array<{ id: string; label: string }> {
  const nav: Array<{ id: string; label: string }> = [
    { id: "headline", label: "Overview" },
  ];
  if (view.honestTake) nav.push({ id: "honest-take", label: "The honest take" });
  nav.push({ id: "thrives", label: "What thrives here" });
  nav.push({ id: "who", label: "Who shops here" });
  nav.push({ id: "operating-cost", label: "Cost to operate" });
  nav.push({ id: "adjacent", label: "Vs nearby areas" });
  if (hasStreets) nav.push({ id: "streets", label: "Prime streets" });
  if (hasTexture) nav.push({ id: "ground", label: "On the ground" });
  nav.push({ id: "businesses-here", label: "The businesses here" });
  return nav;
}

/* --------------------------- adjacent table ----------------------------- */

const TAG_CHARACTER_LABEL: Partial<Record<NeighborhoodTag, string>> = {
  financial_cbd: "Office and finance",
  tourist_zone: "Tourist trade",
  luxury_district: "Luxury and old money",
  free_economic_zone: "Free zone",
  university_district: "Student-led",
  industrial_park: "Industrial",
  tech_corridor: "Tech and creative",
  embassy_quarter: "Diplomatic and affluent",
  medical_cluster: "Hospital-led",
  transit_hub: "Transit footfall",
  gentrifying_edge: "Gentrifying",
  nightlife_zone: "Nightlife-led",
  religious_pilgrimage: "Pilgrimage",
  residential_only: "Residential",
};

function buildAdjacent(
  input: NeighborhoodOverviewInput,
): NeighborhoodOverviewView["adjacent"] {
  const { neighborhoodName, repName, rep, primaryTag, siblings } = input;

  // Only siblings that carry a curated lift can join the comparison honestly.
  const usable = siblings.filter((s) => s.repFinal != null).slice(0, 3);
  if (usable.length < 1) return null;

  // This area is always the first column.
  const cols: LikeForLikeColumn[] = [
    { key: "self", label: neighborhoodName },
    ...usable.map((s) => ({ key: s.slug, label: s.name })),
  ];

  const liftCells: Record<string, string> = { self: pctLabel(rep.final) };
  const liftMetric: Record<string, number> = { self: rep.final };
  const charCells: Record<string, string> = {
    self: primaryTag ? TAG_CHARACTER_LABEL[primaryTag] ?? "Mixed" : "Mixed",
  };
  for (const s of usable) {
    liftCells[s.slug] = pctLabel(s.repFinal as number);
    liftMetric[s.slug] = s.repFinal as number;
    charCells[s.slug] = s.primaryTag
      ? TAG_CHARACTER_LABEL[s.primaryTag] ?? "Mixed"
      : "Mixed";
  }

  const rows: LikeForLikeRow[] = [
    {
      label: `${repName} revenue vs city`,
      hint: "the representative trade",
      cells: liftCells,
      metric: liftMetric,
    },
    {
      label: "Area character",
      cells: charCells,
    },
  ];

  return {
    columns: cols,
    rows,
    footnote: `Lift is modeled against the city baseline for the same trade; where one area clearly leads it is marked. Character is the area's dominant pull.`,
  };
}
