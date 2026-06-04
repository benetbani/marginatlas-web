/**
 * src/lib/scores/country_verdict.ts
 *
 * The country-level opinionated lede (bible Section 5, the Country page row:
 * "Small business economics in [country]", with a friction-adjusted view).
 *
 * This is the country-altitude sibling of the cell-page verdict
 * (src/lib/scores/verdict.ts). Same voice, straight from the bible (Section
 * 25): blunt, practical, skeptical of easy money. The hard rule holds, never
 * frame the market as good without naming what gets in the way.
 *
 * It does NOT invent numbers. It only restates the figures and qualitative
 * words the country page already computes from the economics snapshot, the
 * SMB tax regime, and the densest local activity. Every clause self-omits
 * when its input is missing, so low-coverage countries degrade to a short,
 * honest paragraph instead of a fabricated one.
 *
 * Pure module: no Supabase, no other domain modules at runtime. Trivially
 * testable, and it cannot trip the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import type { CountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getGuidingWord } from "@/lib/cities/guiding_word";

export interface CountryVerdictInput {
  countryName: string;
  snapshot: CountryEconomicsSnapshot;
  /** Effective small-business tax burden as a decimal (0.18 = 18%), or null. */
  smbEffectiveRate: number | null;
  /** Standard VAT/GST rate as a decimal, or null. */
  vatStandard: number | null;
  /** The densest local activity, if the top-industries query returned one. */
  topActivity: { name: string; typicalRevenue: number | null } | null;
  /** Currency-aware money formatter supplied by the page. */
  fmt: (n: number) => string;
}

export interface CountrySignal {
  label: string;
  /** Qualitative word (e.g. "dense", "slow", "high"). */
  word: string;
  /** Direction for tone: good leans moss, bad leans clay, flat stays neutral. */
  tone: "good" | "flat" | "bad";
}

export interface CountryVerdict {
  /**
   * Two or three sentences: where the money tends to be, and the operating
   * reality that gets in the way of keeping it.
   */
  lead: string;
  /** Closing line: the condition under which a business works here. */
  close: string;
  /** Compact qualitative readout for the signals that were computable. */
  signals: CountrySignal[];
}

// ----------------------------------------------------------------------------
// goodness -> tone. The guiding-word system returns a 0..1 goodness encoded
// in colour; here we only need the coarse direction for the warm token tone.
// ----------------------------------------------------------------------------

function toneFromGoodness(goodness: number): CountrySignal["tone"] {
  if (goodness >= 0.7) return "good";
  if (goodness <= 0.3) return "bad";
  return "flat";
}

/**
 * Read a metric through the same break tables the stat tiles use, so the
 * word in the prose matches the word on the cards. Returns the descriptor
 * plus a coarse tone, or null when the value is missing.
 */
function readSignal(
  label: string,
  metric: Parameters<typeof getGuidingWord>[0],
  value: number | null,
  goodness: (v: number) => number,
): CountrySignal | null {
  if (value == null || !Number.isFinite(value)) return null;
  const { word } = getGuidingWord(metric, value);
  if (!word) return null;
  return { label, word, tone: toneFromGoodness(goodness(value)) };
}

