/**
 * guiding_word - per-metric break tables that map a value to a
 * one-word descriptor + a continuous dark-red-to-dark-green color.
 *
 * Per founder spec (CitiesFix2 sec 7): every city stat card on the
 * hero shows the number AND a short word (e.g. "HDI 0.735, medium")
 * with the word's color picked from a 5-stop gradient based on how
 * good the value is for that metric.
 *
 * INVERTED metrics (Gini, unemployment): high values are bad. The
 * gradient direction flips so low values are dark green.
 *
 * NEUTRAL metrics (population, GDP, tourism): there is no good/bad,
 * just size. We use a size-descriptor gradient (small/mid/large/mega)
 * with a neutral atlas tone, NOT the red-to-green palette.
 */

export type Metric =
  | "metro_pop_m"
  | "metro_gdp_b"
  | "gross_salary_usd_mo"
  | "hdi"
  | "gini"
  | "cost_of_living_index"
  | "unemployment_pct"
  | "tourist_arrivals_m";

// Gradient stops in HSL for interpolation, 0.0 = "very bad" to 1.0 = "very good".
const GRADIENT_STOPS: Array<[number, string]> = [
  [0.0, "#7F1D1D"], // dark red
  [0.25, "#DC2626"], // red
  [0.5, "#CA8A04"], // amber
  [0.75, "#16A34A"], // green
  [1.0, "#14532D"], // dark green
];

// Break tables. Each is ordered low-to-high VALUE; the descriptor and the
// 0-to-1 gradient position are picked based on which break the value
// crosses. inverted = true means high values are bad (red end).
type Break = { upTo: number; word: string; goodness: number };
type Spec = { breaks: Break[]; inverted?: boolean; neutral?: boolean };

const SPECS: Record<Metric, Spec> = {
  // Neutral size descriptors. Use a quiet atlas tone, not red-to-green.
  metro_pop_m: {
    neutral: true,
    breaks: [
      { upTo: 0.5, word: "tiny", goodness: 0 },
      { upTo: 3, word: "small", goodness: 0 },
      { upTo: 10, word: "mid-sized", goodness: 0 },
      { upTo: 20, word: "large", goodness: 0 },
      { upTo: Infinity, word: "mega", goodness: 0 },
    ],
  },
  metro_gdp_b: {
    neutral: true,
    breaks: [
      { upTo: 20, word: "tiny", goodness: 0 },
      { upTo: 100, word: "small", goodness: 0 },
      { upTo: 500, word: "mid-sized", goodness: 0 },
      { upTo: 1500, word: "large", goodness: 0 },
      { upTo: Infinity, word: "powerhouse", goodness: 0 },
    ],
  },
  tourist_arrivals_m: {
    neutral: true,
    breaks: [
      { upTo: 1, word: "niche", goodness: 0 },
      { upTo: 5, word: "popular", goodness: 0 },
      { upTo: 15, word: "tourist hub", goodness: 0 },
      { upTo: 30, word: "magnet", goodness: 0 },
      { upTo: Infinity, word: "global magnet", goodness: 0 },
    ],
  },

  // Salary, HDI: higher = better.
  gross_salary_usd_mo: {
    breaks: [
      { upTo: 500, word: "very low", goodness: 0 },
      { upTo: 1200, word: "low", goodness: 0.25 },
      { upTo: 2500, word: "modest", goodness: 0.5 },
      { upTo: 5000, word: "comfortable", goodness: 0.75 },
      { upTo: Infinity, word: "high", goodness: 1.0 },
    ],
  },
  hdi: {
    breaks: [
      { upTo: 0.55, word: "very low", goodness: 0 },
      { upTo: 0.7, word: "low", goodness: 0.25 },
      { upTo: 0.8, word: "medium", goodness: 0.5 },
      { upTo: 0.9, word: "high", goodness: 0.75 },
      { upTo: Infinity, word: "very high", goodness: 1.0 },
    ],
  },

  // Gini, unemployment: lower = better (INVERTED).
  gini: {
    inverted: true,
    breaks: [
      { upTo: 28, word: "low", goodness: 1.0 },
      { upTo: 35, word: "moderate", goodness: 0.75 },
      { upTo: 45, word: "high", goodness: 0.5 },
      { upTo: 55, word: "very high", goodness: 0.25 },
      { upTo: Infinity, word: "extreme", goodness: 0 },
    ],
  },
  unemployment_pct: {
    inverted: true,
    breaks: [
      { upTo: 4, word: "low", goodness: 1.0 },
      { upTo: 6, word: "moderate", goodness: 0.75 },
      { upTo: 10, word: "elevated", goodness: 0.5 },
      { upTo: 15, word: "high", goodness: 0.25 },
      { upTo: Infinity, word: "very high", goodness: 0 },
    ],
  },

  // Cost of living: not strictly good/bad; we read it as "expensive vs
  // cheap" and treat very expensive as bad (operator's perspective).
  cost_of_living_index: {
    inverted: true,
    breaks: [
      { upTo: 40, word: "very cheap", goodness: 1.0 },
      { upTo: 60, word: "cheap", goodness: 0.75 },
      { upTo: 85, word: "moderate", goodness: 0.5 },
      { upTo: 120, word: "expensive", goodness: 0.25 },
      { upTo: Infinity, word: "very expensive", goodness: 0 },
    ],
  },
};

function lerpHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 0xff;
  const ag = (pa >> 8) & 0xff;
  const ab = pa & 0xff;
  const br = (pb >> 16) & 0xff;
  const bg = (pb >> 8) & 0xff;
  const bb = pb & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, "0")}`;
}

function colorAt(goodness: number): string {
  const clamped = Math.max(0, Math.min(1, goodness));
  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const [g0, c0] = GRADIENT_STOPS[i];
    const [g1, c1] = GRADIENT_STOPS[i + 1];
    if (clamped >= g0 && clamped <= g1) {
      const t = (clamped - g0) / (g1 - g0);
      return lerpHex(c0, c1, t);
    }
  }
  return GRADIENT_STOPS[GRADIENT_STOPS.length - 1][1];
}

const NEUTRAL_COLOR = "#6F4E1F"; // muted atlas brown for neutral descriptors

export type GuidingWord = { word: string; color: string };

export function getGuidingWord(metric: Metric, value: number): GuidingWord {
  const spec = SPECS[metric];
  if (!spec) return { word: "", color: NEUTRAL_COLOR };
  for (const b of spec.breaks) {
    if (value <= b.upTo) {
      return {
        word: b.word,
        color: spec.neutral ? NEUTRAL_COLOR : colorAt(b.goodness),
      };
    }
  }
  const last = spec.breaks[spec.breaks.length - 1];
  return {
    word: last.word,
    color: spec.neutral ? NEUTRAL_COLOR : colorAt(last.goodness),
  };
}
