/**
 * src/lib/scores/industry_verdict.ts
 *
 * The activity-level business-model read (bible Section 5, the Industry page
 * row: "How [industry] businesses make money", whose distinctive move is to
 * show the "business model anatomy"). This is the industry-altitude sibling of
 * the cell-page verdict (src/lib/scores/verdict.ts) and the country verdict
 * (src/lib/scores/country_verdict.ts).
 *
 * Same voice, straight from the bible (Section 25): blunt, practical,
 * skeptical of easy money. The hard rule holds, never frame a business as easy
 * money without naming what gets in the way and what kills weak operators.
 *
 * It invents NO numbers. It only reads the curated margin structure the
 * industry page already loads (gross, operating, net, and asset intensity, all
 * cross-country-stable ratios) and restates where each dollar actually goes.
 * The industry page carries no per-place revenue, so this module deliberately
 * speaks in structure and ratios, not in money. Every clause self-omits when
 * its input is missing, so a thinly-described activity degrades to a short,
 * honest read instead of a fabricated one.
 *
 * Pure module: no Supabase, no other domain modules at runtime. Trivially
 * testable, and it cannot trip the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */

export interface IndustryMarginShape {
  /** Gross margin as a share (0.42 = 42%), or null. */
  grossMargin: number | null;
  /** Operating margin as a share, before fixed costs and tax, or null. */
  operatingMargin: number | null;
  /** Net margin as a share, after the lot, or null. */
  netMargin: number | null;
  /** Gross fixed assets per dollar of revenue (0.3 = light), or null. */
  assetIntensity?: number | null;
}

export interface IndustryVerdictInput {
  industryName: string;
  margins: IndustryMarginShape;
  /**
   * What separates the strong operators, and what quietly kills the weak ones,
   * lifted from the activity-character library when one is written. Optional:
   * the verdict reads fine without it.
   */
  edge?: string | null;
  watchOut?: string | null;
}

/** Direction for tone: a low-cost-pressure read leans moss, a heavy one clay. */
export type IndustrySignalTone = "good" | "flat" | "bad";

export interface IndustrySignal {
  /** What the reader is looking at (e.g. "Input cost load"). */
  label: string;
  /** Qualitative word (e.g. "heavy", "light", "thin"). */
  word: string;
  tone: IndustrySignalTone;
  /** One short clause of meaning. Constraint-safe: no em-dash, no source names. */
  note: string;
}

export interface IndustryVerdict {
  /** Short, declarative read of how this business model actually makes money. */
  headline: string;
  /**
   * Two or three sentences tracing the money: what survives direct costs, what
   * the day-to-day overhead leaves, and what the owner is really steering.
   */
  lead: string;
  /** Closing line: what keeps weak operators from holding the margin. */
  close: string;
  /** The anatomy readout: the cost stages, each as a qualitative word. */
  signals: IndustrySignal[];
}

// ----------------------------------------------------------------------------
// small helpers
// ----------------------------------------------------------------------------

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pctWord(share: number): string {
  return `${Math.round(share * 100)}%`;
}

function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/** Strip a trailing period so a borrowed sentence can be re-punctuated. */
function clause(sentence: string): string {
  return sentence.trim().replace(/[.\s]+$/, "");
}

