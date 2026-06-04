/**
 * src/lib/scores/geo_verdict.ts
 *
 * The place-level opinionated read (bible Section 5, the City page row: "Best
 * and hardest businesses in [city]", whose distinctive move is to use the
 * actual economic modules rather than a listicle).
 *
 * This is the city/region-altitude sibling of the cell-page verdict
 * (src/lib/scores/verdict.ts), the country verdict
 * (src/lib/scores/country_verdict.ts), and the industry verdict
 * (src/lib/scores/industry_verdict.ts). Same voice, straight from the bible
 * (Section 25): blunt, practical, skeptical of easy money. The hard rule holds,
 * never frame a place as easy money without naming the kind of business that
 * gets punished there.
 *
 * It invents NO numbers. It reads only what the geo page already loads (the
 * densest local activities and the typical revenue each one turns over) joined
 * with the curated, cross-country-stable margin shape per activity (the same
 * src/lib/finance/industry_margins.json the industry page uses). The single
 * derived signal is "what reaches the owner", typical revenue multiplied by the
 * activity's net margin: two values the system already holds, combined, never a
 * fabricated figure. It is reported qualitatively (a one-word read and a short
 * clause), never as fake-precise money, per the bible's anti-fake-precision
 * rule.
 *
 * Every clause and entry self-omits when its input is missing, so a thinly
 * covered place degrades to a short, honest paragraph instead of a fabricated
 * one. The caller mounts the lede only when there is real signal.
 *
 * Pure module: no Supabase, no other domain modules at runtime. Trivially
 * testable, and it cannot trip the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */

/** Direction for tone: a higher-keep read leans moss, a thin one clay. */
export type GeoEntryTone = "good" | "flat" | "bad";

/**
 * One activity in the local mix, already joined to its curated margin shape by
 * the page. Revenue is what the typical firm turns over; the margins are the
 * stable structural ratios for the activity, not place-specific.
 */
export interface GeoActivityInput {
  industryId: string;
  name: string;
  /** Typical (median) annual revenue per firm in the display currency, or null. */
  typicalRevenue: number | null;
  /** Net margin as a share (0.12 = 12%), curated and cross-country-stable, or null. */
  netMargin: number | null;
  /** Gross margin as a share, or null. Used only to colour the "why" clause. */
  grossMargin?: number | null;
  /** Gross fixed assets per dollar of revenue (0.9 = heavy), or null. */
  assetIntensity?: number | null;
}

export interface GeoVerdictInput {
  /** Display label for the place (city or region), e.g. "Lisbon". */
  placeLabel: string;
  /** The densest local activities, in the order the page already ranked them. */
  activities: GeoActivityInput[];
}

/**
 * A single best-or-hardest entry. Carries enough for the component to render a
 * link and a one-line read without re-deriving anything.
 */
export interface GeoActivityRead {
  industryId: string;
  name: string;
  /** One qualitative word for how much survives to the owner: healthy / workable / thin. */
  keepWord: string;
  tone: GeoEntryTone;
  /** One short clause of plain-language reason. No em-dash, no source names. */
  why: string;
}

export interface GeoVerdict {
  /**
   * Two or three sentences: which kinds of business tend to work in this place
   * and which are hard, and why (revenue depth against the margin structure).
   */
  lead: string;
  /** Closing line: the blunt condition under which a business works here. */
  close: string;
  /** The strongest-keeping activities in the local mix (may be empty). */
  best: GeoActivityRead[];
  /** The thinnest-keeping activities in the local mix (may be empty). */
  hardest: GeoActivityRead[];
}

// ----------------------------------------------------------------------------
// small helpers
// ----------------------------------------------------------------------------

function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/**
 * Lowercase the first letter so a name reads inside a sentence, but leave
 * acronyms intact: "HVAC services" and "IT services" must not become "hVAC"
 * or "iT". If the first two characters are both uppercase, treat the leading
 * token as an acronym and return the name unchanged.
 */