// Goodness scoring mirrors the guiding-word break tables (operator's view).
function gdpGoodness(v: number): number {
  if (v >= 50000) return 1;
  if (v >= 25000) return 0.75;
  if (v >= 10000) return 0.5;
  if (v >= 3000) return 0.25;
  return 0;
}
function daysGoodness(v: number): number {
  if (v <= 1) return 1;
  if (v <= 7) return 0.75;
  if (v <= 21) return 0.5;
  if (v <= 60) return 0.25;
  return 0;
}
function inflationGoodness(v: number): number {
  if (v <= 0) return 0;
  if (v <= 2) return 0.5;
  if (v <= 5) return 1;
  if (v <= 10) return 0.5;
  if (v <= 25) return 0.25;
  return 0;
}
function selfEmpGoodness(): number {
  // Density is not strictly good or bad, so it always reads flat.
  return 0.5;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pctWord(decimal: number): string {
  const pct = decimal * 100;
  if (Math.abs(pct - Math.round(pct)) < 0.1) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1)}%`;
}

// ----------------------------------------------------------------------------
// public entry point
// ----------------------------------------------------------------------------

export function generateCountryVerdict(
  input: CountryVerdictInput,
): CountryVerdict {
  const { countryName, snapshot, smbEffectiveRate, vatStandard, topActivity, fmt } =
    input;

  // --- signals (for the compact readout under the lede) ---
  const signals: CountrySignal[] = [];
  const gdp = readSignal(
    "Customer spending power",
    "gdp_per_capita_usd_yr",
    snapshot.gdpPerCapita,
    gdpGoodness,
  );
  if (gdp) signals.push(gdp);
  const density = readSignal(
    "Local operator density",
    "self_employment_pct",
    snapshot.selfEmploymentPct,
    selfEmpGoodness,
  );
  if (density) signals.push(density);
  const launch = readSignal(
    "Time to get going",
    "days_to_start",
    snapshot.daysToStart,
    daysGoodness,
  );
  if (launch) signals.push(launch);
  const inflation = readSignal(
    "Price stability",
    "inflation_pct_yoy",
    snapshot.inflationPctYoy,
    inflationGoodness,
  );
  if (inflation) signals.push(inflation);

  // --- lead sentence 1: where the money tends to be ---
  const moneySentences: string[] = [];
  if (topActivity && topActivity.typicalRevenue != null) {
    moneySentences.push(
      `The densest small-business activity here is ${topActivity.name.toLowerCase()}, where the typical firm turns over about ${fmt(
        topActivity.typicalRevenue,
      )} a year.`,
    );
  } else if (topActivity) {
    moneySentences.push(
      `The densest small-business activity here is ${topActivity.name.toLowerCase()}.`,
    );
  }

  // Customer-base reality: spending power and savings depth set the ceiling.
  if (gdp) {
    const savings = snapshot.netWealthPerAdult;
    if (savings != null && Number.isFinite(savings)) {
      const { word: savingsWord } = getGuidingWord(
        "net_wealth_usd_adult",
        savings,
      );
      moneySentences.push(
        `Customer spending power is ${gdp.word}, and household savings run ${savingsWord}, so that is the ceiling on what people here can pay.`,
      );
    } else {
      moneySentences.push(
        `Customer spending power is ${gdp.word}, which sets the ceiling on what people here can pay.`,
      );
    }
  }

  // --- lead sentence(s) 2: the friction that gets in the way ---
  const frictionClauses: string[] = [];
  if (vatStandard != null && vatStandard > 0) {
    frictionClauses.push(
      `sales tax adds ${pctWord(vatStandard)} to every order`,
    );
  }
  if (smbEffectiveRate != null && smbEffectiveRate > 0) {
    frictionClauses.push(
      `the typical small-business tax takes roughly ${pctWord(
        smbEffectiveRate,
      )} of what is left`,
    );
  }
  if (launch && (launch.tone === "bad" || launch.tone === "flat")) {
    frictionClauses.push(`getting registered is ${launch.word}`);
  }
  if (inflation && inflation.tone === "bad") {
    frictionClauses.push(`prices are moving ${inflation.word}`);
  }
  if (
    density &&
    (snapshot.selfEmploymentPct ?? 0) >= 35 &&
    density.word
  ) {
    frictionClauses.push(`the market is ${density.word} with solo operators`);
  }

  let frictionSentence = "";
  if (frictionClauses.length === 1) {
    frictionSentence = `What gets in the way: ${frictionClauses[0]}.`;
  } else if (frictionClauses.length >= 2) {
    const last = frictionClauses[frictionClauses.length - 1];
    const head = frictionClauses.slice(0, -1).join(", ");
    frictionSentence = `What gets in the way: ${head}, and ${last}.`;
  }

  const leadParts = [...moneySentences];
  if (frictionSentence) leadParts.push(frictionSentence);
  const lead =
    leadParts.length > 0
      ? leadParts.join(" ")
      : `Coverage for ${countryName} is still thin. Read what follows as a direction, not a benchmark, and open a specific activity for the numbers that exist.`;

  // --- closing line: the condition under which it works ---
  const heavyTax =
    (smbEffectiveRate ?? 0) + (vatStandard ?? 0) >= 0.4 &&
    smbEffectiveRate != null &&
    vatStandard != null;
  const saturated = (snapshot.selfEmploymentPct ?? 0) >= 45;
  const highInflation = (snapshot.inflationPctYoy ?? 0) > 10;

  let close: string;
  if (highInflation) {
    close = `Pick the activity and the location with care. With prices moving this fast, the businesses that hold up are the ones that can reprice quickly and do not carry much fixed cost.`;
  } else if (saturated) {
    close = `Pick the activity and the location with care. In a market this crowded, a plain copy of what everyone else runs competes only on price, which is the fastest way to give the margin back.`;
  } else if (heavyTax) {
    close = `Pick the activity and the location with care. With the tax load this heavy, the numbers only work above a real revenue threshold, not at hobby scale.`;
  } else {
    close = `Pick the activity and the location with care. The country sets the conditions, but the operator and the address decide whether a given business actually clears a wage.`;
  }

  return { lead, close, signals };
}
