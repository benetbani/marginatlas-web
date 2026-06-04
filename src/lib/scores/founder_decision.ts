/**
 * src/lib/scores/founder_decision.ts
 *
 * The founder-decision read for the /decide index (bible Section 21, the
 * Business Opportunity Framework: "What business should I start in this city?",
 * and Section 5, the "Best businesses to start" row whose distinctive move is
 * to split by the founder's real constraint, low capital / lifestyle / B2B,
 * rather than print one SEO listicle).
 *
 * This is the index-altitude sibling of the cell-page verdict
 * (src/lib/scores/verdict.ts) and the place-level read
 * (src/lib/scores/geo_verdict.ts). Same voice, straight from the bible
 * (Section 25): blunt, practical, skeptical of easy money. The hard rule holds,
 * never frame a kind of business as easy money without naming the kind that
 * gets punished.
 *
 * It invents NO numbers and reads NO per-place data. The /decide index has no
 * city or instance loaded yet, so this module reasons over exactly what that
 * page already holds: the catalogue of activities a founder can pick, joined to
 * the curated, cross-country-stable margin shape per activity (the same
 * src/lib/finance/industry_margins.json the entity and decision pages use). The
 * single ordering signal is net margin, the share of revenue that survives to
 * an owner, which is the one honest, place-independent measure of how hard a
 * business is to make pay. It is reported qualitatively (a one-word keep read
 * and a short clause), never as fake-precise money, per the anti-fake-precision
 * rule.
 *
 * Every entry self-omits when its margin input is missing, and the whole read
 * degrades to a short honest paragraph if the catalogue join is too thin to
 * contrast. The caller mounts the contrast only when there is real signal.
 *
 * Pure module: no Supabase, no other domain modules at runtime. Trivially
 * testable, and it cannot trip the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */

/** Direction for tone: a higher-keep read leans moss, a thin one clay. */
export type FounderEntryTone = "good" | "flat" | "bad";

/**
 * One activity a founder can choose, already joined to its curated margin
 * shape by the page. The margins are the stable structural ratios for the
 * activity, not place-specific.
 */
export interface FounderActivityInput {
  /** Industry id, e.g. "restaurants". */
  industryId: string;
  /** Display name, e.g. "Restaurants". */
  name: string;
  /** URL slug the /decide form and links use, e.g. "restaurants". */
  slug: string;
  /** Net margin as a share (0.12 = 12%), curated and cross-country-stable, or null. */
  netMargin: number | null;
  /** Gross margin as a share, or null. Colours the "why" clause only. */
  grossMargin?: number | null;
  /** Gross fixed assets per dollar of revenue (0.9 = heavy), or null. */
  assetIntensity?: number | null;
}

export interface FounderDecisionInput {
  activities: FounderActivityInput[];
}

/**
 * A single best-or-hardest entry. Carries enough for the component to render a
 * link and a one-line read without re-deriving anything.
 */
export interface FounderActivityRead {
  industryId: string;
  name: string;
  slug: string;
  /** One qualitative word for how much survives to the owner: healthy / workable / thin. */
  keepWord: string;
  tone: FounderEntryTone;
  /** Short tag for the constraint this entry speaks to (e.g. "Light to start"). */
  note: string;
  /** One short clause of plain-language reason. No em-dash, no source names. */
  why: string;
}