function lower(s: string): string {
  if (s.length >= 2 && s[0] === s[0].toUpperCase() && s[1] === s[1].toUpperCase()) {
    return s;
  }
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * The keep-word reads the activity's net margin through the same bands the
 * industry verdict uses, so the word here matches the word there. Net margin
 * is the share of revenue that survives to the owner, the one honest,
 * cross-place-stable measure of how hard a business is to make pay.
 */
function keepWord(net: number): { word: string; tone: GeoEntryTone } {
  if (net >= 0.15) return { word: "healthy", tone: "good" };
  if (net >= 0.08) return { word: "workable", tone: "flat" };
  return { word: "thin", tone: "bad" };
}

/**
 * The "why" clause for a strong activity. The net margin is the headline; the
 * structural reason it holds up (light capital, fat gross) is added only when
 * it is genuinely the standout, so the clauses do not all read the same.
 */
function strongWhy(a: GeoActivityInput, net: number): string {
  const keepPct = Math.round(net * 100);
  if (isNum(a.assetIntensity) && a.assetIntensity < 0.4) {
    return `keeps about ${keepPct}% of revenue and needs little money up front, so the cash goes into running it, not building it`;
  }
  if (isNum(a.grossMargin) && a.grossMargin >= 0.6) {
    return `keeps about ${keepPct}% of revenue, helped by a gross margin fat enough to survive the direct costs`;
  }
  return `keeps about ${keepPct}% of revenue in a typical year, which leaves real room for an owner`;
}

/**
 * The "why" clause for a hard activity: name the thing that eats the upside.
 * Thin net margin is the headline; heavy capital and low gross sharpen it.
 */
function hardWhy(a: GeoActivityInput, net: number): string {
  const keepPct = Math.round(net * 100);
  if (isNum(a.assetIntensity) && a.assetIntensity >= 0.9) {
    return `keeps only about ${keepPct}% of revenue and ties up real money on the floor, so a slow stretch hurts fast`;
  }
  if (isNum(a.grossMargin) && a.grossMargin < 0.4) {
    return `keeps only about ${keepPct}% of revenue because the inputs eat most of each sale before rent and wages`;
  }
  return `keeps only about ${keepPct}% of revenue, so rent, wages, or one bad call can erase the year`;
}

function toRead(a: GeoActivityInput, kind: "best" | "hardest"): GeoActivityRead | null {
  if (!isNum(a.netMargin)) return null;
  const { word, tone } = keepWord(a.netMargin);
  const why = kind === "best" ? strongWhy(a, a.netMargin) : hardWhy(a, a.netMargin);
  return { industryId: a.industryId, name: a.name, keepWord: word, tone, why };
}

// ----------------------------------------------------------------------------
// public entry point
// ----------------------------------------------------------------------------

export function generateGeoVerdict(input: GeoVerdictInput): GeoVerdict {
  const { placeLabel, activities } = input;

  // Keep only activities we can actually rank: both a typical revenue (so we
  // know this activity really shows up in the local mix) and a curated net
  // margin (the share that survives to the owner). Net margin is the honest,
  // cross-place-stable ordering key: it is the one number that says how hard
  // each business is to make pay, and it is exactly the number we display, so
  // the columns and the prose never contradict each other. Revenue here is the
  // typical top line, which is not the same as what an owner keeps; ranking on
  // it would reward whichever activity simply turns over more money.
  const scored = activities.filter(
    (a) => isNum(a.typicalRevenue) && isNum(a.netMargin),
  );

  // Best = healthiest margin first; hardest = thinnest first. We only call out
  // a contrast when the local mix has enough distinct activities to make it
  // meaningful (at least four), and we never overlap the two lists.
  const byMarginDesc = [...scored].sort(
    (x, y) => (y.netMargin as number) - (x.netMargin as number),
  );
  const enoughForContrast = byMarginDesc.length >= 4;

  let best: GeoActivityRead[] = [];
  let hardest: GeoActivityRead[] = [];
  if (enoughForContrast) {
    const topN = Math.min(3, Math.floor(byMarginDesc.length / 2));
    best = byMarginDesc
      .slice(0, topN)
      .map((a) => toRead(a, "best"))
      .filter((r): r is GeoActivityRead => r != null);
    hardest = byMarginDesc
      .slice(-topN)
      .reverse() // thinnest first
      .map((a) => toRead(a, "hardest"))
      .filter((r): r is GeoActivityRead => r != null);
  }

  // --- lead: which kinds of business tend to work here, and which are hard ---
  // The headline contrast only earns its words when the two ends are genuinely
  // different: at least a few points of margin between the best and the worst.
  // Otherwise it is the same business read twice, so we drop to a single read.
  const bestHead = best[0];
  const hardHead = hardest[0];
  const headGap =
    bestHead && hardHead
      ? (byMarginDesc[0].netMargin as number) -
        (byMarginDesc[byMarginDesc.length - 1].netMargin as number)
      : 0;
  const realContrast =
    bestHead != null &&
    hardHead != null &&
    bestHead.industryId !== hardHead.industryId &&
    headGap >= 0.05;

  const sentences: string[] = [];
  if (realContrast) {
    sentences.push(
      `Of the businesses that crowd the local mix, ${lower(
        bestHead!.name,
      )} keeps the most of what comes in: it ${bestHead!.why}.`,
    );
    sentences.push(
      `${hardHead!.name} is the harder way to make a living here: it ${hardHead!.why}.`,
    );
    sentences.push(
      `That gap is the point. Two businesses on the same street can turn over similar money and hand the owner very different pay once the cost stack lands, so read each one for the margin, not the top line.`,
    );
  } else if (bestHead) {
    sentences.push(
      `Across the local mix, the share that actually reaches an owner is the thing to watch, not the top line.`,
    );
    sentences.push(
      `${bestHead.name} keeps more of it than most: it ${bestHead.why}.`,
    );
  }

  const lead =
    sentences.length > 0
      ? sentences.join(" ")
      : `Coverage for ${placeLabel} is still thin on the cost side. Use the activities below as a starting point, and open any one for the numbers that exist.`;

  // --- close: the blunt condition under which a business works here ---
  let close: string;
  if (best.length > 0 && hardest.length > 0) {
    close = `None of this is automatic. The same activity rewards a disciplined operator on a sensible rent and quietly punishes one who overpays for the lease or lets a cost line drift. Pick the business for the margin you can hold, not the revenue you can imagine.`;
  } else if (best.length > 0) {
    close = `Treat the strong-looking activity as a starting point, not a guarantee. The operator and the address still decide whether it clears a wage.`;
  } else {
    close = `Open a specific activity for the cost stack and the typical revenue that exist. The place sets the conditions; the operator decides the outcome.`;
  }

  return { lead, close, best, hardest };
}