/** Lowercase the first letter so a borrowed sentence reads inside a clause. */
function lower(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// ----------------------------------------------------------------------------
// the three cost stages, each read into a qualitative word + tone
// ----------------------------------------------------------------------------

/**
 * Direct-cost load is the inverse of gross margin. A low gross margin means
 * inputs (materials, food, stock, direct labour) eat most of every sale before
 * anything else, which is a structurally harder business to run.
 */
function inputLoadSignal(gross: number | null): IndustrySignal | null {
  if (!isNum(gross)) return null;
  const load = 1 - gross; // share of revenue consumed by direct costs
  let word: string;
  let tone: IndustrySignalTone;
  let note: string;
  if (load >= 0.62) {
    word = "heavy";
    tone = "bad";
    note = `Direct costs take about ${pctWord(load)} of every sale, so there is little to play with from the start.`;
  } else if (load >= 0.45) {
    word = "meaningful";
    tone = "flat";
    note = `Direct costs run near ${pctWord(load)} of revenue, a normal load that still has to be watched.`;
  } else {
    word = "light";
    tone = "good";
    note = `Direct costs are light, near ${pctWord(load)} of revenue, so most of each sale survives the first cut.`;
  }
  return { label: "Input cost load", word, tone, note };
}

/**
 * Operating overhead is the gap between gross and operating margin: the
 * day-to-day running cost (staff, marketing, admin) before fixed costs and
 * tax. A wide gap means the business is overhead-hungry to keep the doors open.
 */
function overheadSignal(
  gross: number | null,
  operating: number | null,
): IndustrySignal | null {
  if (!isNum(gross) || !isNum(operating)) return null;
  const overhead = Math.max(0, gross - operating); // share of revenue
  let word: string;
  let tone: IndustrySignalTone;
  let note: string;
  if (overhead >= 0.34) {
    word = "high";
    tone = "bad";
    note = `Running the place eats roughly another ${pctWord(overhead)} of revenue before fixed costs, so volume has to carry it.`;
  } else if (overhead >= 0.2) {
    word = "moderate";
    tone = "flat";
    note = `Day-to-day overhead takes about ${pctWord(overhead)} more of revenue, the usual cost of keeping the doors open.`;
  } else {
    word = "lean";
    tone = "good";
    note = `Overhead is lean, near ${pctWord(overhead)} of revenue, so the gross margin mostly carries through.`;
  }
  return { label: "Operating overhead", word, tone, note };
}

/**
 * Capital intensity reads asset_intensity (fixed assets per dollar of
 * revenue). High intensity means the model needs real money on the floor
 * before it earns a cent, which raises the entry bar and the downside.
 */
function capitalSignal(assetIntensity: number | null | undefined): IndustrySignal | null {
  if (!isNum(assetIntensity)) return null;
  let word: string;
  let tone: IndustrySignalTone;
  let note: string;
  if (assetIntensity >= 0.9) {
    word = "heavy";
    tone = "bad";
    note = "It takes serious money on the floor before the first sale, so the entry bar and the downside are both high.";
  } else if (assetIntensity >= 0.45) {
    word = "moderate";
    tone = "flat";
    note = "Some fit-out and equipment is needed up front, enough to make the opening decision matter.";
  } else {
    word = "light";
    tone = "good";
    note = "The model is asset-light, so most of the money goes into running it, not into building it.";
  }
  return { label: "Capital to start", word, tone, note };
}

/**
 * What is left is the net margin itself, framed as the headline reality of how
 * much the owner actually keeps.
 */
function keepSignal(net: number | null): IndustrySignal | null {
  if (!isNum(net)) return null;
  let word: string;
  let tone: IndustrySignalTone;
  let note: string;
  if (net >= 0.15) {
    word = "healthy";
    tone = "good";
    note = `About ${pctWord(net)} of revenue survives to the bottom line in a typical year, which leaves real room.`;
  } else if (net >= 0.08) {
    word = "workable";
    tone = "flat";
    note = `Roughly ${pctWord(net)} of revenue reaches the bottom line, workable but not forgiving.`;
  } else {
    word = "thin";
    tone = "bad";
    note = `Only around ${pctWord(net)} of revenue reaches the bottom line, so a single bad call can erase the year.`;
  }
  return { label: "What the owner keeps", word, tone, note };
}

// ----------------------------------------------------------------------------
// headline: name the model from its margin shape
// ----------------------------------------------------------------------------

function headlineFor(margins: IndustryMarginShape): string {
  const gross = margins.grossMargin;
  const net = margins.netMargin;
  const asset = margins.assetIntensity;

  // The most useful one-line read pairs how much survives at the top (gross)
  // with how little tends to survive at the bottom (net), plus the capital bar.
  if (isNum(net) && net < 0.08) {
    if (isNum(gross) && gross >= 0.6) {
      return "High margin on paper, thin once the bills are paid";
    }
    return "A thin-margin business that punishes every mistake";
  }
  if (isNum(net) && net >= 0.15) {
    if (isNum(asset) && asset < 0.45) {
      return "Asset-light and genuinely profitable when run well";
    }
    return "A healthy-margin business, for an operator who runs it tight";
  }
  // Middle of the road.
  if (isNum(asset) && asset >= 0.9) {
    return "Capital-heavy, with a margin you have to earn back slowly";
  }
  return "Workable economics that reward discipline, not luck";
}

// ----------------------------------------------------------------------------
// public entry point
// ----------------------------------------------------------------------------

export function generateIndustryVerdict(
  input: IndustryVerdictInput,
): IndustryVerdict {
  const { margins, edge, watchOut } = input;

  // --- the anatomy signals, in money-flow order: top of the sale to bottom ---
  const signals: IndustrySignal[] = [];
  const input_ = inputLoadSignal(margins.grossMargin);
  if (input_) signals.push(input_);
  const overhead = overheadSignal(margins.grossMargin, margins.operatingMargin);
  if (overhead) signals.push(overhead);
  const capital = capitalSignal(margins.assetIntensity);
  if (capital) signals.push(capital);
  const keep = keepSignal(margins.netMargin);
  if (keep) signals.push(keep);

  const headline = headlineFor(margins);

  // --- lead: trace the money from the top of the sale to the bottom line ---
  const moneySentences: string[] = [];
  if (isNum(margins.grossMargin)) {
    const survives = pctWord(margins.grossMargin);
    if (margins.grossMargin >= 0.6) {
      moneySentences.push(
        `Each sale starts out rich: about ${survives} survives the direct cost of what is sold.`,
      );
    } else if (margins.grossMargin >= 0.4) {
      moneySentences.push(
        `Roughly ${survives} of each sale survives the direct cost of what is sold, so the raw inputs already set a real ceiling.`,
      );
    } else {
      moneySentences.push(
        `Only about ${survives} of each sale survives direct costs, so the inputs eat most of the money before anything else does.`,
      );
    }
  }
  if (isNum(margins.netMargin)) {
    if (isNum(margins.grossMargin) && margins.grossMargin - margins.netMargin >= 0.3) {
      moneySentences.push(
        `By the time staff, overhead, fixed costs, and tax are paid, roughly ${pctWord(
          margins.netMargin,
        )} of revenue is left, so the distance between the top line and the bottom line is where the business is really won or lost.`,
      );
    } else {
      moneySentences.push(
        `After overhead, fixed costs, and tax, roughly ${pctWord(
          margins.netMargin,
        )} of revenue reaches the bottom line.`,
      );
    }
  }
  if (isNum(margins.assetIntensity) && margins.assetIntensity >= 0.9) {
    moneySentences.push(
      "On top of that, the model needs real capital on the floor before it earns a cent, so the money is at risk earlier than in a service business.",
    );
  }

  const lead =
    moneySentences.length > 0
      ? moneySentences.join(" ")
      : `How ${input.industryName.toLowerCase()} makes money depends mostly on the operator. The structure here is read as a direction, not a benchmark; open a country to see the figures that exist.`;

  // --- close: what keeps weak operators from holding the margin ---
  let close: string;
  if (watchOut && watchOut.trim()) {
    // Reuse the activity-character risk verbatim where it exists; it is already
    // the bluntest, most specific statement of what kills the weak operator.
    close = `What quietly kills the weak operators: ${lower(clause(watchOut))}.`;
  } else if (edge && edge.trim()) {
    close = `The strong operators pull ahead on one thing: ${lower(clause(edge))}.`;
  } else if (isNum(margins.netMargin) && margins.netMargin < 0.08) {
    close =
      "With a margin this thin, the operators who fail are usually the ones who let one cost line drift. There is no slack to absorb it.";
  } else if (isNum(margins.assetIntensity) && margins.assetIntensity >= 0.9) {
    close =
      "The trap here is undercapitalising. The model looks fine until a slow stretch meets a fixed-asset bill, and the thin operators do not survive it.";
  } else {
    close =
      "It can work, but it is not idiot-proof. The operators who fail are usually the ones who treat a workable margin as a forgiving one.";
  }

  return { headline, lead, close, signals };
}