export interface FounderDecision {
  /**
   * Two or three sentences: that the founder decision is which business, not
   * just where, and that the catalogue average is not the answer because net
   * margin (what reaches an owner) swings hard across activities.
   */
  lead: string;
  /** Closing line: the blunt condition, the operator and the address decide. */
  close: string;
  /** The strongest-keeping activities a founder can pick (may be empty). */
  best: FounderActivityRead[];
  /** The thinnest-keeping activities a founder can pick (may be empty). */
  hardest: FounderActivityRead[];
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
 * The keep-word reads net margin through the same bands the industry and
 * place verdicts use, so the word here matches the word there.
 */
function keepWord(net: number): { word: string; tone: FounderEntryTone } {
  if (net >= 0.15) return { word: "healthy", tone: "good" };
  if (net >= 0.08) return { word: "workable", tone: "flat" };
  return { word: "thin", tone: "bad" };
}

/** A short constraint tag, the founder's real filter from the bible's variants. */
function strongNote(a: FounderActivityInput): string {
  if (isNum(a.assetIntensity) && a.assetIntensity <= 0.15) return "Light to start";
  if (isNum(a.grossMargin) && a.grossMargin >= 0.6) return "Fat gross margin";
  return "Leaves room for an owner";
}

function hardNote(a: FounderActivityInput): string {
  if (isNum(a.assetIntensity) && a.assetIntensity >= 0.6) return "Money on the floor";
  if (isNum(a.grossMargin) && a.grossMargin < 0.4) return "Inputs eat the sale";
  return "Thin on the bottom line";
}

/**
 * The "why" clause for a strong activity. Net margin is the headline; the
 * structural reason it holds (light capital, fat gross) is added only when it
 * is genuinely the standout, so the clauses do not all read the same.
 */
function strongWhy(a: FounderActivityInput, net: number): string {
  const keepPct = Math.round(net * 100);
  if (isNum(a.assetIntensity) && a.assetIntensity <= 0.15) {
    return `keeps about ${keepPct}% of revenue and needs little money up front, so a founder is buying a living, not a fit-out`;
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
function hardWhy(a: FounderActivityInput, net: number): string {
  const keepPct = Math.round(net * 100);
  if (isNum(a.assetIntensity) && a.assetIntensity >= 0.6) {
    return `keeps only about ${keepPct}% of revenue and ties up real money before the first sale, so the payback is slow and a quiet stretch hurts`;
  }
  if (isNum(a.grossMargin) && a.grossMargin < 0.4) {
    return `keeps only about ${keepPct}% of revenue because the inputs eat most of each sale before rent and wages`;
  }
  return `keeps only about ${keepPct}% of revenue, so rent, wages, or one bad month can erase the year`;
}

function toRead(
  a: FounderActivityInput,
  kind: "best" | "hardest",
): FounderActivityRead | null {
  if (!isNum(a.netMargin)) return null;
  const { word, tone } = keepWord(a.netMargin);
  const note = kind === "best" ? strongNote(a) : hardNote(a);
  const why = kind === "best" ? strongWhy(a, a.netMargin) : hardWhy(a, a.netMargin);
  return { industryId: a.industryId, name: a.name, slug: a.slug, keepWord: word, tone, note, why };
}

/**
 * De-duplicate near-identical reads. Several sole-practitioner professional
 * services sit at the very top with the same margin and the same clause, which
 * would read as a list of synonyms. Keep at most one per (keepWord + note +
 * rounded-margin) signature so the column shows genuinely distinct businesses.
 */
function dedupe(reads: FounderActivityRead[], netOf: (id: string) => number): FounderActivityRead[] {
  const seen = new Set<string>();
  const out: FounderActivityRead[] = [];
  for (const r of reads) {
    const sig = `${r.keepWord}|${r.note}|${Math.round(netOf(r.industryId) * 100)}`;
    if (seen.has(sig)) continue;
    seen.add(sig);
    out.push(r);
  }
  return out;
}

// ----------------------------------------------------------------------------
// public entry point
// ----------------------------------------------------------------------------

export function generateFounderDecision(input: FounderDecisionInput): FounderDecision {
  // Keep only activities we can actually rank: a curated net margin (the share
  // that survives to the owner). Net margin is the honest, place-independent
  // ordering key, and it is exactly what the clauses quote, so the columns and
  // the prose never contradict each other.
  const scored = input.activities.filter((a) => isNum(a.netMargin));
  const netOf = (id: string): number =>
    scored.find((a) => a.industryId === id)?.netMargin ?? 0;

  const byMarginDesc = [...scored].sort(
    (x, y) => (y.netMargin as number) - (x.netMargin as number),
  );
  // The index only earns a contrast when the catalogue is genuinely broad.
  const enoughForContrast = byMarginDesc.length >= 12;

  let best: FounderActivityRead[] = [];
  let hardest: FounderActivityRead[] = [];
  if (enoughForContrast) {
    best = dedupe(
      byMarginDesc
        .slice(0, 12)
        .map((a) => toRead(a, "best"))
        .filter((r): r is FounderActivityRead => r != null),
      netOf,
    ).slice(0, 4);
    hardest = dedupe(
      byMarginDesc
        .slice(-12)
        .reverse() // thinnest first
        .map((a) => toRead(a, "hardest"))
        .filter((r): r is FounderActivityRead => r != null),
      netOf,
    ).slice(0, 4);
  }

  // --- lead: the founder decision is which business, and the average is not
  // the answer because the keep swings hard across the catalogue. ---
  const bestHead = best[0];
  const hardHead = hardest[0];
  const realContrast =
    bestHead != null &&
    hardHead != null &&
    bestHead.industryId !== hardHead.industryId &&
    (byMarginDesc[0].netMargin as number) -
      (byMarginDesc[byMarginDesc.length - 1].netMargin as number) >=
      0.05;

  const sentences: string[] = [];
  if (realContrast) {
    sentences.push(
      `Pick the city and the map below ranks its neighborhoods. The harder half of the decision is which business, and there the average across these activities is not the answer.`,
    );
    sentences.push(
      `${bestHead!.name} ${bestHead!.why}. ${hardHead!.name} ${hardHead!.why}.`,
    );
    sentences.push(
      `Same effort, very different pay once the cost stack lands. Read each activity for what reaches an owner, not the revenue you can picture.`,
    );
  } else if (bestHead) {
    sentences.push(
      `Pick the city and the map below ranks its neighborhoods. The harder half of the decision is which business, and there the share that actually reaches an owner is the thing to watch, not the top line.`,
    );
    sentences.push(`${bestHead.name} keeps more of it than most: it ${bestHead.why}.`);
  } else {
    sentences.push(
      `Pick an activity and a city, and the map below ranks the city's neighborhoods by what is left after rent. The average across activities is not the answer: read each one for what reaches an owner, not the revenue you can picture.`,
    );
  }
  const lead = sentences.join(" ");

  // --- close: the blunt condition, the operator and the address decide ---
  const close =
    best.length > 0 && hardest.length > 0
      ? `None of this is automatic. A healthy-looking activity still rewards a disciplined operator on a sensible rent and quietly punishes one who overpays for the lease. The catalogue narrows the field; the operator and the address decide the outcome.`
      : `Treat any strong-looking activity as a starting point, not a guarantee. The operator and the address still decide whether it clears a wage.`;

  return { lead, close, best, hardest };
}
